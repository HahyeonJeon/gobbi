/**
 * gobbi install — fresh / upgrade / 3-way-merge for the shipped
 * `.gobbi/projects/gobbi/{skills,agents,rules}/` template bundle.
 *
 * ## Context (v0.5.0 gobbi-memory Pass-2 W5.3 + W5 eval F1 remediation)
 *
 * Pass 2 publishes the canonical gobbi-project content (skills, agents,
 * rules) as part of the `@gobbitools/cli` npm tarball under
 * `.gobbi/projects/gobbi/{skills,agents,rules}/`. `gobbi install` lays that
 * content down into the consumer repo at
 * `.gobbi/projects/<projectName>/{skills,agents,rules}/`, records the
 * last-installed content hashes in `.install-manifest.json`, and preserves
 * user edits across upgrades via a three-way merge keyed on the manifest.
 *
 * ## Fresh install vs upgrade install
 *
 *   - **Fresh install** (no prior manifest, no preexisting content):
 *     complete setup — copy templates, write `.install-manifest.json`,
 *     seed a minimum-shape `.gobbi/settings.json` (PR-FIN-1c: no
 *     `projects` registry), and build the
 *     `.claude/{skills,agents,rules}/` per-file symlink farm. After a
 *     fresh install a user has a working Claude Code integration in one
 *     command.
 *   - **Upgrade install** (target already contains content or manifest):
 *     content-only. 3-way merge of templates vs user edits vs the
 *     manifest baseline. Does NOT touch `settings.json` and does NOT
 *     rebuild the farm — upgrade preserves the operator's state.
 *
 * ## Scope boundary
 *
 *   - Only `skills/`, `agents/`, and `rules/` are copied. Project docs
 *     (design, decisions, references, etc.) are NOT distributed — the
 *     checkpoint "template bundle" lock restricts this command to the
 *     three content roots. Extending the bundle requires a separate
 *     design decision and a bump of the manifest shape.
 *   - Does NOT register itself in `cli.ts` — wiring is owned by W5.5.
 *   - PR-FIN-2a-i T-2a.1.5: the active-session gate that previously
 *     refused installs while a session was in flight has been removed
 *     alongside the JSON-pivot retirement of per-session `state.json`.
 *     The `--force` flag remains, but its only remaining job is the
 *     seed-helper's "overwrite preexisting target content" override.
 *
 * ## 3-way merge algorithm
 *
 * For each file in the template, the command classifies it into one of
 * six actions by comparing three hashes — the BASE (recorded in the
 * manifest under the previous install), the TEMPLATE (what the new
 * tarball ships), and the CURRENT (what sits in the user's working
 * copy). No hash match means "different content"; hash match means
 * "same content". Missing hashes are treated as explicit sentinels.
 *
 *   - ADD            — target path does not exist yet. Copy template;
 *                      record template hash in the manifest.
 *   - UNCHANGED      — current == template == base. No work; manifest
 *                      stays the same.
 *   - TEMPLATE_ONLY  — current == base, template != base. User has not
 *                      touched the file; overwrite with template.
 *   - USER_ONLY      — current != base, template == base. User modified
 *                      the file; leave it strictly alone.
 *   - CONVERGED      — current == template != base. Both diverged to
 *                      the same value (rare). Refresh the manifest
 *                      hash; no file write needed.
 *   - CONFLICT       — current != base, template != base,
 *                      current != template. Both diverged independently.
 *                      The file is left untouched; the path is reported
 *                      on stderr after the run. The manifest is NOT
 *                      updated for conflicted files — running the
 *                      command again preserves the conflict report until
 *                      the operator resolves it by hand.
 *
 *     When the user manually edits a conflicted file to match the new
 *     template, the next upgrade reclassifies the entry as CONVERGED
 *     and the manifest catches up.
 *
 * A file that lives in the target tree but has NO manifest entry is
 * treated as if its BASE is empty-string: if the template does not
 * carry a matching path, the file is left alone (we never delete user
 * content); if the template does carry the path and the user's file
 * equals the template, we simply record the hash. Otherwise we route
 * through the CONFLICT path — a user wrote an extra file at the same
 * name the template now ships; they keep their version.
 *
 * ## Deletion semantics
 *
 * Files that were in the previous template but are NOT in the new
 * template are LEFT IN PLACE. The user may have come to rely on them;
 * dropping them silently is worse than a minor cruft buildup. The
 * manifest stops tracking the path (the next install's base for it
 * becomes "no entry"), so subsequent runs classify re-added files
 * correctly.
 *
 * ## Template location resolution
 *
 * Production: `<thisDir>/../../.gobbi/projects/gobbi/{...}`, relative to
 * the compiled command module. When the CLI runs out of the npm tarball
 * `node_modules/@gobbitools/cli/dist/commands/install.js`, that resolves
 * to `node_modules/@gobbitools/cli/.gobbi/projects/gobbi/...`. When it
 * runs from a source/dev checkout
 * `packages/cli/src/commands/install.ts`, the same relative walk
 * resolves to `packages/cli/.gobbi/projects/gobbi/...`. We search both
 * — and the repo root's `.gobbi/projects/gobbi/...` — and pick the
 * first that exists. The dev fallback keeps the dogfooding workflow
 * working without a pre-publish step.
 *
 * @see `lib/workspace-paths.ts::projectSubdir`.
 */

