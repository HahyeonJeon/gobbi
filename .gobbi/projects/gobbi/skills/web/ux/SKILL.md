---
name: ux
description: Use after the web and generic UX skills to design, implement, and evaluate the browser-experience realization of one web feature.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Web User Experience Development

Web specialization for realizing one accepted user outcome across browser journeys. Load
[`web`](../SKILL.md) first and generic [`ux`](../../ux/SKILL.md) second; this skill is third. The root owns the
complete vertical feature and release gate. Generic UX owns direct research, experience specification,
disposable prototype, representative-user testing, design acceptance, and measurement handoff. This child
owns browser-specific continuity: URL entry/history, content and decision flow, sessions/auth transitions,
latency/interruption/recovery, web trust, irreversible transactions, realistic web contexts, and valid outcome
instrumentation.

Load generic [`ui`](../../ui/SKILL.md) then [`web/ui`](../ui/SKILL.md) whenever the outcome has an observable
browser interface; UX does not own visual or component realization. Load applicable language/framework skills
for implementation idioms. React routing and state integrations may exercise this contract, but React APIs,
hooks, rendering modes, router/state libraries, and ecosystem conventions belong to the future React skill.

## Principles

> **The experience is the outcome across entries, time, and system boundaries.**

A journey includes direct entry, navigation, waiting, interruption, failure, return, support, and the
authoritative effect—not only the screen sequence drawn for the happy path.

> **The URL, history, session, and browser chrome are part of the journey.**

People enter through links, refresh, go back, open tabs, return from providers, and resume later. Each browser
behavior must have an intentional, safe meaning.

> **Preserve intent and work before asking people to repeat themselves.**

Latency, auth expiry, validation, offline state, provider handoff, and recovery should retain safe context and
offer the smallest understandable next action.

> **Trust must be legible before commitment.**

Identity, authority, data use, permission, consent, third parties, cost, irreversibility, and recovery must be
understandable at the decision point, not buried after action.

> **Measurement must distinguish exposure, attempt, effect, recovery, and harm.**

Client interaction is not authoritative completion. Instrumentation must be privacy-conscious, reconcilable,
and limited to claims supported by observed contexts.

## Rules

### Must-Follow

- **WEB-UX-R01 — MUST preserve the accepted generic UX specification and parent feature outcome.** Trace every
  entry, step, message, decision, recovery, trust cue, and measurement to the accepted experience clauses and
  parent contract. Reopen the owning decision when browser constraints create a conflict.
- **WEB-UX-R02 — MUST give browser navigation intentional semantics.** Define direct and deep entry, canonical
  URL, bookmark/share where allowed, refresh, back/forward, history replacement/push, multiple tabs/windows,
  return from external handoff, and session restore. Prevent stale or sensitive URLs/state from posing as a
  valid current outcome.
- **WEB-UX-R03 — MUST make orientation, content, and decisions self-sufficient.** At every state, show where the
  person is, why they are there, current status, relevant consequence, primary and alternative actions, and
  support/recovery in plain project language. Do not rely on remembered prior screens or browser accidents.
- **WEB-UX-R04 — MUST preserve safe continuity across identity and context changes.** Define sign-in/out,
  reauthentication, authorization change, session expiry, account/tenant switch, role change, another tab,
  and return from email or provider. Retain permissible intent/work, discard unsafe context, and explain the
  transition without leaking protected state.
- **WEB-UX-R05 — MUST design for time and interruption.** Cover latency, progress, cancellation, navigation
  away, offline/poor network, stale or partial data, tab suspension, retry, duplicate action, late result,
  cross-device/cross-session return where promised, and safe resumption. Never make waiting look complete or
  repeat an irreversible effect invisibly.
- **WEB-UX-R06 — MUST make failure and recovery proportional and actionable.** Distinguish input, permission,
  session, conflict, dependency, rate/capacity, unavailable, and unknown failures; preserve safe work; state
  what happened without harmful detail; provide the next safe action, escalation/support route, and expected
  ownership. Avoid blame, dead ends, and generic retry loops.
