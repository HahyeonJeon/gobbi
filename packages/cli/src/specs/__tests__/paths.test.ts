/**
 * Unit tests for `specs/paths.ts` — fallback chain path-stability invariants.
 *
 * # Why this test exists (PR-FIN-2a-iii Tier B.1)
 *
 * `paths.ts` resolves the canonical specs directory through three candidates:
 *
 *   1. `<this-dir>/specs/`            — bundled-mode (post-`build:safe`).
 *   2. `<this-dir>/`                  — source-mode (`bun test` from author tree).
 *   3. `<this-dir>/../src/specs/`     — dev-worktree fallback when the bundled
 *                                       binary runs before `build:safe` populates
 *                                       `dist/specs/`.
 *
 * Architecture eval F5 locks the test invariant: the third candidate must
 * resolve to an **absolute path that does not depend on `process.cwd()`** —
 * NOT existence. Existence is mode-dependent (after `build:safe` runs,
 * candidate 1 wins and the third candidate is never inspected). Asserting
 * existence would either tautologically pass or flake based on whether
 * `dist/specs/` has been seeded; asserting absoluteness pins the actual
 * invariant we care about: the resolved path is stable regardless of
 * where the binary was invoked from.
 *
 * # Strategy
 *
 * `existsSync` is mocked at the module boundary so candidates 1 and 2 report
 * absent. The throw path is then exercised — the error message lists all
 * three attempted paths verbatim. We parse the candidate paths back out of
 * the message, assert each is absolute, and re-run the resolver from a
 * different `process.cwd()` to confirm the candidate paths do not shift.
 *
 * Mocking `existsSync` is module-scoped to this test file (bun:test
 * `mock.module` semantics) so other suites continue using the real fs.
 */

import { afterAll, describe, expect, mock, test } from 'bun:test';
import { isAbsolute } from 'node:path';

// ---------------------------------------------------------------------------
// Mock setup — toggle controls whether existsSync reports the resolver's
// candidates as absent. The handle is queried at every existsSync call so
// individual tests can flip behaviour without re-mocking the module.
// ---------------------------------------------------------------------------

interface ExistsState {
  forceAllAbsent: boolean;
}
const STATE_KEY = '__gobbiPathsTestExistsState__';
function getState(): ExistsState {
  const slot = (globalThis as unknown as Record<string, ExistsState | undefined>)[STATE_KEY];
  if (slot !== undefined) return slot;
  const fresh: ExistsState = { forceAllAbsent: false };
  (globalThis as unknown as Record<string, ExistsState>)[STATE_KEY] = fresh;
  return fresh;
}

// Capture the real existsSync before the mock takes effect so tests that
// want real fs semantics can reach through the toggle.
const realFs = await import('node:fs');
const realExistsSync = realFs.existsSync;

mock.module('node:fs', () => ({
  ...realFs,
  existsSync: (path: string): boolean => {
    if (getState().forceAllAbsent) return false;
    return realExistsSync(path);
  },
}));

// Dynamic import AFTER the mock is registered — module-scoped mocks only
// apply to imports that resolve through them after registration.
const { getSpecsDir } = await import('../paths.js');

// ---------------------------------------------------------------------------
// Test isolation — restore cwd after each navigation; clear forceAllAbsent.
// ---------------------------------------------------------------------------

const ORIGINAL_CWD = process.cwd();
afterAll(() => {
  getState().forceAllAbsent = false;
  process.chdir(ORIGINAL_CWD);
});

// ---------------------------------------------------------------------------
// PATHS-1 — Candidate-3 path-stability invariant.
//
// Force all three candidates to report absent so the resolver throws. The
// thrown error lists the attempted paths; parse them back out, assert each
// is absolute, and re-run from a different cwd to confirm none of the three
// candidate paths depend on `process.cwd()`.
// ---------------------------------------------------------------------------

describe('getSpecsDir — fallback chain path-stability', () => {
  test('PATHS-1: all three candidate paths are absolute and stable across process.cwd() changes', () => {
    getState().forceAllAbsent = true;
    try {
      // First invocation — capture the candidate paths from the throw.
      const firstPaths = collectAttemptedPaths();
      expect(firstPaths).toHaveLength(3);
      for (const candidate of firstPaths) {
        expect(isAbsolute(candidate)).toBe(true);
      }

      // The third candidate is the dev-worktree fallback. It should end in
      // `src/specs` (the relative leg `../src/specs` resolved against the
      // bundle's own directory) — no normalisation surprises.
      const candidate3 = firstPaths[2];
      expect(candidate3).toBeDefined();
      expect(candidate3!.endsWith(`${pathSep()}src${pathSep()}specs`)).toBe(true);

      // Re-run from a different cwd. `paths.ts` uses `import.meta.url`-
      // relative resolution, so changing cwd must NOT shift any of the
      // attempted paths.
      process.chdir('/');
      const secondPaths = collectAttemptedPaths();
      process.chdir(ORIGINAL_CWD);

      expect(secondPaths).toEqual(firstPaths);
    } finally {
      getState().forceAllAbsent = false;
      process.chdir(ORIGINAL_CWD);
    }
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Invoke `getSpecsDir()` expecting it to throw, then parse the three
 * attempted paths out of the diagnostic. The error format is locked at
 * `paths.ts`: `Tried: <p1>, <p2>, <p3>. In bundled mode, ...`.
 */
function collectAttemptedPaths(): readonly string[] {
  let captured: Error | null = null;
  try {
    getSpecsDir();
  } catch (err) {
    captured = err instanceof Error ? err : new Error(String(err));
  }
  expect(captured).not.toBeNull();
  const message = captured!.message;
  const triedMatch = message.match(/Tried: (.+?)\. In bundled mode/);
  expect(triedMatch).not.toBeNull();
  const list = triedMatch![1]!.split(', ').map((s) => s.trim());
  return list;
}

function pathSep(): string {
  // platform-agnostic separator without importing 'path' twice.
  return process.platform === 'win32' ? '\\' : '/';
}
