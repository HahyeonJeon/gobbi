# Electron Testing Evaluation Checklist

This reusable unchecked source evaluates Electron behavior-and-evidence test work outside the narrower
adversarial security-decision-point subject.
It is governed by the [`electron` domain](../SKILL.md) and [`electron-testing` operation](SKILL.md). Runtime,
Interface, Design, Contract, Development, Observability, Packaging, and Release retain the claims and
decisions tested here. Testing alone owns Electron-specific test design, test implementation, execution,
interpretation, environment classification, rerun decisions, and evidence records.

The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`ELECTST`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line follows the scenario's owned rows
and points to one previously defined row. Each reused row appears on only one `Also applies` line.

## Project

### ELECTST-SC-PROJECT-01 — Normal case: the request and evidence subject have exact identities

Ordinary test work starts from a traceable lower-tier claim and a unique request. The expected result keeps
the subject, target, environment, and pass conditions exact so another person can tell what every result
does and does not establish.

#### Checklist

- [ ] ELECTST-CK-PROJECT-01-01 — Every Packaging or Release Testing request and return preserves one unique request identity, requesting owner, exchange type, lower-tier claim, and lower-tier record identity.
- [ ] ELECTST-CK-PROJECT-01-02 — The request records the exact source or candidate subject, target operating system, architecture, Electron major, test inputs, and required environment.
- [ ] ELECTST-CK-PROJECT-01-03 — Every requested scenario states its starting state, trigger, expected observation, pass condition, material risks, and failure conditions.

### ELECTST-SC-PROJECT-02 — Rule violation: Testing leaves its sole authority or takes product authority

Testing makes a suite green by changing product code or takes a decision that belongs to another Electron
owner. The expected result keeps all test work inside Testing and returns every product or decision need to
its owner.

#### Checklist

- [ ] ELECTST-CK-PROJECT-02-01 — Testing alone owns the test design, test implementation, execution, interpretation, environment classification, rerun decision, and evidence record.
- [ ] ELECTST-CK-PROJECT-02-02 — Testing makes no product-policy, product-code, artifact-construction, artifact-mutation, candidate-acceptance, readiness, publication, rollout, or complete-delivery decision.

### ELECTST-SC-PROJECT-03 — Expected failure: a required execution environment is unavailable

The requested operating system, display driver, permission, service, credential, signing prerequisite, or
installed state is unavailable. The expected result reports the missing environment and stops the affected
claim without substituting a proxy observation.

#### Checklist

- [ ] ELECTST-CK-PROJECT-03-01 — Every unavailable or incompatible required environment is classified as `environment gap` and never as `passed`.
- [ ] ELECTST-CK-PROJECT-03-02 — Every environment stop records the affected claim, blocker, last accepted state, retained diagnostic facts, and narrowest resume point.
- Also applies: ELECTST-CK-PROJECT-01-02 (the subject, target, and required environment have exact identities).

## Structure

### ELECTST-SC-STRUCTURE-01 — Normal case: each claim uses the lowest-cost observable test layer

Pure logic, construction checks, services, bridges, Electron integration, security, lifecycle, packaged,
installed, and update work observe different claims. The expected result starts at the lowest layer that can
disprove the claim and records why a higher layer is required.

#### Checklist

- [ ] ELECTST-CK-STRUCTURE-01-01 — Every claim maps to the lowest-cost test layer that can observe its pass condition.
- [ ] ELECTST-CK-STRUCTURE-01-02 — Every selected higher-cost layer names the observation that all lower layers cannot make.
- [ ] ELECTST-CK-STRUCTURE-01-03 — The existing test framework, helpers, fixtures, launchers, and commands are preserved when they can observe the claim.
- [ ] ELECTST-CK-STRUCTURE-01-04 — Every test double exposes only the requested contract.
- [ ] ELECTST-CK-STRUCTURE-01-05 — No test double recreates Electron internals.

### ELECTST-SC-STRUCTURE-02 — Edge case: construction evidence is offered as behavior evidence

A source reading, type check, or build succeeds, but the requested claim concerns loader, process,
authorization, installed, or update behavior. The expected result labels construction evidence separately
and runs the semantic layer.

#### Checklist

- [ ] ELECTST-CK-STRUCTURE-02-01 — Source inspection, type checks, and build checks remain labeled as construction evidence rather than behavior evidence.
- [ ] ELECTST-CK-STRUCTURE-02-02 — No document parsing, source search, declaration generation, or construction result substitutes for an executed semantic Electron test.

## Performance

### ELECTST-SC-PERFORMANCE-01 — Normal case: execution cost and measured behavior remain controlled

The evidence plan contains cheap focused checks and expensive process, installed, or update cases. The
expected result runs in rising cost order while measuring any requested performance or resource claim in the
environment that can observe it.

#### Checklist

- [ ] ELECTST-CK-PERFORMANCE-01-01 — Pure logic, construction, service, and bridge checks run before real Electron, security, lifecycle, packaged, installed, and update cases.
- [ ] ELECTST-CK-PERFORMANCE-01-02 — Every requested performance or resource claim records its measurement environment, threshold, measured result, and evidence location.

