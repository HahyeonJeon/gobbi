/**
 * Unit tests for `lib/workspace-paths.ts` — pure-function facade that owns
 * all `.gobbi/` + `.claude/` path derivation.
 *
 * Every helper is pure (no I/O), so tests are pure assertions on composed
 * strings. No scratch directories, no `mkdtemp`, no filesystem touches.
 *
 * Coverage:
 *   - Shape of each exported function under a stable `repoRoot`.
 *   - Every one of the 15 `ProjectSubdirKind` values round-trips through
 *     `projectSubdir`.
 *   - `claudeSymlinkTarget` returns both absolute paths and composes the
 *     expected relative-link string for each `ClaudeSymlinkKind`.
 *   - Helpers compose (facade consistency — `sessionDir` lives under
 *     `sessionsRoot`, `worktreeDir` lives under `projectSubdir(name,
 *     'worktrees')`, etc.).
 *   - Absolute-path invariant — every return starts with `repoRoot`.
 *   - Cross-platform — returns use `path.join` (no hard-coded `/`).
 */

import { describe, expect, test } from 'bun:test';
import path from 'node:path';

import {
  PROJECT_SUBDIR_KINDS,
  claudeSymlinkTarget,
  projectDir,
  projectSubdir,
  projectsRoot,
  sessionDir,
  sessionsRoot,
  workspaceRoot,
  worktreeDir,
  type ClaudeSymlinkKind,
  type ProjectSubdirKind,
} from '../workspace-paths.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const REPO = '/abs/repo-root';
const PROJECT = 'gobbi';
const SESSION_ID = '35742566-2697-4318-bb06-558346b77b4a';

// ---------------------------------------------------------------------------
// Root helpers
// ---------------------------------------------------------------------------

describe('workspaceRoot', () => {
  test('joins .gobbi onto repoRoot', () => {
    expect(workspaceRoot(REPO)).toBe(path.join(REPO, '.gobbi'));
  });

  test('preserves arbitrary repoRoot — does not normalize upward', () => {
    expect(workspaceRoot('/x/y')).toBe(path.join('/x/y', '.gobbi'));
  });
});

describe('projectsRoot', () => {
  test('composes .gobbi/projects under repoRoot', () => {
    expect(projectsRoot(REPO)).toBe(path.join(REPO, '.gobbi', 'projects'));
  });

  test('lives under workspaceRoot', () => {
    const root = projectsRoot(REPO);
    expect(root.startsWith(workspaceRoot(REPO))).toBe(true);
  });
});

describe('projectDir', () => {
  test('appends projectName to projectsRoot', () => {
    expect(projectDir(REPO, PROJECT)).toBe(
      path.join(REPO, '.gobbi', 'projects', PROJECT),
    );
  });

  test('treats projectName as an opaque segment (no escaping)', () => {
    // The facade is purely compositional; path sanitisation is the caller's
    // concern. Confirm we forward the value verbatim so future sanitisers
    // can be layered in one place.
    expect(projectDir(REPO, 'my-proj')).toBe(
      path.join(REPO, '.gobbi', 'projects', 'my-proj'),
    );
  });
});

// ---------------------------------------------------------------------------
// Every ProjectSubdirKind value
// ---------------------------------------------------------------------------

describe('projectSubdir — every ProjectSubdirKind value', () => {
  // The tuple is the authoritative list; iterate it so adding a new kind
  // automatically grows the test matrix.
  for (const kind of PROJECT_SUBDIR_KINDS) {
    test(`kind "${kind}" resolves under projectDir`, () => {
      const sub = projectSubdir(REPO, PROJECT, kind);
      expect(sub).toBe(path.join(projectDir(REPO, PROJECT), kind));
      expect(sub.startsWith(projectDir(REPO, PROJECT))).toBe(true);
    });
  }

  test('tuple contains exactly 16 kinds', () => {
    // Guards against accidental removal from the taxonomy; matches the
    // ideation §11 charter (11 dirs) + top-level `gotchas/` (PR-FIN-2a-i
    // migration out of `learnings/gotchas/`) + 2 claude-doc dirs +
    // sessions + worktrees.
    expect(PROJECT_SUBDIR_KINDS.length).toBe(16);
  });

  test('tuple includes the full ideation §11 taxonomy plus top-level gotchas', () => {
    const taxonomy: readonly ProjectSubdirKind[] = [
      'design',
      'decisions',
      'references',
      'scenarios',
      'checklists',
      'playbooks',
      'learnings',
      'gotchas',
      'rules',
      'backlogs',
      'notes',
      'reviews',
    ];
    for (const kind of taxonomy) {
      expect(PROJECT_SUBDIR_KINDS).toContain(kind);
    }
  });

  test('tuple includes skills/agents/sessions/worktrees', () => {
    const extras: readonly ProjectSubdirKind[] = [
      'skills',
      'agents',
      'sessions',
      'worktrees',
    ];
    for (const kind of extras) {
      expect(PROJECT_SUBDIR_KINDS).toContain(kind);
    }
  });
});

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

