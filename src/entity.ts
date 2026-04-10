/**
 * Represents a channel associated with a Polarity Entity.
 */
export interface Channel {
  channel_name: string;
  id: number;
}

/**
 * List of supported standard entity type values.
 */
export type StandardEntityType =
  | 'IPv4'
  | 'IPv4CIDR'
  | 'IPv6'
  | 'MAC'
  | 'MD5'
  | 'SHA1'
  | 'SHA256'
  | 'cve'
  | 'domain'
  | 'email'
  | 'string'
  | 'url';

/**
 * Entity types including custom types.
 *
 * Used in the `types` array where specific custom type identifiers (e.g., `custom.myType`) are allowed.
 */
export type EntityType = StandardEntityType | 'IP' | 'hash' | `custom.${string}`;

/**
 * The value used in the `type` property of an Entity.
 *
 * For IPv4/IPv6 entities this is `'IPv4'` or `'IPv6'`. For any hash type this
 * is `'hash'`. For custom types this is `'custom'`.
 */
export type EntityTypeIdentifier = StandardEntityType | 'custom';

/**
 * Screen position of an entity detected in Stream or Highlight mode.
 */
export interface EntityPosition {
  height: number;
  width: number;
  x: number;
  y: number;
}

/**
 * Request context for an **OnDemand** lookup.
 *
 * OnDemand mode is triggered when a user explicitly searches for an entity
 * (e.g., via the search bar). The `requestType` is always `'OnDemand'`.
 */
export interface OnDemandRequestContext {
  requestType: 'OnDemand';
  isUserInitiated: boolean;
}

/**
 * Request context for a **Stream** or **Highlight** mode lookup.
 *
 * Both modes use `requestType: 'ScreenChange'` and include screen position
 * data, the originating process name, and window title.
 *
 * - **Stream mode** — Entities are detected automatically from screen content
 *   without user interaction. `isUserInitiated` is `false`.
 * - **Highlight mode** — Entities are detected from screen content in response
 *   to a user-initiated action (e.g., selecting text). `isUserInitiated` is `true`.
 */
export interface ScreenChangeRequestContext {
  requestType: 'ScreenChange';
  isUserInitiated: boolean;
  positions: EntityPosition[];
  processName: string;
  windowTitle: string;
}

/**
 * Union of all request context types.
 *
 * Polarity entities are looked up in one of three modes:
 *
 * | Mode          | `requestType`    | `isUserInitiated` |
 * |---------------|------------------|-------------------|
 * | **OnDemand**  | `'OnDemand'`     | `true`            |
 * | **Stream**    | `'ScreenChange'` | `false`           |
 * | **Highlight** | `'ScreenChange'` | `true`            |
 *
 * Use `requestContext.requestType` and `requestContext.isUserInitiated` to
 * distinguish between the three modes at runtime.
 */
export type RequestContext = OnDemandRequestContext | ScreenChangeRequestContext;

/**
 * Represents a Polarity Entity object which is passed to an integration's
 * doLookup method.
 */
export interface Entity {
  value: string;
  rawValue: string;
  types: EntityType[];
  type: EntityTypeIdentifier;
  requestContext: RequestContext;
  longitude: number;
  latitude: number;
  IPLong: number;
  isURL: boolean;
  isSHA512: boolean;
  isSHA256: boolean;
  isSHA1: boolean;
  isPrivateIP: boolean;
  isMD5: boolean;
  isIPv6: boolean;
  isIPv4: boolean;
  isIP: boolean;
  isHex: boolean;
  isHash: boolean;
  isHTMLTag: boolean;
  isEmail: boolean;
  isDomain: boolean;
  hashType: 'MD5' | 'SHA1' | 'SHA256' | '';
  displayValue: string;
  channels: Channel[];
  IPType: 'IPv4' | 'IPv6' | 'IPv4CIDR' | '';
}
