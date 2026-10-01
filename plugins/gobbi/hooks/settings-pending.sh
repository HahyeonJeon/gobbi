# Pending Gobbi settings report for one Grok session.
# Sourced by check-settings.sh and remind.sh. Not a hook command.

grok_session_id_is_safe() {
  local id="${1-}"
  # "." and ".." match the character rule but are not safe file names.
  case "$id" in
    "" | . | ..) return 1 ;;
  esac
  case "$id" in
    *[!A-Za-z0-9._:-]*) return 1 ;;
  esac
  return 0
}

grok_pending_directory() {
  printf '%s' "${GROK_PLUGIN_DATA:-${TMPDIR:-/tmp}/gobbi-settings-check}"
}

# Stdin sessionId, else session_id, else GROK_SESSION_ID.
# A present unsafe stdin id does not fall through to the environment.
grok_session_id() {
  local raw="${1-}"
  local chosen=""
  if [ -n "$raw" ] && command -v jq >/dev/null 2>&1; then
    chosen=$(printf '%s' "$raw" | jq -r '
      def text:
        if type == "string" and . != "" then . else empty end;
      (.sessionId | text) // (.session_id | text)
    ' 2>/dev/null) || chosen=""
  fi
  if [ -z "$chosen" ]; then
    chosen="${GROK_SESSION_ID-}"
  fi
  if grok_session_id_is_safe "$chosen"; then
    printf '%s' "$chosen"
  fi
}

grok_pending_path() {
  local id="${1-}"
  if ! grok_session_id_is_safe "$id"; then
    return 0
  fi
  printf '%s/%s' "$(grok_pending_directory)" "$id"
}

# Rename a temp file in the pending directory over the final path so a reader
# never sees a partial report. An unsafe id writes nothing.
store_grok_pending_report() {
  local id="${1-}"
  local report="${2-}"
  local dir path tmp
  path=$(grok_pending_path "$id")
  if [ -z "$path" ] || [ -d "$path" ]; then
    return 0
  fi
  dir=$(grok_pending_directory)
  mkdir -p -- "$dir" 2>/dev/null || return 0
  tmp=$(mktemp "$dir/.pending.XXXXXX" 2>/dev/null) || return 0
  if ! printf '%s\n' "$report" >"$tmp"; then
    rm -f -- "$tmp"
    return 0
  fi
  if ! mv -f -- "$tmp" "$path"; then
    rm -f -- "$tmp"
  fi
}
