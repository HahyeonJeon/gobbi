# Orchestration — Deterministic Workflow Engine + JIT Prompt Injection

Feature description for gobbi's v0.5.0 orchestration core: the L0–L3 layering, the deterministic state machine, the `state.db` / `gobbi.db` two-DB partition, the JIT prompt-footer pattern, the Inner-mode hook surface, the Outer-mode `gobbi workflow run` driver, and the `handoff` state-machine step. This is the design-of-record for Pass 4 (session `6e00d3d6-6833-4e8e-ae25-3f42165aebc3`), updated by **PR-FIN-2 finalization** (session `9755a2cb-0981-455b-915e-643de6de2500`, 2026-04-29) for the `memorization_eval` step addition (memorization now runs an evaluation loop), the workspace-DB-only lock (per-session `gobbi.db` and `state.json` removed), and the per-step session structure simplification (uniform `README.md` + freeform `*.md` + `rawdata/` + optional `evaluation/`). It supersedes the conceptual content in `../deterministic-orchestration.md` and absorbs the JIT framing from `../just-in-time-prompt-injection.md`. Wave A.2 will retire those two predecessor files.

---

> **The workflow is a deterministic engine. The agent is an activity. State lives outside the conversation.**

In v0.4.x the orchestrator reads skills and decides what to do next. The agent that just finished a step is structurally biased toward "we are done." Skip patterns appear: evaluation gets forgotten as context grows; the conversation feels complete and the workflow advances on prose rather than on a recorded event; `/compact` evaporates state because state lived only in the conversation. Pass 4 dissolves these failure modes by partitioning the system into L0–L3 layers where workflow logic, state, and agent activity each live in their proper home.

The same architecture pattern is well-established at scale — Temporal, AWS Step Functions, Argo Workflows. Gobbi is that pattern compressed to single-user, single-host, on top of SQLite. The decisions in this document map cleanly to "workflow definition + activity stub + history" with the workspace-level `state.db` as the history log and the workspace-level `gobbi.db` as the cross-session memory store.

---

## 1. The 6-step workflow

**Updated by PR-FIN-2 finalization (2026-04-29):** every productive step that emits durable artifacts now runs an evaluation loop — `memorization_eval` is added alongside `ideation_eval`, `planning_eval`, `execution_eval`. Memorization is no longer a one-shot productive step; it loops until the evaluator confirms full coverage of the session's decisions, gotchas, learnings, and design changes. Memorization no longer has a single canonical `memorization.md` — the step holds freeform `*.md` files indexed by `README.md`, and the durable destinations are the project's narrative dirs (`design/`, `decisions/`, `learnings/`, `gotchas/`, `backlogs/`, `notes/`) plus the workspace `.gobbi/gobbi.db` `memories` projection.

Every workflow is six productive steps + four optional evaluations. Evaluation is a sub-phase **inside** Ideation, Planning, Execution, and Memorization — not a standalone step. `handoff` is a **true state-machine step**, not a memorization sub-artifact, and runs without its own evaluator. The 6-step model is now the authoritative framing in `../../v050-overview.md` and `.claude/CLAUDE.md` (reconciled in Wave A.2).

| Step | State literal in `index.json` | Purpose | Productive or terminal? |
|---|---|---|---|
| 0 | (pre-loop) | **Workflow Configuration** — settings cascade seed, eval/discuss decisions, git mode, notification setup, task statement capture. Emits `workflow.start`. | productive (one-shot) |
| 1 | `ideation` | **Ideation Loop** — `User Prompt → Loop[Discussion → Investigation → Evaluation] → Idea`. | productive |
| (1e) | `ideation_eval` | Evaluation of ideation; verdict drives PASS/REVISE/ESCALATE. | optional eval |
| 2 | `planning` | **Planning Loop** — `Idea → Loop[Discussion → Plan Draft → Evaluation] → Plan`. | productive |
| (2e) | `planning_eval` | Evaluation of plan. | optional eval |
| 3 | `execution` | **Execution Loop** — `Plan → Loop[Discussion → Execute → Evaluation] → Results`. | productive |
| (3e) | `execution_eval` | Evaluation of execution. | optional eval |
| 4 | `memorization` | **Memorization Loop** — `Results → Loop[Memorize → Evaluation → REVISE if not fully covered] → Persisted memory`. Writes durable artifacts to project narrative dirs and `.gobbi/gobbi.db::memories`. Emits `workflow.step.exit`. | productive |
| **(4e)** | **`memorization_eval`** | **NEW (PR-FIN-2)** — evaluation that verifies the session's decisions, gotchas, learnings, and design changes were fully captured. Verdict REVISE re-enters memorization; PASS advances to handoff. | optional eval |
| 5 | `handoff` | **Handoff** — narrow summary for next session; writes freeform `*.md` files into `sessions/{id}/handoff/` plus one `class='handoff'` row in `.gobbi/gobbi.db::memories`; emits `workflow.finish`. No evaluator. | productive |
| done | `done` | Terminal. | terminal |
| error | `error` | Reached via `step.timeout` or `eval.verdict=ESCALATE`; recoverable via `workflow.resume`. | recoverable terminal |

