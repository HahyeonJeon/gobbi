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
mistake-candidate: false
related:
  - ideation/staging/scenarios/worktree-faithful-install-path-default.md
  - ideation/staging/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md
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

Option (a) is the only choice that is BOTH worktree-faithful AND consistent with the project's branch-per-session model. Alternatives rejected:
- **(b) absolute-path source** — viable but non-reproducible across machines/sessions.
- **(c) merge-to-main then test** — tests main, not the worktree; defeats the purpose.

The sentinel assertion is the empirical falsifier: if the sentinel is absent from the cache, the install resolved against the wrong tree.

## Alternatives considered

(b) absolute worktree path — non-reproducible; kept only as a local-dev fallback. (c) merge-to-main — tests the wrong tree.

## Evidence

- `ideation/staging/scenarios/worktree-faithful-install-path-default.md`.
- reference `ideation/staging/references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md` (verbatim: "the path still points at the main checkout").
- `preparation/rawdata/discussion-log.md` — resolution record.

## Consequences

Planning tasks the install-test to: commit/push → add git-ref marketplace source → install → assert the worktree sentinel in the cache. This is a routine Planning decision (low trade-off), not a user contribution point.
