---
name: design-doc-cross-checking-authoritative-source-not-sibling-skill
description: Design docs memorializing a model must cross-check the authoritative source, not a sibling skill or stale memorial.
type: learnings
scope: project
feature: null
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [docs-authoring, evaluation, consistency, docs-sync]
supersedes: null
superseded_by: null
---

# Design docs memorializing a model must cross-check the AUTHORITATIVE source, not a sibling skill or stale memorial

## Insight

When authoring a design doc that describes a row, phase, or ordering in a live model (e.g.,
orchestration Step 1 table), the executor must verify every row label and sequencing claim
directly against the authoritative source — not against a sibling skill file (e.g.,
`git/SKILL.md`) or a locked memorial (e.g., D-1) that may itself carry stale row references.

## Context

An executor authored `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` to
memorialize the worktree-first session lifecycle. The executor grounded the row-label claims in
`git/SKILL.md` and a locked design memorial — both of which said worktree creation happens at
"Configuration row 5.5." However, an earlier task in the same session had reordered the
`orchestration/SKILL.md` Step 1 table, moving worktree creation from row 5.5 to **row 5**, without
updating `git/SKILL.md` or the memorial. The design doc inherited the stale row label.

Both evaluators independently caught this and returned REVISE at high confidence. Both traced the
same root defect: a pre-existing cross-skill contradiction was inherited and propagated into an
`accepted` canonical artifact rather than resolved at authoring time.

## Why it matters

A design doc that memorializes an incorrect row label does not just contain a typo — it creates
reader misdirection (the model's row labels guide readers to the wrong Step when they inspect or
patch the orchestration). The project mistake `leader-iter2-verification-claim-without-evidence`
describes this class of error: a claim grounded in a witness (memorial/sibling skill) that was
not cross-checked against the authoritative implementation. High reader-trust canonical docs
amplify the cost of that error.

## How to apply

Before committing a design doc that states Step-N, row-M, or phase-sequence claims:

1. Identify the **single authoritative source** for the claim — typically the live skill that
   owns the model (e.g., `orchestration/SKILL.md` for Step 1 rows).
2. Open that file directly; grep for the row or phase label; confirm the claim matches.
3. If a sibling skill (e.g., `git/SKILL.md`) or a locked design memorial disagrees, do NOT
   assume the sibling is correct. The live orchestration skill is the authority.
4. Stage the sibling/memorial drift as a separate backlog — do not fix it in the same commit
   as the design doc (scope discipline), but do not ignore it.

## Counter-cases

This does not apply when the design doc is itself the authoritative source (e.g., a doc that
defines the model, not one that describes it). It also does not apply when all candidate sources
agree — cross-check effort is only warranted when there are multiple sources with potentially
stale content.

## Related

- `.gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md` — the project mistake describing the same class of error (a claim grounded in an un-cross-checked witness).
- `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` — the design doc whose stale row label produced this learning.

## Source

Originating session: `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/` — the dual-system evaluation that caught the inherited cross-skill contradiction.
