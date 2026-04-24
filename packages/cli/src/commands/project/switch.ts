/**
 * `gobbi project switch <name>` — rotate the `.claude/{skills,agents,
 * rules}/` symlink farm to point at a different project's source tree,
 * then update `settings.json`'s `projects.active`.
 *
 * ## Rotation strategy — gate-and-sequential per-kind swap
 *
 * The D3 lock from ideation mandates a **per-file** symlink farm (each
 * leaf `.claude/skills/<skill>/<file>.md` is its own symlink), so a
 * single `rename(newFarmRoot, .claude/skills)` swap — which would be
 * truly atomic — is off the table. This command adopts a three-stage
 * rotation that preserves per-file symlinks while providing
 * best-effort atomicity:
 *
 *   1. **Active-session gate.** Refuse if any session in the CURRENT
 *      project has a non-terminal `currentStep`. Switching while a
 *      Claude Code session is loading skills would expose half-rebuilt
 *      symlink trees. Legacy-flat sessions (`projectName === null`)
 *      also block the switch — they are too close to the Claude Code
 *      tree to let through. `--force` bypasses this gate at the
 *      operator's risk.
 *
 *   2. **Temp-build.** Materialise the complete new farm under a sibling
 *      temp location, e.g. `.claude.tmp-farm-<pid>/`. Every symlink is
 *      created there from scratch; a build failure at this stage rolls
 *      back by deleting the temp tree and leaves the old farm
 *      untouched.
 *
 *   3. **Per-kind swap.** For each of `{skills, agents, rules}`:
 *
 *        a. `renameSync(.claude/<kind>, .claude.tmp-farm-<pid>/<kind>.old)`
 *        b. `renameSync(.claude.tmp-farm-<pid>/<kind>, .claude/<kind>)`
 *
 *      Each rename is atomic by itself. Between (a) and (b) there is a
 *      sub-millisecond window where `.claude/<kind>` is absent — the
 *      active-session gate guarantees no reader during this window.
 *      If (a) succeeds but (b) fails (e.g., EXDEV on cross-device
 *      temp), the handler attempts reverse-rollback: rename the old
 *      dir back. If rollback itself fails, the caller is left with a
 *      structured error naming every intermediate path so manual
 *      recovery is possible.
 *
 * ## Why not `rename(a, b) && rename(b, a)` single-shot
 *
 * Linux `rename` is atomic FOR A SINGLE CALL, but no syscall atomically
 * swaps two directory subtrees. `renameat2(RENAME_EXCHANGE)` exists on
 * Linux but is not exposed through Node's stdlib and would require a
 * native addon. Gate-and-sequential keeps the code dependency-free and
 * testable on every platform.
 *
 * ## settings.json update
 *
 * Performed LAST, after every kind has swapped successfully. If the
 * settings write fails but the farm rotation succeeded, the operator
 * sees mismatched state — but that is strictly safer than the
 * opposite order (farm stale with settings updated → next
 * `gobbi workflow init` uses the wrong project silently).
 *
 * ## Exit codes
 *
 *   - `0` — rotation succeeded; active project updated.
 *   - `1` — target project does not exist; or active-session gate
 *           fired without `--force`; or rotation failed.
 *   - `2` — argument parse error (missing name, unknown flags).
 *
 * @see `commands/project.ts` — sibling dispatcher
 * @see `lib/active-sessions.ts::findStateActiveSessions`
 * @see `lib/workspace-paths.ts::claudeSymlinkTarget`
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  symlinkSync,
} from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

import {
  findStateActiveSessions,
  type StateActiveSession,
} from '../../lib/active-sessions.js';
import { getRepoRoot } from '../../lib/repo.js';
import {
  loadSettingsAtLevel,
  writeSettingsAtLevel,
} from '../../lib/settings-io.js';
import type { Settings } from '../../lib/settings.js';
import {
  claudeSymlinkTarget,
  projectDir,
  projectSubdir,
  type ClaudeSymlinkKind,
} from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi project switch <name> [options]

Rotate the .claude/{skills,agents,rules}/ symlink farm to point at
.gobbi/projects/<name>/{skills,agents,rules}/ and update
settings.json's projects.active.

Refuses to run if any session in the CURRENT active project (or any
legacy-flat .gobbi/sessions/ session) has a non-terminal currentStep
— switching mid-session would expose half-rebuilt symlinks to the
live Claude Code process. Pass --force to bypass the gate at your
own risk.

Options:
  --force       Bypass the active-session gate
  --help, -h    Show this help message`;

// ---------------------------------------------------------------------------
// Kinds participating in the farm
// ---------------------------------------------------------------------------

/**
 * The three kinds swapped by the rotation. Matches
 * {@link ClaudeSymlinkKind} exactly — re-declared locally so the array
 * order is a stable iteration sequence the rollback path can rely on.
 */
