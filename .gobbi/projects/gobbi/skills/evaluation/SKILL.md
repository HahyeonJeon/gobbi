---
name: evaluation
description: "MUST load when finished work needs an independent, evidence-based judgment. Evaluation is an operation skill for lifecycle-boundary investigation, source execution, causal results, completion, and criteria-derived verdicts."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Evaluation

A fresh independent evaluator uses this operation when a design, plan, implementation, document, interface,
process, or other finished work needs an evidence-based judgment. The outcome is one reproducible evaluation
of the exact frozen subject and its observable results.

Evaluation first inventories the actual subject, then classifies and executes complete lifecycle-first or
legacy sources, challenges prepared coverage, reconciles evidence, and closes or stops without a verdict. Its
eight checkpoints prevent a prepared source from becoming the coverage ceiling.

Evaluation is read-only. It reports lifecycle coverage, Problems, Optional Improvements, Strengths and
Must-Preserve Conditions, and verdict derivation without changing the subject, source, criteria, result
disposition, or workflow gate.

## Principles

### Inspect actual work before prepared coverage can close it

Prepared sources and tests are evidence, not a ceiling. A provisional lifecycle inventory and a later
source-independent challenge keep the actual subject and its affected actors central.

### Require fresh independent judgment

The evaluator did not design, author, or implement the subject and has no stake in defending it. Conflicts,
limitations, missing evidence, and uncertainty stay visible rather than being filled with assumptions.

### Keep one evidence graph with distinct owners

Checklist owns authored source assertions and source closure; Evaluation owns observations, execution,
challenges, reconciliation, completion, results, and verdict evidence. Acceptance and workflow routing remain
separate from both.

### Explain causes only as far as evidence supports

A Problem connects an inspected observation to an expected outcome, impact, and supported cause or leading
hypothesis. Alternatives, evidence limits, missing evidence, and confidence make unknown causality explicit.

## Rules

- **MUST freeze exact inputs and establish independence before judging.** Inspect actual artifacts and state
  within a read-only boundary, and disclose every material conflict or limitation.
- **MUST classify each source by content in the exact Step 2.1 order.** Execute only a complete
  lifecycle-first or complete legacy signature and fail closed without repair, translation, or guessing for
  every other result.
- **MUST inspect every applicable condition, reuse context, test, lifecycle boundary, actor/form outcome, and
  material challenge.** Record exact supporting evidence and justify every exclusion or uncertainty.
- **MUST set `Evaluation completion: Complete` before deriving a verdict.** While a material coverage,
  identity, evidence, test, limitation, or unreconciled uncertainty remains open, name the blocker and issue
  no verdict.
- **MUST keep Problems, Optional Improvements, and Strengths distinct and evidenced.** Optional Improvements
  never contribute to a verdict, Strengths never cancel Problems, and each result has one semantic owner.
- **NEVER change the subject, source, tests, criteria, finding disposition, or workflow state.** A material
  premise change makes affected evidence historical and returns evaluation to the earliest invalidated
  checkpoint.

## Procedure

### Phase 1 — Freeze the Subject and Build a Provisional Inventory

#### 1.1 Checkpoint 1 — Establish independence and freeze exact inputs

- Confirm that the evaluator did not design, author, or implement the subject and has no producer role or
  stake in defending it. Disclose any relationship, conflict, access limit, sampling limit, or missing
  capability that could affect judgment.
- Freeze the exact subject identity and version or content hash; actual deliverables and observable state;
  supplied sources and tests with identities and hashes; intended outcomes; scope; requirements; governing
  evidence; known risks and prior failures; acceptance criteria, thresholds, and aggregation rules; and the
  read-only boundary.
- Separate produced outcomes from summaries, completion claims, missing results, and deferred work. Bind each
  supplied artifact or test to its provenance instead of trusting a label, filename, report, or status.
- Record material unknowns and the exact evidence or authority needed to resolve them. Stop when independence,
  identity, criteria, or a safe read-only boundary cannot be established.

