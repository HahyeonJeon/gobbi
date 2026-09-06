---
name: design-ideation
description: "Design Ideation is an operation for developing an evidence-backed visual design from a problem and its requirements."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Design Ideation

Design Ideation develops one evidence-backed visual design from a problem and its requirements. Use it when a
bounded topic has an unresolved material visual-design choice. It writes one indexed result, including listed
illustration images, and stops before realization.

## Principles

### Question through the caller until the idea is complete

An incomplete idea is a set of open topics, not permission to assume. Return evidence-backed questions until
every material gap is answered, deferred, or removed from scope.

### Study and discuss with other agents, then ask the user

Study project evidence and visual references first, then trustworthy external prior art when it can change a
choice. Get separate supported suggestions and critique from available agents, compare options, recommend one,
and ask the user before treating a design choice as decided.

### Discuss the design from images, not prose alone

Show structure options as greybox wireframe PNGs and direction options as styled example PNGs. The user decides
from those images; the written Design headings remain the authority.

### Decide structure before direction

Close layout and a component inventory from the structure pass, then concept, aesthetics, and visual language
from the direction pass. Write component variants only after the visual direction is accepted.

## Rules

- **MUST preserve caller and user authority.** The user decides each required in-scope success, direction,
  risk, destructive implication, external dependency, and load-bearing assumption.
- **MUST write one closed indexed result at the caller-supplied output root, located by `ideation-index.md`.**
  Authoritative parts define the work and the idea; Discussion records topics keyed to the Design headings,
  study, and decisions; every illustration image is listed once.
- **MUST finish agent discussion before synthesizing options, then resume only from the recorded user
  decision.** Do not force consensus or repeat without new evidence.
- **MUST stop at the design boundary.** Listed illustration PNGs are subordinate evidence, not production.
  Production files, shipped assets, exact token or measurement values, and realization recipes stay out.
- **MUST run two image passes without merging them: structure, then direction on the accepted structure.**
  Write the six Design headings in document order after those decisions.
- **NEVER change an accepted contract silently.** Reopen the earliest affected decision and obtain any
  required user choice.

## Procedure

### Phase 1 — Understand the Problem and Requirements

#### 1.1 Establish the contract

- Read the request, governing materials, problem, outcome, requirements, and caller-supplied design and
  decision scope, output root, user-decision route, and image route. Stop and return missing, contradictory,
  or unclear input; revise an existing target only with caller authority.
- Bind the image route as the runtime image tool or a local SVG or HTML-to-PNG converter. If neither works,
  stop and ask whether to pause or continue text-only; do not fall back silently.
- Require the participant-discussion contract only when agents will be asked for suggestions or critique.

#### 1.2 Define the problem, outcome, and scope

- State the current situation, desired outcome, viewers, unchanged behavior, and Included, Excluded, Deferred,
  or Rejected scope. Distinguish facts from hypotheses.
- Write Requirements in the authoritative part. When requested, also write the
  [requirements snapshot](templates/ideation/requirements/requirements-index.md).
- Return each unresolved in-scope choice through the caller's user-decision route.

### Phase 2 — Study and Discuss

#### 2.1 Study applicable evidence

- Frame the question and what evidence would change the answer. Inspect the closest internal surfaces and
  design system first; use external prior art only when it can improve an in-scope choice.
- Compare, challenge, and recommend. Write each study as an `S{N}` block under `## Study` in the Discussion
  view, cite reference images by link, and write Materials from that study.
- Record agent suggestion and critique in the owning group's `#### Suggestions and Critique`.

#### 2.2 Decide structure from wireframes

- Create two greybox wireframe PNGs at `images/structure-{a|b}.png`. Hold view, content, and canvas identical;
  vary only layout.
- Get separate supported suggestions and critique, show both images, and ask once. Write the topic tree in
  decision order from the [discussion templates](templates/ideation/discussion/discussion-index.md).
- Record the user decision in Layout and Hierarchy, and record the component inventory the wireframe reveals.

#### 2.3 Decide direction from styled examples

- Create two or three styled example PNGs at `images/direction-{a|b|c}.png` on the accepted structure. Vary
  only visual direction.
- Get separate supported suggestions and critique, show the images, and ask once.
- Record the user decision in Concept and Idea, Aesthetics, and Visual Language.

### Phase 3 — Design

#### 3.1 Write the Design headings

- Write Materials, Concept and Idea, Aesthetics, Layout and Hierarchy, Visual Language, and Components in
  that document order from the matching topic Decision. Keep viewer need and outcome in Requirements Result.
- Link the accepted structure image under Layout and Hierarchy and the accepted direction image under Concept
  and Idea. Write component variants from the inventory plus the accepted direction.
- Assemble the accepted levels into one idea planning and execution can follow without opening an image.
  Reopen the earliest defect; begin no realization.

#### 3.2 Write the indexed result

- Create `ideation-index.md`, the required Discussion view, at least one authoritative part, and the Images
  table from the [ideation](templates/ideation/ideation-index.md) and
  [discussion](templates/ideation/discussion/discussion-index.md) templates.
- Keep discussion parts as complete topic groups and `S{N}` entries. Keep authoritative parts as work
  definition and idea. List every PNG once.
- List every file from the root index. Add no unlisted file.

#### 3.3 Review and freeze

- Read the result once in index order and fix in-scope defects at the earliest step.
- Freeze the listed membership and bytes. Independent evaluation belongs to the caller.
- Return the `ideation-index.md` locator and a short outcome summary through the caller's handoff.

## References

| Name | Description |
|---|---|
| [Design Ideation checklist](checklist.md) | Evaluation source for Design Ideation work and indexed results. |
| [Design Ideation index](templates/ideation/ideation-index.md) | Root template for the work definition, idea, Discussion view, and listed images. |
| [Design Ideation part](templates/ideation/ideation-NN.md) | Template for the work definition and the idea. |
| [Discussion index](templates/ideation/discussion/discussion-index.md) | Template for topics keyed to Design headings, study, and decisions. |
| [Discussion part](templates/ideation/discussion/discussion-NN.md) | Repeatable discussion group and study template. |
| [Design](../SKILL.md) | Routes unresolved material visual-design work to this operation. |
