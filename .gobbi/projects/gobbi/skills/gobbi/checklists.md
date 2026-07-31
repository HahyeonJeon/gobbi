# Gobbi Entry Evaluation Checklist

This unchecked source evaluates the Gobbi entry contract in [`SKILL.md`](SKILL.md) with the fixtures in
[`scenarios.md`](scenarios.md). Each row is one independently answerable condition.

## Project

### GOBBI-SC-PROJECT-01 — Normal case: fresh entry reaches a user-selected mode

A fresh manager must rebuild its floor, present all three modes, and hand the user's selection to the correct
owner. The entry fails when it omits a choice, chooses automatically, or begins mode work itself.

#### Checklist

- [ ] GOBBI-CK-PROJECT-01-01 — The fresh entry presents General, Cowork, and Workflow.
- [ ] GOBBI-CK-PROJECT-01-02 — The user explicitly selects one presented mode.
- [ ] GOBBI-CK-PROJECT-01-03 — Gobbi hands the selection to the matching owner without mutation.

### GOBBI-SC-PROJECT-02 — Rule violation: task wording replaces selection

Even task wording that names a mode may support only a recommendation on a fresh entry. The operation fails
when wording, inference, a default, or a timeout records the selection.

#### Checklist

- [ ] GOBBI-CK-PROJECT-02-01 — Fresh-entry task wording does not replace the three-way selection control.
- [ ] GOBBI-CK-PROJECT-02-02 — The mode question has no automatic resolution.

## Structure

### GOBBI-SC-STRUCTURE-01 — Normal case: owner seams stay singular

General has no orchestration owner, Cowork uses `cowork`, and Workflow uses `workflow`. The structure fails
when Gobbi copies a mode procedure or creates a second router.

#### Checklist

- [ ] GOBBI-CK-STRUCTURE-01-01 — General routes without an orchestration owner.
- [ ] GOBBI-CK-STRUCTURE-01-02 — Cowork routes only through the Cowork owner.
- [ ] GOBBI-CK-STRUCTURE-01-03 — Workflow routes only through the Workflow owner.
- [ ] GOBBI-CK-STRUCTURE-01-04 — Gobbi contains no copied productive-step procedure.

### GOBBI-SC-STRUCTURE-02 — Rule violation: entry mutates mode state

Gobbi is a read-only router. An empty directory, artifact, branch, worktree, manifest, cursor update, or direct
specialist dispatch is a structural failure.

#### Checklist

- [ ] GOBBI-CK-STRUCTURE-02-01 — Entry execution leaves filesystem bytes unchanged.
- [ ] GOBBI-CK-STRUCTURE-02-02 — Entry execution leaves Git refs and worktrees unchanged.
- [ ] GOBBI-CK-STRUCTURE-02-03 — Productive specialists are dispatched only by a selected orchestration owner.

## Performance

### GOBBI-SC-PERFORMANCE-01 — Normal case: bootstrap loading is bounded

Bootstrap must read exactly the five floor skills and load every other skill only on demand. The operation
fails when the mode addition grows the always-load floor or scans unrelated state.

#### Checklist

- [ ] GOBBI-CK-PERFORMANCE-01-01 — The ordered bootstrap floor contains exactly five skills.
- [ ] GOBBI-CK-PERFORMANCE-01-02 — Non-floor owners load only after their trigger applies.
- [ ] GOBBI-CK-PERFORMANCE-01-03 — Mode routing requires no all-worktree, transcript, rollout, or telemetry scan.

### GOBBI-SC-PERFORMANCE-02 — Poor quality: the skill map becomes eager

A superficially complete index can still be poor when every indexed skill loads on entry. That design fails
the bounded-entry outcome even if all owners are available.

#### Checklist

- [ ] GOBBI-CK-PERFORMANCE-02-01 — Reading the skill map does not load every indexed skill.

## Aesthetics

### GOBBI-SC-AESTHETICS-01 — Normal case: the mode decision is readable

A cold user must distinguish the three choices quickly. The prompt fails when the names, use cases, or owner
consequences are hidden in dense prose.

#### Checklist

- [ ] GOBBI-CK-AESTHETICS-01-01 — Each mode has one literal name and one short use case.
- [ ] GOBBI-CK-AESTHETICS-01-02 — Any recommendation is visibly separate from the user's selection.
- [ ] GOBBI-CK-AESTHETICS-01-03 — The entry skill keeps Procedure dominant and uses plain, direct language.

## Usage

### GOBBI-SC-USAGE-01 — Normal case: General remains lightweight

After a General selection, ordinary assistance continues from the floor and relevant task skills. The path
fails when it creates orchestration state or loads Cowork or Workflow.

#### Checklist

- [ ] GOBBI-CK-USAGE-01-01 — General creates no Gobbi orchestration state.
- [ ] GOBBI-CK-USAGE-01-02 — General loads neither Cowork nor Workflow.

### GOBBI-SC-USAGE-02 — Normal case: Cowork reaches fast stepwise work

After a Cowork selection, the Cowork owner must establish its isolated worktree, run the user-topic loop, and
perform a direct Memory pass during explicit Wrap-up. The path fails when Gobbi creates the worktree,
Workflow records appear, or closure skips durable-memory review.

#### Checklist

