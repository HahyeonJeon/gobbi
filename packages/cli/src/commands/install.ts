/**
 * gobbi install — copy the shipped `.gobbi/projects/gobbi/{skills,agents,rules}/`
 * template bundle into the consumer repo.
 *
 * ## Context (PR-FIN-2a-i T-2a.3 — manifest removal)
 *
 * The plugin publishes the canonical gobbi-project content (skills,
 * agents, rules) inside the `@gobbitools/cli` npm tarball under
 * `.gobbi/projects/gobbi/{skills,agents,rules}/`. `gobbi install` lays
 * that content down into the consumer repo at
 * `.gobbi/projects/<projectName>/{skills,agents,rules}/`.
 *
 * ## Overwrite policy (replaces the prior 3-way-merge / install-manifest design)
 *
 * No manifest is read or written. The decision is per-file:
 *
 *   - If no destination file exists, copy the plugin bundle file into
 *     place.
 *   - If a destination file already exists and `--force` was NOT
 *     passed, refuse the install with exit 1 and a remediation hint
 *     pointing at `--force`.
 *   - If a destination file exists and `--force` WAS passed, the
 *     plugin-bundled file overwrites it unconditionally. User-authored
 *     files — anything that does NOT ship in the plugin bundle — are
 *     never inspected and never touched, since the copy loop iterates
 *     only over template-bundle paths.
 *
 * The `_-prefix` naming convention (`_git`, `_gotcha`, …) demarcates
 * plugin-owned skills/agents from user-owned ones; user-owned files do
 * not collide with plugin paths and so survive `--force`.
 *
 * ## Fresh activation vs content-only re-install
 *
 *   - **Fresh install** (no prior `.gobbi/settings.json`): completes
 *     the per-project setup in one command — copy templates, seed a
 *     minimum-shape `.gobbi/settings.json` (PR-FIN-1c: no `projects`
 *     registry), and build the `.claude/{skills,agents,rules}/`
 *     per-file symlink farm.
 *   - **Re-install** (settings.json already present): content-only.
 *     The settings file is left alone and the farm is not rebuilt —
 *     re-install preserves the operator's state.
 *
 * The `applyFreshInstallActivation` step is gated on
 * `existsSync(.gobbi/settings.json)`, so a `--force` re-install of
 * content does NOT mutate settings or rebuild the farm.
 *
 * ## Scope boundary
 *
 *   - Only `skills/`, `agents/`, and `rules/` are copied. Project docs
 *     (design, decisions, references, etc.) are NOT distributed — the
 *     "template bundle" lock restricts this command to the three
 *     content roots.
 *   - PR-FIN-2a-i T-2a.1.5: the active-session gate that previously
 *     refused installs while a session was in flight is gone alongside
 *     the JSON-pivot retirement of per-session `state.json`.
 *
 * ## Template location resolution
 *
 * Production: `<thisDir>/../../.gobbi/projects/gobbi/`, relative to the
 * compiled command module. When the CLI runs out of the npm tarball
 * `node_modules/@gobbitools/cli/dist/commands/install.js`, that
 * resolves to `node_modules/@gobbitools/cli/.gobbi/projects/gobbi/...`.
 * When it runs from a source/dev checkout
 * `packages/cli/src/commands/install.ts`, the same relative walk
 * resolves to `packages/cli/.gobbi/projects/gobbi/...`. We search both
 * — and the repo root's `.gobbi/projects/gobbi/...` — and pick the
 * first that exists. The dev fallback keeps the dogfooding workflow
 * working without a pre-publish step.
 *
 * @see `lib/workspace-paths.ts::projectSubdir`.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { isString } from '../lib/guards.js';
import { getRepoRoot } from '../lib/repo.js';
import {
  loadSettingsAtLevel,
  writeSettingsAtLevel,
} from '../lib/settings-io.js';
import type { Settings } from '../lib/settings.js';
import { buildFarmIntoRoot } from '../lib/symlink-farm.js';
import {
  type ClaudeSymlinkKind,
  projectSubdir,
} from '../lib/workspace-paths.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * The subset of {@link ClaudeSymlinkKind} that `gobbi install` distributes.
 * Extending the bundle is a deliberate design decision (see docblock
 * §"Scope boundary"); this array is the single source of truth.
 */
