/**
 * `gobbi project list` — enumerate every project directory under
 * `.gobbi/projects/` and mark the currently-active one (PR-FIN-1c).
 *
 * ## Output format
 *
 * Tab-separated, one row per project, sorted alphabetically by name:
 *
 *   ```
 *   <marker>\t<name>
 *   ```
 *
 *   - `<marker>` is `*` when the project name matches `basename(repoRoot)`
 *     (the default project for this repo); single space otherwise.
 *   - A plain `no projects` line is emitted to stdout when the
 *     `.gobbi/projects/` directory is absent or empty — exit code stays
 *     `0` because "no projects" is a valid state for a fresh repo.
 *
 * The format is intentionally grep-friendly: `grep '^\*'` filters for
 * the active project; `awk '{print $2}'` extracts the name.
 *
 * ## Source of truth for "active" (PR-FIN-1c)
 *
 * Pre-PR-FIN-1c, `projects.active` in `settings.json` named the active
 * project. PR-FIN-1c removed that registry. The "active" marker now
 * reflects `basename(repoRoot)` — the project a `--project`-less command
 * would resolve. Operators that need to address a different project pass
 * `--project <name>` to each command; this command surfaces the default.
 *
 * ## Exit codes
 *
 *   - `0` — list rendered (including the empty case).
 *   - `2` — argument parse error (unknown flags).
 *
 * @see `commands/project.ts` — sibling dispatcher
 * @see `lib/workspace-paths.ts::projectsRoot`
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { basename } from 'node:path';
import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import { projectsRoot } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi project list [options]

List every project directory under .gobbi/projects/ and mark the active
one (matches basename of the repo root).

Output format: tab-separated "<marker>\\t<name>" rows, sorted by name.
The marker is '*' for the active project and ' ' (space) otherwise.

Options:
  --help, -h    Show this help message`;

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/**
 * Test-time overrides. Production callers pass `{}`; tests thread a
 * scratch repo root through `repoRoot` to avoid touching real `.gobbi/`.
 */
export interface ProjectListOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runProjectList(args: string[]): Promise<void> {
  await runProjectListWithOptions(args, {});
}

export async function runProjectListWithOptions(
  args: string[],
  overrides: ProjectListOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  try {
    parseArgs({
      args,
      allowPositionals: false,
      options: {
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi project list: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  const repoRoot = overrides.repoRoot ?? getRepoRoot();

  const projects = enumerateProjects(repoRoot);

  if (projects.length === 0) {
    process.stdout.write('no projects\n');
    return;
  }

  // PR-FIN-1c: the active project is `basename(repoRoot)`. The `*`
  // marker fires when a directory under `.gobbi/projects/` matches that
  // name; otherwise every row carries a space marker.
  const active = basename(repoRoot);

  for (const name of projects) {
    const marker = name === active ? '*' : ' ';
    process.stdout.write(`${marker}\t${name}\n`);
  }
}

// ---------------------------------------------------------------------------
// Project enumeration
// ---------------------------------------------------------------------------

/**
 * Return the alphabetically-sorted list of directory names under
 * `.gobbi/projects/`. Non-directory children are skipped. Missing root
 * degrades silently to `[]`.
 *
 * Kept pure (no stderr emission, no exit) so the caller controls all
 * diagnostics and tests can exercise it deterministically.
 */
function enumerateProjects(repoRoot: string): readonly string[] {
  const root = projectsRoot(repoRoot);
  if (!existsSync(root)) return [];

  let entries: string[];
  try {
    entries = readdirSync(root);
  } catch {
    return [];
  }

  const out: string[] = [];
  for (const name of entries) {
    try {
      if (statSync(`${root}/${name}`).isDirectory()) {
        out.push(name);
      }
    } catch {
      continue;
    }
  }
  out.sort();
  return out;
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as PROJECT_LIST_USAGE };
