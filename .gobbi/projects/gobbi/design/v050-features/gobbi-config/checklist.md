# gobbi-config — Verification Checklist

Verification harness for the scenarios in `scenarios.md`. Items are grouped by scenario ID so every check traces directly to the scenario it validates. Each item carries an ISTQB technique tag: `[EP]` equivalence partition, `[BVA]` boundary value, `[DT]` decision table, `[ST]` state transition, `[MANUAL]` manual, `[GAP]` aspirational behaviour not yet shipped.

All items target behaviour shipped in Pass 3 (Wave B–D, SHAs cited in `review.md`), PR-FIN-1c (commits `362217c` + `954f889`), PR-FIN-1a (commit `6909fec`), and PR-FIN-1b (commits `2248b72` + `b307214`).

---

## CFG-1 — Cascade get — session wins

- [ST] `gobbi config get git.pr.open` with session set to `true` and project set to `false` returns `true` and exit 0.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-1'`
- [ST] Without `--session-id`, the session level is skipped and project value wins.
  - Verify: CFG-1 variant in test file asserting project-level wins when no session

---

## CFG-2 — Level-scoped get — `--level project`

- [EP] `--level project` with key present at project level returns that value and exit 0.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-2'`
- [EP] `--level project` does NOT apply session-level values even if session-id is provided.
  - Verify: CFG-2 test asserts `notify.slack.enabled === true` (project) not `false` (session)

---

## CFG-3 — Level-scoped get — absent key returns exit 1

- [EP] Key absent at `--level project` returns exit 1 even when default supplies a value.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-3'`
- [BVA] Stdout is empty on exit 1 — no partial output, no error message printed to stdout.
  - Verify: CFG-3 test asserts stdout is empty string and exit code is 1

---

## CFG-4 — Cascade get — defaults apply when all levels absent

- [EP] No `.gobbi/` files at all → `workflow.ideation.discuss.mode` returns `"user"` (from `DEFAULTS`), exit 0.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-4'`
- [ST] `DEFAULTS` in `settings.ts` covers all workflow, notify, and git sections — no key in the defaults tree returns exit 1 via cascade-get.
  - Verify: `rg -n 'DEFAULTS' packages/cli/src/lib/settings.ts` — inspect full defaults object

---

## CFG-5 — Set default level writes session

- [EP] `gobbi config set git.pr.open false` (no `--level`) writes to `.gobbi/projects/<name>/sessions/{id}/settings.json`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-5'`
- [ST] Session file uses atomic write (temp+rename) — partial write cannot corrupt the file.
  - Verify: `rg -n 'renameSync\|writeFileSync.*tmp' packages/cli/src/lib/settings-io.ts`

---

## CFG-6 — Set explicit level writes workspace

- [EP] `--level workspace` creates `.gobbi/settings.json` when absent, with `schemaVersion: 1` and the set key.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-6'`
- [EP] `--level project` writes to `.gobbi/projects/<name>/settings.json`.
  - Verify: CFG-6 variant test for project level

---

## CFG-7 — Deep-path set preserves siblings

- [EP] Writing `git.pr.draft` does not overwrite `git.baseBranch` or `git.pr.open`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-7'`
- [BVA] Three-level nesting (`workflow.ideation.discuss.mode`) creates all intermediate nodes without touching other keys at each node level.
  - Verify: CFG-7 extended case in test file checking `workflow.ideation.discuss.mode` deep write

---

## CFG-8 — Invalid key fails with exit 2

- [EP] Unknown top-level section (e.g., `unknownSection.foo`) fails AJV validation; exit 2; file not modified.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-8'`
- [EP] Legacy field (e.g., `git.workflow.mode`) is rejected by the new AJV schema; exit 2.
  - Verify: CFG-8 variant testing that legacy `git.workflow` path is rejected post-PR-FIN-1c
- [DT] AJV `additionalProperties: false` fires at every object level — nested unknown keys also rejected.
  - Verify: `rg -n 'additionalProperties' packages/cli/src/lib/settings-validator.ts`

---

## CFG-9 — Arrays replace

- [EP] Session-level `notify.slack.events: ['error']` fully replaces workspace-level `['workflow.start', 'workflow.complete']` — no merge.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-9'`
- [ST] `deepMerge` in `settings.ts` — when overlay value `Array.isArray()`, it replaces (not appends).
  - Verify: `rg -n 'isArray\|Array.is' packages/cli/src/lib/settings.ts` confirms array-replace branch

---

## CFG-10 — `null` is explicit leaf