Each Loop runs `[Discussion → Work → Evaluation]` until either the verdict is PASS or `maxIterations` is exceeded. Discussion is governed by `workflow.{step}.discuss.mode`; evaluation by `workflow.{step}.evaluate.mode` (see `../gobbi-config/README.md`). Evaluation runs only when `evalEnabled` is true at step entry. The orchestrator never auto-applies evaluation findings — the user discusses and decides.

**Spec graph diff (PR-FIN-2):**
- `specs/index.json` adds `memorization_eval` step (entry: `evaluation/spec.json`, `evalFor: "memorization"`).
- New transitions: `memorization → memorization_eval` (`evalMemorizationEnabled`), `memorization → handoff` (`evalMemorizationDisabled`), `memorization_eval → memorization` (`verdictRevise`, feedback: true), `memorization_eval → handoff` (`verdictPass`).
- `specs/predicates.ts` adds `evalMemorizationEnabled`, `evalMemorizationDisabled`.
- `lib/settings.ts` adds `workflow.memorization.evaluate.mode` (enum: `ask | always | skip | auto`).
- `WorkflowSettings` interface (`lib/settings.ts:186-190`) gains optional `memorization?: StepSettings` field, parallel to `ideation`, `planning`, `execution`. (No `EvalConfig` type exists in the codebase — the per-step settings live on `WorkflowSettings.<step>.evaluate: StepEvaluate`.)

### 1.1 Why split memorization from handoff

Memorization is **wide**: many rawdata sources (per-step `rawdata/` directories, subagent transcripts, the orchestrator transcript, the full event stream, session-tier gotchas), many destinations (`design/`, `decisions/`, `learnings/`, `gotchas/`, `backlogs/`, `notes/`, plus the workspace `.gobbi/gobbi.db::memories` projection). Its evaluation loop verifies that nothing was dropped on the way to durability.

Handoff is **narrow**: one source (the persisted memorization output plus last-N events), one destination (`sessions/{id}/handoff/*.md` plus one `gobbi.db::memories` row of class `handoff`). No evaluator — the writer is mechanical.

Different artifact-shape, different prompt focus, different agent context. The same separation principle that justifies external evaluators justifies handoff as its own step rather than a sub-artifact of memorization.

---

## 2. L0–L3 layering

The four layers each own a distinct slice of the orchestration stack. The user authors at L0 + L3; gobbi owns L1 + L2.

| Layer | Owner | Encoded in | Determinism property |
|---|---|---|---|
| **L0** Entry skill | Claude Code skill loader | `.claude/skills/gobbi/SKILL.md` (interface tier) | One-shot autonomous |
| **L1** CLI invocation | `packages/cli/src/cli.ts` + `commands/workflow/init.ts` (Inner mode); **NEW in Wave E.2** `commands/workflow/run.ts` (Outer mode — does not exist today) | `gobbi workflow init` (Inner) / `gobbi workflow run` (Outer, future) | One-shot autonomous |
| **L2** State machine + hooks | `specs/index.json` + `workflow/{store,engine,reducer}.ts` + `commands/workflow/{transition,guard,capture-*,stop}.ts` | Pure function `(state, event) → state'`; PreToolUse `permissionDecision: deny` enforcement | **Fully deterministic** |
| **L3a** Orchestrator-in-step | The active agent runtime (Claude Code or `claude -p`) | Compiled JIT prompt from `specs/assembly.ts::compile()` ending with the standardized footer | Autonomy within a bounded contract |
| **L3b** Subagent-in-task | A spawned subagent with `(role, specialties[])` composition | Composed delegation prompt — spec'd in deferred `roles-and-specialties` pass | Autonomy within a delegation contract |

**End-to-end trace (Plan → Execution under Outer mode, post-Wave-E.2 target):** `gobbi workflow run` reads the per-session `gobbi.db`, sees `currentStep == 'planning_eval'` with `verdictPass`, calls `transition.ts::buildEvent('PASS')` to advance to `currentStep == 'execution'`. `gobbi workflow next` compiles the execution prompt via `specs/assembly.ts`. L1 spawns `claude -p '<prompt>' --session-id $SID`. The agent works in the prompt and runs `gobbi workflow transition COMPLETE` per the footer. `transition.ts:335` emits `workflow.step.exit`; the reducer validates; the loop continues. Same flow runs in Inner mode under interactive Claude Code — the only differences are who spawns the runtime and where the prompt is delivered.

---

## 3. State.db + JSON memory model — workspace storage

**Updated by PR-FIN-2 Planning lock (2026-04-29):** the prior two-DB design is replaced with **one workspace SQLite + two-tier JSON memory**. SQLite is reduced to the gitignored runtime event log (`.gobbi/state.db`); cross-session memory and per-session operational metadata move to AJV-validated JSON files (`project.json` per project; `session.json` per session). The `.gobbi/gobbi.db` workspace SQLite file is **dropped entirely**; the `!.gobbi/gobbi.db` `.gitignore` exception is removed.

### 3.1 Final state (PR-FIN-2 Planning lock)

