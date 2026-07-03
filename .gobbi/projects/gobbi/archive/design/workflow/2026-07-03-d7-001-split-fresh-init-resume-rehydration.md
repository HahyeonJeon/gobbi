---
name: d7-001-split-fresh-init-resume-rehydration
description: Split fresh Configuration initialization from resume rehydration so resume continues the persisted active step instead of re-stamping Ideation Active
type: design
scope: feature
feature: workflow
status: superseded
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [resume, state-json, fresh-init, configuration]
author: claude
superseded_by: d7-001-split-fresh-init-resume-rehydration-shipped
archived_at: 2026-07-03
archive_reason: superseded
---

# GEN-D7-001 — Resume path resets active state to Ideation

## Problem

`gobbi/SKILL.md:102-104` unconditionally states "the first productive step is Ideation";
`orchestration/SKILL.md:107` (row 4) unconditionally stamps `workflow.ideation.state="Active"`. Yet
`orchestration/SKILL.md:179,243` name `state.json` the resume recovery source — no reader continues
the persisted step. A resumed session with `workflow.execution.state="Active"` gets silently
re-stamped back to Ideation, clobbering live state.

## Scope

In-scope: split fresh initialization from resume rehydration at Configuration; a concrete
fresh-vs-resume signal; resume-validation invariants with a fail-safe to a user decision. Out-of-scope:
any FIX edit; the state.json/session.json schemas are unchanged (no new field needed).

## Approach

**Recommended**: split fresh initialization from resume rehydration. Fresh: create worktree → init
record skeleton → resolve settings → stamp `state.json` (Ideation Active) → stamp `session.json` →
enter Ideation. Resume/clear/compact: read settings → read + VALIDATE `state.json` → render the active
state → continue it, WITHOUT the fresh row-4 Ideation stamp and WITHOUT gobbi §6's unconditional
Ideation entry.

**Resume signal (concrete)**: resume iff `settings.json` exists AND
`session.json.previousSessionId` is non-null AND a valid `state.json` carries a non-`configuration`
Active/Revising step. Fresh iff the row-1 3-state worktree guard reports `worktreePath: null` OR there
is no prior `state.json`.

**Resume-validation invariants**: (1) exactly one workflow entry is Active/Revising; (2) earlier
completed steps are Done/Skipped; (3) later steps are not Done unless the active step is after them;
(4) mode — validate `state.json.mode` against the CURRENT (possibly reconfigured) `settings.json`; a
user-intended mode change (gobbi §3 permits reconfigure) is legitimate: re-stamp `state.json.mode` and
keep the active step. Halt to NEEDS_CONTEXT only on a genuinely inconsistent `state.json` (invariants
1-3 broken), never on an intended reconfigure.

**Alternative (rejected)**: guard row 4 only — rejected because gobbi §6 still forces Ideation
unconditionally even if row 4 is fixed.

**Affected canonical files**: `gobbi/SKILL.md:102-104` (§6 resume branch — continue the persisted step
vs. enter Ideation); `orchestration/SKILL.md:100,107` (Step 1: split fresh rows from a "Rehydrate
state.json" resume row; make the row-4 Ideation stamp fresh-only; keep row-2 create-if-absent);
`orchestration/auto-mode.md:64` (EDIT — its hardcoded "rows 1-4" enumeration is stale under the split).
Verify-only: `chat-mode.md:136,458` (both defer to `orchestration/SKILL.md`'s canonical table).

## Scenarios

- **Golden**: resume a session whose `state.json.workflow.execution.state="Active"` → manager detects
  resume (settings.json + previousSessionId + valid state.json), validates, renders Execution active,
  continues. Config does NOT re-stamp Ideation=Active.
- **Edge (mode reconfigure)**: user legitimately reconfigures mode on resume (gobbi §3 permits) →
  invariant #4 validates against the CURRENT settings.json and treats the intended change as
  legitimate (re-stamp mode, keep the active step) — does NOT NEEDS_CONTEXT-halt. Only a genuinely
  inconsistent `state.json` halts.

## Validation

- `git grep -ni 'first productive step is' -- .gobbi/projects/gobbi/skills/gobbi/SKILL.md` → fresh-session-only wording.
- `git grep -n 'ideation.state = "Active"' -- .gobbi/projects/gobbi/skills/orchestration/SKILL.md` → inside a fresh-only row.
- `git grep -ni 'rows 1-4' -- .gobbi/projects/gobbi/skills/orchestration/auto-mode.md` → either updated for the split or removed.
- Dry-run 1: seed `settings.json` present + `state.json.workflow.planning.state="Active"` → resume renders Planning active, does NOT alter `workflow.ideation`.
- Dry-run 2: seed fresh (no settings/state) → bootstrap stamps Configuration Done + Ideation Active.
- Dry-run 3: seed a resume where the user reconfigures mode → resume re-stamps `state.json.mode`, keeps the active step, does NOT halt. Seed an inconsistent state.json (two Active steps) → resume surfaces NEEDS_CONTEXT.

## Trade-offs

Optimizes for: matching the stated design (`state.json` is already documented as the recovery source);
no template edit; extends the existing row-1 fresh/resume signal rather than inventing a new one.
Sacrifices: nothing identified — root-cause fix, not a work-around.

## Open issues

None blocking. F-STRUCT-1 (Low, iter1) noted the draft didn't originally name which signal row 4
branches on — resolved at iter2 by naming the concrete resume signal above.

## Related

- [[d1-001-drop-re-ideate-verdict]] — shares `state.template.json` in the finding location set (co-touch dissolves under recommended directions)
- [[d7-002-runtime-aware-transcript-audit-branch]] — shares `gobbi/SKILL.md` + `orchestration/SKILL.md` (disjoint sections; sequence serially, never concurrently)
- [[d7-001-resume-signal-must-be-named-explicitly]] — the accepted decision anchoring the resume signal
