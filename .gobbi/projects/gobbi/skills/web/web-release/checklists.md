# Web Release Evaluation Checklist

This reusable unchecked source evaluates one production release artifact, against the evaluated-handoff,
frozen-input, bundler and chunk, asset-name and cache, identity, manifest and digest, source-map, verification,
failure-return, and deployment-handoff obligations this operation owns. It is governed by the
[`web`](../SKILL.md) domain and [`web-release`](SKILL.md) operation, with
[`web-development`](../web-development/SKILL.md) supplying the evaluated handoff,
[`web-deployment`](../web-deployment/SKILL.md) consuming the accepted artifact unchanged,
[`web-configuration`](../web-configuration/SKILL.md) owning the values inside frozen inputs,
[`web-security`](../web-security/SKILL.md) owning protected-data exposure, and
[`typescript-toolchain`](../../typescript/typescript-toolchain/SKILL.md) owning compiling, emit, module
resolution, and type stripping. The source commit that contains this file identifies the checklist version.
Its stable owner prefix is `WEBREL`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBREL-SC-PROJECT-01 — Normal case: evaluated handoff and frozen/recorded build identity enter release production

An evaluated web-development handoff enters release production. The expected outcome refuses unresolved
evaluation, freezes and records one input set, and carries one build identity through every output; release
production from moving or undisposed inputs is the failure.

#### Checklist

- [ ] WEBREL-CK-PROJECT-01-01 — Release work starts from `web-development`'s evaluated handoff or the caller's equivalent, including its compatibility notes, configuration state, and release requirements.
- [ ] WEBREL-CK-PROJECT-01-02 — A handoff whose evaluation is unresolved, or whose limitation carries no user disposition, is refused before release production begins.
- [ ] WEBREL-CK-PROJECT-01-03 — The source commit, lockfile, dependency graph, build configuration, tool and runtime versions, and artifact digests are frozen before release production begins.
- [ ] WEBREL-CK-PROJECT-01-04 — The source commit, lockfile, dependency graph, build configuration, tool and runtime versions, and artifact digests are recorded before release production begins.
- [ ] WEBREL-CK-PROJECT-01-05 — One build identity is embedded in the production build.
- [ ] WEBREL-CK-PROJECT-01-06 — That one build identity is carried by every later artifact, log, and error report, so a cache entry, a stale client, and an incident report resolve to exactly one build.

### WEBREL-SC-PROJECT-02 — Rule violation: adjacent build questions or toolchain failures are settled in bundler configuration

Release production raises compiler, placement, delivery, configuration, exposure, and telemetry questions.
The expected outcome routes each question to its owner and keeps bundler work inside release; hiding a
toolchain failure in bundler configuration or granting environment authority is the failure.

#### Checklist

- [ ] WEBREL-CK-PROJECT-02-01 — Every adjacent release question is routed to its owner: compiling, emit, and module resolution to `typescript-toolchain`; build-output placement to `web-project-structure`; rendering and delivery strategy to `web-architecture`; per-environment values and secrets management to `web-configuration`; every protected-data exposure question arising from release inputs, production artifacts, or release output, including public source exposure, to `web-security`; and telemetry destinations to `web-observability`.
- [ ] WEBREL-CK-PROJECT-02-02 — No compiler, emit, module-resolution, or type-stripping failure is worked around in bundler configuration.
- [ ] WEBREL-CK-PROJECT-02-03 — Release requirements name the intended deployment handoff without granting environment authority.

## Structure

### WEBREL-SC-STRUCTURE-01 — Normal case: bundler, entries, splits, shared chunks, and graph match delivery strategy

A production build is configured for the selected delivery strategy. The expected outcome preserves the
working bundler, splits where people cross real boundaries, and records the emitted graph; a reorganization
the release did not require is the failure.

#### Checklist

- [ ] WEBREL-CK-STRUCTURE-01-01 — The working bundler is preserved.
- [ ] WEBREL-CK-STRUCTURE-01-02 — Only what this release requires is changed in the build configuration.
- [ ] WEBREL-CK-STRUCTURE-01-03 — One entry point exists per delivered surface.
- [ ] WEBREL-CK-STRUCTURE-01-04 — Code splits at a route, a deferred feature, or a rarely reached dependency.
- [ ] WEBREL-CK-STRUCTURE-01-05 — A shared dependency lives in one chunk rather than being duplicated across entries.
- [ ] WEBREL-CK-STRUCTURE-01-06 — The emitted chunk graph, the per-entry transferred size, every dynamic-import boundary, and the chunks a first visit must fetch before the page is usable are recorded.

### WEBREL-SC-STRUCTURE-02 — Rule violation: asset names or cache policy permit one name to serve changed content

A cacheable asset can change while its name remains reusable. The expected outcome derives asset names from
content, keeps unchanged names stable, gives changed bytes new names, and records the release cache contract;
one name serving two byte sequences is the failure.

#### Checklist

- [ ] WEBREL-CK-STRUCTURE-02-01 — Every cacheable asset filename is derived from its content.
- [ ] WEBREL-CK-STRUCTURE-02-02 — A rebuilt but unchanged asset keeps its name.
- [ ] WEBREL-CK-STRUCTURE-02-03 — A changed asset receives a new name.
- [ ] WEBREL-CK-STRUCTURE-02-04 — Cacheable assets are assigned a long-lived immutable freshness lifetime.
- [ ] WEBREL-CK-STRUCTURE-02-05 — The entry document stays revalidated.
- [ ] WEBREL-CK-STRUCTURE-02-06 — The release record states the asset naming scheme, the freshness lifetime for each file class, and the entry document's cache policy.
- Also applies: WEBDEP-CK-CONSISTENCY-01-04 (live-served names and cache directives observed from the production URL).

