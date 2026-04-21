/**
 * `.gobbi/project/settings.json` (v2) and legacy `.gobbi/project-config.json`
 * (v1) — schema, loader, migration orchestrator, and init helper.
 *
 * One per-repo configuration file, checked into git, governing verification
 * commands, cost-table resolution, and the v2 cascade-policy sections
 * (notify / git / eval / trivialRange). Schema is validated by ajv with
 * per-version compiled validators dispatched on the raw `version` field;
 * defaults are hydrated in TS via `deepMerge` rather than ajv's
 * `useDefaults` — see PR E §E.5 research `e5-ajv-useDefaults-pitfalls.md`
 * (ajv issue #1710 makes nested-defaults hydration fragile).
 *
 * ## Schema evolution — two-schema AJV dispatch
 *
 *   - `ProjectConfigInputV1` = `{version:1, verification?, cost?}`
 *   - `ProjectConfigInputV2` = `{version:2, verification?, cost?, notify?, git?, eval?, trivialRange?}`
 *   - `ProjectConfigInput = V1 | V2`
 *   - Runtime dispatch in {@link parseProjectConfig} reads the raw `version`
 *     field defensively via `isRecord`, then calls the matching compiled
 *     validator. `JSONSchemaType<T>` does not accept union types, so two
 *     separate compiled schemas are maintained.
 *
 * ## Resolution policy
 *
 *   - Loader uses the explicit `repoRoot` argument (tests pass a tmpdir; the
 *     CLI resolves `getRepoRoot()` once at the call site).
 *   - No walk-up search — a missing file is either auto-created by
 *     {@link ensureProjectConfig} on init, or treated as in-memory defaults by
 *     {@link loadProjectConfig} for non-init callers.
 *   - Pass-3: loader reads the new location `.gobbi/project/settings.json`
 *     first, falling back to the legacy `.gobbi/project-config.json`.
 *     `ensureConfigCascade` migrates legacy→new on any init invocation.
 *
 * ## Idempotency
 *
 * {@link ensureProjectConfig} is safe to call on every `gobbi workflow init`
 * invocation (startup / resume / compact hook re-entry). It composes two
 * idempotent steps: (1) write `DEFAULT_CONFIG` to the legacy location if no
 * project config exists yet, and (2) run {@link ensureConfigCascade} which
 * handles rename (legacy → new), legacy-settings.json archive, T1 fresh init,
 * and `.gitignore` update. Each step is a silent no-op when its target state
 * is already reached.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import Ajv2020, { type JSONSchemaType } from 'ajv/dist/2020.js';

import { isRecord } from './guards.js';
import { openConfigStore } from './config-store.js';
import type { VerificationPolicy } from '../workflow/events/verification.js';

export type { VerificationPolicy };

// ---------------------------------------------------------------------------
// Public types — V1 (legacy)
// ---------------------------------------------------------------------------

/** One verification command slot (lint, test, typecheck, build, format, custom). */
export interface CommandSlot {
  readonly command: string;
  readonly policy: VerificationPolicy;
  readonly timeoutMs: number;
}

/** Map of known verification command keys. `custom` may be null to disable. */
export interface VerificationCommands {
  readonly lint: CommandSlot | null;
  readonly test: CommandSlot | null;
  readonly typecheck: CommandSlot | null;
  readonly build: CommandSlot | null;
  readonly format: CommandSlot | null;
  readonly custom: CommandSlot | null;
}

export interface VerificationConfig {
  readonly commands: VerificationCommands;
  /** Ordered list of command keys (e.g. `['typecheck','test']`) to dispatch after a subagent stops. */
  readonly runAfterSubagentStop: readonly string[];
}

export interface CostConfig {
  /** `'builtin'` uses the bundled rate table; any other string is treated as a file path. */
  readonly rateTable: string;
}

// ---------------------------------------------------------------------------
// Public types — V2 (Pass 3 cascade)
// ---------------------------------------------------------------------------

export interface NotifyConfig {
  readonly slack: boolean;
  readonly telegram: boolean;
  readonly discord: boolean;
}

export type GitMode = 'direct-commit' | 'worktree-pr';

export interface GitConfig {
  readonly mode: GitMode;
  readonly baseBranch: string | null;
}

export interface EvalConfig {
  readonly ideation: boolean;
  readonly plan: boolean;
  readonly execution: boolean;
}

export type TrivialRange = 'read-only' | 'simple-edits';

