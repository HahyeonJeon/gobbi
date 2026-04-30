/**
 * End-to-end coverage of the Q2 → evalConfig translation chain (Wave D.2).
 *
 * The `/gobbi` setup skill's FIFTH-step Q2 persists the user's evaluation
 * preference per workflow step as one of four modes: `'always'` / `'skip'` /
 * `'ask'` / `'auto'`. The chain of transformations at runtime is:
 *
 *   1. `gobbi config set workflow.<step>.evaluate.mode <mode>` writes the
 *      enum into the session-level `settings.json`.
 *   2. `resolveSettings({repoRoot, sessionId})` returns the cascade-composed
 *      value with the enum preserved at the narrower level.
 *   3. `resolveEvalDecision(cascade, step, context?)` translates the enum
 *      into a boolean (`{enabled, source}`). `'ask'` / `'auto'` require a
 *      context parameter; `'always'` / `'skip'` don't.
 *   4. The boolean is carried on an `EVAL_DECIDE` event and the reducer
 *      lands it in `state.evalConfig.{ideation,plan,execution}`.
 *
 * This file covers all 4 Q2 options × 3 workflow steps (12 resolveEvalDecision
 * cases) plus 2 full end-to-end reducer round-trips and 1 default-when-missing
 * case for 15 tests total.
 *
 * Env hygiene: `CLAUDE_SESSION_ID` / `CLAUDE_PROJECT_DIR` are set explicitly
 * in `beforeEach` and restored in `afterEach`.
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { sessionDir as sessionDirForProject } from '../../lib/workspace-paths.js';

// PR-FIN-1c: `runConfig set --level session` resolves the project name to
// `basename(repoRoot)` when no `--project` flag is supplied. The scratch
// repo's basename is dynamic (mkdtempSync), so paths are constructed at
// runtime via `basename(repo)`.

// Mock `lib/repo.ts::getRepoRoot` to read from a `globalThis` pointer
// this file owns during its test run. Same strategy as the sibling
// feature test `gobbi-config.test.ts` — module-level memoization in
// `repo.ts` survives across test files in a single `bun test`
// invocation, so every feature file that writes under a tmp repo must
// install this pointer. The fallback branch preserves real-git
// behaviour for sibling test files that do not install a pointer.
interface ScratchState {
  readonly root: string | null;
}
const GLOBAL_KEY = '__gobbiConfigScratchRoot__';
function setGlobalScratch(root: string | null): void {
  (globalThis as unknown as Record<string, ScratchState>)[GLOBAL_KEY] = { root };
}
function getGlobalScratch(): string | null {
  const entry = (globalThis as unknown as Record<string, ScratchState | undefined>)[GLOBAL_KEY];
  return entry?.root ?? null;
}
mock.module('../../lib/repo.js', () => ({
  getRepoRoot: () => {
    const scratch = getGlobalScratch();
    if (scratch !== null) return scratch;
    try {
      return execSync('git rev-parse --show-toplevel', {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();
    } catch {
      return process.cwd();
    }
  },
  getClaudeDir: () => {
    const scratch = getGlobalScratch();
    const root = scratch ?? (() => {
      try {
        return execSync('git rev-parse --show-toplevel', {
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
      } catch {
        return process.cwd();
      }
    })();
    return join(root, '.claude');
  },
}));

import { runConfig } from '../../commands/config.js';
import {
  resolveEvalDecision,
  resolveSettings,
} from '../../lib/settings-io.js';
import { initialState } from '../../workflow/state-derivation.js';
import { reduce } from '../../workflow/reducer.js';
import { WORKFLOW_EVENTS } from '../../workflow/events/workflow.js';
import type { Event } from '../../workflow/events/index.js';

// ---------------------------------------------------------------------------
// stdout / stderr / exit capture — mirrors gobbi-config.test.ts pattern.
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

function resetCapture(): void {
  captured = { stdout: '', stderr: '', exitCode: null };
}

// ---------------------------------------------------------------------------
// Shared scratch repo — same pattern as gobbi-config.test.ts.
// `lib/repo.ts::getRepoRoot` is memoized; one repo per file, rm `.gobbi/`
// between tests.
// ---------------------------------------------------------------------------

let scratchRepo: string | null = null;
let origCwd: string | null = null;
const ORIG_ENV_SESSION_ID = process.env['CLAUDE_SESSION_ID'];
const ORIG_ENV_PROJECT_DIR = process.env['CLAUDE_PROJECT_DIR'];

beforeAll(() => {
  origCwd = process.cwd();
  scratchRepo = mkdtempSync(join(tmpdir(), 'gobbi-q2-e2e-'));
  execSync('git init -q', { cwd: scratchRepo });
  process.chdir(scratchRepo);
  setGlobalScratch(scratchRepo);
});

afterAll(() => {
  setGlobalScratch(null);
  if (origCwd !== null) {
    try {
      process.chdir(origCwd);
    } catch {
      // best-effort
    }
  }
  if (scratchRepo !== null) {
    try {
      rmSync(scratchRepo, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  }
});

function makeScratchRepo(): string {
  if (scratchRepo === null) {
    throw new Error('beforeAll did not initialise scratchRepo');
  }
  const gobbiDir = join(scratchRepo, '.gobbi');
  if (existsSync(gobbiDir)) {
    rmSync(gobbiDir, { recursive: true, force: true });
  }
  if (process.cwd() !== scratchRepo) {
    process.chdir(scratchRepo);
  }
  setGlobalScratch(scratchRepo);
  return scratchRepo;
}

beforeEach(() => {
  resetCapture();
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
// Helper — persist a mode through the CLI + read it back through resolveSettings.
// ---------------------------------------------------------------------------

type Step = 'ideation' | 'planning' | 'execution' | 'memorization';
type Mode = 'always' | 'skip' | 'ask' | 'auto';

async function persistAndReadBack(
  repo: string,
  sessionId: string,
  step: Step,
  mode: Mode,
): Promise<Mode> {
  await captureExit(async () => {
    await runConfig([
      'set',
      `workflow.${step}.evaluate.mode`,
      mode,
      '--level',
      'session',
      '--session-id',
      sessionId,
    ]);
  });
  if (captured.exitCode !== null) {
    throw new Error(
      `gobbi config set failed: exit=${captured.exitCode} stderr=${captured.stderr}`,
    );
  }

  // On-disk verification — the session settings file should carry the enum.
  // PR-FIN-1c: sessions live under `.gobbi/projects/<basename(repo)>/sessions/<id>/`.
  const filePath = join(
    sessionDirForProject(repo, basename(repo), sessionId),
    'settings.json',
  );
  expect(existsSync(filePath)).toBe(true);
  const onDisk = JSON.parse(readFileSync(filePath, 'utf8')) as {
    readonly workflow?: {
      readonly ideation?: { readonly evaluate?: { readonly mode?: Mode } };
      readonly planning?: { readonly evaluate?: { readonly mode?: Mode } };
      readonly execution?: { readonly evaluate?: { readonly mode?: Mode } };
      readonly memorization?: { readonly evaluate?: { readonly mode?: Mode } };
    };
  };
  const persisted = onDisk.workflow?.[step]?.evaluate?.mode;
  expect(persisted).toBe(mode);

  // resolveSettings surfaces the narrower-level override.
  const resolved = resolveSettings({ repoRoot: repo, sessionId });
  const resolvedMode = resolved.workflow?.[step]?.evaluate?.mode;
  expect(resolvedMode).toBe(mode);

  return mode;
}

// ===========================================================================
// 4 × 3 matrix — one `test()` per Q2-option × workflow-step combination
// so the grep gate (`grep -c 'test(\|it('`) sees every case explicitly and
// failing-test output names the exact combination.
// ===========================================================================

// --- `always` × {ideation, planning, execution} ----------------------------

describe("Q2 'always' — evaluator runs unconditionally", () => {
  test("always + ideation → {enabled: true, source: 'always'}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-always-ideation';
    await persistAndReadBack(repo, sessionId, 'ideation', 'always');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const decision = resolveEvalDecision(cascade, 'ideation');
    expect(decision).toEqual({ enabled: true, source: 'always' });
  });

  test("always + planning → {enabled: true, source: 'always'}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-always-plan';
    await persistAndReadBack(repo, sessionId, 'planning', 'always');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const decision = resolveEvalDecision(cascade, 'planning');
    expect(decision).toEqual({ enabled: true, source: 'always' });
  });

  test("always + execution → {enabled: true, source: 'always'}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-always-execution';
    await persistAndReadBack(repo, sessionId, 'execution', 'always');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const decision = resolveEvalDecision(cascade, 'execution');
    expect(decision).toEqual({ enabled: true, source: 'always' });
  });
});

// --- `skip` × {ideation, planning, execution} ------------------------------

describe("Q2 'skip' — evaluator is never invoked", () => {
  test("skip + ideation → {enabled: false, source: 'skip'}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-skip-ideation';
    await persistAndReadBack(repo, sessionId, 'ideation', 'skip');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const decision = resolveEvalDecision(cascade, 'ideation');
    expect(decision).toEqual({ enabled: false, source: 'skip' });
  });

  test("skip + planning → {enabled: false, source: 'skip'}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-skip-plan';
    await persistAndReadBack(repo, sessionId, 'planning', 'skip');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const decision = resolveEvalDecision(cascade, 'planning');
    expect(decision).toEqual({ enabled: false, source: 'skip' });
  });

  test("skip + execution → {enabled: false, source: 'skip'}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-skip-execution';
    await persistAndReadBack(repo, sessionId, 'execution', 'skip');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const decision = resolveEvalDecision(cascade, 'execution');
    expect(decision).toEqual({ enabled: false, source: 'skip' });
  });
});

// --- `ask` × {ideation, planning, execution} -------------------------------
//
// `ask` requires a user answer to be supplied via context. The translation
// helper intentionally throws when context is missing — emitting a boolean
// without the user's explicit answer would misrepresent user intent.

describe("Q2 'ask' — user answer supplied via context; missing context throws", () => {
  test("ask + ideation → {enabled: userAnswer, source: 'ask'} and throws when context absent", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-ask-ideation';
    await persistAndReadBack(repo, sessionId, 'ideation', 'ask');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    expect(resolveEvalDecision(cascade, 'ideation', { userAnswer: true })).toEqual({
      enabled: true,
      source: 'ask',
    });
    expect(resolveEvalDecision(cascade, 'ideation', { userAnswer: false })).toEqual({
      enabled: false,
      source: 'ask',
    });
    expect(() => resolveEvalDecision(cascade, 'ideation')).toThrow(
      /eval mode "ask" at step ideation requires context\.userAnswer/,
    );
  });

  test("ask + planning → {enabled: userAnswer, source: 'ask'} and throws when context absent", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-ask-plan';
    await persistAndReadBack(repo, sessionId, 'planning', 'ask');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    expect(resolveEvalDecision(cascade, 'planning', { userAnswer: true })).toEqual({
      enabled: true,
      source: 'ask',
    });
    expect(resolveEvalDecision(cascade, 'planning', { userAnswer: false })).toEqual({
      enabled: false,
      source: 'ask',
    });
    expect(() => resolveEvalDecision(cascade, 'planning')).toThrow(
      /eval mode "ask" at step planning requires context\.userAnswer/,
    );
  });

  test("ask + execution → {enabled: userAnswer, source: 'ask'} and throws when context absent", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-ask-execution';
    await persistAndReadBack(repo, sessionId, 'execution', 'ask');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    expect(resolveEvalDecision(cascade, 'execution', { userAnswer: true })).toEqual({
      enabled: true,
      source: 'ask',
    });
    expect(resolveEvalDecision(cascade, 'execution', { userAnswer: false })).toEqual({
      enabled: false,
      source: 'ask',
    });
    expect(() => resolveEvalDecision(cascade, 'execution')).toThrow(
      /eval mode "ask" at step execution requires context\.userAnswer/,
    );
  });
});

// --- `auto` × {ideation, planning, execution} ------------------------------
//
// `auto` defers to the orchestrator. The helper insists the caller pass the
// orchestrator's decision through context — symmetric discipline with `ask`.

describe("Q2 'auto' — orchestrator decision supplied via context; missing context throws", () => {
  test("auto + ideation → {enabled: orchestratorDecision, source: 'auto'} and throws when context absent", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-auto-ideation';
    await persistAndReadBack(repo, sessionId, 'ideation', 'auto');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    expect(
      resolveEvalDecision(cascade, 'ideation', { orchestratorDecision: true }),
    ).toEqual({ enabled: true, source: 'auto' });
    expect(
      resolveEvalDecision(cascade, 'ideation', { orchestratorDecision: false }),
    ).toEqual({ enabled: false, source: 'auto' });
    expect(() => resolveEvalDecision(cascade, 'ideation')).toThrow(
      /eval mode "auto" at step ideation requires context\.orchestratorDecision/,
    );
  });

  test("auto + planning → {enabled: orchestratorDecision, source: 'auto'} and throws when context absent", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-auto-plan';
    await persistAndReadBack(repo, sessionId, 'planning', 'auto');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    expect(
      resolveEvalDecision(cascade, 'planning', { orchestratorDecision: true }),
    ).toEqual({ enabled: true, source: 'auto' });
    expect(
      resolveEvalDecision(cascade, 'planning', { orchestratorDecision: false }),
    ).toEqual({ enabled: false, source: 'auto' });
    expect(() => resolveEvalDecision(cascade, 'planning')).toThrow(
      /eval mode "auto" at step planning requires context\.orchestratorDecision/,
    );
  });

  test("auto + execution → {enabled: orchestratorDecision, source: 'auto'} and throws when context absent", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-auto-execution';
    await persistAndReadBack(repo, sessionId, 'execution', 'auto');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    expect(
      resolveEvalDecision(cascade, 'execution', { orchestratorDecision: true }),
    ).toEqual({ enabled: true, source: 'auto' });
    expect(
      resolveEvalDecision(cascade, 'execution', { orchestratorDecision: false }),
    ).toEqual({ enabled: false, source: 'auto' });
    expect(() => resolveEvalDecision(cascade, 'execution')).toThrow(
      /eval mode "auto" at step execution requires context\.orchestratorDecision/,
    );
  });
});

// ===========================================================================
// Default-when-missing — no level sets the mode, cascade composes DEFAULTS
// ===========================================================================

describe("resolveEvalDecision default — no user override falls through to DEFAULTS", () => {
  test("no workspace/project/session for any step → cascade reaches DEFAULTS, every step is 'always'", () => {
    const repo = makeScratchRepo();
    // No session-level file; cascade composes DEFAULTS only.
    const cascade = resolveSettings({ repoRoot: repo });
    // DEFAULTS ships `evaluate.mode: 'always'` for all three steps. After
    // `resolveSettings` merges, the cascade carries that exact enum — the
    // translation helper sees `mode === 'always'` and returns source:
    // 'always' (NOT source: 'default', which is reserved for the case
    // where no default maps either — a future-proofing branch that does
    // not fire today).
    for (const step of ['ideation', 'planning', 'execution'] as const) {
      const decision = resolveEvalDecision(cascade, step);
      expect(decision.enabled).toBe(true);
      expect(decision.source).toBe('always');
    }
  });
});

// ===========================================================================
// Full end-to-end through the reducer — 2 cases cover the EVAL_DECIDE path.
// ===========================================================================
//
// Goes beyond `resolveEvalDecision` and emits an EVAL_DECIDE event carrying
// the helper's output. Asserts the reducer lands the boolean in
// `state.evalConfig.{step}` via the additive `execution` slot introduced in
// Wave C.2 (plus the legacy `ideation` / `plan` slots).

describe("Full e2e — EVAL_DECIDE event lands in state.evalConfig via reducer", () => {
  test("always + always + always → reducer records {ideation:true, plan:true, execution:true}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-e2e-always';
    await persistAndReadBack(repo, sessionId, 'ideation', 'always');
    await persistAndReadBack(repo, sessionId, 'planning', 'always');
    await persistAndReadBack(repo, sessionId, 'execution', 'always');

    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const ideationDecision = resolveEvalDecision(cascade, 'ideation');
    const planDecision = resolveEvalDecision(cascade, 'planning');
    const executionDecision = resolveEvalDecision(cascade, 'execution');

    const evalEvent: Event = {
      type: WORKFLOW_EVENTS.EVAL_DECIDE,
      data: {
        ideation: ideationDecision.enabled,
        plan: planDecision.enabled,
        execution: executionDecision.enabled,
      },
    };

    const state = initialState(sessionId);
    const result = reduce(state, evalEvent);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.evalConfig).toEqual({
      ideation: true,
      planning: true,
      execution: true,
    });
  });

  test("ask(false) + auto(true) + skip → reducer records {ideation:false, plan:true, execution:false}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-e2e-mixed';
    await persistAndReadBack(repo, sessionId, 'ideation', 'ask');
    await persistAndReadBack(repo, sessionId, 'planning', 'auto');
    await persistAndReadBack(repo, sessionId, 'execution', 'skip');

    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const ideationDecision = resolveEvalDecision(cascade, 'ideation', {
      userAnswer: false,
    });
    const planDecision = resolveEvalDecision(cascade, 'planning', {
      orchestratorDecision: true,
    });
    const executionDecision = resolveEvalDecision(cascade, 'execution');

    expect(ideationDecision).toEqual({ enabled: false, source: 'ask' });
    expect(planDecision).toEqual({ enabled: true, source: 'auto' });
    expect(executionDecision).toEqual({ enabled: false, source: 'skip' });

    const evalEvent: Event = {
      type: WORKFLOW_EVENTS.EVAL_DECIDE,
      data: {
        ideation: ideationDecision.enabled,
        plan: planDecision.enabled,
        execution: executionDecision.enabled,
      },
    };

    const state = initialState(sessionId);
    const result = reduce(state, evalEvent);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.evalConfig).toEqual({
      ideation: false,
      planning: true,
      execution: false,
    });
  });
});

// ===========================================================================
// PR-FIN-2a-i T-2a.7 — memorization step coverage
// ===========================================================================
//
// Mirrors the existing 4-mode × 3-step matrix for the new memorization step.
// Validates that:
//
//   1. `gobbi config set workflow.memorization.evaluate.mode <mode>` is
//      accepted by the AJV validator and persists to disk.
//   2. `resolveEvalDecision(cascade, 'memorization', context?)` translates
//      every Q2 mode identically to the other three steps.
//   3. The translated boolean lands in `state.evalConfig.memorization`
//      after the EVAL_DECIDE event reduces.

describe("Q2 'always' — memorization (T-2a.7)", () => {
  test("always + memorization → {enabled: true, source: 'always'}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-always-memorization';
    await persistAndReadBack(repo, sessionId, 'memorization', 'always');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const decision = resolveEvalDecision(cascade, 'memorization');
    expect(decision).toEqual({ enabled: true, source: 'always' });
  });
});

describe("Q2 'skip' — memorization (T-2a.7)", () => {
  test("skip + memorization → {enabled: false, source: 'skip'}", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-skip-memorization';
    await persistAndReadBack(repo, sessionId, 'memorization', 'skip');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const decision = resolveEvalDecision(cascade, 'memorization');
    expect(decision).toEqual({ enabled: false, source: 'skip' });
  });
});

describe("Q2 'ask' — memorization (T-2a.7)", () => {
  test("ask + memorization honours userAnswer; throws when context absent", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-ask-memorization';
    await persistAndReadBack(repo, sessionId, 'memorization', 'ask');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    expect(
      resolveEvalDecision(cascade, 'memorization', { userAnswer: true }),
    ).toEqual({ enabled: true, source: 'ask' });
    expect(
      resolveEvalDecision(cascade, 'memorization', { userAnswer: false }),
    ).toEqual({ enabled: false, source: 'ask' });
    expect(() => resolveEvalDecision(cascade, 'memorization')).toThrow(
      /eval mode "ask" at step memorization requires context\.userAnswer/,
    );
  });
});

describe("Q2 'auto' — memorization (T-2a.7)", () => {
  test("auto + memorization honours orchestratorDecision; throws when context absent", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-auto-memorization';
    await persistAndReadBack(repo, sessionId, 'memorization', 'auto');
    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    expect(
      resolveEvalDecision(cascade, 'memorization', { orchestratorDecision: true }),
    ).toEqual({ enabled: true, source: 'auto' });
    expect(
      resolveEvalDecision(cascade, 'memorization', { orchestratorDecision: false }),
    ).toEqual({ enabled: false, source: 'auto' });
    expect(() => resolveEvalDecision(cascade, 'memorization')).toThrow(
      /eval mode "auto" at step memorization requires context\.orchestratorDecision/,
    );
  });
});

describe("Full e2e — memorization slot lands via reducer (T-2a.7)", () => {
  test("always memorization → reducer records evalConfig.memorization=true", async () => {
    const repo = makeScratchRepo();
    const sessionId = 'q2-e2e-memorization';
    await persistAndReadBack(repo, sessionId, 'memorization', 'always');

    const cascade = resolveSettings({ repoRoot: repo, sessionId });
    const memorizationDecision = resolveEvalDecision(cascade, 'memorization');
    expect(memorizationDecision).toEqual({ enabled: true, source: 'always' });

    const evalEvent: Event = {
      type: WORKFLOW_EVENTS.EVAL_DECIDE,
      data: {
        ideation: false,
        plan: false,
        memorization: memorizationDecision.enabled,
      },
    };

    const state = initialState(sessionId);
    const result = reduce(state, evalEvent);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.evalConfig).toEqual({
      ideation: false,
      planning: false,
      memorization: true,
    });
  });
});
