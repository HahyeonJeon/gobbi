#!/usr/bin/env bash

set -uo pipefail

export LC_ALL=C

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

has_claude_permission() {
  local bare="$1"
  local namespaced="$2"
  local settings_path="$3"

  jq -e --arg bare "$bare" --arg namespaced "$namespaced" \
    '(.permissions.allow // []) as $allow
    | (($allow | index($bare)) != null or ($allow | index($namespaced)) != null)' \
    "$settings_path" >/dev/null 2>&1
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

if (($# > 1)); then
  printf 'Usage: %s [--verbose]\n' "${0##*/}" >&2
  exit 2
fi
if (($# == 1)) && [[ "$1" != "--verbose" ]]; then
  printf 'Usage: %s [--verbose]\n' "${0##*/}" >&2
  exit 2
fi
if (($# == 1)); then
  verbose=true
fi

if ! command -v git >/dev/null 2>&1; then
  fail "Git CLI is unavailable"
  finish
fi
pass "Git CLI is available"

project_root="$(git rev-parse --show-toplevel 2>/dev/null)"
if [[ -z "$project_root" ]]; then
  fail "current directory is not inside a Git worktree"
  finish
fi
project_root="$(cd "$project_root" && pwd -P)"
pass "Git worktree root: $project_root"

common_dir="$(git -C "$project_root" rev-parse --path-format=absolute --git-common-dir 2>/dev/null)"
if [[ -z "$common_dir" ]]; then
  fail "Git common directory could not be resolved"
  finish
fi

project_key="$(basename "$(dirname "$common_dir")")"
if ((${#project_key} <= 64)) && [[ "$project_key" =~ ^[a-z0-9]([a-z0-9-]*[a-z0-9])?$ ]]; then
  pass "Gobbi project key: $project_key"
  project_key_valid=true
else
  fail "Gobbi project key is invalid: $project_key"
  project_key_valid=false
fi

script_directory="$(resolve_script_directory)"
role_owner="$(cd "$script_directory/../../../agents" 2>/dev/null && pwd -P)"
roles=()
if [[ -n "$role_owner" && -d "$role_owner" && ! -L "$role_owner" ]]; then
  pass "Gobbi agent source: $role_owner"
  shopt -s nullglob
  role_files=("$role_owner"/codex/*.toml)
  if ((${#role_files[@]} == 0)); then
    role_files=("$role_owner"/*.toml)
  fi
  if ((${#role_files[@]} == 0)); then
    role_files=("$role_owner"/*.md)
  fi
  shopt -u nullglob
  for role_file in "${role_files[@]}"; do
    base="$(basename "$role_file")"
    if [[ "$base" == "README.md" ]]; then
      continue
    fi
    if [[ "$role_file" == *.toml ]]; then
      role="${base%.toml}"
      role_name="$(sed -n 's/^[[:space:]]*name[[:space:]]*=[[:space:]]*"\([^"]*\)"[[:space:]]*$/\1/p' "$role_file")"
    else
      role="${base%.md}"
      role_name="$(sed -n 's/^name:[[:space:]]*//p' "$role_file" | head -n 1 | tr -d '\r')"
    fi
    if [[ "$role_name" == "$role" ]]; then
      roles+=("$role")
    else
      fail "Gobbi agent source $role_file must declare name = \"$role\" exactly once"
    fi
  done
  if ((${#roles[@]} == 0)); then
    fail "Gobbi agent source contains no valid role files"
  fi
else
  fail "Gobbi agent source is missing, unreadable, or a symbolic link"
fi

claude_settings="$project_root/.claude/settings.json"
check_real_directory ".claude directory" "$project_root/.claude"
check_readable_file ".claude/CLAUDE.md" "$project_root/.claude/CLAUDE.md"
check_readable_file ".claude/settings.json" "$claude_settings"
check_readable_file ".claude/skills/gobbi/SKILL.md" "$project_root/.claude/skills/gobbi/SKILL.md"
check_readable_file ".claude/skills/principles/SKILL.md" "$project_root/.claude/skills/principles/SKILL.md"

for role in "${roles[@]}"; do
  check_readable_file ".claude/agents/$role.md" "$project_root/.claude/agents/$role.md"
done

claude_settings_valid=false
claude_permissions_valid=false
if command -v jq >/dev/null 2>&1; then
  pass "jq is available for Claude settings checks"
  if [[ -f "$claude_settings" && -r "$claude_settings" ]] \
    && jq -e 'type == "object"' "$claude_settings" >/dev/null 2>&1; then
    pass ".claude/settings.json contains a JSON object"
    claude_settings_valid=true
  else
    fail ".claude/settings.json is not a valid JSON object"
  fi
else
  fail "jq is unavailable; Claude settings cannot be checked safely"
fi

if [[ "$claude_settings_valid" == true ]]; then
  if jq -e '.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS == "1"' \
    "$claude_settings" >/dev/null 2>&1; then
    pass "Claude Agent Teams environment flag is enabled"
  else
    fail "Claude Agent Teams environment flag is not set to 1"
  fi

  teammate_mode="$(jq -r '.teammateMode // empty' "$claude_settings")"
  if [[ -n "$teammate_mode" ]]; then
    pass "Claude teammate mode: $teammate_mode"
  else
    warn "Claude teammateMode is absent; Claude will use its runtime default"
  fi

  if jq -e '(.permissions.allow | type) == "array"' \
    "$claude_settings" >/dev/null 2>&1; then
    pass "Claude permission allow-list is present"
    claude_permissions_valid=true
  else
    fail "Claude permission allow-list is missing or invalid"
  fi
fi

if [[ "$claude_permissions_valid" == true ]]; then
  for role in "${roles[@]}"; do
    if has_claude_permission "Agent($role)" "Agent(gobbi:$role)" "$claude_settings"; then
      pass "Claude Agent permission: $role"
    else
      fail "Claude Agent permission is missing: $role"
    fi
  done

  skills=(gobbi principles discussion delegation agent-teams gobbi-setup)
  for skill in "${skills[@]}"; do
    if has_claude_permission "Skill($skill)" "Skill(gobbi:$skill)" "$claude_settings"; then
      pass "Claude Skill permission: $skill"
    else
      fail "Claude Skill permission is missing: $skill"
    fi
  done
fi

check_real_directory ".gobbi directory" "$project_root/.gobbi"
check_real_directory ".gobbi/projects directory" "$project_root/.gobbi/projects"
check_readable_file ".gobbi/.gitignore" "$project_root/.gobbi/.gitignore"

if [[ "$project_key_valid" == true ]]; then
  gobbi_project="$project_root/.gobbi/projects/$project_key"
  check_real_directory ".gobbi/projects/$project_key directory" "$gobbi_project"
  check_real_directory ".gobbi/projects/$project_key/agents directory" "$gobbi_project/agents"
  check_real_directory ".gobbi/projects/$project_key/skills directory" "$gobbi_project/skills"
  check_real_directory ".gobbi/projects/$project_key/memory directory" "$gobbi_project/memory"

  memory_categories=(design learnings reports history materials backlogs)
  for category in "${memory_categories[@]}"; do
    check_real_directory ".gobbi/projects/$project_key/memory/$category directory" \
      "$gobbi_project/memory/$category"
  done

  memory_subjects=(
    design/architecture design/feature design/process design/roadmap
    reports/note reports/review reports/analysis
    materials/references materials/assets materials/docs materials/data
  )
  for subject in "${memory_subjects[@]}"; do
    check_real_directory ".gobbi/projects/$project_key/memory/$subject directory" \
      "$gobbi_project/memory/$subject"
  done

  readme_stubs=(
    agents/README.md
    skills/README.md
    memory/design/README.md
    memory/reports/README.md
    memory/history/README.md
    memory/materials/README.md
    memory/backlogs/README.md
  )
  for stub in "${readme_stubs[@]}"; do
    check_readable_file ".gobbi/projects/$project_key/$stub" "$gobbi_project/$stub"
  done

  gobbi_ignore="$project_root/.gobbi/.gitignore"
  if [[ -f "$gobbi_ignore" && -r "$gobbi_ignore" ]]; then
    ignore_rules=("projects/*/sessions/" "projects/*/worktrees/")
    for rule in "${ignore_rules[@]}"; do
      count="$(grep -Fxc -- "$rule" "$gobbi_ignore" || true)"
      if [[ "$count" == "1" ]]; then
        pass ".gobbi/.gitignore owns $rule"
      else
        fail ".gobbi/.gitignore must contain $rule exactly once"
      fi
    done

    if git -C "$project_root" ls-files --error-unmatch .gobbi/.gitignore >/dev/null 2>&1; then
      pass ".gobbi/.gitignore is tracked"
    else
      fail ".gobbi/.gitignore is not tracked"
    fi
  fi

  check_ignore_owner "Gobbi sessions state" ".gobbi/projects/$project_key/sessions/.gobbi-check"
  check_ignore_owner "Gobbi worktrees state" ".gobbi/projects/$project_key/worktrees/.gobbi-check"
  check_not_ignored "Gobbi memory state" ".gobbi/projects/$project_key/memory/.gobbi-check"
  check_not_ignored "Gobbi agents state" ".gobbi/projects/$project_key/agents/.gobbi-check"
  check_not_ignored "Gobbi skills state" ".gobbi/projects/$project_key/skills/.gobbi-check"
  for category in "${memory_categories[@]}"; do
    check_not_ignored "Gobbi memory/$category state" \
      ".gobbi/projects/$project_key/memory/$category/.gobbi-check"
  done
  for subject in "${memory_subjects[@]}"; do
    check_not_ignored "Gobbi memory/$subject state" \
      ".gobbi/projects/$project_key/memory/$subject/.gobbi-check"
  done
  for stub in "${readme_stubs[@]}"; do
    check_not_ignored "Gobbi $stub" ".gobbi/projects/$project_key/$stub"
  done

  root_ignore="$project_root/.gitignore"
  duplicate_rules=()
  if [[ -f "$root_ignore" && -r "$root_ignore" ]]; then
    for rule in "projects/*/sessions/" "projects/*/worktrees/"; do
      if grep -Fqx -- "$rule" "$root_ignore"; then
        duplicate_rules+=("$rule")
      fi
    done
  fi
  if ((${#duplicate_rules[@]} == 0)); then
    pass "repository .gitignore does not duplicate Gobbi runtime rules"
  else
    warn "repository .gitignore duplicates Gobbi runtime rules: ${duplicate_rules[*]}"
  fi
fi

codex_config="$project_root/.codex/config.toml"
check_real_directory ".codex directory" "$project_root/.codex"
check_readable_file "root AGENTS.md" "$project_root/AGENTS.md"
check_readable_file ".codex/AGENTS.md" "$project_root/.codex/AGENTS.md"
check_readable_file ".codex/config.toml" "$codex_config"
check_readable_file ".agents/skills/gobbi/SKILL.md" "$project_root/.agents/skills/gobbi/SKILL.md"
check_real_directory ".codex/agents directory" "$project_root/.codex/agents"

for role in "${roles[@]}"; do
  agent_path="$project_root/.codex/agents/$role.toml"
  check_readable_file ".codex/agents/$role.toml" "$agent_path"
  if [[ -f "$agent_path" && -r "$agent_path" ]]; then
    agent_name="$(sed -n 's/^[[:space:]]*name[[:space:]]*=[[:space:]]*"\([^"]*\)"[[:space:]]*$/\1/p' "$agent_path")"
    if [[ "$agent_name" == "$role" ]]; then
      pass ".codex/agents/$role.toml name matches its filename"
    else
      fail ".codex/agents/$role.toml must declare name = \"$role\" exactly once"
    fi
  fi
done

if [[ -f "$codex_config" && -r "$codex_config" ]]; then
  if [[ "$(toml_boolean agents enabled "$codex_config")" == "true" ]]; then
    pass "Codex agents are enabled"
  else
    fail "Codex [agents].enabled is not true"
  fi

  if [[ "$(toml_boolean features multi_agent "$codex_config")" == "true" ]]; then
    pass "Codex multi-agent support is enabled"
  else
    fail "Codex [features].multi_agent is not true"
  fi
fi

check_real_directory ".grok directory" "$project_root/.grok"
check_real_directory ".grok/skills directory" "$project_root/.grok/skills"
check_readable_file ".grok/skills/gobbi/SKILL.md" "$project_root/.grok/skills/gobbi/SKILL.md"
check_readable_file ".grok/skills/principles/SKILL.md" "$project_root/.grok/skills/principles/SKILL.md"
check_real_directory ".grok/agents directory" "$project_root/.grok/agents"
check_real_directory ".agents/agents directory" "$project_root/.agents/agents"

for role in "${roles[@]}"; do
  check_readable_file ".grok/agents/$role.md" "$project_root/.grok/agents/$role.md"
  check_readable_file ".agents/agents/$role.md" "$project_root/.agents/agents/$role.md"
done

check_real_directory ".cursor directory" "$project_root/.cursor"

for role in "${roles[@]}"; do
  agent_path="$project_root/.cursor/agents/$role.md"
  check_readable_file ".cursor/agents/$role.md" "$agent_path"
  if [[ -f "$agent_path" && -r "$agent_path" ]]; then
    agent_name="$(sed -n 's/^name:[[:space:]]*//p' "$agent_path" | head -n 1 | tr -d '\r')"
    if [[ "$agent_name" == "$role" ]]; then
      pass ".cursor/agents/$role.md name matches its filename"
    else
      fail ".cursor/agents/$role.md must declare name \"$role\" exactly once"
    fi
  fi
done

check_readable_file ".cursor/skills/gobbi/SKILL.md" "$project_root/.cursor/skills/gobbi/SKILL.md"
check_readable_file ".cursor/skills/principles/SKILL.md" "$project_root/.cursor/skills/principles/SKILL.md"

if [[ -n "$role_owner" && -d "$role_owner/cursor" ]]; then
  for role in "${roles[@]}"; do
    agent_path="$role_owner/cursor/$role.md"
    check_readable_file "Gobbi agent source cursor/$role.md" "$agent_path"
    if [[ -f "$agent_path" && -r "$agent_path" ]]; then
      agent_name="$(sed -n 's/^name:[[:space:]]*//p' "$agent_path" | head -n 1 | tr -d '\r')"
      if [[ "$agent_name" == "$role" ]]; then
        pass "Gobbi agent source cursor/$role.md name matches its filename"
      else
        fail "Gobbi agent source cursor/$role.md must declare name \"$role\" exactly once"
      fi
    fi
  done
fi

warn "Cursor parent session must start as grok-4.6[effort=xhigh]"

check_cli claude
check_cli codex
check_cli cursor-agent
check_cli grok

agent_path="$(command -v agent 2>/dev/null || true)"
if [[ -n "$agent_path" ]]; then
  warn "bare agent resolves to $agent_path"
fi

finish
