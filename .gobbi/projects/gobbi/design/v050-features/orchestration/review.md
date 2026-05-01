# Review — Orchestration Pass 4

| Pass date  | Session ID                                 | Verdict | PR              |
|------------|--------------------------------------------|---------|-----------------|
| 2026-04-25 | `6e00d3d6-6833-4e8e-ae25-3f42165aebc3`     | docs-only design contract | (filed at materialization) |

Pass 4 is a **docs-only design pass**: Ideation + Plan + four design files (`README.md`, `scenarios.md`, `checklist.md`, this `review.md`). No code changes ship in Pass 4. The four files become the design contract that Waves A.1 → E.2 execute. This review documents:

- DRIFT — gaps between this design and the existing codebase or older docs
- GAP — gaps in the existing codebase that this design closes
- NOTE — design rationales, evaluator findings, deferred items
- Multi-session execution plan (Waves A–F)
- Open items remaining after Pass 4 ships

DRIFT/GAP entries with `Resolution: deferred to Wave X` will gain a commit SHA when that wave merges. Pass 4's own SHA (the materialization PR) covers only the design-doc creation.

---

## DRIFT entries

### DRIFT-1 — `gobbi.db` is per-session today; target is workspace-scoped `state.db` + `gobbi.db`

**Finding:** Today the codebase opens `gobbi.db` at `.gobbi/projects/<name>/sessions/<id>/gobbi.db` per session (`init.ts:281`, `store.ts:280`, `transition.ts:228`). The Pass 4 design declares two workspace-scoped DBs at `.gobbi/state.db` (events) and `.gobbi/gobbi.db` (memories). The README §3.1 callout makes the current-vs-target split explicit.

**Severity:** High — every callsite that opens `gobbi.db` per-session must change atomically with the rename, or hooks fail-open silently (System F-5).

**Resolution:** deferred to Wave A.1. A.1.2 adds explicit partition-key constructor params to `EventStore`; A.1.7 sweeps the 11 callsites; `gobbi maintenance migrate-state-db` reverses the on-disk migration.

**Owner:** Pass 4 design; Wave A.1 implementation.

---

### DRIFT-2 — 5-step model in `.claude/CLAUDE.md` and `v050-overview.md` vs locked 6-step model with `handoff` as step 5/6

**Finding:** `.claude/CLAUDE.md` and `v050-overview.md` describe the 5-step cycle (Ideation → Planning → Execution → Evaluation → Memorization). The Pass 4 design locks the 6-step cycle with `handoff` promoted to a true state-machine step (Ideation Loop → Planning Loop → Execution Loop → Memorization → Handoff → Done, with Configuration as pre-loop step 0 and Evaluation as a sub-phase inside each Loop). The user explicitly locked `handoff` as a state-machine step (Option B) per `locked-decisions.md`.

**Severity:** High — until A.2 reconciles, every session will start with conflicting guidance from CLAUDE.md vs the new design.

**Resolution:** deferred to Wave A.2. A.2 updates CLAUDE.md, `v050-overview.md`, `v050-state-machine.md`, `v050-prompts.md`, `v050-hooks.md`, `v050-cli.md`, `v050-session.md`, plus the two pre-Pass-4 orchestration docs (`deterministic-orchestration.md`, `just-in-time-prompt-injection.md`) — 9 docs total in a single sequential `gobbi-agent` per `docs-cleanup-parallelism.md` (or split per Project F-3 finding; see NOTE-3 below).

**Owner:** Pass 4 design; Wave A.2 reconciliation.

---

### DRIFT-3 — `(name TBD)` for the status-read command in `just-in-time-prompt-injection.md`

**Finding:** `just-in-time-prompt-injection.md:11` references a "CLI command (name TBD — CLI is being redesigned)" for the status-read command. The command exists today as `gobbi workflow status` (`commands/workflow/status.ts::StatusSnapshot`).

**Severity:** Low — documentation-only, but every session that reads the doc must guess what command to run.

**Resolution:** deferred to Wave A.2 (the doc is rewritten or stub-redirected to `orchestration/README.md`). Pass 4's README §1 / §10 cites `gobbi workflow status` directly.

**Owner:** Pass 4 design; Wave A.2 reconciliation.

---

### DRIFT-4 — Singular `project/{project_name}/sessions/{session_id}/` in old prose vs plural `projects/<name>/sessions/<id>/` in code

