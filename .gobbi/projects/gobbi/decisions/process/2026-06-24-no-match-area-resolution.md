---
name: no-match-area-resolution
description: User-decided destination area for the one structural area no-match mistake — verification.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [verification]
keywords: [no-match, area-resolution, staging-a-mistake-candidate-does-not-fix-the-artifact, migration-t02, t04-recompute, t05-move]
author: claude
supersedes: null
superseded_by: null
---

# No-match area resolution — `staging-a-mistake-candidate-does-not-fix-the-artifact` → `verification`

## Context

The memory-migration campaign (Task 2) must resolve the gating decision items before the downstream tag-fix (T03), area recompute (T04), and move (T05). One mistake file is a structural area **no-match**: its tags (`process`, `mistake-discipline`, `artifact-correction`) are off the mistakes tag pool, so the §1.5 tag→area map produces no area. The per-type mistakes area list is `verification · refactor · tooling · assumption · git · codex · docs-sync · memory` — none auto-resolves from the file's off-pool tags. This is the one Always-Ask no-match.

## Decision

**Destination area = `verification`** (user-decided, locked).

- Slug → area: `staging-a-mistake-candidate-does-not-fix-the-artifact` → `verification`.
- T04 (recompute) records this area; T05 (move) places the file at `mistakes/verification/staging-a-mistake-candidate-does-not-fix-the-artifact.md`.
- T02 does NOT move the file (the move is T05) and does NOT change its tags (the off-pool tag fix is T03). T02 only RECORDS this destination so a fresh spawn can resume T04/T05.

## Alternatives considered

- Resolve the no-match by re-tagging to an on-pool tag that maps to an area: rejected — that is a T03 tag edit, and the user gave an explicit area, so no inferred routing is needed.
- Route to a different mistakes area (e.g. `refactor`, `process`): rejected — the mistake is a verification-discipline trap (staging a finding is not the same as verifying the artifact is fixed); `verification` is the user's locked choice.

## Consequences

The structural no-match has a recorded, locked destination area. A fresh spawn resuming Task 4 / Task 5 reads this decision and places the file at `mistakes/verification/staging-a-mistake-candidate-does-not-fix-the-artifact.md` without re-opening the Always-Ask.
