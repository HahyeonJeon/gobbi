# Gotcha: gobbi-git

Mistakes in git/GitHub workflow, worktree management, branch handling, and PR lifecycle.

---

### Writing notes or gotchas to the worktree instead of the main tree

**Priority:** Critical

**What happened:** During evaluation of the gobbi-git skill design, evaluators identified that `.claude/project/` is in `.gitignore`. When a worktree is created, the `.claude/project/` directory does not exist in the worktree because gitignored directories are not part of the tracked working tree. If a subagent writes notes or gotchas using a relative path in the worktree, the files go to a nonexistent or newly-created local directory that gets destroyed when the worktree is removed after merge. The note system, gotcha system, and resume mechanism all break.

**User feedback:** (Identified during design evaluation — pre-seeded gotcha)

**Correct approach:** Notes, gotchas, and all `.claude/project/` writes must use the main tree's absolute path. The orchestrator must include the main tree path in every delegation prompt when gobbi-git is active. Subagents must never write to `.claude/project/` using relative paths or the worktree's path — always use the main tree's absolute path provided in the briefing.

---

### Using git stash in a worktree leaks state to other worktrees

**Priority:** High

**What happened:** Git stash is stored at the repository level in the shared `.git` directory, not per worktree. A stash created in one worktree appears in `git stash list` from every other worktree. If one agent stashes changes and another agent pops the stash in a different worktree, the first agent's work silently moves to the wrong context.

**User feedback:** (Identified during design research — pre-seeded gotcha)

**Correct approach:** Never use `git stash` in worktrees. Always commit verified work or discard unneeded changes. The gobbi-git skill enforces this as a hard constraint.
