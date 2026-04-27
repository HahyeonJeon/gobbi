# Orchestration — Verification Checklist

Verification harness for the scenarios in `scenarios.md`. Items are grouped by scenario ID so every check traces directly to the scenario it validates. Each item carries an ISTQB technique tag: `[EP]` equivalence partition, `[BVA]` boundary value, `[DT]` decision table, `[ST]` state transition, `[UC]` use case, `[MANUAL]` manual, `[GAP]` aspirational behaviour not yet shipped (post-Wave-X target).

Items tagged `[GAP]` describe what the verification will look like once the corresponding wave ships; the wave's own checklist will turn the `[GAP]` into a concrete pass criterion. Items without `[GAP]` reflect behaviour that already exists in the current codebase or only requires the path-resolution sweep to retain its current behaviour after Wave A.1.

---

## SC-ORCH-01 — `workflow.start` emission on init

- `[ST]` `gobbi workflow init --task "<text>"` against a fresh `.gobbi/projects/<name>/` writes `metadata.json` and emits exactly one `workflow.start` event with `actor='cli'`.
  - Verify: `bun test packages/cli/src/commands/workflow/__tests__/init.test.ts` covers the bootstrap path; assertion is `events.length === 1 && events[0].type === 'workflow.start'`.
- `[BVA]` Repeated `gobbi workflow init` against an already-initialized session is idempotent (returns the existing session id; no duplicate `workflow.start`).
  - Verify: existing init test covers the idempotent re-entry case.

---

## SC-ORCH-02 — `step.exit` advances directly when eval is disabled

- `[ST]` Reducer test: input event `workflow.step.exit` from `currentStep='ideation'` with `evalConfig.ideation.enabled=false` outputs `currentStep='planning'`.
  - Verify: `packages/cli/src/workflow/__tests__/reducer.test.ts` step.exit dispatch + eval predicate.
- `[DT]` 4×3 eval-mode × step matrix (already covered for ideation/planning; extend for execution) — `'ask'|'always'|'skip'|'auto'` × `ideation|planning|execution` — produces deterministic next-step routing.
  - Verify: `packages/cli/src/__tests__/features/q2-evalconfig-e2e.test.ts` (extends the existing e2e harness from `feature-pass-template.md` "Evaluation wiring" pattern).

---

## SC-ORCH-03 — `step.exit` enters eval step when eval is enabled

- `[ST]` Reducer test: `workflow.step.exit` from `currentStep='planning'` with `evalConfig.planning.enabled=true` outputs `currentStep='planning_eval'`.
  - Verify: reducer test as above; state-transition matrix entry.
- `[EP]` Compiled prompt for `*_eval` steps uses the verdict footer variant (PASS/REVISE/ESCALATE) not the COMPLETE-only footer.
  - Verify: snapshot test under `packages/cli/src/specs/__tests__/snapshot.test.ts` asserts on footer-block content for an eval-step compile.

---

## SC-ORCH-04 — `eval.verdict PASS` advances forward

- `[ST]` `gobbi workflow transition PASS` from `currentStep='planning_eval'` advances to `currentStep='execution'`; emits `decision.eval.verdict` with `verdict='PASS'`; `parent_seq` links to the originating `step.exit`.
  - Verify: `transition.test.ts` PASS-from-eval case; assert event sequence and `parent_seq` linkage.
- `[BVA]` PASS from a non-eval step is rejected with `workflow.invalid_transition`.
  - Verify: reducer rejection test; SC-ORCH-10 covers the audit emission.

---

## SC-ORCH-05 — `eval.verdict REVISE --loop-target` re-enters target

- `[ST]` REVISE from `currentStep='execution_eval'` with `--loop-target planning` advances to `currentStep='planning'`; `state.feedbackRound` increments.
  - Verify: `transition.test.ts` REVISE-with-loop-target case; reducer state mutation assertion.
