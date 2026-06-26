---
name: dual-system-eval-catches-defects
description: Two independent evaluation systems (Claude + Codex) surface real defects each round that a single-pass review misses.
type: learnings
scope: project
feature: null
status: active
created: 2026-06-25
session: 463a1c96-f75c-4a14-80b4-f4d6815679cd
tags: [process, evaluation]
keywords: [dual-system, anti-groupthink, cross-system-divergence, design-defect]
author: claude
supersedes: null
superseded_by: null
related: []
---

# Dual-system evaluation catches defects a single pass misses

## Insight
Running two independent evaluation systems (Claude Code + Codex) over the same
artifact, each round, surfaces concrete, load-bearing defects that a single-pass
review reliably misses. The value is not redundancy — it is that the two systems
disagree on different things, and each disagreement is a real defect surfaced.

## Context
This session designed and shipped gobbi's memory-compaction mechanism (Wrap-up
Stage-2c: per-`{type}/{area}/` cap softCap 12 / hardCap 15, uniform merge-primary
strategy, lossless merge→archive, a new `check-merge-ref-integrity.sh` two-family
gate; it ships DORMANT, `enabled: false`). The design took 3 Ideation iterations and
2 Planning iterations. Across those rounds, dual-system evaluation caught three
distinct real defects, each from a different angle no single pass had flagged:

1. A **false verification-gate claim** — a guard asserted to catch drift that could
   never fail.
2. The **`.claude/skills` symlink-mirror reality** — the design had modeled the
   mirror as a byte-copy needing dual edits; it is actually git symlinks, so the
   "edit both + diff-parity" guard was redundant and vacuous.
3. **Gate coverage holes** — reference classes the ref-integrity gate did not yet
   repoint or verify.

The same discipline then drove the in-session delegation fix: subagents have no
`Skill` tool, so "load skill X" mapped to no action — the templates now say "READ
these paths first", require a `SKILLS LOADED` checklist, and have the manager
grep-verify the transcript.

## Reason
If this were lost, future sessions would trust a single evaluation pass and ship the
class of defect above — a guard that cannot fail, a mis-modeled runtime surface, an
incomplete gate. Each is invisible to the producer and to a same-system reviewer
(shared blind spots), and each poisons everything built on top of it. The cross-
system divergence is the anti-groupthink signal; paying for two systems is cheap
against shipping a vacuous gate.

## How
Spawn exactly two evaluators in parallel — one per system — each covering all seven
perspectives + Overall. Treat every cross-system divergence as a candidate real
defect, not noise: reconcile by pessimistic union, and have the producer answer the
harder system's finding rather than averaging the two. Re-run both systems after a
REVISE round; defects often only surface once an earlier one is fixed.

## Counter-cases
Dual-system is not free and not always warranted. For a trivial, mechanical change
(a typo fix, a one-line config flip) the two systems converge and the second pass
adds latency without signal. The technique earns its cost on design-bearing work —
new mechanisms, gates, cross-surface invariants — where blind spots are expensive
and shared.

## Related

- [[subagents-skip-load-directives-no-enforcement]] — the delegation gap the same evaluation discipline surfaced and fixed this session
