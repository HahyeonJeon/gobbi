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

---

### Executor wrote files to main tree when worktree was intended
---
priority: high
tech-stack: git
---

**Priority:** High

**What happened:** v0.5.0 Phase 2 PR C Wave 2 executor was given absolute paths under `/playinganalytics/git/gobbi/packages/cli/...` in the briefing, together with an instruction to `cd` to the worktree at `.claude/worktrees/feat-v050-phase-2-prC/`. The worktree and main tree shared the repo path prefix, so Write/Edit tool calls using the main-tree absolute path succeeded silently — every edit landed on the main tree's `phase/v050-phase-2` branch, not on the worktree's feat branch. The bug only surfaced when `bun test` in the worktree passed with stale code, forcing a read-after-write comparison that revealed the diff.

**User feedback:** Discovered self-caught via test discrepancy during C.8 execution.

**Correct approach:** When `_git` is active with a worktree, Write/Edit tool `file_path` parameters must resolve to the worktree's `packages/...` path, not the main tree's. The safe pattern: resolve absolute paths as `$(pwd)/<relative>` using the session's actual `cwd`, or prefix with the full worktree path `/playinganalytics/git/gobbi/.claude/worktrees/<branch>/packages/...`. Briefings that quote main-tree-style absolute paths are a trap — translate them at session start. If edits land in the main tree, `git diff --binary > /tmp/foo.patch`, `git checkout -- <files>`, `rm <untracked>`, then `git apply /tmp/foo.patch` in the worktree.

---

### `git stash` sneaks back into executor workflows during flake-debugging — never, even for a moment
---
priority: medium
tech-stack: git
---

**Priority:** Medium

**What happened:** The v0.5.0 feature-pass-1 POLISH+TESTS executor was running `bun test` in the worktree and hit a single pre-existing flake in `capture-subagent.test.ts` (issue #92). To rule out whether the executor's own changes had caused the flake, the executor stashed its uncommitted work, re-ran the full suite (still flaked), and then popped the stash. No state leaked this time — the other worktree (`docs/109-v050-feature-docs`) had no pending changes, and the pop returned the work cleanly. But `git stash` is still stored in the shared `.git` directory across all worktrees; a peer worktree could have popped the stash first.

**User feedback:** Self-caught by the POLISH+TESTS executor 2026-04-21; flagged in the executor's report as a gotcha-worthy slip.

**Correct approach:** Never `git stash` inside a worktree, including under time pressure when debugging a flake. Alternatives for "is this flake mine?":

- `git diff` to a patch file (`git diff > /tmp/my-changes.patch`), then `git checkout -- <file>` the specific files you want to revert, run the test, then `git apply /tmp/my-changes.patch` to restore. No shared-state risk.
- `git commit --amend` or a WIP commit (`git commit -m "wip: testing flake"`) — then `git reset --soft HEAD~1` after verification. State lives on the branch, not in shared stash.
- Run the test in isolation (`bun test path/to/specific.test.ts`) — usually enough to confirm the flake is unrelated without touching the working tree.

This rule already exists in `_git/gotchas.md` ("Using git stash in a worktree leaks state to other worktrees"). The new wrinkle: the slip happens most often during flake-debugging under time pressure, not during normal feature work. Brief executors explicitly that `git stash` is banned during ANY worktree operation including diagnostic ones.

---

### Direct push to develop blocked when `git.workflow.mode=worktree-pr` is active
---
priority: medium
tech-stack: git, claude-hooks
---

**Priority:** Medium

**What happened:** During Wave A.2 setup, the orchestrator tried to commit a single-line `.gitignore` fix directly to develop (small infrastructure change required to enable the new `.gobbi/projects/<name>/worktrees/` path per `_git/conventions.md:107`). The Claude Code permission hook denied the action with: *"Direct commit and push to `develop` bypasses the worktree+PR workflow the user explicitly configured this session (git.workflow.mode=worktree-pr)."*

**User feedback:** Hook caught it correctly. The intent of the lock — "All work targets develop via PRs" — is correct; even infrastructure prep should land via a PR.

**Correct approach:** When `git.workflow.mode=worktree-pr` is set in session settings, EVERY change to `develop` flows through a PR. For small prerequisite infrastructure changes (gitignore additions, config tweaks), choose one:

1. **Bundle into the in-flight feature PR.** If the infra is the prerequisite for that feature's worktree convention, it logically belongs in the same PR. Wave A.2 did this — the gitignore fix shipped as Commit A of PR #151.
2. **Open a tiny dedicated PR.** Acceptable when the infra is unrelated to any in-flight feature.
3. **Never** override the hook with `--no-verify` or attempt to bypass — the lock is intentional.

This applies even to the orchestrator. Direct push privileges do not exist under worktree-pr mode.

**Refs:** Wave A.2 session `dbaf6f5f-403c-4645-b7c3-8962dc16c2d5` setup phase; PR #151 Commit A `7289f48` `chore(gitignore): ignore .gobbi/projects/*/worktrees/`.
