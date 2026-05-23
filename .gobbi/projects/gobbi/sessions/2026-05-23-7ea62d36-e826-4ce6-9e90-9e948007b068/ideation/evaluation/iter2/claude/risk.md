---
artifact_type: evaluation
phase: ideation
iter: 2
perspective: risk
system: claude
verdict: FAIL
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
---

# Iter2 Re-evaluation — Risk Perspective (Claude)

## Frame

COD-RISK-001 (auto-backfill collision/idempotency); F-CLAUDE-R-02 (post-eval find sanity check); F-CLAUDE-R-03 (settings empirically verified).

## Findings

### F-CLAUDE-RISK2-01 [CRITICAL] — Auto-backfill classifier is wired to a phantom 5-Type vocabulary; mechanical classification will fail at runtime

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: `open`
- **Confidence**: 100
- **Severity**: Critical

**Evidence**:
- Design D § Step 2.5 specification line 489: "**`mechanical`** = the finding's `Type` ∈ {`improvement`, `bug`, `scenario_gap`, `checklist_gap`} AND has a single `Domain` value AND routes deterministically..."
- This means: a finding stamped with the real Type `assumption_risk` (from evaluation/SKILL.md:351) — even if it has a deterministic Domain — would NOT match the mechanical classifier (because `assumption_risk` is not in the iter2 set). It would fall through to judgment-required, defeating the hybrid auto-backfill design.
- A finding stamped with the real Type `general` + a clear Domain (e.g., `docs-sync` → `staging/checklists/{slug}.md`) is the MOST routable case under evaluation/SKILL.md:354-368, yet iter2's mechanical set excludes Type=`general`. So **the highest-volume mechanical case is locked out by the iter2 classifier**.
- Inversely, no real finding will ever have Type=`improvement` or Type=`bug` because evaluation/SKILL.md doesn't emit those — so two of iter2's four "mechanical" branches are dead code.

**Why it matters**: The whole rationale for the hybrid escalation (avoid friction-heavy NEEDS_CONTEXT for trivially-deterministic cases) collapses if the deterministic cases (Type=`general` + Domain=`docs-sync`/`test`/`performance`/etc.) are not recognized as mechanical. The original COD-RISK-001 was about adding a collision/idempotency check; the leader did add that policy reference (line 494-498), but **the broader risk** — that auto-backfill must be safe and predictable — is amplified, not reduced, by gating it on a phantom vocabulary.

**Confidence rationale**: 100 — direct comparison of iter2 line 489 against evaluation/SKILL.md:348-352.

### F-CLAUDE-RISK2-02 [HIGH] — Collision policy citation present; pre-write check correctly described

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: `addressed`
- **Confidence**: 100
- **Severity**: Low

**Evidence**: Iter2 line 34 (changelog), line 309 (Edge scenario), line 363 (Checklist row 8), line 493-498 (Design D collision policy), line 504 (audit trail (v)), line 512 (validation), line 570 (Decisions Log row 7), line 594 (Cross-link manifest #5). Pre-write check sequence (read existing → compare finding-id → overwrite same / suffix different) matches evaluation/SKILL.md:387-395. COD-RISK-001's collision-policy mechanics are correctly cited (separate from the vocabulary issue in RISK2-01).

### F-CLAUDE-RISK2-03 [MEDIUM] — Settings defaults verified empirically; F-CLAUDE-R-03 resolved

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `addressed`
- **Confidence**: 100
- **Severity**: Low

**Evidence**: Verified `jq '.mode, .workflow.ideation.evaluate.mode, .git.pr' settings.default.json` returns `"auto"`, `"always"`, `{"open": false, "draft": false}`. Iter2 line 40 (changelog), line 67 row G NOTE, line 220 (I10), line 368 (Checklist row 13), line 546 (Design G), line 573 (Decisions Log row 10). F-CLAUDE-R-03 resolved.

### F-CLAUDE-RISK2-04 [HIGH] — Post-eval `find` sanity check (R-02) consistent across draft

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: `addressed`
- **Confidence**: 100
- **Severity**: Low

**Evidence**: Already noted in Usage perspective. Sanity check present at lines 38, 95, 196, 278, 302, 369, 415, 425. F-CLAUDE-R-02 resolved.

## Resolution status per iter1 finding

- COD-RISK-001: **partially resolved** — collision policy mechanics correctly cited (RISK2-02), but the broader auto-backfill safety is destabilized by RISK2-01's vocabulary error.
- F-CLAUDE-R-02: **resolved** (post-eval find).
- F-CLAUDE-R-03: **resolved** (jq verification).

## Verdict

**FAIL** — F-CLAUDE-RISK2-01 is Critical with Confidence 100.