## Aesthetics

### ELECTST-SC-AESTHETICS-01 — Poor quality: a result is unreadable or cannot be attributed

The suite runs, but the record hides identity, mixes evidence classes, or omits the output needed to
reproduce a failure. The expected result is concise, labeled, sanitized, and attributable.

#### Checklist

- [ ] ELECTST-CK-AESTHETICS-01-01 — Every case record shows the request, subject, target, test, fixture, runner, configuration, environment, command, time, exit status, and classification identities.
- [ ] ELECTST-CK-AESTHETICS-01-02 — Output sanitization retains every relevant diagnostic fact.
- [ ] ELECTST-CK-AESTHETICS-01-03 — Construction, real-Electron runtime, security, application-lifecycle, diagnostics, packaged, installed, and update evidence use distinct labels.
- [ ] ELECTST-CK-AESTHETICS-01-04 — Every retained output item has an evidence location.

## Usage

### ELECTST-SC-USAGE-01 — Normal case: the complete installed lifecycle has explicit evidence

An installed application moves through creation, ordinary use, interruption, transition, removal, and
recovery. The expected result gives every applicable transition its own case and records an
evidence-supported exclusion for every inapplicable one.

#### Checklist

- [ ] ELECTST-CK-USAGE-01-01 — Every applicable installation, partial-install recovery, first launch, initialization, ready, active-window, no-window, background or tray-only, window-recreation, last-window-close, close-versus-quit, second-instance, suspend, resume, ordinary-quit, stopped, relaunch, shutdown, update-restart, migration, validation, version-reporting, refusal, uninstall, and recovery transition has an independent case.
- [ ] ELECTST-CK-USAGE-01-02 — Every lifecycle case records accepted input and local-data treatment, cancellation or timeout, visible result or failure, cleanup, diagnostics, recovery or support, and an installed observation.

### ELECTST-SC-USAGE-02 — Edge case: one external-entry route stands in for the other three

Deep links and file opens reach cold and running applications through different timing and delivery paths.
The expected result proves all four paths independently on each requested target.

#### Checklist

- [ ] ELECTST-CK-USAGE-02-01 — Cold-start deep-link evidence proves registration and cold launch, capture before readiness, URL and authority validation, delivery after readiness, correct instance and window, visible result or refusal, preserved input, duplicate handling, recovery, diagnostics, and installed observation.
- [ ] ELECTST-CK-USAGE-02-02 — Running-application deep-link evidence proves validation before side effects, one delivery to the correct existing instance and current or created window, preserved current work, visible result or failure, duplicate handling, recovery, diagnostics, and installed observation.
- [ ] ELECTST-CK-USAGE-02-03 — Cold-start file-open evidence proves file association and cold launch, capture before readiness, file reference, type, access, and contract validation, delivery after readiness, correct instance and window, open or visible refusal, preserved input, recovery, diagnostics, and installed observation.
- [ ] ELECTST-CK-USAGE-02-04 — Running-application file-open evidence proves validation before side effects, one delivery to the correct existing instance and current or created window, preserved current work, open or visible failure, duplicate handling, recovery, diagnostics, and installed observation.

### ELECTST-SC-USAGE-03 — Expected failure: a hang or process exit loses its distinct evidence path

A renderer hangs or a process disappears. The expected result observes the exact Electron signal, data and
user effect, containment, recovery, and diagnostics instead of reporting one generic crash case.

#### Checklist

- [ ] ELECTST-CK-USAGE-03-01 — Every member of this process-signal set remains a separate evidence path: renderer `unresponsive` and `responsive`, renderer `render-process-gone`, utility-process `exit`, `child-process-gone`, and main-process exit with external crash capture.
- [ ] ELECTST-CK-USAGE-03-02 — Every member of the process-signal set proves its applicable outcome: visible effect and recovery for a renderer hang or exit, and containment or visible stop for utility, child, or main-process exit.

### ELECTST-SC-USAGE-04 — Normal case: the Packaging and Testing work records round-trip unchanged

Packaging supplies an immutable candidate and requested packaged or installed cases. The expected result
returns evidence for the same candidate and lets Packaging alone accept or reject it.

#### Checklist

- [ ] ELECTST-CK-USAGE-04-01 — The `Packaging ↔ Testing` request records its request identity, build-input identity, candidate checksum, artifact path, target operating system and architecture, installation instructions, claims, cases, required environments, and pass conditions.
- [ ] ELECTST-CK-USAGE-04-03 — Packaging alone checks the returned record for completeness and identity.
- [ ] ELECTST-CK-USAGE-04-04 — The Testing return adds environment classifications, commands, observations, classifications, evidence locations, failures, limitations, blockers, rerun links, and narrowest reproduction.
- [ ] ELECTST-CK-USAGE-04-05 — Packaging alone accepts or rejects the candidate.
- Also applies: ELECTST-CK-PROJECT-01-01 (Packaging request and return identities remain unchanged).
- Also applies: ELECTST-CK-PROJECT-02-02 (Testing neither mutates an artifact nor decides candidate acceptance).
- Also applies: ELECTST-CK-PROJECT-03-02 (an unavailable required environment returns an explicit stop).

