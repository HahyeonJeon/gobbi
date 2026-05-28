# Consistency — Ideation eval (iter2, claude)

## Frame
S6 faithfulness + S-quantitative: every count reproducible at HEAD; type-aware leak definition self-consistent; no synonym drift; cross-artifact sync.

## iter1 finding closure (re-run, not trusted)
- **C-1 (population undercount) → CLOSED.** P_live defined explicitly (lines 21-27). Re-ran ALL stated commands at HEAD d2b5b37: P_live_all=208 ✓, P_live_content=191 ✓, README=17 ✓, full conformance=50 ✓, all 9 base-key counts exact ✓ (name 54/desc 54/type 106/scope 182/feature 196/status 146/created 80/session 162/tags 70), all 8 staging-key counts exact ✓, legacy keys exact ✓ (date 96/slug 36/iter 22/loop 44), spelling drift exact ✓. The stale ~147/~14-25 numbers are gone. Reproducibility is now total.
- **C-2 (12/13/16 type framing) → CLOSED as Ideation-contract concern.** The artifact's "13 types" matches memory-map. iter2 routes the 12-vs-13 *principle* drift to a checklist item (line 147) and notes the 12/13/16 *type-count* reconciliation as a standard-authoring (Planning/Execution) detail in the F4 crosswalk (line 244). Correct disposition: it is not an Ideation defect.

## Adversarial: internal arithmetic check
The FIX-1 baseline (line 187) states "of the 62 files carrying `disposition`, 28 are legitimate backlog files ... and 35 are non-backlog leak candidates." 28+35 = 63, not 62. Re-ran: full-P_live disposition total = 62 ✓; non-backlog disposition = 35 ✓; backlog disposition under the FULL P_live filter = 27 (27+35=62 ✓), but under the looser filter the artifact actually ran for the "28" (`-path "*/backlogs/*" -not sessions -not archive`, omitting skills/agents/tmp) = 28. So the "28" and "35" were computed with slightly different filter sets, producing a +1 cross-foot. The 59-file true-leak set and the 13-under-backlogs figure both reproduce EXACTLY, so the predicate logic is sound; only the two sub-counts use mismatched filters.

## Typed findings

### CN-1 — FIX-1 baseline sub-counts (28 vs 35) cross-foot to 63 against a 62 total
- Type: `general` · Domain: `docs-sync` · Disposition: open · Confidence: 100 · Severity: Low
- Evidence: line 187 "of the 62 files carrying `disposition`, 28 are legitimate backlog files ... and 35 are non-backlog." Re-run: disposition total under full P_live = 62; non-backlog = 35; backlog under full P_live filter = 27 (not 28). The "28" matches a looser filter (`-path "*/backlogs/*"` excluding only sessions+archive). 27+35=62 reconciles; 28+35=63 does not.
- Why it matters: Low — cosmetic internal inconsistency. The load-bearing numbers (59 true-leak files, 13 under-backlogs-with-other-key, the predicate itself) all reproduce exactly, so neither the design nor the wave-1 plan is affected. A Planner copying "28 preserved" would over-count by one preserved file.
- Suggested direction: at Planning, recompute the backlog-disposition count under the single canonical P_live filter and reconcile to 27 (or restate as "27-28 depending on filter").

## Per-perspective verdict: PASS
C-1 and C-2 both genuinely closed; every headline count reproduces exactly. One Low cosmetic cross-foot (CN-1) in a sub-count that does not touch the predicate or the leak set.
