# Risk Perspective — iter2

## Stage 0

Risk = does the surgical iter2 inadvertently introduce drift, mis-route a finding, or set up Planning for failure?

## Stage 1 Frame

Adversarial scenarios:
- (a) Pre-routing F-CX-PREP-O-01 to Planning, vs. addressing in Preparation: is the boundary correctly drawn?
- (b) Is the F-CX-PREP-O-01 "binding constraint" phrasing tight enough that Planning cannot accidentally accept a multi-task decomposition without the snapshot?
- (c) Does the project.json factual-imprecision (staged vs. unstaged) propagate downstream into a real bug?
- (d) Does the iter2 surgical approach skip any Stage that a full REVISE would have caught?
- (e) Does Karpathy "context retention bug" apply — i.e., does iter2 lose any iter1 finding?

## Stage 2 Findings

- **(a) Boundary drawn correctly.** F-CX-PREP-O-01 is a Planning-decomposition concern (multi-task vs. single-task is a Planning choice). Preparation's `generate-now` mechanism (skills/decisions/scenarios/checklists generation) is not the right surface for it. Pre-routing is the right call.
- **(b) Phrasing risk, Low severity (already flagged under Structure/Usage).** The "all consumers run BEFORE Stage C" wording, read literally, would force option (b) (snapshot). The recommendation paragraph rescues this. Planning's leader needs to read both options and the recommendation together. Risk is cognitive only and is mitigated by the per-finding template.
- **(c) project.json factual imprecision does NOT propagate to a real bug, Low severity.** iter2 says "deletion already staged" (incorrect) but immediately follows with "The sweep commit will include both deletions automatically via `git add -A` (or whatever `git add` invocation the Stage B/F commit uses)" — operational guidance is right because `git add -A` captures both staged and unstaged deletions. Risk is informational drift only; no executor will fail because of this.
- **(d) No skipped Stage A–D content.** iter2 does not pretend to re-run Sub-steps A–D; it acknowledges they were done in iter1 and remain valid. The Codex findings did not invalidate any Sub-step A–D conclusion (they added constraints; they did not refute readiness). Surgical approach is appropriate.
- **(e) No context-retention loss.** iter1's findings sections (Out of scope gaps, Decisions log Sub-steps A–D) are preserved byte-identical. Both Codex iter1 findings now have first-class status in the new H2.
- **One new risk introduced, Medium / 50.** iter2 stamps F-CX-PREP-O-01's recommendation as "(a) RECOMMENDED" — single-executor sweep. This recommendation has a hidden consequence: if Planning adopts (a), the executor task becomes very large (Stages 0–G end-to-end, ~672 lines of concrete commands, multi-stage destructive operations). That violates execution-skill's typical task-size discipline (one task = one focused unit of work). The recommendation may force Planning into a Hobson's choice: either accept an unusually large task (a), or accept new snapshot-machinery overhead (b). Neither is ideal. iter2's recommendation does not surface this tension; Planning may pick (a) without realizing the task-size implication. Confidence 50 / Severity Medium. Mitigation: Planning's AskUserQuestion should present both options with the task-size trade-off explicit, not lean on iter2's "(a) RECOMMENDED" framing.

## Stage 2 step 3

- F-CX-PREP-O-01: **addressed**, but with a downstream Planning-decision risk (above).
- F-CX-PREP-O-02: **addressed**; staged-vs-unstaged wording inaccuracy does not propagate to a real bug.

## Verdict

**PASS.** The Medium / 50 finding (task-size hidden trade-off in option (a)) is below REVISE threshold (≥ 50 + Severity High) — Medium severity only. PASS-with-note rather than REVISE.

## Must-preserve

- The pre-routing pattern (not absorbing Planning concerns into Preparation `generate-now`).
- The explicit out-of-scope-for-iter2 clause that defers (a)/(b) choice to Planning's AskUserQuestion.
