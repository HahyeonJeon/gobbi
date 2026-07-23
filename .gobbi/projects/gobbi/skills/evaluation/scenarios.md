# Evaluation Scenarios

This source exercises [SKILL.md](SKILL.md). It tests whether one independent evaluator can produce a complete,
evidence-derived, reproducible judgment across domains. It does not add domain criteria, workflow mechanics,
machine schemas, or output paths.

## Coverage register

| Category | Disposition | Seed |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | EVAL-SC-01 |
| 2 Actors / stakeholders / use-context | selected | EVAL-SC-02 |
| 3 Behavior / state / data | selected | EVAL-SC-03 |
| 4 Interfaces / dependencies / structure | selected | EVAL-SC-04 |
| 5 Quality attributes / resource economics | selected | EVAL-SC-05 |
| 6 Failure / recovery / operations | selected | EVAL-SC-06 |
| 7 Trust / harm / governance | selected | EVAL-SC-07 |
| 8 Inclusion / locale | selected | EVAL-SC-08 |
| 9 Change / compatibility / reversibility | selected | EVAL-SC-09 |
| 10 Evidence / traceability / clarity | selected | EVAL-SC-10 |

Scale threshold: split above 12 families or 40 selected category-by-type cells.

## EVAL-SC-01 — The evaluation binds the right question to one complete subject

- Primary category: 1. Primary type: Positive. Secondary: Adversarial.
- Coverage role: correct evaluation context; subject substitution.
- Source: Rules “stable, defined subject,” “known evaluation frame,” and “strongest available evidence”;
  Procedure 1.
- Given: an evaluation request, intended use, subject with a stable version, requirements, scope, exclusions,
  available evidence, and several possible sources of specialized guidance.
- When: the evaluator builds the evaluation brief, subject inventory, and context record.
- Then: the question, intended decision, complete subject, needed expertise, relevant guidance, and governing
  inputs agree, and no stale or unrelated artifact supplies evidence.
- Failure oracle: an unbounded question, partial subject, wrong version, irrelevant guidance, missing expertise,
  or substituted evidence is accepted.
- Evidence: evaluation brief, context record, stable subject identity, and subject inventory.
- Adversarial face: every referenced artifact exists, but one belongs to another version or subject.
- Obligation: evaluation must bind completely and exclusively to the question and subject it judges.
- Checklist: EVAL-CK-01.

## EVAL-SC-02 — The evaluator is independent and qualified for the judgment

- Primary category: 2. Primary type: Negative. Secondary: Adversarial.
- Coverage role: valid independent judgment; creator or peer contamination.
- Source: Rules “independent evaluator,” “full finding ledger,” and “evaluation separate from correction.”
- Given: the evaluator's role history, relationship to the subject, relevant competence, conflicts, and prior
  exposure to other conclusions.
- When: independence and competence limits are checked before substantive review.
- Then: the evaluator created none of the subject, has no stake in defending it, records relevant limitations,
  and reaches an independent judgment before reading another evaluator's conclusions.
- Failure oracle: self-review supplies acceptance, a conflict is hidden, a needed domain competence is absent, or
  another conclusion primes the evaluator.
- Evidence: independence statement, role history, conflict disclosure, and competence record.
- Adversarial face: a new evaluator receives a summary that embeds another evaluator's conclusions.
- Obligation: the result must expose an independent and appropriately qualified reasoning path.
- Checklist: EVAL-CK-02.

## EVAL-SC-03 — Criteria and verdict rules are fixed before results

- Primary category: 3. Primary type: Boundary. Secondary: Counterfactual, adversarial. The exact transition is
  before the first evidence result is recorded versus after results are visible.
- Coverage role: declared acceptance boundary; result-driven threshold change.
- Source: Rules “stable, defined subject,” “derive every result and verdict,” and “strongest available evidence”;
  Procedure 2.
- Given: outcomes, requirements, constraints, risks, governing standards, several evidence methods, and no
  universal scoring formula.
- When: the evaluator defines acceptance criteria, `PASS`/`REVISE`/`FAIL` boundaries, aggregation, and the
  claim-to-evidence plan.
- Then: each material claim has a suitable method and expected signal, and the decision rules are recorded
  before the evidence results are known.
- Failure oracle: a criterion has no discriminating evidence, an outcome is reduced to an easy proxy, or a
  threshold changes after an inconvenient result appears.
