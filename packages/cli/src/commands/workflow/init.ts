/**
 * gobbi workflow init — initialise a workflow session directory.
 *
 * Creates `.gobbi/sessions/<sessionId>/` under the detected repo root, writes
 * a `metadata.json` at schema v3, opens the SQLite event store (`gobbi.db`),
 * and appends the opening pair of events — `workflow.start` followed by
 * `workflow.eval.decide` — atomically inside a single `store.transaction`.
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
 *   2. `CLAUDE_SESSION_ID` env var (hook context — set by Claude Code).
 *   3. Fallback — generate a fresh UUID.
 *
 * ## Project name resolution
 *
 * On fresh init, the project name resolves with this priority:
 *
 *   1. `--project <name>` CLI flag (highest priority; per-invocation —
 *      does NOT cascade into `projects.active`).
 *   2. `projects.active` from `.gobbi/settings.json` (workspace level).
 *   3. Bootstrap auto-create — default to `basename(repoRoot)` AND write
 *      `projects.active = basename(repoRoot)` + append to `projects.known`
 *      in `.gobbi/settings.json`. Emits a stderr notification so the
 *      implicit bootstrap is visible.
 *
 * On existing-session re-init, `metadata.json.projectName` is authoritative.
 * If `--project <name>` is provided AND does not match the stamped
 * `projectName`, init exits 2 with a clear stderr message — sessions are
 * bound to ONE project at birth and cannot be re-parented mid-flight.
 *
 * ## Schema
 *
 * `metadata.json` shape is at `schemaVersion: 3` as of the gobbi-memory
 * Pass-2 redesign — v3 adds the required `projectName` field that names
 * the project partition this session belongs to. The metadata schemaVersion
 * is decoupled from the state-machine `WorkflowState.schemaVersion` (which
 * lives in `workflow/state.ts` and tracks state-shape migrations separately).
 */

