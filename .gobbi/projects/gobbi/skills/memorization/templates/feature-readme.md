# `features/{feature-name}/README.md`

Each feature directory has a `README.md` that gives a **high-level overview** of the feature, its current state, and pointers into the feature's subdirectories. Stamped by **Wrap-up's MEMORIZATION** on first promotion to a new feature (`features/{feature-name}/` is bootstrapped lazily on first promotion, not at Ideation Lock Scope).

## Lifecycle (Wrap-up direct write)

This template is written **directly by Wrap-up's MEMORIZATION** to its project-memory destination — there is no loop-MEMORIZATION staging path. Wrap-up authors the content (e.g., on first promotion to a new feature, on supersession, or from cross-session synthesis) and stamps this template.

Wrap-up is the sole writer; loop MEMORIZATION (Ideation / Planning / Execution) never writes to this destination.

---

## When to write

- **At first promotion to a new feature** (Wrap-up MEMORIZATION): Wrap-up stamps a fresh README from this template when creating a new `features/{feature-name}/` directory as part of promoting session staging.
- **During Wrap-up MEMORIZATION on subsequent sessions**: Wrap-up updates the README's "Status" and "Recent activity" sections to reflect the latest design, plan, or changelog promoted from session staging. Loop MEMORIZATION (Ideation / Planning / Execution) NEVER writes to this README — it stages content in `sessions/.../{loop}/staging/...` and Wrap-up promotes + updates the README in one step.

The README is **lightweight** — it points to the artifacts but does not duplicate them. A reader scanning `features/` directory listings reads the READMEs to understand each feature without opening every subdirectory.

## Location

- `.gobbi/projects/{project-name}/features/{feature-name}/README.md`

## Template

```markdown
---
feature: {feature-name}
project: {project-name}
status: planned | in-progress | shipped | archived
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
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

The `status` field transitions:

- **`planned`** — feature exists in design but no plan shipped yet
- **`in-progress`** — at least one task shipped, more work outstanding (backlog entries exist)
- **`shipped`** — primary scope of the feature is complete; backlog is empty or only contains nice-to-haves
- **`archived`** — feature is retired or superseded; at Wrap-up the entire feature directory is moved (`git mv`) to `archive/features/{feature-name}/` per the move-on-terminal model (never deleted; the active `features/` shows only live features)

The manager updates `status` via AskUserQuestion at session start when reactivating a feature, or the assistant updates it during MEMORIZATION when objective triggers fire (e.g., shipping the last in-scope task moves `in-progress` → `shipped`).