| Storage | Git | Scope | Holds |
|---|---|---|---|
| `.gobbi/state.db` | gitignored | workspace | append-only state-machine event log; partition keys `(project_id, session_id)`; powers `gobbi workflow status` / resume / stats aggregation |
| `.gobbi/projects/{name}/project.json` | **tracked** | per-project | cross-session promoted memory: sessions index, gotchas, decisions, learnings; AJV schema v1; sorted writes for stable git diffs |
| `.gobbi/projects/{name}/sessions/{id}/session.json` | gitignored | per-session | consolidated per-session operational metadata: steps, agents, agent_calls (provisional), evaluations; AJV schema v1; written once at memorization-step entry by aggregating `state.db` events; arrays sorted by `state.db.seq` ascending |

Per-session `gobbi.db`, per-session `state.json` (+ `.backup`), per-session `metadata.json`, and per-session `artifacts/` are all removed entirely. `gobbi maintenance wipe-legacy-sessions` cleans up the on-disk legacy artifacts during the PR-FIN-2 cutover. The `EventStore` constructor takes explicit `(projectId, sessionId)` partition keys at every call site — no path-derivation fallback.

**Why JSON, not SQLite, for memory.** Solo-developer iteration; schema is unstable while v0.5.0 finalization is in flight; binary-diff opacity in git makes review of every iteration commit unworkable. JSON gives text-diffable history, AJV gives boundary type safety, sorted writes give stable diffs, and cross-session queries walk the filesystem on demand (workspace scale is tens of sessions / hundreds of files — fast enough).

### 3.1.1 What's not present anymore

- **`.gobbi/gobbi.db`** SQLite file at workspace level — gone.
- **Docs-metadata manifest** — gone. Search-by-content uses ripgrep over markdown; drift detection uses git status.
- **`gobbi memory rebuild` command** — gone. JSON files are the source of truth; no projection to rebuild.
- **`findActiveSessions` / `findStateActiveSessions` helpers** — removed. `gobbi gotcha promote` and `gobbi maintenance wipe-legacy-sessions` no longer guard on other sessions in flight (callers will be redesigned in a later session).

### 3.2 EventStore constructor must accept explicit partition keys

`store.ts:369-370` derives `sessionId = basename(dirname(path))` from the DB path. For `.gobbi/state.db` that yields `'.gobbi'` as the session ID, and `resolveProjectRootBasename` reads `.gobbi/metadata.json` (absent), so `projectRootBasename` becomes permanently `null`. **Wave A.1 must add explicit partition-key parameters** to `EventStore`'s constructor: `new EventStore(path, { sessionId?: string; projectId?: string })`. Workspace-scoped callers supply both; the legacy path-derivation stays as a fallback during migration.

### 3.3 `.gobbi/state.db` (workspace, gitignored, append-only event log + materialized views)

```
events
  seq             INTEGER PRIMARY KEY
  project_id      TEXT NOT NULL
  session_id      TEXT NOT NULL
  ts              TEXT NOT NULL
  schema_version  INTEGER NOT NULL
  type            TEXT NOT NULL
  step            TEXT
  data            TEXT (JSON, validated by per-event schema)
  actor           TEXT NOT NULL  -- 'cli' | 'hook' | 'agent' | 'reducer'
  parent_seq      INTEGER        -- causal link
  idempotency_key TEXT NOT NULL UNIQUE

state_snapshots          -- one row per (session_id, seq); fast resume + replay-storm prevention
tool_calls               -- PreToolUse/PostToolUse audit (table-only, NOT a new event category)
config_changes           -- gobbi config set audit (table-only)
schema_meta              -- migration version + last-completed timestamp
```

Note: `prompt_patches` shipped in Wave C.1 (schema v7). Wave A.1 schema v6 did not include it; v7 adds the `prompt_patches` table for tracking applied JSON Patch operations.

`session_id` and `project_id` remain nullable `TEXT` (not `NOT NULL`) — SQLite cannot add `NOT NULL` columns via `ALTER TABLE` without a table rebuild, and the `store.ts:476` fallback (`this.sessionId ?? input.sessionId`) provides backward compatibility for any pre-v6 row that lacks the partition keys.

**Indices added in v6:** `(session_id, seq)`, `(project_id, seq DESC)` for "most recent N", `(type, step, session_id)` for predicate matchers; UNIQUE `idempotency_key` already exists at `store.ts:130-134`. Schema v7 (Wave C.1) added the `prompt_patches` table.

### 3.4 `project.json` + `session.json` — JSON memory model (post-Planning lock)

**SUPERSEDES the prior SQLite manifest design.** Two JSON files replace the workspace `.gobbi/gobbi.db`. See `../gobbi-memory/README.md` §"Memory storage — two-tier JSON model" for the full schema; this section captures the orchestration-side hooks.

**`project.json` writers** — invoked at the orchestration boundary:

- `gobbi gotcha promote` — appends to `gotchas[]`.
- Memorization step — appends to `sessions[]` (one row per workflow run with `handoffSummary` once handoff lands), and appends extracted `decisions[]` / `learnings[]` from the session record.

Sorted-rewrite (whole-file rewrite with deterministic sort) on every write so git diffs are reviewable. AJV schema v1; no migration framework (development state).

**`session.json` writer** — single-write, invoked at memorization-step entry:

