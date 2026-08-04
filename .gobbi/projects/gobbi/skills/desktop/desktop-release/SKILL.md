---
name: desktop-release
description: "MUST load when judging target support, artifact and installed evidence, update and data compatibility, recovery, release readiness, rollout controls, or rollback and forward-fix options for an installable Electron desktop application written in TypeScript."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Desktop Release

Use this skill when choosing desktop targets and channels, deciding what release evidence supports, or setting data, update, recovery, rollout, support, and publication defaults. It helps agents make bounded release judgments without assuming that one artifact or environment proves another.

`desktop-contract` owns the observable installed-platform contract, and the [`electron`](../../electron/SKILL.md) family owns Electron packaging, signing, update, and platform mechanisms. `desktop-delivery` owns ordered work for a complete outcome; this skill owns only the valid choice space, defaults, exceptions, and authority boundaries for release decisions.

## Principles

### Scope every claim

A release claim applies only to the exact artifact, operating system, architecture, version, channel, environment, and evidence class that support it. Confidence from one target or state does not transfer to another.

### Design for machines beyond reach

Installed releases and their data remain on machines after distribution changes. Recovery must work through a later compatible release or an explicitly proven safe rollback.

### Let user data outlive versions

Persisted data belongs to the user, not to the release that wrote it. Compatibility and recovery take priority over a smaller migration or release burden.

### Prefer the smallest credible promise

A narrow support claim with direct evidence is stronger than a broad claim with inferred coverage. Expand targets, predecessors, channels, and rollout only when user need and evidence justify their continuing cost.

## Rules

- **MUST bound** every claim to its exact artifact, operating system, architecture, version, channel, environment, and evidence class. Keep development, packaged, installed, signed or notarized, update-rehearsed, release-ready, release-authorized, and post-release claims distinct.
- **MUST make** persistent writes atomic or detectably incomplete, give every persisted structure an explicit schema version, and provide an accepted recovery for corrupt or interrupted state. Protected-secret storage fails closed when its required protection is unavailable or degraded.
- **MUST define** forward compatibility or explicit refusal, downgrade or round-trip behavior, and recovery for users who stay on an older release whenever persisted data changes. Rehearse updates from previously released installed artifacts with realistic data, covering the immediate predecessor, each materially different supported path, and interruption recovery.
- **MUST resolve** each target's current signing, notarization, store or package-manager, updater or feed, entitlement or permission, and support obligations from its live owner. An unproved or unavailable obligation limits or removes that target claim; another target's evidence cannot substitute.
- **MUST define** a forward-fix path, supported-version window, monitoring, rollout stop conditions, and explicit recovery limits before calling a release ready. Halting or withdrawing distribution protects only machines that have not installed the release.
- **NEVER publish** an installer, update, or store release; change a signing identity or provider; mutate a live feed or channel; or widen a rollout without explicit user authority at that point of action.

## Preferences

### Prefer the narrowest supported target matrix

**PREFER** only the operating systems, architectures, and channels that current user need requires and installed-artifact evidence can support. Expand when a concrete user requirement and target-specific evidence justify the build, support, update, and recovery cost; otherwise state the target as unsupported.

### Prefer additive data evolution

**PREFER** additive, forward-compatible schema changes, and use copy-on-upgrade when a risky migration could strand older releases. Depart when a measured storage, time, or product requirement makes that design unsuitable and an explicit refusal, downgrade behavior, and accepted recovery protect every affected version.

### Prefer staged rollout

**PREFER** a staged rollout when the distribution channel can control audience growth and the release has observable stop conditions. Depart for offline, private, manual, or owner-constrained distribution only when that channel limitation is evidenced and the support, monitoring, and forward-fix consequences are explicit.

### Prefer representative predecessor rehearsal

**PREFER** the immediate previous release plus only supported predecessors whose migration, updater, data, or packaging path differs materially. Expand the sample when telemetry, support history, installed-version distribution, or migration branches show another path carries distinct risk.

### Prefer a forward fix after publication

**PREFER** a forward fix for machines that may already have installed a faulty release. Choose rollback only when target-specific distribution mechanics and data or schema compatibility prove that rollback preserves user state, reaches the affected machines, and stays inside the supported-version promise.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
