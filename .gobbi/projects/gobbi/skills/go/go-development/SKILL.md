---
name: go-development
description: "MUST load when implementing, changing, or reviewing Go code through study, design, bottom-up construction, and verification."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Development

Go Development implements, changes, or reviews Go code through `Study -> Design -> Build -> Verify`. Author
mode returns a project-consistent verified tree. Read-only review mode returns evidence-backed findings without
mutating the subject.

This operation owns general construction and review, not the judgments or results of its siblings. Load every
matching Go preference, module, testing, toolchain, architecture, debugging, security, observability,
performance, packaging, or release child and consume its owned result without restating its policy. Repository
workflow owners retain scope, commit, publication, cleanup, and destructive-action authority.

## Principles

### Start from the live contract

Bind the request, project instructions, accepted decisions, affected consumers, minimum supported Go version,
selected Go toolchain version, module's Go language version, required project commands, supported
`GOOS/GOARCH` targets, and intended module, binary, or archive release use before designing. One source file
or ambient Go installation is not the contract.

### Keep material decisions with their owner

Expose viable, reference-backed alternatives before a material selection becomes a plan or write. Permission
to edit a path does not grant authority to choose its design.

### Grow a compiling skeleton in complete slices

Establish the accepted package identities and signatures before dependent behavior. Grow the smallest slice
that keeps callers, test sources, documentation, generated inputs and outputs, module and workspace files,
and dependency declarations coherent.

### Match verification to the claim

Final evidence must exercise the named result and its consumers through required project commands, including
the project default build command plus named target, applicable `GOOS/GOARCH` targets, and material risks. A
focused green check is bounded evidence, not a substitute for an unexecuted required path.

## Rules

- **MUST select exactly one author or read-only review mode and bind its complete effect contract before any
  project command or write.** Authority in one mode or sibling never transfers to another effect.
- **MUST inspect the complete affected set and record its CRUD, dependent co-touch, and 5W1H boundaries before
  design.** Preserve unrelated work and stop when task-owned edits cannot be isolated safely.
- **MUST apply the complete material-choice classifier before planning a design-dependent slice.** Cross no
  unresolved material gate; write permission is separate from decision authority.
- **MUST reproduce a defect under its relevant project command, inputs, selected Go toolchain version, and
  `GOOS/GOARCH` target before changing production code.** If reproduction is unavailable, return a bounded
  diagnostic plan instead of a speculative fix.
- **MUST build author work from a compiling skeleton through the smallest complete verified slices.** Update
  every affected caller and consistency-bound source in the same slice.
- **NEVER use credentials or perform external mutation in general development, and NEVER report unavailable,
  skipped, unsupported, or irrelevant evidence as passed.** Route credentialed reads and external actions to
  their exact owners and consume returned evidence or stop with an exact handoff.

## Procedure

### Phase 1 — Study

#### 1.1 Bind the result and mode

- Read the requested result, purpose, accepted design, included and excluded work, current behavior, success
  criteria, authority, and required handoff. Select author or read-only review mode and state what must remain
  unchanged.
- Read repository instructions and applicable design, issue, operational, and release material. Record the
  intended Go object: package name, import path, package directory or placement, package boundary, public API
  or CLI, module path, project command, binary, or archive.
- For a defect, retain the original symptom and reproducer. Stop before a production change when the failure
  cannot be reproduced; return the leading causes, one discriminating diagnostic per cause, prerequisites,
  owner, and stop condition.

#### 1.2 Bind the Go contract and affected set

- Record the minimum supported Go version, selected Go toolchain version, module's Go language version, module
  path, `go` directive, dependency graph, workspace, exact public package paths, intended module, binary, or
  archive release use, project default build command plus named target, project test command, other affected
  project commands, exact package patterns passed to them, and supported `GOOS/GOARCH` targets.
- Map affected packages, public APIs or CLIs, callers, implementations, errors, mutable data and resources,
  concurrency, test sources, examples, documentation, generated inputs and outputs, build constraints, module
  and workspace files, dependency declarations, binaries, archives, intended module, binary, or archive
  release use, and consumers.
