# Activities Module Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完成 Activities 模块 UI 开发，包括活动记录列表、新增表单、时间线视图和删除确认。

**Architecture:**
- 使用现有的 ActivityRepository（已完成 CRUD）
- 在 App.jsx 中添加 ActivitiesView 组件
- 添加 ActivityList 和 ActivityTimeline 子组件
- 集成到侧边栏导航
- 支持按联系人/商谈筛选

**Tech Stack:** React 19, Electron IPC, SQLite, i18n (中文/英文)

---

### Task 1: 更新 i18n 翻译文件

**Files:**
- Modify: `src/renderer/i18n/translations.js`

**Steps:**

添加完整的 activities 模块翻译键：

```javascript
// 在 zh-CN 部分添加
activities: {
  title: '活动记录',
  addActivity: '记录活动',
  noActivities: '暂无活动记录',
  types: {
    call: '通话',
    meeting: '会议',
    email: '邮件',
    note: '备注',
    other: '其他'
  },
  date: '日期',
  notes: '备注',
  contact: '联系人',
  deal: '商谈',
  createdSuccess: '活动记录成功',
  createFailed: '创建失败',
  updatedSuccess: '活动更新成功',
  updateFailed: '更新失败',
  deletedSuccess: '活动删除成功',
  deleteFailed: '删除失败',
  confirmDelete: '确定要删除此活动记录吗？',
  cancel: '取消',
  save: '保存'
}
```

**Commit:**
```bash
git add src/renderer/i18n/translations.js
git commit -m "feat(i18n): add activities module translations"
```

---

### Task 2: 创建 ActivityList 组件

**Files:**
- Create: `src/renderer/components/ActivityList.jsx`

**Steps:**

**Step 1: 创建基础组件**

```javascript
import React from 'react';
import { useTranslation } from '../i18n';

const typeIcons = {
  call: '📞',
  meeting: '🤝',
  email: '📧',
  note: '📝',
  other: '📌'
};

export function ActivityList({ activities, onEdit, onDelete }) {
  const { t } = useTranslation();

  if (!activities || activities.length === 0) {
    return <div className="empty-state">{t('activities.noActivities')}</div>;
  }

  return (
    <div className="activity-list">
      {activities.map(activity => (
        <div key={activity.id} className="activity-item">
          <div className="activity-header">
            <span className="activity-type-icon">{typeIcons[activity.type]}</span>
            <span className="activity-type">{t(`activities.types.${activity.type}`)}</span>
            <span className="activity-date">{new Date(activity.date).toLocaleString()}</span>
          </div>
          <div className="activity-content">
            {activity.notes && <p className="activity-notes">{activity.notes}</p>}
            {activity.contact_name && (
              <span className="activity-contact">👤 {activity.contact_name}</span>
            )}
            {activity.deal_title && (
              <span className="activity-deal">💰 {activity.deal_title}</span>
            )}
          </div>
          <div className="activity-actions">
            {onEdit && (
              <button className="btn btn-sm btn-secondary" onClick={() => onEdit(activity)}>
                {t('buttons.edit')}
              </button>
            )}
            {onDelete && (
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(activity)}>
                {t('buttons.delete')}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: 导出组件**

修改 `src/renderer/components/index.js` 添加导出。

**Commit:**
```bash
git add src/renderer/components/ActivityList.jsx src/renderer/components/index.js
git commit -m "feat: add ActivityList component"
```

---

### Task 3: 创建 ActivityTimeline 组件

**Files:**
- Create: `src/renderer/components/ActivityTimeline.jsx`

**Steps:**

**Step 1: 创建时间线组件**

```javascript
import React from 'react';
import { useTranslation } from '../i18n';

const typeIcons = {
  call: '📞',
  meeting: '🤝',
  email: '📧',
  note: '📝',
  other: '📌'
};

