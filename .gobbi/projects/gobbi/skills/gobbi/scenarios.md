# Gobbi Entry Scenarios

These reusable fixtures exercise the read-only Gobbi entry contract in [`SKILL.md`](SKILL.md). They test
bootstrap, explicit fresh mode selection, context-boundary preservation, three-mode routing, and owner
boundaries without adding policy.

- **Purpose:** prove that a cold manager rebuilds the five-skill floor, presents all three modes, and routes
  the user's selection without recreating retired behavior, forcing an owner, or writing from the entry.
- **Target:** [`SKILL.md`](SKILL.md) and only the bootstrap edges it owns.
- **Consumer:** the Gobbi operational checklist and both fresh evaluators of a Gobbi-entry change.
- **Lifecycle:** design obligations; freeze this source before an evaluation run.
- **Scope:** entry-boundary read-only setup, the floor of exactly five, explicit mode selection, conditional
  owner loads, the skill-map index, mode preservation across runtime boundaries, owner handoff,
  retired-machinery absence, and canonical/runtime entry views.
- **Non-goals:** mode-owner creation mechanics, Workflow state transitions and record bytes, Cowork topic
  delivery, question-card rendering, delegation formats, Git commands, peer commands, plugin repair, and
  productive-step methods.
- **Scale:** seven families and twenty-two cases. Split by bootstrap concern if the source exceeds twelve
  families or eighty distinct category/case-type cells.
- **Stable IDs:** `GOBBI-SCN-<family>-<case>`; wording changes do not renumber an ID.
- **Evidence policy:** cite inspected paths, manifests, state, commands, and runtime views. Never embed runtime secrets or private conversation data.

## GOBBI-SCN-01 — Manager floor and conditional owners

### GOBBI-SCN-01-A — Cold entry

- **Given:** the manager has no retained skill context.
- **When:** Gobbi runs at an entry boundary.
- **Then:** it reads `principles`, `delegation`, `discussion`, `ideation`, and `git` in order, then applicable
  rules and the manager role, before any action.
- **Failure:** a floor skill is missing, a sixth skill joins the floor, or an action precedes the loads.
- **Sources:** GB-1, GB-2.

### GOBBI-SCN-01-B — Conditional owner

- **Given:** the selected mode or task reaches a governed boundary.
- **When:** the manager is about to act.
- **Then:** it loads the selected orchestration owner, `codex`, shared delegation owner, or
  task-specific skill only when that trigger applies.
- **Failure:** an owner loads eagerly as floor, or its governed action runs first.
- **Sources:** GB-4, GB-5.

### GOBBI-SCN-01-C — Stale entry consumer

- **Given:** a runtime overview contradicts the canonical floor or mode route.
- **When:** the manager resolves the conflict.
- **Then:** the canonical Gobbi owner wins and the stale consumer is routed to its sync owner.
- **Failure:** familiar but stale prose overrides the current operation.
- **Sources:** GB-2, GB-6.

## GOBBI-SCN-04 — Resume and context boundaries

### GOBBI-SCN-04-A — Valid mode survives

- **Given:** a General, Cowork, or Workflow session has reliable mode and identity evidence.
- **When:** resume, `/clear`, rewind, or runtime compaction runs Gobbi again.
- **Then:** the established mode is preserved without a new selection question.
- **Failure:** the entry silently changes mode or asks again despite valid evidence.
- **Sources:** GB-1, GB-3.

### GOBBI-SCN-04-B — Mode evidence is missing

- **Given:** no reliable selected mode survives the boundary.
- **When:** Gobbi tries to route.
- **Then:** it presents the General, Cowork, and Workflow selection again without automatic resolution.
- **Failure:** it guesses a mode from task wording, files, or runtime state.
- **Sources:** GB-3.

### GOBBI-SCN-04-C — Mode evidence conflicts

- **Given:** retained context indicates one mode while current durable evidence indicates another.
- **When:** Gobbi validates the boundary.
- **Then:** it preserves existing state, reports the conflict, and asks the user to select before handoff.
- **Failure:** either signal wins silently or the entry mutates state to reconcile them.
- **Sources:** GB-3, GB-6.

## GOBBI-SCN-06 — Read-only owner handoff

### GOBBI-SCN-06-A — Workflow handoff

- **Given:** the user selects Workflow or a valid Workflow resume is proved.
- **When:** Gobbi routes the mode.
- **Then:** it loads `workflow`; that owner performs classification, Configuration, durable routing, and all
  productive steps.
- **Failure:** Gobbi creates Workflow state, guesses a cursor, or dispatches a productive specialist directly.
- **Sources:** GB-5, GB-6.

### GOBBI-SCN-06-B — Direct specialist shortcut

- **Given:** the next action looks like Ideation, Planning, Execution, or Wrap-up.
- **When:** Gobbi considers dispatching that specialist itself.
- **Then:** it rejects the shortcut and hands control to the selected orchestration owner.
- **Failure:** the entry becomes a second productive-step router.
- **Sources:** GB-5, GB-6.

### GOBBI-SCN-06-C — Entry mutation

- **Given:** a candidate entry wants to create an empty directory, artifact, branch, worktree, or manifest.
- **When:** that write is attempted.
- **Then:** Gobbi blocks it and leaves the repository preimage unchanged.
- **Failure:** any entry-owned filesystem or Git mutation occurs.
- **Sources:** GB-6.

### GOBBI-SCN-06-D — Invalid handoff evidence

- **Given:** mode identity, owner source, cursor, branch, worktree, or required authority cannot validate.
- **When:** handoff is attempted.
- **Then:** the exact blocker is reported and the prior state is preserved.
- **Failure:** Gobbi invents a fallback mode, identity, cursor, or path.
- **Sources:** GB-3, GB-5, GB-6.

