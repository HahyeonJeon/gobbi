---
name: session-foundations-bundle-b
description: Execution plan for session-foundations-bundle-b — worktree-first session architecture (T1 wave, 6 tasks) plus PostToolUse/PostToolUseFailure hook + reconstructor (T3 wave, 4 tasks).
type: plans
scope: feature
feature: git-workflow
status: in-progress
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [worktree-first, session-architecture, post-tool-use, hook, reconstructor]
supersedes: null
task_count: 10
---

# Plan: session-foundations-bundle-b

## Idea anchor

`sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md`

## Scope Contract reference

`sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md` § Scope Contract

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 01 | Insert orchestration/SKILL.md row 5.5 (worktree create + branch naming) | — | grep `chore/session-\{date\}-\{ssid-short\}` in SKILL.md ≥1 match | executor |
| 02 | Qualify git/SKILL.md Memory Access Matrix row 31 + P2 invocation note | #01 | grep `worktreePath` ≥2 matches | executor |
| 03 | Extend preparation/SKILL.md narrow-exception + rollback semantics (LOCK #4) | #01, #02 | grep `git -C.*rm` ≥1 + grep `AskUserQuestion` co-located | executor |
| 04 | gobbi/SKILL.md cross-ref + delegation/SKILL.md main-tree audit | #01, #02 | grep `row 5.5\|Configuration Step 1` in gobbi/SKILL.md | executor |
| 05 | Per-iter commit cadence in 5 workflow phase docs | #01, #03 | grep `-l 'chore(session): record'` returns 5 paths; 0 in eval/memorization | executor |
| 06 | Direct-mode opt-out footnote + smoke-test gate (LOCK #5) | #01 | grep `direct.*mode\|workflow.git.mode` in orchestration/SKILL.md | executor |
| 07 | Create .claude/hooks/post-tool-use-agents.sh (T3 wave gate) | #05, #06 | bash -n exit 0; graceful empty-payload test | executor |
| 08 | Create .claude/scripts/reconstruct-agents.sh (shared context with #07) | #07 | bash -n exit 0; idempotency test | executor |
| 09 | Edit .claude/settings.json PostToolUse + PostToolUseFailure blocks | #07 | jq -e PostToolUse/PostToolUseFailure matcher blocks; jq . exits 0 | executor |
| 10 | orchestration/SKILL.md row 6 narrative + delegation structured headers + flock doc | #01, #04, #06, #07, #08 | grep `PostToolUse\|reconstructor` in orchestration/SKILL.md | executor |

## Dependency graph

T1 wave (01→06) strictly before T3 wave (07→10). File-overlap conflicts:
- orchestration/SKILL.md: 01→06→10 (enforced)
- delegation/SKILL.md: 04→10 (enforced)
- Tasks 07+08: shared executor (LOCK #2)

## Verification strategy summary

All 10 tasks' `verifies:` blocks pass. No broken workspace symlinks. `bash -n` exits 0 on Tasks 07 and 08 scripts. `jq . .claude/settings.json` exits 0. Self-review spec-coverage 18/18 preserved.

## Open issues

- Task 07+08 context-budget risk (LOCK #2 shared-executor; see assumption_risk staging)
- Hook PostToolUseFailure self-failure budget unstated (see assumption_risk staging)
- D-ref codes need inline expansion in execution briefs (see checklist_gap staging)
- `effort:` field is non-canonical (Low; see checklist_gap staging)
- Task 01 traces-to T1.c overclaim (Low; see checklist_gap staging)
