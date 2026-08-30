---
name: ideation
description: "Ideation is the operation for developing an evidence-backed design from a problem and its requirements."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Ideation

Ideation develops one evidence-backed design from a problem and its requirements: the in-scope goal, design,
decision, constraint, and strategy. Use it when the problem, scope, or those design choices need study and
user discussion. It records the design as one indexed result and stops before implementation details, recipes,
file-level edits, algorithms as construction, verification methods, or other realization.

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

- **MUST preserve caller and user authority.** The caller supplies the design and decision scope, participant
  discussion contract and records, interaction, orchestration, and evaluation; the user decides each required
  in-scope success, direction, risk, destructive implication, external dependency, and load-bearing assumption.
- **MUST write one closed indexed result at the caller-supplied absolute output root and use its
  `ideation-index.md` as the exact result locator.** List every authoritative part and optional snapshot in the
  root index, list every snapshot part in its own index, and keep every output inside that closed membership.
- **MUST complete the caller-supplied participant discussion before synthesizing in-scope options or a
  recommendation, then return each user-owned in-scope choice through the caller and resume only from the
  supplied decision.** Compare separate supported suggestions and critique, request one focused follow-up when
  an addressable participant can test a disagreement or weak assumption that could change the recommendation,
  resolve or expose conflict, and synthesize the strongest supported options and recommendation; do not force
  consensus or repeat without new evidence, and stop when a required discussion record is unavailable.
- **MUST self-review and freeze the complete indexed result.** Read every listed file as one result and
  preserve its exact ordered membership and bytes; independent evaluation belongs to the caller and is never
  performed or claimed by Ideation.
- **MUST stop at the design boundary.** Define only the in-scope goal, design, decision, constraint, and
  strategy; implementation details, recipes, file-level edits, algorithms as construction, verification
  methods, ordered implementation tasks, implementation diffs, prototypes, code, experiments, benchmarks, and
  other realized output are out of scope.
- **NEVER change an accepted contract silently.** Reopen the earliest affected decision, obtain any required
  user choice through the caller, and propagate the consequence through every affected part.

## Procedure

### Phase 1 — Understand the Problem and Requirements

#### 1.1 Establish the operation contract

- Read the request, caller authority, governing materials, prior attempts, conflicts, problem or opportunity,
  desired outcome, requirements, and accepted scope. Require a caller-supplied design and decision scope,
  intended consumer, completion test, and out-of-scope handoff treatment.
- Require the participant discussion contract and separate participant discussion records, user-decision
  authority and route, exact output locator, absolute output root, allowed write boundary, and recovery authority.
  The design and decision scope must state which choices are included and excluded.
- Resolve the paths, confirm output containment, and inspect an existing target before writing. Stop and return
  the exact target conflict or missing, contradictory, or unclear input, and revise an existing target only
  with caller authority instead of inferring or overwriting any part of the contract.

#### 1.2 Define the problem, outcome, and scope

- Trace the current behavior, evidence, impact, prior attempts, current approach, and strongest credible
  no-change result. Distinguish inspected facts, reports, hypotheses, and uncertainty.
- Define the desired outcome, actors, observable behavior, inputs, outputs, integration boundary, unchanged
  behavior, solution-neutral requirements, success and failure signals, and Included, Excluded, Deferred, or
  Rejected scope within the caller-supplied design and decision scope. Resolve only choices inside that scope.
- Return each unresolved in-scope choice through the caller's user-decision route. Record or return an
  out-of-scope question only as the handoff treatment requires; when requested, render the supporting
  requirements snapshot from the
  [requirements templates](templates/ideation/requirements/requirements-index.md); the final Ideation result
  remains authoritative over later corrections.

### Phase 2 — Study the Evidence and Topics

#### 2.1 Study applicable evidence

- Study source documents, code, configuration, history, decisions, patterns, counterexamples, and failed
  attempts that can affect an in-scope choice, and record facts, assessments, adopted lessons, rejections,
  conflicts, and gaps. Study external prior art only when internal evidence is insufficient or comparison can
  improve an in-scope choice; prefer current primary sources and record any reuse restriction.
- Study every required caller-supplied participant discussion record before Step 2.2, keeping supported
  suggestions and critique separate while comparing their reasoning. Stop when a required record is unavailable;
  record an unavailable optional participant as an evidence limit.
- When a disagreement or weak assumption could change the recommendation, return one focused follow-up for an
  addressable participant through the caller, then resolve or expose the conflict. Do not force consensus or
  repeat without new evidence; return an unsupported in-scope premise with the exact missing context, study,
  authority, or scope change and treat an out-of-scope evidence gap only as the handoff treatment requires.

#### 2.2 Build the decision hierarchy

- Derive decision topics only for choices inside the supplied design and decision scope. Root the hierarchy in
  the problem and outcome, order parents before children, and expose dependencies, conflicts, and reopen
  conditions.
- For each in-scope topic, synthesize the strongest supported suggestions and relevant critique into genuine
  alternatives and a recommendation only after Step 2.1 completes participant discussion. State its question,
  connected requirements, evidence, trade-offs, exposed conflict, done condition, and evidence that could change it.
- When requested, render the supporting topic snapshot from the
  [topic templates](templates/ideation/topics/topics-index.md). Treat it as a study and discussion snapshot,
  not as the authoritative design.

