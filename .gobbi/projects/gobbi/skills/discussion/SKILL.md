---
name: discussion
description: MUST load for any discussion with the user.
allowed-tools: Read, Grep, Glob, AskUserQuestion
skill-type: preference
---

# Discussion

Use this skill to make a task or user request concrete by clarifying its What, Why, and How. Also use it to ask the user for evidence, design direction, a decision, or explicit authority, to challenge prior direction, or to resolve a finding disposition. Discussion is a focused exchange that clarifies a request or helps the user make a choice. It ends with a concrete task, an explicit decision, or a clearly stated question that still needs an answer.

## Principles

### Study the problem and possible options

Before suggesting options, understand the request, the user's goal, the relevant evidence, prior decisions, constraints, and proven approaches. Develop options from what you learn, then compare how well each option serves the goal and what it costs.

### Challenge weak premises

Challenge assumptions, contradictions, vague claims, unrealistic expectations, missing edge cases, and weak evidence before they shape the task. Explain the concern plainly and support it with evidence. Agreement without scrutiny leaves the user choosing from a faulty premise.

### Present meaningful options with a recommendation

When the user must choose, present distinct options that fit the request and differ in ways that matter. Explain the relevant benefits, drawbacks, and constraints. Recommend the best-supported option, explain why it fits, and state what new evidence or changed constraint would change the recommendation.

### Finish with a usable outcome

A discussion is complete when it produces something that can guide the next step: a concrete task, an explicit decision, or a clearly stated unanswered question. State the outcome plainly so later work does not depend on reconstructing the exchange.

## Rules

Discussion applies whenever an agent clarifies a request, asks the user for input, challenges a premise, or resolves a user-owned choice. The relevant role or workflow owns authority, routing, record layout, and state transitions.

### Must-Follow

- **MUST use one question-card shape.** Every question begins with a `Topic` and `Description`. `Topic` names one question in a short phrase. `Description` states what needs an answer, why it matters, and the evidence already known. Add options only when the user has a real choice:

  ```text
  Topic: <one short phrase naming the question>
  Description: <what needs an answer, why it matters, and the evidence already known>

  Options:
    - Title: <option name; add "(Recommended)" to the recommended option>
      Description: <what the option means>
      Pros: <specific benefits>
      Cons: <specific costs, risks, or limits>
  ```

- **MUST make every option decision-ready.** Put the recommended option first and suffix its `Title` with `(Recommended)`. Its `Description` explains why it is recommended and what new evidence or changed constraint would change the recommendation. Make `Pros` and `Cons` specific to the affected behavior, path, measure, or maintenance cost. When the user interface cannot reproduce the fields, preserve the same information in compact prose.
- **MUST keep one topic per card.** Separate scope, success criteria, direction, constraints, and authority when they could receive different answers. A request for a missing fact uses the same `Topic` and `Description` header without invented options.
- **MUST write for quick understanding.** Expand each domain abbreviation on first use, briefly explain project-specific names, and cite evidence for numeric or project-specific claims.
- **MUST challenge a weak premise directly.** Name the claim, the contrary or missing evidence, the consequence, and what evidence would settle it. Preserve the user's current direction unless the user explicitly chooses a change.
- **MUST probe an unclear answer no more than twice.** Probe first with a concrete measure, example, source, baseline, or counterexample. If the gap remains, probe once more from that gap. Then state exactly what remains unknown and route it to the relevant owner.
- **MUST reuse an explicit answer.** If an earlier answer fully resolves a later question on the same topic, skip the repeated question and state which answer resolved it. If the earlier answer only implies a user-owned choice, ask for that choice explicitly.
- **MUST restate a materially changed contract.** When discussion changes direction, scope, success criteria, constraints, authority, or acceptance, restate the complete changed contract in plain language and obtain confirmation before work proceeds.

### Must-Not-Follow

- **NEVER invent options for a context request.** Ask for the missing fact through `Topic` and `Description`; do not manufacture a menu or recommendation.
- **NEVER use empty praise or soft agreement instead of a position.** Avoid phrases such as “That's interesting,” “Great question,” “You might want to consider,” “There are many ways to think about this,” “That could work,” “I can see why you'd think that,” “Maybe we should,” and an unnamed “It depends.” State the conclusion and reason, or name the exact dependency that prevents one.
- **NEVER revise an evaluated artifact before the user approves or edits the complete finding-disposition batch.** Preserve the evaluated artifact until that decision is explicit.

## References

- [`../workflow/SKILL.md`](../workflow/SKILL.md) owns manager authority, productive-step routing, dual-system requirements, and the requirement for one user-approved finding-disposition batch.
- [`../workflow/steps/evaluation.md`](../workflow/steps/evaluation.md) owns report aggregation, allowed finding dispositions, and the disposition gate's workflow mechanics.
- [`../workflow/steps/state-machine.md`](../workflow/steps/state-machine.md) owns iteration-cap, return, halt, abort, and transition mechanics.
- [`../workflow/delegation.md`](../workflow/delegation.md) owns specialist authority, the `NEEDS_CONTEXT` contract, and manager report handling.
- [`../record/SKILL.md`](../record/SKILL.md) owns durable decision evidence and the prohibition on retaining conversation exhaust.

This skill owns Question Card semantics, anti-sycophancy, User Challenge, twice-probe, Smart-skip, and material contract restatement.
