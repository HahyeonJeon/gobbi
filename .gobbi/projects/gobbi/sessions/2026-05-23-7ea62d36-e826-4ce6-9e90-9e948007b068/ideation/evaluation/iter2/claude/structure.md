---
artifact_type: evaluation
phase: ideation
iter: 2
perspective: structure
system: claude
verdict: REVISE
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
target: sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/rawdata/draft-iter2.md
---

# Iter2 Re-evaluation — Structure Perspective (Claude)

## Frame

Re-evaluation gate: does iter2 actually resolve COD-STRUCT-001 (invalid finding-Type vocabulary) and the Claude-Structure Mediums F-CLAUDE-S-01 (inconsistent section counts) and F-CLAUDE-S-02 (cross-link manifest)?

Verification: cross-read `evaluation/SKILL.md:344-352` against iter2's claimed 5-Type set.

## Findings

### F-CLAUDE-S2-01 [CRITICAL] — COD-STRUCT-001 NOT resolved; iter2 introduces a NEW invalid 5-Type vocabulary

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: `open`
- **Confidence**: 100
- **Severity**: Critical

**Evidence**:
- Iter2 draft line 32 (Iter2 Changelog): "Finding-Type vocabulary fixed: Step 2.5 classification re-spec'd against the **actual 5 Types** from `evaluation/SKILL.md:344-385`: `improvement`, `bug`, `scenario_gap`, `checklist_gap`, `design_flaw`."
- Iter2 draft line 307 (Edge scenario), line 309 (mechanical classification), line 363 (Implementation Checklist row 8 grep validation), line 488-491 (Design D classification spec), line 512 (Design D validation method), line 570 (Decisions Log row 7), line 580 (Decisions Log row 17) all enumerate the same set: `improvement`, `bug`, `scenario_gap`, `checklist_gap`, `design_flaw`.
- **Verified ground truth** via `sed -n '344,352p' .gobbi/projects/gobbi/skills/evaluation/SKILL.md`: the 5 Types are `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`. The terms `improvement` and `bug` **do not appear anywhere** in the Type section. `grep -n "improvement\|^| \`improvement" evaluation/SKILL.md` returns zero hits.

**Why it matters**: The leader's iter2 changelog claim that COD-STRUCT-001 is resolved is false. The original Codex finding said `correction` and `decision-record` are not valid Types — the fix replaced them with two more invented terms (`improvement`, `bug`). The mechanical-vs-judgment-required classification rule in Design D § Step 2.5 (line 489) routes findings based on Type membership; if the Types don't match the source-of-truth vocabulary, every Wrap-up Step 2.5 invocation will be unable to apply the classifier. The error is propagated across at least 8 locations (changelog row, edge scenario, checklist row 8, Design D classification, Design D validation, Decisions Log rows 7 + 17, validation grep regex), so this is structural, not a typo.

**Confidence rationale**: 100 — verified by direct file read of `evaluation/SKILL.md:344-352` and grep across iter2 draft.

### F-CLAUDE-S2-02 [HIGH] — Reference to nonexistent `evaluation/SKILL.md § Staging routing` section

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Confidence**: 100
- **Severity**: High

**Evidence**:
- Iter2 references `evaluation/SKILL.md § Staging routing` at 4 sites: line 309 (Edge scenario "single `Domain` value that routes deterministically per `evaluation/SKILL.md § Staging routing`"), line 489 (Design D mechanical-classification "routes deterministically to one staging subdir per `evaluation/SKILL.md § Staging routing`"), line 504 (Design D classification audit trail "(iv) the deterministic routing source (`evaluation/SKILL.md § Finding Metadata` lines 344-385 + § Staging routing)"), line 594 (Cross-link manifest #6: "`wrap-up/SKILL.md § Step 2.5` → `evaluation/SKILL.md § Staging routing`").
- `grep -n "Staging routing" evaluation/SKILL.md` returns zero hits. The actual section heading at line 354 is "Complete Domain → staging destination routing (`general` Type)".

**Why it matters**: Cross-link manifest #6 (which the leader added in iter2 specifically to resolve F-CLAUDE-S-02) points at a section that does not exist. The Execution phase will not be able to wire this link; auditors of the manifest will be unable to verify it. The manifest itself was the answer to F-CLAUDE-S-02, so resolving the original Medium has created a Critical-adjacent High through wrong citation.

**Confidence rationale**: 100 — direct grep verification.

### F-CLAUDE-S2-03 [MEDIUM] — Section count locked at 8: PASS

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `addressed`
- **Confidence**: 100
- **Severity**: Low

**Evidence**: Iter2 line 39 (changelog), line 356 (Checklist row 1 says "**8 H2 sections**"), line 380 (Design A "**8 H2 sections** locked"), line 388 (Section outline header "Section outline (8 sections LOCKED)"), line 580 (Decisions Log row 17). All reconcile to 8. F-CLAUDE-S-01/A-02 resolved.

### F-CLAUDE-S2-04 [LOW] — Cross-link manifest present but contains the wrong-section error from S2-02

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `addressed`
- **Confidence**: 90
- **Severity**: Low

**Evidence**: Iter2 lines 583-598 add the manifest as requested by F-CLAUDE-S-02; 10 cross-links enumerated. Structurally present. Item #6 has the wrong-section problem from S2-02 (already counted there).

## Resolution status per iter1 finding

- COD-STRUCT-001: **NOT resolved** — see F-CLAUDE-S2-01 (Critical). Wrong vocabulary swapped for a different wrong vocabulary.
- F-CLAUDE-S-01 / F-CLAUDE-A-02: **resolved** at iter2 lines 39, 356, 380, 388, 580 (section count = 8 everywhere).
- F-CLAUDE-S-02: **partially resolved** — manifest added (lines 583-598) but item #6 cites a nonexistent section (see F-CLAUDE-S2-02).

## Verdict

**FAIL** — F-CLAUDE-S2-01 is Critical with Confidence 100; the iter1 Codex High (COD-STRUCT-001) is not actually resolved and the draft now propagates a new wrong vocabulary across 8 sites.
