# Codex Planning Evaluation — Usage Perspective

## Stage 0 Artifact Summary

Usage review walks the plan as the Execution manager and executor would use it. The manager has a clear post-Task-02 sequence for push/PR/merge. The executor guidance is less safe because it asks subagents to perform operations that the git skill reserves for the manager.

## Stage 1 Locked Frame

The user explicitly locked D-PLAN-04: honor git-skill role boundaries. The usable plan must let an executor do only executor work and let the manager run lifecycle operations without a subagent having to infer exceptions.

## Stage 2 Findings

### F-CX-PLAN-U-01

- **Type:** user-lock violation
- **Domain:** usage / executor boundary
- **Disposition:** must-revise
- **Confidence:** 95
- **Severity:** Critical / 90
- **Evidence:** D-PLAN-04 says subagents commit but never push, create PRs, or merge (`draft-iter1.md:539-550`), but the same plan keeps Task 01 as an executor that pushes a tag (`draft-iter1.md:136-145`, `draft-iter1.md:384-393`). `git/SKILL.md` says subagents never push (`.claude/skills/git/SKILL.md:53-55`, `.claude/skills/git/SKILL.md:170`). This is a direct usability trap: a correctly briefed executor should refuse its own task.

### F-CX-PLAN-U-02

- **Type:** user-lock violation
- **Domain:** usage / executor boundary
- **Disposition:** must-revise
- **Confidence:** 95
- **Severity:** Critical / 90
- **Evidence:** Task 02's special discipline says no push/PR/merge, but still instructs the executor to remove worktrees and delete local branches (`draft-iter1.md:405`, `draft-iter1.md:115-127`). `git/SKILL.md` Role Boundaries puts cleanup on the manager side and says the subagent "works within" the worktree (`.claude/skills/git/SKILL.md:90-102`). A user expecting D-PLAN-04 to be honored would not expect the executor to run local lifecycle cleanup.

### F-CX-PLAN-U-03

- **Type:** positive verification
- **Domain:** usage / atomic merge
- **Disposition:** keep
- **Confidence:** 90
- **Severity:** None
- **Evidence:** The manager captures `HEAD_SHA` after Task 02 is done, after push, after PR creation, and after CI monitoring, immediately before `gh pr merge --match-head-commit "$HEAD_SHA"` (`draft-iter1.md:317-333`). `gh pr merge --help` confirms `--match-head-commit SHA` is supported. This correctly answers the atomic-guard timing concern.

## Per-Perspective Verdict

FAIL. The executor-facing plan violates the role boundary the user specifically locked.

## Must-Preserve List

- Preserve manager-side HEAD_SHA capture immediately before merge.
- Preserve manager-side PR creation and CI monitoring.
- Preserve no retry/no rationalization on merge failure.
- Preserve clear executor instruction not to push, create PRs, or merge.
