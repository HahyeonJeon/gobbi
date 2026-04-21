# `.gobbi/` Configuration

> Status: Pass 3 landed 2026-04-21 (session `fbffbdb8…`). PR #120 draft open on `docs/109-v050-feature-docs`.

Feature description for gobbi's three-tier configuration cascade. Read this to understand where settings live at each scope, how tiers override one another, how schema v2 extends the project-config shape, and how the new `gobbi config resolve` command exposes the merged result.

---

> **Configuration is a cascade: session wins over project, project wins over user. Each tier provides defaults for the narrower tier above it — and the narrower tier always overrides.**

Gobbi resolves every setting by composing three sources under `.gobbi/`, from widest to narrowest scope, then layering the narrower result on top. The cascade is computed by `lib/config-cascade.ts::resolveConfig` and surfaced through `gobbi config resolve`. Direct file edits are supported at T1 and T2; T3 rows are written via `gobbi config set <session-id> <key> <val>`.

---

## Tier model

The three tiers cover distinct concerns. T1 and T2 use JSON files; T3 uses SQLite. Every tier is optional at resolution time — absent tiers are skipped, and missing keys delegate to the next wider tier.

**Tier 1 — User settings** (`.gobbi/settings.json`)

Workspace-scoped user preferences, gitignored. Applies across every project under this `.gobbi/` root — session-independent, project-independent, persistent across every workflow run. Typical contents: preferred notification channels, preferred git mode, UI verbosity. Written once by `ensureConfigCascade` on first init with `DEFAULT_USER_SETTINGS`; edited manually thereafter. The singular `project/` subdirectory was established in Pass 2; T1 lives at the `.gobbi/` root and is independent of it.

**Tier 2 — Project settings** (`.gobbi/project/settings.json`)

Per-repo policy, tracked in version control, AJV-validated. Contains the settings that must apply the same way for every workflow run in this project: verification commands, cost limits, git mode, evaluation gates, trivial-range policy. Schema v2 (from Pass 3) extends schema v1 with five new sections; both versions are accepted by the two-schema AJV dispatch in `lib/project-config.ts`. Written by `ensureConfigCascade` on first init; updated by re-running init or editing directly.

**Tier 3 — Session settings** (`.gobbi/config.db` via `ConfigStore`)

Per-session overrides, stored as a row in the SQLite workspace config store. Written by the `/gobbi` skill setup via `gobbi config set <session-id> <key> <val>` during Workflow Configuration. The `toCascadeProjection` helper in `lib/config-store.ts` maps the session row's columns to a `Partial<CascadeShape>` overlay — NULL columns skip (delegate to T2), non-NULL columns win over both T1 and T2. T3 projects `notify`, `git`, and `trivialRange` only; `verification`, `cost`, `eval`, and `ui` are not projected (Pass-4 backlog).

The T1 settings shape has no `verification` or `cost` sections (project-only concerns). T1 has a private `ui` section (user-only) that T2 and T3 never contribute to. This means `ui.verbosity` always comes from T1 or defaults — T2 and T3 cannot override it.

---

## Cascade resolution

Resolution follows precedence T3 > T2 > T1 > default, implemented in `lib/config-cascade.ts::resolveConfig`. The merge semantics come from `lib/project-config.ts::deepMerge` and are extended by `deepMergeWithProvenance` which records the winning tier for every leaf as a dot-path map. Primitives replace at each tier boundary; objects deep-merge recursively; arrays replace entirely (no per-element merging); `null` is an explicit leaf that terminates delegation; `undefined` or absence delegates to the wider tier. The final `ResolvedConfig.__sources` map exposes which tier each setting came from.

When a tier file fails to parse, `resolveConfig` throws `ConfigCascadeError` with `code: 'read'` (I/O failure) or `code: 'parse'` (JSON or schema-validation failure). The error carries a `tier` field (`'user'` or `'project'`) and the absolute file `path`. The CLI maps `read` and `parse` errors to exit code 2; missing keys to exit code 1; success to exit code 0.

---

## Schema v2

Schema v2 has `version: 2` at the root. It carries six sections — two inherited from v1 and four new in Pass 3:

