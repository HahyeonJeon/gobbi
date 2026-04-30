/**
 * Unit tests for `gobbi workflow capture-subagent` — the SubagentStop hook
 * handler.
 *
 * Coverage:
 *   - Registry presence — `capture-subagent` is registered in
 *     WORKFLOW_COMMANDS.
 *   - Three-case failure handling per `v050-hooks.md:96–105`:
 *       1. Transcript present + parseable → artifact + delegation.complete.
 *       2. Transcript present + unparseable → marker artifact +
 *          delegation.fail.
 *       3. Transcript absent → marker artifact + delegation.fail.
 *   - `stop_hook_active: true` → no-op (no events, no artifact).
 *   - Missing session → silent exit, no events.
 *   - `delegation.spawn` lookup populates `parent_seq` when a matching
 *     spawn exists; omits it when no match.
 *   - Tool-call idempotency — retried SubagentStop with the same
 *     `tool_call_id` produces exactly one `delegation.complete`.
 *   - Response contract: exit 0, no permissionDecision in stdout.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
// readFileSync is already imported above; the SHA test uses it for fixture hashing.
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { runInitWithOptions } from '../init.js';
import { runCaptureSubagentWithOptions } from '../capture-subagent.js';
import { sessionDir as sessionDirForProject } from '../../../lib/workspace-paths.js';
import { WORKFLOW_COMMANDS } from '../../workflow.js';
import { EventStore } from '../../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../../workflow/engine.js';
import { createDelegationSpawn } from '../../../workflow/events/delegation.js';
import { withEnv } from '../../../__tests__/helpers/with-env.js';

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
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-capture-sub-'));
  scratchDirs.push(dir);
  return dir;
}

async function initScratchSession(
  sessionId: string,
): Promise<{ sessionDir: string; repo: string }> {
  const repo = makeScratchRepo();
  await captureExit(() =>
    runInitWithOptions(
      ['--session-id', sessionId, '--task', 'capture-subagent-test'],
      { repoRoot: repo },
    ),
  );
  const sessionDir = sessionDirForProject(repo, basename(repo), sessionId);
  captured = { stdout: '', stderr: '', exitCode: null };
  return { sessionDir, repo };
}

// ---------------------------------------------------------------------------
// Transcript fixtures
// ---------------------------------------------------------------------------

/**
 * Build a JSONL transcript file with a single final-assistant-text line.
 * Represents case 1 (parseable, terminates with an assistant text block).
 */
function writeParseableTranscript(
  dir: string,
  name: string,
  text: string,
): string {
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, name);
  const lines = [
    JSON.stringify({
      type: 'user',
      message: { role: 'user', content: 'delegation prompt' },
    }),
    JSON.stringify({
      type: 'assistant',
      message: {
        role: 'assistant',
        content: [{ type: 'text', text }],
      },
    }),
  ];
  writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
  return filePath;
}

/**
 * Build a transcript whose final line is a tool_use block with no text —
 * `extractMessageContent` returns '' and the command routes to the
 * "present + unparseable" branch per the research map.
 */
function writeToolUseTerminatedTranscript(
  dir: string,
  name: string,
): string {
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, name);
  const lines = [
    JSON.stringify({
      type: 'user',
      message: { role: 'user', content: 'delegation prompt' },
    }),
    JSON.stringify({
      type: 'assistant',
      message: {
        role: 'assistant',
        content: [
          {
            type: 'tool_use',
            name: 'Bash',
            input: { command: 'true' },
            id: 'call-xyz',
          },
        ],
      },
    }),
  ];
  writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
  return filePath;
}

/**
 * Build a transcript whose tail line is literally malformed JSON — this is
 * a second flavour of "unparseable": `parseJsonlFile` will silently skip
 * the bad line, so `readLastLine` returns the previous good line. If the
 * previous good line also carries no assistant text, the branch lands on
 * the unparseable case.
 */