describe('sessionsRoot', () => {
  test('matches projectSubdir(name, "sessions")', () => {
    expect(sessionsRoot(REPO, PROJECT)).toBe(
      projectSubdir(REPO, PROJECT, 'sessions'),
    );
  });

  test('lives under projectDir', () => {
    expect(sessionsRoot(REPO, PROJECT).startsWith(projectDir(REPO, PROJECT))).toBe(
      true,
    );
  });
});

describe('sessionDir', () => {
  test('composes sessionsRoot/<sessionId>', () => {
    expect(sessionDir(REPO, PROJECT, SESSION_ID)).toBe(
      path.join(sessionsRoot(REPO, PROJECT), SESSION_ID),
    );
  });

  test('lives under sessionsRoot', () => {
    expect(
      sessionDir(REPO, PROJECT, SESSION_ID).startsWith(
        sessionsRoot(REPO, PROJECT),
      ),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Worktrees (D6 project-scoped)
// ---------------------------------------------------------------------------

describe('worktreeDir', () => {
  test('lives at projectDir/worktrees/<name> per D6', () => {
    expect(worktreeDir(REPO, PROJECT, 'feat-branch')).toBe(
      path.join(projectSubdir(REPO, PROJECT, 'worktrees'), 'feat-branch'),
    );
  });

  test('lives under projectDir, not workspaceRoot directly', () => {
    // Guards against regressing to the legacy `.gobbi/worktrees/` location
    // (pre-D6). The worktrees container MUST be inside the project
    // directory, not a sibling of `projects/`.
    const wt = worktreeDir(REPO, PROJECT, 'wt1');
    expect(wt.startsWith(projectDir(REPO, PROJECT))).toBe(true);
    expect(wt.startsWith(path.join(workspaceRoot(REPO), 'worktrees'))).toBe(
      false,
    );
  });
});

// ---------------------------------------------------------------------------
// .claude symlink farm
// ---------------------------------------------------------------------------

describe('claudeSymlinkTarget', () => {
  const cases: readonly ClaudeSymlinkKind[] = ['skills', 'agents', 'rules'];

  for (const kind of cases) {
    test(`kind "${kind}" returns both source + target as absolute paths`, () => {
      const { source, target } = claudeSymlinkTarget(
        kind,
        '_git.md',
        PROJECT,
        REPO,
      );

      // Source: the actual file inside the project's per-kind dir.
      expect(source).toBe(
        path.join(projectSubdir(REPO, PROJECT, kind), '_git.md'),
      );
      // Target: the symlink location under .claude/.
      expect(target).toBe(path.join(REPO, '.claude', kind, '_git.md'));
      // Both absolute.
      expect(path.isAbsolute(source)).toBe(true);
      expect(path.isAbsolute(target)).toBe(true);
    });
  }

  test('source lives under projectDir, target under .claude', () => {
    const { source, target } = claudeSymlinkTarget(
      'skills',
      '_bun.md',
      PROJECT,
      REPO,
    );
    expect(source.startsWith(projectDir(REPO, PROJECT))).toBe(true);
    expect(target.startsWith(path.join(REPO, '.claude'))).toBe(true);
  });

  test('relative-link string round-trips to the source', () => {
    // The caller is expected to write the symlink with
    // `path.relative(path.dirname(target), source)`. Assert the round-trip
    // so the convention is locked — anyone who changes the helper's return
    // shape sees this test fail immediately.
    const { source, target } = claudeSymlinkTarget(
      'agents',
      '__executor.md',
      PROJECT,
      REPO,
    );
    const rel = path.relative(path.dirname(target), source);
    const roundTripped = path.resolve(path.dirname(target), rel);
    expect(roundTripped).toBe(source);
  });

  test('relative-link string contains only `/`-separators on posix', () => {
    // Cross-platform note: on posix this is a "/"-only string. We do not
    // assert shape on Windows explicitly — `path.relative` owns that —
    // but we verify no backslash leakage on posix-style input paths.
    const { source, target } = claudeSymlinkTarget(
      'rules',
      '__gobbi-convention.md',
      PROJECT,
      REPO,
    );
    const rel = path.relative(path.dirname(target), source);
    if (path.sep === '/') {
      expect(rel.includes('\\')).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// Invariants across every helper
// ---------------------------------------------------------------------------

describe('facade invariants', () => {
  test('every derived path is absolute when repoRoot is absolute', () => {
    const derivations: readonly string[] = [
      workspaceRoot(REPO),
      projectsRoot(REPO),
      projectDir(REPO, PROJECT),
      projectSubdir(REPO, PROJECT, 'design'),
      sessionsRoot(REPO, PROJECT),
      sessionDir(REPO, PROJECT, SESSION_ID),
      worktreeDir(REPO, PROJECT, 'wt1'),
    ];
    for (const d of derivations) {
      expect(path.isAbsolute(d)).toBe(true);
      expect(d.startsWith(REPO)).toBe(true);
    }
  });

  test('every derived path uses path.sep for joins — no raw slashes in output', () => {
    // The facade MUST go through `path.join`; if anyone regresses to string
    // concatenation with `/`, this test catches it on a non-posix host.
    // On posix (sep === '/'), this assertion is trivially true; it is
    // meaningful when the suite runs on Windows CI in the future.
    const sub = projectSubdir(REPO, PROJECT, 'learnings');
    const expected = [REPO, '.gobbi', 'projects', PROJECT, 'learnings'].join(
      path.sep,
    );
    expect(sub).toBe(expected);
  });

  test('helpers compose — facade does not fork path construction', () => {
    // sessionDir should literally be sessionsRoot + sessionId, not its own
    // independent composition. If someone forks the path construction, the
    // compositional invariant below fails.
    expect(sessionDir(REPO, PROJECT, SESSION_ID)).toBe(
      path.join(sessionsRoot(REPO, PROJECT), SESSION_ID),
    );
    expect(sessionsRoot(REPO, PROJECT)).toBe(
      projectSubdir(REPO, PROJECT, 'sessions'),
    );
    expect(projectSubdir(REPO, PROJECT, 'design')).toBe(
      path.join(projectDir(REPO, PROJECT), 'design'),
    );
    expect(projectDir(REPO, PROJECT)).toBe(
      path.join(projectsRoot(REPO), PROJECT),
    );
    expect(projectsRoot(REPO)).toBe(path.join(workspaceRoot(REPO), 'projects'));
  });
});

// ---------------------------------------------------------------------------
// W6.6 — round-trip + property-style containment invariants
//
// The W1.1 facade exists so that every caller composes paths through one
// module; the tests below pin three invariants that the earlier suites only
// check opportunistically:
//
//   1. Idempotency — repeated calls with the same inputs return the exact
//      same string. Catches accidental state in the module (global counter,
//      mtime interpolation, etc.).
//   2. Round-trip — `projectSubdir(repoRoot, name, kind)` composes via
//      `projectsRoot(repoRoot)`; the path ALWAYS begins with that prefix
//      and appends `<name>/<kind>`. No helper reconstructs the prefix
//      independently.
//   3. Containment property — for any projectName value (including names
//      containing dots or unusual characters), `projectSubdir` never
//      escapes `projectsRoot`. The facade does not implement sanitisation;
//      this test asserts that ABSENT sanitisation it still does not leak
//      outside the workspace root for typical inputs, so future sanitisers
//      can be layered in one place without breaking composition.
// ---------------------------------------------------------------------------

describe('W6.6 — round-trip + idempotency', () => {
  test('projectsRoot(repoRoot) is idempotent across calls', () => {
    const a = projectsRoot(REPO);
    const b = projectsRoot(REPO);
    const c = projectsRoot(REPO);
    expect(a).toBe(b);
    expect(b).toBe(c);
  });

  test('projectSubdir is idempotent for identical (repoRoot, name, kind) triples', () => {
    const a = projectSubdir(REPO, PROJECT, 'skills');
    const b = projectSubdir(REPO, PROJECT, 'skills');
    expect(a).toBe(b);
  });

  test('projectSubdir(repoRoot, name, "skills") resolves relative to repoRoot', () => {
    // The round-trip property: starting from repoRoot, a caller can arrive
    // at the per-project skills dir by concatenating `.gobbi/projects/<name>/skills`.
    // The facade's output matches that explicit composition exactly.
    const sub = projectSubdir(REPO, PROJECT, 'skills');
    expect(sub).toBe(path.join(REPO, '.gobbi', 'projects', PROJECT, 'skills'));
    // And the reverse: from `sub`, stripping the repoRoot prefix yields the
    // canonical relative path.
    const rel = path.relative(REPO, sub);
    expect(rel).toBe(path.join('.gobbi', 'projects', PROJECT, 'skills'));
  });

  test('sessionsRoot returns the correct path for the default project name ("gobbi")', () => {
    // `DEFAULT_PROJECT_NAME = 'gobbi'` is a caller-side constant that
    // multiple commands pass in while the projects.active resolution lands
    // in a later wave (TODO(W2.3)). Pin the shape the facade MUST produce
    // for that value so changes to the layout surface as test failures
    // rather than silent path drift.
    expect(sessionsRoot(REPO, 'gobbi')).toBe(
      path.join(REPO, '.gobbi', 'projects', 'gobbi', 'sessions'),
    );
  });

  test('sessionsRoot returns the correct path for a custom project name', () => {
    expect(sessionsRoot(REPO, 'acme-app')).toBe(
      path.join(REPO, '.gobbi', 'projects', 'acme-app', 'sessions'),
    );
    // Different project names must produce different paths.
    expect(sessionsRoot(REPO, 'acme-app')).not.toBe(
      sessionsRoot(REPO, 'gobbi'),
    );
  });

  test('no helper fabricates `.gobbi/projects/` independently — every output routes through projectsRoot', () => {
    // If any helper regresses to a hand-rolled `.gobbi/projects/` literal,
    // it will fail to agree with `projectsRoot(REPO)`. Check that every
    // output that SHOULD live under projects/ actually has that root as a
    // prefix, so the facade is the single source of truth.
    const under: readonly string[] = [
      projectDir(REPO, PROJECT),
      projectSubdir(REPO, PROJECT, 'learnings'),
      projectSubdir(REPO, PROJECT, 'skills'),
      projectSubdir(REPO, PROJECT, 'sessions'),
      projectSubdir(REPO, PROJECT, 'worktrees'),
      sessionsRoot(REPO, PROJECT),
      sessionDir(REPO, PROJECT, SESSION_ID),
      worktreeDir(REPO, PROJECT, 'wt1'),
    ];
    const root = projectsRoot(REPO);
    for (const p of under) {
      expect(p.startsWith(root + path.sep) || p === root).toBe(true);
    }
  });
});

describe('W6.6 — containment property', () => {
  // Sample of project-name shapes the facade forwards verbatim. The facade
  // does not sanitise; the test asserts that for each of these realistic
  // shapes, `projectSubdir` still resolves under `projectsRoot`. If future
  // sanitisation lands in this module, these samples remain valid inputs.
  const PROJECT_NAMES: readonly string[] = [
    'gobbi',
    'acme',
    'my-project',
    'Project_With_Underscores',
    'with.dots.in.name',
    'a',
    'extremely-long-project-name-with-many-hyphens-and-words',
    '日本語プロジェクト',
  ];

  for (const name of PROJECT_NAMES) {
    for (const kind of PROJECT_SUBDIR_KINDS) {
      test(`projectSubdir does not escape projectsRoot for name=${name} kind=${kind}`, () => {
        const sub = projectSubdir(REPO, name, kind);
        // Must be a descendant of projectsRoot (not a sibling, not outside).
        const root = projectsRoot(REPO);
        expect(sub.startsWith(root + path.sep)).toBe(true);
        // Resolving the sub dir and relativising against projectsRoot must
        // not yield a segment containing `..` — i.e. no upward escape.
        const rel = path.relative(root, sub);
        expect(rel.split(path.sep).includes('..')).toBe(false);
      });
    }
  }

  test('projectDir never escapes projectsRoot for any sampled name', () => {
    const root = projectsRoot(REPO);
    for (const name of PROJECT_NAMES) {
      const dir = projectDir(REPO, name);
      expect(dir.startsWith(root + path.sep)).toBe(true);
      expect(path.relative(root, dir).split(path.sep).includes('..')).toBe(
        false,
      );
    }
  });
});
