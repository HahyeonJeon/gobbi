/**
 * Unit tests for `lib/settings-io.ts` — focused on the per-project
 * cascade and PR-FIN-1c reshape.
 *
 * Cascade resolves project-level and session-level settings files under
 * `.gobbi/projects/<projectName>/...`. `resolveSettings` takes an
 * optional `projectName` param that overrides the default
 * (`basename(repoRoot)`); both `load/writeSettingsAtLevel` accept an
 * optional `projectName` suffix on the same resolution ladder.
 *
 * PR-FIN-1c: the `Settings.projects` registry was removed. Project-name
 * resolution is now: explicit `projectName` arg → `basename(repoRoot)`.
 *
 * Coverage:
 *   1. `resolveSettings({projectName: 'gobbi'})` reads the gobbi-slot cascade.
 *   2. `resolveSettings({projectName: 'foo'})` reads the foo-slot cascade.
 *   3. `resolveSettings({})` defaults to `basename(repoRoot)`.
 *   4. 4-level cascade: defaults → workspace → project → session merges in
 *      priority order when both projectName + sessionId are provided.
 *   5. Cross-project isolation — project A's settings do not bleed into
 *      project B's cascade.
 *   6. `projectSettingsPath('foo')` returns `.gobbi/projects/foo/settings.json`.
 *   7. `projectSettingsPath` agrees with `workspace-paths.ts::projectDir`.
 *   8. `writeSettingsAtLevel('project', ..., projectName: 'foo')` writes
 *      into `.gobbi/projects/foo/settings.json`.
 *   9. `sessionSettingsPath('foo', 'sess-123')` returns the right path.
 *  10. `resolveSettings` at session level uses the resolved project name
 *      for the session path too.
 *  11. PR-FIN-1c cross-field check: `pr.open=true` + `baseBranch=null`
 *      throws `ConfigCascadeError('parse', …)`.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { ConfigCascadeError, type Settings } from '../settings.js';
import {
  loadSettingsAtLevel,
  projectSettingsPath,
  resolveSettings,
  sessionSettingsPath,
  workspaceSettingsPath,
  writeSettingsAtLevel,
} from '../settings-io.js';
import { projectDir, sessionDir } from '../workspace-paths.js';

// ---------------------------------------------------------------------------
// Scratch lifecycle
// ---------------------------------------------------------------------------

let scratchDir: string;

beforeEach(() => {
  scratchDir = mkdtempSync(join(tmpdir(), 'gobbi-settings-io-'));
});

afterEach(() => {
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

/** Minimum-shape Settings fragment — AJV requires only `schemaVersion`. */
function minimal(extra: Partial<Settings> = {}): Settings {
  return {
    schemaVersion: 1,
    ...extra,
  } as Settings;
}

// ---------------------------------------------------------------------------
// Path helper tests (6, 7, 9) — pure shape
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
    writeJson(
      workspaceSettingsPath(scratchDir),
      minimal({ git: { baseBranch: 'main' } }),
    );
    writeJson(
      projectSettingsPath(scratchDir, 'gobbi'),
      minimal({ git: { pr: { draft: false } } }),
    );

    const resolved = resolveSettings({ repoRoot: scratchDir, projectName: 'gobbi' });
    expect(resolved.git?.baseBranch).toBe('main');
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
// resolveSettings — basename fallback (test 3)
// ---------------------------------------------------------------------------

