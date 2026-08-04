# Desktop Release Evaluation Checklist

This reusable unchecked source evaluates one set of desktop release judgments against the claim-scoping,
persisted-data, transition-rehearsal, target-obligation, readiness, and publication-authority obligations this
skill owns. It is governed by the [`desktop`](../SKILL.md) domain and [`desktop-release`](SKILL.md)
preferences, with [`desktop-development`](../desktop-development/SKILL.md) as the operation that coordinates
the outcome. The applicable [`desktop-windows`](../desktop-windows/SKILL.md),
[`desktop-macos`](../desktop-macos/SKILL.md), or [`desktop-linux`](../desktop-linux/SKILL.md) child owns current
target facts, and the [`electron`](../../electron/SKILL.md) family owns packaging, signing, update, and
platform mechanisms. More specifically, [`electron-release`](../../electron/electron-release/SKILL.md) owns
release mechanisms and [`electron-testing`](../../electron/electron-testing/SKILL.md) owns packaged and
installed evidence. The source commit that contains this file identifies the checklist version. Its stable
owner prefix is `DTRLSE`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### DTRLSE-SC-PROJECT-01 — Normal case: every claim is bound to what supports it

A release judgment is recorded, and its confidence comes from a specific artifact observed in a specific
state. The expected outcome binds the claim to that exact context; a claim written without its boundary, so a
reader can apply it anywhere, is the failure.

#### Checklist

- [ ] DTRLSE-CK-PROJECT-01-01 — Every claim names its exact artifact, operating system, architecture, version, channel, environment, and evidence class.
- [ ] DTRLSE-CK-PROJECT-01-05 — Every release claim assigns release judgment to `desktop-release`, ordered coordination to `desktop-development`, current target facts to the matching `desktop-windows`, `desktop-macos`, or `desktop-linux` child, packaging, signing, notarization, update, and platform release mechanisms to `electron-release`, and packaged and installed evidence to `electron-testing`.

### DTRLSE-SC-PROJECT-02 — Poor quality: a broad target matrix carried without need or evidence

The supported list includes operating systems, architectures, and channels that no current user requirement
asks for and no installed-artifact evidence covers. The expected outcome is the narrowest matrix current need
justifies; a wide matrix kept because removing a target feels like a regression is the failure.

#### Checklist

- [ ] DTRLSE-CK-PROJECT-02-01 — Every supported operating system, architecture, and channel is required by a current user need.
- [ ] DTRLSE-CK-PROJECT-02-02 — Every expansion beyond the narrowest matrix names the concrete requirement and target-specific evidence that justify its build, support, update, and recovery cost.
- [ ] DTRLSE-CK-PROJECT-02-03 — Every target that neither need nor evidence supports is stated as unsupported.

### DTRLSE-SC-PROJECT-03 — Adversarial: proxy evidence is presented as exact evidence

A nearby application build, artifact, target, predecessor, or state passed, and its result is used to support
the current claim. The expected outcome binds the claim to its complete exact evidence subject; similarity
used to transfer a result is the failure.

#### Checklist

- [ ] DTRLSE-CK-PROJECT-03-01 — Every claim identifies the exact application version and build, artifact and checksum, operating-system release and build, application and operating-system architecture, install form, scope, and state, channel and environment, signature, notarization, and trust state, and evidence class.
- [ ] DTRLSE-CK-PROJECT-03-02 — No result from one application build, artifact, target, predecessor, or state is used as evidence for another.

## Structure

### DTRLSE-SC-STRUCTURE-01 — Normal case: persisted structures are versioned and recoverable

The release writes data that must survive it. The expected outcome makes each write atomic or detectably
incomplete, versions each structure, and defines an accepted recovery; a structure that can be left
half-written with no way to tell is the failure.

#### Checklist

- [ ] DTRLSE-CK-STRUCTURE-01-01 — Every persistent write is atomic or detectably incomplete.
- [ ] DTRLSE-CK-STRUCTURE-01-02 — Every persisted structure carries an explicit schema version.
- [ ] DTRLSE-CK-STRUCTURE-01-03 — Every persisted structure has an accepted recovery for corrupt or interrupted state.

### DTRLSE-SC-STRUCTURE-02 — Edge case: persisted data changes while users stay on an older release

A schema or format changes, and some machines will keep running the previous version. The expected outcome
defines forward compatibility or an explicit refusal, downgrade or round-trip behavior, and a recovery for
those users; a change that only considers the new version is the failure.

