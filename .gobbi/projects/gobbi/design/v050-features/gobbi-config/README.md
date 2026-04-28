# gobbi-config — Unified Settings Cascade

Feature description for gobbi's three-level configuration cascade. Read this to understand where settings live at each scope, how levels override one another, the unified `settings.json` shape, and the three-verb CLI surface. This is the design-of-record for Pass 3 (session `dfd4ff66`) updated in PR-FIN-1c (session `c34ea7e6`) for the GitSettings reshape and ProjectsRegistry removal, PR-FIN-1a (session `c34ea7e6`) for the `gobbi config init` verb and session-id resolution hard-error, and PR-FIN-1b (session `c34ea7e6`) for `gobbi config env`, the `gobbi hook` namespace, and `$CLAUDE_ENV_FILE` persistence.

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

**Session-id resolution (PR-FIN-1a, updated by PR-FIN-1b):** `--session-id` flag takes priority over `$CLAUDE_SESSION_ID` env. When neither is present, CLI commands that require a session id exit 2 with a remediation hint — no silent UUID fallback (removed in PR-FIN-1a). `gobbi workflow init` follows the same ladder: flag → env → hard error.

After PR-FIN-1b, `$CLAUDE_SESSION_ID` is populated automatically by the SessionStart hook: Claude Code fires the hook → `gobbi hook session-start` reads the stdin JSON payload → `gobbi config env` writes `CLAUDE_SESSION_ID` (and other `CLAUDE_*` vars) to `$CLAUDE_ENV_FILE` → Claude Code sources the env file → all subsequent commands in the session inherit the env var. The `/gobbi` skill calls `gobbi config get …` directly without a discovery dance. See §`gobbi hook` namespace and §Session-id resolution below for details.

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

Five verbs. No `list`, `delete`, `cleanup`, `resolve`, or `--with-sources`.

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

### `gobbi config env` (PR-FIN-1b)

```
gobbi config env
```

Single-action verb. Reads the hook's stdin JSON payload AND any natively-provided `CLAUDE_*` env vars; writes a unified set of `KEY=VALUE` lines to `$CLAUDE_ENV_FILE`. No flags — behavior is fully driven by stdin payload and native env.

