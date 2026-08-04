# Desktop Delivery Evaluation Checklist

This reusable unchecked source evaluates one coordination run against the trigger, owner-map, contract-lock,
slice-consistency, proof, and authority obligations this skill owns. It evaluates coordination and handoffs,
not the policies this operation routes elsewhere: the observable design judgment belongs to
[`desktop-interface`](../desktop-interface/SKILL.md), the in-application structure to
[`desktop-architecture`](../desktop-architecture/SKILL.md), the installed-platform contract to
[`desktop-contract`](../desktop-contract/SKILL.md), release judgment to
[`desktop-release`](../desktop-release/SKILL.md), and Electron mechanics to the
[`electron`](../../electron/SKILL.md) family, and each of those owners supplies its own checklist. It is
governed by the [`desktop`](../SKILL.md) domain and [`desktop-delivery`](SKILL.md) rules. The source commit
that contains this file identifies the checklist version. Its stable owner prefix is `DTDLVR`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### DTDLVR-SC-PROJECT-01 — Normal case: the trigger fits and every obligation has one owner

The request needs more than one capability owner or makes a complete installed, packaged, or release-ready
claim, so this operation runs. The expected outcome names every active owner and what each must return; an
in-scope obligation with no owner, or with two, is the failure.

#### Checklist

- [ ] DTDLVR-CK-PROJECT-01-01 — The trigger is recorded as multi-capability coordination or a complete installed, packaged, or release-ready claim.
- [ ] DTDLVR-CK-PROJECT-01-02 — Every in-scope obligation has exactly one named owner.
- [ ] DTDLVR-CK-PROJECT-01-03 — Every named owner has the artifact or decision it must return recorded with it.
- [ ] DTDLVR-CK-PROJECT-01-04 — The source set, authority boundary, and explicit non-goals are recorded.

### DTDLVR-SC-PROJECT-02 — Rule violation: a single-owner request run through the whole operation

The request changes one thing inside one owner's boundary, and the operation runs anyway because it is the
familiar route. The expected outcome routes the request directly and stops after recording the handoff; a
coordination run built around a bounded change is the failure.

#### Checklist

- [ ] DTDLVR-CK-PROJECT-02-01 — A bounded single-owner request is routed directly to that owner.
- [ ] DTDLVR-CK-PROJECT-02-02 — The operation stops after recording that handoff rather than continuing into its later phases.

### DTDLVR-SC-PROJECT-03 — Expected failure: an owner, source, or authority is missing

A required owner, source document, or decision authority cannot be reached, so the coordination cannot be
framed. The expected outcome preserves the request and returns `NEEDS_CONTEXT`; inventing the missing policy
to keep moving is the failure.

#### Checklist

- [ ] DTDLVR-CK-PROJECT-03-01 — A missing owner, required source, or decision authority produces a `NEEDS_CONTEXT` return rather than an invented policy.
- [ ] DTDLVR-CK-PROJECT-03-02 — The original request is preserved intact through that return.

## Structure

### DTDLVR-SC-STRUCTURE-01 — Normal case: the skeleton precedes behavior and one thin path is installed

Construction begins from a locked contract. The expected outcome establishes the whole source, process,
bridge, data, build, package, test, documentation, and instrumentation skeleton, then proves one real path
end to end from an installed artifact; behavior built on a partial skeleton is the failure.

#### Checklist

- [ ] DTDLVR-CK-STRUCTURE-01-01 — The complete source, process, bridge, data, build, package, test, documentation, and instrumentation skeleton exists before detailed behavior.
- [ ] DTDLVR-CK-STRUCTURE-01-02 — Each configuration and type boundary sits with the process it governs.
- [ ] DTDLVR-CK-STRUCTURE-01-03 — One smallest real path runs from a supported entry through the observable interface and narrow bridge to its authoritative effect, truthful completion, and applicable persisted state.
- [ ] DTDLVR-CK-STRUCTURE-01-04 — That path is packaged for one explicitly named target.
- [ ] DTDLVR-CK-STRUCTURE-01-05 — The packaged path is installed on that named target.
- [ ] DTDLVR-CK-STRUCTURE-01-06 — The installed path is exercised on that named target with no development-only assumption.

