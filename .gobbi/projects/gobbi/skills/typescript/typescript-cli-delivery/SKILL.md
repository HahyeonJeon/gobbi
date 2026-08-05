---
name: typescript-cli-delivery
description: "MUST load when producing, validating, installing, releasing, rolling back, or recovering a TypeScript command delivered directly without a package archive, such as a standalone executable or archive, a script copied or linked directly to an install target, or a recorded workspace or repository revision plus command."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript CLI Delivery

TypeScript CLI Delivery turns one command delivered directly without a package archive into an identified,
distributed or installed, verified, and recoverable command for every authorized target. Direct non-archive
delivery means the consumer receives the command without installing a package archive. Examples are a
standalone executable or archive, a script copied or linked directly to an install target, and a recorded
workspace or repository revision plus command.

Package-backed command metadata is a command name or entry supplied by package metadata, including a
`package.json` `bin` entry, a package script, or a workspace package link. `typescript-packaging` owns that
metadata and its package behavior. A package-backed workspace command delivered directly loads both owners:
`typescript-packaging` owns its package metadata, while this operation owns the direct non-archive delivery.
A genuine hybrid distributes the same command through both a package archive and a direct non-archive method;
it loads both owners and preserves separate artifact identities and consumer entries.

Author mode may produce and deliver an authorized unit. Review-only validation inspects a pre-existing unit
without changing the reviewed subject. TypeScript compilation belongs to `typescript-toolchain`, and command
behavior test design belongs to `typescript-testing`.

## Principles

### Deliver one identified unit

Every build, installation, verification result, and recovery result must trace to one recorded file, archive,
script, or workspace or repository revision and command for its target.

### Prove the consumer entry

A source entry or same-name command cannot prove delivery. Verification starts from the command that the
target consumer receives and invokes.

### Rehearse recovery before delivery

The prior recoverable unit and its authorized restoration path must remain usable before the forward action
changes a target.

### Separate evidence from authority

A complete unit and green checks do not authorize installation, publication, promotion, or rollout. Each
external action needs its exact current authority.

## Rules

- **MUST bind each direct non-archive target to one literal unit, distribution or install method, and consumer
  command.** Load `typescript-packaging` too when package metadata backs the command or the same command also
  ships through a package archive, and keep each owner's artifact identity and consumer entry separate.
- **MUST freeze the inputs and prior recoverable unit before producing or delivering a candidate.** Record
  source, lockfile, toolchain, build configuration, unit identity and digest or revision, the prior unit, and
  the prior recoverable source-map state.
- **MUST keep compiler and command-test ownership separate.** Use `typescript-toolchain` for TypeScript
  compilation and `typescript-testing` for command behavior; this operation owns delivery evidence.
- **MUST keep review-only validation non-mutating outside its authorized disposable boundary.** It may install
  only a pre-existing unit into an isolated disposable target when authorized and must remove only that state.
- **MUST rehearse rollback before an in-scope delivery and verify the delivered unit after activation.** Stop
  rollout on failure, restore the prior unit and its map state through their authorized paths, and verify
  recovery.
- **NEVER invent or perform a target-specific action without its recorded owner and exact authority.** Treat a
  missing owner, unavailable obligation, or blocked external action as an unavailable lifecycle result.

## Procedure

### Phase 1 — Bind the delivery

#### 1.1 Define the mode, unit, targets, and authority

- Classify the work as author delivery or review-only validation before planning any mutation.
- Confirm that the consumer receives the command without installing a package archive. Select each target's
  literal delivery unit: a standalone executable or archive; a script copied or linked directly to its install
  target; a recorded workspace or repository revision plus command; or another direct non-archive method whose
  unit, method, and consumer command are recorded by name.
- Record whether package metadata supplies the command name or entry. Load `typescript-packaging` for a
  `package.json` `bin` entry, package script, or workspace package link; keep this operation active when that
  package-backed command is delivered directly. For a genuine hybrid, record the package-archive and direct
  non-archive artifact identities and consumer entries separately.
- Record every target operating system, architecture, and runtime. Record the distribution or install method,
  the target-specific distribution owner, and how the consumer resolves and invokes the command on each target.