- [EP] Project-level `git.baseBranch: null` overrides workspace-level `'main'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-10'`
- [BVA] `undefined` / absent key does NOT override — only `null` is an explicit leaf.
  - Verify: CFG-10 test includes a case with absent project key asserting workspace value survives

---

## CFG-11 — Cross-field check (PR-FIN-1c)

- [EP] User explicitly sets `pr.open: true` at any level AND `baseBranch` resolves to `null` → `ConfigCascadeError` thrown, `code === 'parse'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-11'`
- [EP] User sets `pr.open: true` AND `baseBranch: 'main'` → resolves cleanly, no error.
  - Verify: CFG-11 happy-path variant in test file
- [DT] `ConfigCascadeError` thrown by CFG-11 does NOT carry a `tier` — violation is in the cascaded projection, not attributable to one level.
  - Verify: CFG-11 test asserts `err.tier === undefined`

---

## CFG-12 — `notify.events` inverted semantic

- [EP] `enabled: true` with no `events` key → dispatch fires on all gobbi workflow events.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-12'`
- [EP] `enabled: true` with `events: []` → dispatch fires on NO events.
  - Verify: CFG-12 variant with empty array asserting no dispatch calls
- [EP] `enabled: true` with `events: ['error']` → dispatch fires only on `error` event.
  - Verify: CFG-12 variant with single-event array
- [DT] `enabled: false` → no dispatch regardless of `events` value.
  - Verify: CFG-12 variant with `enabled: false` + populated `events` → no dispatch

---

## CFG-13 — Legacy cleanup

- [EP] `config.db` present → deleted by `ensureSettingsCascade`; no error thrown.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-13'`
- [EP] `.claude/gobbi.json` present → deleted; no error thrown.
  - Verify: CFG-13 test asserts both paths absent after run
- [EP] `ensureSettingsCascade` idempotent — second run with files already absent completes without error.
  - Verify: CFG-13 test runs `ensureSettingsCascade` twice and asserts no throw on second run

---

## CFG-14 — T2-v1 upgrade (PR-FIN-1c shape)

- [EP] Legacy `project-config.json` with `git.mode: 'worktree-pr'` + `git.baseBranch: 'main'` is upgraded: `git.pr.open: true`, `git.baseBranch: 'main'` preserved; `trivialRange`, `verification.*`, `cost.*`, `projects.*` dropped; no `git.workflow` or `git.cleanup` in output.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-14'`
- [DT] `git.mode === 'direct-commit'` → `git.pr.open: false`; `git.mode === 'worktree-pr'` or `'auto'` → `git.pr.open: true`.
  - Verify: CFG-14 test covers all three mode values
- [DT] Boolean `eval.*: true` → `'always'`; boolean `eval.*: false` → `'ask'`. Both cases covered.
  - Verify: CFG-14 test asserts `workflow.ideation.evaluate.mode === 'always'` and `workflow.planning.evaluate.mode === 'ask'`
- [EP] After upgrade, `.gobbi/projects/<name>/settings.json` is present with `schemaVersion: 1` and no legacy fields.
  - Verify: CFG-14 test asserts target file has no `git.workflow`, `git.cleanup`, or `projects` keys
- [EP] `ensureSettingsCascade` idempotent when target already exists — upgrade does NOT run twice.
  - Verify: CFG-14 idempotency case in test file

---

## CFG-15 — Q2→evalConfig e2e

- [EP] `evaluate.mode: 'always'` → `resolveEvalDecision` returns `{ enabled: true, source: 'always' }` without any context parameter.
  - Verify: `bun test packages/cli/src/__tests__/features/q2-evalconfig-e2e.test.ts -t 'always'`
- [EP] `evaluate.mode: 'skip'` → returns `{ enabled: false, source: 'skip' }`.
  - Verify: q2-evalconfig-e2e test — `skip` variant
- [EP] `evaluate.mode: 'ask'` with `context.userAnswer: true` → `{ enabled: true, source: 'ask' }`.
  - Verify: q2-evalconfig-e2e test — `ask`+true variant
- [EP] `evaluate.mode: 'ask'` without `context.userAnswer` → throws (caller contract).
  - Verify: q2-evalconfig-e2e test — `ask`+no-context error variant
- [EP] `evaluate.mode: 'auto'` with `context.orchestratorDecision: false` → `{ enabled: false, source: 'auto' }`.
  - Verify: q2-evalconfig-e2e test — `auto`+false variant
- [DT] All 4 modes × 3 steps (ideation/plan/execution) — 12 combinations covered in the e2e test.
  - Verify: `grep -c 'CFG-' packages/cli/src/__tests__/features/q2-evalconfig-e2e.test.ts` returns at least 12
