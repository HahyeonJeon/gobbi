# Startup Topics

This seed bank frames a Startup interview for a software project. Each bracketed alias identifies one
question axis. The bank covers shared software concerns and concrete axes for web, desktop, mobile,
command-line, library or SDK, service, data, and network projects.

The Startup operation owns question order, evidence handling, contextual adaptation, emergent questions,
and Phase checkpoints. A conditional domain prompt matters only when project evidence activates it.

## Contents

1. [Phase 1 — Problem Definitions](#phase-1--problem-definitions)
   - [Topic 1 — Existing Reality and Evidence](#topic-1--existing-reality-and-evidence)
   - [Topic 2 — Problems, Causes, Outcomes, and Success](#topic-2--problems-causes-outcomes-and-success)
   - [Topic 3 — People, Jobs, Alternatives, and Adoption](#topic-3--people-jobs-alternatives-and-adoption)
2. [Phase 2 — Project Design](#phase-2--project-design)
   - [Topic 4 — Scope, Boundaries, External Contracts, and Non-goals](#topic-4--scope-boundaries-external-contracts-and-non-goals)
   - [Topic 5 — Capabilities and Journeys](#topic-5--capabilities-and-journeys)
   - [Topic 6 — Experience, Interfaces, and Accessibility](#topic-6--experience-interfaces-and-accessibility)
   - [Topic 7 — System Context and Data Direction](#topic-7--system-context-and-data-direction)
3. [Phase 3 — Project Specification](#phase-3--project-specification)
   - [Topic 8 — Architecture, Runtime, State, and Data Contracts](#topic-8--architecture-runtime-state-and-data-contracts)
   - [Topic 9 — Technology Stack, Dependencies, and Platform Compatibility](#topic-9--technology-stack-dependencies-and-platform-compatibility)
   - [Topic 10 — Delivery, Operations, Quality, and Verification](#topic-10--delivery-operations-quality-and-verification)
   - [Topic 11 — Security, Privacy, Safety, and Data Duties](#topic-11--security-privacy-safety-and-data-duties)
4. [Phase 4 — Project Rules](#phase-4--project-rules)
   - [Topic 12 — Authority, Governance, Constraints, and Engineering Conventions](#topic-12--authority-governance-constraints-and-engineering-conventions)
   - [Topic 13 — Ownership, Maintenance, Risk, and Continuity](#topic-13--ownership-maintenance-risk-and-continuity)

## Phase 1 — Problem Definitions

### Topic 1 — Existing Reality and Evidence

#### Software form and lifecycle

- [software-type] What type of software, or combination of software types, will deliver the project's intended result?
- [current-software] What kinds of software already exist for this project?
- [lifecycle-stage] What stage is the project in now—for example, idea, prototype, active development, released, or maintenance?
- [prior-attempt] What happened in the most recent prior attempt, if any, to solve this problem?

#### Evidence source

- [project-source-of-truth] When project sources disagree, which source has final authority over the project's current purpose and direction?

### Topic 2 — Problems, Causes, Outcomes, and Success

#### Problem evidence

- [last-problem-event] What happened in the most recent concrete occurrence of the problem?
- [problem-cost] What measurable cost, delay, error, or other consequence resulted from the most recent occurrence of the problem?
- [problem-frequency] How often does this problem occur?

#### Cause and timing

- [root-cause] What evidence supports the current root-cause explanation?
- [deeper-cause-test] What observation would show that the stated cause is itself caused by a deeper problem?
- [why-now] What changed to make this the right time to act?

#### Risks and assumptions

- [riskiest-assumption] Which assumption is most important to project success and currently has the weakest evidence?
- [material-risk] Which risk could cause the greatest harm to the project's intended result?
- [risk-warning] What is the earliest observable sign that the highest-consequence risk is beginning to occur?
- [risk-mitigation] What single action would do the most to prevent or limit harm from the highest-consequence risk?
- [assumption-test] What is the least costly reliable way to find out whether the riskiest assumption is true?

#### Durable outcome and evidence

- [durable-outcome] What result for users or consumers must remain true even if the software is rebuilt in a different way?
- [current-baseline] What can be observed or measured now as the starting point for later comparison?
- [success-signal] What measurable real-world change would show that the project achieved its intended result?
- [false-success] What technical result could meet the stated requirements but still fail users or the project's intended result?
- [stop-evidence] What evidence would show that the project should stop pursuing its intended result?

### Topic 3 — People, Jobs, Alternatives, and Adoption

#### People and jobs

- [first-user] Which person, group, or external system should benefit from or consume the software's result first?
- [affected-people] Who, if anyone, could be significantly affected by the software or its results without using it directly?
- [excluded-people] Which people or consumers are intentionally outside the project's current target group?
- [primary-job] What important task or goal is the first user trying to complete?
- [job-context] In what real situation does the first user need to complete that task?
- [job-failure] What happens to the first user when they cannot complete that task?

#### Alternatives and adoption

- [current-alternative] How does the first user complete that task today without the proposed software?
- [alternative-breakdown] Which part of the current approach prevents or delays completion of the task?
- [switch-push] What problem with the current approach would motivate the user to stop relying on it?
- [switch-pull] What benefit of the proposed software would motivate the user to try it?
- [switch-anxiety] What concern could prevent the user from trying or adopting the proposed software?
- [switch-habit] What existing habit or workflow makes the current approach difficult to replace?
- [adoption-evidence] What action, if any, has the user already taken that shows a willingness to change from the current approach?
- [value-advantage] Which result must the proposed software improve compared with the user's current approach?

## Phase 2 — Project Design

### Topic 4 — Scope, Boundaries, External Contracts, and Non-goals

#### Owned outcome and scope

- [owned-outcome] What complete result for a user or consumer is this project responsible for delivering?
- [responsibility-boundary] Where does the project's responsibility begin and end?
- [initial-capabilities] What must the first useful version of the software be able to do?

#### External contracts

- [external-contract] What behavior, input, output, or interface must remain stable because users or connected systems rely on it?
- [compatibility-boundary] Which current behavior must continue to work for existing users or connected systems after the project changes?

#### Non-goals and change tests

- [explicit-non-goal] Which plausible capabilities, if any, are explicitly outside the project's current scope?
- [manual-boundary] Which tasks, if any, will intentionally remain manual rather than being performed by the software?
- [refused-use] Which attempted uses, if any, must the software reject?
- [scope-change-evidence] What evidence would justify adding work that is currently outside the project's scope?
- [irreversible-boundary] Which decision about the project's scope or responsibilities would be most costly to change later?

### Topic 5 — Capabilities and Journeys

#### Capability shape

- [minimum-complete-capability] What is the smallest complete software capability that lets a user or consumer complete a useful task?
- [capability-prerequisite] What must already exist or be true before the next planned software function can work?

#### Primary journey

- [journey-trigger] Which user action, system event, or scheduled event starts the main task that the software must support?
- [journey-completion] What can a user or connected system observe to know that the main task finished successfully?
- [journey-handoff] At what point in the main task does responsibility pass to another person or system?

#### Failure priority

- [highest-cost-failure] Which failure during the main task would have the greatest consequence?

### Topic 6 — Experience, Interfaces, and Accessibility

#### Shared interface direction

- [interface-type] How will each main user or connected system interact with the software—for example, through a screen, command line, or application programming interface?
- [success-feedback] What should the interface show or return first to confirm that an action succeeded?
- [domain-concepts] Which project-specific ideas and terms must have the same meaning in every interface?
- [information-priority] Before a user makes an important decision supported by the software, what information must they see?
- [result-explanation] Which result could significantly affect someone and therefore needs an explanation of how it was reached?
- [error-action] After an error, what must the affected user or connected system be able to do next?
- [destructive-safeguard] What safeguard—for example, confirmation, permission, or recovery—must protect people or system state from an action that deletes data or causes another hard-to-reverse change?

#### Accessibility and references

- [accessibility-needs] Which needs of users with disabilities must shape the first useful version?
- [representative-users] Which intended users should test the most uncertain assumption about using the software?
- [representative-tasks] Which realistic tasks should the representative users attempt during testing?
- [design-reference] Which existing product or interface, if any, demonstrates an approach that this project should emulate?
- [reference-rejection] Which existing product or interface, if any, may look relevant but should not guide this project's design?

### Topic 7 — System Context and Data Direction

#### System context and boundaries

- [context-actors] Which people, organizations, or external systems send information to or receive information from the software?
- [information-direction] For each important kind of information, who or what sends it, and who or what receives it?
- [stable-boundary] Which connection between system parts, users, or external systems must keep the same behavior when the internal implementation changes?
- [coupling-risk] Which parts of the project or connected systems must remain easy to change independently to avoid the greatest future cost?
- [architecture-change-evidence] What new evidence would justify changing the current high-level system design?

#### State and data direction

- [state-authority] If systems disagree about data or status that determines the project's result, which system's value should be treated as correct?
- [data-lifecycle] What must happen to the project's data from creation or collection through use, storage, retention, and deletion?

#### Conditional platform direction

- [web-runtime-boundary] For a web project, which work must run in the user's browser rather than on a server or another system?
- [data-processing-model] How should the project process data to produce its intended result—for example, as data arrives, in scheduled batches, or on demand?

## Phase 3 — Project Specification

### Topic 8 — Architecture, Runtime, State, and Data Contracts

#### Runtime architecture

- [runtime-units] Which major parts of the system run independently—for example, an application, service, background worker, or scheduled job?
- [unit-responsibility] For each independently running part of the system, what responsibility does it own?

- [primary-runtime-path] When the system produces its main result, which running components handle the work from start to finish?
- [background-path] Which work that runs without a user waiting for it must succeed for the final result to be correct?
- [failure-containment] Which part of the system must prevent one failure from affecting other parts or users?
- [retry-semantics] Which failed operation may be tried again without producing an incorrect or unsafe result?
- [idempotency-boundary] Which operation must have the same end result when the same request is performed more than once?
- [runtime-recovery] After a runtime failure, which system state must be restored before normal work can continue?

#### Failure contracts

- [invalid-input] How must the software respond when it receives invalid input?
- [partial-state] How must the software respond when only part of an operation succeeds?
- [dependency-unavailable] When a required dependency is temporarily unavailable, what must the running software do?
- [failure-visibility] How will the affected user or connected system learn that the main task failed?
- [failure-recovery] What action returns the failed task to a safe state?
- [misuse-response] When someone attempts a use that the project explicitly refuses to support, how must the software respond safely?

#### Data contracts

- [consistency-promise] When the same data appears in more than one place, what agreement or update-timing guarantee must consumers be able to rely on?
- [stored-data-evolution] What compatibility must be preserved when the format or meaning of stored data changes?
- [data-retention] For each important category of stored data, how long must the project keep it available for product or operational needs?
- [restore-evidence] What test or evidence proves that stored data can be restored after loss?
- [data-export-contract] When the project exports data, which formats, fields, meanings, or behaviors must remain compatible for consumers?
- [data-lineage] For which data must the project be able to trace its source and every transformation that produced the current result?

#### Conditional data-engineering axes

- [data-time-semantics] When data has multiple timestamps—for example, when an event happened and when it arrived—which timestamp must calculations use?
- [data-ordering] Which records or events must be processed in a particular order for the result to be correct?
- [data-lateness] When data arrives after a result has already been produced, how, if at all, should that result change?
- [data-duplicates] Which input records may be delivered more than once without making the result incorrect?
- [data-replay] If historical input is processed again, which earlier result must the new run reproduce?
- [data-backfill] When missing or corrected historical data is processed later, which previously produced result may change?
- [data-freshness] What signal tells a data consumer whether the data is recent enough to use?

#### Conditional network-engineering axes

- [network-intended-state] Which configuration or system is the source of truth for how the network is supposed to be configured?
- [network-liveness] Which signal shows that a network component is still running and responding?
- [network-convergence] After a network change, what observable condition shows that all affected components have reached the intended state?
- [network-reconciliation] When the network's actual state differs from its intended configuration, how should the project bring them back into agreement?
- [network-partition] If parts of the network cannot communicate with each other, which behavior must still remain safe?
- [network-stale-state] How old may observed network-state data become before the project must stop relying on it?

### Topic 9 — Technology Stack, Dependencies, and Platform Compatibility

#### Current and intended stack

- [programming-languages] Which programming languages must future work use or continue to support?
- [frameworks] Which software frameworks must future work use or remain compatible with?
- [runtimes] Which execution runtimes must future software continue to run on?
- [data-stores] Which databases or other data stores must future work keep using or remain compatible with?
- [supported-versions] For each required technology, which versions must the project support, and for how long?
- [hard-stack-constraint] Which technology choice is mandatory rather than a preference?
- [tech-stack] Which combination of technologies—for example, languages, frameworks, execution runtimes, and data stores—should future work use?
- [stack-change-evidence] What evidence would show that the chosen technology stack no longer fits the project?

#### Dependencies and platform fit

- [critical-dependency] Which external dependency, if any, is essential to the project's intended result?
- [dependency-failure] If a critical external dependency fails, which project capability or result is lost or reduced?
- [dependency-change] What must the project do if a critical external dependency changes in a way that the current integration cannot use?
- [dependency-exit] How can the project continue if a critical external dependency becomes permanently unavailable?
- [stack-license] Which software-license requirement limits the technologies that the project may choose?
- [stack-portability] What ability to run or move the software across different operating environments must the chosen technologies preserve?

#### Compatibility lifecycle

- [versioning-policy] Which public interface or data format must carry a version so consumers can detect incompatible changes?
- [deprecation-policy] How must the project notify consumers that a supported interface or data format will be retired?
- [migration-obligation] When a supported interface, data format, or other external contract changes incompatibly, which consumers must the project help move to its replacement?

#### Conditional web contracts

- [web-direct-link] When someone opens a saved or shared URL directly, which page and user state must appear?
- [web-navigation-continuity] When a user selects the browser's Back or Forward button, which page, data, or task state must remain correct?
- [web-refresh-continuity] Which user-entered data or in-progress task state must remain after the page is refreshed?
- [web-storage-lifetime] How long may data stored in the user's browser be reused before it must be refreshed or discarded?
- [web-browser-support] Which web browsers and browser versions must the project support?
- [web-offline-promise] Which user task must the web application support without a network connection?

#### Conditional desktop and mobile contracts

- [desktop-restart-state] Which user work or application state must be restored after the desktop application restarts?
- [desktop-os-integration] Which operating-system feature, such as notifications, file associations, or system menus, must the desktop application support?
- [mobile-interruption] If the mobile operating system pauses or closes the application, which in-progress user state must be restored?
- [mobile-form-factor] When the device size, orientation, or physical form changes, which in-progress task must continue without losing state?
- [desktop-target-os] Which desktop operating systems and versions must the application support, and for how long?
- [mobile-target-os] Which mobile operating systems and versions must the application support, and for how long?

#### Conditional command-line, library, and SDK contracts

- [cli-invocation-contract] Which command names, arguments, options, and input behaviors must remain compatible for existing users or scripts?
- [cli-machine-output] Which command output formats are read by scripts or other automation?
- [cli-exit-status] Which command outcomes must return different process exit codes so scripts can tell them apart?
- [cli-execution-support] Which operating systems and command shells must continue to run the command-line tool?
- [library-public-contract] Which public functions, classes, types, or behaviors must existing library or software development kit users be able to keep using?
- [library-runtime-support] Which language or execution-runtime versions must applications using the library or software development kit be able to run on?

#### Conditional data and network platforms

- [network-standard] Which published protocol or networking standard must the project follow to work with other systems?
- [network-peer-compatibility] Which other devices, services, or software implementations must successfully exchange protocol messages with this project?
- [network-registry] If the protocol defines named or numbered values, which official registry controls how those values are assigned?
- [network-negotiation] When two protocol peers connect, which supported features or versions must they be able to agree on?

### Topic 10 — Delivery, Operations, Quality, and Verification

#### Environments and release

- [environment-model] Which differences among the project's operating environments—for example, development, test, staging, or production—can change the software's behavior or risk?
- [configuration-source] Which file, service, or system is the source of truth for configuration used while the software is running?
- [runtime-restriction] Which operating restriction, such as limited network access, local deployment, or regional limits, changes what the software must support?
- [release-channel] How do the intended users or connected systems receive a release?
- [deployment-method] How is a released version installed or deployed into the environment where it will run?
- [rollout-signal] During a gradual release, which observed result shows that it is safe to continue releasing to more users or systems?
- [rollback-trigger] Which observed failure requires the release to stop and the previous version to be restored?
- [rollback-state] If a release is rolled back, which user, system, or operational state must remain intact?
- [recovery-priority] Which user or system capability must disaster recovery restore first?

#### Operating contract

- [consumer-indicator] What user- or consumer-visible measurement shows whether the running software is delivering its intended result?
- [service-objective] Which behavior visible to service consumers needs a measurable reliability target, such as availability or successful responses?
- [service-workload-envelope] What range and pattern of requests or jobs must the service handle correctly?
- [diagnostic-evidence] When the software fails, which logs, metrics, traces, or other records must be available to determine what happened?
- [operational-runbook] Which high-risk operating task needs written, tested step-by-step instructions?

#### Quality direction

- [accessibility-target] Which accessibility standard and conformance level must the user interface meet?
- [quality-priority] When important qualities conflict, which one, such as correctness, security, speed, or usability, must take priority?
- [quality-scenario] For the project's highest-priority quality, what specific operating situation shows what that quality must achieve?
- [quality-threshold] What measurable result marks the minimum acceptable level for the project's highest-priority quality?
- [threshold-basis] Which evidence or authoritative source justifies the project's chosen quality threshold?
- [allowed-degradation] When the system is overloaded or resources are limited, which quality may be reduced first?
- [protected-quality] Which quality must remain at its required level even when the system is overloaded or failing?

#### Verification and review

- [verification-strategy] For each important project claim, what level of testing or review is needed to support it?
- [end-to-end-evidence] Which complete user or system result must be tested from its initial trigger through its final result?
- [security-review] Which kinds of software changes must receive a security review before release?
- [performance-evidence] Which claim about speed, capacity, or resource use must be supported by measurements?
- [operational-evidence] Which claim about deployment, recovery, or routine operation must be demonstrated in a realistic test?
- [accessibility-evidence] What test results or review evidence must show that the interface meets its accessibility standard?
- [user-validation] Which claim about user behavior or experience must be tested with people representative of the intended users?
- [maintenance-scenario] Which realistic future change should a new maintainer be able to complete to show that the project can be maintained?

#### Conditional delivery axes

- [desktop-install] How is a desktop application installed?
- [desktop-update] How is a desktop application updated?
- [desktop-signing] Which code-signing or platform-notarization checks must the desktop release pass before distribution?
- [mobile-distribution] Through which application store, enterprise channel, or direct method will the mobile application be distributed?
- [package-distribution] Which package registry or installation channel will distribute the command-line tool, library, or software development kit?
- [data-pipeline-health] What observable signal shows that a data pipeline's output is usable by its consumers?
- [network-deployment] During deployment, how can new network behavior operate safely while devices or peers still use the previous behavior?
- [network-diagnostics] Which operational data must an engineer be able to collect without interrupting network service?

### Topic 11 — Security, Privacy, Safety, and Data Duties

#### Protection and trust

- [protected-assets] Which project asset, such as data, credentials, software, or infrastructure, would cause the most harm if compromised?
- [trust-boundaries] Where does data or control cross between parts of the system with different trust or security levels?
- [authorization-rule] Which rule decides whether a user or connected system may perform an action?
- [audit-evidence] Which sensitive action must leave a protected audit record?

#### Threats and safe behavior

- [threat-actor] Which person, group, or system could realistically try to harm or misuse this project?
- [abuse-case] Which realistic misuse of the software could cause serious harm?
- [security-failure] Which security failure would cause the greatest harm to the project or its users?
- [safe-failure] After a serious failure, what condition must the system preserve to avoid harm?

#### Privacy and data duties

- [personal-data] Which personal or sensitive data does the software collect, receive, store, or transmit?
- [data-minimization] Which collected data, if any, is unnecessary for the project's intended result?
- [consent-duty] Which collection or use of personal data, if any, requires the person's consent?
- [privacy-retention] Which privacy law, policy, or user commitment limits how long the project may keep personal or sensitive data?
- [privacy-deletion] Which user request, policy deadline, or lifecycle event, if any, requires the project to delete personal or sensitive data?
- [data-disclosure] Under what approved condition may protected data be shared outside the system or organization that currently holds it?

#### Conditional mobile and network duties

- [mobile-permission] Which software capability, if any, requires access to sensitive device features or user data?
- [mobile-permission-purpose] What user-visible benefit justifies requesting each sensitive mobile-platform permission?
- [mobile-permission-revocation] If a user revokes a sensitive mobile-platform permission, which application capabilities must still work?
- [network-replay-threat] Which protocol message must be rejected if an attacker captures it and sends the same message again?
- [network-integrity-threat] Which protocol state must the project treat as invalid if an unauthorized party changes it?
- [network-denial-threat] Which attempt to exhaust traffic, connections, or computing resources could make the network service unavailable and therefore needs a planned defense?

## Phase 4 — Project Rules

### Topic 12 — Authority, Governance, Constraints, and Engineering Conventions

#### Authority and governance

- [product-authority] Who has final authority over product direction?
- [technical-authority] Who has final authority over technical direction?
- [data-contract-owner] Who may approve a change to a dataset's format or meaning that existing consumers cannot use without changing their systems?
- [data-quality-owner] Who decides whether a dataset meets the requirements for its intended use?
- [license-model] Which license governs the software?
- [distribution-model] How may the software be distributed?
- [governance-model] What process resolves disputed project decisions?

#### Project constraints

- [legal-constraint] Which law or contractual legal obligation limits the project?
- [regulatory-constraint] Which industry regulation or regulatory rule limits the project?
- [budget-constraint] Which spending limit constrains the project's scope or technology choices?
- [schedule-constraint] Which required date constrains the project's scope or delivery?
- [available-time] How much time can each confirmed contributor spend on the project, and during what period?
- [available-systems] Which required systems, if any, are currently unavailable or inaccessible?

#### Engineering conventions

- [directory-convention] Which parts of the repository's directory structure are deliberate and must be preserved?
- [module-convention] Which responsibilities must contributors keep separated by a module or package boundary?
- [naming-convention] What mandatory naming patterns apply to files, modules, types, functions, or other project elements?
- [interface-convention] What mandatory design pattern must contributors follow for user, programmatic, or module interfaces?
- [error-convention] What mandatory pattern must code follow when reporting, propagating, or recovering from errors?
- [documentation-convention] What mandatory pattern must contributors follow for the format and location of project documentation?
- [test-convention] What mandatory pattern must contributors follow for naming, grouping, and locating tests?
- [contribution-convention] What mandatory process must a contributor follow when proposing and submitting a change?
- [live-example] Which current file or module is the authoritative example of the project's conventions?
- [counterexample] Which locally common pattern, if any, is misleading and should not be copied?

#### Idioms, rules, and mistakes

- [intentional-idiom] Which unusual-looking pattern in this project is deliberate and should be preserved?
- [binding-rule] Which project rule is mandatory rather than preferred?
- [recurring-mistake] What project-specific mistake, if any, do contributors or agents repeatedly make?
- [corrected-approach] What approved approach should contributors use instead of the project's misleading local pattern?

### Topic 13 — Ownership, Maintenance, Risk, and Continuity

#### Operational ownership

- [operational-owner] Who owns routine operation of the software?
- [incident-owner] Who coordinates response to a production incident?

#### Risk and authority ownership

- [risk-owner] Who is accountable for monitoring and responding to the project's highest-consequence risk?
- [missing-authority] Which open project decision currently has no authorized decision-maker?

#### Maintenance and continuity

- [primary-maintainer] Who owns ongoing maintenance of the software?
- [backup-maintainer] Who can continue maintenance when the primary maintainer is unavailable?
- [hidden-knowledge] Which essential project task or decision depends on knowledge held by only one person?
- [lifecycle-exit-trigger] What evidence would justify ending active maintenance of the software?
- [continuity-documentation] Which document must another maintainer be able to follow to continue the project without the current maintainer?
