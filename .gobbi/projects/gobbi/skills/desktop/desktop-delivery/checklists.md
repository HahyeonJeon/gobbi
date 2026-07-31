# Desktop Delivery Evaluation Checklist

## Project

### DELIVERY-SC-PROJECT-01 — Normal case: Bounded installed outcome

One coordinated delivery claims a complete installed outcome within an explicit boundary. The scenario breaks when the outcome, target claim, or installed completion cannot be identified without private context.
#### Checklist

- [ ] DELIVERY-CK-PROJECT-01-01 — The delivered outcome is explicit.
- [ ] DELIVERY-CK-PROJECT-01-02 — Every claimed operating-system and architecture pair has proof from its matching exact installed artifact.
- [ ] DELIVERY-CK-PROJECT-01-04 — The non-goals are explicit.
### DELIVERY-SC-PROJECT-02 — Rule violation: Incomplete or unauthorized claim

The delivery appears complete while an in-scope path is absent or a claim exceeds its proof or authority. The scenario breaks unless all scope is closed and unsupported claims or actions remain blocked.
#### Checklist

- [ ] DELIVERY-CK-PROJECT-02-01 — Every in-scope path is complete.
- [ ] DELIVERY-CK-PROJECT-02-02 — No delivery claim exceeds its proof.
- [ ] DELIVERY-CK-PROJECT-02-06 — This operation is used only for multi-capability coordination or a complete installed, packaged, or release-ready claim.
- [ ] DELIVERY-CK-PROJECT-02-07 — Every bounded single-owner request is handed directly to that owner.
- [ ] DELIVERY-CK-PROJECT-02-08 — The accepted stack is preserved unless current evidence materially challenges it.
- [ ] DELIVERY-CK-PROJECT-02-09 — Every challenged stack decision has a complete evidence matrix covering resource and package cost, content trust, native depth, target and update fit, team upgrade capacity, migration cost, and release needs.
- [ ] DELIVERY-CK-PROJECT-02-10 — Every material stack conflict is resolved through an explicit user decision.
## Structure

### DELIVERY-SC-STRUCTURE-01 — Normal case: Explicit ownership

The application contract assigns runtime placement and authority before slices are built. The scenario breaks when a unit, bridge capability, or persistent-data responsibility has ambiguous ownership.
#### Checklist

- [ ] DELIVERY-CK-STRUCTURE-01-01 — Each implementation unit has explicit process placement.
- [ ] DELIVERY-CK-STRUCTURE-01-03 — Each implementation unit has one explicit capability owner.
- [ ] DELIVERY-CK-STRUCTURE-01-04 — Persistent data has one explicit owner.
- [ ] DELIVERY-CK-STRUCTURE-01-05 — Every Electron implementation unit declares its owning target.
- [ ] DELIVERY-CK-STRUCTURE-01-06 — Main, preload, renderer, and every utility process each have a separate build result.
- [ ] DELIVERY-CK-STRUCTURE-01-07 — Every typed process target has a separate type environment.
- [ ] DELIVERY-CK-STRUCTURE-01-08 — Every typed process target has a separate type-check result.
### DELIVERY-SC-STRUCTURE-02 — Adversarial: Privilege-boundary bypass

Renderer content attempts to reach machine authority outside the reviewed contract. The scenario breaks if a broad bridge or an unproved caller can produce a privileged effect.
#### Checklist

- [ ] DELIVERY-CK-STRUCTURE-02-01 — The renderer has no path around the declared narrow bridge.
- [ ] DELIVERY-CK-STRUCTURE-02-02 — Every privileged effect requires an allowed caller.
- [ ] DELIVERY-CK-STRUCTURE-02-03 — Every privileged effect requires a valid payload.
## Performance

### DELIVERY-SC-PERFORMANCE-01 — Poor quality: Functional but unresponsive

The outcome functions under light use while representative work stalls the application or exceeds an installed resource claim. The scenario breaks when responsiveness or resource use rests on assumption.
#### Checklist

- [ ] DELIVERY-CK-PERFORMANCE-01-01 — The main process remains responsive during representative work.
- [ ] DELIVERY-CK-PERFORMANCE-01-02 — Every installed performance claim is measured under its declared conditions.
- [ ] DELIVERY-CK-PERFORMANCE-01-03 — Every installed resource claim is measured under its declared conditions.
## Aesthetics

### DELIVERY-SC-AESTHETICS-01 — Poor quality: Packaged experience drift

The packaged application works but its first paint, assets, states, or touched native behavior no longer express the accepted design. The scenario breaks on visible packaged drift or target-incoherent behavior.
#### Checklist

