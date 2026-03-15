# Solo CRM 技术基础设施夯实实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 系统性夯实 Solo CRM 技术基础，提升代码质量、测试覆盖和性能。

**Architecture:** 分阶段执行：单元测试 → 数据库优化 → 代码重构 → 功能增强循环。每个任务遵循 TDD 模式。

**Tech Stack:** React 19, Electron, SQLite (better-sqlite3), Zustand, Jest + React Testing Library, i18n (Chinese/English)

---

## Phase 1: 单元测试基础 (1.5 小时)

### Task 1.1: DataTable 组件测试

**Files:**
- Create: `src/__tests__/renderer/components/DataTable.test.jsx`
- Reference: `src/renderer/components/DataTable.jsx`

**Step 1: 编写失败测试**

```jsx
/**
 * DataTable 组件测试
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from 'src/renderer/components/DataTable';

const mockData = [
  { id: 1, name: '张三', email: 'zhang@example.com' },
  { id: 2, name: '李四', email: 'li@example.com' },
  { id: 3, name: '王五', email: 'wang@example.com' },
];

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'email', title: '邮箱' },
];

describe('DataTable', () => {
  test('应该渲染基础表格', () => {
    render(<DataTable columns={columns} data={mockData} paginate={false} />);
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
  });

  test('点击列标题应该切换排序方向', () => {
    render(<DataTable columns={columns} data={mockData} paginate={false} />);

    const nameHeader = screen.getByText('姓名');
    fireEvent.click(nameHeader);

    expect(screen.getByText('↑')).toBeInTheDocument();

    fireEvent.click(nameHeader);
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  test('分页功能应该正常工作', () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `用户${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(<DataTable columns={columns} data={largeData} pageSize={10} />);

    expect(screen.getByText('用户 1')).toBeInTheDocument();
    expect(screen.getByText('下一页')).toBeInTheDocument();

    fireEvent.click(screen.getByText('下一页'));
    expect(screen.getByText('用户 11')).toBeInTheDocument();
  });

  test('空数据应该显示空状态', () => {
    render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});
```

**Step 2: 运行测试验证失败**

Run: `npm test -- DataTable.test.jsx`
Expected: FAIL (空状态未处理)

**Step 3: 修复 DataTable 添加空状态**

Modify `src/renderer/components/DataTable.jsx`:
```javascript
if (!data || data.length === 0) {
  return <div className="empty-state">暂无数据</div>;
}
```

**Step 4: 运行测试验证通过**

Run: `npm test -- DataTable.test.jsx`
Expected: PASS (4/4 tests)

**Step 5: 提交**

```bash
git add src/__tests__/renderer/components/DataTable.test.jsx src/renderer/components/DataTable.jsx
git commit -m "test: add DataTable component tests with empty state handling"
```

---

### Task 1.2: ConfirmModal 组件测试

**Files:**
- Create: `src/__tests__/renderer/components/ConfirmModal.test.jsx`
- Reference: `src/renderer/components/ConfirmModal.jsx`

**Step 1: 编写失败测试**

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from 'src/renderer/components/ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    title: '确认删除',
    message: '确定要删除吗？',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  test('应该渲染确认对话框', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('确认删除')).toBeInTheDocument();
  });

  test('点击确认按钮应该触发 onConfirm', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('删除'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  test('点击取消按钮应该触发 onCancel', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('取消'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  test('ESC 键应该关闭对话框', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  test('点击遮罩层应该关闭对话框', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(document.querySelector('.modal-overlay'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });
});
```

**Step 2: 运行测试验证**

Run: `npm test -- ConfirmModal.test.jsx`
Expected: PASS (ConfirmModal 已实现 ESC 键和遮罩层关闭)

**Step 3: 提交**

```bash
git add src/__tests__/renderer/components/ConfirmModal.test.jsx
git commit -m "test: add ConfirmModal component tests"
```

---

### Task 1.3: ActivityTimeline 组件测试

**Files:**
- Create: `src/__tests__/renderer/components/ActivityTimeline.test.jsx`
- Reference: `src/renderer/components/ActivityTimeline.jsx`

**Step 1: 编写失败测试**

```jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ActivityTimeline } from 'src/renderer/components/ActivityTimeline';

describe('ActivityTimeline', () => {
  const mockActivities = [
    {
      id: 1,
      type: 'call',
      date: '2026-03-15T10:00:00Z',
      notes: '电话沟通',
      contact_name: '张三',
    },
    {
      id: 2,
      type: 'meeting',
      date: '2026-03-15T14:00:00Z',
      notes: '会议讨论',
      contact_name: '李四',
    },
  ];

  test('应该渲染活动列表', () => {
    render(<ActivityTimeline activities={mockActivities} />);
    expect(screen.getByText('电话沟通')).toBeInTheDocument();
  });

  test('应该显示活动类型图标', () => {
    render(<ActivityTimeline activities={mockActivities} />);
    expect(screen.getByText('📞')).toBeInTheDocument();
    expect(screen.getByText('🤝')).toBeInTheDocument();
  });

  test('应该按日期分组活动', () => {
    render(<ActivityTimeline activities={mockActivities} />);
    const dateHeader = screen.getByText(new Date('2026-03-15').toLocaleDateString());
    expect(dateHeader).toBeInTheDocument();
  });

  test('空活动应该显示空状态', () => {
    render(<ActivityTimeline activities={[]} />);
    expect(screen.getByText('暂无活动记录')).toBeInTheDocument();
  });
});
```

**Step 2: 运行测试验证**

Run: `npm test -- ActivityTimeline.test.jsx`
Expected: PASS

**Step 3: 提交**

```bash
git add src/__tests__/renderer/components/ActivityTimeline.test.jsx
git commit -m "test: add ActivityTimeline component tests"
```

---

### Task 1.4: GlobalSearch 组件测试

**Files:**
- Create: `src/__tests__/renderer/components/GlobalSearch.test.jsx`
- Reference: `src/renderer/components/GlobalSearch.jsx`

**Step 1: 编写失败测试**

```jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalSearch } from 'src/renderer/components/GlobalSearch';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

window.electronAPI = {
  db: {
    getContacts: jest.fn().mockResolvedValue([
      { id: 1, name: '张三', email: 'zhang@example.com' },
    ]),
    getCompanies: jest.fn().mockResolvedValue([]),
    getDeals: jest.fn().mockResolvedValue([]),
  },
};

describe('GlobalSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  test('Cmd+K 应该打开搜索框', () => {
    render(<GlobalSearch />);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByPlaceholderText('搜索联系人、公司、商谈...')).toBeInTheDocument();
  });

  test('应该显示搜索历史', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['张三', 'ABC']));
    render(<GlobalSearch />);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(screen.getByText('最近搜索')).toBeInTheDocument();
  });

  test('点击历史项应该填充查询', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['张三']));
    render(<GlobalSearch />);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    fireEvent.click(screen.getByText('张三'));
    const input = screen.getByPlaceholderText('搜索联系人、公司、商谈...');
    expect(input.value).toBe('张三');
  });

  test('清空按钮应该清除历史记录', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify(['张三']));
    render(<GlobalSearch />);
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    fireEvent.click(screen.getByText('清空'));
    expect(localStorageMock.removeItem).toHaveBeenCalled();
  });
});
```

**Step 2: 运行测试验证**

Run: `npm test -- GlobalSearch.test.jsx`
Expected: PASS

**Step 3: 提交**

```bash
git add src/__tests__/renderer/components/GlobalSearch.test.jsx
git commit -m "test: add GlobalSearch component tests with localStorage history"
```

---

### Task 1.5: IPC Handlers 集成测试

**Files:**
- Create: `src/__tests__/main/ipc-handlers.test.js`
- Reference: `src/main/ipc-handlers.js`
- Test Utils: `src/__tests__/utils/mockDatabase.js`

**Step 1: 编写失败测试**

