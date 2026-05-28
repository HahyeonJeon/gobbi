---
name: sendmessage-continued-cwd-resets-to-main-tree
description: A SendMessage-continued executor's Bash shell cwd resets to the session default (main tree root) — a "cwd still X" prose statement does not substitute for an explicit cd; the continued agent edited and committed in the wrong tree.
type: mistakes
scope: project
feature: project-memory
status: active
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
tags: [process, worktree, sendmessage, cwd-reset, git]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# SendMessage-continued executor Bash cwd resets to main tree — "cwd still X" is not a cd

## What happened

Wave 1 iter2 remediation was delegated via `SendMessage` to continue the W1 executor. The continuation prompt said "cwd still `<worktree>/.gobbi/projects/gobbi`" rather than re-issuing an explicit `cd <worktree>` as the first action. The continued agent's shell cwd had reset to the session default (the MAIN TREE root), it did not re-cd, and it edited + committed `75dbaad` (the `feature: null` fix) onto the **main tree's `develop` branch** instead of the worktree branch `chore/session-2026-05-25-a10c82d6`. Detected by the manager's independent post-eval grep: the worktree file still showed `feature: project-memory` and the commit was absent from the worktree branch range, while local `develop` was 1 commit ahead of `origin/develop`.

## Why it happens

The manager assumed a `SendMessage`-continued subagent retains the shell cwd from its prior turn. It does not — each subagent turn's Bash cwd resets to the session start directory (the main tree), exactly as documented for the manager's own Bash calls (`codex/SKILL.md` § CWD inheritance). The "cwd still ..." phrasing is a statement, not an action; the agent never ran `cd`.

## How to detect

- Any remediation/continuation delegation (`SendMessage`) to an executor or evaluator that will run `git`/Edit in a worktree.
- Symptom after the fact: the producer reports a commit SHA + verify-pass, but the manager's independent check in the worktree shows the change absent and the commit on a different branch (often `develop` = main tree HEAD).

## Correct approach

1. EVERY delegation prompt — including `SendMessage` continuations — MUST make `cd <worktree-absolute-path>` the explicit FIRST ACTION, never "cwd is still X". Re-state the absolute worktree path each time.
2. Manager MUST run an independent post-WORK verification in the worktree (grep the actual file at the worktree-absolute path + confirm the commit is in `git log <worktree-branch>`), not trust the producer's reported SHA — this is what caught it.
3. Recovery when it happens: do NOT cherry-pick blindly (the main-tree file may be a stale pre-migration version causing conflicts); re-make the edit directly in the worktree and commit there; then clean the misplaced commit off the integration branch (safe if not yet pushed to origin).

## Related

- [[executor-main-tree-edit-near-miss]] — the near-miss this is the realized version of; same root cause (wrong tree), worse outcome (commit actually landed on develop).
- [[executor-mirror-path-vs-worktree-physical-copy]] — broader class: worktree-vs-main-tree path confusion.
- [[manager-skipped-dual-system-eval]] — the independent manager verify (post-WORK grep) that caught this is the same discipline mandated there.
- `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w1/staging/decisions/sendmessage-continued-executor-edits-main-tree.md` — originating staged candidate.
