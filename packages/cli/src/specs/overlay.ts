/**
 * Substate overlay engine — deep-merge + `$ops` directives that adapt a base
 * `StepSpec` for a specific substate of its step.
 *
 * Authoritative design: `v050-prompts.md` §Substate Overlays, §Spec Schema;
 * `v050-state-machine.md` §Workflow Steps and Substates.
 *
 * ---------------------------------------------------------------------------
 *  Reconciliation note — 5 productive steps vs a larger graph
 * ---------------------------------------------------------------------------
 *
 * The workflow has two related but distinct models that must not be confused:
 *
 * 1. The PRODUCTIVE STEP MODEL. `StepId` is the union
 *    `'ideation' | 'planning' | 'execution' | 'evaluation' | 'memorization'`
 *    (see PR A A.3b's `specs/index.ts` restructuring and the `StepId` type).
 *    These are the five steps whose `spec.json` files live on disk and whose
 *    prompts are compiled by `assembly.ts::compile()`. Every `spec.json`
 *    corresponds to exactly one productive step identity.
 *
 * 2. The GRAPH MODEL. `specs/index.json` describes the full workflow graph.
 *    Its `steps[]` array has SEVEN entries: `ideation`, `ideation_eval`,
 *    `planning`, `planning_eval`, `execution`, `execution_eval`, `memorization`.
 *    The
 *    three `*_eval` nodes all point at the SAME `evaluation/spec.json` (via
 *    `StepDefinition.evalFor`). Additional non-productive states appear as
 *    transition targets — `done`, `error`, `idle` — which are lifecycle
 *    sinks, not productive steps.
 *
 * Graph node count exceeds `StepId` cardinality because the graph distinguishes
 * contexts in which evaluation runs (after ideation vs plan vs execution)
 * while the spec library deduplicates the underlying prompt. The compiler
 * reads `state.currentStep` (one of the graph step IDs) to select which
 * spec.json to load; for the three `*_eval` graph nodes the CLI resolves the
 * shared `evaluation/spec.json`.
 *
 * Substates — the `meta.substates` field on a `StepSpec` — model non-productive
 * sub-states inside a productive step's lifecycle. Today only Ideation
 * declares substates (`['discussing', 'researching']`, per
 * `workflow/state.ts::IdeationSubstate`). The overlay system exists to adapt
 * that step's compiled prompt when the state machine is in a given substate,
 * without duplicating the base spec per substate.
 *
 * Feedback rounds, evaluation-gate decision points, and the pre-cap warning
 * are NOT substates. They are modeled as CONDITIONAL BLOCKS with predicates
 * (`feedbackRoundActive`, `ideationSynthesized`, `feedbackCapExceeded`, …)
 * that inspect `WorkflowState` at compile time and gate block inclusion.
 * This mechanism is already wired in `blocks.conditional` across every
 * productive step spec — no overlay files are needed for them. Error states
 * are also not substates; they are graph sinks with their own recovery
 * pathway compilation described in `v050-prompts.md` §Resume Prompt
 * Compilation.
 *
 * Consequence — the substate matrix this module covers is narrow on purpose:
 *
 *   - `ideation/discussing.overlay.json`
 *   - `ideation/researching.overlay.json`
 *
 * If a future step declares `meta.substates`, the overlay loader picks up
 * its `{substate}.overlay.json` files by the same convention without
 * engine changes.
 *
 * ---------------------------------------------------------------------------
 *  Merge semantics
 * ---------------------------------------------------------------------------
 *
 * `applyOverlay(base, overlay)` is a pure function: no I/O, no module state,
 * same inputs produce byte-identical outputs. The pipeline is:
 *
 *   1. Deep-merge `overlay` onto `base`. Object values merge recursively;
 *      array values REPLACE (Kustomize-style strategic merge) — no element-
 *      wise merge, no concatenation. The rationale: arrays in a `StepSpec`
 *      carry ordered, authored content (principles, criteria, conditional
 *      blocks); element-wise merge would silently mis-align ordered entries
 *      when authors want to swap, remove, or reorder items. Full-replace
 *      puts the author in control.
 *
 *   2. Apply `$ops` in document order against the merged result. `$ops` is
 *      the escape hatch for targeted array edits where full replace would
 *      force the overlay to restate the whole base array. Four operations:
 *      `append`, `prepend`, `remove`, `replace`. See `OverlayOp` for
 *      details.
 *
 *   3. Re-validate the merged result against `validateStepSpec`. Overlays
 *      that produce an invalid spec fail at apply time, not at the next
 *      consumer. The validator's cross-reference checks (blockRef →
 *      delegation keys) run too, so overlays that drop a delegation block
 *      without also removing its agent entry are caught here.
 *
 * ---------------------------------------------------------------------------
 *  Paths
 * ---------------------------------------------------------------------------
 *
 * `$ops[i].path` is a dot-separated dot-path into the merged `StepSpec`
 * (e.g., `'meta.requiredSkills'`, `'blocks.conditional'`, `'blocks.static'`).
 * Array indices in paths are NOT supported — every `$ops` op addresses a
 * whole array at a path. To touch a specific array element, use `remove`
 * with a match predicate (by `id` or by literal value) followed by
 * `append`/`prepend`. This keeps the op surface small and prevents overlays
 * from encoding brittle positional indices.
 *
 * ---------------------------------------------------------------------------
 *  Cache-ordering and branded sections
 * ---------------------------------------------------------------------------
 *
 * Overlays operate on raw `StepSpec` JSON — the same shape `spec.json`
 * itself carries. They do NOT produce `StaticSection`/`SessionSection`/
 * `DynamicSection` values directly. Section construction happens later in
 * `assembly.ts::renderSpec` via the branded factories. Therefore overlays
 * cannot break the `CacheOrderedSections<T>` invariant by construction —
 * that invariant applies to the section tuple, not to the spec's block
 * fields. The overlay output still flows through `renderSpec`, which
 * preserves Static* → Session* → Dynamic* ordering.
 *
 * Similarly, `BlockContent.refs` is accepted structurally by the schema
 * but NOT resolved by PR A's `compile()` (see `assembly.ts::renderBlockContent`
 * TODO). Overlay authors should avoid emitting `refs` arrays; if they do,
 * the behaviour is the same as for base specs — the referenced bodies are
 * silently omitted from the compiled prompt until the shared-block resolver
 * lands.
 */