function writeMalformedTailTranscript(dir: string, name: string): string {
  mkdirSync(dir, { recursive: true });
  const filePath = join(dir, name);
  // Only a single non-JSON line so readLastLine returns null.
  writeFileSync(filePath, `{ this is not valid json\n`, 'utf8');
  return filePath;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

describe('WORKFLOW_COMMANDS registration', () => {
  test('exposes `capture-subagent` as a subcommand', () => {
    const names = WORKFLOW_COMMANDS.map((c) => c.name);
    expect(names).toContain('capture-subagent');
  });
});

// ---------------------------------------------------------------------------
// Case 1 — transcript present + parseable
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — case 1 (parseable)', () => {
  test('writes artifact + emits delegation.complete + artifact.write', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-case1');
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-a1.jsonl',
      'final assistant text for subtask',
    );

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-a1',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: 'cap-sub-case1',
          tool_call_id: 'call-1',
        },
      }),
    );

    expect(captured.exitCode).toBeNull();
    // Observational hook — no permissionDecision in the (empty) response.
    expect(captured.stdout).toBe('');

    const artifactPath = join(sessionDir, 'artifacts', 'executor-r1.md');
    expect(existsSync(artifactPath)).toBe(true);
    expect(readFileSync(artifactPath, 'utf8')).toBe(
      'final assistant text for subtask',
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(1);
      const row = completes[0]!;
      const data = JSON.parse(row.data) as {
        readonly subagentId: string;
        readonly artifactPath?: string;
        readonly tokensUsed?: number;
      };
      expect(data.subagentId).toBe('agent-a1');
      expect(data.artifactPath).toBe(artifactPath);
      // No cost passthrough on this payload — the field must be absent.
      expect(data.tokensUsed).toBeUndefined();

      const writes = store.byType('artifact.write');
      expect(writes).toHaveLength(1);
      const writeData = JSON.parse(writes[0]!.data) as {
        readonly filename: string;
        readonly artifactType: string;
      };
      expect(writeData.filename).toBe('executor-r1.md');
      expect(writeData.artifactType).toBe('delegation');

      // No fail event on the success path.
      expect(store.byType('delegation.fail')).toHaveLength(0);
    } finally {
      store.close();
    }
  });

  test('passes tokensUsed / cacheHitRatio through when present on stdin', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-cost');
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-c1.jsonl',
      'done',
    );

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-c1',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: 'cap-sub-cost',
          tokensUsed: 1234,
          cacheHitRatio: 0.75,
        },
      }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(1);
      const data = JSON.parse(completes[0]!.data) as {
        readonly tokensUsed?: number;
        readonly cacheHitRatio?: number;
      };
      expect(data.tokensUsed).toBe(1234);
      expect(data.cacheHitRatio).toBe(0.75);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Case 2 — transcript present + unparseable
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — case 2 (unparseable)', () => {
  test('tool_use-terminated transcript → marker artifact + delegation.fail with transcriptPath', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-case2a');
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeToolUseTerminatedTranscript(
      transcriptDir,
      'agent-u1.jsonl',
    );

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-u1',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: 'cap-sub-case2a',
        },
      }),
    );

    expect(captured.exitCode).toBeNull();
    const marker = join(sessionDir, 'artifacts', 'delegation-fail-r1.md');
    expect(existsSync(marker)).toBe(true);
    expect(readFileSync(marker, 'utf8')).toContain(transcript);

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const fails = store.byType('delegation.fail');
      expect(fails).toHaveLength(1);
      const data = JSON.parse(fails[0]!.data) as {
        readonly subagentId: string;
        readonly reason: string;
        readonly transcriptPath?: string;
      };
      expect(data.subagentId).toBe('agent-u1');
      expect(data.transcriptPath).toBe(transcript);
      expect(data.reason).toContain('no assistant text');
      expect(store.byType('delegation.complete')).toHaveLength(0);
    } finally {
      store.close();
    }
  });

  test('malformed JSONL transcript → marker artifact + delegation.fail', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-case2b');
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeMalformedTailTranscript(
      transcriptDir,
      'agent-u2.jsonl',
    );

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-u2',
          agent_type: 'evaluator',
          agent_transcript_path: transcript,
          session_id: 'cap-sub-case2b',
        },
      }),
    );

    const marker = join(sessionDir, 'artifacts', 'delegation-fail-r1.md');
    expect(existsSync(marker)).toBe(true);

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      expect(store.byType('delegation.fail')).toHaveLength(1);
      expect(store.byType('delegation.complete')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Case 3 — transcript absent
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — case 3 (absent)', () => {
  test('nonexistent transcript path → marker artifact + delegation.fail with reason', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-case3');
    const missingPath = join(sessionDir, 'does-not-exist.jsonl');
    expect(existsSync(missingPath)).toBe(false);

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-m1',
          agent_type: 'researcher',
          agent_transcript_path: missingPath,
          session_id: 'cap-sub-case3',
        },
      }),
    );

    expect(captured.exitCode).toBeNull();
    const marker = join(sessionDir, 'artifacts', 'delegation-fail-r1.md');
    expect(existsSync(marker)).toBe(true);
    const content = readFileSync(marker, 'utf8');
    expect(content).toContain('transcript not found');

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const fails = store.byType('delegation.fail');
      expect(fails).toHaveLength(1);
      const data = JSON.parse(fails[0]!.data) as {
        readonly reason: string;
        readonly transcriptPath?: string;
      };
      expect(data.reason).toContain('transcript not found');
      expect(data.reason).toContain(missingPath);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// stop_hook_active reentrance guard
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — stop_hook_active', () => {
  test('stop_hook_active: true → no events, no artifact', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-sha');
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-sha.jsonl',
      'should not be captured',
    );

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-sha',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: 'cap-sub-sha',
          stop_hook_active: true,
        },
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
    expect(existsSync(join(sessionDir, 'artifacts'))).toBe(false);

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      expect(store.byType('delegation.complete')).toHaveLength(0);
      expect(store.byType('delegation.fail')).toHaveLength(0);
      expect(store.byType('artifact.write')).toHaveLength(0);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Missing session
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — missing session', () => {
  test('session dir does not exist → silent exit, no crash', async () => {
    const repo = makeScratchRepo();
    const fakeDir = sessionDirForProject(repo, basename(repo), 'not-real');
    expect(existsSync(fakeDir)).toBe(false);

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir: fakeDir,
        payload: {
          agent_id: 'a',
          agent_type: 'executor',
          agent_transcript_path: '/nope',
          session_id: 'not-real',
        },
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toBe('');
  });
});

