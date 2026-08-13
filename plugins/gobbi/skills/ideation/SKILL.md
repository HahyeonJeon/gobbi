---
name: ideation
description: "Ideation is the operation for developing an evidence-backed design from a problem and its requirements."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Ideation

Ideation develops one evidence-backed design from a problem and its requirements. Use it before Planning when the problem, scope, or design choices need study and user discussion. It records the design as one indexed result and stops before implementation planning or realization.

## Principles

### Question through the caller without hesitation until the idea is complete

An incomplete idea is a set of open topics, not permission to assume. Return relevant, evidence-backed, and
respectful questions through the caller until every material gap or contradiction is answered, explicitly
deferred, or removed from scope.

### Study trustworthy prior art before designing

Study established project patterns, and study trustworthy external prior art when it can materially improve
a choice; assess every reference by authority, relevance, currency, and applicability. Use the strongest fit
as the baseline, and combine lessons or deviate only when current constraints justify it.

### Discuss the design through a hierarchy of topics

Root the topic hierarchy in the problem and desired outcome, and derive it from project evidence and any
applicable prior art. Resolve parents before children, reconcile sibling branches, and reopen the earliest
affected decision when new evidence changes it.

### Find the best idea by comparing reference-backed alternatives

The leading idea is a candidate to compare with genuinely different, reference-backed alternatives by their
pros, cons, and fit with the outcome and constraints. Use the comparison to improve or replace it, then
explain why the selected direction wins and what evidence would change it.

## Rules

- **MUST preserve caller and user authority.** The user decides material scope, success, direction, risk,
  destructive implications, external dependencies, and load-bearing assumptions; the caller owns interaction,
  orchestration, and independent evaluation.
- **MUST write one closed indexed result at the caller-supplied absolute output root and use its
  `ideation-index.md` as the exact result locator.** List every authoritative part and optional snapshot in the
  root index, list every snapshot part in its own index, and keep every output inside that closed membership.
- **MUST return material questions through the caller.** State the question, context, options, recommendation,
  trade-offs, and evidence that could change it, then resume only from the supplied decision.
- **MUST self-review and freeze the complete indexed result.** Read every listed file as one result and
  preserve its exact ordered membership and bytes; independent evaluation belongs to the caller and is never
  performed or claimed by Ideation.
- **MUST stop at the design boundary.** Define the intended behavior and design without ordered implementation
  tasks, implementation diffs, prototypes, code, experiments, benchmarks, or other realized output.
- **NEVER change an accepted contract silently.** Reopen the earliest affected decision, obtain any required
  user choice through the caller, and propagate the consequence through every affected part.

## Procedure

### Phase 1 — Understand the Problem and Requirements

#### 1.1 Establish the operation contract

- Read the request, caller authority, project state, governing materials, prior attempts, active scope,
  conflicts, and intended consumer. Identify the outcome, actors, evidence needs, exclusions, and first material
  unknown.
- Require the absolute output root, its exact `ideation-index.md` locator, and the allowed write boundary.
  Resolve the paths and confirm that every allowed output remains inside the boundary.
- Inspect an existing target before writing. Revise it only with caller authority; otherwise report the exact
  conflict, missing context, or missing authority and stop without overwriting or migrating it.

#### 1.2 Define the problem, outcome, and scope

- Trace the current behavior, evidence, impact, prior attempts, current approach, and strongest credible
  no-change result. Distinguish inspected facts, reports, hypotheses, and uncertainty.
- Define the desired outcome, actors, observable behavior, inputs, outputs, integration boundary, unchanged
  behavior, solution-neutral requirements, success and failure signals, and Included, Excluded, Deferred, or
  Rejected scope.
- Return each material uncertainty through the caller until What and Why are complete. When requested, render
  the supporting requirements snapshot from the
  [requirements templates](templates/ideation/requirements/requirements-index.md); the final Ideation result
  remains authoritative over later corrections.

### Phase 2 — Study the Evidence and Topics

#### 2.1 Study applicable evidence

- Study relevant project documents, code, configuration, history, decisions, patterns, counterexamples, and
  failed attempts. Record the sources, assessments, adopted lessons, rejections, conflicts, and gaps.
- Study external prior art only when internal evidence is insufficient or comparison can materially improve a
  choice. Prefer current primary sources and record any reuse restriction.
- Return an unsupported premise to the caller with the exact missing context, study, authority, or scope change
  needed to continue.

#### 2.2 Build the decision hierarchy

- Derive the hierarchy from the requirements and study. Root it in the problem and outcome, order parents
  before children, and expose dependencies, conflicts, and reopen conditions.
- For each material topic, state its question, connected requirements, evidence, genuine alternatives,
  trade-offs, recommendation, done condition, and evidence that could change it.
