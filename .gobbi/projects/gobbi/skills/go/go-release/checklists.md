# Go Release Evaluation Checklist

Unchecked evaluation source for Go release work governed by [Go Release](SKILL.md). Its stable owner prefix is
`GOREL`; apply it to the exact release subject, selected mode, action specifications, authority records,
executor-returned state, verification, and terminal result.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked binary conditions; it defines no result, score, or remedy.

A row is defined once beneath its owning scenario. An `Also applies` line may point only to a row defined
elsewhere in this source and carries no checkbox.

## Project

### GOREL-SC-PROJECT-01 — Normal case: A module release is prepared from exact module facts

Preparation receives a final `go-modules` result and a requested module release. The prepared record should
bind the unchanged module and consumer facts to one project-authorized version and tag decision without
creating a ref or treating readiness as authority; an inferred version, stale target, or effect fails.

#### Checklist

- [ ] GOREL-CK-PROJECT-01-01 — The selected mode is exactly `Preparation`.
- [ ] GOREL-CK-PROJECT-01-02 — The immutable input record contains the module path, repository root and module subdirectory, major-version suffix, `go` directive, module's Go language version, exact public package paths and project commands, dependencies, external-consumer result, module consumer compatibility analysis, target object, evidence limits, and applicable redacted private-read evidence.
- [ ] GOREL-CK-PROJECT-01-03 — The release classification identifies `module` and exactly one of `pre-release` and `stable`, with the applicable unstable-v0, patch, minor, first-stable, or breaking-major implication.
- [ ] GOREL-CK-PROJECT-01-04 — The release compatibility analysis is exactly `compatible`, `migration supplied`, `authorized break`, or `unsupported` and names affected consumers and evidence limits.
- [ ] GOREL-CK-PROJECT-01-05 — The exact module version, semantic version tag, fully qualified ref name, module-subdirectory prefix, applicable major-version suffix, and target object come from the user or named project decision authority.
- [ ] GOREL-CK-PROJECT-01-06 — The prepared record contains unchanged inputs, release compatibility analysis, exact version and tag decision, readiness evidence, one complete action specification, authority request, recovery semantics, required executor, and first recovery action.

### GOREL-SC-PROJECT-02 — Normal case: A binary or archive release is prepared from final bytes

Preparation receives the final Packaging handoff for one binary or archive. The release should use its exact
checksum identity and bounded evidence unchanged; a filename, visible version, rebuilt copy, or old checksum
cannot identify the subject.

#### Checklist

- [ ] GOREL-CK-PROJECT-02-01 — The immutable input record contains the binary or archive kind, exact artifact path, byte size, permission mode, checksum algorithm/value, source/build/input identities, project default build command plus named target, selected Go toolchain version, `GOOS/GOARCH` target, cgo inputs, flags and tags, embedded or adjacent metadata, inventories, smoke result, reproducibility position, consumer compatibility, evidence limits, and recovery state.
- [ ] GOREL-CK-PROJECT-02-02 — Every readiness and action claim uses the unchanged final checksum identity received from `go-packaging`.
- [ ] GOREL-CK-PROJECT-02-03 — The binary or archive classification, compatibility decision or explicit not-applicable reason, exact version, and semantic tag or explicit not-applicable reason come from the user or named project decision authority.
- [ ] GOREL-CK-PROJECT-02-04 — The readiness record names the destination, expected consumer observation, evidence limits, requested effects, expected states, retained-state rule, recovery owner, and first non-mutating recovery action.

### GOREL-SC-PROJECT-03 — Rule violation: A mode inherits or performs a forbidden effect

The record selects a release mode but borrows an effect from another mode, from readiness, or from an executor.
Each mode should retain its exact writes, execution, access, pause, terminal, and recovery boundary; inherited
credentials, direct mutation, or an input rebuild fails.

#### Checklist

