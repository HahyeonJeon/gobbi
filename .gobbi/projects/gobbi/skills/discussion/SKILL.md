---
name: discussion
description: MUST load before every manager-user clarification, approval, or decision point. Defines the SOP for designing and conducting focused, evidence-based discussions with users.
allowed-tools: Read, Grep, Glob, Bash, AskUserQuestion
---

# Discussion

## Introduction

This skill defines how the manager prepares, conducts, and closes a discussion with the user. The outcome is one clear answer or a task brief concrete enough for the next action.

Only the root manager conducts user dialogue. Spawned agents return `NEEDS_CONTEXT` with the missing point and its evidence. This skill does not replace research, design, planning, implementation, evaluation, or the records owned by those workflows.

## Principles

> **Discussion starts with a clear problem.**

A useful discussion follows a deliberate account of what is unknown, what evidence exists, and what the answer will change. Without that design, questions become a transfer of unfinished analysis to the user.

> **User attention belongs on user-owned uncertainty.**

The user adds the most value on goals, preferences, success, scope, and consequential trade-offs. Evidence and established rules should settle reversible mechanics so the user is not asked to do the agent's work.

> **One point produces one interpretable answer.**

An answer is reliable when one question varies one decision dimension. Combining independent points hides which trade-off the user accepted.

> **Recommendations expose judgment.**

A recommendation gives the user a concrete position to accept or correct. Its reason and trade-off make the agent's judgment visible without pretending that every option is equal.

> **Constructive disagreement protects the result.**

Agreement is not the aim of discussion. Evidence conflicts, unsupported assumptions, and likely consequences must remain visible so the user can choose with accurate information.

> **Shared understanding closes the loop.**

A discussion is complete when the accepted choice and its effect on the work are plain. A compact close prevents the agent and user from resuming with different interpretations.

## Rules

### Must-Follow

- **MUST design the discussion before asking the first question** — identify the problem, the detailed discussion points, and why each point needs the user.
- **MUST study the prompt, current-session answers, repository evidence, rules, constraints, and relevant prior decisions first** — questions begin only after available evidence is exhausted.
- **MUST keep each question to one discussion point** — one answer must resolve one interpretable decision dimension.
- **MUST explain why discussion is needed and what the answer changes** — the user should see the consequence of the choice.
- **MUST put the evidence-backed recommendation first when meaningful options exist** — label it `(Recommended)` and name its main trade-off.
- **MUST keep user dialogue manager-owned** — a spawned agent returns `NEEDS_CONTEXT` with evidence instead of asking the user directly.
- **MUST use the active runtime's structured question interface when available** — otherwise ask the same point directly in the parent thread.
- **MUST test every answer against the known evidence** — surface a material contradiction before acting on it.
- **ALWAYS close with the accepted choice and the resulting work boundary** — resume only after shared understanding is explicit.

### Must-Not-Follow

- **NEVER ask the user to decide a reversible mechanic already resolved by evidence, rules, the locked plan, or an exact current-session answer** — fix: apply that evidence and continue.
- **NEVER combine independent questions about the problem, deliverable, scope, approach, constraints, or verification** — fix: split them and ask in dependency order.
- **NEVER invent unsupported or filler options to complete a menu** — fix: offer only choices with a real effect, or ask a direct question when no honest option set exists.
- **NEVER hide a recommendation behind neutral wording when evidence favors one choice** — fix: state the preferred choice and its trade-off plainly.
- **NEVER replace an explicit user direction silently when evidence conflicts with it** — fix: show the evidence, consequence, and choice to the user.
- **NEVER ask the user to approve the internal Discussion Design** — fix: use it to produce focused questions rather than another process gate.
- **NEVER create a discussion-owned decision object, adapter schema, or logging format** — fix: let the owning workflow record the accepted result in its existing artifact when needed.
- **NEVER open with praise, emotional validation, or agreement that adds no information** — fix: begin with the discussion point and its reason.

## Procedure

Run these steps in order. Repeat P3–P5 only while another unresolved discussion point remains.

### P1 — Discussion Design

Design the discussion internally before the user sees a question:

1. Study the prompt, current-session answers, locked artifacts, repository evidence, rules, constraints, mistakes, and relevant prior decisions.
2. State the actual problem, contradiction, risk, or missing information that could affect the work.
3. List the detailed discussion points. Keep each point atomic: problem, deliverable, scope, priority, approach, constraint, risk, dependency, or verification.
4. For each point, state why evidence cannot settle it and what its answer will change.
5. Remove points already resolved by direct evidence or an exact current-session answer.
6. Order the remaining points by dependency so an earlier answer can eliminate or refine later points.

