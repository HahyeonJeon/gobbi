/**
 * Tests for the memorization-step `session.json` writer (T-2a.8.2).
 *
 * Two layers:
 *
 *   - Direct invocation of `writeSessionJsonAtMemorizationExit` against a
 *     synthetic session directory + seeded event store — asserts that the
 *     stub's 6 carry-forward fields propagate verbatim, `steps[]`
 *     materialises, and `project.json.sessions[]` gets the upsert row.
 *   - Engine-integration via `appendEventAndUpdateState` — fires only on
 *     `workflow.step.exit` for `step === 'memorization'`, never for
 *     ideation/planning/execution exits, and survives a writer-level error
 *     without corrupting the event store.
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  spyOn,
} from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  projectJsonPath,
  readProjectJson,
  readSessionJson,
  sessionJsonPath,
  writeSessionStub,
} from '../../lib/json-memory.js';
import { appendEventAndUpdateState } from '../engine.js';
import { writeSessionJsonAtMemorizationExit } from '../session-json-writer.js';
import { EventStore } from '../store.js';
import { initialState, writeState } from '../state.js';
import type { WorkflowState } from '../state.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import type { Event } from '../events/index.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

let rootDir: string;

beforeEach(() => {
  rootDir = mkdtempSync(join(tmpdir(), 'gobbi-session-json-writer-'));
});

afterEach(() => {
  rmSync(rootDir, { recursive: true, force: true });
});

interface SessionFixture {
  readonly repoRoot: string;
  readonly projectName: string;
  readonly sessionId: string;
  readonly sessionDir: string;
}

/**
 * Materialise a session directory at the canonical layout
 * `<repoRoot>/.gobbi/projects/<projectName>/sessions/<sessionId>` and
 * write the init-time stub via the production helper.
 */
function makeSession(
  projectName: string,
  sessionId: string,
  task = 'fixture task',
): SessionFixture {
  const repoRoot = rootDir;
  const sessionDir = join(
    repoRoot,
    '.gobbi',
    'projects',
    projectName,
    'sessions',
    sessionId,
  );
  mkdirSync(sessionDir, { recursive: true });
  writeSessionStub({
    repoRoot,
    projectName,
    sessionId,
    task,
    gobbiVersion: '0.0.0-test',
    createdAt: '2026-04-29T00:00:00.000Z',
  });
  return { repoRoot, projectName, sessionId, sessionDir };
}

/**
 * Drive a session into `memorization` by stamping `state.json` directly so
 * the engine accepts a STEP_EXIT for that step in a single append. Avoids
 * threading the workflow through every intermediate step in the test.
 */
function seedMemorizationState(
  fixture: SessionFixture,
): WorkflowState {
  const state: WorkflowState = {
    ...initialState(fixture.sessionId),
    currentStep: 'memorization',
    stepStartedAt: '2026-04-29T00:30:00.000Z',
  };
  writeState(fixture.sessionDir, state);
  return state;
}

// ---------------------------------------------------------------------------
// Direct invocation — writer reads stub, materialises full shape
// ---------------------------------------------------------------------------