- `[BVA]` REVISE when `feedbackRound >= maxIterations` emits `workflow.invalid_transition` and routes to `error` instead of looping forever.
  - Verify: iteration-cap reducer test; assertion on cap-exceeded branch.
- `[EP]` REVISE without `--loop-target` defaults to the producing step's pre-eval (e.g., `execution_eval` → `execution`).
  - Verify: `transition.ts` arg parsing test; default loop-target derivation.

---

## SC-ORCH-06 — `eval.verdict ESCALATE` surfaces error

- `[ST]` ESCALATE from any `*_eval` step transitions to `currentStep='error'` and emits `decision.eval.verdict` with `verdict='ESCALATE'`.
  - Verify: reducer ESCALATE branch test; `commands/workflow/status.ts` rendering test.
- `[UC]` `gobbi workflow status` after ESCALATE returns the escalation reason; `gobbi workflow resume --target <step>` advances back into the workflow.
  - Verify: `status.ts` integration test; `resume.ts:190` resume-from-error test.

---

## SC-ORCH-07 — `step.skip` routes to ideation

- `[ST]` `workflow.step.skip` from `currentStep='planning_eval'` routes to `ideation` per `index.json:200-247`.
  - Verify: reducer step.skip test; transitions JSON snapshot.
- `[EP]` SKIP is operator-only (not in agent footer); `spec.json::blocks.footer` must not mention `gobbi workflow transition SKIP`.
  - Verify: SC-ORCH-28 productive-spec verb-partition assertions include `gobbi workflow transition SKIP` in the negative set; SC-ORCH-29 evaluation-spec assertions do the same.

---

## SC-ORCH-08 — `step.timeout` routes to error

- `[ST]` Stop hook detects `now - stepStartedAt > meta.timeoutMs` and emits `workflow.step.timeout`; reducer routes to `error`.
  - Verify: `stop.ts` timeout-detection test; reducer timeout branch test.
- `[BVA]` `meta.timeoutMs` absent or `0` disables timeout (no timeout event emitted).
  - Verify: stop-hook test with absent timeout.

---

## SC-ORCH-09 — `workflow.resume` from error to target

- `[ST]` `gobbi workflow resume --target planning` from `currentStep='error'` emits `workflow.resume` with `fromError=true, target='planning'`; reducer transitions to `planning`.
  - Verify: `commands/workflow/__tests__/resume.test.ts` resume-from-error case.
- `[EP]` Resume from non-error state requires `--allow-running` flag (or rejects).
  - Verify: `resume.ts` flag-parsing test.

---

## SC-ORCH-10 — `workflow.invalid_transition` audit on rejection

- `[ST]` Reducer rejection emits `workflow.invalid_transition` in a fresh transaction; the rejected event is NOT persisted.
  - Verify: `engine.ts:223,232,272` audit-emit-on-rejection integration test; assert `events.filter(type === <rejected>).length === 0`.
- `[EP]` `ReducerRejectionError` (typed) triggers the audit branch; plain `Error` from `assertNever` does not (Architecture F-1 — covered by direct-append on `step.advancement.observed`).
  - Verify: reducer error-classification test.

---

## SC-ORCH-11 — Footer auto-injection from `blocks.footer`

- `[ST]` `_schema/v1.ts::StepBlocks` declares `readonly footer: string` (required, `minLength: 1`); `_schema/v1.json` mirrors both `properties.blocks` and `$defs.StepBlocks` halves; `schema.test.ts:399-404` drift test passes.
  - Verify: `bun run typecheck` passes; `bun test packages/cli/src/specs/__tests__/schema.test.ts -t 'drift'` passes; `rg -c '"footer"' packages/cli/src/specs/_schema/v1.json` returns 4.
- `[ST]` `assembly.ts::renderSpec` renders `blocks.footer` as a `StaticSection` (`id='blocks.footer'`, `kind='static'`) immediately after `blocks.completion` and before `session.state`.
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts` — section-position assertions in the productive-specs and evaluation-spec describe blocks.
- `[ST]` Same-spec recompilations produce identical `staticPrefixHash` and `prompt.text` (cache stability).
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts` — cache-stability describe block (two-compile equality assertion).

