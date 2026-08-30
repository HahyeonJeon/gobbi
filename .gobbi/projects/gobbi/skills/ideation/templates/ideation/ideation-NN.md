# {Idea or Problem Name} — Ideation Part {NN}

> **Index:** [Ideation](ideation-index.md)<br>
> **Covers:** {One coherent section group or complete top-level topic branch.}

{Keep only the applicable complete content groups below. Do not split a paragraph, requirement block, topic decision, table row, or recovery contract across parts.}

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

## Study

### Internal Sources

| Source | Location | Assessment | Lesson |
|---|---|---|---|
| `{source}` | `{path or link}` | `{authority, relevance, currency, applicability, and reuse limit}` | `{adopted, rejected, or uncertain lesson}` |

### External Sources

| Source | Link | Assessment | Lesson |
|---|---|---|---|
| `{source}` | `{URL}` | `{authority, relevance, currency, applicability, and reuse limit}` | `{adopted, rejected, or uncertain lesson}` |

### Gaps and Conflicts

{State useful failed approaches, source conflicts, unresolved uncertainty, and design consequences.}

## Topics

```text
{Problem and Desired Outcome}
├── {Parent Topic}
│   └── {Child Topic}
└── {Parent Topic}
```

{Include every prepared and emergent topic. The problem and outcome are the visual root, not a topic.}

## Decisions

### {Parent Topic}

> **Question:** {Material decision question.}<br>
> **Decision:** {Selected direction or resolved answer.}<br>
> **Status:** `{Resolved, Deferred, or Reopened}`<br>
> **Requirements:** {Connected requirement headings.}<br>
> **Sources:** {Assessed sources.}

#### Context

{State the evidence and relevant ancestor decisions.}

#### Options

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| `{option}` | `{pros}` | `{cons}` | `{fit}` | `{risks and consequences}` |

#### Decision

{State the recommendation, user decision when required, why it won, and what evidence would change it.}

#### Consequences

{State rejected options, trade-offs, affected branches, design effects, and the reopen condition.}

{Keep each parent topic with its decision. Render each child topic as the next heading level below its parent,
repeat the complete decision block with its detail headings one level below that child, and continue
recursively. When another level would become unclear or exceed Markdown heading depth, place the complete
child branch in another listed Ideation part and link it from the parent.}

## Design

{Fill each Design heading only when that object is in the supplied design-and-decision scope. Keep the Design headings. An empty unscoped section is not an in-contract absence.}

### Actors

{Define in-scope responsibilities and ownership.}

### Structure

{Define in-scope boundaries, components, interfaces, dependencies, verification points, and trust boundaries.}

### Data and State

{Define in-scope inputs, outputs, states, invariants, retention, deletion, and boundary behavior.}

### Behavior and Recovery

{Define the in-scope main path, valid alternatives, invalid states, detection, containment, recovery, ownership, and diagnosis.}

## Quality and Operations

{Address in-scope performance, resources, security, privacy, governance, accessibility, locale, compatibility, migration, rollback, observability, maintenance, and operational needs. Keep the heading. An empty unscoped section is not an in-contract absence. Give evidence for an in-scope not-applicable decision.}

## Risks and Validation

| Risk or Assumption | Impact | Evidence | Question | Method | Signals | Owner and Timing | Reopen When |
|---|---|---|---|---|---|---|---|
| `{risk or assumption}` | `{impact}` | `{existing evidence}` | `{question}` | `{future method}` | `Pass: {signal}; Fail: {signal}` | `{owner and timing}` | `{condition}` |

{Do not present planned validation as completed evidence.}

## Deferred and Rejected

| Idea | Status | Reason | Next Step |
|---|---|---|---|
| `{idea}` | `{Deferred or Rejected}` | `{reason}` | `{destination or condition}` |
