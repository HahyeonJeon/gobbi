#!/usr/bin/env bash

# apply-setup.sh — the Gobbi setup writer.
#
# Creates a consumer project's missing Gobbi layout, instruction placeholders, Claude Code settings, and
# Codex role contracts, then prints one ledger row per target. Every write is create-if-absent: nothing
# existing is opened for write, nothing is overwritten, nothing outside the resolved project root is
# written, and no Git command here changes repository state. Judgment, user questions, the prerequisite
# checker runs, and the per-runtime report belong to the setup skill, not to this script.
#
# Usage: apply-setup.sh [--project-key <key>] [--skills-root <absolute> --agents-root <absolute>]
#
# Exit status: 0 when no row stopped, 1 on a stop or a refusal, 2 on an argument error.

set -uo pipefail
set -C # noclobber: the shell itself refuses to truncate an existing file
export LC_ALL=C

roles=(manager leader executor evaluator assistant)
permission_skills=(gobbi principles discussion delegation agent-teams)

# The canonical .gobbi/.gitignore, verbatim from gobbi/SKILL.md Step 1.2. Both patterns carry a middle
# slash, which anchors them to .gobbi/; a slashless sessions/ would also swallow memory/design/sessions/.
canonical_gobbi_ignore='# Gobbi runtime state. Session evidence and linked worktrees are never tracked.
projects/*/sessions/
projects/*/worktrees/
'

