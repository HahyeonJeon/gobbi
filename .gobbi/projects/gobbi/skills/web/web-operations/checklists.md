# Web Operations Evaluation Checklist

This reusable unchecked source evaluates one supported live-service outcome against the health, support,
incident, maintenance, compatibility, deprecation, retirement, authority, and handoff obligations this skill
owns. It is governed by the [`web`](../SKILL.md) domain and [`web-operations`](SKILL.md) operation, with
[`web-observability`](../web-observability/SKILL.md), [`web-testing`](../web-testing/SKILL.md),
[`web-security`](../web-security/SKILL.md), and [`web-design`](../web-design/SKILL.md) owning the evidence and
judgments Operations consumes; [`web-development`](../web-development/SKILL.md) owning product-change
coordination; and [`web-release`](../web-release/SKILL.md) and
[`web-deployment`](../web-deployment/SKILL.md) owning changed artifacts and environments. The source commit
that contains this file identifies the checklist version. Its stable owner prefix is `WEBOPS`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBOPS-SC-PROJECT-01 — Normal case: live service, support commitment, owners, authority, and operating state are bound

A deployment-verified service enters supported operation with the records needed to operate it. The expected
outcome binds the service and every action to its support and authority state; accepting an unidentified or
unowned live service is the failure.

#### Checklist

- [ ] WEBOPS-CK-PROJECT-01-01 — Operations starts from a deployment-verified live service with its support contract, runbooks, owners, and authority state.
- [ ] WEBOPS-CK-PROJECT-01-02 — The operating record names the live version, configuration identity, current service state, and support commitment.
- [ ] WEBOPS-CK-PROJECT-01-03 — Every operational action names one owner and the exact authority under which it may run.

### WEBOPS-SC-PROJECT-02 — Rule violation: operations claims observability, test, security, product-design, release, or deployment evidence

An operations result consumes evidence from adjacent owners and is tempted to report those owners' claims as
its own. The expected outcome attributes every input and keeps every lifecycle claim separate; Operations
claiming emission, proof, judgment, release, or deployment is the failure.

#### Checklist

- [ ] WEBOPS-CK-PROJECT-02-01 — Operations consumes telemetry only as an input attributed to `web-observability`.
- [ ] WEBOPS-CK-PROJECT-02-02 — Operations consumes test, security, and design evidence only as inputs attributed to their owners.
- [ ] WEBOPS-CK-PROJECT-02-03 — Operations reports release identity, deployment state, live verification, observed health, and supported operation as separate claims.
- Also applies: WEBOBS-CK-CONSISTENCY-02-01 (emission, verified arrival, and observed live health remain separate claims).

## Structure

### WEBOPS-SC-STRUCTURE-01 — Normal case: service ownership, runbooks, escalation, maintenance, deprecation, and retirement paths connect

A cold operator follows the service from routine support through every exceptional or terminal path. The
expected outcome connects each state to an owner and a next decision; an ownerless state or broken return is
the failure.

#### Checklist

- [ ] WEBOPS-CK-STRUCTURE-01-01 — The operating contract connects service ownership, runbooks, support, escalation, maintenance, deprecation, and retirement.
- [ ] WEBOPS-CK-STRUCTURE-01-02 — Every incident, maintenance, deprecation, and retirement path names its entry condition, success state, failure return, and next owner.
- [ ] WEBOPS-CK-STRUCTURE-01-03 — Every live-service state names the person or team that owns its next operational decision.

### WEBOPS-SC-STRUCTURE-02 — Edge case: operational work becomes a product change and returns through development/release/deployment

Maintenance or incident work exposes a change to product behavior, contracts, data meaning, or shipped
bytes. The expected outcome returns through the earliest invalidated lifecycle owner; an operational shortcut
that changes the product or live bytes directly is the failure.

#### Checklist

- [ ] WEBOPS-CK-STRUCTURE-02-01 — Operational work is classified as routine service work or a product change before action begins.
- [ ] WEBOPS-CK-STRUCTURE-02-02 — Every product change discovered during operation returns through `web-development` at the earliest invalidated stage.
- [ ] WEBOPS-CK-STRUCTURE-02-03 — Every product change that alters shipped bytes returns through `web-release` and `web-deployment`.

## Performance

### WEBOPS-SC-PERFORMANCE-01 — Normal case: capacity, saturation, cost, and dependency health use accepted service thresholds

