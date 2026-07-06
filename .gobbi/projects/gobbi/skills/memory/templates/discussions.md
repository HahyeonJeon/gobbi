# `discussions/`

> Summaries of substantive DISCUSSION-phase exchanges with the user that future sessions need to recall — exchanges that resolved an ambiguity, set a constraint, or shifted direction.

## Core principles

> **Record the question, the options weighed, and the user's decision in their terms.**

A future session honors the settled call without re-litigating it or losing who decided.

## Write it

| Field | Value |
|---|---|
| When | A loop's RECORD (`ideation` / `planning` / `execution`) when the DISCUSSION produced decisions worth preserving beyond this session. A one-off clarification belongs in the canonical artifact's "Decisions and rationale" section, not here. |
| Stage to | `sessions/{date}-{session-id}/{N}-{loop}/staging/discussions/{slug}.md` |
| Promotes to | `features/{f}/discussions/{area}/` (feature-only — discussions are always bounded to a feature) — `{area}` from this type's area list, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | `{YYYY-MM-DD}-{slug}.md` — date-prefixed (tied to the session that held it); short descriptive slug (`2026-05-11-cache-vs-index.md`) |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter plus the discussions extension (`outcome`); `scope: feature` always (feature-subdir-only). The base `session` field anchors the discussion to its session ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)).

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
tags: [ideation, process]            # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude | codex | user        # auto-stamped at promotion from session.json.system; user = human hand-edit
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
```

## Notes

- **Combine, then split.** Combine related questions into one document when they were asked in the same user-decision call or settled the same topic. Split distinct topics into separate files even within one session — readability beats single-file convenience.
- **Cross-feature exchanges go elsewhere.** A user-decision exchange that spans features belongs in `decisions/` (when it produced a decision) or `notes/` (an observation without a binding outcome).
