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

---

### Unpushed local commits silently included in PR via squash merge

**Priority:** Critical

**What happened:** During the first gobbi-git workflow test, the orchestrator created a worktree from the local `develop` branch which had 2 unpushed commits (gobbi-git skill creation and prerequisites). The worktree branched from the local HEAD, so the PR branch included those unpushed changes. When the PR was squash-merged on GitHub, the squash commit absorbed all differences between the PR branch and the remote target — not just the intended version bump, but also the 2 unpushed commits. After merge, the local `develop` and remote `develop` had diverged because the remote gained a squash commit containing the local-only changes, while the local still had them as separate commits. Rebasing caused conflicts.

**User feedback:** (Discovered during first git workflow test)

**Correct approach:** Before creating a worktree for a PR workflow, the orchestrator must ensure the base branch is pushed to remote and up to date. Run `git push` on the base branch before `git worktree add`. This guarantees the PR diff contains only the intended changes, and the post-merge pull is a clean fast-forward. Add this as a prerequisite check or as a step in the "Before delegation" phase of gobbi-git.

---

### Merge and cleanup not tracked in workflow task list

**Priority:** High

**What happened:** During the first git workflow test, the orchestrator created tasks for issue creation, worktree setup, delegation, and PR creation — but no task for "Merge PR and cleanup." When FINISH was selected, the merge and cleanup steps (squash merge, branch deletion, worktree removal, pruning) happened outside the task tracking system. This made it hard for the user to see what steps were planned for the FINISH phase.

**User feedback:** "Merge and clean-up should be included to TODOs."

**Correct approach:** When using git workflow mode, include a "Merge PR and cleanup" task in the workflow task list. This task covers: squash merge the PR, delete the remote branch, close the issue explicitly (see closing keyword gotcha below), remove the local worktree, remove leftover parent directories from nested branch names, pull the merge into the local base branch, and prune stale worktree references.

---

### Closing keywords in PR body don't auto-close issues on non-default branch PRs

**Priority:** High

**What happened:** The PR body contained "Closes #1" but targeted the `develop` branch, not the default `main` branch. After the PR was squash-merged, the issue remained open. This is documented in gobbi-git/conventions.md as the "Issue linking caveat" but the orchestrator failed to act on it during the FINISH phase.

**User feedback:** "The created issue was not closed after merge."

**Correct approach:** After merging a PR that targets a non-default branch, the orchestrator must explicitly close the linked issue using `gh issue close`. This must be part of the merge-and-cleanup checklist, not assumed to happen automatically. The conventions.md caveat exists — the orchestrator must read and act on it.

---

### Nested worktree directories from branch slashes leave orphaned parent directories

**Priority:** High

**What happened:** The worktree naming convention preserves branch slashes as directory separators (e.g., `chore/1-bump-version` → `.claude/worktrees/chore/1-bump-version/`). When the worktree was removed with `git worktree remove`, only the leaf directory (`1-bump-version/`) was deleted. The parent directory (`chore/`) remained as an empty directory. This leaves visible clutter that looks like an orphaned worktree.

**User feedback:** "There are remains like .claude/worktrees/chore."

**Correct approach:** After removing a worktree, clean up any empty parent directories left behind under `.claude/worktrees/`. The cleanup should walk upward from the removed worktree path, removing empty directories until reaching `.claude/worktrees/` itself. This must be part of the worktree removal step, not left as a manual cleanup.
