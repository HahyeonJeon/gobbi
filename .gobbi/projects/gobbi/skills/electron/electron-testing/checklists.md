# Electron Testing Evaluation Checklist

This reusable unchecked source evaluates one body of Electron-specific test work and its returned evidence.
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

- [ ] ELECTST-CK-PROJECT-01-01 — The request records one unique request identity, requesting owner, exchange type, lower-tier claim, and lower-tier record identity.
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
- [ ] ELECTST-CK-STRUCTURE-01-04 — Every test double exposes only the requested contract and does not recreate Electron internals.

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
- [ ] ELECTST-CK-AESTHETICS-01-02 — Relevant output is sanitized without removing diagnostic facts, and each retained item has an evidence location.
- [ ] ELECTST-CK-AESTHETICS-01-03 — Construction, real-Electron runtime, security, application-lifecycle, diagnostics, packaged, installed, and update evidence use distinct labels.

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

- [ ] ELECTST-CK-USAGE-03-01 — Renderer `unresponsive` and `responsive` transitions remain separate from renderer `render-process-gone` evidence, and each applicable path proves its visible effect and recovery.
- [ ] ELECTST-CK-USAGE-03-02 — Utility-process `exit`, `child-process-gone`, and main-process exit with external crash capture remain separate evidence paths, and each applicable path proves containment or visible stop.

### ELECTST-SC-USAGE-04 — Normal case: the Packaging and Testing work records round-trip unchanged

Packaging supplies an immutable candidate and requested packaged or installed cases. The expected result
returns evidence for the same candidate and lets Packaging alone accept or reject it.

#### Checklist

- [ ] ELECTST-CK-USAGE-04-01 — The `Packaging ↔ Testing` request records its request identity, build-input identity, candidate checksum, artifact path, target operating system and architecture, installation instructions, claims, cases, required environments, and pass conditions.
- [ ] ELECTST-CK-USAGE-04-02 — The Testing return repeats the request, build-input, candidate, target, and case identities and adds environment classifications, commands, observations, classifications, evidence locations, failures, limitations, blockers, rerun links, and narrowest reproduction.
- [ ] ELECTST-CK-USAGE-04-03 — Packaging alone checks completeness and identity and accepts or rejects the candidate; Testing does not alter the artifact or make that decision.
- Also applies: ELECTST-CK-PROJECT-03-02 (an unavailable required environment returns an explicit stop).

### ELECTST-SC-USAGE-05 — Normal case: the Release and Testing work records round-trip unchanged

Release supplies candidate, predecessor, update, metadata, policy, and recovery claims. The expected result
returns evidence for those exact identities and lets Release alone decide readiness.

#### Checklist

- [ ] ELECTST-CK-USAGE-05-01 — The `Release ↔ Testing` request records its request and candidate identities, checksum, target operating system and architecture, predecessor set, update mechanism, release-metadata identity, channel, compatibility policy, rollout, withdrawal, recovery, scenarios, required environments, and pass conditions.
- [ ] ELECTST-CK-USAGE-05-02 — The Testing return repeats every request identity and classifies every requested predecessor, update, install, restart, migration, version-reporting, recovery, rejection, interruption, and tamper case.
- [ ] ELECTST-CK-USAGE-05-03 — Release alone interprets release policy, checks the identity-matched returned record, and accepts readiness or stops.
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
- [ ] ELECTST-CK-CONSISTENCY-02-03 — A proved `test defect` is corrected only in authorized test code, fixtures, runner settings, or test configuration, with the failed and corrected test identities retained.

## Risk

### ELECTST-SC-RISK-01 — Normal case: privilege rejection is observed at the responsible process

A renderer reaches a privileged capability through a preload bridge. The expected result proves exact bridge
shape and rejection before side effects rather than relying on types or a renderer-only assertion.

#### Checklist

- [ ] ELECTST-CK-RISK-01-01 — The privileged process rejects missing or detached `event.senderFrame`, wrong sender origin, and malformed payload before any side effect.
- [ ] ELECTST-CK-RISK-01-02 — The preload exposes only accepted domain methods, sends data-only callbacks, serializes accepted values, reports unavailable capabilities, and removes subscriptions through its disposer.
- [ ] ELECTST-CK-RISK-01-03 — Every activated trust surface has its own observable adversarial case, so one installed handler cannot substitute for another control.

### ELECTST-SC-RISK-02 — Adversarial: content policy and renderer preferences are attacked independently

