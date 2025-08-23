import { config } from '../config/environment';

export class Logger {
  private static isDebugMode(): boolean {
    return config.LOG_LEVEL.toUpperCase() === 'DEBUG';
  }

  static debug(message: string): void {
    if (this.isDebugMode()) {
      console.log(message);
    }
  }

  static debugObject(label: string, obj: any): void {
    if (this.isDebugMode()) {
      console.log(label);
      console.log(JSON.stringify(obj, null, 2));
    }
  }

  static info(message: string): void {
    // Info messages are always shown regardless of log level
    console.log(message);
  }
}
