/**
 * Unit tests for `lib/symlink-farm.ts::buildFarmIntoRoot`.
 *
 * The primary regression these tests guard against is destructive
 * behaviour at the destination root: the fresh-install path passes
 * `.claude/` itself as `destRoot`, which frequently carries non-farm
 * operator content (`CLAUDE.md`, `settings.json`, `README.md`). Wiping
 * the whole `destRoot` would silently delete that content — see the
 * W5 remediation round-2 evaluation finding NI-1. These tests lock
 * the preservation contract in place so the behaviour can't regress.
 */

import { afterEach, describe, expect, test } from 'bun:test';
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
  buildFarmIntoRoot,
  CLAUDE_FARM_KINDS,
} from '../symlink-farm.js';

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
 * Seed a minimal project source tree under
 * `<repo>/.gobbi/projects/<name>/{skills,agents,rules}/` from the
 * supplied map. Keys are paths relative to the project root
 * (e.g. `'skills/_x/SKILL.md'`).
 */
function seedProject(
  repoRoot: string,
  projectName: string,
  files: Readonly<Record<string, string>>,
): void {
  const root = join(repoRoot, '.gobbi', 'projects', projectName);
  for (const kind of CLAUDE_FARM_KINDS) {
    mkdirSync(join(root, kind), { recursive: true });
  }
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(join(abs, '..'), { recursive: true });
    writeFileSync(abs, content, 'utf8');
  }
}

// ===========================================================================
// Preservation contract — the W5 NI-1 regression lock
// ===========================================================================

describe('buildFarmIntoRoot — preservation contract', () => {
  test('preserves non-farm .claude/ content', () => {
    const repo = makeScratch('farm-preserve-');
    seedProject(repo, 'gobbi', {
      'skills/_x/SKILL.md': '# x\n',
      'agents/a.md': '# a\n',
      'rules/r.md': '# r\n',
    });

    // Simulate an operator's preexisting `.claude/` directory with
    // non-farm siblings: CLAUDE.md, README.md, settings.json. These
    // are NOT owned by the farm and must survive a `buildFarmIntoRoot`
    // call.
    const destRoot = join(repo, '.claude');
    mkdirSync(destRoot, { recursive: true });
    writeFileSync(join(destRoot, 'CLAUDE.md'), '# project claude.md\n', 'utf8');
    writeFileSync(join(destRoot, 'README.md'), '# project readme\n', 'utf8');
    writeFileSync(
      join(destRoot, 'settings.json'),
      JSON.stringify({ custom: 'value' }),
      'utf8',
    );

    buildFarmIntoRoot(repo, destRoot, 'gobbi');

    // Non-farm siblings survive with their original content.
    expect(existsSync(join(destRoot, 'CLAUDE.md'))).toBe(true);
    expect(readFileSync(join(destRoot, 'CLAUDE.md'), 'utf8')).toBe(
      '# project claude.md\n',
    );
    expect(existsSync(join(destRoot, 'README.md'))).toBe(true);
    expect(readFileSync(join(destRoot, 'README.md'), 'utf8')).toBe(
      '# project readme\n',
    );
    expect(existsSync(join(destRoot, 'settings.json'))).toBe(true);
    expect(JSON.parse(readFileSync(join(destRoot, 'settings.json'), 'utf8'))).toEqual(
      { custom: 'value' },
    );

    // Farm symlinks materialise at the three kind roots.
    const leafs: Array<{ rel: string; expectedSource: string }> = [
      {
        rel: 'skills/_x/SKILL.md',
        expectedSource: join(
          repo,
          '.gobbi',
          'projects',
          'gobbi',
          'skills',
          '_x',
          'SKILL.md',
        ),
      },
      {
        rel: 'agents/a.md',
        expectedSource: join(
          repo,
          '.gobbi',
          'projects',
          'gobbi',
          'agents',
          'a.md',
        ),
      },
      {
        rel: 'rules/r.md',
        expectedSource: join(
          repo,
          '.gobbi',
          'projects',
          'gobbi',
          'rules',
          'r.md',
        ),
      },
    ];
    for (const { rel, expectedSource } of leafs) {
      const leafPath = join(destRoot, rel);
      expect(lstatSync(leafPath).isSymbolicLink()).toBe(true);
      const target = readlinkSync(leafPath);
      const resolved = pathResolve(join(leafPath, '..'), target);
      expect(resolved).toBe(expectedSource);
    }
  });

  test('creates destRoot when it does not yet exist', () => {
    const repo = makeScratch('farm-fresh-');
    seedProject(repo, 'gobbi', { 'rules/r.md': '# r\n' });

    const destRoot = join(repo, '.claude');
    expect(existsSync(destRoot)).toBe(false);

    buildFarmIntoRoot(repo, destRoot, 'gobbi');

    expect(existsSync(destRoot)).toBe(true);
    for (const kind of CLAUDE_FARM_KINDS) {
      expect(existsSync(join(destRoot, kind))).toBe(true);
    }
    expect(
      lstatSync(join(destRoot, 'rules', 'r.md')).isSymbolicLink(),
    ).toBe(true);
  });

  test('wipes stale per-kind content on re-run while preserving siblings', () => {
    const repo = makeScratch('farm-rerun-');
    seedProject(repo, 'gobbi', { 'rules/r.md': '# r-v2\n' });

    // Operator placed a sibling in `.claude/` AND there is already
    // stale farm content (e.g. a prior aborted install left a plain
    // file at `.claude/rules/old.md`, not a symlink).
    const destRoot = join(repo, '.claude');
    mkdirSync(join(destRoot, 'rules'), { recursive: true });
    writeFileSync(join(destRoot, 'CLAUDE.md'), '# sibling\n', 'utf8');
    writeFileSync(
      join(destRoot, 'rules', 'stale.md'),
      'stale content\n',
      'utf8',
    );

    buildFarmIntoRoot(repo, destRoot, 'gobbi');

    // Sibling preserved.
    expect(readFileSync(join(destRoot, 'CLAUDE.md'), 'utf8')).toBe(
      '# sibling\n',
    );
    // Stale per-kind content wiped.
    expect(existsSync(join(destRoot, 'rules', 'stale.md'))).toBe(false);
    // New farm content materialised.
    expect(
      lstatSync(join(destRoot, 'rules', 'r.md')).isSymbolicLink(),
    ).toBe(true);
  });

  test('missing source kind produces empty kind dir without throwing', () => {
    const repo = makeScratch('farm-sparse-');
    // Only seed `rules/`; skip `skills/` and `agents/` entirely.
    const root = join(repo, '.gobbi', 'projects', 'gobbi');
    mkdirSync(join(root, 'rules'), { recursive: true });
    writeFileSync(join(root, 'rules', 'r.md'), '# r\n', 'utf8');

    const destRoot = join(repo, '.claude');
    buildFarmIntoRoot(repo, destRoot, 'gobbi');

    // All three kind dirs exist (empty for the missing ones).
    for (const kind of CLAUDE_FARM_KINDS) {
      expect(existsSync(join(destRoot, kind))).toBe(true);
    }
    // Only the seeded kind has a leaf.
    expect(
      lstatSync(join(destRoot, 'rules', 'r.md')).isSymbolicLink(),
    ).toBe(true);
  });
});
