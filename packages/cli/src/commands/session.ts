/**
 * gobbi session — Command router for session hook subcommands.
 *
 * Subcommands:
 *   metadata    Extract session metadata from stdin JSON and write to CLAUDE_ENV_FILE
 *   load-env    Load .claude/.env file and write exports to CLAUDE_ENV_FILE
 *   events      Replay events from the active session's event store
 *
 * The `metadata` and `load-env` subcommands are silent on success and exit 0
 * on missing env vars or files. `events` is a human-facing read-only reporter
 * with `--json` and filter flags.
 *
 * The dispatcher uses a switch (not the registry pattern used by
 * `gobbi workflow`) on purpose: hook context must stay silent on unknown
 * subcommands so a stale hook shim never produces stdout noise. Migration to
 * the registry form is a follow-up for a later PR.
 */

import { appendFile, readFile, chmod } from 'node:fs/promises';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { basename, dirname, join } from 'node:path';

import { readStdinJson } from '../lib/stdin.js';
import { getRepoRoot } from '../lib/repo.js';
import {
  projectsRoot as projectsRootForRepo,
  sessionsRoot as sessionsRootForProject,
  workspaceRoot as workspaceRootForRepo,
} from '../lib/workspace-paths.js';
import { EventStore } from '../workflow/store.js';
import type { EventRow, ReadStore } from '../workflow/store.js';

// ---------------------------------------------------------------------------
// Usage strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi session <subcommand>

Subcommands:
  metadata    Extract session metadata from stdin JSON and write to CLAUDE_ENV_FILE
  load-env    Load .claude/.env file and write exports to CLAUDE_ENV_FILE
  events      Replay events from the active session's event store

Options:
  --help    Show this help message`;

const EVENTS_USAGE = `Usage: gobbi session events [options]

Replay events from the active session's SQLite event store. Human output is
the default (seq | ts | type | step | actor | data-summary); --json emits the
raw EventRow array for machine consumers.

Options:
  --session-id <id>   Override the active session id (defaults to
                      CLAUDE_SESSION_ID or the single session under
                      .gobbi/sessions/ if only one exists)
  --type <event>      Filter by event type (exact match)
  --since <seq>       Only list events with seq greater than <seq>
  --json              Emit raw EventRow[] JSON
  --all               Disable the 200-row cap
  --help              Show this help message

Without --all, the default output is capped at the last 200 rows for safety.`;

// ---------------------------------------------------------------------------
// Stdin JSON shape
// ---------------------------------------------------------------------------

interface SessionStartJson {
  session_id?: unknown;
  transcript_path?: unknown;
  model?: unknown;
  source?: unknown;
}

// ---------------------------------------------------------------------------
// Top-Level Router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi session`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runSession(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'metadata':
      await runSessionMetadata();
      break;
    case 'load-env':
      await runSessionLoadEnv();
      break;
    case 'events':
      await runSessionEvents(args.slice(1));
      break;
    case '--help':
      console.log(USAGE);
      break;
    case undefined:
      console.log(USAGE);
      break;
    default:
      // Unknown subcommand — exit silently (hook context must not produce stdout noise)
      break;
  }
}

// ---------------------------------------------------------------------------
// metadata
// ---------------------------------------------------------------------------

/**
 * Read session metadata from stdin JSON and append env var exports to CLAUDE_ENV_FILE.
 *
 * Matches the behavior of session-metadata.sh:
 * - CLAUDE_PROJECT_DIR comes from process.env, NOT from stdin JSON
 * - CLAUDE_ENV_FILE comes from process.env
 * - Exits silently if CLAUDE_ENV_FILE is not set
 * - Uses append-only writes to CLAUDE_ENV_FILE
 */
