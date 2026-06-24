---
name: pipeline-order-d8-git-last
description: User revised wrap-up pipeline to move git tasks to the END (stage 5), after memory validation
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [wrap-up, git]
keywords: [pipeline, locked]
author: claude
outcome: D8 session record stays worktree-local; wrap-up = 5 stages; git finalization is stage 5 (LAST)
---

# Pipeline order: D8 — git tasks move to the end of wrap-up

## Context
The leader proposed a wrap-up pipeline with session record staging in a local worktree (not committed as part of the session record), and git finalization as a separate stage. The user's pipeline revision moved git tasks explicitly to the END.

## Question
Where in the wrap-up pipeline should git finalization (commit, push, PR/merge, worktree cleanup) sit? Should the session record be committed?

## Options considered
- Leader draft: git was not explicitly placed; session record was worktree-local.
- User revision: git tasks move to END of wrap-up; session record stays worktree-local (gitignored).

## User decision
D8: **Session record stays worktree-local** (gitignored, not committed). Wrap-up is a 5-stage pipeline; **git finalization is stage 5 (LAST)**. The 5-stage order: (1) session-record validation, (2) memorization (promotion), (3) memory validation, (4) handoff, (5) git finalization.

## Implication
Git finalization is always the last stage. It runs ONLY after stage 3 (memory validation) passes. This is the direct motivation for D13 (non-skippable stage 3). The promoted (tracked) memory is what git commits — not the session record.

## Related
- Discussion log D8 (2026-06-12 session)
- Design § D-c (5-stage pipeline table)
- `features/workflow/discussions/2026-06-13-stage3-nonskippable-d11-d13.md`
