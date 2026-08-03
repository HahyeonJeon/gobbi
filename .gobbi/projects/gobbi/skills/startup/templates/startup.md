# {Project} — Startup Design

> **Document role:** Confirmed synthesis and index for the complete Startup design set.<br>
> **Boundary:** This is not a formal evaluation, implementation plan, ordered task list, or memory destination.<br>
> **Example:** The synthesis may show one Project with multiple Products and each Product's one complete
> Implementation; categorized technologies remain entries within their Implementation.

## Phase Document Artifact Register

| Artifact | Role | Required sections | Status | Accepted |
|---|---|---|---|---|
| [`problem-definition.md`](problem-definition.md) | Problem Definition | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |
| [`design.md`](design.md) | Design | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |
| [`specification.md`](specification.md) | Specification | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |
| [`lifecycle-and-use-cases.md`](lifecycle-and-use-cases.md) | Lifecycle and Use Cases | `Project, all Products, all Implementations` | `confirmed` | `{timestamp}` |

## Integrated Design

### Executive Summary

{State the problem, affected people, durable outcome, chosen direction, decisive evidence, and principal
tradeoffs so a cold reader can understand the Project without opening the child documents.}

### Project, Products, and Implementations

| Level | Stable subject key | Name | Parent | Owned result | Accepted section links |
|---|---|---|---|---|---|
| Project | `{project-key}` | `{Project}` | `none` | `{service or initiative result}` | `{four links}` |
| Product | `{product-key}` | `{Product}` | `{project-key}` | `{independently useful application or platform result}` | `{four links}` |
| Implementation | `{implementation-key}` | `{Product} Implementation` | `{product-key}` | `{the Product's complete technical realization}` | `{four links}` |

Repeat Product and Implementation rows in accepted Product order. Each Product has exactly one
Implementation. Summarize categorized stack entries under the owning Implementation; never turn an entry
into a hierarchy subject.

### Capabilities, Contracts, and Operating Model

{Summarize Product capabilities, Project-wide policy, observable behavior, quality obligations, ownership,
service operation, Product use and recovery, and Implementation development and evolution.}

### Key Decisions and Cross-Phase Traceability

| Decision | Level and stable subject key | Problem evidence | Design owner | Specification obligation | Lifecycle or use case |
|---|---|---|---|---|---|
| `{decision}` | `{level; key}` | `{link}` | `{link}` | `{link}` | `{link}` |

### Consolidated Vocabulary

| Term | Agreed definition | Owning level and phase | Applies in |
|---|---|---|---|
| `{term}` | `{definition}` | `{owner}` | `{scope}` |

### Risks and Owned Deferrals

| Item | Level and stable subject key | Consequence | Owner | Resolution method | Reopen condition |
|---|---|---|---|---|---|
| `{item}` | `{owner}` | `{effect}` | `{person or authority}` | `{method}` | `{condition}` |

### Final Review Findings and Dispositions

| Lens | Finding and evidence | Disposition | Follow-up question |
|---|---|---|---|
| `{coverage, specificity, vocabulary, consistency, traceability, or quality}` | `{finding or none}` | `{resolved or owned deferral}` | `{question or none}` |

## Confirmation

- Startup schema: `3`
- Project root: `{absolute-project-root}`
- Output directory: `{absolute-output-directory}`
- Confirmed: `{timestamp}`
- The user confirmed: `{the complete five-file design set, in one sentence}`
