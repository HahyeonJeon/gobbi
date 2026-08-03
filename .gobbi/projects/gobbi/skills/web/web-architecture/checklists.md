# Web Architecture Evaluation Checklist

This reusable unchecked source evaluates one set of structural web decisions against the current-evidence,
authority-and-ownership, option-comparison, browser-journey, boundary-lifecycle, and scope obligations this
skill owns. It is governed by the [`web`](../SKILL.md) domain and [`web-architecture`](SKILL.md) preferences,
with [`web-development`](../web-development/SKILL.md) as the operation that integrates them,
[`web-frontend`](../web-frontend/SKILL.md) and [`web-backend`](../web-backend/SKILL.md) as the owners of the
browser and server implementation these boundaries carry,
[`web-app-lifecycle`](../web-app-lifecycle/SKILL.md) as the owner of the browser and PWA state contract, and
[`web-project-structure`](../web-project-structure/SKILL.md) as the owner of where the resulting code sits. The
source commit that contains this file identifies the checklist version. Its stable owner prefix is `WEBARCH`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBARCH-SC-PROJECT-01 — Normal case: a structural change is proposed from inspected evidence

A structural recommendation is being made for a running application. The expected outcome inspects the current
architecture first and compares every material option against one constraint set; a recommendation reasoned
from a preferred shape rather than from the application in front of it is the failure.

#### Checklist

- [ ] WEBARCH-CK-PROJECT-01-01 — The current architecture and its evidence were inspected before the structural change was proposed.
- [ ] WEBARCH-CK-PROJECT-01-02 — A sound existing shape is preserved, or the exact constraint it fails is named.
- [ ] WEBARCH-CK-PROJECT-01-03 — Every material option is compared against the same applicable constraint set: experience, accessibility, security, privacy, compatibility, performance, reliability, deployment, operations, migration, team capability, and removal cost.
- [ ] WEBARCH-CK-PROJECT-01-04 — Every question outside structural seams is routed to its owner: cross-layer integration to `web-development`, repository placement to `web-project-structure`, browser behavior to `web-frontend`, authoritative server behavior to `web-backend`, platform facts to `web-platform`, threat analysis to `web-security`, and suite mechanics to `web-testing`.

### WEBARCH-SC-PROJECT-02 — Rule violation: the preference becomes an unapproved migration

A recommendation grows from a seam change into a framework migration or a global rewrite. The expected outcome
keeps each recommendation inside authorized scope and changes the smallest boundary that fixes the named
failure; an architectural preference executed as a rewrite is the failure.

#### Checklist

- [ ] WEBARCH-CK-PROJECT-02-01 — No recommendation expands into a migration or a global rewrite that the authorized scope does not cover.
- [ ] WEBARCH-CK-PROJECT-02-02 — Each recommendation changes the smallest boundary that fixes the named failure.

## Structure

### WEBARCH-SC-STRUCTURE-01 — Normal case: authority and ownership are locatable

State, policy decisions, side effects, and caches are being placed. The expected outcome gives each one clear
source of truth and lifecycle at the placement the preferences name; a placement that leaves the reader
searching for who owns a value is the failure.

#### Checklist

- [ ] WEBARCH-CK-STRUCTURE-01-01 — Each state, policy decision, side effect, cache, and invalidation path names one source of truth and one lifecycle.
- [ ] WEBARCH-CK-STRUCTURE-01-02 — Secrets, protected policy, authorization, and authoritative shared effects sit behind a trusted server boundary.
- [ ] WEBARCH-CK-STRUCTURE-01-03 — Navigable state sits in the URL, or the departure records the verified ownership or lifecycle need behind it.
- [ ] WEBARCH-CK-STRUCTURE-01-04 — Shared facts sit in server data, or the departure records the verified ownership or lifecycle need behind it.
- [ ] WEBARCH-CK-STRUCTURE-01-05 — Transient interaction state sits in local state, or the departure records the verified ownership or lifecycle need behind it.
- [ ] WEBARCH-CK-STRUCTURE-01-06 — Every cache carries a freshness, isolation, invalidation, stale, capacity, and diagnostic contract.

### WEBARCH-SC-STRUCTURE-02 — Rule violation: client state becomes an accidental authority

Client state added to improve interaction ends up deciding whether a protected effect may happen. The expected
outcome keeps the trusted boundary as the authority and re-checks there; a protected effect that depends on
what the browser holds is the failure.

#### Checklist

- [ ] WEBARCH-CK-STRUCTURE-02-01 — No protected effect depends on client state as its authority.
- [ ] WEBARCH-CK-STRUCTURE-02-02 — Client state that improves interaction is re-derived or re-checked at the trusted boundary before a protected effect.

