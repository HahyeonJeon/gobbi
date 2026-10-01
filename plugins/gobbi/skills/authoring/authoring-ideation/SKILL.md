---
name: authoring-ideation
description: "Authoring Ideation is an operation for developing an evidence-backed writing design from a problem and its requirements."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Authoring Ideation

Authoring Ideation develops one evidence-backed writing design from a problem and its requirements. Use it
when a bounded topic has an unresolved material writing-design choice. It writes one indexed result and stops
before realization.

## Principles

### Question through the caller until the idea is complete

An incomplete idea is a set of open topics, not permission to assume. Return evidence-backed questions until
every material gap is answered, deferred, or removed from scope.

### Study and discuss with other agents, then ask the user

Study project evidence first, then trustworthy external prior art when it can change a choice. Get separate
supported suggestions and critique from available agents, compare options, recommend one, and ask the user
before treating a design choice as decided.

### Discuss the design through a hierarchy of topics

Root topics in the problem and outcome, and use the Design headings as the parent topics in ladder order.
Resolve parents before children, and reopen the earliest affected decision when new evidence changes it.

### Design one dependent writing-design level at a time

Close reader and job before structure, structure before naming, and naming before voice. Start each level
with `Inherited — {pointer}`, `Not applicable — {reason}`, or `Material change`.

## Rules

- **MUST preserve caller and user authority.** The user decides each required in-scope success, direction,
  risk, destructive implication, external dependency, and load-bearing assumption.
- **MUST write one closed indexed result at the caller-supplied output root, located by `ideation-index.md`.**
  Write every result file directly in that root, list each one from `ideation-index.md` or
  `discussion-index.md`, and keep each decision in its Design heading rather than in Discussion.
- **MUST finish agent discussion before synthesizing options, then resume only from the recorded user
  decision.** Do not force consensus or repeat without new evidence.
- **MUST stop at the design boundary.** Drafted prose, file-level edits, publication recipes, and other
  realized output are out of scope.
- **MUST resolve this exact writing-design ladder without merging, swapping, or extending levels:**
  reader and job → structure and claims → naming and vocabulary → voice and evidence → whole-writing-design
  check.
- **NEVER change an accepted contract silently.** Reopen the earliest affected decision and obtain any
  required user choice.

## Procedure

### Phase 1 — Understand the Problem and Requirements

#### 1.1 Establish the contract

- Read the request, governing materials, problem, outcome, requirements, and caller-supplied design and
  decision scope, output root, and user-decision route.
- Stop and return missing, contradictory, or unclear input. Revise an existing target only with caller
  authority.
- Require the participant-discussion contract only when agents will be asked for suggestions or critique.

#### 1.2 Define the problem, outcome, and scope

- State the current situation, desired outcome, readers, unchanged behavior, and Included, Excluded, Deferred,
  or Rejected scope. Distinguish facts from hypotheses.
- Write Requirements only in the authoritative part, from the [part template](templates/ideation-NN.md).
- Return each unresolved in-scope choice through the caller's user-decision route.

### Phase 2 — Study and Discuss

#### 2.1 Study applicable evidence

- Frame the question and what evidence would change the answer. Inspect the closest internal writing first;
  use external prior art only when it can improve an in-scope choice.
- Compare, challenge, and recommend. Write each study as an `S{N}` block under `## Study` in the Discussion
  view, not in an authoritative part.
- Record where the independent suggestions and critique agreed or differed in that group's `### Discussion`.
  Do not copy study assessments or findings.

#### 2.2 Discuss options and build topics

- Get separate supported suggestions and critique from available agents before synthesizing options. Resolve
  or expose conflict.
- Write the topic tree and each `## Topic {path}` group through `#### Options` from the
  [discussion templates](templates/discussion-index.md). Use the Design headings as parent topics in ladder
  order, link **Decision** to that heading, keep groups flat, and cite study IDs.
- Add a missing in-scope topic under its parent, or mark that heading `Not applicable — {reason}` in Step 3.1.

#### 2.3 Ask the user and record decisions

- For each user-owned choice, return the question, options, recommendation, and what would change it, then
  stop dependent work.
- Resume only from the recorded user decision, which Step 3.1 writes in the linked Design heading. Do not
  copy that decision into Discussion.
- Reopen the earliest affected decision when new evidence changes it.

### Phase 3 — Design

#### 3.1 Walk the writing-design ladder

- Resolve the levels in order: reader and job, structure and claims, naming and vocabulary, then voice and
  evidence. Start each heading with `Inherited — {pointer}`, `Not applicable — {reason}`, or `Material change`,
  and write the design only under `Material change`.
- On every heading a topic links to, state the chosen option, why it won, the trade-offs, and the reopen
  condition. Documents and sections are artifacts under Structure and Claims, and defined terms are under
  Naming and Vocabulary.
- Give each domain concept one [kind](../../ontology/SKILL.md#kinds) and a session unit id, and use
  [Ontology](../../ontology/SKILL.md) for facets, vocabulary, and storage. Assemble the accepted levels into
  one idea planning and execution can follow, and reopen the earliest defect before realization.

#### 3.2 Write the indexed result

- Create `ideation-index.md`, the required Discussion view, and at least one authoritative part from the
  [ideation index](templates/ideation-index.md) and
  [discussion index](templates/discussion-index.md) templates.
- Keep discussion parts as complete topic groups and `S{N}` entries. Keep authoritative parts as work
  definition and idea.
- List every file from the root index. Add no unlisted file.

#### 3.3 Review and freeze

- Read the result once in index order and fix in-scope defects at the earliest step.
- Freeze the listed membership and bytes. Independent review belongs to the caller.
- Return the `ideation-index.md` locator and a short outcome summary through the caller's handoff.

## References

| Name | Description |
|---|---|
| [Authoring Ideation checklist](checklist.md) | Evaluation source for Authoring Ideation work and indexed results. |
| [Authoring Ideation index](templates/ideation-index.md) | Root template for the work definition, idea, and Discussion view. |
| [Authoring Ideation part](templates/ideation-NN.md) | Template for the requirements and the four writing-design headings. |
| [Discussion index](templates/discussion-index.md) | Template for the list of discussion parts. |
| [Discussion part](templates/discussion-NN.md) | Repeatable template for topics, options, and study. |
| [Ontology](../../ontology/SKILL.md) | Facets, kinds, vocabulary, and storage that Step 3.1 applies. |
| [Authoring](../SKILL.md) | Routes unresolved material writing-design work to this operation. |
