# Startup Working Record

This schema-2 file owns the identity and evidence for one Startup run. The native runtime TODO list owns
progression. This file is not a route cursor, transcript, evaluation, implementation plan, or memory record.
Keep sensitive values out and remove it only after verified Finalization PASS.

## Run Identity and Recovery

- Startup schema: `2`
- Project root: `{absolute-project-root}`
- Output directory: `{absolute-output-directory}`
- Status: `{in progress | paused}`
- Recovery mode: `{normal | completed-v2 revalidation}`
- Current blocker: `{none or exact blocker}`
- First recovery action: `{action derived from the evidence below and the native TODO list}`

## Artifact Register

| Artifact | Phase | State | Depends on | Evidence on disk |
|---|---|---|---|---|
| `problem-definition.md` | Problem Definition | `{absent, draft, reviewed, stale, or confirmed}` | `{none}` | `{evidence}` |
| `project-design.md` | Project Design | `{state}` | `problem-definition.md` | `{evidence}` |
| `project-specification.md` | Project Specification | `{state}` | `problem-definition.md`, `project-design.md` | `{evidence}` |
| `lifecycle-and-use-cases.md` | Lifecycle and Use-Case Scenarios | `{state}` | `{three earlier documents}` | `{evidence}` |
| `startup.md` | Finalization | `{state}` | `{four phase documents}` | `{evidence}` |

## Acceptance and Revalidation Evidence

| Phase | Iteration | Run kind | Review assignment and result | User acceptance or confirmation | Evidence status |
|---|---|---|---|---|---|
| `{phase}` | `{iteration}` | `{normal or completed-v2 revalidation}` | `{assignment and accepted result}` | `{decision and timestamp}` | `{open or accepted}` |

## Subject Register

| Subject | Type | Parent | Description | Owning phase | Status |
|---|---|---|---|---|---|
| `{subject}` | `{project, application/deliverable, building block, technology, feature, or scenario}` | `{parent or none}` | `{description}` | `{phase}` | `{current or stale}` |

## Evidence

| Evidence | Source | Kind | Strength | Supports or disputes | Phase |
|---|---|---|---|---|---|
| `{summary}` | `{source}` | `{fact, user report, decision, plan, or open}` | `{verified, supported, unverified, or disputed}` | `{claim}` | `{phase}` |

## Topics and Questions

| Phase | Topic or question | Subject | Adapted wording | Origin | Status | Reason or dependency |
|---|---|---|---|---|---|---|
| `{phase}` | `{topic or [question-name]}` | `{project or distinct feature}` | `{project-specific wording}` | `{phase bank, study, interview, or review}` | `{prepared, to ask, answered, dropped, reopened, or deferred}` | `{reason}` |

## Lifecycle Scenario Candidates

| Candidate identity and class | Purpose | Linked accepted decisions and artifacts | Concrete-scenario blocker | Oracle blocker | Status |
|---|---|---|---|---|---|
| `{identity; class}` | `{purpose}` | `{decision and artifact links}` | `{blocker or none}` | `{blocker or none}` | `{candidate, ready, deferred, or dropped}` |

## Answers and Decisions

| Question | Subject | Answer or decision | Kind | Evidence and strength | Recorded iteration |
|---|---|---|---|---|---|
| `{[question-name]}` | `{subject}` | `{faithful summary}` | `{fact, user report, decision, plan, or open}` | `{source and strength}` | `{iteration}` |

## Vocabulary

| Term | Proposed or agreed definition | Status | Conflict or question | Owning phase |
|---|---|---|---|---|
| `{term}` | `{definition}` | `{proposed, agreed, or disputed}` | `{issue or none}` | `{phase}` |

## Delegated Assignments

| Assignment | Phase and step | Iteration | Authority | Inputs and allowed paths | Returned result | Manager verification | Status |
|---|---|---|---|---|---|---|---|
| `{stable assignment}` | `{phase and step}` | `{iteration}` | `{read-only or ordered writer}` | `{inputs and paths}` | `{result or NEEDS_CONTEXT question}` | `{verification}` | `{assigned, returned, accepted, or blocked}` |

## Context Checkpoints

| Blocked assignment | Phase and stage | Iteration | Exact question | User answer | Answer checkpoint assignment | Status |
|---|---|---|---|---|---|---|
| `{assignment}` | `{phase and stage}` | `{iteration}` | `{question}` | `{faithful summary or not yet}` | `{assignment or not yet}` | `{blocked, answered, or accepted}` |

## Corrections and Reopen Effects

| Earlier decision | Current decision | User resolution | Earliest reopened phase | Artifacts made stale |
|---|---|---|---|---|
| `{earlier}` | `{current}` | `{resolution}` | `{phase}` | `{artifacts}` |

## Review Findings

| Phase | Iteration | Lens | Finding and evidence | Consequence | Follow-up question | Disposition |
|---|---|---|---|---|---|---|
| `{phase}` | `{iteration}` | `{coverage, specificity, vocabulary, consistency, traceability, or quality}` | `{finding}` | `{effect}` | `{question or none}` | `{open, resolved, or owned deferral}` |

## Owned Deferrals

| Item | Blocking status | Owner | Consequence | Resolution method | Reopen condition |
|---|---|---|---|---|---|
| `{item}` | `{nonblocking only}` | `{owner}` | `{effect}` | `{method}` | `{condition}` |
