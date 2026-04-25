# State.db Redesign Gotchas

Six gotchas surfaced during Pass 4 design that Wave A.1 (DB rename + workspace re-scope + handoff state-machine step + state.db schema v6) MUST address. Read this before starting the migration.

---

### Audit-only events MUST bypass the reducer

---
priority: critical
tech-stack: typescript, bun, sqlite
enforcement: advisory
---

**What happened**: Pass 4 v1 synthesis proposed routing the new `step.advancement.observed` synthetic event through the standard `appendEventAndUpdateState` path. Architecture-perspective evaluation found this would silently fail end-to-end.

**Why it fails**: The reducer's `assertNever` at `packages/cli/src/workflow/reducer.ts:688` throws a plain `Error`, not the expected `ReducerRejectionError`. The engine's audit gate at `engine.ts:232` does NOT fire for plain Errors; the `capture-planning.ts:177` best-effort catch swallows the error. Net result: the event is never persisted and the Stop-hook safety net fires spurious reminders on every turn because it can't see the advancement signal.

**Correct approach**: Audit-only / observability-only events MUST be written via `store.append()` directly, bypassing the reducer entirely. The reducer stays pure and only sees state-affecting events. Add an explicit comment at the call site noting why the bypass exists.

---

### EventStore constructor needs explicit partition keys for workspace mode

---
priority: critical
tech-stack: typescript, bun, sqlite
enforcement: advisory
---

**What happened**: The current `EventStore` constructor at `packages/cli/src/workflow/store.ts:369-370` derives `sessionId = basename(dirname(path))` from the DB path. This works for per-session DBs at `.gobbi/projects/<name>/sessions/<id>/gobbi.db` (yields `<id>`). For the post-rename workspace-scoped DB at `.gobbi/state.db`, it yields `'.gobbi'` as session ID; `project_id` becomes permanently null because `resolveProjectRootBasename` reads `.gobbi/metadata.json` which doesn't exist at workspace root.

**Correct approach**: Wave A.1 must add explicit `sessionId: string` and `projectId: string` constructor parameters that take precedence over path-derivation when running in workspace mode. Path derivation stays as a fallback during the migration window. Failing to do this corrupts `project_id`/`session_id` columns on every workspace-scoped write.

---

### `.gobbi/*` gitignore rule masks any new git-tracked file under `.gobbi/`

---
priority: high
tech-stack: git
enforcement: hook
event: file
pattern: ^\.gobbi/[^/]+$
---

**What happened**: Pass 4 introduces `.gobbi/gobbi.db` as a git-tracked memory store. Current `.gitignore` has `.gobbi/*` covering everything in `.gobbi/`. The rescue `!.gobbi/projects/` exists for the design tree but does not cover `.gobbi/gobbi.db`.

**Correct approach**: Wave A.1 must add `!.gobbi/gobbi.db` (and any other intentionally-tracked workspace-root file) immediately after the `.gobbi/*` rule. Verify via `git check-ignore .gobbi/gobbi.db` returning nonzero (file is tracked) AND `git check-ignore .gobbi/state.db` returning 0 (file is ignored). Add this as a CI integration test so a future `.gitignore` edit can't silently re-ignore the memory store.

---

### Hook path-resolution silently fail-opens after a rename

---
priority: high
tech-stack: typescript, bun
enforcement: advisory
---

**What happened**: Hooks like `guard.ts:232`, `stop.ts:182`, `commands/session.ts:320`, `commands/gotcha/promote.ts:308` look for `<sessionDir>/gobbi.db` and fail-open (return `allow` or no-op) when the file is absent. The Wave A.1 rename moves the DB to `.gobbi/state.db`. Without updating every callsite, every hook will allow unconditionally with no error, no warning, no test failure.

**Correct approach**: Wave A.1 task A.1.7 must include a comprehensive grep sweep for `join(sessionDir, 'gobbi.db')` and `<sessionDir>/gobbi.db` patterns across `packages/cli/src/`. Update every match to use the new workspace path or explicit constructor params. Add an integration test that asserts hooks ERROR (not silently fail-open) when the configured DB path is missing.

---

### Schema mirror files must change in lockstep

---
priority: high
tech-stack: typescript, bun
enforcement: hook
event: file
pattern: packages/cli/src/specs/(_schema/v1\.(ts|json)|types\.ts)$
---

**What happened**: The step-spec schema lives in three mirrored files: `packages/cli/src/specs/_schema/v1.ts` (TypeScript types), `packages/cli/src/specs/_schema/v1.json` (JSON Schema mirror), and `packages/cli/src/specs/types.ts::StepBlocks` (with `additionalProperties: false`). A drift test at `schema.test.ts:399-404` enforces equivalence. Adding a new field (e.g., Wave B.1's `blocks.footer`) to only one of the three files results in either `tsc --noEmit` failure (TS missing) or drift test failure (JSON missing) or AJV validation rejection (StepBlocks missing).

**Correct approach**: Whenever a schema field is added/changed/removed, update all three files in the same commit. The drift test catches accidental partial updates but only at CI time — local feedback loop is `bun test schema.test.ts`. Wave B.1's `blocks.footer` task must list all three files explicitly.

---

### `MAINTENANCE_COMMANDS` registry-dispatch silently rejects unregistered handlers

---
priority: high
tech-stack: typescript, bun
enforcement: advisory
---

**What happened**: `commands/maintenance.ts:48-59` uses an explicit `MAINTENANCE_COMMANDS` array for dispatch. Creating a new handler file (e.g., Wave A.1.4's `commands/maintenance/migrate-state-db.ts`) without adding the entry to this array means `gobbi maintenance migrate-state-db` returns "unknown subcommand" with no helpful error pointing at the registry.

**Correct approach**: When adding a new maintenance subcommand, update `commands/maintenance.ts:48-59` AND the new handler file in the same commit. Plan tasks that add maintenance commands must list both files in their files-modified declaration. Consider adding a CI lint or a runtime auto-discovery scan that fails when a `commands/maintenance/*.ts` file exists without a registry entry.

---