#### 2.3 Review topic coverage

- Review the hierarchy for actors, boundaries, interfaces, state, data, resources, failure, recovery, trust,
  governance, inclusion, locale, compatibility, reversal, risk, and validation against the supplied design and
  decision scope. Do not create a topic outside that scope.
- Add a missing in-scope topic under its responsible parent or record an evidenced not-applicable decision.
  Record or return an out-of-scope concern only as the handoff treatment requires.
- Improve the structure, sentences, and vocabulary so each topic states one clear decision boundary. Remove
  repetition and detail that does not help the later discussion.

### Phase 3 — Resolve and Record the Design

#### 3.1 Resolve in-scope decisions

- Traverse the in-scope hierarchy parent first. For each user-owned choice, return one package with the
  question, context, feasible options, recommendation, trade-offs, evidence, and reopen condition, then stop
  dependent work.
- Resume only from the caller-supplied recorded user decision, then record its rationale, alternatives,
  consequences, and reopen condition. Treat an out-of-scope question only as the caller contract requires.
- Perform targeted study when discussion exposes an in-scope evidence gap, integrate decisions in hierarchy
  order, and reopen the earliest affected decision when evidence changes the contract. Return every
  contradiction, unresolved in-scope choice, unsafe deferral, or missing in-scope consequence.

#### 3.2 Build the indexed output

- Create `ideation-index.md` from the [index template](templates/ideation/ideation-index.md) and at least one
  numbered file from the [part template](templates/ideation/ideation-NN.md). Name parts `ideation-01.md`,
  `ideation-02.md`, and so on; assign the next unused number, never reuse or rename a part, and let the index
  define reading order.
- Keep each part around one coherent section group or complete top-level topic branch. Combine small adjacent
  groups, split large groups only between complete requirement, topic, decision, or table-row boundaries, and
  keep dependent content linked.
- Keep every authoritative part and optional snapshot listed through its owning index. Add no file outside the
  output root or absent from the declared reading order.

#### 3.3 Integrate the complete design

- Integrate the final problem, requirements, scope, study, topic hierarchy, decisions, rejected options,
  consequences, corrections, deferrals, and reopen conditions to the depth required by the supplied scope and
  intended consumer. Make the design understandable without private discussion or a supporting snapshot, and
  return to Step 3.1 when writing exposes an unresolved in-scope choice or invalidates an earlier decision.
- Define the actors, responsibilities, boundaries, structure, ownership, interfaces, data, state, dependencies,
  verification points, and behavior required by the supplied design and decision scope. Cover normal,
  alternative, invalid, failure, and recovery behavior only to that required depth.
- Address performance, resources, security, privacy, governance, accessibility, locale, compatibility,
  migration, rollback, observability, maintenance, and operations only when included in the supplied scope.
  Record risks, assumptions, observable validation signals, and required out-of-scope handoffs; never present
  unperformed validation as evidence.

#### 3.4 Review and improve the result

- Read the result from `ideation-index.md` through every listed file in order. Review the problem, evidence,
  requirements, in-scope decisions, accepted design, risks, validation, deferrals, citations, caller contract,
  intended consumer, and completion test as one result.
- Check structure, readability, compactness, vocabulary, links, membership, reading order, and consistency.
  Improve weak sections directly, merge unnecessary parts, and split only parts whose coherent content is too
  difficult to read or use.
- Correct each in-scope finding through the earliest responsible step, and treat each out-of-scope finding as
  the handoff treatment requires. Update an optional snapshot only when the caller requests a current
  replacement, then repeat the full result review.

#### 3.5 Freeze and hand off the result

- Freeze `ideation-index.md`, every authoritative part it lists, every snapshot index it lists, and every part
  those snapshot indexes list as one ordered subject. Do not follow evidence or citation links into the frozen
  subject; any change to result membership, order, path, or bytes invalidates the freeze, and evaluator reports
  remain outside the result.
- Return the absolute `ideation-index.md` locator, ordered member paths, optional snapshots labeled subordinate,
  concise outcome and decision summary, explicit deferrals, out-of-scope handoffs, risks, checks, and the
  recovery point for any stopped path, using the caller-supplied handoff treatment.
- Complete only when the result is current, cold-readable, inside the write boundary, self-reviewed, every
  in-scope choice is resolved, excluded, or safely deferred, and the caller's completion test passes. Stop and
  return the failed completion condition instead of inventing a different test.

## References

| Name | Description |
|---|---|
| [Ideation checklist](checklist.md) | Reusable unchecked source for evaluating Ideation work and complete current indexed results. |
| [Ideation index](templates/ideation/ideation-index.md) | Root template for result authority, reading order, and optional snapshots. |
| [Ideation part](templates/ideation/ideation-NN.md) | Repeatable template for one coherent authoritative content group. |
| [Requirements index](templates/ideation/requirements/requirements-index.md) | Index template for an optional subordinate requirements snapshot. |
| [Requirements part](templates/ideation/requirements/requirements-NN.md) | Repeatable template for coherent requirements content. |
| [Topics index](templates/ideation/topics/topics-index.md) | Index template for an optional subordinate study and topic snapshot. |
| [Topics part](templates/ideation/topics/topics-NN.md) | Repeatable template for coherent study or topic content. |