- Record every supplied unit-size, resource, startup, or installation budget, its comparison rule, its
  requirement owner, and the actor or governing record authorized to accept a breach. Introduce no budget
  when none was supplied.
- Define the authority for production, installation, publication, promotion, rollout, rollback, recovery, and
  credential use. Name the first blocked external action and the authority it requires.
- Stop with an unavailable lifecycle result when a target obligation or its distribution owner is missing.

#### 1.2 Freeze inputs and recovery

- Freeze the source commit or digest, lockfile, toolchain and runtime versions, build configuration, and
  target matrix.
- Define the unit identity. Record standalone file or archive names and digests, the directly copied or linked
  script and its digest, or the workspace or repository revision plus command; apply the same literal identity
  rule to any other direct non-archive method.
- Record the prior recoverable unit, its retained location or revision, its compatibility boundary, and the
  authorized restoration method for every target.
- Bind the source-map disposition to each unit and target: maps are included with the unit, uploaded to a named
  symbolication target, intentionally withheld, or not produced. Record the map consumer, source-disclosure
  decision, access and credential boundary, retention, delivery target, and prior recoverable map state.
- Define the consumer-entry checks and post-delivery checks. Ask `typescript-testing` to own arguments,
  streams, exit status, signals, failure text, cleanup, and other supplied command behavior.

#### 1.3 Run review-only validation

- Continue through this step only in review-only validation. Inspect the frozen identity, existing unit,
  target records, existing delivery evidence, prior unit, and recorded recovery path.
- Do not edit reviewed files, produce or rebuild a unit, install into a persistent target, publish, promote,
  roll out, or change an active command.
- With command and installation authority, install only a unit that existed before the review into one named
  isolated disposable target. Confine all review-created state, including caches, to that boundary.
- Invoke the pre-existing unit from its disposable consumer entry and collect authorized command and identity
  results. Record a required new unit, persistent installation, or external effect as unavailable.
- Remove only the state created inside the disposable boundary. Return command results, findings, unavailable
  results, limitations, and the first blocked action, then stop before Phase 2.

### Phase 2 — Produce and prove the delivery unit

#### 2.1 Produce or collect the exact unit

- Continue into this phase only in author delivery.
- Give `typescript-toolchain` the frozen compilation inputs and use the recorded distribution owner for any
  target-specific builder, archive, installer, workspace, or other delivery obligation.
- Require `typescript-toolchain` final-map inspection evidence for every produced map. Bind the exact inspected
  maps to the unit and target before any include, upload, or withholding decision is executed.
- Run only the recorded production path. Do not invent signing, package-manager, registry, service, or
  deployment commands.
- Record the resulting unit identity, file sizes when a budget applies, digests or workspace or repository
  revision, build logs, target association, and any difference from the frozen plan.
- Return to Phase 1 when the unit or target contract changed. Repair through the owning producer when output
  differs from the contract, then produce and identify a new candidate before continuing.

#### 2.2 Verify the isolated consumer path

- Prepare the recorded distribution or install method in an isolated representative consumer for each target.
- Prove that the consumer command resolves to the candidate unit rather than a source entry or unrelated
  same-name command already on `PATH`.
- Give `typescript-testing` the consumer entry and run the applicable command-behavior checks against that
  entry. Keep those behavior results separate from installation and unit-identity results.
- Compare resource, size, startup, or installation results only with a supplied budget. Classify the exact
  candidate-and-target result under the recorded comparison rule.
- Treat a budget breach as a failed delivery requirement. Stop delivery and either repair and remeasure or
  obtain explicit current acceptance from the recorded requirement owner; an unrecorded actor cannot accept
  the breach, and an unresolved breach cannot proceed to release.
- Repair a production defect through Step 2.1. Repair command behavior through its implementation and test
  owners, then repeat the consumer installation, identity proof, and affected checks against the new unit.
- Stop with failed or unavailable evidence for every target that cannot complete its required consumer path.

### Phase 3 — Prepare delivery and recovery

#### 3.1 Rehearse rollback

