---
name: delegation
description: "Delegation is guidance for writing concise subagent prompts that define context, authority, verification, and handoff expectations."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Delegation

Delegation standardizes the prompt a manager gives a subagent and the handoff the subagent returns. Use it when
assigning bounded work across runtimes or roles so the subagent can act without private context and the manager
can verify the result.

## Principles

### Give the subagent enough context

State the purpose, current state, scope, decisions, and terms that change the work. Treat context absent from the
prompt or its named materials as unknown to the subagent.

### Command the task directly

Use precise action verbs. State what to do, follow, read, produce, verify, and return.

### Keep the prompt concise

Use brief factual sentences and lists. Remove stories, commentary, and long descriptive paragraphs.

### Make the handoff complete and verifiable

The final handoff connects the subagent's completed work to the manager's acceptance decision. It states what
happened, identifies every result, cites verification, and names concerns or the next action without private
context.

## Rules

- **MUST follow the active contracts in their stated authority order.** Apply the caller-approved task and scope,
  then the owning mode or operation and the role-specific additions; use this base where those owners are silent.
- **MUST give the subagent one bounded assignment with one authoritative result.** Name the outcome, purpose,
  scope, authority, starting state, result, acceptance evidence, verification, stop conditions, and prohibited work.
- **MUST name required skills-to-load in `## Materials` and keep `## Materials` required.** Put working state
  and accepted decisions in `## Context`, and put exact skill paths with read order, remaining sources, purpose,
  and conflict precedence in `## Materials`; do not rely on conversation history or inherited skill loads.
- **MUST include a `## Return` section in every delegation prompt.** The delegating agent defines the return
  contract there, and the subagent writes the final Handoff for every terminal status.
- **MUST make the final handoff verifiable.** Require its status, summary, exact durable locator or response
  subject, conclusion and consumer, changed paths or findings, verification, concerns, open work, and next action.
- **NEVER accept a runtime task status or activity summary as the final handoff.** The manager rereads named
  results and reproduces required verification before acceptance.

## Preferences

### Prompt Construction

#### Start from one base prompt

- Start from this template and replace every placeholder with task facts and direct commands:

  ```markdown
  ## Metadata
  **Required**

  - agent: <specialist role>
  - assignment: <stable assignment identifier>

  **Optional**

  - step: <owning operation step>
  - stage: <work stage>
  - iteration: <current iteration>

  ## Context
  <State working state and accepted decisions.>

  ## Task
  <Command one outcome. State its purpose, scope, exclusions, required result, and completion evidence.>

  ## Instructions
  <State rules, authority, constraints, independence, method, verification, stops, and prohibited work.>

  ## Materials
  <List required skills-to-load with exact paths and read order, remaining sources, purpose, and conflict precedence.>

  ## Return
  <Require the subagent to write a final Handoff for every terminal status. Name the owning status format,
  summary, exact durable locator or response subject, conclusion and consumer, changed paths or findings,
  verification commands and results, concerns, remaining work, blocker or missing context, safe retained state,
  and next action when each applies.>
  ```

- Add `###` subsections only when one template section contains distinct task-specific subjects. Keep `agent`
  and `assignment`; omit an optional Metadata field unless the assignment uses it or an owning contract requires
  it.
- Remove instructions already owned by an exact named material unless the subagent needs the brief to resolve
  precedence, authority, or a task-specific exception.

### Handoff Content

#### Require the subagent to return one compact final handoff

- Require the subagent to begin with the exact status owned by its role or operation, then state the result and
  concise summary before supporting detail.
- Require the subagent to identify each file by exact path, each commit by exact revision, and each response
  result by its subject, conclusion, and consumer. When the assignment has a durable result, its Handoff
  references that result instead of reproducing or replacing it; otherwise the response is the result.
- Require the subagent to report fresh verification, concerns, remaining work, and the next owner or action. For
  missing context or a blocker, it names the cause, evidence, safe retained state, and resumption condition.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../gobbi-skill/SKILL.md) | Shared guidance for compact skill structure, language, rules, and references. |
