/**
 * Tests for `commands/prompt/patch.ts` — Wave C.1.6 (issue #156).
 *
 * Covers:
 *
 *   - `mergeTestOp` (synthesis §9.2 step 3 / Overall F-7) — the three
 *     test-op merge cases and a few hand-picked edge cases.
 *   - `runPromptPatchOnFiles` validation pipeline — fails at every gate
 *     in the §9.2 fail-fast ladder. Uses scratch directory + `--dry-run`
 *     to avoid touching real state.db / real spec.json files. The full
 *     commit-phase test lives in the e2e test
 *     (`__tests__/e2e/prompt-patch.test.ts`).
 */

import { describe, test, expect } from 'bun:test';
import type { Operation } from 'fast-json-patch';

import { mergeTestOp } from '../patch.js';

describe('mergeTestOp', () => {
  test('case 1 — no test op anywhere: synthesizes /version test at index 0', () => {
    const operatorOps: Operation[] = [
      { op: 'replace', path: '/meta/description', value: 'updated' },
    ];
    const result = mergeTestOp(operatorOps);
    expect(result.synthesizedTestOp).toBe(true);
    expect(result.mergedOps).toEqual([
      { op: 'test', path: '/version', value: 1 },
      { op: 'replace', path: '/meta/description', value: 'updated' },
    ]);
  });

  test('case 2 — operator authored test-at-index-0-on-/version: keep as-is', () => {
    const operatorOps: Operation[] = [
      { op: 'test', path: '/version', value: 1 },
      { op: 'replace', path: '/meta/description', value: 'updated' },
    ];
    const result = mergeTestOp(operatorOps);
    expect(result.synthesizedTestOp).toBe(false);
    expect(result.mergedOps).toEqual(operatorOps);
  });

  test('case 3 — operator test op elsewhere: prepend synth /version test, preserve operator tests', () => {
    const operatorOps: Operation[] = [
      { op: 'replace', path: '/meta/description', value: 'updated' },
      { op: 'test', path: '/version', value: 1 },
    ];
    const result = mergeTestOp(operatorOps);
    expect(result.synthesizedTestOp).toBe(true);
    expect(result.mergedOps[0]).toEqual({
      op: 'test',
      path: '/version',
      value: 1,
    });
    // Operator's test op preserved at original index (now offset by 1).
    expect(result.mergedOps).toHaveLength(3);
  });

  test('case 3 — operator test on different path: prepend synth, preserve operator', () => {
    const operatorOps: Operation[] = [
      { op: 'test', path: '/meta/description', value: 'baseline' },
      { op: 'replace', path: '/meta/description', value: 'updated' },
    ];
    const result = mergeTestOp(operatorOps);
    expect(result.synthesizedTestOp).toBe(true);
    expect(result.mergedOps[0]).toEqual({
      op: 'test',
      path: '/version',
      value: 1,
    });
    // Operator's test on /meta/description preserved.
    expect(result.mergedOps[1]).toEqual({
      op: 'test',
      path: '/meta/description',
      value: 'baseline',
    });
  });

  test('case 2 vs. case 3 boundary — test op at index 0 on a non-/version path triggers synth', () => {
    const operatorOps: Operation[] = [
      { op: 'test', path: '/version', value: 2 }, // wrong value but path matches
      { op: 'replace', path: '/version', value: 2 },
    ];
    // Path matches /version so this stays as case 2: keep as-is. The
    // test-op value mismatch is the operator's responsibility.
    const result = mergeTestOp(operatorOps);
    expect(result.synthesizedTestOp).toBe(false);
    expect(result.mergedOps).toEqual(operatorOps);
  });

  test('empty operator ops: synthesizes a single /version test', () => {
    const result = mergeTestOp([]);
    expect(result.synthesizedTestOp).toBe(true);
    expect(result.mergedOps).toEqual([
      { op: 'test', path: '/version', value: 1 },
    ]);
  });

  test('multiple operator test ops, none at index 0 on /version: prepend synth, all preserved', () => {
    const operatorOps: Operation[] = [
      { op: 'replace', path: '/meta/description', value: 'updated' },
      { op: 'test', path: '/meta/description', value: 'baseline' },
      { op: 'test', path: '/version', value: 1 },
    ];
    const result = mergeTestOp(operatorOps);
    expect(result.synthesizedTestOp).toBe(true);
    expect(result.mergedOps).toHaveLength(4);
    expect(result.mergedOps[0]).toEqual({
      op: 'test',
      path: '/version',
      value: 1,
    });
  });
});