- [ ] DELIVERY-CK-AESTHETICS-01-01 — Packaged first paint preserves the accepted design.
- [ ] DELIVERY-CK-AESTHETICS-01-02 — Touched native behavior is coherent on each claimed target.
## Usage

### DELIVERY-SC-USAGE-01 — Normal case: Complete installed use

A person begins from a clean machine and completes the bounded outcome through the supported ways of entering and operating the application. The scenario breaks when installation, operation, relaunch, or support fails.
#### Checklist

- [ ] DELIVERY-CK-USAGE-01-01 — A clean installation completes.
- [ ] DELIVERY-CK-USAGE-01-02 — The outcome is complete through every supported entry mode.
- [ ] DELIVERY-CK-USAGE-01-03 — Exit remains usable.
- [ ] DELIVERY-CK-USAGE-01-04 — The intended installed application launches.
- [ ] DELIVERY-CK-USAGE-01-06 — Relaunch remains usable.
### DELIVERY-SC-USAGE-02 — Expected failure: Data or version incompatibility

The installed application encounters interrupted, corrupt, migrated, or newer-version data. The expected outcome is preservation or explicit recovery rather than plausible corruption or silent data loss.
#### Checklist

- [ ] DELIVERY-CK-USAGE-02-01 — An interrupted write preserves data or enters the declared recovery path.
- [ ] DELIVERY-CK-USAGE-02-02 — An incompatible data version fails explicitly.
- [ ] DELIVERY-CK-USAGE-02-03 — Corrupt stored data enters the declared recovery path.
- [ ] DELIVERY-CK-USAGE-02-04 — Corrupt stored data causes no silent data loss.
- [ ] DELIVERY-CK-USAGE-02-05 — A failed migration preserves data or enters the declared recovery path.
- [ ] DELIVERY-CK-USAGE-02-06 — An interrupted migration preserves data or enters the declared recovery path.
- [ ] DELIVERY-CK-USAGE-02-07 — Recovery remains available for an incompatible data version.
- [ ] DELIVERY-CK-USAGE-02-08 — The immediate predecessor transition is rehearsed.
- [ ] DELIVERY-CK-USAGE-02-09 — Every materially different supported predecessor transition is rehearsed.
- [ ] DELIVERY-CK-USAGE-02-10 — Every persistent write is atomic or detectably incomplete.
- [ ] DELIVERY-CK-USAGE-02-11 — Every persisted structure has an explicit schema version.
- [ ] DELIVERY-CK-USAGE-02-12 — Every required predecessor rehearsal begins from its corresponding previously released installed artifact.
- [ ] DELIVERY-CK-USAGE-02-13 — Every required predecessor rehearsal uses realistic data.
- [ ] DELIVERY-CK-USAGE-02-14 — Persisted-data forward compatibility or explicit refusal is defined.
- [ ] DELIVERY-CK-USAGE-02-15 — Downgrade behavior is defined whenever persisted data changes.
- [ ] DELIVERY-CK-USAGE-02-16 — Round-trip behavior is defined whenever persisted data changes.
## Consistency

### DELIVERY-SC-CONSISTENCY-01 — Edge case: Cross-artifact identity

A target sits at the boundary between source, package, installed state, data schema, and update metadata. The scenario breaks when any surface describes a different release, target, artifact, or limitation.
#### Checklist

- [ ] DELIVERY-CK-CONSISTENCY-01-01 — Source, configuration, and package identify the same version.
- [ ] DELIVERY-CK-CONSISTENCY-01-09 — The selected Electron version is explicit for every platform decision.
- [ ] DELIVERY-CK-CONSISTENCY-01-10 — Every intervening Electron breaking change is reviewed for an upgrade.
## Risk

### DELIVERY-SC-RISK-01 — Adversarial: Renderer and external-input abuse

A compromised renderer or hostile external input attempts to widen authority through process configuration, the bridge, IPC, navigation, windows, URLs, or protocols. The scenario breaks if any path fails open.
#### Checklist

