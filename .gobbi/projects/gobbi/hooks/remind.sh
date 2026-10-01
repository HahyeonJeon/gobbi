#!/usr/bin/env bash
# Gobbi reminder hook. Argument one names the host runtime: claude, codex, grok, or cursor.
set +e

runtime="${1-}"
case "$runtime" in
  claude|codex|grok|cursor) ;;
  *) exit 0 ;;
esac

DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || exit 0
REMIND="$DIR/remind.txt"
[ -r "$REMIND" ] || exit 0
command -v jq >/dev/null 2>&1 || exit 0

data=$(cat) || exit 0

if [ "$runtime" = grok ]; then
  printf '%s' "$data" | jq -e . >/dev/null 2>&1 || exit 0

  reason=$(printf '%s' "$data" | jq -r '
    (.reason // "") | tostring | gsub("^\\s+|\\s+$"; "") | ascii_downcase
  ') || exit 0
  [ "$reason" = "" ] || [ "$reason" = end_turn ] || exit 0

  active=$(printf '%s' "$data" | jq -r '
    if .stopHookActive == true or .stop_hook_active == true then "true" else "false" end
  ') || exit 0
  [ "$active" = true ] && exit 0
fi

jq -nc --rawfile remind "$REMIND" --arg runtime "$runtime" '
  ($remind | sub("\\s+$"; "") + "\n") as $reminder
  | if $runtime == "cursor" then
      {additional_context: $reminder}
    elif $runtime == "grok" then
      {hookSpecificOutput: {hookEventName: "Stop", additionalContext: $reminder}}
    else
      {hookSpecificOutput: {hookEventName: "UserPromptSubmit", additionalContext: $reminder}}
    end
' || exit 0
exit 0