**Behavior:**
1. Acquire payload — read stdin JSON via `lib/stdin.ts::readStdinJson` (TTY-safe). If `$CLAUDE_ENV_FILE` is unset, emit stderr WARN and exit 0 (non-blocking).
2. Compose env vars — from stdin JSON: `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `agent_id` (optional), `agent_type` (optional), `permission_mode` (optional). From native env passthrough: `CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`, `CLAUDE_PLUGIN_DATA` (only those that are set).
3. Upsert each as `KEY=VALUE\n` line in `$CLAUDE_ENV_FILE` — creates the file if absent; replaces existing line for same KEY (idempotent); does not clobber lines owned by other tools.
4. Exit 0 on success; exit 2 on IO error.

**Env vars persisted to `$CLAUDE_ENV_FILE`:**

| Source | Key written |
|---|---|
| stdin JSON `session_id` | `CLAUDE_SESSION_ID` |
| stdin JSON `transcript_path` | `CLAUDE_TRANSCRIPT_PATH` |
| stdin JSON `cwd` | `CLAUDE_CWD` |
| stdin JSON `hook_event_name` | `CLAUDE_HOOK_EVENT_NAME` |
| stdin JSON `agent_id` (if present) | `CLAUDE_AGENT_ID` |
| stdin JSON `agent_type` (if present) | `CLAUDE_AGENT_TYPE` |
| stdin JSON `permission_mode` (if present) | `CLAUDE_PERMISSION_MODE` |
| native env `CLAUDE_PROJECT_DIR` (if set) | `CLAUDE_PROJECT_DIR` |
| native env `CLAUDE_PLUGIN_ROOT` (if set) | `CLAUDE_PLUGIN_ROOT` |
| native env `CLAUDE_PLUGIN_DATA` (if set) | `CLAUDE_PLUGIN_DATA` |

**Primary use case:** invoked by `gobbi hook session-start` to persist the session's `CLAUDE_*` env vars before `gobbi workflow init` runs. Subsequent CLI commands and the `/gobbi` skill inherit these vars from `$CLAUDE_ENV_FILE` for the remainder of the session.

### `gobbi hook <event>` namespace (PR-FIN-1b)

```
gobbi hook session-start
gobbi hook pre-tool-use
gobbi hook post-tool-use
gobbi hook subagent-stop
gobbi hook stop
gobbi hook session-end
... (23 additional events — see full list below)
```

One canonical hook entrypoint per Claude Code hook event. All 28 events are registered. Five events have non-trivial bodies that replace the previous `gobbi workflow *` direct registrations; the remaining 23 are generic stubs (read stdin, exit 0) pending PR-FIN-1d notify dispatch.

**Non-trivial bodies (5):**

| Event | Internal sequence |
|---|---|
| `session-start` | `gobbi config env` → `gobbi workflow init` → TODO(PR-FIN-1d) notify dispatch |
| `pre-tool-use` | `gobbi workflow guard` → TODO(PR-FIN-1d) notify dispatch |
| `post-tool-use` (matcher: ExitPlanMode) | `gobbi workflow capture-planning` → TODO(PR-FIN-1d) notify dispatch |
| `subagent-stop` | `gobbi workflow capture-subagent` → TODO(PR-FIN-1d) notify dispatch |
| `stop` | `gobbi workflow stop` → TODO(PR-FIN-1d) notify dispatch |

**Generic stubs (23):** `session-end`, `stop-failure`, `user-prompt-submit`, `user-prompt-expansion`, `post-tool-use-failure`, `post-tool-batch`, `permission-request`, `permission-denied`, `notification`, `subagent-start`, `task-created`, `task-completed`, `teammate-idle`, `pre-compact`, `post-compact`, `worktree-create`, `worktree-remove`, `file-changed`, `cwd-changed`, `instructions-loaded`, `config-change`, `elicitation`, `elicitation-result`. Each reads stdin, exits 0. Notify dispatch wiring is deferred to PR-FIN-1d.

**Stdin payload flow:** each handler reads stdin once; passes the parsed payload (or relevant fields) to sub-steps via in-process function call — no double-read. Sub-steps that do not need the full payload receive env vars already set by earlier steps.

**Plugin manifest:** `plugins/gobbi/hooks/hooks.json` registers all 28 Claude Code events with `gobbi hook <event>` commands. Per-repo `.claude/settings.json` mirrors the same 28 entries.

**Independence:** the existing `gobbi workflow init`, `gobbi workflow guard`, etc. commands remain independently invocable. `gobbi hook <event>` orchestrates them but does not replace them — direct `gobbi workflow init --session-id manual123` continues to work for testing.

---

## Session-id resolution + `$CLAUDE_ENV_FILE` (PR-FIN-1b)

The session-id resolution ladder for `gobbi workflow init` (post-PR-FIN-1b):

| Priority | Source | Behavior |
|---|---|---|
| 1 | `--session-id <id>` flag | Use directly |
| 2 | `$CLAUDE_SESSION_ID` env | Use directly — reliably set via `$CLAUDE_ENV_FILE` after `gobbi hook session-start` fires |
| 3 | (none) | Exit 2 with remediation hint — no UUID fallback |

Stdin-JSON extraction does NOT live in `init.ts`. It lives in `gobbi hook session-start`, which is the single site responsible for hook payloads.

**SessionStart flow (runtime behavior):**

```
Claude Code fires SessionStart
  → plugins/gobbi/hooks/hooks.json: "gobbi hook session-start"
  → 1. parse stdin JSON (session_id, transcript_path, cwd, hook_event_name, …)
  → 2. set process.env.CLAUDE_SESSION_ID = session_id (in-process, for subsequent steps)
  → 3. invoke gobbi config env → writes CLAUDE_* lines to $CLAUDE_ENV_FILE
  → 4. invoke gobbi workflow init → reads CLAUDE_SESSION_ID from env; opens session DB
  → 5. TODO(PR-FIN-1d) — dispatch notify if SessionStart in channel triggers
  → 6. exit 0 (hooks must not block Claude Code)
Claude Code sources $CLAUDE_ENV_FILE → all subsequent commands inherit CLAUDE_*
/gobbi skill calls: gobbi config get workflow --level session  (env var already in env)
```

**`/gobbi` skill (post-PR-FIN-1b):** The "Discovering the real session ID" section has been removed from SKILL.md. The skill calls `gobbi config get …` directly — `$CLAUDE_SESSION_ID` is already in env from `$CLAUDE_ENV_FILE`. The `cli-vs-skill-session-id` gotcha has been retired.

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

## Legacy cleanup (continued)

**Hook registration migration (PR-FIN-1b):** Prior to PR-FIN-1b, `plugins/gobbi/hooks/hooks.json` and `.claude/settings.json` registered 5 entries pointing directly at `gobbi workflow init`, `gobbi workflow guard`, `gobbi workflow capture-planning`, `gobbi workflow capture-subagent`, and `gobbi workflow stop`. PR-FIN-1b replaces those 5 entries with 28 entries pointing at `gobbi hook <event>`. The underlying `gobbi workflow *` commands remain unchanged — only the hook dispatch entry-point changed.

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
| [`packages/cli/src/commands/config.ts`](../../../../../packages/cli/src/commands/config.ts) | `runConfigEnv` implementation |
| [`packages/cli/src/commands/hook.ts`](../../../../../packages/cli/src/commands/hook.ts) | `gobbi hook` namespace dispatcher; `HOOK_COMMANDS` registry |
| [`packages/cli/src/__tests__/features/hook.test.ts`](../../../../../packages/cli/src/__tests__/features/hook.test.ts) | HOOK-1..6 integration tests |
| [`v050-overview.md §Directory Split`](../../v050-overview.md) | `.claude/` vs `.gobbi/` invariant; canonical directory layout |
| [`deterministic-orchestration.md`](../deterministic-orchestration.md) | Five-step workflow; Workflow Configuration step populates session settings |
