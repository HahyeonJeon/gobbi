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
**Then** a new session directory `.gobbi/projects/<name>/sessions/<id>/` is created with `metadata.json`; the per-session `gobbi.db` records exactly one `workflow.start` event with `actor='cli'`; reducer sets `currentStep = 'ideation'`; exit code is `0`.

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

### SC-ORCH-11 — Footer auto-injected per `spec.json::blocks.footer`

**Given** a step spec at `packages/cli/src/specs/<step>/spec.json` with `blocks.footer` populated
**When** `assembly.ts::compile()` renders the prompt for that step
**Then** the rendered prompt contains a `StaticSection` with `id='blocks.footer'` positioned immediately after `blocks.completion` and before `session.state`; the footer section's kind is `'static'`; same-spec recompilations produce byte-identical `staticPrefixHash` and `prompt.text` (cache-stable); productive specs carry the COMPLETE-only variant, the shared evaluation spec carries the verdict variant (PASS/REVISE/ESCALATE).

Evidence: `_schema/v1.ts::StepBlocks` (with `readonly footer: string`), `_schema/v1.json` mirror (regenerated via `bun run regen-schema`; `rg -c '"footer"' v1.json` returns 4), `assembly.ts::renderSpec` step 5b (`makeStatic({ id: 'blocks.footer', content: spec.blocks.footer })`), `schema.test.ts:399-404` drift test, `__tests__/footer.snap.test.ts`.

---

### SC-ORCH-12 — Agent runs `gobbi workflow transition COMPLETE` from the footer

**Given** an agent that has finished the work named in `blocks.completion.criteria`
**When** the agent's last action is `gobbi workflow transition COMPLETE` (as instructed by the spec's `blocks.footer` text)
**Then** the CLI emits `workflow.step.exit`; the workflow advances per the reducer's eval-decision; no other agent prose phrasing advances the workflow (the CLI's output is authoritative).

Evidence: `transition.ts:74-84` (TRANSITION_KEYWORDS), `transition.ts:335` (event emission), `specs/{ideation,planning,execution,memorization,handoff}/spec.json::blocks.footer` (productive variant), `specs/evaluation/spec.json::blocks.footer` (verdict variant).

---

### SC-ORCH-27 — Schema rejects spec missing `blocks.footer`

**Given** a spec object with `blocks.footer` absent
**When** `validateStepSpec()` runs against the object
**Then** the result is `{ ok: false }` with an error whose `keyword === 'required'`, `instancePath === '/blocks'`, and `params.missingProperty === 'footer'`.

Evidence: `_schema/v1.json` `required` arrays in both `properties.blocks` and `$defs.StepBlocks`; `__tests__/footer.snap.test.ts` schema-enforcement describe block.

---

### SC-ORCH-28 — Footer section renders between completion and session state for productive specs

**Given** each of the five productive step specs (`ideation`, `planning`, `execution`, `memorization`, `handoff`)
**When** `compile()` runs with a deterministic `CompileInput`
**Then** the resulting `prompt.sections` contains a section with `id='blocks.footer'` whose index is greater than the `blocks.completion` index and less than the `session.state` index; the section's `kind` is `'static'`; `prompt.text` contains the token sequence `gobbi workflow transition COMPLETE`; `prompt.text` does not contain any of the token sequences `gobbi workflow transition PASS`, `gobbi workflow transition REVISE`, `gobbi workflow transition ESCALATE`, `gobbi workflow transition SKIP`, `gobbi workflow transition TIMEOUT`, `gobbi workflow transition FINISH`, `gobbi workflow transition ABORT`, or `gobbi workflow transition RESUME`.

Evidence: `assembly.ts::renderSpec` step 5b; `budget.ts::inferSlot` `'blocks.footer'` → `'instructions'` case; `__tests__/footer.snap.test.ts` productive-specs describe block (5 parametrized test cases).

---

### SC-ORCH-29 — Footer section renders with verdict verbs for the evaluation spec

**Given** the shared evaluation spec (`evaluation/spec.json`) compiled with a deterministic `CompileInput`
**When** `compile()` runs
**Then** `prompt.text` contains the token sequences `gobbi workflow transition PASS`, `gobbi workflow transition REVISE`, and `gobbi workflow transition ESCALATE`; `prompt.text` does not contain the token sequence `gobbi workflow transition COMPLETE` nor any operator-only verb token sequences (`gobbi workflow transition SKIP`, `TIMEOUT`, `FINISH`, `ABORT`, or `RESUME`). The bare word "COMPLETE" appears in the prose body ("COMPLETE is not valid for evaluation steps") — that occurrence is intentional; only the verb token sequence is constrained.

Evidence: `evaluation/spec.json::blocks.footer` (verdict variant); `__tests__/footer.snap.test.ts` evaluation-spec describe block.

---

### SC-ORCH-30 — Compiled footer is cache-stable across recompilations

**Given** the same `CompileInput` (same spec, same `WorkflowState`, same `DynamicContext`) passed to `compile()` twice
**When** both calls complete
**Then** the two results have identical `staticPrefixHash` values and identical `prompt.text` strings.

