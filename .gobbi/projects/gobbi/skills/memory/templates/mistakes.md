# `mistakes/`

> Recurring failure patterns — things that look like they should work but reliably break. Each records the failure mode plus the correct approach so future sessions skip past it without re-failing.

## Core principles

> **Record the trap, its root cause, the correct approach, and the signal you are about to repeat it.**

A mistake missing the early-warning signal records history instead of preventing recurrence.

## Write it

| Field | Value |
|---|---|
| When | Immediately during any loop's RECORD when the user corrected an approach or the loop hit a non-obvious failure mode; or during Wrap-up RECORD when cross-loop patterns reveal a recurring trap. |
| Stage to | `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md` **with `mistake-candidate: true`** — mistakes route through `staging/decisions/` with the flag, not a dedicated subdir; the flag tells Wrap-up to promote to `mistakes/` instead of `decisions/`. |
| Promotes to | `features/{f}/mistakes/{area}/` (feature-specific trap) · `mistakes/{area}/` (project, the common case) — `{area}` from the curated trap-class allowlist, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | `{slug}.md` — bare-slug, names the trap in ≤6 words (`bun-write-no-append.md`); no date or finding-ID prefix |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter plus the mistakes extensions (`priority`, `domain`). The staging-only `mistake-candidate: true` flag is **stripped on promotion** ([rules §2.6](../rules.md#26-staging-field-stripping-on-promotion)) — it never appears on a promoted mistake file.

```markdown
---
name: {slug — the trap, named}
description: {one-line what reliably breaks}
type: mistakes
scope: project | feature
feature: {feature-name} | null
status: active | superseded
created: YYYY-MM-DD
session: {session-id}
tags: [process, verification]        # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
priority: critical | high | medium | low
domain: {e.g. process, hooks, docs-sync}
supersedes: {prior mistake slug} | null      # plain slug, not a path
superseded_by: {newer mistake slug} | null    # plain slug, not a path
---

# {Title}

## What happened
{The mistake or trap, described concretely. What was attempted, what went wrong.}

## User feedback
{If the user surfaced this correction directly, the user's wording — paraphrased or quoted.}

## Why it happens
{The underlying cause. The reason this trap exists, not just that it occurred.}

## Correct approach
{What to do instead. Concrete and actionable.}

## How to detect
{Signs that you are about to hit this trap. Helps an agent spot the situation early.}

## Related
{Navigable `[[slug]]` links to learnings, decisions, or other mistakes with shared context ([rules §2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[file-move-needs-link-resolution-check]] — a related verification trap
```

## Notes

- **`priority` enum semantics.** `critical` = breaks the environment / loses data / blocks the session (always read at session start). `high` = wrong output that looks correct (catches you only on review or in production). `medium` = produces rework. `low` = cosmetic. An agent reads `critical` + `high` before any work touching the relevant area; `medium` / `low` when time allows.
- **Not every correction graduates.** When the user corrects an approach, the assistant decides during RECORD whether it generalizes (mistake-worthy) or was a one-off (record in `notes/` or the canonical artifact only). Mistakes are for patterns that will recur.
