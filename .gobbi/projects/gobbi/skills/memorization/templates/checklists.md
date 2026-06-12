# `checklists/`

**Feature-level implementation checklists** — concrete points the design must address for each scenario. Each checklist item is anchored to a scenario and either to a reference insight or marked `novel`. Accumulated across sessions like scenarios.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{N}-{loop}/staging/checklists/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Ideation** MEMORIZATION: append new checklist items from Ideation Sub-step D (Design) enumeration.
- During EVALUATION's **`checklist_gap` finding** routing: append the missing item surfaced by the evaluator Stage 1 Frame Build.
- During **Execution** MEMORIZATION: update checklist item status from `pending` → `implemented` when the corresponding work ships.

## Location

- **Feature-level only**: `.gobbi/projects/{project-name}/features/{feature}/checklists/`

## File naming

Bare-slug (evergreen — the date lives in frontmatter). See [`rules.md` § 1](../rules.md). `checklists/` is a **feature-subdir-only** type ([`rules.md` § 3](../rules.md)). Two valid patterns — choose one per feature:

- **Per-scenario file**: `{scenario-slug}.md` (mirrors `scenarios/{scenario-slug}.md`) — checklist items for that scenario in one file
- **Per-checklist file**: `{checklist-slug}.md` — one file per checklist item

Per-scenario file is the recommended default; per-checklist file makes sense when individual items are heavyweight (e.g., security-sensitive code requiring extensive justification).

## Item template — per-scenario file

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file); `scope: feature` always (feature-subdir-only).

```markdown
---
name: {scenario-slug}
description: {one-line — implementation checklist for this scenario}
type: checklists
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [{tag1}, {tag2}]
scenario: {scenario-slug}
---

# {Scenario title} — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | {Concrete implementation point} | {reference-slug or `novel`} | pending / implemented / deferred | {test name or check} |
| 2 | {...} | ... | ... | ... |

## Item details

### 1. {Item title}
{Optional longer description, only when the table cell is not enough.}

**Anchor reasoning**: {one sentence explaining why this reference applies, or why this is novel.}

**Verification approach**: {if more detail than the table allows.}
```

## Item template — per-checklist file

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file); `scope: feature` always. The per-item progress lives in the `item_status` extension (distinct from base `status`).

```markdown
---
name: {checklist-slug — short imperative title}
description: {one-line — the implementation point}
type: checklists
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [{tag1}, {tag2}]
scenario: {scenario-slug}
item_status: pending | implemented | deferred
anchor: {reference-slug or `novel`}
implemented_in: {changelog path} | null
---

# {Checklist item — short imperative title}

## What
{The concrete implementation point.}

## Why
{Why this is needed. If anchored to a reference, cite the insight. If novel, explain why no reference applied.}

## Verification
{Test name, manual check, or metric that confirms this item ships correctly.}

## Status notes
{Free-form: blockers, decisions deferred to user, current state.}
```

## Anchor discipline

Every checklist item must have an anchor — either a reference insight slug from `references/` or the literal string `novel`. Items without anchors are unanchored and become noise. The Step 4 of Ideation enforces this; the assistant carries it through MEMORIZATION.

## Item-status lifecycle

The `item_status` extension field (distinct from base `status`, which stays `active`) tracks each item's implementation progress:

- **`pending`** — added but not yet implemented; the Execution Loop is expected to address it
- **`implemented`** — the corresponding work shipped; cross-reference the changelog
- **`deferred`** — intentionally not implemented this round; cross-reference the backlog entry or decision record explaining why