**Finding:** `deterministic-orchestration.md:17` references `project/{project_name}/sessions/{session_id}/` (singular `project/`). The codebase shipped plural `.gobbi/projects/<name>/` in Pass 2 (gobbi-memory, PR #119). Today's prose in the orchestration doc still carries the singular form.

**Severity:** Medium — anyone reading the doc and writing path code from it produces wrong paths.

**Resolution:** deferred to Wave A.2. Pass 4's README uses plural `projects/<name>/sessions/<id>/` exclusively.

**Owner:** Pass 4 design; Wave A.2 reconciliation.

---

### DRIFT-5 — Event count: 21 in PI stances, 22 today, 23 post-Pass-4

**Finding:** The innovative-stance ideation cited 22 events; the best-stance cited 21. The synthesis silently adopted 21. Project F-1 / Overall F-1 / Architecture F-3 all flagged the discrepancy. The codebase today has 22 events (`events/index.ts:1` documents "7 categories, 22 event types"; `guard.ts:13-17` defines `violation`, `override`, `warn` — three guard events, with `warn` added in schema v2 per `migrations.ts:16`). Pass 4 adds one event (`step.advancement.observed`), so the post-Pass-4 total is 23.

**Severity:** High — the closed-enumeration success criterion in §13.5 is concrete: `ALL_EVENT_TYPES.size === 23`. Wrong baseline = wrong test.

**Resolution:** corrected in this Pass 4 design. README §3.5 cites 22 today + 1 new = 23 post-Pass-4. Wave A.1.3 implements the 23rd event and updates the closed-enumeration test.

**Owner:** Pass 4 design.

---

### DRIFT-6 — `gobbi workflow run` is presented as an existing command but does not exist in the codebase

**Finding:** Project F-2 flagged that `gobbi workflow run` was framed as part of the current architecture in the synthesis. The workflow subcommand registry (`commands/workflow.ts`) lists `validate`, `init`, `next`, `guard`/`capture-*`/`stop`, `status`, `resume`, `transition` — no `run`.

**Severity:** High — Wave E.2 scope ambiguity if `run` is treated as already-existing.

**Resolution:** corrected in this Pass 4 design. README §2 L1 row labels `commands/workflow/run.ts` as **NEW in Wave E.2**; README §7 Outer-mode section opens with the explicit "does not exist today" framing.

**Owner:** Pass 4 design.

---

### DRIFT-7 — `gobbi maintenance migrate-state-db` is named in the design but the maintenance dispatcher needs the registry update

**Finding:** Architecture P-A-1 flagged that `commands/maintenance.ts:48-59` uses `MAINTENANCE_COMMANDS[]` registry-dispatch. Adding a new file under `commands/maintenance/` alone does not register the subcommand — without a registry entry, `gobbi maintenance migrate-state-db` returns "unknown subcommand."

**Severity:** Critical (in implementation) — silent unreachability.

**Resolution:** deferred to Wave A.1.4. Plan task A.1.4 explicitly lists `commands/maintenance.ts` (registry update) alongside the new handler file. README §3.5 names this. The same applies to `restore-state-db`.

**Owner:** Pass 4 design; Wave A.1.4 implementation.

---

### DRIFT-8 — `blocks.footer` field not in `StepBlocks` type or `_schema/v1.json`

**Finding:** Architecture F-5 / P-A-2: `StepBlocks` at `types.ts:327-354` has five fields with no `footer`; `StepBlocksSchema` at `_schema/v1.ts:205-225` declares `additionalProperties: false`; `_schema/v1.json` mirrors. Adding `footer` to `assembly.ts::renderSpec` without updating all three breaks `tsc --noEmit` or fails the `schema.test.ts:399-404` drift test.

**Severity:** Critical (in implementation).

**Resolution:** deferred to Wave B.1.1. README §5 names the three-file simultaneous update. Plan task B.1.1 lists all three files.

**Owner:** Pass 4 design; Wave B.1.1 implementation.

---

### DRIFT-9 — `prompt_patches` table previously in Wave A.1 is moved to Wave C

**Finding:** Initial ideation v1 placed `prompt_patches` in the Wave A.1 schema v6 migration. Overall F-2 flagged the double-migration risk: A.1 creates a table with no writer for 2-3 sessions, and Wave C may need to alter the schema, requiring v7 on top of v6.

**Severity:** High (planning).

**Resolution:** corrected in ideation v2 §10 + plan Wave C.1. Wave A.1 schema v6 does NOT include `prompt_patches`; Wave C.1 (schema v7) owns it.

**Owner:** Pass 4 design.

---

### DRIFT-10 — `_skills` skill loaded for project-doc authoring (Project Plan F-1, F-6)

**Finding:** Plan Task 1.1 originally listed `_skills` for the `gobbi-agent` authoring this directory. `_skills` SKILL.md scopes to `.claude/skills/` files. The output is a project doc under `.gobbi/projects/gobbi/design/v050-features/orchestration/`. Wave C.1's design-doc skills list also incorrectly included `_skills`.

**Severity:** Medium (planning) — wrong skill loaded leads to wrong authoring standard.

**Resolution:** deferred to plan revision (or absorbed into the orchestrator briefing for Pass 4). Pass 4's actual briefing for this `gobbi-agent` invocation correctly loads `_claude` + `_project` + `_gotcha` only.

**Owner:** Pass 4 plan.

---

### DRIFT-11 — `__pi` named for evaluation but `__pi` excludes evaluation per its definition (Project Plan F-2)

**Finding:** Plan Task 1.2 named `__pi` for plan evaluation. The `__pi.md` agent definition lists evaluation as out-of-scope. The orchestrator's actual invocation uses `__pi` in its Step-7 Review stance, which is correct — but the plan text named the wrong stance and could mislead a future operator.

**Severity:** Medium (planning).

**Resolution:** deferred to Wave-by-Wave plan revision. Future Wave plans must specify "spawn `__pi` with `Review` stance" rather than "spawn `__pi`."

**Owner:** Pass 4 plan.

---

### DRIFT-12 — Worktree naming in plan Task 1.4 conflicts with `_git/conventions.md` (Project Plan F-4)

**Finding:** Plan Task 1.4 originally specified `.claude/worktrees/<adjective-animal-NNNN>` and branch `claude/orch-pass-4-design-NNNN`. `_git/conventions.md` requires the directory to preserve the branch name exactly, with typed prefixes (`feat/`, `fix/`, `docs/`, `chore/`). The actual worktree opened for Pass 4 is `.claude/worktrees/pass4-orchestration-design/` with branch `claude/pass4-orchestration-design` — neither matches the convention.

**Severity:** Medium (planning) — process inconsistency.

**Resolution:** deferred to Wave A.1's planning step or a follow-up plan revision. Future Wave worktrees must use `feat/<issue>-<slug>` or `docs/<issue>-<slug>` per the existing examples (`fix/131-capture-subagent-env`, `docs-cleanup/135-136`).

**Owner:** Pass 4 plan.

---

## GAP entries

### GAP-1 — Missed-advancement safety net not implemented

**Finding:** Today there is no Stop-hook safety net for missed `gobbi workflow transition`. The agent that just finished a step is biased toward "we are done" prose, but no structural mechanism catches the missing transition. README §1 lists this as failure mode #6.

**Resolution:** deferred to Wave E.1. E.1.1–E.1.5 implement `step.advancement.observed` end-to-end, the missed-advancement predicate in Stop hook, the 2-turn / 5-turn thresholds, and the integration tests. Architecture F-1's direct-`store.append()` design is locked.

**Owner:** Pass 4 design; Wave E.1 implementation.

---

### GAP-2 — No Outer-mode driver

**Finding:** Today gobbi assumes interactive Claude Code only. There is no headless `gobbi workflow run` driver that can spawn `claude -p` or `codex --headless` per step, observe child exit, re-resolve state, and re-spawn on footer-miss. README §1 lists this as failure mode #4.

**Resolution:** deferred to Wave E.2. E.2.1–E.2.4 build the driver; spike outcome from A.1.1 (`claude -p` hook firing) determines whether explicit-CLI fallback is the only path or hooks fire reliably.

**Owner:** Pass 4 design; Wave E.2 implementation.

---

### GAP-3 — Prompts not data-driven

**Finding:** Today `spec.json` files are hand-authored markdown-as-source. There is no JSON-source-of-truth + JSON Patch evolution layer. README §1 failure mode #5 names this; §11 cross-references the deferred pass.

**Resolution:** deferred to Wave C.1. JSON Schema v1 lockdown, `prompt_patches` table at schema v7, JSONL evolution log, `gobbi prompt {render,patch}` commands, broader prompt migration.

**Owner:** Pass 4 design; Wave C.1 implementation.

---

### GAP-4 — Subagents not roles × specialties

**Finding:** Today subagents are authored as monolithic agent files under `.claude/agents/`. The composition model — Roles (≤7) × Specialties (many domain bundles) — is not implemented; the role catalog is implicit in the agent files; no CI lint enforces ≤7.

**Resolution:** deferred to Wave D.1. Lock the ≤7 role catalog, define the Specialty JSON schema, build the assembler, migrate `__pi`/`__executor`/`*-evaluator` agents, add the CI lint rule.

**Owner:** Pass 4 design; Wave D.1 implementation.

---

### GAP-5 — `state_snapshots` table has no read/write API on `EventStore` (Architecture soundness assessment)

**Finding:** README §3.3 introduces `state_snapshots` for replay-storm prevention and missed-advancement escalation. Without a named `EventStore` API, Stop-hook and `gobbi workflow status` implementers will embed raw SQL in their files, eroding the abstraction `EventStore` provides.

**Resolution:** deferred to Wave A.1.3 / A.1.9. The migration adds the table; the wave evaluator must require a named API method (e.g., `EventStore.appendSnapshot()` and `EventStore.readSnapshots(sessionId)`) before approving.

**Owner:** Pass 4 design; Wave A.1 implementation.

---

### GAP-6 — `gobbi.db` regeneration path is unspecified (Architecture risk)

**Finding:** README §3.4 states `gobbi.db` is "regenerable from the markdown tree" but provides no `gobbi db rebuild` command or migration recipe. If the SQLite projection diverges from markdown during a partial write or failed `gobbi project delete`, operators have no documented recovery path.

**Resolution:** deferred — likely a Wave F task or a one-off ops command. Pass 4 names the gap; no implementation budgeted yet.

**Owner:** Pass 4 design (gap identified, owner unassigned).

---

### GAP-7 — Cleanup TTL not extended to new SQLite tables (System F-4)

**Finding:** `v050-session.md:228` defines a 7-day TTL / 50-session cap for session directories. The new tables (`state_snapshots`, `tool_calls`, `config_changes`) plus the `gobbi.db::memories` table have no specified cleanup. Long sessions accumulate rows indefinitely; FTS5 segments don't auto-vacuum.

**Resolution:** deferred to Wave A.1.10 (integration test scope) and a future `gobbi project gc` command. README §8.3 cites the cleanup boundaries: `class='gotcha|decision|design'` permanent; `class='handoff'` capped at last N=5 per project; `tool_calls` and `state_snapshots` follow the existing 7-day TTL.

**Owner:** Pass 4 design; Wave A.1 implementation budget; future `gobbi project gc` command.

---

### GAP-8 — Outer-mode guard bypass (System F-6)

**Finding:** PreToolUse `.claude/` write protection has no explicit-CLI fallback. If `claude -p` does not fire PreToolUse hooks, headless agents can write to `.claude/` without restriction.

**Resolution:** deferred to Wave E.2. E.2 must explicitly state whether guards run in Outer mode and document the security implication for solo-user context (per `feedback_solo_user_context` the impact is bounded but the gap is real).

**Owner:** Pass 4 design; Wave E.2 implementation.

---

### GAP-9 — Per-session state-projection atomicity (obsolete by retirement)

**Finding (historical, pre-PR-FIN-2a-ii):** If a snapshot was written and the corresponding state-projection write failed (SIGKILL between the two), the snapshot might represent a state that the projection did not reflect. The `appendEventAndUpdateState` pattern in `engine.ts` was proposed to be extended to cover snapshot writes in the same transaction.

**Resolution:** Resolved by PR-FIN-2a-ii — the per-session state-projection file was retired; the snapshot-vs-projection atomicity gap GAP-9 tracked no longer applies because there is no separate state file to write atomically alongside snapshots. SQLite-WAL handles atomicity for `gobbi.db` event appends.

**Owner:** Pass 4 design (gap identified); resolved by PR-FIN-2a-ii (artifact retirement).

---

### GAP-10 — `resolveSessionDir` heuristic breaks after DB rename (System F-5)

**Finding:** Today `resolveSessionDir` (used by `guard.ts:224`, `stop.ts:176`) finds the session directory by looking for a `gobbi.db` in the resolved path. After Wave A.1 renames `gobbi.db` to `state.db` and moves it to workspace scope, the heuristic fails — every hook silently fail-opens (`guard.ts:230-234`: `emitAllow()` when `dbPath` does not exist).

**Resolution:** deferred to Wave A.1.7. The path-resolution sweep updates `resolveSessionDir` plus all 11 callsites. The hooks-contract test (`packages/cli/src/__tests__/hooks-contract.test.ts`) gets extended for the new path pattern.

**Owner:** Pass 4 design; Wave A.1.7 implementation.

---

### GAP-11 — `documentation` and `tests` evaluator perspectives are not named agents (Project Plan F-5)

**Finding:** Wave plans cite "Documentation" and "Tests" evaluator perspectives. No `_documentation-evaluator.md` or `_tests-evaluator.md` exists in `.claude/agents/`. Future Wave operators must guess which agent to spawn.

**Resolution:** deferred to each Wave's planning step. Default mapping: "Documentation" → `_project-evaluator` (or `gobbi-agent` with a docs-review prompt); "Tests" → `__pi` in Best stance reviewing test coverage.

**Owner:** Pass 4 plan; per-Wave planning steps.

---

### GAP-12 — `.gobbi/roles/` will be gitignored (Architecture P-A-5)

**Finding:** Wave D.1's `catalog.json` lives at `.gobbi/roles/catalog.json`. `.gitignore:12` matches `.gobbi/*`; the only existing exception is `!.gobbi/projects/`. The CI lint rule D.1.4 will never see a tracked catalog file.

**Resolution:** deferred to Wave D.1. D.1 must add `!.gobbi/roles/` to `.gitignore` alongside the catalog file (mirror of the Wave A.1.8 `!.gobbi/gobbi.db` pattern).

**Owner:** Pass 4 design (cross-feature gap); Wave D.1 implementation.

---

## NOTE entries

### NOTE-1 — Hand-off locked as state-machine step (Option B) per user direction (Overall F-3)

The synthesis v1 folded handoff into memorization as a sub-artifact. Three evaluators flagged this — Project F-? and Overall F-3 — and the locked-decisions doc had `handoff` as step 6. The user explicitly chose Option B post-evaluation. v2 promotes handoff to a true state-machine step. Wave A.1 grows by one schema migration (the new `handoff` step + transitions in `index.json`). README §1 + §9 document the choice.

---

### NOTE-2 — `step.advancement.observed` commits via direct `store.append()`, NOT through the reducer (Architecture F-1)

The reducer's `assertNever` at `reducer.ts:688` throws plain `Error` (not `ReducerRejectionError`); the audit-on-rejection branch at `engine.ts:232` only fires for `ReducerRejectionError`; `capture-planning.ts:177`'s catch swallows the throw. A reducer-routed advancement event would silently fail. Direct `store.append()` is the only path that persists the event reliably. The reducer remains pure — it never sees this audit-only event. README §3.5 + §6 + scenario SC-ORCH-13 lock this.

---

### NOTE-3 — A.2 batch size: 9 docs in one pass vs the rule's 3-5 file limit (Project Plan F-3)

`docs-cleanup-parallelism.md` rule scopes to "3 to 5 related markdown files, under ~200 lines of cumulative diff." A.2 has 9 docs. The rule's "When NOT to apply" includes "Large rewrites where a single agent would exceed comfortable context budget."

The plan's Wave A.2 still has a single sequential `gobbi-agent` for the batch on the rationale that vocabulary consistency outweighs context-budget cost. Project F-3 recommended either a 2-3 sequential split (model-level docs first; technical-detail docs second; redirect/rewrite docs third) or an explicit override note. The decision is open at Pass 4 close — Wave A.2's planning step decides the split or override.

---

### NOTE-4 — E.1 (safety net) sequenced parallel with C.1 per Overall F-4

The original wave ordering placed E.1 fifth, despite E.1's prerequisites being only A.1 + B.1. Overall F-4 flagged that the missed-advancement safety net is failure mode #6 from the problem framing — the primary advancement-reliability gap — and leaving it at wave 5 of 6 means the system runs without its primary safeguard for 3-4 sessions.

Plan execution-order chart resolves this: E.1 forks from B.1 in parallel with C.1; E.2 follows E.1 in parallel with D.1. Critical path becomes A.1 → A.2 → B.1 → C.1 → D.1, with E.1/E.2 parallel-eligible. README §13 success criteria item #1 (0 missed advancements) targets E.1's deliverable.

---

### NOTE-5 — Memorization compile latency may force prompt budget changes (Spike #3)

Architecture's risk note (and ideation §12 spike #3): memorization reads 30+ rawdata transcripts at 0.3 artifacts budget. Compile latency may exceed acceptable bounds. The spike runs in Wave A.1.1; outcome may force prompt-budget tuning before Wave A.1 closes.

---

### NOTE-6 — `.gobbi/gobbi.db` git-tracked memory store is solo-user-only (System F-1 + System security)

Per `feedback_solo_user_context` gobbi has one user. `.gobbi/gobbi.db` git-tracking carries the (low) risk of inadvertently committing sensitive content (gotchas referencing internal tool names, backlog items referencing confidential context). For solo-user this is acceptable. If a public-facing gobbi clone ever exists, the `.gitignore` flips back to gitignore-by-default and `gobbi.db` is regenerated from markdown.

---

### NOTE-7 — `codex --headless` is a placeholder, not a confirmed dependency

Synthesis §6 cites `codex --headless` as an alternative to `claude -p` for Outer mode. The flag does not appear anywhere in the codebase or design docs. Project F-? open question. Pass 4's README §7 keeps the placeholder; Wave E.2's planning step must spike `codex --headless` if it's a real dependency, otherwise drop it.

---

### NOTE-8 — Three mandatory spikes (README §12)

Wave A.1 must run three spikes before that wave commits:

1. **Bash PostToolUse fires for `gobbi workflow transition`?** — branches `step.advancement.observed` source.
2. **`claude -p` headless mode registers hooks from `hooks/hooks.json`?** — branches Outer-mode hook reliance.
3. **Memorization compile latency** with 0.3 artifacts budget — branches prompt-budget tuning.

Outcomes documented in `learnings/decisions/<YYYY-MM-DD>-spike-<n>.md` files.

---

### NOTE-9 — `feedback_solo_user_context` removes external-user concerns

Gobbi has one user. Decisions in this design ignore: backcompat for external users, migration paths for non-solo deployments, "muscle memory" arguments, release-note effects. When two approaches are equivalent on engineering merit, the simpler one wins. This applies particularly to the `.gitignore` boundary (NOTE-6) and the `migrate-state-db` revertibility (one revert commit, not multi-version compat).

---

### NOTE-10 — Plan evaluator findings disposition

| Finding | Severity | Disposition |
|---|---|---|
| Project Plan F-1 (`_skills` for project doc) | High | DRIFT-10 — corrected in Pass 4 briefing |
| Project Plan F-2 (`__pi` for evaluation) | High | DRIFT-11 — Wave plans need stance clarification |
| Project Plan F-3 (9-doc batch exceeds rule) | Medium | NOTE-3 — A.2 planning decides split vs override |
| Project Plan F-4 (worktree naming) | Medium | DRIFT-12 — Wave plans use `_git/conventions.md` |
| Project Plan F-5 (Documentation/Tests evaluator perspectives) | Low | GAP-11 — per-Wave planning maps to existing agents |
| Project Plan F-6 (Wave C.1 `_skills`) | Low | DRIFT-10 — per-Wave plan revision |
| Overall Plan F-1 (Wave B.1 scope contradiction) | Medium | NOTE — README + plan Wave B.1 pre-condition annotation reconciles |
| Overall Plan F-2 (Wave list order vs diagram) | Medium | NOTE-4 — execution-order chart is authoritative |
| Overall Plan F-3 (F.1/F.2 lacking detail) | Low | F-Waves are planning stubs by design |
| Overall Plan F-4 (Task 1.2 evaluator scope) | Low | per-Wave plan revision |
| Architecture Plan P-A-1 (`migrate-state-db` registry) | Critical | DRIFT-7 — Wave A.1.4 covers |
| Architecture Plan P-A-2 (`blocks.footer` schema mirror) | Critical | DRIFT-8 — Wave B.1.1 covers |
| Architecture Plan P-A-3 (path-sweep file list) | High | DRIFT-1 / GAP-10 — Wave A.1.7 covers |
| Architecture Plan P-A-4 (`CURRENT_SCHEMA_VERSION` bump) | High | Wave A.1.3 task description includes the bump |
| Architecture Plan P-A-5 (`.gobbi/roles/` gitignored) | Medium | GAP-12 — Wave D.1 covers |
| Architecture Plan P-A-6 (WAL checkpoint coexists with close) | Low | README §6 + scenario SC-ORCH-25 note the additivity |

---

### NOTE-11 — Ideation evaluator findings disposition

| Finding | Severity | Disposition |
|---|---|---|
| Project F-1 (event count off) | Medium | DRIFT-5 — corrected to 22 today + 1 = 23 |
| Project F-2 (`gobbi workflow run` framing) | High | DRIFT-6 — corrected to "NEW in Wave E.2" |
| Project F-3 (current vs target DB state) | High | DRIFT-1 — README §3.1 callout added |
| Project F-4 (`deterministic-orchestration.md` stays stale until B.1) | Medium | DRIFT-2 — plan A.2 expanded to include the two orchestration-specific docs |
| Project F-5 (`gobbi maintenance migrate-state-db` infrastructure) | Low | DRIFT-7 — Wave A.1.4 covers |
| Overall F-1 (event count 21 vs 22) | High | DRIFT-5 — corrected |
| Overall F-2 (`prompt_patches` double-migration) | High | DRIFT-9 — moved to Wave C |
| Overall F-3 (handoff resolved-and-open) | High | NOTE-1 — locked as Option B per user |
| Overall F-4 (E.1 sequenced too late) | Medium | NOTE-4 — E.1 parallel with C.1 |
| Overall F-5 (30% latency baseline missing) | Medium | README §13.14 revised to "no regression" |
| Overall F-6 (SessionEnd version-gated) | Low | README §6 hook table notes Claude Code 2.x; risk added implicitly |
| Architecture F-1 (`step.advancement.observed` silent fail) | Critical | NOTE-2 — direct `store.append()` locked |
| Architecture F-2 (EventStore partition keys) | Critical | DRIFT-1 / Wave A.1.2 — explicit constructor params |
| Architecture F-3 (event count 22 today) | High | DRIFT-5 — corrected |
| Architecture F-4 (path-sweep file list) | High | DRIFT-1 / Wave A.1.7 |
| Architecture F-5 (`blocks.footer` not in StepBlocks) | Medium | DRIFT-8 — Wave B.1.1 |
| Architecture F-6 (workspace-scoped indices) | Medium | README §3.3 v6 indices added |
| Architecture F-7 (idempotency formula) | Low | README §3.5 "tool-call" formula locked |
| System F-1 (gitignore gap) | High | DRIFT-1 / Wave A.1.8 — `!.gobbi/gobbi.db` exception |
| System F-2 (concurrent-writer durability) | High | README §6 + scenario SC-ORCH-25 — `wal_checkpoint(TRUNCATE)` after step.exit |
| System F-3 (PostToolUse spike fallback) | Medium | NOTE-8 spike #1 + README §3.5 fallback options |
| System F-4 (cleanup TTL gap) | Medium | GAP-7 |
| System F-5 (resolveSessionDir breaks) | Medium | GAP-10 / Wave A.1.7 |
| System F-6 (Outer-mode guard bypass) | Low | GAP-8 / Wave E.2 |

---

### NOTE-12 — Pre-merge dependency: PR #137 must merge first

Pass 4's PR opens after PR #137 (the in-flight integration PR for `phase/v050-phase-2`) lands. If PR #137 is not yet merged, Pass 4's PR opens stacked on top with a note that it depends on #137. Plan Task 1.4 captures this.

---

## Multi-session execution plan

**Verbatim copy of `plan.md` Part 2 — Multi-Session Execution Plan (Waves A–F).**

### Wave A.1 — DB rename + workspace re-scope + handoff state-machine step + state.db schema v6 (1 session)

**Pre-condition**: Pass 4 PR merged; PR #137 merged.

**Tasks**:

| # | Description | Agent | Skills | Files (high-confidence list — verify in worktree) |
|---|---|---|---|---|
| A.1.1 | Run the 3 mandatory spikes (Bash PostToolUse for transition; `claude -p` hook firing; memorization compile latency); document outcomes in `learnings/decisions/`. Defer or branch the design if any spike fails. | `__pi` (research stance) | `_research`, `_bun`, `_gotcha` | `learnings/decisions/<YYYY-MM-DD>-spike-*.md` (3 files) |
| A.1.2 | Add explicit partition-key parameters to `EventStore` constructor; add fallback path-derivation behavior. | `__executor` | `_typescript`, `_bun`, `_execution` | `packages/cli/src/workflow/store.ts`, store tests |
| A.1.3 | Add schema v6 migration: new tables (`state_snapshots`, `tool_calls`, `config_changes`, `schema_meta`); workspace-level partitioning queries everywhere; new event type `step.advancement.observed`. **Bump `CURRENT_SCHEMA_VERSION` 5 → 6; add `5: (data) => data` identity migration to the registry walk loop.** | `__executor` | `_typescript`, `_bun`, `_execution` | `packages/cli/src/workflow/migrations.ts`, `packages/cli/src/workflow/events/index.ts`, new event factory file |
| A.1.4 | Implement `gobbi maintenance migrate-state-db` command **and register it in the `MAINTENANCE_COMMANDS` dispatch array** (`commands/maintenance.ts:48-59`). Without the registry update, the new command is unreachable. | `__executor` | `_typescript`, `_bun`, `_execution`, `_gobbi-cli` | `packages/cli/src/commands/maintenance/migrate-state-db.ts` (new), `packages/cli/src/commands/maintenance.ts` (registry update) |
| A.1.5 | Add `handoff` state-machine step: new `specs/handoff/{spec.json, README.md}`; update `index.json` (`steps`, `transitions`, `terminal`). | `__executor` | `_typescript`, `_execution` | `packages/cli/src/specs/handoff/spec.json` (new), `packages/cli/src/specs/handoff/README.md` (new), `packages/cli/src/specs/index.json` |
| A.1.6 | Update memorization spec rawdata sources + extraction destinations per ideation §7.3. | `__executor` | `_typescript`, `_execution` | `packages/cli/src/specs/memorization/spec.json`, `packages/cli/src/specs/memorization/README.md` |
| A.1.7 | Path-resolution sweep: update every callsite that opens `gobbi.db` per-session to use new workspace path or explicit constructor params. **Confirmed callsite list:** `commands/workflow/{guard,stop,init,next,status,resume,capture-subagent,capture-planning,transition}.ts`, `commands/session.ts:320`, `commands/gotcha/promote.ts:308`. (`commands/workflow/events.ts` has no direct DB path — delegates to `session.ts`.) The sweep MUST grep `join(sessionDir, 'gobbi.db')` and `<sessionDir>/gobbi.db` patterns across `packages/cli/src/` to catch any callsite this list misses. | `__executor` | `_typescript`, `_bun`, `_execution` | `packages/cli/src/commands/workflow/{guard,stop,init,next,status,resume,capture-subagent,capture-planning,transition}.ts`, `packages/cli/src/commands/session.ts`, `packages/cli/src/commands/gotcha/promote.ts` |
| A.1.8 | Add `.gitignore` exception `!.gobbi/gobbi.db` immediately after `.gobbi/*`; verify via `git check-ignore` test in CI. | `__executor` | `_execution`, `_git` | `.gitignore`, integration test |
| A.1.9 | Concurrent-writer mitigation: `PRAGMA wal_checkpoint(TRUNCATE)` after every `workflow.step.exit`. **Additive to existing `store.ts::close()` checkpoint at lines 588-590; do not replace.** | `__executor` | `_typescript`, `_bun`, `_execution` | `packages/cli/src/workflow/store.ts`, store tests |
| A.1.10 | Integration tests: replay-equivalence after migration; atomic-rename safety; concurrent-writer durability under SIGKILL fixture. | `__executor` | `_typescript`, `_bun`, `_execution` | `packages/cli/src/workflow/__tests__/migrate-state-db.test.ts` (new), `store.test.ts` extensions |

**Execution order**:
- A.1.1 first (sequential — outcomes branch the rest of the wave).
- A.1.2 / A.1.3 / A.1.4 in parallel (different files).
- A.1.5 / A.1.6 in parallel after A.1.3 lands (depend on event-set).
- A.1.7 sequential after A.1.2 (consumes the new constructor).
- A.1.8 / A.1.9 in parallel after A.1.3.
- A.1.10 last — covers all of the above.

**Per-task verification approach**: each task's evaluator must check `bun test` passes for the relevant test file; `gobbi validate` passes on spec library; `git status` after task shows only the named files modified.

**Wave evaluation**: 4 perspectives (Project, Overall, Architecture, System).

---

### Wave A.2 — 9-doc reconciliation batch (1 session)

**Pre-condition**: Wave A.1 merged.

**Tasks**: One sequential `gobbi-agent` per `docs-cleanup-parallelism.md` — invoking the rule's "comfortable context budget" exception clause. The 9 docs share dense interlinked vocabulary (5-step → 6-step model, `.gobbi/state.db` naming, `handoff` terminology, 22 → 23 events). Convergence value outweighs the context-budget cost; splitting risks cross-batch terminology drift. (Project Plan F-3 recommends a 2-3 split if context budget is reached — Wave A.2's planning step decides.)

