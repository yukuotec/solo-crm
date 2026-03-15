/**
 * IPC Handlers 集成测试
 * 测试所有 CRUD 操作和错误处理
 */

const { ipcMain } = require('electron');

// 创建 mock 数据库和日志
const mockDb = {
  tables: {
    contacts: [],
    companies: [],
    deals: [],
    tasks: [],
    activities: [],
  },
  idCounter: 1,
};

const mockDbManager = {
  getDb: jest.fn(() => mockDb),
  init: jest.fn(),
  close: jest.fn(),
  runMigrations: jest.fn(),
};

const mockLogger = {
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// 创建仓库 mock 实例
const mockContactRepo = {
  findAll: jest.fn(() => []),
  findById: jest.fn((id) => mockDb.tables.contacts.find(c => c.id === id) || null),
  create: jest.fn((data) => {
    const id = mockDb.idCounter++;
    const contact = { id, ...data };
    mockDb.tables.contacts.push(contact);
    return contact;
  }),
  update: jest.fn((id, data) => {
    const index = mockDb.tables.contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      mockDb.tables.contacts[index] = { ...mockDb.tables.contacts[index], ...data };
      return mockDb.tables.contacts[index];
    }
    return null;
  }),
  delete: jest.fn((id) => {
    const index = mockDb.tables.contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      mockDb.tables.contacts.splice(index, 1);
      return { changes: 1 };
    }
    return { changes: 0 };
  }),
};

const mockCompanyRepo = {
  findAll: jest.fn(() => []),
  findById: jest.fn((id) => mockDb.tables.companies.find(c => c.id === id) || null),
  create: jest.fn((data) => {
    const id = mockDb.idCounter++;
    const company = { id, ...data };
    mockDb.tables.companies.push(company);
    return company;
  }),
  update: jest.fn((id, data) => {
    const index = mockDb.tables.companies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockDb.tables.companies[index] = { ...mockDb.tables.companies[index], ...data };
      return mockDb.tables.companies[index];
    }
    return null;
  }),
  delete: jest.fn((id) => {
    const index = mockDb.tables.companies.findIndex(c => c.id === id);
    if (index !== -1) {
      mockDb.tables.companies.splice(index, 1);
      return { changes: 1 };
    }
    return { changes: 0 };
  }),
};

const mockDealRepo = {
  findAll: jest.fn(() => []),
  findById: jest.fn((id) => mockDb.tables.deals.find(d => d.id === id) || null),
  create: jest.fn((data) => {
    const id = mockDb.idCounter++;
    const deal = { id, ...data };
    mockDb.tables.deals.push(deal);
    return deal;
  }),
  update: jest.fn((id, data) => {
    const index = mockDb.tables.deals.findIndex(d => d.id === id);
    if (index !== -1) {
      mockDb.tables.deals[index] = { ...mockDb.tables.deals[index], ...data };
      return mockDb.tables.deals[index];
    }
    return null;
  }),
  delete: jest.fn((id) => {
    const index = mockDb.tables.deals.findIndex(d => d.id === id);
    if (index !== -1) {
      mockDb.tables.deals.splice(index, 1);
      return { changes: 1 };
    }
    return { changes: 0 };
  }),
  getPipelineSummary: jest.fn(() => []),
};

const mockTaskRepo = {
  findAll: jest.fn(() => []),
  findById: jest.fn((id) => mockDb.tables.tasks.find(t => t.id === id) || null),
  create: jest.fn((data) => {
    const id = mockDb.idCounter++;
    const task = { id, ...data };
    mockDb.tables.tasks.push(task);
    return task;
  }),
  update: jest.fn((id, data) => {
    const index = mockDb.tables.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      mockDb.tables.tasks[index] = { ...mockDb.tables.tasks[index], ...data };
      return mockDb.tables.tasks[index];
    }
    return null;
  }),
  delete: jest.fn((id) => {
    const index = mockDb.tables.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      mockDb.tables.tasks.splice(index, 1);
      return { changes: 1 };
    }
    return { changes: 0 };
  }),
  findUpcoming: jest.fn((days) => []),
};

