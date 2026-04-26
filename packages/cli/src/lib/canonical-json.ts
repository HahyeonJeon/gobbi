/**
 * Canonical JSON stringifier for content addressing.
 *
 * One source of truth for "what bytes hash into a content address" across
 * Wave C.1's prompts-as-data feature: the JSONL evolution log
 * (`prompt-evolution/<prompt-id>.jsonl`), the SQLite `prompt_patches`
 * row's `patch_id`/`pre_hash`/`post_hash` columns, and the
 * replay-equivalence CI test all hash `canonicalize(value)`. Diverging
 * the rule across these sites would split the hash space — operators
 * could not reproduce a `patch_id` they observe in `prompt patches log`
 * by canonicalizing the on-disk patch_json column.
 *
 * # Why insertion-order, not sorted-key
 *
 * The schema-mirror byte-equality test at
 * `specs/__tests__/schema.test.ts:399-406` already pins the schema
 * `_schema/v1.json` to `JSON.stringify(StepSpecSchema, null, 2)` — i.e.,
 * insertion-order, 2-space indent, no trailing whitespace. Synthesis
 * Architecture F-7 fix locks the same convention everywhere: introducing
 * a sorted-key variant for `prompt_patches` content addressing would
 * break the schema mirror test or produce two hash spaces. Insertion
 * order is well-defined for `spec.json` files (the author's chosen key
 * order is part of the file's byte identity); RFC 6902 `applyPatch`
 * preserves key insertion order; the canonicalization is round-trip
 * stable.
 *
 * # Trade-off accepted
 *
 * Reordering the keys of an existing `spec.json` (without changing
 * meaning) produces a different hash even though the data is
 * semantically identical. This is intentional — the file's byte
 * identity IS the content. Operators preserve key order through normal
 * editing; `fast-json-patch::applyPatch` preserves it through the patch
 * apply. The only path that re-sorts is `JSON.parse + JSON.stringify`
 * with a custom replacer, which is not part of the gobbi pipeline.
 */

/**
 * Stringify a value to its canonical form for content-address hashing.
 *
 * Pure thin wrapper around `JSON.stringify(value, null, 2)`. Exists as a
 * named function so the convention is greppable and so a future
 * single-source-of-truth change (if forced) can update one definition
 * rather than scatter `JSON.stringify(..., null, 2)` calls across the
 * codebase.
 *
 * @param value any JSON-serializable value (must not contain cycles).
 * @returns the canonical JSON string with 2-space indent.
 */
export function canonicalize(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
