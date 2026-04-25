/**
 * Tests for the state-based `findStateActiveSessions` helper.
 *
 * Covers:
 *   - Missing `.gobbi/` tree → empty result.
 *   - Legacy flat layout: terminal `'done'` / `'error'` skipped; any other
 *     value (including post-rename `'planning'` and pre-rename `'plan'`)
 *     returned as active.
 *   - Missing `state.json` → active (protect by default).
 *   - Malformed JSON → active.
 *   - JSON with non-string `currentStep` → active.
 *   - Dual-layer scan: legacy + per-project layers both enumerated; the
 *     `projectName` field distinguishes them.
 *   - Per-project terminal sessions are skipped independently of legacy ones.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  findStateActiveSessions,
  readCurrentStepRaw,
  TERMINAL_CURRENT_STEPS,
  type StateActiveSession,
} from '../active-sessions.js';

// ---------------------------------------------------------------------------
// Scratch dir helpers
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

function makeRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-active-sessions-'));
  scratchDirs.push(dir);
  return dir;
}

/**
 * Create a legacy-layout session with the supplied `state.json` body.
 * `body === null` skips creating the file (tests the missing-state case).
 * `body === 'INVALID'` writes non-JSON garbage (tests the malformed case).
 * Any other string is written verbatim.
 */
function seedLegacySession(
  repo: string,
  sessionId: string,
  stateContent: string | null,
): string {
  const dir = join(repo, '.gobbi', 'sessions', sessionId);
  mkdirSync(dir, { recursive: true });
  if (stateContent !== null) {
    writeFileSync(join(dir, 'state.json'), stateContent, 'utf8');
  }
  return dir;
}

/** Convenience: write a well-formed state.json for a given `currentStep`. */
function seedLegacySessionWithStep(
  repo: string,
  sessionId: string,
  currentStep: string,
): string {
  return seedLegacySession(
    repo,
    sessionId,
    JSON.stringify({
      schemaVersion: 4,
      sessionId,
      currentStep,
      currentSubstate: null,
      completedSteps: [],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
    }),
  );
}

/** Create a per-project session under `.gobbi/projects/<name>/sessions/<id>/`. */
function seedProjectSession(
  repo: string,
  projectName: string,
  sessionId: string,
  currentStep: string,
): string {
  const dir = join(
    repo,
    '.gobbi',
    'projects',
    projectName,
    'sessions',
    sessionId,
  );
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'state.json'),
    JSON.stringify({
      schemaVersion: 4,
      sessionId,
      currentStep,
      currentSubstate: null,
      completedSteps: [],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
    }),
    'utf8',
  );
  return dir;
}

function bySessionId(
  a: StateActiveSession,
  b: StateActiveSession,
): number {
  return a.sessionId.localeCompare(b.sessionId);
}

// ===========================================================================
// Terminal-set sanity
// ===========================================================================

describe('TERMINAL_CURRENT_STEPS', () => {
  test('contains exactly `done` and `error`', () => {
    expect(TERMINAL_CURRENT_STEPS.has('done')).toBe(true);
    expect(TERMINAL_CURRENT_STEPS.has('error')).toBe(true);
    expect(TERMINAL_CURRENT_STEPS.size).toBe(2);
  });
});

// ===========================================================================
// Empty / missing tree
// ===========================================================================

describe('findStateActiveSessions — missing tree', () => {
  test('returns [] when .gobbi/ does not exist', () => {
    const repo = makeRepo();
    expect(findStateActiveSessions(repo)).toEqual([]);
  });

  test('returns [] when .gobbi/ exists but has no session directories', () => {
    const repo = makeRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    expect(findStateActiveSessions(repo)).toEqual([]);
  });

  test('returns [] when legacy sessions/ exists but is empty', () => {
    const repo = makeRepo();
    mkdirSync(join(repo, '.gobbi', 'sessions'), { recursive: true });
    expect(findStateActiveSessions(repo)).toEqual([]);
  });
});

// ===========================================================================
// Legacy-flat layer — state-based classification
// ===========================================================================

