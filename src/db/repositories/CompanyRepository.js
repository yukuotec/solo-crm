const { dbManager } = require('./database');
const { mainLogger } = require('../main/logger');

const LOG_PREFIX = '[CompanyRepository]';

class CompanyRepository {
  constructor() {
    this.tableName = 'companies';
  }

  findAll() {
    mainLogger.debug(`${LOG_PREFIX} Finding all companies`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT *,
        (SELECT COUNT(*) FROM contacts WHERE company_id = companies.id) as contact_count
      FROM ${this.tableName}
      ORDER BY name COLLATE NOCASE
    `);
    return stmt.all();
  }

  findById(id) {
    mainLogger.debug(`${LOG_PREFIX} Finding company by id: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT *,
        (SELECT COUNT(*) FROM contacts WHERE company_id = companies.id) as contact_count
      FROM ${this.tableName}
      WHERE id = ?
    `);
    return stmt.get(id);
  }

  search(query) {
    mainLogger.debug(`${LOG_PREFIX} Searching companies: ${query}`);
    const db = dbManager.getDb();
    const searchTerm = `%${query}%`;
    const stmt = db.prepare(`
      SELECT * FROM ${this.tableName}
      WHERE name LIKE ? OR website LIKE ? OR industry LIKE ?
      ORDER BY name COLLATE NOCASE
    `);
    return stmt.all(searchTerm, searchTerm, searchTerm);
  }

  create(data) {
    mainLogger.info(`${LOG_PREFIX} Creating company: ${data.name}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      INSERT INTO ${this.tableName} (name, website, industry, address, phone, notes)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.name,
      data.website || null,
      data.industry || null,
      data.address || null,
      data.phone || null,
      data.notes || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    mainLogger.info(`${LOG_PREFIX} Updating company: ${id}`);
    const db = dbManager.getDb();
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.website !== undefined) {
      fields.push('website = ?');
      values.push(data.website);
    }
    if (data.industry !== undefined) {
      fields.push('industry = ?');
      values.push(data.industry);
    }
    if (data.address !== undefined) {
      fields.push('address = ?');
      values.push(data.address);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone);
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
    mainLogger.info(`${LOG_PREFIX} Deleting company: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    return stmt.run(id);
  }
}

module.exports = { CompanyRepository };
