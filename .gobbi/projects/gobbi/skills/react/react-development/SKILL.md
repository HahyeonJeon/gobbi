---
name: react-development
description: "MUST load when implementing one scoped React change for a browser application or Electron renderer."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# React Development

React Development turns one accepted React design and bounded implementation task into a verified React-local
source change. It follows Study → Design → Build → Verify → Handoff and ends with exact final-tree evidence.

This operation covers React components, Hooks, state behavior, Error Boundary behavior, approved host-interface
use, related tests, types, callers, documents, and ordinary client-render profiling. It does not cover complete
browser journeys, cross-layer integration, production delivery and emission, installed outcomes, Electron
platform and runtime proof, release work, independent Evaluation, or publication.

React Native is outside this operation and requires project-specific guidance.

## Principles

### Start from an accepted design

Implementation realizes an agreed React design and does not silently create a new product or component
direction.

### Establish the whole skeleton before detail

A complete component, state, failure, host, test, and caller skeleton exposes missing structure before detailed
behavior makes it expensive to repair.

### Grow one verified behavior slice at a time

Each small slice keeps rendered behavior, source, tests, types, callers, and documents aligned before the next
slice expands the result.

### Repair causes and measure claims

Verification failures return to the earliest incorrect decision or implementation unit. A React performance
claim requires a measurement of the relevant interaction and component tree.

## Rules

- **MUST begin with an accepted implementation task and React design.** Hand a missing or materially changed
  design to `react-design` before implementation proceeds.

- **MUST inspect the installed project and record the exact affected set before choosing an API or changing
  source.** Confirm the renderer, React and renderer versions, framework, compiler, Hooks lint, rendering
  architecture, host interfaces, commands, and every applicable React child skill.

- **MUST build the complete implementation skeleton before detailed behavior and grow the result through the
  smallest verified slices.** Keep source, tests, types, callers, configuration, and documents current in
  every slice.

- **MUST preserve the accepted component, Hook, state owner, identity, Effect, Error Boundary, and host-interface
  model.** Implement required loading, empty, failure, recovery, preservation, reset, cleanup, cancellation,
  and obsolete-result protection.

- **MUST verify the exact final tree through rendered behavior and every applicable test, lint, type, and build
  check.** Measure material client-render behavior, repair root causes, repeat affected checks, and report every
  unavailable or skipped check as a gap.

- **NEVER claim independent judgment, downstream application evidence, or publication from React-local
  implementation.** Route each remaining claim to its named skill and leave external publication to separate
  explicit authority.

## Procedure

### Phase 1 — Study the React Change

#### 1.1 Bind the accepted design and implementation authority

- **Input / precondition:** Take the accepted implementation task, observable outcome, React design, preserved
  behavior, included and excluded work, constraints, verification requirements, and change authority.
- **Action / decision:** Confirm that the target is a browser application or Electron renderer, exclude React
  Native, compare the task with the accepted design, and identify any dependency, migration, architectural, or
  observable behavior decision that requires further authority.
- **Evidence / state:** Record the accepted outcome, design reference, implementation boundary, non-goals,
  authorized changes, required evidence, and decisions that remain outside the task.
- **Next branch / recovery:** Hand a missing design or material design change to `react-design`; stop with the
  missing decision when authority is incomplete, and continue only when the React implementation is bounded.

#### 1.2 Inspect the project and exact affected set

- **Input / precondition:** Use the bound task and readable source, manifests, lockfile, configuration, tests,
  types, callers, documents, and verification commands.
- **Action / decision:** Inspect the target renderer, installed React and renderer versions, framework,
  compiler and Hooks lint configuration, rendering architecture, component and Hook call sites, state owners,
  Error Boundaries, host interfaces, and current behavior. Test every React child trigger and load the
  applicable convention, compiler, server, TypeScript, and testing guidance.
- **Evidence / state:** Produce the exact affected set across source, tests, types, callers, configuration, and
  documents, plus the applicable React child skills, preserved project patterns, commands, and identified gaps.
