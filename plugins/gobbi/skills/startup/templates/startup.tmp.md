# Startup Working Record

This schema-3 file owns active-run identity, subject order and parents, assignments, answers, scenarios,
blockers, corrections, Review findings, and acceptance/revalidation evidence. The native TODO owns
progression, each aggregate Section Register owns section state, and `startup.md` `Confirmation` owns
terminal Finalization state. This record contains no cursor or independently maintained aggregate state.

## Run Identity

- Startup schema: `3`
- Project root: `{absolute-project-root}`
- Output directory: `{absolute-output-directory}`
- Status: `{in progress | paused}`
- Recovery mode: `{normal | completed-v3 revalidation}`
- Current blocker: `{none or exact blocker}`

## Artifact Register

| Artifact | Phase | Required aggregate rows | Stable evidence on disk |
|---|---|---|---|
| `problem-definition.md` | Problem Definition | `{all current subject-row links}` | `{evidence}` |
| `design.md` | Design | `{all current subject-row links}` | `{evidence}` |
| `specification.md` | Specification | `{all current subject-row links}` | `{evidence}` |
| `lifecycle-and-use-cases.md` | Lifecycle and Use Cases | `{all current subject-row links}` | `{evidence}` |

Read current aggregate state only from each aggregate file's Section Register. Derive Finalization readiness
or staleness from those rows, current Finalization evidence below, and `startup.md` `Confirmation`; do not add
a maintained `startup.md` state row here.

## Subject Register

| Order | Level | Stable subject key | Parent key | Description |
|---|---|---|---|---|
| `0` | Project | `{project-key}` | `none` | `{top-level service or initiative}` |
| `{Product order}` | Product | `{product-key}` | `{project-key}` | `{independently useful application or platform}` |
| `{same Product order}` | Implementation | `{implementation-key}` | `{product-key}` | `{the Product's single complete stack; entries may be unknown}` |

Every Product row requires exactly one Implementation row with a stable one-to-one identity. Categorized
technology entries belong in the aggregate Design section and never appear as Subject Register rows.

## Phase Section Register

| Route order | Artifact | Level | Stable subject key | Phase | Owning aggregate row | Depends on | Stable evidence references |
|---|---|---|---|---|---|---|---|
| `{order}` | `problem-definition.md` | `{Project, Product, or Implementation}` | `{stable key}` | Problem Definition | `{Section Register row link}` | `{accepted ancestor or none}` | `{assignment, Review, and acceptance refs}` |
| `{order}` | `design.md` | `{level}` | `{stable key}` | Design | `{row link}` | `{same-subject Problem Definition and cited ancestor sections}` | `{refs}` |
| `{order}` | `specification.md` | `{level}` | `{stable key}` | Specification | `{row link}` | `{same-subject earlier phases and cited ancestor sections}` | `{refs}` |
| `{order}` | `lifecycle-and-use-cases.md` | `{level}` | `{stable key}` | Lifecycle and Use Cases | `{row link}` | `{same-subject earlier phases and cited ancestor sections}` | `{refs}` |

Register the Project's four rows first, then all Product rows in Product order, then one Implementation's four
rows for each Product in that same order.

## Evidence

### Acceptance and Revalidation

| Level | Stable subject key | Phase | Iteration | Run kind | Review assignment and result | User acceptance or confirmation | Evidence status |
|---|---|---|---|---|---|---|---|
| `{level or Finalization}` | `{stable key or none}` | `{phase or Finalization}` | `{iteration}` | `{normal or completed-v3 revalidation}` | `{assignment and accepted result}` | `{decision and timestamp}` | `{open or accepted}` |

### Sources and Claims

| Level | Stable subject key | Phase | Evidence | Source | Kind | Strength | Supports or disputes |
|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{summary}` | `{source}` | `{fact, user report, decision, plan, or open}` | `{verified, supported, unverified, or disputed}` | `{claim}` |

### Topics and Questions

| Level | Stable subject key | Phase | Topic or question | Adapted wording | Origin | Status | Shared answer/evidence reference | Reason or dependency |
|---|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{topic or [question-name]}` | `{subject-specific wording}` | `{level bank, Study, Interview, or Review}` | `{prepared, evidence-derived, to ask, answered, dropped, reopened, or deferred}` | `{accepted checkpoint or none}` | `{reason}` |

