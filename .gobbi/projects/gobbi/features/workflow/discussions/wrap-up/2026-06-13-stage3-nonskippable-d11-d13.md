---
name: stage3-nonskippable-d11-d13
description: User locked stage-3 memory validation as non-skippable; D11 = wrap-up EVALUATION; D13 = explicit non-skip rule
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [wrap-up, evaluation]
keywords: [non-skippable, locked]
author: claude
outcome: D11 stage-3 = wrap-up loop's dual-system EVALUATION; D13 stage-3 is NON-SKIPPABLE and gates git stage 5
---

# Stage-3 memory validation: D11 + D13 — non-skippable, gates git

## Context
D11 (decided earlier in the session): wrap-up stage 3 (memory validation) IS the wrap-up loop's dual-system EVALUATION sub-phase — no separate mechanical layer. D13 arose from the iter1 REVISE finding F3: the draft's "keep non-skippable (recommended)" framing left a "Planning must lock" ambiguity. Codex found this: settings could set `evaluate.mode: skip` to bypass stage 3, then let git finalization run on unvalidated memory.

## Question
(D11) Should stage 3 be a new mechanical memory-validation layer or reuse the wrap-up loop's existing EVALUATION? (D13) Can settings ever skip stage-3?

## Options considered
- D11 option A: new mechanical layer separate from EVALUATION (adds complexity).
- D11 option B (selected): reuse wrap-up EVALUATION — it is the same job (post-promotion memory state validation).
- D13 option A: leave as "recommended non-skippable" (ambiguous; defers to Planning).
- D13 option B (selected): one explicit rule: NON-SKIPPABLE. Settings can never bypass it.

## User decision
D11: **stage 3 = the wrap-up loop's dual-system EVALUATION**. Stage 1 is a mechanical pre-gate (input record); stage 3 is EVALUATION (output memory). Two gates, different artifacts, neither redundant. D13: **NON-SKIPPABLE**. Settings can never set `evaluate.mode: skip` for stage 3. It always runs and always gates the irreversible git stage 5. Stated as one explicit rule in Design § D-c.

## Implication
`wrap-up/SKILL.md` redesign must include the non-skippable rule in the stage-3 row of the pipeline table. No settings path removes this gate. The manager's orchestration for wrap-up must never offer a "skip memory validation" option.

## Related
- Discussion log D13 (2026-06-13 post-iter1-evaluation round)
- Design § D-c (5-stage pipeline)
- `features/workflow/decisions/wrap-up/2026-06-13-stage3-memory-validation-nonskippable.md`
