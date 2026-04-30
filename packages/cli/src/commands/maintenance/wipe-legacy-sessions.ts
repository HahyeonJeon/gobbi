/**
 * gobbi maintenance wipe-legacy-sessions — remove legacy on-disk session
 * residue from BOTH layouts:
 *
 *   1. The pre-Pass-2 flat layout `.gobbi/sessions/<sessionId>/` — the
 *      ENTIRE directory is wiped (whole-tree `rm -rf`). The flat layout
 *      preserves nothing post-pivot.
 *
 *   2. The per-project layout
 *      `.gobbi/projects/<projectName>/sessions/<sessionId>/` — only the
 *      five PRE-PIVOT artifacts (gobbi.db, state.json, state.json.backup,
 *      metadata.json, artifacts/) are wiped. session.json and per-step
 *      subdirectories are preserved.
 *
 * The new multi-project layout's CURRENT-shape sessions (those with a
 * `session.json` file) are never touched: presence of `session.json`
 * marks a session as post-pivot and out of scope for this command.
 *
 * ## Context (v0.5.0 Pass-2 W3.3 + PR-FIN-2a-i T-2a.1.5 + PR-FIN-2a-ii T-2a.10)
 *
 * The v0.5.0 Pass-2 redesign moved sessions into per-project subdirectories
 * and left the legacy flat layer behind as a compatibility hold-over.
 *
 * PR-FIN-2a-i T-2a.1.5 dropped the active-session guard for the flat
 * layer because the JSON-pivot drops `state.json` entirely — there is
 * nothing left for the guard to read.
 *
 * PR-FIN-2a-ii T-2a.10 extends the command to ALSO sweep the per-project
 * layout: pre-pivot per-project sessions still hold the same five legacy
 * artifacts that the flat layer did, plus a session.json (or per-step
 * subdir) we must preserve. To prevent reaping a session whose workflow
 * is still in flight, the per-project sweep gates each candidate behind
 * a workspace `state.db` probe — a session with appended events but no
 * terminal `workflow.finish` / `workflow.abort` event is treated as
 * active and skipped.
 *
 * ## Scope boundary
 *
 *   - No hook integration. The command is run manually by the operator.
 *   - No directory deletion under `.gobbi/projects/<name>/sessions/<id>/`
 *     — only the per-artifact removal listed above. `session.json` and
 *     per-step subdirs (`ideation/`, `planning/`, `execution/`,
 *     `memorization/`) are preserved.
 *   - No migration logic. Sessions are not MOVED to the new layout here.
 *
 * ## Exit codes
 *
 *   - `0` — wipe completed (or dry-run preview printed).
 *   - `2` — argument parse error.
 *
 * @see `commands/gotcha/promote.ts` — sibling command (also dropped its
 *      active-session guard in T-2a.1.5)
 */

import { Database } from 'bun:sqlite';
import {
  existsSync,
  readdirSync,
  rmSync,
  statSync,
  unlinkSync,
} from 'node:fs';
import { basename, join } from 'node:path';
import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import {
  projectsRoot,
  sessionsRoot,
  workspaceRoot,
} from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi maintenance wipe-legacy-sessions [options]

Delete legacy session residue from both layouts:

  - Flat layout (.gobbi/sessions/<sessionId>/) — the whole directory is
    wiped.

  - Per-project layout (.gobbi/projects/<projectName>/sessions/<sessionId>/)
    — only the five pre-pivot artifacts (gobbi.db, state.json,
    state.json.backup, metadata.json, artifacts/) are wiped. session.json
    and per-step subdirs are preserved. Sessions with appended events but
    no workflow.finish / workflow.abort terminal event are skipped.

The new layout's current-shape sessions (those with session.json) are
never wiped.

