---
name: dual-system-cross-mirror-drift-detection
description: Dual-system evaluation catches cross-mirror drift invisible to a single system — each system checks its own entrypoint.
type: learnings
scope: project
feature: null
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [evaluation, dual-system, drift-detection, docs-sync]
supersedes: null
superseded_by: null
---

# Dual-system evaluation catches cross-mirror drift invisible to a single system

## Insight

When two separate systems (Claude and Codex) each evaluate the same change, each checks its own mandatory entrypoint. A defect that is fixed on the Claude-side entrypoint (`.claude/CLAUDE.md`) but missed on the Codex-side entrypoint (`.codex/AGENTS.md`) is invisible to the Claude evaluator — but immediately visible to the Codex evaluator. The dual-system model is the minimal structure that catches this class of drift.

## Context

A sweep that removed stale `gobbi mistake promote` / `packages/cli` framing fixed four contracted surfaces including `.claude/CLAUDE.md`. The Claude evaluator passed — it checked `.claude/` territory and found nothing wrong. The Codex evaluator, which reads `.codex/AGENTS.md` as its own mandatory entrypoint, found that `.codex/AGENTS.md` still carried the stale framing on the lines the sweep had not touched. The manager and the Claude evaluator had both missed this fourth surface entirely. A follow-up round added `.codex/AGENTS.md`, and the Codex evaluator confirmed the drift resolved.

## Why it matters

Cross-mirror drift (`CLAUDE.md` fixed but `AGENTS.md` not, or vice versa) is a recurring class of defect in this repo. Without a system that checks each mirror from its own perspective, the drift silently survives evaluation — the PASS is valid from one system's view but the defect persists in the other's entrypoint. Every cross-mirror change needs dual-system evaluation to be trustworthy.

## How to apply

- Whenever a change touches a "mirrored" entrypoint (`.claude/CLAUDE.md` ↔ `.codex/AGENTS.md`, `.gobbi/projects/gobbi/skills/` ↔ `.agents/skills/`), run dual-system evaluation.
- Claude evaluator covers `.claude/` + `.gobbi/projects/gobbi/skills/` territory; Codex evaluator covers `.codex/` + `.agents/skills/` territory.
- If only one system evaluates a cross-mirror change, the other mirror is unchecked.

## Counter-cases

For changes confined to one side of the mirror (e.g., a feature in `.claude/skills/` with no Codex analog), single-system evaluation suffices. The dual-system value recurs specifically when the change is supposed to be mirrored across both sides.

## Related

- Issue #258 (drift detector): a mechanical drift-detector that diffs the two mirrors would have caught this statically, without needing an evaluator to notice. This learning is a witness for that issue.
- `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md` — related class: each system's grep scope differs.

## Source

Originating session: `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/` — the cross-mirror sweep and the Codex `.codex/AGENTS.md` finding that produced this learning.
