/**
 * Contract test for the repo's `.gitignore` boundary around the two
 * Pass-4 workspace-scoped DBs.
 *
 * The orchestration redesign (`.gobbi/projects/gobbi/design/v050-features/
 * orchestration/README.md` §3.4 + System F-1) splits the per-session
 * `gobbi.db` into two workspace-scoped DBs:
 *
 *   - `.gobbi/state.db`  — append-only event log; gitignored
 *   - `.gobbi/gobbi.db`  — cross-session memories projection; **git-tracked**
 *
 * The git-tracked memories DB is what the markdown→sqlite read model
 * projects, and it must not be silently swallowed by the existing
 * `.gobbi/*` ignore rule. The `!.gobbi/gobbi.db` exception added in
 * Wave A.1.8 unblocks that one path; everything else under `.gobbi/`
 * stays ignored except the existing `!.gobbi/projects/` whitelist.
 *
 * This test asserts the four boundary cases by shelling out to
 * `git check-ignore --verbose`. The verbose flag prints the matching
 * pattern on stderr, so a regression that flips the wrong file
 * surfaces with the offending rule rather than a silent boolean.
 *
 * Pattern reference for repo-root resolution + `Bun.spawn` invocation —
 * mirrors `__tests__/hooks-contract.test.ts:48` (path hop) and
 * `workflow/__tests__/verification-scheduler.test.ts:38` (spawn shape).
 *
 * @see `.gobbi/projects/gobbi/design/v050-features/orchestration/README.md` §3.4
 * @see Pass-4 success criterion §13.9 — `.gitignore boundary`
 */

import { describe, expect, test } from 'bun:test';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// Path resolution — this file lives at
// `packages/cli/src/__tests__/gitignore.test.ts`; hop four directories up
// to reach the repo root that owns the `.gitignore`.
// ---------------------------------------------------------------------------

const REPO_ROOT: string = join(import.meta.dir, '..', '..', '..', '..');

// ---------------------------------------------------------------------------
// `git check-ignore` runner
// ---------------------------------------------------------------------------

/**
 * Outcome of `git check-ignore --verbose --non-matching -- <path>`.
 *
 * `--verbose` prints the matching `<source>:<line>:<pattern>\t<path>` tuple
 * on stdout. `--non-matching` makes the command emit a tab-prefixed
 * pathname even when no pattern matches at all (so the runner can
 * distinguish "no match" from "negation match" — both exit 0/1 cases that
 * change interpretation across git versions).
 *
 * Decision rule for "is the path ignored?" — read the pattern column,
 * NOT the exit code:
 *
 *   - Pattern starts with `!`     → path is un-ignored (negation match)
 *   - Pattern empty (no rule fired) → path is un-ignored (default state)
 *   - Pattern non-empty, no `!`   → path IS ignored
 *
 * `git check-ignore`'s exit code is unreliable across versions for the
 * negation case (git 2.43 exits 0 for negation matches even though the
 * path is not actually ignored). The pattern-column read is the
 * authoritative signal.
 */
interface IgnoreResult {
  readonly ignored: boolean;
  readonly pattern: string;
  readonly source: string;
  readonly raw: string;
}

async function checkIgnore(repoRoot: string, path: string): Promise<IgnoreResult> {
  // `--no-index` evaluates rules without requiring the path to exist on
  // disk. `--non-matching` forces an output line even when no rule fires,
  // so we never see a silent "exit 1, no stdout" branch. The `--`
  // terminator guards against any path that begins with `-`.
  const proc = Bun.spawn({
    cmd: [
      'git',
      'check-ignore',
      '--verbose',
      '--non-matching',
      '--no-index',
      '--',
      path,
    ],
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const [stdout, exited] = await Promise.all([
    new Response(proc.stdout).text(),
    proc.exited,
  ]);
  // Exit codes 0 and 1 are both expected (matched / non-matching); 128
  // means the runner itself failed (not a repo, malformed args, etc.).
  if (exited !== 0 && exited !== 1) {
    throw new Error(
      `git check-ignore failed for ${path}: exit=${exited} stdout=${stdout}`,
    );
  }
  // Verbose --non-matching format: `<source>:<line>:<pattern>\t<pathname>`.
  // Empty source/line/pattern fields (e.g. `::\tREADME.md`) mean no rule
  // matched — the path is un-ignored by default. A pattern that begins
  // with `!` means a negation rule matched — also un-ignored.
  const line = stdout.split('\n')[0] ?? '';
  const tab = line.indexOf('\t');
  const head = tab >= 0 ? line.slice(0, tab) : '';
  const parts = head.split(':');
  const source = parts[0] ?? '';
  const pattern = parts.slice(2).join(':');
  const ignored = pattern !== '' && !pattern.startsWith('!');
  return { ignored, pattern, source, raw: stdout.trim() };
}

// ---------------------------------------------------------------------------
// Boundary assertions
// ---------------------------------------------------------------------------

describe('.gitignore boundary — workspace-scoped DBs (Pass-4 orchestration §3.4)', () => {
  test('.gobbi/state.db IS ignored (matched by .gobbi/* rule)', async () => {
    const result = await checkIgnore(REPO_ROOT, '.gobbi/state.db');
    expect(result.ignored).toBe(true);
    // The matching rule must be the broad `.gobbi/*` pattern (not a
    // negation), and it must come from the repo-root `.gitignore` so
    // operators can find it.
    expect(result.pattern).toBe('.gobbi/*');
    expect(result.source).toBe('.gitignore');
  });

  test('.gobbi/gobbi.db is NOT ignored (un-ignored by !.gobbi/gobbi.db exception)', async () => {
    const result = await checkIgnore(REPO_ROOT, '.gobbi/gobbi.db');
    expect(result.ignored).toBe(false);
    // The negation rule must be the one we added in Wave A.1.8 — assert
    // the pattern explicitly so a future un-related negation cannot
    // silently take its place.
    expect(result.pattern).toBe('!.gobbi/gobbi.db');
    expect(result.source).toBe('.gitignore');
  });

  test('.gobbi/sessions/<id>/gobbi.db IS ignored (per-session, not the workspace store)', async () => {
    // The per-session legacy path lives under `.gobbi/sessions/<id>/`;
    // the parent `.gobbi/sessions/` matches `.gobbi/*` so the whole
    // subtree is ignored. The negation only applies to the literal
    // workspace-root `.gobbi/gobbi.db` path, not nested copies.
    const result = await checkIgnore(
      REPO_ROOT,
      '.gobbi/sessions/01HXYZTESTSESSION00000000/gobbi.db',
    );
    expect(result.ignored).toBe(true);
  });

  test('.gobbi/state.db-wal IS ignored (sibling of state.db, no exception)', async () => {
    // The WAL companion file is created by SQLite alongside the main DB;
    // it stays gitignored under the broad `.gobbi/*` rule because no
    // `!`-rule un-ignores it.
    const result = await checkIgnore(REPO_ROOT, '.gobbi/state.db-wal');
    expect(result.ignored).toBe(true);
  });
});
