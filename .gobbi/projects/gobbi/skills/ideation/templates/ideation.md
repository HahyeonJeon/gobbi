# {Idea or Problem Name} — Ideation

> **Document role:** Integrated Ideation result<br>
> **Purpose:** Preserve the finalized problem, study foundation, hierarchical decisions, and integrated design as one independently readable result.
> **Output boundary:** Do not include ordered implementation tasks, an implementation diff, or any produced realization such as a prototype, code spike, benchmark, experiment, or completed study. Record unperformed realization work only as future validation.

## Contents

- [Executive Summary](#executive-summary)
- [Final Requirements](#final-requirements)
- [Study Foundation](#study-foundation)
- [Final Topic Tree](#final-topic-tree)
- [Hierarchical Discussion and Decisions](#hierarchical-discussion-and-decisions)
- [Integrated Design](#integrated-design)
- [Quality, Constraints, and Operations](#quality-constraints-and-operations)
- [Assumptions, Risks, and Validation](#assumptions-risks-and-validation)
- [Changes from the Supporting Drafts](#changes-from-the-supporting-drafts)
- [Deferred and Rejected Ideas](#deferred-and-rejected-ideas)
- [Traceability and Completeness](#traceability-and-completeness)

## Executive Summary

{State the final problem, desired outcome, selected direction, decisive evidence, major trade-offs, and final scope in a cold-readable summary.}

## Final Requirements

### Goal

> **Target:** {Restate the final kind of result and desired change.}<br>
> **Purpose:** {Restate why the result is needed.}<br>
> **Why now:** {Restate the trigger and why action matters now.}

### Problem

{Restate the final current situation, material evidence and uncertainty, supported problem or opportunity, impact, and relevant current or no-change context.}

### Result

| Actor | Need | Desired observable outcome |
|---|---|---|
| `{actor}` | `{need}` | `{outcome}` |

{Restate the final intended form, high-level capabilities, observable external behavior, inputs, outputs, integration boundary, and unchanged behavior.}

### Requirements

#### {Descriptive Requirement Heading}

> **Statement:** {Final solution-neutral required outcome.}<br>
> **Affected actors:** {Actors or actor outcomes this requirement serves.}<br>
> **Basis:** {Why it applies and the supporting source or user decision.}<br>
> **Observable result:** {How a reader can recognize that the outcome is achieved.}

{Repeat for every final material requirement, including documented corrections to the supporting draft.}

### Scope

| Item | Final status | Reason |
|---|---|---|
| `{outcome or surface}` | `{Included, Excluded, Deferred, or Rejected}` | `{reason}` |

### Open Questions

| Supporting question | Final resolution or deferral | Design consequence |
|---|---|---|
| `{question from requirements.md or added later}` | `{answer or explicit deferral}` | `{effect on the final design}` |

## Study Foundation

### Internal Materials

| Material | Stable location | Authority, relevance, currency, and applicability | Licensing when reuse may be affected | Adopted, rejected, or uncertain lesson |
|---|---|---|---|---|
| `{internal source, including late sources}` | `{path or link}` | `{assessment of every named property}` | `{license assessment or N/A with reason}` | `{disposition and lesson}` |

### External Materials

| Material | Link | Authority, currency, relevance, applicability, and license | Adopted, rejected, or uncertain lesson |
|---|---|---|---|
| `{external source, including late sources}` | `{URL}` | `{assessment}` | `{disposition and lesson}` |

### Negative Results, Contradictions, and Gaps

{Preserve useful failed approaches, source conflicts, unresolved uncertainty, and their design consequences.}

## Final Topic Tree

```text
{Problem and Desired Outcome}
├── {Parent Topic}
│   ├── {Child Topic}
│   └── {Emergent Child Topic — added during discussion}
└── {Parent Topic}
```

{Include every prepared and emergent topic. Mark topics added during discussion and keep the tree aligned with the headings below.}

## Hierarchical Discussion and Decisions

### {Parent Topic}

> **Question:** {State the material decision question this topic resolves.}<br>
> **Decision:** {Selected direction or resolved answer.}<br>
> **Status:** `{Resolved, Deferred, or Reopened}`<br>
> **Requirement connection:** {Exact descriptive requirement headings.}<br>
> **Source basis:** {Assessed internal and external sources.}

#### Context and Evidence

{Explain the decision context, evidence, and relevant ancestor decisions.}

#### Alternatives

| Alternative | Pros | Cons | Fit with outcomes and constraints | Risks and consequences |
|---|---|---|---|---|
| `{alternative}` | `{pros}` | `{cons}` | `{fit}` | `{risks and consequences}` |

#### Selection and Rationale

{State the recommendation, user decision when required, why it won, and what evidence would have changed it.}

#### Rejected Alternatives

{Explain why each credible alternative lost.}

#### Consequences and Resulting Design

{State trade-offs, affected branches, and the design this decision creates.}

#### Reopen Condition

{State the evidence or changed condition that would reopen this decision.}

#### {Child Topic}

> **Question:** {State the material decision question this child topic resolves.}<br>
> **Decision:** {Selected direction or resolved answer.}<br>
> **Status:** `{Resolved, Deferred, or Reopened}`<br>
> **Requirement connection:** {Exact descriptive requirement headings.}<br>
> **Source basis:** {Assessed internal and external sources.}

**Context and evidence:** {Explain the child decision context, evidence, and parent decision.}

**Alternatives:**

| Alternative | Pros | Cons | Fit with outcomes and constraints | Risks and consequences |
|---|---|---|---|---|
| `{alternative}` | `{pros}` | `{cons}` | `{fit}` | `{risks and consequences}` |

**Selection and rationale:** {State the recommendation, user decision when required, why it won, and what evidence would have changed it.}

**Rejected alternatives:** {Explain why each credible alternative lost.}

**Consequences and resulting design:** {State trade-offs, sibling effects, and the design this decision creates.}

**Reopen condition:** {State the evidence or changed condition that would reopen this decision.}

{Repeat matching level-three, level-four, or deeper topic headings for every node. Preserve decision synthesis rather than a conversational transcript.}

## Integrated Design

### Actors and Responsibilities

{Define who does what and who owns each material decision or operation.}

### Boundaries, Components, Ownership, and Interfaces

{Define the whole structure, consumer-readable contracts, acyclic dependency direction, contained dependency failure, verification seams, trust boundaries, and one owner per concern.}

### Information, Data, and State Flows

{Define inputs, outputs, lifecycle states, invariants, retention or deletion, and exact boundary behavior.}

### Normal, Alternative, Failure, and Recovery Flows

{Define the main path, valid alternatives, invalid states, detection, containment, recovery, ownership, and diagnosis.}

## Quality, Constraints, and Operations

{Disposition applicable performance, resource, security, privacy, governance, accessibility, locale, compatibility, migration, rollback, observability, maintenance, and operational obligations. Give evidence for each not-applicable decision.}

## Assumptions, Risks, and Validation

| Assumption or risk | What fails if wrong | Current evidence | Validation question | Method or artifact and participants or environment | Pass and fail signals | Owner and execution condition | Reopen condition |
|---|---|---|---|---|---|---|---|
| `{assumption or risk}` | `{impact}` | `{existing evidence only}` | `{question the validation must answer}` | `{planned walkthrough, prototype, experiment, spike, benchmark, study, or other method; who or what participates}` | `{signals}` | `{owner and when it runs}` | `{condition}` |

{Never describe planned validation as completed evidence.}

## Changes from the Supporting Drafts

| Supporting heading path or prepared topic | Final change | New evidence | User decision when material | Affected branches and consequence |
|---|---|---|---|---|
| `{requirements.md or topics.md > heading path}` | `{correction, addition, removal, or changed decision}` | `{source}` | `{user decision evidence}` | `{propagation}` |

{Include late sources, corrected requirements, emergent topics, reopened branches, and changed constraints. State “No changes” only after comparing both supporting drafts with this document.}

## Deferred and Rejected Ideas

| Idea | Deferred or rejected | Reason | Destination, drop decision, or reopen condition |
|---|---|---|---|
| `{idea}` | `{disposition}` | `{reason}` | `{destination or condition}` |

## Traceability and Completeness

| Final requirement heading | Source headings | Topic and decision heading paths | Resulting design heading | Risk or validation heading |
|---|---|---|---|---|
| `{descriptive requirement heading}` | `{source links or paths}` | `{heading paths}` | `{heading path}` | `{heading path or N/A with reason}` |

{Confirm every material requirement, source, topic, decision, design consequence, risk, validation commitment, and supporting-draft change resolves by descriptive heading path. Confirm all links resolve and all applicable concerns are covered.}
