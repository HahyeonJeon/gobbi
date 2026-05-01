/**
 * Unit tests for `gobbi install` — fresh install, re-install collision
 * gate, `--force` overwrite policy, dry-run mode, and template-root
 * resolution fallback.
 *
 * Post-PR-FIN-2a-i T-2a.3: the install-manifest bookkeeping was
 * removed entirely. There is no manifest read or write, no 3-way
 * merge, no FileAction enum. The decision is per-file: copy when the
 * destination is absent; refuse without `--force` when it exists;
 * overwrite with `--force`. User-authored files outside the bundle
 * are never touched (they're not in the iteration set).
 *
 * Post-PR-FIN-2a-i T-2a.1.5: the active-session gate that previously
 * sat in front of the install pipeline was removed — the JSON-pivot
 * memory model retired the per-session `state.json` it depended on.
 *
 * All tests operate against scratch directories in the OS temp dir.
 * Template content is synthesised in a per-test template root so
 * assertions are independent of the real `.gobbi/projects/gobbi/`
 * content shipped by the package.
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
  __INTERNALS__,
  renderPlan,
  resolveDefaultTemplateRoot,
  runInstallWithOptions,
  seedProjectFromTemplates,
  SeedError,
} from '../install.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap — mirrored from
// maintenance/wipe-legacy-sessions.test.ts.
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
 * Reset the mutable capture buffers between back-to-back calls in a
 * single test. Written as a helper (rather than inline assignments) so
 * the narrowing path — `captured.exitCode = null` inside the test body
 * would narrow the field's type to `null` for subsequent `.toBe(1)`
 * assertions — goes through a typed function instead. The `void` return
 * keeps the call sites noise-free.
 */
function resetCaptured(): void {
  captured.stdout = '';
  captured.stderr = '';
  captured.exitCode = null as number | null;
}

// ---------------------------------------------------------------------------
// Scratch-dir helpers
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

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

function makeScratch(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  scratchDirs.push(dir);
  return dir;
}

/**
 * Build a minimal template bundle under
 * `<scratch>/fake-node-modules/@gobbitools/cli/.gobbi/projects/gobbi/`
 * with the three template kinds populated from the supplied map. A
 * sentinel `package.json` is written at the `@gobbitools/cli` layer
 * for forward compatibility (older callers used it for version
 * extraction; the post-T-2a.3 install no longer reads it, but tests
 * keep the scaffolding shape consistent).
 *
 * `files` keys are relative to the template root (e.g.
 * `'skills/_git/SKILL.md'`). Values are file contents. An empty map
 * still creates the three kind directories so
 * `hasAllTemplateKinds` succeeds.
 */