async function runSessionMetadata(): Promise<void> {
  const envFile = process.env['CLAUDE_ENV_FILE'];
  if (envFile === undefined || envFile === '') {
    return;
  }

  const projectDir = process.env['CLAUDE_PROJECT_DIR'] ?? '';

  const data = await readStdinJson<SessionStartJson>();

  // If stdin is not piped or not valid JSON, exit silently (matches shell fallback)
  if (data === null) {
    return;
  }

  const sessionId = typeof data.session_id === 'string' ? data.session_id : '';
  const transcriptPath = typeof data.transcript_path === 'string' ? data.transcript_path : '';
  const model = typeof data.model === 'string' ? data.model : '';
  const source = typeof data.source === 'string' ? data.source : '';

  const lines = [
    `export CLAUDE_SESSION_ID=${sessionId}`,
    `export CLAUDE_TRANSCRIPT_PATH=${transcriptPath}`,
    `export CLAUDE_MODEL=${model}`,
    `export CLAUDE_SESSION_SOURCE=${source}`,
    `export CLAUDE_PROJECT_DIR=${projectDir}`,
  ].join('\n') + '\n';

  await appendFile(envFile, lines, 'utf8');
}

// ---------------------------------------------------------------------------
// load-env
// ---------------------------------------------------------------------------

/**
 * Read .claude/.env and append export lines to CLAUDE_ENV_FILE.
 *
 * Matches the behavior of load-notification-env.sh:
 * - Exits silently if CLAUDE_ENV_FILE or CLAUDE_PROJECT_DIR is not set
 * - Exits silently if .claude/.env does not exist
 * - Sets file permissions to 0o600 (errors suppressed)
 * - Skips empty lines and comment lines (starting with #)
 * - Validates each line with regex before writing
 * - Writes warning to stderr for malformed lines
 */
async function runSessionLoadEnv(): Promise<void> {
  const envFile = process.env['CLAUDE_ENV_FILE'];
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];

  if (envFile === undefined || envFile === '' || projectDir === undefined || projectDir === '') {
    return;
  }

  const dotEnvPath = `${projectDir}/.claude/.env`;

  let content: string;
  try {
    content = await readFile(dotEnvPath, 'utf8');
  } catch {
    // File does not exist or is unreadable — exit silently
    return;
  }

  // Set chmod 600 — suppress errors
  try {
    await chmod(dotEnvPath, 0o600);
  } catch {
    // Suppress — matches `chmod 600 "$ENV_FILE" 2>/dev/null || true`
  }

  const validLinePattern = /^[A-Za-z_][A-Za-z0-9_]*=/;
  const lines = content.split('\n');

  for (const line of lines) {
    // Skip empty lines and comment lines
    if (line === '' || line.startsWith('#')) {
      continue;
    }

    if (validLinePattern.test(line)) {
      await appendFile(envFile, `export ${line}\n`, 'utf8');
    } else {
      process.stderr.write(`load-notification-env: skipping malformed line: ${line}\n`);
    }
  }
}

// ---------------------------------------------------------------------------
// events
// ---------------------------------------------------------------------------

/** Default row cap for human output — `--all` disables the cap. */
export const DEFAULT_EVENTS_ROW_CAP = 200;

/** Options consumed by the library form of {@link runSessionEventsWithStore}. */
export interface SessionEventsOptions {
  readonly type?: string;
  readonly since?: number;
  readonly json?: boolean;
  readonly all?: boolean;
}

/**
 * Library form of the events reporter — operates on a caller-provided store
 * so tests can run against an in-memory database without spawning a CLI.
 *
 * Writes output to `process.stdout` in the same shape as the CLI command:
 *
 *   - human (default): `seq | ts | type | step | actor | data-summary`,
 *     one row per event. Capped at {@link DEFAULT_EVENTS_ROW_CAP} unless
 *     `all` is set.
 *   - json: `JSON.stringify(rows)` — the raw `EventRow` array.
 *
 * Filters compose in the obvious way: `--since` then `--type`. Only one
 * filter runs at the SQL layer (the narrower one), the other is applied
 * in-memory — callers should expect both to take effect.
 */
