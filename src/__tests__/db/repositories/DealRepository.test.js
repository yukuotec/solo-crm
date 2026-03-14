/**
 * DealRepository 测试
 */

// 创建 mock
const mockDb = { tables: { deals: [] } };
const mockDbManager = { getDb: jest.fn(() => mockDb) };
const mockLogger = { info: jest.fn(), debug: jest.fn(), error: jest.fn() };

jest.mock('../../../src/db/database', () => ({ dbManager: mockDbManager }));
jest.mock('../../../src/main/logger', () => ({ mainLogger: mockLogger }));

const { DealRepository } = require('../../../src/db/repositories/DealRepository');

describe('DealRepository', () => {
  let repository;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb.tables.deals = [];
    repository = new DealRepository();
  });

  test('应该能创建实例', () => {
    expect(repository).toBeDefined();
    expect(repository.tableName).toBe('deals');
  });

  test('findAll 应该返回空数组当数据库为空', () => {
    mockDb.prepare = jest.fn(() => ({ all: jest.fn(() => []) }));
    const result = repository.findAll();
    expect(result).toEqual([]);
  });

  test('create 应该调用数据库插入', () => {
    mockDb.prepare = jest.fn()
      .mockReturnValueOnce({ run: jest.fn(() => ({ lastInsertRowid: 1 })) })
      .mockReturnValueOnce({ get: jest.fn(() => ({ id: 1, name: '张三' })) });
    
    const result = repository.create({ name: '张三' });
    expect(result).toBeDefined();
  });
});
