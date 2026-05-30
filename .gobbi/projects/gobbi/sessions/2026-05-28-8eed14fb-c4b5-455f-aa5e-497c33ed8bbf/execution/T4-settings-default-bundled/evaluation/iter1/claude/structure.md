# T4 iter1 — Structure perspective (claude)

**Perspective:** Structure — JSON shape, key naming, hierarchy, schema consistency.

## Stage 0 — Target understanding

Bundled `settings.default.json`. Two parallel mode subtrees + a single `schemaVersion` at root. Each subtree mirrors the original (pre-T4) flat shape: `mode`, `workflow.{phase}.{discuss,evaluate,maxIterations}`, `models.{system}.{role}`, `git.{repo,baseBranch,pr,issue,worktree,branch}`.

## Stage 1 — Frame

Scenarios:
1. Root has `schemaVersion`, `chat`, `auto` and nothing else (no orphan keys, no `mode` field at root — it dispatches per-subtree).
2. Each subtree's workflow has exactly the 5 phases.
3. Each phase has the same triplet shape (discuss, evaluate, maxIterations).
4. `models` shape preserved (system/role nesting).
5. `git` shape preserved.
6. No drift/divergence in shape between chat and auto subtrees (only values differ).

## Stage 2 — Evidence

| # | Scenario | Evidence | Verdict |
|---|---|---|---|
| 1 | Root keys = `{auto, chat, schemaVersion}` (3 only) | `jq -r 'keys[]'` confirmed | PASS |
| 2 | Both subtrees' workflow phases = `{ideation, preparation, planning, execution, wrap-up}` | jq enumerated | PASS |
| 3 | Each phase exposes discuss.mode, evaluate.mode, maxIterations | jq probe over all 10 phases | PASS |
| 4 | `chat.models` MD5 == `auto.models` MD5 == baseline MD5 (`09aa9b8f…`) | identical shape and values | PASS |
| 5 | `chat.git` MD5 == `auto.git` MD5 == baseline MD5 (`3600f9fe…`) | identical | PASS |
| 6 | No structural divergence between chat and auto subtrees | by construction (same keys, only values differ) | PASS |

## Findings

None. Structure is symmetric, key-faithful to the baseline shape, and adds no orphan fields.

**Note (Confidence 25, Severity Low):** `wrap-up` as a JSON key contains a hyphen — JS-style accessors require bracket notation (`["wrap-up"]`). This is inherited from the pre-T4 baseline and is out of T4 scope; flag for awareness only.

## Must-preserve

- The triplet shape `(discuss, evaluate, maxIterations)` on every phase — downstream readers depend on it.
- Hyphenated `wrap-up` key (matches baseline; do not rename in this task).
- `schemaVersion` at root only (not duplicated into each subtree).

## Verdict

**PASS**
