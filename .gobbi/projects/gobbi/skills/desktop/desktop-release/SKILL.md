---
name: desktop-release
description: "MUST load when judging target support, artifact and installed evidence, update and data compatibility, recovery, release readiness, rollout controls, or rollback and installed-version correction options for an installable Electron desktop application written in TypeScript."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Desktop Release

Use this skill to judge target support, artifact and installed evidence, compatibility, recovery, readiness,
rollout controls, support, rollback, and publication authority. `Forward fix` means a later compatible release
that corrects a faulty version already installed on user machines. It is separate from rollback, whose reach
and compatibility must be proved.

[`desktop-development`](../desktop-development/SKILL.md) coordinates ordered lifecycle work. The applicable
[`desktop-windows`](../desktop-windows/SKILL.md), [`desktop-macos`](../desktop-macos/SKILL.md), or
[`desktop-linux`](../desktop-linux/SKILL.md) child owns current target facts.

[`electron-release`](../../electron/electron-release/SKILL.md) owns packaging, signing, notarization, update,
and platform release mechanisms, and [`electron-testing`](../../electron/electron-testing/SKILL.md) owns
packaged and installed evidence; this skill owns only release judgments, defaults, exceptions, and authority
boundaries.

## Principles

### Bind claims to exact evidence

A claim is only as broad as the exact application, artifact, target, installed state, and evidence behind it.
Evidence for one build, target, predecessor, or state does not prove another.

### Plan for versions already installed

Stopping distribution cannot change an application already installed on a user's machine. Recovery must use
a later compatible version or a rollback whose reach and compatibility are proved.

### Protect user data across versions

Application data, schemas, settings, native integration state, and protected secrets must survive supported
version changes safely. A smaller migration or recovery burden never justifies corrupting or exposing them.

### Keep support claims narrow

A narrow support claim with direct evidence is stronger than a broad claim inferred from nearby results.
Expand targets, predecessors, channels, and rollout only when current user need and evidence justify the cost.

## Rules

- **MUST bound** every claim to the exact application version and build, artifact and checksum, operating-system
  release and build, application and operating-system architecture, install form, scope, and state, channel and
  environment, signature, notarization, and trust state, and evidence class, and require every exact-artifact
  target evidence row to verify its named data fixtures, packaged resources, writable data, native
  dependencies, protocol identities, and permissions. Resolve Windows facts through `desktop-windows`, macOS
  facts through `desktop-macos`, Linux facts through `desktop-linux`, packaging and release mechanisms through
  `electron-release`, packaged and installed evidence through `electron-testing`, and coordination through
  `desktop-development`; no evidence transfers across an application build, artifact, target, predecessor, or
  state.
- **MUST protect** persisted data, schemas, settings, native integration state, and secrets across supported
  updates and recovery by requiring atomic or detectably incomplete writes, explicit schema versions, forward
  compatibility or explicit refusal, downgrade or round-trip behavior, corruption and interruption recovery,
  and fail-closed secret protection. Rehearse updates from previously released installed artifacts with
  realistic data across the immediate predecessor, every materially different supported path, and interruption
  and recovery; an unavailable predecessor or unproved transition remains outside the support claim.
- **MUST use** `Forward fix` only for a later compatible release that corrects a faulty version already
  installed on user machines. Keep it separate from rollback, and prove the reach and compatibility of each
  option at its owner.
- **MUST keep** packaged, installed, signed or notarized, update-rehearsed, release-ready, current
  point-of-action authority for each named action and target, verified published or deployed, and post-release
  evidence distinct, and require exact destination and resulting-byte evidence for a published or deployed
  claim. Before readiness, require a supported-version window, monitoring, rollout stop conditions, explicit
  recovery limits, and a Forward fix.
- **MUST choose** rollback only when target-specific distribution reach and data, schema, settings, and native
  integration compatibility prove it safe for affected installed versions. Halting or withdrawing
  distribution never repairs a version already installed on a user's machine.
- **NEVER treat** readiness, accepted evaluation, a successful upload, or earlier general approval as current
  authority or proof of publication or deployment. Signing, notarization, credential use, publication,
  deployment, promotion, feed, store, channel, signing-provider mutation, rollout widening, rollback, and
  Forward fix actions each require unexpired point-of-action authority that matches the exact action and target.

## Preferences

### Prefer the narrowest supported target matrix

**PREFER** only the operating systems, architectures, install forms, and channels that current user need
requires and exact installed-artifact evidence supports. Expand when a concrete user requirement and
target-specific evidence justify the continuing build, support, update, and recovery cost.

### Prefer additive data evolution

**PREFER** additive, forward-compatible schema changes and copy-on-upgrade when an in-place migration could
strand older versions. Depart when a measured storage, time, or product constraint requires another design
and explicit refusal, downgrade behavior, and accepted recovery protect every affected version.

### Prefer representative predecessor rehearsal

**PREFER** the immediate predecessor plus supported predecessors whose migration, updater, data, or packaging
path differs materially. Expand the sample when installed-version distribution, telemetry, support history,
or migration branches show that another path has distinct risk.

### Prefer staged rollout

**PREFER** staged rollout when the distribution channel can control audience growth and the application has
observable stop conditions. Depart for offline, private, manual, or owner-constrained distribution only when
the channel limit and its support, monitoring, and Forward fix consequences are explicit.

### Prefer a Forward fix for an installed faulty version

**PREFER** a Forward fix when a faulty version may already be installed. Choose rollback only within the
Rule's proved reach and compatibility boundary; otherwise preserve the exact recovery limit and next safe
action.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
