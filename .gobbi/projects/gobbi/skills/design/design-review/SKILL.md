---
name: design-review
description: "Design Review is an operation for independent critique of one frozen visual subject and for writing an evidence-based report plus working checklist."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch
skill-type: operation
---

# Design Review

Design Review binds and freezes one visual subject, reviews it without a checklist, prepares and runs a
review-owned working checklist, reconciles, and writes `report.md` plus working `checklist.md`.
Use it after one exact stable visual subject is ready for independent review and before an acceptance or workflow decision.
The caller assigns a fresh matching-specialist agent and does not reuse the producer. It does not modify
the target, source checklists, or decision state.

This skill is a draft adapted from Evaluation.

## Principles

### Criticize the frozen target before any checklist

Inspect and freeze the actual visual subject, then criticize it, then prepare checklist coverage.
A prepared item list must not define what the reviewing agent looks at first.

### Find useful improvements as well as problems

Review should show how an acceptable subject can become better, not stop after identifying failures.
Record evidence-backed improvement points with practical suggestions, while keeping them separate from
Problems and verdicts.

### Keep the review independent and preserve its inputs

The reviewing agent should have no producer role or interest in defending the subject. Write only review-owned
`report.md` and working `checklist.md` while preserving the target, source checklists, criteria, and
workflow state.

### Support each judgment with direct evidence

Connect every result to the expected condition, observed state, impact, and evidence. State uncertainty and
limit causes and verdicts to what the evidence supports.

## Rules

- **MUST bind the exact target, scope, intended results, supplied decision criteria, both
  review output paths, and any caller-supplied `review-depth` before the critical
  review.** Confirm neither output overlaps the target or a source-owned input, and stop
  when identity, access, independence, or preservation cannot support a responsible
  review.
- **MUST criticize the frozen target before preparing or loading any checklist.** Record the
  results from the review-owned prompts and the current project design and vision
  without traversing any checklist item source.
- **MUST prepare one review-owned working checklist from applicable existing sources and
  necessary study, freeze it before any item is answered, then evaluate every applicable item
  against the frozen target.** Load the standalone Checklist operation before authoring a new
  item; reusing existing items alone does not load it.
- **MUST label every Problem and Improvement `in-contract` or `out-of-contract`, and derive
  the gate verdict only from in-contract Problems, sufficient evidence, and caller-supplied
  criteria.** Record a quality opinion against current project design and vision that never
  changes that verdict.
- **NEVER change the target, source checklists, supplied criteria, acceptance state, or
  workflow state.** Write only the review-owned `report.md` and `checklist.md`.

## Procedure

### Phase 1 — Understand and bind the target

#### 1.1 Bind the target and review boundary

- Confirm that the reviewing agent did not design, author, or implement the target, and disclose any
  relationship, interest, access limit, or missing capability that could affect independent
  judgment. Do not read another reviewing agent's `report.md` or `checklist.md` from the same
  iteration.
- Bind the exact artifact, state, version, or content hash; scope; intended results;
  caller-supplied decision criteria; both review-owned paths: `report.md` and working
  `checklist.md`; and any caller-supplied `review-depth`. Confirm that neither path
  overlaps the target or a source-owned input, and that the reviewing agent does not write
  `gate.md`.
- Stop when identity, access, independence, or preservation cannot support a responsible
  review. Absent decision criteria allow a report and forbid a contract-gate verdict.

#### 1.2 Inspect the actual target

- Inspect the artifacts and observable behavior before reading completion claims, prepared reports, or
  prepared checklists. Distinguish delivered results from claims, deferred work,
  missing results, and unavailable state.
- Trace the target's relevant structure, dependencies, interfaces, states, transitions,
  failures, recovery, and consumer paths. Follow only the contexts that can change an expected
  result or its evidence.
- Record verified facts, open questions, assumptions, and evidence gaps, and do not record
  Problems yet. Return to Step 1.1 when inspection changes the target identity, scope,
  intended result, or decision criteria.

