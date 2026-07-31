---
name: web-observability
description: "MUST load when instrumenting or reviewing what a web or Electron surface emits, covering structured logs, metrics, traces, trace-context propagation, crash and unhandled-error capture, and diagnostic redaction."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebFetch
skill-type: operation
---

# Web Observability

Use this operation to make one web or installed-renderer surface emit the signals that explain its behavior in
production: structured logs, metrics, traces that correlate across the client and server boundary, crash and
unhandled-error reports, and the redaction that keeps protected data out of all of them. It ends when every
signal reaches its destination and has answered the question it was created for.

This operation owns emission. Reading a signal already has owners: `web-platform` interprets browser and
standards evidence, [`css-platform`](../../css/css-platform/SKILL.md) owns style diagnosis, and
[`electron-runtime`](../../electron/electron-runtime/SKILL.md) owns process, preload, and lifecycle failures.
Load those to diagnose a failure; load this one to decide what the application produces.

`web-feature` and `web-backend` require instrumentation inside their own contracts and keep their outcomes;
this operation supplies the signal shape those contracts name. `web-security` owns which data is protected and
which logging controls are required; this operation owns keeping that data out of a diagnostic before it
leaves the process. `web-testing` proves behavior under test, which is a different claim from what production
emits.

## Principles

### Emission answers a question someone will ask

A signal exists so a specific person can answer a specific question during a failure. Name the question and
its consumer first, because an event emitted without either is cost, retention risk, and noise rather than
evidence.

### A signal is evidence only when it correlates

Logs, metrics, traces, and crash reports about one user action become one story only when a shared identifier
survives every boundary that action crosses. Without propagation each surface holds a fragment, and joining
the fragments after the incident is guesswork.

### The failure you most need to explain cannot report itself

A process that died, a renderer that was killed, and a document the browser discarded all stop running before
any in-process handler executes. Capture for those failures must be configured before them and delivered by
something that outlives them.

### Redaction happens before the boundary, not at the destination

Once a diagnostic leaves the process it is transmitted, copied, indexed, and retained beyond the sender's
control, and a later deletion cannot prove every copy is gone. The only reliable control is that the protected
value never entered the record.

## Rules

- **MUST name the question each signal answers, its consumer, its owner, and its retention before emitting
  it.** A proposed signal with no named consumer is dropped rather than shipped.

