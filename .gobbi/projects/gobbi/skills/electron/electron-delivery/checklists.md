# Electron Delivery Evaluation Checklist

This reusable unchecked source evaluates one complete or multi-owner Electron delivery. It is governed by
the [`electron` domain](../SKILL.md) and [`electron-delivery` operation](SKILL.md). Delivery owns
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

### ELECDLVR-SC-PROJECT-02 — Rule violation: Delivery takes a lower owner's authority

Delivery may coordinate only accepted lower-owner records. The expected result preserves each authority;
choosing policy, evidence meaning, acceptance, readiness, or a verdict is the failure.

#### Checklist

- [ ] ELECDLVR-CK-PROJECT-02-01 — Delivery does not choose or copy lower-owner policy or run a lower owner's procedure.
- [ ] ELECDLVR-CK-PROJECT-02-02 — Delivery does not interpret Testing evidence, accept a Packaging candidate, decide Release readiness, change accepted contract or design, or issue a verdict.
- [ ] ELECDLVR-CK-PROJECT-02-03 — Every substantive decision names exactly one lower owner or user or product authority.

### ELECDLVR-SC-PROJECT-03 — Expected failure: a required request fact is missing

Coordination cannot start from an unidentified subject or authority. The expected result is an exact,
recoverable stop; inventing the missing fact or entering `requested` is the failure.

#### Checklist

- [ ] ELECDLVR-CK-PROJECT-03-01 — A missing or conflicting actor, target, requirement, owner, authority, subject identity, or requested terminal stops coordination before `requested`.
- [ ] ELECDLVR-CK-PROJECT-03-02 — The stop preserves the received input and names the exact absent or conflicting fact and the authority that can supply it.
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

- [ ] ELECDLVR-CK-STRUCTURE-02-01 — Each work unit has one substantive owner and is the smallest unit whose named inputs are accepted and identity-matched.
- [ ] ELECDLVR-CK-STRUCTURE-02-02 — A placeholder, planned output, partial record, or unresolved dependency cannot start dependent work.
- [ ] ELECDLVR-CK-STRUCTURE-02-03 — A partial run resumes from the first unmet dependency while preserving accepted work that remains current.
- Also applies: ELECDLVR-CK-PROJECT-03-02 (exact recoverable stop).

## Performance

### ELECDLVR-SC-PERFORMANCE-01 — Normal case: coordination does no unnecessary owner work

Coordination should activate only owners needed for the requested terminal. The expected result uses the
smallest ready work set; traversing unrelated owners or states is the failure.

#### Checklist

- [ ] ELECDLVR-CK-PERFORMANCE-01-01 — The active-owner map contains only owners required by the requested outcome and terminal.
- [ ] ELECDLVR-CK-PERFORMANCE-01-02 — The work order starts only the smallest dependency-ready owner-scoped unit.
- [ ] ELECDLVR-CK-PERFORMANCE-01-03 — A one-owner request does not traverse unrelated Delivery states or require unrelated owner handoffs.

## Aesthetics

### ELECDLVR-SC-AESTHETICS-01 — Poor quality: state prose hides the actual coordination state

A readable delivery record uses literal states and complete transition fields. The expected result is exact
and resumable; vague confidence prose or an ambiguous history is the failure.

#### Checklist

- [ ] ELECDLVR-CK-AESTHETICS-01-01 — The current state uses exactly one literal state name from the Delivery sequence.
- [ ] ELECDLVR-CK-AESTHETICS-01-02 — The record does not use a confidence word or release claim as a substitute for a literal state.
- [ ] ELECDLVR-CK-AESTHETICS-01-03 — Every transition records subject identity, owner, accepted output, evidence class, limitations, next owner, dependencies, acceptance or stop, and invalidation condition.
- [ ] ELECDLVR-CK-AESTHETICS-01-04 — The immutable history distinguishes accepted, rejected, and stale records and names the last accepted state.

## Usage

### ELECDLVR-SC-USAGE-01 — Normal case: accepted records cover the complete design lifecycle

The coordinated design must establish the observable, technical, and installed decisions before source work.
The expected result reconciles identity-matched owner records; a gap or a Delivery-made decision is the
failure.

#### Checklist

- [ ] ELECDLVR-CK-USAGE-01-01 — The design history starts with accepted authority and actors, current-application study, official-constraint study, and comparison of at least two materially different observable concepts.
- [ ] ELECDLVR-CK-USAGE-01-02 — Accepted Interface, Design, and Contract records cover observable decisions, technical decisions, installed behavior, target differences, measures, harmful proxies, and reopen signals.
- [ ] ELECDLVR-CK-USAGE-01-03 — The three records share actor, target, outcome, and subject identities, and any conflict returns to the earliest owner instead of being resolved by Delivery.

