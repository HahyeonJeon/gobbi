---
name: evaluation
description: MUST load for EVALUATION. Produces one fresh independent seven-perspective-plus-Overall report, finding ledger, completed checklist, and evidence-derived verdict.
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Evaluation

Use this skill whenever a design, plan, implementation, document, interface, process, or other work needs an independent, evidence-based judgment. Evaluation compares the work and the evidence behind it with its intended outcome, governing requirements, and applicable checks across Project, Structure, Performance, Aesthetics, Usage, Consistency, Risk, and Overall. It ends with a complete finding ledger, a checklist resolved from inspected evidence, and a verdict that explains what passes, what must change, what fails, and why.

## Principles

### Use an independent evaluator

Use an evaluator who did not design, author, or implement the subject and has no stake in defending it.
Creators may self-check their work, but they cannot issue its independent acceptance verdict. Disclose any
conflict or limitation that could bias the judgment.

### Evaluate known obligations through scenarios and checks

Turn known outcomes, requirements, decisions, risks, prior failures, and standards into concrete scenarios and
atomic checks. Cover normal and alternative paths, invalid and boundary conditions, failure and recovery,
harmful use, regressions, and load-bearing assumptions when relevant. Define observable failure and required
evidence for each case. Run every applicable case before the verdict; missing evidence is a gap, not a pass.

### Search beyond the prepared evaluation frame

Prepared scenarios and checks cover expected risks, not every important condition. After completing them,
inspect the whole subject across purpose, structure, performance, presentation, use, consistency, risk, and
their interactions. Look for missing actors, states, dependencies, assumptions, harms, failure modes, and
regressions. Evaluate each material gap and add it to the frame.

### Find the root cause

State what was expected, what happened, why it matters, and what caused it. Test other plausible explanations
before naming the cause. If evidence is incomplete, record the leading hypothesis, uncertainty, and missing
evidence. Recommend a correction that prevents recurrence instead of hiding the symptom or weakening the check.

### Make the result reproducible

Record the exact subject and version, scope, evaluator independence, methods, scenarios, checks, evidence,
results, findings, strengths, limits, uncertainties, and verdict reasoning. Make each finding locate the
condition and explain its impact, cause, and corrective direction. Write enough for another qualified evaluator
to reproduce, challenge, and use the judgment; detail serves traceability, not length.

## Rules

Evaluation applies from the moment the subject, scope, and evaluation question are fixed through a documented
verdict. It owns the review frame, evidence standard, findings, completed checks, and reasoned verdict.
Decisions and corrections after the verdict remain outside evaluation.

### Must-Follow

- **MUST evaluate one stable, defined subject.** Identify its exact version, intended outcome, scope,
  requirements, exclusions, and acceptance criteria before review. Stop and bind the evaluation to the new
  version if the subject changes.
- **MUST use an independent evaluator.** The evaluator did not design, author, or implement the subject and has
  no stake in defending it. Record the independent judgment before reading another evaluator's conclusions,
  and disclose any conflict or limitation that could bias the result.
- **MUST build the known evaluation frame.** Turn intended outcomes, requirements, decisions, risks, prior
  failures, and applicable standards into scenarios and checks. Cover normal and alternative paths, invalid and
  boundary conditions, failure and recovery, harmful use, change, and load-bearing assumptions when relevant.
- **MUST complete every applicable scenario and check.** Give each scenario an observable failure condition and
  each check an atomic pass condition with named evidence. Resolve each applicable check as `PASS`,
  `FAIL:<finding-id>`, or `n/a:<property>` from inspected evidence; missing or unevaluable evidence is a gap,
  not a pass.
- **MUST search beyond the prepared frame.** Inspect Project, Structure, Performance, Aesthetics, Usage,
  Consistency, Risk, and Overall, including their interactions. Add and evaluate a target-specific scenario or
  check for every material condition the prepared frame missed.
- **MUST use the strongest available evidence.** Inspect the actual subject and supporting artifacts, run safe
  checks when useful, prefer direct evidence over proxies, record exact sources and methods, and state every
  material limitation or uncertainty.
- **MUST write complete causal findings.** State what was expected, what was observed, why it matters, the
  supported root cause or leading hypothesis, the evidence, the alternative explanation tested, and the
  corrective direction. Keep findings separate when their cause hypotheses differ.
- **MUST preserve the full finding ledger.** Record supported concerns and confirmed strengths even when they
  are low-confidence or non-blocking. Confidence and severity change force, not visibility; preserve finding
  authorship and provenance when more than one evaluator contributes.
