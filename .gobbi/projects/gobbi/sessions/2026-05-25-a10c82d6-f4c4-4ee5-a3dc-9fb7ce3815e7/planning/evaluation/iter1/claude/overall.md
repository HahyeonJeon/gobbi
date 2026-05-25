# Overall — Planning iter1 Evaluation (claude system)

## Stage 3: Cross-perspective synthesis

### Cross-perspective tensions

1. **Project vs. Aesthetics:** Project flags PJ-02 (W1-T3 unbounded sweep scope) as Medium; Aesthetics flags AE-01 (files-out semantic inconsistency) as Low. These are independent — no tension, both valid at their respective severities.

2. **Structure vs. Risk:** ST-01 (CWD not established in verify gates) and RK-02 (double-execution corruption) both stem from the same root: the plan was written when W0-core was not yet shipped, and the executor context was implicitly assumed to be the worktree root. ST-01 is the mechanism; RK-02 is the downstream blast. They share the same remediation: mark W0-T1/T2/T9 as done AND establish CWD explicitly.

3. **Consistency vs. Project:** CN-01 (W2-T3 enumerates wrong files) is structurally linked to PJ-01 (env-var-audit bundle decisions not split). PJ-01 is the scope gap; CN-01 is the incorrect file enumeration. Both need addressing together — they are not independent issues but the same underlying problem viewed from two angles.

### Cross-cutting concerns not owned by a single perspective

