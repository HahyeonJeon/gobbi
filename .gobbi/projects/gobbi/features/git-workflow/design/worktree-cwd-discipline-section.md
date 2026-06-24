---
name: worktree-cwd-discipline-section
description: DD-7 — Add git/SKILL.md § Worktree CWD discipline section to resolve the dangling codex/SKILL.md:254 cross-reference and consolidate existing cwd discipline from role prompts
type: design
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, codex]
keywords: [cwd-discipline, worktree, dangling-link]
author: claude
supersedes: null
superseded_by: null
related: []
---

# DD-7 — Add git/SKILL.md § Worktree CWD discipline section

## Problem

`skills/codex/SKILL.md:254` already cross-references `git/SKILL.md § Worktree CWD discipline` —
but that section does NOT exist in the git skill today. The cross-reference is a dangling link.
Meanwhile, the cwd-reset discipline is duplicated across `agents/executor.md:99-101` and
`agents/leader.md:112` without a canonical home in the git skill.

## Scope

In-scope: add a new `§ Worktree CWD discipline` section to `skills/git/SKILL.md`.
Out-of-scope: changing the codex/SKILL.md `:254` text (it will resolve once the section exists).

## Approach

The new section covers:
- CWD resets between turns (the hazard).
- The absolute-worktree-path mandate for ALL writes.
- `git -C <worktree-abs>` for ALL git operations — never a bare `git`.
- Codex: CWD inheritance from the calling shell + `--cd` defaults
  (from `codex/SKILL.md:187` CWD inheritance section).

This consolidates the discipline already duplicated in `executor.md:99-101` / `leader.md:112` into
a canonical git-skill location, and makes the dangling `codex/SKILL.md:254` link resolve.

## Scenarios

Resolves C20 (must-contain checklist). Anchors S31 (codex agent follows Worktree CWD discipline).

## Validation

`codex/SKILL.md:254`'s link resolves to a real section. A link-resolution check
(`check-markdown-links.sh` or equivalent) passes over the relevant files. The `file-move-needs-link-resolution-check`
mistake class is addressed: a cross-tier link must resolve, not just match a token.

## Trade-offs

Adds one new section to git/SKILL.md. The alternative (keep the discipline fragmented across role
prompts) would leave the codex/SKILL.md dangling link unresolved and would continue to duplicate
the discipline. Consolidation is preferable.
