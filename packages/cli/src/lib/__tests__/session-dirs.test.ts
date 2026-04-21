/**
 * Unit tests for `lib/session-dirs.ts::ensureSessionStepDir`.
 *
 * Coverage:
 *   - Creates both the `<step>/` subdir and its `<step>/rawdata/` child.
 *   - Returns the step directory path (not the `rawdata/` path).
 *   - Idempotent — second call does not throw; both dirs still exist.
 *   - Works for every `StepId` value — `ideation`, `plan`, `execution`,
 *     `evaluation`, `memorization`.
 *
 * Uses `mkdtempSync` for scratch isolation per `project-config.test.ts`
 * convention — no touch to the real checkout's `.gobbi/` tree.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ensureSessionStepDir } from '../session-dirs.js';
import type { StepId } from '../../specs/artifact-selector.js';

// ---------------------------------------------------------------------------
// Scratch lifecycle
// ---------------------------------------------------------------------------

let scratchDir: string;

beforeEach(() => {
  scratchDir = mkdtempSync(join(tmpdir(), 'gobbi-session-dirs-'));
});

afterEach(() => {
  try {
    rmSync(scratchDir, { recursive: true, force: true });
  } catch {
    // best-effort
  }
});

// ---------------------------------------------------------------------------
// Core behaviour
// ---------------------------------------------------------------------------

describe('ensureSessionStepDir', () => {
  test('creates step dir and rawdata subdir', () => {
    ensureSessionStepDir(scratchDir, 'ideation');

    const stepPath = join(scratchDir, 'ideation');
    const rawdataPath = join(stepPath, 'rawdata');
    expect(existsSync(stepPath)).toBe(true);
    expect(existsSync(rawdataPath)).toBe(true);
    expect(statSync(stepPath).isDirectory()).toBe(true);
    expect(statSync(rawdataPath).isDirectory()).toBe(true);
  });

  test('returns the step path', () => {
    const returned = ensureSessionStepDir(scratchDir, 'plan');
    expect(returned).toBe(join(scratchDir, 'plan'));
  });

  test('idempotent when called twice', () => {
    ensureSessionStepDir(scratchDir, 'execution');
    // Second call must not throw — `mkdirSync({ recursive: true })` is a
    // no-op on existing dirs.
    expect(() => ensureSessionStepDir(scratchDir, 'execution')).not.toThrow();

    const stepPath = join(scratchDir, 'execution');
    const rawdataPath = join(stepPath, 'rawdata');
    expect(existsSync(stepPath)).toBe(true);
    expect(existsSync(rawdataPath)).toBe(true);
  });

  // ---------------------------------------------------------------------------
  // Parameterised — every StepId value
  // ---------------------------------------------------------------------------

  const ALL_STEPS: readonly StepId[] = [
    'ideation',
    'plan',
    'execution',
    'evaluation',
    'memorization',
  ];

  for (const step of ALL_STEPS) {
    test(`works for StepId value "${step}"`, () => {
      const returned = ensureSessionStepDir(scratchDir, step);
      expect(returned).toBe(join(scratchDir, step));
      expect(existsSync(join(scratchDir, step))).toBe(true);
      expect(existsSync(join(scratchDir, step, 'rawdata'))).toBe(true);
    });
  }
});