export function ActivityTimeline({ activities }) {
  const { t } = useTranslation();

  if (!activities || activities.length === 0) {
    return <div className="empty-state">{t('activities.noActivities')}</div>;
  }

  // 按日期分组
  const groupedByDate = activities.reduce((acc, activity) => {
    const date = new Date(activity.date).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  return (
    <div className="activity-timeline">
      {Object.entries(groupedByDate).map(([date, dayActivities]) => (
        <div key={date} className="timeline-day">
          <div className="timeline-date-header">{date}</div>
          <div className="timeline-items">
            {dayActivities.map(activity => (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-marker">
                  <span className="timeline-icon">{typeIcons[activity.type]}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-type">{t(`activities.types.${activity.type}`)}</span>
                    <span className="timeline-time">
                      {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {activity.notes && <p className="timeline-notes">{activity.notes}</p>}
                  {activity.contact_name && (
                    <span className="timeline-meta">👤 {activity.contact_name}</span>
                  )}
                  {activity.deal_title && (
                    <span className="timeline-meta">💰 {activity.deal_title}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Commit:**
```bash
git add src/renderer/components/ActivityTimeline.jsx
git commit -m "feat: add ActivityTimeline component"
```

---

### Task 4: 创建 ConfirmModal 删除确认组件

**Files:**
- Create: `src/renderer/components/ConfirmModal.jsx`

**Steps:**

**Step 1: 创建确认对话框组件**

```javascript
import React, { useEffect } from 'react';
import { useTranslation } from '../i18n';

export function ConfirmModal({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel }) {
  const { t } = useTranslation();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel && onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3>{title || t('confirmModal.title')}</h3>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelText || t('buttons.cancel')}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmText || t('buttons.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: 更新 Modal.jsx 导出**

**Commit:**
```bash
git add src/renderer/components/ConfirmModal.jsx src/renderer/components/index.js
git commit -m "feat: add ConfirmModal component for delete confirmations"
```

---

### Task 5: 在 App.jsx 中添加 ActivitiesView

**Files:**
- Modify: `src/renderer/App.jsx`

**Steps:**

**Step 1: 添加 ActivitiesView 组件**

```javascript
function ActivitiesView({ activities, onLoad, toast, t }) {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [formData, setFormData] = useState({
    type: 'note',
    date: new Date().toISOString().slice(0, 16),
    contact_id: '',
    deal_id: '',
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await window.electronAPI.db.createActivity({
        ...formData,
        contact_id: formData.contact_id || null,
        deal_id: formData.deal_id || null,
      });
      toast.success(t('activities.createdSuccess'));
      setFormData({
        type: 'note',
        date: new Date().toISOString().slice(0, 16),
        contact_id: '',
        deal_id: '',
        notes: '',
      });
      setShowModal(false);
      onLoad();
    } catch (error) {
      toast.error(`${t('activities.createFailed')}: ${error.message}`);
    }
  };

  const handleDelete = (activity) => {
    setActivityToDelete(activity);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await window.electronAPI.db.deleteActivity(activityToDelete.id);
      toast.success(t('activities.deletedSuccess'));
      setShowConfirmModal(false);
      setActivityToDelete(null);
      onLoad();
    } catch (error) {
      toast.error(`${t('activities.deleteFailed')}: ${error.message}`);
    }
  };

  return (
    <div className="module-view">
      <div className="module-header">
        <h2>{t('activities.title')}</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          {t('activities.addActivity')}
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('activities.addActivity')}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('activities.types.title')}</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              <option value="call">{t('activities.types.call')}</option>
              <option value="meeting">{t('activities.types.meeting')}</option>
              <option value="email">{t('activities.types.email')}</option>
              <option value="note">{t('activities.types.note')}</option>
              <option value="other">{t('activities.types.other')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('activities.date')}</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>{t('activities.notes')}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              {t('activities.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('activities.save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={t('confirmModal.deleteTitle')}
        message={t('activities.confirmDelete')}
        confirmText={t('buttons.delete')}
        cancelText={t('buttons.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />

      <ActivityList activities={activities} onDelete={handleDelete} />
    </div>
  );
}
```

**Step 2: 添加 Activities 到导航**

在 Sidebar 组件的 navItems 中添加：
```javascript
{ id: 'activities', label: t('nav.activities'), icon: '📋' }
```

**Step 3: 添加路由切换**

在 AppContent 中添加：
```javascript
{activeTab === 'activities' && (
  <ActivitiesView activities={activities} onLoad={loadActivities} toast={toast} t={t} />
)}
```

**Step 4: 添加 Zustand store**

在 `src/shared/store.js` 中添加 useActivityStore。

**Commit:**
```bash
git add src/renderer/App.jsx src/shared/store.js
git commit -m "feat: add ActivitiesView with CRUD operations"
```

---

### Task 6: 添加 CSS 样式

**Files:**
- Modify: `src/renderer/index.css`

**Steps:**

```css
/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.activity-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activity-type-icon {
  font-size: 1.25rem;
}

.activity-type {
  font-weight: 600;
  color: var(--text-primary);
}

.activity-date {
  margin-left: auto;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-notes {
  color: var(--text-primary);
  margin: 0;
  white-space: pre-wrap;
}

.activity-contact,
.activity-deal {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.activity-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}

/* Activity Timeline */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-day {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.timeline-date-header {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 1rem;
}

.timeline-item {
  display: flex;
  gap: 0.75rem;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.timeline-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.timeline-content {
  flex: 1;
  background: var(--bg-secondary);
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-type {
  font-weight: 600;
  color: var(--text-primary);
}

.timeline-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.timeline-notes {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  white-space: pre-wrap;
}

.timeline-meta {
  display: block;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

/* Confirm Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-secondary);
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.25rem;
}

.modal-body p {
  margin: 0;
  color: var(--text-primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border);
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}
```

**Commit:**
```bash
git add src/renderer/index.css
git commit -m "feat: add activities module CSS styles"
```

---

### Task 7: 完善 i18n 和集成测试

**Files:**
- Modify: `src/renderer/i18n/translations.js`

**Steps:**

**Step 1: 补全所有翻译键**

确保以下键存在：
- `nav.activities`
- `activities.types.title` (用于表单 label)
- `confirmModal.title` / `confirmModal.deleteTitle`
- `buttons.edit` / `buttons.delete`

**Step 2: 运行测试**

```bash
npm test
```

**Step 3: 运行构建**

```bash
npm run build
```

**Step 4: 运行 lint**

```bash
npm run lint
```

**Commit:**
```bash
git add src/renderer/i18n/translations.js
git commit -m "feat(i18n): complete activities module translations"
```

---

### Task 8: 手动验证

**Steps:**

1. **启动应用**
   ```bash
   npm run dev
   ```

2. **验证导航**
   - 点击侧边栏"活动记录"导航项
   - 确认页面正确加载

3. **验证创建**
   - 点击"记录活动"按钮
   - 填写表单（选择类型、日期、备注）
   - 提交并确认 Toast 提示

4. **验证列表**
   - 确认新活动显示在列表中
   - 验证类型图标正确显示

5. **验证删除**
   - 点击删除按钮
   - 确认对话框弹出
   - 确认删除后活动消失

6. **验证 ESC 关闭**
   - 打开新增/删除对话框
   - 按 ESC 键确认关闭

**验收标准:**
- [ ] 导航到活动页面正常
- [ ] 可以创建活动记录
- [ ] 活动列表正确显示
- [ ] 删除确认对话框工作
- [ ] ESC 键可以关闭对话框
- [ ] 所有 Toast 提示正确

---

## 总结

完成此计划后：
- ✅ Activities 模块完整可用
- ✅ 删除确认功能（ConfirmModal）可复用于其他模块
- ✅ 活动记录可以关联联系人/商谈
- ✅ 时间线视图提供清晰的 activity 历史

**预计时间:** 约 45-60 分钟
**提交次数:** 7-8 次
