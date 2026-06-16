import type { DoLookupUserOptions } from './user-options';
import type { IntegrationContext } from './context';

/**
 * The function invoked on each poll cycle (interval tick or cron trigger).
 *
 * Receives admin-only user options (matching the integration's `config.json` shape)
 * and the full integration context. The function should perform its work and return
 * without a meaningful value — any returned value is discarded by the runtime.
 *
 * ### Execution Model
 *
 * Poll functions run in a **dedicated polling worker** that is separate from the
 * integration workers handling `doLookup`, `onMessage`, and `onDetails` dispatches.
 * Each poll function executes **once per integration** — not once per worker instance.
 * This means poll functions are singletons: even if multiple integration workers are
 * running, only one instance of each poller is active at any time.
 *
 * Because the polling worker is isolated, poll functions do not share in-memory state
 * with integration dispatch workers. Use `context.cache` to exchange data between
 * poll functions and dispatch handlers.
 *
 * @param options - Admin-only (global) user options for the integration.
 * @param context - The integration context providing cache, logger, limiter, and network utilities.
 */
export type PollFunction = (options: DoLookupUserOptions, context: IntegrationContext) => Promise<void>;

/**
 * Strategy the runtime uses when a poll function throws an unhandled error.
 *
 * - `'retry'` — The runtime catches the error and retries the poll function on
 *   the next scheduled tick. Useful for transient failures (e.g., network timeouts).
 * - `'shutdown'` — The runtime stops the integration entirely and surfaces the
 *   error to the Polarity frontend. Use for unrecoverable failures where continued
 *   polling would be harmful.
 * - `'skip'` — The runtime logs the error, skips the failed attempt, and schedules
 *   the next poll at the normal interval or cron time. Use when individual poll
 *   failures are acceptable and polling should continue uninterrupted.
 */
export type PollFailureStrategy = 'retry' | 'shutdown' | 'skip';

/**
 * Shared configuration for all poll specifications.
 */
interface BasePollSpec {
  /**
   * The function to invoke on each poll cycle.
   *
   * @see {@link PollFunction}
   */
  function: PollFunction;

  /**
   * Whether to start this poller automatically when the integration is loaded
   * by the runtime.
   *
   * - `true` — Polling begins immediately after the integration's `startup`
   *   hook completes.
   * - `false` (default) — Polling does not begin until explicitly started via
   *   `context.startPolling(pollName)`.
   *
   * @default false
   */
  autostart?: boolean;

  /**
   * Whether to execute the poll function immediately when the poller starts,
   * before waiting for the first interval tick or cron trigger.
   *
   * - `true` — The poll function fires once immediately on start, then
   *   continues on its normal schedule.
   * - `false` (default) — The first execution occurs after the first
   *   interval/cron tick.
   *
   * This applies to automatic start (when `autostart` is `true`). When a poller
   * is started manually via `context.startPolling()`, the method's own
   * `runImmediately` parameter takes precedence over this spec-level value.
   *
   * @default false
   */
  runImmediately?: boolean;

  /**
   * Strategy to use when the poll function throws an unhandled error.
   *
   * @default 'retry'
   * @see {@link PollFailureStrategy}
   */
  failureStrategy?: PollFailureStrategy;
}

/**
 * A poll specification that runs on a fixed time interval.
 *
 * The interval defines the delay **between** the completion of one invocation
 * and the start of the next — not a fixed-rate schedule. If the poll function
 * takes longer than the interval, executions will not overlap.
 *
 * @example
 * ```typescript
 * const spec: IntervalPollSpec = {
 *   function: doRefreshTokens,
 *   interval: 60,           // every 60 seconds
 *   autostart: true,
 *   runImmediately: true,   // fire once immediately on start
 *   failureStrategy: 'retry'
 * };
 * ```
 */
export interface IntervalPollSpec extends BasePollSpec {
  /**
   * Polling interval in **seconds**.
   *
   * Must be a positive number. The runtime waits this many seconds after the
   * previous invocation completes before starting the next one.
   */
  interval: number;

