# `scenarios/`

> Feature-level enumeration of situations the feature must handle — golden paths, edge cases, failure modes, adversarial scenarios. Accumulated across sessions, one file per scenario.

## Core principles

> **State the situation, its inputs, and the expected behavior explicitly — the contract the system must meet, not the steps it takes.**

An expected behavior that is implied, or written as implementation steps, is a scenario no reader can verify against.

## Write it

| Field | Value |
|---|---|
| When | A productive step's RECORD after the user approves the candidate or the disposition of an evaluation finding. This is the persistent set; each iteration's working directory holds only that iteration's creation evidence. |
| Source cursor | Gobbi-owned session UUID plus the current `state.json` `step`, `stage: RECORD`, `iteration`, and `task`; `task` is `null` outside Execution. |
| Stage to | `sessions/{date}-{gobbi-session-id}/{N}-{step}/staging/scenarios/{slug}.md`; Execution task candidates use the task's own staging root |
| Promotes to | `features/{f}/scenarios/{area}/` (feature-only — scenarios are always bounded to a feature; cross-feature scenarios belong in project `design/`) — `{area}` from this type's area list, resolved by the [§1.5 selection rule](../rules.md#15-area-namespace-the-second-category-axis-under-each-type) |
| Filename | `{scenario-slug}.md` — bare-slug (evergreen; date lives in frontmatter); one file per scenario, short and action-oriented (`cold-start-cache-miss.md`) |

RECORD writes only the typed staging source. Wrap-up WORK is the only stage that promotes it to durable memory ([routing](../../wrap-up/promotion.md#staging--memory-routing)).

## Frontmatter + body

Base frontmatter ONLY (no scenarios extension row); `scope: feature` always (feature-subdir-only). The scenario `Category` and `Coverage` state live in the **body** (below), not frontmatter, so Wrap-up WORK's allowlist strip cannot drop them; base `status` stays `active` ([rules §2.2](../rules.md#22-per-type-extension-fields--the-status-model)).

```markdown
---
name: {scenario-slug}
description: {one-line scenario description}
type: scenarios
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {Gobbi-owned session UUID}
tags: [execution, verification]      # this type's controlled pool (§2.5)
keywords: []                         # freeform escape-hatch tags (required; may be [])
author: claude                       # claude | codex | user — the runtime that authored it
---

# {Scenario title}

**Category:** golden-path | edge-case | failure-mode | adversarial
**Coverage:** covered | partial | uncovered

## Situation
{The concrete situation: who, what, when. Use a narrative one-paragraph form so a reader can picture the scenario without re-reading the design.}

## Inputs
{What inputs / state characterize this scenario.}

## Expected behavior
{What the system must do when this scenario occurs. State the contract, not the implementation.}

## Verification
{How we will know the design handles this scenario correctly. Reference test names, manual checks, or metrics.}

## Related
{Navigable `[[slug]]` links to the design doc and the checklist items that implement this scenario ([`rules.md` § 2.4](../rules.md#24-cross-references-and-the-doc-graph)).}

- [[cache-invalidation]] — the design covering this scenario
```

## Notes

- **`Coverage` enum semantics.** The body `Coverage` field (distinct from the base `status` lifecycle field) tracks how well the scenario is handled: **`covered`** = current design + implementation handle it, verified by a test or check; **`partial`** = the design intends to handle it but verification is incomplete; **`uncovered`** = surfaced as a gap with no design yet (the next Ideation iteration must address). Execution RECORD flips `partial` → `covered` when the verification ships.
- **Append, do not delete.** When the feature evolves, do not delete a stale scenario — set its `Coverage` to `uncovered` with a body note, or supersede it with a more accurate file. Deletion would lose the history of what the feature has been expected to handle.
