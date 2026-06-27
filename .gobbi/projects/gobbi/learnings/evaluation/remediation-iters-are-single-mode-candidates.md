---
name: remediation-iters-are-single-mode-candidates
description: Remediation iters (fix-list passes, not open framing) are low-yield Codex proposer candidates — run Claude-only but keep evaluation dual
type: learnings
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [evaluation, codex, process]
keywords: [remediation-iter, single-mode, deliberate-claude-only, cost-vs-benefit, D4]
author: claude
related: []
---

# Remediation iters are single-mode proposer candidates

## Insight

A remediation iter (applying a specific eval finding fix-list) is a deliberate Claude-only run for the proposer — NOT degraded mode. EVALUATION stays dual-system because independence at review is non-negotiable. Running a blind Codex re-proposal on a fix-list is low-yield (the author of the draft is best placed to apply their own fix-list); skipping it saves ~1 `codex exec` per iter with no lost anti-groupthink signal.

## Context

Ideation iter2 and iter3 (session babc6f3b): the manager decided (logged in `discussion-log.md` § D-iter2-mode, auto-decide) to run iter2 as Claude-only remediation (`revision_mode: claude-only-remediation`). Rationale: iter2 is a targeted fix-list from the iter1 evaluators; the leader authored the draft and knows exactly which lines to change; a blind Codex re-proposal would start from zero framing on what to fix and is unlikely to surface new content beyond what the fix-list already specifies. Evaluation stayed dual (Claude-PASS + Codex-REVISE for iter2), which caught the two remaining COD-CONS-2/COD-RISK-2 issues without requiring a third full dual-production run.

## Reason

The cost/benefit calculus for the proposer differs across iter types: open-framing iters (iter1, a blank-slate artifact) benefit most from the blind proposal's independent coverage; fix-list iters benefit less because the fix space is narrow and well-specified. Running the same proposer configuration for both iter types wastes tokens and adds latency on low-yield iters.

## How

Classify each iter before spawning the proposer:
- **Open-framing iter** (new artifact, blank slate, or a major re-frame): run dual proposer (`propose.mode: dual`). The blind proposal's independent framing is the anti-groupthink lever.
- **Remediation/fix-list iter** (a specific eval-finding fix-list, narrow scope): run Claude-only proposer as a deliberate `propose.mode: single` (or continue the leader without respawning). Stamp `revision_mode: claude-only-remediation` in frontmatter so the iter is distinguishable from degraded dual. Keep evaluation dual.

The `revision_mode` field is a custom staging field (not a schema extension) to make the distinction auditable. The standard `production_mode: dual` records the **origin** (iter1 was dual); `revision_mode` records **how fixes were applied** — they are not contradictory.

## Counter-cases

- **A remediation iter that re-frames a major dimension:** if the fix-list includes re-opening a design question or re-framing the artifact substantially, it is closer to open-framing — consider a dual proposer run.
- **When EVALUATION comes back REVISE again with new findings:** the new findings may be content-shaped (not fix-list-shaped). Review whether the next iter is a fix-list or an open re-frame before deciding the proposer mode.

## Related

- [[dual-production-codex-added-real-coverage]] — why open-framing iters benefit from dual proposer