### ELECDLVR-SC-USAGE-02 — Normal case: the installed lifecycle is complete

An installed application outcome includes ordinary paths, alternate entries, operating-system transitions,
and process failures. The expected result records each required case; a generic alternate-entry or crash
claim is the failure.

#### Checklist

- [ ] ELECDLVR-CK-USAGE-02-01 — Coverage includes installation, partial installation, first launch, cold start, initialization, ready state, window creation, no-window state, background or tray behavior, close compared with quit, window recreation, second-instance handling, and duplicate-instance handling.
- [ ] ELECDLVR-CK-USAGE-02-02 — Cold-start deep-link, running-application deep-link, cold-start file-open, and running-application file-open each have independent records.
- [ ] ELECDLVR-CK-USAGE-02-03 — Each alternate-entry record covers target availability and start, validation and delivery, correct instance and window, success and failure, preservation, recovery and support, and diagnostics and evidence.
- [ ] ELECDLVR-CK-USAGE-02-04 — Coverage includes ordinary quit, stopped state, relaunch, suspend, resume, operating-system shutdown, next recovery, update restart, migration, version checks, refusal, update recovery, update support, renderer-unresponsive and renderer-responsive transitions, renderer crash, utility or child failure, main-process exit, external crash capture and relaunch, uninstall, data treatment after uninstall, recovery after uninstall, and support after uninstall.

### ELECDLVR-SC-USAGE-03 — Normal case: contract, design, source, and behavior advance literally

Early delivery states separate accepted contract, design, construction, and behavior evidence. The expected
result advances each state from its owner record; skipping a state or implying stronger evidence is the
failure.

#### Checklist

- [ ] ELECDLVR-CK-USAGE-03-01 — `requested` advances to `contract-defined` only from Contract's accepted record for the exact target and outcome.
- [ ] ELECDLVR-CK-USAGE-03-02 — The state-to-owner mapping assigns `design-accepted` to compatible identity-matched Interface, Design, and Contract records and `implementation-ready` to Development's accepted exact inputs and source outcome.
- [ ] ELECDLVR-CK-USAGE-03-03 — The state-to-output mapping assigns `implemented` only to the product source change and `construction-verified` only to Development's accepted construction and source checks.
- [ ] ELECDLVR-CK-USAGE-03-04 — `behavior-verified` requires Testing's passing identity-matched behavior evidence for the source and environment and implies no installed evidence.

### ELECDLVR-SC-USAGE-04 — Normal case: packaged bytes become an accepted candidate through owner records

Packaging, Testing, and candidate acceptance are separate states and authorities. The expected result
preserves those distinctions for exact bytes; inferred installed evidence or Delivery acceptance is the
failure.

#### Checklist

- [ ] ELECDLVR-CK-USAGE-04-01 — `packaged` requires Packaging's exact produced byte identities per target and implies neither installed evidence nor candidate acceptance.
- [ ] ELECDLVR-CK-USAGE-04-02 — `packaging-evidence-requested` requires Packaging's identity-matched Testing request for exact bytes, installed subject, environment, lifecycle claims, and evidence classes.
- [ ] ELECDLVR-CK-USAGE-04-03 — `installed-verified` requires Testing's identity-matched, environment-classified packaged or installed evidence and implies no Packaging acceptance.
- [ ] ELECDLVR-CK-USAGE-04-04 — `candidate-accepted` requires Packaging alone to accept an immutable candidate identity for every operating-system and architecture target.

### ELECDLVR-SC-USAGE-05 — Normal case: release, observation, and maintenance retain separate authorities

Release readiness, external authority, release action, observation, and maintenance are distinct. The
expected result preserves each state and owner; treating readiness or signal arrival as a later state is the
failure.

#### Checklist

- [ ] ELECDLVR-CK-USAGE-05-01 — The state-to-owner mapping assigns `release-evidence-requested` to Release's identity-matched Testing request and `release-ready` to Release's readiness acceptance for the exact target, candidate, and policy.
- [ ] ELECDLVR-CK-USAGE-05-02 — `release-authorized` names the exact authority, action, destination, candidate, target, channel, and time; readiness alone cannot satisfy it.
- [ ] ELECDLVR-CK-USAGE-05-03 — The state-to-owner mapping assigns `released` to Release's proof of the exact external action and destination and `observed` to accepted signals for the exact identity, population, and time.
- [ ] ELECDLVR-CK-USAGE-05-04 — The terminal-state mapping assigns `maintained` only to current requirements, owner records, evidence, signals, support, and recovery and `reopened` to a changed premise.
- Also applies: ELECDLVR-CK-AESTHETICS-01-04 (literal state history).

