/**
 * Tests for the `runGenericHookStub` dispatch allow-list and the bespoke
 * hook handlers (PR-FIN-1d.3 + issue #219).
 *
 * Coverage:
 *
 *   A. Bespoke-handler dispatch (3 tests) — `runHookStop`,
 *      `runHookSubagentStop`, `runHookSessionStart` each call
 *      `dispatchHookNotify` exactly once with the correct event name and
 *      `{ sessionId, projectDir }` derived from the payload + env.
 *   B. Stub allow-list (≥6 tests) — `runGenericHookStub` invokes
 *      `dispatchHookNotify` for Tier-A events (the original 4 Phase-1
 *      events plus the 11 Tier-A events wired in issue #219) and skips
 *      it for Tier-B events (`FileChanged`, `PostToolUse`, etc.). Two
 *      representative Tier-A events (`WorktreeCreate` from the new
 *      cohort, `PreCompact` from the original cohort) are checked.
 *   C. Throw containment (2 tests) — when `dispatchHookNotify` or
 *      `readStdinJson` throws synchronously, `runGenericHookStub` does
 *      NOT propagate; stderr receives a kebab-cased
 *      `gobbi hook <event>: <message>` line and the function resolves
 *      normally. PR-FIN-1d.6 widened the try/catch to cover the stdin
 *      reader as well, so a future regression in `readStdinJson` (I/O
 *      error, buffer decode failure) is contained.
 *   D. Hook-contract preservation (3 tests) — when `dispatchHookNotify`
 *      throws inside a bespoke handler, the existing try/catch catches
 *      it and the handler exits 0 with a `gobbi hook <name>:` stderr
 *      message — never propagates.
 *
 * Total: 12 tests (≥6 required by plan §1d.3 verification).
 *
 * ## Mock strategy
 *
 * `mock.module('../../lib/notify.js', …)` is module-scoped in `bun:test`
 * — it rewires the binding once for every importer. To let each test
 * install its own behaviour, the mock factory dispatches to a
 * `globalThis`-scoped pointer (matching the established pattern in
 * `__tests__/features/{hook,gobbi-config}.test.ts`).
 *
 * The `stop` and `subagent-stop` bespoke handlers depend on
 * `runStopWithOptions` / `runCaptureSubagentWithOptions`; both are mocked
 * out (no-op) so the test focuses on the dispatch wiring exclusively.
 */

import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import type { HookTrigger } from '../../../lib/settings.js';

// ---------------------------------------------------------------------------
// Mock plumbing — `dispatchHookNotify` records every call into a global array
// ---------------------------------------------------------------------------

interface DispatchCall {
  readonly payload: unknown;
  readonly eventName: HookTrigger;
  readonly options: { readonly sessionId?: string; readonly projectDir?: string };
}

interface DispatchState {
  calls: DispatchCall[];
  /** When set, the mocked `dispatchHookNotify` throws this error synchronously. */
  throwOnCall: Error | null;
}

const DISPATCH_KEY = '__gobbiHookDispatchState__';

function getDispatchState(): DispatchState {
  const slot = (globalThis as unknown as Record<string, DispatchState | undefined>)[DISPATCH_KEY];
  if (slot !== undefined) return slot;
  const fresh: DispatchState = { calls: [], throwOnCall: null };
  (globalThis as unknown as Record<string, DispatchState>)[DISPATCH_KEY] = fresh;
  return fresh;
}

function resetDispatchState(): void {
  const state = getDispatchState();
  state.calls = [];
  state.throwOnCall = null;
}

mock.module('../../../lib/notify.js', () => ({
  dispatchHookNotify: async (
    payload: unknown,
    eventName: HookTrigger,
    options: { readonly sessionId?: string; readonly projectDir?: string },
  ): Promise<void> => {
    const state = getDispatchState();
    state.calls.push({ payload, eventName, options });
    if (state.throwOnCall !== null) {
      throw state.throwOnCall;
    }
  },
}));

// ---------------------------------------------------------------------------
// Mock plumbing — `readStdinJson` returns a queued payload (one-shot per call)
// ---------------------------------------------------------------------------

