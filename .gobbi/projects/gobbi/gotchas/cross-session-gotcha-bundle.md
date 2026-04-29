# Cross-session untracked gotchas need a worktree-PR bundle plan

---
priority: medium
tech-stack: gobbi-workflow, git
enforcement: advisory
---

**What happened**

A gotcha file authored in session A (`ded7e47f`) was left untracked at session boundary — sitting in `.gobbi/projects/gobbi/learnings/gotchas/codex-overall-perspective-hangs.md` with no commit recording it. Session B (`be54be80`) found the file as `?? ` in `git status`. Direct commit + push to `develop` is blocked by the harness ("PR-only changes to integration branch"). Naively committing-then-pushing created a local-only commit that couldn't propagate.

**User feedback**

User initially chose "Commit to develop now, before any PR (Recommended)" — push was blocked. User then chose to "Bundle into PR 1" via AskUserQuestion. Resolution: `git reset --soft HEAD~1` to undo the develop commit (leaves the file in worktree as untracked), then bundle the file into the first worktree-PR's branch.

**Correct approach**

When a session ends with an authored-but-uncommitted gotcha file, the next session must:

1. Discover the file via `git status --short` at session start
2. Plan to bundle it into the next worktree-PR (any PR — semantic relevance not required; the commit message documents the carry rationale)
3. After worktree creation: `cp` the file from the main tree to the worktree (untracked files do NOT carry over from one working tree to another via `git worktree add`)
4. Commit it as part of that PR's branch with a message like `docs(gotchas): bundle <slug> from prior session`

If the harness blocks direct push to develop, do NOT attempt to bypass — the rule exists to keep integration-branch history reviewable. Bundle and proceed.

**Why this matters**

Authored gotchas are the highest-value knowledge in the system; leaving them un-promoted because of session-boundary friction defeats the whole point of the gotcha discipline. The bundle pattern adds zero overhead (one extra commit on a worktree-PR that was going to ship anyway) and preserves the harness invariant that all develop changes go through PR review.

See PR #206 commit `e5e7b93` (revised to `eba831b` for H1 heading fix) for a worked example. Captured during session `be54be80` on 2026-04-27.
