/**
 * Anthropic per-model token cost rates + derived-cost utilities.
 *
 * Consumed by `gobbi workflow status --cost` (E.6). The rate table is
 * authoritative for token-derived cost estimation; the byte-based proxy
 * rate is a coarse fallback for legacy/synthetic `delegation.complete`
 * events that do not carry a `tokensUsed` usage block.
 *
 * Per lock L1 (v0.5.0 Phase 2 plan), this module is the single-path
 * source of cost estimation — `cost_usd` branches MUST NOT be resurrected
 * elsewhere. If a `delegation.complete` event carries neither
 * `tokensUsed` nor `sizeProxyBytes`, the event contributes 0 to the
 * rollup — never raise, never infer.
 *
 * All entry points are pure and defensive: they accept `unknown` and
 * return `0` on any parse/shape failure. They must NEVER throw — the
 * `status --cost` renderer treats the result as a best-effort estimate.
 */

import { isNumber, isRecord, isString } from './guards.js';

// ---------------------------------------------------------------------------
// Rate table
// ---------------------------------------------------------------------------

/**
 * Per-million-token dollar rate for a single model. Cache read rate is
 * 10% of input; cache creation rate is 1.25x input (5-minute bucket is the
 * default at the Anthropic API level). See lastUpdated comment above
 * {@link MODEL_RATES} for source URL.
 */
export interface ModelRate {
  readonly inputPerMillion: number;
  readonly outputPerMillion: number;
  readonly cacheReadPerMillion: number;
  readonly cacheCreationPerMillion: number;
}

// lastUpdated: 2026-04-18 — refresh per CLI release cut.
// Source: https://platform.claude.com/docs/en/about-claude/pricing
// Cache read   = inputPerMillion * 0.10
// Cache create = inputPerMillion * 1.25 (5-minute ephemeral bucket)
export const MODEL_RATES: Readonly<Record<string, ModelRate>> = {
  'claude-opus-4-6': {
    inputPerMillion: 5,
    outputPerMillion: 25,
    cacheReadPerMillion: 0.5,
    cacheCreationPerMillion: 6.25,
  },
  'claude-opus-4-7': {
    // Same family as 4-6 until the pricing page publishes a distinct row.
    inputPerMillion: 5,
    outputPerMillion: 25,
    cacheReadPerMillion: 0.5,
    cacheCreationPerMillion: 6.25,
  },
  'claude-sonnet-4-5': {
    inputPerMillion: 3,
    outputPerMillion: 15,
    cacheReadPerMillion: 0.3,
    cacheCreationPerMillion: 3.75,
  },
  'claude-sonnet-4-6': {
    inputPerMillion: 3,
    outputPerMillion: 15,
    cacheReadPerMillion: 0.3,
    cacheCreationPerMillion: 3.75,
  },
  'claude-haiku-4-5-20251001': {
    inputPerMillion: 1,
    outputPerMillion: 5,
    cacheReadPerMillion: 0.1,
    cacheCreationPerMillion: 1.25,
  },
};

// ---------------------------------------------------------------------------
// Byte-proxy fallback rate
// ---------------------------------------------------------------------------

/**
 * Dollar-per-byte rate for the `sizeProxyBytes` fallback path. Used when
 * a `delegation.complete` event records only the response byte count and
 * no `tokensUsed` usage block — typically older transcripts captured
 * before PR E wired `message.usage` into the event pipeline, or synthetic
 * lines that skipped the usage block entirely.
 *
 * Derivation (conservative — error bar is "coarse estimate"):
 *
 *   - Assume all bytes are OUTPUT tokens of the priciest model in the
 *     current table (claude-opus-4-6/7 at $25 / 1M output tokens).
 *   - Assume ~4 bytes per output token (close to 4.0 for English prose
 *     under the Claude tokenizer; a safe floor that overestimates rather
 *     than underestimates for terse or non-English transcripts).
 *   - $25 / 1M tokens / 4 bytes-per-token = $6.25 / 1M bytes
 *     = 6.25e-6 / byte.
 *
 * Intent: when a session mixes real and proxy-derived events, the proxy
 * row biases the rollup slightly UP — operators see "something happened"
 * rather than a zero-dollar miss. The distinct `proxy` source counter in
 * the renderer flags the precision gap.
 */
export const PROXY_DOLLARS_PER_BYTE = 25 / 1_000_000 / 4;

// ---------------------------------------------------------------------------
// Usage-object shape parsed from message.usage
// ---------------------------------------------------------------------------