// ---------------------------------------------------------------------------
// parent_seq linkage
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — parent_seq linkage', () => {
  // PR-FIN-2a-ii T-2a.8.0: linkage now keys on tool_call_id, not on
  // subagentId === agent_id. The spawn must carry tool_call_id (the new
  // PreToolUse-emitted spawn does) and the SubagentStop must too —
  // otherwise the lookup refuses to guess.
  test('links delegation.complete.parent_seq to matching delegation.spawn.seq via tool_call_id', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-parent');
    const sessionId = 'cap-sub-parent';
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-p1.jsonl',
      'child result',
    );

    // Seed a delegation.spawn carrying the same tool_call_id the
    // SubagentStop will land with.
    let spawnSeq: number | null = null;
    {
      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        appendEventAndUpdateState(
          store,
          sessionDir,
          state,
          createDelegationSpawn({
            agentType: 'executor',
            step: state.currentStep,
            subagentId: 'agent-p1',
            timestamp: new Date().toISOString(),
            tool_call_id: 'toolu_link',
          }),
          'cli',
          sessionId,
          'tool-call',
          'toolu_link',
        );
        const spawnRow = store.last('delegation.spawn');
        spawnSeq = spawnRow?.seq ?? null;
      } finally {
        store.close();
      }
    }
    expect(spawnSeq).not.toBeNull();

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-p1',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: sessionId,
          tool_call_id: 'toolu_link',
        },
      }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(1);
      expect(completes[0]!.parent_seq).toBe(spawnSeq);
    } finally {
      store.close();
    }
  });

  test('omits parent_seq when no matching delegation.spawn exists', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-noparent');
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-orphan.jsonl',
      'result without spawn',
    );

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-orphan',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: 'cap-sub-noparent',
          tool_call_id: 'toolu_orphan',
        },
      }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(1);
      expect(completes[0]!.parent_seq).toBeNull();
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Tool-call idempotency
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — tool-call idempotency', () => {
  test('retried SubagentStop with same tool_call_id produces one delegation.complete', async () => {
    const { sessionDir } = await initScratchSession('cap-sub-idem');
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-i1.jsonl',
      'idempotent result',
    );

    const payload = {
      agent_id: 'agent-i1',
      agent_type: 'executor',
      agent_transcript_path: transcript,
      session_id: 'cap-sub-idem',
      tool_call_id: 'call-retry',
    };

    await captureExit(() =>
      runCaptureSubagentWithOptions([], { sessionDir, payload }),
    );
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runCaptureSubagentWithOptions([], { sessionDir, payload }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      expect(store.byType('delegation.complete')).toHaveLength(1);
      // The artifact.write event uses the same idempotency formula
      // (tool-call + artifact.write type). First retry dedupes it too.
      expect(store.byType('artifact.write')).toHaveLength(1);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// Issue #92 — CLAUDE_CODE_VERSION capture on delegation.spawn
//
// The spawn-emission site itself is scheduled for a later wave; today this
// test suite exercises the end-to-end round trip by seeding a spawn event
// with the `claudeCodeVersion` field populated from `process.env` via the
// documented read pattern, then asserting the field survives the append →
// SQLite `data` column → `store.last('delegation.spawn')` path. The two
// cases mirror the issue #92 env contract: populate when the env var is a
// non-empty string, omit otherwise (never write an empty string).
// ---------------------------------------------------------------------------

describe('delegation.spawn — CLAUDE_CODE_VERSION env capture (issue #92)', () => {
  test('env present → spawn event data carries claudeCodeVersion', async () => {
    const sessionId = 'cap-sub-ccv-present';
    const { sessionDir } = await initScratchSession(sessionId);

    await withEnv({ CLAUDE_CODE_VERSION: '2.1.110' }, () => {
      const envVersion = process.env['CLAUDE_CODE_VERSION'];
      // Emitters populate the field only when the env var is a non-empty
      // string — this is the documented pattern (see delegation.ts
      // DelegationSpawnData.claudeCodeVersion JSDoc).
      const claudeCodeVersion =
        envVersion !== undefined && envVersion !== '' ? envVersion : undefined;

      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        appendEventAndUpdateState(
          store,
          sessionDir,
          state,
          createDelegationSpawn({
            agentType: 'executor',
            step: state.currentStep,
            subagentId: 'agent-ccv-1',
            timestamp: new Date().toISOString(),
            ...(claudeCodeVersion !== undefined ? { claudeCodeVersion } : {}),
          }),
          'cli',
          sessionId,
          'system',
        );

        const spawnRow = store.last('delegation.spawn');
        expect(spawnRow).not.toBeNull();
        const data = JSON.parse(spawnRow!.data) as {
          readonly subagentId: string;
          readonly claudeCodeVersion?: string;
        };
        expect(data.subagentId).toBe('agent-ccv-1');
        expect(data.claudeCodeVersion).toBe('2.1.110');
      } finally {
        store.close();
      }
    });
  });

  // Issue #131 stabilization: the original test merged scenarios A
  // (`CLAUDE_CODE_VERSION` unset) and B (empty string) into one body,
  // sharing a single sessionId and event store. Two flake sources
  // collided in full-suite runs:
  //
  //   1. The `system` idempotency key is `${sessionId}:${ms}:${type}` —
  //      same-millisecond `new Date().toISOString()` between the two
  //      append calls produced an ON-CONFLICT no-op for scenario B,
  //      then the `store.last(...)` read returned scenario A's row.
  //   2. `process.env['CLAUDE_CODE_VERSION']` leaked across parallel
  //      bun-test workers because the prior try/finally only ran inside
  //      the test body.
  //
  // The fix splits the two scenarios into separate `test(...)` blocks
  // (each with its own `initScratchSession` + scratch DB → distinct
  // sessionId → idempotency keys cannot collide) and routes every env
  // mutation through `withEnv` (scoped capture-set-restore in `finally`).
  test('env unset → spawn event data omits claudeCodeVersion', async () => {
    const sessionId = 'cap-sub-ccv-unset';
    const { sessionDir } = await initScratchSession(sessionId);

    await withEnv({ CLAUDE_CODE_VERSION: undefined }, () => {
      const envVersion = process.env['CLAUDE_CODE_VERSION'];
      const claudeCodeVersion =
        envVersion !== undefined && envVersion !== '' ? envVersion : undefined;

      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        appendEventAndUpdateState(
          store,
          sessionDir,
          state,
          createDelegationSpawn({
            agentType: 'executor',
            step: state.currentStep,
            subagentId: 'agent-ccv-unset',
            timestamp: new Date().toISOString(),
            ...(claudeCodeVersion !== undefined ? { claudeCodeVersion } : {}),
          }),
          'cli',
          sessionId,
          'system',
        );

        const row = store.last('delegation.spawn');
        expect(row).not.toBeNull();
        const data = JSON.parse(row!.data) as Record<string, unknown>;
        expect(data['subagentId']).toBe('agent-ccv-unset');
        // Emitter MUST omit the field, not write an empty string.
        expect('claudeCodeVersion' in data).toBe(false);
      } finally {
        store.close();
      }
    });
  });

  test('env empty string → spawn event data omits claudeCodeVersion', async () => {
    const sessionId = 'cap-sub-ccv-empty';
    const { sessionDir } = await initScratchSession(sessionId);

    await withEnv({ CLAUDE_CODE_VERSION: '' }, () => {
      const envVersion = process.env['CLAUDE_CODE_VERSION'];
      const claudeCodeVersion =
        envVersion !== undefined && envVersion !== '' ? envVersion : undefined;

      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        appendEventAndUpdateState(
          store,
          sessionDir,
          state,
          createDelegationSpawn({
            agentType: 'executor',
            step: state.currentStep,
            subagentId: 'agent-ccv-empty',
            timestamp: new Date().toISOString(),
            ...(claudeCodeVersion !== undefined ? { claudeCodeVersion } : {}),
          }),
          'cli',
          sessionId,
          'system',
        );

        const row = store.last('delegation.spawn');
        expect(row).not.toBeNull();
        const data = JSON.parse(row!.data) as Record<string, unknown>;
        expect(data['subagentId']).toBe('agent-ccv-empty');
        // Emitter MUST omit the field, not write an empty string.
        expect('claudeCodeVersion' in data).toBe(false);
      } finally {
        store.close();
      }
    });
  });
});

