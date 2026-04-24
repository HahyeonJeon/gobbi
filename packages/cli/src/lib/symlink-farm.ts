/**
 * Shared `.claude/{skills,agents,rules}/` per-file symlink farm
 * primitives — extracted from `commands/project/switch.ts` so both
 * `gobbi install` (fresh-install setup) and `gobbi project switch`
 * (farm rotation) build the farm with identical semantics.
 *
 * ## Why shared?
 *
 * The D3 lock from the v0.5.0 ideation mandates a per-file symlink
 * farm: each leaf `.claude/<kind>/<...>/<file>` is its own symlink
 * into the active project's source tree. Two commands need to
 * materialise that farm:
 *
 *   - `gobbi install` fresh-path: after templates land in
 *     `.gobbi/projects/<name>/{skills,agents,rules}/`, build the
 *     farm from scratch so the user has a working Claude Code
 *     integration in one command.
 *   - `gobbi project switch <name>`: rotate the farm to point at a
 *     different project's source tree (atomic per-kind swap with
 *     rollback).
 *
 * Duplicating the walk-and-symlink logic would drift; one source of
 * truth is better.
 *
 * ## Scope
 *
 *   - `buildFarmIntoRoot` — materialise the farm tree under a CALLER-OWNED
 *     destination root (either `.claude/` directly for fresh install,
 *     or a temp root for rotation). The caller decides whether the
 *     destination is being built in place or built-then-swapped.
 *   - `mirrorTreeAsSymlinks` — recursive walk that creates one symlink
 *     per regular file in the source tree. Directories in the source
 *     become real directories in the destination so the per-file
 *     constraint is preserved.
 *
 * Rotation-specific concerns (temp-farm path naming, per-kind atomic
 * swap, rollback on mid-swap failure) stay in `commands/project/switch.ts`
 * — those are switch-command-only concerns. The shared module
 * exposes only the "materialise a farm" primitive.
 *
 * @see `commands/project/switch.ts::swapKinds` — rotation atomicity
 *      and rollback logic.
 * @see `commands/install.ts::runInstallWithOptions` — fresh-install
 *      farm build.
 * @see `lib/workspace-paths.ts::claudeSymlinkTarget` — canonical
 *      symlink-target derivation.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import path from 'node:path';

import {
  claudeSymlinkTarget,
  projectSubdir,
  type ClaudeSymlinkKind,
} from './workspace-paths.js';

// ---------------------------------------------------------------------------
// Kinds
// ---------------------------------------------------------------------------

/**
 * The three kinds that participate in the `.claude/` farm. Matches
 * {@link ClaudeSymlinkKind}; declared locally so callers can iterate
 * in a stable order without re-deriving the tuple.
 */
export const CLAUDE_FARM_KINDS: readonly ClaudeSymlinkKind[] = [
  'skills',
  'agents',
  'rules',
] as const;

// ---------------------------------------------------------------------------
// buildFarmIntoRoot
// ---------------------------------------------------------------------------

/**
 * Materialise the three-kind farm under `destRoot`, populating each
 * kind from the project's source tree at
 * `.gobbi/projects/<projectName>/<kind>/`.
 *
 * `destRoot` is the destination root — e.g. `.claude/` for the
 * fresh-install case, or a temp tree for rotation. The caller decides
 * whether `destRoot` lives directly at its final location or will be
 * swapped in later; this function doesn't care.
 *
 * Behaviour:
 *
 *   - `destRoot` itself is NOT wiped — only the three per-kind subdirs
 *     (`destRoot/skills`, `destRoot/agents`, `destRoot/rules`) are
 *     removed before being rebuilt. This protects non-farm siblings
 *     that may live under `destRoot` (e.g. the operator's
 *     `.claude/CLAUDE.md`, `settings.json`, `README.md`) which the farm
 *     does not own and must never delete. The fresh-install path
 *     depends on this preservation — wiping the whole `.claude/` root
 *     would silently destroy user content.
 *   - `destRoot` is created if absent so fresh repos (no prior
 *     `.claude/`) still get a materialised farm in one call.
 *   - Each kind directory is materialised even if the source kind dir
 *     is absent — the destination carries an empty dir, matching the
 *     pre-swap behaviour the rotation logic relies on.
 *   - A single failure propagates. The caller is responsible for
 *     cleanup (e.g. per-kind remove, or full `destRoot` removal only
 *     when the caller owns the whole tree — the switch-rotation path
 *     builds the farm under a temp root it owns outright).
 */
export function buildFarmIntoRoot(
  repoRoot: string,
  destRoot: string,
  projectName: string,
): void {
  // Ensure the destination root exists without touching its existing
  // contents. Non-farm siblings (CLAUDE.md, settings.json, etc.) are
  // preserved; stale farm kinds are wiped per-kind below.
  mkdirSync(destRoot, { recursive: true });

  for (const kind of CLAUDE_FARM_KINDS) {
    const srcRoot = projectSubdir(repoRoot, projectName, kind);
    const dstRoot = path.join(destRoot, kind);
    // Per-kind wipe: a prior aborted run, a retried install, or an
    // existing farm at this kind must start clean so mirroring into
    // the dir never collides with stale symlinks/files.
    if (existsSync(dstRoot)) {
      rmSync(dstRoot, { recursive: true, force: true });
    }
    mkdirSync(dstRoot, { recursive: true });
    // A newly created project may not have scaffolded every kind yet;
    // skip silently — the destination stays as an empty dir.
    if (!existsSync(srcRoot)) continue;

    mirrorTreeAsSymlinks(srcRoot, dstRoot, kind, projectName, repoRoot);
  }
}

// ---------------------------------------------------------------------------
// mirrorTreeAsSymlinks
// ---------------------------------------------------------------------------

/**
 * Walk `srcRoot` recursively and create, for every regular file or
 * source symlink, a symlink at the mirrored path under `dstRoot`.
 * Directories are recreated; anything that is neither a file, a
 * directory, nor a symlink throws (farms must only contain regular
 * files + directories).
 *
 * Per-file link targets are computed via `path.relative` from the
 * link's parent directory to the source file so the link works
 * regardless of how deep the tree goes. For files directly under the
 * kind root we sanity-probe `claudeSymlinkTarget` — any future change
 * to the canonical helper surfaces as a drift error rather than
 * silently producing mismatched links.
 */
export function mirrorTreeAsSymlinks(
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
        const linkTarget = path.relative(path.dirname(dstPath), srcPath);
        if (path.dirname(srcPath) === srcRoot) {
          const canonical = claudeSymlinkTarget(
            kind,
            child.name,
            projectName,
            repoRoot,
          );
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
