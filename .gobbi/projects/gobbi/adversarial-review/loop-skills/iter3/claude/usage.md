# Usage (Stage 2) — Loop Skills Batch 2 iter3 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for shared Stage 0.)

## Stage 1 — Frame lock (Usage perspective)

Usage verifies that an agent loading a single skill knows what to do without cross-loading 5 other skills first. iter1 found F-U-01 (per-task vs loop-wide iter counter ambiguity) + F-U-02 (discussion-log lifecycle documented only in Ideation); iter2 addressed F-U-02 by making Ideation's lifecycle canonical-for-all-5-loops but left F-U-01 `open` as a cross-layer #258 concern. iter3 must verify the 3 surgical fixes do not introduce new Usage burden.

## Stage 2 — Per-scenario checks

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-U1 | F-U-02 (discussion-log lifecycle canonical-for-all-5) still PASS | YES | Unchanged from iter2; ideation/SKILL.md L411 promotes spec as canonical for all 5 loops |
| S-U2 | F-U-01 (per-task vs loop-wide iter counter) status | OPEN-MEDIUM (unchanged) | execution/SKILL.md L215 still names per-task iter; orchestration spec retains loop-wide iter shape. Same cross-layer concern, not in iter3 scope, defer-eligible per brief |
| S-U3 | Fix 2 — task schema fields easily locatable for executor on cold load | YES | execution/SKILL.md L93 enumerates all 8 task fields inline + explicitly distinguishes assignment metadata. An executor cold-loading execution/SKILL.md can read this row + L184/L188 schema mentions and compose a valid spec without round-tripping to planning/SKILL.md |
| S-U4 | Fix 3 — leader on cold load now knows the escalation primitive | YES | A leader loading ideation/SKILL.md (or preparation, or planning) reads the blockquote at L58 (resp. L64, L87) and immediately understands: (a) DISCUSSION uses manager-direct AskUserQuestion, (b) WORK uses NEEDS_CONTEXT returned in final report. Bridges the previous gap where a leader had to load `agents/leader.md` to find the primitive |
| S-U5 | Fix 1 — wrap-up agent on cold load understands idempotence | YES | wrap-up/SKILL.md L207 (routing row) + L351 (principle) + L75 ("Idempotent promotions") work in concert. No need to cross-load preparation/SKILL.md to know the rule |
| S-U6 | New cross-loading burden introduced? | NO | Fix 2 cross-refs Sub-step D in Planning (1 cross-load, minor); Fix 3 cross-refs `discussion/SKILL.md` + `agents/leader.md` (already required loads for leaders). No new mandatory cross-loads |

## Typed findings (iter3)

### F-U-01 (iter1: per-task vs loop-wide iter counter ambiguity) — Disposition update

- **Disposition**: `open` (unchanged, Medium/75 — cross-layer #258 concern; not in iter3 scope)

### F-U-02 (iter1: discussion-log lifecycle) — Disposition update

- **Disposition**: `addressed` (unchanged)

## Low-confidence appendix

### F-U-LC-01 — F-U-01 defer-eligibility ruling

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Confidence**: 25 / **Severity**: Low (downgrade pending)
- **Evidence**: per the iter3 brief's out-of-scope clause + F-S-04 #258 precedent, F-U-01 is structurally a cross-layer concern (orchestration spec vs skill text) and arguably should follow F-S-04's `deferred` disposition. iter3 conservatively keeps `open` per the iter2 inheritance; user may rule defer to convert all 7 perspectives to PASS unanimously.

## Verdict

**PASS** — Fix 3 closes the leader's cold-load gap on escalation primitive; Fix 2 fully self-contained on execution side; Fix 1 self-contained on wrap-up side. F-U-01 remains `open` at Medium/75 but does not floor Usage to REVISE in iter3 since the underlying ambiguity is cross-layer + flagged for #258 deferral; per the evaluation skill's threshold rule (Medium findings do not gate `REVISE`), Usage holds PASS. **Note**: if a strict Medium-floors-REVISE reading is preferred, this verdict downshifts to REVISE; the inheritance table notes iter2 used PASS-with-Medium-open implicitly via threshold semantics. Final ruling: **PASS**.
