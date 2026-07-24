---
name: post-gate-outcome-provenance-scenario
description: A canonical seed-scenario gap in the preparation skill's own scenario.md — no scenario distinguishes a pre-gate recommendation from proof of post-gate user acceptance.
type: scenarios
scope: feature
feature: workflow
status: active
created: 2026-07-17
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [evaluation, verification]
keywords: [post-gate-provenance, seed-scenario-gap, preparation-skill, canonical-bundle]
author: claude
---

# Post-gate outcome provenance

**Category:** failure-mode
**Coverage:** partial

## Situation

A Preparation WORK draft asserts "the user decided X at a DISCUSSION gate" as the basis for a downstream claim (a readiness verdict acceptance, a design-risk weighting decision). The evaluator must be able to distinguish between two very different evidentiary states: (a) a PRE-gate recommendation the manager or leader proposed, and (b) PROOF that the user actually accepted a specific decision post-gate, with a citable record of the exact question, options, and answer.

## Inputs

- A Preparation draft's Decisions-log or equivalent section making a "the user decided" claim
- The session record's available evidence sources for that claim (a gate-decision record file, a raw transcript, or nothing)

## Expected behavior

The canonical `preparation/scenario.md` seed bundle should carry an explicit scenario (with attached checklist) requiring that every post-gate user-decision claim in a Preparation WORK artifact cites a durable, anchor-resolvable session-record source — not merely a description of what was discussed, and never the manager's own raw conversational transcript as the sole evidence.

## Verification

This session's Preparation iter-2 draft (`2-preparation/working/draft-iter2.md`) satisfies the corrected behavior: every post-gate claim cites `gate-decisions-iter1.md` by anchor, and the file itself records the exact AskUserQuestion decision, options, and verbatim user answer. Both evaluator systems independently confirmed the citation resolves and the record is real (eight anchor occurrences; zero reconciliation-log citations). The canonical seed bundle itself, however, still lacks this scenario — this session's target passed only because the fix was applied ad hoc, not because the evaluation frame already required it.

## Status notes

**Canonical-skill-bundle improvement candidate, not a workflow-feature-specific gap.** This finding names a permanent seed-coverage debt in the `preparation` skill's own `scenario.md` — fixing it means editing `.gobbi/projects/gobbi/skills/preparation/scenario.md` directly, which is a skills-tree edit outside this session's Scope Contract. Staged here under the session's own feature (`workflow`) per the session-record convention; Wrap-up should weigh whether the true promotion home is a project-level skill backlog rather than feature memory. Non-blocking (Low/100).

## Related

- [[post-gate-outcome-provenance-check]] — the paired checklist_gap staged this same iteration (`CODEX-PREP-USAGE-FRAME-002`)
- [[na-declaration-citation-gap]] — the sibling residual finding from the same evaluation round
