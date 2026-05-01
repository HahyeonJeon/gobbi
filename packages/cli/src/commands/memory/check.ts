/**
 * gobbi memory check — single-session memory inspection.
 *
 * ## Context (v0.5.0 PR-CFM-B — issue #236 part 1)
 *
 * The operator-facing per-session counterpart of
 * `gobbi maintenance verify-state-projections`. The maintenance command
 * is the workspace sweep; this command is the targeted lens an operator
 * reaches for when they have one suspect session id in hand.
 *
 * Both share the same divergence library
 * (`lib/memory-projection-diff.ts`) and the same workspace adapter
 * (`lib/workspace-read-store.ts`) — this module is a thin shell that
 * post-filters the cross-session result to one session and adds explicit
 * `SESSION_NOT_FOUND` detection for typo'd ids.
 *
 * ## Filter strategy (PR-CFM-B synthesis §3.2)
 *
 * Do NOT pre-filter events to the session before calling the library.
 * Pre-filtering breaks the orphan-recovery path in
 * `groupRowsBySession` (which tolerates `session_id = null` rows by
 * recovering from a `workflow.start` payload in the same orphan group).
 * Instead, call `memoryProjectionDiff()` over the full store, then
 * post-filter `divergences[]` by `sessionId`. The frozen library API
 * supports this exact pattern — `divergences[]` carries `sessionId` as a
 * discriminator.
 *
 * ## SESSION_NOT_FOUND detection (3-step algorithm)
 *
 * `memoryProjectionDiff()`'s frozen API does not expose whether a given
 * session-id was walked. To distinguish "session exists, no divergences"
 * (exit 0) from "session does not exist anywhere" (exit 1,
 * `SESSION_NOT_FOUND`) the pure-core performs:
 *
 *   1. Call `memoryProjectionDiff()` over the full store.
 *   2. Post-filter `divergences[]` to `divergence.sessionId === sessionId`.
 *   3. If filtered set is empty AND zero rows in the store match
 *      `sessionId` AND no `project.json.sessions[]` entry for the id →
 *      `SESSION_NOT_FOUND`. Otherwise → exit 0.
 *
 * ## Exit codes
 *
 *   - `0` — verify ran AND zero divergences for the requested session id.
 *   - `1` — verify ran AND ≥ 1 divergence for the session, OR
 *           `DB_MISSING` / `PROJECT_MISSING` / `SESSION_NOT_FOUND`. The
 *           `--json` envelope's `code` field discriminates the failure.
 *   - `2` — `parseArgs` rejected (`PARSE_ARGS`).
 *
 * @see `lib/memory-projection-diff.ts` — pure divergence detector.
 * @see `lib/workspace-read-store.ts` — cross-partition `ReadStore`.
 * @see `commands/maintenance/verify-state-projections.ts` — sibling
 *      command (workspace sweep) this module mirrors in shape.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import {
  memoryProjectionDiff,
  type MemoryDivergence,
} from '../../lib/memory-projection-diff.js';
import { readProjectJson } from '../../lib/json-memory.js';
import { getRepoRoot } from '../../lib/repo.js';
import { WorkspaceReadStore } from '../../lib/workspace-read-store.js';
import { projectDir, workspaceRoot } from '../../lib/workspace-paths.js';
import { reduce } from '../../workflow/reducer.js';
import type { ReduceFn } from '../../workflow/types.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi memory check <session-id> [options]

Inspect a single session for memory drift between the workspace state.db
event store and the per-session projection in project.json. Detects
divergences across 5 kinds (row-missing, finishedAt, task,
events.replay_threw, events.empty). Exits 0 when no divergences are
found for the supplied session id, 1 on any divergence (or when a
required file is missing, or when the session id does not exist), 2 on
argv parse error.

Note: this command performs SEMANTIC divergence detection — it does NOT
AJV-validate session.json shape. For workspace-wide drift inspection
across every session use 'gobbi maintenance verify-state-projections'.

Arguments:
  <session-id>            Session id to inspect (positional, required)

Options:
  --db <path>             Path to state.db (default: <repoRoot>/.gobbi/state.db)
  --project <path>        Path to project.json (default: derived from
                          --project-name + repoRoot)
  --project-name <name>   Project name override (default: basename(repoRoot))
  --json                  Emit a JSON object instead of the human-readable
                          summary. Under --json, error paths emit a structured
                          envelope of shape {"status":"error","code":"<code>",
                          "message":"...","path":"..."} to stderr instead of
                          plain text.
  --help, -h              Show this help message`;

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/**
 * Test-time overrides. Production callers pass `{}`; tests thread a
 * scratch repo root + deterministic clock through these so the rendered
 * output is predictable.
 */
