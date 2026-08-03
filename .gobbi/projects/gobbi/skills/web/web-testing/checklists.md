# Web Testing Evaluation Checklist

This reusable unchecked source evaluates one web test system produced under this operation, against the
risk-derived-suite, owning-boundary, real-seam, determinism, matched-evidence, and unresolved-gap obligations
this skill owns. It is governed by the [`web`](../SKILL.md) domain and [`web-testing`](SKILL.md) operation,
with [`web-platform`](../web-platform/SKILL.md) owning browser facts,
[`web-security`](../web-security/SKILL.md) owning the threat-to-evidence contract,
[`web-frontend`](../web-frontend/SKILL.md) and [`web-backend`](../web-backend/SKILL.md) owning the behavior
under test, and [`web-development`](../web-development/SKILL.md) as the caller that binds the outcome. The source
commit that contains this file identifies the checklist version. Its stable owner prefix is `WEBTEST`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBTEST-SC-PROJECT-01 — Normal case: the suite is derived from contracts, incidents, and risks

A test system is being built or extended, and there is always a familiar shape to copy instead. The expected
outcome derives the suite from what this product claims and where it has failed; a suite shaped by a pyramid
diagram or a coverage target is the failure.

#### Checklist

- [ ] WEBTEST-CK-PROJECT-01-01 — The suite is derived from contracts, incidents, risks, supported environments, and release claims.
- [ ] WEBTEST-CK-PROJECT-01-02 — No fixed pyramid or coverage percentage replaces the risk analysis.
- [ ] WEBTEST-CK-PROJECT-01-03 — The work continues with one bounded evidence outcome.
- [ ] WEBTEST-CK-PROJECT-01-04 — An undefined contract, unsupported claim, missing environment, or owner conflict is returned rather than assumed.
- [ ] WEBTEST-CK-PROJECT-01-05 — Each material claim records its owner, risk, supported environment, strongest proving evidence, and current gap.

### WEBTEST-SC-PROJECT-02 — Normal case: claims and facts stay with their owners

The suite proves other people's claims, and the temptation is to settle a product or platform question inside
a test. The expected outcome loads the owners and takes their claims as given; a test that decides what the
behavior should be is the failure.

#### Checklist

- [ ] WEBTEST-CK-PROJECT-02-01 — The affected frontend, backend, platform, security, accessibility, performance, coding, language, framework, and test-tool owners are loaded.
- [ ] WEBTEST-CK-PROJECT-02-02 — Each of those owners supplies its own claims and facts.
- [ ] WEBTEST-CK-PROJECT-02-03 — The behavior under test is not decided inside this operation.
- [ ] WEBTEST-CK-PROJECT-02-04 — Published testing guidance is used as evidence rather than as a universal quota or a fixed suite shape.

## Structure

### WEBTEST-SC-STRUCTURE-01 — Normal case: each claim is mapped to the least expensive proving layer

Every claim can be proven somewhere, and the cheapest place that can still establish it is the right one. The
expected outcome maps each claim to a layer and names what that test observes; a layer chosen by habit rather
than by what the claim needs is the failure.

#### Checklist

- [ ] WEBTEST-CK-STRUCTURE-01-01 — Each material claim or risk is mapped to the least expensive layer that can establish it without replacing the real seam it depends on.
- [ ] WEBTEST-CK-STRUCTURE-01-02 — Each mapped test names its system under test, boundary, inputs, observable outputs, authoritative effects, environment, versions, and evidence limits.
- [ ] WEBTEST-CK-STRUCTURE-01-03 — Normal, alternative, exact-boundary, failure, recovery, adversarial, compatibility, concurrency, and counterfactual behavior are covered in risk order.

### WEBTEST-SC-STRUCTURE-02 — Normal case: deterministic foundations exist before broad implementation

Tests written over an unsettled harness inherit its leakage and its ordering. The expected outcome
materializes the controls and the scaffold first and proves each foundation in isolation; breadth added over
an unrepaired foundation is the failure.

#### Checklist

- [ ] WEBTEST-CK-STRUCTURE-02-01 — Suite structure, fixtures, data builders, environment controls, clocks, randomness controls, diagnostics, cleanup, and test seams are materialized first.
- [ ] WEBTEST-CK-STRUCTURE-02-02 — The suite scaffold, ownership, environments, commands or tool entry points, and claim-to-evidence mapping are rendered before broad implementation.
- [ ] WEBTEST-CK-STRUCTURE-02-03 — Each foundation runs independently and repeatedly before broader seams are connected.
- [ ] WEBTEST-CK-STRUCTURE-02-04 — Leakage, order dependence, nondeterminism, or unclear diagnosis is repaired before broader seams are connected.

