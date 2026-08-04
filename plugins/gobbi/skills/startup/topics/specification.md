# Specification Topics

Use this direct phase bank to prepare evidence-backed Specification questions for the current subject. Keep
the accepted content at design-contract level and exclude implementation tasks.

## Project

- [protected-assets] Which Project asset would cause the most harm if compromised?
  - **Owner:** Project security authority
  - **Purpose:** Prioritize protection around the Project asset whose compromise has the highest consequence.
  - **Oracle:** Accepted security analysis names the asset, compromise mode, affected parties, and ranked harm.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** protected-assets

- [threat-actor] Which person, group, or external system could realistically try to harm or misuse the Project?
  - **Owner:** Project security authority
  - **Purpose:** Bound the credible adversaries and misuse sources the Project must defend against.
  - **Oracle:** Accepted threat model names each credible actor or system, its capability, motive or trigger, and reachable attack surface.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** threat-actor

- [security-failure] Which security failure would cause the greatest Project-wide harm?
  - **Owner:** Project security authority
  - **Purpose:** Select the Project-wide security loss that drives prevention and recovery priorities.
  - **Oracle:** Accepted risk analysis identifies the failure, affected assets and parties, consequence severity, and evidence supporting its rank.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** security-failure

- [consumer-indicator] What consumer-visible measurement shows whether the running Project is delivering its intended result?
  - **Owner:** Project measurement owner
  - **Purpose:** Define the consumer-visible measure of whether the running Project delivers its intended outcome.
  - **Oracle:** Accepted measurement contract names the indicator, calculation or observation method, source, cadence, and target direction.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** consumer-indicator

- [service-objective] Which behavior visible across the Project needs a measurable reliability target?
  - **Owner:** Project reliability owner
  - **Purpose:** Convert a cross-Project behavior into a measurable reliability commitment.
  - **Oracle:** Accepted service objective names the behavior, indicator, target, measurement window, and allowed failure budget.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** service-objective

- [operational-runbook] Which high-risk Project operating task needs written, tested instructions?
  - **Owner:** Project operations owner
  - **Purpose:** Ensure the riskiest recurring operating task has a tested recovery-ready procedure.
  - **Oracle:** Accepted runbook names the task, prerequisites, ordered actions, stop or rollback points, owners, and dated rehearsal evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** operational-runbook

- [quality-scenario] For the Project's highest-priority quality, what operating situation shows what that quality must achieve?
  - **Owner:** Project quality authority
  - **Purpose:** Make the highest-priority quality concrete under a representative operating condition.
  - **Oracle:** Accepted scenario records source, stimulus, environment, affected artifact, response, and measurable response target.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** quality-scenario
  - **Example:** For example, a dependency fails and affected work recovers safely.

- [quality-threshold] What measurable result marks the minimum acceptable level for that Project quality?
  - **Owner:** Project quality authority
  - **Purpose:** Set the minimum pass boundary for the Project’s priority quality.
  - **Oracle:** Accepted quality contract records the metric, threshold, measurement conditions, and pass/fail rule.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** quality-threshold

- [threshold-basis] Which evidence or authoritative source justifies the chosen quality threshold?
  - **Owner:** Project quality authority
  - **Purpose:** Preserve why a quality threshold is defensible and changeable only with stronger evidence.
  - **Oracle:** Accepted rationale cites the authoritative source or measurement, its applicability, and the inference to the chosen threshold.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** threshold-basis

- [allowed-degradation] When Project resources are limited, which quality may be reduced first?
  - **Owner:** Project reliability owner
  - **Purpose:** Order graceful-degradation choices before resource pressure forces an unsafe trade.
  - **Oracle:** Accepted degradation policy ranks reducible qualities, states trigger conditions and limits, and names the protected behavior.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** allowed-degradation

- [protected-quality] Which quality must remain at its required level even when a Product is overloaded or failing?
  - **Owner:** Project reliability owner
  - **Purpose:** Identify the quality invariant that overload or partial failure may not sacrifice.
  - **Oracle:** Accepted reliability contract names the quality, required level, applicable failure states, and verification evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** protected-quality

- [verification-strategy] For each important Project claim, what level of testing, review, observation, or rehearsal supports it?
  - **Owner:** Project validation authority
  - **Purpose:** Assign proportionate evidence to every consequential Project claim.
  - **Oracle:** Accepted claim ledger maps each important claim to a test, review, observation, or rehearsal, its owner, and pass condition.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** verification-strategy

- [product-authority] Who has final authority over Product direction across the Project?
  - **Owner:** Project governance authority
  - **Purpose:** Establish the final decision-maker for Product direction across the Project.
  - **Oracle:** Accepted governance record names one authorized role or person, its decision scope, escalation path, and effective date.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** product-authority

- [technical-authority] Who has final authority over technical direction across the Project?
  - **Owner:** Project governance authority
  - **Purpose:** Establish the final decision-maker for cross-Project technical direction.
  - **Oracle:** Accepted governance record names one authorized role or person, technical scope, escalation path, and effective date.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** technical-authority

- [data-contract-owner] Who may approve a data-contract change that current consumers cannot use without changing?
  - **Owner:** Project data governance authority
  - **Purpose:** Assign approval authority for breaking data-contract changes.
  - **Oracle:** Accepted ownership record names the authorized approver, covered contracts, breaking-change test, and escalation route.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** data-contract-owner

- [data-quality-owner] Who decides whether Project data meets the requirements for its intended use?
  - **Owner:** Project data governance authority
  - **Purpose:** Assign accountability for data fitness decisions.
  - **Oracle:** Accepted ownership record names the decision-maker, covered data, fitness criteria, and rejection or remediation route.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** data-quality-owner

- [license-model] Which license governs the Project's software?
  - **Owner:** Project legal authority
  - **Purpose:** Fix the legal terms under which Project software may be used, changed, and redistributed.
  - **Oracle:** Accepted license decision identifies the exact license and version or exception, covered artifacts, and legal approval evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** license-model

- [distribution-model] How may the Project's Products be distributed?
  - **Owner:** Project release authority
  - **Purpose:** Bound the approved channels and recipients for Project Product distribution.
  - **Oracle:** Accepted distribution contract names each channel, artifact, audience, access condition, and prohibited route.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** distribution-model

- [governance-model] What process resolves disputed Project decisions?
  - **Owner:** Project governance authority
  - **Purpose:** Define how disputed Project decisions reach an authorized resolution.
  - **Oracle:** Accepted governance process records decision classes, participants, quorum or authority, escalation, record location, and time bound.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** governance-model

- [legal-constraint] Which law or contractual obligation limits the Project?
  - **Owner:** Project legal authority
  - **Purpose:** Carry binding law or contract limits into Project scope and acceptance.
  - **Oracle:** Accepted constraint record cites the law or contract clause, jurisdiction or parties, affected behavior, and compliance evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** legal-constraint

