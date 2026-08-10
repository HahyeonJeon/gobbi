---
name: gobbi-dev-release
description: "MUST load when preparing or recovering a Gobbi release candidate, supplying a frozen Gobbi release candidate to Evaluation before manager or user acceptance, or promoting, publishing, or recovering an accepted Gobbi release."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Gobbi Release

A release operator uses this operation to prepare and freeze a Gobbi candidate on `develop`, obtain an
independent Evaluation verdict and manager or user acceptance, then promote and publish the unchanged accepted
bytes. Completion is an exact verified `main` commit, annotated semantic-version tag, and hosted GitHub Release.

This operation owns candidate assembly and the hosted-release effect. Git retains branch, ref, tag, push,
merge, history, and cleanup authority; Evaluation retains its verdict; and the manager or user retains
acceptance and every external or destructive authorization.

## Principles

### Freeze before judgment

Evaluation and acceptance are meaningful only for one immutable candidate identity. Any changed commit,
tree, package byte, inventory, digest, or metadata creates a new candidate.

### Separate preparation from acceptance

A prepared candidate is not an accepted release. Accepted-release language begins only after Evaluation and
manager or user acceptance apply to the same frozen identity.

### Promote unchanged bytes

Release promotion changes where accepted bytes are referenced, not what they contain. A rebuild or metadata
change after acceptance must return through preparation and judgment.

### Preserve partial publication

A branch, tag, or hosted release may exist even when a later effect fails. Recovery starts from direct current
observations and never deletes, overwrites, or republishes by implication.

## Rules

- **MUST bind one candidate to the exact `develop` commit and tree, package tree, complete filtered inventory,
  digest, semantic version, manifests, marketplace metadata, annotated-tag message, hosted title, notes digest,
  draft or prerelease state, exact asset paths and digests, and verification evidence.** A mismatch or unreadable
  owner stops preparation without a release claim.
- **MUST freeze the candidate before Evaluation and obtain an independent criteria-derived verdict before
  manager or user acceptance.** Verdict and acceptance must name the same candidate identity and neither
  substitutes for the other.
- **MUST require accepted candidate bytes and metadata to remain unchanged through `main`, the annotated tag,
  hosted assets, and published observations.** Any identity change invalidates Evaluation and acceptance.
- **MUST delegate branch, ref, tag, push, merge, history, and cleanup effects to Git under exact current
  authority.** This operation may request and verify those effects but cannot infer or broaden their authority.
- **MUST require separate point-of-action authority, credentials, exact repository and tag, release metadata,
  assets, expected states, and effects before hosted publication.** Verify the hosted release and every asset
  after creation or return a recoverable partial state.
- **NEVER publish, overwrite, delete, retag, force, rebuild, clean up, or retry from stale evidence or broad
  approval.** Preserve every unique object and require a new exact action and authority after failure or drift.

## Procedure

### Phase 1 — Prepare Candidate

#### 1.1 Align version owners

- Take the caller identity, exact requested stage `prepare`, `evaluate`, `promote`, `publish`, or `recover`,
  stage-specific allowed effects, user-approved semantic version, clean `develop` worktree and head, release
  scope, expected package and documentation owners, checks, and decision criteria.
- Bind the requested stage to one action boundary: `prepare` enters Phase 1; `evaluate` requires a successful
  prepare receipt and enters Phase 2; `promote` requires the matching Evaluation result and enters Steps 2.2,
  2.3, 3.1, and 3.2; `publish` requires a verified promotion receipt and enters Step 3.3; `recover` requires an
  observed partial state and enters Phase 4. Reject unrequested effects and do not replay an earlier stage by
  implication.
- Validate the version against the project's current release format and require it to be unused in local and,
  when separately authorized, remote observations. Do not infer a version from history or increment it here.
- Update only the approved version owners through their canonical mechanisms. Require both plugin manifests
  and the Claude marketplace entry to agree, and keep unrelated package metadata unchanged.
- Run the owner checks for version, manifests, marketplaces, documentation, and included-source consistency.
  Stop with the exact owner and retained local diff on any mismatch.

#### 1.2 Materialize and freeze the filtered package

- Reconcile canonical sources and generated repository views through their owners, then materialize the plugin
  package through the package owner. Require the repository-local-only family to remain canonical and locally
  discoverable while absent from the package.
- Run the complete source, fixture, link, shell, package, and isolated installed-runtime checks required by the
  accepted release contract. A skipped, substituted, unavailable, or unreadable required observation fails
  preparation.
- Create one focused verified local commit on `develop` through `gobbi-dev-development` and the Git owner when
  preparation changed tracked bytes. Re-read the commit and require a clean worktree.
- Freeze the candidate commit and tree, `develop` head, version, both manifests, marketplace metadata, package
  tree, filtered relative-path inventory, per-file hashes, aggregate digest, checks, environments, evidence
  limits, expected `main` and tag targets, exact annotated-tag message, hosted title, notes digest, draft or
  prerelease state, and exact asset paths and digests.
- Return a successful prepare terminal receipt binding the freeze, requested stage, allowed and completed local
  effects, retained state, and evidence limits. Stop before Evaluation until a separate `evaluate` request names
  that exact receipt.

### Phase 2 — Evaluate Candidate

#### 2.1 Freeze exact candidate identity

- Enter only for an `evaluate` request that names a successful prepare receipt and permits the read-only
  Evaluation handoff. Do not perform promotion or publication effects in this stage.
- Recompute the complete candidate identity from the committed tree before handoff. Require every field to
  equal the Phase 1 freeze and require `develop` to point to that exact commit. Recompute and compare the exact
  annotated-tag message, hosted title, notes digest, draft or prerelease state, and asset paths and digests.
