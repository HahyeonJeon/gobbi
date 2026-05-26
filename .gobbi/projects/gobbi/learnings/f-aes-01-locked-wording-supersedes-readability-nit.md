---
name: f-aes-01-locked-wording-supersedes-readability-nit
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

# User-locked wording supersedes evaluator readability nits (DL-5 pattern)

## Insight

When the user explicitly locks a wording decision (e.g., via `idea.md DL-5`), evaluator findings about that wording's readability or style are non-actionable regardless of severity. The wording is the deliverable, not an aesthetic choice subject to improvement.

## Context

T06 (CL-5) — Aesthetics evaluator raised F-AES-01 (Low, conf 50): the locked M2 `{session-id}` sentence is ~290 chars and denser than neighboring Path-conventions bullets. Verdict was still PASS because the wording is user-locked at `idea.md DL-5`.

Finding: `execution/task-06/evaluation/iter1/claude/aesthetics.md` — F-AES-01 | Type: general | Domain: docs-sync | Disposition: open | Confidence: 50 | Severity: Low.

## Why it matters

Without this guard, a future evaluator or executor could "fix" the readability of a locked sentence, re-opening a user decision that was already closed (Iron Law 4 violation: scope bounded by contract with user).

## How to apply

When an evaluator flags a Low-severity style/readability finding on text that is user-locked (any `idea.md DL-*` decision): stage the finding as a learning (non-actionable) and record the lock reference. Do not stage as a decision requiring resolution or as a REVISE trigger.

## Counter-cases

If a locked wording is discovered to be factually wrong (not just stylistically dense), that is a different category — surface to the manager as a possible DL override candidate, not a quiet readability fix.

## Related

- `idea.md DL-5` (session 2026-05-24-45388fa9) — locked M2 `{session-id}` wording
- Iron Law 4: scope bounded by contract with user
- `execution/task-06/evaluation/iter1/claude/aesthetics.md` — F-AES-01 source finding
