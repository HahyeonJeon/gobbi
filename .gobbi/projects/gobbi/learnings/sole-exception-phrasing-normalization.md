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

A task that rewrote five `gobbi mistake promote` CLI references in `mistake/SKILL.md` to Wrap-up-phase agent promotion qualified the "agents never write directly to project memory" claim at three sites. The three resulting "sole exception" phrasings used slightly different word orders:
- "the Wrap-up assistant is the sole documented exception"
- "the Wrap-up assistant performing promotion during Wrap-up is the documented sole exception"
- "The Wrap-up phase is the sole documented exception to the staging boundary"

None of these misleads a reader; the rule is identical. The Aesthetics evaluator flagged the variant wording as a Low-severity readability finding (confidence 75).

## Why it matters

When a reader scans the same rule multiple times, variant phrasing creates a momentary parsing cost — "is this the same rule or a subtly different one?" Canonical consistency removes that cost.

## How to apply

When making multi-site edits that introduce a repeated constraint pattern, identify the canonical phrasing first (e.g., "the Wrap-up assistant is the sole documented exception to the staging boundary") and apply it verbatim at every occurrence. The edit review step should verify phrasing consistency across all sites before commit.

## Counter-cases

When deliberately varying phrasing for context-specificity (e.g., emphasizing different aspects at different call-sites), variation is acceptable. The anti-pattern is inadvertent variation from multi-pass editing, not intentional contextual emphasis.

## Related

- `.gobbi/projects/gobbi/skills/mistake/SKILL.md` — the file where the three variant "sole exception" phrasings were normalized.

## Source

Originating session: `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/` — the `mistake/SKILL.md` CLI-reference rewrite whose aesthetics finding produced this learning.
