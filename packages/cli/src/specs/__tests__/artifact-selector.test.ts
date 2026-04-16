/**
 * Unit tests for `specs/artifact-selector.ts`.
 *
 * Fixtures live under `__tests__/fixtures/sessions/*` and mirror the
 * step-directory layout from `v050-session.md` §Session Directory Structure.
 * Files are intentionally tiny — the selector returns path references, not
 * bodies, so the only thing the tests need from them is the filename.
 */

import { describe, test, expect } from 'bun:test';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  selectPriorArtifacts,
  getStepOrder,
  type SelectedArtifact,
  type StepId,
} from '../artifact-selector.js';

// ---------------------------------------------------------------------------
// Fixture paths
// ---------------------------------------------------------------------------

const thisDir = dirname(fileURLToPath(import.meta.url));
const fixturesRoot = join(thisDir, 'fixtures', 'sessions');

const FIXTURE = {
  complete: join(fixturesRoot, 'complete'),
  empty: join(fixturesRoot, 'empty'),
  partialMissingIdeation: join(fixturesRoot, 'partial-missing-ideation'),
  multiRound: join(fixturesRoot, 'multi-round'),
  withEvaluation: join(fixturesRoot, 'with-evaluation'),
} as const;

function basenames(artifacts: readonly SelectedArtifact[]): string[] {
  return artifacts.map((a) => a.filePath.split('/').slice(-1)[0] ?? '');
}

function stepIds(artifacts: readonly SelectedArtifact[]): StepId[] {
  return artifacts.map((a) => a.stepId);
}

// ===========================================================================
// getStepOrder — canonical workflow ordering
// ===========================================================================

describe('getStepOrder', () => {
  test('ideation has no prior steps', () => {
    expect(getStepOrder('ideation')).toEqual([]);
  });

  test('plan is preceded only by ideation', () => {
    expect(getStepOrder('plan')).toEqual(['ideation']);
  });

  test('execution is preceded by ideation, plan — research is an Ideation substate, not a step', () => {
    expect(getStepOrder('execution')).toEqual(['ideation', 'plan']);
  });

  test('evaluation is preceded by ideation, plan, execution', () => {
    expect(getStepOrder('evaluation')).toEqual([
      'ideation',
      'plan',
      'execution',
    ]);
  });

  test('memorization is preceded by every other step', () => {
    expect(getStepOrder('memorization')).toEqual([
      'ideation',
      'plan',
      'execution',
      'evaluation',
    ]);
  });
});

// ===========================================================================
// First step — no prior artifacts
// ===========================================================================

describe('selectPriorArtifacts — first step', () => {
  test('ideation returns empty array regardless of session contents', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.complete,
      currentStep: 'ideation',
    });
    expect(result).toEqual([]);
  });

  test('ideation returns empty even when session dir is empty', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.empty,
      currentStep: 'ideation',
    });
    expect(result).toEqual([]);
  });
});

// ===========================================================================
// Plan step — picks up ideation authoritative artifact
// ===========================================================================

describe('selectPriorArtifacts — plan step', () => {
  test('returns the ideation authoritative artifact', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.complete,
      currentStep: 'plan',
    });
    expect(result).toHaveLength(1);
    const only = result[0];
    expect(only).toBeDefined();
    expect(only?.stepId).toBe('ideation');
    expect(only?.role).toBe('authoritative');
    expect(only?.round).toBe(0);
    expect(basenames(result)).toEqual(['ideation.md']);
  });

  test('returned filePath is absolute and points at the real file on disk', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.complete,
      currentStep: 'plan',
    });
    const first = result[0];
    expect(first).toBeDefined();
    expect(first?.filePath.startsWith('/')).toBe(true);
    expect(await Bun.file(first!.filePath).exists()).toBe(true);
  });

  test('does not include innovative/best sources by default', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.complete,
      currentStep: 'plan',
    });
    expect(basenames(result)).not.toContain('innovative.md');
    expect(basenames(result)).not.toContain('best.md');
  });
});

// ===========================================================================
// Execution step — ideation + plan, in canonical order
// ===========================================================================

describe('selectPriorArtifacts — execution step', () => {
  test('returns ideation then plan authoritative artifacts in prior-step order', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.complete,
      currentStep: 'execution',
    });
    expect(result).toHaveLength(2);
    expect(stepIds(result)).toEqual(['ideation', 'plan']);
    expect(basenames(result)).toEqual(['ideation.md', 'plan.md']);
    for (const a of result) expect(a.role).toBe('authoritative');
  });
});

// ===========================================================================
// Filename versioning — latest round selection
// ===========================================================================

