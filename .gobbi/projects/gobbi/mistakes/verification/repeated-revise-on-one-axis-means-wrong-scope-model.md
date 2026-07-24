---
name: repeated-revise-on-one-axis-means-wrong-scope-model
description: 4 of 6 Planning iterations REVISE'd on one axis (guard mechanics), each round making the guard more elaborate — the signal to simplify the model, not patch again, was available but not applied until the user forced it.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process, verification]
keywords: [repeated-revise, one-axis, scope-model, simplify-the-guards, iteration-cap]
author: claude
priority: high
domain: process
---

# Four REVISEs on one axis means the scope model is wrong, not the patch

## What happened

Across the six Planning iterations for the `planning`-skill split, 4 of 6 iterations (iters 2, 3, 4,
and the FAIL at iter 5) REVISE'd specifically on the guard-mechanics axis — the mechanism verifying
that every consumer of the moved content was correctly repointed. Each round made the guard more
elaborate rather than simpler: a proximity window, then multiple named families (Family-P, Family-R),
then a 240-character corpus-wide pattern with a zero-allowlist. The guard eventually outgrew the work
it was meant to verify and became internally self-contradictory (see
`guard-must-not-forbid-the-state-it-requires`), FAILing the loop at the iteration cap. Only at that
point did the user explicitly rule "simplify the guards," and the terminal iteration replaced the
whole proximity-regex engine with a 13-row enumerated per-consumer checklist — a model the iter-6
evaluator could not break on 11 constructed counterexamples.

## Why it happens

Each individual REVISE finding is locally correct and locally addressable — a missed consumer here, a
false-positive family there — so each round's natural response is to patch the existing mechanism:
widen a window, add an exception family, extend an allowlist. Patching in place feels like progress
because each individual finding closes. What is invisible round-to-round is the ACCUMULATING
complexity of the mechanism itself, which is a separate axis from whether any single finding was
correctly fixed. By the time the mechanism has been extended three or four times, its own internal
consistency becomes the actual risk, but nothing in a single-round review naturally surfaces "this
mechanism, as a whole, has grown too complex to reason about" — that observation requires looking
ACROSS iterations, not just at the current one.

## How to recognize it

Two already-recorded project traps name exactly this signature — `step-back-after-repeated-fixes-on-
one-axis` and `guard-revises-twice-means-scope-model-wrong` — and this session is a THIRD, independent
witness to the same pattern recurring in a different feature. The concrete tell: reviewing the verdict
history of a multi-iteration loop and finding that REVISE findings across 2 or more consecutive
rounds all target the SAME underlying mechanism (not the same specific bug — the same MECHANISM), each
round's fix adding complexity to that mechanism rather than removing it. If a mechanism has been
extended three or more times and a NEW counterexample keeps surfacing against it, that is the signal
to stop patching and ask whether the mechanism's whole approach is structurally wrong for the problem,
independent of any single fix's correctness.

## Corrected approach

When a REVISE (or FAIL) pattern repeats on the same mechanism-axis across 2+ iterations, treat the
NEXT finding on that axis as a trigger to evaluate the mechanism as a whole, not just the specific
counterexample — before authoring another patch. Concretely: ask whether a structurally SIMPLER
mechanism (here: replacing a corpus-wide regex/proximity engine with an enumerated, per-item
checklist) would make the class of finding impossible by construction, rather than merely harder to
trigger. An enumerated checklist cannot self-contradict the way a shared-pattern sweep can, and it is
directly auditable by a human reader without running it — both properties a regex engine cannot offer
regardless of how many exception families are added. This session's user-forced correction ("simplify
the guards") is the concrete instance to point to: the fix that actually worked was subtraction of
machinery, not another round of addition.

## Related

- [[guard-must-not-forbid-the-state-it-requires]] — the concrete Critical defect that this repeated
  fix-in-place approach produced, closing the FAIL loop
- `mistakes/verification/step-back-after-repeated-fixes-on-one-axis.md` — the pre-existing project
  trap this session is a fresh witness of
- `mistakes/verification/guard-revises-twice-means-scope-model-wrong.md` — the pre-existing project
  trap naming the same recurring signature; this session is a THIRD independent confirmation of the
  same pattern (the second-confirmation file itself names a prior confirmation)
