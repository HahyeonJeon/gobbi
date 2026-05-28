---
loop: execution
iter: 2
artifact_type: memory-reads
created_at: 2026-05-27
status: final
supersedes: []
related:
  - artifacts/change-summary.md
  - artifacts/verification-report.md
---

# P6a Memory Reads

Enumerates every evaluation file consumed during this task's MEMORIZATION run,
per the `memorization/SKILL.md § Artifact frontmatter schema` contract for
`artifact_type: memory-reads`.

---

## Evaluation files consumed

### iter1

- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P6a-project-memory-prose/evaluation/iter1/claude/overall.md`
- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P6a-project-memory-prose/evaluation/iter1/codex/overall.md`

### iter2

- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P6a-project-memory-prose/evaluation/iter2/claude/overall.md`
- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P6a-project-memory-prose/evaluation/iter2/codex/overall.md`

---

## Project-memory files read (relevant to this task)

Rules and standards consulted during the task:

- `.gobbi/projects/gobbi/rules/rules.md` — §4.2 (line 177 design=ADR), §4.3,
  §4.4 (KEEP)
- `.gobbi/projects/gobbi/features/project-memory/design/dev-doc-memory-standard.md`
  — line 50 (design=ADR standard)
- `.gobbi/projects/gobbi/features/project-memory/templates/design.md` — 8-section
  shape (contradicts ADR; surfaced as stale)
- `.gobbi/projects/gobbi/features/project-memory/templates/decisions.md`
- `.gobbi/projects/gobbi/features/project-memory/templates/checklists.md`
- `.gobbi/projects/gobbi/features/project-memory/templates/references.md`

Mistake files read (pre-task load):

- `.gobbi/projects/gobbi/mistakes/evaluator-false-pass-without-diffing.md`
- `.gobbi/projects/gobbi/mistakes/conformance-executor-pre-executed-prose-wave-reshape.md`
- `.gobbi/projects/gobbi/mistakes/executor-cwd-reset.md`
- `.gobbi/projects/gobbi/mistakes/subagent-relative-path-write-stray.md`
