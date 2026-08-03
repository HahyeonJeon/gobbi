---
name: web-deployment
description: "MUST load when configuring a web build for production or when deploying, verifying, or reversing a web release, covering bundler configuration, chunking, asset hashing, production source maps, rollout, and rollback."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, WebFetch
skill-type: operation
---

# Web Deployment

Use this operation to turn one release-ready web build into a running, verified, reversible deployment. It
covers bundler configuration, chunking and code splitting, asset hashing and cache lifetimes, production
source maps and whether they are published, migration and cutover order, staged rollout, live verification,
and the reverse path. It stops at the authority boundary rather than crossing it.

`web-development` coordinates an accepted release into this operation and keeps deployment authorization,
deployment state, and live health as separate claims; the deployment action begins exactly here.
[`electron-release`](../../electron/electron-release/SKILL.md) holds the same lifecycle position for an
installed desktop artifact, which a person must download, install, and later update; this operation places a
build behind a URL the same person merely reloads. The discipline transfers, the work does not.

`typescript-toolchain` owns compiling, emit, and module resolution; this operation owns the bundle those tools
feed and where it goes. `web-topology` owns where build outputs live in the repository, `web-architecture`
chooses the rendering and delivery strategy this operation ships, `web-backend` owns what a migration means to
the data while this owns when it runs relative to the cutover, `web-security` owns which data is protected
while this owns not republishing source through a map, and `web-observability` owns the signals a rollout is
judged by. `web-configuration` owns per-environment values, secret supply, and feature-flag lifetime; this
operation owns the environment's identity and the frozen build inputs, not the values inside them.

## Principles

### Deployment action begins at its owned handoff

`web-development` preserves the lifecycle route after release acceptance and reports deployment authority,
deployment state, and live health as separate claims. This operation converts the accepted release handoff
into one running release whose identity, verification, and reverse path are all known.

### The reverse path is designed before the deploy, not after it

A rollback planned once the failure is visible is planned under pressure, with the broken version already
serving and the previous build possibly already deleted. Decide and rehearse the reverse while the previous
version is still whole.

### A successful build proves nothing about a deployment

A green local build, a passing preview, and a completed upload each establish a different fact. Only a
request served from the production URL establishes what people actually receive.

### Bytes and identity travel together

Every deployed artifact carries a content-derived name and a recorded build identity, so a cache entry, a
stale client, and an incident report all resolve to exactly one build. A reused name makes those three
disagree while none of them looks wrong.

## Rules

- **MUST freeze and record one build identity before anything in the target environment changes.** Record the
  source commit, lockfile, build configuration, tool and runtime versions, artifact digests, target
  environment, and who or what is authorized to deploy it.

