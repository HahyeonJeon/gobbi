/**
 * Version-currency check — implements `gobbi --is-latest`.
 *
 * Resolves review.md GAP-01 for the `one-command-install` feature: the
 * README claims `/gobbi` checks whether the CLI is current, but `SKILL.md
 * §THIRD` only ran `gobbi --version` (availability). This module adds the
 * missing registry comparison so `SKILL.md` can branch on exit code.
 *
 * ## Exit codes (for `--is-latest` without `--json`)
 *
 * - `0` — installed version matches npm `@latest` (user is current).
 * - `1` — installed version is older than `@latest` (user should update).
 * - `2` — indeterminate: network / npm unavailable / parse failure. The
 *   skill must NOT block the workflow on this.
 *
 * With `--json`, the flag always exits `0` so callers can parse the JSON
 * body before deciding what to do.
 *
 * ## Behaviour
 *
 * Installed version is read from the CLI's own `package.json` (located
 * relative to the compiled module). The registry version is fetched with
 * `npm view @gobbitools/cli version` via `Bun.spawn` with a 10s timeout.
 * We shell out to `npm` rather than hitting the registry HTTP endpoint
 * directly so we inherit the user's npm config (custom registries,
 * auth). If `npm` is missing or the call fails, we fall through to the
 * indeterminate path (exit 2).
 *
 * Semver comparison is deliberately minimal — we only need `X.Y.Z`
 * ordering; no pre-release, no build metadata. Anything that does not
 * parse as three non-negative integers is reported as malformed and the
 * caller decides whether to treat that as "stale" or "indeterminate".
 *
 * @see `.claude/project/gobbi/design/v050-features/one-command-install/review.md` GAP-01
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Semver parse + compare — minimal `X.Y.Z` only
// ---------------------------------------------------------------------------

/**
 * Parsed semver triple. `null` from `parseSemver` means the input did not
 * match the strict `X.Y.Z` shape expected here.
 */
export interface SemverTriple {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

/**
 * Parse a version string of shape `X.Y.Z` (each component a non-negative
 * integer, no leading zeros beyond `0` itself). Returns `null` for
 * anything else — callers decide whether that means "stale" or
 * "indeterminate".
 *
 * Deliberately does NOT accept semver pre-release or build metadata.
 * v0.5.0 publishes stable `X.Y.Z` tags; if that changes, revisit here.
 */
export function parseSemver(input: string): SemverTriple | null {
  const trimmed = input.trim();
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(trimmed);
  if (match === null) return null;
  const [, rawMajor, rawMinor, rawPatch] = match;
  if (
    rawMajor === undefined ||
    rawMinor === undefined ||
    rawPatch === undefined
  ) {
    return null;
  }
  return {
    major: Number(rawMajor),
    minor: Number(rawMinor),
    patch: Number(rawPatch),
  };
}

/**
 * Compare two parsed semver triples. Returns `-1` if `a < b`, `0` if
 * equal, `1` if `a > b`. Sort order is `major`, then `minor`, then
 * `patch`.
 */
export function compareSemver(a: SemverTriple, b: SemverTriple): -1 | 0 | 1 {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1;
  return 0;
}

// ---------------------------------------------------------------------------
// Package-version reading
// ---------------------------------------------------------------------------

/**
 * Read the `version` field from the CLI's own `package.json`. The path
 * is resolved relative to the compiled module — `dist/` sits alongside
 * `package.json` in the published package, and `src/lib/` sits one
 * level deeper in the source checkout. Walking up from this file covers
 * both layouts.
 *
 * Throws if the file cannot be read or the field is missing — callers
 * treat that as a hard failure (exit 2 with a clear stderr message).
 */
export async function readInstalledVersion(): Promise<string> {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(here, '..', '..', 'package.json'), // src/lib/ → packages/cli/
    path.resolve(here, '..', 'package.json'), // dist/ → packages/cli/
  ];
  for (const candidate of candidates) {
    try {
      const raw = await readFile(candidate, 'utf8');
      const parsed: unknown = JSON.parse(raw);
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'version' in parsed &&
        typeof (parsed as { version: unknown }).version === 'string'
      ) {
        return (parsed as { version: string }).version;
      }
    } catch {
      // Try the next candidate.
    }
  }
  throw new Error(
    'unable to read installed version from package.json (searched src/lib and dist layouts)',
  );
}

