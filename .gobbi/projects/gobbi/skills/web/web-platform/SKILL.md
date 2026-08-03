---
name: web-platform
description: "MUST load when interpreting or verifying browser and Web Platform behavior, security boundaries, lifecycle, compatibility, accessibility, performance evidence, or diagnostics."
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch
skill-type: tool
---

# Web Platform

Use this manual to answer what a web standard defines, what a target browser and execution context do, and
what an observation can establish. It covers lifecycle, navigation, storage, networking, origins,
compatibility, accessibility evidence, performance evidence, and diagnosis.

It supplies platform facts to `web-app-lifecycle`, development, frontend, backend, architecture, security,
testing, HTML, CSS, language, and framework owners. It does not choose product behavior, controls, tests, or
architecture; `web-app-lifecycle` chooses the user-visible browser and PWA state contract.

## Principles

### Standards, browser support, and observed behavior are different facts

Name which one the evidence establishes and the versions, contexts, or flags that bound it.

### The browser is a concurrent, interruptible environment

Navigation, lifecycle, network, storage, rendering, and user input may interleave or terminate.

### Security boundaries are architectural inputs

Origins, credentials, capabilities, isolation, and trusted execution contexts constrain what code may safely
do.

### Measure the claim at the layer that owns it

DOM, accessibility tree, pixels, network, timings, storage, console, server effects, and user outcomes are
not interchangeable evidence.

## Rules

- **MUST distinguish normative standards, compatibility data, project support policy, and observed
  behavior.** Cite current primary standards and record browser, version, device, context, configuration, and
  date for observations.
- **MUST identify every materially different target context and security state.** Window, worker, secure
  context, origin, background lifecycle, and browser versions do not share capabilities or results.
- **MUST inspect the evidence layer that owns the claim.** Use source and static checks, DOM and accessibility
  trees, rendered frames, network and storage panels, performance traces, server records, or field telemetry
  according to what is being asserted.
- **MUST report applicable navigation, history, refresh, lifecycle termination, eviction, concurrency,
  offline, and late-result facts.** A clean foreground path does not establish those behaviors.
- **MUST report origin, credential, permission, sandbox, isolation, and trusted-context facts without turning
  browser restrictions into server authorization.** Route control requirements to `web-security`.
- **NEVER claim compatibility, accessibility, responsiveness, performance, reliability, or security from a
  screenshot, emulator label, single trace, or passing happy path alone.** State the proven claim and every
  limitation, and route evidence design to `web-testing`.

## Manual

### Evidence and Compatibility

Start with the applicable primary standard, such as the
[HTML Living Standard](https://html.spec.whatwg.org/) or
[Fetch Standard](https://fetch.spec.whatwg.org/), then separate that normative behavior from browser
implementation and project support policy. Verify version-sensitive facts against the current owner and
observe required behavior in every materially different supported target.

Record browser and engine version, operating system, device or emulation, viewport, input and assistive
technology, locale, network and CPU conditions, execution context, origin security, permissions, flags,
extensions, cache state, and date as applicable. Reduce discrepancies to a minimal standards-based example.

Match evidence to the claim:

| Evidence | What it can establish |
|---|---|
| Standards and source inspection | Defined semantics and implementation structure |
| DOM and accessibility tree | Exposed structure, names, roles, states, and relationships |
| Rendered frames | Pixels at named states, sizes, and settings |
| Live interaction | Focus, input, history, timing, interruption, and recovery behavior |
| Network, storage, and performance traces | Requests, caches, lifecycle, scheduling, and measured timings |
| Authoritative server or provider records | Effects outside the browser |
| Field telemetry | Observed distributions in the instrumented population |

### Execution Context and Lifecycle

Identify whether code runs in a document window, dedicated or shared worker, service worker, worklet, server,
edge runtime, or build step. Available APIs, DOM access, credentials, lifetime, scheduling, and diagnostic
surfaces differ; state every prerequisite, permission, compatibility limit, and expected failure.

Assume asynchronous work can finish after state changes and that a page can be hidden, frozen, restored,
navigated, discarded, or terminated. Guard late results, cancellation, cleanup, duplicate registration,
re-entry, and stale closures or references; do not depend on unload-time work for a critical effect.

Promise jobs, tasks, observer callbacks, animation frames, layout, paint, network completion, and user events
have distinct scheduling behavior. Use traces or a minimal reproduction when their causal order matters.

### Navigation and State

Direct URLs, links, forms, redirects, history, fragments, refresh, restoration, deep links, duplicate tabs,
provider returns, expired sessions, and identity changes may produce distinct document and history states.
Observe URL, focus, title, scroll, and authoritative application state at the layer that owns each fact.

Treat in-memory state as disposable. For storage, define origin and user partitioning, capacity and eviction,
expiry, schema and version migration, logout and identity-switch cleanup, multi-tab coordination, privacy,
and recovery from unavailable or corrupt data.

Service workers add installation, activation, control, update, cache-version, fallback, mixed-client, stale,
queued-effect, replay, conflict, and removal states. A cached shell does not establish that protected data or
mutations are current.

Report the supported state set, unavailable capabilities, and version-sensitive observations to
`web-app-lifecycle`; keep the resulting product behavior and recovery choice with that preference.

### Network and Origin Security

Scheme, host, port, origin, site, top-level context, embedder, redirect, and credential mode affect requests.
Preflight, CORS headers, cookies, redirects, caches, referrer policy, content type, mixed content, and secure
contexts expose different browser facts.

Same-origin policy, CORS, CSP, sandboxing, permissions policy, integrity metadata, cross-origin isolation, and
secure contexts limit capabilities or exposure. They do not replace server authentication, authorization,
validation, CSRF defenses, abuse controls, or output handling.

Abort, timeout, offline transition, retry, duplicate submission, partial response, streaming, redirect loop,
stale cache, and late result are distinct failure facts. Security and backend owners decide the control and
effect policy.

### Accessibility, Performance, and Diagnostics

Use the [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) as a current normative
accessibility reference where the project adopts WCAG. Automation, DOM and accessibility trees, keyboard and
focus behavior, zoom and reflow, settings, assistive technology, and representative users establish different
facts; no single tool establishes conformance.

Lab traces and field distributions answer different performance questions. Record device, network, cache,
cold or warm state, population, and attribution across network, main thread, rendering, memory, caching, and
third parties.

Use console messages, source maps, network and storage inspection, performance and memory profiles, protocol
or automation traces, server correlation identifiers, and minimal reproductions according to the failure.
Diagnostics must avoid credentials and unnecessary personal data and remain usable in degraded conditions.

### Failure and Progressive Enhancement

Valid documents, standard links, native controls, and form semantics provide baseline capabilities when the
product supports them. JavaScript, storage, permissions, network requests, providers, and enhancements each
add distinct unavailability and recovery states.

Interpret invalid or stale state, interruption, history traversal, refresh, lost connectivity, quota denial,
backgrounding, cancellation, concurrency, retry, and late completion through minimal reproductions and owner
diagnostics. A degraded interface may narrow capability but cannot establish an effect it did not verify.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
