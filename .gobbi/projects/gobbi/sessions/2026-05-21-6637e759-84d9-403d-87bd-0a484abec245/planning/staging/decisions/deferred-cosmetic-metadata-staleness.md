---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
status: deferred
feature: repo-reset
finding-id: F-IT4-CL-O-01
finding-type: general
domain: docs-sync
severity: Low
confidence: 100
disposition: deferred
supersedes: null
superseded_by: null
---

# Deferred: main.md Frontmatter/Metadata Staleness (iter:, Title Bracket, Cross-references)

## Context

iter4's tight enumeration carve-out (3 leader edits + 3 manager-bookkeeping edits) left some metadata outside the substitution scope: main.md frontmatter `iter: 3`, main.md title bracket (still names iter3), Cross-references pointer at line 154 still names `draft-iter2.md` (now corrected to `draft-iter3.md` by edit 2, but `iter: 3` remains). Claude iter4 surfaced these as Low/100 cosmetic findings (convergent across Structure, Usage, Consistency perspectives).

## Why deferred

This is an inherent consequence of the LIGHT iter discipline (enumerate-then-substitute). The iter4 brief deliberately excluded metadata updates from the scope. The content-level cues (line 55 enumerates D-PLAN-12, D-PLAN-12 exists in the linked rawdata) mitigate the staleness for a careful reader.

Not a regression: iter3 had identical staleness on the iter2→iter3 substitution boundary.

## Condition to reconsider

If a follow-up planning revision occurs (e.g., during Execution if a deferred finding gets re-opened), bump frontmatter `iter:` to 4 + title bracket + any remaining metadata in that pass.

## Related

- `planning/evaluation/iter4/claude/overall.md` § F-IT4-CL-O-01
- `planning/staging/plans/main.md`