  /** @internal Discriminator — `cron` is not allowed on interval-based specs. */
  cron?: never;
}

/**
 * A poll specification that runs on a cron schedule.
 *
 * Uses standard 5-field cron syntax (`minute hour day-of-month month day-of-week`).
 * All times are evaluated in UTC.
 *
 * @example
 * ```typescript
 * const spec: CronPollSpec = {
 *   function: doWeeklyReport,
 *   cron: '0 9 * * 1',      // every Monday at 09:00 UTC
 *   failureStrategy: 'shutdown'
 * };
 * ```
 */
export interface CronPollSpec extends BasePollSpec {
  /**
   * A cron expression defining the polling schedule.
   *
   * Uses standard 5-field syntax: `minute hour day-of-month month day-of-week`.
   * All times are evaluated in UTC.
   *
   * Common patterns:
   * - `'0 9 * * *'` — daily at 09:00 UTC
   * - `'0 0 * * 6'` — every Saturday at midnight UTC
   * - `'0/5 * * * *'` — every 5 minutes (step syntax)
   */
  cron: string;

  /** @internal Discriminator — `interval` is not allowed on cron-based specs. */
  interval?: never;
}

/**
 * A single poll specification — either interval-based or cron-based.
 *
 * Use {@link IntervalPollSpec} for fixed-delay polling (e.g., every 30 seconds)
 * or {@link CronPollSpec} for calendar-based scheduling (e.g., daily at 9 AM).
 *
 * These two forms are mutually exclusive: a spec must define either `interval`
 * or `cron`, but never both.
 */
export type PollSpec = IntervalPollSpec | CronPollSpec;

/**
 * A record of named poll specifications exported by an integration.
 *
 * Each key is the **poll name** — a unique identifier used with
 * `context.startPolling()` and `context.stopPolling()` to manually control
 * individual pollers at runtime.
 *
 * ### Runtime Behavior
 *
 * Pollers execute in a **dedicated polling worker** that is independent of the
 * integration workers handling lookup and message dispatches. Regardless of how
 * many integration worker instances are running, each poller runs exactly **once
 * per integration** — ensuring that scheduled tasks (e.g., token refresh, report
 * generation) are not duplicated across workers.
 *
 * @example Basic polling configuration
 * ```typescript
 * import type { Poll } from '@polarityio/integration-types';
 *
 * const poll: Poll = {
 *   refreshTokens: {
 *     function: doRefreshTokens,
 *     interval: 30,              // every 30 seconds
 *     autostart: true,
 *     runImmediately: true
 *   },
 *   weeklyReport: {
 *     function: doWeeklyReport,
 *     cron: '0 9 * * 1',         // Mondays at 09:00 UTC
 *     failureStrategy: 'shutdown'
 *   }
 * };
 *
 * export { poll };
 * ```
 *
 * @example One-time initialization pattern
 *
 * Because poll functions are singletons (one instance per integration), you can
 * use a poller with `runImmediately: true` and `autostart: true` to guarantee a
 * function runs exactly once across all integration workers. The function stops
 * itself after the first execution by calling `context.stopPolling()`.
 *
 * ```typescript
 * import type { Poll, PollFunction } from '@polarityio/integration-types';
 *
 * const initializeOnce: PollFunction = async (options, context) => {
 *   // Perform one-time setup (e.g., seed cache, register webhooks)
 *   await seedIntegrationCache(options, context);
 *
 *   // Stop the poller — this function will never run again
 *   context.stopPolling('initialize');
 * };
 *
 * const poll: Poll = {
 *   initialize: {
 *     function: initializeOnce,
 *     interval: 60,             // interval is required but irrelevant here
 *     autostart: true,
 *     runImmediately: true      // fire immediately on integration load
 *   }
 * };
 *
 * export { poll };
 * ```
 */
export type Poll = Record<string, PollSpec>;
