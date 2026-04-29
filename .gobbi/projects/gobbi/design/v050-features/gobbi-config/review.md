# Review — gobbi-config Pass 3

| Pass date  | Session ID               | Verdict    | PR     |
|------------|--------------------------|------------|--------|
| 2026-04-21 | `dfd4ff66-a2d4-456f-8fa4-ddd843e4e58b` | shipped | #123 (draft) |
| 2026-04-28 | `c34ea7e6-d5c3-4174-b61e-5176efc8d39b` | shipped | PR-FIN-1c — #213 (squash `8cd2a0d`) |
| 2026-04-28 | `c34ea7e6-d5c3-4174-b61e-5176efc8d39b` | shipped | PR-FIN-1a — #215 (squash `69c7cd0`) |
| 2026-04-28 | `c34ea7e6-d5c3-4174-b61e-5176efc8d39b` | shipped | PR-FIN-1b — #217 (squash `a48ea7c`) |
| 2026-04-28 | `c34ea7e6-d5c3-4174-b61e-5176efc8d39b` | shipped | PR-FIN-1d — #221 (squash `5bc7a61`) |
| 2026-04-29 | `c34ea7e6-d5c3-4174-b61e-5176efc8d39b` | shipped | PR-FIN-1e — #224 (squash `5ddffab`) |
| 2026-04-29 | `e735ee3d-6a43-44da-886b-64dcc8b9aa92` | shipped | PR-FIN-5 — #225 (squash `<TBD-PR225>`) |

Pass-3 finalization replaced the T1/T2 JSON + T3 SQLite + provenance architecture with a unified three-level `settings.json` shape and a two-verb CLI. Waves B through D landed on `feat/120-gobbi-config-pass-3` atop 6 prior commits.

PR-FIN-1c (session `c34ea7e6`) reshaped `GitSettings` around always-on worktrees with independent opt-in fields (`issue.create`, `pr.open`, `pr.draft`), removed the `mode`/`workflow`/`cleanup` sub-objects, and removed the `ProjectsRegistry` interface + `Settings.projects` field entirely. Project resolution is now `basename(repoRoot)` + `--project` flag. The T2-v1 upgrader was extended to handle both the original T2-v1 shape and Pass-3 current-shape files. Commits `362217c` + `954f889` on branch `feat/212-pr-fin-1c-schema-redesign`.

PR-FIN-1a (session `c34ea7e6`) added the `gobbi config init` verb (three levels, minimum-valid seed, `--force` overwrite with stderr WARN), replaced `init.ts::resolveSessionId`'s `randomUUID()` fallback with a hard error and remediation hint, added the `#182` recovery hint to `config get/set/init` missing-session-id errors, and locked the `#185` fresh-setup ordering invariant via CFG-23 integration test. Commit `6909fec` on branch `feat/214-pr-fin-1a-config-init-session-id`.

PR-FIN-1b (session `c34ea7e6`) shipped the `gobbi hook` namespace (28 Claude Code events, 5 non-trivial bodies + 23 generic stubs), `gobbi config env` (reads stdin JSON payload + native `CLAUDE_*` env, writes unified `KEY=VALUE` lines to `$CLAUDE_ENV_FILE`), and the `/gobbi` SKILL.md migration (retired the "Discovering the real session ID" section and the `cli-vs-skill-session-id` gotcha). Plugin manifest and per-repo `.claude/settings.json` updated from 5 entries to 28. Commits `2248b72` + `b307214` on branch `feat/216-pr-fin-1b-hook-namespace`.

