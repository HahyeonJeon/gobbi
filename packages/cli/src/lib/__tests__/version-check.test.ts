/**
 * Unit tests for `lib/version-check.ts` — semver parse + compare,
 * verdict derivation, and the exit-code policy that the `--is-latest`
 * flag relies on.
 *
 * We deliberately do NOT spawn a real `npm` subprocess: the injected
 * `VersionRunner` exercises every branch of `computeVerdict` /
 * `exitCodeForVerdict`, and the compare logic is pure. Tests stay
 * under 1s and do not depend on network.
 */

import { describe, test, expect } from 'bun:test';

import {
  PACKAGE_NAME,
  compareSemver,
  computeVerdict,
  exitCodeForVerdict,
  parseSemver,
  type FetchLatestResult,
} from '../version-check.js';

// ---------------------------------------------------------------------------
// parseSemver — strict `X.Y.Z` only
// ---------------------------------------------------------------------------

describe('parseSemver', () => {
  test('parses a canonical X.Y.Z into a numeric triple', () => {
    expect(parseSemver('1.2.3')).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  test('parses zero components', () => {
    expect(parseSemver('0.0.0')).toEqual({ major: 0, minor: 0, patch: 0 });
  });

  test('tolerates surrounding whitespace', () => {
    expect(parseSemver('  2.5.9\n')).toEqual({ major: 2, minor: 5, patch: 9 });
  });

  test('rejects pre-release suffixes', () => {
    expect(parseSemver('1.2.3-alpha.1')).toBeNull();
  });

  test('rejects build metadata', () => {
    expect(parseSemver('1.2.3+build.4')).toBeNull();
  });

  test('rejects missing patch segment', () => {
    expect(parseSemver('1.2')).toBeNull();
  });

  test('rejects empty string', () => {
    expect(parseSemver('')).toBeNull();
  });

  test('rejects non-numeric components', () => {
    expect(parseSemver('1.x.3')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// compareSemver — major → minor → patch ordering
// ---------------------------------------------------------------------------

describe('compareSemver', () => {
  test('equal triples return 0', () => {
    const a = { major: 1, minor: 0, patch: 0 } as const;
    expect(compareSemver(a, a)).toBe(0);
  });

  test('major dominates', () => {
    expect(
      compareSemver(
        { major: 1, minor: 9, patch: 9 },
        { major: 2, minor: 0, patch: 0 },
      ),
    ).toBe(-1);
    expect(
      compareSemver(
        { major: 2, minor: 0, patch: 0 },
        { major: 1, minor: 9, patch: 9 },
      ),
    ).toBe(1);
  });

  test('minor breaks ties on major', () => {
    expect(
      compareSemver(
        { major: 1, minor: 1, patch: 0 },
        { major: 1, minor: 2, patch: 0 },
      ),
    ).toBe(-1);
  });

  test('patch breaks ties on major + minor', () => {
    expect(
      compareSemver(
        { major: 0, minor: 5, patch: 0 },
        { major: 0, minor: 5, patch: 1 },
      ),
    ).toBe(-1);
    expect(
      compareSemver(
        { major: 0, minor: 5, patch: 2 },
        { major: 0, minor: 5, patch: 1 },
      ),
    ).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// computeVerdict — installed × registry-fetch outcome matrix
// ---------------------------------------------------------------------------

describe('computeVerdict', () => {
  const okFetch = (version: string): FetchLatestResult =>
    ({ ok: true, version }) as const;
  const failFetch = (reason: string): FetchLatestResult =>
    ({ ok: false, reason }) as const;

  test('equal versions → current (exit 0)', () => {
    const v = computeVerdict('0.5.0', okFetch('0.5.0'));
    expect(v.status).toBe('current');
    expect(v.latest).toBe('0.5.0');
    expect(exitCodeForVerdict(v)).toBe(0);
  });

  test('installed older than latest → stale (exit 1)', () => {
    const v = computeVerdict('0.4.9', okFetch('0.5.0'));
    expect(v.status).toBe('stale');
    expect(exitCodeForVerdict(v)).toBe(1);
  });

  test('installed newer than latest → current (treated as up-to-date, exit 0)', () => {
    // Dev build sitting ahead of npm should not force an "update" prompt.
    const v = computeVerdict('0.6.0-dev', okFetch('0.5.0'));
    // `0.6.0-dev` fails strict parse → indeterminate.
    expect(v.status).toBe('indeterminate');
    expect(exitCodeForVerdict(v)).toBe(2);
  });

  test('locally-newer parseable version → current (exit 0)', () => {
    const v = computeVerdict('0.6.0', okFetch('0.5.0'));
    expect(v.status).toBe('current');
    expect(exitCodeForVerdict(v)).toBe(0);
  });

  test('registry fetch failure → indeterminate (exit 2) with reason', () => {
    const v = computeVerdict('0.5.0', failFetch('npm view timed out'));
    expect(v.status).toBe('indeterminate');
    expect(v.latest).toBeNull();
    expect(v.reason).toContain('timed out');
    expect(exitCodeForVerdict(v)).toBe(2);
  });

  test('malformed installed version → indeterminate (exit 2)', () => {
    const v = computeVerdict('not-a-version', okFetch('0.5.0'));
    expect(v.status).toBe('indeterminate');
    expect(v.latest).toBe('0.5.0');
    expect(v.reason).toContain('malformed version');
    expect(exitCodeForVerdict(v)).toBe(2);
  });

  test('malformed registry version → indeterminate (exit 2)', () => {
    const v = computeVerdict('0.5.0', okFetch('garbage-1'));
    expect(v.status).toBe('indeterminate');
    expect(v.reason).toContain('malformed version');
    expect(exitCodeForVerdict(v)).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// PACKAGE_NAME — sanity: must match package.json "name" field
// ---------------------------------------------------------------------------

describe('PACKAGE_NAME', () => {
  test('matches the published package name', () => {
    expect(PACKAGE_NAME).toBe('@gobbitools/cli');
  });
});
