# `scenarios/`

**Feature-level enumeration of situations the feature must handle** — golden paths, edge cases, failure modes, adversarial scenarios. Accumulated across sessions: each Ideation Loop appends new scenarios discovered during Step 4 or in EVALUATION's `scenario_gap` findings.

## Lifecycle (staging → promotion)

This template covers a file with **two write paths**:

1. **Loop MEMORIZATION** (`ideation` / `planning` / `execution`): stage at `sessions/{date}-{session-id}/{loop}/staging/scenarios/{slug}.md`. Loop MEMORIZATION **never** writes directly to project memory.
2. **Wrap-up's MEMORIZATION**: promotes the staged file to the destination listed under § Location below. Wrap-up is the sole writer to project memory; this template's Location section shows what the *promoted* file looks like.

For the canonical authority on staging → destination routing, see [`wrap-up/SKILL.md` § Staging → Project-memory routing](../../wrap-up/SKILL.md#staging--project-memory-routing).

---

## When to write

- During **Ideation** MEMORIZATION: append new scenarios from Ideation Sub-step D (Design) enumeration.
- During EVALUATION's **`scenario_gap` finding** routing: append the missing scenario surfaced by the evaluator's Stage 1 Frame Build.

This is the **persistent** location. Each session's `sessions/{id}/ideation/rawdata/` only holds the diff added in that session.

## Location

- **Feature-level only**: `.gobbi/projects/{project-name}/features/{feature}/scenarios/`

Scenarios are always bounded to a feature. Cross-feature scenarios belong in project-level `design/`, not here.

## File naming

`{scenario-slug}.md` — bare-slug (evergreen — the scenario set is durable; the date lives in frontmatter), one file per scenario, short and action-oriented. See [`rules.md` § 1](../rules.md). `scenarios/` is a **feature-subdir-only** type ([`rules.md` § 3](../rules.md)).

Example: `cold-start-cache-miss.md`, `password-reset-with-expired-token.md`, `concurrent-login-attempts.md`.

## Item template

Carries the [shared base frontmatter](../rules.md#21-shared-base-every-memory-file); `scope: feature` always (feature-subdir-only). The scenario coverage state lives in `category` + the body's status notes; base `status` stays `active`.

```markdown
---
name: {scenario-slug}
description: {one-line scenario description}
type: scenarios
scope: feature
feature: {feature-name}
status: active
created: YYYY-MM-DD
session: {session-id}
tags: [{tag1}, {tag2}]
category: golden-path | edge-case | failure-mode | adversarial
coverage: covered | partial | uncovered
---

# {Scenario title}

## Situation
{The concrete situation: who, what, when. Use a narrative one-paragraph form so a reader can picture the scenario without re-reading the design.}

## Inputs
{What inputs / state characterize this scenario.}

## Expected behavior
{What the system must do when this scenario occurs. State the contract, not the implementation.}

## Verification
{How we will know the design handles this scenario correctly. Reference test names, manual checks, or metrics.}

## Related
{Pointer to the design doc and any checklist items that implement this scenario.}
```

## Coverage field

The `coverage` extension field (distinct from the base `status` lifecycle field) tracks how well the scenario is handled:

- **`covered`** — the current design and implementation handle this scenario; verified by a test or check
- **`partial`** — the design intends to handle this but verification is incomplete
- **`uncovered`** — surfaced as a scenario gap but no design addresses it yet (the next Ideation iteration must address)

The Execution Loop's MEMORIZATION updates `coverage` from `partial` to `covered` when the corresponding verification ships. Base `status` stays `active` until the scenario is superseded.

## Append-only

Scenarios accumulate across sessions. Do not delete a scenario when the feature evolves — instead, set status to `uncovered` and document why in the body, or supersede with a more accurate scenario file. Deletion would lose the history of what the feature has been expected to handle. When a scenario is superseded, at Wrap-up it is moved (`git mv`) to `archive/scenarios/{date}-{slug}.md` per the move-on-terminal model (never deleted; full content preserved).
