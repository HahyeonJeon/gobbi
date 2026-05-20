# Performance Perspective — 5-Role Agent Taxonomy (iter3, claude)

## Artifact Summary + W/W/H

See `project.md`. Performance = token + spawn + iteration costs.

## Memory reads

- `iter2/claude/performance.md` (inheritance — 4 findings, all Medium-or-lower)
- `agents/*.md` frontmatter (`model:` fields)
- `delegation/SKILL.md` § Model Selection (lines 173-192)

## Locked Frame (Stage 1)

### S-Pf-1 (inherited): Evaluator-opus default cost per iter (F-Pf-01)
### S-Pf-2 (inherited): Combinability guidance (F-Pf-02)
### S-Pf-3 (inherited): Spawn-explosion control (F-Pf-03)
### S-Pf-4 (inherited iter2 NEW): assistant load concentration / sonnet user-facing (F-Pf-NEW-01)
### S-Pf-5 (iter3 verification): Did Fix 3 (Write+Edit grant) change cost shape?
- [ ] Tool grant alone has no cost impact; behavior change might shift token volume per call
### S-Pf-6 (iter3 adversarial): Did the iter3 REVISE (4 fixes for 4 stuck/regression iter2 items) feel cost-effective?
- not-applicable: workflow cost, not bundle property
### S-Pf-7 (Cost / budget impact, Coverage Matrix): assistant sonnet sole-writer cost reasoning
- [ ] Per-loop sonnet × N loops vs hypothetical opus delta — reasoned trade-off

## Per-scenario per-check results (Stage 2)

### S-Pf-1 (F-Pf-01)
- (a) Rationale for evaluator opus: delegation/SKILL.md:184 unchanged. No per-stage override. Same as iter2. → **open (carry)**

### S-Pf-2 (F-Pf-02)
- (a) Combinability guidance: still no agent-file cross-reference to docs-cleanup-parallelism rule. → **open (carry)**

### S-Pf-3 (F-Pf-03)
- (a) Plan-shape guidance: leader.md:80 unchanged → **open (Low, carry)**

### S-Pf-4 (F-Pf-NEW-01 iter2 — assistant load concentration)
- (a) iter3 Fix 3 granted Write + Edit to assistant frontmatter → tool surface now matches the iter2-expanded role
- (b) However: model still sonnet (assistant.md:5). The cost rationale from iter2 (sonnet × N loops < opus × N loops) still holds.
- (c) iter3 Fix 2 routed Wrap-up step 4 user-facing decision via NEEDS_CONTEXT to manager → the assistant sonnet model no longer carries the user-facing judgment load. Manager (opus) handles AskUserQuestion. This **reduces** the iter2 quality risk.
- → **F-Pf-NEW-01 disposition: addressed-partial (sonnet still sole writer, but no longer holding user-facing decisions)**. Recommendation: downgrade severity to Low/25; mark as open for the remaining sole-writer concentration

### S-Pf-5 (NEW iter3 — Fix 3 cost shape change)
- (a) Write + Edit grant alone is a permission change, not a behavior change
- (b) However: assistant now has Write tool active across MEMORIZATION + Wrap-up phases. Token volume per call should be similar (the writes were already conceptually happening; iter2 was just failing for lack of tool). No measurable cost regression.
- → **no finding**

### S-Pf-7 (Cost / budget impact)
- (a) Per-loop sonnet × N loops: 4 productive loops (Ideation / Preparation / Planning / Execution) × 1 MEMORIZATION-sub-phase-spawn-per-loop × sonnet = ~4 sonnet calls. Wrap-up adds 1 more sonnet call for WORK. Total ~5 sonnet calls per session for assistant role.
- (b) Hypothetical opus alternative: 5 opus calls per session — modest cost delta on a per-session budget.
- (c) Trade-off: sonnet is justified because (after Fix 2) the assistant no longer carries user-facing judgment; mechanical staging-to-promotion routing fits sonnet's structured-execution sweet spot.
- → reasoned trade-off; no finding

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-Pf-01** | `assumption_risk` | `cost` | open (carry) | 50 | Medium | No per-stage model override for evaluator; same as iter2 | Iteration cost compounds; not in iter3 scope |
| **F-Pf-02** | `scenario_gap` | `cost` | open (carry) | 50 | Medium | Agent files do not reference docs-cleanup-parallelism rule; same as iter2 | Not in iter3 scope |
| **F-Pf-03** | `general` | `cost` | open (carry) | 25 | Low | Same as iter2 | Carry-forward |
| **F-Pf-NEW-01** | `assumption_risk` | `cost` | **addressed-partial (downgraded by Fix 2)** | 25 | Low | iter3 Fix 2 removed user-facing judgment from assistant; sonnet handles mechanical routing only | Quality risk mitigated; sole-writer remains but is no longer user-facing |

## Per-perspective verdict

**PASS** — Three Medium / Low findings, none reach REVISE threshold (no High/50). iter3 Fix 2 partially addresses F-Pf-NEW-01 by removing user-facing judgment load from sonnet. Net Performance profile: better than iter2.

Per the rule: no Critical ≥ 75; no High ≥ 50; → **PASS**.

This is an upgrade from iter2 REVISE.

## Low-confidence appendix

- F-Pf-03 (Low/25) — carry-forward
- F-Pf-NEW-01 (Low/25 post-Fix 2) — mitigated
