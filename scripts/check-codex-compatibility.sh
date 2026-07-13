#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
failures=0

pass() {
  printf 'PASS %s\n' "$1"
}

fail() {
  printf 'FAIL %s\n' "$1" >&2
  failures=$((failures + 1))
}

check_file() {
  local path="$1"
  if [[ -f "$repo_root/$path" ]]; then
    pass "$path exists"
  else
    fail "$path missing"
  fi
}

check_symlink() {
  local path="$1"
  local expected_target="$2"
  if [[ ! -L "$repo_root/$path" ]]; then
    fail "$path is not a symlink"
    return
  fi

  local actual_target
  actual_target="$(readlink "$repo_root/$path")"
  if [[ "$actual_target" == "$expected_target" ]]; then
    pass "$path points at canonical source"
  else
    fail "$path points at $actual_target; expected $expected_target"
  fi
}

check_git_symlink_mode() {
  local path="$1"
  local mode
  mode="$(git -C "$repo_root" ls-files -s -- "$path" | awk '{print $1}')"
  if [[ "$mode" == "120000" ]]; then
    pass "$path is tracked as a symlink"
  else
    fail "$path is not tracked as a symlink (mode ${mode:-<untracked>})"
  fi
}

check_contains() {
  local path="$1"
  local pattern="$2"
  local label="$3"
  if rg -q "$pattern" "$repo_root/$path"; then
    pass "$label"
  else
    fail "$label"
  fi
}

check_not_contains() {
  local path="$1"
  local pattern="$2"
  local label="$3"
  if rg -q "$pattern" "$repo_root/$path"; then
    fail "$label"
  else
    pass "$label"
  fi
}

check_json_value() {
  local path="$1"
  local jq_expr="$2"
  local expected="$3"
  local label="$4"
  local actual
  actual="$(jq -r "$jq_expr" "$repo_root/$path" 2>/dev/null || true)"
  if [[ "$actual" == "$expected" ]]; then
    pass "$label"
  else
    fail "$label (expected $expected, got ${actual:-<empty>})"
  fi
}

check_codex_hook_smoke() {
  local path="$1"
  local label="$2"
  if CODEX_THREAD_ID="gobbi-check" CODEX_CI=1 bash "$repo_root/$path" <<< '{}' >/dev/null 2>&1; then
    pass "$label"
  else
    fail "$label"
  fi
}

if [[ -n "${CODEX_THREAD_ID:-}" ]]; then
  pass "CODEX_THREAD_ID is present"
else
  printf 'INFO CODEX_THREAD_ID is not set in this shell; static checks continue\n'
fi

if ! command -v jq >/dev/null 2>&1; then
  fail "jq is required"
fi

while IFS= read -r skill; do
  [[ -n "$skill" ]] || continue
  check_file ".agents/skills/$skill/SKILL.md"
done < <(find "$repo_root/.gobbi/projects/gobbi/skills" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | sort)

for role in manager leader executor evaluator assistant; do
  toml=".codex/agents/$role.toml"
  check_file "$toml"
  check_contains "$toml" '^name = "' "Codex agent $role has a name"
  check_contains "$toml" '^description = "' "Codex agent $role has a description"
  check_contains "$toml" 'developer_instructions = ' "Codex agent $role has developer instructions"
  check_contains "$toml" ".gobbi/projects/gobbi/agents/$role.md" "Codex agent $role points at canonical prompt"
  if rg -q '^model[[:space:]]*=' "$repo_root/$toml"; then
    fail "Codex agent $role hard-codes model"
  else
    pass "Codex agent $role inherits model"
  fi
done

check_contains ".codex/agents/evaluator.toml" '^sandbox_mode = "read-only"' "Codex evaluator is read-only"

