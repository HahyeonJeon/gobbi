/**
 * Pass-3 Task T2 — compile-time + runtime proofs for `CascadeShape` and
 * `toCascadeProjection`.
 *
 *   - The `CascadeShape` type lives in a dedicated `cascade-shape.ts`
 *     module so both `config-store.ts` (T2) and `config-cascade.ts`
 *     (T3) can import the interface without introducing a circular
 *     runtime import.
 *   - `toCascadeProjection` must be assignable to `Partial<CascadeShape> | null`
 *     so downstream callers (the T3 resolver) can compose tier overlays
 *     without casts.
 *   - NULL SQL columns must not project into the overlay — the overlay
 *     omits paths whose underlying session field is NULL or out-of-enum,
 *     so the resolver delegates to T2 / defaults.
 */

import { afterEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { CascadeShape } from '../cascade-shape.js';
import { ConfigStore, openConfigStore, toCascadeProjection } from '../config-store.js';
import type { Session } from '../config.js';

// ---------------------------------------------------------------------------
// Scratch repo lifecycle
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

function scratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-t2-cs-'));
  scratchDirs.push(dir);
  return dir;
}

afterEach(() => {
  while (scratchDirs.length > 0) {
    const d = scratchDirs.pop();
    if (d !== undefined) {
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Session factory
// ---------------------------------------------------------------------------

function makeSession(overrides: Partial<Session> = {}): Session {
  const ts = '2026-01-01T00:00:00Z';
  return {
    trivialRange: 'read-only',
    evaluationMode: 'ask-each-time',
    gitWorkflow: 'direct-commit',
    baseBranch: null,
    notify: { slack: false, telegram: false },
    createdAt: ts,
    lastAccessedAt: ts,
    ...overrides,
  };
}

// ===========================================================================
// Compile-time assertion — toCascadeProjection returns Partial<CascadeShape> | null
// ===========================================================================

describe('CascadeShape — compile-time contract', () => {
  test('toCascadeProjection return type is assignable to Partial<CascadeShape> | null', () => {
    using store = new ConfigStore(':memory:');
    store.upsertSession('sess', makeSession());
    // Drift gate: if a future edit widens the return type beyond
    // `Partial<CascadeShape> | null`, this assignment fails to compile.
    const r: Partial<CascadeShape> | null = toCascadeProjection(store, 'sess');
    expect(r).not.toBeNull();
  });
});

// ===========================================================================
// Runtime behavior — projection semantics
// ===========================================================================

describe('toCascadeProjection — non-existent session', () => {
  test('returns null when the session is not present', () => {
    using store = new ConfigStore(':memory:');
    expect(toCascadeProjection(store, 'no-such-session')).toBeNull();
  });
});

describe('toCascadeProjection — non-NULL sessions project all known paths', () => {
  test('includes notify + git + trivialRange when every column is set', () => {
    using store = new ConfigStore(':memory:');
    store.upsertSession(
      'sess',
      makeSession({
        trivialRange: 'simple-edits',
        gitWorkflow: 'worktree-pr',
        baseBranch: 'develop',
        notify: { slack: true, telegram: true },
      }),
    );

    const projection = toCascadeProjection(store, 'sess');
    expect(projection).not.toBeNull();
    expect(projection).toEqual({
      // discord is intentionally omitted — no SQLite column. Provenance
      // falls through to T2 / T1 / default instead of mis-attributing to T3.
      notify: { slack: true, telegram: true },
      trivialRange: 'simple-edits',
      git: { mode: 'worktree-pr', baseBranch: 'develop' },
    });
  });
});

describe('toCascadeProjection — NULL/unknown columns skip (ARCH-F7)', () => {
  test('base_branch NULL → git overlay omitted entirely', () => {
    using store = new ConfigStore(':memory:');
    store.upsertSession(
      'sess',
      makeSession({
        gitWorkflow: 'direct-commit',
        baseBranch: null,
      }),
    );

    const projection = toCascadeProjection(store, 'sess');
    expect(projection).not.toBeNull();
    // `git` is omitted — CascadeShape.git requires both mode and baseBranch,
    // so a partial git (mode-only) would violate `Partial<CascadeShape>`.
    expect(projection && 'git' in projection).toBe(false);
    // `notify` still present — slack/telegram projected; discord omitted
    // so provenance resolves it from T2 / T1 / default, not the session.
    expect(projection?.notify).toEqual({
      slack: false,
      telegram: false,
    });
  });

  test('trivial_range out-of-enum → trivialRange omitted', () => {
    using store = new ConfigStore(':memory:');
    // Inject a row with an unexpected trivial_range value by bypassing
    // the typed setField path (upsert with a bespoke value).
    store.upsertSession(
      'sess',
      makeSession({
        trivialRange: 'custom-unknown-value',
      }),
    );

    const projection = toCascadeProjection(store, 'sess');
    expect(projection).not.toBeNull();
    expect(projection && 'trivialRange' in projection).toBe(false);
  });

  test('git_workflow out-of-enum → git overlay omitted', () => {
    using store = new ConfigStore(':memory:');
    store.upsertSession(
      'sess',
      makeSession({
        gitWorkflow: 'unknown-workflow',
        baseBranch: 'develop',
      }),
    );

    const projection = toCascadeProjection(store, 'sess');
    expect(projection).not.toBeNull();
    expect(projection && 'git' in projection).toBe(false);
  });
});

// ===========================================================================
// End-to-end — real on-disk config.db via openConfigStore
// ===========================================================================

describe('toCascadeProjection — integrates with openConfigStore', () => {
  test('projection is stable across open/close cycles', () => {
    const repo = scratchRepo();
    mkdirSync(join(repo, '.gobbi'), { recursive: true });
    {
      using store = openConfigStore(repo);
      store.upsertSession(
        'live',
        makeSession({
          trivialRange: 'read-only',
          gitWorkflow: 'direct-commit',
          baseBranch: 'main',
          notify: { slack: true, telegram: false },
        }),
      );
    }
    {
      using store = openConfigStore(repo);
      const projection = toCascadeProjection(store, 'live');
      expect(projection).toEqual({
        notify: { slack: true, telegram: false },
        trivialRange: 'read-only',
        git: { mode: 'direct-commit', baseBranch: 'main' },
      });
    }
  });
});
