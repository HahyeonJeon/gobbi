/**
 * Unit tests for `lib/settings-io.ts` — focused on the `projectName`
 * cascade extension introduced by gobbi-memory Pass 2 (W2.2).
 *
 * The cascade now resolves project-level and session-level settings files
 * under `.gobbi/projects/<projectName>/...` instead of the singular
 * `.gobbi/project/...` layout Pass 3 shipped. `resolveSettings` takes an
 * optional `projectName` param that overrides the workspace-level
 * `projects.active` read; both `load/writeSettingsAtLevel` accept an
 * optional `projectName` suffix on the same resolution ladder.
 *
 * Coverage:
 *   1. `resolveSettings({projectName: 'gobbi'})` reads the gobbi-slot cascade.
 *   2. `resolveSettings({projectName: 'foo'})` reads the foo-slot cascade.
 *   3. `resolveSettings({})` with workspace `projects.active: 'bar'` reads
 *      the bar-slot cascade.
 *   4. 4-level cascade: defaults → workspace → project → session merges in
 *      priority order when both projectName + sessionId are provided.
 *   5. Cross-project isolation — project A's settings do not bleed into
 *      project B's cascade.
 *   6. `projectSettingsPath('foo')` returns `.gobbi/projects/foo/settings.json`.
 *   7. `projectSettingsPath` agrees with `workspace-paths.ts::projectDir`.
 *   8. `resolveSettings` falls back to the `'gobbi'` literal (with stderr
 *      warning) when no projectName argument AND no `projects.active`.
 *   9. `writeSettingsAtLevel('project', ..., projectName: 'foo')` writes
 *      into `.gobbi/projects/foo/settings.json`.
 *  10. Existing 3-level cascade tests (workspace/project/session without
 *      projectName) still pass when projectName is omitted.
 *  11. `sessionSettingsPath('foo', 'sess-123')` returns
 *      `.gobbi/projects/foo/sessions/sess-123/settings.json`.
 *  12. `resolveSettings` at session level uses the resolved project name
 *      for the session path too (cross-level project consistency).
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { Settings } from '../settings.js';
import {
  __resetFallbackWarningLatchForTests,
  loadSettingsAtLevel,
  projectSettingsPath,
  resolveSettings,
  sessionSettingsPath,
  workspaceSettingsPath,
  writeSettingsAtLevel,
} from '../settings-io.js';
import { projectDir, sessionDir } from '../workspace-paths.js';

// ---------------------------------------------------------------------------
// Scratch lifecycle + stderr silencer
// ---------------------------------------------------------------------------

let scratchDir: string;
let originalStderrWrite: typeof process.stderr.write;
let stderrBuf: string;

beforeEach(() => {
  scratchDir = mkdtempSync(join(tmpdir(), 'gobbi-settings-io-'));
  // Reset the module-scoped warning latch so per-test assertions on the
  // fallback warning are deterministic across tests within this file.
  __resetFallbackWarningLatchForTests();
  // Capture stderr to assert on the fallback warning in test 8 while
  // keeping the other tests' output quiet.
  stderrBuf = '';
  originalStderrWrite = process.stderr.write.bind(process.stderr);
  process.stderr.write = ((chunk: string | Uint8Array): boolean => {
    stderrBuf += typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);
    return true;
  }) as typeof process.stderr.write;
});

afterEach(() => {
  process.stderr.write = originalStderrWrite;
  try {
    rmSync(scratchDir, { recursive: true, force: true });
  } catch {
    // best-effort
  }
});

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

function writeJson(filePath: string, value: unknown): void {
  mkdirSync(join(filePath, '..'), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

/** Minimum-shape Settings fragment — AJV requires `schemaVersion` + `projects`. */
function minimal(extra: Partial<Settings> = {}): Settings {
  return {
    schemaVersion: 1,
    projects: { active: null, known: [] },
    ...extra,
  } as Settings;
}

// ---------------------------------------------------------------------------
// Path helper tests (6, 7, 11) — pure shape
// ---------------------------------------------------------------------------

