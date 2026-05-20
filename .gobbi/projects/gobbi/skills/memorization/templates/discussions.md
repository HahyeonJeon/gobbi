# `discussions/`

Summaries of substantive **DISCUSSION-phase exchanges with the user** that future sessions need to recall. Not every AskUserQuestion goes here — only exchanges that resolved an ambiguity, established a constraint, or shifted direction.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/discussions/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Ideation / Planning / Execution** MEMORIZATION when the loop's DISCUSSION produced decisions worth preserving beyond this session.
- A discussion that only clarified a one-off detail belongs in the canonical artifact's "Decisions and rationale" section, not here. This directory is for discussions whose outcome will affect future sessions.

## Location

- Feature-level only: `.gobbi/projects/{project-name}/features/{feature-name}/discussions/`

Discussions are always bounded to a feature. Cross-cutting AskUserQuestion exchanges that span features belong in `decisions/` (when the discussion produced a decision) or `notes/` (when it was an observation without a binding outcome).

## File naming

`{YYYY-MM-DD}-{slug}.md` — date prefix so chronological order is visible. The slug is short and descriptive.

Example: `2026-05-11-cache-vs-index.md`, `2026-05-11-feature-decomposition.md`.

## Item template

```markdown
---
date: YYYY-MM-DD
session: {session_id}
loop: ideation | preparation | planning | execution | wrap-up
feature: {feature-name} or null
topic: {short topic}
outcome: {one-line summary of what was decided}
---

# {Topic}

## Context
{Why this discussion happened — the framing problem or proposal that prompted it.}

## Question
{The specific question presented to the user (paraphrased from AskUserQuestion).}

## Options considered
{The options offered, with the rationale for each.}

## User decision
{The user's chosen option, in their words if available.}

## Implication
{What this decision means for the design, the plan, or future work. Note any deferred risks or contribution points that surfaced.}

## Related
{Links to design / decision / plan documents this discussion shaped.}
```

## Granularity

Combine related questions into one discussion document when they were asked in the same AskUserQuestion call or settled the same topic. Split when distinct topics were discussed even if in the same session — readability beats single-file convenience.
