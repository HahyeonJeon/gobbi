/**
 * Unit tests for the `settings-validator.ts` AJV validator — focused on
 * the PR-FIN-1c reshape (GitSettings reshape + ProjectsRegistry removal).
 *
 * The validator is the single gate for the unified `Settings` shape
 * (workspace / project / session all read through the same AJV
 * validator). Per-field coverage for `workflow.*` and `notify.*` remains
 * in the feature-level tests at `__tests__/features/gobbi-config.test.ts`.
 *
 * Test matrix:
 *
 *   1. DEFAULTS exposes the new GitSettings shape and no `projects` field.
 *   2. Accepts a minimum-shape `{schemaVersion: 1}` document.
 *   3. Rejects unknown top-level keys (e.g. legacy `projects` block).
 *   4. Accepts the new GitSettings shape (`baseBranch`, `issue`, `worktree`,
 *      `branch`, `pr`).
 *   5. Rejects legacy GitSettings keys (`workflow`, `cleanup`, `mode`).
 *   6. `git.pr` accepts `{open, draft}` and rejects extras.
 *   7. `git.baseBranch` accepts string or null.
 *   8. `git.worktree.autoRemove` and `git.branch.autoRemove` accept booleans.
 */

import { describe, expect, test } from 'bun:test';

import { DEFAULTS } from '../settings.js';
import { validateSettings } from '../settings-validator.js';

// ---------------------------------------------------------------------------
// Test 1 — DEFAULTS shape
// ---------------------------------------------------------------------------

describe('settings-validator — DEFAULTS (PR-FIN-1c)', () => {
  test('DEFAULTS does not carry a `projects` registry block', () => {
    // PR-FIN-1c removed `Settings.projects`; the field must not exist on
    // the in-memory defaults either.
    expect((DEFAULTS as unknown as Record<string, unknown>)['projects']).toBeUndefined();
  });

  test('DEFAULTS.git carries the new shape (baseBranch/issue/worktree/branch/pr)', () => {
    expect(DEFAULTS.git).toEqual({
      baseBranch: null,
      issue: { create: false },
      worktree: { autoRemove: true },
      branch: { autoRemove: true },
      pr: { open: true, draft: false },
    });
  });

  test('DEFAULTS validates against the AJV validator', () => {
    expect(validateSettings(DEFAULTS)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 2 — minimum-shape acceptance
// ---------------------------------------------------------------------------

describe('settings-validator — minimum shape (PR-FIN-1c)', () => {
  test('accepts {schemaVersion: 1} (PR-FIN-1c minimum seed)', () => {
    expect(validateSettings({ schemaVersion: 1 })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 3 — unknown top-level keys rejected (legacy `projects`)
// ---------------------------------------------------------------------------

describe('settings-validator — unknown top-level keys (PR-FIN-1c)', () => {
  test('rejects legacy `projects` block (registry was removed)', () => {
    const raw: unknown = {
      schemaVersion: 1,
      projects: { active: 'gobbi', known: ['gobbi'] },
    };
    expect(validateSettings(raw)).toBe(false);
    const errs = validateSettings.errors ?? [];
    expect(
      errs.some((e) => {
        const path = e.instancePath ?? '';
        const msg = e.message ?? '';
        return path === '' && /additional|projects/i.test(msg);
      }),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 4 — new GitSettings shape accepted
// ---------------------------------------------------------------------------

describe('settings-validator — GitSettings new shape (PR-FIN-1c)', () => {
  test('accepts the full new git shape', () => {
    const raw: unknown = {
      schemaVersion: 1,
      git: {
        baseBranch: 'develop',
        issue: { create: true },
        worktree: { autoRemove: false },
        branch: { autoRemove: false },
        pr: { open: true, draft: true },
      },
    };
    expect(validateSettings(raw)).toBe(true);
  });

  test('accepts a partial git block — every sub-key is optional', () => {
    const raw: unknown = {
      schemaVersion: 1,
      git: { pr: { open: false } },
    };
    expect(validateSettings(raw)).toBe(true);
  });

  test('git.baseBranch accepts string', () => {
    const raw: unknown = { schemaVersion: 1, git: { baseBranch: 'main' } };
    expect(validateSettings(raw)).toBe(true);
  });

  test('git.baseBranch accepts null', () => {
    const raw: unknown = { schemaVersion: 1, git: { baseBranch: null } };
    expect(validateSettings(raw)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 5 — legacy git keys rejected (workflow / cleanup / mode)
// ---------------------------------------------------------------------------

describe('settings-validator — legacy git keys rejected (PR-FIN-1c)', () => {
  test('rejects `git.workflow` (Pass-3 nesting)', () => {
    const raw: unknown = {
      schemaVersion: 1,
      git: { workflow: { mode: 'worktree-pr', baseBranch: 'main' } },
    };
    expect(validateSettings(raw)).toBe(false);
  });

  test('rejects `git.cleanup` (replaced by per-concern autoRemove)', () => {
    const raw: unknown = {
      schemaVersion: 1,
      git: { cleanup: { worktree: true, branch: true } },
    };
    expect(validateSettings(raw)).toBe(false);
  });

  test('rejects `git.mode` (T2-v1 location)', () => {
    const raw: unknown = {
      schemaVersion: 1,
      git: { mode: 'worktree-pr' },
    };
    expect(validateSettings(raw)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Test 6 — git.pr accepts {open, draft} and rejects extras
// ---------------------------------------------------------------------------

describe('settings-validator — git.pr keys', () => {
  test('rejects unknown keys under git.pr', () => {
    const raw: unknown = {
      schemaVersion: 1,
      git: { pr: { open: true, draft: false, extra: 'nope' } },
    };
    expect(validateSettings(raw)).toBe(false);
  });

  test('git.pr.open and git.pr.draft are independent', () => {
    expect(validateSettings({ schemaVersion: 1, git: { pr: { open: true } } })).toBe(true);
    expect(validateSettings({ schemaVersion: 1, git: { pr: { draft: true } } })).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 7 — git.issue.create
// ---------------------------------------------------------------------------

describe('settings-validator — git.issue.create', () => {
  test('accepts boolean', () => {
    expect(validateSettings({ schemaVersion: 1, git: { issue: { create: true } } })).toBe(true);
    expect(validateSettings({ schemaVersion: 1, git: { issue: { create: false } } })).toBe(true);
  });

  test('rejects non-boolean', () => {
    expect(validateSettings({ schemaVersion: 1, git: { issue: { create: 'yes' } } })).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Test 8 — autoRemove flags
// ---------------------------------------------------------------------------

describe('settings-validator — autoRemove flags', () => {
  test('git.worktree.autoRemove accepts boolean', () => {
    expect(
      validateSettings({ schemaVersion: 1, git: { worktree: { autoRemove: true } } }),
    ).toBe(true);
  });

  test('git.branch.autoRemove accepts boolean', () => {
    expect(
      validateSettings({ schemaVersion: 1, git: { branch: { autoRemove: false } } }),
    ).toBe(true);
  });

  test('rejects unknown keys under git.worktree', () => {
    expect(
      validateSettings({
        schemaVersion: 1,
        git: { worktree: { autoRemove: true, extra: 1 } },
      }),
    ).toBe(false);
  });
});
