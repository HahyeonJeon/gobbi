---
name: 2026-06-05-orchestration-settings-skip-models
description: "Session journal: orchestration settings skip key, maxIterations raise, evaluator-model alignment, symlink fix, and doc reconciliation shipped in two commits."
type: notes
scope: project
feature: null
status: active
created: 2026-06-05
session: 0a9c813f-c83b-48d7-925d-0075ce818d54
tags: [orchestration, settings, skip-key, maxIterations, evaluator-model, symlink, doc-sync]
features_touched: [workflow]
---

# 2026-06-05 — Orchestration settings: skip key + maxIterations + evaluator models

Session `0a9c813f` on worktree `chore/session-2026-06-05-0a9c813f`. Workflow ran
manager-direct (informal loops, no per-loop MEMORIZATION sub-agents).

---

## What happened

The user arrived with five concrete scope items (A–E) already locked: evaluator-model alignment,
maxIterations raise, new `skip` boolean, doc reconciliation, and broken symlink fix. No
Ideation discussion phase — the design was produced directly by the leader as an Ideation WORK
artifact, then handed to the executor.

The leader produced a 500-line design artifact (`ideation/artifacts/orchestration-settings-
skip-and-models-design.md`) covering: a repo-wide reference inventory (§2), exact target JSON
specs for both templates (§3), per-file doc-reconciliation wording (§4), a Principle-13 CRUD
blast-radius plan (§5), an ordered 6-task execution list (§6), and 4 open questions (§7).

Before the executor ran, the manager resolved the open questions:
- OQ-1 (project-memory repoint of drop-legacy-setup-questions.md): INCLUDE as Execution Task 6
- OQ-2 (drift backlog closure): LEAVE OPEN — executor model drift is out of scope
- OQ-3 (full cap-prose sync): INCLUDE — full sweep of stale "default = 2/3" in both mode docs
- OQ-4 (wrap-up maxIterations 1→5 semantics): INCLUDE — update "runs once" prose

---

## What shipped

**Commit `9f77f0e`** — main implementation. 7 files, +83/-60:

- `settings.auto.json` + `settings.chat.json`: evaluator models lifted (A), all relevant
  `maxIterations` raised to 5 (B), `skip` boolean added to all per-step objects (C).
- `orchestration/SKILL.md`: `⊘ Skipped` row two-signal; state-machine note canonical
  precedence block; schema row updated.
- `orchestration/chat-mode.md`: preparation described as both-signals; opt-in clears both;
  cap-prose swept; wrap-up semantics updated.
- `orchestration/auto-mode.md`: defaults table raised; preparation row contrast updated;
  evaluate.mode disambiguation note added; cap-prose swept.
- `features/workflow/design/drop-legacy-setup-questions.md`: 3 stale `settings.default.json`
  references repointed to `settings.auto.json` (OQ-1).
- `.claude/skills/orchestration/templates/`: broken `settings.default.json` symlink deleted;
  `settings.auto.json` + `settings.chat.json` symlinks created (E).

**Commit `5b5a30e`** — docs-sync remediation (REVISE round). 10 docs-only files:

The iter1 dual-system evaluation returned REVISE (Codex). The evaluator found that the
literal-grep verification in iter1 (`default = 2`, `default = 3`) missed variant cap forms
(`(default 3)`, `maxIter=2`, `1 / 3`, `default \`3\``) and did not catch the workflow subdoc
references or the customize-gate omission of the new `skip` key. This is the same class of
error as the `claude-evaluator-step4-only-vs-codex-whole-file-grep` mistake.

Remediation touched: `orchestration/SKILL.md` (cap default + customize-gate), `gobbi/SKILL.md`
(customize-gate front-door), `chat-mode.md` (ASCII diagram `maxIter` labels), and 7
`workflow/` subdocs (ideation/preparation/planning/execution/wrap-up/memorization/evaluation).

---

## What got stuck

Nothing was stuck. The executor completed all 6 tasks without blockers. The REVISE round
required one additional commit but was straightforward.

---

## What shifted

The user decided (via the 4 OQ dispositions) that full doc scope was in bounds — the executor
should update all stale cap-prose in both mode docs (OQ-3=INCLUDE), not just the named lines.
This widened the iteration2 verification from narrow literal patterns to a broad semantic sweep,
which is what caused Codex's REVISE finding on the narrow iter1 verification.

The mistake candidate (literal-grep coverage too narrow during iter1 verification) was discussed.
The user decided it is already captured by the existing mistake
`claude-evaluator-step4-only-vs-codex-whole-file-grep.md` and no new mistake file is needed.

---

## Decisions to respect

1. `maxIterations: 0` / R1-lock path RETAINED — coexists with `skip: true`; do NOT collapse to
   a single signal in future sessions.
2. `codex.assistant` stays `gpt-5` — only evaluator/manager/leader/executor were lifted to
   gpt-5.5.
3. Chat preparation carries BOTH `skip: true` AND `maxIterations: 0`; opt-in requires clearing
   BOTH signals.
4. Executor model drift (EXECUTOR half: templates `opus` vs delegation docs `sonnet`) remains
   OPEN — out of scope for this session.
5. Immutable `notes/` files were not edited (they record what was true at the time); only the
   living `design/` file was repointed.

---

## Next session

No blocking follow-ups from this session. The remaining open item is the executor-model drift
backlog (`backlogs/model-assignment-drift-delegation-vs-settings-default.md`) — EXECUTOR half
still needs a decision session. The `#258` drift-detector backlog (detecting settings vs
delegation mismatches) is also still open.
