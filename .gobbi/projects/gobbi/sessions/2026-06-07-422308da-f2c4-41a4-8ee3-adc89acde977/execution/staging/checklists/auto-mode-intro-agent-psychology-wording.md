---
name: auto-mode-intro-agent-psychology-wording
description: auto-mode.md §7 intro (~line 277-279) uses "so the manager cannot rationalize past it" — mild agent-psychology wording that should be replaced with a direct imperative
type: checklists
scope: feature
feature: workflow
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [docs-sync, writing, auto-mode, prose-polish]
scenario: auto-mode-evaluation-discipline
item_status: pending
anchor: principle-text-lead-with-imperative-not-agent-psychology
implemented_in: null
---

# auto-mode.md §7 intro — replace agent-psychology wording with direct imperative

## What

`auto-mode.md` §7 intro (~line 277-279) contains the phrase "so the manager cannot rationalize past it". This is mild agent-psychology wording (describing what an agent *might do wrong* rather than stating a direct rule or outcome). It is less direct than the surrounding imperative contract text in the same section.

## Why

Both evaluators flagged this as a Low/75 docs-sync finding and deferred it to a prose-polish session. It does not block delivery (all operative rules are explicit) but it is a soft recurrence of `[[principle-text-lead-with-imperative-not-agent-psychology]]`: principle/rule text should lead with the positive imperative, not with agent-psychology framing.

Codex (iter1 overall.md): "Mild agent-psychology wording is less direct than the surrounding imperative contract. It does not block because all operative rules are explicit and the Plan itself used similar phrasing. Clean this up only in a later prose polish; do not revise the implementation for it now."

Claude (iter1 overall.md): finding not separately called out; Codex Low/75 was the sole source; both evaluators' reconciled verdict was PASS (non-gating).

## Verification

After fix: grep the §7 intro for "rationalize" should return nothing. The replacement text should state an outcome or command directly (e.g., "the gate is non-negotiable" rather than "the manager cannot rationalize past it").

## Status notes

Deferred by both evaluators at iter1 (Codex Low/75, confidence 75). Soft recurrence of `[[principle-text-lead-with-imperative-not-agent-psychology]]`. Address in a future prose-polish session for `auto-mode.md`. Do not block the current session's PR on this.
