/**
 * SQLite config store — typed wrapper around bun:sqlite for session config.
 *
 * Replaces settings.json read-modify-write with atomic per-field updates.
 * SQLite WAL mode + busy_timeout serializes concurrent writes, eliminating
 * the lost-update race that settings.json suffered from.
 *
 * All methods are synchronous (bun:sqlite is a synchronous API).
 * Uses WAL mode, cached prepared statements via db.query(), and
 * INSERT ... ON CONFLICT DO UPDATE for atomic upserts.
 */

import { Database } from 'bun:sqlite';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { isRecord, isString, isBoolean } from './guards.js';
import {
  GOBBI_VERSION,
  GOBBI_ARCHITECTURE,
  TTL_DAYS,
  MAX_SESSIONS,
  nowIso,
} from './config.js';
import type { Session, GobbiJson, NotifyConfig } from './config.js';

// Re-export for convenience
export type { Session, GobbiJson, NotifyConfig } from './config.js';

// ---------------------------------------------------------------------------
// Row type — matches the SQLite sessions table shape
// ---------------------------------------------------------------------------

export interface SessionRow {
  readonly session_id: string;
  readonly trivial_range: string;
  readonly evaluation_mode: string;
  readonly git_workflow: string;
  readonly base_branch: string | null;
  readonly notify_slack: number;
  readonly notify_telegram: number;
  readonly created_at: string;
  readonly last_accessed_at: string;
}

// ---------------------------------------------------------------------------
// SQLite binding type — compatible with bun:sqlite's SQLQueryBindings
// ---------------------------------------------------------------------------

type SqlBindings = Record<string, string | number | bigint | boolean | null>;

// ---------------------------------------------------------------------------
// Dot-path to column mapping
// ---------------------------------------------------------------------------

/**
 * Maps CLI dot-path field names to their SQLite column counterparts.
 * Handles nested `notify.slack` / `notify.telegram` paths and camelCase
 * to snake_case conversion for flat fields.
 */
const FIELD_TO_COLUMN: Readonly<Record<string, string>> = {
  'trivialRange': 'trivial_range',
  'evaluationMode': 'evaluation_mode',
  'gitWorkflow': 'git_workflow',
  'baseBranch': 'base_branch',
  'notify.slack': 'notify_slack',
  'notify.telegram': 'notify_telegram',
  'createdAt': 'created_at',
  'lastAccessedAt': 'last_accessed_at',
};

/** Valid column names for SET clauses — used to prevent SQL injection. */
const VALID_COLUMNS: ReadonlySet<string> = new Set([
  'trivial_range',
  'evaluation_mode',
  'git_workflow',
  'base_branch',
  'notify_slack',
  'notify_telegram',
]);

// ---------------------------------------------------------------------------
// SQL statements
// ---------------------------------------------------------------------------

const SQL_CREATE_SESSIONS = `
CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  trivial_range TEXT NOT NULL DEFAULT 'read-only',
  evaluation_mode TEXT NOT NULL DEFAULT 'ask-each-time',
  git_workflow TEXT NOT NULL DEFAULT 'direct-commit',
  base_branch TEXT,
  notify_slack INTEGER NOT NULL DEFAULT 0,
  notify_telegram INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  last_accessed_at TEXT NOT NULL
)`;

const SQL_CREATE_METADATA = `
CREATE TABLE IF NOT EXISTS metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
)`;

const SQL_UPSERT_SESSION = `
INSERT INTO sessions (session_id, trivial_range, evaluation_mode, git_workflow, base_branch, notify_slack, notify_telegram, created_at, last_accessed_at)
VALUES ($session_id, $trivial_range, $evaluation_mode, $git_workflow, $base_branch, $notify_slack, $notify_telegram, $created_at, $last_accessed_at)
ON CONFLICT(session_id) DO UPDATE SET
  trivial_range = excluded.trivial_range,
  evaluation_mode = excluded.evaluation_mode,
  git_workflow = excluded.git_workflow,
  base_branch = excluded.base_branch,
  notify_slack = excluded.notify_slack,
  notify_telegram = excluded.notify_telegram,
  created_at = excluded.created_at,
  last_accessed_at = excluded.last_accessed_at`;

const SQL_GET_SESSION = `
SELECT * FROM sessions WHERE session_id = $session_id`;

const SQL_DELETE_SESSION = `
DELETE FROM sessions WHERE session_id = $session_id`;