describe('writeSessionJsonAtMemorizationExit — direct', () => {
  it('replaces the stub with a populated session.json carrying steps[]', async () => {
    const fixture = makeSession('proj-direct', 'sess-direct', 'direct test');
    const dbPath = join(fixture.sessionDir, 'gobbi.db');
    using store = new EventStore(dbPath);

    const filePath = await writeSessionJsonAtMemorizationExit({
      sessionDir: fixture.sessionDir,
      store,
    });

    expect(filePath).toBe(
      sessionJsonPath(fixture.repoRoot, fixture.projectName, fixture.sessionId),
    );
    const written = readSessionJson(filePath!);
    expect(written).not.toBeNull();
    expect(written!.schemaVersion).toBe(1);
    expect(written!.sessionId).toBe(fixture.sessionId);
    expect(written!.projectId).toBe(fixture.projectName);
    expect(written!.createdAt).toBe('2026-04-29T00:00:00.000Z');
    expect(written!.gobbiVersion).toBe('0.0.0-test');
    expect(written!.task).toBe('direct test');
    // No workflow.finish landed → finishedAt stays null at memorization-time.
    expect(written!.finishedAt).toBeNull();
    // steps[] is the discriminator between stub and complete shape.
    expect(Array.isArray(written!.steps)).toBe(true);
  });

  it('upserts the matching row into project.json.sessions[]', async () => {
    const fixture = makeSession('proj-upsert', 'sess-upsert');
    const dbPath = join(fixture.sessionDir, 'gobbi.db');
    using store = new EventStore(dbPath);

    await writeSessionJsonAtMemorizationExit({
      sessionDir: fixture.sessionDir,
      store,
    });

    const projectFile = projectJsonPath(fixture.repoRoot, fixture.projectName);
    const project = readProjectJson(projectFile);
    expect(project).not.toBeNull();
    expect(project!.sessions).toHaveLength(1);
    const session = project!.sessions[0]!;
    expect(session.sessionId).toBe(fixture.sessionId);
    expect(session.createdAt).toBe('2026-04-29T00:00:00.000Z');
    expect(session.task).toBe('fixture task');
    expect(session.finishedAt).toBeNull();
  });

  it('returns null when the session.json stub is absent', async () => {
    // Make a session dir but DO NOT call writeSessionStub — the writer must
    // fall through cleanly rather than fabricate the stub from thin air.
    const repoRoot = rootDir;
    const sessionDir = join(
      repoRoot,
      '.gobbi',
      'projects',
      'proj-no-stub',
      'sessions',
      'sess-no-stub',
    );
    mkdirSync(sessionDir, { recursive: true });
    using store = new EventStore(join(sessionDir, 'gobbi.db'));

    const result = await writeSessionJsonAtMemorizationExit({
      sessionDir,
      store,
    });

    expect(result).toBeNull();
    // No file should have been created.
    const expected = sessionJsonPath(
      repoRoot,
      'proj-no-stub',
      'sess-no-stub',
    );
    expect(existsSync(expected)).toBe(false);
  });

  it('honours an explicit finishedAt override', async () => {
    const fixture = makeSession('proj-finished', 'sess-finished');
    const dbPath = join(fixture.sessionDir, 'gobbi.db');
    using store = new EventStore(dbPath);

    const finishedAt = '2026-04-29T01:00:00.000Z';
    await writeSessionJsonAtMemorizationExit({
      sessionDir: fixture.sessionDir,
      store,
      finishedAt,
    });

    const written = readSessionJson(
      sessionJsonPath(fixture.repoRoot, fixture.projectName, fixture.sessionId),
    );
    expect(written!.finishedAt).toBe(finishedAt);

    const project = readProjectJson(
      projectJsonPath(fixture.repoRoot, fixture.projectName),
    );
    expect(project!.sessions[0]!.finishedAt).toBe(finishedAt);
  });
});

// ---------------------------------------------------------------------------
// Engine integration — STEP_EXIT memorization fires the writer
// ---------------------------------------------------------------------------

