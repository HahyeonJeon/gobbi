---
name: handoff-python-compaction
description: Python-skill compaction (PR #349) shipped Tasks 1-3 of 8 with full dual-system PASS; Tasks 4-8 remain for the next session.
type: notes
scope: project
feature: null
status: active
created: 2026-07-14
session: 44971171-d5eb-4834-83fc-ff42e62460a7
tags: [evaluation, process, docs-sync]
keywords: [python-skill, compaction, pr-349, dual-system, word-band, handoff]
author: claude
features_touched: []
steps_completed: [ideation, wrap-up]
shipped: [fork-decisions-locked, gate-c-structural-mapping-is-not-semantic-union-preservation, consolidating-per-perspective-verification-tables-narrows-the-union, reharden-edit-blast-radius-miss, dual-system-catches-union-narrowing-in-compaction, cited-process-mistake-not-applied-to-own-artifact]
---

# Python-skill compaction session — Tasks 1-3 shipped, 4-8 remain (PR #349)

## What happened

This session ran the ideation pass for the python-skill quality/compaction/reframe work (PR #349, 10
existing docs, 35,193 words baseline), locked five forks with the user (see
[[fork-decisions-locked]]), then began Execution against the locked plan. Execution completed Tasks 1
through 3 of an 8-task decomposition, each running full dual-system (Claude + Codex) evaluation before
its commit landed. This note closes out the session's memory promotion; Tasks 4-8 continue in the next
session, in the same worktree and branch.

## What shipped

- **Task 1 — `SKILL.md`** — commit `5b9755c1`, 4,095 words. Dual-system: Claude PASS, Codex
  REVISE-then-fixed (caught a softened-item over-scrub). See [[softening-can-narrow-scope-like-a-merge]]
  (`skills/skill-writing/mistakes.md`).
- **Task 2 — `scenarios.md` + `checklists.md`** (new triad members) — commit `b002ad9c`, 1,413 + 1,722
  words. Dual-system: Claude REVISE-then-fixed, Codex FAIL-then-fixed (both caught an 82-to-22
  bullet-consolidation union-narrowing; 6 dropped conditions restored). See
  [[gate-c-structural-mapping-is-not-semantic-union-preservation]].
- **Task 3 — `evaluation.md`** — commit `b829f131`, 2,563 words. Dual-system: both systems PASS (first
  no-REVISE task this pass). Gate A closed 32/32 live checks with 0 stale; the Task 2 crosswalk gap was
  fixed.
- Memory promotions this session: [[fork-decisions-locked]] (the 5 locked forks), 3 new project
  mistakes under `mistakes/docs-sync/` ([[gate-c-structural-mapping-is-not-semantic-union-preservation]],
  [[consolidating-per-perspective-verification-tables-narrows-the-union]],
  [[reharden-edit-blast-radius-miss]]), 3 skill-owned mistake sections
  (`skills/skill-writing/mistakes.md`, `skills/evaluation/mistakes.md`, `skills/codex/mistakes.md`), a
  recurrence witness appended to [[cited-process-mistake-not-applied-to-own-artifact]], and one project
  learning ([[dual-system-catches-union-narrowing-in-compaction]]).

## What got stuck

**Word-band tension for Task 8.** The three shipped docs came in 1,393 words over the ideation-plan
targets — every overage is union-completeness restoration the dual-system evaluation forced (`SKILL.md`
+195, `evaluation.md` +313, the new scenarios/checklists pair +885). Union scope is the floor
(precedence over the word-band target — see [[fork-decisions-locked]] decision 3). If the five
remaining docs land exactly on their `§6e` plan targets, the full 10-doc bundle trends to roughly
25,400 words against a 24,500-word ceiling. Task 8 must either bring the remaining docs in roughly 940
words under their targets (plausible — most remaining docs are pure compactions, not additions) or the
next session accepts a slight over-band with the user, checked against the real final aggregate word
count.

**Deferred low-priority cleanup.** `evaluation.md`'s legend has a softened-anchor note whose spelling
does not yet match its siblings (roughly lines 70-71) — a Low finding from Task 3's evaluation,
deliberately deferred to Task 8's final cleanup pass rather than fixed mid-task.

## What shifted

No direction change — Execution followed the locked ideation plan (`§6e` targets, `§7` gates)
throughout. What shifted was the WORD BUDGET expectation: the plan assumed the existing-10/new-2 split
would land at target, but dual-system evaluation forced net word ADDITIONS on 2 of the 3 shipped docs
to restore dropped union conditions — a expected-trim-became-net-add pattern, not a scope change.

## Decisions to respect

- **Union scope is the floor.** Never trim content to hit the word band at the cost of dropping a
  source condition — see [[fork-decisions-locked]] decision 3 and its rationale.
- **Keep full dual-system evaluation for every remaining task.** The Codex evaluator caught a real
  union-narrowing on every compaction task the Claude-side structural check passed (Task 1's dunder
  over-scrub, Task 2's dropped idioms); the pattern held clean on Task 3 once both systems hunted for
  it up front. See [[dual-system-catches-union-narrowing-in-compaction]]. Evaluators must diff
  pre-edit vs post-edit content for dropped conditions across BOTH the hard-rule set and the softened
  set — a count or structural-mapping match alone is not sufficient.
- **The 5 locked forks in [[fork-decisions-locked]]** (the 8-principle set, the 18-item hard-invariant
  register, the 23,500-24,500-word band, the scenario/checklist/evaluation triad shape, and the
  disambiguated anchor vocabulary) may not be re-opened without a new user decision.
- **Reuse the SAME worktree and branch** — do not create a new one. Tooling baseline was confirmed
  clean at `2-preparation/outputs/readiness.md`; new-file symlinks are sync-owned; the `rg` shim lives
  at `~/.local/bin/rg`.

## Next session

Continue PR #349 in the same worktree and branch. Remaining Tasks 4-8, full dual-system per the user's
standing instruction:

- **T4** — `design.md` (apply the class-necessity principle, relax the data-model prescription, and
  emphasize bottom-up construction; target roughly 2,400 words).
- **T5** — `convention.md` (target roughly 1,800 words) + `typing.md` (target roughly 1,600 words).
- **T6** — `concurrency.md` (target roughly 2,150 words; restore the timeout hard-invariant's detail
  in the doc body) + `performance.md` (target roughly 2,000 words; turn its Footguns section into a
  pointer index).
- **T7** — `testing.md` (target roughly 1,900 words) + `packaging.md` (target roughly 1,700 words) +
  `interoperability.md` (target roughly 2,100 words).
- **T8** — Wiring + verification: run the doc-sync check; run both standing guards; compile every code
  block against the locked 9-fragment allowlist (4 in `concurrency.md`, 4 in `performance.md`, 1 in
  `testing.md`, 1 in `typing.md`); run the `§7` Gate A/B/C pass on the final tree; total the aggregate
  word count; fix the deferred Task-3 Low (the `evaluation.md` legend spelling drift); make the final
  commit and push the whole PR.

Re-read the ideation plan (`sessions/2026-07-14-44971171-d5eb-4834-83fc-ff42e62460a7/1-ideation/outputs/ideation-plan.md`,
`§6e` targets + `§7` gates) before starting Task 4.

## Related

- [[fork-decisions-locked]] — the 5 locked forks this pass decomposes against
- [[dual-system-catches-union-narrowing-in-compaction]] — the session's headline process insight
- [[gate-c-structural-mapping-is-not-semantic-union-preservation]] — the Task 2 union-narrowing defect
- [[reharden-edit-blast-radius-miss]] — the consumer-sweep gap the fork decisions' re-hardening exposed
