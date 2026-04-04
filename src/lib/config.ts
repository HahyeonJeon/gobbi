/**
 * gobbi.json data operations — read, write, migrate, and clean up session config.
 *
 * This module is the pure data layer for gobbi.json. It has no locking — callers
 * are responsible for acquiring a lock (via withLock from lockfile.ts) before
 * calling writeGobbiJsonAtomic or any read-modify-write sequence.
 */

import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const GOBBI_VERSION = '0.3.2';
export const GOBBI_ARCHITECTURE = 'claude-source';
export const TTL_DAYS = 7;
export const MAX_SESSIONS = 10;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NotifyConfig {
  slack: boolean;
  telegram: boolean;
}

export interface Session {
  notify: NotifyConfig;
  trivialRange: string;
  evaluationMode: string;
  gitWorkflow: string;
  baseBranch: string | null;
  createdAt: string;
  lastAccessedAt: string;
}

export interface GobbiJson {
  version: string;
  architecture: string;
  sessions: Record<string, Session>;
}

export type JsonValue = string | number | boolean | null;

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isNotifyConfig(value: unknown): value is NotifyConfig {
  if (!isRecord(value)) return false;
  return isBoolean(value['slack']) && isBoolean(value['telegram']);
}

function isSession(value: unknown): value is Session {
  if (!isRecord(value)) return false;
  return (
    isNotifyConfig(value['notify']) &&
    isString(value['trivialRange']) &&
    isString(value['evaluationMode']) &&
    isString(value['gitWorkflow']) &&
    (value['baseBranch'] === null || isString(value['baseBranch'])) &&
    isString(value['createdAt']) &&
    isString(value['lastAccessedAt'])
  );
}

function isSessionRecord(value: unknown): value is Record<string, Session> {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isSession);
}

function isGobbiJson(value: unknown): value is GobbiJson {
  if (!isRecord(value)) return false;
  return (
    isString(value['version']) &&
    isString(value['architecture']) &&
    isSessionRecord(value['sessions'])
  );
}

// ---------------------------------------------------------------------------
// Factories
// ---------------------------------------------------------------------------

/**
 * Returns a fresh gobbi.json structure with no sessions.
 */
export function emptyGobbiJson(): GobbiJson {
  return {
    version: GOBBI_VERSION,
    architecture: GOBBI_ARCHITECTURE,
    sessions: {},
  };
}

/**
 * Returns a new session object with default values.
 */
export function defaultSession(): Session {
  const ts = nowIso();
  return {
    notify: { slack: false, telegram: false },
    trivialRange: 'read-only',
    evaluationMode: 'ask-each-time',
    gitWorkflow: 'direct-commit',
    baseBranch: null,
    createdAt: ts,
    lastAccessedAt: ts,
  };
}

// ---------------------------------------------------------------------------
// Read / Write
// ---------------------------------------------------------------------------

/**
 * Read and parse gobbi.json from disk.
 * Returns null if the file is missing or contains invalid JSON / unexpected shape.
 */
export async function readGobbiJson(filePath: string): Promise<GobbiJson | null> {
  let raw: string;
  try {
    raw = await readFile(filePath, 'utf8');
  } catch (err: unknown) {
    if (isNodeErrnoException(err) && err.code === 'ENOENT') {
      return null;
    }
    throw err;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }

  if (!isGobbiJson(parsed)) {
    return null;
  }

  return parsed;
}

/**
 * Write gobbi.json atomically: write to a temp file in the same directory,
 * then rename to the target path. The rename is atomic on same-filesystem writes.
 *
 * Callers MUST hold the file lock before calling this.
 */
