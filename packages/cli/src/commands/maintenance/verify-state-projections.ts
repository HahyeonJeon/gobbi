/**
 * gobbi maintenance verify-state-projections — diff event-derived state
 * against the `project.json` handoff projection per session.
 *
 * ## Context (v0.5.0 PR-CFM-C — issue #201)
 *
 * After PR-FIN-2a-ii's JSON memory pivot the cross-session memory lives in
 * `.gobbi/projects/<projectName>/project.json`. The same workflow events
 * that drive the per-session `gobbi.db` also feed the workspace
 * `.gobbi/state.db` event store; the two sources MUST agree on the
 * "session is finished" invariant by the time `workflow.finish` lands.
 * This command surfaces drift as operator-actionable divergences.
 *
 * Mirrors the pure-core / argv-shell shape of
 * {@link runMigrateStateDb} in `migrate-state-db.ts`:
 *
 *   - `runVerifyStateProjections(args)` — argv shell with `process.exit`.
 *   - `runVerifyStateProjectionsWithOptions(args, overrides)` — test seam.
 *   - `verifyStateProjectionsAt(stateDbPath, projectJsonPath, reduceFn, now?)`
 *     — pure-core helper.
 *
 * ## Library boundary
 *
 * The actual divergence detection lives in
 * `packages/cli/src/lib/memory-projection-diff.ts` — a pure library shared
 * with future PR-B `gobbi memory check`. This command is a thin shell:
 *
 *   1. Resolve `state.db` path (default `<repoRoot>/.gobbi/state.db`).
 *   2. Resolve `project.json` path (default
 *      `<repoRoot>/.gobbi/projects/<projectName>/project.json`).
 *   3. Open a `ReadStore` against the state.db.
 *   4. Read project.json (or `null` when absent — operator error).
 *   5. Call `memoryProjectionDiff()` with the production reducer.
 *   6. Render pretty or `--json` output; exit 0 on no-divergences, 1 on
 *      any divergence (or on missing files), 2 on parseArgs failure.
 *
 * ## Pre-pivot legacy session caveat
 *
 * Sessions that predate the JSON memory pivot (PR-FIN-2a-ii) may have
 * events but no `project.json` row. They surface as `row-missing`
 * divergences on first run. Solo-user accepts the noise per
 * engineering-merit policy; the caveat is surfaced in the USAGE text and
 * the PR description, not via a `--ignore-pre-pivot` flag.
 *
 * ## Exit codes
 *
 *   - `0` — verify ran AND zero divergences.
 *   - `1` — verify ran AND ≥ 1 divergence (operator-action signal). Also:
 *           `DB_MISSING` or `PROJECT_MISSING`. The `--json` envelope's
 *           `code` field discriminates the missing-file case.
 *   - `2` — `parseArgs` rejected (`PARSE_ARGS`).
 *
 * ## Output
 *
 * Pretty form (default):
 *
 *     gobbi maintenance verify-state-projections
 *     state.db:    /repo/.gobbi/state.db
 *     project.json: /repo/.gobbi/projects/gobbi/project.json
 *     sessions checked: 17
 *     divergences: 2
 *       - 6f9a3c2e-... finishedAt: events have workflow.finish at ..., row finishedAt is null
 *       - 8b1d9e0f-... row-missing: events have workflow.finish, no row in project.json.sessions[]
 *     elapsed: 12 ms
 *
 * Structured form (`--json`):
 *
 *     {"stateDbPath":"...","projectJsonPath":"...","sessionsChecked":17,
 *      "divergences":[...],"elapsedMs":12}
 *
 * Error envelope (`--json` failure path):
 *
 *     {"status":"error","code":"PROJECT_MISSING","message":"...","path":"..."}
 *
 * @see `packages/cli/src/lib/memory-projection-diff.ts` — pure library
 *      that implements the divergence detection.
 * @see `packages/cli/src/commands/maintenance/migrate-state-db.ts` —
 *      sibling command (pure-core/argv-shell pattern mirror).
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

const USAGE = `Usage: gobbi maintenance verify-state-projections [options]

Diff event-derived state against the project.json handoff projection per
session. Exits 0 when both sources agree, 1 on any divergence (or when a
required file is missing), 2 on argv parse error.

Note: sessions predating the JSON memory pivot may appear as row-missing; this is expected.

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
export interface VerifyStateProjectionsOverrides {
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
 * {@link verifyStateProjectionsAt} so tests can assert without parsing
 * stdout. Matches the contract documented in PR-CFM-C ideation §5.
 */
export interface VerifyStateProjectionsResult {
  readonly stateDbPath: string;
  readonly projectJsonPath: string | null;
  readonly divergences: readonly MemoryDivergence[];
  readonly sessionsChecked: number;
  readonly elapsedMs: number;
}

/**
 * Stable error code surface for the `--json` failure path. Mirrors the
 * deliberately-narrow set used by `migrate-state-db.ts` so consumers
 * piping to `jq` get the same discriminator shape across maintenance
 * commands.
 *
 *   - `DB_MISSING`      — pre-flight `existsSync` returned false for the
 *                         resolved state.db path.
 *   - `PROJECT_MISSING` — pre-flight `existsSync` returned false for the
 *                         resolved project.json path.
 *   - `PARSE_ARGS`      — `parseArgs` rejected the supplied flags. Maps to
 *                         exit code 2 (argv error) rather than 1.
 */
export type VerifyStateProjectionsErrorCode =
  | 'DB_MISSING'
  | 'PROJECT_MISSING'
  | 'PARSE_ARGS';

