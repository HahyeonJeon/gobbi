# TypeScript CLI Delivery Release Evaluation Checklist

This reusable unchecked source evaluates source-map release, supplied-budget gates, recovery, and final
handoff for one direct non-archive TypeScript command delivery. It is governed by the
[`typescript`](../SKILL.md) domain and [`typescript-cli-delivery`](SKILL.md) operation, with
[`typescript-toolchain`](../typescript-toolchain/SKILL.md) owning compiler output and final-map inspection.
The [base CLI checklist](checklists.md) separately evaluates delivery identity, target preparation, consumer
entry, authority, rollback, and post-delivery verification. The source commit that contains this file
identifies the checklist version. Its stable checklist prefix is `TSCLIREL`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

## Project

### TSCLIREL-SC-PROJECT-01 — Normal case: map and budget decisions are bound before release

Maps and supplied budgets affect disclosure, credentials, resource requirements, and release authority. The
expected outcome records every decision owner and boundary before release preparation. An inferred map policy,
comparison rule, or acceptance authority is the failure.

#### Checklist

- [ ] TSCLIREL-CK-PROJECT-01-01 — Every unit and target records whether source maps are included, uploaded to a named symbolication target, intentionally withheld, or not produced.
- [ ] TSCLIREL-CK-PROJECT-01-02 — Every produced map records its intended consumer and delivery or symbolication target.
- [ ] TSCLIREL-CK-PROJECT-01-03 — Every produced map records its source-disclosure decision.
- [ ] TSCLIREL-CK-PROJECT-01-04 — Every produced map records its access and credential boundary.
- [ ] TSCLIREL-CK-PROJECT-01-05 — Every produced map records its retention decision and prior recoverable map state.
- [ ] TSCLIREL-CK-PROJECT-01-06 — Every supplied budget records its comparison rule, requirement owner, and actor or governing record authorized to accept a breach.

## Structure

### TSCLIREL-SC-STRUCTURE-01 — Normal case: the exact final maps belong to the exact unit and target

Intermediate maps or maps from another candidate can appear valid while pointing at the wrong code. The
expected outcome receives final-map inspection evidence from `typescript-toolchain` and binds each inspected
map to one unit and target. An intermediate, stale, or unbound map is the failure.

#### Checklist

- [ ] TSCLIREL-CK-STRUCTURE-01-01 — `typescript-toolchain` supplies final-map inspection evidence for every produced map.
- [ ] TSCLIREL-CK-STRUCTURE-01-02 — Every inspected map is identified exactly.
- [ ] TSCLIREL-CK-STRUCTURE-01-03 — Every inspected map is bound to the exact delivery unit it describes.
- [ ] TSCLIREL-CK-STRUCTURE-01-04 — Every inspected map is bound to the exact delivery target that consumes or stores it.

## Performance

### TSCLIREL-SC-PERFORMANCE-01 — Normal case: the exact candidate and target pass a supplied budget

A supplied size, resource, startup, or installation budget passes only under its recorded comparison rule for
the candidate and target being released. The expected outcome records that classification. A measurement from
another unit or target is the failure.

#### Checklist

- [ ] TSCLIREL-CK-PERFORMANCE-01-01 — Every budget measurement identifies the exact candidate unit and target.
- [ ] TSCLIREL-CK-PERFORMANCE-01-02 — Every budget measurement is classified under its recorded comparison rule.
- [ ] TSCLIREL-CK-PERFORMANCE-01-03 — A passing budget result is carried into release authority for that exact candidate and target.

### TSCLIREL-SC-PERFORMANCE-02 — Expected failure: a supplied budget is breached

A measured candidate breaches a supplied delivery requirement. The expected outcome stops release, then
repairs and remeasures or seeks explicit current acceptance from the recorded requirement owner. Releasing
while the breach is unresolved is the failure.

#### Checklist

- [ ] TSCLIREL-CK-PERFORMANCE-02-01 — Every supplied-budget breach is classified as a failed delivery requirement.
- [ ] TSCLIREL-CK-PERFORMANCE-02-02 — An unresolved budget breach stops delivery.
- [ ] TSCLIREL-CK-PERFORMANCE-02-03 — A repaired breach is remeasured against the exact candidate and target.

### TSCLIREL-SC-PERFORMANCE-03 — Edge case: the recorded requirement owner accepts a breach

A breach may proceed only when the recorded requirement owner explicitly accepts the current candidate,
target, result, benefit, and cost. The expected outcome binds that acceptance to release authority. Acceptance
inferred or self-assigned by an unrecorded actor is the failure.

#### Checklist