- [regulatory-constraint] Which industry regulation or regulatory rule limits the Project?
  - **Owner:** Project compliance authority
  - **Purpose:** Carry applicable industry rules into Project scope and acceptance.
  - **Oracle:** Accepted constraint record cites the regulator and rule, applicability basis, affected behavior, and required evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** regulatory-constraint

- [budget-constraint] Which spending limit constrains Project scope or choices?
  - **Owner:** Project funding authority
  - **Purpose:** Set the spending ceiling that bounds Project scope and choices.
  - **Oracle:** Accepted funding record states amount, currency, covered period and costs, approver, and variance rule.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** budget-constraint

- [schedule-constraint] Which required date constrains Project scope or delivery?
  - **Owner:** Project delivery authority
  - **Purpose:** Set the externally required date that constrains scope or sequencing.
  - **Oracle:** Accepted schedule record names the date, required outcome, source of obligation, and consequence of missing it.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** schedule-constraint

- [available-time] How much time can each confirmed contributor spend on the Project, and during what period?
  - **Owner:** Project staffing authority
  - **Purpose:** Quantify confirmed contributor capacity before scope is committed.
  - **Oracle:** Accepted capacity record lists each confirmed contributor or role, available effort, date range, and competing commitments.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** available-time

- [available-systems] Which required systems are currently unavailable or inaccessible?
  - **Owner:** Project delivery authority
  - **Purpose:** Expose unavailable dependencies that constrain design or delivery.
  - **Oracle:** Accepted dependency record names each unavailable system, needed capability or access, blocker owner, and expected resolution evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** available-systems

- [operational-owner] Who owns routine operation of the Project service?
  - **Owner:** Project operations authority
  - **Purpose:** Assign accountability for routine service operation.
  - **Oracle:** Accepted responsibility record names one accountable role or person, covered services, duties, hours or handoff, and escalation path.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** operational-owner

- [incident-owner] Who coordinates response to a cross-Product incident?
  - **Owner:** Project incident authority
  - **Purpose:** Assign command authority for incidents crossing Product boundaries.
  - **Oracle:** Accepted incident plan names the coordinator role, activation trigger, authority, communication route, and backup.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** incident-owner

- [risk-owner] Who is accountable for monitoring and responding to the highest-consequence Project risk?
  - **Owner:** Project risk authority
  - **Purpose:** Assign accountability for monitoring and treating the highest-consequence Project risk.
  - **Oracle:** Accepted risk register names the owner, risk, indicators, review cadence, treatment authority, and escalation trigger.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** risk-owner

- [missing-authority] Which open Project decision currently has no authorized decision-maker?
  - **Owner:** Project governance authority
  - **Purpose:** Surface decisions that cannot close because no authorized owner exists.
  - **Oracle:** Accepted authority-gap record names each decision, required authority, current impact, interim restriction, and assignment action.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** missing-authority

- [primary-maintainer] Who owns ongoing maintenance of the Project?
  - **Owner:** Project maintenance authority
  - **Purpose:** Assign ongoing responsibility for Project upkeep.
  - **Oracle:** Accepted maintenance record names one primary maintainer, covered duties, response expectations, access, and effective period.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** primary-maintainer

- [backup-maintainer] Who can continue maintenance when the primary maintainer is unavailable?
  - **Owner:** Project maintenance authority
  - **Purpose:** Preserve maintenance continuity when the primary maintainer is absent.
  - **Oracle:** Accepted continuity record names a capable backup, activation condition, required access, and successful handoff or rehearsal evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** backup-maintainer

- [hidden-knowledge] Which essential Project task or decision depends on knowledge held by only one person?
  - **Owner:** Project continuity owner
  - **Purpose:** Find single-person knowledge dependencies before they block maintenance.
  - **Oracle:** Accepted knowledge-risk record names the task or decision, sole holder, failure consequence, and transfer or documentation evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** hidden-knowledge

- [maintenance-end-evidence] What evidence would justify ending active maintenance of the Project?
  - **Owner:** Project governance authority
  - **Purpose:** Define the evidence needed to end active maintenance responsibly.
  - **Oracle:** Accepted retirement criteria state usage, dependency, risk, support, archival, communication, and approval conditions with measurable gates.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** maintenance-end-evidence

- [continuity-documentation] Which document must another maintainer be able to follow to continue the Project?
  - **Owner:** Project continuity owner
  - **Purpose:** Identify the document that lets another maintainer continue the Project safely.
  - **Oracle:** Accepted continuity test names the document and records a dated walkthrough or rehearsal completed by a non-author maintainer.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** continuity-documentation

- [policy-purpose] What risk or recurring decision makes each binding Project policy necessary?
  - **Owner:** Project policy authority
  - **Purpose:** Tie each binding policy to a specific risk or recurring decision.
  - **Oracle:** Accepted policy record names the risk or decision, affected outcome, and evidence that the policy addresses it.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** policy-purpose

- [policy-scope] Which people, artifacts, environments, and actions does each policy govern?
  - **Owner:** Project policy authority
  - **Purpose:** Bound who and what each policy governs.
  - **Oracle:** Accepted policy names included people, artifacts, environments, actions, explicit exclusions, and applicability trigger.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** policy-scope

- [policy-authority] Who may establish, interpret, change, and retire each policy?
  - **Owner:** Project governance authority
  - **Purpose:** Assign legitimate authority over each policy’s lifecycle and interpretation.
  - **Oracle:** Accepted policy names the role allowed to establish, interpret, change, and retire it, plus escalation and approval evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** policy-authority

- [policy-enforcement-evidence] What observable evidence proves that each policy was followed?
  - **Owner:** Project compliance authority
  - **Purpose:** Define observable proof that each binding policy is followed.
  - **Oracle:** Accepted policy maps each requirement to an auditable record, test, review, or control, including custodian and retention.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** policy-enforcement-evidence

- [policy-exception] Who may approve a policy exception, under which conditions, and how is it recorded?
  - **Owner:** Project policy authority
  - **Purpose:** Control when and how a policy exception may be granted.
  - **Oracle:** Accepted exception process names the approver, eligibility conditions, required rationale, compensating control, expiry, and record location.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** policy-exception

- [policy-review-change] Which event or interval triggers policy review, and how does an approved change reach affected subjects?
  - **Owner:** Project policy authority
  - **Purpose:** Ensure policies are reviewed and approved changes reach every affected subject.
  - **Oracle:** Accepted lifecycle record states review event or interval, change authority, versioning, notification route, acknowledgement evidence, and effective date.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** policy-review-change

- [policy-retirement] What evidence makes each policy unnecessary or unsafe to retain?
  - **Owner:** Project policy authority
  - **Purpose:** Define when a policy must be retired instead of silently retained.
  - **Oracle:** Accepted retirement rule names evidence of redundancy or harm, required approver, replacement or rollback, archive, and notification evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** policy-retirement

## Product

- [initial-capabilities] What must the first useful version of this Product be able to do?
  - **Owner:** Product authority
  - **Purpose:** Bound the first release to the capabilities needed for useful operation.
  - **Oracle:** Accepted release scope lists each required capability, its consumer outcome, exclusions, and acceptance evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** initial-capabilities

