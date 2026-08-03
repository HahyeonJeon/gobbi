# Web Deployment Evaluation Checklist

This reusable unchecked source evaluates one web release turned into a running, verified, reversible
deployment, against the frozen-identity, asset-naming and cache, publish-order, source-map, live-verification,
and explicit-authority obligations this skill owns. It is governed by the [`web`](../SKILL.md) domain and
[`web-deployment`](SKILL.md) operation, with [`web-development`](../web-development/SKILL.md) as the caller whose
accepted release handoff it begins from, [`web-configuration`](../web-configuration/SKILL.md) as the owner of the
per-environment values inside the frozen inputs, [`web-observability`](../web-observability/SKILL.md) as the
owner of the signals a rollout is judged by, and
[`typescript-toolchain`](../../typescript/typescript-toolchain/SKILL.md) as the owner of compiling, emit, and
module resolution. The source commit that contains this file identifies the checklist version. Its stable
owner prefix is `WEBDEP`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### WEBDEP-SC-PROJECT-01 — Normal case: the handoff is taken and the build identity is frozen

A release-ready handoff arrives and a deployment begins. The expected outcome refuses an unresolved handoff
and freezes one recorded build identity before the target environment changes; a deploy whose inputs were
still moving is the failure.

#### Checklist

- [ ] WEBDEP-CK-PROJECT-01-01 — Work starts from `web-development`'s accepted release handoff or the caller's equivalent, including its compatibility notes, rollout and rollback intent, configuration state, and deployment-authority state.
- [ ] WEBDEP-CK-PROJECT-01-02 — A handoff whose evaluation is unresolved, or whose limitation carries no user disposition, is refused rather than deployed.
- [ ] WEBDEP-CK-PROJECT-01-03 — The source commit, lockfile, dependency graph, build configuration, tool and runtime versions, artifact digests, environment identity, and target are frozen before anything in the target environment changes.
- [ ] WEBDEP-CK-PROJECT-01-04 — The source commit, lockfile, dependency graph, build configuration, tool and runtime versions, artifact digests, environment identity, and target are recorded before anything in the target environment changes.
- [ ] WEBDEP-CK-PROJECT-01-05 — One build identity is embedded in the build.
- [ ] WEBDEP-CK-PROJECT-01-06 — That one build identity is carried by every later artifact, log, and error report, so a cache entry, a stale client, and an incident report resolve to exactly one build.

### WEBDEP-SC-PROJECT-02 — Normal case: adjacent questions reach their owners

The deployment raises compiler, data, exposure, signal, and value questions. The expected outcome routes each
to its owner and keeps bundler configuration for the bundle; a toolchain failure worked around in bundler
options is the failure.

#### Checklist

- [ ] WEBDEP-CK-PROJECT-02-01 — Every adjacent question is routed to its owner: compiling, emit, and module resolution to `typescript-toolchain`, build-output placement to `web-project-structure`, rendering and delivery strategy to `web-architecture`, what a migration means to the data to `web-backend`, protected-data exposure to `web-security`, rollout signals to `web-observability`, per-environment values and secret supply to `web-configuration`, suite evidence to `web-testing`, and a disputed browser fact to `web-platform`.
- [ ] WEBDEP-CK-PROJECT-02-02 — No compiler, emit, module-resolution, or type-stripping failure is worked around in bundler configuration.

## Structure

### WEBDEP-SC-STRUCTURE-01 — Normal case: the chunk graph matches the delivery strategy

A production build is configured for the selected delivery strategy. The expected outcome preserves the
working bundler, splits where people actually cross a boundary, and records the resulting graph; a
reorganisation the release did not require is the failure.

#### Checklist