- [ ] GOREL-CK-PROJECT-03-01 — Preparation's effect set is exactly authorized local release-metadata writes, approved local release records, metadata and identity checks, no caches or downloads, no network access, no credential use, no publication, no external mutation, and no rebuild.
- [ ] GOREL-CK-PROJECT-03-02 — Read-only verification coordination's effect set is exactly read-only project and artifact access, one approved local verification record, local inspection of exact inputs and returned evidence, no caches or downloads, no rebuild, and destination reads only through a separately authorized named owner.
- [ ] GOREL-CK-PROJECT-03-03 — Authorized external-action coordination's effect set is exactly authorized local release metadata and returned-action records, no caches or downloads, no rebuild, no direct Git or destination mutation, and only manager-authorized effects executed by named owners.
- [ ] GOREL-CK-PROJECT-03-04 — Credential use, network access, publication, and external mutation are each recorded as a separate fact in every mode.
- [ ] GOREL-CK-PROJECT-03-05 — Go Release performs no Git tag/ref action, destination action, destination read, input rebuild, deployment, rollout, or live-health action.

## Structure

### GOREL-SC-STRUCTURE-01 — Normal case: Decision, specification, authority, execution, and evidence stay separate

One release may move from preparation to an authorized executor and verification. The operation should preserve
five independently named records so that no readiness label, manager grant, executor acknowledgment, or action
receipt silently fills another record.

#### Checklist

- [ ] GOREL-CK-STRUCTURE-01-01 — The release contract names the acting agent, caller, trigger, requested result, decision authority, manager, exact subject, consumers, destinations, write boundary, non-goals, terminal result, and recovery boundary.
- [ ] GOREL-CK-STRUCTURE-01-02 — The action specification is a complete record independent of readiness and authority.
- [ ] GOREL-CK-STRUCTURE-01-03 — The manager authority record names the unchanged action identity, exact authorized effects, credential authority, network authority, publication authority, mutation authority, current validity, and withdrawal state.
- [ ] GOREL-CK-STRUCTURE-01-04 — Every requested effect has one named Git or non-Git executor.
- [ ] GOREL-CK-STRUCTURE-01-05 — The unchanged input, action identity, expected states, named executor, and current authority are each rechecked immediately before handoff.
- [ ] GOREL-CK-STRUCTURE-01-06 — No readiness result, complete specification, prior grant, executor name, or acknowledgment is represented as current action authority or returned execution evidence.

### GOREL-SC-STRUCTURE-02 — Edge case: A Git tag or ref action is supplied without defaults

The release requires an exact Git tag/ref action, including a compatible existing ref when applicable. The
caller-neutral specification should contain every Git-owned input and use the bounded one-way interface; a
direct command, wildcard, implicit configuration value, or guessed project policy fails.

#### Checklist

- [ ] GOREL-CK-STRUCTURE-02-01 — The Git action specification supplies `callerIdentity`, `repository`, `refName`, `targetObject`, `remote`, `tagForm`, `annotationInput`, `taggerIdentity`, `taggerTime`, `tagObjectInputs`, `signingInput`, `publicationTarget`, `expectedLocalState`, `expectedRemoteState`, and `requestedEffects` verbatim.
- [ ] GOREL-CK-STRUCTURE-02-02 — Every absent optional Git value uses its required literal `none` or `not-applicable` form without an omitted value, wildcard, revision expression, or implicit configuration default.
- [ ] GOREL-CK-STRUCTURE-02-03 — The semantic version tag, fully qualified ref name, module-subdirectory prefix, applicable major-version suffix, tag form, target object, repository, remote, and publication target agree with the current release decision and caller-supplied project policy.
- [ ] GOREL-CK-STRUCTURE-02-04 — Go Release supplies the unchanged action specification and separate current manager authority to Git Phase 5 without issuing a direct Git command or receiving Git's execution authority.

### GOREL-SC-STRUCTURE-03 — Normal case: A non-Git destination action has an exact owner contract

A binary, archive, or other release effect uses a non-Git destination. The specification should tell the named
owner exactly what result is requested and returned without inventing destination mechanics or combining
multiple effects under one ambiguous executor.

#### Checklist

- [ ] GOREL-CK-STRUCTURE-03-01 — The non-Git specification names caller identity, destination owner, destination identity, requested action and effects, unchanged input identity, credential scope, network scope, expected before state, expected after state, returned-result fields, evidence limits, and recovery boundary.
- [ ] GOREL-CK-STRUCTURE-03-02 — Every unused non-Git field has a literal evidence-based not-applicable reason.
- [ ] GOREL-CK-STRUCTURE-03-03 — Each non-Git effect and destination has one separately named executor, action identity, authority record, and returned result without invented destination commands or mechanics.

## Performance

### GOREL-SC-PERFORMANCE-01 — Poor quality: Coordination repeats expensive or externally visible work

