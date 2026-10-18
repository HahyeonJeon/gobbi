---
name: design-review
description: "Design Review is an operation for independent critique of one frozen visual subject and for writing an evidence-based report."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Design Review

Design Review binds and freezes one visual subject, criticizes it, applies caller criteria, and writes
`report.md`.
Use it after one exact stable visual subject is ready for independent review and before an acceptance or workflow decision.
The caller assigns a fresh `design-reviewer` and does not reuse the producer. It does not modify the target
or decision state.

This skill is a draft adapted from Evaluation.

## Principles

### Criticize the frozen target from the subject

Inspect and freeze the actual visual subject, then criticize that subject from the review-owned prompts and
the bound bar.

### Find useful improvements as well as problems

Review should show how an acceptable subject can become better, not stop after identifying failures.
Record evidence-backed improvement points with practical suggestions, while keeping them separate from
Problems and verdicts.

### Keep the review independent and preserve its inputs

The reviewing agent should have no producer role or interest in defending the subject. Write only files the review
creates, such as `report.md` and check output, while preserving the target, criteria, and workflow state.

### Support each judgment with direct evidence

Connect every result to the expected condition, observed state, impact, and evidence. State uncertainty and
limit causes and verdicts to what the evidence supports.

## Rules

- **MUST bind the exact target, scope, intended results, supplied decision criteria, the report
  path, and any caller-supplied `review-depth` before the critical review.** Confirm the report path
  does not overlap the target or a source-owned input, and stop when identity, access, independence, or
  preservation cannot support a responsible review.
- **MUST criticize the frozen target from the review-owned prompts and the current project design and
  vision before applying caller criteria.** Record those results before the verdict.
- **MUST label every Problem and Improvement `in-contract` or `out-of-contract`, and derive
  the gate verdict only from in-contract Problems, sufficient evidence, and caller-supplied
  criteria.** Record a quality opinion against current project design and vision that never
  changes that verdict.
- **NEVER change the target, supplied criteria, acceptance state, or workflow state.** Write only files this
  review creates, such as `report.md` and check output.

## Procedure

### Phase 1 — Understand and bind the target

#### 1.1 Bind the target and review boundary

- Confirm that the reviewing agent did not design, author, or implement the target, and disclose any
  relationship, interest, access limit, or missing capability that could affect independent
  judgment. Do not read another reviewing agent's `report.md` from the same iteration.
- Bind the exact artifact, state, version, or content hash; scope; intended results;
  caller-supplied decision criteria; the review-owned `report.md` path; and any caller-supplied
  `review-depth`. Confirm that the path does not overlap the target or a source-owned input, and that
  the reviewing agent does not write `gate.md`.
- Stop when identity, access, independence, or preservation cannot support a responsible
  review. Absent decision criteria allow a report and forbid a contract-gate verdict.

#### 1.2 Inspect the actual target

- Inspect the artifacts and observable behavior before reading completion claims or prepared reports.
  Distinguish delivered results from claims, deferred work, missing results, and unavailable state.
- Trace the target's relevant structure, dependencies, interfaces, states, transitions,
  failures, recovery, and consumer paths. Follow only the contexts that can change an expected
  result or its evidence.
- Record verified facts, open questions, assumptions, and evidence gaps, and do not record
  Problems yet. Return to Step 1.1 when inspection changes the target identity, scope,
  intended result, or decision criteria.

#### 1.3 Study the quality bar and freeze the target

- Load, in this order, whichever exist: current design memory under the project's
  `memory/design/`; project vision, philosophy, architecture, and governing decisions;
  accepted session design; and the session ontology area files in the session's `ontology/`, with their
  Memory copies under the project's `memory/ontology/`. Then load
  [Ontology](../../ontology/SKILL.md) and [Design Review ontology](ontology.md).
- Record missing bar sources as a Gap and never invent a vision. Never add these sources to
  gate criteria unless the caller listed them.
- Freeze the exact artifact, state, version, or content hash only when that state is stable;
  stop instead of freezing an unstable target. After this freeze, Phase 2 may criticize and
  must not mutate the target.

### Phase 2 — Review the target critically

#### 2.1 Criticize the frozen target

- Run these review-owned prompts. They must not become report taxonomy. When `review-depth` is bound,
  apply them only inside that depth.

  | Prompt | Ask about |
  |---|---|
  | **Project design and vision** | The frozen target contradicts or drifts from current design, vision, philosophy, architecture, or accepted session design. What those sources omit. |
  | **Best version and gap** | The distance between this target and the best version a competent owner would produce for the same purpose and constraints. |
  | **Failure, gaming, and cosmetic compliance** | The target fails, is exploited at a boundary, or satisfies the form of a requirement while missing the result. |
  | **Absences across the target's life** | What is missing rather than wrong: an unowned consequence, an unhandled state, or a later stage no one covers. |

- Study an uncovered expectation or risk against internal evidence and current primary external sources
  before closing the record.

#### 2.2 Record the critical-review results

- Record labeled Problems, Improvements, Strengths, and gaps using the [report template](report.md)
  field meanings.
- Label every Problem and Improvement `in-contract`, citing the criterion or bound intended
  result, or `out-of-contract`, citing the governing source; when `review-depth` is bound,
  in-contract labeling follows the supplied token and the target skill's purpose and boundary.
  Missing implementation detail at `ideation-design` or `planning-decomposition` is not an
  in-contract Problem, and Phase 2 may still record out-of-contract Improvements for polish;
  a Problem that maps to a supplied criterion must be `in-contract`, and an out-of-contract
  result with no cited governing source is not a Problem and must be demoted to an Improvement
  or dropped.
- Return to Phase 1 if this review changes the bound target or review boundary.

### Phase 3 — Apply criteria and report

#### 3.1 Apply caller criteria and set opinions

- Apply caller-supplied criteria, thresholds, and aggregation once to in-contract Problems
  only. Optional Improvements, Strengths, out-of-contract Problems, and the quality opinion
  do not change the contract-gate verdict.
- Set the quality opinion to `meets-design`, `mixed`, `does-not-meet`, or `not-available`. If
  the caller listed design or vision as criteria, those findings are `in-contract` and gate
  normally, and the quality opinion still records the best-version gap without duplicating
  the verdict.
- Issue no contract-gate verdict when material evidence or decision criteria are insufficient.
  Name what would resolve the gap.

#### 3.2 Recheck identity and write the report

- Recheck the frozen target identity and the report path. Return to Phase 1 when the target changed or
  the path overlaps the target or a source-owned input.
- Write `report.md` from the [report template](report.md) at the bound path, and include Escalations,
  quality opinion, and finding fields. Add caller-required fields without replacing its target identity,
  independence, scope, method, result, gap, quality, or verdict meanings.
- Give each material result exact evidence and enough reproduction detail, and give each
  Optional Improvement a concise evidence-backed suggestion. Cite internal paths and external
  sources beside the claims they support.
- Return a short summary with the contract-gate verdict or reason none was issued, Problems,
  Optional Improvements, Strengths, Escalations, quality opinion, and unresolved evidence. Do
  not read another reviewing agent's `report.md` from the same iteration.

## References

| Name | Description |
|---|---|
| [Report template](report.md) | Default structure for a short, evidence-based review report. |
| [Ontology](../../ontology/SKILL.md) | Kinds, facets, test questions, and rules loaded in Step 1.3. |
| [Design Review ontology](ontology.md) | Domain questions for visual work, loaded in Step 1.3. |
| [Design Execution](../design-execution/SKILL.md) | Owns implementation, repair, verification, and the focused task commit. |
