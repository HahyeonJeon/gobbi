---
name: peer-operation-must-not-mutate-shared-worktree
description: A peer cleanup changed the shared worktree and erased the active writer's edits; peers must be read-only.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 2026-06-29-0dc5cf75-54c5-4b52-82fa-b18750bdaade
tags: [process, git]
keywords: [dual-system-work, peer-cli, shared-worktree, one-writer, preimage]
author: claude
domain: codex
priority: high
---

# A peer operation must not mutate the shared worktree

## What happened
During a historical dual-system Execution task, a concurrent Codex peer cleanup ran a Git checkout in the same worktree. It discarded the active writer's unstaged script edits. Generated symlinks survived, so leaf-existence checks falsely suggested that the reverted script still owned the result.

## Why it happens
The design allowed two processes to affect one mutable worktree. A path-level checkout, restore, stash, formatter, or generated cleanup does not know which process owns an in-flight edit. Generated outputs can also outlive the source change and make an incomplete ownership check pass.

## Correct approach
Keep one ordered worktree writer. Run opposite-system operations as ephemeral read-only processes and let only an active-runtime assistant store their validated artifact responses through the Record owner. A peer must never run Git cleanup, edit source, write generated files, or persist Markdown directly.

Freeze a worktree preimage before peer operations and verify the actual tree afterward. Verification must prove the owning command can reproduce the output from the final source, not merely that an orphaned leaf exists. If the tree changes unexpectedly, pause and diagnose the source; do not normalize the delta with a broad checkout, restore, stash, or cleanup.

## How to detect
- A peer draft, cross-review, or evaluation command has write permission in the session worktree.
- The current diff loses an edit or gains an unexpected generated artifact between bounded writer steps.
- A leaf-existence check passes while the source owner no longer contains the mechanism that should reproduce the leaf.

## Related
- [[edit-tool-silent-write-failure-on-worktree]] — same symptom (worktree edits evaporate), different root (Edit-tool no-op vs concurrent git checkout)
- [[edit-write-tool-success-without-disk-persistence]] — sibling: tool "success" is not disk-persistence proof
