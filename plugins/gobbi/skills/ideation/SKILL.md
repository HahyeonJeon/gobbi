---
name: ideation
description: "MUST load when discussing a problem and exploring how to address it with the user. Ideation is an operation skill for understanding the problem, defining its boundaries, and developing an evidence-backed design through discussion."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Ideation

The Ideation operator applies this skill when a caller needs a user trigger turned into an
evidence-backed design. The operator studies the problem, prepares and resolves material decisions through
the caller, and writes one current authoritative result: `ideation.md`.

The caller retains user interaction, orchestration, and independent evaluation. The operator stops at the
design boundary and freezes a self-reviewed subject. Caller-requested `requirements.md` and `topics.md`
snapshots remain optional and subordinate.

## Principles

### Preserve user authority through the caller

An unresolved material choice is a question, not permission to assume. Return the exact decision to the
caller with enough evidence and trade-offs for the user to choose.

### Study before selecting a direction

Use project evidence and applicable trustworthy prior art to frame distinct options. Judge them by supported
fit with the outcome and constraints.

### Resolve a hierarchy, then reopen it when evidence changes

Settle parent decisions before dependent details and reconcile effects across sibling branches. Late evidence
reopens the earliest affected decision and every conclusion that depends on it.

### Keep one current design

`ideation.md` integrates the requirements, evidence, decisions, consequences, and design into one
cold-readable result. Working notes and optional snapshots remain subordinate implementation detail.

## Rules

- **MUST preserve caller and user authority.** The user decides material scope, success, direction, risk,
  destructive implications, external dependencies, and load-bearing assumptions; the caller supplies each
  decision to the operator.
- **MUST write only to caller-supplied absolute paths inside an explicit write boundary.** Require one path
  for `ideation.md`; write optional supporting snapshots only when the caller also names their paths.
- **MUST return material questions to the caller instead of invoking user controls.** State the exact question,
  context, options, recommendation, trade-offs, and evidence that could change it, then resume only from the
  supplied decision.
- **MUST self-review and freeze the complete result for handoff.** Independent evaluation belongs to the
  caller and is never performed or claimed by this operation.
- **MUST stop at the design boundary.** Define the complete intended behavior and design without ordered
  implementation tasks, implementation diffs, or produced realization output.
- **NEVER change an accepted contract silently.** New evidence must reopen the affected decision, obtain any
  required user choice through the caller, and propagate the recorded consequence through the design.

## Procedure

### Phase 1 — Lock the requirements

#### 1.1 Establish the operation contract

- Read the trigger, caller-owned authority and decisions, project state, governing materials, prior attempts,
  active scope, conflicts, and intended consumer. Require the absolute `ideation.md` path, allowed write
  boundary, and any requested supporting paths.
- Resolve every supplied path and confirm it stays inside the boundary. Inspect an existing output before
  writing. Treat it as revision input only when the caller authorizes revision; otherwise stop and return the
  conflict without overwriting, deleting, or inventing caller-specific state.
- Identify the outcome, purpose, actors, expected evidence, exclusions, and first material unknown. If context
  or authority is missing, return the exact item and what is needed to resume. Do not draft around it.

#### 1.2 Lock the problem, outcome, and scope

- Trace current behavior, evidence, cause or opportunity, impact, prior attempts, current approach, and the
  strongest credible no-change result. Distinguish facts from reports, hypotheses, and uncertainty.
- Define the desired outcome, actors, observable behavior, inputs, outputs, integration boundary, unchanged
  behavior, solution-neutral requirements, success and failure signals, and explicit Included, Excluded,
  Deferred, or Rejected scope items.
- Return each material requirement or scope uncertainty as one decision question through the caller. Revise
  until What and Why are complete and no open question can change the contract. When requested, render an
  optional snapshot from
  [`requirements.md`](templates/requirements.md); later corrections still belong in `ideation.md`.

### Phase 2 — Study evidence and build the decision agenda

#### 2.1 Study applicable evidence

