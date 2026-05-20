# Overall (Stage 3) — Loop Skills Batch 2 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary.)

## Stage 3 — Holistic Review

### Cross-perspective tensions

- **Project says: most loops trace right → next-loop input cleanly**. Consistency says: **task field schema across the Planning → Execution → Evaluation chain is broken at the contract layer (F-P-01)**. Structure flags Execution evaluator path drift (F-S-03). These compound — when both schema and path are wrong, the Execution evaluator cannot mechanically operate.
- **Structure says: SKILL skeletons mostly uniform**. Consistency says: Ideation's missing Memory Access Matrix (F-S-01) + verdict-enum gap (F-C-01) makes Ideation structurally outlying — but Ideation is also the *first* loop in the chain, so the asymmetry compounds with downstream loops that read Ideation's artifacts.
- **Usage says: each loop's SKILL is standalone-usable by its agent** — but the discussion-log lifecycle gap (F-U-02) means the four non-Ideation loops have an orphaned input dependency. Their evaluators / MEMORIZATION steps reference a file whose creation contract is undocumented in those loops.
- **Risk says: sole-writer contract is mostly enforceable**, with a Wrap-up MEMORIZATION carveout (F-R-01) that softens the strict claim. Combined with F-C-03 (iterations[] schema drift), the audit trail crossing Wrap-up has two distinct non-uniformities.

### Cross-cutting findings (not owned by any single perspective)

### F-O-01 — Discussion-log lifecycle is documented only in Ideation, depended on by all 5 loops (High / 75)

