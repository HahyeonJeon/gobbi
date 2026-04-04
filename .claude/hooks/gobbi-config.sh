#!/bin/bash
# gobbi-config.sh — CRUD script for gobbi.json session configuration.
# Manages per-session workflow options with atomic writes and flock concurrency.
#
# Usage:
#   gobbi-config.sh init
#   gobbi-config.sh get <session-id> [key]
#   gobbi-config.sh set <session-id> <key> <value>
#   gobbi-config.sh delete <session-id>
#   gobbi-config.sh list
#   gobbi-config.sh cleanup
#
# Dependencies: jq, flock
# File: $CLAUDE_PROJECT_DIR/.claude/gobbi.json

set -euo pipefail

# --- Constants ---
GOBBI_VERSION="0.3.2"
GOBBI_ARCHITECTURE="claude-source"
TTL_DAYS=7
MAX_SESSIONS=10
FLOCK_TIMEOUT=5

# --- File paths ---
GOBBI_JSON="${CLAUDE_PROJECT_DIR:?CLAUDE_PROJECT_DIR is not set}/.claude/gobbi.json"
GOBBI_LOCK="${GOBBI_JSON}.lock"

# --- Dependency check ---
if ! command -v jq &>/dev/null; then
  echo "error: jq is required but not installed" >&2
  exit 1
fi

if ! command -v flock &>/dev/null; then
  echo "error: flock is required but not installed" >&2
  exit 1
fi

# --- Helpers ---

now_iso() {
  date -u '+%Y-%m-%dT%H:%M:%SZ'
}

cutoff_iso() {
  date -u -d "${TTL_DAYS} days ago" '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null \
    || date -u -v-${TTL_DAYS}d '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null
}

# default_session_json — returns a new session object with defaults.
default_session_json() {
  local ts
  ts=$(now_iso)
  jq -n \
    --arg ts "$ts" \
    '{
      notify: { slack: false, telegram: false },
      trivialRange: "read-only",
      evaluationMode: "ask-each-time",
      gitWorkflow: "direct-commit",
      baseBranch: null,
      createdAt: $ts,
      lastAccessedAt: $ts
    }'
}

# empty_gobbi_json — returns a fresh gobbi.json structure.
empty_gobbi_json() {
  jq -n \
    --arg ver "$GOBBI_VERSION" \
    --arg arch "$GOBBI_ARCHITECTURE" \
    '{
      version: $ver,
      architecture: $arch,
      sessions: {}
    }'
}

# needs_migration <json> — returns 0 if v0.3.1 format detected.
needs_migration() {
  local json="$1"
  local has_version has_sessions
  has_version=$(echo "$json" | jq 'has("version")')
  has_sessions=$(echo "$json" | jq 'has("sessions")')
  if [[ "$has_version" == "true" && "$has_sessions" == "false" ]]; then
    return 0
  fi
  return 1
}

# migrate_json <json> — migrates v0.3.1 to v0.3.2 format.
migrate_json() {
  local json="$1"
  echo "$json" | jq \
    --arg ver "$GOBBI_VERSION" \
    '. + { version: $ver, sessions: {} }'
}

# read_gobbi — reads gobbi.json, returns empty string if missing.
read_gobbi() {
  if [[ -f "$GOBBI_JSON" ]]; then
    cat "$GOBBI_JSON"
  else
    echo ""
  fi
}

# write_gobbi_atomic <json> — writes json to gobbi.json atomically via temp + mv.
# MUST be called inside flock.
write_gobbi_atomic() {
  local json="$1"
  local dir
  dir=$(dirname "$GOBBI_JSON")
  local tmp
  tmp=$(mktemp "${dir}/gobbi.json.XXXXXX")
  echo "$json" > "$tmp"
  mv "$tmp" "$GOBBI_JSON"
}

