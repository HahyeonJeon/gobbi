---
name: eval-codex-execution-i1
description: Fresh Codex evaluation of the shipped react project skill, execution EVALUATION iteration 1 — REVISE, findings across Project/Structure/Performance/Usage/Consistency/Risk.
type: reviews
scope: project
feature: null
status: active
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [evaluation, docs-sync, security]
keywords: [react-skill, execution-evaluation, electron-sandbox, aria-source, legend-fingerprint]
author: codex
review_kind: adversarial-review
subject: .gobbi/projects/gobbi/skills/react/
verdict: revise
---

# Codex evaluation report — execution / EVALUATION / 1

- assignment `eval-codex-execution-i1` · system `codex` · runtime `codex-exec-execution-i1-2026-07-26-r6`
- subjectSha256 `eeb13a82ffb8109829c0c395335a62f2815c0f69d481384ef0dfb1880ee84eeb`
- **verdict REVISE**

> **Record note.** This report validates against `evaluation-report.schema.json` and derives its
> verdicts correctly, but `write-artifact` rejected it: finding `RISK-ARIA-SOURCE-01` declares
> `provenance.runtimeIdentity` as `codex-execution-i1-2026-07-26-r6`, omitting `exec-` from the
> report's own `codex-exec-execution-i1-2026-07-26-r6`. The manager did not correct it — authoring
> content under a peer's label is forbidden — and did not re-run, because each Codex run resamples a
> different ledger (run 1: 9 findings, run 2: 11), so a retry replaces evidence rather than repairing
> it. Stored here as staged evidence rather than as the canonical system artifact.


## Project — REVISE

### PROJECT-GATE-01 · High · confidence 100 · general

**Symptom.** The artifact is described as about to be proposed for merge even though its predecessor quality gates are incomplete: Ideation ended at REVISE and Planning was not evaluated.

**Root cause.** Budget pressure was allowed to shorten the mandatory workflow rather than resolving Ideation findings and completing the Planning evaluation loop before Execution.

**Evidence.** The supplied evaluation context states that Ideation ended at REVISE, Planning was not evaluated, and both decisions were made under budget pressure. AGENTS.md:16-22 declares Configuration → Ideation → Planning → Execution → Wrap-up and DISCUSSION → WORK → EVALUATION → RECORD mandatory. AGENTS.md:40 further says never to reduce Ideation or evaluation rigor to save tokens and requires another complete WORK and EVALUATION iteration after material revision.

**Recommendation.** Before merge proposal, return to the unresolved Ideation disposition, resolve or explicitly disposition its material findings under the governing protocol, complete Planning and its required evaluation, and then confirm that the resulting locked plan still describes the frozen execution artifact.

**False-positive check.** I checked whether the stated user decision could be treated as the workflow's permitted waiver. AGENTS.md:42 permits an explicit waiver only for a named unavailable system, step, and iteration; the supplied reason is budget pressure, and both systems are available for this execution evaluation. The finding therefore concerns unresolved merge readiness, not disagreement with any of the twelve locked product decisions.


## Structure — REVISE

### STRUCT-ERROR-BOUNDARY-01 · High · confidence 100 · scenario_gap

**Symptom.** A React change can ignore error-boundary placement and what a boundary catches while every scenario and every checklist item still passes.

**Root cause.** Procedure P3 act 6 was made a required design act, but the scenario set stopped without a boundary family, so the checklist correctly had no case from which to derive a failing check.

**Evidence.** SKILL.md:348-350 requires placement of failure and loading boundaries and states that an error boundary is a class component. checklists.md:595-599 explicitly records that Procedure P3 act 6 has no item because no scenario family tests boundary placement or catch behavior. scenarios.md:471-472 repeats that the candidate case is not written. The governing operation-skill.md:148-151 requires every load-bearing parent clause to be exercised by a scenario and check and every scenario obligation to have a checklist ID.

**Recommendation.** Add a scenario family that distinguishes correct boundary granularity, omitted boundaries, unsupported error classes, and a cosmetically present but ineffective boundary; derive atomic checks from that family and select them from evaluation.md when error or loading boundary placement is in scope.

**False-positive check.** The class-component mechanism is taught in design.md:85-106 and cited to the live React Component reference, so this is not a missing explanation. I searched all 35 checks and all 12 scenario families; none can fail a change for omitting a needed boundary, placing it at an unusable granularity, or relying on it for an event-handler or ordinary asynchronous error.