---

## SC-ORCH-12 — Agent runs `gobbi workflow transition COMPLETE`

- `[UC]` Productive step footer (`spec.json::blocks.footer`) instructs `COMPLETE` as the last action; the agent's `gobbi workflow transition COMPLETE` invocation emits `workflow.step.exit`.
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts` — verb-partition assertions confirm `gobbi workflow transition COMPLETE` is present in productive prompts; `transition.ts:74-84` map review confirms the COMPLETE keyword routes to `step.exit`.
- `[EP]` Footer content must include the `gobbi workflow transition` token sequence; `blocks.footer` with empty string is rejected by schema (`minLength: 1`); absent `blocks.footer` is rejected as a required field.
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts` — schema-enforcement describe block (missing footer, empty footer).

---

## SC-ORCH-27 — Schema rejects spec missing `blocks.footer`

- `[EP]` `validateStepSpec()` on a spec object with `blocks.footer` absent returns `{ ok: false }` with an error whose `instancePath === '/blocks'` and `params.missingProperty === 'footer'`.
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts -t 'missing blocks.footer'` — schema-enforcement describe block.

---

## SC-ORCH-28 — Footer renders for productive specs (verb-partition + position)

- `[ST]` × 5 For each productive spec (`ideation`, `planning`, `execution`, `memorization`, `handoff`): `compile()` produces a section `id='blocks.footer'` positioned after `blocks.completion` and before `session.state`; section `kind` is `'static'`; `prompt.text` contains `gobbi workflow transition COMPLETE`; `prompt.text` does not contain `gobbi workflow transition PASS`, `REVISE`, `ESCALATE`, `SKIP`, `TIMEOUT`, `FINISH`, `ABORT`, or `RESUME` as token sequences.
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts` — productive-specs describe block (5 parametrized test cases).

**Note (Architecture F-2):** The operator/agent verb partition — productive steps see only COMPLETE; evaluation steps see only PASS/REVISE/ESCALATE; operator-only verbs (SKIP/TIMEOUT/FINISH/ABORT/RESUME) appear in neither — is a convention enforced by `spec.json` authoring, not by an exported constant. The verb-partition assertions in `footer.snap.test.ts` are the enforcement mechanism; they fail CI if any spec's `blocks.footer` drifts outside its allowed verb set.

---

## SC-ORCH-29 — Footer renders for evaluation spec (verdict-verb partition)

- `[ST]` For the shared evaluation spec: `compile()` produces a footer section with `gobbi workflow transition PASS`, `gobbi workflow transition REVISE`, and `gobbi workflow transition ESCALATE` present; `gobbi workflow transition COMPLETE` and all operator-only verb token sequences absent. The bare word "COMPLETE" in the prose body ("COMPLETE is not valid for evaluation steps") is not a violation — the assertion targets the full token sequence only.
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts` — evaluation-spec describe block.

---

## SC-ORCH-30 — Footer cache stability across recompilations

- `[ST]` Same `CompileInput` passed to `compile()` twice produces identical `staticPrefixHash` and `prompt.text`.
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts` — cache-stability describe block (two-compile equality test).

---

## SC-ORCH-31 — One-byte footer mutation flips `staticPrefixHash`

- `[BVA]` Two spec objects differing by exactly one byte in `blocks.footer` (e.g., trailing space) produce different `staticPrefixHash` values when compiled with the same `CompileInput`.
  - Verify: `bun test packages/cli/src/specs/__tests__/footer.snap.test.ts` — cache-stability describe block (mutation test).

---

## SC-ORCH-32 — Schema mirror carries `footer` in both `StepBlocks` declarations

