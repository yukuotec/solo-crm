# Solo CRM 8-Hour Development Loop Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 系统性增强 Solo CRM 应用，每 30 分钟总结进度，持续 8 小时。

**Architecture:** 按优先级顺序执行功能开发，每个功能完成后运行测试验证，确保代码质量。

**Tech Stack:** React 19, Electron, SQLite, Zustand, i18n (Chinese/English)

---

## Phase 1: 删除确认集成 (优先级 1 - 30 分钟)

### Task 1.1: Contacts 模块删除确认
**Files:** Modify `src/renderer/App.jsx`

在 ContactsView 中添加 ConfirmModal：
```javascript
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [contactToDelete, setContactToDelete] = useState(null);

const handleDelete = (contact) => {
  setContactToDelete(contact);
  setShowConfirmModal(true);
};

const confirmDelete = async () => {
  await window.electronAPI.db.deleteContact(contactToDelete.id);
  toast.success(t('contacts.deletedSuccess'));
  setShowConfirmModal(false);
  onLoad();
};

// 在表格中添加删除按钮
<button onClick={() => handleDelete(contact)}>{t('buttons.delete')}</button>

// 添加 ConfirmModal 组件
<ConfirmModal
  isOpen={showConfirmModal}
  title={t('confirmModal.deleteTitle')}
  message={t('contacts.confirmDelete')}
  onConfirm={confirmDelete}
  onCancel={() => setShowConfirmModal(false)}
/>
```

**Commit:** `feat: add delete confirmation for contacts`

---

### Task 1.2: Companies 模块删除确认
**Files:** Modify `src/renderer/App.jsx`

同样模式添加到 CompaniesView。

**Commit:** `feat: add delete confirmation for companies`

---

### Task 1.3: Deals 模块删除确认
**Files:** Modify `src/renderer/App.jsx`

同样模式添加到 DealsView。

**Commit:** `feat: add delete confirmation for deals`

---

### Task 1.4: Tasks 模块删除确认
**Files:** Modify `src/renderer/App.jsx`

同样模式添加到 TasksView。

**Commit:** `feat: add delete confirmation for tasks`

---

### Task 1.5: Activities 模块删除确认
**Files:** Modify `src/renderer/App.jsx`

已在 ActivitiesView 中实现，验证即可。

**Commit:** `chore: verify activities delete confirmation`

---

## Phase 2: 活动详情集成 (优先级 2 - 45 分钟)

### Task 2.1: ContactDetail 集成活动时间线
**Files:** Modify `src/renderer/components/DetailViews.jsx`

```javascript
// 在 ContactDetail 中添加
import { ActivityTimeline } from './ActivityTimeline';

// 加载关联活动
const [contactActivities, setContactActivities] = useState([]);

useEffect(() => {
  if (contact?.id) {
    window.electronAPI.db.getActivitiesByContact(contact.id)
      .then(setContactActivities);
  }
}, [contact]);

// 在详情中添加
<div className="detail-section">
  <h3>{t('detail.activities')}</h3>
  <ActivityTimeline activities={contactActivities} />
</div>
```

**IPC Handler:** Add `db:activities:getByContact` to `ipc-handlers.js`

**Commit:** `feat: show activity timeline in ContactDetail`

---

### Task 2.2: DealDetail 集成活动时间线
**Files:** Modify `src/renderer/components/DetailViews.jsx`

同样模式添加到 DealDetail。

**IPC Handler:** Add `db:activities:getByDeal` to `ipc-handlers.js`

**Commit:** `feat: show activity timeline in DealDetail`

---

### Task 2.3: CompanyDetail 集成关联活动
**Files:** Modify `src/renderer/components/DetailViews.jsx`

通过联系人间接显示活动。

**Commit:** `feat: show related activities in CompanyDetail`

---

## Phase 3: DataTable 增强 (优先级 3 - 60 分钟)

### Task 3.1: 创建 DataTable 组件
**Files:** Create `src/renderer/components/DataTable.jsx`

```javascript
import React, { useState, useMemo } from 'react';

export function DataTable({ columns, data, sortable = true, paginate = true, pageSize = 10 }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!paginate) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, paginate]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => sortable && col.sortable !== false && handleSort(col.key)}
                className={sortable && col.sortable !== false ? 'sortable' : ''}
              >
                {col.title}
                {sortConfig.key === col.key && (
                  <span className="sort-indicator">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map(col => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {paginate && totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>上一页</button>
          <span>第 {currentPage} / {totalPages} 页</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>下一页</button>
        </div>
      )}
    </div>
  );
}
```

**Commit:** `feat: create reusable DataTable component with sort and pagination`

---

### Task 3.2: CSS 样式
**Files:** Modify `src/renderer/index.css`

```css
.data-table-wrapper {
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.data-table th.sortable:hover {
  background: var(--bg-tertiary);
}

.sort-indicator {
  margin-left: 0.25rem;
  color: var(--accent);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
```

**Commit:** `feat: add DataTable and pagination CSS styles`

---

### Task 3.3: 集成到 ContactsView
**Files:** Modify `src/renderer/App.jsx`

替换 ContactsView 中的表格为 DataTable。

**Commit:** `refactor: use DataTable in ContactsView`

---

### Task 3.4: 集成到 CompaniesView
**Files:** Modify `src/renderer/App.jsx`

**Commit:** `refactor: use DataTable in CompaniesView`

---

### Task 3.5: 集成到 TasksView
**Files:** Modify `src/renderer/App.jsx`

**Commit:** `refactor: use DataTable in TasksView`

---

## Phase 4: 增强功能 (根据时间选择)

### Task 4.1: 全局搜索增强
**Files:** Modify `src/renderer/components/GlobalSearch.jsx`

- 添加高级筛选
- 添加最近搜索历史
- 添加搜索结果高亮

---

### Task 4.2: Dashboard 活动 Widget
**Files:** Modify `src/renderer/App.jsx`

在 Dashboard 中添加"最近活动"组件。

---

### Task 4.3: 导出功能验证
**Files:** Verify `src/renderer/components/ExportMenu.jsx`

确保所有模块导出功能正常。

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

### 步骤 4: 启动应用
```bash
npm run dev
# Verify UI renders correctly
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
| 0:00-0:30 | Phase 1 | 删除确认集成 |
| 0:30-1:15 | Phase 2 | 活动详情集成 |
| 1:15-2:15 | Phase 3 | DataTable 增强 |
| 2:15-8:00 | Phase 4+ | 增强功能循环开发 |

---

## 开始执行

准备使用 subagent-driven-development 执行此计划。