import { isRecord, isString, isArray } from '../lib/guards.js';
import { validateStepSpec } from './_schema/v1.js';
import type { StepSpec } from './types.js';

// ---------------------------------------------------------------------------
// OverlayDoc shape — deep-partial of StepSpec plus optional `$ops`
//
// We model the overlay as `unknown`-carrying structural types rather than a
// deep-partial of `StepSpec`. Reason: `StepSpec` has closed-literal fields
// (`modelTier: 'opus' | 'sonnet' | 'haiku'`, `version: 1`, readonly tuples)
// that do not round-trip cleanly through a generic `DeepPartial<>` helper
// under `exactOptionalPropertyTypes`. The applyOverlay contract is instead:
// the overlay is free-form JSON; the FINAL merged result must satisfy
// `validateStepSpec`. Authors pay for structural freedom at apply time, not
// at authoring time.
//
// `$ops` lives at the top level to make operations first-class and easy to
// discover in a JSON tree-view. `$` prefix mirrors JSONPath / JSON Patch
// conventions — it marks the key as a directive rather than a spec field.
// ---------------------------------------------------------------------------

/** An overlay document. All fields are optional; unknown fields are rejected. */
export interface OverlayDoc {
  /** Optional identifier for external JSON-schema tooling; not validated. */
  readonly $schema?: string;
  /**
   * Per-step, per-substate patches to merge into the base spec. Structurally
   * a partial of the `StepSpec` JSON shape; the merged result is revalidated
   * as a full `StepSpec` by `validateStepSpec`.
   */
  readonly meta?: Record<string, unknown>;
  readonly transitions?: readonly unknown[];
  readonly delegation?: Record<string, unknown>;
  readonly tokenBudget?: Record<string, unknown>;
  readonly blocks?: Record<string, unknown>;
  /** Targeted structural operations applied after deep-merge, in document order. */
  readonly $ops?: readonly OverlayOp[];
}