// ---------------------------------------------------------------------------
// PR-FIN-2a-ii T-2a.8.0 — tool_call_id-scoped parent linkage
//
// The previous heuristic — `last('delegation.spawn')` filtered by
// `subagentId === agent_id` — silently misattributed parent linkage when
// multiple subagents were spawned in parallel from one orchestrator turn.
// These tests pin the new behavior: with `tool_call_id` carried on every
// spawn (PR-FIN-2a-ii adds the field) the SubagentStop's `tool_call_id`
// picks out the matching spawn even when the most recent spawn belongs to
// a different sibling.
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — tool_call_id parent linkage (parallel)', () => {
  test('two parallel spawns + two SubagentStops link by tool_call_id, not by recency', async () => {
    const sessionId = 'cap-sub-parallel';
    const { sessionDir } = await initScratchSession(sessionId);
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcriptA = writeParseableTranscript(
      transcriptDir,
      'agent-A.jsonl',
      'A done',
    );
    const transcriptB = writeParseableTranscript(
      transcriptDir,
      'agent-B.jsonl',
      'B done',
    );

    // Seed two delegation.spawn events in order — A first, then B. Both
    // carry tool_call_ids so capture-subagent can match precisely. If the
    // implementation falls back to last('delegation.spawn'), agent A's
    // SubagentStop would link to spawn B (the most recent). The test
    // breaks that path by sequencing the SubagentStops so A arrives BEFORE
    // B — but A is older, so the heuristic linkage would be wrong.
    let spawnSeqA: number | null = null;
    let spawnSeqB: number | null = null;
    {
      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const stateA = resolveWorkflowState(sessionDir, store, sessionId);
        appendEventAndUpdateState(
          store,
          sessionDir,
          stateA,
          createDelegationSpawn({
            agentType: '__pi',
            step: stateA.currentStep,
            subagentId: 'sub-A',
            timestamp: '2026-04-29T00:00:00.001Z',
            tool_call_id: 'toolu_A',
          }),
          'hook',
          sessionId,
          'tool-call',
          'toolu_A',
        );
        spawnSeqA = store.last('delegation.spawn')?.seq ?? null;

        const stateB = resolveWorkflowState(sessionDir, store, sessionId);
        appendEventAndUpdateState(
          store,
          sessionDir,
          stateB,
          createDelegationSpawn({
            agentType: '__pi',
            step: stateB.currentStep,
            subagentId: 'sub-B',
            timestamp: '2026-04-29T00:00:00.002Z',
            tool_call_id: 'toolu_B',
          }),
          'hook',
          sessionId,
          'tool-call',
          'toolu_B',
        );
        spawnSeqB = store.last('delegation.spawn')?.seq ?? null;
      } finally {
        store.close();
      }
    }
    expect(spawnSeqA).not.toBeNull();
    expect(spawnSeqB).not.toBeNull();
    expect(spawnSeqA).not.toBe(spawnSeqB);

    // SubagentStop for A — must link to spawn A even though spawn B is
    // the most recent in the store.
    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'sub-A',
          agent_type: '__pi',
          agent_transcript_path: transcriptA,
          session_id: sessionId,
          tool_call_id: 'toolu_A',
        },
      }),
    );

    // SubagentStop for B — must link to spawn B.
    captured = { stdout: '', stderr: '', exitCode: null };
    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'sub-B',
          agent_type: '__pi',
          agent_transcript_path: transcriptB,
          session_id: sessionId,
          tool_call_id: 'toolu_B',
        },
      }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(2);
      const byAgent = new Map<string, number | null>();
      for (const row of completes) {
        const data = JSON.parse(row.data) as { readonly subagentId: string };
        byAgent.set(data.subagentId, row.parent_seq);
      }
      // Each completion must point at its OWN spawn — not the recent one.
      expect(byAgent.get('sub-A')).toBe(spawnSeqA);
      expect(byAgent.get('sub-B')).toBe(spawnSeqB);
    } finally {
      store.close();
    }
  });

  test('SubagentStop without tool_call_id falls back to parent_seq null', async () => {
    // The previous heuristic had a chance to guess; the new precise lookup
    // refuses to guess. Asserts the fallback contract: missing tool_call_id
    // on SubagentStop → parent_seq is null even when a spawn exists.
    const sessionId = 'cap-sub-no-tcid';
    const { sessionDir } = await initScratchSession(sessionId);
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-N.jsonl',
      'no-tcid result',
    );

    {
      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        appendEventAndUpdateState(
          store,
          sessionDir,
          state,
          createDelegationSpawn({
            agentType: 'executor',
            step: state.currentStep,
            subagentId: 'sub-N',
            timestamp: '2026-04-29T00:00:00.000Z',
            tool_call_id: 'toolu_N',
          }),
          'hook',
          sessionId,
          'tool-call',
          'toolu_N',
        );
      } finally {
        store.close();
      }
    }

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'sub-N',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: sessionId,
          // no tool_call_id, no tool_use_id
        },
      }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(1);
      // Without a tool_call_id on the stop payload, the new lookup
      // refuses to guess — parent_seq is null.
      expect(completes[0]!.parent_seq).toBeNull();
    } finally {
      store.close();
    }
  });

  test('tool_use_id on SubagentStop links the same way as tool_call_id', async () => {
    // Claude Code's canonical hook reference uses `tool_use_id`; the
    // resolver accepts either name. This test pins the canonical-name
    // path so production hooks (which carry `tool_use_id`) work alongside
    // existing test fixtures (which carry `tool_call_id`).
    const sessionId = 'cap-sub-use-id';
    const { sessionDir } = await initScratchSession(sessionId);
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-U.jsonl',
      'tool_use_id linked',
    );

    let spawnSeq: number | null = null;
    {
      const store = new EventStore(join(sessionDir, 'gobbi.db'));
      try {
        const state = resolveWorkflowState(sessionDir, store, sessionId);
        appendEventAndUpdateState(
          store,
          sessionDir,
          state,
          createDelegationSpawn({
            agentType: 'executor',
            step: state.currentStep,
            subagentId: 'sub-U',
            timestamp: '2026-04-29T00:00:00.000Z',
            tool_call_id: 'toolu_USE',
          }),
          'hook',
          sessionId,
          'tool-call',
          'toolu_USE',
        );
        spawnSeq = store.last('delegation.spawn')?.seq ?? null;
      } finally {
        store.close();
      }
    }
    expect(spawnSeq).not.toBeNull();

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'sub-U',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: sessionId,
          tool_use_id: 'toolu_USE',
        },
      }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(1);
      expect(completes[0]!.parent_seq).toBe(spawnSeq);
    } finally {
      store.close();
    }
  });
});

