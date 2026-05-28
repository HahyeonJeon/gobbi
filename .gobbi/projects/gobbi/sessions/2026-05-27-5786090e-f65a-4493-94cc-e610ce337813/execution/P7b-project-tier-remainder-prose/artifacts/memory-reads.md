---
loop: execution
iter: 2
artifact_type: memory-reads
created_at: 2026-05-28
status: final
supersedes: []
related:
  - artifacts/change-summary.md
  - artifacts/verification-report.md
---

# P7b Memory Reads

Enumerates every prior-iter evaluation file path consumed at MEMORIZATION Step 6.

## Evaluation files consumed

### iter1

System: claude
- `execution/P7b-project-tier-remainder-prose/evaluation/iter1/claude/project.md`
- `execution/P7b-project-tier-remainder-prose/evaluation/iter1/claude/overall.md`

System: codex
- `execution/P7b-project-tier-remainder-prose/evaluation/iter1/codex/project.md`
- `execution/P7b-project-tier-remainder-prose/evaluation/iter1/codex/overall.md`

### iter2

System: claude
- `execution/P7b-project-tier-remainder-prose/evaluation/iter2/claude/project.md`
- `execution/P7b-project-tier-remainder-prose/evaluation/iter2/claude/overall.md`

System: codex
- `execution/P7b-project-tier-remainder-prose/evaluation/iter2/codex/project.md`
- `execution/P7b-project-tier-remainder-prose/evaluation/iter2/codex/overall.md`

## Memory reads loaded during WORK (pre-execution)

The following project memory files were read before execution to establish the §4.2 contract and
per-type templates:

- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` — rules file; confirmed to rules template
- `.gobbi/projects/gobbi/skills/memorization/templates/mistakes.md` — mistakes template (§4.2:178)
- `.gobbi/projects/gobbi/skills/memorization/templates/reviews.md` — reviews template
- `.gobbi/projects/gobbi/skills/memorization/templates/rules.md` — rules template

## Relevant active mistakes read (pre-execution)

- `.gobbi/projects/gobbi/mistakes/evaluator-false-pass-without-diffing.md` — companion mistake (evaluator must diff, not just inspect headings)
- `.gobbi/projects/gobbi/mistakes/conformance-executor-pre-executed-prose-wave-reshape.md` — prior prose wave reshape mistake (executor scope)
- `.gobbi/projects/gobbi/mistakes/executor-cwd-reset.md` — CWD discipline
- `.gobbi/projects/gobbi/mistakes/subagent-relative-path-write-stray.md` — path write discipline