export async function writeGobbiJsonAtomic(filePath: string, data: GobbiJson): Promise<void> {
  const dir = dirname(filePath);
  const tmpPath = join(dir, `gobbi.json.${randomUUID()}.tmp`);
  const serialized = JSON.stringify(data, null, 2);

  await writeFile(tmpPath, serialized, 'utf8');
  await rename(tmpPath, filePath);
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

/**
 * Detect whether the given data is in v0.3.1 format:
 * has "version" key but does NOT have a "sessions" key.
 */
export function needsMigration(data: unknown): boolean {
  if (!isRecord(data)) return false;
  return 'version' in data && !('sessions' in data);
}

/**
 * Migrate v0.3.1 format to v0.3.2, or return the data as-is if already v0.3.2.
 *
 * v0.3.1 → v0.3.2: preserve all existing fields, set version to current,
 * add empty sessions object.
 */
export function migrateIfNeeded(data: unknown): GobbiJson {
  if (!needsMigration(data)) {
    // Already v0.3.2 (or unknown): validate and return, or return empty
    if (isGobbiJson(data)) {
      return data;
    }
    return emptyGobbiJson();
  }

  // data is a record with "version" but no "sessions" — v0.3.1 format
  const base = isRecord(data) ? { ...data } : {};
  return {
    ...base,
    version: GOBBI_VERSION,
    sessions: {},
  } as GobbiJson;
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

/**
 * Apply TTL and max-entries cleanup to session data.
 *
 * Step 1: Remove sessions whose lastAccessedAt is older than ttlDays.
 * Step 2: If more than maxSessions remain, keep only the newest by lastAccessedAt.
 *
 * ISO 8601 strings sort correctly as strings (lexicographic order matches chronological).
 * Returns a new GobbiJson — does not mutate input.
 */
export function runCleanup(
  data: GobbiJson,
  ttlDays: number = TTL_DAYS,
  maxSessions: number = MAX_SESSIONS,
): GobbiJson {
  const cutoff = cutoffIso(ttlDays);

  // Step 1: TTL filter
  const afterTtl: Record<string, Session> = {};
  for (const [id, session] of Object.entries(data.sessions)) {
    if (session.lastAccessedAt >= cutoff) {
      afterTtl[id] = session;
    }
  }

  // Step 2: Max-sessions cap — keep newest by lastAccessedAt
  const entries = Object.entries(afterTtl);
  const capped: Record<string, Session> = {};

  if (entries.length > maxSessions) {
    entries
      .sort((a, b) => {
        const aTime = a[1]?.lastAccessedAt ?? '';
        const bTime = b[1]?.lastAccessedAt ?? '';
        // Descending: newest first
        return bTime < aTime ? -1 : bTime > aTime ? 1 : 0;
      })
      .slice(0, maxSessions)
      .forEach(([id, session]) => {
        capped[id] = session;
      });
  } else {
    for (const [id, session] of entries) {
      capped[id] = session;
    }
  }

  return { ...data, sessions: capped };
}

// ---------------------------------------------------------------------------
// Value coercion
// ---------------------------------------------------------------------------

/**
 * Coerce a CLI string argument to a typed JSON value.
 * "true" → true, "false" → false, "null" → null, everything else → string.
 */
export function coerceValue(value: string): JsonValue {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  return value;
}

// ---------------------------------------------------------------------------
// Dot-path access
// ---------------------------------------------------------------------------

/**
 * Get a value from a nested object by dot-path (e.g. "notify.slack").
 * Returns undefined if any segment is missing or not an object.
 */
export function getNestedValue(obj: Record<string, unknown>, dotPath: string): unknown {
  const parts = dotPath.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (!isRecord(current)) return undefined;
    current = current[part];
  }

  return current;
}

/**
 * Set a value at a dot-path on a nested object (e.g. "notify.slack").
 * Creates intermediate objects as needed.
 * Returns a new object — does not mutate input.
 */
export function setNestedValue(
  obj: Record<string, unknown>,
  dotPath: string,
  value: JsonValue,
): Record<string, unknown> {
  const parts = dotPath.split('.');

  // Recursively build a new object tree
  function setIn(
    current: Record<string, unknown>,
    remainingParts: readonly string[],
  ): Record<string, unknown> {
    const [head, ...tail] = remainingParts;

    if (head === undefined) {
      // Should not happen given non-empty parts, but satisfies strict checks
      return current;
    }

    if (tail.length === 0) {
      // Leaf — set value
      return { ...current, [head]: value };
    }

    // Intermediate — recurse
    const next = isRecord(current[head]) ? (current[head] as Record<string, unknown>) : {};
    return { ...current, [head]: setIn(next, tail) };
  }

  return setIn(obj, parts);
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * Current UTC time as ISO 8601 string without milliseconds.
 * Matches the shell's: date -u '+%Y-%m-%dT%H:%M:%SZ'
 */
export function nowIso(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * ISO 8601 timestamp for `ttlDays` days ago, without milliseconds.
 */
function cutoffIso(ttlDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - ttlDays);
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

// ---------------------------------------------------------------------------
// Internal utilities
// ---------------------------------------------------------------------------

interface NodeErrnoException extends Error {
  code?: string;
}

function isNodeErrnoException(err: unknown): err is NodeErrnoException {
  return err instanceof Error && 'code' in err;
}
