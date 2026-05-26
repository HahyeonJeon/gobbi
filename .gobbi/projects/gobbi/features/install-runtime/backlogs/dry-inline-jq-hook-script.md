---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
feature: install-runtime
finding-id: S1-iter1
type: design_flaw
domain: process
disposition: deferred
confidence: 75
severity: Medium
supersedes: null
superseded_by: null
---

# DRY inline jq extraction logic — hook and reconstructor share snippets without a sourced helper

## Context

iter1 Claude Structure finding S1: D-3-2 implementation note (draft line 240) states: "Shares the field-extraction `jq` snippets with the hook ... keep them inline for simplicity in iter1, factor to a sourced helper only if iter2 evaluation demands." iter2 and iter3 evaluations both passed without demanding the refactor. The inline duplication remains.

## Decision

Deferred. The deferred discipline was explicitly Goodhart-flagged in iter1 Risk finding R3 (see `staging/decisions/goodhart-factor-when-demanded-deferred.md`). The inline jq snippets in `.claude/hooks/post-tool-use-agents.sh` and `.claude/scripts/reconstruct-agents.sh` are independent copies; divergent edits to one but not the other would silently introduce a schema-drift bug.

## Rationale

Factoring into `.claude/scripts/lib/extract-agent-fields.sh` is the cleaner solution but adds a third file and a `source` dependency. The decision to keep inline was made for simplicity in iter1; iter2 + iter3 evaluation did not force the refactor.

## Consequences

Execution: if the executor implements the hook and reconstructor, they MUST apply the same field-extraction `jq` snippets to both files. Any jq change to one must be mirrored to the other. Add a comment to both scripts: `# SYNC: jq extraction logic must match reconstruct-agents.sh / post-tool-use-agents.sh`.

Future: if T3's jq extraction changes (e.g., new schema fields), a sourced-helper refactor is the recommended next step. This finding is a candidate for a project backlog entry.

## Related

- `evaluation/iter1/claude/structure.md` S1
- `evaluation/iter1/claude/risk.md` R3 (Goodhart-flag)
- `staging/decisions/goodhart-factor-when-demanded-deferred.md`
- `rawdata/draft-iter3.md:240` (implementation note — "keep inline for simplicity")
- `rawdata/draft-iter3.md:353-360` (D-3-2 reconstructor algorithm)
