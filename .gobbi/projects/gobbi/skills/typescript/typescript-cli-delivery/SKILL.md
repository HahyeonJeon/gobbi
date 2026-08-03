---
name: typescript-cli-delivery
description: "MUST load when producing, validating, installing, releasing, rolling back, or recovering a non-package TypeScript command-line application such as a bundled executable, installed script, or workspace-distributed command."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# TypeScript CLI Delivery

TypeScript CLI Delivery turns one non-package command-line application into an identified, installed or
distributed, verified, and recoverable command for every authorized target. It covers bundled executables,
installed scripts, workspace-distributed commands, and a literal other non-package method.

Author mode may produce and deliver an authorized unit. Review-only validation inspects a pre-existing unit
without changing the reviewed subject. TypeScript compilation belongs to `typescript-toolchain`, and command
behavior test design belongs to `typescript-testing`.

## Principles

### Deliver one identified unit

Every build, installation, verification result, and recovery result must trace to one recorded file, archive,
script, or workspace revision and command for its target.

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

- **MUST bind each target delivery to one literal unit, distribution or install method, and consumer
  command.** Use an executable file or archive, an installed script, a workspace revision and command, or one
  literal other non-package method, and record the complete target matrix.
- **MUST freeze the inputs and prior recoverable unit before producing or delivering a candidate.** Record
  source, lockfile, toolchain, build configuration, unit identity and digest or revision, and the prior unit.
- **MUST keep compiler and command-test ownership separate.** Use `typescript-toolchain` for TypeScript
  compilation and `typescript-testing` for command behavior; this operation owns delivery evidence.
- **MUST keep review-only validation non-mutating outside its authorized disposable boundary.** It may install
  only a pre-existing unit into an isolated disposable target when authorized and must remove only that state.
- **MUST rehearse rollback before an in-scope delivery and verify the delivered unit after activation.** Stop
  rollout on failure, restore the prior unit through its authorized path, and verify recovery.
- **NEVER invent or perform a target-specific action without its recorded owner and exact authority.** Treat a
  missing owner, unavailable obligation, or blocked external action as an unavailable lifecycle result.

## Procedure

### Phase 1 — Bind the delivery

#### 1.1 Define the mode, unit, targets, and authority

- Classify the work as author delivery or review-only validation before planning any mutation.
- Select each target's literal delivery unit: an executable file or archive; an installed script and its
  install target; a workspace revision and command; or one literal other non-package unit, method, and
  consumer command.
- Record every target operating system, architecture, and runtime. Record the distribution or install method,
  the target-specific distribution owner, and how the consumer resolves and invokes the command on each target.
- Record any supplied unit-size, resource, startup, or installation budget. Introduce no budget when none was
  supplied.
- Define the authority for production, installation, publication, promotion, rollout, rollback, recovery, and
  credential use. Name the first blocked external action and the authority it requires.
- Stop with an unavailable lifecycle result when a target obligation or its distribution owner is missing.

#### 1.2 Freeze inputs and recovery

- Freeze the source commit or digest, lockfile, toolchain and runtime versions, build configuration, and
  target matrix.
- Define the unit identity. Record file or archive names and digests, the installed script and its digest, or
  the workspace revision and command; apply the same literal identity rule to a literal other non-package
  method.
- Record the prior recoverable unit, its retained location or revision, its compatibility boundary, and the
  authorized restoration method for every target.
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
- Run only the recorded production path. Do not invent signing, package-manager, registry, service, or
  deployment commands.
- Record the resulting unit identity, file sizes when a budget applies, digests or workspace revision, build
  logs, target association, and any difference from the frozen plan.
- Return to Phase 1 when the unit or target contract changed. Repair through the owning producer when output
  differs from the contract, then produce and identify a new candidate before continuing.

#### 2.2 Verify the isolated consumer path

- Prepare the recorded distribution or install method in an isolated representative consumer for each target.
- Prove that the consumer command resolves to the candidate unit rather than a source entry or unrelated
  same-name command already on `PATH`.
- Give `typescript-testing` the consumer entry and run the applicable command-behavior checks against that
  entry. Keep those behavior results separate from installation and unit-identity results.
- Compare resource, size, startup, or installation results only with a supplied budget and record the result.
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
- Stop before delivery when rehearsal fails, the prior unit is unavailable, or recovery would cross an
  unauthorized or irreversible boundary.

#### 3.2 Stop at the authority boundary

- Present the candidate identity, target matrix, consumer results, recorded delivery method, rollback
  rehearsal, limitations, credentials boundary, and first external action to the authorized actor.
- Continue only when exact authority covers that action, target, unit, method, and current rollout stage.
- Preserve the candidate and return a delivery-ready handoff when authority is absent. Do not treat readiness
  as installation, publication, promotion, or rollout.

### Phase 4 — Deliver, verify, and recover

#### 4.1 Perform the authorized delivery

- Recheck the candidate identity, target state, prior recoverable unit, rollback result, credentials boundary,
  and authority immediately before the action.
- Install, publish, promote, or roll out only the exact unit through the recorded method and authorized target
  stage. Use no credential or external destination outside that authority.
- Record the target, action, actor or automation, time, unit identity, result, and resulting active command.
- Stop further rollout on an action failure. Preserve the candidate, prior unit, logs, and target state for
  Step 4.3.

#### 4.2 Verify after delivery

- Resolve the command from the installed or activated target and prove that it selects the delivered unit.
- Run the recorded post-delivery identity, installation, activation, and `typescript-testing` command checks.
- Bind every result to the target and delivered unit identity. Keep an unavailable target result open rather
  than borrowing another target's evidence.
- Continue rollout only while every required check for the current stage passes. On any failed check, stop
  rollout and enter Step 4.3.

#### 4.3 Recover from a failed delivery

- Preserve the failed unit, target identity, logs, command results, and exact failure before restoration.
- Recheck rollback or recovery authority, then restore the prior unit through the recorded authorized path.
- Resolve the target command again and prove it selects the restored prior unit. Run the recorded recovery
  checks and retain their results.
- Stop with the exact active state when restoration or recovery verification fails. Do not retry through an
  invented method, erase failure evidence, or call the target recovered.

### Phase 5 — Hand off the result

#### 5.1 Close traceability and hand off

- Map each target to the unit identity, checksum or revision, distribution or install method, consumer entry,
  post-delivery result, authority, rollback rehearsal, delivery action, and recovery result that apply.
- Hand off the target matrix, frozen inputs, unit names and operator-facing command names, checksums or
  revision identity, install method, post-delivery results, authority state, rollback and recovery results,
  limitations, retained evidence, and the next blocked action.
- Report delivery-ready, delivered, verified, failed, recovered, and unavailable states separately. A missing
  owner, authority, target result, or recovery result never becomes a pass.
- When this work is evaluated, the [evaluation checklist](checklists.md) and every checklist owned by an active
  `typescript` sibling supply the applicable conditions; the general Evaluation operation resolves them and
  issues any verdict.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
