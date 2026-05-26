---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
feature: git-workflow
supersedes: null
superseded_by: null
finding-id: S-001-COD-STRUCT-001
finding-type: assumption_risk
domain: docs-sync
severity: Medium
confidence: 50-70
disposition: open
---

# Deferred Risk: Anchor Slug Format — 4-Hyphen vs 2-Hyphen for Em-Dash Headings

## Context

Row 5.5 in `orchestration/SKILL.md` links to `git/SKILL.md` via anchors `#p2----create-worktree` (iter1) and `#p6----recover-orphaned-worktree` (iter2). The source headings are `### P2 — Create worktree` and `### P6 — Recover orphaned worktree`.

`stub-redirect-format.md` rule (rules/stub-redirect-format.md) says em/en dashes are **dropped** for anchor verification — by that rule the expected slugs would be `p2--create-worktree` and `p6--recover-orphaned-worktree` (2 hyphens). The existing links use 4 hyphens.

## Decision

Accepted as a deferred risk for iter1 and iter2. Both iters used 4-hyphen slugs (iter2 mirrored iter1 for consistency). The anchor has not been empirically tested by rendering the markdown in GitHub.

## Rationale

- Low priority: link navigation is cosmetic; the text of row 5.5 is clear whether or not the link resolves in a rendered context.
- Pre-existing pattern: the 4-hyphen form appears to already be in use across the project before this task.
- Out-of-iter scope: fixing this requires a project-wide anchor sweep of all em-dash headings, which is not scoped to Task 01.

## Alternatives considered

- Fix in iter2: rejected — out of contracted scope; iter2's mandate was the stale-path recovery + footnote reference fixes only.
- Fix in Task 06: possible but not required.

## Consequences

Until the anchor format is audited and corrected if needed, links using 4-hyphen em-dash slugs may fail in GitHub-rendered markdown. The canonical procedure text remains correct regardless.

## Related

- `execution/task-01/evaluation/iter1/claude/structure.md` — finding S-001
- `execution/task-01/evaluation/iter1/codex/structure.md` — finding COD-STRUCT-001
- `stub-redirect-format.md` anchor verification rule
