import { describe, it, expect, beforeEach } from 'bun:test';
import { mkdtempSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { ConfigStore, openConfigStore } from '../config-store.js';
import type { Session } from '../config.js';
import { GOBBI_VERSION, GOBBI_ARCHITECTURE, nowIso } from '../config.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeSession(overrides: Partial<Session> = {}): Session {
  const ts = '2026-01-01T00:00:00Z';
  return {
    trivialRange: 'read-only',
    evaluationMode: 'ask-each-time',
    gitWorkflow: 'direct-commit',
    baseBranch: null,
    notify: { slack: false, telegram: false },
    createdAt: ts,
    lastAccessedAt: ts,
    ...overrides,
  };
}

// ===========================================================================
// Schema creation
// ===========================================================================

describe('ConfigStore schema creation', () => {
  it('creates tables in a fresh in-memory database', () => {
    using store = new ConfigStore(':memory:');

    // Verify tables exist by performing operations without errors
    expect(store.sessionCount()).toBe(0);
    expect(store.getMetadata('version')).toBeNull();
  });
});

// ===========================================================================
// Session CRUD
// ===========================================================================

describe('ConfigStore session CRUD', () => {
  it('upserts and retrieves a session', () => {
    using store = new ConfigStore(':memory:');

    const session = makeSession();
    store.upsertSession('sess-1', session);

    const retrieved = store.getSession('sess-1');
    expect(retrieved).not.toBeNull();
    expect(retrieved!.trivialRange).toBe('read-only');
    expect(retrieved!.evaluationMode).toBe('ask-each-time');
    expect(retrieved!.gitWorkflow).toBe('direct-commit');
    expect(retrieved!.baseBranch).toBeNull();
    expect(retrieved!.notify.slack).toBe(false);
    expect(retrieved!.notify.telegram).toBe(false);
    expect(retrieved!.createdAt).toBe('2026-01-01T00:00:00Z');
    expect(retrieved!.lastAccessedAt).toBe('2026-01-01T00:00:00Z');
  });

  it('returns null for non-existent session', () => {
    using store = new ConfigStore(':memory:');

    const result = store.getSession('does-not-exist');
    expect(result).toBeNull();
  });

  it('upsert overwrites existing session', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-1', makeSession({ trivialRange: 'read-only' }));
    store.upsertSession('sess-1', makeSession({ trivialRange: 'read-write' }));

    const retrieved = store.getSession('sess-1');
    expect(retrieved!.trivialRange).toBe('read-write');
    expect(store.sessionCount()).toBe(1);
  });

  it('deletes a session', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-1', makeSession());
    expect(store.sessionCount()).toBe(1);

    store.deleteSession('sess-1');
    expect(store.sessionCount()).toBe(0);
    expect(store.getSession('sess-1')).toBeNull();
  });

  it('delete on non-existent session is a no-op', () => {
    using store = new ConfigStore(':memory:');

    // Should not throw
    store.deleteSession('does-not-exist');
    expect(store.sessionCount()).toBe(0);
  });

  it('lists sessions sorted by created_at ascending', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-b', makeSession({ createdAt: '2026-02-01T00:00:00Z' }));
    store.upsertSession('sess-a', makeSession({ createdAt: '2026-01-01T00:00:00Z' }));
    store.upsertSession('sess-c', makeSession({ createdAt: '2026-03-01T00:00:00Z' }));

    const list = store.listSessions();
    expect(list).toHaveLength(3);
    expect(list[0]!.sessionId).toBe('sess-a');
    expect(list[1]!.sessionId).toBe('sess-b');
    expect(list[2]!.sessionId).toBe('sess-c');
  });

  it('converts notify booleans correctly on round-trip', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-1', makeSession({
      notify: { slack: true, telegram: true },
    }));

    const retrieved = store.getSession('sess-1');
    expect(retrieved!.notify.slack).toBe(true);
    expect(retrieved!.notify.telegram).toBe(true);
    // Verify they are actually booleans, not numbers
    expect(typeof retrieved!.notify.slack).toBe('boolean');
    expect(typeof retrieved!.notify.telegram).toBe('boolean');
  });
});

// ===========================================================================
// setField — atomic per-field updates
// ===========================================================================

