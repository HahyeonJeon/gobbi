# {Project} — Design

> **Role:** Accepted structure and design direction for every current subject.<br>
> **Example:** `Web Dashboard` has one complete Implementation whose React and TypeScript entries record
> categories, responsibilities, versions, rationale, constraints, and exit triggers. This is explanatory.

## Section Register

| Level | Stable subject key | Parent Product key | Required | State | Section | Review evidence | User acceptance |
|---|---|---|---|---|---|---|---|
| Project | `{project-key}` | `none` | `yes` | `{absent, draft, reviewed, stale, or confirmed}` | [Project](#project) | `{assignment or none}` | `{timestamp or not yet}` |
| Product | `{product-key}` | `none` | `yes` | `{state}` | `{Product section}` | `{evidence}` | `{acceptance}` |
| Implementation | `{implementation-key}` | `{product-key}` | `yes` | `{state}` | `{Product Implementation section}` | `{evidence}` | `{acceptance}` |

Derive the artifact state from all required current rows: any `stale` row makes it `stale`; all confirmed
rows make it `confirmed`; otherwise use the earliest incomplete row's state.

## Project

### `{project-key}` — {Project}

#### Scope, Product Inventory, and Cross-Product Design

{State the owned outcome, responsibility boundary, external context, stable contracts, one-or-more Product
inventory in accepted order, cross-Product data and runtime relationships, architecture, strategy, quality
tradeoffs, and evidence that would change them. Product registration creates its one Implementation key.}

#### Outcome Horizons

| Horizon and outcome | Dependencies | Validation gate | Capacity assumption | Costly decision | Replan or stop trigger | Retirement path |
|---|---|---|---|---|---|---|
| `{horizon}` | `{dependencies}` | `{evidence}` | `{capacity}` | `{decision}` | `{trigger}` | `{path}` |

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and evidence that would change it}` |
| Coverage and vocabulary | `{question aliases and added questions; status, answer or reason; agreed terms}` |
| Risks, deferrals, and corrections | `{owners, reopen conditions, old/current decisions, resolution, stale set}` |
| Review and acceptance | `{findings, evidence, dispositions, state, timestamp, and explicit user acceptance}` |

## Products

Repeat this subsection once for every Product in register order.

### `{product-key}` — {Product}

- Parent Project: `{project-key}`
- Implementation: `{implementation-key}`

#### Boundary, Runtime Form, Interfaces, and Implementation Relationship

{State the Product outcome and type, consumer and external boundaries, runtime form, interfaces, stable
contracts, independent-change seams, data direction, one complete Implementation relationship, and evidence
that would change the Product design.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and change evidence}` |
| Coverage and vocabulary | `{aliases, added questions, status, answer or reason, and agreed terms}` |
| Risks, deferrals, and corrections | `{owners, reopen conditions, resolutions, and stale set}` |
| Review and acceptance | `{findings, dispositions, state, timestamp, and explicit acceptance}` |

## Implementations

Repeat this subsection once per Product in that same order. Do not create child subjects for stack entries.

### `{implementation-key}` — {Product} Implementation

- Parent Product: `{product-key}`
- Relationship: `the Product's single complete Implementation`

#### Complete-Stack Role, Runtime, and Interfaces

{Describe the whole stack, runtime units, responsibilities, main and background paths, failure containment,
interfaces, data flow, deployment obligations, and quality duties.}

#### Categorized Stack Entries

| Entry | Category | Responsibility | Version and support | Rationale and evidence | Constraints and dependencies | Alternative, exit, and reopen trigger |
|---|---|---|---|---|---|---|
| `{React}` | `{framework}` | `{Product-interface responsibility}` | `{policy}` | `{reason and evidence}` | `{constraints}` | `{path and trigger}` |
| `{TypeScript}` | `{language}` | `{complete-stack responsibility}` | `{policy}` | `{reason and evidence}` | `{constraints}` | `{path and trigger}` |

The sample rows explain the matrix and are not required technologies.

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and change evidence}` |
| Coverage and vocabulary | `{aliases, added questions, status, answer or reason, and agreed terms}` |
| Risks, deferrals, and corrections | `{owners, reopen conditions, resolutions, and stale set}` |
| Review and acceptance | `{findings, dispositions, state, timestamp, and explicit acceptance}` |
