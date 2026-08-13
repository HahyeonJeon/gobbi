---
name: evaluation
description: "Evaluation is an operation for preparing a checklist, assessing one defined target, and writing an evidence-based report."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Evaluation

Evaluation defines a four-phase procedure for understanding one target, preparing an evidence-backed
checklist, assessing the target, and reporting the results. Use it after the target is ready for independent
review and before an acceptance or workflow decision; it does not modify the target, source checklists, or
decision state.

## Principles

### Understand the target before defining coverage

Inspect the actual target, intended results, context, and boundaries before preparing checklist items.
This prevents assumptions, summaries, or existing checklists from defining the target incorrectly.

### Find useful improvements as well as problems

Evaluation should show how an acceptable target can become better, not stop after identifying failures.
Record evidence-backed improvement points with practical suggestions, while keeping them separate from
Problems and verdicts.

### Keep the evaluation independent and preserve its inputs

The evaluator should have no producer role or interest in defending the target. Write only evaluation-owned
checklists, notes, and reports while preserving the target, source checklists, criteria, and workflow state.

### Support each judgment with direct evidence

Connect every result to the expected condition, observed state, impact, and evidence. State uncertainty and
limit causes and verdicts to what the evidence supports.

## Rules

- **MUST bind the exact target, scope, intended results, supplied decision criteria, caller-authorized report
  path, and any other evaluation output paths before preparing the checklist.** Stop when identity, access,
  independence, or preservation of source-owned inputs cannot support a responsible evaluation.
- **MUST prepare one evaluation-owned checklist from applicable existing checklists and necessary internal or
  external study.** Load the standalone Checklist operation before authoring a new item; reusing existing items
  alone does not load it.
- **MUST evaluate the target through both its working checklist and a general review.** Evaluate every
  applicable item, then inspect the whole target for material problems, improvements, strengths, and
  evidence gaps the checklist did not anticipate.
- **MUST derive a verdict only from sufficient evidence and caller-supplied decision criteria.** Do not let an
  optional improvement or strength cancel an unmet criterion.
- **NEVER change the target, source checklists, supplied criteria, acceptance state, or workflow state.** Write
  only the evaluation-owned checklist, notes, and report.

## Procedure

### Phase 1 — Understand the Evaluation Target

#### 1.1 Bind the target and evaluation boundary

- Confirm that the evaluator did not design, author, or implement the target. Disclose any relationship,
  interest, access limit, or missing capability that could affect independent judgment.
- Identify the exact artifact, state, version, or content hash under evaluation, plus its scope, intended
  results, and caller-supplied decision criteria. Record affected people and systems, governing inputs, known
  risks, prior failures, the caller-authorized report path, and any other evaluation-owned output paths;
  confirm that no output overlaps the target or source-owned inputs.
- Establish a safe inspection method that preserves the target and source-owned inputs, and record the
  available evidence. Stop when the target is unstable or material identity, access, or authority is missing;
  absent decision criteria allow a report but not a verdict.

#### 1.2 Inspect and understand the actual target

- Inspect the artifacts and observable behavior before reading completion claims, reports, or prepared
  checklists. Distinguish delivered results from claims, deferred work, missing results, and unavailable state.
- Trace the target's relevant structure, dependencies, interfaces, states, transitions, failures, recovery,
  and user or consumer paths. Follow only the contexts that can change an expected result or its evidence.
- Record verified facts, open questions, assumptions, and material evidence gaps. Return to Step 1.1 when the
  inspection changes the target identity, scope, intended result, or decision criteria.

### Phase 2 — Prepare the Evaluation Checklist

#### 2.1 Gather existing checklist coverage

- Collect the applicable project checklists, caller-supplied checklists, requirements, rules, tests, and prior
  evaluation items. Treat them as baseline coverage rather than proof that the target is complete.
- Preserve every source's wording, hierarchy, identifiers, and unchecked state. Copy or reference only
  applicable items in the evaluation-owned checklist and retain their exact source identity.
- Record each excluded, ambiguous, stale, conflicting, or unavailable source item with its reason and
  effect on coverage. Do not repair or rewrite the source during Evaluation.

#### 2.2 Study for missing checklist items

- Study relevant internal evidence, including governing documents, designs, source, tests, configuration,
  user evidence, history, and prior failures. Look for expectations, boundaries, and risks not covered by the
  existing checklist sources.
- Study current primary external sources when the target depends on an external standard, platform, library,
  security practice, or other mechanism that internal evidence does not settle. Record the source and why it
  applies.
- Load [Checklist](../checklist/SKILL.md) before authoring any new working item, then apply its item guidance
  within the evaluation-owned checklist. Add only material expectations or risks supported by study
  evidence, not coverage that fills a category, increases a count, or represents a speculative case.

#### 2.3 Finalize the evaluation-owned checklist

- Organize the working items in an order that fits the target and remove only working-copy duplication. Keep
  every reused item traceable to its unchanged source and every added item traceable to its
  study evidence.
- Check relevant success, boundary, transition, failure, recovery, deficient-quality, safety, misuse, and
  change cases. Include only cases that the target or evidence makes applicable.
- Confirm that the working checklist covers the material target boundary and that every reused or added item
  remains traceable. Freeze the working checklist with the target before evaluation begins.

### Phase 3 — Evaluate the Target

#### 3.1 Complete the checklist-based evaluation

- Evaluate every applicable item against the frozen target with safe non-mutating inspections,
  reproductions, tests, or measurements. Record the observations, exact evidence, limitations, and uncertainty
  needed to support the material results.
- Record each Problem with its expectation, observation, impact, evidence, supported cause or hypothesis,
  and uncertainty.
- Record each Optional Improvement with its acceptable current condition, evidence, expected benefit,
  and practical suggestion. Record each Strength with its verified benefit, evidence, and condition to
  preserve.

#### 3.2 Review the target beyond the checklist

- Review the frozen target as a whole because a checklist cannot anticipate every material case or
  interaction. Inspect relationships, inconsistencies, omissions, deficient quality, and improvement
  opportunities that become visible only outside item-by-item traversal.
- Record each additional Problem, Optional Improvement, Strength, or evidence gap with direct evidence and
  the same result meanings as Step 3.1. Return to Phase 2 when a discovery exposes a material coverage gap, or
  Phase 1 when it changes the target or evaluation boundary.
- Reconcile the checklist-based results with the general review, then apply the caller-supplied criteria,
  thresholds, and aggregation rule once to all contributing Problems. Issue no verdict when material evidence
  or decision criteria are insufficient, and name what would resolve the gap.

### Phase 4 — Report the Evaluation

#### 4.1 Write and summarize the evaluation report

- Recheck the frozen target identity and evaluation-owned output paths before writing. Return to Phase 1 when
  the target changed or an output path overlaps the target or a source-owned input.
- Write the report from the [report template](templates/report.md), adding caller-required fields without
  replacing its target identity, independence, scope, method, result, gap, or verdict meanings. Give each
  material result exact evidence and enough reproduction detail, and give each Optional Improvement a concise
  evidence-backed suggestion.
- Cite internal paths and external sources beside the claims they support. Return a short summary with the
  verdict or reason none was issued, Problems, Optional Improvements, Strengths, and unresolved evidence.

## References

| Name | Description |
|---|---|
| [Checklist](../checklist/SKILL.md) | Standalone operation for authoring a reusable, unchecked evaluation source. |
| [Report template](templates/report.md) | Default structure for a short, evidence-based Evaluation report. |
