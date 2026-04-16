# Project Gotchas: Git Workflow

Project-specific gotchas for git workflow in the gobbi repository.

---

### Only `note/` is gitignored in `.claude/project/`, not the whole directory
---
priority: high
tech-stack: git
---

**Priority:** High

**What happened:** The orchestrator edited design docs at `.claude/project/gobbi/design/` in the main tree working copy while a worktree was active, assuming the whole `.claude/project/` directory was gitignored (as the _git skill's gotcha suggests). When it came time to commit, the changes were in the main tree, not the worktree. The orchestrator had to save a patch, revert the main tree, and apply the patch in the worktree.

**User feedback:** (Discovered during issue #75 execution while fixing design doc references to `workflow.step.enter`)

**Correct approach:** Only `.claude/project/*/note/` is gitignored in this project's `.gitignore`. Design docs, README, rules, and gotchas under `.claude/project/` are tracked files and belong in git history. When _git is active and you need to update tracked files under `.claude/project/`, edit them in the worktree and commit them on the feature branch. Notes and (for now) gotchas are safe to write in the main tree because they live under the gitignored `note/` subdirectory. If a future change gitignores the full `.claude/project/` directory, this advice changes.
