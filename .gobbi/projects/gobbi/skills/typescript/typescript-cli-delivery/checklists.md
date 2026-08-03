# TypeScript CLI Delivery Evaluation Checklist

This reusable unchecked source evaluates one direct non-archive TypeScript command delivery produced or
validated under this operation. It is governed by the [`typescript`](../SKILL.md) domain and
[`typescript-cli-delivery`](SKILL.md) operation, with
[`typescript-toolchain`](../typescript-toolchain/SKILL.md) owning TypeScript compilation and
[`typescript-testing`](../typescript-testing/SKILL.md) owning command behavior tests. The source commit that
contains this file identifies the checklist version. Its stable checklist prefix is `TSCLI`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

## Project

### TSCLI-SC-PROJECT-01 — Normal case: distribution and authority inputs are bound before delivery

A command can reach consumers without a package-archive installation as a standalone executable or archive,
a script copied or linked directly to an install target, a recorded workspace or repository revision plus
command, or another direct non-archive method whose unit, method, and consumer command are recorded by name.
The expected outcome records the exact method, targets, owners, and authority before a unit is produced or a
target changes. An inferred target or unowned external action is the failure.

#### Checklist

- [ ] TSCLI-CK-PROJECT-01-01 — The work is classified as author delivery or review-only validation before any mutation is planned.
- [ ] TSCLI-CK-PROJECT-01-02 — Every target's delivery unit is recorded as a standalone executable or archive, a script copied or linked directly to an install target, a workspace or repository revision plus command, or another direct non-archive method whose unit, method, and consumer command are recorded by name.
- [ ] TSCLI-CK-PROJECT-01-03 — Every target operating system, architecture, and runtime is recorded.
- [ ] TSCLI-CK-PROJECT-01-04 — Every target records its distribution or install method, distribution owner, and consumer command.
- [ ] TSCLI-CK-PROJECT-01-05 — Production, installation, publication, promotion, rollout, rollback, recovery, and credential use each have a recorded authority state.
- [ ] TSCLI-CK-PROJECT-01-06 — The first blocked external action and the authority it requires are recorded.

### TSCLI-SC-PROJECT-02 — Rule violation: review-only validation changes the subject or a persistent target

Review-only validation may inspect a pre-existing unit and, with authority, install it inside one isolated
disposable target. The expected outcome confines all review-created state to that boundary, removes only that
state, and reports evidence that needs a new unit or external effect as unavailable. A changed reviewed file,
new unit, persistent installation, or broader cleanup breaks the Rule.

#### Checklist

- [ ] TSCLI-CK-PROJECT-02-01 — Every unit used in review-only validation existed before the review.
- [ ] TSCLI-CK-PROJECT-02-02 — The review-only subject remains unchanged by file editing, delivery-unit production, and delivery-unit rebuilding.
- [ ] TSCLI-CK-PROJECT-02-03 — Review-only validation does not install into a persistent target or change an active command.
- [ ] TSCLI-CK-PROJECT-02-04 — Every review-only write, including cache state, remains inside one named isolated disposable target authorized for the review.
- [ ] TSCLI-CK-PROJECT-02-05 — Review-only cleanup removes only state created inside its disposable boundary.
- [ ] TSCLI-CK-PROJECT-02-06 — Every review-only result that needs a new unit, persistent installation, publication, promotion, rollout, or other external effect is reported as unavailable.

## Structure

### TSCLI-SC-STRUCTURE-01 — Normal case: the delivery unit has one identity on every target

File paths, scripts copied or linked directly to install targets, revision-bound commands, and same-name
commands on `PATH` can refer to different bytes or revisions. The expected outcome defines one traceable unit,
its prior recoverable unit, and the consumer entry for each target. A result whose unit or target cannot be
identified is the failure.

#### Checklist

- [ ] TSCLI-CK-STRUCTURE-01-01 — Every executable file or archive has a recorded path, name, and digest.
- [ ] TSCLI-CK-STRUCTURE-01-02 — Every script copied or linked directly to an install target has a recorded script identity, install target, and digest.
- [ ] TSCLI-CK-STRUCTURE-01-03 — Every revision-bound direct command has a recorded workspace or repository revision plus command.
- [ ] TSCLI-CK-STRUCTURE-01-04 — Every other direct non-archive method records its unit identity, distribution method, and consumer command by name.
- [ ] TSCLI-CK-STRUCTURE-01-05 — Every target records the prior recoverable unit, its retained location or revision, and its authorized restoration method.

