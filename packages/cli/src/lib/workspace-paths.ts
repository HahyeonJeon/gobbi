/**
 * Pure-function facade for `.gobbi/` + `.claude/` path derivation under the
 * multi-project layout (Pass-2 redesign §11 taxonomy + D6 worktree scope).
 *
 * The facade exists so that future renames of the on-disk layout touch one
 * module instead of ~17 call sites. Every caller that composes a path under
 * `.gobbi/projects/<name>/...` or a `.claude/{skills,agents,rules}/` symlink
 * target should route through the helpers exported here.
 *
 * ## Layout produced by this module
 *
 *   repoRoot/.gobbi/                                     — workspace root
 *   repoRoot/.gobbi/projects/                            — all projects
 *   repoRoot/.gobbi/projects/<name>/                     — one project
 *   repoRoot/.gobbi/projects/<name>/<kind>/              — one taxonomy dir
 *   repoRoot/.gobbi/projects/<name>/sessions/<id>/       — one session
 *   repoRoot/.gobbi/projects/<name>/worktrees/<name>/    — one worktree (D6)
 *   repoRoot/.claude/<kind>/<fileName>                   — symlink location
 *
 * ## Scope boundary
 *
 *   - Pure functions only; no I/O, no `fs.*`, no async.
 *   - Does not read `settings-io.ts` — callers pass `projectName` explicitly.
 *   - Does not decide which project is "active"; that lives in the cascade.
 *
 * @see ../../../../.gobbi/sessions/35742566-2697-4318-bb06-558346b77b4a/ideation/ideation.md
 *      (§5 item 3 — "workspace-paths.ts facade"; §11 — charter table for the
 *      11 taxonomy dirs; §10 D6 — project-scoped worktrees)
 * @see ../../../../.gobbi/sessions/35742566-2697-4318-bb06-558346b77b4a/plan/plan.md
 *      (W1.1 — this module; W1.2 — schema extension; W2.1 — caller routing)
 */

import path from 'node:path';

// ---------------------------------------------------------------------------
// Project subdirectory taxonomy
// ---------------------------------------------------------------------------

/**
 * Every directory kind that may appear under
 * `.gobbi/projects/<name>/<kind>/`.
 *
 * Sourced from ideation §11's 11-dir taxonomy (design / decisions /
 * references / scenarios / checklists / playbooks / learnings / rules /
 * backlogs / notes / reviews) plus:
 *
 *   - `skills` / `agents` — per-file symlink-farm source for
 *     `.claude/skills/` + `.claude/agents/` (D3 post-eval flip).
 *   - `sessions` — per-project session storage (gitignored).
 *   - `worktrees` — project-scoped worktrees (D6 post-eval lock).
 *
 * The tuple is the single source of truth; {@link ProjectSubdirKind} is
 * derived so adding a kind requires updating exactly one place.
 */
export const PROJECT_SUBDIR_KINDS = [
  'design',
  'decisions',
  'references',
  'scenarios',
  'checklists',
  'playbooks',
  'learnings',
  'rules',
  'backlogs',
  'notes',
  'reviews',
  'skills',
  'agents',
  'sessions',
  'worktrees',
] as const;

/**
 * Union of every legal subdirectory kind under a project root. Derived from
 * {@link PROJECT_SUBDIR_KINDS} via the `typeof T[number]` idiom so the
 * compiler refuses unknown kinds at the call site.
 */
export type ProjectSubdirKind = (typeof PROJECT_SUBDIR_KINDS)[number];

/**
 * Subset of {@link ProjectSubdirKind} that participates in the `.claude/`
 * symlink farm. Keeping this narrower than the full kind union prevents
 * callers from asking for a symlink into, say, `.claude/sessions/` — which
 * is nonsensical (sessions are gitignored and never surfaced under
 * `.claude/`).
 */
export type ClaudeSymlinkKind = 'skills' | 'agents' | 'rules';

// ---------------------------------------------------------------------------
// Workspace + project paths
// ---------------------------------------------------------------------------