/**
 * Structured error envelope emitted on stderr under `--json` when the
 * command fails. `path` carries the resolved target when known at the
 * failure point — absent on `PARSE_ARGS` (argv parsing fires before path
 * resolution).
 */
export interface VerifyStateProjectionsErrorEnvelope {
  readonly status: 'error';
  readonly code: VerifyStateProjectionsErrorCode;
  readonly message: string;
  readonly path?: string;
}

/**
 * Emit an error to stderr in the shape demanded by `jsonFlag`. Pretty
 * form preserves the conventional `gobbi maintenance verify-state-projections:
 * <message>` shape; JSON form emits a single-line structured envelope.
 */
function writeErrorEnvelope(
  jsonFlag: boolean,
  code: VerifyStateProjectionsErrorCode,
  message: string,
  targetPath: string | undefined,
): void {
  if (jsonFlag) {
    const envelope: VerifyStateProjectionsErrorEnvelope =
      targetPath !== undefined
        ? { status: 'error', code, message, path: targetPath }
        : { status: 'error', code, message };
    process.stderr.write(`${JSON.stringify(envelope)}\n`);
    return;
  }
  process.stderr.write(
    `gobbi maintenance verify-state-projections: ${message}\n`,
  );
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runVerifyStateProjections(args: string[]): Promise<void> {
  await runVerifyStateProjectionsWithOptions(args, {});
}

export async function runVerifyStateProjectionsWithOptions(
  args: string[],
  overrides: VerifyStateProjectionsOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // Detect `--json` ahead of `parseArgs` so the failure-path envelope is
  // available even when argv parsing itself throws. Mirrors
  // `migrate-state-db.ts` precedent.
  const jsonFlag =
    args.includes('--json') || args.some((a) => a.startsWith('--json='));

  // --- 1. Parse flags ----------------------------------------------------
  let dbFlag: string | undefined;
  let projectFlag: string | undefined;
  let projectNameFlag: string | undefined;
  try {
    const { values } = parseArgs({
      args,
      allowPositionals: false,
      options: {
        db: { type: 'string' },
        project: { type: 'string' },
        'project-name': { type: 'string' },
        json: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
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

  // --- 4. Run verification ----------------------------------------------
  const reduceFn = overrides.reduceFn ?? reduce;
  const result = verifyStateProjectionsAt(
    stateDbPath,
    projectJsonPath,
    reduceFn,
    overrides.now,
  );

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
 * Open `stateDbPath`, read `projectJsonPath` (or treat as `null`), and
 * call {@link memoryProjectionDiff} with the supplied reducer. Returns
 * the structured result; the caller handles exit-code mapping and
 * rendering.
 *
 * The function is exported for tests so they can assert the result
 * shape without re-running the argv parsing path. Production callers go
 * through {@link runVerifyStateProjectionsWithOptions}.
 *
 * `now` defaults to `Date.now`; tests pass a fixed clock so the
 * `elapsedMs` measurement is deterministic in JSON snapshots.
 *
 * Note: passes `stateDbPath: string` (not a constructed `EventStore`)
 * so the signature matches the post-#199 dominant pattern in sister
 * helpers — the function-takes-a-string convention. Internally opens a
 * cross-partition `ReadStore` for the duration of the diff (the
 * production `EventStore` is partition-bound; verification needs to walk
 * EVERY session in the workspace state.db) and closes it before return.
 */
export function verifyStateProjectionsAt(
  stateDbPath: string,
  projectJsonPath: string | null,
  reduceFn: ReduceFn,
  now?: () => number,
): VerifyStateProjectionsResult {
  const memory =
    projectJsonPath === null ? null : readProjectJson(projectJsonPath);

  const store = new WorkspaceReadStore(stateDbPath);
  try {
    const args =
      now !== undefined
        ? { store, memory, reduceFn, now }
        : { store, memory, reduceFn };
    const result = memoryProjectionDiff(args);
    return {
      stateDbPath,
      projectJsonPath,
      divergences: result.divergences,
      sessionsChecked: result.sessionsChecked,
      elapsedMs: result.elapsedMs,
    };
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Format a {@link VerifyStateProjectionsResult} for terminal output.
 * Mirrors `migrate-state-db.ts::renderPretty` shape: header line, then a
 * sequence of `key: value` lines, one trailing newline.
 *
 * Each divergence renders as a bulleted line with the `sessionId`,
 * `field`, and a witness phrase derived from `fromEvents` / `fromMemory`
 * / `note`. A sessionId truncation does NOT happen — operators need the
 * full id to grep events with.
 */
export function renderPretty(result: VerifyStateProjectionsResult): string {
  const lines: string[] = [
    'gobbi maintenance verify-state-projections',
    `state.db:    ${result.stateDbPath}`,
    `project.json: ${result.projectJsonPath ?? '(none)'}`,
    `sessions checked: ${result.sessionsChecked}`,
    `divergences: ${result.divergences.length}`,
  ];
  for (const div of result.divergences) {
    lines.push(`  - ${div.sessionId} ${renderDivergence(div)}`);
  }
  lines.push(`elapsed: ${result.elapsedMs} ms`);
  lines.push('');
  return lines.join('\n');
}

/**
 * Render a single divergence as a human-readable phrase. The shape
 * follows the example in PR-CFM-C ideation §5:
 *
 *   - `finishedAt: events have workflow.finish at <ts>, row finishedAt is null`
 *   - `row-missing: events have workflow.finish, no row in project.json.sessions[]`
 *   - `task: events have <X>, memory has <Y>`
 *   - `events.replay_threw: <note>`
 *   - `events.empty: <note>`
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

export { USAGE as VERIFY_STATE_PROJECTIONS_USAGE };
