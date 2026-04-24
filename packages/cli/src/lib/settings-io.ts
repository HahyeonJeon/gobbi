/**
 * Level I/O + cascade resolution for the unified {@link Settings} shape.
 *
 * Three levels, one shape (new multi-project layout from gobbi-memory Pass 2):
 *
 *   workspace → `.gobbi/settings.json`                                         (gitignored)
 *   project   → `.gobbi/projects/<projectName>/settings.json`                  (tracked)
 *   session   → `.gobbi/projects/<projectName>/sessions/<sessionId>/settings.json` (gitignored)
 *
 * Cascade order: `default → workspace → project → session`. Narrower wins.
 * Arrays replace; `null` is an explicit leaf that terminates delegation;
 * `undefined` / absent keys delegate up.
 *
 * ## Project-name resolution
 *
 * Both the project and session levels are keyed by a project name. The
 * effective project name resolves in priority order:
 *
 *   1. Explicit `projectName` argument passed by the caller.
 *   2. `projects.active` read from the workspace-level `.gobbi/settings.json`.
 *   3. Fallback literal `'gobbi'` (transition default; emits a stderr
 *      warning when neither an explicit name nor an active project is set).
 *      TODO(W2.3): bootstrap should prevent this fallback from firing in
 *      real-world runs.
 *
 * Every path helper that depends on the project name takes it as an
 * explicit, required argument so the resolution happens once at the call
 * site (typically inside `resolveSettings` or the public
 * `load/writeSettingsAtLevel` functions).
 *
 * ## Module boundary
 *
 *   - Type shape + defaults + `deepMerge` + `ConfigCascadeError` live in
 *     `settings.ts`.
 *   - AJV validation lives in `settings-validator.ts`.
 *   - On-disk directory computation lives in `workspace-paths.ts` (the
 *     pure facade introduced by gobbi-memory Pass 2 W1.1). This module
 *     composes facade paths into `settings.json` file paths, adds
 *     atomic-write + AJV-validate, and exposes cascade resolution + the
 *     `resolveEvalDecision` translation helper that converts the
 *     `evaluate.mode` enum into a boolean for the EVAL_DECIDE event payload.
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

import { isRecord } from './guards.js';
import { ConfigCascadeError, DEFAULTS, deepMerge, type Settings, type SettingsLevel } from './settings.js';
import { formatAjvErrors, validateSettings } from './settings-validator.js';
import { projectDir, sessionDir, workspaceRoot } from './workspace-paths.js';

// ---------------------------------------------------------------------------
// Default project name + name resolution
// ---------------------------------------------------------------------------

/**
 * Transition-period fallback used when neither an explicit `projectName`
 * argument nor a workspace-level `projects.active` entry is available.
 * Matches the `DEFAULT_PROJECT_NAME` constant set by W2.1 callers
 * (`ensure-settings-cascade.ts`, `session.ts`, `gotcha/promote.ts`).
 *
 * TODO(W2.3): bootstrap should prevent this fallback from firing; once
 * `gobbi workflow init` always writes a real `projects.active` in
 * `.gobbi/settings.json`, the callers here will never reach the fallback.
 */
const DEFAULT_PROJECT_NAME = 'gobbi';

/**
 * Module-scoped latch — `true` once the transition-period fallback
 * warning has fired. Repeat fallbacks in the same process are silent so
 * a single CLI invocation that resolves project + session levels (both
 * going through {@link resolveProjectName}) emits the warning at most
 * once; repeated `bun test` calls within the same process reset the
 * latch via {@link __resetFallbackWarningLatchForTests} when the test
 * intent is to re-observe the warning.
 *
 * TODO(W2.3): bootstrap should prevent the fallback entirely; when it
 * does, this latch can be removed along with the warning path.
 */
let fallbackWarningFired = false;

/**
 * Test-only hook — reset the warning latch so a subsequent
 * {@link resolveProjectName} call in the same Bun process can re-fire
 * the stderr warning. Exported (not `internal`) because `bun:test` files
 * import the module via the normal specifier; the double-underscore
 * prefix marks the symbol as test-use-only. Production code never calls
 * this.
 */
export function __resetFallbackWarningLatchForTests(): void {
  fallbackWarningFired = false;
}

/**
 * Read `projects.active` from the workspace-level `.gobbi/settings.json`
 * without going through the cascade (to avoid recursion into
 * `resolveSettings` during cascade composition). Returns `null` when the
 * file is absent, fails to parse, or does not declare a non-null active
 * project. Never throws — this is a best-effort lookup used as one leg of
 * the project-name fallback ladder.
 */
function readWorkspaceActiveProject(repoRoot: string): string | null {
  const filePath = path.join(workspaceRoot(repoRoot), 'settings.json');
  if (!existsSync(filePath)) return null;

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) return null;
  const projects = parsed['projects'];
  if (!isRecord(projects)) return null;
  const active = projects['active'];
  return typeof active === 'string' && active.length > 0 ? active : null;
}

/**
 * Resolve the effective project name for path composition.
 *
 *   1. Explicit `projectName` argument → use it (no warning).
 *   2. Workspace `projects.active` → use it (no warning).
 *   3. Fallback `'gobbi'` → use it and emit a stderr warning so
 *      transition-period fallbacks are visible.
 *
 * Centralised so every caller (`pathForLevel`, `resolveSettings`,
 * `load/writeSettingsAtLevel`) applies identical resolution semantics.
 */