The release record can be completed from unchanged local inputs and exact returned evidence, but the operation
rebuilds an artifact, repeats an executor action, or asks for broader destination reads. Coordination should
remain bounded to the missing evidence; repeated work or access hides recovery state and fails.

#### Checklist

- [ ] GOREL-CK-PERFORMANCE-01-01 — Go Release performs no rebuild, executor-action retry, duplicate publication request, or state-changing recovery to obtain evidence.
- [ ] GOREL-CK-PERFORMANCE-01-02 — Every local record, returned log, destination read, consumer check, retained object, and evidence observation stays within its named path, destination, identity, access, duration, and retention bound.

## Aesthetics

### GOREL-SC-AESTHETICS-01 — Poor quality: Release language hides distinct facts

The account is readable but uses broad words such as version, tag, state, artifact, or authority without naming
the exact object. A cold reader should distinguish every module, byte identity, ref, destination, executor,
effect, and terminal state without private context.

#### Checklist

- [ ] GOREL-CK-AESTHETICS-01-01 — Every release claim names the exact module path and version, semantic version tag, fully qualified ref name, module-subdirectory prefix, major-version suffix, target object, binary or archive checksum identity, destination, executor, requested effect, and authority fact it means when applicable.

### GOREL-SC-AESTHETICS-02 — Adversarial: Cosmetic readiness or action labels mask missing substance

The work has polished `ready`, `approved`, `published`, or `verified` labels but lacks bound identity, authority,
returned state, or consumer evidence. Form-only compliance should fail even when the headings and intended
version look correct.

#### Checklist

- [ ] GOREL-CK-AESTHETICS-02-01 — No readiness, approval, publication, or verification label substitutes for the exact input identity, version and tag decision, action specification, current authority, named executor, returned state, and evidence limits.
- [ ] GOREL-CK-AESTHETICS-02-02 — No polished terminal record substitutes for matching post-action and external-consumer observations of the unchanged subject.

## Usage

### GOREL-SC-USAGE-01 — Normal case: Read-only coordination verifies exact returned evidence

An executor has already attempted an action, and Go Release is asked to verify it without mutation. The mode
should inspect unchanged local inputs and exact returned state, delegate any destination read, and preserve an
evidence block when the required observation is unavailable.

#### Checklist

- [ ] GOREL-CK-USAGE-01-01 — Read-only verification coordination leaves project paths and release artifacts unchanged and writes only its approved local verification record.
- [ ] GOREL-CK-USAGE-01-02 — Every destination or external-consumer read is performed by a named external-action owner under separate exact credential and network read authority.
- [ ] GOREL-CK-USAGE-01-03 — Local inspection compares the unchanged release identity, action specification, authority identity, expected states, requested effects, and executor-returned evidence without recreation.
- [ ] GOREL-CK-USAGE-01-04 — An unavailable, stale, incomplete, ambiguous, or mismatched returned or destination observation produces an exact evidence block.

### GOREL-SC-USAGE-02 — Normal case: Authorized coordination accepts exact executor outcomes

The manager authorizes one Git or non-Git effect and names its executor. The operation should accept a Git
compatible no-op or an exact non-Git result when every bound fact matches, then verify the same subject with
its external consumer; an acknowledgment or local-only receipt is insufficient.

#### Checklist

- [ ] GOREL-CK-USAGE-02-01 — The manager authority remains current and unwithdrawn for the unchanged action immediately before executor handoff.
- [ ] GOREL-CK-USAGE-02-02 — An existing Git ref counts as `compatible-no-op` only when every supplied target, form, annotation, tagger, signing, expected-state, and requested-effect value matches.
- [ ] GOREL-CK-USAGE-02-03 — A non-Git destination result matches its named executor, action, destination, unchanged input identity, current authority, attempted effect, before state, after state, result, evidence limits, retained state, recovery, and handoff.
- [ ] GOREL-CK-USAGE-02-04 — `verified` requires every requested effect to be `completed` or `compatible-no-op` and every required local, destination, and external-consumer observation to match the unchanged release subject.

## Consistency

### GOREL-SC-CONSISTENCY-01 — Edge case: Input or authority changes after preparation

The module facts, final checksum, target object, expected state, executor, destination, or authority changes
after the action specification is prepared. Every dependent gate should reopen; selective reuse of the old
decision, grant, or evidence fails.