- [ ] WEBDEP-CK-STRUCTURE-01-01 — The working bundler is preserved.
- [ ] WEBDEP-CK-STRUCTURE-01-02 — Only what this release requires is changed in the build configuration.
- [ ] WEBDEP-CK-STRUCTURE-01-03 — One entry point exists per delivered surface.
- [ ] WEBDEP-CK-STRUCTURE-01-04 — Code splits at a route, a deferred feature, or a rarely reached dependency.
- [ ] WEBDEP-CK-STRUCTURE-01-05 — A shared dependency lives in one chunk rather than being duplicated across entries.
- [ ] WEBDEP-CK-STRUCTURE-01-06 — The emitted chunk graph, the per-entry transferred size, every dynamic-import boundary, and the chunks a first visit must fetch before the page is usable are recorded.

### WEBDEP-SC-STRUCTURE-02 — Rule violation: a cacheable asset is served under a reusable name

An asset whose content can change is served under a name that stays the same. The expected outcome derives
every cacheable filename from its content and keeps the entry document revalidated; one deploy serving two
versions from one name is the failure.

#### Checklist

- [ ] WEBDEP-CK-STRUCTURE-02-01 — Every cacheable asset filename is derived from its content.
- [ ] WEBDEP-CK-STRUCTURE-02-02 — A rebuilt but unchanged asset keeps its name.
- [ ] WEBDEP-CK-STRUCTURE-02-03 — A changed asset receives a new name.
- [ ] WEBDEP-CK-STRUCTURE-02-04 — Cacheable assets are served with a long-lived immutable freshness lifetime.
- [ ] WEBDEP-CK-STRUCTURE-02-05 — The entry document stays revalidated.
- [ ] WEBDEP-CK-STRUCTURE-02-06 — The naming scheme, the freshness lifetime per class of file, and the entry document's directives are recorded as they are actually served rather than as configured.

## Performance

### WEBDEP-SC-PERFORMANCE-01 — Normal case: the rollout holds long enough for signals to move

The release is advanced in stages against live traffic. The expected outcome uses the smallest stage the
target supports and holds it until error, latency, and outcome signals can move; an advance faster than the
signals it claims to rely on is the failure.

#### Checklist

- [ ] WEBDEP-CK-PERFORMANCE-01-01 — Each rollout stage is the smallest the target supports.
- [ ] WEBDEP-CK-PERFORMANCE-01-02 — Each stage is held long enough for error, latency, and outcome signals to move before the next advance.
- [ ] WEBDEP-CK-PERFORMANCE-01-03 — Each stage boundary, its traffic share, the signals observed during the hold, and the decision taken at the end of it are recorded.
- Also applies: WEBDEP-CK-STRUCTURE-01-06 (chunk graph and first-visit cost recorded).

### WEBDEP-SC-PERFORMANCE-02 — Edge case: a warm cache and an old document still request the previous names

Immediately after the cutover, an edge cache, a stale client, and an in-flight lazy chunk all ask for files by
the names they already hold. The expected outcome keeps the previous build's assets served through the whole
rollback window; a deleted predecessor breaking clients mid-session is the failure.

#### Checklist

- [ ] WEBDEP-CK-PERFORMANCE-02-01 — The previous build's assets remain retained and served throughout the rollback window.
- [ ] WEBDEP-CK-PERFORMANCE-02-02 — A client holding the old entry document and an in-flight lazy chunk can still fetch the files by the names they already have.

## Aesthetics

### WEBDEP-SC-AESTHETICS-01 — Poor quality: the deployment record cannot be read afterwards

An incident is investigated a week later from the deployment record alone. The expected outcome supplies each
step's timing and the exact moment the entry document changed; a record that cannot place the cutover in time
is the failure.

#### Checklist

- [ ] WEBDEP-CK-AESTHETICS-01-01 — Each deploy step's completion time, the moment the entry document changed, and confirmation that the previous build's assets remain in place are recorded.
- Also applies: WEBDEP-CK-PROJECT-01-06 (one build identity carried by every artifact, log, and error report).

## Usage

### WEBDEP-SC-USAGE-01 — Normal case: the reverse path is designed and rehearsed before the deploy

