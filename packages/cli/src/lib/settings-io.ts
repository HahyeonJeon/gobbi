/**
 * Level I/O + cascade resolution for the unified {@link Settings} shape.
 *
 * Three levels, one shape:
 *
 *   workspace → `.gobbi/settings.json`                    (gitignored)
 *   project   → `.gobbi/project/settings.json`            (tracked)
 *   session   → `.gobbi/sessions/<id>/settings.json`      (gitignored)
 *
 * Cascade order: `default → workspace → project → session`. Narrower wins.
 * Arrays replace; `null` is an explicit leaf that terminates delegation;
 * `undefined` / absent keys delegate up.
 *
 * ## Module boundary
 *
 *   - Type shape + defaults + `deepMerge` + `ConfigCascadeError` live in
 *     `settings.ts`.
 *   - AJV validation lives in `settings-validator.ts`.
 *   - This module composes them into on-disk reads, atomic writes, cascade
 *     resolution, and the `resolveEvalDecision` translation helper that
 *     converts the `evaluate.mode` enum into a boolean for the EVAL_DECIDE
 *     event payload.
 *
 * ## Cross-field check
 *
 * After cascade merge, `resolveSettings` asserts:
 *
 *   - `git.workflow.mode === 'worktree-pr'` must have `git.workflow.baseBranch !== null`.
 *
 * The check runs on the resolved state (post-merge) because it depends on
 * the cascaded value, not on any single level's file. Failure throws
 * `ConfigCascadeError('parse', …)` without a `tier` (the violation is in
 * the cascaded projection, not attributable to one level).
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { ConfigCascadeError, DEFAULTS, deepMerge, type Settings, type SettingsLevel } from './settings.js';
import { formatAjvErrors, validateSettings } from './settings-validator.js';

// ---------------------------------------------------------------------------
// Level path helpers
// ---------------------------------------------------------------------------

/** Path to `.gobbi/settings.json` — workspace (gitignored) level. */
export function workspaceSettingsPath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'settings.json');
}

/** Path to `.gobbi/project/settings.json` — project (tracked) level. */
export function projectSettingsPath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'project', 'settings.json');
}

/**
 * Path to `.gobbi/sessions/<sessionId>/settings.json` — session level.
 * The caller is responsible for supplying a real session id (discovered
 * per the `session-id-discovery` / `cli-vs-skill-session-id` gotchas).
 */
export function sessionSettingsPath(repoRoot: string, sessionId: string): string {
  return path.join(repoRoot, '.gobbi', 'sessions', sessionId, 'settings.json');
}

/**
 * Resolve the on-disk path for a given level. For `'session'`, `sessionId`
 * is required — throws if absent.
 */
function pathForLevel(repoRoot: string, level: SettingsLevel, sessionId?: string): string {
  if (level === 'workspace') return workspaceSettingsPath(repoRoot);
  if (level === 'project') return projectSettingsPath(repoRoot);
  if (sessionId === undefined || sessionId === '') {
    throw new ConfigCascadeError(
      'read',
      `session level requires a session id`,
      { tier: 'session' },
    );
  }
  return sessionSettingsPath(repoRoot, sessionId);
}

// ---------------------------------------------------------------------------
// Single-level read
// ---------------------------------------------------------------------------

/**
 * Read and validate the settings file at a single level. Returns `null`
 * when the file is absent (cascade treats this as "level not present").
 *
 *   - I/O failure on an existing file → `ConfigCascadeError('read', …)`.
 *   - JSON parse error → `ConfigCascadeError('parse', …)`.
 *   - AJV schema violation → `ConfigCascadeError('parse', …)`.
 *
 * No hydration — the returned {@link Settings} reflects only the keys the
 * file declares (plus the required `schemaVersion: 1`). Hydration with
 * {@link DEFAULTS} happens at cascade resolve time via {@link resolveSettings}.
 */
