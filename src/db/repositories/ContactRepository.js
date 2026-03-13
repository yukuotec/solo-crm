const { dbManager } = require('../database');
const { mainLogger } = require('../../main/logger');

const LOG_PREFIX = '[ContactRepository]';

class ContactRepository {
  constructor() {
    this.tableName = 'contacts';
  }

  findAll() {
    mainLogger.debug(`${LOG_PREFIX} Finding all contacts`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT c.*, co.name as company_name
      FROM ${this.tableName} c
      LEFT JOIN companies co ON c.company_id = co.id
      ORDER BY c.name COLLATE NOCASE
    `);
    return stmt.all();
  }

  findById(id) {
    mainLogger.debug(`${LOG_PREFIX} Finding contact by id: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT c.*, co.name as company_name, co.website as company_website
      FROM ${this.tableName} c
      LEFT JOIN companies co ON c.company_id = co.id
      WHERE c.id = ?
    `);
    return stmt.get(id);
  }

  findByCompany(companyId) {
    mainLogger.debug(`${LOG_PREFIX} Finding contacts for company: ${companyId}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT * FROM ${this.tableName}
      WHERE company_id = ?
      ORDER BY name COLLATE NOCASE
    `);
    return stmt.all(companyId);
  }

  search(query) {
    mainLogger.debug(`${LOG_PREFIX} Searching contacts: ${query}`);
    const db = dbManager.getDb();
    const searchTerm = `%${query}%`;
    const stmt = db.prepare(`
      SELECT * FROM ${this.tableName}
      WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
      ORDER BY name COLLATE NOCASE
    `);
    return stmt.all(searchTerm, searchTerm, searchTerm);
  }

  create(data) {
    mainLogger.info(`${LOG_PREFIX} Creating contact: ${data.name}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      INSERT INTO ${this.tableName} (name, email, phone, company_id, tags, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.name,
      data.email || null,
      data.phone || null,
      data.company_id || null,
      data.tags || '',
      data.notes || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    mainLogger.info(`${LOG_PREFIX} Updating contact: ${id}`);
    const db = dbManager.getDb();
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone);
    }
    if (data.company_id !== undefined) {
      fields.push('company_id = ?');
      values.push(data.company_id);
    }
    if (data.tags !== undefined) {
      fields.push('tags = ?');
      values.push(data.tags);
    }
    if (data.notes !== undefined) {
      fields.push('notes = ?');
      values.push(data.notes);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE ${this.tableName}
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    stmt.run(...values);
    return this.findById(id);
  }

  delete(id) {
    mainLogger.info(`${LOG_PREFIX} Deleting contact: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    return stmt.run(id);
  }
}

module.exports = { ContactRepository };
