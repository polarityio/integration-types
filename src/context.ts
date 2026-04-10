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
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
}

/**
 * Integration-scoped cache operations — shared across all users of a specific integration.
 * Use for API responses, configuration, or data that's the same for all users.
 */
export interface IntegrationCache {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
}

/**
 * User-scoped cache operations — specific to individual users.
 * Use for user preferences, recent activity, or personalized data.
 */
export interface UserCache {
  get(key: string): Promise<unknown>;
  set(key: string, value: unknown, options?: CacheOptions): Promise<void>;
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
  startPolling: (pollName: string) => void;
  stopPolling: (pollName: string) => void;
}
