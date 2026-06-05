---
name: task-01-orchestration-settings-record
description: Chat-mode task-record for the orchestration settings change — evaluator models, maxIterations to 5, new skip key, doc reconciliation, symlink fix.
type: report
scope: feature
feature: workflow
status: active
created: 2026-06-05
session: 0a9c813f-c83b-48d7-925d-0075ce818d54
tags: [chat-mode, task-record, orchestration, settings, skip-key, maxIterations, evaluator-model]
topic: orchestration-settings-task-record
---

# Task 01 — Orchestration settings (skip key + maxIterations + evaluator models + symlink fix)

Chat-mode task-slice record. One slice covered the user's full session goal ("improve orchestration skill", requirements 1–4).

## What was delivered (scope A–E, all user-locked)

- **A. Evaluator models** (both `settings.auto.json` + `settings.chat.json`): `claude.evaluator` sonnet→opus; `codex.evaluator` gpt-5→gpt-5.5. `codex.assistant` deliberately kept `gpt-5`; `claude.executor` untouched.
- **B. maxIterations**: auto — all 5 steps now `5`. chat — ideation/planning/execution/wrap-up `5`; preparation stays `0`.
- **C. New `skip` boolean** on every step in both templates (sibling before `maxIterations`). auto all `false`; chat preparation `true` (keeps `maxIterations:0`), others `false`. Precedence: `skip:true OR maxIterations:0 → Skipped` (two independent signals; R1/`maxIterations:0` path RETAINED — coexist, not replaced).
- **D. Doc reconciliation**: precedence rule + `⊘ Skipped` definition + settings-schema row + cap-value prose + wrap-up "runs once" prose, across `SKILL.md`, `chat-mode.md`, `auto-mode.md` AND (added in remediation) the 8 `workflow/*.md` subdocs + the `gobbi/SKILL.md` front-door customize gate. `evaluate.mode:"skip"` kept distinct from step-`skip`.
- **E. Symlink fix**: broken `.claude/.../settings.default.json` symlink removed; `.claude/` mirrors for `settings.auto.json` + `settings.chat.json` added; stale `settings.default.json` refs in `features/workflow/design/drop-legacy-setup-questions.md` repointed to `settings.auto.json`.

## Workflow trace

- **Ideation** (iter1, PASS): leader produced design artifact `ideation/artifacts/orchestration-settings-skip-and-models-design.md` — whole-repo sweep, exact target JSON, CRUD blast-radius plan, ordered tasks, 4 open questions.
- **Preparation**: Skipped (chat default).
- **Planning**: folded into the leader's ordered task list.
- **Execution** (iter1 → iter2, PASS): commit `9f77f0e` (templates + initial docs), then remediation commit `5b5a30e` (cap-default + skip-gate sync across 10 docs).
- **Evaluation**: dual-system both iters.
  - iter1: Claude PASS / Codex REVISE (4 findings) → aggregated REVISE. Codex caught stale cap defaults in `workflow/` subdocs + the skip customize-gate gap that the literal-grep verification missed.
  - iter2: Claude PASS / Codex PASS → aggregated PASS.

## User decisions during the slice

- Skip semantics: COEXIST (not replace).
- Doc scope: FULL (templates + state-machine docs).
- Symlink drift: FIX in this task.
- OQ-1 (repoint design doc): INCLUDE in-place.
- OQ-2 (drift backlog): LEAVE OPEN — evaluator half closed by change A; executor-half inversion (`claude.executor:opus` vs delegation says sonnet) out of scope. (Manager to annotate at Wrap-up.)
- OQ-3 (cap-prose sync): SYNC ALL now.
- OQ-4 (auto wrap-up 1→5 semantics): INCLUDE prose tweak.
- REVISE remediation scope: FIX EVERYTHING (named docs + 8 workflow subdocs + gobbi front-door gate).

## Commits (worktree branch chore/session-2026-06-05-0a9c813f; develop untouched)

- `9f77f0e` — feat(orchestration): add step-level skip key, raise maxIterations to 5, lift evaluator models
- `5b5a30e` — docs(orchestration): sync remaining cap defaults + skip customize-gate (eval iter1 remediation)

## Open items for Wrap-up

- Annotate `backlogs/model-assignment-drift-delegation-vs-settings-default.md`: evaluator half closed; executor half still open.
- Promote a mistake-candidate: verification grep used narrow literal patterns and the design blast-radius sweep omitted `workflow/` subdocs — Codex's semantic read caught both; lesson = sweep semantically + include the whole skill subtree in blast radius.
- Push branch + open PR (worktree+PR mode).
