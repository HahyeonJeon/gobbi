/**
 * gobbi gotcha promote — move gotcha drafts from
 * `.gobbi/projects/<project>/learnings/gotchas/` into their permanent
 * resting place.
 *
 * ## Scope (PR C / Wave 9)
 *
 * Top-level, out-of-session command. The promotion ritual is intentionally
 * manual: mid-session promotion would cause a `.claude/` reload (per the
 * `_gobbi-rule` context-loading principle) and unvetted drafts would pollute
 * the permanent store. The command therefore refuses to run when any session
 * is active.
 *
 * ## Contract
 *
 *   1. Active-session detection — filesystem scan of
 *      `.gobbi/projects/<project>/sessions/*` + per-session
 *      `session.heartbeat` lookup. Any session with a heartbeat inside the
 *      60-minute abandoned-session TTL (`v050-session.md:218`) and no
 *      `workflow.finish` event blocks the promotion.
 *   2. Git-style concrete-actions rejection — each active session lists
 *      its id + minutes-since-heartbeat + step, followed by a single
 *      Options block (Finish / Abort / Wait-TTL).
 *   3. Happy path — every `.md` file under the source directory is
 *      appended to its destination, then the source is deleted so
 *      re-running does not duplicate.
 *   4. `--dry-run` — prints the planned moves; writes nothing, deletes
 *      nothing, exits 0.
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
 *   - `{category}.md`             → `.gobbi/projects/<project>/learnings/gotchas/{category}.md`
 *   - `_skill-{skillName}.md`     → `.claude/skills/{skillName}/gotchas.md`
 *                                   (symlink target:
 *                                   `.gobbi/projects/<project>/skills/{skillName}/gotchas.md`)
 *
 * ## Why env vars are not trusted
 *
 * `CLAUDE_SESSION_ID` is set by Claude Code's SessionStart hook in the main
 * process but does NOT reliably propagate into Bash subshells. A terminal
 * invocation of `gobbi gotcha promote` would either see an empty value or
 * inherit a stale id. Active-session detection therefore uses the
 * filesystem + event store exclusively — this matches the guidance in
 * `research/results/active-session-detection.md`.
 *
 * ## Future work (out of scope — PR D+)
 *
 * Duplicate-entry detection, structured frontmatter merge, and per-category
 * validation stay out of this file. Research explicitly keeps them deferred
 * so the first shipped version has a small, reviewable surface. The current
 * append-and-delete flow is safe because git diff is the merge review.
 *
 * @see `.gobbi/projects/gobbi/design/v050-cli.md` §`gobbi gotcha` commands
 * @see `.gobbi/projects/gobbi/design/v050-session.md` §Abandoned session detection
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
import { join } from 'node:path';

import { parseArgs } from 'node:util';

import { getRepoRoot } from '../../lib/repo.js';
import {
  projectSubdir,
  projectsRoot,
  sessionsRoot as sessionsRootForProject,
} from '../../lib/workspace-paths.js';
import { EventStore } from '../../workflow/store.js';

/**
 * Fallback project name used by path helpers that run before
 * `projects.active` is resolved.
 * TODO(W2.3): replace `DEFAULT_PROJECT_NAME` with `projects.active` resolution.
 */
const DEFAULT_PROJECT_NAME = 'gobbi';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Abandoned-session threshold from `v050-session.md:218`. A session whose
 * most recent heartbeat is older than this is treated as dead and does not
 * block promotion. The 60-minute choice is deliberately aligned with the
 * `.claude/` write guard so both paths use the same freshness rule — do not
 * vary it per-callsite.
 */
export const HEARTBEAT_TTL_MS = 60 * 60 * 1000;

/**
 * Default source directory — `.gobbi/projects/<project>/learnings/gotchas/` at
 * the repo root. Computed per call because the project name resolution
 * (TODO(W2.3)) lands in a later wave; for now `DEFAULT_PROJECT_NAME` is
 * threaded through the facade.
 */
function defaultSourceDir(repoRoot: string): string {
  // TODO(W2.3): replace DEFAULT_PROJECT_NAME with projects.active resolution
  return join(
    projectSubdir(repoRoot, DEFAULT_PROJECT_NAME, 'learnings'),
    'gotchas',
  );
}

/** Skill-scoped prefix convention (see file header). */
const SKILL_PREFIX = '_skill-';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi gotcha promote [options]

Move gotcha drafts from .gobbi/projects/<project>/learnings/gotchas/ into
their permanent resting place. Category drafts land at
.gobbi/projects/<project>/learnings/gotchas/<category>.md; skill-scoped
drafts (_skill-<name>.md) land at .claude/skills/<name>/gotchas.md via the
symlink farm. Refuses to run while any session is active.

Options:
  --dry-run                     Print planned changes without writing or deleting
  --source <path>               Override the source directory
                                (default: .gobbi/projects/<project>/learnings/gotchas/)
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
  /**
   * Override `Date.now()` for deterministic heartbeat-age math.
   */
  readonly now?: () => Date;
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

  // --- 2. Resolve paths --------------------------------------------------
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const claudeDir = overrides.claudeDir ?? join(repoRoot, '.claude');
  const sourceDir = sourceOverride ?? defaultSourceDir(repoRoot);

  const now = overrides.now === undefined ? new Date() : overrides.now();

  // --- 3. Active-session guard ------------------------------------------
  const actives = findActiveSessions(repoRoot, now.getTime());
  if (actives.length > 0) {
    process.stderr.write(renderActiveSessionError(actives));
    process.exit(1);
  }

  // --- 4. Enumerate source files ----------------------------------------
  if (!existsSync(sourceDir)) {
    // Nothing to promote — silent no-op, mirrors the behaviour of `git
    // clean` on an already-clean tree.
    return;
  }

  const files = listPromotable(sourceDir);
  if (files.length === 0) {
    return; // empty source — silent
  }

  // --- 5. Resolve destination project (for non-skill entries) -----------
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

  // --- 6. Plan every promotion ------------------------------------------
  const plan = files.map((file) =>
    planPromotion(sourceDir, file, repoRoot, claudeDir, projectName),
  );

  // --- 7. Execute (or print) --------------------------------------------
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
// Active-session detection
// ---------------------------------------------------------------------------

