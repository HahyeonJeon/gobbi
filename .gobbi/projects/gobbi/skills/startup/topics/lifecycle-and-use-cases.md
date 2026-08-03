# Lifecycle and Use-Case Scenario Topics

Do not begin by interviewing from this bank. First generate scenario candidates from the accepted earlier
phase documents and link them to their decisions. Use these questions only to resolve a concrete-scenario
blocker or an observable-oracle blocker. Derive proactive, implementation-neutral development guidance as a
required scenario output; missing guidance is not an independent interview trigger.

## Scenario Inventory and Traceability

- [scenario-inventory] Which normal, alternate, invalid, failure/recovery, abuse, migration, upgrade, rollback, maintenance, deprecation, and end-of-life scenarios follow from the accepted design?
- [scenario-class] Which lifecycle or use-case class does each scenario cover?
- [scenario-purpose] What project result, risk, or contract does each scenario make concrete?
- [scenario-linked-decision] Which accepted problem, design, or specification decisions does each scenario exercise?
- [scenario-coverage-gap] Which accepted decision has no scenario capable of guiding development and evaluation?

## Scenario Context, Flow, and Observable Result

- [scenario-actor-source] Which actor, connected system, schedule, or lifecycle event starts the scenario?
- [scenario-precondition-context] What must be true, and what operating context applies, before the scenario starts?
- [scenario-trigger-stimulus] What exact action, event, or stimulus starts the scenario?
- [scenario-affected-artifact] Which Application/Deliverable and Building Blocks participate in the scenario?
- [scenario-main-flow] What implementation-neutral interaction leads from the trigger to the intended outcome?
- [scenario-alternate-flow] Which valid alternate path must reach an acceptable outcome?
- [scenario-invalid-path] Which invalid input, state, or attempted use must be rejected safely?
- [scenario-failure-path] Which component, dependency, or handoff failure must the scenario cover?
- [scenario-recovery-path] Which action and restored state make work safe after the failure?
- [scenario-state-data-change] Which state and data changes occur, and which changes must not occur?
- [scenario-handoff] Where does responsibility or information pass between people, systems, or building blocks?
- [scenario-observable-outcome] What can an affected person or connected system observe when the scenario succeeds or fails safely?
- [scenario-invariant] Which security, privacy, safety, and quality properties must remain true throughout the scenario?

## Development and Evaluation Guidance

- [scenario-development-guidance] What implementation-neutral guidance must development preserve for this scenario?
- [scenario-evaluation-method] Which realistic test, review, observation, or rehearsal can evaluate this scenario?
- [scenario-pass-fail-oracle] Which observable result separates pass from fail?
- [scenario-required-evidence] Which artifact, measurement, record, or user observation proves the oracle?
- [scenario-owned-deferral] If a nonblocking scenario detail remains open, who owns it, what is the consequence, how will it be resolved, and when does it reopen the design?

## Lifecycle Coverage

- [abuse-lifecycle-scenario] Which realistic abuse path exercises the highest-consequence security, privacy, or safety duty?
- [migration-lifecycle-scenario] How does existing state or data move to the new design without violating compatibility or lineage?
- [upgrade-lifecycle-scenario] How does an upgrade preserve supported state, contracts, and recovery?
- [rollback-lifecycle-scenario] How does a rollback preserve user, system, and operational state after a failed release?
- [maintenance-lifecycle-scenario] Which future maintenance change demonstrates that the design remains understandable and safe to change?
- [deprecation-lifecycle-scenario] How are consumers warned, supported, and moved before a capability or contract is retired?
- [end-of-life-lifecycle-scenario] How are data, access, dependencies, responsibilities, and user commitments closed when the project ends?
