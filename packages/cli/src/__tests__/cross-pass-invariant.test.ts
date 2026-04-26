/**
 * Cross-pass invariant — Wave 3.D.
 *
 * Pass-1 (Pass 1 / Pass 2 / Pass 3) each landed schema-version handshakes
 * at independent layers:
 *
 *   - workspace/project/session `settings.json` — `schemaVersion: 1` plus
 *     the pre-Pass-3 `.gobbi/project-config.json` (T2-v1) → unified-shape
 *     upgrade in `ensureSettingsCascade`.
 *   - per-session `metadata.json` — `schemaVersion: 3` (gobbi-memory Pass-2
 *     redesign — multi-project layout).
 *   - per-session `state.json` — `schemaVersion: 4` (Pass-2 reducer state v4
 *     adds `verificationResults` + `stepStartedAt`).
 *   - per-session `gobbi.db` — `CURRENT_SCHEMA_VERSION = 5` (gobbi-memory
 *     Pass 2 adds `session_id` + `project_id` columns; ALTER + backfill
 *     happens on `EventStore` open).
 *
 * Bugs at the SEAMS between these layers cannot show up in any single
 * pass's tests — each pass's owner only validates their own layer in
 * isolation. This file locks the cross-layer invariant: a session
 * directory built from legacy on-disk shapes must converge to current
 * schemas across ALL four layers in a single `runInitWithOptions` call,
 * and the result must be semantically equivalent to a fresh-install
 * session for the same logical inputs.
 *
 * ## Test scope
 *
 * The legacy shape covered here is the most common cross-pass mix that
 * actually appears in the wild — a session that pre-dates both the
 * Pass-3 cascade collapse and the Pass-3 SQLite-config decommission:
 *
 *   - `.gobbi/project-config.json` — T2-v1 (Pass-3 era)
 *   - `.gobbi/config.db`           — pre-Pass-3 SQLite stub
 *   - `.claude/gobbi.json`         — pre-Pass-3 user-tier JSON
 *   - NO `.gobbi/settings.json`    — fresh-bootstrap path
 *   - NO existing session dir      — init creates one fresh
 *
 * The test uses a tmp scratch repo whose `basename(repoRoot)` is `gobbi`
 * so the upgrader and init's bootstrap target both resolve to the same
 * project slot. A separate test below (XPI-2) covers the divergence
 * path where `basename(repoRoot) !== 'gobbi'` and verifies that
 * cascade + init still agree post-#138.
 *
 * The fresh-install comparison runs the same `runInitWithOptions` call
 * against a fresh tmpdir with no legacy fixtures, then asserts the
 * resulting `metadata.json` + `state.json` + `gobbi.db` schema versions
 * match the legacy-seed run modulo per-session-unique fields
 * (sessionId, createdAt, projectRoot path).
 *
 * Pattern: mirrors `__tests__/features/gobbi-config.test.ts` env-hygiene
 * and stdout-capture conventions; uses `runInitWithOptions({ repoRoot })`
 * rather than `Bun.$` subprocesses because the invariant is a code-path
 * contract, not a CLI-shape contract — `commands/workflow/__tests__/init.test.ts`
 * is the precedent for in-process init tests.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { Database } from 'bun:sqlite';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

import { runInitWithOptions, readMetadata } from '../commands/workflow/init.js';
import { readState } from '../workflow/state.js';
import { CURRENT_SCHEMA_VERSION } from '../workflow/migrations.js';
import {
  projectDir as projectDirForName,
  sessionDir as sessionDirForProject,
} from '../lib/workspace-paths.js';
import { resolveSettings } from '../lib/settings-io.js';

// ---------------------------------------------------------------------------
// stdout/stderr/process.exit capture — quiet the bootstrap stderr line and
// the `[settings-io] no projects.active` warning so test output stays clean.
// Pattern lifted from `commands/workflow/__tests__/init.test.ts`.
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

let captured: Captured = { stdout: '', stderr: '', exitCode: null };
let origStdoutWrite: typeof process.stdout.write;
let origStderrWrite: typeof process.stderr.write;
let origExit: typeof process.exit;

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

const ORIG_ENV_SESSION_ID = process.env['CLAUDE_SESSION_ID'];
const ORIG_ENV_PROJECT_DIR = process.env['CLAUDE_PROJECT_DIR'];

beforeEach(() => {
  captured = { stdout: '', stderr: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origStderrWrite = process.stderr.write;
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
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;

  // Env hygiene per `cli-vs-skill-session-id` gotcha — every CLI run in
  // this file passes an explicit `--session-id` flag, so pre-existing
  // CLAUDE_SESSION_ID would only confuse the fixture wiring.
  delete process.env['CLAUDE_SESSION_ID'];
  delete process.env['CLAUDE_PROJECT_DIR'];
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  process.exit = origExit;

  if (ORIG_ENV_SESSION_ID !== undefined) {
    process.env['CLAUDE_SESSION_ID'] = ORIG_ENV_SESSION_ID;
  } else {
    delete process.env['CLAUDE_SESSION_ID'];
  }
  if (ORIG_ENV_PROJECT_DIR !== undefined) {
    process.env['CLAUDE_PROJECT_DIR'] = ORIG_ENV_PROJECT_DIR;
  } else {
    delete process.env['CLAUDE_PROJECT_DIR'];
  }
});

// ---------------------------------------------------------------------------
// Per-test scratch repos. `runInitWithOptions({ repoRoot })` lets us use a
// non-git tmpdir without mutating `process.cwd()`. Each scratch dir is
// removed in `afterEach`.
// ---------------------------------------------------------------------------

const scratchDirs: string[] = [];

/**
 * Create a fresh tmp scratch repo whose `basename(repoRoot)` equals
 * `gobbi`. Used by XPI-1 to keep the legacy-seed and fresh-install arms
 * pointed at the same project slot (`.gobbi/projects/gobbi/...`). A
 * scratch repo with any other basename is the XPI-2 fixture that locks
 * the issue-#138 fix — cascade and init must still converge on the
 * resolved active project (`my-app`) instead of orphaning the upgrade
 * under `gobbi/`.
 */
