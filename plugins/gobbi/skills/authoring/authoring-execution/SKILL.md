---
name: authoring-execution
description: "Authoring Execution writes and verifies one accepted writing task. Use it when a task with a settled writing design changes durable prose."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Authoring Execution

Authoring Execution writes, verifies, and hands off one accepted writing task under a settled writing design.
Use it when one accepted task has a settled writing design and a writer frontier that includes durable prose.

## Principles

### Deliver checked writing, not a draft

The result is text that reaches the task Goal for its named reader, with the evidence that every claim in it
is true now.

## Rules

- **Before adding text, find the document that owns the fact, and edit it there or link to it.** Agents add
  far more text than they remove, and each new copy drifts from its owner until a cleansing run removes it.
- **Run every command and open every path the text claims before the handoff.** A reader acts on these claims
  as written, and Authoring Review's [Claims are true now](../authoring-review/SKILL.md#claims-are-true-now)
  check fails any that does not hold.

## Procedure

### Phase 1 — Write the Change

Reach the task Goal in the documents that own its facts. Done when every scope item has its text, each fact
lives in its owner or links to it, and every file the change makes stale agrees with it.

#### 1.1 Bind the task

- Read the task's Goal, accepted design, scope, writer frontier, commit authority, and handoff, and load the
  standard for each document type the task changes, such as [Gobbi Skill](../../gobbi-skill/SKILL.md) for a
  skill.
- Stop and return to the caller when the design leaves a material writing choice open, or when the change
  reaches a file outside the writer frontier. Design belongs to Ideation and the user, and another owner holds
  that file.

### Phase 2 — Verify and Hand Off

Hand off the exact text that passed. Done when every claim in the final text was checked and the handoff is
returned.

#### 2.1 Verify the final text

- After the last edit, run each command and open each path, link, and anchor the changed text names, then run
  the project's checks for each changed document type, such as the skill checker for a skill.

#### 2.2 Return the handoff

- Commit only when the caller grants commit authority; otherwise leave the verified files uncommitted.
- Return the [Delegation Handoff](../../delegation/SKILL.md#handoff-content) with the changed paths, each check
  and its result, and any design concerns and out-of-scope findings.

## References

| Name | Description |
|---|---|
| [Authoring Review](../authoring-review/SKILL.md) | The bar the finished text is reviewed against, including its claims check. |
| [Gobbi Skill](../../gobbi-skill/SKILL.md) | The standard and checker for a skill the task changes. |
| [Delegation](../../delegation/SKILL.md) | Handoff Content that Step 2.2 returns. |
