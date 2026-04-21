/**
 * Pure type-only module describing the shared cascade shape used by:
 *
 *   - `config-store.ts::toCascadeProjection` — projects a T3 session row
 *     into `Partial<CascadeShape>`.
 *   - `config-cascade.ts` (Pass-3 Task T3) — `resolveConfig` folds T1, T2,
 *     and T3 into a full `CascadeShape` via provenance-aware deepMerge.
 *
 * Keeping the interface in its own file breaks the circular-import risk
 * between `config-store.ts` and `config-cascade.ts`: both modules import
 * from here and from each other only via types (erased at runtime).
 *
 * No runtime values live in this file. If a consumer needs defaults for the
 * cascade shape, those belong to `config-cascade.ts` (user-tier defaults)
 * and `project-config.ts::DEFAULT_CONFIG` (project-tier defaults).
 */

import type { VerificationConfig, CostConfig } from './project-config.js';

/**
 * Closed shape that the cascade resolver yields after merging the `default`,
 * `user`, `project`, and `session` tiers. Every field must have a value; the
 * resolver's contract is to hydrate all missing leaves from tier defaults.
 *
 * The interface mirrors `ProjectConfigV2` with one addition (`ui`) and one
 * refinement (`notify.discord` is always a boolean rather than optional at
 * the input boundary).
 */
export interface CascadeShape {
  readonly verification: VerificationConfig;
  readonly cost: CostConfig;
  readonly notify: {
    readonly slack: boolean;
    readonly telegram: boolean;
    readonly discord: boolean;
  };
  readonly git: {
    readonly mode: 'direct-commit' | 'worktree-pr';
    readonly baseBranch: string | null;
  };
  readonly eval: {
    readonly ideation: boolean;
    readonly plan: boolean;
    readonly execution: boolean;
  };
  readonly trivialRange: 'read-only' | 'simple-edits';
  readonly ui: {
    readonly verbosity: 'compact' | 'verbose';
  };
}
