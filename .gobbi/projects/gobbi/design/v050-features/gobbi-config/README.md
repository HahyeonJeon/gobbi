# gobbi-config — Unified Settings Cascade

Feature description for gobbi's three-level configuration cascade. Read this to understand where settings live at each scope, how levels override one another, the unified `settings.json` shape, and the three-verb CLI surface. This is the design-of-record for Pass 3 (session `dfd4ff66`) updated in PR-FIN-1c (session `c34ea7e6`) for the GitSettings reshape and ProjectsRegistry removal, and PR-FIN-1a (session `c34ea7e6`) for the `gobbi config init` verb and session-id resolution hard-error.

---

> **Configuration is a cascade: session wins over project, project wins over workspace. Narrower always wins.**

Gobbi resolves every setting by composing three `settings.json` files — workspace, project, session — then applying built-in defaults. The merge is implemented in `packages/cli/src/lib/settings-io.ts::resolveSettings`. Direct file edits are supported at every level; `gobbi config get` reads the merged result; `gobbi config set` writes a single level.

---

## Three levels

| Level | Path | Git | Written by |
|---|---|---|---|
| workspace | `.gobbi/settings.json` | gitignored | `ensureSettingsCascade` seed on first run; `gobbi config init`; manual edit |
| project | `.gobbi/projects/<name>/settings.json` | tracked | `ensureSettingsCascade` seed; `gobbi config init --level project`; manual edit |
| session | `.gobbi/projects/<name>/sessions/{id}/settings.json` | gitignored (inherits `.gobbi/projects/<name>/sessions/`) | `/gobbi` setup FIFTH step; `gobbi config set`; `gobbi config init --level session` |

**Session-id resolution (PR-FIN-1a):** `--session-id` flag takes priority over `$CLAUDE_SESSION_ID` env. When neither is present, CLI commands that require a session id exit 2 with a remediation hint — no silent UUID fallback (removed in PR-FIN-1a). `gobbi workflow init` follows the same ladder: flag → env → hard error.

**Project-name resolution (PR-FIN-1c):** Project name resolves in priority order:
1. `--project <name>` flag — passed explicitly by CLI commands
2. `basename(repoRoot)` — the directory containing the repo

No registry. No `projects.active`. The presence of a directory under `.gobbi/projects/` is the only record that a project exists.

---

## Unified schema

One TypeScript interface. One AJV validator. All levels read and write the same shape. See `packages/cli/src/lib/settings.ts` for the authoritative type definitions and `DEFAULTS` constant.

### Schema sections

**`workflow`** — Grouped by step (`ideation`, `planning`, `execution`). Each step carries:
- `discuss: { mode, model, effort }` — `mode` is `'agent' | 'user' | 'auto' | 'skip'`
- `evaluate: { mode, model, effort }` — `mode` is `'ask' | 'always' | 'skip' | 'auto'`
- `model` and `effort` default to `'auto'`, deferring to `_delegation` and core-rule defaults
- `maxIterations: number` — per-step REVISE-loop iteration cap; default `3`. Schema-only this Pass — wiring to `state.maxFeedbackRounds` is deferred to a follow-up Pass that extends state to carry per-step caps

The `planning` field name matches the loop name in `deterministic-orchestration.md` ("Planning Loop") and the state-machine literal (renamed from `'plan'` in Pass 3). `resolveEvalDecision` accepts only `'planning'` — the `'plan'` backward-compat bridge was removed at Pass 3; callers still passing the legacy literal fail at compile time.

**`notify`** — Per-channel dict. Channels: `slack`, `telegram`, `discord`, `desktop`. Each carries:
- `enabled: boolean`
- `events: NotifyEvent[]` — gobbi workflow events; absent = all, `[]` = none, `[…]` = exactly those
- `triggers: HookTrigger[]` — Claude Code hook events (schema-only this Pass; dispatch wiring deferred)
- Channel-specific routing: `slack.channel`, `telegram.chatId`, `discord.webhookName` (non-secret; null = unset)