#### 1.2 Checkpoint 2 — Inspect actual work and inventory lifecycle coverage

- Inspect the actual subject and returned outcomes before prepared source details may close coverage. Map
  actors, responsibilities, needs, interfaces, handoffs, product forms, boundaries, data or information flow,
  dependencies, state, failures, recovery, compatibility, operation, and terminal effects.
- Build a provisional inventory across Intent/Acquisition, Creation/Delivery, Adoption/Integration,
  Use/Operation, Change/Evolution, Support/Recovery, and Deprecation/Exit/Retirement. For each material
  boundary, record actor/form context, `development`, `product`, or `both`, `Applicable`, `N/A`, or
  `Uncertain`, and an inspected basis.
- Treat `both` as one normalized boundary and one coverage credit. Actor and form identities provide context;
  they do not create quotas, scenario ownership, or duplicate obligations.
- Inspect complete development and product lifecycle outcomes, including stages, transitions, handoffs,
  alternatives, failures, deficient-but-functioning behavior, recovery paths, exit, and terminal states.
  Unsupported `N/A` and material `Uncertain` records remain open.
- Keep the inventory provisional. Prepared sources and tests may support, contradict, refine, or add to it,
  but cannot erase an actual-subject obligation without inspected evidence.

### Phase 2 — Classify, Execute, and Challenge Prepared Coverage

#### 2.1 Checkpoint 3 — Bind and classify every source and test

- Bind each source and test to its exact identity, version, content hash, applicable subject, and collected
  source set. Record every passed and failed classification clause; path, filename, caller label,
  familiarity, or a word such as `lifecycle` never decides source kind.
