# Go Observability Evaluation Checklist

Unchecked evaluation source for Go observability work governed by [Go Observability](SKILL.md).

## Project

### GOOBS-SC-PROJECT-01 — Normal case: complete mode contract

- [ ] `GOOBS-CK-PROJECT-01-01` — The project-write boundary matches the mode: design/review and verification are read-only, while change writes only through authorized `go-development` work.
- [ ] `GOOBS-CK-PROJECT-01-02` — The local-output boundary matches the mode: approved design evidence, approved local diagnostics, or approved captured test diagnostics with a retention or cleanup boundary.
- [ ] `GOOBS-CK-PROJECT-01-03` — Every mode separately authorizes its exact Go cache and download effects.
- [ ] `GOOBS-CK-PROJECT-01-04` — The project-execution boundary matches the mode: read-only analysis, local verification, or bounded test-diagnostic emission through authorized named project commands.
- [ ] `GOOBS-CK-PROJECT-01-05` — The network boundary matches the mode: separately authorized access in design/review or change, and only one named authorized test destination in verification.
- [ ] `GOOBS-CK-PROJECT-01-06` — The selected mode pauses before its first unauthorized effect, verification's first send, or any changed authority bound.

### GOOBS-SC-PROJECT-02 — Expected failure: unsupported result boundary

- [ ] `GOOBS-CK-PROJECT-02-01` — The selected mode is explicit and inherits no authority from another mode or sibling.
- [ ] `GOOBS-CK-PROJECT-02-02` — The selected mode returns only its recognized design/review, local-change, arrival, or exact-block result.
- [ ] `GOOBS-CK-PROJECT-02-03` — A failed or blocked path retains only its approved local and external diagnostic state.
- [ ] `GOOBS-CK-PROJECT-02-04` — Web policy, production destination mutation, deployment, rollout, traffic, on-call, live-health, and generic incident-response results remain with their named owners.

## Structure

### GOOBS-SC-STRUCTURE-01 — Normal case: distinct exact schemas

- [ ] `GOOBS-CK-STRUCTURE-01-01` — Every structured-log schema names its event, version, timestamp source, severity meaning, typed stable attributes, result classification, correlation fields, and redaction disposition.
- [ ] `GOOBS-CK-STRUCTURE-01-02` — Every metric schema names its instrument, version, behavior, unit, aggregation, temporality, bounded attribute value sets, maximum series count, restart interpretation, and redaction disposition.
- [ ] `GOOBS-CK-STRUCTURE-01-03` — Every span schema names its operation, version, kind, trace and parent relationship, start and end conditions, status mapping, typed attributes or events or links, sampling owner, and redaction disposition.
- [ ] `GOOBS-CK-STRUCTURE-01-04` — Every crash-report schema names its crash class, version, process and build identity, selected Go toolchain version, occurrence and result, output kind, bounded annotations, collection path, destination record identity, and redaction disposition.
- [ ] `GOOBS-CK-STRUCTURE-01-05` — Every schema field has one type, requiredness, meaning, permitted value or cardinality bound, and protected-data disposition.
- [ ] `GOOBS-CK-STRUCTURE-01-06` — Every schema defines compatibility, maximum record size, serialization-failure behavior, and rejection of undeclared or wrongly typed fields.

### GOOBS-SC-STRUCTURE-02 — Edge case: panic and crash identity

- [ ] `GOOBS-CK-STRUCTURE-02-01` — A recovered-panic record identifies the original application result without being classified as fatal crash output.
- [ ] `GOOBS-CK-STRUCTURE-02-02` — An in-process stack mechanism is bound to the exact diagnostic question and selected Go toolchain support.
- [ ] `GOOBS-CK-STRUCTURE-02-03` — A fatal-crash mechanism is bound to selected Go toolchain support and never assumes that an in-process handler survives termination.

## Performance

### GOOBS-SC-PERFORMANCE-01 — Normal case: bounded non-interference

- [ ] `GOOBS-CK-PERFORMANCE-01-01` — Diagnostic encoding or emission cannot panic or throw an unhandled error into the application path.
- [ ] `GOOBS-CK-PERFORMANCE-01-02` — Diagnostic emission cannot block an application-critical operation or hold an application-critical lock while waiting.
- [ ] `GOOBS-CK-PERFORMANCE-01-03` — Diagnostic work preserves the application's accepted cancellation, timeout, error, panic, and shutdown semantics.
- [ ] `GOOBS-CK-PERFORMANCE-01-04` — Queue depth, worker count, buffering, overflow behavior, backpressure, flush, and retry concurrency are bounded through `go-concurrency` judgment.
- [ ] `GOOBS-CK-PERFORMANCE-01-05` — Log and span rates, metric-series cardinality, crash deduplication, record size, memory, CPU, and retention volume stay inside named budgets.
- [ ] `GOOBS-CK-PERFORMANCE-01-06` — Retry attempts, elapsed time, queue use, and concurrency stop before the observed operation degrades.

## Aesthetics

### GOOBS-SC-AESTHETICS-01 — Poor quality: cosmetic diagnostic design

- [ ] `GOOBS-CK-AESTHETICS-01-01` — Concrete claims name a structured log, metric, span, or crash report instead of hiding the fact behind a generic diagnostic label.
- [ ] `GOOBS-CK-AESTHETICS-01-02` — Event, instrument, operation, attribute, unit, severity, and crash-class names use one stable vocabulary understood by the named consumer.
- [ ] `GOOBS-CK-AESTHETICS-01-03` — A questionless or unowned log record, metric, span, or crash report is dropped even when its name, heading, or example payload looks complete.