### DTDLVR-SC-STRUCTURE-02 — Rule violation: the coordinator decided a routed policy itself

An owner's answer was slow or absent, so the coordination settled a design, structure, platform, mechanism, or
release question directly. The expected outcome returns the question to its owner; a coordination record that
contains an owner's decision is the failure even when the decision is defensible.

#### Checklist

- [ ] DTDLVR-CK-STRUCTURE-02-01 — No routed decision is settled in this coordination rather than by its owner: observable design judgment by `desktop-interface`, in-application structure and state ownership by `desktop-architecture`, installed-platform contract entries by `desktop-contract`, language and renderer idiom by coding and the applicable language or renderer skills, Electron mechanics by the Electron family, release judgment by `desktop-release`, and the independent verdict by Evaluation.
- [ ] DTDLVR-CK-STRUCTURE-02-02 — Every conflict is returned to the earliest owner whose decision must change, rather than resolved in the coordination.

### DTDLVR-SC-STRUCTURE-03 — Normal case: every observable obligation traces to one implementation unit

The accepted design must reach code without losing a state, a failure, or an accessibility obligation. The
expected outcome traces each one to an observable specification and assigns each implementation unit one
process and one capability owner; an untraced obligation is the failure.

#### Checklist

- [ ] DTDLVR-CK-STRUCTURE-03-01 — Every entry mode, state, action, failure, recovery route, accessibility obligation, first paint, and touched native behavior traces to an observable specification.
- [ ] DTDLVR-CK-STRUCTURE-03-02 — Every implementation unit is assigned one process and one capability owner.
- [ ] DTDLVR-CK-STRUCTURE-03-03 — An implementation constraint that contradicts the accepted experience is returned to the owning design decision with its evidence rather than silently changing behavior.

## Performance

### DTDLVR-SC-PERFORMANCE-01 — Normal case: responsiveness and resource use are measured under real work

A slice is complete, and the application must stay responsive while doing the work it claims. The expected
outcome measures main-process responsiveness and bounded resource use under representative work, and measures
installed performance against declared conditions; an unmeasured claim is the failure.

#### Checklist

- [ ] DTDLVR-CK-PERFORMANCE-01-01 — Main-process responsiveness and bounded resource use are measured under representative work for each completed slice.
- [ ] DTDLVR-CK-PERFORMANCE-01-02 — Installed performance and resource targets are measured under the declared conditions for each claimed target.

### DTDLVR-SC-PERFORMANCE-02 — Poor quality: a development measurement stands for the installed one

Timings and memory figures were captured from a development run because the packaged build was slower to
produce. The expected outcome measures the installed artifact under the declared conditions; a plausible
development number carried into an installed claim is the failure.

#### Checklist

- [ ] DTDLVR-CK-PERFORMANCE-02-01 — No installed performance or resource figure originates from a development run or an unpacked build.
- [ ] DTDLVR-CK-PERFORMANCE-02-02 — Every recorded measurement names the artifact and conditions it was taken under.

## Aesthetics

### DTDLVR-SC-AESTHETICS-01 — Poor quality: delivery states collapsed into one word

The handoff says the work is done, complete, or shipped, so a reader cannot tell whether it is packaged,
installed, rehearsed, ready, or published. The expected outcome names each state literally; a summary that
reads well but hides which state was reached is the failure.

#### Checklist

- [ ] DTDLVR-CK-AESTHETICS-01-01 — Development, code-verified, packaged, installed, signed or notarized, update-rehearsed, release-ready, release-authorized, published, and post-release are used as distinct named states.
- [ ] DTDLVR-CK-AESTHETICS-01-02 — No completion word in the record or handoff stands for a state the evidence does not establish.

## Usage

