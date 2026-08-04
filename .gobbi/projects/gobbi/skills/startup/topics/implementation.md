# Implementation Topics

An Implementation is one Product's complete technical realization or stack. For example, the Web
Dashboard Product has one Implementation containing categorized React framework and TypeScript language
entries; those technologies do not become interview subjects. The example is explanatory, not required.

## Problem Definition

Adapt these questions to the need, constraints, alternatives, risks, and success evidence for the Product's
single complete stack. A technology may appear as a categorized entry in several Implementations, but its
answers remain specific to each Product.

- [hard-stack-constraint] Which complete-stack constraint is mandatory rather than preferred, and why?
- [critical-dependency] Which external dependency is essential to this Implementation's Product result?
- [dependency-failure] Which Product result is lost or reduced if that dependency fails?
- [stack-license] Which license duty limits this Implementation's available stack alternatives?
- [stack-portability] What ability to run or move the complete stack must this Implementation preserve, and what evidence proves success?

## Design

Use these questions for the complete stack's runtime design and its categorized technology entries. Tools,
frameworks, runtimes, engines, formats, and languages remain entries in this one Implementation and never
become route subjects.

- [runtime-units] Which major runtime units execute independently within this Implementation?
- [unit-responsibility] What responsibility does each runtime unit own?
- [primary-runtime-path] Which runtime units handle the Product's main result from start to finish?
- [background-path] Which unattended work must succeed for the Product result to be correct?
- [failure-containment] Which runtime unit must prevent one failure from affecting other units or consumers?
- [runtime-recovery] Which Implementation state must be restored before normal runtime work can continue?
- [programming-languages] Which programming languages must this Implementation use or continue to support?
- [frameworks] Which frameworks must this Implementation use or remain compatible with?
- [runtimes] Which execution runtimes must this Implementation run on?
- [data-stores] Which databases or other data stores must this Implementation use or remain compatible with?
- [building-block-responsibility] What responsibility, boundary, interface, owner, deployment need, and quality obligation does this complete Implementation have?
- [technology-category] For each stack entry, is it a framework, runtime, engine, datastore, table format, protocol, platform, infrastructure, external service, library, language, or toolchain?
- [technology-assignment] Which Implementation responsibility uses each technology or language entry?
- [technology-rationale] What evidence, constraint, and tradeoff justify each material stack entry?

## Specification

Use these questions for complete-stack support, configuration, compatibility, data behavior, testing,
security, licensing, quality, and contributor constraints. Keep code-level signatures and implementation tasks
out of the accepted design contract.

