---
name: chore-label-line-citation-stale
description: Backlog item tracking a stale line-number citation for the chore label in git/conventions.md — the cited line 261 is off by 2 (actual line 263).
type: backlogs
scope: feature
feature: git-workflow
status: deferred
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [docs-sync, citation, chore-label, git-conventions]
priority: low
disposition: open
domain: docs-sync
---

# `chore` label line citation in `git/conventions.md` is off by 2 lines

## Context

The design drafts for the worktree-first session architecture cited "`chore | #e4e669` at line 261" in `git/conventions.md`. A Codex evaluator ran `grep -n` and found `fix` at line 261; `chore` is at line 263.

The branch name `chore/session-{date}-{ssid-short}` is correctly registry-compliant — the label exists at line 263 and the type regex at line 22 includes `chore`. This is a citation-accuracy issue only.

## Decision

Accept as a Low docs-sync finding. Correct the citation from line 261 to line 263 when updating the design drafts during a future Preparation or Execution docs sweep.

## Rationale

The branch convention compliance is verified independently (regex at line 22 PASS, slug length at line 64 PASS, label at line 263 confirmed). The off-by-2 citation does not affect any runtime behavior or design decision.

## Alternatives considered

Fix immediately: acceptable but not worth blocking current workflow step.

## Consequences

Planning or Execution docs sweep: update any design draft line citations for the `chore` label-color row to reference `git/conventions.md:263` instead of line 261.

## Related

- Consistency evaluation findings from the session that created this backlog: iter3 Codex consistency finding COD-CONS-ITER3-002
- `git/conventions.md` label registry (chore row at line 263)
