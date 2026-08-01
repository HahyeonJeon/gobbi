# Electron Release Evaluation Checklist

This reusable unchecked source evaluates one Electron release preparation and the exact artifacts it hands
off. It is governed by the [`electron`](../SKILL.md) domain and [`electron-release`](SKILL.md) operation, with
[`electron-development`](../electron-development/SKILL.md) owning application implementation,
[`electron-testing`](../electron-testing/SKILL.md) owning test design, and
[`electron-design`](../electron-design/SKILL.md) owning the security posture the artifact carries. The source
commit that contains this file identifies the checklist version. Its stable owner prefix is `ELECREL`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### ELECREL-SC-PROJECT-01 — Normal case: the release is bound to targets, support, and authority

An ordinary release names its version, targets, formats, channels, and the people or systems authorized to
sign, notarize, and publish, and it checks the pinned major's live support state at release time. It fails
this scenario when a target, credential holder, or success definition is assumed rather than recorded.

#### Checklist

- [ ] ELECREL-CK-PROJECT-01-01 — The application version, pinned Electron major, operating systems, minimum supported operating-system versions, architectures, artifact formats, install scope, update channels, and rollout stages are each recorded.
- [ ] ELECREL-CK-PROJECT-01-02 — Every required signing identity, notarization credential, update-feed access, and store access names the person or system authorized to use it.
- [ ] ELECREL-CK-PROJECT-01-03 — Success is defined for package, install, first launch, normal launch, uninstall, update, rollback, recovery, and handoff.
- [ ] ELECREL-CK-PROJECT-01-04 — The pinned major's support state is read at release time from the current release policy, release schedule, and stable-release sources.
- [ ] ELECREL-CK-PROJECT-01-05 — Every intervening breaking change is read and mapped to required code, configuration, native-module, packaging, and operating-system work whenever the release carries a major upgrade.

### ELECREL-SC-PROJECT-02 — Expected failure: credentials or publication authority are unavailable

A signing identity, notarization credential, feed key, or publication approval is missing. The expected
outcome is a stop that preserves the artifact and names the first blocked action and its authority; producing
the release anyway through an alternative credential path is the observable failure.

#### Checklist

- [ ] ELECREL-CK-PROJECT-02-01 — The operation stops before using an unavailable credential or performing an unauthorized publication, promotion, rollout, or store action.
- [ ] ELECREL-CK-PROJECT-02-02 — The stop preserves the artifacts and logs produced up to that point.
- [ ] ELECREL-CK-PROJECT-02-03 — The first publication action, its credentials, its external destination, and the authority it requires are each named.

## Structure

### ELECREL-SC-STRUCTURE-01 — Normal case: separate process targets on a preserved stack

Main, preload, and renderer run in different environments and loaders, and the project's packager, maker,
signing, and updater already work. The expected outcome builds each target for its real environment and keeps
the existing stack; a rebuilt toolchain or a shared build for all three processes is the failure.

#### Checklist

- [ ] ELECREL-CK-STRUCTURE-01-01 — Main, preload, and renderer are built as separate targets for their actual environments and loaders.
- [ ] ELECREL-CK-STRUCTURE-01-02 — Emitted filenames, extensions, source maps, package type, development URL handling, packaged protocol or file handling, and window preload resolution are each verified.
- [ ] ELECREL-CK-STRUCTURE-01-03 — The existing packaging and update stack is preserved where it produces maintainable target artifacts.
- [ ] ELECREL-CK-STRUCTURE-01-04 — Electron Forge is recommended only for a new setup or an authorized, evidence-backed migration.

### ELECREL-SC-STRUCTURE-02 — Edge case: native dependencies and build inputs at the packaging boundary

A target carries compiled native dependencies, and a wrong build input can still produce an artifact that
launches in development. The expected outcome rebuilds each native dependency against the exact Electron
binary, operating system, and architecture, verifies that it reaches the package, and fails the build on a
missing entry, a process-incompatible import, an accidental development server, or an absent runtime
dependency. A build that succeeds while any of those is wrong is the failure.

#### Checklist

- [ ] ELECREL-CK-STRUCTURE-02-01 — Native dependencies are rebuilt for the exact Electron application binary, operating system, and architecture.
- [ ] ELECREL-CK-STRUCTURE-02-02 — The inclusion of every native dependency in the package is verified.
- [ ] ELECREL-CK-STRUCTURE-02-03 — A missing entry, a process-incompatible import, an accidental development server, and a runtime dependency absent from the package each fail the build.

## Performance

### ELECREL-SC-PERFORMANCE-01 — Poor quality: artifacts produced without retained evidence

The artifacts build, install, and launch, but their sizes, checksums, logs, symbol files, signatures,
receipts, update metadata, and test results have no defined storage. The expected outcome records each
artifact's cost facts and defines retention before hardening; a release that cannot be re-examined later is
the failure even when this run succeeded.

#### Checklist

- [ ] ELECREL-CK-PERFORMANCE-01-01 — Every target artifact records its path, size, and checksum before hardening and signing.
- [ ] ELECREL-CK-PERFORMANCE-01-02 — Retention storage is defined for logs, symbol files, signatures, notarization receipts, update metadata, and test results.