PR-FIN-1d (session `c34ea7e6`) expanded the `HookTrigger` enum from 9 to 28 values, extracted `dispatchToChannels` as the shared per-channel dispatch helper, added `dispatchHookNotify(payload, eventName, options)` for hook-side notification, wired 7 Phase-1 events (`Stop`, `SubagentStop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, `Notification`, `PreCompact`) end-to-end, and shipped `gobbi notify configure --enable/--disable/--status` for user-driven `.claude/settings.json` management with a trust-boundary read-only stance for non-gobbi entries. The 21 Phase-2 events keep `TODO(PR-FIN-1d-phase-2 #219)` markers; rich-message wiring for them is filed as issue #219. Commits `a8980f8` + `001f96b` + `126e898` + `f7674d8` + `5b10500` on branch `feat/218-pr-fin-1d-hooktrigger-notify-dispatch`.

This review documents what drifted from the originally-shipped Pass-3 design, notable implementation decisions (NOTEs), and open gaps deferred to follow-up Passes (GAPs). Entries marked **[superseded by DRIFT-9]** describe changes now themselves changed by PR-FIN-1c.

All SHAs below exist on the branch (`git log --oneline` verified).

---

## DRIFT entries

### DRIFT-1 — `trivialRange` field removed entirely *(doc superseded by DRIFT-9 — PR-FIN-1c reshape)*

**Finding:** Pass-3 shipped `trivialRange: 'read-only' | 'simple-edits'` in the project-config schema. Pass-3 finalization drops it entirely per explicit user lock: "Drop trivialRange. Now always follow full workflow with configuration." The field has no runtime consumer after the drop; scope-of-inline-edits is now governed by `workflow.execution.discuss.mode`.

**Evidence:** ideation.md §3.3 "Fields removed vs Pass-3" — `trivialRange` row; ideation.md §3.4 — `trivialRange → REMOVED` entry; `packages/cli/src/lib/settings.ts` at `f9b3925` has no `trivialRange` field.

**Severity:** Medium — documentation and tests referencing `trivialRange` would fail against the new schema.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B): `settings.ts` has no `trivialRange`; all CFG-* scenarios rewritten at `ff20702` (Wave D.2). The T2-v1 upgrader path in `ensure-settings-cascade.ts` silently drops `trivialRange` during upgrade.

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

### DRIFT-7 — `git.mode`/`git.baseBranch` → `git.workflow.{mode,baseBranch}` *(superseded by DRIFT-9 — PR-FIN-1c removed `git.workflow.*` entirely)*

**Finding:** Pass-3 and prior placed `git.mode` and `git.baseBranch` at the top level of the git section. Pass-3 finalization restructures git by concern: `git.workflow.{mode,baseBranch}`, `git.pr.{draft}`, `git.cleanup.{worktree,branch}`.

**Evidence:** ideation.md §3.4 — "Fields renamed / restructured vs Pass-3"; `packages/cli/src/lib/settings.ts` at `f9b3925` — `GitSettings.workflow` sub-object.

**Severity:** Medium — sibling docs and skill files referencing `git.mode` at the top level would describe the wrong path.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B) for code; `cf7733c` (Wave D.1a) rewrites SKILL.md; Wave E sweeps sibling skills and design docs. **Superseded by DRIFT-9:** PR-FIN-1c removed `git.workflow.*` entirely in favour of the flat shape with per-concern sub-objects. The intermediate `git.workflow.{mode,baseBranch}` path described here was a Pass-3 stop; the final shape after PR-FIN-1c is `git.{baseBranch,pr,issue,worktree,branch}`.

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-8 — `notify.{slack,telegram}: boolean` → per-channel `ChannelSettings` dict *(doc unchanged — notify shape was not affected by PR-FIN-1c)*

**Finding:** Pass-3's T1/T2 schemas used `notify.slack: boolean` and `notify.telegram: boolean`. Pass-3 finalization replaces with per-channel objects (`enabled`, `events`, `triggers`, channel-specific routing). Adds `discord` and `desktop` channels.

**Evidence:** ideation.md §3.4 — `notify.{slack,telegram,discord}: boolean → ChannelSettings`; `packages/cli/src/lib/settings.ts` at `f9b3925` — `NotifySettings` interface.

**Severity:** High — old boolean notify writes would be rejected by the new AJV schema.

**Resolution:** fix code + doc — resolved at `f9b3925` (Wave B) + `b671b02` (Wave D.1b) wires `notify.ts` to cascade + inverted events semantic.

**Owner:** gobbi-config Pass 3 finalization.

---

### DRIFT-10 — PR-FIN-1a: `randomUUID()` fallback removed from `init.ts::resolveSessionId`; `gobbi config init` verb added

**Finding:** `init.ts::resolveSessionId` silently generated a `randomUUID()` UUID when neither `--session-id` flag nor `$CLAUDE_SESSION_ID` env was present. This created orphan session directories under `.gobbi/projects/<name>/sessions/<random>/` that no subsequent command referenced. PR-FIN-1a removes the fallback and replaces it with a hard error (exit 2) plus a remediation hint pointing the user at `--session-id` and `$CLAUDE_SESSION_ID`. Additionally, `gobbi config init` is added as the third CLI verb — an explicit scaffold command for the minimum-valid seed, replacing the implicit "first `ensureSettingsCascade` run creates the file" pattern with an intentional user action.