- [ST] EVAL_DECIDE event with resolved booleans advances reducer; `state.evalConfig` reflects all three step values.
  - Verify: q2-evalconfig-e2e test asserts reducer state post-EVAL_DECIDE

---

---

## CFG-16 — Fresh repo DEFAULTS do not trigger cross-field error (PR-FIN-1c)

- [EP] No user settings files at all → `resolveSettings` returns DEFAULTS (`pr.open: true`, `baseBranch: null`) without throwing.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-16'`
- [BVA] The check is gated on `userOverlay?.git?.pr?.open === true` — when `userOverlay` is `null`, the gate is never entered.
  - Verify: CFG-16 test confirms no error when userOverlay is null (all levels absent)

---

## CFG-17 — Pass-3 current-shape in-place upgrade (PR-FIN-1c)

- [EP] Project settings file with `git.workflow.mode`, `git.cleanup.*`, `projects.*` fields is upgraded in place: output has `git.pr.open`, `git.worktree.autoRemove`, `git.branch.autoRemove`; no `git.workflow`, `git.cleanup`, or `projects` keys.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-17'`
- [EP] Workspace settings file with Pass-3 shape is upgraded in place by the same `upgradeFileInPlace` path.
  - Verify: CFG-17 workspace variant in test file
- [ST] `needsCurrentShapeUpgrade` returns `false` after upgrade — second `ensureSettingsCascade` run is a no-op.
  - Verify: CFG-17 idempotency case in test file
- [DT] `projects.active`/`projects.known` fields are silently dropped during upgrade; no validation error.
  - Verify: CFG-17 test fixture includes `projects.*` and asserts they are absent in output

---

## CFG-18 — `gobbi project list` — filesystem scan (PR-FIN-1c)

- [EP] `gobbi project list` reads `.gobbi/projects/` via filesystem; lists all project directories regardless of settings file content.
  - Verify: `bun test packages/cli/src/__tests__/` — project list command test
- [EP] No `projects.known` or `projects.active` entry needed — directories are the source of truth.
  - Verify: CFG-18 test confirms output without any settings.json `projects` block
- [ST] Current project (from `basename(repoRoot)` or `--project` flag) is indicated in list output.
  - Verify: CFG-18 test asserts active indicator on correct entry

---

## CFG-19 — `gobbi config init --level workspace` (PR-FIN-1a)

- [EP] `gobbi config init` (no `--level`) writes `{schemaVersion: 1}` to `.gobbi/settings.json`; exit 0; stderr empty.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-19'`
- [EP] `gobbi config init --level workspace` with existing file: exit 2; stderr contains `settings.json already exists at` and `--force`; file not modified.
  - Verify: CFG-19c test asserts exit 2 and file content unchanged
- [EP] `gobbi config init --level workspace --force` with existing file: exit 0; file overwritten with `{schemaVersion: 1}`.
  - Verify: CFG-19d test asserts overwrite and minimum-valid content
- [BVA] Seed is exactly `{schemaVersion: 1}` — no other keys written.
  - Verify: CFG-19a test asserts `toEqual({ schemaVersion: 1 })`

---

## CFG-20 — `gobbi config init --level project` (PR-FIN-1a)

- [EP] `gobbi config init --level project --project foo` creates `.gobbi/projects/foo/settings.json` with `{schemaVersion: 1}`; exit 0; stderr empty.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-20'`
- [EP] Without `--project` flag, project name falls back to `basename(repoRoot)`.
  - Verify: CFG-20b test asserts file exists at `.gobbi/projects/<basename>/settings.json`
- [EP] Existing project file without `--force`: exit 2; stderr contains `--force`; file not modified.
  - Verify: CFG-20c test asserts exit 2 and file unchanged
- [ST] `--project` flag takes priority over `basename(repoRoot)` — consistent with `runSet` resolution.
  - Verify: CFG-20a and CFG-20b together confirm both branches

---

## CFG-21 — `gobbi config init --level session` (PR-FIN-1a)

- [EP] `--session-id sess-21` seeds `.gobbi/projects/<basename>/sessions/sess-21/settings.json`; exit 0; stderr empty.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-21'`
- [EP] `$CLAUDE_SESSION_ID=env-sess-21` (no flag) seeds the env-supplied path; exit 0.
  - Verify: CFG-21b test confirms env-based session id
