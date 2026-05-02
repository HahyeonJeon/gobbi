# Git Setup

Check git tooling and repository state at session start. Determines whether the git workflow (worktree + PR) is viable and what issues need attention before work begins.

---

## Core Principle

> **Verify the git environment before committing to a git workflow.**

A session that discovers missing tools or authentication mid-task wastes work already delegated to subagents. Detection upfront lets the orchestrator fall back to direct commit mode before any work starts.

> **Detection is read-only.** 

Never install tools, authenticate, or modify repository state during detection. Report state; let the user decide what to fix.

---

## Setup Sequence

Runs automatically at session start when the user selects "Git workflow (worktree + PR)." Skipped for "Direct commit" mode.

### 1. Git Repository

Check that the working directory is a git repository (`git rev-parse --is-inside-work-tree`). If not, git workflow is not applicable — direct commit mode only.

### 2. Remote Configuration

Check for a configured git remote (`git remote -v`). A repository without a remote cannot push or create PRs. Report which remotes exist and their URLs.

### 3. gh CLI Availability

Check if the `gh` CLI is installed (`which gh` or `gh --version`). The entire PR lifecycle depends on it — issue creation, PR management, CI monitoring.

### 4. gh Authentication

Check if `gh` is authenticated to the remote (`gh auth status`). An installed but unauthenticated gh CLI cannot perform API operations.

### 5. Base Branch

Check if the intended base branch exists locally and on the remote. The base branch is project-specific — never assume `main` or `master`. If the user specified a base branch at session start, verify it exists.

### 6. Worktree State

Check `.claude/worktrees/` for existing worktrees:
- **Active worktrees** — may indicate concurrent sessions. Report branch names and paths.
- **Orphaned worktrees** — from crashed or abandoned sessions. Offer cleanup or recovery.
- **Gitignore** — Check if `.claude/worktrees/` is listed in `.gitignore`. If not, worktree contents will appear in the main repo's git status.

### 7. Classify State

**Ready** — Repository exists, remote configured, gh installed and authenticated, base branch exists. Git workflow (worktree + PR) is viable.

**Degraded** — Repository and remote exist, but gh is missing or unauthenticated. Git workflow is not viable — fall back to direct commit mode. Report what's missing so the user can fix it if they want.

**Minimal** — Repository exists but no remote, or not a git repo at all. Only local operations are possible. Direct commit mode with local-only commits.

**Warnings** — Orphaned worktrees found, `.gitignore` missing worktrees entry, base branch doesn't exist on remote. These don't block the workflow but need attention.

---

## Constraints

- Detection must be lightweight — a few git and gh commands, not exhaustive repository analysis
- Never install gh, authenticate, or modify git configuration during detection
- Never create or remove worktrees during detection — that belongs to the execution phase
- Never push, pull, or modify branches during detection
- Report all findings to the orchestrator as internal context — only surface issues to the user when action is needed