import { parseArgs } from 'node:util';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { getRepoRoot } from '../../lib/repo.js';
import { isRecord, isString, isNumber, isBoolean, isArray } from '../../lib/guards.js';
import { ensureSettingsCascade } from '../../lib/ensure-settings-cascade.js';
import { type Settings } from '../../lib/settings.js';
import {
  loadSettingsAtLevel,
  writeSettingsAtLevel,
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
  --session-id <id>     Session id (overrides CLAUDE_SESSION_ID, generates UUID if neither set)
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
 * On-disk shape of `metadata.json`. Schema v3 adds the required `projectName`
 * field for the gobbi-memory Pass-2 multi-project layout.
 *
 *   - `sessionId` — matches the directory name.
 *   - `createdAt` — ISO-8601 timestamp, set once at init; never rewritten.
 *   - `projectRoot` — absolute path to the repo root at init time.
 *   - `projectName` — name of the project partition this session belongs to
 *     (see `.gobbi/projects/<projectName>/`). Resolved at init time via the
 *     `--project` flag / `projects.active` / bootstrap ladder; never rewritten.
 *     Mid-session re-parent is rejected (see module docblock §Project name
 *     resolution).
 *   - `techStack` — output of {@link detectTechStack} (lowercase, deduped,
 *     alphabetically sorted; empty array when no signals match).
 *   - `configSnapshot` — the setup answers captured at init (task text,
 *     evaluation toggles, free-text context). PR C freezes them once; PR D
 *     may revisit if mid-session reconfig becomes a requirement.
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

  // Ensure the unified settings cascade is ready — deletes legacy config
  // sources (.gobbi/config.db, .claude/gobbi.json), upgrades legacy T2-v1
  // project-config.json → project/settings.json, seeds workspace defaults,
  // and updates .gobbi/.gitignore. Idempotent; safe to call every init.
  // This also guarantees `.gobbi/settings.json` exists (seeded with
  // `{projects: {active: null, known: []}}` on fresh repos) so the
  // project-name resolution ladder below can always read it.
  await ensureSettingsCascade(repoRoot);

  // Idempotent fast-path — find any pre-existing session for this sessionId
  // across every plausible project name (flag, projects.active, basename) so
  // that re-init with a mismatching flag hits the mismatch gate rather than
  // fresh-init-ing a second session under the wrong project. Session is
  // bound to ONE project at birth per metadata.projectName, which is the
  // authoritative answer once we locate the existing metadata.json.
  const workspaceActive = readWorkspaceActiveProject(repoRoot);
  const candidateProjectNames: readonly string[] = dedup([
    ...(projectFlag !== undefined ? [projectFlag] : []),
    ...(workspaceActive !== null ? [workspaceActive] : []),
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

  // Fresh init — resolve projectName via the 3-step ladder. Bootstrap is
  // the side-effect branch: when no name comes from the flag or workspace
  // settings, we name the project `basename(repoRoot)` AND cascade it into
  // `projects.active` + `projects.known` so subsequent inits take the
  // workspace-read branch without re-bootstrapping.
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

  // Open the SQLite store and emit the opening events atomically inside a
  // single transaction. `appendEventAndUpdateState` already uses IMMEDIATE
  // locking; composing two calls under `store.transaction` yields a single
  // outer SAVEPOINT (bun:sqlite promotes nested calls automatically), so a
  // crash between the two appends rolls the pair back together.
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
        state = initialState(sessionId);
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
 * existing-session probe's candidate project names when two legs of the
 * ladder happen to produce the same name (e.g. `--project gobbi` in a repo
 * named `gobbi`, or `projects.active === basename(repoRoot)`).
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
 * Resolve the session id using the three-tier priority described in the
 * module docblock. Exported so tests can exercise the fallback chain.
 */
export function resolveSessionId(override: string | undefined): string {
  if (override !== undefined && override !== '') return override;
  const env = process.env['CLAUDE_SESSION_ID'];
  if (env !== undefined && env !== '') return env;
  return randomUUID();
}

/**
 * Resolve the effective project name for a fresh `workflow init` run.
 *
 *   1. `--project <name>` CLI flag (per-invocation; never cascaded into
 *      `projects.active` — the flag is a one-shot override).
 *   2. `projects.active` from `.gobbi/settings.json` (workspace level).
 *   3. Bootstrap auto-create — default to `basename(repoRoot)`, write
 *      `projects.active` + append to `projects.known` in
 *      `.gobbi/settings.json`, and emit a stderr notification so the
 *      implicit bootstrap is visible.
 *
 * Exported for tests. Production callers reach this via `runInitWithOptions`.
 * Side-effect branch (step 3) mutates the workspace settings file via
 * atomic write.
 */
export function resolveProjectNameForInit(
  repoRoot: string,
  projectFlag: string | undefined,
): string {
  if (projectFlag !== undefined && projectFlag !== '') {
    // Flag is a per-invocation override — do NOT write to projects.active.
    return projectFlag;
  }

  const active = readWorkspaceActiveProject(repoRoot);
  if (active !== null) {
    return active;
  }

  // Bootstrap — no flag, no active project. Name the project after the repo
  // directory, record it in workspace settings, and surface the bootstrap
  // on stderr so callers can see that the implicit branch fired.
  const bootstrapName = basename(repoRoot);
  writeBootstrapProjectsRegistry(repoRoot, bootstrapName);
  process.stderr.write(
    `[gobbi workflow init] bootstrapped default project '${bootstrapName}' in .gobbi/settings.json\n`,
  );
  return bootstrapName;
}

/**
 * Read `projects.active` from `.gobbi/settings.json` without going through
 * the full cascade resolver — the bootstrap branch needs to know whether
 * a real value is present before it attempts to write one. Returns `null`
 * when the file is absent, fails to parse, or carries a null / empty active
 * project. Never throws; parse / read failures fall back to bootstrap.
 *
 * Note: settings-io.ts has an equivalent private helper. We duplicate the
 * ~20 lines here rather than export the settings-io helper because the
 * init-side semantics are different: settings-io uses the value to compose
 * paths (with a stderr fallback warning); init uses it as one leg of a
 * write-side ladder where the absence triggers bootstrap, not a warning.
 */
function readWorkspaceActiveProject(repoRoot: string): string | null {
  const filePath = join(repoRoot, '.gobbi', 'settings.json');
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
 * Bootstrap write — read the workspace `settings.json` (guaranteed to exist
 * post-`ensureSettingsCascade`), overlay `projects.active = name` + dedup
 * `projects.known`, and atomic-write back via `writeSettingsAtLevel`. If
 * the file is somehow missing or malformed, synthesise the minimum-valid
 * shape from defaults so the bootstrap never wedges the init.
 */
function writeBootstrapProjectsRegistry(
  repoRoot: string,
  projectName: string,
): void {
  let current: Settings | null;
  try {
    current = loadSettingsAtLevel(repoRoot, 'workspace');
  } catch {
    // Malformed workspace file — treat as fresh bootstrap. AJV validation
    // on the write will catch any lingering shape drift.
    current = null;
  }

  const knownSet = new Set<string>(current?.projects?.known ?? []);
  knownSet.add(projectName);
  const nextKnown = Array.from(knownSet);

  const next: Settings = {
    ...(current ?? { schemaVersion: 1, projects: { active: null, known: [] } }),
    schemaVersion: 1,
    projects: {
      active: projectName,
      known: nextKnown,
    },
  };

  writeSettingsAtLevel(repoRoot, 'workspace', next);
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
  // TODO(W6.1): fixture tests asserting schemaVersion: 2 must migrate to 3
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
