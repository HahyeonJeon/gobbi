# Python Development Evaluation Checklist

## Change contract

- [ ] The implementation record names the accepted outcome, affected consumers, observable contract, included boundary, exclusions, and recovery expectation.
- [ ] The affected-tree inventory includes relevant modules, callers, public surfaces, configuration, tests, documentation, and derived paths.
- [ ] Project configuration is inspected before generic language guidance is applied.
- [ ] Material convention, design, typing, toolchain, testing, packaging, performance, and debugging concerns are routed to their distinct owners.

## Complete increment

- [ ] The changed interface, behavior, errors, resources, annotations, documentation, and affected callers agree with the accepted contract.
- [ ] Normal, invalid, boundary, error, and applicable resource-lifetime paths have an explicit implementation position.
- [ ] A distribution-affecting import, artifact, or build-metadata change is handed to `python-packaging` rather than treated as ordinary placement.
- [ ] A runtime symptom is retained for `python-debugging` rather than suppressed or explained by an implementation guess.

## Verification and handoff

- [ ] Each recorded implementation check identifies its configured scope, inputs, observation, and evidence limit.
- [ ] The review identifies unexercised behavior without presenting the changed diff as sufficient correctness proof.
- [ ] Test strategy and correctness evidence are handed to `python-testing`, and measured resource claims are handed to `python-performance`.
- [ ] A blocked change identifies the earliest unresolved decision or contract, affected path, retained state, and first recovery action.

## Misleading form

- [ ] No named framework, formatter, checker, runner, package layout, or interpreter is presented as a universal Python requirement.
- [ ] No implementation record claims packaging, release, compatibility, or performance evidence that its selected checks did not observe.
