# {Project} — Specification

State the accepted design contracts, observable behavior, quality thresholds, and verification evidence for the
Project, each Product, and each Product's single complete Implementation.

## Project

### {Project}

#### Contracts, authority, and constraints

{State Project-wide external and data contracts, decision authorities, governance, legal and license limits,
distribution rules, budgets, dates, capacity, unavailable systems, security threats, protected assets,
operating ownership, continuity, maintenance, and stop evidence.}

#### Quality and policy

| Quality or policy | Purpose and scope | Binding rule or threshold | Authority | Verification evidence | Exception or change evidence |
|---|---|---|---|---|---|
| {item} | {why and where} | {measurable obligation} | {decision-maker} | {test, review, observation, or rehearsal} | {condition and evidence} |

- Accepted: {yes — user and date}

## Products

Repeat this section for every Product. Keep each named feature contract distinct.

### {Product}

- Parent Project: {Project}
- Implementation: {Product Implementation}

#### Capabilities and behavior

{State the smallest complete useful capability and each named feature's prerequisites, trigger, observable
result, handoffs, safe refusals, consequential failures, explanations, feedback, and recovery.}

#### Experience, data, compatibility, and safety

{State accessibility, supported consumers and environments, stable interfaces and versions, navigation and
in-progress work behavior, privacy and consent, retention and deletion, permissions, authorization, audit,
misuse protection, performance range, release access, and the evidence required for each material claim.}

- Accepted: {yes — user and date}

## Implementations

Repeat this section once per Product.

### {Product} Implementation

- Parent Product: {Product}
- Relationship: the Product's single complete-stack Implementation

#### Runtime and data contracts

{State supported categorized-entry versions, environments, configuration authority, operating restrictions,
data consistency and evolution, event time and ordering, duplicate and late input behavior, restore evidence,
network intent and health, retries, degraded operation, compatibility, and observability.}

#### Engineering constraints and evidence

{State trust boundaries, threat duties, license constraints, performance evidence, repository and interface
conventions, error and documentation rules, test rules, contribution requirements, authoritative examples,
misleading patterns to avoid, deliberate unusual patterns to preserve, and evidence for every binding claim.
Keep this at design-contract level; exclude code signatures, exhaustive schemas, algorithms, and implementation tasks.}

- Accepted: {yes — user and date}
