# Specification Topics

Use this direct phase bank to prepare evidence-backed Specification questions for the current subject. Keep
the accepted content at design-contract level and exclude implementation tasks.

## Project

- [protected-assets] Which Project asset would cause the most harm if compromised?

- [threat-actor] Which person, group, or external system could realistically try to harm or misuse the Project?

- [security-failure] Which security failure would cause the greatest Project-wide harm?

- [consumer-indicator] What consumer-visible measurement shows whether the running Project is delivering its intended result?

- [service-objective] Which behavior visible across the Project needs a measurable reliability target?

- [operational-runbook] Which high-risk Project operating task needs written, tested instructions?

- [quality-scenario] For the Project's highest-priority quality, what operating situation shows what that quality must achieve?
  - **Example:** For example, a dependency fails and affected work recovers safely.

- [quality-threshold] What measurable result marks the minimum acceptable level for that Project quality?

- [threshold-basis] Which evidence or authoritative source justifies the chosen quality threshold?

- [allowed-degradation] When Project resources are limited, which quality may be reduced first?

- [protected-quality] Which quality must remain at its required level even when a Product is overloaded or failing?

- [verification-strategy] For each important Project claim, what level of testing, review, observation, or rehearsal supports it?

- [product-authority] Who has final authority over Product direction across the Project?

- [technical-authority] Who has final authority over technical direction across the Project?

- [data-contract-owner] Who may approve a data-contract change that current consumers cannot use without changing?

- [data-quality-owner] Who decides whether Project data meets the requirements for its intended use?

- [license-model] Which license governs the Project's software?

- [distribution-model] How may the Project's Products be distributed?

- [governance-model] What process resolves disputed Project decisions?

- [legal-constraint] Which law or contractual obligation limits the Project?

- [regulatory-constraint] Which industry regulation or regulatory rule limits the Project?

- [budget-constraint] Which spending limit constrains Project scope or choices?

- [schedule-constraint] Which required date constrains Project scope or delivery?

- [available-time] How much time can each confirmed contributor spend on the Project, and during what period?

- [available-systems] Which required systems are currently unavailable or inaccessible?

- [operational-owner] Who owns routine operation of the Project service?

- [incident-owner] Who coordinates response to a cross-Product incident?

- [risk-owner] Who is accountable for monitoring and responding to the highest-consequence Project risk?

- [missing-authority] Which open Project decision currently has no authorized decision-maker?

- [primary-maintainer] Who owns ongoing maintenance of the Project?

- [backup-maintainer] Who can continue maintenance when the primary maintainer is unavailable?

- [hidden-knowledge] Which essential Project task or decision depends on knowledge held by only one person?

- [maintenance-end-evidence] What evidence would justify ending active maintenance of the Project?

- [continuity-documentation] Which document must another maintainer be able to follow to continue the Project?

- [policy-purpose] What risk or recurring decision makes each binding Project policy necessary?

- [policy-scope] Which people, artifacts, environments, and actions does each policy govern?

- [policy-authority] Who may establish, interpret, change, and retire each policy?

- [policy-enforcement-evidence] What observable evidence proves that each policy was followed?

- [policy-exception] Who may approve a policy exception, under which conditions, and how is it recorded?

- [policy-review-change] Which event or interval triggers policy review, and how does an approved change reach affected subjects?

- [policy-retirement] What evidence makes each policy unnecessary or unsafe to retain?

## Product

- [initial-capabilities] What must the first useful version of this Product be able to do?

- [refused-use] Which attempted Product uses must be rejected?

- [feature-list] Which named features must this Product provide?

- [minimum-complete-capability] What is the smallest complete Product capability that lets a consumer finish a useful task?
  - **Example:** For example, a consumer creates and later recovers one saved result.

- [feature-prerequisite] What must already exist or be true before this feature can work?

- [feature-start] Which consumer action, system event, or schedule starts this feature?

- [feature-finish] What can a consumer observe to know this feature finished successfully?

- [feature-handoff] At what point does this feature pass responsibility to another person, Product, or external system?

- [feature-worst-failure] Which failure during this feature would have the greatest consequence?

- [success-feedback] What should the Product interface show or return first to confirm success?

- [information-priority] What information must a consumer see before an important Product-supported decision?

- [result-explanation] Which consequential Product result needs an explanation of how it was reached?

