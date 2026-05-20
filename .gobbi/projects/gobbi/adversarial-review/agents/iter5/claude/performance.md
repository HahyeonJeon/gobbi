# Performance Perspective — 5-Role Agent Taxonomy (iter5, claude)

## Artifact Summary + W/W/H

See `project.md`. Performance = token + spawn + iteration cost shape.

## Memory reads

- `iter4/claude/performance.md` (PASS; all Medium/Low carries)
- `agents/*.md` `model:` fields
- `skills/delegation/SKILL.md` § Model Selection

## Locked Frame (Stage 1)

### S-Pf-1 (inherited): Evaluator-opus default cost per iter (F-Pf-01)
### S-Pf-2 (inherited): Combinability guidance (F-Pf-02)
### S-Pf-3 (inherited): Spawn-explosion control (F-Pf-03)
### S-Pf-4 (inherited iter2): assistant sonnet sole-writer (F-Pf-NEW-01)
### S-Pf-5 (NEW iter5): Fix 5 cost impact — wrong-phase-dispatch BLOCKED → manager re-dispatch
### S-Pf-6 (NEW iter5 adversarial): Fix 1's coherent staging language now sits across 4 surfaces — token volume vs prior iter
### S-Pf-7 (Cost / budget, Coverage Matrix): assistant sonnet × N loops carry

## Per-scenario per-check results (Stage 2)

### S-Pf-1 (F-Pf-01) — open (carry)

### S-Pf-2 (F-Pf-02) — open (carry)

### S-Pf-3 (F-Pf-03) — open (Low, carry)

### S-Pf-4 (F-Pf-NEW-01 — assistant sonnet) — open partial Low/25 (carry)

### S-Pf-5 (NEW iter5 — Fix 5 cost shape)
- Before Fix 5: subagent receiving wrong-phase task either (a) attempted task anyway (degraded output) or (b) emitted plain `BLOCKED` → manager re-contracted with user (1 user-loop)
- After Fix 5: subagent emits `BLOCKED` with `reason: wrong-phase-dispatch` → manager re-dispatches **without** re-contracting with user (per delegation/SKILL.md:126 dispatch table)
- Cost delta: 1 user-loop avoided per misroute event. Net Performance improvement.
- Spawn-explosion concern: Fix 5 does NOT enable an infinite loop because the redirect is one-shot (subagent names the correct role; manager dispatches to that role; if that role also blocks with wrong-phase-dispatch, the manager surfaces to user — implicit in the "unless the correct role is ambiguous" clause of the dispatch table row)
- → no NEW Performance finding; Fix 5 is cost-neutral or cost-positive

### S-Pf-6 (NEW iter5 adversarial — Fix 1 token volume)
- preparation.md grew by ~5 lines from coherent rewrite (added cross-link to preparation/SKILL.md memory matrix; clarified "sole promoter")
- Manager load cost per Preparation Loop dispatch: ~+5 lines of context. Marginal.
- The cost is worth it because: every prior iter required REVISE iters that re-spawned the entire workflow → 5 lines of clarity prevents N future re-spawn cycles
- → no NEW Performance finding

### S-Pf-7 (Cost / budget) — unchanged

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-Pf-01** | `assumption_risk` | `cost` | open (carry) | 50 | Medium | No per-stage model override | Carry |
| **F-Pf-02** | `scenario_gap` | `cost` | open (carry) | 50 | Medium | No docs-cleanup-parallelism reference in agent files | Carry |
| **F-Pf-03** | `general` | `cost` | open (carry) | 25 | Low | Spawn-explosion gap | Carry |
| **F-Pf-NEW-01** | `assumption_risk` | `cost` | open partial (carry) | 25 | Low | Assistant sonnet sole-writer; mitigated by NEEDS_CONTEXT | Carry |

## Per-perspective verdict

**PASS** — All carries; no NEW Performance regression. Fix 5 introduces a marginal cost improvement (avoids user re-contracting on misroute).

Per the rule: no Critical ≥ 75; no High ≥ 50; → **PASS**.

iter4 was PASS; iter5 holds PASS. Stable across iter3→4→5.

## Low-confidence appendix

- F-Pf-03 (Low/25) — carry
- F-Pf-NEW-01 (Low/25) — carry
