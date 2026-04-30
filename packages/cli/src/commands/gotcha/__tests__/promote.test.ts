/**
 * project.json index assertions for `gobbi gotcha promote`.
 *
 * The dispatcher, registry, file-routing, dry-run, and edge-case behaviours
 * for `runPromoteWithOptions` live next door at
 * `packages/cli/src/commands/__tests__/gotcha.test.ts`. THIS file scopes
 * narrowly to PR-FIN-2a-ii T-2a.8.3 — the rewire from a stand-alone
 * gotcha-index seam to `lib/json-memory.ts::upsertProjectGotcha`.
 *
 * What we verify here:
 *
 *   - A project-scoped promote populates `project.json.gotchas[]` with one
 *     `ProjectJsonGotcha` entry whose `path` is the destination's
 *     repo-relative path and whose `sha256` matches the bytes actually on
 *     disk after the append (NOT the bytes of the source draft, which can
 *     differ when the destination already had prior accumulated entries).
 *   - Multiple project-scoped promotes land sorted alphabetically by
 *     `path` (the `lib/json-memory.ts` invariant from lock 32 — sort
 *     discipline applied at the writer call site).
 *   - Re-running promote is idempotent at the index level: `upsertById`
 *     in `json-memory.ts` keys gotchas by `path` and replaces in place,
 *     so the index never grows duplicates even when the same destination
 *     is touched twice.
 *   - Skill-scoped promotes do NOT add anything to
 *     `project.json.gotchas[]` — skill gotchas live colocated with their
 *     skill via the `.claude/skills/` symlink farm and are not part of
 *     cross-session project memory.
 *   - The same-path no-op case (default project — source and destination
 *     are the same absolute path) still records the entry: the file is in
 *     its permanent location and should be indexed even though no
 *     filesystem move happened.
 *   - `promotedFromSession` reads `$CLAUDE_SESSION_ID`; falls back to the
 *     literal `'unknown'` when the env var is absent so the AJV
 *     `minLength: 1` constraint holds.
 *
 * The scratch-repo helper mirrors the post-W3.1 layout used by
 * `commands/__tests__/gotcha.test.ts` so the two files are visually
 * compatible.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { readProjectJson, projectJsonPath } from '../../../lib/json-memory.js';
import { runPromoteWithOptions } from '../promote.js';

// ---------------------------------------------------------------------------
// stdout/stderr capture + process.exit trap (mirrors gotcha.test.ts)
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
let origExit: typeof process.exit;
let origSessionId: string | undefined;

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
  origExit = process.exit;
  origSessionId = process.env['CLAUDE_SESSION_ID'];

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
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  process.exit = origExit;
  if (origSessionId === undefined) {
    delete process.env['CLAUDE_SESSION_ID'];
  } else {
    process.env['CLAUDE_SESSION_ID'] = origSessionId;
  }
});

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Scratch dir helpers
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

function makeScratchRepo(): string {
  const dir = mkdtempSync(join(tmpdir(), 'gobbi-promote-index-'));
  scratchDirs.push(dir);
  return dir;
}

function makeRepoLayout(destinationProjectName: string | null): {
  repo: string;
  sourceDir: string;
  claudeDir: string;
} {
  const repo = makeScratchRepo();
  const sourceDir = join(repo, '.gobbi', 'projects', 'gobbi', 'gotchas');
  mkdirSync(sourceDir, { recursive: true });
  const claudeDir = join(repo, '.claude');
  mkdirSync(claudeDir, { recursive: true });
  if (destinationProjectName !== null) {
    mkdirSync(join(repo, '.gobbi', 'projects', destinationProjectName), {
      recursive: true,
    });
  }
  return { repo, sourceDir, claudeDir };
}

function sha256Hex(bytes: Buffer | string): string {
  return createHash('sha256').update(bytes).digest('hex');
}

// ===========================================================================
// project.json index — single project-scoped promote
// ===========================================================================

describe('runPromote — project.json index (project-scoped)', () => {
  test('writes one ProjectJsonGotcha entry with the correct path + sha256', async () => {
    process.env['CLAUDE_SESSION_ID'] = 'test-session-abc';
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    const body = '## foo\n\nPriority: high\n\nbody.\n';
    writeFileSync(join(sourceDir, 'foo.md'), body, 'utf8');

    await captureExit(() =>
      runPromoteWithOptions(
        ['--project', 'gobbi', '--destination-project', 'testproj'],
        { repoRoot: repo, claudeDir },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const indexFile = projectJsonPath(repo, 'testproj');
    const project = readProjectJson(indexFile);
    expect(project).not.toBeNull();
    expect(project?.gotchas).toHaveLength(1);

    const entry = project?.gotchas[0];
    expect(entry?.path).toBe(
      join('.gobbi', 'projects', 'testproj', 'gotchas', 'foo.md'),
    );
    // sha256 reflects the bytes actually on disk after the append. For a
    // first-time promote with no prior accumulated entries the destination
    // body equals the source body (the body already ends in '\n', so the
    // applyPromotion newline-fixer is a no-op).
    const destBytes = readFileSync(
      join(repo, '.gobbi', 'projects', 'testproj', 'gotchas', 'foo.md'),
    );
    expect(entry?.sha256).toBe(sha256Hex(destBytes));
    expect(entry?.sha256).toMatch(/^[0-9a-f]{64}$/);

    expect(entry?.class).toBe('unknown');
    expect(entry?.promotedFromSession).toBe('test-session-abc');
    expect(typeof entry?.promotedAt).toBe('string');
    expect(entry?.promotedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/,
    );
  });

  test('sha256 reflects post-append bytes when the destination already exists', async () => {
    process.env['CLAUDE_SESSION_ID'] = 'sess-2';
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    const destDir = join(repo, '.gobbi', 'projects', 'testproj', 'gotchas');
    mkdirSync(destDir, { recursive: true });
    const existing = '## prior entry\n\nold.\n';
    writeFileSync(join(destDir, 'bar.md'), existing, 'utf8');

    const newBody = '## fresh entry\n\nnew.\n';
    writeFileSync(join(sourceDir, 'bar.md'), newBody, 'utf8');

    await captureExit(() =>
      runPromoteWithOptions(
        ['--project', 'gobbi', '--destination-project', 'testproj'],
        { repoRoot: repo, claudeDir },
      ),
    );

    const destBytes = readFileSync(join(destDir, 'bar.md'));
    const project = readProjectJson(projectJsonPath(repo, 'testproj'));
    expect(project?.gotchas).toHaveLength(1);
    expect(project?.gotchas[0]?.sha256).toBe(sha256Hex(destBytes));
    // Sanity: the post-append digest is NOT the digest of the source body
    // alone, because the destination already held the prior entry.
    expect(project?.gotchas[0]?.sha256).not.toBe(sha256Hex(newBody));
  });
});

// ===========================================================================
// project.json index — sort order
// ===========================================================================

describe('runPromote — project.json index sort order', () => {
  test('multiple project-scoped promotes land alphabetically by path', async () => {
    process.env['CLAUDE_SESSION_ID'] = 'sess-sort';
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    // Seed in non-alphabetical order so any accidental insertion-order
    // bug surfaces clearly.
    writeFileSync(join(sourceDir, 'zeta.md'), 'z\n', 'utf8');
    writeFileSync(join(sourceDir, 'alpha.md'), 'a\n', 'utf8');
    writeFileSync(join(sourceDir, 'mango.md'), 'm\n', 'utf8');

    await captureExit(() =>
      runPromoteWithOptions(
        ['--project', 'gobbi', '--destination-project', 'testproj'],
        { repoRoot: repo, claudeDir },
      ),
    );

    const project = readProjectJson(projectJsonPath(repo, 'testproj'));
    const paths = project?.gotchas.map((g) => g.path);
    expect(paths).toEqual([
      join('.gobbi', 'projects', 'testproj', 'gotchas', 'alpha.md'),
      join('.gobbi', 'projects', 'testproj', 'gotchas', 'mango.md'),
      join('.gobbi', 'projects', 'testproj', 'gotchas', 'zeta.md'),
    ]);
  });
});

// ===========================================================================
// project.json index — idempotency
// ===========================================================================

describe('runPromote — project.json index idempotency', () => {
  test('re-promoting the same destination does not duplicate the entry', async () => {
    // The default-project same-path-no-op case is the natural fixture: the
    // source `solo.md` lives at `gotchas/solo.md` and the destination
    // resolves to the SAME path, so re-running keeps the file in place
    // (no source delete) and keeps `upsertProjectGotcha` working against
    // the same `path` key. `upsertById` filters by key and replaces, so
    // the gotchas[] array stays length 1.
    process.env['CLAUDE_SESSION_ID'] = 'sess-idem';
    const repo = makeScratchRepo();
    const sourceDir = join(repo, '.gobbi', 'projects', 'gobbi', 'gotchas');
    mkdirSync(sourceDir, { recursive: true });
    const claudeDir = join(repo, '.claude');
    writeFileSync(join(sourceDir, 'solo.md'), '## solo\n', 'utf8');

    await captureExit(() =>
      runPromoteWithOptions(['--project', 'gobbi'], {
        repoRoot: repo,
        claudeDir,
      }),
    );
    expect(captured.exitCode).toBeNull();

    const indexFile = projectJsonPath(repo, 'gobbi');
    const first = readProjectJson(indexFile);
    expect(first?.gotchas).toHaveLength(1);
    const firstSha = first?.gotchas[0]?.sha256;

    // Re-run — same source still in place (same-path no-op preserves it),
    // index upsert key is unchanged.
    await captureExit(() =>
      runPromoteWithOptions(['--project', 'gobbi'], {
        repoRoot: repo,
        claudeDir,
      }),
    );
    const second = readProjectJson(indexFile);
    expect(second?.gotchas).toHaveLength(1);
    // Bytes on disk did not change between runs (same-path no-op skips the
    // append), so the sha256 round-trips unchanged too.
    expect(second?.gotchas[0]?.sha256).toBe(firstSha);
  });
});

// ===========================================================================
// project.json index — skill-scoped exclusion
// ===========================================================================

describe('runPromote — project.json index excludes skill-scoped', () => {
  test('skill-scoped promotes do not populate project.json.gotchas[]', async () => {
    process.env['CLAUDE_SESSION_ID'] = 'sess-skill';
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(
      join(sourceDir, '_skill-_git.md'),
      '## skill-scoped\n',
      'utf8',
    );

    await captureExit(() =>
      runPromoteWithOptions(['--project', 'gobbi'], {
        repoRoot: repo,
        claudeDir,
      }),
    );
    expect(captured.exitCode).toBeNull();

    // Skill-scoped destination written.
    expect(
      existsSync(join(claudeDir, 'skills', '_git', 'gotchas.md')),
    ).toBe(true);

    // testproj's project.json was never created — there were no
    // project-scoped entries to record.
    expect(existsSync(projectJsonPath(repo, 'testproj'))).toBe(false);
  });

  test('mixed batch only indexes the project-scoped entries', async () => {
    process.env['CLAUDE_SESSION_ID'] = 'sess-mixed';
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(join(sourceDir, 'realdeal.md'), '## real\n', 'utf8');
    writeFileSync(
      join(sourceDir, '_skill-_plan.md'),
      '## plan-skill\n',
      'utf8',
    );

    await captureExit(() =>
      runPromoteWithOptions(
        ['--project', 'gobbi', '--destination-project', 'testproj'],
        { repoRoot: repo, claudeDir },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const project = readProjectJson(projectJsonPath(repo, 'testproj'));
    expect(project?.gotchas).toHaveLength(1);
    expect(project?.gotchas[0]?.path).toBe(
      join('.gobbi', 'projects', 'testproj', 'gotchas', 'realdeal.md'),
    );
    // Skill-scoped destination still written, but it is NOT in the index.
    expect(
      existsSync(join(claudeDir, 'skills', '_plan', 'gotchas.md')),
    ).toBe(true);
  });
});

// ===========================================================================
// project.json index — same-path no-op (default project)
// ===========================================================================

describe('runPromote — project.json index for same-path no-op', () => {
  test('default-project same-path collision still indexes the file', async () => {
    process.env['CLAUDE_SESSION_ID'] = 'sess-samepath';
    const repo = makeScratchRepo();
    const sourceDir = join(repo, '.gobbi', 'projects', 'gobbi', 'gotchas');
    mkdirSync(sourceDir, { recursive: true });
    const claudeDir = join(repo, '.claude');
    const body = '## the only gotcha\n';
    writeFileSync(join(sourceDir, 'foo.md'), body, 'utf8');

    await captureExit(() =>
      runPromoteWithOptions(['--project', 'gobbi'], {
        repoRoot: repo,
        claudeDir,
      }),
    );
    expect(captured.exitCode).toBeNull();

    // Source file untouched (same-path no-op preserves it).
    expect(existsSync(join(sourceDir, 'foo.md'))).toBe(true);
    expect(readFileSync(join(sourceDir, 'foo.md'), 'utf8')).toBe(body);

    // Index entry IS recorded — the file is in its permanent location and
    // should appear in the project's cross-session memory.
    const project = readProjectJson(projectJsonPath(repo, 'gobbi'));
    expect(project?.gotchas).toHaveLength(1);
    expect(project?.gotchas[0]?.path).toBe(
      join('.gobbi', 'projects', 'gobbi', 'gotchas', 'foo.md'),
    );
    expect(project?.gotchas[0]?.sha256).toBe(sha256Hex(body));
  });
});

// ===========================================================================
// project.json index — session-id fallback
// ===========================================================================

describe('runPromote — promotedFromSession resolution', () => {
  test('falls back to "unknown" when CLAUDE_SESSION_ID is unset', async () => {
    delete process.env['CLAUDE_SESSION_ID'];
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(join(sourceDir, 'foo.md'), 'body\n', 'utf8');

    await captureExit(() =>
      runPromoteWithOptions(
        ['--project', 'gobbi', '--destination-project', 'testproj'],
        { repoRoot: repo, claudeDir },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const project = readProjectJson(projectJsonPath(repo, 'testproj'));
    expect(project?.gotchas[0]?.promotedFromSession).toBe('unknown');
  });

  test('falls back to "unknown" when CLAUDE_SESSION_ID is the empty string', async () => {
    process.env['CLAUDE_SESSION_ID'] = '';
    const { repo, sourceDir, claudeDir } = makeRepoLayout('testproj');
    writeFileSync(join(sourceDir, 'foo.md'), 'body\n', 'utf8');

    await captureExit(() =>
      runPromoteWithOptions(
        ['--project', 'gobbi', '--destination-project', 'testproj'],
        { repoRoot: repo, claudeDir },
      ),
    );
    expect(captured.exitCode).toBeNull();

    const project = readProjectJson(projectJsonPath(repo, 'testproj'));
    expect(project?.gotchas[0]?.promotedFromSession).toBe('unknown');
  });
});
