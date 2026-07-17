---
name: dual-system-catches-semantic-bugs-past-green-guards
description: "At the wrap-up-redesign Execution eval, all standing guards were green and the Claude evaluator returned PASS-ish (2 minor), but the Codex evaluator found 4 real High semantic bugs (REVISE→Stage-1 self-contradiction, baseline-overwrite, handoff-in-PASS-only-dir, workflow.finish owner drift) — verified real. Green guards + one system's PASS do not certify semantic correctness."
type: learnings
scope: project
feature: null
status: active
created: 2026-07-16
session: e5c0af1d-005d-4455-a58f-efe601ed342f
tags: [evaluation, process]
keywords: [dual-system, anti-groupthink, semantic-bugs, green-guards-not-enough, execution-eval, codex-caught, revise-loop-semantics]
author: claude
---

# Dual-system catches semantic bugs that green guards + a single reviewer miss

**Observation** — In the 2026-07-16 wrap-up redesign, the Execution changeset passed EVERY standing guard (links, residual-vocab, skill-mistakes, frontmatter, mirror-parity) and the Claude Execution evaluator judged it a clean implement-the-design PASS with only "2 minor issues". The independent Codex evaluator returned REVISE with **4 High findings** — all real (manager-spot-verified): the rewrite stated the REVISE→Stage-1 loop semantics inconsistently (SKILL.md contradicted itself, :82 Stage 1 vs :119 Stage 2), and the baseline-snapshot / handoff-path / memory-owner details inherited it, plus a mistake trap that enforced deferred behavior.

**Why it matters** — Structural guards check form (links resolve, vocab clean, mirrors present); they cannot see semantic/procedural contradictions in prose. And a single evaluator (even a strong one) can rationalize a subtle procedural inconsistency as "minor". The cross-family second opinion is what surfaced 4 process-correctness bugs that would have made a fresh agent skip source re-inventory on REVISE.

**How to apply** — Keep the dual-system EVALUATION even when guards are green and one system says PASS; a green-guards + single-PASS state is NOT a certification of semantic correctness for a procedure doc. Reinforces `[[dual-system-eval-catches-defects]]`: the pattern held at the Execution/changeset gate, not just at design time — Codex found NON-overlapping High findings at every gate this session.