- **MUST derive every result and verdict.** Resolve checks from evidence and calculate each perspective and
  Overall result from declared criteria and thresholds. Never substitute intuition, convenience, or the ease of
  correction for the derivation.
- **MUST make the result reproducible.** Record the exact subject and version, scope, evaluator independence,
  methods, scenarios, checks, evidence, results, findings, strengths, limitations, uncertainties, and verdict
  reasoning so another qualified evaluator can reproduce and challenge the judgment.
- **MUST keep evaluation separate from correction.** The evaluator may recommend a corrective direction but
  does not edit the subject, implement a correction, change the acceptance criteria, or make a decision reserved
  for the subject's owner.
- **MUST repeat the full applicable evaluation after material change.** Bind the result to the new version and
  repeat every required perspective, scenario, check, finding, and verdict with current evidence. Prior results
  remain history, not proof for the changed subject.
- **MUST treat an incomplete or invalid result as no result.** A missing perspective, malformed finding,
  unresolved check, stale evidence or provenance, or inconsistent verdict blocks acceptance until the complete
  evaluation is rerun or repaired.
- **MUST preserve required rigor under constraints.** Time, cost, or subject size may change the evaluation
  method, but cannot remove required evidence, perspectives, scenarios, checks, or repeat review.

### Must-Not-Follow

- **NEVER treat self-review as independent evaluation.** A creator may inspect their own work, but their judgment
  cannot supply the independent verdict.
- **NEVER present a partial, substituted, or changing subject as a complete evaluation.** Evaluate the defined
  subject and its applicable supporting evidence, or state exactly why the evaluation cannot proceed.
- **NEVER infer a pass from missing or proxy evidence.** File existence, a green summary, a creator's claim, or
  an expected result does not prove the underlying property.
- **NEVER let prepared scenarios or checks limit the search.** Use them as the known coverage floor, then look
  for material actors, states, dependencies, assumptions, interactions, harms, and failure modes they missed.
- **NEVER present a symptom or unsupported assumption as the root cause.** Test plausible alternatives, state
  uncertainty when the cause is not proven, and reject corrections that only hide the symptom or weaken a check.
- **NEVER combine findings only because their wording or symptoms are similar.** Preserve distinct cause
  hypotheses, evidence, authorship, and provenance.
- **NEVER hide or soften a supported finding to reach a preferred verdict.** Low confidence, low severity, an
  easy correction, cost pressure, or disagreement changes neither the evidence nor its visibility.
- **NEVER apply findings or make owner decisions during evaluation.** Preserve the evaluated subject and hand
  off findings, recommendations, limitations, and the verdict for the authorized next decision.
- **NEVER reuse acceptance evidence after a material change.** Evaluate the changed subject with current
  evidence instead of carrying forward prior passes, resolved checks, or addressed findings.

## Procedure

### 1. Establish the evaluation context and needed expertise

Read the evaluation request, current subject, intended outcome, governing requirements, prior decisions,
relevant history, and available evidence. Identify who will use the result and what decision it must support.
Define the evaluation question, scope, exclusions, constraints, and exact subject version.

Identify the subject areas, expertise, standards, methods, and evidence sources needed for the evaluation. Use
only guidance relevant to the subject and evaluation question. Specialized guidance may refine the criteria,
scenarios, checks, and evidence methods, but it does not replace this procedure. If no specialized guidance
applies, use this base method directly.

**Evidence:** an evaluation brief and context record with the question, intended use, subject and version,
outcome, scope, exclusions, requirements, constraints, needed expertise, relevant guidance, and open context
gaps.

**Next:** if the subject or evaluation question cannot be bounded, obtain the missing context before review. If
the needed expertise or relevant guidance changes later, update the context record before evaluating the
affected concern.

### 2. Define the criteria, verdict rules, and evidence plan

Turn intended outcomes, requirements, decisions, standards, constraints, risks, prior failures, and owner
commitments into acceptance criteria. Before recording results, declare what `PASS`, `REVISE`, and `FAIL` mean,
the thresholds between them, and how perspective results combine into the final verdict. Use an applicable
governing or domain contract when it already defines these rules; otherwise define them for this evaluation.

Map each material claim to the strongest suitable evidence method. Methods may include test, analysis,
inspection, demonstration, direct-user observation, static analysis, runtime evidence, measurement, telemetry,
or document trace. Choose complete coverage when practical. When sampling is necessary, define the population,
selection method, representative classes, complete processes, and limits.

Use bounded internal or external research when a material criterion, standard, prior-art claim, or evidence
method needs further study.

**Evidence:** a criteria and evidence plan that links each claim to its decision rule, method, source, expected
signal, and known limitation, plus the sampling rationale when applicable.

