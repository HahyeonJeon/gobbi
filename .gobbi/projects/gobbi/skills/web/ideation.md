# Web Feature Ideation

Discussion procedure for P1–P4 of [`SKILL.md`](SKILL.md). It converts one requested web feature into the
locked outcome, design-owner routing, vertical contract, and evidence plan the parent requires. It adds no
policy and never replaces generic [`ui`](../ui/ideation.md) or [`ux`](../ux/ideation.md) design discussion. It
adapts the structured interview axes in [`startup/topics.md`](../startup/topics.md) to one existing-project
feature; it does not run project startup or create a project-wide baseline.

## Conduct

1. Follow D0–D9 in dependency order and discuss one decision axis per turn.
2. Inspect repository and project evidence before asking. Show the verified fact and ask the user to confirm
   or correct it.
3. Treat each prompt list as a bank, not a questionnaire. Ask only what current evidence does not settle.
   Use the startup topic bank to test What/Why/How completeness, then keep only questions that can change this
   feature's outcome, boundary, design, contract, proof, or release controls.
4. Smart-skip an axis only when current evidence answers it and the user already locked that answer for this
   run. Record both.
5. Research internal and current authoritative external evidence before a design-bearing recommendation.
   Present two material options when they exist, recommend one, and name what evidence would change it.
6. Mark answers `confirmed`, `assumption`, `recorded-open:<owner+method>`, or `contradicted`. Push a vague or
   contradicted answer with a concrete example or counterexample at most twice, then record it open.
7. Reopen the earliest owning decision when later evidence contradicts it. Never repair a wrong scope,
   design, or trust premise only in code.
8. Keep stakeholder decisions, representative-user observations, technical evidence, and forecasts as
   separate ledger entries.

For every axis record: **evidence**, **options**, **recommendation**, **user decision**, **effects**, and any
**reopen condition**.

## D0 — Current reality and trigger

Inspect the live routes, interface, APIs, schemas, auth controls, tests, telemetry, configuration, migrations,
and release path named by the request.

- What last concrete event triggered this feature work?
- What behavior exists now, and which claim is proved by repository or observed evidence?
- Who owns product, design, security, data, and release decisions?
- Which compatibility promises or active users make change expensive?

**Close with:** current-reality register, trigger, authority map, and compatibility constraints.

## D1 — One outcome and success

- Which actor reaches what observable result from which trigger and entry?
- What user-visible and system evidence jointly proves completion?
- What could look successful while the required state or effect is absent?
- Which baseline and target show improvement, and who owns the measurement?

Lock one sentence: “When `<trigger/context>` occurs, `<actor>` can `<bounded outcome>`, evidenced by
`<visible signal>` and `<system signal>`.”

**Close with:** outcome, completion/false-completion signals, baseline, target, and evidence owner.

## D2 — Boundary, actors, and non-goals

- Which entries, paths, states, supporting actors, errors, recovery, support, and effects are necessary?
- Which neighboring outcomes merely share a page, endpoint, model, or provider?
- Which existing behavior must remain unchanged?
- Where does this feature hand off to another outcome, system, or team?

For login, a safe retry and recovery handoff can be in scope while registration, password reset completion,
account administration, and onboarding remain separate. For payment, the bounded attempt can include provider
failure and reconciliation without creating an entire commerce platform.

**Close with:** in-scope list, explicit non-goals, handoffs, and the test for admitting later scope.

## D3 — People, contexts, and evidence conditions

- Which people and contexts support each UI or UX claim?
- Which devices, browsers, input methods, abilities, locales, networks, auth states, privacy conditions, and
  interruption patterns materially change the outcome?
- Can representative users be reached under consent, accommodation, and data-protection conditions?
- Which direct research or prototype evidence exists for this run, and which material is context only?

Route missing design evidence through the applicable generic UI/UX parent. Do not turn missing people or
ethical conditions into a technical assumption.

**Close with:** actor/context map, evidence conditions, limits, and UI/UX acceptance status.

## D4 — UI and UX owner routing

