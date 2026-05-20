# Risk (Stage 2) — Loop Skills Batch 2 iter3 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for shared Stage 0.)

## Stage 1 — Frame lock (Risk perspective)

Risk perspective hunts for runtime-contract breaks, silent failure modes, sole-writer carveout escape hatches, and cross-task / cross-loop data-race conditions. iter1 had F-R-01 (sole-writer carveout) High + F-R-02 (cross-task staging read) Medium + F-R-03 (`evaluate.mode == 'skip'`) Low; iter2 closed F-R-01 via Fix G but left F-R-02 + F-R-03 as cross-layer deferred. iter3 must verify Fix 1 (promotion idempotence) does not reopen F-R-01 by introducing a new write race, and Fix 2 (schema cleanup) does not introduce a new silent-failure mode by leaving orphan field references.

## Stage 2 — Per-scenario checks

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-R1 | F-R-01 (sole-writer carveout) still closed post-Fix-1 | YES | The wrap-up MEMORIZATION carveout-permitting language remains removed (L288); Fix 1's idempotence wording at L207/L351 is **read-then-write-only-if-missing**, which is a stricter form of the carveout than iter2's idempotent-overwrite — it eliminates the "overwrite even when target exists" race that Codex flagged at H1. Net: F-R-01 strictly safer post-iter3 |
| S-R2 | Fix 1 introduces no new race | YES | Manager owns the pre-Planning preparation-skills promote (per preparation/SKILL.md L62 + orchestration/workflow/preparation.md L72); Wrap-up's verify-only step is read-only on the destination. Single-writer invariant preserved; no concurrent-write opportunity introduced |
| S-R3 | Fix 2 leaves no orphan field reference | YES | `grep -rn "anchor:\|acceptance:\|required skills:\|required mistakes:"` in planning/ + execution/ returns 0 hits in task-schema context. Task-schema field set is exactly 8: `{id, what, traces-to, requires, files, inputs, outputs, verifies}`. No silent producer/consumer mismatch |
| S-R4 | Fix 3 introduces no new silent-failure path | YES | The NEEDS_CONTEXT blockquote is **describing existing behavior** documented in `agents/leader.md` § Status Contract — not adding a new code path. Documentation closes a knowledge gap; runtime behavior unchanged |
| S-R5 | F-R-02 (cross-task staging read risk) status | open (unchanged, Medium/50) — does not block PASS at perspective threshold |
| S-R6 | F-R-03 (`evaluate.mode == 'skip'`) | deferred (#258) — unchanged |
| S-R7 | Codex H1 (iter2 idempotent-overwrite regression) closed | YES | The "do not re-promote unless destination missing" wording at L207 + L351 mechanically defeats H1's complaint by changing the action from "write" to "verify + optionally write" |

## Typed findings (iter3)

### F-R-01 (iter1: sole-writer carveout) — Disposition update

- **Disposition**: `addressed` (strengthened in iter3 vs. iter2; verify-then-write-only-if-missing is stricter than idempotent-overwrite)

### F-Rc-01 (Codex iter2 H1 idempotent-overwrite drift) — Disposition update

- **Disposition**: `addressed` (newly closed in iter3 via Fix 1)

### F-R-02 (iter1: cross-task staging read) — Disposition update

- **Disposition**: `open` (Medium/50, unchanged; below REVISE threshold at perspective)

### F-R-03 (iter1: evaluate.mode skip) — Disposition update

- **Disposition**: `deferred` (#258, unchanged)

## Low-confidence appendix

### F-R-LC-01 — Reconciliation path for the manifest-only routing-table row

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Confidence**: 25 / **Severity**: Low
- **Evidence**: wrap-up/SKILL.md L207 says "Wrap-up verifies presence … but does not re-promote unless the destination is missing". If verification finds the destination missing (e.g., because manager skipped the pre-Planning promote due to AskUserQuestion REVISE), wrap-up would re-promote — but the staging file might have changed in the meantime if a downstream loop re-edited it. This is a 3-step contingency edge case; logged below threshold pending real-world observation.

## Verdict

**PASS** — F-R-01 strengthened, not weakened, by Fix 1; Codex H1 regression closed; Fix 2 leaves no orphan field; Fix 3 documents existing primitive without altering runtime behavior. No new Critical/High Risk findings.