## Aesthetics

### ELECREL-SC-AESTHETICS-01 — Poor quality: artifacts and evidence that cannot be told apart

Every target produced a file, but the names, identifiers, and evidence labels do not distinguish version,
platform, architecture, or evidence layer. The expected outcome makes each artifact and each result
self-identifying; a correct release whose reviewer must guess which file is which is the failure.

#### Checklist

- [ ] ELECREL-CK-AESTHETICS-01-01 — Every artifact name is reproducible and identifies its version, operating system, and architecture.
- [ ] ELECREL-CK-AESTHETICS-01-02 — Identifiers, executable names, icons, version metadata, install location, uninstall behavior, protocol registration, file associations, and update configuration are inspected against the intended release rather than inherited unchecked.
- [ ] ELECREL-CK-AESTHETICS-01-03 — Source, development, packaged, and installed evidence are labeled distinctly in the record.

## Usage

### ELECREL-SC-USAGE-01 — Normal case: the artifact installs, launches, and uninstalls on each target

A person installs the distributable, runs it, and removes it. The expected outcome exercises that path on
every authorized target with the installed application rather than an unpacked directory. The scenario fails
when a target is claimed from a developer machine run or when a result carries no environment identity.

#### Checklist

- [ ] ELECREL-CK-USAGE-01-01 — Install, first launch, normal launch, main, preload, and renderer loading, resources, native modules, protocol, deep-link, single-instance, permissions, and uninstall are each exercised on every authorized target.
- [ ] ELECREL-CK-USAGE-01-02 — The installed application is verified, not only an unpacked directory, wherever installer behavior is in scope.
- [ ] ELECREL-CK-USAGE-01-03 — Every result records operating system, architecture, artifact checksum, signature state, commands, results, logs, and any environment gap.

### ELECREL-SC-USAGE-02 — Edge case: a supported prior version updates across a channel boundary

An installed older version reaches the candidate through the intended feed, and neighboring channels, stale
metadata, and tampered artifacts sit at the same boundary. The expected outcome completes the supported
upgrade and rejects every other input the updater contract forbids.

#### Checklist

- [ ] ELECREL-CK-USAGE-02-01 — A supported prior version updates through the intended feed and channel to the candidate, including signature, metadata, download, restart, migration, and version reporting.
- [ ] ELECREL-CK-USAGE-02-02 — Application data, settings, native state, and protocol ownership remain compatible across the supported upgrade path.
- [ ] ELECREL-CK-USAGE-02-03 — Incompatible downgrade, cross-channel, stale, unsigned, and tampered metadata and artifacts are each rejected as the updater contract requires.

### ELECREL-SC-USAGE-03 — Expected failure: an install, update, or feed step fails midway

A download is interrupted, an install fails, a first launch fails, a feed is unavailable, a signature is
rejected, or a migration applies partly. The expected outcome recovers through the authorized rollback or
withdrawal path without destroying user data; an untested recovery claimed as available is the failure.

#### Checklist

- [ ] ELECREL-CK-USAGE-03-01 — The authorized rollback or feed-withdrawal path is exercised without erasing user data outside the defined compatibility contract.
- [ ] ELECREL-CK-USAGE-03-02 — Recovery from interrupted download, failed install, failed first launch, unavailable feed, rejected signature, and partially applied migration is verified wherever applicable.
- [ ] ELECREL-CK-USAGE-03-03 — The retained prior artifact, recovery commands, the authority that may activate each path, and residual incompatibilities are recorded.

## Consistency

### ELECREL-SC-CONSISTENCY-01 — Normal case: one frozen input identity behind every artifact

Every artifact and every result must trace to the same frozen source, lockfile, Electron version, dependency
graph, configuration, tool versions, and environment. The scenario fails when an artifact is rebuilt from a
moved input, or when handoff-time support evidence is older than the candidate it describes.

#### Checklist

- [ ] ELECREL-CK-CONSISTENCY-01-01 — The source commit or digest, lockfile, Electron version, dependency graph, build configuration, tool versions, target matrix, and environment identity are each frozen before the build.
- [ ] ELECREL-CK-CONSISTENCY-01-02 — Every artifact and every recorded result binds to that frozen identity.
- [ ] ELECREL-CK-CONSISTENCY-01-03 — Live support and breaking-change evidence is confirmed current at handoff.
- [ ] ELECREL-CK-CONSISTENCY-01-04 — Every affected check is rerun when the candidate or environment changed.

### ELECREL-SC-CONSISTENCY-02 — Rule violation: bytes change after hardening or signing

Entries, resources, ASAR placement, native modules, and fuses must be settled before signing, and a signed or
notarized artifact must not be modified. The expected outcome rebuilds from the frozen inputs and repeats
hardening; patching a signed artifact, however small the change, is the failure.

#### Checklist

