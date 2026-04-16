/**
 * gobbi config — CRUD command for session configuration backed by SQLite.
 *
 * Subcommands:
 *   init                          Create config.db or migrate from JSON
 *   get <session-id> [key]        Read session or specific field
 *   set <session-id> <key> <val>  Write field (atomic per-field update)
 *   delete <session-id>           Remove session
 *   list                          List all sessions (tab-separated)
 *   cleanup                       Run TTL + max-entries cleanup
 *
 * The backing store is SQLite (config.db) with WAL mode, eliminating the
 * lost-update race that settings.json suffered from under concurrent writes.
 */

import { error } from '../lib/style.js';
import { coerceValue, getNestedValue } from '../lib/config.js';
import { openConfigStore } from '../lib/config-store.js';
import type { Session } from '../lib/config.js';

// ---------------------------------------------------------------------------
// Usage Strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi config <subcommand> [args]

Subcommands:
  init                          Create config.db or migrate from settings.json
  get <session-id> [key]        Read session object or specific field (dot-path)
  set <session-id> <key> <val>  Write field (dot-path)
  delete <session-id>           Remove session
  list                          List all sessions (tab-separated: id\\tcreatedAt)
  cleanup                       Run TTL + max-entries cleanup

Options:
  --help    Show this help message`;

// ---------------------------------------------------------------------------
// Project directory resolution
// ---------------------------------------------------------------------------

function resolveProjectDir(): string {
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];
  if (projectDir === undefined || projectDir === '') {
    console.error(error('CLAUDE_PROJECT_DIR is not set'));
    process.exit(1);
  }
  return projectDir;
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
      runConfigInit();
      break;
    case 'get':
      runConfigGet(args.slice(1));
      break;
    case 'set':
      runConfigSet(args.slice(1));
      break;
    case 'delete':
      runConfigDelete(args.slice(1));
      break;
    case 'list':
      runConfigList();
      break;
    case 'cleanup':
      runConfigCleanup();
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

function runConfigInit(): void {
  const projectDir = resolveProjectDir();
  using store = openConfigStore(projectDir);
  store.cleanup();
}

// ---------------------------------------------------------------------------
// get
// ---------------------------------------------------------------------------

function runConfigGet(args: string[]): void {
  const sessionId = args[0];
  if (sessionId === undefined) {
    console.error(error('get requires session-id'));
    process.exit(1);
  }

  const key = args[1];
  const projectDir = resolveProjectDir();
  using store = openConfigStore(projectDir);

  const session: Session | null = store.getSession(sessionId);

  if (session === null) {
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

function runConfigSet(args: string[]): void {
  const sessionId = args[0];
  const key = args[1];
  const rawValue = args[2];

  if (sessionId === undefined || key === undefined || rawValue === undefined) {
    console.error(error('set requires session-id, key, and value'));
    process.exit(1);
  }

  const projectDir = resolveProjectDir();
  using store = openConfigStore(projectDir);

  const coerced = coerceValue(rawValue);
  store.setField(sessionId, key, coerced);
}

// ---------------------------------------------------------------------------
// delete
// ---------------------------------------------------------------------------

function runConfigDelete(args: string[]): void {
  const sessionId = args[0];
  if (sessionId === undefined) {
    console.error(error('delete requires session-id'));
    process.exit(1);
  }

  const projectDir = resolveProjectDir();
  using store = openConfigStore(projectDir);
  store.deleteSession(sessionId);
}

// ---------------------------------------------------------------------------
// list
// ---------------------------------------------------------------------------

function runConfigList(): void {
  const projectDir = resolveProjectDir();
  using store = openConfigStore(projectDir);

  const entries = store.listSessions();

  for (const entry of entries) {
    process.stdout.write(`${entry.sessionId}\t${entry.session.createdAt}\n`);
  }
}

// ---------------------------------------------------------------------------
// cleanup
// ---------------------------------------------------------------------------

function runConfigCleanup(): void {
  const projectDir = resolveProjectDir();
  using store = openConfigStore(projectDir);
  store.cleanup();
}
