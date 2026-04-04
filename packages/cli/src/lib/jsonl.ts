/**
 * JSONL transcript parser for Claude Code session transcripts.
 *
 * Provides streaming, line-by-line parsing of `.jsonl` files (one JSON object
 * per line). Used by gobbi-cli commands that migrate away from `jq` and
 * `python3` usage in the shell scripts.
 *
 * - `parseJsonlFile`       — async generator yielding parsed lines
 * - `extractMessageContent` — extract text from string or content-array
 * - `aggregateTokenUsage`  — sum token usage across all assistant messages
 * - `findLastToolUse`      — find the last tool_use block by name
 * - `readFirstLine`        — efficiently read and parse the first JSONL line
 * - `readLastLine`         — read and parse the last JSONL line
 */

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

import { isRecord, isArray, isString, isNumber } from './guards.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Token usage counters from a Claude assistant message. */
export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens: number;
  cache_read_input_tokens: number;
}

/** Result of a tool_use block match with its originating line timestamp. */
export interface ToolUseResult {
  input: unknown;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Core parser
// ---------------------------------------------------------------------------

/**
 * Stream-parse a JSONL file, yielding each parsed line as `unknown`.
 *
 * Empty lines and lines that fail `JSON.parse` are silently skipped. If the
 * file does not exist or cannot be opened, the generator completes without
 * yielding and without throwing.
 */
export async function* parseJsonlFile(path: string): AsyncGenerator<unknown> {
  let rl: ReturnType<typeof createInterface> | null = null;

  try {
    const stream = createReadStream(path, { encoding: 'utf8' });

    // Catch stream errors (e.g. file not found) before readline consumes them
    const streamReady = new Promise<boolean>((resolve) => {
      stream.once('open', () => resolve(true));
      stream.once('error', () => resolve(false));
    });

    const opened = await streamReady;
    if (!opened) {
      stream.destroy();
      return;
    }

    rl = createInterface({ input: stream, crlfDelay: Infinity });

    for await (const line of rl) {
      const trimmed = line.trim();
      if (trimmed === '') continue;

      try {
        yield JSON.parse(trimmed) as unknown;
      } catch {
        // Skip malformed lines
      }
    }
  } catch {
    // File-level errors — return without throwing
  } finally {
    rl?.close();
  }
}

// ---------------------------------------------------------------------------
// Content extraction
// ---------------------------------------------------------------------------

/**
 * Extract text from a Claude message's `content` field.
 *
 * - If `content` is a string, returns it directly.
 * - If `content` is an array, finds the first element with `type === "text"`
 *   and returns its `.text` field.
 * - Returns an empty string for anything else or when no text block is found.
 */
export function extractMessageContent(content: unknown): string {
  if (isString(content)) {
    return content;
  }

  if (isArray(content)) {
    for (const element of content) {
      if (isRecord(element) && element['type'] === 'text') {
        const text = element['text'];
        if (isString(text)) {
          return text;
        }
      }
    }
  }

  return '';
}

// ---------------------------------------------------------------------------
// Token usage aggregation
// ---------------------------------------------------------------------------

/**
 * Sum token usage across all assistant messages in a JSONL file.
 *
 * Finds lines with a `.message.usage` object and accumulates
 * `input_tokens`, `output_tokens`, `cache_creation_input_tokens`, and
 * `cache_read_input_tokens`. Missing fields default to 0.
 *
 * Reads the file in a single streaming pass — no in-memory accumulation of
 * parsed lines.
 */
export async function aggregateTokenUsage(filePath: string): Promise<TokenUsage> {
  const acc: TokenUsage = {
    input_tokens: 0,
    output_tokens: 0,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  };

  for await (const obj of parseJsonlFile(filePath)) {
    if (!isRecord(obj)) continue;

    const message = obj['message'];
    if (!isRecord(message)) continue;

    const usage = message['usage'];
    if (!isRecord(usage)) continue;

    const inputTokens = usage['input_tokens'];
    const outputTokens = usage['output_tokens'];
    const cacheCreation = usage['cache_creation_input_tokens'];
    const cacheRead = usage['cache_read_input_tokens'];

    if (isNumber(inputTokens)) acc.input_tokens += inputTokens;
    if (isNumber(outputTokens)) acc.output_tokens += outputTokens;
    if (isNumber(cacheCreation)) acc.cache_creation_input_tokens += cacheCreation;
    if (isNumber(cacheRead)) acc.cache_read_input_tokens += cacheRead;
  }

  return acc;
}

// ---------------------------------------------------------------------------
// Tool-use search
// ---------------------------------------------------------------------------

/**
 * Find the last occurrence of a named `tool_use` block in a JSONL file.
 *
 * Searches lines where `.message.content` is an array, scanning each element
 * for `{ type: "tool_use", name: toolName }`. Returns the last match to
 * support plan revisions (multiple `ExitPlanMode` calls).
 *
 * Returns `null` if no matching block is found or the file is missing/empty.
 */
export async function findLastToolUse(
  filePath: string,
  toolName: string,
): Promise<ToolUseResult | null> {
  let last: ToolUseResult | null = null;

  for await (const obj of parseJsonlFile(filePath)) {
    if (!isRecord(obj)) continue;

    const message = obj['message'];
    if (!isRecord(message)) continue;

    const content = message['content'];
    if (!isArray(content)) continue;

    for (const block of content) {
      if (!isRecord(block)) continue;
      if (block['type'] !== 'tool_use') continue;
      if (block['name'] !== toolName) continue;

      const timestamp = obj['timestamp'];
      last = {
        input: block['input'],
        timestamp: isString(timestamp) ? timestamp : '',
      };
    }
  }

  return last;
}

// ---------------------------------------------------------------------------
// First / last line helpers
// ---------------------------------------------------------------------------

/**
 * Read and parse the first line of a JSONL file.
 *
 * Stops reading after the first non-empty parseable line. Returns `null` if
 * the file is missing, empty, or the first line is not valid JSON.
 */
export async function readFirstLine(filePath: string): Promise<unknown | null> {
  for await (const obj of parseJsonlFile(filePath)) {
    return obj;
  }
  return null;
}

/**
 * Read and parse the last line of a JSONL file.
 *
 * Reads the entire file in a streaming pass, keeping only the most recently
 * parsed line. Returns `null` if the file is missing or contains no
 * parseable lines.
 */
export async function readLastLine(filePath: string): Promise<unknown | null> {
  let last: unknown = null;
  for await (const obj of parseJsonlFile(filePath)) {
    last = obj;
  }
  return last;
}