describe('selectPriorArtifacts — filename versioning', () => {
  test('selects only the highest-round artifact when multiple rounds exist', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.multiRound,
      currentStep: 'execution',
    });
    // ideation has round-0 ideation.md; plan has plan-r1.md and plan-r2.md.
    expect(basenames(result)).toEqual(['ideation.md', 'plan-r2.md']);
    const planEntry = result.find((a) => a.stepId === 'plan');
    expect(planEntry).toBeDefined();
    expect(planEntry?.round).toBe(2);
    // round-1 artifact is NOT returned.
    expect(basenames(result)).not.toContain('plan-r1.md');
  });
});

// ===========================================================================
// Graceful skipping of missing artifacts
// ===========================================================================

describe('selectPriorArtifacts — missing artifacts', () => {
  test('skips a step whose authoritative artifact has not been written', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.partialMissingIdeation,
      currentStep: 'execution',
    });
    // ideation/ exists but has no ideation.md → skipped.
    // plan/plan.md exists → included.
    expect(stepIds(result)).toEqual(['plan']);
    expect(basenames(result)).toEqual(['plan.md']);
  });

  test('skips a step whose directory does not exist at all', async () => {
    // `empty` has no step subdirectories — every prior step is missing.
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.empty,
      currentStep: 'execution',
    });
    expect(result).toEqual([]);
  });

  test('does not throw when the whole session directory does not exist', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: '/nonexistent/path/that/definitely/does/not/exist',
      currentStep: 'plan',
    });
    expect(result).toEqual([]);
  });
});

// ===========================================================================
// includeSources toggle
// ===========================================================================

describe('selectPriorArtifacts — includeSources', () => {
  test('surfaces innovative.md and best.md alongside ideation.md when enabled', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.complete,
      currentStep: 'plan',
      includeSources: true,
    });
    expect(basenames(result)).toEqual(['ideation.md', 'innovative.md', 'best.md']);
    const roles = result.map((a) => a.role);
    expect(roles).toEqual(['authoritative', 'source', 'source']);
  });

  test('includeSources: false (explicit) matches the default', async () => {
    const explicit = await selectPriorArtifacts({
      sessionDir: FIXTURE.complete,
      currentStep: 'plan',
      includeSources: false,
    });
    const defaulted = await selectPriorArtifacts({
      sessionDir: FIXTURE.complete,
      currentStep: 'plan',
    });
    expect(explicit).toEqual(defaulted);
  });
});

// ===========================================================================
// Evaluation step — every *.md at the evaluation root is authoritative
// ===========================================================================

describe('selectPriorArtifacts — evaluation perspective files', () => {
  test('memorization selects prior steps including every evaluation perspective file', async () => {
    const result = await selectPriorArtifacts({
      sessionDir: FIXTURE.withEvaluation,
      currentStep: 'memorization',
    });
    // Canonical order: ideation, plan, execution, evaluation (3 files).
    expect(stepIds(result)).toEqual([
      'ideation',
      'plan',
      'execution',
      'evaluation',
      'evaluation',
      'evaluation',
    ]);
    // Evaluation files enumerate in locale-sorted order for determinism.
    const evalBasenames = result
      .filter((a) => a.stepId === 'evaluation')
      .map((a) => a.filePath.split('/').slice(-1)[0]);
    expect(evalBasenames).toEqual(['architecture.md', 'overall.md', 'project.md']);
    for (const a of result.filter((x) => x.stepId === 'evaluation')) {
      expect(a.role).toBe('authoritative');
    }
  });
});

// ===========================================================================
// Determinism — same inputs produce the same output twice
// ===========================================================================

describe('selectPriorArtifacts — determinism', () => {
  test('two successive calls with identical options produce identical results', async () => {
    const a = await selectPriorArtifacts({
      sessionDir: FIXTURE.withEvaluation,
      currentStep: 'memorization',
      includeSources: true,
    });
    const b = await selectPriorArtifacts({
      sessionDir: FIXTURE.withEvaluation,
      currentStep: 'memorization',
      includeSources: true,
    });
    expect(a).toEqual(b);
  });

  test('output order is stable across multi-round fixture', async () => {
    const one = await selectPriorArtifacts({
      sessionDir: FIXTURE.multiRound,
      currentStep: 'execution',
    });
    const two = await selectPriorArtifacts({
      sessionDir: FIXTURE.multiRound,
      currentStep: 'execution',
    });
    expect(basenames(one)).toEqual(basenames(two));
    expect(one.map((a) => a.round)).toEqual(two.map((a) => a.round));
  });
});