describe('findStateActiveSessions — legacy-flat state classification', () => {
  test('`currentStep: plan` is active (protects pre-rename legacy sessions)', () => {
    // This is the load-bearing assertion for Arch F3: the current in-flight
    // session has currentStep='plan', and the wipe command must protect it
    // even though 'plan' is NOT a member of `WorkflowStep` after W4 lands.
    const repo = makeRepo();
    seedLegacySessionWithStep(repo, '35742566-plan', 'plan');

    const result = findStateActiveSessions(repo);
    expect(result.length).toBe(1);
    const [session] = result;
    expect(session?.sessionId).toBe('35742566-plan');
    expect(session?.currentStep).toBe('plan');
    expect(session?.projectName).toBeNull();
  });

  test('`currentStep: planning` is active (post-rename value)', () => {
    const repo = makeRepo();
    seedLegacySessionWithStep(repo, 'post-rename', 'planning');

    const result = findStateActiveSessions(repo);
    expect(result.length).toBe(1);
    expect(result[0]?.currentStep).toBe('planning');
  });

  test('`currentStep: done` is inactive (safe to wipe)', () => {
    const repo = makeRepo();
    seedLegacySessionWithStep(repo, 'finished', 'done');
    expect(findStateActiveSessions(repo)).toEqual([]);
  });

  test('`currentStep: error` is inactive (safe to wipe)', () => {
    const repo = makeRepo();
    seedLegacySessionWithStep(repo, 'failed', 'error');
    expect(findStateActiveSessions(repo)).toEqual([]);
  });

  test('other in-flight steps (ideation / execution / memorization) are active', () => {
    const repo = makeRepo();
    seedLegacySessionWithStep(repo, 'sess-ideation', 'ideation');
    seedLegacySessionWithStep(repo, 'sess-execution', 'execution');
    seedLegacySessionWithStep(repo, 'sess-memorization', 'memorization');

    const result = [...findStateActiveSessions(repo)].sort(bySessionId);
    expect(result.map((s) => s.sessionId)).toEqual([
      'sess-execution',
      'sess-ideation',
      'sess-memorization',
    ]);
    // All three must carry projectName=null (legacy flat).
    for (const s of result) {
      expect(s.projectName).toBeNull();
    }
  });

  test('missing state.json → active (currentStep=null, protect by default)', () => {
    const repo = makeRepo();
    seedLegacySession(repo, 'no-state', null);
    const result = findStateActiveSessions(repo);
    expect(result.length).toBe(1);
    expect(result[0]?.currentStep).toBeNull();
    expect(result[0]?.sessionId).toBe('no-state');
  });

  test('malformed JSON → active (currentStep=null)', () => {
    const repo = makeRepo();
    seedLegacySession(repo, 'bad-json', '{not valid json,,,');
    const result = findStateActiveSessions(repo);
    expect(result.length).toBe(1);
    expect(result[0]?.currentStep).toBeNull();
  });

  test('JSON with non-string currentStep → active (currentStep=null)', () => {
    const repo = makeRepo();
    seedLegacySession(
      repo,
      'wrong-type',
      JSON.stringify({ currentStep: 42, otherField: 'x' }),
    );
    const result = findStateActiveSessions(repo);
    expect(result.length).toBe(1);
    expect(result[0]?.currentStep).toBeNull();
  });

  test('files (not directories) under sessions/ are skipped', () => {
    const repo = makeRepo();
    const sessionsDir = join(repo, '.gobbi', 'sessions');
    mkdirSync(sessionsDir, { recursive: true });
    writeFileSync(join(sessionsDir, 'stray-file.txt'), 'ignore me', 'utf8');
    seedLegacySessionWithStep(repo, 'real-session', 'ideation');

    const result = findStateActiveSessions(repo);
    expect(result.map((s) => s.sessionId)).toEqual(['real-session']);
  });
});

// ===========================================================================
// Per-project layer + dual scan
// ===========================================================================

