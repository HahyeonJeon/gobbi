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

---

### gh pr merge fails when base branch is checked out in main worktree

**Priority:** Critical

**What happened:** During FINISH, `gh pr merge --squash --delete-branch` fails with `fatal: 'develop' is already used by worktree at '/path/to/repo'`. The gh CLI tries to update the local base branch after merging, but git refuses because the branch is checked out in the main working tree. This error has occurred repeatedly across multiple workflow sessions.

**User feedback:** "The merge error repeated many times."

**Correct approach:** Use the GitHub API directly instead of `gh pr merge`. Run `gh api repos/{owner}/{repo}/pulls/{number}/merge -f merge_method=squash` to merge on the remote without touching the local branch. Then handle cleanup separately: delete the remote branch with `gh api repos/{owner}/{repo}/git/refs/heads/{branch} -X DELETE`, close the issue with `gh issue close`, remove the worktree with `git worktree remove`, and pull the merge into the local base branch with `git pull --ff-only origin {base-branch}`. Never use `gh pr merge` when the base branch is checked out locally.

---

### git pull fails with "divergent branches" after squash merge

**Priority:** High

**What happened:** After squash-merging a PR via the GitHub API, `git pull origin develop` fails with `fatal: Need to specify how to reconcile divergent branches`. The local base branch and the remote have diverged because the squash merge created a new commit on the remote that doesn't share history with the local branch's view. Running `git pull` without a strategy flag triggers the divergent branches error repeatedly across sessions.

**User feedback:** "The git pull error repeated too."

**Correct approach:** Always use `git pull --ff-only origin {base-branch}` after a squash merge. The `--ff-only` flag ensures a clean fast-forward. If `--ff-only` fails (local has commits not on remote), the base branch was not properly synced before worktree creation — see the "Unpushed local commits" gotcha above. The FINISH cleanup sequence must always use `--ff-only` to catch sync issues early rather than silently creating merge commits.

---

### Recommending cleanup of worktrees that may belong to concurrent sessions

**Priority:** High

**What happened:** At session start, the orchestrator found an existing worktree (`20-session5-proposals`) and recommended "Clean up" as the default option. The worktree was actively in use by a concurrent session. Recommending cleanup as default risks destroying another session's in-progress work.

**User feedback:** "You should not recommend clean-up because there will be other concurrent sessions. Recommend Leave it."

**Correct approach:** When orphaned worktrees are found at session start, default to "Leave it" as the recommended option. The orchestrator cannot know whether a worktree is truly orphaned or belongs to a concurrent session. Only recommend cleanup if the user explicitly confirms the worktree is abandoned. "Inspect first" is an acceptable secondary option; "Clean up" should never be the default recommendation.

---

### Uncommitted gotchas in main tree lost during worktree PR merge

**Priority:** High

**What happened:** During a workflow, gotchas were written to the main tree (correct — `.claude/project/` is gitignored, so gotchas go to the main tree). These gotchas were added to tracked files (e.g., `gobbi-git.md`) but never committed. When the worktree's PR was squash-merged and the orchestrator pulled into the main tree with `git pull --ff-only`, the pull failed because the uncommitted gotcha changes conflicted with the incoming merge. The gotchas had to be manually saved, discarded, pulled, and re-applied.

**User feedback:** (Discovered during symlink reversal migration FINISH phase)

**Correct approach:** Before pulling a squash merge into the main tree, check for uncommitted changes in tracked files using `git status`. If gotchas or other changes exist in tracked files, save the content, discard with `git checkout --`, pull, then re-apply the changes. Alternatively, commit gotchas immediately after writing them to avoid this situation entirely. The safest approach: commit gotchas to the main tree before starting the merge-and-cleanup sequence.

---

### Stale remote branches accumulate across sessions

**Priority:** High

**What happened:** After multiple gobbi workflow sessions, the GitHub remote accumulated 11+ stale feature branches. Each session's FINISH phase deleted its own branch via the GitHub API, but branches from previous sessions that were merged via the GitHub web UI or through other workflows were never cleaned up. Over time the branch list became cluttered, making it hard to identify active work.

**User feedback:** "In the github there are so many branches remaining. I expected that the branches should be removed after work finished."

**Correct approach:** During the FINISH phase, after merging the current PR and deleting its branch, check for other stale merged branches on the remote. Offer to clean them up via AskUserQuestion — never delete automatically, since some branches may belong to concurrent sessions or be intentionally kept. At minimum, verify the current session's branch was actually deleted (the API call can silently fail). Add remote branch cleanup as a step in the merge-and-cleanup checklist.