**Evidence:** Round-3 ideation memo §Item 4a, §Item 1; plan §1a.1 deliverables B and A; `packages/cli/src/commands/workflow/init.ts` at `6909fec` — `resolveSessionId` rewrite; `packages/cli/src/commands/config.ts` at `6909fec` — `runInit` verb.

**Severity:** Medium — prior to this fix, any invocation of `gobbi workflow init` outside a Claude Code session context (e.g., manual testing, CI without `CLAUDE_SESSION_ID`) silently created an unreferenced session directory. The orphan dirs were not harmful but generated noise and consumed disk space.

**Resolution:** fix code + doc — resolved at `6909fec` (PR-FIN-1a). All three verbs now documented in README, scenarios CFG-19..23 added, checklist updated, CHANGELOG + MIGRATION updated.

**Owner:** PR-FIN-1a (session `c34ea7e6`).

---

### DRIFT-9 — PR-FIN-1c: `GitSettings` reshaped; `ProjectsRegistry` removed (F2 + F3)

**Finding:** PR-FIN-1c (session `c34ea7e6`) reshaped `GitSettings` and removed `ProjectsRegistry`. The Pass-3 shape (`git.workflow.{mode,baseBranch}`, `git.pr.{draft}`, `git.cleanup.{worktree,branch}`) is replaced with a flat shape where each concern owns its own sub-object: `git.baseBranch`, `git.issue.{create}`, `git.worktree.{autoRemove}`, `git.branch.{autoRemove}`, `git.pr.{open,draft}`. The `mode` enum (and concept of worktree-vs-direct-commit dispatch) is removed — worktrees are always created; PR and issue creation are independent opt-in fields. `Settings.projects` and the `ProjectsRegistry` interface are deleted; project resolution is `basename(repoRoot)` + `--project` flag.

The cross-field check changes from `git.workflow.mode === 'worktree-pr' && baseBranch === null` to `git.pr.open === true && baseBranch === null`. The check now only fires when the user explicitly set `pr.open=true` (not when DEFAULTS supply the value), so a fresh repo is not flagged.

The T2-v1 upgrader is extended to cover both the original T2-v1 shape and Pass-3 current-shape files. Workspace seed changes from `{schemaVersion: 1, projects: {...}}` to `{schemaVersion: 1}` (no `projects` block).

Supersedes the git-related portions of DRIFT-7 (which described the intermediate `git.workflow.*` shape). DRIFT-1's upgrader reference is updated to note that `trivialRange` is also dropped during the extended upgrade.

**Evidence:** ideation.md §F2, §F3 (Round-3 ideation memo at `.claude/project/gobbi/note/20260428-0311-finalize-gobbi-config-c34ea7e6-d5c3-4174-b61e-5176efc8d39b/ideation/ideation.md`); target-state spec §4.5, §4.6, §3.7 at `.gobbi/projects/gobbi/tmp/gobbi-config-target-state.md`; `packages/cli/src/lib/settings.ts` at `362217c`; `packages/cli/src/lib/ensure-settings-cascade.ts` at `362217c`.

**Severity:** High — any doc, skill, or agent referencing `git.workflow.*`, `git.cleanup.*`, `git.mode`, `projects.active`, or `projects.known` now describes stale paths.

**Resolution:** fix code + doc — resolved at `362217c` (schema + consumers + upgrader) + `954f889` (switch deletion). This review updated; README, scenarios, checklist updated in the same commit.

**Owner:** PR-FIN-1c (session `c34ea7e6`).

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

### NOTE-5 — `gobbi config init --force` emits a stderr WARN line (non-silent overwrite)

**Finding:** When `gobbi config init --force` overwrites an existing `settings.json`, it emits a warning line to stderr naming the overwritten path. This is a deliberate usability decision: `--force` is potentially destructive (it replaces user-edited settings with the minimum-valid seed), so the operator must be notified even on exit 0. The WARN line is on stderr so it does not pollute stdout-piped workflows. When `--force` is used on an absent file, no WARN is emitted (no overwrite occurred).

