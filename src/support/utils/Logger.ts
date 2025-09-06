/**
 * Logger Utility
 * Centralized logging for test execution tracking
 */

export interface LogData {
  [key: string]: any;
}

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private context: string;
  private logLevel: LogLevel;

  constructor(context: string, logLevel: LogLevel = LogLevel.INFO) {
    this.context = context;
    this.logLevel = logLevel;
  }

  private formatMessage(level: string, message: string, data?: LogData): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(data && { data })
    };
    
    return JSON.stringify(logEntry, null, 2);
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  error(message: string, data?: LogData): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, data));
    }
  }

  warn(message: string, data?: LogData): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, data));
    }
  }

  info(message: string, data?: LogData): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage('INFO', message, data));
    }
  }

  debug(message: string, data?: LogData): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage('DEBUG', message, data));
    }
  }

  /**
   * Log test step execution
   */
  step(stepName: string, status: 'START' | 'PASS' | 'FAIL', duration?: number, data?: LogData): void {
    const logData = {
      step: stepName,
      status,
      ...(duration && { duration: `${duration}ms` }),
      ...data
    };

    if (status === 'FAIL') {
      this.error(`Step failed: ${stepName}`, logData);
    } else {
      this.info(`Step ${status.toLowerCase()}: ${stepName}`, logData);
    }
  }

  /**
   * Log test scenario execution
   */
  scenario(scenarioName: string, status: 'START' | 'PASS' | 'FAIL', tags?: string[], data?: LogData): void {
    const logData = {
      scenario: scenarioName,
      status,
      ...(tags && { tags }),
      ...data
    };

    if (status === 'FAIL') {
      this.error(`Scenario failed: ${scenarioName}`, logData);
    } else {
      this.info(`Scenario ${status.toLowerCase()}: ${scenarioName}`, logData);
    }
  }

  /**
   * Log manual test procedure
   */
  manualTest(testId: string, procedure: string, status: 'DOCUMENTED' | 'READY' | 'IN_PROGRESS' | 'COMPLETED', data?: LogData): void {
    const logData = {
      testId,
      procedure: procedure.substring(0, 100) + (procedure.length > 100 ? '...' : ''),
      status,
      ...data
    };

    this.info(`Manual test ${status.toLowerCase()}: ${testId}`, logData);
  }

  /**
   * Log API request/response
   */
  api(method: string, url: string, status: number, duration: number, data?: LogData): void {
    const logData = {
      method,
      url,
      status,
      duration: `${duration}ms`,
      ...data
    };

    if (status >= 400) {
      this.error(`API request failed: ${method} ${url}`, logData);
    } else {
      this.info(`API request: ${method} ${url}`, logData);
    }
  }
}
