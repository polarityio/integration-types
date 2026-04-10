import type { DoLookupUserOptions } from './user-options';
import type { IntegrationContext } from './context';

/**
 * A function that is called on a polling schedule.
 *
 * Receives admin-only (global) user options and the integration context.
 */
export type PollFunction = (
  options: DoLookupUserOptions,
  context: IntegrationContext
) => Promise<void>;

interface BasePollSpec {
  /** The function to call on each poll cycle. */
  function: PollFunction;
  /**
   * Whether to start polling automatically when the integration loads.
   * If `false`, polling must be started manually via `context.startPolling()`.
   */
  autostart?: boolean;
  /**
   * Strategy to use when the poll function throws an error.
   *
   * - `'restart'` — Retry the function with linear backoff until it succeeds,
   *   then resume the normal schedule.
   * - `'shutdown'` — Stop the integration and report an error to the frontend.
   */
  failureStrategy?: 'restart' | 'shutdown';
}

/**
 * A poll specification that runs on a fixed interval.
 */
export interface IntervalPollSpec extends BasePollSpec {
  /** Polling interval in milliseconds. */
  interval: number;
  cron?: never;
}

/**
 * A poll specification that runs on a cron schedule.
 */
export interface CronPollSpec extends BasePollSpec {
  /** A cron expression defining the polling schedule (e.g., `"0 9 * * *"`). */
  cron: string;
  interval?: never;
}

/**
 * A single poll specification — either interval-based or cron-based.
 */
export type PollSpec = IntervalPollSpec | CronPollSpec;

/**
 * A record of named poll specifications exported by an integration.
 *
 * Each key is the poll name (used with `context.startPolling()` / `context.stopPolling()`),
 * and the value defines the schedule and function to call.
 *
 * @example
 * ```typescript
 * const poll: Poll = {
 *   refreshTokens: {
 *     function: doRefreshTokens,
 *     interval: 10000,
 *     autostart: true
 *   },
 *   uploadReport: {
 *     function: doUploadReport,
 *     cron: "0 9 * * *",
 *     failureStrategy: "restart"
 *   }
 * };
 * ```
 */
export type Poll = Record<string, PollSpec>;
