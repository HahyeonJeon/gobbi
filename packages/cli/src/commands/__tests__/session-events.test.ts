/**
 * Unit tests for `runSessionEventsWithStore` — the library form behind both
 * `gobbi session events` and `gobbi workflow events`. We exercise the library
 * form against an in-memory SQLite store so tests are hermetic and fast.
 *
 * Coverage:
 *   - empty store renders the "(no events)" sentinel on human output
 *   - `--type` filter narrows rows to the matching event type
 *   - `--since` filter narrows rows to those strictly after the given seq
 *   - the default 200-row cap applies, and `--all` disables it
 *   - `--json` emits the raw EventRow[] (cap does not apply to JSON)
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

import { EventStore } from '../../workflow/store.js';
import type { AppendInput } from '../../workflow/store.js';
import {
  DEFAULT_EVENTS_ROW_CAP,
  formatEventRow,
  runSessionEventsWithStore,
} from '../session.js';

// ---------------------------------------------------------------------------
// stdout/stderr hijack — capture the human/json output without spawning a CLI.
// ---------------------------------------------------------------------------

let captured: { stdout: string; stderr: string };
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;

beforeEach(() => {
  captured = { stdout: '', stderr: '' };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  process.stdout.write = ((chunk: string | Uint8Array): boolean => {
    captured.stdout +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array): boolean => {
    captured.stderr +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stderr.write;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
});

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function makeStartInput(i: number): AppendInput {
  return {
    ts: `2026-01-01T00:00:0${i}.000Z`,
    type: 'workflow.start',
    step: 'idle',
    data: JSON.stringify({ sessionId: `sess-${i}`, timestamp: `2026-01-01T00:00:0${i}.000Z` }),
    actor: 'orchestrator',
    parent_seq: null,
    idempotencyKind: 'tool-call',
    toolCallId: `tc-${i}`,
    sessionId: `sess-${i}`,
  };
}

function makeHeartbeatInput(i: number): AppendInput {
  // Use millisecond-distinct timestamps so system idempotency keys never collide.
  return {
    ts: new Date(Date.parse('2026-01-02T00:00:00.000Z') + i).toISOString(),
    type: 'session.heartbeat',
    step: null,
    data: JSON.stringify({ timestamp: `2026-01-02T00:00:00.${String(i).padStart(3, '0')}Z` }),
    actor: 'system',
    parent_seq: null,
    idempotencyKind: 'system',
    sessionId: 'sess-hb',
  };
}

// ===========================================================================
// Empty store
// ===========================================================================

describe('runSessionEventsWithStore — empty store', () => {
  test('human output prints the (no events) sentinel', () => {
    using store = new EventStore(':memory:');
    runSessionEventsWithStore(store);
    expect(captured.stdout).toBe('(no events)\n');
    expect(captured.stderr).toBe('');
  });

  test('json output emits an empty array', () => {
    using store = new EventStore(':memory:');
    runSessionEventsWithStore(store, { json: true });
    expect(captured.stdout.trim()).toBe('[]');
  });
});

// ===========================================================================
// Filter by type
// ===========================================================================

describe('runSessionEventsWithStore — --type filter', () => {
  test('narrows output to the matching event type only', () => {
    using store = new EventStore(':memory:');
    store.append(makeStartInput(1));
    store.append(makeHeartbeatInput(1));
    store.append(makeHeartbeatInput(2));

    runSessionEventsWithStore(store, { type: 'session.heartbeat' });

    // Both heartbeat lines should be present; the start row should not.
    expect(captured.stdout).toContain('session.heartbeat');
    expect(captured.stdout).not.toContain('workflow.start');
    // Exactly 2 heartbeat rows -> 2 newlines.
    const lines = captured.stdout.trim().split('\n');
    expect(lines).toHaveLength(2);
  });

  test('no matches returns the (no events) sentinel', () => {
    using store = new EventStore(':memory:');
    store.append(makeStartInput(1));
    runSessionEventsWithStore(store, { type: 'session.heartbeat' });
    expect(captured.stdout).toBe('(no events)\n');
  });
});

// ===========================================================================
// Filter by --since
// ===========================================================================

describe('runSessionEventsWithStore — --since filter', () => {
  test('returns events with seq strictly greater than the given value', () => {
    using store = new EventStore(':memory:');
    const r1 = store.append(makeStartInput(1));
    const r2 = store.append(makeHeartbeatInput(1));
    const r3 = store.append(makeHeartbeatInput(2));
    expect(r1?.seq).toBe(1);
    expect(r2?.seq).toBe(2);
    expect(r3?.seq).toBe(3);

    runSessionEventsWithStore(store, { since: 1 });

    // seq=2 and seq=3 should appear; seq=1 should not.
    const lines = captured.stdout.trim().split('\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]?.startsWith('2 |')).toBe(true);
    expect(lines[1]?.startsWith('3 |')).toBe(true);
  });

  test('composes with --type (both filters apply)', () => {
    using store = new EventStore(':memory:');
    store.append(makeStartInput(1)); // seq 1
    store.append(makeHeartbeatInput(1)); // seq 2
    store.append(makeHeartbeatInput(2)); // seq 3
    store.append(makeHeartbeatInput(3)); // seq 4

    runSessionEventsWithStore(store, { since: 2, type: 'session.heartbeat' });
    const lines = captured.stdout.trim().split('\n');
    expect(lines).toHaveLength(2);
    // seq 3 then seq 4, both heartbeat
    expect(lines[0]?.startsWith('3 |')).toBe(true);
    expect(lines[1]?.startsWith('4 |')).toBe(true);
    for (const line of lines) {
      expect(line).toContain('session.heartbeat');
    }
  });
});

// ===========================================================================
// Default row cap + --all
// ===========================================================================

describe('runSessionEventsWithStore — default row cap', () => {
  test(`caps human output at the last ${DEFAULT_EVENTS_ROW_CAP} rows`, () => {
    using store = new EventStore(':memory:');
    // Insert (cap + 5) heartbeat events. Each has a unique millisecond
    // timestamp so system idempotency keys do not collide.
    const total = DEFAULT_EVENTS_ROW_CAP + 5;
    for (let i = 0; i < total; i++) {
      store.append(makeHeartbeatInput(i));
    }

    runSessionEventsWithStore(store);
    const lines = captured.stdout.trim().split('\n');
    expect(lines).toHaveLength(DEFAULT_EVENTS_ROW_CAP);

    // The cap keeps the TAIL (latest events). First visible row should be
    // seq === total - DEFAULT_EVENTS_ROW_CAP + 1.
    const expectedFirstSeq = total - DEFAULT_EVENTS_ROW_CAP + 1;
    expect(lines[0]?.startsWith(`${expectedFirstSeq} |`)).toBe(true);
    expect(lines[lines.length - 1]?.startsWith(`${total} |`)).toBe(true);
  });

  test('--all disables the cap', () => {
    using store = new EventStore(':memory:');
    const total = DEFAULT_EVENTS_ROW_CAP + 5;
    for (let i = 0; i < total; i++) {
      store.append(makeHeartbeatInput(i));
    }

    runSessionEventsWithStore(store, { all: true });
    const lines = captured.stdout.trim().split('\n');
    expect(lines).toHaveLength(total);
  });

  test('json output ignores the cap', () => {
    using store = new EventStore(':memory:');
    const total = DEFAULT_EVENTS_ROW_CAP + 3;
    for (let i = 0; i < total; i++) {
      store.append(makeHeartbeatInput(i));
    }

    runSessionEventsWithStore(store, { json: true });
    const parsed = JSON.parse(captured.stdout) as unknown;
    expect(Array.isArray(parsed)).toBe(true);
    expect((parsed as unknown[]).length).toBe(total);
  });
});

// ===========================================================================
// formatEventRow — row rendering sanity
// ===========================================================================

describe('formatEventRow', () => {
  test('uses the 6-field pipe-delimited shape', () => {
    using store = new EventStore(':memory:');
    const row = store.append(makeStartInput(1));
    expect(row).not.toBeNull();
    const line = formatEventRow(row!);
    // Exactly 5 separators -> 6 fields.
    expect(line.split(' | ')).toHaveLength(6);
    expect(line).toContain('workflow.start');
    expect(line).toContain('orchestrator');
  });

  test('renders null step as "-"', () => {
    using store = new EventStore(':memory:');
    const row = store.append(makeHeartbeatInput(0));
    expect(row).not.toBeNull();
    const line = formatEventRow(row!);
    const fields = line.split(' | ');
    expect(fields[3]).toBe('-');
  });
});
