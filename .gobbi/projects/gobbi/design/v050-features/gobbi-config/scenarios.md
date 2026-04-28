# gobbi-config — Scenarios

Behaviour specifications for gobbi's unified three-level settings cascade. Covers default resolution, per-level overrides, deep-merge semantics, array replacement, null leaf values, migration, cross-field validation, CLI paths, and notify events semantics.

This file does NOT cover: the gobbi-memory tier wiring (`gobbi-memory.md`), notify dispatch wiring for `notify.triggers` (deferred to PR-FIN-1d), or five-step workflow orchestration (`deterministic-orchestration.md`). Every scenario has a stable ID in the `CFG-NN` or `HOOK-N` format — `rg 'CFG-\|HOOK-' .gobbi/projects/gobbi/design/v050-features/gobbi-config/` surfaces every reference. Test files: `packages/cli/src/__tests__/features/gobbi-config.test.ts` (CFG-*) and `packages/cli/src/__tests__/features/hook.test.ts` (HOOK-*).

See `README.md` for the feature overview.

---

## CLI — get

### CFG-1 — Cascade get — no `--level` returns session → project → workspace → default

**Given** `.gobbi/projects/<name>/sessions/{id}/settings.json` has `git.pr.open: true`
And `.gobbi/projects/<name>/settings.json` has `git.pr.open: false`
**When** `gobbi config get git.pr.open --session-id <id>` runs
**Then** output is `true` (session wins) and exit code is `0`

State trace:
- `resolveSettings` folds workspace → project → session left-to-right via `deepMerge`
- Session level sets `git.pr.open`; project level set it too but session is narrower and wins

Evidence:
- `packages/cli/src/lib/settings-io.ts` — `resolveSettings` fold order
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-1')`

---

### CFG-2 — Level-scoped get — `--level project` reads only project file

**Given** `.gobbi/projects/<name>/settings.json` has `notify.slack.enabled: true`
And `.gobbi/projects/<name>/sessions/{id}/settings.json` has `notify.slack.enabled: false`
**When** `gobbi config get notify.slack.enabled --level project` runs
**Then** output is `true` and exit code is `0`
And the session level value is NOT used

State trace:
- `--level project` calls `loadSettingsAtLevel(repoRoot, 'project')` — no cascade
- Key present at project level → exit 0

Evidence:
- `packages/cli/src/commands/config.ts` — `get` branch, `--level` path
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-2')`

---

### CFG-3 — Level-scoped get — key absent at level returns exit 1 even when default supplies value

**Given** `.gobbi/projects/<name>/settings.json` is empty (only `schemaVersion: 1`)
**When** `gobbi config get git.pr.open --level project` runs
**Then** exit code is `1` and stdout is empty

State trace:
- File loads successfully; key not present at this level
- Defaults apply only in cascade mode; `--level` is single-file, no default fallback

Evidence:
- `packages/cli/src/commands/config.ts` — `get` branch, key-not-found → exit 1
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-3')`

---

### CFG-4 — Cascade get — key absent at all levels returns default value (exit 0)

**Given** no `.gobbi/settings.json`, no `.gobbi/projects/<name>/settings.json`, no session settings
**When** `gobbi config get workflow.ideation.discuss.mode --session-id <id>` runs
**Then** exit code is `0` and output is `"user"` (the built-in default)

State trace:
- All three files absent → `resolveSettings` returns `DEFAULTS`
- Key present in defaults → exit 0

Evidence:
- `packages/cli/src/lib/settings.ts` — `DEFAULTS` contains `workflow.ideation.discuss.mode: 'user'`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-4')`

---

## CLI — set

### CFG-5 — Default-level set writes to session

**Given** `$CLAUDE_SESSION_ID=abc` is set in env
**When** `gobbi config set git.pr.open false` runs (no `--level`)
**Then** `.gobbi/projects/<name>/sessions/abc/settings.json` exists with `git.pr.open: false`
And exit code is `0`

State trace:
- No `--level` defaults to `session`
- Session path resolves via `$CLAUDE_SESSION_ID`
- Atomic write: temp file + rename

Evidence:
- `packages/cli/src/commands/config.ts` — `set` branch, default-level logic
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-5')`