// ---------------------------------------------------------------------------
// Registry version fetch — shells out to `npm view`
// ---------------------------------------------------------------------------

/**
 * Timeout for the `npm view` call in milliseconds. Kept as a named
 * constant so tests and tooling can reference the same value.
 */
export const NPM_VIEW_TIMEOUT_MS = 10_000;

/**
 * Package name we query. Lives here rather than hard-coded at the call
 * site so the test suite can confirm it matches `package.json`.
 */
export const PACKAGE_NAME = '@gobbitools/cli';

/**
 * Result of a registry version fetch. `ok: false` means the caller must
 * treat the check as indeterminate (exit 2); `reason` describes why for
 * a stderr-friendly diagnostic.
 */
export type FetchLatestResult =
  | { readonly ok: true; readonly version: string }
  | { readonly ok: false; readonly reason: string };

/**
 * Fetch the `@latest` published version of `@gobbitools/cli` via `npm
 * view`. We pipe stdout, redirect stderr to the parent so npm's own
 * diagnostics surface without noise, and enforce a 10s SIGTERM timeout.
 *
 * Exported so tests can stub the `npm` call via the optional `runner`
 * argument rather than spawning a real subprocess.
 */
export async function fetchLatestVersion(
  runner: VersionRunner = defaultRunner,
): Promise<FetchLatestResult> {
  return runner({
    packageName: PACKAGE_NAME,
    timeoutMs: NPM_VIEW_TIMEOUT_MS,
  });
}

/**
 * Signature of the subprocess runner. Tests inject a stub that returns
 * a canned value; production wires in `defaultRunner` which uses
 * `Bun.spawn`.
 */
export type VersionRunner = (input: {
  readonly packageName: string;
  readonly timeoutMs: number;
}) => Promise<FetchLatestResult>;

/**
 * Drain a Bun.spawn stdio stream into a string. Bun types the stream as
 * `ReadableStream<Uint8Array> | number | undefined` so the narrowing has
 * to be explicit before handing it to `Response`. Mirrors the
 * `drainToBuffer` helper in `workflow/verification-scheduler.ts`.
 */
async function drainStream(
  stream: ReadableStream<Uint8Array> | number | undefined,
): Promise<string> {
  if (stream === undefined || typeof stream === 'number') return '';
  return new Response(stream).text();
}

async function defaultRunner(input: {
  readonly packageName: string;
  readonly timeoutMs: number;
}): Promise<FetchLatestResult> {
  const { packageName, timeoutMs } = input;

  let child: ReturnType<typeof Bun.spawn>;
  try {
    child = Bun.spawn({
      cmd: ['npm', 'view', packageName, 'version'],
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: `npm spawn failed: ${message}` };
  }

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    try {
      child.kill();
    } catch {
      // Best-effort — if the child is already gone, nothing to do.
    }
  }, timeoutMs);
  timer.unref?.();

  const [stdout, stderr, exitCode] = await Promise.all([
    drainStream(child.stdout),
    drainStream(child.stderr),
    child.exited,
  ]);
  clearTimeout(timer);

  if (timedOut) {
    return { ok: false, reason: `npm view timed out after ${timeoutMs}ms` };
  }
  if (exitCode !== 0) {
    const tail = stderr.trim().split('\n').slice(-1).join('') || '(no stderr)';
    return {
      ok: false,
      reason: `npm view exited ${exitCode}: ${tail}`,
    };
  }
  const version = stdout.trim();
  if (version.length === 0) {
    return { ok: false, reason: 'npm view returned empty output' };
  }
  return { ok: true, version };
}

