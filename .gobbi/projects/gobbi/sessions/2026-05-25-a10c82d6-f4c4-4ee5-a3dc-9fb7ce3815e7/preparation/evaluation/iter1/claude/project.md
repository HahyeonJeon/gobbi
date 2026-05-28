# Project Perspective — Preparation Readiness Evaluation

**Phase:** preparation | **Iter:** 1 | **System:** claude | **Perspective:** project

---

## Artifact Summary + Memory reads

**What:** A preparation readiness note (`preparation/rawdata/readiness.md`) claiming READY status for the memory-system redesign task. It is 19 lines covering prerequisites verified, gaps, and a readiness statement.

**Why:** Preparation must verify project memory + workspace skills are ready for Planning/Execution against the locked Idea (the memory-system redesign design). The correctness of the readiness verdict gates whether Planning proceeds on a sound foundation.

**How:** Manager-performed spot-check (per the wrap-up staging file, this session substituted manager-verification for mandatory dual-system evaluation). The readiness note does not document Sub-steps A, B, C, D procedure; it presents a conclusion only.

**Scope Contract source:** `ideation/artifacts/memory-system-redesign-design.md` (iter2) + `ideation/rawdata/locked-decisions.md` (L1-L8). No separate scope-contract artifact exists — the design doc doubles as the locked Idea.

**Downstream consumers:** Planning leader (must start from this note), Execution executor, Wrap-up assistant.

### Memory reads

- `ideation/artifacts/memory-system-redesign-design.md` — locked Idea
- `ideation/rawdata/locked-decisions.md` — L1-L8 locks
- `.gobbi/projects/gobbi/skills/preparation/SKILL.md` — preparation procedure
- `.claude/skills/preparation/evaluation.md` — phase child doc
- `.gobbi/projects/gobbi/mistakes/` — all 22 entries scanned
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `wrap-up/staging/decisions/manager-substituted-self-verification-for-mandatory-dual-system-eval.md` — existing mistake-candidate
- Live tree verification: propagation targets, templates, memorization/rules.md timestamps

---

## Locked Frame (Stage 1)

### S1 — Gap coverage traces to Scope Contract
- Checklist: each verified item maps to a specific design requirement; no phantom items; no Scope Contract item silently omitted.

### S2 — Readiness summary matches detail sections
- Checklist: counts in summary match enumerated items; deferred counts match "Out of scope gaps"; section structure matches 7-section template.

### S3 — Feature directory verified (Sub-step A)
- Checklist: the design's target feature (`project-memory`) existence status is documented; the readiness note explicitly addresses whether the feature dir exists or is bootstrappable.

### S4 — RE-IDEATE triggers evaluated (adversarial)
- Checklist: each gap assessed for RE-IDEATE vs generate-now; explicit statement that no RE-IDEATE escalation is required with evidence.

### S5 — Scope Contract's single open RATIFY item addressed
- Checklist: RATIFY-1 (7 value-features sign-off) was flagged as "the ONLY remaining open item before Planning" in the design. Does the readiness note confirm it was resolved before readiness was stamped READY?

### S6 — Out-of-scope gaps captured with pointers (adversarial: silent drops)
- Checklist: FLAG-2 and L8 have concrete next-action pointers (not just mentioned); each deferred item points to backlog or follow-up.

---

## Per-scenario per-check results

### S1 — Gap coverage traces to Scope Contract
- PASS: the 7 listed prerequisites (propagation targets, templates, rules.md absence, delegation templates, canonical mirror model, FLAG-2, L8) all trace to design §7/§8.
- FAIL: the readiness note does not list "17 of 21 mistakes have `mistake-candidate: true` flag to be stripped" (§8 cat C, ~17 files) as a verified item. This is a Wave 1 prerequisite (mistakes must exist before W1 strips them). The mistakes are present (verified: `ls mistakes/` = 22 entries) but are not mentioned.
- FAIL: the readiness note does not address the 7 value-feature dirs' non-existence. The design's Wave 3 creates them from scratch — preparation should have verified this is acceptable (i.e., Wrap-up bootstrap, not a blocking RE-IDEATE gap). The note is silent.
- FAIL: no mention of whether any existing memory file that the design READS (memory-map.md, wrap-up/SKILL.md, orchestration/SKILL.md) is in a state the design's §7 claims are true. E.g., the design says "delegation templates' Load Directives already include memorization/SKILL.md (leader.md, assistant.md, executor.md each have the line)" — preparation did not verify this claim is still true on the current branch.

