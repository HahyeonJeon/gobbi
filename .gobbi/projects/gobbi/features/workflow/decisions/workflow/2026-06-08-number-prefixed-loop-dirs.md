---
name: number-prefixed-loop-dirs
description: Prefix loop dirs with a fixed ordinal (1-ideation ... 5-wrap-up) so ls reads the workflow in order; task dirs use task-{NN}-{slug} including a descriptive slug.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: []
keywords: [session-memory, directory-naming, loop-dirs]
author: claude
supersedes: null
superseded_by: null
---

# Number-prefix loop dirs; task dirs include a slug

## Context

The Ideation options included Option B (number-prefixed loop dirs for `ls`-ordering). The user confirmed the number-prefix in the design gates. The user also requested that Execution task dirs include a slug: `task-{NN}/` → `task-{NN}-{slug}/`. The naming rule in `memorization/rules.md` §1.3 warns against positional/sequence indices in memory-file slugs — this required an explicit carve-out.

## Decision

Loop dirs are named `{N}-{loop}` with a fixed ordinal: `1-ideation` `2-preparation` `3-planning` `4-execution` `5-wrap-up`. Execution task dirs are named `task-{NN}-{slug}` where `{NN}` is a two-digit ordinal and `{slug}` is the plan's task name in kebab-case.

`workflow.{loop}` JSON keys in `session.json` and `state.json` stay bare (`ideation`, not `1-ideation`). Only the on-disk directory carries the prefix.

A new carve-out sentence is added to `memorization/rules.md` §1.3 to clarify that number-prefixed session step-dirs are a meaningful workflow-order index on a runtime scaffold dir — not a memory-file slug — and are outside the naming standard's scope.

## Rationale

A bare `ls` of the session dir reads as the workflow in order. This matches the agent trace/span tree pattern (EXT-3 insight): gobbi's workflow is a graph, so a session tree that mirrors that graph makes step-to-phase-to-output legible as a path. The number prefix encodes the workflow step sequence directly. The `task-{NN}-{slug}` form adds the task name so a developer can read `task-01-scaffold-script/` and know what the task is without opening files.

The `memorization/rules.md` smell rule targets memory-file slugs; session step-dirs are runtime scaffold, not memory files, and the rule's own scope boundary excludes `sessions/` runtime files already.

## Alternatives considered

- Bare loop dirs (`ideation/`, `preparation/`, …): rejected because `ls` produces alphabetical order, not workflow order. The alphabetical ordering of `evaluation < execution < ideation < planning < preparation < wrap-up` is not useful to a human debugging a session.
- Single opaque `{step-dir}` variable: rejected because `{loop}` must stay legible inside the path.

## Consequences

- Every `sessions/.../{loop}/` path in all docs becomes `sessions/.../{N}-{loop}/`.
- The `{loop}` path variable updates to `{N}-{loop}` at its definition sites.
- `workflow.{loop}` JSON keys in `session.json`/`state.json` stay bare — no JSON key rename.
- `memorization/rules.md` §1.3 gains one carve-out paragraph.
- The scaffold script validates `<step-dir>` against the fixed allowed set (`1-ideation` … `5-wrap-up`, `4-execution/task-{NN}-{slug}`).

## Related

- design/workflow/session-memory-tree.md
- decisions/workflow/2026-06-08-flat-granular-loop-interior.md
