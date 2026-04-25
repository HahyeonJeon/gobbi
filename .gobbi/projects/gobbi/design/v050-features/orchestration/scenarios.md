# Orchestration — Scenarios

Behaviour specifications for the Pass-4 orchestration redesign. Covers state-machine transitions, evaluation verdict flows, hook-driven side effects, the JIT footer protocol, the missed-advancement safety net, the Outer-mode driver, the workspace-scoped two-DB partition, the new `handoff` state-machine step, and the migration mechanics.

This file does NOT cover: the settings cascade itself (see `../gobbi-config/scenarios.md`), the multi-project memory model (see `../gobbi-memory/scenarios.md`), or roles-and-specialties composition (deferred to Wave D.1's feature pass).

Every scenario has a stable ID in the `SC-ORCH-NN` format — `rg 'SC-ORCH-' .gobbi/projects/gobbi/design/v050-features/orchestration/` surfaces every reference. Scenario IDs, once published, never change; new scenarios get higher numbers. Scenarios marked **(post-Wave X)** describe target behaviour after a future wave ships; they will turn into PASS scenarios once the corresponding wave merges.

See `README.md` for the feature overview.

---

## State-machine transitions

### SC-ORCH-01 — `workflow.start` emission on init

**Given** a fresh repo with `.gobbi/projects/<name>/` populated by `gobbi install`
**When** `gobbi workflow init --task "<text>"` runs
**Then** a new session directory `.gobbi/projects/<name>/sessions/<id>/` is created with `metadata.json`; the workspace `state.db` (post-Wave-A.1) or per-session `gobbi.db` (today) records exactly one `workflow.start` event with `actor='cli'`; reducer sets `currentStep = 'ideation'`; exit code is `0`.

Evidence: `commands/workflow/init.ts:281` (DB open), `transition.ts:74-84` (TRANSITION_KEYWORDS map), `events/workflow.ts:21` (event constants), `reducer.ts` (workflow.start case).

---

### SC-ORCH-02 — `step.exit` on a productive step routes to the next productive step when eval is disabled

**Given** an active session at `currentStep = 'ideation'` with `evalConfig.ideation.enabled = false`
**When** the agent runs `gobbi workflow transition COMPLETE`
**Then** `transition.ts:335` emits `workflow.step.exit`; the reducer evaluates the `evalEnabled` predicate (false), advances `currentStep` to `planning` directly; no `*_eval` step is entered.

Evidence: `transition.ts:74-84` (COMPLETE → step.exit), `index.json:200-247` (eval-skip transitions), reducer eval-decision branch.

---

### SC-ORCH-03 — `step.exit` on a productive step routes to the eval step when eval is enabled

**Given** an active session at `currentStep = 'planning'` with `evalConfig.planning.enabled = true`
**When** the agent runs `gobbi workflow transition COMPLETE`
**Then** `workflow.step.exit` is emitted; reducer routes to `currentStep = 'planning_eval'`; the next compiled prompt is the eval-step variant (verdict footer instead of COMPLETE-only).

Evidence: `transition.ts:335`, `reducer.ts` step.exit dispatch, `assembly.ts::compile` eval-variant branch.

---

### SC-ORCH-04 — `eval.verdict PASS` advances to the next productive step

**Given** an active session at `currentStep = 'planning_eval'` with the eval agent's findings discussed
**When** the agent (after user agreement) runs `gobbi workflow transition PASS`
**Then** `decision.eval.verdict` is emitted with `verdict='PASS'`; reducer transitions `currentStep` from `planning_eval` to `execution`; `parent_seq` on the verdict event links back to the originating `step.exit`.

Evidence: `transition.ts:74-84` (PASS → eval.verdict), `events/decision.ts` (eval.verdict shape), reducer verdictPass case.

---

### SC-ORCH-05 — `eval.verdict REVISE --loop-target <step>` re-enters the named target step

**Given** an active session at `currentStep = 'execution_eval'` with revise findings
**When** the agent runs `gobbi workflow transition REVISE --loop-target planning`
**Then** `decision.eval.verdict` is emitted with `verdict='REVISE'` and `loopTarget='planning'`; reducer transitions `currentStep` to `planning`; `state.feedbackRound` increments; if `feedbackRound > maxIterations` reducer emits `workflow.invalid_transition` instead and routes to `error`.

Evidence: `transition.ts:74-84` (REVISE arg parsing), `index.json` revise transitions, reducer revise + iteration cap branch.

---

### SC-ORCH-06 — `eval.verdict ESCALATE` surfaces to user via error step

**Given** an active session at `currentStep = 'ideation_eval'` where the evaluator identified a Critical structural problem
**When** the agent runs `gobbi workflow transition ESCALATE`
**Then** `decision.eval.verdict` is emitted with `verdict='ESCALATE'`; reducer transitions `currentStep` to `error`; `gobbi workflow status` returns the escalation reason; the user must run `gobbi workflow resume --target <step>` or `gobbi workflow abort` to continue.

Evidence: `transition.ts:74-84` (ESCALATE → eval.verdict), `commands/workflow/resume.ts:190` (resume from error), `commands/workflow/status.ts` (error display).

---

### SC-ORCH-07 — `step.skip` routes to ideation re-entry

**Given** an active session at `currentStep = 'planning_eval'` and the user opts to skip evaluation
**When** an operator runs `gobbi workflow transition SKIP --target ideation` (operator-only command)
**Then** `workflow.step.skip` is emitted; reducer routes per `index.json:200-247` to `ideation` (skip default); `parent_seq` records the skipped eval step.

Evidence: `transition.ts:74-84`, `index.json:200-247` (step.skip transitions), reducer step.skip branch.

---

### SC-ORCH-08 — `step.timeout` routes to error

**Given** an active session at `currentStep = 'execution'` with `meta.timeoutMs` configured and exceeded
**When** the Stop hook detects `now - stepStartedAt > meta.timeoutMs`
**Then** `workflow.step.timeout` is emitted; reducer transitions `currentStep` to `error`; the session can resume via `gobbi workflow resume --target execution`.

Evidence: `commands/workflow/stop.ts` (timeout detection), `events/workflow.ts:21` (step.timeout constant), reducer timeout case.

---

### SC-ORCH-09 — `workflow.resume` from error to a target step

**Given** an active session at `currentStep = 'error'` after an ESCALATE verdict
**When** the user runs `gobbi workflow resume --target planning`
**Then** `workflow.resume` is emitted with `fromError=true` and `target='planning'`; reducer transitions `currentStep` to `planning`; the next compiled prompt is the planning step's prompt; the resumed session's `metadata.resumeChain` is appended.

Evidence: `commands/workflow/resume.ts:190`, `events/workflow.ts:21` (workflow.resume), reducer resume case with fromError flag.

---

### SC-ORCH-10 — `workflow.invalid_transition` audit on rejection

**Given** an active session at `currentStep = 'execution'` where an agent attempts `gobbi workflow transition PASS` (PASS is eval-only)
**When** `transition.ts:335` emits the candidate event
**Then** the reducer rejects with `ReducerRejectionError`; `engine.ts:232` catches and emits `workflow.invalid_transition` in a fresh transaction; the original event is NOT persisted; agent stderr names the rejection reason; exit code is non-zero.

Evidence: `engine.ts:223,232,272` (audit-emit-on-rejection), `events/workflow.ts:21` (invalid_transition), reducer rejection plumbing.

---

## JIT footer protocol

### SC-ORCH-11 — Footer auto-injected per `spec.json::blocks.footer` (post-Wave-B.1)

**Given** a step spec at `packages/cli/src/specs/<step>/spec.json` with `blocks.footer` populated
**When** `assembly.ts::compile()` renders the prompt for that step
**Then** the rendered prompt ends with the footer block as a `StaticSection`, immediately after `blocks.completion`; the footer is identical across same-step recompilations for the same spec version (cache-stable); the eval-step variant uses the verdict footer, productive steps use the COMPLETE-only footer.

Evidence (post-Wave-B.1): `_schema/v1.ts::StepBlocks` (with `footer` field), `_schema/v1.json` mirror, `assembly.ts::renderSpec` step 5b, `schema.test.ts:399-404` drift test.

---

### SC-ORCH-12 — Agent runs `gobbi workflow transition COMPLETE` from the footer

**Given** an agent that has finished the work named in `blocks.completion.criteria`
**When** the agent's last action is `gobbi workflow transition COMPLETE`
**Then** the CLI emits `workflow.step.exit`; the workflow advances per the reducer's eval-decision; no other agent prose phrasing advances the workflow (the CLI's output is authoritative).

