---
name: locked-wording-supersedes-readability-nit
description: User-locked wording supersedes evaluator readability nits — when a decision is explicitly locked, aesthetics findings on that wording are non-actionable.
type: learnings
scope: project
feature: null
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [evaluation, locked-decisions, iron-law-4, aesthetics]
supersedes: null
superseded_by: null
---

# User-locked wording supersedes evaluator readability nits

## Insight

When the user explicitly locks a wording decision, evaluator findings about that wording's readability or style are non-actionable regardless of severity. The wording is the deliverable, not an aesthetic choice subject to improvement.

## Context

While sweeping a user-locked `{session-id}` sentence across ten skill files, an Aesthetics evaluator raised a Low-severity finding (confidence 50): the locked sentence ran ~290 characters and was visibly denser than the neighboring Path-conventions bullets. The verdict stayed PASS anyway — the wording was user-locked, so its density was out of bounds for an aesthetics correction.

## Why it matters

Without this guard, a future evaluator or executor could "fix" the readability of a locked sentence, re-opening a user decision that was already closed (Iron Law 4 violation: scope bounded by contract with user).

## How to apply

When an evaluator flags a Low-severity style/readability finding on text that the user has explicitly locked: stage the finding as a learning (non-actionable) and record the lock reference. Do not stage it as a decision requiring resolution or as a REVISE trigger.

## Counter-cases

If a locked wording is discovered to be factually wrong (not just stylistically dense), that is a different category — surface to the manager as a possible DL override candidate, not a quiet readability fix.

## Related

- Iron Law 4 (scope bounded by contract with the user) in `.gobbi/projects/gobbi/skills/principles/SKILL.md` — the principle this learning operationalizes for evaluator findings.

## Source

Originating session: `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/` — the locked-wording sweep and the deferred aesthetics finding that produced this learning.
