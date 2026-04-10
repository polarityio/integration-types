/**
 * Bunyan-compatible logger interface used by Polarity integrations.
 *
 * Each log level method supports multiple call signatures:
 * - No arguments: returns `true` if the level is enabled
 * - `Error` as first argument: logs the error with stack trace
 * - `Object` as first argument: merges fields into the log record
 * - String/format as first argument: logs a formatted message
 *
 * @example
 * ```typescript
 * // Check if level is enabled
 * if (logger.trace()) { ... }
 *
 * // Log with structured fields
 * logger.info({ entityValue: '8.8.8.8' }, 'Looking up entity');
 *
 * // Log an error
 * logger.error(err, 'Request failed');
 *
 * // Create a child logger with bound fields
 * const child = logger.child({ module: 'api-client' });
 * ```
 */
export interface Logger {
  /** Create a child logger with additional bound fields. */
  child(options: object, simple?: boolean): Logger;

  /** Returns true if the `trace` level is enabled. */
  trace(): boolean;
  /** Log an Error at the `trace` level. */
  trace(error: Error, ...params: unknown[]): void;
  /** Log with merged fields at the `trace` level. */
  trace(obj: object, ...params: unknown[]): void;
  /** Log a formatted message at the `trace` level. */
  trace(format: string, ...params: unknown[]): void;

  /** Returns true if the `debug` level is enabled. */
  debug(): boolean;
  /** Log an Error at the `debug` level. */
  debug(error: Error, ...params: unknown[]): void;
  /** Log with merged fields at the `debug` level. */
  debug(obj: object, ...params: unknown[]): void;
  /** Log a formatted message at the `debug` level. */
  debug(format: string, ...params: unknown[]): void;

  /** Returns true if the `info` level is enabled. */
  info(): boolean;
  /** Log an Error at the `info` level. */
  info(error: Error, ...params: unknown[]): void;
  /** Log with merged fields at the `info` level. */
  info(obj: object, ...params: unknown[]): void;
  /** Log a formatted message at the `info` level. */
  info(format: string, ...params: unknown[]): void;

  /** Returns true if the `warn` level is enabled. */
  warn(): boolean;
  /** Log an Error at the `warn` level. */
  warn(error: Error, ...params: unknown[]): void;
  /** Log with merged fields at the `warn` level. */
  warn(obj: object, ...params: unknown[]): void;
  /** Log a formatted message at the `warn` level. */
  warn(format: string, ...params: unknown[]): void;

  /** Returns true if the `error` level is enabled. */
  error(): boolean;
  /** Log an Error at the `error` level. */
  error(error: Error, ...params: unknown[]): void;
  /** Log with merged fields at the `error` level. */
  error(obj: object, ...params: unknown[]): void;
  /** Log a formatted message at the `error` level. */
  error(format: string, ...params: unknown[]): void;

  /** Returns true if the `fatal` level is enabled. */
  fatal(): boolean;
  /** Log an Error at the `fatal` level. */
  fatal(error: Error, ...params: unknown[]): void;
  /** Log with merged fields at the `fatal` level. */
  fatal(obj: object, ...params: unknown[]): void;
  /** Log a formatted message at the `fatal` level. */
  fatal(format: string, ...params: unknown[]): void;
}
