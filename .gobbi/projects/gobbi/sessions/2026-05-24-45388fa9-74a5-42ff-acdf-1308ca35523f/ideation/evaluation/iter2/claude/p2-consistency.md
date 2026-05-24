# Perspective 2 — Consistency
**Evaluator**: claude (iter2)
**Phase**: ideation
**Artifact**: draft-iter2.md — Bundle C foundation follow-ups

## Artifact Summary + Memory reads

(Same artifact summary as p1-project.md; see that file. Memory reads identical.)

---

## Locked Frame (Stage 1)

**Scenario A — Scope Contract, Framed Problem, and Design section describe the same problem**
- [YES] Scope Contract goal: "Land 5 cohering follow-ups" — matches Framed Problem root cause ("deferred-witness debt that has come due") and Design section (D-1..D-7 each trace to a specific CL).
- [YES] Scope Contract phrasing is stable across all sections: "session-foundations-bundle-c" used consistently; the 5 CL labels (CL-1..CL-5) are consistent throughout.

**Scenario B — Every directional design decision is consistent with cited research insights**
- [YES] D-1 (skill body sourcing) cites I-1, E-1, E-2 — all exist in Research Insights. Verified: I-1 = N=2 witnesses; E-1 = Anthropic skill docs; E-2 = printf %q Bash-specific.
- [YES] D-4 revised (f-risk-01 absorption + M2) cites I-3, I-6, DL-4, DL-5 — all exist.
- [YES] D-5 revised (Theme β per DL-1) cites DL-1, I-4. DL-1 exists; I-4 exists.
- [YES] D-6 revised (task count cap) cites I-5. I-5 exists (executor-mirror-path + manager-context-overflow mistakes).
- [YES] D-7 (CL-3/CL-5 coordination on mistake/SKILL.md) cites § Per-Deliverable Scope-Bound Table flag. Consistent.

**Scenario C — Implementation Checklist items match the CL-1..CL-5 enumeration**
- [YES] CK-1 maps to CL-1 (close f-struct-01).
- [YES] CK-2 + CK-3 map to CL-2 (stage + promote skill — two steps explicitly captured).
- [YES] CK-4 + CK-5 map to CL-3 (two edits in CL-3).
- [YES] CK-6 maps to CL-4.
- [YES] CK-7 + CK-8 map to CL-5 (docs sweep + backlog update).
- [YES] CK-9 maps to bundle-wide PR witness requirement (SC-7).

**Scenario D — Glossary terms used consistently across sections (no synonym drift)**
- [YES] "CL-1..CL-5" is stable. No mixing with "item-1..item-5" or prior numbering from iter1.
- [YES] "M2" is used consistently throughout; never conflated with M1 or M3.
- [YES] "gobbi-hook-authoring" slug is consistent across § Scope Contract, Per-Deliverable table, Implementation Checklist, and Design.
- [PARTIAL] iter1 used a different CL numbering (CL-1..CL-7 in iter1; CL-1..CL-5 in iter2 with CL-5 being CL-5 docs sweep that iter1 said "defer"). The Decisions Log maps iter1 LDP → iter2 DL appropriately, but a reader comparing iter1 and iter2 must use the Decisions Log, not CL numbers, since the CL numbering changed. This is noted but not a defect in iter2 alone — it is expected given the scope change.

**Scenario E — Per-Deliverable table alignment with In-Scope list**
- [YES] In-Scope items 1..5 map 1-to-1 to Per-Deliverable table rows CL-1..CL-5.
- [YES] Verification anchors in the Per-Deliverable table are consistent with the Success Criteria section (SC-1..SC-7).
- [PARTIAL] SC-6 references updating `f-risk-01-subagent-ccsi-semantics.md` from "open" to "addressed" and adding a closure note pointing at the 12-skill commits plus DL-5. The Per-Deliverable table for CL-5 says "`disposition: addressed` (or equivalent)". The Backlog Deltas table says "`status: in-progress`" → "`disposition: addressed`" post-merge. There are three slightly different formulations of the same expected state change (SC-6, Per-Deliverable table CL-5, Backlog Deltas table). They are broadly consistent but not identical — a Planner building executor briefs could legitimately ask: should the backlog file's `status:` field change to "addressed", or should a new `disposition:` field be added, or both?

