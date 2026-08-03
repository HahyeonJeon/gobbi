# Web Platform Evaluation Checklist

This reusable unchecked source evaluates one Web Platform interpretation, lookup, or diagnosis produced under
this manual, against the fact-class, target-context, evidence-layer, interruption, origin-boundary, and
proven-claim obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-platform`](SKILL.md) manual, with [`web-security`](../web-security/SKILL.md) owning control
requirements, [`web-testing`](../web-testing/SKILL.md) owning evidence design,
[`web-frontend`](../web-frontend/SKILL.md) and [`web-backend`](../web-backend/SKILL.md) owning product
behavior, and [`web-architecture`](../web-architecture/SKILL.md) owning structural choice. The source commit
that contains this file identifies the checklist version. Its stable owner prefix is `WEBPLAT`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBPLAT-SC-PROJECT-01 — Normal case: the question stays on the platform

This manual answers what a standard defines, what a target browser and execution context do, and what an
observation can establish. The expected outcome supplies those facts and routes every decision to its owner; an
answer that also chooses product behavior, a control, a test, or an architecture is the failure.

#### Checklist

- [ ] WEBPLAT-CK-PROJECT-01-01 — The inspected question concerns a web standard, a target browser or execution context's behavior, or what an observation can establish.
- [ ] WEBPLAT-CK-PROJECT-01-02 — Every decision the inspection raises is routed to its owner: control requirements to `web-security`, evidence design to `web-testing`, product and browser behavior to `web-development` and `web-frontend`, and structural choice to `web-architecture`.

## Structure

### WEBPLAT-SC-STRUCTURE-01 — Normal case: the claim is measured at the layer that owns it

DOM, accessibility tree, pixels, network, timings, storage, console, server effects, and user outcomes answer
different questions. The expected outcome inspects the layer that owns each claim and attributes every
observation to the layer that produced it; evidence borrowed from an adjacent layer is the failure.

#### Checklist

- [ ] WEBPLAT-CK-STRUCTURE-01-01 — Every claim is inspected at the evidence layer that owns it.
- [ ] WEBPLAT-CK-STRUCTURE-01-02 — Every observation is attributed to the layer that produced it: standards and source inspection for defined semantics and implementation structure, DOM and accessibility tree for exposed structure, names, roles, states, and relationships, rendered frames for pixels at named states, live interaction for focus, input, history, timing, interruption, and recovery behavior, network, storage, and performance traces for requests, caches, lifecycle, scheduling, and measured timings, authoritative server or provider records for effects outside the browser, and field telemetry for observed distributions in the instrumented population.
- [ ] WEBPLAT-CK-STRUCTURE-01-03 — No observation from one of those layers is exchanged for an observation from another.

### WEBPLAT-SC-STRUCTURE-02 — Normal case: every materially different target context is identified

Available APIs, DOM access, credentials, lifetime, scheduling, and diagnostic surfaces differ by where code
runs and under what security state. The expected outcome identifies each materially different context and
states its limits; a result carried from one context to another is the failure.

#### Checklist

- [ ] WEBPLAT-CK-STRUCTURE-02-01 — Every materially different execution context is identified: document window, dedicated or shared worker, service worker, worklet, server, edge runtime, and build step.
- [ ] WEBPLAT-CK-STRUCTURE-02-02 — Secure context, origin, background lifecycle, and browser version are identified as separate security and capability states.
- [ ] WEBPLAT-CK-STRUCTURE-02-03 — Every prerequisite, permission, compatibility limit, and expected failure is stated for the identified context.
- [ ] WEBPLAT-CK-STRUCTURE-02-04 — No result observed in one context is carried to another without observing it there.

## Performance

### WEBPLAT-SC-PERFORMANCE-01 — Rule violation: a cost claim rests on one measurement

A single trace, an emulated device label, or a fast local run is offered as the performance answer. The
expected outcome uses lab traces and field distributions for the questions each can answer and records the
conditions behind the number; a measurement whose conditions the product never meets is the failure.

#### Checklist

- [ ] WEBPLAT-CK-PERFORMANCE-01-01 — No performance claim rests on a single trace, an emulator label, or a passing happy path alone.
- [ ] WEBPLAT-CK-PERFORMANCE-01-02 — Lab traces and field distributions are each used for the performance question they can answer.
- [ ] WEBPLAT-CK-PERFORMANCE-01-03 — Device, network, cache, cold or warm state, population, and attribution across network, main thread, rendering, memory, caching, and third parties are recorded with the measurement.

## Aesthetics

### WEBPLAT-SC-AESTHETICS-01 — Poor quality: observation and inference are mixed in the record

The answer is correct but the record does not separate what was seen from what was concluded, so a reader
cannot tell which part is evidence. The expected outcome records observations first, names the authority
behind each conclusion, and reduces a discrepancy to something minimal a reader can run.

#### Checklist

- [ ] WEBPLAT-CK-AESTHETICS-01-01 — Observations are recorded before any inference drawn from them.
- [ ] WEBPLAT-CK-AESTHETICS-01-02 — Every discrepancy is reduced to a minimal standards-based example.
- [ ] WEBPLAT-CK-AESTHETICS-01-03 — Every answer names its authority: the current primary standard for semantics, or the declared target it was observed on for behavior.

## Usage

### WEBPLAT-SC-USAGE-01 — Normal case: an answer the caller can reproduce

An observation means nothing without the conditions it came from, and a caller has to know which kind of fact
it received. The expected outcome records the observation conditions and names the fact class; an answer that
cannot be re-observed is the failure.

#### Checklist

- [ ] WEBPLAT-CK-USAGE-01-01 — Every observation records browser and engine version, operating system, device or emulation, viewport, input and assistive technology, locale, network and CPU conditions, execution context, origin security, permissions, flags, extensions, cache state, and date as applicable.
- [ ] WEBPLAT-CK-USAGE-01-02 — Every answer states whether it establishes a normative standard, compatibility data, project support policy, or observed behavior.

### WEBPLAT-SC-USAGE-02 — Normal case: accessibility facts come from the layers that establish them

Automation, trees, keyboard behavior, zoom and reflow, settings, assistive technology, and representative
users each establish something different. The expected outcome keeps those facts separate and uses the current
normative reference where the project adopts it; a tool result reported as conformance is the failure.

#### Checklist

- [ ] WEBPLAT-CK-USAGE-02-01 — WCAG 2.2 is used as the normative accessibility reference where the project adopts WCAG.
- [ ] WEBPLAT-CK-USAGE-02-02 — Automation, DOM and accessibility trees, keyboard and focus behavior, zoom and reflow, settings, assistive technology, and representative users are each reported as establishing a different fact.
- [ ] WEBPLAT-CK-USAGE-02-03 — No single tool is treated as establishing conformance.

### WEBPLAT-SC-USAGE-03 — Expected failure: a capability is unavailable and the path degrades

JavaScript, storage, permissions, a network request, or a provider is unavailable, so the product falls back
to what the platform still offers. The expected outcome reports each unavailability and recovery state
separately and keeps the degraded path's claim inside what it verified; a fallback described as equivalent is
the failure.

#### Checklist

- [ ] WEBPLAT-CK-USAGE-03-01 — JavaScript, storage, permissions, network requests, providers, and enhancements each have their own unavailability and recovery states reported.
- [ ] WEBPLAT-CK-USAGE-03-02 — Baseline capabilities from valid documents, standard links, native controls, and form semantics are identified where the product supports them.
- [ ] WEBPLAT-CK-USAGE-03-03 — No degraded interface is treated as establishing an effect it did not verify.

## Consistency

### WEBPLAT-SC-CONSISTENCY-01 — Rule violation: specification status is presented as target support

A specification stage or a compatibility table is used to answer whether the product's browsers do something.
The expected outcome keeps the four fact classes distinct and establishes support by direct observation on the
declared targets; inferring one class from another is the failure.

#### Checklist

- [ ] WEBPLAT-CK-CONSISTENCY-01-01 — Normative standards, compatibility data, project support policy, and observed behavior are kept as four distinct facts.
- [ ] WEBPLAT-CK-CONSISTENCY-01-02 — Support on the declared targets is established by direct observation rather than inferred from specification status or a compatibility table.
- [ ] WEBPLAT-CK-CONSISTENCY-01-03 — Every version-sensitive fact is verified against its current owner at the time it is given.

### WEBPLAT-SC-CONSISTENCY-02 — Edge case: two supported targets disagree

The required behavior appears in one supported target and not in another, so one observation cannot stand for
the platform. The expected outcome observes the behavior in every materially different supported target and
bounds each result; a single target generalized to the support policy is the failure.

#### Checklist

- [ ] WEBPLAT-CK-CONSISTENCY-02-01 — Required behavior is observed in every materially different supported target rather than in one.
- [ ] WEBPLAT-CK-CONSISTENCY-02-02 — The versions, contexts, or flags that bound each differing result are named.
- Also applies: WEBPLAT-CK-AESTHETICS-01-02 (discrepancy reduced to a minimal standards-based example).

## Risk

### WEBPLAT-SC-RISK-01 — Normal case: interruption and concurrency are reported, not assumed

The browser can hide, freeze, restore, navigate, discard, or terminate a page while asynchronous work is still
running. The expected outcome reports those facts and the guards around them; a clean foreground pass offered
as evidence for them is the failure.

#### Checklist

- [ ] WEBPLAT-CK-RISK-01-01 — Applicable navigation, history, refresh, lifecycle termination, eviction, concurrency, offline, and late-result facts are reported.
- [ ] WEBPLAT-CK-RISK-01-02 — No clean foreground path is treated as establishing those facts.
- [ ] WEBPLAT-CK-RISK-01-03 — Late results, cancellation, cleanup, duplicate registration, re-entry, and stale closures or references are guarded.
- [ ] WEBPLAT-CK-RISK-01-04 — No critical effect depends on unload-time work.

### WEBPLAT-SC-RISK-02 — Normal case: storage and service-worker state are their own facts

Data outlives the document, and a service worker adds a lifecycle the page does not control. The expected
outcome defines the storage and worker states explicitly and keeps a cached shell from standing for current
data; treating in-memory state or a served shell as authoritative is the failure.

#### Checklist

- [ ] WEBPLAT-CK-RISK-02-01 — Origin and user partitioning, capacity and eviction, expiry, schema and version migration, logout and identity-switch cleanup, multi-tab coordination, privacy, and recovery from unavailable or corrupt data are defined for storage.
- [ ] WEBPLAT-CK-RISK-02-02 — Service-worker installation, activation, control, update, cache-version, fallback, mixed-client, stale, queued-effect, replay, conflict, and removal states are reported where a service worker is present.
- [ ] WEBPLAT-CK-RISK-02-03 — No cached shell is treated as establishing that protected data or mutations are current.
- [ ] WEBPLAT-CK-RISK-02-04 — In-memory state is treated as disposable.
- [ ] WEBPLAT-CK-RISK-02-05 — Diagnostics avoid credentials and unnecessary personal data.
- [ ] WEBPLAT-CK-RISK-02-06 — Diagnostics remain usable in degraded conditions.

### WEBPLAT-SC-RISK-03 — Rule violation: a browser restriction is turned into server authorization

Same-origin policy, CORS, CSP, sandboxing, or a secure-context requirement is reported as though it protects
the server. The expected outcome reports them as browser facts and routes the control requirement outward; a
browser restriction presented as authorization is the failure.

#### Checklist

- [ ] WEBPLAT-CK-RISK-03-01 — Origin, credential, permission, sandbox, isolation, and trusted-context facts are reported as browser facts.
- [ ] WEBPLAT-CK-RISK-03-02 — Same-origin policy, CORS, CSP, sandboxing, permissions policy, integrity metadata, cross-origin isolation, and secure contexts are not treated as replacing server authentication, authorization, validation, CSRF defenses, abuse controls, or output handling.
- [ ] WEBPLAT-CK-RISK-03-03 — Every control requirement the inspection raises is routed to `web-security`.

### WEBPLAT-SC-RISK-04 — Adversarial: a plausible artifact stands in for the observation the claim needs

A screenshot, an emulator label, one trace, or a passing happy path is offered as the evidence a hard claim
needs, producing an answer that looks fully supported. The expected outcome keeps each artifact inside what it
establishes and leaves the rest unproven; a substitute accepted as the evidence is the failure.

#### Checklist

- [ ] WEBPLAT-CK-RISK-04-01 — No compatibility, accessibility, responsiveness, performance, reliability, or security claim rests on a screenshot, an emulator label, a single trace, or a passing happy path alone.
- [ ] WEBPLAT-CK-RISK-04-02 — The proven claim and every limitation bounding it are stated with the answer.
- [ ] WEBPLAT-CK-RISK-04-03 — Evidence design is routed to `web-testing` rather than substituted with the nearest available artifact.

## Overall

### WEBPLAT-SC-OVERALL-01 — Normal case: a diagnosis another person can reproduce

A complete platform answer interprets the failure through the owning diagnostics and a minimal reproduction,
and reports what it found and what it does not know. The scenario fails when the interpretation starts at the
surface, or when the report omits the target, state, evidence, owner, or unknowns needed to repeat it.

#### Checklist

- [ ] WEBPLAT-CK-OVERALL-01-01 — Invalid or stale state, interruption, history traversal, refresh, lost connectivity, quota denial, backgrounding, cancellation, concurrency, retry, and late completion are interpreted through minimal reproductions and owner diagnostics.
- [ ] WEBPLAT-CK-OVERALL-01-02 — The report states the target, state, evidence, owner, and unknowns.
- [ ] WEBPLAT-CK-OVERALL-01-03 — Every unavailable observation remains an open unknown rather than an inferred result.
