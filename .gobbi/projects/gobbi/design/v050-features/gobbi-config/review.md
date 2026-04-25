# Review — gobbi-config Pass 3

| Pass date  | Session ID               | Verdict    | PR     |
|------------|--------------------------|------------|--------|
| 2026-04-21 | `dfd4ff66-a2d4-456f-8fa4-ddd843e4e58b` | shipped | #123 (draft) |

Pass-3 finalization replaced the T1/T2 JSON + T3 SQLite + provenance architecture with a unified three-level `settings.json` shape and a two-verb CLI. Waves B through D landed on `feat/120-gobbi-config-pass-3` atop 6 prior commits. This review documents what drifted from the originally-shipped Pass-3 design, notable implementation decisions (NOTEs), and open gaps deferred to follow-up Passes (GAPs).

All SHAs below exist on the branch (`git log --oneline` verified).

---

## DRIFT entries

### DRIFT-1 — `trivialRange` field removed entirely

**Finding:** Pass-3 shipped `trivialRange: 'read-only' | 'simple-edits'` in the project-config schema. Pass-3 finalization drops it entirely per explicit user lock: "Drop trivialRange. Now always follow full workflow with configuration." The field has no runtime consumer after the drop; scope-of-inline-edits is now governed by `workflow.execution.discuss.mode`.

**Evidence:** ideation.md §3.3 "Fields removed vs Pass-3" — `trivialRange` row; ideation.md §3.4 — `trivialRange → REMOVED` entry; `packages/cli/src/lib/settings.ts` at `f9b3925` has no `trivialRange` field.

**Severity:** Medium — documentation and tests referencing `trivialRange` would fail against the new schema.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B): `settings.ts` has no `trivialRange`; all CFG-* scenarios rewritten at `ff20702` (Wave D.2).

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-2 — `cost.*` section removed

**Finding:** Pass-3 schema v2 included `cost: { rateTable, tokenBudget }`. Pass-3 finalization drops it: `MODEL_RATES` is hardcoded in `lib/cost-rates.ts`; no runtime consumer reads `cost.*` from config.

**Evidence:** ideation.md §3.3 — `cost.*` row ("Re-add when a consumer exists"); `packages/cli/src/lib/settings.ts` at `f9b3925` has no `cost` section.

**Severity:** Medium — cost-related scenarios would fail against the new schema.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B). Deferred re-add to when a real consumer exists.

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-3 — `evaluationMode` column → per-step `evaluate.mode` enum

**Finding:** The SQLite `evaluation_mode` column stored a single string (`'always-evaluate'`, `'ask'`, etc.) written by the `/gobbi` skill. Pass-3 finalization replaces it with `workflow.{step}.evaluate.mode` per-step enum (`'ask' | 'always' | 'skip' | 'auto'`). The old contract between `/gobbi`'s Q2 write and the reducer's EVAL_DECIDE consumption was broken (string vs boolean mismatch); the new shape fixes it end-to-end.

**Evidence:** ideation.md §3.4 — `eval.{ideation,plan,execution} (bool) → workflow.{step}.evaluate: StepEvaluate`; plan.md §Wave B — "Fix the `evaluationMode ↔ eval.{ideation,plan}` contract break"; `f9b3925` (Wave B) replaces SQLite path; `08fb3d7` (Wave C.2) extends reducer with optional `execution` slot; `ff20702` (Wave D.2) adds `q2-evalconfig-e2e.test.ts` covering 4×3 combinations.

**Severity:** High — the old contract break caused silent wrong evalConfig state in the session.

**Resolution:** fix code + doc — resolved across `f9b3925` (Wave B) + `08fb3d7` (Wave C.2) + `cf7733c` (Wave D.1a) + `ff20702` (Wave D.2).

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-4 — T3 SQLite replaced by per-session `settings.json`

**Finding:** Pass-3 shipped T3 as a row in `.gobbi/config.db` via `ConfigStore`. Pass-3 finalization replaces T3 with `.gobbi/projects/<name>/sessions/{id}/settings.json` — a JSON file per session directory. The SQLite path (`config-store.ts`, `toCascadeProjection`, `openConfigStore`, WAL handling, TTL cleanup) is deleted.

**Evidence:** plan.md §Wave B — "DELETE `packages/cli/src/lib/config-store.ts`"; `f9b3925` (Wave B) deletes the file; `packages/cli/src/lib/settings-io.ts` at `f9b3925` implements `loadSettingsAtLevel(repoRoot, 'session')` reading from `projects/<name>/sessions/{id}/settings.json`.

**Severity:** High — agents reading from SQLite column names or expecting `ConfigStore` would fail entirely.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B). The README (this Pass) uses per-session `settings.json` throughout.

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-5 — `gobbi config resolve`, `--with-sources`, `__sources` provenance removed

