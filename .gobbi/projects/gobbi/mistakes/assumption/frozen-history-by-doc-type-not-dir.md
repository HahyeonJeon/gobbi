---
name: frozen-history-by-doc-type-not-dir
description: Whether to leave or update a reference is determined by doc-type and claim-tense, not by directory or status field — a feature README with status:active making a present-tense claim is not frozen history.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-27
session: b5601d38-c988-4f53-b34b-9ace12a55c25
tags: [assumption, process]
keywords: [frozen-history, refactor, active-doc, claim-tense, doc-type, reference-classification]
author: claude
priority: high
domain: process
---

# Classify each reference by doc-type and claim-tense, not by directory or status alone

## What happened

During Ideation iter1 for this session, the draft grouped `features/agents/README.md` (a feature README with `status: active`, making a present-tense claim "gobbi-hook-authoring is a skill") together with genuinely-frozen `decisions/` and `notes/` records under one "leave as frozen history" rule. The rationale was: "memory rules §4.3/§4.6 say frozen history is not re-prosed; all files are in memory-type directories." The README was left as-is despite the fact that R1 would remove the skill, making the README's claim false. The iter2 evaluators flagged this (F-AES-1): leaving the active README with a stale claim would propagate a false fact into live memory. The draft was corrected in RD-1a/RD-1b.

## Why it happens

The agent applied a directory-based heuristic ("files in `decisions/` and `notes/` are frozen history; update everything else"). This misapplies rules.md §4.3/§4.6, which govern **time-stamped historical records**, not all memory files. A feature README (`type: features`, `status: active`) is the live identity doc for a feature — it makes present-tense claims about what the feature does today. When the world changes, the README must change. The memory rules §2.2 table shows `notes/` type only allows `status: active` — an active notes file is NOT frozen; it is the journal record for a past session, and its historical claims are frozen, but the file itself is not inert.

## Correct approach

Apply TWO tests per file when deciding whether to update or leave a reference:

1. **Doc-type test.** Is this file a decision, note, or changelog — a time-stamped historical record of what was true at write time? If yes, the specific claim is frozen-historical → LEAVE (per rules §4.3/§4.6).
2. **Claim-tense test.** Does the file make a present-tense-live claim ("X is a skill", "X manages Y", "X produces Z")? If yes, the file asserts a current fact that must stay true → UPDATE, regardless of the file's `status` field value or directory.

A file passes the frozen-history exemption ONLY when it is an immutable time-stamped record (decision, note, changelog) AND the specific claim is historical (what was true at write time), not a present-tense assertion.

## How to detect

A refactor plan that classifies references using only directory or `status:` field, with reasoning like:
- "All files in `decisions/` are frozen" (misses that the claims in those files are historical, not that the file type is frozen)
- "All `status: active` files need updating" (misses that `notes/` entries are always `status: active` even when their claims are historical)
- "Leave all files in `decisions/` and `notes/`" without per-file claim-tense verification

If the disposition table does not show, per file, the file's `type`, `status`, and whether the specific claim is present-tense-live or historical, the discrimination is wrong.

## Related

- [[gitignore-aware-residual-gate]] — companion mistake: residual gates must use git grep so only tracked files are scanned
- [[file-move-needs-link-resolution-check]] — broader refactor trap: every moved file needs inbound reference repointing
