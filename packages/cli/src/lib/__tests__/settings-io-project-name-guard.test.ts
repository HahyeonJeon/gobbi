/**
 * Path-traversal guard at the lib/settings-io.ts seam (#245).
 *
 * `resolveProjectName` validates the resolved name via
 * `lib/project-name.ts::validateProjectName` before returning. Any
 * caller of `loadSettingsAtLevel` / `writeSettingsAtLevel` /
 * `resolveSettings` that supplies an invalid `projectName` payload now
 * throws `ConfigCascadeError('parse', …)` at the path-resolution
 * boundary — BEFORE any `path.join(repoRoot, '.gobbi', 'projects',
 * <payload>, …)` runs.
 *
 * Coverage:
 *
 *   1. `resolveSettings({projectName: '../etc'})` throws.
 *   2. `loadSettingsAtLevel(_, 'project', undefined, '../etc')` throws.
 *   3. `loadSettingsAtLevel(_, 'session', 'sid-123', 'foo/bar')` throws.
 *   4. `writeSettingsAtLevel(_, 'project', _, undefined, '..')` throws.
 *   5. `loadSettingsAtLevel(_, 'workspace')` does NOT throw even when
 *      `basename(repoRoot)` would be invalid (workspace-level paths do
 *      not include a project-name segment, by design).
 *   6. Valid project names (`'foo'`) pass through without throwing.
 *   7. Three distinct traversal payloads (`'../etc'`, `'foo/bar'`,
 *      `'..'`) each surface the L13 guard message verbatim.
 *
 * Fixture suffix: hex digits via `randomBytes(4).toString('hex')` so
 * `mkdtemp`-shaped tmpdirs do not produce uppercase basenames that
 * would fail NAME_PATTERN — see `mkdtemp-suffix-fails-name-pattern.md`.
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { randomBytes } from 'node:crypto';
import { mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { ConfigCascadeError, type Settings } from '../settings.js';
import {
  loadSettingsAtLevel,
  resolveSettings,
  writeSettingsAtLevel,
} from '../settings-io.js';

// ---------------------------------------------------------------------------
// Scratch lifecycle — deterministic-lowercase basename so the basename
// fallback through `validateProjectName` does not produce a false
// positive when the test does NOT supply an explicit `projectName`.
// ---------------------------------------------------------------------------

let scratchDir: string;

beforeEach(() => {
  scratchDir = join(tmpdir(), `gobbi-settings-io-guard-${randomBytes(4).toString('hex')}`);
  mkdirSync(scratchDir, { recursive: true });
});

afterEach(() => {
  try {
    rmSync(scratchDir, { recursive: true, force: true });
  } catch {
    // best-effort
  }
});

const MINIMAL: Settings = { schemaVersion: 1 };

// ---------------------------------------------------------------------------
// resolveSettings — explicit projectName guard
// ---------------------------------------------------------------------------

describe('resolveSettings — invalid projectName guard (#245)', () => {
  test('throws ConfigCascadeError for traversal payload "../etc"', () => {
    expect(() =>
      resolveSettings({ repoRoot: scratchDir, projectName: '../etc' }),
    ).toThrow(ConfigCascadeError);
    expect(() =>
      resolveSettings({ repoRoot: scratchDir, projectName: '../etc' }),
    ).toThrow(/invalid project name '\.\.\/etc'/);
  });

  test('throws ConfigCascadeError for path-separator payload "foo/bar"', () => {
    expect(() =>
      resolveSettings({ repoRoot: scratchDir, projectName: 'foo/bar' }),
    ).toThrow(/invalid project name 'foo\/bar'/);
  });

  test('throws ConfigCascadeError for traversal sentinel ".."', () => {
    expect(() =>
      resolveSettings({ repoRoot: scratchDir, projectName: '..' }),
    ).toThrow(/invalid project name '\.\.'/);
  });

  test('valid projectName ("foo") does NOT throw', () => {
    expect(() =>
      resolveSettings({ repoRoot: scratchDir, projectName: 'foo' }),
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// loadSettingsAtLevel — guard fires for project + session levels
// ---------------------------------------------------------------------------

describe('loadSettingsAtLevel — invalid projectName guard (#245)', () => {
  test('throws for project-level read with traversal payload "../etc"', () => {
    expect(() =>
      loadSettingsAtLevel(scratchDir, 'project', undefined, '../etc'),
    ).toThrow(ConfigCascadeError);
    expect(() =>
      loadSettingsAtLevel(scratchDir, 'project', undefined, '../etc'),
    ).toThrow(/invalid project name '\.\.\/etc'/);
  });

  test('throws for session-level read with path-separator payload "foo/bar"', () => {
    expect(() =>
      loadSettingsAtLevel(scratchDir, 'session', 'sid-123', 'foo/bar'),
    ).toThrow(/invalid project name 'foo\/bar'/);
  });

  test('throws for project-level read with traversal sentinel ".."', () => {
    expect(() =>
      loadSettingsAtLevel(scratchDir, 'project', undefined, '..'),
    ).toThrow(/invalid project name '\.\.'/);
  });

  test('valid projectName ("foo") at project level does NOT throw (returns null for missing file)', () => {
    expect(loadSettingsAtLevel(scratchDir, 'project', undefined, 'foo')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// writeSettingsAtLevel — guard fires before any FS write
// ---------------------------------------------------------------------------

describe('writeSettingsAtLevel — invalid projectName guard (#245)', () => {
  test('throws for project-level write with traversal payload "../etc"', () => {
    expect(() =>
      writeSettingsAtLevel(scratchDir, 'project', MINIMAL, undefined, '../etc'),
    ).toThrow(ConfigCascadeError);
    expect(() =>
      writeSettingsAtLevel(scratchDir, 'project', MINIMAL, undefined, '../etc'),
    ).toThrow(/invalid project name '\.\.\/etc'/);
  });

  test('throws for session-level write with path-separator payload "foo/bar"', () => {
    expect(() =>
      writeSettingsAtLevel(scratchDir, 'session', MINIMAL, 'sid-123', 'foo/bar'),
    ).toThrow(/invalid project name 'foo\/bar'/);
  });

  test('throws for project-level write with traversal sentinel ".."', () => {
    expect(() =>
      writeSettingsAtLevel(scratchDir, 'project', MINIMAL, undefined, '..'),
    ).toThrow(/invalid project name '\.\.'/);
  });

  test('valid projectName ("foo") writes without throwing', () => {
    expect(() =>
      writeSettingsAtLevel(scratchDir, 'project', MINIMAL, undefined, 'foo'),
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Workspace-level negative — basename validation does NOT run
// ---------------------------------------------------------------------------

describe('workspace level — basename is NOT validated (#245)', () => {
  /**
   * Workspace-level paths (`.gobbi/settings.json`) do not include a
   * project-name segment — `pathForLevel` returns
   * `workspaceSettingsPath(repoRoot)` directly, and both
   * `loadSettingsAtLevel` and `writeSettingsAtLevel` short-circuit the
   * `resolveProjectName` call via `level === 'workspace' ?
   * basename(repoRoot) : resolveProjectName(...)`. Even an invalid
   * basename must therefore flow through workspace-level reads/writes
   * untouched.
   */
  test('loadSettingsAtLevel(workspace) does NOT throw even with invalid basename(repoRoot)', () => {
    // Construct a tmpdir whose basename has UPPERCASE characters — would
    // fail NAME_PATTERN if it ever flowed through validateProjectName.
    const invalidBasenameDir = join(
      tmpdir(),
      `Invalid-${randomBytes(4).toString('hex')}`,
    );
    mkdirSync(invalidBasenameDir, { recursive: true });
    try {
      expect(() => loadSettingsAtLevel(invalidBasenameDir, 'workspace')).not.toThrow();
      // No file present — the read returns null.
      expect(loadSettingsAtLevel(invalidBasenameDir, 'workspace')).toBeNull();
    } finally {
      try {
        rmSync(invalidBasenameDir, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  });

  test('writeSettingsAtLevel(workspace) does NOT throw even with invalid basename(repoRoot)', () => {
    const invalidBasenameDir = join(
      tmpdir(),
      `Invalid-${randomBytes(4).toString('hex')}`,
    );
    mkdirSync(invalidBasenameDir, { recursive: true });
    try {
      expect(() =>
        writeSettingsAtLevel(invalidBasenameDir, 'workspace', MINIMAL),
      ).not.toThrow();
    } finally {
      try {
        rmSync(invalidBasenameDir, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    }
  });
});