/**
 * Hydrated V1 project config. Returned by {@link loadProjectConfig} when the
 * on-disk file is a V1 document. `verification` and `cost` are always present.
 */
export interface ProjectConfigV1 {
  readonly version: 1;
  readonly verification: VerificationConfig;
  readonly cost: CostConfig;
}

/**
 * Hydrated V2 project config. Returned by {@link loadProjectConfig} when the
 * on-disk file is a V2 document. All optional sections are hydrated from
 * `DEFAULT_CONFIG` via {@link deepMerge}.
 */
export interface ProjectConfigV2 {
  readonly version: 2;
  readonly verification: VerificationConfig;
  readonly cost: CostConfig;
  readonly notify: NotifyConfig;
  readonly git: GitConfig;
  readonly eval: EvalConfig;
  readonly trivialRange: TrivialRange;
}

/**
 * Fully-populated project config — what {@link loadProjectConfig} returns.
 * Discriminated union on `version`; both arms guarantee `verification` and
 * `cost` are present and hydrated.
 */
export type ProjectConfig = ProjectConfigV1 | ProjectConfigV2;

// ---------------------------------------------------------------------------
// Input shapes (on-disk, pre-hydration)
// ---------------------------------------------------------------------------

/**
 * On-disk shape of a V1 `.gobbi/project-config.json`. Users may omit any
 * field except `version`; {@link deepMerge} fills the rest from v1 defaults.
 */
export interface ProjectConfigInputV1 {
  readonly version: 1;
  readonly verification?: {
    readonly commands?: {
      readonly lint?: CommandSlot | null;
      readonly test?: CommandSlot | null;
      readonly typecheck?: CommandSlot | null;
      readonly build?: CommandSlot | null;
      readonly format?: CommandSlot | null;
      readonly custom?: CommandSlot | null;
    };
    readonly runAfterSubagentStop?: readonly string[];
  };
  readonly cost?: {
    readonly rateTable?: string;
  };
}

/**
 * On-disk shape of a V2 `.gobbi/project/settings.json`. All sections are
 * optional; missing sections hydrate from `DEFAULT_CONFIG`.
 */
export interface ProjectConfigInputV2 {
  readonly version: 2;
  readonly verification?: {
    readonly commands?: {
      readonly lint?: CommandSlot | null;
      readonly test?: CommandSlot | null;
      readonly typecheck?: CommandSlot | null;
      readonly build?: CommandSlot | null;
      readonly format?: CommandSlot | null;
      readonly custom?: CommandSlot | null;
    };
    readonly runAfterSubagentStop?: readonly string[];
  };
  readonly cost?: {
    readonly rateTable?: string;
  };
  readonly notify?: {
    readonly slack?: boolean;
    readonly telegram?: boolean;
    readonly discord?: boolean;
  };
  readonly git?: {
    readonly mode?: GitMode;
    readonly baseBranch?: string | null;
  };
  readonly eval?: {
    readonly ideation?: boolean;
    readonly plan?: boolean;
    readonly execution?: boolean;
  };
  readonly trivialRange?: TrivialRange;
}

/** Raw, pre-hydration shape read from disk. */
export type ProjectConfigInput = ProjectConfigInputV1 | ProjectConfigInputV2;

// ---------------------------------------------------------------------------
// Defaults — the single source of truth
// ---------------------------------------------------------------------------

const DEFAULT_VERIFICATION: VerificationConfig = {
  commands: {
    lint:      { command: 'bun lint',             policy: 'inform', timeoutMs: 60000 },
    test:      { command: 'bun test',             policy: 'gate',   timeoutMs: 300000 },
    typecheck: { command: 'bunx tsc --noEmit',    policy: 'gate',   timeoutMs: 120000 },
    build:     { command: 'bun run build',        policy: 'inform', timeoutMs: 300000 },
    format:    { command: 'bun run format:check', policy: 'inform', timeoutMs: 30000 },
    custom:    null,
  },
  runAfterSubagentStop: ['typecheck', 'test'],
};

const DEFAULT_COST: CostConfig = { rateTable: 'builtin' };

/**
 * Fresh-init and V2 hydration default. `version: 2` means fresh
 * `gobbi config init` writes V2. V1 files continue to load via the V1
 * hydration path and their `version: 1` is preserved in the return shape.
 */
