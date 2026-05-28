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
---

# AGENTS.md 13-principle reconciliation: confirm or defer at Planning

## Context

The Ideation drift adds a checklist item ([principle-drift-entrypoint-reconciliation](../checklists/principle-drift-entrypoint-reconciliation.md))
to reconcile `AGENTS.md` + `.codex/AGENTS.md` from 12 to 13 principles. This item was surfaced by a
Codex evaluation and carried forward — it was NOT directly ratified by the user via AskUserQuestion.

The drift is real and the fix is defensible against Q8 (it is a narrow count-consistency fix, not
Principle-13 surgery). However, it touches two entrypoint files that Codex agents read at session
start.

## Decision (proposed — must be confirmed at Planning)

At Planning, present this as a task with a confirm/defer gate:

- **Option A — Confirm:** the `AGENTS.md` and `.codex/AGENTS.md` edits are scoped as a narrow
  count-row consistency fix anchored to the existing Codex finding. The executor updates
  both files to say "13 principles" + adds the P13 row, matching `.claude/CLAUDE.md` exactly
  (no new content, no P13 surgery). User approves before Execution.
- **Option B — Defer:** treat the `AGENTS.md` entrypoint reconciliation as a follow-up backlog
  item, not a task in this session. The standard can be authored (it relies on P13 as part of
  the checklist item's warrant) without the entrypoints being updated, but the consistency
  gap remains.

## Rationale

The edits touch two entrypoint files that Codex agents read at session start, so they are not
purely cosmetic — but they are also not Principle-13 surgery (no new enforcement, no new behavioral
content), which keeps them defensible against the "avoid unnecessary change" steer. Because the
warrant is evaluator-derived rather than user-ratified, the decision is staged as a Planning gate
rather than executed silently.

## Alternatives considered

Execute the edits directly during Ideation without a Planning gate — rejected: the edits touch
entrypoint files and lack direct user ratification, so they require an explicit confirm/defer
decision before an executor touches them.

## Consequences

- If confirmed: the `AGENTS.md` edit is a narrow, low-risk, bounded task.
- If deferred: the [principle-drift-entrypoint-reconciliation](../checklists/principle-drift-entrypoint-reconciliation.md)
  checklist item #7 marks deferred and a backlog item is created for the reconciliation.
- Either way: the Ideation contract is valid (the drift was identified and routed; the
  disposition decision is a Planning gate, not an Ideation defect).

## Related

- [principle-drift-entrypoint-reconciliation](../checklists/principle-drift-entrypoint-reconciliation.md) — the checklist item this decision gates
- [t10-symlink-mismodel](t10-symlink-mismodel.md) — the related decision pinning `.codex/AGENTS.md` as the real edit target (AGENTS.md is a symlink)

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Ideation review, overall perspective (PR-1 / N2, Low).
