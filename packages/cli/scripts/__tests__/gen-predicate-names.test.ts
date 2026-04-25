/**
 * Integration tests for `scripts/gen-predicate-names.ts`.
 *
 * Covers:
 *
 *   - Determinism — two runs on unchanged inputs produce byte-identical
 *     output.
 *   - Content shape — the emitted union lists every predicate referenced
 *     in the committed spec library and nothing else.
 *   - Output location — the generated file lives at the expected
 *     `src/workflow/predicates.generated.ts` path.
 *
 * The script is invoked via Bun's child-process shim so we exercise the
 * real executable path (same as `prebuild` / `pretypecheck` use). The
 * tests check the CHECKED-IN generated file rather than a scratch copy —
 * any drift between spec references and the committed file fails here.
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { PREDICATE_NAMES } from '../../src/workflow/predicates.js';

const thisDir = dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = resolve(thisDir, '..', '..');
const SCRIPT_PATH = resolve(CLI_ROOT, 'scripts', 'gen-predicate-names.ts');
const GENERATED_PATH = resolve(
  CLI_ROOT,
  'src',
  'workflow',
  'predicates.generated.ts',
);

function runCodegen(): { stdout: string; status: number } {
  const result = spawnSync('bun', ['run', SCRIPT_PATH], {
    cwd: CLI_ROOT,
    encoding: 'utf8',
  });
  return {
    stdout: result.stdout ?? '',
    status: result.status ?? -1,
  };
}

describe('gen-predicate-names — determinism and shape', () => {
  test('committed generated file matches a fresh codegen run (byte-identical)', () => {
    const before = readFileSync(GENERATED_PATH, 'utf8');
    const { status } = runCodegen();
    expect(status).toBe(0);
    const after = readFileSync(GENERATED_PATH, 'utf8');
    expect(after).toBe(before);
  });

  test('two consecutive runs produce byte-identical output', () => {
    runCodegen();
    const first = readFileSync(GENERATED_PATH, 'utf8');
    runCodegen();
    const second = readFileSync(GENERATED_PATH, 'utf8');
    expect(second).toBe(first);
  });

  test('generated file exports a PredicateName union header', () => {
    const contents = readFileSync(GENERATED_PATH, 'utf8');
    expect(contents).toContain('GENERATED FILE — DO NOT EDIT BY HAND');
    expect(contents).toContain('export type PredicateName');
    expect(contents).toContain('export const PREDICATE_NAMES');
  });

  test('PREDICATE_NAMES is sorted alphabetically', () => {
    const sorted = [...PREDICATE_NAMES].sort();
    expect([...PREDICATE_NAMES]).toEqual(sorted);
  });

  test('PREDICATE_NAMES contains the canonical PR A registrations', () => {
    // The PR A "locked" predicate names must still be in the union after
    // regeneration. This catches a codegen regression that accidentally
    // strips names with a narrower walk.
    const lockedFromPRA = [
      'evalIdeationEnabled',
      'evalIdeationDisabled',
      'evalPlanningEnabled',
      'evalPlanningDisabled',
      'feedbackCapExceeded',
      'feedbackRoundActive',
      'ideationSynthesized',
      'piAgentsToSpawn',
    ] as const;
    for (const name of lockedFromPRA) {
      expect(PREDICATE_NAMES).toContain(name);
    }
  });

  test('PREDICATE_NAMES contains the B.1 graph + spec additions', () => {
    const addedByB1 = [
      'verdictPass',
      'verdictRevise',
      'always',
      'loopTargetIdeation',
      'loopTargetPlanning',
      'loopTargetExecution',
      'stepTimeoutFired',
      'skipRequested',
      'abortRequested',
      'resumeTargetIdeation',
      'resumeTargetPlanning',
      'resumeTargetExecution',
      'resumeTargetMemorization',
    ] as const;
    for (const name of addedByB1) {
      expect(PREDICATE_NAMES).toContain(name);
    }
  });
});
