---
name: go-development
description: "MUST load when implementing, changing, or reviewing Go code through study, design, bottom-up construction, and verification."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Development

Use this operation to implement, change, or review Go code. It produces a studied design, a bottom-up and
project-consistent implementation in author mode, or a read-only finding set in review mode, followed by
evidence that matches the change's real risk.

This operation coordinates the Go family without repeating its policy. Load every applicable preference,
module, testing, and toolchain child; repository workflow and Git owners still control task scope, commits,
publication, and destructive actions.

## Principles

### Start from the live contract

The request, project files, supported toolchains, callers, tests, and release environment together define the
work. An implementation based on one source file or one local Go version is incomplete.

### Design the caller-visible surface first

Package placement, names, types, methods, errors, ownership, and compatibility determine most long-term cost.
Compare a second viable shape before behavior makes the first shape expensive to change.

### Grow a compiling skeleton in verified slices

Establish packages and signatures before detailed behavior, then keep each small slice formatted, analyzable,
compilable, and tested. This exposes structural errors before they spread to callers.

### Let verification match the risk

Focused tests are necessary but not always sufficient. Add module, race, fuzz, platform, cgo, compatibility,
or vulnerability evidence when the changed contract can fail on those surfaces.

## Rules

- **MUST establish author or read-only review mode, exact scope, success criteria, supported Go contract, and
  permitted side effects before changing or executing the project.** Review mode must not format, generate,
  tidy, fix, or otherwise rewrite files.
- **MUST inspect the complete affected set before designing.** Include packages, exported declarations,
  callers, tests, examples, docs, generated inputs and outputs, build constraints, module files, and release
  targets that express the same behavior.
- **MUST resolve package placement, public shape, errors, ownership, concurrency, compatibility, and test seams
  before implementing a material surface.** Obtain the user's decision when a choice changes accepted scope,
  public behavior, or compatibility.
- **MUST build author-mode changes from a compiling skeleton through the smallest complete verified slices.**
  Keep callers, tests, docs, generated state, and module state consistent in the same slice.
- **MUST change generated Go through its source and declared generator unless the project explicitly owns the
  generated file as editable source.** Review generator output and rerun every affected consumer check.
- **NEVER claim a check passed when it was unavailable, skipped, unsupported, cached without useful coverage,
  or run against a different target.** State the exact evidence and remaining gap.

## Procedure

### Phase 1 — Study the Contract

#### 1.1 Lock the task and mode

- Read the requested outcome, purpose, accepted design, included and excluded work, current behavior, success
  criteria, authority, and required handoff. Classify author mode or read-only review mode.
- Read repository instructions and relevant design, issue, release, and operational documents. Resolve an
  ambiguity that could change scope, public behavior, compatibility, external effects, or destructive action
  before continuing.
- Identify the expected artifact: library package, command, service component, generator, test helper, cgo
  boundary, or another Go unit. State what must remain unchanged.
- Record the first observable action and evidence. For a bug, preserve a reproducer or failing test before
  proposing a fix.

#### 1.2 Inspect the Go environment and affected set

- Read `go.mod`, `go.sum`, applicable `go.work`, project scripts, continuous-integration jobs, release targets,
  dependency policy, and container or deployment Go versions. Use
  [`go-toolchain`](../go-toolchain/SKILL.md) to inspect `go version`, module/workspace selection, target, and
  cgo state without persistent configuration changes.
- Map the package graph, exported API, call sites, implementations, interfaces, errors, state, resources,
  concurrency, tests, examples, docs, generated files and directives, build tags, file suffixes, `GOOS`,
  `GOARCH`, and cgo boundary relevant to the task.
- Check Create, Read, Update, and Delete effects across that set. Answer who owns the behavior, what changes,
  when it executes, where it propagates, why it is needed, and how it is built, tested, released, and recovered.
- Inspect local changes and preserve unrelated work. Stop if the task-owned edit cannot be isolated safely.

#### 1.3 Reproduce and find the cause

- For a defect, reproduce the smallest failing behavior under the relevant toolchain, flags, input, and target.
  Separate the first useful diagnostic from later cascading errors.
- Trace the failure through callers, data ownership, error flow, concurrency, generated state, build selection,
  and module graph until changing the cause would remove the complete failure.
- Compare with neighboring project patterns and official Go behavior. Reject a workaround that only suppresses
  the diagnostic, loosens a test, retries a race, or special-cases the reported input.
- If the behavior cannot be reproduced, preserve the evidence gap and design a diagnostic or test that can
  distinguish the leading causes before changing production code.

### Phase 2 — Design the Surface

#### 2.1 Draft the package and API design

- Choose the package and file placement from responsibility and client use. Draft names, inputs, outputs,
  functions, structs, methods, receiver kinds, interfaces, errors, generics, zero-value behavior, ordinary
  resources, concurrent ownership, cancellation, and mutable-data copy boundaries that enter scope.
