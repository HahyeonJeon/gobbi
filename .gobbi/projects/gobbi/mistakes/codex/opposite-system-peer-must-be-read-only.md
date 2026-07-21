---
name: opposite-system-peer-must-be-read-only
description: A peer process mutated the worktree despite a prose warning; opposite-system WORK must be mechanically read-only.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-27
session: b5601d38-c988-4f53-b34b-9ace12a55c25
tags: [codex, execution]
keywords: [peer-cli, read-only, ephemeral, structured-output, one-writer]
author: claude
priority: high
domain: process
---

# The opposite-system peer must be mechanically read-only

## What happened

During a historical Execution loop, a Codex peer was told to describe a sync operation without running it. The process ran the command anyway and created a symlink. The specific change happened to be idempotent, but the incident proved that prompt wording alone does not protect the one-writer worktree.

## Why it happens

The process had workspace write capability. A behavioral instruction competed with its ability to run arbitrary commands, so the safety boundary depended on compliance instead of enforcement.

## Correct approach

Run every opposite-system draft, cross-review, and evaluation operation in a new ephemeral read-only process. Claude Code invokes Codex with `codex exec --ephemeral --sandbox read-only --output-schema ... -`; native Codex invokes Claude with `claude -p --permission-mode plan --no-session-persistence --safe-mode --tools "Read,Grep,Glob" --json-schema ...`. Give each operation complete inputs and require artifact-specific structured JSON.

The peer process never writes the session tree. An active-runtime assistant validates the response and stores rendered Markdown through `session-record.sh write-artifact`. Keep all worktree mutation in one ordered writer chain. Compare the worktree preimage and post-operation state; any peer-caused delta is a blocking contract failure, not something to hide with a cleanup checkout.

## How to detect

The peer command lacks an enforced read-only or ephemeral flag, is authorized to run a mutating tool, writes its own Markdown into the session tree, or changes the worktree between the frozen preimage and post-operation check. A prompt-only prohibition is not sufficient evidence.

## Related

- [[codex-wrapper-file-persistence-failure]] — adjacent Codex execution discipline mistake
- [[executor-wrote-to-main-tree-not-worktree]] — write-boundary violations in a different context