### WEBARCH-SC-STRUCTURE-03 — Poor quality: a boundary is added without an exit path

A dependency, cache, client-server split, rendering mode, or service boundary is introduced and works. The
expected outcome names its owner, its exit path, and its lifecycle implications; machinery that functions but
that nobody can later remove is the failure.

#### Checklist

- [ ] WEBARCH-CK-STRUCTURE-03-01 — Every introduced dependency, cache, client-server split, rendering mode, and service boundary names one owner.
- [ ] WEBARCH-CK-STRUCTURE-03-02 — Every introduced dependency, cache, client-server split, rendering mode, and service boundary names an exit path.
- [ ] WEBARCH-CK-STRUCTURE-03-03 — Each records its observability, upgrade, failure, rollback, and removal implications.
- [ ] WEBARCH-CK-STRUCTURE-03-04 — Each split or added machinery names the verified ownership, isolation, scaling, release, data, failure, or capability need that outweighs its network, consistency, diagnostic, security, performance, maintenance, and removal cost.

## Performance

### WEBARCH-SC-PERFORMANCE-01 — Normal case: rendering and delivery are chosen per route

Routes differ in what they must deliver and how fast. The expected outcome selects a rendering mode per route
against that route's outcome and records the evidence behind any departure; one delivery mode applied across
the application because the framework leads with it is the failure.

#### Checklist

- [ ] WEBARCH-CK-PERFORMANCE-01-01 — The rendering mode — static, server, streaming, client, or hybrid — is selected per route against that route's outcome.
- [ ] WEBARCH-CK-PERFORMANCE-01-02 — A departure from the preferred delivery records its evidence, tradeoff, lifecycle cost, preserved semantic, accessibility, navigation, refresh, recovery, trust, and completion obligations, and its reopen condition.
- Also applies: WEBARCH-CK-STRUCTURE-01-06 (every cache carries its contract).

### WEBARCH-SC-PERFORMANCE-02 — Poor quality: client machinery is added ahead of the evidence

An abstraction or client-side layer is added because it is the familiar shape, and the platform already
satisfied the outcome. The expected outcome adds machinery only on capability, compatibility, delivery, or
maintenance evidence; a layer justified by habit is the failure.

#### Checklist

- [ ] WEBARCH-CK-PERFORMANCE-02-01 — Every added client machinery or abstraction names the capability, compatibility, delivery, or maintenance evidence that justifies it.
- [ ] WEBARCH-CK-PERFORMANCE-02-02 — No platform capability that already satisfies the outcome is replaced by added machinery.

### WEBARCH-SC-PERFORMANCE-03 — Normal case: browser/PWA lifecycle storage, network, and processing limits come from approved project evidence

Offline, reconnect, service-worker, and update behavior need resource limits before the lifecycle contract can
choose its degraded or recovery state. The expected outcome uses project-approved limits; limits invented by
the lifecycle preference or implementation are the failure.

#### Checklist

- [ ] WEBARCH-CK-PERFORMANCE-03-01 — Offline cache, queued-action, reconnect, service-worker, and update work uses project-approved storage, network, and processing limits.

## Aesthetics

### WEBARCH-SC-AESTHETICS-01 — Poor quality: the option comparison cannot be reviewed

A structural decision is recorded and a reviewer must judge it. The expected outcome presents every option
against the same named constraints and puts each obligation beside the seam it governs; a comparison in which
each option is argued on its own favourable terms is the failure.

#### Checklist

- [ ] WEBARCH-CK-AESTHETICS-01-01 — Every compared option is presented against the same named constraint set rather than each against its own.
- [ ] WEBARCH-CK-AESTHETICS-01-02 — The recorded owner, exit path, and lifecycle implications sit beside the boundary they govern.
- [ ] WEBARCH-CK-AESTHETICS-01-03 — Every recommendation names which existing shape it preserves and which it changes.

## Usage

### WEBARCH-SC-USAGE-01 — Normal case: the browser journey survives the architecture

People arrive by URL, reload, open a second tab, and lose connectivity. The expected outcome decides each of
those behaviors deliberately and states what degraded operation offers; a journey inherited from whatever the
routing layer happens to do is the failure.

#### Checklist

- [ ] WEBARCH-CK-USAGE-01-01 — URL meaning, history, refresh, deep links, multiple tabs, session changes, and degraded operation are each decided deliberately rather than inherited.
- [ ] WEBARCH-CK-USAGE-01-02 — Meaningful URLs, standard links and forms, and a server fallback are preserved where the product supports them.
- [ ] WEBARCH-CK-USAGE-01-03 — Offline or degraded behavior is defined.
- [ ] WEBARCH-CK-USAGE-01-04 — Offline or degraded behavior is truthful about what is unavailable.