export const DEFAULT_CONFIG: ProjectConfigV2 = {
  version: 2,
  verification: DEFAULT_VERIFICATION,
  cost: DEFAULT_COST,
  notify: { slack: false, telegram: false, discord: false },
  git: { mode: 'direct-commit', baseBranch: null },
  eval: { ideation: false, plan: false, execution: true },
  trivialRange: 'read-only',
};

/**
 * V1-shaped hydration base. Identical to the pre-Pass-3 `DEFAULT_CONFIG`.
 * Used when {@link parseProjectConfig} dispatches to the V1 validator so
 * V1 files keep their `version: 1` identity after hydration.
 */
const DEFAULT_CONFIG_V1: ProjectConfigV1 = {
  version: 1,
  verification: DEFAULT_VERIFICATION,
  cost: DEFAULT_COST,
};

/**
 * T1 user-settings defaults. Written by {@link ensureConfigCascade} Step 3
 * on a fresh repo. The T3 cascade resolver (Pass 3 Task T3) loads this file
 * and layers it between T2 and the built-in defaults.
 *
 * TODO(T3): when `lib/config-cascade.ts` lands, relocate or re-export from
 * there; for T2 the constant lives here so `ensureConfigCascade` Step 3 can
 * construct the file content without importing from an as-yet-unbuilt module.
 */
export const DEFAULT_USER_SETTINGS = {
  schemaVersion: 1,
  notify: { slack: false, telegram: false, discord: false },
  git: { mode: 'direct-commit', baseBranch: null },
  eval: { ideation: false, plan: false, execution: true },
  trivialRange: 'read-only',
  ui: { verbosity: 'compact' },
} as const;

const GITIGNORE_CONTENT =
  '# Auto-generated by gobbi. Runtime session/worktree state.\n' +
  'sessions/\n' +
  'worktrees/\n' +
  'project/note/\n' +
  'settings.json\n';

// ---------------------------------------------------------------------------
// JSON Schema — shared subschemas
// ---------------------------------------------------------------------------

const commandSlotSchema = {
  type: 'object',
  required: ['command', 'policy', 'timeoutMs'],
  additionalProperties: false,
  properties: {
    command: { type: 'string', minLength: 1 },
    policy: { type: 'string', enum: ['inform', 'gate'] },
    timeoutMs: { type: 'integer', minimum: 0 },
  },
  nullable: true,
} as const;

const verificationSchemaFragment = {
  type: 'object',
  nullable: true,
  additionalProperties: false,
  properties: {
    commands: {
      type: 'object',
      nullable: true,
      additionalProperties: false,
      properties: {
        lint: commandSlotSchema,
        test: commandSlotSchema,
        typecheck: commandSlotSchema,
        build: commandSlotSchema,
        format: commandSlotSchema,
        custom: commandSlotSchema,
      },
    },
    runAfterSubagentStop: {
      type: 'array',
      nullable: true,
      items: { type: 'string', minLength: 1 },
    },
  },
} as const;

const costSchemaFragment = {
  type: 'object',
  nullable: true,
  additionalProperties: false,
  properties: {
    rateTable: { type: 'string', nullable: true, minLength: 1 },
  },
} as const;

// ---------------------------------------------------------------------------
// JSON Schema — V1 (legacy) and V2 (Pass 3)
// ---------------------------------------------------------------------------

/**
 * Top-level V1 JSON Schema. Drift check: `JSONSchemaType<ProjectConfigInputV1>`
 * forces this schema and the TS interface to evolve together.
 *
 * No `useDefaults` — defaults are provided by TS via {@link deepMerge}. See
 * `e5-ajv-useDefaults-pitfalls.md` for why nested-defaults are unreliable
 * under ajv (issue #1710 and friends).
 */
const projectConfigSchemaV1: JSONSchemaType<ProjectConfigInputV1> = {
  type: 'object',
  required: ['version'],
  additionalProperties: false,
  properties: {
    version: { type: 'integer', const: 1 },
    verification: verificationSchemaFragment,
    cost: costSchemaFragment,
  },
};

/**
 * Top-level V2 JSON Schema for `.gobbi/project/settings.json`. V2 adds
 * `notify`, `git`, `eval`, and `trivialRange` as optional sections on top
 * of the V1 shape; all continue to be hydrated from {@link DEFAULT_CONFIG}
 * via {@link deepMerge}.
 */
const projectConfigSchemaV2: JSONSchemaType<ProjectConfigInputV2> = {
  type: 'object',
  required: ['version'],
  additionalProperties: false,
  properties: {
    version: { type: 'integer', const: 2 },
    verification: verificationSchemaFragment,
    cost: costSchemaFragment,
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
  },
};