**Next:** if a criterion has no credible evidence method or the selected sample cannot support the intended
claim, improve the design or narrow the claim before continuing. Keep any unavoidable limit explicit.

### 3. Build the scenario and checklist frame

Use applicable scenario sources and target-specific risks to select the known cases. Cover normal and
alternative paths, invalid and boundary conditions, failure and recovery, harmful or adversarial use, change
and regression, compatibility events, and load-bearing assumptions when relevant. Give every selected scenario
an observable failure condition and a named evidence method.

Use applicable checklist sources to select atomic checks. Give every check a pass condition, applicability
predicate, named evidence, and on-fail route. Freeze the selected frame before recording results. Treat it as
the known coverage floor, not the limit of the evaluation.

**Evidence:** a selected scenario and checklist frame with source traces, applicability decisions, failure
oracles, pass conditions, evidence methods, and stated coverage gaps.

**Next:** if a material requirement, actor, state, boundary, dependency, risk, or quality obligation has no
case or check, add one before evaluating it. Otherwise continue to step 4.

### 4. Evaluate the known frame

Run or inspect every applicable scenario and check using the evidence methods selected in step 2. Inspect the
actual subject and supporting artifacts. Record observations, exact sources, commands or methods, expected and
observed signals, and limitations as the work proceeds.

Prefer direct evidence over summaries, file existence, creator claims, or expected results. When direct
evidence is unsafe or unavailable, use the strongest safe alternative and state what it cannot prove. Missing,
stale, malformed, contradictory, or unevaluable evidence is a gap, not a pass.

**Evidence:** a result for every applicable known scenario and check, with exact inspected evidence and visible
gaps.

**Next:** if the method cannot discriminate success from failure, return to step 2 or 3. If evidence is missing,
obtain it or keep the affected claim unevaluable. Otherwise continue to step 5.

### 5. Investigate the subject across perspectives

Investigate the whole subject one perspective at a time. Do not separate perspective review from causal
analysis. Apply this cycle within every perspective, using relevant specialized guidance to refine the lens and
its evidence:

1. Bring together the applicable criteria, scenario and checklist results, requirements, decisions, expected
   behavior, and known risks.
2. Inspect the actual subject, its evidence, and the interactions among its parts. Compare expected and observed
   conditions while searching for actors, states, dependencies, assumptions, harms, failure modes, and
   regressions outside the prepared frame.
3. Trace each supported concern from its observed effect through plausible causes. Test the strongest
   alternative explanation. Name a root cause only when evidence supports it; otherwise record the leading
   hypothesis, uncertainty, and missing evidence.
4. Add every material missed condition to the scenario or checklist frame, evaluate it, and revisit every
   perspective it affects.
5. Record the perspective's evidence-backed strengths and preserve conditions. Record each concern separately
   with a stable finding ID, expected and observed conditions, impact, cause or hypothesis, evidence, tested
   alternative, uncertainty, severity, confidence, and corrective direction. Preserve authorship and provenance,
   and recommend prevention rather than symptom masking or a weaker check.

Apply the cycle through all eight lenses:

- **Project:** test the trigger, problem root cause, intended outcome, success criteria, agreed scope,
  requirements, decisions, obligations, deferred work, and completion claims.
- **Structure:** test decomposition, ownership, interfaces, dependencies, data and state transitions, task or
  process graph, schema alignment, test seams, and maintainability. Look for cycles, shared-state hubs, premature
  abstraction, orphaned parts, and misplaced ownership.
- **Performance:** test latency, throughput, capacity, external-call count, batching, timeouts, retries, cache
  behavior, reliability, memory, disk, recurring cost, and measurement evidence.
- **Aesthetics:** test self-evidence, concision, accurate naming, presentation, convention fit, hierarchy,
  placeholders, formatting, comments, and reviewable change shape where applicable.
- **Usage:** test the experience of each real user, planner, executor, caller, operator, maintainer, or other
  consumer. Inspect interfaces, instructions, errors, paths, preconditions, next actions, accessibility, locale,
  keyboard and assistive use, and recovery.
- **Consistency:** test agreement among scope, design, obligations, tasks, behavior, code, tests, types,
  documentation, examples, schemas, validators, manifests, migrations, runtime references, commits, evidence,
  status, and handoff claims. Look for stale names, dangling references, one-sided lifecycle links,
  contradictions, and dropped evidence.
- **Risk:** test security and authorization order, input trust, privacy and retention, safety, destructive or
  one-way actions, concurrency, rollback, dependencies and licenses, publication authority, sensitive data,
  compliance, cost runaway, blast radius, and recovery. Require direct evidence for irreversible,
  trust-boundary, data-loss, and wrong-target claims.