---

### CFG-6 — Explicit-level set — `--level workspace` writes workspace file

**Given** `.gobbi/settings.json` does not exist
**When** `gobbi config set git.pr.open false --level workspace` runs
**Then** `.gobbi/settings.json` exists with `git.pr.open: false` and `schemaVersion: 1`
And exit code is `0`

State trace:
- `--level workspace` resolves to `.gobbi/settings.json`
- File absent → start from `{schemaVersion: 1}`; deep-path walk creates intermediate nodes
- AJV validates; atomic write succeeds

Evidence:
- `packages/cli/src/lib/settings-io.ts` — `writeSettingsAtLevel`, `loadSettingsAtLevel`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-6')`

---

### CFG-7 — Deep-path set — nested key created without clobbering siblings

**Given** `.gobbi/projects/<name>/settings.json` has `git: { baseBranch: 'main', pr: { open: true } }`
**When** `gobbi config set git.pr.draft true --level project` runs
**Then** `.gobbi/projects/<name>/settings.json` has `git.pr.draft: true`
And `git.baseBranch` is still `'main'` and `git.pr.open` is still `true`

State trace:
- Load existing project file; deep-path walk creates `git.pr.draft: true`
- Existing `git.baseBranch` and `git.pr.open` siblings survive — only the targeted leaf is written

Evidence:
- `packages/cli/src/commands/config.ts` — deep-path write via path-split + recursive record creation
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-7')`

---

### CFG-8 — Invalid key fails with exit 2

**Given** any level settings file
**When** `gobbi config set unknownSection.foo bar --level workspace` runs
**Then** exit code is `2` and stderr contains a validation error message
And the file is NOT modified

State trace:
- Deep-path write produces `{ schemaVersion: 1, unknownSection: { foo: 'bar' } }`
- AJV schema has `additionalProperties: false` at every object level — unknown key fails validation
- Exit 2; no write (write is post-validation)

Evidence:
- `packages/cli/src/lib/settings-validator.ts` — AJV `additionalProperties: false`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-8')`

---

## Cascade semantics

### CFG-9 — Arrays replace — narrower level array supersedes wider

**Given** `.gobbi/settings.json` has `notify.slack.events: ['workflow.start', 'workflow.complete']`
And `.gobbi/projects/<name>/sessions/{id}/settings.json` has `notify.slack.events: ['error']`
**When** `resolveSettings({ repoRoot, sessionId: <id> })` runs
**Then** resolved `notify.slack.events` is `['error']` — not `['workflow.start', 'workflow.complete', 'error']`

State trace:
- `deepMerge` array branch: overlay array replaces base array entirely; no append or dedup

Evidence:
- `packages/cli/src/lib/settings.ts` — `deepMerge` (array branch: overlay replaces)
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-9')`

---

### CFG-10 — `null` at narrower level is an explicit leaf

**Given** `.gobbi/settings.json` has `git.baseBranch: 'main'`
And `.gobbi/projects/<name>/settings.json` has `git.baseBranch: null`
**When** `resolveSettings({ repoRoot })` (no session) runs
**Then** resolved `git.baseBranch` is `null` — project's explicit null wins over workspace's `'main'`

State trace:
- `deepMerge` null-is-leaf branch: overlay `null` replaces base value
- `undefined`/absent would delegate; `null` is a definitive override

