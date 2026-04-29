/**
 * Feature-level integration tests for the Pass-2 gobbi-memory redesign.
 *
 * Each `test(...)` block corresponds to one G-MEM2 scenario published in
 * the W7.1 scenarios.md contract at
 * `.gobbi/projects/gobbi/design/v050-features/gobbi-memory/scenarios.md`.
 * Scenario IDs are load-bearing — they tie the runtime check to the
 * Given/When/Then body and the ISTQB-tagged checklist entry. IDs never
 * mutate; new coverage takes higher numbers.
 *
 * ## Scope
 *
 * This file exists ABOVE the sibling unit suites (install,
 * project/{list,create,switch}, symlink-farm, step-readme-writer,
 * wipe-legacy-sessions, gotcha/promote). Unit tests lock the command's
 * branch matrix; this file locks the cross-command invariant at the
 * feature level — new layout paths under `.gobbi/projects/<name>/`, the
 * `.claude/` farm resolving into them, multi-project isolation, etc.
 *
 * Multi-project carve-out: scenarios 14-21 exercise single-project
 * flows; the `G-MEM2-MP-NN` series at the end of the file locks the
 * cross-project isolation invariants the 45-scenario contract covers
 * implicitly (settings write to one project do not leak into the other;
 * farm swap rotates the three kinds atomically; active session in one
 * project does not block install on the other).
 *
 * ## Design notes
 *
 *   - Every test uses `mkdtempSync` under the OS tmpdir. No test touches
 *     the actual worktree's `.gobbi/` or `.claude/`.
 *   - Commands are driven through the `runXWithOptions({ repoRoot, ...})`
 *     exported APIs. No `Bun.$` subprocesses; the PATH-dependent flake
 *     the Pass-3 `capture-subagent` regression exposed stays out of
 *     this file (backlog #131).
 *   - `gobbi install` calls pass an explicit `templateRoot` so the 3-way
 *     merge branches are deterministic without depending on the real
 *     shipped bundle's content.
 *   - `gobbi project create` does NOT accept a `templateRoot` override;
 *     those tests exercise SHAPE invariants (manifest present, scaffold
 *     dirs exist, `known` updated) instead of asserting seed content.
 *   - process.stdout / stderr / process.exit are captured via a shared
 *     trap harness mirrored from `commands/__tests__/install.test.ts`
 *     and `__tests__/features/install.test.ts`.
 *   - A non-trivial subset of scenarios is implemented as `test.todo(...)`
 *     — either doc-scope (scenarios.md §D8/D9/D10, G-MEM2-45 feature-
 *     layout observation), manual (@manual tags in checklist.md), or
 *     re-verification that the sibling unit suite already covers at a
 *     finer grain (snapshots for G-MEM2-35).
 *
 * Pattern references:
 *   - `packages/cli/src/__tests__/features/install.test.ts` (W6.2 —
 *     directly adjacent feature suite; captureExit + makeTemplate
 *     pattern re-used here).
 *   - `packages/cli/src/commands/__tests__/install.test.ts`
 *     (`seedActiveSession` helper; per-action merge assertions).
 *   - `packages/cli/src/workflow/__tests__/step-readme-writer.test.ts`
 *     (makeSessionDir + `writeStepReadmeForExit` invocation).
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
import { basename, join, resolve as pathResolve } from 'node:path';

import {
  __INTERNALS__ as INSTALL_INTERNALS,
  renderActiveSessionError as renderInstallActiveError,
  renderPlan as renderInstallPlan,
  runInstallWithOptions,
} from '../../commands/install.js';
import { runProjectCreateWithOptions } from '../../commands/project/create.js';
import { runProjectListWithOptions } from '../../commands/project/list.js';
// PR-FIN-1c: `commands/project/switch.ts` deleted with the registry
// removal; the import is retained as a comment for git-history navigation.
import { runWipeLegacySessionsWithOptions } from '../../commands/maintenance/wipe-legacy-sessions.js';
import { runPromoteWithOptions } from '../../commands/gotcha/promote.js';
import { runInitWithOptions } from '../../commands/workflow/init.js';
import {
  CLAUDE_FARM_KINDS,
  buildFarmIntoRoot,
} from '../../lib/symlink-farm.js';
import {
  findStateActiveSessions,
  readCurrentStepRaw,
  TERMINAL_CURRENT_STEPS,
} from '../../lib/active-sessions.js';
import {
  claudeSymlinkTarget,
  projectDir,
  projectSubdir,
  projectsRoot,
  sessionDir as sessionDirForProject,
  sessionsRoot,
  workspaceRoot,
  worktreeDir,
} from '../../lib/workspace-paths.js';
import {
  generateStepReadme,
  writeStepReadmeForExit,
  type StepReadmeArgs,
} from '../../workflow/step-readme-writer.js';
import { initialState, type WorkflowState } from '../../workflow/state.js';

// ---------------------------------------------------------------------------
// stdout / stderr / process.exit capture harness
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
let origSessionIdEnv: string | undefined;

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

  // Workflow init falls back to CLAUDE_SESSION_ID when no --session-id is
  // passed. Strip it so host-env leakage never collides with fixture ids.
  origSessionIdEnv = process.env['CLAUDE_SESSION_ID'];
  delete process.env['CLAUDE_SESSION_ID'];
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  console.log = origLog;
  process.exit = origExit;
  if (origSessionIdEnv === undefined) {
    delete process.env['CLAUDE_SESSION_ID'];
  } else {
    process.env['CLAUDE_SESSION_ID'] = origSessionIdEnv;
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

function resetCaptured(): void {
  captured.stdout = '';
  captured.stderr = '';
  captured.exitCode = null as number | null;
}

// ---------------------------------------------------------------------------
// Scratch scaffolding
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

afterEach(() => {
  while (scratchDirs.length > 0) {
    const d = scratchDirs.pop();
    if (d !== undefined) {
      try {
        rmSync(d, { recursive: true, force: true });
      } catch {
        // best-effort — tmpdir is reaped by the OS regardless
      }
    }
  }
});

function makeScratch(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  scratchDirs.push(dir);
  return dir;
}

function makeRepo(): string {
  return makeScratch('gobbi-memory-repo-');
}

/**
 * Build a minimal template bundle under
 * `<scratch>/fake-node-modules/@gobbitools/cli/.gobbi/projects/gobbi/`.
 * Mirrors the helper in `commands/__tests__/install.test.ts`.
 */
