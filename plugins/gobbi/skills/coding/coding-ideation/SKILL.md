---
name: coding-ideation
description: "Coding Ideation is an operation for developing an evidence-backed code design from a problem and its requirements."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Coding Ideation

Coding Ideation develops one evidence-backed code design from a problem and its requirements. Use it when a
bounded topic has an unresolved material code-design choice. It writes one indexed result and stops before
realization.

## Principles

### Question through the caller until the idea is complete

An incomplete idea is a set of open topics, not permission to assume. Return evidence-backed questions until
every material gap is answered, deferred, or removed from scope.

### Study before discussion and design

Agents study the codebase, project docs, [design-pattern.md](../design-pattern.md), and [SOLID.md](../SOLID.md)
before they discuss or design. Official docs, references, knowledge, or trends are used when that evidence can change an in-scope choice.

### Agents design before the user confirms

Agents discuss and close the three design levels in Phase 2. Phase 3 shows that design for confirmation and
records it only after the user confirms.

### Design one dependent level at a time

In Phase 2, close conceptual definition before class and method design, and class and method design before
codebase structure. Classify each level as `inherited/current`, `not applicable`, or `material change`.

## Rules

- **MUST preserve caller and user authority.** The user decides each required in-scope success, direction,
  risk, destructive implication, external dependency, and load-bearing assumption.
- **MUST write one closed indexed result at the caller-supplied output root, located by `ideation-index.md`.**
  Authoritative parts define the work and the idea; Discussion records topics keyed to the Design headings,
  study, and decisions.
- **MUST finish agent study, discussion, and design before the user sees the design.** Record the result only
  after the user confirms it, and return feedback to the earliest affected level without recording that version.
- **MUST stop at the design boundary.** Implementation details, recipes, file-level edits, code, and other
  realized output are out of scope.
- **MUST resolve Phase 2 design in this exact order without merging, swapping, or extending levels:**
  conceptual-definition → class/method design from design-pattern → codebase structure.
- **NEVER change an accepted contract silently.** Reopen the earliest affected decision and obtain any
  required user choice.

## Procedure

### Phase 1 — Understand the Problem and Requirements

#### 1.1 Establish the contract

- Read the request, governing materials, problem, outcome, requirements, and caller-supplied design and
  decision scope, output root, and user-decision route.
- Stop and return missing, contradictory, or unclear input. Revise an existing target only with caller
  authority.

#### 1.2 Define the problem, outcome, and scope

- State the current situation, desired outcome, actors, unchanged behavior, and Included, Excluded, Deferred,
  or Rejected scope. Distinguish facts from hypotheses.
- Write Requirements in the authoritative part. When requested, also write the
  [requirements snapshot](templates/ideation/requirements/requirements-index.md).
- Return each unresolved in-scope choice through the caller's user-decision route.

### Phase 2 — Study, Discuss, and Design

#### 2.1 Study internal and external materials

- Study the codebase and project docs first. Read [design-pattern.md](../design-pattern.md) and
  [SOLID.md](../SOLID.md) before any class or method choice. Use official docs, references, knowledge, or
  trends when that evidence can change an in-scope choice.
- Keep the study for the Phase 3 record. Do not select a pattern in this step, and do not ask the user in
  this phase.

#### 2.2 Discuss and design in level order

- Agents discuss and close one level before the next: conceptual definition, class and method design from
  [design-pattern.md](../design-pattern.md), then codebase structure.
- In conceptual definition, state what will be implemented and define the vocabulary and terms. Do not name
  classes, methods, files, or directories.
- In class and method design, apply [SOLID.md](../SOLID.md) to the responsibilities, boundaries, and
  relationships. Record the selected patterns, classes, methods, responsibilities, boundaries, relationships,
  participant roles, operations, inputs, outputs, errors, and failure behavior. When no pattern applies,
  record why. Do not place files or directories.
- In codebase structure, record the project directories and files that hold the accepted classes and methods.
  Reopen class and method design when a file placement shows that level cannot stand.

### Phase 3 — Decision and Records

#### 3.1 Confirm the design or return feedback

- Show the finished design and stop. Use a tree for the three levels in order, a schema for the classes,
  methods, responsibilities, boundaries, and relationships, and a diagram for the directories and files.
- The user confirms that design or gives feedback. Feedback returns to the earliest affected level in Phase 2
  and is shown again. Do not record an unconfirmed design.

#### 3.2 Write the confirmed result

- Create `ideation-index.md`, the required Discussion view, and at least one authoritative part from the
  [ideation](templates/ideation/ideation-index.md) and
  [discussion](templates/ideation/discussion/discussion-index.md) templates.
- Record each study as one `S{N}` block under `## Study`. Write each topic through `### Discussion`,
  `#### Options`, and `### Decision`. Do not add a suggestions or critique section.
- Copy each confirmed Decision only into the Design heading named on that topic. Keep actor need and
  outcome in Requirements Result. List every file from the root index. Add no unlisted file.

#### 3.3 Review and freeze

- Read the result once in index order and fix in-scope defects at the earliest step.
- Freeze the listed membership and bytes. Independent review belongs to the caller.
- Return the `ideation-index.md` locator and a short outcome summary through the caller's handoff.

## References

| Name | Description |
|---|---|
| [Coding Ideation checklist](checklist.md) | Evaluation source for Coding Ideation work and indexed results. |
| [Coding Ideation index](templates/ideation/ideation-index.md) | Root template for the work definition, idea, and Discussion view. |
| [Coding Ideation part](templates/ideation/ideation-NN.md) | Template for the work definition and the idea. |
| [Discussion index](templates/ideation/discussion/discussion-index.md) | Template for topics keyed to Design headings, study, and decisions. |
| [Discussion part](templates/ideation/discussion/discussion-NN.md) | Repeatable discussion group and study template. |
| [Design patterns](../design-pattern.md) | Complete OOP pattern set read in Phase 2 before class and method design. |
| [SOLID](../SOLID.md) | Five SOLID principles read in Phase 2 while designing class and method responsibilities, boundaries, and relationships. |
| [Coding](../SKILL.md) | Routes unresolved material code-design work to this operation. |