- [supported-versions] Which versions of every required stack entry must this Implementation support, and for how long?
- [environment-model] Which development, test, staging, production, or other environment differences change Implementation behavior or risk?
- [configuration-source] Which file, service, or system is authoritative for runtime configuration?
- [runtime-restriction] Which network, locality, regional, resource, or other operating restriction changes what this Implementation must support?
- [same-result-on-repeat] Which Implementation operation must reach the same end state when repeated with the same request?
- [consistency-promise] When the same data appears in several places, what agreement or update timing must the Implementation preserve?
- [stored-data-evolution] What compatibility must the Implementation preserve when stored data format or meaning changes?
- [restore-evidence] What test or evidence proves that Implementation-managed data can be restored after loss?
- [data-lineage] For which data must the Implementation trace its source and every transformation?
- [data-timestamp-choice] Which timestamp must Implementation calculations use when an event time and arrival time differ?
- [data-ordering] Which records or events must the Implementation process in order?
- [data-lateness] How may an earlier result change when data arrives late?
- [data-duplicates] Which input records may arrive more than once without making the result incorrect?
- [data-replay] Which earlier result must historical input reproduce when processed again?
- [data-backfill] Which previous result may change after missing or corrected historical data is processed?
- [data-freshness] What signal tells a consumer that Implementation-produced data is recent enough to use?
- [network-intended-state] Which configuration or system is authoritative for intended network state?
- [network-liveness] Which signal shows that a network runtime unit is running and responding?
- [network-convergence] What observable condition proves all affected runtime units reached intended network state?
- [network-reconciliation] How must the Implementation reconcile actual and intended network state?
- [network-stale-state] How old may observed network state become before the Implementation stops relying on it?
- [safe-retry] Which failed Implementation operation may be tried again without an incorrect or unsafe result?
- [network-partition] Which behavior must remain safe when runtime units cannot communicate?
- [cli-execution-support] Which operating systems and command shells must the Implementation support for a command-line Product?
- [library-runtime-support] Which language or execution-runtime versions must consumers of a library or software development kit Product be able to run?
- [trust-boundaries] Where does data or control cross between Implementation runtime units with different trust levels?
- [network-replay-threat] Which protocol message must the Implementation reject when an attacker sends it again?
- [network-integrity-threat] Which protocol state becomes invalid after unauthorized change?
- [network-denial-threat] Which resource-exhaustion attempt needs a planned defense to keep the Product available?
- [diagnostic-evidence] Which logs, metrics, traces, or records must the Implementation provide after failure?
- [security-review] Which Implementation changes require security review before release?
- [performance-evidence] Which speed, capacity, or resource-use claim requires measurement?
- [operational-evidence] Which deployment, recovery, or routine-operation claim requires a realistic demonstration?
- [directory-convention] Which repository-organization constraint is binding for this Implementation, and what boundary does it protect?
- [module-convention] Which responsibilities must remain separated by a module or package boundary?
- [naming-convention] Which naming patterns are mandatory for Implementation files, modules, types, functions, or other elements?
- [interface-convention] Which design pattern must Implementation interfaces follow?
- [error-convention] Which pattern must Implementation code follow when reporting, propagating, or recovering from errors?
- [documentation-convention] Which format and location rules apply to Implementation documentation?
- [test-convention] Which naming, grouping, and location rules apply to Implementation tests?
- [contribution-convention] Which process must a contributor follow when proposing an Implementation change?
- [live-example] Which current file or module is the authoritative example for this Implementation?
- [counterexample] Which locally common pattern is misleading and must not be copied?
- [deliberate-pattern] Which unusual-looking Implementation pattern is deliberate and must be preserved?
- [binding-rule] Which Implementation rule is mandatory rather than preferred?
- [recurring-mistake] Which Implementation-specific mistake do contributors or agents repeatedly make?
- [corrected-approach] Which approved approach replaces the misleading local pattern?

## Lifecycle and Use Cases

First derive scenarios for development, build, test, release, complete-stack use, dependency change,
migration, and deprecation. Ask only about a concrete-scenario or observable-oracle blocker. For example,
upgrade the Web Dashboard Implementation's React entry, test the complete stack, recover a failed release,
and retire the old entry without making React a separate interview subject.

- [stack-change-evidence] What evidence shows that the complete stack or one categorized entry no longer fits this Product?
- [dependency-change] What must the Implementation do when a critical dependency changes incompatibly?
- [dependency-exit] How can the Implementation continue if a critical dependency becomes permanently unavailable?
- [deployment-method] How is a released Implementation installed or deployed into its operating environment?
- [rollout-signal] Which observed result shows that rollout may continue safely?
- [rollback-trigger] Which observed failure requires rollout to stop and the previous Implementation to be restored?
- [rollback-state] Which Product, system, or operating state must remain intact after rollback?
- [technology-exit-trigger] What alternative, exit path, and evidence cause replacement of each material stack entry?
- [maintenance-scenario] Which realistic future Implementation change shows that a new maintainer can work safely?
- [desktop-release-approval] Which publisher-identity, platform-review, or other approval steps must a desktop Implementation pass before installation without a security warning?
- [network-deployment] How can new network behavior operate safely while peers still use earlier behavior?
- [network-diagnostics] Which operating data must an engineer collect without interrupting the Product's network service?
- [scenario-development-guidance] What implementation-neutral guidance must development preserve for this Implementation scenario?
- [scenario-evaluation-method] Which realistic test, review, observation, or rehearsal evaluates the Implementation scenario?
- [scenario-pass-fail-oracle] Which observable result separates pass from fail?
- [scenario-required-evidence] Which artifact, measurement, record, or user observation proves that oracle?
- [migration-lifecycle-scenario] How does Implementation-managed state or data migrate without violating compatibility or lineage?
- [upgrade-lifecycle-scenario] How does a stack or dependency upgrade preserve supported Product state, contracts, and recovery?
- [rollback-lifecycle-scenario] How does a failed Implementation release roll back while preserving Product and operating state?
- [maintenance-lifecycle-scenario] Which development, build, or test change demonstrates that the complete stack remains understandable and safe to change?
- [deprecation-lifecycle-scenario] How are affected Product duties moved before a stack entry or supported version is retired?
