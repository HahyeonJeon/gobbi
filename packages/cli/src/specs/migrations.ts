/**
 * Step-spec schema migration chain.
 *
 * Parallels `workflow/migrations.ts` (Phase 1 event-schema migrations) but
 * operates on in-memory `StepSpec` JSON values rather than event rows.
 *
 * This module is a pure, composable transform pipeline:
 *
 *   migrateSpec(input, from, to)
 *     ↳ walks `migrations[from][from+1]`, `migrations[from+1][from+2]`, …
 *       applying each step function in order until reaching `to`
 *     ↳ returns the migrated object; never mutates the input
 *
 * Today only schema v1 exists (see `types.ts` `StepSpecVersion = 1`). The
 * registry below is empty — the scaffolding exists so that a future `v2`
 * schema can be introduced by (a) extending `StepSpecVersion` in `types.ts`
 * and (b) registering `migrations[1][2]` here, without touching the
 * composition logic or any caller.
 *
 * Non-goals for this module:
 *
 *   - I/O. `migrateSpec` is a pure transform on already-parsed objects; the
 *     caller is responsible for reading spec files and re-validating after
 *     migration (see `_schema/v1.ts::validateStepSpec`).
 *   - Automatic invocation. No production caller runs migrations today
 *     (`loadSpec` / `validateStepSpec` do NOT call `migrateSpec`). PR C/D/E
 *     will wire this in once a non-v1 spec actually exists.
 *   - Downgrades. Like the reducer chain, migrations are upgrade-only. A
 *     `from` greater than `to` is an error.
 *
 * @see `.claude/project/gobbi/design/v050-prompts.md` §Schema Versioning
 * @see `workflow/migrations.ts` — the Phase 1 reducer migration chain this
 *   module mirrors in shape.
 */

import type { StepSpec, StepSpecVersion } from './types.js';

// ---------------------------------------------------------------------------
// Current schema version
// ---------------------------------------------------------------------------

/**
 * The highest spec-schema version this build understands. Bumped in lockstep
 * with additions to `StepSpecVersion` in `types.ts` and with new entries in
 * the migration registry below.
 */
export const CURRENT_SPEC_VERSION: StepSpecVersion = 1;

// ---------------------------------------------------------------------------
// Migration function type
//
// Each migration function takes a spec at schema version N and returns a
// spec at version N+1. Input and output are typed as `unknown` because
// intermediate schemas have no living TypeScript binding — `types.ts`
// carries only the current schema's shape. Callers narrow to `StepSpec` at
// the end of the chain via the `_schema/vN.ts` validator for the target
// version (today: `validateStepSpec`).
// ---------------------------------------------------------------------------

export type SpecMigrationFn = (spec: unknown) => unknown;

// ---------------------------------------------------------------------------
// Migration registry
//
// `migrations[from][to]` is the step function that transforms a spec from
// version `from` to version `to`. Only adjacent-version transitions are
// registered (from=N → to=N+1); the composition in `migrateSpec` walks the
// chain.
//
// The outer map is keyed by `from`; the inner map is keyed by `to`. Both
// use plain numeric keys (not the branded `StepSpecVersion` union) so that
// historical versions past the current max can be registered without
// widening the union prematurely.
//
// When v2 is introduced:
//
//   1. Extend `StepSpecVersion` in `types.ts` to `1 | 2`.
//   2. Add:
//        const v1ToV2: SpecMigrationFn = (input) => { ... };
//        migrations[1] = { 2: v1ToV2 };
//   3. Bump `CURRENT_SPEC_VERSION` to `2`.
//   4. Add a `_schema/v2.ts` ajv binding for validators.
//
// The registry is NOT readonly at the top level on purpose: it is an
// internal implementation detail, and keeping it a plain `Record` avoids
// awkward casts when future versions are added. The contents are not
// exported; callers cannot mutate it.
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type MigrationRegistry = Record<number, Record<number, SpecMigrationFn>>;

const migrations: MigrationRegistry = {
  // No migrations yet — schema v1 is the first and only version.
  //
  // When v2 lands, the expected registration is:
  //
  //   migrations[1] = {
  //     2: (input) => {
  //       // transform a v1-shaped object into a v2-shaped object
  //     },
  //   };
};