An unsafe renderer can arrive through content delivery or an explicit preference. The expected result attacks
each route and each key separately and observes the created renderer or pre-creation rejection.

#### Checklist

- [ ] ELECTST-CK-RISK-02-01 — Absent and weak `Content-Security-Policy` values are separate cases on every renderer delivery path.
- [ ] ELECTST-CK-RISK-02-02 — Every content-policy case observes the response header or document policy and proves a disallowed script or resource is blocked.
- [ ] ELECTST-CK-RISK-02-03 — `nodeIntegration`, `contextIsolation`, `sandbox`, `webSecurity`, `allowRunningInsecureContent`, `experimentalFeatures`, and `enableBlinkFeatures` each have an independent real-Electron observation.
- [ ] ELECTST-CK-RISK-02-04 — Every security-reducing value is rejected before renderer creation or has an authority record and a limited real-Electron exception case.

### ELECTST-SC-RISK-03 — Adversarial: session, navigation, window, and guest paths evade one central check

An attacker uses a secondary session, later-created contents, a redirect, a child window, or guest attachment.
The expected result reaches each distinct decision point and proves denial before the protected effect.

#### Checklist

- [ ] ELECTST-CK-RISK-03-01 — `setPermissionCheckHandler` and `setPermissionRequestHandler` are exercised separately on the default and every secondary session or partition with varied requesting origin, embedding origin, frame facts, and permission, asserting the accepted default denial.
- [ ] ELECTST-CK-RISK-03-02 — Allowed and denied main-frame, subframe, and redirect navigation are exercised through `will-navigate`, `will-frame-navigate`, and `will-redirect` on initial and later-created `webContents`.
- [ ] ELECTST-CK-RISK-03-03 — Initial, later-created, and secondary-session child-window requests are decided by `setWindowOpenHandler` before any denied child is created.
- [ ] ELECTST-CK-RISK-03-04 — Disallowed guest URL, preload, preferences, and requested partition values are each denied at `will-attach-webview` before any guest is created.

### ELECTST-SC-RISK-04 — Adversarial: denied external input or diagnostics hide a security failure

An external URL, protocol path, IPC request, or malformed payload bypasses validation, or the test weakens a
security control to expose diagnostics. The expected result attempts each reachable path and retains
diagnostics without altering the control.

#### Checklist

- [ ] ELECTST-CK-RISK-04-01 — Every reachable denied external-URL, custom-protocol traversal, wrong-origin IPC, and malformed-payload path is attempted independently.
- [ ] ELECTST-CK-RISK-04-02 — Renderer, main-process, crash, hang, and operating-system diagnostics are recorded through the accepted Observability mechanism without weakening a security control or changing production emission.

## Overall

### ELECTST-SC-OVERALL-01 — Normal case: the terminal evidence record is complete and routed

Every requested case needs a literal disposition, reproducible evidence, and a destination. The expected
result returns one complete record or an exact stop to every affected lower-tier owner.

#### Checklist

- [ ] ELECTST-CK-OVERALL-01-01 — The terminal record contains every evidence, request, claim, subject, source, configuration, candidate, release, target, test, fixture, runner, environment, prerequisite, scenario, command, result, classification, output, evidence-location, failure, correction, invalidation, dependency, rerun, blocker, limitation, risk, owner, reproduction, predecessor-evidence, and replacement-evidence field that applies.
- [ ] ELECTST-CK-OVERALL-01-02 — Every requested case has one exact classification, or the stopped result names the failed request and case, last accepted state, retained evidence, responsible owner, required next input, and narrowest resume point.
- [ ] ELECTST-CK-OVERALL-01-03 — The record is returned to every affected lower-tier owner with the dynamic Packaging and Release identities unchanged and every evidence class labeled distinctly.
- Also applies: ELECTST-CK-AESTHETICS-01-02 (retained output is sanitized and attributable).

### ELECTST-SC-OVERALL-02 — Adversarial: proxy evidence is generalized into complete assurance

A passing type check, unit test, development launch, one handler, one target, or diagnostic is presented as
proof of a different property. The expected result limits every claim to the cases and observations that
actually ran.

#### Checklist

- [ ] ELECTST-CK-OVERALL-02-01 — No construction result proves behavior, unit result proves real-Electron behavior, development launch proves packaged or installed behavior, one security control proves another, diagnostic presence proves recovery, or one target proves another.
- Also applies: ELECTST-CK-STRUCTURE-02-02 (semantic claims require executed semantic evidence).