- [ ] TSCLIREL-CK-PERFORMANCE-03-01 — A budget-breach acceptance comes from the recorded requirement owner.
- [ ] TSCLIREL-CK-PERFORMANCE-03-02 — A budget-breach acceptance explicitly identifies the current candidate and target.
- [ ] TSCLIREL-CK-PERFORMANCE-03-03 — A budget-breach acceptance records the measured result, benefit, and cost.
- [ ] TSCLIREL-CK-PERFORMANCE-03-04 — No unrecorded actor infers or self-assigns authority to accept a budget breach.

## Aesthetics

Not applicable: map release and supplied-budget gates have no independent presentation requirement; the base
CLI checklist owns operator-facing unit and command names.

## Usage

### TSCLIREL-SC-USAGE-01 — Normal case: each authorized map disposition is carried out and verified

The consumer either receives a map with the unit, uses a named symbolication target, receives no disclosed
map by decision, or has no produced map. The expected outcome performs only the recorded disposition and
verifies the resulting consumer path. A map placed or exposed outside that decision is the failure.

#### Checklist

- [ ] TSCLIREL-CK-USAGE-01-01 — A map is included with the unit only under the exact recorded authority.
- [ ] TSCLIREL-CK-USAGE-01-02 — A map is uploaded only to its named symbolication target under the exact recorded authority.
- [ ] TSCLIREL-CK-USAGE-01-03 — A map is intentionally withheld only under the exact recorded authority and source-disclosure decision.
- [ ] TSCLIREL-CK-USAGE-01-04 — Every included map is verified from its delivered location.
- [ ] TSCLIREL-CK-USAGE-01-05 — Every uploaded map is verified through its named symbolication target.
- [ ] TSCLIREL-CK-USAGE-01-06 — A not-produced map state is reported without claiming delivery or symbolication.

## Consistency

### TSCLIREL-SC-CONSISTENCY-01 — Normal case: release authority and handoff preserve map and budget state

A long release can carry a map or budget result from another candidate or omit an accepted breach. The
expected outcome keeps the current map disposition, budget classification, and acceptance bound to the exact
unit and target through authority and handoff. Stale or omitted state is the failure.

#### Checklist

- [ ] TSCLIREL-CK-CONSISTENCY-01-01 — Release authority identifies the exact map disposition for each unit and target.
- [ ] TSCLIREL-CK-CONSISTENCY-01-02 — Release authority identifies every budget result and recorded-owner acceptance for each unit and target.
- [ ] TSCLIREL-CK-CONSISTENCY-01-03 — Handoff identifies the exact map decision and verification result for each unit and target.
- [ ] TSCLIREL-CK-CONSISTENCY-01-04 — Handoff identifies every budget comparison and recorded-owner acceptance for each unit and target.

## Risk

### TSCLIREL-SC-RISK-01 — Expected failure: recovery leaves stale or inaccessible map state

A failed delivery can restore the command while leaving the failed unit's map active, deleting the prior map,
or losing symbolication access. The expected outcome preserves failure evidence, restores or removes map state
through the authorized path, and verifies recovery. An unverified map state leaves recovery open.

#### Checklist

- [ ] TSCLIREL-CK-RISK-01-01 — Failed-delivery map evidence is preserved before recovery changes map state.
- [ ] TSCLIREL-CK-RISK-01-02 — Recovery restores the prior map state through its recorded authorized path when that state must return.
- [ ] TSCLIREL-CK-RISK-01-03 — Recovery removes the failed unit's map state through its recorded authorized path when that state must not remain.
- [ ] TSCLIREL-CK-RISK-01-04 — Recovered map access and credentials stay inside their recorded boundary.
- [ ] TSCLIREL-CK-RISK-01-05 — Recovered included maps or symbolication are verified for the restored unit and target.
- [ ] TSCLIREL-CK-RISK-01-06 — Recovery remains incomplete while the required map state is unverified.

## Overall

### TSCLIREL-SC-OVERALL-01 — Normal case: map and budget lifecycle evidence closes each target

The release record must let a new operator recover every map decision and supplied-budget result. The expected
outcome carries the complete current state, authority, verification, and recovery evidence. An omitted target,
decision, acceptance, or result leaves the lifecycle open.

#### Checklist

- [ ] TSCLIREL-CK-OVERALL-01-01 — Every target has a current map consumer, disclosure decision, access and credential boundary, retention, map target, prior recoverable map state, disposition, and verification result.
- [ ] TSCLIREL-CK-OVERALL-01-02 — Every supplied budget has a current classification for its exact target.
- [ ] TSCLIREL-CK-OVERALL-01-03 — Every accepted budget breach identifies its recorded requirement owner.
- [ ] TSCLIREL-CK-OVERALL-01-04 — Every map and budget result is bound to the exact final unit and target.
- [ ] TSCLIREL-CK-OVERALL-01-05 — Every unresolved map or budget result remains a blocked delivery state.
