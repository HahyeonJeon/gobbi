---
name: skill-md-pointer-line-correction
description: orchestration/SKILL.md §3/§6 pointer row cites stale line 247; post-#295 the pointer is at line 266
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-07
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [docs-sync, anchor, planning-note]
---

# orchestration/SKILL.md §3/§6 pointer — line correction checklist

## Planning note

The verify-only `orchestration/SKILL.md` §3/§6 pointer (out of scope for the current docs edit) was cited in the Preparation readiness report at **line 247**. This was the correct location pre-#295 (PR `a79b231`). After #295 added 19 lines to `orchestration/SKILL.md` (315→384 lines), the pointer moved to **line 266**. Line 247 post-#295 is a table separator (`|---|---|`).

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | If Planning or Wrap-up reproduce the anchors table from the readiness report, use line 266 (not 247) for the `orchestration/SKILL.md` §3/§6 pointer | `evaluation/iter2/claude/overall.md` F-S1 + `evaluation/iter2/codex/overall.md` CONS-ITER2-001 | pending | `grep -n "auto-mode.*§3\|§6" orchestration/SKILL.md` confirms line 266 |
| 2 | No out-of-scope edit is required — the pointer cites stable section names (§3/§6), and §7 trailing-append does not renumber §3 or §6 | verify-only | acknowledged | no edit needed |

## Item details

### 1. Use line 266, not 247

Both evaluator systems independently flagged this in iter2 (Claude F-S1 Medium, Codex CONS-ITER2-001 Low). The substantive conclusion is correct — the pointer is valid and no out-of-scope edit is required. Only the line number is stale in the readiness report's anchors table row.

**Anchor reasoning:** flagged by both iter2 evaluators; consistent cross-system finding.

**Verification approach:** `grep -n "auto-mode.*§3\|§6" .gobbi/projects/gobbi/skills/orchestration/SKILL.md` should return a match at line 266.
