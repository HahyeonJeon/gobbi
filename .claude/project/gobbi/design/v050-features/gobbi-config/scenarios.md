# gobbi-config — Scenarios

Behaviour specifications for gobbi's three-tier configuration cascade. Covers default resolution, per-tier overrides, deep-merge semantics, array replacement, null leaf values, migration steps, CLI backward compatibility, and error handling on invalid JSON.

This file does NOT cover: the gobbi-memory tier wiring (`gobbi-memory/README.md`), the CLI command surface beyond `resolve` (`cli-as-runtime-api.md`), or the five-step workflow (`deterministic-orchestration.md`). Every scenario has a stable ID in the `CFG-{H|E|Edge}-NN` format — `rg 'CFG-' .claude/project/gobbi/design/v050-features/gobbi-config/` surfaces every reference.

See `README.md` for the feature overview.

---

## Happy path

### CFG-H-01 — Default resolution — all tier files absent

**Given** an empty repository with no `.gobbi/` directory
**When** the caller invokes `resolveConfig({ repoRoot: <fresh> })`
**Then** the resolver returns a `ResolvedConfig` matching `DEFAULT_CONFIG` with every `__sources` leaf set to `'default'`

State trace:
- T1, T2: absent → readers return `null` → tiers skipped
- T3: no `sessionId` provided → skipped
- Accumulator stays at hardcoded defaults from `DEFAULT_CONFIG` + `DEFAULT_USER_SETTINGS`
- `__sources`: every dot-path resolves to `'default'`

Evidence:
- `packages/cli/src/lib/config-cascade.ts` — `resolveConfig` skips null tiers
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-01')`

---

### CFG-H-02 — T1 only — user-tier value visible when T2 and T3 omit key

**Given** `.gobbi/settings.json` exists with `notify.slack: true` and `ui.verbosity: 'verbose'`
And no `.gobbi/project/settings.json` exists
And no `sessionId` is provided
**When** `resolveConfig({ repoRoot })` runs
**Then** `resolved.notify.slack` is `true` and `resolved.__sources['notify.slack']` is `'user'`
And `resolved.ui.verbosity` is `'verbose'` and `resolved.__sources['ui.verbosity']` is `'user'`
And keys not in the T1 file (`git.mode`, `eval.execution`, etc.) still resolve from defaults

State trace:
- T1: file present, validates as `UserSettings` → raw overlay applied; T1-touched leaves tagged `'user'`
- T2, T3: absent → skipped; unset leaves remain `'default'`

Evidence:
- `packages/cli/src/lib/config-cascade.ts` — `readUserSettingsInput`, `deepMergeWithProvenance`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-02')`

---

### CFG-H-03 — T2 only — project-tier value visible when T1 and T3 omit key

**Given** `.gobbi/project/settings.json` exists with `version: 2`, `git.mode: 'worktree-pr'`, and `trivialRange: 'simple-edits'`
And no `.gobbi/settings.json` exists
And no `sessionId` is provided
**When** `resolveConfig({ repoRoot })` runs
**Then** `resolved.git.mode` is `'worktree-pr'` and `resolved.__sources['git.mode']` is `'project'`
And `resolved.trivialRange` is `'simple-edits'` and `resolved.__sources['trivialRange']` is `'project'`
And keys not in the T2 file resolve from defaults

State trace:
- T1, T3: absent → skipped
- T2: file present, `parseProjectConfig` dispatches to `validateV2` → raw overlay applied; T2-touched leaves tagged `'project'`

Evidence:
- `packages/cli/src/lib/project-config.ts` — `parseProjectConfig`, `validateV2`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-03')`

---

### CFG-H-04 — T3 only — session-tier value visible when T1 and T2 omit key

**Given** a session row in `.gobbi/config.db` with `git_workflow: 'worktree-pr'`, `trivial_range: 'simple-edits'`, `notify_slack: 1`
And no `.gobbi/settings.json` or `.gobbi/project/settings.json` exists
**When** `resolveConfig({ repoRoot, sessionId: <id> })` runs
**Then** `resolved.git.mode` is `'worktree-pr'` and `resolved.__sources['git.mode']` is `'session'`
And `resolved.trivialRange` is `'simple-edits'` and `resolved.__sources['trivialRange']` is `'session'`
And `resolved.notify.slack` is `true` and `resolved.__sources['notify.slack']` is `'session'`

State trace:
- T1, T2: both absent → skipped
- T3: `toCascadeProjection(store, sessionId)` returns `Partial<CascadeShape>` with non-NULL columns projected; `notify.discord` always pinned to `false` (no SQL column)
- Merge: default accumulator → T3 overlay applied; T3-touched leaves tagged `'session'`

Evidence:
- `packages/cli/src/lib/config-store.ts` — `toCascadeProjection`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-04')`

---

### CFG-H-05 — Full cascade — T3 > T2 > T1 > default

