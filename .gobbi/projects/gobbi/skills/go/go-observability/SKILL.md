---
name: go-observability
description: "MUST load when designing, implementing, reviewing, or verifying logs, metrics, traces, trace-context propagation, crash capture, diagnostic redaction, correlation, or runtime health signals in Go software."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Observability

Go Observability designs, reviews, coordinates changes to, or verifies the diagnostic output of Go software.
It returns a confirmed design or review, a verified local change, or verified test-destination arrival in which
the named log records, metrics, spans, and crash reports answer their diagnostic questions, correlate, contain
no protected values, and retain explicit evidence limits.

This operation owns diagnostic questions, concrete record schemas, emission points, correlation, sampling or
aggregation, volume and cardinality bounds, diagnostic redaction at emission, and arrival evidence. General
construction, concurrent lifetime and cancellation, protected-data classification, evidence design,
project-command mechanics, causal diagnosis, and destination mutation remain with their named owners.

This operation does not define Web policy, provision or configure a production destination, deploy or roll out
software, make traffic or on-call decisions, interpret live health, or run generic incident response. Those
results stay with the applicable Web, deployment, operations, or incident owner.

## Principles

### Begin with a diagnostic question

Every log record, metric, span, and crash report must help one named consumer answer one named question. An
output without that question, consumer, owner, and retention purpose is noise and is removed rather than
emitted.

### Correlation is an end-to-end contract

An identifier is useful only when it survives every intended boundary and joins the stored records for one
action. An unpropagated boundary is a named evidence limit, never an invitation to infer correlation later.

### Protected values never become diagnostics

Redaction after collection cannot prove that copied or indexed values disappeared. `go-security` classifies
protected-data types; this operation applies that classification through allow-lists before emission and checks
the records actually stored at the destination.

### Observation must preserve observed behavior

Emission and failure handling stay bounded and subordinate to application behavior. Diagnostic work may lose
or aggregate records under an accepted policy, but it must not distort the success, error, cancellation,
timeout, panic, latency, or resource behavior it describes.

## Rules

- **MUST select exactly one design/review, change, or diagnostic-send verification mode and bind its complete
  effect contract before any project command, local output, cache or download, network request, credential use,
  diagnostic send, or write.** Authority never transfers between modes or from a sibling.
- **MUST bind every log record, metric, span, and crash report to its diagnostic question, consumer, owner,
  exact schema, emission point, correlation, sampling or aggregation, volume and cardinality bounds,
  destination, access owner, retention, redaction allow-list, and arrival proof.** Drop an unowned or
  questionless output.
- **MUST keep structured-log, metric, span, and crash-report schemas distinct and name every field's type,
  requiredness, meaning, permitted value or cardinality bound, and protected-data disposition.** A generic
  diagnostic label cannot substitute for one of those concrete records.
- **MUST route protected-data classification to `go-security`, project writes to `go-development`, evidence
  design to `go-testing`, project-command mechanics to `go-toolchain`, and goroutine lifetime, cancellation,
  buffering, backpressure, and retry concurrency to `go-concurrency`.** Consume their results without
  inheriting their authority.
- **MUST treat credential use and external mutation as separate facts in every mode.** A destination read or
  authenticated send does not authorize provisioning, configuration, mutation, production emission, or any
  other destination.
- **NEVER let emission throw into the application path, block a critical operation, change cancellation,
  create unbounded buffering, cardinality, or volume, or retry until the observed operation degrades; and NEVER
  emit or retain a protected value or claim arrival from sender success alone.**

## Procedure

### Phase 1 — Bind the Result and Authority

#### 1.1 Bind the accepted diagnostic result

- Read the request, accepted decisions, project instructions, current diagnostic behavior, incidents or
  support questions that motivate the work, affected consumers, and required evidence. Name the requested
  result as a confirmed design/review, verified local change, or verified diagnostic-send arrival.
