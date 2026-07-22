---
name: evaluation
description: MUST load for EVALUATION. Produces one fresh independent seven-perspective-plus-Overall report, finding ledger, completed checklist, and evidence-derived verdict.
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Evaluation

Use this skill for every productive step's EVALUATION stage. One fresh evaluator independently reviews the complete frozen creation package, writes all seven perspectives plus Overall, completes the checklist, and returns one schema-valid report with an evidence-derived verdict.

Run the operation once for Claude and once for Codex. Orchestration owns fresh dispatch, evaluator isolation, pair aggregation, and the user disposition gate. This skill owns the evaluator method, perspective lenses, finding schema, confidence and severity, checklist completion, report verdict, and repeat-review standard.

## Principles

### Review the claim and the process that produced it

The synthesis alone can hide dropped alternatives, weak evidence, unresolved conflict, or process shortcuts. Review both drafts, both cross-reviews, resolved decisions, scope, applicable upstream artifacts, and verification evidence.

### Every perspective must discriminate

A section is complete only when it uses scenarios and checks that could fail the subject. “Looks good” is not a result. Direct evidence outranks proxy evidence, and an inspected not-applicable predicate outranks assumption.

### Findings explain a root cause

A finding states the observable symptom, the cause that produced it, exact evidence, a false-positive check, and a correction that addresses the cause. Findings with the same symptom but different root-cause hypotheses remain distinct.

### Revision resets the review

A materially changed canonical artifact is a new subject. It receives two new complete reports. Earlier reports remain evidence but cannot satisfy any perspective or checklist item for the new subject.

## Rules

### Must follow

- **E-1 — Be fresh and independent.** The evaluator is not a creator, persistent teammate, prior evaluator session, or the other system's evaluator. It never sees the other report before freezing its own.
- **E-2 — Freeze the complete subject.** Bind the report to one subject digest and exact step, iteration, assignment, scope, creation package, decisions, scenarios, checks, and verification evidence.
- **E-3 — Cover every required lens once.** The ordered perspectives are Project, Structure, Performance, Aesthetics, Usage, Consistency, and Risk, followed by Overall.
- **E-4 — Use the strongest available evidence.** Inspect artifacts and run safe read-only checks. Name uncertainty or unevaluable claims instead of inferring a pass.
- **E-5 — Complete the scenario and checklist frame.** Load the current step's plural companions plus [scenarios.md](scenarios.md) and [checklists.md](checklists.md). Add target-specific cases when a material property is not covered.
- **E-6 — Use the finding schema exactly.** Every finding has unique ID, fingerprint, perspective, type, domain, disposition, confidence, severity, symptom, root cause, evidence, false-positive check, recommendation, and one-system provenance.
- **E-7 — Keep provenance intact.** The report's system, runtime identity, and finding ID match each finding's provenance. Do not merge or rewrite another system's finding inside an independent report.
- **E-8 — Derive verdicts from findings.** Apply the scoring rules exactly at each perspective, Overall, and report level. Do not choose a verdict from intuition.
- **E-9 — Complete every checklist item.** Each item is PASS, FAIL, or N/A with inspected evidence. FAIL cites one or more findings; PASS and N/A cite none.
- **E-10 — Preserve low-confidence evidence in the ledger.** Confidence changes force, not visibility. Do not hide a supported concern because it is non-blocking.
- **E-11 — Never apply a finding.** Evaluators recommend corrections but do not edit the subject, choose user dispositions, or authorize revision.
- **E-12 — Require fresh full rereview after material change.** All seven perspectives, Overall, the ledger, and checklist repeat for the new subject digest.
- **E-13 — Treat an invalid report as no report.** Missing sections, duplicate perspectives, malformed fields, inconsistent verdicts, stale identity, incomplete checklist, or schema failure blocks aggregation.
- **E-14 — Do not narrow rigor for cost.** Token or runtime cost cannot remove a perspective, a system, creation evidence, scenarios, checks, or repeat review.

### Must not follow

