---
name: git-skill-move-attribution-docs-sync
description: Readiness signal row credits git skill with git-mv procedure; real source is rules.md §1.5
type: decisions
scope: project
feature: null
status: accepted
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [process]
keywords: [git-skill, rules-md, move-attribution, docs-sync, readiness-signal]
author: claude
supersedes: null
superseded_by: null
related: [readiness-scan-must-disposition-out-of-worktree-writes]
---

# Git Skill Move-Attribution Docs-Sync Nit (Low, Cosmetic)

## Context

The Preparation readiness scan for the `feature: memory` migration campaign listed `skills/git/SKILL.md` as signal #1 with the description "worktree CWD discipline + git mv history-preserving moves." The git skill documents worktree CWD discipline only. The `git mv` history-preserving move procedure is in `rules.md §1.5` (the Refactor procedure at line 143), which is a separately-listed readiness signal (#2 in the same scan). The `git mv` capability is present in the campaign's readiness set — it is not missing — but the per-row attribution in signal #1 is mislabeled.

## Decision

Carry the nit forward without blocking advancement to Planning. The move capability is available via co-listed signal `rules.md §1.5`; no gap exists. The attribution is cosmetic. Status `accepted` — a deferred-cosmetic decision, not a blocker.

## Rationale

Both iter1 (Claude OVR-1) and iter2 (PREP-CLA-OVR-2) evaluation independently confirmed: non-blocking, Low, no REVISE driver. The signal table correctly lists `rules.md §1.5` as a separate entry that carries the move procedure; the mislabeled row does not cause any execution gap.

## Alternatives considered

Correcting the signal row text in the working draft before advancing: not done because the readiness scan is locked (PASS); the correction is cosmetic and does not affect Planning or Execution. A future Preparation scan should attribute `git mv` moves to `rules.md §1.5`, not the git skill.

## Consequences

The next Preparation or skill-review session that touches the readiness signal table should re-attribute: row for the git skill → "worktree CWD discipline (absolute path discipline, re-cd per shell call)"; row for rules.md §1.5 → "Refactor procedure: git mv + 6 reference classes + 2 label-rename classes + required-mistakes PATH refs + both-guards-to-zero + active-mistake-move carve-out."

## Related

- [[readiness-scan-must-disposition-out-of-worktree-writes]] — sibling finding from the same Preparation loop
