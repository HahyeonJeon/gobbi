/**
 * gobbi config — CRUD command for gobbi.json session configuration.
 *
 * Subcommands:
 *   init                          Create gobbi.json or migrate
 *   get <session-id> [key]        Read session or specific field
 *   set <session-id> <key> <val>  Write field
 *   delete <session-id>           Remove session
 *   list                          List all sessions (tab-separated)
 *   cleanup                       Run TTL + max-entries cleanup
 */

import { join } from 'node:path';

import { error } from '../lib/style.js';
import {
  readGobbiJson,
  writeGobbiJsonAtomic,
  emptyGobbiJson,
  defaultSession,
  migrateIfNeeded,
  needsMigration,
  runCleanup,
  coerceValue,
  getNestedValue,
  setNestedValue,
  nowIso,
} from '../lib/config.js';
import type { GobbiJson, Session } from '../lib/config.js';
import { withLock } from '../lib/lockfile.js';

// ---------------------------------------------------------------------------
// Usage Strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi config <subcommand> [args]

Subcommands:
  init                          Create gobbi.json or migrate to current version
  get <session-id> [key]        Read session object or specific field (dot-path)
  set <session-id> <key> <val>  Write field (dot-path)
  delete <session-id>           Remove session
  list                          List all sessions (tab-separated: id\\tcreatedAt)
  cleanup                       Run TTL + max-entries cleanup