// ---------------------------------------------------------------------------
// Verdict — combines installed + registry into a structured result
// ---------------------------------------------------------------------------

/**
 * Structured outcome the CLI flag reports. `isLatest` is only defined
 * for `current` / `stale`; `indeterminate` means we could not compare.
 */
export interface VerdictReport {
  readonly installed: string;
  readonly latest: string | null;
  readonly status: 'current' | 'stale' | 'indeterminate';
  readonly reason?: string;
}

/**
 * Exit code derived from a `VerdictReport` for the default (non-JSON)
 * mode. `--json` always returns `0` so callers can parse first.
 */
export function exitCodeForVerdict(report: VerdictReport): 0 | 1 | 2 {
  if (report.status === 'current') return 0;
  if (report.status === 'stale') return 1;
  return 2;
}

/**
 * Compute the verdict from an installed version and a registry fetch
 * result. Extracted so tests can exercise the full decision matrix
 * without touching the filesystem or a subprocess.
 */
export function computeVerdict(
  installed: string,
  fetched: FetchLatestResult,
): VerdictReport {
  if (!fetched.ok) {
    return {
      installed,
      latest: null,
      status: 'indeterminate',
      reason: fetched.reason,
    };
  }
  const installedParsed = parseSemver(installed);
  const latestParsed = parseSemver(fetched.version);
  if (installedParsed === null || latestParsed === null) {
    return {
      installed,
      latest: fetched.version,
      status: 'indeterminate',
      reason: `malformed version (installed=${installed}, latest=${fetched.version})`,
    };
  }
  const cmp = compareSemver(installedParsed, latestParsed);
  if (cmp < 0) {
    return { installed, latest: fetched.version, status: 'stale' };
  }
  // cmp === 0 OR cmp > 0 both count as "current" — a locally newer
  // version (e.g., pre-publish development build) is not "stale" from
  // the user's point of view and should not trigger an update prompt.
  return { installed, latest: fetched.version, status: 'current' };
}

// ---------------------------------------------------------------------------
// Flag handler — wired into `cli.ts`
// ---------------------------------------------------------------------------

/**
 * Handle the `gobbi --is-latest` flag. Reads the installed version,
 * fetches `@latest`, prints the JSON payload or nothing (per `emitJson`),
 * and exits with the status-derived code (or `0` when JSON is requested).
 *
 * Exported so `cli.ts` can dispatch without duplicating the exit-code
 * policy. The `runner` override exists for tests.
 */
export async function runIsLatest(options: {
  readonly emitJson: boolean;
  readonly runner?: VersionRunner;
}): Promise<void> {
  let installed: string;
  try {
    installed = await readInstalledVersion();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi --is-latest: ${message}\n`);
    if (options.emitJson) {
      const payload: VerdictReport = {
        installed: 'unknown',
        latest: null,
        status: 'indeterminate',
        reason: message,
      };
      process.stdout.write(`${JSON.stringify(payload)}\n`);
      process.exit(0);
    }
    process.exit(2);
  }

  const fetched = await fetchLatestVersion(options.runner ?? defaultRunner);
  const verdict = computeVerdict(installed, fetched);

  if (options.emitJson) {
    process.stdout.write(
      `${JSON.stringify({
        installed: verdict.installed,
        latest: verdict.latest,
        isLatest: verdict.status === 'current',
        ...(verdict.reason === undefined ? {} : { reason: verdict.reason }),
      })}\n`,
    );
    process.exit(0);
  }

  if (verdict.status === 'indeterminate') {
    process.stderr.write(
      `gobbi --is-latest: indeterminate (${verdict.reason ?? 'unknown reason'})\n`,
    );
  }
  process.exit(exitCodeForVerdict(verdict));
}