- [refused-use] Which attempted Product uses must be rejected?
  - **Owner:** Product safety authority
  - **Purpose:** Define attempted uses the Product must actively reject.
  - **Oracle:** Accepted safety contract lists each refused use, detection condition, response, consumer feedback, and no-harm invariant.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** refused-use

- [feature-list] Which named features must this Product provide?
  - **Owner:** Product authority
  - **Purpose:** Establish the named feature inventory for Product scope and traceability.
  - **Oracle:** Accepted feature register gives each feature a unique name, outcome, owner, release disposition, and link to its acceptance contract.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** feature-list

- [minimum-complete-capability] What is the smallest complete Product capability that lets a consumer finish a useful task?
  - **Owner:** Product authority
  - **Purpose:** Select the smallest end-to-end capability that delivers one useful consumer outcome.
  - **Oracle:** Accepted capability contract names trigger, prerequisites, complete path, observable finish, exclusions, and representative-user evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** minimum-complete-capability
  - **Example:** For example, a consumer creates and later recovers one saved result.

- [feature-prerequisite] What must already exist or be true before this feature can work?
  - **Owner:** Product contract owner
  - **Purpose:** State the dependencies and preconditions required before a feature can start.
  - **Oracle:** Accepted feature contract lists each prerequisite, its authoritative source, validation check, and failure response.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** feature-prerequisite

- [feature-start] Which consumer action, system event, or schedule starts this feature?
  - **Owner:** Product contract owner
  - **Purpose:** Define the unambiguous trigger that begins a feature.
  - **Oracle:** Accepted feature contract names the initiating action, event, or schedule and an observable start condition.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** feature-start

- [feature-finish] What can a consumer observe to know this feature finished successfully?
  - **Owner:** Product contract owner
  - **Purpose:** Define the observable completion condition for a feature.
  - **Oracle:** Accepted feature contract records the final state or output, consumer-visible confirmation, and pass/fail evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** feature-finish

- [feature-handoff] At what point does this feature pass responsibility to another person, Product, or external system?
  - **Owner:** Product contract owner
  - **Purpose:** Locate responsibility transfer in a cross-person or cross-system feature path.
  - **Oracle:** Accepted interaction contract names the handoff point, sender, receiver, payload or state, acknowledgement, and failure owner.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** feature-handoff

- [feature-worst-failure] Which failure during this feature would have the greatest consequence?
  - **Owner:** Product risk owner
  - **Purpose:** Identify the feature failure that drives safeguards and recovery.
  - **Oracle:** Accepted risk record names the failure, affected parties or state, severity basis, detection signal, safeguard, and recovery route.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** feature-worst-failure

- [success-feedback] What should the Product interface show or return first to confirm success?
  - **Owner:** Product interaction designer
  - **Purpose:** Specify the first confirmation that a Product action succeeded.
  - **Oracle:** Accepted interaction contract records the returned or displayed feedback, timing, resulting state, and representative-user comprehension evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** success-feedback

- [information-priority] What information must a consumer see before an important Product-supported decision?
  - **Owner:** Product interaction designer
  - **Purpose:** Put decision-critical information before the consumer must act.
  - **Oracle:** Accepted design evidence identifies the decision, required information, presentation order and timing, and representative-user finding.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** information-priority

- [result-explanation] Which consequential Product result needs an explanation of how it was reached?
  - **Owner:** Product transparency owner
  - **Purpose:** Define which consequential results require an understandable rationale.
  - **Oracle:** Accepted explanation contract names the result, audience, factors or provenance shown, limits disclosed, and comprehension evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** result-explanation

- [error-action] After a Product error, what must the affected consumer be able to do next?
  - **Owner:** Product interaction designer
  - **Purpose:** Preserve a clear recovery action after a Product error.
  - **Oracle:** Accepted error contract names the error state, consumer-facing message, available next action, state preserved, and recovery test.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** error-action

- [destructive-safeguard] What safeguard must protect people or state from a hard-to-reverse Product action?
  - **Owner:** Product safety authority
  - **Purpose:** Prevent accidental or unauthorized hard-to-reverse Product actions.
  - **Oracle:** Accepted safeguard contract names the action, authorization or confirmation, preview or backup, cancellation or undo, and failure test.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** destructive-safeguard

- [accessibility-needs] Which needs of consumers with disabilities must shape the first useful Product version?
  - **Owner:** Product accessibility authority
  - **Purpose:** Carry representative disability access needs into first-release scope.
  - **Oracle:** Accepted accessibility research identifies affected consumers, tasks, barriers, required accommodations, and traceable capability decisions.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** accessibility-needs

- [data-retention] For each important Product data category, how long must it remain available?
  - **Owner:** Product data steward
  - **Purpose:** Define how long Product data remains available for its operational purpose.
  - **Oracle:** Accepted retention schedule lists each data category, availability period, start event, archive or deletion action, and accountable owner.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** data-retention

- [data-export-contract] Which exported formats, fields, meanings, or behaviors must remain compatible for Product consumers?
  - **Owner:** Product data-contract owner
  - **Purpose:** Preserve consumer compatibility for exported Product data.
  - **Oracle:** Accepted export contract versions formats, fields, meanings, encoding, ordering or behavior, compatibility window, and conformance fixtures.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** data-export-contract

- [external-contract] What Product behavior, input, output, or interface must remain stable because consumers rely on it?
  - **Owner:** Product contract authority
  - **Purpose:** Identify relied-on Product behavior that changes only under an explicit compatibility process.
  - **Oracle:** Accepted public contract names input, output or behavior, consumers, stability promise, version or migration rule, and conformance evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** external-contract

- [compatibility-boundary] Which current Product behavior must continue working after the Product changes?
  - **Owner:** Product contract authority
  - **Purpose:** Bound which current Product behavior must survive change.
  - **Oracle:** Accepted compatibility record lists protected behavior and consumers, supported change window, allowed break process, and regression evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** compatibility-boundary

- [invalid-input] How must the Product respond to invalid input?
  - **Owner:** Product safety authority
  - **Purpose:** Define predictable Product behavior for invalid input.
  - **Oracle:** Accepted input contract enumerates invalid classes, rejection or normalization, state effect, consumer feedback, and tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** invalid-input

- [partial-state] How must the Product respond when only part of an operation succeeds?
  - **Owner:** Product resilience owner
  - **Purpose:** Keep partial success observable, bounded, and recoverable.
  - **Oracle:** Accepted operation contract identifies atomic and partial outcomes, committed state, compensation or resume action, feedback, and failure tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** partial-state

- [misuse-response] How must the Product respond safely to an explicitly unsupported use?
  - **Owner:** Product safety authority
  - **Purpose:** Define safe behavior for known unsupported use.
  - **Oracle:** Accepted misuse contract names the use, detection, refusal or containment behavior, feedback, protected invariant, and test.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** misuse-response

