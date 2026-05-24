---
scenario: executor-brief-self-sufficiency
feature: session-foundations-bundle-b
last_updated: 2026-05-24
finding-id: d-ref-codes-missing-inline-expansion
type: checklist_gap
domain: docs-sync
disposition: open
confidence: 75
severity: Medium
surfaced-by: claude
loop: planning
---

# D-3-3/D-4/D-5/D-9 reference codes lack inline expansion for executors

## Situation

The plan brief references opaque decision codes (D-3-3-resolver step ii, D-4 design file, D-5 skip rationale, D-9 skip rationale) without inline expansion. Executors need Preparation iter3 context to interpret these. Without inline expansion, a fresh executor may misunderstand or skip the referenced decision logic.

Examples:
- Task 07 brief: "D-3-3-resolver step (ii) directory scan fallback"
- Task 07+08 agent table: "D-9 skip rationale — codify in script header until N≥2"
- Task 05: "per D-4 design file"

## Checklist Items

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Execution brief for Task 07 must inline-expand D-3-3-resolver step (ii): what it is and how to implement it | Preparation iter3 rawdata | pending | Manager adds inline expansion to delegation brief |
| 2 | Execution brief for Task 05 must inline-expand D-4 design file (5-file enumeration + excluded files) | Preparation D-4 staging design | pending | Manager adds inline expansion |
| 3 | Execution brief for Task 07+08 must inline-expand D-9 rationale (no `gobbi-shell-script-conventions` skill yet; codify in header comments) | Preparation D-9 skip decision | pending | Manager adds inline expansion |

## Notes

The manager can address this during Execution delegation by embedding the relevant decision text directly in each task's brief, rather than relying on the executor to load Preparation iter3 rawdata. The references are resolvable — the Preparation staging artifacts exist.