### GOBBI-SCN-06-E — Runtime projection disagrees

- **Given:** a runtime task view disagrees with the selected mode's authoritative evidence.
- **When:** Gobbi chooses the next route.
- **Then:** the mode owner evidence wins and the projection remains non-authoritative.
- **Failure:** a runtime display changes mode or durable routing.
- **Sources:** GB-3, GB-6.

### GOBBI-SCN-06-F — Cowork handoff

- **Given:** the user selects Cowork or a valid Cowork context is preserved.
- **When:** Gobbi routes the mode.
- **Then:** it loads `cowork`; that owner establishes or recovers the manifest-free isolated worktree before
  editing and runs the user-topic loop.
- **Failure:** Gobbi creates the worktree itself or routes Cowork through Workflow state.
- **Sources:** GB-5, GB-6.

## GOBBI-SCN-07 — Retired machinery remains absent

### GOBBI-SCN-07-A — Removed runtime machinery

- **Given:** no Gobbi hooks, transcript path, rollout path, telemetry, or memory-merging subsystem exists.
- **When:** bootstrap runs.
- **Then:** it proceeds from explicit runtime, user selection, and mode-owner evidence.
- **Failure:** a removed surface becomes a prerequisite or degraded-mode warning.
- **Sources:** GB-6.

### GOBBI-SCN-07-B — Retired settings surface

- **Given:** stale prose proposes a separate settings file or startup classifier.
- **When:** the manager evaluates the proposal.
- **Then:** it rejects the retired mechanism and follows the selected current owner.
- **Failure:** obsolete state or a retired gate is recreated.
- **Sources:** GB-6.

## GOBBI-SCN-08 — Canonical and runtime views

### GOBBI-SCN-08-A — Canonical bundle

- **Given:** a cold reader opens the canonical Gobbi directory.
- **When:** it follows `SKILL.md`.
- **Then:** the parent and three review companions resolve, and every mode owner is reachable.
- **Failure:** a companion or owner link is missing.
- **Sources:** GB-6.

### GOBBI-SCN-08-B — Runtime view

- **Given:** Codex, Claude Code, or the plugin package exposes Gobbi.
- **When:** the view is resolved.
- **Then:** it reaches the canonical bytes rather than a divergent copy.
- **Failure:** a broken, partial, or materialized look-alike is accepted as current.
- **Sources:** GB-6.

## GOBBI-SCN-09 — Skill-map behavior

### GOBBI-SCN-09-A — On-demand lookup

- **Given:** a task needs a non-floor skill.
- **When:** the manager consults the skill map.
- **Then:** it finds one owner entry and loads it only before the governed action.
- **Failure:** the index copies owner procedures or acts as an eager-load list.
- **Sources:** GB-4, GB-6.

### GOBBI-SCN-09-B — Mode owners remain outside the floor

- **Given:** a fresh or retained mode determines an orchestration owner.
- **When:** the manager applies conditional loads.
- **Then:** Cowork or Workflow loads only after the mode is selected and never joins the five-skill floor.
- **Failure:** a mode owner loads eagerly, joins the floor, or causes the unselected owner to load.
- **Sources:** GB-2, GB-4.

## GOBBI-SCN-10 — Explicit three-mode selection

### GOBBI-SCN-10-A — General selection

- **Given:** a fresh entry presents all three modes and the user selects General.
- **When:** Gobbi routes the selection.
- **Then:** the manager works from the floor and task-specific skills without an orchestration owner or Gobbi
  session state.
- **Failure:** General loads Cowork or Workflow.
- **Sources:** GB-3, GB-5.

### GOBBI-SCN-10-B — Workflow selection

- **Given:** a fresh entry presents all three modes and the user selects Workflow.
- **When:** Gobbi routes the selection.
- **Then:** Workflow loads and owns its durable five-step lifecycle.
- **Failure:** the entry starts Workflow mechanics before the selection.
- **Sources:** GB-3, GB-5.

### GOBBI-SCN-10-C — Fresh entry omits the selection

- **Given:** task wording strongly suggests one mode, including an explicit phrase such as “use Cowork.”
- **When:** a fresh Gobbi entry begins.
- **Then:** the entry may recommend that mode but still presents General, Cowork, and Workflow with no
  automatic resolution.
- **Failure:** wording or a timeout selects the mode without the user control.
- **Sources:** GB-3.

### GOBBI-SCN-10-D — Cowork selection

- **Given:** a fresh entry presents all three modes and the user selects Cowork.
- **When:** Gobbi routes the selection.
- **Then:** Cowork loads and owns fast stepwise topics, optional shaping, worktree creation, and user-called
  evaluation and memory-updating Wrap-up.
- **Failure:** Cowork is treated as General or routed into Workflow records.
- **Sources:** GB-3, GB-5.

## Traceability

| Parent rule | Scenario coverage |
|---|---|
| GB-1 | GOBBI-SCN-01-A, GOBBI-SCN-04-A |
| GB-2 | GOBBI-SCN-01-A, GOBBI-SCN-01-C, GOBBI-SCN-09-B |
| GB-3 | GOBBI-SCN-04-A..C, GOBBI-SCN-06-D..E, GOBBI-SCN-10-A..D |
| GB-4 | GOBBI-SCN-01-B, GOBBI-SCN-09-A..B |
| GB-5 | GOBBI-SCN-01-B, GOBBI-SCN-06-A..B, GOBBI-SCN-06-D, GOBBI-SCN-06-F, GOBBI-SCN-10-A..B, GOBBI-SCN-10-D |
| GB-6 | GOBBI-SCN-01-C, GOBBI-SCN-06-A..F, GOBBI-SCN-07-A..B, GOBBI-SCN-08-A..B, GOBBI-SCN-09-A |
