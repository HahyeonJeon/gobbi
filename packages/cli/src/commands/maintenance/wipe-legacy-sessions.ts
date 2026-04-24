/**
 * gobbi maintenance wipe-legacy-sessions — remove stale session
 * directories that live under the legacy flat layout
 * (`.gobbi/sessions/<id>`) while refusing to touch anything under the new
 * multi-project layout (`.gobbi/projects/<name>/sessions/<id>`).
 *
 * ## Context (v0.5.0 Pass-2 W3.3)
 *
 * The v0.5.0 Pass-2 redesign (see `.gobbi/sessions/35742566-.../plan`)
 * moves sessions into per-project subdirectories and leaves the legacy
 * flat layer behind as a compatibility hold-over while the in-flight
 * migration session keeps writing there. Once migration completes, the
 * operator runs this command ONCE to reclaim the legacy directories.
 *
 * The command is deliberately narrow:
 *
 *   1. It uses STATE-BASED detection (not heartbeat-based). A session is
 *      protected if its `state.json.currentStep` is anything other than
 *      `'done'` / `'error'`. See `lib/active-sessions.ts` for the
 *      detection semantics and the Arch F3 rationale for reading the
 *      step as a raw string.
 *   2. It NEVER touches `.gobbi/projects/*` content, even when an active
 *      session lives there. The per-project layer is the canonical home
 *      going forward; only the legacy flat layer is wiped.
 *   3. If any LEGACY session is active, the command refuses to run and
 *      exits 1. Active sessions in per-project layers do not block the
 *      wipe — the wipe only ever targets the legacy layer.
 *   4. `--dry-run` prints the plan and exits 0 without deleting anything.
 *
 * ## Scope boundary
 *
 *   - No hook integration. The command is run manually by the operator.
 *   - No recursive delete across the per-project layer — ever. That is
 *     owned by `gobbi project delete` (not yet implemented).
 *   - No migration logic. Sessions are not MOVED to the new layout here;
 *     the only operation is wiping the legacy dirs whose state is
 *     terminal.
 *
 * ## Exit codes
 *
 *   - `0` — wipe completed (or dry-run preview printed) with no active
 *           legacy sessions.
 *   - `1` — at least one legacy session is active; the command refused
 *           to delete anything.
 *   - `2` — argument parse error.
 *
 * @see `.gobbi/sessions/35742566-.../plan/plan.md` §W3.3
 * @see `.gobbi/sessions/35742566-.../plan/plan-remediation.md`
 *      §W3.3 wipe order vs W4 rename (Arch F3)
 * @see `lib/active-sessions.ts` — state-based detection helper
 * @see `commands/gotcha/promote.ts` — sibling command (heartbeat-based
 *      detection, different semantics)
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import {
  findStateActiveSessions,
  TERMINAL_CURRENT_STEPS,
  type StateActiveSession,
} from '../../lib/active-sessions.js';
import { isRecord, isString } from '../../lib/guards.js';
import { getRepoRoot } from '../../lib/repo.js';
import { workspaceRoot } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi maintenance wipe-legacy-sessions [options]

Delete every session directory under the legacy flat layout
(.gobbi/sessions/<id>) whose state.json.currentStep is terminal
('done' or 'error'). Refuses to run if ANY legacy session is still
active, so the operator is never asked to choose between protecting
live work and reclaiming disk.

The new multi-project layout (.gobbi/projects/<name>/sessions/...) is
NEVER touched by this command.

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

  // --- 3. Run state-based detection across both layers ------------------
  const actives = findStateActiveSessions(repoRoot);

  // Partition by layer: only legacy-flat (projectName === null) entries
  // block the wipe. Active sessions in the new layer are irrelevant here
  // because we never touch them.
  const activeLegacy: StateActiveSession[] = [];
  for (const s of actives) {
    if (s.projectName === null) activeLegacy.push(s);
  }

  // --- 4. Refuse when any legacy session is active ----------------------
  if (activeLegacy.length > 0) {
    process.stderr.write(renderActiveLegacyError(activeLegacy));
    process.exit(1);
  }

  // --- 5. Enumerate INACTIVE legacy sessions to wipe --------------------
  //
  // `findStateActiveSessions` returns only the ACTIVE set; the wipe set is
  // its complement (restricted to the legacy layer). Rather than scan the
  // disk a second time with different semantics, delegate to a dedicated
  // helper that walks the same directory and filters the other way. This
  // keeps the "what's on disk" source of truth in one place and makes the
  // inverse relationship obvious.
  const inactiveLegacy = listInactiveLegacySessions(repoRoot);

  // --- 6. Execute (or print) --------------------------------------------
  const wiped = inactiveLegacy.length;
  const protectedCount = 0; // by construction — else we'd have exited above

  if (dryRun) {
    for (const s of inactiveLegacy) {
      process.stdout.write(
        `Would wipe: ${s.sessionDir} (currentStep: ${s.currentStep ?? 'done'})\n`,
      );
    }
    process.stdout.write(
      renderSummary({ wiped, protectedCount, dryRun: true }),
    );
    return;
  }

  for (const s of inactiveLegacy) {
    process.stdout.write(`Wiping: ${s.sessionDir}\n`);
    rmSync(s.sessionDir, { recursive: true, force: true });
  }
  process.stdout.write(
    renderSummary({ wiped, protectedCount, dryRun: false }),
  );
}

// ---------------------------------------------------------------------------
// Inactive-session enumeration (complement of findStateActiveSessions
// restricted to the legacy layer)
// ---------------------------------------------------------------------------

/**
 * One legacy-layer session earmarked for deletion by the wipe command.
 * Mirrors the active-session shape but carries only the fields the
 * command needs for rendering.
 */
