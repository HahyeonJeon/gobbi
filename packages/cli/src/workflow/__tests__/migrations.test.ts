/**
 * Event schema migration tests — `workflow/migrations.ts` + integration with
 * `state.ts::readState` for v1 on-disk compat.
 *
 * Covers the Wave 2 (C.8-d) disciplines plus the v3 extensions from PR D.5:
 *
 *   1. CURRENT_SCHEMA_VERSION canary pin — any future bump (v3→v4, etc.)
 *      must trip this test so every downstream migration wiring is audited
 *      in lockstep. Mirrors `specs/__tests__/migrations.test.ts:89` for step specs.
 *   2. Registry completeness — for every v between 1 and
 *      `CURRENT_SCHEMA_VERSION - 1`, a migration hop must be registered.
 *      A missing key would throw at read time for historical events.
 *   3. v1 → v2 round-trip — a v1 fixture JSONL of representative events
 *      (including `guard.violation`) migrates cleanly and reduces to a
 *      valid v2-shaped WorkflowState with `lastVerdictOutcome: null` and
 *      violations either unannotated or `'error'`-severity. PR D's v3 bump
 *      and PR E's v4 bump are both identities on event data, so the same
 *      fixture now migrates all the way to v4 and the reduced state
 *      advertises `schemaVersion: 4`.
 *   4. v2 → v3 round-trip — a representative v2 event (incl. a PR C-era
 *      `decision.eval.skip` without `priorError`) migrates to v3 with an
 *      identical payload.
 *   5. v3 `decision.eval.skip` with `priorError` — a full `ErrorPathway`
 *      snapshot round-trips through `JSON.stringify` / `JSON.parse` at the
 *      event-store boundary. Asserts CP11 reversibility is preserved by
 *      the wire format.
 *   6. v1 state.json on-disk compat — a state.json written by a pre-PR-C
 *      process is readable via `readState`; the in-memory resolved state
 *      has `lastVerdictOutcome: null` normalised in and violations default
 *      to `severity: 'error'`.
 *
 * Note on purity: migrateEvent's `data` parse-on-non-identity is a deliberate
 * part of every walk even when each hop is an identity transform — the
 * walk path exercises the composition plumbing that a future v4 migration
 * inherits, so we test the path rather than its short-circuit.
 */

import { describe, test, expect } from 'bun:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { CURRENT_SCHEMA_VERSION, migrateEvent } from '../migrations.js';
import type { EventRow } from '../migrations.js';
import { deriveState, readState } from '../state.js';
import { reduce } from '../reducer.js';
import type { PriorErrorSnapshot } from '../events/decision.js';
import type { ErrorPathway } from '../../specs/errors.js';

/**
 * Legacy-v4-row partition-key defaults — every fixture in this file
 * represents a row written under a pre-v5 schema, so `session_id` and
 * `project_id` start as `null` (the shape pre-backfill). Spread into
 * each row literal so the strict `EventRow` shape compiles after the
 * v5 column addition. v5+ rows set these explicitly.
 */
const LEGACY_PARTITION: Pick<EventRow, 'session_id' | 'project_id'> = {
  session_id: null,
  project_id: null,
};

// ---------------------------------------------------------------------------
// 1. Canary pin
// ---------------------------------------------------------------------------

