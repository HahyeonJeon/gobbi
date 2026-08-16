# {Project} — Interview Draft

This file is a draft interview. Project Design may change any statement.

Record a triggered child under its parent with the same Status, Answer, and Evidence fields. Omit
untriggered children; do not mark them `open`. Write one `Detail:` line under a parent when an
answer names something no listed child covers.

## Identity

| Field | Value |
|---|---|
| Project name | {project-name} |
| Project key | {project-key} |
| Target root | {target-root} |
| Session root | {session-root} |
| Date | {date} |

## Subject Tree

- Project: {project-name}
- Products:
  - {product}

## Branch 1 — Project

### purpose

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### why-now

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### problem-evidence

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### durable-outcome

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### affected-people

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### products

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### {child-id}

Write this heading only when a child of this parent is triggered, for example `coupling-risk`. Do
not list untriggered children.

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### boundary

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### success-and-stop

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### current-baseline

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### riskiest-assumption

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### constraints

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### quality-priority

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### authority-continuity

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### horizon-direction

- Status: {answered | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

## {Product}

Repeat this section for each named product.

### Branch 2 — Design / Development

#### shape

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### build-buy-adopt

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### stack

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### local-or-cloud

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### data

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### data-lifecycle

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### interfaces

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### experience-direction

- Status: {answered | inherited | assumption | open | not applicable}
- Answer: {statement}
- Evidence: {cite or none}

#### environments

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### change-path

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### verification

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### first-check

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### build-risk

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### failure-containment

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

### Branch 3 — Product

#### software-type

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### current-alternative

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### first-use

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### core-tasks

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### task-actors

Repeat this heading for each named task. If `core-tasks` is none, record one copy with Subject
`none` and Status `not applicable`.

- Subject: {task-name | none}
- Status: {answered | inherited | assumption | open | not applicable}
- Answer: {statement}
- Evidence: {cite or none}

#### task-scope

Repeat this heading for each named task. If `core-tasks` is none, record one copy with Subject
`none` and Status `not applicable`.

- Subject: {task-name | none}
- Status: {answered | inherited | assumption | open | not applicable}
- Answer: {statement}
- Evidence: {cite or none}

#### task-behavior

Repeat this heading for each named task. If `core-tasks` is none, record one copy with Subject
`none` and Status `not applicable`.

- Subject: {task-name | none}
- Status: {answered | inherited | assumption | open | not applicable}
- Answer: {statement}
- Evidence: {cite or none}

#### refused-use

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### failure-recovery

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### accessibility-needs

- Status: {answered | inherited | assumption | open | not applicable}
- Answer: {statement}
- Evidence: {cite or none}

#### data-promise

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### access

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### support-update

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### end-of-life

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

#### {child-id}

Write this heading only when a child of a product or task parent is triggered. Nest it under that
parent. Omit untriggered children.

- Status: {answered | inherited | assumption | open}
- Answer: {statement}
- Evidence: {cite or none}

## Assumptions

| Id | Assumption | What would resolve it |
|---|---|---|
| {topic-id} | {assumption} | {evidence or decision} |

## Open Questions

| Id | Question | Blocking |
|---|---|---|
| {topic-id} | {question} | {yes \| no} |

## Acceptance

- User accepted this draft: {yes | no}
- Accepted by: {user}
- Date: {date}
- Session-only: this file is not Memory and is not a complete design.
