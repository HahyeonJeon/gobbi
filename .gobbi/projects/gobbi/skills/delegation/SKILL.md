---
name: delegation
description: "MUST load when writing or reviewing a task prompt for a subagent. Delegation is a preference skill for clear, contextual, and verifiable task prompts."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Delegation

Delegation is a preference skill for writing detailed task prompts for subagents. Use it to give the receiver enough context, command the task clearly, identify the instructions and resources it must follow, and define what it must return. Apply its runtime-neutral base template across Claude and Codex and across leader, executor, evaluator, and assistant roles.

## Principles

### Give the subagent enough context

State the purpose, current state, scope, decisions, and terms that change the work. Treat unseen context as absent.

### Command the task directly

Use precise action verbs. State what to do, follow, read, produce, and verify.

### Keep the prompt concise

Use brief factual sentences and lists. Remove stories, commentary, and long descriptive paragraphs.

## Rules

- **MUST follow the most specific active delegation contract.** A project, workflow, role, or runtime owner may replace the base template’s headings, metadata, order, or return shape. Use the generic template only where the specific contract is silent.

## Preferences

### Start from one base delegation prompt

Prefer starting from this template. Replace its guidance with task facts and commands. Remove guidance the task does not need. Customize Metadata freely. Add `###` subsections freely under any template section when the task needs more structure.

```markdown
## Metadata
<Add, replace, or omit free-form key: value entries. Example only:
agent: leader
assignment: delegation-ideation-01
step: ideation
stage: work
iteration: 1
>

## Task
<Command the required outcome. State why it matters, the in-scope and out-of-scope boundaries, the expected deliverable, and the completion criteria.>

## Instructions
<List the rules, authority, constraints, independence requirements, and any method the outcome truly depends on. Use direct commands.>

## Resources
<List exact sources to read or inspect. State any required order, purpose, and precedence for conflicts.>

## Return
<Command the response format, required evidence, changed paths or findings, verification results, progress updates, questions, stop conditions, and blocker report.>
```

## References
