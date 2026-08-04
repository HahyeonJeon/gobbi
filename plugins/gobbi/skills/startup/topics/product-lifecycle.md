# Product Lifecycle Topics

Product Lifecycle owns actor-visible access, use, operation, support, compatibility, continuity, migration,
deprecation, and retirement promises. Derive scenario candidates from accepted evidence and ask only when a
concrete scenario or observable Product oracle remains unresolved.

## Scenario Model

Select evidence-derived scenarios by stage or moment, path variant, and applicable actor perspective. Record
the trigger and context, linked Product decisions, observable oracle, state and data invariants, selected
overlay banks, linked Development records, and coverage status.

## Overlay Banks

| Bank | Activation evidence |
|---|---|
| [Web](product-lifecycle/web.md) | Accepted evidence identifies a browser-delivered Product, direct or deep links, or service-backed interactive use. |
| [Desktop](product-lifecycle/desktop.md) | Accepted evidence identifies an installed operating-system application or desktop entry behavior. |
| [CLI](product-lifecycle/cli.md) | Accepted evidence identifies command-line invocation by people or automation. |
| [Library](product-lifecycle/library.md) | Accepted evidence identifies an imported package or callable library contract. |
| [SDK](product-lifecycle/sdk.md) | Accepted evidence identifies a client kit that combines a library contract with remote-service concerns. |
| [Mobile](product-lifecycle/mobile.md) | Accepted evidence identifies an installed or managed mobile Product with operating-system or permission behavior. |
| [Data](product-lifecycle/data.md) | Accepted evidence identifies a Product whose durable outcome includes produced, exchanged, or evolving data. |

Multiple banks may apply to one Product. Selection is coverage evidence, never a new subject, route state, or
acceptance boundary.

## Project

- [recovery-priority] During a Project-wide disruption with contended recovery capacity, which accepted outcome or capability is restored first, and why?
  - **Owner:** Project continuity authority
  - **Purpose:** Order restoration when two or more Product capabilities compete
  - **Oracle:** A named consumer outcome or capability is restored first under the accepted disruption constraint
  - **Activation evidence:** Accepted Project-wide disruption affects multiple Products or capabilities and recovery capacity is scarce or contended
  - **Source aliases:** recovery-priority

- [roadmap-deprecation-path] When a Project capability or Product is retired, which successor assumes each affected duty, and what observable evidence permits the transition?
  - **Owner:** Project portfolio-transition owner
  - **Purpose:** Assign successor responsibility before a Project capability or Product retires
  - **Oracle:** Every affected duty has a named successor or explicit closure before predecessor retirement
  - **Activation evidence:** Accepted roadmap or horizon evidence replaces or retires a capability or Product
  - **Source aliases:** roadmap-deprecation-path

- [retirement-closure] What proves that all cross-Product data, access, responsibility, dependency, support, and continuity commitments are transferred or closed?
  - **Owner:** Project lifecycle closure owner
  - **Purpose:** Close cross-Product Product duties at Project retirement
  - **Oracle:** No Project-level Product duty remains unowned
  - **Activation evidence:** Accepted capability or Product retirement affects Project ownership
  - **Source aliases:** NEW

## Product

- [dependency-unavailable] While a required runtime dependency is temporarily unavailable, what bounded degraded behavior or safe refusal do affected actors observe, and how does recovery begin?
  - **Owner:** Product continuity-promise owner
  - **Purpose:** Define actor-visible behavior during temporary dependency unavailability
  - **Oracle:** Affected actors observe bounded degradation or safe refusal, then a named recovery path
  - **Activation evidence:** Accepted evidence names a required runtime dependency and temporary-unavailability risk
  - **Source aliases:** dependency-unavailable

- [migration-obligation] After an incompatible external-contract change, which consumer classes must move to which supported destination?
  - **Owner:** Product compatibility-transition owner
  - **Purpose:** Identify affected consumer classes and promised supported destinations
  - **Oracle:** Every affected class reaches a supported successor or alternative, or an explicit safe refusal
  - **Activation evidence:** Accepted evidence names an incompatible public-contract change
  - **Source aliases:** migration-obligation

- [scenario-precondition-context] What concrete Product state and operating context must exist before this selected scenario starts?
  - **Owner:** Product scenario-record owner
  - **Purpose:** Bind the selected scenario to a concrete starting state and context
  - **Oracle:** One valid and observable starting context is recorded
  - **Activation evidence:** Every selected scenario; derive from accepted evidence and ask only when concrete context is blocked
  - **Source aliases:** scenario-precondition-context

