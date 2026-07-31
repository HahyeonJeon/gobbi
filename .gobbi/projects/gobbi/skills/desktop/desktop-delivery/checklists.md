# Desktop Delivery Evaluation Checklist

## Project

### DELIVERY-SC-PROJECT-01 — Normal case: Bounded installed outcome

A coordinated delivery claims one installed outcome. It succeeds only when the claim, boundary, stack decision, and authority are explicit.
#### Checklist

- [ ] DELIVERY-CK-PROJECT-01-01 — This operation has an applicable Desktop delivery trigger.
- [ ] DELIVERY-CK-PROJECT-01-02 — Every bounded single-owner request is handed to that owner.
- [ ] DELIVERY-CK-PROJECT-01-03 — Every affected actor is named.
- [ ] DELIVERY-CK-PROJECT-01-04 — Every supported entry mode is named.
- [ ] DELIVERY-CK-PROJECT-01-05 — Observable completion is explicit.
- [ ] DELIVERY-CK-PROJECT-01-06 — System completion is explicit.
- [ ] DELIVERY-CK-PROJECT-01-07 — The data boundary is explicit.
- [ ] DELIVERY-CK-PROJECT-01-08 — Every failure path is explicit.
- [ ] DELIVERY-CK-PROJECT-01-09 — Every recovery path is explicit.
- [ ] DELIVERY-CK-PROJECT-01-10 — The support route is explicit.
- [ ] DELIVERY-CK-PROJECT-01-11 — Every claimed operating system is explicit.
- [ ] DELIVERY-CK-PROJECT-01-12 — Every claimed architecture is explicit.
- [ ] DELIVERY-CK-PROJECT-01-13 — Every claimed target is required by current user need.
- [ ] DELIVERY-CK-PROJECT-01-14 — The non-goals are explicit.
- [ ] DELIVERY-CK-PROJECT-01-15 — Publication authority is explicit.
- [ ] DELIVERY-CK-PROJECT-01-16 — The claim limitations are explicit.
- [ ] DELIVERY-CK-PROJECT-01-17 — The accepted stack is preserved unless current evidence challenges it.
- [ ] DELIVERY-CK-PROJECT-01-18 — Every challenged stack choice is evidence-backed.
- [ ] DELIVERY-CK-PROJECT-01-19 — Every material stack conflict has an explicit user decision.
- [ ] DELIVERY-CK-PROJECT-01-20 — A missing target proof narrows the target claim.
## Structure

### DELIVERY-SC-STRUCTURE-01 — Rule violation: Bypassed owner or incomplete slice

The delivery bypasses a capability owner or lets one delivery surface drift. It succeeds only when ownership, Electron routing, and slice synchronization remain explicit.
#### Checklist

- [ ] DELIVERY-CK-STRUCTURE-01-01 — Every in-scope obligation has one owner.
- [ ] DELIVERY-CK-STRUCTURE-01-02 — Every implementation unit has explicit process placement.
- [ ] DELIVERY-CK-STRUCTURE-01-03 — Every implementation unit has one capability owner.
- [ ] DELIVERY-CK-STRUCTURE-01-04 — Every Desktop decision comes from its applicable Desktop child.
- [ ] DELIVERY-CK-STRUCTURE-01-05 — Every Electron mechanism is routed to every applicable Electron child.
- [ ] DELIVERY-CK-STRUCTURE-01-06 — Every Electron-specific requirement has truthful evidence from `electron-test`.
- [ ] DELIVERY-CK-STRUCTURE-01-07 — Every packaged Electron mechanism claim has exact-target evidence from `electron-release`.
- [ ] DELIVERY-CK-STRUCTURE-01-08 — No Electron result from another target substitutes for the claimed target.
- [ ] DELIVERY-CK-STRUCTURE-01-09 — No Electron result from another evidence class substitutes for the claimed evidence class.
- [ ] DELIVERY-CK-STRUCTURE-01-10 — No Electron mechanism changes an accepted product requirement.
- [ ] DELIVERY-CK-STRUCTURE-01-11 — No Electron mechanism changes user authority.
- [ ] DELIVERY-CK-STRUCTURE-01-12 — Every completed slice keeps its code current.
- [ ] DELIVERY-CK-STRUCTURE-01-13 — Every completed slice keeps its configuration current.
- [ ] DELIVERY-CK-STRUCTURE-01-14 — Every completed slice keeps its types current.
- [ ] DELIVERY-CK-STRUCTURE-01-15 — Every completed slice keeps its tests current.
- [ ] DELIVERY-CK-STRUCTURE-01-16 — Every completed slice keeps its documentation current.
- [ ] DELIVERY-CK-STRUCTURE-01-17 — Every completed slice keeps its persistent-data behavior current.
- [ ] DELIVERY-CK-STRUCTURE-01-18 — Every completed slice keeps its package inputs current.
- [ ] DELIVERY-CK-STRUCTURE-01-19 — Every completed slice keeps its operational evidence current.
- [ ] DELIVERY-CK-STRUCTURE-01-20 — Every user-visible capability has no deferred layer.
## Performance

