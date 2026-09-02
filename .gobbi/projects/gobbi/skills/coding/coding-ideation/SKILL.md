---
name: coding-ideation
description: "Coding Ideation is an operation for developing an evidence-backed, top-down code design."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Coding Ideation

Coding Ideation adds an exact top-down code-design ladder to Generic Ideation.
Use it when a bounded topic has an unresolved material code-design choice.
It returns Generic Ideation’s indexed result and stops before realization or task decomposition.

## Principles

### Let Generic Ideation own the lifecycle

Generic Ideation owns evidence intake, participant discussion, user authority, indexed output, freeze, and the
stop before realization. Coding Ideation adds only code-design coverage and its completion condition.

### Design one dependent level at a time

Design each ladder level from the recorded outcomes before it. Close each level before dependent work starts.

### Compare options through decision-fit views

Comparable diagrams or schemas expose the material differences that matter to a decision. Use the smallest
common view set that supports fair comparison or confirmation.

### Preserve specialist ownership

Language, framework, platform, and domain specialists retain their design judgments. Integrate their evidence
without copying or overruling their procedures.

## Rules

- **MUST load and apply [Ideation](../../ideation/SKILL.md) as the complete lifecycle procedure.** Accept a
  direct caller contract without assuming that Coding or another child ran.
- **MUST resolve this exact ladder without merging, swapping, or extending levels:** architecture/structure →
  implementation strategy/policy → design-pattern/class-diagram → public contract → whole-design check.
- **MUST classify every level as `inherited/current`, `not applicable`, or `material change` and close it through
  level-specific study, caller-authorized participant suggestion and critique, a decision-fit view, and a
  recorded user decision.** A material level may contain several separately recorded decisions and option sets.
- **MUST use a class diagram at the design-pattern level when classes apply.** Otherwise use an equivalent
  structural diagram and record why classes do not apply and which structure replaces them.
- **MUST load each applicable specialist owner before making that owner’s design judgment.** Integrate its
  result or constraints into one cross-language design without making it a second lifecycle driver.
- **NEVER decompose tasks, choose exact files, define private construction, write code, run experiments, or
  validate a realized implementation.** Return realization detail and unproved feasibility claims to their later owners.

## Procedure

### Phase 1 — Compose Ideation and Establish the Evidence

#### 1.1 Bind the direct operation contract

- Load [Ideation](../../ideation/SKILL.md) and bind its complete caller contract, including design scope,
  participant records, user-decision route, absolute output root, authority, and completion test.
- Apply this Phase through Ideation Steps 1.1–2.3, Phase 2 while resolving Ideation Step 3.1, and Phase 3 through
  Ideation Steps 3.2–3.5. Coding Ideation adds no competing lifecycle.
- Stop with the exact missing input or conflict when a stable scope, participant record, decision route, output
  identity, or material design boundary cannot be established.

#### 1.2 Establish the baseline and design drivers

- Study the actual code and behavior, source and package structure, callers, consumers, failures, recovery,
  history, prior attempts, governing constraints, proven patterns, prior art, and strongest credible no-change
  result.
- Before Level 1, record actor and consumer scenarios including failure and recovery, non-negotiable domain and
  data invariants, and prioritized measurable quality budgets for applicable latency, throughput, availability,
  capacity, startup, shutdown, and resource use. Also record expected change axes, compatibility promises,
  supported environments, operational ownership, ordered decision criteria, and evidence that would disprove them.
- Load each applicable specialist owner and distinguish facts, reports, hypotheses, and gaps. When a decision
  depends on an unproved claim, stop for a separately owned spike or measurement with the claim, blocked
  decision, evidence owner, acceptable signal, and resume point; do not perform it in Ideation.

### Phase 2 — Top-down code design

#### 2.1 Design the architecture and structure

- Design the system context, responsibilities, logical units, boundaries, dependency direction, integration
  seams, control and data flow, trust boundaries, failure containment, state and resource owners, systems of
  record, and data ownership. Include process or deployment topology when it changes behavior.
- Render equivalent context, component, process, dependency, data-flow, or ownership diagrams for material
  options, or a confirmation diagram or schema for an inherited/current or not-applicable outcome. Apply the Rules
  cadence at this and every later level, and trace each structural choice to the recorded drivers.
