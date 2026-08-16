#!/usr/bin/env bash
# Gobbi Stop hook: inject remind.txt once per turn on Claude, Codex, and Grok.
set +e

DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 0
REMIND="$DIR/remind.txt"
[ -r "$REMIND" ] || exit 0
command -v jq >/dev/null 2>&1 || exit 0

data=$(cat) || exit 0
printf '%s' "$data" | jq -e . >/dev/null 2>&1 || exit 0

event=$(printf '%s' "$data" | jq -r --arg e "${GROK_HOOK_EVENT-}" '
  (if ($e | length) > 0 then $e else (.hookEventName // .hook_event_name // "") end)
  | tostring | gsub("-"; "_") | ascii_downcase
') || exit 0
[ "$event" = stop ] || exit 0

reason=$(printf '%s' "$data" | jq -r '
  ((.reason // "") | tostring | gsub("^\\s+|\\s+$"; "") | ascii_downcase)
') || exit 0
[ "$reason" = "" ] || [ "$reason" = end_turn ] || exit 0

active=$(printf '%s' "$data" | jq -r '
  if .stopHookActive == true or .stop_hook_active == true then "true" else "false" end
') || exit 0
[ "$active" = true ] && exit 0

session=$(printf '%s' "$data" | jq -r --arg s "${GROK_SESSION_ID-}" '
  if ($s | length) > 0 then $s else (.sessionId // .session_id // "unknown") end | tostring
') || exit 0
prompt=$(printf '%s' "$data" | jq -r '
  (.promptId // .prompt_id // .turn_id // "unknown") | tostring
') || exit 0

if command -v sha256sum >/dev/null 2>&1; then
  lock_id=$(printf '%s\0%s' "$session" "$prompt" | sha256sum | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then
  lock_id=$(printf '%s\0%s' "$session" "$prompt" | shasum -a 256 | awk '{print $1}')
else
  exit 0
fi
[ -n "$lock_id" ] || exit 0

lock_root="${TMPDIR:-/tmp}/gobbi-stop-remind"
mkdir -p "$lock_root" || exit 0
mkdir "$lock_root/${lock_id}" || exit 0

skip=$(printf '%s' "$data" | jq -r --rawfile remind "$REMIND" '
  ($remind | gsub("^\\s+|\\s+$"; "")) as $r
  | ((.lastAssistantMessage // .last_assistant_message // "") | tostring) as $last
  | if ($r | length) > 0 and ($last | contains($r)) then "yes" else "no" end
') || exit 0
[ "$skip" = yes ] && exit 0

printf '%s' "$data" | jq -c --rawfile remind "$REMIND" --arg e "${GROK_HOOK_EVENT-}" '
  ($remind | sub("\\s+$"; "") + "\n") as $reminder
  | if (($e | length) > 0) or (.turn_id | not) then
      {hookSpecificOutput: {hookEventName: "Stop", additionalContext: $reminder}}
    else
      {decision: "block", reason: $reminder}
    end
' || exit 0
exit 0
