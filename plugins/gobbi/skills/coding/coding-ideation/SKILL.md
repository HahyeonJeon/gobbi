---
name: coding-ideation
description: "Coding Ideation develops an evidence-backed code design with the user. Use it when code work has an open design choice about its interfaces, structure, or behavior."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Coding Ideation

Coding Ideation develops one evidence-backed code design with the user from a problem and its requirements.
Use it when a bounded topic has an unresolved material code-design choice. It writes the result only after the
user confirms the design, and stops before implementation.

## Principles

### Return the questions the user owns

An incomplete idea is a set of open questions, not permission to assume the user's answers. Return each
question about goal, scope, risk, or a load-bearing assumption, and state smaller assumptions in the design.

### Study, then get independent input

One agent misses alternatives. Study the evidence first, then compare separate suggestions and critique from
independent subagents before you recommend a design.

### Keep the design simple

The best design meets the requirements with the fewest Ontology units, and no pattern is the default. The
[Coding Principles](../principles.md) judge which Ontology units earn their place.

### Design at the fidelity the decision needs

Conceptual Definition gives the vocabulary for Class and Function Design, and that design gives the Ontology units
that Codebase Structure places. Go only as deep as the user's decision needs, and reopen an earlier level when a
later finding breaks it.

## Rules

- **MUST leave each user-owned decision to the user.** The user decides required outcomes, direction, risk,
  destructive implications, external dependencies, and load-bearing assumptions.
- **MUST write the result to the output root only after the user confirms the design.** Until then, keep
  requirements, study, discussion, and design in the caller's draft location, because later stages treat the
  output root as accepted.
- **Locate the result by `ideation-index.md` at the caller's output root.** The caller and later stages find
  the result through that file, so every result file sits in that root and is listed from it.
- **NEVER change an accepted contract silently.** Later work relies on it, so reopen the earliest affected
  decision and get any required user choice.
- **Stop at the design boundary.** Private helpers, implementation steps, file-level edits, and code belong to
  Planning and Execution.

## Procedure

### Phase 1 — Understand the Problem

Know what the design must achieve. Done when the draft states the requirements and each user-owned gap has
gone to the user.

#### 1.1 Establish the contract

- Read the request, governing materials, design scope, output root, draft location, participant policy, and
  user-decision route. Stop and return missing or contradictory input, and revise an existing result only with
  caller authority.
- When the caller supplies the user's recorded answer to a draft, resume there: at Step 4.2 when the user
  confirmed the design, or at the earliest affected Step when the answer changes it.

#### 1.2 Write the requirements

- In a draft from the [part template](templates/ideation-NN.md), write the goal and why it matters, the
  problem, the outcomes, what is in and out of scope, and the open questions. Separate facts from hypotheses.
- Return each user-owned question through the caller's user-decision route.

### Phase 2 — Study and Discuss

Find the real options. Done when each material choice has two or three evidence-backed options with a
recommendation.

#### 2.1 Study the evidence

- Study the codebase and project docs. Load
  [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) or the
  [Coding Principles](../principles.md) when a choice turns on them, and open external sources only when they
  can change a choice.
- Record each study once in a draft from the [discussion part template](templates/discussion-NN.md), and
  return a missing requirement or user-owned choice through the user-decision route.

#### 2.2 Get independent suggestions and critique

- Get separate design suggestions and critique from independent subagents through the caller's participant
  policy, giving each the draft requirements and study. When you cannot launch subagents, send the prompts to
  the caller and continue from the answers.
- Compare the reasoning and record each material choice as a draft Discussion topic with two or three options
  and a recommendation. Do not ask the user yet; Step 4.1 shows the choices with the design.

### Phase 3 — Design

Write the design the user will judge. Done when the draft design answers every material choice at the
fidelity the decision needs.

#### 3.1 Write the design

- Write only the Design levels the change touches, and link an inherited decision instead of restating it.
  Name terms with [Naming](../principles.md#naming).
- Add a pattern, interface, or base class only for a present force, and record that force and the simpler
  form it replaces, as
  [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) asks.
- Remove each Ontology unit that fails the [Simplicity](../principles.md#simplicity) tests and each parameter or
  option with no current caller. Give each Ontology unit the design creates or changes its [Ontology unit
  definition](../../ontology/SKILL.md), as [Modularization](../principles.md#modularization) reads it for code.

### Phase 4 — Confirm and Record

Get the user's confirmation and record it. Done when the confirmed result is listed from `ideation-index.md`
and its locator is returned.

#### 4.1 Show the design and stop

- Show the design in a form the user can judge, such as a tree of the levels, a schema of the public Ontology
  units, or a diagram of the files, with each user-owned choice, its options, and your recommendation beside it.
- Return this and the draft location through the caller's user-decision route, then stop. The recorded answer
  resumes the work at Step 1.1.

#### 4.2 Write the confirmed result

- Write the confirmed result to the output root from the [ideation index](templates/ideation-index.md) and,
  when it needs more than one file, the part and [discussion index](templates/discussion-index.md) templates.
  List every file from `ideation-index.md`.
- Write each confirmed decision in the Design section its topic links to: the chosen option, why it won, its
  trade-offs, and what would reopen it. The Discussion topic keeps the options and the link, not a copy.

#### 4.3 Check and return

- Read the result once in index order and fix defects at the earliest affected Step. Independent review
  belongs to the caller, so do not change the result after returning it.
- Return the `ideation-index.md` locator and a short outcome summary through the caller's handoff.

## References

| Name | Description |
|---|---|
| [Coding Ideation index](templates/ideation-index.md) | Root template that locates the result and may hold all of it. |
| [Coding Ideation part](templates/ideation-NN.md) | Template for the requirements and the design. |
| [Discussion index](templates/discussion-index.md) | Template for the list of discussion parts. |
| [Discussion part](templates/discussion-NN.md) | Template for topics, options, and study. |
| [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md) | OOP defaults and entries, loaded when a design choice turns on classes, interfaces, or patterns. |
| [Coding Principles](../principles.md) | Simplicity, modularization, reusability, readability, naming, and intuitive public API, loaded when a choice turns on them. |
| [Ontology](../../ontology/SKILL.md) | The six fields of the Ontology unit definition each designed Ontology unit gets. |
| [Coding](../SKILL.md) | Routes unresolved material code-design work to this operation. |