### STRUCT-COMPANION-POLICY-01 · Medium · confidence 100 · design_flaw

**Symptom.** convention.md sections 4-6 prescribe feature grouping, colocation, promotion timing, cross-feature import direction, an exact import order, and JSX formatting defaults, but no parent rule, scenario, or checklist item owns or evaluates those prescriptions.

**Root cause.** Substantive house preferences were placed in a lookup companion and labelled ecosystem convention instead of being either non-normative background or parent-owned policy.

**Evidence.** convention.md:83-137 uses directive language including group by feature, promote on second use, do not import across features, a five-group import order, and formatting defaults. convention.md:29 says readers seeking enforced parts may stop after sections 1-3, confirming sections 4-6 are outside enforcement. operation-skill.md:44 says the parent is the sole policy owner and companions add no policy; lines 74-80 require operational preferences to live in parent Principles and Rules.

**Recommendation.** For each section 4-6 statement, either demote it explicitly to optional background with no compliance implication, or promote the load-bearing preference into the parent Rules and then provide a scenario and check that can fail a contrary artifact.

**False-positive check.** The ecosystem-convention label correctly avoids attributing these preferences to React, but it does not make them non-normative: the file calls them the skill's house default and phrases them as instructions. No H rule or P3-P8 completion condition points to these conventions, and the guaranteed coverage map contains no independent convention obligation.

### STRUCT-DEFERRED-ROUTE-01 · Medium · confidence 75 · design_flaw

**Symptom.** useDeferredValue is taught in rendering.md, but a reader deciding whether to use that primitive is not explicitly routed to it by Procedure P2 or by async.md's ownership and seam tables.

**Root cause.** The ownership split was written around the broad concepts of scheduling and client-side asynchronous work without assigning the cross-cutting useDeferredValue decision to one discoverable route.

**Evidence.** rendering.md:245-271 explains useDeferredValue's scheduling, network-request, Suspense, and memoized-child behavior. SKILL.md:315 routes rendering.md for transitions but does not name deferred values. SKILL.md:319 routes async.md for Suspense, use, or an external store but likewise does not name useDeferredValue. async.md:166-179 lists its seam and names useTransition, use, Suspense, and Effect cleanup while omitting useDeferredValue.

**Recommendation.** Name useDeferredValue explicitly in one P2 route and in the rendering/async seam, assigning its scheduling mechanics to rendering.md and only pointing to that owner from async.md so the fact is not duplicated.

**False-positive check.** The primitive is not absent from the artifact: rendering.md contains accurate, live-sourced material, and async.md quotes one Suspense exception involving it. The finding is limited to cold-load discoverability and ownership; a reader who already knows which file to search can locate the content.


## Performance — REVISE

### PERF-USEMEMO-01 · High · confidence 100 · design_flaw

**Symptom.** On the compiler-disabled branch, the skill does not provide an actionable criterion for using useMemo to skip an independently expensive recalculation; its detailed criteria cover memoized component render cost, referential identity at a memo boundary, and identities held for hook dependencies.

**Root cause.** The manual branch was built from the memo, useCallback, and useState sources without treating the primary useMemo reference and its slow-calculation criterion as a separate owned mechanism.

**Evidence.** SKILL.md:158-169 declares three independent manual-memoization criteria but describes render cost specifically as when memo is worth adding to an expensive component. rendering.md:147-230 develops memo, prop identity, useCallback, stable setters, and Effect dependencies, but not useMemo for a slow calculation. async.md:49 contains only a one-line instruction to memoize an expensive computation and routes to those sections. SKILL.md References has no useMemo entry. The live primary source https://react.dev/reference/react/useMemo defines useMemo as caching a calculation and identifies a noticeably slow calculation with rarely changing dependencies as its first valuable case.

**Recommendation.** Add the measured-slow-calculation case to H8's compiler-disabled criteria, cite the primary useMemo reference, explain that it skips update recalculation only while dependencies remain unchanged, and extend the corresponding scenario and REACT-CHECK-32 pass condition so this criterion is independently falsifiable.

**False-positive check.** I treated calculation time as part of render cost and looked for a concrete selection rule rather than requiring a particular heading. The artifact never states the decisive dependency-stability condition or the update-only benefit for this case, and its no-compiler table contains no calculation example. The compiler-enabled section's statement that the compiler memoizes expensive calculations does not teach the disabled branch.


## Aesthetics — PASS


## Usage — REVISE

