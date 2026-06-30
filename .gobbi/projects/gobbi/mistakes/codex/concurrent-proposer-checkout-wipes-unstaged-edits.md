---
name: concurrent-proposer-checkout-wipes-unstaged-edits
description: A concurrent process (Codex proposer cleanup) ran git checkout in the shared worktree and wiped the producer's unstaged edits mid-run
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 2026-06-29-0dc5cf75-54c5-4b52-82fa-b18750bdaade
tags: [process, git]
keywords: [dual-system, codex-proposer, shared-worktree, git-checkout, unstaged-edits, edit-evaporation]
author: claude
domain: codex
priority: high
---

# Concurrent proposer git-checkout wipes the producer's unstaged worktree edits

## What happened
During dual-system Execution (Claude producer + Codex proposer in parallel on the SAME
worktree), the executor's `Edit` changes to `scripts/sync-plugin-package.sh` reported success
and functioned across ~6 verification runs, then silently ROLLED BACK to the original committed
file between two Bash calls. `git status` showed the script unmodified again; a harness reminder
flagged it as "externally modified (intentional, by user or linter)". The manager identified the
root cause: the Codex proposer's CLEANUP ran `git checkout -- scripts/sync-plugin-package.sh` in
the shared worktree, discarding the producer's UNSTAGED edits. A partial build had already
materialized the `.claude/skills` mirror symlinks, so they survived as orphaned untracked files —
creating a FALSE-PASS trap where `readlink -e` checks and the OLD `--check` both passed even
though the script no longer owned the mirror.

## Why it happens (the mistaken assumption)
The assumption is that a worktree is private to one agent. In dual-system production the producer
and the Codex proposer share ONE worktree. A tree-level `git checkout -- <path>` / `git restore`
/ `git stash` run by EITHER side (or its cleanup) discards ALL unstaged working-tree changes to
that path — including the other side's in-flight edits. Unstaged edits live only in the working
tree, so they are unprotected; the wipe is silent to the victim (no error). This is DISTINCT from
the `edit-tool-silent-write-failure-on-worktree` trap: same symptom (edits evaporate), different
root cause (a concurrent git op, not an Edit-tool no-op). The orphaned build artifacts then make
the post-revert state LOOK correct to leaf-existence checks.

## How to recognize
- Dual-system production is ON (a Codex proposer runs in the same worktree as the Claude producer).
- A file you edited reverts to its committed/original form mid-session; `git status` shows your
  change gone; a harness reminder says the file was "externally modified".
- Leaf-existence checks (`readlink -e`, `test -e`) pass while the SCRIPT that should own them no
  longer contains the logic — the artifacts are orphans from a partial build.

## Correct approach
- COMMIT (or at least `git add`) edits EARLY to move them into the index/HEAD. Once committed, a
  stray `git checkout -- <path>` restores YOUR version, not the pre-edit one — the danger is
  neutralized. Unstaged edits are the only ones at risk.
- Prove SCRIPT-OWNERSHIP, never orphan-existence: clear the generated artifacts (`rm -rf` the
  mirror), THEN run the build and confirm the script RE-CREATES them from scratch, THEN `--check`.
  A leaf-existence check alone is a false-pass when orphans survive a revert.
- Verify the COMMITTED blob carries the logic (`git show HEAD:<path> | grep`), not just the working
  tree — and confirm working tree == HEAD blob.
- After any detected revert, re-apply via a robust Bash write (heredoc / `perl -i`), not `Edit`.
- System/process fix for the manager: the Codex proposer (and its cleanup) MUST confine writes to
  `proposals/codex/` and MUST NOT run a tree-level `git checkout`/`git restore`/`git stash` that
  touches producer-owned paths in the shared worktree.

## Related
- [[edit-tool-silent-write-failure-on-worktree]] — same symptom (worktree edits evaporate), different root (Edit-tool no-op vs concurrent git checkout)
- [[edit-write-tool-success-without-disk-persistence]] — sibling: tool "success" is not disk-persistence proof