#### Checklist

- [ ] DTRLSE-CK-STRUCTURE-02-01 — Every persisted-data change defines forward compatibility or an explicit refusal, downgrade or round-trip behavior, and a recovery for users on an older release.
- [ ] DTRLSE-CK-STRUCTURE-02-02 — Schema changes are additive and forward-compatible, or copy-on-upgrade is used where a risky migration could strand older releases.
- [ ] DTRLSE-CK-STRUCTURE-02-03 — Every departure from additive evolution names the measured storage, time, or product requirement behind it.
- [ ] DTRLSE-CK-STRUCTURE-02-04 — Every departure from additive evolution protects each affected version with an explicit refusal, downgrade behavior, and accepted recovery.
- [ ] DTRLSE-CK-STRUCTURE-02-05 — Compatibility and recovery are chosen over a smaller migration or release burden where the two conflict.

### DTRLSE-SC-STRUCTURE-03 — Expected failure: recovery would damage protected user state

An update or recovery path can reach a runnable version only by overwriting incompatible user state or
weakening secret protection. The expected outcome preserves the data, schemas, settings, native integration
state, and protected secrets or returns an exact blocker; a runnable application reached by damaging that
state is the failure.

#### Checklist

- [ ] DTRLSE-CK-STRUCTURE-03-01 — Every accepted recovery preserves compatible data, schemas, settings, and native integration state for the resulting installed version.
- [ ] DTRLSE-CK-STRUCTURE-03-02 — No recovery exposes a protected secret when its required protection is unavailable or degraded.

## Performance

### DTRLSE-SC-PERFORMANCE-01 — Normal case: the release can be watched and stopped

A release is about to be called ready, so its behavior in the field must be observable and its spread
controllable. The expected outcome defines monitoring, stop conditions, a supported-version window, recovery
limits, and a forward-fix path before readiness; readiness declared without them is the failure.

#### Checklist

- [ ] DTRLSE-CK-PERFORMANCE-01-01 — Monitoring, rollout stop conditions, a supported-version window, explicit recovery limits, and a forward-fix path are defined before the release is called ready.
- [ ] DTRLSE-CK-PERFORMANCE-01-02 — The rollout is staged where the distribution channel can control audience growth and the release has observable stop conditions.

### DTRLSE-SC-PERFORMANCE-02 — Edge case: the channel cannot control audience growth

Distribution is offline, private, manual, or otherwise constrained by its owner, so a staged rollout is not
available. The expected outcome evidences that channel limitation and makes its consequences explicit; an
unstaged rollout treated as normal is the failure.

#### Checklist

- [ ] DTRLSE-CK-PERFORMANCE-02-01 — Every departure from staged rollout evidences the offline, private, manual, or owner-constrained channel limitation behind it.
- [ ] DTRLSE-CK-PERFORMANCE-02-02 — Every departure from staged rollout states its support, monitoring, and forward-fix consequences.

## Aesthetics

### DTRLSE-SC-AESTHETICS-01 — Poor quality: the release states collapse into one word

The record says the build is released, shipped, or done, so a reader cannot tell whether it is packaged,
installed, signed, rehearsed, ready, authorized, or published. The expected outcome keeps each state named
and distinct; a summary that reads cleanly but hides which state was reached is the failure.

#### Checklist

- [ ] DTRLSE-CK-AESTHETICS-01-01 — Development, packaged, installed, signed or notarized, update-rehearsed, release-ready, release-authorized, and post-release claims are kept distinct in the record.
- [ ] DTRLSE-CK-AESTHETICS-01-02 — No summary word stands for a release state the evidence does not establish.

### DTRLSE-SC-AESTHETICS-02 — Adversarial: a complete state list hides missing proof

The record lists every expected state name, but the names are not tied to state-specific evidence. The
expected outcome supports each claimed state independently; a cosmetically complete list used to hide an
unproved state is the failure.

#### Checklist

- [ ] DTRLSE-CK-AESTHETICS-02-01 — Every claimed state is backed by evidence for that exact state rather than by the presence of its name in a complete-looking list.

## Usage

### DTRLSE-SC-USAGE-01 — Expected failure: an incompatible version meets data it cannot use

A person runs a release against data written by a version it does not support. The expected outcome is an
explicit refusal that preserves recoverable data; silently rewriting, discarding, or partially reading that
data is the failure.

