# T4 iter1 — Project perspective (claude)

**Perspective:** Project — adherence to gobbi project rules, idea-doc contract, and locked decisions.
**Target:** `.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` at session-2026-05-28-8eed14fb worktree.
**Baseline:** `git show 87563f3:...settings.default.json` (PRE_T4_REV).

## Stage 0 — Target understanding

The artifact is a bundled-shape `settings.default.json`: two top-level mode-keyed blocks (`chat`, `auto`), each a full settings tree (mode + workflow{ideation,preparation,planning,execution,wrap-up} + models + git), plus root `schemaVersion: 1`. Replaces the single-default-set baseline. Spec source: Idea §5 (lines 310–342) — exhaustive Chat-vs-Auto defaults table — and lock R1 (`preparation.maxIterations: 0` ⇒ Skipped at loop entry).

## Stage 1 — Frame

Scenarios:
1. JSON validates.
2. Top-level shape matches "bundled" (chat + auto + schemaVersion).
3. Per-mode `mode` field carries dispatch key.
4. R1 lock honored — Chat preparation.maxIterations exactly `0`.
5. Auto preparation.maxIterations exactly `3` (brief lock).
6. `evaluate.mode = "always"` on every loop in both modes (Idea §5 rows 319/322/325/328/331).
7. discuss.mode matrix matches Idea §5: Chat all `user`; Auto `user` for ideation+preparation, `agent` for planning+execution+wrap-up.
8. maxIterations matrix matches Idea §5: Chat (2/0/2/2/1), Auto (3/3/3/3/1).
9. models.* and git.* byte-for-byte identical to PRE_T4 baseline (Finding #8 collateral protection).

## Stage 2 — Evidence

| # | Scenario | Evidence | Verdict |
|---|---|---|---|
| 1 | `jq . settings.default.json > /dev/null` exit 0 | confirmed | PASS |
| 2 | Top-level keys = `{auto, chat, schemaVersion}` | `jq -r 'keys[]'` | PASS |
| 3 | `.chat.mode == "chat"` and `.auto.mode == "auto"` | jq direct | PASS |
| 4 | `.chat.workflow.preparation.maxIterations == 0` | jq direct | PASS |
| 5 | `.auto.workflow.preparation.maxIterations == 3` | jq direct | PASS |
| 6 | All 10 `evaluate.mode` = `"always"` (5 chat + 5 auto) | loop-checked | PASS |
| 7 | Chat discuss.mode: all 5 = `user`; Auto: user/user/agent/agent/agent | loop-checked, matches Idea §5 | PASS |
| 8 | Chat maxIterations (2/0/2/2/1); Auto (3/3/3/3/1) | matches §5 lines 320/323/326/329/332 | PASS |
| 9 | models.* MD5 identical: chat = auto = baseline (`09aa9b8f8c1cbaebc8c791bee53d02d8`); git.* MD5 = `3600f9fe7dd5c31f2618c8d74f99233a` across all three | diff IDENTICAL | PASS |

`schemaVersion: 1` at root preserved. No new settings fields introduced — Idea §5 lock honored ("no new settings field; `0 → Skipped` mapped at state-machine layer").

## Findings

None within Project scope. Implementation follows Idea §5 verbatim.

## Must-preserve

- The bundled top-level shape (chat + auto sibling under root with `schemaVersion`) — this is the dispatch shape the resolver will consume.
- `models.*` identical across chat / auto / baseline — Finding #8 deferral protected.
- `git.*` identical across chat / auto / baseline.
- Chat preparation.maxIterations literal `0` (R1 trigger).

## Verdict

**PASS**
