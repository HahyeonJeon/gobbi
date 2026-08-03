# Startup Working Record

This schema-3 file owns identity and evidence for one Startup run. The native TODO owns progression. This
record contains no future-action cursor. For example, a Web Dashboard Product register row creates exactly
one Web Dashboard Implementation row even before its categorized stack entries are known.

## Run Identity

- Startup schema: `3`
- Project root: `{absolute-project-root}`
- Output directory: `{absolute-output-directory}`
- Status: `{in progress | paused}`
- Recovery mode: `{normal | completed-v3 revalidation}`
- Current blocker: `{none or exact blocker}`

## Artifact Register

| Artifact | Phase | State | Required section evidence | Evidence on disk |
|---|---|---|---|---|
| `problem-definition.md` | Problem Definition | `{absent, draft, reviewed, stale, or confirmed}` | `{all current subject rows}` | `{evidence}` |
| `design.md` | Design | `{state}` | `{all current subject rows}` | `{evidence}` |
| `specification.md` | Specification | `{state}` | `{all current subject rows}` | `{evidence}` |
| `lifecycle-and-use-cases.md` | Lifecycle and Use Cases | `{state}` | `{all current subject rows}` | `{evidence}` |
| `startup.md` | Finalization | `{state}` | `{all four aggregate artifacts and current sections}` | `{evidence}` |

Derive each aggregate artifact state from its required Phase Section Register rows. Any stale row makes it
`stale`; all required rows must be confirmed for `confirmed`; otherwise use the earliest incomplete row's
state. Never use whole-file presence as confirmation.

## Subject Register

| Order | Level | Stable subject key | Parent key | Description | Status |
|---|---|---|---|---|---|
| `0` | Project | `{project-key}` | `none` | `{top-level service or initiative}` | `{current or stale}` |
| `{Product order}` | Product | `{product-key}` | `{project-key}` | `{independently useful application or platform}` | `{current or stale}` |
| `{same Product order}` | Implementation | `{implementation-key}` | `{product-key}` | `{the Product's single complete stack; entries may be unknown}` | `{current or stale}` |

Every Product row requires exactly one Implementation row with a stable one-to-one identity. Categorized
technology entries belong in the aggregate Design section and never appear as Subject Register rows.

## Phase Section Register

| Route order | Artifact | Level | Stable subject key | Phase | State | Depends on | Section evidence | User acceptance |
|---|---|---|---|---|---|---|---|---|
| `{order}` | `problem-definition.md` | `{Project, Product, or Implementation}` | `{stable key}` | Problem Definition | `{absent, draft, reviewed, stale, or confirmed}` | `{accepted ancestor or none}` | `{disk and assignment evidence}` | `{decision and timestamp or not yet}` |
| `{order}` | `design.md` | `{level}` | `{stable key}` | Design | `{state}` | `{same-subject Problem Definition and cited ancestor sections}` | `{evidence}` | `{acceptance}` |
| `{order}` | `specification.md` | `{level}` | `{stable key}` | Specification | `{state}` | `{same-subject earlier phases and cited ancestor sections}` | `{evidence}` | `{acceptance}` |
| `{order}` | `lifecycle-and-use-cases.md` | `{level}` | `{stable key}` | Lifecycle and Use Cases | `{state}` | `{same-subject earlier phases and cited ancestor sections}` | `{evidence}` | `{acceptance}` |

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

| Level | Stable subject key | Phase | Topic or question | Adapted wording | Origin | Status | Reason or dependency |
|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{topic or [question-name]}` | `{subject-specific wording}` | `{level bank, Study, Interview, or Review}` | `{prepared, to ask, answered, dropped, reopened, or deferred}` | `{reason}` |

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

| Level | Stable subject key | Phase | Earlier decision | Current decision | User resolution | Earliest reopened tuple | Reachable sections made stale |
|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{earlier}` | `{current}` | `{resolution}` | `{level, stable key, and phase}` | `{sections and startup.md}` |

### Review Findings

| Level | Stable subject key | Phase | Iteration | Lens | Finding and evidence | Consequence | Follow-up question | Disposition |
|---|---|---|---|---|---|---|---|---|
| `{level or Finalization}` | `{stable key or none}` | `{phase}` | `{iteration}` | `{coverage, specificity, vocabulary, consistency, traceability, or quality}` | `{finding}` | `{effect}` | `{question or none}` | `{open, resolved, or owned deferral}` |

### Owned Deferrals

| Level | Stable subject key | Phase | Item | Blocking status | Owner | Consequence | Resolution method | Reopen condition |
|---|---|---|---|---|---|---|---|---|
| `{level}` | `{stable key}` | `{phase}` | `{item}` | `nonblocking` | `{owner}` | `{effect}` | `{method}` | `{condition}` |

Keep this record proof-only. It must state no future action or route position. Do not record raw conversation,
credentials, secrets, or user-marked sensitive values.