- [versioning-policy] Which public Product interface or data format must carry a version?
  - **Owner:** Product contract authority
  - **Purpose:** Ensure evolving public interfaces and data formats expose compatibility identity.
  - **Oracle:** Accepted versioning policy names covered contracts, version syntax, compatibility semantics, change triggers, and migration or deprecation evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** versioning-policy

- [web-direct-link] When someone opens a saved or shared Product URL directly, which page and state must appear?
  - **Owner:** Product web-platform owner
  - **Purpose:** Preserve the intended page and state for direct entry through a saved or shared URL.
  - **Oracle:** Accepted routing contract maps representative URLs to page, identity or authorization handling, state restoration, not-found behavior, and browser tests.
  - **Activation evidence:** Accepted evidence classifies a Web Product or browser runtime and shows this Web contract applies.
  - **Source aliases:** web-direct-link

- [web-navigation-continuity] When a consumer uses browser Back or Forward, which Product state must remain correct?
  - **Owner:** Product web-platform owner
  - **Purpose:** Preserve correct Product state across browser history navigation.
  - **Oracle:** Accepted navigation contract identifies history entries, state reconstructed or retained, unsaved-work behavior, and Back/Forward tests.
  - **Activation evidence:** Accepted evidence classifies a Web Product or browser runtime and shows this Web contract applies.
  - **Source aliases:** web-navigation-continuity

- [web-refresh-continuity] Which entered data or in-progress Product task must survive a refresh?
  - **Owner:** Product web-platform owner
  - **Purpose:** Decide which in-progress work survives a page refresh.
  - **Oracle:** Accepted continuity contract lists preserved and discarded state, storage authority and lifetime, recovery feedback, and refresh tests.
  - **Activation evidence:** Accepted evidence classifies a Web Product or browser runtime and shows this Web contract applies.
  - **Source aliases:** web-refresh-continuity

- [web-storage-lifetime] How long may browser-stored Product data be reused before refresh or removal?
  - **Owner:** Product data steward
  - **Purpose:** Bound reuse and removal of browser-stored Product data.
  - **Oracle:** Accepted browser-data contract names each store and category, reuse period, refresh or deletion trigger, privacy basis, and tests.
  - **Activation evidence:** Accepted evidence classifies a Web Product or browser runtime and shows this Web contract applies.
  - **Source aliases:** web-storage-lifetime

- [web-browser-support] Which browsers and versions must this Product support?
  - **Owner:** Product web-platform owner
  - **Purpose:** Fix the browser compatibility matrix and support window.
  - **Oracle:** Accepted support policy names browser families and minimum versions, support duration, test matrix, and unsupported-browser behavior.
  - **Activation evidence:** Accepted evidence classifies a Web Product or browser runtime and shows this Web contract applies.
  - **Source aliases:** web-browser-support

- [web-offline-promise] Which Product task must work without a network connection?
  - **Owner:** Product web-platform owner
  - **Purpose:** Bound useful Product behavior without network access.
  - **Oracle:** Accepted offline contract names supported tasks and data, entry conditions, stale-state signal, synchronization or conflict behavior, and offline tests.
  - **Activation evidence:** Accepted evidence classifies a Web Product or browser runtime and shows this Web contract applies.
  - **Source aliases:** web-offline-promise

- [desktop-os-integration] Which operating-system feature must a desktop Product support?
  - **Owner:** Product desktop-platform owner
  - **Purpose:** Select required operating-system integrations for a desktop Product.
  - **Oracle:** Accepted integration contract names each OS capability, supported targets, permission or lifecycle behavior, fallback, and platform tests.
  - **Activation evidence:** Accepted evidence classifies an installed Desktop Product and shows this Desktop contract applies.
  - **Source aliases:** desktop-os-integration

- [mobile-form-factor] Which in-progress Product task must continue across device size, orientation, or form changes?
  - **Owner:** Product mobile-platform owner
  - **Purpose:** Preserve task continuity through mobile size, orientation, or form changes.
  - **Oracle:** Accepted adaptive-behavior contract identifies affected tasks, state and layout invariants, interruption behavior, and device-class tests.
  - **Activation evidence:** Accepted evidence classifies a Mobile Product and shows the named form, OS, or permission contract applies.
  - **Source aliases:** mobile-form-factor

- [desktop-target-os] Which desktop operating systems and versions must this Product support, and for how long?
  - **Owner:** Product desktop-platform owner
  - **Purpose:** Fix supported desktop operating systems, versions, and retirement window.
  - **Oracle:** Accepted support policy names OS families and minimum versions, architecture where material, support period, test evidence, and deprecation rule.
  - **Activation evidence:** Accepted evidence classifies an installed Desktop Product and shows this Desktop contract applies.
  - **Source aliases:** desktop-target-os

- [mobile-target-os] Which mobile operating systems and versions must this Product support, and for how long?
  - **Owner:** Product mobile-platform owner
  - **Purpose:** Fix supported mobile operating systems, versions, and retirement window.
  - **Oracle:** Accepted support policy names OS families and minimum versions, device constraints where material, support period, test evidence, and deprecation rule.
  - **Activation evidence:** Accepted evidence classifies a Mobile Product and shows the named form, OS, or permission contract applies.
  - **Source aliases:** mobile-target-os

- [cli-invocation-contract] Which command names, arguments, options, and input behaviors must remain compatible?
  - **Owner:** Product CLI contract owner
  - **Purpose:** Preserve compatible command invocation for human and automated consumers.
  - **Oracle:** Accepted CLI contract versions command names, arguments, options, input sources, parsing rules, deprecation window, and conformance tests.
  - **Activation evidence:** Accepted evidence classifies an independently useful CLI Product and shows this CLI contract applies.
  - **Source aliases:** cli-invocation-contract

- [cli-machine-output] Which command output formats are consumed by scripts or automation?
  - **Owner:** Product CLI contract owner
  - **Purpose:** Preserve script-consumable command output independently of display prose.
  - **Oracle:** Accepted CLI contract names machine formats, schemas, stream choice, versioning, stability promise, and fixture-based tests.
  - **Activation evidence:** Accepted evidence classifies an independently useful CLI Product and shows this CLI contract applies.
  - **Source aliases:** cli-machine-output

- [cli-exit-status] Which command outcomes need distinct process exit codes?
  - **Owner:** Product CLI contract owner
  - **Purpose:** Give automation stable status distinctions for command outcomes.
  - **Oracle:** Accepted CLI contract maps each outcome class to an exit code, stdout/stderr behavior, and executable tests.
  - **Activation evidence:** Accepted evidence classifies an independently useful CLI Product and shows this CLI contract applies.
  - **Source aliases:** cli-exit-status

- [library-public-contract] Which public functions, classes, types, or behaviors must current library or software development kit consumers retain?
  - **Owner:** Product library API owner
  - **Purpose:** Preserve the callable contract relied on by library or SDK consumers.
  - **Oracle:** Accepted API contract versions exported functions, classes, types and behavior, runtime errors, compatibility window, and consumer or conformance tests.
  - **Activation evidence:** Accepted evidence classifies a library or SDK Product consumed through a public callable contract.
  - **Source aliases:** library-public-contract

