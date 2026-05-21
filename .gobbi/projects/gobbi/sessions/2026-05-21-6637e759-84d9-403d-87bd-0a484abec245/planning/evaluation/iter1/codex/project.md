# Codex Planning Evaluation — Project Perspective

## Stage 0 Artifact Summary

Reviewed `planning/rawdata/draft-iter1.md` and stamped `planning/staging/plans/main.md` against the locked Ideation contract, Preparation handoff, project mistakes, and `git/SKILL.md`. The plan decomposes the repo reset into two executor tasks plus manager pre/post operations: Task 01 creates/pushes the archival tag; Task 02 performs the destructive sweep, Stage F cleanup, and terminal E.2 filesystem delete; the manager handles issue/worktree setup and Stage G push/PR/merge/post-merge cleanup.

## Stage 1 Locked Frame

Adversarial frame: this plan must preserve all 19 Ideation locks, map all 14 success criteria to Task 01/Task 02/Manager, honor D-PLAN-04 git role boundaries, and mechanically satisfy F-CX-PREP-O-01 before Stage C wipes project mistakes. The main project-level risk is that the plan treats local-only git operations as safe for executors even though the repository's canonical git skill assigns pushes, worktree cleanup, and branch lifecycle to the manager.

## Stage 2 Findings

### F-CX-PLAN-P-01

- **Type:** role-boundary violation
- **Domain:** project / git workflow
- **Disposition:** must-revise
- **Confidence:** 95
- **Severity:** Critical / 90
- **Evidence:** Task 01 is assigned to an `executor` but its `what` and `traces-to` require `git push origin pre-reset-2026-05-21` (`draft-iter1.md:136-145`, `draft-iter1.md:384-393`). `git/SKILL.md` says the manager owns "issues / branches / pushes / PRs / merges / cleanup" and subagents "never push" (`.claude/skills/git/SKILL.md:11`, `.claude/skills/git/SKILL.md:53-55`, `.claude/skills/git/SKILL.md:170`, `.claude/skills/git/SKILL.md:122`). The tag push is still a push; it should be manager-direct, not an executor task.

### F-CX-PLAN-P-02

- **Type:** role-boundary violation
- **Domain:** project / git workflow
- **Disposition:** must-revise
- **Confidence:** 95
- **Severity:** Critical / 90
- **Evidence:** Stage F is explicitly inside Task 02 and includes `git worktree remove` plus `git branch -d/-D` local branch deletes (`draft-iter1.md:115-127`, `draft-iter1.md:233-239`, `draft-iter1.md:405`). `git/SKILL.md` assigns worktree removal and cleanup to the manager, local branch create/rename ownership to the manager, and says the subagent only commits inside the worktree (`.claude/skills/git/SKILL.md:90-102`, `.claude/skills/git/SKILL.md:139-170`). Keeping Stage F in executor scope contradicts D-PLAN-04's "honor role boundaries" lock.

### F-CX-PLAN-P-03

- **Type:** decomposition gap
- **Domain:** project / dependency table
- **Disposition:** revise
- **Confidence:** 80
- **Severity:** High / 75
- **Evidence:** Implementation Checklist Stage A includes opening the sweep branch off `develop` (`implementation-checklist.md:23-28`), but self-review maps Stage A entirely to Task 02 (`draft-iter1.md:417-425`) while manager worktree creation appears only as a pre-Task-02 operation (`draft-iter1.md:304-311`). The plan is recoverable because the manager operation exists, but the checklist-stage owner mapping is false.

## Per-Perspective Verdict

FAIL. Critical role-boundary violations mean the plan is not executable under the repository's canonical git workflow.

## Must-Preserve List

- Preserve the single-executor sweep intent for Stages B through E.2 so F-CX-PREP-O-01 remains satisfied.
- Preserve explicit inclusion of both `.claude-plugin/marketplace.json` and `.gobbi/projects/gobbi/project.json`.
- Preserve manager-only push, PR creation, CI monitoring, atomic merge, and post-merge verification.
- Preserve `HEAD_SHA` capture immediately before `gh pr merge --match-head-commit`.
- Preserve the removal of the redundant post-merge `git branch -d <sweep-branch>` step.
