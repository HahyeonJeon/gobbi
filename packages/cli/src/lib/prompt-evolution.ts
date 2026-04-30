/**
 * Prompt-evolution JSONL log writer + chain folder.
 *
 * The append-only event log of `spec.json` evolution per Wave C.1.4
 * (issue #156). Lives at:
 *
 *   `<project-root>/.gobbi/projects/<project>/prompt-evolution/<prompt-id>.jsonl`
 *
 * One file per closed prompt-id (`ideation`, `planning`, `execution`,
 * `evaluation`, `memorization`, `handoff`). The first line is a
 * synthetic genesis entry containing the full baseline `spec.json` as
 * an `add` op at root path `''` — this makes every JSONL self-
 * contained: any reader can fold the chain from line 1 and reproduce
 * the on-disk `spec.json` byte-exactly. Without genesis, JSONL is a
 * delta-only log requiring the on-disk spec as external input —
 * collapses the "JSONL is authoritative" property.
 *
 * # CQRS partition
 *
 * Per design synthesis §2: `state.db::events` is truth (the audit
 * event); `prompt_patches` table is the queryable read projection;
 * `spec.json` on disk is the materialized snapshot, derivable from the
 * JSONL chain. The replay-equivalence CI test at C.1.6 folds the JSONL
 * chain in memory, canonicalizes the result, hashes it, and asserts
 * byte-equality with `sha256(canonicalize(<on-disk spec.json>))`. Drift
 * here means either JSONL is corrupt or `spec.json` was hand-edited —
 * both detectable rather than silent.
 *
 * # Append discipline
 *
 * - Synchronous `appendFileSync` — `Bun.write` has no append mode
 *   (`_bun/SKILL.md:48`, `_bun/gotchas.md:72-87`).
 * - One call per line, line-buffered: the file stays valid even after
 *   partial-write SIGKILL (everything before the last `\n` is
 *   parseable JSONL).
 * - Each line ends with `\n`. No trailing comma, no array brackets —
 *   this is JSONL, not JSON.
 *
 * # Hashing
 *
 * Always hashes `canonicalize(value)` bytes — see `lib/canonical-json.ts`.
 * Separating the canonicalize step from the hash makes the test surface
 * straightforward (canonicalize is pure, hash is pure, the composition
 * is two named functions).
 */

import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { applyPatch, deepClone } from 'fast-json-patch';
import type { Operation } from 'fast-json-patch';

import { canonicalize } from './canonical-json.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Closed prompt-id set — mirrors `events/prompt.ts::PromptId`. */
export type PromptId =
  | 'ideation'
  | 'planning'
  | 'execution'
  | 'evaluation'
  | 'memorization'
  | 'handoff';

/**
 * One JSONL line — the wire shape per synthesis §7. `v` is the
 * line-schema version (distinct from the per-event `schema_version` and
 * from the StepSpec schema's `$id`).
 *
 * Keys mirror the SQLite `prompt_patches` columns (lowerCamelCase JSON,
 * snake_case SQL — established gobbi precedent at
 * `events/workflow.ts:73-86`). `eventSeq` back-links to
 * `state.db::events.seq`.
 *
 * Wave C.1.6 R1 / Overall F-4: the field formerly known as
 * `validationStatus` was removed. The prior pass dropped the
 * SQLite column but kept the JSONL field, leaving an asymmetric
 * wire shape (column gone, line constant carrying the same value).
 * Existence of the row IS the "passed" signal; a future schema-v2
 * status taxonomy will be a separate field. The fold-time reader
 * accepts and IGNORES `validationStatus` if a legacy line carries
 * it — see {@link parseEntry}.
 */
export interface PromptEvolutionEntry {
  readonly v: 1;
  readonly ts: string;
  readonly promptId: PromptId;
  readonly patchId: string;
  readonly parentPatchId: string | null;
  readonly preHash: string;
  readonly postHash: string;
  readonly ops: ReadonlyArray<Operation>;
  readonly appliedBy: 'operator';
  readonly eventSeq: number;
  readonly schemaId: string;
}

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

/**
 * Compute the sha256 of `canonicalize(value)`. Returned as a hex
 * `'sha256:<digest>'`-prefixed string so downstream tools (operator
 * reading audit logs, replay-equivalence diagnostics) can spot the
 * algorithm at a glance and a future algorithm change is unambiguous.
 */
export function contentHash(value: unknown): string {
  const bytes = canonicalize(value);
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}

// ---------------------------------------------------------------------------
// JSONL append (thin wrapper around appendFileSync)
//
// Architecture F-4 fix: there is no shared append-jsonl helper in
// `state-derivation.ts` (the line referenced in the briefing is inside another
// function, not a usable export). Synthesis §15 instructs us to
// publish a thin helper here rather than reuse a non-existent one.
// ---------------------------------------------------------------------------

