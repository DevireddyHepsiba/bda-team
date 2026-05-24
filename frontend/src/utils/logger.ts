/**
 * Logger Utility
 * Centralized logging for frontend and debugging
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private isDev = import.meta.env.DEV;

  private createEntry(
    level: LogLevel,
    message: string,
    data?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  info(message: string, data?: any) {
    const entry = this.createEntry("info", message, data);
    this.logs.push(entry);
    if (this.isDev) console.log(`[INFO] ${message}`, data);
  }

  warn(message: string, data?: any) {
    const entry = this.createEntry("warn", message, data);
    this.logs.push(entry);
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, data?: any) {
    const entry = this.createEntry("error", message, data);
    this.logs.push(entry);
    console.error(`[ERROR] ${message}`, data);
  }

  debug(message: string, data?: any) {
    if (this.isDev) {
      const entry = this.createEntry("debug", message, data);
      this.logs.push(entry);
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
