---
name: d1-003-false-premise-correction
description: The locked D1-003 model (b) rationale ("no GEN-D7-004 dependency / wrap-up unchanged") was proven false by iter1 evaluation and corrected at iter2 without reopening the user's choice
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, evaluation, wrap-up]
keywords: [false-premise, d1-003, correction, re-decision]
author: claude
outcome: (b) stays locked; the design under it is corrected — Wrap-up's inventory is extended to glob the Chat staging subtree — instead of reopening the user gate
---

# D1-003 false-premise correction (the "re-decision")

## Context

The pre-loop DISCUSSION locked model (b) for GEN-D1-003 partly on the manager's relayed rationale
"(b) has no GEN-D7-004 dependency; `wrap-up/SKILL.md` stays unchanged" (see
`2026-07-03-d1-003-chat-staging-model-decision.md`). The iter1 Ideation-loop dual-system evaluation
(Claude Project + Risk perspectives, Critical/75 — finding F-PROJ-1 / cross-refs F-RISK-2 /
Consistency-S4) proved this rationale factually false: Chat's actual slice layout
(`chat-mode.md:356-367`) places per-slice staging under `chat/tasks/{NN}-{slug}/...`, a subtree
Wrap-up's promotion inventory never reached. Under (b) as originally designed, Chat-slice findings
would still be unpromotable — the exact defect the user's locked decision was meant to fix. This
forced the whole Ideation loop to FAIL at iter1.

## Question

Given the decisive rationale for (b) is false, does the user need to re-decide between (a), a
scope-expanded (b) that folds in `GEN-D7-004`, or a distinct chat-staging-layout redirect — or can
(b) be preserved by correcting the underlying design instead?

## Options considered

- **(i)** Fold the `GEN-D7-004` inventory/scaffold extension into this cluster's scope.
- **(ii)** Redirect Chat per-slice staging to top-level loop dirs (a distinct chat-mode layout change
  with cross-task collision handling, not designed at the time).
- **(iii)** Reconsider (a) now that the D7-004 dependency is symmetric.
- **(iv, chosen at iter2)** Keep the user's (b) choice; correct the design so it actually satisfies
  (b)'s intent — extend `wrap-up/SKILL.md`'s promotion inventory (a bounded, 2-file, in-scope change)
  to glob the already-existing `chat/tasks/*/{N}-{loop}/staging/` subtree. This does NOT require
  `GEN-D7-004` (the record-map/scaffold documentation) — Wrap-up globs a subtree RECORD already
  writes; it only needs the inventory rule extended, not the subtree formally documented/scaffolded.

## User decision

The design was self-corrected via option (iv) inside the Auto-mode loop (DISCUSSION→WORK→EVALUATION→
RECORD auto-iterates on REVISE/FAIL up to `maxIterations`; this finding was not an Always-Ask trigger
mid-loop). The iter2 draft removed the false rationale and extended the Wrap-up inventory; the iter2
Claude verification pass tool-confirmed the extension reaches the previously-unreachable subtree while
preserving the non-Chat exclusion invariant. The user's original (b) choice was never reopened — no
new `AskUserQuestion` was needed because the correction changes only the mechanism, not what the user
chose.

## Implication

Future sessions should not re-litigate the (a) vs (b) choice for GEN-D1-003 — it is settled as (b),
with the design now correctly extending Wrap-up's inventory. `GEN-D7-004` remains a distinct,
deliberately deferred follow-up (documenting `chat/tasks/` in `record/record-map.md` + the scaffold
scripts), a hard dependency only for the rejected alternative (a).

## Related

- [[d1-003-chat-staging-wrapup-inventory-extension]] — the corrected design
- [[d1-003-recommended-b-false-noop-rationale]] — the decision record of the iter1 Critical finding + correction
- [[manager-must-verify-scope-dependency-claims-before-user-gate]] — the mistake-candidate this recurrence produced
- [[2026-07-03-d1-003-chat-staging-model-decision]] — the original pre-loop lock this correction refines
