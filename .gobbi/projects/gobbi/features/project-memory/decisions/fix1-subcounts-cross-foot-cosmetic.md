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

The Ideation readiness work stated that 62 files carry `disposition`, with 28 legitimate backlog
files and 35 non-backlog leak candidates. However:
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

## Rationale

The discrepancy is purely a filter-choice artifact: the loose filter counts a backlog file under the
excluded `agents/` surface, the strict P_live filter does not. The FIX-1 predicate and the leak-file
set reproduce identically under the canonical filter regardless of which sub-count is cited, so the
cross-foot is cosmetic, not a baseline error.

## Alternatives considered

Pick the loose filter (28) as canonical — rejected: the strict P_live filter is the predicate the
conformance gate actually uses, so the canonical sub-count must match it (27) to avoid a second drift.

## Consequences

- No change to the FIX-1 predicate, the key-set S, or the leak-file target.
- Execution implementation must use one consistent filter throughout.

## Related

- [fx1-sub-count-cross-foot](fx1-sub-count-cross-foot.md) — the companion decision recording the same cross-foot from the Preparation side
- [type-aware-strip-disposition-not-blanket-leak](type-aware-strip-disposition-not-blanket-leak.md) — the FIX-1 predicate whose count this reconciles

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Ideation review, overall perspective (CN-1 / N1, Low).
