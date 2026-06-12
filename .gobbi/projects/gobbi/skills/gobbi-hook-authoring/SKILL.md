---
name: gobbi-hook-authoring
description: "Load when authoring or reviewing Gobbi hooks. Covers bash, jq, flock, strict mode, env files, and agents[] upserts."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Gobbi Hook Authoring

Project skill for every agent writing or reviewing a Claude Code hook in the gobbi codebase. Loaded at Study phase when a task touches `.claude/hooks/` or asks for guidance on hook design.

Two in-tree witnesses ground every rule below. Read them fully before any hook work:

- `.claude/hooks/session-start.sh` (79 lines) — SessionStart event; reads stdin JSON and appends `export VAR=value` lines to `$CLAUDE_ENV_FILE` for downstream Bash tool calls and subagents.
- `.claude/hooks/post-tool-use-agents.sh` (251 lines) — PostToolUse and PostToolUseFailure events; upserts an `agents[]` entry in `session.json` for every spawned Task/Agent tool call, using `flock -x` serialization and atomic `mv`.

---

## When to load

- When editing any file under `.claude/hooks/`
- When constructing a delegation prompt for an executor whose task creates or modifies a hook
- When evaluating a hook-authoring artifact
- When the task description references hook registration, stdin JSON payload, or `session.json` upsert patterns

---

## Core Principles

> **A hook that blocks Claude is worse than a missed record.**

PostToolUse/PostToolUseFailure hooks MUST always exit 0. Diagnostics go to stderr; the script must never abort the tool call it is hooked to. Use a `bail()` function that logs and `exit 0`s gracefully. The `session-start.sh` is the exception — it exits 1 (fatal) for: the `$CLAUDE_ENV_FILE` env-file guard (unset or unwritable), an empty or missing stdin payload, and required-export failures under `set -euo pipefail` strict mode. Any of these makes the env-passthrough entirely unreliable, so exit 1 is correct.

> **Strict mode, but scope it correctly.**

`session-start.sh` uses `set -euo pipefail` because any failure in the env passthrough is fatal — there is no meaningful fallback. `post-tool-use-agents.sh` uses `set -uo pipefail` but NOT `-e`, because individual extraction steps may legitimately produce empty strings or non-zero exits that should not abort the whole hook.

> **jq -r @sh for every JSON value written to a shell file.**

When writing `export VAR=value` lines to `$CLAUDE_ENV_FILE`, always serialize via `jq -r '@sh "export VAR=\(.field)"'`. The `@sh` format produces POSIX single-quote quoting that is safe against paths with spaces, shell metacharacters, empty strings, single quotes, and Unicode. Never use raw string concatenation or printf for this purpose.

> **flock -x serializes every read-modify-write on shared JSON files.**

Any hook that reads, modifies, and writes a shared file (e.g., `session.json`) must hold an exclusive flock for the entire critical section. Release is automatic when the subshell exits. Validate the output JSON before the atomic `mv`; if validation fails, delete the tmp file and `exit 0` (do not replace the original with garbage).

> **Tool-name scope filter before any real work.**

Hooks registered for broad events (PostToolUse fires on every tool) MUST filter to the specific tool(s) they care about as the very first substantive check after stdin parsing. Use a `case` statement; unrecognized tool names must `exit 0` cleanly, not fall through to the hook logic.

---

## Procedures

### P1 — Hook event registration in `.claude/settings.json`

Register every hook under `hooks.<EventName>[]` in `.claude/settings.json`. Each entry must have:

- `matcher`: a regex string matched against `tool_name` (for PostToolUse/PostToolUseFailure) or the top-level `source` field (for SessionStart). Use `|` for alternatives: `"Task|Agent"` matches both Task and Agent tool names. For SessionStart, the matcher is matched against the top-level `source` field (distinct from `hook_event_name`); the current project uses `"startup|resume|clear|compact"` to cover all SessionStart triggers.
- `hooks[].type`: must be `"command"` — required field in every hook command object.
- `hooks[].command`: the bare path to the hook script, e.g. `".claude/hooks/session-start.sh"` (no `bash ` prefix).