#### 1.3 Study the quality bar and freeze the target

- Load, in this order, whichever exist: current design memory under the project's
  `memory/design/`; project vision, philosophy, architecture, and governing decisions; and
  accepted session design. Use a startup draft only when it is the accepted current design.
- Record missing bar sources as a Gap and never invent a vision. Never add these sources to
  gate criteria unless the caller listed them.
- Freeze the exact artifact, state, version, or content hash only when that state is stable;
  stop instead of freezing an unstable target. After this freeze, Phase 2 may criticize and
  Phase 3 may prepare a checklist, and neither may mutate the target.

### Phase 2 — Review the target critically

#### 2.1 Criticize the frozen target without a checklist

- Run these review-owned prompts; they are not checklist items and must not become report
  taxonomy. When `review-depth` is bound, apply them only inside that depth.

  | Prompt | Ask about |
  |---|---|
  | **Project design and vision** | The frozen target contradicts or drifts from current design, vision, philosophy, architecture, or accepted session design. What those sources omit. |
  | **Best version and gap** | The distance between this target and the best version a competent owner would produce for the same purpose and constraints. |
  | **Failure, gaming, and cosmetic compliance** | The target fails, is exploited at a boundary, or satisfies the form of a requirement while missing the result. |
  | **Absences across the target's life** | What is missing rather than wrong: an unowned consequence, an unhandled state, or a later stage no one covers. |

- Challenge the frozen target with the scenario spectrum in [Checklist](../../checklist/SKILL.md)
  Step 2.3 by link, not as a working-checklist walk. Do this after prompts 3 and 4.
- Do not load or traverse reusable checklist sources, caller-supplied checklists, prior
  review item lists, or the working checklist.

#### 2.2 Record the critical-review results

- Record labeled Problems, Improvements, Strengths, gaps, and coverage leads using the
  [report template](report.md) field meanings. Coverage leads are study candidates
  for Phase 3, not working items.
- Label every Problem and Improvement `in-contract`, citing the criterion or bound intended
  result, or `out-of-contract`, citing the governing source; when `review-depth` is bound,
  in-contract labeling follows the supplied token and the target skill's purpose and boundary.
  Missing implementation detail at `ideation-design` or `planning-decomposition` is not an
  in-contract Problem, and Phase 2 may still record out-of-contract Improvements for polish;
  a Problem that maps to a supplied criterion must be `in-contract`, and an out-of-contract
  result with no cited governing source is not a Problem and must be demoted to an Improvement
  or dropped.
- Return to Phase 1 if this review changes the bound target or review boundary.

### Phase 3 — Prepare, freeze, run, and reconcile

#### 3.1 Gather sources

- Collect applicable project and caller-supplied checklists, including the
  [Design Review checklist](checklist.md) for visual work.
  When `review-depth` is bound, gather baselines only at that depth: a current indexed
  Ideation or Planning result at `ideation-design` or `planning-decomposition` uses its own
  checklist, not this domain checklist, and mixed work under `by-owning-stage` applies
  each matching baseline to the artifact class it owns.
- Preserve every source's wording, hierarchy, identifiers, and unchecked state. Do not repair
  or rewrite a source during review.
- Record each excluded, ambiguous, stale, conflicting, or unavailable source item with its
  reason and effect on coverage.

#### 3.2 Re-challenge coverage and author study-backed items

- Copy each source coverage account into the working checklist as a source claim. When a
  reused source has no account, challenge the frozen target with the Checklist spectrum and
  stage tables in [Checklist](../../checklist/SKILL.md) Steps 2.1–2.3, record the missing account
  as a Limit, and do not invent a source account.
- Treat Phase 2 coverage leads as study candidates, and study internal evidence and current
  primary external sources when they settle an uncovered expectation or risk. Load
  [Checklist](../../checklist/SKILL.md) only before authoring a new working item, and add a
  working item only from that study evidence.
- Do not add items to fill a category, count, or account row.

#### 3.3 Freeze the working checklist