const SQL_LIST_SESSIONS = `
SELECT * FROM sessions ORDER BY created_at ASC`;

const SQL_COUNT_SESSIONS = `
SELECT count(*) as cnt FROM sessions`;

const SQL_UPSERT_METADATA = `
INSERT INTO metadata (key, value) VALUES ($key, $value)
ON CONFLICT(key) DO UPDATE SET value = excluded.value`;

const SQL_GET_METADATA = `
SELECT value FROM metadata WHERE key = $key`;

const SQL_DELETE_EXPIRED = `
DELETE FROM sessions WHERE last_accessed_at < $cutoff`;

const SQL_DELETE_EXCESS = `
DELETE FROM sessions WHERE session_id NOT IN (
  SELECT session_id FROM sessions ORDER BY last_accessed_at DESC LIMIT $max_sessions
)`;

// ---------------------------------------------------------------------------
// ConfigStore class
// ---------------------------------------------------------------------------

export class ConfigStore {
  private readonly db: Database;

  // Cached prepared statements
  private readonly stmtUpsertSession;
  private readonly stmtGetSession;
  private readonly stmtDeleteSession;
  private readonly stmtListSessions;
  private readonly stmtCountSessions;
  private readonly stmtUpsertMetadata;
  private readonly stmtGetMetadata;
  private readonly stmtDeleteExpired;
  private readonly stmtDeleteExcess;

  /**
   * Per-column SET statements, built dynamically per column name.
   * Cached after first use for each column.
   */
  private readonly stmtSetFieldCache = new Map<
    string,
    ReturnType<Database['query']>
  >();

  constructor(pathOrMemory: string) {
    this.db = new Database(pathOrMemory, { strict: true });
    this.db.run('PRAGMA journal_mode = WAL');
    this.db.run('PRAGMA synchronous = NORMAL');
    this.db.run('PRAGMA busy_timeout = 5000');
    this.initSchema();

    // Cache all prepared statements
    this.stmtUpsertSession = this.db.query<SessionRow, [SqlBindings]>(SQL_UPSERT_SESSION);
    this.stmtGetSession = this.db.query<SessionRow, [SqlBindings]>(SQL_GET_SESSION);
    this.stmtDeleteSession = this.db.query<SessionRow, [SqlBindings]>(SQL_DELETE_SESSION);
    this.stmtListSessions = this.db.query<SessionRow, []>(SQL_LIST_SESSIONS);
    this.stmtCountSessions = this.db.query<{ cnt: number }, []>(SQL_COUNT_SESSIONS);
    this.stmtUpsertMetadata = this.db.query<{ key: string; value: string }, [SqlBindings]>(SQL_UPSERT_METADATA);
    this.stmtGetMetadata = this.db.query<{ value: string }, [SqlBindings]>(SQL_GET_METADATA);
    this.stmtDeleteExpired = this.db.query<SessionRow, [SqlBindings]>(SQL_DELETE_EXPIRED);
    this.stmtDeleteExcess = this.db.query<SessionRow, [SqlBindings]>(SQL_DELETE_EXCESS);
  }

  // -------------------------------------------------------------------------
  // Schema initialization
  // -------------------------------------------------------------------------

  private initSchema(): void {
    this.db.run(SQL_CREATE_SESSIONS);
    this.db.run(SQL_CREATE_METADATA);
  }

  // -------------------------------------------------------------------------
  // Migration from JSON files
  // -------------------------------------------------------------------------

