---
name: per-iter-commit-subject-scope
description: User confirmed chore(session) as the scope token for per-iteration session-memory commits, with loop name in the subject body.
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [git-workflow, commit-subject, session-commits, d4]
---

# Per-iteration session-memory commit subject — chore(session) confirmed

## Context

Design Decision D-4 commits session memory to the worktree branch once per iteration. The commit subject needed a Conventional-Commits scope token, and the choice was between scoping by the directory being committed (`session`) or by the workflow loop that produced the commit.

## Question

What should the per-iteration session-memory commit subject be — scope by directory or by loop?

## Options considered

1. **`chore(session): record <loop> iter{n} memory`** — `session` as the scope token, matching the `sessions/` directory being committed; the loop name goes in the subject body.
2. **`chore(<loop>): record iter{n} memory`** — the loop name as the scope token.

## User decision

Confirmed option 1, `chore(session): record <loop> iter{n} memory` — the `session` scope matches the directory being committed; the loop name goes in the subject body.

## Implication

Design Decision D-4's commit subject pattern is locked: `chore(session): record <loop> iter{n} memory` (e.g., `chore(session): record ideation iter3 memory`). All 5 workflow loop docs carry this pattern.

## Related

- `design/per-iteration-session-commit-cadence.md` — Design Decision D-4, which adopts this subject pattern.
- `design/workflow-phase-doc-set-for-per-iter-cadence.md` — the 5 loop docs that carry the pattern.
