---
artifact_type: evaluation
phase: ideation
iter: 2
perspective: consistency
system: claude
verdict: FAIL
session-id: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
loop: ideation
---

# Iter2 Re-evaluation — Consistency Perspective (Claude)

## Frame

Witness numbers, vocabulary, citations, and cross-link manifest — do everything that should change together actually change together?

## Findings

### F-CLAUDE-CONS2-01 [CRITICAL] — 5-Type vocabulary inconsistent with source-of-truth (cross-perspective with Structure)

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Confidence**: 100
- **Severity**: Critical

**Evidence**: Already documented as F-CLAUDE-S2-01. Iter2 draft enumerates `improvement`, `bug`, `scenario_gap`, `checklist_gap`, `design_flaw` across 8 sites; ground truth at `evaluation/SKILL.md:344-352` enumerates `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`. **Half of iter2's claimed 5 Types (improvement, bug) don't exist; half of the actual 5 Types (assumption_risk, general) are missing**.

**Why it matters from Consistency lens**: the leader claims the fix "re-spec'd against the actual 5 Types from `evaluation/SKILL.md:344-385`" (line 32) yet did not change between what they wrote pre-iter2 and the source — they invented two new tokens. The consistency contract between draft and skill source-of-truth is broken. Wrap-up Step 2.5 implementers reading this draft will write classifier code that references tokens evaluation/SKILL.md doesn't emit; the classifier silently never matches; every finding falls through to judgment-required (defeating the hybrid escalation design); or worse, the implementer follows the draft's vocabulary in a memorization template and stamps invalid `Type:` frontmatter values.

### F-CLAUDE-CONS2-02 [HIGH] — "Staging routing" section referenced but does not exist (cross-perspective with Structure)

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Confidence**: 100
- **Severity**: High

**Evidence**: Already documented as F-CLAUDE-S2-02. 4 cross-references to a section heading that does not exist in `evaluation/SKILL.md`. The actual section at line 354 is titled "Complete Domain → staging destination routing (`general` Type)" — and crucially that table applies ONLY to Type=`general`, not to `scenario_gap`/`checklist_gap`/`design_flaw`/`assumption_risk` which route differently (per evaluation/SKILL.md:380-383). Routing semantics in iter2 Design D do not match source routing semantics.

### F-CLAUDE-CONS2-03 [MEDIUM] — T-by-T witness numbers consistent across iter2

- **Type**: `general`
- **Domain**: `process`
- **Disposition**: `addressed`
- **Confidence**: 100
- **Severity**: Low

**Evidence**: T1=8, T2=13, T3=3, T4=2, T5=9, T6=2, T7=2 appears consistently at iter2 lines 30 (changelog), 126-127 (Framed Problem § Root cause #2), 142 (Impact bullet), 204 (I6), 228 (I12), 576 (Decisions Log row 13). Verified empirically. COD-CONS-001 / COD-OVERALL-001 resolved for witness-numbers.

### F-CLAUDE-CONS2-04 [LOW] — Symlink discipline consistent across 7 reference sites

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `addressed`
- **Confidence**: 100
- **Severity**: Low

**Evidence**: Lines 61, 95, 236-238, 357, 382-386, 578, 343-346 all describe the same triple-symlink discipline (source + claude file symlink + agents directory symlink).

### F-CLAUDE-CONS2-05 [MEDIUM] — Iter2 line-citation `385-393` for collision policy is one line off but acceptable

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Confidence**: 75
- **Severity**: Low

**Evidence**: Iter2 cites `evaluation/SKILL.md § Slug + collision policy` at lines 385-393. Verified the heading is at line 385; the policy body extends to ~line 395. The citation range is close (within 2 lines). Minor docs-sync drift but not material.

## Resolution status per iter1 finding

- COD-CONS-001: **resolved** for witness numbers at iter2 lines 30, 126-127, 204, 228, 576. **Not resolved** for vocabulary consistency (see CONS2-01).
- COD-STRUCT-001 (consistency angle): **NOT resolved** — cross-perspective with Structure.

## Verdict

**FAIL** — F-CLAUDE-CONS2-01 is Critical with Confidence 100.
