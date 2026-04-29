/**
 * `ensureSettingsCascade` — legacy cleanup + T2-v1 upgrader + default seeding.
 *
 * Runs at `gobbi workflow init` and is safe to call on every invocation
 * (startup / resume / compact hook re-entry). Each step is a silent no-op
 * when its target state is already reached.
 *
 *   1. If `.gobbi/config.db` exists → delete it (Pass-3 SQLite path is gone).
 *   2. If `.claude/gobbi.json` exists → delete it (superseded legacy JSON).
 *   3. If `.gobbi/project-config.json` (T2-v1 legacy) exists AND the
 *      resolved project's `settings.json` does not → read v1, upgrade to
 *      the new PR-FIN-1c shape, validate, atomic-write. The legacy file
 *      stays in place (operator decides when to delete it).
 *   4. If a Pass-3 shape `.gobbi/projects/<name>/settings.json` (one with
 *      legacy `git.workflow.*` / `git.cleanup.*` / `projects.*` fields)
 *      exists → upgrade it in place to the PR-FIN-1c shape. Idempotent
 *      after one upgrade. Same for the workspace `.gobbi/settings.json`.
 *   5. If `.gobbi/settings.json` does not exist → seed workspace with
 *      `{schemaVersion: 1}`. Other defaults apply at resolve time.
 *      PR-FIN-1c removed the `projects` registry; the seed is now
 *      minimum-shape.
 *   6. Ensure `.gobbi/.gitignore` lists `settings.json` and `sessions/`
 *      (append if missing; do not duplicate).
 *
 * Solo-user context: no staged rollout, no backcompat flag, no user-facing
 * migration log beyond the step-level `[ensure-settings-cascade] …` stderr line.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

import { isRecord } from './guards.js';
import {
  ConfigCascadeError,
  type GitSettings,
  type Settings,
  type StepEvaluate,
  type StepSettings,
  type WorkflowSettings,
} from './settings.js';
import { writeSettingsAtLevel } from './settings-io.js';
import { formatAjvErrors, validateSettings } from './settings-validator.js';
import { projectDir, workspaceRoot } from './workspace-paths.js';

// ---------------------------------------------------------------------------
// Project-name resolution at cascade-init time
// ---------------------------------------------------------------------------

/**
 * Resolve the project name that the legacy T2-v1 upgrader (Step 3) and
 * the project-level seed should target. PR-FIN-1c removed the
 * `projects.active` registry; the resolution is now a two-step ladder:
 *
 *   1. Caller-supplied `projectName` argument (highest priority — the
 *      `runInitWithOptions` caller knows the answer once `--project` and
 *      defaults have been consulted, and threads it through so cascade
 *      and init agree by construction).
 *   2. `basename(repoRoot)` — the directory containing the repo. Always
 *      non-empty for any real repo (and for the tmpdir scratch repos
 *      tests use).
 */
function resolveProjectNameForCascade(
  repoRoot: string,
  projectName: string | undefined,
): string {
  if (projectName !== undefined && projectName !== '') return projectName;
  return path.basename(repoRoot);
}

function legacyConfigDbPath(repoRoot: string): string {
  return path.join(workspaceRoot(repoRoot), 'config.db');
}

function legacyClaudeGobbiJsonPath(repoRoot: string): string {
  return path.join(repoRoot, '.claude', 'gobbi.json');
}

function legacyProjectConfigPath(repoRoot: string): string {
  return path.join(workspaceRoot(repoRoot), 'project-config.json');
}

/**
 * Path to the project-level settings file for the resolved project. Used
 * for both the Step-3 idempotency probe (`!existsSync(newProject)`) and
 * the post-upgrade log message — both must reflect the resolved name,
 * not a hardcoded literal.
 */
function projectSettingsFile(repoRoot: string, projectName: string): string {
  return path.join(projectDir(repoRoot, projectName), 'settings.json');
}

function workspaceSettingsFile(repoRoot: string): string {
  return path.join(workspaceRoot(repoRoot), 'settings.json');
}

function gitignorePath(repoRoot: string): string {
  return path.join(workspaceRoot(repoRoot), '.gitignore');
}

// ---------------------------------------------------------------------------
// Migration primitives — apply to BOTH T2-v1 legacy AND Pass-3 current shapes
// ---------------------------------------------------------------------------

