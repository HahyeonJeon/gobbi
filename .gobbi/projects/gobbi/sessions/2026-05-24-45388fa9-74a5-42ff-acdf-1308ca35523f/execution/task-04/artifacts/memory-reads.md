---
loop: execution
iter: 3
artifact_type: memory-reads
created_at: 2026-05-25
status: final
supersedes: []
related:
  - execution/task-04/artifacts/verification-report.md
---

# T04 Memory Reads — all evaluation files consumed

## Evaluation files consumed (cumulative iters 1–3)

### iter1 — Claude system (8 perspectives)
- `execution/task-04/evaluation/iter1/claude/aesthetics.md`
- `execution/task-04/evaluation/iter1/claude/consistency.md`
- `execution/task-04/evaluation/iter1/claude/overall.md`
- `execution/task-04/evaluation/iter1/claude/performance.md`
- `execution/task-04/evaluation/iter1/claude/project.md`
- `execution/task-04/evaluation/iter1/claude/risk.md`
- `execution/task-04/evaluation/iter1/claude/structure.md`
- `execution/task-04/evaluation/iter1/claude/usage.md`

### iter1 — Codex system (8 perspectives)
- `execution/task-04/evaluation/iter1/codex/aesthetics.md`
- `execution/task-04/evaluation/iter1/codex/consistency.md`
- `execution/task-04/evaluation/iter1/codex/overall.md`
- `execution/task-04/evaluation/iter1/codex/performance.md`
- `execution/task-04/evaluation/iter1/codex/project.md`
- `execution/task-04/evaluation/iter1/codex/risk.md`
- `execution/task-04/evaluation/iter1/codex/structure.md`
- `execution/task-04/evaluation/iter1/codex/usage.md`

### iter2 — Claude system (8 perspectives)
- `execution/task-04/evaluation/iter2/claude/aesthetics.md`
- `execution/task-04/evaluation/iter2/claude/consistency.md`
- `execution/task-04/evaluation/iter2/claude/overall.md`
- `execution/task-04/evaluation/iter2/claude/performance.md`
- `execution/task-04/evaluation/iter2/claude/project.md`
- `execution/task-04/evaluation/iter2/claude/risk.md`
- `execution/task-04/evaluation/iter2/claude/structure.md`
- `execution/task-04/evaluation/iter2/claude/usage.md`

### iter2 — Codex system (5 perspectives — confirmation pass)
- `execution/task-04/evaluation/iter2/codex/consistency.md`
- `execution/task-04/evaluation/iter2/codex/overall.md`
- `execution/task-04/evaluation/iter2/codex/project.md`
- `execution/task-04/evaluation/iter2/codex/risk.md`
- `execution/task-04/evaluation/iter2/codex/usage.md`

## Skills + rules read by executor + evaluators

- `.claude/skills/principles/SKILL.md`
- `.claude/skills/mistake/SKILL.md`
- `.claude/skills/evaluation/SKILL.md`
- `.claude/skills/execution/evaluation.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`
- `.gobbi/projects/gobbi/mistakes/leader-iter2-verification-claim-without-evidence.md`
- `.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `.gobbi/projects/gobbi/mistakes/codex-wrapper-relative-path-wrong-session-write.md`
- `.gobbi/projects/gobbi/mistakes/evaluator-returned-verdict-inline-no-per-perspective-files.md`
- `.gobbi/projects/gobbi/mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- `.gobbi/projects/gobbi/mistakes/session-dir-placed-outside-worktree.md`

## Witness files read by executor + evaluators

- `.claude/hooks/session-start.sh`
- `.claude/hooks/post-tool-use-agents.sh`
- `.claude/settings.json`
- `.claude/skills/interview/templates/project-skill.md`
- `.gobbi/projects/gobbi/skills/gobbi-hook-authoring/SKILL.md` (promoted artifact, read for consistency verification)
- `.gobbi/projects/gobbi/backlogs/gobbi-hook-authoring-skill.md`

## Codex eval prompt files (input to codex runs)

- `execution/task-04/rawdata/codex-eval-prompt-iter1.md`
- `execution/task-04/rawdata/codex-eval-prompt-iter2.md`