- [ ] ELECREL-CK-CONSISTENCY-02-01 — Entries, resources, ASAR placement, native modules, and Electron fuses are set before signing.
- [ ] ELECREL-CK-CONSISTENCY-02-02 — No signed or notarized artifact is modified.
- [ ] ELECREL-CK-CONSISTENCY-02-03 — A required byte change rebuilds from the frozen inputs.
- [ ] ELECREL-CK-CONSISTENCY-02-04 — A required byte change repeats hardening.
- [ ] ELECREL-CK-CONSISTENCY-02-05 — Every intended fuse is set on the packaged Electron binary and its resulting state is recorded.
- [ ] ELECREL-CK-CONSISTENCY-02-06 — Launch, ASAR expectations, environment behavior, and developer-tool constraints are reinspected after every fuse change.

## Risk

### ELECREL-SC-RISK-01 — Normal case: signing established on the final bytes

Signing decides whether the operating system will run the artifact, and it applies to the exact bytes being
handed off. The expected outcome signs every required component in the target order and verifies the result
with platform tools; an unexpected identity, entitlement, or trust result fails the release.

#### Checklist

- [ ] ELECREL-CK-RISK-01-01 — Application binaries, nested code, helpers, native modules, installers, and packages are signed in the target-required order.
- [ ] ELECREL-CK-RISK-01-02 — Application binaries, nested code, helpers, native modules, installers, and packages are timestamped where required.
- [ ] ELECREL-CK-RISK-01-03 — Signatures are verified with platform tools on the final bytes.
- [ ] ELECREL-CK-RISK-01-04 — An unexpected identity, entitlement, nested signature, timestamp, or trust result fails the release.

### ELECREL-SC-RISK-02 — Adversarial: packaging presented as protection

An archive that is hard to open, a set fuse, or a signature can be offered as evidence that bundled content
is protected, leaving a release that looks hardened with no owning control. The expected outcome keeps every
protection claim with the mechanism that enforces it; packaging accepted as a boundary is the failure.

#### Checklist

- [ ] ELECREL-CK-RISK-02-01 — ASAR packaging is not treated as a security boundary or as protection for bundled content or secrets.
- [ ] ELECREL-CK-RISK-02-02 — Files that require real filesystem access are unpacked and their resolved packaged paths are verified.
- [ ] ELECREL-CK-RISK-02-03 — No packaged-artifact property is presented as a security control without evidence from the mechanism that enforces it.

### ELECREL-SC-RISK-03 — Normal case: notarization proven on the final macOS artifact

Notarization is a separate Apple service decision from signing, and its result must be attached to the
artifact and rechecked locally. The expected outcome submits each artifact through the authorized path,
retains the request identity and result, and proves the shipped bytes still pass assessment; a submission
whose outcome is never reattached or rechecked is the failure.

#### Checklist

- [ ] ELECREL-CK-RISK-03-01 — Every macOS artifact requiring notarization is submitted through the authorized path.
- [ ] ELECREL-CK-RISK-03-02 — The notarization request identity and result are retained for every submitted macOS artifact.
- [ ] ELECREL-CK-RISK-03-03 — Every notarized macOS artifact is stapled where its format supports it.
- [ ] ELECREL-CK-RISK-03-04 — The Gatekeeper assessment is rechecked for every notarized macOS artifact.

### ELECREL-SC-RISK-04 — Expected failure: notarization cannot complete

The notarization service times out, rejects the submission, or the credentials are missing or outside the
authorized path. The expected outcome stops the operation with the artifacts and logs preserved for a retry;
continuing to a release on an incomplete notarization result is the failure.

#### Checklist

- [ ] ELECREL-CK-RISK-04-01 — Notarization timeout, rejection, unavailable credentials, and an unauthorized credential path each stop the operation with preserved artifacts and logs.

## Overall

### ELECREL-SC-OVERALL-01 — Normal case: every target audited before handoff

The handoff covers each authorized target with its artifact, hardening state, trust evidence, and results.
The scenario fails when one in-scope target lacks a reproducible artifact or required platform evidence and
the handoff proceeds, or when a known limitation is left out of the record.

#### Checklist

- [ ] ELECREL-CK-OVERALL-01-01 — Every target maps to its frozen inputs, artifact checksum, fuse state, signature verification, notarization receipt, install result, update result, rollback result, and known limitation.
- [ ] ELECREL-CK-OVERALL-01-02 — The handoff fails while an in-scope target lacks a reproducible artifact or required platform evidence.
- [ ] ELECREL-CK-OVERALL-01-03 — Every unresolved blocker and known limitation remains explicit in the returned record.

### ELECREL-SC-OVERALL-02 — Adversarial: development evidence dressed as release evidence

A source build, a development launch, an unsigned run, or one platform's success can be presented as proof
that the distributable installs, updates, and meets platform trust requirements. The expected outcome keeps
each result inside the artifact and target it came from; a proxy accepted as release evidence is the failure.

#### Checklist

- [ ] ELECREL-CK-OVERALL-02-01 — No source-only, development-only, or unsigned launch evidence is treated as proof that a distributable installs, launches, updates, rolls back, or meets platform trust requirements.
- [ ] ELECREL-CK-OVERALL-02-02 — One target's result is not generalized to an unobserved operating system or architecture.