Both PostToolUse and PostToolUseFailure entries can point to the same script (as `post-tool-use-agents.sh` does) — the hook reads `hook_event_name` from stdin to distinguish the event type.

Example shape (from project settings):
```json
"SessionStart": [
  {
    "matcher": "startup|resume|clear|compact",
    "hooks": [{ "type": "command", "command": ".claude/hooks/session-start.sh" }]
  }
],
"PostToolUse": [
  {
    "matcher": "Task|Agent",
    "hooks": [{ "type": "command", "command": ".claude/hooks/post-tool-use-agents.sh" }]
  }
],
"PostToolUseFailure": [
  {
    "matcher": "Task|Agent",
    "hooks": [{ "type": "command", "command": ".claude/hooks/post-tool-use-agents.sh" }]
  }
]
```

### P2 — stdin JSON payload structure

Claude Code pipes a JSON object to stdin on every hook event. Always read it with `payload="$(cat)"` at the top of the script, then parse with `jq`. Never stream stdin directly into multiple `jq` calls — read once, use `<<<"$payload"` for all subsequent extractions.

Common fields present across all events:
- `session_id` — the current session UUID
- `cwd` — the working directory at hook invocation
- `hook_event_name` — the event name string (e.g., `"PostToolUse"`)
- `transcript_path` — path to the session transcript JSONL

PostToolUse/PostToolUseFailure also include:
- `tool_name` — name of the tool that was used (e.g., `"Task"`, `"Agent"`)
- `tool_use_id` — UUID that correlates the tool call across hook events and transcript entries
- `tool_input` — the full tool input object (for Task/Agent: includes `prompt`, `model`, `subagent_type`)
- `tool_result` — the canonical result object (PostToolUse only)

SessionStart includes:
- `source` — one of `startup`, `resume`, `clear`, `compact`
- `agent_id`, `agent_type`, `permission_mode` — optional fields, null when absent

### P3 — env-file passthrough pattern (from session-start.sh)

The env-file passthrough writes shell-safe `export VAR=value` lines to `$CLAUDE_ENV_FILE` so downstream Bash tool calls and subagents can source the file to pick up the exported values.

Three tiers:

**REQUIRED fields** — always present in the payload; emit unconditionally:
```bash
jq -r '@sh "export CLAUDE_CODE_SESSION_ID=\(.session_id)"' <<<"$payload" >> "${CLAUDE_ENV_FILE}"
```

**OPTIONAL fields** — may be null; emit only when non-null:
```bash
jq -r 'if .agent_id != null then @sh "export CLAUDE_AGENT_ID=\(.agent_id)" else empty end' \
    <<<"$payload" >> "${CLAUDE_ENV_FILE}"
```

**PASSTHROUGH re-exports** — re-export if already set in this process's environment (use `%q` quoting, which is bash-only — safe because the shebang is `#!/usr/bin/env bash`):
```bash
for _var in CLAUDE_PROJECT_DIR CLAUDE_PLUGIN_ROOT CLAUDE_PLUGIN_DATA; do
    if [[ -n "${!_var:-}" ]]; then
        printf 'export %s=%q\n' "${_var}" "${!_var}" >> "${CLAUDE_ENV_FILE}"
    fi
done
```

Note: `session-start.sh` exports `CLAUDE_CODE_SESSION_ID` from the payload's `session_id` field. In a hook context, `$CLAUDE_CODE_SESSION_ID` refers to the session Claude Code is running — the parent session for a manager hook, the subagent session for a subagent hook. This is hook-mechanics documentation; do not confuse it with the delegation-prompt `session-id:` field used for file-path construction in agent skills.

### P4 — agents[] upsert pattern with flock (from post-tool-use-agents.sh)

The critical section for a read-modify-write on `session.json`:

