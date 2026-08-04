---
name: html-css-testing
description: "MUST load when designing, writing, running, diagnosing, or reviewing focused tests for an HTML/CSS contract, generated or conditional output, or direct browser or Electron-renderer behavior claimed by that contract."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# HTML/CSS Testing

Use this operation to design, write, run, diagnose, or review focused evidence for one HTML/CSS contract. It
binds each atomic assertion to its semantic owner, system under test, source and variant cases, target and mode,
minimum establishing evidence, and evidence ceiling.

The operation can verify authored semantics and direct semantic or accessibility output, but it does not choose
or implement keyboard behavior. Application-suite risk, cross-layer seams, end-to-end workflows, and release
reconciliation remain with `web-testing`; load both owners when both claim boundaries apply.

## Principles

### Derive evidence from the claim

Start with an atomic assertion and choose the least costly evidence layer that can establish it. Source,
parser DOM, accessibility output, CSSOM, computed style, geometry, pixels, resources, and profiling prove
different things.

### Bind conclusions to cases and targets

A result applies only to the observed source identity, transform, variant cases, target, mode, state, and
evidence. Unobserved cases remain gaps rather than implied passes.

### Keep execution reproducible and discriminating

Fixtures, controls, waits, comparisons, and reruns should distinguish the claimed behavior from a cosmetic
green result. Flaky or conflicting evidence is a result to contain, not a pass to average away.

### Separate domain and application evidence

Focused HTML/CSS evidence can establish a local contract; it cannot establish application workflows, product
acceptance, security, or release safety without the product, security, application, or release owners and their tests.

## Rules

- **MUST record one semantic owner, one system under test, and one binary assertion before selecting evidence.**
  Split compound claims and route claims owned by another skill before authoring or running tests.
- **MUST use the minimum evidence capable of establishing the assertion.** Never substitute source appearance,
  a screenshot, a passing proxy, or one target for a property it cannot prove.
- **MUST bind every run to exact source, transform, case, target, mode, state, fixture, and evidence identity.**
  A changed identity requires rerun or an explicit stale result.
- **MUST include material generated, conditional, locale, direction, theme, state, responsive, accessibility,
  and target cases.** Record the population, selected cases, rationale, and gaps.
- **MUST contain flaky, conflicting, unavailable, or unsafe evidence.** Retry only with a justified stable setup,
  then fail, narrow, or hand off rather than reporting a broad pass.
- **NEVER turn a focused HTML/CSS result into product, security, application-suite, or release acceptance.**
  State the evidence ceiling and name the owner of the broader claim.

## Procedure

### Phase 1 — Frame Claims and Coverage

#### 1.1 Bind the claim and system under test

- Record the subject ID, requested claim, semantic owner, system under test, canonical source and transform,
  public-interface references, target and mode, and intended consumer of the result.
- Split the request into atomic assertions with one expected result each; route standards meaning to
  `html-css-platform` and broader feature, security, product, or release claims to their owners.
- For authored semantics, distinguish the declared element/name/role/state from parser DOM, accessible-name
  computation, accessibility tree, and keyboard behavior.
- Stop when the source, owner, target, expected result, or authority to create or execute a test is unknown.

#### 1.2 Select variant cases

- List material dimensions and their population or known values.
- Select complete cases when the bounded population is small; otherwise select representative tuples with a
  reason tied to the claim and known interactions.
- Give each selected case an identity and record content, locale, language, direction, writing mode, theme,
  state, viewport or container, input, accessibility preference, target, mode, and transform values that apply.
- Record unselected and unknown cases and the conclusion they prevent.

### Phase 2 — Design Atomic Evidence

#### 2.1 Choose the minimum establishing evidence

- Use source inspection for authored tokens, hooks, declarations, and static relationships only.
- Use parser-produced DOM for tree construction, correction, attributes, and native element realization.
- Use accessible-name or accessibility-output inspection for the exact output claim, without assuming keyboard
  feature behavior from a role.