- [error-action] After a Product error, what must the affected consumer be able to do next?

- [destructive-safeguard] What safeguard must protect people or state from a hard-to-reverse Product action?

- [accessibility-needs] Which needs of consumers with disabilities must shape the first useful Product version?

- [data-retention] For each important Product data category, how long must it remain available?

- [data-export-contract] Which exported formats, fields, meanings, or behaviors must remain compatible for Product consumers?

- [external-contract] What Product behavior, input, output, or interface must remain stable because consumers rely on it?

- [compatibility-boundary] Which current Product behavior must continue working after the Product changes?

- [invalid-input] How must the Product respond to invalid input?

- [partial-state] How must the Product respond when only part of an operation succeeds?

- [misuse-response] How must the Product respond safely to an explicitly unsupported use?

- [versioning-policy] Which public Product interface or data format must carry a version?

- [web-direct-link] When someone opens a saved or shared Product URL directly, which page and state must appear?

- [web-navigation-continuity] When a consumer uses browser Back or Forward, which Product state must remain correct?

- [web-refresh-continuity] Which entered data or in-progress Product task must survive a refresh?

- [web-storage-lifetime] How long may browser-stored Product data be reused before refresh or removal?

- [web-browser-support] Which browsers and versions must this Product support?

- [web-offline-promise] Which Product task must work without a network connection?

- [desktop-os-integration] Which operating-system feature must a desktop Product support?

- [mobile-form-factor] Which in-progress Product task must continue across device size, orientation, or form changes?

- [desktop-target-os] Which desktop operating systems and versions must this Product support, and for how long?

- [mobile-target-os] Which mobile operating systems and versions must this Product support, and for how long?

- [cli-invocation-contract] Which command names, arguments, options, and input behaviors must remain compatible?

- [cli-machine-output] Which command output formats are consumed by scripts or automation?

- [cli-exit-status] Which command outcomes need distinct process exit codes?

- [library-public-contract] Which public functions, classes, types, or behaviors must current library or software development kit consumers retain?

- [network-standard] Which published protocol or networking standard must this Product follow?

- [network-peer-compatibility] Which devices, services, or software must exchange protocol messages successfully with this Product?

- [network-registry] Which official registry controls named or numbered protocol values?

- [network-negotiation] Which supported features or versions must protocol peers agree on?

- [authorization-rule] Which rule decides whether a consumer or connected system may perform a Product action?

- [audit-evidence] Which sensitive Product action must leave a protected audit record?

- [abuse-case] Which realistic misuse of this Product could cause serious harm?

- [safe-failure] After a serious Product failure, what condition must remain true to avoid harm?

- [personal-data] Which personal or sensitive data does this Product collect, receive, store, or transmit?

- [data-minimization] Which collected Product data is unnecessary for its intended result?

- [consent-duty] Which Product collection or use of personal data requires consent?

- [privacy-retention] Which law, policy, or commitment limits Product retention of personal or sensitive data?

- [privacy-deletion] Which request, deadline, or lifecycle event requires the Product to delete personal or sensitive data?

- [data-disclosure] Under what approved condition may the Product share protected data outside its current trust boundary?

- [mobile-permission] Which Product capability requires access to sensitive device features or user data?

- [mobile-permission-purpose] What user-visible benefit justifies each sensitive permission request?

- [mobile-permission-revocation] If permission is revoked, which Product capabilities must still work?

- [service-workload-range] What request or job range and pattern must a service Product handle correctly?
  - **Example:** For example, include steady demand and a short burst.

- [accessibility-target] Which accessibility standard and conformance level must this Product meet?

- [end-to-end-evidence] Which complete Product result must be tested from trigger through final outcome?

- [accessibility-evidence] What evidence must show that this Product meets its accessibility target?

- [user-validation] Which Product behavior or experience claim must be tested with representative consumers?

- [release-channel] Which supported channel lets each intended consumer or connected system obtain and identify a Product release?

## Implementation

- [supported-versions] Which versions of every required stack entry must this Implementation support, and for how long?

- [environment-model] Which development, test, staging, production, or other environment differences change Implementation behavior or risk?

- [configuration-source] Which file, service, or system is authoritative for runtime configuration?

- [runtime-restriction] Which network, locality, regional, resource, or other operating restriction changes what this Implementation must support?

- [same-result-on-repeat] Which Implementation operation must reach the same end state when repeated with the same request?