## Performance

### TSCLI-SC-PERFORMANCE-01 — Edge case: a supplied resource or delivery budget is reached

The supplied requirements may limit unit size, runtime resources, startup time, or installation time. The
expected outcome measures only the supplied budgets against the exact candidate and target. Inventing a
budget, omitting a supplied limit, or measuring another unit is the failure.

#### Checklist

- [ ] TSCLI-CK-PERFORMANCE-01-01 — Every supplied unit-size, resource, startup, or installation budget is recorded before the candidate is measured.
- [ ] TSCLI-CK-PERFORMANCE-01-02 — Every applicable budget result is measured against the exact candidate unit and target.
- [ ] TSCLI-CK-PERFORMANCE-01-03 — No unit-size, resource, startup, or installation budget is introduced when the requirements supplied none.

## Aesthetics

### TSCLI-SC-AESTHETICS-01 — Poor quality: artifact and operator names do not identify the unit

Delivery can work while an executable, archive, directly copied or linked script, revision-bound command, log, or handoff uses an ambiguous
name. The expected outcome gives operators stable names that trace to the recorded unit and target. A
same-name artifact or command that cannot be distinguished from another candidate is the failure.

#### Checklist

- [ ] TSCLI-CK-AESTHETICS-01-01 — Every candidate file, archive, directly copied or linked script, or revision-bound command has one recorded operator-facing name.
- [ ] TSCLI-CK-AESTHETICS-01-02 — Every operator-facing unit name traces to one digest or workspace revision.
- [ ] TSCLI-CK-AESTHETICS-01-03 — Target records, logs, and handoff use the same operator-facing unit and command names.

## Usage

### TSCLI-SC-USAGE-01 — Normal case: an isolated consumer installs and invokes the candidate

A source entry may run even when the delivered command does not install, resolve, or start. The expected
outcome prepares the recorded method in isolation, proves the selected executable identity, and gives the
consumer entry to the existing command-test owner. Source-checkout success or a same-name command is the
failure.

#### Checklist

- [ ] TSCLI-CK-USAGE-01-01 — The recorded distribution or install method is prepared in an isolated representative consumer for every target.
- [ ] TSCLI-CK-USAGE-01-02 — The consumer command resolves to the candidate unit rather than a source entry.
- [ ] TSCLI-CK-USAGE-01-03 — The consumer command does not resolve to an unrelated same-name command already on `PATH`.
- [ ] TSCLI-CK-USAGE-01-04 — `typescript-testing` supplies the applicable arguments, streams, exit status, signals, failure text, and cleanup results from the consumer entry.
- [ ] TSCLI-CK-USAGE-01-05 — Command-behavior results remain distinct from installation and unit-identity results.

### TSCLI-SC-USAGE-02 — Expected failure: a target-specific delivery obligation is unavailable

A target may require an install, distribution, or activation obligation whose owner or authorized method is
not recorded. The expected outcome stops that target with an unavailable lifecycle result. Inventing a
package-manager, registry, service, signing, or deployment command is the failure.

#### Checklist

- [ ] TSCLI-CK-USAGE-02-01 — A target with a missing distribution owner or unavailable delivery obligation remains an unavailable lifecycle result.
- [ ] TSCLI-CK-USAGE-02-02 — No package-manager, registry, service, signing, or deployment command is invented to fill missing target ownership.

## Consistency

### TSCLI-SC-CONSISTENCY-01 — Normal case: frozen inputs, outputs, and results describe one unit

A long delivery can produce several candidates while retaining results from an earlier one. The expected
outcome freezes the inputs, binds every result to the candidate it exercised, and repeats affected checks
after a repair. Mixed candidate identities or stale results are the failure.

#### Checklist