Evidence: `assembly.ts::compile` deterministic pipeline; `__tests__/footer.snap.test.ts` cache-stability describe block.

---

### SC-ORCH-31 — One-byte footer mutation invalidates `staticPrefixHash`

**Given** two spec objects that differ by exactly one byte in `blocks.footer` (e.g., a trailing space appended to the productive variant text)
**When** each is compiled with the same `CompileInput` (same state, same dynamic context)
**Then** the two `staticPrefixHash` values differ, proving the footer content feeds the cache prefix and any footer mutation breaks the existing cache entry.

Evidence: `assembly.ts` `makeStatic` → hash accumulation chain; `__tests__/footer.snap.test.ts` cache-stability one-byte-mutation test.

---

### SC-ORCH-32 — Schema mirror carries `footer` in both `StepBlocks` declarations

**Given** the post-B.1.1 `packages/cli/src/specs/_schema/v1.json` (regenerated via `bun run regen-schema`)
**When** the file is inspected
**Then** `properties.blocks.required` includes `'footer'`; `$defs.StepBlocks.required` includes `'footer'`; both `properties.blocks.properties` and `$defs.StepBlocks.properties` declare `footer: { type: 'string', minLength: 1 }`. Running `rg -c '"footer"' packages/cli/src/specs/_schema/v1.json` returns exactly 4 (two `required` array entries plus two `properties` declarations).

Evidence: `_schema/v1.ts::StepBlocksSchema` (source); `bun run regen-schema` script in `packages/cli/package.json`; `schema.test.ts:399-404` drift test asserts byte equality between the TypeScript schema and the on-disk JSON file.

---

## Missed-advancement safety net

### SC-ORCH-13 — PostToolUse on `gobbi workflow transition` Bash emits `step.advancement.observed` via direct `store.append()`

**Given** an active session and an agent runs a Bash tool with command starting `gobbi workflow transition`
**When** the PostToolUse hook fires (`capture-planning.ts` extended path)
**Then** the hook calls `store.append()` directly with `type='step.advancement.observed'`, `actor='hook'`, `idempotencyKind='tool-call'` keyed on the PostToolUse payload's `tool_call_id`; the event is persisted; the reducer never sees this audit-only event (bypass is intentional per Architecture F-1).

Evidence: `capture-planning.ts:166-179` extended; `events/step-advancement.ts` event factory; `store.ts:36-48` idempotency formula; Architecture F-1 finding.

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
**Then** `artifact.write` is emitted for the file; for each extraction class, the agent writes the markdown destination (`learnings/decisions/<slug>.md`, `learnings/gotchas/<slug>.md`, `design/<area>/*.md`, `learnings/backlogs/<slug>.md`) and an `INSERT INTO memories` row with the matching `class`; the agent then runs `gobbi workflow transition COMPLETE`; `workflow.step.exit` advances `currentStep` to `handoff`.

Evidence: `specs/memorization/spec.json` (rewritten in Wave A.1.6), `events/artifact.ts` (artifact.write), `transition.ts:335` (step.exit emission), README §8.

---

## Handoff step

### SC-ORCH-20 — Handoff writes `handoff.md` + memory row + emits `workflow.finish`

**Given** an active session at `currentStep = 'handoff'` with `memorization.md` already written
**When** the handoff agent reads `memorization.md` plus the last-N events from the per-session `gobbi.db` at `.gobbi/projects/<name>/sessions/<id>/gobbi.db` and writes `sessions/<id>/handoff/handoff.md`
**Then** `artifact.write` is emitted; an `INSERT INTO memories` row is added with `class='handoff', session_id=<id>, project_id=<resolved>`; the agent runs `gobbi workflow transition COMPLETE` which on the handoff step maps to `workflow.finish` per `index.json` rule `{ from: "handoff", to: "done", trigger: "workflow.finish" }`; reducer transitions `currentStep` to `done`.

Evidence: `specs/handoff/spec.json`, `index.json` (handoff transitions added Wave A.1.5), `events/workflow.ts:21` (workflow.finish), `events/artifact.ts`.

---

## Schema migration + path discipline

### SC-ORCH-21 — `gobbi maintenance migrate-state-db` is reversible via `restore-state-db`

> **PARTIAL FULFILLMENT (PR-CFM-B):** `gobbi maintenance restore-state-db` shipped (file-level revert from operator-created `<target>.bak`; refuses if target exists, `--force` rename-asides to `<target>.pre-restore.<unix-ts>`). Auto-backup-on-migrate (Option A — `migrate-state-db.ts` writing `.bak` before migrating) plus the replay-equivalence integration test remain deferred. See `commands/maintenance/restore-state-db.ts` and issue #242.