- [consistency-promise] When the same data appears in several places, what agreement or update timing must the Implementation preserve?
  - **Example:** For example, a reader may see stale data until the next refresh.

- [stored-data-evolution] What compatibility must the Implementation preserve when stored data format or meaning changes?

- [restore-evidence] What test or evidence proves that Implementation-managed data can be restored after loss?

- [data-lineage] For which data must the Implementation trace its source and every transformation?

- [data-timestamp-choice] Which timestamp must Implementation calculations use when an event time and arrival time differ?

- [data-ordering] Which records or events must the Implementation process in order?

- [data-lateness] How may an earlier result change when data arrives late?

- [data-duplicates] Which input records may arrive more than once without making the result incorrect?

- [data-replay] Which earlier result must historical input reproduce when processed again?
  - **Example:** For example, process an earlier event again without duplicating its effect.

- [data-backfill] Which previous result may change after missing or corrected historical data is processed?
  - **Example:** For example, populate a new field for existing records.

- [data-freshness] What signal tells a consumer that Implementation-produced data is recent enough to use?

- [network-intended-state] Which configuration or system is authoritative for intended network state?

- [network-liveness] Which signal shows that a network runtime unit is running and responding?

- [network-convergence] What observable condition proves all affected runtime units reached intended network state?

- [network-reconciliation] How must the Implementation reconcile actual and intended network state?

- [network-stale-state] How old may observed network state become before the Implementation stops relying on it?

- [safe-retry] Which failed Implementation operation may be tried again without an incorrect or unsafe result?

- [network-partition] Which behavior must remain safe when runtime units cannot communicate?

- [cli-execution-support] Which operating systems and command shells must the Implementation support for a command-line Product?

- [trust-boundaries] Where does data or control cross between Implementation runtime units with different trust levels?
  - **Example:** For example, untrusted input crosses into a privileged process.

- [network-replay-threat] Which protocol message must the Implementation reject when an attacker sends it again?

- [network-integrity-threat] Which protocol state becomes invalid after unauthorized change?

- [network-denial-threat] Which resource-exhaustion attempt needs a planned defense to keep the Product available?

- [diagnostic-evidence] Which logs, metrics, traces, or records must the Implementation provide after failure?

- [security-review] Which Implementation changes require security review before release?

- [performance-evidence] Which speed, capacity, or resource-use claim requires measurement?

- [operational-evidence] Which deployment, recovery, or routine-operation claim requires a realistic demonstration?

- [directory-convention] Which repository-organization constraint is binding for this Implementation, and what boundary does it protect?

- [module-convention] Which responsibilities must remain separated by a module or package boundary?

- [naming-convention] Which naming rules govern source files, modules, packages, namespaces, types, functions, variables, constants, and public versus internal identifiers?

- [repository-change-naming] Which naming rules apply to repositories, directories, branches, tags, commits, and change requests?

- [contract-naming-convention] Which naming and versioning rules apply to APIs, events, schemas, data fields, and configuration keys?

- [artifact-naming-convention] Which naming and versioning rules make packages, binaries, images, installers, checksums, and release artifacts unambiguous?

- [environment-resource-naming] Which naming rules distinguish environments, regions, tenants, services, jobs, queues, databases, and other operational resources?

- [observability-naming-convention] Which stable names, namespaces, units, labels, and cardinality limits govern logs, metrics, traces, events, dashboards, and alerts?

- [interface-convention] Which design pattern must Implementation interfaces follow?

- [error-convention] Which pattern must Implementation code follow when reporting, propagating, or recovering from errors?

- [documentation-convention] Which format and location rules apply to Implementation documentation?

- [test-convention] Which naming, grouping, location, ownership, and lifecycle rules apply to tests, fixtures, snapshots, benchmarks, and generated test data?

- [contribution-convention] Which process must a contributor follow when proposing an Implementation change?

- [live-example] Which current file or module is the authoritative example for this Implementation?

- [counterexample] Which locally common pattern is misleading and must not be copied?

- [deliberate-pattern] Which unusual-looking Implementation pattern is deliberate and must be preserved?

- [binding-rule] Which Implementation rule is mandatory rather than preferred?

- [recurring-mistake] Which Implementation-specific mistake do contributors or agents repeatedly make?

- [corrected-approach] Which approved approach replaces the misleading local pattern?
