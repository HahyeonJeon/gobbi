/**
 * Event schema migration tests — `workflow/migrations.ts`.
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
 *
 * Note on purity: migrateEvent's `data` parse-on-non-identity is a deliberate
 * part of every walk even when each hop is an identity transform — the
 * walk path exercises the composition plumbing that a future v4 migration
 * inherits, so we test the path rather than its short-circuit.
 */

import { describe, test, expect } from 'bun:test';

import { CURRENT_SCHEMA_VERSION, migrateEvent } from '../migrations.js';
import type { EventRow } from '../migrations.js';
import { deriveState } from '../state-derivation.js';
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
  test('is 7 — schema v7 landed in Wave C.1.2 (prompt_patches table + prompt.patch.applied audit-only event for prompts-as-data)', () => {
    expect(CURRENT_SCHEMA_VERSION).toBe(7);
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
      // No projectId supplied → projectId is null (post-T-2a.9.unified).
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
// 2e. v5 → v6 event round-trip (Wave A.1.3) — identity on event data;
//     workspace-partitioned audit + meta tables added by ensureSchemaV6.
// ---------------------------------------------------------------------------

describe('v5 → v6 event round-trip (identity on event data)', () => {
  test('a v5 workflow.start migrates to v6 unchanged', () => {
    const v5Row: EventRow = {
      seq: 80,
      ts: '2026-04-25T00:00:00.000Z',
      schema_version: 5,
      type: 'workflow.start',
      step: null,
      data: JSON.stringify({
        sessionId: 'sess-v5',
        timestamp: '2026-04-25T00:00:00.000Z',
      }),
      actor: 'cli',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-080:workflow.start',
      session_id: 'sess-v5',
      project_id: 'gobbi',
    };
    const migrated = migrateEvent(v5Row, 6);
    expect(migrated.schema_version).toBe(6);
    expect(JSON.parse(migrated.data)).toEqual(JSON.parse(v5Row.data));
    // Byte-identical data string — the v5→v6 hop is an identity transform
    // and does NOT re-serialise with different whitespace.
    expect(migrated.data).toBe(v5Row.data);
  });

  test('a v5 row with explicit partition keys walks to v6 losslessly', () => {
    const v5Row: EventRow = {
      seq: 81,
      ts: '2026-04-25T00:00:01.000Z',
      schema_version: 5,
      type: 'guard.warn',
      step: 'execution',
      data: JSON.stringify({
        guardId: 'g-secret',
        toolName: 'Write',
        reason: 'path looks like credential',
        step: 'execution',
        timestamp: '2026-04-25T00:00:01.000Z',
        severity: 'warning',
        code: 'W001',
      }),
      actor: 'hook',
      parent_seq: null,
      idempotency_key: 'tool-call:tc-081:guard.warn',
      session_id: 'sess-v5',
      project_id: 'gobbi',
    };
    const migrated = migrateEvent(v5Row, 6);
    expect(migrated.schema_version).toBe(6);
    expect(JSON.parse(migrated.data)).toEqual(JSON.parse(v5Row.data));
    // Partition keys flow through unmodified — the migration is at the
    // event-data level only.
    expect(migrated.session_id).toBe('sess-v5');
    expect(migrated.project_id).toBe('gobbi');
  });
});

// ---------------------------------------------------------------------------
// 2f. v5 → v6 schema CREATE — workspace-partitioned audit + meta tables.
// ---------------------------------------------------------------------------

describe('v5 → v6 schema ensureSchemaV6', () => {
  // Build a v5-shape `events` table on an in-memory db, then run
  // ensureSchemaV6 directly. EventStore wiring lives in Wave A.1.4 — the
  // function is exercised here in isolation, mirroring the v4→v5 pattern.
  const buildV5Db = async () => {
    const { Database } = await import('bun:sqlite');
    const db = new Database(':memory:');
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
    return db;
  };

  test('ensureSchemaV6 applies cleanly on a v5 store and creates the four new tables', async () => {
    const db = await buildV5Db();
    try {
      const {
        ensureSchemaV6,
        getTableNames,
        SCHEMA_V6_TABLES,
      } = await import('../migrations.js');
      // Pre-state: only `events` exists (plus sqlite_sequence may exist
      // automatically for INTEGER PRIMARY KEY tables).
      const before = getTableNames(db);
      for (const t of SCHEMA_V6_TABLES) {
        expect(before.has(t)).toBe(false);
      }

      ensureSchemaV6(db);

      const after = getTableNames(db);
      for (const t of SCHEMA_V6_TABLES) {
        expect(after.has(t)).toBe(true);
      }
    } finally {
      db.close();
    }
  });

  test('every v6 table carries its expected workspace-partition columns', async () => {
    const db = await buildV5Db();
    try {
      const { ensureSchemaV6 } = await import('../migrations.js');
      ensureSchemaV6(db);

      // Helper: read the column set for a single table via PRAGMA table_info.
      interface Pragma {
        readonly name: string;
      }
      const cols = (table: string): Set<string> =>
        new Set(
          db
            .query<Pragma, []>(`PRAGMA table_info(${table})`)
            .all()
            .map((r) => r.name),
        );

      const stateSnapshotsCols = cols('state_snapshots');
      expect(stateSnapshotsCols.has('session_id')).toBe(true);
      expect(stateSnapshotsCols.has('project_id')).toBe(true);
      expect(stateSnapshotsCols.has('last_event_seq')).toBe(true);
      expect(stateSnapshotsCols.has('state_json')).toBe(true);
      expect(stateSnapshotsCols.has('created_at')).toBe(true);

      const toolCallsCols = cols('tool_calls');
      expect(toolCallsCols.has('session_id')).toBe(true);
      expect(toolCallsCols.has('project_id')).toBe(true);
      expect(toolCallsCols.has('tool_call_id')).toBe(true);
      expect(toolCallsCols.has('tool_name')).toBe(true);
      expect(toolCallsCols.has('phase')).toBe(true);
      expect(toolCallsCols.has('timestamp')).toBe(true);
      expect(toolCallsCols.has('input_json')).toBe(true);
      expect(toolCallsCols.has('output_json')).toBe(true);

      const configChangesCols = cols('config_changes');
      expect(configChangesCols.has('session_id')).toBe(true);
      expect(configChangesCols.has('project_id')).toBe(true);
      expect(configChangesCols.has('key')).toBe(true);
      expect(configChangesCols.has('layer')).toBe(true);
      expect(configChangesCols.has('old_value')).toBe(true);
      expect(configChangesCols.has('new_value')).toBe(true);
      expect(configChangesCols.has('timestamp')).toBe(true);

      const schemaMetaCols = cols('schema_meta');
      expect(schemaMetaCols.has('id')).toBe(true);
      expect(schemaMetaCols.has('schema_version')).toBe(true);
      expect(schemaMetaCols.has('migrated_at')).toBe(true);
    } finally {
      db.close();
    }
  });

  test('every v6 index is created', async () => {
    const db = await buildV5Db();
    try {
      const {
        ensureSchemaV6,
        getIndexNames,
        SCHEMA_V6_INDICES,
      } = await import('../migrations.js');
      ensureSchemaV6(db);
      const indices = getIndexNames(db);
      for (const idx of SCHEMA_V6_INDICES) {
        expect(indices.has(idx)).toBe(true);
      }
    } finally {
      db.close();
    }
  });

  test('schema_meta is stamped at v6 with the supplied timestamp', async () => {
    const db = await buildV5Db();
    try {
      const { ensureSchemaV6 } = await import('../migrations.js');
      const fixedNow = 1745000000000;
      ensureSchemaV6(db, fixedNow);

      interface MetaRow {
        readonly id: string;
        readonly schema_version: number;
        readonly migrated_at: number;
      }
      const row = db
        .query<MetaRow, [string]>('SELECT * FROM schema_meta WHERE id = ?')
        .get('state_db');
      expect(row).not.toBeNull();
      // Wave C.1.2 — `ensureSchemaV6` stamps the literal `6`, not
      // `CURRENT_SCHEMA_VERSION`. Once v7 landed, the per-version stamp
      // moved into each `ensureSchemaVN` so re-running an older hop in
      // isolation does not leave the DB advertising a future version.
      // The full chain (ensureSchemaV6 + ensureSchemaV7) stamps 7 in the
      // outer test; this isolated call stamps 6.
      expect(row?.schema_version).toBe(6);
      expect(row?.migrated_at).toBe(fixedNow);
    } finally {
      db.close();
    }
  });

  test('ensureSchemaV6 is idempotent — re-running does not throw and refreshes migrated_at', async () => {
    const db = await buildV5Db();
    try {
      const {
        ensureSchemaV6,
        getTableNames,
        SCHEMA_V6_TABLES,
      } = await import('../migrations.js');
      const t0 = 1745000000000;
      const t1 = 1745000001000;
      ensureSchemaV6(db, t0);
      ensureSchemaV6(db, t1);

      const after = getTableNames(db);
      for (const t of SCHEMA_V6_TABLES) {
        expect(after.has(t)).toBe(true);
      }

      // INSERT OR REPLACE on the single sentinel row — the second call's
      // migrated_at wins.
      interface MetaRow {
        readonly migrated_at: number;
      }
      const row = db
        .query<MetaRow, [string]>(
          'SELECT migrated_at FROM schema_meta WHERE id = ?',
        )
        .get('state_db');
      expect(row?.migrated_at).toBe(t1);

      // Single-row invariant — `id = 'state_db'` is the sentinel; no
      // history rows.
      const count = db
        .query<{ cnt: number }, []>('SELECT count(*) as cnt FROM schema_meta')
        .get();
      expect(count?.cnt).toBe(1);
    } finally {
      db.close();
    }
  });

  test('phase CHECK constraint rejects rows outside the pre/post enum', async () => {
    const db = await buildV5Db();
    try {
      const { ensureSchemaV6 } = await import('../migrations.js');
      ensureSchemaV6(db);

      // Valid pre row inserts.
      db.run(
        `INSERT INTO tool_calls (session_id, project_id, tool_call_id, tool_name, phase, timestamp, input_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        ['s', 'p', 'tc-1', 'Bash', 'pre', 1, '{}'],
      );
      // An out-of-enum phase must throw on INSERT.
      expect(() =>
        db.run(
          `INSERT INTO tool_calls (session_id, project_id, tool_call_id, tool_name, phase, timestamp, input_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          ['s', 'p', 'tc-2', 'Bash', 'invalid', 2, '{}'],
        ),
      ).toThrow();
    } finally {
      db.close();
    }
  });

  test('config_changes layer CHECK constraint rejects unknown layer literals', async () => {
    const db = await buildV5Db();
    try {
      const { ensureSchemaV6 } = await import('../migrations.js');
      ensureSchemaV6(db);

      // Valid layer literal.
      db.run(
        `INSERT INTO config_changes (session_id, key, layer, old_value, new_value, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
        ['s', 'workflow.foo', 'project', null, '"x"', 1],
      );
      // Unknown layer must throw.
      expect(() =>
        db.run(
          `INSERT INTO config_changes (session_id, key, layer, old_value, new_value, timestamp) VALUES (?, ?, ?, ?, ?, ?)`,
          ['s', 'workflow.foo', 'global', null, '"x"', 2],
        ),
      ).toThrow();
    } finally {
      db.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 2g. v6 → v7 event round-trip — identity on event data; the new
//     `prompt_patches` table + `prompt.patch.applied` audit-only event
//     are strictly additive (Wave C.1.2).
// ---------------------------------------------------------------------------

describe('v6 → v7 event round-trip (identity on event data)', () => {
  test('a v6 workflow.start migrates to v7 unchanged', () => {
    const v6Event: EventRow = {
      seq: 1,
      ts: '2026-04-26T00:00:00Z',
      schema_version: 6,
      type: 'workflow.start',
      step: 'ideation',
      data: JSON.stringify({
        sessionId: 'sess-v6',
        timestamp: '2026-04-26T00:00:00Z',
      }),
      actor: 'system',
      parent_seq: null,
      idempotency_key: 'sess-v6:1745611200000:workflow.start',
      ...LEGACY_PARTITION,
      session_id: 'sess-v6',
    };
    const migrated = migrateEvent(v6Event, 7);
    expect(migrated.schema_version).toBe(7);
    // Byte-identical data string — v6→v7 is an identity transform on
    // event data; only the wire-level type set widened.
    expect(migrated.data).toBe(v6Event.data);
    expect(migrated.type).toBe(v6Event.type);
  });
});

// ---------------------------------------------------------------------------
// 2h. v6 → v7 schema CREATE — `prompt_patches` workspace-partitioned
//     audit table (Wave C.1.2, issue #156).
// ---------------------------------------------------------------------------

describe('v6 → v7 schema ensureSchemaV7', () => {
  // Build a v6-shape store (events + the four v6 tables already
  // present) so ensureSchemaV7 runs against the realistic starting
  // point — a v6 db that has already been opened by an A.1+ binary.
  const buildV6Db = async () => {
    const { Database } = await import('bun:sqlite');
    const { ensureSchemaV6 } = await import('../migrations.js');
    const db = new Database(':memory:');
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
    ensureSchemaV6(db);
    return db;
  };

  test('ensureSchemaV7 applies cleanly on a v6 store and creates the prompt_patches table', async () => {
    const db = await buildV6Db();
    try {
      const {
        ensureSchemaV7,
        getTableNames,
        SCHEMA_V7_TABLES,
      } = await import('../migrations.js');

      const before = getTableNames(db);
      for (const t of SCHEMA_V7_TABLES) {
        expect(before.has(t)).toBe(false);
      }

      ensureSchemaV7(db);

      const after = getTableNames(db);
      for (const t of SCHEMA_V7_TABLES) {
        expect(after.has(t)).toBe(true);
      }
    } finally {
      db.close();
    }
  });

  test('prompt_patches carries every expected column', async () => {
    const db = await buildV6Db();
    try {
      const { ensureSchemaV7 } = await import('../migrations.js');
      ensureSchemaV7(db);

      interface Pragma {
        readonly name: string;
      }
      const cols = (table: string): Set<string> =>
        new Set(
          db
            .query<Pragma, []>(`PRAGMA table_info(${table})`)
            .all()
            .map((r) => r.name),
        );

      const promptPatchesCols = cols('prompt_patches');
      for (const expected of [
        'seq',
        'session_id',
        'project_id',
        'prompt_id',
        'parent_seq',
        'event_seq',
        'patch_id',
        'patch_json',
        'pre_hash',
        'post_hash',
        'applied_at',
        'applied_by',
      ]) {
        expect(promptPatchesCols.has(expected)).toBe(true);
      }
    } finally {
      db.close();
    }
  });

  test('every v7 index is created', async () => {
    const db = await buildV6Db();
    try {
      const {
        ensureSchemaV7,
        getIndexNames,
        SCHEMA_V7_INDICES,
      } = await import('../migrations.js');
      ensureSchemaV7(db);
      const indices = getIndexNames(db);
      for (const idx of SCHEMA_V7_INDICES) {
        expect(indices.has(idx)).toBe(true);
      }
    } finally {
      db.close();
    }
  });

  test('schema_meta is stamped at v7 with the supplied timestamp', async () => {
    const db = await buildV6Db();
    try {
      const { ensureSchemaV7 } = await import('../migrations.js');
      const fixedNow = 1746000000000;
      ensureSchemaV7(db, fixedNow);

      interface MetaRow {
        readonly schema_version: number;
        readonly migrated_at: number;
      }
      const row = db
        .query<MetaRow, [string]>(
          'SELECT schema_version, migrated_at FROM schema_meta WHERE id = ?',
        )
        .get('state_db');
      expect(row).not.toBeNull();
      expect(row?.schema_version).toBe(CURRENT_SCHEMA_VERSION);
      expect(row?.migrated_at).toBe(fixedNow);
    } finally {
      db.close();
    }
  });

  test('ensureSchemaV7 is idempotent — re-running does not throw and refreshes migrated_at', async () => {
    const db = await buildV6Db();
    try {
      const {
        ensureSchemaV7,
        getTableNames,
        SCHEMA_V7_TABLES,
      } = await import('../migrations.js');
      const t0 = 1746000000000;
      const t1 = 1746000001000;
      ensureSchemaV7(db, t0);
      ensureSchemaV7(db, t1);

      const after = getTableNames(db);
      for (const t of SCHEMA_V7_TABLES) {
        expect(after.has(t)).toBe(true);
      }

      interface MetaRow {
        readonly migrated_at: number;
      }
      const row = db
        .query<MetaRow, [string]>(
          'SELECT migrated_at FROM schema_meta WHERE id = ?',
        )
        .get('state_db');
      expect(row?.migrated_at).toBe(t1);

      // Single-row invariant — `id = 'state_db'` remains the only row.
      const count = db
        .query<{ cnt: number }, []>('SELECT count(*) as cnt FROM schema_meta')
        .get();
      expect(count?.cnt).toBe(1);
    } finally {
      db.close();
    }
  });

  test('prompt_id CHECK constraint rejects values outside the closed enum', async () => {
    const db = await buildV6Db();
    try {
      const { ensureSchemaV7 } = await import('../migrations.js');
      ensureSchemaV7(db);

      // Insert a parent event row first to satisfy the FK on event_seq.
      db.run(
        `INSERT INTO events (seq, ts, schema_version, type, data, actor, idempotency_key, session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, '2026-04-26T00:00:00Z', 7, 'prompt.patch.applied', '{}', 'operator', 'idem-1', 's'],
      );

      // Valid prompt_id passes.
      db.run(
        `INSERT INTO prompt_patches (session_id, prompt_id, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['s', 'ideation', 1, 'p1', '[]', 'h0', 'h1', 1, 'operator'],
      );
      // Invalid prompt_id throws.
      // Insert a second event row first because event_seq is UNIQUE.
      db.run(
        `INSERT INTO events (seq, ts, schema_version, type, data, actor, idempotency_key, session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [2, '2026-04-26T00:00:00Z', 7, 'prompt.patch.applied', '{}', 'operator', 'idem-2', 's'],
      );
      expect(() =>
        db.run(
          `INSERT INTO prompt_patches (session_id, prompt_id, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ['s', 'unknown_step', 2, 'p2', '[]', 'h0', 'h1', 1, 'operator'],
        ),
      ).toThrow();
    } finally {
      db.close();
    }
  });

  test('applied_by CHECK constraint rejects anything other than "operator"', async () => {
    const db = await buildV6Db();
    try {
      const { ensureSchemaV7 } = await import('../migrations.js');
      ensureSchemaV7(db);

      db.run(
        `INSERT INTO events (seq, ts, schema_version, type, data, actor, idempotency_key, session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, '2026-04-26T00:00:00Z', 7, 'prompt.patch.applied', '{}', 'operator', 'idem-1', 's'],
      );

      expect(() =>
        db.run(
          `INSERT INTO prompt_patches (session_id, prompt_id, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ['s', 'ideation', 1, 'p1', '[]', 'h0', 'h1', 1, 'agent'],
        ),
      ).toThrow();
    } finally {
      db.close();
    }
  });

  test('UNIQUE(prompt_id, patch_id) blocks cross-session duplicate writes', async () => {
    const db = await buildV6Db();
    try {
      const { ensureSchemaV7 } = await import('../migrations.js');
      ensureSchemaV7(db);

      // Two separate sessions emit the same patch content (same patch_id).
      db.run(
        `INSERT INTO events (seq, ts, schema_version, type, data, actor, idempotency_key, session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, '2026-04-26T00:00:00Z', 7, 'prompt.patch.applied', '{}', 'operator', 'idem-1', 'sess-A'],
      );
      db.run(
        `INSERT INTO events (seq, ts, schema_version, type, data, actor, idempotency_key, session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [2, '2026-04-26T01:00:00Z', 7, 'prompt.patch.applied', '{}', 'operator', 'idem-2', 'sess-B'],
      );

      db.run(
        `INSERT INTO prompt_patches (session_id, prompt_id, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['sess-A', 'ideation', 1, 'shared-patch-id', '[]', 'h0', 'h1', 1, 'operator'],
      );
      // Second session writing the same content-addressed patch_id must
      // be blocked by `UNIQUE (prompt_id, patch_id)`.
      expect(() =>
        db.run(
          `INSERT INTO prompt_patches (session_id, prompt_id, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ['sess-B', 'ideation', 2, 'shared-patch-id', '[]', 'h0', 'h1', 1, 'operator'],
        ),
      ).toThrow();
    } finally {
      db.close();
    }
  });

  test('UNIQUE(event_seq) blocks two prompt_patches rows pointing at the same event', async () => {
    const db = await buildV6Db();
    try {
      const { ensureSchemaV7 } = await import('../migrations.js');
      ensureSchemaV7(db);

      db.run(
        `INSERT INTO events (seq, ts, schema_version, type, data, actor, idempotency_key, session_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, '2026-04-26T00:00:00Z', 7, 'prompt.patch.applied', '{}', 'operator', 'idem-1', 's'],
      );

      db.run(
        `INSERT INTO prompt_patches (session_id, prompt_id, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ['s', 'ideation', 1, 'p1', '[]', 'h0', 'h1', 1, 'operator'],
      );
      expect(() =>
        db.run(
          `INSERT INTO prompt_patches (session_id, prompt_id, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          ['s', 'planning', 1, 'p2', '[]', 'h0', 'h1', 1, 'operator'],
        ),
      ).toThrow();
    } finally {
      db.close();
    }
  });

  test('full v6 → v7 chain via ensureSchemaV6 + ensureSchemaV7 stamps v7 in schema_meta', async () => {
    const { Database } = await import('bun:sqlite');
    const { ensureSchemaV6, ensureSchemaV7 } = await import('../migrations.js');
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
      ensureSchemaV6(db, 1);
      ensureSchemaV7(db, 2);

      interface MetaRow {
        readonly schema_version: number;
        readonly migrated_at: number;
      }
      const row = db
        .query<MetaRow, [string]>(
          'SELECT schema_version, migrated_at FROM schema_meta WHERE id = ?',
        )
        .get('state_db');
      // v7 stamp wins after the chain runs.
      expect(row?.schema_version).toBe(7);
      expect(row?.migrated_at).toBe(2);
    } finally {
      db.close();
    }
  });
});

