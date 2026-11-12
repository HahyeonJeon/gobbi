---
name: ontology
description: "Ontology defines each unit of any work by six fields and keeps shared parts, names, and shapes in one place; it is not a data-model schema. Use it when creating, splitting, merging, renaming, reviewing, or cleansing units."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Ontology

Ontology sets how agents define a unit of work, such as a module, a component, or a document, and how they keep
what units share in one place. Principle 8 requires a definition before a unit's shape changes; this skill says
what that definition holds and how to test it.

## Principles

### A reader predicts a unit from its name and definition

A unit is clear when a reader who knows only its name and definition can say what it holds and what it leaves
to others. The six fields make that prediction possible.

### Reviews test properties, not paperwork

A review checks that each unit meets the field tests below. It does not demand a written unit definition for
every unit.

## Preferences

### Unit definition

#### Give each unit six fields

- A unit definition is the record of one unit. Each field passes its test:

  | Field | Test |
  |---|---|
  | **Definition** | The kind of thing it is and what sets it apart from its siblings, in one sentence with no "and". A reader can predict what it holds from its name and this sentence. |
  | **Responsibility** | What only it decides or does. |
  | **Boundary** | What it includes and hides, and what it leaves to other units. |
  | **Relations** | The units it connects to, each with a kind and a direction. |
  | **Dependencies** | What it needs, and what breaks if that fails, changes, or goes away. |
  | **Properties** | Its attributes or the data it owns, with values. |

#### Add domain fields in the domain's skill

- A domain adds its own fields in its own skill, such as code's secret and caller contract, or docs' reader,
  job, and kind. Ontology holds no domain table.
- Actions, with their steps, triggers, and results, are a Socratic Method extension and stay there.

### Commonality and variability

#### Merge by shared knowledge, vary only for a present difference

- Merge units that hold the same knowledge and change for the same reason, not units with identical text.
- Add a variation only for a difference that exists now. An abstraction with one user goes back inline.

### Standardization and normalization

#### One term, one shape, one home

- Use one term per concept: the project's term first, then the field's standard term.
- Give every unit of one kind the same shape.
- Keep each fact or value in one home; other places link to it.

## References

| Name | Description |
|---|---|
| [Principles](../principles/SKILL.md) | Principle 8 requires a definition before a unit's shape changes; Principle 6 keeps every copy in step. |
| [Socratic Method](../socratic-method/SKILL.md) | Owns Actions, the extension that records a unit's steps, triggers, and results. |
