# `features/{feature-name}/` — the feature directory

> A durable-capability directory — one per gobbi value-feature, with a README identity doc plus one subdir per memory type scoped to this feature.

A feature directory is its **own tier**, not a project-scoped or feature-tagged content type ([`rules.md` § 3](../rules.md#3-structure-rules)). Its `README.md` is the **identity document**: a lightweight overview that points into the typed subdirs without duplicating them. Each subdir holds one memory type scoped to this feature (`design/`, `decisions/`, `scenarios/`, …), populated by Wrap-up promoting session staging.

This doc has two parts: the **map of a feature directory** (the per-feature subdir layout) and the **feature README spec** (how the identity doc is stamped and maintained).

## Core principles

> **Keep the README a current, lightweight index — point into the subdirs, never duplicate them.**

A reader scanning `features/` finds the feature's state and where its memory lives without opening every subdir or trusting a stale page.

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
├── mistakes/          # feature-scope mistakes            ← created lazily
├── rules/             # feature-specific rules            ← created lazily
├── learnings/         # feature-local insights            ← created lazily
├── reviews/           # feature-scope review activity     ← created lazily
└── reports/           # feature-scope reports             ← created lazily
```

The set is **README.md + 14 subdirectories**. Six — `changelogs/`, `mistakes/`, `rules/`, `learnings/`, `reviews/`, `reports/` — are created lazily and do not appear until the feature's first matching promotion (e.g. `features/workflow/` currently has 8 subdirs + README, missing those not yet fed).

### Per-subdir reference

The writer is uniform: **Wrap-up, on promotion** — loop RECORD never writes the feature tree. Wrap-up promotes the session `staging/` subtree into these subdirs and stamps each file with the matching template under [`templates/`](.). For the naming / frontmatter / structure rules every file obeys → [`rules.md`](../rules.md); for the tier-wide path index → [`memory-map.md`](../memory-map.md).

| Subdir | What it holds | Template |
|---|---|---|
| `README.md` | Feature overview, status, subdir pointers, recent-activity table (cap 20) | this doc (§ The feature README) |
| `scenarios/` | Feature scenarios promoted from session staging | [`scenarios.md`](scenarios.md) |
| `checklists/` | Feature implementation checklist items | [`checklists.md`](checklists.md) |
| `decisions/` | Feature-scope decisions (design choices, dispute rationales, deferred risks) | [`decisions.md`](decisions.md) |
| `design/` | Feature-scope design topics (project-wide design escalates to `.gobbi/projects/{project-name}/design/`) | [`design.md`](design.md) |
| `discussions/` | Substantive user-decision topics scoped to the feature | [`discussions.md`](discussions.md) |
| `references/` | External-insight references confirmed during Ideation Sub-step C | [`references.md`](references.md) |
| `plans/` | Plan artifacts from the Planning loop (date-prefixed) | [`plans.md`](plans.md) |
| `backlogs/` | Feature-scope deferred tasks | [`backlogs.md`](backlogs.md) |
| `changelogs/` | Feature-scope changelog entries — what shipped, when | [`changelogs.md`](changelogs.md) |
| `mistakes/` | Feature-scope mistakes — corrections that apply only within this feature | [`mistakes.md`](mistakes.md) |
| `rules/` | Feature-specific rules — conventions that bind only within this feature | [`rules.md`](rules.md) |
| `learnings/` | Feature-local insights — transferable lessons scoped to this feature; promote up to project `learnings/` when cross-feature | [`learnings.md`](learnings.md) |
| `reviews/` | Feature-scope review activity — review / audit results whose subject is this feature | [`reviews.md`](reviews.md) |
| `reports/` | Feature-scope reports — status / post-mortem / analytics docs scoped to this feature | [`reports.md`](reports.md) |

### Lazy bootstrapping

The feature directory is created on **first promotion** to that feature — not at Ideation Lock Scope or earlier. Each subdir is then created on its **first write**: Wrap-up creates the destination's parent dir only when it has a file to promote into it. Subdirs with no content yet do not exist on disk. `changelogs/` and `mistakes/` typically appear later than the rest, because a feature usually accrues design and decisions before it first ships a changelog entry or records a feature-scope mistake.

## The feature README (`README.md`) — identity-doc spec

### Purpose

The `README.md` gives a **high-level overview** of the feature, its current state, and pointers into the subdirs. It is **lightweight** — it points to the artifacts, never duplicates them. A reader scanning `features/` directory listings reads the READMEs to understand each feature without opening every subdir.

### Write it

| Field | Value |
|---|---|
| Written by | Wrap-up RECORD (direct write — no staging; loop RECORD never writes here) |
| When | At first promotion to a new feature (stamp a fresh README); and on subsequent activity (a later session promotes new design / plan / changelog), update the `Status` + `Recent activity` sections |
| Location | `.gobbi/projects/{project-name}/features/{feature-name}/README.md` |

### Frontmatter + body

The README carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file) plus the features extensions (`value_proposition`, `subsystems`). Its `name` is the fixed literal `README` (the filename stem), NOT the feature slug — every feature README shares `name: README`, so the validator exempts `README.md` from the cross-tree slug-uniqueness check ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)). The feature's identity slug lives in `feature: {own-slug}` + the dir name. The sprint-only keys (`pr`, `commit`, `head-commit`, `first-session`, `last-session`) are NOT on the README — per-ship metadata belongs in `changelogs/` entries. `tags` are declared per type — see [`rules.md` § 2.5](../rules.md#25-controlled-tags-vocabulary) for each type's controlled pool.

```markdown
---
name: README                # fixed literal — the filename stem, NOT the feature slug
description: {one-line what this feature is}
type: features
scope: feature
feature: {feature-name}   # self-reference — the README names its own feature
status: active | retired
created: YYYY-MM-DD
session: {session-id of first promotion to this feature}
tags: [memory, process]              # tags declared per type (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude | codex | user        # auto-stamped at promotion from session.json.system; user = human hand-edit
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
- `rules/` — {summary}
- `learnings/` — {summary}
- `reviews/` — {summary}
- `reports/` — {summary}

## Recent activity

| Date | Session | What |
|---|---|---|
| YYYY-MM-DD | {session_id} | {short summary — design shipped, plan revised, etc.} |

## Open items

{Bulleted list of currently-deferred items pointing to backlog entries.}

## Related
{Navigable `[[slug]]` links to project-level design / decision / plan documents that touch this feature ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[prompt-cascade]] — a project-level design this feature touches
- [[2026-05-11-orch-workflow-improvements]] — a cross-feature plan it relates to
```

## Notes

- **Recent-activity cap 20.** The table grows over time; cap it at the 20 most recent entries — older activity is recoverable from `changelogs/` and `decisions/`. Prune oldest when it exceeds the cap.
- **Coarse status only.** A value-feature is a durable capability, so base `status` is coarse: `active` while live, `retired` once removed. Fine-grained per-task progress lives in `changelogs/` and the Recent-activity table, not the README `status`. The manager flips `status` through the active runtime's user-decision primitive when retiring.
- **Retired → moved, never deleted.** On retirement the entire feature directory is `git mv`'d to `archive/features/{feature-name}/` per move-on-terminal ([`archive.md`](archive.md)); the active `features/` shows only live features.

## Cross-references

- Tier-wide path index (session-staging rows, cross-tier routing, the Templates index) → [`memory-map.md`](../memory-map.md). This doc owns the per-feature subdir spec; `memory-map.md` owns the tier-wide path index.
- Naming, frontmatter, structure rules — including `features` as its own tier → [`rules.md` § 3](../rules.md#3-structure-rules)
- Wrap-up's promotion + README stamp/update procedure → [`../../wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Move-on-terminal procedure for a retired feature directory → [`archive.md`](archive.md)
