---
name: go-performance
description: "MUST load when diagnosing or changing Go latency, throughput, allocation, memory retention, garbage collection, CPU use, contention, binary size, startup time, or profile-guided optimization."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Go Performance

Go Performance diagnoses, verifies, or coordinates changes to Go performance and resource use. It begins with
one named question and representative workload, then selects only the named diagnostic evidence that can
answer that question.

The operation returns a representative-profile diagnosis, comparable verification, verified performance
change with a regression guard, bounded investigation, or exact block. Every result states its workload,
`GOOS/GOARCH` target, environment, comparison limits, and resource trade-offs.

This operation owns performance questions, workload representativeness, evidence selection, bottleneck proof,
comparison, performance trade-offs, and regression-guard requirements. General construction, evidence-source
design, project-command mechanics, concurrent ownership, and unrelated failure diagnosis remain with their
named sibling owners.

## Principles

### Begin with one performance question

A number matters only when a named consumer can connect it to an accepted outcome or resource limit. Bind the
metric, unit, workload, environment, and comparison question before selecting a diagnostic mechanism.

### Match evidence to the cost

CPU time, live heap, allocation, goroutine state, blocking, mutex contention, scheduling, binary size, and
startup time are different objects. Select the evidence kind that can observe the named cost.

### Compare like with like

A baseline and result are comparable only when their workload, build identity, `GOOS/GOARCH` target,
environment, measurement method, and known confounders match or their differences are bounded explicitly.

### Optimize a measured cause

A top row, proxy metric, or benchmark score is a clue rather than a root cause. Accept a change only when
causal evidence connects the measured cost to the performance question and comparable evidence proves the result.

## Rules

- **MUST select exactly one diagnosis/verification or change mode and bind its complete effect contract before
  any project command, local output, cache use, download, network request, or write.** One mode never inherits
  the other mode's project-write authority.
- **MUST bind the performance question, consumer, metric and unit, accepted budget or comparison question,
  representative workload, supported `GOOS/GOARCH` target, and selected Go toolchain version,
  exact project command, environment, and confounders before measurement.** Keep unrepresented inputs and
  unsupported `GOOS/GOARCH` targets outside the claim.
- **MUST name the exact evidence kind and use it only for the question it can answer.** A CPU profile, heap
  profile, goroutine profile, block profile, mutex profile, Go execution trace, runtime statistic, workload
  measurement, binary-size inventory, startup-time measurement, and PGO CPU pprof input are not interchangeable.
- **MUST establish comparable baseline evidence before selecting or implementing a change and prove the
  bottleneck with causal evidence.** A top row, proxy metric, changed allocation count, benchmark score, or
  trace visualization alone cannot establish the root cause.
- **MUST verify the accepted result with absolute values, units, uncertainty or noise, workload and environment
  identity, and resource trade-offs, and give every accepted change a regression guard.** A relative percentage
  or local improvement without baseline and result values cannot prove completion.
- **NEVER generalize beyond the scope of the selected project contract and matched evidence.** Unselected
  budgets, workloads, diagnostic tools, production diagnostic-collection paths, and PGO paths stay outside
  universal mandates, while absent, noisy, nonrepresentative, proxy-only, profiler-distorted, unsupported, or
  incomparable evidence stays outside improvement claims.

## Procedure

### Phase 1 — Bind the Performance Contract and Authority

#### 1.1 Bind the question, workload, and supported environment

- Read the requested result, affected consumer, accepted decisions, current performance behavior, production
  or support evidence supplied by the caller, required compatibility, and the performance or resource concern.
  Select the applicable result boundary: representative-profile diagnosis, comparable verification, verified
  performance change with a regression guard, bounded investigation, or exact block.
- State one performance question. Name the observable metric and unit, accepted budget or comparison question,
  direction of improvement, affected consumer, and the behavior that must remain correct. Do not require every
  latency, throughput, allocation, memory-retention, garbage-collection, CPU-use, contention, binary-size, or
  startup-time measure when only one can answer the question.
