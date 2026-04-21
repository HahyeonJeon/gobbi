# gobbi-config — Verification Checklist

This checklist is the verification harness for the 13 scenarios in `scenarios.md`. Items are grouped by scenario ID so every check traces directly to the scenario it validates. Each item carries an ISTQB technique tag — `[EP]`, `[BVA]`, `[DT]`, `[ST]`, `[MANUAL]` — or `[GAP]` for aspirational behaviour not yet shipped. All items target behaviour shipped in Pass 3 at the SHAs cited in `review.md`.

---

---

## CFG-H-01 — Default resolution — all tier files absent

- [EP] `resolveConfig({ repoRoot })` on a fresh tmpdir with no `.gobbi/` returns a `ResolvedConfig` whose values match `DEFAULT_CONFIG` + `DEFAULT_USER_SETTINGS` combined defaults.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-01'`
- [ST] Every leaf in `resolved.__sources` carries `'default'` — no `'user'`, `'project'`, or `'session'` entry appears when no tier file exists.
  - Verify: inspect `Object.values(resolved.__sources).every(t => t === 'default')` in the CFG-H-01 test
- [EP] `resolveConfig` does not throw and does not attempt to read absent files — `existsSync`-gated per tier.
  - Verify: `rg -n "existsSync" packages/cli/src/lib/config-cascade.ts` confirms guards on T1 and T2 read paths

---

## CFG-H-02 — T1 only — user-tier value visible when T2 and T3 omit key

- [EP] A T1 file with `notify.slack: true` causes `resolved.notify.slack === true` and `resolved.__sources['notify.slack'] === 'user'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-02'`
- [EP] `ui.verbosity` from T1 propagates to the resolved config; `ui` is T1-exclusive (no T2 ui section).
  - Verify: inspect CFG-H-02 test assertions on `resolved.ui.verbosity` and `resolved.__sources['ui.verbosity']`
- [ST] Keys not in the T1 file retain `'default'` in `__sources` — T1 only updates the leaves it declares.
  - Verify: inspect unset keys (e.g. `git.mode`) in CFG-H-02 test: `resolved.__sources['git.mode'] === 'default'`

---

## CFG-H-03 — T2 only — project-tier value visible when T1 and T3 omit key

- [EP] A T2 file with `version: 2` and `git.mode: 'worktree-pr'` causes `resolved.git.mode === 'worktree-pr'` and `resolved.__sources['git.mode'] === 'project'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-03'`
- [DT] Both schema v1 and schema v2 T2 files parse successfully via the two-schema AJV dispatch in `parseProjectConfig`.
  - Verify: `bun test packages/cli/src/lib/__tests__/project-config-v2.test.ts` (v1-minimal + v2-minimal cases)
- [ST] Keys not in the T2 file retain `'default'` — T2's `trivialRange` override only updates the leaves it sets.
  - Verify: inspect CFG-H-03 test assertions on unset leaves

---

## CFG-H-04 — T3 only — session-tier value visible when T1 and T2 omit key

- [EP] A session row with `git_workflow: 'worktree-pr'` causes `resolved.git.mode === 'worktree-pr'` and `resolved.__sources['git.mode'] === 'session'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-04'`
- [ST] `notify.discord` is always `false` from the T3 projection (no SQL column) — the `discord` leaf comes from default, not session.
  - Verify: inspect `toCascadeProjection` in `packages/cli/src/lib/config-store.ts` — `discord: false` is pinned
- [EP] NULL columns in the session row are skipped by `toCascadeProjection` — only non-NULL columns contribute a T3 overlay.
  - Verify: `bun test packages/cli/src/lib/__tests__/cascade-shape.test.ts` (toCascadeProjection null-skipping tests)

---

## CFG-H-05 — Full cascade — T3 > T2 > T1 > default

- [EP] With all three tiers populated, T3's `git.mode` wins over T2's conflicting value.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-05'`
- [EP] T1's `ui.verbosity` persists in the full cascade — T2 has no `ui` section, T3 has no `ui` projection.
  - Verify: CFG-H-05 test asserts `resolved.ui.verbosity === 'verbose'` and `__sources['ui.verbosity'] === 'user'`
- [DT] T2's `verification.*` persists in the full cascade — T3 never projects verification settings.
  - Verify: CFG-H-05 test asserts `resolved.verification.*` from T2 and `__sources['verification.*'] === 'project'`
- [ST] `resolved.__sources` contains distinct tier values for each leaf — no single tier dominates all keys in the full cascade.
  - Verify: CFG-H-05 test inspects at least one `'default'`, one `'user'`, one `'project'`, one `'session'` in `__sources`

---

## CFG-H-06 — Partial cascade — T3 silent, T2 wins over T1

- [EP] `eval.plan` from T2 wins over the default with `__sources['eval.plan'] === 'project'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-06'`
- [EP] `eval.ideation` from T1 wins with `__sources['eval.ideation'] === 'user'` because T2 only set `eval.plan`.
  - Verify: CFG-H-06 test asserts T1's `eval.ideation` survives T2 merge
- [ST] `toCascadeProjection` returns no `eval` key — the session row has no evaluation column — so T3 is silent for all `eval.*` leaves.
  - Verify: `rg -n "eval" packages/cli/src/lib/config-store.ts` — no eval projection in `toCascadeProjection`

---

## CFG-H-07 — Deep-merge — T2 overrides nested leaf, T1 siblings retained