const TEMPLATE_KINDS: readonly ClaudeSymlinkKind[] = [
  'skills',
  'agents',
  'rules',
] as const;

const USAGE = `Usage: gobbi install [options]

Install the shipped gobbi template bundle
(.gobbi/projects/gobbi/{skills,agents,rules}/) into the target project.

Without --force, the install refuses if any destination file already
exists. With --force, plugin-bundled files overwrite existing files;
user-authored files (anything not in the bundle) survive untouched.

Fresh installs (no .gobbi/settings.json yet) also seed a minimum-shape
settings.json and build the .claude/{skills,agents,rules}/ symlink farm.
A re-install with --force is content-only — settings and the farm are
left alone.

Options:
  --project <name>   Target project name (default: 'gobbi')
  --force            Overwrite preexisting destination files. Without
                     this flag, a collision exits 1.
  --dry-run          Print the planned actions; write nothing.
  --help, -h         Show this help message

Exit codes:
  0  install / dry-run completed
  1  refused (collisions without --force, or template bundle missing)
  2  argument parse error`;

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/**
 * Test-time overrides. Production callers pass `{}`; tests thread a
 * scratch repo root and an explicit template root through to avoid
 * touching real `.gobbi/` or the real node_modules tarball.
 */
export interface InstallOverrides {
  /** Override repo root (defaults to `getRepoRoot()`). */
  readonly repoRoot?: string;
  /**
   * Override the template root — the directory that contains
   * `skills/`, `agents/`, and `rules/`. When omitted,
   * {@link resolveDefaultTemplateRoot} searches the module-relative
   * node_modules / source-checkout / repo-root candidates.
   */
  readonly templateRoot?: string;
}

/**
 * Per-file plan entry. The discriminant determines reporting output;
 * actions that perform a write also carry an absolute `dst` path.
 */
type PlanEntry =
  | { readonly kind: 'add'; readonly relPath: string }
  | { readonly kind: 'overwrite'; readonly relPath: string }
  | { readonly kind: 'collision'; readonly relPath: string };

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runInstall(args: string[]): Promise<void> {
  await runInstallWithOptions(args, {});
}