- **WEB-UX-R07 — MUST minimize transaction burden and protect consequential action.** Ask only necessary data
  at the point it is needed, use safe defaults/autofill, expose progress where it helps, enable review and
  correction, make cost/terms/consequences clear, confirm or authenticate in proportion to risk, and provide
  receipt, reversal, dispute, or support paths for legal, financial, destructive, or otherwise irreversible
  effects.
- **WEB-UX-R08 — MUST make web trust boundaries understandable.** Explain identity, authority, requested
  permission, data purpose/retention/sharing, consent choice, external domain/provider transitions, return
  state, and security-sensitive instructions at the point of decision. Avoid deceptive urgency, coerced
  consent, ambiguous branding, and patterns that train people to ignore phishing signals.
- **WEB-UX-R09 — MUST validate in representative web contexts.** Preserve generic UX direct-research and
  prototype chronology, and include the devices, browsers, input/assistive modes, locales, network qualities,
  auth states, interruption patterns, privacy conditions, and consequential contexts that materially affect
  the outcome. Missing required people, consent, accommodations, or evidence remains `NEEDS_CONTEXT`.
- **WEB-UX-R10 — MUST define an outcome measurement model before implementation.** Distinguish eligible
  population, exposure, entry, attempt, progress, authoritative completion, visible completion, failure class,
  recovery, abandonment, support escalation, harm/guardrail, and downstream outcome. Define baselines,
  denominators, time windows, segments, exclusions, owners, and what evidence could disprove success.
- **WEB-UX-R11 — MUST keep instrumentation trustworthy and proportionate.** Minimize client analytics, honor
  consent and privacy controls, avoid sensitive payloads, make event semantics/version/identity joins explicit,
  deduplicate retries, and reconcile client-visible events with server/data/provider truth. Treat missing,
  blocked, delayed, or duplicated telemetry as data quality, not user behavior.
- **WEB-UX-R12 — MUST finish the production experience and hand measurement back to the parent.** Complete all
  affected production routes, content, states, auth/session behavior, recovery/support, instrumentation,
  experiments if authorized, docs, and diagnostics. Keep framework APIs with their owner. Report accepted UX,
  implementation correctness, release readiness, deployment, and live outcome validation separately.

### Must-Not-Follow

- **NEVER model a web journey as one linear happy-path screen sequence.** Return to WEB-UX-R02–WEB-UX-R06 and
  include alternate entry, time, interruption, failure, and return.
- **NEVER trade user intent, informed choice, privacy, or reversible recovery for conversion or fewer clicks.**
  Return to WEB-UX-R07–WEB-UX-R11 and expose the real consequence and measurement guardrails.
- **NEVER call a click, route arrival, client event, or polished prototype an authoritative outcome.** Reconcile
  with the system effect and retain the generic UX acceptance boundary.
- **NEVER let this child redesign interface realization or prescribe framework APIs.** Route visual/component
  mechanics to `web/ui` and framework idioms to their owner.

## Procedure

Run eight phases after the parent routes the feature here.

### P1 — Read accepted experience and current journey

Read the parent feature contract, accepted generic UX specification/research, current routes/content/session and
provider behavior, analytics definitions, support data, project privacy rules, and existing outcome baselines.
Trace accepted clauses to current and affected journey surfaces. Stop with `NEEDS_CONTEXT` when required generic
UX evidence is absent.

**Evidence:** accepted-clause trace, current journey, evidence limits, baseline and owner register.

### P2 — Lock entries, orientation, and browser continuity

Map direct/deep/internal entry, URL and history meaning, bookmark/share, refresh, multiple tabs, external return,
restore, orientation content, and state ownership. Decide what persists, reconciles, expires, or is discarded.

**Evidence:** entry/history/continuity map with stale and sensitive-state oracles.