- Evidence: criteria and evidence plan, declared verdict rules, method rationale, and known limitations.
- Adversarial face: the same evidence is called sufficient only after it produces the preferred verdict.
- Obligation: judgments must use predeclared, claim-appropriate criteria and evidence methods.
- Checklist: EVAL-CK-03.

## EVAL-SC-04 — The known frame covers applicable scenarios and atomic checks

- Primary category: 4. Primary type: Positive. Secondary: Adversarial.
- Coverage role: complete prepared frame; cosmetic coverage.
- Source: Rules “known evaluation frame” and “complete every applicable scenario and check”; Procedure 3.
- Given: governing obligations, domain scenario and checklist sources, target-specific actors, boundaries,
  dependencies, failures, harms, changes, and assumptions.
- When: the evaluator selects and freezes the prepared scenario and checklist frame.
- Then: every applicable obligation has an observable scenario and atomic check with source, applicability,
  failure or pass condition, evidence method, and on-fail route.
- Failure oracle: a material obligation has no case or check, an irrelevant item is treated as applicable, or a
  present heading substitutes for a falsifiable condition.
- Evidence: selected scenario and checklist frame, applicability record, and source-to-coverage trace.
- Adversarial face: the frame contains all expected labels but no case can fail a cosmetically conformant subject.
- Obligation: the prepared frame must be complete, applicable, and falsifiable before results are recorded.
- Checklist: EVAL-CK-04.

## EVAL-SC-05 — Known cases use the strongest evidence their claims require

- Primary category: 5. Primary type: Positive. Secondary: Failure/recovery, adversarial.
- Coverage role: proportionate evidence; cost or sample pressure.
- Source: Rules “complete every applicable scenario and check,” “strongest available evidence,” and “preserve
  required rigor”; Procedure 2 and 4.
- Given: a large or costly subject, a mixture of direct and proxy evidence, and a justified sample where complete
  inspection is impractical.
- When: the evaluator runs every applicable prepared case and records the actual observations and limits.
- Then: each result rests on a suitable direct method or the strongest safe alternative, representative classes
  and complete processes are covered, and cost changes technique rather than required rigor.
- Failure oracle: a proxy proves a stronger claim than it can support, a required case is skipped, or sampling
  excludes a materially different class without justification.
- Evidence: per-case results, inspected sources, executed methods, sample rationale, and evidence-gap record.
- Adversarial face: a green summary hides a failed direct check or an unrepresented high-risk class.
- Obligation: every known result must be supported by claim-appropriate evidence and honest limits.
- Checklist: EVAL-CK-05.

## EVAL-SC-06 — Perspective investigation expands an incomplete frame

- Primary category: 6. Primary type: Failure/recovery. Secondary: Adversarial.
- Coverage role: missed condition discovery; recovery from an incomplete frame.
- Source: Rules “search beyond the prepared frame,” “complete every applicable scenario and check,” and
  “incomplete or invalid result”; Procedure 5 and 6.
- Given: a prepared frame that passes but a whole-subject perspective investigation exposes a new actor,
  interaction, failure, risk, or sample class.
- When: the evaluator investigates the subject from Project through Overall and tests whether the prepared frame
  covered the new condition.
- Then: a target-specific scenario or check is added, evaluated with suitable evidence, and included in coverage
  closure before any verdict.
- Failure oracle: the new condition is mentioned only in prose, ignored because the prepared checks passed, or
  used in a verdict without entering the evaluated frame.
- Evidence: perspective investigation notes, added case or check, expanded sample if needed, and its result.
- Adversarial face: a random sample reveals a new failure type after the structured sample appears clean.
- Obligation: out-of-frame discovery must expand and rerun the applicable evaluation instead of remaining an
  informal observation.
- Checklist: EVAL-CK-06.

## EVAL-SC-07 — Findings distinguish root causes from symptoms

- Primary category: 7. Primary type: Adversarial. Secondary: Counterfactual.
- Coverage role: causal finding; plausible false positive or symptom patch.
- Source: Rules “complete causal findings,” “full finding ledger,” and “evaluation separate from correction”;
  Procedure 5.
- Given: an observed violation with several plausible causes, an obvious symptom-level patch, and a material
  strength that later work could accidentally remove.
- When: the evaluator investigates the cause, tests alternatives, records uncertainty, and proposes a corrective
  direction without changing the subject.
