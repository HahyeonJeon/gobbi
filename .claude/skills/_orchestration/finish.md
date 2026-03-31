# FINISH Phase

How the workflow concludes with merge, commit, and compact options. Load this when the user selects FINISH to understand the decision tree, pre-action verification, and cleanup responsibilities.

---

## Core Principle

> **Before any irreversible operation, verify the expected precondition still holds.**

Conditions change between when you checked and when you act. Re-verify at the point of use.

_git establishes the re-verification principle: prerequisites are re-verified at point of use, not only at session start. FINISH extends this to all irreversible actions — committing, pushing, merging, and PR creation. The cost of re-checking is trivial; the cost of acting on a stale assumption is rework or data loss.

---

## Decision Tree

When the user selects FINISH, use AskUserQuestion to present the appropriate options:

**When _git is active (PR exists):**
- Merge PR and cleanup (squash merge, delete branch, close issue, remove worktree and empty parent dirs, pull merge into base branch), then compact
- Merge PR and cleanup only (no compact)
- Compact only (leave PR open for later)

**When _git is not active (default):**
- Commit and compact
- Commit only
- Compact only

---

## Action Definitions

**Merge** — squash merge the PR, delete the remote branch, explicitly close the linked issue (closing keywords don't auto-close on non-default branch PRs), remove the local worktree, clean up empty parent directories under `.claude/worktrees/`, pull the merge into the local base branch, and prune stale worktree references.

**Commit** — create a git commit with the changes from this workflow.

**Compact** — the agent cannot run `/compact` directly. Instead, tell the user to run the command themselves. The compact message should start with "abort gobbi" (so the compacted context drops gobbi workflow state) followed by a summary of the work done. After compact completes, the user must manually reload gobbi by running `/gobbi`.

> Please run: `/compact abort gobbi — completed {task-slug} workflow, findings in $CLAUDE_PROJECT_DIR/.claude/project/{project-name}/note/{note-dir}/`
> Then reload gobbi with: `/gobbi`

---

## Pre-Action Verification

The following conditions must hold before each irreversible action. These are constraints to verify, not steps to execute in order.

| Before... | Verify... |
|-----------|-----------|
| Committing | Correct branch is checked out |
| Pushing | No force-push without explicit user approval |
| Creating PR | No duplicate PR already exists for this branch |
| Merging | CI has passed, PR is still open |
| Resuming a session | Session ID matches the expected task context |

> **Verify, then act. Never assume a prior check still holds.**

A branch can be switched by a concurrent session. A PR can be closed by another contributor. CI can fail on a rebase. Each action's precondition must be true at the moment the action executes.

---

## Constraints

- MUST verify preconditions immediately before each irreversible action — not earlier in the workflow
- MUST use AskUserQuestion to present FINISH options — never assume which option the user wants
- MUST explicitly close linked issues when merging PRs to non-default branches — closing keywords do not trigger automatically
- MUST clean up empty parent directories after worktree removal — git only removes the leaf directory
- MUST pull the merge into the local base branch after squash merge — keep local and remote in sync
- Never force-push without explicit user approval
- Never run `/compact` directly — instruct the user to run it themselves
- When _git is active, "Merge PR and cleanup" must be a tracked task, not an afterthought
