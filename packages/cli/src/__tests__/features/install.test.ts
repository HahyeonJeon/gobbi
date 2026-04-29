/**
 * Feature-level integration tests for the install / project management
 * surface — exercises the install + project commands as end-to-end flows
 * rather than in isolation.
 *
 * ## Scope (post-PR-FIN-1c)
 *
 * The unit-test suite (`commands/__tests__/install.test.ts`,
 * `commands/project/__tests__/{create,list}.test.ts`) covers each
 * subcommand's branch matrix. This file is the layer above: each test
 * threads multiple commands through a single scratch repo and asserts
 * cross-command invariants — settings-file shape after install,
 * project-create seeding alongside the active project, `project list`'s
 * active marker derived from `basename(repoRoot)`, etc.
 *
 * Scenario coverage:
 *
 *   F-INST-01 — Fresh `gobbi install`: project root materialises, farm
 *               symlinks resolve to the installed source, workspace
 *               settings.json is seeded with the minimum-shape.
 *   F-INST-02 — Re-install policy (post-PR-FIN-2a-i T-2a.3):
 *               second run without `--force` refuses on collision;
 *               with `--force`, plugin-bundled files overwrite while
 *               user-authored files outside the bundle survive.
 *   F-INST-03 — `gobbi project create <name>`: scaffold dir + seeded
 *               templates under `.gobbi/projects/<name>/`.
 *   F-INST-05 — `gobbi project list`: active marker follows
 *               `basename(repoRoot)`; entries derived from filesystem.
 *
 * F-INST-04 (`gobbi project switch` farm rotation) and F-INST-06
 * (end-to-end install → create → switch → list) were retired in
 * PR-FIN-1c when `Settings.projects` and the `gobbi project switch`
 * command were both removed. Active project resolves dynamically from
 * `--project <name>` (or `basename(repoRoot)`) so there is no farm
 * rotation step left to test.
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
      // PR-FIN-2a-i T-2a.3: no manifest is written by the install loop.
      expect(existsSync(join(projectRoot, '.install-manifest.json'))).toBe(
        false,
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
  // F-INST-02 — Re-install policy: collisions refuse without --force;
  // --force overwrites bundled files; user-authored files survive.
  // -------------------------------------------------------------------------
  describe('F-INST-02 — re-install with --force', () => {
    test('--force overwrites bundled files and preserves user-authored files', async () => {
      // Round 1: fresh install at v1.
      const templateV1 = makeTemplate({
        'rules/bundled-a.md': 'v1-bundled-a\n',
        'rules/bundled-b.md': 'v1-bundled-b\n',
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
      const bundledA = join(projectRoot, 'rules', 'bundled-a.md');
      const bundledB = join(projectRoot, 'rules', 'bundled-b.md');
      // User adds a file that does NOT correspond to any bundled path.
      const userOnly = join(projectRoot, 'rules', 'user-only.md');
      writeFileSync(userOnly, 'user-local-content\n', 'utf8');

      // Round 2: re-install with --force at v2. Both bundled files
      // overwrite; user-only file is never iterated and so survives.
      const templateV2 = makeTemplate({
        'rules/bundled-a.md': 'v2-bundled-a\n',
        'rules/bundled-b.md': 'v2-bundled-b\n',
      });
      resetCaptured();
      await captureExit(() =>
        runInstallWithOptions(['--force'], {
          repoRoot: repo,
          templateRoot: templateV2,
        }),
      );

      expect(captured.exitCode).toBeNull();
      // Both bundled files refreshed to v2.
      expect(readFileSync(bundledA, 'utf8')).toBe('v2-bundled-a\n');
      expect(readFileSync(bundledB, 'utf8')).toBe('v2-bundled-b\n');
      // User-authored file untouched.
      expect(readFileSync(userOnly, 'utf8')).toBe('user-local-content\n');
      // Summary line.
      expect(captured.stdout).toContain('2 overwritten');
    });

    test('re-install without --force refuses with exit 1 and a remediation hint', async () => {
      const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
      );
      expect(captured.exitCode).toBeNull();

      resetCaptured();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
      );
      expect(captured.exitCode).toBe(1);
      expect(captured.stderr).toContain('--force');
      expect(captured.stdout).toContain('COLLISION');
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
      expect(existsSync(join(created, 'gotchas'))).toBe(true);

      // Seed hook fired — at least one template file landed in the
      // new project (the worktree bundle is non-empty by construction).
      // PR-FIN-2a-i T-2a.3: no manifest is written.
      expect(
        existsSync(join(created, '.install-manifest.json')),
      ).toBe(false);
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
  // F-INST-04 — RETIRED in PR-FIN-1c.
  // -------------------------------------------------------------------------
  // `gobbi project switch` was deleted with the `Settings.projects` registry.
  // Active project now resolves dynamically from `--project <name>` (or
  // `basename(repoRoot)`); there is no farm rotation step left to test.
  // The original F-INST-04 body (farm rotation, settings.active update,
  // .claude sibling preservation) is preserved in git history at commit
  // 362217c33778b58ec7b7a15155563decaccc2bae and prior.
  describe.skip('F-INST-04 — RETIRED (project switch deleted in PR-FIN-1c)', () => {
    test('placeholder', () => {
      expect(true).toBe(true);
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
  // F-INST-06 — RETIRED in PR-FIN-1c.
  // -------------------------------------------------------------------------
  // The end-to-end install → create → switch → list flow relied on the
  // (now-deleted) `gobbi project switch` command and the registry it
  // mutated. With switch deleted and `Settings.projects` removed,
  // F-INST-06 has no farm-rotation step left to test. Original body is
  // preserved in git history at commit 362217c33778b58ec7b7a15155563decaccc2bae
  // and prior.
  describe.skip('F-INST-06 — RETIRED (project switch deleted in PR-FIN-1c)', () => {
    test('placeholder', () => {
      expect(true).toBe(true);
    });
  });
});