- Aggregates from `state.db` events (`SELECT * FROM events WHERE session_id = ? ORDER BY seq`), per-step rawdata transcripts (`sessions/{id}/{step}/rawdata/`), and the orchestrator transcript pointer.
- Produces one consolidated file per session at `.gobbi/projects/{name}/sessions/{id}/session.json`.
- Array fields (`steps[]`, `agents[]`, `agent_calls[]`, `evaluations[]`) sort by `state.db.seq` ascending — deterministic across parallel evaluator spawns.

**`agent_calls[]` is provisional** — schema subject to revalidation when the `gobbi stats` query surface lands (deferred follow-up). Inline AJV-schema comment marks it as provisional.

**No `gobbi memory rebuild`** — JSON files are source of truth; nothing to rebuild. Drift detection via git status (project.json) and filesystem mtime (session.json).

**Read paths** — `gobbi memory list <class>` walks per-project `project.json`; cross-session aggregation walks per-session `session.json` files. Filesystem-walk performance is acceptable at solo-developer workspace scale.

**FTS5 not adopted.** Without bodies in any DB or JSON file, ripgrep over markdown is the search surface.

### 3.5 Event types — 24 total (current)

Current live count per `events/index.ts` header "9 categories, 24 event types" — expanded via `events/{workflow,delegation,decision,artifact,guard,verification,session,step-advancement,prompt}.ts`:

- **9 `workflow.*`** — `start`, `step.exit`, `step.skip`, `step.timeout`, `eval.decide`, `finish`, `abort`, `resume`, `invalid_transition`
- **3 `delegation.*`** — `spawn`, `complete`, `fail`
- **3 `decision.*`** — `user`, `eval.verdict`, `eval.skip`
- **2 `artifact.*`** — `write`, `overwrite`
- **3 `guard.*`** — `violation`, `override`, `warn` (`warn` added in schema v2 per `migrations.ts:16`)
- **1 `verification.*`** — `result`
- **1 `session.*`** — `heartbeat`
- **1 `step.*`** — `step.advancement.observed` (audit-only, bypasses reducer; added Pass 4 / Wave A.1)
- **1 `prompt.*`** — `prompt.patch.applied` (audit-only, writes to workspace `state.db`; added Wave C.1)

= **24 events total**.

**Audit-only events** (`step.advancement.observed`, `prompt.patch.applied`) bypass the reducer. The hook and `gobbi prompt patch` commands call `store.append()` directly. The reducer's `assertNever` at `reducer.ts:688` throws plain `Error` (not `ReducerRejectionError`), so a reducer-routed audit event would silently fail. Direct `store.append()` is the only path that persists these reliably. The reducer remains pure — it never sees audit-only events.

**Idempotency formula (step.advancement.observed):** `tool-call`, keyed on the PostToolUse payload's `tool_call_id`. Deduplicates across hook retries; preserves distinctness across distinct Bash invocations.

**Not new event categories — table-only:**
- `tool_calls`, `config_changes`, `memories` (CRUD on table; no `memory.*` events).

**Migration history:** schema v5 → v6 (Wave A.1) lifted new tables (`state_snapshots`, `tool_calls`, `config_changes`) and `step.advancement.observed`. Schema v6 → v7 (Wave C.1) added `prompt_patches` table and `prompt.patch.applied` event. `gobbi maintenance migrate-state-db` handles the migration; `gobbi maintenance restore-state-db` is the companion revert command.

---

## 4. The 9 `workflow.*` events

Verbatim from `packages/cli/src/workflow/events/workflow.ts:21-31`:

| Event | Purpose |
|---|---|
| `workflow.start` | Inaugural event; pairs with `metadata.json` write; fixes `currentStep = 'ideation'` |
| `workflow.step.exit` | Productive step finished; reducer evaluates `evalEnabled` predicate to choose `<step>_eval` vs next productive step |
| `workflow.step.skip` | User opted to skip a step (typically eval); routes to `ideation` per `index.json:200-247` |
| `workflow.step.timeout` | Step's `meta.timeoutMs` exceeded; routes to `error` |
| `workflow.eval.decide` | Per-step `evaluate.mode` resolution captured at workflow start |
| `workflow.finish` | Handoff complete (post-Wave-A.1); transitions to terminal `done`. Pre-Wave-A.1 this was emitted by memorization. |
| `workflow.abort` | User-initiated termination from `error`; transitions to `done` |
| `workflow.resume` | User invoked `gobbi workflow resume --target <step>`; sets `fromError` if from error |
| `workflow.invalid_transition` | Reducer rejected an event; audit-emit-on-rejection in fresh transaction |

Closed-enumeration discipline: every wire-level event (reducer-typed + audit-only) is in the 24-event set. Test scans every category constant and asserts `ALL_EVENT_TYPES.size === 24`.

---

## 5. JIT prompt footer pattern

**Static-prefix placement** for cache stability (per `../../v050-prompts.md` cache-aware ordering). The footer is data-driven from `spec.json::blocks.footer` — this becomes the first proving-ground prompt for the prompts-as-data pass (Wave C). Each spec carries its own complete footer text; the spec author writes the variant appropriate to that step. Productive steps carry the COMPLETE-only variant; the shared evaluation spec carries the verdict variant (PASS/REVISE/ESCALATE).

