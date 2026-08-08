---
name: agent-teams
description: "MUST load when setting up or using Agent Teams in Claude Code. Agent Teams is a tool skill for enabling, creating, coordinating, and cleaning up a team."
allowed-tools: Read, Grep, Bash
skill-type: tool
user-invocable: false
---

# Agent Teams

Agent Teams is an experimental Claude Code feature. One lead coordinates independent Claude Code sessions
through shared tasks and direct messages. Native Codex has no Agent Teams interface.

This manual explains the tool. It also owns the shared Agent Teams continuity guidance used by Workflow.
Cowork and Workflow still own assignments, authority, write boundaries, acceptance, and recovery evidence.

## Principles

### Use teams for useful parallelism

Use a team when independent work benefits from shared tasks or teammate discussion; use one session for
sequential or same-file work.

### Keep the lead in control

The session that creates the team remains its lead and owns coordination and cleanup.

### Verify work outside team status

Task and idle states help schedule work but do not prove that an artifact is correct.

## Rules

- **MUST enable Agent Teams before starting Claude Code.** A mid-session setting change does not enable it.
- **MUST give parallel writers separate files or worktrees.** Agent Teams does not isolate edits.
- **MUST let the lead create and clean up the team.** Teammates cannot create nested teams.
- **MUST shut down active teammates before cleanup.** Cleanup fails while a teammate is running.
- **NEVER edit Claude Code's generated team or task state.** Let Claude Code maintain it.

## Manual

### Enable Agent Teams

Agent Teams requires Claude Code 2.1.32 or later and is disabled by default:

```bash
claude --version
```

Set the flag before starting Claude Code, in the environment or a Claude settings file:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "in-process"
}
```

`teammateMode` is optional. `in-process` works in any terminal; `tmux` requires tmux or iTerm2. Gobbi projects
also allow each `Agent(<role>)` they use. Plugin roles are namespaced, such as `Agent(gobbi:leader)`; local
roles use names such as `Agent(leader)`.

Check the [official Agent Teams documentation](https://code.claude.com/docs/en/agent-teams) for current
version and display support.

### Choose Agent Teams

Use a team for parallel research, competing debugging hypotheses, independent reviews, or separate feature
areas that must exchange findings. Teams use more tokens than one session, so start only needed teammates.

### Create a team

Ask the main Claude Code session in natural language. Name the task, teammates, roles, and ownership:

```text
Create an agent team for this review. Name one teammate security and one performance.
Give both read-only assignments and have the lead synthesize their evidence.
```

The main session becomes the lead. Claude Code creates the task list and runtime state. A custom subagent
definition can supply a teammate's model and tools, but its `skills` and `mcpServers` fields do not apply;
include required loads and task context in the assignment.

### Coordinate work

The lead assigns tasks, or teammates claim unassigned tasks after dependencies finish. Teammates message the
lead and each other by name. Use Shift+Down to select in-process teammates and Ctrl+T to show tasks.

Give each writer exclusive paths and keep dependent work ordered. Verify the artifact and its checks before
acceptance because task status can lag.

### Shut down and recover

Ask the lead to shut down every teammate, then clean up the team. One lead can manage one team at a time.

`/resume` and `/rewind` do not restore in-process teammates. Spawn replacements from the active mode's
verified recovery evidence. Replace a teammate that remains unreachable or repeatedly returns malformed work.

## Workflow integration

This section owns the Agent Teams guidance that Workflow uses for TODO assignment, evidence-based recovery,
role reuse, and phase continuity. Workflow remains the authority for its state machine and acceptance rules.

### TODO-based assignment

The manager creates, retitles, reorders, and completes TODO items. Specialists report progress but cannot
self-assign, change progression, or accept their own work.

One mutable item represents one productive-step iteration. The manager moves it through DISCUSSION, WORK,
EVALUATION, and RECORD. A verified PASS completes the item; a revision creates a new iteration instead of
rewriting the completed one.

Task status is scheduling information. Workflow Step 1.3 alone validates a report and decides whether the TODO
may advance.

### Context-boundary recovery

After compact, clear, resume, rewind, lost TODO data, or another context boundary:

1. Read the latest completed Hand-off. If none exists, read and verify the Configuration receipt.
2. Inspect the native TODO list when it survives.
3. Verify the checkpoint against `configuration.md`, including mode, identity shape, original UTC date, slug
   or `not-applicable`, full UUID, and partner policy. Parse branch, worktree leaf, and session leaf with the
   separate new or permanent legacy validators, then verify RECORD receipts, `gate.md`, canonical outputs,
   checks, commits, branch, and worktree. Never rename or migrate a live legacy or active object.
4. Recreate only the proved item sequence and make the first unproved item the sole `in_progress` item.
5. Leave later items `pending`, then resume routing from the native list.

Use the accepted plan for Execution order. Stop at the earliest unsafe or contradictory evidence instead of
guessing a later route.

Claude Code does not restore in-process teammates after `/resume` or `/rewind`; spawn replacements. After
compaction, continue a teammate only when its identity, assignment, addressability, idle state, and write
boundary still match the reconstructed Workflow evidence.

### Reuse and write safety

Reuse a teammate only inside the role boundary in Workflow Step 1.3. Every continued assignment receives a
new identifier and a complete re-anchored brief.

Permit one write-capable assignment at a time across the session worktree, evidence tree, Git branch, TODO
route, and external systems. Parallel specialists must be independent and read-only.

For WORK, assign one active-runtime writer to create and self-review the local draft. A disabled partner
policy uses that local evidence only. Enabled calls Partner separately for each applicable external draft or
cross-review; the external runtime is not a persistent teammate. The manager assembles and accepts the round.
For EVALUATION, dispatch one fresh isolated active-runtime evaluator outside the persistent team and add one
fresh external Partner evaluator only when enabled. Neither evaluator receives the other report.

After each report, the manager rereads the promised artifact or commit, reproduces verification, and confirms
the specialist is idle and addressable before reuse. A missing, malformed, rejected, or unreachable result
gets a fresh replacement rather than inferred completion.

### Phase continuity

During Phase 2 and Phase 3, activate the next dependency-ready stage immediately after verification. A Hand-off
is a recovery checkpoint, not an idle wait. Stop only at Workflow's critical-blocker boundary.

## References

- [Workflow](../../workflow/SKILL.md)
- [Delegation](../../delegation/SKILL.md)