### WEBREL-SC-STRUCTURE-03 — Normal case: one manifest identifies every deployable file and release-owned artifact

A cold deployer receives the release artifact. The expected outcome supplies one manifest that identifies
every file, its role, digest, and build identity; an unlisted or ambiguous file is the failure.

#### Checklist

- [ ] WEBREL-CK-STRUCTURE-03-01 — One release manifest lists every deployable file, each file's digest and role, and the one build identity.

## Performance

### WEBREL-SC-PERFORMANCE-01 — Normal case: build resources and artifact/chunk size are measured against project evidence

The production build consumes time and resources and emits entries, chunks, and assets. The expected outcome
records measured conditions and compares results with project-approved limits; an invented limit or an
undisposed regression is the failure.

#### Checklist

- [ ] WEBREL-CK-PERFORMANCE-01-01 — Production-build duration and peak resource use are recorded with the runner, tool, and input conditions.
- [ ] WEBREL-CK-PERFORMANCE-01-02 — Entry, chunk, and asset sizes are compared with project-approved limits, or are reported without inventing a limit.
- [ ] WEBREL-CK-PERFORMANCE-01-03 — A measured build or artifact regression beyond an approved limit blocks the release unless its limitation receives an authorized disposition.

## Aesthetics

### WEBREL-SC-AESTHETICS-01 — Poor quality: the artifact and release record cannot be identified or consumed by a cold deployer

A deployer with no author context must select the artifact and its evidence. The expected outcome exposes
roles and identity in names and identifies every release record component; inference from chat or local
knowledge is the failure.

#### Checklist

- [ ] WEBREL-CK-AESTHETICS-01-01 — Each artifact name exposes the artifact's role and build identity to a cold deployer.
- [ ] WEBREL-CK-AESTHETICS-01-02 — The release record identifies the artifact, manifest, build log, and source-map disposition without relying on author context.

## Usage

### WEBREL-SC-USAGE-01 — Normal case: deployment can consume the accepted artifact without rebuilding or mutating it

The production artifact succeeds or release production fails. The expected outcome gives deployment exact
accepted bytes, while a failure names and returns its failed item with no partial artifact; mutation after
acceptance or a partial handoff is the failure.

#### Checklist

- [ ] WEBREL-CK-USAGE-01-01 — Deployment can consume the accepted artifact without rebuilding, renaming, or modifying its bytes.
- [ ] WEBREL-CK-USAGE-01-02 — A release failure names the failed input, tool, or output.
- [ ] WEBREL-CK-USAGE-01-03 — A release failure returns the failed input, tool, or output to its owner.
- [ ] WEBREL-CK-USAGE-01-04 — A release failure hands off no partial artifact.

## Consistency

### WEBREL-SC-CONSISTENCY-01 — Normal case: manifest, identity, digests, files, source maps, and frozen inputs reconcile

The release artifact is checked before handoff. The expected outcome proves that its complete file set,
including every recorded source map, manifest, digests, frozen inputs, and release record identify the same
bytes; a stale manifest or mismatched digest is the failure.

#### Checklist

- [ ] WEBREL-CK-CONSISTENCY-01-01 — The manifest's file set matches the complete artifact set.
- [ ] WEBREL-CK-CONSISTENCY-01-02 — Frozen inputs, artifact files, manifest, and release record identify the same build.
- [ ] WEBREL-CK-CONSISTENCY-01-03 — Every digest in the manifest matches the bytes of its listed artifact file.

## Risk

### WEBREL-SC-RISK-01 — Rule violation: source maps, exposure, provenance, or release output exceed accepted boundaries

Every shipped bundle needs a readable stack path, while source maps may expose original source and release
work may approach an environment boundary. The expected outcome gives every bundle a deliberate map
disposition and stops before every environment action; global map policy, provenance loss, or crossing the
release boundary is the failure.

#### Checklist

- [ ] WEBREL-CK-RISK-01-01 — A production source map is generated for every shipped bundle.
- [ ] WEBREL-CK-RISK-01-02 — Publication is decided per source map rather than by one global setting.
- [ ] WEBREL-CK-RISK-01-03 — An unpublished map still reaches the error reporter so a stack trace can be read.
- [ ] WEBREL-CK-RISK-01-04 — It is recorded, per bundle, whether its map is published, where an unpublished map is delivered instead, and whether original sources are embedded in it.
- [ ] WEBREL-CK-RISK-01-05 — A published map on a surface whose source is not public is routed to `web-security` as an exposure question rather than settled here.
- [ ] WEBREL-CK-RISK-01-06 — Release work uses no deployment credential, publication, promotion, or environment change without authority for that exact action.

## Overall

### WEBREL-SC-OVERALL-01 — Normal case: release identity/cache/naming and handoff are complete without claiming deployment

A complete release identifies the exact production artifact, asset names, cache policy, evidence, and
deployment handoff without claiming environment state. The scenario fails when one is unanswered or release
status is reported as deployment or live health.

#### Checklist

- [ ] WEBREL-CK-OVERALL-01-01 — The release record answers build identity, asset naming, and cache policy.
- [ ] WEBREL-CK-OVERALL-01-02 — Release status is reported separately from deployment authority, deployment state, live verification, and observed health.
