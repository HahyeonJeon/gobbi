---
name: wrap-up-non-staging-promotion-to-typed-staging
description: "E7 (deferred): route Wrap-up-authored durable additions (session-surfaced rule candidate + per-session journal) through typed 4-wrap-up/staging/ before promotion, instead of the current direct non-staging source — changes the inventory-source contract (record/record-map.md)."
type: backlogs
scope: project
feature: null
status: closed
priority: medium
project-scope: true
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [wrap-up, process]
keywords: [e7, non-staging-promotion, typed-staging, inventory-source-contract, record-map, wrap-up-additions]
author: claude
archived_at: 2026-07-20
archive_reason: addressed
---

# E7 — Wrap-up non-staging promotion → typed staging (deferred)

**Deferred from the 2026-07-16 wrap-up redesign** (design § Design H). Ambition was "restructure + fix in-skill correctness"; E7 changes the inventory-source contract, so it was held out of scope.

**What**: today Wrap-up promotes two Wrap-up-authored durable items from NON-staging sources — a session-surfaced rule candidate and the per-session journal. The redesign KEEPS this (the redesign's Rules must not prohibit it — see the removed "Wrap-Up Additions" trap). E7 would route every such addition through typed `4-wrap-up/staging/` first, so all promotions have an explicit typed source + manifest accounting.

**Why deferred**: changes `record/record-map.md`'s authoritative source definition and the promotion-inventory contract; needs its own scoped session.

**Blast radius**: `wrap-up/{SKILL,promotion,evaluation}.md`, `record/record-map.md`, `record/SKILL.md`, the eval triad. Related: the removed E7-contradicting mistake trap; `[[wrap-up-skill-redesign]]`.