/**
 * Reshape a legacy `git` section into the PR-FIN-1c {@link Settings.git}
 * shape. Handles both T2-v1 (`git.{mode,baseBranch,pr,cleanup}`) and
 * Pass-3 (`git.{workflow:{mode,baseBranch}, pr, cleanup}`).
 *
 * Migration table (per target-state §4.5):
 *
 *   - `git.mode === 'worktree-pr'` → `git.pr.open: true`
 *   - `git.mode === 'direct-commit'` → `git.pr.open: false`
 *   - `git.mode === 'auto'` → `git.pr.open: true`
 *   - `git.workflow.mode` → same mapping as `git.mode`
 *   - `git.baseBranch` / `git.workflow.baseBranch` → `git.baseBranch`
 *   - `git.pr.draft` → `git.pr.draft` (preserved)
 *   - `git.cleanup.worktree` → `git.worktree.autoRemove`
 *   - `git.cleanup.branch` → `git.branch.autoRemove`
 *
 * `issue.create` defaults to `false` and is not present in any legacy
 * shape — emit only when the new shape needs to set it explicitly.
 *
 * Returns `null` when nothing recognisable is present (callers omit the
 * `git` block entirely on the upgraded payload).
 */
function reshapeGit(legacyGit: unknown): GitSettings | null {
  if (!isRecord(legacyGit)) return null;

  // Locate the legacy mode in either T2-v1 or Pass-3 location.
  const t2Mode = legacyGit['mode'];
  const passWorkflow = isRecord(legacyGit['workflow']) ? legacyGit['workflow'] : null;
  const passMode = passWorkflow !== null ? passWorkflow['mode'] : undefined;
  const legacyMode = passMode ?? t2Mode;

  // Locate baseBranch in either location (Pass-3 wins when both present —
  // newer files migrated incrementally).
  const t2Base = legacyGit['baseBranch'];
  const passBase = passWorkflow !== null ? passWorkflow['baseBranch'] : undefined;
  const baseBranch =
    passBase !== undefined ? passBase : t2Base !== undefined ? t2Base : undefined;

  // Pull existing pr / cleanup sub-objects.
  const legacyPr = isRecord(legacyGit['pr']) ? legacyGit['pr'] : null;
  const legacyCleanup = isRecord(legacyGit['cleanup']) ? legacyGit['cleanup'] : null;

  // Build the new-shape git object. Only include keys whose source value
  // was actually present so AJV's additionalProperties: false never fires
  // and so the cascade can still delegate up for missing values.
  const out: {
    -readonly [K in keyof GitSettings]?: GitSettings[K];
  } = {};

  if (typeof baseBranch === 'string' || baseBranch === null) {
    out.baseBranch = baseBranch;
  }

  // Mode → pr.open mapping. Skip when the legacy mode was absent or
  // unrecognised — let the cascade fall back to the DEFAULTS value.
  let prOpen: boolean | undefined;
  if (legacyMode === 'worktree-pr' || legacyMode === 'auto') {
    prOpen = true;
  } else if (legacyMode === 'direct-commit') {
    prOpen = false;
  }

  const legacyDraft = legacyPr !== null ? legacyPr['draft'] : undefined;
  if (prOpen !== undefined || typeof legacyDraft === 'boolean') {
    const pr: { open?: boolean; draft?: boolean } = {};
    if (prOpen !== undefined) pr.open = prOpen;
    if (typeof legacyDraft === 'boolean') pr.draft = legacyDraft;
    out.pr = pr;
  }

  if (legacyCleanup !== null) {
    const wt = legacyCleanup['worktree'];
    if (typeof wt === 'boolean') {
      out.worktree = { autoRemove: wt };
    }
    const br = legacyCleanup['branch'];
    if (typeof br === 'boolean') {
      out.branch = { autoRemove: br };
    }
  }

  // Note: `issue` is not derivable from any legacy field — leave absent so
  // the cascade falls through to DEFAULTS (`{create: false}`).

  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Returns `true` when the parsed settings record carries any field the
 * PR-FIN-1c reshape removed — i.e. it is a Pass-3-or-earlier on-disk
 * shape that needs an in-place upgrade.
 *
 * The check is conservative: a missing key alone never triggers an
 * upgrade (the new shape's optional fields are legitimately absent on
 * minimal seeds). Only the *presence* of legacy-only keys flags the
 * file as needing migration.
 */
function needsCurrentShapeUpgrade(parsed: unknown): boolean {
  if (!isRecord(parsed)) return false;

  // `Settings.projects` (registry) was removed entirely.
  if ('projects' in parsed) return true;

  const git = parsed['git'];
  if (isRecord(git)) {
    // Pass-3 had `git.workflow.{mode,baseBranch}`.
    if ('workflow' in git) return true;
    // T2-v1 carried mode/baseBranch directly under `git`.
    if ('mode' in git) return true;
    // Both eras used `git.cleanup`.
    if ('cleanup' in git) return true;
  }

  return false;
}

/**
 * Apply the PR-FIN-1c reshape to an in-memory parsed settings record.
 * Used by both the T2-v1 legacy upgrader and the Pass-3-current
 * in-place migration path. Returns the upgraded {@link Settings} payload
 * — caller validates and writes.
 *
 * Behaviour:
 *
 *   - Drops `Settings.projects` entirely (the registry was removed).
 *   - Reshapes `git.*` via {@link reshapeGit}.
 *   - Preserves `workflow.*`, `notify.*`, and any other PR-FIN-1c-shape
 *     fields verbatim.
 *   - Always stamps `schemaVersion: 1` (the unified shape version).
 */
function reshapeCurrentShape(parsed: unknown): Settings {
  const root = isRecord(parsed) ? parsed : {};
  const reshapedGit = reshapeGit(root['git']);
  return {
    schemaVersion: 1,
    ...(isRecord(root['workflow']) ? { workflow: root['workflow'] as NonNullable<Settings['workflow']> } : {}),
    ...(isRecord(root['notify']) ? { notify: root['notify'] as NonNullable<Settings['notify']> } : {}),
    ...(reshapedGit !== null ? { git: reshapedGit } : {}),
  };
}

// ---------------------------------------------------------------------------
// PR-FIN-1e — agent-shape migration primitives
// ---------------------------------------------------------------------------

/** The set of step keys whose `discuss` / `evaluate` slots may carry the
 * legacy flat `{model, effort}` form. Mirrors {@link WorkflowSettings}'s
 * three productive-step slots — eval-mode steps (`*_eval`) reuse the
 * productive step's `evaluate` substate, so there is no `*_eval` entry
 * here. */
const AGENT_SHAPE_STEP_KEYS = ['ideation', 'planning', 'execution'] as const;
const AGENT_SHAPE_MODE_KEYS = ['discuss', 'evaluate'] as const;

/**
 * Returns `true` when the parsed settings record carries any
 * `workflow.<step>.{discuss,evaluate}.{model,effort}` field at the legacy
 * flat shape — i.e. PR-FIN-1e moved those keys under a nested
 * `agent` sub-object and the on-disk file still uses the pre-migration
 * shape.
 *
 * Conservative: a missing key alone never triggers an upgrade (the new
 * shape's optional fields are legitimately absent on minimal seeds and
 * already-migrated files). Only the *presence* of a legacy `model`/`effort`
 * directly under `discuss` or `evaluate` flags the file as needing
 * migration. The net-new `workflow.<step>.agent` slot has no legacy
 * precursor and never triggers this predicate by itself.
 */
export function needsAgentShapeUpgrade(parsed: unknown): boolean {
  if (!isRecord(parsed)) return false;
  const workflow = parsed['workflow'];
  if (!isRecord(workflow)) return false;

  for (const stepKey of AGENT_SHAPE_STEP_KEYS) {
    const step = workflow[stepKey];
    if (!isRecord(step)) continue;
    for (const modeKey of AGENT_SHAPE_MODE_KEYS) {
      const slot = step[modeKey];
      if (!isRecord(slot)) continue;
      if ('model' in slot || 'effort' in slot) return true;
    }
  }
  return false;
}

/**
 * Reshape a single step's mode slots (`discuss`, `evaluate`) so that any
 * legacy flat `{model, effort}` keys move under the nested `agent`
 * sub-object that PR-FIN-1e introduced.
 *
 * Conflict rule (when both legacy and nested form exist on the same slot):
 * nested wins, legacy is dropped, `mutated` becomes `true` because the
 * post-state differs from the pre-state — a legacy key the user wrote was
 * removed. Mirrors PR-FIN-1c's mode/baseBranch precedence at
 * {@link reshapeGit} (Pass-3 wins when both present).
 *
 * The step-wide `agent` slot is net-new (no legacy precursor); it is
 * carried verbatim if present. `maxIterations` and `mode` are likewise
 * carried verbatim. `mutated` reflects only changes the agent-shape
 * migration introduced — moves of legacy `{model, effort}` keys, and
 * legacy-vs-nested conflict resolution.
 */
export function reshapeStepAgentShape(
  stepCfg: unknown,
): { readonly out: StepSettings; readonly mutated: boolean } {
  if (!isRecord(stepCfg)) {
    // Non-record input — return an empty StepSettings; nothing to migrate.
    return { out: {}, mutated: false };
  }

  let mutated = false;
  const out: { -readonly [K in keyof StepSettings]?: StepSettings[K] } = {};

  for (const modeKey of AGENT_SHAPE_MODE_KEYS) {
    const slot = stepCfg[modeKey];
    if (slot === undefined) continue;
    if (!isRecord(slot)) {
      // Non-record value at a known mode key (e.g. `null`) — preserve as-is
      // so AJV surfaces it later; do not flag mutation.
      (out as Record<string, unknown>)[modeKey] = slot;
      continue;
    }

    const legacyModel = 'model' in slot ? slot['model'] : undefined;
    const legacyEffort = 'effort' in slot ? slot['effort'] : undefined;
    const hasLegacy = 'model' in slot || 'effort' in slot;

    const nestedAgentRaw = slot['agent'];
    const nestedAgent = isRecord(nestedAgentRaw) ? nestedAgentRaw : null;

    // Build the migrated agent sub-object. Nested wins on conflict — start
    // with legacy values, overlay nested values on top.
    const mergedAgent: { -readonly [K in 'model' | 'effort']?: unknown } = {};
    if (legacyModel !== undefined) mergedAgent.model = legacyModel;
    if (legacyEffort !== undefined) mergedAgent.effort = legacyEffort;
    if (nestedAgent !== null) {
      if ('model' in nestedAgent) mergedAgent.model = nestedAgent['model'];
      if ('effort' in nestedAgent) mergedAgent.effort = nestedAgent['effort'];
    }

    // Build the rebuilt slot, carrying every key that was NOT a legacy
    // {model, effort} or the `agent` sub-object — those we owned. Other
    // keys (notably `mode`) survive verbatim.
    const rebuiltSlot: Record<string, unknown> = {};
    for (const k of Object.keys(slot)) {
      if (k === 'model' || k === 'effort' || k === 'agent') continue;
      rebuiltSlot[k] = slot[k];
    }
    if (Object.keys(mergedAgent).length > 0) {
      rebuiltSlot['agent'] = mergedAgent;
    } else if (nestedAgent !== null) {
      // Nested agent was present but empty — preserve verbatim.
      rebuiltSlot['agent'] = nestedAgent;
    }

    // Mutation detection: any legacy key present means we removed it from
    // the slot's top level. That alone counts as a mutation regardless of
    // whether the nested form already had the same value.
    if (hasLegacy) mutated = true;

    (out as Record<string, unknown>)[modeKey] = rebuiltSlot;
  }

  // Carry net-new step-wide `agent` slot verbatim (no legacy precursor).
  if ('agent' in stepCfg) {
    (out as Record<string, unknown>)['agent'] = stepCfg['agent'];
  }
  // Carry maxIterations verbatim.
  if ('maxIterations' in stepCfg) {
    (out as Record<string, unknown>)['maxIterations'] = stepCfg['maxIterations'];
  }

  return { out, mutated };
}

/**
 * Apply {@link reshapeStepAgentShape} across every productive-step entry
 * under `settings.workflow`. Returns the rewritten workflow tree plus a
 * `mutated` flag aggregated across all steps. Steps absent from the input
 * stay absent. Non-record `workflow` payloads are returned as-is with
 * `mutated: false` so AJV surfaces the malformed shape later.
 */
function reshapeWorkflowAgentShape(
  workflow: unknown,
): { readonly out: WorkflowSettings | undefined; readonly mutated: boolean } {
  if (workflow === undefined) return { out: undefined, mutated: false };
  if (!isRecord(workflow)) {
    return { out: workflow as WorkflowSettings, mutated: false };
  }

  let mutated = false;
  const out: { -readonly [K in keyof WorkflowSettings]?: StepSettings } = {};

  for (const stepKey of AGENT_SHAPE_STEP_KEYS) {
    if (!(stepKey in workflow)) continue;
    const stepCfg = workflow[stepKey];
    const { out: reshapedStep, mutated: stepMutated } =
      reshapeStepAgentShape(stepCfg);
    if (stepMutated) mutated = true;
    out[stepKey] = reshapedStep;
  }

  // Preserve any unknown step keys verbatim — AJV will reject them later
  // with the proper validator-side error message rather than silent loss.
  for (const k of Object.keys(workflow)) {
    if ((AGENT_SHAPE_STEP_KEYS as readonly string[]).includes(k)) continue;
    (out as Record<string, unknown>)[k] = workflow[k];
  }

  return { out: out as WorkflowSettings, mutated };
}

// ---------------------------------------------------------------------------
// Step 3 — T2-v1 → new-shape upgrader
// ---------------------------------------------------------------------------

/**
 * Upgrade a parsed T2-v1 legacy `.gobbi/project-config.json` document to
 * the new unified {@link Settings} shape (PR-FIN-1c). Returns the
 * upgraded payload; the caller validates and writes it.
 *
 * Transformations:
 *
 *   - `version: 1|2` → dropped; `schemaVersion: 1` set at the top level.
 *   - Legacy `eval.{step}: boolean` → `workflow.{step}.evaluate.mode`:
 *       `true` → `'always'`; `false` → `'ask'`.
 *   - `git.*` reshape via {@link reshapeGit}.
 *   - `cost.*`, `ui.*`, `trivialRange`, `verification.*` — dropped silently.
 *   - `projects.*` (Pass-3 only) — dropped silently (registry removed).
 */
function upgradeLegacyToSettings(legacy: unknown): Settings {
  const root = isRecord(legacy) ? legacy : {};

  // Workflow — convert eval booleans to evaluate.mode enums.
  //
  // `stepMap` retains BOTH the legacy `'plan'` key and the post-W4
  // target `'planning'` because this upgrader translates T2-v1-era
  // `.gobbi/project-config.json` files that were written BEFORE the
  // state-machine rename Pass. The mapping is required code (not a
  // stale literal): it reads the legacy `eval.plan` boolean and writes
  // it to the post-rename `workflow.planning` setting.
  const legacyEval = isRecord(root['eval']) ? root['eval'] : null;
  const workflow: Settings['workflow'] = legacyEval
    ? (() => {
        const out: { ideation?: StepSettings; planning?: StepSettings; execution?: StepSettings } = {};
        const stepMap: ReadonlyArray<readonly [legacy: 'ideation' | 'plan' | 'execution', target: 'ideation' | 'planning' | 'execution']> = [
          ['ideation', 'ideation'],
          ['plan', 'planning'],
          ['execution', 'execution'],
        ];
        for (const [legacyKey, targetKey] of stepMap) {
          const value = legacyEval[legacyKey];
          if (typeof value !== 'boolean') continue;
          const evaluate: StepEvaluate = {
            mode: value ? 'always' : 'ask',
          };
          out[targetKey] = { evaluate };
        }
        return Object.keys(out).length > 0 ? out : undefined;
      })()
    : undefined;

  // Git — reshape via the shared primitive.
  const git = reshapeGit(root['git']);

  // Build the upgraded Settings. Only include keys we explicitly populated
  // so AJV's additionalProperties: false never fires on phantom branches.
  // PR-FIN-1c: no `projects` block. Workspace seed is now minimum-shape.
  const upgraded: Settings = {
    schemaVersion: 1,
    ...(workflow !== undefined ? { workflow } : {}),
    ...(git !== null ? { git } : {}),
  };

  return upgraded;
}

// ---------------------------------------------------------------------------
// Step 5 — .gitignore housekeeping
// ---------------------------------------------------------------------------

const GITIGNORE_REQUIRED_LINES = ['settings.json', 'sessions/'] as const;

function ensureGitignoreLines(repoRoot: string): void {
  const filePath = gitignorePath(repoRoot);
  let existing = '';
  if (existsSync(filePath)) {
    try {
      existing = readFileSync(filePath, 'utf8');
    } catch {
      existing = '';
    }
  }

  const currentLines = new Set(
    existing
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0),
  );

  const missing = GITIGNORE_REQUIRED_LINES.filter((line) => !currentLines.has(line));
  if (missing.length === 0) return;

  mkdirSync(path.dirname(filePath), { recursive: true });
  const separator = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
  const addition = `${missing.join('\n')}\n`;
  writeFileSync(filePath, `${existing}${separator}${addition}`, 'utf8');
}

