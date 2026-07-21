---
name: wrap-up-audit-only-scratch-model
description: "E9 (deferred): make Wrap-up audit-only for session-scratch shape (report non-canonical scratch, preserve it as evidence until manager Stage-5 worktree cleanup) instead of the current normalize/remove behavior — resolves the preserve-vs-delete contradiction and the git-gate-blind-to-gitignored-tree issue."
type: backlogs
scope: project
feature: null
status: closed
priority: medium
project-scope: true
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [wrap-up, process]
keywords: [e9, scratch-model, audit-only, session-tree-immutable, git-gate-blind-gitignored, preserve-vs-delete]
author: claude
archived_at: 2026-07-20
archive_reason: dropped
---

# E9 — Audit-only session-scratch model (deferred)

**Deferred from the 2026-07-16 wrap-up redesign** (design § Design H). Its doc-only scenario corrections (no "git status proves the gitignored session tree"; durable pointers repo-root-relative not absolute) WERE applied this session; the behavior redesign was not.

**What**: today Wrap-up both "preserves session scratch" AND normalizes/removes `restore/`/`tmp/`; `orchestration/workflow/wrap-up.md` says the assistant "cleans scratch state". E9 = Wrap-up is audit-only on session shape — report non-canonical scratch, preserve it as evidence, leave removal to the manager's Stage-5 worktree cleanup. Latent tension surfaced by T1: E1 immutability vs cleanup routing followups into `staging/`.

**Why deferred**: changes assistant scratch-ownership + the "cleans scratch state" contract in the gate doc.

**Blast radius**: `wrap-up/{SKILL,promotion,scenario,checklist,evaluation}.md`, `orchestration/workflow/wrap-up.md`. Related: `mistakes/verification/git-gate-blind-to-gitignored-writes`; `[[wrap-up-skill-redesign]]`.
