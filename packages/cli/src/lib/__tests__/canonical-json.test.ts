/**
 * Tests for `lib/canonical-json.ts` — the pure stringifier used by
 * Wave C.1's content addressing.
 *
 * The function is a thin wrapper around `JSON.stringify(value, null, 2)`
 * so the test surface focuses on (a) the rule we lock here matches the
 * `_schema/v1.json` byte-mirror format used at
 * `specs/__tests__/schema.test.ts:399-406`, and (b) edge cases that the
 * rule must be robust against (round-trip stability under
 * parse-and-re-stringify, key insertion-order preservation).
 */

import { describe, test, expect } from 'bun:test';

import { canonicalize } from '../canonical-json.js';

describe('canonicalize', () => {
  test('matches the `JSON.stringify(value, null, 2)` reference shape', () => {
    const value = { a: 1, b: [2, 3], c: { d: true } };
    expect(canonicalize(value)).toBe(JSON.stringify(value, null, 2));
  });

  test('uses 2-space indent (the schema-mirror precedent)', () => {
    const out = canonicalize({ a: 1 });
    expect(out).toContain('\n  "a": 1');
  });

  test('preserves insertion order — NOT sorted-key', () => {
    const out = canonicalize({ z: 1, a: 2, m: 3 });
    // Insertion order: z first, then a, then m.
    const idxZ = out.indexOf('"z"');
    const idxA = out.indexOf('"a"');
    const idxM = out.indexOf('"m"');
    expect(idxZ).toBeLessThan(idxA);
    expect(idxA).toBeLessThan(idxM);
  });

  test('round-trips JSON.parse → canonicalize for an object whose keys are already in insertion order', () => {
    const original = { x: 1, y: 2, z: 3 };
    const json = JSON.stringify(original, null, 2);
    const reparsed = JSON.parse(json) as unknown;
    expect(canonicalize(reparsed)).toBe(json);
  });

  test('handles primitives — number, string, boolean, null', () => {
    expect(canonicalize(42)).toBe('42');
    expect(canonicalize('hello')).toBe('"hello"');
    expect(canonicalize(true)).toBe('true');
    expect(canonicalize(null)).toBe('null');
  });

  test('handles empty object', () => {
    expect(canonicalize({})).toBe('{}');
  });

  test('handles empty array', () => {
    expect(canonicalize([])).toBe('[]');
  });

  test('nested objects emit 2-space indents at every level', () => {
    const out = canonicalize({ a: { b: { c: 1 } } });
    // Depth-3 c should have 6 leading spaces.
    expect(out).toContain('      "c": 1');
  });

  test('byte-equal idempotent — canonicalize(canonicalize-parsed) === canonicalize', () => {
    const value = { a: [1, { b: 2 }], c: 'x' };
    const first = canonicalize(value);
    const reparsed = JSON.parse(first) as unknown;
    expect(canonicalize(reparsed)).toBe(first);
  });
});
