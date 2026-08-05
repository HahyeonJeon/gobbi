# Electron Release Evaluation Checklist

This reusable unchecked source evaluates one Electron release from accepted immutable Packaging candidates.
The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`ELECREL`.

This file defines reusable evaluation-checklist coverage only. It defines no test specification, evidence
metadata, row result, severity, score, verdict, or remediation instruction. Preserve every row as an
unchecked binary condition.

A row is defined once beneath its owning scenario. An `Also applies` line reuses a row defined elsewhere,
carries no checkbox, and creates no second condition.

## Project

### ELECREL-SC-PROJECT-01 — Normal case: one release has an exact subject and mode

One release prepares, reviews, or executes policy and external state for accepted candidates. It succeeds
when the subject and work mode are explicit; an ambiguous release or unrecorded execution mode is the
failure.

#### Checklist

- [ ] ELECREL-CK-PROJECT-01-01 — The subject is one Electron release with exactly one accepted immutable Packaging candidate for each target operating system and architecture.
- [ ] ELECREL-CK-PROJECT-01-02 — The work is classified as preparation, read-only review, or execution.

### ELECREL-SC-PROJECT-02 — Expected failure: candidate identity is incomplete or changed

A supplied candidate lacks an accepted field, fails checksum verification, or differs from its Packaging
record. It succeeds by returning the unchanged candidate to Packaging; continuing from inferred identity or
repairing the artifact in Release is the failure.

#### Checklist

- [ ] ELECREL-CK-PROJECT-02-01 — Every candidate has an accepted complete Packaging record for its exact target operating system and architecture.
- [ ] ELECREL-CK-PROJECT-02-02 — Every candidate's recomputed or independently verified checksum equals the checksum in its accepted Packaging record.
- [ ] ELECREL-CK-PROJECT-02-03 — A candidate with missing evidence, changed bytes, or an identity mismatch is returned unchanged to Packaging.

### ELECREL-SC-PROJECT-03 — Rule violation: Release takes another owner's work

Release appears complete by constructing an artifact or performing Testing or complete delivery work. It
succeeds when those owner boundaries remain intact; any such action inside Release is the Rule violation.

#### Checklist

- [ ] ELECREL-CK-PROJECT-03-01 — Release performs no package assembly, signing, notarization, installer construction, rebuild, or candidate-byte mutation.
- [ ] ELECREL-CK-PROJECT-03-02 — Release performs no test design, execution, interpretation, environment classification, evidence creation, or complete delivery coordination.

## Structure

### ELECREL-SC-STRUCTURE-01 — Normal case: support and transition policy is complete

An accepted candidate needs a complete release policy before readiness work starts. It succeeds when every
support, compatibility, rollout, recovery, and authority decision is target-specific; an inferred or missing
decision is the failure.

#### Checklist

- [ ] ELECREL-CK-STRUCTURE-01-01 — The release policy records the application version, pinned Electron major, and current support state.
- [ ] ELECREL-CK-STRUCTURE-01-02 — The release policy records each target operating system, minimum operating-system version, architecture, and distribution target.
- [ ] ELECREL-CK-STRUCTURE-01-03 — The release policy records the supported and unsupported predecessor set for each target and channel.
- [ ] ELECREL-CK-STRUCTURE-01-04 — The release policy records installed-data, settings, and protocol compatibility for every supported transition.
- [ ] ELECREL-CK-STRUCTURE-01-05 — The release policy records rollout stages, withdrawal criteria, stop thresholds, and the forward-recovery plan.
- [ ] ELECREL-CK-STRUCTURE-01-06 — The release policy names every decision authority, credential owner, and external-action authority.

### ELECREL-SC-STRUCTURE-02 — Edge case: update mechanisms differ by target

The release covers operating systems whose update services and distribution paths differ. It succeeds when
each target has a selected supported mechanism and channel; a universal updater assumption is the failure.

#### Checklist

- [ ] ELECREL-CK-STRUCTURE-02-01 — Each target operating system and architecture has one project-selected update mechanism and channel.
- [ ] ELECREL-CK-STRUCTURE-02-02 — Every selected update mechanism conforms to its supported target path: Electron's built-in `autoUpdater` only for macOS or Windows, and a distribution mechanism or another explicitly selected supported mechanism for Linux.
- [ ] ELECREL-CK-STRUCTURE-02-03 — Feed, store, package-manager, metadata, signature, restart, and rejected-transition constraints remain specific to their named target and mechanism.

## Performance

### ELECREL-SC-PERFORMANCE-01 — Normal case: rollout advances through bounded stages

A ready release uses a staged rollout. It succeeds when each stage has a finite population, accepted
diagnostic thresholds, and a recorded decision before expansion; uncontrolled promotion is the failure.

#### Checklist

- [ ] ELECREL-CK-PERFORMANCE-01-01 — Every rollout stage records its target, channel, population, entry condition, and exit condition.
- [ ] ELECREL-CK-PERFORMANCE-01-02 — Every rollout stage records the accepted Observability signals, signal time range, and explicit stop thresholds.
- [ ] ELECREL-CK-PERFORMANCE-01-03 — Every rollout stage has a recorded decision and authority before the population advances.

