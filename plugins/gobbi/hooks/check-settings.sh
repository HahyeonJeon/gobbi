#!/usr/bin/env bash
# Session-start Gobbi settings check. Argument one is claude, codex, grok, or cursor.
set +e
export LC_ALL=C

runtime="${1-}"
case "$runtime" in
  claude|codex|grok|cursor) ;;
  *) exit 0 ;;
esac

data=$(cat) || data=""
case "$0" in
  */*) script_dir=${0%/*} ;;
  *) script_dir=. ;;
esac
DIR=$(CDPATH= cd -- "$script_dir" && pwd) || exit 0
if [ -r "$DIR/settings-pending.sh" ]; then
  # shellcheck source=settings-pending.sh
  . "$DIR/settings-pending.sh"
fi

unfinished="Gobbi settings check: FAIL Gobbi settings check did not finish."

cleanup_check_temps() {
  [ -n "${check_out-}" ] && rm -f -- "$check_out"
  [ -n "${check_err-}" ] && rm -f -- "$check_err"
}
trap cleanup_check_temps EXIT

run_checker() {
  local script="$1"
  local pid elapsed
  if command -v timeout >/dev/null 2>&1; then
    timeout 20 "$script" --check >"$check_out" 2>"$check_err" </dev/null
    return $?
  fi
  # setsid starts a new group so the kill below also stops checker children.
  if command -v setsid >/dev/null 2>&1; then
    setsid "$script" --check >"$check_out" 2>"$check_err" </dev/null &
  else
    "$script" --check >"$check_out" 2>"$check_err" </dev/null &
  fi
  pid=$!
  elapsed=0
  while [ "$elapsed" -lt 20 ]; do
    if ! kill -0 "$pid" 2>/dev/null; then
      wait "$pid"
      return $?
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done
  kill -TERM -- "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null
  sleep 1
  kill -KILL -- "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null
  wait "$pid" 2>/dev/null
  return 124
}

emit_report() {
  cleanup_check_temps
  check_out=""
  check_err=""
  printf '%s' "$1"
}

settings_check_report() {
  local script="$DIR/../skills/gobbi/setup/scripts/${runtime}.sh"
  local filtered awk_status first rest checker_status
  if [ ! -f "$script" ]; then
    emit_report "$unfinished"
    return 0
  fi
  check_out=$(mktemp) || {
    emit_report "$unfinished"
    return 0
  }
  check_err=$(mktemp) || {
    emit_report "$unfinished"
    return 0
  }
  run_checker "$script"
  checker_status=$?
  # 124 is the bound. A summary written before the kill is not a finished check.
  if [ "$checker_status" -eq 124 ]; then
    emit_report "$unfinished"
    return 0
  fi
  filtered=$(awk '
    BEGIN { summaries = 0 }
    /^WARN / { kept[++n] = $0; next }
    /^PASS prerequisites: [0-9]+ passed, [0-9]+ warnings, 0 failed$/ {
      summaries++
      kept[++n] = $0
      next
    }
    /^FAIL / {
      if ($0 ~ /^FAIL prerequisites: [0-9]+ passed, [0-9]+ warnings, [0-9]+ failed$/) {
        summaries++
      }
      kept[++n] = $0
      next
    }
    END {
      if (summaries != 1) exit 2
      for (i = 1; i <= n; i++) print kept[i]
    }
  ' "$check_out")
  awk_status=$?
  if [ "$awk_status" -ne 0 ] || [ -z "$filtered" ]; then
    emit_report "$unfinished"
    return 0
  fi
  first=${filtered%%$'\n'*}
  if [ "$filtered" = "$first" ]; then
    emit_report "Gobbi settings check: $first"
  else
    rest=${filtered#*$'\n'}
    emit_report "Gobbi settings check: $first"$'\n'"$rest"
  fi
}

report=$(settings_check_report) || report="$unfinished"
[ -n "$report" ] || report="$unfinished"

case "$runtime" in
  grok)
    if type grok_session_id >/dev/null 2>&1; then
      session_id=$(grok_session_id "$data")
      if [ -n "$session_id" ]; then
        store_grok_pending_report "$session_id" "$report"
      fi
    fi
    exit 0
    ;;
  cursor)
    command -v jq >/dev/null 2>&1 || exit 0
    jq -nc --arg report "$report" '{additional_context: $report}' || exit 0
    ;;
  *)
    command -v jq >/dev/null 2>&1 || exit 0
    jq -nc --arg report "$report" \
      '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $report}}' || exit 0
    ;;
esac
exit 0
