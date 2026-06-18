# `discussions/`

Summaries of substantive **DISCUSSION-phase exchanges with the user** that future sessions need to recall. Not every user-decision exchange goes here — only exchanges that resolved an ambiguity, established a constraint, or shifted direction.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop RECORD** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/discussions/{slug}.md`. Loop RECORD **never** writes directly to memory.
2. **Wrap-up's RECORD**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Memory routing](../../wrap-up/SKILL.md#staging--memory-routing).

---

## When to write

- During **Ideation / Planning / Execution** RECORD when the loop's DISCUSSION produced decisions worth preserving beyond this session.
- A discussion that only clarified a one-off detail belongs in the canonical artifact's "Decisions and rationale" section, not here. This directory is for discussions whose outcome will affect future sessions.

## Location

- Feature-level only: `.gobbi/projects/{project-name}/features/{feature-name}/discussions/`

Discussions are always bounded to a feature. Cross-cutting user-decision exchanges that span features belong in `decisions/` (when the discussion produced a decision) or `notes/` (when it was an observation without a binding outcome).

## File naming

`{YYYY-MM-DD}-{slug}.md` — date-prefixed (a discussion is tied to the session that held it); slug is short and descriptive. See [`rules.md` § 1](../rules.md). `discussions/` is a **feature-subdir-only** type ([`rules.md` § 3](../rules.md)).

Example: `2026-05-11-cache-vs-index.md`, `2026-05-11-feature-decomposition.md`.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the discussions-type extension (`outcome`); `scope: feature` always (feature-subdir-only). The base `session` field anchors the discussion to its session — the old `loop:` field is removed (it is staging-only session-routing residue stripped on promotion, [`rules.md` § 2.6](../rules.md#26-staging-field-stripping-on-promotion)). `tags` come from the controlled vocabulary ([`rules.md` § 2.5](../rules.md#25-controlled-tags-vocabulary)).

```markdown
---
name: {slug — short topic}
description: {one-line what was decided}
type: discussions
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [ideation, process]            # controlled vocabulary (§2.5)
outcome: {one-line summary of what was decided}
---

# {Topic}

## Context
{Why this discussion happened — the framing problem or proposal that prompted it.}

## Question
{The specific question presented to the user through the active runtime's user-decision primitive.}

## Options considered
{The options offered, with the rationale for each.}

## User decision
{The user's chosen option, in their words if available.}

## Implication
{What this decision means for the design, the plan, or future work. Note any deferred risks or contribution points that surfaced.}

## Related
{Navigable `[[slug]]` links to the design / decision / plan documents this discussion shaped ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[cache-invalidation]] — the design this discussion shaped
- [[2026-05-11-use-redis-not-memcached]] — the decision it produced
```

## Granularity

Combine related questions into one discussion document when they were asked in the same user-decision primitive call or settled the same topic. Split when distinct topics were discussed even if in the same session — readability beats single-file convenience.