export function runSessionEventsWithStore(
  store: ReadStore,
  options: SessionEventsOptions = {},
): void {
  let rows: readonly EventRow[];
  if (options.since !== undefined) {
    rows = store.since(options.since);
    if (options.type !== undefined) {
      const typeFilter = options.type;
      rows = rows.filter((r) => r.type === typeFilter);
    }
  } else if (options.type !== undefined) {
    rows = store.byType(options.type);
  } else {
    rows = store.replayAll();
  }

  // Cap to the last N rows (by seq) for human output. `--all` disables.
  const capped =
    options.all === true || options.json === true || rows.length <= DEFAULT_EVENTS_ROW_CAP
      ? rows
      : rows.slice(rows.length - DEFAULT_EVENTS_ROW_CAP);

  if (options.json === true) {
    process.stdout.write(`${JSON.stringify(capped, null, 2)}\n`);
    return;
  }

  if (capped.length === 0) {
    process.stdout.write(`(no events)\n`);
    return;
  }

  for (const row of capped) {
    process.stdout.write(`${formatEventRow(row)}\n`);
  }
}

/**
 * CLI entry point — resolves the session directory, opens an {@link EventStore}
 * against `gobbi.db`, and delegates to {@link runSessionEventsWithStore}.
 *
 * Exposed directly via `gobbi session events` and re-used by
 * `gobbi workflow events` (registered in `commands/workflow.ts`).
 *
 * Exit 1 on resolution failure (no session directory, ambiguous session
 * without `--session-id` / `CLAUDE_SESSION_ID`).
 */
