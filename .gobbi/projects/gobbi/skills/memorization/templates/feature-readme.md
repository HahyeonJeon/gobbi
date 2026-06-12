# `features/{feature-name}/README.md`

Each feature directory has a `README.md` that gives a **high-level overview** of the feature, its current state, and pointers into the feature's subdirectories. Stamped by **Wrap-up's MEMORIZATION** on first promotion to a new feature (`features/{feature-name}/` is bootstrapped lazily on first promotion, not at Ideation Lock Scope).

## Lifecycle (Wrap-up direct write)

This template is written **directly by Wrap-up's MEMORIZATION** to its project-memory destination — there is no loop-MEMORIZATION staging path. Wrap-up authors the content (e.g., on first promotion to a new feature, on supersession, or from cross-session synthesis) and stamps this template.

Wrap-up is the sole writer; loop MEMORIZATION (Ideation / Planning / Execution) never writes to this destination.

---

## When to write

- **At first promotion to a new feature** (Wrap-up MEMORIZATION): Wrap-up stamps a fresh README from this template when creating a new `features/{feature-name}/` directory as part of promoting session staging.
- **During Wrap-up MEMORIZATION on subsequent sessions**: Wrap-up updates the README's "Status" and "Recent activity" sections to reflect the latest design, plan, or changelog promoted from session staging. Loop MEMORIZATION (Ideation / Planning / Execution) NEVER writes to this README — it stages content in `sessions/.../{N}-{loop}/staging/...` and Wrap-up promotes + updates the README in one step.

The README is **lightweight** — it points to the artifacts but does not duplicate them. A reader scanning `features/` directory listings reads the READMEs to understand each feature without opening every subdirectory.

## Location

- `.gobbi/projects/{project-name}/features/{feature-name}/README.md`

## Template

The README carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the features-type extensions (`value_proposition`, `subsystems`). A feature README is the feature's **identity document**, so it is self-referential: `scope: feature` and `feature: {own-slug}` name the feature itself. The sprint-only keys (`pr`, `commit`, `head-commit`, `first-session`, `last-session`) are NOT on the README — per-ship metadata belongs in `changelogs/` entries, not the value-feature identity.

```markdown
---
name: {feature-name}
description: {one-line what this feature is}
type: features
scope: feature
feature: {feature-name}   # self-reference — the README names its own feature
status: active | retired
created: YYYY-MM-DD
session: {session-id of first promotion to this feature}
tags: [{tag1}, {tag2}]
value_proposition: {the one-liner — "what gobbi does for me"}
subsystems: [{skill / path this value-feature owns}]
---

# {Feature display name}

## Overview
{Two or three sentences: what this feature is, what problem it solves, where it fits in the project.}

## Status
{One paragraph: current state of the feature. What's shipped, what's in progress, what's deferred.}

## Subdirectories

- `design/` — {one-line summary of what's here, count of files}
- `discussions/` — {summary}
- `decisions/` — {summary}
- `plans/` — {summary}
- `scenarios/` — {summary}
- `checklists/` — {summary}
- `backlogs/` — {summary}
- `changelogs/` — {summary}

## Recent activity

| Date | Session | What |
|---|---|---|
| YYYY-MM-DD | {session_id} | {short summary — design shipped, plan revised, etc.} |

## Open items

{Bulleted list of currently-deferred items pointing to backlog entries.}

## Related
{Pointers to project-level design / decision / plan documents that touch this feature.}
```

## Update discipline

The "Recent activity" table grows over time. Cap it at the **20 most recent entries** — older activity is recoverable from the changelogs and decisions directories. The assistant prunes oldest entries when the table exceeds the cap.

## When status changes

A value-feature is a durable capability, so its base `status` is coarse — `active` while the capability is live, `retired` once it is removed. The fine-grained progress of work within the feature (planned / in-progress / shipped per task) lives in `changelogs/` entries and the Recent-activity table, not in the README `status` field.

- **`active`** — the feature is a live gobbi capability (the default for every promoted feature)
- **`retired`** — the feature is removed or superseded; at Wrap-up the entire feature directory is moved (`git mv`) to `archive/features/{feature-name}/` per the move-on-terminal model (never deleted; the active `features/` shows only live features)

The manager updates `status` through the active runtime's user-decision primitive when retiring a feature. Per-task / per-session progress is recorded in `changelogs/` and the Recent-activity table, not by flipping the README `status`.