Evidence: `transition.ts:74-84` (TRANSITION_KEYWORDS), `transition.ts:335` (event emission), README §5 footer template.

---

## Missed-advancement safety net

### SC-ORCH-13 — PostToolUse on `gobbi workflow transition` Bash emits `step.advancement.observed` via direct `store.append()` (post-Wave-A.1)

**Given** an active session and an agent runs a Bash tool with command starting `gobbi workflow transition`
**When** the PostToolUse hook fires (`capture-planning.ts` extended path)
**Then** the hook calls `store.append()` directly with `type='step.advancement.observed'`, `actor='hook'`, `idempotencyKind='tool-call'` keyed on the PostToolUse payload's `tool_call_id`; the event is persisted; the reducer never sees this audit-only event (bypass is intentional per Architecture F-1).

Evidence (post-Wave-A.1): `capture-planning.ts:166-179` extended; `events/step.ts` new factory; `store.ts:36-48` idempotency formula; Architecture F-1 finding.

---

### SC-ORCH-14 — Stop hook injects reminder when no advancement.observed since last step.exit AND turns_since_step_start ≥ 2 (post-Wave-E.1)

**Given** an active session at `currentStep = 'planning'` for ≥ 2 turns with no `step.advancement.observed` event since the last `workflow.step.exit`/`workflow.start`/`workflow.resume`
**When** the Stop hook (`stop.ts` extended) fires
**Then** the hook emits `additionalContext` containing the missed-advancement reminder ("Did you run `gobbi workflow transition`?"); the next agent turn prompt receives the reminder injection; no `state_snapshots` row is written yet.