- `[MANUAL]` `packages/cli/src/specs/_schema/v1.json` (post-B.1.1) has `'footer'` in `properties.blocks.required` AND `$defs.StepBlocks.required`; both `properties` blocks declare `footer: { type: 'string', minLength: 1 }`. `rg -c '"footer"' v1.json` returns 4.
  - Verify: `schema.test.ts:399-404` drift test asserts byte equality between the TypeScript source and the on-disk JSON; running `bun run regen-schema` reproduces the committed file.

---

## SC-ORCH-13 — PostToolUse direct-append `step.advancement.observed` (post-Wave-A.1)

- `[GAP]` `events/step.ts` defines `STEP_EVENTS.ADVANCEMENT_OBSERVED`; `events/index.ts::ALL_EVENT_TYPES` includes the new type.
  - Verify (post-A.1.3): `bun test packages/cli/src/workflow/events/__tests__/closed-enumeration.test.ts`.
- `[GAP]` PostToolUse hook on Bash matching `gobbi workflow transition` calls `store.append()` directly (bypasses reducer); emitted event has `actor='hook'`, `idempotencyKind='tool-call'`, key derived from `tool_call_id`.
  - Verify (post-A.1.3 + E.1.1): `capture-planning.test.ts` integration test asserts persisted event after a PostToolUse fixture.
- `[BVA]` Idempotency: hook retry with same `tool_call_id` does not duplicate the event (`ON CONFLICT DO NOTHING`).
  - Verify (post-E.1.1): hook retry fixture asserts `count(events WHERE type='step.advancement.observed') === 1`.

---

## SC-ORCH-14 — Stop-hook reminder injection at ≥ 2 turns (post-Wave-E.1)

- `[GAP]` Stop hook predicate: no `step.advancement.observed` since last `step.exit`/`start`/`resume` AND `turns_since_step_start >= 2` triggers `additionalContext` injection.
  - Verify (post-E.1.2): `stop.test.ts` predicate-true case asserts injection in hook output.
- `[BVA]` `turns_since_step_start === 1` does NOT inject; `=== 2` does.
  - Verify (post-E.1.2): two adjacent fixture cases at the boundary.
- `[BVA]` After a `step.advancement.observed` event the predicate resets — next step's reminder counts from the new step.
  - Verify (post-E.1.2): multi-step fixture.

---

## SC-ORCH-15 — Stop-hook escalation at ≥ 5 turns (post-Wave-E.1)

- `[GAP]` Stop hook escalation: at `turns_since_step_start >= 5` without advancement, write a row to `state_snapshots` flagging the missed-advancement.
  - Verify (post-E.1.2): `stop.test.ts` escalation case asserts `state_snapshots` row with the expected flag.
- `[GAP]` `gobbi workflow status` includes the escalation in its output.
  - Verify (post-E.1.2): `status.ts` integration test asserts escalation rendering.

---

## SC-ORCH-16 — `gobbi workflow run` per-step spawn (post-Wave-E.2)

- `[GAP]` `commands/workflow/run.ts` exists, registered in `workflow.ts` subcommand registry; `gobbi workflow run --task "<text>"` returns exit 0 on a happy-path session.
  - Verify (post-E.2.1): `run.test.ts` happy-path integration test.
- `[GAP]` Loop terminates when `currentStep ∈ {'done', 'error'}`; non-zero exit on error.
  - Verify (post-E.2.1): `run.test.ts` error-termination case.

---

## SC-ORCH-17 — Footer-miss reconciliation (post-Wave-E.2)

- `[GAP]` Child exit without state change re-spawns with reminder block; retry budget = 3 default.
  - Verify (post-E.2.1): `run.test.ts` footer-miss fixture asserts up to 3 re-spawns then `step.timeout`.
- `[BVA]` Retry budget 0 / 1 / 3 / 4 — boundary cases.
  - Verify (post-E.2.1): parametrized retry test.

---

## SC-ORCH-18 — Cross-mode parity (post-Wave-E.2)