describe('ConfigStore setField', () => {
  it('creates session with defaults when setting field on non-existent session', () => {
    using store = new ConfigStore(':memory:');

    store.setField('new-sess', 'trivialRange', 'read-write');

    const session = store.getSession('new-sess');
    expect(session).not.toBeNull();
    expect(session!.trivialRange).toBe('read-write');
    // Other fields should have defaults
    expect(session!.evaluationMode).toBe('ask-each-time');
    expect(session!.gitWorkflow).toBe('direct-commit');
    expect(session!.notify.slack).toBe(false);
  });

  it('updates only the targeted field on existing session', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-1', makeSession());
    store.setField('sess-1', 'evaluationMode', 'always');

    const session = store.getSession('sess-1');
    expect(session!.evaluationMode).toBe('always');
    // Other fields unchanged
    expect(session!.trivialRange).toBe('read-only');
    expect(session!.gitWorkflow).toBe('direct-commit');
  });

  it('handles notify.slack dot-path correctly', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-1', makeSession());
    store.setField('sess-1', 'notify.slack', true);

    const session = store.getSession('sess-1');
    expect(session!.notify.slack).toBe(true);
    expect(session!.notify.telegram).toBe(false);
  });

  it('handles notify.telegram dot-path correctly', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-1', makeSession());
    store.setField('sess-1', 'notify.telegram', 'true');

    const session = store.getSession('sess-1');
    expect(session!.notify.telegram).toBe(true);
  });

  it('sets baseBranch to null when value is null', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-1', makeSession({ baseBranch: 'main' }));
    store.setField('sess-1', 'baseBranch', null);

    const session = store.getSession('sess-1');
    expect(session!.baseBranch).toBeNull();
  });

  it('throws for unknown field name', () => {
    using store = new ConfigStore(':memory:');

    expect(() => store.setField('sess-1', 'unknownField', 'value')).toThrow(
      'Unknown or read-only config field: unknownField',
    );
  });

  it('throws for read-only fields like createdAt', () => {
    using store = new ConfigStore(':memory:');

    expect(() => store.setField('sess-1', 'createdAt', '2030-01-01')).toThrow(
      'Unknown or read-only config field: createdAt',
    );
  });

  it('updates lastAccessedAt on each setField call', () => {
    using store = new ConfigStore(':memory:');

    store.upsertSession('sess-1', makeSession({
      lastAccessedAt: '2020-01-01T00:00:00Z',
    }));

    store.setField('sess-1', 'trivialRange', 'read-write');

    const session = store.getSession('sess-1');
    // lastAccessedAt should be updated to a recent time, not 2020
    expect(session!.lastAccessedAt > '2020-01-01T00:00:00Z').toBe(true);
  });
});

// ===========================================================================
// Metadata
// ===========================================================================

describe('ConfigStore metadata', () => {
  it('stores and retrieves metadata', () => {
    using store = new ConfigStore(':memory:');

    store.setMetadata('version', '0.5.0');
    store.setMetadata('architecture', 'claude-source');

    expect(store.getMetadata('version')).toBe('0.5.0');
    expect(store.getMetadata('architecture')).toBe('claude-source');
  });

  it('returns null for non-existent metadata key', () => {
    using store = new ConfigStore(':memory:');

    expect(store.getMetadata('does-not-exist')).toBeNull();
  });

  it('upsert overwrites existing metadata', () => {
    using store = new ConfigStore(':memory:');

    store.setMetadata('version', '0.4.0');
    store.setMetadata('version', '0.5.0');

    expect(store.getMetadata('version')).toBe('0.5.0');
  });
});

// ===========================================================================
// Cleanup
// ===========================================================================

describe('ConfigStore cleanup', () => {
  it('removes sessions older than TTL', () => {
    using store = new ConfigStore(':memory:');

    const old = '2020-01-01T00:00:00Z';
    const recent = nowIso();

    store.upsertSession('old-sess', makeSession({ lastAccessedAt: old }));
    store.upsertSession('new-sess', makeSession({ lastAccessedAt: recent }));

    store.cleanup(7);

    expect(store.getSession('old-sess')).toBeNull();
    expect(store.getSession('new-sess')).not.toBeNull();
  });

  it('caps sessions to maxSessions, keeping newest', () => {
    using store = new ConfigStore(':memory:');

    // Insert 5 sessions with future lastAccessedAt so TTL does not remove them
    for (let i = 0; i < 5; i++) {
      store.upsertSession(`sess-${i}`, makeSession({
        lastAccessedAt: `2099-01-0${i + 1}T00:00:00Z`,
      }));
    }

    expect(store.sessionCount()).toBe(5);

    // Cleanup with large TTL (no TTL removals) and max 3
    // Should keep sess-4, sess-3, sess-2 (newest by lastAccessedAt)
    store.cleanup(99999, 3);

    expect(store.sessionCount()).toBe(3);
    // Oldest two should be gone
    expect(store.getSession('sess-0')).toBeNull();
    expect(store.getSession('sess-1')).toBeNull();
    // Newest three should remain
    expect(store.getSession('sess-2')).not.toBeNull();
    expect(store.getSession('sess-3')).not.toBeNull();
    expect(store.getSession('sess-4')).not.toBeNull();
  });

  it('no-op when no sessions exist', () => {
    using store = new ConfigStore(':memory:');

    // Should not throw
    store.cleanup();
    expect(store.sessionCount()).toBe(0);
  });
});

// ===========================================================================
// Concurrent access (two stores on same file)
// ===========================================================================