export interface MemoryCheckOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
  /**
   * Override `Date.now()` for the `elapsedMs` measurement. Tests pass a
   * monotonically-incrementing clock so `elapsedMs` is reproducible.
   */
  readonly now?: () => number;
  /**
   * Override the production reducer. Tests use this to force a
   * `events.replay_threw` divergence without corrupting on-disk events.
   */
  readonly reduceFn?: ReduceFn;
}

// ---------------------------------------------------------------------------
// Result + error shapes
// ---------------------------------------------------------------------------

/**
 * Structured result emitted under `--json`. Returned from
 * {@link checkMemoryAt} so tests can assert without parsing stdout.
 *
 * `divergences[]` is already filtered to the requested `sessionId` —
 * cross-session entries from `memoryProjectionDiff()` are post-filtered
 * out by the pure core. `sessionsChecked` is fixed at `1` on the
 * success path (the targeted session was either present or absent; the
 * absent case fails before this result type is constructed).
 */
export interface MemoryCheckResult {
  readonly stateDbPath: string;
  readonly projectJsonPath: string;
  readonly sessionId: string;
  readonly sessionsChecked: number;
  readonly divergences: readonly MemoryDivergence[];
  readonly elapsedMs: number;
}

/**
 * Stable error code surface for the `--json` failure path. Mirrors the
 * deliberately-narrow set used by `verify-state-projections.ts` plus the
 * per-session `SESSION_NOT_FOUND` arm.
 *
 *   - `DB_MISSING`       — pre-flight `existsSync` returned false for
 *                          the resolved state.db path.
 *   - `PROJECT_MISSING`  — pre-flight `existsSync` returned false for
 *                          the resolved project.json path.
 *   - `SESSION_NOT_FOUND`— the supplied session id has no rows in the
 *                          state.db AND no entry in
 *                          `project.json.sessions[]`.
 *   - `PARSE_ARGS`       — `parseArgs` rejected the supplied flags. Maps
 *                          to exit code 2 (argv error) rather than 1.
 */
export type MemoryCheckErrorCode =
  | 'DB_MISSING'
  | 'PROJECT_MISSING'
  | 'SESSION_NOT_FOUND'
  | 'PARSE_ARGS';

/**
 * Structured error envelope emitted on stderr under `--json` when the
 * command fails. `path` carries the resolved target when known at the
 * failure point — absent on `PARSE_ARGS` (argv parsing fires before
 * path resolution) and on `SESSION_NOT_FOUND` (the missing-resource is
 * a session id, not a filesystem path).
 */
export interface MemoryCheckErrorEnvelope {
  readonly status: 'error';
  readonly code: MemoryCheckErrorCode;
  readonly message: string;
  readonly path?: string;
}

/**
 * Emit an error to stderr in the shape demanded by `jsonFlag`. Pretty
 * form preserves the conventional `gobbi memory check: <message>`
 * shape; JSON form emits a single-line structured envelope.
 */
