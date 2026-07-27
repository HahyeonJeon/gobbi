---
name: discussion
description: "MUST load when writing or reviewing a question for the user. Discussion is a preference skill for clear, evidence-backed, and decision-ready questions."
allowed-tools: Read, Grep, Glob, AskUserQuestion
skill-type: preference
---

# Discussion

Discussion is a preference skill for writing clear, evidence-backed questions that help the user clarify a request, challenge a premise, or make a decision. Use it to make What, Why, and How concrete, ask for evidence or authority, and resolve user-owned choices without changing the user's accepted direction by assumption.

## Principles

### Study the problem and possible options

Before suggesting options, understand the request, the user's goal, the relevant evidence, prior decisions, constraints, and proven approaches. Develop options from what you learn, then compare how well each option serves the goal and what it costs.

### Challenge weak premises

Challenge assumptions, contradictions, vague claims, unrealistic expectations, missing edge cases, and weak evidence before they shape the task. Explain the concern plainly and support it with evidence. Agreement without scrutiny leaves the user choosing from a faulty premise.

### Present meaningful options with a recommendation

When the user must choose, present distinct options that fit the request and differ in ways that matter. Explain the relevant benefits, drawbacks, and constraints. Recommend the best-supported option, explain why it fits, and state what new evidence or changed constraint would change the recommendation.

## Rules

Discussion applies whenever an agent clarifies a request, asks the user for input, challenges a premise, or resolves a user-owned choice. The relevant role or workflow owns authority, routing, record layout, and state transitions.

### Must-Follow

- **MUST write for quick understanding.** Expand each domain abbreviation on first use, briefly explain project-specific names, and cite evidence for numeric or project-specific claims.
- **MUST preserve the user's accepted direction until the user explicitly changes it.** A challenge presents the contrary or missing evidence and its consequence; it does not change the task, scope, or design by itself.
- **MUST probe an unclear answer no more than twice.** Probe first with a concrete measure, example, source, baseline, or counterexample. If the gap remains, probe once more from that gap. Then state exactly what remains unknown and route it to the relevant owner.
- **MUST restate a materially changed contract.** When discussion changes direction, scope, success criteria, constraints, authority, or acceptance, restate the complete changed contract in plain language and obtain confirmation before work proceeds.

### Must-Not-Follow

- **NEVER use empty praise or soft agreement instead of a position.** Avoid phrases such as “That's interesting,” “Great question,” “You might want to consider,” “There are many ways to think about this,” “That could work,” “I can see why you'd think that,” “Maybe we should,” and an unnamed “It depends.” State the conclusion and reason, or name the exact dependency that prevents one.
- **NEVER revise an evaluated artifact before the user approves or edits the complete finding-disposition batch.** Preserve the evaluated artifact until that decision is explicit.

## Preferences

### Must Use Question Template

Prefer one Question Template per question. When relevant context or design material exists, show it immediately above the template. Use `Topic` to name the decision and `Description` to state what needs an answer and why. Add `Options` only for a real choice.

```text
<Relevant context or design material, such as class shapes, a schema, or a diagram, when applicable>

Topic: <one short phrase naming the question>
Description: <what needs an answer and why>

Options:
  - Title: <option name; add "(Recommended)" to the recommended option>
    Description: <what the option means>
    Pros: <specific benefits>
    Cons: <specific costs, risks, or limits>

---

  - Title: <next option>
    Description: <what the option means>
    Pros: <specific benefits>
    Cons: <specific costs, risks, or limits>
```

When options apply, prefer the recommended option first and suffix its `Title` with `(Recommended)`. Explain why it is recommended and what would change the recommendation. Keep `Pros` and `Cons` concrete. Use separate templates for questions that could receive different answers. For a missing fact, omit `Options`. When the user interface cannot reproduce the fields or a literal divider, preserve the same information, order, and visual separation in native controls or compact prose.

## References