The footer text begins immediately after `blocks.completion`, so the agent reads both in sequence: the completion criteria come from `blocks.completion`, and the footer opens with "You have finished this step's work when the criteria above are satisfied" — a back-pointer that is unambiguous because `blocks.completion` is the immediately-preceding static section. No template engine is involved; the full footer text lives verbatim in each `spec.json::blocks.footer` field.

Token cost: ~180 tokens uncached; identical across same-step compilations so fully cached after the first compile. Maps 1:1 to `TRANSITION_KEYWORDS` (`transition.ts:74-84`); SKIP/TIMEOUT/FINISH/ABORT/RESUME stay operator-only and do not appear in agent footers. The `blocks.footer` field maps to the `'instructions'` budget slot in `budget.ts::inferSlot` (peer to `blocks.completion`) — the footer is load-bearing protocol and must not be evicted as low-priority materials under context pressure.

**Why prompts-as-data here.** `blocks.footer` is the first data-driven prompt block. Wave B.1 lifts the literal footer string into `_schema/v1.ts::StepBlocks` (TypeScript), `_schema/v1.json` (JSON Schema mirror — `schema.test.ts:399-404` asserts they stay in sync), and `assembly.ts::renderSpec`'s pipeline (rendered as a `StaticSection` immediately after `blocks.completion`). Without the simultaneous update across all three, `tsc --noEmit` fails or the drift test fails. Wave C extends this pattern to every prompt block.

**Why JIT.** A step that has not started yet contributes no tokens. The compiler reads workflow state, selects the step spec, loads the materials the step spec names, and delivers a bounded prompt. The orchestrator sees what this step needs — and only what this step needs. Workflow instructions for steps the orchestrator has not reached, and the working notes of steps already finished, stay out. PreToolUse `additionalContext` injection extends the same precision to the tool-call boundary: gotchas relevant to the specific decision point appear at the moment the decision is made, not in the ambient prompt.

---

## 6. Inner mode hooks

| Hook | Responsibility | File | Path-update required in Wave A.1? |
|---|---|---|---|
| **PreToolUse** | Admission control: block writes to `.claude/**` during sessions; check `subagent_type` against step's `meta.allowedAgentTypes`; secret-pattern warn. PreToolUse for `Bash` matching `gobbi workflow transition` is a *signal* (not a guard) — primes the safety net. | `commands/workflow/guard.ts` | **Yes** — `guard.ts:230-234` looks for `<sessionDir>/gobbi.db`; after rename + re-scope this becomes `.gobbi/state.db`. Without the update, the hook fail-opens silently (System F-5). |
| **PostToolUse** | `ExitPlanMode` → write `planning/plan.md` + `artifact.write` (existing). `Bash` matching `gobbi workflow transition` → call `store.append()` directly with `step.advancement.observed` (new — see §3.5 for the direct-append rationale). | `commands/workflow/capture-planning.ts` (extended) | Yes — same path issue |
| **SubagentStop** | Read transcript, write to `.gobbi/projects/<name>/sessions/<id>/<step>/`, emit `delegation.complete`/`fail` (existing). | `commands/workflow/capture-subagent.ts` | Yes — same path issue |
| **Stop** | Heartbeat + timeout + state flush (existing). **+ Missed-advancement safety net (new):** if no `step.advancement.observed` since the last `step.exit`/`start`/`resume` AND `turns_since_step_start ≥ 2`, inject `additionalContext` reminder; at `≥ 5` mark in `state_snapshots` and surface in `gobbi workflow status`. | `commands/workflow/stop.ts` | **Yes** — `stop.ts:181-183` looks for `<sessionDir>/gobbi.db`; same as `guard.ts` (System F-5). |
| **UserPromptSubmit** | New: route `/gobbi` invocations; emit `decision.user` for workflow-control intents ("revise the plan", "evaluate first") for audit trail. | `commands/workflow/user-prompt.ts` (new) | n/a (new file) |
| **SessionStart** | Idempotent init; **+ schema-drift detection (new):** if `metadata.json.schemaVersion < CURRENT_SCHEMA_VERSION`, run migration BEFORE appending any event. | `commands/workflow/init.ts` (extended) | **Yes** — `init.ts:281` opens the DB; needs the new path |
| **SessionEnd** (Claude Code 2.x) | Emit `session.end` event so abandoned-session detection is precise. Falls back to heartbeat-gap heuristic on older Claude Code. | `commands/workflow/session-end.ts` (new) | n/a |

**Path-resolution sweep (Wave A.1 task A.1.7).** Every place the codebase grep'd `join(sessionDir, 'gobbi.db')` returns must change to either the workspace path or the explicit constructor params. Confirmed callsites: `commands/workflow/{guard,stop,init,next,status,resume,capture-subagent,capture-planning,transition}.ts`, `commands/session.ts:320`, `commands/gotcha/promote.ts:308`. (`commands/workflow/events.ts` has no direct DB path — it delegates to `runSessionEvents` in `commands/session.ts`.) The sweep MUST grep both `join(sessionDir, 'gobbi.db')` and `<sessionDir>/gobbi.db` patterns across `packages/cli/src/` to catch any callsite this list misses. Architecture F-3's fix recommendation is a `resolveDbPath(sessionDir)` helper in `commands/session.ts` so the path construction is a single source of truth — Wave A.1 must implement this helper rather than apply 11 independent substitutions.

