#!/usr/bin/env bash
# Shared helpers for gobbi/setup/<runtime>.sh. Do not invoke this file directly.

set -uo pipefail
set -C # noclobber: the shell itself refuses to truncate an existing file
export LC_ALL=C

roles=(manager developer designer author assistant)
permission_skills=(gobbi principles discussion delegation)

# The canonical .gobbi/.gitignore, verbatim from gobbi/SKILL.md Step 1.2. Both patterns carry a middle
# slash, which anchors them to .gobbi/; a slashless sessions/ would also swallow memory/design/sessions/.
canonical_gobbi_ignore='# Gobbi runtime state. Session evidence and linked worktrees are never tracked.
projects/*/sessions/
projects/*/worktrees/
'

# The minimum .claude/settings.json, created only when the file is absent. Namespaced, because a plugin
# consumer's entries read Agent(gobbi:<role>) and Skill(gobbi:<name>).
minimum_claude_settings='{
  "permissions": {
    "allow": [
      "Agent(gobbi:manager)", "Agent(gobbi:developer)", "Agent(gobbi:designer)",
      "Agent(gobbi:author)", "Agent(gobbi:assistant)",
      "Skill(gobbi:gobbi)", "Skill(gobbi:principles)", "Skill(gobbi:discussion)",
      "Skill(gobbi:delegation)"
    ]
  }
}
'

created_count=0
exists_count=0
skipped_count=0
stopped_count=0
not_mine_count=0

# Every stopped row's path, space-delimited and space-terminated, so a membership test is one glob. Target
# paths hold no spaces: every component is a literal except the project key, which matched
# ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ before any row ran.
stopped_rows=" "

usage() {
  printf 'Usage: %s [--project-key <key>] [--skills-root <absolute> --agents-root <absolute>]\n' \
    "${0##*/}"
}

ledger_line() {
  printf '%-43s %-10s %s\n' "$1" "$2" "$3"
}

# One ledger row per target, in write order. A negative result is an asserted row, never an omission. The
# ledger is also the record row_is_blocked reads: a stopped row is remembered here, so nothing below it is
# attempted afterwards.
record() {
  case "$2" in
    created) created_count=$((created_count + 1)) ;;
    exists) exists_count=$((exists_count + 1)) ;;
    skipped) skipped_count=$((skipped_count + 1)) ;;
    stopped)
      stopped_count=$((stopped_count + 1))
      stopped_rows="$stopped_rows${1%/} "
      ;;
    not-mine) not_mine_count=$((not_mine_count + 1)) ;;
  esac
  ledger_line "$1" "$2" "$3"
}

# A stop found before the first write. Nothing has been created, so the ledger is empty.
stop_run() {
  printf 'STOP %s: %s\n' "$1" "$2" >&2
  printf 'probe: %s\n' "$3" >&2
  printf 'created: 0 filesystem objects\n' >&2
  exit 1
}