interface InactiveLegacySession {
  readonly sessionId: string;
  readonly sessionDir: string;
  readonly currentStep: string | null;
}

/**
 * Walk `.gobbi/sessions/` and return every session whose
 * `state.json.currentStep` IS in {@link TERMINAL_CURRENT_STEPS}. The
 * complement of `findStateActiveSessions` restricted to the legacy layer.
 *
 * Sessions with missing / malformed state.json are excluded (they are
 * active under our conservative rule and should already have aborted the
 * caller via the guard above).
 */
function listInactiveLegacySessions(
  repoRoot: string,
): readonly InactiveLegacySession[] {
  const legacyRoot = join(workspaceRoot(repoRoot), 'sessions');
  if (!existsSync(legacyRoot)) return [];

  let ids: string[];
  try {
    ids = readdirSync(legacyRoot);
  } catch {
    return [];
  }

  const out: InactiveLegacySession[] = [];
  for (const id of ids) {
    const sessionDir = join(legacyRoot, id);
    try {
      if (!statSync(sessionDir).isDirectory()) continue;
    } catch {
      continue;
    }

    const statePath = join(sessionDir, 'state.json');
    if (!existsSync(statePath)) continue; // unreadable → treat as active

    let raw: string;
    try {
      raw = readFileSync(statePath, 'utf8');
    } catch {
      continue;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }

    if (!isRecord(parsed)) continue;
    const step = parsed['currentStep'];
    if (!isString(step)) continue;

    if (TERMINAL_CURRENT_STEPS.has(step)) {
      out.push({ sessionId: id, sessionDir, currentStep: step });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

export function renderActiveLegacyError(
  actives: readonly StateActiveSession[],
): string {
  const lines: string[] = [];
  lines.push(
    'error: Cannot wipe legacy sessions while one or more are active.',
  );
  for (const s of actives) {
    const step = s.currentStep ?? '(missing or malformed state.json)';
    lines.push(`       Active legacy session: ${s.sessionId}`);
    lines.push(`       currentStep: ${step}`);
    lines.push(`       path: ${s.sessionDir}`);
  }
  lines.push('');
  lines.push('Options:');
  lines.push(
    "  1. Finish the session first:  gobbi workflow transition FINISH",
  );
  lines.push(
    "  2. Abort and discard:          gobbi workflow transition ABORT",
  );
  lines.push('');
  return lines.join('\n');
}

/**
 * Render the one-line summary of the wipe result. Kept as a helper so the
 * string is testable without executing `rmSync`.
 */
export function renderSummary(opts: {
  readonly wiped: number;
  readonly protectedCount: number;
  readonly dryRun: boolean;
}): string {
  const prefix = opts.dryRun ? '[dry-run] ' : '';
  return `${prefix}${opts.wiped} session${
    opts.wiped === 1 ? '' : 's'
  } wiped, ${opts.protectedCount} active session${
    opts.protectedCount === 1 ? '' : 's'
  } protected\n`;
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as WIPE_LEGACY_USAGE };
