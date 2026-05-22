---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
status: accepted
feature: repo-reset
finding-id: F-CX-PLAN-O-01
finding-type: design_flaw
domain: process
severity: Critical
confidence: 95
disposition: addressed
supersedes: null
superseded_by: null
mistake-candidate: true
---

# Honor git/SKILL.md Role Boundaries for ALL Six Manager-Owned Categories

## Context

iter1 Plan delegated both the archival tag push and Stage F (worktree-remove + local-branch cleanup) to executor tasks, justifying this with an unwritten "local-ref mutation carve-out" not present in `git/SKILL.md`. `git/SKILL.md` Role Boundaries table explicitly assigns Push, Cleanup, Issue, Worktree, Branch (remote push), PR, and Merge to the Manager ("Subagent: Never").

## Decision

Extend D-PLAN-04 to ALL six manager-owned categories per the literal `git/SKILL.md` Role Boundaries table. Tag push moves out of Task 01 to Manager pre-Task-02 §1b; Stage F (worktree-remove + branch cleanup) moves out of Task 02 to Manager post-Task-02 §5a + §5b.

## Rationale

The leader invented a carve-out ("local-ref mutations are executor-safe") that does not appear in the skill. The user lock D-PLAN-04 was set precisely to honor the skill's literal table. Extending a scope boundary beyond what the user locked — even when it seems reasonable — is the `executor-boundary-extension-without-asking` pattern.

## Alternatives considered

Keep Stage F in Task 02 with the "local-ref mutation" carve-out. Rejected at iter2 REVISE because the carve-out is not in the skill and the user had not authorized it.

## Consequences

Manager pre/post-Execution operations expanded to 13 steps. Executor scope reduced to Stages A-E.2 only (3 commits + 1 terminal FS delete). The executor delegation prompt must explicitly state the boundary.

## Related

- `planning/rawdata/draft-iter4.md` § D-PLAN-04
- `.claude/skills/git/SKILL.md` § Role Boundaries
- `.gobbi/projects/gobbi/mistakes/executor-rationalized-failing-verification-gate.md`
