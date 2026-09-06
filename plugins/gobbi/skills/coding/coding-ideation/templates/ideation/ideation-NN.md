# {Idea or Problem Name} — Coding Ideation Part {NN}

> **Index:** [Coding Ideation](ideation-index.md)<br>
> **Covers:** {One coherent work-definition or idea group.}

{Keep only the applicable complete content groups below. Do not split a paragraph, requirement block, design heading, table row, or recovery contract across parts.}

## Summary

{State the final problem, desired outcome, selected direction, decisive evidence, major trade-offs, and scope. Keep the summary in one part only.}

## Requirements

### Goal

> **Target:** {Final result and desired change.}<br>
> **Purpose:** {Why the result is needed.}<br>
> **Why now:** {Trigger and reason action matters now.}

### Problem

{State the supported current situation, evidence, uncertainty, problem or opportunity, impact, and no-change context.}

### Result

| Actor | Need | Outcome |
|---|---|---|
| `{actor}` | `{need}` | `{desired observable outcome}` |

{State the intended form, capabilities, observable behavior, inputs, outputs, integration boundary, and unchanged behavior.}

### Required Outcomes

#### {Requirement}

> **Statement:** {Solution-neutral required outcome.}<br>
> **Affected actors:** {Actors or outcomes served.}<br>
> **Basis:** {Reason, source, or user decision.}<br>
> **Observable result:** {How a reader recognizes success.}

### Scope

| Item | Status | Reason |
|---|---|---|
| `{outcome or surface}` | `{Included, Excluded, Deferred, or Rejected}` | `{reason}` |

### Questions

| Question | Resolution | Effect |
|---|---|---|
| `{material question}` | `{answer or explicit deferral}` | `{effect on the design}` |

## Design

{State the accepted idea: what to do and how to do it, to the depth planning and execution need. These headings are the code-design ladder in dependency order. Fill each heading only when that object is in the supplied design-and-decision scope. Keep the headings. An empty unscoped section is not an in-contract absence.}

### Architecture and Structure

{System context, responsibilities, logical units, boundaries, dependency direction, integration seams, control and data flow, trust boundaries, failure containment, and data ownership.}

### Strategy and Policy

{Behavior, state transitions, error and recovery, data consistency, concurrency, retention, migration, security, privacy, compatibility, performance, and observability. Keep strategy above construction.}

### Pattern and Class Diagram

{Selected pattern and the class or equivalent structural diagram from the accepted responsibilities and policies. When classes do not apply, record why and which structure replaces them.}

### Public Contract

{Consumer examples, public operations, boundary-visible data, inputs, outputs, effects, ownership, invariants, errors, and lifecycle. Exclude private construction.}
