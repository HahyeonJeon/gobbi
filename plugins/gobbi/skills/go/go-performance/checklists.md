# Go Performance Evaluation Checklist

Unchecked evaluation source for Go performance work governed by [Go Performance](SKILL.md).

Apply these scenarios to the exact operation and returned outcome under evaluation. [Evaluation](../../evaluation/SKILL.md)
owns filled results, evidence, findings, and verdicts. This source owns only reusable scenarios and unchecked
conditions. A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined
elsewhere in this source that the scenario reuses.

## Project

### GOPRF-SC-PROJECT-01 — Normal case: One explicit mode contract governs the operation

The operation must select either diagnosis/verification mode or change mode before work begins. The expected
outcome binds one complete effect contract without borrowing authority from another operation. Failure is
observable when both modes remain possible, one mode is implicit, or an effect fact is omitted.

#### Checklist

- [ ] GOPRF-CK-PROJECT-01-01 — The operation selects exactly one of diagnosis/verification mode or change mode.
- [ ] GOPRF-CK-PROJECT-01-02 — Each diagnosis/verification boundary for project source, disposable diagnostic outputs, cache effects, downloads, project-command execution, and network requests matches its exact state in Procedure 1.2.
- [ ] GOPRF-CK-PROJECT-01-03 — Each change-mode boundary for project source, disposable diagnostic outputs, cache effects, downloads, project-command execution, and network requests matches its exact state in Procedure 1.2.
- [ ] GOPRF-CK-PROJECT-01-04 — The selected mode inherits no authority from another operation or sibling.

### GOPRF-SC-PROJECT-02 — Expected failure: A required effect boundary is unavailable

The selected mode lacks authority, an execution bound, an approved output path, or a required effect fact.
The expected outcome pauses before the effect and returns an exact recoverable block. Failure is observable
when work proceeds, silently substitutes another action, or returns without the missing prerequisite and
recovery path.

#### Checklist

- [ ] GOPRF-CK-PROJECT-02-01 — Credential use is a separate recorded fact and is none in both modes.
- [ ] GOPRF-CK-PROJECT-02-02 — External mutation is a separate recorded fact: none in diagnosis/verification mode and forbidden in change mode.
- [ ] GOPRF-CK-PROJECT-02-03 — Release effect is a separate recorded fact and is none in both modes.
- [ ] GOPRF-CK-PROJECT-02-04 — Each mode pauses before a project execution, cache write, diagnostic output, protected-data exposure, download, network request, or project-source write that lacks the exact authority or bound required by that mode.
- [ ] GOPRF-CK-PROJECT-02-05 — The block record contains the missing prerequisite, affected obligation, current evidence, risk, proof that no unauthorized effect occurred, and handoff.

### GOPRF-SC-PROJECT-03 — Edge case: Each mode preserves its own recovery state

A blocked diagnosis/verification or change result must retain the state that its selected mode needs to resume.
The expected outcome keeps diagnosis evidence and comparison limits separate from change baselines and rollback
state. Failure is observable when one mode borrows the other mode's recovery record or loses its first action.

#### Checklist

- [ ] GOPRF-CK-PROJECT-03-01 — The diagnosis/verification recovery record contains exact evidence and comparison limits at approved paths, its recovery owner, and its first action.
- [ ] GOPRF-CK-PROJECT-03-02 — The change recovery record contains baseline inputs and evidence at approved paths, its rollback or recovery owner, and its first action.

## Structure

### GOPRF-SC-STRUCTURE-01 — Normal case: The question, workload, and environment are exact

A consumer needs one performance question answered under one representative workload and named environment.
The expected outcome preserves the accepted comparison contract from baseline through result. Failure is
observable when the metric, workload, `GOOS/GOARCH` target, project command, or environmental conditions can
drift without creating a new claim.

#### Checklist

