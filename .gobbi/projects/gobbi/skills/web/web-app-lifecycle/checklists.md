# Web App Lifecycle Evaluation Checklist

This reusable unchecked source evaluates one browser or PWA lifecycle contract against the supported-target,
state-graph, retained-state, interruption, recovery, mixed-version, cleanup, native-boundary, and proof-handoff
obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-app-lifecycle`](SKILL.md) preferences, with [`web-platform`](../web-platform/SKILL.md) owning browser
facts, [`web-architecture`](../web-architecture/SKILL.md) owning resource limits, implementation owners
owning their behavior, and [`web-testing`](../web-testing/SKILL.md) owning evidence design. The source commit
that contains this file identifies the checklist version. Its stable owner prefix is `WEBAPP`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBAPP-SC-PROJECT-01 — Normal case: browser/PWA scope, actors, states, and applicability are explicit

The contract is opened for named browser and PWA targets. The expected outcome identifies exactly which
browser states apply and why; a generic lifecycle claim with no target or applicability record is the failure.

#### Checklist

- [ ] WEBAPP-CK-PROJECT-01-01 — The contract limits its subject to browser documents, workers, service workers, browser storage, and browser-managed PWA installation state.
- [ ] WEBAPP-CK-PROJECT-01-02 — The contract lists every supported browser or PWA target and every applicable state or transition.
- [ ] WEBAPP-CK-PROJECT-01-03 — Every excluded lifecycle capability carries an inspected platform or product-scope reason.

### WEBAPP-SC-PROJECT-02 — Rule violation: platform facts, product behavior, implementation, and evidence owners are conflated

A lifecycle decision is being made while browser facts, product choices, implementation, and proof are all in
view. The expected outcome keeps each with its semantic owner; one owner claiming the whole result is the
failure.

#### Checklist

- [ ] WEBAPP-CK-PROJECT-02-01 — Every browser, lifecycle, and compatibility fact used by the contract comes from `web-platform`.
- [ ] WEBAPP-CK-PROJECT-02-02 — Every user-visible runtime behavior is decided in the lifecycle contract rather than by an implementation owner.
- [ ] WEBAPP-CK-PROJECT-02-03 — Every implementation and evidence obligation is assigned to its layer owner or `web-testing` rather than claimed by this preference.

## Structure

### WEBAPP-SC-STRUCTURE-01 — Normal case: the complete state/transition graph has owned inputs, outputs, and returns

The applicable runtime is represented as a state graph. The expected outcome connects every successful and
unsuccessful transition to a declared state and owner; a callback list with an ownerless failure path is the
failure.

#### Checklist

- [ ] WEBAPP-CK-STRUCTURE-01-01 — The state graph includes every applicable startup, restoration, visibility, freeze, discard, offline, reconnect, update, mixed-version, restart, cleanup, installation-state, and removal state.
- [ ] WEBAPP-CK-STRUCTURE-01-02 — Every state or transition record names its semantic owner, material input, success output, failure or recovery return, and next handoff.
- [ ] WEBAPP-CK-STRUCTURE-01-03 — Every successful transition reaches a declared next state or terminal state.
- [ ] WEBAPP-CK-STRUCTURE-01-04 — Every unsuccessful transition returns to a declared safe state.
- [ ] WEBAPP-CK-STRUCTURE-01-05 — Every unsuccessful transition names its recovery owner.

### WEBAPP-SC-STRUCTURE-02 — Edge case: durable, disposable, server-owned, cached, and queued state cross identity/version boundaries

State survives interruption, restart, identity change, or version change. The expected outcome validates and
isolates each retained value before restoration or replay; wrong-user or incompatible state crossing the
boundary is the failure.

#### Checklist

- [ ] WEBAPP-CK-STRUCTURE-02-01 — Every lifecycle value is classified as durable, disposable, server-owned, cached, or queued before it crosses a transition.
- [ ] WEBAPP-CK-STRUCTURE-02-02 — Every retained user-scoped value is isolated by the current identity.
- [ ] WEBAPP-CK-STRUCTURE-02-03 — Every retained value carries the schema, data, or build version needed to validate it before restoration or replay.
- [ ] WEBAPP-CK-STRUCTURE-02-04 — Wrong-user, corrupt, stale, or incompatible retained state is contained before it can restore UI state or apply a queued server or data change.

## Performance

### WEBAPP-SC-PERFORMANCE-01 — Edge case: background, hidden, freeze, and discard stop or defer resource work safely

The browser may stop executing while critical state or work remains. The expected outcome saves durable state
first and lets no critical change depend on continued execution; work that becomes unsafe when timers stop is
the failure.

#### Checklist

- [ ] WEBAPP-CK-PERFORMANCE-01-01 — Critical state is saved at its durable owner before the contract relies on hidden or frozen execution.
- [ ] WEBAPP-CK-PERFORMANCE-01-02 — No critical server or data change depends on a timer, background execution, or unload-time work completing.
- [ ] WEBAPP-CK-PERFORMANCE-01-03 — Resource work is paused, cancelled, or limited by contract when the document becomes hidden, frozen, or discarded.

### WEBAPP-SC-PERFORMANCE-02 — Expected failure: a measured offline, reconnect, service-worker, or update resource breach enters the declared degraded or recovery state

Measured work exceeds an approved limit. The expected outcome enters the declared state that contains or
recovers from the breach; continuing the same work without a limit is the failure.

#### Checklist

- [ ] WEBAPP-CK-PERFORMANCE-02-03 — A measured limit breach enters the declared degraded, cleanup, or update-recovery state rather than continuing without a bound.

## Aesthetics

### WEBAPP-SC-AESTHETICS-01 — Poor quality: loading, offline, update, restore, and recovery states are technically correct but unreadable

Every state is mechanically accurate, but a person cannot distinguish it or tell what remains possible. The
expected outcome makes state, capability, and next action clear without browser jargon; an accurate state no
one can understand is the failure.

#### Checklist

- [ ] WEBAPP-CK-AESTHETICS-01-01 — Loading, ready, degraded, offline, restoring, updating, failed, and recovered states are visually distinguishable.
- [ ] WEBAPP-CK-AESTHETICS-01-02 — Loading, ready, degraded, offline, restoring, updating, failed, and recovered states are distinguishable without sight.
- [ ] WEBAPP-CK-AESTHETICS-01-03 — Every user-visible lifecycle state states the available capability.
- [ ] WEBAPP-CK-AESTHETICS-01-04 — User-visible lifecycle wording describes the product state rather than exposing internal browser or service-worker jargon.
- [ ] WEBAPP-CK-AESTHETICS-01-05 — Every user-visible lifecycle state states the next action.

## Usage

### WEBAPP-SC-USAGE-01 — Normal case: cold start, readiness, restoration, and foreground/background return remain usable, with any stopped or failed startup state limited to its current attempt

A person starts or resumes the web app under ordinary and recoverable failure conditions. The expected outcome
shows accurate readiness and offers the declared recovery path; a failed attempt that falsely claims ready or
becomes a permanent application terminal is the failure.

#### Checklist

- [ ] WEBAPP-CK-USAGE-01-01 — Cold start presents an accurate loading, degraded, unauthorized, failed, or ready state until readiness is established.
- [ ] WEBAPP-CK-USAGE-01-02 — The UI enters ready only after every contract-required configuration, identity, session, and data prerequisite is satisfied.
- [ ] WEBAPP-CK-USAGE-01-03 — Session restoration produces valid restored state or an explicit safe reset.
- [ ] WEBAPP-CK-USAGE-01-04 — Foreground return revalidates identity, session, data, and version state before the next protected action.
- [ ] WEBAPP-CK-USAGE-01-05 — A recoverable startup, restoration, or resume failure presents the contract's retry, reset, or support path.
- [ ] WEBAPP-CK-USAGE-01-06 — A safe reset explains what was not restored.

### WEBAPP-SC-USAGE-02 — Expected failure: offline/reconnect, mixed versions, cleanup, and removal recover without false completion

Connectivity, version, identity, or removal work fails partway through. The expected outcome preserves a safe
state and reports completion only after every server or data change has a disposition; false completion is
the failure.

#### Checklist

- [ ] WEBAPP-CK-USAGE-02-01 — Offline or degraded mode states exactly which reads, writes, and protected actions remain available.
- [ ] WEBAPP-CK-USAGE-02-02 — Reconnect reconciles every queued action and conflict before reporting the related server or data change as complete.
- [ ] WEBAPP-CK-USAGE-02-03 — An incompatible service-worker or mixed-client version blocks activation or requires the declared reload path.
- [ ] WEBAPP-CK-USAGE-02-04 — Logout, identity switch, cleanup, or removal reports completion only after every scoped user value and pending change has its declared disposition.
- [ ] WEBAPP-CK-USAGE-02-05 — A recoverable offline, update, cleanup, or removal failure returns to the declared safe state.

## Consistency

### WEBAPP-SC-CONSISTENCY-01 — Normal case: frontend, backend, service worker, storage, and release versions honor one contract

Several implementation owners realize the same runtime transition. The expected outcome identifies one
contract version and maps every transition to concrete responsibility; implementations following different
contracts are the failure.

#### Checklist

- [ ] WEBAPP-CK-CONSISTENCY-01-01 — Frontend, backend, service-worker, storage, release, and deployment behavior refer to one version of the lifecycle contract.
- [ ] WEBAPP-CK-CONSISTENCY-01-02 — Every implementation owner maps each applicable transition to one concrete implementation responsibility.

### WEBAPP-SC-CONSISTENCY-02 — Edge case: logout, identity switch, restart, and removal leave no wrong-user or stale-version state

Retained state crosses the strongest identity and version boundaries. The expected outcome rejects stale or
wrong-user values and records every removed item; state from a previous identity or unsupported version
remaining readable or actionable is the failure.

#### Checklist

- [ ] WEBAPP-CK-CONSISTENCY-02-01 — Logout or identity switch leaves no state readable under the previous identity.
- [ ] WEBAPP-CK-CONSISTENCY-02-02 — Restart rejects retained state whose schema, data, or build version is no longer supported.
- [ ] WEBAPP-CK-CONSISTENCY-02-03 — PWA or service-worker removal leaves no registration, cache, or queued action outside its recorded disposition.
- [ ] WEBAPP-CK-CONSISTENCY-02-04 — After logout or identity switch, no action can use state from the previous identity.

## Risk

### WEBAPP-SC-RISK-01 — Adversarial: interruption, late results, duplicate registration, or replay cannot report or apply an unconfirmed or duplicate server or data change

An attacker or race replays work, delivers a late result, or duplicates a controller transition. The expected
outcome rejects stale, repeated, or unconfirmed changes; any duplicate server or data change or false
completion signal is the failure.

#### Checklist

- [ ] WEBAPP-CK-RISK-01-01 — A late result cannot overwrite newer server-owned or user-visible state.
- [ ] WEBAPP-CK-RISK-01-02 — A replayed or duplicate queued action cannot apply the same server or data change twice.
- [ ] WEBAPP-CK-RISK-01-03 — Duplicate service-worker registration or activation cannot leave two conflicting controllers for one client.
- [ ] WEBAPP-CK-RISK-01-04 — Untrusted retained state cannot select an identity, authority, resource, or protected action.
- [ ] WEBAPP-CK-RISK-01-05 — Interruption, discard, restart, or update cannot create a completion signal for an unconfirmed server or data change.

### WEBAPP-SC-RISK-02 — Rule violation: browser/PWA scope is used to claim native package, updater, or uninstall behavior

The browser contract is presented as proof of an installed native application's behavior. The expected outcome
stops at browser and browser-managed PWA states and routes native concerns outward; any native claim in this
contract is the failure.

#### Checklist

- [ ] WEBAPP-CK-RISK-02-01 — No lifecycle claim extends beyond browser or browser-managed PWA behavior.
- [ ] WEBAPP-CK-RISK-02-02 — No lifecycle claim covers native package installation.
- [ ] WEBAPP-CK-RISK-02-03 — No lifecycle claim covers native application, main-process, window, or utility-process lifecycle.
- [ ] WEBAPP-CK-RISK-02-04 — No lifecycle claim covers a native updater or native update rollback.
- [ ] WEBAPP-CK-RISK-02-05 — No lifecycle claim covers native application uninstall.

## Overall

### WEBAPP-SC-OVERALL-01 — Normal case: one complete browser/PWA lifecycle contract reaches cleanup/removal and proof handoff

The lifecycle contract is ready to hand to implementation and testing. The expected outcome covers every
applicable transition through cleanup or removal and limits its claim to named targets; a contract that stops
before terminal or proof handoffs is the failure.

#### Checklist

- [ ] WEBAPP-CK-OVERALL-01-01 — The contract covers every applicable state and transition in the browser and PWA runtime map.
- [ ] WEBAPP-CK-OVERALL-01-02 — Every applicable transition carries one owner, input, success output, failure or recovery return, and next handoff.
- [ ] WEBAPP-CK-OVERALL-01-03 — Cleanup, removal, implementation handoff, and evidence handoff are present in the completed contract.
- [ ] WEBAPP-CK-OVERALL-01-04 — The completed claim is limited to the named browser and PWA targets and the states the contract actually covers.
