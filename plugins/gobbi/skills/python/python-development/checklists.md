# Python Development Evaluation Checklist

## Scenario Hierarchy

### Design lifecycle

- Change framing
  - Accepted implementation contract
    - Outcome, consumers, boundary, exclusions, and recovery are known
- Affected-tree design
  - Configuration and sibling concerns
    - The complete affected surface has one owner for each material concern

### Development lifecycle

- Complete increment construction
  - Interface and behavior update
    - The changed contract covers ordinary and exceptional paths
  - Cross-boundary implementation
    - Distribution changes and runtime symptoms keep their specialist owners
- Implementation review
  - Observable check scope
    - Checks state what they observed and what remains unexercised

### Product lifecycle

- Evidence consumer handoff
  - Test and performance consumers
    - Correctness and resource claims reach their evidence owners
- Maintainer recovery
  - Blocked change
    - An unresolved contract has a retained recovery boundary
- Consumer trust
  - Project-specific guidance
    - Generic defaults and unsupported claims cannot mislead a consumer

## Checklist Conditions

### Design lifecycle > Change framing > Accepted implementation contract > Outcome, consumers, boundary, exclusions, and recovery are known

- [ ] The implementation record names the accepted outcome, affected consumers, observable contract, included boundary, exclusions, and recovery expectation.

### Design lifecycle > Affected-tree design > Configuration and sibling concerns > The complete affected surface has one owner for each material concern

- [ ] The affected-tree inventory includes relevant modules, callers, public surfaces, configuration, tests, documentation, and derived paths.
- [ ] Project configuration is inspected before generic language guidance is applied.
- [ ] Material convention, design, typing, toolchain, testing, packaging, performance, and debugging concerns are routed to their distinct owners.

### Development lifecycle > Complete increment construction > Interface and behavior update > The changed contract covers ordinary and exceptional paths

- [ ] The changed interface, behavior, errors, resources, annotations, documentation, and affected callers agree with the accepted contract.
- [ ] Normal, invalid, boundary, error, and applicable resource-lifetime paths have an explicit implementation position.

### Development lifecycle > Complete increment construction > Cross-boundary implementation > Distribution changes and runtime symptoms keep their specialist owners

- [ ] A distribution-affecting import, artifact, or build-metadata change is handed to `python-packaging` rather than treated as ordinary placement.
- [ ] A runtime symptom is retained for `python-debugging` rather than suppressed or explained by an implementation guess.

### Development lifecycle > Implementation review > Observable check scope > Checks state what they observed and what remains unexercised

- [ ] Each recorded implementation check identifies its configured scope, inputs, observation, and evidence limit.
- [ ] The review identifies unexercised behavior without presenting the changed diff as sufficient correctness proof.

### Product lifecycle > Evidence consumer handoff > Test and performance consumers > Correctness and resource claims reach their evidence owners

- [ ] Test strategy and correctness evidence are handed to `python-testing`, and measured resource claims are handed to `python-performance`.

### Product lifecycle > Maintainer recovery > Blocked change > An unresolved contract has a retained recovery boundary

- [ ] A blocked change identifies the earliest unresolved decision or contract, affected path, retained state, and first recovery action.

### Product lifecycle > Consumer trust > Project-specific guidance > Generic defaults and unsupported claims cannot mislead a consumer

- [ ] No named framework, formatter, checker, runner, package layout, or interpreter is presented as a universal Python requirement.
- [ ] No implementation record claims packaging, release, compatibility, or performance evidence that its selected checks did not observe.
