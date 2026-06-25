---
name: skill-loadability-and-map-placement
description: DD-1 loadability model and DD-5 skill-map placement for skill-writing and agent-writing meta-skills.
type: decisions
scope: feature
feature: agents
status: accepted
created: 2026-06-24
session: 2026-06-24-bb4eb896-bed0-42d6-9a3c-f74547df2611
tags: [process]
keywords: [skill-writing, agent-writing, loadability, user-invocable, disable-model-invocation, skill-map, meta-skill]
author: claude
supersedes: null
superseded_by: null
---

# Skill loadability model and skill-map placement for skill-writing / agent-writing

## Context

The session designed two new meta-skills — `skill-writing` and `agent-writing` — to teach gobbi agents how to author skills and agents correctly. Before writing them, the team needed to decide: (DD-1) how they would be loaded and what frontmatter flags would govern discoverability and model auto-invocation, and (DD-5) how they would appear in the gobbi skill-map (value-features prose paragraph vs. a Loop/Cross-cutting/Supporting table row).

A prior wrong claim (DD-1 early draft) attributed "reference-only / not slash-invocable" status to the ABSENCE of a `Skill()` permission entry. The evaluators disproved this: `Skill()` is a tool-permission gate, not a discoverability gate. The correct model is the 4-axis Claude Code model.

## Decision

**DD-1 (loadability):** Mirror both runtimes (`.claude/skills/` + `.agents/skills/`). Set `user-invocable: true` (default — `/`-visible to the user). Set `disable-model-invocation: false` (default — model auto-loads when an author is writing a skill or agent). OMIT `Skill()` permission entries. Leave `.claude/settings.json` unchanged.

**DD-5 (placement):** Add one dedicated value-features prose paragraph naming BOTH new skills. Do NOT add a Loop/Cross-cutting/Supporting table row. This mirrors the established meta-skill convention: `claude-plugin` and `gobbi-hook-authoring` carry no table row.

**DD-3 (file shape — auto):** Both are standalone single-file `SKILL.md` documents. `agent-writing` points to the existing `delegation/templates/{role}.md` files rather than shipping its own role-template copies.

## Rationale

The 4-axis Claude Code model: mirror / `user-invocable` / `disable-model-invocation` / `Skill()`-as-tool-perm. A missing `Skill()` entry causes only a one-time permission prompt on first tool use — it does NOT make a skill reference-only or non-invocable. The `claude-plugin` / `codex` meta-skill precedents both omit `Skill()` entries and remain fully invocable, which confirmed DD-1.

No table row for meta-skills: the table holds the six workflow-loop skills, the three cross-cutting skills, and the four supporting tools. Meta-skills that document the documentation system itself do not belong in the table — the prose paragraph is the right surface.

## Alternatives considered

- **Add a `Skill()` permission entry** — rejected. The evaluator research showed `Skill()` gates tool use, not discoverability. Adding it would add noise to `settings.json` without functional benefit.
- **Add a Supporting table row** — rejected. The precedent check showed `claude-plugin` and `gobbi-hook-authoring` carry no row. A meta-skill that teaches skill authoring is not a "supporting tool" in the workflow sense.

## Consequences

- `skill-writing/SKILL.md` and `agent-writing/SKILL.md` are `/`-invocable by the user and auto-loaded by the model when authoring context is detected.
- The gobbi skill-map prose section gains one paragraph naming both skills.
- `.claude/settings.json` is unchanged.
- The feature-dir bootstrap was deferred to Wrap-up (this session) per DD-5.

## Related

- [[verify-dont-assert-taught-facts]] — the DD-1 initial wrong claim triggered this promoted mistake