describe('resolveSettings — basename fallback', () => {
  test('resolves projectName to basename(repoRoot) when no override', () => {
    const repoBasename = basename(scratchDir);
    // Project at the basename slot sets a distinctive marker.
    writeJson(
      projectSettingsPath(scratchDir, repoBasename),
      minimal({ git: { pr: { draft: false } } }),
    );

    const resolved = resolveSettings({ repoRoot: scratchDir });
    expect(resolved.git?.pr?.draft).toBe(false);
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
      // Workspace declares pr.open + baseBranch to satisfy the cross-field
      // invariant; pr.draft set so session/project narrowing is observable.
      git: { baseBranch: 'main', pr: { open: true, draft: true } },
    });
    writeJson(projectSettingsPath(scratchDir, projectName), {
      schemaVersion: 1,
      git: { pr: { draft: false } },
    });
    writeJson(sessionSettingsPath(scratchDir, projectName, sessionId), {
      schemaVersion: 1,
      git: { branch: { autoRemove: false } },
    });

    const resolved = resolveSettings({ repoRoot: scratchDir, projectName, sessionId });
    expect(resolved.git?.baseBranch).toBe('main');
    expect(resolved.git?.pr?.open).toBe(true);
    expect(resolved.git?.pr?.draft).toBe(false);
    // Session overrode branch.autoRemove; worktree.autoRemove still from DEFAULTS.
    expect(resolved.git?.branch?.autoRemove).toBe(false);
    expect(resolved.git?.worktree?.autoRemove).toBe(true);
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
// writeSettingsAtLevel with projectName (test 8)
// ---------------------------------------------------------------------------

describe('writeSettingsAtLevel — named project dir', () => {
  test('writes to `.gobbi/projects/foo/settings.json` when projectName is "foo"', () => {
    const settings = minimal({ git: { pr: { draft: false } } });
    writeSettingsAtLevel(scratchDir, 'project', settings, undefined, 'foo');

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
// Session-level path composition (test 10)
// ---------------------------------------------------------------------------

describe('resolveSettings — session path uses resolved project name', () => {
  test('session file at `projects/<projectName>/sessions/<sessionId>/` is read', () => {
    const sessionId = 'sess-path-1';
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
    writeJson(
      sessionSettingsPath(scratchDir, 'other', sessionId),
      minimal({ notify: { desktop: { enabled: true } } }),
    );

    const resolved = resolveSettings({
      repoRoot: scratchDir,
      projectName: 'mine',
      sessionId,
    });
    expect(resolved.notify?.desktop?.enabled).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Cross-project cascade precedence (W6.3)
// ---------------------------------------------------------------------------

describe('resolveSettings — cross-project cascade precedence', () => {
  test('per-project workspace > project > session precedence holds in parallel', () => {
    writeJson(workspaceSettingsPath(scratchDir), {
      schemaVersion: 1,
      git: { baseBranch: 'main', pr: { open: true, draft: true } },
    });

    // foo overrides pr.draft; leaves branch alone.
    writeJson(
      projectSettingsPath(scratchDir, 'foo'),
      minimal({ git: { pr: { draft: false } } }),
    );
    // bar leaves pr.draft alone (inherits true); overrides branch.autoRemove.
    writeJson(
      projectSettingsPath(scratchDir, 'bar'),
      minimal({ git: { branch: { autoRemove: false } } }),
    );

    const sessionId = 'sess-shared';
    // foo session overrides worktree.autoRemove → false.
    writeJson(
      sessionSettingsPath(scratchDir, 'foo', sessionId),
      minimal({ git: { worktree: { autoRemove: false } } }),
    );
    // bar session overrides pr.draft → false.
    writeJson(
      sessionSettingsPath(scratchDir, 'bar', sessionId),
      minimal({ git: { pr: { draft: false } } }),
    );

    const fooResolved = resolveSettings({ repoRoot: scratchDir, projectName: 'foo', sessionId });
    const barResolved = resolveSettings({ repoRoot: scratchDir, projectName: 'bar', sessionId });

    // foo cascade
    expect(fooResolved.git?.baseBranch).toBe('main');
    expect(fooResolved.git?.pr?.open).toBe(true);
    expect(fooResolved.git?.pr?.draft).toBe(false);
    expect(fooResolved.git?.worktree?.autoRemove).toBe(false);
    expect(fooResolved.git?.branch?.autoRemove).toBe(true);

    // bar cascade
    expect(barResolved.git?.baseBranch).toBe('main');
    expect(barResolved.git?.pr?.draft).toBe(false);
    expect(barResolved.git?.branch?.autoRemove).toBe(false);
    expect(barResolved.git?.worktree?.autoRemove).toBe(true);
  });

  test('session-tier override in project foo does not leak into project bar', () => {
    writeJson(workspaceSettingsPath(scratchDir), minimal());
    const sessionId = 'sess-leak-check';
    writeJson(
      sessionSettingsPath(scratchDir, 'foo', sessionId),
      minimal({ notify: { desktop: { enabled: true } } }),
    );

    const fooResolved = resolveSettings({ repoRoot: scratchDir, projectName: 'foo', sessionId });
    const barResolved = resolveSettings({ repoRoot: scratchDir, projectName: 'bar', sessionId });

    expect(fooResolved.notify?.desktop?.enabled).toBe(true);
    expect(barResolved.notify?.desktop?.enabled).toBe(false);
  });

  test('writes via projectName="foo" land only in projects/foo/', () => {
    const fooSettings = minimal({ git: { pr: { draft: false } } });
    writeSettingsAtLevel(scratchDir, 'project', fooSettings, undefined, 'foo');

    expect(loadSettingsAtLevel(scratchDir, 'project', undefined, 'foo')).toEqual(fooSettings);
    expect(loadSettingsAtLevel(scratchDir, 'project', undefined, 'bar')).toBeNull();
    expect(loadSettingsAtLevel(scratchDir, 'workspace')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Cross-field check (test 11) — PR-FIN-1c invariant
// ---------------------------------------------------------------------------

describe('resolveSettings — PR-FIN-1c cross-field check', () => {
  test('pr.open=true + baseBranch=null throws ConfigCascadeError(parse)', () => {
    writeJson(projectSettingsPath(scratchDir, basename(scratchDir)), {
      schemaVersion: 1,
      git: { baseBranch: null, pr: { open: true } },
    });

    try {
      resolveSettings({ repoRoot: scratchDir });
      throw new Error('expected ConfigCascadeError');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigCascadeError);
      if (err instanceof ConfigCascadeError) {
        expect(err.code).toBe('parse');
        expect(err.message).toMatch(/pr\.open/);
        expect(err.message).toMatch(/baseBranch/);
      }
    }
  });

  test('pr.open=false + baseBranch=null is allowed', () => {
    writeJson(projectSettingsPath(scratchDir, basename(scratchDir)), {
      schemaVersion: 1,
      git: { baseBranch: null, pr: { open: false } },
    });

    const resolved = resolveSettings({ repoRoot: scratchDir });
    expect(resolved.git?.baseBranch).toBeNull();
    expect(resolved.git?.pr?.open).toBe(false);
  });

  test('pr.open=true + baseBranch="main" is allowed', () => {
    writeJson(projectSettingsPath(scratchDir, basename(scratchDir)), {
      schemaVersion: 1,
      git: { baseBranch: 'main', pr: { open: true } },
    });

    const resolved = resolveSettings({ repoRoot: scratchDir });
    expect(resolved.git?.baseBranch).toBe('main');
    expect(resolved.git?.pr?.open).toBe(true);
  });
});