/**
 * A single targeted operation on the merged spec. Applied in `$ops` array
 * order after deep-merge. All ops address whole arrays; mid-array indices
 * are not a valid path suffix.
 */
export type OverlayOp =
  | OverlayAppendOp
  | OverlayPrependOp
  | OverlayRemoveOp
  | OverlayReplaceOp;

/**
 * `append` — extend the array at `path` with `value`. `value` must be an
 * array; its elements are concatenated onto the target array's end.
 */
export interface OverlayAppendOp {
  readonly op: 'append';
  readonly path: string;
  readonly value: readonly unknown[];
}

/**
 * `prepend` — insert `value` at the start of the array at `path`. `value`
 * must be an array; the target's existing elements follow.
 */
export interface OverlayPrependOp {
  readonly op: 'prepend';
  readonly path: string;
  readonly value: readonly unknown[];
}

/**
 * `remove` — drop elements from the array at `path`. Two match modes:
 *
 * - `match: { id: string }` — remove the element(s) whose `id` field equals
 *   the given string. Used for removing named blocks by their `id`
 *   (e.g., a conditional block with `id: 'feedback-context'`).
 * - `value: <primitive>` — remove the element(s) structurally equal to the
 *   given primitive. Used for removing string entries from arrays like
 *   `meta.requiredSkills`.
 *
 * An op that matches nothing is a no-op; the engine does not treat zero
 * matches as an error. This keeps overlays idempotent-friendly when applied
 * against a base that a future edit changes.
 */
export type OverlayRemoveOp =
  | {
      readonly op: 'remove';
      readonly path: string;
      readonly match: { readonly id: string };
    }
  | {
      readonly op: 'remove';
      readonly path: string;
      readonly value: string | number | boolean | null;
    };

/**
 * `replace` — set the value at `path` to `value`. Equivalent to writing
 * `{ ...: value }` in the overlay's deep-merge section, but explicit. Useful
 * when the overlay needs to both merge deeper at one subtree and replace at
 * another; splitting the latter into `$ops.replace` keeps the deep-merge
 * intent clear. Can target any path (scalar, object, or array).
 */
export interface OverlayReplaceOp {
  readonly op: 'replace';
  readonly path: string;
  readonly value: unknown;
}

// ---------------------------------------------------------------------------
// Error type — thrown when the merged spec fails validation OR when an `$ops`
// entry addresses a path that cannot exist in a valid StepSpec.
// ---------------------------------------------------------------------------

/**
 * Thrown by `applyOverlay` when the merged spec fails `validateStepSpec` or
 * when an `$ops` entry addresses an impossible path. The message is a
 * single-line summary; `.issues` carries the structured detail for
 * programmatic consumers.
 */
export class OverlayError extends Error {
  readonly issues: readonly string[];
  constructor(message: string, issues: readonly string[]) {
    super(`${message}: ${issues.join('; ')}`);
    this.name = 'OverlayError';
    this.issues = issues;
  }
}

// ---------------------------------------------------------------------------
// Deep merge — objects merge recursively, arrays replace, scalars replace.
//
// We work on plain JSON values (`unknown` that is JSON-serializable): string,
// number, boolean, null, object, array. Functions, symbols, dates, and other
// exotic values do not appear in a spec or overlay file.
//
// The output is a fresh tree — neither `base` nor `overlay` is mutated.
// Cloning is structural (not referential); the StepSpec's `readonly` marks
// are erased at runtime, so the caller cannot accidentally mutate shared
// sub-trees after merge.
// ---------------------------------------------------------------------------

