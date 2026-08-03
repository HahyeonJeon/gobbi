---
name: discussion
description: "MUST load when writing or reviewing a question for the user. Discussion is a preference skill for clear, evidence-backed, and decision-ready questions."
allowed-tools: Read, Grep, Glob, AskUserQuestion
skill-type: preference
---

# Discussion

Discussion is a preference skill for writing clear, evidence-backed questions that help the user clarify a request, challenge a premise, or make a decision. Use it to make What, Why, and How concrete, ask for evidence or authority, and resolve user-owned choices without changing the user's accepted direction by assumption.

The Principles explain the judgment behind a good question, the Rules bound what every question must and must not do, and the Preferences give the default Question Template and how to present it. The skill shapes the question only: it prescribes no ordered procedure and decides nothing the user has not decided.

## Principles

### Study the problem and possible options

Before suggesting options, understand the request, the user's goal, the relevant evidence, prior decisions, constraints, and proven approaches. Develop options from what you learn, then compare how well each option serves the goal and what it costs.

### Challenge weak premises

Challenge assumptions, contradictions, vague claims, unrealistic expectations, missing edge cases, and weak evidence before they shape the task, explaining each concern plainly and supporting it with evidence. Agreement without scrutiny leaves the user choosing from a faulty premise.

### Present meaningful options with a recommendation

When the user must choose, present distinct options that fit the request, differ in ways that matter, and state their relevant benefits, drawbacks, and constraints. Recommend the best-supported option, explain why it fits, and state what new evidence or changed constraint would change the recommendation.

## Rules

### Must-Follow

- **MUST write for quick understanding.** Expand each domain abbreviation on first use, briefly explain project-specific names, and cite evidence for numeric or project-specific claims.
- **MUST preserve the user's accepted direction until the user explicitly changes it.** A challenge presents the contrary or missing evidence and its consequence; it does not change the task, scope, or design by itself.

### Must-Not-Follow

- **NEVER use empty praise or soft agreement instead of a position.** Avoid phrases such as “That's interesting,” “Great question,” “You might want to consider,” “There are many ways to think about this,” “That could work,” “I can see why you'd think that,” “Maybe we should,” and an unnamed “It depends”; state the conclusion and reason, or name the exact dependency that prevents one.

## Preferences

### Must Use Question Template

Prefer one Question Template per question. When relevant context or design material exists, show it immediately above the template. For the card itself, prefer one blockquote headed by the bold `❓ Question` label, with no other emoji and with bold field labels and option titles. Use `Topic` to name the decision or missing fact. Use `Description` to ask the literal question and explain why the answer is needed. For a real choice, also state the recommendation and its reason, then say what evidence or changed constraint would change it. Add `Options` only for a real choice.

```markdown
<Relevant context or design material, such as class shapes, a schema, or a diagram, when applicable>

> **❓ Question**
>
> **Topic:** <one short phrase naming the question>
>
> **Description:** <the literal question and why its answer is needed; for a real choice, the recommendation and reason, then what would change it>
>
> **Options**
>
> - **<option name> (Recommended)**
>   - **Description:** <what the option means>
>   - **Pros:** <specific benefits>
>   - **Cons:** <specific costs, risks, or limits>
>
> - **<next option>**
>   - **Description:** <what the option means>
>   - **Pros:** <specific benefits>
>   - **Cons:** <specific costs, risks, or limits>
```

When options apply, prefer the recommended option first and suffix its bold title with `(Recommended)`. Keep `Pros` and `Cons` concrete. Use separate templates for questions that could receive different answers. For a missing fact, omit `Options`. When the user interface cannot render a blockquote or bold text, preserve the same information, order, hierarchy, and visible grouping in native controls or compact prose.

## References
