/**
 * Unit tests for `gobbi note collect` — focused on the path-doubling
 * regression in issue #132.
 *
 * Coverage:
 *   - Main-transcript layout (canonical case): when `CLAUDE_TRANSCRIPT_PATH`
 *     points at the per-session main transcript
 *     (`<projects-root>/<slug>/<session>.jsonl`), the subagent directory is
 *     resolved by joining the dirname with `<sessionId>/subagents` — the
 *     pre-fix behaviour, asserted as a non-regression.
 *   - Subagent-transcript layout (issue #132): when `CLAUDE_TRANSCRIPT_PATH`
 *     already lives inside `<projects-root>/<slug>/<session>/subagents/`,
 *     the resolver must NOT re-append `<sessionId>/subagents` — naive
 *     concatenation produced a doubled path
 *     (`.../<session>/subagents/<session>/subagents/agent-X.meta.json`)
 *     and the meta-file lookup failed.
 *
 * Both tests synthesise the on-disk layout under a scratch directory, write
 * a minimal subagent meta + JSONL pair, run `runNote(['collect', ...])`,
 * and assert the output JSON lands under the note-dir's
 * `<phase>/subtasks/` directory. The doubled-path bug previously surfaced
 * as `Error: Meta file not found: …` and a non-zero exit; the fix turns
 * both branches into a successful collection.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runNote } from '../note.js';

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
let origEnv: NodeJS.ProcessEnv;

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origExit = process.exit;
  origEnv = { ...process.env };

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
  // Reset env to the pre-test snapshot — every test sets CLAUDE_*
  // variables, and leaving them set leaks across tests in the same file.
  for (const key of Object.keys(process.env)) {
    if (!(key in origEnv)) delete process.env[key];
  }
  for (const key of Object.keys(origEnv)) {
    process.env[key] = origEnv[key];
  }
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
// Scratch directory bookkeeping
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

function makeScratchRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-note-collect-'));
  scratchDirs.push(dir);
  return dir;
}

// ---------------------------------------------------------------------------
// Fixture builder
// ---------------------------------------------------------------------------

interface CollectFixture {
  /** Root dir under which the canonical transcripts layout lives. */
  readonly transcriptsRoot: string;
  /** Per-session subagent dir holding the meta + jsonl files. */
  readonly subagentDir: string;
  /** Note dir whose `execution/subtasks/` is the collect target. */
  readonly noteDir: string;
  /** Subtasks directory the collect output must land in. */
  readonly subtasksDir: string;
  /** Agent id used in the meta + jsonl file basenames. */
  readonly agentId: string;
  /** Session id wired into env + path structure. */
  readonly sessionId: string;
}

/**
 * Build the on-disk layout that mirrors the real Claude Code transcripts
 * directory:
 *
 *   <root>/projects/<slug>/<session-id>.jsonl                      (main)
 *   <root>/projects/<slug>/<session-id>/subagents/agent-<id>.meta.json
 *   <root>/projects/<slug>/<session-id>/subagents/agent-<id>.jsonl
 *
 * Plus a parallel note-dir tree
 *   <root>/notes/<datetime>-<slug>-<session>/execution/subtasks/
 * which `runNoteCollect` writes the result file into.
 *
 * Both transcripts paths are returned so each test can wire
 * `CLAUDE_TRANSCRIPT_PATH` to the variant it exercises (main vs subagent).
 */
