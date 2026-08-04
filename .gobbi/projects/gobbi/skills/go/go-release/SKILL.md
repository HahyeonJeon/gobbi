---
name: go-release
description: "MUST load when versioning, publishing, verifying, or recovering a Go module, binary, or archive release."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Release

Go Release prepares, coordinates, verifies, or recovers one exact Go module, binary, or archive release. It
returns a prepared release contract, a verified release result, or an exact failed, blocked, or recoverable
partial state.

This operation owns Go-domain release classification, release compatibility analysis, the exact version and
tag decision, readiness evidence, action specifications, post-action and external-consumer verification,
recovery semantics, and the release result. It consumes final `go-modules` facts or `go-packaging` checksum
identity unchanged and never recreates, rebuilds, or alters those inputs.

Exactly three modes exist: **Preparation**, **Read-only verification coordination**, and **Authorized
external-action coordination**. The manager grants current authority, the Git operation executes an exact
tag/ref action, and a named external-action owner executes or reads a non-Git destination; Go Release only
supplies contracts and verifies returned evidence.

## Principles

### Bind every claim to immutable release input

A module fact set or final binary or archive checksum identity is the release subject. Any changed or missing
input invalidates every dependent decision, action specification, authority record, and verification claim.

### Keep readiness separate from authority

Compatibility, exact version and tag decisions, readiness evidence, and a complete action specification can
justify an authority request. They never grant manager, Git, credential, network, publication, or mutation
authority.

### Coordinate through the effect owner

Go Release decides and verifies the Go-domain result but performs no Git ref or destination mutation. Each
effect stays with its manager-authorized named executor and returns exact state to this operation.

### Preserve partial state literally

After any attempted external effect, exact returned state is more important than a clean narrative. An
incomplete requested effect after mutation is always a `recoverable partial state`, never success.

## Rules

- **MUST select exactly one of the three modes and bind its complete effect contract before action.** Record
  project writes, local records, caches or downloads, execution, network access, credential use, external
  mutation, publication, pause, terminal result, and recovery as separate facts.
- **MUST consume exact final module facts or final binary or archive checksum identity without rebuilding or
  alteration.** Stop and invalidate the dependent contract when any input, checksum, target object, authority,
  expected state, executor, or destination changes.
- **MUST obtain every exact version and tag decision from the user or named project decision authority.** Apply
  current official Go module version and tag rules without fixing a Go release number or inventing project
  policy.
- **MUST keep the action specification, current manager authority, named executor, executor-returned state, and
  verification as separate records.** A complete or ready record never fills, grants, or proves another one.
- **NEVER rebuild an input, run a Git tag/ref or destination mutation, use a credential, access a network, or
  publish from this operation.** Supply the exact contract to the named owner and inspect only local or returned
  evidence within the selected mode.
- **NEVER infer force, delete, overwrite, retry, rollback, history rewrite, configuration change, broader
  publication, destructive recovery, deployment, rollout, or live-health authority.** Preserve the exact state,
  risk, owner, and first non-mutating recovery action when the requested result is incomplete.

## Procedure

### Phase 1 — Bind the Release Subject and Mode

#### 1.1 Bind the actor, request, subject, and consumers

- Record the acting agent, caller, trigger, requested release result, user or named project decision authority,
  manager, exact module, binary, or archive subject, consumers, destinations, and accepted compatibility
  obligation.
- Bind one immutable input identity. Use the final `go-modules` result for a module release or the final
  `go-packaging` checksum identity for a binary or archive release. Name any combined consumer evidence, but do
  not merge two input identities into one ambiguous subject.
- State project writes, approved local records, caches or downloads, execution, credential use, network access,
  publication, external mutation, non-goals, terminal result, and recovery before any mode-specific action.
- Stop when the actor, result, input identity, consumer, decision authority, manager, effect owner, destination,
  or write boundary is unknown.

#### 1.2 Select exactly one mode and bind its effects

