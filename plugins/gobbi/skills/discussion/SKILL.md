---
name: discussion
description: "Discussion is guidance for evidence-backed conversations that make user intent, designs, tasks, and decisions concrete."
allowed-tools: Read, Grep, Glob, WebSearch, WebFetch, AskUserQuestion
skill-type: preference
---

# Discussion

Discussion guides study-backed conversation that helps the user make designs, tasks, and decisions concrete.
Use it when the user's intent, project context, or Who, What, When, Where, Why, and How is unclear, or when the
user must choose a direction. The agent recommends the best-supported option, and the user decides.

## Principles

### Understand the user's intent and context

Understand the result the user is trying to achieve and the project context that shapes it, not only the literal
wording of the request. Use Who, What, When, Where, Why, and How with the relevant project vision, roadmap,
design, architecture, and current state to expose gaps and boundaries that could change the result.

### Study the problem and possible options

Before suggesting options, study the request, current work, affected people, relevant evidence, prior decisions,
constraints, and proven approaches. Use [Study](../study/SKILL.md) when the recommendation depends on a bounded
internal or external evidence question; otherwise develop and compare options from the available evidence.

### Discuss consequential choices with participants

Independent participants reveal alternatives and weak assumptions that one agent can miss. Before recommending
a consequential design or decision, seek separate supported suggestions and critique through the active owner's
participant contract, compare their reasoning, resolve or expose conflicts, and synthesize before asking the user.

### Help the user make the best decision

Present only meaningful options that fit the user's intent and differ in consequences that matter. Recommend the
best-supported option, explain why it fits, and state what evidence or changed constraint would change it.

## Rules

- **MUST make every gap in the user's intent or project context that could change the result concrete before
  dependent work.**
  Understand Who, What, When, Where, Why, and How and the relevant project vision, roadmap, design, architecture,
  and current state only as far as the work needs; leave unresolved points explicit.
- **MUST use the active owner's participant contract to discuss consequential designs and decisions before
  presenting options or asking the user.** Seek separate supported suggestions and critique from available
  participants; direct documentation work with no project/work design decision does not trigger this loop.
- **MUST route every user-owned decision that could change the result, scope, approach, risk, cost, or acceptance
  through the Decision Question template, then the active runtime's structured input tool.** Use `AskUserQuestion`
  in Claude Code, `request_user_input` in Codex, the official Ask questions tool in Cursor (identifier pending),
  or `ask_user_question` in Grok; a delegated agent sends the populated template to the user-facing manager
  instead of calling those tools.
- **MUST write for quick understanding.** Expand each domain abbreviation on first use, explain project-specific
  names briefly, and cite evidence for numeric or project-specific claims.
- **MUST preserve the user's accepted direction until the user explicitly changes it.** Contrary or missing
  evidence may reopen the decision, but it does not change the task, scope, or design by itself.
- **NEVER use empty praise or soft agreement instead of a position.** State the conclusion and reason, or name
  the exact dependency that prevents one; avoid filler such as “Great question,” “That could work,” or an unnamed
  “It depends.”

## Preferences

### Context Understanding

#### Understand intent and project context

- State the current understanding of the user's intended result and the relevant project vision, roadmap, design,
  architecture, and current state before asking about a gap that could change the result.
- Use Who, What, When, Where, Why, and How to identify information needed to choose or act safely.
- Distinguish the user's literal request from the intended result, and ask only about differences or context that
  is missing, ambiguous, or conflicting.

#### Make the result concrete

- Turn accepted answers into a clear design or task with its intended result, scope, constraints, approach, and
  evidence of completion.
- Keep accepted decisions, assumptions, and unresolved points distinct so later work does not treat one as
  another. Discussion consumes evidence and records the user's decision; it does not replace Study or decide for
  the user.

### Decision Support

#### Discuss participant reasoning

- Treat a design or decision as consequential when a different choice could change scope, architecture, interfaces,
  safety, cost, reversibility, acceptance, or a user-visible result. Identify the evidence, alternatives, or
  assumptions where an independent perspective could improve it.
- Ask the active owner to give available subagents or teammates separate bounded prompts for supported design or
  decision suggestions and critique. Each remaining launchable Partner may provide an initial suggestion or
  critique; an Unavailable attempt is evidence, not a silent skip.
- Compare participant reasoning before synthesis. When a disagreement or weak assumption could change the
  recommendation, send one focused follow-up to an addressable participant; because Partner is one-shot, use an
  addressable subagent or teammate when Partner provided the initial result.
- Resolve conflicts or expose them, then synthesize the strongest supported options and recommendation
  before asking the user. Do not force consensus or repeat a follow-up without new evidence; when no eligible
  participant is available, state the evidence limit.

#### Build meaningful options

- Offer two or three mutually exclusive options only when a real choice exists, and make each option feasible
  under the known evidence and constraints.
- Name each option by its direction and describe its main effect or trade-off in one sentence.
- Put the recommended option first, explain why it best serves the user's intent, and name what would change the
  recommendation.

#### Use the Decision Question template

- Use one Question card per decision. Show only the evidence or design material needed to decide immediately
  above the card.
- Author each decision with this Question card:

  ```markdown
  <Relevant context or design material, such as class shapes, a schema, or a diagram, when applicable>

  > **❓ Question**
  >
  > **Topic:** <one short phrase naming the decision>
  >
  > **Description:** <the literal question, recommendation and reason, and what would change it>
  >
  > **Options**
  >
  > - **<option name> (Recommended)**
  >   - **Description:** <what the option means>
  >   - **Pros:** <specific benefits>
  >   - **Cons:** <specific costs, risks, or limits>
  >
  > - **<alternative name>**
  >   - **Description:** <what the option means>
  >   - **Pros:** <specific benefits>
  >   - **Cons:** <specific costs, risks, or limits>
  ```

- Render the populated Question card in the conversation first, then call the required runtime tool. Map `Topic`
  to the short header, `Description` to the one-sentence question, and each option name to its label; combine
  its Description, Pros, and Cons into one compact native option description, keep the recommendation first,
  and ask a direct question instead when no meaningful options exist.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../gobbi-skill/SKILL.md) | Parent guidance for type classification and shared skill-writing rules. |
| [Study](../study/SKILL.md) | Source-grounded investigation for a bounded evidence question. |
| [Delegation](../delegation/SKILL.md) | Prompt and handoff guidance for bounded subagent and teammate assignments. |
| [Partner](../gobbi/partner/SKILL.md) | Write-bounded external-runtime invocation and final Handoff contract. |
