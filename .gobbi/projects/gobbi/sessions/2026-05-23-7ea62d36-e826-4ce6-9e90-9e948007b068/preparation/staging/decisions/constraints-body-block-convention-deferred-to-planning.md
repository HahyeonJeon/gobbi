---
date: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
status: deferred
feature: gobbi-orchestration-workflow-improvements
supersedes: null
superseded_by: null
finding-id: OVERALL-ITER3-CONSTRAINTS-BODY-BLOCK
finding-type: general
domain: docs-sync
severity: Low
disposition: deferred
confidence: 100
---

# Deferred: `Constraints` body block vs `## Constraints` H2 convention in codex skill stub

## Context

The codex skill stub (item A) places `**Constraints**` as a bolded body block after H2 #8 (`## Anti-patterns`), explicitly annotated as "NOT an H2 section; keeps the H2 count at exactly 8." This preserves the validation contract `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returning exactly `8`.

Codex iter3 evaluator (finding OVERALL-ITER3-CONSTRAINTS-BODY-BLOCK) noted that sampled existing project skills (`execution/SKILL.md`, `wrap-up/SKILL.md`, `research/SKILL.md`) use `## Constraints` as an H2 section, not a body block.

## Decision

**Deferred to Planning DISCUSSION.** The body-block approach is intentional in Preparation — it respects the locked Idea Design A which explicitly enumerates 8 H2 sections excluding `Constraints`. Changing `Constraints` to H2 #9 would violate the locked spec (checklist item 1 requires exactly 8 H2 sections post-ship).

If the user wants to normalize `Constraints` to H2 convention across all project skills (including the new codex skill), that decision should be made consciously in Planning DISCUSSION — either by:
- Adding `## Constraints` as H2 #9 (requires updating the `grep -c "^## " == 8` validation contract to `== 9`), or
- Accepting the body-block as the codex-skill-specific pattern (diverging from sibling skills), or
- Filing a separate follow-up session to normalize all skill `Constraints` sections.

## Rationale

Not a REVISE blocker: Design A explicitly locks 8 H2 sections. The body block is a valid approach when the locked spec excludes `Constraints` from the H2 list. The inconsistency with sibling skills is real but not normatively incorrect for this feature session.

## Condition for reverting

If Planning DISCUSSION confirms that `Constraints` should be H2 #9 in the codex skill, Execution task A updates the stub (body block → `## Constraints`) AND updates the validation contract grep to return 9 instead of 8.

## Related

- `ideation/staging/design/item-a-codex-skill-structure.md:15-23` — locked 8-section spec
- `preparation/evaluation/iter3/codex/overall.md` — finding source
- `preparation/artifacts/preparation.md § Open Concerns for Planning DISCUSSION, Concern 5`