- [ ] GOPRF-CK-STRUCTURE-01-01 — The operation records one performance question and the consumer or decision that needs its answer.
- [ ] GOPRF-CK-STRUCTURE-01-02 — The accepted comparison contract records the metric, unit, direction, and budget or comparison rule.
- [ ] GOPRF-CK-STRUCTURE-01-03 — The workload definition records inputs, scale, concurrency, duration or repetition, warm-up or steady-state conditions, representativeness proof, and known limits.
- [ ] GOPRF-CK-STRUCTURE-01-04 — The environment records the `GOOS/GOARCH` target, selected Go toolchain version, exact project command, exact package pattern when passed, material hardware and runtime facts, and known confounders.

### GOPRF-SC-STRUCTURE-02 — Edge case: Evidence kinds answer different questions

The question may concern CPU time, allocation or retained memory, goroutine state, synchronization delay,
scheduler or runtime behavior, latency, throughput, startup, binary size, or another named resource. The
expected outcome chooses evidence that can answer that question and records collection interference. Failure
is observable when a CPU profile, heap profile, goroutine profile, block profile, and mutex profile are treated
as one CPU evidence kind or a Go execution trace is used as a hotspot substitute.

#### Checklist

- [ ] GOPRF-CK-STRUCTURE-02-01 — Evidence selection names the exact evidence kind and explains how it can answer the accepted performance question.
- [ ] GOPRF-CK-STRUCTURE-02-02 — A CPU profile, heap profile, goroutine profile, block profile, and mutex profile remain distinct evidence kinds with distinct questions and limits.
- [ ] GOPRF-CK-STRUCTURE-02-03 — A Go execution trace is used for scheduler, goroutine, garbage-collector, network-blocking, or runtime-event questions and is not presented as a CPU-hotspot substitute.
- [ ] GOPRF-CK-STRUCTURE-02-04 — The resulting claim is bounded by the recorded possible timing, CPU, allocation, memory, disk, and process interference from concurrent diagnostic collection.

## Performance

### GOPRF-SC-PERFORMANCE-01 — Normal case: Baseline and result are comparable

A change or verification must compare the same accepted question under controlled conditions. The expected
outcome reports absolute values, uncertainty, and resource tradeoffs before any relative claim. Failure is
observable when the baseline and result differ in workload or environment, or when a percentage hides the
measured values.

#### Checklist

- [ ] GOPRF-CK-PERFORMANCE-01-01 — The baseline record names the source and build identity, accepted workload identity, environment identity, exact project command, run count or sample basis, metric, unit, absolute value or distribution, collection time, and evidence limit.
- [ ] GOPRF-CK-PERFORMANCE-01-02 — The result record names the source and build identity, accepted workload identity, environment identity, exact project command, run count or sample basis, metric, unit, absolute value or distribution, collection time, and evidence limit.
- [ ] GOPRF-CK-PERFORMANCE-01-03 — Baseline and result use the same performance question, workload definition, `GOOS/GOARCH` target, selected Go toolchain version, material environment, and comparison method, or the outcome states the exact difference and bounds the claim.
- [ ] GOPRF-CK-PERFORMANCE-01-04 — The comparison reports absolute baseline and result values with units and direction before any relative change.
- [ ] GOPRF-CK-PERFORMANCE-01-05 — The comparison records sample size or run count, observed spread or noise, uncertainty limits, and the rule used to distinguish a result from noise.

### GOPRF-SC-PERFORMANCE-02 — Expected failure: Evidence is absent, noisy, or incomparable

The operation lacks a usable baseline or the observed difference cannot be separated from noise or an
environmental change. The expected outcome bounds the investigation or blocks the claim. Failure is
observable when the outcome declares an improvement despite the missing comparison basis.

#### Checklist

- [ ] GOPRF-CK-PERFORMANCE-02-01 — An absent baseline reaches a bounded investigation or an exact block instead of an improvement claim.
- [ ] GOPRF-CK-PERFORMANCE-02-02 — A noisy or incomparable result states the evidence limit and does not declare an improvement.

- Also applies: GOPRF-CK-PERFORMANCE-01-04 (absolute baseline and result values precede a relative claim).
- Also applies: GOPRF-CK-STRUCTURE-02-04 (diagnostic interference bounds the claim).

### GOPRF-SC-PERFORMANCE-03 — Edge case: PGO is selected and verified explicitly

