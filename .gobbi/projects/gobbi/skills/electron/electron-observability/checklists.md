# Electron Observability Evaluation Checklist

This reusable unchecked source evaluates one bounded Electron diagnostic-emission outcome produced under the
Electron Observability operation. The source commit that contains this file identifies the checklist version.
Its stable owner prefix is `ELECOBS`.

This file defines reusable evaluation-checklist coverage only. It defines no test specification, evidence
metadata, row result, severity, score, verdict, or remediation instruction. Preserve every row as an
unchecked binary condition.

A row is defined once beneath its owning scenario. An `Also applies` line reuses a row defined elsewhere,
carries no checkbox, and creates no second condition.

## Project

### ELECOBS-SC-PROJECT-01 — Normal case: one diagnostic outcome has a named purpose and subject

An ordinary implementation or read-only review starts with a bounded diagnostic question, consumer, and
exact source, artifact, target operating system and architecture, and process record. It succeeds when
authority and intended claims are clear; emission added because it is convenient is the failure.

#### Checklist

- [ ] ELECOBS-CK-PROJECT-01-01 — The subject is one bounded Electron diagnostic-emission outcome.
- [ ] ELECOBS-CK-PROJECT-01-02 — Every signal is associated with one named diagnostic question, named consumer, and signal owner.
- [ ] ELECOBS-CK-PROJECT-01-03 — The record contains the source commit or digest, installed artifact checksum or exact build identifier, target operating system and architecture, Electron major, and complete process map.
- [ ] ELECOBS-CK-PROJECT-01-04 — The record contains edit and capture authority, destination access, retention, expected volume, prohibited data, and the exact completion claim.

### ELECOBS-SC-PROJECT-02 — Rule violation: read-only review is used as edit authority

A caller requests inspection without implementation authority. It succeeds when the diagnostic paths and
stored records are reviewed without change; editing or silently treating review as implementation is the
Rule violation.

#### Checklist

- [ ] ELECOBS-CK-PROJECT-02-01 — Read-only review changes no source, schema, configuration, destination, access, retention, documentation, or cleanup path.
- [ ] ELECOBS-CK-PROJECT-02-02 — A review request is not reclassified as implementation without explicit edit authority.

### ELECOBS-SC-PROJECT-03 — Expected failure: a required input or authority is missing

A diagnostic question lacks a consumer, an accepted decision conflicts, or authority for edits, capture,
destination access, or retention is absent. It succeeds by stopping at the earliest gap; inventing the input
or continuing without authority is the failure.

#### Checklist

- [ ] ELECOBS-CK-PROJECT-03-01 — Dependent emission work remains unstarted while a required input, accepted decision, or authority is absent or contradictory.
- [ ] ELECOBS-CK-PROJECT-03-02 — The stop identifies the earliest owner and the exact question, decision, mechanism, destination, access, or retention gap.

## Structure

### ELECOBS-SC-STRUCTURE-01 — Normal case: logs, metrics, and traces have stable record shapes

Several Electron processes emit records for the same diagnostic question. It succeeds when each signal uses
a stable machine-readable shape and correlation rule; interpolated logs, expanding labels, or incompatible
fields are the failure.

#### Checklist

- [ ] ELECOBS-CK-STRUCTURE-01-01 — Every log has a timestamp, severity, event name, and stable typed fields.
- [ ] ELECOBS-CK-STRUCTURE-01-02 — Every metric has the kind and unit selected for its named question.
- [ ] ELECOBS-CK-STRUCTURE-01-03 — Every metric label value comes from a recorded bounded set that excludes request-, renderer-, path-, URL-, and user-specific values.
- [ ] ELECOBS-CK-STRUCTURE-01-04 — The correlation map gives every applicable Electron process and transport boundary either its carried field or a named unsupported limit.

### ELECOBS-SC-STRUCTURE-02 — Normal case: the complete emission path follows process ownership

The diagnostic outcome crosses shared records, Electron processes, transport, and storage. It succeeds when
the complete path exists in dependency order and every lifetime has an owner; an isolated emitter or a
preload described as its own process is the failure.