- Record every create, consistency read, update, delete, and dependent co-touch. Name who owns the behavior,
  what changes, when it executes, where it propagates, why it is needed, and how it is built, verified,
  released, and recovered. Preserve unrelated local changes.

#### 1.3 Bind effects for the selected mode

- **Author mode:** project-path writes are only caller-authorized paths; disposable writes are approved
  temporary outputs; every Go cache and download effect is classified and separately authorized; execution is
  limited to the authorized project default build command plus named target, project test command, and other
  named project commands; network access requires separate authority; credential use is none; external
  mutation, including publication, is forbidden. Pause before a material choice, out-of-scope write, cache or
  download, network access, credentialed-read handoff, result-dependent external action, or unsupported
  verification. The terminal result is a verified project-consistent tree with returned evidence from the
  named external-action owner, or an exact block. Recovery retains changed paths and safe retained state and
  names the prerequisite, owner, first recovery action, and handoff.
- **Read-only review mode:** project paths are read-only; disposable writes are approved diagnostics only;
  every cache and download effect is classified and separately authorized; execution is limited to authorized
  read-only project commands and named tools; network access requires separate authority; credential use is
  none; external mutation is forbidden. Pause before mutation or any unclassified effect. The terminal result
  is an evidence-backed finding set or bounded evidence gap. Recovery retains evidence limits and names the
  first recovery action and handoff.

### Phase 2 — Design

#### 2.1 Classify every viable selection

- A choice is material when different viable selections would change task scope or acceptance; user-visible
  behavior; public API or CLI and compatibility or migration; package, module, or process boundary or
  dependency direction; configuration, data, or state flow; mutable-data or resource ownership or lifetime;
  concurrency, cancellation, or shutdown; trust, identity, authorization, cryptography, secrets, protected
  data, or network exposure; failure containment, recovery, or rollback; performance or resource budget or
  measurement strategy; diagnostic signals, redaction, retention, or access; validation strategy, observable
  test boundary, controllable dependency, or strength of the completion claim; or artifact identity, release,
  external effect, or destructive effect.
- A routine execution choice is fully determined by accepted design or a governing project convention and
  changes none of those dimensions. Record its owner and basis. Local syntax, formatting, or a mechanically
  determined private name can qualify.
- For every material choice, compare at least two credible reference-backed alternatives, recommend one, and
  obtain the explicit user or named project-authority decision. A cited prior decision resolves the gate only
  when it is the same decision and its affected context and assumptions still match; changed context reopens
  it. Do not plan or write across an unresolved gate.

#### 2.2 Resolve owned design and compose siblings

- Name each affected package name, import path, package directory or placement, package boundary, public API or
  CLI, type, error, mutable-data or resource ownership, concurrency, compatibility position, observable test
  boundary, and controllable dependency. An exact package pattern is only a project command selector or
  evidence fact.
- Load `go-design`, `go-conventions`, `go-source`, `go-documentation`, and `go-concurrency` for matching
  judgments. Load `go-modules`, `go-testing`, and `go-toolchain` for module, evidence, and project command
  results. Load `go-architecture` or `go-debugging` when the task requires their design or diagnostic result.
- Load `go-security`, `go-observability`, or `go-performance` when that concern motivates the change. Load
  `go-packaging` or `go-release` only when its binary, archive, or release result is requested. General
  development neither absorbs those results nor executes their external actions.
- Define the compiling skeleton and ordered complete slices. Every slice names its lowest dependency,
  caller-visible result, affected callers and consistency-bound sources, and verification.

### Phase 3 — Build

#### 3.1 Establish the compiling skeleton

- In read-only review mode, make no write; reconstruct the intended skeleton from the subject and continue at
  Step 3.3.
- In author mode, establish the accepted package name, import path, package directory or placement, package
  boundary, public API or CLI, types and function/method signatures, errors, and build-constrained source-file
  boundaries before behavior. Update direct callers just enough to compile, with no placeholder behavior,
  unconditional panic, ignored error, or ownerless compatibility shim.