| Doc | Change |
|---|---|
| `.claude/CLAUDE.md` | 5-step model → 6-step model with `handoff` terminal; `.gobbi/state.db` + `.gobbi/gobbi.db` terminology |
| `.gobbi/projects/gobbi/design/v050-overview.md` | Same model + DB updates; new architecture diagram |
| `.gobbi/projects/gobbi/design/v050-state-machine.md` | Add `handoff` step + transitions; update event count to 23 |
| `.gobbi/projects/gobbi/design/v050-prompts.md` | JIT footer pattern data-driven from `blocks.footer` |
| `.gobbi/projects/gobbi/design/v050-hooks.md` | New advancement-observed event; new hook responsibilities (PostToolUse for transition Bash, UserPromptSubmit, missed-advancement safety net in Stop) |
| `.gobbi/projects/gobbi/design/v050-cli.md` | New `gobbi workflow run` command (Outer mode, Wave E.2 — mark as future); `gobbi maintenance migrate-state-db` (now exists per A.1.4) |
| `.gobbi/projects/gobbi/design/v050-session.md` | Workspace-level state.db; 23-event enumeration; new tables |
| `.gobbi/projects/gobbi/design/v050-features/deterministic-orchestration.md` | Full rewrite — content moves to `orchestration/README.md` (already there from Pass 4); this file becomes a stub redirect or is deleted |
| `.gobbi/projects/gobbi/design/v050-features/just-in-time-prompt-injection.md` | Stub redirect to `orchestration/README.md` § JIT, or delete |