- [EP] T2 setting only `git.mode` (not `git.baseBranch`) leaves T1's `git.baseBranch: 'main'` intact after merge.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-07'`
- [ST] `__sources['git.mode']` is `'project'` and `__sources['git.baseBranch']` is `'user'` — two leaves inside the same sub-object have different winning tiers.
  - Verify: CFG-H-07 test asserts both `__sources` entries independently
- [BVA] T2's absence of `baseBranch` at the JSON level (key entirely omitted) does not overwrite T1's value — `undefined` is skipped by `deepMerge`.
  - Verify: `rg -n "undefined" packages/cli/src/lib/project-config.ts` — `deepMerge` `continue` on `overlayValue === undefined`

---

## CFG-H-08 — Arrays replace — narrower tier array supersedes wider

- [EP] T2's `verification.runAfterSubagentStop: ['format']` fully replaces the default `['typecheck', 'test']` array.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-08'`
- [ST] `deepMerge` array-replace behaviour is consistent: no partial append or per-element merge occurs anywhere in the cascade pipeline.
  - Verify: `bun test packages/cli/src/lib/__tests__/config-cascade.test.ts` (array-replace cases in `deepMergeWithProvenance` suite)

---

## CFG-H-09 — `null` at narrower tier is an explicit leaf value

- [EP] T2's `git.baseBranch: null` replaces T1's `'main'` — `null` is a leaf, not an absence.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-H-09'`
- [BVA] `__sources['git.baseBranch']` is `'project'` because T2 set the null value — T1's `'user'` tier is overridden by an explicit null.
  - Verify: CFG-H-09 test asserts `resolved.git.baseBranch === null && resolved.__sources['git.baseBranch'] === 'project'`

---

## CFG-E-01 — Migration — rename `project-config.json` → `project/settings.json`

- [EP] A repo with `.gobbi/project-config.json` and no `.gobbi/project/settings.json` produces `.gobbi/project/settings.json` with identical content after `ensureConfigCascade` runs.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-E-01'`
- [ST] `.gobbi/project-config.json` no longer exists after the rename — `existsSync(legacyPath)` is `false`.
  - Verify: CFG-E-01 test asserts the legacy path is absent post-migration
- [EP] `ensureConfigCascade` is idempotent — running it twice with `.gobbi/project/settings.json` already present produces no error and no file change.
  - Verify: `bun test packages/cli/src/lib/__tests__/config-cascade-migration.test.ts` (idempotency cases)

---

## CFG-E-02 — Migration — legacy sessions-shape archive after Step 0

- [EP] A legacy `settings.json` with the sessions-shape gets archived to `settings.legacy.json` after `ensureConfigCascade`; sessions are present in `config.db` before the archive runs.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-E-02'`
- [ST] A hand-written T1 file with `sessions: []` (array not record) does NOT trigger the archive — `isLegacyGobbiJson` requires a record-type sessions value.
  - Verify: `bun test packages/cli/src/lib/__tests__/config-cascade-migration.test.ts` (false-positive guard case)
- [EP] After CFG-E-02 migration, a fresh `settings.json` with `DEFAULT_USER_SETTINGS` shape exists — Step 3 always runs if T1 is absent after Step 2.
  - Verify: CFG-E-02 test asserts `DEFAULT_USER_SETTINGS` keys are present in the new T1 file

---

## CFG-E-03 — CLI backcompat — `gobbi config get` reads T3 row only

- [EP] `gobbi config get <session-id>` returns the raw session JSON with legacy field names (`gitWorkflow`, not `git.mode`) — cascade is NOT applied.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-E-03'`
- [ST] The `'get'` branch in `runConfig` does not call `resolveConfig` — it dispatches directly to `ConfigStore.getSession`.
  - Verify: `rg -n "resolveConfig" packages/cli/src/commands/config.ts` — only the `'resolve'` branch contains the call
- [EP] Exit code is `0` for an existing session id; the response shape is unchanged from pre-Pass-3.
  - Verify: `bun test packages/cli/src/commands/__tests__/config.test.ts` (existing `get` smoke test cases)

---

## CFG-Edge-01 — Invalid JSON at any tier throws `ConfigCascadeError`

- [EP] Invalid JSON in `.gobbi/settings.json` causes `resolveConfig` to throw `ConfigCascadeError` with `code === 'parse'` and `tier === 'user'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-Edge-01'`
- [EP] Invalid JSON in `.gobbi/project/settings.json` causes `resolveConfig` to throw `ConfigCascadeError` with `code === 'parse'` and `tier === 'project'`.
  - Verify: CFG-Edge-01 T2 variant in the feature test file
- [ST] `ConfigCascadeError` carries a `path` field with the absolute file path of the failing tier — the caller can surface the filename in error output.
  - Verify: `rg -n "class ConfigCascadeError" packages/cli/src/lib/config-cascade.ts` — `path` field on the class

---

## Verification Procedure

1. Run `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts` to exercise all 13 CFG-* scenarios.
2. Run `bun test packages/cli/src/commands/__tests__/config.test.ts` to exercise CLI-layer resolve + backcompat tests.
3. For structural items, run the grep hints and confirm cited line numbers against the Pass-3 SHAs in `review.md`.
4. Tick items that pass; unticked items become findings for Pass 4.
5. `[GAP]` items represent aspirational behaviour — log with a Resolution pointing to the backlog issue.

See `scenarios.md` for the full Given/When/Then bodies and `review.md` for DRIFT/NOTE resolutions.
