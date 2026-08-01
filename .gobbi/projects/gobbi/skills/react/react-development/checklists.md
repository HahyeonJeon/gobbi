# React Development Checklist

Use this unchecked `react-development` source with general `evaluation`; `RDEV` is the stable owner prefix.
Complete it for every React implementation or review, then complete the checklist of every active sibling.

## Project

### RDEV-SC-PROJECT-01 — Normal case: The task and project contract are established

The work should begin from an accepted outcome and the installed React project rather than a guessed API,
renderer, or authority boundary. Missing scope or configuration fails the scenario.

#### Checklist

- [ ] RDEV-CK-PROJECT-01-01 — The task states its observable outcome, accepted scope, available authority, material constraints, and completion evidence.
- [ ] RDEV-CK-PROJECT-01-02 — Project files establish the target renderer, installed React line, active framework capabilities, affected source language, rendering architecture, and applicable verification commands.
- [ ] RDEV-CK-PROJECT-01-03 — Every applicable React child trigger is recorded before design or review begins.

### RDEV-SC-PROJECT-02 — Expected failure: The work reaches a condition it cannot decide

A required capability, authority, or evidence is missing, or implementation reveals a material design choice
outside the accepted task. The work should stop and surface the owner's decision; supplying the answer itself
fails the scenario.

#### Checklist

- [ ] RDEV-CK-PROJECT-02-01 — The work stops when a required capability or authority is not established.
- [ ] RDEV-CK-PROJECT-02-02 — The work names the missing evidence or user-owned decision when a required capability or authority is not established.
- [ ] RDEV-CK-PROJECT-02-03 — The work pauses and surfaces each material design choice outside the accepted task instead of deciding it.
- [ ] RDEV-CK-PROJECT-02-04 — No unestablished React capability, framework feature, or authority is assumed to exist.

## Structure

### RDEV-SC-STRUCTURE-01 — Normal case: One model connects behavior to its owners

The user path, React units, state, external systems, tests, and runtime boundaries should form one complete
model. An unowned concern or missing path fails the scenario.

#### Checklist

- [ ] RDEV-CK-STRUCTURE-01-01 — The model identifies every affected React function, input boundary, user or system action, affected state owner, affected external system, affected test layer, and affected runtime boundary.
- [ ] RDEV-CK-STRUCTURE-01-02 — Each material React concern resolves to one active child or external owner.

## Performance

Not applicable: performance policy and measurement belong to the active compiler, framework, host, or
project owner; this operation only runs their required gates.

## Aesthetics

### RDEV-SC-AESTHETICS-01 — Poor quality: The handoff hides the completed path

The returned change or finding set should let a cold reader identify the outcome, evidence, gaps, and risks.
An opaque summary fails even when the implementation works.

#### Checklist

- [ ] RDEV-CK-AESTHETICS-01-01 — The handoff plainly states the outcome, the affected paths, the verification commands, each command result, its limitations, its evidence gaps, and its remaining risks.

## Usage

### RDEV-SC-USAGE-01 — Normal case: The rendered outcome completes

The accepted user path should be observable through its normal and activated alternative states. A blank,
trapped, falsely successful, or source-only result fails the scenario.

#### Checklist

- [ ] RDEV-CK-USAGE-01-01 — Rendered-surface exercise covers the accepted primary behavior.
- [ ] RDEV-CK-USAGE-01-02 — Each applicable pending, empty, and failure state is observable.
- [ ] RDEV-CK-USAGE-01-03 — Each permitted recovery returns the user to a usable state.

## Consistency

### RDEV-SC-CONSISTENCY-01 — Rule violation: The final tree and evidence disagree

Source, tests, types, documents, consumers, and reported gates should describe the same final behavior. A
stale dependent surface or result from an earlier tree fails the scenario.

#### Checklist

- [ ] RDEV-CK-CONSISTENCY-01-01 — Source, tests, types, documents, and affected consumers each match the final behavior.
- [ ] RDEV-CK-CONSISTENCY-01-02 — Every reported command result was produced from the exact final tree.
- [ ] RDEV-CK-CONSISTENCY-01-03 — Every active sibling checklist is complete.
- [ ] RDEV-CK-CONSISTENCY-01-04 — Every not-applicable checklist result states its reason.

## Risk

### RDEV-SC-RISK-01 — Rule violation: A change exceeds its accepted authority

A React change must stay inside its accepted scope, and a review path must leave its subject alone. An
implicit dependency, migration, architecture, publication, or observable scope expansion fails, and so does a
review that edits the work.

#### Checklist

- [ ] RDEV-CK-RISK-01-01 — The change introduces no unapproved dependency, migration, architecture change, publication action, or observable scope expansion.
- [ ] RDEV-CK-RISK-01-02 — A defined review path leaves the reviewed subject unchanged.

### RDEV-SC-RISK-02 — Normal case: Privileged capability is consumed through its owner

An ordinary React change needs browser, framework, Electron, or server capability. It should reach each one
only through the typed, approved owner; direct access from React fails the scenario.

#### Checklist

- [ ] RDEV-CK-RISK-02-01 — Every privileged capability remains behind its approved owner.
- [ ] RDEV-CK-RISK-02-02 — Electron renderer code reaches Node and IPC only through the typed preload bridge.

## Overall

### RDEV-SC-OVERALL-01 — Adversarial: Cosmetic success hides incomplete work

A change can look complete while skipping a failed gate or leaving a modeled path without completion. Either
condition fails regardless of source appearance.

#### Checklist

- [ ] RDEV-CK-OVERALL-01-01 — Every required gate is reported with its actual result.
- [ ] RDEV-CK-OVERALL-01-02 — Every in-scope path reaches observable completion, a permitted recovery, or an explicit stop condition.