function makeScratchRepoNamedGobbi(): string {
  const parent = mkdtempSync(join(tmpdir(), 'gobbi-cross-pass-'));
  const repo = join(parent, 'gobbi');
  mkdirSync(repo, { recursive: true });
  scratchDirs.push(parent);
  return repo;
}

/**
 * Create a fresh tmp scratch repo whose `basename(repoRoot)` differs
 * from `'gobbi'`. Used by XPI-2 to lock the post-#138 invariant: the
 * cascade upgrader resolves the project name via the same ladder init
 * uses, so the legacy upgrade lands at the active project's slot
 * (`projects/my-app/...`) instead of an orphaned `projects/gobbi/`.
 */
function makeScratchRepoWithDifferentBasename(): string {
  const parent = mkdtempSync(join(tmpdir(), 'gobbi-cross-pass-'));
  const repo = join(parent, 'my-app');
  mkdirSync(repo, { recursive: true });
  scratchDirs.push(parent);
  return repo;
}

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

// ---------------------------------------------------------------------------
// Legacy-fixture seed helpers — the four legacy on-disk shapes we layer
// onto a fresh scratch repo to construct the cross-pass legacy state.
// ---------------------------------------------------------------------------

const FIXTURES_ROOT = join(import.meta.dir, 'fixtures', 'legacy-session');

/**
 * Copy `project-config.json` (T2-v1 Pass-3-era project config) onto a
 * scratch repo at `.gobbi/project-config.json`. `ensureSettingsCascade`
 * Step 3 reads, upgrades, and writes the result to
 * `.gobbi/projects/gobbi/settings.json` (the legacy file is preserved
 * per the SKILL JSDoc — operator decides when to delete).
 */
function seedLegacyProjectConfig(repo: string): void {
  const src = join(FIXTURES_ROOT, 'project-config.json');
  const dest = join(repo, '.gobbi', 'project-config.json');
  mkdirSync(join(repo, '.gobbi'), { recursive: true });
  writeFileSync(dest, readFileSync(src, 'utf8'), 'utf8');
}