```javascript
const { mockDb, mockDbManager, mockLogger } = require('../../utils/mockDatabase');

jest.mock('../../main/logger', () => mockLogger);
jest.mock('../../main/database', () => ({ dbManager: mockDbManager }));

const { initializeDbHandlers } = require('../../main/ipc-handlers');

describe('IPC Handlers', () => {
  let handlers;

  beforeEach(() => {
    mockDb.clear();
    handlers = {};
    initializeDbHandlers(handlers, mockDb);
  });

  describe('Contacts CRUD', () => {
    test('应该创建联系人', async () => {
      const result = await handlers['db:contacts:create']?.({}, { name: '张三', email: 'zhang@example.com' });
      expect(result).toEqual(expect.objectContaining({ name: '张三' }));
    });

    test('应该获取所有联系人', async () => {
      mockDb.addContact({ name: '张三' });
      const result = await handlers['db:contacts:readAll']?.({}, {});
      expect(result).toHaveLength(1);
    });

    test('应该删除联系人', async () => {
      const id = mockDb.addContact({ name: '张三' });
      await handlers['db:contacts:delete']?.({}, { id });
      expect(mockDb.getTable('contacts')).toHaveLength(0);
    });
  });

  describe('Activities CRUD', () => {
    test('应该创建活动', async () => {
      const result = await handlers['db:activities:create']?.({}, { type: 'call', notes: '电话' });
      expect(result).toEqual(expect.objectContaining({ type: 'call' }));
    });

    test('应该按联系人获取活动', async () => {
      const contactId = mockDb.addContact({ name: '张三' });
      mockDb.addActivity({ type: 'call', contact_id: contactId });
      const result = await handlers['db:activities:getByContact']?.({}, { contactId });
      expect(result).toHaveLength(1);
    });
  });
});
```

**Step 2: 运行测试验证**

Run: `npm test -- ipc-handlers.test.js`
Expected: Some handlers may need to be added

**Step 3: 确保 IPC handlers 存在**

检查 `src/main/ipc-handlers.js` 确保所有 handler 已定义

**Step 4: 提交**

```bash
git add src/__tests__/main/ipc-handlers.test.js
git commit -m "test: add IPC handlers integration tests"
```

---

## Phase 2: 数据库性能优化 (45 分钟)

### Task 2.1: 添加数据库索引

**Files:**
- Modify: `src/db/database.js`

**Step 1: 在 migrations 后添加索引**

Modify `src/db/database.js`:
```javascript
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
  CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
  CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
  CREATE INDEX IF NOT EXISTS idx_deals_contact ON deals(contact_id);
  CREATE INDEX IF NOT EXISTS idx_deals_company ON deals(company_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
  CREATE INDEX IF NOT EXISTS idx_activities_contact ON activities(contact_id);
  CREATE INDEX IF NOT EXISTS idx_activities_deal ON activities(deal_id);
`);
```

**Step 2: 运行验证**

Run: `npm run lint && npm test && npm run build`
Expected: All pass

**Step 3: 提交**

```bash
git add src/db/database.js
git commit -m "perf: add database indexes for better query performance"
```

---

## Phase 3: 代码重构 (1 小时)

### Task 3.1: 提取 useDataTable Hook

**Files:**
- Create: `src/renderer/hooks/useDataTable.js`
- Create: `src/renderer/hooks/index.js`

**Step 1: 创建 useDataTable Hook**

```javascript
import { useState, useMemo } from 'react';

export function useDataTable(data, options = {}) {
  const { sortable = true, paginate = true, pageSize = 10 } = options;

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, sortable]);

  const paginatedData = useMemo(() => {
    if (!paginate) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, paginate]);

  const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize]);

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const nextPage = () => setCurrentPage(p => p + 1);
  const prevPage = () => setCurrentPage(p => Math.max(1, p - 1));

  return { sortedData, paginatedData, sortConfig, currentPage, totalPages, handleSort, nextPage, prevPage };
}
```

**Step 2: 创建 hooks 索引**

```javascript
// src/renderer/hooks/index.js
export { useDataTable } from './useDataTable';
export { useSearch } from './useSearch';
export { useDeleteConfirmation } from './useDeleteConfirmation';
export { useApiToast } from './useApiToast';
```

**Step 3: 提交**

```bash
git add src/renderer/hooks/useDataTable.js src/renderer/hooks/index.js
git commit -m "refactor: extract useDataTable hook"
```

---

### Task 3.2: 提取 useSearch Hook

**Files:**
- Create: `src/renderer/hooks/useSearch.js`

**Step 1: 创建 useSearch Hook**

```javascript
import { useState, useEffect, useCallback } from 'react';

const SEARCH_HISTORY_KEY = 'solo-crm-search-history';
const MAX_HISTORY = 10;