- **MUST give every cacheable asset a content-derived filename and a long-lived immutable freshness lifetime
  while keeping the entry document revalidated.** Under [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111) a
  fresh response is reused without contacting the server and the
  [RFC 8246](https://www.rfc-editor.org/rfc/rfc8246) `immutable` extension suppresses even revalidation, so a
  reused asset name or a cached entry document is how one deploy serves two versions.

- **MUST publish assets before the document that references them and retain the previous build's assets
  through the whole rollback window.** A client holding the old document, a warm edge cache, and an in-flight
  lazy chunk all request files by the names they already have.

- **MUST generate a production source map for every shipped bundle and decide deliberately whether each map is
  published.** A published map re-exposes original source, comments, and file layout to anyone who can fetch
  the bundle, and an unpublished map must still reach the error reporter or no stack trace can be read.

- **MUST rehearse the reverse path before the first forward step and verify the release from the production
  URL before calling the deployment complete.** Prove the served build identity, the entry document, at
  least one hashed asset, and one authoritative round trip; a completed upload is not a verified deployment.

- **NEVER use credentials, publish, promote, or advance a rollout without explicit authority for that exact
  action.** Stop at the boundary with the artifact, verification evidence, and reverse path preserved, then
  name the first blocked action and the authority it requires.

## Procedure

### Phase 1 — Bind the Release and Its Authority

#### 1.1 Take the handoff and freeze the build identity

- Start from `web-development`'s accepted release handoff or the requesting caller's equivalent, including its
  compatibility notes, rollout and rollback intent, configuration state, and deployment-authority state.
- Refuse a handoff whose evaluation is unresolved or whose limitations carry no user disposition, then freeze
  the source commit, lockfile, dependency graph, build configuration, tool and runtime versions, environment
  identity, and the target the build is for.
- Record the frozen input set and one build identity that the build embeds and every later artifact, log, and
  error report carries.
- Continue with the frozen identity; return an unresolved evaluation, an undisposed limitation, or an absent
  deployment authority to `web-development` or the user before configuring anything.

#### 1.2 Establish the environment contract and rehearse the reverse path

- Take the frozen identity plus the target's current serving arrangement: origin, cache or edge layer, entry
  document, asset paths, currently deployed build, and the data migrations pending against it.
- Define the reverse path before any forward step — the exact previous artifact, how it is restored, how long
  its assets are retained, which data changes are reversible and which are not, and who may activate the
  path — loading `web-backend` for what an irreversible migration means and `web-architecture` when the
  rendering or delivery mode itself is changing, then rehearse that path while the previous version is still
  whole by restoring the named artifact in a pre-production target that mirrors production, or by running the
  production target's documented dry run when no such target exists.
- Record the environment contract, the retention window for the previous build, the reverse path with its
  owner and expected duration, the rehearsal's evidence, observed duration, and any step it could not
  exercise, and the stop conditions that trigger it.
- Continue when the rehearsal restored the previous build and a named person could repeat it without further
  design; treat a change that has no reverse path as a decision needing explicit user authority rather than a
  step to take carefully.

### Phase 2 — Configure the Production Build

#### 2.1 Configure the bundle, chunks, and code splitting

- Take the frozen inputs, the delivery strategy `web-architecture` selected, and the project's current bundler
  and its configuration.
- Preserve a working bundler and change only what this release requires: set one entry point per delivered
  surface, split code at boundaries people actually cross such as a route, a deferred feature, or a rarely
  reached dependency, and keep a shared dependency in one chunk instead of duplicating it across entries.
- Record the emitted chunk graph, the per-entry transferred size, every dynamic-import boundary, and which
  chunks a first visit must fetch before the page is usable.
- Continue when the graph matches the delivery strategy; route a compiler, emit, module-resolution, or
  type-stripping failure to `typescript-toolchain` instead of working around it in bundler configuration.

#### 2.2 Configure asset hashing and cache lifetimes

- Take the chunk graph and the target's cache or edge layer, including any directive that layer adds or
  overrides.
- Derive every cacheable asset filename from its content, serve those assets with a long-lived immutable
  freshness lifetime, and keep the entry document revalidated so it can point at new names as soon as it
  changes.
- Record the naming scheme, the freshness lifetime per class of file, and the entry document's directives as
  they are actually served rather than as configured.
- Continue when a rebuilt but unchanged asset keeps its name and a changed asset receives a new one; treat any
  cacheable asset served under a name whose content can change as the defect that produces a stale or missing
  chunk after the next deploy.

#### 2.3 Decide production source maps and their publication

- Take the emitted bundles and the error-reporting destination `web-observability` established, including
  whether it can accept an uploaded map.
- Generate a source map for every shipped bundle, then decide per map whether it is published beside the
  bundle or delivered only to the error reporter, because
  [ECMA-426](https://ecma-international.org/publications-and-standards/standards/ecma-426/) links a map
  through a `//# sourceMappingURL` annotation or an equivalent HTTP header that anyone fetching the bundle can
  follow.
- Record, per bundle, whether its map is published, where an unpublished map is delivered instead, and whether
  original sources are embedded inside it.
- Continue when every shipped bundle has one readable stack path; route a published map on a surface whose
  source is not public to `web-security` as an exposure question rather than settling it here.

### Phase 3 — Deploy in Order

#### 3.1 Order migrations, assets, and the entry document

- Take the verified build, the frozen identity, the reverse path, and the pending data migrations.
- Order the deploy so nothing ever references something not yet present: apply backward-compatible migrations
  before the code that needs them, upload every asset and chunk before the entry document that names them, and
  publish the entry document last.
- Record each step's completion time, the moment the entry document changed, and confirmation that the
  previous build's assets are still in place.
- Continue only while the previous and the new entry document can both be served correctly at the same time;
  stop and reverse when a migration is not backward compatible with the currently serving build, because the
  two versions overlap throughout any rollout.

#### 3.2 Advance the rollout under a stop condition

- Take the ordered deploy, the Step 1.2 stop conditions, and the signals `web-observability` emits.
- Advance in the smallest stage the target supports and hold each stage long enough for error, latency, and
  outcome signals to move, and never advance while a stop condition is met.
- Record each stage boundary, its traffic share, the signals observed during the hold, and the decision taken
  at the end of it.
- Advance only on observed signals; reverse on a met stop condition without waiting for a diagnosis, then
  diagnose from the restored state.

### Phase 4 — Verify, Reverse, or Stop

#### 4.1 Verify the live release from the production URL

- Take the deployed release and the production URL people actually use, not a preview alias, an origin bypass,
  or a staging host.
- Fetch the entry document and confirm the served build identity, fetch at least one hashed asset and one
  lazily loaded chunk, exercise one authoritative round trip end to end, and read the cache directives as
  served.
- Record the served build identity, the observed response headers, the exercised path with its authoritative
  effect, and every difference from the frozen artifact.
- Ask `web-testing` for suite evidence and `web-platform` for a disputed browser fact; return any mismatch
  between the frozen artifact and the served bytes to Step 3.1 before reporting the deployment complete.
- When this deployment is evaluated, the [evaluation checklist](checklists.md) and every checklist owned by
  an active `web` sibling supply the applicable conditions; the general Evaluation operation resolves them
  and issues any verdict.

#### 4.2 Reverse, or stop at the authority boundary

- Take the verification evidence, the reverse path, and the remaining authority state.
- Reverse immediately on failed verification or a met stop condition by restoring the previous entry document
  and confirming its assets are still served, then re-verify the restored release through Step 4.1 rather than
  assuming the reverse succeeded.
- Record the deployed or reversed state, the served build identity, the verification and reverse evidence,
  retained artifacts and their retention window, every irreversible data change, and the remaining risk.
- Report deployment, live verification, and observed health as separate claims to `web-development` or the
  requesting caller; when a remaining action needs credentials or authority that was not granted, stop with
  everything preserved and name the exact blocked action and the authority it requires.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
