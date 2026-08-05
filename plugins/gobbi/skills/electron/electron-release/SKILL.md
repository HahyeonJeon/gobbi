---
name: electron-release
description: "MUST load when preparing or executing an Electron release from verified packaged artifacts, including support policy, version transitions, update channels, release readiness, publication, rollout, withdrawal, or post-release recovery."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Electron Release

Electron Release takes one accepted immutable Packaging candidate for each target operating system and
architecture. It prepares, reviews, or executes one release and returns an exact release record or an
explicit stop.

This operation owns support policy, version transitions, update channels, release-readiness acceptance,
external authority, publication, rollout, withdrawal, and post-release recovery. Packaging keeps ownership
of candidate construction and final bytes, while Testing keeps ownership of test work and evidence.

Release policy and metadata may change, but accepted candidate bytes remain unchanged throughout this
operation. Every claim and external action stays specific to its candidate, target, channel, and destination.

## Principles

### Release starts after candidate acceptance

Release receives an accepted Packaging record rather than source or an unfinished artifact. A missing field
or changed byte returns to Packaging without reconstruction here.

### Readiness and authority are separate decisions

Passing evidence can establish release readiness but cannot authorize an external action. Each publication,
promotion, rollout, withdrawal, credential use, or store action needs its own recorded authority.

### Update policy is target specific

An update mechanism, channel, predecessor set, and compatibility result apply only to their named target.
Evidence from another operating system, architecture, channel, or predecessor cannot establish the claim.

### Recovery preserves exact known state

Forward fixes are the ordinary post-release recovery path because installed state may already have changed.
Rollback is allowed only from current compatibility, updater-path, evidence, and authority records.

## Rules

- **MUST start from one complete accepted immutable Packaging candidate per target operating system and
  architecture.** Recompute or verify its checksum and return any changed bytes, identity mismatch, or
  missing candidate evidence to Packaging without rebuilding or modifying the artifact.

- **MUST record the complete release policy before requesting readiness evidence.** Include support state,
  version transition, target and minimum operating-system versions, architecture, distribution target,
  predecessor set, compatibility, update mechanism and channel, rollout stages, withdrawal criteria,
  recovery plan, and named decision and external-action authorities.

- **MUST keep Testing as the sole owner of test design, execution, interpretation, environment
  classification, and evidence.** Release supplies claims and requested scenarios, then accepts readiness or
  stops from the identity-matched record Testing returns.

- **MUST record readiness before every external action and require exact authority for that action.** Protect
  credentials and keep each destination, publication, promotion, rollout, feed, store, or withdrawal action
  inside its recorded candidate, target, channel, and authority.

- **MUST stage rollout against accepted Observability signals and explicit stop thresholds.** Record every
  stage decision, stop new rollout on a threshold breach, and preserve the exact external state and
  diagnostic records.

- **NEVER construct, sign, notarize, rebuild, or mutate a candidate or claim work owned by Testing or complete
  delivery.** Release may prepare policy and metadata, accept readiness, perform authorized external actions,
  and decide only the recovery established by current observed state.

## Procedure

### Phase 1 — Accept the Release Subject

#### 1.1 Classify the request and target set

- Classify the work as preparation, read-only review, or execution. Preparation may create release policy,
  metadata, requests, and readiness records; review changes nothing; execution may perform only the exact
  external actions authorized later in this procedure.
- Identify one release subject with its application version and exactly one accepted immutable candidate
  owned by [`electron-packaging`](../electron-packaging/SKILL.md) for each target operating system and
  architecture.
- Record the affected decision makers, credential owners, external-action authorities, operators, users,
  support staff, distribution destinations, and current external state.
- Stop on an ambiguous mode, target, actor, or authority. Preserve the candidate records and name the owner
  that can decide the missing fact.

#### 1.2 Verify every Packaging candidate

- Require each candidate record to contain the recorded build-input identity, candidate artifact path and
  checksum, operating system and architecture, pinned Electron major, manifest, security and signature
  state, installer metadata, accepted packaged and installed evidence, installation instructions,
  limitations, diagnostics, and reproduction command.
- Recompute the checksum from the candidate bytes when they are locally available, or verify the recorded
  checksum through the accepted artifact store when direct access is unavailable. Record the verification
  method, time, and result without changing the artifact.
- Reject a missing field, failed Packaging evidence, target mismatch, identity mismatch, or changed byte.
  Return the unchanged record and exact failure to Packaging; never repair, rebuild, sign, notarize, or patch
  the candidate in Release.