### DELIVERY-SC-PERFORMANCE-01 — Poor quality: Functional but unresponsive

The installed outcome functions under light use but stalls or retains resources under representative work. It succeeds only when installed performance and resource behavior are bounded.
#### Checklist

- [ ] DELIVERY-CK-PERFORMANCE-01-01 — The installed application remains responsive during representative work.
- [ ] DELIVERY-CK-PERFORMANCE-01-02 — Every installed performance claim is measured.
- [ ] DELIVERY-CK-PERFORMANCE-01-03 — Every installed resource claim is measured.
- [ ] DELIVERY-CK-PERFORMANCE-01-04 — Every owned resource has an explicit bounded lifetime.
## Aesthetics

### DELIVERY-SC-AESTHETICS-01 — Poor quality: Installed experience drift

The installed application works but no longer expresses the accepted experience. It succeeds only when observable presentation and adaptation remain faithful on each target.
#### Checklist

- [ ] DELIVERY-CK-AESTHETICS-01-01 — Installed first paint preserves the accepted design.
- [ ] DELIVERY-CK-AESTHETICS-01-02 — Every accepted observable state is preserved.
- [ ] DELIVERY-CK-AESTHETICS-01-03 — Every accepted accessibility obligation is preserved.
- [ ] DELIVERY-CK-AESTHETICS-01-04 — Reduced-motion behavior preserves the accepted contract.
- [ ] DELIVERY-CK-AESTHETICS-01-05 — Touched native behavior is coherent on its claimed target.
## Usage

### DELIVERY-SC-USAGE-01 — Normal case: Complete installed use

A person installs and uses the outcome through its supported platform paths. It succeeds only when installed actions, platform behavior, native effects, and local data remain usable.
#### Checklist

- [ ] DELIVERY-CK-USAGE-01-01 — A clean installation completes on every claimed operating system.
- [ ] DELIVERY-CK-USAGE-01-02 — The intended installed application launches.
- [ ] DELIVERY-CK-USAGE-01-03 — Every supported entry mode completes on each claimed operating system.
- [ ] DELIVERY-CK-USAGE-01-04 — Every entry mode preserves its input.
- [ ] DELIVERY-CK-USAGE-01-05 — Every required action remains available.
- [ ] DELIVERY-CK-USAGE-01-06 — Exit remains usable.
- [ ] DELIVERY-CK-USAGE-01-07 — Relaunch remains usable.
- [ ] DELIVERY-CK-USAGE-01-08 — Every lifecycle transition returns to its declared usable state on each claimed operating system.
- [ ] DELIVERY-CK-USAGE-01-09 — Every required action is operable by keyboard alone.
- [ ] DELIVERY-CK-USAGE-01-10 — Every accepted assistive-technology path completes.
- [ ] DELIVERY-CK-USAGE-01-11 — Every claimed operating system has observable window behavior.
- [ ] DELIVERY-CK-USAGE-01-12 — Every supported update path is observable on each claimed operating system.
- [ ] DELIVERY-CK-USAGE-01-13 — Every supported recovery is observable on each claimed operating system.
- [ ] DELIVERY-CK-USAGE-01-14 — Every target-specific platform difference is explicit.
- [ ] DELIVERY-CK-USAGE-01-15 — Every supported native operation has an observable authoritative effect on its claimed operating system.
- [ ] DELIVERY-CK-USAGE-01-16 — Every native operation has an observable failure signal.
- [ ] DELIVERY-CK-USAGE-01-17 — Every cancellable native operation has a verified cancellation path.
- [ ] DELIVERY-CK-USAGE-01-18 — Every activation path handles duplicate activation.
- [ ] DELIVERY-CK-USAGE-01-19 — Every owned platform resource is disposed when its scope ends.
- [ ] DELIVERY-CK-USAGE-01-20 — Every unavailable native capability has an observable outcome.
- [ ] DELIVERY-CK-USAGE-01-21 — Every native integration has an accessible alternative.
- [ ] DELIVERY-CK-USAGE-01-22 — Local-data creation behavior is defined.
- [ ] DELIVERY-CK-USAGE-01-23 — Local-data read behavior is defined.
- [ ] DELIVERY-CK-USAGE-01-24 — Local-data update behavior is defined.
- [ ] DELIVERY-CK-USAGE-01-25 — Local-data deletion behavior is defined.
- [ ] DELIVERY-CK-USAGE-01-26 — Every local datum has an installed location.
- [ ] DELIVERY-CK-USAGE-01-27 — Every local datum has a retention rule.
- [ ] DELIVERY-CK-USAGE-01-28 — Every exportable local datum has an export path.
- [ ] DELIVERY-CK-USAGE-01-29 — Every retained local datum has a backup decision.
- [ ] DELIVERY-CK-USAGE-01-30 — Every recoverable local datum has a recovery path.
- [ ] DELIVERY-CK-USAGE-01-31 — Every non-native platform convention is required by current user need.
- [ ] DELIVERY-CK-USAGE-01-32 — Every non-native platform convention is discoverable.
- [ ] DELIVERY-CK-USAGE-01-33 — Every claimed operating system has observable local-data behavior.
## Consistency

