/**
 * Options that can be passed to {@link Limiter.schedule} to control
 * job priority and identification within the throttle queue.
 */
export interface ScheduleOptions {
  /** Priority of the job (1 = highest, 9 = lowest). Default is 5. */
  priority?: number;
  /** Optional identifier for the scheduled job (useful for debugging). */
  id?: string;
  /** Weight of the job against the `maxConcurrent` limit. Default is 1. */
  weight?: number;
  /** Maximum time (ms) a job can stay in the queue before being dropped. */
  expiration?: number | null;
}

/**
 * Current counts of jobs in various states within the limiter.
 */
export interface LimiterCounts {
  /** Number of jobs currently executing. */
  EXECUTING: number;
  /** Number of jobs waiting in the queue. */
  QUEUED: number;
  /** Number of jobs currently running (alias for EXECUTING in some contexts). */
  RUNNING: number;
  /** Number of jobs that have completed. */
  DONE: number;
  /** Number of jobs received but not yet queued or executing. */
  RECEIVED: number;
}

/**
 * Settings that can be dynamically updated on the limiter at runtime.
 * All properties are optional — only provided values are changed.
 */
export interface ThrottleSettings {
  /**
   * Maximum number of jobs that can execute concurrently.
   * @default 10
   */
  maxConcurrent?: number;
  /**
   * Minimum time (in milliseconds) between job starts.
   * @default 100
   */
  minTime?: number;
  /**
   * Maximum number of jobs allowed in the queue.
   * Jobs submitted beyond this limit are handled according to `strategy`.
   * @default 100
   */
  highWater?: number;
  /**
   * Strategy for handling jobs when `highWater` is reached.
   * - `1` (LEAK): Drop the oldest job in the queue.
   * - `2` (OVERFLOW_PRIORITY): Drop the lowest-priority job.
   * - `3` (OVERFLOW): Drop the incoming job (reject it immediately).
   * - `4` (BLOCK): Block until a slot opens.
   * @default 3 (OVERFLOW)
   */
  strategy?: number;
  /**
   * Reservoir — the total number of jobs the limiter will execute before
   * stopping. Useful for API rate limits (e.g., 100 requests per minute).
   * Set to `null` to disable.
   */
  reservoir?: number | null;
  /**
   * Interval (ms) at which the reservoir is automatically refilled.
   */
  reservoirRefreshInterval?: number | null;
  /**
   * Value to reset the reservoir to on each refresh interval.
   */
  reservoirRefreshAmount?: number | null;
  /**
   * Maximum value the reservoir can reach when being incremented.
   */
  reservoirIncreaseMaximum?: number | null;
  /**
   * Amount to increase the reservoir by on each interval.
   */
  reservoirIncreaseAmount?: number | null;
  /**
   * Interval (ms) at which the reservoir is incremented.
   */
  reservoirIncreaseInterval?: number | null;
}

/**
 * A scoped limiter instance bound to a specific key (e.g., a user or tenant).
 * Scoped limiters share the same settings as the parent but maintain
 * independent concurrency/rate state per scope key. Idle scopes are
 * garbage-collected after 5 minutes of inactivity.
 */
export interface ScopedLimiter {
  /**
   * Schedule an async job within this scope's rate limit.
   *
   * @param fn - The async function to execute when a slot is available.
   * @returns A promise that resolves with the return value of `fn`.
   *
   * @example
   * ```ts
   * const scoped = context.limiter.scope(userId);
   * const result = await scoped.schedule(async () => {
   *   return await fetchUserData(userId);
   * });
   * ```
   */
  schedule<T>(fn: () => Promise<T>): Promise<T>;

  /**
   * Schedule an async job with explicit scheduling options.
   *
   * @param options - Priority, id, weight, and expiration settings.
   * @param fn - The async function to execute when a slot is available.
   * @returns A promise that resolves with the return value of `fn`.
   */
  schedule<T>(options: ScheduleOptions, fn: () => Promise<T>): Promise<T>;
}

/**
 * Distributed rate limiter available on the integration context as `context.limiter`.
 *
 * Backed by Redis (via Bottleneck) so all workers for an integration share
 * rate-limit state. Supports global throttling, per-key scoped throttling,
 * and dynamic settings updates at runtime.
 *
 * @example
 * ```ts
 * // Basic usage — schedule work through the global limiter
 * const result = await context.limiter.schedule(async () => {
 *   return await apiClient.get('/resource');
 * });
 *
 * // Per-user scoped throttling
 * const userResult = await context.limiter.scope(userId).schedule(async () => {
 *   return await apiClient.get(`/users/${userId}/data`);
 * });
 *
 * // Dynamically tighten the rate limit
 * await context.limiter.updateSettings({ minTime: 500, maxConcurrent: 5 });
 * ```
 */
export interface Limiter {
  /**
   * Schedule an async job to run within the integration's global rate limit.
   * The job will execute once a concurrency slot is available and the
   * minimum time between jobs has elapsed.
   *
   * @param fn - The async function to execute when a slot is available.
   * @returns A promise that resolves with the return value of `fn`.
   *
   * @example
   * ```ts
   * const data = await context.limiter.schedule(async () => {
   *   return await fetch('https://api.example.com/data');
   * });
   * ```
   */
  schedule<T>(fn: () => Promise<T>): Promise<T>;

  /**
   * Schedule an async job with explicit scheduling options (priority, id, etc.).
   *
   * @param options - Options controlling priority, weight, and expiration.
   * @param fn - The async function to execute when a slot is available.
   * @returns A promise that resolves with the return value of `fn`.
   *
   * @example
   * ```ts
   * const result = await context.limiter.schedule(
   *   { priority: 1, id: 'critical-job' },
   *   async () => await criticalApiCall()
   * );
   * ```
   */
  schedule<T>(options: ScheduleOptions, fn: () => Promise<T>): Promise<T>;

  /**
   * Dynamically update the limiter's throttle settings at runtime.
   * Updates propagate to all scoped (per-key) limiters as well.
   *
   * Only the provided properties are changed; omitted properties retain
   * their current values.
   *
   * @param updates - Partial throttle settings to apply.
   *
   * @example
   * ```ts
   * // Slow down after receiving a 429 response
   * await context.limiter.updateSettings({ minTime: 1000, maxConcurrent: 2 });
   * ```
   */
  updateSettings(updates: ThrottleSettings): Promise<void>;

  /**
   * Get current job counts (executing, queued, running, done, received).
   *
   * @returns An object with counts for each job state.
   *
   * @example
   * ```ts
   * const counts = context.limiter.counts();
   * console.log(`${counts.EXECUTING} jobs running, ${counts.QUEUED} queued`);
   * ```
   */
  counts(): LimiterCounts;

  /**
   * Get or create a scoped limiter for the given identifier.
   * Scoped limiters are useful for per-user or per-tenant rate limiting.
   * Each scope maintains independent concurrency and timing state but
   * inherits settings from the parent. Idle scopes are garbage-collected
   * after 5 minutes.
   *
   * @param identifier - A unique key for this scope (e.g., user ID, tenant ID).
   * @returns A {@link ScopedLimiter} bound to the given key.
   *
   * @example
   * ```ts
   * const userLimiter = context.limiter.scope(userId);
   * const result = await userLimiter.schedule(async () => {
   *   return await fetchUserSpecificData(userId);
   * });
   * ```
   */
  scope(identifier: string): ScopedLimiter;

  /**
   * Get a snapshot of the current throttle settings.
   *
   * @returns A copy of the active settings (maxConcurrent, minTime, etc.).
   */
  settings(): ThrottleSettings;
}