A reverse path is designed and exercised while the previous version is still whole. The expected outcome
names the artifact, the restoration, the retention, the reversible and irreversible data changes, and the
person who may act, and proves the path by running it; a path first run during an incident is the failure.

#### Checklist

- [ ] WEBDEP-CK-USAGE-01-01 — The reverse path names the exact previous artifact, how it is restored, how long its assets are retained, which data changes are reversible and which are not, and who may activate it.
- [ ] WEBDEP-CK-USAGE-01-02 — The reverse path is defined before any forward step.
- [ ] WEBDEP-CK-USAGE-01-03 — The reverse path is executable by a named person without further design.
- [ ] WEBDEP-CK-USAGE-01-04 — The stop conditions that trigger the reverse path are recorded.
- [ ] WEBDEP-CK-USAGE-01-05 — The reverse path was exercised on the retained previous artifact before the first forward step, in a pre-production target that mirrors production or through the production target's documented dry run.

### WEBDEP-SC-USAGE-02 — Expected failure: verification fails or a stop condition is met

The release is serving and a stop condition fires. The expected outcome reverses at once and re-verifies the
restored release; diagnosing first while the broken build keeps serving, or assuming the reverse worked, is
the failure.

#### Checklist

- [ ] WEBDEP-CK-USAGE-02-01 — The release is reversed without waiting for a diagnosis.
- [ ] WEBDEP-CK-USAGE-02-02 — The diagnosis proceeds from the restored state.
- [ ] WEBDEP-CK-USAGE-02-03 — The previous entry document is restored.
- [ ] WEBDEP-CK-USAGE-02-04 — The previous entry document's assets are confirmed still served.
- [ ] WEBDEP-CK-USAGE-02-05 — The restored release is re-verified from the production URL rather than assumed to have succeeded.

### WEBDEP-SC-USAGE-03 — Edge case: a change has no reverse path

A step in the release cannot be undone once taken. The expected outcome raises it as a decision needing
explicit user authority; treating it as an ordinary step to take carefully is the failure.

#### Checklist

- [ ] WEBDEP-CK-USAGE-03-01 — A change with no reverse path is raised as a decision needing explicit user authority rather than taken carefully.

## Consistency

### WEBDEP-SC-CONSISTENCY-01 — Normal case: the served bytes match the frozen artifact

The deployment is verified after the cutover. The expected outcome fetches from the production URL people
actually use and compares what is served against what was frozen; a preview alias standing in for production
is the failure.

#### Checklist

- [ ] WEBDEP-CK-CONSISTENCY-01-01 — Verification is performed against the production URL people actually use, not a preview alias, an origin bypass, or a staging host.
- [ ] WEBDEP-CK-CONSISTENCY-01-02 — The served build identity read from the entry document matches the frozen identity.
- [ ] WEBDEP-CK-CONSISTENCY-01-03 — At least one hashed asset, one lazily loaded chunk, and one authoritative round trip are exercised.
- [ ] WEBDEP-CK-CONSISTENCY-01-04 — The cache directives are read as served.
- [ ] WEBDEP-CK-CONSISTENCY-01-05 — Every difference between the frozen artifact and the served bytes is returned to the ordering step before the deployment is reported complete.

### WEBDEP-SC-CONSISTENCY-02 — Rule violation: the deploy order lets one version reference something absent

Migrations, assets, and the entry document are published in an order that leaves a reference dangling. The
expected outcome publishes so nothing ever names something not yet present and keeps both versions servable;
a migration incompatible with the currently serving build is the failure.

#### Checklist

