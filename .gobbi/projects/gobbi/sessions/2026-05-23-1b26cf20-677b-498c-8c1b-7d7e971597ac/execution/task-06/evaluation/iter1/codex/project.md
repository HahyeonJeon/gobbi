# Project Perspective - Task 06 iter1 Codex

## Artifact Summary (Stage 0)

Commit `32b9adc6ad4b227aca642394d4202cb33dda57ae` modifies `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` to add the Task 06 direct-mode opt-out footnote beside Configuration row 5.5 and the T1.h branch smoke-test regex. The why is LOCK #5 and the Task 06 plan acceptance: document direct-mode opt-out in orchestration, not git, and co-locate the smoke-test gate. The how is docs-only insertion under row 5.5. Downstream consumers are managers running Configuration Step 1, future session operators reading the opt-out, and post-merge reviewers running the smoke test.

## Memory reads

- `execution/task-06/evaluation/iter1/codex/eval-prompt.md`
- `planning/artifacts/plan.md` Task 06 acceptance
- `ideation/artifacts/bundle-b-ideation-pass.md` Scope Contract and LOCK #5
- `git show 32b9adc -- .gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- Worktree file `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`, lines 103-128
- Project mistakes filtered for `process` / `docs-sync`: `codex-eval-session-write-path-nested-in-worktree.md`, `evaluator-returned-verdict-inline-no-per-perspective-files.md`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`, `claude-evaluator-step4-only-vs-codex-whole-file-grep.md`
- Project rule `rules/stub-redirect-format.md` (not applicable)
- `evaluation/SKILL.md`; requested child doc path `skills/evaluation/workflow/execution.md` is absent in this tree (`rg --files skills/evaluation` returns only `evaluation/SKILL.md`), treated as evaluator-input drift rather than a Task 06 artifact defect
- `git/SKILL.md` Core Principles and `git/conventions.md` Branch Naming

## W / W / H

- What: add direct-mode opt-out and smoke-test documentation beside row 5.5. Clear.
- Why: preserve LOCK #5 and verify branch naming after merge. Clear.
- How: docs-only update to orchestration/SKILL.md. Clear.

## Locked Frame (Stage 1)

Scenario P1 - Task 06 scope is satisfied.
- Check P1.a: only the planned orchestration file changes.
- Check P1.b: direct-mode opt-out is documented in orchestration, not duplicated in git/SKILL.md.
- Check P1.c: acceptance greps pass against the filesystem symlink path.

Scenario P2 (adversarial) - The docs must not create a different problem than LOCK #5 solved.
- Check P2.a: cross-links must not move the opt-out home back into git/SKILL.md.
- Check P2.b: future operators must still find the row 5.5 behavior at the row 5.5 location.

Coverage not-applicable: performance, privacy, licensing, dependency supply chain, and i18n do not apply to this docs-only row-level change.

## Results (Stage 2)

- P1.a: yes. Commit stat reports one file changed, 23 insertions, all in orchestration/SKILL.md.
- P1.b: yes. `rg` over worktree `git/SKILL.md` finds no direct-mode opt-out section added by this commit; the new opt-out prose is in orchestration/SKILL.md lines 107-128.
- P1.c: yes. `grep -nE 'direct.*mode|workflow.git.mode' .../.claude/skills/orchestration/SKILL.md` returns lines 103, 104, 116, and 396. `grep -nE 'chore/session-\[0-9\]\{4\}' .../.claude/skills/orchestration/SKILL.md` returns line 126.
- P2.a: partial. The opt-out home remains orchestration, but the new line 116 sends readers to git/SKILL.md Core Principles for full mode definitions that are not present there. The blocking finding is recorded under Consistency.
- P2.b: yes. The new heading is directly below row 5.5.

## Findings

None in this perspective. Cross-artifact problems are recorded under Usage, Consistency, and Risk where they belong.

## Verdict

PASS

## Low-confidence appendix

None.
