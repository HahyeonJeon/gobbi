---
name: gobbi-git
description: Git/GitHub workflow with worktree isolation. Use when managing branches, worktrees, PRs, and the issue-to-merge lifecycle. Covers role boundaries between orchestrator and subagents for git operations.
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Git

Git and GitHub workflow for the gobbi agent system. Load this skill when a task involves branching, worktree setup, PR creation, or the full issue-to-merge lifecycle.

---

## Core Principles

> **Every task gets its own worktree.**

Worktrees are the mechanism that prevents concurrent session corruption. One worktree means one branch means one PR. This is the isolation invariant that makes parallel sessions safe. Without it, two sessions in the same working tree produce indistinguishable diffs — the orchestrator cannot tell which changes belong to which session, and legitimate work gets reverted as scope creep.

> **The orchestrator owns the git lifecycle. Subagents work within it.**

The orchestrator creates worktrees, names branches, pushes to remote, creates PRs, monitors CI, merges, and cleans up. Subagents work inside a worktree — they commit their verified work but never push, never create PRs, never touch issues. This boundary keeps integration controlled and predictable.

> **Every task starts from a GitHub issue.**

The issue is the contract between ideation and execution. The orchestrator either creates an issue from ideation output or picks up an existing issue the user provides. The issue number drives branch naming, PR references, and traceability. Without an issue, the work has no anchor.

> **Subagents commit. The orchestrator pushes.**

This separation is the key to controlled integration. Subagents make focused, well-verified commits in the worktree as they complete their work. The orchestrator pushes all commits and creates the PR only after all subtasks are complete and verified. Premature pushing from subagents would bypass the orchestrator's integration authority.

---

## Workflow Mental Model

The git lifecycle flows through stages with clear ownership at each point. The issue drives everything downstream — it determines the branch name, provides the PR description anchor, and connects the work to the project's tracking. The worktree provides physical isolation so the main working tree stays clean for other sessions. Subagents work sequentially within the worktree, each committing their verified changes. The orchestrator integrates by pushing and opening a PR only when all work is complete.

### Role Boundaries

The orchestrator and subagents have distinct, non-overlapping responsibilities in the git lifecycle. Crossing these boundaries breaks isolation or creates uncoordinated state.

| Responsibility | Orchestrator | Subagent |
|---|---|---|
| Issue | Creates or picks up | Never touches |
| Worktree | Creates before delegation, removes after merge | Works within (cd to path) |
| Branch | Names and creates | Commits to it |
| Push | Pushes to remote after all subtasks | Never pushes |
| PR | Creates, monitors CI | Never creates |
| Merge | Squash merges, deletes branch | Never merges |

The orchestrator passes the worktree's absolute path in every delegation prompt. The subagent's first action is to cd to that path. From that point, the subagent follows the standard Study, Plan, Execute, Verify lifecycle — with an additional Commit step after Verify succeeds.

---

## Integration with Orchestration

This skill activates at Step 3 (Execution) of the orchestration workflow, when the plan is approved and implementation begins.

**Before delegation** — The orchestrator creates the worktree and branch, ensuring the project's install command runs in the worktree so dependencies are ready. The worktree path becomes part of every delegation prompt.

**During delegation** — Subagents cd to the worktree as their first action, then follow Study, Plan, Execute, Verify, Commit. Each subagent commits its verified work before completing. The orchestrator coordinates sequencing between subtasks.

**After all subtasks** — The orchestrator pushes all commits to remote and creates the PR. CI runs against the pushed branch. The orchestrator monitors CI and coordinates any fixes.

**FINISH phase** — When gobbi-git is active, the FINISH phase changes: "merge PR and cleanup" replaces the default commit step. Merging, branch deletion, and worktree removal happen as part of the orchestrator's FINISH responsibilities.

**Notes and gotchas always write to the main tree** — The `.claude/project/` directory is gitignored. Subagent notes and gotchas must use the main tree's absolute path, not the worktree path, because worktrees are temporary and get removed after merge.

---

## Failure Modes and Recovery

**Worktree creation fails because the branch already exists** — The branch may be in use by another session or left over from a previous run. Report the conflict to the user and offer to reuse the existing worktree or rename the branch.

**gh CLI not authenticated** — The PR lifecycle depends on GitHub API access. Check authentication status at workflow start, before any git operations begin. If not authenticated, ask the user to authenticate before proceeding.

**Orphaned worktrees from a crashed session** — Sessions can crash or be abandoned, leaving worktrees on disk with no active session managing them. On session start, list existing worktrees to detect stale ones. Offer the user a choice: recover the work (inspect and resume) or clean up (remove the worktree and its branch).

**CI failure on the PR** — Fix the issue in the worktree, commit the fix, and push. CI re-runs automatically against the updated branch. The orchestrator monitors until CI passes or the user decides to defer.

**Cleanup failure when removing a worktree** — If normal removal fails (uncommitted changes, locked files), force removal is the fallback, followed by pruning to clean up stale references.

---

## Constraints

**Never use stash in worktrees** — Stash is stored at the repository level in the shared `.git` directory, not per worktree. A stash created in one worktree is visible and poppable from every other worktree. This means one agent's stash can be accidentally consumed by another agent. Always commit or discard changes instead.

**One worktree, one branch, one PR** — This is the isolation invariant. A worktree that checks out a different branch or serves multiple PRs breaks the isolation model and makes concurrent sessions unsafe.

**Branch exclusivity** — Git enforces that a branch can only be checked out in one worktree at a time. If branch creation fails during worktree setup, the branch may already be active in another worktree from a concurrent or crashed session.

**Dependencies must be reinstalled per worktree** — Each worktree has its own working directory. Package managers, virtual environments, and build caches are not shared between worktrees. The orchestrator must ensure the project's install command runs in the worktree before delegating to subagents.

**Requires GitHub and the gh CLI** — This skill assumes GitHub as the hosting platform and gh as the CLI tool for PR operations. Repos not hosted on GitHub should use a local-only workflow with direct commits and no PR lifecycle.

**Base branch is project-specific** — Never hardcode a default base branch. The base branch varies by project and by workflow. Ask the user at session setup which branch to base work on.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [conventions.md](conventions.md) | Branch naming, commit messages, PR template, issue format, worktree directory naming |