### DELIVERY-SC-CONSISTENCY-01 — Edge case: Cross-artifact identity

A target sits between source, package, installed state, update metadata, and evidence. It succeeds only when each surface identifies the same bounded release claim.
#### Checklist

- [ ] DELIVERY-CK-CONSISTENCY-01-01 — The source version matches the claimed application version.
- [ ] DELIVERY-CK-CONSISTENCY-01-02 — The configuration version matches the claimed application version.
- [ ] DELIVERY-CK-CONSISTENCY-01-03 — The package version matches the claimed application version.
- [ ] DELIVERY-CK-CONSISTENCY-01-04 — The installed version matches the claimed application version.
- [ ] DELIVERY-CK-CONSISTENCY-01-05 — The update metadata version matches the claimed application version.
- [ ] DELIVERY-CK-CONSISTENCY-01-06 — The evidenced artifact matches the claimed artifact.
- [ ] DELIVERY-CK-CONSISTENCY-01-07 — The evidenced limitations match the claimed limitations.
- [ ] DELIVERY-CK-CONSISTENCY-01-08 — The claimed delivery state is explicit.
- [ ] DELIVERY-CK-CONSISTENCY-01-09 — The claimed release channel is explicit.
- [ ] DELIVERY-CK-CONSISTENCY-01-10 — The claimed release environment is explicit.
- [ ] DELIVERY-CK-CONSISTENCY-01-11 — The claimed evidence class is explicit.
## Risk

### DELIVERY-SC-RISK-01 — Expected failure: Data, update, or release control failure

Stored data, an update, or release control fails. The expected outcome is recoverable data, a bounded release claim, and no unauthorized external effect.
#### Checklist

