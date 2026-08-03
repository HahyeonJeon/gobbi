# {Project} — Project Design

> **Role:** Accepted high-level structure, technology direction, strategy, roadmap, runtime, and deployment design.

## Scope and System Context

{State the owned outcome, responsibility boundary, external actors and contracts, non-goals, and costly-to-change boundaries.}

## Structural Model

Use `Project -> Application/Deliverable -> Building Block` only for structural ownership.

| Subject | Type | Parent | Responsibility | Interfaces and dependencies | Owner | Deployment and quality obligations |
|---|---|---|---|---|---|---|
| `{name}` | `{project, application/deliverable, or building block}` | `{parent or none}` | `{responsibility}` | `{boundaries}` | `{owner}` | `{obligations}` |

## Technology and Language Matrix

| Building block | Category | Technology | Language or runtime | Version and support | Rationale and constraints | Alternative, exit, and reopen trigger |
|---|---|---|---|---|---|---|
| `{block}` | `{framework, runtime, engine, datastore, table format, protocol, platform, infrastructure, external service, library, or toolchain}` | `{choice}` | `{language/runtime}` | `{policy}` | `{reason}` | `{path and trigger}` |

## Architecture, Runtime, and Deployment

{Describe independently running units, responsibilities, main and background paths, failure containment, environments, configuration authority, release channel, deployment, rollout, rollback, and recovery priorities.}

## Solution Strategy and Quality Tradeoffs

{State build/buy/adopt choices, differentiation, non-goals, quality priorities, deliberate tradeoffs, and evidence that would change the strategy.}

## Outcome-Horizon Roadmap

| Horizon and outcome | Dependencies | Validation gate | Capacity assumption | Irreversible decision | Replan or stop trigger | Deprecation path |
|---|---|---|---|---|---|---|
| `{horizon}` | `{dependencies}` | `{evidence gate}` | `{capacity}` | `{decision}` | `{trigger}` | `{path}` |

## Decisions and Evidence

| Decision | Direction | Evidence and strength | Evidence that would change it |
|---|---|---|---|
| `{decision}` | `{direction}` | `{source and strength}` | `{condition}` |

## Topic and Question Coverage

| Topic or question | Origin | Status | Answer or exclusion reason |
|---|---|---|---|
| `{[question-name]}` | `{origin}` | `{answered, dropped, or deferred}` | `{answer or reason}` |

## Vocabulary

| Term | Agreed definition | Where it applies | Conflicts resolved |
|---|---|---|---|
| `{term}` | `{definition}` | `{scope}` | `{resolution}` |

## Risks and Owned Deferrals

| Item | Consequence | Owner | Resolution method | Reopen condition |
|---|---|---|---|---|
| `{item}` | `{effect}` | `{owner}` | `{method}` | `{condition}` |

## Corrections

| Earlier decision | Current decision | User resolution | Stale or reopened artifacts |
|---|---|---|---|
| `{earlier}` | `{current}` | `{resolution}` | `{artifacts}` |

## Review Findings and Dispositions

| Lens | Finding and evidence | Disposition | Follow-up question |
|---|---|---|---|
| `{lens}` | `{finding}` | `{resolved or owned deferral}` | `{question or none}` |

## User Acceptance

- Status: `{draft | reviewed | confirmed | stale}`
- Accepted: `{timestamp or not yet}`
- The user accepted: `{one sentence or not yet}`