# run_cleanup <json> — applies TTL + max-entries cleanup, returns cleaned json.
run_cleanup() {
  local json="$1"
  local cutoff
  cutoff=$(cutoff_iso)

  # Step 1: TTL — remove sessions older than TTL_DAYS
  json=$(echo "$json" | jq \
    --arg cutoff "$cutoff" \
    '.sessions |= with_entries(select(.value.lastAccessedAt >= $cutoff))')

  # Step 2: Max entries — keep only newest MAX_SESSIONS by lastAccessedAt
  json=$(echo "$json" | jq \
    --argjson max "$MAX_SESSIONS" \
    'if (.sessions | length) > $max then
      .sessions |= (
        to_entries
        | sort_by(.value.lastAccessedAt)
        | reverse
        | .[0:$max]
        | from_entries
      )
    else . end')

  echo "$json"
}

# coerce_value <value> — returns a valid JSON literal for the value.
# true/false → JSON boolean, null → JSON null, everything else → JSON string.
coerce_value() {
  local val="$1"
  case "$val" in
    true)  echo "true" ;;
    false) echo "false" ;;
    null)  echo "null" ;;
    *)     jq -n --arg v "$val" '$v' ;;
  esac
}

# with_flock <callback_function> [args...] — runs callback inside flock.
with_flock() {
  local callback="$1"
  shift
  local lock_dir
  lock_dir=$(dirname "$GOBBI_LOCK")
  mkdir -p "$lock_dir"

  local fd=9
  eval "exec ${fd}>\"${GOBBI_LOCK}\""

  if ! flock -w "$FLOCK_TIMEOUT" "$fd"; then
    echo "error: could not acquire lock within ${FLOCK_TIMEOUT}s" >&2
    eval "exec ${fd}>&-"
    exit 1
  fi

  "$callback" "$@"
  local rc=$?

  eval "exec ${fd}>&-"
  return $rc
}

# ensure_and_read — ensures gobbi.json exists and is migrated, returns json.
# If migration is needed, acquires flock internally.
ensure_and_read() {
  local json
  json=$(read_gobbi)

  if [[ -z "$json" ]]; then
    # File missing — need to create with flock
    return 1
  fi

  if needs_migration "$json"; then
    # Migration needed — caller must handle with flock
    return 2
  fi

  echo "$json"
  return 0
}

# --- Operations ---

op_init() {
  _op_init_locked() {
    local json
    json=$(read_gobbi)

    if [[ -z "$json" ]]; then
      json=$(empty_gobbi_json)
    elif needs_migration "$json"; then
      json=$(migrate_json "$json")
    else
      # Already valid — no-op
      echo "$json" > /dev/null
      return 0
    fi

    json=$(run_cleanup "$json")
    write_gobbi_atomic "$json"
  }

  with_flock _op_init_locked
}

