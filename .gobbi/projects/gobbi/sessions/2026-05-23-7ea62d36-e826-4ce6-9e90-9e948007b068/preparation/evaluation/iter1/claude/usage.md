# Usage Perspective — Preparation iter1 (Claude)

**Question**: Can the next loop (Planning) actually consume this readiness report and decompose Bundle A's 15 checklist items into tasks?

## Scenario checks

- S1 — Planning can read the report and know every edit-target file exists → PASS. Table at lines 53-67 maps Item → target file → empirical check.
- S2 — Planning can read the open concerns and know which require user DISCUSSION → PASS. Five concerns, each labeled, each with a recommendation.
- S3 — Planning can decompose against a stable codex SKILL.md file → CONDITIONAL PASS. Only if manager promotes stub to project memory before Planning starts. The draft names this (lines 121-126) but it is not yet done.
- S4 — Planning's task list for Item D will have the wrap-up Step 2.5 placement question answered → PASS. Open Concern #1 raises the placement question and recommends option (b) — adding an `### Step 2.5` H3.
- S5 — Planning's task list for Item E will know about the Path Conventions casing issue → PASS. Open Concern #2 raises it.

## Findings

- **F-U-01** (Type: `scenario_gap` / Domain: `process` / Disposition: `open` / Confidence: 75 / Severity: Medium). The promotion of the stub from `preparation/staging/` to `.gobbi/projects/gobbi/skills/codex/SKILL.md` is a manager action at Preparation EXIT. If Planning starts before promotion happens, Planning task A.1 ("fill codex skill content") points to a non-existent file. Suggested direction: manager's Preparation-EXIT checklist must include the `cp` step (or `mv`+symlink), AND the draft's Decisions Log § Proposed gap-resolution table should explicitly state "manager performs promotion BEFORE invoking Planning leader". Currently line 121 says manager "owns the copy step at Preparation EXIT → Planning transition" — clear enough but worth elevating to an explicit gate.

- **F-U-02** (Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: 50 / Severity: Low). The stub's per-section HTML comments (e.g., L19, L25-29, L35) reference specific Decisions / Insights / Mistake files using shorthand like "I1, I2, I13" and "E2". A Planning leader who reads only the staged stub (without idea.md open) might not have the witness labels expanded. Mitigation: the cross-references are in `ideation/artifacts/idea.md § Research Insights` which Planning will load anyway. Minor concern.

## Must-preserve

- Self-contained per-section Execution-fill comments in the stub (lets Execution write each section without re-reading idea.md).
- Explicit "manager promotes at Preparation EXIT" mention.
- Pre-answered/recommended option for each Open Concern (cuts Planning DISCUSSION cycles).

## Verdict

PASS. F-U-01 is Medium-Confidence-75; threshold for REVISE is High-Confidence-50. Medium-75 does not trip REVISE.