Evidence:
- `packages/cli/src/lib/settings.ts` — `deepMerge` null-is-leaf (overlay `=== null` → write null, don't recurse)
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-10')`

---

### CFG-11 — Cross-field check — user sets `pr.open=true` with null `baseBranch` → resolver error

**Given** `git.pr.open: true` is explicitly set by the user at any level (workspace / project / session)
And `git.baseBranch` resolves to `null` after cascade merge
**When** `resolveSettings({ repoRoot, sessionId })` runs
**Then** `ConfigCascadeError` is thrown with `code: 'parse'`
And the error does NOT carry a `tier` (violation is in the cascaded projection, not one level)

State trace:
- Cross-field check runs after cascade merge, not at single-file validation time
- Only fires when the user has explicitly set `pr.open=true` — DEFAULTS-only case (fresh repo) is exempt
- PR opening without a baseBranch is a misconfiguration the user must fix before PRs can open

Evidence:
- `packages/cli/src/lib/settings-io.ts` — `resolveSettings` cross-field check; `userPrOpen` variable tracks explicit user setting
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-11')`

---

### CFG-12 — `notify.events` inverted semantic — absent fires all, `[]` fires none

**Given** `.gobbi/projects/<name>/sessions/{id}/settings.json` has `notify.slack: { enabled: true }` (no `events` key)
**When** `resolveSettings` runs and notify dispatch checks Slack
**Then** Slack fires on ALL gobbi workflow events (absent `events` = all)
And if the session instead has `notify.slack: { enabled: true, events: [] }`, Slack fires on NO events

State trace:
- `lib/notify.ts` reads resolved `notify.slack.events` after `resolveSettings`
- Absent → `undefined` → treat as "all events"; `[]` → "no events" (inverted from naive interpretation)

Evidence:
- `packages/cli/src/lib/notify.ts` — dispatch logic checking `enabled` + events membership
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-12')`

---

## Migration

### CFG-13 — Legacy cleanup — `config.db` and `gobbi.json` deleted on first run

**Given** `.gobbi/config.db` exists (SQLite session store from pre-Pass-3)
And `.claude/gobbi.json` exists (pre-v0.5.0 session config)
**When** `ensureSettingsCascade(repoRoot)` runs (via `gobbi workflow init`)
**Then** `.gobbi/config.db` no longer exists
And `.claude/gobbi.json` no longer exists
And a log line is emitted for each deletion
And re-running `ensureSettingsCascade` is a no-op (files already absent)

State trace:
- Step 1: `existsSync('.gobbi/config.db')` → delete + log
- Step 2: `existsSync('.claude/gobbi.json')` → delete + log
- Idempotent: second run finds neither file; skips both steps silently

Evidence:
- `packages/cli/src/lib/ensure-settings-cascade.ts` — steps 1-2
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-13')`

---

### CFG-14 — T2-v1 upgrade — `project-config.json` migrated to `project/settings.json` (PR-FIN-1c shape)

**Given** `.gobbi/project-config.json` exists with `version: 1`, `git.mode: 'worktree-pr'`, `git.baseBranch: 'main'`, `eval.ideation: true`, `eval.plan: false`
And `.gobbi/projects/<name>/settings.json` does not exist
**When** `ensureSettingsCascade(repoRoot)` runs
**Then** `.gobbi/projects/<name>/settings.json` exists with:
  - `schemaVersion: 1`
  - `git.pr.open: true` (from `mode: 'worktree-pr'`) and `git.baseBranch: 'main'` (preserved)
  - `workflow.ideation.evaluate.mode: 'always'` (true → 'always') and `workflow.planning.evaluate.mode: 'ask'` (legacy `eval.plan` → new `workflow.planning`; false → 'ask')
  - No `trivialRange`, `verification.*`, `cost.*`, `ui.*`, `projects.*` fields
  - No `git.workflow`, `git.cleanup`, or `git.mode` fields
And `.gobbi/project-config.json` is left in place (idempotency guard prevents re-upgrading on subsequent runs).

State trace:
- Step 3 of `ensureSettingsCascade`: reads legacy JSON, calls `upgradeLegacyToSettings` (which calls `reshapeGit`), validates, atomic-write to new path
- The legacy file is intentionally NOT deleted — keeping it allows inspection of pre-upgrade settings; idempotency guard short-circuits if the new file already exists

Evidence:
- `packages/cli/src/lib/ensure-settings-cascade.ts` — step 3 upgrade logic, `upgradeLegacyToSettings`, `reshapeGit`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-14')`

---

### CFG-15 — Q2→evalConfig e2e — evaluate mode flows through to EVAL_DECIDE

**Given** session settings have `workflow.ideation.evaluate.mode: 'always'`
And `workflow.planning.evaluate.mode: 'ask'`
And `workflow.execution.evaluate.mode: 'skip'`
**When** `resolveEvalDecision(cascade, 'ideation')` is called
**Then** result is `{ enabled: true, source: 'always' }`
And `resolveEvalDecision(cascade, 'planning', { userAnswer: true })` is `{ enabled: true, source: 'ask' }`
And `resolveEvalDecision(cascade, 'execution')` is `{ enabled: false, source: 'skip' }`
And an EVAL_DECIDE event with `{ ideation: true, plan: true, execution: false }` advances the state machine

State trace:
- `resolveEvalDecision` exported from `settings-io.ts` does the enum→boolean translation
- The caller supplies `context.userAnswer` for `'ask'` mode or `context.orchestratorDecision` for `'auto'` mode
- EVAL_DECIDE event payload carries the resolved booleans; reducer stores in `state.evalConfig`

Evidence:
- `packages/cli/src/lib/settings-io.ts` — `resolveEvalDecision` export
- `packages/cli/src/__tests__/features/q2-evalconfig-e2e.test.ts` — 4×3 combinations

---

---

### CFG-16 — Cross-field check — fresh repo DEFAULTS do not trigger error (PR-FIN-1c)

**Given** no `.gobbi/settings.json`, no project settings, no session settings exist
**When** `resolveSettings({ repoRoot, sessionId })` runs
**Then** no `ConfigCascadeError` is thrown
And resolved `git.pr.open` is `true` (from DEFAULTS) and resolved `git.baseBranch` is `null` (from DEFAULTS)

State trace:
- DEFAULTS supply both `pr.open: true` and `baseBranch: null`
- Cross-field check only fires when the user has explicitly set `pr.open=true` in a file — DEFAULTS alone do not constitute an explicit user setting
- The `userOverlay` variable in `resolveSettings` is `null` → no user git settings → check is skipped

Evidence:
- `packages/cli/src/lib/settings-io.ts` — `userPrOpen` check (`userOverlay?.git?.pr?.open === true`)
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-16')`

---

### CFG-17 — Pass-3 current-shape in-place upgrade (PR-FIN-1c)

**Given** `.gobbi/projects/<name>/settings.json` exists with Pass-3 shape:
  - `git.workflow.mode: 'worktree-pr'`, `git.workflow.baseBranch: 'develop'`
  - `git.cleanup.worktree: true`, `git.cleanup.branch: true`
  - `projects: { active: 'myproject', known: ['myproject'] }`
And `.gobbi/settings.json` exists with `git.pr.draft: false` (Pass-3 shape without `projects`)
**When** `ensureSettingsCascade(repoRoot)` runs
**Then** `.gobbi/projects/<name>/settings.json` is rewritten in place with:
  - `git.pr.open: true` (from `mode: 'worktree-pr'`), `git.baseBranch: 'develop'`
  - `git.worktree.autoRemove: true` (from `cleanup.worktree`), `git.branch.autoRemove: true`
  - No `git.workflow`, `git.cleanup`, `git.mode`, or `projects` fields
And `.gobbi/settings.json` is rewritten with `git.pr.draft: false` under the new `git.pr` shape and without `projects`
And re-running `ensureSettingsCascade` is idempotent (upgraded files pass `needsCurrentShapeUpgrade` as `false`)

State trace:
- Step 4 of `ensureSettingsCascade`: `upgradeFileInPlace` calls `needsCurrentShapeUpgrade` (detects `git.workflow`) → `reshapeCurrentShape` → validate → atomic write
- Both workspace and project levels run through the same primitive
- Second run: `needsCurrentShapeUpgrade` returns `false` → files untouched

Evidence:
- `packages/cli/src/lib/ensure-settings-cascade.ts` — step 4, `upgradeFileInPlace`, `needsCurrentShapeUpgrade`, `reshapeCurrentShape`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-17')`

---

### CFG-18 — `gobbi project list` — filesystem scan replaces registry read (PR-FIN-1c)

**Given** `.gobbi/projects/` contains directories `alpha/` and `beta/`
And no `projects.known` entry exists in any settings file
**When** `gobbi project list` runs
**Then** `alpha` and `beta` are listed
And the current project (resolved from `basename(repoRoot)`) is indicated

State trace:
- `gobbi project list` reads `.gobbi/projects/` via `readdirSync` — no registry
- Active marker derived from `basename(repoRoot)` or `--project` flag, not from `projects.active`

Evidence:
- `packages/cli/src/commands/project/list.ts` — `readdirSync` path
- `packages/cli/src/__tests__/` — project list command tests

---

---

## CLI — init (PR-FIN-1a)

### CFG-19 — `gobbi config init --level workspace` seeds + refuses without `--force`

**Given** no `.gobbi/settings.json` exists
**When** `gobbi config init` runs (default level is `workspace`)
**Then** `.gobbi/settings.json` exists with content `{schemaVersion: 1}` and exit code is `0`
And stderr is empty

**Given** `.gobbi/settings.json` already exists with any content
**When** `gobbi config init --level workspace` runs (no `--force`)
**Then** exit code is `2` and stderr contains `settings.json already exists at` and `--force`
And the existing file is not modified

**Given** `.gobbi/settings.json` already exists
**When** `gobbi config init --level workspace --force` runs
**Then** exit code is `0` and `.gobbi/settings.json` content is `{schemaVersion: 1}` (minimum-valid seed)
And the prior content is overwritten

State trace:
- `runInit` resolves level to `workspace`; calls `writeSettingsAtLevel` with seed `{schemaVersion: 1}`
- File-existence check fires before write: if exists and no `--force` → stderr diagnostic + exit 2
- `--force` path calls `writeSettingsAtLevel` unconditionally after emitting the WARN line

Evidence:
- `packages/cli/src/commands/config.ts` — `runInit` verb, refuse-without-force branch
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-19')`

---

### CFG-20 — `gobbi config init --level project` resolves project via `--project` flag → `basename(repoRoot)`

**Given** no `.gobbi/projects/foo/settings.json` exists
**When** `gobbi config init --level project --project foo` runs
**Then** `.gobbi/projects/foo/settings.json` exists with content `{schemaVersion: 1}` and exit code is `0`
And stderr is empty

**Given** no `--project` flag is supplied
**When** `gobbi config init --level project` runs
**Then** project name resolves to `basename(repoRoot)` and `.gobbi/projects/<basename>/settings.json` is created

**Given** `.gobbi/projects/foo/settings.json` already exists
**When** `gobbi config init --level project --project foo` runs (no `--force`)
**Then** exit code is `2`, stderr contains `--force`, and the existing file is not modified

State trace:
- Project-name resolution: `--project <name>` flag → `basename(repoRoot)` — same ladder as `runSet`
- `writeSettingsAtLevel` creates intermediate directories if absent

Evidence:
- `packages/cli/src/commands/config.ts` — `runInit`, project resolution
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-20')`

---

### CFG-21 — `gobbi config init --level session` requires `--session-id` flag or `$CLAUDE_SESSION_ID` env

**Given** `--session-id sess-21` flag is provided
**When** `gobbi config init --level session --session-id sess-21` runs
**Then** `.gobbi/projects/<basename>/sessions/sess-21/settings.json` exists with `{schemaVersion: 1}` and exit code is `0`
And stderr is empty

**Given** no `--session-id` flag but `$CLAUDE_SESSION_ID=env-sess-21` is set
**When** `gobbi config init --level session` runs
**Then** `.gobbi/projects/<basename>/sessions/env-sess-21/settings.json` is created and exit code is `0`

**Given** neither `--session-id` flag nor `$CLAUDE_SESSION_ID` env is present
**When** `gobbi config init --level session` runs
**Then** exit code is `2` and stderr contains `requires CLAUDE_SESSION_ID env or --session-id`
And stderr contains `use --level workspace or --level project to bypass`

**Given** a session settings file already exists
**When** `gobbi config init --level session --session-id sess-force --force` runs
**Then** exit code is `0` and the file is overwritten with `{schemaVersion: 1}`

State trace:
- Session-id resolution: `--session-id` flag → `$CLAUDE_SESSION_ID` env → exit 2 with recovery hint
- Recovery hint text mirrors the hint added to `runGet`/`runSet` by #182

Evidence:
- `packages/cli/src/commands/config.ts` — `runInit`, session-id resolution branch
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-21')`

---

### CFG-22 — `--force` on existing file emits stderr WARN line; `--force` on absent file is silent

**Given** `.gobbi/settings.json` already exists
**When** `gobbi config init --level workspace --force` runs
**Then** exit code is `0` and stderr contains `WARN` and `overwriting existing settings.json`
And stderr contains the full path of the overwritten file and `--force`

**Given** `.gobbi/settings.json` does not exist
**When** `gobbi config init --level workspace --force` runs
**Then** exit code is `0` and stderr is empty (no WARN when nothing was overwritten)
And `.gobbi/settings.json` is created

State trace:
- `runInit` checks existence before writing: if file exists + `--force` → emit WARN to `process.stderr`, then write
- If file is absent + `--force` → no WARN, just write

Evidence:
- `packages/cli/src/commands/config.ts` — `runInit` WARN branch
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-22')`

---

### CFG-23 — Fresh-setup `config set --level session` + `workflow init` ordering invariant (#185 lock)

**Given** a fresh repo with no `.gobbi/` directory and `$CLAUDE_SESSION_ID=sess1`
**When** `gobbi config set workflow.ideation.evaluate.mode always --level session --session-id sess1` runs
**Then** `.gobbi/projects/<basename>/sessions/sess1/settings.json` exists with the written value
And exit code is `0`

**When** `gobbi workflow init --session-id sess1` subsequently runs
**Then** exit code is `0` and `metadata.projectName` in `.gobbi/projects/<basename>/sessions/sess1/metadata.json` equals `basename(repoRoot)`

**When** `gobbi config get workflow.ideation.evaluate.mode --level session --session-id sess1` runs
**Then** output is `"always"` — the value written before `workflow init` is preserved

State trace:
- Both `config set` and `workflow init` resolve project via `basename(repoRoot)` (post-PR-FIN-1c — no `projects.active` to diverge on)
- `ensureSettingsCascade` called by `workflow init` does NOT overwrite the pre-existing session file
- The ordering invariant holds because both commands land under the same `.gobbi/projects/<basename>/sessions/<id>/` slot

Evidence:
- `packages/cli/src/lib/settings-io.ts` — `writeSettingsAtLevel` project resolution
- `packages/cli/src/commands/workflow/init.ts` — `resolveProjectNameForInit`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-23')`

---

---

## CLI — config env (PR-FIN-1b)

### CFG-24 — `gobbi config env` stdin JSON only → writes 4 base `CLAUDE_*` vars

**Given** `$CLAUDE_ENV_FILE` points at a writable path
And `$CLAUDE_PROJECT_DIR`, `$CLAUDE_PLUGIN_ROOT`, `$CLAUDE_PLUGIN_DATA` are unset
**When** `runConfigEnv([], { session_id: 'sess-cfg-24', transcript_path: '/tmp/t.jsonl', cwd: '/tmp', hook_event_name: 'SessionStart' })` is called in-process
**Then** the env file is created containing exactly 4 lines:
  - `CLAUDE_SESSION_ID=sess-cfg-24`
  - `CLAUDE_TRANSCRIPT_PATH=/tmp/t.jsonl`
  - `CLAUDE_CWD=/tmp`
  - `CLAUDE_HOOK_EVENT_NAME=SessionStart`
And exit code is `0` and stderr is empty
And no `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, or `CLAUDE_PLUGIN_DATA` lines are written

State trace:
- Payload arrives via `payloadOverride` parameter (avoids stdin double-read)
- Native env passthrough: none of the three vars are set → no passthrough lines
- `agent_id`, `agent_type`, `permission_mode` absent in payload → no optional lines

Evidence:
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-24..28')` → `test('CFG-24')`

---

### CFG-25 — `gobbi config env` stdin JSON + native env passthrough → all 10 vars

**Given** `$CLAUDE_ENV_FILE` points at a writable path
And `$CLAUDE_PROJECT_DIR=/repo/cfg-25`, `$CLAUDE_PLUGIN_ROOT=/plugin/root-25`, `$CLAUDE_PLUGIN_DATA=/plugin/data-25` are set
**When** `runConfigEnv([], { session_id, transcript_path, cwd, hook_event_name, agent_id: 'agent-cfg-25', agent_type: 'subagent', permission_mode: 'allow' })` is called
**Then** the env file contains all 10 lines:
  - 7 from stdin JSON (4 core + `CLAUDE_AGENT_ID`, `CLAUDE_AGENT_TYPE`, `CLAUDE_PERMISSION_MODE`)
  - 3 native passthrough (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA`)
And exit code is `0` and stderr is empty

State trace:
- Optional fields `agent_id`, `agent_type`, `permission_mode` present in payload → written
- All three native passthrough vars are set → all three passthrough lines written
- File written atomically via temp+rename

Evidence:
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `test('CFG-25')`

---

### CFG-26 — `gobbi config env` with TTY (no stdin, no payload override) → silent exit 0

**Given** `$CLAUDE_ENV_FILE` points at a path (or not)
And no `payloadOverride` argument is passed
And `process.stdin.isTTY === true` (bun:test runtime condition)
**When** `runConfigEnv([])` is called (no second argument)
**Then** exit code is `0` and stdout is empty and stderr is empty
And the env file is NOT created or modified

State trace:
- `readStdinJson` detects TTY → returns null
- No payload → nothing to write; function returns silently
- TTY detection prevents blocking indefinitely on stdin in non-hook contexts

Evidence:
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `test('CFG-26')`

---

### CFG-27 — `gobbi config env` with `$CLAUDE_ENV_FILE` unset → stderr WARN, exit 0

**Given** `$CLAUDE_ENV_FILE` is unset (invoked outside a hook or misconfigured)
**When** `runConfigEnv([], { session_id: 'sess-cfg-27', hook_event_name: 'SessionStart' })` is called
**Then** exit code is `0` and stdout is empty
And stderr contains `WARN` and `$CLAUDE_ENV_FILE not set`
And no file is created

State trace:
- `$CLAUDE_ENV_FILE` env var absent → emit WARN, return 0 (non-blocking contract for hook callers)
- Hooks must not block Claude Code — even on misconfiguration, exit 0 is required

Evidence:
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `test('CFG-27')`

---

### CFG-28 — `gobbi config env` repeat invocation → idempotent, no duplication

**Given** the env file already contains `CLAUDE_SESSION_ID=sess-A` and `CLAUDE_HOOK_EVENT_NAME=SessionStart` and `CLAUDE_CWD=/cwd-1`
**When** `runConfigEnv([], { session_id: 'sess-B', transcript_path: '/tmp/replay.jsonl', hook_event_name: 'SubagentStop', cwd: '/cwd-2' })` is called
**Then** `CLAUDE_SESSION_ID` line is overwritten (now `sess-B`) — not duplicated
And `CLAUDE_TRANSCRIPT_PATH=/tmp/replay.jsonl` is appended (new key not present in first write)
And `CLAUDE_SESSION_ID=` appears exactly once in the file
And exit code is `0`

State trace:
- Upsert: for each key to write, scan existing lines; if found, replace in-place; if not, append
- Line-position-stable upsert: other tools' lines keep their position; only managed keys are touched
- Repeat invocation with changed `session_id` → overwrite, not duplicate

Evidence:
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `test('CFG-28')`

---

## Hook namespace (PR-FIN-1b)

### HOOK-1 — `gobbi hook session-start` chains config env + workflow init

**Given** `$CLAUDE_ENV_FILE` points at a writable path
And `$CLAUDE_SESSION_ID=hook-1-sess` is in env (simulating post-env-file-source state in bun:test where stdin is TTY)
**When** `runHookSessionStart([])` is called
**Then** exit code is `0` (hook contract — never exit non-zero)
And the session directory `.gobbi/projects/<basename>/sessions/hook-1-sess/` is created
And `metadata.json` in that directory has `sessionId === 'hook-1-sess'` and `projectName === basename(repo)`

State trace:
- `readStdinJson` returns null (TTY) → empty payload → no stdin-derived env vars written
- `process.env.CLAUDE_SESSION_ID` is already set → `gobbi workflow init`'s env fallback resolves session id
- `gobbi workflow init` (in-process via `runInitWithOptions`) runs `ensureSettingsCascade` and creates session dir

Evidence:
- `packages/cli/src/__tests__/features/hook.test.ts` — `describe('HOOK-1')` → `test('HOOK-1')`

---

### HOOK-2 — `gobbi hook pre-tool-use` invokes workflow guard, fail-open

**Given** a scratch repo with no session directory (guard has no session to load)
**When** `runHookPreToolUse([])` is called (no stdin payload — TTY)
**Then** exit code is `0`
And stdout contains `"hookEventName":"PreToolUse"` and `"permissionDecision":"allow"` (guard's fail-open JSON)

State trace:
- Guard resolves session dir → null (no session) → `emitAllow()` fail-open default
- `pre-tool-use` exit code matches guard's exit semantics (fail-open means exit 0 + allow JSON)

Evidence:
- `packages/cli/src/__tests__/features/hook.test.ts` — `describe('HOOK-2')` → `test('HOOK-2')`

---

### HOOK-3 — generic stub `gobbi hook session-end` reads stdin, exits 0 silently

**Given** `$CLAUDE_ENV_FILE` points at a path (to confirm it is not written to)
**When** `runHookSessionEnd([])` is called (stub handler)
**Then** exit code is `0` and stdout is empty and stderr is empty
And the env file is NOT created (stub does not write anything — notify dispatch deferred to PR-FIN-1d)

State trace:
- `runGenericHookStub('SessionEnd')` called via the shared `_stub.ts` helper
- Reads stdin (null on TTY), does nothing with it, returns without process.exit
- TODO(PR-FIN-1d) marker in stub body: notify dispatch not yet wired

Evidence:
- `packages/cli/src/__tests__/features/hook.test.ts` — `describe('HOOK-3')` → `test('HOOK-3')`

---

### HOOK-4 — unknown subcommand → exit 1 + help text

**Given** any environment
**When** `runHook(['bogus'])` is called
**Then** exit code is `1`
And stderr contains `Unknown subcommand: bogus`
And stderr contains `session-start` (help text rendered to stderr on unknown subcommand)

State trace:
- Dispatcher looks up `'bogus'` in `HOOK_COMMANDS` registry → not found
- Writes help text + error message to `process.stderr`; calls `process.exit(1)`

Evidence:
- `packages/cli/src/__tests__/features/hook.test.ts` — `describe('HOOK-4')` → `test('HOOK-4')`

---

### HOOK-5 — `gobbi hook --help` lists all 28 registered subcommands

**Given** any environment
**When** `runHookWithRegistry(['--help'], HOOK_COMMANDS)` is called
**Then** exit code is `0`
And `HOOK_COMMANDS` has exactly 28 entries
And stdout contains every command name from the registry (all 28 kebab-case event names)

State trace:
- `--help` branch renders help from the `HOOK_COMMANDS` registry via `console.log`
- Verifies the registry itself has the correct count (28) before checking names

Evidence:
- `packages/cli/src/__tests__/features/hook.test.ts` — `describe('HOOK-5')` → `test('HOOK-5')`

---

### HOOK-6 — End-to-end: SessionStart payload → env file + session dir

**Given** `$CLAUDE_ENV_FILE` points at a writable path
And `$CLAUDE_PROJECT_DIR=<repo>` is set in env
And `$CLAUDE_SESSION_ID=hook-6-sess` is set (simulating env sourcing in bun:test TTY context)
**When** `runHookSessionStart([])` is called
**Then** exit code is `0`
And stderr does NOT contain `gobbi hook session-start:` (no hook-level error)
And the env file exists and contains `CLAUDE_PROJECT_DIR=<repo>\n` (native passthrough written)
And `metadata.json` exists at `.gobbi/projects/<basename>/sessions/hook-6-sess/metadata.json`
And `metadata.sessionId === 'hook-6-sess'`

State trace:
- `runConfigEnv` writes `CLAUDE_PROJECT_DIR` (set in env) and any other native passthrough vars
- `runInitWithOptions` reads `CLAUDE_SESSION_ID` from env (set above) → creates session dir
- `ensureSettingsCascade` runs silently (may emit info lines to stderr; those are expected)
- Hook exits 0 — never throws or calls process.exit with non-zero

Evidence:
- `packages/cli/src/__tests__/features/hook.test.ts` — `describe('HOOK-6')` → `test('HOOK-6')`

---

See `README.md` for the prose overview. `checklist.md` turns each scenario ID into ISTQB-tagged verifiable items; `review.md` reports Pass-3 DRIFT/NOTE/GAP findings with pinned commit SHAs.
