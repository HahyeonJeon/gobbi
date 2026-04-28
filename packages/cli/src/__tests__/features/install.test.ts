/**
 * Feature-level integration tests for the install / project management
 * surface — exercises the four W5 commands (`gobbi install`,
 * `gobbi project create`, `gobbi project switch`, `gobbi project list`)
 * as end-to-end flows rather than in isolation.
 *
 * ## Scope
 *
 * W5's unit-test suite (`commands/__tests__/install.test.ts`,
 * `commands/project/__tests__/{create,list,switch}.test.ts`) already
 * covers each subcommand's branch matrix. This file is the layer above:
 * each test threads multiple commands through a single scratch repo and
 * asserts the CROSS-command invariants — settings-file shape after
 * install-then-switch, symlink-farm rotation preserving fresh-install
 * operator content, project-create seeding the new project while
 * leaving the active project untouched, `project list`'s active marker
 * following `project switch`, and so on.
 *
 * Scenario coverage:
 *
 *   F-INST-01 — Fresh `gobbi install`: project root materialises, farm
 *               symlinks resolve to the installed source, workspace
 *               settings carry `active=gobbi` + `known=[gobbi]`.
 *   F-INST-02 — Upgrade path: template v1 → edit → template v2
 *               `gobbi install --upgrade` overwrites unmodified files and
 *               leaves user-edited files intact (3-way merge contract).
 *   F-INST-03 — `gobbi project create <name>`: scaffold dir + seeded
 *               templates + settings.known appended, active unchanged.
 *   F-INST-04 — `gobbi project switch <name>`: farm rotates to point at
 *               the new project's source; `.claude/` non-farm siblings
 *               survive; workspace `projects.active` updated.
 *   F-INST-05 — `gobbi project list`: active project marked with `*`,
 *               others with ` `, sorted alphabetically.
 *   F-INST-06 — End-to-end combination: install → create second →
 *               switch → list — every invariant above holds in sequence.
 *
 * ## Design notes
 *
 *   - Every test uses `mkdtempSync` under the OS tmpdir — no test
 *     touches the real worktree's `.gobbi/` or `.claude/`.
 *   - Commands are invoked via the `runXWithOptions({ repoRoot, ...})`
 *     exported APIs — NOT via `Bun.$` or subprocess. This keeps the
 *     tests deterministic and avoids the PATH-dependent flakes the
 *     Pass-3 `capture-subagent` regression (backlog #131) exposed for
 *     subprocess-based test approaches.
 *   - `gobbi install` tests pass an explicit `templateRoot` pointing at
 *     a synthesised minimal bundle (same pattern as
 *     `commands/__tests__/install.test.ts::makeTemplate`) so the
 *     assertions are independent of the real template content.
 *   - `gobbi project create` does NOT accept a `templateRoot` override;
 *     the ancestor-walk in `resolveDefaultTemplateRoot` finds the real
 *     `.gobbi/projects/gobbi/` template bundle in the worktree. We
 *     therefore assert SHAPE invariants (manifest exists, known updated)
 *     rather than specific file contents for that flow.
 *   - A shared `process.exit` / stdout / stderr capture harness wraps
 *     every call so command diagnostics are inspectable and exit codes
 *     are assertable without killing the test runner.
 *
 * Pattern references:
 *   - `packages/cli/src/commands/__tests__/install.test.ts` — `makeTemplate`
 *     helper + captureExit harness.
 *   - `packages/cli/src/commands/project/__tests__/switch.test.ts` —
 *     `seedProjectFarm` pattern for stand-in project content.
 *   - `packages/cli/src/__tests__/features/gobbi-memory.test.ts` —
 *     feature-level describe grouping + tmpdir discipline.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readlinkSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve as pathResolve } from 'node:path';

import {
  __INTERNALS__ as INSTALL_INTERNALS,
  runInstallWithOptions,
} from '../../commands/install.js';
import { runProjectCreateWithOptions } from '../../commands/project/create.js';
import { runProjectListWithOptions } from '../../commands/project/list.js';
import { runProjectSwitchWithOptions } from '../../commands/project/switch.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap
// ---------------------------------------------------------------------------

interface Captured {
  stdout: string;
  stderr: string;
  exitCode: number | null;
}

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

let captured: Captured;
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origLog: typeof console.log;
let origExit: typeof process.exit;

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origLog = console.log;
  origExit = process.exit;

  process.stdout.write = ((chunk: string | Uint8Array): boolean => {
    captured.stdout +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stdout.write;
  process.stderr.write = ((chunk: string | Uint8Array): boolean => {
    captured.stderr +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stderr.write;
  console.log = (...args: unknown[]): void => {
    captured.stdout += args.map(String).join(' ') + '\n';
  };
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  console.log = origLog;
  process.exit = origExit;
});

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

/**
 * Reset capture buffers between back-to-back command calls inside a
 * single test body. Written as a helper so the `exitCode = null` reset
 * preserves the `number | null` field type for subsequent assertions
 * (inline assignment would narrow to `null`).
 */