- `verification` — which commands run after subagent stop and after tool-call stop; the policy for each
- `cost` — per-session token budget limits and model pricing table
- `notify` — which push channels are active (`slack`, `telegram`, `discord`)
- `git` — workflow mode (`direct-commit` / `worktree-pr`) and base branch
- `eval` — which workflow steps trigger mandatory evaluation (`ideation`, `plan`, `execution`)
- `trivialRange` — scope-boundary for the trivial-path shortcut (`read-only` / `simple-edits`)

All six sections are optional at v2; missing sections fall through to `DEFAULT_CONFIG` (T2 defaults). V1 files continue to parse and resolve correctly via the two-schema AJV dispatch in `lib/project-config.ts`; `validateV1` and `validateV2` are compiled separately at module init. No auto-upgrade on read — a v1 file stays v1 until rewritten by `ensureConfigCascade` or a manual CLI write.

---

## CLI surface

The six existing subcommands (`init`, `get`, `set`, `delete`, `list`, `cleanup`) are unchanged. Pass 3 adds:

```
gobbi config resolve <key> [--session-id <id>] [--with-sources]
```

`<key>` is a dot-path into `ResolvedConfig` (e.g. `git.mode`, `verification.runAfterSubagentStop`). `--session-id` includes T3 in the cascade; omitting it resolves from T1 + T2 + default only. Exit codes: `0` key found (prints JSON value to stdout); `1` key not found (silent); `2` parse or I/O error (error on stderr). The `--with-sources` flag augments the output with a `tier` field showing which tier supplied the value.

The `get` subcommand continues to read the raw T3 session row without cascade merging — its output uses the SQLite column naming (`gitWorkflow`, not `git.mode`). Agents needing the merged cascade view must use `resolve`.

---

## Migration

`ensureConfigCascade(repoRoot)` runs during `gobbi workflow init` and `gobbi config init`. It executes four idempotent steps: (1) T2 rename — if `.gobbi/project-config.json` exists and `.gobbi/project/settings.json` does not, it renames the legacy file into the new location; (2) T1 legacy archive — if `.gobbi/settings.json` holds the old sessions-shape, it is archived to `settings.legacy.json` after the internal `ConfigStore` scope (Step 0, opened via `using`) has already migrated sessions into `config.db`; (3) T1 fresh init — writes `DEFAULT_USER_SETTINGS` when no T1 file exists; (4) `.gitignore` update — ensures `settings.json` is listed in `.gobbi/.gitignore`. The `using store = openConfigStore(repoRoot)` in Step 0 prevents WAL handle overlap with the file-system operations in Steps 1-4.

---

## Config vs. Memory

Configuration and memory both persist across sessions under `.gobbi/`, but they answer different questions. Configuration — `settings.json`, `project/settings.json`, `config.db` — answers "how should this user / project / session behave?" Memory — per-session event store, project gotchas, cross-session notes — answers "what happened and what did we learn?" They share the `.gobbi/` root but not a storage shape. The memory model is covered in `gobbi-memory/README.md`.

---

## Related docs

| Document | Covers |
|----------|--------|
| [`feature-pass-template.md`](../feature-pass-template.md) | Cross-feature pass patterns and locked conventions |
| [`gobbi-memory/README.md`](../gobbi-memory/README.md) | Sibling tier wiring — how memory and config share `.gobbi/` |
| [`v050-overview.md §Directory Split`](../../v050-overview.md) | The `.claude/` vs `.gobbi/` invariant; canonical directory layout |
| [`cli-as-runtime-api.md`](../cli-as-runtime-api.md) | Why agents use the CLI rather than direct file writes; `gobbi config` surface |
| [`deterministic-orchestration.md`](../deterministic-orchestration.md) | Five-step workflow; Workflow Configuration step populates T3 |

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [scenarios.md](scenarios.md) | 13 Gherkin scenarios with state traces — happy path, migration, edge cases |
| [checklist.md](checklist.md) | ISTQB-tagged verification items grouped by scenario ID |
| [review.md](review.md) | DRIFT and NOTE findings with resolutions and pinned commit SHAs |