function writeErrorEnvelope(
  jsonFlag: boolean,
  code: MemoryCheckErrorCode,
  message: string,
  targetPath: string | undefined,
): void {
  if (jsonFlag) {
    const envelope: MemoryCheckErrorEnvelope =
      targetPath !== undefined
        ? { status: 'error', code, message, path: targetPath }
        : { status: 'error', code, message };
    process.stderr.write(`${JSON.stringify(envelope)}\n`);
    return;
  }
  process.stderr.write(`gobbi memory check: ${message}\n`);
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runMemoryCheck(args: string[]): Promise<void> {
  await runMemoryCheckWithOptions(args, {});
}

export async function runMemoryCheckWithOptions(
  args: string[],
  overrides: MemoryCheckOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // Detect `--json` ahead of `parseArgs` so the failure-path envelope is
  // available even when argv parsing itself throws. Mirrors
  // `verify-state-projections.ts` precedent.
  const jsonFlag =
    args.includes('--json') || args.some((a) => a.startsWith('--json='));

  // --- 1. Parse flags ----------------------------------------------------
  let sessionId: string | undefined;
  let dbFlag: string | undefined;
  let projectFlag: string | undefined;
  let projectNameFlag: string | undefined;
  try {
    const { values, positionals } = parseArgs({
      args,
      allowPositionals: true,
      options: {
        db: { type: 'string' },
        project: { type: 'string' },
        'project-name': { type: 'string' },
        json: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    sessionId = positionals[0];
    if (sessionId === undefined || sessionId === '') {
      throw new TypeError(
        'Missing required positional argument: <session-id>',
      );
    }
    if (positionals.length > 1) {
      throw new TypeError(
        `Unexpected extra positional arguments: ${positionals.slice(1).join(' ')}`,
      );
    }
    dbFlag = values.db;
    projectFlag = values.project;
    projectNameFlag = values['project-name'];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    writeErrorEnvelope(jsonFlag, 'PARSE_ARGS', message, undefined);
    if (!jsonFlag) {
      process.stderr.write(`${USAGE}\n`);
    }
    process.exit(2);
  }

  // --- 2. Resolve target paths ------------------------------------------
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const stateDbPath = dbFlag ?? path.join(workspaceRoot(repoRoot), 'state.db');

  const projectJsonPath = ((): string => {
    if (projectFlag !== undefined) return projectFlag;
    const projectName = projectNameFlag ?? path.basename(repoRoot);
    return path.join(projectDir(repoRoot, projectName), 'project.json');
  })();

  // --- 3. Pre-flight: required files must exist -------------------------
  if (!existsSync(stateDbPath)) {
    writeErrorEnvelope(
      jsonFlag,
      'DB_MISSING',
      `state.db not found: ${stateDbPath}`,
      stateDbPath,
    );
    process.exit(1);
  }
  if (!existsSync(projectJsonPath)) {
    writeErrorEnvelope(
      jsonFlag,
      'PROJECT_MISSING',
      `project.json not found: ${projectJsonPath}`,
      projectJsonPath,
    );
    process.exit(1);
  }

  // --- 4. Run the targeted check ----------------------------------------
  const reduceFn = overrides.reduceFn ?? reduce;
  let result: MemoryCheckResult;
  try {
    result = await checkMemoryAt(
      stateDbPath,
      projectJsonPath,
      sessionId,
      reduceFn,
      overrides.now,
    );
  } catch (err) {
    if (err instanceof SessionNotFoundError) {
      writeErrorEnvelope(
        jsonFlag,
        'SESSION_NOT_FOUND',
        `session id not found in state.db or project.json: ${sessionId}`,
        undefined,
      );
      process.exit(1);
    }
    throw err;
  }

  // --- 5. Render --------------------------------------------------------
  if (jsonFlag) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else {
    process.stdout.write(renderPretty(result));
  }

  // --- 6. Exit code based on divergence count ---------------------------
  if (result.divergences.length > 0) {
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Verification core (pure-ish — no argv, no process.exit, no stdout)
// ---------------------------------------------------------------------------

/**
 * Sentinel thrown by {@link checkMemoryAt} when the supplied session
 * id matches no rows in the state.db AND no entry in
 * `project.json.sessions[]`. The argv shell catches this and emits a
 * `SESSION_NOT_FOUND` envelope; pure-core callers can catch it
 * themselves to distinguish from other errors.
 */
export class SessionNotFoundError extends Error {
  constructor(readonly sessionId: string) {
    super(`session not found: ${sessionId}`);
    this.name = 'SessionNotFoundError';
  }
}

/**
 * Open `stateDbPath`, read `projectJsonPath`, and call
 * {@link memoryProjectionDiff} with the supplied reducer. Post-filter
 * the cross-session result to `sessionId`. Throws
 * {@link SessionNotFoundError} when the id does not exist anywhere.
 *
 * The function is exported for tests so they can assert the result
 * shape without re-running the argv parsing path. Production callers go
 * through {@link runMemoryCheckWithOptions}.
 *
 * `now` defaults to `Date.now`; tests pass a fixed clock so the
 * `elapsedMs` measurement is deterministic in JSON snapshots.
 *
 * The 3-step `SESSION_NOT_FOUND` algorithm (see module docblock):
 *
 *   1. Compute the full diff via `memoryProjectionDiff()`.
 *   2. Post-filter `divergences[]` to the requested session id.
 *   3. When the filtered set is empty, prove session existence by
 *      checking BOTH (a) zero rows in `store.replayAll()` belong to the
 *      session id (mirrors `lib/json-memory.ts::rowBelongsToSession`)
 *      AND (b) no entry exists in `memory.sessions[]`. Both empty →
 *      throw; either non-empty → return zero-divergence result.
 */
export async function checkMemoryAt(
  stateDbPath: string,
  projectJsonPath: string,
  sessionId: string,
  reduceFn: ReduceFn,
  now?: () => number,
): Promise<MemoryCheckResult> {
  const memory = readProjectJson(projectJsonPath);

  const store = new WorkspaceReadStore(stateDbPath);
  try {
    const args =
      now !== undefined
        ? { store, memory, reduceFn, now }
        : { store, memory, reduceFn };
    const fullResult = memoryProjectionDiff(args);

    // Post-filter divergences to the requested session id. Library
    // walks the union of every session — we only surface the ones
    // matching the operator's positional argument.
    const divergences = fullResult.divergences.filter(
      (d) => d.sessionId === sessionId,
    );

    // SESSION_NOT_FOUND detection: filtered set empty AND no events for
    // sessionId AND no project.json row for sessionId.
    if (divergences.length === 0) {
      const allRows = store.replayAll();
      const hasEvents = allRows.some((row) => rowBelongsToSession(row, sessionId));
      const hasMemoryRow =
        memory !== null &&
        memory.sessions.some((s) => s.sessionId === sessionId);
      if (!hasEvents && !hasMemoryRow) {
        throw new SessionNotFoundError(sessionId);
      }
    }

    return {
      stateDbPath,
      projectJsonPath,
      sessionId,
      sessionsChecked: 1,
      divergences,
      elapsedMs: fullResult.elapsedMs,
    };
  } finally {
    store.close();
  }
}

/**
 * Mirror of `lib/json-memory.ts::rowBelongsToSession` (private to that
 * module). Legacy `session_id = null` rows are tolerated — when every
 * row in the store is null, every session id "matches" them. The
 * SESSION_NOT_FOUND check therefore stays sound on production stores
 * (which always stamp `session_id`) and avoids false-positive
 * SESSION_NOT_FOUND on legacy in-memory test stores.
 */
function rowBelongsToSession(
  row: { readonly session_id: string | null },
  sessionId: string,
): boolean {
  if (row.session_id === null) return true;
  return row.session_id === sessionId;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Format a {@link MemoryCheckResult} for terminal output. Mirrors
 * `verify-state-projections.ts::renderPretty` shape: header line, then
 * a sequence of `key: value` lines, one trailing newline.
 *
 * Each divergence renders as a bulleted line with the `field` and a
 * witness phrase derived from `fromEvents` / `fromMemory` / `note`.
 */
export function renderPretty(result: MemoryCheckResult): string {
  const lines: string[] = [
    'gobbi memory check',
    `state.db:    ${result.stateDbPath}`,
    `project.json: ${result.projectJsonPath}`,
    `session:     ${result.sessionId}`,
    `divergences: ${result.divergences.length}`,
  ];
  for (const div of result.divergences) {
    lines.push(`  - ${renderDivergence(div)}`);
  }
  lines.push(`elapsed: ${result.elapsedMs} ms`);
  lines.push('');
  return lines.join('\n');
}

/**
 * Render a single divergence as a human-readable phrase. Matches the
 * shape used by `verify-state-projections.ts::renderDivergence`.
 */
function renderDivergence(div: MemoryDivergence): string {
  switch (div.field) {
    case 'finishedAt':
      return `finishedAt: events have ${div.fromEvents ?? '(none)'}, row finishedAt is null`;
    case 'row-missing':
      return `row-missing: events have ${div.fromEvents ?? '(none)'}, no row in project.json.sessions[]`;
    case 'task':
      return `task: events have ${div.fromEvents ?? '(none)'}, memory has ${div.fromMemory ?? '(none)'}`;
    case 'events.replay_threw':
      return `events.replay_threw: ${div.note ?? 'reducer threw during replay'}`;
    case 'events.empty':
      return `events.empty: ${div.note ?? 'project.json row exists with no events'}`;
  }
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as MEMORY_CHECK_USAGE };
