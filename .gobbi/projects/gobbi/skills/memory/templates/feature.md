# `features/{feature-name}/` — the feature directory

## What a feature directory is

A feature directory is a **durable-capability directory** — one per gobbi value-feature, not a project-scoped or feature-tagged content type like the rest of memory (see [`rules.md` § 3](../rules.md), where `features` is its own tier). Its `README.md` is the feature's **identity document**: a lightweight overview that points into the feature's typed subdirectories without duplicating them. Each subdirectory holds one memory type scoped to this feature (`design/`, `decisions/`, `scenarios/`, …), populated by Wrap-up promoting session staging.

This doc has two halves: the **map of a feature directory** (the per-feature subdir layout — what each part is for) and the **feature README spec** (how the identity doc is stamped and maintained).

## Map of a feature directory

### Directory layout

```
features/{feature-name}/
├── README.md          # identity doc — overview, status, subdir pointers, recent activity
├── scenarios/         # feature scenarios
├── checklists/        # implementation checklist items
├── decisions/         # feature-scope decisions
├── design/            # feature-scope design topics
├── discussions/       # feature-scope user-decision topics
├── references/        # external-insight references
├── plans/             # plan artifacts (date-prefixed)
├── backlogs/          # feature-scope deferred tasks
├── changelogs/        # feature-scope changelog entries   ← created lazily
└── mistakes/          # feature-scope mistakes            ← created lazily
```

The set is **README.md + 10 subdirectories**. Two of them — `changelogs/` and `mistakes/` — are created lazily and do not appear until the feature's first changelog or feature-scope mistake is promoted (e.g., `features/workflow/` currently has 8 subdirs + README, missing those two).

### Per-subdir reference

The writer is uniform: **Wrap-up, on promotion** — loop RECORD never writes the feature tree. Wrap-up promotes the session `staging/` subtree into these subdirs and stamps each file with the matching template under [`templates/`](.). For the authoritative naming, frontmatter, and structure rules every file here obeys, see [`rules.md`](../rules.md); for the tier-wide path index (session-staging rows + cross-tier routing), see [`memory-map.md`](../memory-map.md).

| Subdir | What it holds | Template |
|---|---|---|
| `README.md` | Feature overview, status, subdirectory pointers, recent-activity table (cap 20 entries) | this doc (§ The feature README) |
| `scenarios/` | Feature scenarios promoted from session staging | [`scenarios.md`](scenarios.md) |
| `checklists/` | Feature implementation checklist items | [`checklists.md`](checklists.md) |
| `decisions/` | Feature-scope decisions (design choices, dispute rationales, deferred risks) | [`decisions.md`](decisions.md) |
| `design/` | Feature-scope design topics (project-wide design escalates to `.gobbi/projects/{project-name}/design/`) | [`design.md`](design.md) |
| `discussions/` | Substantive user-decision topics scoped to the feature | [`discussions.md`](discussions.md) |
| `references/` | External-insight references confirmed during Ideation Sub-step C | [`references.md`](references.md) |
| `plans/` | Plan artifacts produced by the Planning loop (date-prefixed for chronological ordering) | [`plans.md`](plans.md) |
| `backlogs/` | Feature-scope deferred tasks | [`backlogs.md`](backlogs.md) |
| `changelogs/` | Feature-scope changelog entries — what shipped, when | [`changelogs.md`](changelogs.md) |
| `mistakes/` | Feature-scope mistakes — corrections that apply only within this feature | [`mistakes.md`](mistakes.md) |

### Lazy bootstrapping

The feature directory is created on **first promotion** to that feature — not at Ideation Lock Scope or earlier. Each subdirectory is then created on its **first write**: Wrap-up creates the destination's parent directory only when it has a file to promote into it. Subdirs that have received no content yet do not exist on disk. `changelogs/` and `mistakes/` typically appear later than the rest, because a feature usually accrues design and decisions before it first ships a changelog entry or records a feature-scope mistake.

## The feature README (`README.md`) — identity-doc spec

### Purpose

Each feature directory has a `README.md` that gives a **high-level overview** of the feature, its current state, and pointers into the feature's subdirectories. The README is **lightweight** — it points to the artifacts but does not duplicate them. A reader scanning `features/` directory listings reads the READMEs to understand each feature without opening every subdirectory.

### Lifecycle (Wrap-up direct write)

This template is written **directly by Wrap-up's RECORD** to its memory destination — there is no loop-RECORD staging path. Wrap-up authors the content (e.g., on first promotion to a new feature, on supersession, or from cross-session synthesis) and stamps this template.

Wrap-up is the sole writer; loop RECORD (Ideation / Planning / Execution) never writes to this destination.

### When to write

- **At first promotion to a new feature** (Wrap-up RECORD): Wrap-up stamps a fresh README from this template when creating a new `features/{feature-name}/` directory as part of promoting session staging.
- **During Wrap-up RECORD on subsequent sessions**: Wrap-up updates the README's "Status" and "Recent activity" sections to reflect the latest design, plan, or changelog promoted from session staging. Loop RECORD (Ideation / Planning / Execution) NEVER writes to this README — it stages content in `sessions/.../{N}-{loop}/staging/...` and Wrap-up promotes + updates the README in one step.

### Location

- `.gobbi/projects/{project-name}/features/{feature-name}/README.md`

### Template

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

- `scenarios/` — {one-line summary of what's here, count of files}
- `checklists/` — {summary}
- `decisions/` — {summary}
- `design/` — {summary}
- `discussions/` — {summary}
- `references/` — {summary}
- `plans/` — {summary}
- `backlogs/` — {summary}
- `changelogs/` — {summary}
- `mistakes/` — {summary}

## Recent activity

| Date | Session | What |
|---|---|---|
| YYYY-MM-DD | {session_id} | {short summary — design shipped, plan revised, etc.} |

## Open items

{Bulleted list of currently-deferred items pointing to backlog entries.}

## Related
{Pointers to project-level design / decision / plan documents that touch this feature.}
```

### Update discipline

The "Recent activity" table grows over time. Cap it at the **20 most recent entries** — older activity is recoverable from the changelogs and decisions directories. The assistant prunes oldest entries when the table exceeds the cap.

### When status changes

A value-feature is a durable capability, so its base `status` is coarse — `active` while the capability is live, `retired` once it is removed. The fine-grained progress of work within the feature (planned / in-progress / shipped per task) lives in `changelogs/` entries and the Recent-activity table, not in the README `status` field.

- **`active`** — the feature is a live gobbi capability (the default for every promoted feature)
- **`retired`** — the feature is removed or superseded; at Wrap-up the entire feature directory is moved (`git mv`) to `archive/features/{feature-name}/` per the move-on-terminal model (never deleted; the active `features/` shows only live features)

The manager updates `status` through the active runtime's user-decision primitive when retiring a feature. Per-task / per-session progress is recorded in `changelogs/` and the Recent-activity table, not by flipping the README `status`.

## Cross-references

- Tier-wide path index (session-staging rows, cross-tier routing, the Templates index) → [`memory-map.md`](../memory-map.md). This doc owns the per-feature subdir spec (what each holds, when/who writes, lazy bootstrapping); `memory-map.md` owns the tier-wide path index.
- Naming convention, frontmatter standard, structure rules — including `features` as its own tier → [`rules.md` § 3](../rules.md)
- Wrap-up's promotion + README stamp/update procedure → [`../../wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Move-on-terminal procedure for a retired feature directory → [`archive.md`](archive.md)
