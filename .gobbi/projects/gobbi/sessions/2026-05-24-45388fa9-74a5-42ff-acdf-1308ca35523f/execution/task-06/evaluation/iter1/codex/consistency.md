## Artifact Summary + Memory reads

Evaluated commit `a8968f8` for the Consistency lens, with emphasis on uniform wording and collateral-change detection. Memory reads included the full `git diff a8968f8~1 a8968f8`, current target rows, `.claude/skills/mistake/SKILL.md:129`, and `plan.md:573-583`.

## Locked Frame (Stage 1)

Scenario: all 10 target rows are faithful and uniform.
- Check: every target row contains all three locked M2 clauses.
- Check: wording is coherent with the T03 `mistake/SKILL.md` M2 row.

Scenario: only the `{session-id}` row changed per skill file.
- Check: `git diff --unified=0` shows exactly one removed row and one added row in each target skill.

Scenario (adversarial): excluded docs are edited to game a grep.
- Check: `mistake/SKILL.md`, `gobbi/SKILL.md`, and parent `orchestration/SKILL.md` have no diff in commit `a8968f8`.

## Per-scenario per-check results

Pass. Fixed-string counts returned `10` for the `session-id:` field clause, `10` for the `Do NOT read $CLAUDE_CODE_SESSION_ID` clause, and `10` for the `subagent's own UUID` clause. Current row evidence: `evaluation/SKILL.md:564`, `execution/SKILL.md:255`, `ideation/SKILL.md:465`, `interview/SKILL.md:324`, `memorization/SKILL.md:233`, `orchestration/workflow/evaluation.md:292`, `planning/SKILL.md:462`, `preparation/SKILL.md:395`, `research/SKILL.md:145`, and `wrap-up/SKILL.md:384`. The T03 row at `mistake/SKILL.md:129` matches the same wording. `git diff --unified=0` shows only the `{session-id}` row changed in each target skill file.

## Typed findings

No findings. The sweep is internally uniform and has no collateral skill edits.

## Low-confidence appendix

None.
