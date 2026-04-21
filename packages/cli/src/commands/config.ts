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
 *   resolve <key> [--session-id]  Pass-3 cascade lookup (T1+T2+T3)
 *
 * The backing store is SQLite (config.db) with WAL mode, eliminating the
 * lost-update race that settings.json suffered from under concurrent writes.
 *
 * The `resolve` subcommand routes through the Pass-3 cascade resolver
 * (`lib/config-cascade.ts::resolveConfig`) which layers T1 user settings,
 * T2 project settings, and T3 session projections into one frozen shape.
 * Unlike `get`, `resolve` does not target a single tier — the whole cascade
 * is computed and a dot-path walks the result.
 */

import { error } from '../lib/style.js';
import { coerceValue, getNestedValue } from '../lib/config.js';
import { openConfigStore } from '../lib/config-store.js';
import {
  ConfigCascadeError,
  resolveConfig,
  type ResolvedConfig,
  type TierId,
} from '../lib/config-cascade.js';
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
  resolve <key> [--session-id <id>] [--with-sources]
                                Resolve <key> through the T1/T2/T3 cascade

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
    case 'resolve':
      runConfigResolve(args.slice(1));
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

// ---------------------------------------------------------------------------
// resolve — Pass-3 cascade lookup
// ---------------------------------------------------------------------------

const RESOLVE_USAGE =
  'Usage: gobbi config resolve <key> [--session-id <id>] [--with-sources]';

interface ResolveArgs {
  readonly key: string;
  readonly sessionId?: string;
  readonly withSources: boolean;
}

/**
 * Parse the argv for `gobbi config resolve`. Returns `null` on any malformed
 * input (missing positional, unknown flag, option without value) so the
 * caller can print USAGE and exit 2.
 *
 * Accepted forms:
 *   resolve <key>
 *   resolve <key> --session-id <id>
 *   resolve <key> --with-sources
 *   resolve <key> --session-id <id> --with-sources
 *
 * Any flag variant (ordering, presence of --with-sources before/after
 * --session-id) is accepted; duplicate flags or unknown options return null.
 */
function parseResolveArgs(args: readonly string[]): ResolveArgs | null {
  let key: string | undefined;
  let sessionId: string | undefined;
  let withSources = false;

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (arg === undefined) break;

    if (arg === '--session-id') {
      if (sessionId !== undefined) return null;
      const value = args[i + 1];
      if (value === undefined || value.startsWith('--')) return null;
      sessionId = value;
      i += 2;
      continue;
    }

    if (arg === '--with-sources') {
      if (withSources) return null;
      withSources = true;
      i += 1;
      continue;
    }

    if (arg.startsWith('--')) return null;

    if (key !== undefined) return null;
    key = arg;
    i += 1;
  }

  if (key === undefined) return null;

  const out: { key: string; sessionId?: string; withSources: boolean } = {
    key,
    withSources,
  };
  if (sessionId !== undefined) out.sessionId = sessionId;
  return out;
}

/**
 * Walk `resolved` against `dotPath` (e.g. `git.mode`,
 * `verification.commands.test.command`). Returns the leaf value, or
 * `undefined` when any ancestor is missing or descends into a non-record
 * leaf (dot-path cannot traverse through a string / number / null).
 */
function walkDotPath(resolved: ResolvedConfig, dotPath: string): unknown {
  const segments = dotPath.split('.');
  // Treat the resolved object as a plain record for traversal. `__sources`
  // is intentionally reachable by dot-path — a user asking for it gets the
  // provenance map; it's an opt-in read.
  let current: unknown = resolved;
  for (const segment of segments) {
    if (
      current === null ||
      typeof current !== 'object' ||
      Array.isArray(current)
    ) {
      return undefined;
    }
    const rec = current as Record<string, unknown>;
    if (!(segment in rec)) return undefined;
    current = rec[segment];
  }
  return current;
}

function runConfigResolve(args: string[]): void {
  const parsed = parseResolveArgs(args);
  if (parsed === null) {
    console.error(RESOLVE_USAGE);
    process.exit(2);
  }

  const projectDir = resolveProjectDir();

  let resolved: ResolvedConfig;
  try {
    const resolveArgs: { repoRoot: string; sessionId?: string } = {
      repoRoot: projectDir,
    };
    if (parsed.sessionId !== undefined) {
      resolveArgs.sessionId = parsed.sessionId;
    }
    resolved = resolveConfig(resolveArgs);
  } catch (err) {
    if (err instanceof ConfigCascadeError) {
      console.error(error(err.message));
      process.exit(2);
    }
    // Non-cascade error — surface and exit 2 so operators can diagnose.
    const message = err instanceof Error ? err.message : String(err);
    console.error(error(message));
    process.exit(2);
  }

  const value = walkDotPath(resolved, parsed.key);
  if (value === undefined) {
    // Missing key / ancestor absent / descends into a non-record leaf.
    // Exit 1 silently per ideation §1g CLI exit-code mapping.
    process.exit(1);
  }

  if (parsed.withSources) {
    // `__sources` only records leaf provenance (primitives, arrays, and
    // explicit `null`). A non-leaf dot-path (e.g. `git`, `verification.commands`)
    // reaches an intermediate object — there is no single tier that wrote the
    // whole subtree, so returning `'default'` via fallback would be actively
    // misleading. Error out explicitly so the operator narrows to a leaf.
    const tier: TierId | undefined = resolved.__sources[parsed.key];
    if (tier === undefined) {
      console.error(
        error(
          `--with-sources requires a leaf dot-path; '${parsed.key}' resolves to a non-leaf (object) value. Narrow to a specific leaf key (e.g. '${parsed.key}.<field>').`,
        ),
      );
      process.exit(2);
    }
    process.stdout.write(JSON.stringify({ value, tier }) + '\n');
    return;
  }

  process.stdout.write(JSON.stringify(value) + '\n');
}
