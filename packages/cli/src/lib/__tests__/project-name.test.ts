/**
 * Unit tests for `lib/project-name.ts` — `validateProjectName` and the
 * argv-shell sugar `assertValidProjectNameOrExit`.
 *
 * Layout:
 *   - 12 cases migrated verbatim from `commands/project/__tests__/create.test.ts`
 *     (the original home of the validator). Behaviour is preserved
 *     bit-for-bit; the cap and traversal cases below are net-new.
 *   - 2 length-cap boundary cases (PR-CFM-D L10 — `≤64 characters`).
 *   - 3 traversal regression anchors that lock the path-separator
 *     rejection behaviour against future pattern loosening.
 *   - 2 helper cases: valid name → returns void with no exit/no stderr;
 *     invalid name → `process.exit(2)` + L13 stderr template.
 *
 * Total: 19 cases.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

import {
  assertValidProjectNameOrExit,
  validateProjectName,
} from '../project-name.js';

// ---------------------------------------------------------------------------
// stdout/stderr + exit capture (lifted from
// `commands/project/__tests__/create.test.ts:43-101`)
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
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.stderr.write = origStderrWrite;
  process.exit = origExit;
});

function captureExit(fn: () => void): void {
  try {
    fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

// ===========================================================================
// validateProjectName — 12 migrated cases
// ===========================================================================

describe('validateProjectName', () => {
  test('accepts lowercase letters', () => {
    expect(validateProjectName('gobbi').ok).toBe(true);
  });
  test('accepts letters + digits + hyphens', () => {
    expect(validateProjectName('my-project-2').ok).toBe(true);
  });
  test('accepts single-character names', () => {
    expect(validateProjectName('a').ok).toBe(true);
  });
  test('rejects empty string', () => {
    expect(validateProjectName('').ok).toBe(false);
  });
  test('rejects uppercase', () => {
    expect(validateProjectName('Foo').ok).toBe(false);
  });
  test('rejects underscores', () => {
    expect(validateProjectName('foo_bar').ok).toBe(false);
  });
  test('rejects dots', () => {
    expect(validateProjectName('foo.bar').ok).toBe(false);
  });
  test('rejects path separators', () => {
    expect(validateProjectName('foo/bar').ok).toBe(false);
    expect(validateProjectName('foo\\bar').ok).toBe(false);
  });
  test('rejects leading hyphen', () => {
    expect(validateProjectName('-foo').ok).toBe(false);
  });
  test('rejects trailing hyphen', () => {
    expect(validateProjectName('foo-').ok).toBe(false);
  });
  test('rejects reserved . and ..', () => {
    expect(validateProjectName('.').ok).toBe(false);
    expect(validateProjectName('..').ok).toBe(false);
  });
  test('rejects whitespace-only', () => {
    expect(validateProjectName(' ').ok).toBe(false);
  });
});

// ===========================================================================
// validateProjectName — length cap (PR-CFM-D L10)
// ===========================================================================

describe('validateProjectName length cap', () => {
  test('accepts exactly 64 characters', () => {
    const name = 'a'.repeat(64);
    expect(validateProjectName(name).ok).toBe(true);
  });
  test('rejects 65 characters with ≤64 reason', () => {
    const name = 'a'.repeat(65);
    const result = validateProjectName(name);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toMatch(/≤64 characters/);
    }
  });
});

// ===========================================================================
// validateProjectName — traversal regression anchors
// ===========================================================================

describe('validateProjectName traversal anchors', () => {
  test.each([['../tmp'], ['../../escape'], ['..\\evil']])(
    'rejects traversal payload %p',
    (input) => {
      const result = validateProjectName(input);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        // Pattern-rejection text — locks the diagnostic so payloads do
        // not slip through future pattern relaxations.
        expect(result.reason).toMatch(
          /lowercase letters, digits, and hyphens only/,
        );
      }
    },
  );
});

// ===========================================================================
// assertValidProjectNameOrExit — argv-shell helper
// ===========================================================================

describe('assertValidProjectNameOrExit', () => {
  test('valid name → returns void, no exit, no stderr', () => {
    captureExit(() => assertValidProjectNameOrExit('my-project', 'gobbi test'));
    expect(captured.exitCode).toBeNull();
    expect(captured.stderr).toBe('');
  });
  test('invalid name → process.exit(2) + L13 stderr template', () => {
    captureExit(() => assertValidProjectNameOrExit('../tmp', 'gobbi test'));
    expect(captured.exitCode).toBe(2);
    expect(captured.stderr).toMatch(
      /^gobbi test: invalid --project name '\.\.\/tmp': /,
    );
  });
});
