# gobbi-config — Scenarios

Behaviour specifications for gobbi's unified three-level settings cascade. Covers default resolution, per-level overrides, deep-merge semantics, array replacement, null leaf values, migration, cross-field validation, CLI paths, and notify events semantics.

This file does NOT cover: the gobbi-memory tier wiring (`gobbi-memory.md`), the hook registration for `notify.triggers` (schema-only in Pass 3), or five-step workflow orchestration (`deterministic-orchestration.md`). Every scenario has a stable ID in the `CFG-NN` format — `rg 'CFG-' .gobbi/projects/gobbi/design/v050-features/gobbi-config/` surfaces every reference. Test file: `packages/cli/src/__tests__/features/gobbi-config.test.ts`.

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

### CFG-4 — Cascade get — key absent at all levels returns exit 1

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

See `README.md` for the prose overview. `checklist.md` turns each scenario ID into ISTQB-tagged verifiable items; `review.md` reports Pass-3 DRIFT/NOTE/GAP findings with pinned commit SHAs.