### WEBARCH-SC-USAGE-02 — Expected failure: a session changes while two tabs are open

One tab signs out, changes account, or expires while another tab holds the previous session. The expected
outcome brings every open tab to the new authority and keeps a deep link recoverable; a tab left acting under
the previous session is the failure.

#### Checklist

- [ ] WEBARCH-CK-USAGE-02-01 — A session change reaches every open tab without leaving one acting under the previous authority.
- [ ] WEBARCH-CK-USAGE-02-02 — A refresh or a deep link into a mid-journey URL either restores the state or fails onto a recoverable route.

### WEBARCH-SC-USAGE-03 — Rule violation: a framework default stands in for a verified journey

The chosen framework's default navigation, caching, or session behavior is accepted as the architectural
decision. The expected outcome verifies that default against the required browser journey first; a default
cited as evidence before verification is the failure.

#### Checklist

- [ ] WEBARCH-CK-USAGE-03-01 — No framework default is treated as evidence before it is verified against the required browser journey.

## Consistency

### WEBARCH-SC-CONSISTENCY-01 — Normal case: the recommendation agrees with the running application

The recommendation rests on a description of the current architecture. The expected outcome takes that
description from the application as it actually runs and names the concrete failure behind every departure; a
recommendation built on the documented shape is the failure.

#### Checklist

- [ ] WEBARCH-CK-CONSISTENCY-01-01 — The recorded current shape matches the application as it actually runs rather than as documented.
- [ ] WEBARCH-CK-CONSISTENCY-01-02 — Every departure from an established routing, delivery, state, or deployment arrangement names the concrete current-evidence failure behind it.

### WEBARCH-SC-CONSISTENCY-02 — Edge case: the documented architecture and the running application disagree

An architecture document and the deployed application describe different shapes and both are in front of the
reviewer. The expected outcome resolves the disagreement on inspected running behavior and marks the record as
stale; treating the document as the architecture because it is written down is the failure.

#### Checklist

- [ ] WEBARCH-CK-CONSISTENCY-02-01 — The disagreement is resolved on inspected running behavior.
- [ ] WEBARCH-CK-CONSISTENCY-02-02 — The stale record is named as stale.

## Risk

### WEBARCH-SC-RISK-01 — Expected failure: an added boundary fails at runtime

A dependency, cache, or service the architecture introduced becomes unavailable or returns wrong data. The
expected outcome has already assigned failure recovery and keeps the source of truth unambiguous; a failure
that leaves two components each believing they hold the truth is the failure.

#### Checklist

- [ ] WEBARCH-CK-RISK-01-01 — Failure recovery is assigned explicitly for every state, side effect, and cache the architecture defines.
- [ ] WEBARCH-CK-RISK-01-02 — No added boundary's failure leaves the source of truth for a state ambiguous.

### WEBARCH-SC-RISK-02 — Adversarial: an untrusted caller exploits an introduced cache or boundary

Someone supplies values chosen to reach another principal's cached response or to select a cheaper trust path.
The expected outcome keys and isolates every cache and checks path selection on the server; a boundary whose
routing is decided by whatever the client sends is the failure.

#### Checklist

- [ ] WEBARCH-CK-RISK-02-01 — Every cache that can hold per-principal data names its isolation key.
- [ ] WEBARCH-CK-RISK-02-02 — No cache that can hold per-principal data returns one principal's entry to another.
- [ ] WEBARCH-CK-RISK-02-03 — No client-supplied value selects which cache entry, service boundary, or rendering path serves a protected response without a server-side check.
- Also applies: WEBARCH-CK-STRUCTURE-02-01 (client state is not the authority for a protected effect).

## Overall

### WEBARCH-SC-OVERALL-01 — Normal case: the whole structural judgment holds together

A complete architectural recommendation answers where authority lives, how state and caches are owned and
invalidated, how the browser journey behaves, which options were compared, and how each boundary leaves. The
scenario fails when one of those is unanswered, or when the recommendation claims more than the inspection
supports.

#### Checklist

- [ ] WEBARCH-CK-OVERALL-01-01 — The recommendation answers authority placement, state and cache ownership with invalidation, browser-journey behavior, option comparison, and each boundary's exit path.
- [ ] WEBARCH-CK-OVERALL-01-02 — The recommendation claims no more than the evidence it inspected supports.
- Also applies: WEBARCH-CK-PROJECT-02-01 (no unapproved migration or global rewrite).