function buildFixture(): CollectFixture {
  const root = makeScratchRoot();
  const sessionId = 'sess-fixture-1234';
  const projectSlug = '-tmp-test-project';
  const agentId = 'agent42';

  // Transcripts tree
  const transcriptsRoot = join(root, 'projects', projectSlug);
  const subagentDir = join(transcriptsRoot, sessionId, 'subagents');
  mkdirSync(subagentDir, { recursive: true });

  // Main transcript file (path used in the canonical case)
  const mainTranscript = join(transcriptsRoot, `${sessionId}.jsonl`);
  writeFileSync(
    mainTranscript,
    `${JSON.stringify({ type: 'summary', sessionId })}\n`,
    'utf8',
  );

  // Subagent meta + jsonl
  const metaFile = join(subagentDir, `agent-${agentId}.meta.json`);
  const jsonlFile = join(subagentDir, `agent-${agentId}.jsonl`);
  writeFileSync(
    metaFile,
    JSON.stringify({
      agentType: 'gobbi:test-agent',
      description: 'Issue #132 fixture subagent',
    }) + '\n',
    'utf8',
  );
  // First line: user prompt (delegationPrompt source).
  // Last line: assistant final message (finalResult source).
  const firstLine = JSON.stringify({
    type: 'user',
    timestamp: '2026-04-25T00:00:00Z',
    message: { role: 'user', content: 'Fix the path-doubling bug.' },
  });
  const lastLine = JSON.stringify({
    type: 'assistant',
    message: {
      role: 'assistant',
      model: 'claude-opus-4-7',
      content: [{ type: 'text', text: 'Fix landed and tests pass.' }],
    },
  });
  writeFileSync(jsonlFile, `${firstLine}\n${lastLine}\n`, 'utf8');

  // Note dir tree
  const noteDirName = `20260425-0000-issue-132-fixture-${sessionId}`;
  const noteDir = join(root, 'notes', noteDirName);
  const subtasksDir = join(noteDir, 'execution', 'subtasks');
  mkdirSync(subtasksDir, { recursive: true });

  return {
    transcriptsRoot,
    subagentDir,
    noteDir,
    subtasksDir,
    agentId,
    sessionId,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('gobbi note collect — legacy plan/subtasks fallback removed (PR-FIN-5)', () => {
  test('--phase planning resolves to <noteDir>/planning/subtasks (v0.5.0 schema, no legacy fallback)', async () => {
    const fx = buildFixture();
    const mainTranscript = join(fx.transcriptsRoot, `${fx.sessionId}.jsonl`);

    // The fixture builder creates execution/subtasks/ — add planning/subtasks/
    // alongside so --phase planning has a valid v0.5.0 target.
    const planningSubtasks = join(fx.noteDir, 'planning', 'subtasks');
    mkdirSync(planningSubtasks, { recursive: true });

    process.env['CLAUDE_SESSION_ID'] = fx.sessionId;
    process.env['CLAUDE_TRANSCRIPT_PATH'] = mainTranscript;

    await captureExit(() =>
      runNote([
        'collect',
        fx.agentId,
        '03',
        'planning-resolves-new-shape',
        fx.noteDir,
        '--phase',
        'planning',
      ]),
    );

    expect(captured.stderr).toBe('');
    // Output MUST land under planning/subtasks/, not legacy plan/subtasks/.
    const expected = join(planningSubtasks, '03-planning-resolves-new-shape.json');
    const written = JSON.parse(readFileSync(expected, 'utf8')) as {
      readonly sessionId: string;
    };
    expect(written.sessionId).toBe(fx.sessionId);
  });

  test('--phase planning with only legacy plan/subtasks/ on disk fails with subtasks-not-found (no legacy fallback)', async () => {
    const fx = buildFixture();
    const mainTranscript = join(fx.transcriptsRoot, `${fx.sessionId}.jsonl`);

    // Construct a pre-W4-style note dir: only legacy plan/subtasks/ exists,
    // no planning/subtasks/. Pre-PR-FIN-5 the resolver fell back to plan/;
    // post-removal it must error out cleanly.
    const legacyPlanSubtasks = join(fx.noteDir, 'plan', 'subtasks');
    mkdirSync(legacyPlanSubtasks, { recursive: true });

    process.env['CLAUDE_SESSION_ID'] = fx.sessionId;
    process.env['CLAUDE_TRANSCRIPT_PATH'] = mainTranscript;

    await captureExit(() =>
      runNote([
        'collect',
        fx.agentId,
        '04',
        'no-legacy-fallback',
        fx.noteDir,
        '--phase',
        'planning',
      ]),
    );

    // Must exit non-zero — pre-PR-FIN-5 the resolver fell back to legacy
    // plan/subtasks/ and the collect succeeded; post-removal it must error.
    expect(captured.exitCode).toBe(1);
    // Must NOT silently route into legacy plan/subtasks/ — assert no
    // file was written into the legacy directory.
    const legacyOutput = join(legacyPlanSubtasks, '04-no-legacy-fallback.json');
    expect(() => readFileSync(legacyOutput, 'utf8')).toThrow();
    // And no file landed in a planning/subtasks/ either (we never created it).
    const newShapeOutput = join(fx.noteDir, 'planning', 'subtasks', '04-no-legacy-fallback.json');
    expect(() => readFileSync(newShapeOutput, 'utf8')).toThrow();
  });
});

describe('gobbi note collect — CLAUDE_TRANSCRIPT_PATH path resolution', () => {
  test('main-transcript layout: derives <transcriptDir>/<session>/subagents and collects', async () => {
    const fx = buildFixture();
    const mainTranscript = join(fx.transcriptsRoot, `${fx.sessionId}.jsonl`);

    process.env['CLAUDE_SESSION_ID'] = fx.sessionId;
    process.env['CLAUDE_TRANSCRIPT_PATH'] = mainTranscript;

    await captureExit(() =>
      runNote([
        'collect',
        fx.agentId,
        '01',
        'wave-fixture',
        fx.noteDir,
        '--phase',
        'execution',
      ]),
    );

    // Successful collect: exit 0 (or null — runNoteCollect does not call
    // process.exit on success), no error message, output file present.
    expect(captured.stderr).toBe('');
    const outputFile = join(fx.subtasksDir, '01-wave-fixture.json');
    const written = JSON.parse(readFileSync(outputFile, 'utf8')) as {
      readonly sessionId: string;
      readonly agentId: string;
      readonly agentType: string;
      readonly delegationPrompt: string;
      readonly finalResult: string;
    };
    expect(written.sessionId).toBe(fx.sessionId);
    expect(written.agentId).toBe(fx.agentId);
    expect(written.agentType).toBe('gobbi:test-agent');
    expect(written.delegationPrompt).toBe('Fix the path-doubling bug.');
    expect(written.finalResult).toBe('Fix landed and tests pass.');
  });

  test('subagent-transcript layout: idempotent — does NOT double-append <session>/subagents (issue #132)', async () => {
    const fx = buildFixture();
    // CLAUDE_TRANSCRIPT_PATH points at a subagent transcript that already
    // lives inside `<session>/subagents/`. The pre-fix code computed
    // dirname → `.../<session>/subagents` and joined `<session>/subagents`
    // again, yielding a doubled path and a "Meta file not found" error.
    const subagentTranscript = join(fx.subagentDir, `agent-${fx.agentId}.jsonl`);

    process.env['CLAUDE_SESSION_ID'] = fx.sessionId;
    process.env['CLAUDE_TRANSCRIPT_PATH'] = subagentTranscript;

    await captureExit(() =>
      runNote([
        'collect',
        fx.agentId,
        '02',
        'wave-fixture-subagent-env',
        fx.noteDir,
        '--phase',
        'execution',
      ]),
    );

    // The bug surfaced as a non-empty stderr with "Meta file not found"
    // and a doubled path. The fix yields a clean collect.
    expect(captured.stderr).not.toContain('Meta file not found');
    expect(captured.stderr).not.toContain(`${fx.sessionId}/subagents/${fx.sessionId}/subagents`);
    expect(captured.stderr).toBe('');

    const outputFile = join(fx.subtasksDir, '02-wave-fixture-subagent-env.json');
    const written = JSON.parse(readFileSync(outputFile, 'utf8')) as {
      readonly sessionId: string;
      readonly agentId: string;
      readonly finalResult: string;
    };
    expect(written.sessionId).toBe(fx.sessionId);
    expect(written.agentId).toBe(fx.agentId);
    expect(written.finalResult).toBe('Fix landed and tests pass.');
  });
});
