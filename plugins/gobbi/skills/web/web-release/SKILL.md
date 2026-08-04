---
name: web-release
description: "MUST load when producing or reviewing a web production build or release artifact, including frozen inputs, bundler configuration, chunking, asset names and cache policy, build identity, production source maps, or the artifact handoff to deployment."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebFetch
skill-type: operation
---

# Web Release

Use this operation to turn one evaluated `web-development` handoff into one immutable, identified production
artifact that deployment can consume unchanged. It owns frozen and recorded inputs, production build and
bundler configuration, chunking, asset names and cache policy, build identity, manifest and digests,
production source maps, artifact verification, failure return, and the release-to-deployment handoff.

`web-development` coordinates the evaluated handoff into this operation. [`web-deployment`](../web-deployment/SKILL.md)
accepts the resulting artifact and owns environment identity, target authority, publication, rollout, live
verification, and rollback. Release may state the intended deployment handoff and source-map disposition, but
it neither grants deployment authority nor changes an environment.

`typescript-toolchain` owns compiling, emit, module resolution, and type stripping;
`web-project-structure` owns build-output placement; `web-architecture` owns rendering and delivery strategy;
`web-configuration` owns the values and secrets management inside frozen inputs; `web-security` owns every
protected-data exposure question; and `web-observability` owns telemetry destinations. This operation owns
the production artifact those decisions produce.

## Principles

### The evaluated handoff freezes before production begins

A production artifact is reproducible only when its source, dependencies, configuration, toolchain, and
requirements stop moving. Freeze and record those inputs before release work begins, then return any needed
change to its owner instead of silently changing the release under construction.

### Artifact bytes and identity travel together

Every file, manifest entry, digest, build log, and error report resolves to one build identity. The identity
does not describe similar bytes; it identifies the exact production artifact that deployment will receive.

### Cache behavior is part of the release contract

Content-derived asset names and cache policy determine whether old documents and new artifacts can coexist.
Define that contract in the artifact and release record so deployment can publish it without renaming or
rebuilding anything.

### Release completion grants no environment authority

A verified production artifact proves release production, not publication, deployment, live verification,
or observed health. Those claims stay separate, and release stops with its evidence intact at the first
environment action.

## Rules

- **MUST freeze and record the complete production input set before release production begins.** Include the
  source commit, lockfile, dependency graph, build configuration, tool and runtime versions, artifact
  digests, evaluated limitations, and release requirements.

- **MUST produce one immutable artifact whose manifest, files, digests, build log, source-map disposition,
  and release record identify the same build.** Deployment consumes those accepted bytes without rebuilding,
  renaming, or modifying them.

- **MUST derive every cacheable asset name from its content, keep changed and unchanged names accurate, give
  cacheable assets a long-lived immutable freshness policy, and keep the entry document revalidated.** One
  reusable name must never address changed content.

- **MUST generate a production source map for every shipped bundle and decide each map's disposition.** Route
  every protected-data exposure question arising from release inputs, production artifacts, maps, or output
  to `web-security`; a release decision does not authorize publishing a map.

- **MUST verify the complete artifact before handoff and return a failed input, tool, or output to its owner.**
  Name the failure and hand off no partial artifact.

- **NEVER use a deployment credential, publish, promote, or change a target environment.** Preserve the
  artifact and evidence, name the blocked action and any exact authority supplied for it, and leave every
  environment action to `web-deployment`.

## Procedure

### Phase 1 — Bind the Evaluated Handoff

#### 1.1 Freeze and record production inputs

- Start from `web-development`'s evaluated handoff or the requesting caller's equivalent, including its
  compatibility notes, configuration state, release requirements, evaluation result, and every approved
  limitation disposition.
- Refuse an unresolved evaluation or an undisposed limitation, then freeze the source commit, lockfile,
  dependency graph, build configuration, tool and runtime versions, artifact digests, and release
  requirements before release production begins.
- Record the same frozen input set and assign one build identity that the production build embeds and every
  later artifact, log, and error report carries.
- Continue with that recorded identity; return any input that must change to its semantic owner and restart
  from the newly evaluated handoff rather than mixing input sets.

#### 1.2 Route adjacent questions and define the deployment handoff

- Take the frozen inputs, the selected delivery strategy, the configured telemetry destination, and the
  intended deployment handoff named by the release requirements.
- Route compiling, emit, and module resolution to `typescript-toolchain`; build-output placement to
  `web-project-structure`; rendering and delivery strategy to `web-architecture`; per-environment values and
  secrets management to `web-configuration`; every protected-data exposure question arising from release
  inputs, production artifacts, or release output, including public source exposure, to `web-security`; and
  telemetry destinations to `web-observability`.
