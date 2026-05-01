/**
 * Unit tests for `gobbi workflow capture-advancement` — the
 * PostToolUse(Bash) hook handler for the dormant
 * `step.advancement.observed` audit emitter.
 *
 * Coverage (PR-CFM-C T5 / issue #197):
 *
 *   1. No-op when `workflow.observability.advancement.enabled=false`
 *      (the default — the emitter is dormant on a fresh workspace).
 *   2. No-op when `tool_name !== 'Bash'`.
 *   3. No-op when the Bash command does not start with
 *      `gobbi workflow transition`.
 *   4. No-op when `session_id` is missing.
 *   5. No-op when `tool_call_id` is missing.
 *   6. No-op when the session directory does not resolve.
 *   7. No-op when `gobbi.db` does not exist on disk.
 *   8. Happy path — when the gate is flipped, exactly one
 *      `step.advancement.observed` row lands in the events table.
 *   9. Idempotency — re-firing with the same `tool_call_id`
 *      deduplicates (1 row, not 2).
 *  10. Distinctness — two transitions with different `tool_call_id`s
 *      produce two rows.
 *  11. Architectural fence — `appendEventAndUpdateState` is NEVER
 *      called from `capture-advancement.ts`. The load-bearing
 *      assertion reads the source file and asserts the literal token
 *      is absent. See `workflow/events/step-advancement.ts:30-41` and
 *      gotcha `state-db-redesign.md` §1 for the full rationale.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import { makeConformingTmpRepo } from '../../../__tests__/helpers/conforming-tmpdir.js';
import { runCaptureAdvancementWithOptions } from '../capture-advancement.js';
import { sessionDir as sessionDirForProject } from '../../../lib/workspace-paths.js';
import {
  loadSettingsAtLevel,
  writeSettingsAtLevel,
} from '../../../lib/settings-io.js';
import { EventStore } from '../../../workflow/store.js';
import type { Settings } from '../../../lib/settings.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap — mirrors capture-planning.test.ts
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
  const dir = makeConformingTmpRepo('gobbi-capture-advancement');
  scratchDirs.push(dir);
  return dir;
}

interface ScratchSession {
  readonly sessionDir: string;
  readonly repo: string;
  readonly projectId: string;
}

async function initScratchSession(
  sessionId: string,
): Promise<ScratchSession> {
  const repo = makeScratchRepo();
  const projectId = basename(repo);
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'capture-advancement-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = join(
    repo,
    '.gobbi',
    'projects',
    projectId,
    'sessions',
    sessionId,
  );
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo, projectId };
}

/**
 * Flip `workflow.observability.advancement.enabled = true` at the
 * workspace level so the cascade resolves to enabled. Default-off
 * behaviour stays the negative case (test 1); flipping on is the
 * happy-path precondition for tests 8-10.
 */
function enableAdvancementGate(repo: string): void {
  const existing = loadSettingsAtLevel(repo, 'workspace') ?? {
    schemaVersion: 1,
  };
  const next: Settings = {
    ...existing,
    schemaVersion: 1,
    workflow: {
      ...(existing.workflow ?? {}),
      observability: { advancement: { enabled: true } },
    },
  };
  writeSettingsAtLevel(repo, 'workspace', next);
}

/**
 * Open the per-session event store with explicit partition keys (PR-FIN-
 * 2a-ii / T-2a.9.unified Option α). Mirrors `capture-planning.test.ts`.
 */
function openStore(
  sessionDir: string,
  sessionId: string,
  projectId: string,
): EventStore {
  return new EventStore(join(sessionDir, 'gobbi.db'), {
    sessionId,
    projectId,
  });
}

interface PayloadOverrides {
  readonly tool_name?: string;
  readonly session_id?: string | null;
  readonly tool_call_id?: string | null;
  readonly command?: string;
}

function transitionPayload(
  sessionId: string,
  toolCallId: string,
  overrides: PayloadOverrides = {},
): object {
  const base: Record<string, unknown> = {
    tool_name: overrides.tool_name ?? 'Bash',
    tool_input: { command: overrides.command ?? 'gobbi workflow transition COMPLETE' },
  };
  if (overrides.session_id !== null) {
    base['session_id'] = overrides.session_id ?? sessionId;
  }
  if (overrides.tool_call_id !== null) {
    base['tool_call_id'] = overrides.tool_call_id ?? toolCallId;
  }
  return base;
}

