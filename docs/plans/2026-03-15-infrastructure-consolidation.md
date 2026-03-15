# Solo CRM 技术基础设施夯实计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 系统性夯实 Solo CRM 技术基础，提升代码质量、测试覆盖和性能。

**Architecture:** 分阶段执行：单元测试 → 数据库优化 → 代码重构 → 功能增强循环。

**Tech Stack:** React 19, Electron, SQLite, Zustand, Jest + React Testing Library, i18n (Chinese/English)

---

## Phase 1: 单元测试基础 (1.5 小时)

### Task 1.1: DataTable 组件测试
**Files:** Create `src/__tests__/renderer/components/DataTable.test.jsx`

**测试内容:**
- ✅ 渲染基础表格
- ✅ 点击列标题排序（升序 → 降序）
- ✅ 分页功能（下一页、上一页）
- ✅ 自定义 render 函数
- ✅ 空数据处理

**Commit:** `test: add DataTable component tests`

---

### Task 1.2: ConfirmModal 组件测试
**Files:** Create `src/__tests__/renderer/components/ConfirmModal.test.jsx`

**测试内容:**
- ✅ 渲染确认对话框
- ✅ 点击确认按钮触发 onConfirm
- ✅ 点击取消按钮触发 onCancel
- ✅ ESC 键关闭对话框
- ✅ 点击遮罩层关闭

**Commit:** `test: add ConfirmModal component tests`

---

### Task 1.3: ActivityTimeline 组件测试
**Files:** Create `src/__tests__/renderer/components/ActivityTimeline.test.jsx`

**测试内容:**
- ✅ 渲染活动列表
- ✅ 按日期分组活动
- ✅ 空状态显示
- ✅ 活动类型图标

**Commit:** `test: add ActivityTimeline component tests`

---

### Task 1.4: GlobalSearch 组件测试
**Files:** Create `src/__tests__/renderer/components/GlobalSearch.test.jsx`

**测试内容:**
- ✅ Cmd/Ctrl+K 打开搜索框
- ✅ 输入查询触发搜索
- ✅ 搜索历史保存和显示
- ✅ 点击历史项填充查询
- ✅ 清空历史记录

**Commit:** `test: add GlobalSearch component tests`

---

### Task 1.5: IPC Handlers 集成测试
**Files:** Create `src/__tests__/main/ipc-handlers.test.js`

**测试内容:**
- ✅ CRUD 操作（contacts, companies, deals, tasks）
- ✅ 活动创建和删除
- ✅ 数据验证和错误处理

**Commit:** `test: add IPC handlers integration tests`

---

## Phase 2: 数据库性能优化 (45 分钟)

### Task 2.1: 添加数据库索引
**Files:** Modify `src/db/database.js`

**索引列表:**
```sql
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_contact ON deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_deals_company ON deals(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_activities_contact ON activities(contact_id);
CREATE INDEX IF NOT EXISTS idx_activities_deal ON activities(deal_id);
```

**Commit:** `perf: add database indexes for better query performance`

---

### Task 2.2: 批量操作事务优化
**Files:** Modify `src/db/repositories/*.js`

**优化内容:**
- 导入操作使用事务包装
- 批量创建使用单事务

**Commit:** `perf: use transactions for batch operations`

---

## Phase 3: 代码重构 (1 小时)

### Task 3.1: 提取 useDataTable Hook
**Files:** Create `src/renderer/hooks/useDataTable.js`

**Hook 功能:**
```javascript
export function useDataTable(data, options = {}) {
  const { sortable = true, paginate = true, pageSize = 10 } = options;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // 返回：sortedData, paginatedData, handleSort, currentPage, totalPages
}
```

**Commit:** `refactor: extract useDataTable hook`

---

### Task 3.2: 提取 useSearch Hook
**Files:** Create `src/renderer/hooks/useSearch.js`

**Hook 功能:**
```javascript
export function useSearch(searchFn, options = {}) {
  const { debounceMs = 200, historyKey, maxHistory = 10 } = options;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // 返回：query, setQuery, results, loading, history, handleClearHistory
}
```

**Commit:** `refactor: extract useSearch hook`

---

### Task 3.3: 提取 useDeleteConfirmation Hook
**Files:** Create `src/renderer/hooks/useDeleteConfirmation.js`

**Hook 功能:**
```javascript
export function useDeleteConfirmation(deleteFn, options = {}) {
  const { successMessage, errorMessage, onReload } = options;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 返回：showConfirmModal, setShowConfirmModal, handleDelete, confirmDelete, ConfirmModal
}
```

**Commit:** `refactor: extract useDeleteConfirmation hook`

---

### Task 3.4: 统一 Toast 消息模式
**Files:** Modify `src/renderer/components/Toast.js`

**添加辅助函数:**
```javascript
export function useApiToast() {
  const toast = useToast();

  const wrap = async (fn, messages) => {
    try {
      const result = await fn();
      toast.success(messages.success);
      return result;
    } catch (error) {
      toast.error(`${messages.error}: ${error.message}`);
      throw error;
    }
  };

  return wrap;
}
```

**Commit:** `refactor: add useApiToast helper for consistent error handling`

---

## Phase 4: 功能增强循环 (剩余时间)

### Task 4.1: 表单关联增强
**Files:** Modify `src/renderer/App.jsx`

- ContactsView: 添加公司选择器
- DealsView: 添加联系人/公司选择器
- TasksView: 添加联系人/商谈选择器

**Commit:** `feat: add entity selectors to forms`

---

### Task 4.2: 批量操作
**Files:** Modify `src/renderer/App.jsx`

- 批量选择复选框
- 批量删除
- 批量导出

**Commit:** `feat: add batch operations`

---

### Task 4.3: 高级筛选
**Files:** Modify `src/renderer/components/DataTable.jsx`

- 列筛选
- 条件过滤
- 保存筛选条件

**Commit:** `feat: add advanced filtering to DataTable`

---

## 验证流程 (每个 Phase 完成后)

### 步骤 1: 运行 Lint
```bash
npm run lint
# Expected: 0 errors
```

### 步骤 2: 运行测试
```bash
npm test
# Expected: All tests pass
```

### 步骤 3: 运行构建
```bash
npm run build
# Expected: Build succeeds
```

### 步骤 4: Git 提交
```bash
git add -A && git commit -m "..."
git push origin main
```

---

## 30 分钟总结模板

每次总结包含：
1. 已完成任务列表
2. Git 提交记录
3. 测试/构建状态
4. 下一阶段计划
5. 遇到的问题（如有）

---

## 8 小时时间表

| 时间段 | 阶段 | 内容 |
|--------|------|------|
| 0:00-1:30 | Phase 1 | 单元测试基础 |
| 1:30-2:15 | Phase 2 | 数据库性能优化 |
| 2:15-3:15 | Phase 3 | 代码重构 |
| 3:15-8:00 | Phase 4+ | 功能增强循环 |

---

## 开始执行

准备使用 subagent-driven-development 执行此计划。
