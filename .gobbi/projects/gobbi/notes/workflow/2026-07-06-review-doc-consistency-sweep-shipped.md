---
name: review-doc-consistency-sweep-shipped
description: 2026-07-01 review doc-consistency sweep (Option A) — 20 doc rows + 2 extensions + 3 twins fixed across 15 commits / 40 files; new claude authoring skill; FLAG-2 resolved.
type: notes
scope: project
feature: null
status: active
created: 2026-07-06
session: 1faa4e51-9395-4d58-87b8-e7f47f59f81b
tags: [docs-sync, evaluation, process]
keywords: [adversarial-review, doc-consistency, option-a, claude-skill, blast-radius, right-sizing]
author: claude
features_touched: []
loops_completed: [ideation, planning, execution, wrap-up]
shipped: [remaining-review-fixes-reconciliation, dual-system-eval-catches-divergent-blast-radius-misses, live-tree-frontmatter-violations, references-provenance-frontmatter-vs-body]
---

# 2026-07-01 review doc-consistency sweep shipped

## What happened

Ran the gobbi Auto workflow to fix the "2026-07-01 review doc-consistency sweep" (Option A,
user-locked). Ideation produced a deduped, de-stale-verified reconciliation of both adversarial-
review corpora and recommended Option A — the ~20 doc-only 2026-07-01 rows plus the two 1-line
twins and the link/missing-skill sweep — as the highest-value, lowest-risk first cut. Planning
decomposed it into ~12 executor tasks (T01–T12) grouped by shared-file locality. Execution
implemented them one task at a time; the mandatory dual-system Execution eval returned REVISE,
one remediation iter fixed the findings, and iter2 PASSed.

The scope grew by the contract: 20 review rows + 2 user-approved blast-radius extensions + 3
blast-radius twins caught in review = fixed across **15 commits / 40 files**. A new
`skills/claude/SKILL.md` `.claude/`-authoring standard was created and mirrored (R29), and FLAG-2
(the `.claude/CLAUDE.md` dangling link to the then-absent claude skill) was resolved.

## What shipped

Code / doc edits (the sweep itself — 15 commits, 40 files, on the session branch / PR): the
2026-07-01 doc rows R1–R11, R13–R18, R28, R29, R30, plus CO-2 and two approved extensions. New
`skills/claude/SKILL.md` + mirrors. Details and per-row SHIPPED/OPEN status are in the durable
backbone below.

Memory promotions this session (Wrap-up):

- `backlogs/evaluation/remaining-review-fixes-reconciliation.md` — the deduped, de-stale backbone of BOTH review corpora (the session's highest-value durable artifact).
- `learnings/evaluation/dual-system-eval-catches-divergent-blast-radius-misses.md` — the dual-eval blast-radius divergence witness.
- `skills/planning/mistakes.md` — new `## ` section "Tree-grep each finding's defect string during decomposition".
- `backlogs/memory/live-tree-frontmatter-violations.md` — 33 pre-existing frontmatter violations (found incidentally).
- `backlogs/memory/references-provenance-frontmatter-vs-body.md` — the R17 provenance-placement follow-up decision.
- `backlogs/process/layer2-references-stale-after-system-dropped.md` — flipped to `closed` (verified already-fixed).

## What got stuck

Nothing blocked. The dual-eval REVISE was the expected in-loop signal, not a stuck thread: each
evaluator caught a DIFFERENT blast-radius twin (Codex → R8 in `delegation/SKILL.md`; Claude →
R13 in `chat-mode.md`), iter2 fixed both plus a Medium (chat-mode Revising) and Lows, and a 3rd
R8 twin (a cost reference) surfaced from an executor's tree-wide grep and was fixed.

## What shifted

Right-sizing choices for a doc-only, high-locality sweep (held against the default full dual
run): single-mode production at Ideation and Execution; Ideation + Planning evaluation SKIPPED
(optional at the earlier steps); Preparation SKIPPED as a loop (recon during Ideation verified
readiness); the mandatory dual-system evaluation ran at Execution and drove the one REVISE→PASS
cycle.

## Decisions to respect

- **Option A was the locked scope** — the 2026-07-01 doc rows, not the tooling wave or the
  2026-06-29 corpus. The remaining work is multi-session (see Next session).
- **Blast-radius extensions were user-approved**, not silent scope creep — the 2 extensions and
  the 3 twins each traced to a scope-contract decision.
- **R17 provenance was placed in the references template BODY, not frontmatter**, on purpose (the
  references frontmatter extension set is a closed allowlist). Reopening that needs the follow-up
  decision in `backlogs/memory/references-provenance-frontmatter-vs-body.md`.
- **Layer-2 is dropped** — the stale backlog is closed; do not re-open it.

## Next session

Pick up from the reconciliation backbone
(`backlogs/evaluation/remaining-review-fixes-reconciliation.md`). Remaining: **R12** (native-Codex
load path), **R19–R27** (tooling: schema/harness validators + Codex smoke/compat scripts + the
GEN-D7-004 chat scaffold drift-gate), and the **2026-06-29 G2/G3 corpus** (~150 findings, which
still needs a finding-level de-stale pass first). The S5-staleness Criticals D1-001/002 want a
**design** session, not a fix session.

## Related

- [[remaining-review-fixes-reconciliation]] — the durable backbone this session produced
- [[dual-system-eval-catches-divergent-blast-radius-misses]] — the dual-eval learning promoted this session
- [[live-tree-frontmatter-violations]] — memory cleanup backlog spun out this session
- [[references-provenance-frontmatter-vs-body]] — the R17 follow-up decision
- [[2026-07-06-harness-todo-and-gen-d4-003-shipped]] — the prior session note (the fix campaign step before this one)