#### Checklist

- [ ] ELECOBS-CK-STRUCTURE-02-01 — Applicable implementation or read-only review proceeds from shared record or schema fields through main coordination, renderer and preload context, owned utility processes, other Electron child-process signals, external main-process crash collection, transport, destination, access and retention configuration, and cleanup.
- [ ] ELECOBS-CK-STRUCTURE-02-02 — Source, artifact, target operating system and architecture, process, event, and correlation fields agree across every applicable emitter, transport, and stored record.
- [ ] ELECOBS-CK-STRUCTURE-02-03 — Preload emission is treated as renderer-process context rather than a separate process.
- [ ] ELECOBS-CK-STRUCTURE-02-04 — Every emitter, reporter, listener, queue, file, transport, destination configuration, and cleanup action has one lifecycle owner.

## Performance

### ELECOBS-SC-PERFORMANCE-01 — Rule violation: emission changes the behavior it records

Diagnostic work shares execution time and resources with the application. It succeeds when failure and load
inside emission remain contained; throwing, blocking, unbounded retry, or uncontrolled buffering is the Rule
violation.

#### Checklist

- [ ] ELECOBS-CK-PERFORMANCE-01-01 — No emitter, reporter, or transport failure throws into the application path being recorded.
- [ ] ELECOBS-CK-PERFORMANCE-01-02 — No diagnostic operation causes a user-visible action, data-changing action, or main-process work to exceed its accepted response limit.
- [ ] ELECOBS-CK-PERFORMANCE-01-03 — Retry and backpressure behavior is finite and cannot delay the user-visible or data-changing action being recorded past its accepted response limit.
- [ ] ELECOBS-CK-PERFORMANCE-01-04 — The volume-control record gives queues, buffers, files, sampling, filtering, aggregation, and required-signal loss their bounded limits and explicit statuses.

### ELECOBS-SC-PERFORMANCE-02 — Edge case: tracing or network logging is enabled temporarily

A named question requires a high-volume or sensitive diagnostic that is unsuitable as a default. It succeeds
when the capture has a named process and target operating system and architecture, with bounded time, size,
access, and retention; indefinite or unauthorized capture is the failure.

#### Checklist

- [ ] ELECOBS-CK-PERFORMANCE-02-01 — Each `contentTracing` or `netLog` session has a named question, applicable process, target operating system and architecture, start point, stop point, duration limit, file-size limit, destination, and cleanup owner.
- [ ] ELECOBS-CK-PERFORMANCE-02-02 — `netLog` `includeSensitive` or `everything` capture has exact authority for its data scope plus recorded access, retention, redaction, duration, and file-size limits.
- [ ] ELECOBS-CK-PERFORMANCE-02-03 — Every bounded trace or network-log session completes its recorded stop, temporary-file cleanup, and access removal.

## Aesthetics

### ELECOBS-SC-AESTHETICS-01 — Poor quality: diagnostic records use inconsistent or vague names

Records arrive but use different names for the same field, severities have no stable meaning, or prose hides
the exact Electron signal. It succeeds when a cold consumer can query and compare the records directly;
polished but inconsistent records are the quality failure.

#### Checklist

- [ ] ELECOBS-CK-AESTHETICS-01-01 — Each event name, severity, process field, artifact field, target operating system and architecture field, and correlation field has one stable meaning across emitters and destinations.
- [ ] ELECOBS-CK-AESTHETICS-01-02 — Exact identifiers including `render-process-gone`, `unresponsive`, `responsive`, `child-process-gone`, `utilityProcess`, `contentTracing`, and `netLog` retain their documented spelling and scope.

## Usage

### ELECOBS-SC-USAGE-01 — Normal case: required records are inspected at their destination

The emission path is configured and construction checks pass. It succeeds only when the operation inspects
what the destination actually stored and reports the status of each required signal; emitter input or a clean
build used as arrival proof is the failure.

#### Checklist

