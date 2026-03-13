const { dbManager } = require('./database');
const { mainLogger } = require('../main/logger');

const LOG_PREFIX = '[DealRepository]';

const DEAL_STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

class DealRepository {
  constructor() {
    this.tableName = 'deals';
  }

  findAll() {
    mainLogger.debug(`${LOG_PREFIX} Finding all deals`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT d.*,
        c.name as contact_name,
        co.name as company_name,
        (d.value * d.probability / 100) as weighted_value
      FROM ${this.tableName} d
      LEFT JOIN contacts c ON d.contact_id = c.id
      LEFT JOIN companies co ON d.company_id = co.id
      ORDER BY d.created_at DESC
    `);
    return stmt.all();
  }

  findById(id) {
    mainLogger.debug(`${LOG_PREFIX} Finding deal by id: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT d.*,
        c.name as contact_name, c.email as contact_email,
        co.name as company_name, co.website as company_website,
        (d.value * d.probability / 100) as weighted_value
      FROM ${this.tableName} d
      LEFT JOIN contacts c ON d.contact_id = c.id
      LEFT JOIN companies co ON d.company_id = co.id
      WHERE d.id = ?
    `);
    return stmt.get(id);
  }

  findByStage(stage) {
    mainLogger.debug(`${LOG_PREFIX} Finding deals for stage: ${stage}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT * FROM ${this.tableName}
      WHERE stage = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(stage);
  }

  getPipelineSummary() {
    mainLogger.debug(`${LOG_PREFIX} Getting pipeline summary`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT stage,
        COUNT(*) as count,
        SUM(value) as total_value,
        SUM(value * probability / 100) as weighted_value
      FROM ${this.tableName}
      WHERE stage NOT IN ('closed_won', 'closed_lost')
      GROUP BY stage
      ORDER BY
        CASE stage
          WHEN 'lead' THEN 1
          WHEN 'qualified' THEN 2
          WHEN 'proposal' THEN 3
          WHEN 'negotiation' THEN 4
          ELSE 5
        END
    `);
    return stmt.all();
  }

  search(query) {
    mainLogger.debug(`${LOG_PREFIX} Searching deals: ${query}`);
    const db = dbManager.getDb();
    const searchTerm = `%${query}%`;
    const stmt = db.prepare(`
      SELECT d.*, c.name as contact_name, co.name as company_name
      FROM ${this.tableName} d
      LEFT JOIN contacts c ON d.contact_id = c.id
      LEFT JOIN companies co ON d.company_id = co.id
      WHERE d.title LIKE ?
      ORDER BY d.created_at DESC
    `);
    return stmt.all(searchTerm);
  }

  create(data) {
    mainLogger.info(`${LOG_PREFIX} Creating deal: ${data.title}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      INSERT INTO ${this.tableName} (title, contact_id, company_id, stage, value, probability, close_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.title,
      data.contact_id || null,
      data.company_id || null,
      data.stage || 'lead',
      data.value || 0,
      data.probability || 0,
      data.close_date || null,
      data.notes || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    mainLogger.info(`${LOG_PREFIX} Updating deal: ${id}`);
    const db = dbManager.getDb();
    const fields = [];
    const values = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.contact_id !== undefined) {
      fields.push('contact_id = ?');
      values.push(data.contact_id);
    }
    if (data.company_id !== undefined) {
      fields.push('company_id = ?');
      values.push(data.company_id);
    }
    if (data.stage !== undefined) {
      fields.push('stage = ?');
      values.push(data.stage);
    }
    if (data.value !== undefined) {
      fields.push('value = ?');
      values.push(data.value);
    }
    if (data.probability !== undefined) {
      fields.push('probability = ?');
      values.push(data.probability);
    }
    if (data.close_date !== undefined) {
      fields.push('close_date = ?');
      values.push(data.close_date);
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
    mainLogger.info(`${LOG_PREFIX} Deleting deal: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    return stmt.run(id);
  }
}

module.exports = { DealRepository, DEAL_STAGES };