- [EP] Neither flag nor env: exit 2; stderr contains `requires CLAUDE_SESSION_ID env or --session-id` and `use --level workspace or --level project to bypass`.
  - Verify: CFG-21c test asserts exit 2 and both recovery hint fragments
- [EP] `--force` with existing session file: exit 0; file overwritten with minimum-valid seed.
  - Verify: CFG-21d test asserts `{schemaVersion: 1}` after overwrite
- [DT] Session-id resolution: `--session-id` flag → `$CLAUDE_SESSION_ID` env → exit 2. Flag takes priority when both present.
  - Verify: CFG-21a and CFG-21b confirm the two happy-path branches; CFG-21c confirms the error branch

---

## CFG-22 — `--force` WARN on overwrite (PR-FIN-1a)

- [EP] `--force` on existing file emits stderr line containing `WARN`, `overwriting existing settings.json`, the full file path, and `--force`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-22'`
- [EP] `--force` on absent file is silent — no WARN emitted; stderr is empty string.
  - Verify: CFG-22b test asserts `captured.stderr === ''`
- [BVA] WARN fires ONLY when the file existed before the overwrite — not on fresh creates.
  - Verify: CFG-22a (overwrite) and CFG-22b (fresh) distinguish the WARN condition

---

## CFG-23 — Fresh-setup ordering invariant (#185 lock) (PR-FIN-1a)

- [ST] Pre-init `config set --level session` + `workflow init` land under the same `.gobbi/projects/<basename>/sessions/<id>/` slot; `config get` returns the pre-init value after `workflow init`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-23'`
- [ST] `metadata.projectName` in the session directory equals `basename(repoRoot)` — confirming `workflow init` resolved the same project as `config set`.
  - Verify: CFG-23 test asserts `meta.projectName === basename(repo)`
- [EP] `ensureSettingsCascade` called by `workflow init` does NOT overwrite a pre-existing session file — the pre-init value survives.
  - Verify: CFG-23 final step asserts `workflow.ideation.evaluate.mode === 'always'` after `workflow init`

---

---

## CFG-24 — `gobbi config env` stdin JSON only (PR-FIN-1b)

- [EP] Payload with `session_id`, `transcript_path`, `cwd`, `hook_event_name` and no native passthrough vars → env file contains exactly those 4 `CLAUDE_*` lines; exit 0; stderr empty.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-24'`
- [EP] No `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, or `CLAUDE_PLUGIN_DATA` lines appear in env file when native vars are unset.
  - Verify: CFG-24 test asserts `body.not.toContain('CLAUDE_PROJECT_DIR=')`

---

## CFG-25 — `gobbi config env` stdin JSON + native env passthrough (PR-FIN-1b)

- [EP] Payload with all 7 stdin fields + all 3 native vars set → env file contains all 10 `CLAUDE_*` lines; exit 0; stderr empty.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-25'`
- [EP] Optional stdin fields (`agent_id`, `agent_type`, `permission_mode`) present in payload → `CLAUDE_AGENT_ID`, `CLAUDE_AGENT_TYPE`, `CLAUDE_PERMISSION_MODE` lines written.
  - Verify: CFG-25 test asserts all 3 optional lines present

---

## CFG-26 — `gobbi config env` TTY silent exit (PR-FIN-1b)

- [EP] TTY stdin (no payload override) → exit 0; stdout empty; stderr empty; env file not created.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-26'`
- [BVA] `existsSync(envFile) === false` after TTY invocation — confirms no write side-effects.
  - Verify: CFG-26 test asserts `existsSync(envFile) === false`

---

## CFG-27 — `gobbi config env` `$CLAUDE_ENV_FILE` unset (PR-FIN-1b)

- [EP] `$CLAUDE_ENV_FILE` unset → stderr contains `WARN` and `$CLAUDE_ENV_FILE not set`; exit 0; stdout empty.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-27'`
- [EP] Non-zero exit does NOT occur — hook callers must always see exit 0.
  - Verify: CFG-27 test asserts `captured.exitCode === null` (no process.exit call)

---

## CFG-28 — `gobbi config env` idempotency (PR-FIN-1b)

- [EP] Second invocation with changed `session_id` → `CLAUDE_SESSION_ID=` line overwritten; no duplication; `CLAUDE_SESSION_ID=` appears exactly once.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-28'`
- [EP] New key present in second invocation but not first → appended at end of file.
  - Verify: CFG-28 test confirms `CLAUDE_TRANSCRIPT_PATH` appears after second invocation
- [ST] File content after two invocations: only managed keys are overwritten; unmanaged lines from other tools (if any) survive.
  - Verify: CFG-28 test design confirms position-stable upsert behaviour

