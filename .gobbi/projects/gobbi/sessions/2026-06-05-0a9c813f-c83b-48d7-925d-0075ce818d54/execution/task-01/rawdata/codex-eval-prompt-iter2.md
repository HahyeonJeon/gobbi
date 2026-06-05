# Codex re-evaluation (iter2) — orchestration settings docs-sync remediation

You are an independent adversarial evaluator. DO NOT TRUST claims — verify by reading files and running commands. Find problems; do not fix them. This is a re-check after a REVISE remediation.

## What to verify

Two commits on this worktree branch (`chore/session-2026-06-05-0a9c813f`): `9f77f0e` (original) + `5b5a30e` (iter1-eval remediation). Your iter1 review returned REVISE with 4 findings. Confirm each is now RESOLVED, and check that the remediation introduced no NEW drift.

**Findings to confirm resolved:**
1. **COD-USAGE-001** — the per-step `skip` setting must now appear in the customize-gate enumeration in BOTH `skills/orchestration/SKILL.md` (Step 1 row 2) AND `skills/gobbi/SKILL.md` (front-door customize question ~line 89). The preparation opt-in path that references clearing `skip` via the gate must now be self-consistent.
2. **COD-CONS-001** — no stale cap literals in `skills/orchestration/SKILL.md` + `chat-mode.md` (the ASCII diagram `maxIter=2/1`, the `1 / 3` status example, the `(default 3)` loop-states note must now read `5`).
3. **COD-CONS-002** — the 8 `skills/orchestration/workflow/*.md` subdocs must read `(default 5)` (and wrap-up `default 5`), not `3`/`1`.
4. **COD-CONS-003** — `skills/orchestration/workflow/evaluation.md:53` codex evaluator default must read `gpt-5.5`, not `gpt-5`.

**Invariants that must STILL hold (not regressed by remediation):**
- Templates `settings.{auto,chat}.json` UNCHANGED from iter1 (this round was docs-only): auto all `{skip:false,max:5}`; chat preparation `{skip:true,max:0}`, others `{skip:false,max:5}`; `claude.evaluator:opus`, `codex.evaluator:gpt-5.5`, `codex.assistant:gpt-5` (still gpt-5 — correct), `claude.executor:opus`.
- `maxIterations: 0` / R1-lock path still present (coexist, not deleted).
- `codex.assistant: "gpt-5"` must remain `gpt-5` (NOT changed to gpt-5.5).

## How
1. `git diff develop..HEAD` and read the changed docs.
2. SEMANTIC sweep (the iter1 misses were variant literal forms): `grep -rnE "default[^0-9]*[0-9]|maxIter[^a-z]*[0-9]|/ ?[0-9]|gpt-5\b" skills/orchestration/ skills/gobbi/SKILL.md` and READ every hit in context — confirm every cap reads 5 (except chat preparation = 0 / skip, which is correct), no codex-evaluator default reads bare `gpt-5`, and `codex.assistant: gpt-5` is correctly untouched.
3. `jq` the templates to confirm they're unchanged. `grep -rn "maxIterations: 0|R1 lock" skills/orchestration/` non-zero.

## Output (workspace-write under this worktree)
Write `.gobbi/projects/gobbi/sessions/2026-06-05-0a9c813f-c83b-48d7-925d-0075ce818d54/execution/task-01/evaluation/iter2/codex/overall.md` with a `VERDICT: PASS|REVISE|FAIL` line, rationale, and any findings (type ∈ {scenario_gap, checklist_gap, design_flaw, assumption_risk, general}, severity, file:line). If all 4 resolved and invariants hold, PASS. Be specific with evidence.