- Study relevant project documents, code, configuration, history, decisions, patterns, counterexamples, and
  negative results. Assess authority, relevance, currency, applicability, and any reuse license.
- Study external prior art only when internal evidence is insufficient or comparison would materially improve
  a choice. Prefer current primary sources; record adopted lessons, rejections, conflicts, and gaps.
- If evidence cannot support safe options, return the missing context, study need, authority, or scope change
  to the caller. Never disguise an unsupported premise as a recommendation.

#### 2.2 Build and audit the decision agenda

- Derive a project-specific hierarchy from the requirements and study. Root it in the problem and outcome;
  order parents before children and expose dependencies, conflicts, and reopen conditions.
- For each material topic, state its question, connected requirements, evidence, genuine options, relevant
  pros and cons, recommendation, trade-offs, done condition, and what evidence could change the recommendation.
- Audit applicable actors, boundaries, interfaces, state, data, resources, failure, recovery, trust,
  governance, inclusion, locale, compatibility, reversal, risk, and validation. Record an evidenced
  not-applicable decision for each omitted material concern. If requested, render this agenda as an optional
  snapshot from [`topics.md`](templates/topics.md); it is not a live or authoritative design.

### Phase 3 — Resolve, integrate, and hand off

#### 3.1 Resolve material decisions

- Traverse the agenda parent first. For every user-owned choice, return one decision-ready question to the
  caller with the best-supported option first; resume from the supplied selection, rejection, or explicit
  deferral and record its rationale, alternatives, trade-offs, consequences, and reopen condition.
- Perform targeted study when discussion exposes an evidence gap. Add emergent topics under the correct
  parent. When evidence or a decision changes the contract, reopen the earliest affected topic, identify its
  descendants and sibling effects, and repeat resolution instead of patching only the latest conclusion.
- Integrate decisions in hierarchy order. Return every contradiction, unresolved choice, unsafe deferral, or
  missing consequence rather than assume.

#### 3.2 Develop the integrated design

- Write `ideation.md` from [`the authoritative result template`](templates/ideation.md). Integrate the final
  problem, requirements, scope, study, topic tree, decisions, rejected options, consequences, corrections,
  deferrals, and reopen conditions so no supporting file or private discussion is required.
- Define actors, responsibilities, boundaries, structure, ownership, interfaces, data, state, dependencies,
  and verification seams. Cover normal, alternative, invalid, failure, and recovery behavior.
- Disposition applicable performance, resource, security, privacy, governance, accessibility, locale,
  compatibility, migration, rollback, observability, maintenance, and operational obligations. Record risks,
  assumptions, and future validation with observable pass and fail signals; never present unperformed
  validation as evidence.
- If design development exposes a material choice or invalidates an earlier decision, return to Step 3.1 and
  regenerate the affected design. Do not cross into implementation planning or realization.

#### 3.3 Self-review, freeze, and hand off

- Read `ideation.md` alone as a cold consumer. Verify the problem, outcome, evidence, requirements, scope,
  decisions, design, failure and recovery paths, risks, validation, deferrals, citations, and authority are
  complete and mutually consistent, with no hidden material choice or implementation output.
- Correct findings through the earliest responsible step and repeat affected gates. Update a snapshot only
  when the caller requests a current replacement; otherwise let `ideation.md` state every correction.
- Freeze the exact `ideation.md` bytes and any caller-requested supporting snapshots as one evaluation-ready
  subject. Return the authoritative path, optional supporting paths labeled subordinate, a concise outcome
  and decision summary, unresolved explicit deferrals, risks, checks performed, and the exact question or
  recovery point for any stopped path.
- Complete only when `ideation.md` is current, cold-readable, within the write boundary, and self-reviewed;
  every material decision is resolved or safely deferred with consequences; and the frozen subject is ready
  for the caller's independent evaluation or next operation.

## References

- [`requirements.md`](templates/requirements.md) defines an optional supporting requirements snapshot.
- [`topics.md`](templates/topics.md) defines an optional supporting study and decision-agenda snapshot.
- [`ideation.md`](templates/ideation.md) defines the current authoritative Ideation result.