**Evidence:** plan §1a.1 deliverable A ("Refuses if file exists; with `--force`, overwrites and emits a stderr warning"); `packages/cli/src/commands/config.ts` at `6909fec` — `runInit` WARN branch; `packages/cli/src/__tests__/features/gobbi-config.test.ts` — CFG-22a vs CFG-22b distinction.

**Owner:** PR-FIN-1a (session `c34ea7e6`).

---

### NOTE-6 — 23 `gobbi hook <event>` stub handlers ship in PR-FIN-1b; notify dispatch deferred to PR-FIN-1d

**Finding:** PR-FIN-1b registers all 28 Claude Code events in the plugin manifest, but only 5 handlers have non-trivial bodies (the existing `gobbi workflow *` integrations). The remaining 23 handlers are generic stubs: read stdin, exit 0. Notify dispatch — the logic that checks `notify.{channel}.triggers` and fires the notify bridge — is not wired in any of the 28 handlers in this PR. Each non-trivial handler has a `// TODO(PR-FIN-1d)` marker at the dispatch site. PR-FIN-1d will fill in dispatch logic without adding new command files.

**Evidence:** plan §1b.1 "Phase scope" — "23 events have a generic stub body"; `commands/hook/<event>.ts` files at `2248b72` — all contain `// TODO(PR-FIN-1d)` comment; `commands/hook/_stub.ts::runGenericHookStub` — stub body comment notes deferred dispatch.

**Owner:** PR-FIN-1b (scope boundary, by design); wiring in PR-FIN-1d.

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

### DRIFT-11 — PR-FIN-1b: `/gobbi` skill discovery dance retired; `gobbi hook` namespace + `gobbi config env` + `$CLAUDE_ENV_FILE` pipeline ships

**Finding:** PR-FIN-1b (session `c34ea7e6`) fundamentally changes how Claude Code hook events reach the gobbi CLI and how session-id is acquired by the `/gobbi` skill. Prior to PR-FIN-1b, five hook entries in `plugins/gobbi/hooks/hooks.json` invoked `gobbi workflow *` commands directly; the `/gobbi` SKILL.md contained a multi-step "Discovering the real session ID" section (~24 lines) that tried `$CODEX_COMPANION_SESSION_ID`, fell back to scanning `.jsonl` file mtime, and warned on manual UUID. Authoritative finding from R3 ideation §F4: `CLAUDE_SESSION_ID` is NOT a Claude Code-provided env var — it arrives only as a field in the stdin JSON payload to hook commands. `$CLAUDE_ENV_FILE` is the official mechanism for persisting vars across a session.

PR-FIN-1b introduces:

1. `gobbi config env` — single-action verb that reads hook stdin JSON + native `CLAUDE_*` env and upserts `KEY=VALUE` lines into `$CLAUDE_ENV_FILE`. Idempotent.
2. `gobbi hook <event>` namespace — 28 handlers (one per Claude Code event). Five non-trivial bodies (`session-start`, `pre-tool-use`, `post-tool-use`, `subagent-stop`, `stop`) replace the prior direct `gobbi workflow *` registrations. 23 generic stubs read stdin and exit 0; notify dispatch deferred to PR-FIN-1d.
3. Plugin manifest (`hooks.json`) and per-repo `.claude/settings.json` updated from 5 to 28 entries pointing at `gobbi hook <event>`.
4. `/gobbi` SKILL.md discovery section removed — skill calls `gobbi config get …` directly; env is pre-populated by the SessionStart hook via `$CLAUDE_ENV_FILE`.
5. `cli-vs-skill-session-id` gotcha retired — the CLI/skill boundary for session id no longer exists.

**Evidence:** Round-3 ideation memo §F4 at `.claude/project/gobbi/note/20260428-0311-finalize-gobbi-config-c34ea7e6-d5c3-4174-b61e-5176efc8d39b/ideation/ideation.md`; target-state spec §3.3, §3.4, §5, §6 at `.gobbi/projects/gobbi/tmp/gobbi-config-target-state.md`; `packages/cli/src/commands/hook.ts` + `commands/hook/<28 files>.ts` at `2248b72`; `packages/cli/src/commands/config.ts::runConfigEnv` at `2248b72`; `.claude/skills/gobbi/SKILL.md` at `b307214`.