### ELECREL-SC-PERFORMANCE-02 — Poor quality: stale or missing signals permit expansion

A stage appears quiet because its diagnostic records are stale, mismatched, or unavailable. It succeeds by
stopping advancement until the required signal state is current; treating absence as health is the quality
failure.

#### Checklist

- [ ] ELECREL-CK-PERFORMANCE-02-01 — Every rollout decision uses diagnostic records that match the candidate, target, channel, stage population, and accepted time range.
- [ ] ELECREL-CK-PERFORMANCE-02-02 — A missing, stale, mismatched, or unavailable required signal stops rollout advancement.

## Aesthetics

### ELECREL-SC-AESTHETICS-01 — Poor quality: release states and actions are ambiguous

The record contains plausible labels but a cold reader cannot distinguish candidate, readiness, external,
rollout, withdrawal, and recovery states. It succeeds when each state and action is self-identifying;
polished but interchangeable labels are the quality failure.

#### Checklist

- [ ] ELECREL-CK-AESTHETICS-01-01 — Record labels distinguish candidate accepted, readiness accepted, published, promoted, rolling out, paused, withdrawn, stopped, and recovery states.
- [ ] ELECREL-CK-AESTHETICS-01-02 — Every external-action label identifies its version, candidate checksum, target operating system and architecture, channel, destination, and action identity.

## Usage

### ELECREL-SC-USAGE-01 — Normal case: Release sends a complete Testing request

Release needs readiness evidence for one exact policy and candidate. It succeeds when the dynamic request
states every identity, claim, and required scenario while Testing retains method ownership; an incomplete
request or Release-selected method is the failure.

#### Checklist

- [ ] ELECREL-CK-USAGE-01-01 — The request records its identity, immutable candidate identity and checksum, and target operating system and architecture.
- [ ] ELECREL-CK-USAGE-01-02 — The request records the supported predecessor set for the target and channel.
- [ ] ELECREL-CK-USAGE-01-03 — The request records the update-mechanism, release-metadata identity, channel, compatibility, rollout, withdrawal, and recovery claims that require evidence.
- [ ] ELECREL-CK-USAGE-01-04 — The request names every required predecessor, update, install, restart, migration, rejection, and recovery scenario.

### ELECREL-SC-USAGE-02 — Edge case: Testing returns readiness evidence

Testing returns evidence and failures for the requested scenarios. It succeeds when the return matches the
request, classifies every environment, and supports a literal readiness decision; a mismatch, missing case,
or reinterpreted failure is the failure.

#### Checklist

- [ ] ELECREL-CK-USAGE-02-01 — The returned record matches the request, candidate checksum, target operating system and architecture, predecessor, channel, update mechanism, and release-metadata identity.
- [ ] ELECREL-CK-USAGE-02-02 — The returned record classifies the environment for every requested scenario.
- [ ] ELECREL-CK-USAGE-02-03 — The returned record contains predecessor, update, install, restart, migration, rejection, and recovery evidence or an explicit failure for every requested scenario.
- [ ] ELECREL-CK-USAGE-02-04 — Release accepts readiness only when every required scenario has a complete environment-classified passing record.
- [ ] ELECREL-CK-USAGE-02-05 — Release accepts or stops from Testing's recorded result without reinterpretation or proxy substitution.

### ELECREL-SC-USAGE-03 — Expected failure: a required update path is unavailable or fails

A required environment is unavailable, or an update path has an interrupted download; an unavailable feed,
store, or update service; applicable invalid, stale, unsigned, or tampered update metadata or artifact; a
failed install; a failed restart or first launch; or a partially applied migration. It succeeds when every
named gap or failure prevents readiness and the stop retains its exact limit and last accepted state; calling
the affected target and candidate ready is the failure.

#### Checklist

- [ ] ELECREL-CK-USAGE-03-01 — Each member of this set prevents readiness for its affected target and candidate: an unavailable required environment; interrupted download; unavailable feed, store, or update service; applicable invalid, stale, unsigned, or tampered update metadata or artifact; failed install; failed restart or first launch; and partially applied migration.
- [ ] ELECREL-CK-USAGE-03-02 — The stop retains the exact failure or environment limitation, candidate, request, returned record, last accepted state, and responsible owner.

### ELECREL-SC-USAGE-04 — Normal case: an authorized external action records remote state

A ready release has exact authority for one publication or promotion. It succeeds when the action changes
only its named destination and records the observed remote state; implicit authority or an uninspected
destination is the failure.

#### Checklist

- [ ] ELECREL-CK-USAGE-04-01 — A readiness decision for the same candidate, target, and channel precedes the external action.
- [ ] ELECREL-CK-USAGE-04-02 — The credential owner or external-action authority approves the exact destination and action before credential access or mutation.
- [ ] ELECREL-CK-USAGE-04-03 — The action record contains its destination, version, candidate checksum, release-metadata identity, target, channel, action result, remote identity, and observed remote state.

## Consistency

### ELECREL-SC-CONSISTENCY-01 — Rule violation: readiness is treated as external authority

