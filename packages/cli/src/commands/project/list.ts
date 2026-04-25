/**
 * `gobbi project list` — enumerate every project directory under
 * `.gobbi/projects/` and mark the currently-active one.
 *
 * ## Output format
 *
 * Tab-separated, one row per project, sorted alphabetically by name:
 *
 *   ```
 *   <marker>\t<name>
 *   ```
 *
 *   - `<marker>` is `*` when the project is active (matches
 *     `settings.json`'s `projects.active`); single space otherwise.
 *   - A plain `no projects` line is emitted to stdout when the
 *     `.gobbi/projects/` directory is absent or empty — exit code stays
 *     `0` because "no projects" is a valid state for a fresh repo that
 *     has not yet run `gobbi install`.
 *
 * The format is intentionally grep-friendly so that shell pipelines can
 * filter for the active project with `grep '^\*'` and the name with
 * `awk '{print $2}'`. No header row, no trailing summary, no ANSI
 * decoration — matches the style set by other `gobbi <verb> list`
 * commands.
 *
 * ## Source of truth for "active"
 *
 * Reads `projects.active` from the resolved cascade via
 * {@link resolveSettings} — the workspace tier wins at the
 * `projects.active` key (the project-tier file lives INSIDE the
 * workspace-declared active project, so making it overridable there
 * would create a cyclic dependency). Session tier overrides are
 * ignored because `gobbi project list` is session-independent.
 *
 * ## Exit codes
 *
 *   - `0` — list rendered (including the empty case).
 *   - `2` — argument parse error (unknown flags).
 *
 * @see `commands/project.ts` — sibling dispatcher
 * @see `lib/settings-io.ts::resolveSettings`
 * @see `lib/workspace-paths.ts::projectsRoot`
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import { resolveSettings } from '../../lib/settings-io.js';
import { projectsRoot } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi project list [options]

List every project directory under .gobbi/projects/ and mark the active
one (from settings.json's projects.active).

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

  // Resolve the active project. `resolveSettings` returns the cascaded
  // shape with `projects.active` guaranteed to exist (required by the
  // unified schema + DEFAULTS). May be `null` on a fresh repo that has
  // not yet picked an active project — rendered as "no active marker on
  // any row" in that case.
  //
  // Wrapped in try/catch because `resolveSettings` can throw
  // ConfigCascadeError when the on-disk settings file is malformed;
  // `list` should degrade to showing projects without a marker rather
  // than crashing.
  let active: string | null = null;
  try {
    const settings = resolveSettings({ repoRoot });
    active = settings.projects.active;
  } catch {
    active = null;
  }

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
