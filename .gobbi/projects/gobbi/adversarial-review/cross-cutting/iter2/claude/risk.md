# Risk Perspective — Cross-cutting Batch (iter2, claude)

## Stage 0 — Target Understanding

Lens: blast radius, reversibility, security surface, rollback, irreversible operations. For doc artifacts: silent contract drift, data corruption (wrong-actor project-memory writes), cost runaway, rollback difficulty. W/W/H clear. iter2 fixes 1-8 applied — Risk-relevant: Fix 1 (topology — Karpathy coverage), Fix 6 (user-question schema — manager-routing risk), Fix 8 (Interview matrix — sole-writer risk).

## Inheritance from iter1

| iter1 ID | Severity | Conf | iter2 disposition |
|---|---|---|---|
| F-R-01 (topology contradiction breaks Stage 3 Karpathy coverage) | Critical | 75 | **Mostly addressed** — Fix 1 across SKILL.md + evaluation.md + workflow/evaluation.md means a manager following the SKILL.md guidance will produce 2 agents each running all 7 perspectives + Stage 3. Stage 3 single-agent visibility is preserved. **But** template's body imperatives still encode the 1-perspective-per-agent reading that broke Stage 3 — see F-R-NEW-1. Severity downgraded from Critical (iter1) to High (iter2). |
| F-R-02 (Interview bypasses memorization gate 5 — silent corruption risk) | High | 75 | **Addressed** — Fix 8 makes Interview's bootstrap-mode exception explicit in `memorization/SKILL.md:46` with gate-5-suspended language. Mature-mode behavior also bounded. Risk shifted from "silent bypass" to "explicit, intent-documented exception" — much lower blast radius. |
| F-R-03 (concurrent-session risk on project memory) | Medium | 50 | **Persisted** — no fix in iter2 scope. `backlogs/concurrent-init-lock.md` (per gitStatus) is the parking lot. |
| F-R-04 (NEEDS_CONTEXT user-question schema risk) | High | 75 | **Addressed** — Fix 6 ships YAML schema + manager dispatch entry. Deterministic routing now anchored on schema presence/absence. |
| F-R-05 (security preflight — not a finding) | — | — | Re-verified clean. **Not a finding.** |
| F-R-06 (rollback path — not a finding) | — | — | Re-verified. Supersession contract intact. **Not a finding.** |

## Stage 1 — Locked Frame

Inherited from iter1 (S1-S6). New scenarios:

**S7. (iter2 adversarial — Codex-flagged) Fix 1's residual ambiguity in templates/evaluator.md does NOT silently break Stage 3**
- [ ] If an evaluator reads "stay in your assigned perspective" and writes 1 perspective file, what does Stage 3 input look like?
- [ ] Manager artifact-completeness check would catch the missing 6 files? Where is that gate?
- [ ] Recovery path from "evaluator returned 1 file instead of 7+Overall"

**S8. (iter2 adversarial) Fix 8's gate-5 suspension is bounded to Interview bootstrap and cannot leak**
- [ ] Mature-mode interview restores gate 5
- [ ] No way for loop-MEMORIZATION to accidentally inherit the bootstrap exception

## Stage 2 — Findings

### F-R-01-iter2 — PARTIALLY ADDRESSED — Stage 3 Karpathy coverage risk residual via template body

**Type**: `design_flaw` / **Domain**: `process` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: The SKILL.md-level contract (`delegation/SKILL.md:47,214,294` + `evaluation/SKILL.md:9,234`) is unambiguous: 2 agents, each runs all 7 + Stage 3. Stage 3 single-agent visibility is preserved when this contract is followed. **But** `delegation/templates/evaluator.md:82-88` body imperatives say "stay in your assigned perspective" / "the perspective's checklist". If a fresh evaluator follows the template literally, it produces 1 perspective file and never reaches Stage 3 (which requires "all seven per-perspective passes" visible to one agent per `evaluation/SKILL.md:266`).

Blast-radius branches:
1. Manager spawns 2 agents per the SKILL.md guidance, each reads the template and tries to "stay in assigned perspective" — gets confused, NEEDS_CONTEXT, manager unblocks. Cost: 1 retry round, no data corruption.
2. Manager spawns 2 agents, each writes 1 perspective file then reports DONE per "your perspective" framing → manager's artifact-completeness check catches the missing 6 files → REVISE → retry. Cost: 1 lost iter.
3. Manager spawns 2 agents, each writes 7 perspective files but applies "stay in your perspective" within each, suppressing cross-perspective synthesis at Stage 3. Cost: silent Karpathy-coverage degradation — **the iter1 F-R-01 failure mode persists in a softer form**.

