---
name: agents-md-13-principles-confirm-defer-at-planning
description: The AGENTS.md 12→13 principle count edit is evaluator-recommended (not directly user-ratified); Planning must surface a confirm/defer decision before Execution touches entrypoint files.
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [agents-md, principles, entrypoint, planning-gate]
decision_status: proposed
finding-iter: 2
finding-id: pr-1-n2
disposition: open
---

# AGENTS.md 13-principle reconciliation: confirm or defer at Planning

## Context

The Ideation drift adds a checklist item (`checklist/principle-drift-entrypoint-reconciliation.md`)
to reconcile AGENTS.md + .codex/AGENTS.md from 12 to 13 principles. This item was introduced by
the evaluator (Codex F4, iter1) and carried into iter2 — it was NOT directly ratified by the user
via AskUserQuestion.

The drift is real and the fix is defensible against Q8 (it is a narrow count-consistency fix, not
Principle-13 surgery). However, it touches two entrypoint files that Codex agents read at session
start.

## Decision (proposed — must be confirmed at Planning)

At Planning, present this as a task with a confirm/defer gate:

- **Option A — Confirm:** the AGENTS.md and .codex/AGENTS.md edits are scoped as a narrow
  count-row consistency fix anchored to the existing Codex F4 finding. The executor updates
  both files to say "13 principles" + adds the P13 row, matching .claude/CLAUDE.md exactly
  (no new content, no P13 surgery). User approves before Execution.
- **Option B — Defer:** treat the AGENTS.md entrypoint reconciliation as a follow-up backlog
  item, not a task in this session. The standard can be authored (relies on P13 as part of
  the checklist item's warrant) without the entrypoints being updated, but the consistency
  gap remains.

## Consequences

- If confirmed: the AGENTS.md edit is a narrow, low-risk, bounded task.
- If deferred: file `checklist/principle-drift-entrypoint-reconciliation.md` item #7 marks
  deferred; a backlog item is created for the reconciliation.
- Either way: the Ideation contract is valid (the drift was identified and routed; the
  disposition decision is a Planning gate, not an Ideation defect).

## Related

- `ideation/evaluation/iter2/claude/overall.md` (PR-1, Low/50)
- `ideation/evaluation/iter2/codex/overall.md` (N2, Low/60)
- `ideation/staging/checklists/principle-drift-entrypoint-reconciliation.md`