**Agent**: `gobbi-agent` (single sequential — per the rule).

**Skills**: `_claude`, `_project`, `_gotcha`.

**Scope boundary**: docs only; no code changes; no test changes.

**Files modified**: exactly the 9 listed above.

**Verification**:
- All 9 files updated; consistent vocabulary (verify via grep for "5-step", "memorization → done", `gobbi.db` per-session — should yield 0 matches outside historical references).
- Cross-doc links remain valid.
- `gobbi docs health` (if applicable) passes.

**Wave evaluation**: 3 perspectives (Project, Overall, Documentation → mapped to `_project-evaluator` or `gobbi-agent` per GAP-11).

---

### Wave B.1 — Orchestration materialization extras + JIT footer code (1 session)

**Pre-condition**: Waves A.1 + A.2 merged. Note: Pass 4's Task 1.1 (this session) already shipped `orchestration/scenarios.md` and `orchestration/checklist.md` baselines — Wave B.1's task B.1.3 builds on those, not from scratch.

**Tasks**:

| # | Description | Agent | Files |
|---|---|---|---|
| B.1.1 | Implement data-driven footer in spec.json: add `blocks.footer` field; update `assembly.ts::compile()` to render the footer from spec data. **Schema mirror enforcement (drift-tested):** the `blocks.footer` field MUST be added simultaneously to `_schema/v1.ts` (TypeScript types), `_schema/v1.json` (JSON Schema mirror), and `types.ts::StepBlocks` (which has `additionalProperties: false`). Without all three, `tsc --noEmit` fails OR `schema.test.ts:399-404` drift test fails. | `__executor` | `packages/cli/src/specs/_schema/v1.ts`, `packages/cli/src/specs/_schema/v1.json`, `packages/cli/src/specs/types.ts`, `packages/cli/src/specs/assembly.ts`, every `spec.json` file |
| B.1.2 | Snapshot tests for compiled prompts before/after — verify cache-prefix bytes are identical for same-step recompile. | `__executor` | `packages/cli/src/specs/__tests__/snapshot.test.ts` |
| B.1.3 | Expand `orchestration/scenarios.md` and `orchestration/checklist.md` (baselines from Pass 4 Task 1.1) with footer-pattern scenarios that A.1's implementation made concrete. | `gobbi-agent` | `orchestration/scenarios.md`, `orchestration/checklist.md` |