// ---------------------------------------------------------------------------
// PR-FIN-2a-ii T-2a.8.0 — transcriptSha256 capture-time hash
// ---------------------------------------------------------------------------

describe('runCaptureSubagent — transcriptSha256 capture', () => {
  test('parseable transcript → delegation.complete carries SHA-256 of file bytes', async () => {
    const sessionId = 'cap-sub-sha';
    const { sessionDir } = await initScratchSession(sessionId);
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeParseableTranscript(
      transcriptDir,
      'agent-sha.jsonl',
      'hashed result',
    );

    // Compute the expected hash with the same primitive the production
    // path uses (node:crypto). Reading the file with the same default
    // encoding ensures byte-equivalence regardless of the OS line ending.
    const { createHash } = await import('node:crypto');
    const expected = createHash('sha256')
      .update(readFileSync(transcript))
      .digest('hex');

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-sha',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: sessionId,
        },
      }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const completes = store.byType('delegation.complete');
      expect(completes).toHaveLength(1);
      const data = JSON.parse(completes[0]!.data) as {
        readonly transcriptSha256?: string;
      };
      expect(data.transcriptSha256).toBe(expected);
    } finally {
      store.close();
    }
  });

  test('unparseable transcript → delegation.fail; transcriptSha256 NOT on fail data', async () => {
    // The fail path has no SHA capture by design — only delegation.complete
    // carries the field. Asserts the additive scope: fail events keep their
    // existing shape unchanged.
    const sessionId = 'cap-sub-fail-sha';
    const { sessionDir } = await initScratchSession(sessionId);
    const transcriptDir = mkdtempSync(join(tmpdir(), 'transcripts-'));
    scratchDirs.push(transcriptDir);
    const transcript = writeMalformedTailTranscript(
      transcriptDir,
      'agent-fail.jsonl',
    );

    await captureExit(() =>
      runCaptureSubagentWithOptions([], {
        sessionDir,
        payload: {
          agent_id: 'agent-fail',
          agent_type: 'executor',
          agent_transcript_path: transcript,
          session_id: sessionId,
        },
      }),
    );

    const store = new EventStore(join(sessionDir, 'gobbi.db'));
    try {
      const fails = store.byType('delegation.fail');
      expect(fails).toHaveLength(1);
      const data = JSON.parse(fails[0]!.data) as Record<string, unknown>;
      expect('transcriptSha256' in data).toBe(false);
    } finally {
      store.close();
    }
  });
});
