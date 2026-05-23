# Structure Perspective — Preparation iter1 (Claude)

**Question**: Are sections + contracts complete and shaped correctly per the Preparation skill contract?

## Frame

Preparation readiness report should cover: (a) inputs scanned, (b) edit-target verification, (c) cross-link readiness, (d) gaps + resolutions, (e) open concerns for Planning DISCUSSION, (f) decisions log + gap-resolution table for manager AskUserQuestion.

The staged stub should have: frontmatter + the locked 8 H2 sections (Idea Design A) + clearly-marked staging artifacts.

## Scenario checks

- S1 — Readiness report carries Status / Inputs / Edit-target verification / Cross-link manifest / Gaps / Out-of-scope / Open concerns / Decisions log → PASS. All sections present and well-ordered.
- S2 — Each readiness-graded item A–G mapped to its file with empirical evidence → PASS. Tables at lines 50-67 + 99-107 + 111 cover Bundle A items.
- S3 — Gap-resolution table for manager AskUserQuestion present → PASS (lines 173-176).
- S4 — Stub has correct frontmatter (name/description/allowed-tools) → PASS. Lines 1-5 show valid YAML; description marked STUB; allowed-tools listed.
- S5 — Stub has the 8 locked H2 sections from Idea Design A → MIXED. The 8 are present (When to load / Invocation patterns / Why subagents must use codex exec / Sandbox + CWD discipline / Hang + timeout discipline / Use cases / Cost + sandbox budget awareness / Anti-patterns) but the stub also has `## Constraints` (L93) and `## STUB metadata...` (L107), making `grep -c "^## "` return 10, not 8. The validation method in Idea checklist item 1 expects 8 post-ship.

## Findings

- **F-S-01** (Type: `design_flaw` / Domain: `docs-sync` / Disposition: `open` / Confidence: 100 / Severity: Low). Staged stub has 10 H2 sections, not 8. Leader is fully transparent about this (STUB metadata block at L107-116 explicitly tells Execution to remove itself, and Constraints is flagged for "remove or merge into Anti-patterns" in Open Concern #4). Evidence: `grep -c "^## " preparation/staging/skills/codex/SKILL.md` → 10. Why it matters: when manager promotes the stub to `.gobbi/projects/gobbi/skills/codex/SKILL.md` at Preparation EXIT, the project-memory file will start life with 10 H2s violating the Idea checklist Item 1 contract until Execution edits it. Mitigated by the self-removing STUB-metadata note + Open Concern #4 routing this to Planning. Suggested direction: either (a) keep as-is and trust Execution to follow the STUB-removal instruction (current path), or (b) reduce the stub to exactly 8 H2s now and move the Constraints+STUB-metadata content into HTML comments. Manager + user decide.

- **F-S-02** (Type: `checklist_gap` / Domain: `docs-sync` / Disposition: `open` / Confidence: 75 / Severity: Low). Open Concern #2 says memorization "Path conventions" is at line 224 lowercase 'c' bold paragraph (not H3). Verified empirically — line 224 is `**Path conventions**`. This is correctly surfaced for Planning. No structural defect in the draft itself; flagging that the resolution choice (normalize link target vs upgrade in-file heading to H3) is a small but real change to the link-7 target.

## Must-preserve

- Clean section ordering (scope → inputs → verification → gaps → out-of-scope → open concerns → decisions log).
- Stub frontmatter + the 8 locked H2 names match Idea Design A verbatim.
- Self-removing STUB-metadata pattern (it makes Execution's contract explicit).

## Verdict

PASS. F-S-01 is Low (Confidence 100, but Severity Low because the leader designed in the self-correction). F-S-02 is Low. No High or Critical structural defects.