```bash
lock_file="$session_json.lock"
tmp_file="$session_json.tmp.$$"

(
    flock -x 9 || { log "flock failed on $lock_file"; exit 0; }

    # jq pipeline: upsert by id; atomic mv
    if ! jq --argjson new "$upsert_input" '
        .agents = (
            (.agents // [])
            | (map(.id) | index($new.id)) as $idx
            | if $idx == null
              then . + [ $new + { startedAt: ($new.finishedAt) } ]
              else (.[$idx] | (.startedAt // $new.finishedAt)) as $kept_started
                   | .[0:$idx]
                     + [ .[$idx] + $new + { startedAt: $kept_started } ]
                     + .[$idx+1:]
              end
        )
    ' "$session_json" > "$tmp_file"; then
        log "jq upsert failed"
        rm -f "$tmp_file"
        exit 0
    fi

    if ! jq -e . "$tmp_file" >/dev/null 2>&1; then
        log "tmp file failed JSON validation"
        rm -f "$tmp_file"
        exit 0
    fi

    mv -f "$tmp_file" "$session_json"
) 9>"$lock_file"
```

Key points:
- The `(...)  9>"$lock_file"` subshell holds the lock for the entire read-modify-write.
- `flock -x 9` blocks until the lock is acquired; the `|| { log ...; exit 0; }` guard handles the rare case where flock itself fails.
- Always validate the tmp file with `jq -e .` before `mv` — never replace the original with invalid JSON.
- Use `$$.` in the tmp filename to make it process-unique and avoid collisions from concurrent hook invocations.

### P5 — two-tier extraction (from post-tool-use-agents.sh)

When extracting rich result data, prefer the `toolUseResult` from the transcript JSONL (tier 1 — richer, includes `agentId`, `agentType`, `usage`, `totalDurationMs`) and fall back to the `tool_result` from stdin (tier 2 — canonical but leaner):

```bash
tier1=""
if [[ -n "$transcript_path" && -f "$transcript_path" ]]; then
    tier1=$(jq -c --arg tuid "$tool_use_id" '
        select(.toolUseResult != null)
        | select((.message.content[]?.tool_use_id // empty) == $tuid)
    ' "$transcript_path" 2>/dev/null | tail -n1 || true)
fi
```

Use `tail -n1` to pick the last matching line — retries supersede earlier attempts. Fall back to `jq -c '.tool_result // null' <<<"$payload"` when tier 1 is empty.

### P6 — session-dir resolver pattern

When the hook needs to locate `session.json` given `session_id` and `cwd`, use a two-step resolver:

1. **Step (i) DORMANT**: read `$cwd/.gobbi/project.json` if it exists; extract `.name`.
2. **Step (ii) ACTIVE**: scan `$cwd/.gobbi/projects/` — if exactly one project directory exists, use its basename. If zero or more than one, `bail`.

Then scan `$project_dir/sessions/` for a directory whose suffix matches the `session_id` UUID. Require exactly one match; bail if ambiguous.

### P7 — testing and verification of a hook

Before merging any hook change:

1. Run the hook manually with a minimal valid stdin payload. For a SessionStart hook,
   `$CLAUDE_ENV_FILE` must be set and writable — use a temp file so the env-file guard
   (lines 32-39 of `session-start.sh`) passes:
   ```bash
   CLAUDE_ENV_FILE=$(mktemp) \
     bash .claude/hooks/session-start.sh \
     <<< '{"session_id":"00000000-0000-0000-0000-000000000001","transcript_path":"/tmp/transcript.jsonl","cwd":"/tmp","hook_event_name":"SessionStart","source":"startup"}'
   ```
   For a PostToolUse hook:
   ```bash
   echo '{"session_id":"00000000-0000-0000-0000-000000000001","transcript_path":"/tmp/transcript.jsonl","cwd":"/tmp","hook_event_name":"PostToolUse","tool_name":"Task","tool_use_id":"tu-001","tool_input":{"prompt":"hello"},"tool_result":{}}' \
     | bash .claude/hooks/post-tool-use-agents.sh
   ```
   Confirm the hook exits 0 and produces the expected output.
2. Verify the hook is registered in `.claude/settings.json` under the correct event and matcher.
3. Start a Claude Code session and trigger the event. Inspect the output file or `session.json` to confirm the hook fired.
4. Test the failure path with malformed JSON. The expected behavior differs by hook class:
   - **PostToolUse/PostToolUseFailure hooks**: must always exit 0 — the `bail()` function logs
     to stderr and exits 0 even when stdin is malformed; verify no output file is corrupted.
   - **SessionStart hooks**: exit non-zero (fatal) when stdin is empty or malformed, because
     `session-start.sh` runs under `set -euo pipefail` and any `jq` failure on a required field
     is unrecoverable — the entire env passthrough is unreliable; verify the hook exits 1 and
     logs the error to stderr.