describe('ConfigStore concurrent access', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'gobbi-config-test-'));
    mkdirSync(join(tmpDir, '.gobbi'), { recursive: true });
  });

  it('two stores can write different fields without lost updates', () => {
    const dbPath = join(tmpDir, '.gobbi', 'config.db');

    // Open two stores on the same file
    const store1 = new ConfigStore(dbPath);
    const store2 = new ConfigStore(dbPath);

    try {
      // Both create the same session via setField
      store1.setField('sess-1', 'trivialRange', 'read-write');
      store2.setField('sess-1', 'evaluationMode', 'always');

      // Both changes should be visible
      const session = store1.getSession('sess-1');
      expect(session).not.toBeNull();
      expect(session!.trivialRange).toBe('read-write');
      expect(session!.evaluationMode).toBe('always');
    } finally {
      store1.close();
      store2.close();
    }
  });

  it('two stores can write to different sessions', () => {
    const dbPath = join(tmpDir, '.gobbi', 'config.db');

    const store1 = new ConfigStore(dbPath);
    const store2 = new ConfigStore(dbPath);

    try {
      store1.upsertSession('sess-a', makeSession({ trivialRange: 'read-write' }));
      store2.upsertSession('sess-b', makeSession({ trivialRange: 'full' }));

      expect(store1.sessionCount()).toBe(2);
      expect(store2.getSession('sess-a')!.trivialRange).toBe('read-write');
      expect(store1.getSession('sess-b')!.trivialRange).toBe('full');
    } finally {
      store1.close();
      store2.close();
    }
  });
});

// ===========================================================================
// Migration from JSON
// ===========================================================================

describe('ConfigStore migration from JSON', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'gobbi-migrate-test-'));
    mkdirSync(join(tmpDir, '.gobbi'), { recursive: true });
  });

  it('migrates sessions from settings.json on first open', () => {
    const settingsPath = join(tmpDir, '.gobbi', 'settings.json');
    const jsonData = {
      version: '0.4.5',
      architecture: 'claude-source',
      sessions: {
        'existing-sess': {
          notify: { slack: true, telegram: false },
          trivialRange: 'read-write',
          evaluationMode: 'always',
          gitWorkflow: 'pr-branch',
          baseBranch: 'main',
          createdAt: '2026-01-01T00:00:00Z',
          lastAccessedAt: '2026-01-02T00:00:00Z',
        },
      },
    };
    writeFileSync(settingsPath, JSON.stringify(jsonData, null, 2), 'utf8');

    // Open store — should trigger migration
    using store = openConfigStore(tmpDir);

    const session = store.getSession('existing-sess');
    expect(session).not.toBeNull();
    expect(session!.trivialRange).toBe('read-write');
    expect(session!.evaluationMode).toBe('always');
    expect(session!.gitWorkflow).toBe('pr-branch');
    expect(session!.baseBranch).toBe('main');
    expect(session!.notify.slack).toBe(true);
    expect(session!.notify.telegram).toBe(false);
    expect(session!.createdAt).toBe('2026-01-01T00:00:00Z');

    // Metadata should be migrated
    expect(store.getMetadata('version')).toBe('0.4.5');
    expect(store.getMetadata('architecture')).toBe('claude-source');

    // Source JSON file should still exist (rollback safety)
    expect(existsSync(settingsPath)).toBe(true);
  });

  it('does not re-migrate when config.db already exists', () => {
    const settingsPath = join(tmpDir, '.gobbi', 'settings.json');
    writeFileSync(settingsPath, JSON.stringify({
      version: '0.4.5',
      architecture: 'claude-source',
      sessions: {
        'original-sess': {
          notify: { slack: false, telegram: false },
          trivialRange: 'read-only',
          evaluationMode: 'ask-each-time',
          gitWorkflow: 'direct-commit',
          baseBranch: null,
          createdAt: '2026-01-01T00:00:00Z',
          lastAccessedAt: '2026-01-01T00:00:00Z',
        },
      },
    }), 'utf8');

    // First open — migrates
    {
      using store = openConfigStore(tmpDir);
      expect(store.sessionCount()).toBe(1);
      store.deleteSession('original-sess');
      expect(store.sessionCount()).toBe(0);
    }

    // Second open — config.db exists, should NOT re-migrate
    {
      using store = openConfigStore(tmpDir);
      expect(store.sessionCount()).toBe(0);
    }
  });

  it('creates fresh database when no JSON files exist', () => {
    using store = openConfigStore(tmpDir);

    expect(store.sessionCount()).toBe(0);
    expect(store.getMetadata('version')).toBe(GOBBI_VERSION);
    expect(store.getMetadata('architecture')).toBe(GOBBI_ARCHITECTURE);
  });
});

// ===========================================================================
// openConfigStore path resolution
// ===========================================================================

describe('openConfigStore', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'gobbi-open-test-'));
    mkdirSync(join(tmpDir, '.gobbi'), { recursive: true });
  });

  it('creates config.db in the .gobbi directory', () => {
    using store = openConfigStore(tmpDir);

    store.upsertSession('test', makeSession());

    const dbPath = join(tmpDir, '.gobbi', 'config.db');
    expect(existsSync(dbPath)).toBe(true);
  });
});

// ===========================================================================
// Symbol.dispose
// ===========================================================================

describe('ConfigStore Symbol.dispose', () => {
  it('auto-closes via using keyword', () => {
    let closedStore: ConfigStore;

    {
      using store = new ConfigStore(':memory:');
      store.upsertSession('test', makeSession());
      closedStore = store;
    }

    // After scope exit, the store should be closed.
    // Attempting to use it should throw.
    expect(() => closedStore.sessionCount()).toThrow();
  });
});