**Industry analogs:** PreToolUse = k8s ValidatingAdmissionWebhook; Stop = Temporal heartbeat + `WorkflowExecutionTimeout`; SubagentStop = Sidekiq `on(:complete)`. The 2-turn / 5-turn safety-net thresholds match Temporal's heartbeat-budget conventions.

**Concurrency caveat.** Workspace-scoped `state.db` widens the writer surface — multiple hooks can fire within one conversation turn. `PRAGMA synchronous = NORMAL` (current setting at `store.ts:362`) is preserved per-event for cost, but Wave A.1 adds `PRAGMA wal_checkpoint(TRUNCATE)` after each `workflow.step.exit` event (System F-2). This bounds the lost-event window under SIGKILL to "events written between two adjacent step.exit checkpoints." The per-step checkpoint is **additive** to the existing `store.ts::close()` checkpoint at lines 588-590 — it does not replace it. The p99 < 10 ms guard latency target (§13.7 success criterion) constrains per-hook work to in-process SQLite calls only — no network, no filesystem walk in the hot path.

---

## 7. Outer mode contract

Outer mode is a **CI runner pattern** (GitHub Actions, GitLab CI, Buildkite). The same workflow definition runs Inner or Outer because the workflow lives in `index.json` + spec files, not in any agent runtime.

**`gobbi workflow run --task "<text>"`** (NEW in Wave E.2 — does not exist today):

```
gobbi workflow run --task "<text>"
  ├─ resolveSessionDir() / new session
  ├─ loop until currentStep ∈ {'done','error'}:
  │   ├─ state    = resolveWorkflowState(...)
  │   ├─ prompt   = compile(spec[state.currentStep])
  │   ├─ spawn `claude -p '<prompt>' --session-id $SID` (or `codex --headless`)
  │   ├─ child writes events via `gobbi workflow transition` calls
  │   ├─ on child exit: re-resolve state
  │   └─ if currentStep unchanged → footer-miss → re-spawn with reminder
  └─ exit 0/nonzero
```

**Hook reliance — explicit-CLI fallback as primary, NOT contingency.** The locked decisions assume Claude Code hooks fire under `claude -p`. CI-runner precedent (GitHub Actions `actions/upload-artifact`) says hooks across spawn boundaries are unreliable. The redesign treats explicit CLI calls as the boundary signal — agents in headless mode invoke `gobbi workflow capture-subagent` themselves at the appropriate moment rather than relying on auto-firing hooks.

**Spike before E.2:** confirm `claude -p` actually fires PreToolUse and SubagentStop. Branch the implementation on the spike outcome:

- **Spike A (hooks fire):** proceed as designed; minimal CLI fallback wiring.
- **Spike B (hooks do not fire):** explicit-CLI fallback becomes the only path. The PreToolUse guard surface — `.claude/` write protection, agent-type allowlist — has no explicit-CLI equivalent today; Wave E.2 must explicitly state whether guards run in Outer mode and document the security implication for solo-user context.

**Cross-mode parity assertion:** Same `index.json`, same step specs, same hooks register, same `transition.ts` handler. Cross-mode parity test (Wave E.2 task E.2.2) snapshot-diffs compiled prompts across modes for the same `state.db` content (modulo per-mode footer line). Same input → byte-identical compiled prompt is the parity guarantee.

**Failure modes:**

- *Crash mid-step* → `state.db` unchanged; resume re-spawns from current step.
- *Footer-miss* → re-spawn with reminder block.
- *Partial event commit (single-writer per session in Inner mode)* → impossible (transactional `appendEventAndUpdateState` per `transition.ts:258-273`).
- *Concurrent-writer event loss under workspace-scoped `state.db`* — bounded by `wal_checkpoint(TRUNCATE)` after each `step.exit` per §6 above.
- *Headless agent loops* → Stop-hook timeout emits `workflow.step.timeout`; transitions to error.

---

## 8. Memorization step

The current `memorization/spec.json` (74 lines, 6 required artifact sections) is solid on *what* memorization writes. Pass 4 codifies the upstream and downstream contracts that today are implicit.

### 8.1 Rawdata sources (path pointers, not inlined content)

The memorization step's compiled prompt names these paths so the agent reads them as needed rather than pre-loading their contents into the prompt:

1. Step artifacts — `sessions/<id>/{ideation,planning,execution}/...md` and `_eval/evaluation.md` per step.
2. Subagent transcripts — every file `capture-subagent.ts` wrote under `sessions/<id>/<step>/rawdata/`.
3. `ExitPlanMode` captures — `sessions/<id>/planning/rawdata/`.
4. Orchestrator transcript — `transcript_path` from hook payloads, recorded in `metadata.json`.
5. Full event stream — `SELECT * FROM events WHERE session_id = ? ORDER BY seq` against workspace `state.db`.
6. Per-step `README.md` — when present (written by the STEP_EXIT writer per `gobbi-memory/scenarios.md G-MEM2-26`).
7. Session-tier gotchas — `.gobbi/projects/<name>/learnings/gotchas/` written mid-session.

### 8.2 Extraction destinations

