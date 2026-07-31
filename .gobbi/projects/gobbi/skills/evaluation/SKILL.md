---
name: evaluation
description: "MUST load when finished work needs an independent, evidence-based judgment. Evaluation is an operation skill for a fresh, independent review through checklists, tests, seven perspectives, and Overall, producing problems, optional improvements, strengths, and an evidence-derived verdict."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Evaluation

An independent evaluator uses this skill when a design, plan, implementation, document, interface, process,
or other work needs an evidence-based judgment. Evaluation applies to the work itself and the outcomes it
returned.

The evaluator understands the work, runs applicable pre-built checklists and tests, and reviews the whole work
through Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall. The result separates
problems, optional improvements, strengths, and an evidence-derived verdict.

Evaluation reports the judgment without changing the work or deciding how the owner responds.

## Principles

### Evaluate critically

Evaluate to discover what prevents, weakens, or could improve the intended outcome, not to confirm the
creator's conclusion. Challenge claims, assumptions, evidence, and apparent passes, but report only supported
problems and optional improvements; be skeptical and exact, not hostile.

### Use an independent evaluator

Independent evaluation requires an evaluator who did not design, author, or implement the work and has no
stake in defending it. Self-checks may support the evidence but cannot supply the independent verdict; disclose
any conflict or limitation that could bias the judgment.

### Find problems and optional improvements

A problem is an unmet outcome, requirement, or acceptance condition; an optional improvement is an
evidence-backed way to make acceptable work better. Keep them separate: never soften a problem into an
optional improvement or manufacture an improvement without evidence.

### Find the root cause

Trace each problem from expectation and observation to impact and cause, testing plausible alternatives before
naming the root cause. If evidence remains incomplete, record the leading hypothesis, uncertainty, and missing
evidence, and recommend prevention instead of symptom masking.

## Rules

- **MUST evaluate as an evaluator who did not design, author, or implement the work.** A self-check may support
  the evidence but never supplies the independent verdict, and any conflict or limitation that could bias the
  judgment is disclosed.
- **MUST support every reported problem, optional improvement, and strength with inspected evidence.** Inspect
  the actual artifacts and observable state rather than the work's summary or completion claim.
- **MUST run every applicable checklist row and test and review all eight perspectives.** Record each result
  with its supporting evidence and justify every not-applicable result.
- **NEVER soften a problem into an optional improvement or record an improvement without evidence.** A problem
  is an unmet outcome, requirement, or acceptance condition and stays reported as one.
- **MUST derive the verdict only from completed evidence and the acceptance criteria supplied with the work.**
  Issue no verdict while a required result, material evidence gap, causal uncertainty, or coverage gap remains
  unresolved.
- **NEVER change the work, implement a correction, alter the criteria, or decide how the owner responds.**
  Repeat all three phases when the work changes materially, because a prior result is history, not proof.

## Procedure

### Phase 1 — Understand the Work and Its Outcomes

#### 1.1 Understand the work

- Read the complete work, its supporting material, relevant history, known risks, prior failures, and supplied
  evidence.
- Understand its purpose, intended outcome, scope, requirements, decisions, and constraints.
- Map its actors, inputs, outputs, boundaries, structure, responsibilities, interfaces, dependencies,
  information or data flow, state, failure, recovery, compatibility, and operational effects.
- Record any material uncertainty that limits the evaluation, then use this understanding to inspect the
  returned outcomes.

#### 1.2 Understand the returned outcomes

- Identify what the work returned: deliverables, changes, decisions, reports, test results, evidence, side
  effects, and completion claims.
- Inspect actual artifacts and observable state, not only the summary.
- Separate produced outcomes from claims, missing results, and deferred work. Trace each outcome to the work
  that produced it and the evidence that supports it.
- Carry the traced outcomes and any gaps into Phase 2.

### Phase 2 — Evaluate Checklists, Tests, and Perspectives

#### 2.1 Evaluate checklists and tests

- Collect the applicable pre-built checklists and tests supplied by the work, governing guidance and standards,
  prior failures, and accepted project practices.
- Run every applicable checklist row and test against the work and its returned outcomes.
- Record each result with supporting evidence. Analyze failures and distinguish problems from optional
  improvements and strengths.