**Scenario F — Internal vs external research conflict not left unresolved (adversarial)**
- [YES] There is no tension between internal and external insights. I-6 (de-facto delegation-prompt passing) is entirely internally sourced; E-1 and E-2 are external but do not conflict with any internal insight. No competing insight pairs.

**Scenario G — Scope Contract's `Decisions Locked` section mirrors the § "Decisions Locked (post-AUQ)" section**
- [YES] The two sections (§ "Decisions Locked (post-AUQ)" and § "Decisions Locked" inside Scope Contract) are consistent and both enumerate DL-1..DL-5 with matching rationale. The Scope Contract section explicitly labels itself as a "mirror" for the canonical schema.

---

## Per-scenario per-check results

All checks passed or PARTIAL noted above. The PARTIAL on SC-6/backlog disposition is the only cross-section inconsistency.

---

## Typed findings

### C2-001 — Three conflicting formulations of the f-risk-01 backlog disposition change

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**:
  - SC-6 (§ Success Criteria): "backlog file `f-risk-01-subagent-ccsi-semantics.md` is **updated**, not closed... Recommended: update `disposition: open` → `disposition: addressed`"
  - Per-Deliverable CL-5, Verification anchor: "backlog file `disposition: addressed` (or equivalent) and points to the 12-skill commits"
  - Backlog Deltas table, row f-risk-01: "`status: in-progress` (with M2 mitigation locked per DL-5) → `disposition: addressed` post-merge"
  
  The frontmatter field names differ: `disposition:` (SC-6 + Per-Deliverable table) vs `status:` (Backlog Deltas table). The backlog file's actual current frontmatter has both `disposition: open` and `status: open` (verified from file read). The three sections of iter2 do not converge on which field(s) the executor should update or whether both should change.
- **Why it matters**: An executor building the CL-5 task will consult one of these three sections. If they follow the Backlog Deltas table (which says `status: in-progress`), they update `status:` only. If they follow SC-6 (which says `disposition: open` → `disposition: addressed`), they update `disposition:` only. The verification anchor is ambiguous about whether both fields change. The inconsistency will produce a merge commit that one evaluator passes and another flags as incomplete.
- **Suggested direction**: Converge all three references to a single canonical field-update instruction. Determine whether `status:` or `disposition:` (or both) are the executor's target and apply that consistently across SC-6, Per-Deliverable table, and Backlog Deltas.

### C2-002 — Scope Contract `artifact_type` field lacks all five required fields per canonical schema

- **Type**: `checklist_gap`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: `evaluation/SKILL.md` § Scope Contract Schema specifies required fields: `artifact_type`, `feature`, `goal`, `created-by`, `created-at`. The iter2 Scope Contract frontmatter (draft-iter2.md lines 43–50) has: `artifact_type`, `feature`, `goal`, `created-by`, `created-at`, `supersedes`. Missing: none of the five required fields — all are present. However, the schema also requires five body sections: `## In-Scope`, `## Out-of-Scope`, `## Decisions Locked`, `## Success Criteria`, `## Deferred`. All five are present. The frontmatter has an extra `supersedes:` field that is not in the canonical schema — but that is an additive extension, not a violation.
  
  Correction: upon close reading, this is NOT a violation. Confidence drops.
- **Type**: `general`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 0
- **Severity**: Low
- **Notes**: False positive — upon close reading all five required fields and all five body sections are present. Moving to low-confidence appendix.

---

## Per-perspective verdict

**PASS** — One Medium finding (C2-001) at Confidence 75. Per verdict thresholds: Medium findings at any confidence → PASS (only High ≥ 50 triggers REVISE). C2-001 is a real inconsistency worth fixing in Planning's executor brief construction, but it does not block this Ideation artifact from being used as the Planning input.

---

## Low-confidence appendix

- C2-002 (FP): Scope Contract schema completeness check — initially flagged, then verified as NOT a violation on close reading. All five required fields + five body sections are present. Confidence: 0. Dropped from main findings.
