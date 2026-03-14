const fs = require('fs');
const path = require('path');
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
const XLSX = require('xlsx');

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

  // Import handlers
  ipcMain.handle('import:parseFile', async (_, filePath) => {
    mainLogger.info(`${LOG_PREFIX} Handling import:parseFile for ${filePath}`);
    try {
      const ext = path.extname(filePath).toLowerCase();

      let data;
      if (ext === '.csv') {
        // Read CSV file
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        data = lines.slice(1).map(line => {
          const values = line.split(',');
          const row = {};
          headers.forEach((header, idx) => {
            row[mapHeader(header)] = values[idx]?.trim() || '';
          });
          return row;
        });
      } else if (['.xlsx', '.xls'].includes(ext)) {
        // Read Excel file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);

        // Map headers
        data = data.map(row => {
          const mapped = {};
          Object.keys(row).forEach(key => {
            const mappedKey = mapHeader(key.toLowerCase());
            if (mappedKey) {
              mapped[mappedKey] = row[key];
            }
          });
          return mapped;
        });
      } else {
        return { success: false, error: '不支持的文件格式' };
      }

      return { success: true, data };
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error parsing file`, { error: error.message });
      return { success: false, error: error.message };
    }
  });

    // AI Search handler
  ipcMain.handle('ai:search', async (_, { query, type }) => {
    mainLogger.info(`${LOG_PREFIX} Handling ai:search for query="${query}", type="${type}"`);
    try {
      // 本地搜索优先 - 在现有数据中搜索
      let localResults = null;
      
      if (type === 'company') {
        const companies = repos.companies.findAll();
        localResults = companies.find(c => 
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.website?.toLowerCase().includes(query.toLowerCase())
        );
        
        if (!localResults) {
          // 模拟 AI 搜索结果（实际项目中可调用外部 API）
          localResults = {
            name: query,
            website: `https://www.${query.toLowerCase().replace(/\s+/g, '')}.com`,
            industry: '科技/互联网',
            phone: '400-xxx-xxxx',
            address: '北京市海淀区',
            notes: `关于 ${query} 的简介信息 - 可通过真实 API 获取`,
          };
        }
      } else if (type === 'contact') {
        const contacts = repos.contacts.findAll();
        localResults = contacts.find(c => 
          c.name.toLowerCase().includes(query.toLowerCase())
        );
        
        if (!localResults) {
          // 模拟 AI 搜索结果
          localResults = {
            name: query,
            email: `${query.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            phone: '138-xxxx-xxxx',
            company_name: '未知公司',
            notes: `关于 ${query} 的简介信息 - 可通过真实 API 获取`,
          };
        }
      }

      return { success: true, data: localResults };
    } catch (error) {
      mainLogger.error(`${LOG_PREFIX} Error in ai:search`, { error: error.message });
      return { success: false, error: error.message };
    }
  });

mainLogger.info(`${LOG_PREFIX} All database IPC handlers initialized`);
}

// Helper function to map various header names to our field names
function mapHeader(header) {
  const mappings = {
    // Name mappings
    'name': 'name',
    '姓名': 'name',
    'fullname': 'name',
    'full name': 'name',

    // Email mappings
    'email': 'email',
    '邮箱': 'email',
    'e-mail': 'email',
    'mail': 'email',

    // Phone mappings
    'phone': 'phone',
    '电话': 'phone',
    'tel': 'phone',
    'telephone': 'phone',
    'mobile': 'phone',
    '手机': 'phone',

    // Company mappings
    'company': 'company_name',
    '公司': 'company_name',
    'company name': 'company_name',
    'organization': 'company_name',

    // Website mappings
    'website': 'website',
    '网站': 'website',
    'url': 'website',
    'web': 'website',

    // Industry mappings
    'industry': 'industry',
    '行业': 'industry',
    'sector': 'industry',

    // Address mappings
    'address': 'address',
    '地址': 'address',
    'location': 'address',
    'city': 'address',

    // Tags mappings
    'tags': 'tags',
    '标签': 'tags',
    'label': 'tags',
    'labels': 'tags',

    // Notes mappings
    'notes': 'notes',
    '备注': 'notes',
    'note': 'notes',
    'remark': 'notes',
    'remarks': 'notes',
  };

  // Clean header and find mapping
  const cleaned = header.trim().toLowerCase();
  return mappings[cleaned] || null;
}

module.exports = { initializeDbHandlers };