- **Preparation:** project writes are limited to caller-authorized local release metadata; local writes are
  approved release records; caches and downloads are none; execution is metadata and identity checks only;
  network access, credential use, publication, and external mutation are none. Pause before an unresolved exact
  version or tag decision or incomplete action specification. Return prepared exact inputs, compatibility,
  version and tag, readiness, action specification, authority request, recovery semantics, or an exact block.
  Retain inputs and metadata and name the manager, required executor, and first recovery action.
- **Read-only verification coordination:** project paths and local release artifacts are read-only; local writes
  are limited to an approved verification record; caches, downloads, and rebuilds are none; execution is local
  inspection of the exact inputs and returned executor evidence. Go Release uses no network or credential; a
  named external-action owner performs any destination read under separately authorized read credentials and
  network access. Pause before destination access or state-changing recovery. Return post-action verification or
  an exact destination or evidence block, retaining returned destination state and naming recovery owner and
  action.
- **Authorized external-action coordination:** project writes are none beyond caller-authorized local release
  metadata; local writes are approved returned-action logs and external-state records; caches, downloads, and
  rebuilds are none; direct execution of Git tag/ref or destination mutation is none. No credential, network,
  publication, or external-mutation authority is inherited; the manager grants the exact current authority and
  named executors use only that grant. Pause before the grant and executor are exact, and repeat the gate after
  any input, authority, expected-state, executor, or destination change. Return a verified release result for
  the exact subject or the exact executor-returned partial state.

### Phase 2 — Validate and Classify the Exact Release

#### 2.1 Validate unchanged module facts or artifact identity

- For a module release, consume the module path, repository root and module subdirectory, major-version suffix,
  `go` directive, module's Go language version, exact public package paths and project commands, dependencies,
  external-consumer result, module consumer compatibility analysis, target object, changed or reviewed paths,
  evidence limits, and private-read evidence when applicable. Do not propose a version from module readiness.
- For a binary or archive release, consume the kind, exact artifact path, byte size, permission mode, checksum
  algorithm and value, source/build/input identities, project default build command plus named target, selected
  Go toolchain version, `GOOS/GOARCH` target, cgo inputs, flags and tags, embedded or adjacent metadata,
  inventories, smoke result, reproducibility position, consumer compatibility, evidence limits, and recovery
  state.
- Inspect the supplied identity without changing it. Stop if required facts are missing, if a module fact or
  final byte changed, or if readiness evidence names a different target object, checksum, consumer, or input.
- Recheck the same identity immediately before authority, executor handoff, post-action verification, and final
  result. Return to this step after any mismatch; never recreate evidence in Release.

#### 2.2 Classify compatibility, version, and tag

