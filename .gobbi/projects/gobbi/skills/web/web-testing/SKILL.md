---
name: web-testing
description: "MUST load when designing, writing, running, diagnosing, or reviewing tests for a web application or feature."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web Testing

Use this operation to produce and maintain a risk-based web test system, from contract study through
deterministic suites, real-seam evidence, failure diagnosis, and truthful reporting.

It owns test design and mechanics, not runner-specific syntax or the behavior under test. Product,
`web-app-lifecycle`, platform, security, accessibility, performance, language, framework, and tool owners
supply their claims and facts.

## Principles

### Test risks and observable claims

The suite exists to prove material behavior, not to satisfy a fixed diagram or metric.

### Use the least expensive proving layer

Choose the smallest layer that can establish the claim without replacing the real seam it depends on.

### Determinism and diagnosis are correctness

Control the inputs that can change results and make every failure actionable at its owner.

### Evidence carries its limits

Doubles, automation, captures, emulation, and live observations each prove only what they exercise.

## Rules

- **MUST derive the suite from contracts, incidents, risks, environments, and release claims.** A fixed
  pyramid or coverage percentage cannot replace risk analysis, as the
  [Google testing overview](https://abseil.io/resources/swe-book/html/ch11.html) also explains.
- **MUST assert observable behavior at the owning boundary.** Avoid implementation details that turn safe
  refactoring into product failure, following the
  [Testing Library principles](https://testing-library.com/docs/guiding-principles/) where applicable.
- **MUST use real dependencies for every claim about a real seam.** A mock, fake, stub, screenshot, snapshot,
  or coverage report proves only its explicit limit; use
  [Google's larger-test guidance](https://abseil.io/resources/swe-book/html/ch14.html) to weigh doubles.
- **MUST control time, randomness, order, concurrency, network, data, cleanup, and environment or report the
  resulting limit.** Never retry until green or treat a rerun as diagnosis.
- **MUST match accessibility, security, visual, performance, browser, migration, recovery, and live-operation
  claims to evidence that can establish them.** Automation alone does not establish conformance or human
  outcomes.
- **NEVER let a skip, quarantine, snapshot update, ignored failure, or known flake silently satisfy
  acceptance.** Record its owner, impact, evidence gap, disposition, and reopen condition.

## Procedure

### Phase 1 — Study Claims and Risk

#### 1.1 Study the contract and current suites

- Read the system or feature contract, current tests, incidents, regressions, supported environments, release
  claims, and acceptance conditions.
- Trace current static, unit, component, contract, integration, browser, end-to-end, accessibility, security,
  performance, migration, recovery, and live evidence.
- Record suite cost, duration, ownership, failure history, flakes, skips, doubles, diagnostics, environment
  gaps, and real-seam coverage.
- Continue with one bounded evidence outcome; return an undefined contract, unsupported claim, missing
  environment, or owner conflict.

#### 1.2 Route claim and fact owners

- Load affected browser or PWA lifecycle, frontend, backend, platform, security, accessibility, performance,
  coding, language, framework, and test-tool owners.
- Use behavior and isolation guidance from
  [Testing Library](https://testing-library.com/docs/guiding-principles/),
  [Playwright](https://playwright.dev/docs/best-practices), and
  [Web Platform Tests](https://web-platform-tests.org/writing-tests/general-guidelines.html) where applicable.
- Use the Google testing and test-double material as evidence, not as universal quotas or a fixed suite shape.
- Record each material claim, owner, risk, supported environment, strongest proving evidence, and current gap.

### Phase 2 — Design the Test System

#### 2.1 Map claims to proving layers

- Map each material claim or risk to the least expensive proving layer: static, unit, component, contract,
  integration, browser, end-to-end, accessibility, security, performance, migration, recovery, or live
  operation.
- Name the system under test, boundary, inputs, observable outputs, authoritative effects, environment,
  versions, and evidence limits.
- Cover normal, alternative, exact-boundary, failure, recovery, adversarial, compatibility, concurrency, and
  counterfactual behavior in risk order.
- For accessibility-conformance claims, define scope, representative sampling, evaluation, and reporting
  consistent with [WCAG-EM](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/).

#### 2.2 Define mechanics, determinism, and order

- Define test data, setup, teardown, cleanup, isolation, fixtures, clocks, randomness, concurrency, network,
  order, retries, resources, and diagnostics.
- Decide where real dependencies are required and where a double provides a narrower valid claim; label every
  double and unavailable seam.
- Define focused, affected, integration, full, and environment-specific execution order, failure triage,
  quarantine, and recovery.
- Render the suite scaffold, ownership, environments, commands or tool entry points, and claim-to-evidence
  mapping before broad implementation.

### Phase 3 — Build from Low-Level Evidence Outward

#### 3.1 Build deterministic foundations

- Materialize suite structure, fixtures, data builders, environment controls, clocks, randomness controls,
  diagnostics, cleanup, and test seams.
- Implement deterministic static, unit, component, and contract tests for high-risk low-level behavior.
- Assert behavior through stable public or user-visible surfaces instead of private implementation details.
- Run each foundation independently and repeatedly; repair leakage, order dependence, nondeterminism, or
  unclear diagnosis before connecting broader seams.

#### 3.2 Connect real seams and representative paths

- Connect real contracts, databases, queues, providers, browser contexts, migrations, and other required
  dependencies outward.
- Add integration and representative browser or end-to-end paths for claims unavailable at lower layers.
- Add failure, recovery, accessibility, security, performance, compatibility, migration, and concurrency
  slices according to risk.
- Grow one complete risk slice at a time and preserve the exact limits of mocks, screenshots, snapshots,
  emulation, and unavailable environments.

### Phase 4 — Run, Diagnose, and Report

#### 4.1 Run the evidence sequence and diagnose failures

- Run focused, affected, integration, full, and required environment-specific checks in the defined order.
- Reproduce each failure at the smallest owning layer and classify product defect, test defect, environment
  defect, flake, contract drift, or unsupported claim.
- Fix or route the real cause; never retry until green, update snapshots blindly, or hide failure through
  skip or quarantine.
- Re-run affected evidence and the required wider set, preserving unresolved failures, flakes, and
  environment gaps.
- When this test system is evaluated, the [evaluation checklist](checklists.md) and every checklist owned by
  an active `web` sibling supply the applicable conditions; the general Evaluation operation resolves them and
  issues any verdict.

#### 4.2 Reconcile claims with results

- Reconcile every material claim with result, environment, version, real or doubled seams, skips, flakes,
  diagnostics, and limitations.
- Report focused, affected, integration, full, accessibility, security, visual, performance, browser,
  migration, recovery, and live evidence without upgrading one signal into another.
- Record reproduction, owner, impact, disposition, residual risk, and reopen condition for every unresolved
  gap.
- Hand results to `web-development` or the requesting caller, keeping release, deployment, conformance, and live
  health separate.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