export async function runInstallWithOptions(
  args: string[],
  overrides: InstallOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // --- 1. Parse flags ----------------------------------------------------
  let projectName = 'gobbi';
  let dryRun = false;
  let force = false;
  try {
    const { values } = parseArgs({
      args,
      allowPositionals: false,
      options: {
        project: { type: 'string', default: 'gobbi' },
        'dry-run': { type: 'boolean', default: false },
        force: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    if (isString(values.project)) projectName = values.project;
    dryRun = values['dry-run'] === true;
    force = values.force === true;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi install: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  // --- 2. Resolve repo + template roots ---------------------------------
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const templateRoot = overrides.templateRoot ?? resolveDefaultTemplateRoot();
  if (templateRoot === null) {
    process.stderr.write(
      'gobbi install: cannot locate template bundle. Expected .gobbi/projects/gobbi/{skills,agents,rules}/ under node_modules/@gobbitools/cli/ or the repo root.\n',
    );
    process.exit(1);
    return;
  }

  // --- 3. Enumerate templates + classify per-file ------------------------
  //
  // PR-FIN-2a-i T-2a.1.5 retired the state-based active-session gate
  // that previously sat in this position; the JSON-pivot memory model
  // removed the per-session `state.json` it depended on.
  const projectRoot = join(repoRoot, '.gobbi', 'projects', projectName);
  const templateFiles = enumerateTemplateFiles(templateRoot);
  const plan = planInstall({
    templateFiles,
    projectRoot,
    force,
  });

  const collisions = plan.filter((p): p is PlanEntry & { readonly kind: 'collision' } => p.kind === 'collision');
  const writes = plan.filter((p): p is PlanEntry & { readonly kind: 'add' | 'overwrite' } =>
    p.kind === 'add' || p.kind === 'overwrite',
  );

  // --- 4. Refuse on collisions without --force ---------------------------
  if (collisions.length > 0) {
    process.stdout.write(
      renderPlan({ projectName, plan, dryRun, projectRoot }),
    );
    process.stderr.write(
      `gobbi install: ${String(collisions.length)} destination file(s) already exist; pass --force to overwrite plugin-bundled files (user-authored files are never touched).\n`,
    );
    for (const c of collisions) {
      process.stderr.write(`  ${c.relPath}\n`);
    }
    process.exit(1);
    return;
  }

  // --- 5. Execute writes (or print under --dry-run) ----------------------
  if (!dryRun) {
    for (const entry of writes) {
      copyFile(
        join(templateRoot, entry.relPath),
        join(projectRoot, entry.relPath),
      );
    }
  }

  // --- 6. Fresh-install activation (settings + farm) ---------------------
  //
  // Fresh installs complete the per-project setup in one command:
  // seed `.gobbi/settings.json` at minimum shape (`{schemaVersion: 1}`)
  // when absent, then build the `.claude/{skills,agents,rules}/`
  // per-file symlink farm pointing at this project. PR-FIN-1c removed
  // the `projects` registry, so no `projects.active` / `projects.known`
  // writes happen — the directory tree under `.gobbi/projects/` is the
  // sole source of truth, and the active project resolves via
  // `basename(repoRoot)` (or the `--project` flag) at command time.
  //
  // Re-installs (settings.json already present) skip this step to
  // preserve the operator's existing settings + farm.
  //
  // Dry-run still emits the plan lines but does not mutate the
  // filesystem.
  const isFreshInstall = !existsSync(
    join(repoRoot, '.gobbi', 'settings.json'),
  );
  const activation: FreshActivationResult | null = isFreshInstall
    ? applyFreshInstallActivation({
        repoRoot,
        projectName,
        dryRun,
      })
    : null;

  process.stdout.write(
    renderPlan({
      projectName,
      plan,
      dryRun,
      projectRoot,
      activation,
    }),
  );
}

// ---------------------------------------------------------------------------
// Template root resolution
// ---------------------------------------------------------------------------

/**
 * Module-relative walk-and-stat search for the bundled template root.
 *
 * Searched, in order (first hit wins):
 *
 *   1. `<thisDir>/../../.gobbi/projects/gobbi/`
 *        Matches both `node_modules/@gobbitools/cli/dist/commands/install.js`
 *        (node_modules install) and `packages/cli/src/commands/install.ts`
 *        (source-checkout install). Preferred path.
 *
 *   2. `<thisDir>/../../../.gobbi/projects/gobbi/`
 *        When commands live one level deeper (e.g. a future reorg into
 *        `dist/commands/install/`), step up one extra level.
 *
 *   3. `<repo-root>/.gobbi/projects/gobbi/` — dev-checkout fallback for
 *        the scenario where the CLI runs from a linked worktree without
 *        a local `node_modules/@gobbitools/cli/` entry.
 *
 * Returns `null` if none match. The caller prints a hint and exits 1;
 * tests pass an explicit `templateRoot` override to bypass the search.
 */
export function resolveDefaultTemplateRoot(): string | null {
  const thisDir = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    resolve(thisDir, '..', '..', '.gobbi', 'projects', 'gobbi'),
    resolve(thisDir, '..', '..', '..', '.gobbi', 'projects', 'gobbi'),
    // Repo-root fallback: walk up from the module dir until we hit a
    // `.gobbi/projects/gobbi/` that contains the three template kinds.
    // Bounded to six ancestor levels so the walk terminates cleanly even
    // in unusual layouts.
    ...ancestorCandidates(thisDir, 6),
  ];

  for (const candidate of candidates) {
    if (hasAllTemplateKinds(candidate)) return candidate;
  }
  return null;
}

function ancestorCandidates(startDir: string, depth: number): string[] {
  const out: string[] = [];
  let cur = startDir;
  for (let i = 0; i < depth; i++) {
    const parent = dirname(cur);
    if (parent === cur) break;
    out.push(resolve(parent, '.gobbi', 'projects', 'gobbi'));
    cur = parent;
  }
  return out;
}

function hasAllTemplateKinds(root: string): boolean {
  if (!existsSync(root)) return false;
  for (const kind of TEMPLATE_KINDS) {
    const sub = join(root, kind);
    try {
      if (!statSync(sub).isDirectory()) return false;
    } catch {
      return false;
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// Template enumeration
// ---------------------------------------------------------------------------

/**
 * Collect every file that the template ships, keyed by its path relative
 * to the template root with forward-slash separators. Deterministic order
 * (sorted) so plan output is stable across runs.
 */
function enumerateTemplateFiles(templateRoot: string): readonly string[] {
  const out: string[] = [];
  for (const kind of TEMPLATE_KINDS) {
    const root = join(templateRoot, kind);
    if (!existsSync(root)) continue;
    for (const abs of walkFilesSync(root)) {
      const rel = relative(templateRoot, abs).split(/[\\/]/).join('/');
      out.push(rel);
    }
  }
  out.sort();
  return out;
}

function walkFilesSync(dir: string): readonly string[] {
  const out: string[] = [];
  const stack: string[] = [dir];
  while (stack.length > 0) {
    const top = stack.pop();
    if (top === undefined) break;
    let entries: string[];
    try {
      entries = readdirSync(top);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const abs = join(top, entry);
      let st: ReturnType<typeof statSync>;
      try {
        st = statSync(abs);
      } catch {
        continue;
      }
      if (st.isDirectory()) stack.push(abs);
      else if (st.isFile()) out.push(abs);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Per-file planning
// ---------------------------------------------------------------------------

interface PlanInput {
  readonly templateFiles: readonly string[];
  readonly projectRoot: string;
  readonly force: boolean;
}

/**
 * Per-file plan: each template file is `add` (no destination yet),
 * `overwrite` (destination exists and `--force` was passed), or
 * `collision` (destination exists, no `--force`). The caller surfaces
 * collisions via stderr and exits 1 before any write happens.
 */
function planInstall(input: PlanInput): readonly PlanEntry[] {
  const out: PlanEntry[] = [];
  for (const relPath of input.templateFiles) {
    const exists = existsSync(join(input.projectRoot, relPath));
    if (!exists) {
      out.push({ kind: 'add', relPath });
    } else if (input.force) {
      out.push({ kind: 'overwrite', relPath });
    } else {
      out.push({ kind: 'collision', relPath });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// File I/O helpers
// ---------------------------------------------------------------------------

function copyFile(src: string, dst: string): void {
  mkdirSync(dirname(dst), { recursive: true });
  const content = readFileSync(src);
  writeFileSync(dst, content);
}

// ---------------------------------------------------------------------------
// Plan rendering
// ---------------------------------------------------------------------------

interface RenderPlanInput {
  readonly projectName: string;
  readonly plan: readonly PlanEntry[];
  readonly dryRun: boolean;
  readonly projectRoot: string;
  readonly activation?: FreshActivationResult | null;
}

export function renderPlan(input: RenderPlanInput): string {
  const prefix = input.dryRun ? '[dry-run] ' : '';
  const lines: string[] = [];
  lines.push(`${prefix}gobbi install — project '${input.projectName}'`);

  // Sort each category for deterministic output.
  const sorted = [...input.plan].sort((a, b) =>
    a.relPath.localeCompare(b.relPath),
  );

  for (const entry of sorted) {
    switch (entry.kind) {
      case 'add':
        lines.push(`${prefix}ADD       ${entry.relPath}`);
        break;
      case 'overwrite':
        lines.push(`${prefix}OVERWRITE ${entry.relPath}`);
        break;
      case 'collision':
        lines.push(`${prefix}COLLISION ${entry.relPath} (use --force to overwrite)`);
        break;
    }
  }

  const addCount = sorted.filter((a) => a.kind === 'add').length;
  const overwriteCount = sorted.filter((a) => a.kind === 'overwrite').length;
  const collisionCount = sorted.filter((a) => a.kind === 'collision').length;

  lines.push('');
  lines.push(
    `${prefix}summary: ${addCount} added, ${overwriteCount} overwritten, ${collisionCount} collision(s)`,
  );

  // Fresh-install activation diagnostics — emitted for both dry-run
  // (so operators can preview) and real runs (so the one-command
  // completion is visible).
  if (input.activation !== undefined && input.activation !== null) {
    const a = input.activation;
    lines.push(
      `${prefix}settings: seeded .gobbi/settings.json (project '${input.projectName}')`,
    );
    lines.push(
      `${prefix}farm: ${a.farmKinds.join(', ')} -> .gobbi/projects/${input.projectName}/`,
    );
  }

  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Fresh-install activation (settings.json + .claude/ farm)
// ---------------------------------------------------------------------------

/**
 * Result of the fresh-install activation step. Surfaced to the caller
 * so {@link renderPlan} can diagnose what was (or would be) written.
 *
 * PR-FIN-1c removed the `projects` registry, so the result no longer
 * carries `active` / `known` arrays — fresh install only seeds a
 * minimum-shape `.gobbi/settings.json` and builds the farm.
 */
export interface FreshActivationResult {
  /** The three farm kinds materialised at `.claude/<kind>/`. */
  readonly farmKinds: readonly ClaudeSymlinkKind[];
}

interface ApplyFreshActivationInput {
  readonly repoRoot: string;
  readonly projectName: string;
  readonly dryRun: boolean;
}

/**
 * Fresh-install post-copy step: seed a minimum-shape
 * `.gobbi/settings.json` if absent and materialise the
 * `.claude/{skills,agents,rules}/` per-file symlink farm pointing at
 * the newly-installed project.
 *
 * Dry-run mode computes and returns the intended result without
 * touching the filesystem — callers render it via {@link renderPlan}.
 *
 * Re-installs (settings.json already present) MUST NOT call this
 * function — re-install is content-only. The caller gates the call at
 * {@link runInstallWithOptions}.
 *
 * PR-FIN-1c: no more `projects.active` / `projects.known` writes; the
 * directory tree under `.gobbi/projects/` is the source of truth.
 */
function applyFreshInstallActivation(
  input: ApplyFreshActivationInput,
): FreshActivationResult {
  const { repoRoot, projectName, dryRun } = input;

  if (!dryRun) {
    // Seed the workspace settings file at minimum shape if absent. We
    // never overwrite an existing file (the operator may have made
    // edits we should not stomp). The unified schema allows other
    // sections; absent sections delegate to DEFAULTS at resolve time.
    const existing = loadSettingsAtLevel(repoRoot, 'workspace');
    if (existing === null) {
      const seed: Settings = { schemaVersion: 1 };
      writeSettingsAtLevel(repoRoot, 'workspace', seed);
    }
    // Build the farm directly at `.claude/` (fresh-install = first
    // activation, nothing to rotate). `buildFarmIntoRoot` preserves
    // non-farm siblings under `.claude/` (CLAUDE.md, settings.json,
    // etc.) and wipes only the three per-kind subdirectories it owns
    // — see the docblock on `buildFarmIntoRoot` for the preservation
    // contract.
    const claudeRoot = join(repoRoot, '.claude');
    buildFarmIntoRoot(repoRoot, claudeRoot, projectName);
  }

  return {
    farmKinds: TEMPLATE_KINDS,
  };
}

// ---------------------------------------------------------------------------
// seedProjectFromTemplates — content-copy helper for `gobbi project create`
// ---------------------------------------------------------------------------

/**
 * Result of a {@link seedProjectFromTemplates} call. Callers surface
 * these counts / paths to the user so they can see what landed.
 */
export interface SeedResult {
  readonly projectName: string;
  readonly projectRoot: string;
  readonly filesCopied: number;
  readonly templateRoot: string;
}

/** Arguments for {@link seedProjectFromTemplates}. */
export interface SeedProjectOptions {
  readonly repoRoot: string;
  readonly projectName: string;
  /**
   * Optional explicit template-root override. Tests pass an explicit
   * path to avoid depending on the bundle layout; production callers
   * omit this and let the same resolver
   * {@link resolveDefaultTemplateRoot} that `runInstall` uses pick up
   * the npm-bundle / source-checkout / dev-fallback path.
   */
  readonly templateRoot?: string;
  /**
   * When `true`, plugin-bundled files overwrite preexisting destination
   * files (matches the new `gobbi install --force` semantics). When
   * `false` (default) and the target project already has skills /
   * agents / rules content, the seeder throws {@link SeedError} with
   * `kind: 'already-populated'` so the caller can surface a clear
   * diagnostic.
   */
  readonly force?: boolean;
}

/**
 * Errors surfaced by {@link seedProjectFromTemplates}. Callers pattern-match
 * on `kind` to decide how to report.
 */
export class SeedError extends Error {
  constructor(
    message: string,
    readonly kind: 'template-not-found' | 'already-populated',
  ) {
    super(message);
    this.name = 'SeedError';
  }
}

/**
 * Copy every file from the resolved template bundle into
 * `.gobbi/projects/<projectName>/{skills,agents,rules}/`. Pure
 * content-copy helper — does NOT touch `.gobbi/settings.json` and does
 * NOT build the `.claude/` farm. Those responsibilities belong to the
 * caller (either {@link runInstallWithOptions} for the fresh-install
 * path, or `commands/project/create.ts` for the project-create
 * seeding hook).
 *
 * Idempotency: when `force: false` and the project already has any
 * file under skills / agents / rules, throws {@link SeedError} with
 * `kind: 'already-populated'`. When `force: true`, plugin-bundled
 * files overwrite existing destinations (matches `gobbi install
 * --force`); user-authored files outside the bundle survive untouched.
 *
 * @see `commands/project/create.ts::trySeedFromInstallTemplates` — the
 *      primary caller outside of fresh-install.
 */
export function seedProjectFromTemplates(
  options: SeedProjectOptions,
): SeedResult {
  const { repoRoot, projectName } = options;

  const templateRoot =
    options.templateRoot ?? resolveDefaultTemplateRoot();
  if (templateRoot === null) {
    throw new SeedError(
      'cannot locate template bundle. Expected .gobbi/projects/gobbi/{skills,agents,rules}/ under node_modules/@gobbitools/cli/ or the repo root.',
      'template-not-found',
    );
  }

  const projectRoot = join(repoRoot, '.gobbi', 'projects', projectName);

  if (!options.force && targetHasPreexistingContent(projectRoot)) {
    throw new SeedError(
      `project '${projectName}' already has skills/agents/rules content at ${projectRoot}; pass force: true to overwrite plugin-bundled files`,
      'already-populated',
    );
  }

  const templateFiles = enumerateTemplateFiles(templateRoot);
  let filesCopied = 0;

  for (const relPath of templateFiles) {
    const srcAbs = join(templateRoot, relPath);
    const dstAbs = join(projectRoot, relPath);
    copyFile(srcAbs, dstAbs);
    filesCopied++;
  }

  return {
    projectName,
    projectRoot,
    filesCopied,
    templateRoot,
  };
}

/**
 * `true` iff the target project root already contains any file under
 * `skills/`, `agents/`, or `rules/`. Used by
 * {@link seedProjectFromTemplates} to refuse re-seeding without
 * `force: true`.
 */
function targetHasPreexistingContent(projectRoot: string): boolean {
  for (const kind of TEMPLATE_KINDS) {
    const dir = join(projectRoot, kind);
    if (!existsSync(dir)) continue;
    try {
      if (!statSync(dir).isDirectory()) continue;
    } catch {
      continue;
    }
    if (walkFilesSync(dir).length > 0) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Internal exports (for tests)
// ---------------------------------------------------------------------------

export const __INTERNALS__ = {
  TEMPLATE_KINDS,
  enumerateTemplateFiles,
  planInstall,
  projectSubdir,
};
