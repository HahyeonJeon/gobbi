# Agent Teams in Workflow

This document owns Workflow's persistent-specialist policy: TODO assignment, evidence-based recovery, role
reuse, and phase continuity. The [Agent Teams manual](../gobbi/agent-teams/SKILL.md) explains how to enable and
use the Claude Code tool. Native Codex uses fresh repository custom-agent roles instead.

Build every specialist brief through [Delegation](../delegation/SKILL.md) with the workflow-specific fields in
[`SKILL.md` Step 1.3](SKILL.md#13-build-and-accept-specialist-assignments).

## TODO-based assignment

The manager creates, retitles, reorders, and completes TODO items. Specialists report progress but cannot
self-assign, change progression, or accept their own work.

One mutable item represents one productive-step iteration. The manager moves it through DISCUSSION, WORK,
EVALUATION, and RECORD. A verified PASS completes the item; a revision creates a new iteration instead of
rewriting the completed one.

Task status is scheduling information. Workflow Step 1.3 alone validates a report and decides whether the TODO
may advance.

## Context-boundary recovery

After compact, clear, resume, rewind, lost TODO data, or another context boundary:

1. Read the latest completed Hand-off. If none exists, read and verify the Configuration receipt.
2. Inspect the native TODO list when it survives.
3. Verify the checkpoint against RECORD receipts, `gate.md`, canonical outputs, checks, commits, branch, and
   worktree.
4. Recreate only the proved item sequence and make the first unproved item the sole `in_progress` item.
5. Leave later items `pending`, then resume routing from the native list.

Use the accepted plan for Execution order. Stop at the earliest unsafe or contradictory evidence instead of
guessing a later route.

Claude Code does not restore in-process teammates after `/resume` or `/rewind`; spawn replacements. After
compaction, continue a teammate only when its identity, assignment, addressability, idle state, and write
boundary still match the reconstructed Workflow evidence.

## Reuse and write safety

Reuse a teammate only inside the role boundary in Workflow Step 1.3. Every continued assignment receives a
new identifier and a complete re-anchored brief.

Permit one write-capable assignment at a time across the session worktree, evidence tree, Git branch, TODO
route, and external systems. Parallel specialists must be independent and read-only.

After each report, the manager rereads the promised artifact or commit, reproduces verification, and confirms
the specialist is idle and addressable before reuse. A missing, malformed, rejected, or unreachable result
gets a fresh replacement rather than inferred completion.

## Phase continuity

During Phase 2 and Phase 3, activate the next dependency-ready stage immediately after verification. A Hand-off
is a recovery checkpoint, not an idle wait. Stop only at Workflow's critical-blocker boundary.

## References

- [Agent Teams tool manual](../gobbi/agent-teams/SKILL.md)
- [Delegation](../delegation/SKILL.md)
- [Workflow](SKILL.md)
