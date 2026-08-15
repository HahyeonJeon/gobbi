# Agent Teams

## Intent

Agent Teams is Gobbi's Tool Manual for Claude Code's experimental multi-session team interface. Native Codex
uses its available subagent controls under the same Delegation contract.

## Design

The canonical [Agent Teams skill](../../../skills/gobbi/agent-teams/SKILL.md) owns only runtime setup,
selection, coordination, context-aware re-delegation, write safety, result verification, and recovery limits.
Cowork and Workflow retain participant policy, assignments, acceptance, and session recovery.

The current design follows the official Claude interface described as of 2.1.178:

- enable `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` before starting Claude Code;
- ask the main session to spawn named teammates, which creates team state automatically;
- let Claude manage generated team and task files and automatic session-exit cleanup;
- give concurrent writers exclusive files or worktrees; and
- verify results directly because task and idle states are scheduling evidence.

The removed `TeamCreate` and `TeamDelete` mechanics are not part of the active design.

## Context reuse

The lead prefers re-delegating coherent follow-up work to an available teammate that already understands the
subject. Every follow-up still receives a new complete Delegation prompt with a stable assignment identifier,
current resources, changed context, authority, result, verification, and Handoff.

A fresh specialist is required when independent judgment matters or the previous teammate's role, evidence,
addressability, context, or write boundary no longer fits. Partner always remains a fresh external process and
is never reused as a teammate.

## References

- [Official Agent Teams documentation](https://code.claude.com/docs/en/agent-teams)
- [Delegation](../../../skills/delegation/SKILL.md)
- [Plugin skill locator](../architecture/plugin-skill-locator.md)
