import type { Limiter } from './limiter';
import type { Logger } from './logger';

/**
 * Cache operation options.
 */
export interface CacheOptions {
  /** Time-to-live in seconds. If not specified, uses default TTL. */
  ttl?: number;
}

/**
 * Global cache operations — shared across all integrations and users.
 * Use for system-wide statistics, feature flags, or shared configuration.
 */
export interface GlobalCache {
  /**
   * Retrieves a value from the global cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @returns The cached value, or `undefined` if the key does not exist or has expired.
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  get(key: string): Promise<unknown>;
  /**
   * Stores a value in the global cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @param value - Value to cache.
   * @param options - Optional cache settings (e.g. TTL).
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  set(key: string, value: unknown, options?: CacheOptions): Promise<void>;
  /**
   * Deletes a value from the global cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  delete(key: string): Promise<void>;
}

/**
 * Integration-scoped cache operations — shared across all users of a specific integration.
 * Use for API responses, configuration, or data that's the same for all users.
 */
export interface IntegrationCache {
  /**
   * Retrieves a value from the integration-scoped cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @returns The cached value, or `undefined` if the key does not exist or has expired.
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  get(key: string): Promise<unknown>;
  /**
   * Stores a value in the integration-scoped cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @param value - Value to cache.
   * @param options - Optional cache settings (e.g. TTL).
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  set(key: string, value: unknown, options?: CacheOptions): Promise<void>;
  /**
   * Deletes a value from the integration-scoped cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  delete(key: string): Promise<void>;
}

/**
 * User-scoped cache operations — specific to individual users.
 * Use for user preferences, recent activity, or personalized data.
 */
export interface UserCache {
  /**
   * Retrieves a value from the user-scoped cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @returns The cached value, or `undefined` if the key does not exist or has expired.
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  get(key: string): Promise<unknown>;
  /**
   * Stores a value in the user-scoped cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @param value - Value to cache.
   * @param options - Optional cache settings (e.g. TTL).
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  set(key: string, value: unknown, options?: CacheOptions): Promise<void>;
  /**
   * Deletes a value from the user-scoped cache.
   *
   * @param key - Cache key. Must be 1–250 characters and match `/^[a-zA-Z0-9._-]+$/`
   *   (alphanumeric characters, dots, underscores, and hyphens only).
   * @throws {Error} If `key` is empty, exceeds 250 characters, or contains invalid characters.
   */
  delete(key: string): Promise<void>;
}

/**
 * Main cache interface providing hierarchical caching with three scopes.
 *
 * - **Global**: System-wide data shared across all integrations
 * - **Integration**: Data shared among all users of a specific integration
 * - **User**: User-specific data within an integration context
 */
export interface PolarityCache {
  global: GlobalCache;
  integration: IntegrationCache;
  user: UserCache;
}

/**
 * Proxy configuration for per-integration HTTP proxy overrides (tier 1).
 *
 * Present only when the Polarity admin has configured a per-integration
 * proxy override. Global proxy settings (tier 2) and host environment
 * proxy variables (tier 3) are **not** surfaced here — they are injected
 * into the worker subprocess environment and picked up by HTTP clients
 * automatically.
 *
 * @example Resolving the proxy URL for a request
 * ```typescript
 * const proxyUrl = context.network.proxy?.https ?? context.network.proxy?.http;
 * ```
 */
export interface NetworkProxy {
  /**
   * HTTP proxy URL for plain-text requests.
   * Omitted (not `null`) when unset.
   *
   * @example "http://user:pass@proxy.corp:8080"
   */
  http?: string;

  /**
   * HTTPS proxy URL for TLS requests.
   * Omitted (not `null`) when unset. Today this is typically the same
   * URL as `http`; both fields exist for future per-scheme support.
   *
   * @example "http://user:pass@proxy.corp:8080"
   */
  https?: string;