Evidence (post-Wave-E.1): `commands/workflow/stop.ts` extended, predicate query against `state.db.events`, `additionalContext` injection contract.

---

### SC-ORCH-15 — Stop hook escalates to `state_snapshots` when ≥ 5 turns without advancement (post-Wave-E.1)

**Given** an active session that has accumulated ≥ 5 turns in the same step without a `step.advancement.observed`
**When** the Stop hook fires
**Then** a row is appended to `state_snapshots` flagging the missed-advancement escalation; `gobbi workflow status` includes the escalation in its output; the reminder is still injected; user-facing surfacing makes the stuck state visible without breaking the session.

Evidence (post-Wave-E.1): `state_snapshots` schema (Wave A.1.3), Stop hook escalation branch, `commands/workflow/status.ts` rendering.

---

## Outer mode

### SC-ORCH-16 — `gobbi workflow run` per-step spawn (post-Wave-E.2)

**Given** the user runs `gobbi workflow run --task "<text>"` from a shell (no Claude Code interactive runtime)
**When** the run-loop iterates
**Then** for each iteration: state is resolved from `state.db`; the prompt is compiled via `assembly.ts::compile()`; a child process is spawned (`claude -p '<prompt>' --session-id $SID` or `codex --headless`); the child writes events via `gobbi workflow transition` calls; on child exit, state is re-resolved; the loop terminates when `currentStep ∈ {'done', 'error'}`.

Evidence (post-Wave-E.2): `commands/workflow/run.ts` (new file), README §7.

---

### SC-ORCH-17 — Outer-mode footer-miss reconciliation re-spawns with reminder (post-Wave-E.2)

**Given** an Outer-mode run where the child agent exited without running `gobbi workflow transition`
**When** the run-loop re-resolves state and finds `currentStep` unchanged
**Then** the loop re-spawns the same step's prompt with an explicit reminder block prepended; if the reminder fails after N retries (default 3), the run-loop emits `workflow.step.timeout` and exits non-zero.