- Enter this step when installation, publication, promotion, or rollout is in scope.
- Exercise the recorded restoration method inside an authorized representative target before changing the
  intended delivery target. Verify that the prior unit again owns the consumer command and still runs its
  required recovery checks.
- Record the target, prior-unit identity, restoration authority, commands or operator actions, duration,
  results, retained state, and any compatibility limit.
- Rehearse restoration of the prior map state or removal of the candidate map state under the recorded
  retention, disclosure, target, access, and credential boundaries. Verify the recovered map or
  symbolication state.
- Stop before delivery when rehearsal fails, the prior unit is unavailable, or recovery would cross an
  unauthorized or irreversible boundary.

#### 3.2 Stop at the authority boundary

- Present the candidate identity, target matrix, consumer results, recorded delivery method, source-map
  disposition and verification, budget state and any recorded-owner acceptance, rollback rehearsal,
  limitations, credentials boundary, and first external action to the authorized actor.
- Continue only when exact authority covers that action, target, unit, method, and current rollout stage.
- Preserve the candidate and return a delivery-ready handoff when authority is absent. Do not treat readiness
  as installation, publication, promotion, or rollout.

### Phase 4 — Deliver, verify, and recover

#### 4.1 Perform the authorized delivery

- Recheck the candidate identity, target state, prior recoverable unit and map state, rollback result, budget
  state and any acceptance, credentials boundary, and authority immediately before the action.
- Install, publish, promote, or roll out only the exact unit through the recorded method and authorized target
  stage. Use no credential or external destination outside that authority.
- Include a map with the unit, upload it to the named symbolication target, or withhold it only under the exact
  recorded authority, source-disclosure decision, access and credential boundary, and retention decision.
- Record the target, action, actor or automation, time, unit identity, result, and resulting active command.
- Stop further rollout on an action failure. Preserve the candidate, prior unit, logs, and target state for
  Step 4.3.

#### 4.2 Verify after delivery

- Resolve the command from the installed or activated target and prove that it selects the delivered unit.
- Run the recorded post-delivery identity, installation, activation, and `typescript-testing` command checks.
- Verify every included map from its delivered location and every uploaded map through the named
  symbolication target. Preserve an intentional withholding or not-produced result as its recorded state.
- Bind every result to the target and delivered unit identity. Keep an unavailable target result open rather
  than borrowing another target's evidence.
- Continue rollout only while every required check for the current stage passes. On any failed check, stop
  rollout and enter Step 4.3.

#### 4.3 Recover from a failed delivery

- Preserve the failed unit, target identity, logs, command results, and exact failure before restoration.
- Recheck rollback or recovery authority, then restore the prior unit through the recorded authorized path.
  Restore the prior map state or remove the failed unit's map state through its recorded authorized path.
- Resolve the target command again and prove it selects the restored prior unit. Run the recorded recovery
  checks and retain their results.
- Stop with the exact active state when restoration or recovery verification fails. Do not retry through an
  invented method, erase failure evidence, or call the target recovered.

### Phase 5 — Hand off the result

#### 5.1 Close traceability and hand off

- Map each target to the unit identity, checksum or revision, distribution or install method, consumer entry,
  source-map disposition and result, budget state and acceptance, post-delivery result, authority, rollback
  rehearsal, delivery action, and recovery result that apply.
- Hand off the target matrix, frozen inputs, unit names and operator-facing command names, checksums or
  revision identity, install method, map consumer, source-disclosure decision, access and credential boundary,
  retention, map target, prior recoverable map state, source-map disposition and result, budget comparison and
  any recorded-owner acceptance, post-delivery results, authority state, rollback and recovery results,
  limitations, retained evidence, and the next blocked action.
- Report delivery-ready, delivered, verified, failed, recovered, and unavailable states separately. A missing
  owner, authority, target result, or recovery result never becomes a pass.
- When this work is evaluated, the [evaluation checklist](checklists.md),
  [release checklist](release-checklists.md), and every checklist owned by an active `typescript` sibling
  supply the applicable conditions; the general Evaluation operation resolves them and issues any verdict.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
- [Release checklist](release-checklists.md) supplies reusable unchecked scenarios and atomic conditions for
  source-map release, budget gating, and their recovery and handoff.
