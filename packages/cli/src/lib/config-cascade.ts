/**
 * Pass-3 Task T3 — Cascade resolver, provenance tracking, and tier errors.
 *
 * Composes the three config tiers into a single `ResolvedConfig`:
 *
 *   Tier 1 (user)    — `.gobbi/settings.json`        (JSON, gitignored)
 *   Tier 2 (project) — `.gobbi/project/settings.json` (JSON, tracked, schema v1/v2)
 *   Tier 3 (session) — `.gobbi/config.db` session row (SQLite, via ConfigStore)
 *
 * Defaults come from {@link DEFAULT_CONFIG} (T2) and {@link DEFAULT_USER_SETTINGS}
 * (T1). Precedence: session > project > user > default. Merge semantics
 * inherit from the shipped {@link deepMerge}: primitives replace, objects
 * recurse, arrays replace, `null` is a leaf value, `undefined` is skipped.
 *
 * Alongside merging, {@link deepMergeWithProvenance} walks the overlay tree
 * and records the winning tier for every leaf in a flat dot-path map —
 * exposed on {@link ResolvedConfig.__sources} so callers (the CLI's
 * `gobbi config resolve --with-sources` flag) can explain why a given key
 * has its value.
 *
 * ## Error handling
 *
 * {@link ConfigCascadeError} carries a literal `.code` field so catch paths
 * can dispatch on the class, not on message strings:
 *
 *   - `'read'`   — I/O failure reading a tier file
 *   - `'parse'`  — JSON parse error or schema-validation failure
 *   - `'notFound'` — a requested key does not exist in the resolved tree
 *
 * The cascade module itself never throws `notFound` — that code is reserved
 * for the CLI layer (Pass-3 Task T4) that navigates dot-paths.
 *
 * ## Relationship to T2
 *
 * T3 imports T2's exports exclusively; it never mutates or re-declares them.
 * The canonical merge implementation lives in `project-config.ts::deepMerge`
 * and is delegated to by {@link deepMergeWithProvenance} — one source of
 * truth for merge semantics, one module adding the provenance side-channel.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import Ajv2020, { type JSONSchemaType } from 'ajv/dist/2020.js';

import type { CascadeShape } from './cascade-shape.js';
import { openConfigStore, toCascadeProjection } from './config-store.js';
import {
  DEFAULT_CONFIG,
  DEFAULT_USER_SETTINGS,
  deepMerge,
  parseProjectConfig,
  type ProjectConfigInput,
} from './project-config.js';
import { isRecord } from './guards.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Identity of each cascade tier. `'default'` is the hardcoded fallback built
 * from {@link DEFAULT_CONFIG} + {@link DEFAULT_USER_SETTINGS}; the remaining
 * three tiers correspond to the on-disk and SQLite sources.
 */
export type TierId = 'default' | 'user' | 'project' | 'session';

/**
 * T1 user-settings shape — subset of {@link CascadeShape} with no
 * `verification` / `cost` sections (project-only) and an additional `ui`
 * section (user-only). `schemaVersion` is T1-local and independent of T2's
 * `version` field.
 *
 * Mirrors {@link DEFAULT_USER_SETTINGS} in `project-config.ts` structurally
 * (that constant is typed `as const` for literal-narrowed defaults; this
 * interface widens the string enums to the cascade-shape types so user
 * edits admit every legal value).
 */
