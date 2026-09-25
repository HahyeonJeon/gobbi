# {Idea or Problem Name} — Coding Ideation Part {NN}

> **Index:** [Coding Ideation](ideation-index.md)<br>
> **Covers:** {One coherent work-definition or idea group.}

{Keep only the applicable complete content groups below. Do not split a paragraph, requirement block, design heading, table, or recovery contract across parts.}

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

{Keep the three headings in this order. Start each one with `Inherited — {pointer}`, `Not applicable — {reason}`, or `Material change`, and give the design only under `Material change`. Never leave a heading empty. For each Discussion topic that links to a heading, state the chosen option, why it won, its trade-offs, and the evidence that would reopen it.}

### Conceptual Definition

{What will be implemented, and the vocabulary for it. Name no directory, file, class, or function.}

### Class and Function Design

| Unit | Conceptual definition | Responsibility | Boundary | Relationship | Caller contract |
|---|---|---|---|---|---|
| `{public class or function}` | `{one sentence in domain words, with no "and"}` | `{the one decision or fact only it changes}` | `{what it hides and the neighbours it never imports}` | `{what it uses and what uses it}` | `{inputs, outputs, and errors}` |

{Add one row per new or changed public class and public function. Private helpers get no row. No pattern is the default: for each added pattern, interface, or base class, name the present force it answers and the simpler form it replaces.}

### Codebase Structure

```text
{package}/
  {directory}/
    {file}  → uses {file}
    {file}
```

| Unit | Conceptual definition | Responsibility | Boundary | Relationship |
|---|---|---|---|---|
| `{directory or file}` | `{one sentence in domain words, with no "and"}` | `{the one decision or fact only it changes}` | `{what it hides and the neighbours it never imports}` | `{what it uses and what uses it}` |

{Draw the new or changed directories and files with one-way `→ uses` arrows, then add one row for each of them.}
