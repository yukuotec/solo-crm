const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const CURRENT_LEVEL = LOG_LEVELS.debug;

class Logger {
  constructor(prefix = '') {
    this.prefix = prefix;
    this.logDir = path.join(app.getPath('userData'), 'logs');
    this.logFile = path.join(this.logDir, `main-${new Date().toISOString().split('T')[0]}.log`);

    // Ensure log directory exists
    try {
      fs.mkdirSync(this.logDir, { recursive: true });
    } catch (e) {
      // Ignore errors
    }
  }

  _write(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}] ` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${prefix}${message}${dataStr}\n`;

    // Always log to console
    console.log(logLine.trim());

    // Also write to file
    try {
      fs.appendFileSync(this.logFile, logLine);
    } catch (e) {
      // Silent fail for file logging
    }
  }

  error(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.error) this._write('error', message, data);
  }

  warn(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.warn) this._write('warn', message, data);
  }

  info(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.info) this._write('info', message, data);
  }

  debug(message, data) {
    if (CURRENT_LEVEL >= LOG_LEVELS.debug) this._write('debug', message, data);
  }
}

const mainLogger = new Logger('MAIN');

module.exports = { Logger, mainLogger };