### Lifecycle Scenario Candidates

| Level | Stable subject key | Phase | Scenario identity and class | Purpose | Linked accepted decisions and sections | Concrete-scenario blocker | Oracle blocker | Status |
|---|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `Lifecycle and Use Cases` | `{identity and class}` | `{purpose}` | `{links}` | `{blocker or none}` | `{blocker or none}` | `{candidate, ready, deferred, or dropped}` |

### Answers and Decisions

| Level | Stable subject key | Phase | Question | Answer or decision | Kind | Evidence and strength | Recorded iteration |
|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{[question-name]}` | `{faithful summary}` | `{fact, user report, decision, plan, or open}` | `{source and strength}` | `{iteration}` |

### Vocabulary

| Level | Stable subject key | Phase | Term | Proposed or agreed definition | Status | Conflict or question |
|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{term}` | `{definition}` | `{proposed, agreed, or disputed}` | `{issue or none}` |

### Delegated Assignments

| Assignment | Level | Stable subject key | Phase and stage | Iteration | Authority | Inputs and allowed paths | Returned result | Manager verification | Status |
|---|---|---|---|---|---|---|---|---|---|
| `{fresh stable assignment}` | `{level or Finalization}` | `{stable key or none}` | `{phase and stage}` | `{iteration}` | `{read-only or ordered writer}` | `{inputs and paths}` | `{result or NEEDS_CONTEXT question}` | `{verification}` | `{assigned, returned, accepted, or blocked}` |

### Context Checkpoints

| Blocked assignment | Level | Stable subject key | Phase and stage | Iteration | Exact question | User answer | Answer checkpoint | Status |
|---|---|---|---|---|---|---|---|---|
| `{assignment}` | `{level or Finalization}` | `{stable key or none}` | `{phase and stage}` | `{iteration}` | `{question}` | `{faithful summary or not yet}` | `{assignment or not yet}` | `{blocked, answered, or accepted}` |

### Corrections and Reopen Effects

| Level | Stable subject key | Phase | Earlier decision | Current decision | User resolution | Earliest owner work unit | Reachable stale set |
|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{earlier}` | `{current}` | `{resolution}` | `{level, stable key, and phase}` | `{later phases, reachable descendants/sections, and synthesis}` |

### Refusals Without Correction

| Level | Stable subject key | Phase | Actual stage | Refusal decision and evidence | Successor | Correction reference |
|---|---|---|---|---|---|---|
| `{level or Finalization}` | `{stable key or none}` | `{phase or Finalization}` | `{REVIEW or CONTEXT}` | `{decision, timestamp, and checkpoint}` | `{same work unit or Finalization at STUDY}` | `none` |

### Review Findings

| Level | Stable subject key | Phase | Iteration | Lens | Finding and evidence | Consequence | Follow-up question | Disposition |
|---|---|---|---|---|---|---|---|---|
| `{level or Finalization}` | `{stable key or none}` | `{phase}` | `{iteration}` | `{coverage, specificity, vocabulary, consistency, traceability, unsupported direction, load-bearing open decisions, or cold-reader quality}` | `{finding and evidence}` | `{effect}` | `{one exact question}` | `{open, resolved, or owned deferral}` |

### Owned Deferrals

| Level | Stable subject key | Phase | Item | Blocking status | Owner | Consequence | Resolution method | Reopen condition |
|---|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{item}` | `nonblocking` | `{owner}` | `{effect}` | `{method}` | `{condition}` |

The Review taxonomy is exactly `coverage`, `specificity`, `vocabulary`, `consistency`, `traceability`,
`unsupported direction`, `load-bearing open decisions`, and `cold-reader quality`. Keep this record
proof-only. It states no future action, route position, aggregate state, or terminal Finalization state. Do
not record raw conversation, credentials, secrets, or user-marked sensitive values.
