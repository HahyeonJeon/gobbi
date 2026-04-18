/**
 * Unit tests for `gobbi workflow status` — read-only state projection.
 *
 * Coverage:
 *   - buildSnapshot pure lib form preserves state fields correctly
 *   - countViolationsByFamily buckets by letter prefix, sorted alphabetically
 *   - runStatusWithOptions against a real init'd session produces human +
 *     JSON output; JSON mode passes shape validation
 *   - missing event store exits 1
 *   - --cost flag aggregates delegation.complete events token-derived
 *     primary + sizeProxy fallback, emits empty-session marker per L11,
 *     and leaves baseline status output untouched when absent.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import {
  aggregateCost,
  buildSnapshot,
  COST_EMPTY_SESSION_MESSAGE,
  countViolationsByFamily,
  isCostAggregateRow,
  runStatusWithOptions,
  type StatusSnapshot,
} from '../status.js';
import { initialState } from '../../../workflow/state.js';
import type { GuardViolationRecord } from '../../../workflow/state.js';
import { EventStore } from '../../../workflow/store.js';

// ---------------------------------------------------------------------------
// capture helpers
// ---------------------------------------------------------------------------

let captured: { stdout: string; stderr: string; exitCode: number | null };
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origExit: typeof process.exit;

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origExit = process.exit;

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
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  process.exit = origExit;
});

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// scratch dirs
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

afterEach(() => {
  while (scratchDirs.length > 0) {
    const d = scratchDirs.pop();
    if (d !== undefined) {
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  }
});

function makeScratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-status-test-'));
  scratchDirs.push(dir);
  return dir;
}

// ===========================================================================
// countViolationsByFamily — pure
// ===========================================================================

describe('countViolationsByFamily', () => {
  test('groups records by DiagnosticCode family letter', () => {
    const v = (code: string | undefined): GuardViolationRecord =>
      ({
        guardId: 'g',
        toolName: 't',
        reason: 'r',
        step: 's',
        timestamp: '2026-01-01T00:00:00.000Z',
        severity: 'warning',
        ...(code !== undefined ? { code } : {}),
      }) as unknown as GuardViolationRecord;

    const counts = countViolationsByFamily([
      v('W001_GUARD_WARN_GENERIC'),
      v('W001_GUARD_WARN_GENERIC'),
      v('E001_INVALID_SCHEMA'),
      v(undefined),
    ]);

    expect(counts['W']).toBe(2);
    expect(counts['E']).toBe(1);
    expect(counts['untagged']).toBe(1);
  });

  test('keys are sorted alphabetically for stable output', () => {
    const v = (code: string): GuardViolationRecord =>
      ({
        guardId: 'g',
        toolName: 't',
        reason: 'r',
        step: 's',
        timestamp: '2026-01-01T00:00:00.000Z',
        severity: 'warning',
        code,
      }) as unknown as GuardViolationRecord;
    const counts = countViolationsByFamily([
      v('X001'),
      v('E001_INVALID_SCHEMA'),
      v('W001_GUARD_WARN_GENERIC'),
    ]);
    expect(Object.keys(counts)).toEqual(['E', 'W', 'X']);
  });
});

// ===========================================================================
// buildSnapshot — pure
// ===========================================================================

describe('buildSnapshot', () => {
  test('preserves core state fields', () => {
    const snap = buildSnapshot(initialState('sess-1'));
    expect(snap.sessionId).toBe('sess-1');
    expect(snap.schemaVersion).toBe(4);
    expect(snap.currentStep).toBe('idle');
    expect(snap.lastVerdictOutcome).toBeNull();
    expect(snap.violationsTotal).toBe(0);
    expect(snap.violationsByFamily).toEqual({});
  });
});

// ===========================================================================
// runStatusWithOptions — integration against a real init'd session
// ===========================================================================

describe('runStatusWithOptions', () => {
  test('human output reports step, session, and violations=none', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(
        ['--session-id', 'status-happy', '--task', 'demo', '--eval-plan'],
        { repoRoot: repo },
      ),
    );

    const sessionDir = join(repo, '.gobbi', 'sessions', 'status-happy');
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runStatusWithOptions([], { sessionDir }));

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('Session: status-happy');
    expect(captured.stdout).toContain('Schema: v4');
    // workflow.start + workflow.eval.decide transitions to ideation/discussing.
    expect(captured.stdout).toContain('Step: ideation');
    expect(captured.stdout).toContain('Violations: none');
  });

  test('--json emits a valid StatusSnapshot', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'status-json', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'status-json');
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runStatusWithOptions(['--json'], { sessionDir }));

    expect(captured.exitCode).toBeNull();
    const snapshot = JSON.parse(captured.stdout) as StatusSnapshot;
    expect(snapshot.sessionId).toBe('status-json');
    expect(snapshot.schemaVersion).toBe(4);
    expect(snapshot.currentStep).toBe('ideation');
    expect(snapshot.violationsTotal).toBe(0);
    expect(snapshot.evalConfig).toEqual({ ideation: false, plan: false });
  });

  test('missing event store exits 1', async () => {
    const repo = makeScratchRepo();
    const sessionDir = join(repo, '.gobbi', 'sessions', 'absent');
    // deliberately do not init
    await captureExit(() => runStatusWithOptions([], { sessionDir }));
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('no event store');
  });

  test('baseline status output unchanged when --cost is not passed', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'status-no-cost', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'status-no-cost');
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runStatusWithOptions(['--json'], { sessionDir }));

    const snap = JSON.parse(captured.stdout) as StatusSnapshot;
    // cost field is omitted entirely — existing consumers must see the
    // same wire shape they did pre-E.6.
    expect('cost' in snap).toBe(false);
  });
});

// ===========================================================================
// --cost — aggregateCost against seeded delegation.complete events
// ===========================================================================

/**
 * Seed one `delegation.complete` event into an existing session's store.
 * `data` is JSON.stringified verbatim so the caller controls the
 * on-disk shape — we deliberately sidestep the factory because E.6 must
 * tolerate both the legacy `tokensUsed: number` shape and the newer
 * object form, and it's cheaper to construct both directly than to
 * plumb dual-path support through the factory.
 */
