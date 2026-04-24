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
import { sessionDir as sessionDirForProject } from '../../lib/workspace-paths.js';
import { EventStore } from '../../workflow/store.js';
import { appendEventAndUpdateState, resolveWorkflowState } from '../../workflow/engine.js';
import { initialState } from '../../workflow/state.js';
import {
  createWorkflowStart,
  createEvalDecide,
} from '../../workflow/events/workflow.js';

import { detectTechStack } from './tech-stack.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow init [options]

Initialise the workflow session directory and emit the opening events.

Options:
  --session-id <id>     Session id (overrides CLAUDE_SESSION_ID, generates UUID if neither set)
  --task <text>         Free-text description of the task
  --eval-ideation       Enable evaluation after ideation (default: off)
  --eval-plan           Enable evaluation after plan (default: off)
  --context <text>      Free-text session context / constraints
  --help, -h            Show this help message

Idempotent: re-running against an existing session directory is a silent no-op.`;

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  'session-id': { type: 'string' },
  task: { type: 'string' },
  'eval-ideation': { type: 'boolean', default: false },
  'eval-plan': { type: 'boolean', default: false },
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
 *     (see `.gobbi/projects/<projectName>/`). Resolved at init time; never
 *     rewritten. W2.3 plumbs the full resolution chain (flag/active/bootstrap);
 *     this wave derives from `basename(repoRoot)` as a simple starting point.
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
  readonly evalPlan: boolean;
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
  // TODO(W2.3): replace basename(repoRoot) with projects.active resolution + fallback
  const projectName = basename(repoRoot);
  const sessionDir = sessionDirForProject(repoRoot, projectName, sessionId);
  const metadataPath = join(sessionDir, 'metadata.json');

  // Ensure the unified settings cascade is ready — deletes legacy config
  // sources (.gobbi/config.db, .claude/gobbi.json), upgrades legacy T2-v1
  // project-config.json → project/settings.json, seeds workspace defaults,
  // and updates .gobbi/.gitignore. Idempotent; safe to call every init.
  await ensureSettingsCascade(repoRoot);

  // Idempotent fast-path — if the metadata file already exists AND validates,
  // init is a silent no-op. An existing-but-malformed metadata.json is fatal
  // rather than silently overwritten; the operator must triage.
  if (existsSync(metadataPath)) {
    const existing = readMetadata(metadataPath);
    if (existing === null) {
      process.stderr.write(
        `gobbi workflow init: existing ${metadataPath} is malformed — remove or repair manually\n`,
      );
      process.exit(1);
    }
    // Silent success.
    return;
  }

  // Fresh init.
  mkdirSync(sessionDir, { recursive: true });

  const configSnapshot: SessionConfigSnapshot = {
    task: typeof values.task === 'string' ? values.task : '',
    evalIdeation: values['eval-ideation'] === true,
    evalPlan: values['eval-plan'] === true,
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
  const store = new EventStore(dbPath);
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
        plan: configSnapshot.evalPlan,
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
  if (!isBoolean(snapshot['evalPlan'])) return false;
  if (!isString(snapshot['context'])) return false;
  return true;
}
