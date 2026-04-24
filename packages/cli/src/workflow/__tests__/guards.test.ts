/**
 * Unit tests for the guard-spec module — matcher wildcard expansion,
 * lookup correctness, and the `buildReason` shape.
 *
 * The production `GUARDS` registry is empty in PR C wave 6, so these tests
 * build synthetic matchers via {@link buildGuardMatcher} with inline
 * fixture guards. That keeps coverage focused on the matcher's algebra,
 * independent of whatever guard rules later waves / PRs contribute.
 */

import { describe, expect, test } from 'bun:test';

import {
  buildGuardMatcher,
  buildReason,
  GUARDS,
  type Guard,
} from '../guards.js';
import type { WorkflowStep } from '../state.js';

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function denyGuard(
  id: string,
  step: readonly WorkflowStep[] | '*',
  tool: readonly string[] | '*',
): Guard {
  return {
    id,
    matcher: { step, tool },
    predicate: 'always',
    effect: 'deny',
    reason: `fixture deny ${id}`,
  };
}

function warnGuard(
  id: string,
  step: readonly WorkflowStep[] | '*',
  tool: readonly string[] | '*',
): Guard {
  return {
    id,
    matcher: { step, tool },
    predicate: 'always',
    effect: 'warn',
    reason: `fixture warn ${id}`,
    code: 'W001_GUARD_WARN_GENERIC',
  };
}

// ---------------------------------------------------------------------------
// Default registry
// ---------------------------------------------------------------------------

describe('GUARDS default registry', () => {
  test('is empty through PR C wave 6 — later waves populate it', () => {
    expect(GUARDS).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Matcher — exact match
// ---------------------------------------------------------------------------

describe('buildGuardMatcher — exact match', () => {
  test('returns guards whose (step, tool) pair matches exactly', () => {
    const matcher = buildGuardMatcher([
      denyGuard('g1', ['execution'], ['Write']),
      denyGuard('g2', ['planning'], ['Edit']),
    ]);
    const hits = matcher.match('execution', 'Write');
    expect(hits.map((g) => g.id)).toEqual(['g1']);
  });

  test('cartesian product — multiple steps and multiple tools', () => {
    const matcher = buildGuardMatcher([
      denyGuard('g1', ['execution', 'planning'], ['Write', 'Edit']),
    ]);
    expect(matcher.match('execution', 'Write').map((g) => g.id)).toEqual(['g1']);
    expect(matcher.match('execution', 'Edit').map((g) => g.id)).toEqual(['g1']);
    expect(matcher.match('planning', 'Write').map((g) => g.id)).toEqual(['g1']);
    expect(matcher.match('planning', 'Edit').map((g) => g.id)).toEqual(['g1']);
    expect(matcher.match('ideation', 'Write')).toEqual([]);
    expect(matcher.match('execution', 'Read')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Matcher — step wildcard
// ---------------------------------------------------------------------------

describe('buildGuardMatcher — step wildcard', () => {
  test('step: "*" matches every step for the listed tools', () => {
    const matcher = buildGuardMatcher([
      denyGuard('sw', '*', ['Write']),
    ]);
    expect(matcher.match('execution', 'Write').map((g) => g.id)).toEqual(['sw']);
    expect(matcher.match('planning', 'Write').map((g) => g.id)).toEqual(['sw']);
    expect(matcher.match('ideation', 'Write').map((g) => g.id)).toEqual(['sw']);
    expect(matcher.match('idle', 'Write').map((g) => g.id)).toEqual(['sw']);
    // Tool mismatch — still empty.
    expect(matcher.match('execution', 'Edit')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Matcher — tool wildcard
// ---------------------------------------------------------------------------

describe('buildGuardMatcher — tool wildcard', () => {
  test('tool: "*" matches every tool for the listed steps', () => {
    const matcher = buildGuardMatcher([
      denyGuard('tw', ['execution'], '*'),
    ]);
    expect(matcher.match('execution', 'Write').map((g) => g.id)).toEqual(['tw']);
    expect(matcher.match('execution', 'Edit').map((g) => g.id)).toEqual(['tw']);
    expect(matcher.match('execution', 'SomeNewTool').map((g) => g.id)).toEqual([
      'tw',
    ]);
    // Step mismatch — still empty.
    expect(matcher.match('planning', 'Write')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Matcher — both wildcards
// ---------------------------------------------------------------------------

describe('buildGuardMatcher — both wildcards', () => {
  test('step: "*" + tool: "*" matches every pair', () => {
    const matcher = buildGuardMatcher([
      denyGuard('ww', '*', '*'),
    ]);
    expect(matcher.match('execution', 'Write').map((g) => g.id)).toEqual(['ww']);
    expect(matcher.match('planning', 'Edit').map((g) => g.id)).toEqual(['ww']);
    expect(matcher.match('ideation', 'Read').map((g) => g.id)).toEqual(['ww']);
    expect(matcher.match('done', 'Whatever').map((g) => g.id)).toEqual(['ww']);
  });
});

// ---------------------------------------------------------------------------
// Matcher — no match
// ---------------------------------------------------------------------------

describe('buildGuardMatcher — no match', () => {
  test('returns an empty array when no guard admits the pair', () => {
    const matcher = buildGuardMatcher([
      denyGuard('g', ['execution'], ['Write']),
    ]);
    expect(matcher.match('planning', 'Read')).toEqual([]);
  });

  test('empty registry — every lookup is empty', () => {
    const matcher = buildGuardMatcher([]);
    expect(matcher.match('execution', 'Write')).toEqual([]);
    expect(matcher.match('planning', 'Edit')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Matcher — ordering across bucket families
// ---------------------------------------------------------------------------

describe('buildGuardMatcher — order preservation', () => {
  test('concatenation order is: exact, step-wild, tool-wild, full-wild', () => {
    // Authored in a deliberately scrambled source order so the bucket
    // concat order (not source order alone) drives the assertion.
    const matcher = buildGuardMatcher([
      warnGuard('full', '*', '*'),
      warnGuard('tool-wild', ['execution'], '*'),
      warnGuard('step-wild', '*', ['Write']),
      warnGuard('exact', ['execution'], ['Write']),
    ]);
    const ids = matcher.match('execution', 'Write').map((g) => g.id);
    // exact first, then step-wildcard, then tool-wildcard, then full-wildcard.
    expect(ids).toEqual(['exact', 'step-wild', 'tool-wild', 'full']);
  });

  test('multiple guards in the same bucket preserve registry order', () => {
    const matcher = buildGuardMatcher([
      warnGuard('a', ['execution'], ['Write']),
      warnGuard('b', ['execution'], ['Write']),
      warnGuard('c', ['execution'], ['Write']),
    ]);
    expect(matcher.match('execution', 'Write').map((g) => g.id)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });
});

// ---------------------------------------------------------------------------
// buildReason — deny reason shape
// ---------------------------------------------------------------------------

describe('buildReason', () => {
  test('appends guard id and current step to the guard reason', () => {
    const guard = denyGuard('fixture-deny', ['execution'], ['Write']);
    expect(buildReason(guard, 'execution')).toBe(
      'fixture deny fixture-deny (guard: fixture-deny, step: execution)',
    );
  });
});