### DTDLVR-SC-USAGE-01 — Normal case: the handoff serves a cold operator

Someone who did not run the coordination must take the result forward. The expected outcome states the
outcome and non-goals, the target and artifact matrix, the observable contract, the process and bridge map,
data schemas and recovery, update paths, the support and forward-fix plan, limitations, and each delivery
state; a handoff that assumes the session's context is the failure.

#### Checklist

- [ ] DTDLVR-CK-USAGE-01-01 — The handoff states the outcome, non-goals, target and artifact matrix, observable contract, process and bridge map, data schemas and recovery, update paths, support and forward-fix plan, limitations, and each distinct delivery state through release readiness and authority.
- [ ] DTDLVR-CK-USAGE-01-02 — The handoff is understandable without the coordination session's private context.

### DTDLVR-SC-USAGE-02 — Normal case: the locked outcome describes a person's whole path

The outcome contract must cover what a person does, not only what the system produces. The expected outcome
locks actors, entry modes, paths, completion, failure, recovery, data effects, and the support route; a
contract that stops at system completion is the failure.

#### Checklist

- [ ] DTDLVR-CK-USAGE-02-01 — The locked contract names the primary and supporting actors, trigger, entry modes, normal and alternative paths, visible completion, system completion, false completion, failure, recovery, data effects, support route, operating-system and architecture claims, scope, non-goals, and publication authority.

## Consistency

### DTDLVR-SC-CONSISTENCY-01 — Normal case: each slice moves with everything that depends on it

A user-visible capability is implemented, and its code, tests, documentation, and package inputs must arrive
together. The expected outcome verifies the complete affected slice before the next begins; a slice that
leaves its tests or documentation for later is the failure.

#### Checklist

- [ ] DTDLVR-CK-CONSISTENCY-01-01 — Code, configuration, types, tests, documentation, persistent-data behavior, package inputs, and operational evidence move together for each slice.
- [ ] DTDLVR-CK-CONSISTENCY-01-02 — Each slice is verified complete before the next slice begins.
- [ ] DTDLVR-CK-CONSISTENCY-01-03 — A slice trace links each locked path to its implementation and its fresh checks.
- [ ] DTDLVR-CK-CONSISTENCY-01-04 — No in-scope path is left with a placeholder or a deferred layer.

### DTDLVR-SC-CONSISTENCY-02 — Edge case: a claimed target cannot be exercised

A required build environment, signing identity, or store obligation is unavailable, so one claimed target
cannot be proved. The expected outcome marks that target unproved and narrows the claim; a neighbouring
target's result standing in for it is the failure.

#### Checklist

- [ ] DTDLVR-CK-CONSISTENCY-02-01 — Every retained target claim has matching installed-artifact evidence in the claim matrix.
- [ ] DTDLVR-CK-CONSISTENCY-02-02 — Every target that cannot be exercised and every transition whose predecessor is unavailable are marked unproved.
- [ ] DTDLVR-CK-CONSISTENCY-02-03 — Every target that cannot be exercised and every transition whose predecessor is unavailable are dropped from the supported claim.
- [ ] DTDLVR-CK-CONSISTENCY-02-04 — No target's result substitutes for another target's proof.

### DTDLVR-SC-CONSISTENCY-03 — Edge case: the accepted stack is challenged

New evidence or a new requirement puts the accepted stack in question. The expected outcome assesses the
named factors and pauses for the user's decision on a material conflict; a stack changed or defended without
that assessment is the failure.

#### Checklist

- [ ] DTDLVR-CK-CONSISTENCY-03-01 — The accepted stack is preserved unless current evidence materially challenges it.
- [ ] DTDLVR-CK-CONSISTENCY-03-02 — A new or challenged stack is assessed for resource and package cost, content trust, native depth, target and update fit, team upgrade capacity, migration cost, and release needs.
- [ ] DTDLVR-CK-CONSISTENCY-03-03 — A material stack conflict, or a target with no credible delivery path, pauses for an explicit user decision.

## Risk

