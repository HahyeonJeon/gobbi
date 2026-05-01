/**
 * Unit tests for the unified `Settings` shape — focused on
 * `WorkflowSettings.observability.advancement` (PR-CFM-C T4).
 *
 * The new field gates the `step.advancement.observed` PostToolUse emitter
 * (#197) and is wired in PR-CFM-C T5. This file pins the schema +
 * default + cascade round-trip contract so T5 (and any future emitter
 * gate) can rely on the field landing at every level of the cascade.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { DEFAULTS } from '../settings.js';
import { projectSettingsPath, resolveSettings } from '../settings-io.js';
import { validateSettings } from '../settings-validator.js';

// ---------------------------------------------------------------------------
// Scratch lifecycle — mirrors `settings-io.test.ts` fixture pattern
// ---------------------------------------------------------------------------

let scratchDir: string;

beforeEach(() => {
  scratchDir = mkdtempSync(join(tmpdir(), 'gobbi-settings-'));
});

afterEach(() => {
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

// ---------------------------------------------------------------------------
// workflow.observability.advancement.enabled — PR-CFM-C T4 round-trip
// ---------------------------------------------------------------------------

describe('workflow.observability.advancement.enabled (PR-CFM-C T4)', () => {
  test('schema validates the field as a boolean; default cascade resolves to false; cascade round-trips true', () => {
    // (1) AJV: the new field validates as a boolean at every nesting level.
    expect(
      validateSettings({
        schemaVersion: 1,
        workflow: { observability: { advancement: { enabled: true } } },
      }),
    ).toBe(true);
    expect(
      validateSettings({
        schemaVersion: 1,
        workflow: { observability: { advancement: { enabled: false } } },
      }),
    ).toBe(true);
    // Non-boolean value rejected — confirms the leaf type is locked.
    expect(
      validateSettings({
        schemaVersion: 1,
        workflow: { observability: { advancement: { enabled: 'yes' } } },
      }),
    ).toBe(false);

    // DEFAULTS carries the dormant default explicitly.
    expect(DEFAULTS.workflow?.observability?.advancement?.enabled).toBe(false);

    // (2) Default cascade — no fixture files written — resolves to false.
    const defaultsResolved = resolveSettings({
      repoRoot: scratchDir,
      projectName: 'gobbi',
    });
    expect(defaultsResolved.workflow?.observability?.advancement?.enabled).toBe(false);

    // (3) Project-level overlay flips the gate; cascade round-trips true.
    writeJson(projectSettingsPath(scratchDir, 'gobbi'), {
      schemaVersion: 1,
      workflow: { observability: { advancement: { enabled: true } } },
    });
    const overrideResolved = resolveSettings({
      repoRoot: scratchDir,
      projectName: 'gobbi',
    });
    expect(overrideResolved.workflow?.observability?.advancement?.enabled).toBe(true);
  });
});
