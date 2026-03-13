const { app, BrowserWindow } = require('electron');
const path = require('path');

const { mainLogger } = require('./logger');
const { dbManager } = require('../db/database');
const { initializeDbHandlers } = require('./ipc-handlers');

const LOG_PREFIX = '[MAIN]';

// Disable GPU hardware acceleration for better compatibility
app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#1a1a1a',
    show: false,
  });

  // Load the app
  const isDev = process.env.NODE_ENV !== 'production';
  const port = process.env.PORT || 5173;
  if (isDev) {
    mainWindow.loadURL(`http://localhost:${port}`);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  mainLogger.info(`${LOG_PREFIX} Application starting...`);

  // Initialize database
  try {
    dbManager.init();
    dbManager.runMigrations();
    mainLogger.info(`${LOG_PREFIX} Database initialized and migrated`);
  } catch (error) {
    mainLogger.error(`${LOG_PREFIX} Database initialization failed`, { error: error.message });
    throw error;
  }

  // Initialize IPC handlers
  initializeDbHandlers();
  mainLogger.info(`${LOG_PREFIX} IPC handlers initialized`);

  // Create the main window
  createWindow();
  mainLogger.info(`${LOG_PREFIX} Main window created`);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  mainLogger.info(`${LOG_PREFIX} Application shutting down...`);

  // Close database connection
  try {
    dbManager.close();
  } catch (error) {
    mainLogger.error(`${LOG_PREFIX} Error closing database`, { error: error.message });
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  mainLogger.info(`${LOG_PREFIX} Before quit - cleaning up resources`);
  dbManager.close();
});
