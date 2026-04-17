/**
 * Unit tests for `gobbi workflow guard` — the PreToolUse hook handler.
 *
 * Coverage:
 *   - Empty registry → `permissionDecision: 'allow'`, no events emitted.
 *   - Fixture deny guard fires → response carries deny + reason (guard id,
 *     current step appended), `guard.violation` event landed, exit 0.
 *   - Fixture warn guard fires → response allows + `additionalContext`
 *     populated; `guard.warn` event carries the diagnostic code.
 *   - Warn + deny combo → deny short-circuits, both events land in the
 *     store (warn before the deny committed).
 *   - Missing session dir → `permissionDecision: 'allow'`, exit 0, no
 *     crash.
 *   - Invalid / missing stdin JSON → `permissionDecision: 'allow'` (fail-
 *     open; never a non-zero exit).
 *   - Tool-call idempotency — same `tool_call_id` retried produces one
 *     event.
 *   - Soft latency ceiling — 10 fixture guards + one pass completes within
 *     {@link LATENCY_SANITY_CEILING_MS}.
 *
 * The fixture matchers use `always` as the predicate because they're
 * exercising the command's flow, not predicate semantics. PR C does not
 * introduce new predicates; `always` is already exhaustiveness-gated.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import {
  runGuardWithOptions,
  LATENCY_SANITY_CEILING_MS,
} from '../guard.js';
import { WORKFLOW_COMMANDS } from '../../workflow.js';
import {
  buildGuardMatcher,
  type Guard,
  type GuardMatcher,
} from '../../../workflow/guards.js';
import { EventStore } from '../../../workflow/store.js';
import type { WorkflowStep } from '../../../workflow/state.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap
// ---------------------------------------------------------------------------

interface Captured {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

let captured: Captured;
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origExit: typeof process.exit;

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
// Scratch dirs
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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-guard-test-'));
  scratchDirs.push(dir);
  return dir;
}

async function initScratchSession(
  sessionId: string,
): Promise<{ sessionDir: string; repo: string }> {
  const repo = makeScratchRepo();
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'guard-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = join(repo, '.gobbi', 'sessions', sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo };
}

// ---------------------------------------------------------------------------
// Fixture builders
// ---------------------------------------------------------------------------

interface FixturePayload {
  readonly tool_name: string;
  readonly session_id: string;
  readonly tool_call_id?: string;
  readonly tool_input?: unknown;
}

function makePayload(
  sessionId: string,
  toolName: string,
  overrides: Partial<FixturePayload> = {},
): FixturePayload {
  return {
    tool_name: toolName,
    session_id: sessionId,
    ...overrides,
  };
}

function denyFixture(
  id: string,
  step: readonly WorkflowStep[] | '*',
  tool: readonly string[] | '*',
): Guard {
  return {
    id,
    matcher: { step, tool },
    predicate: 'always',
    effect: 'deny',
    reason: `deny fixture ${id}`,
  };
}

function warnFixture(
  id: string,
  step: readonly WorkflowStep[] | '*',
  tool: readonly string[] | '*',
): Guard {
  return {
    id,
    matcher: { step, tool },
    predicate: 'always',
    effect: 'warn',
    reason: `warn fixture ${id}`,
    code: 'W001_GUARD_WARN_GENERIC',
  };
}

function matcherWith(guards: readonly Guard[]): GuardMatcher {
  return buildGuardMatcher(guards);
}

function parseResponse(stdout: string): {
  readonly permissionDecision: string;
  readonly permissionDecisionReason?: string;
  readonly additionalContext?: string;
} {
  const trimmed = stdout.trim();
  expect(trimmed.length).toBeGreaterThan(0);
  const parsed = JSON.parse(trimmed) as {
    readonly hookSpecificOutput: {
      readonly permissionDecision: string;
      readonly permissionDecisionReason?: string;
      readonly additionalContext?: string;
    };
  };
  return parsed.hookSpecificOutput;
}

// ===========================================================================
// Registry presence
// ===========================================================================

describe('WORKFLOW_COMMANDS registration', () => {
  test('exposes `guard` as a subcommand', () => {
    const names = WORKFLOW_COMMANDS.map((c) => c.name);
    expect(names).toContain('guard');
  });
});

// ===========================================================================
// Happy path — no guards match
// ===========================================================================

describe('runGuard — empty registry', () => {
  test('responds allow + emits no events', async () => {
    const { sessionDir } = await initScratchSession('guard-empty');
    const payload = makePayload('guard-empty', 'Write');

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: matcherWith([]),
        payload,
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('allow');

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const guardEvents = [
        ...store.byType('guard.violation'),
        ...store.byType('guard.warn'),
      ];
      expect(guardEvents).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Deny path
// ===========================================================================

describe('runGuard — deny fixture', () => {
  test('emits deny + reason + guard.violation event', async () => {
    const { sessionDir } = await initScratchSession('guard-deny');
    const payload = makePayload('guard-deny', 'Write', {
      tool_call_id: 'call-deny-1',
    });

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: matcherWith([denyFixture('deny-1', '*', ['Write'])]),
        payload,
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('deny');
    expect(decision.permissionDecisionReason).toContain('deny fixture deny-1');
    expect(decision.permissionDecisionReason).toContain('guard: deny-1');
    // `ideation` is the step init lands on once workflow.eval.decide fires.
    expect(decision.permissionDecisionReason).toContain('step: ideation');

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const violations = store.byType('guard.violation');
      expect(violations).toHaveLength(1);
      const row = violations[0]!;
      const data = JSON.parse(row.data) as {
        readonly guardId: string;
        readonly toolName: string;
      };
      expect(data.guardId).toBe('deny-1');
      expect(data.toolName).toBe('Write');
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Warn path
// ===========================================================================

describe('runGuard — warn fixture', () => {
  test('emits allow + additionalContext + guard.warn event carrying code', async () => {
    const { sessionDir } = await initScratchSession('guard-warn');
    const payload = makePayload('guard-warn', 'Write', {
      tool_call_id: 'call-warn-1',
    });

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: matcherWith([warnFixture('warn-1', '*', ['Write'])]),
        payload,
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('allow');
    expect(decision.additionalContext).toBeDefined();
    expect(decision.additionalContext!).toContain('warn fixture warn-1');

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const warns = store.byType('guard.warn');
      expect(warns).toHaveLength(1);
      const row = warns[0]!;
      const data = JSON.parse(row.data) as {
        readonly guardId: string;
        readonly code: string;
        readonly severity: string;
      };
      expect(data.guardId).toBe('warn-1');
      expect(data.code).toBe('W001_GUARD_WARN_GENERIC');
      expect(data.severity).toBe('warning');
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Warn + deny combo — deny short-circuits; warn already landed
// ===========================================================================

describe('runGuard — warn + deny combo', () => {
  test('warn fires first, deny short-circuits — only deny appears in response', async () => {
    const { sessionDir } = await initScratchSession('guard-combo');
    const payload = makePayload('guard-combo', 'Write', {
      tool_call_id: 'call-combo-1',
    });

    // Order matters — warn comes before deny so warn lands its event
    // before the deny short-circuits the loop.
    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: matcherWith([
          warnFixture('combo-warn', ['ideation'], ['Write']),
          denyFixture('combo-deny', ['ideation'], ['Write']),
        ]),
        payload,
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('deny');
    expect(decision.permissionDecisionReason).toContain('combo-deny');
    // `additionalContext` is NOT used on deny responses — the deny reason
    // is the sole surfaced context.
    expect(decision.additionalContext).toBeUndefined();

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      expect(store.byType('guard.warn')).toHaveLength(1);
      expect(store.byType('guard.violation')).toHaveLength(1);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Missing / invalid session
// ===========================================================================

describe('runGuard — missing session', () => {
  test('session dir does not exist → allow, no crash, exit 0', async () => {
    const repo = makeScratchRepo();
    const fakeDir = join(repo, '.gobbi', 'sessions', 'not-real');
    expect(existsSync(fakeDir)).toBe(false);

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir: fakeDir,
        matcher: matcherWith([denyFixture('d', '*', '*')]),
        payload: makePayload('not-real', 'Write'),
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('allow');
  });

  test('session dir exists but no gobbi.db → allow', async () => {
    const repo = makeScratchRepo();
    const dir = join(repo, '.gobbi', 'sessions', 'empty-session');
    // Create the dir but NOT the db.
    const { mkdirSync } = await import('node:fs');
    mkdirSync(dir, { recursive: true });

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir: dir,
        matcher: matcherWith([denyFixture('d', '*', '*')]),
        payload: makePayload('empty-session', 'Write'),
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('allow');
  });
});

// ===========================================================================
// Invalid stdin
// ===========================================================================

describe('runGuard — invalid stdin', () => {
  test('malformed payload → allow (fail-open), exit 0', async () => {
    const { sessionDir } = await initScratchSession('guard-bad-stdin');

    // Pass a string where an object is expected — passes the `readStdin`
    // equivalent but fails the type guard.
    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: matcherWith([denyFixture('d', '*', '*')]),
        payload: 'not a json object',
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('allow');

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      expect(store.byType('guard.violation')).toHaveLength(0);
    } finally {
      store.close();
    }
  });

  test('object missing tool_name → allow', async () => {
    const { sessionDir } = await initScratchSession('guard-no-tool');

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: matcherWith([denyFixture('d', '*', '*')]),
        payload: { session_id: 'guard-no-tool' },
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('allow');
  });

  test('null payload → allow', async () => {
    const { sessionDir } = await initScratchSession('guard-null');

    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: matcherWith([denyFixture('d', '*', '*')]),
        payload: null,
      }),
    );

    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('allow');
  });
});

// ===========================================================================
// Tool-call idempotency dedupe
// ===========================================================================

describe('runGuard — tool-call idempotency', () => {
  test('same tool_call_id retried produces a single guard.violation', async () => {
    const { sessionDir } = await initScratchSession('guard-idem');
    const payload = makePayload('guard-idem', 'Write', {
      tool_call_id: 'call-retry',
    });

    const matcher = matcherWith([denyFixture('idem-guard', '*', ['Write'])]);

    // First invocation.
    await captureExit(() =>
      runGuardWithOptions([], { sessionDir, matcher, payload }),
    );
    expect(captured.exitCode).toBeNull();
    captured = { stdout: '', stderr: '', exitCode: null };

    // Retry — same tool_call_id.
    await captureExit(() =>
      runGuardWithOptions([], { sessionDir, matcher, payload }),
    );
    expect(captured.exitCode).toBeNull();
    const decision = parseResponse(captured.stdout);
    expect(decision.permissionDecision).toBe('deny');

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      // Idempotency key is `${sessionId}:${toolCallId}:${eventType}` — the
      // second append collides on UNIQUE and is dropped by DO NOTHING.
      expect(store.byType('guard.violation')).toHaveLength(1);
    } finally {
      store.close();
    }
  });
});

// ===========================================================================
// Latency sanity ceiling
// ===========================================================================

describe('runGuard — latency sanity', () => {
  test('realistic matcher (10 fixtures) + one invocation completes under soft ceiling', async () => {
    const { sessionDir } = await initScratchSession('guard-latency');
    const fixtures: Guard[] = [];
    for (let i = 0; i < 8; i += 1) {
      // Warn guards on unrelated tools so they don't match the payload.
      fixtures.push(warnFixture(`w${i}`, '*', [`Tool${i}`]));
    }
    fixtures.push(warnFixture('matching-warn', ['ideation'], ['Write']));
    fixtures.push(denyFixture('non-matching-deny', ['execution'], ['Edit']));

    const payload = makePayload('guard-latency', 'Write', {
      tool_call_id: 'call-latency',
    });

    const started = performance.now();
    await captureExit(() =>
      runGuardWithOptions([], {
        sessionDir,
        matcher: matcherWith(fixtures),
        payload,
      }),
    );
    const elapsed = performance.now() - started;

    expect(captured.exitCode).toBeNull();
    // Soft ceiling — the research budget is 3-5ms p50, ≤8ms p99. 100ms is
    // only meant to catch order-of-magnitude regressions (e.g. someone
    // spawning a subprocess on the hotpath under CI noise).
    expect(elapsed).toBeLessThan(LATENCY_SANITY_CEILING_MS);
  });
});