**Agent**: `__executor` for B.1.1–B.1.2; `gobbi-agent` for B.1.3.

**Skills**: `_typescript`, `_bun`, `_execution` for code; `_claude`, `_project` for docs.

**Scope boundary**: footer code + scenarios/checklist updates; no other features.

**Files modified**: as listed. No `index.json` changes (Wave A.1 already covered the structural change).

**Verification**: bun test passes; snapshot tests confirm cache stability; orchestration design's checklist has every footer scenario covered.

**Wave evaluation**: 3 perspectives (Project, Overall, Architecture).

---

### Wave C.1 — Prompts-as-data feature pass (1–2 sessions)

**Pre-condition**: Wave B.1 merged.

**Tasks** (single session if scope is "schema + footer-as-data lock + JSONL log + JSON Patch tooling"; two sessions if also migrating broader prompts):

| # | Description |
|---|---|
| C.1.1 | Lock JSON Schema v1 for step specs (extend `_schema/v1.ts`); CI validation that all `spec.json` files conform. |
| C.1.2 | Add schema v7 with `prompt_patches` table (deferred from Wave A.1 per ideation §10). |
| C.1.3 | Define `prompt.patch.applied` event factory + reducer-transparent commit path (via `store.append()`). |
| C.1.4 | Append-only JSONL evolution log under `.gobbi/projects/<name>/prompt-evolution/<prompt-id>.jsonl` (git-tracked). |
| C.1.5 | Rendering pipeline: `gobbi prompt render <prompt-id> --format=markdown` and `--format=composed`. |
| C.1.6 | `gobbi prompt patch <prompt-id> --patch <json-patch-file>` command — applies RFC 6902 patches, validates schema, emits event, appends to JSONL. |

