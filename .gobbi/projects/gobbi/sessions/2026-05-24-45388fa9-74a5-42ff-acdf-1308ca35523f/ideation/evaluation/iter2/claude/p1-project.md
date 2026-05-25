# Perspective 1 — Project
**Evaluator**: claude (iter2)
**Phase**: ideation
**Artifact**: draft-iter2.md — Bundle C foundation follow-ups

## Artifact Summary + Memory reads

**What**: Consolidated Ideation Idea for `session-foundations-bundle-c` — 5 deliverables: CL-1 (close f-struct-01 inline), CL-2 (stage + promote gobbi-hook-authoring skill), CL-3 (mistake/SKILL.md hooks-domain edit + watchlist backlog update), CL-4 (Theme β design doc session-lifecycle-worktree-boundaries.md), CL-5 (f-risk-01 M2 docs sweep across 12 skills).

**Why**: Bundle B (dfb7d6d) deferred follow-up artifacts to backlogs; their triggers have now fired. User locked DL-1..DL-5 via AskUserQuestion, diverging from iter1 leader recommendations on Q1 (β-1 vs β-2) and Q4 (absorb f-risk-01 vs defer). iter2 consolidates all 5 locks.

**How**: 5 specific deliverables with scoped file-touch lists, verification anchors (grep-verifiable), and a Risk Delta section quantifying bundle size honestly. All 5 decisions are user-locked; no pending user questions.

**Scope Contract source**: `sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md` § Scope Contract.

**Downstream consumers**: Planning (task decomposition), Preparation (skill stamping + template selection for CL-2), Execution (12-file sweep CL-5), Wrap-up (backlog delta promotions).

