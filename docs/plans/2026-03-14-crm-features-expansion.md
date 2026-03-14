# CRM 功能扩展设计文档

**日期**: 2026-03-14
**作者**: Claude
**目标**: 在 2.5 小时内完成 4 个核心功能的 MVP 版本

---

## 1. 关联跳转 (Entity Linking)

### 目标
增强实体间的关联导航，提升用户体验。

### 实现方案
- 公司详情 → 显示关联联系人列表，点击可跳转
- 联系人详情 → 显示关联公司信息，点击可跳转
- 商谈详情 → 显示关联公司/联系人，点击可跳转
- 表格中添加快捷操作按钮

### 修改文件
- `src/renderer/components/DetailViews.jsx` - 增强详情视图
- `src/renderer/App.jsx` - 表格中添加关联跳转

---

## 2. 拖放看板 (Drag & Drop Kanban)

### 目标
支持拖拽商谈卡片更新阶段。

### 实现方案
- 使用 HTML5 Drag & Drop API（零依赖）
- 拖拽开始：记录商谈 ID 和源阶段
- 放置目标：更新商谈阶段
- 视觉反馈：拖拽中半透明，成功高亮

### 修改文件
- `src/renderer/App.jsx` - DealsView 组件
- `src/renderer/index.css` - 拖放样式

---

## 3. 数据导入 (Data Import)

### 目标
支持 CSV/Excel/TXT 文件导入联系人和公司。

### 实现方案
- 安装 `xlsx` 库解析 Excel
- 添加导入对话框组件
- 支持字段映射（自动匹配列名）
- 预览确认 → 批量导入

### 修改文件
- `package.json` - 添加 xlsx 依赖
- `src/renderer/components/ImportDialog.jsx` - 新建
- `src/main/ipc-handlers.js` - 添加文件读取处理
- `src/renderer/App.jsx` - 添加导入按钮

---

## 4. AI 集成 (AI Search)

### 目标
根据用户输入自动搜索并补充数据。

### 实现方案
- 在新增/编辑表单中添加"AI 搜索"按钮
- 输入公司名 → 调用 Agent 搜索官网/地址/电话
- 输入人名 → 搜索邮箱/职位
- 搜索结果 → 自动填充表单

### 修改文件
- `src/renderer/components/AISearchInput.jsx` - 新建
- `src/main/ipc-handlers.js` - 添加 AI 搜索 IPC 处理
- `src/renderer/App.jsx` - 表单中集成

---

## 开发顺序

1. 关联跳转 (15 分钟)
2. 拖放看板 (30 分钟)
3. 数据导入 (45 分钟)
4. AI 集成 (60 分钟)

**总计**: 约 2.5 小时

---

## 验收标准

| 功能 | 验收标准 |
|------|---------|
| 关联跳转 | 点击公司可查看所有关联联系人，点击可跳转详情 |
| 拖放看板 | 拖拽商谈卡片可改变阶段，数据持久化 |
| 数据导入 | 可上传 CSV/Excel 文件，预览后导入 |
| AI 集成 | 输入公司名可搜索并自动填充表单 |
