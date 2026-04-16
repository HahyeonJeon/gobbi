/**
 * Unit tests for `specs/sections.ts` — factory construction, content-hash
 * determinism and sensitivity, `exactOptionalPropertyTypes`-compliant
 * optional `minTokens` handling, and the `CacheOrderedSections<T>`
 * variadic-tuple type guard.
 *
 * The type-level assertions below use `@ts-expect-error`. If a future
 * refactor accidentally loosens the ordering guard, those lines will
 * compile cleanly and `tsc --noEmit` will FAIL with TS2578 (unused
 * `@ts-expect-error`). That is the contract we want.
 */

import { describe, test, expect } from 'bun:test';

import {
  makeStatic,
  makeDynamic,
  type StaticSection,
  type DynamicSection,
  type CacheOrderedSections,
} from '../sections.js';

// ===========================================================================
// Factory construction — StaticSection
// ===========================================================================

describe('makeStatic', () => {
  test('returns a section with the given id and content', () => {
    const s = makeStatic({ id: 'skills.gotcha', content: 'Check gotchas first.' });
    expect(s.id).toBe('skills.gotcha');
    expect(s.content).toBe('Check gotchas first.');
  });

  test('computes a 64-character lowercase hex sha256 over the content', () => {
    // Pre-computed: sha256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    const s = makeStatic({ id: 'x', content: 'hello' });
    expect(s.contentHash).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
    expect(s.contentHash).toMatch(/^[0-9a-f]{64}$/);
  });

  test('omits the minTokens field when not provided', () => {
    const s = makeStatic({ id: 'x', content: 'hello' });
    // `exactOptionalPropertyTypes: true` distinguishes "absent" from
    // "present with value undefined". The factory must keep the field
    // absent — asserting `in` is the direct test.
    expect('minTokens' in s).toBe(false);
  });

  test('preserves minTokens when provided', () => {
    const s = makeStatic({ id: 'x', content: 'hello', minTokens: 128 });
    expect(s.minTokens).toBe(128);
  });
});

// ===========================================================================
// Factory construction — DynamicSection
// ===========================================================================

describe('makeDynamic', () => {
  test('returns a section with the given id and content', () => {
    const d = makeDynamic({ id: 'state.artifacts', content: 'file-a.md\nfile-b.md' });
    expect(d.id).toBe('state.artifacts');
    expect(d.content).toBe('file-a.md\nfile-b.md');
  });

  test('computes a 64-character lowercase hex sha256 over the content', () => {
    const d = makeDynamic({ id: 'x', content: 'hello' });
    expect(d.contentHash).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
    expect(d.contentHash).toMatch(/^[0-9a-f]{64}$/);
  });

  test('omits the minTokens field when not provided', () => {
    const d = makeDynamic({ id: 'x', content: 'hello' });
    expect('minTokens' in d).toBe(false);
  });

  test('preserves minTokens when provided', () => {
    const d = makeDynamic({ id: 'x', content: 'hello', minTokens: 64 });
    expect(d.minTokens).toBe(64);
  });
});

// ===========================================================================
// Content-hash determinism and sensitivity
// ===========================================================================

describe('contentHash', () => {
  test('two calls with identical content produce identical hashes', () => {
    const a = makeStatic({ id: 'a', content: 'same bytes' });
    const b = makeStatic({ id: 'b-different-id', content: 'same bytes' });
    // Hash is a function of content only, independent of id.
    expect(a.contentHash).toBe(b.contentHash);
  });

  test('static and dynamic sections with identical content hash identically', () => {
    const s = makeStatic({ id: 's', content: 'payload' });
    const d = makeDynamic({ id: 'd', content: 'payload' });
    // Hashing is over content bytes only — brand does not participate.
    expect(s.contentHash).toBe(d.contentHash);
  });

  test('a single-byte content change changes the hash', () => {
    const a = makeStatic({ id: 'x', content: 'hello' });
    const b = makeStatic({ id: 'x', content: 'hellp' });
    expect(a.contentHash).not.toBe(b.contentHash);
  });

  test('empty content hashes to sha256("")', () => {
    // sha256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    const s = makeStatic({ id: 'empty', content: '' });
    expect(s.contentHash).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

// ===========================================================================
// Type-level: brand fields are not user-constructable
//
// These assertions confirm that an external caller cannot hand-roll a
// StaticSection / DynamicSection. The module-private brand symbols are
// not exported, so no structural object-literal can match the interface.
// ===========================================================================

describe('type-level: brand is not user-constructable', () => {
  test('plain object without the brand is not assignable to StaticSection', () => {
    // @ts-expect-error — plain object lacks the module-private brand symbol
    const s: StaticSection = {
      id: 'x',
      content: 'y',
      contentHash: '0'.repeat(64),
    };
    // Expect the line above to fail to compile. Reference `s` to avoid
    // an unused-variable error; the runtime side of this test is incidental.
    expect(typeof s).toBe('object');
  });

  test('plain object without the brand is not assignable to DynamicSection', () => {
    // @ts-expect-error — plain object lacks the module-private brand symbol
    const d: DynamicSection = {
      id: 'x',
      content: 'y',
      contentHash: '0'.repeat(64),
    };
    expect(typeof d).toBe('object');
  });
});

// ===========================================================================
// Type-level: CacheOrderedSections<T> variadic-tuple guard
//
// The helper that A.4's `compile()` consumes. The asOrdered<T> stub below
// mirrors the intended `compile()` signature so these assertions test the
// same thing A.4's downstream call sites will.
// ===========================================================================

function asOrdered<const T extends readonly (StaticSection | DynamicSection)[]>(
  sections: T & CacheOrderedSections<T>,
): T {
  return sections;
}

describe('type-level: CacheOrderedSections', () => {
  const s1 = makeStatic({ id: 's1', content: 'one' });
  const s2 = makeStatic({ id: 's2', content: 'two' });
  const d1 = makeDynamic({ id: 'd1', content: 'three' });
  const d2 = makeDynamic({ id: 'd2', content: 'four' });

  test('accepts empty tuple', () => {
    const result = asOrdered([]);
    expect(result.length).toBe(0);
  });

  test('accepts all-static tuple', () => {
    const result = asOrdered([s1, s2]);
    expect(result.length).toBe(2);
  });

  test('accepts all-dynamic tuple', () => {
    const result = asOrdered([d1, d2]);
    expect(result.length).toBe(2);
  });

  test('accepts static-then-dynamic tuple', () => {
    const result = asOrdered([s1, s2, d1, d2]);
    expect(result.length).toBe(4);
  });

  test('rejects dynamic-before-static (type error)', () => {
    // @ts-expect-error — dynamic must not precede static in the cache-ordered tuple
    asOrdered([d1, s1]);
    // Runtime assertion is incidental; the compile-time rejection is the test.
    expect(true).toBe(true);
  });

  test('rejects static-after-dynamic interleaved (type error)', () => {
    // @ts-expect-error — once a DynamicSection appears, no StaticSection may follow
    asOrdered([s1, d1, s2]);
    expect(true).toBe(true);
  });

  test('rejects static sandwiched between dynamics (type error)', () => {
    // @ts-expect-error — StaticSection between DynamicSections violates cache ordering
    asOrdered([d1, s1, d2]);
    expect(true).toBe(true);
  });
});
