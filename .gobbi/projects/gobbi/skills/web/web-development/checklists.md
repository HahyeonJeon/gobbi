# Web Development Evaluation Checklist

This reusable unchecked source evaluates one web change coordinated across its applicable design,
implementation, testing, release, deployment, live-learning, iteration, and retirement handoffs. It checks
the bound outcome, owner routing, handoff contract, vertical slices, returns, and separated claims this skill
owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-development`](SKILL.md) operation, with [`web-frontend`](../web-frontend/SKILL.md) and
[`web-backend`](../web-backend/SKILL.md) as the layer operations it routes to,
[`web-architecture`](../web-architecture/SKILL.md) as the owner of the structural seams it integrates across,
and [`web-deployment`](../web-deployment/SKILL.md) as the operation that owns deployment actions. The source
commit that contains this file identifies the checklist version. Its stable owner prefix is `WEBDEV`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBDEV-SC-PROJECT-01 — Normal case: one bounded outcome is locked before implementation

A feature request arrives and work is about to start. The expected outcome binds one complete observable
outcome with its signals, scope, and non-goals before any implementation; a frame that names a page, an
endpoint, or a happy path as the unit of completion is the failure.

#### Checklist

- [ ] WEBDEV-CK-PROJECT-01-01 — The frame names the actors, trigger, entry, observable completion, false completion, side effects, paths, states, failures, recovery, boundary, non-goals, compatibility constraints, and decision authority.
- [ ] WEBDEV-CK-PROJECT-01-02 — The unit of completion is one complete observable outcome rather than a page, component, endpoint, migration, or green happy path.
- [ ] WEBDEV-CK-PROJECT-01-03 — A scope change, a contradiction, or missing authority is returned to the user before contract work.
- [ ] WEBDEV-CK-PROJECT-01-04 — The current entry-to-effect journey is traced through routes, browser state, APIs, domain rules, stored data, providers, access controls, tests, telemetry, configuration, migrations, support, and release controls before the change is selected.

### WEBDEV-SC-PROJECT-02 — Rule violation: an applicable owner is skipped without evidence

A layer is handled inside this operation because loading its owner felt heavier than doing the work. The
expected outcome tests every trigger and evidences every omission; an unrouted layer, or an owner's policy
copied here, is the failure.

#### Checklist

- [ ] WEBDEV-CK-PROJECT-02-01 — Every sibling trigger and implementation domain is tested against the locked frame.
- [ ] WEBDEV-CK-PROJECT-02-02 — Every omitted owner records inspected evidence that its trigger is absent.
- [ ] WEBDEV-CK-PROJECT-02-03 — Every in-scope layer has exactly one owner, or the ownership conflict or uncovered capability is returned.
- [ ] WEBDEV-CK-PROJECT-02-04 — No owner's policy is copied into this operation in place of routing to it.

### WEBDEV-SC-PROJECT-03 — Normal case: the current lifecycle stage is explicit

A coordinated change is resumed after a handoff or return. The expected outcome identifies the current stage,
its semantic owner, and why it may advance or reopen; a stage inferred from the latest artifact is the failure.

#### Checklist

- [ ] WEBDEV-CK-PROJECT-03-01 — The coordination record names the current lifecycle stage and its semantic owner.
- [ ] WEBDEV-CK-PROJECT-03-02 — The current stage records its entry condition, exit condition, and reopen reason.

## Structure

### WEBDEV-SC-STRUCTURE-01 — Normal case: one cross-layer contract is locked before building

Several layers must agree before code exists. The expected outcome locks one internally consistent contract
covering entries, state, effects, authority, data, failures, and release controls; an omission carried by
assumption rather than by evidence is the failure.

#### Checklist

- [ ] WEBDEV-CK-STRUCTURE-01-01 — The contract defines each entry and URL, browser and server state, message and error, domain and provider effect, authority, privacy boundary, completion, failure, and resumption path.
- [ ] WEBDEV-CK-STRUCTURE-01-02 — The contract maps who can create, read, update, delete, retain, export, and observe each data class.
- [ ] WEBDEV-CK-STRUCTURE-01-03 — The contract defines applicable configuration, migration, compatibility, instrumentation, support, rollout, stop, and rollback behavior.
- [ ] WEBDEV-CK-STRUCTURE-01-04 — Every omission from the contract is supported by evidence rather than silence.

### WEBDEV-SC-STRUCTURE-02 — Poor quality: breadth is added before a real end-to-end path exists

Screens and endpoints multiply while no real entry has yet reached a truthful completion. The expected outcome
connects the smallest real path first and repairs the earliest missing seam; a mock response or an isolated
endpoint treated as the feature is the failure.

#### Checklist

- [ ] WEBDEV-CK-STRUCTURE-02-01 — The smallest safe path runs from a real entry through the required browser, server, and data or provider seams to truthful observable completion.
- [ ] WEBDEV-CK-STRUCTURE-02-02 — Every fake or unavailable dependency is marked.
- [ ] WEBDEV-CK-STRUCTURE-02-03 — One end-to-end skeleton trace is captured as evidence.
- [ ] WEBDEV-CK-STRUCTURE-02-04 — No client-only demo, mock response, or isolated endpoint is treated as the feature.
- [ ] WEBDEV-CK-STRUCTURE-02-05 — The earliest missing seam is repaired before another slice is added.

## Performance

### WEBDEV-SC-PERFORMANCE-01 — Rule violation: a universal budget is invented

A performance, availability, security, or accessibility target is set because it sounds like a standard. The
expected outcome takes every target from project evidence or an explicit feature decision; a number nobody
decided, held against the work, is the failure.

#### Checklist

- [ ] WEBDEV-CK-PERFORMANCE-01-01 — Every quality target comes from project evidence or an explicit feature decision.
- [ ] WEBDEV-CK-PERFORMANCE-01-02 — No universal performance, availability, security, or accessibility budget is invented for this feature.

### WEBDEV-SC-PERFORMANCE-02 — Edge case: the feature runs under duplicates, concurrency, and late results

Real traffic delivers the same request twice, two at once, and one long after it was abandoned. The expected
outcome keeps success truthful under each of those and emits the contract's signals; a path correct only when
timing is clean is the failure.

#### Checklist

- [ ] WEBDEV-CK-PERFORMANCE-02-01 — Truthful success holds under applicable duplicates, concurrency, stale clients, partial mutation, dependency failure, interruption, retries, and late results.
- [ ] WEBDEV-CK-PERFORMANCE-02-02 — The instrumentation and monitoring signals the contract defines are emitted by the implemented path.

## Aesthetics

### WEBDEV-SC-AESTHETICS-01 — Poor quality: the handoff cannot be read by a cold operator

The handoff is given to someone who was not in the work. The expected outcome assembles rollout, stop,
rollback, diagnostics, support, authority state, and the measure set so they can act; a handoff readable only
by its author is the failure.

#### Checklist

- [ ] WEBDEV-CK-AESTHETICS-01-01 — The handoff assembles compatibility notes, rollout, stop, rollback, diagnostics, support, deployment-authority state, and post-deployment validation for a cold operator.
- [ ] WEBDEV-CK-AESTHETICS-01-02 — The user-visible measure set names its owner, its review cadence, and the evidence that reopens the design.

## Usage

### WEBDEV-SC-USAGE-01 — Normal case: the observable outcome is reachable and truthful

A person completes the feature end to end. The expected outcome ties what they observe to the authoritative
effect and distinguishes it from the named false completion; an acknowledgement shown before the effect exists
is the failure.

#### Checklist

- [ ] WEBDEV-CK-USAGE-01-01 — The completion signal a person observes matches the authoritative effect rather than a client-side acknowledgement.
- [ ] WEBDEV-CK-USAGE-01-02 — The false-completion signal named in the frame is distinguishable from real completion in the built path.
- [ ] WEBDEV-CK-USAGE-01-03 — Ordinary behavior, alternative-valid paths, exact boundaries, failures and recovery, adversarial cases, compatibility, and counterfactual assumptions are grown one slice at a time until the contract's cases are implemented.

### WEBDEV-SC-USAGE-02 — Expected failure: a path fails midway

A dependency fails, the person is interrupted, or a step is rejected partway through. The expected outcome
reports the failure honestly and offers a recovery route with the person's state preserved; a false success or
a silent repair is the failure.

#### Checklist

- [ ] WEBDEV-CK-USAGE-02-01 — No path reports false success or hides a repair.
- [ ] WEBDEV-CK-USAGE-02-02 — A failed path exposes its recovery route.
- [ ] WEBDEV-CK-USAGE-02-03 — A failed path preserves the person's entered state where the contract requires it.

### WEBDEV-SC-USAGE-03 — Normal case: live evidence reopens the owned lifecycle

Evidence from live use invalidates an accepted decision or outcome. The expected result reopens the earliest
affected stage and routes the new iteration through each applicable owner; restarting at the surface where the
evidence appeared is the failure.

#### Checklist

- [ ] WEBDEV-CK-USAGE-03-01 — Live evidence reopens the earliest stage whose accepted input or outcome it invalidates.
- [ ] WEBDEV-CK-USAGE-03-02 — Iteration proceeds through the exact design, implementation, testing, release, deployment, and operations owners that apply from the reopened stage.

## Consistency

### WEBDEV-SC-CONSISTENCY-01 — Normal case: artifacts move together

Each slice touches implementation, contract, tests, documentation, and telemetry. The expected outcome updates
them together and reconciles them before the handoff; a telemetry definition or runbook describing the
previous slice is the failure.

#### Checklist

- [ ] WEBDEV-CK-CONSISTENCY-01-01 — Implementation, contracts, data, configuration, documentation, tests, security evidence, and telemetry are updated together within each slice.
- [ ] WEBDEV-CK-CONSISTENCY-01-02 — Contracts, implementation, configuration, migrations, tests, security records, telemetry, support, and documentation are reconciled before the handoff.
- [ ] WEBDEV-CK-CONSISTENCY-01-03 — The recorded current behavior matches the application as inspected.
- [ ] WEBDEV-CK-CONSISTENCY-01-04 — Every authorized break is recorded with its evidence.

### WEBDEV-SC-CONSISTENCY-02 — Rule violation: distinct claims are merged into one status

The change is reported as done. The expected outcome separates what was designed, implemented, tested,
released, authorized, deployed, validated, operated, and retired; one status covering all of them, or browser
evidence widened beyond what it proves, is the failure.

#### Checklist

- [ ] WEBDEV-CK-CONSISTENCY-02-01 — Implementation correctness, frontend acceptance, backend effects, release readiness, deployment authorization, deployment state, and live outcome validation are reported as separate claims.
- [ ] WEBDEV-CK-CONSISTENCY-02-02 — Each claim is matched to its strongest owning evidence rather than to a weaker signal widened to cover it.
- Also applies: WEBFRNT-CK-RISK-04-02 (browser evidence stays within its proving limits).

### WEBDEV-SC-CONSISTENCY-03 — Normal case: every handoff keeps its complete contract

A lifecycle stage advances or returns. The expected outcome preserves the exact input, output, return, owner,
and evidence claim; a handoff inferred from a status label is the failure.

#### Checklist

- [ ] WEBDEV-CK-CONSISTENCY-03-01 — Every handoff record distinguishes its material input, success output, failure return, next owner, and evidence claim.

## Risk

### WEBDEV-SC-RISK-02 — Adversarial: a success measure is gamed

A user-visible measure improves while the outcome it stands for gets worse. The expected outcome names each
measure's harmful interpretation and the guardrail that detects it; a proxy standing alone is the failure.

#### Checklist

- [ ] WEBDEV-CK-RISK-02-01 — Every user-visible success measure names its intended interpretation and its harmful interpretation.
- [ ] WEBDEV-CK-RISK-02-02 — Every success measure names the guardrail that detects the harmful interpretation, so a proxy improving while the user outcome worsens never stands alone.
- [ ] WEBDEV-CK-RISK-02-03 — Every success measure carries its failure or recovery signal beside it.

### WEBDEV-SC-RISK-03 — Expected failure: a verification finding appears late

Verification exposes a failed claim close to the handoff. The expected outcome returns it to its earliest
owner and preserves the evidence gap; repairing at the surface where it surfaced, or filling the gap with a
weaker signal, is the failure.

#### Checklist

- [ ] WEBDEV-CK-RISK-03-01 — A failed claim is returned to its earliest owner rather than repaired at the surface where it appeared.
- [ ] WEBDEV-CK-RISK-03-02 — Each evidence gap is preserved rather than filled with a weaker signal widened to cover it.

### WEBDEV-SC-RISK-04 — Rule violation: coordination is treated as action authority

The coordinated change reaches a specialist, release, deployment, operations, or retirement stage and the
coordinator attempts the action because the route arrived there. The expected outcome keeps each action and
claim with its semantic owner and pauses without authority; coordination used as permission is the failure.

#### Checklist

- [ ] WEBDEV-CK-RISK-04-01 — The coordinator performs no design, implementation, test, release, deployment, or operations action solely because coordination reached that stage.
- [ ] WEBDEV-CK-RISK-04-02 — Every specialist, external, destructive, and irreversible action retains the exact authority required by its owner.
- [ ] WEBDEV-CK-RISK-04-03 — Design acceptance, implementation correctness, test evidence, release readiness, deployment authority, deployment state, live verification, observed health, supported operation, and retirement are reported as separate claims.
- [ ] WEBDEV-CK-RISK-04-04 — An unauthorized external, destructive, or irreversible action pauses.
- [ ] WEBDEV-CK-RISK-04-05 — Every stage handoff is accepted only after the evaluation or approved limitation disposition required by that stage.
- [ ] WEBDEV-CK-RISK-04-06 — An unauthorized external, destructive, or irreversible action names the required authority.

## Overall

### WEBDEV-SC-OVERALL-01 — Normal case: one integrated feature across only the layers it needs

A coordinated change integrates the layers its outcome requires, matches its bound frame, and preserves each
later lifecycle handoff. The scenario fails when a layer was integrated without need, when the delivered
outcome differs from the bound frame, or when the operation claims work it did not own.

#### Checklist

- [ ] WEBDEV-CK-OVERALL-01-01 — The feature integrates only the browser, server, data, provider, operational, and release layers the outcome needs.
- [ ] WEBDEV-CK-OVERALL-01-02 — The delivered outcome matches the bound frame's completion signal, scope, and non-goals.
- Also applies: WEBDEV-CK-CONSISTENCY-02-01 (distinct claims reported separately).

### WEBDEV-SC-OVERALL-02 — Normal case: coordination reaches one exact terminal

A coordinated change is ready to close. The expected outcome reaches ordinary accepted completion or the
retirement terminal with every handoff resolved; a route closed while ownership remains ambiguous is the
failure.

#### Checklist

- [ ] WEBDEV-CK-OVERALL-02-01 — The coordinated change reaches an accepted completion state or the retirement terminal state before it is closed.
- [ ] WEBDEV-CK-OVERALL-02-02 — No ownerless handoff, unresolved return, or unowned reopen reason remains when coordination is reported complete.