export interface UserSettings {
  readonly schemaVersion: 1;
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

/**
 * On-disk shape of `.gobbi/settings.json`. All sections are optional; the
 * AJV schema accepts a minimal `{schemaVersion:1}` document and hydration
 * composes missing leaves from {@link DEFAULT_USER_SETTINGS}.
 */
interface UserSettingsInput {
  readonly schemaVersion: 1;
  readonly notify?: {
    readonly slack?: boolean;
    readonly telegram?: boolean;
    readonly discord?: boolean;
  };
  readonly git?: {
    readonly mode?: 'direct-commit' | 'worktree-pr';
    readonly baseBranch?: string | null;
  };
  readonly eval?: {
    readonly ideation?: boolean;
    readonly plan?: boolean;
    readonly execution?: boolean;
  };
  readonly trivialRange?: 'read-only' | 'simple-edits';
  readonly ui?: {
    readonly verbosity?: 'compact' | 'verbose';
  };
}

/**
 * Deep-partial overlay shape accepted by {@link deepMergeWithProvenance}.
 * Each section is independently optional AND admits nested partial records
 * so the T1 / T2 / T3 overlays (which all contribute a subset of keys) type-
 * check without assertions.
 *
 * This is deliberately a local alias rather than a generic `DeepPartial<T>`
 * — the cascade has a fixed shape, so an explicitly written deep-partial
 * is clearer and narrower than a recursively-mapped helper.
 */
export interface ConfigOverlay {
  readonly verification?: Partial<CascadeShape['verification']>;
  readonly cost?: Partial<CascadeShape['cost']>;
  readonly notify?: Partial<CascadeShape['notify']>;
  readonly git?: Partial<CascadeShape['git']>;
  readonly eval?: Partial<CascadeShape['eval']>;
  readonly trivialRange?: CascadeShape['trivialRange'];
  readonly ui?: Partial<CascadeShape['ui']>;
}

/**
 * Fully-resolved cascade config. Extends {@link CascadeShape} with a
 * frozen dot-path provenance map: every leaf path (e.g. `notify.slack`,
 * `git.baseBranch`, `verification.commands.test.command`) maps to the
 * {@link TierId} that last wrote it during cascade folding.
 */
export interface ResolvedConfig extends CascadeShape {
  readonly __sources: Readonly<Record<string, TierId>>;
}

/**
 * Re-export so consumers importing the cascade module have a single
 * import surface for T1 defaults.
 */
export { DEFAULT_USER_SETTINGS };

// ---------------------------------------------------------------------------
// ConfigCascadeError
// ---------------------------------------------------------------------------

/**
 * Error class for cascade-specific failures. The `.code` field is a literal
 * union so catch blocks can dispatch without string-matching, and the
 * optional `tier` / `path` fields carry the failure's provenance for
 * CLI-layer error messages.
 */
export class ConfigCascadeError extends Error {
  readonly code: 'read' | 'parse' | 'notFound';
  readonly tier?: TierId;
  readonly path?: string;

  constructor(
    code: 'read' | 'parse' | 'notFound',
    message: string,
    opts?: { tier?: TierId; path?: string; cause?: unknown },
  ) {
    super(message);
    this.name = 'ConfigCascadeError';
    this.code = code;
    // Under `exactOptionalPropertyTypes`, assign tier/path only when the
    // caller supplied them — never `this.tier = opts?.tier` which would
    // materialise the key with `undefined` on optional-tier errors.
    if (opts?.tier !== undefined) {
      this.tier = opts.tier;
    }
    if (opts?.path !== undefined) {
      this.path = opts.path;
    }
    if (opts?.cause !== undefined) {
      // `Error.cause` is spec-native; TS's `ErrorOptions` only reaches it
      // via the constructor options, so forward explicitly.
      (this as { cause?: unknown }).cause = opts.cause;
    }
  }
}

// ---------------------------------------------------------------------------
// AJV schema — user-settings (T1)
// ---------------------------------------------------------------------------

const userSettingsSchema: JSONSchemaType<UserSettingsInput> = {
  type: 'object',
  required: ['schemaVersion'],
  additionalProperties: false,
  properties: {
    schemaVersion: { type: 'integer', const: 1 },
    notify: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        slack: { type: 'boolean', nullable: true },
        telegram: { type: 'boolean', nullable: true },
        discord: { type: 'boolean', nullable: true },
      },
    },
    git: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        mode: { type: 'string', nullable: true, enum: ['direct-commit', 'worktree-pr'] },
        baseBranch: { type: 'string', nullable: true },
      },
    },
    eval: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        ideation: { type: 'boolean', nullable: true },
        plan: { type: 'boolean', nullable: true },
        execution: { type: 'boolean', nullable: true },
      },
    },
    trivialRange: { type: 'string', nullable: true, enum: ['read-only', 'simple-edits'] },
    ui: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        verbosity: { type: 'string', nullable: true, enum: ['compact', 'verbose'] },
      },
    },
  },
};