const ajv = new Ajv2020({
  strict: true,
  allErrors: true,
});

// Two separately compiled validators — `JSONSchemaType<T>` does not accept
// union types, so a single `oneOf` schema is not an option. Compilation is
// one-off at module init per `phase2-planning.md` ("ajv validators are
// cached per-compile; create both v1 and v2 at module init, not per-parse").
const validateV1 = ajv.compile<ProjectConfigInputV1>(projectConfigSchemaV1);
const validateV2 = ajv.compile<ProjectConfigInputV2>(projectConfigSchemaV2);

// ---------------------------------------------------------------------------
// Parse + dispatch
// ---------------------------------------------------------------------------

function formatAjvErrors(errors: readonly { instancePath?: string; message?: string }[] | null | undefined): string {
  const list = errors ?? [];
  return list
    .map((e) => `  ${e.instancePath ?? '' ? e.instancePath : '<root>'}: ${e.message ?? 'unknown error'}`)
    .join('\n');
}

/**
 * Parse a raw JSON-derived value into a typed {@link ProjectConfigInput}.
 * Reads the `version` field defensively via `isRecord`, dispatches to the
 * matching compiled validator, and throws a descriptive error on unknown
 * version or validation failure.
 *
 * Callers:
 *   - {@link loadProjectConfig} parses on-disk JSON and hydrates with defaults.
 *   - Future Pass-3 Task T3's `config-cascade` module parses the T2 file to
 *     layer into the cascade. It replaces the thrown `Error` with a typed
 *     `ConfigCascadeError('parse', ...)` once the error class lands.
 *
 * TODO(T3): replace the thrown `Error` below with `ConfigCascadeError` from
 * `lib/config-cascade.ts` once that module exists. T2 does not depend on
 * config-cascade.ts (which T3 owns), so a plain `Error` is used here.
 */
export function parseProjectConfig(raw: unknown): ProjectConfigInput {
  const version = isRecord(raw) && typeof raw['version'] === 'number' ? raw['version'] : null;

  if (version === 1) {
    if (validateV1(raw)) return raw;
    const messages = formatAjvErrors(validateV1.errors);
    throw new Error(`Invalid project config (v1):\n${messages}`);
  }

  if (version === 2) {
    if (validateV2(raw)) return raw;
    const messages = formatAjvErrors(validateV2.errors);
    throw new Error(`Invalid project config (v2):\n${messages}`);
  }

  throw new Error(
    `Invalid project config: unknown version ${version === null ? '<missing>' : String(version)} — expected 1 or 2`,
  );
}

// ---------------------------------------------------------------------------
// deepMerge — TS-side defaults hydration
// ---------------------------------------------------------------------------

/**
 * Deep-merge two plain-object trees. Right wins on leaves; arrays replace
 * (no concat); `null` on the right is a leaf and replaces the left value;
 * non-record values stop recursion.
 *
 * Only intended for {@link ProjectConfig}-shaped trees — the return type is
 * cast to the template `T` after the merge completes.
 */
export function deepMerge<T>(base: T, overlay: unknown): T {
  if (!isRecord(base) || !isRecord(overlay)) {
    // Non-object base (shouldn't happen for our use) or overlay missing —
    // return base unchanged when overlay isn't a record.
    return base;
  }

  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overlay)) {
    const overlayValue = overlay[key];
    const baseValue = out[key];

    if (overlayValue === undefined) continue;

    if (isRecord(baseValue) && isRecord(overlayValue)) {
      out[key] = deepMerge(baseValue, overlayValue);
    } else {
      // Leaf write: primitives, null, arrays (replace), or overlay-added keys.
      out[key] = overlayValue;
    }
  }
  return out as T;
}

// ---------------------------------------------------------------------------
// Loader + init paths
// ---------------------------------------------------------------------------

function configPathV1(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'project-config.json');
}

function configPathV2(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'project', 'settings.json');
}

function userSettingsPath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'settings.json');
}

function legacyUserSettingsArchivePath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'settings.legacy.json');
}

function gitignorePathFor(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', '.gitignore');
}

/**
 * Resolve the on-disk project-config path. Prefers the V2 location
 * `.gobbi/project/settings.json`; falls back to the legacy V1 location
 * `.gobbi/project-config.json`. Returns `null` if neither exists.
 */
