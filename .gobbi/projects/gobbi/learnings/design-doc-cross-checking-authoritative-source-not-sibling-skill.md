---
title: "Design docs memorializing a model must cross-check the AUTHORITATIVE source, not a sibling skill or stale memorial"
discovered: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [docs-authoring, evaluation, consistency, docs-sync]
related: [leader-iter2-verification-claim-without-evidence]
promoted-from: sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-05/staging/learnings/design-doc-cross-checking-authoritative-source-not-sibling-skill.md
promoted-at: 2026-05-25
---

# Design docs memorializing a model must cross-check the AUTHORITATIVE source, not a sibling skill or stale memorial

## Insight

When authoring a design doc that describes a row, phase, or ordering in a live model (e.g.,
orchestration Step 1 table), the executor must verify every row label and sequencing claim
directly against the authoritative source — not against a sibling skill file (e.g.,
`git/SKILL.md`) or a locked memorial (e.g., D-1) that may itself carry stale row references.

## Context

T05 (session `2026-05-24-45388fa9`) authored
`.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` to memorialize the
worktree-first session lifecycle. The executor grounded the row-label claims in `git/SKILL.md:155`
and the D-1 memorial — both of which said "Configuration row 5.5" for worktree creation.
However, T02 (commit `2b537ae`) had reordered the `orchestration/SKILL.md` Step 1 table,
moving worktree creation from row 5.5 to **row 5**, without updating `git/SKILL.md` or D-1.

The dual-system EVAL caught this (both systems REVISE, High confidence 100): Claude found
F-CONS-1/F-USAGE-1/F-RISK-1; Codex found CONS-001. Both traced the same root defect: a
pre-existing cross-skill contradiction was inherited and propagated into an `accepted`
canonical artifact rather than resolved at authoring time.

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
3. If a sibling skill (e.g., `git/SKILL.md`) or a memorial (e.g., D-1) disagrees, do NOT
   assume the sibling is correct. The live orchestration skill is the authority.
4. Stage the sibling/memorial drift as a separate backlog — do not fix it in the same commit
   as the design doc (scope discipline), but do not ignore it.

## Counter-cases

This does not apply when the design doc is itself the authoritative source (e.g., a doc that
defines the model, not one that describes it). It also does not apply when all candidate sources
agree — cross-check effort is only warranted when there are multiple sources with potentially
stale content.

## Related

- Project mistake: `.gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md`
- T05 iter1 EVAL: `sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-05/evaluation/iter1/claude/consistency.md` (F-CONS-1) and `...codex/consistency.md` (CONS-001)
- Follow-up backlog: `sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-05/staging/backlogs/project/git-skill-stale-row-5-5-worktree-reference.md`
