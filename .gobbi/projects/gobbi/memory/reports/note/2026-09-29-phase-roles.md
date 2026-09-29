# Phase roles

**Completed at:** 2026-09-29T08:57:18Z

Net session change: [Phase roles](../../history/2026-09-29-phase-roles.md).

## Result

Gobbi roles are manager, assistant, and twelve phase roles. Coding, authoring, and design each have a leader, a planner, an executor, and a reviewer. Developer, designer, and author role files are gone.

## Context

| Item | Detail |
|---|---|
| Purpose | Give ideation, planning, execution, and review a separate agent and model pin in each domain. |
| Requirements | Keep manager and assistant. Replace developer, designer, and author. Pin Claude and Codex efforts at high, Grok at xhigh, and Cursor manager and assistant at grok-4.7 xhigh. |
| Scope | Role contracts, phase assignment prose, setup allow lists, install mirrors, and the plugin package. |
| Exclusions | No release, no push, and no edit to the Cursor parent session pin. |
| Accepted decisions | [Role model pins](../../design/process/role-model-pins.md). [Identity-and-load role contracts](../../design/process/identity-and-load-role-contracts.md). |

## Work

Leader writes the ideation result and does not change the product. Planner writes the plan and does not change the product. Executor changes the product. Reviewer reads another agent's work in that domain and does not change it.

Claude and Codex efforts are high. Opus roles are coding-leader, design-leader, and design-executor, mapped to `claude-opus-5-5` and `gpt-6-astra`. The other Claude roles use `claude-sonnet-5-5`, and the matching Codex roles use `gpt-6-sol`. Grok is `grok-4.7` at xhigh for every role. Cursor manager and assistant are `grok-4.7` at xhigh. Every other Cursor role uses that role's Claude model at high. The Cursor parent session stays `grok-4.7` at high.

## Memory

| Action | Owner | Change and reason | Evidence |
|---|---|---|---|
| Revised | `design/process/role-model-pins.md` | Current pins for the fourteen roles. | The pin table. |
| Revised | `design/process/identity-and-load-role-contracts.md` | Current file set and phase load map. | The file-set section. |
| Created | `reports/note/` | This work account. | This file. |
| Created | `history/` | Net session change. | Linked history file. |

## Remaining limits

The independent review covered the role split before the later effort edits. Those edits set every Claude and Codex effort to high, and Cursor manager and assistant to `grok-4.7` at xhigh. Setup still does not delete old role files from an existing project, and it does not rewrite a settings file that already exists.