- Make the candidate and required unchecked sources available read-only. Include the accepted release outcomes,
  criteria, prior failures, verification evidence, known limits, and exact expected publication effects.
- Stop and return to Phase 1 if any byte, identity, target, criterion, or required evidence changes or is
  missing. Do not patch a frozen candidate in place.
- Return a successful Evaluation-handoff terminal receipt binding the prepare receipt, unchanged candidate,
  publication identity, criteria, read-only handoff, allowed effects, and evidence limits. Stop while the
  independent Evaluation owner evaluates the subject.

#### 2.2 Obtain Evaluation verdict

- Enter only for a `promote` request that supplies the successful Evaluation-handoff receipt and the independent
  Evaluation result for the same candidate. Validate that Evaluation inspected the actual frozen subject with
  caller-supplied criteria and returned findings and a criteria-derived verdict without changing it.
- Require the report to name the exact candidate identity, independence, method, evidence, gaps, limits,
  problems, and verdict. A missing verdict, insufficient evidence, blocking problem, or identity mismatch
  stops promotion.
- Preserve a rejected or unevaluable candidate as historical evidence. Route a correction to its earliest
  owner and start a new candidate identity after any change.

#### 2.3 Obtain manager or user acceptance

- Continue promotion only when the requested `promote` stage permits these checks and the Evaluation result
  matches the exact candidate. No Git or hosted effect is permitted by this acceptance check.
- Present the frozen candidate identity, Evaluation result, exact intended `main`, annotated tag, hosted
  release metadata and assets, risks, and requested actions to the manager or user.
- Require explicit acceptance of that candidate only. Record rejection, deferral, or requested revision
  without publication.
- Record explicit acceptance with the exact candidate identity and Evaluation result before entering Phase 3.
- Acceptance authorizes no Git, network, credential, hosted publication, or cleanup effect by itself. Each
  effect waits for its owning point-of-action authority.

### Phase 3 — Promote and Publish Accepted Release

#### 3.1 Prove unchanged bytes and exact main head

- Enter only for the same `promote` request after a matching Evaluation verdict and explicit manager or user
  acceptance. Require stage-specific Git effects and current authority before requesting any mutation.
- Immediately before promotion, reobserve the accepted candidate, `develop`, local `main`, repository identity,
  and, only under current read authority, remote refs and hosted target. Require expected states to match.
- Require the candidate commit and tree, package inventory, per-file hashes, digest, version, and metadata to
  equal the accepted identity. Stop and invalidate downstream authority on any drift.
- Bind the exact target `main` preimage and the allowed promotion form. A conflict, unexpected commit,
  ambiguous repository, dirty worktree, changed remote, or existing incompatible tag or hosted release is a
  recoverable stop.

#### 3.2 Request Git actions

- Give the Git owner the accepted candidate, exact repository, `develop` source, `main` preimage and target,
  fully qualified semantic-version tag, annotated-tag inputs, remote, expected ref states, and current authority
  for each requested effect.
- Let Git promote `main`, create the annotated tag at the exact accepted `main` commit, and publish only the
  authorized refs without force. Git returns direct local and remote observations for every effect.
- Require `main` and the peeled tag target to equal the accepted candidate commit and tree. A missing,
  partial, conflicting, or unverifiable Git result stops before hosted publication and preserves all refs.
- Cleanup is not part of promotion. It requires its own later authority and complete Git proof.
- Return a verified promotion terminal receipt binding the candidate, Evaluation, acceptance, exact Git
  effects and observations, current refs, retained objects, and evidence limits. Stop before hosted publication
  until a separate `publish` request names that receipt.

#### 3.3 Execute and verify hosted GitHub Release

- Enter only for a `publish` request that names the verified promotion receipt and grants exact hosted,
  credential, network, metadata, and asset effects at the point of action.
- Recheck the accepted identity, exact published tag, repository, hosted-release expected state, current
  network and credential authority, title, notes, prerelease or draft state, and exact asset paths and digests.
- Create only the named hosted release and upload only the accepted assets. Do not edit or replace an existing
  incompatible release, use an implicit tag, regenerate an asset, or widen visibility.
- Observe the hosted release identifier and URL, repository, tag, target commit, state, title, notes digest,
  asset names, sizes, and digests. Require every observation to equal the accepted specification.
- Completion is a release receipt binding the candidate, Evaluation, acceptance, Git results, hosted results,
  authority, effects, limits, and retained recovery objects. Hand the unchanged released identity to
  `gobbi-dev-deployment` only when its trigger applies.

### Phase 4 — Recover Exact State

#### 4.1 Preserve partial state and bind separate authority

- Enter only for a `recover` request that names the observed partial state, exact recovery action, expected
  states, allowed effects, and current owner-specific authority.
- On the first failure, stop later effects and inventory the current candidate, branches, tag, package, hosted
  release, assets, and relevant observations under existing read authority. Never infer rollback from failure.
- Record each effect as not attempted, compatible no-op, completed, failed, unavailable, or retained. Include
  the first useful sanitized diagnostic, affected obligation, unique objects, risk, evidence limit, owner, and
  first non-mutating recovery action.
- Require a new complete action whose expected states match current observations and new current authority for
  its exact Git, hosted, credential, network, or cleanup effects. Re-run the affected preflight before mutation.
- Preserve any branch, tag, release, asset, credential state, or candidate whose safe ownership or compatibility
  cannot be proved. Recovery completes only after every requested effect is directly verified or explicitly
  retained for another owner.

## References

- [Release checklists](checklists.md) supplies reusable unchecked candidate, Evaluation, publication, and
  recovery conditions subordinate to this operation.
