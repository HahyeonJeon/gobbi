---
name: orchestration-settings-skip-and-models
description: "Design record for adding a step-level skip boolean, raising maxIterations to 5, and aligning evaluator models in the orchestration settings templates; plus broken symlink fix and doc reconciliation."
type: design
scope: feature
feature: workflow
status: active
created: 2026-06-05
session: 0a9c813f-c83b-48d7-925d-0075ce818d54
tags: [orchestration, settings, skip-key, maxIterations, evaluator-model, symlink, state-machine]
supersedes: null
superseded_by: null
related: [features/workflow/design/drop-legacy-setup-questions.md, backlogs/model-assignment-drift-delegation-vs-settings-default.md]
---

# Orchestration settings: skip key + maxIterations raise + evaluator-model alignment + symlink fix

Implemented and shipped in session `0a9c813f` (2026-06-05). Two commits: `9f77f0e` (main
implementation) + `5b5a30e` (docs-sync remediation after iter1 dual-system eval REVISE).

For the full 500-line implementation spec (research inventory, exact CRUD plan, per-file wording,
ordered task list, open questions), see the session artifact at:
`sessions/2026-06-05-0a9c813f-c83b-48d7-925d-0075ce818d54/ideation/artifacts/orchestration-settings-skip-and-models-design.md`

---

## Context

The orchestration settings templates (`settings.auto.json`, `settings.chat.json`) had four
misalignments with the documented behavior:

1. Evaluator model slots set to `sonnet` / `gpt-5`, while `delegation/SKILL.md` documents evaluator
   as `opus` / `gpt-5.5`.
2. `maxIterations` capped at 3 (auto) and 2 (chat), with wrap-up capped at 1 — too low for
   adversarial-review sessions.
3. No explicit `skip` boolean; the only way to skip a step was the `maxIterations: 0` convention
   (R1 lock), which was implicit and incompletely documented.
4. The `.claude/skills/orchestration/templates/settings.default.json` symlink was broken (target
   absent), with no `.claude/` mirrors for `settings.auto.json` or `settings.chat.json`.

---

## Decision

**A — Evaluator model alignment.** Both templates: `models.claude.evaluator sonnet → opus`;
`models.codex.evaluator gpt-5 → gpt-5.5`. Source of truth: `delegation/SKILL.md` Model Selection
table (evaluator = opus / gpt-5.5). Assistant and executor roles unchanged.

**B — maxIterations raised to 5.** All workflow steps in both templates set to `maxIterations: 5`,
except `settings.chat.json` preparation which stays at `maxIterations: 0` (preserving the R1 lock).

**C — Explicit skip boolean.** A `skip` boolean added as a sibling of `discuss`/`evaluate`/
`maxIterations` in every per-step object of both templates. Auto: all `skip: false`. Chat:
preparation `skip: true` (AND keeps `maxIterations: 0`); all others `skip: false`. Placement:
`skip` immediately before `maxIterations` so the two skip signals read adjacently.

**D — Coexist precedence rule.** A step resolves to `state: Skipped` at loop entry when
`skip: true` OR `maxIterations: 0` — two independent signals, either alone sufficient. The
`maxIterations: 0` / R1-lock path is RETAINED and coexists with the explicit `skip` boolean.
Documentation reconciled across `orchestration/SKILL.md`, `chat-mode.md`, `auto-mode.md`, and
all `workflow/` subdocs to state this rule explicitly. The `evaluate.mode: "skip"` concept
(which skips only the EVALUATION phase, not the whole step) is explicitly distinguished.

**E — Symlink fix.** Removed broken `.claude/skills/orchestration/templates/settings.default.json`
symlink. Created new `.claude/` mirror symlinks for `settings.auto.json` and `settings.chat.json`
using the relative form `../../../../.gobbi/projects/gobbi/skills/orchestration/templates/<file>`.
Repointed the 3 `settings.default.json` mentions in
`features/workflow/design/drop-legacy-setup-questions.md` to `settings.auto.json` (stale
blast-radius co-update).

---

## Rationale

- **Evaluator alignment (A):** templates and delegation skill disagreed silently; any manager reading
  only one source would dispatch evaluators with the wrong model. Aligning to `delegation/SKILL.md`
  (which is the deliberate design doc) fixes the single-source-of-truth problem.
- **maxIterations raise (B):** cap of 3/2/1 was too low for sessions involving adversarial review
  and remediation cycles. Cap of 5 gives sufficient headroom without permitting unbounded looping.
- **Skip boolean (C):** the existing `maxIterations: 0` convention was implicit and required knowing
  R1 lock semantics. An explicit `skip: true` boolean is self-documenting and makes customize-gate
  enumeration straightforward. Both signals are retained for back-compatibility.
- **Symlink fix (E):** broken symlinks are a runtime-invisible defect that causes agents loading
  the skill directory to see incomplete template lists.

---

## Alternatives considered

- **Change `codex.assistant` to `gpt-5.5` across the board:** rejected — only the evaluator role
  is documented in `delegation/SKILL.md` as elevated. `assistant` stays `gpt-5`.
- **Remove `maxIterations: 0` now that `skip: true` exists:** rejected — R1 lock is a documented
  back-compat path; removing it would break existing settings.json files that rely on it.
- **Defer executor-model drift fix (EXECUTOR half of the backlog) to this session:** rejected —
  out of scope. `claude.executor: opus` while `delegation/SKILL.md` says executor=sonnet is a
  separate drift item; left in backlog for a future session (see `backlogs/model-assignment-drift-
  delegation-vs-settings-default.md`).

---

## Consequences

- All new sessions with auto or chat mode template defaults will use `maxIterations: 5` and
  correct evaluator model assignments.
- Chat preparation continues to resolve as `Skipped` via both `skip: true` AND `maxIterations: 0`.
  Opting back in requires clearing BOTH signals.
- The executor model drift (executor=opus in templates vs executor=sonnet in delegation docs)
  remains OPEN — not addressed in this change.
- The `.claude/` templates directory now has no broken symlinks; `settings.auto.json` and
  `settings.chat.json` are mirror-accessible.