- **MUST emit every log as a structured record with a timestamp, a severity, an event name, and stable typed
  attributes, and NEVER as an interpolated message string.** Reuse an
  [OpenTelemetry semantic convention](https://opentelemetry.io/docs/specs/semconv/) attribute name wherever
  one applies instead of inventing a project synonym.

- **MUST propagate one trace context across every boundary a single user action crosses.** Use the
  [W3C Trace Context](https://www.w3.org/TR/trace-context/) `traceparent` and `tracestate` headers on HTTP
  boundaries and an explicit carried field on worker, IPC, and queue boundaries.

- **MUST configure crash and unsurvivable-failure capture before the code that can fail runs, and collect it
  from outside the failing process.** A page cannot observe its own `crash` report and a killed renderer
  cannot flush a buffer, so a reporter started late captures nothing.

- **NEVER let a credential, token, authorization header, cookie, session identifier, or personal data field
  reach a log, metric label, span attribute, crash annotation, or error message.** Redact at the emission seam
  by allow-listing what each signal may carry; `web-security` owns which data is protected and this operation
  owns keeping it out of diagnostics.

- **NEVER let emission change the behavior it observes.** A telemetry call must not throw into the user path,
  block an authoritative effect, delay navigation, or retry until the request it measures degrades.

## Procedure

### Phase 1 — Bind the Diagnostic Contract

#### 1.1 Name the questions the signals must answer

- Start from the bounded outcome supplied by `web-feature` or the requesting caller, the incident and support
  history, and the user-visible success measures the feature already defined.
- List the questions someone will ask while the product is failing — which user, which request, which build,
  which step, how often, and how badly — then give each question one consumer, one owner, and one retention
  period, and drop any proposed signal that answers none of them.
- Record a question-to-signal table carrying consumer, owner, retention, and expected volume per row.
- Continue with that table; return an unowned question, an absent consumer, or an undefined retention period
  to `web-feature` or the user before designing any signal shape.

#### 1.2 Inventory current emission and its owners

- Take the question table plus the application's existing logging, metric, tracing, error-reporting, and
  analytics code and configuration.
- Trace every existing emission point from call site through transport to destination, recording severity
  use, attribute names, sampling, label cardinality, cost, and whether a protected field currently reaches it;
  load `web-security` for the data classification and `web-backend` for authoritative-effect diagnostics when
  their triggers apply.
- Record the current emission inventory, its destinations and access, and the questions no current signal
  answers.
- Continue with that gap set; route a protected field already reaching a destination to `web-security` as a
  finding and correct it before adding new emission on the same path.

### Phase 2 — Design the Signal Set

#### 2.1 Define the log, metric, and trace shape

- Take the gap set, the question table, and the project's existing attribute vocabulary and severity use.
- Define one structured record shape — timestamp, severity, event name, stable attribute keys, typed values —
  and one severity ladder in which each level states the action it implies; choose counters, distributions, or
  gauges per measured question, and keep every metric label low-cardinality, because a user identifier, a
  parameterized URL, or a request identifier belongs on a log or a span and never on a metric label.
- Record the record schema, the severity ladder, the metric list with labels and units, and the span list with
  names and attributes.
- Continue when every listed question maps to one signal; route a question that depends on an authoritative
  effect to `web-backend` and one that depends on browser behavior to `web-platform`.

#### 2.2 Define correlation and context propagation

- Take the signal set and the complete list of boundaries one user action crosses: document, worker, service
  worker, fetch, Electron preload and IPC, server, queue, and provider.
- Carry one trace context across every boundary, using `traceparent` and `tracestate` on HTTP boundaries and
  an explicit field elsewhere; decide the sampling rule at the entry point so a sampled action stays sampled
  across every hop, and attach the build identity to every signal so a report resolves to exact bytes.
- Record a boundary-by-boundary propagation map, the sampling decision and where it is made, and the
  build-identity attribute name.
- Continue when one identifier joins client, server, and crash signals for a single action; confirm with
  `web-platform` that a cross-origin request carrying `traceparent` is allowed by the receiver, since that
  header is not safelisted and makes the request preflighted, and record any boundary that cannot carry
  context as a named correlation limit.

#### 2.3 Define crash and unhandled-error capture

- Take the list of shipped surfaces — browser document, worker, and for an installed application the Electron
  main, renderer, and utility processes — and the build identity from Step 2.2.
- Cover the two failure classes separately: capture errors the surface survives in process through the global
  `error` and `unhandledrejection` handlers and any framework error boundary, and capture failures it does not
  survive from outside it, declaring a `crash-reporting` or `default` endpoint through `Reporting-Endpoints`
  because a `crash` report cannot be observed in JavaScript by the page that crashed
  ([Reporting API](https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API)), and in Electron calling
  [`crashReporter.start()`](https://www.electronjs.org/docs/latest/api/crash-reporter) in the main process
  before `app.on('ready')` — a renderer created before that call is not monitored — with `render-process-gone`
  and `child-process-gone` handled on `app`.
- Record, per surface, the in-process error path, the out-of-process failure path, the attached build
  identity, and the decision that makes a reported stack readable, which `web-deployment` owns.
- Continue when both paths exist for every shipped surface; treat the browser Reporting API as newly
  available rather than universal, keep the in-process path as the signal that must always work, and record
  any surface whose unsurvivable failure cannot be captured as an accepted gap with its owner.

### Phase 3 — Implement Emission and Redaction

#### 3.1 Build the redaction seam and the emitter

- Take the designed signal set and the `web-security` classification of protected fields.
- Implement one emission seam that every signal passes through and allow-list the attributes each signal may
  carry, so a newly added field is absent until it is added deliberately; strip credentials, tokens,
  authorization headers, cookies, session identifiers, and personal data at that seam, including inside URLs,
  query strings, request and response bodies, exception messages, and crash annotations.
- Produce one seam with its allow-list plus a test proving that a record containing a protected field leaves
  the seam without it.
- Continue when no signal path bypasses the seam; repair a direct call to a transport that skips it before
  instrumenting anything further, because a deny-list ships the next unredacted field.

#### 3.2 Instrument the paths and their failures

- Take the seam, the propagation map, and the feature's real code paths.
- Instrument the shortest complete path first — entry, authoritative effect, truthful completion, and one
  failure — then add slices in risk order, and deliver from the browser without blocking navigation by using
  [`navigator.sendBeacon()`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) or `fetch()`
  with `keepalive` on `visibilitychange` to hidden rather than on `unload` or `beforeunload`, which are
  unreliable and defeat the back/forward cache.
- Produce one real action that yields a joined log, metric, span, and, where applicable, error report, with
  buffered signals flushed when the document hides.
- Continue slice by slice; repair a telemetry call that throws into the user path, blocks an authoritative
  effect, or retries until the request degrades before adding another slice.

### Phase 4 — Prove the Signals and Hand Off

#### 4.1 Prove each signal against a real failure

- Take the instrumented paths, the question table, and the configured destinations.
- Reproduce or inject one real failure of each class — handled error, unhandled rejection, unsurvivable crash,
  slow path, and degraded dependency — then answer the Phase 1 questions using only what arrived at the
  destination.
- Record, per question, the arriving record that answers it, its latency to the destination, and its sampling
  and retention state, and per crash class a stack resolved to source or the stated reason it could not be.
- Return an unanswerable question to Step 2.1 and a signal that never arrived to Step 3.2; ask `web-testing`
  for a harness when reproduction needs one and `web-platform` when a browser fact is disputed.

#### 4.2 Check the destination and hand off

- Take the arrived records, the allow-list, and each destination's retention and access configuration.
- Read the records actually stored at the destination rather than the emitter's input, search them for
  credentials, tokens, session identifiers, and personal data, and record who can read each destination and
  for how long.
- Reconcile every question with its answering signal, its cost and cardinality, the destination check result,
  the named correlation and coverage limits, and every accepted gap with its owner.
- Treat a protected value found at a destination as a `web-security` finding with its own remediation and
  retention correction; hand the reconciled result to `web-feature` or the requesting caller, reporting
  implemented emission, verified arrival, and observed live health as separate claims.

## References