check_file "plugins/gobbi/.codex-plugin/plugin.json"
check_json_value "plugins/gobbi/.codex-plugin/plugin.json" '.skills // empty' './skills/' "Codex plugin declares skills"
check_json_value "plugins/gobbi/.codex-plugin/plugin.json" '.hooks // empty' './hooks/codex-hooks.json' "Codex plugin declares Codex hooks"
check_not_contains "plugins/gobbi/.codex-plugin/plugin.json" 'skills and agents' "Codex plugin description does not claim agents"
check_file "scripts/check-codex-plugin-smoke.sh"
check_contains "scripts/check-codex-plugin-smoke.sh" 'CODEX_HOME' "Codex plugin smoke uses isolated Codex home"

check_symlink "plugins/gobbi/skills" "../../.gobbi/projects/gobbi/skills"
check_symlink "plugins/gobbi/agents" "../../.gobbi/projects/gobbi/agents"
check_symlink "plugins/gobbi/hooks" "../../.gobbi/projects/gobbi/hooks"
check_git_symlink_mode "plugins/gobbi/skills"
check_git_symlink_mode "plugins/gobbi/agents"
check_git_symlink_mode "plugins/gobbi/hooks"

check_file "plugins/gobbi/hooks/hooks.json"
check_file "plugins/gobbi/hooks/codex-hooks.json"
check_contains "plugins/gobbi/hooks/hooks.json" 'CLAUDE_PLUGIN_ROOT:-\$\{PLUGIN_ROOT\}' "Claude hook config prefers Claude plugin root"
check_contains "plugins/gobbi/hooks/codex-hooks.json" 'PLUGIN_ROOT' "Codex hook config uses Codex plugin root fallback"
check_not_contains "plugins/gobbi/hooks/codex-hooks.json" '"Stop"' "Codex hook config avoids ignored Stop event"
check_contains "plugins/gobbi/hooks/codex-hooks.json" '"SubagentStop"' "Codex hook config uses SubagentStop event"
check_not_contains "plugins/gobbi/hooks/codex-hooks.json" '"SessionEnd"|"PostToolUseFailure"' "Codex hook config avoids Claude-only event names"
check_contains ".gobbi/projects/gobbi/hooks/session-start.sh" 'CODEX_THREAD_ID|CODEX_CI' "SessionStart hook is Codex-safe"
check_contains ".gobbi/projects/gobbi/hooks/post-tool-use-agents.sh" 'native Codex hook event' "PostToolUse hook is Codex-safe"
check_contains ".gobbi/projects/gobbi/hooks/session-end.sh" 'native Codex hook event' "SessionEnd hook is Codex-safe"
check_codex_hook_smoke ".gobbi/projects/gobbi/hooks/session-start.sh" "SessionStart hook exits cleanly under Codex env"
check_codex_hook_smoke ".gobbi/projects/gobbi/hooks/post-tool-use-agents.sh" "Subagent metadata hook exits cleanly under Codex env"
check_codex_hook_smoke ".gobbi/projects/gobbi/hooks/session-end.sh" "SessionEnd hook exits cleanly under Codex env"