function makeTemplate(files: Readonly<Record<string, string>>): string {
  const scratch = makeScratch('gobbi-install-tpl-');
  const pkgRoot = join(scratch, 'fake-node-modules', '@gobbitools', 'cli');
  const root = join(pkgRoot, '.gobbi', 'projects', 'gobbi');
  mkdirSync(root, { recursive: true });
  for (const kind of __INTERNALS__.TEMPLATE_KINDS) {
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

function makeRepo(): string {
  return makeScratch('gobbi-install-repo-');
}

function projectRoot(repo: string, name: string): string {
  return join(repo, '.gobbi', 'projects', name);
}

// ===========================================================================
// Fresh install
// ===========================================================================

describe('runInstall — fresh install', () => {
  test('copies every template file into the project tree', async () => {
    const templateRoot = makeTemplate({
      'skills/_git/SKILL.md': '# git skill\n',
      'skills/_git/gotchas.md': '# git gotchas\n',
      'agents/gobbi-agent.md': '# agent\n',
      'rules/my-rule.md': '# rule\n',
    });
    const repo = makeRepo();

    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot }),
    );

    expect(captured.exitCode).toBeNull();
    const root = projectRoot(repo, 'gobbi');
    expect(existsSync(join(root, 'skills/_git/SKILL.md'))).toBe(true);
    expect(existsSync(join(root, 'skills/_git/gotchas.md'))).toBe(true);
    expect(existsSync(join(root, 'agents/gobbi-agent.md'))).toBe(true);
    expect(existsSync(join(root, 'rules/my-rule.md'))).toBe(true);

    // Summary mentions the add counts.
    expect(captured.stdout).toContain('4 added');
    // No manifest is written (manifest system removed in T-2a.3).
    expect(existsSync(join(root, '.install-manifest.json'))).toBe(false);
  });

  test('custom --project name installs under that project root', async () => {
    const templateRoot = makeTemplate({ 'rules/x.md': 'x\n' });
    const repo = makeRepo();

    await captureExit(() =>
      runInstallWithOptions(['--project', 'alt'], {
        repoRoot: repo,
        templateRoot,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(join(projectRoot(repo, 'alt'), 'rules/x.md'))).toBe(true);
    // The default 'gobbi' project must NOT have received anything.
    expect(existsSync(join(projectRoot(repo, 'gobbi'), 'rules/x.md'))).toBe(
      false,
    );
  });
});

// ===========================================================================
// Fresh install — activation (settings.json + .claude/ farm)
// ===========================================================================

describe('runInstall — fresh install activation', () => {
  test('seeds workspace settings.json with minimum shape (PR-FIN-1c)', async () => {
    const templateRoot = makeTemplate({
      'skills/_x/SKILL.md': '# x\n',
      'agents/a.md': '# a\n',
      'rules/r.md': '# r\n',
    });
    const repo = makeRepo();

    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot }),
    );

    expect(captured.exitCode).toBeNull();
    const settings = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as { schemaVersion: number };
    expect(settings.schemaVersion).toBe(1);
    // PR-FIN-1c: no projects registry; the directory tree is the source
    // of truth.
    expect((settings as Record<string, unknown>)['projects']).toBeUndefined();
    // Summary mentions the seed write.
    expect(captured.stdout).toContain('seeded .gobbi/settings.json');
  });

  test('custom --project name still seeds workspace settings (no projects registry)', async () => {
    const templateRoot = makeTemplate({ 'rules/r.md': '# r\n' });
    const repo = makeRepo();

    await captureExit(() =>
      runInstallWithOptions(['--project', 'alt'], {
        repoRoot: repo,
        templateRoot,
      }),
    );

    expect(captured.exitCode).toBeNull();
    const settings = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as { schemaVersion: number };
    expect(settings.schemaVersion).toBe(1);
    // The project tree at .gobbi/projects/alt/ is the source of truth.
    expect(existsSync(join(repo, '.gobbi', 'projects', 'alt'))).toBe(true);
  });

  test('builds per-file .claude/{skills,agents,rules}/ symlink farm', async () => {
    const templateRoot = makeTemplate({
      'skills/_x/SKILL.md': '# x\n',
      'agents/a.md': '# a\n',
      'rules/r.md': '# r\n',
    });
    const repo = makeRepo();

    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot }),
    );

    expect(captured.exitCode).toBeNull();
    for (const kind of __INTERNALS__.TEMPLATE_KINDS) {
      expect(existsSync(join(repo, '.claude', kind))).toBe(true);
    }
    // Leaf files are symlinks (D3 per-file constraint).
    const leafs = [
      join(repo, '.claude', 'skills', '_x', 'SKILL.md'),
      join(repo, '.claude', 'agents', 'a.md'),
      join(repo, '.claude', 'rules', 'r.md'),
    ];
    for (const leaf of leafs) {
      expect(lstatSync(leaf).isSymbolicLink()).toBe(true);
    }
    // Symlinks resolve to the project's source tree.
    const target = readlinkSync(
      join(repo, '.claude', 'rules', 'r.md'),
    );
    const resolved = pathResolve(join(repo, '.claude', 'rules'), target);
    expect(resolved).toBe(
      join(repo, '.gobbi', 'projects', 'gobbi', 'rules', 'r.md'),
    );
    // And following the link returns the content.
    expect(readFileSync(resolved, 'utf8')).toBe('# r\n');
  });

  test('re-install with --force does NOT mutate settings.json or rebuild farm', async () => {
    const tplV1 = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();

    // Fresh install.
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tplV1 }),
    );
    expect(captured.exitCode).toBeNull();
    const farmBefore = readlinkSync(
      join(repo, '.claude', 'rules', 'r.md'),
    );

    // Simulate operator adding a custom field to settings.json.
    const custom = {
      schemaVersion: 1,
      workflow: { execution: { discuss: { mode: 'agent' } } },
    };
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify(custom, null, 2),
      'utf8',
    );

    // Re-install with --force.
    const tplV2 = makeTemplate({ 'rules/r.md': 'v2\n' });
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--force'], {
        repoRoot: repo,
        templateRoot: tplV2,
      }),
    );
    expect(captured.exitCode).toBeNull();

    // settings.json preserved (re-install is content-only).
    const settingsAfter = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as { workflow: { execution: { discuss: { mode: string } } } };
    expect(settingsAfter.workflow.execution.discuss.mode).toBe('agent');

    // Farm left alone — symlink still points where the fresh install
    // left it.
    const farmAfter = readlinkSync(
      join(repo, '.claude', 'rules', 'r.md'),
    );
    expect(farmAfter).toBe(farmBefore);
  });

  test('fresh install preserves existing .claude/ files', async () => {
    // Regression lock for W5 eval NI-1: `buildFarmIntoRoot` must NOT
    // wipe `destRoot` itself — only the three per-kind subdirectories.
    // Operators frequently carry non-farm siblings under `.claude/`
    // (CLAUDE.md, README.md, settings.json); a fresh install has to
    // leave them intact.
    const templateRoot = makeTemplate({
      'skills/_x/SKILL.md': '# x\n',
      'agents/a.md': '# a\n',
      'rules/r.md': '# r\n',
    });
    const repo = makeRepo();

    // Seed preexisting `.claude/` siblings.
    const claudeRoot = join(repo, '.claude');
    mkdirSync(claudeRoot, { recursive: true });
    writeFileSync(
      join(claudeRoot, 'CLAUDE.md'),
      '# operator claude.md\n',
      'utf8',
    );
    writeFileSync(
      join(claudeRoot, 'README.md'),
      '# operator readme\n',
      'utf8',
    );
    writeFileSync(
      join(claudeRoot, 'user-settings.json'),
      JSON.stringify({ operator: 'value' }),
      'utf8',
    );

    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot }),
    );

    expect(captured.exitCode).toBeNull();

    // Siblings survive with their original content.
    expect(existsSync(join(claudeRoot, 'CLAUDE.md'))).toBe(true);
    expect(readFileSync(join(claudeRoot, 'CLAUDE.md'), 'utf8')).toBe(
      '# operator claude.md\n',
    );
    expect(readFileSync(join(claudeRoot, 'README.md'), 'utf8')).toBe(
      '# operator readme\n',
    );
    expect(
      JSON.parse(readFileSync(join(claudeRoot, 'user-settings.json'), 'utf8')),
    ).toEqual({ operator: 'value' });

    // Farm symlinks materialise under the three kind roots.
    for (const kind of __INTERNALS__.TEMPLATE_KINDS) {
      expect(existsSync(join(claudeRoot, kind))).toBe(true);
    }
    expect(
      lstatSync(join(claudeRoot, 'rules', 'r.md')).isSymbolicLink(),
    ).toBe(true);

    // Workspace settings written as usual.
    expect(existsSync(join(repo, '.gobbi', 'settings.json'))).toBe(true);
  });

  test('--dry-run shows the settings + farm lines without touching disk', async () => {
    const templateRoot = makeTemplate({ 'rules/r.md': '# r\n' });
    const repo = makeRepo();

    await captureExit(() =>
      runInstallWithOptions(['--dry-run'], {
        repoRoot: repo,
        templateRoot,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('[dry-run]');
    expect(captured.stdout).toContain('seeded .gobbi/settings.json');
    expect(captured.stdout).toContain(
      'farm: skills, agents, rules -> .gobbi/projects/gobbi/',
    );
    // Nothing on disk.
    expect(existsSync(join(repo, '.gobbi', 'settings.json'))).toBe(false);
    expect(existsSync(join(repo, '.claude', 'rules'))).toBe(false);
  });
});

// ===========================================================================
// seedProjectFromTemplates — exported content-copy helper
// ===========================================================================

describe('seedProjectFromTemplates', () => {
  test('copies every template file into the target project (content-only)', () => {
    const templateRoot = makeTemplate({
      'skills/_y/SKILL.md': '# y\n',
      'rules/r.md': 'content\n',
    });
    const repo = makeRepo();

    const result = seedProjectFromTemplates({
      repoRoot: repo,
      projectName: 'foo',
      templateRoot,
    });

    expect(result.filesCopied).toBe(2);
    expect(result.projectName).toBe('foo');
    expect(
      existsSync(
        join(repo, '.gobbi', 'projects', 'foo', 'skills', '_y', 'SKILL.md'),
      ),
    ).toBe(true);
    expect(
      readFileSync(
        join(repo, '.gobbi', 'projects', 'foo', 'rules', 'r.md'),
        'utf8',
      ),
    ).toBe('content\n');

    // No manifest is written (manifest system removed in T-2a.3).
    expect(
      existsSync(
        join(repo, '.gobbi', 'projects', 'foo', '.install-manifest.json'),
      ),
    ).toBe(false);
    // Content-only contract: NO settings.json write, NO .claude/ farm.
    expect(existsSync(join(repo, '.gobbi', 'settings.json'))).toBe(false);
    expect(existsSync(join(repo, '.claude'))).toBe(false);
  });

  test('throws SeedError kind already-populated when project has content', () => {
    const templateRoot = makeTemplate({ 'rules/r.md': '# r\n' });
    const repo = makeRepo();
    // Pre-populate the target project.
    const existing = join(repo, '.gobbi', 'projects', 'foo', 'rules', 'x.md');
    mkdirSync(join(existing, '..'), { recursive: true });
    writeFileSync(existing, 'old\n', 'utf8');

    expect(() =>
      seedProjectFromTemplates({
        repoRoot: repo,
        projectName: 'foo',
        templateRoot,
      }),
    ).toThrow(SeedError);
  });

  test('force: true overwrites preexisting plugin-bundled files', () => {
    const templateRoot = makeTemplate({
      'rules/r.md': 'template\n',
      'rules/new.md': 'new-file\n',
    });
    const repo = makeRepo();
    // Pre-populate one of the two files.
    const existing = join(repo, '.gobbi', 'projects', 'foo', 'rules', 'r.md');
    mkdirSync(join(existing, '..'), { recursive: true });
    writeFileSync(existing, 'user-content\n', 'utf8');

    const result = seedProjectFromTemplates({
      repoRoot: repo,
      projectName: 'foo',
      templateRoot,
      force: true,
    });

    // Both template files counted as copied.
    expect(result.filesCopied).toBe(2);
    // Existing file overwritten with the template content (matches
    // `gobbi install --force` semantics — bundle wins).
    expect(readFileSync(existing, 'utf8')).toBe('template\n');
    // New file copied.
    expect(
      readFileSync(
        join(repo, '.gobbi', 'projects', 'foo', 'rules', 'new.md'),
        'utf8',
      ),
    ).toBe('new-file\n');
  });

  test('force: true preserves user-authored files outside the bundle', () => {
    const templateRoot = makeTemplate({ 'rules/r.md': 'template\n' });
    const repo = makeRepo();
    // User-authored file that does NOT correspond to any bundled path.
    const userFile = join(
      repo,
      '.gobbi',
      'projects',
      'foo',
      'rules',
      'user-only.md',
    );
    mkdirSync(join(userFile, '..'), { recursive: true });
    writeFileSync(userFile, 'user-content\n', 'utf8');

    seedProjectFromTemplates({
      repoRoot: repo,
      projectName: 'foo',
      templateRoot,
      force: true,
    });

    // User file untouched — the seed loop only iterates over
    // template-bundle paths and never inspects others.
    expect(readFileSync(userFile, 'utf8')).toBe('user-content\n');
  });

  test('zero-content templateRoot is a no-op (no files copied)', () => {
    const repo = makeRepo();
    // Point templateRoot at a tree that has the three kind dirs but
    // no files — the enumerator visits them and yields nothing.
    const emptyRoot = makeScratch('empty-tpl-');
    for (const kind of __INTERNALS__.TEMPLATE_KINDS) {
      mkdirSync(join(emptyRoot, kind), { recursive: true });
    }
    const result = seedProjectFromTemplates({
      repoRoot: repo,
      projectName: 'foo',
      templateRoot: emptyRoot,
    });
    expect(result.filesCopied).toBe(0);
    // No files materialised under the target project.
    expect(
      existsSync(join(repo, '.gobbi', 'projects', 'foo', 'rules')),
    ).toBe(false);
  });
});

// ===========================================================================
// Re-install collision gate (replaces the prior --upgrade gate)
// ===========================================================================

describe('runInstall — collision gate', () => {
  test('refuses without --force when any destination file exists', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBeNull();

    // Second run without --force: the destination file already exists.
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('--force');
    expect(captured.stderr).toContain('rules/r.md');
    expect(captured.stdout).toContain('COLLISION');
  });

  test('--force overwrites preexisting destination files', async () => {
    const tplV1 = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tplV1 }),
    );
    expect(captured.exitCode).toBeNull();

    const tplV2 = makeTemplate({ 'rules/r.md': 'v2\n' });
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--force'], {
        repoRoot: repo,
        templateRoot: tplV2,
      }),
    );

    expect(captured.exitCode).toBeNull();
    // File overwritten with v2.
    expect(
      readFileSync(join(projectRoot(repo, 'gobbi'), 'rules/r.md'), 'utf8'),
    ).toBe('v2\n');
    expect(captured.stdout).toContain('1 overwritten');
  });

  test('--force preserves user-authored files outside the bundle', async () => {
    const tpl = makeTemplate({ 'rules/bundled.md': 'bundled\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBeNull();

    // User adds a file that does NOT correspond to any bundled path.
    const userFile = join(
      projectRoot(repo, 'gobbi'),
      'rules',
      'user-only.md',
    );
    writeFileSync(userFile, 'user-content\n', 'utf8');

    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--force'], {
        repoRoot: repo,
        templateRoot: tpl,
      }),
    );
    expect(captured.exitCode).toBeNull();
    // User file untouched — the install loop only iterates bundled paths.
    expect(readFileSync(userFile, 'utf8')).toBe('user-content\n');
  });

  test('preexisting content from a non-template path still blocks without --force on overlapping path', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    // Drop a file at the SAME path the template ships, with no install
    // having run before. The first install must refuse.
    const stray = join(projectRoot(repo, 'gobbi'), 'rules/r.md');
    mkdirSync(join(stray, '..'), { recursive: true });
    writeFileSync(stray, 'user-content\n', 'utf8');

    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('--force');
    // File still has the user's content.
    expect(readFileSync(stray, 'utf8')).toBe('user-content\n');
  });

  test('--force on a fresh install where the file does not exist still works', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions(['--force'], {
        repoRoot: repo,
        templateRoot: tpl,
      }),
    );
    expect(captured.exitCode).toBeNull();
    expect(
      readFileSync(join(projectRoot(repo, 'gobbi'), 'rules/r.md'), 'utf8'),
    ).toBe('v1\n');
    expect(captured.stdout).toContain('1 added');
  });
});

