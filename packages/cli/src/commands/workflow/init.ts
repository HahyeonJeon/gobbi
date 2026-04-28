/**
 * gobbi workflow init — initialise a workflow session directory.
 *
 * Creates `.gobbi/projects/<name>/sessions/<sessionId>/` under the detected
 * repo root, writes a `metadata.json` at schema v3, opens the SQLite event
 * store (`gobbi.db`), and appends the opening pair of events —
 * `workflow.start` followed by `workflow.eval.decide` — atomically inside
 * a single `store.transaction`.
 *
 * ## Idempotency
 *
 * The SessionStart hook fires on `startup | resume | compact`, so `init` is
 * invoked multiple times per logical session. A fresh invocation against an
 * existing directory is a no-op: the metadata is re-validated, no events are
 * emitted, and the command exits 0 silently. A corrupt `metadata.json` is
 * not transparently rewritten — it's reported on stderr with a non-zero exit
 * so the operator can see the drift.
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
 * On existing-session re-init, `metadata.json.projectName` is authoritative.
 * If `--project <name>` is provided AND does not match the stamped
 * `projectName`, init exits 2 with a clear stderr message — sessions are
 * bound to ONE project at birth and cannot be re-parented mid-flight.
 *
 * ## Schema
 *
 * `metadata.json` shape is at `schemaVersion: 3` — v3 carries the required
 * `projectName` field that names the project partition this session
 * belongs to. The metadata schemaVersion is decoupled from the
 * state-machine `WorkflowState.schemaVersion`.
 */

import { parseArgs } from 'node:util';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import { getRepoRoot } from '../../lib/repo.js';
import { isRecord, isString, isNumber, isBoolean, isArray } from '../../lib/guards.js';
import { ensureSettingsCascade } from '../../lib/ensure-settings-cascade.js';
import {
  resolveSettings,
} from '../../lib/settings-io.js';
import { sessionDir as sessionDirForProject } from '../../lib/workspace-paths.js';
import { EventStore } from '../../workflow/store.js';
import { appendEventAndUpdateState, resolveWorkflowState } from '../../workflow/engine.js';
import { initialState } from '../../workflow/state.js';
import {
  createWorkflowStart,
  createEvalDecide,
} from '../../workflow/events/workflow.js';

import { resolvePartitionKeys } from '../session.js';