check_contains ".agents/skills/gobbi/SKILL.md" 'CODEX_THREAD_ID' "Gobbi bootstrap documents Codex thread id"
check_contains ".agents/skills/gobbi/SKILL.md" 'Never run Claude Code gates against a native Codex session' "Gobbi bootstrap skips Claude gates in Codex"
check_contains ".agents/skills/gobbi/SKILL.md" 'agents inherit the parent session model' "Gobbi operating conventions document Codex model inheritance"
check_contains ".agents/skills/gobbi/SKILL.md" 'leader` uses \*\*xhigh\*\*' "Gobbi operating conventions document leader xhigh effort"
check_contains ".agents/skills/gobbi/SKILL.md" 'assistant` use \*\*high\*\*' "Gobbi operating conventions document high effort for non-leader roles"
check_not_contains ".agents/skills/gobbi/SKILL.md" 'agents run at max effort' "Gobbi operating conventions do not apply max-effort defaults"
check_contains ".agents/skills/orchestration/delegation.md" 'uses role-specific effort from the wrapper' "Orchestration delegation model selection documents Codex role effort"
check_contains ".agents/skills/orchestration/delegation.md" '`leader` remains `xhigh`' "Orchestration delegation model selection keeps leader xhigh"
check_not_contains ".agents/skills/orchestration/delegation.md" 'All agents run at max effort' "Orchestration delegation model selection does not apply max-effort defaults"
check_contains ".codex/agents/manager.toml" '^model_reasoning_effort = "high"$' "Manager Codex agent defaults to high effort"
check_contains ".codex/agents/leader.toml" '^model_reasoning_effort = "xhigh"$' "Leader Codex agent remains xhigh effort"
check_contains ".codex/agents/executor.toml" '^model_reasoning_effort = "high"$' "Executor Codex agent defaults to high effort"
check_contains ".codex/agents/evaluator.toml" '^model_reasoning_effort = "high"$' "Evaluator Codex agent defaults to high effort"
check_contains ".codex/agents/assistant.toml" '^model_reasoning_effort = "high"$' "Assistant Codex agent defaults to high effort"
check_contains ".agents/skills/codex/SKILL.md" 'Native Codex' "Codex skill documents native runtime"
check_contains ".agents/skills/codex/SKILL.md" '\.codex/agents' "Codex skill documents Codex custom agents"
check_contains ".agents/skills/codex/SKILL.md" 'Codex plugin package exposes skills and hooks' "Codex skill documents plugin scope"
check_json_value ".agents/skills/orchestration/templates/settings.auto.json" '.models.codex.evaluator' 'null' "Auto Codex evaluator inherits model"
check_json_value ".agents/skills/orchestration/templates/settings.chat.json" '.models.codex.evaluator' 'null' "Chat Codex evaluator inherits model"
check_not_contains ".agents/skills/orchestration/workflow/evaluation.md" 'default `gpt-5' "Evaluation workflow does not hard-code Codex model defaults"
check_contains ".agents/skills/preparation/SKILL.md" 'single canonical skill root for both runtimes' "Preparation names the .gobbi SSOT workspace skill root"
check_contains ".agents/skills/planning/SKILL.md" 'single canonical skill root for both runtimes' "Planning names the .gobbi SSOT workspace skill root"
check_contains ".agents/skills/orchestration/workflow/evaluation.md" 'does not pass `--effort` unless the user explicitly requests it' "Evaluation workflow documents no bridge effort override"
check_contains ".agents/skills/orchestration/workflow/evaluation.md" 'does not apply to bridge `codex exec`' "Evaluation workflow separates native wrapper effort from bridge effort"
check_not_contains ".agents/skills/orchestration/workflow/evaluation.md" 'wrapper supplies the default Codex effort' "Evaluation workflow does not apply native wrapper effort to bridge evaluator"
check_not_contains ".agents/skills/preparation/SKILL.md" 'Workspace skills under `\.claude/skills/` \(when discoverable\)|check `\.claude/skills/`' "Preparation uses runtime-aware workspace skill root"
check_not_contains ".agents/skills/planning/SKILL.md" 'workspace skills under `\.claude/skills/`' "Planning uses runtime-aware workspace skill root"
check_contains "AGENTS.md" 'symlinks to the canonical Gobbi directories' "Root AGENTS documents symlinked plugin package"
check_contains "AGENTS.md" 'Native Codex custom agents remain repo-local' "Root AGENTS documents Codex custom-agent boundary"
check_contains "AGENTS.md" 'scripts/check-codex-plugin-smoke.sh' "Root AGENTS documents Codex plugin smoke check"
check_contains ".codex/AGENTS.md" 'symlinks to the canonical Gobbi directories' "Codex AGENTS documents symlinked plugin package"
check_contains ".codex/AGENTS.md" 'Native Codex custom agents remain repo-local' "Codex AGENTS documents Codex custom-agent boundary"
check_contains ".codex/AGENTS.md" 'scripts/check-codex-plugin-smoke.sh' "Codex AGENTS documents Codex plugin smoke check"

if [[ "$failures" -gt 0 ]]; then
  printf '%s codex compatibility check(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'Codex compatibility checks passed\n'
