---
name: chore-label-line-citation-stale
description: Checklist for correcting the stale line-number citation for the chore label in git/conventions.md (cited line 261, actual line 263).
type: checklists
scope: feature
feature: git-workflow
status: open
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [docs-sync, citation, chore-label, git-conventions]
domain: docs-sync
---

# `chore` label line citation in `git/conventions.md` is off by 2 lines

## Context

The design drafts for the worktree-first session architecture cited "`chore | #e4e669` at line 261" in `git/conventions.md`. A Codex evaluator ran `grep -n` and found `fix` at line 261; `chore` is at line 263.

The branch name `chore/session-{date}-{ssid-short}` is correctly registry-compliant — the label exists at line 263 and the type regex at line 22 includes `chore`. This is a citation-accuracy issue only.

## Checklist item for docs sweep

- [ ] In any design draft: update the citation from `git/conventions.md:261` to `git/conventions.md:263`
- [ ] After update: `grep -n "conventions.md:261" <draft>` returns 0 matches

## Related

- Consistency evaluation findings from the session that created this checklist: iter3 Codex consistency finding COD-CONS-ITER3-002
- `git/conventions.md` label registry (chore row at line 263)
- Sibling backlog: `backlogs/chore-label-line-citation-stale.md` (deferred decision context)