### DTDLVR-SC-RISK-01 — Normal case: publication stays a separate explicit user action

Every technical gate has passed and the artifacts are ready. The expected outcome hands off the ready
artifacts and stops before any external effect until the user authorizes that action; proceeding on the
strength of readiness is the failure.

#### Checklist

- [ ] DTDLVR-CK-RISK-01-01 — No installer, update, store release, feed change, or rollout occurs without explicit user authority for that action.
- [ ] DTDLVR-CK-RISK-01-02 — Release readiness and release authority are recorded as separate states.
- [ ] DTDLVR-CK-RISK-01-03 — Without publication authority, the operation hands off the ready artifacts and stops before any external effect.

### DTDLVR-SC-RISK-02 — Expected failure: an update or version transition fails part-way

An update is interrupted, a migration refuses, or a person is running an older release. The expected outcome
preserves a usable application and recoverable data or enters the declared recovery path; a transition that
leaves the application or its data unusable is the failure.

#### Checklist

- [ ] DTDLVR-CK-RISK-02-01 — Each supported transition is rehearsed through update discovery, download, installation, migration, launch, ordinary use, and relaunch with realistic data.
- [ ] DTDLVR-CK-RISK-02-02 — An incompatible version refuses explicitly while preserving recoverable data.
- [ ] DTDLVR-CK-RISK-02-03 — A failed update preserves a usable application and data or enters the declared recovery path.
- Also applies: DTDLVR-CK-CONSISTENCY-02-02 (an unprovable target or transition is marked unproved).
- Also applies: DTDLVR-CK-CONSISTENCY-02-03 (an unprovable target or transition is dropped from the claim).

### DTDLVR-SC-RISK-03 — Adversarial: a passing gate presented as authority to publish

Evaluation is accepted, every target is proved, and the release is described as authorized because nothing is
outstanding. The expected outcome keeps authority a separate explicit act by the user; readiness reframed as
permission is the failure.

#### Checklist

- [ ] DTDLVR-CK-RISK-03-01 — No accepted evaluation, passing gate, or complete proof is treated as publication authority.
- [ ] DTDLVR-CK-RISK-03-02 — Release-ready is claimed only with accepted evaluation and matching proof for every retained claim.
- [ ] DTDLVR-CK-RISK-03-03 — A release-ready claim claims nothing beyond readiness.

## Overall

### DTDLVR-SC-OVERALL-01 — Normal case: one reproducible installed outcome with no in-scope gap

The operation ends. The expected outcome is a reproducible installed result whose claim boundaries are
literal, or a recoverable blocked state naming the missing owner, evidence, or authority; an ending that is
neither is the failure.

#### Checklist

- [ ] DTDLVR-CK-OVERALL-01-01 — The operation ends with either a reproducible installed outcome or a recoverable blocked state naming the missing owner, evidence, or authority.
- [ ] DTDLVR-CK-OVERALL-01-02 — The stated claim boundaries are literal rather than implied by the absence of a limitation.
- Also applies: DTDLVR-CK-CONSISTENCY-01-04 (no placeholder or deferred layer).

### DTDLVR-SC-OVERALL-02 — Adversarial: a rebuilt artifact presented as the evaluated candidate

A small repair was made after the candidate was frozen, and the same evaluation result is carried forward
because the change looked harmless. The expected outcome repeats the affected proof and every dependent
whole-outcome check; a result inherited across a changed subject is the failure.

#### Checklist

- [ ] DTDLVR-CK-OVERALL-02-01 — The subject routed to Evaluation is the exact frozen candidate, artifacts, matrices, records, and trace.
- [ ] DTDLVR-CK-OVERALL-02-02 — Every repair is made only after its disposition is authorized.
- [ ] DTDLVR-CK-OVERALL-02-03 — Every repair repeats the affected proof and every dependent whole-outcome check.
- [ ] DTDLVR-CK-OVERALL-02-04 — No evaluation or proof result carries forward across a material change to the candidate.
