# Review — gobbi-config

| Pass date  | Pass ID               | Reviewer | Verdict    | PR     |
|------------|-----------------------|----------|------------|--------|
| 2026-04-21 | session `fbffbdb8…`   | executor | needs-work | #120   |
## Pass 2026-04-21 — Findings

Seven DRIFTs lifted from ideation §2: five resolve to doc rewrites, one to a pending T6 sibling-doc sweep (DRIFT-4), one to a cross-ref addition (DRIFT-7). The code changes — schema v2 AJV dispatch, cascade resolver, migration orchestrator, new CLI verb — are cited by SHA. Four NOTE entries document decisions, not defects. All SHAs verified via `git cat-file -e <sha>`.

---

### DRIFT-1 — Tier 2 path used plural `projects/{project_name}/`

**Finding:** The flat `gobbi-config.md` described the project tier as `.gobbi/projects/{project_name}/settings.json` (plural `projects`). The shipped code uses singular `.gobbi/project/settings.json` throughout. The plural form was propagated from an early design doc that pre-dated the canonical `.gobbi/project/` convention.

**Evidence:** `packages/cli/src/commands/gotcha/promote.ts:85` (`join('.gobbi', 'project', 'gotchas')` — singular); old flat doc `gobbi-config.md:26` (plural form). Pass-3 migration renames via `ensureConfigCascade` Step 1 (codified at `packages/cli/src/lib/project-config.ts` — the `ensureConfigCascade` function).

**Severity:** Medium — doc misled agents writing cross-refs or creating files at the wrong path. No runtime data path ever used the plural.

**Resolution:** fix doc + code — Commit `8931d0731e8c315e72ff22ad5665b4ae26c6602b` (T2): `ensureConfigCascade` renames `.gobbi/project-config.json` → `.gobbi/project/settings.json` atomically. This README uses singular throughout.

**Owner:** gobbi-config Pass 3.

---

### DRIFT-2 — Tier 3 described as a `settings.json` file under `sessions/{id}/`

**Finding:** The flat doc described T3 as `.gobbi/projects/{name}/sessions/{session_id}/settings.json` — a JSON file per session. The shipped T3 is a row in `.gobbi/config.db` accessed via `ConfigStore.getSession`. No per-session settings JSON file exists anywhere in the codebase.

**Evidence:** `packages/cli/src/lib/config-store.ts` — `getSession(sessionId)` reads from SQLite, not a JSON file; `openConfigStore` at the module level opens `config.db` at `.gobbi/config.db`. The old flat doc `gobbi-config.md:33` claims a JSON file location.

**Severity:** Medium — any agent trying to read T3 as a JSON file would not find it; the SQLite path is the only runtime path.

**Resolution:** fix doc — This README (T5 commit `b3059b18d1580c45da07cc1a9778afc98c61aeaf`) reframes T3 as the `config.db` session row throughout.

**Owner:** gobbi-config Pass 3.

---

### DRIFT-3 — Config-management command names were listed as "TBD"

**Finding:** The flat doc stated "config-management commands (names TBD — the CLI surface is being redesigned)". Pass 3 ships a locked surface: `init`, `get`, `set`, `delete`, `list`, `cleanup` (pre-existing) plus `resolve` (new). No ambiguity remains.

**Evidence:** `packages/cli/src/commands/config.ts:38-51` (`USAGE` string enumerating all subcommands including `resolve <key> [--session-id <id>] [--with-sources]`). Old flat doc `gobbi-config.md:5` (names TBD).

**Severity:** Low — did not block any runtime path; caused doc readers to defer to a "future" CLI that had already shipped.

**Resolution:** fix doc — Commit `b3059b18d1580c45da07cc1a9778afc98c61aeaf` (T4): `gobbi config resolve` wired; this README §CLI surface names all six existing + one new verb.

**Owner:** gobbi-config Pass 3.

---

### DRIFT-4 — "Step one of six" — v0.5.0 has five steps, not six

**Finding:** The flat doc described the Workflow Configuration step as "step one of six in the deterministic workflow". v0.5.0 has five steps (Ideation, Plan, Execution, Evaluation, Memorization). The six-step model was an earlier design that was superseded.

**Evidence:** `packages/cli/src/specs/state.ts` — `WorkflowStep` union contains exactly five productive steps; `.claude/project/gobbi/design/v050-overview.md §5-step cycle` (five steps listed). Old flat doc `gobbi-config.md:43` ("step one of six").

**Severity:** Low — misinformation about a workflow property that readers use when referencing doc cross-links.

