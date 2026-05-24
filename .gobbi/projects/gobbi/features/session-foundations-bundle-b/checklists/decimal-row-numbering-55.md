---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: open
feature: session-foundations-bundle-b
finding-id: S3-iter1
type: checklist_gap
domain: docs-sync
disposition: open
confidence: 75
severity: Medium
---

# Decimal row numbering at row 5.5 — Execution must choose: insert 5.5 or renumber rows 6+

## Context

iter1 Claude Structure finding S3: the `orchestration/SKILL.md` Step 1 Workflow Configuration table uses integer row numbers (1 through 7+). Draft D-1 inserts row 5.5 as a half-decimal between current row 5 (state.json) and current row 6 (session.json). The project's existing tables do not use decimal row numbers anywhere verified.

Evidence: `orchestration/SKILL.md` lines 95-110 (integer-numbered table rows).

## Checklist item for Execution

- [ ] Execution must choose ONE of these two approaches before editing `orchestration/SKILL.md`:
  - **(a) Keep decimal 5.5** — acceptable if the table's purpose is reference (readers scan by semantic label, not row count); leaves existing rows numbered as-is; no follow-on renumbering required.
  - **(b) Renumber rows 6 → 7, 7 → 8, etc.** — consistent with integer-only convention; requires updating all cross-references to row numbers throughout the skill file and any file that references "row 6" or "row 7".
- [ ] Whichever approach is chosen, document it as a one-line rationale comment in the PR description.
- [ ] After the edit: `grep -n 'row [0-9]' .claude/skills/orchestration/SKILL.md` — verify no stale integer references remain.

## Related

- `evaluation/iter1/claude/structure.md` S3
- `rawdata/draft-iter3.md:308-313` (D-1 row 5.5 description)
- `rawdata/draft-iter3.md:274` (T1-I-T1.a implementation checklist item — "insert new row 5.5")
