const { dbManager } = require('../database');
const { mainLogger } = require('../../main/logger');

const LOG_PREFIX = '[ActivityRepository]';

const ACTIVITY_TYPES = ['call', 'meeting', 'email', 'note', 'other'];

class ActivityRepository {
  constructor() {
    this.tableName = 'activities';
  }

  findAll() {
    mainLogger.debug(`${LOG_PREFIX} Finding all activities`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT a.*,
        c.name as contact_name,
        d.title as deal_title
      FROM ${this.tableName} a
      LEFT JOIN contacts c ON a.contact_id = c.id
      LEFT JOIN deals d ON a.deal_id = d.id
      ORDER BY a.date DESC
      LIMIT 100
    `);
    return stmt.all();
  }

  findById(id) {
    mainLogger.debug(`${LOG_PREFIX} Finding activity by id: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT a.*,
        c.name as contact_name,
        d.title as deal_title
      FROM ${this.tableName} a
      LEFT JOIN contacts c ON a.contact_id = c.id
      LEFT JOIN deals d ON a.deal_id = d.id
      WHERE a.id = ?
    `);
    return stmt.get(id);
  }

  findByContact(contactId) {
    mainLogger.debug(`${LOG_PREFIX} Finding activities for contact: ${contactId}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT a.*, d.title as deal_title
      FROM ${this.tableName} a
      LEFT JOIN deals d ON a.deal_id = d.id
      WHERE a.contact_id = ?
      ORDER BY a.date DESC
    `);
    return stmt.all(contactId);
  }

  findByDeal(dealId) {
    mainLogger.debug(`${LOG_PREFIX} Finding activities for deal: ${dealId}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT a.*, c.name as contact_name
      FROM ${this.tableName} a
      LEFT JOIN contacts c ON a.contact_id = c.id
      WHERE a.deal_id = ?
      ORDER BY a.date DESC
    `);
    return stmt.all(dealId);
  }

  findByType(type) {
    mainLogger.debug(`${LOG_PREFIX} Finding activities of type: ${type}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT * FROM ${this.tableName}
      WHERE type = ?
      ORDER BY date DESC
      LIMIT 50
    `);
    return stmt.all(type);
  }

  getRecent(limit = 20) {
    mainLogger.debug(`${LOG_PREFIX} Getting recent activities (limit: ${limit})`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT a.*,
        c.name as contact_name,
        d.title as deal_title
      FROM ${this.tableName} a
      LEFT JOIN contacts c ON a.contact_id = c.id
      LEFT JOIN deals d ON a.deal_id = d.id
      ORDER BY a.date DESC
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  create(data) {
    mainLogger.info(`${LOG_PREFIX} Creating activity: ${data.type}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      INSERT INTO ${this.tableName} (type, date, contact_id, deal_id, notes)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.type,
      data.date || new Date().toISOString(),
      data.contact_id || null,
      data.deal_id || null,
      data.notes || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    mainLogger.info(`${LOG_PREFIX} Updating activity: ${id}`);
    const db = dbManager.getDb();
    const fields = [];
    const values = [];

    if (data.type !== undefined) {
      fields.push('type = ?');
      values.push(data.type);
    }
    if (data.date !== undefined) {
      fields.push('date = ?');
      values.push(data.date);
    }
    if (data.contact_id !== undefined) {
      fields.push('contact_id = ?');
      values.push(data.contact_id);
    }
    if (data.deal_id !== undefined) {
      fields.push('deal_id = ?');
      values.push(data.deal_id);
    }
    if (data.notes !== undefined) {
      fields.push('notes = ?');
      values.push(data.notes);
    }

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
    mainLogger.info(`${LOG_PREFIX} Deleting activity: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    return stmt.run(id);
  }
}

module.exports = { ActivityRepository, ACTIVITY_TYPES };