- Define the representative workload by its inputs and distribution, request or operation mix, rate or
  concurrency when applicable, data size, process state, warmup, duration, repetitions, and stop condition.
  Record why it represents the affected consumer and every population, path, or operating state it omits.
- Record the source and build identity, minimum supported Go version when acceptance depends on it, selected Go
  toolchain version, module's Go language version when behavior depends on it, exact project command, exact
  package pattern only as project-command selection or evidence, supported `GOOS/GOARCH` target, working directory,
  environment, resource limits, and known confounders.

#### 1.2 Select one mode and bind every effect

- **Diagnosis/verification mode:** project source is read-only. CPU profiles, heap profiles, goroutine profiles,
  block profiles, mutex profiles, Go execution traces, runtime-statistic reports, workload measurements,
  binary-size inventories, startup-time measurements, and temporary data may be written only to approved paths
  with named retention or cleanup boundaries. Cache effects require authorization, and each download requires
  separate authorization. Execution is limited to authorized project commands for the representative workload
  and named diagnostic tools. Network access requires separate authorization. Record the three facts
  separately: `credential use: none`; `external mutation: none`; `release effect: none`. Pause before
  nonrepresentative execution, a download or network request, unbounded output, or a material measurement
  choice. Return a representative-profile diagnosis, comparable verification, bounded investigation, or exact
  block. Recovery retains exact evidence and comparison limits at approved paths and names the recovery owner
  and first action.
- **Change mode:** project writes occur only through authorized `go-development` work. Local diagnostic and
  measurement outputs are approved and bounded, cache effects require authorization, and downloads require
  separate authorization. Execution is limited to authorized project commands for the representative workload
  and verification. Network access requires separate authorization. Record the three facts separately:
  `credential use: none`; `external mutation: forbidden`; `release effect: none`. Pause before a material
  performance budget or measurement-strategy choice, a download or network request, or an out-of-scope write.
  Return a verified performance change with a regression guard or exact block. Recovery retains baseline inputs
  and evidence at approved paths and names the rollback or recovery owner and first action.
- Authority does not move between modes or from a sibling. A read-only baseline does not authorize source
  writes, and authorization to change project source does not authorize a download, network request, credential,
  external mutation, release effect, or unbounded local output.

#### 1.3 Route sibling-owned work

- Route general code construction and review to `go-development`. Give it the accepted design, authorized
  paths, measured bottleneck, correctness invariants, comparison method, and regression-guard question without
  copying its `Study -> Design -> Build -> Verify` procedure.
- Route benchmark and test-case design, observable test boundaries, controllable dependencies, repetitions,
  and evidence-strength judgment to `go-testing`. Route project-command syntax and effects, exact package
  patterns, named CPU profile, heap profile, goroutine profile, block profile, mutex profile, and Go execution
  trace tools, build flags, cache and download behavior, and selected Go toolchain version facts to
  `go-toolchain`.
- Route contention, scheduling, goroutine ownership, synchronization, queue bounds, backpressure, cancellation,
  and shutdown judgment to `go-concurrency`. Route failure reproduction outside the established performance
  bottleneck to `go-debugging`; do not relabel an unrelated failure as performance evidence.

### Phase 2 — Select Evidence and Establish the Baseline

#### 2.1 Select question-matched evidence

- Use a CPU profile to locate active CPU cost; a heap profile for allocation samples, live memory, or retention
  questions; a goroutine profile for current goroutine stacks; a block profile for blocking on synchronization;
  and a mutex profile for lock contention. Bind each collection mechanism and interpretation to the selected Go
  toolchain through `go-toolchain`.
- Use a Go execution trace for scheduling, goroutine execution, syscalls, garbage-collection events, heap-size
  events, and parallelism questions. Use runtime statistics for named memory, garbage-collection, goroutine, or
  runtime-state questions. Use benchmarks or representative workload measurements for end-to-end latency,
  throughput, allocation, or resource outcomes.