- [ ] DELIVERY-CK-RISK-01-01 — An interrupted write preserves recoverable data.
- [ ] DELIVERY-CK-RISK-01-02 — An incompatible data version fails explicitly.
- [ ] DELIVERY-CK-RISK-01-03 — Recovery remains available for an incompatible data version.
- [ ] DELIVERY-CK-RISK-01-04 — Corrupt stored data enters the declared recovery path.
- [ ] DELIVERY-CK-RISK-01-05 — Corrupt stored data causes no silent data loss.
- [ ] DELIVERY-CK-RISK-01-06 — A failed migration preserves recoverable data.
- [ ] DELIVERY-CK-RISK-01-07 — An interrupted migration preserves recoverable data.
- [ ] DELIVERY-CK-RISK-01-08 — Every persistent write is atomic or detectably incomplete.
- [ ] DELIVERY-CK-RISK-01-09 — Every persisted structure has an explicit schema version.
- [ ] DELIVERY-CK-RISK-01-10 — Secret persistence fails closed when its required protection is unavailable.
- [ ] DELIVERY-CK-RISK-01-11 — Persisted-data forward compatibility or explicit refusal is defined.
- [ ] DELIVERY-CK-RISK-01-12 — Downgrade behavior is defined whenever persisted data changes.
- [ ] DELIVERY-CK-RISK-01-13 — Round-trip behavior is defined whenever persisted data changes.
- [ ] DELIVERY-CK-RISK-01-14 — Recovery remains available to users on a supported older release.
- [ ] DELIVERY-CK-RISK-01-15 — An update cannot race with a live write into partially migrated data.
- [ ] DELIVERY-CK-RISK-01-16 — A failed update preserves a usable application.
- [ ] DELIVERY-CK-RISK-01-17 — A failed update preserves recoverable data.
- [ ] DELIVERY-CK-RISK-01-18 — The immediate predecessor transition is rehearsed.
- [ ] DELIVERY-CK-RISK-01-19 — Every materially different supported predecessor transition is rehearsed.
- [ ] DELIVERY-CK-RISK-01-20 — Every predecessor rehearsal starts from its corresponding installed release.
- [ ] DELIVERY-CK-RISK-01-21 — Every predecessor rehearsal uses realistic data.
- [ ] DELIVERY-CK-RISK-01-22 — Every predecessor rehearsal covers interruption recovery.
- [ ] DELIVERY-CK-RISK-01-23 — Persisted-data schema evolution is additive by default.
- [ ] DELIVERY-CK-RISK-01-24 — Every risky migration uses copy-on-upgrade.
- [ ] DELIVERY-CK-RISK-01-25 — Every evolution-policy departure cites a measured constraint.
- [ ] DELIVERY-CK-RISK-01-26 — Every target-specific release obligation has a current live owner.
- [ ] DELIVERY-CK-RISK-01-27 — Machines already on a faulty release have a forward-fix path.
- [ ] DELIVERY-CK-RISK-01-28 — The supported-version window is explicit.
- [ ] DELIVERY-CK-RISK-01-29 — Rollout monitoring is defined.
- [ ] DELIVERY-CK-RISK-01-30 — Rollout stop conditions are explicit.
- [ ] DELIVERY-CK-RISK-01-31 — Release recovery limits are explicit.
- [ ] DELIVERY-CK-RISK-01-32 — Recovery covers installed releases that distribution withdrawal cannot recall.
- [ ] DELIVERY-CK-RISK-01-33 — Every channel with controlled audience growth uses staged rollout.
- [ ] DELIVERY-CK-RISK-01-34 — Every staged-rollout departure cites a channel constraint.
- [ ] DELIVERY-CK-RISK-01-35 — Rollback evidence proves affected installed machines are reachable.
- [ ] DELIVERY-CK-RISK-01-36 — Rollback evidence proves persisted user data remains safe.
- [ ] DELIVERY-CK-RISK-01-37 — Rollback evidence proves schema compatibility.
- [ ] DELIVERY-CK-RISK-01-38 — Missing authority blocks installer publication.
- [ ] DELIVERY-CK-RISK-01-39 — Missing authority blocks update publication.
- [ ] DELIVERY-CK-RISK-01-40 — Missing authority blocks store release.
- [ ] DELIVERY-CK-RISK-01-41 — Missing authority blocks signing-identity mutation.
- [ ] DELIVERY-CK-RISK-01-42 — Missing authority blocks signing-provider mutation.
- [ ] DELIVERY-CK-RISK-01-43 — Missing authority blocks live-feed mutation.
- [ ] DELIVERY-CK-RISK-01-44 — Missing authority blocks channel mutation.
- [ ] DELIVERY-CK-RISK-01-45 — Missing authority blocks rollout mutation.
## Overall

### DELIVERY-SC-OVERALL-01 — Adversarial: Cosmetic release readiness

A complete-looking handoff substitutes labels or inventories for an observed installed outcome. It succeeds only when a cold operator can reproduce the bounded claim.
#### Checklist

- [ ] DELIVERY-CK-OVERALL-01-01 — A cold operator can reproduce the release-ready state.
- [ ] DELIVERY-CK-OVERALL-01-02 — No delivery claim exceeds its evidence.
- [ ] DELIVERY-CK-OVERALL-01-03 — Every assistive-technology claim names its directly exercised technology.
- [ ] DELIVERY-CK-OVERALL-01-04 — Every assistive-technology claim names its directly exercised target.
- [ ] DELIVERY-CK-OVERALL-01-05 — No inventory substitutes for an observed installed outcome.
