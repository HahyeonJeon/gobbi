# Electron Delivery Coordination Evaluation Checklist

This reusable unchecked source evaluates Electron request classification and coordination records. It is
governed by the [`electron` domain](../SKILL.md) and [`electron-delivery` operation](SKILL.md). Delivery owns
coordination; every lower owner retains its policy and acceptance authority.

The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`ELECDLVR`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line follows the scenario's owned rows
and points to one previously defined row. Each reused row appears on only one `Also applies` line.

## Project

### ELECDLVR-SC-PROJECT-01 — Normal case: classify the request before coordination

An ordinary request must establish its exact subject and whether one or several owners are needed. The
expected result selects one route; an ambiguous scope or a false full-delivery claim is the failure.

#### Checklist

- [ ] ELECDLVR-CK-PROJECT-01-01 — The record names the user or product outcome, affected actors, exact subject, target operating system and architecture, and requested terminal.
- [ ] ELECDLVR-CK-PROJECT-01-02 — The record distinguishes a one-owner request from a coordinated request by whether new accepted outputs from multiple owners are required.
- [ ] ELECDLVR-CK-PROJECT-01-03 — A one-owner request returns that owner's handoff without creating or claiming a full Delivery lifecycle.

### ELECDLVR-SC-PROJECT-03 — Expected failure: a required request fact is missing

Coordination cannot start from an unidentified subject or authority. The expected result is an exact,
recoverable stop; inventing the missing fact or entering `requested` is the failure.

#### Checklist

- [ ] ELECDLVR-CK-PROJECT-03-01 — A missing or conflicting actor, target, requirement, owner, authority, subject identity, or requested terminal stops coordination before `requested`.
- [ ] ELECDLVR-CK-PROJECT-03-02 — The stop preserves the literal received input or owner output.
- [ ] ELECDLVR-CK-PROJECT-03-03 — The stop names the exact absent or conflicting fact and the authority that can supply it.
- Also applies: ELECDLVR-CK-PROJECT-01-01 (exact request identity).

## Structure

### ELECDLVR-SC-STRUCTURE-01 — Normal case: complete maps precede owner work

A coordinated outcome depends on a complete outcome map and active-owner map. The expected result makes every
dependency visible before work; starting from an omitted or assumed item is the failure.

#### Checklist

- [ ] ELECDLVR-CK-STRUCTURE-01-01 — The complete outcome map covers actors, targets, all identities, observable paths, failures, feedback, preservation, recovery, support, and diagnostics.
- [ ] ELECDLVR-CK-STRUCTURE-01-02 — The map covers accepted interface, technical design, installed contract, source, Testing, Packaging, Release, installed-evidence, post-release, maintenance, and recovery records.
- [ ] ELECDLVR-CK-STRUCTURE-01-03 — Every active-owner entry names why the owner applies, exact input and output, dependencies, identities, acceptance authority, and stop or reopen condition.
- [ ] ELECDLVR-CK-STRUCTURE-01-04 — No owner work starts until the outcome map, active-owner map, dependency order, and handoff identities are complete.

### ELECDLVR-SC-STRUCTURE-02 — Edge case: only dependency-ready work advances

A partial coordination record can contain both current work and unmet dependencies. The expected result runs
only the smallest ready unit and preserves current records; advancing a placeholder or discarding accepted
work is the failure.

#### Checklist

- [ ] ELECDLVR-CK-STRUCTURE-02-01 — Each work unit has one substantive owner.
- [ ] ELECDLVR-CK-STRUCTURE-02-02 — A placeholder, planned output, partial record, or unresolved dependency cannot start dependent work.
- [ ] ELECDLVR-CK-STRUCTURE-02-03 — A partial run resumes from the first unmet dependency while preserving accepted work that remains current.
- [ ] ELECDLVR-CK-STRUCTURE-02-04 — Each work unit is the smallest unit whose named inputs are accepted and identity-matched.

## Performance

### ELECDLVR-SC-PERFORMANCE-01 — Normal case: coordination does no unnecessary owner work

Coordination should activate only owners needed for the requested terminal. The expected result uses the
smallest ready work set; traversing unrelated owners or states is the failure.

