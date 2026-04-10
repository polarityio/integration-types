# @polarityio/integration-types

TypeScript type definitions for building [Polarity](https://www.polarity.io) Integrations.

This package provides **types only** (no runtime code, no dependencies) so integrations can get full type safety without pulling in the runtime dependencies of `polarity-integration-utils`.

## Installation

```bash
npm install --save-dev @polarityio/integration-types
```

## Usage

```typescript
import type {
  Entity,
  DoLookupUserOptions,
  DoLookupResult,
  IntegrationContext,
  Integration
} from '@polarityio/integration-types';
```

## What's Included

| Module | Types |
|--------|-------|
| **Entity** | `Entity`, `EntityType`, `EntityTypeIdentifier`, `StandardEntityType`, `Channel`, `EntityPosition`, `RequestContext`, `OnDemandRequestContext`, `ScreenChangeRequestContext` |
| **Results** | `LookupResult<TDetails>`, `DoLookupResult<TDetails>` |
| **User Options** | `DoLookupUserOptions`, `ValidateOptionsUserOption`, `ValidateOptionsUserOptions`, `SelectTypeOptionValue`, `PossibleUserOptionValue`, `ValidationError` |
| **Context** | `IntegrationContext`, `PolarityCache`, `GlobalCache`, `IntegrationCache`, `UserCache`, `CacheOptions` |
| **Logging** | `Logger` |
| **Contract** | `Integration` |
| **Polling** | `Poll`, `PollSpec`, `IntervalPollSpec`, `CronPollSpec`, `PollFunction` |

## Notes

- This package exports **type definitions only** — no JavaScript is emitted.
- To create `IntegrationError` instances at runtime, use `polarity-integration-utils`.
- Types are kept in sync with the canonical definitions in `polarity-integration-utils`.

## License

MIT
