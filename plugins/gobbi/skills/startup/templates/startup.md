# {Project} — Startup Design

> **Document role:** Confirmed Startup design record<br>
> **Purpose:** Hold the whole project design the user confirmed during the Startup interview, in one file a
> reader who was not present can follow.<br>
> **Output boundary:** Do not include an evaluation, an implementation plan, ordered tasks, or a memory
> destination. Whoever memorizes this design later chooses where it belongs.

Keep every heading below. When the interview found nothing material for a section, say so in one sentence so
a reader can tell an empty answer from a question that was never asked.

**Evidence strength** says how well the project's own evidence supports a statement recorded here:
`verified` when the project proves it, `supported` when the project's evidence points to it, `unverified`
when no project evidence was found, and `disputed` when the evidence conflicts.

## Contents

- [Summary](#summary)
- [Project and Problem](#project-and-problem)
- [People and Adoption](#people-and-adoption)
- [Scope and Boundaries](#scope-and-boundaries)
- [Features](#features)
- [Experience and Interfaces](#experience-and-interfaces)
- [System and Data](#system-and-data)
- [Technology and Compatibility](#technology-and-compatibility)
- [Delivery, Operations, and Quality](#delivery-operations-and-quality)
- [Security, Privacy, and Data Duties](#security-privacy-and-data-duties)
- [Project Rules and Ownership](#project-rules-and-ownership)
- [Decisions and Evidence](#decisions-and-evidence)
- [Risks and Open Questions](#risks-and-open-questions)
- [Corrections](#corrections)
- [Question and Answer Record](#question-and-answer-record)
- [Confirmation](#confirmation)

## Summary

{State the project, the problem it answers, the direction the user chose, the decisive evidence, and the main
trade-offs. This section must be readable on its own.}

## Project and Problem

{Describe the current reality and its evidence, the problem and its cause, why now, the risks and the weakest
assumption, the result that must stay true even if the software is rebuilt, and what would show the project
succeeded or should stop.}

## People and Adoption

{Describe who benefits first, who else is affected, who is intentionally outside the target group, the task
those people are trying to complete, how they complete it today, and what would make them adopt or refuse the
software.}

## Scope and Boundaries

{Describe the complete result the project owns, where its responsibility begins and ends, the behavior other
systems rely on, what is explicitly out of scope, what stays manual, which uses are refused, and which scope
decision would be most costly to change.}

## Features

{State the smallest complete capability that lets someone finish a useful task, then give one subsection per
named feature. Use the feature's own name as the heading.}

### {Feature name}

{Describe what this feature does, what must exist before it can work, what starts it, what a user or
connected system observes when it finishes, where responsibility passes to someone else, and the failure that
would have the greatest consequence.}

## Experience and Interfaces

{Describe how each user or connected system interacts with the software, what confirms success, the terms
that must mean the same thing everywhere, what a user must see before an important decision, what happens
after an error, what protects people from a hard-to-reverse action, and the accessibility needs that shape
the first version.}

## System and Data

{Describe the people and systems that exchange information with the software, the parts that run
independently and what each owns, the path that produces the main result, how failures are contained and
recovered, and the promises the project makes about stored data: consistency, format changes, retention,
restore, export, and origin.}

## Technology and Compatibility

{Describe the languages, frameworks, runtimes, and data stores future work must use or stay compatible with,
the versions supported and for how long, the mandatory choices, the critical external dependencies and what
happens if one fails, and how incompatible changes are versioned, announced, and migrated.}

## Delivery, Operations, and Quality

{Describe the operating environments and what differs between them, how a release reaches its users, how it
is deployed, rolled out, and rolled back, what shows the running software is delivering its result, which
quality takes priority when qualities conflict, and what evidence each important claim needs.}

## Security, Privacy, and Data Duties

{Describe the assets that would cause the most harm if compromised, where trust levels change, who may do
what, the realistic threats and misuses, the condition the system must preserve after a serious failure, and
the personal data the project collects, keeps, deletes, or discloses.}

## Project Rules and Ownership

{Describe who decides product and technical direction, the legal, regulatory, budget, and schedule limits,
the conventions contributors must follow, the deliberate patterns worth preserving, the mistakes worth
avoiding, and who owns operation, maintenance, risk, and continuity.}

## Decisions and Evidence

| Decision | Current direction | Evidence and strength | Evidence that would change it |
|---|---|---|---|
| `{decision}` | `{direction}` | `{source, and verified, supported, unverified, or disputed}` | `{evidence or condition}` |

## Risks and Open Questions

| Risk or open question | Evidence | Consequence | Owner | How it will be resolved |
|---|---|---|---|---|
| `{item}` | `{current evidence}` | `{effect}` | `{owner}` | `{method}` |

## Corrections

Answers the user changed during the interview, with the resolution that made the current answer current.

| What changed | Earlier answer | Current answer | User's resolution |
|---|---|---|---|
| `{[question-name]}` | `{earlier claim}` | `{current claim}` | `{what the user decided}` |

## Question and Answer Record

Every material answer appears here exactly once. A per-feature question appears once for each feature.

| Question name | Feature or project | Question as asked | Current answer | Evidence | Evidence strength |
|---|---|---|---|---|---|
| `{[question-name]}` | `{feature name, or project}` | `{question as it was asked}` | `{current answer}` | `{source, or none}` | `{verified, supported, unverified, or disputed}` |

## Confirmation

- Project root: `{absolute-project-root}`
- Output directory: `{absolute-output-directory}`
- Confirmed: `{timestamp}`
- The user confirmed: `{what the user confirmed, in one sentence}`
