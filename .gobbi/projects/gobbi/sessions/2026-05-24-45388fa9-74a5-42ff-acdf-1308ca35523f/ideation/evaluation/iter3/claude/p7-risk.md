# Perspective 7 — Risk
**Evaluator**: claude (iter3)
**Phase**: ideation
**Artifact**: draft-iter3.md — Bundle C foundation follow-ups (iter3)

## Artifact Summary + Memory reads

Same artifact as p1-project. Risk perspective: blast radius, reversibility, security surface, rollback path.

**Memory reads**: same as p1-project.md plus session-dir-placed-outside-worktree.md (read in full to assess CL-6 risk surface).

**not-applicable (Privacy / data retention)**: docs-only change; no PII surface.
**not-applicable (License / IP)**: internal docs sweep; no new deps.
**not-applicable (Cost / budget)**: no paid API or infra surface.

---

## Locked Frame (Stage 1)

**Scenario A — Blast radius bounded; downstream consumers named**
- CL-5 (11 skill files): blast radius = every agent that loads these skills. Bounded by the skills that use `{session-id}` in Path Conventions. No runtime behavioral change — M2 codifies existing manager behavior (I-6). Risk: LOW.
- CL-6 (orchestration/SKILL.md Step 1 rows 5/5.5/6): blast radius = every future session running `gobbi workflow init` in worktree-pr mode. High leverage; beneficial change. The Option B row reordering requires reviewing "row 5.5" references — artifact confirms the only live reference is within orchestration/SKILL.md itself (line 371). Risk: LOW given the bounded change surface.
- DL-7 locked Option B: no migration window, no crash window (per D-9 rationale). Lower risk than Options A or C.

**Scenario B — Rollback path identified**
- All CLs are doc edits (skill files, backlog files, design doc). Rollback = git revert the PR. No irreversible operations. Confirmed: R-8 names CL-6 row reordering as "the most one-way-door-friendly choice" among options.

**Scenario C — Stale "open question" wording creates planning risk (adversarial)**
- Status header + CL-6 TL;DR say Option A/B/C is still open. If a Planning agent believes it's open, it may: (a) request another AUQ (delays session), or (b) pick a default option itself (violates Iron Law 5 + Principle 9). Either outcome is a risk triggered by the internal inconsistency.
- Root cause: DL-7 not propagated to 5 stale locations (same as I3-P6-001).

**Scenario D — CL-5 wording locked at Ideation; Preparation cannot regress M2 clauses**
- SC-5 reference-wording spot check (line 148): ≥ 7 of 11 files must exactly match M2 clause substrings from wrap-up/SKILL.md. ≤ 4 may have polished sentence-flow. This is a reasonable guard that prevents M2 semantic drift while allowing minor polish.
- R-4 (line 411): M1 vs M2 substitution drift risk is named with SC-5 as the mitigation. ADEQUATE.

**Scenario E — Risk table completeness; R-8 and R-9 cover CL-6 risks**
- R-8 (line 415): CL-6 option choice irreversibility — the rewritten rows are the canonical procedure for every future session. Named.
- R-9 (line 416): cross-doc anchor drift if Option B renames rows — bounded to orchestration/SKILL.md only (the only live reference). Named.
- Both adequate. No new risk identified that the artifact doesn't name.

---

## Per-scenario per-check results

1. **Scenario C**: The stale "open question" wording is a mild planning risk — Planning agent may believe it needs an additional AUQ. This is the risk consequence of the inconsistency finding I3-P6-001/I3-P1-001. Not a new standalone finding here; the evidence is shared.

2. **All other scenarios**: PASS.

---

## Typed findings

No new findings beyond risk consequence of I3-P6-001 (already captured). The artifact's Risk Delta is thorough: R-1..R-9 named, sized, mitigated.

---

## Per-perspective verdict

**PASS** — No Critical or High findings. The stale DL-7 wording creates a minor planning risk, already captured as I3-P6-001. All major risks (R-1..R-9) are named with mitigations. Rollback = git revert on all CLs. No irreversible operations. Option B (DL-7 locked) is the lowest-risk option.

---

## Low-confidence appendix

None.
