---
loop: planning
iter: 4
artifact_type: manager-ops
created_at: 2026-05-21
status: final
supersedes: []
related:
  - planning/artifacts/task-list.md
  - planning/rawdata/draft-iter4.md
---

# Manager pre/post-Execution Operations — Repo Reset (Planning iter4 PASS)

Per D-PLAN-04 (user-locked) + Fix 1 (iter2 role-boundary remediation): the manager performs these operations DIRECTLY (not via subagent delegation) before and after the executor tasks. These are NOT planned tasks — Planning decomposes only executor work.

**Primary reference**: `planning/rawdata/draft-iter3.md` § Manager pre/post-Execution operations (canonical detail; see lines 318-420 of draft-iter3.md for full prose).

---

## Pre-Task-01 (manager-direct)

**§1. Create the GitHub issue** — `gh issue create --title "<title>" --body "<body>"`. Issue body cites the 19 user-confirmed locks + pre-reset tag + this Plan's path + iter2/3/4 deltas + iter2 REVISE rationale. The returned issue number drives the sweep branch name (per `git/conventions.md`).

---

## Pre-Task-02 (manager-direct, after Task 01 returns DONE)

**§1b. Push the pre-reset tag to origin** (Fix 1 iter2 — tag push moved out of Task 01):
```
git push origin pre-reset-2026-05-21
```
Verify: `git ls-remote --tags origin | grep pre-reset-2026-05-21` matches. Completes Success Criterion #9's origin half (Task 01 verified local half).

**§2. Create the worktree** at `.gobbi/projects/gobbi/worktrees/<sweep-branch>/`, branched from develop tip `487fc35`:
```
git worktree add -b <sweep-branch> .gobbi/projects/gobbi/worktrees/<sweep-branch>/ develop
```

**§3. Install deps** in the worktree (no-op for current repo state).

**§4. Delegate Task 02** with: absolute worktree path, `<sweep-branch>` name, issue number, user-locked context (19 locks + 3 pre-routed constraints + 4 D-PLAN locks + Fix 1 iter2 scope boundary). Delegation prompt's `## Constraints / Scope` block explicitly states: "executor stops after Stage E.2; do NOT push, do NOT create PR, do NOT merge, do NOT remove worktrees, do NOT delete branches — Stage F + Stage G are MANAGER scope per D-PLAN-04."

---

## Post-Task-02 (manager-direct, after Task 02 returns DONE)

### Stage F (per `git/SKILL.md` Procedure P5 — Cleanup = Manager)

**§5a. Stage F.1 — Worktree removal** (Fix 1 iter2 + Fix 2 iter3 adds precheck):

**Precheck EACH worktree before `git worktree remove`** (iter3 Fix 2 — closes F-CL2-P-02 + F-CL2-R-01):
```
cd .gobbi/projects/gobbi/worktrees/redesign-v050-ideation && git status --porcelain
# On non-empty output → NEEDS_CONTEXT to user ("uncommitted changes; investigate or accept loss?")
# MUST NOT auto-`--force` — Forbidden Operation per `git/SKILL.md` without explicit user authorization
cd .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules && git status --porcelain
# Same NEEDS_CONTEXT rule on non-empty output
```
Only after BOTH precheck outputs are empty (or user explicitly authorized via NEEDS_CONTEXT round-trip):
```
git worktree remove .gobbi/projects/gobbi/worktrees/redesign-v050-ideation         # NO --force
git worktree remove .gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules  # NO --force
git worktree prune
find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete
```

**§5b. Stage F.2 — Local branch deletion** (Fix 1 iter2):
```
git branch -d fix/257-complete-mirror-sync      # safe-delete, Q-G
git branch -d refactor/257-skills-agents-rules  # safe-delete, Q-G
git branch -D pr-fin-2-decisions-hold           # force-delete; Q-G pre-authorized
git branch -D redesign/v050-ideation            # force-delete; Q-G pre-authorized
```
(`-D` pre-authorized by Scope Contract § Q-G; satisfies Always-Ask category per `git/SKILL.md` Forbidden Operations)