const mockActivityRepo = {
  findAll: jest.fn(() => []),
  findById: jest.fn((id) => mockDb.tables.activities.find(a => a.id === id) || null),
  create: jest.fn((data) => {
    const id = mockDb.idCounter++;
    const activity = { id, ...data };
    mockDb.tables.activities.push(activity);
    return activity;
  }),
  update: jest.fn((id, data) => {
    const index = mockDb.tables.activities.findIndex(a => a.id === id);
    if (index !== -1) {
      mockDb.tables.activities[index] = { ...mockDb.tables.activities[index], ...data };
      return mockDb.tables.activities[index];
    }
    return null;
  }),
  delete: jest.fn((id) => {
    const index = mockDb.tables.activities.findIndex(a => a.id === id);
    if (index !== -1) {
      mockDb.tables.activities.splice(index, 1);
      return { changes: 1 };
    }
    return { changes: 0 };
  }),
  getRecent: jest.fn((limit) => []),
  getByContact: jest.fn((contactId) => mockDb.tables.activities.filter(a => a.contact_id === contactId)),
};

// Mock 依赖模块
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  extname: jest.fn((filename) => filename.split('.').pop()),
}));

jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn(),
  },
  dialog: {
    showSaveDialog: jest.fn(),
  },
  app: {
    getVersion: jest.fn(() => '0.1.0'),
    getPath: jest.fn(() => '/tmp/test-data'),
  },
}));

jest.mock('../../db/database', () => ({ dbManager: mockDbManager }));
jest.mock('../../main/logger', () => ({ mainLogger: mockLogger }));
jest.mock('../../db/repositories', () => ({
  ContactRepository: jest.fn(() => mockContactRepo),
  CompanyRepository: jest.fn(() => mockCompanyRepo),
  DealRepository: jest.fn(() => mockDealRepo),
  TaskRepository: jest.fn(() => mockTaskRepo),
  ActivityRepository: jest.fn(() => mockActivityRepo),
}));

// 引入被测试模块
const { initializeDbHandlers } = require('../../main/ipc-handlers');