- [ ] DELIVERY-CK-RISK-01-01 — Renderer privilege settings preserve the declared isolated posture.
- [ ] DELIVERY-CK-RISK-01-02 — The bridge exposes no Electron objects.
- [ ] DELIVERY-CK-RISK-01-03 — IPC captures the sender synchronously before the first asynchronous boundary.
- [ ] DELIVERY-CK-RISK-01-04 — Every content-loading session enforces its exact permission allowlist.
- [ ] DELIVERY-CK-RISK-01-05 — Renderer privilege settings preserve the declared sandboxed posture.
- [ ] DELIVERY-CK-RISK-01-06 — The bridge exposes no internal events.
- [ ] DELIVERY-CK-RISK-01-07 — IPC denies a missing sender frame before the effect.
- [ ] DELIVERY-CK-RISK-01-08 — Every `webContents` enforces an exact frame-aware navigation allowlist.
- [ ] DELIVERY-CK-RISK-01-09 — Every `webContents` enforces an exact new-window allowlist.
- [ ] DELIVERY-CK-RISK-01-10 — External-target decisions use exact allowlists.
- [ ] DELIVERY-CK-RISK-01-11 — Protocol decisions use exact allowlists.
- [ ] DELIVERY-CK-RISK-01-12 — Every `webContents` enforces an exact frame-aware redirect allowlist.
- [ ] DELIVERY-CK-RISK-01-13 — IPC denies a detached sender frame before the effect.
- [ ] DELIVERY-CK-RISK-01-14 — Every renderer keeps Node integration off.
- [ ] DELIVERY-CK-RISK-01-15 — Every renderer enforces a restrictive Content Security Policy.
- [ ] DELIVERY-CK-RISK-01-16 — Every renderer keeps `webSecurity` enabled.
- [ ] DELIVERY-CK-RISK-01-17 — Every renderer keeps insecure-content execution disabled.
- [ ] DELIVERY-CK-RISK-01-18 — Every exact installed artifact has verified packaged-resource evidence.
- [ ] DELIVERY-CK-RISK-01-19 — Every exact installed artifact has verified native-module evidence.
- [ ] DELIVERY-CK-RISK-01-20 — Every exact installed artifact has verified fuse posture.
- [ ] DELIVERY-CK-RISK-01-21 — Every exact installed artifact has no development-only URL or path literal.
- [ ] DELIVERY-CK-RISK-01-22 — Every exact installed artifact has no bundled credential.
- [ ] DELIVERY-CK-RISK-01-23 — Every exact installed artifact has verified signing state when the target requires it.
### DELIVERY-SC-RISK-02 — Expected failure: Release control failure

Secret protection, update recovery, artifact integrity, or release authority is unavailable. The expected outcome is fail-closed preservation and a blocked release claim rather than degraded security or publication.
#### Checklist

- [ ] DELIVERY-CK-RISK-02-01 — Secret persistence fails closed when its required protection is unavailable.
- [ ] DELIVERY-CK-RISK-02-02 — A failed update preserves a usable application or enters the declared recovery path.
- [ ] DELIVERY-CK-RISK-02-03 — Invalid integrity evidence blocks release.
- [ ] DELIVERY-CK-RISK-02-04 — A failed update preserves data or enters the declared recovery path.
- [ ] DELIVERY-CK-RISK-02-05 — Invalid update evidence blocks release.
- [ ] DELIVERY-CK-RISK-02-06 — Missing publication authority blocks release.
- [ ] DELIVERY-CK-RISK-02-07 — Machines already on a faulty release have a forward-fix path to a safe version.
- [ ] DELIVERY-CK-RISK-02-08 — The supported-version window is explicit.
- [ ] DELIVERY-CK-RISK-02-09 — Rollout monitoring is defined.
- [ ] DELIVERY-CK-RISK-02-10 — Rollout stop conditions are explicit.
- [ ] DELIVERY-CK-RISK-02-11 — Recovery accounts for installed releases that distribution withdrawal cannot recall.
- [ ] DELIVERY-CK-RISK-02-12 — Each target's live-owner obligation matrix has no unresolved notarization, store or package-manager, updater, feed, entitlement, permission, or support entry.
- [ ] DELIVERY-CK-RISK-02-13 — Every channel that supports controlled audience growth uses staged rollout.
- [ ] DELIVERY-CK-RISK-02-14 — Every departure from staged rollout has evidence of a channel constraint.
- [ ] DELIVERY-CK-RISK-02-15 — Rollback evidence proves affected installed machines are reachable.
- [ ] DELIVERY-CK-RISK-02-16 — Rollback evidence proves persisted user data remains safe.
- [ ] DELIVERY-CK-RISK-02-17 — Rollback evidence proves schema compatibility.
## Overall

### DELIVERY-SC-OVERALL-01 — Adversarial: Cosmetic release readiness

A complete-looking handoff attempts to substitute inventories and labels for reproducible readiness. The scenario breaks unless a cold operator can reproduce the claim boundaries and the authorized stopping point.
#### Checklist

- [ ] DELIVERY-CK-OVERALL-01-01 — A cold operator can reproduce the release-ready state from the handoff.
- [ ] DELIVERY-CK-OVERALL-01-02 — Evidence-class boundaries remain explicit.
- [ ] DELIVERY-CK-OVERALL-01-03 — Limitations remain explicit.
