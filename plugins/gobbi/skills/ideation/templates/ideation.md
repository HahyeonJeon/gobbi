# {Idea or Problem Name} — Ideation

> **Document role:** Integrated Ideation result<br>
> **Purpose:** Preserve the finalized problem, study foundation, hierarchical decisions, and integrated design as one independently readable result.
> **Output boundary:** Do not include ordered implementation tasks, an implementation diff, or any produced realization such as a prototype, code spike, benchmark, experiment, or completed study. Record unperformed realization work only as future validation.

## Contents

- [Summary](#summary)
- [Requirements](#requirements)
- [Study](#study)
- [Topics](#topics)
- [Decisions](#decisions)
- [Design](#design)
- [Quality and Operations](#quality-and-operations)
- [Risks and Validation](#risks-and-validation)
- [Deferred and Rejected](#deferred-and-rejected)

## Summary

{State the final problem, desired outcome, selected direction, decisive evidence, major trade-offs, and final scope in a cold-readable summary.}

## Requirements

### Goal

> **Target:** {Restate the final kind of result and desired change.}<br>
> **Purpose:** {Restate why the result is needed.}<br>
> **Why now:** {Restate the trigger and why action matters now.}

### Problem

{Restate the final current situation, material evidence and uncertainty, supported problem or opportunity, impact, and relevant current or no-change context.}

### Result

| Actor | Need | Outcome |
|---|---|---|
| `{actor}` | `{need}` | `{desired observable outcome}` |

{Restate the final intended form, high-level capabilities, observable external behavior, inputs, outputs, integration boundary, and unchanged behavior.}

### Required Outcomes

#### {Descriptive Requirement Heading}

> **Statement:** {Final solution-neutral required outcome.}<br>
> **Affected actors:** {Actors or actor outcomes this requirement serves.}<br>
> **Basis:** {Why it applies and the supporting source or user decision.}<br>
> **Observable result:** {How a reader can recognize that the outcome is achieved.}

{Repeat for every final material requirement, including documented corrections to the supporting draft.}

### Scope

| Item | Status | Reason |
|---|---|---|
| `{outcome or surface}` | `{Included, Excluded, Deferred, or Rejected}` | `{reason}` |

### Questions

| Question | Resolution | Effect |
|---|---|---|
| `{question from requirements.md or added later}` | `{answer or explicit deferral}` | `{effect on the final design}` |

## Study

### Internal Study

| Source | Location | Assessment | License | Lesson |
|---|---|---|---|---|
| `{internal source, including late sources}` | `{path or link}` | `{authority, relevance, currency, and applicability}` | `{license assessment or N/A with reason}` | `{disposition and lesson}` |

### External Study

| Source | Link | Assessment | Lesson |
|---|---|---|---|
| `{external source, including late sources}` | `{URL}` | `{authority, currency, relevance, applicability, and license}` | `{disposition and lesson}` |

### Gaps and Conflicts

{Preserve useful failed approaches, source conflicts, unresolved uncertainty, and their design consequences.}

## Topics

```text
{Problem and Desired Outcome}
├── {Parent Topic}
│   ├── {Child Topic}
│   └── {Emergent Child Topic — added during discussion}
└── {Parent Topic}
```

{The problem and desired outcome are a visual root label, not a topic. Include every prepared and emergent topic below it, mark topics added during discussion, and keep every topic node aligned with a heading below.}

## Decisions

### {Parent Topic}

> **Question:** {State the material decision question this topic resolves.}<br>
> **Decision:** {Selected direction or resolved answer.}<br>
> **Status:** `{Resolved, Deferred, or Reopened}`<br>
> **Requirement connection:** {Exact descriptive requirement headings.}<br>
> **Source basis:** {Assessed internal and external sources.}

#### Context

{Explain the decision context, evidence, and relevant ancestor decisions.}

#### Options

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| `{option}` | `{pros}` | `{cons}` | `{fit}` | `{risks and consequences}` |

#### Decision

{State the recommendation, user decision when required, why it won, and what evidence would have changed it.}

#### Rejected Options

{Explain why each credible alternative lost.}

#### Consequences

{State trade-offs, affected branches, and the design this decision creates.}

#### Reopen When

{State the evidence or changed condition that would reopen this decision.}

#### {Child Topic}

> **Question:** {State the material decision question this child topic resolves.}<br>
> **Decision:** {Selected direction or resolved answer.}<br>
> **Status:** `{Resolved, Deferred, or Reopened}`<br>
> **Requirement connection:** {Exact descriptive requirement headings.}<br>
> **Source basis:** {Assessed internal and external sources.}

**Context:** {Explain the child decision context, evidence, and parent decision.}

**Options:**

| Option | Pros | Cons | Fit | Risks |
|---|---|---|---|---|
| `{option}` | `{pros}` | `{cons}` | `{fit}` | `{risks and consequences}` |

**Decision:** {State the recommendation, user decision when required, why it won, and what evidence would have changed it.}

**Rejected options:** {Explain why each credible alternative lost.}

**Consequences:** {State trade-offs, sibling effects, and the design this decision creates.}

**Reopen when:** {State the evidence or changed condition that would reopen this decision.}

{Repeat matching level-three, level-four, or deeper topic headings for every topic node below the visual root. Preserve decision synthesis rather than a conversational transcript.}

## Design

### Actors

{Define who does what and who owns each material decision or operation.}

### Structure

{Define the whole structure, consumer-readable contracts, acyclic dependency direction, contained dependency failure, verification seams, trust boundaries, and one owner per concern.}

### Data and State

{Define inputs, outputs, lifecycle states, invariants, retention or deletion, and exact boundary behavior.}

### Behavior and Recovery

{Define the main path, valid alternatives, invalid states, detection, containment, recovery, ownership, and diagnosis.}

## Quality and Operations

{Disposition applicable performance, resource, security, privacy, governance, accessibility, locale, compatibility, migration, rollback, observability, maintenance, and operational obligations. Give evidence for each not-applicable decision.}

## Risks and Validation

| Risk or Assumption | Impact | Evidence | Question | Method | Signals | Owner and Timing | Reopen When |
|---|---|---|---|---|---|---|---|
| `{assumption or risk}` | `{impact}` | `{existing evidence only}` | `{question the validation must answer}` | `{planned walkthrough, prototype, experiment, spike, benchmark, study, or other method; who or what participates}` | `Pass: {observable pass signal}; Fail: {observable fail signal}` | `{owner and when it runs}` | `{condition}` |

{Never describe planned validation as completed evidence.}

## Deferred and Rejected

| Idea | Status | Reason | Next Step |
|---|---|---|---|
| `{idea}` | `{disposition}` | `{reason}` | `{destination or condition}` |
