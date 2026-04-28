/**
 * Level I/O + cascade resolution for the unified {@link Settings} shape.
 *
 * Three levels, one shape:
 *
 *   workspace → `.gobbi/settings.json`                                         (gitignored)
 *   project   → `.gobbi/projects/<projectName>/settings.json`                  (tracked)
 *   session   → `.gobbi/projects/<projectName>/sessions/<sessionId>/settings.json` (gitignored)
 *
 * Cascade order: `default → workspace → project → session`. Narrower wins.
 * Arrays replace; `null` is an explicit leaf that terminates delegation;
 * `undefined` / absent keys delegate up.
 *
 * ## Project-name resolution (PR-FIN-1c)
 *
 * Both the project and session levels are keyed by a project name. The
 * effective project name resolves in priority order:
 *
 *   1. Explicit `projectName` argument passed by the caller.
 *   2. `basename(repoRoot)` — the directory containing the repo. The
 *      `.gobbi/projects/<name>/` directory is the source of truth for
 *      which projects exist; no registry, no `projects.active`.
 *
 * Callers that need a specific named project pass it explicitly (CLI
 * commands plumb `--project <name>` through). Workspace-level settings
 * have no `projects` block — that registry was removed in PR-FIN-1c.
 *
 * ## Module boundary
 *
 *   - Type shape + defaults + `deepMerge` + `ConfigCascadeError` live in
 *     `settings.ts`.
 *   - AJV validation lives in `settings-validator.ts`.
 *   - On-disk directory computation lives in `workspace-paths.ts`. This
 *     module composes facade paths into `settings.json` file paths, adds
 *     atomic-write + AJV-validate, and exposes cascade resolution + the
 *     `resolveEvalDecision` translation helper that converts the
 *     `evaluate.mode` enum into a boolean for the EVAL_DECIDE event payload.
 *
 * ## Cross-field check (PR-FIN-1c)
 *
 * After cascade merge, `resolveSettings` asserts:
 *
 *   - `git.pr.open === true` requires `git.baseBranch !== null`. A repo
 *     without a target branch (no GitHub remote, direct-commit-style
 *     workflow) must set `pr.open: false` to satisfy the invariant.
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
import { projectDir, sessionDir, workspaceRoot } from './workspace-paths.js';

// ---------------------------------------------------------------------------
// Project-name resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the effective project name for path composition.
 *
 *   1. Explicit `projectName` argument → use it.
 *   2. Fallback `basename(repoRoot)` — the directory containing the repo.
 *
 * Centralised so every caller (`pathForLevel`, `resolveSettings`,
 * `load/writeSettingsAtLevel`) applies identical resolution semantics.
 */
function resolveProjectName(repoRoot: string, projectName: string | undefined): string {
  if (projectName !== undefined && projectName !== '') return projectName;
  return path.basename(repoRoot);
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
 * call site; callers that only have a repo root pass
 * `basename(repoRoot)` (or use {@link resolveSettings} which does that
 * automatically).
 */
export function projectSettingsPath(repoRoot: string, projectName: string): string {
  return path.join(projectDir(repoRoot, projectName), 'settings.json');
}

/**
 * Path to `.gobbi/projects/<projectName>/sessions/<sessionId>/settings.json`
 * — session level. Both `projectName` and `sessionId` are required; the
 * caller is responsible for supplying a real session id (discovered per the
 * `session-id-discovery` / `cli-vs-skill-session-id` gotchas).
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
 * beforehand (typically via {@link resolveProjectName} or an explicit
 * override). For `'session'`, `sessionId` is also required — throws if
 * absent.
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
  // project/session via the basename fallback.
  const resolvedProjectName =
    level === 'workspace' ? path.basename(repoRoot) : resolveProjectName(repoRoot, projectName);
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
    level === 'workspace' ? path.basename(repoRoot) : resolveProjectName(repoRoot, projectName);
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
 * (JSON / schema), or when the cross-field `pr.open` + null `baseBranch`
 * invariant fails post-merge.
 *
 * `sessionId` is optional — when absent, the session level is skipped
 * (the session tier is "not present"). The CLI reads
 * `$CLAUDE_SESSION_ID` or a `--session-id` flag and passes an explicit
 * id; env discovery is an orchestrator-skill concern per the
 * `cli-vs-skill-session-id` gotcha.
 *
 * `projectName` is optional — when absent, the project name resolves to
 * `basename(repoRoot)`. Callers that need to address a specific project
 * pass it explicitly (typically from a `--project <name>` flag).
 */
export function resolveSettings(args: {
  readonly repoRoot: string;
  readonly sessionId?: string;
  readonly projectName?: string;
}): Settings {
  const { repoRoot, sessionId, projectName } = args;

  // Compose the user cascade FIRST (without DEFAULTS), then merge with
  // DEFAULTS at the bottom. We need the user-only view to enforce the
  // PR-FIN-1c cross-field check correctly: the check should only fire
  // when the USER has explicitly set `pr.open=true` while leaving
  // `baseBranch=null`. A fresh repo where both values come from DEFAULTS
  // is not a misconfiguration — there is nothing for the user to fix
  // until they actually set git config. The post-merge state still gets
  // every DEFAULT field hydrated for downstream consumers.
  let userOverlay: Settings | null = null;

  const workspace = loadSettingsAtLevel(repoRoot, 'workspace');
  if (workspace !== null) {
    userOverlay = userOverlay === null ? workspace : deepMerge<Settings>(userOverlay, workspace);
  }

  const resolvedProjectName = resolveProjectName(repoRoot, projectName);

  const project = loadSettingsAtLevel(repoRoot, 'project', undefined, resolvedProjectName);
  if (project !== null) {
    userOverlay = userOverlay === null ? project : deepMerge<Settings>(userOverlay, project);
  }

  if (sessionId !== undefined && sessionId !== '') {
    const session = loadSettingsAtLevel(repoRoot, 'session', sessionId, resolvedProjectName);
    if (session !== null) {
      userOverlay = userOverlay === null ? session : deepMerge<Settings>(userOverlay, session);
    }
  }

  // Compose final shape: defaults at the bottom, user overlay on top.
  const acc: Settings = userOverlay === null ? DEFAULTS : deepMerge<Settings>(DEFAULTS, userOverlay);

  // Cross-field invariant — fires only when the USER has explicitly set
  // `pr.open=true` somewhere in the cascade AND the resolved
  // `baseBranch` is null. The "user explicitly set" half avoids tripping
  // on the DEFAULTS-only case (fresh repo, no git config yet) — the
  // user has not chosen pr.open=true, so there is nothing to violate.
  // Once the user opts in to PR opening, they must also set baseBranch.
  const userPrOpen = userOverlay?.git?.pr?.open;
  if (userPrOpen === true && (acc.git?.baseBranch === null || acc.git?.baseBranch === undefined)) {
    throw new ConfigCascadeError(
      'parse',
      'git.pr.open=true requires git.baseBranch to be set (non-null). ' +
        'Either set git.baseBranch (e.g. "main") or set git.pr.open=false.',
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
  step: 'ideation' | 'planning' | 'execution',
  context?: { userAnswer?: boolean; orchestratorDecision?: boolean },
): EvalDecision {
  // Post-Wave-4 rename: state-machine literal and settings field name both
  // align on `'planning'`. The Pass-3 backward-compat bridge that accepted
  // `'plan'` has been removed — callers that still pass the legacy literal
  // now fail at compile time, which is the enforcement gate for the rename.
  const stepSettings = cascade.workflow?.[step];
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
  const defaultMode = DEFAULTS.workflow?.[step]?.evaluate?.mode;
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