// ===========================================================================
// --dry-run
// ===========================================================================

describe('runInstall --dry-run', () => {
  test('prints the plan without writing files', async () => {
    const tpl = makeTemplate({
      'skills/_git/SKILL.md': '# git\n',
      'rules/r.md': 'v1\n',
    });
    const repo = makeRepo();

    await captureExit(() =>
      runInstallWithOptions(['--dry-run'], {
        repoRoot: repo,
        templateRoot: tpl,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('[dry-run]');
    expect(captured.stdout).toContain('ADD');
    // Nothing actually written.
    expect(existsSync(join(projectRoot(repo, 'gobbi'), 'rules/r.md'))).toBe(
      false,
    );
  });

  test('on collision, dry-run still exits 1 and writes nothing', async () => {
    const tplV1 = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tplV1 }),
    );
    expect(captured.exitCode).toBeNull();

    const before = readFileSync(
      join(projectRoot(repo, 'gobbi'), 'rules/r.md'),
      'utf8',
    );

    const tplV2 = makeTemplate({ 'rules/r.md': 'v2\n' });
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--dry-run'], {
        repoRoot: repo,
        templateRoot: tplV2,
      }),
    );

    expect(captured.exitCode).toBe(1);
    // File untouched (still v1).
    expect(
      readFileSync(join(projectRoot(repo, 'gobbi'), 'rules/r.md'), 'utf8'),
    ).toBe(before);
  });
});