Inspect whether the feature has an observable browser interface and whether it changes flow, content,
recovery, trust, research, or measurement.

- Which generic UI outcomes and web-interface mechanics apply?
- Which generic UX outcomes and browser-experience mechanics apply?
- Which design clauses are already accepted, and which generic decision tree must run?
- Where could UI realization conflict with UX outcome evidence?

Record the load order and owner map. A typical login or payment feature loads both chains. A skipped chain
needs a proved absent trigger.

**Close with:** `ui`/`web/ui` and `ux`/`web/ux` applicability, accepted specs, conflicts, and `NEEDS_CONTEXT`
conditions.

## D5 — Browser journey and state contract

- Which URLs support direct entry, deep link, bookmark, share, refresh, back/forward, and return after an
  external handoff?
- Which client states exist before, during, and after each action, including stale, duplicated, interrupted,
  empty, partial, error, and recovered states?
- What does each visible state mean in domain and server state?
- Which exact transitions preserve or discard user work, focus, session, history, and retry intent?

Delegate detailed semantics/layout to `web/ui` and journey/continuity to `web/ux`, then reconcile their traces
to one vertical contract.

**Close with:** URL, journey, client-state, and transition maps with false-success oracles.

## D6 — Server, domain, data, and provider contract

- What request, response, event, or server action crosses each boundary?
- Which domain invariant and authorization decision owns the effect?
- What data or provider state is created, read, updated, deleted, retained, exported, or reconciled?
- Which errors are expected and user-recoverable, and which indicate an invariant or operational failure?
- Which duplicate, retry, concurrency, ordering, idempotency, timeout, and partial-mutation cases apply?

**Close with:** interface/error contract, domain invariants, data/provider CRUD map, consistency/idempotency
decisions, and migration/configuration effects.

## D7 — Trust and harm boundaries

- What untrusted data enters, where is it validated, and which privileged sink follows?
- Which actor may see or change each resource in every state, not only through the intended UI?
- Which credentials, sessions, secrets, personal data, payment data, consent, or third-party redirects exist?
- Which abuse, automation, replay, injection, impersonation, cross-site, data-leak, or denial risks follow from
  the feature?
- Which version of the selected security requirements and threat evidence owns each gate?

**Close with:** threat/trust map, authorization matrix, privacy/retention record, abuse controls, security
verification owners, and residual risk requiring user authority.

## D8 — Quality, evidence, and release controls

- Which accessibility, localization, browser/runtime compatibility, performance, resilience, cost, and
  observability properties can change this outcome?
- Which project target already governs each property? If absent, what current source and method will establish
  a feature target?
- Which proof is static, automated, live-browser, DOM/accessibility-tree, visual, direct-user, server/data,
  field, or operational evidence?
- What telemetry distinguishes exposure, attempt, completion, failure, recovery, abandonment, false success,
  and harm?
- What rollout, stop, rollback, and post-deployment validation signals apply?

**Close with:** quality/evidence matrix, lab/field distinction, telemetry semantics, rollout stops, rollback
proof, and mutable-standard versions.

## D9 — Final feature-contract checkpoint

Present the accumulated result in this order:

1. current reality, trigger, authority, and compatibility;
2. outcome, actors, completion, scope, and non-goals;
3. accepted UI/UX contracts and remaining evidence limits;
4. URLs, browser/client state, server/domain interfaces, and data/provider effects;
5. trust, failure/recovery, quality, instrumentation, migration, rollout, and rollback;
6. implementation owner map, proof plan, open items, and reopen conditions.

Ask the user to confirm or reopen the earliest owning axis. Do not enter implementation with an applicable
`recorded-open` item that can change scope, design acceptance, trust, data integrity, or release safety.

## Completion ledger

The discussion is complete when every D0–D9 axis is confirmed, proved inapplicable, or recorded open with an
owner and method; every design parent reports its own acceptance state; the feature contract is internally
consistent; and the user explicitly confirms D9. The ledger remains the trace for P3–P10 of the parent.
