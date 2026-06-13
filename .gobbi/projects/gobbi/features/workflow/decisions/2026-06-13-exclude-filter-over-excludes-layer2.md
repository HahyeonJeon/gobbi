---
name: exclude-filter-over-excludes-layer2
description: Tasks 03/07 verifies exclude all 4 layer2 mistake files but the brief's EXCLUDE list names only 2 of them
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [planning, verification, scope-discipline, layer2-mistakes]
decision_status: accepted
supersedes: null
superseded_by: null
---

# EXCLUDE filter in tasks 03/07 over-excludes layer2 mistake files

## Context

Tasks 03 and 07's `verifies` commands filter `grep -vE '...|skills/mistake/layer2-'`, which excludes all 4 `skills/mistake/layer2-*.md` files from the "no residual old-vocab refs" check. However, the brief's 21-file EXCLUDE list names only 2 of these files: `layer2-sweep-grep-form-specific-blindspot.md` and `layer2-verify-state-from-authoritative-source-not-proxy.md`. The other 2 (`layer2-cotouch-enumeration-must-cover-semantic-equivalents.md`, `layer2-planning-leader-asserted-file-type-without-verifying.md`) are not in the EXCLUDE list.

Both evaluators noted this as a Low finding (CONS-2 iter1, not re-raised in iter2 at the same severity). The over-exclusion is functionally harmless for this plan because neither of the extra-excluded files currently carries renameable vocabulary.

## Decision

Accept the over-exclusion for this plan. The `layer2-` prefix filter is intentionally broad to protect all layer2 mistake records as a class from the vocabulary sweep, even if the brief only names 2. The 2 extra-excluded files contain no vocabulary that would be swept, making this a harmless inconsistency.

## Rationale

Narrowing the filter to the 2 named files is technically more precise but adds maintenance burden if new layer2 files are created. Treating all `layer2-*` files as the sweep-exclusion class is a defensible conservative choice that prevents accidental modification of any layer2 mistake record.

## Alternatives considered

- Narrow filter to the 2 named EXCLUDE files (not chosen: adds brittle per-file enumeration; new layer2 files would require updating the filter each time).
- Note explicitly that all layer2 records are EXCLUDE-by-convention (accepted: documented here).

## Consequences

All 4 current and any future `layer2-*.md` mistake records are treated as EXCLUDE in the vocabulary sweep. This is intentional. The effective EXCLUDE set for the filter is larger than the brief's explicit list, but no file in that extra-exclusion set contains vocabulary this plan sweeps.

## Related

- `3-planning/evaluation/iter1/claude/consistency.md` § CONS-2
- `3-planning/working/draft-iter2.md` § tasks 03 and 07 verifies
