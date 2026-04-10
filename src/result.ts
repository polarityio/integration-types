import type { Entity } from './entity';

/**
 * A single lookup result returned by an integration's `doLookup` method.
 *
 * @typeParam TDetails - The type of the `data.details` object. Defaults to `unknown`.
 */
export interface Result<TDetails = unknown> {
  entity: Entity;
  displayValue?: string;
  data: {
    summary: string[];
    details: TDetails;
  };
}

/**
 * The array of results returned by an integration's `doLookup` method.
 *
 * @typeParam TDetails - The type of each result's `data.details` object.
 */
export type DoLookupResult<TDetails = unknown> = Result<TDetails>[];