| Source class | Destination (markdown) | `gobbi.db` row | Lifecycle |
|---|---|---|---|
| Decisions made | `learnings/decisions/<YYYY-MM-DD-slug>.md` | `class='decision'` | Permanent — promoted at memorization |
| User corrections | `learnings/gotchas/<slug>.md` | `class='gotcha'` | Permanent — `gobbi gotcha promote` for cross-project |
| Design changes | `design/<area>/*.md` + `decisions/` link | `class='design'` | Permanent |
| Deferred items | `learnings/backlogs/<YYYY-MM-DD-slug>.md` | `class='backlog'` | Permanent until acted on |

Memorization writes `memorization.md` and emits `workflow.step.exit`. The state machine advances to `handoff`.

### 8.3 Cleanup boundaries

`gobbi.db::memories` retains all `class='gotcha'`, `'decision'`, `'design'` rows permanently (long-term record). `class='handoff'` caps at the last N sessions per project (default N=5) — older handoff rows can be GC'd by `gobbi project gc` (deferred command). `state.db.tool_calls` and `state_snapshots` follow the existing 7-day TTL / 50-session cap (`v050-session.md:228`); `gobbi maintenance migrate-state-db` includes a post-migration cleanup pass.

---

## 9. Handoff step

The handoff step's job: read memorization output + the full session record and write a **tight hand-off artifact** for the next session. This is a *separate* step (not a sub-artifact) because:

- **Fresh-context separation matters here** as it does for evaluation. The agent that just memorized has the freshest context — but a clean handoff prompt without the memorization's working notes is a sharper instruction. This is why the user locked `handoff` as step 5/6.
- **Discoverability.** A future session's `gobbi workflow next` for the next workflow's Ideation step can pull `handoff.md` first, before any other prior-session artifacts.

### 9.1 Rawdata sources

1. `sessions/<id>/memorization/memorization.md` — the structured record from the prior step.
2. `sessions/<id>/memorization/rawdata/` if any (rare).
3. Last-N events from `state.db` for the session — for terminal-state inspection.

### 9.2 Handoff artifact (`sessions/<id>/handoff/handoff.md`)

```
# Hand-off — Session <id> — <YYYY-MM-DD>

## What was shipped
(One paragraph, max ~5 sentences. PR/commit references.)

## Open threads — read these first
(Bulleted list of unresolved items the next session needs to know about.)

## Decisions you should respect
(Bulleted list of locks made this session that the next session should not re-litigate.)

## Pointers
- memorization.md — full record
- <key files changed in this session>
- <key issues filed/closed>
- <worktree path if relevant>
```

### 9.3 Handoff memory row

Handoff also writes a `gobbi.db::memories` row with `class='handoff', session_id=<id>` so the next session's CLI can pull the most recent handoff as ambient context:

```sql
SELECT body_md FROM memories
WHERE class='handoff' AND project_id = ?
ORDER BY created_at DESC
LIMIT 1
```

Handoff emits `workflow.finish`. The state machine transitions to `done`.

### 9.4 Schema migration impact (Wave A.1.5)

Wave A.1 must add to `index.json`:
- New `steps` entry: `{ id: "handoff", spec: "./handoff/spec.json" }`
- New `terminal: ["handoff"]` replaces `terminal: ["memorization"]`
- New transition: `{ from: "memorization", to: "handoff", trigger: "workflow.step.exit" }`
- New transition: `{ from: "handoff", to: "done", trigger: "workflow.finish" }` (replaces the prior `memorization → done` rule)

New spec directory: `packages/cli/src/specs/handoff/{spec.json, README.md, __tests__/}`.

---

## 10. Roles × Specialties — framing only

Composition model: Roles (≤7 stable work modes) × Specialties (many domain bundles). Maps to GoF Strategy + Decorator and AWS IAM "Role + Policy". Constraint: role catalog ≤ 7, enforced by a CI lint rule. Deferred to dedicated `roles-and-specialties` future pass (Wave D.1).

Subagents in L3b compose from `(role, specialties[])` rather than being authored as monolithic agent files. The composed delegation prompt is generated by the assembler from the role file + selected specialty bundles. Today's `__pi`, `__executor`, and `*-evaluator` agents migrate to this shape in Wave D.1; specialty content moves out of agent files into `.gobbi/specialties/<name>.json`.

---

## 11. Prompts-as-data — cross-reference only

JSON-source-of-truth + JSON Patch (RFC 6902) evolution + render-to-markdown layer. The current `spec.json` files under `packages/cli/src/specs/` are an early version. The JIT footer pattern (§5) is the proving-ground prompt. Wave C owns this entirely, including the `prompt_patches` table previously slated for A.1 (now schema v7).

See `prompts-as-data.md` for the current sketch; the full JSON Schema, JSONL evolution log format, JSON Patch semantics, and `gobbi prompt {render,patch}` commands ship in Wave C.1.

---

## 12. Mandatory spikes

Three spikes must run during Wave A.1 before that wave commits:

1. **Bash PostToolUse fires for `gobbi workflow transition`?** If not, the synthetic `step.advancement.observed` needs a different source — either a `gobbi workflow advance-observed` wrapper command, or Stop-hook log scraping.
2. **`claude -p` headless mode registers hooks from `hooks/hooks.json`?** If not, Outer-mode parity weakens; explicit-CLI fallback becomes the only path. Spike outcome branches Wave E.2.3.
3. **Memorization compile latency** with the 0.3 artifacts budget reading 30+ rawdata transcripts. Outcome may force prompt-budget tuning before Wave A.1 closes.