- Do not communicate with a creator to negotiate a finding during independent review.
- Do not read another evaluator's report before freezing this one.
- Do not evaluate only the synthesis when creation evidence is available.
- Do not treat file existence, a green proxy, or a creator report as proof of a semantic claim.
- Do not combine findings solely because their text sounds similar.
- Do not mark a prior accepted finding addressed without fresh evidence from the current subject.
- Do not repair the subject or start revision before the manager obtains the user's disposition decision.

## Procedure

### 1. Verify independence and identity

Confirm the assignment names one system, one fresh runtime identity, one step, one iteration, one stable assignment, and one frozen subject digest. Confirm the evaluator did not create the subject, is not a persistent teammate, has not evaluated an earlier iteration in the same runtime context, and cannot access the other report.

If any condition fails, return BLOCKED with the identity conflict. Do not produce a nominal report.

### 2. Inventory and freeze the evidence bundle

Read the canonical synthesis, Claude draft, Codex draft, both reciprocal reviews, resolved open decisions, locked scope, applicable upstream artifacts, plan or task contract, verification results, user-approved waivers, scenarios, checklist source, and process evidence. For Execution, inspect the actual diff and final tree. For Wrap-up, inspect the actual post-promotion tree, frozen manifest, preimages, applied delta, guard evidence, and handoff.

Record exact paths and digests. Missing required evidence is a finding or an unevaluable stop, not permission to assume the artifact is sound.

### 3. Build the evaluation frame

Load the current step's evaluation.md, scenarios.md, and checklists.md. Then use this skill's own companions to test the evaluation operation. Select every applicable seeded case and check. Add a target-specific case when the subject has a material actor, boundary, failure, dependency, trust surface, compatibility event, cost, locale, or evidence obligation not covered by the seed.

Freeze the frame before recording results. Each selected scenario must have an observable failure oracle and checklist coverage.

### 4. Review Project

Ask whether the subject serves the right outcome, whole agreed scope, and only that scope. Check the trigger, root cause, success criteria, user decisions, obligation coverage, deferred work, and completion claims against direct evidence.

Typical failures: solving a symptom, dropped requirement, scope expansion, phantom completion, or an artifact that cannot achieve the stated outcome.

### 5. Review Structure

Check decomposition, ownership, interfaces, dependencies, data or state transitions, task graph, schema alignment, test seams, and maintainability. Prefer established project patterns unless deviation is justified. Look for cycles, shared-state hubs, premature abstraction, orphaned exports, and misplaced ownership.

### 6. Review Performance

Check latency, throughput, capacity, external-call count, batching, timeouts, retries, cache behavior, memory and disk use, recurring cost, and measurement evidence where applicable. A design-stage subject must commit to measurement; an implementation-stage subject must provide actual measurements when the scope requires them.

### 7. Review Aesthetics

Check whether the artifact is self-evident, concise, convention-matched, accurately named, free of placeholders, and reviewable. For code, inspect naming, comments, formatting, and diff shape. For documents, inspect hierarchy, stable terms, first-page clarity, and filler.

A convention or ambiguity defect is not dismissed as personal taste.

### 8. Review Usage

Read as the next real consumer: user, planner, executor, caller, operator, maintainer, or next session. Check that interfaces, instructions, errors, next actions, paths, and preconditions are usable without private context. Cover accessibility, locale, keyboard and assistive use, and actionable failure messages when applicable.

### 9. Review Consistency

Compare every surface that must agree: scope and design; obligations and tasks; task inputs and outputs; code, tests, types, docs, examples, schemas, validators, manifests, migrations, runtime references, commits, and handoff claims. Search for old names, stale paths, dangling references, one-sided lifecycle links, contradictory status, and dropped creation evidence.

### 10. Review Risk

Ask what breaks if the subject is wrong. Inspect security and authorization order, input trust, privacy and retention, destructive or one-way actions, concurrency, rollback, dependency and license risk, blast radius, publication authority, sensitive data, cost runaway, and recovery. Challenge unsafe defaults and proxy evidence.

Critical irreversible, trust-boundary, data-loss, or wrong-tree claims need direct evidence.

### 11. Review Overall

Integrate cross-perspective effects without replacing the seven sections. Challenge:

