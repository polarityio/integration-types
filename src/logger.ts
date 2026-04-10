/**
 * Logger interface used by Polarity integrations.
 */
export interface Logger {
  child?(arg: unknown): Logger;
  info(...args: unknown[]): void;
  debug(...args: unknown[]): void;
  trace(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
  fatal(...args: unknown[]): void;
}
