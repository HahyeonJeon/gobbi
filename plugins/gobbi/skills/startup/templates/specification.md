# {Project} — Specification

> **Role:** Accepted implementation-guiding contracts for every current subject.<br>
> **Example:** A Product may specify a saved-work recovery promise while its one Implementation specifies
> supported runtime versions and verification duties. This example is explanatory, not required content.

## Section Register

| Level | Stable subject key | Parent Product key | Required | State | Section | Review evidence | User acceptance |
|---|---|---|---|---|---|---|---|
| Project | `{project-key}` | `none` | `yes` | `{absent, draft, reviewed, stale, or confirmed}` | [Project](#project) | `{assignment or none}` | `{timestamp or not yet}` |
| Product | `{product-key}` | `none` | `yes` | `{state}` | `{Product section}` | `{evidence}` | `{acceptance}` |
| Implementation | `{implementation-key}` | `{product-key}` | `yes` | `{state}` | `{Product Implementation section}` | `{evidence}` | `{acceptance}` |

Derive the artifact state from required current rows. A stale row makes the artifact `stale`; every row must
be confirmed before the artifact is `confirmed`; otherwise use the earliest incomplete row's state.

## Project

### `{project-key}` — {Project}

#### Project Contracts, Governance, Policy, Quality, and Operations

{State Project-wide external and data contracts, authority, governance, legal and operating constraints,
binding policies, quality priorities and thresholds, service objectives, verification duties, ownership,
continuity, and evidence required to change any contract.}

#### Binding Policies

| Policy | Purpose and scope | Authority and binding rule | Enforcement evidence | Exception | Review trigger | Retirement condition |
|---|---|---|---|---|---|---|
| `{policy}` | `{purpose and scope}` | `{authority and rule}` | `{evidence}` | `{process}` | `{trigger}` | `{condition}` |

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and evidence that would change it}` |
| Coverage and vocabulary | `{aliases and added questions; status, answer or reason; agreed terms}` |
| Risks, deferrals, and corrections | `{owners, resolution, reopen conditions, old/current decisions, and stale set}` |
| Review and acceptance | `{findings, evidence, dispositions, state, timestamp, and explicit acceptance}` |

## Products

Repeat this subsection once for every Product in register order. Keep each named feature contract distinct.

### `{product-key}` — {Product}

- Parent Project: `{project-key}`
- Implementation: `{implementation-key}`

#### Capability and Feature Contracts

{State the minimum complete capability and each named feature's prerequisites, trigger, observable result,
handoffs, refused uses, and consequential failures.}

#### Experience, Behavior, Data, Security, and Recovery

{State consumer interactions, accessibility, feedback, state and data behavior, external interfaces,
compatibility, privacy, safety, failure visibility, recovery, supported environments, and evidence.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and change evidence}` |
| Coverage and vocabulary | `{feature-specific aliases, added questions, status, answer or reason, and terms}` |
| Risks, deferrals, and corrections | `{owners, resolution, reopen conditions, and stale set}` |
| Review and acceptance | `{findings, dispositions, state, timestamp, and explicit acceptance}` |

## Implementations

Repeat this subsection once per Product in the same order.

### `{implementation-key}` — {Product} Implementation

- Parent Product: `{product-key}`
- Relationship: `the Product's single complete Implementation`

#### Support, Configuration, Compatibility, and Data Behavior

{State supported stack-entry versions, environments, configuration authority, runtime restrictions, data
consistency and evolution, network behavior, retry and restore contracts, and dependency compatibility.}

#### Testing, Security, Licensing, Quality, and Contributor Contracts

{State verification evidence, trust boundaries, threat duties, license constraints, performance and operating
evidence, repository and interface conventions, and safe contribution requirements. Exclude code signatures,
exhaustive schemas, algorithms, repository-layout tasks, and implementation tasks.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and change evidence}` |
| Coverage and vocabulary | `{aliases, added questions, status, answer or reason, and terms}` |
| Risks, deferrals, and corrections | `{owners, resolution, reopen conditions, and stale set}` |
| Review and acceptance | `{findings, dispositions, state, timestamp, and explicit acceptance}` |
