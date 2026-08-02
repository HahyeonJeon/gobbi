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

This manual explains the tool. Cowork and Workflow own assignments, authority, write boundaries, acceptance,
and recovery evidence.

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

## References