/**
 * Append one well-formed JSONL line to `path`. The line is the
 * argument's exact bytes plus a trailing `\n` — callers control the
 * line-content shape (this helper does not stringify, validate, or
 * canonicalize).
 *
 * The single `appendFileSync` call gives us POSIX-level append-atomic
 * line semantics (under the small-write threshold) and recoverable
 * partial-write semantics under SIGKILL: the file always parses up to
 * the last `\n`. Mirrors `state-derivation.ts:464-465`'s temp+rename pattern in
 * intent (least-surprising filesystem write) but for an append-only
 * log, not a single-file overwrite.
 */
export function appendJsonlSync(path: string, line: string): void {
  appendFileSync(path, line + '\n', { encoding: 'utf8' });
}

// ---------------------------------------------------------------------------
// Genesis line — first JSONL entry per prompt-id
// ---------------------------------------------------------------------------

/**
 * Build the genesis `PromptEvolutionEntry` for a brand-new
 * `<prompt-id>.jsonl` from the full baseline `spec.json`. Synthesis §7
 * locks the shape: the ops array is a single RFC 6902 `add` at root
 * path `''` whose `value` is the entire baseline.
 *
 * `parentPatchId` is `null` (chain head). `preHash` is the content
 * hash of the empty-spec baseline (`{}`) — by convention the prior
 * "state" before genesis is the empty object so subsequent
 * replay-equivalence folds can bootstrap from it.
 */
export function buildGenesisEntry(args: {
  readonly promptId: PromptId;
  readonly baselineSpec: unknown;
  readonly ts: string;
  readonly schemaId: string;
  readonly eventSeq: number;
}): PromptEvolutionEntry {
  const ops: ReadonlyArray<Operation> = [
    { op: 'add', path: '', value: args.baselineSpec },
  ];
  const preHash = contentHash({});
  const postHash = contentHash(args.baselineSpec);
  const patchId = contentHash(ops);
  return {
    v: 1,
    ts: args.ts,
    promptId: args.promptId,
    patchId,
    parentPatchId: null,
    preHash,
    postHash,
    ops,
    appliedBy: 'operator',
    eventSeq: args.eventSeq,
    schemaId: args.schemaId,
  };
}

/**
 * Write the genesis entry to a fresh `<prompt-id>.jsonl` if it does
 * not already exist; otherwise no-op. Returns the entry that was
 * written (or would have been written, if the file already exists).
 *
 * Idempotent: re-running on an existing file is a read-and-return; the
 * caller can grep the returned `patchId` to confirm the genesis matches
 * what they expect.
 */
export function ensureGenesis(args: {
  readonly path: string;
  readonly promptId: PromptId;
  readonly baselineSpec: unknown;
  readonly ts: string;
  readonly schemaId: string;
  readonly eventSeq: number;
}): PromptEvolutionEntry {
  const entry = buildGenesisEntry(args);
  if (!existsSync(args.path)) {
    appendJsonlSync(args.path, JSON.stringify(entry));
  }
  return entry;
}

// ---------------------------------------------------------------------------
// Append a non-genesis entry
// ---------------------------------------------------------------------------

/**
 * Append a non-genesis `PromptEvolutionEntry` to `path`. The caller
 * supplies the fully-formed entry; this function only writes. Existence
 * of the parent file is not checked — callers MUST call
 * {@link ensureGenesis} first.
 */
export function appendPromptEvolutionEntry(
  path: string,
  entry: PromptEvolutionEntry,
): void {
  appendJsonlSync(path, JSON.stringify(entry));
}

// ---------------------------------------------------------------------------
// Chain fold — used by replay-equivalence test + `gobbi prompt rebuild`
// ---------------------------------------------------------------------------

export interface FoldResult {
  /** The final spec produced by folding every op in the chain. */
  readonly spec: unknown;
  /** Number of entries folded (genesis counts as 1). */
  readonly entryCount: number;
  /** The last entry's `postHash` (must match `contentHash(spec)`). */
  readonly lastPostHash: string;
}

/**
 * Read every line of a `<prompt-id>.jsonl` file, parse each as a
 * `PromptEvolutionEntry`, and fold the ops into a final spec. Genesis
 * line's `add path:''` op materialises the baseline; subsequent ops
 * mutate the in-memory clone via `fast-json-patch::applyPatch`.
 *
 * Throws with a clear diagnostic when:
 *
 *   - The file is empty or missing.
 *   - A line fails to JSON-parse.
 *   - A line fails the entry shape check (missing required field).
 *   - A patch op fails to apply (RFC 6902 `test` op fail, invalid path).
 *   - The fold produces a `postHash` that disagrees with the entry's
 *     declared `postHash` — chain corruption.
 *   - `parentPatchId` chains do not link end-to-end.
 *
 * Used by:
 *   - `specs/__tests__/replay-equivalence.test.ts` (Wave C.1.6 — folds
 *     every step's JSONL and byte-compares to on-disk spec.json).
 *   - `commands/prompt/rebuild.ts` (Wave C.1.7 — recovers a missing /
 *     out-of-sync `spec.json` from the JSONL chain).
 */
