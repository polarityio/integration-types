import type { Entity } from './entity';
import type { DoLookupUserOptions, ValidateOptionsUserOptions, ValidationError } from './user-options';
import type { DoLookupResult, LookupResult } from './result';
import type { IntegrationContext } from './context';
import type { Logger } from './logger';
import type { Poll } from './polling';

/**
 * Main interface defining the contract for a Polarity Integration.
 */
export interface Integration {
  /**
   * Called once when the integration is first loaded. Use this to initialize
   * connections, validate configuration, or perform other one-time setup.
   */
  startup: (logger: Logger) => Promise<unknown>;

  /**
   * Called for each batch of entities that match the integration's entity types.
   * Return lookup results, or null/void for a miss.
   *
   * @throws IntegrationError (from `polarity-integration-utils`) on failure.
   */
  doLookup: (
    entities: Entity[],
    options: DoLookupUserOptions,
    context: IntegrationContext
  ) => Promise<DoLookupResult | null | void>;

  /**
   * Optional handler for messages sent from the integration's overlay window.
   *
   * @throws IntegrationError (from `polarity-integration-utils`) on failure.
   */
  onMessage?: (payload: unknown, options: DoLookupUserOptions, context: IntegrationContext) => Promise<unknown>;

  /**
   * Optional handler called when a user expands the details block for a result.
   *
   * @throws IntegrationError (from `polarity-integration-utils`) on failure.
   */
  onDetails?: (
    lookupObject: LookupResult,
    options: DoLookupUserOptions,
    context: IntegrationContext
  ) => Promise<unknown>;

  /**
   * Called to validate the user's option configuration. Return an array of
   * validation errors, or an empty array if options are valid.
   */
  validateOptions: (options: ValidateOptionsUserOptions, context: IntegrationContext) => ValidationError[];

  /**
   * Optional record of named poll specifications. Each key is the poll name
   * (used with `context.startPolling()` / `context.stopPolling()`).
   */
  poll?: Poll;
}
