---
name: evaluation
description: "MUST load when finished work needs an independent judgment. Evaluation produces one read-only, evidence-based judgment of an exact frozen subject."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Evaluation

An independent evaluator uses this operation to produce one reproducible, evidence-based judgment of an exact frozen subject.

Evaluation inspects actual work before prepared checklists or tests. They are context-appropriate baselines, never a coverage ceiling.

Evaluation is read-only. It keeps judgment outside the subject, checklists, tests, criteria, dispositions, and workflow state.

## Principles

### Inspect actual outcomes first

Actual work and observable state define the boundary; prepared coverage cannot erase a scenario or gap exposed by evidence.

### Keep judgment independent

The evaluator has no producer role or stake in defending the subject. Conflicts, limits, uncertainty, and missing evidence stay visible.

### Use broad prompts without fixed traversal

Development and product lifecycles plus relevant perspectives reveal boundaries, but never define required traversal or records.

### Support only the causes the evidence reaches

Tie each Problem to an expectation, observation, impact, and supported cause or hypothesis. State material uncertainty and confidence.

## Rules

- **MUST freeze the exact subject and establish independence before judging.** Disclose material conflicts, limits, and missing capabilities.
- **MUST inspect actual work and intended outcomes before prepared coverage.** Discover context-driven
  scenarios from evidence across relevant development and product lifecycle positions.
- **MUST keep context-appropriate prepared checklists unchanged.** Never migrate, translate, normalize, repair, or rewrite an input.
- **MUST inspect applicable prepared conditions and tests, then extend beyond them when evidence exposes a
  gap.** Justify exclusions, uncertainty, sampling, and evidence limits.
- **MUST keep Problems, Optional Improvements, and Strengths semantically separate and evidenced.** Causes and
  confidence go only as far as the evidence supports.
- **NEVER issue a verdict when material evidence is insufficient or caller-supplied decision criteria are
  absent.** Name the gaps, and derive a verdict only from the criteria the caller supplied.

## Procedure

### Phase 1 — Freeze and Inspect the Subject

#### 1.1 Establish the evaluation boundary

- Confirm that the evaluator did not design, author, or implement the subject. Disclose any relationship or
  interest that could affect independent judgment.
- Freeze the exact subject identity and version or content hash, actual artifacts and observable state,
  intended outcomes, scope, governing inputs, known risks, and prior failures.
- Bind supplied checklist sources, tests, evidence, and caller criteria to their exact identities when
  available.
- Establish a safe read-only method. Stop when independence, stable identity, access, or the read-only
  boundary cannot support a responsible judgment.

#### 1.2 Inspect actual work and intended outcomes

- Examine produced artifacts and observable behavior before summaries, completion claims, prepared
  conditions, or test reports can shape the conclusion.
- Distinguish delivered outcomes from claims, deferred work, missing results, and unavailable state.
- Discover relevant scenarios across the development lifecycle and product lifecycle. Consider creator or
  developer and consumer or user positions when they materially change expectations or evidence.
- Consider ordinary success, boundaries and transitions, failure and recovery, and deficient-but-functioning
  outcomes such as inconvenience, unintuitive behavior, confusion, inconsistency, or poor appearance.
- Consider governance, misuse, abuse, or cosmetic compliance when relevant to the subject. Treat these as
  context prompts, not fixed classes or required traversal.
- Use relevant perspectives only when they help challenge an evaluation boundary. Do not name a fixed set or
  record their use.

### Phase 2 — Use and Challenge Prepared Coverage

#### 2.1 Bind prepared inputs without changing them

- Accept each prepared checklist in the form appropriate to its context. Bind it to the frozen subject and
  preserve its wording, hierarchy, identifiers, and unchecked source state.
- Do not classify, migrate, translate, normalize, repair, reorder, or rewrite prepared content. Report a
  material ambiguity or mismatch as an evidence gap.
- Treat prepared conditions and tests as baseline inputs, not a coverage ceiling or a substitute for
  inspecting actual work.

#### 2.2 Inspect conditions, tests, and evidence

- Inspect every applicable prepared condition and test against actual state. Keep answers, observations,
  limitations, and results in evaluation-owned notes or output only.
- Record enough evidence and reproduction detail for another evaluator to understand each material judgment.
- Justify every exclusion from inspected context. State uncertainty when access, sampling, causality,
  freshness, or evidence quality limits an answer.
- Preserve the source/judgment boundary: checklist assertions remain source-owned, while observations and
  judgments remain evaluation-owned.

#### 2.3 Extend the investigation when needed

- Compare prepared coverage with the context-driven scenarios found from the actual subject.
- Investigate material gaps exposed by behavior, boundaries, transitions, deficient quality, governing
  constraints, failures, recovery, or affected positions.
- Add new observations and evidence needs to the evaluation, not to the prepared source.
- Return to Phase 1 when new evidence changes the frozen identity, intended outcome, scope, or material
  context.

### Phase 3 — Reconcile Evidence and Form Results

#### 3.1 Reconcile evidence and gaps

- Reconcile actual observations, prepared expectations, tests, governing inputs, reproduction evidence,
  exclusions, limitations, and uncertainty.
- Test conflicting explanations against actual state when the read-only boundary permits it. Keep alternatives
  as hypotheses when evidence cannot distinguish them.
- Name each material evidence gap, its effect on judgment, and the evidence or access needed to resolve it.
- Stop without a verdict when evidence is insufficient for a material judgment. Return to the earliest
  affected step if recovery is possible without changing the frozen subject.

#### 3.2 Separate the result meanings

- Record a Problem only for an unmet outcome, requirement, or caller criterion. State the expectation,
  inspected observation, impact, evidence, supported cause or hypothesis, uncertainty, and confidence.
- Record an Optional Improvement only when the current condition is acceptable and evidence supports a useful
  benefit. Keep it out of verdict derivation.
- Record a Strength only for a verified beneficial outcome. State its evidence and any condition later work
  should preserve without using it to cancel a Problem.
- Define each result once and reference it elsewhere only when the caller needs traceability.

### Phase 4 — Derive and Hand Off the Judgment

#### 4.1 Apply caller-supplied decision criteria

- Derive a verdict only when the caller supplied applicable criteria, thresholds, and any aggregation rule.
- Show how evidence and relevant Problems satisfy those criteria. Do not invent default thresholds or allow
  Optional Improvements or Strengths to offset a criterion.
- When criteria are absent or incomplete, return the evidence-based results without a verdict and name the
  missing decision input.

#### 4.2 Hand off without mutation

- Let the caller own report order, formatting, section labels, acceptance, disposition, and workflow routing.
- Include the frozen subject, independence statement, method, evidence, reproduction details, gaps,
  uncertainty, results, and any criteria-derived verdict needed to understand the judgment.
- Do not change the subject, checklists, tests, criteria, findings, dispositions, acceptance state, or workflow
  state.
- If a frozen input or observable state changes materially, mark affected judgment historical and restart at
  the earliest affected step with the changed premise.

## References

- [Checklist](checklist/SKILL.md) owns authoring reusable unchecked evaluation sources.
