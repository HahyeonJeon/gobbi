/**
 * gobbi workflow init — initialise a workflow session directory.
 *
 * Creates `.gobbi/projects/<name>/sessions/<sessionId>/` under the detected
 * repo root, writes a `session.json` stub via {@link writeSessionStub},
 * opens the SQLite event store (`gobbi.db`), and appends the opening pair
 * of events — `workflow.start` followed by `workflow.eval.decide` —
 * atomically inside a single `store.transaction`.
 *
 * PR-FIN-2a-ii (T-2a.8.5): the legacy `metadata.json` writer is retired in
 * favour of `session.json` — a stub at init carrying only the 6 required-at-
 * all-stages fields (`schemaVersion`, `sessionId`, `projectId`, `createdAt`,
 * `gobbiVersion`, `task`). The full session.json is materialised at the
 * memorization step's STEP_EXIT (T-2a.8.2). T-2a.9.tests pruned
 * `cross-pass-invariant.test.ts` to read `session.json` directly and
 * removed the legacy `SessionMetadata` / `SessionConfigSnapshot` /
 * `readMetadata` / `isValidMetadata` re-exports that were temporarily
 * preserved here as dead-code back-compat surface.
 *
 * ## Idempotency
 *
 * The SessionStart hook fires on `startup | resume | compact | clear`, so
 * `init` is invoked multiple times per logical session. A fresh invocation
 * against an existing directory is a no-op: the existing `session.json`
 * stub is re-validated, no events are emitted, and the command exits 0
 * silently. A corrupt `session.json` propagates the AJV/JSON parse failure
 * from `readSessionJson` so the operator can see the drift rather than have
 * it transparently rewritten.
 *
 * ## Session id resolution
 *
 *   1. Explicit `--session-id <id>` flag (CLI direct mode).
 *   2. `CLAUDE_SESSION_ID` env var (hook context — set by Claude Code via
 *      the SessionStart hook + `$CLAUDE_ENV_FILE` mechanism in PR-FIN-1b).
 *   3. Hard error — exit 2 with remediation. No `randomUUID()` fallback;
 *      a fabricated id orphans `.gobbi/projects/<name>/sessions/<random>/`
 *      directories that nothing references.
 *
 * ## Project name resolution (PR-FIN-1c)
 *
 *   1. `--project <name>` CLI flag (per-invocation override).
 *   2. `basename(repoRoot)` — the directory containing the repo.
 *
 * On existing-session re-init, `session.json.projectId` is authoritative.
 * If `--project <name>` is provided AND does not match the stamped
 * `projectId`, init exits 2 with a clear stderr message — sessions are
 * bound to ONE project at birth and cannot be re-parented mid-flight.
 *
 * ## Schema
 *
 * `session.json` shape is at `schemaVersion: 1` — see `lib/json-memory.ts`
 * for the AJV schema and the full set of fields populated at the memorization
 * step. The session.json schemaVersion is decoupled from the state-machine
 * `WorkflowState.schemaVersion`.
 */

import { parseArgs } from 'node:util';
import { existsSync, mkdirSync } from 'node:fs';
import { basename, join } from 'node:path';

import { getRepoRoot } from '../../lib/repo.js';
import { ensureSettingsCascade } from '../../lib/ensure-settings-cascade.js';
import {
  resolveSettings,
  resolveEvalDecision,
} from '../../lib/settings-io.js';
import { sessionDir as sessionDirForProject } from '../../lib/workspace-paths.js';
import {
  readSessionJson,
  sessionJsonPath,
  writeSessionStub,
} from '../../lib/json-memory.js';
import { assertValidProjectNameOrExit } from '../../lib/project-name.js';
import { readInstalledVersion } from '../../lib/version-check.js';
import { ConfigCascadeError } from '../../lib/settings.js';
import { EventStore } from '../../workflow/store.js';
import { appendEventAndUpdateState, resolveWorkflowState } from '../../workflow/engine.js';
import { initialState } from '../../workflow/state-derivation.js';
import {
  createWorkflowStart,
  createEvalDecide,
} from '../../workflow/events/workflow.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow init [options]

Initialise the workflow session directory and emit the opening events.

