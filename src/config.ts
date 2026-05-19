import type { SelectTypeOptionValue } from './user-options';
import type { ThrottleSettings } from './limiter';

/**
 * Base properties shared by all integration option types.
 */
interface IntegrationOptionBase {
  /** Unique key used to reference this option's value at runtime. */
  key: string;
  /** Human-readable name displayed in the UI. */
  name: string;
  /** Description text shown to the user. */
  description?: string;
  /** Whether only admins can view/edit this option. */
  adminOnly?: boolean;
  /** Whether non-admin users can edit this option. */
  userCanEdit?: boolean;
}

/**
 * A text or password option in `config.json`.
 */
export interface TextOption extends IntegrationOptionBase {
  type: 'text' | 'password';
  default: string | null;
}

/**
 * A boolean (checkbox) option in `config.json`.
 */
export interface BooleanOption extends IntegrationOptionBase {
  type: 'boolean';
  default: boolean | null;
}

/**
 * A numeric option in `config.json`.
 */
export interface NumberOption extends IntegrationOptionBase {
  type: 'number';
  default: number | null;
}

/**
 * A select (dropdown) option in `config.json`.
 */
export interface SelectOption extends IntegrationOptionBase {
  type: 'select';
  /** Available choices for the dropdown. */
  options: SelectTypeOptionValue[];
  /** Default selection — a single item, multiple items, a string value, or null. */
  default: SelectTypeOptionValue | SelectTypeOptionValue[] | string | null;
  /** Whether multiple values can be selected. */
  multiple?: boolean;
  adminOnly: boolean;
  userCanEdit: boolean;
}

/**
 * Union of all integration option types that can appear in `config.json`.
 */
export type IntegrationOption = TextOption | BooleanOption | NumberOption | SelectOption;

/**
 * Log level configuration for the integration.
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * TLS/proxy request settings for the integration's HTTP client.
 */
export interface RequestConfig {
  /** Custom certificate authority (PEM-encoded or file path). */
  ca?: string;
  /** Client certificate (PEM-encoded or file path). */
  cert?: string;
  /** Client private key (PEM-encoded or file path). */
  key?: string;
  /** Passphrase for the client key. */
  passphrase?: string;
  /** HTTP/HTTPS proxy URL. */
  proxy?: string;
  /** Whether to reject connections with invalid TLS certificates. */
  rejectUnauthorized?: boolean;
}

/**
 * The structure of an integration's `config.json` file.
 *
 * This is the main manifest that defines an integration's metadata,
 * data types, user-configurable options, and runtime settings.
 *
 * @example
 * ```json
 * {
 *   "polarityIntegrationUuid": "a1b2c3d4-...",
 *   "name": "My Integration",
 *   "acronym": "MI",
 *   "dataTypes": ["IPv4", "domain"],
 *   "options": [
 *     { "key": "apiKey", "name": "API Key", "type": "password", "default": "" }
 *   ]
 * }
 * ```
 */
export interface IntegrationConfig {
  /** Unique UUID assigned to this integration by Polarity. */
  polarityIntegrationUuid: string;
  /** Human-readable name of the integration. */
  name: string;
  /** Short acronym displayed in the UI (typically 2–4 characters). */
  acronym: string;
  /** Description of the integration's purpose. */
  description?: string;
  /** Default tag color (hex string, e.g. `"#1E90FF"`). */
  defaultColor?: string;
  /**
   * Data types this integration subscribes to.
   * Examples: `"IPv4"`, `"domain"`, `"hash"`, `"email"`, `"url"`.
   */
  dataTypes?: string[];
  /** Whether the integration supports user-added custom types at runtime. */
  supportsAdditionalCustomTypes?: boolean;
  /** Whether the integration only runs on-demand (not on passive lookups). */
  onDemandOnly?: boolean;
  /** Whether to copy entity data to the clipboard on demand lookups. */
  copyOnDemand?: boolean;
  /** User-configurable options displayed in the integration settings UI. */
  options?: IntegrationOption[];
  /** Additional CSS stylesheet file paths to load. */
  styles?: string[];
  /** Logging configuration. */
  logging?: { level: LogLevel };
  /** TLS and proxy settings for the integration's HTTP client. */
  request?: RequestConfig;
  /**
   * Initial throttle/rate-limit settings for the integration's limiter.
   * These are merged over platform defaults and passed to the throttle manager
   * on startup. Accepts the same properties as {@link ThrottleSettings}.
   *
   * Platform-owned keys (`id`, `datastore`, `clearDatastore`, `clientOptions`,
   * `connection`) are stripped during sanitization and must not be specified.
   *
   * @example
   * ```json
   * {
   *   "throttle": {
   *     "maxConcurrent": 5,
   *     "minTime": 200
   *   }
   * }
   * ```
   */
  throttle?: ThrottleSettings;
}