- Use CSSOM or computed style for rule and resolved-value claims; geometry for layout; pixels or reference
  comparison for rendering; resource observation for selection or requests; profiling for performance.
- Pair direct target observation with `html-css-platform` when the conclusion depends on standards meaning,
  support, rendering stage, or target-specific diagnosis.

#### 2.2 Design fixtures, controls, and failure signals

- Keep the fixture minimal while retaining the source, transform, state, and interaction needed by the claim.
- Define positive, negative, boundary, alternate-valid, failure, recovery, and adversarial cases that materially
  discriminate the contract.
- Define comparison, tolerance, wait, cleanup, retry, and isolation behavior from the evidence mechanism rather
  than adding generic delay or broad snapshots.
- Make cosmetic-green subjects fail: stale generated output, wrong target, hidden failures, overbroad proxies,
  unobserved variants, and evidence gathered after the fixture changed.

### Phase 3 — Author, Run, and Diagnose

#### 3.1 Author or review the focused test

- Place the test beside the project's owning contract and use its existing runner, fixture, naming, and cleanup
  conventions.
- Record assertion-to-claim mapping, case and target parameters, expected result, evidence layer, and failure
  message without embedding a product verdict.
- Review that setup does not alter the property being measured, discard failures, or depend on state created by
  a prior run.
- Keep application-suite orchestration and end-to-end paths outside this source; hand them to `web-testing`.

#### 3.2 Execute and contain the run

- Capture the exact source, transform, fixture, target, mode, case, tool, and configuration identity before the
  run.
- Execute the smallest relevant test set, preserving logs and raw observations needed to interpret the claim.
- Clean up temporary state and verify the system under test and evidence identity did not change unexpectedly.
- On infrastructure failure, flakiness, conflict, missing access, or unsafe conditions, contain the result;
  retry only after identifying and correcting the unstable precondition.

#### 3.3 Diagnose failure at the earliest divergence

- Compare authored source, transformed output, parser DOM, semantic output, matched rules, cascade, computed
  values, geometry, paint, resources, and timing only until the earliest divergence is established.
- Route a standards or direct-target question to `html-css-platform`; route a source repair to
  `html-css-development`; route application behavior to its Web owner.
- Narrow the assertion or target when the evidence can establish a smaller claim, and keep the original broad
  claim unresolved.
- Rerun the affected case and its necessary controls after a repair; do not turn a changed fixture into evidence
  for the original run.

### Phase 4 — Interpret and Report

#### 4.1 Resolve every assertion

- Record pass, fail, unavailable, flaky, conflicting, or not-run for each assertion and case.
- Link the observation and evidence identity; state the exact evidence layer and evidence ceiling.
- State target and variant coverage, unobserved cases, conflicts, limitations, invalidation conditions, and any
  recovery or rerun requirement.
- Use [`evaluation/procedure/checklists.md`](evaluation/procedure/checklists.md) and
  [`evaluation/result/checklists.md`](evaluation/result/checklists.md) together for a complete Testing
  evaluation.

#### 4.2 Hand off without broadening the result

- Return a bounded conclusion for the owned HTML/CSS claim and no broader acceptance.
- Hand standards and direct-renderer interpretation to `html-css-platform`, repairs to
  `html-css-development`, and application-suite or feature proof to `web-testing`.
- For a custom widget, report authored semantic/output evidence separately from keyboard-model choice,
  implementation, and feature-behavior proof.
- Complete when every assertion has a result, evidence identity and limit, case coverage, invalidation state,
  and named next owner where needed.

## References

- [`evaluation/procedure/checklists.md`](evaluation/procedure/checklists.md) evaluates claim framing, assertion
  design, coverage, evidence selection, setup, execution, retry, and containment.
- [`evaluation/result/checklists.md`](evaluation/result/checklists.md) evaluates observations, conclusions,
  evidence limits, reporting, recovery information, and handoffs to other owners.
