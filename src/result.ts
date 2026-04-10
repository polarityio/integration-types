import type { Entity } from './entity';

/**
 * A single lookup result returned by an integration's `doLookup` method.
 *
 * @typeParam TDetails - The type of the `data.details` object. Defaults to `unknown`.
 */
export interface Result<TDetails = unknown> {
  entity: Entity;
  displayValue?: string;
  /**
   * If set to `true`, this result will not be cached in the Integration cache.
   * Defaults to `false`.
   */
  isVolatile?: boolean;
  data: {
    summary: string[];
    details: TDetails;
  } | null;
}

/**
 * The array of results returned by an integration's `doLookup` method.
 *
 * @typeParam TDetails - The type of each result's `data.details` object.
 */
export type DoLookupResult<TDetails = unknown> = Result<TDetails>[];