- [ ] ELECOBS-CK-USAGE-01-01 — Construction checks are reported only as source, schema, configuration, or emitted-entry results and not as proof of diagnostic arrival or behavior.
- [ ] ELECOBS-CK-USAGE-01-02 — Destination inspection reads the actual stored record rather than the emitter input or transport request.
- [ ] ELECOBS-CK-USAGE-01-03 — Every required signal has an explicit arrived, missing, not observed, unavailable, or blocked stored-arrival status.
- [ ] ELECOBS-CK-USAGE-01-04 — Each stored destination has its current access, retention, field, and volume status recorded.

### ELECOBS-SC-USAGE-02 — Expected failure: a required record does not arrive

An emitter runs but its record is missing, delayed, rejected, or unavailable at the destination. It succeeds
when the earliest owned emission or configuration cause is repaired or returned; retries that hide the gap
or a reported arrival without a stored record are the failure.

#### Checklist

- [ ] ELECOBS-CK-USAGE-02-01 — Missing arrival is traced through emitter, process startup, correlation, queue, transport, destination configuration, access, retention, and storage in earliest-boundary order.
- [ ] ELECOBS-CK-USAGE-02-02 — An implementation repair corrects the earliest owned cause and repeats the affected construction check and stored-record inspection.
- [ ] ELECOBS-CK-USAGE-02-03 — A mechanism dispute, contract or design contradiction, or unauthorized destination decision returns to its earliest owner without an observability-owned replacement.
- Also applies: ELECOBS-CK-USAGE-01-02 (the stored record is inspected at the destination).

## Consistency

### ELECOBS-SC-CONSISTENCY-01 — Edge case: emission, arrival, and live health differ

The emitter is configured, some records have arrived, and someone asks whether the installed application is
healthy. It succeeds when emission and arrival remain separate claims and live health remains outside the
result; advancing from configuration or arrival to live-health proof is the failure.

#### Checklist

- [ ] ELECOBS-CK-CONSISTENCY-01-01 — Configured emission is reported separately from observed stored arrival.
- [ ] ELECOBS-CK-CONSISTENCY-01-02 — The result states literally that live health is not established by the Electron Observability operation and remains outside the result.
- [ ] ELECOBS-CK-CONSISTENCY-01-03 — The completion claim is no broader than the recorded emission and arrival statuses, limitations, and unavailable fields.

### ELECOBS-SC-CONSISTENCY-02 — Rule violation: observability claims another owner's outcome

Arrived diagnostics make a cause or later lifecycle state appear obvious. It succeeds by transferring records
and limits to the correct owner; interpreting mechanisms, tests, delivery, package, release, or rollout state
inside this operation is the Rule violation.

#### Checklist

- [ ] ELECOBS-CK-CONSISTENCY-02-01 — Observability performs neither final diagnosis nor runtime-mechanism interpretation.
- [ ] ELECOBS-CK-CONSISTENCY-02-02 — Observability performs no test design, execution, interpretation, environment classification, evidence acceptance, or test verdict.
- [ ] ELECOBS-CK-CONSISTENCY-02-03 — Observability claims no live health, complete delivery, package state, release state, publication, or rollout outcome.
- [ ] ELECOBS-CK-CONSISTENCY-02-04 — Static sibling references are limited to `electron-contract`, `electron-design`, and `electron-runtime`.

## Risk

### ELECOBS-SC-RISK-01 — Normal case: each Electron failure class has the correct capture owner

Renderer, utility, other child, and main failures stop different execution contexts. It succeeds when capture
is early and each class uses its direct surviving signal; one application event or late in-process callback
treated as universal capture is the failure.

#### Checklist