**Given** T1 sets `notify.slack: true`, `ui.verbosity: 'verbose'`
And T2 sets `git.mode: 'worktree-pr'`, `verification.runAfterSubagentStop: ['typecheck']`
And T3 row sets `git_workflow: 'direct-commit'`, `trivial_range: 'simple-edits'`, `notify_slack: 0`
**When** `resolveConfig({ repoRoot, sessionId: <id> })` runs
**Then** `resolved.git.mode` is `'direct-commit'` (T3 wins over T2's `'worktree-pr'`)
And `resolved.notify.slack` is `false` (T3 wins over T1's `true`)
And `resolved.verification.runAfterSubagentStop` is `['typecheck']` (T2, no T3 projection for verification)
And `resolved.ui.verbosity` is `'verbose'` (T1, no T2 or T3 override for ui)
And `resolved.trivialRange` is `'simple-edits'` (T3)
And unset keys resolve to defaults with `__sources` value of `'default'`

State trace:
- Defaults → T1 (`notify.slack`, `ui.verbosity` → `'user'`) → T2 (`git.mode`, `verification.*` → `'project'`) → T3 (`git.mode`, `notify.slack`, `trivialRange` → `'session'`)
- T3 wins contested leaves; T2 leaves persist where T3 didn't touch; T1's `ui` persists throughout

Evidence:
- `packages/cli/src/lib/config-cascade.ts` — `resolveConfig` folding pipeline
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-05')`

---

### CFG-H-06 — Partial cascade — T3 silent, T2 wins over T1

**Given** T1 sets `eval.ideation: true`
And T2 sets `eval.plan: true`
And a session exists but its row has no `evaluation_mode` column set (T3 never projects `eval`)
**When** `resolveConfig({ repoRoot, sessionId: <id> })` runs
**Then** `resolved.eval.plan` is `true` and `resolved.__sources['eval.plan']` is `'project'`
And `resolved.eval.ideation` is `true` and `resolved.__sources['eval.ideation']` is `'user'`
And T3 contributes nothing for `eval.*` — the session projection has no eval overlay

State trace:
- T3: `toCascadeProjection` has no `eval` key (no SQL column) — silent
- T2 wins `eval.plan`; T1 wins `eval.ideation`; `eval.execution` falls through to default

Evidence:
- `packages/cli/src/lib/config-store.ts` — `toCascadeProjection` (no `evaluation_mode` projection)
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-06')`

---

### CFG-H-07 — Deep-merge — T2 overrides nested leaf, T1 siblings retained

**Given** T1 sets `git: { mode: 'direct-commit', baseBranch: 'main' }`
And T2 sets `git: { mode: 'worktree-pr' }` (only the `mode` key, no `baseBranch`)
**When** `resolveConfig({ repoRoot })` runs
**Then** `resolved.git.mode` is `'worktree-pr'` (T2 wins)
And `resolved.git.baseBranch` is `'main'` (T1 value retained — T2 did not override this sibling)
And `resolved.__sources['git.mode']` is `'project'`
And `resolved.__sources['git.baseBranch']` is `'user'`

State trace:
- T2's raw input has `git.mode` only — the `git` object is not a full replacement
- `deepMergeWithProvenance` recurses into `git` and merges leaf-by-leaf
- `baseBranch` is `undefined` in the T2 overlay → skipped → T1's `'main'` survives

Evidence:
- `packages/cli/src/lib/project-config.ts` — `deepMerge` semantics (`undefined` skips)
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-07')`

---

### CFG-H-08 — Arrays replace — narrower tier array supersedes wider

**Given** defaults have `verification.runAfterSubagentStop: ['typecheck', 'test']`
And T2 sets `verification.runAfterSubagentStop: ['format']`
**When** `resolveConfig({ repoRoot })` runs
**Then** `resolved.verification.runAfterSubagentStop` is `['format']`
And the default `['typecheck', 'test']` is gone — the array was replaced, not merged

State trace:
- `deepMerge` array rule: when overlay value is an array, it replaces the base array entirely
- No per-element merging or append behaviour
- `__sources['verification.runAfterSubagentStop']` is `'project'`

Evidence:
- `packages/cli/src/lib/project-config.ts` — `deepMerge` (array branch: overlay replaces)
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-08')`

---

### CFG-H-09 — `null` at narrower tier is an explicit leaf value

**Given** T1 sets `git.baseBranch: 'main'`
And T2 sets `git.baseBranch: null`
**When** `resolveConfig({ repoRoot })` runs
**Then** `resolved.git.baseBranch` is `null`
And T2's explicit `null` overrides T1's `'main'` — `null` is a leaf, not an absence signal

State trace:
- T1 overlay: `git.baseBranch` tagged `'user'` at `'main'`
- T2 overlay: `git.baseBranch` is `null` → `deepMerge` null-is-leaf rule fires → replaces `'main'`
- `__sources['git.baseBranch']` is `'project'`
- SQL NULL in T3's `base_branch` column would have been skipped (delegates to T2) — but T2's JSON null wins

Evidence:
- `packages/cli/src/lib/project-config.ts` — `deepMerge` null-is-leaf branch
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-H-09')`

---

## Migration scenarios

### CFG-E-01 — Migration — rename `project-config.json` → `project/settings.json` on first init

**Given** an existing repo with `.gobbi/project-config.json` present (pre-Pass-3 layout)
And `.gobbi/project/settings.json` does not exist
**When** `ensureConfigCascade(repoRoot)` runs (via `gobbi workflow init` or `gobbi config init`)
**Then** `.gobbi/project/settings.json` exists with the same JSON content as the old file
And `.gobbi/project-config.json` no longer exists
And re-running `ensureConfigCascade` is a no-op (target already exists)

State trace:
- Step 0: `using store = openConfigStore(repoRoot)` — triggers legacy JSON migration if any; WAL auto-closed
- Step 1: `project-config.json` found, `project/settings.json` absent → `mkdirSync` + `renameSync`
- Step 2-4: T1 archive / fresh-init / `.gitignore` update proceed independently

Evidence:
- `packages/cli/src/lib/project-config.ts` — `ensureConfigCascade` Step 1
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-E-01')`

---

### CFG-E-02 — Migration — legacy sessions-shape: Step 0 migrates to config.db THEN Step 2 archives source

**Given** `.gobbi/settings.json` exists with the legacy sessions-shape (keys: `version`, `architecture`, `sessions` as a record)
And `.gobbi/config.db` does not yet exist (pre-migration)
**When** `ensureConfigCascade(repoRoot)` runs
**Then** Step 0 opens `ConfigStore` which triggers the lazy legacy-JSON migration: sessions are copied into `config.db`
And Step 2 archives `.gobbi/settings.json` → `.gobbi/settings.legacy.json` AFTER sessions are safely in `config.db`
And Step 3 writes a fresh `DEFAULT_USER_SETTINGS` to `.gobbi/settings.json`
And no session data is lost — the archive only runs after `config.db` has the sessions

State trace:
- Step 0 (`using` auto-dispose) completes before Step 2 touches the file — ordering invariant
- `isLegacyGobbiJson` requires all three keys (`version`, `architecture`, `sessions` as record); a hand-written T1 with `sessions: []` (array, not record) does NOT trigger archive

Evidence:
- `packages/cli/src/lib/project-config.ts` — `ensureConfigCascade` Steps 0-3, `isLegacyGobbiJson`
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-E-02')`

---

### CFG-E-03 — CLI backcompat — `gobbi config get <session-id> [key]` continues to read T3 row only

**Given** a session row in `.gobbi/config.db` with `gitWorkflow: 'worktree-pr'`
And a T2 file setting `git.mode: 'direct-commit'`
**When** a subprocess runs `gobbi config get <session-id>` (the pre-Pass-3 command)
**Then** the output is the raw session JSON with legacy field names (`gitWorkflow`, not `git.mode`)
And the cascade is NOT applied — `get` returns the T3 row directly without merging T1 or T2
And exit code is `0`

State trace:
- `runConfig` dispatches on `'get'` — this branch is unchanged from pre-Pass-3
- No `resolveConfig` call; `ConfigStore.getSession` returns the raw row
- The response shape uses the SQLite column names as returned by the store, not the cascade shape

Evidence:
- `packages/cli/src/commands/config.ts` — `'get'` branch (unchanged from pre-Pass-3 surface)
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-E-03')`

---

## Edge cases

### CFG-Edge-01 — Invalid JSON at any tier — throws `ConfigCascadeError` with tier + path + parse error

**Given** a `.gobbi/settings.json` (T1) or `.gobbi/project/settings.json` (T2) that contains invalid JSON (e.g. a truncated object)
**When** `resolveConfig({ repoRoot })` runs
**Then** it throws a `ConfigCascadeError` with `code: 'parse'`
And the error carries a `tier` field identifying which tier failed (`'user'` for T1, `'project'` for T2)
And the error carries a `path` field with the absolute file path of the invalid file
And the raw parse error message is included in the thrown error

State trace:
- T1 variant: `readUserSettingsInput` attempts `JSON.parse` → throws → wraps as `ConfigCascadeError('parse', ..., { tier: 'user', path: ... })`
- T2 variant: `readProjectConfigInput` attempts `JSON.parse` → throws → wraps as `ConfigCascadeError('parse', ..., { tier: 'project', path: ... })`
- Neither path silently returns a partial result; errors propagate to the caller

Evidence:
- `packages/cli/src/lib/config-cascade.ts` — `ConfigCascadeError` class; `readUserSettingsInput`, `readProjectConfigInput` error paths
- `packages/cli/src/__tests__/features/gobbi-config.test.ts` — `describe('CFG-Edge-01')` (T1 and T2 variants)

---

See `README.md` for the prose overview. `checklist.md` turns each scenario ID into ISTQB-tagged verifiable items; `review.md` reports Pass-3 DRIFT and NOTE findings with resolutions citing scenario IDs.
