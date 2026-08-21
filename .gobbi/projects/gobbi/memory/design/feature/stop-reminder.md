# Stop reminder

## Intent

A hook injects the Gobbi reminder into the session. Two designs now coexist deliberately. The package design
under `plugins/gobbi/hooks/` is current: one script, four hook files, one event per runtime, no lock. The
in-repository design under `.gobbi/projects/gobbi/hooks/` is frozen at the older shape: one script on `Stop`
only, with a per-turn lock.

## Why two designs

The user chose to keep all three in-repository registrations, decision A7, while the package moved to
per-runtime delivery. The two copies are distinct tracked files, so renaming the package script left every
in-repository registration working. The divergence is accepted, not drift. Neither copy is a mirror of the other, and no
byte-equality invariant applies to the script or the reminder text; both already differ.

**Reopen when** a change must be made to reminder behavior in both copies at once.

## Package design, current

| Runtime | Hook file | Selected by | Event |
|---|---|---|---|
| Claude Code | `hooks/hooks.json` | default discovery, no manifest key | `UserPromptSubmit` |
| Codex | `hooks/codex-hooks.json` | `.codex-plugin/plugin.json` `hooks` | `UserPromptSubmit` |
| Grok | `hooks/grok-hooks.json` | `.grok-plugin/plugin.json` `hooks` | `Stop` |
| Cursor | `hooks/cursor-hooks.json` | `.cursor-plugin/plugin.json` `hooks` | `sessionStart` |

Each file names its runtime as argument one to `remind.sh`: `claude`, `codex`, `grok`, or `cursor`. Anything
else exits 0. The script never probes for its host. Each file resolves the script its own way: the native
plugin-root variable for Claude Code, Codex, and Grok, and a path relative to the plugin root for Cursor.

Gates for every runtime: a readable `remind.txt` beside the script, and `jq`. For `grok` only: valid JSON on
stdin, `reason` empty or `end_turn`, and `stopHookActive` / `stop_hook_active` not true. The other three fire
on events carrying no turn-end reason, so they have no further gate. No lock, and no last-assistant-message
check.

Payload: `cursor` emits `additional_context`. `grok` emits `hookSpecificOutput` with `hookEventName` `Stop`.
`claude` and `codex` share one branch emitting `hookSpecificOutput` with `hookEventName` `UserPromptSubmit`.

Two per-runtime costs are inherent to this split. Cursor's `sessionStart` fires once per conversation, not
once per turn. Grok's `additionalContext` on `Stop` keeps the agent working, so Grok spends an extra model
round per turn.

## In-repository design, frozen

`.gobbi/projects/gobbi/hooks/stop-remind.sh` with its own `remind.txt`. `Stop` only. It detects its host
instead of being told: a non-empty `GROK_HOOK_EVENT` means Grok, `turn_id` without that variable means Codex,
and anything else is treated as Claude.

Gates: the event normalizes to `stop`; `reason` empty or `end_turn`, which also skips session-end Stop
(`shutdown`, `channel_closed`); `stopHookActive` / `stop_hook_active` not true; and a skip when the last
assistant message already contains the reminder text.

Lock: `sha256(session + NUL + prompt)` under `${TMPDIR:-/tmp}/gobbi-stop-remind`, claimed with `mkdir`.
Distinct session and prompt pairs must not share a lock. Joining the two strings with `-` or `/` collides.

Payload: Grok and Claude get `hookSpecificOutput.additionalContext`; Codex gets
`{decision: "block", reason: ...}`.

## Registrations

| Registration | Points at | Design |
|---|---|---|
| Plugin manifests and `plugins/gobbi/hooks/*.json` | `plugins/gobbi/hooks/remind.sh` | Package |
| `.claude/settings.json` `hooks.Stop` | `${CLAUDE_PROJECT_DIR}/.gobbi/projects/gobbi/hooks/stop-remind.sh` | In-repository |
| `.codex/hooks.json` `Stop` | `$(git rev-parse --show-toplevel)/.gobbi/projects/gobbi/hooks/stop-remind.sh` | In-repository |
| `.grok/hooks/gobbi-stop-remind.json` `Stop` | `../../.gobbi/projects/gobbi/hooks/stop-remind.sh` | In-repository |

The three in-repository rows are kept by decision A7. Codex additionally needs `[features] hooks = true` in
the Codex config it actually loads, and its project hooks need the `.codex/` layer trusted.

Both designs are active in this repository, so a turn delivers the reminder more than once here. Claude Code
gets two, one at each end of the turn. Grok gets two: the unlocked package injection, plus exactly one from
the locked copies — the project `.grok/hooks/` registration and a user-level `~/.grok/hooks/` one outside this
repository — because they share the lock root. Codex gets zero to two, each behind its own trust gate. Cursor
gets one per conversation, because no in-repository Cursor registration exists.

## Implementation

Both scripts are bash plus `jq`, not Python. Missing `jq`, missing reminder text, invalid JSON, ineligible
events, and, in the in-repository copy, lock errors fail open: exit 0 and no stdout.

## Reminder text

Each design carries its own `remind.txt`, and the two now differ in wording. The package's is a factual header
plus seven declarative statements. The in-repository one keeps the older header and six numbered lines,
including `Don't say narratively` at item 4 and recording mistakes and learnings at item 6.

## Deferred

Optional stderr silence on the in-repository copy's expected duplicate lock, and a live two-prompt Grok
check, stay in [stop-reminder backlog](../../backlogs/stop-reminder.md).