describe('IPC Handlers 集成测试', () => {
  let handlersMap;

  beforeEach(() => {
    jest.clearAllMocks();

    // 重置 mock 数据
    mockDb.tables.contacts = [];
    mockDb.tables.companies = [];
    mockDb.tables.deals = [];
    mockDb.tables.tasks = [];
    mockDb.tables.activities = [];
    mockDb.idCounter = 1;

    // 重置所有 mock 方法的实现
    mockContactRepo.findAll.mockReturnValue([]);
    mockContactRepo.create.mockImplementation((data) => {
      const id = mockDb.idCounter++;
      const contact = { id, ...data };
      mockDb.tables.contacts.push(contact);
      return contact;
    });

    mockCompanyRepo.findAll.mockReturnValue([]);
    mockCompanyRepo.create.mockImplementation((data) => {
      const id = mockDb.idCounter++;
      const company = { id, ...data };
      mockDb.tables.companies.push(company);
      return company;
    });

    mockDealRepo.findAll.mockReturnValue([]);
    mockDealRepo.create.mockImplementation((data) => {
      const id = mockDb.idCounter++;
      const deal = { id, ...data };
      mockDb.tables.deals.push(deal);
      return deal;
    });

    mockTaskRepo.findAll.mockReturnValue([]);
    mockTaskRepo.create.mockImplementation((data) => {
      const id = mockDb.idCounter++;
      const task = { id, ...data };
      mockDb.tables.tasks.push(task);
      return task;
    });

    mockActivityRepo.findAll.mockReturnValue([]);
    mockActivityRepo.create.mockImplementation((data) => {
      const id = mockDb.idCounter++;
      const activity = { id, ...data };
      mockDb.tables.activities.push(activity);
      return activity;
    });

    // 捕获 ipcMain.handle 调用
    handlersMap = new Map();
    ipcMain.handle.mockImplementation((channel, handler) => {
      handlersMap.set(channel, handler);
    });

    // 初始化 handlers
    initializeDbHandlers();
  });

  describe('Contacts CRUD', () => {
    test('create - 应该创建联系人', () => {
      const handler = handlersMap.get('db:contacts:create');
      const testData = { name: '张三', email: 'zhangsan@example.com', phone: '13800138000' };

      const result = handler(null, testData);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('张三');
      expect(mockDb.tables.contacts.length).toBe(1);
    });

    test('readAll - 应该返回所有联系人', () => {
      // 先创建一些数据
      mockDb.tables.contacts = [
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
        { id: 2, name: '李四', email: 'lisi@example.com' },
      ];
      mockContactRepo.findAll.mockReturnValue(mockDb.tables.contacts);

      const handler = handlersMap.get('db:contacts:all');
      const result = handler(null);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('张三');
      expect(result[1].name).toBe('李四');
    });

    test('get - 应该返回单个联系人', () => {
      mockDb.tables.contacts = [
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
      ];

      const handler = handlersMap.get('db:contacts:get');
      const result = handler(null, 1);

      expect(result).toEqual({ id: 1, name: '张三', email: 'zhangsan@example.com' });
    });

    test('delete - 应该删除联系人', () => {
      mockDb.tables.contacts = [
        { id: 1, name: '张三', email: 'zhangsan@example.com' },
      ];

      const handler = handlersMap.get('db:contacts:delete');
      const result = handler(null, 1);

      expect(result.success).toBe(true);
      expect(mockDb.tables.contacts.length).toBe(0);
    });

    test('delete 不存在的联系人应该返回失败', () => {
      const handler = handlersMap.get('db:contacts:delete');
      const result = handler(null, 999);

      expect(result.success).toBe(false);
    });
  });

  describe('Companies CRUD', () => {
    test('create - 应该创建公司', () => {
      const handler = handlersMap.get('db:companies:create');
      const testData = { name: '科技公司', website: 'https://example.com', industry: '互联网' };

      const result = handler(null, testData);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('科技公司');
      expect(mockDb.tables.companies.length).toBe(1);
    });

    test('readAll - 应该返回所有公司', () => {
      mockDb.tables.companies = [
        { id: 1, name: '科技公司', industry: '互联网' },
        { id: 2, name: '金融公司', industry: '金融' },
      ];
      mockCompanyRepo.findAll.mockReturnValue(mockDb.tables.companies);

      const handler = handlersMap.get('db:companies:all');
      const result = handler(null);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('科技公司');
      expect(result[1].name).toBe('金融公司');
    });

    test('delete - 应该删除公司', () => {
      mockDb.tables.companies = [
        { id: 1, name: '科技公司', industry: '互联网' },
      ];

      const handler = handlersMap.get('db:companies:delete');
      const result = handler(null, 1);

      expect(result.success).toBe(true);
      expect(mockDb.tables.companies.length).toBe(0);
    });
  });

  describe('Deals CRUD', () => {
    test('create - 应该创建交易', () => {
      const handler = handlersMap.get('db:deals:create');
      const testData = {
        title: '大项目',
        company_id: 1,
        stage: 'negotiation',
        value: 100000
      };

      const result = handler(null, testData);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe('大项目');
      expect(mockDb.tables.deals.length).toBe(1);
    });

    test('update - 应该更新交易阶段', () => {
      mockDb.tables.deals = [
        { id: 1, title: '大项目', stage: 'prospecting', value: 100000 },
      ];

      const handler = handlersMap.get('db:deals:update');
      const result = handler(null, 1, { stage: 'negotiation' });

      expect(result).toBeDefined();
      expect(result.stage).toBe('negotiation');
    });

    test('readAll - 应该返回所有交易', () => {
      mockDb.tables.deals = [
        { id: 1, title: '项目 A', stage: 'prospecting' },
        { id: 2, title: '项目 B', stage: 'negotiation' },
      ];
      mockDealRepo.findAll.mockReturnValue(mockDb.tables.deals);

      const handler = handlersMap.get('db:deals:all');
      const result = handler(null);

      expect(result).toHaveLength(2);
    });

    test('delete - 应该删除交易', () => {
      mockDb.tables.deals = [
        { id: 1, title: '大项目', stage: 'negotiation' },
      ];

      const handler = handlersMap.get('db:deals:delete');
      const result = handler(null, 1);

      expect(result.success).toBe(true);
      expect(mockDb.tables.deals.length).toBe(0);
    });
  });

  describe('Tasks CRUD', () => {
    test('create - 应该创建任务', () => {
      const handler = handlersMap.get('db:tasks:create');
      const testData = {
        title: '跟进客户',
        priority: 'high',
        status: 'pending',
        due_date: '2026-03-20'
      };

      const result = handler(null, testData);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.title).toBe('跟进客户');
      expect(result.priority).toBe('high');
      expect(mockDb.tables.tasks.length).toBe(1);
    });

    test('delete - 应该删除任务', () => {
      mockDb.tables.tasks = [
        { id: 1, title: '跟进客户', status: 'pending' },
      ];

      const handler = handlersMap.get('db:tasks:delete');
      const result = handler(null, 1);

      expect(result.success).toBe(true);
      expect(mockDb.tables.tasks.length).toBe(0);
    });

    test('readAll - 应该返回所有任务', () => {
      mockDb.tables.tasks = [
        { id: 1, title: '任务 1', status: 'pending' },
        { id: 2, title: '任务 2', status: 'completed' },
      ];
      mockTaskRepo.findAll.mockReturnValue(mockDb.tables.tasks);

      const handler = handlersMap.get('db:tasks:all');
      const result = handler(null);

      expect(result).toHaveLength(2);
    });
  });

  describe('Activities CRUD', () => {
    test('create - 应该创建活动', () => {
      const handler = handlersMap.get('db:activities:create');
      const testData = {
        type: 'Call',
        contact_id: 1,
        notes: '电话沟通良好',
        date: '2026-03-15'
      };

      const result = handler(null, testData);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.type).toBe('Call');
      expect(mockDb.tables.activities.length).toBe(1);
    });

    test('delete - 应该删除活动', () => {
      mockDb.tables.activities = [
        { id: 1, type: 'Call', contact_id: 1, notes: '电话沟通' },
      ];

      const handler = handlersMap.get('db:activities:delete');
      const result = handler(null, 1);

      expect(result.success).toBe(true);
      expect(mockDb.tables.activities.length).toBe(0);
    });

    test('getByContact - 应该返回联系人的活动', () => {
      mockDb.tables.activities = [
        { id: 1, type: 'Call', contact_id: 1, notes: '第一次通话' },
        { id: 2, type: 'Email', contact_id: 1, notes: '发送报价' },
        { id: 3, type: 'Meeting', contact_id: 2, notes: '面谈' },
      ];

      const result = mockActivityRepo.getByContact(1);

      expect(result).toHaveLength(2);
      expect(result[0].contact_id).toBe(1);
    });

    test('readAll - 应该返回所有活动', () => {
      mockDb.tables.activities = [
        { id: 1, type: 'Call', notes: '通话 1' },
        { id: 2, type: 'Email', notes: '邮件 1' },
        { id: 3, type: 'Meeting', notes: '会议 1' },
      ];
      mockActivityRepo.findAll.mockReturnValue(mockDb.tables.activities);

      const handler = handlersMap.get('db:activities:all');
      const result = handler(null);

      expect(result).toHaveLength(3);
    });
  });

  describe('错误处理', () => {
    test('create 时抛出错误应该被正确捕获和记录', () => {
      // 设置 create 方法抛出错误
      mockContactRepo.create.mockImplementation(() => {
        throw new Error('数据库错误');
      });

      // 重新初始化 handlers 以使用更新后的 mock
      handlersMap.clear();
      ipcMain.handle.mockImplementation((channel, handler) => {
        handlersMap.set(channel, handler);
      });
      initializeDbHandlers();

      const handler = handlersMap.get('db:contacts:create');

      // 应该抛出错误
      expect(() => handler(null, { name: '测试' })).toThrow('数据库错误');

      // 应该记录错误日志
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error in db:contacts:create'),
        expect.objectContaining({ error: '数据库错误' })
      );
    });

    test('update 不存在的记录应该返回 null', () => {
      const handler = handlersMap.get('db:contacts:update');
      const result = handler(null, 999, { name: '新名字' });

      expect(result).toBe(null);
    });

    test('delete 不存在的记录应该返回失败', () => {
      const handler = handlersMap.get('db:contacts:delete');
      const result = handler(null, 999);

      expect(result.success).toBe(false);
    });
  });

  describe('其他 handlers', () => {
    test('app:info 应该返回应用信息', () => {
      const handler = handlersMap.get('app:info');
      const result = handler();

      expect(result.version).toBe('0.1.0');
      expect(result.platform).toBeDefined();
      expect(result.userDataPath).toBeDefined();
    });

    test('db:deals:pipeline-summary 应该返回管道摘要', () => {
      mockDealRepo.getPipelineSummary.mockReturnValue([
        { stage: 'prospecting', count: 5, total_value: 50000 },
        { stage: 'negotiation', count: 3, total_value: 30000 },
      ]);

      // 重新初始化 handlers
      handlersMap.clear();
      ipcMain.handle.mockImplementation((channel, handler) => {
        handlersMap.set(channel, handler);
      });
      initializeDbHandlers();

      const handler = handlersMap.get('db:deals:pipeline-summary');
      const result = handler();

      expect(result).toHaveLength(2);
      expect(result[0].stage).toBe('prospecting');
    });

    test('db:tasks:upcoming 应该返回即将到来的任务', () => {
      const handler = handlersMap.get('db:tasks:upcoming');
      const result = handler(null, 7);

      expect(result).toEqual([]);
    });

    test('db:activities:recent 应该返回最近的活动', () => {
      const handler = handlersMap.get('db:activities:recent');
      const result = handler(null, 10);

      expect(result).toEqual([]);
    });
  });
});