# A refusal aborts before the first write, so no ledger exists — and without one the operator cannot tell
# whether the refused target is the only problem in the tree. This is the substitute: every computed target
# and the state it is in right now, read with no write of any kind. The states are observations, not
# predicted actions, because predicting an action would restate the row logic below and could disagree with
# it.
report_target_survey() {
  local target
  local absolute
  local state
  local reached

  printf 'survey: project root %s, project key %s; every computed target as it stands now\n' \
    "$project_root" "$project_key" >&2
  for target in "${targets[@]}"; do
    absolute="$project_root/$target"
    if [[ -L "$absolute" ]]; then
      state="symbolic link to $(readlink "$absolute")"
    elif [[ -d "$absolute" ]]; then
      state="real directory"
    elif [[ -e "$absolute" ]]; then
      state="present, not a directory"
    else
      state="absent"
    fi
    # A path reached through the offending link still answers -d, so a bare "real directory" would hide the
    # very thing being refused. The same resolver the refusal used names where the row really leads.
    reached="$(physical_ancestor "$target")"
    if [[ -n "$reached" && "$reached" != "$project_root" && "$reached" != "$project_root"/* ]]; then
      state="$state; resolves through $reached, outside the project root"
    fi
    printf '  %-43s %s\n' "$target" "$state" >&2
  done
}

# A refusal, not a skip: the run ends, nothing further is created, and the exit status is nonzero. The survey
# diagnoses; it never softens the refusal, and the count below it stays literal.
refuse() {
  printf 'REFUSED %s: %s\n' "$1" "$2" >&2
  printf 'probe: %s\n' "$3" >&2
  report_target_survey
  printf 'created: 0 filesystem objects\n' >&2
  exit 1
}

# Same symlink walk the prerequisite checker uses, so a sibling script resolves the same location.
resolve_script_directory() {
  local source="${BASH_SOURCE[0]}"
  local directory
  local target

  while [[ -L "$source" ]]; do
    directory="$(cd -P "$(dirname "$source")" && pwd)"
    target="$(readlink "$source")"
    if [[ "$target" == /* ]]; then
      source="$target"
    else
      source="$directory/$target"
    fi
  done

  cd -P "$(dirname "$source")" && pwd
}

# The last three components of a source path, which name the topology directory, the runtime, and the
# file. The header line above the ledger carries the resolved source directory in full.
source_label() {
  local path="$1"
  local file="${path##*/}"
  local runtime="${path%/*}"
  local topology="${runtime%/*}"

  printf '%s/%s/%s' "${topology##*/}" "${runtime##*/}" "$file"
}

checksum() {
  if command -v sha256sum >/dev/null 2>&1; then
    printf 'sha256:%s' "$(sha256sum "$1" | cut -d' ' -f1)"
  elif command -v shasum >/dev/null 2>&1; then
    printf 'sha256:%s' "$(shasum -a 256 "$1" | cut -d' ' -f1)"
  else
    printf 'cksum:%s' "$(cksum "$1" | cut -d' ' -f1)"
  fi
}

# Gobbi's root-pair protocol. A supplied pair is validated; neither supplied means the Codex source
# is derived from this script's own location, which Gobbi allows.
validate_root_pair() {
  local pair
  local name
  local value
  local sentinel

  if [[ -z "$skills_root" && -z "$agents_root" ]]; then
    return 0
  fi
  if [[ -z "$skills_root" ]]; then
    stop_run S7 'NO_GOBBI_ROOT: gobbi-skills-root partial-pair' '--skills-root against --agents-root'
  fi
  if [[ -z "$agents_root" ]]; then
    stop_run S7 'NO_GOBBI_ROOT: gobbi-agents-root partial-pair' '--agents-root against --skills-root'
  fi

  for pair in "gobbi-skills-root:$skills_root" "gobbi-agents-root:$agents_root"; do
    name="${pair%%:*}"
    value="${pair#*:}"
    if [[ "$value" != /* || "$value" == *'~'* || "$value" == *'$'* ]]; then
      stop_run S7 "NO_GOBBI_ROOT: $name $value not-an-absolute-path" "the supplied $name value"
    fi
  done

  for sentinel in "$skills_root/gobbi/SKILL.md" "$skills_root/principles/SKILL.md"; do
    if [[ ! -r "$sentinel" ]]; then
      stop_run S7 "NO_GOBBI_ROOT: gobbi-skills-root $sentinel absent-or-unreadable" "test -r $sentinel"
    fi
  done
  if [[ ! -r "$agents_root/manager.md" && ! -r "$agents_root/claude/manager.md" ]]; then
    stop_run S7 "NO_GOBBI_ROOT: gobbi-agents-root $agents_root/manager.md absent-or-unreadable" \
      "test -r $agents_root/manager.md and $agents_root/claude/manager.md"
  fi
}

# Two topologies, and both probes stay inside a validated root. A Gobbi checkout keeps every runtime's
# contracts under the agents root, so codex/ is its child. The published package cannot do the same: a plugin's
# agents/ directory is scanned recursively, so the non-Claude copies ship in a runtimes/ sibling instead.
resolve_codex_source() {
  local base="$1"

  if [[ -n "$agents_root" && -d "$agents_root/codex" ]]; then
    printf '%s' "$agents_root/codex"
    return 0
  fi
  if [[ -n "$base" && -d "$base/runtimes/codex" ]]; then
    printf '%s' "$base/runtimes/codex"
    return 0
  fi
  return 1
}

# The deepest ancestor of a computed target that exists now, resolved physically so a symbolic link
# anywhere in the chain reports where it really leads. Refusal 1 cannot be a lexical prefix test:
# "$project_root/$target" always starts with "$project_root" no matter where the path resolves to. Prints
# nothing when that ancestor is not a searchable directory, because no write primitive can reach through a
# file or a dangling link and the per-row checks below report it as a stop.
physical_ancestor() {
  local candidate="$project_root/$1"

  while [[ -n "$candidate" && ! -e "$candidate" && ! -L "$candidate" ]]; do
    candidate="${candidate%/*}"
  done
  (cd -P "${candidate:-/}" 2>/dev/null && pwd)
}

# Refusals 1, 2, and 5, applied to every computed target before the first write, so a refusal creates
# nothing at all. The components checked are relative to the project root. A skills component at index 2
# under .gobbi/projects means the project key is skills and is refused with recovery. A skills component
# at index 3 under .gobbi/projects/<key>/ is the project-namespace skills directory and is allowed.
# Every other skills component is a defect in setup itself.
guard_target() {
  local relative="$1"
  local absolute="$project_root/$1"
  local components
  local component
  local index
  local ancestor

  if [[ "$relative" == *'~'* || "$relative" == *'$'* ]]; then
    refuse refusal-5 "computed target $relative carries an unexpanded home or variable reference" \
      'the computed target list'
  fi
  if [[ "$relative" == /* ]]; then
    refuse refusal-1 "computed target $relative is not a project-relative path" \
      'the computed target list'
  fi

  IFS='/' read -r -a components <<<"$relative"
  for index in "${!components[@]}"; do
    component="${components[index]}"
    if [[ "$component" == ".." || -z "$component" ]]; then
      refuse refusal-1 "computed target $relative does not stay inside the project root" \
        'component scan of the computed target list'
    fi
    if [[ "$component" == "skills" ]]; then
      if ((index == 2)) && [[ "${components[0]}" == ".gobbi" && "${components[1]}" == "projects" ]]; then
        refuse "refusal-2 (S9)" \
          "the project key is \"skills\", so computed target $relative has a skills component; re-run with --project-key <other-key> to name this project's .gobbi/projects/ namespace something else" \
          'the resolved project key against the computed target list'
      fi
      if ((index == 3)) && [[ "${components[0]}" == ".gobbi" && "${components[1]}" == "projects" && "${components[2]}" == "$project_key" ]]; then
        continue
      fi
      refuse "refusal-2 (S9)" \
        "computed target $relative has a skills component; this is a defect in setup itself, not a project error" \
        'component scan of the computed target list'
    fi
  done

  ancestor="$(physical_ancestor "$relative")"
  if [[ -n "$ancestor" && "$ancestor" != "$project_root" && "$ancestor" != "$project_root"/* ]]; then
    refuse refusal-1 "computed target $relative resolves through $ancestor, which is outside $project_root" \
      'cd -P on the deepest existing ancestor of the computed target'
  fi
  if [[ -n "${HOME:-}" && "$absolute" == "$HOME" ]]; then
    refuse refusal-5 "computed target $absolute is the home directory" \
      'the computed target against $HOME'
  fi
}

# Containment does not rest on the two functions below. It rests on guard_target plus one property of the
# target list: the list is ancestor-closed. Every component of every target is itself a target — .gobbi,
# .gobbi/projects, .gobbi/projects/<key>, agents, skills, memory and each named child, .claude, .codex,
# .codex/agents — and guard_target runs over the whole list before the first write. So every ancestor a
# write could traverse is separately resolved by cd -P, and any component below a target's deepest existing
# ancestor cannot exist yet at guard time.
#
# ADDING A TARGET WHOSE PARENT IS NOT ALSO A TARGET BREAKS CONTAINMENT SILENTLY. That parent would never be
# resolved, and both mkdir and > follow a symlinked mid-path directory into wherever it leads. Only the final
# component is symlink-proof, through set -C plus the -e || -L pre-check each writer runs.
#
# These two are narrower, and are about the ledger being true rather than about containment. The first
# reports on the immediate parent alone, which is all it can see.
parent_is_real_directory() {
  local parent
  parent="$(dirname "$1")"

  if [[ "$parent" == "." ]]; then
    return 0
  fi
  [[ -d "$project_root/$parent" && ! -L "$project_root/$parent" ]]
}

# The gate every writer opens with, recording its own stop so one condition reads one way in every row. The
# ancestor pass is not redundant with the parent test: a descendant's immediate parent can be a real
# directory reached through the very symbolic link an ancestor row rejected, and then the ledger would assert
# the namespace root failed while reporting a row created inside it. Takes the ledger path and returns 0 when
# the row is blocked.
row_is_blocked() {
  local label="$1"
  local relative="${label%/}"
  local ancestor="${label%/}"

  if ! parent_is_real_directory "$relative"; then
    record "$label" stopped "S4 the parent is not a real directory"
    return 0
  fi
  while [[ "$ancestor" == */* ]]; do
    ancestor="${ancestor%/*}"
    if [[ "$stopped_rows" == *" $ancestor "* ]]; then
      record "$label" stopped "S4 the ancestor row $ancestor/ stopped, so this row was not attempted"
      return 0
    fi
  done
  return 1
}

ensure_directory() {
  local relative="$1"
  local evidence="$2"
  local absolute="$project_root/$1"

  if row_is_blocked "$relative/"; then
    return 1
  fi
  if [[ -L "$absolute" ]]; then
    record "$relative/" stopped "S4 present as a symbolic link, not a directory"
    return 1
  fi
  if [[ -d "$absolute" ]]; then
    record "$relative/" exists "$evidence"
    return 0
  fi
  if [[ -e "$absolute" ]]; then
    record "$relative/" stopped "S4 present as a file, not a directory"
    return 1
  fi
  if mkdir "$absolute" 2>/dev/null; then
    record "$relative/" created "$evidence"
    return 0
  fi
  record "$relative/" stopped "mkdir was refused by the filesystem"
  return 1
}

create_empty_file() {
  local relative="$1"
  local absolute="$project_root/$1"

  if row_is_blocked "$relative"; then
    return 1
  fi
  if [[ -e "$absolute" || -L "$absolute" ]]; then
    record "$relative" exists "left untouched; content unchanged"
    return 0
  fi
  if ! : >"$absolute" 2>/dev/null; then
    record "$relative" stopped "refusal-3 noclobber refused a path that already exists"
    return 1
  fi
  if [[ -f "$absolute" && ! -s "$absolute" ]]; then
    record "$relative" created "empty placeholder, 0 bytes"
    return 0
  fi
  record "$relative" stopped "the created path is not an empty regular file"
  return 1
}

copy_file_bytes() {
  local relative="$1"
  local source="$2"
  local evidence="$3"
  local absolute="$project_root/$1"

  if row_is_blocked "$relative"; then
    return 1
  fi
  if [[ -e "$absolute" || -L "$absolute" ]]; then
    if cmp -s "$source" "$absolute"; then
      record "$relative" exists "left untouched; identical to $(source_label "$source")"
    else
      record "$relative" skipped \
        "drift; source $(checksum "$source"); target $(checksum "$absolute"); byte-unchanged"
    fi
    return 0
  fi
  if ! cat "$source" >"$absolute" 2>/dev/null; then
    record "$relative" stopped "refusal-3 noclobber refused a path that already exists"
    return 1
  fi
  if cmp -s "$source" "$absolute"; then
    record "$relative" created "$evidence"
    return 0
  fi
  record "$relative" stopped "the copy is not byte-identical to its source"
  return 1
}

write_gobbi_ignore() {
  local relative=".gobbi/.gitignore"
  local absolute="$project_root/.gobbi/.gitignore"

  if row_is_blocked "$relative"; then
    return 1
  fi
  if [[ -e "$absolute" || -L "$absolute" ]]; then
    if printf '%s' "$canonical_gobbi_ignore" | cmp -s - "$absolute"; then
      record "$relative" exists "3 canonical lines; cmp equal"
    else
      record "$relative" stopped "S3 present with other bytes; never rewritten"
    fi
    return 0
  fi
  if ! printf '%s' "$canonical_gobbi_ignore" >"$absolute" 2>/dev/null; then
    record "$relative" stopped "refusal-3 noclobber refused a path that already exists"
    return 1
  fi
  if printf '%s' "$canonical_gobbi_ignore" | cmp -s - "$absolute"; then
    record "$relative" created "3 canonical lines; cmp equal"
    return 0
  fi
  record "$relative" stopped "the written file does not match the canonical bytes"
  return 1
}

# Same acceptance the prerequisite checker applies: a bare or a namespaced entry satisfies the row.
has_claude_permission() {
  local bare="$1"
  local namespaced="$2"
  local settings_path="$3"

  jq -e --arg bare "$bare" --arg namespaced "$namespaced" \
    '(.permissions.allow // []) as $allow
    | (($allow | index($bare)) != null or ($allow | index($namespaced)) != null)' \
    "$settings_path" >/dev/null 2>&1
}

# A present settings file is never edited, so its gaps are reported instead.
report_settings_gaps() {
  local settings="$1"
  local missing=()
  local role
  local skill

  for role in "${roles[@]}"; do
    if ! has_claude_permission "Agent($role)" "Agent(gobbi:$role)" "$settings"; then
      missing+=("Agent(gobbi:$role)")
    fi
  done
  for skill in "${permission_skills[@]}"; do
    if ! has_claude_permission "Skill($skill)" "Skill(gobbi:$skill)" "$settings"; then
      missing+=("Skill(gobbi:$skill)")
    fi
  done

  if ((${#missing[@]} == 0)); then
    printf 'left untouched; all 12 expected entries present'
  else
    printf 'left untouched; %d of 12 expected entries missing: %s' "${#missing[@]}" "${missing[*]}"
  fi
}

write_claude_settings() {
  local relative=".claude/settings.json"
  local absolute="$project_root/.claude/settings.json"

  if row_is_blocked "$relative"; then
    return 1
  fi
  if ! command -v jq >/dev/null 2>&1; then
    record "$relative" stopped "S10 jq is unavailable, so the JSON row is neither written nor proved"
    return 1
  fi
  if [[ -e "$absolute" || -L "$absolute" ]]; then
    if ! jq -e 'type == "object"' "$absolute" >/dev/null 2>&1; then
      record "$relative" stopped "S8 present and not a JSON object; never overwritten"
      return 1
    fi
    record "$relative" exists "$(report_settings_gaps "$absolute")"
    return 0
  fi
  if ! printf '%s' "$minimum_claude_settings" >"$absolute" 2>/dev/null; then
    record "$relative" stopped "refusal-3 noclobber refused a path that already exists"
    return 1
  fi
  if jq -e 'type == "object"' "$absolute" >/dev/null 2>&1; then
    record "$relative" created "minimum object; 5 Agent + 6 Skill entries"
    return 0
  fi
  record "$relative" stopped "the written file is not a JSON object"
  return 1
}

# Rows 36 to 39. Bytes are copied from the named source; a role body is never generated or converted.
write_codex_roles() {
  local role
  local source_file
  local declared_name

  if [[ -z "$codex_source" ]]; then
    record ".codex/agents/" skipped "source-missing; no Codex role source resolved"
    for role in "${roles[@]}"; do
      record ".codex/agents/$role.toml" skipped "source-missing; never generated"
    done
    return 0
  fi
  if ! ensure_directory ".codex/agents" "real directory"; then
    for role in "${roles[@]}"; do
      record ".codex/agents/$role.toml" stopped "S4 the parent is not a real directory"
    done
    return 1
  fi

  for role in "${roles[@]}"; do
    source_file="$codex_source/$role.toml"
    if [[ ! -f "$source_file" || ! -r "$source_file" ]]; then
      record ".codex/agents/$role.toml" skipped "source-missing; never generated"
      continue
    fi
    declared_name="$(sed -n \
      's/^[[:space:]]*name[[:space:]]*=[[:space:]]*"\([^"]*\)"[[:space:]]*$/\1/p' "$source_file")"
    if [[ "$declared_name" != "$role" ]]; then
      record ".codex/agents/$role.toml" stopped \
        "S11 the source declares name \"$declared_name\", not \"$role\""
      continue
    fi
    copy_file_bytes ".codex/agents/$role.toml" "$source_file" \
      "byte copy of $(source_label "$source_file"); name=\"$role\""
  done
}

# Every negative setup asserts rather than omits. These paths are owned elsewhere and never targets, so
# the guard above never sees them.

pass_count=0
warn_count=0
fail_count=0
verbose=false

pass() {
  if [[ "$verbose" == true ]]; then
    printf 'PASS %s\n' "$1"
  fi
  pass_count=$((pass_count + 1))
}

warn() {
  printf 'WARN %s\n' "$1"
  warn_count=$((warn_count + 1))
}

fail() {
  printf 'FAIL %s\n' "$1"
  fail_count=$((fail_count + 1))
}

finish() {
  if ((fail_count > 0)); then
    printf 'FAIL prerequisites: %d passed, %d warnings, %d failed\n' \
      "$pass_count" "$warn_count" "$fail_count"
    exit 1
  fi
  printf 'PASS prerequisites: %d passed, %d warnings, 0 failed\n' "$pass_count" "$warn_count"
}

resolve_script_directory() {
  local source="${BASH_SOURCE[0]}"
  local directory
  local target

  while [[ -L "$source" ]]; do
    directory="$(cd -P "$(dirname "$source")" && pwd)"
    target="$(readlink "$source")"
    if [[ "$target" == /* ]]; then
      source="$target"
    else
      source="$directory/$target"
    fi
  done

  cd -P "$(dirname "$source")" && pwd
}

check_readable_file() {
  local label="$1"
  local path="$2"

  if [[ -f "$path" && -r "$path" ]]; then
    pass "$label"
  else
    fail "$label is missing or unreadable"
  fi
}

check_real_directory() {
  local label="$1"
  local path="$2"

  if [[ -d "$path" && ! -L "$path" && -r "$path" ]]; then
    pass "$label"
  else
    fail "$label is missing, unreadable, or a symbolic link"
  fi
}

toml_boolean() {
  local section="$1"
  local key="$2"
  local path="$3"

  awk -v target_section="$section" -v target_key="$key" '
    /^[[:space:]]*\[/ {
      line = $0
      gsub(/[[:space:]]/, "", line)
      active = (line == "[" target_section "]")
      next
    }
    active {
      line = $0
      sub(/[[:space:]]*#.*/, "", line)
      split_at = index(line, "=")
      if (split_at == 0) {
        next
      }
      name = substr(line, 1, split_at - 1)
      value = substr(line, split_at + 1)
      gsub(/[[:space:]]/, "", name)
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", value)
      if (name == target_key) {
        print value
        exit
      }
    }
  ' "$path"
}

check_ignore_owner() {
  local label="$1"
  local probe="$2"
  local output
  local status
  local source

  output="$(git -C "$project_root" check-ignore --no-index -v "$probe" 2>/dev/null)"
  status=$?
  if ((status != 0)); then
    fail "$label is not ignored"
    return
  fi

  source="${output%%:*}"
  if [[ "$source" == ".gobbi/.gitignore" || "$source" == "$project_root/.gobbi/.gitignore" ]]; then
    pass "$label is ignored by .gobbi/.gitignore"
  else
    fail "$label is ignored by unexpected owner $source"
  fi
}

check_not_ignored() {
  local label="$1"
  local probe="$2"
  local output
  local status

  output="$(git -C "$project_root" check-ignore --no-index -v "$probe" 2>/dev/null)"
  status=$?
  if ((status == 1)); then
    pass "$label is tracked-state eligible"
  elif ((status == 0)); then
    fail "$label is unexpectedly ignored by ${output%%:*}"
  else
    fail "$label ignore state could not be determined"
  fi
}

check_cli() {
  local name="$1"
  local path
  local output
  local status
  local version

  path="$(command -v "$name" 2>/dev/null || true)"
  if [[ -z "$path" ]]; then
    fail "$name CLI is unavailable"
    return
  fi

  output="$("$path" --version 2>&1)"
  status=$?
  if ((status != 0)) || [[ -z "$output" ]]; then
    fail "$name CLI version probe failed"
    return
  fi

  version="$(printf '%s\n' "$output" | awk 'NF { line = $0 } END { print line }')"
  pass "$name CLI: $version"
}


check_only=false
verbose=false
project_key=""
skills_root=""
agents_root=""
codex_source=""
targets=()

setup_usage() {
  printf 'Usage: %s [--check] [--verbose] [--project-key <key>] [--skills-root <absolute> --agents-root <absolute>]\n' \
    "${0##*/}"
}

setup_parse_args() {
  while (($# > 0)); do
    case "$1" in
      --check) check_only=true; shift ;;
      --verbose) verbose=true; shift ;;
      --project-key | --skills-root | --agents-root)
        if (($# < 2)); then
          printf 'argument error: %s needs a value\n' "$1" >&2
          setup_usage >&2
          exit 2
        fi
        case "$1" in
          --project-key) project_key="$2" ;;
          --skills-root) skills_root="$2" ;;
          --agents-root) agents_root="$2" ;;
        esac
        shift 2
        ;;
      *)
        printf 'argument error: unknown argument %s\n' "$1" >&2
        setup_usage >&2
        exit 2
        ;;
    esac
  done
}

setup_resolve_project() {
  if ! command -v git >/dev/null 2>&1; then
    if [[ "$check_only" == true ]]; then
      fail "Git CLI is unavailable"
      finish
    fi
    stop_run S5 'the Git CLI is unavailable' 'command -v git'
  fi
  project_root="$(git rev-parse --show-toplevel 2>/dev/null)"
  if [[ -z "$project_root" ]]; then
    if [[ "$check_only" == true ]]; then
      fail "current directory is not inside a Git worktree"
      finish
    fi
    stop_run S5 'the current directory is not inside a Git worktree' 'git rev-parse --show-toplevel'
  fi
  project_root="$(cd "$project_root" && pwd -P)"
  if [[ "$check_only" == true ]]; then
    pass "Git worktree root: $project_root"
  fi
  validate_root_pair
  if [[ -z "$project_key" ]]; then
    common_dir="$(git -C "$project_root" rev-parse --path-format=absolute --git-common-dir 2>/dev/null)"
    if [[ -z "$common_dir" ]]; then
      if [[ "$check_only" == true ]]; then
        fail "Git common directory could not be resolved"
        finish
      fi
      stop_run S5 'the Git common directory could not be resolved' \
        'git rev-parse --path-format=absolute --git-common-dir'
    fi
    project_key="$(basename "$(dirname "$common_dir")")"
  fi
  if ((${#project_key} > 64)) || [[ ! "$project_key" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]]; then
    if [[ "$check_only" == true ]]; then
      fail "Gobbi project key is invalid: $project_key"
      project_key_valid=false
    else
      stop_run S6 \
        "the project key \"$project_key\" exceeds 64 characters or fails its pattern; ask the user, then pass --project-key" \
        'the resolved key against ^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'
    fi
  else
    project_key_valid=true
    if [[ "$check_only" == true ]]; then
      pass "Gobbi project key: $project_key"
    fi
  fi
  script_directory="$(resolve_script_directory)"
  package_base="$(cd -P "$script_directory/../../../.." 2>/dev/null && pwd)"
  codex_source="$(resolve_codex_source "$package_base" || true)"
  if [[ "$check_only" != true ]]; then
    if git -C "$project_root" check-ignore --no-index -q .gobbi/ 2>/dev/null; then
      stop_run S1 \
        "an ancestor ignores .gobbi/ ($(git -C "$project_root" check-ignore --no-index -v .gobbi/ 2>/dev/null))" \
        'git check-ignore --no-index -v .gobbi/'
    fi
    tracked_runtime_state="$(git -C "$project_root" ls-files -- \
      ".gobbi/projects/$project_key/sessions" ".gobbi/projects/$project_key/worktrees" 2>/dev/null)"
    if [[ -n "$tracked_runtime_state" ]]; then
      stop_run S2 \
        "runtime state is tracked where the layout requires ignored state: $(printf '%s' "$tracked_runtime_state" | tr '\n' ' ')" \
        "git ls-files -- .gobbi/projects/$project_key/sessions .gobbi/projects/$project_key/worktrees"
    fi
  fi
}

append_shared_targets() {
  targets+=(
    ".gobbi"
    ".gobbi/.gitignore"
    ".gobbi/projects"
    ".gobbi/projects/$project_key"
    ".gobbi/projects/$project_key/agents"
    ".gobbi/projects/$project_key/agents/README.md"
    ".gobbi/projects/$project_key/skills"
    ".gobbi/projects/$project_key/skills/README.md"
    ".gobbi/projects/$project_key/memory"
    ".gobbi/projects/$project_key/memory/design"
    ".gobbi/projects/$project_key/memory/design/README.md"
    ".gobbi/projects/$project_key/memory/design/architecture"
    ".gobbi/projects/$project_key/memory/design/feature"
    ".gobbi/projects/$project_key/memory/design/process"
    ".gobbi/projects/$project_key/memory/design/roadmap"
    ".gobbi/projects/$project_key/memory/learnings"
    ".gobbi/projects/$project_key/memory/reports"
    ".gobbi/projects/$project_key/memory/reports/README.md"
    ".gobbi/projects/$project_key/memory/reports/note"
    ".gobbi/projects/$project_key/memory/reports/review"
    ".gobbi/projects/$project_key/memory/reports/analysis"
    ".gobbi/projects/$project_key/memory/history"
    ".gobbi/projects/$project_key/memory/history/README.md"
    ".gobbi/projects/$project_key/memory/materials"
    ".gobbi/projects/$project_key/memory/materials/README.md"
    ".gobbi/projects/$project_key/memory/materials/references"
    ".gobbi/projects/$project_key/memory/materials/assets"
    ".gobbi/projects/$project_key/memory/materials/docs"
    ".gobbi/projects/$project_key/memory/materials/data"
    ".gobbi/projects/$project_key/memory/backlogs"
    ".gobbi/projects/$project_key/memory/backlogs/README.md"
    "AGENTS.md"
  )
}

guard_all_targets() {
  if [[ -n "${HOME:-}" && "$project_root" == "$HOME" ]]; then
    refuse refusal-5 \
      "the resolved project root is the home directory $HOME, so every target would be a \$HOME path" \
      'the project root against $HOME'
  fi
  local target
  for target in "${targets[@]}"; do
    guard_target "$target"
  done
}

write_shared_layout() {
  ensure_directory ".gobbi" "real directory"
  write_gobbi_ignore
  ensure_directory ".gobbi/projects" "real directory"
  ensure_directory ".gobbi/projects/$project_key" "real directory"
  ensure_directory ".gobbi/projects/$project_key/agents" "real directory"
  create_empty_file ".gobbi/projects/$project_key/agents/README.md"
  ensure_directory ".gobbi/projects/$project_key/skills" "real directory"
  create_empty_file ".gobbi/projects/$project_key/skills/README.md"
  ensure_directory ".gobbi/projects/$project_key/memory" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/design" "real directory"
  create_empty_file ".gobbi/projects/$project_key/memory/design/README.md"
  ensure_directory ".gobbi/projects/$project_key/memory/design/architecture" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/design/feature" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/design/process" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/design/roadmap" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/learnings" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/reports" "real directory"
  create_empty_file ".gobbi/projects/$project_key/memory/reports/README.md"
  ensure_directory ".gobbi/projects/$project_key/memory/reports/note" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/reports/review" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/reports/analysis" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/history" "real directory"
  create_empty_file ".gobbi/projects/$project_key/memory/history/README.md"
  ensure_directory ".gobbi/projects/$project_key/memory/materials" "real directory"
  create_empty_file ".gobbi/projects/$project_key/memory/materials/README.md"
  ensure_directory ".gobbi/projects/$project_key/memory/materials/references" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/materials/assets" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/materials/docs" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/materials/data" "real directory"
  ensure_directory ".gobbi/projects/$project_key/memory/backlogs" "real directory"
  create_empty_file ".gobbi/projects/$project_key/memory/backlogs/README.md"
  create_empty_file "AGENTS.md"
}

print_setup_header() {
  printf 'gobbi setup: project root %s\n' "$project_root"
  printf 'gobbi setup: project key %s\n' "$project_key"
  printf 'gobbi setup: runtime %s\n' "$1"
  printf '\n'
  ledger_line path action evidence
}

print_setup_summary() {
  printf '\ngobbi setup: %d created, %d exists, %d skipped, %d stopped, %d not-mine\n' \
    "$created_count" "$exists_count" "$skipped_count" "$stopped_count" "$not_mine_count"
  if ((stopped_count > 0)); then
    exit 1
  fi
}

check_shared_layout() {
  check_real_directory ".gobbi directory" "$project_root/.gobbi"
  check_real_directory ".gobbi/projects directory" "$project_root/.gobbi/projects"
  check_readable_file ".gobbi/.gitignore" "$project_root/.gobbi/.gitignore"
  check_readable_file "root AGENTS.md" "$project_root/AGENTS.md"
  if [[ "$project_key_valid" != true ]]; then
    return
  fi
  local gobbi_project="$project_root/.gobbi/projects/$project_key"
  local category subject stub rule count
  check_real_directory ".gobbi/projects/$project_key directory" "$gobbi_project"
  check_real_directory ".gobbi/projects/$project_key/agents directory" "$gobbi_project/agents"
  check_real_directory ".gobbi/projects/$project_key/skills directory" "$gobbi_project/skills"
  check_real_directory ".gobbi/projects/$project_key/memory directory" "$gobbi_project/memory"
  for category in design learnings reports history materials backlogs; do
    check_real_directory ".gobbi/projects/$project_key/memory/$category directory" \
      "$gobbi_project/memory/$category"
  done
  for subject in design/architecture design/feature design/process design/roadmap \
    reports/note reports/review reports/analysis \
    materials/references materials/assets materials/docs materials/data; do
    check_real_directory ".gobbi/projects/$project_key/memory/$subject directory" \
      "$gobbi_project/memory/$subject"
  done
  for stub in agents/README.md skills/README.md memory/design/README.md \
    memory/reports/README.md memory/history/README.md memory/materials/README.md \
    memory/backlogs/README.md; do
    check_readable_file ".gobbi/projects/$project_key/$stub" "$gobbi_project/$stub"
  done
}

check_claude() {
  local settings="$project_root/.claude/settings.json"
  local role skill
  check_real_directory ".claude directory" "$project_root/.claude"
  check_readable_file ".claude/CLAUDE.md" "$project_root/.claude/CLAUDE.md"
  check_readable_file ".claude/settings.json" "$settings"
  check_readable_file ".claude/skills/gobbi/SKILL.md" "$project_root/.claude/skills/gobbi/SKILL.md"
  check_readable_file ".claude/skills/principles/SKILL.md" "$project_root/.claude/skills/principles/SKILL.md"
  for role in "${roles[@]}"; do
    check_readable_file ".claude/agents/$role.md" "$project_root/.claude/agents/$role.md"
  done
  if command -v jq >/dev/null 2>&1 && [[ -f "$settings" && -r "$settings" ]] \
    && jq -e 'type == "object"' "$settings" >/dev/null 2>&1; then
    if jq -e '(.permissions.allow | type) == "array"' "$settings" >/dev/null 2>&1; then
      for role in "${roles[@]}"; do
        if has_claude_permission "Agent($role)" "Agent(gobbi:$role)" "$settings"; then
          pass "Claude Agent permission: $role"
        else
          fail "Claude Agent permission is missing: $role"
        fi
      done
      for skill in gobbi principles discussion delegation; do
        if has_claude_permission "Skill($skill)" "Skill(gobbi:$skill)" "$settings"; then
          pass "Claude Skill permission: $skill"
        else
          fail "Claude Skill permission is missing: $skill"
        fi
      done
    else
      fail "Claude permission allow-list is missing or invalid"
    fi
  else
    fail "jq is unavailable or .claude/settings.json is not a JSON object"
  fi
  check_cli claude
}

check_codex() {
  local role agent_path
  check_real_directory ".codex directory" "$project_root/.codex"
  check_readable_file ".codex/AGENTS.md" "$project_root/.codex/AGENTS.md"
  check_readable_file ".codex/config.toml" "$project_root/.codex/config.toml"
  check_real_directory ".codex/agents directory" "$project_root/.codex/agents"
  for role in "${roles[@]}"; do
    agent_path="$project_root/.codex/agents/$role.toml"
    check_readable_file ".codex/agents/$role.toml" "$agent_path"
  done
  check_cli codex
}

check_grok() {
  local role
  check_real_directory ".grok directory" "$project_root/.grok"
  check_real_directory ".grok/skills directory" "$project_root/.grok/skills"
  check_readable_file ".grok/skills/gobbi/SKILL.md" "$project_root/.grok/skills/gobbi/SKILL.md"
  check_readable_file ".grok/skills/principles/SKILL.md" "$project_root/.grok/skills/principles/SKILL.md"
  check_real_directory ".grok/agents directory" "$project_root/.grok/agents"
  for role in "${roles[@]}"; do
    check_readable_file ".grok/agents/$role.md" "$project_root/.grok/agents/$role.md"
  done
  check_cli grok
}

check_cursor() {
  local role agent_path agent_name
  check_real_directory ".cursor directory" "$project_root/.cursor"
  for role in "${roles[@]}"; do
    agent_path="$project_root/.cursor/agents/$role.md"
    check_readable_file ".cursor/agents/$role.md" "$agent_path"
  done
  check_readable_file ".cursor/skills/gobbi/SKILL.md" "$project_root/.cursor/skills/gobbi/SKILL.md"
  check_readable_file ".cursor/skills/principles/SKILL.md" "$project_root/.cursor/skills/principles/SKILL.md"
  warn "Cursor parent session must start as grok-4.7[effort=xhigh]"
  check_cli cursor-agent
}

load_role_owner() {
  role_owner="$(cd "$script_directory/../../../.." 2>/dev/null && pwd -P)/agents"
  if [[ ! -d "$role_owner" || -L "$role_owner" ]]; then
    role_owner="$(cd "$script_directory/../../../.." 2>/dev/null && pwd -P)"
  fi
}
