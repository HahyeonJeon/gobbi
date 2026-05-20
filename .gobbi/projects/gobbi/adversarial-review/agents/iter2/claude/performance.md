# Performance Perspective — 5-Role Agent Taxonomy (iter2, claude)

## Artifact Summary + W/W/H

See `project.md`. Performance = token + spawn + iteration costs across the taxonomy.

## Memory reads

- `iter1/claude/performance.md` (inheritance — 3 findings)
- `agents/*.md` frontmatter (`model:` fields)
- `delegation/SKILL.md` § Model Selection (lines 173-192)

## Locked Frame (Stage 1)

### S-Pf-1 (inherited): Evaluator-opus default cost across iterations
- [ ] Documented rationale or per-stage override

### S-Pf-2 (inherited): Per-task executor combinability guidance
- [ ] Agent files reference the docs-cleanup-parallelism rule or equivalent guidance

### S-Pf-3 (inherited): Spawn-explosion control
- [ ] Narrow-task plans do not produce 20+ fresh executors without guidance

### S-Pf-4 (NEW iter2 adversarial): Did Task C concentrate too many phases on the assistant role (sonnet)?
- [ ] Assistant now owns MEMORIZATION × all loops + Wrap-up WORK + lookup. Token-cost shape sensible?
- [ ] sonnet model for Wrap-up sole-writer is intentional?

### S-Pf-5 (NEW iter2 adversarial): REVISE iteration cost itself
- [ ] iter1 → iter2 cost (7 evaluators × 4 stages × ≥2 systems on identical bundle scope) is recorded somewhere or budgeted

## Per-scenario per-check results (Stage 2)

### S-Pf-1 (F-Pf-01)
- (a) Rationale: delegation/SKILL.md:184 unchanged. No per-stage override. → **disposition: open**

### S-Pf-2 (F-Pf-02)
- (a) Agent-file reference to combinability: **STILL ABSENT**. The docs-cleanup-parallelism rule sits in project rules but no agent file references it. → **disposition: open**

### S-Pf-3 (F-Pf-03)
- (a) Plan-shape guidance: leader.md:80 unchanged. → **disposition: open (Low)**

### S-Pf-4 (NEW iter2 — assistant load concentration)
- Assistant now: MEMORIZATION across 4 loops × per-loop synthesis + Wrap-up WORK (sole project-memory writer) + lookup-mode work
- Token cost shape: each MEMORIZATION call reads transcripts + drafts + staging → moderate-large input context. sonnet handles this well at modest cost
- Wrap-up WORK: one-shot promotion routing; manageable
- The concentration is reasonable for cost-efficiency: per-loop synthesis × N loops × sonnet < per-loop synthesis × N loops × opus (which iter1's "executor or leader" ambiguity might have caused since both default to opus or sonnet differently). Net **cost-positive** decision
- However: Wrap-up WORK includes user-facing decisions (AskUserQuestion routing — assistant.md:27). Sonnet for user-facing judgment is borderline. Delegation could selectively promote to opus per `delegation/SKILL.md:187` (dispatch-time override). Not enforced anywhere.
- → **F-Pf-NEW-01** (Medium/50)

### S-Pf-5 (NEW iter2 — REVISE cost)
- No artifact in the bundle records REVISE cost
- iter1 → iter2 cost is real but not load-bearing on the bundle's design — it is a workflow cost
- → not a bundle finding

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-Pf-01** | `assumption_risk` | `cost` | open | 50 | Medium | Same as iter1 — no per-stage model override for evaluator | Iteration cost compounds |
| **F-Pf-02** | `scenario_gap` | `cost` | open | 50 | Medium | Same as iter1 — agent files do not reference docs-cleanup-parallelism | Spawn-shape decisions unguided |
| **F-Pf-03** | `general` | `cost` | open | 25 | Low | Same as iter1 | Carry-forward |
| **F-Pf-NEW-01** | `assumption_risk` | `cost` | open | 50 | Medium | assistant.md:27 Wrap-up WORK AskUserQuestion access; frontmatter model: sonnet; delegation/SKILL.md:187 dispatch-time override is "explicit, not inferred" — but no agent file or template promotes Wrap-up WORK to opus | Sonnet handles user-facing routing for project-memory promotion; quality bar may be lower than opus would deliver. Cost-cheap, quality risk |

## Per-perspective verdict

**REVISE** — Three Medium findings on cost (F-Pf-01, F-Pf-02, F-Pf-NEW-01). No Critical or High. The taxonomy is still cost-defensible; the new concentration on assistant is reasonable but inherits Wrap-up's user-facing judgment under sonnet without an explicit override mechanism.

## Low-confidence appendix

- F-Pf-03 (Low/25) — carry-forward