- **Next branch / recovery:** Stop when the installed capability, current behavior, affected set, or executable
  command cannot be established; return an unsupported renderer to its project guidance and continue when the
  evidence can support an implementation design.

### Phase 2 — Design the Implementation

#### 2.1 Model the complete React behavior

- **Input / precondition:** Take the accepted design, exact affected set, current rendered behavior, and active
  React guidance from Phase 1.
- **Action / decision:** Map each affected component and Hook, props and events, persistent and derived values,
  state owner, identity, user and system actions, external systems, loading and empty states, failure and
  recovery, preservation and reset, Error Boundary fallback, and approved host interaction. Define cleanup,
  cancellation, and obsolete-result protection wherever work can outlive its current input or component.
- **Evidence / state:** Produce one implementation model that connects every in-scope behavior to its React
  unit, data flow, state owner, failure handling, host interface, test evidence, and observable result.
- **Next branch / recovery:** Remove duplicate state, render mutation, invalid Hook placement, derivation inside
  an Effect, accidental remounting, or uncontained host access before proceeding; return a new
  material design choice to `react-design`.

#### 2.2 Plan the skeleton, slices, and verification

- **Input / precondition:** Use the complete behavior model, affected set, project conventions, and required
  evidence.
- **Action / decision:** Define the whole implementation skeleton before detailed behavior, including
  component and Hook declarations, props and events, state placement, Error Boundary and recovery structure,
  host adapters, test structure, types, callers, configuration, and document headings. Order the smallest
  complete behavior slices from foundation through rendered result and pair each slice with focused evidence.
- **Evidence / state:** Record the skeleton, dependency order, slice list, file-level changes, verification
  command for each slice, final rendered scenarios, and performance trigger or evidence-based reason it does
  not apply.
- **Next branch / recovery:** Return a structural contradiction to Step 2.1, an unresolved React choice to
  `react-design`, and a missing test mechanism to `react-testing`; continue only when the whole change can grow
  without a deferred in-scope layer.

### Phase 3 — Build the React Change

#### 3.1 Establish the complete implementation skeleton

- **Input / precondition:** Begin with the accepted implementation model, ordered skeleton, exact affected set,
  and project-native file organization.
- **Action / decision:** Materialize every applicable component, Hook, prop and event interface, state location,
  Error Boundary fallback and recovery route, host adapter, test structure, type, caller update, configuration
  entry, and document heading before filling in detailed behavior. Render or exercise the static structure and
  run the narrow construction check the project provides.
- **Evidence / state:** Retain the complete skeleton, its mapping to the accepted design, the rendered or static
  observation, and construction-check result without presenting placeholders as completed behavior.
- **Next branch / recovery:** Repair a missing or contradictory unit through Phase 2 before adding detail;
  return a product-direction conflict to `react-design` and proceed only when every in-scope behavior has a
  place in the skeleton.

#### 3.2 Grow the smallest verified slices

- **Input / precondition:** Start from the complete skeleton and select the smallest remaining behavior slice
  that reaches an observable rendered result.
- **Action / decision:** Implement that slice across source, tests, types, callers, configuration, and documents.
  Add its required loading, empty, failure, recovery, preservation, reset, cleanup, cancellation, and
  obsolete-result behavior, then run the focused rendered exercise and narrow check before selecting another
  slice.
- **Evidence / state:** Maintain a slice record that connects the accepted behavior to changed files, rendered
  observation, focused command, actual result, and any limitation on what the slice proves.
- **Next branch / recovery:** Stop expansion when a slice fails; trace a design defect to Phase 2 and an
  implementation defect to its earliest changed unit, repair it, and repeat the slice evidence before adding
  breadth.

### Phase 4 — Verify and Repair the Final Tree

#### 4.1 Exercise rendered behavior and project checks

- **Input / precondition:** Use the exact tree after the final implementation edit, the accepted scenarios,
  active React guidance, and every command identified in Phase 1.