// ===========================================================================
// Template-root resolution
// ===========================================================================

describe('resolveDefaultTemplateRoot', () => {
  test('returns a string path in the dev checkout or null in a degenerate layout', () => {
    // Under the real repo (the test worktree), the fallback walk should
    // hit the `.gobbi/projects/gobbi/` directory. The exact path varies
    // by checkout; the contract is "non-null under the dogfooding
    // worktree; contains the three template kinds".
    const result = resolveDefaultTemplateRoot();
    if (result === null) return; // tolerate CI layouts that differ
    expect(result.endsWith('.gobbi/projects/gobbi')).toBe(true);
    for (const kind of __INTERNALS__.TEMPLATE_KINDS) {
      expect(existsSync(join(result, kind))).toBe(true);
    }
  });
});

// ===========================================================================
// Internals — planInstall + renderers (unit checks)
// ===========================================================================

describe('planInstall — direct unit checks', () => {
  test('emits add / overwrite / collision per per-file state', () => {
    const tplRoot = makeScratch('plan-tpl-');
    const projRootDir = makeScratch('plan-proj-');
    const put = (root: string, rel: string, content: string): void => {
      const abs = join(root, rel);
      mkdirSync(join(abs, '..'), { recursive: true });
      writeFileSync(abs, content, 'utf8');
    };

    // ADD: template has it, project doesn't.
    put(tplRoot, 'skills/added.md', 'new\n');
    // EXISTS: template + project both have it.
    put(tplRoot, 'skills/exists.md', 'tpl\n');
    put(projRootDir, 'skills/exists.md', 'proj\n');

    const templateFiles = __INTERNALS__.enumerateTemplateFiles(tplRoot);

    // Without force → existing path is COLLISION.
    const planNoForce = __INTERNALS__.planInstall({
      templateFiles,
      projectRoot: projRootDir,
      force: false,
    });
    const byPathNoForce = new Map<string, string>();
    for (const a of planNoForce) byPathNoForce.set(a.relPath, a.kind);
    expect(byPathNoForce.get('skills/added.md')).toBe('add');
    expect(byPathNoForce.get('skills/exists.md')).toBe('collision');

    // With force → existing path is OVERWRITE.
    const planForce = __INTERNALS__.planInstall({
      templateFiles,
      projectRoot: projRootDir,
      force: true,
    });
    const byPathForce = new Map<string, string>();
    for (const a of planForce) byPathForce.set(a.relPath, a.kind);
    expect(byPathForce.get('skills/added.md')).toBe('add');
    expect(byPathForce.get('skills/exists.md')).toBe('overwrite');
  });
});

