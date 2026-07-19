---
name: wrap-up-handoff-pointer-lifetime-model
description: "E11 (deferred): formalize the handoff continuation-source model — the session outputs/handoff.md dies with the worktree, so the durable next-session source is the promoted journal; require repo-root-relative durable pointers (not absolute worktree paths). The doc-only correction was applied; the full model is deferred."
type: backlogs
scope: project
feature: null
status: open
priority: medium
project-scope: true
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [wrap-up, process]
keywords: [e11, handoff, pointer-lifetime, journal-continuation, repo-root-relative, worktree-lifetime]
author: claude
---

# E11 — Handoff pointer / lifetime model (deferred)

**Deferred from the 2026-07-16 wrap-up redesign** (design § Design H). The doc-only correction (durable pointers repo-root-relative, not absolute worktree paths; journal is the next-session source) was applied; the full contract redesign is deferred.

**What**: `4-wrap-up/outputs/handoff.md` is session-scoped and dies with the worktree at Stage-5 cleanup; the durable cross-session source is the per-session journal (`notes/{area}/`). E11 = formalize this — one continuation source (the journal), repo-root-relative durable pointers, no competing second handoff. (Note: the USAGE-001 fix this session already moved the handoff DRAFT to `working/handoff-draft.md`, sealed to `outputs/` on PASS — a related lifecycle fix, but not the full E11 pointer model.)

**Why deferred**: changes the handoff/journal continuation-source contract.

**Blast radius**: `wrap-up/SKILL.md` Stage-4, `scenario.md`/`checklist.md` Usage/Aesthetics. Related: `[[wrap-up-skill-redesign]]`.
