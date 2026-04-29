/**
 * gobbi maintenance wipe-legacy-sessions — remove every session directory
 * under the legacy flat layout (`.gobbi/sessions/<id>`). The new
 * multi-project layout (`.gobbi/projects/<name>/sessions/...`) is NEVER
 * touched.
 *
 * ## Context (v0.5.0 Pass-2 W3.3 + PR-FIN-2a-i T-2a.1.5)
 *
 * The v0.5.0 Pass-2 redesign moved sessions into per-project subdirectories
 * and left the legacy flat layer behind as a compatibility hold-over. Once
 * the migration session finished, the operator runs this command ONCE to
 * reclaim the legacy directories.
 *
 * Until PR-FIN-2a-i this command guarded the wipe with a state-based
 * active-session check (`findStateActiveSessions` in
 * `lib/active-sessions.ts`). The JSON-pivot memory model landing in
 * PR-FIN-2a-ii drops per-session `gobbi.db` and `state.json` entirely, so
 * the "session is active" check has nothing left to read. We therefore
 * removed the guard outright in T-2a.1.5: the wipe is now an unconditional
 * `rm -rf .gobbi/sessions/<id>/` for every legacy directory.
 *
 * ## Scope boundary
 *
 *   - No hook integration. The command is run manually by the operator.
 *   - No recursive delete across the per-project layer — ever. That is
 *     owned by `gobbi project delete` (not yet implemented).
 *   - No migration logic. Sessions are not MOVED to the new layout here.
 *   - No active-session guard. Operators run this knowingly; the JSON
 *     pivot retires the per-session state files the guard depended on.
 *
 * ## Exit codes
 *
 *   - `0` — wipe completed (or dry-run preview printed).
 *   - `2` — argument parse error.
 *
 * @see `commands/gotcha/promote.ts` — sibling command (also dropped its
 *      active-session guard in T-2a.1.5)
 */

import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import { workspaceRoot } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi maintenance wipe-legacy-sessions [options]

Delete every session directory under the legacy flat layout
(.gobbi/sessions/<id>). The new multi-project layout
(.gobbi/projects/<name>/sessions/...) is NEVER touched by this command.

Options:
  --dry-run     Print the planned deletions; write nothing, delete nothing
  --help, -h    Show this help message`;

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

  // --- 3. Enumerate every legacy session directory ----------------------
  const legacy = listLegacySessions(repoRoot);

  // --- 4. Execute (or print) --------------------------------------------
  const wiped = legacy.length;

  if (dryRun) {
    for (const dir of legacy) {
      process.stdout.write(`Would wipe: ${dir}\n`);
    }
    process.stdout.write(renderSummary({ wiped, dryRun: true }));
    return;
  }

  for (const dir of legacy) {
    process.stdout.write(`Wiping: ${dir}\n`);
    rmSync(dir, { recursive: true, force: true });
  }
  process.stdout.write(renderSummary({ wiped, dryRun: false }));
}

// ---------------------------------------------------------------------------
// Legacy-session enumeration
// ---------------------------------------------------------------------------

/**
 * Walk `.gobbi/sessions/` and return every directory entry inside it. A
 * missing legacy root degrades silently to `[]` so a fresh workspace runs
 * through to the zero-wiped summary.
 */
function listLegacySessions(repoRoot: string): readonly string[] {
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
// Rendering
// ---------------------------------------------------------------------------

/**
 * Render the one-line summary of the wipe result. Kept as a helper so the
 * string is testable without executing `rmSync`.
 */
export function renderSummary(opts: {
  readonly wiped: number;
  readonly dryRun: boolean;
}): string {
  const prefix = opts.dryRun ? '[dry-run] ' : '';
  return `${prefix}${opts.wiped} session${
    opts.wiped === 1 ? '' : 's'
  } wiped\n`;
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as WIPE_LEGACY_USAGE };
