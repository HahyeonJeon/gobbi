# Performance Perspective — Cross-cutting Batch (iter2, claude)

## Stage 0 — Target Understanding

Same 7 cross-cutting skills + child docs. Performance lens: token / context cost, spawn-cost, repeated-read cost. W/W/H clear. iter2 fixes 1-8 applied — most relevant: Fix 1 (evaluator topology) and Fix 4 (status wire format).

## Inheritance from iter1

| iter1 ID | Severity | Conf | iter2 disposition |
|---|---|---|---|
| F-Pe-01 (8× evaluator over-provisioning if delegation read literally) | High | 75 | **Addressed (mostly)** — Fix 1 swept `delegation/SKILL.md:47,214,294` to the canonical "2 in parallel × all 7 perspectives sequentially". Anti-pattern callout at L214 explicitly forbids the 8-agent reading. **But** `templates/evaluator.md:82-88` still says "stay in your assigned perspective" / "trust parallel evaluators" / "walk the perspective's checklist" — a partial-sweep regression. A fresh evaluator reading the template alone could still construct a per-perspective spawn mental model. See F-Pe-NEW-1. |
| F-Pe-02 (memorization re-reads 48 eval files) | Low | 50 | **Persisted** — no fix; minor optimization opportunity. |
| F-Pe-03 (no perspective pruning) | Medium | 50 | **Persisted** — no fix in iter2 scope. Calibrated as intentional discipline. |

## Stage 1 — Locked Frame

Inherited from iter1 (S1-S4). New scenario for iter2:

**S5. (adversarial — iter2 regression check) Fix 1's spawn-cost contract is unambiguous in EVERY load-bearing doc**
- [ ] `delegation/SKILL.md` (3 sites) reads "2 in parallel × all 7 sequentially"
- [ ] `delegation/templates/evaluator.md` (the doc the evaluator subagent actually loads) reads same
- [ ] `evaluation/SKILL.md` reads same
- [ ] `orchestration/workflow/evaluation.md` reads same

## Stage 2 — Findings

### F-Pe-01-iter2 — PARTIALLY ADDRESSED — Spawn contract aligned in 3 of 4 load-bearing docs

**Type**: `design_flaw` / **Domain**: `cost` / **Confidence**: 75 / **Severity**: Medium / **Disposition**: open

**Evidence**: `delegation/SKILL.md:47,214,294` now uniformly state "2 in parallel — one per system, each handles all 7 perspectives + Overall sequentially". `evaluation/SKILL.md:9,234,538` consistent. `orchestration/workflow/evaluation.md:21,34,131` consistent. **But** `delegation/templates/evaluator.md:82-88` retains single-perspective imperatives: "stay in your assigned perspective. Trust parallel evaluators to cover their own lenses" + "walk through the perspective's checklist". The evaluator subagent loads this template directly. Cost-runaway scenario reduced from iter1's Critical (likely 8× spawn) to Medium (the template's "perspective discipline" wording is ambiguous — could be read as in-agent context discipline OR as a spawn-topology signal). Severity downgraded because the SKILL.md and Anti-pattern callout dominate the contract, but the partial sweep means an unsophisticated reader of just the template could still spawn the wrong way.

**Why it matters**: Cost regression is now bounded but the partial sweep is a Fix 1 regression — see F-Pe-NEW-1.

### F-Pe-NEW-1 — Fix 1 partial sweep: evaluator.md still contains single-perspective imperatives

**Type**: `design_flaw` / **Domain**: `cost` / **Confidence**: 100 / **Severity**: High / **Disposition**: open

**Evidence**: `delegation/templates/evaluator.md:82-83` reads "**Perspective discipline:** stay in your assigned perspective. Trust parallel evaluators to cover their own lenses." `evaluator.md:88` reads "Walk through the perspective's checklist against the deliverable." Singular "the perspective's checklist" / "your assigned perspective" / "parallel evaluators" all model a 1-perspective-per-agent topology. Yet `evaluator.md:128` ends with "all 7 perspectives + Overall complete". The template internally contradicts itself: the body says "your one perspective", the wire format says "all 7".

**Why it matters**: This is the doc the evaluator subagent actually loads. iter1's F-Pe-01 root-caused cost regression to exactly this kind of ambiguity. A fresh evaluator reading the template top-down arrives at "I have one perspective, my parallel siblings have other perspectives" — and either (a) the manager fixes it by spawning 8 agents (8× cost; iter1's worst case), or (b) the evaluator writes only one perspective file and the manager fails the artifact-completeness check. Either branch is costly. The fix-effort is small (rewrite ~6 lines in evaluator.md) but it is the doc that closes the loop.

### F-Pe-02 (carry forward, persisted) — Memorization re-reads bounded

Same as iter1 F-Pe-02. Persisted; minor optimization opportunity, not a blocker.

### F-Pe-03 (carry forward, persisted) — No perspective pruning

Same as iter1 F-Pe-03. Intentional discipline; cost is the price of the no-pruning rule.

### F-Pe-NEW-2 — Status wire format adds a small per-spawn overhead

**Type**: `general` / **Domain**: `cost` / **Confidence**: 50 / **Severity**: Low / **Disposition**: open

**Evidence**: Fix 4's wire format (`delegation/SKILL.md:111-115`) mandates a 3-line header (STATUS / VERDICT / ARTIFACT) on every subagent response. With ~30-50 subagent spawns per session, this is ~150 tokens of header overhead. Trivial vs. the determinism payoff. Recording only because Performance is the lens that must price it.

## Stage 2 Verdict

**REVISE** — F-Pe-NEW-1 (High, conf 100) is the Fix 1 partial-sweep regression Codex flagged. F-Pe-01 downgrade from iter1 is real progress, but the template's stale imperatives keep the spawn-cost contract at risk in the doc the evaluator subagent loads. Verdict moves iter1 REVISE → iter2 REVISE; same verdict but different root cause (iter1: docs out of sync everywhere; iter2: docs in sync except for the leaf template).

## Low-confidence appendix

- LC-Pe-1-iter2 (conf 25, Low): The `evaluation/SKILL.md` 551-line size is unchanged. Token cost ~3-4k per evaluator load is acceptable. Defer.
- LC-Pe-2-iter2 (conf 25, Low): The NEEDS_CONTEXT example with user-question block (`delegation/SKILL.md:138-154`) adds ~50 tokens to every prompt that cites it as exemplar. Minor.