**`git`** — PR-FIN-1c flat shape with sub-objects per concern (see `packages/cli/src/lib/settings.ts::GitSettings`):
- `baseBranch: string | null` — PR target branch; `null` means no remote / no PR target
- `issue: { create: boolean }` — opt-in issue creation; default `false`
- `worktree: { autoRemove: boolean }` — auto-remove worktree after merge; default `true`
- `branch: { autoRemove: boolean }` — auto-remove branch after merge; default `true`
- `pr: { open: boolean, draft: boolean }` — `open` opts in to PR creation (default `true`); `draft` controls draft status (default `false`)

Worktrees are always created for every task — there is no `mode` enum. PR opening and issue creation are independent opt-in fields. The old `workflow`, `cleanup`, and `mode` sub-objects are gone.

**`schemaVersion`** — Required, always `1`. Single discriminator; no per-level versioning.

---

## Cascade resolution semantics

Resolution order: session → project → workspace → defaults. `resolveSettings({ repoRoot, sessionId?, projectName? })` in `settings-io.ts` loads each level and folds them left-to-right via `deepMerge` from `settings.ts`.

Merge rules (from `deepMerge`):
- **Primitives** replace at each level boundary
- **Objects** recurse leaf-by-leaf
- **Arrays replace** — no concat, no dedup; users must re-declare the full array at their level
- **`null` is an explicit leaf** — terminates delegation; `null` at session level overrides workspace `'main'`
- **`undefined` / absent** delegates to the wider level

---

## `notify.events` semantic (inverted)

`events` absent → channel fires on **all** gobbi workflow events.
`events: []` (empty array) → channel fires on **no** gobbi workflow events.
`events: [...]` → channel fires on exactly the listed events.

The built-in defaults seed `events: []` so channels are silent until the user opts in. Same rule applies to `triggers`.

---

## Cross-field check (PR-FIN-1c)

After cascade merge, `resolveSettings` checks: `git.pr.open === true` requires `git.baseBranch !== null`. The check fires only when the user has explicitly set `pr.open=true` somewhere in the cascade — a fresh repo where both values come from DEFAULTS is not flagged (the user has not opted into PR opening yet). Once a user sets `pr.open=true`, they must also set `baseBranch`.

Violation raises `ConfigCascadeError('parse', …)` without a `tier` (the violation is in the cascaded projection, not attributable to one level). For repos without a GitHub remote or preferring direct-commit workflows: set `pr.open: false`; `baseBranch` may stay `null`.

---

## CLI surface

Three verbs. No `list`, `delete`, `cleanup`, `resolve`, or `--with-sources`.

### `gobbi config init [--level workspace|project|session] [--session-id <id>] [--project <name>] [--force]` (PR-FIN-1a)

Scaffolds the minimum-valid `{schemaVersion: 1}` seed at the target level. Workspace is the default level.

- Default `--level workspace`
- Project resolves via `--project <name>` flag → `basename(repoRoot)` (same ladder as `gobbi config set`)
- Session level requires `--session-id` flag or `$CLAUDE_SESSION_ID` env; missing both exits 2 with recovery hint suggesting `--level workspace` or `--level project`
- Refuses with exit 2 if the target `settings.json` already exists; with `--force`, overwrites and emits a stderr WARN line naming the path
- Seed is minimum-valid only — the cascade supplies all other defaults at resolve time
- Exit codes: `0` success; `2` parse/validation/IO error, refuse-without-force, or missing session id

### `gobbi config get <key> [--level workspace|project|session] [--session-id <id>]`

- No `--level` → cascade-resolved (session → project → workspace → default)
- `--level <lvl>` → reads only that level's file; returns exit 1 if key absent at that level even if defaults supply a value
- Exit codes: `0` found (JSON value on stdout); `1` not found (silent); `2` parse/IO error (stderr)

### `gobbi config set <key> <value> [--level workspace|project|session] [--session-id <id>]`

- No `--level` → defaults to session (matches `/gobbi` setup behavior)
- Deep-path writes: split `<key>` on `.`, walk and create intermediate records, validate full tree against AJV schema, atomic write via temp+rename
- Value coercion: `"true"/"false"` → boolean; `"null"` → null; JSON-array with leading `[` → parsed array; else string
- Unknown keys fail validation with exit 2
- Exit codes: `0` success; `2` parse/validation/IO error

