/**
 * Represents a dropdown option value used in user configuration.
 */
export interface SelectUserOptionValue {
  display: string;
  value: string;
}

/**
 * Possible values for a user option.
 */
export type PossibleUserOptionValue =
  | undefined
  | string
  | number
  | boolean
  | SelectUserOptionValue
  | SelectUserOptionValue[];

/**
 * User options object passed into the integration's `doLookup` method.
 *
 * Keys correspond to the `key` values defined in the integration's `config.json`.
 *
 * @example
 * If your integration has a user option with a `key` of `apiKey`, the options
 * object passed into `doLookup` would look like:
 * ```json
 * { "apiKey": "XXXXXXXXXX" }
 * ```
 */
export type DoLookupUserOptions = Record<string, PossibleUserOptionValue>;

/**
 * A single user option as passed to the `validateOptions` method.
 */
export interface ValidateOptionsUserOption {
  integration_id?: string;
  key: string;
  value: PossibleUserOptionValue;
  user_can_edit?: boolean;
  admin_only?: boolean;
}

/**
 * User options object passed into the integration's `validateOptions` method.
 */
export type ValidateOptionsUserOptions = Record<string, ValidateOptionsUserOption>;

/**
 * Represents a validation error returned from the `validateOptions` method.
 */
export interface ValidationError {
  key: string;
  message: string;
}