**Finding:** Pass-3 shipped `gobbi config resolve <key> [--with-sources]` and `ResolvedConfig.__sources` (a flat dot-path → tier-id provenance map). Pass-3 finalization drops the entire provenance feature: `__sources`, `TierId`, `deepMergeWithProvenance`, `seedDefaultProvenance`, the `resolve` subcommand, and `--with-sources`. CLI collapses to two verbs: `get` + `set`.

**Evidence:** ideation.md §3.3 — `__sources` row + `gobbi config init/delete/list/cleanup/resolve` row + `--with-sources` row; plan.md §Wave B; `f9b3925` (Wave B) + `9bcb227` (Wave C.1) implement two-verb CLI.

**Severity:** Medium — any skill or agent calling `gobbi config resolve` would get command-not-found.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B) + `9bcb227` (Wave C.1). The README describes only `get` + `set`.

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-6 — `verification.*` section removed; `verification-runner.ts` decommissioned

**Finding:** Pass-3 schema v2 included `verification: { runAfterSubagentStop, runAfterToolStop, commands }`. Pass-3 finalization drops it per user lock. `verification-runner.ts` is deleted (Option A from ideation §6.6: executor subagents self-verify per `_delegation` lifecycle; the post-workflow-next runner was duplicative).

**Evidence:** ideation.md §3.3 — `verification.*` row; plan.md §Wave B — "DELETE `packages/cli/src/workflow/verification-runner.ts`"; `f9b3925` (Wave B) deletes the runner and removes the import from `next.ts`.

**Severity:** Medium — `verification.*` config reads would silently return nothing (key not in schema).

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B). No scenarios or checklist items reference `verification.*`.

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-7 — `git.mode`/`git.baseBranch` → `git.workflow.{mode,baseBranch}`

**Finding:** Pass-3 and prior placed `git.mode` and `git.baseBranch` at the top level of the git section. Pass-3 finalization restructures git by concern: `git.workflow.{mode,baseBranch}`, `git.pr.{draft}`, `git.cleanup.{worktree,branch}`.

**Evidence:** ideation.md §3.4 — "Fields renamed / restructured vs Pass-3"; `packages/cli/src/lib/settings.ts` at `f9b3925` — `GitSettings.workflow` sub-object.

**Severity:** Medium — sibling docs and skill files referencing `git.mode` at the top level would describe the wrong path.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B) for code; `cf7733c` (Wave D.1a) rewrites SKILL.md; Wave E sweeps sibling skills and design docs.

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-8 — `notify.{slack,telegram}: boolean` → per-channel `ChannelSettings` dict

**Finding:** Pass-3's T1/T2 schemas used `notify.slack: boolean` and `notify.telegram: boolean`. Pass-3 finalization replaces with per-channel objects (`enabled`, `events`, `triggers`, channel-specific routing). Adds `discord` and `desktop` channels.

**Evidence:** ideation.md §3.4 — `notify.{slack,telegram,discord}: boolean → ChannelSettings`; `packages/cli/src/lib/settings.ts` at `f9b3925` — `NotifySettings` interface.

**Severity:** High — old boolean notify writes would be rejected by the new AJV schema.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B) + `b671b02` (Wave D.1b) wires `notify.ts` to cascade + inverted events semantic.

**Owner:** gobbi-config Pass 3 finalization.

---

## NOTE entries

### NOTE-1 — AJV `JSONSchemaType<Settings>` compiles OK under `exactOptionalPropertyTypes`

**Finding:** Pass-2 hit an AJV `JSONSchemaType<T>` limitation with V1+V2 union under `exactOptionalPropertyTypes`. Wave A spiked the new `Settings` interface (single type, no union) and confirmed it compiles. The two-schema dispatch from Pass 2 is not needed — a single `ajv.compile<Settings>(schema)` suffices.

**Evidence:** plan.md §Wave A decision; plan.md §Wave B AJV decision branch — "If spike PASSES: Wave B uses `JSONSchemaType<Settings>`"; `packages/cli/src/lib/settings-validator.ts` at `f9b3925` — single compiled validator.

**Owner:** gobbi-config Pass 3 finalization (Wave A spike).

---

### NOTE-2 — `lib/repo.ts::getRepoRoot` memoization requires `mock.module` workaround in tests

**Finding:** `getRepoRoot` is memoized at module level. Test files that call it across different temp directories must use `mock.module('../../lib/repo.js', ...)` to reset the memo between tests. Without this, a first test's repo root leaks into subsequent tests.

**Evidence:** plan.md §Wave B gotcha reference — "session-id-discovery.md, code-edits.md"; `ff20702` (Wave D.2) test file comment "judgment call: mock.module for getRepoRoot".

**Owner:** gobbi-config Pass 3 finalization.

---

### NOTE-3 — Per-step `model`/`effort` stored but not yet enforced at spawn time

