---
loop: execution
iter: 2
artifact_type: memory-reads
created_at: 2026-05-27
status: final
supersedes: []
related:
  - ../evaluation/iter1/claude/findings.md
  - ../evaluation/iter1/codex/findings.md
---

# P3a Memory Reads — git-workflow A prose pass

## Evaluation files consumed (all iters, all systems)

### iter1 — Claude

- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P3a-git-workflow-a-prose/evaluation/iter1/claude/findings.md`
  — Verdict: PASS. 0 findings. 2 minor observations (below severity threshold). Full §4.2 contract verification, notes-placement check, D5 scan, leak gate evidence.

### iter1 — Codex

- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P3a-git-workflow-a-prose/evaluation/iter1/codex/findings.md`
  — Verdict: REVISE. 2 findings (F1 broken cross-ref Med/93, F2 contradictory setting key Med/90). Notes-placement confirmation and D5 scan also included.
- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P3a-git-workflow-a-prose/evaluation/iter1/codex/codex-eval-prompt.md`
  — Codex evaluation prompt (read for context).
- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P3a-git-workflow-a-prose/evaluation/iter1/codex/codex-stdout.log`
  — Raw Codex evaluation stdout log.

## Staged mistake-candidate consumed

- `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P3a-git-workflow-a-prose/staging/decisions/prose-reclassification-target-is-project-level-notes.md`
  — Mistake-candidate: notes/ is project-only; prose-wave briefs must never target `features/{f}/notes/`. Staged during manager fix `dc0e5a9`.

## Project memory reads (prior context)

The following project-memory files informed this task but were loaded by the executor, not re-read by memorization:

- `.gobbi/projects/gobbi/skills/memorization/rules.md` — §4 dev-doc standard (§4.1 self-contained prose, §4.2 per-type section contracts, §4.3 reclassification rules, §4.5 leak gate).
- `.gobbi/projects/gobbi/skills/memorization/templates/decisions.md` — decision doc template (ADR shape).
- `.gobbi/projects/gobbi/skills/memorization/templates/design.md` — design doc template (ADR-variant shape).
- `.gobbi/projects/gobbi/skills/memorization/templates/discussions.md` — discussion doc template.
- `.gobbi/projects/gobbi/skills/memorization/templates/notes.md` — notes template (project-only placement rule).

## Mistakes read at task start (per mistake skill P1)

- `evaluator-false-pass-without-diffing` — evaluator must diff actual post-image, not trust executor report.
- `conformance-executor-pre-executed-prose-wave-reshape` — executor must reshape docs, not summarize; the prose-wave executor role requires actual file edits.
- `executor-cwd-reset-commits-task-to-wrong-branch` — cwd resets between bash calls; always use absolute paths for git operations.
- `subagent-relative-path-write-strays-to-main-tree` — relative-path writes from a worktree subagent land in the main tree; always verify toplevel before writing.