- Then: the finding separates observation, impact, cause or hypothesis, evidence, alternative explanation,
  severity, confidence, and correction direction; the preserve condition records the verified strength.
- Failure oracle: a symptom is labeled the root cause, an alternative is not tested, uncertainty is hidden,
  distinct causal hypotheses are merged, or the evaluator applies the correction.
- Evidence: causal trace, alternate-explanation test, finding ledger, preserve list, and unchanged subject.
- Adversarial face: weakening the failed check makes the symptom disappear while the underlying harm remains.
- Obligation: findings must support root-cause correction while preserving independent review authority.
- Checklist: EVAL-CK-07, EVAL-CK-10.

## EVAL-SC-08 — Coverage and results remain usable across consumers

- Primary category: 8. Primary type: Alternative-valid. Secondary: Adversarial.
- Coverage role: cold-reader and assistive use; ambiguous or context-dependent evidence.
- Source: Rules “search beyond the prepared frame,” “complete causal findings,” “reproducible,” and “incomplete or
  invalid result”; Procedure 5–6.
- Given: perspective notes, scenario and checklist results, findings, paths, commands, dates, values, and evidence
  limitations intended for consumers with different contexts and access needs.
- When: a qualified cold reader follows the coverage trace and challenges the result without private discussion
  or visual-position assumptions.
- Then: every perspective is covered once, terminology and values are unambiguous, evidence is navigable, and
  each result can be understood and reproduced in its stated environment.
- Failure oracle: a missing perspective, visual-only reference, ambiguous value, unexplained ID, inaccessible
  evidence route, or private context is required.
- Evidence: cold read, perspective inventory, trace walk, and reproduction notes.
- Adversarial face: reordering the document makes “see above” evidence point at the wrong claim.
- Obligation: the completed evaluation must remain clear and usable across qualified consumers and environments.
- Checklist: EVAL-CK-08.

## EVAL-SC-09 — A material revision receives a complete fresh evaluation

- Primary category: 9. Primary type: Change/regression/compat. Secondary: Adversarial.
- Coverage role: changed subject; stale acceptance evidence.
- Source: Rules “stable, defined subject,” “repeat the full applicable evaluation,” and “incomplete or invalid
  result”; Procedure 8.
- Given: a materially changed subject, an earlier evaluation, and current requirements and evidence.
- When: subject identities, criteria, domains, scenarios, checks, perspectives, findings, and evidence are
  compared.
- Then: the new version receives a complete independent evaluation with current evidence, while the older result
  remains history only.
- Failure oracle: prior passes, checklist results, findings, samples, or verdicts are carried forward without
  current proof.
- Evidence: old and new subject identities, current frame and evidence, and complete new result.
- Adversarial face: only the previously failing case is rerun after a correction affects another perspective.
- Obligation: a material revision must not inherit acceptance evidence from an older subject.
- Checklist: EVAL-CK-09.

## EVAL-SC-10 — The final verdict is reproducible and handed off without correction

- Primary category: 10. Primary type: Positive. Secondary: Counterfactual, adversarial.
- Coverage role: reproducible derivation; preferred verdict or hidden workflow dependency.
- Source: Rules “derive every result and verdict,” “reproducible,” “evaluation separate from correction,” and
  “incomplete or invalid result”; Procedure 6–8.
- Given: the stable subject, evaluation brief, declared criteria, evidence plan, completed frame, findings,
  strengths, limitations, perspective results, and caller-specific output needs.
- When: a qualified reader reproduces the results and verdict, then inspects the handoff boundary.
- Then: the same verdict follows from the declared rules and evidence, the result is self-contained, the subject
  is unchanged, and caller-specific formatting or storage is added outside the general method.
- Failure oracle: intuitive scoring, hidden evidence, missing limitation, applied correction, or a machine schema
  is required to understand the substantive judgment.
- Evidence: derivation trace, complete evaluation result, reproduction record, and unchanged subject.
- Adversarial face: the verdict is softened because the correction seems easy or a caller rejects the result's
  optional format.
- Obligation: evaluation must end in a reproducible semantic result that remains independent of workflow
  mechanics and correction authority.
- Checklist: EVAL-CK-10.

## Omission sweep

Every load-bearing parent rule maps to at least one seed and check. Target-specific cases extend the filled
frame; they do not modify this source.