describe('projectSettingsPath', () => {
  test('returns `.gobbi/projects/<projectName>/settings.json`', () => {
    const p = projectSettingsPath(scratchDir, 'foo');
    expect(p).toBe(join(scratchDir, '.gobbi', 'projects', 'foo', 'settings.json'));
  });

  test('composes with `workspace-paths.ts::projectDir`', () => {
    const direct = projectSettingsPath(scratchDir, 'foo');
    const composed = join(projectDir(scratchDir, 'foo'), 'settings.json');
    expect(direct).toBe(composed);
  });
});

describe('sessionSettingsPath', () => {
  test('returns `.gobbi/projects/<projectName>/sessions/<sessionId>/settings.json`', () => {
    const p = sessionSettingsPath(scratchDir, 'foo', 'sess-123');
    expect(p).toBe(
      join(scratchDir, '.gobbi', 'projects', 'foo', 'sessions', 'sess-123', 'settings.json'),
    );
  });

  test('composes with `workspace-paths.ts::sessionDir`', () => {
    const direct = sessionSettingsPath(scratchDir, 'foo', 'sess-123');
    const composed = join(sessionDir(scratchDir, 'foo', 'sess-123'), 'settings.json');
    expect(direct).toBe(composed);
  });
});

describe('workspaceSettingsPath', () => {
  test('returns `.gobbi/settings.json` (project-independent)', () => {
    expect(workspaceSettingsPath(scratchDir)).toBe(
      join(scratchDir, '.gobbi', 'settings.json'),
    );
  });
});

// ---------------------------------------------------------------------------
// resolveSettings — explicit projectName (tests 1, 2)
// ---------------------------------------------------------------------------

