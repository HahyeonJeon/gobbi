# {Project} — Lifecycle and Use Cases

> **Role:** Accepted proactive development guidance and observable oracles for every current subject.<br>
> **Example:** Project sections cover service-wide incidents, Product sections cover app recovery and
> retirement, and Implementation sections cover development, release, dependency migration, and stack
> deprecation. This example is explanatory.

## Section Register

| Level | Stable subject key | Parent Product key | Required | State | Section | Review evidence | User acceptance |
|---|---|---|---|---|---|---|---|
| Project | `{project-key}` | `none` | `yes` | `{absent, draft, reviewed, stale, or confirmed}` | [Project](#project) | `{assignment or none}` | `{timestamp or not yet}` |
| Product | `{product-key}` | `none` | `yes` | `{state}` | `{Product section}` | `{evidence}` | `{acceptance}` |
| Implementation | `{implementation-key}` | `{product-key}` | `yes` | `{state}` | `{Product Implementation section}` | `{evidence}` | `{acceptance}` |

Derive the artifact state from required current rows. Any stale row makes it `stale`; all rows must be
confirmed for `confirmed`; otherwise use the earliest incomplete row's state.

This Section Register is the sole owner of each section's current state, Review-evidence reference, and user
acceptance. Every Review uses exactly `coverage`, `specificity`, `vocabulary`, `consistency`, `traceability`,
`unsupported direction`, `load-bearing open decisions`, and `cold-reader quality`; each finding records
evidence, consequence, one exact follow-up question, and disposition.

## Project

### `{project-key}` — {Project}

#### Service Operation and Project-Wide Use

| Scenario | Class | Purpose | Linked decisions and sections | Observable oracle | Evidence | Status |
|---|---|---|---|---|---|---|
| `{cross-Product incident}` | `{normal, alternate, invalid, failure/recovery, abuse, evolution, or end}` | `{purpose}` | `{links}` | `{pass/fail observation}` | `{record}` | `{covered, deferred, or not applicable}` |

{Describe service operation, project-wide use, cross-Product events, evolution, and Project end paths. For
example, operate the Project during one Product outage and observe which Project result remains available.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and change evidence}` |
| Coverage and vocabulary | `{scenario/question aliases, status, answer or reason, links, and terms}` |
| Risks, deferrals, and corrections | `{owners, consequence, resolution, reopen condition, and stale set}` |
| Review dispositions | `{finding evidence, consequence, exact follow-up question, and disposition}` |
| Section Register reference | `{stable link to the row that owns state, Review evidence, and user acceptance}` |

## Products

Repeat this subsection once for every Product in register order.

### `{product-key}` — {Product}

- Parent Project: `{project-key}`
- Implementation: `{implementation-key}`

#### Product Use, Operation, Failure, Recovery, Upgrade, and Retirement

| Scenario | Class | Preconditions and trigger | Main and alternate paths | Failure and recovery | State and data changes | Observable oracle and evidence |
|---|---|---|---|---|---|---|
| `{Product scenario}` | `{class}` | `{context and stimulus}` | `{flows}` | `{safe failure and restored state}` | `{changes and invariants}` | `{oracle and evidence}` |

{Record normal use, operating, invalid, abuse, failure, recovery, upgrade, migration of consumer state,
deprecation, and retirement scenarios. Keep sibling Product scenarios distinct.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and change evidence}` |
| Coverage and vocabulary | `{scenario/question aliases, status, answer or reason, links, and terms}` |
| Risks, deferrals, and corrections | `{owners, consequence, resolution, reopen condition, and stale set}` |
| Review dispositions | `{finding evidence, consequence, exact follow-up question, and disposition}` |
| Section Register reference | `{stable link to the row that owns state, Review evidence, and user acceptance}` |

## Implementations

Repeat this subsection once per Product in that same order. Stack entries remain inside the scenario and do
not create further subject sections.

### `{implementation-key}` — {Product} Implementation

- Parent Product: `{product-key}`
- Relationship: `the Product's single complete Implementation`

#### Development, Build, Test, Release, and Stack Evolution

| Scenario | Class | Stack entries involved | Development guidance | Evaluation method | Observable oracle and evidence | Migration, rollback, or exit path |
|---|---|---|---|---|---|---|
| `{dependency upgrade}` | `{development, build, test, release, migration, rollback, maintenance, or deprecation}` | `{categorized entries}` | `{implementation-neutral guidance}` | `{realistic test, review, observation, or rehearsal}` | `{pass/fail result and proof}` | `{safe path}` |

{Record complete-stack development and use, build and test, release and rollback, dependency change,
migration, maintenance, supported-version retirement, and categorized-entry deprecation scenarios.}

#### Section Evidence and Acceptance

| Record | Required content |
|---|---|
| Decisions and evidence | `{direction, source, strength, and change evidence}` |
| Coverage and vocabulary | `{scenario/question aliases, status, answer or reason, links, and terms}` |
| Risks, deferrals, and corrections | `{owners, consequence, resolution, reopen condition, and stale set}` |
| Review dispositions | `{finding evidence, consequence, exact follow-up question, and disposition}` |
| Section Register reference | `{stable link to the row that owns state, Review evidence, and user acceptance}` |