**Memory reads**:
- `.claude/skills/principles/SKILL.md` — loaded
- `.claude/skills/evaluation/SKILL.md` — loaded
- `.claude/skills/ideation/evaluation.md` — loaded (phase child doc)
- `.claude/skills/orchestration/workflow/evaluation.md` — loaded
- `.claude/skills/mistake/SKILL.md` — loaded
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` — loaded
- `.gobbi/projects/gobbi/mistakes/*.md` (15 files) — all read
- `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` — read in full
- `.gobbi/projects/gobbi/backlogs/f-struct-01-jq-sh-env-passthrough.md` — read in full
- `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md` — read in full
- `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md` — read in full
- `.gobbi/projects/gobbi/backlogs/session-lifecycle-worktree-boundaries-design-doc.md` — read in full
- `.claude/hooks/session-start.sh` — read lines 70–79 (verified f-struct-01 fix)
- `.claude/hooks/post-tool-use-agents.sh` — existence + line count verified
- Prior-iter evaluation: no iter1 eval files found at expected path (directory does not exist; iter1 eval was not written to session memory — see design_flaw finding P1-002)
- `ideation/rawdata/draft-iter1.md` — read in full

---

## Locked Frame (Stage 1)

**Scenario A — Root cause is real and the work addresses it**
- [YES] "Deferred-witness debt that has come due" — each CL maps to a specific backlog with a fired trigger; no manufactured triggers.
- [YES] No prior attempt exists for any of the 5 items within Bundle C scope (verified via git log and backlog file histories).
- [YES] Design section does not solve a different problem; all decisions trace to Framed Problem or user-locked DL.

**Scenario B — Scope Contract is sharp enough for an Executor to refuse out-of-scope tasks**
- [YES] In-Scope list enumerates 5 specific items; no "etc." or "and related" phrasing.
- [YES] Out-of-Scope list explicitly names M1/M3, Theme β re-litigation, 3rd hook, refactoring hooks, and additional backlog items.
- [PARTIAL] Per-Deliverable table's `files-must-not-touch` column is specific per CL, but CL-3's denylist entry says "any other skill from the f-risk-01 12-list (CL-5 owns those)" without enumerating all 11 other skill files by name. An executor could misread this boundary.

**Scenario C — "Why now?" is concrete with specific references**
- [YES] Every trigger cites a commit SHA (dfb7d6d, 159eb21), backlog path, and explicit "When to pick up" clause.
- [YES] Success criteria are grep-verifiable (SC-1..SC-7 all use shell commands or file-existence checks).
- [PARTIAL] SC-5 uses `{each-skill}` as a placeholder in the grep command rather than naming all 12 skills — a planner following the criterion literally would need to expand this.

**Scenario D — Counterfactual taken seriously (adversarial)**
- [YES] iter2 counterfactual (§ Framed Problem) explicitly acknowledges the user's DL-4 + DL-5 override of iter1's steel-man. The steel-man is not strawmanned — it is acknowledged and overridden via user authority per Iron Law 9.
- [YES] The "what NOT a risk" section (Risk Delta) correctly contextualizes M2 as docs-codification, not behavioral change.

**Scenario E — Adjacent feature/scope absorbs this idea quietly (adversarial)**
- [PASS] Verified: no overlap with active features. `gobbi-hook-authoring-skill.md` backlog status=`deferred`; `session-lifecycle-worktree-boundaries-design-doc.md` backlog status=`deferred`. Neither is already in an active feature scope. The 12 skills touched by CL-5 are not being touched by any other active feature in `.gobbi/projects/gobbi/features/`. No silent overlap.

**Scenario F — Every risky premise has an assumption-ledger entry**
- [YES] DL-1's shallow-lessons trade-off is explicitly recorded (S-8, R-3, D-5 revised, DL-1 lock).
- [YES] I-6 documents the assumption that M2 codifies de-facto practice (self-anchored to the delegation prompt header).
- [PARTIAL] I-6's source ("this iter2 leader's own delegation prompt header") is self-referential. It cannot be independently verified by an evaluator without reading session.json's workflow.ideation.iterations[0]. The claim is reasonable but the evidence is not externally cite-able.

---

## Per-scenario per-check results

The Project perspective checks above are answered inline. Summary of partial/failed checks:

1. **Scenario B partial**: CL-3's `files-must-not-touch` uses aggregate language ("any other skill from the f-risk-01 12-list") without enumeration. Planning may mis-read what "CL-5 owns" vs what CL-3 may not touch.

2. **Scenario C partial**: SC-5 uses `{each-skill}` placeholder rather than 12 explicit file paths. Verification criterion is technically correct but not immediately executable.

3. **Scenario F partial**: I-6 evidence is self-referential (cannot be independently verified by an evaluator without reading session.json or the delegation prompt that spawned this leader).

---

## Typed findings

### P1-001 — CL-3 files-must-not-touch uses aggregate reference instead of enumeration

- **Type**: `checklist_gap`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: Per-Deliverable table row CL-3, column `files-must-not-touch`: "any other skill from the f-risk-01 12-list (CL-5 owns those)". The 12 skills are not named. An executor brief built from this table must expand this to the full list; failure to do so creates ambiguity about which exact files CL-3 must not touch.
- **Why it matters**: Planning builds executor briefs from this table. Aggregate denylist language is the precondition for scope-drift — an executor may interpret "CL-5 owns those" as permission to touch a skill that CL-3 has no business touching.
- **Suggested direction**: Expand the CL-3 `files-must-not-touch` column to name all 11 remaining skills (the 12-list minus `mistake/SKILL.md`), or add a forward-reference to the CL-5 row's `files-may-touch` column where the 12 paths are enumerated.

### P1-002 — No iter1 evaluation files exist; Stage 1 inheritance cannot be verified

- **Type**: `assumption_risk`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: `find .gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ -type f` shows only `ideation/rawdata/draft-iter1.md`, `ideation/rawdata/draft-iter2.md`, `session.json`, `session.json.lock`, `settings.json`, `state.json`. No evaluation directory exists. Iter2 evaluation (this run) is operating without any iter1 evaluation inheritance because the iter1 evaluation files were not written to session memory. Per `evaluation/SKILL.md` Stage 1 step 5: "If n ≥ 2: READ prior iter's per-perspective files." Those files are absent.
- **Why it matters**: Any findings the iter1 evaluator(s) may have surfaced are not available for inheritance — if the parallel Codex iter1 evaluator surfaced issues that iter2 REVISE was supposed to address, there is no audit trail. The evaluation is technically correct from this evaluator's perspective (we read the draft in full), but the formal iter2 inheritance loop is broken.
- **Suggested direction**: Manager should verify whether iter1 evaluations were dispatched and their output paths. If the iter1 evaluation was skipped or the files were lost, note this as a process deviation in the session record. This finding does not block iter2 evaluation — it is an audit-trail gap.

### P1-003 — SC-5 verification grep uses `{each-skill}` placeholder not 12 concrete paths

- **Type**: `checklist_gap`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: draft-iter2.md, SC-5 (§ Success Criteria): `grep -nE 'session-id.*delegation prompt' {each-skill}` — the placeholder `{each-skill}` is never expanded to a list of 12 explicit paths in the Scope Contract or anywhere else in the document.
- **Why it matters**: SC-5 is the primary verification anchor for CL-5 — the largest and most complex deliverable. A Planner or evaluator running SC-5 must know the exact 12 paths. They appear in CL-5's Per-Deliverable table row, but SC-5 does not cross-reference that row. The separation creates a verification gap if SC-5 is copied into an executor brief without the Per-Deliverable context.
- **Suggested direction**: Expand SC-5 to either enumerate all 12 file paths inline or explicitly cross-reference "see Per-Deliverable table row CL-5 `files-may-touch` for the 12 paths."

---

## Per-perspective verdict

**PASS** — The Project perspective passes. All major scenarios are handled; the root cause is real with witnessed evidence; the Scope Contract is mostly sharp. The three findings above are Low/Medium severity at Confidence 75/100. No Critical or High findings with confidence ≥ 50 that would trigger REVISE. The two Low severity findings (P1-001, P1-003) and one Medium (P1-002) do not cross the threshold.

---

## Low-confidence appendix

None — all findings above have confidence ≥ 50 and are included in the main section.
