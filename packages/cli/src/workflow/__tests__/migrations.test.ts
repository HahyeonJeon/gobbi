/**
 * Event schema migration tests — `workflow/migrations.ts` + integration with
 * `state.ts::readState` for v1 on-disk compat.
 *
 * Covers the three Wave 2 (C.8-d) disciplines:
 *
 *   1. CURRENT_SCHEMA_VERSION canary pin — bumping v2→v3 must trip this
 *      test so every downstream migration wiring is audited in lockstep.
 *      Mirrors `specs/__tests__/migrations.test.ts:89` for step specs.
 *   2. v1 → v2 round-trip — a v1 fixture JSONL of representative events
 *      (including `guard.violation`) migrates cleanly and reduces to a
 *      valid v2-shaped WorkflowState with `lastVerdictOutcome: null` and
 *      violations either unannotated or `'error'`-severity.
 *   3. v1 state.json on-disk compat — a state.json written by a pre-PR-C
 *      process is readable via `readState`; the in-memory resolved state
 *      has `lastVerdictOutcome: null` normalised in and violations default
 *      to `severity: 'error'`.
 *
 * Note on purity: migrateEvent's `data` parse-on-non-identity is a deliberate
 * part of the v1→v2 walk even though v1→v2 is an identity transform — the
 * walk path exercises the composition plumbing that a future v3 migration
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

// ---------------------------------------------------------------------------
// 1. Canary pin
// ---------------------------------------------------------------------------

describe('CURRENT_SCHEMA_VERSION', () => {
  test('is 2 — schema v2 landed in PR C (guard.warn, lastVerdictOutcome)', () => {
    expect(CURRENT_SCHEMA_VERSION).toBe(2);
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
    },
  ];

  test('each row migrates to v2 with identical event-data payload', () => {
    for (const row of v1Events) {
      const migrated = migrateEvent(row, 2);
      expect(migrated.schema_version).toBe(2);
      expect(JSON.parse(migrated.data)).toEqual(JSON.parse(row.data));
    }
  });

  test('replayed v1 events reduce to a valid v2 WorkflowState', () => {
    const state = deriveState('sess-v1', v1Events, reduce);
    // Schema v2 in-memory shape.
    expect(state.schemaVersion).toBe(2);
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