function resolveProjectName(repoRoot: string, projectName: string | undefined): string {
  if (projectName !== undefined && projectName !== '') return projectName;
  const active = readWorkspaceActiveProject(repoRoot);
  if (active !== null) return active;
  if (!fallbackWarningFired) {
    process.stderr.write(
      '[settings-io] no projects.active in workspace settings and no projectName argument; ' +
        `falling back to '${DEFAULT_PROJECT_NAME}'\n`,
    );
    fallbackWarningFired = true;
  }
  // TODO(W2.3): bootstrap should prevent this fallback.
  return DEFAULT_PROJECT_NAME;
}

// ---------------------------------------------------------------------------
// Level path helpers
// ---------------------------------------------------------------------------

/** Path to `.gobbi/settings.json` — workspace (gitignored) level. */
export function workspaceSettingsPath(repoRoot: string): string {
  return path.join(workspaceRoot(repoRoot), 'settings.json');
}

/**
 * Path to `.gobbi/projects/<projectName>/settings.json` — project (tracked)
 * level. `projectName` is required so the resolution is explicit at the
 * call site; use {@link resolveProjectName} upstream when only a
 * cascade-derived default is available.
 */
export function projectSettingsPath(repoRoot: string, projectName: string): string {
  return path.join(projectDir(repoRoot, projectName), 'settings.json');
}

/**
 * Path to `.gobbi/projects/<projectName>/sessions/<sessionId>/settings.json`
 * — session level. Both `projectName` and `sessionId` are required; the
 * caller is responsible for supplying a real session id (discovered per the
 * `session-id-discovery` / `cli-vs-skill-session-id` gotchas) and for
 * resolving the project name via {@link resolveProjectName} when only a
 * cascade-derived default is available.
 */
export function sessionSettingsPath(
  repoRoot: string,
  projectName: string,
  sessionId: string,
): string {
  return path.join(sessionDir(repoRoot, projectName, sessionId), 'settings.json');
}

/**
 * Resolve the on-disk path for a given level. `projectName` is required
 * for `'project'` and `'session'` levels — the caller must resolve it
 * beforehand (via {@link resolveProjectName} or an explicit override).
 * For `'session'`, `sessionId` is also required — throws if absent.
 */
function pathForLevel(
  repoRoot: string,
  level: SettingsLevel,
  projectName: string,
  sessionId?: string,
): string {
  if (level === 'workspace') return workspaceSettingsPath(repoRoot);
  if (level === 'project') return projectSettingsPath(repoRoot, projectName);
  if (sessionId === undefined || sessionId === '') {
    throw new ConfigCascadeError(
      'read',
      `session level requires a session id`,
      { tier: 'session' },
    );
  }
  return sessionSettingsPath(repoRoot, projectName, sessionId);
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
  projectName?: string,
): Settings | null {
  // `projectName` is irrelevant at the workspace level; resolve once for
  // project/session so `pathForLevel` never has to re-read workspace settings.
  const resolvedProjectName =
    level === 'workspace' ? DEFAULT_PROJECT_NAME : resolveProjectName(repoRoot, projectName);
  const filePath = pathForLevel(repoRoot, level, resolvedProjectName, sessionId);
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
  projectName?: string,
): void {
  if (!validateSettings(settings)) {
    const messages = formatAjvErrors(validateSettings.errors);
    throw new ConfigCascadeError(
      'parse',
      `Refusing to write invalid settings:\n${messages}`,
      { tier: level },
    );
  }

  const resolvedProjectName =
    level === 'workspace' ? DEFAULT_PROJECT_NAME : resolveProjectName(repoRoot, projectName);
  const filePath = pathForLevel(repoRoot, level, resolvedProjectName, sessionId);
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
 *
 * `projectName` is optional — when absent, the project name resolves from
 * the workspace-level `projects.active` field, falling back to the
 * `'gobbi'` literal with a stderr warning when neither is present (see
 * {@link resolveProjectName}). The resolved project name is used for both
 * the project-level and session-level path composition, so a caller that
 * supplies `projectName: 'foo'` reads `projects/foo/settings.json` and
 * `projects/foo/sessions/<id>/settings.json` in a single pass.
 */
export function resolveSettings(args: {
  readonly repoRoot: string;
  readonly sessionId?: string;
  readonly projectName?: string;
}): Settings {
  const { repoRoot, sessionId, projectName } = args;

  let acc: Settings = DEFAULTS;

  const workspace = loadSettingsAtLevel(repoRoot, 'workspace');
  if (workspace !== null) {
    acc = deepMerge<Settings>(acc, workspace);
  }

  // Resolve projectName AFTER workspace load so `projects.active` (which
  // lives on the workspace file) is visible to `readWorkspaceActiveProject`
  // — the helper reads the same file, but resolving it here keeps a single
  // place where the three-step priority ladder fires per cascade.
  const resolvedProjectName = resolveProjectName(repoRoot, projectName);

  const project = loadSettingsAtLevel(repoRoot, 'project', undefined, resolvedProjectName);
  if (project !== null) {
    acc = deepMerge<Settings>(acc, project);
  }

  if (sessionId !== undefined && sessionId !== '') {
    const session = loadSettingsAtLevel(repoRoot, 'session', sessionId, resolvedProjectName);
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
