---
name: config-table-row-numbering-choice
description: Checklist for resolving the decimal vs integer row numbering choice when inserting row 5.5 into the orchestration/SKILL.md Step 1 Configuration table.
type: checklists
scope: feature
feature: git-workflow
status: open
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [orchestration, config-step, row-numbering, docs-sync]
domain: docs-sync
---

# Decimal row numbering at row 5.5 — Execution must choose: insert 5.5 or renumber rows 6+

## Context

A Claude Structure evaluation of the iter1 draft surfaced that the `orchestration/SKILL.md` Step 1 Workflow Configuration table uses integer row numbers (1 through 7+). The worktree-create design inserts row 5.5 as a half-decimal between the existing row 5 (state.json) and row 6 (session.json). The project's existing tables do not use decimal row numbers anywhere verified.

Evidence: `orchestration/SKILL.md` lines 95-110 (integer-numbered table rows).

## Checklist item for Execution

- [ ] Execution must choose ONE of these two approaches before editing `orchestration/SKILL.md`:
  - **(a) Keep decimal 5.5** — acceptable if the table's purpose is reference (readers scan by semantic label, not row count); leaves existing rows numbered as-is; no follow-on renumbering required.
  - **(b) Renumber rows 6 → 7, 7 → 8, etc.** — consistent with integer-only convention; requires updating all cross-references to row numbers throughout the skill file and any file that references "row 6" or "row 7".
- [ ] Whichever approach is chosen, document it as a one-line rationale comment in the PR description.
- [ ] After the edit: `grep -n 'row [0-9]' .claude/skills/orchestration/SKILL.md` — verify no stale integer references remain.

## Related

- `orchestration/SKILL.md` Step 1 Configuration table (the edit target)
- Structural evaluation finding from the worktree-first session: iter1 Claude Structure finding S3