op_get() {
  local session_id="$1"
  local key="${2:-}"
  local json

  json=$(read_gobbi)

  if [[ -z "$json" ]]; then
    # No file — nothing to get
    exit 0
  fi

  # Check if migration needed — if so, do it under flock first
  if needs_migration "$json"; then
    _op_get_migrate() {
      local j
      j=$(read_gobbi)
      if needs_migration "$j"; then
        j=$(migrate_json "$j")
        write_gobbi_atomic "$j"
      fi
      echo "$j"
    }
    json=$(with_flock _op_get_migrate)
  fi

  if [[ -z "$key" ]]; then
    # Return full session object — no output if session doesn't exist
    local exists
    exists=$(echo "$json" | jq --arg sid "$session_id" '.sessions | has($sid)')
    if [[ "$exists" == "true" ]]; then
      echo "$json" | jq --arg sid "$session_id" '.sessions[$sid]'
    fi
  else
    # Return specific field via dot-path — no output if session or field missing
    local exists
    exists=$(echo "$json" | jq --arg sid "$session_id" '.sessions | has($sid)')
    if [[ "$exists" == "true" ]]; then
      local raw
      raw=$(echo "$json" | jq --arg sid "$session_id" ".sessions[\$sid].${key}") || true
      # No output for jq errors or if the path resolved to nothing
      if [[ -n "$raw" ]]; then
        # Output raw value — strip JSON quoting for strings, pass through booleans/null/numbers
        if [[ "$raw" =~ ^\" ]]; then
          echo "$raw" | jq -r '.'
        else
          echo "$raw"
        fi
      fi
    fi
  fi
}

op_set() {
  local session_id="$1"
  local key="$2"
  local value="$3"

  _op_set_locked() {
    local json
    json=$(read_gobbi)

    if [[ -z "$json" ]]; then
      json=$(empty_gobbi_json)
    elif needs_migration "$json"; then
      json=$(migrate_json "$json")
    fi

    local ts
    ts=$(now_iso)

    # Check if session exists; if not, create with defaults
    local has_session
    has_session=$(echo "$json" | jq --arg sid "$session_id" 'has("sessions") and (.sessions | has($sid))')
    if [[ "$has_session" != "true" ]]; then
      local defaults
      defaults=$(default_session_json)
      json=$(echo "$json" | jq --arg sid "$session_id" --argjson def "$defaults" \
        '.sessions[$sid] = $def')
    fi

    # Coerce value
    local jq_value
    jq_value=$(coerce_value "$value")

    # Set the field via dot-path and update lastAccessedAt
    json=$(echo "$json" | jq \
      --arg sid "$session_id" \
      --arg ts "$ts" \
      --argjson val "$jq_value" \
      ".sessions[\$sid].${key} = \$val | .sessions[\$sid].lastAccessedAt = \$ts")

    # Run cleanup
    json=$(run_cleanup "$json")

    write_gobbi_atomic "$json"
  }

  with_flock _op_set_locked
}

op_delete() {
  local session_id="$1"

  _op_delete_locked() {
    local json
    json=$(read_gobbi)

    if [[ -z "$json" ]]; then
      return 0
    fi

    if needs_migration "$json"; then
      json=$(migrate_json "$json")
    fi

    json=$(echo "$json" | jq --arg sid "$session_id" 'del(.sessions[$sid])')
    write_gobbi_atomic "$json"
  }

  with_flock _op_delete_locked
}

op_list() {
  local json
  json=$(read_gobbi)

  if [[ -z "$json" ]]; then
    exit 0
  fi

  # Check if migration needed
  if needs_migration "$json"; then
    _op_list_migrate() {
      local j
      j=$(read_gobbi)
      if needs_migration "$j"; then
        j=$(migrate_json "$j")
        write_gobbi_atomic "$j"
      fi
      echo "$j"
    }
    json=$(with_flock _op_list_migrate)
  fi

  # Output tab-separated: session-id \t createdAt, sorted by createdAt
  echo "$json" | jq -r '
    .sessions
    | to_entries
    | sort_by(.value.createdAt)
    | .[]
    | [.key, .value.createdAt]
    | @tsv'
}

op_cleanup() {
  _op_cleanup_locked() {
    local json
    json=$(read_gobbi)

    if [[ -z "$json" ]]; then
      return 0
    fi

    if needs_migration "$json"; then
      json=$(migrate_json "$json")
    fi

    json=$(run_cleanup "$json")
    write_gobbi_atomic "$json"
  }

  with_flock _op_cleanup_locked
}

# --- Main dispatch ---

usage() {
  echo "Usage: gobbi-config.sh <operation> [args...]" >&2
  echo "" >&2
  echo "Operations:" >&2
  echo "  init                          Create gobbi.json or migrate" >&2
  echo "  get <session-id> [key]        Read session or field" >&2
  echo "  set <session-id> <key> <val>  Write field" >&2
  echo "  delete <session-id>           Remove session" >&2
  echo "  list                          List all sessions" >&2
  echo "  cleanup                       Run TTL + max-entries cleanup" >&2
  exit 1
}

if [[ $# -lt 1 ]]; then
  usage
fi

OPERATION="$1"
shift

case "$OPERATION" in
  init)
    op_init
    ;;
  get)
    if [[ $# -lt 1 ]]; then
      echo "error: get requires session-id" >&2
      exit 1
    fi
    op_get "$1" "${2:-}"
    ;;
  set)
    if [[ $# -lt 3 ]]; then
      echo "error: set requires session-id, key, and value" >&2
      exit 1
    fi
    op_set "$1" "$2" "$3"
    ;;
  delete)
    if [[ $# -lt 1 ]]; then
      echo "error: delete requires session-id" >&2
      exit 1
    fi
    op_delete "$1"
    ;;
  list)
    op_list
    ;;
  cleanup)
    op_cleanup
    ;;
  *)
    echo "error: unknown operation '$OPERATION'" >&2
    usage
    ;;
esac

exit 0
