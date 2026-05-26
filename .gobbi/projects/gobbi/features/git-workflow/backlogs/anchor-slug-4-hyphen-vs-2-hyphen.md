---
name: anchor-slug-4-hyphen-vs-2-hyphen
description: Deferred risk tracking whether em-dash headings produce 4-hyphen or 2-hyphen anchor slugs in GitHub-rendered markdown, affecting P2/P6 links in orchestration/SKILL.md.
type: backlogs
scope: feature
feature: git-workflow
status: deferred
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [anchor, slug, em-dash, markdown, github, docs-sync]
priority: medium
disposition: open
domain: docs-sync
---

# Deferred Risk: Anchor Slug Format — 4-Hyphen vs 2-Hyphen for Em-Dash Headings

## Context

Row 5.5 in `orchestration/SKILL.md` links to `git/SKILL.md` via anchors `#p2----create-worktree` (iter1) and `#p6----recover-orphaned-worktree` (iter2). The source headings are `### P2 — Create worktree` and `### P6 — Recover orphaned worktree`.

`stub-redirect-format.md` rule (rules/stub-redirect-format.md) says em/en dashes are **dropped** for anchor verification — by that rule the expected slugs would be `p2--create-worktree` and `p6--recover-orphaned-worktree` (2 hyphens). The existing links use 4 hyphens.

## Decision

Accepted as a deferred risk. Both link forms (4-hyphen and 2-hyphen) used consistent within their respective iterations. The anchor has not been empirically tested by rendering the markdown in GitHub.

## Rationale

- Low priority: link navigation is cosmetic; the text of row 5.5 is clear whether or not the link resolves in a rendered context.
- Pre-existing pattern: the 4-hyphen form appears to already be in use across the project before this task.
- Out-of-iter scope: fixing this requires a project-wide anchor sweep of all em-dash headings, which is not scoped to a single task.

## Alternatives considered

- Fix immediately: rejected — out of contracted scope; the mandate was the stale-path recovery + footnote reference fixes only.
- Fix in a dedicated docs sweep task: possible but not required until link resolution is confirmed broken.

## Consequences

Until the anchor format is audited and corrected if needed, links using 4-hyphen em-dash slugs may fail in GitHub-rendered markdown. The canonical procedure text remains correct regardless.

## Related

- `stub-redirect-format.md` anchor verification rule
- Structural evaluation findings from the session that created this risk: iter1 Codex structural finding COD-STRUCT-001 and Claude structural finding S-001