- [ ] GOBBI-CK-USAGE-02-01 — Cowork owns worktree creation or recovery before editing.
- [ ] GOBBI-CK-USAGE-02-02 — Cowork remains manifest-free.
- [ ] GOBBI-CK-USAGE-02-03 — Cowork preserves user-called evaluation and Wrap-up.
- [ ] GOBBI-CK-USAGE-02-04 — Cowork Wrap-up applies Memory and applicable category skills directly.
- [ ] GOBBI-CK-USAGE-02-05 — Cowork Wrap-up commits verified memory changes or proves no change is needed.
- [ ] GOBBI-CK-USAGE-02-06 — Cowork checks evaluation freshness after the accepted Memory pass.
- [ ] GOBBI-CK-USAGE-02-07 — Cowork Wrap-up creates no Workflow typed staging or promotion manifest.

### GOBBI-SC-USAGE-03 — Normal case: Workflow behavior is preserved

After a Workflow selection, the Workflow owner must retain Configuration, durable routing, dual-system work,
evaluation, RECORD, and Wrap-up. The path fails when the new mode split weakens that contract.

#### Checklist

- [ ] GOBBI-CK-USAGE-03-01 — Workflow retains its five ordered steps.
- [ ] GOBBI-CK-USAGE-03-02 — Workflow retains its productive DISCUSSION→WORK→EVALUATION→RECORD loop.
- [ ] GOBBI-CK-USAGE-03-03 — Workflow remains the owner of its manifests and cursor.

### GOBBI-SC-USAGE-04 — Edge case: context boundary mode evidence

A valid established mode should resume without interruption, while missing or conflicting evidence must
return to selection. Either unconditional prompting or unconditional reuse is a failure.

#### Checklist

- [ ] GOBBI-CK-USAGE-04-01 — Valid established mode evidence suppresses a repeated selection question.
- [ ] GOBBI-CK-USAGE-04-02 — Missing mode evidence triggers the three-way selection.
- [ ] GOBBI-CK-USAGE-04-03 — Conflicting mode evidence preserves prior state and triggers the selection.

## Consistency

### GOBBI-SC-CONSISTENCY-01 — Normal case: consumers describe the same three modes

The canonical skill, manager pair, Codex entry, Claude entry, README, and topology guard must agree. The
change fails when any active consumer still says every session follows one mandatory workflow.

#### Checklist

- [ ] GOBBI-CK-CONSISTENCY-01-01 — Every active entry consumer names General, Cowork, and Workflow.
- [ ] GOBBI-CK-CONSISTENCY-01-02 — Every active entry consumer scopes durable records to Workflow.
- [ ] GOBBI-CK-CONSISTENCY-01-03 — Every active entry consumer scopes automatic dual-system creation to Workflow.
- [ ] GOBBI-CK-CONSISTENCY-01-04 — Manager Markdown and TOML route through the selected owner.
- [ ] GOBBI-CK-CONSISTENCY-01-05 — Every active consumer distinguishes Cowork direct Memory updates from Workflow promotion.

### GOBBI-SC-CONSISTENCY-02 — Expected failure: runtime entry drops a mode

The topology guard must reject a Codex or Claude entry document that omits any mode. A check that still passes
when Cowork is absent does not protect the public contract.

#### Checklist

- [ ] GOBBI-CK-CONSISTENCY-02-01 — The sync check rejects a Codex entry without Cowork.
- [ ] GOBBI-CK-CONSISTENCY-02-02 — The sync check rejects a Claude entry without Cowork.
- [ ] GOBBI-CK-CONSISTENCY-02-03 — Valid three-mode fixtures pass the sync check.

## Risk

### GOBBI-SC-RISK-01 — Adversarial: explicit mode wording bypasses user control

A caller can intentionally phrase a request as though selection already occurred. Fresh entry still fails
closed until the structured control records one of the three options.

#### Checklist

- [ ] GOBBI-CK-RISK-01-01 — Explicit mode wording cannot bypass the fresh-entry selection.
- [ ] GOBBI-CK-RISK-01-02 — A recommendation cannot be recorded as the user's answer.

### GOBBI-SC-RISK-02 — Expected failure: owner evidence is invalid

Missing or mismatched owner, identity, cursor, branch, or worktree evidence must stop handoff. The entry fails
when it guesses a fallback or mutates state to make evidence look valid.

#### Checklist

- [ ] GOBBI-CK-RISK-02-01 — Invalid owner evidence blocks handoff.
- [ ] GOBBI-CK-RISK-02-02 — A blocked handoff names the exact invalid evidence.
- [ ] GOBBI-CK-RISK-02-03 — A blocked handoff preserves the prior state.

### GOBBI-SC-RISK-03 — Adversarial: runtime view is a look-alike

A copied or partial runtime view may contain the expected words while diverging from canonical policy. It
must fail source-identity checks and be routed to the sync owner.

#### Checklist

- [ ] GOBBI-CK-RISK-03-01 — Runtime views resolve to canonical Gobbi sources.
- [ ] GOBBI-CK-RISK-03-02 — A partial or copied view cannot pass on matching words alone.

## Overall

### GOBBI-SC-OVERALL-01 — Normal case: complete entry contract

The result is acceptable only when a cold manager can rebuild the exact floor, obtain or preserve one mode,
route through the correct owner, and leave the entry preimage unchanged across both runtimes.

#### Checklist

- [ ] GOBBI-CK-OVERALL-01-01 — Every applicable Project through Risk row is satisfied.
- [ ] GOBBI-CK-OVERALL-01-02 — The six parent rules are each covered by at least one scenario and row.
- [ ] GOBBI-CK-OVERALL-01-03 — A cosmetically compliant two-mode or auto-selected entry fails at least one row.