describe('renderPlan', () => {
  test('emits the summary line with add / overwrite / collision counts', () => {
    const out = renderPlan({
      projectName: 'gobbi',
      plan: [
        { kind: 'add', relPath: 'rules/a.md' },
        { kind: 'overwrite', relPath: 'rules/b.md' },
        { kind: 'collision', relPath: 'rules/c.md' },
      ],
      dryRun: false,
      projectRoot: '/scratch/.gobbi/projects/gobbi',
    });
    expect(out).toContain("project 'gobbi'");
    expect(out).toContain('ADD       rules/a.md');
    expect(out).toContain('OVERWRITE rules/b.md');
    expect(out).toContain('COLLISION rules/c.md');
    expect(out).toContain('1 added');
    expect(out).toContain('1 overwritten');
    expect(out).toContain('1 collision(s)');
  });
});

// ===========================================================================
// PR-CFM-D / #187 — --project name validation guard
// ===========================================================================

describe('runInstall — rejects invalid --project values', () => {
  test.each(['../tmp', '../../escape', '..', 'foo/bar', 'foo\\bar'])(
    'rejects --project=%j with exit 2 + L13 stderr template + no FS write',
    async (payload) => {
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions(['--project', payload], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBe(2);
      expect(captured.stderr).toMatch(
        /^gobbi install: invalid --project name '/,
      );
      // The raw payload renders verbatim inside the single-quoted slot.
      expect(captured.stderr).toContain(`'${payload}'`);
      // FS-no-write assertion: the would-be project root resolved from
      // join(repoRoot, '.gobbi', 'projects', payload) must NOT exist —
      // path.join collapses '..' segments, so the assertion confirms
      // the validation guard short-circuits BEFORE any directory create.
      expect(existsSync(join(repo, '.gobbi', 'projects', payload))).toBe(false);
    },
  );
});
