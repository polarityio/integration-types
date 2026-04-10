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
| **Entity** | `Entity`, `EntityType`, `StandardEntityType`, `Channel` |
| **Results** | `Result<TDetails>`, `DoLookupResult<TDetails>` |
| **User Options** | `DoLookupUserOptions`, `ValidateOptionsUserOption`, `ValidateOptionsUserOptions`, `DropdownUserOptionValue`, `PossibleUserOptionValue`, `ValidationError` |
| **Context** | `IntegrationContext`, `PolarityCache`, `GlobalCache`, `IntegrationCache`, `UserCache`, `CacheOptions` |
| **Logging** | `Logger` |
| **Config** | `IntegrationConfig` |
| **Contract** | `Integration<TStartupResult, TDetails>`, `IntegrationError` (interface only) |

## Notes

- This package exports **type definitions only** — no JavaScript is emitted.
- The `IntegrationError` export is a TypeScript interface describing the error shape. To *create* errors at runtime, use `polarity-integration-utils`.
- Types are kept in sync with the canonical definitions in `polarity-integration-utils`.

## License

MIT
