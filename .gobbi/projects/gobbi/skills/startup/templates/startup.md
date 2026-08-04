# {Project} — Startup Design

> **Document role:** Confirmed synthesis and index for the complete Startup design set.<br>
> **Boundary:** This is not a formal evaluation, implementation plan, ordered task list, or memory destination.

The `Confirmation` section is the sole owner of terminal Finalization state. Read aggregate section state,
Review evidence, and user acceptance from each child document's Section Register.

## Phase Document Artifact Register

| Artifact | Role | Required sections | Status | Accepted |
|---|---|---|---|---|
| [`problem-definition.md`](problem-definition.md) | Problem Definition | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |
| [`design.md`](design.md) | Design | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |
| [`specification.md`](specification.md) | Specification | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |
| [`product-lifecycle.md`](product-lifecycle.md) | Product Lifecycle | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |
| [`development-lifecycle.md`](development-lifecycle.md) | Development Lifecycle | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |

## Integrated Design

### Executive Summary

{State the problem, affected people, durable outcome, chosen direction, decisive evidence, and principal
tradeoffs so a cold reader can understand the Project without opening the child documents.}

### Project, Products, and Implementations

| Level | Stable subject key | Name | Parent | Owned result | Accepted section links |
|---|---|---|---|---|---|
| Project | `{project-key}` | `{Project}` | `none` | `{service or initiative result}` | `{five links}` |
| Product | `{product-key}` | `{Product}` | `{project-key}` | `{independently useful application or platform result}` | `{five links}` |
| Implementation | `{implementation-key}` | `{Product} Implementation` | `{product-key}` | `{the Product's complete technical realization}` | `{five links}` |

Repeat Product and Implementation rows in accepted Product order. Each Product has exactly one
Implementation. Summarize categorized stack entries under the owning Implementation; never turn an entry
into a hierarchy subject.

### Capabilities, Contracts, and Operating Model

{Summarize Product capabilities, Project-wide policy, observable behavior, quality obligations, ownership,
actor-visible Product Lifecycle promises, and complete-stack Development Lifecycle mechanisms and evidence.}

### Key Decisions and Cross-Phase Traceability

| Decision | Level and stable subject key | Problem evidence | Design owner | Specification obligation | Product Lifecycle promise | Development Lifecycle mechanism and evidence |
|---|---|---|---|---|---|---|
| `{decision}` | `{level; key}` | `{link}` | `{link}` | `{link}` | `{product scenario or decision link}` | `{development scenario, oracle, and evidence link}` |

### Consolidated Vocabulary

| Term | Agreed definition | Owning level and phase | Applies in |
|---|---|---|---|
| `{term}` | `{definition}` | `{owner}` | `{scope}` |

### Risks and Owned Deferrals

| Item | Level and stable subject key | Consequence | Owner | Resolution method | Reopen condition |
|---|---|---|---|---|---|
| `{item}` | `{owner}` | `{effect}` | `{person or authority}` | `{method}` | `{condition}` |

### Final Review Findings and Dispositions

| Lens | Finding and evidence | Consequence | Follow-up question | Disposition |
|---|---|---|---|---|
| `{coverage, specificity, vocabulary, consistency, traceability, unsupported direction, load-bearing open decisions, or cold-reader quality}` | `{finding and evidence or none}` | `{effect or none}` | `{one exact question or none}` | `{resolved or owned deferral}` |

Use exactly `coverage`, `specificity`, `vocabulary`, `consistency`, `traceability`, `unsupported direction`,
`load-bearing open decisions`, and `cold-reader quality` for Finalization Review.

## Confirmation

- Startup schema: `4`
- Project root: `{absolute-project-root}`
- Output directory: `{absolute-output-directory}`
- Finalization state: `confirmed`
- Confirmed: `{timestamp}`
- The user confirmed: `{the complete six-file design set, in one sentence}`