### USAGE-EXTERNAL-STORE-01 · High · confidence 100 · design_flaw

**Symptom.** A reader placing data in the external-client-store rung is told to create the subscription in an Effect, which steers them toward the ad-hoc useState-plus-Effect pattern that the skill elsewhere says useSyncExternalStore exists to replace.

**Root cause.** H6's general start-and-clean-up model was applied to a subscription whose lifecycle React is supposed to manage through useSyncExternalStore's subscribe callback.

**Evidence.** state.md:90-99 introduces the external-store rung and says the subscription rules are H6's: create it in an Effect and remove it in cleanup. async.md:98-106 instead calls useSyncExternalStore the sanctioned way to read an external store without the tearing of an ad-hoc useState-plus-Effect subscription. The live React reference https://react.dev/reference/react/useSyncExternalStore instructs callers to invoke the hook at component top level, pass a subscribe function, and have that function return the unsubscribe cleanup.

**Recommendation.** Make state.md point to useSyncExternalStore for the external-store rung and state that its subscribe function returns cleanup; reserve the explicit Effect pattern for external subscriptions that cannot be consumed through that React primitive.

**False-positive check.** A push channel or library with no React adapter may legitimately require an Effect, and runtime.md correctly uses that model for an Electron push subscription. The problematic sentence is specifically attached to React's external-client-store rung and immediately follows the claim that React provides a safe subscription primitive, so it is not limited to unsupported integrations.


## Consistency — PASS

### CONSISTENCY-ARIA-COUNT-01 · Medium · confidence 100 · general

**Symptom.** The References register says Using ARIA supplies four H9 exception conditions, while H9, design.md, REACT-CHECK-27, and the cited source all define three circumstances.

**Root cause.** The source's four historical Rules of ARIA were conflated with the First Rule's three circumstances in which a native HTML solution may not be possible.

**Evidence.** SKILL.md:488-489 describes four exception conditions. SKILL.md:175-179 enumerates exactly three; design.md:120-132 and checklists.md:416-427 repeat those three. The live source at https://www.w3.org/TR/using-aria/ has four top-level ARIA rules in sections 2.1-2.4, but section 2.1 lists exactly three circumstances under the First Rule.

**Recommendation.** Change the H9 reference summary to say three circumstances under the First Rule; if the four historical ARIA rules are worth mentioning, identify them separately and do not describe them as H9 exceptions.

**False-positive check.** I checked whether a fourth circumstance existed elsewhere in section 2.1 or whether the reference meant four ARIA rules. The register explicitly says exception conditions and associates them with H9; H9 intentionally carries only section 2.1's circumstances. This is therefore a count and terminology contradiction, not a dispute about the locked three-circumstance decision.

### CONSISTENCY-LEGEND-01 · Medium · confidence 100 · checklist_gap

**Symptom.** evaluation.md's sole rule crosswalk can remain apparently valid after a rule's exceptions, remedies, evidence class, or branch criteria change, so it cannot perform the propagation guarantee it claims.

**Root cause.** Crosswalk identity is reduced to each rule's opening clause instead of the complete normative rule or a normalized fingerprint of it.

**Evidence.** evaluation.md:34-41 says every entry resolves to the verbatim opening clause, calls the legend the sole crosswalk, and instructs maintainers to edit it when the quoted clause changes. A direct comparison found that 10 of 33 legend quotations are not literal substrings of SKILL.md because the source clauses wrap across lines. Normalizing whitespace repairs that textual issue but still leaves every exception and later condition unobserved. H4, H6, H8, H9, H13, H14, and H15 all carry material policy beyond their opening clause.

**Recommendation.** Verify the complete normalized normative text for each rule, or store a generated fingerprint beside each crosswalk entry, and add exception-focused adversarial checks so a rule-body change cannot pass merely because its identifier and opening clause survived.

**False-positive check.** All referenced identifiers exist, and the opening meanings are recognizable after whitespace normalization, so there is no orphan-ID finding. The defect is narrower: changing H9's allowed circumstances or H6's cancel-versus-ignore conditions without touching the first sentence leaves the legend and its stated synchronization test unchanged.


## Risk — REVISE

### RISK-ELECTRON-SANDBOX-01 · High · confidence 100 · design_flaw

**Symptom.** An Electron renderer configured with process sandboxing disabled can satisfy H16, REACT-CHECK-20, and REACT-CHECK-28 even though the cited Electron checklist and runtime.md require sandboxing.

