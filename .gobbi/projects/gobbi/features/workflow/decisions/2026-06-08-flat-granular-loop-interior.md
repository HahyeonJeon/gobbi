---
name: flat-granular-loop-interior
description: Use a flat, explicitly-named 4-slot per-loop interior (working/evaluation/staging/outputs) instead of grouped parent dirs.
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [session-memory, directory-structure, loop-interior]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Use a flat, granular 4-slot loop interior

## Context

The Ideation loop considered three options for the per-loop interior: (A) role-split interior with a grouping parent (`docs/` wrapping `staging/` and `artifacts/`); (B) workflow-step-matched top level with the unchanged quartet; (C) surgical rawdata split only. The design also explored renaming `staging/` and `artifacts/` under a `docs/` parent dir. The user reviewed the concrete tree in a final-gate round and requested changes: explicitly-named per-role dirs instead of grouped parents.

## Decision

Use a flat 4-slot loop interior: `working/ evaluation/ staging/ outputs/`. No grouping parent dirs. Each dir is named by its role. `staging/` and `outputs/` stay at the loop root (not under a `docs/` parent).

## Rationale

The user's exact words: "more specified directories like outputs/ transcripts/ evaluation/ staging/ for each loop." Flat + explicitly named means a developer opening the loop dir reads the role directly from the dir name without navigating into a parent. Grouping parents (`docs/`) add a navigation hop without clarifying anything that the flat names do not already state. The flat model is also determinism-stronger: the init script creates the same set of known dirs per loop with no inferred grouping.

## Alternatives considered

- `docs/` parent wrapping `staging/` and `outputs/`: rejected because it adds a navigation hop and changes heavily-invested path contracts (`staging/` appears in hundreds of doc occurrences). The user preferred explicit names over grouping.
- Unchanged quartet (`rawdata/staging/evaluation/artifacts/`): rejected because `rawdata/` mixed four data roles and `artifacts/` did not describe what it held.

## Consequences

- The per-loop interior has exactly 4 slots: `working/` `evaluation/` `staging/` `outputs/`.
- `rawdata/` is renamed to `working/`; `artifacts/` is renamed to `outputs/`. `staging/` and `evaluation/` keep their names.
- The init script creates this same 4-slot set for every loop (plus per-loop staging subdir vocabulary).
- `transcripts/` is NOT one of the 4 loop slots. It lives at the single session root.
- Doc sweep renames `rawdata/` → `working/` and `artifacts/` → `outputs/` across all loop/orchestration/memorization skill docs.

## Related

- design/session-memory-tree.md
- decisions/2026-06-08-single-root-transcripts.md