/** A session flagged as currently active by {@link findActiveSessions}. */
export interface ActiveSession {
  readonly sessionId: string;
  readonly heartbeatTs: string;
  readonly minutesAgo: number;
  readonly ttlRemainingMinutes: number;
  readonly step: string | null;
}

/**
 * Scan `.gobbi/sessions/*` and return every session whose most recent
 * `session.heartbeat` is within the 60-minute TTL AND does not have a
 * `workflow.finish` event. Missing directory / unreadable stores degrade
 * silently — the command errs on the side of allowing promotion.
 */
export function findActiveSessions(
  repoRoot: string,
  nowMs: number,
): readonly ActiveSession[] {
  // TODO(W2.3): replace DEFAULT_PROJECT_NAME with projects.active resolution
  const sessionsRoot = sessionsRootForProject(repoRoot, DEFAULT_PROJECT_NAME);
  if (!existsSync(sessionsRoot)) return [];

  let entries: string[];
  try {
    entries = readdirSync(sessionsRoot);
  } catch {
    return [];
  }

  const active: ActiveSession[] = [];
  for (const id of entries) {
    const sessionDir = join(sessionsRoot, id);
    try {
      if (!statSync(sessionDir).isDirectory()) continue;
    } catch {
      continue;
    }

    const dbPath = join(sessionDir, 'gobbi.db');
    if (!existsSync(dbPath)) continue;

    let store: EventStore;
    try {
      store = new EventStore(dbPath);
    } catch {
      continue;
    }
    try {
      // Completed sessions never block — a `workflow.finish` event wins
      // over any stale heartbeat.
      const finish = store.last('workflow.finish');
      if (finish !== null) continue;

      const heartbeat = store.last('session.heartbeat');
      if (heartbeat === null) continue;

      const hbMs = Date.parse(heartbeat.ts);
      if (!Number.isFinite(hbMs)) continue;

      const ageMs = nowMs - hbMs;
      if (ageMs >= HEARTBEAT_TTL_MS) continue; // abandoned
      // Negative ages (clock skew) also count as fresh — err on the side
      // of blocking rather than allowing a concurrent session to race.

      const minutesAgo = Math.max(0, Math.floor(ageMs / 60_000));
      const ttlRemainingMinutes = Math.max(
        0,
        Math.ceil((HEARTBEAT_TTL_MS - ageMs) / 60_000),
      );

      active.push({
        sessionId: id,
        heartbeatTs: heartbeat.ts,
        minutesAgo,
        ttlRemainingMinutes,
        step: heartbeat.step,
      });
    } finally {
      store.close();
    }
  }

  return active;
}

/**
 * Format the Git-style concrete-actions rejection message. Each active
 * session is listed individually with its heartbeat age and step; the
 * Options block appears once at the bottom. The smallest remaining TTL
 * across all active sessions is used for the "Wait" option — waiting on
 * the shortest still unblocks promotion for every other entry.
 */
export function renderActiveSessionError(
  actives: readonly ActiveSession[],
): string {
  const lines: string[] = [];
  lines.push('error: Cannot promote gotchas while a session is active.');
  for (const s of actives) {
    const step = s.step ?? '(none)';
    lines.push(`       Active session: ${s.sessionId}`);
    lines.push(`       Last heartbeat: ${s.minutesAgo} minutes ago (step: ${step})`);
  }
  const minRemaining = actives.reduce(
    (min, s) => Math.min(min, s.ttlRemainingMinutes),
    Number.POSITIVE_INFINITY,
  );
  lines.push('');
  lines.push('Options:');
  lines.push('  1. Finish the session first:  gobbi workflow transition FINISH');
  lines.push('  2. Abort and discard:          gobbi workflow transition ABORT');
  lines.push(`  3. Wait for TTL to expire (${minRemaining} minutes)`);
  lines.push('');
  return lines.join('\n');
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
    // `<category>.md` → `.gobbi/projects/<project>/learnings/gotchas/<category>.md`
    //
    // Routes through the `workspace-paths` facade so a future rename of
    // the taxonomy (e.g., `learnings/` → `memories/`) lands in one
    // place. `projectName === null` is screened out by the caller when
    // any non-skill entry is present, so a fallback name here is
    // unreachable; we still pick a sentinel rather than `!`-asserting so
    // a future miswiring fails loudly at the filesystem layer instead
    // of a runtime TypeError.
    const projectDir =
      projectName ?? '__unset__project__' /* unreachable — caller checks */;
    destination = join(
      projectSubdir(repoRoot, projectDir, 'learnings'),
      'gotchas',
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
 * Post-W3.1 subtlety: for a non-skill promotion in the default project
 * (`DEFAULT_PROJECT_NAME === 'gobbi'`), the category source file and its
 * destination resolve to the same absolute path — both live under
 * `.gobbi/projects/gobbi/learnings/gotchas/<category>.md`. Appending to
 * itself and then unlinking would double the body and then delete the
 * file (data loss). When source and destination collide we treat the
 * promotion as already complete (the draft is already in its permanent
 * location by virtue of the W3.1 taxonomy) and skip the file with no
 * writes.
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
