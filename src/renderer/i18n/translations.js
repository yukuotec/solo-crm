/**
 * 国际化翻译文件
 * Internationalization Translations
 */

export const translations = {
  zh: {
    // 应用通用
    app: {
      loading: '加载中...',
      error: '错误',
      version: '版本',
    },

    // 导航
    nav: {
      dashboard: '仪表盘',
      contacts: '联系人',
      companies: '公司',
      deals: '销售机会',
      tasks: '任务',
      activities: '活动记录',
    },

    // 仪表盘
    dashboard: {
      title: '仪表盘',
      totalContacts: '联系人总数',
      totalCompanies: '公司总数',
      totalDeals: '销售机会总数',
      pendingTasks: '待办任务',
      pipelineValue: '销售管道总额',
      pipelineByStage: '按阶段分布',
      upcomingTasks: '近期任务 (7 天)',
      noDeals: '暂无销售机会',
      noUpcomingTasks: '暂无近期任务',
      deals: '个机会',
      alerts: '警报',
      quickStats: '快速统计',
      newDealsThisMonth: '本月新增商谈',
      winRate: '胜率',
      avgDealSize: '平均商谈金额',
      funnelView: '漏斗图',
      staleDealsAlert: '{count} 个商谈超过 7 天未更新',
      closingSoonAlert: '本周有 {count} 个商谈预计成交',
      viewToggle: {
        card: '卡片视图',
        table: '表格视图',
      },
      estimatedAnnualSpend: '预估年支出',
      contactsCount: '{count} 联系人',
      activeDeal: '进行中商谈',
      noActiveDeal: '暂无进行中商谈',
      industry: '行业',
      location: '地区',
      employees: '员工',
    },

    // 联系人
    contacts: {
      title: '联系人',
      addContact: '+ 新增联系人',
      editContact: '编辑联系人',
      deleteContact: '删除联系人',
      saveContact: '保存联系人',
      cancel: '取消',
      name: '姓名',
      email: '邮箱',
      phone: '电话',
      company: '公司',
      tags: '标签',
      notes: '备注',
      noContacts: '暂无联系人，添加第一个联系人吧！',
      confirmDelete: '确定要删除这个联系人吗？',
      createdSuccess: '联系人创建成功',
      updatedSuccess: '联系人更新成功',
      deletedSuccess: '联系人删除成功',
      createFailed: '创建联系人失败',
      updateFailed: '更新联系人失败',
      deleteFailed: '删除联系人失败',
    },

    // 公司
    companies: {
      title: '公司',
      addCompany: '+ 新增公司',
      editCompany: '编辑公司',
      deleteCompany: '删除公司',
      saveCompany: '保存公司',
      cancel: '取消',
      name: '公司名称',
      website: '网站',
      industry: '行业',
      phone: '电话',
      address: '地址',
      notes: '备注',
      noCompanies: '暂无公司，添加第一个公司吧！',
      confirmDelete: '确定要删除这个公司吗？',
      createdSuccess: '公司创建成功',
      updatedSuccess: '公司更新成功',
      deletedSuccess: '公司删除成功',
      createFailed: '创建公司失败',
      updateFailed: '更新公司失败',
      deleteFailed: '删除公司失败',
      contacts: '联系人',
      deals: '销售机会',
      cardView: '卡片视图',
      tableView: '表格视图',
      contactsCount: '{count} 个联系人',
      dealValue: '预估金额',
    },

    // 销售机会
    deals: {
      title: '销售管道',
      addDeal: '+ 新增销售机会',
      editDeal: '编辑销售机会',
      deleteDeal: '删除销售机会',
      saveDeal: '保存销售机会',
      cancel: '取消',
      title: '标题',
      value: '金额 ($)',
      stage: '阶段',
      probability: '成功率 (%)',
      closeDate: '预计成交日期',
      notes: '备注',
      noDeals: '暂无销售机会，添加第一个吧！',
      confirmDelete: '确定要删除这个销售机会吗？',
      createdSuccess: '销售机会创建成功',
      updatedSuccess: '销售机会更新成功',
      deletedSuccess: '销售机会删除成功',
      createFailed: '创建销售机会失败',
      updateFailed: '更新销售机会失败',
      deleteFailed: '删除销售机会失败',
      company: '公司',
      contact: '联系人',
      weightedValue: '加权价值',
      stages: {
        lead: '潜在客户',
        qualified: '已确认',
        proposal: '方案报价',
        negotiation: '谈判中',
        closed_won: '已成交',
        closed_lost: '已流失',
      },
    },

    // 任务
    tasks: {
      title: '任务',
      addTask: '+ 新增任务',
      editTask: '编辑任务',
      deleteTask: '删除任务',
      saveTask: '保存任务',
      cancel: '取消',
      title: '标题',
      description: '描述',
      dueDate: '到期日期',
      priority: '优先级',
      status: '状态',
      noTasks: '暂无任务，添加第一个任务吧！',
      confirmDelete: '确定要删除这个任务吗？',
      createdSuccess: '任务创建成功',
      updatedSuccess: '任务更新成功',
      deletedSuccess: '任务删除成功',
      createFailed: '创建任务失败',
      updateFailed: '更新任务失败',
      deleteFailed: '删除任务失败',
      priorities: {
        low: '低',
        medium: '中',
        high: '高',
      },
      statuses: {
        pending: '待办',
        completed: '已完成',
      },
      due: '到期',
    },

    // 活动记录
    activities: {
      title: '活动记录',
      addActivity: '+ 记录活动',
      editActivity: '编辑活动',
      deleteActivity: '删除活动',
      saveActivity: '保存活动',
      cancel: '取消',
      types: {
        title: '活动类型',
        call: '通话',
        meeting: '会议',
        email: '邮件',
        note: '备注',
        other: '其他',
      },
      date: '日期',
      notes: '备注',
      contact: '联系人',
      deal: '商谈',
      noActivities: '暂无活动记录，添加第一条记录吧！',
      confirmDelete: '确定要删除此活动记录吗？',
      createdSuccess: '活动记录成功',
      updatedSuccess: '活动更新成功',
      deletedSuccess: '活动删除成功',
      createFailed: '创建失败',
      updateFailed: '更新失败',
      deleteFailed: '删除失败',
    },

    // 通用按钮和操作
    buttons: {
      add: '新增',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      cancel: '取消',
      confirm: '确认',
      close: '关闭',
      export: '导出',
      search: '搜索',
    },

    // 消息
    messages: {
      loading: '加载中...',
      noData: '暂无数据',
      saveSuccess: '保存成功',
      deleteSuccess: '删除成功',
      operationFailed: '操作失败',
    },

    // 搜索
    search: {
      placeholder: '搜索联系人、公司、销售机会... (Cmd/Ctrl+K)',
      noResults: '未找到匹配结果',
      contacts: '联系人',
      companies: '公司',
      deals: '销售机会',
    },

    // 导出
    export: {
      title: '导出',
      contacts: '联系人',
      companies: '公司',
      deals: '销售机会',
      tasks: '任务',
      exported: '已导出',
      noData: '没有可导出的数据',
      exportFailed: '导出失败',
    },

    // 详情视图
    detail: {
      contactInfo: '联系信息',
      companyInfo: '公司信息',
      dealInfo: '销售机会信息',
      linkedDeals: '相关销售机会',
      linkedTasks: '相关任务',
      activities: '活动记录',
      noRelated: '暂无相关记录',
      noContacts: '暂无联系人',
      noDeals: '暂无销售机会',
      noActivities: '暂无活动记录',
      noNotes: '无备注',
      delete: '删除',
      close: '关闭',
    },

    // 通用
    alert: {
      warning: '警告',
      error: '错误',
      info: '提示',
    },

    priority: {
      hot: '热点',
      warm: '温点',
      cold: '冷点',
    },

    // Toast 消息
    toast: {
      success: '成功',
      error: '错误',
      warning: '警告',
      info: '提示',
    },

    // 确认对话框
    confirm: {
      title: '确认',
      deleteTitle: '确认删除',
      deleteMessage: '此操作不可恢复，确定要继续吗？',
    },

    // 确认模态框
    confirmModal: {
      title: '确认',
      deleteTitle: '确认删除',
    },
  },

  en: {
    // App
    app: {
      loading: 'Loading...',
      error: 'Error',
      version: 'Version',
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      contacts: 'Contacts',
      companies: 'Companies',
      deals: 'Deals',
      tasks: 'Tasks',
      activities: 'Activities',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      totalContacts: 'Total Contacts',
      totalCompanies: 'Total Companies',
      totalDeals: 'Total Deals',
      pendingTasks: 'Pending Tasks',
      pipelineValue: 'Pipeline Value',
      pipelineByStage: 'Pipeline by Stage',
      upcomingTasks: 'Upcoming Tasks (7 days)',
      noDeals: 'No deals in pipeline',
      noUpcomingTasks: 'No upcoming tasks',
      deals: 'deals',
      alerts: 'Alerts',
      quickStats: 'Quick Stats',
      newDealsThisMonth: 'New Deals This Month',
      winRate: 'Win Rate',
      avgDealSize: 'Avg Deal Size',
      funnelView: 'Funnel View',
      staleDealsAlert: '{count} deals untouched for over 7 days',
      closingSoonAlert: '{count} deals expected to close this week',
      viewToggle: {
        card: 'Card View',
        table: 'Table View',
      },
      estimatedAnnualSpend: 'Est. Annual Spend',
      contactsCount: '{count} contacts',
      activeDeal: 'Active Deal',
      noActiveDeal: 'No active deals',
      industry: 'Industry',
      location: 'Location',
      employees: 'Employees',
    },

    // Contacts
    contacts: {
      title: 'Contacts',
      addContact: '+ Add Contact',
      editContact: 'Edit Contact',
      deleteContact: 'Delete Contact',
      saveContact: 'Save Contact',
      cancel: 'Cancel',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      tags: 'Tags',
      notes: 'Notes',
      noContacts: 'No contacts yet. Add your first contact!',
      confirmDelete: 'Are you sure you want to delete this contact?',
      createdSuccess: 'Contact created successfully',
      updatedSuccess: 'Contact updated successfully',
      deletedSuccess: 'Contact deleted successfully',
      createFailed: 'Failed to create contact',
      updateFailed: 'Failed to update contact',
      deleteFailed: 'Failed to delete contact',
    },

    // Companies
    companies: {
      title: 'Companies',
      addCompany: '+ Add Company',
      editCompany: 'Edit Company',
      deleteCompany: 'Delete Company',
      saveCompany: 'Save Company',
      cancel: 'Cancel',
      name: 'Company Name',
      website: 'Website',
      industry: 'Industry',
      phone: 'Phone',
      address: 'Address',
      notes: 'Notes',
      noCompanies: 'No companies yet. Add your first company!',
      confirmDelete: 'Are you sure you want to delete this company?',
      createdSuccess: 'Company created successfully',
      updatedSuccess: 'Company updated successfully',
      deletedSuccess: 'Company deleted successfully',
      createFailed: 'Failed to create company',
      updateFailed: 'Failed to update company',
      deleteFailed: 'Failed to delete company',
      contacts: 'Contacts',
      deals: 'Deals',
      cardView: 'Card View',
      tableView: 'Table View',
      contactsCount: '{count} contacts',
      dealValue: 'Estimated Value',
    },

    // Deals
    deals: {
      title: 'Deals Pipeline',
      addDeal: '+ Add Deal',
      editDeal: 'Edit Deal',
      deleteDeal: 'Delete Deal',
      saveDeal: 'Save Deal',
      cancel: 'Cancel',
      title: 'Title',
      value: 'Value ($)',
      stage: 'Stage',
      probability: 'Probability (%)',
      closeDate: 'Close Date',
      notes: 'Notes',
      noDeals: 'No deals yet. Add your first deal!',
      confirmDelete: 'Are you sure you want to delete this deal?',
      createdSuccess: 'Deal created successfully',
      updatedSuccess: 'Deal updated successfully',
      deletedSuccess: 'Deal deleted successfully',
      createFailed: 'Failed to create deal',
      updateFailed: 'Failed to update deal',
      deleteFailed: 'Failed to delete deal',
      company: 'Company',
      contact: 'Contact',
      weightedValue: 'Weighted Value',
      stages: {
        lead: 'Lead',
        qualified: 'Qualified',
        proposal: 'Proposal',
        negotiation: 'Negotiation',
        closed_won: 'Closed Won',
        closed_lost: 'Closed Lost',
      },
    },

    // Tasks
    tasks: {
      title: 'Tasks',
      addTask: '+ Add Task',
      editTask: 'Edit Task',
      deleteTask: 'Delete Task',
      saveTask: 'Save Task',
      cancel: 'Cancel',
      title: 'Title',
      description: 'Description',
      dueDate: 'Due Date',
      priority: 'Priority',
      status: 'Status',
      noTasks: 'No tasks yet. Add your first task!',
      confirmDelete: 'Are you sure you want to delete this task?',
      createdSuccess: 'Task created successfully',
      updatedSuccess: 'Task updated successfully',
      deletedSuccess: 'Task deleted successfully',
      createFailed: 'Failed to create task',
      updateFailed: 'Failed to update task',
      deleteFailed: 'Failed to delete task',
      priorities: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
      },
      statuses: {
        pending: 'Pending',
        completed: 'Completed',
      },
      due: 'Due',
    },

    // Activities
    activities: {
      title: 'Activities',
      addActivity: '+ Log Activity',
      editActivity: 'Edit Activity',
      deleteActivity: 'Delete Activity',
      saveActivity: 'Save Activity',
      cancel: 'Cancel',
      types: {
        title: 'Activity Type',
        call: 'Call',
        meeting: 'Meeting',
        email: 'Email',
        note: 'Note',
        other: 'Other',
      },
      date: 'Date',
      notes: 'Notes',
      contact: 'Contact',
      deal: 'Deal',
      noActivities: 'No activities yet. Log your first activity!',
      confirmDelete: 'Are you sure you want to delete this activity?',
      createdSuccess: 'Activity logged successfully',
      updatedSuccess: 'Activity updated successfully',
      deletedSuccess: 'Activity deleted successfully',
      createFailed: 'Failed to log activity',
      updateFailed: 'Failed to update activity',
      deleteFailed: 'Failed to delete activity',
    },

    // Buttons
    buttons: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      export: 'Export',
      search: 'Search',
    },

    // Messages
    messages: {
      loading: 'Loading...',
      noData: 'No data',
      saveSuccess: 'Saved successfully',
      deleteSuccess: 'Deleted successfully',
      operationFailed: 'Operation failed',
    },

    // Search
    search: {
      placeholder: 'Search contacts, companies, deals... (Cmd/Ctrl+K)',
      noResults: 'No results found',
      contacts: 'Contacts',
      companies: 'Companies',
      deals: 'Deals',
    },

    // Export
    export: {
      title: 'Export',
      contacts: 'Contacts',
      companies: 'Companies',
      deals: 'Deals',
      tasks: 'Tasks',
      exported: 'Exported',
      noData: 'No data to export',
      exportFailed: 'Export failed',
    },

    // Detail Views
    detail: {
      contactInfo: 'Contact Information',
      companyInfo: 'Company Information',
      dealInfo: 'Deal Information',
      linkedDeals: 'Linked Deals',
      linkedTasks: 'Linked Tasks',
      activities: 'Activities',
      noRelated: 'No related records',
      noContacts: 'No contacts',
      noDeals: 'No deals',
      noActivities: 'No activities',
      noNotes: 'No notes',
      delete: 'Delete',
      close: 'Close',
    },

    // Alerts & Priority
    alert: {
      warning: 'Warning',
      error: 'Error',
      info: 'Info',
    },

    priority: {
      hot: 'Hot',
      warm: 'Warm',
      cold: 'Cold',
    },

    // Toast
    toast: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
    },

    // Confirm
    confirm: {
      title: 'Confirm',
      deleteTitle: 'Confirm Delete',
      deleteMessage: 'This action cannot be undone. Are you sure?',
    },

    // Confirm Modal
    confirmModal: {
      title: 'Confirm',
      deleteTitle: 'Confirm Delete',
    },
  },
};

