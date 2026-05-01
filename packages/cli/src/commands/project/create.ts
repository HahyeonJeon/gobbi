/**
 * `gobbi project create <name>` — scaffold a new project directory tree
 * under `.gobbi/projects/<name>/`.
 *
 * ## Scaffold
 *
 * Materialises the full post-pivot taxonomy locked in
 * `.gobbi/projects/gobbi/design/v050-features/gobbi-memory/README.md`
 * (§Directory shape). Every project gets every taxonomy slot at
 * birth — lazy-create was retired in PR-FIN-2a-i T-2a.4 because skipped
 * slots forced downstream commands to re-implement scaffolding logic
 * and confused operators reading `ls .gobbi/projects/<name>/`.
 *
 * The scaffold list is split three ways:
 *
 *   - **12 narrative dirs** (alphabetised): `backlogs`, `checklists`,
 *     `decisions`, `design`, `gotchas`, `learnings`, `notes`,
 *     `playbooks`, `references`, `reviews`, `rules`, `scenarios`.
 *   - **2 farm dirs**: `agents`, `skills`. (`rules` is already in the
 *     narrative list — it is shared between the narrative tier and the
 *     `.claude/` symlink farm.)
 *   - **3 gitignored runtime dirs**: `sessions`, `tmp`, `worktrees`.
 *
 * Total: **14 git-tracked dirs + 3 runtime dirs = 17 on disk**. The
 * runtime trio is matched by `.gitignore` patterns under
 * `.gobbi/projects/<name>/{sessions,tmp,worktrees}/` so they exist on
 * disk but never enter version control.
 *
 * Every git-tracked dir that ends up empty after the install seed runs
 * receives an empty `.gitkeep` so git records the otherwise-empty slot.
 * Dirs the seed populated (typically `skills/`, `agents/`, `rules/`)
 * do not need a `.gitkeep` — their real contents already keep the dir
 * tracked. `.gitkeep` is not written into the gitignored runtime dirs;
 * git would not track it anyway.
 *
 * ## Seeding
 *
 * The install module's `seedProjectFromTemplates` helper owns the
 * template-copy logic. `project create` invokes it by dynamic import
 * so the install module stays a peer command (no static circular
 * dependency) and a forward-compat shape mismatch degrades to a
 * stderr warning rather than a crash.
 *
 *   - Expected shape: `install.ts` exports
 *     `seedProjectFromTemplates({repoRoot, projectName}): SeedResult`.
 *   - Fallback (shape drifts): stderr warning pointing at
 *     `gobbi install`; scaffold directories stay empty.
 *
 * The seed helper is content-only. It writes the bundled template
 * files into the new project, but does NOT touch `settings.json` and
 * does NOT build the `.claude/` symlink farm. PR-FIN-2a-i T-2a.3
 * removed the install-manifest bookkeeping; the seed helper no longer
 * writes a manifest either.
 *
 * ## settings.json update (PR-FIN-1c)
 *
 * `gobbi project create` does NOT touch `settings.json`. PR-FIN-1c
 * removed the `Settings.projects` registry; the directory tree under
 * `.gobbi/projects/` is the source of truth for which projects exist,
 * and `--project <name>` on each command selects which one to address.
 *
 * ## Name validation
 *
 * Refuses names that:
 *
 *   - Are empty, or contain only whitespace.
 *   - Contain characters outside `[a-z0-9-]` (lowercase letters,
 *     digits, hyphens). Uppercase, underscores, dots, slashes, spaces,
 *     and path separators all fail.
 *   - Start or end with a hyphen.
 *   - Already exist as a subdirectory of `.gobbi/projects/`.
 *   - Match any reserved filesystem name (`.`, `..`).
 *
 * The character rule matches the project-name convention implied by
 * the existing default `gobbi` project and the `__gobbi-convention.md`
 * rule — lowercase-hyphen-separated, no nested paths.
 *
 * ## Exit codes
 *
 *   - `0` — project created; `settings.json` updated.
 *   - `1` — name validation failed, or the project already exists.
 *   - `2` — argument parse error (missing name, unknown flags).
 *
 * @see `commands/project.ts` — sibling dispatcher
 * @see `lib/workspace-paths.ts::projectSubdir`
 * @see `lib/settings-io.ts::resolveSettings`, `writeSettingsAtLevel`
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { validateProjectName } from '../../lib/project-name.js';
import { getRepoRoot } from '../../lib/repo.js';
import { projectDir, projectSubdir } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi project create <name>

Scaffold a new project under .gobbi/projects/<name>/. Does NOT touch
settings.json (PR-FIN-1c removed the projects registry); pass
'--project <name>' to subsequent commands to address the new project.

Scaffolds the full taxonomy (14 git-tracked dirs + 3 gitignored runtime
dirs):

  Narrative (12)  agents, backlogs, checklists, decisions, design,
                  gotchas, learnings, notes, playbooks, references,
                  reviews, rules, scenarios, skills

  Runtime (3)     sessions/, tmp/, worktrees/  (gitignored)

Each empty git-tracked dir receives an empty .gitkeep so git records
the slot. See .gobbi/projects/gobbi/design/v050-features/gobbi-memory/
for the directory charter.

Name must be lowercase letters, digits, and hyphens only; no leading
or trailing hyphens, no path separators.

Options:
  --help, -h    Show this help message`;

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/**
 * Test-time overrides. Production callers pass `{}`.
 */
