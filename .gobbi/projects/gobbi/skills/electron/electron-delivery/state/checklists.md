# Electron Delivery State Evaluation Checklist

This reusable unchecked source evaluates lower-owner authority and literal Electron Delivery lifecycle-state
transitions. It is governed by the [`electron` domain](../../SKILL.md) and [`electron-delivery`
operation](../SKILL.md). Delivery records accepted transitions; each lower owner retains its decision and
acceptance authority.

The source commit that contains this file identifies the checklist version. Its stable owner prefix is
`ELECDST`.

This file defines coverage only. The parent [Evaluation](../../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

A row is defined once beneath its owning scenario. An `Also applies` line follows the scenario's owned rows
and points to one previously defined row. Each reused row appears on only one `Also applies` line.

## Project

### ELECDST-SC-PROJECT-02 — Rule violation: Delivery takes a lower owner's authority

Delivery may record only accepted lower-owner decisions. The expected result preserves each authority;
choosing policy, running a lower procedure, interpreting evidence, or accepting a downstream state is the
failure.

#### Checklist

- [ ] ELECDST-CK-PROJECT-02-01 — Delivery does not choose or copy lower-owner policy.
- [ ] ELECDST-CK-PROJECT-02-02 — Testing alone interprets Testing evidence.
- [ ] ELECDST-CK-PROJECT-02-03 — Every substantive decision names exactly one lower owner or user or product authority.
- [ ] ELECDST-CK-PROJECT-02-04 — Delivery does not run a lower-owner procedure or external action.
- [ ] ELECDST-CK-PROJECT-02-05 — Packaging alone accepts or rejects a candidate.
- [ ] ELECDST-CK-PROJECT-02-06 — Release alone accepts release readiness.

### ELECDST-SC-PROJECT-04 — Rule violation: Delivery changes accepted decisions

Accepted contract and design decisions remain with their named owners. The expected result routes each
question; a Delivery-made change is the failure.

#### Checklist

- [ ] ELECDST-CK-PROJECT-04-01 — Contract and Design alone change their respective accepted decisions.

## Structure

Work-map shape and dependency-ready unit construction are outside this source's individual-state authority
and transition subject.

## Performance

Coordination cost and active-owner minimization are outside this source's individual-state authority and
transition subject.

## Aesthetics

### ELECDST-SC-AESTHETICS-01 — Poor quality: state prose hides the literal coordination state

A readable delivery history uses literal states and preserves the disposition of every record. The expected
result is exact and resumable; vague confidence prose or an ambiguous history is the failure.

#### Checklist

- [ ] ELECDST-CK-AESTHETICS-01-01 — The current state uses exactly one literal state name from the Delivery sequence.
- [ ] ELECDST-CK-AESTHETICS-01-02 — The record does not use a confidence word or release claim as a substitute for a literal state.
- [ ] ELECDST-CK-AESTHETICS-01-04 — The immutable history distinguishes accepted, rejected, and stale records.
- [ ] ELECDST-CK-AESTHETICS-01-05 — The immutable history names the last accepted state.

## Usage

### ELECDST-SC-USAGE-01 — Normal case: accepted records cover the complete design lifecycle

The coordinated design must establish observable, technical, and installed decisions before source work.
The expected result reconciles identity-matched owner records; a gap or Delivery-made decision is the failure.

#### Checklist

- [ ] ELECDST-CK-USAGE-01-01 — The design history starts with accepted authority and actors, current-application study, official-constraint study, and comparison of at least two materially different observable concepts.
- [ ] ELECDST-CK-USAGE-01-02 — Accepted Interface, Design, and Contract records cover observable decisions, technical decisions, installed behavior, target differences, measures, harmful proxies, and reopen signals.
- [ ] ELECDST-CK-USAGE-01-03 — The three design records share actor, target, outcome, and subject identities.
- [ ] ELECDST-CK-USAGE-01-04 — Each changed-or-conflicting premise returns to its earliest named owner: a design-record conflict, a Contract or Design change, a source/configuration/Testing premise change, a candidate-byte or identity change, and a Release-input change.
- [ ] ELECDST-CK-USAGE-01-05 — Each changed-or-conflicting premise invalidates its affected dependents: a design-record conflict, a Contract or Design change, a source/configuration/Testing premise change, a candidate-byte or identity change, and a Release-input change.

### ELECDST-SC-USAGE-02 — Normal case: the installed lifecycle is complete

An installed application outcome includes ordinary paths, alternate entries, operating-system transitions,
and process failures. The expected result records each required case; a generic alternate-entry or crash
claim is the failure.

#### Checklist

- [ ] ELECDST-CK-USAGE-02-01 — Coverage includes installation, partial installation, first launch, cold start, initialization, ready state, window creation, no-window state, background or tray behavior, close compared with quit, window recreation, second-instance handling, and duplicate-instance handling.
- [ ] ELECDST-CK-USAGE-02-02 — Cold-start deep-link, running-application deep-link, cold-start file-open, and running-application file-open each have independent records.
- [ ] ELECDST-CK-USAGE-02-03 — Each alternate-entry record covers target availability and start, validation and delivery, correct instance and window, success and failure, preservation, recovery and support, and diagnostics and evidence.
- [ ] ELECDST-CK-USAGE-02-04 — Coverage includes ordinary quit, stopped state, relaunch, suspend, resume, operating-system shutdown, next recovery, update restart, migration, version checks, refusal, update recovery, update support, renderer-unresponsive and renderer-responsive transitions, renderer crash, utility or child failure, main-process exit, external crash capture and relaunch, uninstall, data treatment after uninstall, recovery after uninstall, and support after uninstall.

### ELECDST-SC-USAGE-03 — Normal case: contract, design, source, and behavior advance literally

Early delivery states separate accepted contract, design, construction, and behavior evidence. The expected
result advances each state from its owner record; skipping a state or implying stronger evidence is the
failure.

#### Checklist

- [ ] ELECDST-CK-USAGE-03-01 — `requested` advances to `contract-defined` only from Contract's accepted record for the exact target and outcome.
- [ ] ELECDST-CK-USAGE-03-02 — The state-to-owner mapping assigns `design-accepted` to compatible identity-matched Interface, Design, and Contract records and `implementation-ready` to Development's accepted exact inputs and source outcome.
- [ ] ELECDST-CK-USAGE-03-03 — The state-to-output mapping assigns `implemented` only to the product source change and `construction-verified` only to Development's accepted construction and source checks.
- [ ] ELECDST-CK-USAGE-03-04 — `behavior-verified` requires Testing's passing identity-matched behavior evidence for the source and environment and implies no installed evidence.

### ELECDST-SC-USAGE-04 — Normal case: packaged bytes become an accepted candidate through owner records

Packaging, Testing, and candidate acceptance are separate states and authorities. The expected result
preserves those distinctions for exact bytes; inferred installed evidence or Delivery acceptance is the
failure.

#### Checklist

- [ ] ELECDST-CK-USAGE-04-01 — `packaged` requires Packaging's exact produced byte identities per target and implies neither installed evidence nor candidate acceptance.
- [ ] ELECDST-CK-USAGE-04-02 — `packaging-evidence-requested` requires Packaging's identity-matched Testing request for exact bytes, installed subject, environment, lifecycle claims, and evidence classes.
- [ ] ELECDST-CK-USAGE-04-03 — `installed-verified` requires Testing's identity-matched, environment-classified packaged or installed evidence and implies no Packaging acceptance.
- Also applies: ELECDST-CK-PROJECT-02-05 (Packaging alone accepts or rejects a candidate).

### ELECDST-SC-USAGE-05 — Normal case: release, observation, and maintenance retain separate authorities

Release readiness, external authority, release action, observation, and maintenance are distinct. The
expected result preserves each state and owner; treating readiness or signal arrival as a later state is the
failure.

#### Checklist

- [ ] ELECDST-CK-USAGE-05-02 — `release-authorized` names the exact authority, action, destination, candidate, target, channel, and time.
- [ ] ELECDST-CK-USAGE-05-03 — The state-to-owner mapping assigns `release-evidence-requested` to Release's identity-matched Testing request, `released` to Release's proof of the exact external action and destination, and `observed` to accepted signals for the exact identity, population, and time.
- [ ] ELECDST-CK-USAGE-05-04 — The terminal-state mapping assigns `maintained` only to current requirements, owner records, evidence, signals, support, and recovery and `reopened` to a changed premise.
- [ ] ELECDST-CK-USAGE-05-05 — Release readiness does not satisfy external-action authorization.
- Also applies: ELECDST-CK-PROJECT-02-06 (Release alone accepts release readiness).

## Consistency

### ELECDST-SC-CONSISTENCY-02 — Edge case: a changed premise invalidates the required dependency chain

A change can invalidate later acceptances while leaving unrelated current records intact. The expected result
starts at the earliest changed owner and replaces dependent evidence only; over-invalidation or stale
advancement is the failure.

#### Checklist

- [ ] ELECDST-CK-CONSISTENCY-02-04 — Recovery requests only replacement owner records and dependent stale evidence.
- [ ] ELECDST-CK-CONSISTENCY-02-05 — Packaging bytes unaffected by the changed premise remain current.
- Also applies: ELECDST-CK-USAGE-01-04 (changed-or-conflicting premise routing).
- Also applies: ELECDST-CK-USAGE-01-05 (affected-dependent invalidation).

## Risk

### ELECDST-SC-RISK-03 — Adversarial: coordination is used to bypass external-action authority

A caller may present readiness or a coordination record as permission for an external action. The expected
result leaves every procedure, action, authority, and verdict with its named owner.

#### Checklist

- [ ] ELECDST-CK-RISK-03-03 — Delivery does not issue an independent release or evidence verdict.
- Also applies: ELECDST-CK-PROJECT-02-04 (no lower-owner procedure or external action).
- Also applies: ELECDST-CK-USAGE-05-05 (readiness is not external-action authority).

## Overall

Terminal coordination-record composition is outside this source's individual-state authority and transition
subject.
