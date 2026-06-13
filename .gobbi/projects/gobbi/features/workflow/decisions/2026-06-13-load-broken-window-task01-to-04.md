---
name: load-broken-window-task01-to-04
description: Pausing execution between task-01 (git mv) and tasks 04/05/06 (mirror fixups) leaves skill loading broken for the duration
type: decisions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [planning, execution-risk, skill-loading, interruption]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Load-broken interruption window between task-01 and tasks 04/05/06

## Context

The execution plan's bottom-up ordering (01→02→03→04) means that after task-01 (`git mv` of `skills/memorization/` to `skills/record/` + `skills/memory/`), the old loader symlinks (`.claude/skills/memorization/`, `.agents/skills/memorization`) are pointing at a now-absent directory. The new loader links (`.claude/skills/{record,memory}/`, `.agents/skills/{record,memory}`) are not created until tasks 04 and 05. This load-broken window spans the duration of tasks 02 and 03 — which are the heaviest tasks (02 edits the skill bodies; 03 classifies and repoints ~197 cross-references).

Both the iter1 and iter2 Claude evaluators surfaced this as RISK-1 (assumption_risk/process, Medium). It was on the Must-preserve list for the iter1 FAIL and was not re-sequenced in iter2 per the Must-preserve constraint (DAG byte-identical).

## Decision

Accept the load-broken window as a known intermediate state for this worktree execution. The plan does not re-sequence the DAG because: (a) both evaluators placed the DAG on the Must-preserve list; (b) for a solo-user worktree, the window is recoverable — the git history and the new skill files are intact; (c) an actual skill-load failure during 02-03 is surfaced immediately by Claude Code.

## Rationale

The risk is real but bounded: this is a solo-user worktree with a single focused Execution session. The broken window is transient and recoverable. Re-sequencing 04/05/06 immediately after 01 would require moving them before 02-03, changing the DAG that both evaluators validated as sound.

## Alternatives considered

- Re-sequence 04/05/06 to run immediately after 01 (rejected: alters the Must-preserve DAG; would require a new REVISE cycle).
- Add an explicit note to the plan acknowledging the window (accepted: documented in this decision; the Execution manager can brief the executor at task-01 completion).

## Consequences

The Execution manager should brief the executor at task-01 completion that skill loading will be temporarily broken until tasks 04/05/06 complete. No session should interrupt between 01 and 04/05/06 without understanding this state.

## Related

- `3-planning/evaluation/iter1/claude/risk.md` § RISK-1
- `3-planning/evaluation/iter2/claude/risk.md` § RISK-1
- `3-planning/outputs/dependencies.md` — dependency table + lane table