(See F-U-02; promoted to Overall because it's a cross-loop documentation hole, not localized to Usage.)

### F-O-02 — Ideation is structurally outlying across multiple dimensions (High / 100)

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Severity**: High
- **Confidence**: 100
- **Evidence**: Ideation diverges from the other 4 loops on at least four axes:
  1. **Memory Access Matrix**: absent at top level (F-S-01)
  2. **Verdict enum**: PASS / REVISE only, missing FAIL (F-C-01)
  3. **Discussion-log lifecycle**: only Ideation documents it (F-U-02 / F-O-01)
  4. **Staging directories named in Memory Access**: Ideation lacks the explicit listing (F-C-02)
- **Impact**: when reviewing the 5-loop family for consistency, Ideation reads as a leftover from a prior design pass that other loops have moved on from. Either the other 4 over-specified or Ideation under-specified — either way, the inconsistency degrades the family's design coherence.
- **Remediation**: do an Ideation pass to backport the structural patterns from preparation/planning/execution/wrap-up. Specifically: add `## Memory Access Matrix` section, add `FAIL` to verdict enum + EVALUATION procedure, move discussion-log lifecycle to orchestration skill or replicate the spec in each loop, explicitly list staging subdir set in the matrix.

## Karpathy 4-modes check

| Mode | Hit? | Where |
|---|---|---|
| **Wrong assumptions** | HIT (mitigated) | Planning SKILL assumes a 5-field prose task schema; evaluation.md + Execution assume a 6-field YAML schema (F-P-01). The premise that "the schema is obvious from the requested artifact" is false |
| **Overcomplexity** | partial | Each loop SKILL is long (Planning is 489 lines, Execution 289). The procedure tables are necessarily detailed; but the per-loop Memory Access Matrix duplication across 4 of 5 loops could be factored to a single shared block (an orchestration ref) — minor |
| **Orthogonal edits** | partial | Ideation is structurally outlying (F-O-02); the refactor pass appears to have updated preparation/planning/execution/wrap-up uniformly but skipped Ideation. Orthogonal in the sense that the design pass landed on 4 loops, missed the 5th |
| **Imperative-over-declarative** | NOT HIT | Loop SKILLs correctly declare contracts (Inputs, Outputs, Exit checklists) rather than scripting exact commands |

## Preserve list (what NOT to touch on REVISE)

- **Phase block structure** — Purpose / Inputs / Procedure / Outputs / Exit checklist — uniform and well-shaped across all 20 phase blocks
- **Wrap-up's `staging → project-memory routing` table** — deterministic, mechanically applicable, with explicit collision policy
- **Execution's 5-phase lifecycle** (Study → Plan → Execute → Verify → Commit) — well-suited to the executor role and mirrored by the evaluator's verification expectations
- **Planning's Restore Point** (L122-134) — preserves prior REVISE iter byte-for-byte, addressing audit-trail concerns
- **Wrap-up's sole-writer principle as a design statement** (despite the L286 carveout — fix the carveout, keep the principle)
- **Each loop's "Disagree when you disagree" core principle** — anti-sycophancy floor
- **Memory Access Matrix tier shape** (Preparation/Planning/Execution/Wrap-up version) — adopt this shape into Ideation

## Overall verdict

**REVISE** — High-severity findings (F-P-01 schema mismatch, F-S-03 path drift, F-O-02 Ideation structural outlier, F-C-01 verdict enum gap, F-S-02 NEEDS_CONTEXT asymmetry, F-R-01 sole-writer carveout, F-U-02/F-O-01 discussion-log gap) cluster around two themes:

1. **Cross-skill schema/path/enum drift** — F-P-01, F-S-03, F-C-01, F-C-03 — mechanical contracts that runtime depends on
2. **Ideation under-specified relative to the family** — F-S-01, F-O-02, F-C-02

Both must be addressed before this batch of loop skills is ship-ready. Critical findings (F-P-01, F-S-03) are runtime contract breaks; High findings compound the family-coherence problem.

## All findings — summary table

| ID | Type | Domain | Disposition | Confidence | Severity | One-line |
|---|---|---|---|---|---|---|
| F-P-01 | design_flaw | docs-sync | open | 100 | Critical | Planning task schema mismatch between SKILL and evaluation/Execution |
| F-P-02 | design_flaw | process | open | 100 | Medium | Ideation lacks FAIL verdict (cross-loop view: F-C-01 Critical) |
| F-S-01 | design_flaw | docs-sync | open | 100 | High | Ideation SKILL missing Memory Access Matrix section |
| F-S-02 | design_flaw | process | open | 75 | High | NEEDS_CONTEXT escalation primitive only in Execution/Wrap-up |
| F-S-03 | design_flaw | docs-sync | open | 100 | Critical | Execution evaluation.md output path missing `{task-id}/` |
| F-S-04 | general | docs-sync | deferred | 50 | Low | Phase block ordering polish |
| F-Pf-01 | general | process | open | 25 | Low | maxIterations not named in loop SKILLs |
| F-A-01 | general | docs-sync | open | 50 | Low | Wrap-up "sole writer" description vs MEMORIZATION carveout |
| F-A-02 | general | docs-sync | deferred | 25 | Low | Naming convention drift |
| F-U-01 | assumption_risk | process | open | 75 | Medium | Execution per-task vs loop-wide iter counter ambiguity |
| F-U-02 | design_flaw | docs-sync | open | 75 | Medium | Discussion-log lifecycle documented only in Ideation |
| F-C-01 | design_flaw | process | open | 100 | Critical | Ideation verdict enum missing FAIL (cross-loop view) |
| F-C-02 | general | docs-sync | open | 75 | Medium | Staging directory listings non-uniform across Memory Access Matrices |
| F-C-03 | design_flaw | docs-sync | open | 75 | Medium | iterations[] entry schema differs across loops |
| F-C-04 | general | docs-sync | open | 50 | Low | Eval path declaration style drift between SKILL and child |
| F-R-01 | design_flaw | process | open | 75 | High | Wrap-up MEMORIZATION carveout weakens sole-writer claim |
| F-R-02 | assumption_risk | process | open | 50 | Medium | Cross-task staging READ permission risks scope drift |
| F-R-03 | general | process | deferred | 25 | Low | evaluate.mode=='skip' not named in loop SKILLs |
| F-O-01 | design_flaw | docs-sync | open | 75 | High | Discussion-log lifecycle gap across loops |
| F-O-02 | design_flaw | docs-sync | open | 100 | High | Ideation structurally outlying across 4 dimensions |

**Totals in-scope** (open or new): Critical 3, High 5, Medium 5, Low 5
**Deferred** (out-of-scope per #258): 3