Evidence (post-Wave-E.2): `commands/workflow/run.ts` retry policy, `events/workflow.ts:21` step.timeout.

---

### SC-ORCH-18 — Outer mode ↔ Inner mode parity — same compiled prompt for same `state.db` (post-Wave-E.2)

**Given** two sessions with byte-identical `state.db` contents (events, snapshots, schema_meta) and the same compiled spec library
**When** Inner mode and Outer mode each invoke `assembly.ts::compile()` for the same `currentStep`
**Then** the compiled prompts are byte-identical except for the per-mode footer line indicating Inner vs Outer; snapshot diff returns no other differences.

Evidence (post-Wave-E.2): `packages/cli/src/specs/__tests__/snapshot.test.ts` cross-mode parity assertion.

---

## Memorization step

### SC-ORCH-19 — Memorization writes `memorization.md` and emits `step.exit`

**Given** an active session at `currentStep = 'memorization'` with the productive steps' rawdata under `sessions/<id>/{ideation,planning,execution}/rawdata/` and per-step READMEs written
**When** the memorization agent reads the rawdata sources (per README §8.1) and writes `sessions/<id>/memorization/memorization.md`
**Then** `artifact.write` is emitted for the file; for each extraction class, the agent writes the markdown destination (`learnings/decisions/<slug>.md`, `learnings/gotchas/<slug>.md`, `design/<area>/*.md`, `learnings/backlogs/<slug>.md`) and an `INSERT INTO memories` row (post-Wave-A.1) with the matching `class`; the agent then runs `gobbi workflow transition COMPLETE`; `workflow.step.exit` advances `currentStep` to `handoff`.

Evidence: `specs/memorization/spec.json` (rewritten in Wave A.1.6), `events/artifact.ts` (artifact.write), `transition.ts:335` (step.exit emission), README §8.

---

## Handoff step

### SC-ORCH-20 — Handoff writes `handoff.md` + memory row + emits `workflow.finish` (post-Wave-A.1)

**Given** an active session at `currentStep = 'handoff'` (post-Wave-A.1.5 schema) with `memorization.md` already written
**When** the handoff agent reads `memorization.md` plus the last-N events from `state.db` and writes `sessions/<id>/handoff/handoff.md`
**Then** `artifact.write` is emitted; an `INSERT INTO memories` row is added with `class='handoff', session_id=<id>, project_id=<resolved>`; the agent runs `gobbi workflow transition COMPLETE` which on the handoff step maps to `workflow.finish` per `index.json` rule `{ from: "handoff", to: "done", trigger: "workflow.finish" }`; reducer transitions `currentStep` to `done`.

Evidence (post-Wave-A.1.5): `specs/handoff/spec.json` (new), `index.json` (new transitions), `events/workflow.ts:21` (workflow.finish), `events/artifact.ts`.

---

## Schema migration + path discipline

### SC-ORCH-21 — `gobbi maintenance migrate-state-db` is reversible via `restore-state-db` (post-Wave-A.1)

**Given** a workspace at schema v5 with per-session `gobbi.db` files under `.gobbi/projects/*/sessions/*/gobbi.db`
**When** `gobbi maintenance migrate-state-db` runs
**Then** events are migrated into a new workspace `.gobbi/state.db` at schema v6; partition keys (`session_id`, `project_id`) are preserved on every row; per-session `gobbi.db` files are renamed `.bak` (not deleted) for one-commit reversibility; `gobbi maintenance restore-state-db` reverses the operation; replay-equivalence integration test confirms identical state derivation pre- and post-migration.

Evidence (post-Wave-A.1.4): `commands/maintenance/migrate-state-db.ts` (new), `commands/maintenance/restore-state-db.ts` (new), `commands/maintenance.ts:48-59` registry update (Architecture P-A-1), replay-equivalence test in Wave A.1.10.

---

### SC-ORCH-22 — `.gobbi/gobbi.db` has `!.gitignore` exception so it is git-tracked (post-Wave-A.1)

