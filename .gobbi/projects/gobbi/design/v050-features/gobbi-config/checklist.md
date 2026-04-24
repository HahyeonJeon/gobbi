# gobbi-config — Verification Checklist

Verification harness for the scenarios in `scenarios.md`. Items are grouped by scenario ID so every check traces directly to the scenario it validates. Each item carries an ISTQB technique tag: `[EP]` equivalence partition, `[BVA]` boundary value, `[DT]` decision table, `[ST]` state transition, `[MANUAL]` manual, `[GAP]` aspirational behaviour not yet shipped.

All items target behaviour shipped in Pass 3 (Wave B–D, SHAs cited in `review.md`).

---

## CFG-1 — Cascade get — session wins

- [ST] `gobbi config get git.workflow.mode` with session set to `'worktree-pr'` and project set to `'direct-commit'` returns `"worktree-pr"` and exit 0.
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

- [EP] `gobbi config set git.workflow.mode worktree-pr` (no `--level`) writes to `.gobbi/sessions/{id}/settings.json`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-5'`
- [ST] Session file uses atomic write (temp+rename) — partial write cannot corrupt the file.
  - Verify: `rg -n 'renameSync\|writeFileSync.*tmp' packages/cli/src/lib/settings-io.ts`

---

## CFG-6 — Set explicit level writes workspace

- [EP] `--level workspace` creates `.gobbi/settings.json` when absent, with `schemaVersion: 1` and the set key.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-6'`
- [EP] `--level project` writes to `.gobbi/project/settings.json`.
  - Verify: CFG-6 variant test for project level

---

## CFG-7 — Deep-path set preserves siblings

- [EP] Writing `git.pr.draft` does not overwrite `git.workflow.mode` or `git.workflow.baseBranch`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-7'`
- [BVA] Three-level nesting (`workflow.ideation.discuss.mode`) creates all intermediate nodes without touching other keys at each node level.
  - Verify: CFG-7 extended case in test file checking `workflow.ideation.discuss.mode` deep write

---

## CFG-8 — Invalid key fails with exit 2

- [EP] Unknown top-level section (e.g., `unknownSection.foo`) fails AJV validation; exit 2; file not modified.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-8'`
- [EP] Invalid enum value (e.g., `git.workflow.mode: 'invalid-mode'`) fails AJV; exit 2.
  - Verify: CFG-8 variant testing enum validation
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

- [EP] Project-level `git.workflow.baseBranch: null` overrides workspace-level `'main'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-10'`
- [BVA] `undefined` / absent key does NOT override — only `null` is an explicit leaf.
  - Verify: CFG-10 test includes a case with absent project key asserting workspace value survives

---

## CFG-11 — Cross-field check

- [EP] `mode: 'worktree-pr'` + `baseBranch: null` in cascade result → `ConfigCascadeError` thrown, `code === 'parse'`.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-11'`
- [EP] `mode: 'worktree-pr'` + `baseBranch: 'main'` resolves cleanly — no error.
  - Verify: CFG-11 happy-path variant in test file
- [ST] `ConfigCascadeError.tier` identifies which level set the offending `mode` value.
  - Verify: CFG-11 test asserts `err.tier` matches the level that set `worktree-pr`

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

## CFG-14 — T2-v1 upgrade

- [EP] Legacy `project-config.json` with `git.mode`, `eval.ideation`, `eval.plan` is upgraded: fields renamed/restructured; `trivialRange`, `verification.*`, `cost.*` dropped.
  - Verify: `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts -t 'CFG-14'`
- [DT] Boolean `eval.*: true` → `'always'`; boolean `eval.*: false` → `'ask'`. Both cases covered.
  - Verify: CFG-14 test asserts `workflow.ideation.evaluate.mode === 'always'` (true→'always') and `workflow.planning.evaluate.mode === 'ask'` (legacy `eval.plan` → new `workflow.planning`; false→'ask')
- [EP] After upgrade, `.gobbi/project-config.json` is absent and `.gobbi/project/settings.json` is present with `schemaVersion: 1`.
  - Verify: CFG-14 test asserts source file gone, target file has correct schema version
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

## Verification procedure

1. `bun test packages/cli/src/__tests__/features/gobbi-config.test.ts` — exercises CFG-1 through CFG-14
2. `bun test packages/cli/src/__tests__/features/q2-evalconfig-e2e.test.ts` — exercises CFG-15 (4×3 matrix)
3. For structural items, use the grep hints in each section to confirm cited code patterns exist
4. `[GAP]` items represent aspirational behaviour — no items are GAP in Pass 3

See `scenarios.md` for full Given/When/Then bodies and `review.md` for DRIFT/NOTE/GAP resolutions.
