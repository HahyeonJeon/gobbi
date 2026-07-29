# {Title} - Requirements

## Contents

- [Goal](#goal)
- [Problem](#problem)
- [Result](#result)
- [Requirements](#requirements)
- [Scope](#scope)
- [Open Questions](#open-questions)
- [Approval](#approval)

## Goal

> **Target:** {State what kind of result is being shaped and the desired change.}<br>
> **Purpose:** {Explain why the result is needed.}<br>
> **Why now:** {State the trigger and why action matters now.}

## Problem

### Current Situation

{Describe current behavior, relevant prior attempts, and direct evidence. Attribute user reports, cite inspected facts, and state material uncertainty where it appears.}

### Problem and Impact

{State the supported problem or opportunity, affected outcomes, and consequences. Distinguish a supported cause from a causal hypothesis.}

### Current and No-Change Context

{Describe the current approach or workaround and the strongest credible result of making no change when either affects the decision to act.}

## Result

### Actors and Outcomes

| Actor | Need | Desired observable outcome |
|---|---|---|
| `{person, group, system, or other affected actor}` | `{current need}` | `{outcome}` |

### Expected Result

{Describe the intended form, high-level capabilities, and observable external behavior without selecting an internal design.}

### External Boundary

| Aspect | Description |
|---|---|
| Inputs | `{material inputs, when applicable}` |
| Outputs | `{material outputs, when applicable}` |
| Integration boundary | `{where the result connects to existing behavior and where its obligation stops}` |
| Unchanged behavior | `{existing behavior that must remain unchanged, when applicable}` |

{Use only applicable rows. Do not prescribe internal structure, conventions, implementation mechanisms, or ordered tasks.}

## Requirements

### {Requirement}

> **Statement:** {State one solution-neutral outcome the result must achieve.}<br>
> **Affected actors:** {Name the actors or actor outcomes this requirement serves.}<br>
> **Basis:** {Explain why the requirement follows from the goal, problem, or user decision and cite material evidence.}<br>
> **Observable result:** {Describe how a reader can recognize that the outcome is achieved.}

{Add one descriptive level-three heading and block for every material requirement.}

## Scope

| Item | Status | Reason |
|---|---|---|
| `{outcome or surface}` | `{Included, Excluded, Deferred, or Rejected}` | `{why this status is correct}` |

{Give every material outcome and user-named surface exactly one status.}

## Open Questions

| Question | Why it matters | Related section |
|---|---|---|
| `{question that remains to be studied or discussed}` | `{what depends on the answer}` | `{Goal, Problem, Result, Requirement, or Scope heading}` |

{Resolve every question that could change the goal, problem, result, requirements, or scope before approval. Retain only questions whose answers can refine the later design without changing this contract.}

## Approval

> **Approval condition:** The user confirms that the goal, problem, result, requirements, scope, and open questions are complete, accurate, and solution-neutral, with no unresolved question that could change this contract.<br>
> **Freeze effect:** Approval freezes the whole file without a later status edit. All later corrections appear only in `ideation.md`.<br>
> **Supersession effect:** User approval of the final `ideation.md` automatically supersedes this supporting draft.

{Before freeze, record the approval evidence outside this file or in the surrounding discussion; do not edit this section after approval.}