function resolveConfigPath(repoRoot: string): string | null {
  const v2 = configPathV2(repoRoot);
  if (existsSync(v2)) return v2;
  const v1 = configPathV1(repoRoot);
  if (existsSync(v1)) return v1;
  return null;
}

/**
 * Load and validate the project config, merging over the matching default
 * shape for a fully-populated result.
 *
 * Missing file → returns {@link DEFAULT_CONFIG} (V2) in-memory. Invalid JSON
 * or schema violation → throws with the ajv error path included.
 */
export function loadProjectConfig(repoRoot: string): ProjectConfig {
  const configPath = resolveConfigPath(repoRoot);
  if (configPath === null) return DEFAULT_CONFIG;

  const raw = readFileSync(configPath, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Invalid ${path.relative(repoRoot, configPath)}: JSON parse error — ${message}`,
    );
  }

  let typed: ProjectConfigInput;
  try {
    typed = parseProjectConfig(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Invalid ${path.relative(repoRoot, configPath)}:\n${message}`);
  }

  if (typed.version === 1) {
    return deepMerge(DEFAULT_CONFIG_V1, typed);
  }
  return deepMerge(DEFAULT_CONFIG, typed);
}

// ---------------------------------------------------------------------------
// ensureConfigCascade — Pass-3 migration orchestrator
// ---------------------------------------------------------------------------

/**
 * Pass-3 migration orchestrator. Safe to call on every init; each step is a
 * silent no-op when its target state is already reached.
 *
 *   - Step 0 — open and close a scoped {@link ConfigStore}. The store's
 *     auto-migration path (see `config-store.ts::openConfigStore`) migrates
 *     legacy `.gobbi/settings.json` or `.claude/gobbi.json` sessions into
 *     `.gobbi/config.db` if the DB does not yet exist.
 *   - Step 1 — rename legacy `.gobbi/project-config.json` to
 *     `.gobbi/project/settings.json` if the V2 location is absent.
 *   - Step 2 — archive legacy sessions-shape `.gobbi/settings.json` as
 *     `settings.legacy.json` once Step 0 has copied its sessions to the DB.
 *     The guard on `isLegacyGobbiJson` prevents archiving hand-written T1
 *     files.
 *   - Step 3 — write {@link DEFAULT_USER_SETTINGS} to `.gobbi/settings.json`
 *     if that path is absent (post-archive or on a fresh repo).
 *   - Step 4 — append `settings.json` to `.gobbi/.gitignore` if the line is
 *     not already present.
 *
 * Concurrency: Step 0 uses the `using` block so the WAL handle releases
 * before Steps 1-4 touch the filesystem. This prevents overlapping handles
 * when the caller (workflow init) also opens a store downstream.
 */
export function ensureConfigCascade(repoRoot: string): void {
  // The `.gobbi/` directory is a precondition for bun:sqlite's Database
  // constructor inside `openConfigStore`. Fresh tmpdirs (and fresh real
  // repos) may not have it yet.
  mkdirSync(path.join(repoRoot, '.gobbi'), { recursive: true });

  // Step 0 — scoped ConfigStore open triggers lazy legacy-JSON migration.
  // The `using` statement auto-disposes (close + WAL checkpoint) before
  // later steps touch the filesystem.
  {
    using store = openConfigStore(repoRoot);
    // Explicit reference suppresses an "unused binding" lint signal and
    // documents intent — opening the store is the side-effect we want.
    void store;
  }

  // Step 1 — rename legacy project-config.json → project/settings.json.
  const v1Path = configPathV1(repoRoot);
  const v2Path = configPathV2(repoRoot);
  if (!existsSync(v2Path) && existsSync(v1Path)) {
    mkdirSync(path.dirname(v2Path), { recursive: true });
    renameSync(v1Path, v2Path);
    process.stderr.write('migrated: .gobbi/project-config.json → .gobbi/project/settings.json\n');
  }

  // Step 2 — archive legacy sessions-shape settings.json once its sessions
  // have been copied into config.db by Step 0. The guard requires the
  // legacy shape (all of `version`, `architecture`, `sessions` present)
  // so a hand-written T1 file cannot be accidentally archived.
  //
  // The read is attempted unconditionally and ENOENT is swallowed — folding
  // the existence check into the try/catch eliminates the TOCTOU window
  // where a concurrent process could delete the file between `existsSync`
  // and `readFileSync`. If the file is absent (first-time init) or vanishes
  // mid-read (unlikely cross-process race), `raw` stays null and Step 2 is
  // a no-op.
  const settingsPath = userSettingsPath(repoRoot);
  let raw: string | null = null;
  try {
    raw = readFileSync(settingsPath, 'utf8');
  } catch {
    raw = null;
  }
  if (raw !== null && isLegacyGobbiJson(raw)) {
    renameSync(settingsPath, legacyUserSettingsArchivePath(repoRoot));
    process.stderr.write('archived legacy settings.json → settings.legacy.json\n');
  }

  // Step 3 — fresh T1 init.
  if (!existsSync(settingsPath)) {
    mkdirSync(path.dirname(settingsPath), { recursive: true });
    writeFileSync(
      settingsPath,
      `${JSON.stringify(DEFAULT_USER_SETTINGS, null, 2)}\n`,
      'utf8',
    );
    process.stderr.write('created .gobbi/settings.json with defaults\n');
  }

  // Step 4 — ensure `.gitignore` lists the T1 settings.json so Git
  // does not pick up workspace-scoped user prefs.
  const gitignorePath = gitignorePathFor(repoRoot);
  if (existsSync(gitignorePath)) {
    let existing = '';
    try {
      existing = readFileSync(gitignorePath, 'utf8');
    } catch {
      existing = '';
    }
    const hasLine = existing
      .split(/\r?\n/)
      .some((line) => line.trim() === 'settings.json');
    if (!hasLine) {
      const separator = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
      writeFileSync(gitignorePath, `${existing}${separator}settings.json\n`, 'utf8');
    }
  }
}

