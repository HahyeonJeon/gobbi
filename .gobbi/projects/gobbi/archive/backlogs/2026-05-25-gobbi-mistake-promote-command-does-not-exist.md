---
archived_at: 2026-05-25
archived_session: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
archive_reason: shipped
original_path: backlogs/gobbi-mistake-promote-command-does-not-exist.md
shipped_in: PR #270 (merged 925f641 on develop)
superseded_by: null
related: []
---

# Archive entry — gobbi-mistake-promote-command-does-not-exist

## Original
Path: `backlogs/gobbi-mistake-promote-command-does-not-exist.md`
Original creation date: `2026-05-25`

## Reason
The backlog captured 7 stale references to the non-existent `gobbi mistake promote` CLI command across `CLAUDE.md` and `mistake/SKILL.md`, which was a v0.4.x CLI-era artifact that survived the v0.5.0 markdown-tree redesign. Bundle C's T03 and T07 fully eradicated these references tree-wide: T03 rewrote all 5 references in `mistake/SKILL.md` to describe the Wrap-up-phase promotion mechanism; T07 fixed the 2 references in `CLAUDE.md`, removed the stale `packages/cli/src/specs/` and `gobbi workflow init` citations, updated `gobbi/SKILL.md` Layer-2 sentence, and added the Layer-2 promotion block to `wrap-up/SKILL.md`. The two-layer promotion model (Layer 1 = project mistakes/, Layer 2 = workspace-level skill storage) was user-locked to use agent-driven Wrap-up promotion with no CLI step.

## Cross-references
- Commit `0632ad8` — T03 mistake/SKILL.md rewrite (5 refs)
- Commit `f2356ca` — T07 CLAUDE.md + gobbi/SKILL.md fixes (2 refs + stale CLI refs)
- Commit `6bf792a` — T07 wrap-up/SKILL.md Layer-2 block
- PR #270 (merged `925f641` on develop)
