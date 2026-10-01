# Session hooks

## Intent

Claude, Codex, and Grok in this checkout run the hooks in `plugins/gobbi/hooks/`. The same files are kept at
`.gobbi/projects/gobbi/hooks/`. They are one design. The old Stop-only `stop-remind.sh`, its per-turn lock, and
the repository `.claude` Stop hook, `.codex/hooks.json`, and `.grok/hooks` registration are gone.

This checkout does not load the Cursor plugin, so the package Cursor hook does not run here.

## Settings check

`check-settings.sh` takes the runtime as argument one: `claude`, `codex`, `grok`, or `cursor`. It runs that
runtime's setup script with `--check` and reports the result. A passing `--check` exits before the setup
writer. A settings `FAIL` line inside the report is not a hook error. The hook exits 0.

| Runtime | Hook file | Event | Report |
|---|---|---|---|
| Claude Code | `hooks/hooks.json` | `SessionStart` | `hookSpecificOutput` with `hookEventName` `SessionStart` |
| Codex | `hooks/codex-hooks.json` | `SessionStart`, matcher `startup` or `resume` | `hookSpecificOutput` with `hookEventName` `SessionStart` |
| Grok | `hooks/grok-hooks.json` | `SessionStart` | Prints nothing and stores one report |
| Cursor | `hooks/cursor-hooks.json` | `sessionStart` | `additional_context` |

Grok's next eligible `Stop` shows the stored report once, then deletes it. The gobbi entry skill does not
probe layout, stop on layout, or run setup `--check`. The SessionStart hook owns that check.

## Reminder

`remind.sh` takes the same runtime argument. It does not probe the host. The reminder does not require
user-facing messages to be structured rather than narrative.

| Runtime | Event | Payload |
|---|---|---|
| Claude Code | `UserPromptSubmit` | `hookSpecificOutput` with `hookEventName` `UserPromptSubmit` |
| Codex | `UserPromptSubmit` | `hookSpecificOutput` with `hookEventName` `UserPromptSubmit` |
| Grok | `Stop` | `hookSpecificOutput` with `hookEventName` `Stop`, plus a stored settings report once |
| Cursor | `sessionStart` | `additional_context`, after the settings check on the same event |

Grok `Stop` still requires valid JSON, `reason` empty or `end_turn`, and `stopHookActive` or
`stop_hook_active` not true. Missing `jq`, missing reminder text, and ineligible input exit 0 with no stdout.

Both copies use the same six statements. Neither says to avoid narrative messages.

## Load

Claude and Codex load these hooks from `plugins/gobbi`. Grok loads them through `.grok/plugins/gobbi`. This
checkout has no settings `hooks` object and no `.codex/hooks.json`.