interface StdinState {
  payload: string | null;
  /** When set, the mocked `readStdinJson` rejects with this error. */
  throwOnRead: Error | null;
}

const STDIN_KEY = '__gobbiStubStdinPayload__';

function setStdinPayload(payload: object | null): void {
  (globalThis as unknown as Record<string, StdinState>)[STDIN_KEY] = {
    payload: payload === null ? null : JSON.stringify(payload),
    throwOnRead: null,
  };
}

function setStdinThrow(err: Error): void {
  const slot = (globalThis as unknown as Record<string, StdinState | undefined>)[STDIN_KEY];
  if (slot !== undefined) {
    slot.throwOnRead = err;
  } else {
    (globalThis as unknown as Record<string, StdinState>)[STDIN_KEY] = {
      payload: null,
      throwOnRead: err,
    };
  }
}

function consumeStdinPayload(): string | null {
  const slot = (globalThis as unknown as Record<string, StdinState | undefined>)[STDIN_KEY];
  const raw = slot?.payload ?? null;
  if (slot !== undefined) slot.payload = null;
  return raw;
}

function consumeStdinThrow(): Error | null {
  const slot = (globalThis as unknown as Record<string, StdinState | undefined>)[STDIN_KEY];
  const err = slot?.throwOnRead ?? null;
  if (slot !== undefined) slot.throwOnRead = null;
  return err;
}

mock.module('../../../lib/stdin.js', () => ({
  readStdin: async (): Promise<string | null> => consumeStdinPayload(),
  readStdinJson: async <T,>(): Promise<T | null> => {
    const err = consumeStdinThrow();
    if (err !== null) throw err;
    const raw = consumeStdinPayload();
    if (raw === null || raw.trim() === '') return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
}));

// ---------------------------------------------------------------------------
// Mock plumbing — bespoke-handler workflow bodies are no-ops (we test the
// dispatch wiring, not the workflow side-effects).
// ---------------------------------------------------------------------------

mock.module('../../workflow/stop.js', () => ({
  runStopWithOptions: async (): Promise<void> => {
    // Intentional no-op — the test focuses on the dispatchHookNotify call.
  },
}));

mock.module('../../workflow/capture-subagent.js', () => ({
  runCaptureSubagentWithOptions: async (): Promise<void> => {
    // Intentional no-op.
  },
}));

mock.module('../../workflow/init.js', () => ({
  runInitWithOptions: async (): Promise<void> => {
    // Intentional no-op.
  },
}));

mock.module('../../config.js', () => ({
  parseHookEnvPayload: (raw: unknown): { readonly session_id?: string } => {
    if (raw !== null && typeof raw === 'object' && 'session_id' in raw) {
      const sid = (raw as { session_id?: unknown }).session_id;
      if (typeof sid === 'string') return { session_id: sid };
    }
    return {};
  },
  runConfigEnv: async (): Promise<void> => {
    // Intentional no-op.
  },
}));

import { runGenericHookStub } from '../_stub.js';
import { runHookStop } from '../stop.js';
import { runHookSubagentStop } from '../subagent-stop.js';
import { runHookSessionStart } from '../session-start.js';

// ---------------------------------------------------------------------------
// stderr capture
// ---------------------------------------------------------------------------

let capturedStderr = '';
let origStderrWrite: typeof process.stderr.write;

beforeEach(() => {
  resetDispatchState();
  setStdinPayload(null);
  capturedStderr = '';
  origStderrWrite = process.stderr.write;
  process.stderr.write = ((chunk: string | Uint8Array): boolean => {
    capturedStderr +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stderr.write;

  // Default — clear ambient project dir between tests; each test sets it
  // explicitly when the dispatch path needs it.
  delete process.env['CLAUDE_PROJECT_DIR'];
});

afterEach(() => {
  process.stderr.write = origStderrWrite;
  delete process.env['CLAUDE_PROJECT_DIR'];
});

// ===========================================================================
// A. Bespoke-handler dispatch
// ===========================================================================

describe('A. bespoke-handler dispatch invokes dispatchHookNotify', () => {
  test('A.1 runHookStop calls dispatchHookNotify with eventName="Stop" and derived options', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-stop';
    setStdinPayload({ session_id: 'sess-stop-1', stop_hook_active: false });

    await runHookStop([]);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(1);
    const call = state.calls[0];
    expect(call?.eventName).toBe('Stop');
    expect(call?.options).toEqual({ sessionId: 'sess-stop-1', projectDir: '/tmp/proj-stop' });
    expect(call?.payload).toMatchObject({ session_id: 'sess-stop-1' });
  });

  test('A.2 runHookSubagentStop calls dispatchHookNotify with eventName="SubagentStop"', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-sub';
    setStdinPayload({ session_id: 'sess-sub-1' });

    await runHookSubagentStop([]);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(1);
    const call = state.calls[0];
    expect(call?.eventName).toBe('SubagentStop');
    expect(call?.options).toEqual({ sessionId: 'sess-sub-1', projectDir: '/tmp/proj-sub' });
  });

  test('A.3 runHookSessionStart calls dispatchHookNotify with eventName="SessionStart"', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-start';
    setStdinPayload({
      session_id: 'sess-start-1',
      transcript_path: '/tmp/x.jsonl',
      cwd: '/tmp/proj-start',
      hook_event_name: 'SessionStart',
    });

    await runHookSessionStart([]);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(1);
    const call = state.calls[0];
    expect(call?.eventName).toBe('SessionStart');
    expect(call?.options).toEqual({ sessionId: 'sess-start-1', projectDir: '/tmp/proj-start' });
  });
});