- Use a binary-size inventory for binary size and a startup-time measurement for process startup. Use a
  representative CPU pprof input only when PGO is selected. Do not call either a binary-size inventory,
  startup-time measurement, Go execution trace, heap profile, or other non-CPU evidence a CPU profile.
- Select only the evidence needed to answer the question. Record its exact project command or observation
  source, output path, collection duration or repetitions, sample basis, expected distinguishing result,
  overhead, retention or cleanup boundary, and evidence limits.

#### 2.2 Establish comparable baseline evidence

- Before design or change, record the baseline source and build identity; exact project command; exact package
  pattern when it is a project-command input; `GOOS/GOARCH` target; selected Go toolchain version; workload
  input and distribution; warmup and process state; repetitions or duration; environment and resource limits;
  diagnostic overhead; absolute result and unit; uncertainty or observed noise; and evidence limits.
- Run only the authorized project command and named diagnostic tool within the accepted time, repetition,
  process, memory, disk, output, and network bounds. Preserve the exact CPU profile, heap profile, goroutine
  profile, block profile, mutex profile, Go execution trace, report, inventory, or measurement identity used.
- Repeat enough to characterize observed variation under the accepted comparison method. Do not invent a
  repetition count, confidence threshold, or statistical method when the project has not selected one; route
  the evidence design to `go-testing` and pause if the selection is material.
- If baseline evidence is absent, noisy beyond the accepted comparison rule, nonrepresentative, proxy-only,
  distorted by diagnostic overhead, unsupported for the promised `GOOS/GOARCH` target, or incomparable with
  the proposed result, continue only to Step 3.3.

#### 2.3 Interpret Go diagnostics within their documented limits