**Severity:** Medium-High — any doc, skill, or agent referencing `$CODEX_COMPANION_SESSION_ID`, the `.jsonl` mtime discovery technique, or the old 5-entry hook registration pattern now describes retired behaviour.

**Resolution:** fix code + doc — resolved at `2248b72` (code + plugin manifest) + `b307214` (SKILL.md migration + gotcha retirement). This review updated; README, scenarios, checklist updated in the same commit.

**Owner:** PR-FIN-1b (session `c34ea7e6`).

---

### DRIFT-12 — PR-FIN-1d: `HookTrigger` enum expanded; `dispatchHookNotify` + `gobbi notify configure` ship

**Finding:** PR-FIN-1d (session `c34ea7e6`) expanded the `HookTrigger` enum from 9 to 28 values (one per Claude Code hook event), extracted `dispatchToChannels` as the shared per-channel dispatch helper, and added `dispatchHookNotify(payload, eventName, options)` for hook-side notification. Phase-1 wires 7 events end-to-end (`Stop`, `SubagentStop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`, `Notification`, `PreCompact`) — the remaining 21 Phase-2 events keep `TODO(PR-FIN-1d-phase-2 #219)` markers pending rich-message wiring. New verb `gobbi notify configure --enable/--disable/--status` manages `.claude/settings.json` hook entries with a trust-boundary read-only stance for non-gobbi entries (existing user-managed entries are preserved on `--disable`).

**Evidence:** Round-3 ideation memo §F5 at `.claude/project/gobbi/note/20260428-0311-finalize-gobbi-config-c34ea7e6-d5c3-4174-b61e-5176efc8d39b/ideation/ideation.md`; target-state spec §6.4 at `.gobbi/projects/gobbi/tmp/gobbi-config-target-state.md`; `packages/cli/src/commands/notify.ts` at `5bc7a61`; `packages/cli/src/lib/settings.ts::HookTrigger` at `5bc7a61`; commits `a8980f8` + `001f96b` + `126e898` + `f7674d8` + `5b10500` on branch `feat/218-pr-fin-1d-hooktrigger-notify-dispatch`.

**Severity:** Medium — agents or skills that hard-coded the 9-value `HookTrigger` enum or registered notify channels via direct `.claude/settings.json` edits will need to migrate to the 28-value enum and the `gobbi notify configure` verb.

**Resolution:** fix code + doc — resolved across `a8980f8` + `001f96b` + `126e898` + `f7674d8` + `5b10500` (PR-FIN-1d, squash `5bc7a61`). NOTE-6 referenced this Pass for the deferred wiring; the Phase-1 wiring lands here, Phase-2 remains in #219.

**Owner:** PR-FIN-1d (session `c34ea7e6`).

---

### DRIFT-13 — PR-FIN-1e: `workflow.{step}.{agent,evaluate.agent}` wired into spec spawn pipeline

**Finding:** PR-FIN-1e (session `c34ea7e6`) closes the gap noted in NOTE-3: per-step `workflow.{step}.{agent,evaluate.agent}` settings (model + effort overrides) are now read by the orchestrator spec spawn pipeline. `loadSpecForRuntime` applies a runtime overlay against the per-step `agent-routing` block; `'auto'` (the default) preserves `_delegation`'s table unchanged, and explicit values override the spawn target's model/effort. Closes locked design decision #8.

**Evidence:** Round-3 ideation memo §F8 at `.claude/project/gobbi/note/20260428-0311-finalize-gobbi-config-c34ea7e6-d5c3-4174-b61e-5176efc8d39b/ideation/ideation.md`; target-state spec §9 #11 at `.gobbi/projects/gobbi/tmp/gobbi-config-target-state.md`; `packages/cli/src/specs/loader.ts::loadSpecForRuntime` at `5ddffab`; squash commit `5ddffab` on develop (PR #224).

**Severity:** Medium — closes the long-standing config-vs-spawn-pipeline gap (NOTE-3 superseded). Settings overrides previously stored but not enforced now reach the orchestrator end-to-end.