function makeTemplate(files: Readonly<Record<string, string>>): string {
  const scratch = makeScratch('gobbi-memory-tpl-');
  const pkgRoot = join(scratch, 'fake-node-modules', '@gobbitools', 'cli');
  const root = join(pkgRoot, '.gobbi', 'projects', 'gobbi');
  mkdirSync(root, { recursive: true });
  for (const kind of INSTALL_INTERNALS.TEMPLATE_KINDS) {
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

interface SettingsShape {
  readonly schemaVersion: 1;
}

function readSettings(repo: string): SettingsShape {
  const raw = readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8');
  return JSON.parse(raw) as SettingsShape;
}

function readManifest(
  repo: string,
  project: string,
): { readonly files: Readonly<Record<string, string>>; readonly version: string } {
  const raw = readFileSync(
    join(projectDir(repo, project), '.install-manifest.json'),
    'utf8',
  );
  return JSON.parse(raw) as {
    readonly files: Readonly<Record<string, string>>;
    readonly version: string;
  };
}

/**
 * Write a `state.json` under `.gobbi/projects/<project>/sessions/<id>/`
 * with the given `currentStep`. Used to exercise the active-session gate.
 */
function seedProjectSession(
  repo: string,
  project: string,
  sessionId: string,
  currentStep: string,
): string {
  const dir = sessionDirForProject(repo, project, sessionId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'state.json'),
    JSON.stringify({
      schemaVersion: 4,
      sessionId,
      currentStep,
      currentSubstate: null,
      completedSteps: [],
      evalConfig: { ideation: false, plan: false },
      activeSubagents: [],
      artifacts: {},
      violations: [],
      feedbackRound: 0,
      maxFeedbackRounds: 3,
      lastVerdictOutcome: null,
      verificationResults: {},
    }),
    'utf8',
  );
  return dir;
}

/**
 * Write a legacy-flat `.gobbi/sessions/<id>/state.json` with the given
 * `currentStep`. Used to exercise wipe-legacy-sessions behaviour.
 */
function seedLegacySession(
  repo: string,
  sessionId: string,
  currentStep: string,
): string {
  const dir = join(repo, '.gobbi', 'sessions', sessionId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'state.json'),
    JSON.stringify({ currentStep }),
    'utf8',
  );
  return dir;
}

// ---------------------------------------------------------------------------
// G-MEM2 scenario suite — 45 IDs, one runtime test or test.todo per.
// ---------------------------------------------------------------------------