/**
 * Drop a stub `.gobbi/config.db` (any content — `ensureSettingsCascade`
 * Step 1 deletes by existence, not content). Used to verify the
 * Pass-3 SQLite-config decommission still fires under cross-pass init.
 */
function seedLegacyConfigDb(repo: string): void {
  const dir = join(repo, '.gobbi');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'config.db'), 'not a real sqlite database', 'utf8');
}

/**
 * Copy `.claude/gobbi.json` (pre-Pass-3 user-tier JSON config) onto a
 * scratch repo at `.claude/gobbi.json`. `ensureSettingsCascade` Step 2
 * deletes it unconditionally; we drop a real fixture rather than
 * synthesising the bytes inline so the legacy shape is reviewable on
 * disk for future readers.
 */
function seedLegacyClaudeGobbi(repo: string): void {
  const src = join(FIXTURES_ROOT, 'claude-gobbi.json');
  const dest = join(repo, '.claude', 'gobbi.json');
  mkdirSync(join(repo, '.claude'), { recursive: true });
  writeFileSync(dest, readFileSync(src, 'utf8'), 'utf8');
}

// ---------------------------------------------------------------------------
// Layer-snapshot helpers — read each post-init layer's schema version +
// shape signature so the legacy-seed and fresh-install runs can be
// compared structurally.
// ---------------------------------------------------------------------------

interface LayerSnapshot {
  readonly metadataSchemaVersion: number;
  readonly stateSchemaVersion: number;
  readonly dbColumnsHaveSessionAndProjectId: boolean;
  readonly workspaceSchemaVersion: number | null;
  readonly workspaceProjectsActive: string | null;
  readonly workspaceProjectsKnown: readonly string[];
  /**
   * Whether the project-level `.gobbi/projects/gobbi/settings.json` file
   * is present. The legacy-seed run creates it via the T2-v1 upgrader;
   * the fresh-install run does not. The shape comparison handles this
   * branch explicitly rather than asserting parity.
   */
  readonly projectSettingsExists: boolean;
  readonly currentStep: string;
  readonly evalConfigKeys: readonly string[];
}

function snapshotLayers(repo: string, sessionId: string): LayerSnapshot {
  const projectName = basename(repo);
  const sDir = sessionDirForProject(repo, projectName, sessionId);

  // Layer 1 — metadata.json
  const meta = readMetadata(join(sDir, 'metadata.json'));
  if (meta === null) {
    throw new Error(`metadata.json missing or malformed at ${sDir}`);
  }

  // Layer 2 — state.json
  const state = readState(sDir);
  if (state === null) {
    throw new Error(`state.json missing or malformed at ${sDir}`);
  }

  // Layer 3 — gobbi.db: open and confirm `session_id` + `project_id`
  // columns exist (v5 schema). PRAGMA table_info returns one row per
  // column; we narrow on `name` rather than column index.
  const dbPath = join(sDir, 'gobbi.db');
  const db = new Database(dbPath, { readonly: true });
  let dbHasV5Columns = false;
  try {
    const rows = db
      .query<{ name: string }, []>('PRAGMA table_info(events)')
      .all();
    const names = new Set(rows.map((r) => r.name));
    dbHasV5Columns = names.has('session_id') && names.has('project_id');
  } finally {
    db.close();
  }

  // Layer 4 — workspace settings.json. The unified resolver gives us the
  // bootstrap-populated `projects.active` + `projects.known`; we read the
  // raw file directly so the snapshot reflects what landed on disk
  // (the resolver returns a merged Settings, which doesn't expose
  // schemaVersion).
  const workspacePath = join(repo, '.gobbi', 'settings.json');
  let workspaceSchemaVersion: number | null = null;
  let workspaceProjectsActive: string | null = null;
  let workspaceProjectsKnown: readonly string[] = [];
  if (existsSync(workspacePath)) {
    const raw = JSON.parse(readFileSync(workspacePath, 'utf8')) as unknown;
    if (raw !== null && typeof raw === 'object') {
      const r = raw as Record<string, unknown>;
      if (typeof r['schemaVersion'] === 'number') {
        workspaceSchemaVersion = r['schemaVersion'];
      }
      const projects = r['projects'];
      if (projects !== null && typeof projects === 'object') {
        const p = projects as Record<string, unknown>;
        const active = p['active'];
        if (typeof active === 'string') workspaceProjectsActive = active;
        const known = p['known'];
        if (Array.isArray(known)) {
          workspaceProjectsKnown = known.filter(
            (k): k is string => typeof k === 'string',
          );
        }
      }
    }
  }

  const projectSettingsPath = join(
    projectDirForName(repo, 'gobbi'),
    'settings.json',
  );

  return {
    metadataSchemaVersion: meta.schemaVersion,
    stateSchemaVersion: state.schemaVersion,
    dbColumnsHaveSessionAndProjectId: dbHasV5Columns,
    workspaceSchemaVersion,
    workspaceProjectsActive,
    workspaceProjectsKnown,
    projectSettingsExists: existsSync(projectSettingsPath),
    currentStep: state.currentStep,
    evalConfigKeys:
      state.evalConfig === null ? [] : Object.keys(state.evalConfig).sort(),
  };
}

