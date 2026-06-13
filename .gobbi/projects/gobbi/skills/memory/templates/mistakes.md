# `mistakes/`

**Recurring failure patterns** — things that look like they should work but reliably break. Each mistake records a specific failure mode plus the correct approach so future agents and sessions skip past it without re-failing.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop RECORD** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md` **with frontmatter `mistake-candidate: true`**. (Mistakes are routed through `staging/decisions/` with a frontmatter flag rather than a dedicated subdirectory; the flag tells Wrap-up to promote to `mistakes/` instead of `decisions/`.) Loop RECORD **never** writes directly to memory.
2. **Wrap-up's RECORD**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Memory routing](../../wrap-up/SKILL.md#staging--memory-routing).

---

## When to write

- Immediately during any loop's RECORD when the user corrected an approach or the loop discovered a non-obvious failure mode.
- During **Wrap-up** RECORD when cross-loop patterns reveal a recurring trap.

A correction not recorded is a correction repeated across sessions. Mistakes are the highest-value persistent memory in the system.

## Location

- **Project-level (default):** `.gobbi/projects/{project-name}/mistakes/` — for traps that transcend any single feature (the common case; `scope: project`, `feature: null`).
- **Feature-level:** `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` — when the trap is specific to one value-feature (`scope: feature`, `feature: {feature-name}`).

Mistakes are a **Both**-scope type (design §2.5, [`rules.md` § 3](../rules.md)). A feature-specific trap lives in that feature's own `mistakes/` subdir — NOT in the project `mistakes/` with a `feature:` tag. Wrap-up routes a `mistake-candidate: true` staging file to `features/{feature-name}/mistakes/` (feature-scope) or `mistakes/` (project-scope) per the user-confirmed scope (see [`wrap-up/SKILL.md` § Staging → Memory routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## File naming

`{slug}.md` — bare-slug, short, descriptive, names the trap in ≤6 words. No date prefix (evergreen); no finding-ID prefix. See [`rules.md` § 1](../rules.md).

Example: `parallel-docs-cleanup-drift.md`, `bun-write-no-append.md`, `sessionstart-hook-matcher.md`.

## Item template

The **promoted** mistake carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the mistakes-type extensions (`priority`, `domain`, `supersedes`, `superseded_by`). The staging-only `mistake-candidate: true` flag (which routed the file to `mistakes/`) is **stripped on promotion** ([`rules.md` § 2.3](../rules.md)) — it never appears on a promoted mistake file.

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
tags: [{tag1}, {tag2}]
priority: critical | high | medium | low
domain: {e.g. process, hooks, docs-sync}
supersedes: {prior mistake slug} | null
superseded_by: {newer mistake slug} | null
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
{Links to learnings, decisions, or other mistakes with shared context.}
```

## Priority levels

- **`critical`** — breaks the environment / loses data / blocks the session. Always read these at session start.
- **`high`** — wrong output that looks correct. Catches you only on review or in production.
- **`medium`** — produces rework. Annoying but not destructive.
- **`low`** — cosmetic or stylistic.

The agent loading this skill reads `critical` and `high` mistakes before starting any work touching the relevant area. `medium` and `low` are scanned when time allows.

## Promotion from corrections

When the user corrects an approach during DISCUSSION, the manager flags it as a candidate mistake. The assistant in RECORD decides whether the correction generalizes (mistake-worthy) or was a one-off (record in `notes/` or the canonical artifact only). Mistakes are for patterns that will recur; not every correction needs to graduate.
