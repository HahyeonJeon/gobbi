/**
 * Snapshot tests for the 5 resume pathway compilers.
 *
 * D.1 lands this file as a placeholder so D.4 can populate it without a
 * create-file merge race. D.4 fills:
 *
 *   - 5 resume fixtures (Crash, Timeout, FeedbackCap, InvalidTransition,
 *     Unknown).
 *   - Per-pathway snapshot assertions on `prompt.text` + `prompt.staticPrefixHash`.
 *   - Cache-stability assertion: same pathway + same target → identical
 *     `staticPrefixHash`; different target → shared first-static hash but
 *     divergent dynamic target-entry note.
 *
 * The placeholder test below keeps bun-test from reporting a zero-test
 * file; D.4 will replace it with the real snapshot set.
 */

import { describe, it, expect } from 'bun:test';

describe('resume.snap — placeholder (D.4 populates)', () => {
  it('placeholder — D.4 fills in per-pathway resume snapshot tests', () => {
    expect(true).toBe(true);
  });
});