// ===========================================================================
// XPI-1 — primary cross-pass invariant
// ===========================================================================

describe('cross-pass invariant: init normalises legacy-shape session', () => {
  test(
    'XPI-1: legacy fixture seed yields current schema versions across all four layers, equivalent to fresh install',
    async () => {
      // ---------------------------------------------------------------------
      // Arm A — legacy fixture seed
      // ---------------------------------------------------------------------
      const legacyRepo = makeScratchRepoNamedGobbi();
      seedLegacyProjectConfig(legacyRepo);
      seedLegacyConfigDb(legacyRepo);
      seedLegacyClaudeGobbi(legacyRepo);

      // Pre-init: the legacy fixtures are present, the new-shape paths are
      // not. Any of these failing means a sibling test polluted the tmpdir
      // (which `mkdtempSync` should make impossible) or the fixture seeders
      // regressed.
      expect(
        existsSync(join(legacyRepo, '.gobbi', 'project-config.json')),
      ).toBe(true);
      expect(existsSync(join(legacyRepo, '.gobbi', 'config.db'))).toBe(true);
      expect(existsSync(join(legacyRepo, '.claude', 'gobbi.json'))).toBe(true);
      expect(
        existsSync(
          join(projectDirForName(legacyRepo, 'gobbi'), 'settings.json'),
        ),
      ).toBe(false);
      expect(existsSync(join(legacyRepo, '.gobbi', 'settings.json'))).toBe(
        false,
      );

      const legacySessionId = 'xpi-legacy';
      await captureExit(() =>
        runInitWithOptions(
          [
            '--session-id',
            legacySessionId,
            '--task',
            'cross-pass-legacy',
          ],
          { repoRoot: legacyRepo },
        ),
      );
      expect(captured.exitCode).toBeNull();

      // Post-init: each pass's cleanup / migration / bootstrap step must
      // have fired. These are the SEAM assertions — no single-layer test
      // exercises the full chain.

      // (a) Pass-3 cleanup — legacy SQLite stub deleted.
      expect(existsSync(join(legacyRepo, '.gobbi', 'config.db'))).toBe(false);

      // (b) Pre-Pass-3 cleanup — legacy `.claude/gobbi.json` deleted.
      expect(existsSync(join(legacyRepo, '.claude', 'gobbi.json'))).toBe(
        false,
      );

      // (c) T2-v1 upgrader — legacy project-config.json read,
      //     translated, and written to the new project-level path. The
      //     legacy file itself is preserved per the SKILL JSDoc.
      expect(
        existsSync(join(legacyRepo, '.gobbi', 'project-config.json')),
      ).toBe(true);
      const upgradedProjectPath = join(
        projectDirForName(legacyRepo, 'gobbi'),
        'settings.json',
      );
      expect(existsSync(upgradedProjectPath)).toBe(true);

      // (d) Workspace bootstrap — `projects.active` written via the
      //     init-side ladder (step 3 — basename(repoRoot)).
      expect(existsSync(join(legacyRepo, '.gobbi', 'settings.json'))).toBe(
        true,
      );

      // (e) `.gitignore` housekeeping — the cascade appends both required
      //     entries (settings.json + sessions/) atomically.
      const gitignoreRaw = readFileSync(
        join(legacyRepo, '.gobbi', '.gitignore'),
        'utf8',
      );
      expect(gitignoreRaw).toContain('settings.json');
      expect(gitignoreRaw).toContain('sessions/');

      const legacySnap = snapshotLayers(legacyRepo, legacySessionId);

      // ---------------------------------------------------------------------
      // Arm B — fresh-install (no legacy fixtures)
      // ---------------------------------------------------------------------
      const freshRepo = makeScratchRepoNamedGobbi();
      const freshSessionId = 'xpi-fresh';
      await captureExit(() =>
        runInitWithOptions(
          ['--session-id', freshSessionId, '--task', 'cross-pass-fresh'],
          { repoRoot: freshRepo },
        ),
      );
      expect(captured.exitCode).toBeNull();
      const freshSnap = snapshotLayers(freshRepo, freshSessionId);

      // ---------------------------------------------------------------------
      // Cross-arm assertions — every layer normalises to the SAME current
      // schema regardless of whether the seed was legacy or fresh. The
      // session-unique fields (sessionId, createdAt, projectRoot) differ
      // by construction; everything else MUST agree.
      // ---------------------------------------------------------------------

      // Layer 1 — metadata.json schema (gobbi-memory Pass 2: v3).
      expect(legacySnap.metadataSchemaVersion).toBe(3);
      expect(freshSnap.metadataSchemaVersion).toBe(3);

      // Layer 2 — state.json schema (Pass-2 reducer state: v4).
      expect(legacySnap.stateSchemaVersion).toBe(4);
      expect(freshSnap.stateSchemaVersion).toBe(4);

      // Layer 3 — gobbi.db schema (Wave C.1.2: v7 — `prompt_patches`
      // workspace-partitioned audit table on top of v6's
      // workspace-partitioned audit + meta tables, on top of the
      // gobbi-memory Pass 2 v5 events columns). `CURRENT_SCHEMA_VERSION`
      // is imported (not hardcoded literal) so a future schema bump
      // localises the failure here rather than scattering bare integers
      // across asserts.
      expect(CURRENT_SCHEMA_VERSION).toBe(7);
      expect(legacySnap.dbColumnsHaveSessionAndProjectId).toBe(true);
      expect(freshSnap.dbColumnsHaveSessionAndProjectId).toBe(true);

      // Layer 4 — workspace settings.json schema (Pass-3 unified: v1).
      expect(legacySnap.workspaceSchemaVersion).toBe(1);
      expect(freshSnap.workspaceSchemaVersion).toBe(1);

      // Bootstrap projects.active matches basename(repoRoot) on both arms.
      // The legacy arm's upgrader wrote a project-level file at
      // .gobbi/projects/gobbi/settings.json; the fresh arm did not. The
      // workspace `projects.active` is the same in both cases because
      // basename(repoRoot) === 'gobbi' for both scratch repos.
      expect(legacySnap.workspaceProjectsActive).toBe('gobbi');
      expect(freshSnap.workspaceProjectsActive).toBe('gobbi');
      expect(legacySnap.workspaceProjectsKnown).toEqual(['gobbi']);
      expect(freshSnap.workspaceProjectsKnown).toEqual(['gobbi']);

      // The legacy-seed run produced a project-level settings.json (T2-v1
      // upgrader output); fresh install did not.
      expect(legacySnap.projectSettingsExists).toBe(true);
      expect(freshSnap.projectSettingsExists).toBe(false);

      // Initial workflow step + evalConfig shape match across arms — the
      // event-store seed (workflow.start + workflow.eval.decide) lands the
      // session in `ideation` with both eval gates wired identically.
      expect(legacySnap.currentStep).toBe('ideation');
      expect(freshSnap.currentStep).toBe('ideation');
      expect(legacySnap.evalConfigKeys).toEqual(freshSnap.evalConfigKeys);

      // ---------------------------------------------------------------------
      // Cascade-resolution invariant — the legacy arm's upgrader wrote the
      // T2-v1 fixture's git/eval values into the project-level file, so
      // `resolveSettings` for the legacy repo must surface them. The fresh
      // arm has no project file, so the same call returns the defaults.
      // This locks the upgrade path through the cascade compose pipeline.
      // ---------------------------------------------------------------------
      const legacyResolved = resolveSettings({ repoRoot: legacyRepo });
      const freshResolved = resolveSettings({ repoRoot: freshRepo });

      // T2-v1 git.{mode,baseBranch} survived the upgrade.
      expect(legacyResolved.git?.workflow?.mode).toBe('worktree-pr');
      expect(legacyResolved.git?.workflow?.baseBranch).toBe('develop');
      // Default arm: no project overlay → default git.workflow.mode.
      expect(freshResolved.git?.workflow?.mode).toBe('direct-commit');

      // T2-v1 eval booleans translated to evaluate.mode enums.
      expect(legacyResolved.workflow?.ideation?.evaluate?.mode).toBe('always');
      expect(legacyResolved.workflow?.planning?.evaluate?.mode).toBe('ask');
      expect(legacyResolved.workflow?.execution?.evaluate?.mode).toBe('always');
    },
  );
});

