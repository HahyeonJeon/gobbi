# Web Feature Evaluation Checklist

This reusable unchecked source evaluates one bounded web feature delivered through a release-ready handoff,
against the bound-outcome, current-application, owner-routing, cross-layer-contract, vertical-slice, and
separated-claim obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-feature`](SKILL.md) operation, with [`web-frontend`](../web-frontend/SKILL.md) and
[`web-backend`](../web-backend/SKILL.md) as the layer operations it routes to,
[`web-architecture`](../web-architecture/SKILL.md) as the owner of the structural seams it integrates across,
and [`web-deployment`](../web-deployment/SKILL.md) as the operation that begins where this one ends. The
source commit that contains this file identifies the checklist version. Its stable owner prefix is `WEBFEAT`.

This source evaluates the handoff's completeness, not the deployment. Deployment authorization, deployment,
reconciliation, and live health are downstream claims that `web-deployment` owns.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBFEAT-SC-PROJECT-01 — Normal case: one bounded outcome is locked before implementation

A feature request arrives and work is about to start. The expected outcome binds one complete observable
outcome with its signals, scope, and non-goals before any implementation; a frame that names a page, an
endpoint, or a happy path as the unit of completion is the failure.

#### Checklist

- [ ] WEBFEAT-CK-PROJECT-01-01 — The frame names the actors, trigger, entry, observable completion, false completion, side effects, paths, states, failures, recovery, boundary, non-goals, compatibility constraints, and decision authority.
- [ ] WEBFEAT-CK-PROJECT-01-02 — The unit of completion is one complete observable outcome rather than a page, component, endpoint, migration, or green happy path.
- [ ] WEBFEAT-CK-PROJECT-01-03 — A scope change, a contradiction, or missing authority is returned to the user before contract work.
- [ ] WEBFEAT-CK-PROJECT-01-04 — The current entry-to-effect journey is traced through routes, browser state, APIs, domain rules, stored data, providers, access controls, tests, telemetry, configuration, migrations, support, and release controls before the change is selected.

### WEBFEAT-SC-PROJECT-02 — Rule violation: an applicable owner is skipped without evidence

A layer is handled inside this operation because loading its owner felt heavier than doing the work. The
expected outcome tests every trigger and evidences every omission; an unrouted layer, or an owner's policy
copied here, is the failure.

#### Checklist

- [ ] WEBFEAT-CK-PROJECT-02-01 — Every sibling trigger and implementation domain is tested against the locked frame.
- [ ] WEBFEAT-CK-PROJECT-02-02 — Every omitted owner records inspected evidence that its trigger is absent.
- [ ] WEBFEAT-CK-PROJECT-02-03 — Every in-scope layer has exactly one owner, or the ownership conflict or uncovered capability is returned.
- [ ] WEBFEAT-CK-PROJECT-02-04 — No owner's policy is copied into this operation in place of routing to it.

## Structure

### WEBFEAT-SC-STRUCTURE-01 — Normal case: one cross-layer contract is locked before building

Several layers must agree before code exists. The expected outcome locks one internally consistent contract
covering entries, state, effects, authority, data, failures, and release controls; an omission carried by
assumption rather than by evidence is the failure.

#### Checklist

- [ ] WEBFEAT-CK-STRUCTURE-01-01 — The contract defines each entry and URL, browser and server state, message and error, domain and provider effect, authority, privacy boundary, completion, failure, and resumption path.
- [ ] WEBFEAT-CK-STRUCTURE-01-02 — The contract maps who can create, read, update, delete, retain, export, and observe each data class.
- [ ] WEBFEAT-CK-STRUCTURE-01-03 — The contract defines applicable configuration, migration, compatibility, instrumentation, support, rollout, stop, and rollback behavior.
- [ ] WEBFEAT-CK-STRUCTURE-01-04 — Every omission from the contract is supported by evidence rather than silence.

### WEBFEAT-SC-STRUCTURE-02 — Poor quality: breadth is added before a real end-to-end path exists

Screens and endpoints multiply while no real entry has yet reached a truthful completion. The expected outcome
connects the smallest real path first and repairs the earliest missing seam; a mock response or an isolated
endpoint treated as the feature is the failure.

#### Checklist

- [ ] WEBFEAT-CK-STRUCTURE-02-01 — The smallest safe path runs from a real entry through the required browser, server, and data or provider seams to truthful observable completion.
- [ ] WEBFEAT-CK-STRUCTURE-02-02 — Every fake or unavailable dependency is marked, and one end-to-end skeleton trace is captured as evidence.
- [ ] WEBFEAT-CK-STRUCTURE-02-03 — No client-only demo, mock response, or isolated endpoint is treated as the feature.
- [ ] WEBFEAT-CK-STRUCTURE-02-04 — The earliest missing seam is repaired before another slice is added.

## Performance

### WEBFEAT-SC-PERFORMANCE-01 — Rule violation: a universal budget is invented

A performance, availability, security, or accessibility target is set because it sounds like a standard. The
expected outcome takes every target from project evidence or an explicit feature decision; a number nobody
decided, held against the work, is the failure.

#### Checklist

- [ ] WEBFEAT-CK-PERFORMANCE-01-01 — Every quality target comes from project evidence or an explicit feature decision.
- [ ] WEBFEAT-CK-PERFORMANCE-01-02 — No universal performance, availability, security, or accessibility budget is invented for this feature.

### WEBFEAT-SC-PERFORMANCE-02 — Edge case: the feature runs under duplicates, concurrency, and late results

Real traffic delivers the same request twice, two at once, and one long after it was abandoned. The expected
outcome keeps success truthful under each of those and emits the contract's signals; a path correct only when
timing is clean is the failure.

#### Checklist

- [ ] WEBFEAT-CK-PERFORMANCE-02-01 — Truthful success holds under applicable duplicates, concurrency, stale clients, partial mutation, dependency failure, interruption, retries, and late results.
- [ ] WEBFEAT-CK-PERFORMANCE-02-02 — The instrumentation and monitoring signals the contract defines are emitted by the implemented path.

## Aesthetics

### WEBFEAT-SC-AESTHETICS-01 — Poor quality: the handoff cannot be read by a cold operator

The handoff is given to someone who was not in the work. The expected outcome assembles rollout, stop,
rollback, diagnostics, support, authority state, and the measure set so they can act; a handoff readable only
by its author is the failure.

#### Checklist

- [ ] WEBFEAT-CK-AESTHETICS-01-01 — The handoff assembles compatibility notes, rollout, stop, rollback, diagnostics, support, deployment-authority state, and post-deployment validation for a cold operator.
- [ ] WEBFEAT-CK-AESTHETICS-01-02 — The user-visible measure set names its owner, its review cadence, and the evidence that reopens the design.

## Usage

### WEBFEAT-SC-USAGE-01 — Normal case: the observable outcome is reachable and truthful

A person completes the feature end to end. The expected outcome ties what they observe to the authoritative
effect and distinguishes it from the named false completion; an acknowledgement shown before the effect exists
is the failure.

#### Checklist

- [ ] WEBFEAT-CK-USAGE-01-01 — The completion signal a person observes matches the authoritative effect rather than a client-side acknowledgement.
- [ ] WEBFEAT-CK-USAGE-01-02 — The false-completion signal named in the frame is distinguishable from real completion in the built path.
- [ ] WEBFEAT-CK-USAGE-01-03 — Ordinary behavior, alternative-valid paths, exact boundaries, failures and recovery, adversarial cases, compatibility, and counterfactual assumptions are grown one slice at a time until the contract's cases are implemented.

### WEBFEAT-SC-USAGE-02 — Expected failure: a path fails midway

A dependency fails, the person is interrupted, or a step is rejected partway through. The expected outcome
reports the failure honestly and offers a recovery route with the person's state preserved; a false success or
a silent repair is the failure.

#### Checklist

- [ ] WEBFEAT-CK-USAGE-02-01 — No path reports false success or hides a repair.
- [ ] WEBFEAT-CK-USAGE-02-02 — A failed path exposes its recovery route and preserves the person's entered state where the contract requires it.

## Consistency

### WEBFEAT-SC-CONSISTENCY-01 — Normal case: artifacts move together

Each slice touches implementation, contract, tests, documentation, and telemetry. The expected outcome updates
them together and reconciles them before the handoff; a telemetry definition or runbook describing the
previous slice is the failure.

#### Checklist

- [ ] WEBFEAT-CK-CONSISTENCY-01-01 — Implementation, contracts, data, configuration, documentation, tests, security evidence, and telemetry are updated together within each slice.
- [ ] WEBFEAT-CK-CONSISTENCY-01-02 — Contracts, implementation, configuration, migrations, tests, security records, telemetry, support, and documentation are reconciled before the handoff.
- [ ] WEBFEAT-CK-CONSISTENCY-01-03 — The recorded current behavior matches the application as inspected, and every authorized break is recorded with its evidence.

### WEBFEAT-SC-CONSISTENCY-02 — Rule violation: distinct claims are merged into one status

The feature is reported as done. The expected outcome separates what was implemented, accepted, effected,
released, authorized, deployed, and validated live; one status covering all of them, or a screenshot standing
in for semantics, is the failure.

#### Checklist

- [ ] WEBFEAT-CK-CONSISTENCY-02-01 — Implementation correctness, frontend acceptance, backend effects, release readiness, deployment authorization, deployment state, and live outcome validation are reported as separate claims.
- [ ] WEBFEAT-CK-CONSISTENCY-02-02 — Each claim is matched to its strongest owning evidence rather than to a weaker signal widened to cover it.
- [ ] WEBFEAT-CK-CONSISTENCY-02-03 — No screenshot is used as proof of semantics, focus, hidden behavior, or conformance.

## Risk

### WEBFEAT-SC-RISK-01 — Normal case: the operation stops at release-ready

The feature is finished and a deployment is the obvious next move. The expected outcome ends at the
release-ready handoff to `web-deployment` and leaves deployment to its own authority; a feature operation that
deploys because it could is the failure.

#### Checklist

- [ ] WEBFEAT-CK-RISK-01-01 — The operation ends at the release-ready handoff to `web-deployment`.
- [ ] WEBFEAT-CK-RISK-01-02 — Deployment, live validation, and observed health proceed only under their own authority and are not claimed here.
- [ ] WEBFEAT-CK-RISK-01-03 — Any unauthorized external or irreversible action pauses for authority rather than proceeding.
- [ ] WEBFEAT-CK-RISK-01-04 — A passing evaluation, or the user's explicit disposition of every limitation, precedes the handoff.

### WEBFEAT-SC-RISK-02 — Adversarial: a success measure is gamed

A user-visible measure improves while the outcome it stands for gets worse. The expected outcome names each
measure's harmful interpretation and the guardrail that detects it; a proxy standing alone is the failure.

#### Checklist

- [ ] WEBFEAT-CK-RISK-02-01 — Every user-visible success measure names its intended interpretation and its harmful interpretation.
- [ ] WEBFEAT-CK-RISK-02-02 — Every success measure names the guardrail that detects the harmful interpretation, so a proxy improving while the user outcome worsens never stands alone.
- [ ] WEBFEAT-CK-RISK-02-03 — Every success measure carries its failure or recovery signal beside it.

### WEBFEAT-SC-RISK-03 — Expected failure: a verification finding appears late

Verification exposes a failed claim close to the handoff. The expected outcome returns it to its earliest
owner and preserves the evidence gap; repairing at the surface where it surfaced, or filling the gap with a
weaker signal, is the failure.

#### Checklist

- [ ] WEBFEAT-CK-RISK-03-01 — A failed claim is returned to its earliest owner rather than repaired at the surface where it appeared.
- [ ] WEBFEAT-CK-RISK-03-02 — Each evidence gap is preserved rather than filled with a weaker signal widened to cover it.

## Overall

### WEBFEAT-SC-OVERALL-01 — Normal case: one integrated feature across only the layers it needs

A finished feature integrates the layers its outcome requires, matches its bound frame, and stops at the
handoff. The scenario fails when a layer was integrated without need, when the delivered outcome differs from
the bound frame, or when the operation claims work it did not own.

#### Checklist

- [ ] WEBFEAT-CK-OVERALL-01-01 — The feature integrates only the browser, server, data, provider, operational, and release layers the outcome needs.
- [ ] WEBFEAT-CK-OVERALL-01-02 — The delivered outcome matches the bound frame's completion signal, scope, and non-goals.
- Also applies: WEBFEAT-CK-CONSISTENCY-02-01 (distinct claims reported separately).