describe('CURRENT_SCHEMA_VERSION', () => {
  test('is 5 — schema v5 landed in gobbi-memory Pass 2 (session_id + project_id columns on events table)', () => {
    expect(CURRENT_SCHEMA_VERSION).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// 1b. Registry completeness
// ---------------------------------------------------------------------------

describe('migration registry completeness', () => {
  test('every hop from v1 to CURRENT_SCHEMA_VERSION-1 resolves as an identity', () => {
    // We cannot import the private `migrations` record, so we exercise the
    // composition by feeding a representative v1 event through migrateEvent
    // with an explicit per-hop target. A missing hop throws; an identity
    // hop returns the same payload.
    const row: EventRow = {
      seq: 1,
      ts: '2026-01-01T00:00:00.000Z',
      schema_version: 1,
      type: 'workflow.start',
      step: null,
      data: JSON.stringify({
        sessionId: 's',
        timestamp: '2026-01-01T00:00:00.000Z',
      }),
      actor: 'orchestrator',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-canary:workflow.start',
      ...LEGACY_PARTITION,
    };
    for (let v = 2; v <= CURRENT_SCHEMA_VERSION; v++) {
      // Fresh row each iteration to avoid contamination.
      const migrated = migrateEvent(row, v);
      expect(migrated.schema_version).toBe(v);
      expect(JSON.parse(migrated.data)).toEqual(JSON.parse(row.data));
    }
  });
});

// ---------------------------------------------------------------------------
// 2. v1 → v2 event round-trip
// ---------------------------------------------------------------------------

describe('v1 → v2 event round-trip', () => {
  // Representative v1 event fixture — six events covering workflow start,
  // eval decision, step transition, a guard violation, and an artifact write.
  // Schema v1 means no `lastVerdictOutcome` or `severity` appear in the data
  // payload; v1→v2 is an identity for event data so none of these fields
  // should materialise after migration.
  const v1Events: readonly EventRow[] = [
    {
      seq: 1,
      ts: '2026-01-01T00:00:00.000Z',
      schema_version: 1,
      type: 'workflow.start',
      step: null,
      data: JSON.stringify({
        sessionId: 'sess-v1',
        timestamp: '2026-01-01T00:00:00.000Z',
      }),
      actor: 'orchestrator',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-001:workflow.start',
      ...LEGACY_PARTITION,
    },
    {
      seq: 2,
      ts: '2026-01-01T00:00:01.000Z',
      schema_version: 1,
      type: 'workflow.eval.decide',
      step: null,
      data: JSON.stringify({ ideation: false, plan: false }),
      actor: 'orchestrator',
      parent_seq: 1,
      idempotency_key: 'tool-call:tc-002:workflow.eval.decide',
      ...LEGACY_PARTITION,
    },
    {
      seq: 3,
      ts: '2026-01-01T00:00:02.000Z',
      schema_version: 1,
      type: 'workflow.step.exit',
      step: 'ideation',
      data: JSON.stringify({ step: 'ideation' }),
      actor: 'orchestrator',
      parent_seq: 2,
      idempotency_key: 'tool-call:tc-003:workflow.step.exit',
      ...LEGACY_PARTITION,
    },
    {
      seq: 4,
      ts: '2026-01-01T00:00:03.000Z',
      schema_version: 1,
      type: 'guard.violation',
      step: 'plan',
      data: JSON.stringify({
        guardId: 'g-scope',
        toolName: 'Write',
        reason: 'outside scope',
        step: 'plan',
        timestamp: '2026-01-01T00:00:03.000Z',
      }),
      actor: 'hook',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-004:guard.violation',
      ...LEGACY_PARTITION,
    },
    {
      seq: 5,
      ts: '2026-01-01T00:00:04.000Z',
      schema_version: 1,
      type: 'workflow.step.exit',
      step: 'plan',
      data: JSON.stringify({ step: 'plan' }),
      actor: 'orchestrator',
      parent_seq: 4,
      idempotency_key: 'tool-call:tc-005:workflow.step.exit',
      ...LEGACY_PARTITION,
    },
    {
      seq: 6,
      ts: '2026-01-01T00:00:05.000Z',
      schema_version: 1,
      type: 'artifact.write',
      step: 'execution',
      data: JSON.stringify({
        step: 'execution',
        filename: 'research.md',
        artifactType: 'note',
      }),
      actor: 'executor',
      parent_seq: 5,
      idempotency_key: 'tool-call:tc-006:artifact.write',
      ...LEGACY_PARTITION,
    },
  ];

  test('each row migrates to v2 with identical event-data payload', () => {
    for (const row of v1Events) {
      const migrated = migrateEvent(row, 2);
      expect(migrated.schema_version).toBe(2);
      expect(JSON.parse(migrated.data)).toEqual(JSON.parse(row.data));
    }
  });

  test('each row migrates to CURRENT_SCHEMA_VERSION with identical event-data payload', () => {
    // PR D's v2→v3 identity, PR E's v3→v4 identity, and Pass 2's v4→v5
    // identity all extend the chain — a v1 row still walks to the current
    // target with an unchanged payload.
    for (const row of v1Events) {
      const migrated = migrateEvent(row, CURRENT_SCHEMA_VERSION);
      expect(migrated.schema_version).toBe(CURRENT_SCHEMA_VERSION);
      expect(JSON.parse(migrated.data)).toEqual(JSON.parse(row.data));
    }
  });

  test('replayed v1 events reduce to a valid in-memory WorkflowState', () => {
    const state = deriveState('sess-v1', v1Events, reduce);
    // The in-memory `initialState().schemaVersion` is currently pinned
    // at 4 in `state.ts`; `CURRENT_SCHEMA_VERSION` at 5 reflects the
    // row-level schema (new `session_id` / `project_id` columns). The
    // two values are intentionally decoupled under gobbi-memory Pass 2
    // because the v5 bump is a pure row-shape change that carries no
    // in-memory state-field addition, so the reducer has nothing to
    // normalise. A later pass that lifts state-shape fields to v5+
    // will bump `initialState().schemaVersion` and re-tighten this
    // assertion.
    expect(state.schemaVersion).toBe(4);
    // The new field initialises to null and only populates on an EVAL_VERDICT
    // — none of these fixtures fires one, so it must remain null.
    expect(state.lastVerdictOutcome).toBeNull();
    // Guard violations flow through reduceGuard, which annotates severity
    // from the event type — a v1 guard.violation reduced under v2 rules
    // lands as `'error'`. (No migration-time back-fill of severity is
    // claimed; this only tests the forward path.)
    expect(state.violations.length).toBeGreaterThan(0);
    for (const v of state.violations) {
      expect(v.severity).toBe('error');
    }
  });
});

// ---------------------------------------------------------------------------
// 2b. v2 → v3 event round-trip (PR D — identity on event data)
// ---------------------------------------------------------------------------

describe('v2 → v3 event round-trip', () => {
  // A v2 `decision.eval.skip` without `priorError` — the common case. Under
  // PR D's v2→v3 identity, the payload is indistinguishable from a v3 skip
  // that happens not to carry a priorError snapshot.
  const v2EvalSkip: EventRow = {
    seq: 42,
    ts: '2026-02-01T00:00:00.000Z',
    schema_version: 2,
    type: 'decision.eval.skip',
    step: 'ideation_eval',
    data: JSON.stringify({ step: 'ideation_eval' }),
    actor: 'orchestrator',
    parent_seq: 41,
    idempotency_key: 'tool-call:tc-042:decision.eval.skip',
    ...LEGACY_PARTITION,
  };

  test('v2 decision.eval.skip (no priorError) migrates to v4 unchanged (intermediate hop)', () => {
    const migrated = migrateEvent(v2EvalSkip, 4);
    expect(migrated.schema_version).toBe(4);
    expect(JSON.parse(migrated.data)).toEqual(JSON.parse(v2EvalSkip.data));
    // The raw JSON string is byte-identical — the identity transform does
    // NOT re-serialise with different whitespace.
    expect(migrated.data).toBe(v2EvalSkip.data);
  });

  test('a v2 guard.warn event migrates to v4 unchanged', () => {
    const v2GuardWarn: EventRow = {
      seq: 7,
      ts: '2026-02-01T00:00:00.000Z',
      schema_version: 2,
      type: 'guard.warn',
      step: 'execution',
      data: JSON.stringify({
        guardId: 'no-secrets',
        toolName: 'Write',
        reason: 'path contains credential-like token',
        step: 'execution',
        timestamp: '2026-02-01T00:00:00.000Z',
      }),
      actor: 'hook',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-007:guard.warn',
      ...LEGACY_PARTITION,
    };
    const migrated = migrateEvent(v2GuardWarn, 4);
    expect(migrated.schema_version).toBe(4);
    expect(JSON.parse(migrated.data)).toEqual(JSON.parse(v2GuardWarn.data));
  });

  test('migrateEvent short-circuits when already at target', () => {
    const v3Row: EventRow = { ...v2EvalSkip, schema_version: 3 };
    const migrated = migrateEvent(v3Row, 3);
    // Short-circuit returns the input reference unchanged.
    expect(migrated).toBe(v3Row);
  });
});

// ---------------------------------------------------------------------------
// 2c. v3 `decision.eval.skip` with `priorError` — CP11 reversibility
// ---------------------------------------------------------------------------

describe('v3 decision.eval.skip with priorError (CP11 reversibility)', () => {
  // Full pathway + snapshot fixture covering every currently-supported
  // ErrorPathway variant. The round-trip must preserve the nested structure
  // byte-for-byte through JSON.stringify → JSON.parse.

  test('a crash-pathway priorError round-trips through JSON', () => {
    const pathway: ErrorPathway = {
      kind: 'crash',
      stepAtCrash: 'execution',
      lastEventSeqs: [10, 11, 12],
      heartbeatEventSeq: 9,
    };
    const priorError: PriorErrorSnapshot = {
      pathway,
      capturedAt: '2026-02-01T00:00:00.000Z',
      stepAtError: 'error',
      witnessEventSeqs: [9, 10, 11, 12],
    };
    const payload = { step: 'memorization', priorError };
    const row: EventRow = {
      seq: 50,
      ts: '2026-02-01T00:00:00.000Z',
      schema_version: 3,
      type: 'decision.eval.skip',
      step: 'error',
      data: JSON.stringify(payload),
      actor: 'orchestrator',
      parent_seq: 49,
      idempotency_key: 'tool-call:tc-050:decision.eval.skip',
      ...LEGACY_PARTITION,
    };
    const migrated = migrateEvent(row, 4);
    expect(migrated.schema_version).toBe(4);
    const parsed = JSON.parse(migrated.data) as typeof payload;
    expect(parsed).toEqual(payload);
    // Structural identity — nested ErrorPathway variants survive the trip.
    expect(parsed.priorError?.pathway.kind).toBe('crash');
    expect(parsed.priorError?.witnessEventSeqs).toEqual([9, 10, 11, 12]);
  });

  test('a timeout-pathway priorError round-trips through JSON', () => {
    const pathway: ErrorPathway = {
      kind: 'timeout',
      timedOutStep: 'execution',
      elapsedMs: 15_000,
      configuredTimeoutMs: 10_000,
      timeoutEventSeq: 33,
      inProgressArtifacts: ['research.md', 'notes.md'],
    };
    const priorError: PriorErrorSnapshot = {
      pathway,
      capturedAt: '2026-02-01T00:00:00.000Z',
      stepAtError: 'error',
      witnessEventSeqs: [33],
    };
    const payload = { step: 'memorization', priorError };
    const serialised = JSON.stringify(payload);
    const reparsed = JSON.parse(serialised) as typeof payload;
    expect(reparsed).toEqual(payload);
    // Narrowing the reconstructed pathway back to its variant still works.
    const reconstructed = reparsed.priorError?.pathway;
    if (reconstructed?.kind === 'timeout') {
      expect(reconstructed.timedOutStep).toBe('execution');
      expect(reconstructed.inProgressArtifacts).toEqual([
        'research.md',
        'notes.md',
      ]);
    } else {
      throw new Error('pathway did not round-trip as timeout variant');
    }
  });

  test('a feedbackCap-pathway priorError with verdict history round-trips', () => {
    const pathway: ErrorPathway = {
      kind: 'feedbackCap',
      feedbackRound: 3,
      maxFeedbackRounds: 3,
      verdictHistory: [
        {
          round: 1,
          verdict: 'revise',
          verdictSeq: 20,
          loopTarget: 'execution',
          evaluatorId: 'eval-1',
        },
        {
          round: 2,
          verdict: 'revise',
          verdictSeq: 24,
          loopTarget: 'execution',
          evaluatorId: 'eval-1',
        },
        {
          round: 3,
          verdict: 'revise',
          verdictSeq: 28,
          loopTarget: null,
          evaluatorId: null,
        },
      ],
      finalRoundArtifacts: ['exec.md'],
    };
    const priorError: PriorErrorSnapshot = {
      pathway,
      capturedAt: '2026-02-01T00:00:00.000Z',
      stepAtError: 'error',
      witnessEventSeqs: [20, 24, 28],
    };
    const payload = { step: 'memorization', priorError };
    const reparsed = JSON.parse(JSON.stringify(payload)) as typeof payload;
    expect(reparsed).toEqual(payload);
  });

  test('a v2 eval.skip migrates to v3 without magically gaining priorError', () => {
    // Guard against a regression where the identity hop accidentally injects
    // the optional field.
    const v2Row: EventRow = {
      seq: 7,
      ts: '2026-02-01T00:00:00.000Z',
      schema_version: 2,
      type: 'decision.eval.skip',
      step: 'plan_eval',
      data: JSON.stringify({ step: 'plan_eval' }),
      actor: 'orchestrator',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-007:decision.eval.skip',
      ...LEGACY_PARTITION,
    };
    const migrated = migrateEvent(v2Row, 3);
    const parsed = JSON.parse(migrated.data) as {
      step: string;
      priorError?: PriorErrorSnapshot;
    };
    expect(parsed.step).toBe('plan_eval');
    expect(parsed.priorError).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// 2d. v4 → v5 row-level migration (gobbi-memory Pass 2) — column ALTER +
//     legacy-row backfill. Event data payloads remain unchanged; the
//     registered v4→v5 hop is an identity.
// ---------------------------------------------------------------------------

describe('v4 → v5 event round-trip (identity on event data)', () => {
  test('a v4 delegation.complete migrates to v5 unchanged', () => {
    const v4Row: EventRow = {
      seq: 60,
      ts: '2026-04-01T00:00:00.000Z',
      schema_version: 4,
      type: 'delegation.complete',
      step: 'execution',
      data: JSON.stringify({
        subagentId: 'sub-1',
        model: 'claude-opus-4-7',
        sizeProxyBytes: 10_000,
      }),
      actor: 'orchestrator',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-060:delegation.complete',
      ...LEGACY_PARTITION,
    };
    const migrated = migrateEvent(v4Row, 5);
    expect(migrated.schema_version).toBe(5);
    expect(JSON.parse(migrated.data)).toEqual(JSON.parse(v4Row.data));
    // Byte-identical data string — the identity transform does NOT
    // re-serialise with different whitespace.
    expect(migrated.data).toBe(v4Row.data);
  });

  test('a v4 row with the full v4 payload surface walks to v5 losslessly', () => {
    const v4Row: EventRow = {
      seq: 61,
      ts: '2026-04-01T00:00:01.000Z',
      schema_version: 4,
      type: 'verification.result',
      step: 'execution',
      data: JSON.stringify({
        subagentId: 'sub-2',
        command: 'bun run typecheck',
        commandKind: 'typecheck',
        exitCode: 0,
        durationMs: 1500,
        policy: 'gate',
        timedOut: false,
        stdoutDigest: '0'.repeat(64),
        stderrDigest: '0'.repeat(64),
      }),
      actor: 'orchestrator',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-061:verification.result',
      ...LEGACY_PARTITION,
    };
    const migrated = migrateEvent(v4Row, 5);
    expect(migrated.schema_version).toBe(5);
    expect(JSON.parse(migrated.data)).toEqual(JSON.parse(v4Row.data));
  });
});

describe('v4 → v5 schema ALTER + backfill', () => {
  // Build a bare v4 `events` table on an in-memory sqlite db, seed rows
  // with the legacy column set, then open an `EventStore` against the
  // on-disk path — the constructor runs `ensureSchemaV5` + backfill as
  // part of `initSchema`, so by the time the test reads back, both
  // partition-key columns must be present and populated.
  test('ensureSchemaV5 adds session_id + project_id columns to an existing v4 table', async () => {
    const { Database } = await import('bun:sqlite');
    const db = new Database(':memory:');
    try {
      // Legacy v4 CREATE TABLE — no session_id / project_id columns.
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
          idempotency_key TEXT NOT NULL UNIQUE
        )
      `);

      const { ensureSchemaV5, getEventsColumnNames } = await import(
        '../migrations.js'
      );
      expect(getEventsColumnNames(db).has('session_id')).toBe(false);
      expect(getEventsColumnNames(db).has('project_id')).toBe(false);

      ensureSchemaV5(db);
      const after = getEventsColumnNames(db);
      expect(after.has('session_id')).toBe(true);
      expect(after.has('project_id')).toBe(true);

      // Idempotent — a second call must not throw (the columns exist now).
      ensureSchemaV5(db);
      expect(getEventsColumnNames(db).size).toBe(after.size);
    } finally {
      db.close();
    }
  });

  test('backfillSessionAndProjectIds stamps NULL rows without touching pre-populated rows', async () => {
    const { Database } = await import('bun:sqlite');
    const db = new Database(':memory:');
    try {
      // Create the full v5-shape table upfront so we can drive the
      // backfill directly without re-exercising ensureSchemaV5.
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

      // Seed three rows: two legacy-shape (session_id + project_id NULL)
      // and one pre-populated (should be left alone by the backfill).
      const insert = db.prepare(
        'INSERT INTO events (seq, ts, schema_version, type, step, data, actor, parent_seq, idempotency_key, session_id, project_id) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      );
      insert.run(1, '2026-04-01T00:00:00Z', 4, 'workflow.start', null, '{}', 'cli', null, 'k-1', null, null);
      insert.run(2, '2026-04-01T00:00:01Z', 4, 'workflow.step.exit', 'ideation', '{}', 'cli', 1, 'k-2', null, null);
      insert.run(3, '2026-04-01T00:00:02Z', 5, 'workflow.step.exit', 'plan', '{}', 'cli', 2, 'k-3', 'pre-existing', 'pre-existing-proj');

      const { backfillSessionAndProjectIds } = await import('../migrations.js');
      backfillSessionAndProjectIds(db, 'sess-backfill', 'my-repo');

      interface PartitionRow {
        readonly seq: number;
        readonly session_id: string | null;
        readonly project_id: string | null;
      }
      const rows = db
        .query<PartitionRow, []>(
          'SELECT seq, session_id, project_id FROM events ORDER BY seq ASC',
        )
        .all();

      expect(rows).toHaveLength(3);
      // Legacy rows get stamped with the provided sessionId + projectRoot basename.
      expect(rows[0]?.session_id).toBe('sess-backfill');
      expect(rows[0]?.project_id).toBe('my-repo');
      expect(rows[1]?.session_id).toBe('sess-backfill');
      expect(rows[1]?.project_id).toBe('my-repo');
      // Pre-populated row untouched.
      expect(rows[2]?.session_id).toBe('pre-existing');
      expect(rows[2]?.project_id).toBe('pre-existing-proj');
    } finally {
      db.close();
    }
  });

  test('backfillSessionAndProjectIds leaves project_id NULL when basename is null', async () => {
    const { Database } = await import('bun:sqlite');
    const db = new Database(':memory:');
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

      const insert = db.prepare(
        'INSERT INTO events (seq, ts, schema_version, type, step, data, actor, parent_seq, idempotency_key, session_id, project_id) ' +
          'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      );
      insert.run(1, '2026-04-01T00:00:00Z', 4, 'workflow.start', null, '{}', 'cli', null, 'k-1', null, null);

      const { backfillSessionAndProjectIds } = await import('../migrations.js');
      // Missing metadata.json → projectRootBasename is null.
      backfillSessionAndProjectIds(db, 'sess-nometa', null);

      interface PartitionRow {
        readonly session_id: string | null;
        readonly project_id: string | null;
      }
      const row = db
        .query<PartitionRow, []>(
          'SELECT session_id, project_id FROM events WHERE seq = 1',
        )
        .get();

      expect(row?.session_id).toBe('sess-nometa');
      // project_id left NULL — absence of metadata is distinguishable from a
      // real project-root basename.
      expect(row?.project_id).toBeNull();
    } finally {
      db.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 3. v1 state.json on-disk compat
// ---------------------------------------------------------------------------

describe('v1 state.json on-disk compat', () => {
  test('readState normalises v1 state.json to the v2 in-memory shape', () => {
    const testDir = mkdtempSync(join(tmpdir(), 'gobbi-migrations-test-'));
    try {
      // A state.json written by a pre-PR-C process — no `lastVerdictOutcome`,
      // violations without `severity`, schemaVersion still 1. This is
      // exactly the shape that survives on disk from v0.5.0 Phase 2 PR B.
      const v1State = {
        schemaVersion: 1,
        sessionId: 'sess-v1-ondisk',
        currentStep: 'plan',
        currentSubstate: null,
        completedSteps: ['ideation'],
        evalConfig: null,
        activeSubagents: [],
        artifacts: {},
        violations: [
          {
            guardId: 'g-scope',
            toolName: 'Write',
            reason: 'outside scope',
            step: 'plan',
            timestamp: '2026-01-01T00:00:03.000Z',
            // severity absent — v1 didn't track it
          },
        ],
        feedbackRound: 0,
        maxFeedbackRounds: 3,
        // lastVerdictOutcome absent — v1 didn't track it
      };
      writeFileSync(
        join(testDir, 'state.json'),
        JSON.stringify(v1State),
        'utf8',
      );

      const resolved = readState(testDir);
      expect(resolved).not.toBeNull();
      if (resolved === null) throw new Error('unreachable');
      expect(resolved.sessionId).toBe('sess-v1-ondisk');
      expect(resolved.currentStep).toBe('plan');
      // Normalisation: v1's absent lastVerdictOutcome becomes null in memory.
      expect(resolved.lastVerdictOutcome).toBeNull();
      // Normalisation: v1 violation without severity becomes 'error' in memory.
      expect(resolved.violations).toHaveLength(1);
      expect(resolved.violations[0]!.severity).toBe('error');
    } finally {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('readState preserves v2 state.json unchanged', () => {
    const testDir = mkdtempSync(join(tmpdir(), 'gobbi-migrations-test-'));
    try {
      const v2State = {
        schemaVersion: 2,
        sessionId: 'sess-v2-ondisk',
        currentStep: 'execution',
        currentSubstate: null,
        completedSteps: ['ideation', 'plan'],
        evalConfig: { ideation: false, plan: false },
        activeSubagents: [],
        artifacts: {},
        violations: [
          {
            guardId: 'g-warn',
            toolName: 'Write',
            reason: 'secret-ish path',
            step: 'execution',
            timestamp: '2026-01-01T00:00:00.000Z',
            severity: 'warning',
          },
        ],
        feedbackRound: 0,
        maxFeedbackRounds: 3,
        lastVerdictOutcome: 'pass',
      };
      writeFileSync(
        join(testDir, 'state.json'),
        JSON.stringify(v2State),
        'utf8',
      );

      const resolved = readState(testDir);
      expect(resolved).not.toBeNull();
      if (resolved === null) throw new Error('unreachable');
      expect(resolved.lastVerdictOutcome).toBe('pass');
      expect(resolved.violations[0]!.severity).toBe('warning');
    } finally {
      rmSync(testDir, { recursive: true, force: true });
    }
  });
});
