---
name: discussion
description: "Discussion is the operation that makes a task concrete, studies options with subagents, and decides with the user."
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

### Study with independent participants

One agent misses alternatives. For a consequential design or decision, gather separate supported suggestions
and critique, then synthesize before asking the user.

### Help the user see the choice

Present only meaningful options. Recommend one. Explain the choice with a schema, diagram, or generated image
when that makes the difference easier to see than text alone.

## Rules

- **MUST make every gap in intent or project context that could change the result concrete before dependent
  work.** Use Who, What, When, Where, Why, and How only as far as the work needs, and leave unresolved points
  explicit.
- **MUST use the active owner's participant contract to discuss a consequential design or decision before
  presenting options.** Seek separate supported suggestions and critique; skip this loop for documentation-only
  work with no project or work design decision.
- **MUST route every user-owned decision that could change result, scope, approach, risk, cost, or acceptance
  through the runtime structured-input tool.** Use `AskUserQuestion` in Claude Code, `request_user_input` in
  Codex, the official Ask questions tool in Cursor (identifier pending), or `ask_user_question` in Grok. A
  delegated agent sends the question and options to the user-facing manager instead of calling those tools.
- **MUST explain a structural or visual choice with a schema, diagram, or generated image when text alone
  makes the options hard to compare.** Use the runtime's image-generation tool when a picture helps; use a
  compact schema or diagram when that is clearer. Skip decoration.
- **MUST preserve the user's accepted direction until the user explicitly changes it.** Contrary evidence may
  reopen the decision; it does not change the task by itself.
- **NEVER use empty praise or soft agreement instead of a position.** State the conclusion and reason, or name
  the exact dependency that prevents one.

## Procedure

### Phase 1 — Understand the task

#### 1.1 Restate the intended result

- State the current understanding of the user's intended result and the relevant vision, roadmap, design,
  architecture, and current state.
- Distinguish the literal request from the intended result.

#### 1.2 Close gaps that could change the result

- Use Who, What, When, Where, Why, and How to name missing, ambiguous, or conflicting context.
- Ask only about gaps that could change the result, scope, approach, or acceptance.

#### 1.3 Confirm the task is ready to study

- Turn accepted answers into a concrete task: intended result, scope, constraints, approach, and completion
  evidence.
- Keep accepted decisions, assumptions, and unresolved points distinct. Continue to Phase 2 when the task is
  concrete enough to form options.

### Phase 2 — Study and form options

#### 2.1 Study the evidence

- Study the request, current work, affected people, relevant evidence, prior decisions, constraints, and
  proven approaches.
- Load the matching domain ideation skill when this is an unresolved material design choice. Otherwise compare
  options from the available evidence.

#### 2.2 Discuss with independent participants

- Treat a choice as consequential when a different answer could change scope, architecture, interfaces,
  safety, cost, reversibility, acceptance, or a user-visible result.
- Ask the active owner to give available subagents or teammates separate bounded prompts for supported
  suggestions and critique. Each remaining launchable Partner may provide an initial suggestion or critique;
  an Unavailable attempt is evidence, not a silent skip.
- Compare reasoning, send one focused follow-up when a disagreement could change the recommendation, then
  synthesize. Do not force consensus. When no eligible participant is available, state the evidence limit.

#### 2.3 Prepare two or three options and a recommendation

- Offer two or three mutually exclusive options only when a real choice exists. Make each feasible under the
  known evidence.
- Name each option by its direction, describe its main effect in one sentence, put the recommended option
  first, and name what would change the recommendation.

### Phase 3 — Decide with the user

#### 3.1 Explain so the user can see the choice

- Show the evidence or design material needed to decide immediately above the question.
- When the choice is a structure, flow, layout, or relationship, add a schema, diagram, or generated image
  that makes the options comparable. Skip this when the choice is a short yes/no, a name, or a wording-only
  decision.

#### 3.2 Ask with the runtime tool

- Call the required runtime structured-input tool with one question, the recommended option first, and each
  alternative as a compact label plus what it means, its benefit, and its cost. Ask a direct question when no
  meaningful options exist. The tool is the ask.

#### 3.3 Record the decision

- Record the user's choice as the accepted direction. Do not change it until the user explicitly changes it.
- Discussion consumes evidence and records the decision. It does not replace domain ideation's design-evidence
  study or decide for the user.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../gobbi-skill/SKILL.md) | Parent guidance for type classification and shared skill-writing rules. |
| [Operation Skill](../gobbi-skill/operation-skill/SKILL.md) | Shape for ordered phases and steps. |
| [Coding Ideation](../coding/coding-ideation/SKILL.md) | Owns bounded code-design study during ideation. |
| [Authoring Ideation](../authoring/authoring-ideation/SKILL.md) | Owns bounded writing-design study during ideation. |
| [Design Ideation](../design/design-ideation/SKILL.md) | Owns bounded visual-design study during ideation. |
| [Delegation](../delegation/SKILL.md) | Prompt and handoff guidance for bounded subagent assignments. |
| [Partner](../gobbi/partner/SKILL.md) | Write-bounded external-runtime invocation and final Handoff contract. |