const ajv = new Ajv2020({ strict: true, allErrors: true });
// One-off compile at module init — AJV caches per-schema, but a class
// field also keeps the validator ref-stable for test-mock substitution.
const validateUserSettings = ajv.compile<UserSettingsInput>(userSettingsSchema);

function formatAjvErrors(
  errors: readonly { instancePath?: string; message?: string }[] | null | undefined,
): string {
  const list = errors ?? [];
  return list
    .map((e) => `  ${e.instancePath && e.instancePath !== '' ? e.instancePath : '<root>'}: ${e.message ?? 'unknown error'}`)
    .join('\n');
}

// ---------------------------------------------------------------------------
// T1 loader
// ---------------------------------------------------------------------------

function userSettingsPath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'settings.json');
}

/**
 * Read + validate `.gobbi/settings.json` and return the raw
 * {@link UserSettingsInput} (pre-hydration). Shared between the public
 * {@link loadUserSettings} (which hydrates) and the resolver (which needs
 * only the user-declared keys so provenance records flip correctly).
 *
 * Returns `null` when the file is absent. Throws
 * {@link ConfigCascadeError} on I/O / JSON parse / schema failure.
 */
function readUserSettingsInput(repoRoot: string): UserSettingsInput | null {
  const filePath = userSettingsPath(repoRoot);
  if (!existsSync(filePath)) return null;

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ConfigCascadeError(
      'read',
      `Failed to read ${path.relative(repoRoot, filePath)}: ${message}`,
      { tier: 'user', path: filePath, cause: err },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ConfigCascadeError(
      'parse',
      `Invalid JSON in ${path.relative(repoRoot, filePath)}: ${message}`,
      { tier: 'user', path: filePath, cause: err },
    );
  }

  if (!validateUserSettings(parsed)) {
    const messages = formatAjvErrors(validateUserSettings.errors);
    throw new ConfigCascadeError(
      'parse',
      `Invalid ${path.relative(repoRoot, filePath)}:\n${messages}`,
      { tier: 'user', path: filePath },
    );
  }

  return parsed;
}

/**
 * Load and validate `.gobbi/settings.json`. Returns the hydrated T1
 * {@link UserSettings} on success, or `null` when the file is absent (the
 * resolver treats this as "tier not present" and skips the overlay).
 *
 *   - I/O failure → {@link ConfigCascadeError} with `code: 'read'`
 *   - JSON parse error or schema violation → `code: 'parse'`
 *
 * Missing optional sections hydrate from {@link DEFAULT_USER_SETTINGS} via
 * {@link deepMerge} — the same pattern `loadProjectConfig` uses for T2.
 */
export function loadUserSettings(repoRoot: string): UserSettings | null {
  const input = readUserSettingsInput(repoRoot);
  if (input === null) return null;

  // Hydrate missing sections from DEFAULT_USER_SETTINGS — primitives and
  // `null` leaves in `input` win over defaults, matching T2's loader.
  return deepMerge<UserSettings>(DEFAULT_USER_SETTINGS as UserSettings, input);
}

// ---------------------------------------------------------------------------
// T2 raw-input reader — bypasses hydration for provenance fidelity
// ---------------------------------------------------------------------------

function projectConfigPathV2(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'project', 'settings.json');
}

function projectConfigPathV1(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'project-config.json');
}

/**
 * Read the raw `.gobbi/project/settings.json` (or legacy
 * `.gobbi/project-config.json`) and return the typed {@link ProjectConfigInput}
 * — pre-hydration, so only the keys the user wrote are present.
 *
 *   - Both files absent → returns `null` (resolver treats tier as absent).
 *   - Present but malformed JSON → throws `ConfigCascadeError('parse', …)`.
 *   - Present but schema-invalid → throws `ConfigCascadeError('parse', …)`.
 *   - I/O failure on a present file → throws `ConfigCascadeError('read', …)`.
 *
 * The returned object is fed into {@link deepMergeWithProvenance} so
 * provenance only records leaves the user actually declared — hydration
 * happens on `acc` (the accumulator) via the default-tier seed.
 */
