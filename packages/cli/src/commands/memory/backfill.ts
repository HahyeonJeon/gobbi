/**
 * gobbi memory backfill — operator-facing crash-recovery for the JSON
 * memory subsystem's primary failure mode.
 *
 * ## Context (v0.5.0 PR-CFM-B — issue #236 part 2)
 *
 * After PR-FIN-2a-ii's JSON memory pivot the engine writes a populated
 * `session.json` at Memorization STEP_EXIT (see
 * `packages/cli/src/workflow/session-json-writer.ts:101-147`,
 * `engine.ts:306-322`). When a session crashes after the state.db events
 * land but before the writer fires, the on-disk shape is the 6-field
 * init-time stub with no `steps[]`, no `agents[]`, no rollups. This
 * command re-runs the SAME writer against the per-session event store to
 * materialise the populated shape from disk-resident events.
 *
 * ## Reuse, not parallel implementation (PR-CFM-B synthesis §4.2)
 *
 * The pure-core `backfillMemoryAt` is a thin shell around
 * {@link writeSessionJsonAtMemorizationExit}. Three pre-flights guard
 * the call (NO_STUB / ALREADY_POPULATED / NO_EVENTS); the writer itself
 * is consumed AS-IS. Bug fixes to the aggregator flow to both the engine
 * post-commit path and this operator path automatically — there is no
 * second source of truth.
 *
 * ## EventStore lifecycle (Architecture F10 lock)
 *
 * The per-session `EventStore` is opened against `<sessionDir>/gobbi.db`
 * (NOT `WorkspaceReadStore` — Architecture F-1 lock; `aggregateSessionJson`
 * already filters via `rowBelongsToSession`, and the per-session
 * constructor at `workflow/store.ts:369-370` derives `(sessionId, projectId)`
 * from the path). The store is closed in a `finally` block mirroring
 * `commands/maintenance/verify-state-projections.ts:357-373` — the writer
 * does not own lifecycle.
 *
 * ## --finished-at override
 *
 * The optional `--finished-at <ISO>` flag threads through to the writer.
 * Default omits and lets `aggregateSessionJson` infer `finishedAt` from
 * a `workflow.finish` (or `workflow.abort`) event's `ts` column. Operator
 * with archived events that lack a closing event can stamp explicitly.
 *
 * ## Exit codes
 *
 *   - `0` — backfill succeeded; `session.json` populated and
 *           `project.json.sessions[]` upserted.
 *   - `1` — pre-flight refusal (`BACKFILL_NO_STUB`,
 *           `BACKFILL_ALREADY_POPULATED`, `BACKFILL_NO_EVENTS`) OR
 *           writer failure (`BACKFILL_FAILED`). The `--json` envelope's
 *           `code` field discriminates.
 *   - `2` — `parseArgs` rejected (`PARSE_ARGS`).
 *
 * @see `packages/cli/src/workflow/session-json-writer.ts` — the writer
 *      this module reuses verbatim.
 * @see `packages/cli/src/lib/json-memory.ts` — `aggregateSessionJson`,
 *      `sessionJsonPath`, `readSessionJson`.
 * @see `commands/memory/check.ts` — sibling subcommand (memory inspection).
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import {
  projectJsonPath,
  readSessionJson,
  sessionJsonPath,
  type SessionJson,
} from '../../lib/json-memory.js';
import { getRepoRoot } from '../../lib/repo.js';
import { sessionDir as resolveSessionDir } from '../../lib/workspace-paths.js';
import { writeSessionJsonAtMemorizationExit } from '../../workflow/session-json-writer.js';
import { EventStore } from '../../workflow/store.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi memory backfill <session-id> [options]

Materialise session.json from state.db events for a session that crashed
mid-Memorization. Reuses the production memorization-exit writer; the
on-disk shape is byte-identical to a normal Memorization STEP_EXIT.

Three pre-flights guard the writer call:

  - BACKFILL_NO_STUB           — no init-time session.json on disk for
                                 the supplied session id.
  - BACKFILL_ALREADY_POPULATED — session.json already has steps[] (use
                                 --force to overwrite).
  - BACKFILL_NO_EVENTS         — per-session gobbi.db has zero events
                                 for the supplied session id.

Arguments:
  <session-id>            Session id to backfill (positional, required)

Options:
  --project-name <name>   Project name override (default: basename(repoRoot))
  --finished-at <ISO>     Override the aggregator's finishedAt inference.
                          Default: aggregator reads workflow.finish or
                          workflow.abort event ts from the per-session
                          gobbi.db.
  --force                 Overwrite an already-populated session.json
                          (bypasses BACKFILL_ALREADY_POPULATED).
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
export interface MemoryBackfillOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
  /**
   * Override `Date.now()` for the `elapsedMs` measurement. Tests pass a
   * monotonically-incrementing clock so `elapsedMs` is reproducible.
   */
  readonly now?: () => number;
}