export interface ProjectCreateOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
}

// ---------------------------------------------------------------------------
// Default scaffold directories
// ---------------------------------------------------------------------------

/**
 * The full post-pivot taxonomy materialised at create time. See module
 * JSDoc for the rationale.
 *
 * Layout: 12 narrative dirs (alphabetised) → 2 farm dirs (`rules` is
 * already in the narrative list) → 3 gitignored runtime dirs. Order is
 * for human readability; it has no semantic effect — the scaffolder
 * iterates the array as-is, and the test suite asserts membership, not
 * order.
 *
 * Each of the 14 git-tracked dirs receives an empty `.gitkeep` if and
 * only if it is still empty after the install seed runs (see
 * {@link SCAFFOLD_GITIGNORED_DIRS} for the runtime trio that never
 * gets a marker). The seed typically populates `skills/`, `agents/`,
 * `rules/`, so those three usually skip the marker.
 *
 * Taxonomy reference: see
 * `.gobbi/projects/gobbi/design/v050-features/gobbi-memory/README.md`
 * §Directory shape for the locked charter per dir.
 */
const SCAFFOLD_DIRS: readonly string[] = [
  // 12 narrative dirs (alphabetised)
  'backlogs',
  'checklists',
  'decisions',
  'design',
  'gotchas',
  'learnings',
  'notes',
  'playbooks',
  'references',
  'reviews',
  'rules',
  'scenarios',
  // 2 farm dirs (`rules` already in narrative list above)
  'agents',
  'skills',
  // 3 gitignored runtime dirs (see SCAFFOLD_GITIGNORED_DIRS)
  'sessions',
  'tmp',
  'worktrees',
];

/**
 * The gitignored subset of {@link SCAFFOLD_DIRS}. These dirs are
 * created on disk so subsequent commands can write into them without
 * a separate `mkdir -p`, but the workspace `.gitignore` matches them
 * via `.gobbi/projects/<name>/{sessions,tmp,worktrees}/`. We do NOT
 * write a `.gitkeep` into these dirs — git would not track it anyway.
 */
const SCAFFOLD_GITIGNORED_DIRS: ReadonlySet<string> = new Set([
  'sessions',
  'tmp',
  'worktrees',
]);

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runProjectCreate(args: string[]): Promise<void> {
  await runProjectCreateWithOptions(args, {});
}

