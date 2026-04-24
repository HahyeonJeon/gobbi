/**
 * Unit + integration tests for the per-step README writer (W5.1).
 *
 * Two layers:
 *
 *   - Pure `generateStepReadme` — frontmatter shape, artifact rendering,
 *     optional-field fallbacks (`null` renderings for missing verdict /
 *     entry time).
 *   - End-to-end STEP_EXIT path via `appendEventAndUpdateState` — the
 *     engine hook fires the writer after the transaction commits, writes
 *     to `<sessionDir>/<step>/README.md`, is idempotent on re-fire, and
 *     does not interfere with non-STEP_EXIT events.
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
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
  asProductiveStepId,
  generateStepReadme,
  type StepReadmeArgs,
  writeStepReadmeForExit,
} from '../step-readme-writer.js';
import { appendEventAndUpdateState } from '../engine.js';
import { EventStore } from '../store.js';
import { initialState, writeState } from '../state.js';
import type { WorkflowState } from '../state.js';
import { WORKFLOW_EVENTS } from '../events/workflow.js';
import type { Event } from '../events/index.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/**
 * Create a tempdir shaped like a real session directory so
 * `projectNameFromSessionDir` can extract the project-name segment from the
 * path. Returns the absolute sessionDir; the caller cleans up the root.
 */
function makeSessionDir(
  rootTmp: string,
  projectName: string,
  sessionId: string,
): string {
  const dir = join(rootTmp, '.gobbi', 'projects', projectName, 'sessions', sessionId);
  mkdirSync(dir, { recursive: true });
  return dir;
}

let rootDir: string;

beforeEach(() => {
  rootDir = mkdtempSync(join(tmpdir(), 'gobbi-step-readme-'));
});