Spike outcomes are documented in `learnings/decisions/<YYYY-MM-DD>-spike-<n>.md` files inside Wave A.1's session.

---

## 13. Success criteria

For the orchestration core:

1. **0 missed advancements unaddressed** across 20 representative Inner-mode runs.
2. **0 state losses** across `/compact` + one full Claude Code restart in 100 test cases.
3. **Inner ↔ Outer parity** — same workflow definition produces byte-identical compiled prompts (modulo per-mode footer) in 100% of snapshot tests.
4. **No prompt-cache regression** — `gobbi workflow status --cost` rollup post-redesign ≥ pre-redesign baseline.
5. **24-event closed enumeration** post-Pass-4 + Wave C.1 — test scans every category constant and asserts `ALL_EVENT_TYPES.size === 24`.
6. **State-derivation determinism** — 1,000 random event-log replays produce identical `state_snapshot` rows.
7. **Hook latency p99 < 10 ms** for PreToolUse — k8s admission-webhook budget. The 5 s `busy_timeout` is the failure mode boundary, not the operating point; `wal_checkpoint(TRUNCATE)` at step.exit prevents writer queue buildup.
8. **Handoff coverage** — for every session that reaches `done`, exactly one `class='handoff'` row exists in `gobbi.db::memories` AND `handoff.md` exists at `sessions/<id>/handoff/handoff.md`. Measured via integration test.
9. **`.gitignore` boundary** — `git check-ignore .gobbi/gobbi.db` returns nonzero (file is tracked) AND `git check-ignore .gobbi/state.db` returns 0 (file is ignored).

For the multi-session plan:

10. Each Wave A.1–E.2 session ships in one pass per `feedback_feature_pass_one_session`.
11. Wave A.2 closes within one batch — single sequential `gobbi-agent` per `docs-cleanup-parallelism.md`, covering the 9 docs (or split per the plan-evaluator F-3 finding).
12. Wave A.1 rename is reversible in one revert commit (`gobbi maintenance restore-state-db` companion).
13. Role catalog stays ≤ 7 through Wave D — CI lint rule enforces.
14. End-to-end "user starts session → first step prompt arrives in agent context" — no regression vs v0.4.x baseline (the original 30% target lacked a derivation; revised to no-regression per Overall F-5).
15. **3 mandatory spikes resolved in Wave A.1** — outcomes documented in `learnings/decisions/`.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [`scenarios.md`](scenarios.md) | Given/When/Then scenarios for transitions, eval verdicts, hooks, Outer mode, memorization, handoff |
| [`checklist.md`](checklist.md) | ISTQB-tagged verification items grouped by scenario ID |
| [`review.md`](review.md) | Pass-4 DRIFT / GAP / NOTE entries, evaluator-finding disposition, multi-session execution plan |
| [`../deterministic-orchestration.md`](../deterministic-orchestration.md) | Pre-Pass-4 orchestration doc — retired in Wave A.2 |
| [`../just-in-time-prompt-injection.md`](../just-in-time-prompt-injection.md) | Pre-Pass-4 JIT doc — folded into §5 above; retired in Wave A.2 |
| [`../../v050-overview.md`](../../v050-overview.md) | Workspace directory split + cross-feature contract — A.2 reconciles to 6-step model |
| [`../../v050-state-machine.md`](../../v050-state-machine.md) | State-machine spec library shape — A.2 adds `handoff` step |
| [`../../v050-prompts.md`](../../v050-prompts.md) | Cache-aware prompt ordering — A.2 captures `blocks.footer` |
| [`../../v050-hooks.md`](../../v050-hooks.md) | Hook surface and dispatch — A.2 captures advancement-observed + safety net |
| [`../../v050-cli.md`](../../v050-cli.md) | CLI command surface — A.2 captures `gobbi workflow run` (Wave E.2 future) and `gobbi maintenance migrate-state-db` (Wave A.1) |
| [`../../v050-session.md`](../../v050-session.md) | Session lifecycle and cleanup — A.2 captures workspace-level `state.db` |
| [`../gobbi-memory/README.md`](../gobbi-memory/README.md) | Multi-project memory model and STEP_EXIT README writer |
| [`../gobbi-config/README.md`](../gobbi-config/README.md) | Three-tier settings cascade — orchestration reads `workflow.{step}.{discuss,evaluate}.mode` from here |
| [`packages/cli/src/specs/index.json`](../../../../../../packages/cli/src/specs/index.json) | State machine graph — A.1.5 adds `handoff` step + transitions |
| [`packages/cli/src/workflow/store.ts`](../../../../../../packages/cli/src/workflow/store.ts) | EventStore — A.1.2 adds explicit partition-key constructor params |
| [`packages/cli/src/workflow/events/index.ts`](../../../../../../packages/cli/src/workflow/events/index.ts) | Event registry — A.1.3 adds `step.advancement.observed` |
| [`packages/cli/src/commands/workflow/transition.ts`](../../../../../../packages/cli/src/commands/workflow/transition.ts) | TRANSITION_KEYWORDS map and event emission — footer protocol target |