export function loadSettingsAtLevel(
  repoRoot: string,
  level: SettingsLevel,
  sessionId?: string,
): Settings | null {
  const filePath = pathForLevel(repoRoot, level, sessionId);
  if (!existsSync(filePath)) return null;

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new ConfigCascadeError(
      'read',
      `Failed to read ${path.relative(repoRoot, filePath)}: ${message}`,
      { tier: level, path: filePath, cause: err },
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
      { tier: level, path: filePath, cause: err },
    );
  }

  if (!validateSettings(parsed)) {
    const messages = formatAjvErrors(validateSettings.errors);
    throw new ConfigCascadeError(
      'parse',
      `Invalid ${path.relative(repoRoot, filePath)}:\n${messages}`,
      { tier: level, path: filePath },
    );
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// Single-level atomic write
// ---------------------------------------------------------------------------

/**
 * Atomically write a {@link Settings} document to the given level's file.
 *
 *   1. Validate `settings` against the AJV schema — throws
 *      `ConfigCascadeError('parse', …)` on failure so callers never write
 *      invalid JSON to disk.
 *   2. Ensure the parent directory exists.
 *   3. `JSON.stringify(settings, null, 2)` + trailing newline.
 *   4. Write to `<path>.tmp`, then `renameSync` to the target path.
 *
 * Atomic write protects readers from seeing a half-written file if the
 * process is interrupted. Solo-user context: no file-locking needed.
 */
export function writeSettingsAtLevel(
  repoRoot: string,
  level: SettingsLevel,
  settings: Settings,
  sessionId?: string,
): void {
  if (!validateSettings(settings)) {
    const messages = formatAjvErrors(validateSettings.errors);
    throw new ConfigCascadeError(
      'parse',
      `Refusing to write invalid settings:\n${messages}`,
      { tier: level },
    );
  }

  const filePath = pathForLevel(repoRoot, level, sessionId);
  mkdirSync(path.dirname(filePath), { recursive: true });

  const payload = `${JSON.stringify(settings, null, 2)}\n`;
  const tmpPath = `${filePath}.tmp`;
  writeFileSync(tmpPath, payload, 'utf8');
  renameSync(tmpPath, filePath);
}

// ---------------------------------------------------------------------------
// Cascade resolution
// ---------------------------------------------------------------------------

/**
 * Compose the cascade `default → workspace → project → session` into a
 * single {@link Settings}. Narrower wins; arrays replace; `null` is a leaf.
 * Every field in {@link DEFAULTS} is populated after resolution.
 *
 * Throws {@link ConfigCascadeError} when any level's file is malformed
 * (JSON / schema), or when the cross-field `worktree-pr` + null
 * `baseBranch` invariant fails post-merge.
 *
 * `sessionId` is optional — when absent, the session level is skipped
 * (the session tier is "not present"). The CLI reads
 * `$CLAUDE_SESSION_ID` or a `--session-id` flag and passes an explicit
 * id; env discovery is an orchestrator-skill concern per the
 * `cli-vs-skill-session-id` gotcha.
 */
export function resolveSettings(args: {
  readonly repoRoot: string;
  readonly sessionId?: string;
}): Settings {
  const { repoRoot, sessionId } = args;

  let acc: Settings = DEFAULTS;

  const workspace = loadSettingsAtLevel(repoRoot, 'workspace');
  if (workspace !== null) {
    acc = deepMerge<Settings>(acc, workspace);
  }

  const project = loadSettingsAtLevel(repoRoot, 'project');
  if (project !== null) {
    acc = deepMerge<Settings>(acc, project);
  }

  if (sessionId !== undefined && sessionId !== '') {
    const session = loadSettingsAtLevel(repoRoot, 'session', sessionId);
    if (session !== null) {
      acc = deepMerge<Settings>(acc, session);
    }
  }

  // Cross-field invariant — runs on the cascaded state because it depends
  // on the final resolved values, not on any single level's file.
  const gitWorkflow = acc.git?.workflow;
  if (gitWorkflow?.mode === 'worktree-pr' && (gitWorkflow.baseBranch === null || gitWorkflow.baseBranch === undefined)) {
    throw new ConfigCascadeError(
      'parse',
      'git.workflow.mode "worktree-pr" requires git.workflow.baseBranch to be set (non-null).',
    );
  }

  return acc;
}

// ---------------------------------------------------------------------------
// resolveEvalDecision — enum → boolean translation helper
// ---------------------------------------------------------------------------

/** Source of the resolved boolean — for observability and debug. */
export type EvalDecisionSource = 'always' | 'skip' | 'ask' | 'auto' | 'default';

/** Decision produced by {@link resolveEvalDecision}. */
export interface EvalDecision {
  readonly enabled: boolean;
  readonly source: EvalDecisionSource;
}

/**
 * Translate a resolved cascade's `workflow.<step>.evaluate.mode` enum into
 * the boolean the EVAL_DECIDE event payload expects. Pure function; no I/O.
 *
 *   - `'always'` → `{enabled: true, source: 'always'}`
 *   - `'skip'`   → `{enabled: false, source: 'skip'}`
 *   - `'ask'`    → requires `context.userAnswer`. Throws if absent so the
 *                  caller cannot emit an incorrect boolean silently.
 *   - `'auto'`   → requires `context.orchestratorDecision`. Same discipline.
 *   - field absent → uses {@link DEFAULTS} ('always'), marked
 *                    `source: 'default'` so callers can tell "nothing set"
 *                    from "explicitly always".
 *
 * Rationale: the config records the user's *intent* (the enum); the
 * translation to boolean fires at each step's eval checkpoint. Splitting
 * the concerns keeps `gobbi config set` independent of workflow runtime.
 */
export function resolveEvalDecision(
  cascade: Settings,
  step: 'ideation' | 'plan' | 'planning' | 'execution',
  context?: { userAnswer?: boolean; orchestratorDecision?: boolean },
): EvalDecision {
  // The state-machine literal is `'plan'`; the settings field is `planning`.
  // Accept both for backward compatibility until the comprehensive rename
  // Pass aligns the state-machine literal with the loop name.
  const settingsKey: 'ideation' | 'planning' | 'execution' =
    step === 'plan' ? 'planning' : step;
  const stepSettings = cascade.workflow?.[settingsKey];
  const mode = stepSettings?.evaluate?.mode;

  if (mode === 'always') {
    return { enabled: true, source: 'always' };
  }
  if (mode === 'skip') {
    return { enabled: false, source: 'skip' };
  }
  if (mode === 'ask') {
    if (context?.userAnswer === undefined) {
      throw new Error(
        `eval mode "ask" at step ${step} requires context.userAnswer`,
      );
    }
    return { enabled: context.userAnswer, source: 'ask' };
  }
  if (mode === 'auto') {
    if (context?.orchestratorDecision === undefined) {
      throw new Error(
        `eval mode "auto" at step ${step} requires context.orchestratorDecision`,
      );
    }
    return { enabled: context.orchestratorDecision, source: 'auto' };
  }

  // Field absent — fall through to DEFAULTS. Every step in DEFAULTS is
  // `evaluate.mode: 'always'`, but tag the source distinctly so callers
  // can distinguish "no override" from "explicit 'always'".
  const defaultMode = DEFAULTS.workflow?.[settingsKey]?.evaluate?.mode;
  if (defaultMode === 'always') {
    return { enabled: true, source: 'default' };
  }
  if (defaultMode === 'skip') {
    return { enabled: false, source: 'default' };
  }
  // DEFAULTS only ever carries 'always' for evaluate.mode today; this
  // branch exists for future-proofing if the defaults change.
  return { enabled: true, source: 'default' };
}