// ---------------------------------------------------------------------------
// In-place upgrade for an existing settings.json carrying the Pass-3 shape
// ---------------------------------------------------------------------------

/**
 * Read a settings file at `filePath`, decide whether it needs any of the
 * shape reshapes (PR-FIN-1c GitSettings + ProjectsRegistry removal,
 * PR-FIN-1e agent-shape migration), and rewrite it atomically when so.
 *
 * Composition (PR-FIN-1e): both reshapes run in the same pipeline so the
 * file is read once, validated once, and written once. The two reshapes
 * are tracked independently — each can fire its own breadcrumb depending
 * on whether it actually moved anything:
 *
 *   - PR-FIN-1c GitSettings reshape — gated on
 *     {@link needsCurrentShapeUpgrade}; breadcrumb fires whenever that
 *     gate triggered (legacy-shape detection IS the mutation signal —
 *     the reshape is unconditional inside the gate).
 *   - PR-FIN-1e agent-shape reshape — gated on
 *     {@link needsAgentShapeUpgrade}; breadcrumb fires only when the
 *     reshape's `mutated` flag is `true` (idempotent on re-run).
 *
 * Best-effort: if the file is malformed JSON we skip silently (the
 * regular cascade load surfaces the error with proper provenance); if it
 * already conforms to both shapes we do nothing. Returns `true` when the
 * file was rewritten.
 */
