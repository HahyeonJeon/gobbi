# Project Perspective

## Artifact Summary

Artifact under review: commit `5d2a7c6`, which claims to remediate T04 iter1 findings in the promoted and staged `gobbi-hook-authoring` skill copies. The scope contract for this confirmation pass is narrow: verify the current promoted skill against `.claude/settings.json` and `.claude/hooks/session-start.sh`, confirm the staged/promoted twins remain byte-identical, and check must-preserve items.

## Memory Reads

- `.agents/skills/principles/SKILL.md`
- `.agents/skills/mistake/SKILL.md`
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/execution/evaluation.md`
- `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`
- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/mistakes/codex-wrapper-relative-path-wrong-session-write.md`
- `.gobbi/projects/gobbi/mistakes/evaluator-returned-verdict-inline-no-per-perspective-files.md`
- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- `.gobbi/projects/gobbi/mistakes/session-dir-placed-outside-worktree.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- Prior iter files under `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/execution/task-04/evaluation/iter1/codex/`

## Locked Frame

Scenario: The revise commit stays inside the remediation scope.
- Check: `git diff --name-only 5d2a7c6~1 5d2a7c6` lists only the two twin `SKILL.md` files.
- Check: `git show --stat 5d2a7c6` matches the two-file remediation claim.
- Adversarial check: no unrelated implementation, hook, settings, backlog, or session metadata file is part of the commit.

Scenario: Must-preserve items still hold.
- Check: staged and promoted skill copies are byte-identical.
- Check: no `{session-id}` path-convention row cites `$CLAUDE_CODE_SESSION_ID`.
- Check: witness-grounded sections remain present.
- Check: at least four canonical H2s remain.

## Verification

- `git show --stat 5d2a7c6`: exactly 2 files changed, both `gobbi-hook-authoring/SKILL.md` twin copies.
- `git diff --name-only 5d2a7c6~1 5d2a7c6`: exactly:
  - `.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/preparation/staging/skills/gobbi-hook-authoring/SKILL.md`
  - `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md`
- `diff <staged SKILL.md> <promoted SKILL.md>`: no output.
- `grep -n '^## ' .../gobbi-hook-authoring/SKILL.md`: six H2s present: When to load, Core Principles, Procedures, Constraints, Anti-patterns, Output paths.
- `grep -nE '\{session-id\}|CLAUDE_CODE_SESSION_ID|Path conventions|path-convention|path convention' .../gobbi-hook-authoring/SKILL.md`: only hook-mechanics references at lines 113 and 131; no path-convention row cites `$CLAUDE_CODE_SESSION_ID`.

## Findings

None.
