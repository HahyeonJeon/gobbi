---
name: scenario-checklist-skills-shipped
description: Built two new SOP skills, scenario and checklist, via the full gobbi workflow — 5 Ideation iterations + a finalization pass, dual-system Execution, 4 commits.
type: notes
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [refactor, docs-sync]
keywords: [scenario, checklist, sop-skills, dual-system, cold-load-proof]
author: claude
features_touched: [scenario-checklist]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [mechanical-single-primary-from-overlapping-set-impossible, step-back-after-repeated-fixes-on-one-axis, no-touch-git-gate-has-many-fail-open-modes, single-evaluator-pass-is-provisional, dual-production-race-false-degraded-mode, design-should-symmetrically-floor-sibling-resolution-enums, production-mode-not-skill-frontmatter, four-ideation-forks, author-declared-primary-category, ideation-finalization-then-lock, wire-scenario-checklist-into-workflow, p10-cold-load-proof-catches-what-dual-eval-misses, eval-childdocs-selftest-fixture-drift]
---

# Built the scenario + checklist SOP skills, end to end

## What happened

The session ran the full `/gobbi` Auto workflow to design and author two new sibling SOP skills —
`scenario/SKILL.md` and `checklist/SKILL.md` — the shared basis of design AND evaluation authoring
project-wide. Ideation took 5 dual-system iterations (each iteration fixing a finding, several rounds
patching the same "single primary category" classification axis with a different mechanism each time)
plus one bounded user-chosen finalization pass that closed the last 2 mechanical residuals (a symlink
gate leg; a token-scoping de-dup) without spending a 6th iteration. Preparation and Planning each PASSed
in 1 iteration. Execution authored `scenario` first, then `checklist`, both dual-system (Claude producer
+ Codex proposer), each with multiple REVISE rounds, then closed 2 cold-load-proof gaps a fresh-agent
read of each skill in isolation surfaced after dual-eval had already PASSed both.

## What shipped

- Two new skills: `.gobbi/projects/gobbi/skills/scenario/SKILL.md`,
  `.gobbi/projects/gobbi/skills/checklist/SKILL.md`
- 4 commits: `73964df5` (scenario), `8c92b5da` (checklist), `6d3a055b` (cold-load gaps),
  `0cb8f9f2` (wiring fixes)
- New feature memory at `features/scenario-checklist/`: 3 decisions, 1 backlog, README
- 6 project-tier mistakes (`mistakes/assumption/`, `mistakes/verification/`, `mistakes/codex/`) + 1
  skill-owned mistake appended to `skills/skill-writing/mistakes.md`
- 1 project-tier learning (`learnings/process/`) + 1 project-tier backlog (`backlogs/tooling/`)

## What got stuck

Nothing left mid-flight — Ideation, Preparation, Planning, and Execution all reached PASS / complete
before Wrap-up started. The only friction was the "single primary category" classification axis, which
took 4 rounds of mechanical-rule patches before the pattern was named and escalated to the user (see
`mechanical-single-primary-from-overlapping-set-impossible` + `step-back-after-repeated-fixes-on-one-axis`).

## What shifted

The classification mechanism shifted from "derive the primary mechanically from the matched-category
set" (4 failed rounds) to "author-declares the primary, justified; a coverage register + coverage-role
minimums carry completeness independently" — see `author-declared-primary-category`. Ideation's
end-of-loop handling also shifted from "always run a 6th full dual-system iteration on REVISE" to a
user-chosen bounded finalization pass for the 2 remaining mechanical residuals, tool-verified directly
instead of re-evaluated.

## Decisions to respect

- Two sibling skills, not one combined skill; full-expanded 10-category taxonomy; Option A relationship
  (wiring deferred); both skills authored in this one session — `four-ideation-forks`
- Primary category is author-declared + justified, never mechanically derived from the matched set —
  `author-declared-primary-category`
- The no-touch gate needs all 6 legs (including the symlink-traversal leg), not 5 —
  `no-touch-git-gate-has-many-fail-open-modes`
- A single-evaluator PASS is provisional; re-run the missing system before locking a foundation artifact
  — `single-evaluator-pass-is-provisional`

## Next session

Pick up the deferred per-phase pointer wiring + conformance sweep of the 6 existing
`scenario.md`/`checklist.md` bundles (`wire-scenario-checklist-into-workflow`, no hard prerequisite —
both skills already ship complete). Separately, `check-eval-childdocs.sh --self-test`'s stale
`[mirrored-skills-wcl]` fixture (`eval-childdocs-selftest-fixture-drift`) is unrelated low-priority
tooling upkeep.

## Related

- [[four-ideation-forks]] — the locked Scope Contract this session's Ideation produced
- [[author-declared-primary-category]] — the classification-discipline decision
- [[ideation-finalization-then-lock]] — how the design reached LOCKED status
- [[wire-scenario-checklist-into-workflow]] — the deferred wiring backlog
- [[p10-cold-load-proof-catches-what-dual-eval-misses]] — the cold-load-proof learning from Execution