- Return the coherent level outcome and recommendation through Ideation, then stop before Level 2 for the recorded
  user decision. Reopen Level 1 when later work changes its accepted structure, ownership, boundary, or dependency.

#### 2.2 Design the implementation strategy and policy

- Design behavior, state transitions, error and recovery policy, data consistency, concurrency, retention,
  migration, security, privacy, compatibility, performance, observability, lifecycle, and resource policy.
  Resolve dependency and build-versus-buy choices by fit, support, security, license, cost, failure, upgrade,
  rollback, and removal.
- Render equivalent control-flow, state, event, lifecycle, trust-boundary, data-flow, or constraint diagrams or
  schemas for the material options. Keep strategy and algorithms above construction detail.
- Return every material policy decision and the coherent level recommendation through Ideation, then stop before
  Level 3 for the recorded user decision. Reopen Level 1 when a policy cannot fit accepted ownership or dependency.

#### 2.3 Design pattern and class diagram

- Design the design pattern from the accepted responsibilities and policies. Choose the smallest fitting class,
  module, function, pipeline, state machine, message, or other form, and record the design pattern name when a
  named pattern fits.
- Render comparable class diagrams when classes apply. Otherwise render equivalent structural diagrams and record
  why classes do not apply and which structure replaces them.
- Return every material representation decision and the coherent level recommendation through Ideation, then
  stop before Level 4 for the recorded user decision. Reopen Level 1 or 2 when the structure changes their outcomes.

#### 2.4 Design the public contract

- Design the public-contract semantics from consumer examples, public operations, boundary-visible data, inputs,
  outputs, effects, ownership, invariants, errors, recovery, and lifecycle. Include applicable ordering,
  concurrency, cancellation, timeout, idempotency, retry, partial success, authorization, versioning, deprecation,
  compatibility, and resource limits.
- Render equivalent API, type, message, event, data, protocol, or contract diagrams or schemas for the material
  options. Exclude private methods, body logic, exact files, and construction syntax.
- Return every material public decision and the coherent level recommendation through Ideation, then stop before
  Level 5 for the recorded user decision. Reopen the earliest prior level when the contract cannot fit it.

#### 2.5 Assemble and check the whole design

- Assemble the accepted outcomes from Levels 1–4 into one integrated candidate with their views, decisions, risks,
  unproved claims, and validation obligations. Then trace requirements, drivers, invariants, risks, and specialist
  constraints to its decisions; walk normal, boundary, invalid, failure, recovery, migration, rollback, and change
  scenarios; and check ownership, dependencies, state, resources, trust, public semantics, compatibility,
  observability, and unsupported complexity across views.
- Render one integrated diagram or schema for the candidate and use it for participant critique of the exact whole
  design. Do not invent a new whole-design alternative unless integration exposes a real unresolved choice.
- Return the Level 5 outcome for final user confirmation through Ideation. Reopen the earliest affected level for
  a defect; otherwise begin no realization.

### Phase 3 — Integrate and Return the Design

#### 3.1 Complete the indexed result

- Reconcile the five closed level outcomes, every material decision, comparable or confirmation view, integrated
  candidate, specialist constraint, risk, and reopen condition into Ideation’s indexed result.
- For each invariant and material claim, record its validation question, observable signal, ordinary and failure
  cases, evidence owner, and current limit. Do not prescribe commands, test files, implementation steps, or claim
  that validation ran.
- Apply Ideation Steps 3.2–3.5 to self-review, freeze, and hand off the complete result. Complete only when all
  five level outcomes and every material decision have user records and no realization recipe leaked into design.

#### 3.2 Hand off or recover

- Return Ideation’s exact indexed locator, ordered members, accepted code-design summary, remaining risks,
  out-of-scope handoffs, and completion evidence.
- On a stop, preserve the current indexed state and return the missing evidence, decision, capability, or
  authority through Ideation’s caller route. Keep any spike or measurement with its separately named owner.
- Resume at the earliest affected design level and propagate any changed decision through every dependent level.

## References

| Name | Description |
|---|---|
| [Ideation](../../ideation/SKILL.md) | Owns the complete evidence, discussion, indexed-result, freeze, and handoff procedure. |
| [Coding](../SKILL.md) | Routes unresolved material code-design work to this operation. |
