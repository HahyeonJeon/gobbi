---
name: guard-run-mode-not-separated
description: The D5-generation guard's early run-mode and its Family-9-inclusion assertion are not separated in the design text — a Planner could wire both together and hit a chicken-and-egg failure
type: decisions
scope: feature
feature: evaluation-childdoc-split
status: proposed
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation, design]
keywords: [check-eval-childdocs, guard-run-mode, atomic-last, chicken-and-egg]
author: claude
related: [evaluation-childdoc-split]
---

# The guard's two implicit run modes are not separated (USAGE-01, iter6 Medium finding)

## Context

The iter6 draft's FIX-U3 sequences `check-eval-childdocs.sh` (the completeness gate) as an EARLY Planning/Execution task, so it generates and certifies the complete co-touch inventory (D5) ahead of the rollout, rather than the design relying on hand-listing. Separately, the atomic-last rollout decision says every Family-9 surface's `checklist.md` addition lands together, in one atomic flip, only once all 5 loop bundles exist. The Claude iter6 evaluator (USAGE perspective, USAGE-01, Medium/confidence 50) found that the design text does not explicitly separate these into two distinct guard run modes.

## Decision

Not yet decided — deferred to Planning as an open risk to resolve before `check-eval-childdocs.sh` is built. This file records the risk and the suggested resolution shape; it does not lock an answer.

## Rationale

The guard has two implicit functions the draft's prose does not name separately:

- **(F1) Enumerate + classify every genuine hit = generate the complete D5.** This is runnable EARLY, on the tree as it exists today, before any loop is split.
- **(F2) Assert every Family-9 surface CONTAINS `checklist.md`.** This can only pass AFTER the atomic-last flip has actually updated those surfaces — running it early means every Family-9 surface fails the assertion, because none of them has been updated yet.

The two-family predicate's own wording — "Family-9 … → must include the filled `checklist.md` (→ 9)" — reads like F2 stated as an unconditional rule. If a Planner takes FIX-U3's "build the guard early" literally and wires F2 into that early run, the guard fails on its very first run (a chicken-and-egg: nothing has been updated yet, by design, because the flip is atomic-last). The natural reading — the guard GENERATES D5 early (F1 only); inclusion (F2) is enforced only at the atomic-last flip — is internally coherent, so this is an under-specification in the design text, not a contradiction in the model itself. Non-blocking for Ideation; the evaluator explicitly recommended making the two run-modes explicit at Planning rather than reopening the Ideation loop.

## Alternatives considered

- **Leave it implicit and trust the natural reading.** Rejected as the resolution path: it works today because a careful reader infers the split, but a Planner decomposing this into an Execution task without noticing the split could build a single guard invocation that tries to do both, which fails immediately and blocks the prototype (`execution/` bundle).
- **Reopen Ideation to formalize F1/F2 in the design.** Rejected: both evaluators PASSed iter6 with this as a non-blocking note; the fix is a Planning-level task-decomposition clarification, not a design-level defect requiring another Ideation iteration.

## Consequences

Planning must, when decomposing `check-eval-childdocs.sh` into a task, explicitly state which mode the guard runs in at each point in the rollout: an early classify-completeness mode (F1, runs against the current tree, produces the certified D5) and a flip-gated inclusion-enforcement mode (F2, runs only after the atomic-last flip, asserts every Family-9 surface now contains `checklist.md`). See [[guard-run-mode-goal-state]] for the Planning-input note carrying this forward.

## Related

- [[evaluation-childdoc-split]] (design) — the D6 gate + atomic-last rollout this risk applies to
</content>
