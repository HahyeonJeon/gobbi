# React Development Lifecycle Checklist

Use this unchecked supplemental `react-development` source with the base [React Development
Checklist](checklists.md) and general Evaluation. It covers binding lifecycle obligations that are not defined
in the saturated base source; `RDEV` remains the stable checklist prefix.

## Project

### RDEV-SC-PROJECT-03 — Normal case: The implementation task has an accepted boundary

Implementation begins from an accepted task and design with explicit preserved behavior and authority. A
task that leaves its target, design relationship, or authority decisions implicit fails the scenario.

#### Checklist

- [ ] RDEV-CK-PROJECT-03-01 — Phase 1 takes an accepted implementation task.
- [ ] RDEV-CK-PROJECT-03-02 — The bound task records preserved behavior.
- [ ] RDEV-CK-PROJECT-03-03 — The target is confirmed as a browser application or Electron renderer.
- [ ] RDEV-CK-PROJECT-03-04 — The implementation task is compared with the accepted design.
- [ ] RDEV-CK-PROJECT-03-05 — Dependency, migration, architecture, or observable-behavior decisions needing further authority are identified.

### RDEV-SC-PROJECT-04 — Expected failure: Design, renderer, or evidence cannot support implementation

Missing design, an unsupported renderer, or an unprovable project fact must stop implementation and return to
its owner. Continuing by assumption fails the scenario.

#### Checklist

- [ ] RDEV-CK-PROJECT-04-01 — A missing or materially changed React design goes to `react-design` before implementation.
- [ ] RDEV-CK-PROJECT-04-02 — React Native or another unsupported renderer returns to project-specific guidance.
- [ ] RDEV-CK-PROJECT-04-03 — Work stops when installed capability, current behavior, affected set, or an executable command cannot be established.

### RDEV-SC-PROJECT-05 — Normal case: Inspection establishes the exact implementation surface

API choice and source editing require a complete installed-project and affected-set inspection. A missing
input, trigger decision, or active child guide makes the inspection incomplete and fails the scenario.

#### Checklist

- [ ] RDEV-CK-PROJECT-05-01 — Renderer, React and renderer versions, framework, compiler, Hooks lint, rendering architecture, host interfaces, commands, and applicable React child skills are established before API choice or source edit.
- [ ] RDEV-CK-PROJECT-05-02 — The exact affected set is recorded before API choice or source edit.
- [ ] RDEV-CK-PROJECT-05-03 — Inspection inputs cover readable source, manifests, lockfile, configuration, tests, types, callers, documents, and verification commands.
- [ ] RDEV-CK-PROJECT-05-04 — Inspection covers component and Hook call sites, state owners, Error Boundaries, host interfaces, and current behavior.
- [ ] RDEV-CK-PROJECT-05-05 — Every React child trigger is tested.
- [ ] RDEV-CK-PROJECT-05-06 — Every applicable convention, compiler, server, TypeScript, and testing child guide is loaded.

### RDEV-SC-PROJECT-06 — Normal case: Project evidence supports implementation design

The affected-set record should preserve established patterns and expose gaps before implementation design
starts. Advancing without those facts fails the scenario.

#### Checklist

- [ ] RDEV-CK-PROJECT-06-01 — The affected-set record includes preserved project patterns and identified gaps.
- [ ] RDEV-CK-PROJECT-06-02 — Phase 2 starts only when evidence supports an implementation design.

## Structure

### RDEV-SC-STRUCTURE-04 — Normal case: The behavior model covers the complete React change

The behavior model connects the accepted design to every affected React and host concern. Missing lifetime,
failure, evidence, or observable-result ownership fails the scenario.

#### Checklist

- [ ] RDEV-CK-STRUCTURE-04-01 — The complete behavior model is based on the accepted design, exact affected set, current rendered behavior, and active React guidance.
- [ ] RDEV-CK-STRUCTURE-04-02 — The behavior model covers every affected component and Hook, props and events, persistent and derived values, state owner, identity, user and system action, external system, loading and empty state, failure and recovery, preservation and reset, Error Boundary fallback, and approved host interaction.
- [ ] RDEV-CK-STRUCTURE-04-03 — Cleanup, cancellation, and obsolete-result protection are defined wherever work may outlive its input or component.
- [ ] RDEV-CK-STRUCTURE-04-04 — Every in-scope behavior connects to its React unit, data flow, state owner, failure handling, host interface, test evidence, and observable result.
- [ ] RDEV-CK-STRUCTURE-04-05 — Duplicate state, render mutation, invalid Hook placement, derivation in an Effect, accidental remounting, or uncontained host access is removed before building.

### RDEV-SC-STRUCTURE-05 — Normal case: The complete skeleton and slice plan precede detail

The implementation plan should expose every structural unit, dependency, slice, verification command, and
performance trigger before building. A plan that defers one of those foundations fails the scenario.

#### Checklist

- [ ] RDEV-CK-STRUCTURE-05-01 — The implementation skeleton defines component and Hook declarations, props and events, state placement, Error Boundary and recovery structure, host adapters, test structure, types, callers, configuration, and document headings.
- [ ] RDEV-CK-STRUCTURE-05-02 — Behavior slices are ordered by dependency from foundation through rendered result.
- [ ] RDEV-CK-STRUCTURE-05-03 — Each planned slice is paired with focused evidence.
- [ ] RDEV-CK-STRUCTURE-05-04 — The plan records the skeleton, dependency order, slice list, file-level changes, per-slice verification command, and final rendered scenarios.
- [ ] RDEV-CK-STRUCTURE-05-05 — The plan records a performance trigger or an evidence-based reason performance does not apply.

### RDEV-SC-STRUCTURE-06 — Expected failure: The implementation plan cannot support complete construction

