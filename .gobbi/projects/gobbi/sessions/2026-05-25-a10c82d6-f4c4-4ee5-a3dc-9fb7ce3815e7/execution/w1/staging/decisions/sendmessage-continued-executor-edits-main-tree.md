---
name: sendmessage-continued-executor-edits-main-tree
description: A SendMessage-continued executor's Bash shell cwd resets to the session default (main tree), NOT the worktree it used before. A remediation prompt that says "cwd still <worktree>" instead of re-issuing an explicit `cd <worktree>` first-action lets the continued agent edit + commit in the MAIN TREE, polluting the integration branch.
type: decisions
scope: project
feature: project-memory
created: 2026-05-26
session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
mistake-candidate: true
domain: process
---

# Mistake — SendMessage-continued executor edited + committed in the main tree

## What went wrong
Wave 1 iter2 remediation was delegated via `SendMessage` to continue the W1 executor. The continuation prompt said "cwd still `<worktree>/.gobbi/projects/gobbi`" rather than re-issuing an explicit `cd <worktree>` as the first action. The continued agent's shell cwd had reset to the session default (the MAIN TREE root), it did not re-cd, and it edited + committed `75dbaad` (the `feature: null` fix) onto the **main tree's `develop` branch** instead of the worktree branch `chore/session-2026-05-25-a10c82d6`. Detected by the manager's independent post-eval grep: the worktree file still showed `feature: project-memory` and the commit was absent from the worktree branch range, while local `develop` was 1 commit ahead of `origin/develop`.

## Why it went wrong (the mistaken assumption)
The manager assumed a `SendMessage`-continued subagent retains the shell cwd from its prior turn. It does not — each subagent turn's Bash cwd resets to the session start directory (the main tree), exactly as documented for the manager's own Bash calls (`codex/SKILL.md` § CWD inheritance). The "cwd still ..." phrasing is a statement, not an action; the agent never ran `cd`.

## How to recognize before repeating
- Any remediation/continuation delegation (SendMessage) to an executor/evaluator that will run `git`/Edit in a worktree.
- Symptom after the fact: the producer reports a commit SHA + verify-pass, but the manager's independent check in the worktree shows the change absent and the commit on a different branch (often `develop` = main tree HEAD).

## Corrected approach
1. EVERY delegation prompt — including SendMessage continuations — MUST make `cd <worktree-absolute-path>` the explicit FIRST ACTION, never "cwd is still X". Re-state the absolute worktree path each time.
2. Manager MUST run an independent post-WORK verification in the worktree (grep the actual file at the worktree-absolute path + confirm the commit is in `git log <worktree-branch>`), not trust the producer's reported SHA — this is what caught it.
3. Recovery when it happens: do NOT cherry-pick blindly (the main-tree file may be a stale pre-migration version → conflicts); re-make the edit directly in the worktree and commit there; then clean the misplaced commit off the integration branch (origin untouched if unpushed).

Related: [[executor-main-tree-edit-near-miss]] (the near-miss this is the realized version of), [[executor-mirror-path-vs-worktree-physical-copy]], [[manager-skipped-dual-system-eval]] (the independent manager verify that caught it is the same discipline).