// ---------------------------------------------------------------------------
// 1. No-op when `enabled=false` (default)
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — settings gate (default off)', () => {
  test('default-disabled cascade → no event row written', async () => {
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-default-off');
    // Explicitly do NOT call enableAdvancementGate(repo) — the default
    // cascade resolves `enabled=false`.

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-default-off', 'tc-1'),
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');

    const store = openStore(sessionDir, 'cap-adv-default-off', projectId);
    try {
      expect(store.byType('step.advancement.observed')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 2. No-op when tool_name != 'Bash'
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — wrong tool_name', () => {
  test('tool_name=ExitPlanMode → no event row, even when gate is on', async () => {
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-not-bash');
    enableAdvancementGate(repo);

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-not-bash', 'tc-1', {
          tool_name: 'ExitPlanMode',
        }),
      }),
    );

    const store = openStore(sessionDir, 'cap-adv-not-bash', projectId);
    try {
      expect(store.byType('step.advancement.observed')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 3. No-op when Bash command does not start with `gobbi workflow transition`
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — non-transition Bash command', () => {
  test('Bash echo invocation → no event row, even when gate is on', async () => {
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-non-transition');
    enableAdvancementGate(repo);

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-non-transition', 'tc-1', {
          command: 'echo hello world',
        }),
      }),
    );

    const store = openStore(sessionDir, 'cap-adv-non-transition', projectId);
    try {
      expect(store.byType('step.advancement.observed')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 4. No-op when session_id missing
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — missing session_id', () => {
  test('payload without session_id → no event row, no crash', async () => {
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-no-session-id');
    enableAdvancementGate(repo);

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-no-session-id', 'tc-1', {
          session_id: null,
        }),
      }),
    );

    expect(captured.exitCode).toBeNull();
    const store = openStore(sessionDir, 'cap-adv-no-session-id', projectId);
    try {
      expect(store.byType('step.advancement.observed')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 5. No-op when tool_call_id missing
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — missing tool_call_id', () => {
  test('payload without tool_call_id → no event row, no crash', async () => {
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-no-tool-call-id');
    enableAdvancementGate(repo);

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-no-tool-call-id', 'tc-1', {
          tool_call_id: null,
        }),
      }),
    );

    expect(captured.exitCode).toBeNull();
    const store = openStore(sessionDir, 'cap-adv-no-tool-call-id', projectId);
    try {
      expect(store.byType('step.advancement.observed')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 6. No-op when session dir doesn't resolve
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — unresolvable session dir', () => {
  test('nonexistent session dir → silent exit, no crash', async () => {
    const repo = makeScratchRepo();
    enableAdvancementGate(repo);
    const fakeDir = sessionDirForProject(repo, basename(repo), 'not-real');
    expect(existsSync(fakeDir)).toBe(false);

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir: fakeDir,
        repoRoot: repo,
        payload: transitionPayload('not-real', 'tc-1'),
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    // No DB was created; no row to assert.
    expect(existsSync(join(fakeDir, 'gobbi.db'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 7. No-op when gobbi.db does not exist
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — missing gobbi.db', () => {
  test('session dir exists but gobbi.db absent → silent exit', async () => {
    const { sessionDir, repo } = await initScratchSession('cap-adv-no-db');
    enableAdvancementGate(repo);

    // Remove the gobbi.db that init created so the existsSync gate fires.
    const dbPath = join(sessionDir, 'gobbi.db');
    if (existsSync(dbPath)) {
      rmSync(dbPath);
    }

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-no-db', 'tc-1'),
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(dbPath)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 8. Happy path — gate on + matching invocation → one row
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — happy path', () => {
  test('gate on + Bash transition → exactly one step.advancement.observed row', async () => {
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-happy');
    enableAdvancementGate(repo);

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-happy', 'tc-happy-1'),
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');

    const store = openStore(sessionDir, 'cap-adv-happy', projectId);
    try {
      const rows = store.byType('step.advancement.observed');
      expect(rows).toHaveLength(1);
      const row = rows[0]!;

      // The row-level `step` column MUST be set (NOT only inside
      // `data`) so subsequent `lastNAny(1)[0]?.step` reads return the
      // actual current step. This is the load-bearing assertion for
      // the carry-forward Architecture F3 (Medium-100) finding.
      expect(row.step).toBeTypeOf('string');
      expect(row.step?.length).toBeGreaterThan(0);

      // Actor matches the hook contract.
      expect(row.actor).toBe('hook');

      // Data shape — the event factory's payload is preserved.
      const data = JSON.parse(row.data) as {
        readonly step: string;
        readonly toolCallId: string;
        readonly timestamp: string;
      };
      expect(data.toolCallId).toBe('tc-happy-1');
      expect(typeof data.timestamp).toBe('string');
      expect(data.timestamp.length).toBeGreaterThan(0);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 9. Idempotency — same tool_call_id → 1 row
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — idempotency', () => {
  test('two firings with the same tool_call_id → one row (deduped)', async () => {
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-idempotent');
    enableAdvancementGate(repo);

    const payload = transitionPayload('cap-adv-idempotent', 'tc-dedup');

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload,
      }),
    );
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload,
      }),
    );

    const store = openStore(sessionDir, 'cap-adv-idempotent', projectId);
    try {
      const rows = store.byType('step.advancement.observed');
      expect(rows).toHaveLength(1);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 10. Distinctness — distinct tool_call_ids → 2 rows
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — distinctness', () => {
  test('two firings with different tool_call_ids → two rows', async () => {
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-distinct');
    enableAdvancementGate(repo);

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-distinct', 'tc-A'),
      }),
    );
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-distinct', 'tc-B'),
      }),
    );

    const store = openStore(sessionDir, 'cap-adv-distinct', projectId);
    try {
      const rows = store.byType('step.advancement.observed');
      expect(rows).toHaveLength(2);
      // Distinct tool_call_ids in the data payload — no two rows share
      // an idempotency key.
      const toolCallIds = rows.map((row) => {
        const data = JSON.parse(row.data) as { readonly toolCallId: string };
        return data.toolCallId;
      });
      expect(new Set(toolCallIds)).toEqual(new Set(['tc-A', 'tc-B']));
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// 11. Architectural fence — reducer NEVER invoked from capture-advancement
// ---------------------------------------------------------------------------

describe('runCaptureAdvancement — architectural fence', () => {
  test('capture-advancement.ts source contains NO `appendEventAndUpdateState(` call site', () => {
    // Load-bearing static assertion. The architectural fence is that
    // `step.advancement.observed` is audit-only and MUST NOT enter the
    // reducer (see `workflow/events/step-advancement.ts:30-41` and
    // gotcha `state-db-redesign.md` §1). The TypeScript surface
    // already prevents `appendEventAndUpdateState({ type:
    // 'step.advancement.observed', ... })` from compiling because
    // `StepAdvancementEvent` is not a member of the reducer's `Event`
    // union — but a future change could:
    //
    //   (a) widen the `Event` union by mistake, then route this event
    //       through the reducer-aware path;
    //   (b) reach for a generic `<any>` cast to bypass the type
    //       check;
    //   (c) accidentally swap the call from `store.append()` to
    //       `appendEventAndUpdateState()` while refactoring.
    //
    // None of those would leave a runtime trace that a "row count"
    // assertion could observe (state_snapshots is a Wave-E-1 table no
    // code writes to today; reducer-routed audit failures swallow
    // silently; engine-audit branches don't fire for plain Errors).
    //
    // Reading the source and asserting the call-site token is absent
    // is the load-bearing check: if a future diff re-introduces the
    // call, the source contains the `(` and this test fails. The
    // pattern matches `appendEventAndUpdateState(` (open paren) AND
    // `await appendEventAndUpdateState` (call expression with await,
    // no whitespace before paren in a future minimised form). The
    // module's docblock and the in-code comment naming the invariant
    // mention the word in prose without parens or `await` — those
    // are intentionally allowed and document the fence.
    const src = readFileSync(
      join(import.meta.dir, '..', 'capture-advancement.ts'),
      'utf8',
    );
    expect(src).not.toMatch(/appendEventAndUpdateState\s*\(/);
    expect(src).not.toMatch(/await\s+appendEventAndUpdateState\b/);
  });

  test('happy-path append does not produce a workflow.invalid_transition audit', async () => {
    // Secondary runtime check — paired with the static assertion
    // above. If a future refactor routed this event through the
    // reducer, the reducer's `assertNever` would throw and the
    // engine's `workflow.invalid_transition` audit would fire (when
    // the throw was a `ReducerRejectionError`). Asserting zero such
    // audit rows confirms the bypass actually happened at runtime,
    // not just at the source-string level.
    const { sessionDir, repo, projectId } =
      await initScratchSession('cap-adv-fence-runtime');
    enableAdvancementGate(repo);

    await captureExit(() =>
      runCaptureAdvancementWithOptions([], {
        sessionDir,
        repoRoot: repo,
        payload: transitionPayload('cap-adv-fence-runtime', 'tc-fence'),
      }),
    );

    const store = openStore(sessionDir, 'cap-adv-fence-runtime', projectId);
    try {
      expect(store.byType('step.advancement.observed')).toHaveLength(1);
      expect(store.byType('workflow.invalid_transition')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});
