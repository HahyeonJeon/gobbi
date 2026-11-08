---
name: discussion
description: "Discussion makes a task concrete, studies options with participants, and records the user's decision. Use it when intent or context is unclear or the user must choose a direction."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch, AskUserQuestion
skill-type: operation
---

# Discussion

Discussion makes the user's task concrete, studies options with independent participants, and records the
user's decision. Use it when intent, context, or How is unclear, or when the user must choose a direction.
The agent recommends. The user decides.

## Principles

### Understand the task before offering options

Understand the result the user is trying to achieve and the project context that shapes it. Use Who, What,
When, Where, Why, and How until the task is concrete enough to study.

### Study with independent participants when it matters

One agent misses alternatives. For a decision that is hard to reverse or that the user owns, gather separate
supported suggestions and critique, scaled to the stakes, then synthesize before asking the user.

### Help the user see the choice

Present only real options. Recommend one. Prefer a schema, diagram, or generated image when it makes the
difference easier to see than text alone.

## Rules

- **Resolve a gap in intent or context before dependent work only when a wrong guess is costly to undo.**
  Otherwise state the assumption and continue, because review and the user catch what is wrong.
- **Route every user-owned decision that could change the result, scope, risk, cost, or acceptance through the
  runtime structured-input tool.** Use `AskUserQuestion` in Claude Code, `request_user_input` in Codex, the
  official Ask questions tool in Cursor (identifier pending), or `ask_user_question` in Grok. A delegated agent
  has no user channel, so it sends the question and options to the user-facing manager.
- **Keep the user's accepted direction until the user explicitly changes it.** The direction is the user's;
  contrary evidence may reopen the decision but does not change the task by itself.

## Procedure

### Phase 1 — Understand the task

Know the result the user is after. Done when the task is concrete enough to form options, with accepted
decisions, assumptions, and open points kept apart.

#### 1.1 Make the task concrete

- Restate the intended result, as distinct from the literal request, with its scope, constraints, and
  completion evidence.
- Ask only about gaps where a wrong guess is costly to undo, and state the assumption for the rest.

### Phase 2 — Study and form options

Find the real options. Done when each real choice has feasible, mutually exclusive options and a
recommendation that names what would change it, or the evidence shows no real choice exists.

#### 2.1 Study the evidence

- Study the current work, prior decisions, constraints, and proven approaches. When running a command, test,
  or prototype can answer a question, run it instead of asking the user.
- Load the matching domain ideation skill when this is an unresolved material design choice.

#### 2.2 Discuss with independent participants

- For a decision that is hard to reverse or that the user owns, ask the active owner to give available
  subagents, teammates, or launchable Partners separate bounded prompts for supported suggestions and
  critique. Match the number of participants to the stakes.
- Compare reasoning, send one focused follow-up when a disagreement could change the recommendation, then
  synthesize without forcing consensus.
- Report an Unavailable Partner attempt as evidence, and state the evidence limit when no participant was
  available.

#### 2.3 Prepare the options and a recommendation

- Offer the real options, usually two or three, only when a real choice exists. Make them mutually exclusive
  and feasible under the known evidence.
- Name each option by its direction, recommend one, and name what would change the recommendation.

### Phase 3 — Decide with the user

Get the user's decision. Done when the user's choice is recorded as the accepted direction.

#### 3.1 Show the choice

- Show the evidence or design material needed to decide immediately above the question.
- Prefer a schema, diagram, or generated image when the choice is a structure, flow, layout, or relationship
  that text makes hard to compare.

#### 3.2 Ask with the runtime tool

- Ask one question with the recommended option first and `(Recommended)` after its label, and give each
  option what it means plus explicit `Pros:` and `Cons:`. This is the card format the user set.
- Ask a direct question when no real options exist.

#### 3.3 Record the decision

- Record the user's choice as the accepted direction.
- Discussion records the decision; domain ideation owns the design-evidence study.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../gobbi-skill/SKILL.md) | Parent guidance for type classification and shared skill-writing rules. |
| [Operation Skill](../gobbi-skill/operation-skill/SKILL.md) | Shape for ordered phases and steps. |
| [Coding Ideation](../coding/coding-ideation/SKILL.md) | Owns bounded code-design study during ideation. |
| [Authoring Ideation](../authoring/authoring-ideation/SKILL.md) | Owns bounded writing-design study during ideation. |
| [Design Ideation](../design/design-ideation/SKILL.md) | Owns bounded visual-design study during ideation. |
| [Delegation](../delegation/SKILL.md) | Prompt and handoff guidance for bounded subagent assignments. |
| [Partner](../partner/SKILL.md) | How the manager launches a partner CLI in the background, reads its output, and follows up. |