function upgradeFileInPlace(
  repoRoot: string,
  level: 'workspace' | 'project',
  filePath: string,
  projectName: string,
): boolean {
  if (!existsSync(filePath)) return false;

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch {
    return false;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Malformed JSON — let the regular cascade reader surface the error.
    return false;
  }

  const gitShapeNeeded = needsCurrentShapeUpgrade(parsed);
  const agentShapeNeeded = needsAgentShapeUpgrade(parsed);
  if (!gitShapeNeeded && !agentShapeNeeded) return false;

  // Step 1 — PR-FIN-1c: reshape git/projects when their gate triggered.
  // When the gate is clean the original payload flows through unchanged
  // so the agent-shape reshape can apply on top.
  const afterGitReshape: Settings = gitShapeNeeded
    ? reshapeCurrentShape(parsed)
    : (() => {
        const root = isRecord(parsed) ? parsed : {};
        return {
          schemaVersion: 1,
          ...(isRecord(root['workflow']) ? { workflow: root['workflow'] as NonNullable<Settings['workflow']> } : {}),
          ...(isRecord(root['notify']) ? { notify: root['notify'] as NonNullable<Settings['notify']> } : {}),
          ...(isRecord(root['git']) ? { git: root['git'] as NonNullable<Settings['git']> } : {}),
        };
      })();

  // Step 2 — PR-FIN-1e: agent-shape migration on the workflow tree.
  const { out: reshapedWorkflow, mutated: agentShapeMutated } =
    reshapeWorkflowAgentShape(afterGitReshape.workflow);

  const reshaped: Settings = {
    ...afterGitReshape,
    ...(reshapedWorkflow !== undefined ? { workflow: reshapedWorkflow } : {}),
  };

  if (!validateSettings(reshaped)) {
    const messages = formatAjvErrors(validateSettings.errors);
    throw new ConfigCascadeError(
      'parse',
      `Reshaped ${path.relative(repoRoot, filePath)} failed validation:\n${messages}`,
      { tier: level, path: filePath },
    );
  }

  // If neither reshape actually moved anything, skip the write. This
  // happens when `gitShapeNeeded` was false and the agent-shape pass
  // produced a no-op (e.g., the file was already migrated and we entered
  // this branch via a stale predicate — defensive guard, not expected
  // under correct gate logic).
  if (!gitShapeNeeded && !agentShapeMutated) return false;

  if (level === 'workspace') {
    writeSettingsAtLevel(repoRoot, 'workspace', reshaped);
  } else {
    writeSettingsAtLevel(repoRoot, 'project', reshaped, undefined, projectName);
  }

  if (gitShapeNeeded) {
    process.stderr.write(
      `[ensure-settings-cascade] reshaped ${path.relative(repoRoot, filePath)} → PR-FIN-1c shape\n`,
    );
  }
  if (agentShapeMutated) {
    process.stderr.write(
      `[ensure-settings-cascade] migrated ${path.relative(repoRoot, filePath)} agent fields → PR-FIN-1e shape\n`,
    );
  }
  return true;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Idempotent migration + seed orchestrator. Safe to call on every
 * `gobbi workflow init`. See module-level JSDoc for the steps.
 *
 * The optional {@link projectName} argument is the resolved project the
 * upgrade target should land under; when absent, the cascade resolves
 * it via `basename(repoRoot)` (PR-FIN-1c removed the `projects.active`
 * registry, simplifying the ladder).
 */
export async function ensureSettingsCascade(
  repoRoot: string,
  projectName?: string,
): Promise<void> {
  // The `.gobbi/` directory is a precondition for later writes; fresh
  // tmpdirs (and fresh real repos) may not have it yet.
  mkdirSync(workspaceRoot(repoRoot), { recursive: true });

  const resolvedProjectName = resolveProjectNameForCascade(repoRoot, projectName);

  // Step 1 — delete legacy SQLite config.
  const dbPath = legacyConfigDbPath(repoRoot);
  if (existsSync(dbPath)) {
    rmSync(dbPath, { force: true });
    process.stderr.write('[ensure-settings-cascade] deleted legacy config.db\n');
  }

  // Step 2 — delete legacy `.claude/gobbi.json`.
  const claudeGobbiJson = legacyClaudeGobbiJsonPath(repoRoot);
  if (existsSync(claudeGobbiJson)) {
    rmSync(claudeGobbiJson, { force: true });
    process.stderr.write('[ensure-settings-cascade] deleted legacy .claude/gobbi.json\n');
  }

  // Step 3 — upgrade legacy T2-v1 `.gobbi/project-config.json` if present.
  const legacyProject = legacyProjectConfigPath(repoRoot);
  const newProject = projectSettingsFile(repoRoot, resolvedProjectName);
  if (existsSync(legacyProject) && !existsSync(newProject)) {
    let raw: string;
    try {
      raw = readFileSync(legacyProject, 'utf8');
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new ConfigCascadeError(
        'read',
        `Failed to read legacy ${path.relative(repoRoot, legacyProject)}: ${message}`,
        { tier: 'project', path: legacyProject, cause: err },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new ConfigCascadeError(
        'parse',
        `Invalid JSON in legacy ${path.relative(repoRoot, legacyProject)}: ${message}`,
        { tier: 'project', path: legacyProject, cause: err },
      );
    }

    const upgraded = upgradeLegacyToSettings(parsed);
    if (!validateSettings(upgraded)) {
      const messages = formatAjvErrors(validateSettings.errors);
      throw new ConfigCascadeError(
        'parse',
        `Upgraded legacy ${path.relative(repoRoot, legacyProject)} failed validation:\n${messages}`,
        { tier: 'project', path: legacyProject },
      );
    }

    writeSettingsAtLevel(repoRoot, 'project', upgraded, undefined, resolvedProjectName);
    process.stderr.write(
      `[ensure-settings-cascade] upgraded ${path.relative(repoRoot, legacyProject)} → ${path.relative(repoRoot, newProject)}\n`,
    );
  }

  // Step 4 — upgrade existing Pass-3-shape settings files in place.
  // Idempotent: `needsCurrentShapeUpgrade` returns false for files that
  // already conform to the PR-FIN-1c shape. Workspace and project levels
  // both run through the same primitive.
  upgradeFileInPlace(repoRoot, 'workspace', workspaceSettingsFile(repoRoot), resolvedProjectName);
  upgradeFileInPlace(repoRoot, 'project', newProject, resolvedProjectName);

  // Step 5 — seed workspace settings.json if absent. PR-FIN-1c: minimum
  // shape (`{schemaVersion: 1}`); the projects registry was removed.
  const workspacePath = workspaceSettingsFile(repoRoot);
  if (!existsSync(workspacePath)) {
    const seed: Settings = { schemaVersion: 1 };
    writeSettingsAtLevel(repoRoot, 'workspace', seed);
    process.stderr.write('[ensure-settings-cascade] seeded .gobbi/settings.json\n');
  }

  // Step 6 — ensure `.gobbi/.gitignore` lists workspace + sessions paths.
  ensureGitignoreLines(repoRoot);
}
