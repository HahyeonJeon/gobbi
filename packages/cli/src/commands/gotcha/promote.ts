/**
 * gobbi gotcha promote — move gotcha drafts from
 * `.gobbi/projects/<project>/gotchas/` into their permanent
 * resting place.
 *
 * ## Scope
 *
 * Top-level, out-of-session command. Operators run this between sessions
 * to move category drafts under the project's `gotchas/` dir to their
 * permanent destinations and route skill-scoped drafts (`_skill-<name>.md`)
 * to `.claude/skills/<name>/gotchas.md` via the symlink farm.
 *
 * ## Contract
 *
 *   1. Happy path — every `.md` file under the source directory is
 *      appended to its destination, then the source is deleted so
 *      re-running does not duplicate.
 *   2. `--dry-run` — prints the planned moves; writes nothing, deletes
 *      nothing, exits 0.
 *
 * ## Active-session guard (removed, PR-FIN-2a-i T-2a.1.5)
 *
 * Earlier revisions blocked promotion when any session had a fresh
 * heartbeat in `gobbi.db`. The JSON-pivot memory model landing in
 * PR-FIN-2a-ii drops per-session `gobbi.db` entirely, so the heartbeat
 * read has nothing to consult. The guard was therefore removed in
 * T-2a.1.5; the command runs unconditionally.
 *
 * ## Destination convention (`_gotcha/project-gotcha.md`)
 *
 * Both destinations live under the per-project layout shipped by the
 * v0.5.0 Pass-2 W3.1 migration. Skill-scoped writes go through the W3.2
 * per-file symlink farm at `.claude/skills/<name>/gotchas.md` — the
 * symlink transparently writes through to
 * `.gobbi/projects/<project>/skills/<name>/gotchas.md`, keeping the
 * source of truth in the project directory while preserving loader
 * compatibility at `.claude/`.
 *
 *   - `{category}.md`             → `.gobbi/projects/<project>/gotchas/{category}.md`
 *   - `_skill-{skillName}.md`     → `.claude/skills/{skillName}/gotchas.md`
 *                                   (symlink target:
 *                                   `.gobbi/projects/<project>/skills/{skillName}/gotchas.md`)
 *
 * ## Future work (out of scope — PR D+)
 *
 * Duplicate-entry detection, structured frontmatter merge, and per-category
 * validation stay out of this file. Research explicitly keeps them deferred
 * so the first shipped version has a small, reviewable surface. The current
 * append-and-delete flow is safe because git diff is the merge review.
 *
 * @see `.gobbi/projects/gobbi/design/v050-cli.md` §`gobbi gotcha` commands
 * @see `.claude/skills/_gotcha/SKILL.md`
 * @see `.claude/skills/_gotcha/project-gotcha.md`
 */

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  mkdirSync,
  appendFileSync,
  unlinkSync,
} from 'node:fs';
import { basename, join } from 'node:path';

import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import {
  projectSubdir,
  projectsRoot,
} from '../../lib/workspace-paths.js';

/**
 * Default source directory — `.gobbi/projects/<project>/gotchas/`.
 * PR-FIN-1c: project name resolves from `--project` flag (caller-supplied)
 * → `basename(repoRoot)` (closes #179 — no `DEFAULT_PROJECT_NAME` literal).
 * PR-FIN-2a-i: gotcha drafts live at top-level `gotchas/`, no longer
 * nested under `learnings/`.
 */
function defaultSourceDir(repoRoot: string, projectName: string): string {
  return projectSubdir(repoRoot, projectName, 'gotchas');
}

/** Skill-scoped prefix convention (see file header). */
const SKILL_PREFIX = '_skill-';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi gotcha promote [options]

Move gotcha drafts from .gobbi/projects/<project>/gotchas/ into
their permanent resting place. Category drafts land at
.gobbi/projects/<project>/gotchas/<category>.md; skill-scoped
drafts (_skill-<name>.md) land at .claude/skills/<name>/gotchas.md via the
symlink farm.

