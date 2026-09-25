---
name: coding
description: "Coding is a domain skill that routes code work to specialized operation and preference children."
allowed-tools: Read
skill-type: domain
---

# Coding

Coding routes code design, planning, implementation, and independent review to focused operations, and
object-oriented design choices to a preference skill. Use it when at least one direct Coding child applies, and
load every direct child whose applicability sentence matches the current work.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`coding-execution`](coding-execution/SKILL.md) | operation | Use it when the task leaves no material code-design choice open and its writer frontier includes code, whether or not `coding-ideation` ran. |
| [`coding-ideation`](coding-ideation/SKILL.md) | operation | Use it when a bounded topic has an unresolved material code-design choice. |
| [`coding-object-oriented-programming`](coding-object-oriented-programming/SKILL.md) | preference | Use it when code design, implementation, or review creates, changes, or judges classes, objects, interfaces, and their responsibilities and relationships. |
| [`coding-planning`](coding-planning/SKILL.md) | operation | Use it when scope and direction are defined for code work but that work still needs decomposition, grouping, order, and dispatch. |
| [`coding-review`](coding-review/SKILL.md) | operation | Use it after one exact stable code subject is ready for independent review and before an acceptance or workflow decision. |