The design is complete when every remaining point has a clear reason for reaching the user. Keep this outline internal.

<a id="what-requires-discussion"></a>

### P2 — What Requires Discussion?

Discuss a point when it depends on the user's goals or preferences, defines success, changes design or scope, authorizes destructive or irreversible work, or resolves a material conflict between evidence and the user's direction.

Do not discuss a reversible mechanic already fixed by repository evidence, an established rule, the locked plan, or an exact current-session answer. Apply that evidence and continue. If a prior answer only suggests a consequential design, scope, or destructive choice, ask rather than extending the answer by inference.

This gate is complete when every point is either evidence-resolved or clearly needs user judgment.

<a id="question-card-structure"></a>

### P3 — Question Card Structure

Use this card for one discussion point:

```text
Discussion point: <one specific question or decision>
Why discussion is needed: <what evidence cannot settle and what the answer changes>
Options:
- <recommended option> (Recommended) — <reason and main trade-off>
- <alternative> — <reason and main trade-off>
```

Example:

```text
Discussion point: Should the discussion guidance remain in one skill file?
Why discussion is needed: Both structures can work, but this choice sets how agents find and maintain the SOP.
Options:
- Use one standalone SOP (Recommended) — Keeps the full conversation flow together; removes separate lookup files.
- Keep separate reference files — Preserves independent lookup surfaces; adds navigation and maintenance.
```

Use only options that remain viable after the evidence review. If no honest option set exists, ask the discussion point directly and keep the reason. A runtime-required short label or similar metadata is transport detail, not canonical card content.

### P4 — Discuss One Point at a Time

Render the card through the active runtime's structured question interface when one is available. Otherwise ask the same point directly in the parent thread. Ask, wait for the answer, and then update the internal Discussion Design.

Carry an exact answer forward within its stated scope. Skip any later point it resolves directly. If the answer exposes a new dependency, add or reorder the affected point before asking again. Do not infer consequential authority from a related but incomplete answer.

### P5 — Respond to the Answer

Accept a concrete answer that resolves the point. If it conflicts with known evidence, state the evidence, the likely consequence, and the remaining choice. Do not praise the answer or quietly substitute a compromise.

Replace vague agreement with a checkable position:

- Replace “That could work” with whether it works and the evidence.
- Replace “It depends” with the dependency and its current value.
- Replace “You might want to consider” with the recommended action and reason.
- Replace “There are many ways” with the material choices that remain after evidence filtering.

<a id="push-once-then-push-again-rule"></a>

#### Push-once-then-push-again rule

When an answer is too vague to execute or verify:

1. Ask one focused follow-up for the missing measure, boundary, example, or priority.
2. If the answer remains vague, ask a second focused follow-up using the concrete baseline or contradiction found during Discussion Design.
3. If the point is still unresolved, state the missing criterion and ask whether to define it now or defer the affected work.

Both follow-ups narrow the same point. They do not introduce another design question.

<a id="comfort-patterns"></a>

#### Comfort Patterns

Use the user's vocabulary. Define unfamiliar terms before asking. Preserve context the user already supplied, and do not repeat information the user has acknowledged.

When a spawned agent returns `NEEDS_CONTEXT`, the manager first tries to resolve the gap from evidence. If user input is still needed, the manager converts the evidence handoff into this skill's question card. The spawned agent never conducts the discussion.

### P6 — Close the Discussion

For a single choice or approval, state the accepted choice and resume the paused work.

For task refinement, restate only the parts the discussion changed: the problem, deliverable, scope, constraints, and verification target. If the restatement introduces no new choice, it confirms shared understanding; it is not another discussion point.

The discussion is closed when the next action follows from the accepted answer without invention.

## References

Each entry names the owner and the claim it validates.

- [`orchestration/delegation.md`](../orchestration/delegation.md) § The Status Contract validates the spawned-agent `NEEDS_CONTEXT` evidence handoff and manager routing used in the Introduction, Rules, and P5.
- [`orchestration/SKILL.md`](../orchestration/SKILL.md) § Runtime primitive map validates the active-runtime user-question interfaces used in the Rules and P4.
- [GOV.UK Design System — Question pages](https://design-system.service.gov.uk/patterns/question-pages/) validates asking only for needed information and focusing the user on one question at a time.
- [Claude Agent SDK — Handle approvals and user input](https://code.claude.com/docs/en/agent-sdk/user-input) validates that Claude's structured user-input surface pauses the main interaction for an answer.
- [OpenAI Agents SDK — Human-in-the-loop](https://openai.github.io/openai-agents-python/human_in_the_loop/) validates an explicit pause, decision, and resume boundary for human-owned actions.
