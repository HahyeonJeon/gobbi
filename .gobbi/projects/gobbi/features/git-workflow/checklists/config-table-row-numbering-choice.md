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

# Choose decimal-5.5 insertion vs renumbering rows 6+ in the Configuration table

## What

Before inserting the worktree-creation row into the `orchestration/SKILL.md` Step 1 Workflow Configuration table, choose ONE numbering approach:

- **(a) Keep the decimal row 5.5** — acceptable if the table's purpose is reference (readers scan by semantic label, not row count); leaves existing rows numbered as-is; no follow-on renumbering required.
- **(b) Renumber rows 6 → 7, 7 → 8, etc.** — consistent with the integer-only convention; requires updating all cross-references to row numbers throughout the skill file and any file that references "row 6" or "row 7".

Document the chosen approach as a one-line rationale in the PR description.

## Why

A structural evaluation surfaced that the Step 1 Workflow Configuration table uses integer row numbers (1 through 7+), while the worktree-create design inserts the new row as a half-decimal (5.5) between the existing row 5 (state.json) and row 6 (session.json). The project's existing tables do not use decimal row numbers anywhere verified, so the insertion needs a deliberate numbering decision rather than an unreviewed half-decimal.

## Verification

After the edit, `grep -n 'row [0-9]' .claude/skills/orchestration/SKILL.md` confirms no stale integer references remain (if approach (b) was chosen) and the table reads consistently.

## Status notes

The edit target is the `orchestration/SKILL.md` Step 1 Configuration table (its integer-numbered rows appear around lines 95-110). Surfaced by a Claude structural evaluation finding during the worktree-first session-architecture work (session `1b26cf20`).