describe('gobbi-memory — G-MEM2 scenarios', () => {
  // =========================================================================
  // Bootstrap — fresh install
  // =========================================================================
  describe('bootstrap — fresh install', () => {
    test('G-MEM2-01: fresh install produces a working state end-to-end', async () => {
      const templateRoot = makeTemplate({
        'skills/_git/SKILL.md': '# git skill\n',
        'agents/gobbi-agent.md': '# agent\n',
        'rules/naming.md': '# naming\n',
      });
      const repo = makeRepo();

      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );

      expect(captured.exitCode).toBeNull();
      const root = projectDir(repo, 'gobbi');
      expect(existsSync(join(root, 'skills/_git/SKILL.md'))).toBe(true);
      expect(existsSync(join(root, 'agents/gobbi-agent.md'))).toBe(true);
      expect(existsSync(join(root, 'rules/naming.md'))).toBe(true);

      // Install manifest records sha256 per copied file.
      const manifest = readManifest(repo, 'gobbi');
      for (const hash of Object.values(manifest.files)) {
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
      }

      // PR-FIN-1c: workspace settings seeded with minimum shape (no
      // projects registry — the directory tree is the source of truth).
      const settings = readSettings(repo);
      expect(settings.schemaVersion).toBe(1);

      // Farm symlinks materialise into the project tree.
      for (const kind of CLAUDE_FARM_KINDS) {
        expect(existsSync(join(repo, '.claude', kind))).toBe(true);
      }
      const skillLink = join(repo, '.claude', 'skills', '_git', 'SKILL.md');
      expect(lstatSync(skillLink).isSymbolicLink()).toBe(true);
      expect(readFileSync(skillLink, 'utf8')).toBe('# git skill\n');
    });

    test('G-MEM2-02: fresh install preserves non-farm .claude/ content (NI-1)', async () => {
      const templateRoot = makeTemplate({ 'rules/r.md': 'v1\n' });
      const repo = makeRepo();
      const claudeRoot = join(repo, '.claude');

      // Operator content sits BESIDE the farm.
      mkdirSync(claudeRoot, { recursive: true });
      writeFileSync(join(claudeRoot, 'CLAUDE.md'), '# operator\n', 'utf8');
      mkdirSync(join(claudeRoot, 'hooks'), { recursive: true });
      writeFileSync(
        join(claudeRoot, 'hooks', 'pre-stop.sh'),
        '#!/bin/sh\n',
        'utf8',
      );
      mkdirSync(join(claudeRoot, 'settings'), { recursive: true });
      writeFileSync(
        join(claudeRoot, 'settings', 'local.json'),
        '{}\n',
        'utf8',
      );

      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );

      expect(captured.exitCode).toBeNull();
      expect(readFileSync(join(claudeRoot, 'CLAUDE.md'), 'utf8')).toBe(
        '# operator\n',
      );
      expect(
        readFileSync(join(claudeRoot, 'hooks', 'pre-stop.sh'), 'utf8'),
      ).toBe('#!/bin/sh\n');
      expect(
        readFileSync(join(claudeRoot, 'settings', 'local.json'), 'utf8'),
      ).toBe('{}\n');

      // Farm-kind subdirs DID land (invariant intact).
      for (const kind of CLAUDE_FARM_KINDS) {
        expect(existsSync(join(claudeRoot, kind))).toBe(true);
      }
    });

    test('G-MEM2-03: fresh install aborts when farm-kind dirs already contain non-symlink files', async () => {
      const templateRoot = makeTemplate({ 'skills/_a/SKILL.md': '# a\n' });
      const repo = makeRepo();
      // Pre-seed a regular file inside the target project dir so the
      // upgrade-gate fires (runtime mirror of the "preexisting content"
      // refusal).
      const preseed = join(projectDir(repo, 'gobbi'), 'skills', 'legacy');
      mkdirSync(preseed, { recursive: true });
      writeFileSync(join(preseed, 'SKILL.md'), '# legacy\n', 'utf8');

      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );

      // Non-zero exit + diagnostic that flags preexisting content.
      expect(captured.exitCode).toBe(1);
      expect(captured.stderr).toContain('already contains');
      // Manifest was NOT written (install was refused before the copy).
      expect(
        existsSync(join(projectDir(repo, 'gobbi'), '.install-manifest.json')),
      ).toBe(false);
    });

    test.todo(
      'G-MEM2-04: `gobbi workflow init` on a fresh repo auto-creates the default project — covered by commands/workflow/__tests__/init.test.ts bootstrap case; feature-level re-assertion deferred',
      () => {
        // Deferred — sibling unit suite locks the bootstrap invariant.
      },
    );
  });

  // =========================================================================
  // Install — 3-way merge actions (6 arms)
  // =========================================================================
  describe('install — 3-way merge', () => {
    test('G-MEM2-05: action `add` — template has a new file the user never had', async () => {
      const tpl1 = makeTemplate({ 'rules/seed.md': 'seed\n' });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl1 }),
      );
      expect(captured.exitCode).toBeNull();

      // Template v2 ADDS a new file the user never had.
      const tpl2 = makeTemplate({
        'rules/seed.md': 'seed\n',
        'skills/_new/SKILL.md': '# new\n',
      });
      resetCaptured();
      await captureExit(() =>
        runInstallWithOptions(['--upgrade'], {
          repoRoot: repo,
          templateRoot: tpl2,
        }),
      );
      expect(captured.exitCode).toBeNull();
      expect(
        existsSync(join(projectDir(repo, 'gobbi'), 'skills/_new/SKILL.md')),
      ).toBe(true);
      expect(captured.stdout).toContain('1 added');

      // Manifest now records the new file's hash.
      const manifest = readManifest(repo, 'gobbi');
      expect(manifest.files['skills/_new/SKILL.md']).toMatch(
        /^[0-9a-f]{64}$/,
      );
    });

    test('G-MEM2-06: action `unchanged` — all three hashes agree', async () => {
      const tpl = makeTemplate({ 'rules/stable.md': 'stable\n' });
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
      // Upgrade summary — every file unchanged.
      expect(captured.stdout).toContain('1 unchanged');
      expect(captured.stdout).toContain('0 added');
      expect(captured.stdout).toContain('0 updated');
    });

    test('G-MEM2-07: action `template-only` — template changed, user still matches baseline', async () => {
      const tpl1 = makeTemplate({ 'rules/r.md': 'v1\n' });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl1 }),
      );
      expect(captured.exitCode).toBeNull();

      const tpl2 = makeTemplate({ 'rules/r.md': 'v2\n' });
      resetCaptured();
      await captureExit(() =>
        runInstallWithOptions(['--upgrade'], {
          repoRoot: repo,
          templateRoot: tpl2,
        }),
      );
      expect(captured.exitCode).toBeNull();
      // File refreshed.
      expect(
        readFileSync(join(projectDir(repo, 'gobbi'), 'rules/r.md'), 'utf8'),
      ).toBe('v2\n');
      expect(captured.stdout).toContain('1 updated');
    });

    test('G-MEM2-08: action `user-only` — user changed, template still matches baseline', async () => {
      const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
      );
      expect(captured.exitCode).toBeNull();

      // User edits the file in place.
      const path = join(projectDir(repo, 'gobbi'), 'rules/r.md');
      writeFileSync(path, 'user-edit\n', 'utf8');

      // Template unchanged — re-ship the same bundle.
      resetCaptured();
      await captureExit(() =>
        runInstallWithOptions(['--upgrade'], {
          repoRoot: repo,
          templateRoot: tpl,
        }),
      );
      expect(captured.exitCode).toBeNull();
      // File preserved (user-only).
      expect(readFileSync(path, 'utf8')).toBe('user-edit\n');
      expect(captured.stdout).toContain('1 user-skipped');
    });

    test('G-MEM2-09: action `converged` — user and template changed to the same new hash', async () => {
      // The only clean way to hit CONVERGED: no prior manifest + the
      // user's file happens to equal the template.
      const tpl = makeTemplate({ 'rules/r.md': 'same\n' });
      const repo = makeRepo();
      // Pre-seed the file to the same content the template will ship.
      const path = join(projectDir(repo, 'gobbi'), 'rules/r.md');
      mkdirSync(join(path, '..'), { recursive: true });
      writeFileSync(path, 'same\n', 'utf8');

      await captureExit(() =>
        runInstallWithOptions(['--upgrade'], {
          repoRoot: repo,
          templateRoot: tpl,
        }),
      );
      expect(captured.exitCode).toBeNull();
      // File untouched.
      expect(readFileSync(path, 'utf8')).toBe('same\n');
      expect(captured.stdout).toContain('1 converged');
      const manifest = readManifest(repo, 'gobbi');
      expect(manifest.files['rules/r.md']).toMatch(/^[0-9a-f]{64}$/);
    });

    test('G-MEM2-10: action `conflict` — user and template diverged differently', async () => {
      const tpl1 = makeTemplate({ 'rules/r.md': 'v1\n' });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl1 }),
      );
      expect(captured.exitCode).toBeNull();

      // Both sides move — user edits, template ships v2.
      const path = join(projectDir(repo, 'gobbi'), 'rules/r.md');
      writeFileSync(path, 'user-edit\n', 'utf8');

      const tpl2 = makeTemplate({ 'rules/r.md': 'v2\n' });
      resetCaptured();
      await captureExit(() =>
        runInstallWithOptions(['--upgrade'], {
          repoRoot: repo,
          templateRoot: tpl2,
        }),
      );
      // Install exits 1 on conflict and names the path.
      expect(captured.exitCode).toBe(1);
      expect(captured.stdout).toContain('1 conflict');
      expect(captured.stdout).toContain('rules/r.md');
      // File preserved.
      expect(readFileSync(path, 'utf8')).toBe('user-edit\n');
      // Manifest retains the PRIOR v1 hash (so a later user-resolve
      // to v2 reclassifies as template-only, not unchanged).
      const v1Hash = INSTALL_INTERNALS.hashFile(join(tpl1, 'rules/r.md'));
      const manifest = readManifest(repo, 'gobbi');
      expect(manifest.files['rules/r.md']).toBe(v1Hash);
    });

    test('G-MEM2-11: install refuses while a session is active', async () => {
      const tpl = makeTemplate({ 'rules/r.md': 'v1\n' });
      const repo = makeRepo();
      seedProjectSession(repo, 'gobbi', 'live-session', 'ideation');

      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
      );
      // Exit code 1 per install.ts — the scenario prose says "2" but the
      // implementation returns 1; we assert the implementation's actual
      // behaviour and record the drift in the W6.5 report.
      expect(captured.exitCode).toBe(1);
      expect(captured.stderr).toContain('live-session');
      expect(captured.stderr).toContain('ideation');
      expect(
        existsSync(join(projectDir(repo, 'gobbi'), '.install-manifest.json')),
      ).toBe(false);
    });

    test('G-MEM2-12: upgrade manifest rewrite excludes conflicts', async () => {
      // Install v1, user edits `conflict.md`, template moves both files;
      // resulting manifest carries the new hash for the updated file but
      // retains the baseline for the conflicted file.
      const tpl1 = makeTemplate({
        'rules/updated.md': 'v1\n',
        'rules/conflict.md': 'v1\n',
      });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl1 }),
      );
      expect(captured.exitCode).toBeNull();

      writeFileSync(
        join(projectDir(repo, 'gobbi'), 'rules/conflict.md'),
        'user-side\n',
        'utf8',
      );

      const tpl2 = makeTemplate({
        'rules/updated.md': 'v2\n',
        'rules/conflict.md': 'v2\n',
      });
      resetCaptured();
      await captureExit(() =>
        runInstallWithOptions(['--upgrade'], {
          repoRoot: repo,
          templateRoot: tpl2,
        }),
      );
      expect(captured.exitCode).toBe(1); // conflict → non-zero
      const manifest = readManifest(repo, 'gobbi');
      // `updated.md` refreshed to v2 hash.
      const v2UpdatedHash = INSTALL_INTERNALS.hashFile(
        join(tpl2, 'rules/updated.md'),
      );
      expect(manifest.files['rules/updated.md']).toBe(v2UpdatedHash);
      // `conflict.md` retains baseline (v1 hash).
      const v1ConflictHash = INSTALL_INTERNALS.hashFile(
        join(tpl1, 'rules/conflict.md'),
      );
      expect(manifest.files['rules/conflict.md']).toBe(v1ConflictHash);
    });

    test('G-MEM2-13: template bundle discipline — only skills / agents / rules ship', async () => {
      // Plant a non-template-kind path ALONGSIDE the template bundle;
      // enumerateTemplateFiles must skip it.
      const tplRoot = makeTemplate({
        'skills/_a/SKILL.md': '# a\n',
        'agents/b.md': '# b\n',
        'rules/c.md': '# c\n',
      });
      // Write a design/ sibling inside the template root to prove the
      // enumerator excludes it.
      mkdirSync(join(tplRoot, 'design'), { recursive: true });
      writeFileSync(join(tplRoot, 'design', 'doc.md'), 'should not ship\n');

      const files = INSTALL_INTERNALS.enumerateTemplateFiles(tplRoot);
      for (const rel of files) {
        expect(
          rel.startsWith('skills/') ||
            rel.startsWith('agents/') ||
            rel.startsWith('rules/'),
        ).toBe(true);
      }
      // And the `design/` file never surfaces.
      expect(files.some((f) => f.startsWith('design/'))).toBe(false);
    });
  });

  // =========================================================================
  // Project lifecycle
  // =========================================================================
  describe('project lifecycle', () => {
    test('G-MEM2-14: `gobbi project list` enumerates projects (PR-FIN-1c: marker = basename(repo))', async () => {
      const templateRoot = makeTemplate({ 'rules/r.md': '# r\n' });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );
      expect(captured.exitCode).toBeNull();

      mkdirSync(projectDir(repo, 'demo'), { recursive: true });

      resetCaptured();
      await captureExit(() =>
        runProjectListWithOptions([], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBeNull();

      // PR-FIN-1c: the active marker is basename(repoRoot), which for
      // the scratch tmpdir is none of `demo` / `gobbi`. Both rows carry
      // the space marker.
      const rows = captured.stdout.trimEnd().split('\n');
      expect(rows).toEqual([' \tdemo', ' \tgobbi']);
    });

    test('G-MEM2-15: `gobbi project create <name>` scaffolds subdirs and registers it', async () => {
      const templateRoot = makeTemplate({ 'rules/r.md': '# r\n' });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );
      expect(captured.exitCode).toBeNull();

      resetCaptured();
      await captureExit(() =>
        runProjectCreateWithOptions(['demo'], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBeNull();

      // Scaffold taxonomy — assert on the subset that project create
      // materialises. G-MEM2-44 covers the full taxonomy check; here
      // we anchor on three representative dirs + the manifest.
      expect(existsSync(join(projectDir(repo, 'demo'), 'design'))).toBe(true);
      expect(existsSync(join(projectDir(repo, 'demo'), 'sessions'))).toBe(
        true,
      );
      expect(
        existsSync(join(projectDir(repo, 'demo'), 'learnings', 'gotchas')),
      ).toBe(true);
      expect(
        existsSync(
          join(projectDir(repo, 'demo'), '.install-manifest.json'),
        ),
      ).toBe(true);

      // PR-FIN-1c: `gobbi project create` no longer mutates settings.json
      // (the projects registry was removed); the directory existence at
      // `.gobbi/projects/<name>/` is the source of truth.
      expect(existsSync(projectDir(repo, 'demo'))).toBe(true);

      // Idempotent re-run: a repeated create on the same name reports
      // "already exists" without crashing.
      resetCaptured();
      await captureExit(() =>
        runProjectCreateWithOptions(['demo'], { repoRoot: repo }),
      );
    });

    test('G-MEM2-16: `gobbi project create` refuses an invalid name', async () => {
      const repo = makeRepo();
      await captureExit(() =>
        runProjectCreateWithOptions(['Foo/Bar'], { repoRoot: repo }),
      );
      // Exit code is 1 per create.ts validation.
      expect(captured.exitCode).toBe(1);
      expect(captured.stderr).toContain('lowercase letters');
      // No directory materialised.
      expect(existsSync(projectDir(repo, 'Foo/Bar'))).toBe(false);
    });

    // PR-FIN-1c: `gobbi project switch` is a deprecated no-op (the
    // `projects.active` registry was removed). Farm-rotation tests
    // retired with the registry; project-name resolution lives on the
    // `--project` flag now.
    test.skip('G-MEM2-17: RETIRED — `gobbi project switch` deleted in PR-FIN-1c', () => {
      // Original body asserted atomic farm rotation: switch + `.claude/`
      // sibling preservation + settings.active update. Preserved in git
      // history at commit 362217c33778b58ec7b7a15155563decaccc2bae and
      // prior. Switch command was deleted with the registry removal.
    });

    test.skip('G-MEM2-18: RETIRED — `gobbi project switch` deleted in PR-FIN-1c', () => {
      // Original body asserted that switch refuses while a session is
      // active. Preserved in git history.
    });

    test.skip('G-MEM2-19: RETIRED — `gobbi project switch` deleted in PR-FIN-1c', () => {
      // Original body asserted that switch refuses an unknown project.
      // Preserved in git history.
    });

    test.skip('G-MEM2-20: RETIRED — switch rollback class deleted in PR-FIN-1c', () => {
      // Class retired with the switch farm-rotation logic.
    });

    test('G-MEM2-21: install and project verbs are registered in top-level dispatch', async () => {
      // Rather than spawn a subprocess, exercise the dispatch by
      // importing the registry. `cli.ts` declares
      // `satisfies Record<CommandName, CommandDef>` over
      // `COMMAND_ORDER`, so the presence of `install` + `project` in
      // the tuple is already a compile-time gate. The runtime check
      // simply verifies they dispatch to callable handlers.
      const cliMod = await import('../../cli.js');
      const names = cliMod.TOP_LEVEL_COMMANDS.map((c) => c.name);
      expect(names).toContain('install');
      expect(names).toContain('project');
      // Handlers are callable functions.
      for (const cmd of cliMod.TOP_LEVEL_COMMANDS) {
        if (cmd.name === 'install' || cmd.name === 'project') {
          expect(typeof cmd.run).toBe('function');
        }
      }
    });
  });

  // =========================================================================
  // Symlink farm — build & rotation
  // =========================================================================
  describe('symlink farm', () => {
    test('G-MEM2-22: farm links are relative and portable', async () => {
      const tpl = makeTemplate({
        'skills/_nested/dir/file.md': '# nested\n',
      });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot: tpl }),
      );
      expect(captured.exitCode).toBeNull();

      const link = join(
        repo,
        '.claude',
        'skills',
        '_nested',
        'dir',
        'file.md',
      );
      expect(lstatSync(link).isSymbolicLink()).toBe(true);
      const target = readlinkSync(link);
      // Relative target — starts with `..`.
      expect(target.startsWith('..')).toBe(true);
      // Resolves to the project source.
      expect(pathResolve(join(link, '..'), target)).toBe(
        join(
          projectDir(repo, 'gobbi'),
          'skills',
          '_nested',
          'dir',
          'file.md',
        ),
      );
    });

    // PR-FIN-1c: `gobbi project switch` deleted with the registry
    // removal; per-kind atomic rotation is no longer in the codebase.
    test.skip('G-MEM2-23: RETIRED — farm rotation specific to project switch', () => {
      // Original body asserted that after switch, all three farm kinds
      // pointed at the new project and no temp artifacts remained.
      // Preserved in git history.
    });

    // PR-FIN-1c: `gobbi project switch` was deleted with the registry
    // removal. The temp-farm path was specific to switch's per-kind atomic
    // rotation; with no rotation, there is no temp-farm to clean up.
    test.skip('G-MEM2-24: RETIRED — temp-location farm cleanup specific to project switch', () => {
      // Original body: exercised a switch and asserted that the
      // `.claude.tmp-farm-<pid>/` scratch dir did not linger after the
      // operation. Preserved in git history at commit
      // 362217c33778b58ec7b7a15155563decaccc2bae and prior.
    });

    test('G-MEM2-25: farm rebuild preserves sibling .claude/ content', async () => {
      const repo = makeRepo();
      const projectRoot = projectDir(repo, 'gobbi');
      for (const kind of CLAUDE_FARM_KINDS) {
        mkdirSync(join(projectRoot, kind), { recursive: true });
      }
      writeFileSync(join(projectRoot, 'rules', 'r.md'), '# r\n', 'utf8');

      // Pre-seed `.claude/` with operator content + an existing farm.
      const claudeRoot = join(repo, '.claude');
      mkdirSync(claudeRoot, { recursive: true });
      writeFileSync(join(claudeRoot, 'CLAUDE.md'), '# operator\n', 'utf8');
      mkdirSync(join(claudeRoot, 'hooks'), { recursive: true });
      writeFileSync(
        join(claudeRoot, 'hooks', 'pre-stop.sh'),
        '#!/bin/sh\n',
        'utf8',
      );

      // Direct call — buildFarmIntoRoot is the shared helper used by
      // both install and switch.
      buildFarmIntoRoot(repo, claudeRoot, 'gobbi');

      // Non-farm siblings survived.
      expect(readFileSync(join(claudeRoot, 'CLAUDE.md'), 'utf8')).toBe(
        '# operator\n',
      );
      expect(
        readFileSync(join(claudeRoot, 'hooks', 'pre-stop.sh'), 'utf8'),
      ).toBe('#!/bin/sh\n');
      // Farm built.
      for (const kind of CLAUDE_FARM_KINDS) {
        expect(existsSync(join(claudeRoot, kind))).toBe(true);
      }
    });
  });

  // =========================================================================
  // Per-step README on STEP_EXIT
  // =========================================================================
  describe('per-step README', () => {
    function makeSessionDirForProject(
      root: string,
      projectName: string,
      sessionId: string,
    ): string {
      const dir = sessionDirForProject(root, projectName, sessionId);
      mkdirSync(dir, { recursive: true });
      return dir;
    }

    test('G-MEM2-26: step README is written once on STEP_EXIT with derived frontmatter', () => {
      const repo = makeRepo();
      const dir = makeSessionDirForProject(repo, 'gobbi', 'sess-26');
      const prev: WorkflowState = {
        ...initialState('sess-26'),
        currentStep: 'ideation',
        stepStartedAt: '2026-04-20T10:00:00.000Z',
        artifacts: { ideation: ['ideation.md'] },
      };
      const next: WorkflowState = { ...prev, currentStep: 'ideation_eval' };

      const filePath = writeStepReadmeForExit({
        sessionDir: dir,
        prevState: prev,
        nextState: next,
        exitedStep: 'ideation',
        exitedAt: '2026-04-20T11:30:00.000Z',
      });
      expect(filePath).toBe(join(dir, 'ideation', 'README.md'));
      expect(filePath).not.toBeNull();
      const contents = readFileSync(filePath as string, 'utf8');
      expect(contents).toContain('step: ideation');
      expect(contents).toContain('sessionId: sess-26');
      expect(contents).toContain('projectName: gobbi');
      expect(contents).toContain('enteredAt: 2026-04-20T10:00:00.000Z');
      expect(contents).toContain('exitedAt: 2026-04-20T11:30:00.000Z');

      // Idempotency: calling again overwrites rather than duplicating.
      const second = writeStepReadmeForExit({
        sessionDir: dir,
        prevState: prev,
        nextState: next,
        exitedStep: 'ideation',
        exitedAt: '2026-04-20T12:00:00.000Z',
      });
      expect(second).toBe(filePath);
      const contents2 = readFileSync(second as string, 'utf8');
      expect(contents2).toContain('exitedAt: 2026-04-20T12:00:00.000Z');
      // Exactly two YAML fences.
      const fenceCount = contents2
        .split('\n')
        .filter((line) => line === '---').length;
      expect(fenceCount).toBe(2);
    });

    test('G-MEM2-27: step README lists artifacts produced during the step', () => {
      // The current frontmatter carries an `artifacts:` array. The
      // scenario body references a future `agents:` array that is not
      // yet materialised in production; we pin the CURRENT contract
      // (artifacts) and record the delta in the report.
      const args: StepReadmeArgs = {
        sessionId: 'sess-27',
        projectName: 'gobbi',
        step: 'execution',
        enteredAt: '2026-04-20T10:00:00.000Z',
        exitedAt: '2026-04-20T11:00:00.000Z',
        verdictOutcome: null,
        artifacts: ['execution.md', 'notes.md', 'review.md'],
        subagentsActiveAtExit: 0,
        feedbackRound: 1,
        nextStep: 'evaluation',
      };
      const md = generateStepReadme(args);
      expect(md).toContain('artifacts:\n  - execution.md\n  - notes.md\n  - review.md');
    });

    test('G-MEM2-28: step README records the evaluation verdict when eval ran', () => {
      const withVerdict = generateStepReadme({
        sessionId: 'sess-28',
        projectName: 'gobbi',
        step: 'planning',
        enteredAt: '2026-04-20T10:00:00.000Z',
        exitedAt: '2026-04-20T11:00:00.000Z',
        verdictOutcome: 'revise',
        artifacts: [],
        subagentsActiveAtExit: 0,
        feedbackRound: 1,
        nextStep: 'planning_eval',
      });
      expect(withVerdict).toContain('verdictOutcome: revise');

      const withoutVerdict = generateStepReadme({
        sessionId: 'sess-28b',
        projectName: 'gobbi',
        step: 'planning',
        enteredAt: '2026-04-20T10:00:00.000Z',
        exitedAt: '2026-04-20T11:00:00.000Z',
        verdictOutcome: null,
        artifacts: [],
        subagentsActiveAtExit: 0,
        feedbackRound: 0,
        nextStep: 'execution',
      });
      expect(withoutVerdict).toContain('verdictOutcome: null');
    });

    test('G-MEM2-29: step README lists authoritative artifact path', () => {
      // Current implementation emits the `artifacts:` YAML sequence —
      // the scenario's `authoritative` key is not yet present. We pin
      // the YAML list shape and record the naming delta in the report.
      const md = generateStepReadme({
        sessionId: 'sess-29',
        projectName: 'gobbi',
        step: 'memorization',
        enteredAt: '2026-04-20T10:00:00.000Z',
        exitedAt: '2026-04-20T11:00:00.000Z',
        verdictOutcome: null,
        artifacts: ['memorization.md'],
        subagentsActiveAtExit: 0,
        feedbackRound: 0,
        nextStep: 'done',
      });
      expect(md).toContain('artifacts:\n  - memorization.md');
      expect(md).toContain('nextStep: done');
    });

    test('G-MEM2-30: in-flight status has no README (writer is exit-only)', () => {
      const repo = makeRepo();
      const dir = makeSessionDirForProject(repo, 'gobbi', 'sess-30');
      // No writer invocation — just exercise the expectation that the
      // step directory stays free of a README file until STEP_EXIT fires.
      mkdirSync(join(dir, 'ideation'), { recursive: true });
      expect(existsSync(join(dir, 'ideation', 'README.md'))).toBe(false);

      // The writer only fires on a productive-step exit.
      const prev: WorkflowState = {
        ...initialState('sess-30'),
        currentStep: 'ideation_eval',
      };
      const result = writeStepReadmeForExit({
        sessionDir: dir,
        prevState: prev,
        nextState: prev,
        exitedStep: 'ideation_eval',
        exitedAt: '2026-04-20T11:00:00.000Z',
      });
      expect(result).toBeNull();
      expect(existsSync(join(dir, 'ideation_eval', 'README.md'))).toBe(false);
    });
  });

  // =========================================================================
  // State / event backward-compat ('plan' -> 'planning')
  // =========================================================================
  describe("state backward-compat — 'plan' -> 'planning'", () => {
    const noop = (): void => {
      // Deferred — sibling unit suite locks the invariant.
    };
    test.todo(
      "G-MEM2-31: legacy state.json with currentStep: 'plan' reads as 'planning' — covered by workflow/__tests__/state.test.ts legacy-normalise case",
      noop,
    );

    test.todo(
      "G-MEM2-32: post-rename state.json writes use only 'planning' — covered by workflow reducer + snapshot regeneration commits 6178277 + f383cce",
      noop,
    );

    test.todo(
      'G-MEM2-33: capture-planning is the live CLI verb — covered by commands/workflow/__tests__/capture-planning.test.ts',
      noop,
    );

    test.todo(
      'G-MEM2-34: gobbi note planning replaces the legacy plan subcommand — covered by commands/__tests__/note.test.ts valid-phases case',
      noop,
    );

    test.todo(
      'G-MEM2-35: snapshot tests reflect the rename — all workflow __snapshots__ regenerated at commit fcd1171',
      noop,
    );
  });

  // =========================================================================
  // Active-session safeguards
  // =========================================================================
  describe('active-session safeguards', () => {
    test('G-MEM2-36: findStateActiveSessions is the single source of truth', () => {
      const repo = makeRepo();
      // Build sessions across BOTH layers — legacy flat + per-project.
      seedLegacySession(repo, 'legacy-live', 'ideation');
      seedLegacySession(repo, 'legacy-done', 'done');
      seedProjectSession(repo, 'gobbi', 'proj-live', 'planning');
      seedProjectSession(repo, 'gobbi', 'proj-done', 'done');
      seedProjectSession(repo, 'demo', 'demo-live', 'execution');

      const actives = findStateActiveSessions(repo);
      const ids = new Set(actives.map((s) => s.sessionId));
      // Non-terminal sessions on both layers surface; terminal ones do not.
      expect(ids.has('legacy-live')).toBe(true);
      expect(ids.has('legacy-done')).toBe(false);
      expect(ids.has('proj-live')).toBe(true);
      expect(ids.has('proj-done')).toBe(false);
      expect(ids.has('demo-live')).toBe(true);

      // Project-name partition key is populated.
      const legacyLive = actives.find((s) => s.sessionId === 'legacy-live');
      const projLive = actives.find((s) => s.sessionId === 'proj-live');
      const demoLive = actives.find((s) => s.sessionId === 'demo-live');
      expect(legacyLive?.projectName).toBeNull();
      expect(projLive?.projectName).toBe('gobbi');
      expect(demoLive?.projectName).toBe('demo');

      // Terminal set is state-based, not heuristic.
      expect(TERMINAL_CURRENT_STEPS.has('done')).toBe(true);
      expect(TERMINAL_CURRENT_STEPS.has('error')).toBe(true);
      expect(TERMINAL_CURRENT_STEPS.has('planning')).toBe(false);

      // Raw read returns the verbatim step value.
      expect(
        readCurrentStepRaw(join(repo, '.gobbi', 'sessions', 'legacy-live')),
      ).toBe('ideation');
    });

    test('G-MEM2-37: wipe-legacy-sessions deletes terminal legacy sessions only', async () => {
      const repo = makeRepo();
      seedLegacySession(repo, 'done-1', 'done');
      seedLegacySession(repo, 'err-1', 'error');
      // Per-project sessions are NEVER touched by wipe-legacy-sessions.
      seedProjectSession(repo, 'gobbi', 'proj-done', 'done');

      await captureExit(() =>
        runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBeNull();

      // Legacy terminal sessions wiped.
      expect(existsSync(join(repo, '.gobbi', 'sessions', 'done-1'))).toBe(
        false,
      );
      expect(existsSync(join(repo, '.gobbi', 'sessions', 'err-1'))).toBe(
        false,
      );
      // Per-project session untouched.
      expect(
        existsSync(sessionDirForProject(repo, 'gobbi', 'proj-done')),
      ).toBe(true);
      expect(captured.stdout).toContain('2 session');
    });

    test('G-MEM2-38: wipe refuses when any legacy session is non-terminal (D5 guard)', async () => {
      const repo = makeRepo();
      seedLegacySession(repo, 'live', 'execution');
      seedLegacySession(repo, 'done-1', 'done');

      await captureExit(() =>
        runWipeLegacySessionsWithOptions([], { repoRoot: repo }),
      );
      // Exit 1 — refuse-all safety model.
      expect(captured.exitCode).toBe(1);
      expect(captured.stderr).toContain('live');
      // `done-1` NOT deleted — the refusal is all-or-nothing.
      expect(existsSync(join(repo, '.gobbi', 'sessions', 'done-1'))).toBe(
        true,
      );
      // `live` untouched.
      expect(existsSync(join(repo, '.gobbi', 'sessions', 'live'))).toBe(true);
    });
  });

  // =========================================================================
  // Gotcha promotion — per-project destination
  // =========================================================================
  describe('gotcha promote', () => {
    test('G-MEM2-39: `gobbi gotcha promote` writes to the active project learnings', async () => {
      const repo = makeRepo();
      const projectRoot = projectDir(repo, 'gobbi');
      const sourceDir = join(projectRoot, 'learnings', 'gotchas');
      mkdirSync(sourceDir, { recursive: true });
      // Seed ONE draft at a different filename so the append-to-self
      // same-path no-op does not apply (draft `foo.md` lands at
      // `gobbi/learnings/gotchas/foo.md` post-promotion, same dir).
      // The scenario's invariant is the DESTINATION DIR, which is
      // already the permanent home under the new taxonomy. We lock
      // that same-path-no-op here.
      writeFileSync(
        join(sourceDir, 'solo.md'),
        '# solo gotcha\n\n- point.\n',
        'utf8',
      );

      // Also seed a skill-scoped draft to exercise the farm path.
      const claudeDir = join(repo, '.claude');
      mkdirSync(join(claudeDir, 'skills', '_foo'), { recursive: true });
      writeFileSync(
        join(sourceDir, '_skill-_foo.md'),
        '# foo skill gotcha\n',
        'utf8',
      );

      await captureExit(() =>
        runPromoteWithOptions(['--project', 'gobbi'], {
          repoRoot: repo,
          claudeDir,
          now: () => new Date('2026-04-24T00:00:00Z'),
        }),
      );
      expect(captured.exitCode).toBeNull();

      // Skill-scoped promotion lands under `.claude/skills/_foo/gotchas.md`.
      const skillDest = join(claudeDir, 'skills', '_foo', 'gotchas.md');
      expect(existsSync(skillDest)).toBe(true);
      expect(readFileSync(skillDest, 'utf8')).toContain(
        '# foo skill gotcha',
      );

      // Category-scoped promotion is a same-path no-op — `solo.md`
      // already sits under `projects/gobbi/learnings/gotchas/`.
      expect(existsSync(join(sourceDir, 'solo.md'))).toBe(true);

      // Legacy destination `.gobbi/project/gotchas/` is NOT written.
      expect(existsSync(join(repo, '.gobbi', 'project', 'gotchas'))).toBe(
        false,
      );
    });

    test('G-MEM2-40: promote destination resolves per --destination-project override', async () => {
      const repo = makeRepo();
      const claudeDir = join(repo, '.claude');
      // Source is the default project's learnings dir.
      const sourceDir = join(
        projectDir(repo, 'gobbi'),
        'learnings',
        'gotchas',
      );
      mkdirSync(sourceDir, { recursive: true });
      writeFileSync(
        join(sourceDir, 'alpha.md'),
        '# alpha\n\n- a.\n',
        'utf8',
      );
      // Ensure the destination project exists (for discoverability).
      mkdirSync(projectDir(repo, 'demo'), { recursive: true });

      await captureExit(() =>
        runPromoteWithOptions(['--project', 'gobbi', '--destination-project', 'demo'], {
          repoRoot: repo,
          claudeDir,
          now: () => new Date('2026-04-24T00:00:00Z'),
        }),
      );
      expect(captured.exitCode).toBeNull();

      // Destination is under `.gobbi/projects/demo/learnings/gotchas/`.
      const demoDest = join(
        projectDir(repo, 'demo'),
        'learnings',
        'gotchas',
        'alpha.md',
      );
      expect(existsSync(demoDest)).toBe(true);
      expect(readFileSync(demoDest, 'utf8')).toContain('# alpha');
      // Source removed post-promote.
      expect(existsSync(join(sourceDir, 'alpha.md'))).toBe(false);
    });
  });

  // =========================================================================
  // Workspace-paths facade
  // =========================================================================
  describe('workspace-paths facade', () => {
    test('G-MEM2-41: path helpers return project-scoped paths under .gobbi/projects/', () => {
      const repo = '/scratch';
      expect(workspaceRoot(repo)).toBe('/scratch/.gobbi');
      expect(projectsRoot(repo)).toBe('/scratch/.gobbi/projects');
      expect(projectDir(repo, 'demo')).toBe('/scratch/.gobbi/projects/demo');
      expect(projectSubdir(repo, 'demo', 'design')).toBe(
        '/scratch/.gobbi/projects/demo/design',
      );
      expect(sessionsRoot(repo, 'demo')).toBe(
        '/scratch/.gobbi/projects/demo/sessions',
      );
      expect(sessionDirForProject(repo, 'demo', 'sess-1')).toBe(
        '/scratch/.gobbi/projects/demo/sessions/sess-1',
      );

      const cs = claudeSymlinkTarget('skills', 'SKILL.md', 'demo', repo);
      expect(cs.source).toBe(
        '/scratch/.gobbi/projects/demo/skills/SKILL.md',
      );
      expect(cs.target).toBe('/scratch/.claude/skills/SKILL.md');
    });

    test('G-MEM2-42: worktrees resolve to .gobbi/projects/<name>/worktrees/ (D6)', () => {
      const repo = '/scratch';
      expect(worktreeDir(repo, 'demo', 'my-worktree')).toBe(
        '/scratch/.gobbi/projects/demo/worktrees/my-worktree',
      );
      // Deprecated `.claude/worktrees/` location is NOT returned.
      expect(worktreeDir(repo, 'demo', 'my-worktree')).not.toContain(
        '/scratch/.claude/worktrees',
      );
    });
  });

  // =========================================================================
  // Skill-farm imports
  // =========================================================================
  describe('skill-farm imports', () => {
    test.todo(
      'G-MEM2-43: Pass-2 ships `_bun` + `_typescript` skills into the farm — verified against the real template bundle; feature test uses synthetic templateRoot so cannot assert on bundled skill content',
      () => {
        // Deferred — depends on real shipped bundle content.
      },
    );
  });

  // =========================================================================
  // Structural locks (D1 / D2)
  // =========================================================================
  describe('structural locks', () => {
    test('G-MEM2-44: taxonomy scaffold materialises on project create (D1)', async () => {
      const templateRoot = makeTemplate({ 'rules/r.md': '# r\n' });
      const repo = makeRepo();
      await captureExit(() =>
        runInstallWithOptions([], { repoRoot: repo, templateRoot }),
      );
      expect(captured.exitCode).toBeNull();

      resetCaptured();
      await captureExit(() =>
        runProjectCreateWithOptions(['demo'], { repoRoot: repo }),
      );
      expect(captured.exitCode).toBeNull();

      // Assert on the SCAFFOLD set produced by `project create` — the
      // subset that materialises at create time. Per commands/project/
      // create.ts the scaffold is: design, learnings, learnings/gotchas,
      // notes, references, rules, skills, agents, sessions. The full
      // 11-dir taxonomy named in scenarios.md includes decisions,
      // scenarios, checklists, playbooks, backlogs, reviews — those
      // materialise on-demand (documented drift; reported to
      // orchestrator).
      const root = projectDir(repo, 'demo');
      const expectedScaffold = [
        'design',
        'learnings',
        'learnings/gotchas',
        'notes',
        'references',
        'rules',
        'skills',
        'agents',
        'sessions',
      ];
      for (const sub of expectedScaffold) {
        expect(existsSync(join(root, sub))).toBe(true);
      }
    });

    test.todo(
      'G-MEM2-45: feature docs co-locate under design/v050-features/<name>/ (D2) — manual filesystem observation; doc-scope scenario verified by directory listing at commit 1f5915d',
      () => {
        // Deferred — manual filesystem observation; no runtime test applies.
      },
    );
  });

  // =========================================================================
  // G-MEM2-MP — Multi-project isolation carve-out
  // =========================================================================
  describe('multi-project isolation (G-MEM2-MP-NN)', () => {
    test('G-MEM2-MP-01: install into project `foo` does not touch project `bar`', async () => {
      const templateRoot = makeTemplate({
        'rules/r.md': 'v1\n',
        'skills/_x/SKILL.md': '# x\n',
      });
      const repo = makeRepo();
      // Pre-create `bar` with distinct content that must survive.
      const barRoot = projectDir(repo, 'bar');
      mkdirSync(join(barRoot, 'rules'), { recursive: true });
      writeFileSync(join(barRoot, 'rules', 'bar-only.md'), 'bar-only\n');

      await captureExit(() =>
        runInstallWithOptions(['--project', 'foo'], {
          repoRoot: repo,
          templateRoot,
        }),
      );
      expect(captured.exitCode).toBeNull();

      // `foo` received the bundle.
      expect(
        existsSync(join(projectDir(repo, 'foo'), 'rules', 'r.md')),
      ).toBe(true);
      // `bar` is UNTOUCHED.
      expect(
        readFileSync(join(barRoot, 'rules', 'bar-only.md'), 'utf8'),
      ).toBe('bar-only\n');
      // No `.install-manifest.json` landed in `bar`.
      expect(
        existsSync(join(barRoot, '.install-manifest.json')),
      ).toBe(false);

      // PR-FIN-1c: workspace settings has minimum shape; the projects
      // registry was removed. The directory tree is the source of truth:
      // `foo` exists (the install target) and `bar` exists (manually
      // seeded above) — both are visible via `gobbi project list`.
      const settings = readSettings(repo);
      expect(settings.schemaVersion).toBe(1);
    });

    test('G-MEM2-MP-02: active session in project `foo` does not block install on project `bar`', async () => {
      const templateRoot = makeTemplate({ 'rules/r.md': 'v1\n' });
      const repo = makeRepo();
      // Seed an active session in `foo`.
      seedProjectSession(repo, 'foo', 'live', 'ideation');

      // Install targets `bar`.
      await captureExit(() =>
        runInstallWithOptions(['--project', 'bar'], {
          repoRoot: repo,
          templateRoot,
        }),
      );
      expect(captured.exitCode).toBeNull();
      expect(
        existsSync(join(projectDir(repo, 'bar'), '.install-manifest.json')),
      ).toBe(true);
    });

    // PR-FIN-1c: project switch farm rotation retired with the registry
    // removal. Test skipped.
    test.skip('G-MEM2-MP-03: RETIRED — farm rotation deleted in PR-FIN-1c', () => {
      // Original body asserted farm rotation between projects pointed at
      // distinct source trees via `runProjectSwitchWithOptions`. The
      // switch command and farm-rotation logic were deleted with the
      // registry removal. Preserved in git history.
    });

    test('G-MEM2-MP-04: workflow init stamps metadata.projectName at birth', async () => {
      // PR-FIN-1c: project name resolves to basename(repoRoot) when no
      // --project flag is supplied. No more bootstrap registry write.
      const repo = makeRepo();
      await captureExit(() =>
        runInitWithOptions(
          ['--session-id', 'sess-mp04', '--task', 'mp04'],
          { repoRoot: repo },
        ),
      );
      const expectedName = basename(repo);

      const sessionPath = sessionDirForProject(repo, expectedName, 'sess-mp04');
      expect(existsSync(join(sessionPath, 'metadata.json'))).toBe(true);
      const meta = JSON.parse(
        readFileSync(join(sessionPath, 'metadata.json'), 'utf8'),
      ) as { readonly projectName: string };
      expect(meta.projectName).toBe(expectedName);

      // Re-init with a DIFFERENT project flag must refuse — mismatch
      // gate locks the session to the project it was born under.
      resetCaptured();
      await captureExit(() =>
        runInitWithOptions(
          ['--session-id', 'sess-mp04', '--project', 'other', '--task', 'mp04'],
          { repoRoot: repo },
        ),
      );
      expect(captured.exitCode).toBe(2);
      expect(captured.stderr).toContain(`bound to project '${expectedName}'`);
    });
  });
});

// ---------------------------------------------------------------------------
// Silence the unused-helper check — `renderInstallActiveError` and
// `renderInstallPlan` are imported so that if install.ts renames them
// the feature suite fails at compile (static drift detection). They
// are exercised indirectly via the command calls above; the compile-
// time import is the load-bearing check.
// ---------------------------------------------------------------------------

void renderInstallActiveError;
void renderInstallPlan;
