/**
 * A select option item used in integration config option definitions.
 */
export interface SelectOptionItem {
  value: string;
  display: string;
}

/**
 * A text or password user option definition.
 */
export interface TextOption {
  type: 'text' | 'password';
  key: string;
  name: string;
  description?: string;
  default: string | null;
  userCanEdit?: boolean;
  adminOnly?: boolean;
}

/**
 * A boolean user option definition.
 */
export interface BooleanOption {
  type: 'boolean';
  key: string;
  name: string;
  description?: string;
  default: boolean | null;
  userCanEdit?: boolean;
  adminOnly?: boolean;
}

/**
 * A number user option definition.
 */
export interface NumberOption {
  type: 'number';
  key: string;
  name: string;
  description?: string;
  default: number | null;
  userCanEdit?: boolean;
  adminOnly?: boolean;
}

/**
 * A select (dropdown) user option definition.
 */
export interface SelectOption {
  type: 'select';
  key: string;
  name: string;
  description?: string;
  default: SelectOptionItem | SelectOptionItem[] | string | null;
  options: SelectOptionItem[];
  multiple?: boolean;
  userCanEdit: boolean;
  adminOnly: boolean;
}

/**
 * Union of all user option definition types.
 */
export type OptionDefinition = TextOption | BooleanOption | NumberOption | SelectOption;

/**
 * A custom data type definition within the integration config.
 */
export interface CustomType {
  type?: 'custom';
  name?: string;
  description?: string;
  key: string;
  regex: string;
  editable?: boolean;
  enabled?: boolean;
}

/**
 * A component path reference in the integration config.
 */
export interface ComponentPath {
  file: string;
}

/**
 * A view component definition with component and template paths.
 */
export interface ViewComponent {
  component: ComponentPath;
  template: ComponentPath;
}

/**
 * Full integration configuration schema as defined in an integration's `config.json`.
 */
export interface IntegrationConfig {
  polarityIntegrationUuid: string;
  name: string;
  acronym: string;
  description?: string;
  defaultColor?: string;
  entityTypes?: string[];
  dataTypes?: (string | CustomType)[];
  customTypes?: CustomType[];
  supportsAdditionalCustomTypes?: boolean;
  styles?: string[];
  block: ViewComponent;
  summary?: ViewComponent;
  onDemandOnly?: boolean;
  copyOnDemand?: boolean;
  logging?: {
    level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  };
  request?: {
    cert?: string;
    key?: string;
    passphrase?: string;
    ca?: string;
    proxy?: string;
    rejectUnauthorized?: boolean;
  };
  options?: OptionDefinition[];
}
