const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

const { mainLogger } = require('../main/logger');

const LOG_PREFIX = '[DB]';

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = null;
  }

  init() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'crm.db');

    mainLogger.info(`${LOG_PREFIX} Initializing database at ${this.dbPath}`);

    // Ensure directory exists
    const dbDir = path.dirname(this.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    this.db.pragma('journal_mode = WAL');

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');

    mainLogger.info(`${LOG_PREFIX} Database initialized successfully`);
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      mainLogger.info(`${LOG_PREFIX} Database closed`);
    }
  }

  // Run migrations
  runMigrations() {
    mainLogger.info(`${LOG_PREFIX} Running migrations...`);

    const migrationsTable = `
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.exec(migrationsTable);

    // Get already executed migrations
    const getExecuted = this.db.prepare('SELECT name FROM _migrations ORDER BY id');
    const executedMigrations = new Set(getExecuted.all().map(m => m.name));

    // Define migrations
    const migrations = [
      {
        name: '001_initial_schema',
        sql: `
          -- Contacts
          CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            company_id INTEGER,
            tags TEXT DEFAULT '',
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
          );

          -- Companies
          CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            website TEXT,
            industry TEXT,
            address TEXT,
            phone TEXT,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          );

          -- Deals
          CREATE TABLE IF NOT EXISTS deals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            contact_id INTEGER,
            company_id INTEGER,
            stage TEXT DEFAULT 'lead',
            value REAL DEFAULT 0,
            probability INTEGER DEFAULT 0,
            close_date DATE,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
          );

          -- Tasks
          CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            due_date DATE,
            priority TEXT DEFAULT 'medium',
            status TEXT DEFAULT 'pending',
            contact_id INTEGER,
            deal_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
            FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL
          );

          -- Activities
          CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            date DATETIME DEFAULT CURRENT_TIMESTAMP,
            contact_id INTEGER,
            deal_id INTEGER,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
            FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE CASCADE
          );

          -- Indexes for better search performance
          CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);
          CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
          CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
          CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
          CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
          CREATE INDEX IF NOT EXISTS idx_deals_contact ON deals(contact_id);
          CREATE INDEX IF NOT EXISTS idx_deals_company ON deals(company_id);
          CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
          CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
          CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
          CREATE INDEX IF NOT EXISTS idx_activities_contact ON activities(contact_id);
          CREATE INDEX IF NOT EXISTS idx_activities_deal ON activities(deal_id);
        `,
      },
    ];

    // Run pending migrations
    const insertMigration = this.db.prepare(
      'INSERT INTO _migrations (name) VALUES (?)'
    );

    for (const migration of migrations) {
      if (!executedMigrations.has(migration.name)) {
        mainLogger.info(`${LOG_PREFIX} Running migration: ${migration.name}`);
        this.db.exec(migration.sql);
        insertMigration.run(migration.name);
      }
    }

    mainLogger.info(`${LOG_PREFIX} All migrations completed successfully`);
  }
}

// Singleton instance
const dbManager = new DatabaseManager();

module.exports = { dbManager };