# The minimum .claude/settings.json, created only when the file is absent. Namespaced, because a plugin
# consumer's entries read Agent(gobbi:<role>) and Skill(gobbi:<name>).
minimum_claude_settings='{
  "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" },
  "permissions": {
    "allow": [
      "Agent(gobbi:manager)", "Agent(gobbi:leader)", "Agent(gobbi:executor)",
      "Agent(gobbi:evaluator)", "Agent(gobbi:assistant)",
      "Skill(gobbi:gobbi)", "Skill(gobbi:principles)", "Skill(gobbi:discussion)",
      "Skill(gobbi:delegation)", "Skill(gobbi:agent-teams)"
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

# Delegation's root-pair protocol. A supplied pair is validated; neither supplied means the Codex source
# is derived from this script's own location, which Delegation allows.
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

# Two topologies, one relative base. In a Gobbi checkout the base holds agents/codex/; in a plugin
# install it holds role-variants/codex/ and a flat agents/ with no codex/ child.
resolve_codex_source() {
  local base="$1"

  if [[ -n "$agents_root" && -d "$agents_root/codex" ]]; then
    printf '%s' "$agents_root/codex"
    return 0
  fi
  if [[ -n "$base" && -d "$base/agents/codex" ]]; then
    printf '%s' "$base/agents/codex"
    return 0
  fi
  if [[ -n "$base" && -d "$base/role-variants/codex" ]]; then
    printf '%s' "$base/role-variants/codex"
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
# nothing at all. The components checked are relative to the project root. A skills component is always a
# refusal, including the one a repository directory named skills produces through the project key; that
# case is a project condition with a recovery, while any other position is a defect in setup itself.
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
# .gobbi/projects, .gobbi/projects/<key>, .claude, .codex, .codex/agents — and guard_target runs over the
# whole list before the first write. So every ancestor a write could traverse is separately resolved by
# cd -P, and any component below a target's deepest existing ancestor cannot exist yet at guard time.
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

  if ! jq -e '.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS == "1"' "$settings" >/dev/null 2>&1; then
    missing+=("env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS")
  fi
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
    printf 'left untouched; all 11 expected entries present'
  else
    printf 'left untouched; %d of 11 expected entries missing: %s' "${#missing[@]}" "${missing[*]}"
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
    record "$relative" created "minimum object; 5 Agent + 5 Skill entries"
    return 0
  fi
  record "$relative" stopped "the written file is not a JSON object"
  return 1
}

# Row 12. Bytes are copied from the named source; a role body is never generated or converted.
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
report_not_mine() {
  record ".claude/agents/" not-mine "plugin supplies Claude agents from flat agents/"
  record ".cursor/" not-mine "plugin supplies Cursor agents via its declared agents key"
  record ".grok/" not-mine "plugin supplies Grok agents and hooks"
  record ".claude/skills/" not-mine "plugin owns skills; never created"
  record ".agents/agents/" not-mine "no reader among the four runtimes"
  record ".codex/config.toml" not-mine "measured inert; backlog-deferred"
  record ".claude/settings.json hooks.Stop" not-mine "plugin delivers the hook; setup writes none"
  record "~/.grok/hooks/hooks.json" not-mine "outside project root; removal command printed"
}

report_user_actions() {
  printf '\ngobbi setup: actions outside the project root, which only the user runs\n'
  if [[ -z "${HOME:-}" ]]; then
    printf '  HOME is unset, so no user-level path was inspected\n'
  elif [[ -e "$HOME/.grok/hooks/hooks.json" ]]; then
    printf '  %s exists and duplicates the plugin hook when both load; remove it with:\n' \
      "$HOME/.grok/hooks/hooks.json"
    printf '    rm -f %s\n' "$HOME/.grok/hooks/hooks.json"
  else
    printf '  none; %s is absent\n' "$HOME/.grok/hooks/hooks.json"
  fi
}

project_key=""
skills_root=""
agents_root=""

while (($# > 0)); do
  case "$1" in
    --project-key | --skills-root | --agents-root)
      if (($# < 2)); then
        printf 'argument error: %s needs a value\n' "$1" >&2
        usage >&2
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
      usage >&2
      exit 2
      ;;
  esac
done

if ! command -v git >/dev/null 2>&1; then
  stop_run S5 'the Git CLI is unavailable' 'command -v git'
fi

project_root="$(git rev-parse --show-toplevel 2>/dev/null)"
if [[ -z "$project_root" ]]; then
  stop_run S5 'the current directory is not inside a Git worktree' 'git rev-parse --show-toplevel'
fi
project_root="$(cd "$project_root" && pwd -P)"

validate_root_pair

if [[ -z "$project_key" ]]; then
  common_dir="$(git -C "$project_root" rev-parse --path-format=absolute --git-common-dir 2>/dev/null)"
  if [[ -z "$common_dir" ]]; then
    stop_run S5 'the Git common directory could not be resolved' \
      'git rev-parse --path-format=absolute --git-common-dir'
  fi
  project_key="$(basename "$(dirname "$common_dir")")"
fi
if ((${#project_key} > 64)) || [[ ! "$project_key" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]]; then
  stop_run S6 \
    "the project key \"$project_key\" exceeds 64 characters or fails its pattern; ask the user, then pass --project-key" \
    'the resolved key against ^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'
fi

script_directory="$(resolve_script_directory)"
package_base="$(cd -P "$script_directory/../../.." 2>/dev/null && pwd)"
codex_source="$(resolve_codex_source "$package_base" || true)"

# The probe queries .gobbi/ with the trailing slash. A pattern ending in a slash matches only a path Git
# can tell is a directory, and on a fresh consumer .gobbi does not exist yet, so the slashless query misses
# the very case this stop exists for. The slash form catches both pattern shapes.
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

# Every computed target, in write order. The list is ancestor-closed and has to stay that way: adding a
# target whose parent is not also a target breaks containment silently. See the note above
# parent_is_real_directory.
targets=(
  ".gobbi"
  ".gobbi/.gitignore"
  ".gobbi/projects"
  ".gobbi/projects/$project_key"
  ".gobbi/projects/$project_key/memory"
  ".claude"
  ".claude/CLAUDE.md"
  ".claude/settings.json"
  "AGENTS.md"
  ".codex"
  ".codex/AGENTS.md"
  ".codex/agents"
)
for role in "${roles[@]}"; do
  targets+=(".codex/agents/$role.toml")
done

if [[ -n "${HOME:-}" && "$project_root" == "$HOME" ]]; then
  refuse refusal-5 \
    "the resolved project root is the home directory $HOME, so every target would be a \$HOME path" \
    'the project root against $HOME'
fi
for target in "${targets[@]}"; do
  guard_target "$target"
done

printf 'gobbi setup: project root %s\n' "$project_root"
printf 'gobbi setup: project key %s\n' "$project_key"
if [[ -n "$codex_source" ]]; then
  printf 'gobbi setup: Codex role source %s\n' "$codex_source"
else
  printf 'gobbi setup: Codex role source unresolved, which indicates a mis-packaged plugin\n'
fi
printf '\n'
ledger_line path action evidence

# Rows 1 to 5: the Gobbi namespace and its ignore file.
ensure_directory ".gobbi" "real directory"
write_gobbi_ignore
ensure_directory ".gobbi/projects" "real directory"
ensure_directory ".gobbi/projects/$project_key" "real directory"
ensure_directory ".gobbi/projects/$project_key/memory" "namespace root only; no category"

# Rows 6 to 9: Claude Code and the root instruction placeholder. A child is absent whenever its parent
# is, so the design's "only if a child will be created" condition holds whenever the directory is absent.
ensure_directory ".claude" "real directory"
create_empty_file ".claude/CLAUDE.md"
write_claude_settings
create_empty_file "AGENTS.md"

# Rows 10 to 12: Codex.
ensure_directory ".codex" "real directory"
create_empty_file ".codex/AGENTS.md"
write_codex_roles

report_not_mine
report_user_actions

printf '\ngobbi setup: %d created, %d exists, %d skipped, %d stopped, %d not-mine\n' \
  "$created_count" "$exists_count" "$skipped_count" "$stopped_count" "$not_mine_count"
if ((stopped_count > 0)); then
  printf 'gobbi setup: at least one row stopped; nothing was overwritten, so fixing the named condition and re-running is the recovery\n'
  exit 1
fi
exit 0