### P3 — Lock time, identity, failure, and recovery journeys

For every activated state, map latency/progress/cancel, interruption/offline/stale, auth/session/role/context
change, duplicate/late result, failure class, retained work, retry/resumption, support, and terminal outcome.
Use [`ideation.md`](ideation.md) for unresolved axes.

**Evidence:** state/journey sequences, work-retention rules, failure taxonomy, recovery/support map.

### P4 — Lock trust and consequential decisions

Map data requests and purpose, consent/permission, identity/authority, provider/domain transitions, cost/terms,
review/correction, confirmation/reauthentication, receipt, reversal/dispute, and harmful misuse. Reconcile UI
realization requirements with `web/ui` without moving experience authority.

**Evidence:** trust/decision map, consequential-action safeguards, UI handoff clauses.

### P5 — Lock representative contexts and measurement

Select the smallest risk-complete web-context matrix from accepted research and feature risk. Define population,
exposure, attempt, authoritative and visible completion, failures, recovery, abandonment, escalation, harm,
downstream outcomes, baselines, denominators, windows, segments, exclusions, privacy, event versions, joins,
deduplication, and reconciliation.

**Evidence:** context matrix, accepted evidence status, metric/event dictionary, data-quality and guardrail plan.

### P6 — Build the journey skeleton and grow slices

Implement the smallest entry-to-authoritative-outcome journey with truthful status and instrumentation, then
add one entry, interruption, identity, failure/recovery, trust, and consequential slice at a time. Keep routes,
content, state, server truth, analytics, support, tests, and docs synchronized. Framework integration is judged
by its web outcome, not prescribed here.

**Evidence:** ordered slice log with focused journey and telemetry reconciliation.

### P7 — Verify experience realization and measurement

Execute selected [`scenarios.md`](scenarios.md) and [`checklists.md`](checklists.md) across the context matrix.
Use live browser journeys and authoritative effects for implementation, accepted generic UX representative-user
evidence for design, and event/server reconciliation for measurement validity. Record gaps and post-deployment
metrics as pending rather than forecasting them as achieved.

**Evidence:** journey/effect/evidence matrix, telemetry-quality results, limitations and pending live claims.

### P8 — Evaluate and hand back to the parent

Use [`evaluation.md`](evaluation.md) inside the active evaluation. Resolve findings at the earliest generic UX,
web UX, web UI, root web, security/data, or framework owner. Hand accepted experience status, realized journeys,
context limits, measurement plan, implementation evidence, and live-validation plan to the root release gate.

**Evidence:** filled child checks, evaluation findings/dispositions, root handoff.

## References

- [`../SKILL.md`](../SKILL.md) owns the vertical feature and release-ready contract.
- [`../../ux/SKILL.md`](../../ux/SKILL.md) owns generic direct research, experience specification, disposable
  prototype, representative-user testing, acceptance, and measurement handoff.
- [`../../ui/SKILL.md`](../../ui/SKILL.md) then [`../ui/SKILL.md`](../ui/SKILL.md) own observable browser-
  interface design and realization when present.
- [`ideation.md`](ideation.md), [`scenarios.md`](scenarios.md), [`checklists.md`](checklists.md), and
  [`evaluation.md`](evaluation.md) operationalize this child without adding policy.
- [WHATWG HTML](https://html.spec.whatwg.org/) defines browser navigation/history, forms, session history, and
  interaction mechanics that constrain the journey.
- [W3C Web Authentication](https://www.w3.org/TR/webauthn-3/) is a current primary reference when WebAuthn
  materially shapes authentication journeys; feature requirements select its applicability.
- [W3C Privacy Principles](https://www.w3.org/TR/privacy-principles/) supplies web privacy principles;
  governing law and project policy still own requirements.
- [Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds) helps distinguish
  user-centered field performance from lab evidence; the project owns targets.
- React routing/state integrations are cases only; the future React skill owns React and ecosystem policy.
