# gobbi-config — Unified Settings Cascade

Feature description for gobbi's three-level configuration cascade. Read this to understand where settings live at each scope, how levels override one another, the unified `settings.json` shape, and the two-verb CLI surface. This is the design-of-record for Pass 3 (session `dfd4ff66`).

---

> **Configuration is a cascade: session wins over project, project wins over workspace. Narrower always wins.**

Gobbi resolves every setting by composing three `settings.json` files — workspace, project, session — then applying built-in defaults. The merge is implemented in `packages/cli/src/lib/settings-io.ts::resolveSettings`. Direct file edits are supported at every level; `gobbi config get` reads the merged result; `gobbi config set` writes a single level.

---

## Three levels

| Level | Path | Git | Written by |
|---|---|---|---|
| workspace | `.gobbi/settings.json` | gitignored | `ensureSettingsCascade` seed on first run; manual edit |
| project | `.gobbi/projects/<name>/settings.json` | tracked | `ensureSettingsCascade` seed; manual edit |
| session | `.gobbi/projects/<name>/sessions/{id}/settings.json` | gitignored (inherits `.gobbi/projects/<name>/sessions/`) | `/gobbi` setup FIFTH step; `gobbi config set` |

Session-id resolution: `$CLAUDE_SESSION_ID` env is the CLI-level primary; `--session-id` flag is the fallback. The `/gobbi` skill discovers the real session id per the `session-id-discovery` gotcha (primary env is `$CODEX_COMPANION_SESSION_ID` at the skill level) and passes `--session-id` explicitly when the env is not populated.

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

**`git`** — Three sub-objects:
- `workflow: { mode, baseBranch }` — `mode` is `'direct-commit' | 'worktree-pr' | 'auto'` (`'auto'` defers the choice to the orchestrator at workflow-decision time); `baseBranch: string | null`
- `pr: { draft }` — open PRs as drafts by default
- `cleanup: { worktree, branch }` — auto-remove worktree/branch after merge

**`schemaVersion`** — Required, always `1`. Single discriminator; no per-level versioning.

---

## Cascade resolution semantics

Resolution order: session → project → workspace → defaults. `resolveSettings({ repoRoot, sessionId })` in `settings-io.ts` loads each level and folds them left-to-right via `deepMerge` from `settings.ts`.

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

## Cross-field check

After cascade merge, `resolveSettings` checks: `git.workflow.mode === 'worktree-pr'` requires `git.workflow.baseBranch !== null`. Violation raises `ConfigCascadeError('parse', …)` with `tier` identifying which level asserted the invalid combination. Catching at resolve time prevents worktree creation failures downstream.

---

## CLI surface

Two verbs. No `init`, `list`, `delete`, `cleanup`, `resolve`, or `--with-sources`.

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

## Legacy cleanup

`ensureSettingsCascade(repoRoot)` (in `ensure-settings-cascade.ts`) runs during `gobbi workflow init`. Steps:

1. If `.gobbi/config.db` exists — delete it and log
2. If `.claude/gobbi.json` exists — delete it and log
3. If `.gobbi/project-config.json` (T2-v1 legacy) exists and `.gobbi/projects/<name>/settings.json` does not — upgrade: rename path, set `schemaVersion: 1`, restructure `git.mode → git.workflow.mode`, convert `eval.{step}: bool → workflow.{step}.evaluate.mode` enum (`true→'always'`, `false→'ask'`), drop `trivialRange`, `verification.*`, `cost.*`, `ui.*`
4. Seed workspace and project defaults if absent
5. Ensure `.gobbi/.gitignore` lists `settings.json` and `sessions/`

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
