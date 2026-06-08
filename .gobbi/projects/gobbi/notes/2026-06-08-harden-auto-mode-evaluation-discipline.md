---
name: 2026-06-08-harden-auto-mode-evaluation-discipline
description: Session journal for 2026-06-07 session that shipped three doc commits hardening Auto-mode evaluation discipline across evaluation.md, auto-mode.md, and CLAUDE.md
type: notes
scope: project
feature: null
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [auto-mode, evaluation, orchestration, docs]
features_touched: [workflow]
---

# 2026-06-08 — Harden Auto-mode evaluation discipline

## What happened

This session shipped a three-commit docs-only change hardening Auto-mode evaluation discipline in the orchestration skill set. The session ran all five productive loops (Ideation → Preparation → Planning → Execution → Wrap-up) with dual-system evaluation at each step.

**Commits shipped:**
- `5e8e39d` — docs(orchestration): mode-split evaluation.md routine-triage escalations + label safety gates
- `594b654` — docs(orchestration): add auto-mode.md §7 Evaluation discipline + cross-links
- `9524ce9` — docs(principles): reconcile CLAUDE.md Evaluation blockquote to mode-split

**Branch:** `claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977` (no push yet — manager owns that)

**Worktree base:** c8a8654 (after mid-session rebase; see below)

---

## What each loop did

### Ideation (3 iters, PASS)

Identified three manager misbehaviors in Auto mode: (1) inventing an `evaluate.mode` question the user must answer; (2) the manager self-evaluating instead of spawning two evaluators; (3) idling / deferring after a REVISE verdict instead of auto-iterating. Framed the fix as a docs-only change to three files. Iter1 and iter2 REVISE rounds sharpened the scope contract and the placement decision. The key user-locked design decision (D8, Always-Ask category): split evaluation.md escalations into "routine-triage" (mode-split to Chat-only) vs "safety-gate" (interrupt in both modes). Iter3 PASS.

**Codex caught in iter3:** cap-exhaustion + stuck-detection + reciprocal-link gaps (C1 split-anchor precision) — surfaced as checklist item for Planning.

### Preparation (2 iters, PASS + mid-session rebase)

The preparation leader produced a readiness report claiming the worktree was "clean" and that the main-tree had drifted by two items. This was factually inverted. The truth: the worktree was 1 commit BEHIND origin/develop (#295 c8a8654 had added the continued-teammate parenthetical). The Claude evaluator flagged this as a High finding (F-C1, confidence 100). The manager rebased the worktree between iters. Iter2 re-verified all anchors on the post-rebase c8a8654 base and PASSED.

**Key anchor correction:** `orchestration/SKILL.md:247` (pre-#295) → line 266 (post-#295). This correction was recorded in the readiness report for Planning's use.

**Mistake staged:** `asserted-git-drift-direction-without-running-git` (preparation/staging).

### Planning (3 iters, PASS)

The planning leader copied the stale `:247` anchor from the Idea artifact into the plan in five places, despite the readiness report explicitly correcting it to line 266. Both evaluators found this at iter1 (High, confidence 100 each). The plan was revised at iter2. Iter2 had a second finding (Codex COD-ITER2-002): the plan's self-review "no SKILL.md:247 remains" claim was literally false (DD6 still held the literal string). Iter3 corrected both and PASSED.

**Dual-system divergences caught:** Codex independently flagged the same stale anchor issue Claude flagged, plus the self-review overclaim. Both systems were in agreement by iter3.

**Mistake staged:** `carried-stale-anchor-despite-upstream-correction` (planning/staging).

### Execution (1 iter, PASS)

Executor ran T1–T4 cleanly. All four tasks completed:
- T1: evaluation.md mode-splits (three routine-triage sections) + safety-gate labeling (six sites)
- T2: auto-mode.md §7 Evaluation discipline appended (trailing §7 after §6, before Cross-references)
- T3: CLAUDE.md line-27 Evaluation blockquote reconciled to mode-split
- T4: cross-file consistency verification (all 9 checks PASS; no commit)

Dual-system evaluation at iter1 produced 3 deferred Low findings (all non-gating):
1. Safety-gate count asymmetry (evaluation.md = 6 sites, auto-mode §7 = 3 headline gates)
2. Agent-psychology wording in §7 intro ("so the manager cannot rationalize past it")
3. Section-name paraphrase in evaluation.md framing ("Same symptom, different root cause" vs full header)

Both systems converged: PASS, all 3 deferred to a future prose-polish session.

### Wrap-up (this loop)

10 staging files promoted per the routing table. 2 Layer-1 mistakes written to project `mistakes/`. 3 deferred findings routed to `features/workflow/backlogs/`. 3 already-addressed checklists dropped with rationale. 1 Layer-2 generalization written to `skills/mistake/`.

---

## What got stuck

Nothing structural was left stuck. All three original problems were verified fixed by both evaluators. The three deferred backlogs (#8–#10) are intentionally deferred prose-polish items — they do not block the PR.

---

## What shifted

**Mid-session rebase:** The manager rebased the worktree from its original stale base onto c8a8654 between Preparation iter1 and iter2. All downstream work ran on the correct base. This was not planned at session start but was the correct action once the evaluator surfaced the stale-base finding.

**Routine-triage vs safety-gate split:** The original framing (Ideation iter1/iter2) spoke loosely of "mode-splitting all evaluation.md escalations." Iter3's dual-system evaluation sharpened this into the explicit routine-triage vs safety-gate taxonomy, with three safety-gate sites that must NEVER be mode-split. This sharpening was locked as D8 and carried through Planning and Execution.

---

## Decisions to respect

1. **Three evaluation.md escalations are routine-triage (mode-split):** § Iteration Caps, § Stuck detection, § Regression marking. Auto manager handles these without user interrupt.
2. **Six evaluation.md escalation sites are safety-gates (both modes interrupt):** same-symptom-different-root-cause, Major divergence note, any-FAIL note, degraded one-fails, both-fail, cost-budget. These are NOT mode-split.
3. **§7 is a trailing append to auto-mode.md** — it appends after §6, before Cross-references. Never renumber §1–§6.
4. **CLAUDE.md line-31 (continued-teammate sentence from #295) must NOT be touched** — it was verified intact at T3.
5. **chat-mode.md was not edited** — its stuck/regression behavior (via evaluation.md cite) is the Chat branch for those two mode-splits.

## Next session

- Manager: push branch and open PR against develop. Rebase if develop has moved since c8a8654.
- Three prose-polish items in `features/workflow/backlogs/` are ready for a future session: safety-gate count asymmetry, agent-psychology wording, section-name paraphrase.
- The two new Layer-1 mistakes (`asserted-git-drift-direction-without-running-git`, `carried-stale-anchor-despite-upstream-correction`) and one Layer-2 file (`layer2-verify-state-from-authoritative-source-not-proxy`) are now in project memory for future sessions to load.