afterEach(() => {
  rmSync(rootDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Pure — asProductiveStepId
// ---------------------------------------------------------------------------

describe('asProductiveStepId', () => {
  it('returns the narrowed StepId for productive steps', () => {
    expect(asProductiveStepId('ideation')).toBe('ideation');
    expect(asProductiveStepId('planning')).toBe('planning');
    expect(asProductiveStepId('execution')).toBe('execution');
    expect(asProductiveStepId('evaluation')).toBe('evaluation');
    expect(asProductiveStepId('memorization')).toBe('memorization');
  });

  it('returns null for non-productive step identifiers', () => {
    expect(asProductiveStepId('idle')).toBeNull();
    expect(asProductiveStepId('ideation_eval')).toBeNull();
    expect(asProductiveStepId('planning_eval')).toBeNull();
    expect(asProductiveStepId('execution_eval')).toBeNull();
    expect(asProductiveStepId('done')).toBeNull();
    expect(asProductiveStepId('error')).toBeNull();
    expect(asProductiveStepId('')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Pure — generateStepReadme
// ---------------------------------------------------------------------------

describe('generateStepReadme', () => {
  const baseArgs: StepReadmeArgs = {
    sessionId: 'sess-001',
    projectName: 'gobbi',
    step: 'ideation',
    enteredAt: '2026-04-20T10:00:00.000Z',
    exitedAt: '2026-04-20T11:30:00.000Z',
    verdictOutcome: 'pass',
    artifacts: ['ideation.md', 'innovative.md'],
    subagentsActiveAtExit: 2,
    feedbackRound: 0,
    nextStep: 'ideation_eval',
  };

  it('emits all required frontmatter fields', () => {
    const md = generateStepReadme(baseArgs);
    expect(md.startsWith('---\n')).toBe(true);
    expect(md).toContain('sessionId: sess-001');
    expect(md).toContain('projectName: gobbi');
    expect(md).toContain('step: ideation');
    expect(md).toContain('enteredAt: 2026-04-20T10:00:00.000Z');
    expect(md).toContain('exitedAt: 2026-04-20T11:30:00.000Z');
    expect(md).toContain('verdictOutcome: pass');
    expect(md).toContain('feedbackRound: 0');
    expect(md).toContain('nextStep: ideation_eval');
    expect(md).toContain('subagentsActiveAtExit: 2');
  });

  it('renders the artifacts list as a YAML sequence', () => {
    const md = generateStepReadme(baseArgs);
    expect(md).toContain('artifacts:\n  - ideation.md\n  - innovative.md');
  });

  it('emits an empty YAML array when no artifacts are recorded', () => {
    const md = generateStepReadme({ ...baseArgs, artifacts: [] });
    expect(md).toContain('artifacts:\n  []');
  });

  it('writes "null" literals when verdict and enteredAt are absent', () => {
    const md = generateStepReadme({
      ...baseArgs,
      verdictOutcome: null,
      enteredAt: null,
    });
    expect(md).toContain('verdictOutcome: null');
    expect(md).toContain('enteredAt: null');
  });

  it('includes an auto-generated body with the step heading and next-step note', () => {
    const md = generateStepReadme(baseArgs);
    expect(md).toContain('# Ideation — session sess-001');
    expect(md).toContain('auto-generated at `workflow.step.exit`');
    expect(md).toContain('Next step: `ideation_eval`');
  });

  it('closes the frontmatter before the body', () => {
    const md = generateStepReadme(baseArgs);
    const firstFence = md.indexOf('---\n');
    const secondFence = md.indexOf('---\n', firstFence + 4);
    expect(firstFence).toBe(0);
    expect(secondFence).toBeGreaterThan(0);
    // Body lives after the closing fence.
    expect(md.slice(secondFence + 4)).toContain('# Ideation');
  });
});

// ---------------------------------------------------------------------------
// writeStepReadmeForExit — direct unit
// ---------------------------------------------------------------------------

describe('writeStepReadmeForExit', () => {
  it('writes README.md inside <sessionDir>/<step>/ and returns the path', () => {
    const sessionDir = makeSessionDir(rootDir, 'gobbi', 'sess-write');
    const prev: WorkflowState = {
      ...initialState('sess-write'),
      currentStep: 'ideation',
      stepStartedAt: '2026-04-20T10:00:00.000Z',
      artifacts: { ideation: ['ideation.md'] },
      lastVerdictOutcome: 'pass',
    };
    const next: WorkflowState = {
      ...prev,
      currentStep: 'ideation_eval',
      completedSteps: ['ideation'],
      lastVerdictOutcome: null,
    };

    const filePath = writeStepReadmeForExit({
      sessionDir,
      prevState: prev,
      nextState: next,
      exitedStep: 'ideation',
      exitedAt: '2026-04-20T11:30:00.000Z',
    });

    expect(filePath).toBe(join(sessionDir, 'ideation', 'README.md'));
    expect(filePath).not.toBeNull();
    const contents = readFileSync(filePath as string, 'utf8');
    expect(contents).toContain('step: ideation');
    expect(contents).toContain('projectName: gobbi');
    expect(contents).toContain('artifacts:\n  - ideation.md');
    expect(contents).toContain('verdictOutcome: pass');
    expect(contents).toContain('nextStep: ideation_eval');
  });

  it('returns null without writing when the exited step is non-productive', () => {
    const sessionDir = makeSessionDir(rootDir, 'gobbi', 'sess-skip');
    const prev: WorkflowState = {
      ...initialState('sess-skip'),
      currentStep: 'ideation_eval',
    };
    const next = prev;

    const result = writeStepReadmeForExit({
      sessionDir,
      prevState: prev,
      nextState: next,
      exitedStep: 'ideation_eval',
      exitedAt: '2026-04-20T12:00:00.000Z',
    });

    expect(result).toBeNull();
    expect(existsSync(join(sessionDir, 'ideation_eval'))).toBe(false);
  });

  it('overwrites an existing README on a second call (idempotency)', () => {
    const sessionDir = makeSessionDir(rootDir, 'gobbi', 'sess-idem');
    const prev: WorkflowState = {
      ...initialState('sess-idem'),
      currentStep: 'planning',
      stepStartedAt: '2026-04-20T10:00:00.000Z',
      artifacts: { planning: ['plan.md'] },
    };
    const next: WorkflowState = { ...prev, currentStep: 'planning_eval' };

    const first = writeStepReadmeForExit({
      sessionDir,
      prevState: prev,
      nextState: next,
      exitedStep: 'planning',
      exitedAt: '2026-04-20T11:00:00.000Z',
    });
    expect(first).not.toBeNull();
    const before = readFileSync(first as string, 'utf8');

    // Second call with a later exitedAt and updated artifacts.
    const prev2: WorkflowState = {
      ...prev,
      artifacts: { planning: ['plan.md', 'plan-r1.md'] },
    };
    const second = writeStepReadmeForExit({
      sessionDir,
      prevState: prev2,
      nextState: next,
      exitedStep: 'planning',
      exitedAt: '2026-04-20T12:00:00.000Z',
    });
    expect(second).toBe(first);
    const after = readFileSync(second as string, 'utf8');

    expect(after).not.toBe(before);
    expect(after).toContain('exitedAt: 2026-04-20T12:00:00.000Z');
    expect(after).toContain('- plan-r1.md');
    // No doubling from append — the file should contain exactly two YAML fences.
    const fenceCount = after.split('\n').filter((line) => line === '---').length;
    expect(fenceCount).toBe(2);
  });

  it('falls back to projectName "gobbi" when sessionDir does not match the expected layout', () => {
    // Plain tempdir — no `projects/<name>/sessions/<id>` tail.
    const sessionDir = join(rootDir, 'plain-session');
    mkdirSync(sessionDir, { recursive: true });
    const prev: WorkflowState = {
      ...initialState('plain'),
      currentStep: 'memorization',
      stepStartedAt: '2026-04-20T10:00:00.000Z',
    };
    const next: WorkflowState = { ...prev, currentStep: 'done' };

    const filePath = writeStepReadmeForExit({
      sessionDir,
      prevState: prev,
      nextState: next,
      exitedStep: 'memorization',
      exitedAt: '2026-04-20T11:00:00.000Z',
    });
    expect(filePath).not.toBeNull();
    const contents = readFileSync(filePath as string, 'utf8');
    expect(contents).toContain('projectName: gobbi');
  });
});

// ---------------------------------------------------------------------------
// Engine integration — appendEventAndUpdateState fires the writer
// ---------------------------------------------------------------------------

describe('engine STEP_EXIT hook', () => {
  function seedIdeationState(sessionDir: string, sessionId: string): WorkflowState {
    // Seed a state.json in the `ideation` productive step so STEP_EXIT is
    // a valid transition. Callers drive the exit via the engine.
    const state: WorkflowState = {
      ...initialState(sessionId),
      currentStep: 'ideation',
      currentSubstate: 'discussing',
      stepStartedAt: '2026-04-20T09:00:00.000Z',
      artifacts: { ideation: ['ideation.md'] },
    };
    writeState(sessionDir, state);
    return state;
  }

  it('writes the per-step README when STEP_EXIT commits for a productive step', () => {
    const sessionId = 'engine-exit-productive';
    const sessionDir = makeSessionDir(rootDir, 'gobbi', sessionId);
    const prev = seedIdeationState(sessionDir, sessionId);

    using store = new EventStore(join(sessionDir, 'gobbi.db'));
    const stepExit: Event = {
      type: WORKFLOW_EVENTS.STEP_EXIT,
      data: { step: 'ideation' },
    };
    const result = appendEventAndUpdateState(
      store,
      sessionDir,
      prev,
      stepExit,
      'cli',
      sessionId,
      'tool-call',
      'tc-exit-1',
      null,
      undefined,
      '2026-04-20T10:30:00.000Z',
    );

    expect(result.persisted).toBe(true);
    const readmePath = join(sessionDir, 'ideation', 'README.md');
    expect(existsSync(readmePath)).toBe(true);
    const contents = readFileSync(readmePath, 'utf8');
    expect(contents).toContain('step: ideation');
    expect(contents).toContain('exitedAt: 2026-04-20T10:30:00.000Z');
    expect(contents).toContain(`sessionId: ${sessionId}`);
    expect(contents).toContain('artifacts:\n  - ideation.md');
    // nextStep comes from the post-reduction state.
    expect(contents).toContain(`nextStep: ${result.state.currentStep}`);
  });

  it('second STEP_EXIT for the same step overwrites the README cleanly', () => {
    // The reducer only allows STEP_EXIT from the current step, so to exercise
    // the idempotency path we round-trip through the writer once via the
    // engine hook, then directly invoke the writer again with updated args.
    // This mirrors how a feedback-loop rewind would re-populate the README
    // after a second exit.
    const sessionId = 'engine-exit-idem';
    const sessionDir = makeSessionDir(rootDir, 'gobbi', sessionId);
    const prev = seedIdeationState(sessionDir, sessionId);

    using store = new EventStore(join(sessionDir, 'gobbi.db'));
    const stepExit: Event = {
      type: WORKFLOW_EVENTS.STEP_EXIT,
      data: { step: 'ideation' },
    };
    const result = appendEventAndUpdateState(
      store,
      sessionDir,
      prev,
      stepExit,
      'cli',
      sessionId,
      'tool-call',
      'tc-exit-2',
      null,
      undefined,
      '2026-04-20T10:30:00.000Z',
    );

    const readmePath = join(sessionDir, 'ideation', 'README.md');
    const firstContents = readFileSync(readmePath, 'utf8');

    // Simulate a second exit firing the writer with a later timestamp.
    writeStepReadmeForExit({
      sessionDir,
      prevState: { ...prev, artifacts: { ideation: ['ideation.md', 'ideation-r1.md'] } },
      nextState: result.state,
      exitedStep: 'ideation',
      exitedAt: '2026-04-20T12:00:00.000Z',
    });
    const secondContents = readFileSync(readmePath, 'utf8');

    expect(secondContents).not.toBe(firstContents);
    expect(secondContents).toContain('exitedAt: 2026-04-20T12:00:00.000Z');
    expect(secondContents).toContain('- ideation-r1.md');
    // Single frontmatter block — no duplicate YAML fences from accidental append.
    const fenceCount = secondContents.split('\n').filter((line) => line === '---').length;
    expect(fenceCount).toBe(2);
  });

  it('does NOT write a README for non-STEP_EXIT events', () => {
    const sessionId = 'engine-non-exit';
    const sessionDir = makeSessionDir(rootDir, 'gobbi', sessionId);
    // Fresh state → WORKFLOW.START is a valid transition.
    using store = new EventStore(join(sessionDir, 'gobbi.db'));
    const start: Event = {
      type: WORKFLOW_EVENTS.START,
      data: { sessionId, timestamp: '2026-04-20T09:00:00.000Z' },
    };
    const result = appendEventAndUpdateState(
      store,
      sessionDir,
      initialState(sessionId),
      start,
      'cli',
      sessionId,
      'tool-call',
      'tc-start',
    );

    expect(result.persisted).toBe(true);
    // No productive step directory should materialise as a side effect of
    // WORKFLOW.START — only STEP_EXIT triggers the README writer.
    expect(existsSync(join(sessionDir, 'ideation', 'README.md'))).toBe(false);
  });

  it('does NOT write a README when STEP_EXIT is deduplicated (persisted: false)', () => {
    const sessionId = 'engine-exit-dedup';
    const sessionDir = makeSessionDir(rootDir, 'gobbi', sessionId);
    const prev = seedIdeationState(sessionDir, sessionId);

    using store = new EventStore(join(sessionDir, 'gobbi.db'));
    const stepExit: Event = {
      type: WORKFLOW_EVENTS.STEP_EXIT,
      data: { step: 'ideation' },
    };

    // First call commits + writes README.
    appendEventAndUpdateState(
      store,
      sessionDir,
      prev,
      stepExit,
      'cli',
      sessionId,
      'tool-call',
      'tc-exit-dedup',
      null,
      undefined,
      '2026-04-20T10:30:00.000Z',
    );
    const readmePath = join(sessionDir, 'ideation', 'README.md');
    expect(existsSync(readmePath)).toBe(true);
    const firstContents = readFileSync(readmePath, 'utf8');

    // Rewrite the README to a sentinel so a second writer call would be
    // observable by content change.
    const sentinel = '# sentinel — should not be overwritten';
    writeFileSync(readmePath, sentinel, 'utf8');

    // Replay the SAME event with the same tool-call-id — the store dedupes,
    // the engine returns persisted: false, and the writer must not fire.
    appendEventAndUpdateState(
      store,
      sessionDir,
      prev,
      stepExit,
      'cli',
      sessionId,
      'tool-call',
      'tc-exit-dedup',
      null,
      undefined,
      '2026-04-20T10:30:00.000Z',
    );

    expect(readFileSync(readmePath, 'utf8')).toBe(sentinel);
    // Keep the firstContents reference live — the test is about dedup, not
    // round-trip equality.
    expect(firstContents).toContain('step: ideation');
  });
});
