# Planning Eval iter2 — Project perspective (Claude)

**Frame:** Does the plan deliver the locked contract (idea/scope/design D1-D10, FIX-1) without scope drift, and are the iter1 Project findings closed?

## iter1 finding under this lens
- **DOC-PROJECT-1 (archive-glob scope leak, High/100): CLOSED.** Re-run at HEAD: 2 nested-feature archive content docs (`install-runtime/archive/references/2026-05-22-ideation-references.md`, `workflow/archive/decisions/2026-05-23-iter1-user-redirects.md`) + 5 archive READMEs = the exact 7 frozen docs the plan enumerates (Counts note lines 170-177). Every `**` `files:` glob now either carries `exclude: "**/archive/**"` (agents, evaluation, guardrails, project-memory, workflow, N1 README — 12 exclude lines verified) OR is subdir-enumerated under typed dirs (`{discussions,design,decisions}/**`, `{backlogs,...}/**`) that cannot reach `archive/` because archive is a SIBLING of the typed dirs, not nested (verified: `install-runtime/archive/references/` not `install-runtime/references/archive/`). The edit-glob now matches the count predicate exactly. D10 + the Out-of-Scope archive exclusion (line 880-882) are honored across all 25 records.

## Fresh pass
- Scope faithful to locked decisions: `features/agents` correctly kept in-scope (T1, count correction not scope change — re-verified 222 total, 14 agents docs, 4 agents leaks). FLAG-2 (new eval perspective) and FLAG-3 (.claude/ standard) remain DEFERRED. Top-level `agents/` spec dir correctly excluded. PR #272 merge deferred.
- T10 retargeted to `.codex/AGENTS.md` real file stays inside the project-memory + AGENTS reconciliation scope (no `.claude/` surgery).
- Every task carries a `traces-to` anchor quoting scope-contract/idea; spec-coverage table maps every SC/in-scope item to ≥1 task. No anchor-less task.

**Verdict: PASS** — no scope drift; the archive-leak scope violation is genuinely closed.