- [network-standard] Which published protocol or networking standard must this Product follow?
  - **Owner:** Product protocol authority
  - **Purpose:** Fix the published protocol or networking standard the Product implements.
  - **Oracle:** Accepted protocol record cites exact standard, edition and profiles or options, applicability, deviations, and conformance evidence.
  - **Activation evidence:** Accepted evidence classifies a network or protocol Product and shows this peer contract applies.
  - **Source aliases:** network-standard

- [network-peer-compatibility] Which devices, services, or software must exchange protocol messages successfully with this Product?
  - **Owner:** Product protocol authority
  - **Purpose:** Bound the peers with which the Product must interoperate.
  - **Oracle:** Accepted interoperability matrix names peer products or device classes and versions, message paths, required outcomes, and test evidence.
  - **Activation evidence:** Accepted evidence classifies a network or protocol Product and shows this peer contract applies.
  - **Source aliases:** network-peer-compatibility

- [network-registry] Which official registry controls named or numbered protocol values?
  - **Owner:** Product protocol authority
  - **Purpose:** Use the authoritative registry for protocol names and numeric values.
  - **Oracle:** Accepted protocol record cites the registry and namespace, assigned or reserved values, allocation status, and automated validation where possible.
  - **Activation evidence:** Accepted evidence classifies a network or protocol Product and shows this peer contract applies.
  - **Source aliases:** network-registry

- [network-negotiation] Which supported features or versions must protocol peers agree on?
  - **Owner:** Product protocol authority
  - **Purpose:** Define how peers choose a mutually supported protocol feature or version.
  - **Oracle:** Accepted negotiation contract lists advertised values, selection rule, downgrade or incompatibility response, protected invariant, and peer tests.
  - **Activation evidence:** Accepted evidence classifies a network or protocol Product and shows this peer contract applies.
  - **Source aliases:** network-negotiation

- [authorization-rule] Which rule decides whether a consumer or connected system may perform a Product action?
  - **Owner:** Product authorization authority
  - **Purpose:** Decide who or what may perform each protected Product action.
  - **Oracle:** Accepted authorization matrix maps subject attributes or roles and resource conditions to allow/deny outcomes, default behavior, and tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** authorization-rule

- [audit-evidence] Which sensitive Product action must leave a protected audit record?
  - **Owner:** Product security authority
  - **Purpose:** Preserve tamper-resistant evidence for sensitive Product actions.
  - **Oracle:** Accepted audit contract names actions, actor and target fields, time and outcome, integrity control, access and retention, and audit tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** audit-evidence

- [abuse-case] Which realistic misuse of this Product could cause serious harm?
  - **Owner:** Product abuse-risk owner
  - **Purpose:** Select realistic harmful misuse that Product controls must address.
  - **Oracle:** Accepted abuse case names actor, path, preconditions, harmed party or asset, severity basis, prevention or containment, and validation evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** abuse-case

- [safe-failure] After a serious Product failure, what condition must remain true to avoid harm?
  - **Owner:** Product safety authority
  - **Purpose:** Define the invariant that must survive a serious Product failure.
  - **Oracle:** Accepted failure contract states the invariant, covered failures, containment and recovery behavior, observable signal, and fault-injection or rehearsal evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** safe-failure

- [personal-data] Which personal or sensitive data does this Product collect, receive, store, or transmit?
  - **Owner:** Product privacy authority
  - **Purpose:** Inventory personal and sensitive data crossing the Product boundary.
  - **Oracle:** Accepted data inventory lists each category, source, purpose, processing, storage, recipient, location, sensitivity, and lawful or policy basis.
  - **Activation evidence:** Accepted evidence shows personal or sensitive data crosses the Product boundary; otherwise record evidence-backed not-applicable.
  - **Source aliases:** personal-data

- [data-minimization] Which collected Product data is unnecessary for its intended result?
  - **Owner:** Product privacy authority
  - **Purpose:** Remove personal or sensitive data not needed for the intended outcome.
  - **Oracle:** Accepted minimization review maps each collected field to a necessary purpose and records removal, aggregation, or approved justification for every excess item.
  - **Activation evidence:** Accepted evidence shows personal or sensitive data crosses the Product boundary; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-minimization

- [consent-duty] Which Product collection or use of personal data requires consent?
  - **Owner:** Product privacy authority
  - **Purpose:** Identify personal-data processing that requires valid consent.
  - **Oracle:** Accepted consent contract names processing purpose and data, affected people, capture and withdrawal mechanism, evidence retained, and jurisdiction or policy basis.
  - **Activation evidence:** Accepted evidence shows personal or sensitive data crosses the Product boundary; otherwise record evidence-backed not-applicable.
  - **Source aliases:** consent-duty

- [privacy-retention] Which law, policy, or commitment limits Product retention of personal or sensitive data?
  - **Owner:** Product privacy authority
  - **Purpose:** Cap retention of personal or sensitive data under law, policy, or commitment.
  - **Oracle:** Accepted privacy schedule cites the governing basis, category, maximum period, start event, exception, disposal method, and proof of deletion.
  - **Activation evidence:** Accepted evidence shows personal or sensitive data crosses the Product boundary; otherwise record evidence-backed not-applicable.
  - **Source aliases:** privacy-retention

- [privacy-deletion] Which request, deadline, or lifecycle event requires the Product to delete personal or sensitive data?
  - **Owner:** Product privacy authority
  - **Purpose:** Define requests and lifecycle events that require protected-data deletion.
  - **Oracle:** Accepted deletion contract names trigger, deadline, covered stores and copies, exceptions, verification method, consumer response, and audit evidence.
  - **Activation evidence:** Accepted evidence shows personal or sensitive data crosses the Product boundary; otherwise record evidence-backed not-applicable.
  - **Source aliases:** privacy-deletion

- [data-disclosure] Under what approved condition may the Product share protected data outside its current trust boundary?
  - **Owner:** Product privacy authority
  - **Purpose:** Control release of protected data beyond its current trust boundary.
  - **Oracle:** Accepted disclosure rule names recipient, purpose, data, authorization or legal basis, minimization, transfer protection, record, and denial behavior.
  - **Activation evidence:** Accepted evidence shows personal or sensitive data crosses the Product boundary; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-disclosure

- [mobile-permission] Which Product capability requires access to sensitive device features or user data?
  - **Owner:** Product mobile-platform owner
  - **Purpose:** Map sensitive device access to the Product capability that requires it.
  - **Oracle:** Accepted permission matrix names capability, platform permission, access timing, data or device feature reached, and denied-state behavior.
  - **Activation evidence:** Accepted evidence classifies a Mobile Product and shows the named form, OS, or permission contract applies.
  - **Source aliases:** mobile-permission