- When requested, render the supporting topic snapshot from the
  [topic templates](templates/ideation/topics/topics-index.md). Treat it as a study and discussion snapshot,
  not as the authoritative design.

#### 2.3 Review topic coverage

- Review the hierarchy for actors, boundaries, interfaces, state, data, resources, failure, recovery, trust,
  governance, inclusion, locale, compatibility, reversal, risk, and validation.
- Add a missing material topic under its responsible parent. Record an evidenced not-applicable decision when
  an omitted concern could otherwise leave the design ambiguous.
- Improve the structure, sentences, and vocabulary so each topic states one clear decision boundary. Remove
  repetition and detail that does not help the later discussion.

### Phase 3 — Resolve and Record the Design

#### 3.1 Resolve material decisions

- Traverse the hierarchy parent first. Return each user-owned choice through the caller with the best-supported
  option first, then record the supplied decision, rationale, alternatives, trade-offs, consequences, and reopen
  condition.
- Perform targeted study when discussion exposes an evidence gap. Add emergent topics under the correct parent,
  and reopen the earliest affected decision when evidence changes the contract.
- Integrate decisions in hierarchy order. Return every contradiction, unresolved material choice, unsafe
  deferral, or missing consequence instead of assuming an answer.

#### 3.2 Build the indexed output

- Create `ideation-index.md` from the [index template](templates/ideation/ideation-index.md) and at least one
  numbered file from the [part template](templates/ideation/ideation-NN.md). Name parts `ideation-01.md`,
  `ideation-02.md`, and so on; assign the next unused number, never reuse or rename a part, and let the index
  define reading order.
- Keep each part around one coherent section group or complete top-level topic branch. Combine small adjacent
  groups, split large groups only between complete requirement, topic, decision, or table-row boundaries, and
  keep dependent material linked.
- Keep every authoritative part and optional snapshot listed through its owning index. Add no file outside the
  output root or absent from the declared reading order.

#### 3.3 Integrate the complete design

- Integrate the final problem, requirements, scope, study, topic hierarchy, decisions, rejected options,
  consequences, corrections, deferrals, and reopen conditions. Make the design understandable without private
  discussion or a supporting snapshot; return to Step 3.1 if writing exposes a material choice or invalidates
  an earlier decision.
- Define actors, responsibilities, boundaries, structure, ownership, interfaces, data, state, dependencies,
  and verification points. Cover normal, alternative, invalid, failure, and recovery behavior.
- Address applicable performance, resources, security, privacy, governance, accessibility, locale,
  compatibility, migration, rollback, observability, maintenance, and operations. Record risks, assumptions,
  and future validation with observable pass and fail signals, and never present unperformed validation as
  evidence.

#### 3.4 Review and improve the result

- Read the result from `ideation-index.md` through every listed file in order. Review the problem, evidence,
  requirements, decisions, design, failure and recovery paths, risks, validation, deferrals, citations, and
  authority as one result.
- Check structure, readability, compactness, vocabulary, links, membership, reading order, and consistency.
  Improve weak sections directly, merge unnecessary parts, and split only parts whose coherent content is too
  difficult to read or use.
- Correct each finding through the earliest responsible step. Update an optional snapshot only when the caller
  requests a current replacement, then repeat the full result review.

#### 3.5 Freeze and hand off the result

- Freeze `ideation-index.md`, every authoritative part it lists, every snapshot index it lists, and every part
  those snapshot indexes list as one ordered subject. Do not follow evidence or citation links into the frozen
  subject; any change to result membership, order, path, or bytes invalidates the freeze, and evaluator reports
  remain outside the result.
- Return the absolute `ideation-index.md` locator, ordered member paths, optional snapshots labeled subordinate,
  concise outcome and decision summary, explicit deferrals, risks, checks, and the recovery point for any
  stopped path.
- Complete only when the result is current, cold-readable, inside the write boundary, and self-reviewed. Every
  material decision must be resolved or safely deferred with its consequences.

## References

| Name | Description |
|---|---|
| [Ideation index](templates/ideation/ideation-index.md) | Root template for result authority, reading order, and optional snapshots. |
| [Ideation part](templates/ideation/ideation-NN.md) | Repeatable template for one coherent authoritative content group. |
| [Requirements index](templates/ideation/requirements/requirements-index.md) | Index template for an optional subordinate requirements snapshot. |
| [Requirements part](templates/ideation/requirements/requirements-NN.md) | Repeatable template for coherent requirements content. |
| [Topics index](templates/ideation/topics/topics-index.md) | Index template for an optional subordinate study and topic snapshot. |
| [Topics part](templates/ideation/topics/topics-NN.md) | Repeatable template for coherent study or topic content. |