  /**
   * Comma- or whitespace-separated list of hosts/domains that bypass
   * the per-integration proxy.
   *
   * - Omitted when unset (no explicit bypass list configured).
   * - `null` only when the admin explicitly set the bypass list to empty
   *   (a valid `NO_PROXY` value meaning "no exceptions — proxy everything").
   *
   * Supports patterns: exact host, `.suffix` domain matching, and `*` wildcard.
   *
   * @example "localhost,.internal,*.corp"
   */
  noProxy?: string | null;
}

/**
 * Per-integration network configuration provided on every dispatch via
 * `context.network`.
 *
 * Contains **tier-1** (per-integration) TLS and proxy overrides configured
 * by the Polarity admin. Global and host proxy settings are handled
 * transparently via the worker environment and do not appear here.
 *
 * ### Precedence
 *
 * 1. **Tier 1 — Per-integration** → surfaces on `context.network`
 * 2. **Tier 2 — Global Proxy Settings** → worker env (`HTTPS_PROXY`, etc.)
 * 3. **Tier 3 — Host env** → inherited by worker subprocess
 *
 * ### Key Rules
 *
 * - Do **not** cache HTTP clients across dispatches — settings may change
 *   between dispatches when an admin updates the configuration.
 * - Do **not** set `process.env.HTTP_PROXY` or
 *   `process.env.NODE_TLS_REJECT_UNAUTHORIZED` at runtime — this is racy
 *   on shared workers and leaks settings between integrations.
 * - When `proxy` is absent, do nothing — the worker env carries
 *   tier 2/3 and most HTTP clients pick it up natively.
 *
 * @example Basic usage with any HTTP client
 * ```typescript
 * async function doLookup(entities, options, context) {
 *   const proxyUrl = context.network.proxy?.https ?? context.network.proxy?.http;
 *   const rejectUnauthorized = context.network.rejectUnauthorized !== false;
 *   // Wire proxyUrl and rejectUnauthorized into your HTTP client
 * }
 * ```
 *
 * @example Usage with postman-request
 * ```typescript
 * async function doLookup(entities, options, context) {
 *   const proxy = context.network.proxy?.https ?? context.network.proxy?.http;
 *   const client = request.defaults({
 *     ...(proxy && { proxy }),
 *     ...(context.network.rejectUnauthorized === false && {
 *       strictSSL: false,
 *       rejectUnauthorized: false,
 *     }),
 *   });
 * }
 * ```
 *
 * @example Usage with axios
 * ```typescript
 * async function doLookup(entities, options, context) {
 *   const proxyUrl = context.network.proxy?.https ?? context.network.proxy?.http;
 *   const config: AxiosRequestConfig = {};
 *   if (proxyUrl) {
 *     const u = new URL(proxyUrl);
 *     config.proxy = {
 *       protocol: u.protocol.replace(':', ''),
 *       host: u.hostname,
 *       port: Number(u.port) || (u.protocol === 'https:' ? 443 : 80),
 *       ...(u.username && { auth: { username: u.username, password: u.password } }),
 *     };
 *   }
 *   if (context.network.rejectUnauthorized === false) {
 *     config.httpsAgent = new https.Agent({ rejectUnauthorized: false });
 *   }
 * }
 * ```
 */
export interface NetworkContext {
  /**
   * Per-integration proxy override (tier 1).
   *
   * **Omitted entirely** when no per-integration proxy is configured.
   * When absent, HTTP clients should use their default behavior
   * (which will pick up tier 2/3 from the worker environment).
   */
  proxy?: NetworkProxy;

  /**
   * Whether outbound TLS certificates should be verified.
   *
   * - `true` (default) — enforce certificate validation.
   * - `false` — skip TLS certificate verification. Corresponds to the
   *   integration's "Allow Unauthorized TLS Certificates" admin setting.
   *
   * **Always present** — TLS strictness is meaningful regardless of proxy config.
   */
  rejectUnauthorized: boolean;
}

/**
 * Integration context provided to integration functions (`doLookup`, `onMessage`,
 * `onDetails`, `validateOptions`).
 */
export interface IntegrationContext {
  cache: PolarityCache;
  integrationId: string;
  userId: number;
  logger: Logger;
  limiter: Limiter;
  /** Per-integration network (TLS/proxy) configuration provided by the runtime on every dispatch. */
  network: NetworkContext;
  startPolling: (pollName: string) => void;
  stopPolling: (pollName: string) => void;
}
