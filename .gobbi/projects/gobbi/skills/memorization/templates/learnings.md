# `learnings/`

**Cross-cutting insights** the project picked up that apply beyond any single feature or task. Distinct from `mistakes/` (failures to avoid) and `references/` (external sources): learnings are **what we now know how to do better** based on direct experience.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/learnings/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During any loop's MEMORIZATION when the loop produced an insight worth preserving:
  - A pattern that worked better than expected
  - A technique that should become a project convention
  - A platform / library behavior the project discovered through use
- During **Wrap-up** MEMORIZATION when cross-loop patterns become visible only at session close.

## Location

- Project-level only: `.gobbi/projects/{project-name}/learnings/`

Learnings are cross-cutting by definition. Feature-specific insights belong in that feature's `design/` or `decisions/`, not here.

## File naming

`{slug}.md` — short, descriptive. No date prefix (learnings are timeless once recorded).

Example: `parallel-spawn-rate-limit.md`, `markdown-link-relativization.md`, `bun-sqlite-strict-mode.md`.

## Item template

```markdown
---
title: {Short title}
discovered: YYYY-MM-DD
session: {session_id}
tags: [{tag1}, {tag2}]
related: [{related learning slugs}]
---

# {Title}

## Insight
{One or two sentences: the lesson, stated as actionable knowledge.}

## Context
{The situation that produced this learning. What was being attempted, what was discovered.}

## Why it matters
{The cost the project would pay if this knowledge were lost. Convince a future reader to keep this.}

## How to apply
{Concrete guidance: when to use this insight, where it applies, what to watch for.}

## Counter-cases
{When this insight does NOT apply. Important — most insights have boundaries.}

## Related
{Links to mistakes / references / decisions that share context with this learning.}
```

## Distinguishing learnings from mistakes

- **Learning** = "do this; here's the better way"
- **Mistake** = "do not do that; here's the trap"

When a finding has both shapes, write a mistake for the trap and a learning for the better way, cross-referencing each other.

## Promotion source

Many learnings start as evaluator findings (`general` type) or as observations in `notes/`. They are promoted to `learnings/` when the assistant judges them durable and actionable. Mere observations stay in `notes/`; actionable transferable insights graduate.
