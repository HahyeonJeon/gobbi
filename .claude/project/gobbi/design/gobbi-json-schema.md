# gobbi.json Session Config Schema

Design document for `gobbi.json` — the session configuration file that stores per-session workflow options. This file is **gitignored** in v0.3.2. Version metadata moves to `package.json`.

---

## File Location

`$CLAUDE_PROJECT_DIR/.claude/gobbi.json`

Created by `gobbi-config.sh init` on first use. Lives alongside `settings.json` and `.env` in `.claude/`. Not distributed via the plugin — each installation creates its own local copy.

---

## Complete JSON Schema

```json
{
  "version": "0.3.2",
  "architecture": "claude-source",
  "sessions": {
    "<CLAUDE_SESSION_ID>": {
      "notify": {
        "slack": false,
        "telegram": false
      },
      "trivialRange": "read-only",
      "evaluationMode": "ask-each-time",
      "gitWorkflow": "direct-commit",
      "baseBranch": null,
      "createdAt": "2026-04-03T12:00:00Z",
      "lastAccessedAt": "2026-04-03T12:00:00Z"
    }
  }
}
```

---

## Top-Level Fields

| Field | Type | Required | Default | Description |
|:------|:-----|:---------|:--------|:------------|
| `version` | string | Yes | `"0.3.2"` | Gobbi version that created or last migrated the file. Semver format. |
| `architecture` | string | Yes | `"claude-source"` | Architecture identifier. Always `"claude-source"`. |
| `sessions` | object | Yes | `{}` | Map of session configurations, keyed by `CLAUDE_SESSION_ID` (UUID v4 string). |

---

## Per-Session Fields

Each key in `sessions` is a `CLAUDE_SESSION_ID` (UUID string). The value is an object with the following fields.

### notify (object)

Notification channel preferences. Controls which channels `notify-send.sh` delivers to — even when credentials exist in `.env`, a channel is only used if the session flag is `true`.

| Field | Type | Default | Description |
|:------|:-----|:--------|:------------|
| `slack` | boolean | `false` | Send Slack notifications. Requires `SLACK_BOT_TOKEN` + `SLACK_USER_ID` in `.env`. |
| `telegram` | boolean | `false` | Send Telegram notifications. Requires `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` in `.env`. |

Discord deferred to a future version (no delivery code in `notify-send.sh`). Desktop notifications (`NOTIFY_DESKTOP`) are environment-level, not session-level.

**Interaction with `.env`:** Both conditions must be true: session flag is `true` AND credentials present. Missing either suppresses the notification.

**Safe default:** No session entry = all flags `false`. No notifications until user explicitly selects during `/gobbi` setup.

### trivialRange (string)

| Value | Meaning |
|:------|:--------|
| `"read-only"` | Only reading, explaining, searching. Any code change delegated. |
| `"simple-edits"` | Above plus single-file obvious changes. |

Default: `"read-only"`. Source: Setup Q1.

### evaluationMode (string)

| Value | Meaning |
|:------|:--------|
| `"ask-each-time"` | Ask before each evaluation stage. |
| `"always-evaluate"` | Always spawn evaluators. |
| `"skip-evaluation"` | Never spawn evaluators unless explicitly requested. |

Default: `"ask-each-time"`. Source: Setup Q2.

### gitWorkflow (string)

| Value | Meaning |
|:------|:--------|
| `"direct-commit"` | Work in main tree. Commits at FINISH. |
| `"worktree-pr"` | Each task gets worktree + branch + PR. Requires `baseBranch`. |

Default: `"direct-commit"`. Source: Setup Q3.

### baseBranch (string | null)

Branch for feature branches when `gitWorkflow` is `"worktree-pr"`. Must be `null` when `"direct-commit"`. Default: `null`.

### createdAt / lastAccessedAt (string)

ISO 8601 timestamps (`YYYY-MM-DDTHH:MM:SSZ`). `createdAt` is immutable after first write. `lastAccessedAt` updated on every `set` call. Used by cleanup algorithm.

---

## Cleanup Algorithm

Two rules, applied in order on every write (`set`, `init`). Runs inside the flock, after primary write, before final `mv`.

### Step 1: TTL Expiration

Remove sessions where `lastAccessedAt` is older than 7 days.

### Step 2: Max Entries Cap

If more than 10 sessions remain after TTL, remove oldest by `lastAccessedAt` until 10 remain.

---

## Migration Handling

### v0.3.1 Format Detection

File has `version` field but no `sessions` key.

### Migration Steps

1. Preserve `version` and `architecture`
2. Add `"sessions": {}`
3. Update `version` to `"0.3.2"`
4. Write via atomic path (inside flock)

---

## CRUD Operations

### Common Behavior

- File: `$CLAUDE_PROJECT_DIR/.claude/gobbi.json`
- Dependencies: `jq` (required), `flock` (required for writes)
- Migration check on every operation
- Exit codes: 0 = success, 1 = error

### init

`gobbi-config.sh init` — Create with defaults if missing, or upgrade v0.3.1 format.

### get

`gobbi-config.sh get <session-id> [key]` — Read full session or specific field via dot-path. Returns raw value (no JSON quoting). No output if missing.

### set

`gobbi-config.sh set <session-id> <key> <value>` — Write field. Creates session with defaults if new. Updates `lastAccessedAt`. Runs cleanup. Type coercion: `true`/`false` → boolean, `null` → null, else → string.

### delete

`gobbi-config.sh delete <session-id>` — Remove session entry.

### list

`gobbi-config.sh list` — List all session IDs with creation dates. Tab-separated, sorted by `createdAt`.

### cleanup

`gobbi-config.sh cleanup` — Explicitly run TTL + max-entries.

---

## Concurrency Model

All write operations use flock on a separate lockfile (`${GOBBI_JSON}.lock`):

1. Acquire flock (5-second timeout)
2. Read current state
3. Migrate if needed
4. Modify in memory (jq)
5. Write to temp file (`mktemp` in same directory)
6. Atomic `mv` to gobbi.json
7. Release flock

Read-only operations (`get`, `list`) do not acquire flock unless migration is triggered.

Using separate lockfile because `mv` replaces the fd that flock would hold on the data file itself.
