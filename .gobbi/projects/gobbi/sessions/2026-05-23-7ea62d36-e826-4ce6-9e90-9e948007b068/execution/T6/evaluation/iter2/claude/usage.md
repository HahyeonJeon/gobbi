# Usage Perspective — iter2 re-eval (Claude)

**Target:** codex/SKILL.md @ b9970dc. Resolves iter1 Codex Highs T6-USAGE-001 and T6-USAGE-002.

## Frame

Scope: can an agent (Claude-side or Codex-side) successfully use this skill to spawn, validate, and consume codex output?

## Scenario Checklist

- S1: Iter1 T6-USAGE-001 (5-Type vocabulary not enumerated) resolved? **YES** — Section 2(d) Step 4 now reads "...greps for required content (verdict lines, perspective files, 5-Type vocabulary: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`)...". Wrapper-assistants can validate without loading the evaluation skill separately.
- S2: Iter1 T6-USAGE-002 (worked example incomplete) resolved? **YES** — Worked-example Step 2 now contains three discrete validation commands: (1) `ls .../iter<m>/codex/ | wc -l  # must be 8` per-perspective file count, (2) `grep -E "scenario_gap|..." ...` 5-Type vocab grep, (3) `grep "^VERDICT:" overall.md` verdict-line check. Each has an inline comment explaining the expected outcome.
- S3: BLOCKED-vs-DONE contract clear? **YES** — Step 3/4 explicitly: "If any check fails, report BLOCKED... If all checks pass, report DONE." No silent-DONE escape hatch.
- S4: Path discipline (absolute main-tree paths) preserved? **YES** — every output path is rooted at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/<session-id>/...`.
- S5: 8-file directory contract communicated? **YES** — `wc -l # must be 8` makes the per-perspective file count explicit.

## Findings

None. Both iter1 Codex usage Highs resolved with verifiable evidence.

## Must-Preserve

- 5-Type vocab enumeration in Section 2(d) AND worked example.
- Three-check worked-example structure (count, vocab, verdict).
- Explicit BLOCKED-on-failure rule.

VERDICT: PASS
