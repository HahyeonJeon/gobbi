# Risk Perspective — Cross-cutting Batch (iter3, claude)

## Stage 0 — Target Understanding

Lens unchanged: blast radius, reversibility, security surface, rollback, irreversible operations. For doc artifacts: silent contract drift, data corruption (wrong-actor project-memory writes), cost runaway, rollback difficulty. W/W/H clear. iter3 fixes 1-4; Risk-relevant: Fix 1 (Stage 3 Karpathy-coverage degradation closure), Fix 4 (sparse-bootstrap silent-skip closure).

## Inheritance from iter2

| iter2 ID | Sev | Conf | iter3 disposition |
|---|---|---|---|
| F-R-01-iter2 (Stage 3 Karpathy coverage residual) | High | 75 | **Addressed** — Fix 1 closes the template-body residual. With all evaluator.md sites now saying "all 7 perspectives + Stage 3 Overall sequentially within this single agent", the Stage 3 single-agent-visibility prerequisite (`evaluation/SKILL.md:266`) is no longer at risk from template-side ambiguity. |
| F-R-02 (Interview bypass) | — | 100 | **Carry — addressed iter2** |
| F-R-03 (concurrent-session) | Medium | 50 | **Persisted** — tracked in `backlogs/concurrent-init-lock.md`. |
| F-R-04 (NEEDS_CONTEXT schema) | — | 100 | **Carry — addressed iter2** |
| F-R-NEW-1 (Stage 3 silent-degradation from template partial sweep) | High | 75 | **Addressed** — same Fix 1 evidence. iter2's Branch 3 silent-degradation scenario is closed: no evaluator can read the template top-down and conclude "stay in 1 perspective" anymore. |
| F-R-NEW-2 (Bootstrap detection binary) | Medium | 50 | **Addressed** — Fix 4 introduces the Sparse tier between Empty and Mature, with explicit AskUserQuestion routing. The "silent skip for stub README + 0 features" branch is closed. |

## Stage 1 — Locked Frame

Inherited from iter2 (S1-S8). New iter3 regression-check scenarios:

**S9. (iter3 adversarial) Fix 1's evaluator.md sweep is risk-complete — no path produces a 1-perspective-file evaluator**
- [ ] Template top-to-bottom reading converges on "all 7 in one agent"
- [ ] Manager artifact-completeness check (any) would catch a 1-file return
- [ ] No interpretation branch where Stage 3 input is undersampled

**S10. (iter3 adversarial) Fix 4's 3-tier detection has no fall-through gap**
- [ ] Every possible project-memory state maps to exactly one tier
- [ ] No tier-boundary case can be both Empty and Sparse, or both Sparse and Mature
- [ ] Decline-path branches all terminate at well-defined next-steps

## Stage 2 — Findings

### F-R-01-iter3 — RESOLVED — Stage 3 Karpathy coverage no longer at template-side risk

**Type**: `design_flaw` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: With Fix 1, all 4 doc sites on evaluator topology now read identically. The Stage 3 single-agent-visibility requirement at `evaluation/SKILL.md:266` is no longer threatened by template ambiguity. Risk-branch enumeration:

- **iter2 Branch 1** (manager spawns 2, each NEEDS_CONTEXT due to template confusion) — closed: template is unambiguous.
- **iter2 Branch 2** (agents write 1 perspective file, manager catches missing 6) — closed: § Your Job L88-89 explicitly says "Produce one output file per perspective + `overall.md` for Stage 3" so the agent's own contract requires all 8 files.
- **iter2 Branch 3** (silent Karpathy-degradation via misapplied perspective discipline) — closed: § Constraints / Scope L82-84 names the discipline "System discipline (claude or codex)" not "Perspective discipline" — the bias-isolation lens is system-not-perspective.

All three failure branches eliminated.

### F-R-NEW-2-iter3 — RESOLVED — Bootstrap detection no longer silently skips sparse projects

**Type**: `assumption_risk` / **Domain**: `process` / **Confidence**: 100 / **Severity**: — / **Disposition**: addressed

**Evidence**: `orchestration/SKILL.md:90` Sparse tier condition "Has `README.md` OR a skeleton `design/` directory, but no `features/` directory with content" with explicit manager action "Surface AskUserQuestion: 'Your project memory looks sparse ...'". The stub-README-only project that iter2 flagged as a silent-skip risk now triggers the Sparse-tier user question. The "manager operates on insufficient context with no SOP for asking" branch is closed.

Note: `interview/SKILL.md:31` adds the bootstrap-mode treatment for the Sparse tier: "treat as empty for write-access purposes; direct writes apply". This composes with `memorization/SKILL.md:46` gate-5 suspension cleanly because both Empty and Sparse share bootstrap-mode write access. Mature mode restores gate-5. Three-doc sync intact.

### F-R-03 (carry forward, persisted) — Concurrent-session project-memory write risk

Same as iter1/iter2. Tracked in backlog; not blocker.

### F-R-NEW-3 — 3-tier detection adds 1 new edge case at the Empty↔Sparse boundary

**Type**: `assumption_risk` / **Domain**: `process` / **Confidence**: 25 / **Severity**: Low / **Disposition**: open

**Evidence**: `orchestration/SKILL.md:89` Empty: "No README.md, no `design/`, no `features/` directory with content". `orchestration/SKILL.md:90` Sparse: "Has `README.md` OR a skeleton `design/` directory, but no `features/` directory with content". The OR in Sparse means a project with `features/` but with empty content qualifies as Empty (because "no `features/` directory with content" is in both definitions). Composition with the Mature criterion ("Has `features/` directory with content") is sound, but a project with an empty `features/` dir but a real `README.md` qualifies as Sparse via the OR — correct routing. Edge case fully covered; recording at conf 25 because the 3-tier composition was visibly thought through. **Not a blocker** — positive close-reading.

## Stage 2 Verdict

**PASS** — F-R-01-iter2 + F-R-NEW-1 (both iter2 Highs at conf 75) cleanly resolved by Fix 1. F-R-NEW-2 (iter2 Medium conf 50) cleanly resolved by Fix 4. F-R-03 persisted as parking-lot deferral (below REVISE). F-R-NEW-3 close-reading Low conf 25 — no real risk. Per threshold rules — PASS.

Risk lens: iter1 was FAIL (Critical F-R-01 conf 75), iter2 REVISE (Highs from template residual), iter3 PASS (Highs closed by template sweep). The Karpathy-coverage degradation vector is closed at every layer Risk priced.

## Low-confidence appendix

- LC-R-1-iter3 (conf 25, Low): Same as iter1/iter2 (mistake-promotion lint). Defer.
- LC-R-2-iter3 (conf 25, Low): No explicit "evaluator returned wrong artifact shape" recovery procedure in `orchestration/workflow/evaluation.md`. Same as iter2 LC-R-2. Polish; the wire-format STATUS contract gives the manager enough signal to bounce.
