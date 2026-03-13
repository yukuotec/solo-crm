// Logger for renderer process
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
  }

  _write(level, message, data) {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}] ` : '';
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${prefix}${message}${dataStr}`;

    // Log to console based on level
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](logLine);
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

export const logger = new Logger('RENDERER');