**Finding:** `workflow.{step}.{discuss,evaluate}.{model,effort}` config allows explicit override of `_delegation`'s model defaults. Values are stored and returned by `resolveSettings`, but the spawn pipeline in the orchestrator skill does not yet read them. `'auto'` (the default) applies `_delegation`'s table unconditionally. A future gobbi-rule update may clamp the ranges.

**Evidence:** ideation.md §10.10 — "model/effort override vs core-rule tension"; `settings.ts` `AgentModel` / `AgentEffort` types exist; no spawn-pipeline reader yet.

**Owner:** deferred to a future Pass when orchestrator reads per-step model/effort overrides.

---

### NOTE-4 — `notify.*.triggers` is schema-only; Claude Code hook-registration wiring deferred

**Finding:** `ChannelBase.triggers: HookTrigger[]` is defined in the schema and accepted by AJV, but the dispatch wiring that registers Claude Code hook events to fire gobbi's notify bridge does not exist yet. Field is reserved to avoid a schema bump when wiring lands.

**Evidence:** ideation.md §6.3 — "Claude-Code hook-trigger integration (`notify.*.triggers`) is schema-only in this Pass"; `settings.ts` `HookTrigger` type; `notify.ts` at `b671b02` does not read `triggers`.

**Owner:** deferred to a follow-up Pass.

---

## GAP entries

### GAP-1 — Claude Code hook-trigger dispatch for `notify.*.triggers` not wired

**Finding:** The schema reserves `notify.{channel}.triggers: HookTrigger[]` for Claude Code session hook events (Stop, SubagentStop, etc.) that should trigger gobbi notify delivery. The registration wiring is not in scope for Pass 3 — it requires hooking into the plugin's hook registration lifecycle.

**Evidence:** ideation.md §6.3; NOTE-4 above; `b671b02` (Wave D.1b) wires gobbi workflow events but not Claude Code hook triggers.

**Deferred to:** a follow-up Pass covering Claude Code hook integration.

**Owner:** Pass 3 finalization (deferred).

---

### GAP-2 — `model`/`effort` config override vs core-rule tension not resolved

**Finding:** `_gobbi-rule` mandates "All agents run at max effort" and `_delegation` mandates model by stance (opus for innovative/executor, sonnet for evaluators). The new `workflow.{step}.{discuss,evaluate}.{model,effort}` config permits explicit override of those defaults. A config setting can currently undercut a core-rule invariant. Mitigation: defaults are `'auto'` which applies core-rule policy unchanged; explicit values are opt-in.

**Evidence:** ideation.md §10.10 — "Documented as tension, not resolved in this Pass."

**Deferred to:** a future gobbi-rule update that may clamp the ranges or forbid certain overrides.

**Owner:** Pass 3 finalization (deferred).

---

### GAP-3 — gobbi-memory/README.md cross-ref sync deferred to post-#119 merge

**Finding:** The `feat/120-gobbi-config-pass-3` branch has `v050-features/gobbi-memory.md` as a flat file. The directory form (`gobbi-memory/README.md`) exists only on `feat/118-gobbi-memory-pass-2` (PR #119, still draft). Cross-ref sync between gobbi-config and gobbi-memory cannot land until #119 merges — doing it now would create a doc pointing to a directory that doesn't exist on this branch.

**Evidence:** plan.md §Wave E plan-eval O-10 decision — "Wave E does NOT touch gobbi-memory docs. #130 stays open with unchanged scope."

**Deferred to:** post-#119 merge; issue #130 remains open with original scope.

**Owner:** issue #130.

---

## Summary table

| Finding | Type | Severity | SHAs | Resolution |
|---------|------|----------|------|-----------|
| DRIFT-1 | drift | medium | `f9b3925` + `ff20702` | fix code + doc |
| DRIFT-2 | drift | medium | `f9b3925` | fix code + doc |
| DRIFT-3 | drift | high | `f9b3925` + `08fb3d7` + `cf7733c` + `ff20702` | fix code + doc |
| DRIFT-4 | drift | high | `f9b3925` | fix code + doc |
| DRIFT-5 | drift | medium | `f9b3925` + `9bcb227` | fix code + doc |
| DRIFT-6 | drift | medium | `f9b3925` | fix code + doc |
| DRIFT-7 | drift | medium | `f9b3925` + `cf7733c` + Wave E | fix code + doc |
| DRIFT-8 | drift | high | `f9b3925` + `b671b02` | fix code + doc |
| NOTE-1 | note | — | `f9b3925` (Wave A→B decision) | design decision |
| NOTE-2 | note | — | `ff20702` | test discipline |
| NOTE-3 | note | — | — (no code change) | scope boundary |
| NOTE-4 | note | — | `b671b02` (schema-only) | scope boundary |
| GAP-1 | gap | — | — | deferred; follow-up Pass |
| GAP-2 | gap | — | — | deferred; gobbi-rule update |
| GAP-3 | gap | — | — | deferred; issue #130 post-#119 |