The accepted change includes profile-guided optimization for a named build and representative workload. The
expected outcome records the PGO CPU pprof input, selected Go toolchain version behavior, an enabled-versus-disabled
comparison, tradeoffs, and lifecycle ownership. Failure is observable when a stale input is applied by
filename convention without proving representation or continued benefit.

#### Checklist

- [ ] GOPRF-CK-PERFORMANCE-03-01 — The PGO CPU pprof input records its source, representative workload, collection age, producing and current build identities, source skew, retention, and evidence limit.
- [ ] GOPRF-CK-PERFORMANCE-03-02 — PGO activation records whether the selected Go toolchain version and exact project command use `default.pgo` or an explicit `-pgo` value.
- [ ] GOPRF-CK-PERFORMANCE-03-03 — The result compares PGO enabled and disabled, or an equivalent controlled pair, under the accepted representative workload and environment.
- [ ] GOPRF-CK-PERFORMANCE-03-04 — The result reports build-time, binary-size, CPU, latency, memory, and other measured resource effects that apply to the accepted consumer decision.
- [ ] GOPRF-CK-PERFORMANCE-03-05 — PGO lifecycle ownership names the refresh owner, refresh trigger, source-skew limit, verification method, regression owner and rule, and response when the input no longer represents the accepted workload or build.

### GOPRF-SC-PERFORMANCE-04 — Expected failure: A PGO input is stale or unrepresentative

The available PGO CPU pprof input has material workload, build, source, or age skew. The expected outcome excludes
it from a benefit claim and returns a bounded investigation or block. Failure is observable when the input is
accepted solely because the build finds it.

#### Checklist

- [ ] GOPRF-CK-PERFORMANCE-04-01 — A stale, source-skewed, build-skewed, or unrepresentative PGO CPU pprof input is excluded from the result claim and reaches a bounded investigation or exact block.

## Aesthetics

### GOPRF-SC-AESTHETICS-01 — Poor quality: Vague wording hides the measured object

A polished report substitutes generic nouns for the accepted project command, `GOOS/GOARCH` target, evidence
kind, or metric. The expected outcome uses exact Go and performance vocabulary and keeps unrelated metrics distinct.
Failure is observable when headings or plausible examples create confidence without measurement evidence.

#### Checklist

- [ ] GOPRF-CK-AESTHETICS-01-01 — Each claim names its exact project command, `GOOS/GOARCH` target, metric, unit, and applicable CPU profile, heap profile, goroutine profile, block profile, mutex profile, Go execution trace, runtime-statistic report, workload measurement, binary-size inventory, startup-time measurement, or PGO CPU pprof input.
- [ ] GOPRF-CK-AESTHETICS-01-03 — Compliant headings, examples, or terminology never substitute for baseline, result, uncertainty, and causal evidence.
- Also applies: GOPRF-CK-STRUCTURE-02-01 (the named evidence is exact and question-matched).

## Usage

### GOPRF-SC-USAGE-01 — Normal case: Diagnosis identifies a causal bottleneck

A representative workload reproduces the accepted performance concern under the bound environment. The
expected outcome connects the performance question, measured cost, and discriminating evidence to one causal
bottleneck, then verifies it comparably without editing source. Failure is observable when recurrence or a
large stack sample is treated as causation by itself.

#### Checklist

- [ ] GOPRF-CK-USAGE-01-01 — Diagnosis records the accepted question, representative workload, comparable baseline, and question-matched evidence before naming a bottleneck.
- [ ] GOPRF-CK-USAGE-01-02 — The named causal bottleneck is supported by a controlled comparison or discriminating observation that connects it to the accepted cost.
- Also applies: GOPRF-CK-PERFORMANCE-01-03 (diagnosis and verification use a comparable baseline and result contract).
- Also applies: GOPRF-CK-OVERALL-01-02 (the terminal result uses an accepted performance result boundary).

### GOPRF-SC-USAGE-02 — Normal case: An accepted change is verified and guarded

The consumer accepts a source change after diagnosis. The expected outcome compares alternatives, routes the
write through development, repeats the controlled measurement, and installs a regression response owned by a
named maintainer. Failure is observable when the fastest-looking edit is accepted without causal proof or a
continuing guard.

#### Checklist

