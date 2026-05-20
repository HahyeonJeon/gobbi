# Performance Perspective — 5-Role Agent Taxonomy (iter4, claude)

## Artifact Summary + W/W/H

See `project.md`. Performance = token + spawn + iteration cost shape.

## Memory reads

- `iter3/claude/performance.md` (inheritance — all Medium/Low; iter3 was PASS)
- `agents/*.md` `model:` fields
- `skills/delegation/SKILL.md` § Model Selection

## Locked Frame (Stage 1)

### S-Pf-1 (inherited): Evaluator-opus default cost per iter (F-Pf-01)

### S-Pf-2 (inherited): Combinability guidance (F-Pf-02)

### S-Pf-3 (inherited): Spawn-explosion control (F-Pf-03)

### S-Pf-4 (inherited iter2 NEW): assistant sonnet sole-writer (F-Pf-NEW-01)

### S-Pf-5 (NEW iter4): Sweep 1 cost impact — token volume / spawn count change?

### S-Pf-6 (NEW iter4 adversarial): Sweep 4 / Sweep 1 / Sweep 2 sweep cost — comprehensive grep + multi-file edit; observed cost vs partial-edit cost

### S-Pf-7 (Cost / budget impact, Coverage Matrix): assistant sonnet × N loops carry

### S-Pf-8 (NEW iter4): If F-P-iter4-NEW-01 (preparation contradiction) lands at runtime, what's the iteration cost?
- A subagent loading a contradictory contract escalates via NEEDS_CONTEXT → manager re-delegates → wasted iteration; cost regression

## Per-scenario per-check results (Stage 2)

### S-Pf-1 (F-Pf-01)
- delegation/SKILL.md:184 unchanged. → **open (carry)**

### S-Pf-2 (F-Pf-02)
- No agent-file cross-reference to docs-cleanup-parallelism rule. → **open (carry)**

### S-Pf-3 (F-Pf-03)
- leader.md:80 unchanged. → **open (Low, carry)**

### S-Pf-4 (F-Pf-NEW-01 — assistant sonnet)
- Same as iter3 — sonnet still sole-writer; user-facing judgment routed via NEEDS_CONTEXT to manager (opus). Cost-positive trade-off intact.
- → **open partial / Low/25 (carry)**

### S-Pf-5 (NEW iter4 — Sweep 1 cost shape)
- Removing AskUserQuestion from 4 frontmatter `tools:` lists + rewriting wrap-up/SKILL.md prose ≠ behavior change at runtime cost level
- NEEDS_CONTEXT escalation pattern was already in iter3 in some files; iter4 made it consistent → fewer false-AskUserQuestion-grant-then-NEEDS_CONTEXT-bounce iterations possible
- Net Performance: marginal improvement
- → no NEW finding

### S-Pf-6 (NEW iter4 adversarial — sweep cost reasoning)
- Comprehensive sweep cost = O(N files × M sweeps) of grep + Read + Edit per surface
- iter4 did 5 sweeps × 17/4/6/1/2 violations = ~30 edits across ~12 files
- The iter4 sweep was bounded by the prompt's claimed enumeration — observed: 2 NEW regressions per Project + Structure findings (F-iter4-NEW-01 + -02) indicate the sweep was not exhaustive
- Cost lesson: a one-shot mechanical drift detector (per F-S-04 issue #258) would catch the 2 new regressions on the next adversarial review pass — but the cost of running yet another REVISE iter to close them is itself a regression cost
- → no Performance-class finding (cost lesson lives in F-O Overall META domain)

### S-Pf-7 (Cost / budget impact)
- Per-session sonnet × ~5 calls (assistant in 4 productive loops + Wrap-up) — unchanged
- iter4 did NOT change agent model selection
- → reasoned trade-off; no finding

### S-Pf-8 (NEW iter4 — F-P-iter4-NEW-01 runtime cost)
- IF the Preparation orchestration doc's contradiction (leader-direct-write vs Wrap-up-promotes) is hit by a subagent at runtime → subagent must escalate via NEEDS_CONTEXT → manager re-delegates → wasted iteration (1 extra spawn × sonnet ≈ small cost; opus eval ≈ medium cost; user disruption ≈ unmeasurable)
- This is a Performance-secondary cost; the primary issue is process correctness owned by Project + Structure
- → no Performance-owned finding; Project + Structure own the cost-inducing contradictions

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-Pf-01** | `assumption_risk` | `cost` | open (carry) | 50 | Medium | No per-stage model override for evaluator | Carry |
| **F-Pf-02** | `scenario_gap` | `cost` | open (carry) | 50 | Medium | No docs-cleanup-parallelism reference | Carry |
| **F-Pf-03** | `general` | `cost` | open (carry) | 25 | Low | Spawn-explosion guidance gap | Carry |
| **F-Pf-NEW-01** | `assumption_risk` | `cost` | open partial (carry) | 25 | Low | Assistant sonnet sole-writer; mitigated by NEEDS_CONTEXT routing | Carry, mitigated |

## Per-perspective verdict

**PASS** — All carries; no NEW High in this perspective. Sweep 1 NEEDS_CONTEXT consistency is a marginal positive.

Per the rule: no Critical ≥ 75; no High ≥ 50; → **PASS**.

Carries from iter3 PASS. iter4 did not regress Performance.

## Low-confidence appendix

- F-Pf-03 (Low/25) — carry
- F-Pf-NEW-01 (Low/25 post-iter3 mitigation) — carry