function readProjectConfigInput(repoRoot: string): ProjectConfigInput | null {
  const v2 = projectConfigPathV2(repoRoot);
  const v1 = projectConfigPathV1(repoRoot);
  const filePath = existsSync(v2) ? v2 : existsSync(v1) ? v1 : null;
  if (filePath === null) return null;

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ConfigCascadeError(
      'read',
      `Failed to read ${path.relative(repoRoot, filePath)}: ${message}`,
      { tier: 'project', path: filePath, cause: err },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ConfigCascadeError(
      'parse',
      `Invalid JSON in ${path.relative(repoRoot, filePath)}: ${message}`,
      { tier: 'project', path: filePath, cause: err },
    );
  }

  try {
    return parseProjectConfig(parsed);
  } catch (err) {
    // `parseProjectConfig` throws a plain Error; re-wrap with tier context.
    const message = err instanceof Error ? err.message : String(err);
    throw new ConfigCascadeError(
      'parse',
      `Invalid ${path.relative(repoRoot, filePath)}:\n${message}`,
      { tier: 'project', path: filePath, cause: err },
    );
  }
}

// ---------------------------------------------------------------------------
// deepMergeWithProvenance — deepMerge + flat dot-path provenance
// ---------------------------------------------------------------------------

/**
 * Walk `overlay` and record `sources[dot-path] = tier` for every leaf the
 * overlay contributes. Arrays are leaves (matching the shipped merge
 * semantics); `null` is an explicit leaf; `undefined` is skipped. The
 * walker mutates `sources` in place — callers typically seed it with the
 * default provenance then fold each tier.
 */
function recordProvenance(
  overlay: unknown,
  tier: TierId,
  prefix: string,
  sources: Record<string, TierId>,
): void {
  if (overlay === undefined) return;

  // Arrays are leaves — the merge replaces the target, so the whole array
  // carries one provenance entry keyed on its dot-path.
  if (Array.isArray(overlay)) {
    sources[prefix] = tier;
    return;
  }

  if (isRecord(overlay)) {
    for (const key of Object.keys(overlay)) {
      const next = prefix === '' ? key : `${prefix}.${key}`;
      recordProvenance(overlay[key], tier, next, sources);
    }
    return;
  }

  // Primitives and explicit `null`.
  sources[prefix] = tier;
}

/**
 * Merge `overlay` into `base` and record per-leaf provenance into `sources`.
 * Delegates the structural merge to the shipped {@link deepMerge} so merge
 * semantics (arrays replace, objects recurse, `null` is leaf, `undefined`
 * skips) stay in one place.
 *
 * When `overlay` is `null` / `undefined`, returns `base` unchanged and
 * writes no provenance.
 */
export function deepMergeWithProvenance<T>(
  base: T,
  overlay: ConfigOverlay | Partial<T> | null | undefined,
  tier: TierId,
  sources: Record<string, TierId>,
): T {
  if (overlay === null || overlay === undefined) return base;
  const merged = deepMerge(base, overlay);
  recordProvenance(overlay, tier, '', sources);
  return merged;
}

// ---------------------------------------------------------------------------
// Default provenance seeding
// ---------------------------------------------------------------------------

/**
 * Seed `sources` with every leaf of `DEFAULT_CONFIG + DEFAULT_USER_SETTINGS`
 * tagged as the `'default'` tier. The base reference for this walk is the
 * already-merged defaults shape — a {@link CascadeShape} — so the function
 * reuses {@link recordProvenance}'s leaf detection.
 */
function seedDefaultProvenance(
  base: CascadeShape,
  sources: Record<string, TierId>,
): void {
  recordProvenance(base, 'default', '', sources);
}

// ---------------------------------------------------------------------------
// resolveConfig — cascade entry point
// ---------------------------------------------------------------------------