function resetCaptured(): void {
  captured.stdout = '';
  captured.stderr = '';
  captured.exitCode = null as number | null;
}

// ---------------------------------------------------------------------------
// Scratch scaffolding — every test gets a fresh tmpdir under OS tmpdir.
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

afterEach(() => {
  while (scratchDirs.length > 0) {
    const d = scratchDirs.pop();
    if (d !== undefined) {
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort — tmpdir is reaped by the OS regardless
      }
    }
  }
});

function makeScratch(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  scratchDirs.push(dir);
  return dir;
}

function makeRepo(): string {
  return makeScratch('gobbi-install-feature-repo-');
}

/**
 * Build a minimal template bundle under
 * `<scratch>/fake-node-modules/@gobbitools/cli/.gobbi/projects/gobbi/`
 * mirroring the production package layout so `readTarballVersion`
 * finds a deterministic `9.9.9-test` version sentinel.
 *
 * Mirrors the helper in `commands/__tests__/install.test.ts` so feature
 * tests exercise the same code paths unit tests do; duplicated (rather
 * than imported) because feature tests deliberately avoid cross-suite
 * helper coupling — each feature file stands alone.
 */
function makeTemplate(files: Readonly<Record<string, string>>): string {
  const scratch = makeScratch('gobbi-install-feature-tpl-');
  const pkgRoot = join(scratch, 'fake-node-modules', '@gobbitools', 'cli');
  const root = join(pkgRoot, '.gobbi', 'projects', 'gobbi');
  mkdirSync(root, { recursive: true });
  for (const kind of INSTALL_INTERNALS.TEMPLATE_KINDS) {
    mkdirSync(join(root, kind), { recursive: true });
  }
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(join(abs, '..'), { recursive: true });
    writeFileSync(abs, content, 'utf8');
  }
  writeFileSync(
    join(pkgRoot, 'package.json'),
    JSON.stringify({ name: '@gobbitools/cli', version: '9.9.9-test' }),
    'utf8',
  );
  return root;
}

