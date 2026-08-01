---
name: electron-release
description: "MUST load when packaging, signing, notarizing, upgrading, update-rehearsing, or preparing Electron artifacts for release."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Release

Use this operation to prepare signed, installable, update-compatible Electron artifacts for each authorized operating-system target. It covers live support evidence, packaging, fuses, signing and notarization, installed verification, update and rollback rehearsal, and exact handoff for publication.

This operation preserves a sound existing packaging stack and stops before credential use or publication that lacks explicit authority. Application implementation belongs to `electron-development`; Electron-specific test design belongs to `electron-testing`.

## Principles

### Release evidence comes from artifacts

Source builds and development launches cannot prove packaged entry paths, resources, native modules, signatures, installers, or updates. Inspect and run the exact artifact intended for handoff.

### Preserve a sound release stack

Keep the project's established packager, maker, builder, signing, and updater when they meet the target contract. Recommend Electron Forge for a new setup, not as an automatic migration.

### Hardening precedes identity

Set entries, resources, ASAR placement, native modules, and Electron fuses before signing. Any later byte change invalidates the signature and may invalidate notarization or update evidence.

### Publication authority is explicit

Preparing a verified artifact does not authorize credentials, upload, channel promotion, rollout, or store submission. Preserve the artifact and stop at the exact authority boundary.

## Rules

- **MUST bind the release to a pinned Electron major, live support evidence, target operating systems and architectures, artifact formats, update channel, version compatibility, rollback plan, credentials authority, and publication authority.**
- **MUST inspect and preserve a sound existing packaging and update stack.** Recommend Electron Forge only when creating a new setup or when evidence justifies an authorized migration.
- **MUST build separate main, preload, and renderer targets and verify both development and packaged loading, including preload format, entry paths, resources, ASAR or unpacked content, and rebuilt native modules.**
- **MUST set and verify intended Electron fuses before signing, then sign platform artifacts and notarize macOS artifacts as required by the target.**
- **NEVER accept source-only, development-only, or unsigned launch evidence as proof that a distributable installs, launches, updates, rolls back, or meets platform trust requirements.**
- **MUST stop before using unavailable credentials or performing an unauthorized publication, promotion, rollout, or store action and return exact artifact and recovery evidence.**

## Procedure

### Phase 1 — Bind Support and Authority

#### 1.1 Bind the release target

- Record application version, pinned Electron major, operating systems, minimum supported operating-system versions, architectures, artifact formats, install scope, update channels, and rollout stages.
- Record required signing identities, notarization credentials, update-feed access, store access, and the person or system authorized to use each.
- Define success for package, install, first launch, normal launch, uninstall, update, rollback, recovery, and handoff.

#### 1.2 Check live Electron support