- [mobile-permission-purpose] What user-visible benefit justifies each sensitive permission request?
  - **Owner:** Product privacy authority
  - **Purpose:** Give each sensitive mobile permission a concrete user-visible benefit.
  - **Oracle:** Accepted permission rationale links every requested permission to a necessary feature and plain-language just-in-time explanation, with review evidence.
  - **Activation evidence:** Accepted evidence classifies a Mobile Product and shows the named form, OS, or permission contract applies.
  - **Source aliases:** mobile-permission-purpose

- [mobile-permission-revocation] If permission is revoked, which Product capabilities must still work?
  - **Owner:** Product mobile-platform owner
  - **Purpose:** Preserve safe and useful behavior after a mobile permission is removed.
  - **Oracle:** Accepted permission contract lists capabilities retained, degraded, blocked, or recoverable after revocation, state handling, feedback, and device tests.
  - **Activation evidence:** Accepted evidence classifies a Mobile Product and shows the named form, OS, or permission contract applies.
  - **Source aliases:** mobile-permission-revocation

- [service-workload-range] What request or job range and pattern must a service Product handle correctly?
  - **Owner:** Product service owner
  - **Purpose:** Bound service correctness across expected and exceptional demand.
  - **Oracle:** Accepted workload contract specifies request or job mix, rates, bursts, concurrency, payload ranges, duration, overload behavior, and measured evidence.
  - **Activation evidence:** Accepted evidence classifies a service Product with measurable request or job demand.
  - **Source aliases:** service-workload-range
  - **Example:** For example, include steady demand and a short burst.

- [accessibility-target] Which accessibility standard and conformance level must this Product meet?
  - **Owner:** Product accessibility authority
  - **Purpose:** Fix the accessibility standard and conformance level for acceptance.
  - **Oracle:** Accepted accessibility contract cites the exact standard, version, level, covered surfaces and exceptions, and accountable approval.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** accessibility-target

- [end-to-end-evidence] Which complete Product result must be tested from trigger through final outcome?
  - **Owner:** Product validation authority
  - **Purpose:** Select the complete Product outcomes requiring trigger-to-result proof.
  - **Oracle:** Accepted evidence plan maps each selected outcome to representative environment, data and actor, full path, observable result, and executable or rehearsed test.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** end-to-end-evidence

- [accessibility-evidence] What evidence must show that this Product meets its accessibility target?
  - **Owner:** Product accessibility authority
  - **Purpose:** Define proof that the Product meets its accessibility target.
  - **Oracle:** Accepted evidence set maps applicable criteria to automated checks, expert review and representative assistive-technology or user testing, with findings resolved.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** accessibility-evidence

- [user-validation] Which Product behavior or experience claim must be tested with representative consumers?
  - **Owner:** Product research owner
  - **Purpose:** Identify consequential behavior or experience claims needing representative-consumer validation.
  - **Oracle:** Accepted research plan names each claim, representative participants and tasks, method, success or disconfirming evidence, and recorded findings.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** user-validation

- [release-channel] Which supported channel lets each intended consumer or connected system obtain and identify a Product release?
  - **Owner:** Product distribution-contract owner
  - **Purpose:** Map each intended consumer or system to a supported acquisition channel and release identity
  - **Oracle:** Each intended consumer obtains and identifies the supported release, or gets an explicit unsupported refusal
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** release-channel,package-distribution,mobile-distribution

## Implementation

- [supported-versions] Which versions of every required stack entry must this Implementation support, and for how long?
  - **Owner:** Implementation release authority
  - **Purpose:** Fix supported versions and support windows for every required stack entry.
  - **Oracle:** Accepted support matrix names each stack entry, supported version range, start and end dates or policy, test coverage, and deprecation rule.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** supported-versions

- [environment-model] Which development, test, staging, production, or other environment differences change Implementation behavior or risk?
  - **Owner:** Implementation environment owner
  - **Purpose:** Expose environment differences that alter behavior, evidence, or risk.
  - **Oracle:** Accepted environment matrix lists each environment, purpose, authoritative differences, data and access boundaries, promotion path, and parity tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** environment-model

- [configuration-source] Which file, service, or system is authoritative for runtime configuration?
  - **Owner:** Implementation configuration authority
  - **Purpose:** Establish one authoritative source and precedence model for runtime configuration.
  - **Oracle:** Accepted configuration contract names sources, precedence, validation, reload or restart behavior, secret handling, and provenance visible at runtime.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** configuration-source

- [runtime-restriction] Which network, locality, regional, resource, or other operating restriction changes what this Implementation must support?
  - **Owner:** Implementation platform authority
  - **Purpose:** Carry operating constraints into implementation support and acceptance.
  - **Oracle:** Accepted runtime matrix lists each network, locality, regional, resource or platform restriction, affected behavior, fallback or refusal, and tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** runtime-restriction

- [same-result-on-repeat] Which Implementation operation must reach the same end state when repeated with the same request?
  - **Owner:** Implementation domain authority
  - **Purpose:** Identify operations whose repeated identical request must preserve one end state.
  - **Oracle:** Accepted operation contract defines request identity, repeated-call state and result, side-effect rule, concurrency boundary, and repeat tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** same-result-on-repeat

- [consistency-promise] When the same data appears in several places, what agreement or update timing must the Implementation preserve?
  - **Owner:** Implementation data architect
  - **Purpose:** Define agreement and visibility timing across copies of the same data.
  - **Oracle:** Accepted consistency contract identifies copies, authoritative value, read/write guarantees, staleness bound, conflict rule, and concurrent tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** consistency-promise
  - **Example:** For example, a reader may see stale data until the next refresh.

- [stored-data-evolution] What compatibility must the Implementation preserve when stored data format or meaning changes?
  - **Owner:** Implementation data architect
  - **Purpose:** Preserve usable stored state across format or meaning changes.
  - **Oracle:** Accepted evolution contract versions schemas or semantics, names supported source versions, migration and rollback behavior, and upgrade/downgrade fixtures.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** stored-data-evolution

- [restore-evidence] What test or evidence proves that Implementation-managed data can be restored after loss?
  - **Owner:** Implementation operations owner
  - **Purpose:** Prove implementation-managed data can be recovered after loss.
  - **Oracle:** Accepted recovery evidence records backup scope and age, restore environment and steps, integrity checks, recovery targets, and dated successful rehearsal.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** restore-evidence

- [data-lineage] For which data must the Implementation trace its source and every transformation?
  - **Owner:** Implementation data steward
  - **Purpose:** Make source and transformation provenance traceable for consequential data.
  - **Oracle:** Accepted lineage record maps selected data from source through each transformation and store to outputs, with queryable identifiers and verification evidence.
  - **Activation evidence:** Accepted evidence shows evolving, event, or historical data behavior requires this temporal contract; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-lineage

- [data-timestamp-choice] Which timestamp must Implementation calculations use when an event time and arrival time differ?
  - **Owner:** Implementation data architect
  - **Purpose:** Select the time semantics used when event and arrival times differ.
  - **Oracle:** Accepted temporal contract names authoritative timestamps per calculation, timezone and precision, missing or conflicting-time behavior, and fixtures.
  - **Activation evidence:** Accepted evidence shows evolving, event, or historical data behavior requires this temporal contract; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-timestamp-choice

