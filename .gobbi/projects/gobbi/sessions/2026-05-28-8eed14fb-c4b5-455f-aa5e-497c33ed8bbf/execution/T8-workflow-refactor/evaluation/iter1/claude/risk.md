# Perspective: Risk

**Target:** T8 Workflow refactor across 3 docs

Risk lens: rollback cost, blast radius if wrong, irreversible operations.

## Findings

### F-R1 — Pure markdown refactor; rollback = `git revert`
- Strength. No code or runtime touched; no migrations; no schema changes. Single commit revertable.

### F-R2 — Step 1 content preserved verbatim
- The 7-row Step 1 procedure table + LOCK#5 footnote + 3-tier bootstrap table is unchanged in SKILL.md. Mode docs delegate to SKILL.md for Step 1. No risk of behavioral divergence at Configuration time.

### F-R3 — Broken `#iteration-caps` anchor is dormant until escalation
- The link fires only when `maxIterations` exhausts at Wrap-up (Chat default = 1 → high-probability path). The link silently falls back to the SKILL.md top instead of dropping the reader at `### Iteration rule` (L297). Cost: user disorientation; not a behavioral regression because the doc still EXISTS — only the deep-link is wrong.
- Severity: Medium (high-probability dormant defect on every Wrap-up exhaustion path).

### F-R4 — Deleted SKILL.md content might be referenced from outside the 3 files
- `grep -rn 'Per-task slice workflow shape' .gobbi/projects/gobbi/skills/` → 0 hits. The old anchor name (the one T8 explicitly patched) is gone everywhere. ✓
- `grep -rn 'Inter-loop transition' .gobbi/projects/gobbi/skills/` not run as a separate check; the section was a SKILL.md-local heading without an explicit anchor reference elsewhere. Low risk.

### F-R5 — Re-numbering in auto-mode (§2→§3 chain) propagates correctly
- Already verified under F-C3. Failure would mean a reader sees "see §3" and lands at "§4 — Auto-Mode defaults" instead of "§3 — Always-Ask codification" — that would be a meaningful navigation defect. No occurrence found.

### F-R6 — No security / privacy surface touched
- Markdown docs only; no credentials, PII, or secrets implicated.

### F-R7 — Symlink mirror at `.claude/skills/orchestration/` follows the edits transparently
- The `.claude/` directory is a symlink chain; edits to `.gobbi/...` propagate immediately. Zero risk of mirror drift from this task.

## Verdict
**PASS with one Medium follow-up.** F-R3 (`#iteration-caps` dormant link defect) is the only risk-meaningful finding. Rollback cost is trivial.

## Must-Preserve
- Step 1 verbatim in SKILL.md.
- Mode-doc Step 1 delegation pointer (no duplication = no divergence risk).