#### Checklist

- [ ] DTRLSE-CK-USAGE-01-01 — An incompatible version refuses explicitly rather than proceeding on data it does not support.
- [ ] DTRLSE-CK-USAGE-01-02 — That refusal preserves the affected data in a recoverable state.
- [ ] DTRLSE-CK-USAGE-01-03 — Protected-secret storage fails closed when its required protection is unavailable or degraded.

### DTRLSE-SC-USAGE-02 — Normal case: a person on a supported release can find help and a way forward

Something goes wrong after installation, and the person needs to know whether their version is still
supported and where to turn. The expected outcome states the supported-version window, the recovery limits,
and the forward-fix route; a release whose support boundary is undocumented is the failure.

#### Checklist

- [ ] DTRLSE-CK-USAGE-02-01 — The supported-version window is stated so a person can tell whether their release is inside it.
- [ ] DTRLSE-CK-USAGE-02-02 — The recovery limits are stated explicitly rather than implied by the absence of a limitation.

## Consistency

### DTRLSE-SC-CONSISTENCY-01 — Normal case: rehearsal covers the paths that actually differ

An update is about to be supported from earlier installed releases. The expected outcome rehearses from the
immediate predecessor plus every supported predecessor whose migration, updater, data, or packaging path
differs materially, using realistic data; a rehearsal from the newest predecessor alone is the failure.

#### Checklist

- [ ] DTRLSE-CK-CONSISTENCY-01-01 — Updates are rehearsed from previously released installed artifacts with realistic data, covering the immediate predecessor, each materially different supported path, and interruption recovery.
- [ ] DTRLSE-CK-CONSISTENCY-01-02 — The predecessor sample is expanded where telemetry, support history, installed-version distribution, or migration branches show another path carries distinct risk.

### DTRLSE-SC-CONSISTENCY-02 — Rule violation: one target's evidence stands in for another's obligation

Signing, notarization, store or package-manager, updater or feed, entitlement or permission, and support
obligations differ per target, and one target's completed work is used to cover another. The expected outcome
resolves each obligation from its own live owner; an inferred obligation is the failure.

#### Checklist

- [ ] DTRLSE-CK-CONSISTENCY-02-01 — Each target's signing, notarization, store or package-manager, updater or feed, entitlement or permission, and support obligations are resolved from that target's live owner.
- [ ] DTRLSE-CK-CONSISTENCY-02-02 — Every unproved or unavailable obligation limits or removes its own target claim rather than being covered by another target's evidence.

## Risk

### DTRLSE-SC-RISK-01 — Normal case: every outward action waits for explicit authority

The artifacts are ready and an outward action is the next step. The expected outcome takes each such action
only on explicit user authority at that point; acting on a general approval given earlier is the failure.

#### Checklist

- [ ] DTRLSE-CK-RISK-01-01 — No installer, update, or store release is published without explicit user authority at that point of action.
- [ ] DTRLSE-CK-RISK-01-02 — No signing identity or provider is changed without explicit user authority at that point of action.
- [ ] DTRLSE-CK-RISK-01-03 — No live feed or channel is mutated without explicit user authority at that point of action.
- [ ] DTRLSE-CK-RISK-01-04 — No rollout is widened without explicit user authority at that point of action.
- [ ] DTRLSE-CK-RISK-01-05 — Release readiness is recorded as separate from release authority.

### DTRLSE-SC-RISK-02 — Edge case: a faulty release is already on people's machines

A defect is found after distribution, and some machines have installed it. The expected outcome is a forward
fix unless rollback is proven to preserve user state, reach the affected machines, and stay inside the
supported-version promise; treating rollback as the default remedy is the failure.

#### Checklist

- [ ] DTRLSE-CK-RISK-02-01 — A forward fix is chosen for machines that may already have installed the faulty release.
- [ ] DTRLSE-CK-RISK-02-02 — Rollback is chosen only where target-specific distribution mechanics and data or schema compatibility prove it preserves user state, reaches the affected machines, and stays inside the supported-version promise.
- [ ] DTRLSE-CK-RISK-02-03 — Recovery for installed machines works through a later compatible release or an explicitly proven safe rollback.

### DTRLSE-SC-RISK-03 — Adversarial: withdrawal presented as the remedy

