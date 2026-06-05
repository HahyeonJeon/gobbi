---
name: 2026-06-05-skip-key-maxiterations-evaluator-models
description: "Shipped: step-level skip boolean, maxIterations raised to 5, evaluator models aligned (opus/gpt-5.5), broken symlink fixed, doc reconciliation across orchestration skill tree."
type: changelogs
scope: feature
feature: workflow
status: active
created: 2026-06-05
session: 0a9c813f-c83b-48d7-925d-0075ce818d54
tags: [orchestration, settings, skip-key, maxIterations, evaluator-model, symlink, doc-sync]
---

# 2026-06-05 — skip key + maxIterations + evaluator models + symlink fix

Session `0a9c813f` (2026-06-05). Two commits on `chore/session-2026-06-05-0a9c813f`:

- `9f77f0e` — main implementation (Tasks 1–6: templates + SKILL.md + chat-mode + auto-mode + symlinks + project-memory repoint)
- `5b5a30e` — docs-sync remediation (REVISE findings from iter1 dual-system eval: stale cap literals + customize-gate omission + workflow subdoc stale defaults + codex evaluator default in evaluation.md)

## Changes shipped (A–E)

**A — Evaluator model alignment**
- `settings.auto.json` + `settings.chat.json`: `models.claude.evaluator sonnet → opus`;
  `models.codex.evaluator gpt-5 → gpt-5.5`.
- Source of truth: `delegation/SKILL.md` Model Selection table (evaluator = opus / gpt-5.5).
- `models.codex.assistant` stays `gpt-5`; `models.claude.executor` stays `opus`.

**B — maxIterations raised to 5**
- `settings.auto.json`: ideation/preparation/planning/execution `3 → 5`; wrap-up `1 → 5`.
- `settings.chat.json`: ideation/planning/execution `2 → 5`; wrap-up `1 → 5`; preparation stays `0`.

**C — Explicit skip boolean added**
- `skip` boolean added to every per-step object in both templates (sibling before `maxIterations`).
- Auto: all `skip: false`. Chat: preparation `skip: true` (AND keeps `maxIterations: 0`); all
  others `skip: false`.

**D — Doc reconciliation**
- `orchestration/SKILL.md`: `⊘ Skipped` row (two-signal trigger), state-machine note (canonical
  "Loop-entry Skipped resolution — two independent signals" block), schema-shape row (`skip` added
  to settings per-step object), customize-gate enumeration (added `per-step skip`).
- `orchestration/chat-mode.md`: preparation described as both-signals (`skip: true` AND
  `maxIterations: 0`); opt-in must clear BOTH; cap-prose swept to `5`; ASCII diagram `maxIter`
  labels updated; wrap-up semantics updated for OQ-4.
- `orchestration/auto-mode.md`: defaults table `3/1 → 5`; preparation row `skip:false`+`max:5`
  vs Chat contrast; evaluate.mode-vs-step-skip disambiguation note added; cap-prose swept to `5`.
- `skills/orchestration/workflow/` subdocs (ideation/preparation/planning/execution/wrap-up/
  memorization/evaluation): default cap references updated from `3/1` to `5`.
- `skills/gobbi/SKILL.md:89`: `step skip` added to the front-door customize-gate enumeration.
- `features/workflow/design/drop-legacy-setup-questions.md`: 3 mentions of
  `settings.default.json` → `settings.auto.json` (stale blast-radius co-update for E).

**E — Symlink fix**
- Deleted broken `.claude/skills/orchestration/templates/settings.default.json` (target absent).
- Created `.claude/skills/orchestration/templates/settings.auto.json` (symlink).
- Created `.claude/skills/orchestration/templates/settings.chat.json` (symlink).
- Both use relative form `../../../../.gobbi/projects/gobbi/skills/orchestration/templates/<file>`.

## Dual-system evaluation outcome

Iter1: Codex REVISE — 4 findings (COD-USAGE-001: skip missing from customize gate;
COD-CONS-001: stale cap literals in SKILL.md + chat-mode diagram; COD-CONS-002: stale
defaults in 8 workflow subdocs; COD-CONS-003: codex evaluator default in evaluation.md).

Iter2: Both Claude + Codex PASS. All 4 findings verified resolved. Invariants held:
- R1 lock / `maxIterations: 0` retained (coexists).
- `codex.assistant` stays `gpt-5`.
- Templates not re-edited in iter2 (docs-only remediation confirmed).

## Scope guards honored

- `claude.executor` (opus) and `claude.assistant` (sonnet) not touched.
- `codex.assistant` (gpt-5) not touched.
- `maxIterations: 0` / R1-lock path retained everywhere.
- `evaluate.mode: "skip"` preserved as a separate concept.
- `state.template.json` / `session.template.json` not edited (no `skip` field needed there).
- Executor-model drift backlog (`model-assignment-drift-delegation-vs-settings-default.md`)
  left OPEN — EVALUATOR half resolved; EXECUTOR half remains.
- Immutable `notes/` historical mentions of `settings.default.json` left untouched.

## Task 02 — Executor-model drift closure (same session, commit `98c91b8`)

A follow-on task within the same session closed the executor half of the model-assignment drift
backlog (`backlogs/model-assignment-drift-delegation-vs-settings-default.md`).

**Problem:** Task 01 aligned the evaluator model in the settings templates to match
`delegation/SKILL.md`. The executor model was left as a separate item: templates carried
`models.claude.executor: "opus"`, while `delegation/SKILL.md` and other docs stated
executor=sonnet — the inversion was in the docs, not the templates.

**Fix (commit `98c91b8`):** updated four documentation files to document executor=opus,
matching the templates:

- `skills/delegation/SKILL.md` — Model Selection table executor row: sonnet → opus
- `skills/gobbi/SKILL.md` — executor model reference: sonnet → opus
- `skills/planning/SKILL.md` — executor model reference: sonnet → opus
- `agents/executor.md` — agent spec executor model: sonnet → opus

Settings templates not changed (they were already correct). Drift is fully resolved.

**Scope guards honored:** prior-session history files (`features/install-runtime/plans/` and
`features/install-runtime/decisions/`) were left untouched — their `executor=sonnet` references
accurately describe the 2026-05-30 plan state when executor was sonnet.

---

## Files changed: 17 total

### iter1 (commit 9f77f0e) — 7 files
`skills/orchestration/templates/settings.auto.json`,
`skills/orchestration/templates/settings.chat.json`,
`skills/orchestration/SKILL.md`,
`skills/orchestration/chat-mode.md`,
`skills/orchestration/auto-mode.md`,
`features/workflow/design/drop-legacy-setup-questions.md`,
`.claude/skills/orchestration/templates/` (symlink delete + 2 creates)

### iter2 / remediation (commit 5b5a30e) — 10 docs-only files
`skills/orchestration/SKILL.md`,
`skills/gobbi/SKILL.md`,
`skills/orchestration/chat-mode.md` (ASCII diagram),
`skills/orchestration/workflow/ideation.md`,
`skills/orchestration/workflow/planning.md`,
`skills/orchestration/workflow/preparation.md`,
`skills/orchestration/workflow/execution.md`,
`skills/orchestration/workflow/wrap-up.md`,
`skills/orchestration/workflow/memorization.md`,
`skills/orchestration/workflow/evaluation.md`
