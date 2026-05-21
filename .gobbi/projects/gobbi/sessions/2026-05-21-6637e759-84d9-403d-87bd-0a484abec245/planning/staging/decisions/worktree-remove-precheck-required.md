---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
status: accepted
feature: repo-reset
finding-id: F-CL2-P-02
finding-type: design_flaw
domain: process
severity: Medium
confidence: 80
disposition: addressed
supersedes: null
superseded_by: null
---

# Manager §5a Worktree-Remove Requires `git status --porcelain` Precheck Before Each Removal

## Context

iter2 Plan had Manager §5a removing two non-sweep worktrees (`redesign-v050-ideation`, `refactor/257-skills-agents-rules`) without the `git status --porcelain` precheck that `git/SKILL.md` Procedure P5 step 3 mandates. Under failure (uncommitted changes in either worktree), the manager would be tempted to reach for `--force` — a Forbidden Operation per `git/SKILL.md` without explicit user authorization.

## Decision

Manager §5a prepends a `cd <worktree-path> && git status --porcelain` check for EACH of the two non-sweep worktrees before running `git worktree remove`. On non-empty output: emit NEEDS_CONTEXT to the user (not auto-`--force`).

## Rationale

`git/SKILL.md` Procedure P5 step 3 mandates this check. The `--force` flag is in the "Always-Ask" Forbidden Operations category — it must not be used without explicit user authorization. A non-empty `git status` is the signal that investigation is needed.

## Alternatives considered

Skip precheck, run `git worktree remove` and handle errors. Rejected because errors at this point would either result in a silent failure or tempt the manager to use `--force`.

## Consequences

Manager pre/post-Execution operations §5a now has a two-stage shape: precheck loop → conditional NEEDS_CONTEXT OR removal sequence. The NEEDS_CONTEXT path is documented explicitly.

## Related

- `planning/rawdata/draft-iter4.md` § D-PLAN-09
- `.claude/skills/git/SKILL.md` § Procedure P5 step 3
- `.claude/skills/git/SKILL.md` § Forbidden Operations