- [ ] ELECOBS-CK-RISK-01-01 — The crash-capture record states an early-enough `crashReporter.start()` point for every subsequently created monitored process and assigns startup and later-parameter constraints to Electron Runtime for the pinned major.
- [ ] ELECOBS-CK-RISK-01-02 — Main-process exit uses an external collector or supervisor or previously configured crash collection because in-process main code cannot report after exit.
- [ ] ELECOBS-CK-RISK-01-03 — Renderer disappearance uses `render-process-gone` on the affected `webContents`.
- [ ] ELECOBS-CK-RISK-01-04 — Renderer hang and recovery use `unresponsive` and a later `responsive` on the same affected `webContents`.
- [ ] ELECOBS-CK-RISK-01-05 — `child-process-gone` excludes renderer processes and is not used as a renderer-loss signal.
- [ ] ELECOBS-CK-RISK-01-06 — An owned utility process retains direct `error` and `exit` observation instead of replacing both with `child-process-gone`.

### ELECOBS-SC-RISK-02 — Adversarial: protected data reaches an emitted or stored diagnostic

A field useful for diagnosis contains a credential, session value, personal data, sensitive path, or payload.
It succeeds when allowlists exclude the field and stored records remain inside accepted access and retention;
shipping it because the destination is restricted is the adversarial failure.

#### Checklist

- [ ] ELECOBS-CK-RISK-02-01 — A field allowlist governs every log, metric, trace, error, crash annotation, and hang record before emission.
- [ ] ELECOBS-CK-RISK-02-02 — No credential, token, authorization data, cookie, session value, personal data, sensitive path or URL, request or response body, or unapproved exception text reaches an emitted or stored diagnostic.
- [ ] ELECOBS-CK-RISK-02-03 — Crash annotations use only allowed fields and leave exact startup and later extra-parameter limits to Electron Runtime and the pinned Electron major.
- [ ] ELECOBS-CK-RISK-02-04 — Stored-record inspection checks protected fields together with destination access and retention.
- [ ] ELECOBS-CK-RISK-02-05 — A protected value at an emitter or destination stops or reduces the affected signal and access until the owned leak and retention state are corrected.
- Also applies: ELECOBS-CK-PERFORMANCE-02-02 (authority and limits for sensitive network capture).

### ELECOBS-SC-RISK-03 — Adversarial: cosmetic success hides an emission failure

A required record is missing or harmful, but configuration exists and broad capture could make the check
appear complete. It succeeds when the exact failure remains visible; hiding a signal, weakening a control,
or relabeling absence as arrival is the adversarial failure.

#### Checklist

- [ ] ELECOBS-CK-RISK-03-01 — No diagnostic control in this set is changed to obtain a passing result: required-signal coverage, security controls, retention limits, or sensitive-capture authority.
- [ ] ELECOBS-CK-RISK-03-02 — A configured reporter, clean construction result, or emitter invocation is not treated as proof of stored arrival, live health, recovery, or final diagnosis.
- [ ] ELECOBS-CK-RISK-03-03 — Backpressure, destination unavailability, missing correlation, reporter startup gaps, and protected-data failure remain explicit statuses rather than successful arrival.

## Overall

### ELECOBS-SC-OVERALL-01 — Normal case: one bounded emission record closes and hands off

The signal set and destination inspection are complete or carry explicit unavailable statuses. It succeeds
when one record states the exact emission outcome and transfers arrived records for diagnosis without
deciding their cause; a missing field or higher-owner claim is the failure.

#### Checklist

- [ ] ELECOBS-CK-OVERALL-01-01 — The final record contains questions, consumers, source and artifact fields, target operating system and architecture, process map, signal definitions and owners, correlation map and limits, capture timing, redaction allowlists, volume controls, transports, destinations, stored arrival, access and retention, cleanup, non-interference, limitations, unresolved facts, and later test needs.
- [ ] ELECOBS-CK-OVERALL-01-02 — The dynamic arrived-record handoff contains only records and limits for Electron Runtime diagnosis, never a decided cause or policy change.
- Also applies: ELECOBS-CK-CONSISTENCY-01-03 (completion claim remains bounded).
- Also applies: ELECOBS-CK-CONSISTENCY-02-01 (final diagnosis stays outside Observability).
- Also applies: ELECOBS-CK-RISK-01-02 (main-process failure capture survives main exit).