Options:
  --dry-run     Print the planned deletions; write nothing, delete nothing
  --help, -h    Show this help message`;

// ---------------------------------------------------------------------------
// Legacy artifact constants
// ---------------------------------------------------------------------------

/**
 * The five pre-pivot artifacts that the per-project sweep removes. Order
 * is the deletion order: file artifacts first, the `artifacts/` directory
 * last so a partially-completed wipe leaves the most-bytes-recovered state.
 *
 * Sourced from PR-FIN-2a-ii ideation lock 40: `gobbi.db, state.json,
 * state.json.backup, metadata.json, artifacts/`.
 */
const LEGACY_ARTIFACTS = [
  'gobbi.db',
  'state.json',
  'state.json.backup',
  'metadata.json',
  'artifacts',
] as const;

/**
 * The "current-shape" marker file. A per-project session directory that
 * contains `session.json` is post-pivot and out of scope for this
 * command — neither the legacy artifacts (if somehow present alongside)
 * nor the directory itself is touched.
 */
const SESSION_JSON = 'session.json';

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/**
 * Test-time overrides. Production callers pass `{}`; tests thread a
 * scratch repo root through `repoRoot` to avoid touching real `.gobbi/`.
 */
export interface WipeLegacyOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runWipeLegacySessions(args: string[]): Promise<void> {
  await runWipeLegacySessionsWithOptions(args, {});
}

export async function runWipeLegacySessionsWithOptions(
  args: string[],
  overrides: WipeLegacyOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // --- 1. Parse flags ----------------------------------------------------
  let dryRun = false;
  try {
    const { values } = parseArgs({
      args,
      allowPositionals: false,
      options: {
        'dry-run': { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    dryRun = values['dry-run'] === true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `gobbi maintenance wipe-legacy-sessions: ${message}\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  // --- 2. Resolve repo root ---------------------------------------------
  const repoRoot = overrides.repoRoot ?? getRepoRoot();

  // --- 3. Enumerate legacy targets --------------------------------------
  const flatSessions = listFlatLegacySessions(repoRoot);
  const stateDbPath = join(workspaceRoot(repoRoot), 'state.db');
  const perProjectArtifacts = listPerProjectLegacyArtifacts(
    repoRoot,
    stateDbPath,
  );

  // --- 4. Execute (or print) --------------------------------------------
  if (dryRun) {
    for (const dir of flatSessions) {
      process.stdout.write(`Would wipe: ${dir}\n`);
    }
    for (const artifact of perProjectArtifacts) {
      process.stdout.write(`Would remove legacy artifact: ${artifact}\n`);
    }
    process.stdout.write(
      renderSummary({
        wiped: flatSessions.length,
        artifactsWiped: perProjectArtifacts.length,
        dryRun: true,
      }),
    );
    return;
  }

  for (const dir of flatSessions) {
    process.stdout.write(`Wiping: ${dir}\n`);
    rmSync(dir, { recursive: true, force: true });
  }
  for (const artifact of perProjectArtifacts) {
    process.stdout.write(`Removing legacy artifact: ${artifact}\n`);
    removeArtifact(artifact);
  }
  process.stdout.write(
    renderSummary({
      wiped: flatSessions.length,
      artifactsWiped: perProjectArtifacts.length,
      dryRun: false,
    }),
  );
}

// ---------------------------------------------------------------------------
// Legacy-session enumeration — flat layout
// ---------------------------------------------------------------------------

/**
 * Walk `.gobbi/sessions/` and return every directory entry inside it. A
 * missing legacy root degrades silently to `[]` so a fresh workspace runs
 * through to the zero-wiped summary.
 */
