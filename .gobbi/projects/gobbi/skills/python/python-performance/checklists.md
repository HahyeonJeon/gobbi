# Python Performance Evaluation Checklist

## Measurement contract

- [ ] The performance record names a consumer-relevant metric, unit, workload, affected behavior, and decision supported by the measurement.
- [ ] The workload record identifies input size and shape, runtime and interpreter facts, configuration, process context, relevant success or error paths, and execution bounds.
- [ ] The baseline and changed observations use comparable inputs, environment, configuration, collection method, and measurement boundaries.
- [ ] Synthetic workload inputs are identified as synthetic rather than represented as the affected consumer's workload.

## Collection semantics and evidence

- [ ] Iterator or generator use is justified by one-pass bounded consumption when that behavior is required.
- [ ] List use remains available when random access, multiple passes, sorting, materialization, caching, or retained values are required.
- [ ] The selected evidence mechanism matches the named metric and records repetitions, variability, raw observations, and deviations from the measurement plan.
- [ ] Correctness evidence for the changed behavior is identified separately from the performance comparison.

## Causal conclusion and recovery

- [ ] The conclusion identifies the changed factor, baseline, changed observation, causal explanation, alternative explanations considered, and evidence limits.
- [ ] A trade-off in another relevant metric or collection contract remains visible rather than being folded into an unqualified improvement claim.
- [ ] A missing representative workload, comparable baseline, controlled condition, or causal distinction identifies the first measurement-design recovery action.
- [ ] Any regression guard names the workload and justified tolerance or review boundary it applies to.

## Misleading form

- [ ] No code shape, single timing, profiler display, allocation count, or generator expression is presented as a universal performance conclusion.
- [ ] No tool command or profiler is imposed as universal instead of using the project's configured tooling.