export async function runSessionEvents(args: string[]): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  try {
    const parsed = parseArgs({
      args,
      options: PARSE_OPTIONS_EVENTS,
      allowPositionals: false,
    });
    values = parsed.values;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi session events: ${message}\n`);
    process.stderr.write(`${EVENTS_USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${EVENTS_USAGE}\n`);
    return;
  }

  const sessionIdOverride = typeof values['session-id'] === 'string' ? values['session-id'] : undefined;
  const sessionDir = resolveSessionDir(sessionIdOverride);
  if (sessionDir === null) {
    process.stderr.write(
      `gobbi session events: could not resolve an active session directory. ` +
        `Set CLAUDE_SESSION_ID or pass --session-id.\n`,
    );
    process.exit(1);
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    process.stderr.write(`gobbi session events: no event store at ${dbPath}\n`);
    process.exit(1);
  }

  const { sessionId, projectId } = resolvePartitionKeys(sessionDir);
  const store = new EventStore(dbPath, { sessionId, projectId });
  try {
    const options: SessionEventsOptions = {
      json: values.json === true,
      all: values.all === true,
      ...(typeof values.type === 'string' ? { type: values.type } : {}),
      ...(typeof values.since === 'string'
        ? { since: parseSinceFlag(values.since) }
        : {}),
    };
    runSessionEventsWithStore(store, options);
  } finally {
    store.close();
  }
}

const PARSE_OPTIONS_EVENTS = {
  help: { type: 'boolean', short: 'h', default: false },
  'session-id': { type: 'string' },
  type: { type: 'string' },
  since: { type: 'string' },
  json: { type: 'boolean', default: false },
  all: { type: 'boolean', default: false },
} as const;

function parseSinceFlag(raw: string): number {
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) {
    process.stderr.write(`gobbi session events: --since must be a non-negative integer (got "${raw}")\n`);
    process.exit(2);
  }
  return n;
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

/**
 * Render one {@link EventRow} as a single-line human summary:
 *
 *   `${seq} | ${ts} | ${type} | ${step ?? '-'} | ${actor} | ${dataSummary}`
 *
 * The data summary is a best-effort compact rendering of the JSON payload —
 * top-level key names joined by `,`. Intent: give the operator enough to
 * tell events apart without drowning the terminal.
 */
export function formatEventRow(row: EventRow): string {
  const step = row.step ?? '-';
  return `${row.seq} | ${row.ts} | ${row.type} | ${step} | ${row.actor} | ${summariseData(row.data)}`;
}

function summariseData(raw: string): string {
  if (raw === '' || raw === '{}') return '-';
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      if (keys.length === 0) return '-';
      return keys.join(',');
    }
    return String(parsed);
  } catch {
    return '<unparseable>';
  }
}

// ---------------------------------------------------------------------------
// Session directory resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the active session's session directory. Scans both the legacy-flat
 * layout (`.gobbi/sessions/<id>/`) AND every project's sessions dir
 * (`.gobbi/projects/<name>/sessions/<id>/`) so a `--session-id` override
 * works regardless of which project currently owns the session.
 *
 * Priority:
 *   1. Explicit `--session-id` override.
 *   2. `CLAUDE_SESSION_ID` environment variable.
 *   3. Fallback — if exactly one session directory exists across the union of
 *      layouts (legacy-flat + every project's sessions dir), use it.
 *      Otherwise return `null`.
 *
 * Returns `null` when no directory can be resolved; the caller is responsible
 * for emitting the user-facing error message.
 *
 * ## Why scan all projects given --session-id
 *
 * Post-Pass-2 sessions live at `.gobbi/projects/<name>/sessions/<id>/`. If
 * a caller passes `--session-id` without knowing the owning project name
 * (e.g., e2e tests, cross-project debugging, or a shell with a different
 * `projects.active` than the session's creator), binding the resolver to a
 * single project would cause spurious "could not resolve" failures even
 * though the session exists on disk. A session id is a UUID-grade
 * identifier — uniqueness across projects is an invariant, so scanning all
 * projects for the id is safe.
 */
export function resolveSessionDir(override?: string | undefined): string | null {
  const repoRoot = getRepoRoot();

  const candidate = override ?? process.env['CLAUDE_SESSION_ID'];
  if (candidate !== undefined && candidate !== '') {
    return findSessionById(repoRoot, candidate);
  }

  // Single-session fallback — if exactly one session exists across the
  // union of legacy-flat and per-project layers, use it. More than one is
  // ambiguous; zero means no active session.
  const all = collectAllSessionDirs(repoRoot);
  if (all.length === 1) {
    const only = all[0];
    return only ?? null;
  }
  return null;
}

/**
 * Search for a session directory by id across every known layout.
 * Returns the first match found or `null`.
 *
 * Order:
 *   1. Legacy-flat `.gobbi/sessions/<id>/` (back-compat with pre-Pass-2 sessions).
 *   2. Per-project `.gobbi/projects/<name>/sessions/<id>/` — iterated in
 *      `readdirSync` order so the scan is deterministic within one repo state.
 */
function findSessionById(repoRoot: string, sessionId: string): string | null {
  // Layer 1 — legacy flat layout.
  const legacyDir = join(workspaceRootForRepo(repoRoot), 'sessions', sessionId);
  if (existsSync(legacyDir)) {
    try {
      if (statSync(legacyDir).isDirectory()) return legacyDir;
    } catch {
      // Fall through to project scan.
    }
  }

  // Layer 2 — per-project layouts.
  const projectsDir = projectsRootForRepo(repoRoot);
  if (!existsSync(projectsDir)) return null;

  let projectNames: string[];
  try {
    projectNames = readdirSync(projectsDir);
  } catch {
    return null;
  }

  for (const projectName of projectNames) {
    let projectsEntry: string;
    try {
      projectsEntry = join(projectsDir, projectName);
      if (!statSync(projectsEntry).isDirectory()) continue;
    } catch {
      continue;
    }
    const candidateDir = join(
      sessionsRootForProject(repoRoot, projectName),
      sessionId,
    );
    if (!existsSync(candidateDir)) continue;
    try {
      if (statSync(candidateDir).isDirectory()) return candidateDir;
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Resolved partition keys for an {@link EventStore} opened against the legacy
 * `<sessionDir>/gobbi.db` path. Both fields participate in the v5+ INSERT
 * `(session_id, project_id)` columns. `null` defers to the constructor's
 * on-disk derivation fallback (matches the legacy single-arg behavior).
 */
export interface ResolvedPartitionKeys {
  readonly sessionId: string | null;
  readonly projectId: string | null;
}

/**
 * Resolve `(sessionId, projectId)` from a session directory so callers of
 * `new EventStore(dbPath, opts)` can supply the partition keys explicitly.
 *
 *   - `sessionId` = `basename(sessionDir)` (matches the per-session layout
 *     `.gobbi/projects/<name>/sessions/<sessionId>/`). `null` only when the
 *     basename resolves to the empty string (filesystem root).
 *   - `projectId` = the `<projectName>` segment from the standard layout
 *     `<repoRoot>/.gobbi/projects/<projectName>/sessions/<sessionId>/`,
 *     extracted as `basename(dirname(dirname(sessionDir)))`. The path
 *     itself is the source of truth after PR-FIN-2a-ii (T-2a.9.unified)
 *     retired the legacy `metadata.json` reader. `null` for legacy-flat
 *     sessions under `.gobbi/sessions/<sessionId>/` where the parent
 *     segment is `'sessions'` rather than a project name.
 *
 * Empty-string and `null` are treated identically as "explicitly unset" by
 * the {@link EventStore} constructor, so empty-string columns can never reach
 * the SQLite INSERT (see `EventStoreOptions` in `workflow/store.ts`).
 */
export function resolvePartitionKeys(sessionDir: string): ResolvedPartitionKeys {
  const sessionName = basename(sessionDir);
  const sessionId = sessionName === '' ? null : sessionName;
  const projectId = projectIdFromSessionDir(sessionDir);
  return { sessionId, projectId };
}

/**
 * Extract `<projectName>` from a per-project session directory of the
 * shape `<repoRoot>/.gobbi/projects/<projectName>/sessions/<sessionId>/`.
 *
 * Returns `null` when:
 *   - the path does not have at least two ancestor segments (e.g. fs
 *     root, malformed path),
 *   - the immediate parent is not literally `'sessions'` — this is the
 *     signal that the path is NOT inside the per-project layout
 *     (legacy-flat sessions live at `.gobbi/sessions/<sessionId>/` and
 *     their parent is `'sessions'` but the grandparent is `'.gobbi'`,
 *     not `'projects'`),
 *   - the great-grandparent is not literally `'projects'`.
 *
 * Path-only resolution is the post–PR-FIN-2a-ii canonical source — the
 * legacy `metadata.json` reader was retired alongside metadata.json
 * itself.
 */
function projectIdFromSessionDir(sessionDir: string): string | null {
  const sessionsDir = dirname(sessionDir); // …/sessions
  if (basename(sessionsDir) !== 'sessions') return null;
  const projectDirCandidate = dirname(sessionsDir); // …/<projectName>
  const projectsDirCandidate = dirname(projectDirCandidate); // …/projects
  if (basename(projectsDirCandidate) !== 'projects') return null;
  const projectName = basename(projectDirCandidate);
  return projectName === '' ? null : projectName;
}

/**
 * Enumerate every session directory across legacy-flat + per-project layers.
 * Used by the single-session fallback so a repo with exactly one session
 * (regardless of which layer it lives under) resolves unambiguously.
 */
function collectAllSessionDirs(repoRoot: string): readonly string[] {
  const out: string[] = [];

  // Layer 1 — legacy flat.
  const legacyRoot = join(workspaceRootForRepo(repoRoot), 'sessions');
  if (existsSync(legacyRoot)) {
    try {
      for (const id of readdirSync(legacyRoot)) {
        const dir = join(legacyRoot, id);
        try {
          if (statSync(dir).isDirectory()) out.push(dir);
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
  }

  // Layer 2 — per-project.
  const projectsDir = projectsRootForRepo(repoRoot);
  if (existsSync(projectsDir)) {
    let projectNames: string[];
    try {
      projectNames = readdirSync(projectsDir);
    } catch {
      projectNames = [];
    }
    for (const projectName of projectNames) {
      const projSessions = sessionsRootForProject(repoRoot, projectName);
      try {
        if (!statSync(projSessions).isDirectory()) continue;
      } catch {
        continue;
      }
      try {
        for (const id of readdirSync(projSessions)) {
          const dir = join(projSessions, id);
          try {
            if (statSync(dir).isDirectory()) out.push(dir);
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }
    }
  }

  return out;
}