  /**
   * Migrate sessions from a legacy JSON file (settings.json or gobbi.json).
   *
   * Reads the JSON, inserts all sessions and metadata into SQLite.
   * Does NOT delete the source file — leave it for rollback safety.
   */
  migrateFromJson(jsonPath: string): void {
    if (!existsSync(jsonPath)) return;

    let raw: string;
    try {
      raw = readFileSync(jsonPath, 'utf8');
    } catch {
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      return;
    }

    if (!isRecord(parsed)) return;

    // Extract version and architecture
    const version = isString(parsed['version']) ? parsed['version'] : GOBBI_VERSION;
    const architecture = isString(parsed['architecture']) ? parsed['architecture'] : GOBBI_ARCHITECTURE;

    this.setMetadata('version', version);
    this.setMetadata('architecture', architecture);

    // Extract sessions
    const sessions = parsed['sessions'];
    if (!isRecord(sessions)) return;

    for (const [id, sessionData] of Object.entries(sessions)) {
      if (!isRecord(sessionData)) continue;

      const notify = isRecord(sessionData['notify']) ? sessionData['notify'] : {};
      const ts = nowIso();

      this.upsertSession(id, {
        trivialRange: isString(sessionData['trivialRange']) ? sessionData['trivialRange'] : 'read-only',
        evaluationMode: isString(sessionData['evaluationMode']) ? sessionData['evaluationMode'] : 'ask-each-time',
        gitWorkflow: isString(sessionData['gitWorkflow']) ? sessionData['gitWorkflow'] : 'direct-commit',
        baseBranch: isString(sessionData['baseBranch']) ? sessionData['baseBranch'] : null,
        notify: {
          slack: isBoolean(notify['slack']) ? notify['slack'] : false,
          telegram: isBoolean(notify['telegram']) ? notify['telegram'] : false,
        },
        createdAt: isString(sessionData['createdAt']) ? sessionData['createdAt'] : ts,
        lastAccessedAt: isString(sessionData['lastAccessedAt']) ? sessionData['lastAccessedAt'] : ts,
      });
    }
  }

  // -------------------------------------------------------------------------
  // Session CRUD
  // -------------------------------------------------------------------------

  /**
   * Insert or fully replace a session.
   */
  upsertSession(sessionId: string, session: Session): void {
    this.stmtUpsertSession.run({
      session_id: sessionId,
      trivial_range: session.trivialRange,
      evaluation_mode: session.evaluationMode,
      git_workflow: session.gitWorkflow,
      base_branch: session.baseBranch,
      notify_slack: session.notify.slack ? 1 : 0,
      notify_telegram: session.notify.telegram ? 1 : 0,
      created_at: session.createdAt,
      last_accessed_at: session.lastAccessedAt,
    });
  }

  /**
   * Get a session by ID. Returns null if not found.
   * Converts SQLite integer booleans back to proper booleans.
   */
  getSession(sessionId: string): Session | null {
    const row = this.stmtGetSession.get({ session_id: sessionId });
    if (row === null) return null;
    return rowToSession(row);
  }

  /**
   * Atomically set a single field on a session.
   *
   * If the session does not exist, creates it with defaults and then sets
   * the field. Uses INSERT ... ON CONFLICT DO UPDATE to avoid read-modify-write.
   *
   * Accepts dot-path field names (e.g., "notify.slack") and maps them to
   * column names.
   */
  setField(sessionId: string, dotPath: string, value: string | number | boolean | null): void {
    const column = FIELD_TO_COLUMN[dotPath];
    if (column === undefined || !VALID_COLUMNS.has(column)) {
      throw new Error(`Unknown or read-only config field: ${dotPath}`);
    }

    const ts = nowIso();

    // Coerce boolean values for INTEGER columns
    let sqlValue: string | number | null;
    if (column === 'notify_slack' || column === 'notify_telegram') {
      sqlValue = value === true || value === 'true' || value === 1 ? 1 : 0;
    } else if (value === null || value === 'null') {
      sqlValue = null;
    } else {
      sqlValue = String(value);
    }

    // Ensure session exists with defaults, then update the specific field.
    // Uses a transaction for atomicity.
    this.db.transaction(() => {
      // Insert with defaults if session does not exist
      const existing = this.stmtGetSession.get({ session_id: sessionId });
      if (existing === null) {
        const defaultTs = nowIso();
        this.stmtUpsertSession.run({
          session_id: sessionId,
          trivial_range: 'read-only',
          evaluation_mode: 'ask-each-time',
          git_workflow: 'direct-commit',
          base_branch: null,
          notify_slack: 0,
          notify_telegram: 0,
          created_at: defaultTs,
          last_accessed_at: defaultTs,
        });
      }

      // Update the specific column + last_accessed_at
      const stmt = this.getOrCreateSetFieldStmt(column);
      stmt.run({ value: sqlValue, last_accessed_at: ts, session_id: sessionId });
    }).immediate();
  }

  /**
   * Delete a session by ID.
   */
  deleteSession(sessionId: string): void {
    this.stmtDeleteSession.run({ session_id: sessionId });
  }

  /**
   * List all sessions, ordered by created_at ascending.
   */
  listSessions(): Array<{ sessionId: string; session: Session }> {
    const rows = this.stmtListSessions.all();
    return rows.map((row) => ({
      sessionId: row.session_id,
      session: rowToSession(row),
    }));
  }