---

## HOOK-1 — session-start chains config env + workflow init (PR-FIN-1b)

- [ST] `runHookSessionStart([])` with `$CLAUDE_SESSION_ID` in env → session directory created under `.gobbi/projects/<basename>/sessions/hook-1-sess/`; `session.json` exists.
  - Verify: `bun test packages/cli/src/__tests__/features/hook.test.ts -t 'HOOK-1'`
- [ST] `session.json` fields: `sessionId === 'hook-1-sess'` and `projectId === basename(repo)`.
  - Verify: HOOK-1 test asserts both fields
- [EP] Hook exit code is `null` (no `process.exit` call) — hooks must not block Claude Code.
  - Verify: HOOK-1 test asserts `captured.exitCode === null`

---

## HOOK-2 — pre-tool-use chains workflow guard (PR-FIN-1b)

- [EP] `runHookPreToolUse([])` with no session dir (no session to load) → guard fail-open; stdout contains `"hookEventName":"PreToolUse"` and `"permissionDecision":"allow"`.
  - Verify: `bun test packages/cli/src/__tests__/features/hook.test.ts -t 'HOOK-2'`
- [EP] Exit code is `null` — guard's fail-open path exits 0 naturally.
  - Verify: HOOK-2 test asserts `captured.exitCode === null`

---

## HOOK-3 — generic stub session-end (PR-FIN-1b)

- [EP] `runHookSessionEnd([])` → exit 0; stdout empty; stderr empty; env file NOT created.
  - Verify: `bun test packages/cli/src/__tests__/features/hook.test.ts -t 'HOOK-3'`
- [EP] No file writes occur — confirms stub does not write env file or session dir.
  - Verify: HOOK-3 test asserts `existsSync(envFile) === false`

---

## HOOK-4 — unknown subcommand exit 1 (PR-FIN-1b)

- [EP] `runHook(['bogus'])` → exit 1; stderr contains `Unknown subcommand: bogus`; help text in stderr contains `session-start`.
  - Verify: `bun test packages/cli/src/__tests__/features/hook.test.ts -t 'HOOK-4'`
- [BVA] Unknown subcommand name does NOT match any of the 28 registered events — confirms registry lookup is exact.
  - Verify: HOOK-4 test asserts `captured.exitCode === 1`

---

## HOOK-5 — `--help` lists all 28 subcommands (PR-FIN-1b)

- [EP] `runHookWithRegistry(['--help'], HOOK_COMMANDS)` → exit 0; `HOOK_COMMANDS.length === 28`; stdout contains every registered command name.
  - Verify: `bun test packages/cli/src/__tests__/features/hook.test.ts -t 'HOOK-5'`
- [BVA] Registry count is exactly 28 — one entry per Claude Code hook event.
  - Verify: HOOK-5 test asserts `toHaveLength(28)` on `HOOK_COMMANDS`

---

## HOOK-6 — end-to-end SessionStart (PR-FIN-1b)

- [ST] `runHookSessionStart([])` with `$CLAUDE_PROJECT_DIR` and `$CLAUDE_SESSION_ID` set → env file contains `CLAUDE_PROJECT_DIR` line; session dir with `session.json` created; `session.sessionId === 'hook-6-sess'`.
  - Verify: `bun test packages/cli/src/__tests__/features/hook.test.ts -t 'HOOK-6'`
- [EP] stderr does NOT contain `gobbi hook session-start:` — no hook-level error message.
  - Verify: HOOK-6 test asserts `captured.stderr.not.toContain('gobbi hook session-start:')`
- [ST] Exit code is `null` — the full session-start chain (config env + workflow init) completes without calling `process.exit`.
  - Verify: HOOK-6 test asserts `captured.exitCode === null`

---

## Verification procedure

1. `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts` — exercises CFG-1 through CFG-28
2. `bun test packages/cli/src/__tests__/features/hook.test.ts` — exercises HOOK-1 through HOOK-6
3. `bun test packages/cli/src/__tests__/features/q2-evalconfig-e2e.test.ts` — exercises CFG-15 (4×3 matrix)
4. `bun test packages/cli/src/__tests__/` — exercises CFG-18 (project list)
5. For structural items, use the grep hints in each section to confirm cited code patterns exist
6. `[GAP]` items represent aspirational behaviour — no items are GAP in Pass 3, PR-FIN-1c, PR-FIN-1a, or PR-FIN-1b

See `scenarios.md` for full Given/When/Then bodies and `review.md` for DRIFT/NOTE/GAP resolutions.