// ===========================================================================
// B. Stub allow-list
// ===========================================================================

describe('B. runGenericHookStub — STUB_DISPATCH_EVENTS allow-list', () => {
  test('B.1 PreCompact (Tier-A, original Phase-1 cohort) → dispatchHookNotify called', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-pc';
    setStdinPayload({ session_id: 'sess-pc-1' });

    await runGenericHookStub('PreCompact', []);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(1);
    const call = state.calls[0];
    expect(call?.eventName).toBe('PreCompact');
    expect(call?.options).toEqual({ sessionId: 'sess-pc-1', projectDir: '/tmp/proj-pc' });
  });

  test('B.2 SessionEnd (Tier-A, original Phase-1 cohort) → dispatchHookNotify called', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-se';
    setStdinPayload({ session_id: 'sess-se-1' });

    await runGenericHookStub('SessionEnd', []);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(1);
    expect(state.calls[0]?.eventName).toBe('SessionEnd');
  });

  test('B.3 FileChanged (Tier-B) → dispatchHookNotify NOT called (template exists, but stub suppresses)', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-fc';
    setStdinPayload({ session_id: 'sess-fc-1' });

    await runGenericHookStub('FileChanged', []);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(0);
  });

  test('B.4 PostToolUse (Tier-B) → dispatchHookNotify NOT called (flooding suppression)', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-pt';
    setStdinPayload({ session_id: 'sess-pt-1' });

    await runGenericHookStub('PostToolUse', []);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(0);
  });

  test('B.5 WorktreeCreate (Tier-A, issue #219 cohort) → dispatchHookNotify called', async () => {
    // Locks the issue #219 expansion of STUB_DISPATCH_EVENTS to the
    // 11 Tier-A events. WorktreeCreate is representative of the new
    // cohort; if a future refactor accidentally drops a Tier-A entry
    // from the allow-list, this test catches it. Mirror B.1/B.2 shape.
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-wc';
    setStdinPayload({ session_id: 'sess-wc-1' });

    await runGenericHookStub('WorktreeCreate', []);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(1);
    const call = state.calls[0];
    expect(call?.eventName).toBe('WorktreeCreate');
    expect(call?.options).toEqual({ sessionId: 'sess-wc-1', projectDir: '/tmp/proj-wc' });
  });

  test('B.6 ConfigChange (Tier-A, issue #219 cohort) → dispatchHookNotify called', async () => {
    // Second Tier-A spot check — different event family (config vs.
    // worktree) so a single-bucket regression in the allow-list is
    // distinguishable from a wholesale break.
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-cc';
    setStdinPayload({ session_id: 'sess-cc-1' });

    await runGenericHookStub('ConfigChange', []);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(1);
    expect(state.calls[0]?.eventName).toBe('ConfigChange');
  });

  test('B.7 Elicitation (Tier-B) → dispatchHookNotify NOT called', async () => {
    // Third Tier-B representative covering the elicitation slot of the
    // Tier-B cohort. Distinguishes elicitation suppression from the
    // file/tool suppression covered by B.3/B.4.
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-el';
    setStdinPayload({ session_id: 'sess-el-1' });

    await runGenericHookStub('Elicitation', []);

    const state = getDispatchState();
    expect(state.calls).toHaveLength(0);
  });
});

