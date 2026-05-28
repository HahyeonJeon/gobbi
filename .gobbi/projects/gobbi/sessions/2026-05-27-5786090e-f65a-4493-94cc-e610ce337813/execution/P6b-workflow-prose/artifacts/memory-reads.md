---
loop: execution
iter: 2
artifact_type: memory-reads
created_at: 2026-05-27
status: final
supersedes: []
related:
  - ../artifacts/change-summary.md
  - ../artifacts/verification-report.md
---

# P6b Memory Reads

Enumerates every evaluation file and project-memory artifact consumed by this MEMORIZATION run
(per memorization/SKILL.md Step 5 — `artifact_type: memory-reads` is mandatory on PASS).

## Evaluation files consumed

### iter1 — Claude system

- `sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P6b-workflow-prose/evaluation/iter1/claude/findings.md`
  — PASS verdict; 2 LOW advisory observations; full D5 scan + cross-ref resolution + §4.5 leak gate results

### iter1 — Codex system

Codex evaluation findings captured in delegation facts (no separate file present in evaluation tree):
- F1: `design/task-decomposition-10-tasks.md` missing `## Related` body section vs siblings
- F2: `changelogs/bundle-a-rehome.md` cross-ref pointing at retired-feature path, not archive path
- Verdict: REVISE

## Project-memory artifacts read

### Rules

- `.gobbi/projects/gobbi/rules/rules.md` (via worktree at `.claude/...`) — §4 dev-doc standard;
  §4.2:177 design=ADR contract; §4.3 body-scope compliance; §4.5 leak gate definition; per-type
  templates (design/decisions/checklists/discussions/changelogs/backlogs/plans/feature-readme)

### Mistakes read

- `evaluator-false-pass-without-diffing` — evaluator must diff actual changes, not infer from description
- `conformance-executor-pre-executed-prose-wave-reshape` — executor must not pre-apply prose wave when
  briefed; prose wave is a distinct task
- `executor-cwd-reset` — cwd resets between bash calls; always use absolute paths
- `subagent-relative-path-write-stray` — relative paths in Write tool cause stray file creation outside
  intended directory

## Skills loaded

- `principles/SKILL.md` — 13 Iron Laws (behavioral discipline floor)
- `mistake/SKILL.md` — mistake staging + promotion model
- `memorization/SKILL.md` — artifact frontmatter schema; staging rules; PASS procedure
- `.gobbi/projects/gobbi/rules/rules.md` — §4 dev-doc standard (all per-type contracts)