- Carry the results and unresolved evidence gaps into Step 2.2.

#### 2.2 Review each perspective

- Review the complete work through each perspective in this order:

  | Perspective | Inspect |
  | --- | --- |
  | **Project** | The outcome, scope, requirements, decisions, obligations, deferred work, and completion. |
  | **Structure** | Decomposition, ownership, interfaces, dependencies, information, data, state, schemas, test seams, and maintainability. |
  | **Performance** | Latency, throughput, capacity, reliability, external calls, batching, timeouts, retries, caching, resources, recurring cost, and measurement. |
  | **Aesthetics** | Clarity, concision, naming, presentation, conventions, hierarchy, placeholders, formatting, comments, and reviewability. |
  | **Usage** | Real user or consumer paths, interfaces, instructions, errors, preconditions, next actions, accessibility, locale, input methods, assistive use, and recovery. |
  | **Consistency** | Agreement among scope, design, obligations, tasks, behavior, implementation, tests, types, documentation, examples, schemas, validators, manifests, migrations, runtime references, commits, evidence, status, and handoff claims. |
  | **Risk** | Security, authorization, input trust, privacy, retention, safety, destructive actions, concurrency, rollback, dependencies, licenses, publication authority, sensitive data, compliance, cost, blast radius, and recovery. |
  | **Overall — General Review** | The complete work or implementation result without limiting the review to one perspective. Find material problems, optional improvements, strengths, and interactions the seven perspectives missed. |

- Inspect the actual work and evidence from each perspective.
- Look for missed actors, states, dependencies, assumptions, harms, failures, incompatibilities, regressions,
  and optional improvements.
- Record evidence-backed problems, optional improvements, and strengths for each perspective.
- Carry the completed perspective records into Phase 3.

### Phase 3 — Organize and Validate the Evaluation Results

#### 3.1 Reconcile the evidence

- Reconcile checklist, test, and perspective results with their evidence, problems, optional improvements,
  strengths, limitations, and evidence gaps.
- Link every failed check or test to a problem and justify every not-applicable result.
- Keep problems, optional improvements, and strengths separate.
- Return to Phase 2 when a material result or evidence gap cannot be reconciled.

#### 3.2 Challenge the evaluation

- Check for false positives and false negatives, proxy evidence, cosmetic compliance, unsupported causes, weak
  sampling, contradictions, and missing interactions.
- Keep problems separate when their causes differ. Consolidate only the same observed condition with the same
  supported cause, and preserve its provenance.
- Return to the earliest affected step when this challenge exposes missing or contradictory evidence, coverage,
  or causal reasoning.

#### 3.3 Derive the verdict

- Checklist completion proves coverage closure, not acceptance.
- Do not issue a verdict while a required result, material evidence gap, causal uncertainty, or coverage gap
  remains unresolved.
- Apply only the acceptance criteria, thresholds, and aggregation rules provided with the work or evaluation
  request. Derive each perspective result, Overall, and the final verdict from completed evidence.
- Keep every problem visible, and never lower a verdict for an optional improvement. If the derivation is
  incomplete, contradictory, or irreproducible, return to Step 3.1 instead of issuing a verdict.

#### 3.4 Organize and hand off

- Organize the result with:
  - Final verdict and concise outcome summary.
  - Problems.
  - Optional improvements.
  - Strengths and what later work must preserve.
  - Results for Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall.
  - Completed checklist scenarios and rows, and tests.
  - Evaluation context, independence, criteria, methods, evidence, limitations, uncertainties, derivation, and
    reproduction details.
  - Corrective directions, reopen conditions, and the handoff boundary.
- Make the result understandable without private discussion context. Whoever receives the result may wrap it
  in a required schema or storage format without changing the evaluation.
- Hand off the result without editing the work, implementing a correction, changing the criteria, or deciding
  how the owner responds.
- If the work changes materially, repeat all three phases for the changed work and its returned outcomes. Prior
  results remain history, not proof.

## References

- [Checklist](checklist/SKILL.md) owns perspective-led scenario and checklist-source construction, review, and
  improvement.
