---
name: delegation
description: "MUST load when writing or reviewing a task prompt for a subagent. Delegation is a preference skill for clear, contextual, and verifiable task prompts."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Delegation

Delegation is a preference skill for writing detailed task prompts for subagents. It gives the receiver enough
context, direct instructions, required resources, and an exact result contract.

Apply its runtime-neutral base template across Claude and Codex and across leader, executor, evaluator, and
assistant roles. The owning operation may make the template more specific.

## Principles

### Give the subagent enough context

State the purpose, current state, scope, decisions, and terms that change the work. Treat unseen context as absent.

### Command the task directly

Use precise action verbs. State what to do, follow, read, produce, and verify.

### Keep the prompt concise

Use brief factual sentences and lists. Remove stories, commentary, and long descriptive paragraphs.

### Make the promised result authoritative

The named file, commit, or response is the result the caller accepts. A task status or printed summary never
replaces a promised file or commit.

## Rules

- **MUST follow the most specific active delegation contract.** Any contract that already governs this assignment may replace the base template’s headings, metadata, order, or return shape; use the generic template only where that contract is silent.

- **MUST name exactly one `result-kind: file | commit | response-only` in every specialist brief.** State its
  locator, response shape, and acceptance proof; use `commit` or `response-only` only when the owning operation
  intentionally makes that form authoritative.

- **MUST use `result-kind: file` for durable design and evaluation results.** Give the exact caller-named
  absolute path, require containment and rereading, and reject printed content as a substitute for the file.

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
result-kind: file
>

## Task
<Command the required outcome. State why it matters, the in-scope and out-of-scope boundaries, the expected deliverable, and the completion criteria.>

## Instructions
<List the rules, authority, constraints, independence requirements, and any method the outcome truly depends on. Use direct commands.>

## Resources
<List exact sources to read or inspect. State any required order, purpose, and precedence for conflicts.>

## Return
<Name the result-kind-specific locator and acceptance proof. For `file`, give the exact caller-named absolute
path and require the receiver to write it; for `commit`, give the branch, assignment-owned paths, commit
authority, and verification; for `response-only`, define the response shape and consumer. Then command the
response format, required evidence, changed paths or findings, verification results, progress updates,
questions, stop conditions, and blocker report.>
```

## References