**Root cause.** H16 cites Electron security checklist items 2, 3, 4, and 20 but promotes only Node integration, context isolation, and raw-API containment into the parent rule; checklist item 4's sandbox obligation remains stranded in the companion.

**Evidence.** SKILL.md:230-234 defines H16 without a sandbox condition while citing Electron checklist item 4. runtime.md:38 says the trust boundary has context isolation and the sandbox on, and runtime.md:124-129 says the sandbox should be enabled in all renderers. checklists.md:259-269 checks only Node integration off and context isolation on. The live Electron security checklist at https://www.electronjs.org/docs/latest/tutorial/security lists process sandboxing as recommendation 4 and says to enable it in all renderers.

**Recommendation.** Promote process sandboxing into H16, add it to the shipped-configuration pass condition and evidence for REACT-CHECK-28, include a `sandbox: false` adversarial case, and keep the existing Node-integration, context-isolation, bridge-enumeration, and message-validation requirements.

**False-positive check.** The sandbox is an Electron default on current releases, but H16 and REACT-CHECK-28 inspect shipped configuration precisely to catch disabled protections; a deliberate `sandbox: false` is therefore a valid adversarial counterexample. Context isolation also affects sandboxing, but context isolation on does not prove that sandboxing was not separately disabled.

### RISK-H6-CHECKS-01 · High · confidence 100 · checklist_gap

**Symptom.** The H6 checklist can resolve all relevant items PASS or n/a while an Effect leaks a connected resource, applies a stale Promise result through a non-await callback, or merely ignores expensive or long-lived cancellable work.

**Root cause.** The check applicability predicates describe a few syntax and API shapes rather than H6's properties: everything started must stop, every obsolete async result must be stopped or discarded, and cancellation is required under any of three independent resource conditions.

**Evidence.** H6 at SKILL.md:136-153 covers all work an Effect starts, all async results, and requires cancellation for rapidly changing input, a long-lived surface, or expensive work. REACT-CHECK-09 at checklists.md:147-158 activates only for a subscription, timer, or listener, omitting a connect/disconnect resource. REACT-CHECK-10 at lines 160-171 activates only when an Effect awaits a result, omitting Promise chains and callback APIs. REACT-CHECK-35 at lines 173-187 activates only when cancellable work's input can change before completion, so the rule's independent long-lived-surface and expensive-request branches can be labelled n/a.

**Recommendation.** Make H6 checks property-based: activate cleanup for every resource an Effect starts, activate stale-result protection for every asynchronous completion regardless of syntax, and activate the cancellation decision when any one of rapid input, long lifetime, or high expense holds. Add adversarial cases for connect/disconnect, `.then` or callback completion, and one expensive request on a long-lived surface.

**False-positive check.** I preserved H6's valid ignore branch: cheap, bounded work may be allowed to finish if its obsolete result is discarded. The counterexamples target only cases H6 itself says require cleanup or cancellation. Scenario 05 contains a socket, interval, out-of-order responses, and rapid input, but its derived predicates still do not cover the connected-resource, non-await, or single expensive/long-lived cases.

### RISK-ARIA-SOURCE-01 · High · confidence 100 · assumption_risk

**Symptom.** H9 presents W3C Using ARIA as current primary authority even though W3C formally discontinued that draft five months before the skill's recorded source-read date.

**Root cause.** Quotation relocation verified that the historical wording remained on the page but did not evaluate the source's current publication status and authority warning.

**Evidence.** H9 cites W3C Using ARIA at SKILL.md:175-181; design.md:171-180 says it was read on 2026-07-26 and uses it as the source for the First Rule and its circumstances. The live page at https://www.w3.org/TR/using-aria/ is dated 2026-02-24, labels itself a Discontinued Draft, says there are no plans to maintain it, and says it is inappropriate to cite except as abandoned work. The page points readers to the current ARIA Authoring Practices Guide and ARIA in HTML Recommendation.

**Recommendation.** Re-evidence H9 against maintained W3C Recommendations and the current APG or ARIA in HTML documents, tracing each retained mechanic to a current owner. Keep Using ARIA only as explicitly historical material if a current source does not contain equivalent wording.

**False-positive check.** The three quoted circumstances still appear verbatim and are internally applied consistently, so this is not a claim that H9's mechanics are presently false. The risk is authority and maintenance: the skill calls the page primary current evidence after the owner expressly withdrew that status.


## Overall — PASS
