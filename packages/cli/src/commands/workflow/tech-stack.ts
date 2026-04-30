/**
 * Tech-stack detection — a cheap, best-effort signal map currently called
 * by `gobbi workflow init` for observability. The `techStack` field is
 * not yet persisted (deferred follow-up — see issue #N): post-PR-FIN-2a-ii
 * the per-session `metadata.json` was retired, and a `techStack` slot has
 * not yet landed in the `session.json` schema. The function is kept live so
 * the underlying signal remains computed at init time even before a
 * persistent destination exists; deletion vs. wiring is the open decision.
 *
 * ## Signal sources (ordered by cost)
 *
 *  1. File presence checks at the repo root — no I/O on the file contents.
 *  2. Zero-I/O parse of `package.json` (already read for the Node lane) —
 *     extracts framework and test-runner tags from dependencies + scripts.
 *  3. Tooling config file presence — `tsconfig.json`, `biome.json`.
 *
 * Deliberately excluded from this PR (noted as future `gobbi workflow
 * analyze` work):
 *
 *  - Lockfile-shape fingerprinting (noisy, false positives).
 *  - `$PATH` binary scan (slow, environment-dependent).
 *  - File-extension censuses.
 *  - Any subprocess invocation (`node --version`, `bun --version`).
 *
 * ## Output contract
 *
 * A `readonly string[]`:
 *
 *   - lowercase ASCII labels;
 *   - deduplicated;
 *   - alphabetically sorted for stable diffs.
 *
 * An empty array is a valid output — no signals matched. Any filesystem
 * failure while probing a signal is swallowed; the signal is treated as
 * absent. Detection never throws.
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { isRecord, isString } from '../../lib/guards.js';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Produce the tech-stack tag list for `projectRoot`. See the module docblock
 * for the output contract.
 *
 * Always returns — never throws. Currently called by `init.ts` for
 * observability; the `techStack` field is not yet persisted (deferred
 * follow-up — see issue #N) since the per-session `metadata.json` was
 * retired in PR-FIN-2a-ii and no `session.json` slot has replaced it yet.
 */
export function detectTechStack(projectRoot: string): readonly string[] {
  const labels = new Set<string>();

  // 1. Package-manager / runtime — package.json is the richest single signal
  //    and gives us the parsed-object for subsequent framework + runner tags.
  const packageJson = readPackageJson(projectRoot);
  if (packageJson !== null) {
    addPackageManagerTag(projectRoot, labels);
    addFrameworkTags(packageJson, labels);
    addTestRunnerTag(packageJson, labels);
  }

  // 2. Language-level signals (file presence only).
  if (
    existsFile(join(projectRoot, 'pyproject.toml')) ||
    existsFile(join(projectRoot, 'requirements.txt')) ||
    existsFile(join(projectRoot, 'Pipfile'))
  ) {
    labels.add('python');
  }
  if (existsFile(join(projectRoot, 'Cargo.toml'))) labels.add('rust');
  if (existsFile(join(projectRoot, 'go.mod'))) labels.add('go');
  if (existsFile(join(projectRoot, 'Gemfile'))) labels.add('ruby');
  if (existsFile(join(projectRoot, 'composer.json'))) labels.add('php');
  if (
    existsFile(join(projectRoot, 'pom.xml')) ||
    existsFile(join(projectRoot, 'build.gradle')) ||
    existsFile(join(projectRoot, 'build.gradle.kts'))
  ) {
    labels.add('java');
  }
  if (existsFile(join(projectRoot, 'mix.exs'))) labels.add('elixir');

  // 3. Tooling configs.
  if (existsFile(join(projectRoot, 'tsconfig.json'))) labels.add('typescript');
  if (existsFile(join(projectRoot, 'biome.json'))) labels.add('biome');

  return sortDedupe(labels);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * `existsSync` narrowed to regular files — avoids false positives when the
 * repo contains directories named like signal files (pathological but cheap
 * to guard).
 */
function existsFile(path: string): boolean {
  try {
    if (!existsSync(path)) return false;
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/**
 * Read + JSON-parse `package.json`. Returns `null` on any filesystem or
 * parse error so callers fall through to the file-presence signals without
 * further error handling.
 */
function readPackageJson(projectRoot: string): Record<string, unknown> | null {
  const path = join(projectRoot, 'package.json');
  if (!existsFile(path)) return null;
  try {
    const raw = readFileSync(path, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Disambiguate Node / Bun / Deno via lockfile presence. `package.json`
 * alone is not enough — all three runtimes use it.
 */
function addPackageManagerTag(
  projectRoot: string,
  labels: Set<string>,
): void {
  const hasBunLock =
    existsFile(join(projectRoot, 'bun.lock')) ||
    existsFile(join(projectRoot, 'bun.lockb'));
  const hasDenoLock = existsFile(join(projectRoot, 'deno.lock'));

  if (hasBunLock) {
    labels.add('bun');
    return;
  }
  if (hasDenoLock) {
    labels.add('deno');
    return;
  }
  labels.add('node');
}

/** Framework tags we recognise — match the research spec exactly. */
const FRAMEWORK_TAGS = [
  'react',
  'vue',
  'svelte',
  'next',
  'express',
  'fastify',
  'hono',
] as const;

/**
 * Scan `dependencies` + `devDependencies` for framework names. Matching is
 * exact — we don't try to infer from subpackage prefixes because the cost
 * of a false positive (wrong tag) outweighs coverage.
 */
function addFrameworkTags(
  packageJson: Record<string, unknown>,
  labels: Set<string>,
): void {
  const deps = mergeDeps(packageJson);
  for (const tag of FRAMEWORK_TAGS) {
    if (Object.prototype.hasOwnProperty.call(deps, tag)) {
      labels.add(tag);
    }
  }
}

function mergeDeps(
  packageJson: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const rawDeps = packageJson['dependencies'];
  const rawDev = packageJson['devDependencies'];
  if (isRecord(rawDeps)) Object.assign(out, rawDeps);
  if (isRecord(rawDev)) Object.assign(out, rawDev);
  return out;
}

/** Test-runner tags sourced from `scripts.test` first-token heuristic. */
const TEST_RUNNER_MAP: Readonly<Record<string, string>> = {
  vitest: 'vitest',
  jest: 'jest',
  mocha: 'mocha',
};

function addTestRunnerTag(
  packageJson: Record<string, unknown>,
  labels: Set<string>,
): void {
  const scripts = packageJson['scripts'];
  if (!isRecord(scripts)) return;
  const testScript = scripts['test'];
  if (!isString(testScript)) return;
  const trimmed = testScript.trim();
  if (trimmed.length === 0) return;

  // "bun test" is special — two tokens as a single runner identity.
  if (trimmed === 'bun test' || trimmed.startsWith('bun test ')) {
    labels.add('bun-test');
    return;
  }

  const firstToken = trimmed.split(/\s+/)[0];
  if (firstToken === undefined) return;
  const mapped = TEST_RUNNER_MAP[firstToken];
  if (mapped !== undefined) labels.add(mapped);
}

function sortDedupe(labels: Set<string>): readonly string[] {
  return [...labels].map((l) => l.toLowerCase()).sort();
}
