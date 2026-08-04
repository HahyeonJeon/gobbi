# {Project} — Development Lifecycle

> **Project:** `{project-key}` — {Project}<br>
> **Phase:** `development-lifecycle`<br>
> **Role:** Accepted complete-stack Development mechanisms, obligations, and claim-specific evidence for
> every current subject.<br>
> **Dependencies:** Accepted Problem Definition, Design, Specification, and Product Lifecycle for the subject;
> accepted ancestor Development Lifecycle policy where applicable; and linked Product-promise records.

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

## Development Lifecycle Scenario Record Contract

Select evidence-derived complete-stack scenarios across the compact dimensions below. A scenario may cover
several dimensions, but its coverage record names each applicable dimension. Ask once for the complete stack
and follow up by categorized entry only when accepted evidence shows a material divergence.

Repeat this record once for every selected Development Lifecycle scenario:

| Field | Required content |
|---|---|
| `development-scenario-id` | `{stable identifier unique within the Startup run}` |
| `subject` and `level` | `{owning Project, Product, or one complete-stack Implementation section}` |
| `dimension` | `{one or more compact dimensions, each named in coverage}` |
| `product-scenario-refs` and `product-decision-refs` | `{Product promises that the mechanism realizes; empty only for independently owned Development policy}` |
| `project-policy-refs` | `{applicable change, release, security, support, provenance, or retirement policy}` |
| `mechanism-or-obligation` | `{implementation-neutral Development behavior that must be preserved}` |
| `participating-entries` | `{applicable categorized entries, each with category and claim}` |
| `evidence` | `{claim-specific source, test, review, rehearsal, or operational observation}` |
| `development-oracle` | `{observable pass/fail result for the mechanism or evidence}` |
| `rollback-and-recovery` | `{safe reversal, partial-work handling, and restored state}` |
| `overlay-banks` | `{evidence-selected categorized-entry banks or none}` |
| `coverage-status` | `{asked, evidence-derived, excluded, or not-applicable, with evidence and answer references}` |

The compact dimensions are `change authority/inception/readiness`;
`environment/bootstrap/toolchain/dependencies`; `implementation/build/generation`;
`verification/review/integration`; `package/release/provenance`; `deploy/distribute/observe`;
`maintenance/security/dependency response`; `upgrade/migrate/rollback`; `deprecate/retire`; and
`contributor handoff`.

## Project

### `{project-key}` — {Project}

#### Cross-Product Development Governance

{Record only shared change, release, security, support, provenance, and retirement governance. Name the
Project authority and the Development evidence or pass/fail oracle for each policy. Do not restate
Product-owned actor-visible promises.}

#### Development Lifecycle Scenario Records

{Record the selected Project-level Development scenarios using the contract above. A record without Product
references must identify the independently owned cross-Product Development policy that activates it.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Accepted decisions | `{decision, owning authority, purpose, Development oracle, strength, and change evidence}` |
| Evidence references | `{stable sources, exact claims, evidence limits, and current strength}` |
| Topic and question coverage | `{each alias or added question; asked, evidence-derived, excluded, not-applicable, or owned deferral; answer or reason}` |
| Scenario and dimension coverage | `{selected dimensions, Product links, overlays, gaps, and evidence}` |
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
- Development Lifecycle role: `Product-promise reference, Development obligation, and handoff`

#### Product-Promise Links and Development Obligations

{Reference the accepted Product scenarios and decisions that require Development work. Record the resulting
change-acceptance, evidence, and handoff obligations. Keep complete-stack mechanisms in the Product's one
Implementation section, and keep independently owned Product promises in Product Lifecycle.}

#### Development Lifecycle Scenario Records

{Record Product-level Development policy or obligation scenarios using the contract above. Each record links
the Product promise it realizes unless it names an independently owned Development policy.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Accepted decisions | `{Development obligation or handoff decision, owner, purpose, Development oracle, and change evidence}` |
| Evidence references | `{stable sources, exact claims, evidence limits, and current strength}` |
| Topic and question coverage | `{aliases and added questions with status, answer or reason, and evidence}` |
| Scenario and dimension coverage | `{Product links, obligations, selected dimensions, gaps, and evidence}` |
| Vocabulary | `{terms, definitions, scope, and conflict resolutions}` |
| Risks | `{risk, consequence, evidence, owner, and reopen condition}` |
| Owned deferrals | `{deferred item, consequence, owner, resolution method, and reopen condition, or none found}` |
| Corrections | `{old and current decisions, user resolution, and reachable stale sections}` |
| Review dispositions | `{finding evidence, consequence, exact follow-up question, and disposition, or none found}` |
| Section Register reference | `{stable link to the row that owns state, Review evidence, and user acceptance}` |

## Implementations

Repeat this subsection once per Product in the same Product order. Categorized entries participate in the
single complete-stack scenarios and never create subject sections.

### `{implementation-key}` — {Product} Implementation

- Parent Product: `{product-key}`
- Relationship: `the Product's single complete Implementation`
- Development owner: `{complete-stack Implementation stakeholder}`

#### Complete-Stack Mechanisms and Evidence

{Record implementation-neutral mechanisms for change inception and readiness, environment and bootstrap,
implementation and generation, verification and integration, package and release, deployment and
observation, maintenance and security response, upgrade and migration, rollback and recovery, retirement,
and handoff. Each mechanism names its owner, purpose, claim-specific evidence, Development oracle, and safe
recovery or exit. Do not add implementation tasks or planning order.}

#### Participating Categorized Entries

| Entry key | Category | Scenario and dimension | Claim | Evidence | Divergence or handoff |
|---|---|---|---|---|---|
| `{entry-key}` | `{tool, framework, language, platform, or other accepted category}` | `{scenario and dimension}` | `{entry contribution to the complete-stack claim}` | `{claim-specific evidence}` | `{material difference, authority boundary, or none}` |

The table records entry participation only. No entry becomes a subject, and no one entry's evidence proves a
claim beyond its stated limit.

#### Development Lifecycle Scenario Records

{Record the complete-stack Development scenarios using the contract above. Link each Product-owned promise
to a separate Development mechanism record whenever owner, purpose, or oracle differs. Shared evidence may
satisfy both records, but each phase keeps its own Review and acceptance.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Accepted decisions | `{complete-stack mechanism decision, owner, purpose, Development oracle, and change evidence}` |
| Evidence references | `{stable sources, exact claims, evidence limits, and current strength}` |
| Topic and question coverage | `{aliases and added questions with status, answer or reason, and evidence}` |
| Scenario and dimension coverage | `{Product links, dimensions, participating entries, overlays, gaps, and evidence}` |
| Vocabulary | `{terms, definitions, scope, and conflict resolutions}` |
| Risks | `{risk, consequence, evidence, owner, and reopen condition}` |
| Owned deferrals | `{deferred item, consequence, owner, resolution method, and reopen condition, or none found}` |
| Corrections | `{old and current decisions, user resolution, and reachable stale sections}` |
| Review dispositions | `{finding evidence, consequence, exact follow-up question, and disposition, or none found}` |
| Section Register reference | `{stable link to the row that owns state, Review evidence, and user acceptance}` |