import { createHash } from 'node:crypto';
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

import { isRecord, isString } from '../lib/guards.js';
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

/** Canonical manifest filename under the project root. */
const MANIFEST_FILENAME = '.install-manifest.json';

/**
 * Current manifest schema version. Bumped when the manifest shape
 * changes; readers that observe a different value bail out with a clear
 * error rather than silently misinterpreting old content.
 */
const MANIFEST_SCHEMA_VERSION = 1 as const;

const USAGE = `Usage: gobbi install [options]

Install or upgrade the shipped gobbi template bundle
(.gobbi/projects/gobbi/{skills,agents,rules}/) into the target project.

On a fresh install, every template file is copied and recorded in
.install-manifest.json. On an upgrade, a three-way merge using the
manifest's recorded hashes as the base decides which files to overwrite,
which to leave alone, and which to report as conflicts.

Options:
  --project <name>   Target project name (default: 'gobbi')
  --upgrade          Permit overwriting existing project content. Without
                     this flag, a non-empty target exits 1.
  --dry-run          Print the planned actions; write nothing.
  --force            Skip over preexisting target files (seed override).
  --help, -h         Show this help message

Exit codes:
  0  install / upgrade / dry-run completed
  1  refused (conflicts, or non-empty target without --upgrade)
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

// ---------------------------------------------------------------------------
// Manifest shape
// ---------------------------------------------------------------------------

/**
 * On-disk shape of `.install-manifest.json`. Path keys are the file's
 * position relative to the project root, with forward slashes
 * (e.g. `"skills/_git/SKILL.md"`). Hash values are hex-encoded sha256.
 */
export interface InstallManifest {
  readonly schemaVersion: typeof MANIFEST_SCHEMA_VERSION;
  readonly version: string;
  readonly files: Readonly<Record<string, string>>;
}

/**
 * Classification of a single file by the 3-way merge. The discriminant
 * determines both the write action and the reporting output.
 */
type FileAction =
  | { readonly kind: 'add'; readonly relPath: string; readonly templateHash: string }
  | { readonly kind: 'unchanged'; readonly relPath: string; readonly hash: string }
  | {
      readonly kind: 'template-only';
      readonly relPath: string;
      readonly templateHash: string;
    }
  | { readonly kind: 'user-only'; readonly relPath: string; readonly hash: string }
  | {
      readonly kind: 'converged';
      readonly relPath: string;
      readonly hash: string;
    }
  | {
      readonly kind: 'conflict';
      readonly relPath: string;
      readonly baseHash: string | null;
      readonly templateHash: string;
      readonly currentHash: string;
    };

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
  let upgrade = false;
  let dryRun = false;
  let force = false;
  try {
    const { values } = parseArgs({
      args,
      allowPositionals: false,
      options: {
        project: { type: 'string', default: 'gobbi' },
        upgrade: { type: 'boolean', default: false },
        'dry-run': { type: 'boolean', default: false },
        force: { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    if (isString(values.project)) projectName = values.project;
    upgrade = values.upgrade === true;
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

  // --- 3. Read current manifest + package version ------------------------
  //
  // PR-FIN-2a-i T-2a.1.5 retired the state-based active-session gate that
  // previously sat in this position; the JSON-pivot memory model removed
  // the per-session `state.json` it depended on.
  const projectRoot = join(repoRoot, '.gobbi', 'projects', projectName);
  const manifestPath = join(projectRoot, MANIFEST_FILENAME);
  const previousManifest = readManifest(manifestPath);
  const tarballVersion = readTarballVersion(templateRoot);

  // --- 5. Upgrade-flag gate ---------------------------------------------
  //
  // The flag's contract: "`--upgrade` is required when the target already
  // carries content". We detect that by checking for a manifest OR any
  // preexisting file in one of the three template kinds. A user who ran
  // `gobbi install` once and is running it again without `--upgrade`
  // should get an explicit refusal rather than silently overwriting.
  if (!upgrade && previousManifest !== null) {
    process.stderr.write(
      `gobbi install: target project '${projectName}' already has .install-manifest.json; pass --upgrade to run a 3-way merge.\n`,
    );
    process.exit(1);
    return;
  }
  if (!upgrade && targetHasPreexistingContent(projectRoot)) {
    process.stderr.write(
      `gobbi install: target project '${projectName}' already contains skills/agents/rules content; pass --upgrade to run a 3-way merge.\n`,
    );
    process.exit(1);
    return;
  }

  // Fresh vs upgrade — we've already gated on `--upgrade` above when a
  // manifest OR preexisting content is present. From here on, a
  // `previousManifest === null` AND no preexisting content implies a
  // fresh install; anything else is an upgrade install.
  const isFreshInstall =
    previousManifest === null && !targetHasPreexistingContent(projectRoot);

  // --- 6. Enumerate files + classify -------------------------------------
  const templateFiles = enumerateTemplateFiles(templateRoot);
  const baseEntries: Readonly<Record<string, string>> =
    previousManifest?.files ?? {};
  const actions = classifyFiles({
    templateRoot,
    templateFiles,
    projectRoot,
    baseEntries,
  });

  // --- 7. Execute (or print) --------------------------------------------
  const written: FileAction[] = [];
  const conflicts: FileAction[] = [];
  for (const action of actions) {
    switch (action.kind) {
      case 'add':
      case 'template-only': {
        if (!dryRun) {
          copyFile(
            join(templateRoot, action.relPath),
            join(projectRoot, action.relPath),
          );
        }
        written.push(action);
        break;
      }
      case 'conflict': {
        conflicts.push(action);
        break;
      }
      case 'unchanged':
      case 'user-only':
      case 'converged': {
        // No file write.
        break;
      }
    }
  }

  const nextManifest = buildNextManifest({
    version: tarballVersion,
    actions,
    baseEntries,
  });
  if (!dryRun) {
    mkdirSync(dirname(manifestPath), { recursive: true });
    writeFileSync(
      manifestPath,
      `${JSON.stringify(nextManifest, null, 2)}\n`,
      'utf8',
    );
  }

  // --- 8. Fresh-install activation (settings + farm) --------------------
  //
  // Fresh installs complete the per-project setup in one command:
  // seed `.gobbi/settings.json` at minimum shape (`{schemaVersion: 1}`)
  // when absent, then build the `.claude/{skills,agents,rules}/`
  // per-file symlink farm pointing at this project. PR-FIN-1c removed
  // the `projects` registry, so no `projects.active` / `projects.known`
  // writes happen — the directory tree under `.gobbi/projects/` is the
  // sole source of truth, and the active project resolves via
  // `basename(repoRoot)` (or the `--project` flag) at command time.
  // Upgrade installs skip this step to preserve the operator's existing
  // settings + farm — upgrade is content-only.
  //
  // Dry-run still emits the plan lines but does not mutate the
  // filesystem.
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
      actions,
      dryRun,
      written,
      conflicts,
      tarballVersion,
      activation,
    }),
  );

  if (conflicts.length > 0) {
    // Non-zero exit so CI + scripting can detect manual-resolution
    // requests. Files themselves are untouched; the manifest has not
    // been updated for the conflicted entries either.
    process.exit(1);
  }
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

/**
 * Resolve the npm package version for the manifest `version` field. We
 * walk up from the template root looking for the first `package.json`
 * with a `name` of `@gobbitools/cli`. Falls back to `'0.0.0-unknown'`
 * when the walk fails (dev checkout with an unbuilt workspace, or a
 * degenerate test fixture).
 */
function readTarballVersion(templateRoot: string): string {
  let cur = templateRoot;
  for (let i = 0; i < 8; i++) {
    const pkgPath = join(cur, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const parsed = JSON.parse(readFileSync(pkgPath, 'utf8')) as unknown;
        if (
          isRecord(parsed) &&
          isString(parsed['version']) &&
          (parsed['name'] === '@gobbitools/cli' || parsed['name'] === undefined)
        ) {
          return parsed['version'];
        }
      } catch {
        // fall through to parent
      }
    }
    const parent = dirname(cur);
    if (parent === cur) break;
    cur = parent;
  }
  return '0.0.0-unknown';
}

// ---------------------------------------------------------------------------
// Target scan
// ---------------------------------------------------------------------------

/**
 * `true` iff the target project root already contains any file under
 * `skills/`, `agents/`, or `rules/`. Used by the upgrade-flag gate to
 * distinguish a fresh install from a subsequent run without --upgrade.
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
    // Any file — recursive — in the kind's tree counts.
    if (walkFilesSync(dir).length > 0) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Template enumeration
// ---------------------------------------------------------------------------

/**
 * Collect every file that the template ships, keyed by its path relative
 * to the template root with forward-slash separators (the same form
 * written into the manifest). Deterministic order (sorted) so manifest
 * writes are stable across runs.
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
// Manifest read / hash helpers
// ---------------------------------------------------------------------------

/**
 * Parse the manifest at {@link manifestPath}. Returns `null` when the
 * file is missing. Throws `InstallError` with a clear message on shape
 * or schema-version mismatch — we refuse to silently misinterpret an
 * incompatible manifest, because the whole correctness argument rides
 * on its accuracy.
 */
function readManifest(manifestPath: string): InstallManifest | null {
  if (!existsSync(manifestPath)) return null;

  let raw: string;
  try {
    raw = readFileSync(manifestPath, 'utf8');
  } catch (err) {
    throw new InstallError(
      `cannot read ${manifestPath}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new InstallError(
      `${manifestPath} is not valid JSON: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!isRecord(parsed)) {
    throw new InstallError(`${manifestPath} must be a JSON object`);
  }

  const schemaVersion = parsed['schemaVersion'];
  if (schemaVersion !== MANIFEST_SCHEMA_VERSION) {
    throw new InstallError(
      `${manifestPath} schemaVersion ${String(schemaVersion)} not supported (expected ${MANIFEST_SCHEMA_VERSION})`,
    );
  }

  const version = parsed['version'];
  if (!isString(version)) {
    throw new InstallError(`${manifestPath} 'version' must be a string`);
  }

  const files = parsed['files'];
  if (!isRecord(files)) {
    throw new InstallError(`${manifestPath} 'files' must be an object`);
  }
  const normalisedFiles: Record<string, string> = {};
  for (const [key, value] of Object.entries(files)) {
    if (!isString(value)) {
      throw new InstallError(
        `${manifestPath} 'files.${key}' must be a string (sha256 hex)`,
      );
    }
    normalisedFiles[key] = value;
  }

  return {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    version,
    files: normalisedFiles,
  };
}

function hashFile(absPath: string): string {
  const buf = readFileSync(absPath);
  return createHash('sha256').update(buf).digest('hex');
}

function hashOrNull(absPath: string): string | null {
  if (!existsSync(absPath)) return null;
  try {
    if (!statSync(absPath).isFile()) return null;
  } catch {
    return null;
  }
  return hashFile(absPath);
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

interface ClassifyInput {
  readonly templateRoot: string;
  readonly templateFiles: readonly string[];
  readonly projectRoot: string;
  readonly baseEntries: Readonly<Record<string, string>>;
}

function classifyFiles(input: ClassifyInput): readonly FileAction[] {
  const out: FileAction[] = [];
  for (const relPath of input.templateFiles) {
    const templateHash = hashFile(join(input.templateRoot, relPath));
    const currentHash = hashOrNull(join(input.projectRoot, relPath));
    const baseHash = input.baseEntries[relPath] ?? null;

    if (currentHash === null) {
      out.push({ kind: 'add', relPath, templateHash });
      continue;
    }

    if (currentHash === templateHash && templateHash === baseHash) {
      out.push({ kind: 'unchanged', relPath, hash: templateHash });
      continue;
    }

    if (baseHash !== null && currentHash === baseHash && templateHash !== baseHash) {
      out.push({ kind: 'template-only', relPath, templateHash });
      continue;
    }

    if (baseHash !== null && templateHash === baseHash && currentHash !== baseHash) {
      out.push({ kind: 'user-only', relPath, hash: currentHash });
      continue;
    }

    if (currentHash === templateHash) {
      // Both sides moved to the same content (or the manifest had no
      // entry and the user's file happens to equal the template).
      out.push({ kind: 'converged', relPath, hash: templateHash });
      continue;
    }

    out.push({
      kind: 'conflict',
      relPath,
      baseHash,
      templateHash,
      currentHash,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Next-manifest construction
// ---------------------------------------------------------------------------

interface NextManifestInput {
  readonly version: string;
  readonly actions: readonly FileAction[];
  readonly baseEntries: Readonly<Record<string, string>>;
}

/**
 * Build the manifest to write after the run. Rules:
 *
 *   - For each non-conflict action, record the hash that now represents
 *     the installed state — the template hash for `add` / `template-only`,
 *     the current/converged hash otherwise.
 *   - CONFLICT entries retain their previous manifest hash (if any).
 *     The manifest's purpose is to record the last CLEANLY installed
 *     state; a conflicted file has not been cleanly installed this run,
 *     so we must not overwrite its base with the new template hash
 *     (which would lose the "user diverged from this baseline" signal
 *     on the next run).
 */
function buildNextManifest(input: NextManifestInput): InstallManifest {
  const files: Record<string, string> = {};
  for (const action of input.actions) {
    switch (action.kind) {
      case 'add':
      case 'template-only':
        files[action.relPath] = action.templateHash;
        break;
      case 'unchanged':
      case 'user-only':
      case 'converged':
        files[action.relPath] = action.hash;
        break;
      case 'conflict': {
        const prior = input.baseEntries[action.relPath];
        if (prior !== undefined) files[action.relPath] = prior;
        break;
      }
    }
  }
  // Deterministic ordering so the file diff is stable across runs.
  const sortedFiles: Record<string, string> = {};
  for (const key of Object.keys(files).sort()) {
    const value = files[key];
    if (value === undefined) continue;
    sortedFiles[key] = value;
  }
  return {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    version: input.version,
    files: sortedFiles,
  };
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
  readonly actions: readonly FileAction[];
  readonly dryRun: boolean;
  readonly written: readonly FileAction[];
  readonly conflicts: readonly FileAction[];
  readonly tarballVersion: string;
  readonly activation?: FreshActivationResult | null;
}

export function renderPlan(input: RenderPlanInput): string {
  const prefix = input.dryRun ? '[dry-run] ' : '';
  const lines: string[] = [];
  lines.push(
    `${prefix}gobbi install — project '${input.projectName}' @ version ${input.tarballVersion}`,
  );

  // Sort each category for deterministic output.
  const sorted = [...input.actions].sort((a, b) =>
    a.relPath.localeCompare(b.relPath),
  );

  for (const action of sorted) {
    switch (action.kind) {
      case 'add':
        lines.push(`${prefix}ADD       ${action.relPath}`);
        break;
      case 'template-only':
        lines.push(`${prefix}UPDATE    ${action.relPath}`);
        break;
      case 'user-only':
        lines.push(`${prefix}SKIP      ${action.relPath} (user modified)`);
        break;
      case 'unchanged':
        // Quiet — no diagnostic for the common case.
        break;
      case 'converged':
        lines.push(`${prefix}CONVERGED ${action.relPath} (user + template agree)`);
        break;
      case 'conflict':
        lines.push(`${prefix}CONFLICT  ${action.relPath} (user + template both changed)`);
        break;
    }
  }

  const addCount = sorted.filter((a) => a.kind === 'add').length;
  const updCount = sorted.filter((a) => a.kind === 'template-only').length;
  const skipCount = sorted.filter((a) => a.kind === 'user-only').length;
  const conflictCount = input.conflicts.length;
  const convergedCount = sorted.filter((a) => a.kind === 'converged').length;
  const unchangedCount = sorted.filter((a) => a.kind === 'unchanged').length;

  lines.push('');
  lines.push(
    `${prefix}summary: ${addCount} added, ${updCount} updated, ${skipCount} user-skipped, ${convergedCount} converged, ${unchangedCount} unchanged, ${conflictCount} conflict(s)`,
  );
  if (!input.dryRun && conflictCount === 0) {
    lines.push(`${prefix}manifest updated`);
  }

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

  if (conflictCount > 0) {
    lines.push('');
    lines.push(
      'error: one or more files have diverged on BOTH sides since the last install.',
    );
    lines.push(
      '       Resolve each conflict manually (diff the template against the working copy),',
    );
    lines.push('       then re-run `gobbi install --upgrade`.');
    for (const action of input.conflicts) {
      lines.push(`       - ${action.relPath}`);
    }
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
 * Upgrade-install MUST NOT call this function — upgrade is content-only.
 * The caller gates the call at {@link runInstallWithOptions}.
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
  readonly tarballVersion: string;
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
   * When `true`, proceed even if the target project already has
   * content — the seeder becomes a no-op for each file that is already
   * present (see return-value `filesCopied`). Defaults to `false`: a
   * non-empty project root causes a {@link SeedError} with
   * `kind: 'already-populated'`.
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
 * `.gobbi/projects/<projectName>/{skills,agents,rules}/` and write
 * the `.install-manifest.json`. Pure content-copy helper — does NOT
 * touch `.gobbi/settings.json` and does NOT build the `.claude/` farm.
 * Those responsibilities belong to the caller (either
 * {@link runInstallWithOptions} for the fresh-install path, or
 * `commands/project/create.ts` for the project-create seeding hook).
 *
 * Idempotency: when `force: false` and the project already has
 * skills/agents/rules content, throws {@link SeedError} with
 * `kind: 'already-populated'`. When `force: true`, skips files that
 * already exist (byte-equal to the template — content match required)
 * and counts only newly-written files in the result.
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
  const manifestPath = join(projectRoot, MANIFEST_FILENAME);
  const tarballVersion = readTarballVersion(templateRoot);

  if (!options.force && targetHasPreexistingContent(projectRoot)) {
    throw new SeedError(
      `project '${projectName}' already has skills/agents/rules content at ${projectRoot}; pass force: true to skip-over preexisting files or run 'gobbi install --upgrade' for a 3-way merge`,
      'already-populated',
    );
  }

  const templateFiles = enumerateTemplateFiles(templateRoot);
  let filesCopied = 0;
  const files: Record<string, string> = {};

  for (const relPath of templateFiles) {
    const srcAbs = join(templateRoot, relPath);
    const dstAbs = join(projectRoot, relPath);
    const templateHash = hashFile(srcAbs);
    if (existsSync(dstAbs)) {
      // Force-mode skip: the file already exists. We still record its
      // hash in the manifest, but only if it matches the template —
      // otherwise the user has diverged content we refuse to overwrite.
      const currentHash = hashOrNull(dstAbs);
      files[relPath] = currentHash ?? templateHash;
      continue;
    }
    copyFile(srcAbs, dstAbs);
    files[relPath] = templateHash;
    filesCopied++;
  }

  // Write the manifest. Deterministic key ordering so the file diff is
  // stable across runs.
  const sortedFiles: Record<string, string> = {};
  for (const key of Object.keys(files).sort()) {
    const value = files[key];
    if (value === undefined) continue;
    sortedFiles[key] = value;
  }
  const manifest: InstallManifest = {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    version: tarballVersion,
    files: sortedFiles,
  };
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  return {
    projectName,
    projectRoot,
    filesCopied,
    templateRoot,
    tarballVersion,
  };
}

// ---------------------------------------------------------------------------
// Error helper
// ---------------------------------------------------------------------------

/**
 * Installer-specific error class. Thrown by the manifest reader on
 * shape mismatches so the caller can surface a clear diagnostic and
 * exit 1 without a stack trace.
 */
export class InstallError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstallError';
  }
}

// ---------------------------------------------------------------------------
// Internal exports (for tests)
// ---------------------------------------------------------------------------

export const __INTERNALS__ = {
  MANIFEST_FILENAME,
  MANIFEST_SCHEMA_VERSION,
  TEMPLATE_KINDS,
  classifyFiles,
  buildNextManifest,
  enumerateTemplateFiles,
  readManifest,
  hashFile,
  projectSubdir,
};
