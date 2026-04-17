/**
 * Snapshot tests for the 5 error-state pathway compilers.
 *
 * D.1 lands this file as a placeholder so D.2 can populate it without a
 * create-file merge race. D.2 fills:
 *
 *   - 5 pathway fixtures (Crash, Timeout, FeedbackCap, InvalidTransition,
 *     Unknown).
 *   - Per-pathway snapshot assertions on `prompt.text`,
 *     `prompt.staticPrefixHash`, and `prompt.sections.map(s => ({id, kind}))`.
 *   - Cross-pathway invariant: all 5 prompts share the first static
 *     `contentHash` (locks the shared-role cache prefix).
 *
 * The placeholder test below keeps bun-test from reporting a zero-test
 * file; D.2 will replace it with the real snapshot set.
 */

import { describe, it, expect } from 'bun:test';

describe('errors.snap — placeholder (D.2 populates)', () => {
  it('placeholder — D.2 fills in per-pathway snapshot tests', () => {
    expect(true).toBe(true);
  });
});