- wrong assumptions that multiple sections inherited;
- overcomplexity that satisfies no obligation;
- orthogonal work hidden inside an otherwise valid artifact;
- imperative mechanism where the contract should state an outcome;
- contradictions between creation process and synthesis; and
- material strengths that later revision must preserve.

Overall findings use perspective Overall. The preserve list names concrete verified strengths, not praise.

### 12. Write findings with the closed schema

For each supported issue, record:

| Field | Contract |
|---|---|
| id | Unique uppercase identifier within this report |
| fingerprint | SHA-256 of canonical sorted JSON containing symptom and rootCause |
| perspective | One required perspective or Overall |
| type | scenario_gap, checklist_gap, design_flaw, assumption_risk, or general |
| domain | security, performance, test, observability, privacy, compliance, dependency, docs-sync, cost, accessibility, i18n, unevaluable, step-mismatch, regression, process, or general |
| disposition | open for a new supported issue; addressed, disputed, deferred, or superseded only when current evidence and an existing approved disposition justify it |
| confidence | 0, 25, 50, 75, or 100 |
| severity | Critical, High, Medium, or Low |
| symptom | Observable violation |
| rootCause | Cause that produced the symptom |
| evidence | Exact inspected evidence and consequence |
| falsePositiveCheck | Alternate explanation tested and result |
| recommendation | Root-cause correction, without applying it |
| provenance | This report's system, runtime identity, and finding ID |

Do not use both type general and domain general on the same finding. Keep two findings when root-cause hypotheses differ. No finding is valid without a false-positive check.

### 13. Complete the evaluation checklist

Create at least one check for each perspective and Overall. Preserve selected operation-specific checklist IDs. Resolve every row:

- PASS: direct evidence proves the claim; findingIds is empty.
- FAIL: evidence disproves the claim; findingIds names every supporting finding.
- N/A: inspected evidence proves the applicability predicate false; findingIds is empty.

No unchecked or advisory row belongs in the report. A completed checklist is evidence coverage, not a substitute for the finding ledger.

### 14. Derive perspective and report verdicts

For each perspective and Overall, consider findings whose disposition is open or disputed:

- any Critical finding with confidence at least 75 yields FAIL;
- otherwise any High finding with confidence at least 50 yields REVISE;
- otherwise the section yields PASS.

The report verdict is the most severe section result: FAIL over REVISE over PASS. Medium and Low findings remain visible even when the report passes. The evaluator does not soften the verdict because a correction seems easy.

### 15. Render and validate one report

Return JSON matching [evaluation-report.schema.json](../record/schemas/evaluation-report.schema.json). The active-runtime record command renders it at the canonical system-labeled evaluation path. Run the evaluation validator in single-report form with expected system, step, iteration, assignment, and subject digest.

The report is complete only when the schema, human section shape, machine JSON, fingerprints, provenance, checklist, and derived verdict all validate.

### 16. Hand off without applying findings

Return the evaluator status contract, report path, verdict, findings, evidence gaps, and preserve list. Do not inspect the other report or aggregate results. The manager validates both reports, aggregates them by severity, preserves provenance during deduplication, and presents one disposition batch to the user.

No creator may begin correction until the user approves or edits the complete batch. A material correction creates a new subject digest and repeats this entire procedure in two fresh systems.

## References

- [EVALUATION manager adapter](../orchestration/workflow/evaluation.md) owns fresh dispatch, pair aggregation, waivers, the user disposition gate, and transitions.
- [Evaluation report schema](../record/schemas/evaluation-report.schema.json) owns the executable report shape.
- [Evaluation report validator](scripts/validate-evaluation-report.sh) owns single and pair mechanical validation and provenance-preserving aggregation output.
- [Record command](../record/scripts/session-record.sh) owns deterministic report rendering and atomic storage.
- [Scenario](../scenario/SKILL.md) owns scenario coverage and failability.
- [Checklist](../checklist/SKILL.md) owns evidence-bearing checklist construction and source semantics.
- Step-specific evaluation entrypoints: [Ideation](../ideation/evaluation.md), [Planning](../planning/evaluation.md), [Execution](../execution/evaluation.md), and [Wrap-up](../wrap-up/evaluation.md).