export function foldChain(path: string): FoldResult {
  if (!existsSync(path)) {
    throw new Error(`prompt-evolution: file not found: ${path}`);
  }
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split('\n').filter((l) => l.length > 0);
  if (lines.length === 0) {
    throw new Error(`prompt-evolution: file is empty: ${path}`);
  }

  let spec: unknown = {};
  let lastPostHash: string | null = null;
  let lastPatchId: string | null = null;

  lines.forEach((line, index) => {
    let entry: PromptEvolutionEntry;
    try {
      entry = parseEntry(JSON.parse(line));
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(
        `prompt-evolution: ${path} line ${index + 1}: ${reason}`,
      );
    }

    // Chain linkage check — every non-genesis line must point at the
    // prior line's patchId.
    if (index === 0) {
      if (entry.parentPatchId !== null) {
        throw new Error(
          `prompt-evolution: ${path} line 1: genesis line must have parentPatchId=null (got ${String(
            entry.parentPatchId,
          )})`,
        );
      }
    } else {
      if (entry.parentPatchId !== lastPatchId) {
        throw new Error(
          `prompt-evolution: ${path} line ${index + 1}: parentPatchId=${String(
            entry.parentPatchId,
          )} does not match prior line's patchId=${String(lastPatchId)}`,
        );
      }
    }

    // Apply the ops to a deep clone of the current spec. This catches
    // RFC 6902 `test` op failures and invalid-path errors.
    let result: ReturnType<typeof applyPatch<unknown>>;
    try {
      result = applyPatch(deepClone(spec), [...entry.ops]);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      throw new Error(
        `prompt-evolution: ${path} line ${index + 1}: applyPatch failed: ${reason}`,
      );
    }
    spec = result.newDocument;

    // Hash check — the entry's declared postHash must match the
    // canonicalized post-apply spec. Drift here is corruption.
    const computed = contentHash(spec);
    if (computed !== entry.postHash) {
      throw new Error(
        `prompt-evolution: ${path} line ${index + 1}: postHash mismatch — ` +
          `entry declares ${entry.postHash}, computed ${computed}`,
      );
    }

    lastPostHash = entry.postHash;
    lastPatchId = entry.patchId;
  });

  return {
    spec,
    entryCount: lines.length,
    // Non-null after the forEach (lines.length > 0 was checked).
    lastPostHash: lastPostHash as unknown as string,
  };
}

// ---------------------------------------------------------------------------
// Entry shape validation
// ---------------------------------------------------------------------------

/**
 * Narrow an unknown JSON value to a `PromptEvolutionEntry`. Throws on
 * any missing or wrong-typed field — the JSONL line shape is our wire
 * contract, so a malformed line is a corruption signal, not a soft
 * error.
 */
function parseEntry(value: unknown): PromptEvolutionEntry {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('entry must be a JSON object');
  }
  const obj = value as Record<string, unknown>;

  function requireString(key: string): string {
    const v = obj[key];
    if (typeof v !== 'string') {
      throw new Error(`field ${key} must be a string (got ${typeof v})`);
    }
    return v;
  }
  function requireNumber(key: string): number {
    const v = obj[key];
    if (typeof v !== 'number') {
      throw new Error(`field ${key} must be a number (got ${typeof v})`);
    }
    return v;
  }

  if (obj['v'] !== 1) {
    throw new Error(`field v must equal 1 (got ${String(obj['v'])})`);
  }
  const promptId = requireString('promptId');
  const PROMPT_IDS = new Set([
    'ideation',
    'planning',
    'execution',
    'evaluation',
    'memorization',
    'handoff',
  ]);
  if (!PROMPT_IDS.has(promptId)) {
    throw new Error(`field promptId is not a valid prompt-id: ${promptId}`);
  }

  const parentPatchIdRaw = obj['parentPatchId'];
  if (parentPatchIdRaw !== null && typeof parentPatchIdRaw !== 'string') {
    throw new Error(
      `field parentPatchId must be string or null (got ${typeof parentPatchIdRaw})`,
    );
  }

  const opsRaw = obj['ops'];
  if (!Array.isArray(opsRaw)) {
    throw new Error('field ops must be an array');
  }

  // Wave C.1.6 R1 / Overall F-4: `validationStatus` was dropped from
  // the wire shape. Legacy lines may carry `validationStatus: 'passed'`
  // — accept and IGNORE so older JSONL chains keep folding cleanly.
  // A line with a non-'passed' value (which never legitimately existed)
  // is rejected as corruption.
  if (
    'validationStatus' in obj &&
    obj['validationStatus'] !== 'passed'
  ) {
    throw new Error(
      `field validationStatus, when present, must equal 'passed' (got ${String(
        obj['validationStatus'],
      )})`,
    );
  }
  if (obj['appliedBy'] !== 'operator') {
    throw new Error(
      `field appliedBy must be 'operator' (got ${String(obj['appliedBy'])})`,
    );
  }

  return {
    v: 1,
    ts: requireString('ts'),
    promptId: promptId as PromptId,
    patchId: requireString('patchId'),
    parentPatchId: parentPatchIdRaw,
    preHash: requireString('preHash'),
    postHash: requireString('postHash'),
    ops: opsRaw as ReadonlyArray<Operation>,
    appliedBy: 'operator',
    eventSeq: requireNumber('eventSeq'),
    schemaId: requireString('schemaId'),
  };
}
