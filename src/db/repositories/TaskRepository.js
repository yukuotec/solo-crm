const { dbManager } = require('./database');
const { mainLogger } = require('../main/logger');

const LOG_PREFIX = '[TaskRepository]';

class TaskRepository {
  constructor() {
    this.tableName = 'tasks';
  }

  findAll() {
    mainLogger.debug(`${LOG_PREFIX} Finding all tasks`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT t.*,
        c.name as contact_name,
        d.title as deal_title
      FROM ${this.tableName} t
      LEFT JOIN contacts c ON t.contact_id = c.id
      LEFT JOIN deals d ON t.deal_id = d.id
      ORDER BY t.due_date ASC, t.priority DESC
    `);
    return stmt.all();
  }

  findById(id) {
    mainLogger.debug(`${LOG_PREFIX} Finding task by id: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT t.*,
        c.name as contact_name,
        d.title as deal_title
      FROM ${this.tableName} t
      LEFT JOIN contacts c ON t.contact_id = c.id
      LEFT JOIN deals d ON t.deal_id = d.id
      WHERE t.id = ?
    `);
    return stmt.get(id);
  }

  findByStatus(status) {
    mainLogger.debug(`${LOG_PREFIX} Finding tasks with status: ${status}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT * FROM ${this.tableName}
      WHERE status = ?
      ORDER BY due_date ASC
    `);
    return stmt.all(status);
  }

  findUpcoming(days = 7) {
    mainLogger.debug(`${LOG_PREFIX} Finding upcoming tasks (next ${days} days)`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT t.*,
        c.name as contact_name,
        d.title as deal_title
      FROM ${this.tableName} t
      LEFT JOIN contacts c ON t.contact_id = c.id
      LEFT JOIN deals d ON t.deal_id = d.id
      WHERE t.status = 'pending'
        AND t.due_date >= date('now')
        AND t.due_date <= date('now', '+' || ? || ' days')
      ORDER BY t.due_date ASC, t.priority DESC
    `);
    return stmt.all(days);
  }

  findOverdue() {
    mainLogger.debug(`${LOG_PREFIX} Finding overdue tasks`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      SELECT t.*,
        c.name as contact_name,
        d.title as deal_title
      FROM ${this.tableName} t
      LEFT JOIN contacts c ON t.contact_id = c.id
      LEFT JOIN deals d ON t.deal_id = d.id
      WHERE t.status = 'pending'
        AND t.due_date < date('now')
      ORDER BY t.due_date ASC
    `);
    return stmt.all();
  }

  create(data) {
    mainLogger.info(`${LOG_PREFIX} Creating task: ${data.title}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`
      INSERT INTO ${this.tableName} (title, description, due_date, priority, status, contact_id, deal_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.title,
      data.description || null,
      data.due_date || null,
      data.priority || 'medium',
      data.status || 'pending',
      data.contact_id || null,
      data.deal_id || null
    );
    return this.findById(result.lastInsertRowid);
  }

  update(id, data) {
    mainLogger.info(`${LOG_PREFIX} Updating task: ${id}`);
    const db = dbManager.getDb();
    const fields = [];
    const values = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.due_date !== undefined) {
      fields.push('due_date = ?');
      values.push(data.due_date);
    }
    if (data.priority !== undefined) {
      fields.push('priority = ?');
      values.push(data.priority);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }
    if (data.contact_id !== undefined) {
      fields.push('contact_id = ?');
      values.push(data.contact_id);
    }
    if (data.deal_id !== undefined) {
      fields.push('deal_id = ?');
      values.push(data.deal_id);
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
    mainLogger.info(`${LOG_PREFIX} Deleting task: ${id}`);
    const db = dbManager.getDb();
    const stmt = db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    return stmt.run(id);
  }
}

module.exports = { TaskRepository };