Options:
  --session-id <id>     Session id (takes priority over CLAUDE_SESSION_ID env;
                        exits 2 with remediation when neither is set)
  --project <name>      Bind this session to project <name> (per-invocation override)
  --task <text>         Free-text description of the task
  --eval-ideation       Enable evaluation after ideation (default: off)
  --eval-planning       Enable evaluation after planning (default: off)
  --context <text>      Free-text session context / constraints
  --help, -h            Show this help message

Idempotent: re-running against an existing session directory is a silent no-op.
Re-init with --project must match session.projectId; mismatch exits 2.`;

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  'session-id': { type: 'string' },
  project: { type: 'string' },
  task: { type: 'string' },
  'eval-ideation': { type: 'boolean', default: false },
  'eval-planning': { type: 'boolean', default: false },
  context: { type: 'string' },
} as const;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Overrides consumed by {@link runInitWithOptions}. Exposed for tests only —
 * the CLI entry point {@link runInit} never passes overrides.
 */
export interface InitOverrides {
  /** Override the detected repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
}

export async function runInit(args: string[]): Promise<void> {
  await runInitWithOptions(args);
}

/**
 * Testable entry point — same behaviour as {@link runInit} but accepts an
 * optional `repoRoot` override so tests can point init at a tmpdir without
 * mutating `process.cwd()` or git's global state.
 */
export async function runInitWithOptions(
  args: string[],
  overrides: InitOverrides = {},
): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  try {
    const parsed = parseArgs({
      args,
      options: PARSE_OPTIONS,
      allowPositionals: false,
    });
    values = parsed.values;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi workflow init: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  const sessionId = resolveSessionId(
    typeof values['session-id'] === 'string' ? values['session-id'] : undefined,
  );
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const projectFlag =
    typeof values.project === 'string' && values.project !== ''
      ? values.project
      : undefined;

  // PR-CFM-D / #187 — guard before line 179 cascadeProjectName / line 185
  // ensureSettingsCascade. Validates the SAME expression line 179 then
  // assigns; covers both --project flag and basename(repoRoot) fallback (L7).
  const _resolvedForGuard = projectFlag ?? basename(repoRoot);
  assertValidProjectNameOrExit(_resolvedForGuard, 'gobbi workflow init');

  // PR-FIN-1c: project name = `--project` flag → `basename(repoRoot)`.
  // No more `projects.active` registry; the directory tree is the source
  // of truth for which projects exist.
  const cascadeProjectName = projectFlag ?? basename(repoRoot);

  // Ensure the unified settings cascade is ready — deletes legacy config
  // sources, upgrades legacy T2-v1 project-config.json + Pass-3 shape
  // files in place to PR-FIN-1c shape, seeds workspace defaults, and
  // updates .gobbi/.gitignore. Idempotent; safe to call every init.
  await ensureSettingsCascade(repoRoot, cascadeProjectName);

  // Idempotent fast-path — find any pre-existing session for this
  // sessionId across plausible project names so re-init with a
  // mismatching flag hits the mismatch gate rather than fresh-init-ing
  // a second session under the wrong project. Session is bound to ONE
  // project at birth per session.projectId (PR-FIN-2a-ii).
  const candidateProjectNames: readonly string[] = dedup([
    ...(projectFlag !== undefined ? [projectFlag] : []),
    basename(repoRoot),
  ]);
  for (const candidate of candidateProjectNames) {
    const probePath = sessionJsonPath(repoRoot, candidate, sessionId);
    if (!existsSync(probePath)) continue;
    let existing;
    try {
      existing = readSessionJson(probePath);
    } catch (err) {
      // ConfigCascadeError carries the file path + AJV/parse details; fall
      // through to the malformed-message exit so operators see remediation
      // pointer, mirroring the original metadata.json malformed branch.
      const detail =
        err instanceof ConfigCascadeError
          ? err.message
          : err instanceof Error
            ? err.message
            : String(err);
      process.stderr.write(
        `gobbi workflow init: existing ${probePath} is malformed — remove or repair manually\n${detail}\n`,
      );
      process.exit(1);
    }
    if (existing === null) {
      // existsSync said yes, readSessionJson returned null — race or empty
      // file. Treat as malformed.
      process.stderr.write(
        `gobbi workflow init: existing ${probePath} is malformed — remove or repair manually\n`,
      );
      process.exit(1);
    }
    // Mismatch gate — a session's projectId is frozen at birth. An explicit
    // --project override on re-init must match the stamped value or we exit 2
    // so the operator cannot silently re-parent a session.
    if (projectFlag !== undefined && projectFlag !== existing.projectId) {
      process.stderr.write(
        `[gobbi workflow init] session ${sessionId} is bound to project '${existing.projectId}'; --project=${projectFlag} not allowed\n`,
      );
      process.exit(2);
    }
    // Silent success.
    return;
  }

  // Fresh init — resolve projectName via the simplified two-step ladder.
  const projectName = resolveProjectNameForInit(repoRoot, projectFlag);

  const sessionDir = sessionDirForProject(repoRoot, projectName, sessionId);

  mkdirSync(sessionDir, { recursive: true });

  const task = typeof values.task === 'string' ? values.task : '';
  const evalIdeation = values['eval-ideation'] === true;
  const evalPlanning = values['eval-planning'] === true;

  // session.json stub carries the 6 required-at-all-stages fields per the
  // ideation lock (schemaVersion, sessionId, projectId, createdAt,
  // gobbiVersion, task). The full session.json with steps[] lands at the
  // memorization step's STEP_EXIT (T-2a.8.2).
  const createdAt = new Date().toISOString();
  const gobbiVersion = await readInstalledVersion();
  writeSessionStub({
    repoRoot,
    projectName,
    sessionId,
    task,
    gobbiVersion,
    createdAt,
  });

  // Resolve the cascaded settings AFTER the session.json stub is written so
  // the session-level `settings.json` (if one was seeded by a future Pass)
  // is visible. The resolved cascade feeds `initialState` so
  // `state.maxFeedbackRounds` reflects the configured per-step
  // `workflow.{step}.maxIterations` instead of the hardcoded 3 (issue #134).
  const resolvedSettings = resolveSettings({
    repoRoot,
    sessionId,
    projectName,
  });

  // Open the SQLite store and emit the opening events sequentially.
  //
  // PR-FIN-2a-ii (T-2a.8.2): `appendEventAndUpdateState` is async — its
  // post-commit dispatch awaits the memorization session.json writer — so
  // the two-event init pair can no longer share an outer
  // `store.transaction(() => { ... })` envelope (bun:sqlite transaction
  // callbacks cannot await). Each call still runs inside its own IMMEDIATE
  // SQLite transaction; the only invariant we lose is "both rolls back
  // together on an inter-event crash".
  //
  // The downgrade is acceptable here because the SessionStart hook is
  // idempotent: a partial init (workflow.start committed, workflow.eval.decide
  // not) re-runs cleanly on the next hook fire. The first call is a no-op
  // (dedup'd at the idempotency UNIQUE), the second appends the missing
  // decide event. No orphan state can survive a re-init pass.
  //
  // PR-FIN-2a-ii (T-2a.9.unified) also retired the per-session `state.json`
  // projection — workflow state is derived on demand via `deriveState(...)`
  // from workspace `state.db` events. Neither this path nor the resume
  // `--force-memorization` branch writes `state.json` any longer.
  const dbPath = join(sessionDir, 'gobbi.db');
  // PR-FIN-2a-ii (T-2a.8.5): supply the partition keys explicitly rather
  // than calling `resolvePartitionKeys(sessionDir)`. We already have
  // both values in this scope (`sessionId` from the resolver above;
  // `projectName` from the PR-FIN-1c project-name resolution), so
  // passing them in directly is strictly more correct than the
  // disk-roundtrip — it also avoids the path-derivation fallback that
  // T-2a.9.unified retired alongside metadata.json.
  const store = new EventStore(dbPath, {
    sessionId,
    projectId: projectName,
  });
  try {
    // Start from a fresh state — this is a brand-new session, so
    // `resolveWorkflowState` would return `initialState` anyway, but
    // relying on it keeps the invariant explicit.
    let state = resolveWorkflowState(sessionDir, store, sessionId);
    // Empty database: initialState; if somehow we landed here with events,
    // resolve still returns the derived state and we compose from there.
    if (state.currentStep !== 'idle' && state.currentStep !== 'ideation') {
      // Defensive: should never happen on a fresh session. Fall back to
      // initialState rather than emit events against an unknown base.
      state = initialState(sessionId, resolvedSettings);
    } else if (state.currentStep === 'idle') {
      // Fresh session — overlay the settings-derived feedback cap onto the
      // initialState the cold fallback returned. The replay path inside
      // `resolveWorkflowState` calls `initialState(sessionId)` without
      // settings so the cascaded cap must be threaded in here. All other
      // initialState fields are unchanged for an empty event stream.
      state = initialState(sessionId, resolvedSettings);
    }

    const startEvent = createWorkflowStart({
      sessionId,
      timestamp: createdAt,
    });
    const startResult = await appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      startEvent,
      'cli',
      sessionId,
      'system',
    );

    // PR-FIN-2a-i T-2a.7: stamp the resolved memorization-eval decision
    // onto the EVAL_DECIDE payload so the new
    // `memorization → memorization_eval` graph branch fires when the
    // cascade carries `workflow.memorization.evaluate.mode === 'always'`.
    // No `--eval-memorization` CLI flag exists today (memorization eval is
    // settings-driven, not invocation-driven). For `'ask'` / `'auto'`
    // modes the translation helper requires a user / orchestrator answer
    // that init has no source for, so we resolve only the deterministic
    // modes here and treat indeterminate modes as disabled at init —
    // the cascade still records the user's preference and a future
    // eval-checkpoint can resolve `'ask'` / `'auto'` interactively.
    const memorizationMode =
      resolvedSettings.workflow?.memorization?.evaluate?.mode;
    const memorizationEnabled =
      memorizationMode === undefined ||
      memorizationMode === 'always' ||
      memorizationMode === 'skip'
        ? resolveEvalDecision(resolvedSettings, 'memorization').enabled
        : false;
    const decideEvent = createEvalDecide({
      ideation: evalIdeation,
      plan: evalPlanning,
      memorization: memorizationEnabled,
    });
    await appendEventAndUpdateState(
      store,
      sessionDir,
      startResult.state,
      decideEvent,
      'cli',
      sessionId,
      'system',
    );
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Order-preserving dedup for a short readonly list. Used to collapse the
 * existing-session probe's candidate project names when both legs of the
 * ladder happen to produce the same name (e.g. `--project gobbi` in a
 * repo named `gobbi`).
 */
function dedup(items: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

/**
 * Resolve the session id using the priority described in the module
 * docblock — `--session-id` flag → `$CLAUDE_SESSION_ID` env → hard error.
 *
 * No silent UUID fabrication: a randomly-generated id orphans
 * `.gobbi/projects/<name>/sessions/<random>/` directories that nothing
 * else references, contaminating the workspace and breaking idempotent
 * re-init. Fail loudly with remediation instead.
 *
 * Return type `string | never` makes the abort path explicit at the
 * signature level — `string | never` simplifies to `string` for assignable
 * callers, but the `never` annotation signals the process-exit branch and
 * matches the `emitCascadeError: never` convention in `commands/config.ts`.
 *
 * Exits 2 (and never returns) when both sources are absent. Exported so
 * tests can exercise both the success branches and the abort branch.
 */
export function resolveSessionId(override: string | undefined): string | never {
  if (override !== undefined && override !== '') return override;
  const env = process.env['CLAUDE_SESSION_ID'];
  if (env !== undefined && env !== '') return env;
  process.stderr.write(
    'gobbi: cannot resolve session id.\n' +
      '  Tried: --session-id flag, CLAUDE_SESSION_ID env.\n' +
      '  Pass --session-id explicitly, or invoke from a Claude Code SessionStart hook\n' +
      '  (which writes CLAUDE_SESSION_ID to $CLAUDE_ENV_FILE via `gobbi hook session-start`).\n',
  );
  process.exit(2);
}

/**
 * Resolve the effective project name for a fresh `workflow init` run.
 *
 *   1. `--project <name>` CLI flag (per-invocation override).
 *   2. `basename(repoRoot)` — the directory containing the repo.
 *
 * PR-FIN-1c: the `projects.active` registry was removed; the resolution
 * is a pure function with no side effects (no bootstrap write — there is
 * nothing to bootstrap).
 *
 * Exported for tests. Production callers reach this via `runInitWithOptions`.
 */
export function resolveProjectNameForInit(
  repoRoot: string,
  projectFlag: string | undefined,
): string {
  if (projectFlag !== undefined && projectFlag !== '') {
    return projectFlag;
  }
  return basename(repoRoot);
}

