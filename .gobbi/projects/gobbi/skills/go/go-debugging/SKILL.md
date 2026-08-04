---
name: go-debugging
description: "MUST load when reproducing, diagnosing, or isolating a Go failure, panic, deadlock, race symptom, leak, corruption, unexpected result, or tool diagnostic."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Debugging

Go Debugging reproduces, diagnoses, and isolates a named Go failure. It returns either a reproduced causal
chain ending at the root cause, a bounded diagnostic plan when reproduction is impossible, or an exact block.
It never turns an unproven cause into a fix recommendation.

This operation owns the original symptom, exact reproducer, environment, first useful diagnostic, causal
analysis, and diagnostic handoff. Project source remains read-only. `go-toolchain` owns project command and
named-tool facts, `go-testing` owns evidence strength and design, `go-concurrency` owns race, deadlock, and
concurrent-lifetime judgment, and each accepted source fix belongs to `go-development` and any applicable
specialist.

## Principles

### Preserve the original symptom and its environment

A useful diagnosis explains the reported failure under the conditions that produced it. Keep the original
expected and observed behavior, inputs, process or consumer, environment, and project reproducer command
intact while testing possible causes.

### Prefer discriminating evidence to broad collection

Choose the smallest bounded observation that makes two leading causes produce different results. A compiler
or vet diagnostic, error or panic value, stack trace, goroutine dump, race-detector report, execution trace,
CPU profile, heap profile, block profile, mutex profile, core dump, log record, metric, or failing test or fuzz
input is useful only for the cause it can distinguish.

### Prove a causal chain before naming a root cause

A root cause is the earliest cause whose removal ends the failure. Separate a correlated observation, a
contributing condition, and an intermediate cause from that root cause, and preserve the evidence that makes
each link causal.

### Keep diagnosis separate from repair

Diagnosis may identify the change that another owner should assess, but it does not edit project source or
recommend a symptom patch as completion. Retain the exact reproducer, approved diagnostic paths, and
reproducer inputs so the fix owner does not need to rediscover the failure.

## Rules

- **MUST select exactly one diagnosis mode before action and bind its complete effect contract.** There is no
  author, review, or change mode in this operation, and authority from another operation does not transfer.
- **MUST bind the reported failure before running it.** Record the original symptom, expected and observed
  behavior, environment, exact project reproducer command, exact package pattern, flags, `GOOS/GOARCH` target,
  inputs, affected consumer or process, minimum supported Go version when the affected promise depends on it,
  selected Go toolchain version, and module's Go language version when language behavior matters.
- **MUST make every root-cause claim trace a causal chain from the symptom through discriminating evidence to
  the earliest cause whose removal ends the failure.** A correlated observation, contributing condition, or
  intermediate cause cannot be relabeled as the root cause.
- **MUST return exactly one discriminating diagnostic for each leading cause when reproduction is impossible.**
  Name its prerequisite, owner, exact project command or named tool or observation, expected distinguishing
  result, and stop condition.
- **MUST route sibling-owned facts and actions without copying their contracts.** Use `go-toolchain` for project
  command and named-tool behavior, `go-testing` for evidence design and strength, `go-concurrency` for race or
  deadlock judgment, and the applicable security, observability, or performance operation for that concern.
- **NEVER mutate project source, apply a fix, guess a cause, expose credentials, perform external mutation, or
  call missing evidence a pass.** Pause before unsafe or unbounded execution, a download, network access, an
  unapproved diagnostic output, or an effect whose authority is missing.

## Procedure

### Phase 1 — Bind the Diagnosis

#### 1.1 Bind the symptom, environment, and reproducer

- Record the accepted result, original symptom, expected behavior, observed behavior, applicable success,
  error, cancellation, timeout, or panic exit path, and the affected consumer or process. Preserve the first
  report separately from later observations so a changed symptom cannot silently replace it.