Live health is interpreted against thresholds accepted for this service. The expected outcome grounds every
threshold and gives each breach an owned response; an invented threshold or unowned breach is the failure.

#### Checklist

- [ ] WEBOPS-CK-PERFORMANCE-01-01 — Capacity, saturation, cost, and dependency-health thresholds come from project evidence or an explicit service decision.
- [ ] WEBOPS-CK-PERFORMANCE-01-03 — A threshold breach triggers its recorded response or escalation rather than remaining an unowned observation.

### WEBOPS-SC-PERFORMANCE-02 — Expected failure: maintenance or recovery consumes unsafe resources or worsens service

A maintenance or recovery action approaches its resource or user-impact limit. The expected outcome stops or
reverses within the approved boundary; continued consumption or worsening beyond a stop condition is the
failure.

#### Checklist

- [ ] WEBOPS-CK-PERFORMANCE-02-01 — Every maintenance and recovery action carries a resource-use stop condition.
- [ ] WEBOPS-CK-PERFORMANCE-02-02 — No maintenance or recovery action consumes resources beyond its approved operational limit.
- [ ] WEBOPS-CK-PERFORMANCE-02-03 — An action that worsens service beyond its stop condition stops or reverses immediately.
- [ ] WEBOPS-CK-PERFORMANCE-02-04 — Every maintenance and recovery action carries a user-impact stop condition.

## Aesthetics

### WEBOPS-SC-AESTHETICS-01 — Poor quality: service state, incident, support, deprecation, or retirement record is not actionable

The service may be operated correctly, but a later operator cannot act from its records. The expected outcome
makes current state, impact, ownership, timing, and next action legible without author context; an incomplete
or cryptic record is the failure.

#### Checklist

- [ ] WEBOPS-CK-AESTHETICS-01-01 — The current-service record states version, impact, owner, start time, and next decision in a form a cold operator can use.
- [ ] WEBOPS-CK-AESTHETICS-01-02 — Every incident record presents its timeline, affected service, current state, owner, and next action.
- [ ] WEBOPS-CK-AESTHETICS-01-03 — Every support or deprecation notice states the affected users, required action, deadline, and support route.
- [ ] WEBOPS-CK-AESTHETICS-01-04 — The retirement record identifies the retired service, final disposition, successor, and retained owner without author context.

## Usage

### WEBOPS-SC-USAGE-01 — Normal case: routine operation, support, and maintenance preserve the service contract

A supported service receives ordinary support or a dependency or compatibility update. The expected outcome
keeps the support route accurate and leaves the supported service intact on failure; an unavailable route,
unverified update, or false maintenance success is the failure.

#### Checklist

- [ ] WEBOPS-CK-USAGE-01-01 — The live support route is available.
- [ ] WEBOPS-CK-USAGE-01-02 — Routine maintenance preserves the service contract or announces the exact degraded state before users meet it.
- [ ] WEBOPS-CK-USAGE-01-03 — A dependency or compatibility update is checked against the supported service matrix before and after the change.
- [ ] WEBOPS-CK-USAGE-01-04 — An unsafe routine update leaves the current supported service in place.
- [ ] WEBOPS-CK-USAGE-01-05 — The live support route matches the current service commitment.
- [ ] WEBOPS-CK-USAGE-01-06 — An unsafe routine update returns the update to its owner.

### WEBOPS-SC-USAGE-02 — Expected failure: incident recovery, deprecation, or retirement preserves an accurate user/support path

An incident, deprecation window, or retirement changes what affected people and support staff must do. The
expected outcome reports the current state and recovery or migration path accurately and restores the prior
state on recoverable failure; false completion or a missing path is the failure.

#### Checklist

- [ ] WEBOPS-CK-USAGE-02-01 — Incident recovery presents an accurate service state to affected users and support staff.
- [ ] WEBOPS-CK-USAGE-02-02 — Deprecation provides an approved window, migration path, support route, and stop condition.
- [ ] WEBOPS-CK-USAGE-02-03 — Retirement applies the approved disposition for traffic, data, assets, users, and support.
- [ ] WEBOPS-CK-USAGE-02-04 — A recoverable incident or retirement failure restores the prior supported state before completion is reported.
- [ ] WEBOPS-CK-USAGE-02-05 — Incident recovery presents the recovery route to affected users and support staff.

## Consistency

### WEBOPS-SC-CONSISTENCY-01 — Normal case: live version, configuration, runbooks, support, telemetry, and service claims agree

