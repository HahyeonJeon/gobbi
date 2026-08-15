---
name: agent-teams
description: "Agent Teams is guidance for coordinating persistent Claude Code teammates through shared tasks and messages."
allowed-tools: Read, Grep, Bash, WebFetch
skill-type: tool
user-invocable: false
---

# Agent Teams

Agent Teams is a Tool Manual for Claude Code's experimental multi-session team interface. Use it when
independent specialists need shared tasks, direct messages, or coherent follow-up assignments.

## Principles

### Use teams for useful collaboration

Choose teammates when independent work benefits from direct communication or shared coordination. Use a
single session or ordinary subagents when the result alone is enough.

### Reuse relevant context

Prefer re-delegating coherent follow-up work to an available teammate who already understands the subject.
Context saves study time but never replaces a fresh assignment contract.

### Keep the lead accountable

The main session owns participant selection, assignments, write boundaries, synthesis, and acceptance.
Teammates own only their bounded work.

### Verify work outside runtime state

Task and idle states support scheduling. Direct result and verification evidence decide acceptance.

## Rules

- **MUST enable Agent Teams before starting Claude Code.** A mid-session setting change does not enable the
  current session.
- **MUST build every teammate assignment through Delegation.** Conversation history does not replace a complete
  prompt with current scope, resources, authority, result, verification, and Handoff.
- **MUST prefer a context-ready teammate for coherent follow-up work.** Revalidate the teammate's role,
  addressability, current evidence, and write boundary before re-delegating.
- **MUST separate parallel writers by exclusive files or worktrees.** Keep dependent writes in one ordered
  chain because Agent Teams does not isolate edits.
- **MUST reread the result and reproduce verification before acceptance or reuse.** A completed task or idle
  teammate is not proof.
- **NEVER edit Claude Code's generated team or task state or treat Partner as a persistent teammate.** Let the
  runtime manage team state, and launch every Partner run fresh.

## Manual

### Availability

#### Enable and inspect

- Agent Teams is experimental and disabled by default. Set
  `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in the environment or a Claude settings file before starting the
  session.
- Check `claude --version` and the
  [official Agent Teams documentation](https://code.claude.com/docs/en/agent-teams) before relying on current
  mechanics. The official interface described as of Claude Code 2.1.178 creates team state when the first
  teammate starts and cleans it automatically when the session exits.
- Native Codex has no Claude Agent Teams interface. Use its available subagent controls under Delegation
  instead.

### Selection

#### Choose teammates or subagents

- Use teammates for parallel research, competing hypotheses, cross-layer work, or other assignments that
  benefit from direct specialist communication.
- Use ordinary subagents for focused work that only needs a result returned to the caller. Use one session for
  tightly sequential or same-file work.
- Start with only the participants the work needs. Extra teammates add context, coordination, and token cost.

### Coordination

#### Spawn and assign teammates

- Ask the main Claude Code session to spawn named teammates in natural language. The main session becomes the
  lead; do not use removed `TeamCreate` or `TeamDelete` mechanics.
- Give each teammate a complete [Delegation](../../delegation/SKILL.md) prompt with its role, assignment,
  resources, boundaries, result, verification, and final Handoff. A teammate does not inherit the lead's
  conversation history.
- Use the shared task list and direct messages for scheduling and coordination. The lead remains responsible
  for dependencies, acceptance, and the next route.

#### Re-delegate a context-ready teammate

- Prefer an idle and addressable teammate when the next assignment is a coherent continuation of its role,
  subject, and allowed write boundary. This preserves useful study and project context.
- Send a new complete Delegation prompt. State what changed since the prior assignment, refresh exact
  resources and evidence, and give the follow-up a new stable assignment identifier.
- Spawn a fresh specialist when independence is required or the prior teammate's role, context, evidence,
  addressability, or write boundary no longer fits. Never reuse convenience as authority.

#### Protect concurrent work

- Give parallel writers non-overlapping files or separate worktrees. Do not rely on runtime task ownership to
  prevent file conflicts.
- Keep one write-capable assignment active across any shared file, branch, session record, TODO route, or
  external system. Independent read-only work may run in parallel.
- Route remaining-runtime work through [Partner](../partner/SKILL.md) when that runtime remains in the launch
  set. Spawn one Partner wrapper subagent per remaining runtime. The Partner process is still a fresh CLI
  with one exact session writing path, not a teammate to continue.

### Acceptance

#### Verify a teammate result

- Wait for the final Handoff, then reread every named file or commit and reproduce the stated checks. Compare
  the result with the current assignment rather than the teammate's earlier context.
- Treat task completion, idle state, and messages as scheduling evidence only. Reject missing, malformed,
  stale, or out-of-bound results.
- Keep independent evaluation outside the writer's acceptance. The active mode owns evaluator selection,
  findings, and routing.

#### Continue, recover, or replace

- Continue an existing teammate only while the runtime shows it addressable and its role, assignment history,
  accepted evidence, and write boundary remain valid.
- After a restart, resume, lost team process, or contradictory runtime state, rebuild the route from the active
  mode's verified records and spawn a replacement with a complete brief. Never infer completion from surviving
  task state.
- Do not edit generated team or task files to repair state. Preserve the exact failure evidence and let Claude
  Code manage runtime cleanup.

## References

| Name | Description |
|---|---|
| [Delegation](../../delegation/SKILL.md) | Defines each teammate prompt and final Handoff. |
| [Cowork](../../cowork/SKILL.md) | Owns Cowork participant, write, acceptance, and recovery policy. |
| [Workflow](../../workflow/SKILL.md) | Owns Workflow phases, participant policy, handoffs, and recovery. |
| [Partner](../partner/SKILL.md) | Defines fresh opposite-runtime invocations that cannot be continued as teammates. |