describe('engine memorization STEP_EXIT dispatch', () => {
  it('fires the writer when STEP_EXIT commits with step === "memorization"', async () => {
    const fixture = makeSession('proj-engine-mem', 'sess-engine-mem', 'engine memorization');
    const prev = seedMemorizationState(fixture);

    using store = new EventStore(join(fixture.sessionDir, 'gobbi.db'));
    const stepExit: Event = {
      type: WORKFLOW_EVENTS.STEP_EXIT,
      data: { step: 'memorization' },
    };
    const result = await appendEventAndUpdateState(
      store,
      fixture.sessionDir,
      prev,
      stepExit,
      'cli',
      fixture.sessionId,
      'tool-call',
      'tc-mem-exit',
      null,
      undefined,
      '2026-04-29T01:00:00.000Z',
    );

    expect(result.persisted).toBe(true);
    const filePath = sessionJsonPath(
      fixture.repoRoot,
      fixture.projectName,
      fixture.sessionId,
    );
    const written = readSessionJson(filePath);
    expect(written).not.toBeNull();
    expect(Array.isArray(written!.steps)).toBe(true);
    // project.json upsert ran too.
    const project = readProjectJson(
      projectJsonPath(fixture.repoRoot, fixture.projectName),
    );
    expect(project!.sessions.map((s) => s.sessionId)).toContain(
      fixture.sessionId,
    );
  });

  it('does NOT fire the writer when STEP_EXIT commits with step !== "memorization"', async () => {
    const fixture = makeSession('proj-engine-non-mem', 'sess-engine-non-mem');
    // Seed a state where ideation can validly exit.
    const prev: WorkflowState = {
      ...initialState(fixture.sessionId),
      currentStep: 'ideation',
      stepStartedAt: '2026-04-29T00:00:30.000Z',
    };
    writeState(fixture.sessionDir, prev);

    using store = new EventStore(join(fixture.sessionDir, 'gobbi.db'));
    const stepExit: Event = {
      type: WORKFLOW_EVENTS.STEP_EXIT,
      data: { step: 'ideation' },
    };
    await appendEventAndUpdateState(
      store,
      fixture.sessionDir,
      prev,
      stepExit,
      'cli',
      fixture.sessionId,
      'tool-call',
      'tc-ide-exit',
      null,
      undefined,
      '2026-04-29T00:45:00.000Z',
    );

    // session.json should still be the stub — no `steps[]`.
    const filePath = sessionJsonPath(
      fixture.repoRoot,
      fixture.projectName,
      fixture.sessionId,
    );
    const written = readSessionJson(filePath);
    expect(written).not.toBeNull();
    expect(written!.steps).toBeUndefined();

    // No project.json should have been created — the upsert never ran.
    const projectFile = projectJsonPath(
      fixture.repoRoot,
      fixture.projectName,
    );
    expect(existsSync(projectFile)).toBe(false);
  });

  it('does NOT fire the writer for non-STEP_EXIT events', async () => {
    const fixture = makeSession('proj-non-exit', 'sess-non-exit');
    using store = new EventStore(join(fixture.sessionDir, 'gobbi.db'));

    const start: Event = {
      type: WORKFLOW_EVENTS.START,
      data: {
        sessionId: fixture.sessionId,
        timestamp: '2026-04-29T00:00:01.000Z',
      },
    };
    await appendEventAndUpdateState(
      store,
      fixture.sessionDir,
      initialState(fixture.sessionId),
      start,
      'cli',
      fixture.sessionId,
      'tool-call',
      'tc-start',
    );

    // Stub still in place; no project.json created.
    const written = readSessionJson(
      sessionJsonPath(fixture.repoRoot, fixture.projectName, fixture.sessionId),
    );
    expect(written!.steps).toBeUndefined();
    expect(
      existsSync(projectJsonPath(fixture.repoRoot, fixture.projectName)),
    ).toBe(false);
  });

  it('writer failure does NOT corrupt the event store', async () => {
    const fixture = makeSession('proj-writer-fail', 'sess-writer-fail');
    const prev = seedMemorizationState(fixture);

    using store = new EventStore(join(fixture.sessionDir, 'gobbi.db'));

    // Force the project.json upsert to fail by corrupting the file path with
    // a directory in place of where the upsert wants to write. We can't
    // easily intercept the writer's internals without a spy, so instead we
    // pre-create `project.json` as a directory so the atomic
    // temp+rename inside `writeProjectJson` raises EISDIR on rename.
    const projectFile = projectJsonPath(
      fixture.repoRoot,
      fixture.projectName,
    );
    mkdirSync(projectFile, { recursive: true });

    // Suppress the expected stderr line from the engine's catch block.
    const stderrSpy = spyOn(process.stderr, 'write').mockImplementation(
      () => true,
    );
    try {
      const stepExit: Event = {
        type: WORKFLOW_EVENTS.STEP_EXIT,
        data: { step: 'memorization' },
      };
      const result = await appendEventAndUpdateState(
        store,
        fixture.sessionDir,
        prev,
        stepExit,
        'cli',
        fixture.sessionId,
        'tool-call',
        'tc-mem-fail',
        null,
        undefined,
        '2026-04-29T01:00:00.000Z',
      );

      // Event store has the STEP_EXIT row — the failure was post-commit.
      expect(result.persisted).toBe(true);
      const exits = store.byType(WORKFLOW_EVENTS.STEP_EXIT);
      expect(exits).toHaveLength(1);

      // Engine logged the failure without re-throwing.
      const stderrCalls = stderrSpy.mock.calls.flat().join('\n');
      expect(stderrCalls).toContain('session.json memorization write failed');
    } finally {
      stderrSpy.mockRestore();
    }
  });
});