#### Checklist

- [ ] GOREL-CK-CONSISTENCY-01-01 — A changed module fact, final byte, checksum, target object, consumer, or evidence limit invalidates every dependent readiness, specification, authority, executor handoff, verification, and release-result claim.
- [ ] GOREL-CK-CONSISTENCY-01-02 — A changed action field, expected state, executor, destination, requested effect, or authority fact requires a new action identity and current manager authority before coordination resumes.
- [ ] GOREL-CK-CONSISTENCY-01-03 — Preparation, executor handoff, returned-state inspection, post-action verification, and external-consumer verification all use the same exact release identity.

### GOREL-SC-CONSISTENCY-02 — Expected failure: Returned evidence or consumer state does not match

The executor returns a partial or differently scoped result, or the external consumer cannot observe or use the
published subject. The release should remain failed, blocked, or recoverable-partial; reconstructing evidence
or calling the local action successful does not close the result.

#### Checklist

- [ ] GOREL-CK-CONSISTENCY-02-01 — Missing, stale, mismatched, ambiguous, or recreated executor evidence remains outside the completion claim with its first failure and affected obligation.
- [ ] GOREL-CK-CONSISTENCY-02-02 — A failed module-consumer check, checksum observation, destination observation, or other required external-consumer check prevents release result `verified`.

## Risk

### GOREL-SC-RISK-01 — Expected failure: Conflict or missing current authority stops before mutation

Preflight finds an existing incompatible ref or destination state, or current manager, executor, credential,
network, publication, or mutation authority is missing or withdrawn. The operation should stop without asking
the executor to change state; technical readiness or an earlier grant does not authorize the action.

#### Checklist

- [ ] GOREL-CK-RISK-01-01 — An incompatible local or remote ref, destination conflict, changed target, ambiguous state, or unavailable required observation stops coordination before any new mutation.
- [ ] GOREL-CK-RISK-01-02 — Missing, incomplete, stale, mismatched, or withdrawn manager authority, named executor, credential authority, network authority, publication authority, or mutation authority stops the exact effect before handoff.

### GOREL-SC-RISK-02 — Adversarial: Partial state invites unsafe recovery

An executor mutates one state and then fails, returns a verification mismatch, or cannot complete another
requested effect. The release should preserve literal recoverable partial state and require a newly exact
recovery action; force, delete, overwrite, retry, rollback, configuration change, or broader publication fails.

#### Checklist

- [ ] GOREL-CK-RISK-02-01 — Any requested effect left incomplete after mutation is reported with the literal `recoverable partial state`, release result `recoverable-partial`, and a terminal state other than `success`.
- [ ] GOREL-CK-RISK-02-02 — The partial-state record preserves exact local and remote or destination before and after state, returned logs, retained unique objects, evidence limits, first failure, affected obligation, risk, recovery owner, first non-mutating recovery action, authority still required, and handoff.
- [ ] GOREL-CK-RISK-02-03 — No delete, overwrite, force, retry, rollback, history rewrite, configuration change, broader publication, or destructive recovery is inferred.
- [ ] GOREL-CK-RISK-02-04 — Every later mutation has a new exact action, matching retained expected state, named executor, and current manager authority.

## Overall

### GOREL-SC-OVERALL-01 — Normal case: The terminal record tells the complete release truth

The operation reaches Preparation, verification, authorized coordination, failure, or recovery. Its final
record should use only the defined terminal and release-result states and carry every universal and release-
specific fact needed to understand the exact subject, effects, evidence, limits, and next safe action.

#### Checklist

- [ ] GOREL-CK-OVERALL-01-01 — The terminal state is exactly `success`, `error`, `cancellation`, `timeout`, `blocked`, or `user-decision pause`.
- [ ] GOREL-CK-OVERALL-01-02 — The release result is exactly `prepared`, `verified`, `failed`, `blocked`, or `recoverable-partial`.
- [ ] GOREL-CK-OVERALL-01-03 — The terminal record contains operation and mode, accepted result, decision basis, decision and action authority, exact module or artifact identity, release classification, compatibility, version and tag fields, readiness, specification, manager authority, named executor, returned state, post-action verification, external-consumer verification, changed or reviewed metadata paths, evidence and limits, credential use, network access, publication, external mutation, block, retained state and objects, recovery semantics, first failure, affected obligation, risk, authority still required, and handoff.