function cloneJson(value: unknown): unknown {
  if (isArray(value)) {
    return value.map(cloneJson);
  }
  if (isRecord(value)) {
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(value)) {
      out[key] = cloneJson(value[key]);
    }
    return out;
  }
  // Primitives (string, number, boolean, null) and undefined pass through.
  return value;
}

function deepMerge(base: unknown, overlay: unknown): unknown {
  // Replace-arrays: when overlay holds an array it fully replaces base.
  if (isArray(overlay)) {
    return overlay.map(cloneJson);
  }
  // Scalars / null in overlay replace whatever was in base.
  if (!isRecord(overlay)) {
    return overlay === undefined ? cloneJson(base) : overlay;
  }
  // Overlay is an object. If base is not, overlay wins entirely.
  if (!isRecord(base)) {
    return cloneJson(overlay);
  }
  // Both are objects — merge key-by-key.
  const out: Record<string, unknown> = {};
  const keys = new Set<string>([...Object.keys(base), ...Object.keys(overlay)]);
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(overlay, key)) {
      const overlayValue = overlay[key];
      if (overlayValue === undefined) {
        // `undefined` explicitly preserves the base (opt-out of a patch).
        if (Object.prototype.hasOwnProperty.call(base, key)) {
          out[key] = cloneJson(base[key]);
        }
        continue;
      }
      out[key] = deepMerge(base[key], overlayValue);
    } else {
      out[key] = cloneJson(base[key]);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Path resolution — dot-separated walk, reject index suffixes
// ---------------------------------------------------------------------------

function splitPath(path: string): string[] {
  if (path.length === 0) {
    throw new OverlayError('overlay $ops path is empty', [path]);
  }
  const parts = path.split('.');
  for (const part of parts) {
    if (part.length === 0) {
      throw new OverlayError('overlay $ops path has an empty segment', [path]);
    }
    // Reject numeric index segments to force array-addressing at the whole
    // array level. Authors who want element-wise edits use remove+append.
    if (/^\d+$/.test(part)) {
      throw new OverlayError(
        'overlay $ops path uses a numeric array index — not supported',
        [path],
      );
    }
  }
  return parts;
}

/**
 * Walk `root` following `parts` and return the parent object/array plus the
 * final key. Returns `null` when an intermediate segment does not resolve.
 */
function resolveParent(
  root: Record<string, unknown>,
  parts: readonly string[],
): { readonly parent: Record<string, unknown>; readonly key: string } | null {
  if (parts.length === 0) return null;
  let cursor: Record<string, unknown> = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const seg = parts[i];
    if (seg === undefined) return null;
    const next = cursor[seg];
    if (!isRecord(next)) return null;
    cursor = next;
  }
  const last = parts[parts.length - 1];
  if (last === undefined) return null;
  return { parent: cursor, key: last };
}

// ---------------------------------------------------------------------------
// Op application — operates on a mutable working copy produced by the deep
// merge step. The working copy is discarded if any op fails; only the
// validated final result is returned.
// ---------------------------------------------------------------------------

function applyOps(
  working: Record<string, unknown>,
  ops: readonly OverlayOp[],
): void {
  ops.forEach((op, index) => {
    applyOp(working, op, index);
  });
}