// ---------------------------------------------------------------------------
// Result + error shapes
// ---------------------------------------------------------------------------

/**
 * Structured result returned from {@link backfillMemoryAt} and emitted
 * under `--json` on the success path. `wrote` is always `true` on a
 * successful backfill — the false case is the writer-returns-null branch
 * for a missing stub, which is reported via `BACKFILL_NO_STUB` before
 * the writer runs (so the success-path `false` is unreachable today; the
 * field is retained for forward-compat with future no-op backfill modes).
 */
export interface MemoryBackfillResult {
  readonly sessionDir: string;
  readonly sessionJsonPath: string;
  readonly projectJsonPath: string;
  readonly sessionId: string;
  readonly wrote: boolean;
  readonly elapsedMs: number;
}

/**
 * Stable error code surface for the `--json` failure path. Covers the
 * three pre-flight refusals plus the writer-throw and argv-parse arms.
 *
 *   - `BACKFILL_NO_STUB`           — no `session.json` stub on disk for
 *                                    the supplied session id.
 *   - `BACKFILL_ALREADY_POPULATED` — `session.json` has `steps[]`; use
 *                                    `--force` to overwrite.
 *   - `BACKFILL_NO_EVENTS`         — the per-session `gobbi.db` has no
 *                                    rows for the supplied session id.
 *   - `BACKFILL_FAILED`            — aggregator or writer threw. The
 *                                    underlying message is preserved on
 *                                    the envelope's `message` field.
 *   - `PARSE_ARGS`                 — `parseArgs` rejected the supplied
 *                                    flags. Maps to exit code 2.
 */
export type MemoryBackfillErrorCode =
  | 'BACKFILL_NO_STUB'
  | 'BACKFILL_ALREADY_POPULATED'
  | 'BACKFILL_NO_EVENTS'
  | 'BACKFILL_FAILED'
  | 'PARSE_ARGS';

/**
 * Structured error envelope emitted on stderr under `--json` when the
 * command fails. `path` carries the resolved target when known at the
 * failure point — absent on `PARSE_ARGS` (argv parsing fires before
 * path resolution) and on `BACKFILL_FAILED` (the failure surface is the
 * writer call, not a single path).
 */
export interface MemoryBackfillErrorEnvelope {
  readonly status: 'error';
  readonly code: MemoryBackfillErrorCode;
  readonly message: string;
  readonly path?: string;
}

/**
 * Emit an error to stderr in the shape demanded by `jsonFlag`. Pretty
 * form preserves the conventional `gobbi memory backfill: <message>`
 * shape; JSON form emits a single-line structured envelope.
 */
