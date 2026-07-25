---
name: all-loops-eval-bundle-rehome
description: Decide a coherent home for all five loops' scenario/checklist/evaluation bundles after the generic splits
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-07-16
session: 2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [process]
keywords: [evaluation-bundle, scenario, checklist, loop-symmetry, rehome]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Re-home the per-loop evaluation bundles coherently across all loops

## Context
The `{scenario,checklist,evaluation}.md` evaluation bundle is a 5-loop-symmetric asset resolved by the evaluator at the uniform path `{loop}/{scenario,checklist,evaluation}.md`. This session keeps `planning`'s bundle at its sibling paths (rewritten in place, per F2) rather than moving it, because moving only planning's would break the uniform resolution and touch four out-of-scope loops. After the generic split leaves each loop's `SKILL.md` generic, the bundle sits in a "generic" dir — a coherence smell to resolve once, for all loops, together.

## Why deferred
Moving the bundle is only coherent as an all-loops decision; doing it per-loop breaks symmetry. Blocked on the remaining loop splits ([[split-remaining-loop-skills]]).

## When to pick up
After (or with) the remaining four loop splits, when a single home for all five bundles can be chosen and the evaluator's uniform resolution re-pointed once.

## Suggested approach
Options to weigh at that time: keep bundles as loop-dir siblings (status quo, accept the generic-dir smell); move all five to an orchestration-owned home (e.g. `orchestration/evaluation-frames/{loop}/`); or a per-loop gobbi home paired with each folded workflow doc. Decide with the evaluator's Stage-0 resolution path (`evaluation/SKILL.md`) in view.

## Originating session
`.gobbi/projects/gobbi/sessions/2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5/`

## Related
- [[split-remaining-loop-skills]] — the loop splits this bundle decision rides with