### WEBTEST-SC-STRUCTURE-03 — Rule violation: assertions reach into implementation details

A test reads a private field, a rendered class name, or an internal call order, so a safe refactoring breaks
the suite. The expected outcome asserts observable behavior at the owning boundary; a test that fails for a
change the product's consumers cannot see is the failure.

#### Checklist

- [ ] WEBTEST-CK-STRUCTURE-03-01 — Behavior is asserted at the owning boundary through stable public or user-visible surfaces.
- [ ] WEBTEST-CK-STRUCTURE-03-02 — No assertion depends on an implementation detail that turns a safe refactoring into a product failure.

## Performance

### WEBTEST-SC-PERFORMANCE-01 — Normal case: the suite's cost and execution order are defined

A suite that cannot be run selectively gets run less often, and one whose cost is unmeasured grows until it is
skipped. The expected outcome defines the execution order and records the cost; an undifferentiated suite with
no measured cost is the failure.

#### Checklist

- [ ] WEBTEST-CK-PERFORMANCE-01-01 — Focused, affected, integration, full, and environment-specific execution order, failure triage, quarantine, and recovery are defined.
- [ ] WEBTEST-CK-PERFORMANCE-01-02 — Suite cost, duration, ownership, and failure history are recorded.
- Also applies: WEBTEST-CK-STRUCTURE-01-01 (the least expensive proving layer is chosen per claim).

## Aesthetics

### WEBTEST-SC-AESTHETICS-01 — Poor quality: a failure arrives with nothing to act on

The suite finds real defects, but a failure reports only that an assertion did not hold, so the owner cannot
tell what broke or where. The expected outcome reproduces and classifies every failure at its smallest owning
layer; a red result nobody can route is the failure.

#### Checklist

- [ ] WEBTEST-CK-AESTHETICS-01-01 — Every failure is reproduced at the smallest owning layer.
- [ ] WEBTEST-CK-AESTHETICS-01-02 — Every failure is classified as a product defect, test defect, environment defect, flake, contract drift, or unsupported claim.
- [ ] WEBTEST-CK-AESTHETICS-01-03 — Diagnostics are defined so that each failure is actionable at its owner.

## Usage

### WEBTEST-SC-USAGE-01 — Normal case: human and conformance claims get evidence that can establish them

A claim about accessibility, security, appearance, speed, browsers, migration, recovery, or live operation is
being proven. The expected outcome matches each to evidence of the right kind; an automated pass reported as
conformance or as a human outcome is the failure.

#### Checklist

- [ ] WEBTEST-CK-USAGE-01-01 — Accessibility, security, visual, performance, browser, migration, recovery, and live-operation claims are each matched to evidence that can establish them.
- [ ] WEBTEST-CK-USAGE-01-02 — Automation alone is not treated as establishing conformance or a human outcome.
- [ ] WEBTEST-CK-USAGE-01-03 — Every accessibility-conformance claim defines scope, representative sampling, evaluation, and reporting consistent with WCAG-EM.

### WEBTEST-SC-USAGE-02 — Expected failure: a required environment or seam is unavailable

A host, a browser, a provider, or a migration target cannot be reached in this run. The expected outcome
records the limitation and leaves the dependent claim unproven; substituting the layer that happens to be
available is the failure.

#### Checklist

- [ ] WEBTEST-CK-USAGE-02-01 — An unavailable environment, host, or seam is recorded as a limitation rather than approximated.
- [ ] WEBTEST-CK-USAGE-02-02 — Every double and every unavailable seam is labelled.
- [ ] WEBTEST-CK-USAGE-02-03 — A claim depending on the missing seam is reported as unproven rather than downgraded to the layer that remains.

## Consistency

### WEBTEST-SC-CONSISTENCY-01 — Normal case: every material claim reconciles with its result

Results arrive from different layers, environments, and versions, and each answers a narrower question than
the release claim above it. The expected outcome reconciles each claim with what actually ran and keeps the
signals distinct; one layer's pass reported as another's is the failure.

#### Checklist