- Classify the subject as exactly one of `module`, `binary`, or `archive`, and classify the intended release as
  `pre-release` or `stable`. For module versions, use the current official
  [module release workflow](https://go.dev/doc/modules/release-workflow/) to distinguish pre-release, unstable
  v0, first stable, patch, minor, and breaking-major implications.
- Return the release compatibility analysis as exactly `compatible`, `migration supplied`, `authorized break`,
  or `unsupported`, naming affected consumers and evidence limits. If compatibility is not applicable to a
  binary or archive contract, record the exact reason instead of inventing a state.
- Obtain the exact module version, semantic version tag, and fully qualified ref name from the user or named
  project authority. Validate the semantic version, module-subdirectory tag prefix, and major-version suffix
  relationship against the current official [Go Modules Reference](https://go.dev/ref/mod#mapping-versions-to-commits).
- Record the module path, module version, semantic version tag or explicit not-applicable reason, fully
  qualified ref name or explicit not-applicable reason, module-subdirectory prefix, major-version suffix when
  applicable, target object, and binary or archive checksum identity when applicable. Do not derive a project
  tag form, signing rule, repository, remote, or publication target from Go convention.
- Pause with the compared evidence, affected obligation, decision owner, and exact question when the version,
  tag, compatibility break, or release class is unresolved.

#### 2.3 Establish readiness and recovery semantics

- Bind readiness to the unchanged input identity, compatibility result, exact version and tag decision,
  target object, destination, required consumer checks, and every evidence limit. A label such as `ready` or
  `approved` without these facts is not readiness evidence.
- Define the requested effects, expected pre-action state, expected post-action state, post-action observation,
  external-consumer verification, retained-state rule, recovery owner, first non-mutating recovery action, and
  any later mutation that would require separate exact authority.
- In Preparation, return `prepared` only after this complete readiness record and one complete action
  specification exist. `prepared` is not a verified release and grants no effect authority.

### Phase 3 — Specify Authority and Coordinate the Named Executor

#### 3.1 Build and supply the Git-owned action specification

- For a Git tag/ref effect, build the caller-neutral action specification owned by the
  [Git tag/ref action contract](../../git/conventions.md#caller-supplied-tagref-action-contract). Supply every
  required field verbatim: `callerIdentity`, `repository`, `refName`, `targetObject`, `remote`, `tagForm`,
  `annotationInput`, `taggerIdentity`, `taggerTime`, `tagObjectInputs`, `signingInput`, `publicationTarget`,
  `expectedLocalState`, `expectedRemoteState`, and `requestedEffects`.
- Use the contract's exact named `none` and `not-applicable` values. Supply no default, wildcard, revision
  expression, implicit configuration value, direct Git command, or additional effect.
- Bind the action identity to the unchanged Go release subject and decision record. If any supplied field or
  expected state changes, discard the old action identity and rebuild the specification before authority.

#### 3.2 Specify an exact non-Git destination action

- For each non-Git effect, record the caller identity, named destination owner, exact destination identity,
  requested action and effects, unchanged module or checksum input identity, credential scope, network scope,
  expected before state, expected after state, returned-result fields, evidence limits, and recovery boundary.
- Use literal not-applicable reasons for unused fields. Do not invent destination mechanics, commands,
  credentials, defaults, or recovery behavior; the named external-action owner owns those details.
- Keep one executor and one authority identity per effect. Multiple destinations or effects require separately
  named specifications and results even when they share one release subject.

#### 3.3 Bind current manager authority separately

- Obtain a current manager authority record for the unchanged action. For Git, require `authoritySource`, the
  verbatim `authorizedAction`, `networkAuthority`, `credentialAuthority`, and `authorityState` from the Git
  contract; for non-Git work, require equally exact action identity, destination, credential, network,
  publication, mutation, validity, and withdrawal facts.
- Record credential use, network access, publication, and external mutation as four separate facts. `none` in
  one fact neither implies nor authorizes another.
- Stop before executor coordination when authority is missing, stale, withdrawn, incomplete, broader than the
  action, narrower than a requested effect, or mismatched to any input, expected state, executor, or destination.
  Readiness, a complete specification, and prior authority never substitute for current authority.

#### 3.4 Coordinate only the named executor

- Immediately before handoff, recheck the immutable input, action identity, expected states, named executor,
  and current authority. A withdrawal or change stops the handoff without an external effect.
- For a Git tag/ref action, supply the specification and authority to the named Git executor through
  [Git Phase 5](../../git/SKILL.md#phase-5--execute-one-caller-supplied-tagref-action). The Git operation alone
  preflights, creates an exact local ref or compatible no-op, performs any exact non-force publication, and
  verifies local and remote state.
- For a non-Git action or destination read, supply the exact specification and authority to its named
  external-action owner. Go Release performs neither the action nor the read and receives no credential or
  network authority.
- Record the handoff identity and wait for the exact returned result. An executor name or acknowledgment is not
  execution evidence.

### Phase 4 — Verify Returned State and Bound Recovery

#### 4.1 Validate the executor-returned result

- Require the Git result fields exactly: `actionAndAuthority`, `preflight`, attempted `actions`, `localAfter`,
  `remoteAfter`, per-effect `result`, `evidenceLimits`, `failure`, `recovery`, and `handoff`. Require each effect
  result to be exactly `completed`, `compatible-no-op`, `failed`, or `verification-mismatch`.
- Require the Git preflight and result to name the repository, target object, ref name, form, annotation,
  tagger identity and time, other tag-object inputs, signing state, local and remote before and after states,
  credential and network readiness, attempted commands or API actions, retained unique objects, first failure,
  affected obligation, risk, recovery owner, first non-mutating recovery action, separate mutation authority,
  and next handoff.
- Require a non-Git result to match its exact executor, action, destination, unchanged input identity, current
  authority, attempted effect, before state, after state, result, evidence limits, retained state, first failure,
  recovery owner and action, authority still needed, and handoff.
- Reject an omitted, stale, mismatched, ambiguous, or recreated result. Use the literal `recoverable partial
  state` whenever a requested effect is incomplete after any mutation.

#### 4.2 Perform post-action and external-consumer verification

- In the selected mode, compare local inputs and executor-returned evidence with the unchanged release subject,
  action specification, authority identity, expected states, and requested effects. Do not repair evidence or
  repeat an executor action.
- Name the external-consumer verification owner, consumer, exact module version or binary/archive checksum
  identity, destination, expected observation, evidence limit, and separate read authority. The owner performs
  any destination or consumer read and returns its exact observation.
- Treat unavailable destination evidence, a different ref or target, a checksum mismatch, missing module
  version, failed consumer use, or any unobserved required effect as a failed or blocked release result. A local
  action receipt alone does not prove external consumption.
- Return `verified` only when every requested effect is `completed` or `compatible-no-op`, every required local
  and external observation matches, and the external consumer verifies the same unchanged subject.

#### 4.3 Preserve conflicts, partial state, and safe recovery

- On preflight conflict, authority withdrawal, missing access, failed action, verification mismatch, consumer
  failure, or changed input, preserve the exact known before and after state, returned logs, unique objects,
  evidence limits, affected obligation, risk, owner, and first non-mutating recovery action.
- Infer no delete, overwrite, force, retry, rollback, history rewrite, configuration change, broader
  publication, or destructive recovery. A later state-changing recovery requires a newly supplied exact action
  whose expected state matches the retained state, a currently named executor, and new current manager
  authority for that action.
- Coordinate a recovery only when the new action remains within the named executor's bounded contract. Otherwise
  retain the state and return the missing authority, unsafe request, first non-mutating action, and handoff.

### Phase 5 — Return the Go Release Result

#### 5.1 Return one exact terminal record

- Select the universal terminal state from exactly `success`, `error`, `cancellation`, `timeout`, `blocked`, or
  `user-decision pause`. Record `panic` only as observed Go program behavior, never as the operation state.
- Select the release result from exactly `prepared`, `verified`, `failed`, `blocked`, or `recoverable-partial`.
  `prepared` is Preparation's bounded result; `verified` requires Step 4.2; `recoverable-partial` requires the
  literal `recoverable partial state` and can never have terminal state `success`.
- Return the operation and mode; accepted result; decision basis and authority; exact owned module, binary, or
  archive; terminal state; release result; changed or reviewed metadata paths; evidence and limits; credential
  use; network access; publication; external mutation; compatibility decision or not-applicable reason; block;
  recovery; and handoff.
- Add the release classification; module path; module version; semantic version tag; fully qualified ref name;
  module-subdirectory prefix; major-version suffix; target object; binary or archive checksum identity;
  readiness evidence; action specification; manager authority; named executor; returned Git or non-Git state;
  post-action verification; external-consumer verification; recovery semantics; retained objects and state;
  first failure; affected obligation; risk; and authority still required. Explain every inapplicable field.

#### 5.2 Complete only the owned result

- Complete Preparation only as `prepared`. Complete verification or authorized coordination only as `verified`
  for the exact unchanged subject; otherwise return `failed`, `blocked`, or `recoverable-partial` with its exact
  evidence and recovery boundary.
- Hand a verified published Go artifact and its evidence to the applicable external owner only when later work
  is separately requested. Go Release owns no deployment, installation, environment configuration, migration,
  traffic promotion, rollout, or live-health action.
- When this result enters Evaluation, apply the [evaluation checklist](checklists.md) and every active Go sibling
  checklist. General Evaluation owns evidence resolution and verdicts.

## References

- [Evaluation checklist](checklists.md) is the local unchecked evaluation source for this skill.
