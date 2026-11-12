---
name: design-ideation
description: "Design Ideation develops an evidence-backed visual design with the user, shown through images. Use it when visual work has an open design choice, such as its layout, direction, or visual language."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Design Ideation

Design Ideation develops one evidence-backed visual design from a problem and its requirements. Use it when a
bounded topic has an unresolved material visual-design choice. It writes one result located by
`ideation-index.md`, with the illustration images it links, and stops before production.

## Principles

### Cover the design choices the visual work needs

Materials, structure, direction, visual language, and components each matter wherever they change the work.
Take them in the order the work needs, and decide a choice only after the choices it depends on, such as
component variants after the visual direction.

### Let the user decide from images

The user compares structure and direction options as images, not prose alone. The written Design governs, so a
property visible only in an image is not a commitment.

### Keep each decision in one place

Each decision lives under its Design heading with the chosen option, why it won, its trade-offs, and what would
reopen it. Discussion links to that heading instead of copying the decision, so the two cannot disagree.

## Rules

- **MUST let the user decide each material choice.** The user owns success, direction, risk, destructive
  effects, external dependencies, and load-bearing assumptions, so the agent recommends and returns the choice.
- **Get independent suggestions or critique before recommending a consequential choice.** One agent misses
  alternatives, and Principle 3 asks for this on choices that are hard to reverse or that the user owns.
- **Ask the user before continuing text-only when no image route works.** The user decides from images, so
  dropping them changes how the user decides.
- **Write the result at the caller's output root, located by `ideation-index.md`, with images in `images/`.**
  Cowork and Workflow pass that root and read the result from that file.
- **Stop at the design boundary.** Production files, shipped assets, exact token or measurement values, and
  realization recipes belong to Execution, which works from the accepted design.
- **NEVER change an accepted decision silently.** Planning and Execution build on it, so reopen the earliest
  affected decision and get the user's choice.

## Procedure

### Phase 1 — Understand the Problem

Done when the requirements state the goal and why it matters, the problem, the outcomes viewers should get, what
is in and out of scope, and the open questions, and an image route works.

#### 1.1 Read the inputs and write the requirements

- Read the request, the participant discussion, the governing materials, and the output root. Return missing or
  contradictory input to the caller, and revise an existing result only with the caller's authority.
- Write the requirements from the [part template](templates/ideation-NN.md), separating facts from hypotheses.
- Confirm an image route: the runtime image tool, or a local SVG or HTML-to-PNG converter.

### Phase 2 — Study and Decide from Images

Done when every material choice has a user decision, a deferral, or a scope exclusion, backed by recorded study
and, for structure and direction, by the images the user compared.

#### 2.1 Study the evidence

- Study the closest internal surfaces and design system first, and external prior art only when it can change
  an in-scope choice. Cite reference images by link, and copy one into the result only when the project may
  keep it.
- Record each study once from the [discussion part template](templates/discussion-NN.md), and cite its ID from
  the topics it informs.

#### 2.2 Ask the user and record the decision

- Show each structure or direction option as an image in `images/`. When layout and style are both open, show
  layout options apart from style options so each choice is judged on its own.
- For each user-owned choice, return the question, the images, the options recommended first with Pros and
  Cons, and what would change the recommendation, then stop work that depends on it. The option order is the
  user's standing preference.
- Record each decision under its Design heading, and reopen the earliest affected decision when new evidence
  changes it.

### Phase 3 — Write the Result

Done when a cold reader can plan and execute from the result without opening an image, and the caller has its
locator.

#### 3.1 Write and return the result

- Write the Design headings that apply and omit the rest, linking each accepted image where it illustrates a
  decision, and link a decision inherited from earlier work instead of restating it. Give each screen, region, or
  component the design creates or changes its [Ontology unit definition](../../ontology/SKILL.md).
- Write `ideation-index.md` from the [index template](templates/ideation-index.md), listing the images the
  result keeps. Keep the whole result in it unless its size demands parts, and then list every part from it.
- Read the result once as a cold reader, fix what fails, and return the `ideation-index.md` locator and a short
  summary.

## References

| Name | Description |
|---|---|
| [Design Ideation index](templates/ideation-index.md) | Locator template that holds the whole result or lists its parts, plus its images. |
| [Design Ideation part](templates/ideation-NN.md) | Template for the requirements and the six Design headings. |
| [Discussion index](templates/discussion-index.md) | Template for listing discussion parts when the Discussion is split. |
| [Discussion part](templates/discussion-NN.md) | Template for topics, option images, and study. |
| [Ontology](../../ontology/SKILL.md) | The six fields of the Ontology unit definition each designed Ontology unit gets. |
| [Design](../SKILL.md) | Routes unresolved material visual-design work to this operation. |
