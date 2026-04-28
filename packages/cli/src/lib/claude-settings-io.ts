/**
 * Filesystem I/O for `.claude/settings.json` (Claude Code's repo-level
 * settings file). Parallels {@link ./settings-io.ts} for gobbi's own
 * `.gobbi/.../settings.json` cascade — same atomic-write discipline, same
 * "missing file is not an error" read semantics, but a different schema:
 * Claude Code owns the file format, gobbi only reads/modifies the
 * `hooks` block within a strict trust boundary.
 *
 * ## Trust boundary
 *
 * `gobbi notify configure --enable/--disable` ONLY mutates hook entries
 * whose `command` field starts with the literal `'gobbi '` (note the
 * trailing space — `gobbihook` is NOT a gobbi-owned hook). Entries
 * written by the user or other tools (e.g., `claude-trace`) are read but
 * never modified. The {@link isGobbiOwnedHook} predicate is the single
 * source of truth for that boundary; callers must use it before any
 * mutation.
 *
 * ## Unknown keys preserved
 *
 * Claude Code may extend `.claude/settings.json` with new top-level keys
 * over time (e.g., `permissions`, `mcpServers`, `enabledPlugins`). Reads
 * preserve them as opaque `unknown` so a subsequent write back round-
 * trips them untouched. Only the `hooks` block is modeled in detail.
 *
 * ## Pretty-printing
 *
 * Writes use 2-space indentation with a trailing newline — matches the
 * format Claude Code itself writes when it owns the file. This keeps
 * `git diff` of `.claude/settings.json` minimal when gobbi adds/removes
 * a single hook entry.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Public types — mirror Claude Code's hook-block schema.
// ---------------------------------------------------------------------------

/**
 * Single hook entry inside an event block's `hooks` array. Claude Code
 * supports more types than `'command'` in principle, but every gobbi-
 * managed entry uses the command form, and the trust boundary keeps us
 * out of any other shape's business.
 */
export interface ClaudeSettingsHookEntry {
  readonly type: 'command';
  readonly command: string;
  readonly timeout?: number;
  readonly matcher?: string;
}

/**
 * One block under an event key. The block-level `matcher` (when present)
 * filters which tool/event invocations the inner `hooks` array fires
 * for. gobbi-owned entries inherit any block-level `matcher` from the
 * surrounding block — `--enable` writes an unmatched block (no
 * `matcher`) which fires for all invocations of the event.
 */
export interface ClaudeSettingsEventBlock {
  readonly matcher?: string;
  readonly hooks: readonly ClaudeSettingsHookEntry[];
}

/**
 * The top-level `hooks` block. Keys are Claude Code event names
 * (PascalCase, matching {@link HookTrigger} from `settings.ts`); values
 * are arrays of {@link ClaudeSettingsEventBlock}.
 */
export interface ClaudeSettingsHookGroup {
  readonly [eventName: string]: readonly ClaudeSettingsEventBlock[] | undefined;
}

/**
 * The whole `.claude/settings.json` document. `hooks` is the only
 * block gobbi understands; every other top-level key is preserved
 * verbatim via the index signature.
 */
export interface ClaudeSettings {
  readonly hooks?: ClaudeSettingsHookGroup;
  readonly [otherKey: string]: unknown;
}

// ---------------------------------------------------------------------------
// Path helper
// ---------------------------------------------------------------------------

/** Path to `.claude/settings.json` relative to the repository root. */
export function claudeSettingsPath(repoRoot: string): string {
  return path.join(repoRoot, '.claude', 'settings.json');
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/**
 * Read and parse `.claude/settings.json`. Returns an empty object `{}`
 * when the file does not exist — fresh repos may not yet have one and
 * `--status` should still render.
 *
 *   - File absent → `{}` (not an error).
 *   - File present but unreadable → throws `Error` with the path + cause.
 *   - File present but malformed JSON → throws `Error` with the path
 *     and the underlying parse message.
 *   - File present and parses but is not a JSON object → throws `Error`
 *     (Claude Code never writes a non-object root; rejecting one here
 *     prevents a corrupted file from silently round-tripping).
 *
 * The returned shape is typed as {@link ClaudeSettings}; consumers must
 * still narrow `hooks[event]` before treating it as a non-empty array.
 */
export function readClaudeSettings(repoRoot: string): ClaudeSettings {
  const filePath = claudeSettingsPath(repoRoot);
  if (!existsSync(filePath)) {
    return {};
  }

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read ${filePath}: ${message}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Invalid JSON in ${filePath}: ${message}`);
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(
      `Invalid ${filePath}: expected a JSON object at root, got ${
        Array.isArray(parsed) ? 'array' : typeof parsed
      }`,
    );
  }

  return parsed as ClaudeSettings;
}

// ---------------------------------------------------------------------------
// Atomic write
// ---------------------------------------------------------------------------

/**
 * Atomically write `.claude/settings.json`. Pretty-prints with 2-space
 * indentation and a trailing newline. Creates the parent directory
 * (`.claude/`) if missing.
 *
 *   1. `JSON.stringify(settings, null, 2)` + trailing newline.
 *   2. Write to `<path>.tmp`.
 *   3. `renameSync` to the final path.
 *
 * Atomic write protects readers (Claude Code itself, other tools) from
 * seeing a half-written file when the process is interrupted mid-write.
 * Solo-user context: no file-locking needed.
 *
 * Callers that strip a key down to nothing should remove the key from
 * the input rather than writing `{ ..., hooks: {} }` — this keeps the
 * on-disk diff minimal.
 */
export function writeClaudeSettings(repoRoot: string, settings: ClaudeSettings): void {
  const filePath = claudeSettingsPath(repoRoot);
  mkdirSync(path.dirname(filePath), { recursive: true });

  const payload = `${JSON.stringify(settings, null, 2)}\n`;
  const tmpPath = `${filePath}.tmp`;
  writeFileSync(tmpPath, payload, 'utf8');
  renameSync(tmpPath, filePath);
}

// ---------------------------------------------------------------------------
// Trust-boundary predicate
// ---------------------------------------------------------------------------

/**
 * Return `true` iff this hook entry is owned by gobbi. Trust-boundary
 * single source of truth — every mutation path consults this predicate
 * before touching an entry.
 *
 * Definition: `entry.type === 'command'` AND
 * `entry.command.startsWith('gobbi ')` (note the trailing space).
 *
 * The trailing space is deliberate: `gobbi-trace` or `gobbihook` are
 * NOT gobbi entries even though they share a prefix; only commands
 * that begin with the literal `'gobbi '` token are safe to modify.
 */
export function isGobbiOwnedHook(entry: ClaudeSettingsHookEntry): boolean {
  return entry.type === 'command' && entry.command.startsWith('gobbi ');
}
