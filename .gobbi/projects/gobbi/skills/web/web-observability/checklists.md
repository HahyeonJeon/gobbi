# Web Observability Evaluation Checklist

This reusable unchecked source evaluates one web or installed-renderer emission outcome produced under this
operation, against the named-question, structured-record, trace-context, crash-capture, redaction, and
non-interference obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-observability`](SKILL.md) operation, with [`web-security`](../web-security/SKILL.md) owning which data is
protected and which logging controls are required, [`web-platform`](../web-platform/SKILL.md),
[`css-platform`](../../css/css-platform/SKILL.md), and
[`electron-runtime`](../../electron/electron-runtime/SKILL.md) owning the reading of signals,
[`web-testing`](../web-testing/SKILL.md) owning behavior under test, and
[`web-feature`](../web-feature/SKILL.md) and [`web-backend`](../web-backend/SKILL.md) as the callers whose
contracts name the signal shape. The source commit that contains this file identifies the checklist version.
Its stable owner prefix is `WEBOBS`.

This source tests emission, not classification. Rows below check that a protected value never enters a
diagnostic and that the classification of what is protected came from `web-security`; no row decides which
data is protected.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBOBS-SC-PROJECT-01 — Normal case: every signal answers a question someone will ask

Instrumentation is being added, and each candidate signal costs storage, retention risk, and noise. The
expected outcome names the question, the consumer, the owner, the retention, and the volume before anything is
emitted, and drops a signal that answers nothing; an event emitted because it was easy to emit is the failure.

#### Checklist

- [ ] WEBOBS-CK-PROJECT-01-01 — Each signal names the question it answers, its consumer, its owner, its retention, and its expected volume before it is emitted.
- [ ] WEBOBS-CK-PROJECT-01-02 — A proposed signal that answers none of the listed questions is dropped rather than shipped.
- [ ] WEBOBS-CK-PROJECT-01-03 — An unowned question, an absent consumer, or an undefined retention period is returned to `web-feature` or the user rather than settled here.

### WEBOBS-SC-PROJECT-02 — Normal case: emitting stays separate from reading

The work is asked what the application should produce, and the same session also holds a live failure someone
wants explained. The expected outcome decides emission here and routes every diagnosis to the owner that
reads signals; an emission outcome that also diagnoses a browser, style, or process failure is the failure.

#### Checklist

- [ ] WEBOBS-CK-PROJECT-02-01 — The outcome decides what the application produces rather than diagnosing a failure from what it produced.
- [ ] WEBOBS-CK-PROJECT-02-02 — Every question outside emission is routed to its named owner: browser and standards evidence to `web-platform`, style diagnosis to `css-platform`, process, preload, and lifecycle failures to `electron-runtime`, and behavior under test to `web-testing`.

## Structure

### WEBOBS-SC-STRUCTURE-01 — Normal case: every log is a structured record

Logs are written for a machine to filter and a person to read during an incident. The expected outcome emits
each one as a record with fixed fields and typed attributes; a sentence with values interpolated into it is
the failure.

#### Checklist

- [ ] WEBOBS-CK-STRUCTURE-01-01 — Every log is emitted as a structured record carrying a timestamp, a severity, an event name, and typed attributes.
- [ ] WEBOBS-CK-STRUCTURE-01-02 — No log is emitted as an interpolated message string.

### WEBOBS-SC-STRUCTURE-02 — Normal case: the metric shape matches the measured question

A question asks how often, how long, or how much, and each answer needs a different instrument and a bounded
label set. The expected outcome selects the instrument per question and keeps identifiers off labels; a metric
whose label set grows with users or URLs is the failure.

#### Checklist

- [ ] WEBOBS-CK-STRUCTURE-02-01 — Counters, distributions, or gauges are chosen per measured question.
- [ ] WEBOBS-CK-STRUCTURE-02-02 — Every metric label is low-cardinality, with user identifiers, parameterized URLs, and request identifiers carried on a log or a span instead.

## Performance

### WEBOBS-SC-PERFORMANCE-01 — Rule violation: emission changes the behavior it observes

Telemetry sits on the path it measures, so a failure or a delay inside it reaches the person using the
product. The expected outcome keeps emission out of the observed behavior; a measurement that degrades what it
measures is the failure.

#### Checklist

- [ ] WEBOBS-CK-PERFORMANCE-01-01 — No telemetry call throws into the user path, blocks an authoritative effect, delays navigation, or retries until the request it measures degrades.

### WEBOBS-SC-PERFORMANCE-02 — Normal case: buffered signals leave without holding the document

The document is hidden, navigated, or discarded while signals are still buffered. The expected outcome
delivers them through a transport that survives the transition and flushes on hide; delivery attached to
`unload` or `beforeunload`, which is unreliable and defeats the back/forward cache, is the failure.

#### Checklist

- [ ] WEBOBS-CK-PERFORMANCE-02-01 — Delivery from the browser uses `navigator.sendBeacon()` or `fetch()` with `keepalive` on `visibilitychange` to hidden rather than on `unload` or `beforeunload`.
- [ ] WEBOBS-CK-PERFORMANCE-02-02 — Buffered signals are flushed when the document hides.

## Aesthetics

### WEBOBS-SC-AESTHETICS-01 — Poor quality: names and severities are chosen per call site

Every signal arrives and every field is populated, but the same fact appears under three attribute keys and
the severity levels carry no agreed meaning. The expected outcome reuses the established vocabulary and states
what each level implies; a correct record set no one can query or triage is the failure.

#### Checklist

- [ ] WEBOBS-CK-AESTHETICS-01-01 — An OpenTelemetry semantic-convention attribute name is reused wherever one applies rather than a project synonym.
- [ ] WEBOBS-CK-AESTHETICS-01-02 — The same fact is carried under one stable attribute key across every signal that reports it.
- [ ] WEBOBS-CK-AESTHETICS-01-03 — Each severity level in the ladder states the action it implies.

## Usage

### WEBOBS-SC-USAGE-01 — Normal case: the arriving signals answer the questions during a failure

A real failure of each class is reproduced or injected, and someone must answer the Phase 1 questions from
what reached the destination. The expected outcome answers each question from the arrived records alone; an
answer reconstructed from the emitter's input or from the source is the failure.

#### Checklist

- [ ] WEBOBS-CK-USAGE-01-01 — Each named question is answered using only what arrived at the destination.
- [ ] WEBOBS-CK-USAGE-01-02 — One real failure of each class — handled error, unhandled rejection, unsurvivable crash, slow path, and degraded dependency — is reproduced or injected.
- [ ] WEBOBS-CK-USAGE-01-03 — Each answering record's latency to the destination and its sampling and retention state are recorded.
- [ ] WEBOBS-CK-USAGE-01-04 — Each crash class has a stack resolved to source or the stated reason it could not be.

### WEBOBS-SC-USAGE-02 — Expected failure: a boundary cannot carry the trace context

A hop refuses or cannot forward the identifier, so the story for one action breaks there. The expected outcome
names that boundary as a correlation limit and confirms the cross-origin case before relying on it; a joined
story assumed across a boundary that never carried the context is the failure.

#### Checklist

- [ ] WEBOBS-CK-USAGE-02-01 — Every boundary that cannot carry the trace context is recorded as a named correlation limit.
- [ ] WEBOBS-CK-USAGE-02-02 — A cross-origin request carrying `traceparent` is confirmed with `web-platform` to be allowed by the receiver, since that header is not safelisted and makes the request preflighted.

## Consistency

### WEBOBS-SC-CONSISTENCY-01 — Normal case: one identifier survives every boundary the action crosses

A single user action crosses documents, workers, fetches, preload and IPC, servers, queues, and providers, and
each surface holds a fragment of the story. The expected outcome carries one trace context through all of
them with a consistent sampling decision and build identity; fragments joined by timestamp after the incident
are the failure.

#### Checklist

- [ ] WEBOBS-CK-CONSISTENCY-01-01 — One trace context is propagated across every boundary a single user action crosses.
- [ ] WEBOBS-CK-CONSISTENCY-01-02 — `traceparent` and `tracestate` carry the context on HTTP boundaries and an explicit carried field carries it on worker, IPC, and queue boundaries.
- [ ] WEBOBS-CK-CONSISTENCY-01-03 — The sampling rule is decided at the entry point so a sampled action stays sampled across every hop.
- [ ] WEBOBS-CK-CONSISTENCY-01-04 — The build identity is carried by every signal the application emits and by each out-of-process crash report through its annotations or its endpoint URL, so a report resolves to exact bytes.

### WEBOBS-SC-CONSISTENCY-02 — Normal case: emission, arrival, and live health are separate claims

The instrumentation is reported as done. The expected outcome states what was implemented, what was verified
as arriving, and what has been observed in production as three claims; one claim covering all three is the
failure.

#### Checklist

- [ ] WEBOBS-CK-CONSISTENCY-02-01 — Implemented emission, verified arrival, and observed live health are reported separately.
- [ ] WEBOBS-CK-CONSISTENCY-02-02 — Every accepted gap is handed off with its owner rather than left in the result as an absence.

## Risk

### WEBOBS-SC-RISK-01 — Normal case: capture exists before the failure it must explain

A process dies, a renderer is killed, or a document is discarded, and nothing in it runs afterwards. The
expected outcome configures capture before the code that can fail runs and collects it from outside the
failing process, while the in-process path covers what the surface survives; a reporter started late is the
failure.

#### Checklist

- [ ] WEBOBS-CK-RISK-01-01 — Crash and unsurvivable-failure capture is configured before the code that can fail runs.
- [ ] WEBOBS-CK-RISK-01-02 — Unsurvivable failures are collected from outside the failing process.
- [ ] WEBOBS-CK-RISK-01-03 — Failures the surface survives are captured in process through the global `error` and `unhandledrejection` handlers and any framework error boundary.
- [ ] WEBOBS-CK-RISK-01-04 — The in-process path is kept as the signal that must always work.

### WEBOBS-SC-RISK-02 — Edge case: the out-of-process path is not available everywhere

Some shipped surfaces can report an unsurvivable failure from outside and some cannot, because the browser
mechanism is newly available and the installed mechanism has its own ordering requirement. The expected
outcome configures each available path correctly and records the rest as accepted gaps; treating the reporting
mechanism as universal is the failure.

#### Checklist

- [ ] WEBOBS-CK-RISK-02-01 — A `crash-reporting` or `default` endpoint is declared through `Reporting-Endpoints`, because a `crash` report cannot be observed in JavaScript by the page that crashed.
- [ ] WEBOBS-CK-RISK-02-02 — The browser Reporting API is treated as newly available rather than universal.
- [ ] WEBOBS-CK-RISK-02-03 — In Electron, `crashReporter.start()` is called in the main process before `app.on('ready')`, so no renderer is created before monitoring begins.
- [ ] WEBOBS-CK-RISK-02-04 — In Electron, `render-process-gone` and `child-process-gone` are handled on `app`.
- [ ] WEBOBS-CK-RISK-02-05 — Every shipped surface whose unsurvivable failure cannot be captured is recorded as an accepted gap with its owner.

### WEBOBS-SC-RISK-03 — Rule violation: a protected value reaches a diagnostic

A token, a cookie, a session identifier, or a personal data field is carried into a log, a metric label, a
span attribute, a crash annotation, or an error message. The expected outcome keeps that value out of the
record before it leaves the application — at the emission seam for a signal the application builds, and in the
allow-listed annotations for a crash report it does not build — using the classification `web-security` owns;
an application-emitted signal redacted at the destination instead of before the boundary is the failure.

#### Checklist

- [ ] WEBOBS-CK-RISK-03-01 — No credential, token, authorization header, cookie, session identifier, or personal data field reaches a log, metric label, span attribute, crash annotation, or error message.
- [ ] WEBOBS-CK-RISK-03-02 — The fields treated as protected are taken from the `web-security` classification rather than decided in this operation.
- [ ] WEBOBS-CK-RISK-03-03 — One allow-list governs both the attributes each application-emitted signal may carry through the emission seam and the annotations supplied to the out-of-process crash reporter, so a newly added field is absent until it is added deliberately.
- [ ] WEBOBS-CK-RISK-03-04 — Stripping at the seam covers URLs, query strings, request and response bodies, and exception messages.
- [ ] WEBOBS-CK-RISK-03-05 — A test proves that a record containing a protected field leaves the seam without it.
- [ ] WEBOBS-CK-RISK-03-06 — No application-emitted signal path reaches a transport without passing the seam.

### WEBOBS-SC-RISK-04 — Adversarial: the emitter's own check stands in for the destination

The seam's test passes and the review shows a list of blocked keys, so the diagnostics are declared clean and
nobody opens the destination. The expected outcome reads what is actually stored and searches it, and has the
destination redact and bound what no seam could reach; an emitter-side result accepted as proof of what left
the process is the failure.

#### Checklist

- [ ] WEBOBS-CK-RISK-04-01 — The records actually stored at each destination, including the crash-report destination, are read rather than the emitter's input.
- [ ] WEBOBS-CK-RISK-04-02 — The stored records are searched for credentials, tokens, session identifiers, and personal data.
- [ ] WEBOBS-CK-RISK-04-03 — A protected value found at a destination is raised as a `web-security` finding with its own remediation and retention correction.
- [ ] WEBOBS-CK-RISK-04-04 — A protected field already reaching a destination is corrected before new emission is added on the same path.
- Also applies: WEBOBS-CK-RISK-03-03 (the seam allow-lists rather than blocks known-bad keys).

### WEBOBS-SC-RISK-05 — Edge case: the seam cannot redact the payload before it leaves

An out-of-process crash reporter sends a payload the application never sees, so the emission seam cannot
strip it. The expected outcome moves redaction and retention to the destination and records who can read it
and for how long; an unredacted payload accepted because the seam could not reach it is the failure.

#### Checklist

- [ ] WEBOBS-CK-RISK-05-01 — Who can read each destination, and for how long, is recorded.
- [ ] WEBOBS-CK-RISK-05-02 — The crash-report payload the application cannot redact before transport is redacted at its destination.
- [ ] WEBOBS-CK-RISK-05-03 — The crash-report payload the application cannot redact before transport is retention-bounded at its destination.

## Overall

### WEBOBS-SC-OVERALL-01 — Normal case: the signal set is reconciled before handoff

A complete emission outcome ties every named question to the signal that answers it, its cost, and what the
destination check found, and states the limits the next owner inherits. The scenario fails when a question
ends without a reconciled signal, or when a limit or gap reaches the caller without an owner.

#### Checklist

- [ ] WEBOBS-CK-OVERALL-01-01 — Every question is reconciled with its answering signal, its cost and cardinality, and the destination check result.
- [ ] WEBOBS-CK-OVERALL-01-02 — The named correlation and coverage limits are handed off with the reconciled result.
- Also applies: WEBOBS-CK-CONSISTENCY-02-01 (emission, arrival, and live health reported separately).