- Confirm membership, wording, source identity, exclusions, copied accounts, and additions.
  An item-free working checklist still has the required header, Sources, Coverage, Additions,
  Limits, and an explicit no-applicable-items reason.
- Confirm that no item has been answered and that items do not trace only to Phase 2 notes,
  then freeze membership, wording, and source identity. A working copy that traces only to
  Phase 2 notes has failed the checklist pass.
- Begin the item pass only after this freeze. A later material coverage gap returns to
  Step 3.2, adds only study-supported items, re-freezes, and reruns every applicable item.

#### 3.4 Evaluate every applicable item

- Evaluate every applicable frozen item against the frozen target with safe non-mutating
  inspections, reproductions, tests, or measurements. Record the observations, exact evidence,
  limitations, and uncertainty needed to support the material results.
- Record one Result per item: `problem-present`, `no-problem-found`, `not-applicable` with a
  subject reason, or `evidence-insufficient`. Checked means the problem is present; an empty
  checkbox is not `no-problem-found`.
- Record Problems, Improvements, and Strengths independently of Phase 2, including
  contradictions, using the [report template](report.md) field meanings. Unique
  checklist-only Problems are not a pass condition for critique-first.

#### 3.5 Short reconcile

- Keep unique Problems from Phase 2 and from Step 3.4. Do not drop either side.
- If Phase 2 and the checklist pass contradict on the same expectation, re-inspect the frozen
  target. If the contradiction survives, it is a Gap that blocks a verdict on the affected
  criterion.
- Do not treat this Step as a second whole-target critique.

#### 3.6 Apply caller criteria and set opinions

- Apply caller-supplied criteria, thresholds, and aggregation once to in-contract Problems
  only. Optional Improvements, Strengths, out-of-contract Problems, and the quality opinion
  do not change the contract-gate verdict.
- Set the quality opinion to `meets-design`, `mixed`, `does-not-meet`, or `not-available`. If
  the caller listed design or vision as criteria, those findings are `in-contract` and gate
  normally, and the quality opinion still records the best-version gap without duplicating
  the verdict.
- Issue no contract-gate verdict when material evidence or decision criteria are insufficient,
  including `evidence-insufficient` on an item material to a criterion. Name what would
  resolve the gap.

### Phase 4 — Report the review

#### 4.1 Recheck identity and write the working checklist

- Recheck the frozen target identity and both review-owned output paths. Return to Phase 1
  when the target changed or a path overlaps the target or a source-owned input.
- Write `checklist.md` at the bound path with the required header, Sources, Coverage, Additions,
  Limits, and item results. Do not copy it into a skill.
- Confirm the file is a regular non-empty file. An item-free file still carries the required
  header, Sources, Coverage, Additions, Limits, and no-applicable-items reason.

#### 4.2 Write the report and return

- Write `report.md` from the [report template](report.md) at the bound path, cite
  the sibling working `checklist.md`, and include Escalations, quality opinion, and finding fields.
  Add caller-required fields without replacing its target identity, independence, scope,
  method, result, gap, quality, or verdict meanings.
- Give each material result exact evidence and enough reproduction detail, and give each
  Optional Improvement a concise evidence-backed suggestion. Cite internal paths and external
  sources beside the claims they support.
- Return a short summary with the contract-gate verdict or reason none was issued, Problems,
  Optional Improvements, Strengths, Escalations, quality opinion, and unresolved evidence. Do
  not read another reviewing agent's `report.md` or `checklist.md` from the same iteration.

## References

| Name | Description |
|---|---|
| [Checklist](../../checklist/SKILL.md) | Standalone operation for reusable sources, coverage accounts, and the scenario spectrum this review challenges by link. |
| [Design Review checklist](checklist.md) | Design Review-owned baseline source for reviewing general visual-work quality.
| [Report template](report.md) | Default structure for a short, evidence-based review report with dual-record fields. |
| [Design Execution](../design-execution/SKILL.md) | Consumes the base checklist for self-review and owns implementation, repair, verification, and the focused task commit. |