**Resolution:** fix doc — Pending T6 sibling-doc sweep commit (same PR, #120). This README cross-refs `deterministic-orchestration.md` which carries the authoritative five-step description.

**Owner:** gobbi-config Pass 3 (T6 commit).

---

### DRIFT-5 — T3 described as "written during the Workflow Configuration step"

**Finding:** The flat doc implied the session-tier settings file is written automatically during the Workflow Configuration step of the deterministic workflow. In practice T3 rows are written by the `/gobbi` skill setup via explicit `gobbi config set <session-id> <key> <val>` calls before the workflow starts. There is no workflow step that auto-writes T3.

**Evidence:** `packages/cli/src/commands/config.ts` — `'set'` branch is called explicitly; no workflow step in `packages/cli/src/commands/workflow/` calls `runConfigSet` automatically. `.claude/skills/gobbi/SKILL.md` — skill setup calls `gobbi config set` for each session parameter.

**Severity:** Low — created an incorrect mental model of when T3 is populated. Agents initialising T3 manually would have been confused about whether their writes were redundant.

**Resolution:** fix doc — This README §Tier model — Tier 3 now states T3 rows are written by the `/gobbi` skill setup via `gobbi config set`.

**Owner:** gobbi-config Pass 3.

---

### DRIFT-6 — Claimed CLI reads and writes all three tiers through config-management commands

**Finding:** The flat doc stated the CLI "reads and writes all three" tiers. Pass 3 ships `resolve` as a read-only cascade view. Explicit-tier writes for T1 (`settings.json`) and T2 (`project/settings.json`) are manual file edits; T3 writes use `gobbi config set <session-id> <key> <val>` which targets T3 only. The claim was optimistic about a symmetrical write surface that does not exist.

**Evidence:** `packages/cli/src/commands/config.ts` — `'set'` branch calls `store.setField(sessionId, ...)` which writes into `config.db` T3 only; no `--tier` flag exists. `packages/cli/src/lib/project-config.ts::ensureProjectConfig` writes T2 but is not exposed as a general-purpose write command.

**Severity:** Low — agents expecting a `gobbi config set --tier user key value` style command would not find it. Explicit-tier CLI writes are Pass-4 backlog.

**Resolution:** fix doc — This README §CLI surface and §Tier model are honest: `resolve` reads the cascade; `set` targets T3 only; T1/T2 are edited manually or via init.

**Owner:** gobbi-config Pass 3.

---

### DRIFT-7 — Missing cross-ref to `feature-pass-template.md`

**Finding:** The flat `gobbi-config.md` had no reference to `feature-pass-template.md`, which serves as the canonical pattern for how per-feature passes are structured. All other feature docs in `v050-features/` that have been through a Pass contain this cross-ref.

**Evidence:** `gobbi-memory/README.md` — includes `feature-pass-template.md` in Related docs; `gobbi-config.md` (flat) — no such entry. `feature-pass-template.md` exists on `feat/118-gobbi-memory-pass-2` and will be present on the base branch after PR #119 merges.

**Severity:** Low — documentation navigation gap only; no runtime impact.

**Resolution:** fix doc — This README §Related docs table includes `feature-pass-template.md`.

**Owner:** gobbi-config Pass 3.

---

### NOTE-1 — No `config.db` schema bump in Pass 3

**Finding:** Pass 3 adds `toCascadeProjection` to project the existing `config.db` session columns (`notify_slack`, `notify_telegram`, `trivial_range`, `git_workflow`, `base_branch`) into a `Partial<CascadeShape>`. No new columns are added to the `sessions` table. The existing columns are sufficient; Pass 4 would require new columns for `verification.*` / `cost.*` session overrides.

**Evidence:** `packages/cli/src/lib/config-store.ts::toCascadeProjection` — reads from columns already present in the `sessions` DDL; no `ALTER TABLE` issued by Pass 3 code. `packages/cli/src/lib/__tests__/config-cascade-migration.test.ts` — migration tests confirm no schema bump.

**Severity:** N/A — informational decision, not a defect.

**Resolution:** no code change needed. Owner: gobbi-config Pass 3 (this note).

**Owner:** gobbi-config Pass 3.

---

### NOTE-2 — V1 and V2 project-config files coexist via two-schema AJV dispatch

**Finding:** Pass 3 adds schema v2 with five new sections. Rather than a single `oneOf` schema (which is incompatible with AJV's `JSONSchemaType<T>` TS wrapper), the implementation uses two separately compiled AJV validators dispatched at runtime by reading the `version` field defensively. V1 files continue to parse and resolve via `validateV1`; new init writes produce v2 via `validateV2`. No auto-upgrade on read.

**Evidence:** `packages/cli/src/lib/project-config.ts::parseProjectConfig` — version dispatch at the function entry point using `isRecord` guard; `validateV1` and `validateV2` compiled at module init. Commit `8931d0731e8c315e72ff22ad5665b4ae26c6602b` (T2): two separate `ajv.compile()` calls with separately typed schemas.

**Severity:** N/A — informational. The design decision to use two schemas rather than `oneOf` is intentional and follows the AJV `JSONSchemaType<T>` constraint documented in `_typescript` skill.

**Resolution:** no defect — design decision. SHA: `8931d0731e8c315e72ff22ad5665b4ae26c6602b` (T2 commit implementing `parseProjectConfig`).

**Owner:** gobbi-config Pass 3.

---

### NOTE-3 — `__sources` provenance map is internal data; `--with-sources` is its only CLI exposure

**Finding:** `ResolvedConfig.__sources` carries a flat dot-path → `TierId` map for every resolved leaf. This map is computed internally by `deepMergeWithProvenance` and exposed via the CLI only when `--with-sources` is passed to `gobbi config resolve`. Future `explain`, `diff`, and `promote` verbs that operate over the full provenance map are Pass-4 backlog items.

**Evidence:** `packages/cli/src/lib/config-cascade.ts::ResolvedConfig` — `__sources: Readonly<Record<string, TierId>>` field (commit `e2a5a6fe82d3e031ffdcfa62c6bcf140395ec3dd`, T3). `packages/cli/src/commands/config.ts::runConfigResolve` — `--with-sources` flag produces `{value, tier}` output (commit `b3059b18d1580c45da07cc1a9778afc98c61aeaf`, T4).

**Severity:** N/A — informational scope boundary, not a defect.

**Resolution:** no defect. SHAs: `e2a5a6fe82d3e031ffdcfa62c6bcf140395ec3dd` (T3, `ResolvedConfig` type) + `b3059b18d1580c45da07cc1a9778afc98c61aeaf` (T4, `--with-sources` CLI flag).

**Owner:** gobbi-config Pass 3.

---

### NOTE-4 — `.claude/gobbi.json` legacy file deferred entirely

**Finding:** `.claude/gobbi.json` is an older config file that predates the `.gobbi/config.db` storage. A deprecation warning and filesystem deletion were considered but explicitly deferred per user Q11 lock. The lazy-migration code path in `config-store.ts` handles it at the data level when `config.db` is first opened. Pass 3 does not add a stderr deprecation notice, does not delete the file, and does not touch the migration code path.

**Evidence:** Ideation §8 (non-scope: "`.claude/gobbi.json` file deletion or stderr deprecation — user-locked deferral"); `packages/cli/src/lib/config-store.ts::openConfigStore` — existing lazy migration reads `.claude/gobbi.json` if present. A surgical edit to `/gobbi` SKILL.md to update its storage-path references is T6 scope, not T5.

**Severity:** N/A — out-of-scope decision, not a defect.

**Resolution:** no action in Pass 3 — T6 owns the surgical SKILL.md edit; full deprecation is Pass 4+.

**Owner:** gobbi-config Pass 3.

---

## Summary table

| Finding  | Type  | Severity | SHA(s)                               | Resolution          |
|----------|-------|----------|--------------------------------------|---------------------|
| DRIFT-1  | drift | medium   | `8931d07`                            | fix doc + code      |
| DRIFT-2  | drift | medium   | `b3059b1` (T5 commit)                | fix doc             |
| DRIFT-3  | drift | low      | `b3059b1` (T4 commit)                | fix doc             |
| DRIFT-4  | drift | low      | pending T6 commit (#120)             | fix doc             |
| DRIFT-5  | drift | low      | `b3059b1` (T5 commit)                | fix doc             |
| DRIFT-6  | drift | low      | `b3059b1` (T5 commit)                | fix doc             |
| DRIFT-7  | drift | low      | `b3059b1` (T5 commit)                | fix doc             |
| NOTE-1   | note  | —        | — (no code change)                   | decision documented |
| NOTE-2   | note  | —        | `8931d07`                            | design decision     |
| NOTE-3   | note  | —        | `e2a5a6f` + `b3059b1`                | scope boundary      |
| NOTE-4   | note  | —        | — (deferred)                         | out of scope        |
