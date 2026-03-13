const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppInfo: () => ipcRenderer.invoke('app:info'),

  // Database operations
  db: {
    // Contacts
    getContacts: () => ipcRenderer.invoke('db:contacts:all'),
    getContact: (id) => ipcRenderer.invoke('db:contacts:get', id),
    createContact: (data) => ipcRenderer.invoke('db:contacts:create', data),
    updateContact: (id, data) => ipcRenderer.invoke('db:contacts:update', id, data),
    deleteContact: (id) => ipcRenderer.invoke('db:contacts:delete', id),

    // Companies
    getCompanies: () => ipcRenderer.invoke('db:companies:all'),
    getCompany: (id) => ipcRenderer.invoke('db:companies:get', id),
    createCompany: (data) => ipcRenderer.invoke('db:companies:create', data),
    updateCompany: (id, data) => ipcRenderer.invoke('db:companies:update', id, data),
    deleteCompany: (id) => ipcRenderer.invoke('db:companies:delete', id),

    // Deals
    getDeals: () => ipcRenderer.invoke('db:deals:all'),
    getDeal: (id) => ipcRenderer.invoke('db:deals:get', id),
    createDeal: (data) => ipcRenderer.invoke('db:deals:create', data),
    updateDeal: (id, data) => ipcRenderer.invoke('db:deals:update', id, data),
    deleteDeal: (id) => ipcRenderer.invoke('db:deals:delete', id),
    getPipelineSummary: () => ipcRenderer.invoke('db:deals:pipeline-summary'),

    // Tasks
    getTasks: () => ipcRenderer.invoke('db:tasks:all'),
    getTask: (id) => ipcRenderer.invoke('db:tasks:get', id),
    createTask: (data) => ipcRenderer.invoke('db:tasks:create', data),
    updateTask: (id, data) => ipcRenderer.invoke('db:tasks:update', id, data),
    deleteTask: (id) => ipcRenderer.invoke('db:tasks:delete', id),
    getUpcomingTasks: (days) => ipcRenderer.invoke('db:tasks:upcoming', days),

    // Activities
    getActivities: () => ipcRenderer.invoke('db:activities:all'),
    getActivity: (id) => ipcRenderer.invoke('db:activities:get', id),
    createActivity: (data) => ipcRenderer.invoke('db:activities:create', data),
    updateActivity: (id, data) => ipcRenderer.invoke('db:activities:update', id, data),
    deleteActivity: (id) => ipcRenderer.invoke('db:activities:delete', id),
    getRecentActivities: (limit) => ipcRenderer.invoke('db:activities:recent', limit),
  },

  // File system operations
  saveFile: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
  showSaveDialog: (defaultPath) => ipcRenderer.invoke('file:saveDialog', defaultPath),
});