#### Checklist

- [ ] ELECDLVR-CK-PERFORMANCE-01-01 — The active-owner map contains only owners required by the requested outcome and terminal.
- [ ] ELECDLVR-CK-PERFORMANCE-01-03 — A one-owner request does not traverse unrelated Delivery states or require unrelated owner handoffs.
- Also applies: ELECDLVR-CK-STRUCTURE-02-04 (smallest dependency-ready owner-scoped work unit).

## Aesthetics

### ELECDLVR-SC-AESTHETICS-01 — Poor quality: transition prose hides the coordination record

A readable coordination record gives every transition enough exact fields to resume. An ambiguous owner,
identity, accepted output, limitation, dependency, or stop is the failure.

#### Checklist

- [ ] ELECDLVR-CK-AESTHETICS-01-03 — Every transition records subject identity, owner, accepted output, evidence class, limitations, next owner, dependencies, acceptance or stop, and invalidation condition.

## Usage

Application lifecycle and literal Delivery-state transitions are outside this narrower coordination-record
subject.

## Consistency

### ELECDLVR-SC-CONSISTENCY-01 — Normal case: dynamic handoffs preserve identity and acceptance

Every owner exchange must identify its subject and acceptance. The expected result can be checked against the
active outcome map; an unnamed owner, identity, limitation, or dependency is the failure.

#### Checklist

- [ ] ELECDLVR-CK-CONSISTENCY-01-01 — Every handoff names the applicable subject, target, version, candidate-byte, and application identities.
- [ ] ELECDLVR-CK-CONSISTENCY-01-02 — Every handoff names the substantive owner, acceptance authority, exact output, evidence class, limitations, acceptance state, dependencies, and next owner.
- [ ] ELECDLVR-CK-CONSISTENCY-01-03 — Delivery accepts a handoff only when its named owner accepted it and all required identities match the active outcome map.

## Risk

### ELECDLVR-SC-RISK-01 — Adversarial: a weak record imitates an accepted handoff

A stale, partial, proxy, cosmetic, or same-name record can appear sufficient. The expected result rejects it
without changing its evidence meaning; accepting or upgrading it is the failure.

#### Checklist

- [ ] ELECDLVR-CK-RISK-01-01 — Delivery rejects stale, partial, proxy, cosmetic, and same-name-different-byte records without upgrading their evidence strength.
- [ ] ELECDLVR-CK-RISK-01-03 — The rejection records the exact identity or acceptance gap.
- Also applies: ELECDLVR-CK-PROJECT-03-02 (literal owner-output preservation).

### ELECDLVR-SC-RISK-02 — Expected failure: an owner, environment, or authority is unavailable

A required owner, execution environment, or authority may be unavailable after earlier acceptance. The
expected result is a precise recoverable stop; skipping the dependency or losing accepted history is the
failure.

#### Checklist

- [ ] ELECDLVR-CK-RISK-02-01 — The record stops at the last accepted state when an owner fails, an environment is unavailable, authority is absent, or a handoff is rejected.
- [ ] ELECDLVR-CK-RISK-02-02 — The recoverable stop names the first failed dependency, responsible owner or authority, preserved accepted and stale records, and exact first resume point.
- Also applies: ELECDLVR-CK-CONSISTENCY-01-02 (complete handoff fields).

## Overall

### ELECDLVR-SC-OVERALL-01 — Normal case: the terminal record is exact and resumable

The final coordination record must let a cold reader identify the outcome and resume from its exact state.
The expected result is complete and literal; an omitted identity, coverage area, owner, limitation, or resume
point is the failure.

#### Checklist

- [ ] ELECDLVR-CK-OVERALL-01-01 — The terminal record contains the active-owner map, work order, state history, record status, all identities, installed-path coverage, diagnostics, evidence, limitations, residual risks, authority and external-action state, maintenance and recovery owners, exclusions, first resume point, and a requested-terminal field that uses only its literal accepted state.
- Also applies: ELECDLVR-CK-STRUCTURE-02-03 (dependency-aware recovery from the first unmet dependency).
