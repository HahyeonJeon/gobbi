# {Project} — Product Lifecycle

> **Project:** `{project-key}` — {Project}<br>
> **Phase:** `product-lifecycle`<br>
> **Role:** Accepted actor-visible Product promises and cross-Product lifecycle policy for every current
> subject.<br>
> **Dependencies:** Accepted Problem Definition, Design, and Specification for the subject, plus accepted
> ancestor Product Lifecycle policy where applicable. Product Lifecycle does not depend on Development
> Lifecycle acceptance.

## Section Register

| Level | Stable subject key | Parent Product key | Required | State | Section | Review evidence | User acceptance |
|---|---|---|---|---|---|---|---|
| Project | `{project-key}` | `none` | `yes` | `{absent, draft, reviewed, stale, or confirmed}` | [Project](#project) | `{assignment or none}` | `{timestamp or not yet}` |
| Product | `{product-key}` | `none` | `yes` | `{absent, draft, reviewed, stale, or confirmed}` | `{Product section}` | `{evidence}` | `{acceptance}` |
| Implementation | `{implementation-key}` | `{product-key}` | `yes` | `{absent, draft, reviewed, stale, or confirmed}` | `{Product Implementation section}` | `{evidence}` | `{acceptance}` |

The only valid row states are `absent`, `draft`, `reviewed`, `stale`, and `confirmed`. Derive the artifact
state from required current rows. Any `stale` row makes the artifact `stale`; all rows
must be `confirmed` for the artifact to be `confirmed`; otherwise use the earliest incomplete row's state.

This Section Register is the sole owner of each section's current state, Review-evidence reference, and user
acceptance. Every Review uses exactly `coverage`, `specificity`, `vocabulary`, `consistency`, `traceability`,
`unsupported direction`, `load-bearing open decisions`, and `cold-reader quality`. Each finding records
evidence, consequence, one exact follow-up question, and disposition.

## Product Lifecycle Scenario Record Contract

Select candidates from accepted evidence across `stage-or-moment × path-variant × perspective`. Do not ask
the full Cartesian product. Ask only when a concrete scenario or observable Product oracle remains blocked.

Repeat this record once for every selected Product Lifecycle scenario:

| Field | Required content |
|---|---|
| `product-scenario-id` | `{stable identifier unique within the Startup run}` |
| `subject` and `level` | `{owning Project, Product, or participating Implementation section}` |
| `stage-or-moment` | `{acquire/access; adopt/onboard/integrate; launch/invoke; ordinary use/operation; interruption/failure/recovery/support; update/compatibility/migration; deprecation/offboarding; or retirement/continuity}` |
| `path-variant` | `{normal; alternate; invalid/unsupported; degraded/partial/stale/interrupted; failure/recovery; or abuse/adversarial}` |
| `perspective` | `{consumer/user/integrator; producer/operator/maintainer; or connected system when applicable}` |
| `trigger-and-context` | `{concrete event, preconditions, and accepted evidence that select the case}` |
| `product-decision-refs` | `{Product and Project decisions that own the promise}` |
| `observable-oracle` | `{what the affected actor observes on success, safe refusal, failure, or recovery}` |
| `state-data-invariants` | `{changes that must occur and changes that must not occur}` |
| `overlay-banks` | `{evidence-selected Product form banks or none}` |
| `development-record-refs` | `{zero or more linked mechanism records; absence does not block Product Lifecycle acceptance}` |
| `coverage-status` | `{asked, evidence-derived, excluded, or not-applicable, with evidence and answer references}` |

## Project

### `{project-key}` — {Project}

#### Cross-Product Lifecycle Policy and Promises

{Record only cross-Product access, operation, support, compatibility, continuity, migration, deprecation, and
retirement policy. Name the Project authority and a Project-wide observable oracle for every accepted
promise. Keep complete-stack mechanisms in Development Lifecycle.}

#### Product Lifecycle Scenario Records

{Record the selected Project-level Product Lifecycle scenarios using the contract above. Link related Product
scenarios by stable decision or scenario references without merging their owners or acceptance.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Accepted decisions | `{decision, owning authority, purpose, observable oracle, strength, and change evidence}` |
| Evidence references | `{stable sources and the exact claims each source supports}` |
| Topic and question coverage | `{each alias or added question; asked, evidence-derived, excluded, not-applicable, or owned deferral; answer or reason}` |
| Scenario coverage | `{selected moments, paths, perspectives, overlays, gaps, and evidence}` |
| Vocabulary | `{agreed terms, definitions, scope, and resolved conflicts}` |
| Risks | `{risk, consequence, evidence, owner, and reopen condition}` |
| Owned deferrals | `{deferred item, consequence, owner, resolution method, and reopen condition, or none found}` |
| Corrections | `{earlier decision, current decision, user resolution, and reachable stale sections}` |
| Review dispositions | `{finding evidence, consequence, exact follow-up question, and disposition, or none found}` |
| Section Register reference | `{stable link to the row that owns state, Review evidence, and user acceptance}` |

## Products

Repeat this subsection once for every Product in register order.

### `{product-key}` — {Product}

- Parent Project: `{project-key}`
- Implementation: `{implementation-key}`
- Promise owner: `{Product stakeholder}`

#### Actor-Visible Lifecycle Promises

{Record actor-visible access, use, operation, support, compatibility, continuity, migration, deprecation, and
retirement promises. Each promise names its affected actor, purpose, observable oracle, protected state or
data invariants, and evidence. Keep sibling Product promises distinct.}

#### Product Lifecycle Scenario Records

{Record the selected Product scenarios using the contract above. Cover only evidence-applicable moments,
paths, perspectives, and Product-form overlays. Preserve safe refusal, failure, recovery, and continuity
oracles where the accepted evidence makes them material.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Accepted decisions | `{decision, Product owner, purpose, observable oracle, strength, and change evidence}` |
| Evidence references | `{stable sources and the exact Product claims each source supports}` |
| Topic and question coverage | `{aliases and added questions with status, answer or reason, and evidence}` |
| Scenario coverage | `{selected moments, paths, perspectives, overlays, gaps, and evidence}` |
| Vocabulary | `{terms, definitions, scope, and conflict resolutions}` |
| Risks | `{risk, consequence, evidence, owner, and reopen condition}` |
| Owned deferrals | `{deferred item, consequence, owner, resolution method, and reopen condition, or none found}` |
| Corrections | `{old and current decisions, user resolution, and reachable stale sections}` |
| Review dispositions | `{finding evidence, consequence, exact follow-up question, and disposition, or none found}` |
| Section Register reference | `{stable link to the row that owns state, Review evidence, and user acceptance}` |

## Implementations

Repeat this subsection once per Product in the same Product order. Stack entries remain inside their one
complete Implementation and never create subject sections.

### `{implementation-key}` — {Product} Implementation

- Parent Product: `{product-key}`
- Relationship: `the Product's single complete Implementation`
- Product Lifecycle role: `participating boundary and handoff trace`

#### Participating Boundaries and Handoffs

{Identify only the Implementation boundaries, handoffs, and Product-visible effects that participate in an
accepted Product promise. Do not choose build, release, migration, rollback, security-response, or other
Development mechanisms here. Prepare an Implementation-level Product question only when its boundary or
handoff oracle remains unresolved.}

#### Product Lifecycle Scenario Records

{Record or reference the Product scenarios in which this Implementation participates. Keep
`development-record-refs` empty until matching Development records exist; later links never change this
section's Product owner, oracle, or acceptance.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Accepted decisions | `{participating boundary or handoff decision, Product owner, purpose, observable oracle, and evidence}` |
| Evidence references | `{stable sources and the exact Product-visible claims each source supports}` |
| Topic and question coverage | `{aliases and added questions with status, answer or reason, and evidence}` |
| Scenario coverage | `{linked Product scenarios, participating boundaries, gaps, and evidence}` |
| Vocabulary | `{terms, definitions, scope, and conflict resolutions}` |
| Risks | `{risk, consequence, evidence, owner, and reopen condition}` |
| Owned deferrals | `{deferred item, consequence, owner, resolution method, and reopen condition, or none found}` |
| Corrections | `{old and current decisions, user resolution, and reachable stale sections}` |
| Review dispositions | `{finding evidence, consequence, exact follow-up question, and disposition, or none found}` |
| Section Register reference | `{stable link to the row that owns state, Review evidence, and user acceptance}` |
