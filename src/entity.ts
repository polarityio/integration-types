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
  | 'IP'
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
 */
export type EntityType = StandardEntityType | '*' | 'custom' | `custom.${string}`;

/**
 * Represents a Polarity Entity object which is passed to an integration's
 * doLookup method.
 */
export interface Entity {
  value: string;
  types: EntityType[];
  type: EntityType;
  requestContext: {
    requestType: 'onDemand';
    isUserInitiated: boolean;
  };
  longitude: number;
  latitude: number;
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
  hashType: 'md5' | 'sha1' | 'sha256' | 'sha512' | '';
  displayValue: string;
  channels: Channel[];
  IPType: 'IPv4' | 'IPv6' | '';
}