function getSearchHistory() {
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveToHistory(query) {
  try {
    const history = getSearchHistory().filter(h => h !== query);
    history.unshift(query);
    if (history.length > MAX_HISTORY) history.pop();
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  } catch {}
}

export function useSearch(searchFn, options = {}) {
  const { debounceMs = 200 } = options;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(getSearchHistory());

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchFn(query);
        setResults(searchResults);
        saveToHistory(query.trim());
        setHistory(getSearchHistory());
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, searchFn, debounceMs]);

  const handleClearHistory = useCallback(() => {
    try { localStorage.removeItem(SEARCH_HISTORY_KEY); setHistory([]); } catch {}
  }, []);

  return { query, setQuery, results, loading, history, handleClearHistory };
}
```

**Step 2: 提交**

```bash
git add src/renderer/hooks/useSearch.js
git commit -m "refactor: extract useSearch hook"
```

---

### Task 3.3: 提取 useDeleteConfirmation Hook

**Files:**
- Create: `src/renderer/hooks/useDeleteConfirmation.js`

**Step 1: 创建 useDeleteConfirmation Hook**

```javascript
import { useState, useCallback } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from './Toast';

export function useDeleteConfirmation(deleteFn, options = {}) {
  const { successMessage, errorMessage, onReload } = options;
  const toast = useToast();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = useCallback((item) => {
    setItemToDelete(item);
    setShowConfirmModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await deleteFn(itemToDelete);
      toast.success(successMessage || '删除成功');
      setShowConfirmModal(false);
      setItemToDelete(null);
      onReload?.();
    } catch (error) {
      toast.error(`${errorMessage || '删除失败'}: ${error.message}`);
    }
  }, [itemToDelete, deleteFn, toast, successMessage, errorMessage, onReload]);

  return {
    showConfirmModal,
    setShowConfirmModal,
    handleDelete,
    confirmDelete,
    ConfirmModal: () => (
      <ConfirmModal
        isOpen={showConfirmModal}
        title="确认删除"
        message="确定要删除吗？此操作不可恢复。"
        onConfirm={confirmDelete}
        onCancel={() => { setShowConfirmModal(false); setItemToDelete(null); }}
      />
    ),
  };
}
```

**Step 2: 提交**

```bash
git add src/renderer/hooks/useDeleteConfirmation.js
git commit -m "refactor: extract useDeleteConfirmation hook"
```

---

### Task 3.4: 统一 Toast 消息模式

**Files:**
- Create: `src/renderer/hooks/useApiToast.js`

**Step 1: 创建 useApiToast Hook**

```javascript
import { useToast } from '../components/Toast';

export function useApiToast() {
  const toast = useToast();

  const wrap = async (fn, messages = {}) => {
    try {
      const result = await fn();
      if (messages.success) toast.success(messages.success);
      return result;
    } catch (error) {
      toast.error(`${messages.error || '操作失败'}: ${error.message}`);
      throw error;
    }
  };

  return wrap;
}
```

**Step 2: 提交**

```bash
git add src/renderer/hooks/useApiToast.js
git commit -m "refactor: add useApiToast helper for consistent error handling"
```

---

## Phase 4: 功能增强循环 (剩余时间)

### Task 4.1: 表单关联增强

**Files:**
- Modify: `src/renderer/App.jsx`

**Step 1: ContactsView 添加公司选择器**

在 ContactsView 表单中添加:
```javascript
<div className="form-group">
  <label>{t('contacts.company')}</label>
  <select value={formData.company_id} onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}>
    <option value="">无</option>
    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
  </select>
</div>
```

**Step 2: DealsView 添加联系人/公司选择器**

**Step 3: TasksView 添加联系人/商谈选择器**

**Step 4: 提交**

```bash
git add src/renderer/App.jsx
git commit -m "feat: add entity selectors to forms for better data linking"
```

---

## 验证流程

每个 Phase 完成后执行:
```bash
npm run lint  # Expected: 0 errors
npm test      # Expected: All tests pass
npm run build # Expected: Build succeeds
```

---

## 30 分钟总结模板

1. 已完成任务列表
2. Git 提交记录
3. 测试/构建状态
4. 下一阶段计划
