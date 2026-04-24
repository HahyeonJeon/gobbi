/**
 * `ensureSettingsCascade` — legacy cleanup + T2-v1 upgrader + default seeding.
 *
 * Runs at `gobbi workflow init` and is safe to call on every invocation
 * (startup / resume / compact hook re-entry). Each step is a silent no-op
 * when its target state is already reached.
 *
 *   1. If `.gobbi/config.db` exists → delete it (Pass-3 SQLite path is gone).
 *   2. If `.claude/gobbi.json` exists → delete it (superseded legacy JSON).
 *   3. If `.gobbi/project-config.json` (T2-v1 legacy) exists AND
 *      `.gobbi/project/settings.json` does not → read v1, upgrade to the new
 *      shape, validate, atomic-write at the v2 path. The legacy file stays
 *      in place (orchestrator / user decides when to delete it).
 *   4. If `.gobbi/settings.json` does not exist → seed workspace with
 *      `{schemaVersion: 1, projects: {active: null, known: []}}`. The
 *      `projects` block is required by the unified schema (additive from
 *      gobbi-memory Pass 2); other defaults apply at resolve time. Keeping
 *      the user file otherwise sparse respects the solo-user trust model.
 *   5. Ensure `.gobbi/.gitignore` lists `settings.json` and `sessions/`
 *      (append if missing; do not duplicate).
 *
 * Solo-user context per `feedback_solo_user_context.md`: no staged rollout,
 * no backcompat flag, no user-facing migration log beyond the step-level
 * `[ensure-settings-cascade] …` stderr line.
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
  type Settings,
  type StepEvaluate,
  type StepSettings,
} from './settings.js';
import { writeSettingsAtLevel } from './settings-io.js';
import { formatAjvErrors, validateSettings } from './settings-validator.js';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

function legacyConfigDbPath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'config.db');
}

function legacyClaudeGobbiJsonPath(repoRoot: string): string {
  return path.join(repoRoot, '.claude', 'gobbi.json');
}

function legacyProjectConfigPath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'project-config.json');
}

function newProjectSettingsPath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'project', 'settings.json');
}

function workspaceSettingsFile(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', 'settings.json');
}

function gitignorePath(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi', '.gitignore');
}

// ---------------------------------------------------------------------------
// Step 3 — T2-v1 → new-shape upgrader
// ---------------------------------------------------------------------------

/**
 * Upgrade a parsed T2-v1 legacy `.gobbi/project-config.json` document to
 * the new unified {@link Settings} shape. Returns the upgraded payload;
 * the caller validates and writes it.
 *
 * Transformations:
 *
 *   - `version: 1|2` → dropped; `schemaVersion: 1` set at the top level.
 *   - `git.mode` → `git.workflow.mode` (rename + restructure).
 *   - `git.baseBranch` → `git.workflow.baseBranch`.
 *   - `eval.{step}: boolean` → `workflow.{step}.evaluate.mode`:
 *       `true` → `'always'`; `false` → `'ask'`.
 *   - `cost.*`, `ui.*`, `trivialRange`, `verification.*` — dropped silently.
 *
 * Anything unrecognised in the v1 file is ignored. Downstream AJV validation
 * catches any shape errors introduced by the upgrade before the write lands.
 */
function upgradeLegacyToSettings(legacy: unknown): Settings {
  const root = isRecord(legacy) ? legacy : {};

  // Workflow — convert eval booleans to evaluate.mode enums.
  // Legacy `eval.plan` maps to new `workflow.planning` (the loop name);
  // state-machine literal stays `'plan'` until a comprehensive rename Pass.
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

  // Git — restructure mode + baseBranch under git.workflow.
  const legacyGit = isRecord(root['git']) ? root['git'] : null;
  let git: Settings['git'] | undefined;
  if (legacyGit !== null) {
    const gitWorkflow: { mode?: 'direct-commit' | 'worktree-pr'; baseBranch?: string | null } = {};
    const legacyMode = legacyGit['mode'];
    if (legacyMode === 'direct-commit' || legacyMode === 'worktree-pr') {
      gitWorkflow.mode = legacyMode;
    }
    const legacyBase = legacyGit['baseBranch'];
    if (legacyBase === null || typeof legacyBase === 'string') {
      gitWorkflow.baseBranch = legacyBase;
    }
    if (Object.keys(gitWorkflow).length > 0) {
      git = { workflow: gitWorkflow };
    }
  }

  // Build the upgraded Settings. Only include keys we explicitly populated
  // so AJV's additionalProperties: false never fires on phantom branches.
  // `projects` is required at the unified Settings level; fresh-install
  // defaults apply (the upgrader does not know about multi-project —
  // bootstrap happens later via `gobbi workflow init`).
  const upgraded: Settings = {
    schemaVersion: 1,
    projects: { active: null, known: [] },
    ...(workflow !== undefined ? { workflow } : {}),
    ...(git !== undefined ? { git } : {}),
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
// Entry point
// ---------------------------------------------------------------------------

/**
 * Idempotent migration + seed orchestrator. Safe to call on every
 * `gobbi workflow init`. See module-level JSDoc for the five steps.
 */
export async function ensureSettingsCascade(repoRoot: string): Promise<void> {
  // The `.gobbi/` directory is a precondition for later writes; fresh
  // tmpdirs (and fresh real repos) may not have it yet.
  mkdirSync(path.join(repoRoot, '.gobbi'), { recursive: true });

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

  // Step 3 — upgrade legacy `.gobbi/project-config.json` (T2-v1) to the
  // new shape at `.gobbi/project/settings.json` if the new path is absent.
  const legacyProject = legacyProjectConfigPath(repoRoot);
  const newProject = newProjectSettingsPath(repoRoot);
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

    writeSettingsAtLevel(repoRoot, 'project', upgraded);
    process.stderr.write(
      `[ensure-settings-cascade] upgraded ${path.relative(repoRoot, legacyProject)} → ${path.relative(repoRoot, newProject)}\n`,
    );
  }

  // Step 4 — seed workspace settings.json if absent. Keep sparse — full
  // DEFAULTS apply at resolve time. `projects` is required by the unified
  // schema; seed with the fresh-install shape. A later wave's
  // `gobbi workflow init` bootstrap flow replaces these fresh-install
  // values with the real project name.
  const workspacePath = workspaceSettingsFile(repoRoot);
  if (!existsSync(workspacePath)) {
    const seed: Settings = {
      schemaVersion: 1,
      projects: { active: null, known: [] },
    };
    writeSettingsAtLevel(repoRoot, 'workspace', seed);
    process.stderr.write('[ensure-settings-cascade] seeded .gobbi/settings.json\n');
  }

  // Step 5 — ensure `.gobbi/.gitignore` lists workspace + sessions paths.
  ensureGitignoreLines(repoRoot);
}