/**
 * Strict guard for the legacy `settings.json` / `gobbi.json` sessions shape.
 * Requires all three top-level keys — `version`, `architecture`, and
 * `sessions` where `sessions` is a record of session-id → session. Matches
 * `config.ts::isGobbiJson` semantics (kept local to avoid a circular import
 * and the `config.ts` guard's non-exported status).
 */
function isLegacyGobbiJson(raw: string): boolean {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return false;
  }
  if (!isRecord(parsed)) return false;
  if (typeof parsed['version'] !== 'string') return false;
  if (typeof parsed['architecture'] !== 'string') return false;
  const sessions = parsed['sessions'];
  if (!isRecord(sessions)) return false;
  // Every value in `sessions` must itself be a record (session object).
  for (const value of Object.values(sessions)) {
    if (!isRecord(value)) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// ensureProjectConfig — init-time entry point
// ---------------------------------------------------------------------------

export interface EnsureProjectConfigResult {
  readonly created: boolean;
  readonly path: string;
}

/**
 * Create the project config (+ sibling `.gitignore`) if missing, then run
 * the Pass-3 cascade migration. Returns `created: true` when a project
 * config file did not exist and was written. Silent on stderr in the
 * already-exists case — matches the idempotency contract of
 * `gobbi workflow init`.
 */
export function ensureProjectConfig(repoRoot: string): EnsureProjectConfigResult {
  const v1Path = configPathV1(repoRoot);
  const v2Path = configPathV2(repoRoot);
  const gitignorePath = gitignorePathFor(repoRoot);

  const alreadyExists = existsSync(v2Path) || existsSync(v1Path);

  let created = false;
  if (!alreadyExists) {
    // Fresh init — write at the legacy location. `ensureConfigCascade`
    // below atomically renames it to the V2 location. The legacy path is
    // the canonical fresh-write target during the Pass-3 transition per
    // the briefing's guidance; the rename-follows pattern keeps one source
    // of truth for the write payload (DEFAULT_CONFIG).
    mkdirSync(path.dirname(v1Path), { recursive: true });
    writeFileSync(v1Path, `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`, 'utf8');
    if (!existsSync(gitignorePath)) {
      writeFileSync(gitignorePath, GITIGNORE_CONTENT, 'utf8');
    }
    process.stderr.write('created .gobbi/project-config.json with defaults\n');
    created = true;
  }

  // Always run the cascade migration — idempotent, handles rename, legacy
  // settings.json archive, T1 fresh init, .gitignore update.
  ensureConfigCascade(repoRoot);

  // Resolve the final path — post-cascade the V2 location should exist;
  // fall back to V1 for paranoia (only if the rename failed).
  const resolvedPath = existsSync(v2Path) ? v2Path : v1Path;

  return { created, path: resolvedPath };
}