import { detectTechStack } from './tech-stack.js';

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
Re-init with --project must match metadata.projectName; mismatch exits 2.`;

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
// Metadata shape
// ---------------------------------------------------------------------------

/**
 * On-disk shape of `metadata.json`. Schema v3 carries the required
 * `projectName` field for the multi-project layout.
 *
 *   - `sessionId` — matches the directory name.
 *   - `createdAt` — ISO-8601 timestamp, set once at init; never rewritten.
 *   - `projectRoot` — absolute path to the repo root at init time.
 *   - `projectName` — name of the project partition this session belongs to
 *     (see `.gobbi/projects/<projectName>/`). Resolved at init time via the
 *     `--project` flag / `basename(repoRoot)` ladder; never rewritten.
 *     Mid-session re-parent is rejected (see module docblock §Project name
 *     resolution).
 *   - `techStack` — output of {@link detectTechStack} (lowercase, deduped,
 *     alphabetically sorted; empty array when no signals match).
 *   - `configSnapshot` — the setup answers captured at init (task text,
 *     evaluation toggles, free-text context).
 */
export interface SessionMetadata {
  readonly schemaVersion: 3;
  readonly sessionId: string;
  readonly createdAt: string;
  readonly projectRoot: string;
  readonly projectName: string;
  readonly techStack: readonly string[];
  readonly configSnapshot: SessionConfigSnapshot;
}

export interface SessionConfigSnapshot {
  readonly task: string;
  readonly evalIdeation: boolean;
  readonly evalPlanning: boolean;
  readonly context: string;
}

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
  // project at birth per metadata.projectName.
  const candidateProjectNames: readonly string[] = dedup([
    ...(projectFlag !== undefined ? [projectFlag] : []),
    basename(repoRoot),
  ]);
  for (const candidate of candidateProjectNames) {
    const probeDir = sessionDirForProject(repoRoot, candidate, sessionId);
    const probePath = join(probeDir, 'metadata.json');
    if (!existsSync(probePath)) continue;
    const existing = readMetadata(probePath);
    if (existing === null) {
      process.stderr.write(
        `gobbi workflow init: existing ${probePath} is malformed — remove or repair manually\n`,
      );
      process.exit(1);
    }
    // Mismatch gate — a session's projectName is frozen at birth. An explicit
    // --project override on re-init must match the stamped value or we exit 2
    // so the operator cannot silently re-parent a session.
    if (projectFlag !== undefined && projectFlag !== existing.projectName) {
      process.stderr.write(
        `[gobbi workflow init] session ${sessionId} is bound to project '${existing.projectName}'; --project=${projectFlag} not allowed\n`,
      );
      process.exit(2);
    }
    // Silent success.
    return;
  }

  // Fresh init — resolve projectName via the simplified two-step ladder.
  const projectName = resolveProjectNameForInit(repoRoot, projectFlag);

  const sessionDir = sessionDirForProject(repoRoot, projectName, sessionId);
  const metadataPath = join(sessionDir, 'metadata.json');

  mkdirSync(sessionDir, { recursive: true });

  const configSnapshot: SessionConfigSnapshot = {
    task: typeof values.task === 'string' ? values.task : '',
    evalIdeation: values['eval-ideation'] === true,
    evalPlanning: values['eval-planning'] === true,
    context: typeof values.context === 'string' ? values.context : '',
  };

  const techStack = detectTechStack(repoRoot);

  const metadata: SessionMetadata = {
    schemaVersion: 3,
    sessionId,
    createdAt: new Date().toISOString(),
    projectRoot: repoRoot,
    projectName,
    techStack,
    configSnapshot,
  };

  writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

  // Resolve the cascaded settings AFTER metadata is written so the
  // session-level `settings.json` (if one was seeded by a future Pass) is
  // visible. The resolved cascade feeds `initialState` so
  // `state.maxFeedbackRounds` reflects the configured per-step
  // `workflow.{step}.maxIterations` instead of the hardcoded 3 (issue #134).
  const resolvedSettings = resolveSettings({
    repoRoot,
    sessionId,
    projectName,
  });

  // Open the SQLite store and emit the opening events atomically inside a
  // single transaction. `appendEventAndUpdateState` already uses IMMEDIATE
  // locking; composing two calls under `store.transaction` yields a single
  // outer SAVEPOINT (bun:sqlite promotes nested calls automatically), so a
  // crash between the two appends rolls the pair back together.
  //
  // Why no explicit `writeState` after this transaction:
  // The inner calls go through `appendEventAndUpdateState`, which
  // calls `backupState` + `writeState` itself on every append (see
  // `engine.ts`). state.json is materialised twice during this block —
  // once after `workflow.start`, once after `workflow.eval.decide` —
  // and the final write reflects the post-decide state. No
  // post-transaction projection is needed.
  //
  // Contrast with the `--force-memorization` branch in `resume.ts`:
  // that path appends events directly via `store.append(...)` inside
  // its raw transaction (NOT through `appendEventAndUpdateState`),
  // bypassing the per-append state.json write. It therefore needs an
  // explicit `backupState` + `writeState` after the commit to bring
  // state.json forward. See CV-9 (issue #163) for the regression that
  // motivated that pattern.
  const dbPath = join(sessionDir, 'gobbi.db');
  const partitionKeys = resolvePartitionKeys(sessionDir);
  const store = new EventStore(dbPath, partitionKeys);
  try {
    store.transaction(() => {
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
        timestamp: metadata.createdAt,
      });
      const startResult = appendEventAndUpdateState(
        store,
        sessionDir,
        state,
        startEvent,
        'cli',
        sessionId,
        'system',
      );

      const decideEvent = createEvalDecide({
        ideation: configSnapshot.evalIdeation,
        plan: configSnapshot.evalPlanning,
      });
      appendEventAndUpdateState(
        store,
        sessionDir,
        startResult.state,
        decideEvent,
        'cli',
        sessionId,
        'system',
      );
    });
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

/**
 * Read and structurally validate a `metadata.json`. Returns `null` when the
 * file is malformed at any level — callers decide how to surface that.
 */
export function readMetadata(path: string): SessionMetadata | null {
  let raw: string;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  return isValidMetadata(parsed) ? parsed : null;
}

export function isValidMetadata(value: unknown): value is SessionMetadata {
  if (!isRecord(value)) return false;
  if (!isNumber(value['schemaVersion']) || value['schemaVersion'] !== 3) return false;
  if (!isString(value['sessionId'])) return false;
  if (!isString(value['createdAt'])) return false;
  if (!isString(value['projectRoot'])) return false;
  if (!isString(value['projectName'])) return false;
  if (!isArray(value['techStack'])) return false;
  for (const tag of value['techStack']) {
    if (!isString(tag)) return false;
  }
  const snapshot = value['configSnapshot'];
  if (!isRecord(snapshot)) return false;
  if (!isString(snapshot['task'])) return false;
  if (!isBoolean(snapshot['evalIdeation'])) return false;
  if (!isBoolean(snapshot['evalPlanning'])) return false;
  if (!isString(snapshot['context'])) return false;
  return true;
}
