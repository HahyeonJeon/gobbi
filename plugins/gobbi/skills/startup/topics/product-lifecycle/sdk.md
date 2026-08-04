# SDK Product Lifecycle Overlay

Select this overlay only from accepted software-development-kit evidence. Compose it with the Library overlay
when both contracts apply, and reuse accepted evidence instead of repeating an equivalent question.

## Project

## Product

- [credential-lifecycle] When SDK credentials refresh, rotate, expire, or are revoked, what does the integrator observe and how is safe access re-established?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Define credential transitions after initial readiness
  - **Oracle:** Old or revoked access stops, new credentials use a supported path, and protected work has a named outcome
  - **Activation evidence:** Accepted evidence establishes a credential-bearing SDK
  - **Source aliases:** NEW

- [remote-service-recovery] After an ambiguous or partial remote outcome, how does the integrator determine whether work occurred and whether to retry, resume, refuse, or reconcile?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Resolve ambiguous remote completion and safe next action
  - **Oracle:** The integrator determines remote effect or uses a contract that makes repetition safe, with no hidden duplicate or lost effect
  - **Activation evidence:** Accepted evidence establishes timeout, throttle, cancellation, long-running work, or partial remote completion
  - **Source aliases:** NEW

- [service-version-compatibility] Which SDK package and service or API versions and features must interoperate?
  - **Owner:** Product stakeholder / Product Lifecycle Product section
  - **Purpose:** Define SDK package to service-version interoperability
  - **Oracle:** A supported pair reaches its remote oracle and an unsupported pair is rejected before unsafe work
  - **Activation evidence:** Accepted evidence establishes a connected service or API version boundary
  - **Source aliases:** NEW

## Implementation