- [ ] WEBTEST-CK-CONSISTENCY-01-01 — Every material claim is reconciled with its result, environment, version, real or doubled seams, skips, flakes, diagnostics, and limitations.
- [ ] WEBTEST-CK-CONSISTENCY-01-02 — Focused, affected, integration, full, accessibility, security, visual, performance, browser, migration, recovery, and live evidence are reported without upgrading one signal into another.
- [ ] WEBTEST-CK-CONSISTENCY-01-03 — Release, deployment, conformance, and live health are kept separate at handoff.

## Risk

### WEBTEST-SC-RISK-01 — Rule violation: a real-seam claim rests on a double

A database, a provider, a browser context, or a migration is replaced by a stub, and the resulting pass is
reported as proof that the seam works. The expected outcome uses the real dependency for that claim and holds
every double to its stated limit; a doubled seam reported as the real one is the failure.

#### Checklist

- [ ] WEBTEST-CK-RISK-01-01 — Every claim about a real seam uses the real dependency.
- [ ] WEBTEST-CK-RISK-01-02 — A mock, fake, stub, screenshot, snapshot, or coverage report is reported only within its explicit limit.
- [ ] WEBTEST-CK-RISK-01-03 — Real contracts, databases, queues, providers, browser contexts, and migrations are connected for the claims that require them.
- [ ] WEBTEST-CK-RISK-01-04 — The exact limits of mocks, screenshots, snapshots, emulation, and unavailable environments are preserved as the suite grows.

### WEBTEST-SC-RISK-02 — Rule violation: nondeterminism is left uncontrolled

Time, randomness, ordering, concurrency, network, or leftover data decides whether a run passes. The expected
outcome controls those inputs or reports the limit they leave; a rerun used as the diagnosis is the failure.

#### Checklist

- [ ] WEBTEST-CK-RISK-02-01 — Time, randomness, order, concurrency, network, data, cleanup, and environment are controlled, or the resulting limit is reported.
- [ ] WEBTEST-CK-RISK-02-02 — No rerun is treated as a diagnosis.
- [ ] WEBTEST-CK-RISK-02-03 — No test is retried until it passes.

### WEBTEST-SC-RISK-03 — Adversarial: a green run is manufactured

A failing case is skipped, quarantined, or absorbed by a snapshot update, and the summary reports a clean run.
The expected outcome refuses to let any of those satisfy acceptance silently and records what each one costs;
a suite that is green because the failures were removed is the failure.

#### Checklist

- [ ] WEBTEST-CK-RISK-03-01 — No skip, quarantine, snapshot update, ignored failure, or known flake silently satisfies acceptance.
- [ ] WEBTEST-CK-RISK-03-02 — Each skip, quarantine, snapshot update, ignored failure, and known flake records its owner, impact, evidence gap, disposition, and reopen condition.
- [ ] WEBTEST-CK-RISK-03-03 — No snapshot is updated without diagnosing the change it encodes.
- [ ] WEBTEST-CK-RISK-03-04 — No failure is hidden through a skip or a quarantine instead of being fixed or routed to its owner.

### WEBTEST-SC-RISK-04 — Edge case: a claim sits between two proving layers

The cheapest layer can establish part of a claim but not its authoritative effect, so the claim straddles a
boundary. The expected outcome raises the part the cheaper layer cannot prove and states the narrower claim
the cheaper test does prove; collapsing the whole claim into the cheaper layer is the failure.

#### Checklist

- [ ] WEBTEST-CK-RISK-04-01 — A claim the cheapest layer cannot fully establish is raised to the layer that can, rather than narrowed to fit.
- [ ] WEBTEST-CK-RISK-04-02 — A double used at the cheaper layer provides a narrower valid claim that is stated as such.
- [ ] WEBTEST-CK-RISK-04-03 — Integration and representative browser or end-to-end paths are added only for claims unavailable at lower layers.

## Overall

### WEBTEST-SC-OVERALL-01 — Normal case: unresolved gaps leave with an owner and a reopen condition

A complete test outcome hands the caller what was proven, in which environment, with which seams, and what
remains open with somebody's name on it. The scenario fails when a re-run clears an unresolved failure from
the record, or when a gap reaches the caller without a disposition.

#### Checklist

- [ ] WEBTEST-CK-OVERALL-01-01 — Every unresolved gap records its reproduction, owner, impact, disposition, residual risk, and reopen condition.
- [ ] WEBTEST-CK-OVERALL-01-02 — Unresolved failures, flakes, and environment gaps are preserved through the re-run rather than cleared by it.
- Also applies: WEBTEST-CK-CONSISTENCY-01-03 (release, deployment, conformance, and live health kept separate).