Distribution is halted and the release is described as contained, while the machines that already installed
it are unchanged. The expected outcome states what withdrawal does and does not reach; containment claimed
for machines beyond reach is the failure.

#### Checklist

- [ ] DTRLSE-CK-RISK-03-01 — No halt or withdrawal of distribution is claimed to protect machines that have already installed the release.
- [ ] DTRLSE-CK-RISK-03-02 — Every containment claim names the population it actually reaches.

### DTRLSE-SC-RISK-04 — Rule violation: readiness is treated as authority or publication proof

The application is release-ready, so an outward action is taken or the application is described as published
or deployed. The expected outcome keeps readiness, action authority, and verified publication or deployment
separate; using readiness to prove either later state is the failure.

#### Checklist

- [ ] DTRLSE-CK-RISK-04-01 — Release readiness is not treated as authority for signing, notarization, credential use, publication, deployment, promotion, feed, store, channel, signing-provider mutation, rollout widening, rollback, or Forward fix action.
- [ ] DTRLSE-CK-RISK-04-02 — A published or deployed claim is supported by evidence from the exact destination and resulting bytes rather than by readiness or a successful upload alone.

### DTRLSE-SC-RISK-05 — Adversarial: earlier authority is stretched to a different action

An earlier approval is general, expired, or narrower than the next action, but it is reused because the
artifact and target have not changed. The expected outcome requires current authority that matches the exact
action and target; similarity to the approved action is the failure.

#### Checklist

- [ ] DTRLSE-CK-RISK-05-01 — Each action involving signing, notarization, credential use, publication, deployment, promotion, feed, store, channel, signing-provider mutation, rollout widening, rollback, or Forward fix has unexpired point-of-action authority matching its exact action and target.

### DTRLSE-SC-RISK-06 — Expected failure: rollback lacks reach or compatibility proof

An older artifact is available, but its distribution path cannot reach every affected machine or its state
compatibility is incomplete. The expected outcome rejects rollback and retains another exact safe recovery;
availability of the older artifact presented as rollback safety is the failure.

#### Checklist

- [ ] DTRLSE-CK-RISK-06-01 — Rollback is rejected unless target-specific distribution evidence proves that it reaches the affected installed versions.
- [ ] DTRLSE-CK-RISK-06-02 — Rollback is rejected unless data, schema, settings, and native integration compatibility prove it safe for the affected installed versions.

### DTRLSE-SC-RISK-07 — Normal case: a Forward fix corrects an installed faulty version

A faulty version is already installed and rollback is not proved safe. The expected outcome uses a later
compatible version to correct those installed applications; a distribution-only change presented as the
Forward fix is the failure.

#### Checklist

- [ ] DTRLSE-CK-RISK-07-01 — The Forward fix uses a later compatible release to correct a faulty version already installed on user machines.

## Overall

### DTRLSE-SC-OVERALL-01 — Normal case: the promise is no larger than its evidence

The release states what it supports. The expected outcome is a narrow claim backed by direct evidence for
each retained target and state; a broad claim resting on inferred coverage is the failure, even when the
inference is reasonable.

#### Checklist

- [ ] DTRLSE-CK-OVERALL-01-01 — Every retained support claim rests on direct evidence rather than inferred coverage.
- [ ] DTRLSE-CK-OVERALL-01-02 — Every target, predecessor, channel, and rollout retained is justified by its continuing user need and cost.
- [ ] DTRLSE-CK-OVERALL-01-03 — Every exact-artifact target evidence row verifies its named data fixtures, packaged resources, writable data, native dependencies, protocol identities, and permissions.

### DTRLSE-SC-OVERALL-02 — Adversarial: a rehearsal shaped to pass

The update rehearsal ran against an empty profile, a freshly installed predecessor, or a build produced
outside the required environment, and its result is offered as proof. The expected outcome rehearses the real
transition with realistic data from a previously released artifact; a rehearsal arranged to succeed is the
failure.

#### Checklist

- [ ] DTRLSE-CK-OVERALL-02-01 — Every rehearsal starts from a previously released installed artifact rather than a locally produced stand-in.
- [ ] DTRLSE-CK-OVERALL-02-02 — Every rehearsal uses data representative of what real installations hold.
- [ ] DTRLSE-CK-OVERALL-02-03 — Every unavailable predecessor leaves its transition unproved and outside the supported claim rather than assumed to behave like a proved one.