- [ ] GOPRF-CK-USAGE-02-01 — The decision records the material alternatives, rejected options, tradeoffs, and reason for the selected change.
- [ ] GOPRF-CK-USAGE-02-02 — Every accepted project-source create, update, or delete is performed through `go-development` with each applicable specialist.
- [ ] GOPRF-CK-USAGE-02-03 — Comparable result evidence verifies the accepted outcome and records uncertainty, material resource tradeoffs, and regressions.
- [ ] GOPRF-CK-USAGE-02-04 — The regression guard records its owner, verification method or exact project command, metric and unit, threshold or comparison rule, `GOOS/GOARCH` target, selected Go toolchain version, trigger, and failure response.

### GOPRF-SC-USAGE-03 — Edge case: The workload or supported `GOOS/GOARCH` target cannot represent the claim

The available workload differs materially from production behavior, or the accepted consumer depends on a
`GOOS/GOARCH` target for which evidence cannot be collected. The expected outcome limits the claim and names
the next discriminating measurement. Failure is observable when evidence from a different workload or
`GOOS/GOARCH` target is generalized silently.

#### Checklist

- [ ] GOPRF-CK-USAGE-03-01 — A nonrepresentative workload records the material difference, affected claim, evidence limit, and bounded next measurement or exact block.
- [ ] GOPRF-CK-USAGE-03-02 — Missing evidence for an accepted `GOOS/GOARCH` target records that `GOOS/GOARCH` target, affected claim, evidence limit, and bounded next measurement or exact block.

## Consistency

### GOPRF-SC-CONSISTENCY-01 — Rule violation: A sibling-owned concern stays inside performance work

The operation encounters project-command syntax or effects, evidence design, concurrency behavior,
project-source editing, or unsupported `GOOS/GOARCH` support. The expected outcome preserves singular
ownership while performance retains the comparison and causal-bottleneck decision. Failure is observable when
the operation invents a conflicting sibling contract.

#### Checklist

- [ ] GOPRF-CK-CONSISTENCY-01-01 — Project-command syntax and effects, selected Go toolchain version facts, and `GOOS/GOARCH` support route to `go-toolchain`; evidence design and strength route to `go-testing`; ownership, lifetime, synchronization, goroutine, and scheduler correctness route to `go-concurrency`; causal failure diagnosis routes to `go-debugging`; and accepted project-source changes route to `go-development` with each applicable specialist.

### GOPRF-SC-CONSISTENCY-02 — Rule violation: The comparison contract drifts

The result or regression guard changes the accepted metric, unit, direction, comparison method, workload, or
`GOOS/GOARCH` target. The expected outcome treats that difference as a new or bounded claim. Failure is
observable when a different measurement is reported as confirmation of the original question.

#### Checklist

- [ ] GOPRF-CK-CONSISTENCY-02-01 — The accepted question, metric, unit, direction, comparison method, workload definition, and `GOOS/GOARCH` target remain consistent across baseline, result, and regression guard, or each difference is explicit and bounds the claim.

- Also applies: GOPRF-CK-PERFORMANCE-01-03 (baseline and result remain comparable).
- Also applies: GOPRF-CK-USAGE-03-02 (missing `GOOS/GOARCH` target evidence bounds the claim).

## Risk

### GOPRF-SC-RISK-01 — Adversarial: A proxy improves while the accepted outcome regresses

A microbenchmark, subsystem metric, or reduced resource count improves while the consumer-visible latency,
throughput, startup, memory, binary-size, or cost decision worsens. The expected outcome rejects the proxy as
sufficient proof and reports the tradeoff. Failure is observable when a convenient proxy overrides the
accepted question.

#### Checklist

- [ ] GOPRF-CK-RISK-01-01 — A proxy improvement cannot establish success when the accepted consumer outcome regresses or remains unmeasured.
- [ ] GOPRF-CK-RISK-01-02 — The result reports every measured tradeoff among latency, throughput, CPU, allocations, retained memory, garbage-collector work, startup, build time, binary size, disk, and process effects that can change the accepted decision.

- Also applies: GOPRF-CK-USAGE-01-02 (a controlled comparison or discriminating observation proves causation).

