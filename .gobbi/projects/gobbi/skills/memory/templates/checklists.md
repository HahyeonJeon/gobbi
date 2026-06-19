# `checklists/`

> Feature-level implementation checklists — concrete points the design must address for each scenario. Each item is anchored to a scenario and to a reference insight or marked `novel`. Accumulated across sessions like scenarios.

## Core principle
Track per-item verification status against a scenario or spec — so the design's coverage of each scenario is visible and checkable, not assumed.

## Write it

| Field | Value |
|---|---|
| When | Ideation RECORD (Sub-step D Design enumeration); EVALUATION's `checklist_gap` finding (append the missing item); Execution RECORD (flip item status `pending` → `implemented` when the work ships). |
| Stage to | `sessions/{date}-{id}/{N}-{loop}/staging/checklists/{slug}.md` |
| Promotes to | `features/{f}/checklists/` — feature-subdir-only ([rules §3](../rules.md)) |
| Filename | Bare-slug, evergreen. Per-scenario file: `{scenario-slug}.md` (mirrors `scenarios/{scenario-slug}.md`; recommended default). Per-checklist file: `{checklist-slug}.md` (one file per item; use for heavyweight items). |

Loop RECORD stages; Wrap-up promotes ([routing](../../wrap-up/SKILL.md#staging--memory-routing)).

## Frontmatter + body

Two valid shapes — choose one per feature. Both carry base frontmatter + the checklists extension (`scenario`); `scope: feature` always. `tags` come from the controlled vocabulary ([rules §2.5](../rules.md#25-controlled-tags-vocabulary)). The per-checklist shape adds `item_status` (per-item progress, distinct from base `status`), `anchor`, and `implemented_in`.

### Per-scenario file

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
tags: [execution, verification]      # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
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

## Related
{Navigable `[[slug]]` links to the scenario this checklist implements and any reference insights its items anchor to ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[cold-start-cache-miss]] — the scenario this checklist implements
```

### Per-checklist file

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
tags: [execution, verification]      # controlled vocabulary (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
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

## Related
{Navigable `[[slug]]` links to the scenario this item implements and the reference it anchors to ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[cold-start-cache-miss]] — the scenario this item implements
```

## Notes

- **Every item needs an anchor.** Either a reference insight slug from `references/` or the literal string `novel`. Unanchored items become noise; Ideation Step 4 enforces this, and the assistant carries it through RECORD.
- **`item_status` (per-checklist file) tracks per-item progress** — distinct from base `status`, which stays `active`: `pending` (added, not yet implemented; Execution is expected to address it) · `implemented` (work shipped; cross-reference the changelog) · `deferred` (intentionally skipped this round; cross-reference the backlog entry or decision explaining why).