/**
 * Build the {@link ResolvedConfig} for `repoRoot`, optionally overlaying
 * the T3 session row identified by `sessionId`.
 *
 * Pipeline:
 *   1. Seed the default tier from `DEFAULT_CONFIG` + `DEFAULT_USER_SETTINGS.ui`
 *      and tag every leaf as `'default'`.
 *   2. Overlay T1 from `.gobbi/settings.json` (tier: user) — skipped if
 *      the file is absent. Provenance records only keys the file declared.
 *   3. Overlay T2 from `.gobbi/project/settings.json` or the legacy
 *      `.gobbi/project-config.json` (tier: project) — skipped when both
 *      files are absent so the 'project' tier is invisible in that case.
 *      Raw pre-hydration input is used for merge so provenance only
 *      records user-declared leaves.
 *   4. If `sessionId` is set, open a scoped {@link ConfigStore} via `using`
 *      and overlay the {@link toCascadeProjection} result (tier: session) —
 *      skipped if the projection returns `null` (session absent).
 *
 * All inner readers throw {@link ConfigCascadeError}; any non-cascade error
 * (e.g. a `ConfigStore` constructor failure on a corrupt DB) is wrapped in
 * `ConfigCascadeError('read', …)` with the original `cause` preserved for
 * diagnostics.
 */
export function resolveConfig(args: {
  readonly repoRoot: string;
  readonly sessionId?: string;
}): ResolvedConfig {
  const { repoRoot, sessionId } = args;

  // Seed provenance — default tier tags every leaf of the base shape.
  const sources: Record<string, TierId> = {};

  // Build the default-tier base that includes every required
  // CascadeShape key. DEFAULT_CONFIG (T2) carries verification / cost /
  // notify / git / eval / trivialRange; DEFAULT_USER_SETTINGS.ui (T1)
  // supplies the missing `ui` section. Neither constant mutates — the
  // spread produces a fresh, frozen-free object fold can build on.
  const baseDefaults: CascadeShape = {
    verification: DEFAULT_CONFIG.verification,
    cost: DEFAULT_CONFIG.cost,
    notify: DEFAULT_CONFIG.notify,
    git: DEFAULT_CONFIG.git,
    eval: DEFAULT_CONFIG.eval,
    trivialRange: DEFAULT_CONFIG.trivialRange,
    ui: DEFAULT_USER_SETTINGS.ui,
  };
  seedDefaultProvenance(baseDefaults, sources);

  let acc: CascadeShape = baseDefaults;

  // Tier 1 — user settings. Use the raw (pre-hydration) input so
  // provenance records only the keys the user explicitly declared.
  // `loadUserSettings` (the public surface) returns the hydrated shape;
  // the resolver needs only the deltas.
  const t1Input = readUserSettingsInput(repoRoot);
  if (t1Input !== null) {
    acc = deepMergeWithProvenance(
      acc,
      t1Input as unknown as ConfigOverlay,
      'user',
      sources,
    );
  }

  // Tier 2 — project settings. Read the on-disk file raw (NOT via
  // `loadProjectConfig` — that hydrates every optional section from
  // DEFAULT_CONFIG, which would tag every leaf as 'project' in the
  // provenance map). When no file is present, skip the overlay entirely
  // so the 'project' tier is invisible. When either the v2 or legacy v1
  // file exists, parse + validate it and overlay only the sections it
  // explicitly declares.
  const t2Input = readProjectConfigInput(repoRoot);
  if (t2Input !== null) {
    acc = deepMergeWithProvenance(
      acc,
      t2Input as unknown as ConfigOverlay,
      'project',
      sources,
    );
  }

  // Tier 3 — session projection (optional)
  if (sessionId !== undefined && sessionId !== '') {
    try {
      using store = openConfigStore(repoRoot);
      const t3 = toCascadeProjection(store, sessionId);
      if (t3 !== null) {
        acc = deepMergeWithProvenance(acc, t3 as ConfigOverlay, 'session', sources);
      }
    } catch (err) {
      if (err instanceof ConfigCascadeError) throw err;
      const message = err instanceof Error ? err.message : String(err);
      throw new ConfigCascadeError('read', message, { tier: 'session', cause: err });
    }
  }

  return Object.freeze({
    ...acc,
    __sources: Object.freeze({ ...sources }),
  });
}