**The W0-core blind spot (PJ-03/RK-02):**
This is the highest-leverage issue. Three tasks (W0-T1, W0-T2, W0-T9) were completed before the plan was evaluated. The plan does not reflect this. Every perspective that checked these tasks found the same problem from its own angle: Project (scope gap), Risk (double-execution corruption), Usage (executor would start work that's already done). The remediation is a single atomic change: annotate these tasks as "DONE — shipped in 90c46fd."

**The env-var-audit bundle gap (PJ-01/CN-01):**
W2-T3 was designed to handle orch-improvements/decisions/ but missed env-var-audit/decisions/ (4 blocklist-violating files + 2 phase-prefix discussion/reference files). The Final Gate (W5-T3) would catch `ideation-decisions.md` but not `planning-decisions.md` or `preparation-decisions.md` (the Final Gate only checks for `ideation-decisions.md`, `iter1-*`, `concern-*`). So the Final Gate is also incomplete for the env-var-audit violations. This requires both:
- A W2 task (or W3-T1 pre-step) to split env-var-audit bundle decisions
- An expanded Final Gate to check for all blocklist patterns, not just the three currently checked

**The CWD verification gap (ST-01/US-01):**
All verify commands use relative paths, but the canonical edit path is worktree-absolute. This is a systemic issue across the entire plan's verification section. The gate suite at the bottom of the plan also uses relative paths. One fix (add `cd <worktree>/.gobbi/projects/gobbi` to the beginning of each verify block) resolves all instances.

### Karpathy failure mode check

1. **Wrong assumptions:** The plan assumes W0-T1, W0-T2, W0-T9 have not yet been executed. This assumption is false — they shipped in 90c46fd. This is the most consequential wrong assumption in the plan. FAIL — captured by PJ-03/RK-02.

2. **Overcomplexity:** The wave structure is well-motivated and proportional to the migration scope. The 6-sub-commit cluster structure for W3-T3 is appropriate for a 101-file operation. No over-engineering detected. PASS.

3. **Orthogonal edits:** W0-T8 groups three skill-doc edits (gobbi/evaluation/mistake) that are each mandated by the design but otherwise unrelated to each other. This is mild orthogonal bundling — manageable because the edits are small and the design mandates all three. The decision log (Decisions log item 7) justifies it. MARGINAL PASS — not a blocker.

4. **Imperative-over-declarative:** Most `how` fields describe the approach rather than the exact diff, which is good. The `verifies` fields describe the desired end-state property (grep matches, file exists). The one exception is W0-T1's `how`: "insert '## Principle 13' after Principle 12 using §6 markdown block verbatim" — this prescribes the exact edit location but that precision is appropriate for a standards document. PASS.

### Must-preserve list

The following strengths are solid and should be preserved in any REVISE iteration:

1. **Wave ordering rationale:** Standards-first (W0 before migration) is the correct sequencing. The design mandates this; the plan correctly translates it.

2. **W3-T3 sub-commit cluster structure:** Breaking Bundle B (101 files) into 6 per-subdir sub-commits is a well-designed resumability mechanism. The cluster sizes match the actual directory counts exactly (verified).

3. **Dependency table completeness:** The dependency table (26 rows) correctly encodes all sequencing constraints, including the non-obvious ones (W2-T2 after W1-T3, W3-T2 after W2-T3, W5-T2 after W1-T1).

4. **Conflict flags section:** Explicit enumeration of the 3 file-overlap conflicts (learnings/W1-T3+W2-T2, orch-decisions/W2-T3+W3-T2, mistakes/W1-T1+W5-T2) with resolution rationale. Well-executed.

5. **Operational Facts 1-4:** The worktree-absolute canonical path anchor, the no-double-edit rule, the git-mv-never-delete rule, and the CLAUDE.md co-update note are all correct and important. These should be kept verbatim (Fact 5 needs updating for the already-created symlink).

6. **Agent/model justification table:** The justification for opus vs sonnet assignments is evidence-based (judgment vs. mechanical tasks). Clear.

7. **W0 grep gate suite and Final Gate Suite:** The two verification suites are appropriately structured. The Final Gate Suite covers the key compliance dimensions. (Needs expansion for env-var-audit violations per PJ-01.)

### Overall findings

**OV-01 (cross-cutting):**
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** The Final Gate Suite (W5-T3) checks for blocklist patterns with:
  `find .gobbi/projects/gobbi/features -name 'ideation-decisions.md' -o -name 'iter1-*' -o -name 'concern-*'`
  This does NOT check for `planning-decisions.md`, `preparation-decisions.md`, `t1-decisions.md`, `ideation-discussion.md`, or `ideation-references.md` — all of which are blocklist violations in env-var-audit/ that the plan would re-home without splitting (per PJ-01). The Final Gate would declare success while non-compliant slugs exist in features/.
- **Why it matters:** The compliance guarantee of the Final Gate is false: blocklist violations survive into the migrated tree undetected.
- **Suggested direction:** Expand the Final Gate to check all blocklist patterns: `find .gobbi/projects/gobbi/features -name '*-decisions.*' -o -name '*-discussion.*' -o -name '*-references.*' -o -name 't[0-9]-*'` or use a loop over the blocklist patterns from §4.3.

---

## Summary of all findings across perspectives

| ID | Perspective | Type | Domain | Severity | Confidence | Summary |
|---|---|---|---|---|---|---|
| PJ-01 | Project | design_flaw | process | High | 100 | env-var-audit bundle decisions not split before re-homing; Final Gate would fail |
| PJ-02 | Project | assumption_risk | process | Medium | 75 | W1-T3 "sweep" scope unbounded |
| PJ-03 | Project | design_flaw | process | High | 100 | W0-T1/T2/T9 already committed in 90c46fd; not marked done in plan |
| ST-01 | Structure | design_flaw | process | High | 100 | Verify commands use relative paths; CWD not established |
| ST-02 | Structure | design_flaw | process | Medium | 75 | W0-T10 symlink verify loop includes real dir (templates/); silently passes broken symlinks |
| ST-03 | Structure | assumption_risk | process | Medium | 75 | W3-T3 mid-context interruption has no recovery manifest |
| AE-01 | Aesthetics | design_flaw | docs-sync | Low | 100 | files-out field has inconsistent semantics across tasks; W1-T1's files-out is wrong |
| US-01 | Usage | design_flaw | process | Medium | 75 | W3-T1 routing doesn't enumerate specific file destinations |
| US-02 | Usage | assumption_risk | process | Medium | 75 | W1-T3 sweep scope not bounded to specific directories |
| US-03 | Usage | assumption_risk | process | Medium | 75 | W3-T2..T5 missing design doc in required skills |
| CN-01 | Consistency | design_flaw | process | Medium | 75 | W2-T3 enumerates wrong files (ideation-decisions.md is in env-var-audit, not orch-feature) |
| CN-02 | Consistency | design_flaw | docs-sync | Low | 100 | W3-T3 verifies says "101 total renames" but cluster sum is 100 |
| RK-01 | Risk | assumption_risk | process | Medium | 75 | W4-T1 deletes untracked tmp/ without pre-inspection step |
| RK-02 | Risk | design_flaw | process | High | 100 | W0-T1/T2/T9 double-execution would corrupt principles/SKILL.md and overwrite rules.md |
| OV-01 | Overall | design_flaw | process | High | 100 | Final Gate Suite incomplete; misses env-var-audit blocklist violations |

**High findings (confidence ≥ 50):** PJ-01, PJ-03, ST-01, RK-02, OV-01 — all High/100. CN-01 is Medium/75.

---

## Overall verdict: REVISE

**Threshold computation:** Multiple High findings with Confidence = 100:
- PJ-03/RK-02: Already-committed W0-T1/T2/T9 listed as executable tasks → corruption risk on re-run
- PJ-01/OV-01: env-var-audit bundle decisions not split → Final Gate fails; residual non-compliant slugs
- ST-01: CWD not established → all verify gates unreliable

No Critical findings surfaced. All High findings are remediation-tractable without restructuring the wave design.

**Minimum remediation for PASS:**
1. Mark W0-T1, W0-T2, W0-T9 as "DONE — committed in 90c46fd; skip." Update Operational Fact 5 to reflect symlink already exists. (Addresses PJ-03, RK-02.)
2. Add a W2-T3b task (or expand W3-T1) to split env-var-audit/decisions/'s blocklist-violating files before W3-T1 re-homes them. (Addresses PJ-01.)
3. Establish CWD anchor in the verify blocks (or convert relative paths to worktree-absolute). (Addresses ST-01.)
4. Expand Final Gate Suite to check all blocklist patterns, not just ideation-decisions+iter1*+concern*. (Addresses OV-01.)

**Nice-to-have (Medium findings):** CN-01, ST-02, US-01/02/03, RK-01, ST-03 — all addressable in a single pass.