### S2 — Readiness summary matches detail sections
- FAIL: the readiness note uses a flat bulleted list instead of the 7-section template required by `preparation/SKILL.md`. Missing sections: "Scope reference", "Readiness summary", "Design + memory readiness", "Execution skills readiness", "Generated this loop", "Out of scope gaps", "Decisions log". The entire template structure is absent. This is not a formatting preference — the evaluation child doc explicitly gates on all 7 sections being populated.
- NOTE: The bullet "Generated this loop" is implicit ("No generate-now project skills required") but "Decisions log" is entirely absent — no AskUserQuestion outcomes are recorded.

### S3 — Feature directory verified (Sub-step A)
- FAIL: the note does not mention that the `project-memory` value-feature directory does not exist yet. The design says this redesign "lands here" but the `features/project-memory/` dir is absent. Preparation/SKILL.md § Sub-step A requires confirming the feature dir exists or is plausibly bootstrappable. The note is silent on this.

### S4 — RE-IDEATE triggers evaluated (adversarial)
- PASS: implicit — no gaps were flagged as RE-IDEATE. The design already went through 3 iterations of Ideation eval; the gaps are all execution-time gaps (rules.md absent, delegation templates not yet wired) rather than design flaws. The RE-IDEATE risk is low here given the depth of Ideation evaluation.
- CONCERN: no explicit statement of "no RE-IDEATE" as required by preparation/evaluation.md.

### S5 — Scope Contract's RATIFY-1 resolved before READY stamp
- UNCERTAIN: RATIFY-1 (user sign-off on 7 value-features) was the ONLY remaining open item in the design. The readiness note does not confirm it was resolved. The planning draft references the Locked Idea as "PASS, manager-verified" — but preparation didn't stamp this explicitly. Given planning proceeded, it was presumably resolved, but evidence is absent from the readiness artifact itself.

### S6 — Deferred items have concrete pointers
- PARTIAL PASS: "FLAG-2: file follow-up backlog at Wrap-up" and "L8 follow-up: file follow-up" are named but have no slug, no backlog path, no staged decision file. They do not meet the standard of "concrete next-action pointer."

---

## Typed findings

### F-PROJ-01: Missing 7-section template structure
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** `preparation/rawdata/readiness.md` is 19 lines with no section headers matching the 7 required sections. `preparation/SKILL.md` lines 258-281 define the required-sections template; `preparation/evaluation.md` § Structure seed scenario explicitly checks "all seven sections are present." The artifact is a flat narrative, not the required template.
- **Why it matters:** The evaluator cannot verify gap-resolution completeness, count of resolved/deferred items, or Decisions-log traceability from this artifact. Downstream loops (Planning, Wrap-up) cannot use it as an authoritative readiness record without the structured sections.
- **Suggested direction:** Expand the readiness note to include all 7 sections with substantive content or explicit "none" statements.

### F-PROJ-02: Feature directory existence not verified
- **Type:** checklist_gap
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** `preparation/SKILL.md` § Sub-step A, line 136: "Confirm the feature directory referenced in the Scope Contract exists (or is plausibly bootstrappable by Wrap-up)." The design says this redesign "lands here" (in the `project-memory` value-feature). `ls .gobbi/projects/gobbi/features/` = env-var-audit / gobbi-orchestration-workflow-improvements / session-foundations-bundle-b / session-foundations-bundle-c — no `project-memory` dir. The readiness note is silent on this.
- **Why it matters:** Sub-step A requires this check. Its absence means preparation did not close the loop on a required verification.
- **Suggested direction:** Add a line documenting that `project-memory` feature dir is to be CREATED by Wave 3 (not pre-existing) and that this is acceptable — Wrap-up lazy bootstrap.

### F-PROJ-03: Deferred items lack concrete pointers
- **Type:** checklist_gap
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** Readiness note lines 13-14: "FLAG-2 (non-blocking) … file follow-up backlog at Wrap-up" and "L8 follow-up (non-blocking) … file follow-up." No slug, no path, no staged decision file. `preparation/evaluation.md` § Risk seed scenario: "Each deferred item has a pointer to where it was backlogged (staging path or downstream note)."
- **Why it matters:** "Will be filed at Wrap-up" is a promise, not a pointer. If the session ends without wrap-up, the items are untracked.
- **Suggested direction:** Create staging/decisions/{flag-2-slug}.md and staging/decisions/{l8-follow-up-slug}.md with concrete pointers now.

---

## Low-confidence appendix

### LC-PROJ-A: RATIFY-1 resolution not confirmed
- **Confidence:** 50 (circumstantial — planning proceeded, implying RATIFY-1 was resolved)
- **Severity:** Medium
- **Evidence:** Design §10 states RATIFY-1 is "the ONLY remaining open item." Readiness note does not confirm user ratified the 7 value-features. Planning proceeded, which implies resolution occurred, but the readiness artifact is silent.

**Per-perspective verdict: REVISE** (F-PROJ-01 = High/100 triggers REVISE threshold)
