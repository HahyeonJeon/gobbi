/**
 * Canonical specs-directory resolver.
 *
 * The canonical workflow graph (`index.json`) and per-step `spec.json`
 * files live in `packages/cli/src/specs/` at author time. After
 * `bun build`, the bundler flattens module boundaries — every module
 * collapses into `dist/cli.js`, so any `import.meta.url`-relative
 * traversal that depends on the source directory layout is wrong in
 * bundled mode. The build pipeline copies `src/specs` to `dist/specs`
 * (filtering `__tests__/`) so a bundled binary can resolve specs
 * sibling-to-`cli.js`.
 *
 * This helper exposes the single resolution policy used by every
 * caller (`graph.ts`, `next.ts`, `validate.ts`, `stop.ts`). The
 * fallback chain is purely runtime — no build-time conditionals, no
 * marker files, no environment heuristics. It tries each candidate in
 * turn and gates on `existsSync(<candidate>/index.json)`:
 *
 *   1. Bundled-mode candidate — `<this-dir>/specs/`. When `paths.ts`
 *      is bundled into `dist/cli.js`, `<this-dir>` is `dist/`, so the
 *      sibling `specs/` subdir created by `build:safe`'s post-build
 *      `cp` lands at `dist/specs/`. This is the production path.
 *   2. Source-mode candidate — `<this-dir>` itself. At author time
 *      `paths.ts` lives in `src/specs/`, so `<this-dir>` IS the specs
 *      directory. `bun test` and unit tests resolve here.
 *
 * If neither candidate exists, `getSpecsDir` throws with both
 * attempted paths in the diagnostic so the failure is debuggable
 * without source-diving.
 *
 * Tests still inject a custom `specsDir` via the `--dir` flag or
 * function-level overrides — this helper only resolves the *default*.
 *
 * @see `package.json::scripts.build:safe` — owns the `cp src/specs dist/specs` step
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const THIS_DIR = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the canonical specs directory at runtime.
 *
 * @throws when neither the bundled-mode nor source-mode candidate
 *   contains an `index.json`. The error message lists both attempted
 *   paths so the failure is self-diagnosing.
 */
export function getSpecsDir(): string {
  // Bundled-mode candidate: <dist>/specs/ when paths.ts is in <dist>/cli.js.
  const bundled = join(THIS_DIR, 'specs');
  if (existsSync(join(bundled, 'index.json'))) return bundled;

  // Source-mode candidate: paths.ts itself lives in src/specs/.
  if (existsSync(join(THIS_DIR, 'index.json'))) return THIS_DIR;

  throw new Error(
    `[specs/paths] Cannot locate specs directory. Tried: ${bundled}, ${THIS_DIR}. ` +
      `In bundled mode, ensure 'build:safe' has run and 'dist/specs/' exists. ` +
      `In source mode, ensure 'paths.ts' is co-located with 'index.json' under 'src/specs/'.`,
  );
}

/**
 * Absolute path to the canonical workflow graph file (`index.json`)
 * within the resolved specs directory.
 */
export function getGraphPath(): string {
  return join(getSpecsDir(), 'index.json');
}