- Apply authorized project commands for formatting, analysis or vet, and narrow build or test checks. Repair
  structural causes before adding dependent logic.

#### 3.2 Grow complete verified slices

- Implement one smallest complete behavior slice from its lowest dependency through its caller-visible result.
  Keep control flow, error handling, ownership, and abstraction within the accepted design.
- Update affected callers, test sources, examples, documentation, generated inputs and outputs, build
  constraints, `go.mod`, `go.work`, dependency graph, and applicable specialist-owned behavior in that slice.
- Run the slice's authorized formatter, analysis, narrow build, focused project test command, and any selected
  race-detector, fuzz, supported `GOOS/GOARCH` target, or cgo evidence. On failure, repair the earliest
  incorrect contract, skeleton, ownership decision, or behavior and repeat affected checks before the next
  slice.

#### 3.3 Review the complete subject

- Compare the final tree or review subject with the accepted design and every active sibling result. Inspect
  package identities, public APIs or CLIs, errors, aliasing, resource lifetime, concurrency, generated
  provenance, build constraints, `GOOS/GOARCH` target selection, module and workspace files, dependencies,
  documentation, callers, and compatibility.
- Search the affected set for stale symbols, duplicated decisions, temporary replacements, TODOs, hidden
  global state, ignored errors, and unrelated churn.
- In read-only review mode, report each finding with path, location, evidence, consequence, and earliest
  responsible design or implementation decision. Leave the subject byte-unchanged.

### Phase 4 — Verify

#### 4.1 Verify the exact final tree or review subject

- Run the authorized project format check, selected project command for analysis or vet, project default build
  command plus named target, project test command, other required project commands, and applicable
  `GOOS/GOARCH` targets against the exact final tree or unchanged review subject.
- Add the selected race-detector, fuzz, benchmark, coverage, module graph, generated-source/output evidence,
  vulnerability, minimum supported Go version, supported `GOOS/GOARCH` target, cgo, external consumer,
  packaging, or release evidence owned by active siblings. Rerun the original reproducer; do not substitute a
  new focused test for an existing external failure path.
- Repair an author-mode root cause and repeat the narrow failure plus affected downstream checks. In review
  mode, record the finding without mutation. For an unavailable check, record the exact prerequisite or first
  useful diagnostic, affected obligation, current evidence, risk, owner, and first recovery action.
- Apply the [evaluation checklist](checklists.md) and every active sibling checklist when the result enters
  Evaluation. A required gap remains outside the completion claim.

#### 4.2 Return the terminal record

- Return the operation and mode; accepted result; decision basis; actual owned object; terminal state as
  success, error, cancellation, timeout, blocked, or user-decision pause; changed or reviewed paths; evidence;
  evidence limits; external reads or effects; compatibility decision; block; recovery; and handoff. State why
  any field is not applicable. Record a Go panic only as diagnosed program behavior, never as an acceptable
  operation state.
- Evidence names the project command, exact package pattern, selected Go toolchain version, flags,
  `GOOS/GOARCH` target, inputs, duration, and result. Compatibility is `compatible`, `migration supplied`,
  `authorized break`, or `unsupported`, with affected consumers.
- An external read or effect names its network destination, cache or download scope, credential use, current
  authority, redaction, retained state, and whether external mutation occurred. A block names the missing
  prerequisite or first useful diagnostic, affected obligation, current evidence, and risk. Recovery names its
  owner, first action, rollback or retry boundary, and retained inputs. A handoff names the next Go child,
  workflow manager, or external-action owner, the authority still required, and the exact input identity.
- Also return the bound scope; every material-choice and cited-prior-decision gate; compiling skeleton and
  complete slices in author mode; original reproducer; final project verification; unsupported claims;
  the literal author-mode statement `author mode used no credentials and performed no external mutation`; and
  any result-dependent external-action owner, returned evidence, prerequisite, retained state, first recovery
  action, and handoff.
- Complete only with a project-consistent verified tree in author mode or an evidence-backed read-only finding
  set in review mode. Otherwise preserve the exact block without calling it success.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
