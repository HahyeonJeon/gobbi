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

### Use subagents, teammates, and Partner through the active owner

Independent agents reveal evidence, alternatives, and weak assumptions that one agent can miss. Before
recommending a consequential design or decision, actively use available subagent, teammate, and remaining
Partner input through the active task or mode owner's participant contract.

### Help the user make the best decision

Present only meaningful options that fit the user's intent and differ in consequences that matter. Recommend the
best-supported option, explain why it fits, and state what evidence or changed constraint would change it.

## Rules

- **MUST make every gap in the user's intent or project context that could change the result concrete before
  dependent work.**
  Understand Who, What, When, Where, Why, and How and the relevant project vision, roadmap, design, architecture,
  and current state only as far as the work needs; leave unresolved points explicit.
- **MUST actively use available subagent, teammate, and remaining Partner input through the active owner's
  participant contract before recommending a consequential design or decision.** A consequential choice can
  change scope, architecture, interfaces, safety, cost, reversibility, acceptance, or a user-visible result; the
  owner selects eligible participants and timing.
- **MUST route every user-owned decision that could change the result, scope, approach, risk, cost, or acceptance
  through the active runtime's structured input tool and the Decision Question template.** Use `AskUserQuestion`
  in Claude Code, `request_user_input` in Codex, or `ask_user_question` in Grok; a delegated agent sends the
  populated template to the user-facing manager instead of calling those tools. After a Complete Workflow Phase 1
  handoff closes its
  user-decision window, return later uncertainty to the Workflow manager, which decides from the accepted
  contract and independent input or stops without asking the user.
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

#### Gather independent input

- Treat a design or decision as consequential when a different choice could change scope, architecture, interfaces,
  safety, cost, reversibility, acceptance, or a user-visible result. Identify the evidence, alternatives, or
  assumptions where an independent perspective could improve it.
- Ask the active owner to give available subagents or teammates separate bounded questions before exposing the
  leading recommendation. Use Partner only for each remaining runtime in the launch set. A launchable runtime
  produces an independent result; an Unavailable attempt produces Unavailable evidence, not a silent skip.
- Compare the returned evidence and reasoning, resolve conflicts against the user's intent and project context,
  and synthesize the best-supported options. When no eligible participant is available, state the evidence limit
  instead of implying independent review.

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

- Deliver the card through the required runtime tool. Map `Topic` to the short header, `Description` to the
  one-sentence question, and each option name to its label; combine its Description, Pros, and Cons into one
  compact native option description, keep the recommendation first, and ask a direct question instead when no
  meaningful options exist.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../gobbi-skill/SKILL.md) | Parent guidance for type classification and shared skill-writing rules. |
| [Study](../study/SKILL.md) | Source-grounded investigation for a bounded evidence question. |
| [Delegation](../delegation/SKILL.md) | Prompt and handoff guidance for bounded subagent and teammate assignments. |
| [Partner](../gobbi/partner/SKILL.md) | Write-bounded external-runtime invocation and final Handoff contract. |
