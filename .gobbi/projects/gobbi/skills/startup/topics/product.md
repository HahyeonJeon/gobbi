# Product Topics

A Product is one independently useful application or platform owned by the Project. For example, a web
dashboard and a CLI are separate Products with separate user, operating, failure, upgrade, and retirement
contracts; this example is explanatory, not required content.

Keep one coverage record for every alias, but do not repeat an interview when accepted evidence already
answers it. `[software-type]` and `[application-deliverable-type]` may share one accepted type answer and
evidence reference. `[building-block-inventory]` and `[building-block-parent]` are deterministically derived
from the accepted Product and its registered one-to-one Implementation identity.

## Problem Definition

Adapt these questions to one registered Product and keep answers distinct from its siblings. A Product owns
an independently useful consumer result, not a technology category or stack entry.

- [software-type] What kind of independently useful application or platform is this Product?
- [other-software] Which existing Products made by others already address this consumer problem?
- [prior-attempt] What happened in the most recent prior attempt to provide this Product outcome?
- [first-user] Which person, group, or external system should use or consume this Product first?
- [main-task] What important task or goal is that first consumer trying to complete with this Product?
- [task-situation] In what real situation does that consumer need the Product?
- [task-failure-cost] What happens when the consumer cannot complete the task with the Product?
- [current-alternative] What steps does the consumer take today without this Product?
- [alternative-obstacle] Which part of the current approach prevents or delays completion?
- [reason-to-leave] What problem with the current approach would motivate the consumer to leave it?
- [reason-to-adopt] What Product benefit would motivate the consumer to try it?
- [adoption-concern] What concern could prevent the consumer from adopting this Product?
- [established-habit] What existing habit or workflow makes the current approach difficult to replace?
- [adoption-evidence] What action shows that the consumer is willing to change from the current approach?
- [required-improvement] Which result must this Product improve compared with the consumer's current approach?

## Design

Use these questions for the Product boundary, runtime form, consumer interfaces, and its stable one-to-one
Implementation relationship. For example, `Web Dashboard` has one Implementation even when its React and
TypeScript entries have not yet been selected.

- [stable-boundary] Which Product connection or consumer-facing behavior must remain stable when its Implementation changes?
- [web-runtime-boundary] For a web Product, which work must occur in the consumer's browser?
- [data-processing-model] How should a data Product produce its result—as data arrives, in scheduled batches, or on demand?
- [application-deliverable-type] Which accepted Product-type evidence establishes this Product's type and complete outcome?
- [building-block-inventory] Which registered stable identity names this Product's single complete Implementation?
- [building-block-parent] Which accepted Product identity owns that registered Implementation?
- [interface-type] How will each main consumer interact with this Product—for example, through a screen, command line, or programmatic interface?
- [domain-concepts] Which Product-specific ideas and terms must have the same meaning in every interface?
- [representative-users] Which intended consumers should test the most uncertain Product-use assumption?
- [representative-tasks] Which realistic Product tasks should those consumers attempt?
- [design-reference] Which existing Product or interface demonstrates an approach worth following?
- [reference-rejection] Which apparently relevant Product or interface should not guide this design?

## Specification

Use these questions for one Product's capability, experience, behavior, data, external contracts, safety, and
recovery promises. Instantiate the five feature-contract aliases once per named feature and preserve each
feature as a distinct subject within the Product.

- [initial-capabilities] What must the first useful version of this Product be able to do?
- [refused-use] Which attempted Product uses must be rejected?
- [feature-list] Which named features must this Product provide?
- [minimum-complete-capability] What is the smallest complete Product capability that lets a consumer finish a useful task?
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
- [accessibility-target] Which accessibility standard and conformance level must this Product meet?
- [end-to-end-evidence] Which complete Product result must be tested from trigger through final outcome?
- [accessibility-evidence] What evidence must show that this Product meets its accessibility target?
- [user-validation] Which Product behavior or experience claim must be tested with representative consumers?

## Lifecycle and Use Cases

First derive Product use and operating scenarios from accepted decisions. Ask only about a concrete-scenario
or observable-oracle blocker. For example, a Web Dashboard Product scenario may upgrade the app without
losing saved work, recover a failed session, and retire the app while preserving export commitments.

- [release-channel] How do intended consumers or connected systems receive a Product release?
- [dependency-unavailable] When a required dependency is temporarily unavailable, what must the running Product do?
- [failure-visibility] How will the affected consumer learn that the Product task failed?
- [failure-recovery] What action returns a failed Product task to a safe state?
- [deprecation-policy] How must the Product notify consumers that a supported interface or format will be retired?
- [migration-obligation] Which consumers must the Product help move when an external contract changes incompatibly?
- [desktop-restart-state] Which user work or Product state must be restored after a desktop Product restarts?
- [mobile-interruption] Which in-progress Product state must be restored after the mobile operating system pauses or closes it?
- [desktop-install] How is a desktop Product installed for its consumers?
- [desktop-update] How is a desktop Product updated without losing supported state?
- [mobile-distribution] Through which store, enterprise channel, or direct method is a mobile Product distributed?
- [package-distribution] Which registry or installation channel distributes a command-line, library, or software development kit Product?
- [data-processing-health] What signal shows that a data Product's scheduled or continuous output is complete and correct enough to use?
- [scenario-actor-source] Which actor, connected system, schedule, or lifecycle event starts this Product scenario?
- [scenario-precondition-context] What Product state and operating context must exist before the scenario starts?
- [scenario-trigger-stimulus] What exact action, event, or stimulus starts the Product scenario?
- [scenario-affected-artifact] Which Product and its Implementation participate in the scenario?
- [scenario-main-flow] What implementation-neutral interaction leads from the trigger to the Product outcome?
- [scenario-alternate-flow] Which valid alternate Product path must reach an acceptable outcome?
- [scenario-invalid-path] Which invalid Product input, state, or use must be rejected safely?
- [scenario-failure-path] Which Product dependency, runtime unit, or handoff failure must the scenario cover?
- [scenario-recovery-path] Which action and restored Product state make work safe after that failure?
- [scenario-state-data-change] Which Product state and data changes occur, and which must not occur?
- [scenario-handoff] Where does responsibility or information pass between people, Products, Implementations, or external systems?
- [scenario-observable-outcome] What can an affected person or connected system observe when the Product scenario succeeds or fails safely?
- [scenario-invariant] Which security, privacy, safety, and quality properties must remain true throughout the Product scenario?
- [abuse-lifecycle-scenario] Which realistic Product abuse path exercises the highest-consequence security, privacy, or safety duty?
- [end-of-life-lifecycle-scenario] How are Product data, access, responsibilities, dependencies, and consumer commitments closed at retirement?
