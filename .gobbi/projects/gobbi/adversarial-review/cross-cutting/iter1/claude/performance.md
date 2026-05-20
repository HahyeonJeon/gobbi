# Performance Perspective — Cross-cutting Batch (iter1, claude)

## Stage 0 — Target Understanding

Performance lens for docs-as-skill artifacts means: token / context cost, spawn-cost (subagent counts), repeated-read cost. W/W/H clear.

## Stage 1 — Locked Frame

**S1. Subagent spawn cost is bounded**
- [ ] Evaluator spawn count per iter is finite and stated
- [ ] No per-perspective spawn explosion
- [ ] Memorization assistant: 1 per iter (not parallelized)

**S2. Skill load size is reasonable for context budget**
- [ ] Each cross-cutting SKILL.md fits comfortably with peers in working context
- [ ] Templates are loaded only when needed, not bundled

**S3. (adversarial) Repeated work — does any procedure ask agents to re-read the same content multiple times in one iter?**
- [ ] Memorization Step 6 pre-step reads all iters' evaluation files — cost is O(n × systems × 8) per PASS iter
- [ ] Manager-side validation gates 1-7 in memorization workflow are mechanical, no LLM re-reads

**S4. No quadratic blow-up paths**
- [ ] Cumulative staging on PASS is linear in (iters × findings), not quadratic
- [ ] Slug+collision policy is O(1) per finding (pre-write check)

## Stage 2 — Findings

### F-Pe-01 — Evaluator-per-perspective spawn (if delegation/SKILL.md is taken literally) is 8× over-provisioned

**Type**: `design_flaw` / **Domain**: `cost` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: Inherited from F-S-02 (Structure). If a manager follows `delegation/SKILL.md:47,225` literally ("Spawn ≥2 perspectives in parallel"), they would spawn 8 evaluators per system (7 perspectives + Overall) × 2 systems = **16 parallel agents per evaluation phase per iter** instead of the intended 2. At opus pricing and the workflow's 3 default iterations, this is a substantial cost regression vs the intended 6 evaluator spawns per loop.

**Why it matters**: Cost-runaway scenario per Coverage Matrix (Performance + Risk). The ambiguity directly translates into 8× model cost on every evaluation phase if a fresh manager follows the wrong doc. The mitigation is to align the docs (F-S-02 fix), not to add a separate cost gate.

### F-Pe-02 — Cumulative staging re-reads all prior-iter evaluation files at every PASS

**Type**: `general` / **Domain**: `performance` / **Confidence**: 50 / **Severity**: Low / **Disposition**: open

**Evidence**: `memorization/SKILL.md:158` Step 6 pre-step: "for every iter `m ∈ 1..n`, every system (claude + codex), every perspective (7 + overall), READ `sessions/.../{loop}/evaluation/iter{m}/{system}/{perspective}.md`". For iter 3 PASS that's 3 × 2 × 8 = 48 file reads. Acceptable, but the manager already validated these files at each iter's EVALUATION exit — they could be cached.

**Why it matters**: Minor. The reads are bounded (≤ 48 files) and ensure the cumulative-staging contract. Optimization opportunity for future, not a blocker.

### F-Pe-03 — Evaluation perspective set is not pruned even for trivially-applicable ones

**Type**: `general` / **Domain**: `cost` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: `evaluation/SKILL.md:96`: "Every evaluation runs **all seven perspectives + Overall**. No pruning. Inapplicable perspectives are not skipped — they are still walked and may legitimately produce zero findings, which is itself a recorded result." For a docs-only Ideation artifact, Performance perspective at Stage 2 produces near-zero signal — yet the agent must still walk the Frame and write a `## Locked Frame (Stage 1)` block.

**Why it matters**: Calibrated against the task brief carryover ("PI agents trust prior 13-iter work"), the no-pruning rule is intentional adversarial-coverage discipline. The token cost is the price of the rule. Recording as Medium because the rule is defensible but adds ~20% per-iter cost.

## Stage 2 Verdict

**REVISE** — F-Pe-01 (High, conf 75) carries the verdict. Cost contract ambiguity = real budget risk; same root cause as F-S-02.

## Low-confidence appendix

- LC-Pe-1 (conf 25, Low): `evaluation/SKILL.md`'s 551-line size adds ~3-4k tokens per evaluator load. Minor at current model context budgets.