- Record the minimum supported Go version when the affected promise depends on it, the selected Go toolchain
  version, the module's Go language version when language behavior matters, the exact `GOOS/GOARCH` target,
  environment variables with protected values redacted, inputs, dependency or service prerequisites, relevant
  process topology, and applicable execution, repetition, process, destination, and output bounds.
- Bind the exact project reproducer command, exact package pattern only as project-command selection or
  evidence, flags, working directory, inputs, repetition or duration bound, expected result, and observed
  result. If no authorized project reproducer command exists, name the affected obligation and continue only
  to a bounded diagnostic plan or exact block.
- Identify the first useful diagnostic already available, its producing project command, named tool, process,
  service, or consumer; collection conditions; exact reproducer-run identity when available; collection
  authority; retention owner; and evidence limit. Do not ask a later run to prove more than its environment
  and inputs can show.

#### 1.2 Bind diagnosis mode and effects

- Select diagnosis mode only. Project-path writes are none and project source is read-only. Disposable writes
  are limited to approved diagnostic paths with named retention or cleanup boundaries. Go cache writes require
  approval, and every download requires separate authority.
- Project execution is limited to the authorized project reproducer command and named diagnostic tools.
  Network access requires separate authority. Credential use is none. External mutation is none. Stop before
  an unsafe or unbounded run, download, network request, source fix, unapproved diagnostic output, protected-
  data exposure, missing authority, or changed execution bound.
- Every terminal record has exactly one result boundary: reproduced root cause, bounded diagnostic plan, or
  exact block. It separately has exactly one universal terminal state selected from `success`, `error`,
  `cancellation`, `timeout`, `blocked`, or `user-decision pause`. An error, cancellation, or timeout that
  prevents diagnosis uses the exact-block result boundary; it is not a fourth result boundary. A panic is
  diagnosed program behavior, never an operation terminal state.
- Recovery records that project source remained unchanged; retains the exact reproducer inputs and first
  useful diagnostic only in approved diagnostic paths with named retention boundaries; and names the recovery
  owner and first recovery action.

#### 1.3 Select sibling owners and evidence authority

- Load `go-toolchain` to establish the selected Go toolchain version, exact project command syntax and effects,
  exact package-pattern semantics, `GOOS/GOARCH` support, and named compiler, vet, race-detector, trace, profile,
  or debugger behavior. This operation decides why a diagnostic is needed; it does not redefine the tool.
- Load `go-testing` when a failing test or fuzz input, race-detector execution, repeatability claim, or new
  discriminating evidence design is needed. It owns the observable test boundary, controllable dependency,
  cases, repetitions, and evidence-strength judgment.
- Load `go-concurrency` for ownership, lifetime, synchronization, cancellation, shutdown, deadlock, livelock,
  goroutine leak, or race-safety judgment. A race-detector report is executed evidence; it does not replace the
  concurrency judgment.
- Load `go-security` for trust boundaries or protected diagnostic data, `go-observability` for log, metric,
  trace, correlation, redaction, crash-capture, access, or retention decisions, and `go-performance` for
  representative workloads and CPU profile, heap profile, block profile, mutex profile, or execution-trace
  interpretation directed at a performance question. Hand every accepted source fix to `go-development` with
  the applicable specialist.

### Phase 2 — Reproduce and Discriminate

#### 2.1 Run the bounded reproducer

- Confirm the bound environment and authority immediately before execution. Run only the exact project
  reproducer command with the bound exact package pattern, selected Go toolchain version, flags,
  `GOOS/GOARCH` target, inputs, duration or repetition limit, and approved output paths.
- Record project command, exact package pattern, selected Go toolchain version, flags, `GOOS/GOARCH` target,
  inputs, duration, and result. Record cache writes, disposable outputs, exit code or signal, expected behavior,
  observed behavior, and the first output that narrows the cause.
- If the original symptom occurs, preserve the smallest reproducer that stays inside the bound effect contract
  and continue to causal proof. If it does not occur, keep the mismatch explicit and proceed to the bounded
  non-reproduction branch; do not alter
  expected behavior, inputs, or environment until the proposed change is itself the selected discriminating
  diagnostic.
