# Product Lifecycle Topics

Product Lifecycle owns actor-visible access, use, operation, support, compatibility, continuity, migration,
deprecation, and retirement promises. Derive scenario candidates from accepted evidence and ask only when a
concrete scenario or observable Product oracle remains unresolved.

## Overlay Banks

| Bank | Select when accepted evidence shows |
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

- [roadmap-deprecation-path] When a Project capability or Product is retired, which successor assumes each affected duty, and what observable evidence permits the transition?

- [retirement-closure] What proves that all cross-Product data, access, responsibility, dependency, support, and continuity commitments are transferred or closed?

- [cross-product-identity-continuity] When one actor moves among Products, which identity, access, consent, preferences, and work must remain consistent, and where may they differ?

- [cross-product-version-skew] While Products or clients move at different times, which cross-Product tasks must work across old and new combinations, and how is incompatibility exposed?
  - **Example:** An older desktop release must continue working while its service and Web Product update first.

- [project-ownership-transfer] If Product operation or ownership moves to another team or organization, which actor-visible identity, access, support, subscription, data, and update paths must continue?

## Product

- [dependency-unavailable] While a required runtime dependency is temporarily unavailable, what bounded degraded behavior or safe refusal do affected actors observe, and how does recovery begin?

- [product-discovery-eligibility] Where can each intended consumer discover and obtain the Product, and which region, device, account, license, or eligibility condition can block access?

- [onboarding-first-outcome] What may the consumer skip, defer, resume, or use by default on the path to the first successful Product outcome?
  - **Example:** A new consumer skips the tutorial, uses safe defaults, and completes one useful task.

- [identity-access-recovery] How does each supported identity gain, lose, and safely regain Product access without losing protected work?

- [account-closure] When a consumer closes an account, what is disabled immediately, what export or deletion continues, and what status or reversal window is visible?

- [membership-role-transition] When a person is invited, changes role, leaves, or transfers ownership, what access, work, approvals, and history change or remain?

- [entitlement-transition] Across trial, purchase, renewal, upgrade, downgrade, payment failure, refund, and cancellation, which capabilities and data remain available, and for how long?

- [consumer-data-portability] Before offboarding or retirement, what can the consumer export, in what usable form, for how long, and how is completeness verified?

- [locale-region-transition] When language, locale, time zone, currency, or region changes, which content, interpretation, availability, and in-progress work must remain correct?

- [lifecycle-accessibility-paths] Which onboarding, authentication, update, error, recovery, support, and offboarding paths must remain complete through each accepted accessibility mode?

- [consumer-incident-communication] During a material incident, what status, impact, workaround, recovery, and closure does each affected consumer receive, and where?

- [concurrent-work-conflict] When actors, tabs, devices, or automated clients change the same work concurrently, what outcome, conflict, or recovery does each observe?

- [feature-availability-transition] When a feature is previewed, gated, rolled out, rolled back, or removed for only some consumers, what availability, data, and fallback does each actor observe?

- [migration-obligation] After an incompatible external-contract change, which consumer classes must move to which supported destination?

- [scenario-precondition-context] What concrete Product state and operating context must exist before this selected scenario starts?

- [scenario-interaction-flow] What implementation-neutral actor interaction leads from the trigger to this scenario’s observable outcome?
  - **Example:** For example, an actor starts work and then observes the promised result.

- [scenario-invalid-path] Which invalid, unauthorized, or unsupported case must the Product refuse safely?

- [scenario-failure-path] Which actor-visible dependency, handoff, or outcome failure must this scenario cover?

- [scenario-recovery-path] After the selected failure, which actor action restores which safe Product state?

- [scenario-state-data-change] Which Product state and data changes are allowed, and which must not occur, in this scenario?

- [scenario-handoff] Where does responsibility or information pass in this scenario, and how is receipt or failure observed?

- [scenario-observable-outcome] What does the selected perspective observe when this scenario completes or fails safely?

- [scenario-invariant] Which security, privacy, safety, accessibility, and quality duties must remain true throughout this scenario?

- [abuse-lifecycle-scenario] Which highest-consequence realistic abuse path must the Product scenario exercise?

- [end-of-life-lifecycle-scenario] At Product retirement, how are its data, access, responsibilities, dependencies, support, and consumer commitments closed?

- [scenario-initiator] Who or what initiates this selected Product scenario?

- [scenario-trigger] What exact observable event starts this selected Product scenario?

- [scenario-degraded-interrupted] While work is slow, partial, stale, duplicated, cancelled, or interrupted, what remains truthful, usable, and recoverable?

- [scenario-evidence] Which evidence can disprove this scenario’s promise for the selected perspective and path?

- [consumer-access-readiness] How does the intended consumer reach first usable state, and recover when readiness fails?

- [operator-readiness] What lets the operator classify the Product outcome as ready, degraded, or unavailable?

- [operator-incident-response] During a Product incident, what must the operator determine and do?

- [operator-recovery-oracle] What proves that the Product outcome and protected work are safely restored?

- [support-escalation] Where does an affected consumer obtain help, and under what condition does support escalate?

- [product-update-transition] What does each affected actor observe before, during, and after a supported Product update?

- [deprecation-transition] How are affected consumers notified, supported, and moved before a Product commitment ends?

- [support-eligibility] Which Product versions or states receive routine support, security-only support, or no support, and where is that status published?

## Implementation
