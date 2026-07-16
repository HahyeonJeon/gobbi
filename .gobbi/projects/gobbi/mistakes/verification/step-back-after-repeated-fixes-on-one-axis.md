---
name: step-back-after-repeated-fixes-on-one-axis
description: Patching the same finding-axis 2-3 times, each defeated by a fresh counterexample, signals the design goal is wrong, not the patch — stop and re-examine before a 4th attempt.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [process, verification]
keywords: [principle-8, root-cause, repeated-fixes, escalation, design-loop]
author: claude
priority: medium
domain: process
related: [mechanical-single-primary-from-overlapping-set-impossible]
---

# Repeated fixes on one axis, each defeated afresh, mean the goal is wrong

## What happened

The scenario taxonomy's "primary category" classification mechanism was patched across 4 consecutive
Ideation iterations (iter2, iter3, iter4, and a portion of iter4's own findings) — each iteration
replaced the mechanism with a different one (named rules → catalog backstop → global semantic order),
and each replacement was immediately defeated by a fresh counterexample the evaluators found. The
pattern was not noticed as a pattern until the 4th round, when the batch-capacity counterexample made
clear that no set-based rule could work at all (see the paired mistake,
`mechanical-single-primary-from-overlapping-set-impossible`).

## Why it happens

When a finding keeps recurring on the same axis after a fix, the natural response is to treat the LATEST
counterexample as the thing to patch — refine the rule, add an exception, extend the table. This treats
each round as an isolated bug. But three-plus rounds of "fix defeated by fresh counterexample" is itself
a signal: it means the underlying GOAL or understanding of the problem is wrong, not that the current
patch is merely incomplete (Principle 8 — fix the root cause, not the symptom). Continuing to patch
without stepping back burns iteration budget chasing symptoms of a structurally unfixable approach.

## Correct approach

After roughly 2-3 failed fixes on the SAME finding-axis, each defeated by a NEW counterexample rather
than converging, STOP patching that axis directly. Instead:
1. Re-examine the underlying goal the mechanism was trying to serve (here: "give every family a single
   correct primary category").
2. Ask whether the goal itself is achievable by ANY mechanism of the kind being tried (here: a mechanism
   reading only set membership) — not just whether THIS mechanism is buggy.
3. Surface the root insight to the user with the pattern named explicitly, plus options — do not keep
   iterating silently.
This is exactly what happened on round 4 here: instead of a 5th mechanical patch, the pattern was named
("no mechanical rule is semantically correct for every overlapping family") and surfaced to the user,
who made the author-declared-primary decision.

## How to detect

Two or three evaluation rounds in a row where: (a) the finding is on the same design element / axis,
(b) each round's fix is a DIFFERENT mechanism than the last (not a small tweak to the same mechanism),
and (c) each fix is defeated by a fresh counterexample rather than the finding closing. That
"defeated-by-fresh-counterexample, repeatedly, on one axis" shape — not the number of rounds alone — is
the trigger to stop patching and re-examine the goal.

## Related

- [[mechanical-single-primary-from-overlapping-set-impossible]] — the concrete case this process trap
  fired on: 4 rounds of classification-rule patches, each defeated afresh, until the user made the
  author-declared-primary decision
