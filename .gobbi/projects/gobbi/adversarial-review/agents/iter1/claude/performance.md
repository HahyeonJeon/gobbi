# Performance Perspective — 5-Role Agent Taxonomy (iter1, claude)

## Artifact Summary + W/W/H

See `project.md`. Performance for an agent-definition bundle = token cost, context-bloat, latency from sequential spawning, and the cost of model selection per role.

## Memory reads

- `agents/*.md` frontmatter `model:` fields
- `delegation/SKILL.md` § Model Selection (lines 174-193)
- `principles/SKILL.md` Principle 11 (metrics not targets)

## Locked Frame (Stage 1)

### S-Pf-1: Token/cost budget per role is justified
- [ ] Each model choice (opus vs sonnet) has stated rationale
- [ ] Heavy roles (opus) are limited to where deep reasoning is required
- [ ] No role is upgraded to opus for prestige without a measurable bar

### S-Pf-2: Context budget within a single role definition file
- [ ] Each agent file size is bounded — a fresh subagent that must load the file plus skills + rules + mistakes does not exceed comfortable context
- [ ] No file forces redundant reads (e.g., references same skill three times)

### S-Pf-3 (adversarial): Cumulative cost across a workflow run scales reasonably
- [ ] An average Plan (~10 tasks) with one executor per task does not require N opus invocations
- [ ] Mandatory evaluation (≥2 evaluators × 7 perspectives, opus) does not dwarf the workflow's total
- [ ] Spawning fresh executors per task (no context warmth) is intentional and cost-bounded

### S-Pf-4: Evaluator model choice — opus × 7 perspectives × 4 stages × ≥2 iterations
- [ ] The opus-for-evaluator default has cost rationale documented
- [ ] An escape hatch exists for routine evaluations (sonnet override) — yes per delegation/SKILL.md:188

### S-Pf-5: Adversarial — "fresh subagent per task" defeats context caching
- [ ] The "no inheritance" rule (delegation/SKILL.md:23) is balanced against caching efficiency
- [ ] No plan-shape encourages 20+ small executor spawns where one combined would do

## Per-scenario per-check results (Stage 2)

### S-Pf-1
- (a) Rationale stated: **YES** — delegation/SKILL.md:179-186 has the rationale table
- (b) Opus limited appropriately: **DEBATABLE** — manager/leader/evaluator = opus is the default. Evaluator-opus is potentially aggressive given that evaluators run 4-stage scripted procedures (frame build then walk frame) — the procedural nature is sonnet-amenable for many cases
- (c) Bar: **YES** — explicit deep-reasoning bar per role

### S-Pf-2
- (a) File size bounded: **YES** — largest file (manager.md) is ~130 lines, all under comfortable context
- (b) No redundant reads: **MOSTLY YES** — but all 5 files repeat "1. principles 2. rules 3. mistake" load directive, which the agent definitions inherit at spawn time anyway. Mild redundancy → not a finding

### S-Pf-3 (adversarial)
- (a) 10-task plan: requires 10 sonnet executors + ≥2 opus evaluators per task if evaluation runs per-task, or once at end. evaluation/SKILL.md states "mandatory after Execution" → once at end implied. **Acceptable**
- (b) Mandatory evaluation × 7 perspectives: ≥2 systems (claude+codex) × 7 perspectives = ≥14 opus invocations × 4 stages = significant token spend → **F-Pf-01** (Medium)
- (c) Fresh-executor-per-task scalability: **UNDOCUMENTED** — no agent file discusses whether one executor handling 3 related tasks beats 3 fresh executors. The decision is left to the manager without guidance → **F-Pf-02** (Medium)

### S-Pf-4
- (a) Cost rationale for evaluator-opus: **YES** but weak. delegation/SKILL.md:184 says "adversarial assessment of artifacts + process docs needs deep reasoning to catch non-obvious gaps". True for finding-discovery; less true for Stage 1 frame-build (mechanical) and Stage 2 walk (procedural)
- (b) Escape hatch: **YES** (override mechanism at delegation/SKILL.md:187-189)

### S-Pf-5 (adversarial)
- (a) Caching balance: **NOT ADDRESSED** — fresh-context rule is principled (Principle 2), but no agent file acknowledges the cache-cost tradeoff. Not a real finding — the principled position is correct; just unstated → not raised
- (b) Plan shape encouraging spawn explosion: leader.md:80 "each task: specific deliverable" — encourages narrow tasks. With one executor per narrow task, spawn count grows. No mitigation guidance → **F-Pf-03** (Low)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-Pf-01** | `assumption_risk` | `cost` | open | 50 | Medium | evaluator default = opus per delegation/SKILL.md:184; evaluation procedure has scripted Stage 1+2 components that are sonnet-amenable; no per-stage model choice | Iteration loops (REVISE → iter2 → ...) can double/triple opus cost; budget impact unstated |
| **F-Pf-02** | `scenario_gap` | `cost` | open | 50 | Medium | No agent file discusses "when to combine tasks into one executor". The docs-cleanup-parallelism rule exists but the agent files don't reference it | Manager will over-spawn fresh executors for related work; cost+latency penalty |
| **F-Pf-03** | `general` | `cost` | open | 25 | Low | leader.md:80 encourages narrow tasks; manager.md:67 encourages parallel where possible (good for research, costly for spawn overhead even on read-only work) | Minor; mostly captured by F-Pf-02 |

## Per-perspective verdict

**REVISE** — Two Medium-50 findings on cost. Neither rises to Critical/High; the budget concerns are real but not load-bearing for the bundle's correctness. The taxonomy works at the level of behavior; cost is a tunable downstream. Recommend recording F-Pf-01 and F-Pf-02 as decisions for the next iteration.

## Low-confidence appendix

- F-Pf-03 (Low/25) — kept for memorization