---

## Translation layer (`resolveEvalDecision`)

The state machine's EVAL_DECIDE event carries booleans. The new `evaluate.mode` enum has four values. `resolveEvalDecision(cascade, step, context)` exported from `settings-io.ts` translates:

| `mode` | Action | Boolean result |
|---|---|---|
| `'always'` | spawn evaluators without asking | `true` |
| `'skip'` | do not spawn evaluators | `false` |
| `'ask'` | prompt user; `context.userAnswer` required | user's yes/no |
| `'auto'` | orchestrator decides; `context.orchestratorDecision` required | orchestrator's decision |

Resolution fires at the eval checkpoint, not at config-write time.

---

## Legacy cleanup (PR-FIN-1c extended)

`ensureSettingsCascade(repoRoot, projectName?)` (in `ensure-settings-cascade.ts`) runs during `gobbi workflow init`. Steps:

1. If `.gobbi/config.db` exists — delete it and log
2. If `.claude/gobbi.json` exists — delete it and log
3. If `.gobbi/project-config.json` (T2-v1 legacy) exists and `.gobbi/projects/<name>/settings.json` does not — upgrade via `upgradeLegacyToSettings`: set `schemaVersion: 1`; convert `eval.{step}: bool → workflow.{step}.evaluate.mode` enum (`true→'always'`, `false→'ask'`); reshape `git.*` per the F2 migration table; drop `projects.*`, `trivialRange`, `verification.*`, `cost.*`, `ui.*`
4. If an existing `.gobbi/projects/<name>/settings.json` or `.gobbi/settings.json` carries legacy fields (`projects.*`, `git.workflow.*`, `git.cleanup.*`, `git.mode`) — upgrade it in place via `reshapeCurrentShape`. Idempotent: files already in the PR-FIN-1c shape are left untouched
5. Seed workspace `.gobbi/settings.json` if absent — minimum-valid seed is `{schemaVersion: 1}`. PR-FIN-1c removed the `projects` registry; the seed carries no `projects` block
6. Ensure `.gobbi/.gitignore` lists `settings.json` and `sessions/`

**Migration table for git fields** (applies to both T2-v1 and Pass-3-current shapes):

| Old field | New location | Mapping |
|---|---|---|
| `git.mode === 'worktree-pr'` | `git.pr.open` | `true` |
| `git.mode === 'direct-commit'` | `git.pr.open` | `false` |
| `git.mode === 'auto'` | `git.pr.open` | `true` |
| `git.workflow.mode` | (same) | (same) |
| `git.baseBranch` | `git.baseBranch` | (preserved) |
| `git.workflow.baseBranch` | `git.baseBranch` | (preserved) |
| `git.pr.draft` | `git.pr.draft` | (preserved) |
| `git.cleanup.worktree` | `git.worktree.autoRemove` | (preserved) |
| `git.cleanup.branch` | `git.branch.autoRemove` | (preserved) |
| (no equivalent) | `git.issue.create` | default `false` |
| `projects.active` / `projects.known` | (removed) | dropped silently |

---

## Config vs. memory

Configuration answers "how should this session behave?" Memory answers "what happened and what did we learn?" They share the `.gobbi/` root but not a storage shape. See [`gobbi-memory/README.md`](../gobbi-memory/README.md) for the memory model.

---

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [`scenarios.md`](scenarios.md) | Gherkin scenarios covering CLI paths, cascade, migration, error cases |
| [`checklist.md`](checklist.md) | ISTQB-tagged verification items grouped by scenario ID |
| [`review.md`](review.md) | DRIFT/NOTE/GAP findings with pinned commit SHAs |
| [`packages/cli/src/lib/settings.ts`](../../../../../packages/cli/src/lib/settings.ts) | TypeScript source of truth for the `Settings` interface and `DEFAULTS` |
| [`v050-overview.md §Directory Split`](../../v050-overview.md) | `.claude/` vs `.gobbi/` invariant; canonical directory layout |
| [`deterministic-orchestration.md`](../deterministic-orchestration.md) | Five-step workflow; Workflow Configuration step populates session settings |