**Resolution:** fix code + doc — resolved at `5ddffab` (PR-FIN-1e, PR #224). NOTE-3 in this review is superseded; the per-step `model`/`effort` enforcement now ships.

**Owner:** PR-FIN-1e (session `c34ea7e6`).

---

### DRIFT-14 — PR-FIN-5: gobbi-wide cleanup — note.ts legacy fallback, verification.ts tombstone, bundled-spec resolution, docs sweep

**Finding:** PR-FIN-5 (session `e735ee3d`) bundles five gobbi-wide cleanup concerns into one PR per the cluster's smallest-reversible-first ordering: (1) `note.ts` legacy `plan/subtasks/` fallback removed; (2) `verification.ts:53` tombstone comment + dead `VerificationResultData`/`VerificationCommandKind` types removed; (3) `specs/paths.ts` helper + `dist/specs/` post-build cp resolves the `bun build` flatten ENOENT for `gobbi workflow next/validate/stop`; (4) `state-machine.md:121` plan/planning blockquote rewritten — runtime literal is `planning` (not `plan`); (5) Pass-3 narrative trimmed in `settings.ts` + `ensure-settings-cascade.ts` JSDocs; cross-doc `gobbi project switch` references swept to past-tense or annotated as removed; this `review.md` backfilled for PR-FIN-1a/1b/1c/1d/1e + closing entry. Resolves `build-safe-needs-dist-mkdir-on-fresh-worktree` gotcha via `mkdir -p ./dist` guard in `build:safe`. Cluster position 6 of 7 — only PR-FIN-2 (project-name validation, `gobbi project switch` removal) remains.

**Evidence:** ideation.md + plan.md at `.gobbi/projects/gobbi/sessions/e735ee3d-6a43-44da-886b-64dcc8b9aa92/`; commits on branch `feat/pr-fin-5-gobbi-wide-cleanup-225`.

**Severity:** Medium — `bun build` flatten fix is the highest-impact item; the docs sweep removes several stale references that would otherwise contradict PR-FIN-2.

**Resolution:** fix code + doc — resolved at `<TBD-PR225>` (PR #225, squash hash filled post-merge by orchestrator).

**Owner:** PR-FIN-5 (session `e735ee3d`).

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
| DRIFT-1 | drift | medium | `f9b3925` + `ff20702` | fix code + doc (upgrader note updated PR-FIN-1c) |
| DRIFT-2 | drift | medium | `f9b3925` | fix code + doc |
| DRIFT-3 | drift | high | `f9b3925` + `08fb3d7` + `cf7733c` + `ff20702` | fix code + doc |
| DRIFT-4 | drift | high | `f9b3925` | fix code + doc |
| DRIFT-5 | drift | medium | `f9b3925` + `9bcb227` | fix code + doc |
| DRIFT-6 | drift | medium | `f9b3925` | fix code + doc |
| DRIFT-7 | drift | medium | `f9b3925` + `cf7733c` + Wave E | fix code + doc (superseded by DRIFT-9) |
| DRIFT-8 | drift | high | `f9b3925` + `b671b02` | fix code + doc |
| DRIFT-9 | drift | high | `362217c` + `954f889` (PR-FIN-1c) | fix code + doc |
| DRIFT-10 | drift | medium | `69c7cd0` (PR-FIN-1a, #215) | fix code + doc |
| DRIFT-11 | drift | medium-high | `a48ea7c` (PR-FIN-1b, #217) | fix code + doc |
| DRIFT-12 | drift | medium | `5bc7a61` (PR-FIN-1d, #221) | fix code + doc |
| DRIFT-13 | drift | medium | `5ddffab` (PR-FIN-1e, #224) | fix code + doc (supersedes NOTE-3) |
| DRIFT-14 | drift | medium | `<TBD-PR225>` (PR-FIN-5, #225) | fix code + doc |
| NOTE-1 | note | — | `f9b3925` (Wave A→B decision) | design decision |
| NOTE-2 | note | — | `ff20702` | test discipline |
| NOTE-3 | note | — | superseded by DRIFT-13 (PR-FIN-1e) | wiring shipped |
| NOTE-4 | note | — | `b671b02` (schema-only) | scope boundary |
| NOTE-5 | note | — | `69c7cd0` (PR-FIN-1a) | usability decision |
| NOTE-6 | note | — | `a48ea7c` (PR-FIN-1b) | scope boundary; wiring in PR-FIN-1d (`5bc7a61`) |
| GAP-1 | gap | — | — | deferred; follow-up Pass |
| GAP-2 | gap | — | — | deferred; gobbi-rule update |
| GAP-3 | gap | — | — | deferred; issue #130 post-#119 |