- [scenario-interaction-flow] What implementation-neutral actor interaction leads from the trigger to this scenario’s observable outcome?
  - **Owner:** Product scenario promise owner
  - **Purpose:** Describe the implementation-neutral actor interaction for the selected path
  - **Oracle:** The interaction reaches that scenario’s observable outcome from its trigger
  - **Activation evidence:** Every selected normal or valid-alternate scenario; derive first and ask only when missing
  - **Source aliases:** scenario-main-flow,scenario-alternate-flow
  - **Example:** For example, an actor starts work and then observes the promised result.

- [scenario-invalid-path] Which invalid, unauthorized, or unsupported case must the Product refuse safely?
  - **Owner:** Product refusal-promise owner
  - **Purpose:** Define one invalid, unauthorized, or unsupported case and safe refusal
  - **Oracle:** The actor sees explicit refusal and protected state remains unchanged except accepted audit or security effects
  - **Activation evidence:** Accepted evidence identifies an invalid, unauthorized, or unsupported risk
  - **Source aliases:** scenario-invalid-path

- [scenario-failure-path] Which actor-visible dependency, handoff, or outcome failure must this scenario cover?
  - **Owner:** Product failure-promise owner
  - **Purpose:** Identify an actor-visible failure for the selected scenario
  - **Oracle:** The selected failure can be induced and observed by the affected actor
  - **Activation evidence:** Accepted evidence identifies a material failure risk
  - **Source aliases:** scenario-failure-path

- [scenario-recovery-path] After the selected failure, which actor action restores which safe Product state?
  - **Owner:** Product recovery-promise owner
  - **Purpose:** Define actor action and restored safe Product state after failure
  - **Oracle:** Protected work or state is restored, or loss is explicitly bounded and disclosed
  - **Activation evidence:** A selected failure has a promised recovery
  - **Source aliases:** scenario-recovery-path,failure-recovery

- [scenario-state-data-change] Which Product state and data changes are allowed, and which must not occur, in this scenario?
  - **Owner:** Product state-invariant owner
  - **Purpose:** Define allowed and forbidden state or data effects
  - **Oracle:** Observed effects match the accepted change and invariant
  - **Activation evidence:** The selected scenario has state or data effects
  - **Source aliases:** scenario-state-data-change

- [scenario-handoff] Where does responsibility or information pass in this scenario, and how is receipt or failure observed?
  - **Owner:** Product handoff-promise owner
  - **Purpose:** Define responsibility and information transfer
  - **Oracle:** Sender, receiver, transferred item, accepted receipt, and failure are observable
  - **Activation evidence:** Accepted evidence shows a cross-person, Product, Implementation, or external-system boundary
  - **Source aliases:** scenario-handoff

- [scenario-observable-outcome] What does the selected perspective observe when this scenario completes or fails safely?
  - **Owner:** Product promise owner
  - **Purpose:** Define the selected perspective’s observable completion or safe-failure result
  - **Oracle:** The named observation distinguishes success, safe refusal, degradation, or failure
  - **Activation evidence:** Every selected scenario
  - **Source aliases:** scenario-observable-outcome,failure-visibility

- [scenario-invariant] Which security, privacy, safety, accessibility, and quality duties must remain true throughout this scenario?
  - **Owner:** Product duty owner
  - **Purpose:** Bind accepted duties to the selected scenario
  - **Oracle:** Each accepted duty remains observable or provable throughout the scenario
  - **Activation evidence:** The selected scenario touches an accepted security, privacy, safety, accessibility, or quality duty
  - **Source aliases:** scenario-invariant

- [abuse-lifecycle-scenario] Which highest-consequence realistic abuse path must the Product scenario exercise?
  - **Owner:** Product risk owner
  - **Purpose:** Select the highest-consequence realistic abuse path
  - **Oracle:** The path exercises an accepted security, privacy, or safety duty and its safe outcome
  - **Activation evidence:** Accepted evidence identifies a high-consequence threat or abuse risk
  - **Source aliases:** abuse-lifecycle-scenario

- [end-of-life-lifecycle-scenario] At Product retirement, how are its data, access, responsibilities, dependencies, support, and consumer commitments closed?
  - **Owner:** Product retirement owner
  - **Purpose:** Close one Product’s lifecycle commitments
  - **Oracle:** No Product-owned duty remains and each affected consumer reaches a successor or explicit closure
  - **Activation evidence:** Accepted evidence establishes Product retirement or end-of-life
  - **Source aliases:** end-of-life-lifecycle-scenario