Testing evidence supports readiness and an operator wants to publish immediately. It succeeds when readiness
and action authority remain separate current records; performing an action from readiness alone is the Rule
violation.

#### Checklist

- [ ] ELECREL-CK-CONSISTENCY-01-01 — Readiness and external-action authority are separate recorded decisions.
- [ ] ELECREL-CK-CONSISTENCY-01-02 — No publication, promotion, rollout, feed mutation, store action, credential use, or withdrawal occurs without both current readiness and exact action authority.

### ELECREL-SC-CONSISTENCY-02 — Edge case: candidate or policy identity changes

Bytes, support facts, release policy, release-metadata identity, mechanism, channel, target, predecessor set,
or a required environment changes after evidence was accepted. It succeeds by invalidating every affected
later claim and returning to the correct owner; stale readiness retained under the old identity is the
failure.

#### Checklist

- [ ] ELECREL-CK-CONSISTENCY-02-01 — A changed candidate checksum invalidates dependent readiness.
- [ ] ELECREL-CK-CONSISTENCY-02-02 — A changed support fact, release policy, release-metadata identity, update mechanism, channel, target, predecessor set, or required environment invalidates every affected Testing request, readiness decision, and later action.
- Also applies: ELECREL-CK-PROJECT-02-03 (invalid candidate returns unchanged to Packaging).
- Also applies: ELECREL-CK-USAGE-04-01 (current readiness precedes external action).

## Risk

### ELECREL-SC-RISK-01 — Expected failure: an external action completes only partly

A destination accepts some metadata or bytes and rejects the rest. It succeeds by retaining exact local and
remote state and stopping before another action; blind retry, deletion, or promotion is the failure.

#### Checklist

- [ ] ELECREL-CK-RISK-01-01 — A partial or failed action records what is present, absent, visible, and still mutable at the destination.
- [ ] ELECREL-CK-RISK-01-02 — No retry, compensation, deletion, promotion, or second-destination action follows without exact current authority.
- [ ] ELECREL-CK-RISK-01-03 — Protected credential values are absent from release metadata, logs, requests, responses, and retained records.

### ELECREL-SC-RISK-02 — Normal case: rollout stops and withdrawal remains limited

Accepted signals cross a stop threshold after release. It succeeds when new rollout stops and any authorized
withdrawal limits later acquisition without overstating its effect; continued expansion or claimed repair of
installed machines is the failure.

#### Checklist

- [ ] ELECREL-CK-RISK-02-01 — A threshold breach or material failure pauses or stops new rollout.
- [ ] ELECREL-CK-RISK-02-02 — Withdrawal is not recorded as repair or recovery for any installed machine.
- Also applies: ELECREL-CK-CONSISTENCY-01-02 (withdrawal requires current readiness and exact authority).

### ELECREL-SC-RISK-03 — Edge case: rollback is proposed after release

A prior candidate exists and rollback appears faster than a forward fix. It succeeds only when current
records establish the complete path, passing Testing evidence covers every testable condition, and exact
rollback authority exists; convenience, artifact availability, or an old passing result is the failure.

#### Checklist

- [ ] ELECREL-CK-RISK-03-01 — Forward fix is the recorded default after publication or installation.
- [ ] ELECREL-CK-RISK-03-02 — Current records establish the prior candidate, target, predecessor state, installed-data, settings, and protocol compatibility, updater path, passing Testing evidence for every testable condition, and exact rollback authority.

### ELECREL-SC-RISK-04 — Adversarial: proxy evidence or another target appears sufficient

A cosmetic install, restart, metadata listing, one predecessor, or another target appears to establish
readiness or recovery. It succeeds by rejecting the proxy; inheriting an unobserved claim is the adversarial
failure.

#### Checklist

- [ ] ELECREL-CK-RISK-04-01 — Cosmetic install, restart, metadata visibility, download, or process survival is not accepted for an unobserved update, compatibility, readiness, rollout, or recovery claim.
- [ ] ELECREL-CK-RISK-04-02 — Evidence or external state from one operating system, architecture, predecessor, channel, stage, or destination is not generalized to another.

## Overall

### ELECREL-SC-OVERALL-01 — Normal case: the exact release record or stop is complete

Release reaches its terminal state for every target. It succeeds with one complete target-specific release
record or an exact retained stop; missing policy, evidence, authority, external state, or recovery limits are
the failure.

#### Checklist

- [ ] ELECREL-CK-OVERALL-01-01 — The terminal record contains every immutable candidate identity and checksum.
- [ ] ELECREL-CK-OVERALL-01-02 — The terminal record contains every support, version-transition, target, predecessor, channel, release-metadata identity, update-mechanism, and compatibility policy.
- [ ] ELECREL-CK-OVERALL-01-03 — The terminal record contains every Testing request, accepted evidence identity, readiness decision, limitation, and invalidation condition.
- [ ] ELECREL-CK-OVERALL-01-04 — The terminal record contains every authority, external action, current remote state, rollout decision, Observability signal, withdrawal state, recovery decision, and unresolved machine.
- [ ] ELECREL-CK-OVERALL-01-05 — An exact stop contains the failed target and state, last accepted record, retained evidence, local and external state, responsible owner, required decision, and next authorized action.