### Stage G (Push + PR + atomic-guard merge + post-merge cleanup)

**§6. Push the sweep branch to origin** (from the sweep worktree):
```
cd <worktree-absolute-path> && git push -u origin <sweep-branch>
```

**§7. Open the PR** into `develop`:
```
gh pr create --base develop --head <sweep-branch> \
  --title "chore(<issue-num>): destructive repo reset pre-rebuild" \
  --body "<body citing 19 locks + 3 pre-routed constraint resolutions + pre-reset-2026-05-21 tag + iter2 REVISE fixes + iter4 deltas>"
```

**§8. Monitor CI**:
```
gh pr checks <pr-num> --watch
```
**Timeout caveat** (F-CL-PF-01 cleanup iter2): `gh pr checks --watch` polls until checks complete or user interrupts. If CI runs longer than the manager's session-level patience window, pause and emit NEEDS_CONTEXT ("CI still running after <duration>; investigate or wait?"). No silent retry.

**§9. Capture HEAD_SHA and atomic-guard merge** (per `git/SKILL.md` Procedure P5 + iter4 Q-iter4-Override):
```
HEAD_SHA=$(gh pr view <pr-num> --json headRefOid -q .headRefOid)
gh pr merge <pr-num> --squash --delete-branch --match-head-commit "$HEAD_SHA"
```
Non-zero exit → no retry, no rationalization (per `executor-rationalized-failing-verification-gate.md`); re-contract with user. Per D-PLAN-03 / F-CX-O4-01: `--delete-branch` removes both local and remote sweep-branch refs; NO redundant `git branch -d <sweep-branch>`.

**§10. Post-merge develop sync** (from main tree):
```
cd /playinganalytics/git/gobbi && git checkout develop && git pull --ff-only
```

**§11. Sweep worktree cleanup** (per `git/SKILL.md` Procedure P5 steps 3-5):
```
git worktree remove .gobbi/projects/gobbi/worktrees/<sweep-branch>  # NO --force
git worktree prune
find .gobbi/projects/gobbi/worktrees/ -mindepth 1 -type d -empty -delete
```

**§12. Close the linked issue manually** (per `git/SKILL.md` Procedure P5 step 6 — `develop` is non-default; PR closing keywords do NOT auto-fire):
```
gh issue close <issue-num> -c "Closed by PR #<pr-num>"
```

**§13. Post-merge Success Criteria verification** (manager runs criteria the executor could not, plus re-run of executor-side criteria from the main tree):
- **#2**: `git log --oneline -2 develop` → 1 new squash commit + `487fc35`
- **#5 (post-merge)**: `git branch | grep -vE '^[* ] (main|develop)$'` → no rows (sweep branch gone via `--delete-branch`; 4 Q-G branches gone via step 5b)
- **#6 (post-merge)**: `git worktree list | wc -l` → 1 (main only)
- **#9 (origin half)**: confirmed at step 1b above
- **#14**: `gh pr merge` exit code 0 (observed in step 9; recorded for audit)
- Re-run #1, #3, #4, #7, #8, #10-13 from the main tree (post-checkout-develop, post-pull) to confirm squash-merged state

---

## NEEDS_CONTEXT recovery semantics

- Task 02's NEEDS_CONTEXT fires at Stage E.2's gate (either `git log` returns empty SHA or `git ls-tree` misses the kept session dir).
- Manager-side NEEDS_CONTEXT fires at §5a (non-empty `git status --porcelain` for either stale worktree), §8 (CI timeout per F-CL-PF-01), or §9 (non-zero exit from `gh pr merge --match-head-commit`).
- Either case: no retry, no rationalization (per `executor-rationalized-failing-verification-gate.md`); the responsible role re-contracts with the user.