// ===========================================================================
// XPI-2 — divergence-path probe (issue #138 fix verification)
// ===========================================================================

describe('cross-pass invariant: upgrader resolves project name via init ladder', () => {
  // Originally skipped while issue #138 was open: the T2-v1 upgrader
  // hard-coded `DEFAULT_PROJECT_NAME = 'gobbi'` independently of the
  // `runInit` bootstrap, so when `basename(repoRoot) !== 'gobbi'` the
  // upgraded project-level settings file landed at
  // `.gobbi/projects/gobbi/settings.json` while the active session
  // landed at `.gobbi/projects/<basename>/sessions/<id>/` — orphaning
  // the upgrade. The fix threads the resolved project name from
  // `runInitWithOptions` through `ensureSettingsCascade(repoRoot, name)`
  // so cascade and init agree on the slot by construction. This test
  // locks the seam: the upgrade MUST land at the active project's slot
  // (`my-app`), and the orphan path under `gobbi` MUST NOT exist.
  test(
    'XPI-2: legacy upgrader lands at the resolved active project slot when basename(repoRoot) !== "gobbi"',
    async () => {
      const repo = makeScratchRepoWithDifferentBasename();
      seedLegacyProjectConfig(repo);

      const sessionId = 'xpi-divergence';
      await captureExit(() =>
        runInitWithOptions(
          ['--session-id', sessionId, '--task', 'cross-pass-divergence'],
          { repoRoot: repo },
        ),
      );

      // Active project resolves to basename(repoRoot) — `'my-app'`.
      const myAppActive = JSON.parse(
        readFileSync(join(repo, '.gobbi', 'settings.json'), 'utf8'),
      ) as { readonly projects?: { readonly active?: string } };
      expect(myAppActive.projects?.active).toBe('my-app');

      // The session lives under `projects/my-app/...`.
      expect(
        existsSync(
          join(
            sessionDirForProject(repo, 'my-app', sessionId),
            'metadata.json',
          ),
        ),
      ).toBe(true);

      // Post-fix expectation: the upgrade lands at the active project's
      // slot, and the previously-orphan `projects/gobbi/` slot is
      // empty (never created).
      const orphan = join(
        projectDirForName(repo, 'gobbi'),
        'settings.json',
      );
      const activeProject = join(
        projectDirForName(repo, 'my-app'),
        'settings.json',
      );
      expect(existsSync(orphan)).toBe(false);
      expect(existsSync(activeProject)).toBe(true);

      // The upgraded settings carry the T2-v1 fixture's git workflow
      // mode, confirming the upgrade path actually executed (not merely
      // skipped) — the file at `projects/my-app/settings.json` is the
      // T2-v1 → unified-shape upgrade output, not a fresh-install seed.
      const upgraded = JSON.parse(readFileSync(activeProject, 'utf8')) as {
        readonly git?: { readonly workflow?: { readonly mode?: string } };
      };
      expect(upgraded.git?.workflow?.mode).toBe('worktree-pr');
    },
  );
});