export async function runProjectCreateWithOptions(
  args: string[],
  overrides: ProjectCreateOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  let positionals: string[];
  try {
    const parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    positionals = parsed.positionals;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi project create: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (positionals.length === 0) {
    process.stderr.write('gobbi project create: missing <name> argument\n');
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  if (positionals.length > 1) {
    process.stderr.write(
      `gobbi project create: unexpected extra arguments: ${positionals.slice(1).join(' ')}\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  // `parseArgs` with `allowPositionals: true` guarantees `positionals[0]`
  // is a string when `positionals.length >= 1`. The non-null narrowing
  // is the compiler-visible version of that invariant.
  const name = positionals[0] as string;

  const validation = validateProjectName(name);
  if (!validation.ok) {
    process.stderr.write(`gobbi project create: ${validation.reason}\n`);
    process.exit(1);
  }

  const repoRoot = overrides.repoRoot ?? getRepoRoot();

  // --- Existence check -------------------------------------------------
  const targetDir = projectDir(repoRoot, name);
  if (existsSync(targetDir)) {
    process.stderr.write(
      `gobbi project create: project already exists: ${targetDir}\n`,
    );
    process.exit(1);
  }

  // --- Scaffold directories --------------------------------------------
  //
  // Create the project root plus every scaffold subdir. `mkdirSync` with
  // `recursive: true` makes each call idempotent.
  //
  // PR-FIN-2a-i T-2a.4: scaffold the full taxonomy (14 tracked + 3
  // gitignored = 17 dirs) per the held design lock. Every
  // {@link SCAFFOLD_DIRS} entry is a single-segment path that maps 1:1
  // to a {@link ProjectSubdirKind}. We still call through to a string
  // join here rather than {@link projectSubdir} to keep the loop
  // iteration uniform — the facade's narrow union check is enforced
  // by the central `PROJECT_SUBDIR_KINDS` tuple, which the scaffold
  // list mirrors.
  mkdirSync(targetDir, { recursive: true });
  for (const dir of SCAFFOLD_DIRS) {
    mkdirSync(`${targetDir}/${dir}`, { recursive: true });
  }

  // --- Seeding hook -----------------------------------------------------
  //
  // The install module exposes `seedProjectFromTemplates` for content
  // copy. We do a best-effort dynamic import: if the helper is present
  // we call it, otherwise we emit a stderr warning so the operator
  // knows to run `gobbi install`.
  //
  // Seeding runs BEFORE we drop `.gitkeep` markers so the seed's
  // "already-populated" guard sees genuinely-empty `skills/`, `agents/`,
  // `rules/` dirs rather than a `.gitkeep`-only layout that would look
  // populated.
  await trySeedFromInstallTemplates(repoRoot, name);

  // --- .gitkeep markers (post-seed) ------------------------------------
  //
  // For each git-tracked scaffold dir (every entry not in
  // {@link SCAFFOLD_GITIGNORED_DIRS}) that the seed left empty, drop
  // an empty `.gitkeep` so git records the otherwise-empty slot. Dirs
  // populated by the seed (typically `skills/`, `agents/`, `rules/`)
  // do not need a `.gitkeep` — their real contents already keep the
  // dir tracked. Gitignored runtime dirs (`sessions/`, `tmp/`,
  // `worktrees/`) never get a marker; git would not track it anyway.
  for (const dir of SCAFFOLD_DIRS) {
    if (SCAFFOLD_GITIGNORED_DIRS.has(dir)) continue;
    const dirPath = `${targetDir}/${dir}`;
    if (readdirSync(dirPath).length === 0) {
      writeFileSync(`${dirPath}/.gitkeep`, '');
    }
  }

  // --- settings.json (PR-FIN-1c: NO mutation) --------------------------
  //
  // PR-FIN-1c removed the `Settings.projects` registry. The directory
  // tree under `.gobbi/projects/` is the source of truth for which
  // projects exist; no workspace-level book-keeping is required.
  //
  // Operators that want to address the new project pass
  // `--project <name>` to each subsequent command.

  const trackedDirs = SCAFFOLD_DIRS.filter((d) => !SCAFFOLD_GITIGNORED_DIRS.has(d));
  const runtimeDirs = SCAFFOLD_DIRS.filter((d) => SCAFFOLD_GITIGNORED_DIRS.has(d));
  process.stdout.write(
    `Created project '${name}' at ${targetDir}\n` +
      `  Scaffolded ${trackedDirs.length} git-tracked dirs: ${trackedDirs.join(', ')}\n` +
      `  Scaffolded ${runtimeDirs.length} gitignored runtime dirs: ${runtimeDirs.join(', ')}\n` +
      `Pass '--project ${name}' to subsequent commands to address it.\n`,
  );
}

// ---------------------------------------------------------------------------
// Install-template seeding hook
// ---------------------------------------------------------------------------

/**
 * Best-effort template seeding. Dynamic-imports the install module and
 * calls its `seedProjectFromTemplates` helper. The dynamic-import guard
 * is retained for forward compatibility — if a future refactor renames
 * the export, the guard falls through to a stderr warning rather than
 * crashing `gobbi project create`. For the current shape (the W5-eval
 * remediation of W5.3 landed `seedProjectFromTemplates` as a named
 * export), the guard always succeeds.
 *
 * The install seed function is content-only: it copies templates into
 * `.gobbi/projects/<projectName>/{skills,agents,rules}/`. It does NOT
 * touch `settings.json` or build the `.claude/` farm — those are
 * fresh-install-only concerns and do not apply to project creation.
 * PR-FIN-2a-i T-2a.3 removed the install-manifest bookkeeping; no
 * `.install-manifest.json` is written either.
 */
async function trySeedFromInstallTemplates(
  repoRoot: string,
  projectName: string,
): Promise<void> {
  try {
    const mod: unknown = await import('../install.js');
    if (
      typeof mod === 'object' &&
      mod !== null &&
      'seedProjectFromTemplates' in mod &&
      typeof (mod as Record<string, unknown>)['seedProjectFromTemplates'] ===
        'function'
    ) {
      const seed = (mod as Record<string, unknown>)[
        'seedProjectFromTemplates'
      ] as (args: {
        readonly repoRoot: string;
        readonly projectName: string;
      }) => { filesCopied: number };
      const result = seed({ repoRoot, projectName });
      process.stdout.write(
        `Seeded ${String(result.filesCopied)} template file(s) into .gobbi/projects/${projectName}/.\n`,
      );
      return;
    }
  } catch (err) {
    // Install module present but seed helper threw — surface the error
    // so the operator can diagnose (e.g. "already-populated" when the
    // target project happens to have content on disk from a prior
    // partial run).
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `gobbi project create: template seeding failed: ${message}\n`,
    );
    return;
  }
  // Import succeeded but the expected export was missing — a forward-
  // compat shape mismatch. Warn so the operator knows to re-run install.
  process.stderr.write(
    `gobbi project create: install templates unavailable (export shape mismatch);\n` +
      `                      run 'gobbi install' to seed templates into '${projectName}'.\n`,
  );
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export {
  USAGE as PROJECT_CREATE_USAGE,
  SCAFFOLD_DIRS,
  SCAFFOLD_GITIGNORED_DIRS,
};
