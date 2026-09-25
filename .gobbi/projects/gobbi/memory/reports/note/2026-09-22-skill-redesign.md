# Skill redesign and v1.3.1

**Completed at:** 2026-09-22T02:53:01Z

Net session change: [Skill redesign and v1.3.1](../../history/2026-09-22-skill-redesign.md).

## Result

Gobbi 1.3.1 removes the Startup family, writes the Wrap-up work note during memory extraction, and pins current role models.

## Context

| Item | Detail |
|---|---|
| Purpose | Redesign selected Gobbi skills and publish the result as 1.3.1. |
| Requirements | Remove Startup entirely. Write the Wrap-up note in memory during Phase 2. Memorize accepted design, decisions, behaviors, and standing preferences. Set Grok to 4.7, role effort to high, and Codex to Astra at high. |
| Scope | Startup family, Wrap-up, Memory closure, Cowork wrap-up, Workflow note handoff, role-contract models, and the 1.3.1 release. |
| Exclusions | Independent whole-branch review was not requested. The older `chore/release-v1-4-0` worktree was left in place. |
| Accepted decisions | [Wrap-up memory](../../design/process/wrap-up.md). [Role model pins](../../design/process/role-model-pins.md). |

## Work

The Startup family (Interview, Project Design, Roadmap, and Bootstrap) is gone from canonical skills, runtime links, and the plugin package. Current design memory no longer lists it. Historical reports stay.

Wrap-up Phase 2 extracts accepted knowledge into existing Memory homes and writes `reports/note/`. Phase 3 still commits, merges, and returns the Git and recovery note.

Public identity is 1.3.1. The patch includes the breaking Startup removal.

## Memory

| Action | Owner | Change and reason | Evidence |
|---|---|---|---|
| Created | `design/process/` | Current Wrap-up extraction and role model pins. | This note links both files. |
| Created | `reports/note/` | This work account. | This file. |
| Created | `history/` | Net session change. | Linked history file. |
| Removed earlier | `design/process/startup.md` | The family is no longer current intent. | Absent after `5011d8a6`. |

## Remaining limits

No independent review covered the branch. Published tag `v1.3.1` does not include this memory record.
