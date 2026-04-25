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
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve as pathResolve } from 'node:path';

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

// ===========================================================================
// Operational edges — W6.4 coverage extension
// ===========================================================================

/**
 * Recursively collect every filesystem leaf (file, symlink, or empty dir)
 * under `root` so tests can snapshot the full farm layout without caring
 * about traversal order. Keys are repo-relative paths; values are the
 * {@link Dirent}-style kind of the leaf. Used by the idempotency and
 * cross-project-rotation tests that need to compare whole-tree shape.
 */
function snapshotTree(
  root: string,
): Record<string, 'file' | 'symlink' | 'dir'> {
  const out: Record<string, 'file' | 'symlink' | 'dir'> = {};
  const stack: string[] = [root];
  while (stack.length > 0) {
    const dir = stack.pop();
    if (dir === undefined) break;
    const entries = readdirSync(dir, { withFileTypes: true });
    if (entries.length === 0 && dir !== root) {
      out[relative(root, dir)] = 'dir';
      continue;
    }
    for (const e of entries) {
      const abs = join(dir, e.name);
      const rel = relative(root, abs);
      if (e.isSymbolicLink()) {
        out[rel] = 'symlink';
      } else if (e.isDirectory()) {
        stack.push(abs);
      } else if (e.isFile()) {
        out[rel] = 'file';
      }
    }
  }
  return out;
}