- Stop immediately when execution exceeds its bound, produces an unapproved output, requires broader network
  or download authority, exposes protected data, or reaches a different affected process than the accepted
  reproducer.

#### 2.2 Capture the first useful diagnostic

- Select the earliest available observation that materially narrows the leading causes. Applicable concrete
  evidence may be a compiler or vet diagnostic, error or panic value, stack trace, goroutine dump,
  race-detector report, execution trace, CPU profile, heap profile, block profile, mutex profile, core dump, log
  record, metric, or failing test or fuzz input; there is no quota and no evidence kind is mandatory when it
  cannot discriminate.
- Preserve its exact collection command or observation source, timestamp or run identity when relevant,
  environment, inputs, affected goroutine, process, package, or consumer, redactions, and evidence limits.
  Keep protected values out of durable output and route a protected-data finding to `go-security`.
- Distinguish the diagnostic that first narrowed the causes from later confirmation. A later or more verbose
  output cannot replace the first useful diagnostic unless the earlier output is proven invalid and that limit
  is recorded.

#### 2.3 Select the next discriminating diagnostic

- List the live leading causes supported by the current observations. For each proposed next diagnostic, state
  which causes it separates, its prerequisite, owner, exact project command or named tool or observation,
  expected result for each side, execution and output bounds, and stop condition.
- Select only the lowest-risk authorized diagnostic that can falsify at least one live cause. Do not collect a
  trace, profile, dump, log, or metric merely because it is available; name the causal question first.
- After each result, remove only causes contradicted by that result and record the reason. An inconclusive
  result preserves the causes and evidence limit; it does not increase confidence by repetition alone.

### Phase 3 — Establish the Causal Result

#### 3.1 Prove the causal chain

- Write the chain in order: original symptom, discriminating evidence, contributing condition when applicable,
  intermediate cause when applicable, and the earliest cause whose removal ends the failure. Every arrow must
  name the observation or controlled comparison that supports it.
- Challenge temporal proximity, shared dependencies, retries, scheduling changes, logging changes, and other
  correlations. A condition that changes frequency or severity without ending the failure is contributing; a
  symptom-level guard that hides the observation without removing the cause is not causal completion.
- Repeated reproduction establishes recurrence or stability only; it cannot prove causation by itself.
- Prove the root-cause boundary with a controlled variation or contradictory-case comparison that changes or
  removes the proposed cause, or with equally direct evidence that the proposed cause's removal ends the
  failure. When that causal removal requires a project-source change, return the bounded proof, exact
  reproducer, and fix-owner handoff without implementing the change. If the boundary cannot be proven, retain
  the candidates as leading causes and use the bounded-plan branch.
- State the evidence limits and alternative causes not excluded. Never infer a broader environment,
  `GOOS/GOARCH` target, input, package, process, exit path, or consumer claim from the reproduced run.

#### 3.2 Bound the plan when reproduction is impossible

- Preserve the exact failed reproduction attempts and mismatch from the original symptom. List only leading
  causes supported by current observations, and never label one the root cause.
- For each leading cause, return exactly one discriminating diagnostic with its prerequisite, owner, exact
  project command or named tool or observation, expected distinguishing result, execution and output bound,
  and stop condition. Do not give one cause several interchangeable next actions or one vague action for all
  causes.
- Confirm that project source remained unchanged. Name the approved retained diagnostic paths, reproducer
  inputs, first useful diagnostic, recovery owner, first recovery action, and handoff. The plan is complete
  only when the next owner can execute one named diagnostic without reconstructing the report.

#### 3.3 Stop at an exact block

- Stop when a required environment, input, consumer, process, project reproducer command, named tool, execution,
  repetition, process, destination, or output bound, project-execution authority, cache approval, download or
  network authority, approved output path, or protected-data handling rule is missing. Do not substitute a
  different environment or broaden an effect to make progress.
