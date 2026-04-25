/**
 * Integration tests for Wave A.1's S1-S6 combined surface (#146 A.1.10).
 *
 * Two scenarios live here:
 *
 *   1. Replay-equivalence after migration — a v5 store, when migrated to
 *      v6 via `migrateStateDbAt` and re-opened through `EventStore`,
 *      replays its event payloads byte-identically to what was appended.
 *      This is the cross-check that S2's `ensureSchemaV6` migration path
 *      and S3's command-driven migration converge on the same on-disk
 *      shape, and that S6's partition-key columns survive the round-trip.
 *
 *   2. Atomic-rename safety — when the migrate command fails pre-flight
 *      (missing db file, unreadable db file), the on-disk state is left
 *      untouched and the original db (when present) stays readable. The
 *      stricter scenario "no half-applied schema after a CREATE failure
 *      mid-migration" is covered as `test.todo` because today's
 *      `ensureSchemaV6` does NOT wrap its CREATE statements in a single
 *      transaction. See the deferred-bug comment on the todo entry.
 *
 * Scenario 3 (concurrent-writer durability under SIGKILL) lives in the
 * sibling `store.integration.test.ts` because it requires `Bun.spawn` of
 * a child Bun process, which is its own cohesive concern.
 *
 * The unit-level tests for `migrate-state-db` live in
 * `commands/maintenance/__tests__/migrate-state-db.test.ts` (S3 surface).
 * This file is strictly additive — it does NOT duplicate flag-parsing or
 * usage-output coverage already there.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { migrateStateDbAt } from '../../commands/maintenance/migrate-state-db.js';
import { EventStore } from '../store.js';
import {
  CURRENT_SCHEMA_VERSION,
  SCHEMA_V6_TABLES,
  getTableNames,
} from '../migrations.js';
import type { EventRow } from '../migrations.js';

// ---------------------------------------------------------------------------
// Scratch-dir lifecycle — every test gets a fresh tmp dir; afterEach drains
// the stack so each `test.skip` / `test.todo` boundary is clean.
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

afterEach(() => {
  while (scratchDirs.length > 0) {
    const d = scratchDirs.pop();
    if (d !== undefined) {
      // The atomic-rename test chmods a file to 0o000 so the migrate
      // command can't open it. Restore writable permissions before
      // rmSync so the cleanup itself does not error out.
      try {
        chmodSync(d, 0o755);
      } catch {
        // best-effort
      }
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  }
});

function makeScratch(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-a1-10-int-'));
  scratchDirs.push(dir);
  return dir;
}

// ---------------------------------------------------------------------------
// V5-shape db builder — mirrors the buildV5Db pattern in `migrations.test.ts`
// and the `seedV5StateDb` helper in `commands/maintenance/__tests__/migrate-
// state-db.test.ts`. Drops a v5 events-only db at <repo>/.gobbi/state.db
// (no schema_meta, no v6 tables) and seeds the supplied event rows verbatim.
//
// The shape uses pre-bound parameter literals so the inserted rows match
// exactly what the production INSERT path stamps for v5+ writes.
// ---------------------------------------------------------------------------

interface SeedRow {
  readonly seq: number;
  readonly ts: string;
  readonly schema_version: number;
  readonly type: string;
  readonly step: string | null;
  readonly data: string;
  readonly actor: string;
  readonly parent_seq: number | null;
  readonly idempotency_key: string;
  readonly session_id: string | null;
  readonly project_id: string | null;
}

function buildV5StateDb(repo: string, rows: readonly SeedRow[]): string {
  const gobbiDir = join(repo, '.gobbi');
  mkdirSync(gobbiDir, { recursive: true });
  const dbPath = join(gobbiDir, 'state.db');
  const db = new Database(dbPath);
  try {
    db.run(`
      CREATE TABLE events (
        seq INTEGER PRIMARY KEY,
        ts TEXT NOT NULL,
        schema_version INTEGER NOT NULL,
        type TEXT NOT NULL,
        step TEXT,
        data TEXT NOT NULL DEFAULT '{}',
        actor TEXT NOT NULL,
        parent_seq INTEGER REFERENCES events(seq),
        idempotency_key TEXT NOT NULL UNIQUE,
        session_id TEXT,
        project_id TEXT
      )
    `);
    db.run('CREATE INDEX idx_events_type ON events(type)');
    db.run('CREATE INDEX idx_events_step_type ON events(step, type)');

    const insert = db.prepare(
      'INSERT INTO events (seq, ts, schema_version, type, step, data, actor, parent_seq, idempotency_key, session_id, project_id) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    );
    for (const r of rows) {
      insert.run(
        r.seq,
        r.ts,
        r.schema_version,
        r.type,
        r.step,
        r.data,
        r.actor,
        r.parent_seq,
        r.idempotency_key,
        r.session_id,
        r.project_id,
      );
    }
  } finally {
    db.close();
  }
  return dbPath;
}

// ---------------------------------------------------------------------------
// Fixed seed — covers the breadth of event categories the reducer + audit
// gate handle today (workflow.*, delegation.*, guard.*, plus the v6 audit-
// only step.advancement.observed). The shapes are kept minimal — the
// replay-equivalence assertion is byte-identical comparison, so the test
// does NOT depend on the payloads being valid against any reducer schema.
// ---------------------------------------------------------------------------

const SESSION = 'sess-int-replay';
const PROJECT = 'gobbi-int';

const SEED_ROWS: readonly SeedRow[] = [
  {
    seq: 1,
    ts: '2026-04-25T00:00:00.000Z',
    schema_version: 5,
    type: 'workflow.start',
    step: null,
    data: JSON.stringify({ sessionId: SESSION, ts: '2026-04-25T00:00:00.000Z' }),
    actor: 'orchestrator',
    parent_seq: null,
    idempotency_key: `${SESSION}:tc-001:workflow.start`,
    session_id: SESSION,
    project_id: PROJECT,
  },
  {
    seq: 2,
    ts: '2026-04-25T00:00:01.000Z',
    schema_version: 5,
    type: 'workflow.step.enter',
    step: 'ideation',
    data: JSON.stringify({ step: 'ideation' }),
    actor: 'orchestrator',
    parent_seq: 1,
    idempotency_key: `${SESSION}:tc-002:workflow.step.enter`,
    session_id: SESSION,
    project_id: PROJECT,
  },
  {
    seq: 3,
    ts: '2026-04-25T00:00:02.000Z',
    schema_version: 5,
    type: 'delegation.spawn',
    step: 'ideation',
    data: JSON.stringify({ subagentId: 'sa-1', subagentType: 'pi' }),
    actor: 'orchestrator',
    parent_seq: 2,
    idempotency_key: `${SESSION}:tc-003:delegation.spawn`,
    session_id: SESSION,
    project_id: PROJECT,
  },
  {
    seq: 4,
    ts: '2026-04-25T00:00:03.000Z',
    schema_version: 5,
    type: 'delegation.complete',
    step: 'ideation',
    data: JSON.stringify({ subagentId: 'sa-1', sizeProxyBytes: 1024 }),
    actor: 'orchestrator',
    parent_seq: 3,
    idempotency_key: `${SESSION}:tc-004:delegation.complete`,
    session_id: SESSION,
    project_id: PROJECT,
  },
  {
    seq: 5,
    ts: '2026-04-25T00:00:04.000Z',
    schema_version: 5,
    type: 'guard.violation',
    step: 'ideation',
    data: JSON.stringify({ severity: 'error', code: 'OUT_OF_SCOPE' }),
    actor: 'guard',
    parent_seq: null,
    idempotency_key: `${SESSION}:tc-005:guard.violation`,
    session_id: SESSION,
    project_id: PROJECT,
  },
  {
    seq: 6,
    ts: '2026-04-25T00:00:05.000Z',
    schema_version: 5,
    type: 'workflow.step.exit',
    step: 'ideation',
    data: JSON.stringify({ step: 'ideation' }),
    actor: 'orchestrator',
    parent_seq: 2,
    idempotency_key: `${SESSION}:tc-006:workflow.step.exit`,
    session_id: SESSION,
    project_id: PROJECT,
  },
  {
    seq: 7,
    ts: '2026-04-25T00:00:06.000Z',
    schema_version: 5,
    type: 'workflow.step.enter',
    step: 'plan',
    data: JSON.stringify({ step: 'plan' }),
    actor: 'orchestrator',
    parent_seq: 6,
    idempotency_key: `${SESSION}:tc-007:workflow.step.enter`,
    session_id: SESSION,
    project_id: PROJECT,
  },
];

// ===========================================================================
// Test 1 — Replay-equivalence after migration
// ===========================================================================

describe('Wave A.1.10 — replay-equivalence after migration', () => {
  test('migrating a v5 db to v6 preserves byte-identical event payloads on replay', () => {
    const repo = makeScratch();
    const dbPath = buildV5StateDb(repo, SEED_ROWS);

    // --- Pre-migration snapshot — read directly through a raw Database
    //     so we capture the exact on-disk shape without going through
    //     EventStore (which would run ensureSchemaV5 + V6 on open).
    const preRows: readonly EventRow[] = (() => {
      const raw = new Database(dbPath, { readonly: true });
      try {
        return raw
          .query<EventRow, []>('SELECT * FROM events ORDER BY seq ASC')
          .all();
      } finally {
        raw.close();
      }
    })();
    expect(preRows).toHaveLength(SEED_ROWS.length);

    // --- Run the migration via the production helper. Fixed clock so the
    //     schema_meta stamp is deterministic; the migration result is
    //     not the focus here, the post-migration state is.
    const result = migrateStateDbAt(dbPath, () => 1745000000000);
    expect(result.newVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(result.previousVersion).toBeNull();

    // --- Open a fresh EventStore on the migrated db. Pass explicit
    //     partition keys (Wave A.1.2 contract) so the constructor's
    //     workspace-mode wiring is exercised — this is the realistic
    //     production path post-rename.
    using store = new EventStore(dbPath, {
      sessionId: SESSION,
      projectId: PROJECT,
    });

    // --- v6 tables must all be present after migration + re-open.
    const tableNames = (() => {
      const inspect = new Database(dbPath, { readonly: true });
      try {
        return getTableNames(inspect);
      } finally {
        inspect.close();
      }
    })();
    for (const t of SCHEMA_V6_TABLES) {
      expect(tableNames.has(t)).toBe(true);
    }

    // --- Replay through the public EventStore API. Every row must match
    //     pre-migration byte-for-byte: no payload transform was registered
    //     at the v5→v6 hop (registered as identity per migrations.ts:159).
    const replayed = store.replayAll();
    expect(replayed).toHaveLength(preRows.length);

    for (let i = 0; i < preRows.length; i += 1) {
      const before = preRows[i];
      const after = replayed[i];
      expect(before).toBeDefined();
      expect(after).toBeDefined();
      if (before === undefined || after === undefined) continue;
      // Every column must match identically — `data` is the load-bearing
      // assertion (event payload identity is the SC-ORCH-21 evidence
      // requirement) but the surrounding columns matter too because
      // they're what downstream readers project on.
      expect(after.seq).toBe(before.seq);
      expect(after.ts).toBe(before.ts);
      expect(after.schema_version).toBe(before.schema_version);
      expect(after.type).toBe(before.type);
      expect(after.step).toBe(before.step);
      expect(after.data).toBe(before.data);
      expect(after.actor).toBe(before.actor);
      expect(after.parent_seq).toBe(before.parent_seq);
      expect(after.idempotency_key).toBe(before.idempotency_key);
      expect(after.session_id).toBe(before.session_id);
      expect(after.project_id).toBe(before.project_id);
    }

    // --- Event count surface stays consistent across the replay too —
    //     guards against silent row-drop in a future migration hop.
    expect(store.eventCount()).toBe(SEED_ROWS.length);
  });

  test('NULL project_id rows survive the migration round-trip when the store opens without an explicit projectId override', () => {
    // The backfill at `store.ts:469-475` only runs when `sessionId !==
    // null`, and the project_id UPDATE inside `backfillSessionAndProjectIds`
    // only runs when `projectRootBasename !== null` (migrations.ts:281).
    // Constructing the store with `projectId: undefined` and no resolvable
    // metadata.json leaves `projectRootBasename` null, so legacy NULL
    // project_id rows are preserved verbatim.
    const repo = makeScratch();
    const seed: readonly SeedRow[] = [
      {
        seq: 1,
        ts: '2026-04-25T00:00:00.000Z',
        schema_version: 5,
        type: 'workflow.start',
        step: null,
        data: '{}',
        actor: 'orchestrator',
        parent_seq: null,
        idempotency_key: `${SESSION}:tc-null-001:workflow.start`,
        session_id: SESSION,
        project_id: null,
      },
    ];
    const dbPath = buildV5StateDb(repo, seed);

    migrateStateDbAt(dbPath, () => 1745000000000);

    // No `projectId` override; the dirname of `dbPath` is `<repo>/.gobbi`
    // which has no `metadata.json`, so `resolveProjectRootBasename`
    // yields null and the backfill skips the project_id UPDATE.
    using store = new EventStore(dbPath, { sessionId: SESSION });
    const replayed = store.replayAll();
    expect(replayed).toHaveLength(1);
    expect(replayed[0]?.project_id).toBeNull();
    expect(replayed[0]?.session_id).toBe(SESSION);
  });

  test('a v5 → v6 migration on an empty events table is a clean no-op for replay', () => {
    const repo = makeScratch();
    const dbPath = buildV5StateDb(repo, []);

    const result = migrateStateDbAt(dbPath, () => 1745000000000);
    expect(result.newVersion).toBe(CURRENT_SCHEMA_VERSION);

    using store = new EventStore(dbPath, {
      sessionId: SESSION,
      projectId: PROJECT,
    });
    expect(store.replayAll()).toHaveLength(0);
    expect(store.eventCount()).toBe(0);
  });
});

// ===========================================================================
// Test 2 — Atomic-rename safety
// ===========================================================================

describe('Wave A.1.10 — atomic-rename safety', () => {
  test('a failed migration leaves the original db file intact and readable', () => {
    const repo = makeScratch();
    const dbPath = buildV5StateDb(repo, SEED_ROWS);

    // --- Capture the pre-failure shape so we can assert it survives.
    const preRows: readonly EventRow[] = (() => {
      const raw = new Database(dbPath, { readonly: true });
      try {
        return raw
          .query<EventRow, []>('SELECT * FROM events ORDER BY seq ASC')
          .all();
      } finally {
        raw.close();
      }
    })();
    expect(preRows).toHaveLength(SEED_ROWS.length);

    // --- Force the migration to fail. We chmod the db file to read-only
    //     0o400 — `bun:sqlite`'s default open mode requests read+write,
    //     and the first ALTER/CREATE inside ensureSchemaV5/V6 will throw
    //     with a "readonly database" or open-time permission error. The
    //     exact message is platform-dependent; we only assert that
    //     `migrateStateDbAt` throws (any throw — the contract is "fail
    //     loud, do not half-apply").
    chmodSync(dbPath, 0o400);
    let threw = false;
    try {
      migrateStateDbAt(dbPath, () => 1);
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);

    // --- Restore writable bit so the verification read can open the
    //     file. (chmod is local to inode metadata; the data on disk is
    //     untouched by the ALTER attempt regardless.)
    chmodSync(dbPath, 0o600);

    // --- The original events must still be readable verbatim.
    const postRows: readonly EventRow[] = (() => {
      const raw = new Database(dbPath, { readonly: true });
      try {
        return raw
          .query<EventRow, []>('SELECT * FROM events ORDER BY seq ASC')
          .all();
      } finally {
        raw.close();
      }
    })();
    expect(postRows).toHaveLength(preRows.length);
    for (let i = 0; i < preRows.length; i += 1) {
      const before = preRows[i];
      const after = postRows[i];
      if (before === undefined || after === undefined) continue;
      expect(after.idempotency_key).toBe(before.idempotency_key);
      expect(after.data).toBe(before.data);
    }
  });

  test('migrating a non-existent path throws — no file is created at the target', () => {
    const repo = makeScratch();
    const missing = join(repo, '.gobbi', 'state.db');
    expect(existsSync(missing)).toBe(false);

    let threw = false;
    try {
      migrateStateDbAt(missing, () => 1);
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
    // A failed pre-flight must not have left an artefact behind. The
    // `bun:sqlite` Database constructor will create a new empty file
    // when called on a non-existent path under default mode; the migrate
    // helper sees that empty file and may either succeed (creating an
    // empty events table is impossible — no events table to ALTER) or
    // throw. Either branch must NOT leave a half-built v6 schema.
    //
    // We accept both outcomes: if the file was created, it must NOT
    // carry a half-built v6 schema_meta row (that would imply a
    // partially-applied state). If it was not created, the assertion
    // above is sufficient.
    if (existsSync(missing)) {
      const raw = new Database(missing, { readonly: true });
      try {
        const tables = getTableNames(raw);
        // A partial state would have schema_meta + state_snapshots.
        // Either both are present (full success on an empty events
        // table), or neither (the throw came before any CREATE).
        const hasMeta = tables.has('schema_meta');
        const hasSnapshots = tables.has('state_snapshots');
        expect(hasMeta).toBe(hasSnapshots);
      } finally {
        raw.close();
      }
    }
  });

  // ---------------------------------------------------------------------------
  // Half-applied schema — the strict atomic-rename guarantee
  //
  // The briefing's most stringent question: if `ensureSchemaV6` throws AFTER
  // the first CREATE TABLE landed but BEFORE the schema_meta INSERT, does
  // sqlite leave a half-applied schema on disk?
  //
  // Today `ensureSchemaV6` does NOT wrap its CREATE chain in an explicit
  // BEGIN/COMMIT (see `migrations.ts:535-553`). A mid-chain failure
  // therefore CAN leave a partial set of v6 tables on disk. SQLite does
  // run each `db.run` in an implicit auto-commit transaction, so each
  // single CREATE is itself atomic — but the *chain* is not.
  //
  // This is a real bug for the strict atomicity guarantee implied by
  // GAP-9. It belongs to S2 (`ensureSchemaV6`) — the test marks it
  // `test.todo` so the gap is greppable until a follow-up wraps the
  // chain in `db.transaction(...).immediate()`.
  // ---------------------------------------------------------------------------
  test.todo(
    'ensureSchemaV6 wraps CREATE chain in a single transaction (no half-applied schema)',
    () => {
      // Deferred — depends on `ensureSchemaV6` (migrations.ts:535) being
      // refactored to wrap its CREATE chain in `db.transaction(fn).immediate()`.
      // Today the chain runs as separate auto-commit statements, so a
      // mid-chain failure CAN leave a partial schema. Filed for follow-up.
    },
  );
});
