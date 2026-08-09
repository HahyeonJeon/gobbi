# Python Performance Evaluation Checklist

## Scenario Hierarchy

### Design lifecycle

- Measurement question framing
  - Consumer-relevant decision
    - Metric, workload, affected behavior, and decision are bound
  - Workload representativeness
    - Synthetic input remains distinct from consumer input
- Collection contract design
  - One-pass and retained-value needs
    - Iterator, generator, and list choice preserves required behavior

### Development lifecycle

- Comparable experiment construction
  - Baseline and changed state
    - Measurements share comparable conditions
  - Evidence collection
    - Evidence mechanics and correctness scope remain explicit

### Product lifecycle

- Performance claim consumption
  - Bounded causal conclusion
    - Consumers see the supported claim and material trade-offs
  - Regression stewardship
    - Missing evidence and sustained claims have explicit guard boundaries
- Claim trust
  - Reviewable performance guidance
    - Form alone cannot establish a Python-wide performance rule

## Checklist Conditions

### Design lifecycle > Measurement question framing > Consumer-relevant decision > Metric, workload, affected behavior, and decision are bound

- [ ] The performance record names a consumer-relevant metric, unit, workload, affected behavior, and decision supported by the measurement.
- [ ] The workload record identifies input size and shape, runtime and interpreter facts, configuration, process context, relevant success or error paths, and execution bounds.

### Design lifecycle > Measurement question framing > Workload representativeness > Synthetic input remains distinct from consumer input

- [ ] Synthetic workload inputs are identified as synthetic rather than represented as the affected consumer's workload.

### Design lifecycle > Collection contract design > One-pass and retained-value needs > Iterator, generator, and list choice preserves required behavior

- [ ] Iterator or generator use is justified by one-pass bounded consumption when that behavior is required.
- [ ] List use remains available when random access, multiple passes, sorting, materialization, caching, or retained values are required.

### Development lifecycle > Comparable experiment construction > Baseline and changed state > Measurements share comparable conditions

- [ ] The baseline and changed observations use comparable inputs, environment, configuration, collection method, and measurement boundaries.

### Development lifecycle > Comparable experiment construction > Evidence collection > Evidence mechanics and correctness scope remain explicit

- [ ] The selected evidence mechanism matches the named metric and records repetitions, variability, raw observations, and deviations from the measurement plan.
- [ ] Correctness evidence for the changed behavior is identified separately from the performance comparison.

### Product lifecycle > Performance claim consumption > Bounded causal conclusion > Consumers see the supported claim and material trade-offs

- [ ] The conclusion identifies the changed factor, baseline, changed observation, causal explanation, alternative explanations considered, and evidence limits.
- [ ] A trade-off in another relevant metric or collection contract remains visible rather than being folded into an unqualified improvement claim.

### Product lifecycle > Performance claim consumption > Regression stewardship > Missing evidence and sustained claims have explicit guard boundaries

- [ ] A missing representative workload, comparable baseline, controlled condition, or causal distinction identifies the first measurement-design recovery action.
- [ ] Any regression guard names the workload and justified tolerance or review boundary it applies to.

### Product lifecycle > Claim trust > Reviewable performance guidance > Form alone cannot establish a Python-wide performance rule

- [ ] No code shape, single timing, profiler display, allocation count, or generator expression is presented as a universal performance conclusion.
- [ ] No tool command or profiler is imposed as universal instead of using the project's configured tooling.