### GOPRF-SC-RISK-02 — Rule violation: Production collection lacks current authority

The proposed evidence path requires collection from a production process or protected data. The expected
outcome pauses unless current authority and explicit collection, retention, exposure, and overhead bounds
exist. Failure is observable when production collection is treated as mandatory or inherited permission.

#### Checklist

- [ ] GOPRF-CK-RISK-02-01 — Production diagnostic collection is neither required nor performed without current authority naming the process, evidence kind, destination, duration, repetition, output bound, protected-data handling, retention owner, and overhead limit.

- Also applies: GOPRF-CK-PROJECT-02-04 (missing authority or bounds pause the effect).

## Overall

### GOPRF-SC-OVERALL-01 — Normal case: The terminal record is finite and complete

The operation reaches a recognized result, bounded investigation, or exact block. The expected outcome uses
one terminal state and records enough evidence, effects, limits, ownership, and next action for a cold reader.
Failure is observable when the state is invented, multiple states are returned, or a required record field is
implicit.

#### Checklist

- [ ] GOPRF-CK-OVERALL-01-01 — The terminal state is exactly one of `success`, `error`, `cancellation`, `timeout`, `blocked`, or `user-decision pause`.
- [ ] GOPRF-CK-OVERALL-01-02 — The accepted result boundary is exactly one of a representative-profile diagnosis, comparable verification, verified performance change with a regression guard, bounded investigation, or exact block.
- [ ] GOPRF-CK-OVERALL-01-03 — Every universal terminal field is present or explicitly marked not applicable: operation and selected mode; accepted result; decision basis; actual owned object; terminal state; changed or reviewed paths; project-command evidence; evidence limits; external reads or effects with credential use, external mutation, and release effect as separate facts; compatibility decision; block; recovery; and handoff.
- [ ] GOPRF-CK-OVERALL-01-04 — The performance terminal record names the performance question; consumer; metric and unit; accepted budget or comparison question; representative workload and proof or limits; baseline source, build identity, and exact evidence kind and identity; bottleneck or bounded hypotheses; accepted design; comparison method; result source, build identity, and exact evidence kind and identity; absolute values and units; relative comparison; uncertainty or noise; sample basis; environment; resource trade-offs; unsupported `GOOS/GOARCH` targets; regression guard when a change was accepted; PGO CPU pprof input and refresh fields when PGO was selected; and next action or handoff.

### GOPRF-SC-OVERALL-02 — Expected failure: The investigation cannot establish a recognized result

The evidence is absent, noisy, nonrepresentative, proxy-only, collected with material interference, bound to
an unsupported `GOOS/GOARCH` target, or incomparable with the baseline. The expected outcome returns a bounded
investigation or exact block with one discriminating next measurement. Failure is observable when an
unmatched improvement claim escapes those limits.

#### Checklist

- [ ] GOPRF-CK-OVERALL-02-02 — A bounded investigation records the first useful diagnostic and the leading hypotheses that diagnostic supports or excludes.
- [ ] GOPRF-CK-OVERALL-02-03 — Each live hypothesis has exactly one next discriminating measurement with its prerequisite, expected result on each side, execution and output bounds, and stop condition.
- [ ] GOPRF-CK-OVERALL-02-04 — The terminal record names evidence limits, owner, retained inputs and approved diagnostic outputs, first recovery action, and handoff.
- [ ] GOPRF-CK-OVERALL-02-05 — No improvement claim is returned when the accepted baseline, result, workload, environment, or comparison method cannot be matched.
- Also applies: GOPRF-CK-PERFORMANCE-02-01 (an absent baseline reaches a bounded investigation or exact block).
- Also applies: GOPRF-CK-PERFORMANCE-02-02 (noisy or incomparable evidence reaches its bounded result).
- Also applies: GOPRF-CK-STRUCTURE-02-04 (material diagnostic interference bounds the result).
- Also applies: GOPRF-CK-USAGE-03-01 (a nonrepresentative workload reaches its bounded result).
- Also applies: GOPRF-CK-USAGE-03-02 (unsupported accepted-target evidence reaches its bounded result).
- Also applies: GOPRF-CK-RISK-01-01 (a proxy improvement cannot establish success).