- **Action / decision:** Exercise the primary rendered behavior and applicable loading, empty, failure,
  recovery, preservation, reset, Error Boundary, accessibility, and host-interface behavior. Run focused
  component or Hook tests, affected suites, Hooks and compiler lint, type checks, builds, and applicable local
  server-render, hydration, or Electron construction checks.
- **Evidence / state:** Record the exact final tree identity, scenario observations, every command and result,
  evidence from active React child skills, unavailable or skipped checks, and the limit of every substitute
  or local check.
- **Next branch / recovery:** Send every failure to Step 4.3, keep an unavailable required check visible as a
  completion gap, and proceed only when the rendered outcome and required local checks agree.

#### 4.2 Measure material client-render performance

- **Input / precondition:** Use each accepted performance hypothesis, observed regression, expensive
  interaction, or identity-sensitive update identified during design, implementation, or verification.
- **Action / decision:** Measure the named interaction and component tree with the
  [React Developer Tools Profiler](https://react.dev/learn/react-developer-tools) or
  [`Profiler`](https://react.dev/reference/react/Profiler), recording the environment, metric, baseline, and
  comparison. Use programmatic or production profiling only when its added overhead and build requirements are
  deliberate and relevant to the claim.
- **Evidence / state:** Retain the interaction, component tree, tool, environment, baseline, comparison,
  measurement, and supported conclusion, or the evidence-based reason no material client-render trigger
  applies.
- **Next branch / recovery:** Return an unsupported performance claim, regression, or unexpected render to
  Step 4.3; do not add memoization from intuition, and proceed when the measurement supports the final result
  or no material trigger applies.

#### 4.3 Repair root causes and repeat verification

- **Input / precondition:** Take each failed check, rendered discrepancy, performance regression, stale
  dependent file, or self-verification finding with its preserved first evidence.
- **Action / decision:** Trace the failure to the earliest incorrect design decision, model, skeleton unit,
  component, Hook, state owner, Effect, identity choice, Error Boundary, host adapter, test, type,
  configuration, or verification method. Repair the smallest complete cause and propagate the change through
  every affected source, test, type, caller, configuration entry, and document.
- **Evidence / state:** Rerun the narrow failing check, every affected downstream check, Step 4.1 on the exact
  final tree, and Step 4.2 when the repair changes a performance premise; retain the new results and remaining
  gaps.
- **Next branch / recovery:** Repeat this step until the local result passes or reaches an explicit stop with
  its blocker and recoverable state; never hide a failure, weaken an assertion, or substitute an earlier tree.

### Phase 5 — Hand Off React-Local Completion

#### 5.1 Separate local completion from application evidence

- **Input / precondition:** Require the exact final diff, rendered observations, command results, performance
  record, results from active React child skills, limitations, and unresolved application work from Phase 4.
- **Action / decision:** Route complete browser journeys to `web-frontend`; cross-layer integration and release
  readiness to `web-feature`; production build, deployment, live verification, and rollback to
  `web-deployment`; production log, metric, trace, crash, and error emission plus destination feedback to
  `web-observability`; complete installed outcomes to `desktop-delivery`; desktop target, data, update, and
  release judgments to `desktop-release`; Electron platform changes to `electron-development`; Electron
  process, security, lifecycle, native, and packaged-runtime evidence to `electron-testing`; and packaging,
  signing, notarization, and update rehearsal to `electron-release`. Route compiler, server, TypeScript, and
  test migrations to `react-compiler`, `react-server`, `react-typescript`, and `react-testing` respectively,
  and route independent judgment to Evaluation.
- **Evidence / state:** Return the React-local outcome, changed files, behavior and state coverage, exact
  commands and results, performance evidence, visible gaps, remaining risks, and a routing record that names
  each downstream claim without presenting it as complete.
- **Next branch / recovery:** Return only a finding traced to React source or local React behavior as a new
  scoped `react-development` task with fresh acceptance and evidence.
- Return every downstream application, desktop, Electron, migration, testing, release, deployment, or
  observability finding to the exact skill named in the Action map. Keep publication as a separate explicitly
  authorized action, and stop while any in-scope local implementation or required check remains unresolved.

## References

- [React Development Checklist](checklists.md)