function listFlatLegacySessions(repoRoot: string): readonly string[] {
  const legacyRoot = join(workspaceRoot(repoRoot), 'sessions');
  if (!existsSync(legacyRoot)) return [];

  let ids: string[];
  try {
    ids = readdirSync(legacyRoot);
  } catch {
    return [];
  }

  const out: string[] = [];
  for (const id of ids) {
    const sessionDir = join(legacyRoot, id);
    try {
      if (!statSync(sessionDir).isDirectory()) continue;
    } catch {
      continue;
    }
    out.push(sessionDir);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Legacy-artifact enumeration — per-project layout
// ---------------------------------------------------------------------------

/**
 * Predicate — `sessionDir` is a per-project legacy session iff:
 *
 *   1. At least one of the five pre-pivot artifacts (gobbi.db, state.json,
 *      state.json.backup, metadata.json, artifacts/) exists inside it.
 *   2. `session.json` does NOT exist inside it. The new shape uses
 *      session.json as the sole on-disk session marker; any directory
 *      that already has session.json is post-pivot and out of scope —
 *      even if a stray legacy artifact happens to coexist (e.g. an
 *      incomplete prior wipe). This is intentional: post-pivot sessions
 *      are owned by the JSON memory model, not by this reaper.
 *
 * Returns `false` (no eligible artifacts) for any other shape. Stat
 * failures on individual artifacts are treated as "not present" — a
 * permission-denied probe must not promote a directory to legacy status.
 */
export function isLegacyPerProjectSession(sessionDir: string): boolean {
  if (existsSync(join(sessionDir, SESSION_JSON))) return false;
  return LEGACY_ARTIFACTS.some((artifact) =>
    existsSync(join(sessionDir, artifact)),
  );
}

/**
 * Walk every project under `.gobbi/projects/` and return the absolute
 * paths of all per-project legacy artifacts that should be reaped. The
 * resulting list contains one entry per artifact (not per session) so
 * the dry-run preview shows the operator exactly what the deletion plan
 * touches.
 *
 * For each per-project session that {@link isLegacyPerProjectSession}
 * accepts, the active-session probe runs against `state.db` — sessions
 * with appended events but no terminal `workflow.finish` /
 * `workflow.abort` event are skipped (a stderr line records the skip).
 *
 * Order: files first (`gobbi.db, state.json, state.json.backup,
 * metadata.json`) then `artifacts/` last. Operators reading the dry-run
 * see the safest-first ordering.
 */
function listPerProjectLegacyArtifacts(
  repoRoot: string,
  stateDbPath: string,
): readonly string[] {
  const root = projectsRoot(repoRoot);
  if (!existsSync(root)) return [];

  let projectNames: string[];
  try {
    projectNames = readdirSync(root);
  } catch {
    return [];
  }

  const out: string[] = [];
  for (const projectName of projectNames) {
    const sessionsDir = sessionsRoot(repoRoot, projectName);
    if (!existsSync(sessionsDir)) continue;

    let sessionIds: string[];
    try {
      sessionIds = readdirSync(sessionsDir);
    } catch {
      continue;
    }

    for (const sessionId of sessionIds) {
      const sessionDir = join(sessionsDir, sessionId);
      try {
        if (!statSync(sessionDir).isDirectory()) continue;
      } catch {
        continue;
      }

      if (!isLegacyPerProjectSession(sessionDir)) continue;

      // Active-session probe: skip sessions that have appended events
      // but no terminal event. The probe only runs once per candidate,
      // and only if state.db exists — fresh workspaces with no event
      // history can never have an active session, so a missing state.db
      // is treated as "no events, safe to wipe."
      if (isSessionActive(stateDbPath, projectName, sessionId)) {
        process.stderr.write(
          `Skipping active session: ${sessionDir}\n`,
        );
        continue;
      }

      for (const artifact of LEGACY_ARTIFACTS) {
        const artifactPath = join(sessionDir, artifact);
        if (existsSync(artifactPath)) {
          out.push(artifactPath);
        }
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Active-session probe
// ---------------------------------------------------------------------------

/**
 * Probe the workspace `state.db` for the partition `(projectId,
 * sessionId)`. Returns `true` iff at least one event row exists for the
 * partition AND none of those rows is a terminal `workflow.finish` /
 * `workflow.abort` event.
 *
 * The probe is read-only — it opens `state.db` with `{ readonly: true }`
 * and closes the handle in `finally`. A missing state.db, missing events
 * table, or any SQLite-level error is treated as "no events" and the
 * caller proceeds with the wipe — fresh workspaces with no event history
 * cannot have an active session.
 *
 * The semantics match T-2a.10's brief:
 *
 *   - 0 rows for the partition  → not active (fresh / never appended).
 *   - n>0 rows AND ≥1 terminal  → not active (workflow finished cleanly).
 *   - n>0 rows AND 0 terminal   → ACTIVE, skip.
 */
function isSessionActive(
  stateDbPath: string,
  projectId: string,
  sessionId: string,
): boolean {
  if (!existsSync(stateDbPath)) return false;

  let db: Database;
  try {
    db = new Database(stateDbPath, { readonly: true });
  } catch {
    return false;
  }
  try {
    interface CountRow {
      readonly cnt: number;
    }
    type Bindings = [string, string];
    let totalRow: CountRow | null;
    let terminalRow: CountRow | null;
    try {
      totalRow = db
        .query<CountRow, Bindings>(
          `SELECT count(*) AS cnt FROM events
           WHERE session_id = ?1 AND project_id = ?2`,
        )
        .get(sessionId, projectId);
      terminalRow = db
        .query<CountRow, Bindings>(
          `SELECT count(*) AS cnt FROM events
           WHERE session_id = ?1 AND project_id = ?2
             AND type IN ('workflow.finish', 'workflow.abort')`,
        )
        .get(sessionId, projectId);
    } catch {
      // Missing events table on a fresh / partially-migrated state.db —
      // treat as no events, safe to wipe.
      return false;
    }
    const total = totalRow?.cnt ?? 0;
    const terminal = terminalRow?.cnt ?? 0;
    return total > 0 && terminal === 0;
  } finally {
    db.close();
  }
}

// ---------------------------------------------------------------------------
// Per-artifact removal
// ---------------------------------------------------------------------------

/**
 * Remove a single legacy artifact at `path`. Files use `unlinkSync`;
 * directories (only `artifacts/` should reach this branch) use
 * `rmSync({recursive,force})`. Stat failures are tolerated — a vanished
 * artifact is treated as already-removed.
 */
function removeArtifact(path: string): void {
  let isDir: boolean;
  try {
    isDir = statSync(path).isDirectory();
  } catch {
    return;
  }
  if (isDir) {
    rmSync(path, { recursive: true, force: true });
  } else {
    try {
      unlinkSync(path);
    } catch {
      // Treat already-removed as success.
    }
  }
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/**
 * Render the summary line.
 *
 *   - When both counts are zero, the summary is `"0 sessions wiped"` for
 *     backwards-compat with the pre-T-2a.10 single-counter shape.
 *   - When `artifactsWiped > 0` (per-project sweep ran), the summary
 *     becomes `"N flat-layout sessions + M legacy artifacts wiped"`.
 *   - Otherwise the legacy single-counter form is used so existing
 *     workflows (and operator muscle memory) keep working.
 */
export function renderSummary(opts: {
  readonly wiped: number;
  readonly artifactsWiped?: number;
  readonly dryRun: boolean;
}): string {
  const prefix = opts.dryRun ? '[dry-run] ' : '';
  const artifacts = opts.artifactsWiped ?? 0;
  if (artifacts > 0) {
    const sessionsWord = opts.wiped === 1 ? 'session' : 'sessions';
    const artifactsWord = artifacts === 1 ? 'artifact' : 'artifacts';
    return `${prefix}${opts.wiped} flat-layout ${sessionsWord} + ${artifacts} legacy ${artifactsWord} wiped\n`;
  }
  return `${prefix}${opts.wiped} session${
    opts.wiped === 1 ? '' : 's'
  } wiped\n`;
}

// ---------------------------------------------------------------------------
// Test-only re-exports
// ---------------------------------------------------------------------------

// Surface `basename` so tests can demonstrate the projectId/sessionId
// derivation matches `path.basename` semantics. (The decision in T-2a.10
// derives projectId from the per-project directory name and sessionId
// from `basename(sessionDir)`.)
export const _internal = {
  basename,
  LEGACY_ARTIFACTS,
  SESSION_JSON,
} as const;

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as WIPE_LEGACY_USAGE };
