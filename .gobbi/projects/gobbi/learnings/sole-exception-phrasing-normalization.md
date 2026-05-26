---
name: sole-exception-phrasing-normalization
description: When a rule has one exception stated multiple times in a skill file, pick one canonical phrasing and apply it consistently.
type: learnings
scope: project
feature: null
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [docs-sync, aesthetics, skill-authoring]
supersedes: null
superseded_by: null
---

# Normalize repeated "sole exception" phrasings to one canonical form

## Insight

When a rule has one exception and that exception is stated multiple times in a skill file, pick one canonical phrasing and apply it consistently — variant wording across repetitions is a minor readability cost with no semantic benefit.

## Context

T03 (CL-3) rewrote 5 `gobbi mistake promote` CLI references in `mistake/SKILL.md` to Wrap-up-phase agent promotion, qualifying the "agents never write directly to project memory" claim at three sites. The three resulting "sole exception" phrasings used slightly different word orders:
- line 3: "the Wrap-up assistant is the sole documented exception"
- line 11: "the Wrap-up assistant performing promotion during Wrap-up is the documented sole exception"
- line 47: "The Wrap-up phase is the sole documented exception to the staging boundary"

None of these misleads a reader; the rule is identical. Identified as finding A-1 (Low) by Claude Aesthetics perspective (confidence 75).

## Why it matters

When a reader scans the same rule multiple times, variant phrasing creates a momentary parsing cost — "is this the same rule or a subtly different one?" Canonical consistency removes that cost.

## How to apply

When making multi-site edits that introduce a repeated constraint pattern, identify the canonical phrasing first (e.g., "the Wrap-up assistant is the sole documented exception to the staging boundary") and apply it verbatim at every occurrence. The edit review step should verify phrasing consistency across all sites before commit.

## Counter-cases

When deliberately varying phrasing for context-specificity (e.g., emphasizing different aspects at different call-sites), variation is acceptable. The anti-pattern is inadvertent variation from multi-pass editing, not intentional contextual emphasis.

## Related

- T03 (CL-3) finding A-1 in `execution/task-03/evaluation/iter1/claude/aesthetics.md`
- `mistake/SKILL.md` lines 3, 11, 47 — the three variant phrasings
