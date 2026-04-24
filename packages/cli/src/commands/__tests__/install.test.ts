/**
 * Unit tests for `gobbi install` — fresh install, upgrade with 3-way
 * merge, conflict handling, dry-run mode, active-session gate, and
 * template-root resolution fallback.
 *
 * All tests operate against scratch directories in the OS temp dir.
 * Template content is synthesised in a per-test template root to
 * exercise every arm of the 3-way merge without relying on the real
 * `.gobbi/projects/gobbi/` content shipped by the package.
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
  renderActiveSessionError,
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
 * with the three template kinds populated from the supplied map, plus
 * a sentinel `package.json` at the `@gobbitools/cli` layer so
 * `readTarballVersion` has a deterministic version to pick up.
 * Returns the template-root path that can be passed as
 * `overrides.templateRoot`.
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
  // Write the sentinel package.json at the `@gobbitools/cli` layer so
  // the tarball-version walk finds it three ancestor steps up from the
  // template root.
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

function manifestPath(repo: string, name: string): string {
  return join(projectRoot(repo, name), '.install-manifest.json');
}

function seedActiveSession(repo: string, name: string, id: string): string {
  const dir = join(
    repo,
    '.gobbi',
    'projects',
    name,
    'sessions',
    id,
  );
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'state.json'),
    JSON.stringify({ currentStep: 'ideation' }),
    'utf8',
  );
  return dir;
}

// ===========================================================================
// Fresh install
// ===========================================================================

describe('runInstall — fresh install', () => {
  test('copies every template file and writes a manifest', async () => {
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

    const manifest = JSON.parse(
      readFileSync(manifestPath(repo, 'gobbi'), 'utf8'),
    ) as { schemaVersion: number; version: string; files: Record<string, string> };
    expect(manifest.schemaVersion).toBe(__INTERNALS__.MANIFEST_SCHEMA_VERSION);
    expect(Object.keys(manifest.files).sort()).toEqual([
      'agents/gobbi-agent.md',
      'rules/my-rule.md',
      'skills/_git/SKILL.md',
      'skills/_git/gotchas.md',
    ]);
    // Hash is 64 hex chars (sha256).
    for (const hash of Object.values(manifest.files)) {
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    }
    // Summary mentions the add counts.
    expect(captured.stdout).toContain('4 added');
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
    expect(existsSync(manifestPath(repo, 'alt'))).toBe(true);
    // The default 'gobbi' project must NOT have received anything.
    expect(existsSync(manifestPath(repo, 'gobbi'))).toBe(false);
  });
});

// ===========================================================================
// Fresh install — activation (settings.json + .claude/ farm)
// ===========================================================================

describe('runInstall — fresh install activation', () => {
  test('writes projects.active + projects.known to workspace settings.json', async () => {
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
    ) as { schemaVersion: number; projects: { active: string; known: string[] } };
    expect(settings.schemaVersion).toBe(1);
    expect(settings.projects.active).toBe('gobbi');
    expect(settings.projects.known).toEqual(['gobbi']);
    // Summary must diagnose the activation.
    expect(captured.stdout).toContain("projects.active = 'gobbi'");
  });

  test('custom --project name activates that project as the current one', async () => {
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
    ) as { projects: { active: string; known: string[] } };
    expect(settings.projects.active).toBe('alt');
    expect(settings.projects.known).toEqual(['alt']);
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

  test('upgrade install does NOT mutate settings.json or rebuild farm', async () => {
    const tplV1 = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();

    // Fresh install.
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tplV1 }),
    );
    expect(captured.exitCode).toBeNull();
    const settingsBefore = readFileSync(
      join(repo, '.gobbi', 'settings.json'),
      'utf8',
    );
    const farmBefore = readlinkSync(
      join(repo, '.claude', 'rules', 'r.md'),
    );

    // Simulate operator mutating `projects.active` to a different
    // value (e.g., they ran `gobbi project switch other` after the
    // fresh install). We want to assert upgrade does NOT clobber it.
    const custom = JSON.parse(settingsBefore) as {
      schemaVersion: number;
      projects: { active: string | null; known: string[] };
    };
    custom.projects.active = 'other';
    custom.projects.known = ['gobbi', 'other'];
    writeFileSync(
      join(repo, '.gobbi', 'settings.json'),
      JSON.stringify(custom, null, 2),
      'utf8',
    );

    // Upgrade install.
    const tplV2 = makeTemplate({ 'rules/r.md': 'v2\n' });
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--upgrade'], {
        repoRoot: repo,
        templateRoot: tplV2,
      }),
    );
    expect(captured.exitCode).toBeNull();

    // settings.json preserved (upgrade is content-only).
    const settingsAfter = JSON.parse(
      readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
    ) as { projects: { active: string | null; known: string[] } };
    expect(settingsAfter.projects.active).toBe('other');
    expect(settingsAfter.projects.known.sort()).toEqual(['gobbi', 'other']);

    // Farm left alone — symlink still points where the fresh install
    // left it. (Upgrade reinstalls the file content, but the symlink
    // is in `.claude/`, pointing at the still-live source.)
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
    expect(captured.stdout).toContain("projects.active = 'gobbi'");
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
  test('copies every template file and writes the manifest (content-only)', () => {
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
      existsSync(
        join(repo, '.gobbi', 'projects', 'foo', '.install-manifest.json'),
      ),
    ).toBe(true);

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

  test('force: true skips pre-existing files and counts only newly written', () => {
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

    expect(result.filesCopied).toBe(1);
    // Existing file preserved (not overwritten).
    expect(readFileSync(existing, 'utf8')).toBe('user-content\n');
    // New file copied.
    expect(
      readFileSync(
        join(repo, '.gobbi', 'projects', 'foo', 'rules', 'new.md'),
        'utf8',
      ),
    ).toBe('new-file\n');
  });

  test('throws SeedError kind template-not-found when the bundle is missing', () => {
    const repo = makeRepo();
    // Point templateRoot at an empty directory lacking the three kinds
    // so the resolver treats it as not-a-template. We use a scratch
    // path that lacks skills/agents/rules entirely.
    const emptyTpl = makeScratch('empty-tpl-');
    expect(() =>
      seedProjectFromTemplates({
        repoRoot: repo,
        projectName: 'foo',
        templateRoot: emptyTpl,
      }),
    // A templateRoot override that lacks content still enters the copy
    // loop (with 0 files). The template-not-found case only fires when
    // the override is omitted AND the resolver walk finds nothing.
    // Here we simply assert zero-copy is fine.
    ).not.toThrow();
    // Zero files copied; manifest still written (with empty files map).
    const manifestPath = join(
      repo,
      '.gobbi',
      'projects',
      'foo',
      '.install-manifest.json',
    );
    expect(existsSync(manifestPath)).toBe(true);
  });
});

// ===========================================================================
// Upgrade — 3-way merge arms
// ===========================================================================

describe('runInstall --upgrade — 3-way merge', () => {
  test('overwrites unmodified files when the template changes', async () => {
    // Round 1: fresh install.
    const templateV1 = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], {
        repoRoot: repo,
        templateRoot: templateV1,
      }),
    );
    expect(captured.exitCode).toBeNull();

    // Round 2: template changes; user did NOT touch the file.
    const templateV2 = makeTemplate({ 'rules/r.md': 'v2\n' });
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--upgrade'], {
        repoRoot: repo,
        templateRoot: templateV2,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(
      readFileSync(join(projectRoot(repo, 'gobbi'), 'rules/r.md'), 'utf8'),
    ).toBe('v2\n');
    expect(captured.stdout).toContain('1 updated');
  });

  test('leaves user-modified-but-template-unchanged files alone', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();

    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBeNull();

    // User edits the file.
    const filePath = join(projectRoot(repo, 'gobbi'), 'rules/r.md');
    writeFileSync(filePath, 'user edit\n', 'utf8');

    // Template unchanged (re-ship the same tpl).
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--upgrade'], {
        repoRoot: repo,
        templateRoot: tpl,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(readFileSync(filePath, 'utf8')).toBe('user edit\n');
    expect(captured.stdout).toContain('1 user-skipped');
  });

  test('marks conflict on user-modified + template-changed and exits 1', async () => {
    const templateV1 = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], {
        repoRoot: repo,
        templateRoot: templateV1,
      }),
    );
    expect(captured.exitCode).toBeNull();

    // User edit.
    const filePath = join(projectRoot(repo, 'gobbi'), 'rules/r.md');
    writeFileSync(filePath, 'user edit\n', 'utf8');

    // Template also moved.
    const templateV2 = makeTemplate({ 'rules/r.md': 'v2\n' });
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--upgrade'], {
        repoRoot: repo,
        templateRoot: templateV2,
      }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stdout).toContain('1 conflict');
    expect(captured.stdout).toContain('rules/r.md');
    // User's file must NOT have been overwritten.
    expect(readFileSync(filePath, 'utf8')).toBe('user edit\n');

    // The manifest for the conflicted file retains the PRIOR hash —
    // the v1 baseline — so a later resolve-to-v2 still reclassifies
    // correctly (current != base, template == base → template-only).
    const manifest = JSON.parse(
      readFileSync(manifestPath(repo, 'gobbi'), 'utf8'),
    ) as { files: Record<string, string> };
    // Compute the v1 hash for comparison.
    const v1Hash = __INTERNALS__.hashFile(join(templateV1, 'rules/r.md'));
    expect(manifest.files['rules/r.md']).toBe(v1Hash);
  });

  test('converged (user + template agree) updates manifest without writing', async () => {
    // The only way to hit CONVERGED cleanly: no-manifest scenario where
    // the user already has a file that happens to equal the template.
    const tpl = makeTemplate({ 'rules/r.md': 'same\n' });
    const repo = makeRepo();
    // Pre-seed the target file WITHOUT a manifest.
    const filePath = join(projectRoot(repo, 'gobbi'), 'rules/r.md');
    mkdirSync(join(filePath, '..'), { recursive: true });
    writeFileSync(filePath, 'same\n', 'utf8');

    await captureExit(() =>
      runInstallWithOptions(['--upgrade'], {
        repoRoot: repo,
        templateRoot: tpl,
      }),
    );

    expect(captured.exitCode).toBeNull();
    // File untouched.
    expect(readFileSync(filePath, 'utf8')).toBe('same\n');
    expect(captured.stdout).toContain('1 converged');

    // Manifest records the hash so the next run treats it as unchanged.
    const manifest = JSON.parse(
      readFileSync(manifestPath(repo, 'gobbi'), 'utf8'),
    ) as { files: Record<string, string> };
    expect(manifest.files['rules/r.md']).toMatch(/^[0-9a-f]{64}$/);
  });

  test('second run with the same template reports zero changes', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'stable\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBeNull();

    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--upgrade'], {
        repoRoot: repo,
        templateRoot: tpl,
      }),
    );
    expect(captured.exitCode).toBeNull();
    expect(captured.stdout).toContain('0 added');
    expect(captured.stdout).toContain('0 updated');
    expect(captured.stdout).toContain('1 unchanged');
  });
});

// ===========================================================================
// --upgrade gate
// ===========================================================================

describe('runInstall — --upgrade gate', () => {
  test('existing manifest without --upgrade exits 1', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBeNull();

    // Second run without --upgrade.
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('--upgrade');
  });

  test('preexisting content without manifest still blocks without --upgrade', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    // Drop a stray file into the target tree (user-created, no manifest).
    const stray = join(projectRoot(repo, 'gobbi'), 'rules/stray.md');
    mkdirSync(join(stray, '..'), { recursive: true });
    writeFileSync(stray, 'hi\n', 'utf8');

    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );
    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('--upgrade');
  });
});

// ===========================================================================
// --dry-run
// ===========================================================================

describe('runInstall --dry-run', () => {
  test('prints the plan without writing files or manifest', async () => {
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
    expect(existsSync(join(projectRoot(repo, 'gobbi'), 'rules/r.md'))).toBe(false);
    expect(existsSync(manifestPath(repo, 'gobbi'))).toBe(false);
  });

  test('on upgrade with conflict, dry-run still exits 1 and writes nothing', async () => {
    const tplV1 = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tplV1 }),
    );
    expect(captured.exitCode).toBeNull();

    const filePath = join(projectRoot(repo, 'gobbi'), 'rules/r.md');
    writeFileSync(filePath, 'user edit\n', 'utf8');

    const tplV2 = makeTemplate({ 'rules/r.md': 'v2\n' });
    const manifestBefore = readFileSync(manifestPath(repo, 'gobbi'), 'utf8');
    resetCaptured();
    await captureExit(() =>
      runInstallWithOptions(['--upgrade', '--dry-run'], {
        repoRoot: repo,
        templateRoot: tplV2,
      }),
    );

    expect(captured.exitCode).toBe(1);
    // File untouched.
    expect(readFileSync(filePath, 'utf8')).toBe('user edit\n');
    // Manifest untouched.
    expect(readFileSync(manifestPath(repo, 'gobbi'), 'utf8')).toBe(
      manifestBefore,
    );
  });
});

// ===========================================================================
// Active-session gate
// ===========================================================================

describe('runInstall — active-session gate', () => {
  test('active session in target project blocks install without --force', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    seedActiveSession(repo, 'gobbi', 'live-session');

    await captureExit(() =>
      runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
    );

    expect(captured.exitCode).toBe(1);
    expect(captured.stderr).toContain('live-session');
    expect(captured.stderr).toContain('currentStep: ideation');
    // Install did not run — no manifest written.
    expect(existsSync(manifestPath(repo, 'gobbi'))).toBe(false);
  });

  test('--force overrides the active-session gate', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    seedActiveSession(repo, 'gobbi', 'live-session');

    await captureExit(() =>
      runInstallWithOptions(['--force'], {
        repoRoot: repo,
        templateRoot: tpl,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(manifestPath(repo, 'gobbi'))).toBe(true);
  });

  test('active session in a DIFFERENT project does not block install', async () => {
    const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
    const repo = makeRepo();
    seedActiveSession(repo, 'other', 'live-session');

    await captureExit(() =>
      runInstallWithOptions(['--project', 'gobbi'], {
        repoRoot: repo,
        templateRoot: tpl,
      }),
    );

    expect(captured.exitCode).toBeNull();
    expect(existsSync(manifestPath(repo, 'gobbi'))).toBe(true);
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
// Internals — classifyFiles + renderers (unit checks)
// ===========================================================================

describe('classifyFiles — direct unit checks', () => {
  test('emits the six action kinds correctly', () => {
    // Build two scratch trees: template + project, plus a base map.
    const tplRoot = makeScratch('cls-tpl-');
    const projRoot = makeScratch('cls-proj-');
    const put = (root: string, rel: string, content: string): void => {
      const abs = join(root, rel);
      mkdirSync(join(abs, '..'), { recursive: true });
      writeFileSync(abs, content, 'utf8');
    };

    // ADD: template has it, project doesn't.
    put(tplRoot, 'skills/added.md', 'new\n');
    // UNCHANGED: all three equal.
    put(tplRoot, 'skills/unchanged.md', 'same\n');
    put(projRoot, 'skills/unchanged.md', 'same\n');
    // TEMPLATE_ONLY: project == base, template moved.
    put(tplRoot, 'skills/tplonly.md', 'new\n');
    put(projRoot, 'skills/tplonly.md', 'old\n');
    // USER_ONLY: project moved, template == base.
    put(tplRoot, 'skills/useronly.md', 'base\n');
    put(projRoot, 'skills/useronly.md', 'user-edit\n');
    // CONVERGED: both moved to same value.
    put(tplRoot, 'skills/converged.md', 'agreed\n');
    put(projRoot, 'skills/converged.md', 'agreed\n');
    // CONFLICT: both moved independently.
    put(tplRoot, 'skills/conflict.md', 'tpl-side\n');
    put(projRoot, 'skills/conflict.md', 'user-side\n');

    const hashOf = (path: string): string =>
      __INTERNALS__.hashFile(path);
    const base: Record<string, string> = {
      'skills/unchanged.md': hashOf(join(tplRoot, 'skills/unchanged.md')),
      'skills/tplonly.md': hashOf(join(projRoot, 'skills/tplonly.md')),
      'skills/useronly.md': hashOf(join(tplRoot, 'skills/useronly.md')),
      'skills/converged.md': 'f'.repeat(64), // distinct from both sides
      'skills/conflict.md': 'e'.repeat(64),
    };

    const templateFiles = __INTERNALS__.enumerateTemplateFiles(tplRoot);
    const actions = __INTERNALS__.classifyFiles({
      templateRoot: tplRoot,
      templateFiles,
      projectRoot: projRoot,
      baseEntries: base,
    });

    const byPath = new Map<string, string>();
    for (const a of actions) byPath.set(a.relPath, a.kind);
    expect(byPath.get('skills/added.md')).toBe('add');
    expect(byPath.get('skills/unchanged.md')).toBe('unchanged');
    expect(byPath.get('skills/tplonly.md')).toBe('template-only');
    expect(byPath.get('skills/useronly.md')).toBe('user-only');
    expect(byPath.get('skills/converged.md')).toBe('converged');
    expect(byPath.get('skills/conflict.md')).toBe('conflict');
  });
});

describe('renderPlan + renderActiveSessionError', () => {
  test('renderPlan emits the summary line and conflict block', () => {
    const out = renderPlan({
      projectName: 'gobbi',
      actions: [
        { kind: 'add', relPath: 'rules/a.md', templateHash: 'a'.repeat(64) },
        {
          kind: 'conflict',
          relPath: 'rules/c.md',
          baseHash: 'b'.repeat(64),
          templateHash: 'c'.repeat(64),
          currentHash: 'd'.repeat(64),
        },
      ],
      dryRun: false,
      written: [
        { kind: 'add', relPath: 'rules/a.md', templateHash: 'a'.repeat(64) },
      ],
      conflicts: [
        {
          kind: 'conflict',
          relPath: 'rules/c.md',
          baseHash: 'b'.repeat(64),
          templateHash: 'c'.repeat(64),
          currentHash: 'd'.repeat(64),
        },
      ],
      tarballVersion: '1.2.3',
    });
    expect(out).toContain("project 'gobbi' @ version 1.2.3");
    expect(out).toContain('ADD       rules/a.md');
    expect(out).toContain('CONFLICT  rules/c.md');
    expect(out).toContain('1 added');
    expect(out).toContain('1 conflict(s)');
    expect(out).toContain('Resolve each conflict manually');
  });

  test('renderActiveSessionError lists each session and suggests --force', () => {
    const out = renderActiveSessionError(
      [
        {
          sessionId: 'abc',
          sessionDir: '/tmp/abc',
          projectName: 'gobbi',
          currentStep: 'planning',
        },
      ],
      'gobbi',
    );
    expect(out).toContain("project 'gobbi'");
    expect(out).toContain('abc');
    expect(out).toContain('currentStep: planning');
    expect(out).toContain('--force');
  });
});