5. For `flock`-based hooks: confirm concurrent invocations (two background processes simultaneously) produce a valid merged result.

---

## Constraints

- **MUST always exit 0 in PostToolUse and PostToolUseFailure hooks** — a non-zero exit blocks the tool call that triggered the hook. Log diagnostics to stderr; never abort the hook for recoverable conditions.
- **MUST use `jq -r @sh`** for writing JSON string values into shell `export` lines — never raw string interpolation or printf without quoting.
- **MUST hold `flock -x` for the entire read-modify-write critical section** — acquire the lock at the top of the subshell; release is automatic at subshell exit.
- **MUST validate the tmp file with `jq -e .` before `mv`** — replacing a valid JSON file with invalid JSON is unrecoverable without manual intervention.
- **MUST filter by tool_name** before executing hook logic in PostToolUse/PostToolUseFailure hooks — use a `case` statement; all non-matching tool names exit 0 immediately.
- **MUST use `bail()`** (log to stderr + `exit 0`) for every error condition in PostToolUse/PostToolUseFailure hooks — never `exit 1` from these events.
- **NEVER use `-e` in `set -euo pipefail`** for PostToolUse/PostToolUseFailure hooks — individual `jq` extractions may legitimately fail; `-e` would abort the whole hook on a missing optional field.
- **NEVER stream stdin to multiple `jq` calls** — read `payload="$(cat)"` once at the top; use `<<<"$payload"` for all subsequent `jq` invocations.
- **NEVER write to `$CLAUDE_ENV_FILE` without first checking it is set and writable** — the guard at the top of `session-start.sh` (lines 32-39) is the required pattern.
- **ALWAYS register the hook in `.claude/settings.json`** under the correct event name and matcher — an unregistered hook never fires.

---

## Anti-patterns

- **Forgetting the tool-name filter** — registering a PostToolUse hook for a broad matcher without the `case "$tool_name" in ... esac` filter causes the hook to run on every tool invocation (Read, Write, Edit, Bash, ...) rather than only Task/Agent spawns. Add the filter immediately after stdin parsing.

- **Raw string quoting in env-file exports** — writing `echo "export MYVAR=$value" >> "$CLAUDE_ENV_FILE"` is fragile if `$value` contains spaces, dollar signs, or single quotes. Always use `jq -r '@sh'` for JSON-sourced values; use `printf '%q'` for values sourced from the shell environment.

- **Non-atomic file replacement** — writing directly to `session.json` without a tmp-file `mv` risks a partial write if the hook is interrupted mid-write. Always write to a tmp file, validate, then `mv -f`.

- **Using `set -e` in PostToolUse hooks** — a single non-zero exit from a `jq` extraction (e.g., a missing optional field returns 1 even with `// null`) will abort the hook mid-script and produce an unpredictable partial state. Omit `-e`; use explicit `|| true` on fallible extractions.

- **Hardcoding session paths** — never hardcode the session UUID or session directory path in hook scripts. Always derive the session directory by resolving from `session_id` + `cwd` via the two-step resolver pattern (P6).

---

## Output paths

Hooks write to files at runtime; the paths below are the live runtime targets, not session staging paths.

| Output | Path | Written by | Event |
|---|---|---|---|
| Env-var export lines | `$CLAUDE_ENV_FILE` (runtime env; path set by Claude Code) | `session-start.sh` | SessionStart |
| agents[] entry in session.json | `.gobbi/projects/{project}/sessions/{date}-{uuid}/session.json` | `post-tool-use-agents.sh` | PostToolUse / PostToolUseFailure |

Hook scripts themselves live at:

| File | Event | Lines |
|---|---|---|
| `.claude/hooks/session-start.sh` | SessionStart | 79 |
| `.claude/hooks/post-tool-use-agents.sh` | PostToolUse + PostToolUseFailure | 251 |

Registration is in `.claude/settings.json` under the `hooks` key, one array entry per event.