**Given** a workspace at schema v5 with per-session `gobbi.db` files under `.gobbi/projects/*/sessions/*/gobbi.db`
**When** `gobbi maintenance migrate-state-db` runs
**Then** events are migrated into a new workspace `.gobbi/state.db` at schema v6; partition keys (`session_id`, `project_id`) are preserved on every row; per-session `gobbi.db` files are renamed `.bak` (not deleted) for one-commit reversibility; `gobbi maintenance restore-state-db` reverses the operation; replay-equivalence integration test confirms identical state derivation pre- and post-migration.

Evidence: `commands/maintenance/migrate-state-db.ts`, `commands/maintenance/restore-state-db.ts`, `commands/maintenance.ts:48-59` registry, replay-equivalence test in Wave A.1.10 integration tests.

---

### SC-ORCH-22 — `.gobbi/gobbi.db` has `!.gitignore` exception so it is git-tracked

**Given** a workspace with `.gitignore` containing `.gobbi/*`, `!.gobbi/projects/`, `!.gobbi/gobbi.db`
**When** the user runs `git check-ignore .gobbi/gobbi.db` and `git check-ignore .gobbi/state.db`
**Then** `.gobbi/gobbi.db` returns nonzero (file is tracked); `.gobbi/state.db` returns 0 (file is ignored); both states are validated by an integration test added in Wave A.1.8.

Evidence: `.gitignore` Wave A.1.8 update (commit `cdaea69`), integration test asserting check-ignore exit codes, System F-1 finding.

---

### SC-ORCH-23 — Path-resolution sweep: every `gobbi.db` open uses explicit partition keys or `resolveDbPath(sessionDir)` helper

**Given** the Wave-A.1.7 codebase
**When** `grep -rn 'join(sessionDir, .gobbi.db.)' packages/cli/src/` runs
**Then** zero non-test matches are returned; every callsite that previously hard-coded the per-session `gobbi.db` path now calls `resolveDbPath(sessionDir)` (or equivalent helper) defined in `commands/session.ts`; the workspace rename touches the helper only, not the 11 individual call sites.

Evidence: Wave A.1.7 explicit partition-key refactor (commit `8d71fa4`), callsite list (`{guard,stop,init,next,status,resume,capture-subagent,capture-planning,transition}.ts` + `session.ts` + `gotcha/promote.ts`).

---

### SC-ORCH-24 — EventStore constructor accepts explicit partition keys

**Given** a workspace with `.gobbi/state.db` and an active session whose `metadata.json` is at `.gobbi/projects/<name>/sessions/<id>/`
**When** `new EventStore('.gobbi/state.db', { sessionId: <id>, projectId: <name> })` opens the store and writes an event
**Then** the persisted row has `session_id === <id>` AND `project_id === <name>` (not the path-derived `'.gobbi'` and `null`); a per-session caller without explicit params still works via the path-derivation fallback.

Evidence: `store.ts` constructor with `{ sessionId?, projectId? }` options (Wave A.1.2, commit `14f53d5`), partition-key fallback at `store.ts:476-477`, Architecture F-2 finding.

---

## Concurrency + durability

### SC-ORCH-25 — `wal_checkpoint(TRUNCATE)` runs after every `workflow.step.exit`

**Given** a session that has emitted three `workflow.step.exit` events under workspace-scoped `state.db`
**When** the WAL file is inspected after each step.exit
**Then** the WAL has been truncated to size 0 (or close to it) immediately after each step.exit commit; events written between adjacent step.exits remain in WAL until the next checkpoint; the existing `store.ts::close()` checkpoint at lines 588-590 still runs at session-end (additive, not replaced); SIGKILL between adjacent step.exits cannot lose events committed before the prior step.exit.

Evidence: `store.ts` per-step-exit checkpoint hook (Wave A.1.9, commit `84f4c79`), integration test fixture using SIGKILL between checkpoints, Architecture P-A-6 finding (additive coexistence note).

---

## Closed-enumeration

### SC-ORCH-26 — Event-set test asserts `ALL_EVENT_TYPES.size === 24`

**Given** the post-Wave-A.1.3 + Wave-C.1 codebase with `step.advancement.observed` and `prompt.patch.applied` registered in `events/index.ts::ALL_EVENT_TYPES`
**When** the closed-enumeration test scans every category constant
**Then** the union has exactly 24 entries: 9 `workflow.*`, 3 `delegation.*`, 3 `decision.*`, 2 `artifact.*`, 3 `guard.*`, 1 `verification.*`, 1 `session.*`, 1 `step.*`, 1 `prompt.*`; any reducer-accepted event outside this set fails the test; audit-only events (`step.advancement.observed`, `prompt.patch.applied`) are in `ALL_EVENT_TYPES` but excluded from the `Event` reducer union.

Evidence (post-Wave-A.1.3 + C.1): `events/index.ts:1` event-count documentation ("9 categories, 24 event types"), `events/__tests__/closed-enumeration.test.ts`, README §3.5 (24-event ledger).

---

See `README.md` for the prose overview. `checklist.md` turns each scenario ID into ISTQB-tagged verifiable items; `review.md` reports Pass-4 DRIFT / GAP / NOTE with evaluator-finding disposition and the multi-session execution plan.
