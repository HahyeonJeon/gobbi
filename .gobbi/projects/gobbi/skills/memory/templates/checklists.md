# `checklists/`

> Feature-level implementation checklists — concrete points the design must address for each scenario. Each item is anchored to a scenario and to a reference insight or marked `novel`. Accumulated across sessions like scenarios.

## Core principles

> **Write each item anchored to its scenario and to a reference (or `novel`), with a verification that shows — not asserts — its status.**

An unanchored item, or a status with no verification behind it, makes the design's coverage unprovable rather than visible.

## Write it

| Field | Value |
|---|---|
| When | A productive step's RECORD after the user approves the candidate or the disposition of an evaluation finding. |
| Source cursor | Gobbi-owned session UUID plus the current `state.json` `step`, `stage: RECORD`, `iteration`, and `task`; `task` is `null` outside Execution. |
| Stage to | `sessions/{date}-{gobbi-session-id}/{N}-{step}/staging/checklists/{slug}.md`; Execution task candidates use the task's own staging root |
| Promotes to | `features/{f}/checklists/{area}/` — feature-subdir-only ([rules §3](../rules.md)) — `{area}` from this type's area list, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | Bare-slug, evergreen. Per-scenario file: `{scenario-slug}.md` (mirrors `scenarios/{scenario-slug}.md`; recommended default). Per-checklist file: `{checklist-slug}.md` (one file per item; use for heavyweight items). |

RECORD writes only the typed staging source. Wrap-up WORK is the only stage that promotes it to durable memory ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

## Frontmatter + body

Two valid shapes — choose one per feature. Both carry base frontmatter + the checklists extension (`scenario`); `scope: feature` always. `tags` come from this type's controlled pool ([rules §2.5](../rules.md#25-controlled-tags-vocabulary)). The per-checklist shape adds `item_status` (per-item progress, distinct from base `status`), `anchor`, and `implemented_in`.

### Per-scenario file

```markdown
---
name: {scenario-slug}
description: {one-line — implementation checklist for this scenario}
type: checklists
scope: feature
feature: {feature-name}
status: active | retired
created: YYYY-MM-DD
session: {Gobbi-owned session UUID}
tags: [execution, verification]      # this type's controlled pool (§2.5)
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
status: active | retired
created: YYYY-MM-DD
session: {Gobbi-owned session UUID}
tags: [execution, verification]      # this type's controlled pool (§2.5)
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

- **Every item needs an anchor.** Either a reference insight slug from `references/` or the literal string `novel`. Unanchored items become noise; Ideation WORK establishes this, and RECORD carries it into typed staging only after acceptance.
- **`item_status` (per-checklist file) tracks per-item progress** — distinct from base `status`:
  `pending` (added, not yet implemented; Execution is expected to address it) · `implemented` (work
  shipped; cross-reference the changelog) · `deferred` (intentionally skipped this round;
  cross-reference the backlog entry or decision explaining why).
- **Base `status` governs the checklist record.** `active` means it still governs future work. `retired`
  means it no longer does. A retired checklist has no successor unless a true replacement exists; this
  lifecycle uses no non-null `superseded_by` and archives with `addressed`, `dropped`, or `retired` as
  the evidence-supported reason.
- **`item_status` remains per-item progress.** It does not substitute for base retirement and does not
  authorize an archive move by itself.