- [data-ordering] Which records or events must the Implementation process in order?
  - **Owner:** Implementation data architect
  - **Purpose:** Define ordering guarantees needed for correct processing.
  - **Oracle:** Accepted ordering contract names records or events, ordering key and scope, reorder buffer or rejection behavior, and out-of-order tests.
  - **Activation evidence:** Accepted evidence shows evolving, event, or historical data behavior requires this temporal contract; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-ordering

- [data-lateness] How may an earlier result change when data arrives late?
  - **Owner:** Implementation data architect
  - **Purpose:** Bound correction of prior results when data arrives late.
  - **Oracle:** Accepted lateness contract states allowed lateness, watermark or cutoff, recomputation behavior, result/version notification, and late-data tests.
  - **Activation evidence:** Accepted evidence shows evolving, event, or historical data behavior requires this temporal contract; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-lateness

- [data-duplicates] Which input records may arrive more than once without making the result incorrect?
  - **Owner:** Implementation data architect
  - **Purpose:** Prevent repeated input delivery from corrupting results.
  - **Oracle:** Accepted duplicate contract defines identity and deduplication scope or idempotent effect, retention window, conflict behavior, and duplicate tests.
  - **Activation evidence:** Accepted evidence shows evolving, event, or historical data behavior requires this temporal contract; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-duplicates

- [data-replay] Which earlier result must historical input reproduce when processed again?
  - **Owner:** Implementation data architect
  - **Purpose:** Make historical reprocessing reproduce the promised result without duplicate effects.
  - **Oracle:** Accepted replay contract names input snapshot and code/config identity, expected output equivalence, side-effect isolation, and repeatable replay evidence.
  - **Activation evidence:** Accepted evidence shows evolving, event, or historical data behavior requires this temporal contract; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-replay
  - **Example:** For example, process an earlier event again without duplicating its effect.

- [data-backfill] Which previous result may change after missing or corrected historical data is processed?
  - **Owner:** Implementation data steward
  - **Purpose:** Control which historical results may change after corrected or newly required data is processed.
  - **Oracle:** Accepted backfill plan names affected range and outputs, transformation version, validation, consumer notification, rollback, and before/after evidence.
  - **Activation evidence:** Accepted evidence shows evolving, event, or historical data behavior requires this temporal contract; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-backfill
  - **Example:** For example, populate a new field for existing records.

- [data-freshness] What signal tells a consumer that Implementation-produced data is recent enough to use?
  - **Owner:** Implementation data steward
  - **Purpose:** Give consumers an observable signal that produced data is timely enough to use.
  - **Oracle:** Accepted freshness contract defines source timestamp, age calculation and threshold, displayed or machine-readable state, stale behavior, and tests.
  - **Activation evidence:** Accepted evidence shows evolving, event, or historical data behavior requires this temporal contract; otherwise record evidence-backed not-applicable.
  - **Source aliases:** data-freshness

- [network-intended-state] Which configuration or system is authoritative for intended network state?
  - **Owner:** Implementation network authority
  - **Purpose:** Establish the authoritative declaration of desired network state.
  - **Oracle:** Accepted network contract names the source, version or generation, scope, validation, conflict precedence, and audit trail.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-intended-state

- [network-liveness] Which signal shows that a network runtime unit is running and responding?
  - **Owner:** Implementation network operator
  - **Purpose:** Define the signal used to detect responsive runtime units.
  - **Oracle:** Accepted liveness contract identifies probe or heartbeat, scope, interval, timeout, failure threshold, false-positive bound, and fault tests.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-liveness

- [network-convergence] What observable condition proves all affected runtime units reached intended network state?
  - **Owner:** Implementation network operator
  - **Purpose:** Define proof that affected units reached intended network state.
  - **Oracle:** Accepted convergence contract names compared generation or state, population and quorum if any, deadline, observable signal, and convergence tests.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-convergence

- [network-reconciliation] How must the Implementation reconcile actual and intended network state?
  - **Owner:** Implementation network architect
  - **Purpose:** Specify correction of drift between actual and intended network state.
  - **Oracle:** Accepted reconciliation contract defines comparison, action, cadence or trigger, conflict and retry rules, safe bounds, and drift tests.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-reconciliation

- [network-stale-state] How old may observed network state become before the Implementation stops relying on it?
  - **Owner:** Implementation network architect
  - **Purpose:** Stop decisions from relying on network observations older than the safe bound.
  - **Oracle:** Accepted staleness contract names observations, age source, maximum age, expired-state behavior, and clock or delay tests.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-stale-state

- [safe-retry] Which failed Implementation operation may be tried again without an incorrect or unsafe result?
  - **Owner:** Implementation domain authority
  - **Purpose:** Identify failed operations that may be repeated without unsafe or incorrect effects.
  - **Oracle:** Accepted retry contract defines eligible failures, request identity, effect invariant, limits and backoff, result interpretation, and fault tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** safe-retry

- [network-partition] Which behavior must remain safe when runtime units cannot communicate?
  - **Owner:** Implementation network architect
  - **Purpose:** Preserve named safety properties when runtime units cannot communicate.
  - **Oracle:** Accepted partition contract states protected invariants, allowed availability loss or degradation, reconciliation after healing, and partition tests.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-partition

- [cli-execution-support] Which operating systems and command shells must the Implementation support for a command-line Product?
  - **Owner:** Implementation CLI platform owner
  - **Purpose:** Fix operating-system and shell support for a command-line Product.
  - **Oracle:** Accepted CLI support matrix names OS, architecture and shell combinations, packaging or invocation constraints, support windows, and executable tests.
  - **Activation evidence:** Accepted evidence classifies an independently useful CLI Product and shows this CLI contract applies.
  - **Source aliases:** cli-execution-support

- [trust-boundaries] Where does data or control cross between Implementation runtime units with different trust levels?
  - **Owner:** Implementation security architect
  - **Purpose:** Locate crossings where data or control enters a different trust level.
  - **Oracle:** Accepted trust map names runtime units and identities, crossing data or control, direction, validation and authorization, protection, and tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** trust-boundaries
  - **Example:** For example, untrusted input crosses into a privileged process.

- [network-replay-threat] Which protocol message must the Implementation reject when an attacker sends it again?
  - **Owner:** Implementation protocol security owner
  - **Purpose:** Prevent repeated attacker-controlled protocol messages from causing a second unauthorized effect.
  - **Oracle:** Accepted threat contract names replayable messages, freshness or uniqueness mechanism, retention and clock assumptions, rejection response, and replay tests.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-replay-threat

- [network-integrity-threat] Which protocol state becomes invalid after unauthorized change?
  - **Owner:** Implementation protocol security owner
  - **Purpose:** Detect and reject unauthorized change to protected protocol state.
  - **Oracle:** Accepted integrity contract names protected fields or state, trust and key assumptions, verification, failure behavior, rotation or recovery, and tamper tests.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-integrity-threat