- [ ] TSCLI-CK-CONSISTENCY-01-01 — Source identity, lockfile, toolchain and runtime versions, build configuration, and target matrix are frozen before candidate production.
- [ ] TSCLI-CK-CONSISTENCY-01-02 — The produced candidate's digest or workspace revision is recorded before consumer verification.
- [ ] TSCLI-CK-CONSISTENCY-01-03 — Every consumer, delivery, post-delivery, rollback, and recovery result is bound to its exact unit identity and target.
- [ ] TSCLI-CK-CONSISTENCY-01-04 — Every repaired unit repeats its affected consumer and delivery checks under the new identity.
- [ ] TSCLI-CK-CONSISTENCY-01-05 — The unit installed, published, promoted, or rolled out is the candidate authorized for that target stage.

## Risk

### TSCLI-SC-RISK-01 — Adversarial: readiness is used as delivery authority

A verified unit and rehearsed rollback can look ready enough to install or publish. The expected outcome
rechecks exact action, target, unit, method, stage, credential, and actor authority immediately before the
external action. Treating readiness or earlier authority as current authority is the failure.

#### Checklist

- [ ] TSCLI-CK-RISK-01-01 — Exact action, target, unit, method, stage, credential, and actor authority are rechecked immediately before delivery.
- [ ] TSCLI-CK-RISK-01-02 — No installation, publication, promotion, or rollout occurs outside the rechecked authority.
- [ ] TSCLI-CK-RISK-01-03 — No credential or external destination is used outside the rechecked authority.
- [ ] TSCLI-CK-RISK-01-04 — An unauthorized external action remains named as the next blocked action rather than a completed delivery.

### TSCLI-SC-RISK-02 — Expected failure: delivery fails and needs recovery

A delivery action or post-delivery check fails after a target changes. The expected outcome stops rollout,
preserves failure evidence, restores the retained prior unit through the authorized path, and proves which
unit owns the recovered command. Continuing rollout or calling an unverified restoration recovered is the
failure.

#### Checklist

- [ ] TSCLI-CK-RISK-02-01 — Rollback is rehearsed before every in-scope installation, publication, promotion, or rollout.
- [ ] TSCLI-CK-RISK-02-02 — Failed delivery evidence and target state are preserved before restoration.
- [ ] TSCLI-CK-RISK-02-03 — The prior unit is restored only through its recorded authorized path.
- [ ] TSCLI-CK-RISK-02-04 — The recovered consumer command resolves to the restored prior unit.
- [ ] TSCLI-CK-RISK-02-05 — Recovery is reported complete only after its recorded checks pass.

## Overall

### TSCLI-SC-OVERALL-01 — Normal case: post-delivery verification and handoff close every target

Delivery evidence must let a new operator identify each target, unit, method, result, authority, and recovery
state. The expected outcome verifies the active unit and hands off that complete inventory. An omitted target,
identity, result, or next action leaves the lifecycle open.

#### Checklist

- [ ] TSCLI-CK-OVERALL-01-01 — Every delivered target proves that its active consumer command resolves to the delivered unit.
- [ ] TSCLI-CK-OVERALL-01-02 — Every delivered target has current post-delivery installation, activation, identity, and command results.
- [ ] TSCLI-CK-OVERALL-01-03 — The handoff contains the complete operating-system, architecture, and runtime target matrix.
- [ ] TSCLI-CK-OVERALL-01-04 — The handoff contains every unit identity, checksum or workspace revision, operator-facing name, and distribution or install method.
- [ ] TSCLI-CK-OVERALL-01-05 — The handoff contains every post-delivery, authority, rollback, and recovery result.
- [ ] TSCLI-CK-OVERALL-01-06 — The handoff contains every limitation, unavailable lifecycle result, retained evidence location, and next blocked action.

### TSCLI-SC-OVERALL-02 — Expected failure: post-delivery verification does not pass

The target changed, but the installed command has the wrong identity or a required check failed or could not
run. The expected outcome stops the current stage and either verifies authorized recovery or preserves the
exact unresolved state. Another target's result or a missing result cannot close this target.

#### Checklist

- [ ] TSCLI-CK-OVERALL-02-01 — A failed required post-delivery check stops the current rollout stage.
- [ ] TSCLI-CK-OVERALL-02-02 — An unavailable required post-delivery result keeps the target unverified.
- [ ] TSCLI-CK-OVERALL-02-03 — No target borrows post-delivery or recovery evidence from another target.
- [ ] TSCLI-CK-OVERALL-02-04 — A failed recovery preserves the exact active unit, failed check, retained evidence, and next authorized recovery action.