// ---------------------------------------------------------------------------
// migrateSpec — composed chain walker
// ---------------------------------------------------------------------------

/**
 * Error thrown when a migration step is requested that is not registered.
 * The message names the missing adjacent-version hop so callers can see
 * exactly where the chain broke.
 */
export class SpecMigrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpecMigrationError';
  }
}

/**
 * Migrate a parsed spec JSON value from version `from` to version `to`.
 *
 * - When `from === to`, returns the input by reference (no copy). This
 *   matches the identity behaviour of `workflow/migrations.ts::migrateEvent`
 *   and keeps the common no-op path allocation-free.
 * - When `from < to`, composes `migrations[from][from+1]`, `migrations[from+1]
 *   [from+2]`, … in order. Each step is invoked on the previous step's
 *   output; input and intermediate values are never mutated.
 * - When `from > to`, throws. Downgrades are intentionally not supported;
 *   this is the same policy as the reducer migration chain. Run an older
 *   build of the CLI if you need to read specs at an older version.
 *
 * The return type is `StepSpec` on the assumption that `to ===
 * CURRENT_SPEC_VERSION` — callers requesting any other `to` receive a value
 * typed as `StepSpec` but whose actual shape is the intermediate version's
 * shape. Today only v1 exists so this collapse is exact. When v2+ lands,
 * consider changing the signature to a conditional type keyed on `to`.
 *
 * @throws {SpecMigrationError} when `from > to`, or when a migration step in
 *   the chain (`migrations[n][n+1]`) is not registered.
 */
export function migrateSpec(
  input: unknown,
  from: number,
  to: number,
): StepSpec {
  if (from === to) {
    // Identity path — no copy. The caller is responsible for having
    // validated `input` as StepSpec before calling when from === to ===
    // CURRENT_SPEC_VERSION (validation is not this module's job).
    return input as StepSpec;
  }

  if (from > to) {
    throw new SpecMigrationError(
      `Spec version ${from} is newer than target ${to} — downgrade migrations are not supported`,
    );
  }

  let current: unknown = input;
  let version = from;

  while (version < to) {
    const fromMap = migrations[version];
    const step = fromMap?.[version + 1];
    if (step === undefined) {
      throw new SpecMigrationError(
        `No migration from spec v${version} to v${version + 1}`,
      );
    }
    current = step(current);
    version++;
  }

  return current as StepSpec;
}

// ---------------------------------------------------------------------------
// Test seam — register / unregister migrations on a local registry
//
// `migrateSpecWith` lets tests (and any future tool that needs to run a
// bespoke chain, e.g. dry-run validation in a dev CLI) supply their own
// registry without polluting the module-level `migrations` object. The
// composition logic is identical; only the lookup source changes.
//
// The production `migrateSpec` above delegates to the module-level registry.
// Tests that want to exercise the composition across multiple hops register
// a synthetic chain (e.g. v1→v2→v3) and pass it via `migrateSpecWith`.
// ---------------------------------------------------------------------------

/**
 * Run the migration composition against a caller-supplied registry instead
 * of the module's own. Useful for tests that need to exercise multi-hop
 * composition without registering synthetic migrations on the production
 * registry.
 *
 * Shape and error semantics match `migrateSpec`.
 */
export function migrateSpecWith(
  input: unknown,
  from: number,
  to: number,
  registry: Readonly<Record<number, Readonly<Record<number, SpecMigrationFn>>>>,
): unknown {
  if (from === to) return input;
  if (from > to) {
    throw new SpecMigrationError(
      `Spec version ${from} is newer than target ${to} — downgrade migrations are not supported`,
    );
  }

  let current: unknown = input;
  let version = from;

  while (version < to) {
    const fromMap = registry[version];
    const step = fromMap?.[version + 1];
    if (step === undefined) {
      throw new SpecMigrationError(
        `No migration from spec v${version} to v${version + 1}`,
      );
    }
    current = step(current);
    version++;
  }

  return current;
}