/**
 * Subset of Anthropic's `message.usage` shape that E.6 consumes. The
 * field names match the API payload verbatim so a raw JSON.parse of the
 * `data.tokensUsed` value round-trips into this interface without
 * renaming.
 */
interface MessageUsage {
  readonly input_tokens: number;
  readonly output_tokens: number;
  readonly cache_read_input_tokens: number;
  readonly cache_creation_input_tokens: number;
}

// ---------------------------------------------------------------------------
// derivedCost — public
// ---------------------------------------------------------------------------

/**
 * Compute the dollar cost of a single `delegation.complete` event from
 * its `tokensUsed` (message.usage) and `model` fields.
 *
 * Shape contract:
 *
 *   - `tokensUsed` — either the parsed usage object, the JSON-string form
 *     produced by SQLite's `json_extract` on an object path, `null`, or
 *     any other shape. Partial objects are tolerated — missing usage
 *     fields are treated as zero contributions.
 *   - `model` — model id string. Unknown models → 0 (safe fallback, so a
 *     new model name does not crash the rollup).
 *
 * Defensive: returns 0 on any parse or shape failure. NEVER throws.
 * Negative token counts (theoretically possible under corrupted
 * transcripts) are clamped at the field level — they contribute 0, not a
 * negative credit.
 */
export function derivedCost(tokensUsed: unknown, model: unknown): number {
  if (!isString(model)) return 0;
  const rate = MODEL_RATES[model];
  if (rate === undefined) return 0;

  const usage = parseUsage(tokensUsed);
  if (usage === null) return 0;

  const inputTokens = clampNonNegative(usage.input_tokens);
  const outputTokens = clampNonNegative(usage.output_tokens);
  const cacheReadTokens = clampNonNegative(usage.cache_read_input_tokens);
  const cacheCreationTokens = clampNonNegative(usage.cache_creation_input_tokens);

  return (
    (inputTokens / 1_000_000) * rate.inputPerMillion +
    (outputTokens / 1_000_000) * rate.outputPerMillion +
    (cacheReadTokens / 1_000_000) * rate.cacheReadPerMillion +
    (cacheCreationTokens / 1_000_000) * rate.cacheCreationPerMillion
  );
}

/**
 * Compute the proxy dollar cost of a `delegation.complete` event that
 * carries only a `sizeProxyBytes` field. Defensive: non-number / negative
 * inputs return 0. NEVER throws.
 */
export function proxyCost(sizeProxyBytes: unknown): number {
  if (!isNumber(sizeProxyBytes)) return 0;
  if (!Number.isFinite(sizeProxyBytes)) return 0;
  if (sizeProxyBytes <= 0) return 0;
  return sizeProxyBytes * PROXY_DOLLARS_PER_BYTE;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

/**
 * Normalise an unknown `tokensUsed` value into a MessageUsage object.
 * Accepts either a pre-parsed object or a JSON string (as SQLite's
 * `json_extract` returns for object-typed paths). Missing usage fields
 * default to 0 so partial payloads contribute what they can. Returns
 * `null` when the shape is unusable (array, scalar, malformed JSON).
 */
function parseUsage(tokensUsed: unknown): MessageUsage | null {
  if (tokensUsed === null || tokensUsed === undefined) return null;

  let candidate: unknown = tokensUsed;
  if (isString(tokensUsed)) {
    try {
      candidate = JSON.parse(tokensUsed);
    } catch {
      return null;
    }
  }

  if (!isRecord(candidate)) return null;

  const input = candidate['input_tokens'];
  const output = candidate['output_tokens'];
  const cacheRead = candidate['cache_read_input_tokens'];
  const cacheCreate = candidate['cache_creation_input_tokens'];

  const hasAnyField =
    isNumber(input) || isNumber(output) || isNumber(cacheRead) || isNumber(cacheCreate);
  if (!hasAnyField) return null;

  return {
    input_tokens: isNumber(input) ? input : 0,
    output_tokens: isNumber(output) ? output : 0,
    cache_read_input_tokens: isNumber(cacheRead) ? cacheRead : 0,
    cache_creation_input_tokens: isNumber(cacheCreate) ? cacheCreate : 0,
  };
}

/**
 * Clamp a token count to `>= 0` and finite. Negative/NaN/Infinity from
 * corrupted transcripts contribute 0, not a negative credit.
 */
function clampNonNegative(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  return n;
}
