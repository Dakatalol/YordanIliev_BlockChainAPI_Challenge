import { config } from '../config/environment';

/**
 * Simple logging utility with configurable debug mode
 * Controls log output based on LOG_LEVEL environment configuration
 */
export class Logger {
  private static isDebugMode(): boolean {
    return config.LOG_LEVEL.toUpperCase() === 'DEBUG';
  }

  /**
   * Logs a debug message if debug mode is enabled
   * @param message - The debug message to log
   */
  static debug(message: string): void {
    if (this.isDebugMode()) {
      console.log(message);
    }
  }

  /**
   * Logs an object with a label in debug mode
   * @param label - Label to describe the object being logged
   * @param obj - The object to log as formatted JSON
   */
  static debugObject(label: string, obj: any): void {
    if (this.isDebugMode()) {
      console.log(label);
      console.log(JSON.stringify(obj, null, 2));
    }
  }

  /**
   * Logs an info message (always shown regardless of log level)
   * @param message - The info message to log
   */
  static info(message: string): void {
    console.log(message);
  }
}
