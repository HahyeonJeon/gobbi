# Startup Working Record

This schema-2 file owns and checkpoints one Startup run. It is not a transcript, evaluation, implementation plan, or memory record. Keep sensitive values out and remove it only after final confirmation.

## Run Identity and State

- Startup schema: `2`
- Project root: `{absolute-project-root}`
- Output directory: `{absolute-output-directory}`
- Status: `{in progress | paused}`
- Current phase: `{Problem Definition | Project Design | Project Specification | Lifecycle and Use-Case Scenarios | Finalization}`
- Loop step: `{Study | Prepare Topics | Interview | Documentation | Review}`
- Iteration: `{1 upward}`
- Next question or assignment: `{exact question, assignment, or none}`
- First recovery action: `{derived action}`

## Artifact Register

| Artifact | Phase | State | Depends on | Evidence on disk |
|---|---|---|---|---|
| `problem-definition.md` | Problem Definition | `{absent, draft, reviewed, stale, or confirmed}` | `{none}` | `{evidence}` |
| `project-design.md` | Project Design | `{state}` | `problem-definition.md` | `{evidence}` |
| `project-specification.md` | Project Specification | `{state}` | `problem-definition.md`, `project-design.md` | `{evidence}` |
| `lifecycle-and-use-cases.md` | Lifecycle and Use-Case Scenarios | `{state}` | `{three earlier documents}` | `{evidence}` |
| `startup.md` | Finalization | `{state}` | `{four phase documents}` | `{evidence}` |

## Subject Register

| Subject | Type | Parent | Description | Owning phase | Status |
|---|---|---|---|---|---|
| `{subject}` | `{project, application/deliverable, building block, technology, feature, or scenario}` | `{parent or none}` | `{description}` | `{phase}` | `{current or stale}` |

## Evidence

| Evidence | Source | Kind | Strength | Supports or disputes | Phase |
|---|---|---|---|---|---|
| `{summary}` | `{source}` | `{fact, user report, decision, plan, or open}` | `{verified, supported, unverified, or disputed}` | `{claim}` | `{phase}` |

## Topics and Questions

| Phase | Topic or question | Adapted wording | Origin | Status | Reason or dependency |
|---|---|---|---|---|---|
| `{phase}` | `{topic or [question-name]}` | `{project-specific wording}` | `{phase bank, study, interview, or review}` | `{prepared, to ask, answered, dropped, reopened, or deferred}` | `{reason}` |

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

## Corrections and Reopen Effects

| Earlier decision | Current decision | User resolution | Earliest reopened phase | Artifacts made stale |
|---|---|---|---|---|
| `{earlier}` | `{current}` | `{resolution}` | `{phase}` | `{artifacts}` |

## Review Findings

| Phase and iteration | Lens | Finding and evidence | Consequence | Follow-up question | Disposition |
|---|---|---|---|---|---|
| `{phase}` | `{coverage, specificity, vocabulary, consistency, traceability, or quality}` | `{finding}` | `{effect}` | `{question or none}` | `{open, resolved, or owned deferral}` |

## Owned Deferrals

| Item | Blocking status | Owner | Consequence | Resolution method | Reopen condition |
|---|---|---|---|---|---|
| `{item}` | `{nonblocking only}` | `{owner}` | `{effect}` | `{method}` | `{condition}` |
