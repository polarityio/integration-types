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
 * Integration context provided to integration functions (`doLookup`, `onMessage`,
 * `onDetails`, `validateOptions`).
 */
export interface IntegrationContext {
  cache: PolarityCache;
  integrationId: string;
  userId: number;
  logger: Logger;
  limiter: Limiter;
  startPolling: (pollName: string) => void;
  stopPolling: (pollName: string) => void;
}