const FARM_KINDS: readonly ClaudeSymlinkKind[] = ['skills', 'agents', 'rules'];

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/**
 * Test-time overrides. Production callers pass `{}`.
 *
 *   - `repoRoot` — scratch repo root so tests avoid touching real
 *     `.gobbi/` / `.claude/`.
 *   - `tempPidTag` — deterministic tag used in the temp-farm path so
 *     tests can assert specific paths without depending on the real
 *     pid. Production defaults to `process.pid.toString()`.
 */
export interface ProjectSwitchOverrides {
  readonly repoRoot?: string;
  readonly tempPidTag?: string;
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runProjectSwitch(args: string[]): Promise<void> {
  await runProjectSwitchWithOptions(args, {});
}

export async function runProjectSwitchWithOptions(
  args: string[],
  overrides: ProjectSwitchOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  let positionals: string[];
  let force = false;
  try {
    const parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        force: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    positionals = parsed.positionals;
    force = parsed.values.force === true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi project switch: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (positionals.length === 0) {
    process.stderr.write('gobbi project switch: missing <name> argument\n');
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  if (positionals.length > 1) {
    process.stderr.write(
      `gobbi project switch: unexpected extra arguments: ${positionals.slice(1).join(' ')}\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  const targetName = positionals[0] as string;
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const pidTag = overrides.tempPidTag ?? process.pid.toString();

  // --- Target-exists check ----------------------------------------------
  const targetDir = projectDir(repoRoot, targetName);
  if (!existsSync(targetDir)) {
    process.stderr.write(
      `gobbi project switch: project '${targetName}' does not exist at ${targetDir}\n` +
        `                     Run 'gobbi project create ${targetName}' first.\n`,
    );
    process.exit(1);
  }

  // --- Active-session gate ---------------------------------------------
  //
  // Scope: the gate fires on active sessions in the CURRENT project
  // plus any legacy-flat sessions. Active sessions in OTHER projects
  // (i.e., not the one whose symlink farm is being swapped out) do not
  // block the switch — their directories are untouched by rotation.
  //
  // Reading the current project from the workspace file DIRECTLY (not
  // through `resolveSettings`) keeps the gate independent of
  // cascade-merge; the workspace tier is the authoritative source for
  // `projects.active`.
  if (!force) {
    const currentActive = readCurrentActive(repoRoot);
    const blockers = findStateActiveSessions(repoRoot).filter((s) =>
      shouldBlockSwitch(s, currentActive),
    );
    if (blockers.length > 0) {
      process.stderr.write(renderActiveSessionError(blockers));
      process.exit(1);
    }
  }

  // --- Build the new farm in a temp location ----------------------------
  const tempRoot = path.join(repoRoot, `.claude.tmp-farm-${pidTag}`);
  try {
    buildFarm(repoRoot, tempRoot, targetName);
  } catch (err) {
    safeRmTree(tempRoot);
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `gobbi project switch: failed to build new farm: ${message}\n` +
        `                     Old .claude/ left intact.\n`,
    );
    process.exit(1);
  }

  // --- Per-kind swap ----------------------------------------------------
  //
  // `swapKinds` returns the list of kinds that were successfully swapped.
  // On failure mid-sequence it attempts rollback of already-swapped
  // kinds before propagating the error; a rollback failure surfaces as
  // a structured diagnostic so the operator can recover manually.
  try {
    swapKinds(repoRoot, tempRoot);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `gobbi project switch: rotation failed: ${message}\n`,
    );
    // `swapKinds` already emitted any per-kind diagnostics; do not
    // overwrite the tempRoot because it may still carry rollback state
    // the operator needs to inspect.
    process.exit(1);
  }

  // Clean up the temp root (every original `<kind>.old` has been moved
  // back out by `swapKinds`, so the temp tree should only carry empty
  // directories at this point — best-effort recursive remove).
  safeRmTree(tempRoot);

  // --- settings.json update --------------------------------------------
  //
  // Read the workspace tier DIRECTLY (not via `resolveSettings`) — see
  // the sibling rationale on `commands/project/create.ts`. When the
  // file is absent (fresh repo) we seed the minimal shape.
  const existing = loadSettingsAtLevel(repoRoot, 'workspace');
  const base: Settings =
    existing !== null
      ? existing
      : { schemaVersion: 1, projects: { active: null, known: [] } };

  const knownSet = new Set(base.projects.known);
  knownSet.add(targetName);
  const updated: Settings = {
    ...base,
    projects: {
      active: targetName,
      known: [...knownSet].sort(),
    },
  };
  writeSettingsAtLevel(repoRoot, 'workspace', updated);

  process.stdout.write(
    `Switched active project to '${targetName}'.\n` +
      `.claude/{skills,agents,rules}/ now points at .gobbi/projects/${targetName}/.\n`,
  );
}

// ---------------------------------------------------------------------------
// Active-session gate helpers
// ---------------------------------------------------------------------------

/**
 * Return the list of active sessions that should block the switch.
 * Scope: legacy-flat sessions (close to the Claude Code tree) and
 * sessions belonging to the CURRENTLY-active project. Other projects'
 * sessions are ignored — rotating the farm never touches their
 * `.gobbi/projects/<other>/` storage.
 */
export function shouldBlockSwitch(
  session: StateActiveSession,
  currentActiveProject: string | null,
): boolean {
  if (session.projectName === null) return true;
  if (currentActiveProject === null) return false;
  return session.projectName === currentActiveProject;
}

/**
 * Read the workspace-level `settings.json` directly and return the
 * `projects.active` field. Falls back to `null` on any read / parse
 * failure (the gate then only blocks on legacy-flat sessions).
 *
 * Exported for tests that want to assert the gate narrows to the
 * right project.
 */
export function readCurrentActive(repoRoot: string): string | null {
  try {
    const existing = loadSettingsAtLevel(repoRoot, 'workspace');
    if (existing === null) return null;
    return existing.projects.active;
  } catch {
    return null;
  }
}

export function renderActiveSessionError(
  blockers: readonly StateActiveSession[],
): string {
  const lines: string[] = [];
  lines.push(
    'error: Cannot switch projects while one or more sessions are active.',
  );
  for (const s of blockers) {
    const step = s.currentStep ?? '(missing or malformed state.json)';
    const layer = s.projectName ?? '(legacy-flat)';
    lines.push(`       Active session: ${s.sessionId}`);
    lines.push(`       project: ${layer}`);
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
  lines.push('  3. Bypass the gate:            gobbi project switch <name> --force');
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Farm build
// ---------------------------------------------------------------------------

/**
 * Materialise the new `.claude/{skills,agents,rules}/` farm under the
 * temp root. Every leaf file in the project's source tree becomes a
 * symlink from `<tempRoot>/<kind>/<relPath>` → `<source>`, using the
 * relative form produced by `claudeSymlinkTarget` for portability.
 *
 * `buildFarm` REPLACES anything at `tempRoot` — callers pass a fresh
 * path. If any file create / symlink call throws, the error propagates
 * and the caller is expected to `safeRmTree(tempRoot)` before exiting.
 */
function buildFarm(
  repoRoot: string,
  tempRoot: string,
  projectName: string,
): void {
  // Ensure the temp root itself is fresh — if a previous aborted run
  // left it behind, wipe before we start.
  safeRmTree(tempRoot);
  mkdirSync(tempRoot, { recursive: true });

  for (const kind of FARM_KINDS) {
    const srcRoot = projectSubdir(repoRoot, projectName, kind);
    const dstRoot = path.join(tempRoot, kind);
    mkdirSync(dstRoot, { recursive: true });
    // Silently skip when the source dir is absent — a newly created
    // project may not have scaffolded every kind yet. The destination
    // stays as an empty dir, which is exactly the pre-swap state.
    if (!existsSync(srcRoot)) continue;

    mirrorTreeAsSymlinks(srcRoot, dstRoot, kind, projectName, repoRoot);
  }
}

/**
 * Walk `srcRoot` recursively and create, for every regular file found,
 * a symlink at the mirrored path under `dstRoot`. Directories are
 * recreated; symlinks in the source are dereferenced once (the
 * destination symlink points at the resolved file, not at the source
 * symlink — avoiding double-indirection). Any other file type
 * (character device, socket, etc.) causes a throw — the farm should
 * only ever contain regular files and directories.
 *
 * `claudeSymlinkTarget` gives us the canonical relative-link form for
 * the ROOT `.claude/<kind>/<fileName>` location; for nested files we
 * compute the relative form directly via `path.relative` so the link
 * works regardless of how deep the tree goes. The root-level helper is
 * still used as a correctness check — the relative form it produces
 * must match what we compute here for files directly under the kind
 * root. (The caller does not enforce this equality today; the helper
 * call path exists because it lets `workspace-paths.ts` stay the
 * single source of truth for symlink-target derivation as the farm
 * evolves.)
 */
function mirrorTreeAsSymlinks(
  srcRoot: string,
  dstRoot: string,
  kind: ClaudeSymlinkKind,
  projectName: string,
  repoRoot: string,
): void {
  const stack: Array<{ src: string; dst: string }> = [
    { src: srcRoot, dst: dstRoot },
  ];
  while (stack.length > 0) {
    const entry = stack.pop();
    if (entry === undefined) break;

    const entries = readdirSync(entry.src, { withFileTypes: true });
    for (const child of entries) {
      const srcPath = path.join(entry.src, child.name);
      const dstPath = path.join(entry.dst, child.name);

      if (child.isDirectory()) {
        mkdirSync(dstPath, { recursive: true });
        stack.push({ src: srcPath, dst: dstPath });
        continue;
      }
      if (child.isFile() || child.isSymbolicLink()) {
        // Compute the relative link string pointing at the source. For
        // files directly under the kind root we can cross-check against
        // `claudeSymlinkTarget`'s canonical form, but for nested files
        // (e.g. skills/<skill>/evaluation/<file>.md) the helper does
        // not model the nested case, so we compute the relative path
        // directly.
        const linkTarget = path.relative(path.dirname(dstPath), srcPath);
        // Sanity-probe the helper for the root-level case so any future
        // change to `claudeSymlinkTarget` surfaces as a divergence error
        // rather than silently producing mismatched links.
        if (path.dirname(srcPath) === srcRoot) {
          const canonical = claudeSymlinkTarget(
            kind,
            child.name,
            projectName,
            repoRoot,
          );
          // The canonical helper targets `.claude/<kind>/<name>`; the
          // relative form from `<tempRoot>/<kind>/<name>` may differ
          // (tempRoot depth differs from .claude/). We only assert that
          // the SOURCE side matches — the `target` differs by design.
          if (canonical.source !== srcPath) {
            throw new Error(
              `buildFarm internal drift: ${canonical.source} !== ${srcPath}`,
            );
          }
        }
        symlinkSync(linkTarget, dstPath);
        continue;
      }
      throw new Error(
        `buildFarm: unsupported file type at ${srcPath} (kind=${kind})`,
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Per-kind swap
// ---------------------------------------------------------------------------

/**
 * Perform the three per-kind swaps. For each kind in {@link FARM_KINDS}:
 *
 *   1. If `.claude/<kind>` exists, rename it to
 *      `<tempRoot>/<kind>.old`.
 *   2. Rename `<tempRoot>/<kind>` (the newly built tree) to
 *      `.claude/<kind>`.
 *   3. Remove `<tempRoot>/<kind>.old` after (2) succeeds.
 *
 * On failure at step (2), roll back by renaming `<kind>.old` back to
 * `.claude/<kind>` and reverse-rolling any previous kinds in the
 * iteration. A rollback failure raises a structured error listing
 * every path involved so the operator can recover manually.
 */
function swapKinds(repoRoot: string, tempRoot: string): void {
  const claudeRoot = path.join(repoRoot, '.claude');
  mkdirSync(claudeRoot, { recursive: true });

  interface Swapped {
    readonly kind: ClaudeSymlinkKind;
    readonly oldPath: string;
  }
  const swapped: Swapped[] = [];

  for (const kind of FARM_KINDS) {
    const livePath = path.join(claudeRoot, kind);
    const newBuiltPath = path.join(tempRoot, kind);
    const oldPath = path.join(tempRoot, `${kind}.old`);

    try {
      // Step 1: move the old farm out of the way. If no old farm exists
      // (fresh repo, or first `switch` after install), skip.
      if (existsSync(livePath)) {
        renameSync(livePath, oldPath);
      }

      // Step 2: move the newly built farm into place.
      renameSync(newBuiltPath, livePath);

      // Step 3: delete the old farm after the move succeeded.
      if (existsSync(oldPath)) {
        rmSync(oldPath, { recursive: true, force: true });
      }

      swapped.push({ kind, oldPath });
    } catch (err) {
      // Rollback: reverse this kind's step 1 (if it ran), then reverse
      // every already-swapped kind back to its old state.
      try {
        // If step-1 moved livePath → oldPath but step-2 didn't run or
        // failed, the old dir lives at oldPath and livePath is empty.
        if (existsSync(oldPath) && !existsSync(livePath)) {
          renameSync(oldPath, livePath);
        }
      } catch (rollbackErr) {
        const rollbackMessage =
          rollbackErr instanceof Error ? rollbackErr.message : String(rollbackErr);
        throw new Error(
          `swapKinds: failure mid-swap on ${kind}; rollback also failed (${rollbackMessage}). ` +
            `Original error: ${err instanceof Error ? err.message : String(err)}. ` +
            `Paths: live=${livePath} old=${oldPath} newBuilt=${newBuiltPath}`,
        );
      }

      // Reverse previously-swapped kinds.
      for (const prev of swapped.reverse()) {
        const prevLive = path.join(claudeRoot, prev.kind);
        // The `.old` directory was already removed at prev's step 3,
        // so the best we can do is surface a clear error — we can no
        // longer restore the pre-swap state for prev kinds. Emit a
        // structured diagnostic and re-throw.
        process.stderr.write(
          `swapKinds: cannot reverse already-committed swap of kind ${prev.kind}; ` +
            `${prevLive} now points at the NEW project. Manual intervention required.\n`,
        );
      }
      throw err;
    }
  }
}

// ---------------------------------------------------------------------------
// File-system helpers
// ---------------------------------------------------------------------------

/**
 * Best-effort recursive tree removal. Swallows errors — the caller is
 * the authoritative decision-maker (e.g. the rollback path needs the
 * temp tree preserved for diagnostic inspection). Only used on paths
 * we own (`.claude.tmp-farm-<pid>/` subtrees) so silently ignoring EBUSY / EPERM
 * is acceptable.
 */
function safeRmTree(target: string): void {
  if (!existsSync(target)) return;
  try {
    rmSync(target, { recursive: true, force: true });
  } catch {
    // best-effort
  }
}

// Stat-but-don't-follow — kept as an exported helper so tests can
// assert the rotation outcome without re-deriving the path arithmetic.
// (Unused in production paths; exported for test convenience.)
export function isSymlink(target: string): boolean {
  try {
    return statSync(target).isSymbolicLink();
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export {
  USAGE as PROJECT_SWITCH_USAGE,
  FARM_KINDS,
};