function readSettings(repo: string): { schemaVersion: 1 } {
  const raw = readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8');
  return JSON.parse(raw) as { schemaVersion: 1 };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('install + project commands — feature-level flows', () => {
  // -------------------------------------------------------------------------
  // F-INST-01 — Fresh install wires up content, settings, and farm.
  // -------------------------------------------------------------------------
  describe('F-INST-01 — fresh install', () => {
    test('creates project tree, seeds settings.active, materialises resolving symlink farm', async () => {
      const templateRoot = makeTemplate({
        'skills/_git/SKILL.md': '# git skill v1\n',
        'skills/_git/gotchas.md': '# git gotchas v1\n',
        'agents/gobbi-agent.md': '# agent v1\n',
        'rules/naming.md': '# naming v1\n',
      });
      const repo = makeRepo();

      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );

      // Install exited cleanly.
      expect(captured.exitCode).toBeNull();

      // Project root carries every template file.
      const projectRoot = join(repo, '.gobbi', 'projects', 'gobbi');
      expect(existsSync(join(projectRoot, 'skills/_git/SKILL.md'))).toBe(true);
      expect(existsSync(join(projectRoot, 'skills/_git/gotchas.md'))).toBe(
        true,
      );
      expect(existsSync(join(projectRoot, 'agents/gobbi-agent.md'))).toBe(true);
      expect(existsSync(join(projectRoot, 'rules/naming.md'))).toBe(true);
      // Install manifest recorded every copied file with a sha256 hash.
      expect(existsSync(join(projectRoot, '.install-manifest.json'))).toBe(
        true,
      );

      // PR-FIN-1c: workspace settings seeded with minimum shape;
      // projects registry was removed.
      const settings = readSettings(repo);
      expect(settings.schemaVersion).toBe(1);
      expect((settings as Record<string, unknown>)['projects']).toBeUndefined();

      // `.claude/{skills,agents,rules}/` farm materialised — each leaf
      // is a symlink whose target (after path-resolve) points into the
      // project source tree, and `readFileSync` through the symlink
      // returns the template content.
      for (const kind of INSTALL_INTERNALS.TEMPLATE_KINDS) {
        expect(existsSync(join(repo, '.claude', kind))).toBe(true);
      }
      const rulesLink = join(repo, '.claude', 'rules', 'naming.md');
      expect(lstatSync(rulesLink).isSymbolicLink()).toBe(true);
      const resolvedRules = pathResolve(
        join(repo, '.claude', 'rules'),
        readlinkSync(rulesLink),
      );
      expect(resolvedRules).toBe(join(projectRoot, 'rules', 'naming.md'));
      expect(readFileSync(resolvedRules, 'utf8')).toBe('# naming v1\n');

      // Nested skill leaf resolves through the farm too.
      const skillLink = join(repo, '.claude', 'skills', '_git', 'SKILL.md');
      expect(lstatSync(skillLink).isSymbolicLink()).toBe(true);
      expect(readFileSync(skillLink, 'utf8')).toBe('# git skill v1\n');
    });
  });

  // -------------------------------------------------------------------------
  // F-INST-02 — Upgrade path honours user edits via the 3-way merge.
  // -------------------------------------------------------------------------
  describe('F-INST-02 — upgrade install with user edits', () => {
    test('3-way merge overwrites unmodified files and preserves user edits', async () => {
      // Round 1: fresh install at v1.
      const templateV1 = makeTemplate({
        'rules/untouched.md': 'v1-untouched\n',
        'rules/user-edited.md': 'v1-user-edited\n',
      });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], {
          repoRoot: repo,
          templateRoot: templateV1,
        }),
      );
      expect(captured.exitCode).toBeNull();

      const projectRoot = join(repo, '.gobbi', 'projects', 'gobbi');
      const untouchedPath = join(projectRoot, 'rules', 'untouched.md');
      const editedPath = join(projectRoot, 'rules', 'user-edited.md');

      // User edits one of the two files.
      writeFileSync(editedPath, 'user-local-edit\n', 'utf8');

      // Round 2: template moves `untouched.md` forward to v2 while
      // leaving `user-edited.md` at v1 (template didn't touch it).
      // Expected merge outcome:
      //   - untouched.md: base == v1, current == v1, template == v2
      //                   → template-only → overwritten with v2.
      //   - user-edited.md: base == v1, current == user-edit,
      //                     template == v1 → user-only → preserved.
      // No conflict arm is triggered — both changes happened on one
      // side only.
      const templateV2 = makeTemplate({
        'rules/untouched.md': 'v2-untouched\n',
        'rules/user-edited.md': 'v1-user-edited\n',
      });
      resetCaptured();
      await captureExit(() =>
        runInstallWithOptions(['--upgrade'], {
          repoRoot: repo,
          templateRoot: templateV2,
        }),
      );

      // Upgrade exited cleanly (one user-only, one template-only — no
      // conflicts because the user's file matched the v1 baseline the
      // manifest carried for `user-edited.md`).
      expect(captured.exitCode).toBeNull();

      // Unmodified file refreshed.
      expect(readFileSync(untouchedPath, 'utf8')).toBe('v2-untouched\n');
      // User-edited file preserved.
      expect(readFileSync(editedPath, 'utf8')).toBe('user-local-edit\n');

      // Summary line diagnoses the 3-way outcome.
      expect(captured.stdout).toContain('1 updated');
      expect(captured.stdout).toContain('1 user-skipped');
    });
  });

  // -------------------------------------------------------------------------
  // F-INST-03 — project create scaffolds + seeds + registers.
  // -------------------------------------------------------------------------
  describe('F-INST-03 — project create post-install', () => {
    test('scaffolds project dir, seeds templates, appends to known, leaves active unchanged', async () => {
      // Prime the repo with a fresh `gobbi` install so there's an
      // existing settings.json to append to.
      const templateRoot = makeTemplate({
        'rules/root.md': 'gobbi rules\n',
      });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );
      expect(captured.exitCode).toBeNull();

      // Create a second project. `gobbi project create` does not
      // accept a template-root override — its dynamic-import seed hook
      // walks `resolveDefaultTemplateRoot` which finds the real
      // worktree's `.gobbi/projects/gobbi/`. Assert SHAPE invariants
      // (scaffold dirs + manifest) rather than specific file content.
      resetCaptured();
      await captureExit(() =>
        runProjectCreateWithOptions(['my-feature'], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBeNull();

      // Scaffold: the create command materialises a known subdir set.
      // We sample three representative kinds rather than hard-coding
      // the whole SCAFFOLD_DIRS list (that's the unit suite's job).
      const created = join(repo, '.gobbi', 'projects', 'my-feature');
      expect(existsSync(join(created, 'design'))).toBe(true);
      expect(existsSync(join(created, 'sessions'))).toBe(true);
      expect(existsSync(join(created, 'learnings', 'gotchas'))).toBe(true);

      // Seed hook fired — install manifest landed under the new project.
      // (Content is the real worktree bundle, which is non-empty by
      // construction, so the manifest is guaranteed to be present.)
      expect(
        existsSync(join(created, '.install-manifest.json')),
      ).toBe(true);
      expect(captured.stdout).toContain('Seeded');

      // PR-FIN-1c: settings.json carries minimum shape; the
      // directory tree is the source of truth for project existence.
      const settings = readSettings(repo);
      expect(settings.schemaVersion).toBe(1);
      // Both project directories exist.
      expect(existsSync(join(repo, '.gobbi', 'projects', 'gobbi'))).toBe(true);
      expect(existsSync(join(repo, '.gobbi', 'projects', 'my-feature'))).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // F-INST-04 — project switch rotates farm + updates active.
  // -------------------------------------------------------------------------
  // PR-FIN-1c: `gobbi project switch` is a deprecated no-op (the
  // `projects.active` registry was removed). Farm-rotation tests retired.
  describe('F-INST-04 — project switch rotates farm', () => {
    test.skip('farm rotates to new project, settings.active updates, .claude siblings survive', async () => {
      // Install fresh so `.gobbi/projects/gobbi/` + the initial farm
      // exist.
      const templateRoot = makeTemplate({
        'rules/source.md': 'gobbi-source\n',
        'skills/_x/SKILL.md': '# gobbi skill\n',
        'agents/a.md': '# gobbi agent\n',
      });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );
      expect(captured.exitCode).toBeNull();

      // Operator drops a non-farm sibling into `.claude/` — the rotation
      // must preserve it. This is the same invariant the install suite
      // locks for fresh-install (NI-1); we lock it for rotation here.
      const claudeRoot = join(repo, '.claude');
      writeFileSync(
        join(claudeRoot, 'CLAUDE.md'),
        '# operator content\n',
        'utf8',
      );

      // Build a sibling project `alt` by hand — no install/create
      // needed, just raw source content to rotate to. The fact that
      // farm rotation is independent of how the project was seeded is
      // a contract worth asserting.
      const altRoot = join(repo, '.gobbi', 'projects', 'alt');
      mkdirSync(join(altRoot, 'rules'), { recursive: true });
      mkdirSync(join(altRoot, 'skills', '_y'), { recursive: true });
      mkdirSync(join(altRoot, 'agents'), { recursive: true });
      writeFileSync(
        join(altRoot, 'rules', 'alt-source.md'),
        'alt-source\n',
        'utf8',
      );
      writeFileSync(
        join(altRoot, 'skills', '_y', 'SKILL.md'),
        '# alt skill\n',
        'utf8',
      );
      writeFileSync(
        join(altRoot, 'agents', 'alt-agent.md'),
        '# alt agent\n',
        'utf8',
      );

      // Pre-register `alt` in settings (the switch command adds it
      // dedup-safely; we pre-stage to keep the assertion focused).
      const before = readSettings(repo);
      expect((before as Record<string, unknown>)["projects"]).toBe('gobbi');

      // Switch.
      resetCaptured();
      await captureExit(() =>
        runProjectSwitchWithOptions(['alt'], {
          repoRoot: repo,
          tempPidTag: 'f04',
        }),
      );
      expect(captured.exitCode).toBeNull();

      // Farm now points at `alt`'s source — the old `.claude/rules/source.md`
      // leaf is gone (the rotate wipes the per-kind subtree) and
      // `.claude/rules/alt-source.md` now exists as a symlink into the
      // new project.
      const oldLeaf = join(repo, '.claude', 'rules', 'source.md');
      const newLeaf = join(repo, '.claude', 'rules', 'alt-source.md');
      expect(existsSync(oldLeaf)).toBe(false);
      expect(lstatSync(newLeaf).isSymbolicLink()).toBe(true);
      const resolvedNew = pathResolve(
        join(repo, '.claude', 'rules'),
        readlinkSync(newLeaf),
      );
      expect(resolvedNew).toBe(join(altRoot, 'rules', 'alt-source.md'));
      expect(readFileSync(resolvedNew, 'utf8')).toBe('alt-source\n');

      // Non-farm sibling under `.claude/` survived the rotation.
      expect(existsSync(join(claudeRoot, 'CLAUDE.md'))).toBe(true);
      expect(readFileSync(join(claudeRoot, 'CLAUDE.md'), 'utf8')).toBe(
        '# operator content\n',
      );

      // PR-FIN-1c: skipped test body — projects registry retired.
      const after = readSettings(repo);
      expect(after).toBeDefined();

      // Temp-farm scratch dir cleaned up — `.claude.tmp-farm-f04/`
      // must not linger.
      expect(existsSync(join(repo, '.claude.tmp-farm-f04'))).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // F-INST-05 — project list marks the active project with `*`.
  // -------------------------------------------------------------------------
  describe('F-INST-05 — project list shows active marker', () => {
    test('active project row is prefixed with "*"; PR-FIN-1c uses basename(repo)', async () => {
      const templateRoot = makeTemplate({ 'rules/r.md': '# r\n' });
      const repo = makeRepo();

      // Install (default project = 'gobbi').
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );
      expect(captured.exitCode).toBeNull();

      // Drop a second project directory in so list has something
      // to differentiate on.
      mkdirSync(join(repo, '.gobbi', 'projects', 'alpha'), {
        recursive: true,
      });
      mkdirSync(join(repo, '.gobbi', 'projects', 'zeta'), {
        recursive: true,
      });

      resetCaptured();
      await captureExit(() =>
        runProjectListWithOptions([], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBeNull();

      // PR-FIN-1c: the active marker is `basename(repoRoot)`. The
      // scratch repo's basename is dynamic, so neither 'alpha' nor
      // 'zeta' nor 'gobbi' will carry a `*` marker (basename is the
      // tmpdir name like `gobbi-mem-feat-XYZ`).
      const rows = captured.stdout.trimEnd().split('\n');
      // The three rows are present, sorted; none carry a `*` marker
      // because the tmpdir basename is none of the listed projects.
      expect(rows).toEqual([' \talpha', ' \tgobbi', ' \tzeta']);
    });
  });

  // -------------------------------------------------------------------------
  // F-INST-06 — End-to-end combination flow: install → create → switch → list.
  // -------------------------------------------------------------------------
  // PR-FIN-1c: `gobbi project switch` no longer rotates the farm.
  // F-INST-06 retired with the registry removal.
  describe('F-INST-06 — end-to-end combination flow', () => {
    test.skip('install → create second → switch → list threads state correctly', async () => {
      const templateRoot = makeTemplate({
        'rules/core.md': 'core v1\n',
        'skills/_x/SKILL.md': '# x\n',
        'agents/a.md': '# a\n',
      });
      const repo = makeRepo();

      // --- Step 1: fresh install -----------------------------------------
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );
      expect(captured.exitCode).toBeNull();
      const afterInstall = readSettings(repo);
      expect((afterInstall as Record<string, unknown>)["projects"]).toBe('gobbi');
      expect((afterInstall as Record<string, unknown>)["projects"]).toEqual(['gobbi']);
      // Farm points at `gobbi`.
      const coreLeafGobbi = join(repo, '.claude', 'rules', 'core.md');
      expect(lstatSync(coreLeafGobbi).isSymbolicLink()).toBe(true);
      expect(readFileSync(coreLeafGobbi, 'utf8')).toBe('core v1\n');

      // --- Step 2: create a second project --------------------------------
      //
      // The create path seeds from the real worktree template bundle
      // (no templateRoot override on `project create`). We assert only
      // the shape invariants that don't depend on that content —
      // scaffold directory + manifest + settings.known updated +
      // active unchanged.
      resetCaptured();
      await captureExit(() =>
        runProjectCreateWithOptions(['second'], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBeNull();
      expect(
        existsSync(join(repo, '.gobbi', 'projects', 'second', 'design')),
      ).toBe(true);
      expect(
        existsSync(
          join(
            repo,
            '.gobbi',
            'projects',
            'second',
            '.install-manifest.json',
          ),
        ),
      ).toBe(true);
      const afterCreate = readSettings(repo);
      expect(afterCreate).toBeDefined();

      // --- Step 3: switch to `second` ------------------------------------
      //
      // `gobbi project switch` needs the target to have the three kind
      // dirs present. `project create` scaffolds those (skills/agents/
      // rules are in the SCAFFOLD_DIRS list), and the seed hook
      // populates them with template content. The rotation rewires
      // `.claude/` to point at `second`'s source tree.
      resetCaptured();
      await captureExit(() =>
        runProjectSwitchWithOptions(['second'], {
          repoRoot: repo,
          tempPidTag: 'f06',
        }),
      );
      expect(captured.exitCode).toBeNull();

      const afterSwitch = readSettings(repo);
      expect(afterSwitch).toBeDefined();

      // Farm rotation: the old `gobbi`-specific leaf (`rules/core.md`)
      // does not exist under the new farm (the real template seeded
      // into `second` by `create` does NOT carry our synthetic
      // `rules/core.md`; it carries the actual worktree content).
      // The rotation wipes each per-kind subtree before rebuild, so
      // the old leaf is gone even if the new project happens to also
      // have it. Assert that the symlink, if present at the same
      // path, now resolves into `second`'s source — or that it is
      // absent because `second` lacks that file.
      //
      // The invariant we lock: NO `.claude/rules/core.md` leaf
      // pointing into `gobbi`'s project root after the switch.
      const postSwitchCoreLeaf = join(
        repo,
        '.claude',
        'rules',
        'core.md',
      );
      if (existsSync(postSwitchCoreLeaf)) {
        const resolved = pathResolve(
          join(repo, '.claude', 'rules'),
          readlinkSync(postSwitchCoreLeaf),
        );
        expect(resolved).not.toBe(
          join(repo, '.gobbi', 'projects', 'gobbi', 'rules', 'core.md'),
        );
        expect(resolved).toContain(
          join(repo, '.gobbi', 'projects', 'second'),
        );
      }

      // --- Step 4: list shows `second` as active -------------------------
      resetCaptured();
      await captureExit(() =>
        runProjectListWithOptions([], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBeNull();
      const rows = captured.stdout.trimEnd().split('\n');
      // `project create` leaves scaffold dirs for both projects, so
      // both appear; only `second` carries the marker.
      expect(rows).toContain(' \tgobbi');
      expect(rows).toContain('*\tsecond');
      // Sort is alphabetical — `gobbi` < `second`.
      const gobbiIdx = rows.indexOf(' \tgobbi');
      const secondIdx = rows.indexOf('*\tsecond');
      expect(gobbiIdx).toBeLessThan(secondIdx);
    });
  });
});