**Agent**: `__executor` (code) + `gobbi-agent` (design doc and tests of the schema).

**Skills**: `_typescript`, `_bun`, `_execution`, `_project` (for `prompts-as-data` feature doc — corrected per DRIFT-10 to `_project` not `_skills`).

**Files modified**: schema files in `packages/cli/src/specs/_schema/`, new commands under `packages/cli/src/commands/prompt/`, schema migrations, every existing `spec.json` if changes are required, design doc `.gobbi/projects/gobbi/design/v050-features/prompts-as-data.md`.

**Wave evaluation**: 4 perspectives (Project, Overall, Architecture, Innovative-PI for design challenge, Best-PI for prior-art compliance) — invoked as `__pi` with explicit stance framing per DRIFT-11.

**Effort split decision**: defer to Wave C.1's planning step; default 1 session if footer-as-data is the only prompt converted, 2 sessions if all step-spec prompts migrate.

---

### Wave D.1 — Roles × Specialties feature pass (1–2 sessions)

**Pre-condition**: Wave C.1 merged.

**Tasks**:

| # | Description |
|---|---|
| D.1.1 | Lock the ≤7 role catalog: `researcher`, `executor`, `evaluator`, `planner`, `reviewer` (plus `pi` if treated as a role rather than the workflow-step name); confirm against existing agents in `.claude/agents/`. |
| D.1.2 | Define Specialty JSON schema; build the (role, specialties[]) → composed-prompt assembler. |
| D.1.3 | Migrate existing agents (`__pi`, `__executor`, `*-evaluator`, etc.) to (role, specialties[]) composition; specialty content moves out of agent files into `.gobbi/specialties/<name>.json`. |
| D.1.4 | CI lint rule: catalog file `.gobbi/roles/catalog.json` must have ≤ 7 entries; lint fails on overflow. **Add `!.gobbi/roles/` exception to `.gitignore` so the catalog is git-tracked (Architecture P-A-5 / GAP-12).** |
| D.1.5 | Design doc `.gobbi/projects/gobbi/design/v050-features/roles-and-specialties.md`. |

