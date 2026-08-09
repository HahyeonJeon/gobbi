---
name: python-performance
description: "MUST load when a measured Python latency, throughput, CPU, allocation, memory, startup, or resource claim is investigated or changed."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Python Performance

Python Performance investigates or changes one measured Python latency, throughput, CPU, allocation, memory,
startup, or resource claim. It returns a scoped measurement and causal conclusion, or an exact statement of the
evidence that is still missing.

This operation owns the performance question, representative workload, comparable baseline, measurement design,
and interpretation. `python-toolchain` owns project command and tool facts, while `python-development` owns an
implementation change and `python-testing` owns correctness evidence.

## Principles

### Measure the user-relevant cost

Performance has no useful meaning without a named metric and workload. A proxy can guide investigation but
cannot replace the cost that the affected consumer experiences.

### Compare like with like

Baseline and changed measurements need equivalent inputs, environment, configuration, and collection method.
One timing, a profile screenshot, or a code-shaped intuition cannot establish a change.

### Choose collections by semantics first

An iterator or generator fits one-pass bounded consumption. A list remains appropriate for random access,
multiple passes, sorting, materialization, caching, or any contract that needs stored values.

## Rules

- **MUST bind a named metric, representative workload, and comparable baseline.** Record the consumer-relevant
  question, inputs, success behavior, runtime and configuration facts, and the uncertainty each measurement carries.
- **MUST keep correctness separate from performance.** Prove behavior with the applicable correctness owner before
  treating a faster measurement as an acceptable implementation change.
- **MUST make causal conclusions traceable to evidence.** State the changed factor, measurement method, observed
  comparison, alternative explanations considered, and evidence limit.
- **MUST choose generators, iterators, and lists by required behavior before measuring cost.** Use the collection
  contract to reject a memory-saving change that breaks reuse, ordering, access, or lifetime needs.
- **NEVER claim an improvement from code shape, a single timing, or a universal generator rule.** Tool commands and
  profiler mechanics remain project-selected facts owned by `python-toolchain`.

## Procedure

### Phase 1 — Bind the Performance Question

#### 1.1 Define the claim and workload

- Name the metric, unit, affected consumer, expected behavior, and decision the evidence must support. State
  whether the concern is latency, throughput, CPU, allocation, memory, startup, or another resource cost.
- Bind representative inputs, data size and shape, concurrency or process context, success and error paths,
  runtime and interpreter facts, project configuration, and acceptable execution bounds. Mark synthetic inputs
  as synthetic rather than treating them as representative.
- Record the baseline implementation or state and the unchanged correctness contract. If no suitable baseline or
  representative workload exists, return a measurement-design block instead of optimizing a convenient proxy.

#### 1.2 Select the measurement design

- Choose a project-supported command or tool through `python-toolchain`. Define repetitions, warm-up treatment,
  collection boundaries, output location, controlled variables, and the comparison method before observing a
  changed result.
- Select evidence that matches the question: elapsed time for latency, completed work for throughput, profile
  evidence for CPU, allocation tracing for allocation or memory, or another named mechanism. Preserve raw
  observations needed to interpret the comparison.
- Assess collection semantics before changing code. Use a generator or iterator for one-pass bounded consumption;
  retain or introduce a list when the contract needs random access, multiple passes, sorting, materialization,
  caching, or stable retained values.

### Phase 2 — Measure a Comparable Change

#### 2.1 Establish the baseline

- Run the bound baseline measurements with the same inputs, environment, configuration, output boundary, and
  collection method that the changed implementation will use. Record variability and anomalies rather than
  selecting a favorable sample.
- Inspect profile or allocation evidence only for the bound workload. Identify the cost center or resource path
  that a proposed change is intended to affect.
- Stop when setup differences, non-repeatable behavior, or uncontrolled external effects make the baseline
  incomparable. Name the first factor to control before resuming.

#### 2.2 Measure the changed implementation

- Confirm that the proposed implementation preserves the bound behavior through the applicable correctness
  evidence. Hand code changes to `python-development` and test design to `python-testing`.
- Repeat the same measurement design for the changed state. Record source or configuration identity, raw
  observations, workload identity, controlled variables, and deviations from the baseline plan.
- If the change improves one metric while worsening another relevant metric or breaking the collection contract,
  retain both observations. Do not collapse the trade-off into an unqualified improvement claim.

### Phase 3 — Interpret and Guard the Claim

#### 3.1 Draw a bounded causal conclusion

- Compare baseline and changed evidence under the bound conditions. Explain how the changed factor relates to the
  observed cost and which alternative explanations the evidence leaves open.
- State the conclusion only at the workload and environment the measurements support. A clean profile, lower
  allocation count, or faster sample is evidence about its run, not a universal Python property.
- Return an exact no-conclusion or block when the evidence does not isolate a cause, lacks a comparable baseline,
  or cannot represent the affected consumer.

#### 3.2 Preserve regression evidence and hand off

- Identify the narrowest project-appropriate regression guard for the sustained claim, such as a bounded
  representative benchmark, resource threshold with justified tolerance, or recurring profile review. Do not
  convert a noisy measurement into a brittle generic gate.
- Return the metric, workload, baseline and changed identities, method, raw evidence location, causal conclusion
  or limit, trade-offs, correctness evidence boundary, and recovery action.
- Route command and tool mechanics to `python-toolchain`, implementation work to `python-development`, and
  executable correctness evidence to `python-testing`.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
- [Python `profile` module](https://docs.python.org/3/library/profile.html) documents deterministic profiling.
- [Python `tracemalloc` module](https://docs.python.org/3/library/tracemalloc.html) documents allocation tracing.
- [PEP 289](https://peps.python.org/pep-0289/) specifies generator expressions.
