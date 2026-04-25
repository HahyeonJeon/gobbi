# gobbi-config — Scenarios

Behaviour specifications for gobbi's unified three-level settings cascade. Covers default resolution, per-level overrides, deep-merge semantics, array replacement, null leaf values, migration, cross-field validation, CLI paths, and notify events semantics.

This file does NOT cover: the gobbi-memory tier wiring (`gobbi-memory.md`), the hook registration for `notify.triggers` (schema-only in Pass 3), or five-step workflow orchestration (`deterministic-orchestration.md`). Every scenario has a stable ID in the `CFG-NN` format — `rg 'CFG-' .gobbi/projects/gobbi/design/v050-features/gobbi-config/` surfaces every reference. Test file: `packages/cli/src/__tests__/features/gobbi-config.test.ts`.

See `README.md` for the feature overview.

---

## CLI — get

### CFG-1 — Cascade get — no `--level` returns session → project → workspace → default

**Given** `.gobbi/projects/<name>/sessions/{id}/settings.json` has `git.workflow.mode: 'worktree-pr'`
And `.gobbi/project/settings.json` has `git.workflow.mode: 'direct-commit'`
**When** `gobbi config get git.workflow.mode --session-id <id>` runs
**Then** output is `"worktree-pr"` (session wins) and exit code is `0`

State trace:
- `resolveSettings` folds workspace → project → session left-to-right via `deepMerge`
- Session level sets `git.workflow.mode`; project level set it too but session is narrower and wins

Evidence:
- `packages/cli/src/lib/settings-io.ts` — `resolveSettings` fold order
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-1')`

---

### CFG-2 — Level-scoped get — `--level project` reads only project file

**Given** `.gobbi/project/settings.json` has `notify.slack.enabled: true`
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

**Given** `.gobbi/project/settings.json` is empty (only `schemaVersion: 1`)
**When** `gobbi config get git.workflow.mode --level project` runs
**Then** exit code is `1` and stdout is empty

State trace:
- File loads successfully; key not present at this level
- Defaults apply only in cascade mode; `--level` is single-file, no default fallback

Evidence:
- `packages/cli/src/commands/config.ts` — `get` branch, key-not-found → exit 1
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-3')`

---

### CFG-4 — Cascade get — key absent at all levels returns exit 1

**Given** no `.gobbi/settings.json`, no `.gobbi/project/settings.json`, no session settings
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
**When** `gobbi config set git.workflow.mode worktree-pr` runs (no `--level`)
**Then** `.gobbi/projects/<name>/sessions/abc/settings.json` exists with `git.workflow.mode: 'worktree-pr'`
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
**When** `gobbi config set git.workflow.mode direct-commit --level workspace` runs
**Then** `.gobbi/settings.json` exists with `git.workflow.mode: 'direct-commit'` and `schemaVersion: 1`
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

**Given** `.gobbi/project/settings.json` has `git: { workflow: { mode: 'worktree-pr', baseBranch: 'main' } }`
**When** `gobbi config set git.pr.draft true --level project` runs
**Then** `.gobbi/project/settings.json` has `git.pr.draft: true`
And `git.workflow.mode` is still `'worktree-pr'` and `git.workflow.baseBranch` is still `'main'`

State trace:
- Load existing project file; deep-path walk creates `git.pr.draft: true`
- Existing `git.workflow.*` siblings survive — only the targeted leaf is written

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

**Given** `.gobbi/settings.json` has `git.workflow.baseBranch: 'main'`
And `.gobbi/project/settings.json` has `git.workflow.baseBranch: null`
**When** `resolveSettings({ repoRoot })` (no session) runs
**Then** resolved `git.workflow.baseBranch` is `null` — project's explicit null wins over workspace's `'main'`

State trace:
- `deepMerge` null-is-leaf branch: overlay `null` replaces base value
- `undefined`/absent would delegate; `null` is a definitive override

Evidence:
- `packages/cli/src/lib/settings.ts` — `deepMerge` null-is-leaf (overlay `=== null` → write null, don't recurse)
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-10')`

---

### CFG-11 — Cross-field check — `worktree-pr` + null `baseBranch` → resolver error

**Given** `git.workflow.mode: 'worktree-pr'` wins from any level
And `git.workflow.baseBranch` resolves to `null` (or absent → default `null`)
**When** `resolveSettings({ repoRoot, sessionId })` runs
**Then** `ConfigCascadeError` is thrown with `code: 'parse'`
And the error carries a `tier` identifying which level asserted the `worktree-pr` mode

State trace:
- Cross-field check runs after cascade merge, not at single-file validation time
- `worktree-pr` mode cannot function without a base branch; catching here prevents worktree-creation failures

Evidence:
- `packages/cli/src/lib/settings-io.ts` — `resolveSettings` cross-field check after merge
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

### CFG-14 — T2-v1 upgrade — `project-config.json` migrated to `project/settings.json`

**Given** `.gobbi/project-config.json` exists with `version: 1`, `git.mode: 'worktree-pr'`, `git.baseBranch: 'main'`, `eval.ideation: true`, `eval.plan: false`
And `.gobbi/project/settings.json` does not exist
**When** `ensureSettingsCascade(repoRoot)` runs
**Then** `.gobbi/project/settings.json` exists with:
  - `schemaVersion: 1`
  - `git.workflow.mode: 'worktree-pr'` and `git.workflow.baseBranch: 'main'` (renamed)
  - `workflow.ideation.evaluate.mode: 'always'` (true → 'always') and `workflow.planning.evaluate.mode: 'ask'` (legacy `eval.plan` → new `workflow.planning`; false → 'ask')
  - No `trivialRange`, `verification.*`, `cost.*`, or `ui.*` fields
And `.gobbi/project-config.json` is left in place (idempotency guard prevents re-upgrading on subsequent runs).

State trace:
- Step 3 of `ensureSettingsCascade`: reads legacy JSON, upgrades shape, writes to new path. The legacy file is intentionally NOT deleted — keeping it allows users to inspect their pre-upgrade settings, and the idempotency guard short-circuits if the new file already exists.

Evidence:
- `packages/cli/src/lib/ensure-settings-cascade.ts` — step 3 upgrade logic
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

See `README.md` for the prose overview. `checklist.md` turns each scenario ID into ISTQB-tagged verifiable items; `review.md` reports Pass-3 DRIFT/NOTE/GAP findings with pinned commit SHAs.