Options:
  --help    Show this help message`;

// ---------------------------------------------------------------------------
// File path resolution
// ---------------------------------------------------------------------------

function resolveGobbiJsonPath(): string {
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];
  if (projectDir === undefined || projectDir === '') {
    console.error(error('CLAUDE_PROJECT_DIR is not set'));
    process.exit(1);
  }
  return join(projectDir, '.claude', 'gobbi.json');
}

// ---------------------------------------------------------------------------
// Top-Level Router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi config`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runConfig(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'init':
      await runConfigInit();
      break;
    case 'get':
      await runConfigGet(args.slice(1));
      break;
    case 'set':
      await runConfigSet(args.slice(1));
      break;
    case 'delete':
      await runConfigDelete(args.slice(1));
      break;
    case 'list':
      await runConfigList();
      break;
    case 'cleanup':
      await runConfigCleanup();
      break;
    case '--help':
    case undefined:
      console.log(USAGE);
      break;
    default:
      console.error(error(`Unknown subcommand: ${subcommand}`));
      console.log(USAGE);
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

async function runConfigInit(): Promise<void> {
  const filePath = resolveGobbiJsonPath();

  await withLock(filePath, async () => {
    const existing = await readGobbiJson(filePath);

    let data: GobbiJson;
    if (existing === null) {
      // File missing or unparseable — create fresh
      data = emptyGobbiJson();
    } else if (needsMigration(existing)) {
      // v0.3.1 format — migrate
      data = migrateIfNeeded(existing);
    } else {
      // Already valid — no write needed
      return;
    }

    data = runCleanup(data);
    await writeGobbiJsonAtomic(filePath, data);
  });
}

// ---------------------------------------------------------------------------
// get
// ---------------------------------------------------------------------------

async function runConfigGet(args: string[]): Promise<void> {
  const sessionId = args[0];
  if (sessionId === undefined) {
    console.error(error('get requires session-id'));
    process.exit(1);
  }

  const key = args[1];
  const filePath = resolveGobbiJsonPath();

  // Read-only: no lock needed.
  // If migration is needed, perform it under a lock first then re-read.
  let data = await readGobbiJson(filePath);

  if (data === null) {
    // File missing — nothing to get
    return;
  }

  if (needsMigration(data)) {
    // Migrate under lock so other readers see the migrated form
    await withLock(filePath, async () => {
      const fresh = await readGobbiJson(filePath);
      if (fresh !== null && needsMigration(fresh)) {
        const migrated = migrateIfNeeded(fresh);
        await writeGobbiJsonAtomic(filePath, migrated);
      }
    });
    // Re-read after migration
    data = await readGobbiJson(filePath);
    if (data === null) return;
  }

  const session: Session | undefined = data.sessions[sessionId];

  if (session === undefined) {
    // Session doesn't exist — no output
    return;
  }

  if (key === undefined) {
    // Output full session object as pretty JSON
    process.stdout.write(JSON.stringify(session, null, 2) + '\n');
    return;
  }

  // Output specific field via dot-path
  const sessionAsRecord = session as unknown as Record<string, unknown>;
  const value = getNestedValue(sessionAsRecord, key);

  if (value === undefined) {
    // Path not found — no output
    return;
  }

  // Strip JSON quoting for strings; pass through booleans, null, numbers as-is
  if (typeof value === 'string') {
    process.stdout.write(value + '\n');
  } else {
    process.stdout.write(JSON.stringify(value) + '\n');
  }
}

// ---------------------------------------------------------------------------
// set
// ---------------------------------------------------------------------------

async function runConfigSet(args: string[]): Promise<void> {
  const sessionId = args[0];
  const key = args[1];
  const rawValue = args[2];

  if (sessionId === undefined || key === undefined || rawValue === undefined) {
    console.error(error('set requires session-id, key, and value'));
    process.exit(1);
  }

  const filePath = resolveGobbiJsonPath();

  await withLock(filePath, async () => {
    const existing = await readGobbiJson(filePath);

    let data: GobbiJson;
    if (existing === null) {
      data = emptyGobbiJson();
    } else if (needsMigration(existing)) {
      data = migrateIfNeeded(existing);
    } else {
      data = existing;
    }

    // Ensure session exists — create with defaults if missing
    if (!(sessionId in data.sessions)) {
      data = {
        ...data,
        sessions: {
          ...data.sessions,
          [sessionId]: defaultSession(),
        },
      };
    }

    const ts = nowIso();
    const coerced = coerceValue(rawValue);

    // Apply dot-path set to the session
    const session = data.sessions[sessionId];
    if (session === undefined) {
      // Should not happen — we just created it above
      console.error(error(`Session "${sessionId}" unexpectedly missing`));
      process.exit(1);
    }

    const sessionAsRecord = session as unknown as Record<string, unknown>;
    const updated = setNestedValue(sessionAsRecord, key, coerced);
    // Update lastAccessedAt
    const withTimestamp = { ...updated, lastAccessedAt: ts };

    data = {
      ...data,
      sessions: {
        ...data.sessions,
        [sessionId]: withTimestamp as unknown as Session,
      },
    };

    data = runCleanup(data);
    await writeGobbiJsonAtomic(filePath, data);
  });
}

// ---------------------------------------------------------------------------
// delete
// ---------------------------------------------------------------------------

async function runConfigDelete(args: string[]): Promise<void> {
  const sessionId = args[0];
  if (sessionId === undefined) {
    console.error(error('delete requires session-id'));
    process.exit(1);
  }

  const filePath = resolveGobbiJsonPath();

  await withLock(filePath, async () => {
    const existing = await readGobbiJson(filePath);

    if (existing === null) {
      // Nothing to delete
      return;
    }

    let data: GobbiJson;
    if (needsMigration(existing)) {
      data = migrateIfNeeded(existing);
    } else {
      data = existing;
    }

    // Remove the session
    const { [sessionId]: _removed, ...remainingSessions } = data.sessions;
    data = {
      ...data,
      sessions: remainingSessions,
    };

    await writeGobbiJsonAtomic(filePath, data);
  });
}

// ---------------------------------------------------------------------------
// list
// ---------------------------------------------------------------------------

async function runConfigList(): Promise<void> {
  const filePath = resolveGobbiJsonPath();

  // Read-only — no lock needed.
  let data = await readGobbiJson(filePath);

  if (data === null) {
    // File missing — nothing to list
    return;
  }

  if (needsMigration(data)) {
    await withLock(filePath, async () => {
      const fresh = await readGobbiJson(filePath);
      if (fresh !== null && needsMigration(fresh)) {
        const migrated = migrateIfNeeded(fresh);
        await writeGobbiJsonAtomic(filePath, migrated);
      }
    });
    data = await readGobbiJson(filePath);
    if (data === null) return;
  }

  // Sort by createdAt ascending, then output tab-separated
  const entries = Object.entries(data.sessions).sort((a, b) => {
    const aCreated = a[1]?.createdAt ?? '';
    const bCreated = b[1]?.createdAt ?? '';
    return aCreated < bCreated ? -1 : aCreated > bCreated ? 1 : 0;
  });

  for (const [id, session] of entries) {
    if (session === undefined) continue;
    process.stdout.write(`${id}\t${session.createdAt}\n`);
  }
}

// ---------------------------------------------------------------------------
// cleanup
// ---------------------------------------------------------------------------

async function runConfigCleanup(): Promise<void> {
  const filePath = resolveGobbiJsonPath();

  await withLock(filePath, async () => {
    const existing = await readGobbiJson(filePath);

    if (existing === null) {
      // Nothing to clean up
      return;
    }

    let data: GobbiJson;
    if (needsMigration(existing)) {
      data = migrateIfNeeded(existing);
    } else {
      data = existing;
    }

    data = runCleanup(data);
    await writeGobbiJsonAtomic(filePath, data);
  });
}