Branch 3 is the blast-radius residual. Severity downgraded from Critical (iter1: every evaluation broken) to High (iter2: Stage 3 quality silently degraded for evaluators who try to honor both the wire format and the body imperatives).

**Why it matters**: Stage 3 is the ONLY stage that catches Karpathy-4 failure modes (`evaluation/SKILL.md:276`). A partial-sweep regression in the doc the evaluator subagent loads means Karpathy coverage is at the mercy of the evaluator's ability to reconcile the template's internal contradiction. Risk lens: this is exactly the kind of silent-degradation scenario contract-consistency exists to prevent.

### F-R-02-iter2 — RESOLVED — Interview bypass explicit and gated

**Type**: `assumption_risk` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `memorization/SKILL.md:46` Interview bootstrap exception row is explicit: WRITE permission with gate-5-suspension, scoped to bootstrap mode only. Mature-mode reruns route through staging + Wrap-up promotion (gate 5 restored). Cross-doc check: `interview/SKILL.md:24-37` Memory Access Matrix Bootstrap/Mature split mirrors the same contract. Three-doc sync (memorization ↔ interview ↔ orchestration row 7) provides triangulation. Risk shifted from "silent bypass with no mechanical check" to "explicit, bounded, documented exception".

Note: the assumption that "user confirmation at each wave's intermediate summary" (`interview/SKILL.md:37`) is sufficient mechanical-check substitute is preserved from iter1 — this is intent-gated, not mechanically gated. The intent gate is now documented; this is a meaningful improvement.

### F-R-04-iter2 — RESOLVED — User-question schema + manager dispatch defined

**Type**: `assumption_risk` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `delegation/SKILL.md:160-170` YAML schema + L193 manager dispatch routing. Determinism failure mode (subagent emits free-form prose under NEEDS_CONTEXT and manager can't parse) is now gated by schema presence. Risk of "manager surfaces malformed AskUserQuestion to user" reduced to "manager surfaces structured AskUserQuestion built from the validated schema".

### F-R-03 (carry forward, persisted) — Concurrent-session project-memory write risk

Same as iter1 F-R-03. Persisted; tracked in `backlogs/concurrent-init-lock.md`.

### F-R-NEW-1 — Stage 3 silent-degradation via template partial sweep

**Type**: `design_flaw` / **Domain**: `process` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

Same root as F-R-01-iter2. Filed separately as a NEW finding because the iter2 partial-sweep is the specific iter2 regression Codex flagged. iter1 had the cross-doc contradiction; iter2 has the within-file contradiction. Different failure modes, both at Stage 3 coverage. The blast radius is now bounded by the SKILL.md-level corrective signals but the template-level residual remains a real degradation vector.

### F-R-NEW-2 — Bootstrap detection criteria are binary; sparse-but-not-empty projects fall through

**Type**: `assumption_risk` / **Domain**: `process` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: `orchestration/SKILL.md:83` row 7 bootstrap detection: "If project memory is empty (no README.md, no design/, no features/ directory with content)". A project with stub `README.md` + empty `design/` directory + 0 features fails the "empty" test but is functionally unbootstrapped. Interview is auto-skipped; user is never asked. The manager proceeds to Ideation with insufficient context.

Risk angle: the bootstrap gate's emptiness threshold is too narrow. Manager will operate on sparse project memory and either request the user to populate ad-hoc (no SOP) or proceed with insufficient context — either branch elevates downstream rework probability. Lower-confidence finding (50) because the workflow may degrade gracefully via Ideation's own prompting; recording because Risk perspective must price the assumption.

## Stage 2 Verdict

**REVISE** — F-R-01-iter2 (High conf 75) + F-R-NEW-1 (High conf 75; same root). iter1 was FAIL (Critical F-R-01 conf 75). Fix 1's SKILL.md sweep + Fix 8's matrix mirror are substantial — iter2 moves Critical → High, FAIL → REVISE. The residual template-body partial sweep keeps Risk at REVISE because Stage 3 Karpathy coverage degradation is a real vector even if its blast radius is now bounded.

## Low-confidence appendix

- LC-R-1-iter2 (conf 25, Low): Same as iter1 LC-R-1 (no automated mistake-promotion lint). Defer.
- LC-R-2-iter2 (conf 25, Low): No explicit "evaluator returned wrong artifact shape" recovery procedure in `orchestration/workflow/evaluation.md` — would close S7's branch-2 recovery path. Polish.