describe('resolveSettings — explicit projectName', () => {
  test('reads `.gobbi/projects/gobbi/settings.json` when projectName="gobbi"', () => {
    // Seed workspace + project-gobbi.
    writeJson(
      workspaceSettingsPath(scratchDir),
      minimal({ git: { workflow: { mode: 'direct-commit' } } }),
    );
    writeJson(
      projectSettingsPath(scratchDir, 'gobbi'),
      minimal({ git: { pr: { draft: false } } }),
    );

    const resolved = resolveSettings({ repoRoot: scratchDir, projectName: 'gobbi' });
    // Workspace sets mode; project overrides draft.
    expect(resolved.git?.workflow?.mode).toBe('direct-commit');
    expect(resolved.git?.pr?.draft).toBe(false);
  });

  test('reads `.gobbi/projects/foo/settings.json` when projectName="foo"', () => {
    writeJson(workspaceSettingsPath(scratchDir), minimal());
    writeJson(
      projectSettingsPath(scratchDir, 'foo'),
      minimal({ git: { pr: { draft: false } } }),
    );

    const resolved = resolveSettings({ repoRoot: scratchDir, projectName: 'foo' });
    expect(resolved.git?.pr?.draft).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// resolveSettings — workspace projects.active fallback (test 3)
// ---------------------------------------------------------------------------

describe('resolveSettings — workspace projects.active read', () => {
  test('resolves projectName from workspace `projects.active` when no explicit override', () => {
    // Seed workspace with explicit active = 'bar'.
    writeJson(workspaceSettingsPath(scratchDir), {
      schemaVersion: 1,
      projects: { active: 'bar', known: ['bar'] },
    });
    // Project-bar sets a distinctive `git.pr.draft: false` — a primitive
    // leaf that survives deepMerge across all levels. We deliberately do
    // not populate `projects.*` at project level (the project slot does
    // not normally re-declare the workspace-wide registry).
    writeJson(projectSettingsPath(scratchDir, 'bar'), {
      schemaVersion: 1,
      projects: { active: 'bar', known: ['bar'] },
      git: { pr: { draft: false } },
    });
    // Decoy content under projects/gobbi that MUST NOT be read.
    writeJson(projectSettingsPath(scratchDir, 'gobbi'), {
      schemaVersion: 1,
      projects: { active: 'bar', known: ['bar'] },
      git: { pr: { draft: true } },
    });

    const resolved = resolveSettings({ repoRoot: scratchDir });
    // bar's draft=false wins over defaults (which is true).
    expect(resolved.git?.pr?.draft).toBe(false);
    // Confirm the active read — the cascade preserves the workspace value.
    expect(resolved.projects.active).toBe('bar');
  });
});

// ---------------------------------------------------------------------------
// resolveSettings — 4-level merge with projectName + sessionId (test 4)
// ---------------------------------------------------------------------------

describe('resolveSettings — 4-level merge', () => {
  test('defaults → workspace → project(projectName) → session(sessionId) merges in order', () => {
    const sessionId = 'sess-merge-1';
    const projectName = 'foo';

    writeJson(workspaceSettingsPath(scratchDir), {
      schemaVersion: 1,
      projects: { active: null, known: [] },
      // Workspace declares workflow.mode = worktree-pr + baseBranch to keep
      // the post-merge invariant satisfied.
      git: { workflow: { mode: 'worktree-pr', baseBranch: 'main' }, pr: { draft: true } },
    });
    writeJson(projectSettingsPath(scratchDir, projectName), {
      schemaVersion: 1,
      projects: { active: null, known: [] },
      // Project narrows pr.draft to false.
      git: { pr: { draft: false } },
    });
    writeJson(sessionSettingsPath(scratchDir, projectName, sessionId), {
      schemaVersion: 1,
      projects: { active: null, known: [] },
      // Session narrows cleanup.branch to false.
      git: { cleanup: { branch: false } },
    });

    const resolved = resolveSettings({ repoRoot: scratchDir, projectName, sessionId });
    // Workspace-level workflow.mode remains.
    expect(resolved.git?.workflow?.mode).toBe('worktree-pr');
    expect(resolved.git?.workflow?.baseBranch).toBe('main');
    // Project overrode pr.draft.
    expect(resolved.git?.pr?.draft).toBe(false);
    // Session overrode cleanup.branch; cleanup.worktree still comes from DEFAULTS.
    expect(resolved.git?.cleanup?.branch).toBe(false);
    expect(resolved.git?.cleanup?.worktree).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Cross-project isolation (test 5)
// ---------------------------------------------------------------------------

describe('resolveSettings — cross-project isolation', () => {
  test('project A settings do not bleed into project B cascade', () => {
    writeJson(workspaceSettingsPath(scratchDir), minimal());
    writeJson(
      projectSettingsPath(scratchDir, 'alpha'),
      minimal({ git: { pr: { draft: false } } }),
    );
    writeJson(
      projectSettingsPath(scratchDir, 'beta'),
      minimal({ git: { pr: { draft: true } } }),
    );

    const alpha = resolveSettings({ repoRoot: scratchDir, projectName: 'alpha' });
    const beta = resolveSettings({ repoRoot: scratchDir, projectName: 'beta' });

    expect(alpha.git?.pr?.draft).toBe(false);
    expect(beta.git?.pr?.draft).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Fallback warning (test 8)
// ---------------------------------------------------------------------------

describe('resolveSettings — fallback warning', () => {
  test('falls back to "gobbi" with stderr warning when no projectName and no projects.active', () => {
    // No workspace file at all — the fallback resolver hits path 3.
    // (Don't seed any project file either; cascade lands at DEFAULTS.)

    const resolved = resolveSettings({ repoRoot: scratchDir });

    // DEFAULTS applies for everything; the warning surfaces on stderr.
    expect(resolved.schemaVersion).toBe(1);
    expect(stderrBuf).toContain('no projects.active');
    expect(stderrBuf).toContain("'gobbi'");
  });

  test('does NOT warn when projectName is explicit, even without workspace file', () => {
    stderrBuf = '';
    const resolved = resolveSettings({ repoRoot: scratchDir, projectName: 'explicit' });
    expect(resolved.schemaVersion).toBe(1);
    expect(stderrBuf).not.toContain('falling back');
  });
});

// ---------------------------------------------------------------------------
// writeSettingsAtLevel with projectName (test 9)
// ---------------------------------------------------------------------------

describe('writeSettingsAtLevel — named project dir', () => {
  test('writes to `.gobbi/projects/foo/settings.json` when projectName is "foo"', () => {
    const settings = minimal({ git: { pr: { draft: false } } });
    writeSettingsAtLevel(scratchDir, 'project', settings, undefined, 'foo');

    // Read back via loadSettingsAtLevel scoped to foo to confirm the write
    // landed at the expected slot; also read the gobbi slot and confirm
    // it remained absent (no accidental cross-write).
    const readFoo = loadSettingsAtLevel(scratchDir, 'project', undefined, 'foo');
    expect(readFoo).toEqual(settings);

    const readGobbi = loadSettingsAtLevel(scratchDir, 'project', undefined, 'gobbi');
    expect(readGobbi).toBeNull();
  });

  test('writes and reads back a session-level file keyed by projectName', () => {
    const sessionId = 'sess-write-1';
    const settings = minimal();
    writeSettingsAtLevel(scratchDir, 'session', settings, sessionId, 'foo');

    const readBack = loadSettingsAtLevel(scratchDir, 'session', sessionId, 'foo');
    expect(readBack).toEqual(settings);
  });
});

// ---------------------------------------------------------------------------
// Backward-compat (test 10) — existing signature without projectName works
// ---------------------------------------------------------------------------

describe('resolveSettings — backward-compat without projectName', () => {
  test('3-level cascade without projectName still resolves via projects.active', () => {
    // Workspace points at project "compat"; no projectName arg passed.
    writeJson(workspaceSettingsPath(scratchDir), {
      schemaVersion: 1,
      projects: { active: 'compat', known: ['compat'] },
      git: { workflow: { mode: 'direct-commit' } },
    });
    writeJson(
      projectSettingsPath(scratchDir, 'compat'),
      minimal({ git: { pr: { draft: false } } }),
    );
    const sessionId = 'sess-compat-1';
    writeJson(
      sessionSettingsPath(scratchDir, 'compat', sessionId),
      minimal({ git: { cleanup: { branch: false } } }),
    );

    // Old call shape — only repoRoot + sessionId, no projectName.
    const resolved = resolveSettings({ repoRoot: scratchDir, sessionId });
    expect(resolved.git?.workflow?.mode).toBe('direct-commit');
    expect(resolved.git?.pr?.draft).toBe(false);
    expect(resolved.git?.cleanup?.branch).toBe(false);
  });

  test('3-level cascade without projectName and without sessionId resolves via projects.active', () => {
    writeJson(workspaceSettingsPath(scratchDir), {
      schemaVersion: 1,
      projects: { active: 'compat', known: ['compat'] },
    });
    writeJson(
      projectSettingsPath(scratchDir, 'compat'),
      minimal({ git: { pr: { draft: false } } }),
    );

    const resolved = resolveSettings({ repoRoot: scratchDir });
    expect(resolved.git?.pr?.draft).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Session-level path composition (test 12)
// ---------------------------------------------------------------------------

describe('resolveSettings — session path uses resolved project name', () => {
  test('session file at `projects/<projectName>/sessions/<sessionId>/` is read', () => {
    const sessionId = 'sess-path-1';
    // No workspace `projects.active` — pass projectName explicitly.
    const projectName = 'baz';
    writeJson(
      sessionSettingsPath(scratchDir, projectName, sessionId),
      minimal({ notify: { desktop: { enabled: true } } }),
    );

    const resolved = resolveSettings({ repoRoot: scratchDir, projectName, sessionId });
    expect(resolved.notify?.desktop?.enabled).toBe(true);
  });

  test('session file under a DIFFERENT project is NOT picked up', () => {
    const sessionId = 'sess-path-2';
    // Decoy — same sessionId under a different project.
    writeJson(
      sessionSettingsPath(scratchDir, 'other', sessionId),
      minimal({ notify: { desktop: { enabled: true } } }),
    );

    // Reading with the "wrong" projectName — expected miss, enabled stays
    // at DEFAULTS (false).
    const resolved = resolveSettings({
      repoRoot: scratchDir,
      projectName: 'mine',
      sessionId,
    });
    expect(resolved.notify?.desktop?.enabled).toBe(false);
  });
});