**Given** a workspace at the post-Wave-A.1 layout with `.gitignore` containing `.gobbi/*`, `!.gobbi/projects/`, `!.gobbi/gobbi.db`
**When** the user runs `git check-ignore .gobbi/gobbi.db` and `git check-ignore .gobbi/state.db`
**Then** `.gobbi/gobbi.db` returns nonzero (file is tracked); `.gobbi/state.db` returns 0 (file is ignored); both states are validated by an integration test added in Wave A.1.8.

Evidence (post-Wave-A.1.8): `.gitignore` update, integration test asserting check-ignore exit codes, System F-1 finding.

---

### SC-ORCH-23 — Path-resolution sweep: every `gobbi.db` open uses `resolveDbPath(sessionDir)` helper (post-Wave-A.1)

**Given** the post-Wave-A.1.7 codebase
**When** `grep -rn 'join(sessionDir, .gobbi.db.)' packages/cli/src/` runs
**Then** zero non-test matches are returned; every callsite that previously hard-coded the per-session `gobbi.db` path now calls `resolveDbPath(sessionDir)` (or equivalent helper) defined in `commands/session.ts`; the workspace rename touches the helper only, not the 11 individual call sites.

Evidence (post-Wave-A.1.7): `commands/session.ts` `resolveDbPath` helper, A.1.7 callsite list (`{guard,stop,init,next,status,resume,capture-subagent,capture-planning,transition}.ts` + `session.ts` + `gotcha/promote.ts`).

---

### SC-ORCH-24 — EventStore constructor accepts explicit partition keys (post-Wave-A.1)

**Given** a workspace with `.gobbi/state.db` and an active session whose `metadata.json` is at `.gobbi/projects/<name>/sessions/<id>/`
**When** `new EventStore('.gobbi/state.db', { sessionId: <id>, projectId: <name> })` opens the store and writes an event
**Then** the persisted row has `session_id === <id>` AND `project_id === <name>` (not the path-derived `'.gobbi'` and `null`); a per-session caller without explicit params still works via the path-derivation fallback.

Evidence (post-Wave-A.1.2): `store.ts` constructor signature change, partition-key fallback at `store.ts:476-477`, Architecture F-2 finding.

---

## Concurrency + durability

### SC-ORCH-25 — `wal_checkpoint(TRUNCATE)` runs after every `workflow.step.exit` (post-Wave-A.1)

**Given** a session that has emitted three `workflow.step.exit` events under workspace-scoped `state.db`
**When** the WAL file is inspected after each step.exit
**Then** the WAL has been truncated to size 0 (or close to it) immediately after each step.exit commit; events written between adjacent step.exits remain in WAL until the next checkpoint; the existing `store.ts::close()` checkpoint at lines 588-590 still runs at session-end (additive, not replaced); SIGKILL between adjacent step.exits cannot lose events committed before the prior step.exit.

Evidence (post-Wave-A.1.9): `store.ts` per-step-exit checkpoint hook, integration test fixture using SIGKILL between checkpoints, Architecture P-A-6 finding (additive coexistence note).

---

## Closed-enumeration

### SC-ORCH-26 — Event-set test asserts `ALL_EVENT_TYPES.size === 23` post-Pass-4 (post-Wave-A.1)

**Given** the post-Wave-A.1.3 codebase with `step.advancement.observed` registered in `events/index.ts::ALL_EVENT_TYPES`
**When** the closed-enumeration test scans every category constant
**Then** the union has exactly 23 entries: 9 `workflow.*`, 3 `delegation.*`, 3 `decision.*`, 2 `artifact.*`, 3 `guard.*`, 1 `verification.*`, 1 `session.*`, 1 `step.*`; any reducer-accepted event outside this set fails the test.

Evidence (post-Wave-A.1.3): `events/index.ts:1` event-count documentation update, `events/__tests__/closed-enumeration.test.ts` (new or extended), README §3.5 (23-event ledger).

---

See `README.md` for the prose overview. `checklist.md` turns each scenario ID into ISTQB-tagged verifiable items; `review.md` reports Pass-4 DRIFT / GAP / NOTE with evaluator-finding disposition and the multi-session execution plan.