**Agent**: `__executor` for code + lint; `gobbi-agent` for design doc + agent migration.

**Skills**: `_typescript`, `_bun`, `_execution`, `_agents`, `_project` (for design doc — corrected per DRIFT-10).

**Files modified**: new `.gobbi/roles/catalog.json`, new `.gobbi/specialties/*.json` tree, updated agent files in `.claude/agents/`, new lint rule, design doc, `.gitignore`.

**Wave evaluation**: 5 perspectives (Project, Overall, Architecture, Best-PI for catalog discipline, Innovative-PI for orthogonality stress test) — invoked as `__pi` with explicit stance framing.

---

### Wave E.1 — Inner mode safety net implementation (1 session, **parallel-eligible with Wave C.1**)

**Pre-condition**: Waves A.1 + B.1 merged. Independent of C.1 / D.1 — can run in parallel with them. Schedule whichever has capacity first.

**Tasks**:

| # | Description |
|---|---|
| E.1.1 | Wire PostToolUse hook for Bash matching `gobbi workflow transition`; commit `step.advancement.observed` via direct `store.append()` (NOT reducer). |
| E.1.2 | Stop-hook missed-advancement detection: query `events` for last `step.advancement.observed` since last `step.exit`/`start`/`resume`; if absent + ≥2 turns, inject `additionalContext` reminder; if ≥5 turns, mark in `state_snapshots`. |
| E.1.3 | `tool_calls` audit table writes from Pre/PostToolUse. |
| E.1.4 | UserPromptSubmit handler: route `/gobbi`; emit `decision.user` for workflow-control intents. |
| E.1.5 | Integration tests for safety net + missed-advancement scenarios. |

