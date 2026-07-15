---
name: startup-skill-review-handoff
description: Prior-art-driven deep review of the startup skill — 6-file rewrite, 10 principles, dual-system Execution evaluation caught 5 semantic defects; PR #350 open, awaiting merge.
type: notes
scope: project
feature: null
status: active
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: [process, evaluation]
keywords: [startup-skill, dual-system, design-craft, pr-350]
author: claude
features_touched: []
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [acceptance-gate-and-conjunct-escape-hatch, confirm-craft-vs-graded-axis-when-user-narrows-scope, yc-canon, startup-canon, saas-metrics-pmf, skill-frameworks, current-skill-gap-study, scope-narrowed-to-design-craft, startup-review-proportionality, startup-skill-prior-art-review, startup-skill-dedup-skill-topics, execution-eval-bundle-frame-checks]
---

# Prior-art-driven deep review of the startup skill (PR #350)

## What happened

This session ran a full prior-art-driven deep review of gobbi's `startup` skill on the same branch
as PR #350 (`claude-2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b`). Ideation ran dual-system
PRODUCTION (Claude producer + Codex proposer, 28 integration deltas reconciled — 16 select-codex,
3 keep-own, ~9 merge-structure, zero unresolved large-gap) across five parallel research clusters
(YC canon, startup-book canon, SaaS/PLG metrics, AI-skill-framework prior art, and an adversarial gap
map of the pre-rewrite skill). draft-iter1 built a DP-4 commercial-axis architecture; the user
reviewed it mid-Ideation and narrowed the rewrite to design-craft only, dropping all
commercial-viability grading while keeping the underlying truth-serums (demand ≠ interest,
pay-for/workaround evidence) as elicitation-craft principles. Ideation's own evaluation ran
single-system (Claude only) as a deliberate proportionality call — the dual signal was already
delivered at PRODUCTION for that loop. Preparation and Planning passed with no findings. Execution
applied the locked design across five tasks (T1 acceptance-bundle rewrite, T2 skill-craft Principles,
T3 topics traversal, T4 evaluation propagation, T5 read-only verification), running in **degraded**
Claude-only production (no Codex proposal for any task) but the **mandatory full dual-system**
evaluation model. The Claude evaluator returned PASS with 2 Low findings at iter1; the independent
Codex evaluator returned REVISE with 5 High `design_flaw` findings the Claude read and all 4
mechanical guards missed entirely — most notably an AND-conjunct in the new "failability teeth" check
that let a hollow, unevidenced baseline pass. Two remediation commits (iter2, iter3) closed all 5
Highs; a regression pass of 8 probes confirmed no prior fix reopened. Final verdict: PASS.

## What shipped

Six commits on PR #350's branch, `67b6ce9c..e48ae544`:

| SHA | Message |
|---|---|
| `6e8a454b` | feat(startup): add 5 design-substance families + de-vanity checks |
| `0c38861e` | feat(startup): rewrite Principles to 10 + Procedure/Rules |
| `8d1f7548` | feat(startup): topics craft fixes + problem-first reorder |
| `4cd65b7b` | feat(startup): evaluation.md lens + anti-patterns for the 5 design-substance families + count sweep |
| `c91b4c53` | fix(startup): close 5 dual-system Execution findings — teeth two-gate, de-vanity, check-parity (T-fix iter2) |
| `e48ae544` | fix(startup): Topic 2.4 threshold basis — close PERF-001 (iter3) |

The five in-scope `skills/startup/` files (`SKILL.md`, `topics.md`, `scenario.md`, `checklist.md`,
`evaluation.md`) were rewritten; `recording.md` (the locked promotion/recovery machinery) is verified
byte-unchanged. Final state re-verified: 1:1 scenario↔checklist parity, 46-branch count with zero
residual 44, no live commercial-grading gate, the teeth two-gate correctly enforced, and all 4 guard
scripts green.

This Wrap-up promotion additionally shipped, into durable memory: 2 new mistakes (an acceptance-gate
truth-tabling trap, a craft-vs-graded-axis scope-narrowing trap) plus a witness added to an existing
mistake; the 5 prior-art research clusters as `references/startup-prior-art/`; 2 decisions (the
scope-narrowing rationale, the evaluation-proportionality confirmation); 1 learning; 2 backlogs
(a doc-duplication watch item, an execution-eval-bundle frame-checks follow-up).

## What got stuck

Nothing left in-flight unresolved. The one multi-pass item — `COD-EXE-PERF-001` (quantitative
threshold contextual basis) — needed a third iteration (Topic 2.4's target/stop-threshold questions)
after the iter2 fix only partially applied the pattern already accepted at Topic 9.2; it closed
cleanly at iter3 with no separate evaluator re-run recorded (a narrow, single-file,
single-clause-per-line closure, verified by direct diff + the guard suite).

## What shifted

The rewrite's scope shifted mid-Ideation: from an "add startup/commercial axes" direction (the DP-4
architecture, eight commercial-viability axes surfaced by the SaaS-metrics research) to
design-craft-only, after the user drew the craft-vs-graded-axis distinction. See
`decisions/memory/2026-07-14-scope-narrowed-to-design-craft.md`.

## Decisions to respect

- **`decisions/memory/2026-07-14-scope-narrowed-to-design-craft.md`** — the `startup` skill grades
  design-craft only; the eight commercial-viability axes and the DP-4 machinery are locked OUT, not
  deferred. Do not silently reintroduce commercial grading in a future `startup` session without a
  fresh user decision.
- **`decisions/evaluation/2026-07-14-startup-review-proportionality.md`** — Execution's mandatory
  full dual-system evaluation gate stays in force even when a Claude-only PASS looks mechanically
  clean; this session's 5 Codex-only-caught High findings are the standing evidence for why. Ideation
  evaluation may run single-system ONLY when PRODUCTION genuinely delivered the dual-system signal
  for that iteration (a real Codex proposal + integration log) — not as a blanket exemption.
- **`mistakes/verification/acceptance-gate-and-conjunct-escape-hatch.md`** — any multi-conjunct
  acceptance/gate/teeth predicate must be truth-tabled against the document's own separately-stated
  invariants before shipping.

## Next session

- Merge PR #350 (currently open on `claude-2026-07-13-0bbb7c63-919c-45c2-81ea-b86406c8b75b`).
- Pick up `backlogs/process/startup-skill-dedup-skill-topics.md` (low priority, opportunistic —
  the anti-sycophancy/premise-gate/riskiest-first blocks restated in both `SKILL.md` and
  `topics.md`) or `backlogs/evaluation/execution-eval-bundle-frame-checks.md` (low priority — 7
  Codex frame-coverage findings as candidate `skills/execution/checklist.md` improvements) when a
  future session naturally touches those files.
- The `develop` branch divergence flagged in prior sessions (local `93d75cd1` vs a remote head that
  may have moved) remains unreconciled — verify before the next session assumes `develop` is current.

## Related

- [[scope-narrowed-to-design-craft]] — the pivotal scope decision this session made
- [[startup-review-proportionality]] — the evaluation-configuration decision this session confirmed
- [[startup-skill-prior-art-review]] — the process learning this session produced
- [[acceptance-gate-and-conjunct-escape-hatch]] — the clearest evidence of dual-system evaluation value
