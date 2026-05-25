---
title: "Dual-system evaluation catches cross-mirror drift invisible to a single system"
discovered: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [evaluation, dual-system, drift-detection, docs-sync]
related: [executor-main-tree-edit-near-miss]
promoted-from: sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-07/staging/learnings/dual-system-cross-mirror-drift-detection.md
promoted-at: 2026-05-25
---

# Dual-system evaluation catches cross-mirror drift invisible to a single system

## Insight

When two separate systems (Claude and Codex) each evaluate the same change, each checks its own mandatory entrypoint. A defect that is fixed on the Claude-side entrypoint (`.claude/CLAUDE.md`) but missed on the Codex-side entrypoint (`.codex/AGENTS.md`) is invisible to the Claude evaluator — but immediately visible to the Codex evaluator. The dual-system model is the minimal structure that catches this class of drift.

## Context

T07 iter1 fixed 4 contracted surfaces including `.claude/CLAUDE.md`. The Claude evaluator (8 perspectives, PASS) had no finding about `.codex/AGENTS.md` — it checked `.claude/` territory. Codex evaluator found CONS-001 (High/100): `.codex/AGENTS.md:45` and `:80-82` still carried the stale `packages/cli` + `gobbi mistake promote` framing, because the Codex evaluator reads `.codex/AGENTS.md` as its own entrypoint. The manager and Claude evaluator had both missed this 4th surface. Iter2 added `.codex/AGENTS.md` and Codex confirmed CONS-001 resolved.

## Why it matters

Cross-mirror drift (`CLAUDE.md` fixed but `AGENTS.md` not, or vice versa) is a recurring class of defect in this repo. Without a system that checks each mirror from its own perspective, the drift silently survives evaluation — the PASS is valid from one system's view but the defect persists in the other's entrypoint. Every cross-mirror change needs dual-system evaluation to be trustworthy.

## How to apply

- Whenever a change touches a "mirrored" entrypoint (`.claude/CLAUDE.md` ↔ `.codex/AGENTS.md`, `.gobbi/projects/gobbi/skills/` ↔ `.agents/skills/`), run dual-system evaluation.
- Claude evaluator covers `.claude/` + `.gobbi/projects/gobbi/skills/` territory; Codex evaluator covers `.codex/` + `.agents/skills/` territory.
- If only one system evaluates a cross-mirror change, the other mirror is unchecked.

## Counter-cases

For changes confined to one side of the mirror (e.g., a feature in `.claude/skills/` with no Codex analog), single-system evaluation suffices. The dual-system value recurs specifically when the change is supposed to be mirrored across both sides.

## Related

- T07 iter1 Codex evaluation: `execution/task-07/evaluation/iter1/codex/consistency.md` (CONS-001)
- Issue #258 (drift detector): a mechanical drift-detector that diffs the two mirrors would have caught this statically, without needing an evaluator to notice. This session is a witness for that issue.
- `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md` — related class: each system's grep scope differs