/**
 * Absolute path to the workspace root — `repoRoot/.gobbi`. Every other
 * helper in this module builds on top of this.
 */
export function workspaceRoot(repoRoot: string): string {
  return path.join(repoRoot, '.gobbi');
}

/**
 * Absolute path to the projects-root container — `repoRoot/.gobbi/projects`.
 * Individual project directories live inside.
 */
export function projectsRoot(repoRoot: string): string {
  return path.join(workspaceRoot(repoRoot), 'projects');
}

/**
 * Absolute path to a single project's root —
 * `repoRoot/.gobbi/projects/<projectName>`.
 */
export function projectDir(repoRoot: string, projectName: string): string {
  return path.join(projectsRoot(repoRoot), projectName);
}

/**
 * Absolute path to a single taxonomy subdirectory under a project —
 * `repoRoot/.gobbi/projects/<projectName>/<kind>`.
 *
 * `kind` is typed as {@link ProjectSubdirKind}, so unknown values fail
 * compilation rather than silently producing a typo'd path at runtime.
 */
export function projectSubdir(
  repoRoot: string,
  projectName: string,
  kind: ProjectSubdirKind,
): string {
  return path.join(projectDir(repoRoot, projectName), kind);
}

// ---------------------------------------------------------------------------
// Sessions + worktrees
// ---------------------------------------------------------------------------

/**
 * Absolute path to the sessions-root for a project —
 * `repoRoot/.gobbi/projects/<projectName>/sessions`.
 */
export function sessionsRoot(repoRoot: string, projectName: string): string {
  return projectSubdir(repoRoot, projectName, 'sessions');
}

/**
 * Absolute path to a single session directory —
 * `repoRoot/.gobbi/projects/<projectName>/sessions/<sessionId>`.
 */
export function sessionDir(
  repoRoot: string,
  projectName: string,
  sessionId: string,
): string {
  return path.join(sessionsRoot(repoRoot, projectName), sessionId);
}

/**
 * Absolute path to a single worktree's directory under a project —
 * `repoRoot/.gobbi/projects/<projectName>/worktrees/<worktreeName>`.
 *
 * Worktrees are project-scoped per D6 (post-eval lock); the legacy
 * `.claude/worktrees/` location is deprecated.
 */
export function worktreeDir(
  repoRoot: string,
  projectName: string,
  worktreeName: string,
): string {
  return path.join(
    projectSubdir(repoRoot, projectName, 'worktrees'),
    worktreeName,
  );
}

// ---------------------------------------------------------------------------
// `.claude/` symlink farm
// ---------------------------------------------------------------------------

/**
 * Shape returned by {@link claudeSymlinkTarget}. Both paths are absolute so
 * callers do not re-derive them; the relative symlink string is
 * `path.relative(path.dirname(target), source)`.
 */
export interface ClaudeSymlinkPaths {
  /**
   * Absolute path to the file the symlink points AT — lives under
   * `.gobbi/projects/<projectName>/<kind>/<fileName>`.
   */
  readonly source: string;
  /**
   * Absolute path where the symlink LIVES — lives under
   * `.claude/<kind>/<fileName>`.
   */
  readonly target: string;
}

/**
 * Compute both absolute paths for a single `.claude/` per-file symlink.
 *
 *   - `source`: the file in `.gobbi/projects/<name>/<kind>/<fileName>`.
 *   - `target`: the symlink location in `.claude/<kind>/<fileName>`.
 *
 * Use `path.relative(path.dirname(target), source)` to obtain the
 * relative link string passed to `symlinkSync` — the relative form is
 * portable across worktrees, matches the existing
 * `plugins/gobbi/skills/_<name>` convention, and is what `gobbi switch`
 * will rewrite atomically during project rotation.
 */
export function claudeSymlinkTarget(
  kind: ClaudeSymlinkKind,
  fileName: string,
  projectName: string,
  repoRoot: string,
): ClaudeSymlinkPaths {
  const source = path.join(
    projectSubdir(repoRoot, projectName, kind),
    fileName,
  );
  const target = path.join(repoRoot, '.claude', kind, fileName);
  return { source, target };
}
