/**
 * Build-pipeline integration tests (PR-FIN-5).
 *
 * Verifies that `build:safe` ships the `dist/specs/` tree alongside
 * `dist/cli.js` so the bundled binary can resolve workflow specs at
 * runtime. The bug these tests guard against: `bun build` flattens
 * `import.meta.url` in bundled output, so any module-relative path
 * traversal that escapes `dist/` breaks. The fix is a runtime fallback
 * chain in `specs/paths.ts` plus a post-build `cp src/specs dist/specs`
 * step in `build:safe`.
 *
 * Both tests are skip-guarded — they only run when their preconditions
 * hold (`dist/cli.js` exists, `npm` is on PATH). This keeps the tests
 * passing on a fresh checkout where `bun run build:safe` has not run.
 */

import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const THIS_DIR = dirname(fileURLToPath(import.meta.url));

// `__tests__/integration/build-pipeline.test.ts` -> `packages/cli/`
const PKG_ROOT = resolve(THIS_DIR, '..', '..', '..');
const DIST_DIR = join(PKG_ROOT, 'dist');
const DIST_CLI_JS = join(DIST_DIR, 'cli.js');
const DIST_SPECS_DIR = join(DIST_DIR, 'specs');
const DIST_SPECS_INDEX = join(DIST_SPECS_DIR, 'index.json');

describe('build pipeline (PR-FIN-5)', () => {
  test.skipIf(!existsSync(DIST_CLI_JS))(
    'build:safe ships dist/specs/index.json next to dist/cli.js',
    () => {
      // Sibling layout is the contract `specs/paths.ts` relies on in
      // bundled mode — `THIS_DIR === dist/`, so `<dist>/specs/index.json`
      // is the runtime resolution target.
      expect(existsSync(DIST_SPECS_INDEX)).toBe(true);

      // Per-step spec.json files round out the tree.
      const expectedSpecs = [
        'planning/spec.json',
        'ideation/spec.json',
        'execution/spec.json',
        'evaluation/spec.json',
        'memorization/spec.json',
        'handoff/spec.json',
      ];
      for (const rel of expectedSpecs) {
        expect(existsSync(join(DIST_SPECS_DIR, rel))).toBe(true);
      }
    },
  );

  test.skipIf(!existsSync(DIST_CLI_JS))(
    'build:safe filters __tests__ subtrees out of dist/specs',
    () => {
      // `cp -r src/specs dist/specs` would otherwise drag every
      // `__tests__/` along, bloating the published tarball.
      const filteredOut = [
        '__tests__',
        'planning/__tests__',
        'ideation/__tests__',
        'execution/__tests__',
        'evaluation/__tests__',
        'memorization/__tests__',
        'handoff/__tests__',
      ];
      for (const rel of filteredOut) {
        expect(existsSync(join(DIST_SPECS_DIR, rel))).toBe(false);
      }
    },
  );

  test.skipIf(!existsSync(DIST_CLI_JS) || !hasNpmOnPath())(
    'npm pack --dry-run lists dist/specs/index.json in the ship-list',
    async () => {
      // Guards against a future regression where someone trims
      // `package.json::files` and removes `dist/`.
      const proc = Bun.spawn(['npm', 'pack', '--dry-run'], {
        cwd: PKG_ROOT,
        stdout: 'pipe',
        stderr: 'pipe',
      });
      const [stdout, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
      ]);
      await proc.exited;
      const combined = `${stdout}\n${stderr}`;
      expect(combined).toMatch(/dist[/\\]specs[/\\]index\.json/);
    },
  );
});

function hasNpmOnPath(): boolean {
  // Cheap probe — `Bun.which` returns the absolute path or null.
  // Avoids spawning an extra process for the gating decision.
  try {
    return Bun.which('npm') !== null;
  } catch {
    return false;
  }
}
