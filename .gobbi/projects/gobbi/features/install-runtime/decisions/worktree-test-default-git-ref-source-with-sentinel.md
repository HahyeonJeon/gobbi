---
name: worktree-test-default-git-ref-source-with-sentinel
description: DD-7 — worktree install-test default is Option (a) commit/push + git-ref marketplace source + worktree-only sentinel assertion. Resolves F-U1.
type: decisions
scope: feature
feature: install-runtime
status: active
created: 2026-05-30
session: 0fd65721-c39f-4305-b296-9961aee8e1c1
tags: [claude-plugin, worktree, install-test, marketplace-source, dd-7, fu1]
supersedes: null
superseded_by: null
decision_status: ratified
related:
  - features/install-runtime/scenarios/worktree-faithful-install-path-default.md
  - features/install-runtime/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md
---

# Worktree install-test default (DD-7) — RESOLVED: Option (a) git-ref source + worktree sentinel

## Context

F-U1 (DD-7): how does the executor install-test the plugin FROM a worktree so it tests the WORKTREE branch, not the main checkout? A naive `/plugin marketplace add ./` from a worktree resolves the relative local source against the **main checkout** (doc-confirmed: "the path still points at the main checkout"), so it silently tests the wrong tree.

## Decision (leader recommendation; accepted as-is — discussion-log "Resolved (leader recommendations accepted)" 2026-05-30; low-trade-off, Planning may ratify directly)

**Option (a):**
1. **Commit/push** the worktree branch.
2. **Add the marketplace from a git-ref source** pointing at that branch (or, during local dev, a temporary absolute worktree path as a fallback).
3. **Assert a worktree-only sentinel** is present in the installed cache (`~/.claude/plugins/cache/<id>/`) — the falsifier that proves the cache loaded worktree content, not main.

## Rationale

Option (a) is the only choice that is BOTH worktree-faithful AND consistent with the project's branch-per-session model. The sentinel assertion is the empirical falsifier: if the sentinel is absent from the cache, the install resolved against the wrong tree.

## Alternatives considered

- **(b) absolute worktree path source** — viable but non-reproducible across machines/sessions. Kept only as a local-dev fallback.
- **(c) merge-to-main then test** — tests main, not the worktree; defeats the purpose of worktree-based development.

## Evidence

- Claude Code plugin documentation: "a LOCAL relative marketplace source resolves against your repository's MAIN checkout … When you run Claude Code from a git worktree, the path still points at the main checkout."
- `features/install-runtime/scenarios/worktree-faithful-install-path-default.md`.

## Consequences

Planning tasks the install-test to: commit/push → use positional-arg marketplace source pointing at the worktree path (the actual implementation used `claude plugin marketplace add <worktree-path>` as a positional argument, not a `--url`/`--branch` flag which do not exist) → install → assert the worktree sentinel in the cache. Embedded in `scripts/validate-plugin-hooks-fire-once.sh` operator procedure.
