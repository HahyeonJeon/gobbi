# Structure Perspective — Preparation Readiness Evaluation

**Phase:** preparation | **Iter:** 1 | **System:** claude | **Perspective:** structure

---

## Artifact Summary + Memory reads

(See project.md for full summary. Structure evaluates the preparation artifact's organizing decomposition and staged artifact shape.)

### Memory reads
- `preparation/SKILL.md` § Required-sections template (lines 258-281)
- `preparation/evaluation.md` § Structure seed scenarios
- Live tree: `preparation/staging/` (does not exist beyond rawdata/)

---

## Locked Frame (Stage 1)

### S1 — 7-section template compliance
- Checklist: all 7 required sections present, no placeholders.

### S2 — Staged artifacts follow correct path conventions
- Checklist: `preparation/staging/skills/`, `preparation/staging/decisions/`, etc. exist and contain correctly-shaped files.

### S3 — Generated skills (if any) use full project-skill template, not skeleton (adversarial)
- Checklist: any generated skill has all sections populated; no TODO/TBD/placeholder text.

### S4 — Staging directory structure compatible with Wrap-up routing
- Checklist: staging files are in the correct subdirectory per the Wrap-up routing table.

---

## Per-scenario per-check results

### S1 — 7-section template compliance
- FAIL: Readiness note is a flat bulleted list with no section headers. The 7 required sections (Scope reference / Readiness summary / Design + memory readiness / Execution skills readiness / Generated this loop / Out of scope gaps / Decisions log) are absent as named headers. Content for some sections is embedded in bullets, but the structure contract is not met.
- FAIL: No "Scope reference" section with a link to `ideation/artifacts/` and the Scope Contract section.
- FAIL: No "Decisions log" — no record of AskUserQuestion outcomes.

### S2 — Staged artifacts follow correct path conventions
- FAIL: `preparation/staging/` does not exist at all. The readiness note says "No generate-now project skills required" (implicit), which explains why skills staging is empty. However, if FLAG-2 and L8 deferrals were to generate staging files (decision records), those do not exist either. The `preparation/` directory contains only `rawdata/` — no `staging/` or `evaluation/` created before this evaluation.
- PASS (conditional): If truly no staging was needed (no generate-now), an absent staging dir is acceptable per "zero or more" in preparation/SKILL.md. The readiness note should state this explicitly.

### S3 — Generated skills use full template
- not-applicable: the readiness note claims no skills were generated ("No generate-now project skills required"). No staged skills to check.

### S4 — Staging structure compatible with Wrap-up routing
- PASS (vacuous): no staging files exist, so no misrouting possible.

---

## Typed findings

### F-STRUCT-01: Missing required 7-section template (structural contract breach)
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** `preparation/rawdata/readiness.md` has no section headers; `preparation/SKILL.md` lines 258-281 define the required template; `preparation/evaluation.md` § Structure S2 seed: "The rawdata draft uses all seven required sections from the WORK template."
- **Why it matters:** Downstream evaluation (this evaluation pass) and Planning can only superficially read the readiness note without the structured sections. Decisions log absence means no AskUserQuestion outcome is traceable.
- **Suggested direction:** Restructure the note to include all 7 headers with substantive content; even "none" or "not applicable" counts.

### F-STRUCT-02: preparation/staging/ absent (requires documentation)
- **Type:** checklist_gap
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** `find preparation/ -type d` = only `rawdata/` exists. No `staging/` dir. The note does not explicitly state "no staging artifacts were produced" beyond the implicit "no generate-now."
- **Why it matters:** Evaluators and Wrap-up rely on staging structure; an undocumented absence is ambiguous.
- **Suggested direction:** Add "Generated this loop: none" statement explicitly.

---

## Low-confidence appendix

(None)

**Per-perspective verdict: REVISE** (F-STRUCT-01 = High/100)