function writeErrorEnvelope(
  jsonFlag: boolean,
  code: MemoryBackfillErrorCode,
  message: string,
  targetPath: string | undefined,
): void {
  if (jsonFlag) {
    const envelope: MemoryBackfillErrorEnvelope =
      targetPath !== undefined
        ? { status: 'error', code, message, path: targetPath }
        : { status: 'error', code, message };
    process.stderr.write(`${JSON.stringify(envelope)}\n`);
    return;
  }
  process.stderr.write(`gobbi memory backfill: ${message}\n`);
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runMemoryBackfill(args: string[]): Promise<void> {
  await runMemoryBackfillWithOptions(args, {});
}

export async function runMemoryBackfillWithOptions(
  args: string[],
  overrides: MemoryBackfillOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // Detect `--json` ahead of `parseArgs` so the failure-path envelope is
  // available even when argv parsing itself throws. Mirrors the sibling
  // `commands/memory/check.ts` precedent.
  const jsonFlag =
    args.includes('--json') || args.some((a) => a.startsWith('--json='));

  // --- 1. Parse flags ----------------------------------------------------
  let sessionId: string | undefined;
  let projectNameFlag: string | undefined;
  let finishedAtFlag: string | undefined;
  let forceFlag = false;
  try {
    const { values, positionals } = parseArgs({
      args,
      allowPositionals: true,
      options: {
        'project-name': { type: 'string' },
        'finished-at': { type: 'string' },
        force: { type: 'boolean', default: false },
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
    projectNameFlag = values['project-name'];
    finishedAtFlag = values['finished-at'];
    forceFlag = values.force ?? false;
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
  const projectName = projectNameFlag ?? path.basename(repoRoot);
  const sessionDirPath = resolveSessionDir(repoRoot, projectName, sessionId);

  // --- 3. File-level pre-flights ----------------------------------------
  // The argv shell owns path-existence; pure-core owns content-existence.
  // Mirrors `check.ts:281-298` (DB_MISSING / PROJECT_MISSING file-level
  // pre-flights). Stub-missing precedes dbPath-missing — when both are
  // absent, BACKFILL_NO_STUB is the more diagnostic envelope (the
  // operator gets the per-session-dir-empty signal first).
  //
  // EventStore construction below would otherwise CREATE an empty
  // `gobbi.db`, so the dbPath check must precede the open call. The
  // pure-core re-checks stub-missing (race-safe defense-in-depth) and
  // throws `BackfillNoEventsError` on `eventCount() === 0` (content-level
  // check on the open store — partition-empty case).
  const stubPath = sessionJsonPath(repoRoot, projectName, sessionId);
  if (!existsSync(stubPath)) {
    writeErrorEnvelope(
      jsonFlag,
      'BACKFILL_NO_STUB',
      `session.json stub not found: ${stubPath}`,
      stubPath,
    );
    process.exit(1);
  }
  const dbPath = path.join(sessionDirPath, 'gobbi.db');
  if (!existsSync(dbPath)) {
    writeErrorEnvelope(
      jsonFlag,
      'BACKFILL_NO_EVENTS',
      `per-session gobbi.db not found: ${dbPath}`,
      dbPath,
    );
    process.exit(1);
  }

  // --- 4. Open store + delegate to pure-core ----------------------------
  // Mirrors `commands/memory/check.ts:303-322` — the argv shell opens the
  // resource, calls the pure-core inside `try`, and dispatches typed
  // errors onto `--json` envelope codes inside `catch`. The four typed
  // errors below are the bridge between the pure-core's throw arms and
  // the operator-facing exit-code mapping.
  const store = new EventStore(dbPath);
  let result: MemoryBackfillResult;
  try {
    try {
      result = await backfillMemoryAt(
        sessionDirPath,
        store,
        finishedAtFlag,
        forceFlag,
        overrides.now,
        repoRoot,
        projectName,
      );
    } catch (err) {
      if (err instanceof BackfillNoStubError) {
        writeErrorEnvelope(
          jsonFlag,
          'BACKFILL_NO_STUB',
          err.message,
          err.stubPath,
        );
        process.exit(1);
      }
      if (err instanceof BackfillAlreadyPopulatedError) {
        writeErrorEnvelope(
          jsonFlag,
          'BACKFILL_ALREADY_POPULATED',
          err.message,
          err.stubPath,
        );
        process.exit(1);
      }
      if (err instanceof BackfillNoEventsError) {
        writeErrorEnvelope(
          jsonFlag,
          'BACKFILL_NO_EVENTS',
          err.message,
          dbPath,
        );
        process.exit(1);
      }
      if (err instanceof BackfillFailedError) {
        writeErrorEnvelope(
          jsonFlag,
          'BACKFILL_FAILED',
          err.message,
          undefined,
        );
        process.exit(1);
      }
      throw err;
    }
  } finally {
    store.close();
  }

  // --- 5. Render --------------------------------------------------------
  if (jsonFlag) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else {
    process.stdout.write(renderPretty(result));
  }
}

// ---------------------------------------------------------------------------
// Backfill core (pure-ish — no argv, no process.exit, no stdout)
// ---------------------------------------------------------------------------

/**
 * Run the backfill writer against an already-open per-session
 * `EventStore`. Caller owns the store's lifecycle (open + close in a
 * `try/finally` per Architecture F10 lock). The function:
 *
 *   1. Verifies the init-time stub exists at
 *      `<sessionDir>/session.json` (else throws `BackfillNoStubError`).
 *   2. Verifies `steps[]` is absent OR `force` is true (else throws
 *      `BackfillAlreadyPopulatedError`).
 *   3. Verifies `store.eventCount() > 0` (else throws
 *      `BackfillNoEventsError`).
 *   4. Calls {@link writeSessionJsonAtMemorizationExit}; wraps any
 *      throw as `BackfillFailedError`.
 *
 * Returns the structured `MemoryBackfillResult` on success. The argv
 * shell maps each typed throw onto its `--json` envelope code.
 *
 * `repoRoot` and `projectName` are optional — argv-shell production
 * callers pass both (already in scope from path resolution) so the
 * canonical {@link projectJsonPath} helper resolves the project.json
 * path from typed inputs. Standalone-test callers can omit both; the
 * function falls back to deriving them from `sessionDirPath` via the
 * locked `<repoRoot>/.gobbi/projects/<projectName>/sessions/<sessionId>`
 * shape.
 *
 * Exported for tests so they can assert the result shape without
 * re-running the argv parsing path. Production callers go through
 * {@link runMemoryBackfillWithOptions}.
 */
export async function backfillMemoryAt(
  sessionDirPath: string,
  store: EventStore,
  finishedAt: string | undefined,
  force: boolean,
  now?: () => number,
  repoRoot?: string,
  projectName?: string,
): Promise<MemoryBackfillResult> {
  const clock = now ?? Date.now;
  const startedAt = clock();

  const stubPath = path.join(sessionDirPath, 'session.json');
  if (!existsSync(stubPath)) {
    throw new BackfillNoStubError(stubPath);
  }

  const stub = readSessionJson(stubPath);
  if (stub === null) {
    throw new BackfillNoStubError(stubPath);
  }
  if (isPopulated(stub) && !force) {
    throw new BackfillAlreadyPopulatedError(stubPath);
  }

  if (store.eventCount() === 0) {
    throw new BackfillNoEventsError(stub.sessionId);
  }

  let writtenStubPath: string | null;
  try {
    writtenStubPath = await writeSessionJsonAtMemorizationExit({
      sessionDir: sessionDirPath,
      store,
      ...(finishedAt !== undefined ? { finishedAt } : {}),
    });
  } catch (err) {
    throw new BackfillFailedError(
      err instanceof Error ? err.message : String(err),
      err,
    );
  }
  if (writtenStubPath === null) {
    throw new BackfillFailedError(
      `writer returned null despite pre-flight stub presence: ${stubPath}`,
    );
  }

  // Resolve project.json via the canonical `projectJsonPath` helper at
  // `lib/json-memory.ts:578-580`. Argv-shell callers pass `repoRoot` /
  // `projectName` directly (already in scope from path resolution); the
  // optional-arg fallback derives both from `sessionDirPath` for the
  // pure-core's standalone-test path. The session-dir shape is locked
  // at `<repoRoot>/.gobbi/projects/<projectName>/sessions/<sessionId>`
  // (see `lib/workspace-paths.ts::sessionDir`).
  // sessionDirPath = <repoRoot>/.gobbi/projects/<projectName>/sessions/<sessionId>
  //   dirname x1 = .../sessions
  //   dirname x2 = .../<projectName>      ← projectDir
  //   dirname x3 = .../projects
  //   dirname x4 = .../.gobbi
  //   dirname x5 = <repoRoot>
  const projectDirPath = path.dirname(path.dirname(sessionDirPath));
  const resolvedRepoRoot =
    repoRoot ?? path.dirname(path.dirname(path.dirname(projectDirPath)));
  const resolvedProjectName = projectName ?? path.basename(projectDirPath);
  const projectJson = projectJsonPath(resolvedRepoRoot, resolvedProjectName);

  return {
    sessionDir: sessionDirPath,
    sessionJsonPath: writtenStubPath,
    projectJsonPath: projectJson,
    sessionId: stub.sessionId,
    wrote: true,
    elapsedMs: Math.max(0, clock() - startedAt),
  };
}

/**
 * The init-time stub carries no `steps[]`; the populated shape stamps
 * the array (possibly empty when no STEP_EXIT events landed before the
 * crash, but the field is present). Reader convention "stub vs.
 * complete" lives at this single boundary.
 *
 * @see `packages/cli/src/lib/json-memory.ts:243-256` — SessionJson
 *      `steps?` field, lock 43 stub-vs-complete distinguishability.
 */
function isPopulated(stub: SessionJson): boolean {
  return Array.isArray(stub.steps);
}

// ---------------------------------------------------------------------------
// Typed errors — used by the pure-core; the argv shell maps these onto
// `--json` envelope codes via `writeErrorEnvelope`.
// ---------------------------------------------------------------------------

export class BackfillNoStubError extends Error {
  constructor(readonly stubPath: string) {
    super(`session.json stub not found: ${stubPath}`);
    this.name = 'BackfillNoStubError';
  }
}

export class BackfillAlreadyPopulatedError extends Error {
  constructor(readonly stubPath: string) {
    super(
      `session.json is already populated (steps present); pass --force to overwrite: ${stubPath}`,
    );
    this.name = 'BackfillAlreadyPopulatedError';
  }
}

export class BackfillNoEventsError extends Error {
  constructor(readonly sessionId: string) {
    super(
      `per-session gobbi.db has no events for session id: ${sessionId}`,
    );
    this.name = 'BackfillNoEventsError';
  }
}

export class BackfillFailedError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'BackfillFailedError';
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Format a {@link MemoryBackfillResult} for terminal output. Mirrors
 * `commands/memory/check.ts::renderPretty` shape: header line, then a
 * sequence of `key: value` lines, one trailing newline.
 */
export function renderPretty(result: MemoryBackfillResult): string {
  const lines: string[] = [
    'gobbi memory backfill',
    `session:      ${result.sessionId}`,
    `session.json: ${result.sessionJsonPath}`,
    `project.json: ${result.projectJsonPath}`,
    `wrote:        ${result.wrote ? 'yes' : 'no'}`,
    `elapsed:      ${result.elapsedMs} ms`,
    '',
  ];
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as MEMORY_BACKFILL_USAGE };
