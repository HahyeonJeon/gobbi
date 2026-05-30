# Perspective: Performance

**Target:** T8 Workflow refactor across 3 docs

Performance lens for static markdown docs: load cost (LLM context tokens), reading time, redundancy.

## Findings

### F-P1 — Net token delta is positive (-93 + 104 + 112 = +123 lines net across 3 files)
- Type: `general` | Domain: `docs-sync` | Disposition: open | Confidence: 100 | Severity: Low
- chat-mode 508→612 (+104), auto-mode 202→314 (+112), SKILL 475→382 (-93). Net +123 lines.
- Rationale: the per-mode docs now carry full procedure tables; SKILL.md no longer duplicates them. The increase is justified by the Q2 "Auto full restatement" lock — every Auto session no longer needs to round-trip to SKILL.md for procedure rows.

### F-P2 — Step 1 procedure NOT duplicated
- Both mode docs delegate to SKILL.md for Step 1's full table (7 rows + footnote + 3-tier table). No duplication. Strength.

### F-P3 — Mode docs are now self-contained for Workflow procedure
- A reader loading only `auto-mode.md` can execute the full Auto SOP without reading SKILL.md. Same for chat-mode.md (modulo the Workflow State Machine cross-doc anchor for shared phase mechanics).

### F-P4 — Pointer paragraph in SKILL.md is restated twice
- Lines 80-84 + 86-91 cover overlapping ground (cf. F-S5). Mild redundancy. Trivial. Low severity.

## Verdict
**PASS.** Token cost is justified by single-source-of-truth gains in each mode-doc.

## Must-Preserve
- Mode-docs as the canonical home for their respective Workflow procedures.
- Step 1 NOT duplicated in mode docs.