Options:
  --project <name>              Project to read source drafts from
                                (default: basename(repoRoot))
  --dry-run                     Print planned changes without writing or deleting
  --source <path>               Override the source directory
                                (default: .gobbi/projects/<project>/gotchas/)
  --destination-project <name>  Override the destination project name
                                (default: the single directory under .gobbi/projects/)
  --help                        Show this help message`;

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/** Overrides for tests — never consumed by the CLI-facing `runPromote`. */
export interface PromoteOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
  /**
   * Override the `.claude/` directory root (defaults to
   * `<repoRoot>/.claude`). Tests use this to point at a scratch `.claude/`.
   */
  readonly claudeDir?: string;
}

export async function runPromote(args: string[]): Promise<void> {
  await runPromoteWithOptions(args, {});
}

export async function runPromoteWithOptions(
  args: string[],
  overrides: PromoteOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // --- 1. Parse flags ----------------------------------------------------
  let values: ReturnType<typeof parseArgs>['values'];
  try {
    const parsed = parseArgs({
      args,
      allowPositionals: false,
      options: {
        project: { type: 'string' },
        'dry-run': { type: 'boolean', default: false },
        source: { type: 'string' },
        'destination-project': { type: 'string' },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    values = parsed.values;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi gotcha promote: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  const dryRun = values['dry-run'] === true;
  const sourceOverride =
    typeof values['source'] === 'string' ? values['source'] : undefined;
  const destinationProject =
    typeof values['destination-project'] === 'string'
      ? values['destination-project']
      : undefined;
  const projectFlag =
    typeof values['project'] === 'string' && values['project'] !== ''
      ? values['project']
      : undefined;

  // --- 2. Resolve paths --------------------------------------------------
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const claudeDir = overrides.claudeDir ?? join(repoRoot, '.claude');
  // PR-FIN-1c: project resolves from `--project` flag → basename(repoRoot).
  // Closes #179 (no DEFAULT_PROJECT_NAME literal).
  const sourceProjectName = projectFlag ?? basename(repoRoot);
  const sourceDir = sourceOverride ?? defaultSourceDir(repoRoot, sourceProjectName);

  // --- 3. Enumerate source files ----------------------------------------
  //
  // The active-session guard that previously sat in this position was
  // removed in PR-FIN-2a-i T-2a.1.5 — see the file header for the JSON
  // pivot rationale.
  if (!existsSync(sourceDir)) {
    // Nothing to promote — silent no-op, mirrors the behaviour of `git
    // clean` on an already-clean tree.
    return;
  }

  const files = listPromotable(sourceDir);
  if (files.length === 0) {
    return; // empty source — silent
  }

  // --- 4. Resolve destination project (for non-skill entries) -----------
  const projectName = destinationProject ?? inferProjectName(repoRoot);
  // Only fail if there is actually a project-scoped file in the set —
  // skill-scoped promotions (_skill-*.md) do not need a project name.
  const needsProjectName = files.some((f) => !isSkillScopedName(f));
  if (needsProjectName && projectName === null) {
    process.stderr.write(
      `gobbi gotcha promote: no destination project configured.\n` +
        `  Pass --destination-project <name> or place a single directory under .gobbi/projects/.\n`,
    );
    process.exit(1);
  }

  // --- 5. Plan every promotion ------------------------------------------
  const plan = files.map((file) =>
    planPromotion(sourceDir, file, repoRoot, claudeDir, projectName),
  );

  // --- 6. Execute (or print) --------------------------------------------
  if (dryRun) {
    for (const item of plan) {
      process.stdout.write(
        `Would promote: ${item.source}\n  -> ${item.destination} (append, +${item.bytes} bytes)\n`,
      );
    }
    return;
  }

  for (const item of plan) {
    applyPromotion(item);
  }
}

// ---------------------------------------------------------------------------
// Promotion planning
// ---------------------------------------------------------------------------

interface PromotionPlan {
  readonly source: string;
  readonly destination: string;
  readonly body: string;
  readonly bytes: number;
}

function isSkillScopedName(filename: string): boolean {
  return filename.startsWith(SKILL_PREFIX);
}

function listPromotable(sourceDir: string): string[] {
  let entries: string[];
  try {
    entries = readdirSync(sourceDir);
  } catch {
    return [];
  }
  const out: string[] = [];
  for (const name of entries) {
    if (!name.endsWith('.md')) continue;
    const full = join(sourceDir, name);
    try {
      if (!statSync(full).isFile()) continue;
    } catch {
      continue;
    }
    out.push(name);
  }
  // Deterministic order so `--dry-run` output is stable.
  return out.sort();
}