// 默认语言设置为中文
export const defaultLocale = 'zh';

// 当前语言
export let currentLocale = defaultLocale;

/**
 * 获取翻译值
 * @param {string} key - 点分隔的翻译键，如 'nav.dashboard'
 * @param {string} locale - 可选的语言覆盖
 * @returns {string} 翻译后的字符串
 */
export function t(key, locale) {
  const lang = locale || currentLocale;
  const keys = key.split('.');
  let value = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 回退到英文
      let enValue = translations.en;
      for (const ek of keys) {
        if (enValue && typeof enValue === 'object' && ek in enValue) {
          enValue = enValue[ek];
        } else {
          return key; // 找不到返回键名
        }
      }
      return enValue;
    }
  }

  return value || key;
}

/**
 * 设置当前语言
 * @param {string} locale - 语言代码 ('zh' | 'en')
 */
export function setLocale(locale) {
  if (translations[locale]) {
    currentLocale = locale;
    // 触发重新渲染事件
    window.dispatchEvent(new CustomEvent('locale-changed', { detail: { locale } }));
  }
}

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
export function getLocale() {
  return currentLocale;
}

/**
 * 获取所有支持的语言
 * @returns {Array} 支持的语言列表
 */
export function getSupportedLocales() {
  return Object.keys(translations);
}