## Usage

### GOOBS-SC-USAGE-01 — Normal case: design or review

- [ ] `GOOBS-CK-USAGE-01-01` — Design/review emits no production diagnostic output.
- [ ] `GOOBS-CK-USAGE-01-02` — Design/review pauses before code mutation, production emission, or a protected-data choice.
- [ ] `GOOBS-CK-USAGE-01-03` — Design/review returns confirmed diagnostic design, evidence-backed findings, or an exact block.

### GOOBS-SC-USAGE-02 — Normal case: authorized local change

- [ ] `GOOBS-CK-USAGE-02-01` — Change mode keeps destination sends disabled, replaced by an accepted local controllable dependency, or deferred to diagnostic-send verification.
- [ ] `GOOBS-CK-USAGE-02-02` — A required destination action has one named external-owner disposition: current matching returned owner, action, destination, authority, before and after state, time or action identity, redaction, and evidence limits, or an exact prerequisite, retained state, first recovery action, and handoff block.
- [ ] `GOOBS-CK-USAGE-02-03` — Change mode never inherits verification credentials, test destination access, diagnostic-send authority, or captured-output authority.

### GOOBS-SC-USAGE-03 — Edge case: bounded diagnostic-send verification

- [ ] `GOOBS-CK-USAGE-03-01` — Verification keeps project source read-only and creates only approved captured test diagnostics locally.
- [ ] `GOOBS-CK-USAGE-03-02` — Verification sends only bounded approved test records to one named authorized test destination with separately authorized named test credentials.
- [ ] `GOOBS-CK-USAGE-03-03` — Verification external mutation is limited to bounded test-record creation and excludes production mutation, provisioning, configuration, deletion, and recovery mutation.
- [ ] `GOOBS-CK-USAGE-03-04` — Verification stops all further sends after a command, transport, authority, schema, correlation, destination-read, redaction, access, or retention failure.

## Consistency

### GOOBS-SC-CONSISTENCY-01 — Normal case: one joined diagnostic contract

- [ ] `GOOBS-CK-CONSISTENCY-01-01` — Every retained log record, metric, span, and crash report answers one named diagnostic question for one named consumer and owner.
- [ ] `GOOBS-CK-CONSISTENCY-01-02` — Every retained record has one shortest responsible emission point tied to an actual result or failure path.
- [ ] `GOOBS-CK-CONSISTENCY-01-03` — Correlation identifiers join the intended stored records without being inferred across an unpropagated boundary.
- [ ] `GOOBS-CK-CONSISTENCY-01-04` — Sampling and aggregation rules remain coherent from their decision point through stored destination evidence.
- [ ] `GOOBS-CK-CONSISTENCY-01-05` — A traced Web request uses `web-observability`-owned semantic-convention names, `traceparent`, and applicable `tracestate` fields while Go context and cancellation mechanics remain with `go-concurrency`.

## Risk

### GOOBS-SC-RISK-01 — Rule violation: protected data or broadened authority

- [ ] `GOOBS-CK-RISK-01-01` — `go-security` classifies every protected-data type before its containing schema or allow-list is accepted.
- [ ] `GOOBS-CK-RISK-01-02` — Every application-built diagnostic record passes an allow-list that prevents protected values from being emitted.
- [ ] `GOOBS-CK-RISK-01-03` — Every stored-record protected-data check proves that no credential, token, private setting, personal field, regulated value, session identifier, or other protected value is retained.
- [ ] `GOOBS-CK-RISK-01-04` — Credential use is recorded separately and correctly as none in design/review, none in change, and only the exact authorized named test credential in diagnostic-send verification.
- [ ] `GOOBS-CK-RISK-01-05` — External mutation is recorded separately and correctly as none in design/review, forbidden in change, and only bounded test-record creation in diagnostic-send verification.
- [ ] `GOOBS-CK-RISK-01-06` — A protected value, changed authority bound, or required forbidden destination action stops emission.

## Overall

### GOOBS-SC-OVERALL-01 — Adversarial: completion without destination proof

- [ ] `GOOBS-CK-OVERALL-01-01` — The terminal state is exactly one of success, error, cancellation, timeout, blocked, or user-decision pause, and a Go panic appears only as program behavior.
- [ ] `GOOBS-CK-OVERALL-01-02` — The terminal record contains every applicable universal result, decision, object, path, evidence, limit, external-effect, compatibility, block, recovery, and handoff field.
- [ ] `GOOBS-CK-OVERALL-01-03` — The terminal record contains the diagnostic questions, exact schemas, propagation limits, redaction allow-list, destination, access owner, retention, and mode-specific authority facts.
- [ ] `GOOBS-CK-OVERALL-01-04` — Arrival evidence comes from a destination read and names the destination, stored record identifier, destination observation time or action identifier, schema match, correlation match, access owner, retention, stored-record redaction result, and evidence limits.
- [ ] `GOOBS-CK-OVERALL-01-05` — Missing, stale, duplicate-ambiguous, wrong-destination, schema-mismatched, correlation-mismatched, or protected destination evidence produces an exact block with prerequisite or first useful diagnostic, affected obligation, current evidence, risk, retained state, owner, first recovery action, and handoff.
- [ ] `GOOBS-CK-OVERALL-01-06` — A sender acknowledgement, clean local command, expected heading, or example payload cannot substitute for the mode's recognized result.