- Record the intended artifact consumer, required manifest and evidence, and the release requirements it must
  satisfy, without recording an environment credential or granting publication, promotion, or deployment
  authority.
- Continue when each adjacent decision has one owner; return a compiler, emit, module-resolution, or
  type-stripping failure to `typescript-toolchain` instead of hiding it in bundler configuration.

### Phase 2 — Produce the Production Artifact

#### 2.1 Configure the bundle and chunk graph

- Take the frozen inputs, the delivery strategy `web-architecture` selected, and the project's current
  bundler and configuration.
- Preserve a working bundler and change only what this release requires: use one entry point per delivered
  browser interface, split at boundaries people cross such as a route, deferred feature, or rarely reached dependency,
  and keep shared dependencies in one chunk rather than duplicating them across entries.
- Record the emitted chunk graph, per-entry transferred size, every dynamic-import boundary, and the chunks a
  first visit fetches before the page is usable.
- Continue when the graph matches the delivery strategy and each emitted file remains attributable to the
  frozen build identity.

#### 2.2 Define asset names and cache policy

- Take the emitted entry documents, chunks, assets, and the cache behavior required by the delivery strategy.
- Derive every cacheable asset filename from its content, give a rebuilt unchanged asset the same name and a
  changed asset a new name, assign cacheable assets a long-lived immutable freshness policy, and keep the
  entry document revalidated.
- Record the naming scheme, freshness lifetime for each file class, and entry-document cache policy in the
  release record; deployment later records those directives as observed from the production URL.
- Continue when no cacheable name can address two different byte sequences and an old entry document can
  still identify the asset names it was built to load.

#### 2.3 Generate and disposition production source maps

- Take every shipped bundle and the error-reporting destination `web-observability` established, including
  whether it accepts an uploaded map.
- Generate a source map for every shipped bundle and decide per map whether the artifact marks it for public
  publication or delivers it only to the error reporter; a `sourceMappingURL` annotation or equivalent HTTP
  header makes a published map discoverable by anyone who fetches the bundle.
- Record each bundle-to-map relation, whether original sources are embedded, the intended destination, and
  the decision that preserves one readable stack path.
- Continue when every shipped bundle has a map and an owned readable-stack path; return public-source or
  protected-data exposure to `web-security` before accepting the release.

### Phase 3 — Identify and Verify the Artifact

#### 3.1 Build the manifest and release record

- Take the emitted files, build identity, chunk graph, cache contract, source-map dispositions, build log,
  and the project-approved resource and size limits.
- Produce one release manifest listing every deployable file, each file's digest and role, and the one build
  identity; name artifacts so a cold deployer can identify their role and build identity.
- Record production-build duration and peak resource use with runner, tool, and input conditions; compare
  entry, chunk, and asset sizes with project-approved limits, or report the measurements without inventing a
  limit; and identify the artifact, manifest, build log, and source-map disposition without author context.
- Continue when every artifact file has one manifest entry and a measured regression beyond an approved limit
  has either blocked the release or received an authorized limitation disposition.

#### 3.2 Reconcile inputs, files, digests, and identity

- Take the frozen inputs, complete artifact set, manifest, release record, and source maps.
- Compare the manifest file set with the artifact set, recompute every listed digest from its file bytes,
  confirm that frozen inputs, artifact files, manifest, and release record identify the same build, and prove
  every shipped bundle has its recorded source map and disposition.
- Produce the verified immutable artifact, manifest, release record, build log, and verification evidence.
- On failure, name the failed input, tool, or output, return it to its owner, and hand off no partial artifact;
  on success, seal the accepted artifact bytes against later rename, rebuild, or modification.

### Phase 4 — Hand Off or Return Failure

#### 4.1 Deliver immutable release evidence to deployment

- Take the verified artifact set, manifest and digests, build identity, cache and naming contract, source-map
  dispositions, release record, evaluation evidence, and intended deployment handoff.
- When this release is evaluated, use the [evaluation checklist](checklists.md) and every checklist owned by
  an active `web` sibling; the general Evaluation operation resolves the applicable conditions and issues the
  verdict.
- Hand the accepted immutable artifact and its evidence to `web-deployment`, explicitly requiring deployment
  to consume it without rebuilding, renaming, or modifying its bytes; grant no environment authority.
- Report release status separately from deployment authority, deployment state, live verification, and
  observed health. Stop with the complete artifact preserved when the next action needs a credential,
  publication, promotion, or environment change.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