// ===========================================================================
// C. Throw containment in _stub.ts
// ===========================================================================

describe('C. runGenericHookStub — throw containment', () => {
  test('C.1 dispatchHookNotify throw → no propagation, kebab stderr line', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-throw';
    setStdinPayload({ session_id: 'sess-throw-1' });

    const state = getDispatchState();
    state.throwOnCall = new Error('synthetic dispatch failure');

    // Must resolve normally — the hook contract requires exit 0.
    await expect(runGenericHookStub('UserPromptSubmit', [])).resolves.toBeUndefined();

    expect(state.calls).toHaveLength(1);
    expect(capturedStderr).toContain('gobbi hook user-prompt-submit:');
    expect(capturedStderr).toContain('synthetic dispatch failure');
  });

  test('C.2 readStdinJson throw → no propagation, kebab stderr line, dispatch never called', async () => {
    // Hardening: a future regression in `readStdinJson` (malformed I/O,
    // failed buffer decode) must not propagate. The widened try/catch
    // (PR-FIN-1d.6) keeps the hook contract's exit-0 guarantee even if
    // the stdin reader rejects before the dispatch path runs.
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-stdin-throw';
    setStdinThrow(new Error('synthetic stdin read failure'));

    const state = getDispatchState();

    await expect(runGenericHookStub('SessionEnd', [])).resolves.toBeUndefined();

    // Dispatch never reached because the throw happened earlier in the
    // try block.
    expect(state.calls).toHaveLength(0);
    expect(capturedStderr).toContain('gobbi hook session-end:');
    expect(capturedStderr).toContain('synthetic stdin read failure');
  });
});

// ===========================================================================
// D. Hook-contract preservation in bespoke handlers
// ===========================================================================

describe('D. bespoke handler — dispatch throw never propagates', () => {
  test('D.1 runHookStop catches dispatchHookNotify throw, writes stderr, resolves', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-d1';
    setStdinPayload({ session_id: 'sess-d1' });
    const state = getDispatchState();
    state.throwOnCall = new Error('boom-stop');

    await expect(runHookStop([])).resolves.toBeUndefined();

    expect(state.calls).toHaveLength(1);
    expect(capturedStderr).toContain('gobbi hook stop: boom-stop');
  });

  test('D.2 runHookSubagentStop catches throw, writes stderr, resolves', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-d2';
    setStdinPayload({ session_id: 'sess-d2' });
    const state = getDispatchState();
    state.throwOnCall = new Error('boom-sub');

    await expect(runHookSubagentStop([])).resolves.toBeUndefined();

    expect(state.calls).toHaveLength(1);
    expect(capturedStderr).toContain('gobbi hook subagent-stop: boom-sub');
  });

  test('D.3 runHookSessionStart catches throw, writes stderr, resolves', async () => {
    process.env['CLAUDE_PROJECT_DIR'] = '/tmp/proj-d3';
    setStdinPayload({
      session_id: 'sess-d3',
      transcript_path: '/tmp/x.jsonl',
      cwd: '/tmp/proj-d3',
      hook_event_name: 'SessionStart',
    });
    const state = getDispatchState();
    state.throwOnCall = new Error('boom-start');

    await expect(runHookSessionStart([])).resolves.toBeUndefined();

    expect(state.calls).toHaveLength(1);
    expect(capturedStderr).toContain('gobbi hook session-start: boom-start');
  });
});
