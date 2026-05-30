# T4 iter1 — Consistency perspective (claude)

**Perspective:** Consistency — value parity across modes for invariants; cross-document parity vs Idea §5 row-by-row.

## Stage 0 — Target understanding

Idea §5 specifies an exhaustive 17-row defaults table. T4 must implement each row exactly. "Invariants" (rows that say "identical" or "unchanged" in §5) must hold byte-for-byte across chat/auto and against the pre-T4 baseline.

## Stage 1 — Frame

Row-by-row Idea §5 mapping:

| §5 row | Chat expected | Auto expected | Implementation |
|---|---|---|---|
| schemaVersion | 1 | 1 | root = 1 (PASS) |
| mode | "chat" | "auto" | PASS / PASS |
| ideation.discuss.mode | user | user | PASS / PASS |
| ideation.evaluate.mode | always | always | PASS / PASS |
| ideation.maxIterations | 2 | 3 | PASS / PASS |
| preparation.discuss.mode | user | user | PASS / PASS |
| preparation.evaluate.mode | always | always | PASS / PASS |
| preparation.maxIterations | 0 (R1) | 3 | PASS / PASS |
| planning.discuss.mode | user | agent | PASS / PASS |
| planning.evaluate.mode | always | always | PASS / PASS |
| planning.maxIterations | 2 | 3 | PASS / PASS |
| execution.discuss.mode | user | agent | PASS / PASS |
| execution.evaluate.mode | always | always | PASS / PASS |
| execution.maxIterations | 2 | 3 | PASS / PASS |
| wrap-up.discuss.mode | user | agent | PASS / PASS |
| wrap-up.evaluate.mode | always | always | PASS / PASS |
| wrap-up.maxIterations | 1 | 1 | PASS / PASS |
| models.* | unchanged | unchanged | MD5 identity to baseline — PASS |
| git.* | unchanged | unchanged | MD5 identity to baseline — PASS |

## Stage 2 — Evidence

19/19 rows match Idea §5 exactly. `models.*` MD5 `09aa9b8f8c1cbaebc8c791bee53d02d8` matches across chat, auto, and PRE_T4 baseline. `git.*` MD5 `3600f9fe7dd5c31f2618c8d74f99233a` matches across all three. No drift.

## Findings

None. Full row-by-row parity achieved.

**Note (Confidence 75, Severity Low):** A future change to `models.*` or `git.*` upstream will require dual-write to both subtrees. No mechanism in the file prevents drift between `chat.models` and `auto.models`. The Finding #8 backlog covers the canonical-source question separately.

## Must-preserve

- Row-by-row §5 parity — any future settings.default.json edit must re-verify all 19 rows.
- MD5 parity between `chat.models` and `auto.models` until Finding #8 is closed.

## Verdict

**PASS**