**Agent**: `__executor`.

**Skills**: `_typescript`, `_bun`, `_execution`.

**Files modified**: `packages/cli/src/commands/workflow/{capture-planning,stop,user-prompt}.ts` (capture-planning extended; user-prompt new); new test files.

**Wave evaluation**: 4 perspectives (Project, Overall, Architecture, System).

---

### Wave E.2 — Outer mode driver implementation (1 session)

**Pre-condition**: Wave E.1 merged + spike outcome from A.1.1 (`claude -p` hook firing) confirms the contract.

**Tasks**:

| # | Description |
|---|---|
| E.2.1 | New `gobbi workflow run` command: per-step spawn, retry, timeout, footer-miss reconciliation. |
| E.2.2 | Cross-mode parity snapshot test. |
| E.2.3 | Explicit-CLI fallback for hooks if A.1.1 spike found `claude -p` does NOT fire hooks. |
| E.2.4 | Design doc `.gobbi/projects/gobbi/design/v050-features/inner-vs-outer-execution.md`. |

**Agent**: `__executor` for code; `gobbi-agent` for design doc.

**Skills**: `_typescript`, `_bun`, `_execution`, `_gobbi-cli`.

**Files modified**: `packages/cli/src/commands/workflow/run.ts` (new), integration test, design doc.

**Wave evaluation**: 4 perspectives (Project, Overall, Architecture, System).

---

### Wave F.1 — Document search Tiers 1+2 (1 session, low priority — planning stub)

> **Status: planning stub.** Full task decomposition (file targets, verification approach, evaluator perspectives, dependency graph) deferred to F.1's own planning step. The summary below is the design-level scope, not an executable task list.

**Pre-condition**: Wave A.1 merged. Independent of B/C/D/E.

**Scope summary**:
- F.1.1: FTS5 virtual table on `gobbi.db::memories(title, body_md)`.
- F.1.2: `gobbi search <query>` command — Tier 1 SQL metadata + Tier 2 FTS.
- F.1.3: Design doc `.gobbi/projects/gobbi/design/v050-features/document-search.md`.

**Likely agents**: `__executor` (FTS + command) + `gobbi-agent` (design doc).

---

### Wave F.2 — Install strategy (1 session, low priority — planning stub)

> **Status: planning stub.** Full task decomposition deferred to F.2's own planning step.

**Pre-condition**: none.

**Scope summary**:
- F.2.1: `gobbi setup` interactive command (Playwright-style).
- F.2.2: `gobbi doctor` reports environment status.
- F.2.3: Design doc `.gobbi/projects/gobbi/design/v050-features/install-strategy.md`.

**Likely agents**: `__executor` (commands) + `gobbi-agent` (design doc).

---

### Execution order summary

```
[Pass 4 (this session)] → [PR #137 integration]
       ↓                          ↓
       └──────────┬───────────────┘
                  ↓
            [Wave A.1]
                  ↓
            [Wave A.2]
                  ↓
            [Wave B.1]
              ↓        ↓
       [Wave C.1]   [Wave E.1]   [Wave F.1, F.2 — parallel, low pri]
              ↓        ↓
       [Wave D.1]   [Wave E.2]
```

Critical path: Pass 4 → A.1 → A.2 → B.1 → C.1 → D.1 (six sequential).
E.1 / E.2 fork from B.1, can run in parallel with C.1 / D.1.
F.1 / F.2 fork from A.1, low priority — schedule when capacity allows.

**Total**: 8 future sessions; estimate 1-2 weeks of work-time.

---

## Open items

These do not block Pass 4 shipping but are tracked across future Wave plans:

1. **Wave A.2 batch size** — 9 docs in one pass vs 2-3 split per Project Plan F-3. Decide at Wave A.2's planning step. Default: single pass with explicit override note citing "vocabulary consistency outweighs context budget."

2. **Wave C.1 effort split** — 1 session (schema + footer-as-data + JSONL + JSON Patch tooling only) or 2 sessions (also migrate broader prompts). Decide at Wave C.1's planning step. Default: 1 session.

3. **Wave F priority** — defer entirely until Waves A–E ship (default), or interleave F.2 (install) earlier as an independent stream? Plan default: defer entirely. Decide when capacity becomes available.

4. **Umbrella issue strategy** — file an umbrella issue for the entire Wave A–F roadmap, or close #121 and file separate issues per Wave. Default: close #121 with Pass 4 PR; file new issues per Wave at the start of each Wave's session.

5. **`codex --headless` dependency** — placeholder vs real (NOTE-7). Decide at Wave E.2's planning step. Spike if real; drop if placeholder.

6. **Documentation / Tests evaluator agents** — file new evaluator agent definitions or map to existing ones per GAP-11. Default: map to existing per the GAP entry.

7. **Worktree naming convention** — Pass 4's actual worktree (`.claude/worktrees/pass4-orchestration-design/`) deviates from `_git/conventions.md`'s typed-prefix pattern. Future Waves must use the convention.

---

See `README.md` for the prose overview. `scenarios.md` defines behaviour each verification item targets; `checklist.md` turns scenarios into ISTQB-tagged verification items.