- Read the current [Electron release policy](https://www.electronjs.org/docs/latest/tutorial/electron-timelines), [release schedule](https://releases.electronjs.org/schedule), and [stable releases](https://releases.electronjs.org/?channel=stable) at release time.
- Confirm the pinned major's support state, bundled platform requirements, and security posture without copying a transient current version into durable documentation.
- For a major upgrade, read every intervening item in the live [breaking changes](https://www.electronjs.org/docs/latest/breaking-changes), release notes, and support documents; map required code, configuration, native module, packaging, and operating-system changes.

### Phase 2 — Inspect and Preserve the Stack

#### 2.1 Inventory release ownership

- Inspect package manager and lockfile, Electron pin, main, preload, and renderer builds, packager or maker, signing hooks, notarization, fuses, updater, feed, CI, and artifact retention.
- Trace development and packaged entry paths, resource lookup, custom protocols, ASAR configuration, unpacked files, executable names, icons, identifiers, entitlements, permissions, and installer metadata.
- Preserve the existing stack when it produces maintainable target artifacts. If no stack exists, use the official [packaging guidance](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging) and recommend Forge as the supported integrated starting point.

#### 2.2 Freeze inputs and recovery

- Freeze source commit or digest, lockfile, Electron version, dependency graph, build configuration, tool versions, target matrix, and environment identity.
- Define reproducible artifact names and checksums plus storage for logs, symbol files, signatures, notarization receipts, update metadata, and test results.
- Define rollback artifact, compatible data or settings boundary, update-feed recovery, failed-install recovery, and who may activate each path.

### Phase 3 — Build and Package

#### 3.1 Build process targets

- Build main for its Node.js Electron environment, preload for its actual sandbox and CommonJS or ESM loader, and renderer for Chromium.
- Verify emitted filenames, extensions, source maps, package type, development URL handling, packaged protocol or file handling, and window preload resolution.
- Fail on missing entries, process-incompatible imports, accidental development servers, or runtime dependencies absent from the package.

#### 3.2 Assemble the application

- Package the pinned Electron binary, production dependencies, entries, icons, entitlements, manifests, locales, licenses, resources, and update metadata for each target.
- Treat ASAR as packaging, not a security boundary. Unpack files that require real filesystem access and verify resolved packaged paths.
- Follow the official [native module guidance](https://www.electronjs.org/docs/latest/tutorial/using-native-node-modules): rebuild native dependencies for the exact Electron application binary, operating system, and architecture, and verify their inclusion.

#### 3.3 Create distributables

- Produce the authorized installer, archive, package, or store-input format through the preserved stack.
- Inspect identifiers, executable names, icons, version metadata, architecture, install location, uninstall behavior, protocol registration, file associations, and update configuration.
- Record artifact paths, sizes, checksums, build logs, target environment, and frozen input identity before hardening and signing.

### Phase 4 — Harden, Sign, and Notarize

#### 4.1 Set Electron fuses

- Review the live official [fuse guidance](https://www.electronjs.org/docs/latest/tutorial/fuses) against the pinned major and application needs.
- Set each intended fuse on the packaged Electron binary before signing and record the resulting fuse state.
- Reinspect launch, ASAR expectations, environment behavior, and developer-tool constraints after fuses change.

#### 4.2 Sign target artifacts

- Follow the official [code-signing guidance](https://www.electronjs.org/docs/latest/tutorial/code-signing) and the preserved toolchain for the target operating system.
- Sign application binaries, nested code, helpers, native modules, installers, or packages in the target-required order and timestamp where required.
- Verify signatures using platform tools on the final bytes; fail on an unexpected identity, entitlement, nested signature, timestamp, or trust result.

#### 4.3 Notarize where required

- Submit the signed macOS artifact through the authorized notarization path, retain the request identity and result, staple where the artifact format supports it, and recheck Gatekeeper assessment.
- Treat timeout, rejection, unavailable credentials, or an unauthorized credential path as a stop with preserved artifacts and logs.
- Do not modify a signed or notarized artifact. Rebuild from the frozen inputs and repeat hardening when bytes must change.

### Phase 5 — Verify Install, Update, and Recovery

#### 5.1 Test the packaged artifact

- Give `electron-testing` the exact artifact and run the applicable per-operating-system install, first launch, normal launch, main/preload/renderer loading, resources, native modules, protocol, deep-link, single-instance, permissions, and uninstall smoke.
- Verify the installed application, not only an unpacked directory, when installer behavior is in scope.
- Record operating system, architecture, artifact checksum, signature state, commands, results, logs, and any environment gap.

#### 5.2 Rehearse update compatibility

- Test a supported prior version updating through the intended feed and channel to the candidate, including signature, metadata, download, restart, migration, and version reporting.
- Test channel boundaries and reject incompatible downgrade, cross-channel, stale, unsigned, or tampered metadata and artifacts as the updater contract requires.
- Confirm application data, settings, native state, and protocol ownership remain compatible across the supported upgrade path.

#### 5.3 Rehearse rollback and recovery

- Exercise the authorized rollback or feed withdrawal path without erasing user data outside the defined compatibility contract.
- Verify recovery from interrupted download, failed install, failed first launch, unavailable feed, rejected signature, and partially applied migration where applicable.
- Record time, authority, retained prior artifact, recovery commands, and residual incompatibilities.

### Phase 6 — Prepare the Publication Handoff

#### 6.1 Audit release completeness

- Map every target to frozen inputs, artifact checksum, fuse state, signature verification, notarization receipt, install result, update result, rollback result, and known limitation.
- Confirm live support and breaking-change evidence remains current at handoff time and rerun affected checks when the candidate or environment changed.
- Fail the handoff when an in-scope target lacks a reproducible artifact or required platform evidence.
- When this release work is evaluated, the [evaluation checklist](checklists.md) and every checklist owned by an active `electron` sibling supply the applicable conditions; the general Evaluation operation resolves them and issues any verdict.

#### 6.2 Stop at the authority boundary

- Return exact artifact locations, checksums, versions, operating systems and architectures, signatures, notarization receipts, update channel, staged rollout plan, rollback path, commands, logs, and unresolved blockers.
- Name the first publication action, credentials, external destination, and authority it requires.
- Publish, promote, roll out, submit, or modify an update feed only when a separate explicit authorization grants that action.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work governed by this skill.
