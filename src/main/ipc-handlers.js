const fs = require('fs');
const { ipcMain, dialog } = require('electron');
const { dbManager } = require('../db/database');
const {
  ContactRepository,
  CompanyRepository,
  DealRepository,
  TaskRepository,
  ActivityRepository,
} = require('../db/repositories');
const { mainLogger } = require('../main/logger');

const LOG_PREFIX = '[IPC]';

let repos = {};

function initializeDbHandlers() {
  mainLogger.info(`${LOG_PREFIX} Initializing database IPC handlers`);

  // Initialize repositories
  repos = {
    contacts: new ContactRepository(),
    companies: new CompanyRepository(),
    deals: new DealRepository(),
    tasks: new TaskRepository(),
    activities: new ActivityRepository(),
  };

  // App handlers
  ipcMain.handle('app:info', () => {
    const { app } = require('electron');
    return {
      version: app.getVersion(),
      platform: process.platform,
      userDataPath: app.getPath('userData'),
    };
  });

  // File system handlers for export
  ipcMain.handle('file:save', async (_, filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error saving file`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('file:saveDialog', async (_, defaultPath) => {
    try {
      const result = await dialog.showSaveDialog({
        defaultPath,
      });
      return result.filePath;
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error showing save dialog`, { error: error.message });
      throw error;
    }
  });

  // Contact handlers
  ipcMain.handle('db:contacts:all', () => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:contacts:all`);
    try {
      return repos.contacts.findAll();
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:contacts:all`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:contacts:get', (_, id) => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:contacts:get for id=${id}`);
    try {
      return repos.contacts.findById(id);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:contacts:get`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:contacts:create', (_, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:contacts:create`, data);
    try {
      return repos.contacts.create(data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:contacts:create`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:contacts:update', (_, id, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:contacts:update for id=${id}`);
    try {
      return repos.contacts.update(id, data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:contacts:update`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:contacts:delete', (_, id) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:contacts:delete for id=${id}`);
    try {
      const result = repos.contacts.delete(id);
      return { success: !!result.changes };
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:contacts:delete`, { error: error.message });
      throw error;
    }
  });

  // Company handlers
  ipcMain.handle('db:companies:all', () => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:companies:all`);
    try {
      return repos.companies.findAll();
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:companies:all`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:companies:get', (_, id) => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:companies:get for id=${id}`);
    try {
      return repos.companies.findById(id);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:companies:get`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:companies:create', (_, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:companies:create`, data);
    try {
      return repos.companies.create(data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:companies:create`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:companies:update', (_, id, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:companies:update for id=${id}`);
    try {
      return repos.companies.update(id, data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:companies:update`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:companies:delete', (_, id) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:companies:delete for id=${id}`);
    try {
      const result = repos.companies.delete(id);
      return { success: !!result.changes };
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:companies:delete`, { error: error.message });
      throw error;
    }
  });

  // Deal handlers
  ipcMain.handle('db:deals:all', () => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:deals:all`);
    try {
      return repos.deals.findAll();
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:deals:all`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:deals:get', (_, id) => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:deals:get for id=${id}`);
    try {
      return repos.deals.findById(id);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:deals:get`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:deals:create', (_, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:deals:create`, data);
    try {
      return repos.deals.create(data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:deals:create`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:deals:update', (_, id, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:deals:update for id=${id}`);
    try {
      return repos.deals.update(id, data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:deals:update`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:deals:delete', (_, id) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:deals:delete for id=${id}`);
    try {
      const result = repos.deals.delete(id);
      return { success: !!result.changes };
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:deals:delete`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:deals:pipeline-summary', () => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:deals:pipeline-summary`);
    try {
      return repos.deals.getPipelineSummary();
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:deals:pipeline-summary`, { error: error.message });
      throw error;
    }
  });

  // Task handlers
  ipcMain.handle('db:tasks:all', () => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:tasks:all`);
    try {
      return repos.tasks.findAll();
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:tasks:all`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:tasks:get', (_, id) => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:tasks:get for id=${id}`);
    try {
      return repos.tasks.findById(id);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:tasks:get`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:tasks:create', (_, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:tasks:create`, data);
    try {
      return repos.tasks.create(data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:tasks:create`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:tasks:update', (_, id, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:tasks:update for id=${id}`);
    try {
      return repos.tasks.update(id, data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:tasks:update`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:tasks:delete', (_, id) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:tasks:delete for id=${id}`);
    try {
      const result = repos.tasks.delete(id);
      return { success: !!result.changes };
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:tasks:delete`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:tasks:upcoming', (_, days) => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:tasks:upcoming for ${days} days`);
    try {
      return repos.tasks.findUpcoming(days);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:tasks:upcoming`, { error: error.message });
      throw error;
    }
  });

  // Activity handlers
  ipcMain.handle('db:activities:all', () => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:activities:all`);
    try {
      return repos.activities.findAll();
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:activities:all`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:activities:get', (_, id) => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:activities:get for id=${id}`);
    try {
      return repos.activities.findById(id);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:activities:get`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:activities:create', (_, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:activities:create`, data);
    try {
      return repos.activities.create(data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:activities:create`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:activities:update', (_, id, data) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:activities:update for id=${id}`);
    try {
      return repos.activities.update(id, data);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:activities:update`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:activities:delete', (_, id) => {
    mainLogger.info(`${LOG_PREFIX} Handling db:activities:delete for id=${id}`);
    try {
      const result = repos.activities.delete(id);
      return { success: !!result.changes };
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:activities:delete`, { error: error.message });
      throw error;
    }
  });

  ipcMain.handle('db:activities:recent', (_, limit) => {
    mainLogger.debug(`${LOG_PREFIX} Handling db:activities:recent for limit=${limit}`);
    try {
      return repos.activities.getRecent(limit);
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in db:activities:recent`, { error: error.message });
      throw error;
    }
  });

  mainLogger.info(`${LOG_PREFIX} All database IPC handlers initialized`);
}

module.exports = { initializeDbHandlers };