- Return the missing prerequisite or first useful diagnostic, affected obligation, current evidence, risk,
  owner, proof that project source remained unchanged, approved retained diagnostic paths and reproducer
  inputs, first recovery action, and exact handoff. Report each external read or effect requested, authorized,
  attempted, or absent.
- An execution error, cancellation, or timeout is not automatically the diagnosed program failure. When it
  prevents diagnosis, use the exact-block result boundary and separately select `error`, `cancellation`, or
  `timeout` as the universal terminal state; none is a fourth result boundary. Preserve the difference from
  the original symptom. A panic remains diagnosed program behavior and never becomes an operation terminal
  state.

### Phase 4 — Challenge and Return the Diagnosis

#### 4.1 Challenge the diagnosis

- Attempt to falsify the causal chain with the least invasive approved comparison. Confirm that the first useful
  diagnostic belongs to the accepted reproducer, that each link precedes and explains the next, and that no
  earlier supported cause remains unexamined.
- Reject a misleading stack frame, last log line, race-adjacent failure, timing correlation, coincident metric,
  or successful retry unless discriminating evidence connects it to the symptom. Reject a recommendation that
  merely suppresses the panic, retries the request, adds buffering, increases a timeout, or ignores an error
  without removing the proven cause.
- Confirm that project source stayed unchanged; each diagnostic output, cache write, execution, download, and
  network request matched its authority; credentials and external mutation were absent; and the handoff names
  every sibling owner whose concern remains active.
- Apply [the evaluation checklist](checklists.md) and every active `go` sibling checklist when the result enters
  Evaluation. General Evaluation owns evidence resolution and verdicts.

#### 4.2 Return the terminal record

- Return these universal fields, naming why any field is not applicable: operation and mode; accepted result;
  decision basis; actual owned object; terminal state selected from `success`, `error`, `cancellation`,
  `timeout`, `blocked`, or `user-decision pause`; changed or reviewed paths; project command evidence; evidence
  limits; external reads or effects; compatibility decision selected from `compatible`, `migration supplied`,
  `authorized break`, or `unsupported`; block; recovery; and handoff. Project command evidence means the project
  command, exact package pattern, selected Go toolchain version, flags,
  `GOOS/GOARCH` target, inputs, duration, and result. A panic is diagnosed program behavior, not an operation
  terminal state. The actual owned object is the applicable package name, import path, package directory or
  placement, package boundary, public API or CLI, project command, goroutine, process, input, consumer,
  compiler or vet diagnostic, error or panic value, stack trace, goroutine dump, race-detector report,
  execution trace, CPU profile, heap profile, block profile, mutex profile, core dump, log record, metric, or
  failing test or fuzz input.
- Add the debugging fields: original symptom; exact reproducer; environment; first useful diagnostic; causal
  chain; root cause or leading causes; and distinguishing diagnostic plan. Record project-path writes as none,
  exact reviewed paths, every approved disposable diagnostic path and retention boundary, cache and download
  effects, project execution, network access, credential use as none, and external mutation as none.
- For a reproduced result, return the exact reproducer and environment, first useful diagnostic, proven causal
  chain, root cause, evidence and limits, approved retained diagnostic paths and reproducer inputs, recovery
  owner and action, and fix handoff.
  For impossible reproduction, return the leading causes and exactly one fully bound discriminating diagnostic
  per cause. For an exact block, return its prerequisite, affected obligation, current evidence, risk,
  diagnostic paths approved for retention and reproducer inputs, proof that project source remained unchanged,
  first recovery action, and owner.
- Every path selects exactly one reproduced-root-cause, bounded-diagnostic-plan, or exact-block result boundary
  and separately selects exactly one universal terminal state. A clean unrelated project command, a successful
  retry, a cosmetic terminal record, an unsupported inference, or headings without the required branch fields
  never count as completion.

## References

- [Evaluation checklist](checklists.md) supplies reusable unchecked scenarios and atomic conditions for work
  governed by this skill.
