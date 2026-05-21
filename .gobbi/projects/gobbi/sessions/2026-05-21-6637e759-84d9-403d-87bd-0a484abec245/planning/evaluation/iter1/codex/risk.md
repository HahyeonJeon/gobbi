# Codex Planning Evaluation — Risk Perspective

## Stage 0 Artifact Summary

Risk review focused on destructive operations, local/remote git state, atomic merge behavior, and recovery paths. The plan makes strong safety moves around atomic merge and no-rationalization gates, but it also places destructive local cleanup in executor scope and omits point-of-use base verification.

## Stage 1 Locked Frame

This plan deletes runtime code, project memory, sessions, worktrees, and branches. Risk tolerance is low: manager-only lifecycle boundaries, fresh verification, and fail-closed gates must be exact.

## Stage 2 Findings

### F-CX-PLAN-R-01

- **Type:** destructive-operation owner mismatch
- **Domain:** risk / local git state
- **Disposition:** must-revise
- **Confidence:** 95
- **Severity:** Critical / 90
- **Evidence:** Stage F force-deletes two branches and safe-deletes two others inside Task 02 (`draft-iter1.md:121-127`, `draft-iter1.md:233-239`). `git/SKILL.md` marks `git branch -D` on unmerged branches as Always-Ask unless explicitly authorized, but still assigns lifecycle cleanup to the manager (`.claude/skills/git/SKILL.md:106-123`, `.claude/skills/git/SKILL.md:90-102`). Q-G pre-authorizes the force delete (`scope-contract.md:80-81`), but authorization does not transfer ownership from manager to executor.

### F-CX-PLAN-R-02

- **Type:** stale-state risk
- **Domain:** risk / tag and branch base
- **Disposition:** revise
- **Confidence:** 80
- **Severity:** High / 70
- **Evidence:** The plan hard-codes `487fc35` as current develop tip for tag creation and worktree base (`draft-iter1.md:140-145`, `draft-iter1.md:306-309`). The git skill requires point-of-use sync and remote base re-verification (`.claude/skills/git/SKILL.md:153-160`) and explicitly says re-verification should happen at point of use (`.claude/skills/git/SKILL.md:86`). The plan needs a fail-closed branch if `develop` no longer equals `487fc35`.

### F-CX-PLAN-R-03

- **Type:** positive risk control
- **Domain:** risk / atomic merge
- **Disposition:** keep
- **Confidence:** 95
- **Severity:** None
- **Evidence:** The manager captures `HEAD_SHA` immediately before merge and uses `--match-head-commit "$HEAD_SHA"` (`draft-iter1.md:328-333`). The locked scope contract requires the same mechanism (`scope-contract.md:47-49`, `scope-contract.md:90-108`). Local `gh pr merge --help` shows the flag exists.

### F-CX-PLAN-R-04

- **Type:** positive risk control
- **Domain:** risk / E.2 gate
- **Disposition:** keep
- **Confidence:** 85
- **Severity:** None
- **Evidence:** The Stage E.2 gate checks the branch tip for any committed tree containing the kept session dir (`draft-iter1.md:253-255`). This handles the allowed case where Stage D and E.1 land in different commits, because `git ls-tree <sweep-branch> <kept-session-dir>/` evaluates the final branch tree, not a specific sub-commit.

## Per-Perspective Verdict

FAIL. The destructive cleanup ownership mismatch is severe enough to block the plan even though the atomic merge and E.2 gates are sound.

## Must-Preserve List

- Preserve Q-G force-delete authorization, but execute it under the correct owner.
- Preserve fail-closed `gh pr merge` behavior.
- Preserve E.2 no-SHA-in-session non-circular gate.
- Preserve no `--force` worktree removal.
- Preserve no `git reset --hard` / no stash discipline.
