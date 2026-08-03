# {Project} — Problem Definition

> **Role:** Accepted problem evidence and desired outcomes for every current subject.<br>
> **Example:** `Analytics Workspace` may own several Products, each with one complete Implementation. This
> example explains section placement and does not prescribe project content.

## Section Register

| Level | Stable subject key | Parent Product key | Required | State | Section link | Review evidence | User acceptance |
|---|---|---|---|---|---|---|---|
| Project | `{project-key}` | `none` | `yes` | `{absent, draft, reviewed, stale, or confirmed}` | [Project](#project) | `{assignment or none}` | `{timestamp or not yet}` |
| Product | `{product-key}` | `none` | `yes` | `{state}` | `{Product section}` | `{evidence}` | `{acceptance}` |
| Implementation | `{implementation-key}` | `{product-key}` | `yes` | `{state}` | `{Product Implementation section}` | `{evidence}` | `{acceptance}` |

The artifact is `confirmed` only when every required current row is confirmed. Any stale required row makes
the artifact `stale`; otherwise use the earliest incomplete row's state.

## Project

### `{project-key}` — {Project}

#### Current Reality, Problem, People, and Outcomes

{Describe the initiative, service problem, observed events, affected people and systems, cause evidence,
baseline, durable outcome, success evidence, assumptions, constraints, risks, and non-goals.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{accepted Project decisions, sources, strength, and evidence that would change them}` |
| Topic and question coverage | `{each alias or added question; answered, dropped, or owned deferral; answer or reason}` |
| Vocabulary | `{agreed terms, definitions, scope, and resolved conflicts}` |
| Risks and owned deferrals | `{item, consequence, owner, resolution method, and reopen condition}` |
| Corrections | `{earlier decision, current decision, user resolution, and reachable stale sections}` |
| Review dispositions | `{lens, finding and evidence, resolution or owned deferral, and follow-up question}` |
| User acceptance | `{draft, reviewed, confirmed, or stale; timestamp; one-sentence acceptance}` |

## Products

Repeat this subsection once for every Product in Subject Register order.

### `{product-key}` — {Product}

- Parent Project: `{project-key}`
- Implementation: `{implementation-key}`

#### Consumer Problem, Alternatives, Adoption, and Outcome

{Describe the Product's consumers, tasks, concrete problem, alternatives, adoption evidence, desired outcome,
success evidence, constraints, risks, and non-goals. Keep sibling Product problems distinct.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{accepted Product decisions, sources, strength, and change evidence}` |
| Topic and question coverage | `{aliases and context-derived questions with status and answer or reason}` |
| Vocabulary | `{terms, definitions, scope, and conflict resolutions}` |
| Risks and owned deferrals | `{item, consequence, owner, resolution, and reopen condition}` |
| Corrections | `{old and current decisions, user resolution, and stale sections}` |
| Review dispositions | `{finding, evidence, disposition, and follow-up question}` |
| User acceptance | `{state, timestamp, and one-sentence acceptance}` |

## Implementations

Repeat this subsection once per Product, in the same Product order.

### `{implementation-key}` — {Product} Implementation

- Parent Product: `{product-key}`
- Relationship: `exactly one complete Implementation for this Product`

#### Need, Constraints, Alternatives, Risk, and Success Evidence

{Explain why this complete stack is needed, mandatory constraints, considered alternatives, dependency and
licensing risks, portability duties, and evidence that would prove the Implementation fit or disprove it.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{accepted Implementation decisions, sources, strength, and change evidence}` |
| Topic and question coverage | `{aliases and context-derived questions with status and answer or reason}` |
| Vocabulary | `{terms, definitions, scope, and conflict resolutions}` |
| Risks and owned deferrals | `{item, consequence, owner, resolution, and reopen condition}` |
| Corrections | `{old and current decisions, user resolution, and stale sections}` |
| Review dispositions | `{finding, evidence, disposition, and follow-up question}` |
| User acceptance | `{state, timestamp, and one-sentence acceptance}` |
