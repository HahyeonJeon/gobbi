# {Idea or Problem Name} — Ideation

> **Document role:** Final Ideation authority<br>
> **State:** `{Evolving until final user approval; authoritative after approval}`<br>
> **Authority:** After approval, this document supersedes `requirements.md` and `topics.md` automatically.<br>
> **Purpose:** Preserve the finalized problem, study foundation, hierarchical decisions, and integrated design as one independently readable result.
> **Output boundary:** Do not include ordered implementation tasks, an implementation diff, or any produced realization such as a prototype, code spike, benchmark, experiment, or completed study. Record unperformed realization work only as future validation.

## Contents

- [Executive Summary](#executive-summary)
- [Final Requirements and Problem Definition](#final-requirements-and-problem-definition)
- [Study Foundation](#study-foundation)
- [Final Topic Tree](#final-topic-tree)
- [Hierarchical Discussion and Decisions](#hierarchical-discussion-and-decisions)
- [Integrated Design](#integrated-design)
- [Quality, Constraints, and Operations](#quality-constraints-and-operations)
- [Assumptions, Risks, and Validation](#assumptions-risks-and-validation)
- [Changes from the Supporting Drafts](#changes-from-the-supporting-drafts)
- [Deferred and Rejected Ideas](#deferred-and-rejected-ideas)
- [Traceability and Completeness](#traceability-and-completeness)
- [Final Approval](#final-approval)

## Executive Summary

{State the root problem, desired outcome, selected direction, decisive evidence, major trade-offs, and final scope in a cold-readable summary.}

## Final Requirements and Problem Definition

### Material Statement Classification

| Exact heading path | Material statement | Type | Source, owner, or resolution |
|---|---|---|---|
| `{heading > child heading}` | `{fact, report, assumption, contradiction, decision, or question}` | `{Fact, User Report, Assumption, Contradiction, Decision, or Open Question}` | `{source, decision owner, or final resolution}` |

{Restate the complete six-way classification from the frozen requirements contract and include every approved correction made during discussion.}

### Trigger, Current Reality, and Root Problem

{Restate the finalized trigger, current behavior, direct evidence, root cause, consequences, and why now.}

### People, Authority, and Desired Outcomes

| Person or actor | Need or responsibility | Desired outcome | Decision authority |
|---|---|---|---|
| `{actor}` | `{need or responsibility}` | `{outcome}` | `{authority}` |

### Final Requirements

#### {Descriptive Requirement Heading}

> **Statement:** {Final required outcome or binding constraint.}<br>
> **Reason and evidence:** {Why it applies and the supporting source.}<br>
> **Observable success:** {Evidence that would prove it is met.}

{Repeat for every final material requirement, including approved corrections to the frozen supporting draft.}

### Scope, Constraints, and Success Conditions

{Restate final in-scope, out-of-scope, non-goal, constraint, authority, success, failure, falsification, and stop conditions.}

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

| Frozen heading path or prepared topic | Final change | New evidence | User approval when material | Affected branches and consequence |
|---|---|---|---|---|
| `{requirements.md or topics.md > heading path}` | `{correction, addition, removal, or changed decision}` | `{source}` | `{approval evidence}` | `{propagation}` |

{Include late sources, corrected requirements, emergent topics, reopened branches, and changed constraints. State “No changes” only after comparing both frozen drafts with this document.}

## Deferred and Rejected Ideas

| Idea | Deferred or rejected | Reason | Destination, drop decision, or reopen condition |
|---|---|---|---|
| `{idea}` | `{disposition}` | `{reason}` | `{destination or condition}` |

## Traceability and Completeness

| Final requirement heading | Source headings | Topic and decision heading paths | Resulting design heading | Risk or validation heading |
|---|---|---|---|---|
| `{descriptive requirement heading}` | `{source links or paths}` | `{heading paths}` | `{heading path}` | `{heading path or N/A with reason}` |

{Confirm every material requirement, source, topic, decision, design consequence, risk, validation commitment, and supporting-draft change resolves by descriptive heading path. Confirm all links resolve and all applicable concerns are covered.}

## Final Approval

> **Approval condition:** The user confirms that this document completely and accurately expresses the final problem, requirements, evidence, decisions, and integrated design.<br>
> **Authority effect:** Approval makes this the authoritative Ideation result and automatically supersedes the frozen `requirements.md` and `topics.md`.<br>
> **Return set:** Return all three documents together; the supporting drafts remain unchanged historical inputs.

{Record the approval evidence outside this document in the surrounding result without rewriting either frozen supporting draft.}
