# Evaluation Checklist

Mode: evaluation coverage register. Run style: do-confirm. The source stays unchecked. Audit a fresh filled copy
against one evaluation result. Each row resolves `PASS`, `FAIL:<finding-id>`, or `n/a:<property>` from inspected
evidence. Acceptance requires every applicable row to pass.

## Checks

- [ ] **EVAL-CK-01 [GATE] Context and subject fidelity.** Claim: the evaluation question, intended use, scope,
  complete subject, exact version, governing inputs, needed expertise, and relevant guidance agree.
  Applicability: unconditional. Pass: the evaluation brief, context record, and subject inventory reconcile
  without stale, partial, substituted, missing-expertise, or irrelevant-guidance evidence. Evidence: evaluation
  brief, context record, stable subject identity, and inventory. On fail: stop and rebind the evaluation context.
  Sources: Rules “stable, defined subject,” “known evaluation frame,” and “strongest available evidence”;
  Procedure 1; EVAL-SC-01.
- [ ] **EVAL-CK-02 [GATE] Independent qualified judgment.** Claim: the evaluator did not design, author, or
  implement the subject, has no stake in defending it, disclosed relevant limits, and recorded an independent
  judgment before reading another evaluator's conclusions. Applicability: unconditional. Pass: role history,
  disclosures, and access evidence prove independence and applicable competence. Evidence: independence
  statement, role history, conflict disclosure, and competence record. On fail: stop without a verdict.
  Sources: Rules “independent evaluator,” “full finding ledger,” and “evaluation separate from correction”;
  EVAL-SC-02.
- [ ] **EVAL-CK-03 [GATE] Declared criteria and evidence plan.** Claim: acceptance criteria, verdict thresholds,
  aggregation, claim-specific methods, expected signals, sampling, and limitations were fixed before results.
  Applicability: unconditional. Pass: every material claim has a discriminating evidence method and unchanged
  decision rule. Evidence: criteria and evidence plan, governing contracts, method rationale, and sampling
  record. On fail: stop and redesign or narrow the evaluation. Sources: Rules “stable, defined subject,”
  “strongest available evidence,” and “derive every result and verdict”; Procedure 2; EVAL-SC-03.
- [ ] **EVAL-CK-04 [GATE] Complete known frame.** Claim: every applicable known obligation has a selected,
  falsifiable scenario and atomic check with source, applicability, failure or pass condition, evidence, and
  on-fail route. Applicability: unconditional. Pass: the source-to-coverage trace has no material orphan and a
  cosmetically conformant subject can still fail the frame. Evidence: selected scenario and checklist frame,
  applicability record, and failability probe. On fail: add the missing or non-discriminating coverage before
  evaluation. Sources: Rules “known evaluation frame” and “complete every applicable scenario and check”;
  Procedure 3; EVAL-SC-04.
- [ ] **EVAL-CK-05 [GATE] Complete evidence-based execution.** Claim: every applicable prepared scenario and
  check was evaluated with a claim-appropriate direct method or the strongest safe alternative, and subject
  size or cost removed no required rigor. Applicability: unconditional. Pass: results, sources, methods, sample
  rationale, and limitations cover the complete selected frame. Evidence: per-case records, inspected evidence,
  executed methods, sampling assessment, and evidence gaps. On fail: keep the affected result unevaluable and
  return to the evidence plan. Sources: Rules “complete every applicable scenario and check,” “strongest
  available evidence,” and “preserve required rigor”; Procedure 2 and 4; EVAL-SC-05.
- [ ] **EVAL-CK-06 [GATE] Perspective investigation and frame expansion.** Claim: Project, Structure,
  Performance, Aesthetics, Usage, Consistency, Risk, and Overall were investigated after the prepared frame, and
  every material missed condition was added and evaluated. Applicability: unconditional. Pass: perspective
  investigation notes, added cases or checks, and any expanded sample close every discovered gap. Evidence:
  perspective inventory, investigation and expansion trace, and new results. On fail: reopen the frame and
  evaluate the missed condition before any verdict.
  Sources: Rules “search beyond the prepared frame,” “complete every applicable scenario and check,” and
  “incomplete or invalid result”; Procedure 5 and 6; EVAL-SC-06.
- [ ] **EVAL-CK-07 [GATE] Complete causal findings.** Claim: every concern separates expected and observed
  conditions, impact, supported cause or hypothesis, evidence, tested alternative, uncertainty, severity,
  confidence, and corrective direction. Applicability: conditional on any concern. Pass: the finding ledger and
  preserve list prove causal completeness without merging distinct hypotheses. Evidence: causal traces,
  alternative tests, findings, and strengths. On fail: repair the evaluation result before deriving a verdict.
  Sources: Rules “complete causal findings” and “full finding ledger”; Procedure 5; EVAL-SC-07.
- [ ] **EVAL-CK-08 [REQUIRED] Complete usable coverage.** Claim: every perspective, scenario, check, finding,
  strength, limitation, value, and evidence route is clear to a qualified cold reader without private or
  visual-position context. Applicability: unconditional. Pass: a cold read reproduces the coverage trace and
  intended meaning across the applicable consumers and environments. Evidence: perspective inventory, cold-read
  trace, and reproduction notes. On fail: open an Aesthetics, Usage, or Consistency finding. Sources: Rules
  “search beyond the prepared frame,” “complete causal findings,” “reproducible,” and “incomplete or invalid
  result”; Procedure 5–6; EVAL-SC-08.
- [ ] **EVAL-CK-09 [GATE] Complete fresh revision evaluation.** Claim: every materially changed subject is bound
  to a new stable identity and receives a complete independent evaluation with current criteria, frame,
  evidence, perspectives, findings, checks, and verdict. Applicability: conditional on material revision. Pass:
  prior results remain history and no acceptance evidence is carried forward without current proof. Evidence:
  old and new subject identities and the complete current evaluation. On fail: reject the current verdict.
  Sources: Rules “stable, defined subject,” “repeat the full applicable evaluation,” and “incomplete or invalid
  result”; Procedure 8; EVAL-SC-09.
- [ ] **EVAL-CK-10 [GATE] Reproducible verdict and bounded handoff.** Claim: the declared rules, completed checks,
  evidence, findings, strengths, limitations, and perspective results reproduce the final verdict, and the
  handoff neither changes the subject nor depends on one workflow format. Applicability: unconditional. Pass: a
  qualified independent reader derives the same substantive result, the subject comparison proves no evaluator
  mutation, and caller-specific mechanics stay outside the method. Evidence: derivation trace, complete result,
  reproduction record, and subject comparison. On fail: treat the evaluation as incomplete. Sources: Rules
  “derive every result and verdict,” “reproducible,” “evaluation separate from correction,” and “incomplete or
  invalid result”; Procedure 6–8; EVAL-SC-07 and EVAL-SC-10.

## Closure

Coverage closure requires a terminal evidence result for every row. One evaluation is conformant only when
every applicable gate and required item passes. Fluent prose, a complete-looking file, or a plausible verdict
cannot replace direct evidence.