describe('buildFarmIntoRoot — operational edges', () => {
  test('cross-project rotation: every symlink re-points at the new project', () => {
    const repo = makeScratch('farm-rotate-');
    seedProject(repo, 'alpha', {
      'skills/_s/SKILL.md': '# alpha skill\n',
      'skills/_s/evaluation.md': '# alpha eval\n',
      'agents/a.md': '# alpha agent\n',
      'rules/r.md': '# alpha rule\n',
    });
    seedProject(repo, 'beta', {
      'skills/_s/SKILL.md': '# beta skill\n',
      'skills/_s/evaluation.md': '# beta eval\n',
      'agents/a.md': '# beta agent\n',
      'rules/r.md': '# beta rule\n',
    });

    const destRoot = join(repo, '.claude');
    buildFarmIntoRoot(repo, destRoot, 'alpha');

    // Sanity-probe: alpha farm resolves into alpha's tree.
    const alphaProbe = join(destRoot, 'skills', '_s', 'SKILL.md');
    expect(
      pathResolve(
        join(alphaProbe, '..'),
        readlinkSync(alphaProbe),
      ),
    ).toBe(
      join(repo, '.gobbi', 'projects', 'alpha', 'skills', '_s', 'SKILL.md'),
    );

    // Rotate to beta. The switch-command path would do this under a
    // temp root; the fresh-install path would call it in place. Either
    // way the caller contract is: after the call, every symlink under
    // each kind points at the *new* project's tree.
    buildFarmIntoRoot(repo, destRoot, 'beta');

    const alphaRoot = join(repo, '.gobbi', 'projects', 'alpha');
    const betaRoot = join(repo, '.gobbi', 'projects', 'beta');
    const stalePointers: string[] = [];
    const misPointers: string[] = [];
    for (const kind of CLAUDE_FARM_KINDS) {
      const kindDir = join(destRoot, kind);
      const stack: string[] = [kindDir];
      while (stack.length > 0) {
        const dir = stack.pop();
        if (dir === undefined) break;
        for (const e of readdirSync(dir, { withFileTypes: true })) {
          const abs = join(dir, e.name);
          if (e.isDirectory()) {
            stack.push(abs);
            continue;
          }
          if (!e.isSymbolicLink()) {
            misPointers.push(abs);
            continue;
          }
          const resolved = pathResolve(
            join(abs, '..'),
            readlinkSync(abs),
          );
          if (resolved.startsWith(alphaRoot)) {
            stalePointers.push(`${abs} -> ${resolved}`);
          } else if (!resolved.startsWith(betaRoot)) {
            misPointers.push(`${abs} -> ${resolved}`);
          }
        }
      }
    }
    expect(stalePointers).toEqual([]);
    expect(misPointers).toEqual([]);

    // Spot-check the content to confirm the redirected link reads beta.
    const betaProbe = join(destRoot, 'skills', '_s', 'SKILL.md');
    expect(readFileSync(betaProbe, 'utf8')).toBe('# beta skill\n');
  });

  test('dangling source symlink is mirrored as a dangling link, not a crash', () => {
    const repo = makeScratch('farm-dangle-');
    seedProject(repo, 'gobbi', { 'skills/_x/SKILL.md': '# ok\n' });

    // Plant a dangling symlink directly under the skills tree — points
    // at a path that does not (and will not) exist.
    const skillsRoot = join(repo, '.gobbi', 'projects', 'gobbi', 'skills');
    const danglingSrc = join(skillsRoot, '_x', 'dangler.md');
    symlinkSync('/nonexistent/target/__gobbi_test__', danglingSrc);

    const destRoot = join(repo, '.claude');
    // Must not throw — readdirSync + withFileTypes reports the dangler
    // as `isSymbolicLink()` and the farm faithfully mirrors it.
    expect(() => buildFarmIntoRoot(repo, destRoot, 'gobbi')).not.toThrow();

    // The mirrored leaf is itself a symlink and itself dangling —
    // existsSync follows links and should return false.
    const mirrored = join(destRoot, 'skills', '_x', 'dangler.md');
    expect(lstatSync(mirrored).isSymbolicLink()).toBe(true);
    expect(existsSync(mirrored)).toBe(false);

    // The healthy leaf in the same kind is unaffected.
    const healthy = join(destRoot, 'skills', '_x', 'SKILL.md');
    expect(lstatSync(healthy).isSymbolicLink()).toBe(true);
    expect(existsSync(healthy)).toBe(true);
  });

  test('deep nesting: 5-level source path mirrors with correct relative target', () => {
    const repo = makeScratch('farm-deep-');
    const deepRel = 'skills/_x/evaluation/nested/deep/file.md';
    seedProject(repo, 'gobbi', { [deepRel]: '# deep\n' });

    const destRoot = join(repo, '.claude');
    buildFarmIntoRoot(repo, destRoot, 'gobbi');

    const leaf = join(destRoot, deepRel);
    expect(lstatSync(leaf).isSymbolicLink()).toBe(true);

    // The symlink target is relative; resolving it from the link's
    // parent must land exactly at the source path.
    const linkStr = readlinkSync(leaf);
    const expectedSource = join(
      repo,
      '.gobbi',
      'projects',
      'gobbi',
      deepRel,
    );
    expect(pathResolve(join(leaf, '..'), linkStr)).toBe(expectedSource);
    // And reading through the symlink must yield the source bytes.
    expect(readFileSync(leaf, 'utf8')).toBe('# deep\n');

    // Every intermediate directory under the kind root is a real dir
    // (NOT a symlink) so the per-file farm invariant holds at depth.
    for (const segment of ['_x', '_x/evaluation', '_x/evaluation/nested', '_x/evaluation/nested/deep']) {
      const p = join(destRoot, 'skills', segment);
      expect(lstatSync(p).isDirectory()).toBe(true);
      expect(lstatSync(p).isSymbolicLink()).toBe(false);
    }
  });

  test('unreadable source directory propagates a readable error', () => {
    // Running as root defeats chmod-based permission tests — skip so
    // CI containers that run the suite as root don't fail spuriously.
    if (process.getuid !== undefined && process.getuid() === 0) return;

    const repo = makeScratch('farm-perm-');
    seedProject(repo, 'gobbi', {
      'skills/_x/SKILL.md': '# x\n',
      'agents/a.md': '# a\n',
      'rules/r.md': '# r\n',
    });

    // Lock the skills source dir so `readdirSync` inside the mirroring
    // walk hits EACCES. The other two kinds remain readable.
    const lockedSrc = join(repo, '.gobbi', 'projects', 'gobbi', 'skills');
    chmodSync(lockedSrc, 0o000);
    try {
      const destRoot = join(repo, '.claude');
      // Documented contract: "A single failure propagates. The caller
      // is responsible for cleanup." The test pins that contract —
      // the error must propagate (not crash the process), and it must
      // carry enough info to diagnose the locked path.
      expect(() => buildFarmIntoRoot(repo, destRoot, 'gobbi')).toThrow();
    } finally {
      // Restore perms so the afterEach cleanup can remove the dir.
      chmodSync(lockedSrc, 0o755);
    }
  });

  test('idempotent: two identical runs produce an identical tree', () => {
    const repo = makeScratch('farm-idem-');
    seedProject(repo, 'gobbi', {
      'skills/_x/SKILL.md': '# x\n',
      'skills/_x/evaluation.md': '# eval\n',
      'agents/a.md': '# a\n',
      'rules/r.md': '# r\n',
    });

    const destRoot = join(repo, '.claude');
    buildFarmIntoRoot(repo, destRoot, 'gobbi');
    const first = snapshotTree(destRoot);
    const firstTargets: Record<string, string> = {};
    for (const rel of Object.keys(first)) {
      if (first[rel] === 'symlink') {
        firstTargets[rel] = readlinkSync(join(destRoot, rel));
      }
    }

    buildFarmIntoRoot(repo, destRoot, 'gobbi');
    const second = snapshotTree(destRoot);
    const secondTargets: Record<string, string> = {};
    for (const rel of Object.keys(second)) {
      if (second[rel] === 'symlink') {
        secondTargets[rel] = readlinkSync(join(destRoot, rel));
      }
    }

    // Same set of leaves with the same kinds; no accumulating cruft.
    expect(second).toEqual(first);
    // Same symlink targets — per-kind wipe + rebuild produces bit-for-bit
    // identical links on repeat.
    expect(secondTargets).toEqual(firstTargets);
  });

  test('empty kind dir: seeded skills/ with missing agents/ yields empty agents/', () => {
    const repo = makeScratch('farm-empty-kind-');
    // Seed only `skills/`; leave `agents/` and `rules/` un-created.
    const root = join(repo, '.gobbi', 'projects', 'gobbi');
    mkdirSync(join(root, 'skills', '_x'), { recursive: true });
    writeFileSync(join(root, 'skills', '_x', 'SKILL.md'), '# x\n', 'utf8');

    const destRoot = join(repo, '.claude');
    buildFarmIntoRoot(repo, destRoot, 'gobbi');

    // The seeded kind has content.
    expect(
      lstatSync(join(destRoot, 'skills', '_x', 'SKILL.md')).isSymbolicLink(),
    ).toBe(true);

    // Missing-source kinds still materialise as *empty* directories so
    // downstream consumers (Claude Code plugin loader, `gobbi project
    // switch` rollback pre-image) see a consistent shape.
    for (const emptyKind of ['agents', 'rules'] as const) {
      const p = join(destRoot, emptyKind);
      expect(existsSync(p)).toBe(true);
      expect(lstatSync(p).isDirectory()).toBe(true);
      expect(readdirSync(p)).toEqual([]);
    }
  });
});