A contradiction, missing test mechanism, deferred layer, or incomplete skeleton must return to its earliest
owner before detailed work starts. Continuing around the gap fails the scenario.

#### Checklist

- [ ] RDEV-CK-STRUCTURE-06-01 — A structural contradiction returns to Step 2.1.
- [ ] RDEV-CK-STRUCTURE-06-02 — A missing test mechanism goes to `react-testing`.
- [ ] RDEV-CK-STRUCTURE-06-03 — Build starts only when no in-scope layer is deferred.
- [ ] RDEV-CK-STRUCTURE-06-04 — A missing or contradictory skeleton unit is repaired through Phase 2 before detail is added.

### RDEV-SC-STRUCTURE-07 — Normal case: The materialized skeleton implements the accepted design

The static implementation structure must remain traceable to the design it realizes. A skeleton that changes
the accepted direction without returning to design fails the scenario.

#### Checklist

- [ ] RDEV-CK-STRUCTURE-07-01 — The materialized skeleton maps to the accepted design.

## Performance

### RDEV-SC-PERFORMANCE-02 — Poor quality: Performance work lacks a measured premise

Profiling and memoization must follow relevant evidence, and a repair must remeasure any premise it changes.
Intuitive optimization or stale measurement fails the scenario.

#### Checklist

- [ ] RDEV-CK-PERFORMANCE-02-01 — Programmatic or production profiling is used only when its overhead and build requirements are deliberate and relevant.
- [ ] RDEV-CK-PERFORMANCE-02-02 — Memoization is not added from intuition.
- [ ] RDEV-CK-PERFORMANCE-02-03 — Performance measurement is repeated when a repair changes a performance premise.

## Aesthetics

### RDEV-SC-AESTHETICS-02 — Adversarial: Placeholders create cosmetic completion

A complete-looking skeleton can still contain behavior that has not been implemented. Reporting a placeholder
as finished work hides that gap and fails the scenario.

#### Checklist

- [ ] RDEV-CK-AESTHETICS-02-01 — Placeholders are not reported as completed behavior.

## Usage

### RDEV-SC-USAGE-03 — Normal case: Each slice preserves the complete observable behavior

Each slice must include its applicable states and lifetime behavior, exercise the rendered result, and retain
usable Error Boundary recovery. A source-only or partially usable slice fails the scenario.

#### Checklist

- [ ] RDEV-CK-USAGE-03-01 — Every slice includes its required loading, empty, failure, recovery, preservation, reset, cleanup, cancellation, and obsolete-result behavior.
- [ ] RDEV-CK-USAGE-03-02 — A focused rendered exercise runs before the next slice.
- [ ] RDEV-CK-USAGE-03-03 — Each required Error Boundary has an observable fallback and recovery route.
- [ ] RDEV-CK-USAGE-03-04 — Completion requires rendered outcome and required local checks to agree.

## Consistency

### RDEV-SC-CONSISTENCY-03 — Rule violation: A slice leaves its artifacts or model inconsistent

Every slice must keep its complete affected set, evidence record, and accepted React model aligned. A stale
artifact, missing check, incomplete record, or model drift fails the scenario.

#### Checklist

- [ ] RDEV-CK-CONSISTENCY-03-01 — Every slice keeps source, tests, types, callers, configuration, and documents current.
- [ ] RDEV-CK-CONSISTENCY-03-02 — A narrow check runs before the next slice.
- [ ] RDEV-CK-CONSISTENCY-03-03 — The slice record contains accepted behavior, changed files, rendered observation, focused command, actual result, and limitation on what the slice proves.
- [ ] RDEV-CK-CONSISTENCY-03-04 — Detailed implementation preserves the accepted complete component, Hook, state-owner, identity, Effect, Error Boundary, and host-interface model.

### RDEV-SC-CONSISTENCY-04 — Expected failure: A slice exposes a blocking defect

A failing slice must stop breadth and return a design defect to the design phase. Expanding the change while
the slice remains invalid fails the scenario.

#### Checklist

- [ ] RDEV-CK-CONSISTENCY-04-01 — A failing slice stops expansion.
- [ ] RDEV-CK-CONSISTENCY-04-02 — A design defect exposed by a slice returns to Phase 2.

## Risk

### RDEV-SC-RISK-03 — Adversarial: Repair or verification hides an unresolved failure

Verification and repair must preserve the first failure, keep unavailable checks visible, and stop
recoverably. Suppression, weakened assertions, or an endless retry loop fails the scenario.

#### Checklist

- [ ] RDEV-CK-RISK-03-01 — Every unavailable or skipped required check remains a completion gap.
- [ ] RDEV-CK-RISK-03-02 — Repair begins with preserved first-failure evidence.
- [ ] RDEV-CK-RISK-03-03 — The repair loop ends only in a passing local result or an explicit stop with blocker and recoverable state.
- [ ] RDEV-CK-RISK-03-04 — Repair never hides a failure or weakens an assertion.

## Overall

### RDEV-SC-OVERALL-04 — Adversarial: A complete-looking handoff overstates React-local completion

The final record must identify the exact verified tree and diff without claiming downstream evidence or
ignoring unresolved local work. A polished handoff that does otherwise fails the scenario.

#### Checklist

- [ ] RDEV-CK-OVERALL-04-01 — Final verification records exact tree identity, scenario observations, every command and result, active-child evidence, unavailable or skipped checks, and limits of substitutes or local checks.
- [ ] RDEV-CK-OVERALL-04-02 — Handoff states the exact final diff plus behavior and state coverage.
- [ ] RDEV-CK-OVERALL-04-03 — Handoff does not claim downstream application evidence as React-local completion.
- [ ] RDEV-CK-OVERALL-04-04 — Completion stops while any in-scope local implementation or required check remains unresolved.
