# Startup Topics

This seed bank frames a Startup interview for a software project. Each bracketed alias identifies one
question axis. The bank covers shared software concerns and concrete axes for web, desktop, mobile,
command-line, library or SDK, service, data, and network projects.

The Startup operation owns question order, evidence handling, contextual adaptation, emergent questions,
and Phase checkpoints. A conditional domain prompt matters only when project evidence activates it.

## Contents

1. [Phase 1 — Evidence, Problem, and People](#phase-1--evidence-problem-and-people)
   - [Topic 1 — Existing Reality, Software Form, Lifecycle, and Authority](#topic-1--existing-reality-software-form-lifecycle-and-authority)
   - [Topic 2 — Problem, Outcome, and Success](#topic-2--problem-outcome-and-success)
   - [Topic 3 — People, Jobs, Alternatives, and Adoption](#topic-3--people-jobs-alternatives-and-adoption)
2. [Phase 2 — Project Boundary](#phase-2--project-boundary)
   - [Topic 4 — Scope, Boundaries, External Contracts, and Non-goals](#topic-4--scope-boundaries-external-contracts-and-non-goals)
3. [Phase 3 — Software and System Direction](#phase-3--software-and-system-direction)
   - [Topic 5 — Capabilities and Journeys](#topic-5--capabilities-and-journeys)
   - [Topic 6 — Experience, Interfaces, Accessibility, and Compatibility](#topic-6--experience-interfaces-accessibility-and-compatibility)
   - [Topic 7 — Architecture, System Context, Runtime, and Data](#topic-7--architecture-system-context-runtime-and-data)
   - [Topic 8 — Technology Stack and Dependencies](#topic-8--technology-stack-and-dependencies)
   - [Topic 9 — Delivery, Operations, and Ownership](#topic-9--delivery-operations-and-ownership)
4. [Phase 4 — Viability and Guardrails](#phase-4--viability-and-guardrails)
   - [Topic 10 — Security, Privacy, Safety, and Data Duties](#topic-10--security-privacy-safety-and-data-duties)
   - [Topic 11 — Engineering Conventions, Idioms, and Recurring Mistakes](#topic-11--engineering-conventions-idioms-and-recurring-mistakes)
   - [Topic 12 — Constraints, Quality, and Verification](#topic-12--constraints-quality-and-verification)
   - [Topic 13 — Risks, Capacity, Maintenance, and Continuity](#topic-13--risks-capacity-maintenance-and-continuity)

## Phase 1 — Evidence, Problem, and People

### Topic 1 — Existing Reality, Software Form, Lifecycle, and Authority

#### Software form and lifecycle

- [software-type] Which software type or mixed set owns the outcome?
- [current-software] Which software forms exist today?
- [lifecycle-stage] Which lifecycle stage describes the current project?
- [prior-attempt] What happened in the most recent attempt to address this need?

#### Sources and authority

- [project-source-of-truth] Which source governs the current project direction?
- [product-authority] Who has final authority over product direction?
- [technical-authority] Who has final authority over technical direction?

#### License, distribution, and governance

- [license-model] Which license governs the software?
- [distribution-model] How may the software be distributed?
- [governance-model] How are disputed project decisions resolved?

### Topic 2 — Problem, Outcome, and Success

#### Problem evidence

- [last-problem-event] What happened in the most recent concrete occurrence of the problem?
- [problem-cost] What measurable consequence did that occurrence create?
- [problem-frequency] How often does the same situation occur?

#### Cause and timing

- [root-cause] What evidence supports the current root-cause explanation?
- [deeper-cause-test] What observation would show that the stated cause is only a symptom?
- [why-now] What changed to make this the right time to act?
- [riskiest-assumption] Which load-bearing assumption has the weakest evidence?

#### Durable outcome and evidence

- [durable-outcome] What should remain true if the implementation changes completely?
- [current-baseline] Which current observation establishes the starting point?
- [success-signal] Which observable change would show that the project works?
- [false-success] What could be technically successful but still fail the project outcome?
- [stop-evidence] Which evidence would show that the current outcome should no longer be pursued?

### Topic 3 — People, Jobs, Alternatives, and Adoption

#### People and jobs

- [first-user] Who is the first user or consumer of the software outcome?
- [affected-people] Who is materially affected without directly using the software?
- [excluded-people] Who is outside the current target boundary?
- [primary-job] What progress is the first user trying to make?
- [job-context] In which concrete situation does the primary job arise?
- [job-failure] What happens when that job cannot be completed?

#### Alternatives and adoption

- [current-alternative] What does the first user do today instead?
- [alternative-breakdown] Where does the current alternative fail?
- [switch-push] What pushes the user away from the current approach?
- [switch-pull] What pulls the user toward the proposed outcome?
- [switch-anxiety] What makes the new approach feel risky?
- [switch-habit] Which habit keeps the current approach in place?
- [adoption-evidence] Which observed action shows willingness to change?
- [value-advantage] Which outcome must be better than the current alternative?

## Phase 2 — Project Boundary

### Topic 4 — Scope, Boundaries, External Contracts, and Non-goals

#### Owned outcome and scope

- [owned-outcome] Which complete outcome does the project own?
- [responsibility-boundary] Where does the project's responsibility begin and end?
- [initial-capabilities] Which capabilities are inside the first useful boundary?

#### External contracts

- [external-contract] Which externally observed contract must remain stable?
- [compatibility-boundary] Which existing behavior must remain compatible?

#### Non-goals and change tests

- [explicit-non-goal] Which tempting capability is not a current goal?
- [manual-boundary] Which outcome will remain manual?
- [refused-use] Which use must the software reject?
- [scope-change-evidence] Which evidence may justify expanding the boundary?
- [irreversible-boundary] Which boundary choice is expensive to reverse?

## Phase 3 — Software and System Direction

### Topic 5 — Capabilities and Journeys

#### Capability shape

- [minimum-complete-capability] Which smallest complete capability produces real value?
- [capability-prerequisite] Which prerequisite must hold before the next capability can work?

#### Primary journey

- [journey-trigger] What starts the primary journey?
- [journey-completion] Which observable state proves that the journey completed?
- [journey-handoff] Where does responsibility pass to another actor or system?

#### Failure journeys

- [invalid-input] What must happen when input is invalid?
- [partial-state] What must happen when only part of the work succeeds?
- [dependency-unavailable] What must happen when a required dependency is unavailable?
- [highest-cost-failure] Which journey failure has the greatest consequence?
- [failure-visibility] How does the affected actor learn that the journey failed?
- [failure-recovery] Which action returns the journey to a safe state?
- [misuse-response] What is the safe response to an already refused use?

### Topic 6 — Experience, Interfaces, Accessibility, and Compatibility

#### Shared interface direction

- [interface-type] Which interface does each primary actor use?
- [success-feedback] What is the first clear success signal?
- [domain-concepts] Which domain concepts must stay consistent across interfaces?
- [information-priority] Which information must be visible for a sound decision?
- [result-explanation] Which consequential result must explain its basis?
- [error-action] Which next action must an error make possible?
- [destructive-safeguard] Which safeguard must protect a destructive action?

#### Accessibility and references

- [accessibility-needs] Which accessibility needs shape the first useful version?
- [accessibility-target] Which accessibility target applies?
- [representative-users] Which representative people should test the riskiest experience assumption?
- [representative-tasks] Which tasks should those people attempt?
- [design-reference] Which existing product or interface is a positive reference?
- [reference-rejection] Which apparent reference must not be copied?

#### Conditional web axes

- [web-direct-link] Which state must a direct URL open?
- [web-navigation-continuity] What must remain correct across browser history navigation?
- [web-refresh-continuity] What must survive a browser refresh?
- [web-storage-lifetime] How long may browser-held state remain valid?
- [web-browser-support] Which browser compatibility contract must the project support?
- [web-offline-promise] Which browser outcome must work without a network connection?

#### Conditional desktop and mobile axes

- [desktop-restart-state] Which user state must survive an application restart?
- [desktop-os-integration] Which operating-system integration is part of the user contract?
- [mobile-interruption] Which user state must survive a system interruption?
- [mobile-form-factor] Which form-factor change must preserve the task?

#### Conditional command-line, library, and SDK axes

- [cli-invocation-contract] Which command invocation contract must remain compatible?
- [cli-machine-output] Which command output is consumed by automation?
- [cli-exit-status] Which outcomes require distinct exit statuses?
- [cli-execution-support] Which command-line execution environments must remain compatible?
- [library-public-contract] Which published library or SDK surface is compatibility-bound?

### Topic 7 — Architecture, System Context, Runtime, and Data

#### System context and structure

- [context-actors] Which actors exchange information with the project?
- [information-direction] In which direction does each material information flow?
- [runtime-units] Which high-level runtime units make up the system?
- [unit-responsibility] Which responsibility does each high-level unit own?
- [stable-boundary] Which boundary should remain stable while internals change?
- [coupling-risk] Where would tight coupling create the highest future cost?
- [architecture-change-evidence] Which evidence would change the architecture direction?

#### Runtime and state

- [primary-runtime-path] Which runtime path produces the primary outcome?
- [background-path] Which background path matters to correctness?
- [failure-containment] Which boundary must contain a failure?
- [retry-semantics] Which operation may be retried safely?
- [idempotency-boundary] Which repeated operation must preserve its effective outcome?
- [runtime-recovery] Which state must recovery restore?
- [state-authority] Which system is authoritative for outcome-bearing state?

#### Data direction

- [data-lifecycle] Which data lifecycle must the project support?
- [consistency-promise] Which consistency promise must hold?
- [stored-data-evolution] How may stored data evolve?
- [data-retention] How long must each material data class remain available?
- [restore-evidence] Which evidence proves that stored state can be restored?
- [data-export-contract] Which data-export contract must remain stable?
- [data-lineage] Which transformation history must remain traceable?

#### Conditional data-engineering axes

- [data-contract-owner] Who approves incompatible dataset-contract changes?
- [data-time-semantics] Which timestamp determines result correctness?
- [data-ordering] Which ordering guarantee affects correctness?
- [data-lateness] How should late data change an already produced result?
- [data-duplicates] Which duplicate inputs must be tolerated?
- [data-replay] Which previously produced outcome must a replay preserve?
- [data-backfill] Which downstream result may a backfill revise?
- [data-freshness] Which freshness signal matters to the data consumer?
- [data-quality-owner] Who decides whether a dataset is fit for use?

#### Conditional network-engineering axes

- [network-intended-state] Which source is authoritative for intended network state?
- [network-liveness] Which signal proves that a network component remains live?
- [network-convergence] Which observable state proves convergence after change?
- [network-reconciliation] How should operational state return to intended state?
- [network-partition] Which behavior must remain safe during a partition?
- [network-stale-state] When does network state become too stale to trust?

### Topic 8 — Technology Stack and Dependencies

#### Current and intended stack

- [programming-languages] Which programming languages constrain future work?
- [frameworks] Which frameworks constrain future work?
- [runtimes] Which runtimes constrain future work?
- [data-stores] Which data-store choices constrain future work?
- [supported-versions] Which technology support windows apply?
- [hard-stack-constraint] Which stack choice is a hard constraint?
- [tech-stack] Which technology choices should govern future work?
- [stack-change-evidence] Which evidence would invalidate the current stack direction?

#### Dependencies and platform fit

- [critical-dependency] Which external dependency is essential to the outcome?
- [dependency-failure] What happens when that dependency fails?
- [dependency-change] What happens when that dependency changes incompatibly?
- [dependency-exit] How can the project continue if that dependency disappears?
- [stack-license] Which technology-license condition constrains selection?
- [stack-portability] Which portability requirement constrains selection?

#### Conditional platform axes

- [web-runtime-boundary] Which behavior belongs in the browser?
- [desktop-target-os] Which desktop operating-system support window applies?
- [mobile-target-os] Which mobile operating-system support window applies?
- [library-runtime-support] Which consumer runtimes must the library or SDK support?
- [data-processing-model] Which processing model fits the data outcome?
- [network-standard] Which network standard governs compatibility?
- [network-peer-compatibility] Which peer implementations must interoperate?
- [network-registry] Which registry governs protocol values when the project defines them?
- [network-negotiation] Which capability negotiation must peers support?

### Topic 9 — Delivery, Operations, and Ownership

#### Environments and release

- [environment-model] Which operating environments differ in a material way?
- [configuration-source] Which source is authoritative for runtime configuration?
- [runtime-restriction] Which runtime restriction changes the software contract?
- [release-channel] Through which channel does the release reach its consumer?
- [deployment-method] How does a release enter its operating environment?
- [rollout-signal] Which signal permits a rollout to continue?
- [rollback-trigger] Which signal triggers rollback?
- [rollback-state] Which state must a rollback preserve?
- [recovery-priority] Which outcome must disaster recovery restore first?

#### Operation and ownership

- [consumer-indicator] Which signal measures the outcome from the consumer's perspective?
- [service-objective] Which consumer-visible service behavior needs a reliability objective?
- [service-workload-envelope] Which workload shape must the service support?
- [operational-owner] Who owns routine operation of the software?
- [diagnostic-evidence] Which diagnostic evidence must be available during failure?
- [incident-owner] Who coordinates response to a production incident?
- [operational-runbook] Which critical operation requires a tested runbook?

#### Conditional delivery axes

- [desktop-install] How is a desktop application installed?
- [desktop-update] How is a desktop application updated?
- [desktop-signing] Which signing or notarization requirement applies?
- [mobile-distribution] Which mobile-distribution channel applies?
- [package-distribution] Which package channel distributes a command-line tool, library, or SDK?
- [data-pipeline-health] Which signal proves that a data pipeline is producing usable outputs?
- [network-deployment] How can a network change coexist with previous behavior during rollout?
- [network-diagnostics] Which diagnostic evidence must be obtainable without disrupting service?

## Phase 4 — Viability and Guardrails

### Topic 10 — Security, Privacy, Safety, and Data Duties

#### Protection and trust

- [protected-assets] Which project asset requires the strongest protection?
- [trust-boundaries] Which system boundary changes the level of trust?
- [authorization-rule] Which rule decides whether an actor may perform an action?
- [audit-evidence] Which sensitive action requires audit evidence?

#### Threats and safe behavior

- [threat-actor] Which credible threat actor matters to this project?
- [abuse-case] Which abuse case could cause material harm?
- [security-failure] Which security failure has the highest consequence?
- [safe-failure] Which state must remain safe after a failure?

#### Privacy and data duties

- [personal-data] Which personal or sensitive data enters the project?
- [data-minimization] Which collected data is unnecessary for the owned outcome?
- [consent-duty] Which data use requires consent?
- [privacy-retention] Which privacy duty limits data retention?
- [privacy-deletion] Which deletion event must the project honor?
- [data-disclosure] Under which condition may protected data leave its current boundary?

#### Conditional mobile and network duties

- [mobile-permission] Which in-scope capability requires a sensitive platform permission?
- [mobile-permission-purpose] Which user-visible purpose justifies that permission?
- [mobile-permission-revocation] What remains usable after that permission is revoked?
- [network-replay-threat] Which protocol message must resist replay?
- [network-integrity-threat] Which protocol state must resist unauthorized modification?
- [network-denial-threat] Which denial-of-service condition requires explicit mitigation?

### Topic 11 — Engineering Conventions, Idioms, and Recurring Mistakes

#### Engineering conventions

- [directory-convention] Which directory structure is intentional?
- [module-convention] Which module boundary should contributors preserve?
- [naming-convention] Which naming pattern is binding?
- [interface-convention] Which interface-design pattern is binding?
- [error-convention] Which error-handling pattern is binding?
- [documentation-convention] Which documentation pattern is binding?
- [test-convention] Which test-organization pattern is binding?
- [contribution-convention] Which contribution pattern is binding?
- [live-example] Which current file best demonstrates the intended conventions?
- [counterexample] Which locally common pattern must not be copied?

#### Idioms, rules, and mistakes

- [intentional-idiom] Which unusual project pattern is intentional?
- [binding-rule] Which project rule is mandatory rather than preferred?
- [recurring-mistake] What do contributors or agents repeatedly get wrong?
- [corrected-approach] Which approach should replace a misleading local pattern?
- [hidden-knowledge] Which critical project knowledge has only one current owner?

### Topic 12 — Constraints, Quality, and Verification

#### Constraints and compatibility

- [legal-constraint] Which legal obligation binds the project?
- [regulatory-constraint] Which regulatory obligation binds the project?
- [budget-constraint] Which budget limit changes the project direction?
- [schedule-constraint] Which date constraint changes the project direction?
- [versioning-policy] Which external contract requires versioning?
- [deprecation-policy] How will consumers learn that a contract is being deprecated?
- [migration-obligation] Which consumer migration must the project support?

#### Quality direction

- [quality-priority] Which quality attribute dominates the hardest trade-off?
- [quality-scenario] Which concrete scenario defines that quality?
- [quality-threshold] Which observable threshold defines an acceptable result?
- [threshold-basis] Which source justifies that threshold?
- [allowed-degradation] Which quality may degrade first under pressure?
- [protected-quality] Which quality may not degrade?

#### Verification and review

- [verification-strategy] Which evidence depth fits each material claim?
- [end-to-end-evidence] Which complete outcome requires end-to-end evidence?
- [security-review] Which change requires security review?
- [performance-evidence] Which performance claim requires measured evidence?
- [operational-evidence] Which operating claim requires tested evidence?
- [accessibility-evidence] Which standards-based accessibility evidence is required?
- [user-validation] Which claim requires representative-user evidence?

### Topic 13 — Risks, Capacity, Maintenance, and Continuity

#### Risks and capacity

- [material-risk] Which risk has the greatest consequence for the project outcome?
- [risk-warning] Which earliest signal reveals that risk?
- [risk-mitigation] Which action reduces that risk?
- [risk-owner] Who owns that risk?
- [assumption-test] Which cheapest reliable test can resolve the riskiest assumption?
- [available-time] Which contributor time is actually available?
- [available-systems] Which required system is unavailable?
- [missing-authority] Which unresolved decision lacks an authorized owner?

#### Maintenance and continuity

- [primary-maintainer] Who owns ongoing maintenance of the software?
- [backup-maintainer] Who can continue maintenance when the primary maintainer is unavailable?
- [maintenance-scenario] Which representative change proves that the project is maintainable?
- [lifecycle-exit-trigger] Which evidence shows that active maintenance should end?
- [continuity-documentation] Which current document enables another person to continue the project?