- [ ] WEBDEP-CK-CONSISTENCY-02-01 — Backward-compatible migrations are applied before the code that needs them.
- [ ] WEBDEP-CK-CONSISTENCY-02-02 — Every asset and chunk is uploaded before the entry document that names them.
- [ ] WEBDEP-CK-CONSISTENCY-02-03 — The entry document is published last.
- [ ] WEBDEP-CK-CONSISTENCY-02-04 — The previous and the new entry document can both be served correctly at the same time throughout the rollout.
- [ ] WEBDEP-CK-CONSISTENCY-02-05 — A migration that is not backward compatible with the currently serving build stops the deploy.
- [ ] WEBDEP-CK-CONSISTENCY-02-06 — A migration that is not backward compatible with the currently serving build triggers the reverse path.

## Risk

### WEBDEP-SC-RISK-01 — Rule violation: an action is taken without authority for that exact action

A deployment reaches a step that needs credentials, a publication, a promotion, or a rollout advance, and the
authority for that exact action was never granted. The expected outcome stops at the boundary with the
artifact, the verification evidence, and the reverse path preserved, then names the first blocked action and
the authority it requires; proceeding on assumed, inherited, or adjacent authority is the failure.

#### Checklist

- [ ] WEBDEP-CK-RISK-01-01 — No credential is used without explicit authority for that exact action.
- [ ] WEBDEP-CK-RISK-01-02 — Nothing is published, promoted, or advanced without explicit authority for that exact action.
- [ ] WEBDEP-CK-RISK-01-03 — A blocked action stops with the artifact, the verification evidence, and the reverse path preserved.
- [ ] WEBDEP-CK-RISK-01-04 — The first blocked action and the authority it requires are named.

### WEBDEP-SC-RISK-02 — Normal case: source maps are generated and their publication decided

Every shipped bundle needs a readable stack path, and a published map re-exposes the original source. The
expected outcome generates a map per bundle and decides its publication deliberately; one global setting
standing in for that decision is the failure.

#### Checklist

- [ ] WEBDEP-CK-RISK-02-01 — A production source map is generated for every shipped bundle.
- [ ] WEBDEP-CK-RISK-02-02 — Publication is decided per map rather than by one global setting.
- [ ] WEBDEP-CK-RISK-02-03 — An unpublished map still reaches the error reporter so a stack trace can be read.
- [ ] WEBDEP-CK-RISK-02-04 — It is recorded, per bundle, whether its map is published, where an unpublished map is delivered instead, and whether original sources are embedded in it.

### WEBDEP-SC-RISK-03 — Adversarial: a rollout advances on assumed authority or a stop is bypassed

A stage advances because time passed, an earlier stage looked fine, or a signal was absent rather than good,
and an upload is described as a deployment. The expected outcome rejects each of those; compliance shaped to
let the rollout continue rather than to judge it is the failure.

#### Checklist

- [ ] WEBDEP-CK-RISK-03-01 — No rollout stage advances while a stop condition is met.
- [ ] WEBDEP-CK-RISK-03-02 — No stage advances on elapsed time, an absent signal, or a prior stage's success in place of observed signals.
- [ ] WEBDEP-CK-RISK-03-03 — No completed upload, green build, or passing preview is counted as a verified deployment.
- [ ] WEBDEP-CK-RISK-03-04 — A published map on a surface whose source is not public is routed to `web-security` as an exposure question rather than settled here.

## Overall

### WEBDEP-SC-OVERALL-01 — Normal case: one running release with a known identity, verification, and reverse path

A complete deployment answers what was built, how it is cached and named, in what order it went out, how it
was verified live, how it comes back, and what authority remains. The scenario fails when one of those is
unanswered, or when deployment, verification, and health are reported as one status.

#### Checklist

- [ ] WEBDEP-CK-OVERALL-01-01 — The deployment record answers build identity, cache and naming contract, deploy order, rollout stages, live verification, reverse path, and authority state.
- [ ] WEBDEP-CK-OVERALL-01-02 — Deployment, live verification, and observed health are reported as separate claims.
- [ ] WEBDEP-CK-OVERALL-01-03 — Every irreversible data change, retained artifact, retention window, and remaining risk is recorded.
- Also applies: WEBDEP-CK-RISK-01-04 (first blocked action and its authority named).
