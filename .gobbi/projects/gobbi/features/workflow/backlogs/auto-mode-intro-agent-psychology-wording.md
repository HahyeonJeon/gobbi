---
name: auto-mode-intro-agent-psychology-wording
description: auto-mode.md §7 intro (~line 277-279) uses "so the manager cannot rationalize past it" — mild agent-psychology wording; replace with a direct imperative
type: backlogs
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [docs-sync, writing, auto-mode, prose-polish]
priority: low
disposition: open
related: [mistakes/principle-text-lead-with-imperative-not-agent-psychology.md]
---

# auto-mode.md §7 intro — replace agent-psychology wording with direct imperative

## What

`auto-mode.md` §7 intro (~line 277-279) contains the phrase "so the manager cannot rationalize past it". This is mild agent-psychology wording (describing what an agent might do wrong rather than stating a direct rule). It is less direct than the surrounding imperative contract text.

## Why deferred

Both evaluators flagged this as Low (Codex Low/75) and deferred to a prose-polish session. All operative rules are explicit. Soft recurrence of `[[principle-text-lead-with-imperative-not-agent-psychology]]`.

## Suggested fix

Replace "so the manager cannot rationalize past it" with a direct outcome or command — e.g., "the gate is non-negotiable" or "the manager MUST interrupt regardless of mode." Verify by grepping §7 intro for "rationalize" after fix.

## Verification

After fix: `grep "rationalize" auto-mode.md` should return nothing in the §7 context.