### ELECTST-SC-USAGE-05 — Normal case: the Release and Testing work records round-trip unchanged

Release supplies candidate, predecessor, update, metadata, policy, and recovery claims. The expected result
returns evidence for those exact identities and lets Release alone decide readiness.

#### Checklist

- [ ] ELECTST-CK-USAGE-05-01 — The `Release ↔ Testing` request records its request and candidate identities, checksum, target operating system and architecture, predecessor set, update mechanism, release-metadata identity, channel, compatibility policy, rollout, withdrawal, recovery, scenarios, required environments, and pass conditions.
- [ ] ELECTST-CK-USAGE-05-03 — Release alone interprets release policy.
- [ ] ELECTST-CK-USAGE-05-04 — The Testing return classifies every requested predecessor, update, install, restart, migration, version-reporting, recovery, rejection, interruption, and tamper case.
- [ ] ELECTST-CK-USAGE-05-05 — Release alone checks the identity-matched returned record.
- Also applies: ELECTST-CK-PROJECT-03-01 (an unavailable required environment cannot become a pass).

## Consistency

### ELECTST-SC-CONSISTENCY-01 — Normal case: every case has one evidence-based classification

The same output could be mislabeled as product, test, environment, support, or execution trouble. The
expected result uses the six Testing classifications literally and preserves the first failure.

#### Checklist

- [ ] ELECTST-CK-CONSISTENCY-01-01 — Every requested case has exactly one of `passed`, `product defect`, `test defect`, `environment gap`, `unsupported target or claim`, or `not run`.
- [ ] ELECTST-CK-CONSISTENCY-01-02 — Every classification is supported by the observed claim, test validity, required environment, lower-tier support record, or execution record that defines that class.
- [ ] ELECTST-CK-CONSISTENCY-01-03 — The first failing command, output, subject, environment, evidence location, responsible owner, and narrowest reproduction are preserved.

### ELECTST-SC-CONSISTENCY-02 — Edge case: changed premises leave old evidence current

A subject, test, environment, candidate, target, predecessor, or policy changes after evidence exists. The
expected result invalidates the affected dependency set, preserves the old record, and creates linked rerun
evidence.

#### Checklist

- [ ] ELECTST-CK-CONSISTENCY-02-01 — A subject, test, fixture, configuration, environment, Electron-major, candidate, release-metadata, target, predecessor, channel, update-mechanism, policy, or required-environment change invalidates every affected and dependent result.
- [ ] ELECTST-CK-CONSISTENCY-02-02 — Every affected and dependent case reruns with a new run identity that links to the preserved invalidated result.
- [ ] ELECTST-CK-CONSISTENCY-02-03 — A proved `test defect` is corrected only in authorized test code, fixtures, runner settings, or test configuration.
- [ ] ELECTST-CK-CONSISTENCY-02-04 — The failed and corrected test identities remain in the evidence history.

## Risk

Adversarial security decision-point observation is outside this narrower behavior-and-evidence subject.

## Overall

### ELECTST-SC-OVERALL-01 — Normal case: the terminal evidence record is complete and routed

Every requested case needs a literal disposition, reproducible evidence, and a destination. The expected
result returns one complete record or an exact stop to every affected lower-tier owner.

#### Checklist

- [ ] ELECTST-CK-OVERALL-01-01 — The terminal record contains every evidence, request, claim, subject, source, configuration, candidate, release, target, test, fixture, runner, environment, prerequisite, scenario, command, result, classification, output, evidence-location, failure, correction, invalidation, dependency, rerun, blocker, limitation, risk, owner, reproduction, predecessor-evidence, and replacement-evidence field that applies.
- [ ] ELECTST-CK-OVERALL-01-02 — Every requested case has one exact classification, or the stopped result names the failed request and case, last accepted state, retained evidence, responsible owner, required next input, and narrowest resume point.
- [ ] ELECTST-CK-OVERALL-01-03 — The record is returned to every affected lower-tier owner.
- [ ] ELECTST-CK-OVERALL-01-04 — The dynamic Packaging and Release identities remain unchanged in the terminal record.
- Also applies: ELECTST-CK-AESTHETICS-01-03 (every evidence class has a distinct label).
- Also applies: ELECTST-CK-AESTHETICS-01-02 (retained output is sanitized and attributable).

### ELECTST-SC-OVERALL-02 — Adversarial: proxy evidence is generalized into complete assurance

A passing type check, unit test, development launch, one handler, one target, or diagnostic is presented as
proof of a different property. The expected result limits every claim to the cases and observations that
actually ran.

#### Checklist

- [ ] ELECTST-CK-OVERALL-02-01 — No construction result proves behavior, unit result proves real-Electron behavior, development launch proves packaged or installed behavior, one security control proves another, diagnostic presence proves recovery, or one target proves another.
- Also applies: ELECTST-CK-STRUCTURE-02-02 (semantic claims require executed semantic evidence).