- Apply [`go-conventions`](../go-conventions/SKILL.md), [`go-design`](../go-design/SKILL.md), and
  [`go-concurrency`](../go-concurrency/SKILL.md) where their triggers apply. Keep each decision with its owning
  skill rather than copying its policy into the implementation plan.
- Identify compatibility with current callers, module consumers, serialized data, error inspection, build
  targets, and the supported Go floor. Decide the migration or deliberate break before editing a public surface.
- Design test seams and evidence with [`go-testing`](../go-testing/SKILL.md). Keep logic separate from I/O,
  clocks, randomness, processes, networks, and other effects that tests must control.

#### 2.2 Compare and confirm the design

- Sketch at least one materially viable alternative for package placement or public shape. Compare client
  clarity, hidden complexity, ownership, verification, compatibility, and current project precedent.
- Select the simplest complete shape justified by real callers. Remove an interface, constructor, generic,
  option, background goroutine, package, or dependency that only serves imagined future use.
- Show the material surface and trade-off to the user when it changes a public contract, accepted design, or
  compatibility position. Revise until that user-owned decision is resolved.
- Define the ordered skeleton and minimal slices: package and signatures, core behavior, callers and
  integrations, tests, documentation, generated state, and module state.

### Phase 3 — Build Bottom-Up

#### 3.1 Establish the compiling skeleton

- In review mode, do not write. Reconstruct the intended skeleton from the diff and proceed to Step 3.3 to
  inspect it against the locked contract.
- In author mode, create or update packages, types, function and method signatures, interfaces, errors, and
  build-constrained file boundaries before detailed behavior. Keep the skeleton as small as the approved
  design permits.
- Update direct callers enough to compile against the new surface without adding placeholder behavior,
  unconditional panics, ignored errors, or stale compatibility shims.
- Apply the project formatter, analysis, and narrow compile or test check. Repair the structure before adding
  dependent logic.

#### 3.2 Grow complete verified slices

- Implement one behavior slice from its lowest dependency through its caller-visible result. Use ordinary Go
  control flow, explicit error handling, clear ownership, and no abstraction beyond the approved design.
- Update affected callers, tests, examples, docs, comments, generated inputs and outputs, build constraints,
  module files, and dependency declarations in the same slice.
- After each slice, run the project formatter, selected analyzers, narrow build, and focused tests. Add race,
  fuzz, platform, or cgo checks early when the slice depends on them.
- On a failure, trace it to the earliest incorrect contract, skeleton, ownership decision, or behavior, repair
  that cause, and repeat the affected checks before the next slice.

#### 3.3 Review the complete implementation

- Compare the final code or review subject with the locked package and API design. Check names, zero values,
  receiver sets, interface direction, typed nils, errors, slice and map aliasing, resource release, goroutine
  ownership, cancellation, backpressure, and synchronization.
- Inspect generated markers and diffs, build-tag selection, platform files, cgo boundaries, module changes,
  dependency versions, and tool declarations. Confirm each belongs to the task.
- Trace every public change through callers, tests, docs, examples, compatibility, and release use. Search for
  stale symbols, duplicated decisions, temporary replacements, TODOs, hidden global state, and ignored errors.
- In review mode, report each finding with path, location, evidence, consequence, and the earliest responsible
  design or implementation decision. Do not mutate the subject.

### Phase 4 — Verify and Hand Off

#### 4.1 Run final verification

- Verify the exact final tree after the last edit. Run the project format check, selected analysis or vet
  target, focused tests, full applicable tests, and builds for the ordinary target.
- Add the applicable race detector, fuzz corpus or bounded run, benchmarks, coverage inspection, module graph
  and tidy check, generated-state check, vulnerability analysis, Go-floor check, platform builds, cgo build,
  and external-consumer compatibility test identified in Phase 1.
- Rerun the original defect reproducer and prove the regression test's before-and-after behavior when safe and
  applicable. Do not substitute a new unit test for an existing external failure path.
- If a check fails, repair the root cause and repeat the narrow failure plus every affected downstream check.
  If it cannot run, record the exact prerequisite, error, risk, and first action that would close the gap.

#### 4.2 Audit scope and hand off

- Review status and diff for unrelated churn, stale docs, accidental generated or module edits, secrets, local
  paths, and untracked task artifacts. Confirm the project still selects the intended Go toolchain and targets.
- Trace each changed path to the task and each accepted design decision to code and evidence. In author mode,
  ensure no in-scope placeholder, deferred caller, or missing test remains.
- Hand off the mode, design, changed or reviewed paths, commands and results, original reproducer, supported
  versions and targets, compatibility position, unavailable checks, and remaining concerns.
- Leave Git staging, commits, publication, and cleanup to their owning workflow. Completion is a consistent
  verified tree in author mode or an evidence-backed read-only finding set in review mode.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