- Record the minimum supported Go version when acceptance depends on it, selected Go toolchain version,
  module's Go language version when language behavior matters, module path, supported `GOOS/GOARCH` targets,
  project commands, exact package patterns only as project-command selectors or evidence, processes,
  goroutines, request boundaries, and configured destinations.
- Inventory each existing log record, metric, span, and crash report from emission point through transport to
  destination. Record its schema, correlation, sampling or aggregation, volume, cardinality, redaction,
  access, retention, observed arrival, consumer, and unanswered question. The official
  [Go diagnostics guide](https://go.dev/doc/diagnostics) distinguishes tracing, profiling, debugging, and
  runtime statistics; it does not select which diagnostic output this project needs.
- Preserve the baseline needed for comparison. Stop when the accepted result, consumer, owner, destination,
  protected-data classification, or authority boundary is missing.

#### 1.2 Select one mode and bind every effect

- **Design/review mode:** project paths are read-only; local writes are approved design evidence only with a
  named retention or cleanup boundary; every Go cache or download is separately authorized; execution is
  read-only analysis through authorized named project commands; network access is separately authorized;
  credential use is none; external mutation is none; production diagnostic emission is forbidden. Pause before
  code mutation, production emission, or a protected-data choice. The result is a confirmed diagnostic design,
  review findings, or an exact block. Recovery retains the approved design evidence, redaction, access, and
  retention decisions and names the recovery owner and first action.
- **Change mode:** project writes occur only through authorized `go-development` work; local writes are
  approved diagnostics with named retention or cleanup; every Go cache or download is separately authorized;
  execution is limited to authorized project commands for local verification; network access is separately
  authorized, but this mode grants no diagnostic-send authority; credential use is none; external mutation is
  forbidden. Destination provisioning, configuration, or mutation goes to one named external-action owner.
  Pause before a protected diagnostic field, network use, or destination action request. The result is a
  verified local diagnostic-output change with any required current, matching evidence returned by the named
  external-action owner. That evidence names the owner, requested action, exact destination, configuration or
  object identity, before and after state, result, time or action identity, current authority, redaction,
  retained state, and evidence limits; otherwise the result is an exact delivery or redaction block. Recovery
  retains only the authorized changed paths, approved redacted local diagnostics at their named retention or
  cleanup paths, and declared cache or download state, and names the owner, prerequisite, first recovery action,
  and handoff. This mode never inherits test credentials, test destination access, send authority, or captured-
  output authority from verification mode.
- **Diagnostic-send verification mode:** project source is read-only; local writes are approved captured test
  diagnostics with a named retention or cleanup boundary; every Go cache or download is separately authorized;
  execution is limited to authorized project commands that emit bounded test diagnostics; network access is
  only to one named authorized test destination; credential use is limited to separately authorized named test
  credentials delivered for that destination; external mutation is limited to creating the bounded approved
  test diagnostic records there. Provisioning, configuration, deletion, production mutation, and production
  emission are forbidden. Test data must remain inside its redaction, access, volume, and retention bounds.
  Pause before the first send and after any change to destination, credential, schema, data, volume, access,
  retention, redaction, command, or time bound. The result is verified arrival, redaction, and correlation or
  a contained failure. Recovery records destination state, stops further sends, and names the first action.

#### 1.3 Bind sibling owners, decisions, and non-goals

- Route general code construction and review to `go-development`; evidence questions and test cases to
  `go-testing`; command syntax, selected toolchain behavior, caches, downloads, and observed command effects to
  `go-toolchain`; protected-data classification and a protected value found in output to `go-security`; causal
  failure diagnosis to `go-debugging`; and goroutine ownership, `context.Context` cancellation mechanics,
  queues, buffering, backpressure, and retry concurrency to `go-concurrency`.
- For a traced Web request, load `web-observability`. Beside this claim, that owner supplies the selected
  [OpenTelemetry semantic-convention](https://opentelemetry.io/docs/specs/semconv/) attribute names and the
  [W3C Trace Context](https://www.w3.org/TR/trace-context/) `traceparent` and `tracestate` HTTP fields. This Go
  operation records their propagation through Go emission points; `go-concurrency` owns how Go context and
  cancellation move through the call path. Record every boundary that cannot propagate them as an exact
  correlation limit.
- Identify material choices about diagnostic questions, schemas, correlation, sampling, aggregation,
  cardinality, volume, crash capture, redaction, retention, access, destination, validation strength, or an
  external effect. Cite a matching accepted decision or pause with compared alternatives, recommendation,
  decision owner, affected obligation, and exact question before design-dependent work.
- Exclude Web mechanism policy, destination provisioning or configuration, production emission from review or
  verification, deployment, rollout, traffic or live-health decisions, on-call policy, and generic incident
  response. Name the actual owner when the accepted result depends on one of them.

### Phase 2 — Design Concrete Diagnostic Records

#### 2.1 Bind questions, consumers, and emission points

- For each diagnostic question, name who asks it, who owns the answer, what decision it supports, which exact
  success, error, cancellation, timeout, recovered-panic, or fatal-crash path it must distinguish, and how long
  that need remains valid. Drop a proposed record with no consumer or decision.
- Map the shortest responsible emission point for each question: entry, accepted intermediate state, result
  from its named source of truth, completion, or failure. Do not emit a guessed completion, duplicate the same
  event at several layers, or use a last log line as proof of causal ordering.
- For each log record, metric, span, and crash report, record the question, consumer, owner, schema identity,
  emission point, correlation identity, sampling or aggregation rule, expected rate, maximum burst, cardinality
  budget, destination, access owner, retention, redaction allow-list, and required arrival proof.

#### 2.2 Define four separate schemas

- **Structured-log schema:** name the event and schema version; timestamp source; severity and its response
  meaning; producer and build identity; trace identifier and span identifier when correlated; exact stable
  attribute keys; each attribute's Go or serialized type, requiredness, meaning, permitted values or bound;
  result or error classification; and redaction disposition. If the project selects `log/slog`, bind
  `Record`, level, message or event-name mapping, attributes, groups, and handler behavior to the selected Go
  toolchain and diagnostic question using the official [`log/slog` documentation](https://pkg.go.dev/log/slog);
  do not mandate it over the project logger.
- **Metric schema:** name the instrument and schema version; diagnostic question; counter, gauge, or
  distribution behavior; unit; monotonicity when applicable; observation point; aggregation and temporality;
  low-cardinality attribute names, types, and bounded value sets; expected rate and maximum series count;
  reset or process-restart interpretation; and redaction disposition. Request, user, trace, error-message, and
  other unbounded identifiers do not become metric attributes.
- **Span schema:** name the operation and schema version; span kind; trace identifier, span identifier, and
  parent relationship; start and end conditions; status mapping; producer and build identity; exact attribute,
  event, and link names with types, requiredness, value bounds, and redaction disposition; and the sampling
  decision owner. A missing parent or unpropagated boundary remains a correlation limit.
- **Crash-report schema:** name the crash class and schema version; process and build identity; selected Go
  toolchain version; occurrence time; termination or recovered-panic result; correlation identity when it is
  obtained before termination and its field is permitted by the accepted redaction allow-list; stack or runtime
  output kind; allow-listed annotations with types and bounds; collection path; report identifier; destination;
  access owner; retention; redaction disposition; and symbolization or readability limit. Do not place a
  credential, request body, personal field, session identifier, arbitrary error string, or unbounded process
  state in an annotation.
- For every schema, define compatibility and versioning, required and optional fields, serialization failure
  behavior, maximum record size, and the test that rejects an undeclared or wrongly typed field. A heading or
  example payload is not an exact schema.

#### 2.3 Design correlation, sampling, aggregation, and bounds

- Map every process, goroutine, function, HTTP, RPC, queue, worker, storage, and external-provider boundary the
  accepted action crosses. Name where correlation is created, extracted, validated, propagated, attached to a
  log record or crash report, and joined at the destination. Do not treat a Go `context.Context` value as a
  durable identifier or change cancellation to preserve diagnostic work.
- Define the trace sampling decision and its propagation, the metric aggregation window and reset semantics,
  log-record rate limits, crash-report deduplication, maximum diagnostic record size, maximum queue depth,
  overflow behavior, worker count, flush deadline, and bounded retry policy. Route the concurrent mechanism
  and lifetime judgment to `go-concurrency`.
- State expected steady-state volume, maximum burst, maximum metric-series count, bounded attribute value sets,
  sampling ratio or rule, storage estimate, and retention cost owner. Remove or aggregate output whose value
  does not justify its volume or cardinality.
- Define observable behavior when the diagnostic path is unavailable: discard, aggregate, sample, spill to one
  approved bounded local output, or return a diagnostic-system error only when that error is already part of
  the accepted application contract. Preserve the application's original error, cancellation, timeout, and
  panic behavior.

#### 2.4 Distinguish panic, stack, and fatal-crash paths

- Treat a recovered panic as program behavior observed at an explicitly accepted recovery boundary. Record the
  original panic classification and application result separately from any structured log record or crash
  report; do not add recovery merely to keep the process alive or to claim crash coverage.
- Treat an in-process stack capture as a bounded observation made by code that is still running. When an exact
  question calls for `runtime/debug.Stack` or `runtime/debug.PrintStack`, first confirm that API and behavior
  against the selected Go toolchain in the official [`runtime/debug` documentation](https://pkg.go.dev/runtime/debug),
  and bind output size, redaction, access, and retention.
- Treat fatal crash output as runtime or operating-system output produced while the process terminates. If the
  selected toolchain and design use mechanisms such as `runtime/debug.SetTraceback` or
  `runtime/debug.SetCrashOutput`, verify their availability and exact behavior against the selected toolchain
  and diagnostic question in the official [`runtime/debug` documentation](https://pkg.go.dev/runtime/debug).
  Do not imply that every toolchain has the same API, that an in-process handler will run after a fatal crash,
  or that an emission acknowledgement proves an out-of-process collector retained the crash report.
- Configure the accepted fatal-crash collection path before the failing code runs and name the component that
  outlives the process, its output bound, destination, access owner, retention, symbol or build-identity
  mapping, redaction capability, and arrival evidence. Its outbound boundary must reject or redact protected
  content before any emission or retention; when that guarantee is unavailable, do not enable the capture and
  block. A collection path that cannot prove protected content is rejected or redacted before emission and
  retention remains an exact gap rather than becoming recovered-panic or in-process-stack coverage.

### Phase 3 — Review or Coordinate the Change

#### 3.1 Produce a design or review result

- In design/review mode, inspect the complete question-to-record map, schemas, emission points, correlation
  boundaries, sampling, aggregation, buffers, retries, crash paths, redaction allow-lists, destinations,
  access, retention, and current arrival evidence without changing project paths or emitting production
  diagnostics.
- Challenge each proposed record with an ordinary path, one applicable failure path, a high-volume or
  high-cardinality input, a serialization or transport failure, cancellation, and one protected-data case.
  Report the exact finding, evidence, consequence, owner, alternative, and evidence limit.
- Return a confirmed design or review findings only when every retained log record, metric, span, and crash
  report has the bound contract from Phase 2. Otherwise return the exact block and recovery record.

#### 3.2 Coordinate an authorized local change

- In change mode, give `go-development` the accepted design, exact authorized paths, schema contracts,
  emission points, correlation map, error and cancellation invariants, output bounds, and verification
  questions. Consume its changed-path, caller, compatibility, and project-command evidence without copying its
  construction procedure.
- Inspect the returned change for one unavoidable schema boundary, typed construction, allow-list application
  immediately before emission, bounded queue and retry behavior, accurate result timing, propagation through
  every intended boundary, and exact behavior when encoding, enqueueing, transport, or flush fails.
- Use `go-testing` for focused local evidence and `go-toolchain` for every project command. Keep destination
  sends disabled, replaced by an accepted local controllable dependency, or deferred to diagnostic-send
  verification. Change mode uses no credential, test destination, send authority, or captured test output.
- Hand destination provisioning, configuration, or mutation to the named external-action owner. Consume only
  returned evidence that names the owner, requested action, exact destination, configuration or object
  identity, before and after state, result, time or action identity, current authority, redaction, retained
  state, and evidence limits. Missing, stale, or mismatched returned evidence is an exact block.

#### 3.3 Prove emission cannot change application behavior

- Exercise successful encoding and enqueue, serialization failure, full queue, slow or unavailable transport,
  cancellation, timeout, shutdown, retry exhaustion, and crash-path saturation within approved local bounds.
  Verify the application result and cancellation semantics remain those of the uninstrumented contract.
- Confirm diagnostic calls cannot panic or return an unhandled error into the application path, hold an
  application-critical lock while blocking, wait without a deadline, create an unbounded goroutine or buffer,
  or retry beyond the accepted attempt, elapsed-time, queue, and concurrency bounds.
- Confirm metric attribute value sets and series counts, log and span rates, record sizes, crash-report
  deduplication, memory and CPU budgets, flush deadlines, and drop or aggregation behavior match the accepted
  design. Route violated concurrent bounds to `go-concurrency` and construction defects to `go-development`.

### Phase 4 — Verify Diagnostic Arrival

#### 4.1 Rebind diagnostic-send verification before the first send

- Start a separate diagnostic-send verification mode. Reconfirm project source is read-only; exact project
  command; captured test-diagnostic paths and retention; cache and download bounds; one named test destination;
  network destination; named test credential type, current authority, ephemeral delivery, receiving process,
  and non-persistence; bounded test data; exact log-record, metric, span, or crash-report schemas; maximum sends
  and duration; access owner; retention; redaction allow-list; expected destination record identity; and cleanup
  or expiry owner.
- Record credential use as authorized only for the named test credential and destination. Separately record
  external mutation as creation of only the bounded test diagnostic records. This grants no production
  mutation, destination configuration, provisioning, deletion, or recovery mutation.
- Pause before the first send. Rebind and require current authority again when the destination, credential,
  command, schema, correlation, data, record count, duration, access, retention, redaction, cache, download, or
  expected external state changes.

#### 4.2 Send bounded test diagnostics and read destination evidence

- Emit only the approved bounded test log records, metric observations, spans, or crash reports through the
  authorized project command to the one named test destination. Record the command result, send attempts,
  local identifiers, captured test output, timing, and any delivery acknowledgement as sender evidence only.
- Read evidence from the named destination. Arrival means that read finds the exact stored record; a successful
  call, enqueue, flush, exporter acknowledgement, transport response, or retry completion alone is not arrival.
- For each arrived record, record the exact destination, destination record identifier, destination observation
  time or action identifier, schema match, correlation match, access owner, retention or expiry, stored-record
  redaction result, and evidence limits. Inspect the stored record rather than only the pre-send object.
- Stop all further sends on a command, transport, authorization, schema, correlation, destination-read,
  redaction, access, or retention failure. Missing, stale, duplicate-ambiguous, wrong-destination,
  schema-mismatched, or correlation-mismatched destination evidence is a contained failure and exact block.
  Preserve only approved captured test diagnostics and redacted destination facts and name the recovery owner
  and first action.

### Phase 5 — Evaluate, Stop, and Return

#### 5.1 Evaluate the complete result

- Reconcile every diagnostic question with its consumer, owner, exact log-record, metric, span, or crash-report
  schema, emission point, correlation, sampling or aggregation, volume and cardinality bounds, destination,
  access owner, retention, redaction allow-list, and arrival evidence. Keep every unexecuted path, unsupported
  `GOOS/GOARCH` target, unsent schema, unread destination, and unpropagated boundary outside the claim.
- Recheck stored test-destination records for every protected-data type supplied by `go-security`. A protected
  value at emission or destination is a security failure: stop sends, preserve only redacted facts, route
  destination retention and access correction to its named owner, and require a new verification authority
  before any resend.
- Apply the [evaluation checklist](checklists.md) and every active Go sibling checklist when the result enters
  Evaluation. General Evaluation owns evidence resolution and verdicts.

#### 5.2 Preserve an exact block and recovery boundary

- Stop before an unresolved diagnostic or protected-data decision, unapproved project or local write,
  unauthorized cache, download, command, network request, credential, diagnostic send, destination read, or
  external action; or when required schema, correlation, bounds, redaction, access, retention, arrival, or
  current, matching evidence returned by the named external-action owner is missing, stale, or mismatched.
  That evidence must name the owner, requested action, exact destination, configuration or object identity,
  before and after state, result, time or action identity, current authority, redaction, retained state, and
  evidence limits. Do not substitute a weaker claim or different destination.
- Return the missing prerequisite or first useful diagnostic, affected obligation, current redacted evidence,
  evidence limits, risk, owner, approved retained paths and external records, first recovery action, and exact
  handoff. A failed send or destination check stops further sends and grants no cleanup, retry, configuration,
  or mutation authority.
- An operation error, cancellation, or timeout that prevents the requested result remains incomplete and uses
  its matching universal terminal state. A Go panic is recorded only as program behavior; it is not an
  operation terminal state.

#### 5.3 Return the terminal record

- Return the universal fields, naming why any is not applicable: operation and mode; accepted result; decision
  basis; actual owned object; terminal state selected from exactly `success`, `error`, `cancellation`,
  `timeout`, `blocked`, or `user-decision pause`; changed or reviewed paths; project-command evidence; evidence
  limits; external reads or effects; compatibility decision selected from `compatible`, `migration supplied`,
  `authorized break`, or `unsupported` when applicable; block; recovery; and handoff.
- Project-command evidence names the project command, exact package pattern, selected Go toolchain version,
  flags, `GOOS/GOARCH` target, inputs, duration, and result. External reads or effects name the destination,
  cache or download scope, credential-use fact, external-mutation fact, current authority, redaction, and
  retained state. A block names the prerequisite or first useful diagnostic, affected obligation, evidence,
  and risk. Recovery names its owner, first action, retry or rollback boundary, and retained inputs. A handoff
  names the next Go child, workflow manager, Web owner, or external-action owner, authority still required, and
  exact input identity.
- Add the observability fields: diagnostic questions and consumers; exact structured-log, metric, span, and
  crash-report schemas; emission points; propagation and unpropagated boundaries; sampling or aggregation;
  volume and cardinality bounds; redaction allow-list; destination; access owner; retention; and arrival
  evidence. In change mode, add the literal facts `credential use: none` and `external mutation: forbidden`,
  plus current, matching evidence returned by the named external-action owner that names the owner, requested
  action, exact destination, configuration or object identity, before and after state, result, time or action
  identity, current authority, redaction, retained state, and evidence limits; or add the exact owner,
  prerequisite, retained state, recovery action, and handoff. In diagnostic-send verification mode, add the
  named test destination, authorized test credential type and authority, bounded test-diagnostic external
  state, exact destination record identifier, destination observation time or action identifier, schema and
  correlation match, stored-record redaction result, and evidence limits.
- Complete only with the mode's recognized result: confirmed design or review findings in design/review mode;
  a verified local diagnostic-output change with every required item of current, matching evidence returned by
  the named external-action owner in change mode, naming the owner, requested action, exact destination,
  configuration or object identity, before and after state, result, time or action identity, current authority,
  redaction, retained state, and evidence limits; or destination-read arrival, redaction, and correlation
  evidence in diagnostic-send verification mode. Otherwise return the exact block without calling it success.

## References

- [Evaluation checklist](checklists.md) is the local unchecked evaluation source for this skill.
