# Project (Stage 0 + Stage 2) — Loop Skills Batch 2 iter3 (Claude)

## Stage 0 — Artifact Summary + W/W/H

**Artifact**: iter3 surgical fix batch on `.gobbi/projects/gobbi/skills/` — 3 targeted edits addressing all remaining iter2 REVISE drivers + Codex regressions.

**What**: (1) Fix 1 — promotion idempotence at preparation/workflow/preparation.md L64/L72 + wrap-up/SKILL.md L207 + reconciliation L351 ("verify presence; do not re-promote unless destination missing"). (2) Fix 2 — canonical YAML 8-field schema at execution/SKILL.md L93 with `required skills`/`required mistakes` relocated to Sub-step D assignment metadata; planning/evaluation.md L88-91 labels effort as "evaluator-internal heuristic — not a task schema field". (3) Fix 3 — NEEDS_CONTEXT asymmetry closure: ideation/SKILL.md L58-60, preparation/SKILL.md L64-66, planning/SKILL.md L87-89 each gain a blockquote principle stating DISCUSSION is manager-direct while NEEDS_CONTEXT is the WORK-phase subagent escalation primitive.

**Why**: iter2 was REVISE-near-PASS (10/13 iter1 findings addressed, no regressions per Claude); Codex flagged 2 regressions (H1 idempotent-overwrite drift + downstream H from Fix C). Fix 3 also closes the persistent Structure F-S-02 / Consistency F-C-04 / overall F-O-03 NEEDS_CONTEXT asymmetry that was blocking iter2 PASS.

**How**: Targeted surgical edits in already-known locations (no structural rewrites); verifiable via the 5 Stage 0 grep queries supplied in the brief, all of which returned the expected shape.

**W/W/H clarity**: All three axes clear, specific, and locatable in the diff. No unevaluable findings.

## Memory reads

- iter2 Claude perspectives × 7 + overall.md (inheritance)
- skills/{ideation,preparation,planning,execution,wrap-up}/SKILL.md
- skills/evaluation/SKILL.md (verdict thresholds)
- skills/wrap-up/SKILL.md (frontmatter, L207 routing row, L351 principle)
- skills/orchestration/workflow/preparation.md (L64/L72)
- skills/planning/evaluation.md L88-91

## Stage 1 — Frame lock (Project perspective)

The Project perspective verifies that **declared design contracts in `.claude/CLAUDE.md` and the principles skill are honored by the skills under review**. iter1 surfaced F-P-01 (Planning lacked task schema definition) + F-P-02 (Ideation lacked FAIL verdict) — both Critical contract gaps. iter2 closed both. iter3 must verify nothing in the 3 surgical fixes regressed the closure.

## Stage 2 — Per-scenario checks

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-P1 | F-P-01 (canonical YAML schema present) still PASS | YES | planning/SKILL.md L51 + L188 + L201 + L323-328 retain canonical 8-field schema; execution/SKILL.md L93 mirrors it exactly. `grep "traces-to\|requires:\|verifies:\|outputs:"` returns 8 hits on the 8 expected fields with no drift |
| S-P2 | F-P-02 (Ideation FAIL verdict) still PASS | YES | ideation/SKILL.md L368, L370 ("FAIL semantics for Ideation") unchanged from iter2; the 3-option escalation (revise / abort / accept-with-deferral) preserved |
| S-P3 | Fix 2 — required-skills/mistakes off task schema | YES | `grep -rn "anchor:\|acceptance:\|required skills:\|required mistakes:"` against planning/ + execution/ returns 0 hits in task-schema context. Task-schema mentions of "required skills" / "required mistakes" appear only at planning/SKILL.md L113, L120, L235, L249, L250, L257, L493, L494 — all in Sub-step D agent-assignment context, explicitly labeled "agent assignment" / "Sub-step D" / "per task's agent assignment" |
| S-P4 | Fix 2 — `effort` declared non-task-schema | YES | planning/evaluation.md L88: "Effort estimate realism *(evaluator-internal heuristic — not a task schema field; `effort` does not appear in the canonical task YAML)*". Closes the iter2 Codex H regression cleanly |
| S-P5 | Fix 3 — NEEDS_CONTEXT primitive symmetric | YES | All 5 loops contain NEEDS_CONTEXT references (ideation=2, preparation=2, planning=2, execution=4, wrap-up=10). Leader-led loops correctly differentiate manager-direct DISCUSSION from subagent WORK-phase NEEDS_CONTEXT, citing `discussion/SKILL.md` and `agents/leader.md` |

## Typed findings (iter3)

### F-P-01 (iter1) — Disposition update

- **Disposition**: `addressed` (unchanged from iter2; verified no regression)

### F-P-02 (iter1) — Disposition update

- **Disposition**: `addressed` (unchanged from iter2; verified no regression)

### F-Pc-01 (Codex iter2 H regression on Fix C downstream) — Disposition update

- **Disposition**: `addressed` (new in iter3)
- **Evidence**: planning/evaluation.md L88-91 disclaims `effort` as evaluator-internal; execution/SKILL.md L93 explicitly says "assignment metadata, not task YAML fields" for required-skills/mistakes. The downstream contract surface (8-field task YAML) is now consistent across producer + consumer with no orphan fields.

### F-Pc-02 (Codex iter2 H1 promotion idempotence regression) — Disposition update

- **Disposition**: `addressed` (new in iter3)
- **Evidence**: wrap-up/SKILL.md L207 (routing row): "Wrap-up verifies presence and records in `promotion-manifest.md` but does not re-promote unless the destination is missing"; L351 principle: "At Wrap-up, verify the destination is present and record in `promotion-manifest.md`; do not re-promote unless the destination file is missing." Two-site consistency; no idempotent-overwrite drift.

## Low-confidence appendix

(none)

## Verdict

**PASS** — Critical/High Project-perspective findings from iter1 remain `addressed`; both Codex-flagged iter2 regressions (Fix C downstream + Fix E idempotence drift) closed by Fixes 2 + 1 respectively. No new Critical/High findings discovered in iter3 sweep.