- Keep one candidate identity and checksum through every later policy, evidence, authority, action, and
  recovery record.

### Phase 2 — Define Support, Version, and Update Policy

#### 2.1 Record support and transition decisions

- Record the application version, pinned Electron major, current support state, target and minimum
  operating-system versions, architecture, distribution target, and release decision authority.
- Define the supported predecessor set for each target and channel. State unsupported predecessors and the
  user-visible path available to them.
- Record installed-data, settings, and protocol compatibility for fresh install, update, restart, forward
  fix, and any proposed rollback. Use the accepted [`electron-contract`](../electron-contract/SKILL.md)
  record for observable behavior and never infer compatibility from retained files alone.
- Define rollout stages, stage populations, entry and exit conditions, withdrawal criteria, stop thresholds,
  the forward-recovery plan, and the authority that may change each decision.

#### 2.2 Select one update mechanism and channel per target

- Use the current [Updating Applications](https://www.electronjs.org/docs/latest/tutorial/updates) guidance
  and [Distribution Overview](https://www.electronjs.org/docs/latest/tutorial/distribution-overview) beside
  the project's distribution decision. Record the selected feed, store, package-manager, managed-deployment,
  or manual update mechanism instead of prescribing one mechanism for every target.
- Electron's built-in
  [`autoUpdater`](https://www.electronjs.org/docs/latest/api/auto-updater/) supports macOS and Windows, with
  target-specific requirements. Linux ordinarily uses its distribution's package manager; record a different
  accepted mechanism only when the project explicitly selects and supports it.
- Define each release-metadata identity as its local path or provider object ID, version, and checksum when
  the metadata has stable bytes. Record that identity with the channel, feed or store destination, target
  operating system and architecture, accepted predecessor routing, signature expectations, restart behavior,
  and rejected downgrade or cross-channel paths.
- Stop on an unsupported mechanism, missing distribution decision, ambiguous channel, or incompatible
  predecessor. Return a release-policy defect here and a mechanism dispute to Runtime.

#### 2.3 Check current Electron support and transition facts

- At the time of the decision, read the current [Electron release
  policy](https://www.electronjs.org/docs/latest/tutorial/electron-timelines),
  [release schedule](https://releases.electronjs.org/schedule), and
  [stable releases](https://releases.electronjs.org/?channel=stable). Record the lookup time, sources, pinned
  major support state, and affected target constraints without copying a transient current version into this
  skill.
- For a major transition, inspect every applicable item in Electron's live
  [Breaking Changes](https://www.electronjs.org/docs/latest/breaking-changes) between the predecessor and
  target majors. Record the affected contract, update, compatibility, and support decisions.
- Reconcile current official facts with the pinned Electron major and the
  [`electron-runtime`](../electron-runtime/SKILL.md) record. Stop on an unresolved contradiction rather than
  using current documentation as proof for a different major.

### Phase 3 — Request and Accept Release-Readiness Evidence

#### 3.1 Send the Release to Testing request record

- Use the dynamic `Release ↔ Testing` exchange. Release supplies the request identity, immutable candidate
  record and checksum, target operating system and architecture, supported predecessor set, update mechanism,
  release-metadata identity, channel, compatibility policy, rollout and withdrawal claims, recovery claims,
  and requested update scenarios.
- Request every applicable successful predecessor, fresh-install, update, download, metadata, install,
  restart, migration, version-reporting, forward-recovery, and proposed rollback scenario needed by the
  release policy.
- Request every material failure path: interrupted download; unavailable feed, store, or update service;
  invalid, stale, unsigned, or tampered update metadata or artifact where applicable; failed install; failed
  restart or first launch; and partially applied migration.
- State the claim and required environment for every scenario. Do not prescribe a method, run a test,
  classify an environment, interpret a result, or create evidence.

#### 3.2 Check the Testing return record

- Require the return to match the request identity, candidate checksum, target operating system and
  architecture, supported predecessor, channel, update mechanism, release-metadata identity, and environment
  requirements.
- Require Testing to classify every environment and return predecessor, update, install, restart, migration,
  recovery, and rejection evidence or an explicit failure for every requested scenario.
- Check identity, completeness, environment classification, and Testing's recorded result only. Do not
  reinterpret a failure, substitute a proxy observation, or change the requested claim after seeing the
  result.
- Route changed bytes or candidate identity defects to Packaging, release-policy defects to this operation,
  behavior defects to the earliest owner, and mechanism contradictions to Runtime.

#### 3.3 Record readiness or stop

- Accept release readiness for a target only when every required scenario has a complete identity-matched,
  environment-classified, passing Testing record for the same candidate checksum.
- Record the ready candidate, target, predecessor set, channel, update mechanism, release-metadata identity,
  compatibility policy, accepted evidence identity, limitations, decision authority, decision time, and
  invalidation conditions.
- A changed support fact, release policy, release-metadata identity, update mechanism, channel, target,
  predecessor set, or required environment invalidates every affected Testing request, readiness decision,
  and later action. Create a replacement request and record a new readiness decision before any later
  external action; route changed candidate bytes to Packaging without modifying them here.
- A failed case or unavailable required environment stops the affected target at its last accepted state.
  Retain the candidate, request, returned record, limitations, and responsible owner without relabeling the
  gap as readiness.
- Readiness authorizes no publication, promotion, rollout, feed mutation, store action, credential access, or
  withdrawal.

### Phase 4 — Authorize and Execute External Release Actions

#### 4.1 Record exact external authority

- Before each action, recheck the readiness record, unchanged candidate checksum and release-metadata
  identity, current destination state, and current authority for the exact candidate, version, target,
  channel, destination, action, and time.
- Require the recorded credential owner or external-action authority before accessing a protected credential
  or changing a feed, store, repository, update service, deployment service, or release destination.
- Keep protected values out of metadata, logs, requests, responses, and release records. If authority,
  credentials, or a service is unavailable, stop before the action and retain the exact local and external
  state.

#### 4.2 Publish or promote an authorized release

- Publish or promote only the authorized candidate and metadata to the named destination. Do not reuse one
  target's authority, action, or result for another operating system, architecture, channel, or destination.
- Record destination, application version, candidate checksum, release-metadata identity, target operating
  system and architecture, channel, action identity, start time, completion or failure, returned remote
  identity, and observed remote state.
- After a partial or failed action, inspect and retain what is present, absent, visible, or still mutable at
  the destination. Stop before a retry, compensation, deletion, promotion, or second destination unless that
  exact next action has current authority.

#### 4.3 Roll out, observe, pause, and withdraw

- Advance only through the accepted rollout stages. Before each stage, check the same candidate, target,
  channel, current stage population, prior stage decision, accepted
  [`electron-observability`](../electron-observability/SKILL.md) signals, signal time range, and stop
  thresholds.
- Record each stage start, population, diagnostic state, threshold comparison, decision authority, decision,
  and resulting external state. Missing, stale, mismatched, or unavailable required signals stop advancement.
- On a threshold breach or material failure, pause or stop new rollout and preserve the release, diagnostic,
  and external-state records. Withdraw the affected release or update only when that exact action is
  authorized.
- Withdrawal prevents or reduces later acquisition where the destination supports it; it does not repair
  installed machines or prove recovery for any affected user.

### Phase 5 — Recover and Return the Release Record

#### 5.1 Choose and observe post-release recovery

- Use a forward fix by default after publication or installation. Create a new candidate through Packaging,
  obtain a new checksum and Testing record, make a new readiness decision, and repeat every affected
  external-action gate.
- Consider rollback only when the prior candidate, installed-data and settings compatibility, protocol
  compatibility, updater path, target, predecessor state, current passing Testing evidence, and rollback
  authority all support it.
- Record the recovery population, current installed state, action, diagnostic signals, observed result,
  unresolved machines, limitations, and next decision. Never describe machines as recovered when they were
  not observed or repaired.
- A failed recovery stops new action at the last known state. Preserve current feeds, stores, rollout state,
  installed-state evidence, diagnostics, and authority limits for the next decision.

#### 5.2 Return a complete record or exact stop

- For each target operating system and architecture, record the immutable candidate identity and checksum;
  support and version-transition decision; predecessor, channel, release-metadata identity, update-mechanism,
  and compatibility policy; Testing request and accepted evidence; readiness decision and limitations; and
  decision, credential, and external-action authorities.
- Record every publication, promotion, rollout, pause, withdrawal, and recovery action with its destination,
  action identity, result, current remote state, Observability signals, affected population, and unresolved
  limitation.
- Complete the release only when every field has an exact value or explicit not-applicable status and every
  external state has been rechecked after its last action.
- For an exact stop, return the failed target and state, last accepted record, candidate and release-metadata
  identities, retained evidence, local and external state, responsible owner, required decision, and next
  authorized action.
- Claim no artifact construction, test ownership, complete delivery, publication beyond an observed
  destination, rollout beyond an observed stage, or recovery beyond observed machines.

## References

- [`Electron Release Checklist`](checklists.md) owns reusable evaluation coverage for this operation.