- The official [Go Diagnostics guide](https://go.dev/doc/diagnostics) states that profiling locates expensive
  or frequently called code and that CPU, heap, goroutine, block, and mutex profiles answer different
  questions. Interpret each CPU, heap, goroutine, block, or mutex profile only within its samples, workload,
  duration, and collection settings.
- The same [Diagnostics guide](https://go.dev/doc/diagnostics) describes the Go execution trace as runtime and
  scheduling evidence and says it is not the preferred hot-spot mechanism for excessive CPU or memory use.
  Do not substitute a trace visualization for a CPU profile or heap profile question.
- The guide also warns that simultaneously enabled diagnostics can distort one another. Record which
  diagnostics overlapped, measure material overhead, isolate them when the accepted comparison requires it,
  and keep distorted results outside the completion claim.
- Production collection is optional, needs its own current authority, and can add measurable cost. Do not
  prescribe production profiling for every project or describe it as having no operational risk.

### Phase 3 — Prove the Bottleneck or Bound the Investigation

#### 3.1 Connect measured cost to a causal bottleneck

- Map the performance question to the measured cost in the named CPU profile, heap profile, goroutine profile,
  block profile, mutex profile, Go execution trace, runtime-statistic report, workload measurement,
  binary-size inventory, or startup-time measurement. Name the affected operation, package or function when
  proven, caller-visible outcome, and share of the accepted cost.
- Form supported bottleneck hypotheses from the evidence, then select one discriminating measurement or
  controlled comparison for each live hypothesis. State the result that would support or contradict it,
  prerequisites, owner, resource and output bounds, and stop condition.
- Prove the causal connection with the smallest accepted variation or contradictory-case comparison. A top
  row, proxy metric, benchmark score, trace visualization, changed allocation count, last log line, or temporal
  correlation alone does not establish the bottleneck.
- Reject a candidate that improves a proxy while the accepted latency, throughput, allocation, memory,
  garbage-collection, CPU, contention, binary-size, or startup outcome regresses. Preserve contributing costs
  and unexcluded alternatives as evidence limits.

#### 3.2 Compare alternatives and accept one design

- Compare at least two credible reference-backed alternatives when more than one can address the proven
  bottleneck. For each, state the expected effect on the accepted metric and its latency, throughput,
  allocation, retained-memory, garbage-collection, CPU, contention, binary-size, startup-time, build-time,
  complexity, compatibility, and maintenance trade-offs that apply.
- Record rejected alternatives and why their trade-offs do not satisfy the accepted question. Recommend one
  design and identify its correctness invariants, expected performance mechanism, affected consumers,
  supported `GOOS/GOARCH` targets, and comparison method.
- Treat a performance or resource budget, workload definition, measurement strategy, diagnostic-overhead
  allowance, optimization mechanism, and validation-strength choice as material when viable selections change
  acceptance or resource ownership. Pause for the user or named project-authority decision unless a cited
  prior decision resolves the same choice with matching context and assumptions.

#### 3.3 Return a bounded investigation or exact block

- Use a bounded investigation when current evidence supports live hypotheses but cannot prove a bottleneck or
  comparable result. Return the first useful diagnostic, leading hypotheses, exactly one discriminating next
  measurement per hypothesis, expected distinguishing result, prerequisites, evidence limits, owner, approved
  retained state, recovery action, stop condition, and exact handoff.
- Use an exact block when a required question, consumer, budget or comparison rule, representative workload,
  supported `GOOS/GOARCH` target, exact project command, selected Go toolchain version, environment, authority,
  output path, diagnostic mechanism, or material decision is absent. Name the missing prerequisite or first
  useful diagnostic, affected obligation, current evidence, risk, owner, approved retained state, first
  recovery action, and handoff.
- Absent, noisy, nonrepresentative, proxy-only, unsupported for the accepted `GOOS/GOARCH` target,
  profiler-distorted, or incomparable evidence never becomes a matched improvement claim. Keep every
  unexecuted workload, input, environment, source or build identity, and `GOOS/GOARCH` target outside the result.

### Phase 4 — Coordinate and Verify the Result

#### 4.1 Coordinate the authorized performance change

- Enter only in change mode with a proven bottleneck, accepted design, comparable baseline, authorized project
  paths, and defined regression-guard question. Give those inputs to `go-development`; do not copy its
  construction steps or write outside its authorized result.
- Inspect the returned change against the accepted performance mechanism and correctness invariants. A source
  change that cannot be tied to the proven bottleneck returns to Step 3.1 rather than receiving a favorable
  interpretation from a new result.
- Keep `credential use: none`, `external mutation: forbidden`, and `release effect: none` unchanged throughout
  the change. A locally verified binary, CPU profile, or benchmark result grants no publication, deployment,
  production diagnostic collection, configuration, or external-state authority.

#### 4.2 Compare baseline and result evidence

- Collect result evidence with the same question, metric and unit, representative workload, source and build
  identity fields, project-command shape, exact package pattern role, `GOOS/GOARCH` target, selected Go
  toolchain version, warmup and process state, duration or repetitions, environment and resource limits,
  diagnostic settings, and comparison method as the baseline. Record and bound every difference.
- Report baseline and result absolute values and units, direction, relative comparison when useful, uncertainty
  or observed noise, sample or repetition basis, environment, workload representativeness and limits,
  `GOOS/GOARCH` target, diagnostic overhead, and evidence limits. A relative percentage without both absolute
  values and units is insufficient.
- Report all measured regressions and applicable resource trade-offs, including latency, throughput,
  allocation, retained memory, garbage collection, CPU, contention, binary size, startup time, and build time.
  Do not call a result improved when the accepted outcome or an accepted resource limit regresses.
- In diagnosis/verification mode, return comparable verification only when the supplied baseline and result
  satisfy this same comparison contract. In change mode, continue to the regression guard before success.

#### 4.3 Apply PGO only when selected

- Require a representative CPU pprof input. Record its collection source, workload and distribution, age,
  profiled build identity, current build identity, and source skew. Keep an unrepresentative, stale, or
  materially skewed CPU pprof input outside the PGO success claim.
- Bind `default.pgo` discovery or every `-pgo` selection to the selected Go toolchain version and
  exact project command through `go-toolchain`. The official [Go PGO guide](https://go.dev/doc/pgo) owns those
  version-sensitive behaviors; do not freeze a current Go release or assume one PGO CPU pprof input applies to
  every main package or workload.
- The same [PGO guide](https://go.dev/doc/pgo) recommends representative production behavior but permits a
  representative benchmark when production collection is impractical. Record benchmark representativeness
  limits. Do not require production collection; perform it only with current authority and the Step 2.3 bounds.
- Compare PGO-enabled and PGO-disabled builds, or an accepted equivalent, on the representative workload.
  Record absolute and relative performance, build-time, binary-size, and resource trade-offs. Define the CPU
  pprof refresh owner and trigger, source-skew limit, regression owner, and response; claim no universal gain.

#### 4.4 Define the regression guard

- Tie the guard to the same performance question and representative workload. Name its owner, exact project
  command or evidence method, threshold or comparison rule, `GOOS/GOARCH` target, execution frequency or
  trigger, and response when it fails.
- Route benchmark, test-case, repetitions, and evidence-strength design to `go-testing`; route the exact
  project command and selected Go toolchain version facts to `go-toolchain`. The guard belongs to the verified
  result only when those owners can execute and interpret it repeatably.
- Use the accepted budget or comparison rule. Do not invent one family-wide threshold, require one benchmark
  framework, or convert a current noisy result into a permanent guard.

### Phase 5 — Evaluate, Stop, and Return

#### 5.1 Evaluate the complete result

- Reconcile the performance question, consumer, metric and unit, workload and representativeness, baseline,
  selected evidence, bottleneck or bounded hypotheses, accepted design, comparison method, result, resource
  trade-offs, supported and unsupported `GOOS/GOARCH` targets, and regression guard when a change was accepted.
  Keep every missing or unmatched item outside the completion claim.
- Apply the [evaluation checklist](checklists.md) and every active Go sibling checklist when the result enters
  Evaluation. General Evaluation owns evidence resolution and verdicts.
- Stop on an unauthorized write, output, cache effect, download, network request, credential use, external
  mutation, release effect, project command execution, nonrepresentative workload, unbounded diagnostic,
  unsupported `GOOS/GOARCH` target claim, missing material decision, or required comparison gap. Preserve only
  approved evidence and return the applicable bounded investigation or exact block.

#### 5.2 Return the terminal record

- Return the universal fields, naming why any is not applicable: operation and mode; accepted result; decision
  basis; actual owned object; terminal state selected from exactly `success`, `error`, `cancellation`,
  `timeout`, `blocked`, or `user-decision pause`; changed or reviewed paths; project-command evidence; evidence
  limits; external reads or effects; compatibility decision selected from `compatible`, `migration supplied`,
  `authorized break`, or `unsupported` when applicable; block; recovery; and handoff. A Go panic is program
  behavior, not an operation terminal state.
- Project-command evidence names the project command, exact package pattern, selected Go toolchain version,
  flags, `GOOS/GOARCH` target, inputs, duration, and result. External reads or effects name the output or network
  destination, cache or download scope, current authority, redaction when applicable, retained state,
  `credential use`, `external mutation`, and `release effect` as three separate facts.
- Add the performance question; consumer; metric and unit; accepted budget or comparison question;
  representative workload and proof or limits; baseline source and build identity; exact baseline evidence kind
  and identity; bottleneck or bounded hypotheses; accepted design; comparison method; result source and build
  identity; exact result evidence kind and identity; baseline and result absolute values and units; relative
  comparison; uncertainty or noise; sample or repetition basis; environment; resource trade-offs; unsupported
  `GOOS/GOARCH` targets; regression guard when a change was accepted; block; recovery; and handoff.
- Complete only with a representative-profile diagnosis that proves its bottleneck, comparable verification
  that satisfies Step 4.2, a verified performance change with the complete regression guard from Step 4.4, a
  bounded investigation with one discriminating next measurement per hypothesis, or an exact block. Otherwise
  return the missing fields and evidence limits without calling the operation complete.

## References

- [Evaluation checklist](checklists.md) is the local unchecked evaluation source for this skill.
