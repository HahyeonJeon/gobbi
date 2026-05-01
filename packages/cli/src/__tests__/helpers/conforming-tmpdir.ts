/**
 * `makeConformingTmpRepo(prefix)` — create a tmpdir whose basename is
 * guaranteed to pass the `NAME_PATTERN` validator that
 * `lib/project-name.ts` enforces (lowercase letters, digits, hyphens
 * only). Use instead of
 *
 *     mkdtempSync(join(tmpdir(), '<prefix>-'))
 *
 * whenever the resulting directory will be passed as `repoRoot` to a
 * command that calls `validateProjectName` or
 * `assertValidProjectNameOrExit` (transitively or directly).
 *
 * # Why not `mkdtempSync`?
 *
 * `fs.mkdtempSync` appends a 6-character random suffix using
 * `[a-zA-Z0-9]` per the Node platform implementation. The capital
 * letters are routinely sampled and immediately fail the lowercase-only
 * `NAME_PATTERN`. A test fixture that builds `repoRoot` via
 * `mkdtempSync(join(tmpdir(), 'gobbi-init-test-'))` may yield
 * `gobbi-init-test-AbCdEf` — which `runInit`'s B.0 guard rejects with
 * exit 2, leading to flaky failures that depend on the random suffix.
 *
 * `randomBytes(N).toString('hex')` yields `[0-9a-f]+` — guaranteed
 * validator-conformant.
 *
 * # When to use this helper
 *
 *   1. The fixture's directory is consumed as `repoRoot` (or the
 *      `--project` arg) by `runInit` / `runInstall` / `runConfigInit`
 *      OR by any command that, downstream, exercises a code path that
 *      calls `validateProjectName` / `assertValidProjectNameOrExit`.
 *   2. The fixture does NOT pass an explicit `--project <fixed>` flag
 *      that would override the `basename(repoRoot)` fallback.
 *
 * # When NOT to use this helper
 *
 *   1. The fixture's directory is used for unrelated I/O (e.g. a
 *      scratch dir for testing a writer that never sees the basename).
 *      Plain `mkdtempSync` is fine.
 *   2. The fixture always supplies `--project <conforming-name>` —
 *      the basename is never read.
 *
 * Recorded gotcha:
 * `.gobbi/projects/gobbi/gotchas/mkdtemp-suffix-fails-name-pattern.md`.
 *
 * @param prefix — the basename prefix (lowercase letters, digits, and
 *   hyphens only — DO NOT include a trailing hyphen; the helper appends
 *   `-<hex8>`). Verified at call time by the test it lives in.
 * @returns the absolute path of the freshly-created directory. The
 *   caller owns cleanup (mirrors the prior `mkdtempSync` contract).
 */

import { randomBytes } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export function makeConformingTmpRepo(prefix: string): string {
  const suffix = randomBytes(4).toString('hex');
  const dir = join(tmpdir(), `${prefix}-${suffix}`);
  mkdirSync(dir, { recursive: true });
  return dir;
}