- `[GAP]` Same `state.db` content + same compiled spec library produce byte-identical compiled prompts in Inner and Outer modes (modulo per-mode footer line).
  - Verify (post-E.2.2): `packages/cli/src/specs/__tests__/snapshot.test.ts` parity-snapshot assertion using the same fixture under two compile modes.

---

## SC-ORCH-19 — Memorization writes + emits step.exit

- `[ST]` Memorization step writes `sessions/<id>/memorization/memorization.md` and emits `artifact.write` for the file plus all extracted destination files.
  - Verify: `memorization/spec.json` artifact-list assertion (post-A.1.6 update); reducer artifact.write tests.
- `[UC]` Agent runs `gobbi workflow transition COMPLETE`; reducer transitions `currentStep` to `handoff` (post-Wave-A.1.5).
  - Verify (post-A.1.5): reducer step.exit-from-memorization test asserts target = `handoff`.

---

## SC-ORCH-20 — Handoff writes + emits workflow.finish (post-Wave-A.1)

- `[GAP]` `specs/handoff/spec.json` exists with the README §9.2 template; running through the step writes `sessions/<id>/handoff/handoff.md` and inserts a `gobbi.db::memories` row with `class='handoff', session_id=<id>, project_id=<resolved>`.
  - Verify (post-A.1.5): `specs/handoff/__tests__/spec.test.ts` (new) asserts artifact-write + memory-row insert.
- `[ST]` Agent's `COMPLETE` on the handoff step maps to `workflow.finish` per `index.json` rule; reducer transitions `currentStep` to `done`.
  - Verify (post-A.1.5): reducer handoff-to-done transition test.
- `[UC]` Per-project handoff coverage: every `done` session has exactly one `class='handoff'` row AND `handoff.md` file (success criterion §13.8).
  - Verify (post-A.1): integration test scanning `done`-state sessions.

---

## SC-ORCH-21 — `migrate-state-db` reversibility (post-Wave-A.1)

- `[GAP]` `commands/maintenance.ts:48-59` registry includes `{ name: 'migrate-state-db', ... }` and `{ name: 'restore-state-db', ... }` — the dispatch loop routes both subcommands (Architecture P-A-1).
  - Verify (post-A.1.4): `bun test packages/cli/src/commands/__tests__/maintenance.test.ts -t 'registry'` plus a smoke run of `gobbi maintenance migrate-state-db --dry-run`.
- `[GAP]` Atomic-rename safety: per-session `gobbi.db` files are renamed `.bak` (not deleted) so `restore-state-db` reverses the operation in one commit.
  - Verify (post-A.1.10): integration test using a fixture workspace; assert `restore` recovers the original state byte-for-byte.
- `[GAP]` Replay-equivalence: derived state pre- and post-migration is identical.
  - Verify (post-A.1.10): replay-equivalence test reads pre- and post- event logs and re-derives state via reducer; assert `deepEqual`.

---

## SC-ORCH-22 — `.gitignore` boundary (post-Wave-A.1)

- `[GAP]` `git check-ignore .gobbi/gobbi.db` returns nonzero (file is tracked); `git check-ignore .gobbi/state.db` returns 0 (file is ignored).
  - Verify (post-A.1.8): `bun test packages/cli/src/__tests__/gitignore-boundary.test.ts` (new) using `git check-ignore` shell-out.
- `[BVA]` `.gitignore` rule order: `!.gobbi/gobbi.db` MUST appear after `.gobbi/*` for the exception to apply (System F-1 finding).
  - Verify (post-A.1.8): `.gitignore` lint-test asserts line order.

---

## SC-ORCH-23 — Path-resolution sweep complete (post-Wave-A.1)

- `[GAP]` Zero non-test matches for `join(sessionDir, 'gobbi.db')` across `packages/cli/src/`.
  - Verify (post-A.1.7): `rg -n "join\(sessionDir, 'gobbi\.db'\)" packages/cli/src/ --type ts` returns no lines.