- [network-denial-threat] Which resource-exhaustion attempt needs a planned defense to keep the Product available?
  - **Owner:** Implementation security authority
  - **Purpose:** Bound resource-exhaustion attacks that threaten Product availability.
  - **Oracle:** Accepted denial-risk record names resource and attack path, capacity or rate bound, admission or isolation control, degraded behavior, monitoring, and load or abuse tests.
  - **Activation evidence:** Accepted evidence shows the Implementation owns network runtime or protocol behavior; otherwise record evidence-backed not-applicable.
  - **Source aliases:** network-denial-threat

- [diagnostic-evidence] Which logs, metrics, traces, or records must the Implementation provide after failure?
  - **Owner:** Implementation observability owner
  - **Purpose:** Preserve enough failure evidence for diagnosis without exposing protected data.
  - **Oracle:** Accepted diagnostic contract maps failure questions to logs, metrics, traces or records, required fields and correlation, redaction, retention, access, and fault tests.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** diagnostic-evidence

- [security-review] Which Implementation changes require security review before release?
  - **Owner:** Implementation security authority
  - **Purpose:** Route security-relevant changes through review before release.
  - **Oracle:** Accepted review policy defines triggering change classes, required reviewer authority, evidence set, findings disposition, approval record, and enforcement check.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** security-review

- [performance-evidence] Which speed, capacity, or resource-use claim requires measurement?
  - **Owner:** Implementation performance owner
  - **Purpose:** Require measurement for consequential speed, capacity, and resource-use claims.
  - **Oracle:** Accepted performance plan names workload, environment, metric, threshold, repetitions or statistics, baseline, pass rule, and reproducible result record.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** performance-evidence

- [operational-evidence] Which deployment, recovery, or routine-operation claim requires a realistic demonstration?
  - **Owner:** Implementation operations owner
  - **Purpose:** Prove deployment, recovery, and routine-operation claims in a realistic environment.
  - **Oracle:** Accepted operational plan maps each claim to a rehearsal or demonstration, environment, operator, pass condition, retained record, and resolved findings.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** operational-evidence

- [directory-convention] Which repository-organization constraint is binding for this Implementation, and what boundary does it protect?
  - **Owner:** Repository architecture authority
  - **Purpose:** Preserve ownership and dependency boundaries through repository organization.
  - **Oracle:** Accepted convention names required paths and allowed contents or dependencies, protected boundary and rationale, authoritative examples, and automated check where possible.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** directory-convention

- [module-convention] Which responsibilities must remain separated by a module or package boundary?
  - **Owner:** Repository architecture authority
  - **Purpose:** Keep specified responsibilities separated by module or package boundaries.
  - **Oracle:** Accepted convention names responsibilities, allowed dependency direction and public seams, examples, and architecture or compile checks.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** module-convention

- [naming-convention] Which naming patterns are mandatory for Implementation files, modules, types, functions, or other elements?
  - **Owner:** Repository standards authority
  - **Purpose:** Make mandatory implementation names predictable and mechanically reviewable.
  - **Oracle:** Accepted convention defines scopes and patterns, exceptions, authoritative examples, and formatter, linter, compile, or review evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** naming-convention

- [interface-convention] Which design pattern must Implementation interfaces follow?
  - **Owner:** Repository architecture authority
  - **Purpose:** Standardize implementation interfaces where consistency protects consumers or boundaries.
  - **Oracle:** Accepted convention states applicable interface shapes, ownership and error or lifecycle rules, rationale, examples, counterexamples, and type or test evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** interface-convention

- [error-convention] Which pattern must Implementation code follow when reporting, propagating, or recovering from errors?
  - **Owner:** Repository standards authority
  - **Purpose:** Preserve consistent error creation, context, propagation, classification, and recovery behavior.
  - **Oracle:** Accepted convention defines error forms and text or code stability, wrapping or causality, boundary translation, logging ownership, examples, and tests or lint evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** error-convention

- [documentation-convention] Which format and location rules apply to Implementation documentation?
  - **Owner:** Documentation authority
  - **Purpose:** Fix where implementation documentation lives and how it is structured and maintained.
  - **Oracle:** Accepted convention names document classes, paths, required sections and metadata, ownership and freshness trigger, examples, and link or structure checks.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** documentation-convention

- [test-convention] Which naming, grouping, and location rules apply to Implementation tests?
  - **Owner:** Test architecture authority
  - **Purpose:** Standardize test names, grouping, location, scope, and evidence ownership.
  - **Oracle:** Accepted convention defines test classes and paths, naming and fixture rules, isolation or cleanup, examples, and discovery or runner checks.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** test-convention

- [contribution-convention] Which process must a contributor follow when proposing an Implementation change?
  - **Owner:** Maintainer authority
  - **Purpose:** Define the evidence and process required to propose an Implementation change.
  - **Oracle:** Accepted contribution contract records prerequisites, branch or change shape, checks, review and approval, commit or record rules, and rejection or recovery path.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** contribution-convention

- [live-example] Which current file or module is the authoritative example for this Implementation?
  - **Owner:** Repository architecture authority
  - **Purpose:** Designate a current implementation artifact as the pattern to copy.
  - **Oracle:** Accepted guidance cites an existing file or module, names the exact decisions it exemplifies and its applicability limits, and passes current checks.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** live-example

- [counterexample] Which locally common pattern is misleading and must not be copied?
  - **Owner:** Repository architecture authority
  - **Purpose:** Warn against a locally common pattern that violates the accepted contract.
  - **Oracle:** Accepted guidance cites the real pattern, names why and where it fails, defines its applicability, and links failing evidence or a concrete defect.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** counterexample

- [deliberate-pattern] Which unusual-looking Implementation pattern is deliberate and must be preserved?
  - **Owner:** Repository architecture authority
  - **Purpose:** Protect an unusual intentional pattern from cleanup that would break a requirement.
  - **Oracle:** Accepted guidance cites the pattern, states the invariant and reason, names when it applies, and links tests or source evidence that prove necessity.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** deliberate-pattern

- [binding-rule] Which Implementation rule is mandatory rather than preferred?
  - **Owner:** Repository governance authority
  - **Purpose:** Distinguish mandatory Implementation rules from preferences.
  - **Oracle:** Accepted rule states actor, required or forbidden action, scope, trigger, rationale, exceptions and authority, plus observable enforcement evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** binding-rule

- [recurring-mistake] Which Implementation-specific mistake do contributors or agents repeatedly make?
  - **Owner:** Maintainer authority
  - **Purpose:** Capture a repeated implementation failure pattern so it can be prevented.
  - **Oracle:** Accepted learning cites multiple occurrences or durable evidence, identifies the root cause and consequence, and names the prevention or detection check.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** recurring-mistake

- [corrected-approach] Which approved approach replaces the misleading local pattern?
  - **Owner:** Repository architecture authority
  - **Purpose:** Define the approved replacement for a misleading local pattern.
  - **Oracle:** Accepted guidance maps the rejected pattern to a supported alternative, applicability and migration boundary, authoritative example, and verification evidence.
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** corrected-approach
