---
evaluator: codex
model: gpt-5-codex
iter: 2
verbatim: true
rerun: true
perspective: p4-specificity
---

# P4 Specificity

## Verification Notes

- Sampled H3 verify entries:
  - T01 SC-1.a has `grep` plus `test "$n" -eq 1 || ... exit 1`.
  - T02 SC-8.3 exits non-zero on missing file, but its path is a literal macro.
  - T03 SC-3.2 has concrete grep/test checks for both M2 clauses.
  - T05 SC-4.1.c has a concrete byte threshold and non-zero failure path.
  - T06 SC-5 loop uses `fail=0` aggregation and exits 1 if any file fails.
  - T04 SC-2.3.b has a concrete jq threshold, but its path is a literal macro.
- T04 SC-2.3.b timing concern was checked and not independently confirmed: the actual session file exists now and `.agents | length` is 14. The specific remaining failure is executability of the literal command text.
- Awk terminator premature-stop risk was checked across the 10 files. No internal non-Path `###` heading appeared inside the Path Conventions blocks, and the captured block tails ended at expected next-section headings.

## Findings

ID: H1
Severity: High
Confidence: 100
Type: design_flaw
Domain: test
Evidence: T02 SC-8.3 at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/planning/rawdata/draft-iter2.md:240-242` and T04 SC-2.3.b at `draft-iter2.md:425-428` include `<worktreePath>` directly in shell commands. The literal T02 command exited 1. The literal T04 command exited 2 with `jq: error: Could not open file <worktreePath>/.../session.json`.
Why it matters: These are not runnable as-is, so they fail the Planning evaluation frame's executor-usability requirement: "Verification commands are runnable as-is (no `<your test path here>` placeholders)." The commands also violate the plan's own H3 claim that every verify entry is self-contained.
Recommendation: Resolve `<worktreePath>` before it reaches the executor-facing verify command. If a macro must remain in prose fields, keep it out of executable command blocks or define it in-shell before use.

ID: H2
Severity: High
Confidence: 75
Type: checklist_gap
Domain: test
Evidence: T06 states the locked M2 replacement string at `draft-iter2.md:559-565`, but the verify spot check at `draft-iter2.md:675-705` extracts `ref1` and `ref2` from `.claude/skills/wrap-up/SKILL.md`. Before T06 edits, the current source row at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-24-45388fa9/.claude/skills/wrap-up/SKILL.md:381-384` still says the session ID comes from `$CLAUDE_CODE_SESSION_ID`, and the extraction command returned empty `REF1:` / `REF2:`.
Why it matters: The verify block does not specifically prove the executor wrote the locked M2 wording. It proves only that at least 7 files match substrings extracted from a T06-edited file, after that same file has presumably been changed. That is too self-referential for a central wording-codification check.
Recommendation: Change the spot check to extract from a non-T06 mutable source: the T03-updated `mistake/SKILL.md` row or an inline literal expected string. Then include `wrap-up/SKILL.md` in the outputs being compared.

VERDICT: REVISE

Specificity improved for most verify entries, but two High gaps remain in executable command specificity and reference specificity. The plan should revise those before advancing.
