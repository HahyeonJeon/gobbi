# Stop reminder

## Intent

One Stop hook injects the Gobbi reminder on Claude, Codex, and Grok. There is no SessionStart hook. The hook
injects once per user turn. A later user prompt injects again. The hook does not loop inside the same turn.

## Files

- Canonical files live in `.gobbi/projects/gobbi/hooks/`.
- Plugin copies live in `plugins/gobbi/hooks/` and must stay byte-equal for the script and reminder.
- Plugin `hooks.json` is the user hook file. The Stop command is `stop-remind.sh` next to that JSON file.
- Project wiring: `.claude/settings.json`, `.codex/hooks.json`, `.grok/hooks/gobbi-stop-remind.json`.
- Codex also needs `[features] hooks = true` in the Codex config that Codex actually loads.

## Inject gates

- Run only on a genuine turn end: reason `end_turn` or empty.
- Skip when `stopHookActive` / `stop_hook_active` is true.
- Skip session-end Stop (`shutdown`, `channel_closed`) and StopFailure.
- Skip when the last assistant message already contains the reminder text.

## Lock

Deduplicate parallel registrations with `sha256(session + NUL + prompt)`. Distinct session and prompt pairs
must not share a lock. Joining the two strings with `-` or `/` collides.

## Payload

- Grok and Claude: `hookSpecificOutput.additionalContext` only.
- Codex (`turn_id` present, no `GROK_HOOK_EVENT`): `{decision: "block", reason: ...}` only.

Detect Grok by a non-empty `GROK_HOOK_EVENT`. Detect Codex by `turn_id` without that env var. Otherwise treat
the event as Claude.

## Implementation

The hook is bash plus `jq`, not Python. Missing `jq`, missing reminder text, invalid JSON, ineligible events,
and lock errors fail-open: exit 0 and no stdout.

## Reminder text

Item 4 keeps the phrase `Don't say narratively`. Item 6 records mistakes and learnings during the session.

## Deferred

Optional stderr silence on the expected duplicate lock, and a live two-prompt Grok check, stay in
[stop-reminder backlog](../../backlogs/stop-reminder.md).