- [scenario-initiator] Who or what initiates this selected Product scenario?
  - **Owner:** Product scenario-record owner
  - **Purpose:** Identify the scenario initiator
  - **Oracle:** One actor, system, schedule, or lifecycle source is named
  - **Activation evidence:** Every selected scenario; derive first and ask only when concrete scenario evidence is incomplete
  - **Source aliases:** scenario-actor-source

- [scenario-trigger] What exact observable event starts this selected Product scenario?
  - **Owner:** Product scenario-record owner
  - **Purpose:** Identify the exact starting event
  - **Oracle:** One external or temporal event separates the before and after states
  - **Activation evidence:** Every selected scenario; derive first and ask only when missing
  - **Source aliases:** scenario-trigger-stimulus

- [scenario-degraded-interrupted] While work is slow, partial, stale, duplicated, cancelled, or interrupted, what remains truthful, usable, and recoverable?
  - **Owner:** Product continuity owner
  - **Purpose:** Define truthful usable state during degradation or interruption
  - **Oracle:** The affected actor distinguishes current state and can safely resume, reconcile, or stop
  - **Activation evidence:** Accepted evidence identifies degradation or interruption risk
  - **Source aliases:** NEW

- [scenario-evidence] Which evidence can disprove this scenario’s promise for the selected perspective and path?
  - **Owner:** Product scenario evidence owner
  - **Purpose:** Bind disprovable evidence to the observable oracle
  - **Oracle:** Named evidence can falsify the promise for the exact perspective and path
  - **Activation evidence:** Every selected scenario at preparation and review; derive first and ask only if no oracle proof exists
  - **Source aliases:** NEW

- [consumer-access-readiness] How does the intended consumer reach first usable state, and recover when readiness fails?
  - **Owner:** Product access-promise owner
  - **Purpose:** Define first usable state and failed-readiness recovery
  - **Oracle:** The intended consumer reaches a first usable outcome or safe actionable recovery
  - **Activation evidence:** Accepted evidence establishes acquisition, onboarding, configuration, authentication, or readiness duty
  - **Source aliases:** NEW

- [operator-readiness] What lets the operator classify the Product outcome as ready, degraded, or unavailable?
  - **Owner:** Product operation owner
  - **Purpose:** Define operator-visible readiness state
  - **Oracle:** One unambiguous state maps to an owner and action
  - **Activation evidence:** Accepted evidence establishes an operated or live Product duty
  - **Source aliases:** NEW

- [operator-incident-response] During a Product incident, what must the operator determine and do?
  - **Owner:** Product incident owner
  - **Purpose:** Define operator diagnosis and action during incident
  - **Oracle:** Scope, impact, and safe next action are observable
  - **Activation evidence:** Accepted evidence establishes incident-response or operating duty
  - **Source aliases:** NEW

- [operator-recovery-oracle] What proves that the Product outcome and protected work are safely restored?
  - **Owner:** Product recovery owner
  - **Purpose:** Prove consumer outcome and protected work after recovery
  - **Oracle:** Consumer-facing outcome and protected state match the accepted post-recovery state
  - **Activation evidence:** Accepted evidence establishes operating or recovery duty
  - **Source aliases:** NEW

- [support-escalation] Where does an affected consumer obtain help, and under what condition does support escalate?
  - **Owner:** Product support owner
  - **Purpose:** Route consumers to responsible support authority and escalation
  - **Oracle:** The consumer reaches the named owner within accepted conditions
  - **Activation evidence:** Accepted evidence establishes human support or escalation duty
  - **Source aliases:** NEW

- [product-update-transition] What does each affected actor observe before, during, and after a supported Product update?
  - **Owner:** Product evolution-promise owner
  - **Purpose:** Define actor-visible Product update transition
  - **Oracle:** Each actor reaches compatible state or explicit safe recovery
  - **Activation evidence:** Accepted evidence establishes a supported Product update or change
  - **Source aliases:** NEW

- [deprecation-transition] How are affected consumers notified, supported, and moved before a Product commitment ends?
  - **Owner:** Product deprecation-promise owner
  - **Purpose:** Provide notice, support window, successor or alternative, and end condition
  - **Oracle:** Every affected consumer has timely notice and a supported path before commitment ends
  - **Activation evidence:** Accepted evidence establishes deprecation or retirement of a supported Product contract
  - **Source aliases:** deprecation-policy,NEW

- [support-eligibility] Which Product versions or states receive routine support, security-only support, or no support, and where is that status published?
  - **Owner:** Product support authority
  - **Purpose:** Define consumer-visible support eligibility
  - **Oracle:** A consumer can determine support eligibility before choosing or retaining a version
  - **Activation evidence:** Accepted evidence establishes versioned Product support or servicing duty
  - **Source aliases:** NEW

## Implementation