- `[GAP]` Every callsite in the A.1.7 list (`{guard,stop,init,next,status,resume,capture-subagent,capture-planning,transition}.ts` + `session.ts:320` + `gotcha/promote.ts:308`) calls `resolveDbPath(sessionDir)` (or equivalent helper) instead of constructing the path inline.
  - Verify (post-A.1.7): grep for the helper name; spot-read each file.

---

## SC-ORCH-24 — EventStore explicit partition keys (post-Wave-A.1)

- `[GAP]` `new EventStore(path, { sessionId, projectId })` writes events with the supplied partition keys (not path-derived).
  - Verify (post-A.1.2): `store.test.ts` constructor-with-options test; assert persisted row has supplied `session_id` and `project_id`.
- `[EP]` `new EventStore(path)` (no options) preserves path-derivation for backward compatibility.
  - Verify (post-A.1.2): existing per-session callsite tests pass unchanged.
- `[BVA]` Workspace path `.gobbi/state.db` with no options yields `session_id='.gobbi'` (the misbehaviour Architecture F-2 documents); with options yields the supplied values.
  - Verify (post-A.1.2): regression test for the constructor's misbehaviour-without-options branch.

---

## SC-ORCH-25 — `wal_checkpoint(TRUNCATE)` after each `step.exit` (post-Wave-A.1)

- `[GAP]` `store.ts` runs `PRAGMA wal_checkpoint(TRUNCATE)` after every commit of a `workflow.step.exit` event.
  - Verify (post-A.1.9): `store.test.ts` checkpoint-after-step-exit test inspects WAL-file size after commit.
- `[GAP]` Existing `store.ts::close()` checkpoint at lines 588-590 still runs at session-end (additive, not replaced — Architecture P-A-6).
  - Verify (post-A.1.9): close-time checkpoint test unchanged.
- `[GAP]` SIGKILL fixture between two adjacent step.exits loses zero events committed before the prior checkpoint.
  - Verify (post-A.1.10): SIGKILL durability integration test in Wave A.1.10.

---

## SC-ORCH-26 — 24-event closed enumeration

- `[GAP]` `events/index.ts:1` event-count documentation reads "9 categories, 24 event types"; `ALL_EVENT_TYPES.size === 24`.
  - Verify (post-A.1.3 + C.1): closed-enumeration test asserts size and category breakdown.
- `[GAP]` Every reducer-accepted event type appears in `ALL_EVENT_TYPES`; reducer-tested events outside the set fail the test. Audit-only events (`step.advancement.observed`, `prompt.patch.applied`) appear in `ALL_EVENT_TYPES` but are excluded from the reducer-typed `Event` union.
  - Verify (post-A.1.3 + C.1): test enumerates reducer cases and cross-checks `ALL_EVENT_TYPES`.

---

## Aggregate verification before Pass-4 ships

The Pass-4 PR itself adds no code, so its verification is documentation-only:

- `[MANUAL]` `README.md` references the 6-step model with `handoff` as step 5/6 in the §1 step table.
- `[MANUAL]` Event count is cited as 24 total (22 base + 1 Pass-4 + 1 Wave C.1) in §3.5 and §13.5.
- `[MANUAL]` `step.advancement.observed` is documented to commit via direct `store.append()` (not reducer-routed) in §3.5 and §6.
- `[MANUAL]` Every `[GAP]` item above traces to a Wave A.1 / B.1 / E.1 / E.2 task in `review.md`'s multi-session execution plan.
- `[MANUAL]` `scenarios.md` includes scenarios SC-ORCH-01 through SC-ORCH-26.
- `[MANUAL]` `review.md`'s DRIFT/GAP/NOTE entries cite the seed list from the orchestrator briefing plus any additional findings from the four ideation evaluators and three plan evaluators.

---

See `README.md` for the prose overview. `scenarios.md` defines the behaviour each verification item targets; `review.md` reports DRIFT/GAP/NOTE triage and names the wave that closes each `[GAP]`.
