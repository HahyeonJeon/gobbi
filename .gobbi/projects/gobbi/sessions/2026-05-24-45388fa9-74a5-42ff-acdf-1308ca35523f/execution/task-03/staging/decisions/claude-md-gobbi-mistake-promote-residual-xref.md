---
date: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
status: deferred
feature: session-foundations-bundle-c
supersedes: null
superseded_by: null
source-findings: [P-1, C-1, O-1]
source-perspectives: [project, consistency, overall]
source-iter: 1
source-system: claude
finding-type: general
domain: docs-sync
disposition: open
severity: Low
confidence: 100
---

# CLAUDE.md `gobbi mistake promote` residual — cross-reference to T07

## Context

T03 (CL-3) retires the `gobbi mistake promote` CLI fiction from `mistake/SKILL.md`. Three Claude evaluator perspectives (Project P-1, Consistency C-1, Overall O-1) independently flagged that `.claude/CLAUDE.md` "Gobbi-specific tooling" section still instructs "run `gobbi mistake promote` to promote corrections" — the same fiction, now present in the top-level CLAUDE.md while absent from mistake/SKILL.md.

## Decision

This residual is **explicitly out-of-scope for T03** (see T03 OOS list: CLAUDE.md). It is tracked as an existing follow-up under T07 (this session's task for sweeping CLAUDE.md and other consumers of the `gobbi mistake promote` string).

**No new backlog entry created here.** T07 already owns this work in the session plan. This staging file exists only as a cross-reference so Wrap-up can confirm T07 covered it without creating a duplicate.

## Rationale

Filing a separate backlog entry for an already-tracked follow-up would create duplicate tracking and potentially conflicting scope. The T03 evaluation correctly classified P-1/C-1/O-1 as Low / OOS / non-blocking. T07 is the designated owner.

## Consequences

At Wrap-up: verify T07 closed this residual. If T07 was not run or was deferred, promote a `backlogs/project/` entry at that point.

## Related

- `execution/task-03/evaluation/iter1/claude/project.md` — finding P-1
- `execution/task-03/evaluation/iter1/claude/consistency.md` — finding C-1
- `execution/task-03/evaluation/iter1/claude/overall.md` — finding O-1
- Session plan T07 (CLAUDE.md `gobbi mistake promote` sweep)
