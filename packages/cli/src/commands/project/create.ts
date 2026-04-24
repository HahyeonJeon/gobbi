/**
 * `gobbi project create <name>` — scaffold a new project directory tree
 * under `.gobbi/projects/<name>/` and register the name in
 * `settings.json`'s `projects.known` array.
 *
 * ## Scaffold
 *
 * Creates the following directories (all empty) matching the taxonomy
 * the default `gobbi` project carries:
 *
 *   design/          learnings/gotchas/   notes/
 *   references/      rules/               skills/
 *   agents/          sessions/
 *
 * These are a deliberate subset of {@link PROJECT_SUBDIR_KINDS} — only
 * the dirs a freshly-created project actually needs at birth are
 * materialised. The rest of the taxonomy (decisions, scenarios,
 * checklists, playbooks, backlogs, reviews, worktrees) are created
 * on-demand by the downstream commands that populate them, following
 * the same lazy-create discipline the default project uses.
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
 *     Landed as part of the W5-eval F1+F2 remediation.
 *   - Fallback (shape drifts): stderr warning pointing at
 *     `gobbi install`; scaffold directories stay empty.
 *
 * The seed helper is content-only. It writes templates and the install
 * manifest, but does NOT touch `settings.json` or build the `.claude/`
 * symlink farm — the farm and activation belong to fresh-install + the
 * `gobbi project switch` path respectively.
 *
 * ## settings.json update
 *
 * Appends `<name>` to `projects.known` (deduped) via
 * {@link writeSettingsAtLevel} at the `workspace` tier. Does NOT set
 * `projects.active` — the operator must explicitly run
 * `gobbi project switch <name>` to rotate the symlink farm. Creating
 * a project does not change the loaded skill/agent/rule set.
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

import { existsSync, mkdirSync } from 'node:fs';
import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import {
  loadSettingsAtLevel,
  writeSettingsAtLevel,
} from '../../lib/settings-io.js';
import type { Settings } from '../../lib/settings.js';
import { projectDir, projectSubdir } from '../../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi project create <name>

Scaffold a new project under .gobbi/projects/<name>/ and register the
name in settings.json's projects.known array. Does NOT activate the
project — run 'gobbi project switch <name>' to rotate the symlink farm.

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
 * The subset of the taxonomy materialised at create time. Kept
 * intentionally narrow — the rest of the taxonomy
 * ({@link PROJECT_SUBDIR_KINDS}) is created on-demand by the commands
 * that populate them. See module JSDoc for the rationale.
 *
 * `learnings/gotchas/` is the nested gotcha storage location per
 * `commands/gotcha/promote.ts` which writes gotchas there. Creating
 * the parent `learnings/` dir alone would leave `promote` to mkdir the
 * child, but scaffolding both up front keeps the on-disk shape
 * self-documenting.
 */
const SCAFFOLD_DIRS: readonly string[] = [
  'design',
  'learnings',
  'learnings/gotchas',
  'notes',
  'references',
  'rules',
  'skills',
  'agents',
  'sessions',
];

// ---------------------------------------------------------------------------
// Name validation
// ---------------------------------------------------------------------------

/**
 * Lowercase letters, digits, and hyphens only. The body-start and
 * body-end characters exclude hyphens so names like `-foo` or `foo-`
 * are rejected upstream of any directory create. One-character names
 * pass (e.g. `a`).
 */
const NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Reserved filesystem names that must never be accepted as a project
 * name even though they pass the {@link NAME_PATTERN}. Kept small —
 * the pattern already excludes `/`, `\`, `.`, `_`, and whitespace, so
 * only the two dot-only sentinels make it this far (but the pattern
 * also excludes `.` entirely via its character class; this array is a
 * defense-in-depth belt against future pattern loosening).
 */
const RESERVED_NAMES: ReadonlySet<string> = new Set(['', '.', '..']);

export type NameValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: string };

/**
 * Validate a candidate project name against the rules documented on
 * the command-level JSDoc. Pure function — no I/O, no existence check
 * (that belongs to the caller, who already has the `repoRoot`).
 */
export function validateProjectName(name: string): NameValidationResult {
  if (RESERVED_NAMES.has(name)) {
    return { ok: false, reason: `name cannot be "${name}"` };
  }
  if (!NAME_PATTERN.test(name)) {
    return {
      ok: false,
      reason:
        'name must be lowercase letters, digits, and hyphens only ' +
        '(no leading/trailing hyphen, no path separators)',
    };
  }
  return { ok: true };
}

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
  // `recursive: true` makes each call idempotent and handles the parent
  // chain (e.g. `.gobbi/projects/<name>/learnings/` is materialised by
  // the `learnings/gotchas/` call's recursive flag even if the plain
  // `learnings/` call had already returned).
  mkdirSync(targetDir, { recursive: true });
  for (const dir of SCAFFOLD_DIRS) {
    // `projectSubdir` only accepts the narrow ProjectSubdirKind union;
    // `learnings/gotchas/` is a deliberate nested path that the facade
    // does not model, so fall back to direct path join for the scaffold
    // list. Staying outside the facade for this single purpose is
    // deliberate — the facade is designed for known-kind lookups, not
    // for arbitrary nested trees.
    mkdirSync(`${targetDir}/${dir}`, { recursive: true });
  }

  // --- Seeding hook -----------------------------------------------------
  //
  // W5.3 owns template seeding. W5.4 landed first in this plan execution
  // order, so we do a best-effort dynamic import guard: if the install
  // module exposes a re-usable seed function we call it, otherwise we
  // emit a stderr warning so the operator knows to run `gobbi install`.
  //
  // The guard is intentionally narrow — we check for the specific
  // module and exported function name the W5.3 plan mentions. If W5.3
  // lands with a different shape, this hook will simply fall through
  // to the warning path (no crash, no false success).
  await trySeedFromInstallTemplates(repoRoot, name);

  // --- settings.json update --------------------------------------------
  //
  // Read the workspace-level `settings.json` DIRECTLY (not through
  // `resolveSettings`) because we need to rewrite EXACTLY the workspace
  // tier without picking up cascade-merged fields from project/session
  // tiers. A round-trip through the cascade would write hydrated
  // defaults into the workspace file, violating the "keep user files
  // sparse" discipline from `ensure-settings-cascade.ts`.
  //
  // When the workspace file is absent (fresh repo pre-`gobbi install`),
  // we seed it with the minimal shape the unified schema requires:
  // `schemaVersion: 1` + an empty `projects` registry. This matches the
  // seed `ensureSettingsCascade` writes on first-run.
  const existing = loadSettingsAtLevel(repoRoot, 'workspace');
  const base: Settings =
    existing !== null
      ? existing
      : { schemaVersion: 1, projects: { active: null, known: [] } };

  const knownSet = new Set(base.projects.known);
  knownSet.add(name);
  const updated: Settings = {
    ...base,
    projects: {
      active: base.projects.active,
      known: [...knownSet].sort(),
    },
  };
  writeSettingsAtLevel(repoRoot, 'workspace', updated);

  process.stdout.write(
    `Created project '${name}' at ${targetDir}\n` +
      `Registered in .gobbi/settings.json (projects.known).\n` +
      `Run 'gobbi project switch ${name}' to activate it.\n`,
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
 * `.gobbi/projects/<projectName>/{skills,agents,rules}/` and writes the
 * install manifest. It does NOT touch `settings.json` or build the
 * `.claude/` farm — those are fresh-install-only concerns and do not
 * apply to project creation.
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

export { USAGE as PROJECT_CREATE_USAGE, SCAFFOLD_DIRS };