- Classify each source in this exact order:

  1. **Lifecycle-first.** Require the exclusive `Source kind: lifecycle-first` marker, the exact H1 and front
     records, and all required sections once and ordered as Checklist's
     [physical source contract](checklist/SKILL.md#12-render-the-lifecycle-first-source-skeleton). Validate
     Checklist-owned [family and applicability meanings](checklist/SKILL.md#22-build-the-applicability-matrix),
     actor/form context, fields, IDs, conditional lines, exact `Views` enum, statuses with same-record bases,
     reference domains, warning rendering, and
     [source-closure coherence](checklist/SKILL.md#52-close-or-keep-open-the-source), with no legacy marker or
     legacy-only structure. A structurally valid Open source classifies as lifecycle-first and may be
     inspected, but its open source closure blocks Evaluation completion and verdict.
  2. **Legacy.** Require no lifecycle marker or lifecycle-only structure and every exact legacy clause below.
  3. **Mixed.** Classify as Mixed when any lifecycle-exclusive structure and any legacy-exclusive structure
     coexist; fail closed.
  4. **Partial/malformed.** Classify as Partial/malformed when one kind is declared or uniquely indicated but
     any required physical, semantic, conditional, status, identity, reference, or closure clause fails;
     report every failed clause and fail closed.
  5. **Ambiguous.** Classify as Ambiguous when bytes satisfy both full signatures, declarations conflict, or
     the content does not yield one unique result; report the conflict and fail closed.
  6. **Unknown.** Classify as Unknown when neither signature is complete and exclusive structure is
     insufficient; report observed markers and the exact evidence or authority needed, then fail closed.

- A complete legacy signature satisfies every clause:

  - It has exactly these H2 headings once and in this order: `Project`, `Structure`, `Performance`,
    `Aesthetics`, `Usage`, `Consistency`, `Risk`, and `Overall`, with no lifecycle-family or matrix heading.
  - Every scenario appears under its matching perspective, has
    `<OWNER>-SC-<PERSPECTIVE>-NN`, names exactly one literal class from `Normal case`, `Edge case`,
    `Expected failure`, `Poor quality`, `Rule violation`, or `Adversarial`, and retains the current prose form
    for context, expected outcome, and observable failure.
  - Every scenario has `#### Checklist`. Every unchecked row uses
    `<OWNER>-CK-<PERSPECTIVE>-NN-NN` matching its owner, perspective, and scenario ordinal, and every
    `Also applies` target resolves to an existing owner row in the collected applicable legacy source set,
    including valid cross-file references.
  - A perspective with no scenario has an evidence-based literal `Not applicable:` reason.
  - No lifecycle matrix field, family-owned new ID, source-closure field, or other lifecycle-first structure
    is mixed into the source.

- Only complete lifecycle-first and complete legacy sources proceed. Classification never repairs,
  normalizes, translates, drops, reorders, relocates, reclassifies, or guesses source content; a byte change
  makes earlier recognition evidence historical.
- Bind applicable tests by exact identity and status after source classification. A missing, substituted,
  stale, or indeterminate test identity stays open and cannot be silently excluded.

#### 2.2 Checkpoint 4 — Execute applicable source contexts and tests

- Execute every applicable lifecycle-first condition, actual reuse context, and expected test against the
  frozen subject. Preserve the source's live IDs and assertions, and write answers, evidence, limitations,
  and test results only in the Evaluation-owned view.
- Execute every recognized legacy source unchanged in its original order. Preserve its path, hash, headings,
  scenarios, literal classes, IDs, checklist rows, `Also applies` references, `Not applicable:` meaning,
  prose, governing context, and cross-file reuse; do not translate any element into lifecycle-first source
  identity.
- Inspect the actual state needed to answer each condition and test. Record exact supporting evidence,
  actual reuse context, and any sampling or access limit; do not treat the producer's completion claim or a
  prior report as an answer.
- Justify each Evaluation-side `N/A` from inspected exclusion evidence. Carry failures, conflicts,
  indeterminate answers, missing evidence, and contradictions into reconciliation without changing the
  source.

#### 2.3 Checkpoint 5 — Challenge the actual subject independently

- Return to the actual subject after source execution and challenge the provisional seven-family inventory
  without treating a prepared source or passing test as complete coverage.
- Ask about successful outcomes; limits and transitions; failure, rejection, containment, and recovery;
  materially deficient yet functioning outcomes; governing-constraint violations; and abuse, gaming, or
  cosmetic compliance. Split material differences in actor/form contract, boundary, trigger, expected or
  deficient outcome, or evidence measure.
- Optionally consult Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall as one
  weak unordered prompt card. Store no card use, order, provenance, completion, heading, tag, count, result
  class, or verdict input; a concern matters only after it enters the ordinary lifecycle/evidence view.
- For a legacy source, build a separate evaluator-owned lifecycle applicability and gap view that may
  reference unchanged legacy IDs. Never translate, rewrite, impersonate, or assign lifecycle-first source
  identities to legacy content.
- Add source-independent lifecycle gaps, evidence needs, and challenged exclusions to the Evaluation view.
  Return to Checkpoint 2 when the challenge exposes a missing actual-subject boundary or context premise.

### Phase 3 — Reconcile, Complete, Organize, Derive, and Hand Off

#### 3.1 Checkpoint 6 — Reconcile the complete evidence graph

- Reconcile the provisional inventory, authored source assertions, condition answers, actual reuse contexts,
  test results, source-independent additions, governing inputs, evidence, limitations, `N/A`, `Uncertain`,
  gaps, and causal uncertainty. Checklist assertions remain source-owned references; Evaluation owns its
  observations and reconciliation.
- Trace every material family, actor/form, boundary, expected and deficient outcome, live lifecycle-first or
  unchanged legacy ID, evaluator addition, test, governing input, evidence item, limitation, missing evidence,
  and result identity through one reproducible graph.
- When evidence conflicts, test the source assertion and plausible alternatives against actual state. Keep
  unsupported explanations as hypotheses with explicit uncertainty and confidence.
- Return to the earliest invalidated checkpoint when reconciliation exposes a wrong frozen premise,
  provisional boundary, classification, execution answer, test result, gap challenge, exclusion, or causal
  claim. Repeat every dependent checkpoint rather than patching only the final report.

#### 3.2 Checkpoint 7 — Set completion or stop without a verdict

- Set `Evaluation completion: Complete` only when every material obligation, source context, test, lifecycle
  challenge, identity, reference, exclusion, uncertainty, evidence need, limitation, and causal question is
  reconciled enough for the supplied criteria to apply reproducibly.
- Keep `Evaluation completion: Open` when source closure is Open; a material boundary is `Uncertain`; an
  `N/A` lacks inspected support; an `Applicable` obligation is untraced; an identity, reuse target, or source
  kind is unresolved; required evidence or a test is missing; or a material coverage or causal uncertainty
  remains unreconciled.
- For Open completion, name every blocker, affected lifecycle references, present evidence, missing evidence
  or authority, and the earliest checkpoint for recovery. Issue no verdict, not even a provisional one.
- Completion does not mean acceptance and does not close a workflow gate. Counts, percentages, source
  closure, producer approval, evaluator confidence alone, or a passing subset cannot substitute for literal
  Evaluation completion.

#### 3.3 Checkpoint 8 — Organize results, derive the verdict, and hand off

- After completion is Complete, organize one human-readable result in this order:

  1. **Evaluation Identity and Independence** — frozen subject, sources/tests and hashes, evaluator
     independence, criteria, methods, read-only boundary, limitations, uncertainties, reproduction details,
     and `Evaluation completion: Complete`.
  2. **Lifecycle Coverage Summary** — family, actor/form, boundary, expected/deficient outcome, source/test,
     evidence, limitation, and result-ID references without duplicating result definitions.
  3. **Problems** — unmet outcomes, requirements, or acceptance conditions.
  4. **Optional Improvements** — evidenced ways to improve work that is currently acceptable.
  5. **Strengths and Must-Preserve Conditions** — verified outcomes and the exact conditions later work must
     retain.
  6. **Verdict Derivation** — supplied criteria, contributing Problem IDs, thresholds, aggregation, and the
     reproducible result.

- Define each result once and reference it from every affected lifecycle entry. Split results when the
  observation or supported cause differs; consolidate only the same observation with the same supported
  cause while retaining all provenance.
- For each Problem, state the expectation, inspected observation, impact, supported cause or leading
  hypothesis, challenged alternatives, evidence limits, missing evidence, calibrated confidence, and a
  prevention-oriented suggested direction. Unknown causality stays explicit and never becomes a convenient
  root-cause claim.
- For each Optional Improvement, state the acceptable current condition and evidenced benefit and cost. For
  each Strength, state the verified outcome, evidence, and exact Must-Preserve Condition.
- Derive a verdict only from supplied acceptance criteria, thresholds, and aggregation rules. When the current
  evaluator-role defaults apply, a contributing Critical Problem with confidence at least 75 yields `FAIL`;
  otherwise a contributing High Problem with confidence at least 50 yields `REVISE`; otherwise the
  problem-derived verdict is `PASS`.
- Keep every contributing Problem visible. Optional Improvements never contribute to a verdict, Strengths
  never cancel Problems, and a workflow's separate gate remains authoritative for its own routing.
- Hand off the complete result without changing the subject, source, tests, criteria, findings, dispositions,
  acceptance state, or workflow state. A caller may wrap the human-readable result in its owned report or
  storage contract without changing Evaluation meaning.
- If any frozen subject, source byte, test, governing input, criterion, artifact, or observable state changes
  materially before use, mark affected evidence and verdict history, freeze the changed premise, and resume
  at the earliest affected checkpoint.

## References

- [Checklist](checklist/SKILL.md) owns lifecycle-first unchecked source authoring, exact source grammar,
  applicability meanings, live-reference rules, warning review, and source closure.
