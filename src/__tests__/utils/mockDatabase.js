// Mock 数据库帮助器 - 用于测试 Repository 层
// 使用内存中的简单对象模拟 better-sqlite3 的行为

class MockStatement {
  constructor(result, runResult) {
    this.result = result;
    this.runResult = runResult || { changes: 1, lastInsertRowid: 1 };
  }

  all(...params) {
    if (typeof this.result === 'function') {
      return this.result(...params);
    }
    return this.result;
  }

  get(...params) {
    if (typeof this.result === 'function') {
      const results = this.result(...params);
      return Array.isArray(results) ? results[0] : results;
    }
    return Array.isArray(this.result) ? this.result[0] : this.result;
  }

  run(...params) {
    if (typeof this.runResult === 'function') {
      return this.runResult(...params);
    }
    return this.runResult;
  }
}

class MockDatabase {
  constructor() {
    this.tables = {
      contacts: [],
      companies: [],
      deals: [],
      tasks: [],
      activities: [],
    };
    this.idCounter = 1;
  }

  prepare(sql) {
    // 简单的 SQL 解析来模拟数据库操作
    const sqlLower = sql.toLowerCase();

    if (sqlLower.includes('select')) {
      // 解析表名
      let tableName = '';
      for (const table of Object.keys(this.tables)) {
        if (sqlLower.includes(table)) {
          tableName = table;
          break;
        }
      }

      return new MockStatement(() => {
        if (!tableName || !this.tables[tableName]) return [];
        return [...this.tables[tableName]];
      });
    }

    if (sqlLower.includes('insert')) {
      let tableName = '';
      for (const table of Object.keys(this.tables)) {
        if (sqlLower.includes(table)) {
          tableName = table;
          break;
        }
      }

      return new MockStatement(null, () => {
        const id = this.idCounter++;
        this.tables[tableName].push({ id, ...arguments[0] });
        return { changes: 1, lastInsertRowid: id };
      });
    }

    if (sqlLower.includes('update')) {
      let tableName = '';
      for (const table of Object.keys(this.tables)) {
        if (sqlLower.includes(table)) {
          tableName = table;
          break;
        }
      }

      return new MockStatement(null, (id, ...values) => {
        const index = this.tables[tableName].findIndex(item => item.id === id);
        if (index !== -1) {
          this.tables[tableName][index] = { ...this.tables[tableName][index], ...arguments[0] };
          return { changes: 1 };
        }
        return { changes: 0 };
      });
    }

    if (sqlLower.includes('delete')) {
      let tableName = '';
      for (const table of Object.keys(this.tables)) {
        if (sqlLower.includes(table)) {
          tableName = table;
          break;
        }
      }

      return new MockStatement(null, (id) => {
        const index = this.tables[tableName].findIndex(item => item.id === id);
        if (index !== -1) {
          this.tables[tableName].splice(index, 1);
          return { changes: 1 };
        }
        return { changes: 0 };
      });
    }

    return new MockStatement([]);
  }

  // 辅助方法添加测试数据
  addContact(contact) {
    const id = contact.id || this.idCounter++;
    this.tables.contacts.push({ ...contact, id });
    return id;
  }

  addCompany(company) {
    const id = company.id || this.idCounter++;
    this.tables.companies.push({ ...company, id });
    return id;
  }

  addDeal(deal) {
    const id = deal.id || this.idCounter++;
    this.tables.deals.push({ ...deal, id });
    return id;
  }

  addTask(task) {
    const id = task.id || this.idCounter++;
    this.tables.tasks.push({ ...task, id });
    return id;
  }

  addActivity(activity) {
    const id = activity.id || this.idCounter++;
    this.tables.activities.push({ ...activity, id });
    return id;
  }

  clear() {
    Object.keys(this.tables).forEach(key => {
      this.tables[key] = [];
    });
    this.idCounter = 1;
  }

  getTable(tableName) {
    return [...this.tables[tableName]];
  }
}

// 创建全局 mock 实例
const mockDb = new MockDatabase();

// Mock dbManager
const mockDbManager = {
  getDb: () => mockDb,
  init: jest.fn(),
  close: jest.fn(),
  runMigrations: jest.fn(),
};

// Mock logger
const mockLogger = {
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

module.exports = {
  MockDatabase,
  MockStatement,
  mockDb,
  mockDbManager,
  mockLogger,
};
