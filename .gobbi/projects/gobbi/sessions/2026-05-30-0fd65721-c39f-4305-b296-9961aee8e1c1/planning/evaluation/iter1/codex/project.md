# Project

## COD-PROJ-001 — Post-install cache allow-set gate is claimed but not actually task-covered

Type: checklist_gap
Severity: High
Confidence: 100

Evidence:
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/ideation/artifacts/gobbi-plugin-ideation.md:55-56` makes the post-install cache gate a success criterion: after a real install, the cached plugin dir must contain only plugin payload, with no `.gobbi/.../sessions`, project memory, or repo content.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:312` maps that checklist item to T1 and T5: folded into T1 `--check` plus exercised at T5 install.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:106-110` T1 only verifies component counts, real files, symlink absence, and tamper drift.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:172-177` T5 only verifies the installed hook marker log and the worktree sentinel. It does not assert the installed cache top-level allow-set.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/staging/decisions/plugin-plan-decomposition-and-ordering.md:24` repeats the same claim: T5 asserts the cache contains only `{.claude-plugin, skills, agents, hooks}`. The task verifier does not contain that assertion.

Why-it-matters:
This is the exact R1 regression guard. Without an executable post-install cache allow-set assertion, the plan can pass every listed task verifier while still failing the ratified no-session-memory/no-repo-content requirement.

Suggested-direction:
Keep the no-standalone-task decision if desired, but make the gate explicit in task verification: T1 `--check` should assert the source package top level is exactly `{.claude-plugin, skills, agents, hooks}`, and T5 should locate the installed cache dir and assert the installed top level is exactly that set, with negative checks for `.gobbi`, `sessions`, project memory, repo docs, and unexpected files.