function applyOp(
  working: Record<string, unknown>,
  op: OverlayOp,
  index: number,
): void {
  const parts = splitPath(op.path);
  const resolved = resolveParent(working, parts);
  if (resolved === null) {
    throw new OverlayError(
      `overlay $ops[${index}] (${op.op}) path '${op.path}' does not exist in base`,
      [op.path],
    );
  }
  const { parent, key } = resolved;

  switch (op.op) {
    case 'append': {
      const target = parent[key];
      if (!isArray(target)) {
        throw new OverlayError(
          `overlay $ops[${index}] (append) path '${op.path}' is not an array`,
          [op.path],
        );
      }
      parent[key] = [...target, ...op.value.map(cloneJson)];
      return;
    }
    case 'prepend': {
      const target = parent[key];
      if (!isArray(target)) {
        throw new OverlayError(
          `overlay $ops[${index}] (prepend) path '${op.path}' is not an array`,
          [op.path],
        );
      }
      parent[key] = [...op.value.map(cloneJson), ...target];
      return;
    }
    case 'remove': {
      const target = parent[key];
      if (!isArray(target)) {
        throw new OverlayError(
          `overlay $ops[${index}] (remove) path '${op.path}' is not an array`,
          [op.path],
        );
      }
      if ('match' in op) {
        const id = op.match.id;
        parent[key] = target.filter(
          (entry) => !(isRecord(entry) && entry['id'] === id),
        );
      } else {
        parent[key] = target.filter((entry) => entry !== op.value);
      }
      return;
    }
    case 'replace': {
      parent[key] = cloneJson(op.value);
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// Overlay validation — structural guard on the untyped overlay input
//
// An overlay file is loaded from JSON as `unknown`. This guard narrows it to
// `OverlayDoc` without an `as` cast. It accepts any field the OverlayDoc
// interface declares and rejects extra top-level fields — overlays that
// accidentally misspell `$ops` as `ops` (or add a typo like `op` instead of
// `ops`) fail here with a clear message rather than being silently ignored.
// ---------------------------------------------------------------------------

const KNOWN_OVERLAY_KEYS = new Set<string>([
  '$schema',
  'meta',
  'transitions',
  'delegation',
  'tokenBudget',
  'blocks',
  '$ops',
]);

/**
 * Structural guard + op validation. Returns a narrowed `OverlayDoc` on
 * success, or a list of error messages on failure.
 */
export function validateOverlay(
  input: unknown,
): { ok: true; value: OverlayDoc } | { ok: false; errors: readonly string[] } {
  const errors: string[] = [];
  if (!isRecord(input)) {
    return { ok: false, errors: ['overlay root is not an object'] };
  }
  for (const key of Object.keys(input)) {
    if (!KNOWN_OVERLAY_KEYS.has(key)) {
      errors.push(`overlay has unknown top-level field '${key}'`);
    }
  }
  const schemaField = input['$schema'];
  if (schemaField !== undefined && !isString(schemaField)) {
    errors.push(`overlay.$schema is not a string`);
  }
  const ops = input['$ops'];
  if (ops !== undefined) {
    if (!isArray(ops)) {
      errors.push(`overlay.$ops is not an array`);
    } else {
      ops.forEach((entry, index) => {
        if (!isRecord(entry)) {
          errors.push(`overlay.$ops[${index}] is not an object`);
          return;
        }
        const opKind = entry['op'];
        if (!isString(opKind)) {
          errors.push(`overlay.$ops[${index}].op is missing or not a string`);
          return;
        }
        if (!['append', 'prepend', 'remove', 'replace'].includes(opKind)) {
          errors.push(
            `overlay.$ops[${index}].op '${opKind}' is not a recognized operation ` +
              `(expected append | prepend | remove | replace)`,
          );
          return;
        }
        if (!isString(entry['path'])) {
          errors.push(`overlay.$ops[${index}].path is missing or not a string`);
          return;
        }
        if (opKind === 'append' || opKind === 'prepend') {
          if (!isArray(entry['value'])) {
            errors.push(
              `overlay.$ops[${index}] (${opKind}) requires 'value' to be an array`,
            );
          }
        } else if (opKind === 'remove') {
          const hasMatch = isRecord(entry['match']);
          const hasValue = entry['value'] !== undefined;
          if (hasMatch === hasValue) {
            errors.push(
              `overlay.$ops[${index}] (remove) requires exactly one of ` +
                `'match' (object with 'id' string) or 'value' (primitive)`,
            );
          } else if (hasMatch) {
            const match = entry['match'];
            if (!isRecord(match) || !isString(match['id'])) {
              errors.push(
                `overlay.$ops[${index}] (remove) 'match' must be an object with ` +
                  `a string 'id' field`,
              );
            }
          } else {
            const v = entry['value'];
            if (
              typeof v !== 'string' &&
              typeof v !== 'number' &&
              typeof v !== 'boolean' &&
              v !== null
            ) {
              errors.push(
                `overlay.$ops[${index}] (remove) 'value' must be a primitive ` +
                  `(string | number | boolean | null)`,
              );
            }
          }
        }
        // `replace` accepts any value, no further checks here.
      });
    }
  }
  if (errors.length > 0) {
    return { ok: false, errors };
  }
  // After structural checks pass, cast the validated root to `OverlayDoc`.
  // This is the ONE narrowing point — everything downstream consumes the
  // narrowed type. `unknown → OverlayDoc` is safe here because every field
  // has been shape-checked above; the type is additive and declares all
  // properties as `unknown`-carrying structural fields.
  const narrowed: OverlayDoc = input as OverlayDoc;
  return { ok: true, value: narrowed };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Apply `overlay` to `base` and return the merged + validated `StepSpec`.
 *
 * Pipeline:
 *   1. Clone `base` into a fresh working object.
 *   2. Deep-merge overlay's structural fields (`meta`, `transitions`,
 *      `delegation`, `tokenBudget`, `blocks`) onto the working copy with
 *      replace-arrays semantics.
 *   3. Apply `overlay.$ops` (if any) in document order against the working
 *      copy.
 *   4. Re-validate the working copy via `validateStepSpec`. Throws
 *      `OverlayError` on failure.
 *
 * The input `base` is not mutated. Two calls with the same `(base, overlay)`
 * inputs return byte-identical outputs (modulo JSON-value identity of
 * scalars — all object/array values are fresh).
 *
 * @throws OverlayError when an `$ops` entry targets a non-existent path,
 *   uses an unsupported path suffix, or when the merged spec fails
 *   `validateStepSpec`.
 */
export function applyOverlay(base: StepSpec, overlay: OverlayDoc): StepSpec {
  // Start from a fresh clone of base. StepSpec is deeply readonly; cloneJson
  // returns a mutable shape, which we need for the op pass. The mutability
  // is local to this function — the final return reassumes `StepSpec`.
  const workingRaw = cloneJson(base);
  if (!isRecord(workingRaw)) {
    // A validated StepSpec is always an object — this branch is structurally
    // unreachable, but the cloneJson signature returns `unknown`.
    throw new OverlayError('base spec cloned to a non-object', ['internal']);
  }
  let working: Record<string, unknown> = workingRaw;

  // Deep-merge structural fields. `$schema` and `$ops` are overlay-only
  // fields and never merged into the spec proper.
  const mergeableKeys: readonly (keyof OverlayDoc)[] = [
    'meta',
    'transitions',
    'delegation',
    'tokenBudget',
    'blocks',
  ];
  for (const key of mergeableKeys) {
    const patch = overlay[key];
    if (patch === undefined) continue;
    const merged = deepMerge(working[key], patch);
    working = { ...working, [key]: merged };
  }

  // Apply targeted operations. Errors throw OverlayError.
  if (overlay.$ops !== undefined) {
    applyOps(working, overlay.$ops);
  }

  // Re-validate. The merged shape must still satisfy the full StepSpec
  // schema (structural + cross-reference).
  const result = validateStepSpec(working);
  if (!result.ok) {
    const messages = result.errors.map(
      (e) => `${e.instancePath || '<root>'}: ${e.message ?? 'invalid'}`,
    );
    throw new OverlayError(
      'overlay produced an invalid StepSpec',
      messages,
    );
  }
  return result.value;
}
