# Structure Perspective — Cross-cutting Batch (iter2, claude)

## Stage 0 — Target Understanding

W/W/H clear. Lens unchanged from iter1: organization, decomposition, dependencies, testability, maintainability across 7 skills.

## Inheritance from iter1

| iter1 ID | Severity | Conf | iter2 disposition |
|---|---|---|---|
| F-S-01 (broken delegation.md links + wrong anchor) | High | 100 | **Addressed** — Fix 5 swept 5 occurrences in orchestration/workflow/*.md to canonical `delegation/SKILL.md#what-every-delegation-prompt-contains`. Verified: 0 hits of old anchor or bare `delegation.md#`. |
| F-S-02 (evaluator spawn topology contradiction) | Critical | 100 | **Addressed** — Fix 1 + Fix 4. `delegation/SKILL.md:47,294` now reads "Spawn exactly 2 in parallel — one per system. Each evaluator handles all 7 perspectives + Overall sequentially." `templates/evaluator.md:128` says "all 7 perspectives + Overall complete". `orchestration/workflow/evaluation.md:42-49` consistent. `evaluation/SKILL.md:9,234` consistent. Anti-pattern callout at `delegation/SKILL.md:214` explicit. |
| F-S-03 (`mistake` skill out of batch scope) | Medium | 50 | **Persisted** — informational only; not on iter2 fix list. |
| F-S-04 (evaluation/SKILL.md 551-line bloat) | Low | — | Disputed per #258; deferred. |

## Stage 1 — Locked Frame

Inherited from iter1 (S1-S5). New scenarios for iter2 regression-vigilance:

**S6. (iter2 adversarial) Fix 1's sibling docs are clean — no stale single-perspective imperatives**
- [ ] delegation/templates/{leader,executor,evaluator,assistant}.md
- [ ] evaluation/SKILL.md
- [ ] orchestration/workflow/evaluation.md
- [ ] orchestration/SKILL.md
- [ ] research/SKILL.md, interview/SKILL.md, memorization/SKILL.md

**S7. (iter2 adversarial) Fix 3 (staging is assistant-owned PASS-only) is consistent across the broader skill set**
- [ ] research/SKILL.md says staging WORK-write is forbidden
- [ ] memorization/SKILL.md says staging WRITE is PASS-only assistant
- [ ] Loop skills (out of batch) do not contradict — verify if anything in scope cross-references them

## Stage 2 — Findings

### F-S-01-iter2 — RESOLVED — Cross-doc links sweep clean

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `grep -rn "what-every-delegation-prompt-needs\|delegation\.md#" .gobbi/projects/gobbi/skills/orchestration/` returns 0 hits. All 5 occurrences in workflow/{ideation,preparation,planning,execution,wrap-up}.md replaced with the canonical link `../delegation/SKILL.md#what-every-delegation-prompt-contains` (verified at orchestration/SKILL.md:97,115,133,151,169).

### F-S-02-iter2 — RESOLVED — Evaluator spawn topology unified

**Type**: `design_flaw` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: All three load-bearing docs now agree on the dual-system topology:
- `delegation/SKILL.md:47`: "Spawn exactly 2 in parallel — one per system (Claude + Codex). Each evaluator handles all 7 perspectives + Overall sequentially"
- `delegation/SKILL.md:214` Anti-pattern: explicit prohibition with worked rationale
- `delegation/SKILL.md:294` Agent Roster: same contract
- `delegation/templates/evaluator.md:128`: "DONE — all 7 perspectives + Overall complete"
- `orchestration/workflow/evaluation.md:42-49`: "exactly two evaluator agents in parallel — one per system ... handles all four stages ... sequentially"
- `evaluation/SKILL.md:9`: "Per-Perspective Sequential Evaluation across seven perspectives"
- `evaluation/SKILL.md:234`: "Iterate the seven perspectives in this order: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk"

The single-perspective slot pattern in the evaluator template (iter1 F-S-02 evidence point) is no longer load-bearing because the wire format (Fix 4) now ends with `STATUS:/VERDICT:/ARTIFACT:` and the report covers all 7 perspectives, not one. **Critical regression eliminated.**

### F-S-NEW-1 — Fix 3's "staging is assistant-owned, PASS-only" contradicts the 5 loop skills

**Type**: `design_flaw` / **Domain**: `docs-sync` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: `research/SKILL.md:31` (Fix 3) asserts: "On PASS — the assistant (MEMORIZATION phase) reads `rawdata/research/*.md`, extracts confirmed external insights, and stages them at `sessions/{date}-{session-id}/{loop}/staging/references/{slug}.md` ... **This keeps staging as an assistant-owned, PASS-only surface consistent with the memorization contract**." `research/SKILL.md:168`: "MUST never write to `staging/` during WORK — staging is an assistant-owned, PASS-only surface."

But the 5 loop skills (out of batch but cross-referenced by this batch) grant the **leader** WRITE to staging during WORK:
- `ideation/SKILL.md:27`: "Session memory — own loop staging — READ + WRITE (WORK only)"
- `preparation/SKILL.md:26`: same
- `planning/SKILL.md:31`: same
- `execution/SKILL.md:31`: same

`orchestration/workflow/ideation.md:67` says explicitly "The leader's job in WORK is to ... stage reference + backlog artifacts under `sessions/.../ideation/staging/`."

Fix 3's universal claim that staging is assistant-only-PASS is true **for research's surface only**. The universal framing (especially `research/SKILL.md:168` "MUST never write to `staging/` during WORK ... assistant-owned, PASS-only surface") reads as a workflow-wide invariant — and contradicts 4 in-scope-referenced loops.

**Why it matters**: A fresh leader reading research/SKILL.md will conclude all staging writes during WORK are forbidden — and refuse to stage approved decisions in Ideation. The fix needed scope-limiting language: "research's external-reference staging is assistant-owned-PASS-only — other staging surfaces (decisions, scenarios, design) remain leader-writable during WORK per the calling loop's skill."

### F-S-03 (carry forward, low-confidence) — `mistake` skill still out of batch

Same as iter1 F-S-03. Marking as **not a finding in iter2** — informational.

## Stage 2 Verdict

**REVISE** — F-S-NEW-1 (High, conf 75) is a partial-sweep regression introduced by Fix 3. Fix 1 + Fix 5 cleanly resolved iter1's Critical + High. No old findings persist as blockers. New finding requires a scope-limiting clause in research/SKILL.md (or a cross-reference table).

## Low-confidence appendix

- LC-S-1 (conf 25, Low): Same as iter1 LC-S-1 (evaluation/SKILL.md size). Defer.
- LC-S-2-iter2 (conf 25, Low): The `STATUS: NEEDS_CONTEXT` example in `delegation/SKILL.md:138-154` includes a 10-line `user-question:` block as part of the example — could be split into its own example for clarity. Polish.
