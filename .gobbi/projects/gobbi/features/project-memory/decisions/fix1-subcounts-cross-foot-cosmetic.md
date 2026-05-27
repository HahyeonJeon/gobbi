---
name: fix1-subcounts-cross-foot-cosmetic
description: FIX-1 disposition sub-counts use mixed filters (28+35=63); under single P_live filter it is 27+35=62. Cosmetic — does not affect the predicate or the 59-file leak set.
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [fix1, disposition, subcounts, cosmetic]
decision_status: accepted
finding-iter: 2
---

# FIX-1 disposition sub-counts: cosmetic cross-foot (normalize at Execution)

## Context

`draft-iter2.md:187` states: 62 files carry `disposition`, with 28 legitimate backlog files and
35 non-backlog leak candidates. However:
- The 28 count used a looser backlog filter (all `*/backlogs/*` not under `sessions/` or `archive/`).
- Under the single canonical P_live filter (also excludes `agents/`), the backlog-disposition
  count is **27** — because `.gobbi/projects/gobbi/features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` is under the excluded `agents/` surface.
- Correct cross-foot: 27 + 35 = 62 (matches the total).

## Decision

The FIX-1 predicate and the 59-file leak set are unaffected — both reproduce exactly under the
canonical P_live filter. The cosmetic sub-count discrepancy (28 vs 27) is normalized at Execution
when the precise strip script is written: use the single canonical P_live filter throughout (not a
separate looser backlog filter).

At Execution, state explicitly: "28 legitimate backlog files (using loose `*/backlogs/*` filter)"
OR "27 legitimate backlog files (using strict P_live filter)". Do not mix filters in the same
count narrative.

## Consequences

- No change to the FIX-1 predicate, the key-set S, or the 59-file target.
- Execution implementation must use one consistent filter throughout.

## Related

- `ideation/evaluation/iter2/claude/overall.md` (CN-1, Low/100)
- `ideation/evaluation/iter2/codex/overall.md` (N1, Low/100)
- `ideation/artifacts/design-options.md` (D6/FIX-1)