describe('findStateActiveSessions — dual-layer scan', () => {
  test('returns sessions from both legacy and per-project layers', () => {
    const repo = makeRepo();
    seedLegacySessionWithStep(repo, 'legacy-1', 'ideation');
    seedProjectSession(repo, 'foo', 'proj-1', 'execution');

    const result = [...findStateActiveSessions(repo)].sort(bySessionId);
    expect(result.length).toBe(2);

    const legacy = result.find((s) => s.sessionId === 'legacy-1');
    const project = result.find((s) => s.sessionId === 'proj-1');

    expect(legacy?.projectName).toBeNull();
    expect(legacy?.currentStep).toBe('ideation');
    expect(legacy?.sessionDir).toBe(
      join(repo, '.gobbi', 'sessions', 'legacy-1'),
    );

    expect(project?.projectName).toBe('foo');
    expect(project?.currentStep).toBe('execution');
    expect(project?.sessionDir).toBe(
      join(repo, '.gobbi', 'projects', 'foo', 'sessions', 'proj-1'),
    );
  });

  test('multiple projects are scanned independently', () => {
    const repo = makeRepo();
    seedProjectSession(repo, 'alpha', 'a1', 'ideation');
    seedProjectSession(repo, 'alpha', 'a2', 'done'); // skipped
    seedProjectSession(repo, 'beta', 'b1', 'plan');
    seedProjectSession(repo, 'beta', 'b2', 'error'); // skipped

    const result = [...findStateActiveSessions(repo)].sort(bySessionId);
    expect(result.length).toBe(2);
    expect(result[0]?.sessionId).toBe('a1');
    expect(result[0]?.projectName).toBe('alpha');
    expect(result[1]?.sessionId).toBe('b1');
    expect(result[1]?.projectName).toBe('beta');
  });

  test('project without a sessions/ subdir is skipped silently', () => {
    const repo = makeRepo();
    // Create .gobbi/projects/ghost/ but no sessions/ under it.
    mkdirSync(join(repo, '.gobbi', 'projects', 'ghost'), { recursive: true });
    seedLegacySessionWithStep(repo, 'legacy-1', 'ideation');

    const result = findStateActiveSessions(repo);
    expect(result.map((s) => s.sessionId)).toEqual(['legacy-1']);
  });

  test('legacy layer absent: per-project sessions still reported', () => {
    const repo = makeRepo();
    seedProjectSession(repo, 'foo', 'proj-only', 'ideation');
    const result = findStateActiveSessions(repo);
    expect(result.length).toBe(1);
    expect(result[0]?.projectName).toBe('foo');
  });
});

// ===========================================================================
// readCurrentStepRaw (now exported; shared by the wipe command's inactive
// enumeration)
// ===========================================================================

describe('readCurrentStepRaw — edge cases', () => {
  test('returns the raw string value for a well-formed state.json', () => {
    const repo = makeRepo();
    const dir = seedLegacySessionWithStep(repo, 's-1', 'execution');
    expect(readCurrentStepRaw(dir)).toBe('execution');
  });

  test('returns null when state.json is absent', () => {
    const repo = makeRepo();
    const dir = seedLegacySession(repo, 's-missing', null);
    expect(readCurrentStepRaw(dir)).toBeNull();
  });

  test('returns null when state.json is not parseable JSON', () => {
    const repo = makeRepo();
    const dir = seedLegacySession(repo, 's-bad', '{not valid,,,');
    expect(readCurrentStepRaw(dir)).toBeNull();
  });

  test('returns null when the parsed root is not an object', () => {
    const repo = makeRepo();
    const dir = seedLegacySession(repo, 's-array', '[1, 2, 3]');
    expect(readCurrentStepRaw(dir)).toBeNull();
  });

  test('returns null when currentStep is missing from the object', () => {
    const repo = makeRepo();
    const dir = seedLegacySession(
      repo,
      's-no-step',
      JSON.stringify({ sessionId: 's-no-step' }),
    );
    expect(readCurrentStepRaw(dir)).toBeNull();
  });

  test('returns null when currentStep is not a string', () => {
    const repo = makeRepo();
    const dir = seedLegacySession(
      repo,
      's-wrong-type',
      JSON.stringify({ currentStep: 42 }),
    );
    expect(readCurrentStepRaw(dir)).toBeNull();
  });

  test('returns the unvalidated raw string — pre-rename `plan` survives', () => {
    // Load-bearing for the W3.3/W4 ordering guarantee: even after
    // `VALID_STEPS` drops `'plan'`, `readCurrentStepRaw` still returns
    // it verbatim so the wipe-safety classifier can honour the terminal
    // set without taking a dependency on the workflow state union.
    const repo = makeRepo();
    const dir = seedLegacySessionWithStep(repo, 's-plan', 'plan');
    expect(readCurrentStepRaw(dir)).toBe('plan');
  });
});