  /**
   * Return total session count.
   */
  sessionCount(): number {
    const row = this.stmtCountSessions.get();
    return row?.cnt ?? 0;
  }

  // -------------------------------------------------------------------------
  // Metadata
  // -------------------------------------------------------------------------

  /**
   * Set a metadata key-value pair (upsert).
   */
  setMetadata(key: string, value: string): void {
    this.stmtUpsertMetadata.run({ key, value });
  }

  /**
   * Get a metadata value by key. Returns null if not found.
   */
  getMetadata(key: string): string | null {
    const row = this.stmtGetMetadata.get({ key });
    return row?.value ?? null;
  }

  // -------------------------------------------------------------------------
  // Cleanup
  // -------------------------------------------------------------------------

  /**
   * Run TTL + max-entries cleanup.
   *
   * Step 1: Remove sessions whose last_accessed_at is older than ttlDays.
   * Step 2: If more than maxSessions remain, keep only the newest.
   */
  cleanup(ttlDays: number = TTL_DAYS, maxSessions: number = MAX_SESSIONS): void {
    this.db.transaction(() => {
      // Step 1: TTL filter
      const cutoff = cutoffIso(ttlDays);
      this.stmtDeleteExpired.run({ cutoff });

      // Step 2: Max-sessions cap
      this.stmtDeleteExcess.run({ max_sessions: maxSessions });
    }).immediate();
  }

  // -------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------

  /** Close the database. Best-effort WAL checkpoint before closing. */
  close(): void {
    try {
      this.db.run('PRAGMA wal_checkpoint(TRUNCATE)');
    } catch {
      // Cleanup is best-effort — ignore errors (e.g., in-memory databases)
    }
    this.db.close();
  }

  /** Auto-cleanup via `using store = new ConfigStore(path)`. */
  [Symbol.dispose](): void {
    this.close();
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  /**
   * Build and cache a per-column UPDATE statement.
   *
   * The column name is validated against VALID_COLUMNS before use,
   * so this is safe from SQL injection.
   */
  private getOrCreateSetFieldStmt(
    column: string,
  ): ReturnType<Database['query']> {
    let stmt = this.stmtSetFieldCache.get(column);
    if (stmt !== undefined) return stmt;

    const sql = `UPDATE sessions SET ${column} = $value, last_accessed_at = $last_accessed_at WHERE session_id = $session_id`;
    stmt = this.db.query(sql);
    this.stmtSetFieldCache.set(column, stmt);
    return stmt;
  }
}

// ---------------------------------------------------------------------------
// Row conversion
// ---------------------------------------------------------------------------

/**
 * Convert a SQLite SessionRow to the domain Session type.
 * SQLite stores booleans as 0/1 integers — this converts them back.
 */
function rowToSession(row: SessionRow): Session {
  return {
    trivialRange: row.trivial_range,
    evaluationMode: row.evaluation_mode,
    gitWorkflow: row.git_workflow,
    baseBranch: row.base_branch,
    notify: {
      slack: row.notify_slack !== 0,
      telegram: row.notify_telegram !== 0,
    },
    createdAt: row.created_at,
    lastAccessedAt: row.last_accessed_at,
  };
}

// ---------------------------------------------------------------------------
// Path resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the path to config.db.
 *
 * Also attempts migration from legacy JSON files on first access:
 * if config.db doesn't exist but settings.json or gobbi.json does,
 * creates the database and migrates all sessions.
 */
export function openConfigStore(projectDir: string): ConfigStore {
  const dbPath = join(projectDir, '.gobbi', 'config.db');
  const dbExists = existsSync(dbPath);

  const store = new ConfigStore(dbPath);

  // Initialize metadata if fresh database
  if (!dbExists) {
    store.setMetadata('version', GOBBI_VERSION);
    store.setMetadata('architecture', GOBBI_ARCHITECTURE);

    // Attempt migration from legacy JSON files
    const settingsPath = join(projectDir, '.gobbi', 'settings.json');
    const legacyPath = join(projectDir, '.claude', 'gobbi.json');

    if (existsSync(settingsPath)) {
      store.migrateFromJson(settingsPath);
    } else if (existsSync(legacyPath)) {
      store.migrateFromJson(legacyPath);
    }
  }

  return store;
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * ISO 8601 timestamp for `ttlDays` days ago, without milliseconds.
 */
function cutoffIso(ttlDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - ttlDays);
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}
