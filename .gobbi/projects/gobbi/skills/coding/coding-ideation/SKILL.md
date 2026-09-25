---
name: coding-ideation
description: "Coding Ideation is an operation for developing an evidence-backed code design from a problem and its requirements."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Coding Ideation

Coding Ideation develops one evidence-backed code design from a problem and its requirements. Use it when a
bounded topic has an unresolved material code-design choice. It shows the design to the user, writes one
indexed result after the user confirms it, and stops before realization.

## Principles

### Question through the caller until the idea is complete

An incomplete idea is a set of open topics, not permission to assume. Return evidence-backed questions until
every material gap is answered, deferred, or removed from scope.

### Study, then discuss with independent subagents

One agent misses alternatives. Study the evidence first, then compare separate suggestions and critique from
independent subagents before you recommend a design.

### Keep the design simple and every unit defined

The best design meets the requirements with the fewest units, and no pattern is the default. Define each new
or changed directory, file, public class, and public function by the four terms of
[Modularization](../principles.md#modularization): Conceptual definition, Responsibility, Boundary, and
Relationship.

### Design one dependent level at a time

Conceptual Definition gives the vocabulary for Class and Function Design, and that design gives the units that
Codebase Structure places. Close each level before the next, and reopen the earliest level that a later finding
breaks.

## Rules

- **MUST preserve caller and user authority.** The user decides each required in-scope success, direction,
  risk, destructive implication, external dependency, and load-bearing assumption.
- **MUST write one closed indexed result at the caller-supplied output root, located by `ideation-index.md`.**
  Write every result file directly in that root, and list each one from `ideation-index.md` or
  `discussion-index.md`.
- **MUST keep unconfirmed requirements, study, discussion, and design in the caller-named draft location.**
  Write the result to the output root only after the user confirms the design shown in Step 4.1.
- **MUST stop at the design boundary.** Private helpers, implementation details, recipes, file-level edits,
  code, and other realized output are out of scope.
- **NEVER change an accepted contract silently.** Reopen the earliest affected decision and obtain any
  required user choice.

## Procedure

### Phase 1 — Understand the Problem and Requirements

#### 1.1 Establish the contract

- Read the request, governing materials, problem, outcome, and requirements. Read the caller-supplied design
  scope, output root, draft location, participant policy, and user-decision route.
- Stop and return missing, contradictory, or unclear input. Revise an existing result only with caller
  authority.
- When the caller supplies the user's recorded answer to a draft, read the draft and resume there. Go to
  Step 4.2 when the user confirmed the design, or to the earliest affected Step when the answer changes it.

#### 1.2 Define the problem, outcome, and scope

- State the current situation, desired outcome, actors, unchanged behavior, and Included, Excluded, Deferred,
  or Rejected scope. Distinguish facts from hypotheses.
- Write them under Requirements in a draft part made from the [part template](templates/ideation-NN.md).
- Return each unresolved in-scope choice through the caller's user-decision route.

### Phase 2 — Study and Discuss

#### 2.1 Study the evidence

- Study the codebase and project docs, then
  [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) and
  [Coding Principles](../principles.md). Open supporting docs, official docs, references, or trends only when
  that evidence can change an in-scope choice.
- Record each study once as an `S{N}` entry in a draft part made from the
  [discussion part template](templates/discussion-NN.md).
- When study finds a missing requirement or a user-owned choice, return the question through the caller's
  user-decision route. Resume from the recorded answer at the earliest affected Step.

#### 2.2 Discuss the design with independent subagents

- Through the caller's participant policy, get separate design suggestions and critique from independent
  subagents. Give each one the draft requirements, the study, and the two sources from Step 2.1.
- When you cannot launch subagents, send the prompts to the caller and continue from the answers it returns.
- Compare the reasoning and form two or three options, with a recommendation, for each material choice. Record
  each choice as a draft Discussion topic, and do not ask the user yet.

### Phase 3 — Design by Level

#### 3.1 Define the concept

- Label each level `Inherited`, `Not applicable`, or `Material change` under its Design heading in the draft.
  Design only the `Material change` levels.
- Under Conceptual Definition, state what will be implemented and define its vocabulary. Name no directory,
  file, class, or function.

#### 3.2 Design the public classes and functions

- Under Class and Function Design, give each new or changed public class and public function its four terms
  and the inputs, outputs, and errors its callers rely on. Use the Step 3.1 vocabulary, and place no file or
  directory.
- Add a pattern, interface, or base class only for a present force. Record that force and the simpler form it
  replaces, as [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) requires.
- Remove each unit that fails the [Simplicity](../principles.md#simplicity) tests, and each parameter or
  option with no current caller.

#### 3.3 Place the directories and files

- Under Codebase Structure, draw the new or changed directories and files with their one-way relationships,
  and give each one its four terms. Choose them with [Modularization](../principles.md#modularization) and
  [Naming](../principles.md#naming).
- Return to Step 3.2 when a placement shows that the class and function design cannot stand.

### Phase 4 — Confirm and Record

#### 4.1 Show the design and stop

- Show the draft design as a tree of the three levels, a schema of the public classes and functions with their
  four terms, and a diagram of the directories, files, and relationships. Beside it, list each user-owned
  choice with its options and recommendation.
- Return this decision package and the draft location through the caller's user-decision route, then stop.
  The user confirms the design or gives feedback, and the recorded answer resumes the work at Step 1.1.

#### 4.2 Write the confirmed result

- Write the confirmed draft parts to the output root, then create `ideation-index.md` and
  `discussion-index.md` from the [ideation index](templates/ideation-index.md) and
  [discussion index](templates/discussion-index.md) templates. List every file, and add no unlisted file.
- Write each confirmed decision in the Design heading its topic links to: the chosen option, why it won, its
  trade-offs, and the reopen condition. The Discussion topic keeps its options and that link, not a copy.

#### 4.3 Review and freeze

- Read the result once in index order and fix in-scope defects at the earliest affected Step.
- Freeze the listed membership and bytes. Independent review belongs to the caller.
- Return the `ideation-index.md` locator and a short outcome summary through the caller's handoff.

## References

| Name | Description |
|---|---|
| [Coding Ideation checklist](checklist.md) | Evaluation source for Coding Ideation work and indexed results. |
| [Coding Ideation index](templates/ideation-index.md) | Root template for the work definition, idea, and Discussion view. |
| [Coding Ideation part](templates/ideation-NN.md) | Template for the requirements and the three-level design. |
| [Discussion index](templates/discussion-index.md) | Template for the list of discussion parts. |
| [Discussion part](templates/discussion-NN.md) | Repeatable template for topics, options, and study. |
| [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) | OOP defaults and entry index, studied in Step 2.1. Open its supporting docs only when a choice needs them. |
| [Coding Principles](../principles.md) | Simplicity, modularization, reusability, readability, naming, and intuitive public API, studied in Step 2.1 and applied in Steps 3.2 and 3.3. |
| [Coding](../SKILL.md) | Routes unresolved material code-design work to this operation. |