function seedDelegationComplete(
  sessionDir: string,
  sessionId: string,
  opts: {
    readonly subagentId: string;
    readonly step: string;
    readonly ts: string;
    readonly toolCallId: string;
    readonly data: Readonly<Record<string, unknown>>;
  },
): void {
  const store = new EventStore(join(sessionDir, 'gobbi.db'));
  try {
    store.append({
      ts: opts.ts,
      type: 'delegation.complete',
      step: opts.step,
      data: JSON.stringify(opts.data),
      actor: 'orchestrator',
      parent_seq: null,
      idempotencyKind: 'tool-call',
      toolCallId: opts.toolCallId,
      sessionId,
    });
  } finally {
    store.close();
  }
}

describe('aggregateCost — direct store integration', () => {
  test('returns empty-session rollup when no delegation.complete events exist', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'cost-empty', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'cost-empty');
    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const rollup = aggregateCost(store);
      expect(rollup.message).toBe(COST_EMPTY_SESSION_MESSAGE);
      expect(rollup.cumulativeUsd).toBe(0);
      expect(rollup.sources).toEqual({ tokens: 0, proxy: 0 });
      expect(Object.keys(rollup.perStep)).toHaveLength(0);
    } finally {
      store.close();
    }
  });

  test('buckets token-derived and proxy-derived events into separate source counters', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'cost-mix', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'cost-mix');

    // Two token-derived events at different steps.
    seedDelegationComplete(sessionDir, 'cost-mix', {
      subagentId: 'sub-1',
      step: 'ideation',
      ts: '2026-04-18T10:00:00.000Z',
      toolCallId: 'tc-1',
      data: {
        subagentId: 'sub-1',
        model: 'claude-opus-4-7',
        tokensUsed: {
          input_tokens: 1_000_000,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    });
    seedDelegationComplete(sessionDir, 'cost-mix', {
      subagentId: 'sub-2',
      step: 'execution',
      ts: '2026-04-18T10:01:00.000Z',
      toolCallId: 'tc-2',
      data: {
        subagentId: 'sub-2',
        model: 'claude-sonnet-4-5',
        tokensUsed: {
          input_tokens: 1_000_000,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    });
    // One proxy-only event (no tokensUsed, byte count set).
    seedDelegationComplete(sessionDir, 'cost-mix', {
      subagentId: 'sub-3',
      step: 'execution',
      ts: '2026-04-18T10:02:00.000Z',
      toolCallId: 'tc-3',
      data: {
        subagentId: 'sub-3',
        sizeProxyBytes: 10_000,
      },
    });

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const rollup = aggregateCost(store);
      expect(rollup.message).toBeUndefined();
      // Opus input 1M * $5/M = $5; Sonnet input 1M * $3/M = $3
      // Proxy 10_000 bytes * (25/1e6/4) = 0.0000625 — negligible but positive
      expect(rollup.cumulativeUsd).toBeCloseTo(5 + 3 + 10_000 * (25 / 1_000_000 / 4), 4);
      expect(rollup.sources).toEqual({ tokens: 2, proxy: 1 });

      // Per-step keys sorted alphabetically.
      expect(Object.keys(rollup.perStep)).toEqual(['execution', 'ideation']);

      const execution = rollup.perStep['execution'];
      expect(execution).toBeDefined();
      expect(execution?.delegations).toBe(2);
      expect(execution?.tokenSource).toBe(1);
      expect(execution?.proxySource).toBe(1);

      const ideation = rollup.perStep['ideation'];
      expect(ideation).toBeDefined();
      expect(ideation?.delegations).toBe(1);
      expect(ideation?.tokenSource).toBe(1);
      expect(ideation?.proxySource).toBe(0);
      expect(ideation?.usd).toBeCloseTo(5, 4);
    } finally {
      store.close();
    }
  });

  test('unknown model in tokensUsed row yields 0 cost but still counts as tokens source', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'cost-unk', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'cost-unk');
    seedDelegationComplete(sessionDir, 'cost-unk', {
      subagentId: 'sub-u',
      step: 'plan',
      ts: '2026-04-18T11:00:00.000Z',
      toolCallId: 'tc-u',
      data: {
        subagentId: 'sub-u',
        model: 'claude-martian-9-99',
        tokensUsed: {
          input_tokens: 1_000_000,
          output_tokens: 1_000_000,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    });

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const rollup = aggregateCost(store);
      expect(rollup.cumulativeUsd).toBe(0);
      // tokensJson was present — sources.tokens increments even at $0.
      expect(rollup.sources.tokens).toBe(1);
      expect(rollup.sources.proxy).toBe(0);
      expect(rollup.perStep['plan']?.delegations).toBe(1);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// --cost — end-to-end CLI renderers
// ===========================================================================

describe('runStatusWithOptions --cost', () => {
  test('--cost without --json renders prose with per-step buckets', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'cost-prose', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'cost-prose');

    seedDelegationComplete(sessionDir, 'cost-prose', {
      subagentId: 'sub-p',
      step: 'ideation',
      ts: '2026-04-18T12:00:00.000Z',
      toolCallId: 'tc-p',
      data: {
        subagentId: 'sub-p',
        model: 'claude-opus-4-7',
        tokensUsed: {
          input_tokens: 1_000_000,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    });

    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runStatusWithOptions(['--cost'], { sessionDir }));

    expect(captured.exitCode).toBeNull();
    // Existing status lines still render.
    expect(captured.stdout).toContain('Session: cost-prose');
    expect(captured.stdout).toContain('Schema: v4');
    // Cost rollup lines.
    expect(captured.stdout).toContain('Cumulative cost:');
    expect(captured.stdout).toContain('$5.00');
    expect(captured.stdout).toContain('Source: 1 estimated from tokens / 0 estimated from size proxy');
    expect(captured.stdout).toContain('Per-step:');
    expect(captured.stdout).toContain('ideation:');
  });

  test('--cost --json embeds the rollup inside the StatusSnapshot', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'cost-json', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'cost-json');

    seedDelegationComplete(sessionDir, 'cost-json', {
      subagentId: 'sub-j',
      step: 'plan',
      ts: '2026-04-18T13:00:00.000Z',
      toolCallId: 'tc-j',
      data: {
        subagentId: 'sub-j',
        model: 'claude-sonnet-4-5',
        tokensUsed: {
          input_tokens: 1_000_000,
          output_tokens: 0,
          cache_read_input_tokens: 0,
          cache_creation_input_tokens: 0,
        },
      },
    });

    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runStatusWithOptions(['--cost', '--json'], { sessionDir }),
    );

    expect(captured.exitCode).toBeNull();
    const snap = JSON.parse(captured.stdout) as StatusSnapshot;
    expect(snap.cost).toBeDefined();
    expect(snap.cost?.cumulativeUsd).toBeCloseTo(3, 4);
    expect(snap.cost?.sources).toEqual({ tokens: 1, proxy: 0 });
    expect(snap.cost?.perStep['plan']?.tokenSource).toBe(1);
    expect(snap.cost?.message).toBeUndefined();
  });

  test('--cost on an empty session emits the L11 marker (prose form)', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'cost-empty-prose', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'cost-empty-prose');

    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runStatusWithOptions(['--cost'], { sessionDir }));

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain(`Cost: ${COST_EMPTY_SESSION_MESSAGE}`);
    // L11: must NOT emit $0.00 — that would mask the gap.
    expect(captured.stdout).not.toContain('$0.00');
    expect(captured.stdout).not.toContain('Cumulative cost:');
  });

  test('--cost --json on an empty session emits the L11 marker (JSON form)', async () => {
    const repo = makeScratchRepo();
    await captureExit(() =>
      runInitWithOptions(['--session-id', 'cost-empty-json', '--task', 'demo'], {
        repoRoot: repo,
      }),
    );
    const sessionDir = join(repo, '.gobbi', 'sessions', 'cost-empty-json');

    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runStatusWithOptions(['--cost', '--json'], { sessionDir }),
    );

    expect(captured.exitCode).toBeNull();
    const snap = JSON.parse(captured.stdout) as StatusSnapshot;
    expect(snap.cost).toBeDefined();
    expect(snap.cost?.message).toBe(COST_EMPTY_SESSION_MESSAGE);
    expect(snap.cost?.cumulativeUsd).toBe(0);
    expect(snap.cost?.sources).toEqual({ tokens: 0, proxy: 0 });
    expect(snap.cost?.perStep).toEqual({});
  });

  test('--help mentions the --cost flag', async () => {
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() => runStatusWithOptions(['--help'], {}));
    expect(captured.stdout).toContain('--cost');
    expect(captured.stdout).toContain('no v0.5.0 sessions found');
  });
});

// ===========================================================================
// isCostAggregateRow — narrow test
// ===========================================================================

describe('isCostAggregateRow', () => {
  test('accepts a complete row shape with NULLs', () => {
    expect(
      isCostAggregateRow({
        step: 'ideation',
        subagentId: 's1',
        tokensJson: null,
        model: null,
        bytes: 100,
      }),
    ).toBe(true);
  });

  test('rejects non-object values', () => {
    expect(isCostAggregateRow(null)).toBe(false);
    expect(isCostAggregateRow(42)).toBe(false);
    expect(isCostAggregateRow('row')).toBe(false);
  });

  test('rejects rows with wrong field types', () => {
    expect(
      isCostAggregateRow({
        step: 5, // wrong type
        subagentId: null,
        tokensJson: null,
        model: null,
        bytes: null,
      }),
    ).toBe(false);
  });
});