- **Overall:** integrate cross-perspective effects, inherited assumptions, unnecessary complexity, hidden
  orthogonal work, mechanism used in place of an outcome contract, process-result contradictions, integrated
  behavior, and strengths that later work must preserve.

**Evidence:** one complete investigation record per perspective, the expanded frame and its results, a causal
finding ledger, and a preserve list. Each entry is understandable without a closed machine schema or private
context.

**Next:** return to steps 3 and 4 when the investigation expands the frame, then repeat the affected perspective
cycle. Continue only when all eight perspectives have been investigated, every added condition has been
evaluated, and every supported concern has a causal account or explicit uncertainty.

### 6. Close coverage and challenge the results

Resolve every applicable checklist row from inspected evidence as `PASS`, `FAIL:<finding-id>`, or
`n/a:<property>`. Reconcile scenarios, checks, perspectives, findings, strengths, evidence gaps, contradictions,
and sample coverage. Confirm that each fail names its supporting finding and each not-applicable result proves
its predicate false.

Challenge false positives, false negatives, proxy evidence, alternative explanations, cosmetic compliance,
unrepresentative sampling, and missing interactions. A completed checklist proves coverage closure, not
acceptance.

**Evidence:** a completed checklist, closed coverage trace, sampling assessment, and challenge record that
another qualified evaluator can reproduce.

**Next:** return to the earliest affected step when a challenge exposes incomplete criteria, coverage, evidence,
or causal reasoning. Stop without a verdict while any acceptance-bearing check or material evidence gap remains
unresolved.

### 7. Derive the perspective and overall verdicts

Apply the criteria, thresholds, and aggregation method declared in step 2 to Project, Structure, Performance,
Aesthetics, Usage, Consistency, Risk, and Overall. Keep every supported finding visible even when it does not
change the result. Do not soften a verdict because a correction appears easy.

Use `PASS` when the declared acceptance conditions hold, `REVISE` when material correctable findings prevent
acceptance, and `FAIL` when the declared failure condition holds. If a governing domain or caller contract uses
more exact thresholds, apply the version fixed in step 2 without changing it after seeing the evidence.

**Evidence:** perspective results and one final verdict with a traceable derivation from criteria, checks,
findings, and evidence.

**Next:** if the calculation cannot be reproduced or conflicts with a resolved check, return to step 6. Do not
issue a nominal verdict for an incomplete or invalid evaluation.

### 8. Consolidate and hand off the evaluation

Produce one self-contained result with the subject and version, scope, evaluation question, intended use,
independence statement, needed expertise, relevant guidance, criteria, methods, coverage, evidence, scenario
and checklist results, findings, strengths, limitations, uncertainties, perspective results, final verdict,
reasoning, corrective directions, and reopen conditions. Document outcomes throughout the evaluation, then
consolidate the current result here so a cold reader can reproduce, challenge, and use it.

Hand the result to the caller or subject owner without editing the subject, applying a finding, changing the
criteria, or deciding a reserved disposition. A caller or workflow adapter may add identity, machine shape,
rendering, validation, aggregation, storage, or transition mechanics without changing this method.

**Completion evidence:** one complete, reproducible evaluation result and an unchanged evaluated subject.

**Failure:** if the subject changes materially before or after handoff, bind the next evaluation to the new
version and repeat every applicable step with current evidence. Prior results remain history, not proof.

## References

- [Scenario](scenario/SKILL.md) owns scenario coverage, failability, and design obligations.
- [Checklist](checklist/SKILL.md) owns checklist construction, resolution semantics, coverage closure, and
  acceptance.
- [Study](../study/SKILL.md) owns bounded internal and external evidence study.
- [Startup](../startup/SKILL.md) owns sparse-baseline classification.
- [UI](../ui/SKILL.md) and [UX](../ux/SKILL.md) own specialized interface and experience evidence.
- [Coding](../coding/SKILL.md) owns language-agnostic software review criteria.
- [Python](../python/SKILL.md) and [TypeScript](../typescript/SKILL.md) own their language-specific review
  criteria and verification methods.
- [React](../react/SKILL.md) owns React's library-specific review criteria and verification methods.
- [Electron](../electron/SKILL.md) owns the desktop-platform review criteria and verification methods an
  Electron application adds on top of those.
- [EVALUATION manager adapter](../workflow/steps/evaluation.md) owns Gobbi's fresh dual-system dispatch, machine
  report shape, validation, aggregation, the user disposition gate, storage, and transitions.
