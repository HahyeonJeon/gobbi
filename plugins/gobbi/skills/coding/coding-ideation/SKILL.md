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

### Study and discuss with other agents, then ask the user

Study project evidence first, then trustworthy external prior art when it can change a choice. Get separate
supported suggestions and critique from available agents, compare options, recommend one, and ask the user
before treating a design choice as decided.

### Discuss the design through a hierarchy of topics

Root topics in the problem and outcome, and use the Design headings as the parent topics in ladder order.
Resolve parents before children, and reopen the earliest affected decision when new evidence changes it.

### Design one dependent code-design level at a time

Close architecture before strategy, strategy before pattern, and pattern before public contract. Classify each
level as `inherited/current`, `not applicable`, or `material change`.

## Rules

- **MUST preserve caller and user authority.** The user decides each required in-scope success, direction,
  risk, destructive implication, external dependency, and load-bearing assumption.
- **MUST write one closed indexed result at the caller-supplied output root, located by `ideation-index.md`.**
  Authoritative parts define the work and the idea; Discussion records topics keyed to the Design headings,
  study, and decisions.
- **MUST finish agent discussion before synthesizing options, then resume only from the recorded user
  decision.** Do not force consensus or repeat without new evidence.
- **MUST stop at the design boundary.** Implementation details, recipes, file-level edits, code, and other
  realized output are out of scope.
- **MUST resolve this exact code-design ladder without merging, swapping, or extending levels:**
  architecture/structure → strategy/policy → pattern/class-diagram → public contract → whole-design check.
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

- State the current situation, desired outcome, actors, unchanged behavior, and Included, Excluded, Deferred,
  or Rejected scope. Distinguish facts from hypotheses.
- Write Requirements in the authoritative part. When requested, also write the
  [requirements snapshot](templates/ideation/requirements/requirements-index.md).
- Return each unresolved in-scope choice through the caller's user-decision route.

### Phase 2 — Study and Discuss

#### 2.1 Study applicable evidence

- Frame the question and what evidence would change the answer. Inspect the closest internal materials first;
  use external prior art only when it can improve an in-scope choice.
- Compare, challenge, and recommend. Write each study as an `S{N}` block under `## Study` in the Discussion
  view, not in an authoritative part.
- Record agent suggestion and critique in the owning group's `#### Suggestions and Critique`.

#### 2.2 Discuss options and build topics

- Get separate supported suggestions and critique from available agents before synthesizing options. Resolve
  or expose conflict.
- Write the topic tree and each `## Topic {path}` group through `### Discussion` from the
  [discussion templates](templates/ideation/discussion/discussion-index.md). Use the Design headings as
  parent topics in ladder order, set **Design:** to that heading, keep groups flat, and cite study IDs.
- Add a missing in-scope topic under its parent, or record an evidenced not-applicable decision.

#### 2.3 Ask the user and record decisions

- For each user-owned choice, return the question, options, recommendation, and what would change it, then
  stop dependent work.
- Resume only from the recorded user decision and write it in that group's `### Decision`.
- Reopen the earliest affected decision when new evidence changes it.

### Phase 3 — Design

#### 3.1 Walk the code-design ladder

- Resolve architecture/structure, strategy/policy, pattern/class-diagram, then public contract, in that
  order. Classify each level.
- Write Architecture and Structure, Strategy and Policy, Pattern and Class Diagram, and Public Contract in
  the authoritative part from the matching topic Decision. Keep actor need and outcome in Requirements
  Result.
- Assemble the accepted levels into one idea planning and execution can follow. Reopen the earliest defect;
  begin no realization.

#### 3.2 Write the indexed result

- Create `ideation-index.md`, the required Discussion view, and at least one authoritative part from the
  [ideation](templates/ideation/ideation-index.md) and
  [discussion](templates/ideation/discussion/discussion-index.md) templates.
- Keep discussion parts as complete topic groups and `S{N}` entries. Keep authoritative parts as work
  definition and idea.
- List every file from the root index. Add no unlisted file.

#### 3.3 Review and freeze

- Read the result once in index order and fix in-scope defects at the earliest step.
- Freeze the listed membership and bytes. Independent evaluation belongs to the caller.
- Return the `ideation-index.md` locator and a short outcome summary through the caller's handoff.

## References

| Name | Description |
|---|---|
| [Coding Ideation checklist](checklist.md) | Evaluation source for Coding Ideation work and indexed results. |
| [Coding Ideation index](templates/ideation/ideation-index.md) | Root template for the work definition, idea, and Discussion view. |
| [Coding Ideation part](templates/ideation/ideation-NN.md) | Template for the work definition and the idea. |
| [Discussion index](templates/ideation/discussion/discussion-index.md) | Template for topics keyed to Design headings, study, and decisions. |
| [Discussion part](templates/ideation/discussion/discussion-NN.md) | Repeatable discussion group and study template. |
| [Coding](../SKILL.md) | Routes unresolved material code-design work to this operation. |