/**
 * Scan `.gobbi/projects/*` for exactly one directory. Returns its name, or
 * `null` when the count is zero or ambiguous. Callers supply
 * `--destination-project` to disambiguate when multiple projects coexist.
 *
 * Routes through the `workspace-paths` facade (`projectsRoot(repoRoot)`)
 * so a future rename of the on-disk layout lands in one place rather than
 * here. The `.claude/project/` directory is gone as of v0.5.0 Pass-2
 * W3.1 — do not re-introduce that scan.
 */
function inferProjectName(repoRoot: string): string | null {
  const projectsDir = projectsRoot(repoRoot);
  if (!existsSync(projectsDir)) return null;
  let entries: string[];
  try {
    entries = readdirSync(projectsDir);
  } catch {
    return null;
  }
  const dirs = entries.filter((name) => {
    try {
      return statSync(join(projectsDir, name)).isDirectory();
    } catch {
      return false;
    }
  });
  if (dirs.length !== 1) return null;
  const only = dirs[0];
  return only ?? null;
}

function planPromotion(
  sourceDir: string,
  filename: string,
  repoRoot: string,
  claudeDir: string,
  projectName: string | null,
): PromotionPlan {
  const sourcePath = join(sourceDir, filename);
  const body = readFileSync(sourcePath, 'utf8');

  let destination: string;
  if (isSkillScopedName(filename)) {
    // `_skill-<name>.md` → `.claude/skills/<name>/gotchas.md`
    //
    // The `.claude/skills/<name>/` path is produced by the W3.2 per-file
    // symlink farm: the `gotchas.md` symlink (or the real file created
    // on first write) targets
    // `.gobbi/projects/<project>/skills/<name>/gotchas.md`. Writing
    // through the farm keeps the source of truth in the project dir
    // while preserving the loader-visible path.
    const skillPart = filename.slice(SKILL_PREFIX.length, -'.md'.length);
    destination = join(claudeDir, 'skills', skillPart, 'gotchas.md');
  } else {
    // `<category>.md` → `.gobbi/projects/<project>/gotchas/<category>.md`
    //
    // Routes through the `workspace-paths` facade so a future rename of
    // the taxonomy lands in one place. `projectName === null` is screened
    // out by the caller when any non-skill entry is present, so a fallback
    // name here is unreachable; we still pick a sentinel rather than
    // `!`-asserting so a future miswiring fails loudly at the filesystem
    // layer instead of a runtime TypeError.
    //
    // PR-FIN-2a-i: gotcha drafts live at top-level `gotchas/`, no longer
    // nested under `learnings/`.
    const projectDir =
      projectName ?? '__unset__project__' /* unreachable — caller checks */;
    destination = join(
      projectSubdir(repoRoot, projectDir, 'gotchas'),
      filename,
    );
  }

  return {
    source: sourcePath,
    destination,
    body,
    bytes: Buffer.byteLength(body, 'utf8'),
  };
}

/**
 * Append-and-delete. The destination file is created if absent, and the
 * source file is removed post-append so re-runs do not duplicate. If the
 * source body does not already end in a newline we add one so successive
 * promotions do not fuse the last line of one entry into the first of the
 * next.
 *
 * Post-W3.1 / PR-FIN-2a-i subtlety: for a non-skill promotion in the
 * default project (project name == `basename(repoRoot)`), the category
 * source file and its destination resolve to the same absolute path —
 * both live under `.gobbi/projects/<basename>/gotchas/<category>.md`.
 * Appending to itself and then unlinking would double the body and then
 * delete the file (data loss). When source and destination collide we
 * treat the promotion as already complete (the draft is already in its
 * permanent location by virtue of the taxonomy) and skip the file with
 * no writes.
 */
function applyPromotion(plan: PromotionPlan): void {
  if (plan.source === plan.destination) {
    // Same-path no-op — the draft already lives at the destination.
    return;
  }
  const destDir = destinationParent(plan.destination);
  mkdirSync(destDir, { recursive: true });
  const payload = plan.body.endsWith('\n') ? plan.body : `${plan.body}\n`;
  appendFileSync(plan.destination, payload, 'utf8');
  unlinkSync(plan.source);
}

function destinationParent(destPath: string): string {
  // Avoid pulling node:path.dirname for the sake of one call and keep the
  // dependency footprint of this file tight — `slice` on the last
  // separator is sufficient across platforms since `join` canonicalises
  // the path.
  const lastSep = Math.max(
    destPath.lastIndexOf('/'),
    destPath.lastIndexOf('\\'),
  );
  return lastSep < 0 ? '.' : destPath.slice(0, lastSep);
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as PROMOTE_USAGE };
