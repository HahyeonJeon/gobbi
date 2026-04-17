/**
 * Unit tests for the secret-pattern guard allowlist (C.12).
 *
 * The allowlist is data only — secret-pattern regexes themselves arrive in
 * PR F when the PreToolUse hook registers the guard. These tests cover:
 *
 *   1. Admit cases — paths under each allowlisted subtree resolve true.
 *   2. Block cases — paths outside the allowlist resolve false.
 *   3. Fake-secret placeholder content — asserts the allowlist-check-first
 *      contract: even if a path's content matches a future secret regex,
 *      `isAllowlistedPath` is the gate the PR F hook will consult before
 *      emitting `guard.warn`. No real tokens; placeholders match shape only.
 */

import { describe, expect, test } from 'bun:test';

import {
  isAllowlistedPath,
  SECRET_PATTERN_ALLOWLIST,
} from '../guard-specs.js';

// ---------------------------------------------------------------------------
// Allowlist constant
// ---------------------------------------------------------------------------

describe('SECRET_PATTERN_ALLOWLIST', () => {
  test('contains the four C.12 subtree entries', () => {
    expect(SECRET_PATTERN_ALLOWLIST).toEqual([
      '.gobbi/project/gotchas/**',
      '.gobbi/project/notes/**',
      '.gobbi/sessions/**',
      '.gobbi/worktrees/**',
    ]);
  });

  test('is sorted alphabetically for diff stability', () => {
    const sorted = [...SECRET_PATTERN_ALLOWLIST].sort();
    expect(SECRET_PATTERN_ALLOWLIST).toEqual(sorted);
  });
});

// ---------------------------------------------------------------------------
// Admit cases
// ---------------------------------------------------------------------------

describe('isAllowlistedPath — admit', () => {
  test.each([
    '.gobbi/sessions/foo/state.json',
    '.gobbi/worktrees/feat-x/node_modules/something',
    '.gobbi/project/gotchas/bar.md',
    '.gobbi/project/notes/plan.md',
  ])('admits %s', (path) => {
    expect(isAllowlistedPath(path)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Block cases
// ---------------------------------------------------------------------------

describe('isAllowlistedPath — block', () => {
  test.each([
    '.env',
    '/home/me/.aws/credentials',
    'packages/cli/src/.env.local',
    '.gobbi/other-dir/foo',
  ])('blocks %s', (path) => {
    expect(isAllowlistedPath(path)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Fake-secret placeholder content (PR F regex stand-ins)
// ---------------------------------------------------------------------------

describe('isAllowlistedPath — fake-secret content (PR F placeholder)', () => {
  // NOT real tokens — placeholder strings whose shape matches future regexes.
  // The assertion is structural: the allowlist gate is what decides whether
  // PR F's secret-regex match becomes a `guard.warn`.
  const FAKE_AWS = 'AKIAFAKE1234567890';
  const FAKE_GH = 'ghp_FAKE1234567890ABCDEFGHIJKLMNOPQRSTUV';

  test('AWS-like placeholder in allowlisted path is admitted', () => {
    // Even when content contains a regex-shaped secret, an allowlisted path
    // suppresses the warn — that is the whole point of C.12.
    const path = '.gobbi/project/notes/has-fake-key.md';
    const _content = `example: ${FAKE_AWS}`;
    expect(isAllowlistedPath(path)).toBe(true);
  });

  test('GitHub-like placeholder outside allowlist is NOT admitted', () => {
    // Path-level: PR F's regex would fire on this content because the
    // allowlist gate returns false — exactly the path/content escalation
    // the design specifies.
    const path = 'packages/cli/src/leak.ts';
    const _content = `token = "${FAKE_GH}"`;
    expect(isAllowlistedPath(path)).toBe(false);
  });
});