Records from deployment, support, telemetry, and operations describe the same live service. The expected
outcome reconciles them without merging their claims and updates the operating set together; drift or one
combined status is the failure.

#### Checklist

- [ ] WEBOPS-CK-CONSISTENCY-01-01 — Live version, configuration identity, runbooks, support guidance, telemetry interpretation, and service claims agree.
- [ ] WEBOPS-CK-CONSISTENCY-01-02 — Deployment, live verification, observed health, support state, and operational acceptance remain separate records.
- [ ] WEBOPS-CK-CONSISTENCY-01-03 — An operational change updates its service record, runbook, support guidance, and owner together.

### WEBOPS-SC-CONSISTENCY-02 — Edge case: dependency, compatibility, and product versions diverge without an owner or migration

A live dependency or browser, API, data, or product version falls outside the supported matrix. The expected
outcome blocks the unsafe update or assigns ownership and migration through the product lifecycle; silent
unsupported operation is the failure.

#### Checklist

- [ ] WEBOPS-CK-CONSISTENCY-02-01 — Every unsupported live dependency version carries one owner.
- [ ] WEBOPS-CK-CONSISTENCY-02-02 — Every browser, API, data, and product version in service appears in the supported compatibility record.
- [ ] WEBOPS-CK-CONSISTENCY-02-03 — A version outside the supported compatibility record blocks the related update or routes a product change through `web-development`.
- [ ] WEBOPS-CK-CONSISTENCY-02-04 — Every unsupported live dependency version carries one approved migration path.

## Risk

### WEBOPS-SC-RISK-01 — Adversarial: a stop, incident, unsupported version, or retirement gate is bypassed

Pressure to restore or retire the service encourages an operator to report success around an unmet gate. The
expected outcome holds every stop, impact, compatibility, deprecation, and retirement condition; a bypassed
gate or disguised unsupported state is the failure.

#### Checklist

- [ ] WEBOPS-CK-RISK-01-01 — No operational stop condition is bypassed.
- [ ] WEBOPS-CK-RISK-01-02 — No incident gate is closed while its recovery or impact condition remains unmet.
- [ ] WEBOPS-CK-RISK-01-03 — No unsupported version is silently kept in service as though it were supported.
- [ ] WEBOPS-CK-RISK-01-04 — No approved deprecation window is shortened without new authority.
- [ ] WEBOPS-CK-RISK-01-05 — No retirement gate is bypassed while an affected user, data, traffic, asset, or support disposition remains open.

### WEBOPS-SC-RISK-02 — Rule violation: destructive, external, irreversible, or user-impacting action proceeds without authority

An operational action would destroy, communicate, change a provider, remove something irreversibly, or
affect users beyond its current grant. The expected outcome stops, preserves the supported service, and names
the missing authority; proceeding on a broad role or assumed permission is the failure.

#### Checklist

- [ ] WEBOPS-CK-RISK-02-01 — No destructive operational action proceeds without authority for that exact action.
- [ ] WEBOPS-CK-RISK-02-02 — No external operational message or provider action proceeds without authority for that exact action.
- [ ] WEBOPS-CK-RISK-02-03 — No irreversible data, traffic, asset, or service removal proceeds without authority for that exact action.
- [ ] WEBOPS-CK-RISK-02-04 — A blocked user-impacting action stops.
- [ ] WEBOPS-CK-RISK-02-05 — A blocked user-impacting action preserves the current supported service state.
- [ ] WEBOPS-CK-RISK-02-06 — A blocked user-impacting action names the required authority.

## Overall

### WEBOPS-SC-OVERALL-01 — Normal case: live operation reaches supported continuation, owned product change, or verified retirement

The current operations scope has reached a handoff or terminal decision. The expected outcome reconciles the
complete service lifetime and makes a claim no broader than its evidence and authority; an ambiguous close or
ownerless risk is the failure.

#### Checklist

- [ ] WEBOPS-CK-OVERALL-01-01 — The operating record covers health, support, incidents, maintenance, compatibility, deprecation, and retirement.
- [ ] WEBOPS-CK-OVERALL-01-02 — Live operation ends in supported continuation, an owned product change, or verified retirement.
- [ ] WEBOPS-CK-OVERALL-01-03 — Every remaining operational risk carries one owner, disposition, and reopen condition.
- [ ] WEBOPS-CK-OVERALL-01-04 — The operations claim extends no further than the service state, evidence, and authority recorded for it.