## Consistency

### ELECDLVR-SC-CONSISTENCY-01 — Normal case: dynamic handoffs preserve identity and acceptance

Every owner exchange must identify its subject and acceptance. The expected result can be checked against the
active outcome map; an unnamed owner, identity, limitation, or dependency is the failure.

#### Checklist

- [ ] ELECDLVR-CK-CONSISTENCY-01-01 — Every handoff names the applicable subject, target, version, candidate-byte, and application identities.
- [ ] ELECDLVR-CK-CONSISTENCY-01-02 — Every handoff names the substantive owner, acceptance authority, exact output, evidence class, limitations, acceptance state, dependencies, and next owner.
- [ ] ELECDLVR-CK-CONSISTENCY-01-03 — Delivery accepts a handoff only when its named owner accepted it and all required identities match the active outcome map.

### ELECDLVR-SC-CONSISTENCY-02 — Edge case: a changed premise invalidates the required dependency chain

A change can invalidate later acceptances while leaving unrelated current records intact. The expected result
starts at the earliest changed owner and replaces dependent evidence only; over-invalidation or stale
advancement is the failure.

#### Checklist

- [ ] ELECDLVR-CK-CONSISTENCY-02-01 — Contract or accepted design changes reopen their earliest owner and invalidate affected source and later states.
- [ ] ELECDLVR-CK-CONSISTENCY-02-02 — Source, configuration, Testing subject, environment, test, or evidence changes invalidate their affected evidence and every dependent acceptance.
- [ ] ELECDLVR-CK-CONSISTENCY-02-03 — The invalidation map routes candidate-byte or identity changes to Packaging and Release-input changes to reopened Release evidence and readiness while preserving unchanged Packaging bytes.
- [ ] ELECDLVR-CK-CONSISTENCY-02-04 — Recovery requests only replacement owner records and dependent stale evidence, then advances only after identity-matched acceptance.

## Risk

### ELECDLVR-SC-RISK-01 — Adversarial: a weak record imitates an accepted handoff

A stale, partial, proxy, cosmetic, or same-name record can appear sufficient. The expected result rejects it
without changing its evidence meaning; accepting or upgrading it is the failure.

#### Checklist

- [ ] ELECDLVR-CK-RISK-01-01 — Delivery rejects stale, partial, proxy, cosmetic, and same-name-different-byte records without upgrading their evidence strength.
- [ ] ELECDLVR-CK-RISK-01-02 — The rejection preserves the literal owner output and records the exact identity or acceptance gap.

### ELECDLVR-SC-RISK-02 — Expected failure: an owner, environment, or authority is unavailable

A required owner, execution environment, or authority may be unavailable after earlier acceptance. The
expected result is a precise recoverable stop; skipping the dependency or losing accepted history is the
failure.

#### Checklist

- [ ] ELECDLVR-CK-RISK-02-01 — The record stops at the last accepted state when an owner fails, an environment is unavailable, authority is absent, or a handoff is rejected.
- [ ] ELECDLVR-CK-RISK-02-02 — The recoverable stop names the first failed dependency, responsible owner or authority, preserved accepted and stale records, and exact first resume point.
- Also applies: ELECDLVR-CK-CONSISTENCY-01-02 (complete handoff fields).

### ELECDLVR-SC-RISK-03 — Adversarial: coordination is used to bypass external-action authority

A caller may present readiness or a coordination record as permission for an external action. The expected
result leaves the action with Release and the named authority; acting, inferring authority, or issuing a
substitute verdict is the failure.

#### Checklist

- [ ] ELECDLVR-CK-RISK-03-01 — Delivery does not access credentials, publish, promote, roll out, withdraw, roll back, merge, clean up, or perform another owner's external action.
- [ ] ELECDLVR-CK-RISK-03-02 — Delivery does not infer authority from readiness or an owner record and does not issue an independent release or evidence verdict.

## Overall

### ELECDLVR-SC-OVERALL-01 — Normal case: the terminal record is exact and resumable

The final coordination record must let a cold reader identify the outcome and resume from its exact state.
The expected result is complete and literal; an omitted identity, coverage area, owner, limitation, or resume
point is the failure.

#### Checklist

- [ ] ELECDLVR-CK-OVERALL-01-01 — The terminal record contains the active-owner map, work order, state history, record status, all identities, installed-path coverage, diagnostics, evidence, limitations, residual risks, authority and external-action state, maintenance and recovery owners, exclusions, first resume point, and a requested-terminal field that uses only its literal accepted state.
- Also applies: ELECDLVR-CK-CONSISTENCY-02-04 (dependency-aware recovery).
