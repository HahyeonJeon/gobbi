/**
 * Unit tests for the PR-FIN-1e agent-shape migration composed inside
 * `upgradeFileInPlace` (`ensure-settings-cascade.ts`).
 *
 * The PR-FIN-1c GitSettings reshape lives in {@link ../__tests__/settings-io.test.ts}
 * (cross-cutting cascade behaviour) and the integration tests; this file
 * narrowly exercises the new agent-shape primitives + their composition
 * inside the existing pipeline.
 *
 * Coverage:
 *
 *   1. `needsAgentShapeUpgrade` returns `true` when `discuss.model` is
 *      present at the legacy flat shape.
 *   2. `needsAgentShapeUpgrade` returns `false` when only the nested
 *      `discuss.agent.model` form is present.
 *   3. `reshapeStepAgentShape` migrates legacy `discuss.{model,effort}`
 *      keys under `discuss.agent.{model,effort}`; `mutated === true`.
 *   4. `reshapeStepAgentShape` resolves legacy-vs-nested conflicts:
 *      nested wins, legacy is dropped, `mutated === true` (because the
 *      legacy keys the user wrote were removed).
 *   5. `ensureSettingsCascade` end-to-end: a workspace fixture with
 *      legacy-shape `discuss` / `evaluate` keys upgrades to the nested
 *      form, the file no longer carries the legacy keys, and the
 *      PR-FIN-1e breadcrumb fires on stderr.
 *   6. Idempotency: a second `ensureSettingsCascade` pass on the same
 *      file does NOT fire the migration breadcrumb and does NOT rewrite
 *      the file (post-state is identical).
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  ensureSettingsCascade,
  needsAgentShapeUpgrade,
  reshapeStepAgentShape,
} from '../ensure-settings-cascade.js';

// ---------------------------------------------------------------------------
// Stderr capture — ensureSettingsCascade writes breadcrumbs via process.stderr.
// ---------------------------------------------------------------------------

let scratchDir: string;
let captured: { stderr: string };
let origStderrWrite: typeof process.stderr.write;

beforeEach(() => {
  scratchDir = mkdtempSync(join(tmpdir(), 'gobbi-ensure-cascade-'));
  captured = { stderr: '' };
  origStderrWrite = process.stderr.write;
  process.stderr.write = ((chunk: string | Uint8Array): boolean => {
    captured.stderr +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stderr.write;
});

afterEach(() => {
  process.stderr.write = origStderrWrite;
  try {
    rmSync(scratchDir, { recursive: true, force: true });
  } catch {
    // best-effort
  }
});

function writeJson(filePath: string, value: unknown): void {
  mkdirSync(join(filePath, '..'), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function readJson(filePath: string): Record<string, unknown> {
  const raw = readFileSync(filePath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error(`expected object at ${filePath}`);
  }
  return parsed as Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Test 1 — needsAgentShapeUpgrade detects legacy `discuss.model`
// ---------------------------------------------------------------------------

describe('needsAgentShapeUpgrade', () => {
  test('returns true when workflow.ideation.discuss.model is present (legacy shape)', () => {
    const parsed = {
      schemaVersion: 1,
      workflow: {
        ideation: {
          discuss: { mode: 'user', model: 'opus' },
        },
      },
    };
    expect(needsAgentShapeUpgrade(parsed)).toBe(true);
  });

  test('returns true when workflow.execution.evaluate.effort is present (legacy shape)', () => {
    const parsed = {
      schemaVersion: 1,
      workflow: {
        execution: {
          evaluate: { mode: 'always', effort: 'high' },
        },
      },
    };
    expect(needsAgentShapeUpgrade(parsed)).toBe(true);
  });

  // Test 2 — nested-only form is the post-migration shape.
  test('returns false when only the nested form is present', () => {
    const parsed = {
      schemaVersion: 1,
      workflow: {
        ideation: {
          discuss: { mode: 'user', agent: { model: 'opus', effort: 'max' } },
          evaluate: { mode: 'always', agent: { model: 'sonnet' } },
        },
        execution: {
          agent: { model: 'haiku' },
          evaluate: { mode: 'always', agent: { model: 'sonnet' } },
        },
      },
    };
    expect(needsAgentShapeUpgrade(parsed)).toBe(false);
  });

  test('returns false on a minimum-shape document', () => {
    expect(needsAgentShapeUpgrade({ schemaVersion: 1 })).toBe(false);
    expect(needsAgentShapeUpgrade({ schemaVersion: 1, workflow: {} })).toBe(false);
  });

  test('returns false on non-record input', () => {
    expect(needsAgentShapeUpgrade(null)).toBe(false);
    expect(needsAgentShapeUpgrade(42)).toBe(false);
    expect(needsAgentShapeUpgrade('string')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Test 3 — reshapeStepAgentShape moves legacy keys under agent.*
// ---------------------------------------------------------------------------

describe('reshapeStepAgentShape', () => {
  test('migrates legacy discuss.{model, effort} → discuss.agent.{model, effort}', () => {
    const stepCfg = {
      discuss: { mode: 'user', model: 'opus', effort: 'max' },
      evaluate: { mode: 'always', model: 'sonnet', effort: 'high' },
    };
    const { out, mutated } = reshapeStepAgentShape(stepCfg);
    expect(mutated).toBe(true);
    expect(out).toEqual({
      discuss: { mode: 'user', agent: { model: 'opus', effort: 'max' } },
      evaluate: { mode: 'always', agent: { model: 'sonnet', effort: 'high' } },
    });
    // Negative — legacy keys must be gone from the post-state.
    const discussOut = (out as { discuss?: Record<string, unknown> }).discuss;
    expect(discussOut !== undefined && 'model' in discussOut).toBe(false);
    expect(discussOut !== undefined && 'effort' in discussOut).toBe(false);
  });

  // Test 4 — conflict resolution: nested wins, legacy dropped, mutated=true.
  test('legacy + nested conflict — nested wins, legacy dropped, mutated stays true', () => {
    const stepCfg = {
      discuss: {
        mode: 'user',
        model: 'opus', // legacy
        effort: 'max', // legacy
        agent: { model: 'haiku', effort: 'low' }, // nested wins
      },
    };
    const { out, mutated } = reshapeStepAgentShape(stepCfg);
    expect(mutated).toBe(true);
    expect(out).toEqual({
      discuss: { mode: 'user', agent: { model: 'haiku', effort: 'low' } },
    });
  });

  test('returns mutated=false when no legacy keys are present (idempotent shape)', () => {
    const stepCfg = {
      discuss: { mode: 'user', agent: { model: 'opus', effort: 'max' } },
      agent: { model: 'auto' },
      evaluate: { mode: 'always', agent: { model: 'sonnet' } },
      maxIterations: 3,
    } as const;
    const { out, mutated } = reshapeStepAgentShape(stepCfg);
    expect(mutated).toBe(false);
    expect(out).toEqual(stepCfg);
  });

  test('carries net-new step-wide agent slot and maxIterations verbatim', () => {
    const stepCfg = {
      discuss: { mode: 'user', model: 'opus' }, // legacy → triggers mutation
      agent: { model: 'haiku', effort: 'high' }, // net-new, carry verbatim
      maxIterations: 7,
    };
    const { out, mutated } = reshapeStepAgentShape(stepCfg);
    expect(mutated).toBe(true);
    expect(out).toEqual({
      discuss: { mode: 'user', agent: { model: 'opus' } },
      agent: { model: 'haiku', effort: 'high' },
      maxIterations: 7,
    });
  });
});

// ---------------------------------------------------------------------------
// Test 5 — end-to-end ensureSettingsCascade upgrades + breadcrumb fires
// ---------------------------------------------------------------------------

describe('ensureSettingsCascade — agent-shape end-to-end (PR-FIN-1e)', () => {
  test('legacy-shape workspace settings file upgrades to nested form + breadcrumb', async () => {
    const workspacePath = join(scratchDir, '.gobbi', 'settings.json');
    writeJson(workspacePath, {
      schemaVersion: 1,
      workflow: {
        ideation: {
          discuss: { mode: 'user', model: 'opus', effort: 'max' },
          evaluate: { mode: 'always', model: 'sonnet' },
        },
        execution: {
          discuss: { mode: 'agent', model: 'haiku' },
        },
      },
    });

    await ensureSettingsCascade(scratchDir, 'gobbi');

    // Post-state — file reshaped into nested form, no legacy keys.
    const post = readJson(workspacePath);
    expect(post).toEqual({
      schemaVersion: 1,
      workflow: {
        ideation: {
          discuss: { mode: 'user', agent: { model: 'opus', effort: 'max' } },
          evaluate: { mode: 'always', agent: { model: 'sonnet' } },
        },
        execution: {
          discuss: { mode: 'agent', agent: { model: 'haiku' } },
        },
      },
    });

    // Breadcrumb format: literal "agent fields → PR-FIN-1e shape" line.
    expect(captured.stderr).toContain(
      'migrated .gobbi/settings.json agent fields → PR-FIN-1e shape',
    );
    // PR-FIN-1c breadcrumb must NOT fire — there is no legacy git/projects
    // payload in this fixture, so the GitSettings reshape gate stays clean.
    expect(captured.stderr).not.toContain('→ PR-FIN-1c shape');
  });

  test('project-level legacy-shape file upgrades + breadcrumb names the project path', async () => {
    const projectPath = join(
      scratchDir,
      '.gobbi',
      'projects',
      'gobbi',
      'settings.json',
    );
    writeJson(projectPath, {
      schemaVersion: 1,
      workflow: {
        planning: {
          evaluate: { mode: 'ask', model: 'sonnet', effort: 'medium' },
        },
      },
    });

    await ensureSettingsCascade(scratchDir, 'gobbi');

    const post = readJson(projectPath);
    expect(post).toEqual({
      schemaVersion: 1,
      workflow: {
        planning: {
          evaluate: { mode: 'ask', agent: { model: 'sonnet', effort: 'medium' } },
        },
      },
    });
    expect(captured.stderr).toContain(
      'migrated .gobbi/projects/gobbi/settings.json agent fields → PR-FIN-1e shape',
    );
  });

  // Test 6 — idempotency on second pass.
  test('second pass produces no breadcrumb and no rewrite (idempotent)', async () => {
    const workspacePath = join(scratchDir, '.gobbi', 'settings.json');
    writeJson(workspacePath, {
      schemaVersion: 1,
      workflow: {
        execution: {
          discuss: { mode: 'agent', model: 'haiku', effort: 'low' },
        },
      },
    });

    // First pass — runs the migration.
    await ensureSettingsCascade(scratchDir, 'gobbi');
    expect(captured.stderr).toContain(
      'migrated .gobbi/settings.json agent fields → PR-FIN-1e shape',
    );
    const firstPassMtimeNs = statSync(workspacePath).mtimeMs;
    const firstPassContents = readFileSync(workspacePath, 'utf8');

    // Reset stderr capture for the second pass and force a measurable
    // mtime gap so any accidental rewrite would be observable.
    captured.stderr = '';
    await new Promise<void>((resolve) => setTimeout(resolve, 25));

    // Second pass — file is already migrated; no breadcrumb should fire.
    await ensureSettingsCascade(scratchDir, 'gobbi');
    expect(captured.stderr).not.toContain('PR-FIN-1e shape');
    expect(captured.stderr).not.toContain('PR-FIN-1c shape');

    // File contents identical, mtime unchanged — no rewrite happened.
    expect(readFileSync(workspacePath, 'utf8')).toBe(firstPassContents);
    expect(statSync(workspacePath).mtimeMs).toBe(firstPassMtimeNs);
  });
});
