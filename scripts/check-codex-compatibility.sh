#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
failures=0
emit_passes=1

pass() {
  if [[ "$emit_passes" -eq 1 ]]; then
    printf 'PASS %s\n' "$1"
  fi
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

check_literal() {
  local path="$1"
  local literal="$2"
  local label="$3"
  if rg -F -q -- "$literal" "$repo_root/$path"; then
    pass "$label"
  else
    fail "$label"
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

check_bridge_commands() {
  local path="$1"
  local expected_count="$2"
  local label="$3"
  if python3 - "$repo_root/$path" "$expected_count" <<'PY'
import re
import sys
from pathlib import Path

path = Path(sys.argv[1])
expected_count = int(sys.argv[2])
text = path.read_text()
blocks = re.findall(r"```bash\n(.*?)```", text, re.S)
commands = [block for block in blocks if re.search(r"\bcodex exec\b", block)]
pair = "-m gpt-5.6-sol -c 'model_reasoning_effort=\"xhigh\"'"
if len(commands) != expected_count:
    raise SystemExit(1)
for command in commands:
    normalized = re.sub(r"\\\s*\n\s*", " ", command)
    normalized = " ".join(normalized.split())
    if pair not in normalized:
        raise SystemExit(1)
PY
  then
    pass "$label"
  else
    fail "$label"
  fi
}

check_workflow_pointer_shape() {
  local path=".gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md"
  local label="Workflow evaluation has one pointer-only Codex bridge owner line"
  if python3 - "$repo_root/$path" <<'PY'
import sys
from pathlib import Path

text = Path(sys.argv[1]).read_text()
if text.count("**Codex bridge owners:**") != 1:
    raise SystemExit(1)
pointer = next(line for line in text.splitlines() if "**Codex bridge owners:**" in line)
required = (
    "[`codex/SKILL.md`](../../codex/SKILL.md)",
    "[`codex/delegation.md`](../../codex/delegation.md)",
)
if not all(token in pointer for token in required):
    raise SystemExit(1)
for token in ("codex exec", "gpt-5.6-sol", "model_reasoning_effort", "--effort"):
    if token in text:
        raise SystemExit(1)
PY
  then
    pass "$label"
  else
    fail "$label"
  fi
}

run_policy_checks() {
  local role
  local template

  check_contains ".codex/config.toml" '^model = "gpt-5\.6-sol"$' "Repository Codex model is gpt-5.6-sol"
  check_contains ".codex/config.toml" '^model_reasoning_effort = "xhigh"$' "Repository Codex effort is xhigh"
  check_contains ".codex/config.toml" '^plan_mode_reasoning_effort = "xhigh"$' "Repository Codex Plan mode effort is xhigh"

  for role in manager leader executor evaluator assistant; do
    check_contains ".codex/agents/$role.toml" '^model = "gpt-5\.6-sol"$' "Codex agent $role model is gpt-5.6-sol"
    check_contains ".codex/agents/$role.toml" '^model_reasoning_effort = "xhigh"$' "Codex agent $role effort is xhigh"
  done

  for template in \
    ".gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json" \
    ".gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json"
  do
    for role in manager leader executor evaluator assistant; do
      check_json_value "$template" ".models.codex.$role" "gpt-5.6-sol" "$template Codex $role model is gpt-5.6-sol"
    done
    check_json_value "$template" '.models.codex | keys | sort | join(",")' 'assistant,evaluator,executor,leader,manager' "$template keeps exactly five Codex role leaves"
    check_json_value "$template" '[.. | objects | keys[]? | select(test("effort"; "i"))] | length' '0' "$template introduces no effort key"
  done

  check_literal ".gobbi/projects/gobbi/skills/agent-writing/SKILL.md" 'Five STANDARD keys are present in every wrapper' "Agent-writing documents the five-key wrapper schema"
  check_literal ".gobbi/projects/gobbi/skills/agent-writing/SKILL.md" '`name`, `description`, `model`, `model_reasoning_effort`, and `developer_instructions`' "Agent-writing names every standard wrapper key"
  check_literal ".gobbi/projects/gobbi/skills/agent-writing/SKILL.md" 'model = "gpt-5.6-sol"' "Agent-writing sample pins the Codex model"
  check_literal ".gobbi/projects/gobbi/skills/agent-writing/SKILL.md" 'model_reasoning_effort = "xhigh"' "Agent-writing sample pins xhigh effort"
  check_not_contains ".gobbi/projects/gobbi/skills/agent-writing/SKILL.md" 'model_reasoning_effort = "high"' "Agent-writing has no mixed-effort wrapper sample"

  check_literal ".gobbi/projects/gobbi/skills/codex/SKILL.md" "Gobbi's current Codex policy pins the repository default and every repo-local role wrapper" "Codex skill owns the current runtime policy"
  check_literal ".gobbi/projects/gobbi/skills/codex/SKILL.md" 'There is no standalone `--effort` flag.' "Codex skill rejects the nonexistent standalone effort flag"
  check_not_contains ".gobbi/projects/gobbi/skills/codex/SKILL.md" '`codex exec` supports `--effort' "Codex skill has no invalid standalone effort teaching"
  check_bridge_commands ".gobbi/projects/gobbi/skills/codex/SKILL.md" 5 "Codex skill has five complete current-policy bridge commands"
  check_bridge_commands ".gobbi/projects/gobbi/skills/codex/delegation.md" 4 "Codex delegation has four complete current-policy bridge commands"
  check_literal ".gobbi/projects/gobbi/skills/codex/delegation.md" 'owns Codex runtime selection, model and effort policy' "Codex delegation routes high-level policy to the parent owner"

  for role in manager leader executor evaluator assistant; do
    check_contains ".gobbi/projects/gobbi/skills/delegation/SKILL.md" '^\| `'$role'` .* \| gpt-5\.6-sol \| xhigh \|' "Delegation model table pins $role to gpt-5.6-sol/xhigh"
  done
  check_not_contains ".gobbi/projects/gobbi/skills/delegation/SKILL.md" 'inherit parent|inherits the parent session model' "Delegation has no parent-model inheritance policy"

  for role in manager leader executor evaluator assistant; do
    check_contains ".gobbi/projects/gobbi/skills/gobbi/SKILL.md" "^\\| \\*\\*$role\\*\\* \\| (opus|sonnet) \\| xhigh \\|" "Gobbi taxonomy sets $role effort to xhigh"
  done
  check_literal ".gobbi/projects/gobbi/skills/gobbi/SKILL.md" 'model = "gpt-5.6-sol"' "Gobbi operating convention pins the Codex model"
  check_literal ".gobbi/projects/gobbi/skills/gobbi/SKILL.md" 'model_reasoning_effort = "xhigh"' "Gobbi operating convention pins Codex effort"

  check_workflow_pointer_shape
  check_literal ".gobbi/projects/gobbi/skills/git/conventions.md" "Thin wrappers carry the role's Codex model and effort defaults plus the git-posture pointer" "Git conventions describe current wrapper contents"
}

check_live_residuals() {
  local label="Tracked Codex policy residuals are exhaustively classified by line"
  if python3 - "$repo_root" <<'PY'
import re
import subprocess
import sys
from pathlib import Path

root = Path(sys.argv[1])
tracked = subprocess.check_output(
    ["git", "-C", str(root), "ls-files", "-z", ".gobbi/projects/gobbi"],
).split(b"\0")
patterns = (
    re.compile(r"(?i)(?:codex|\.codex|models\.codex).{0,160}(?:inherit(?:s|ed)?[^\n]{0,80}model|model[^\n]{0,80}inherit)"),
    re.compile(r"(?i)(?:(?:codex|\.codex)[^\n]{0,160}(?:do not|must not|without)[^\n]{0,80}hard.?code[^\n]{0,40}model|(?:do not|must not)[^\n]{0,80}hard.?code[^\n]{0,40}model[^\n]{0,160}(?:codex|\.codex))"),
    re.compile(r"(?i)without violating \"do not hard-code model/effort unless the user asks\""),
    re.compile(r"(?i)do not add model names[^\n]{0,100}\.codex|wrappers?[^\n]{0,100}not a copy of the model"),
    re.compile(r"(?i)defaulting to inherit \(unset\)"),
    re.compile(r'model_reasoning_effort\s*=\s*"high"'),
    re.compile(r"(?i)(?:leader[^\n]{0,100}xhigh[^\n]{0,180}(?:manager|assistant|executor|evaluator)[^\n]{0,100}high|(?:manager|assistant|executor|evaluator)[^\n]{0,120}high[^\n]{0,180}leader[^\n]{0,100}xhigh)"),
    re.compile(r"--effort"),
)
allowed_lines = {
    (
        ".gobbi/projects/gobbi/skills/codex/SKILL.md",
        "There is no standalone `--effort` flag. Gobbi bridge calls set reasoning effort with",
    ),
    (
        ".gobbi/projects/gobbi/plans/workflow/2026-07-01-codex-conducted-adversarial-review-charter.md",
        "- Codex agents do not hard-code models or effort.",
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/backlogs/codex/proposer-evaluator-model-tier-guard.md",
        '- Requires a settings shape decision: how to express distinct `model`/`effort` for the proposer vs evaluator without violating "do not hard-code model/effort unless the user asks."',
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/backlogs/codex/proposer-evaluator-model-tier-guard.md",
        "Add an optional per-step proposer model/effort override (distinct from the evaluator's), defaulting to inherit (unset). Document it as the option (b) hardening named in Ideation D4. Validate by checking the proposer and evaluator `codex exec` invocations resolve to different tiers when the guard is enabled.",
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/decisions/codex/2026-07-10-verify-cli-before-removing-effort-teaching.md",
        "Current skill text teaches a standalone `--effort` option, while installed CLI evidence exposes `-m` and `-c` but no such flag.",
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/decisions/docs/2026-07-11-exact-effort-line-reflow-brittleness.md",
        "`--effort` statement changes its exact line content and makes the live residual gate fail.",
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/decisions/tests/2026-07-11-bare-effort-token-gate-brittleness.md",
        "dual-use `--effort` token body-wide. The current legitimate negative statement is exact-line",
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/decisions/tests/2026-07-11-bare-effort-token-gate-brittleness.md",
        "Future legitimate `--effort` prose may require classifier maintenance. The open Medium assumption",
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/plans/codex/2026-07-10-deterministic-codex-model-policy.md",
        "  if printf '%s\\n' \"$codex_help\" | rg -q -- '(^|[[:space:],])--effort([[:space:],]|$)'; then",
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/plans/codex/2026-07-10-deterministic-codex-model-policy.md",
        "    printf '%s\\n' 'unexpected standalone --effort option' >&2",
    ),
    (
        ".gobbi/projects/gobbi/features/workflow/reviews/adversarial-review/2026-07-11-policy-docs-and-validator-adversarial-review.md",
        "- **Description**: A future legitimate `--effort` mention can make the body-wide residual gate fail.",
    ),
}
unexpected = []
for raw in tracked:
    if not raw:
        continue
    rel = raw.decode()
    path = root / rel
    if not path.is_file() or path.suffix not in {".md", ".toml", ".json"}:
        continue
    for number, line in enumerate(path.read_text(errors="replace").splitlines(), 1):
        if any(pattern.search(line) for pattern in patterns):
            if (rel, line) not in allowed_lines:
                unexpected.append(f"{rel}:{number}:{line}")

aliases = (
    ".agents/skills/agent-writing/SKILL.md",
    ".agents/skills/codex/SKILL.md",
    ".agents/skills/codex/delegation.md",
    ".agents/skills/delegation/SKILL.md",
    ".agents/skills/gobbi/SKILL.md",
    ".agents/skills/orchestration/workflow/evaluation.md",
    ".agents/skills/git/conventions.md",
)
for rel in aliases:
    path = root / rel
    if not path.is_file():
        unexpected.append(f"{rel}:missing-alias")
        continue
    for number, line in enumerate(path.read_text(errors="replace").splitlines(), 1):
        if any(pattern.search(line) for pattern in patterns):
            if not (
                rel == ".agents/skills/codex/SKILL.md"
                and line == "There is no standalone `--effort` flag. Gobbi bridge calls set reasoning effort with"
            ):
                unexpected.append(f"{rel}:{number}:{line}")

owner_counts = {
    ".gobbi/projects/gobbi/skills/codex/SKILL.md": 5,
    ".gobbi/projects/gobbi/skills/codex/delegation.md": 4,
}
pair = "-m gpt-5.6-sol -c 'model_reasoning_effort=\"xhigh\"'"
for raw in tracked:
    if not raw:
        continue
    rel = raw.decode()
    path = root / rel
    if not path.is_file() or path.suffix != ".md" or "/skills/" not in rel:
        continue
    blocks = re.findall(r"```bash\n(.*?)```", path.read_text(errors="replace"), re.S)
    commands = [block for block in blocks if re.search(r"\bcodex exec\b", block)]
    if not commands:
        continue
    if rel not in owner_counts or len(commands) != owner_counts[rel]:
        unexpected.append(f"{rel}:unowned-or-wrong-count-codex-exec-blocks:{len(commands)}")
        continue
    for index, command in enumerate(commands, 1):
        normalized = re.sub(r"\\\s*\n\s*", " ", command)
        normalized = " ".join(normalized.split())
        if pair not in normalized:
            unexpected.append(f"{rel}:bash-block-{index}:incomplete-policy-pair")

if unexpected:
    print("\n".join(unexpected), file=sys.stderr)
    raise SystemExit(1)
PY
  then
    pass "$label"
  else
    fail "$label"
  fi
}

copy_policy_fixture() {
  local fixture_root="$1"
  local path
  local paths=(
    ".codex/config.toml"
    ".codex/agents/manager.toml"
    ".codex/agents/leader.toml"
    ".codex/agents/executor.toml"
    ".codex/agents/evaluator.toml"
    ".codex/agents/assistant.toml"
    ".gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json"
    ".gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json"
    ".gobbi/projects/gobbi/skills/agent-writing/SKILL.md"
    ".gobbi/projects/gobbi/skills/codex/SKILL.md"
    ".gobbi/projects/gobbi/skills/codex/delegation.md"
    ".gobbi/projects/gobbi/skills/delegation/SKILL.md"
    ".gobbi/projects/gobbi/skills/gobbi/SKILL.md"
    ".gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md"
    ".gobbi/projects/gobbi/skills/git/conventions.md"
  )
  for path in "${paths[@]}"; do
    mkdir -p "$fixture_root/$(dirname "$path")"
    cp -L "$repo_root/$path" "$fixture_root/$path"
  done
}

run_policy_fixture() {
  local fixture_root="$1"
  local repo_root="$fixture_root"
  local failures=0
  local emit_passes=0
  run_policy_checks
  [[ "$failures" -eq 0 ]]
}

assert_fixture_rejected() {
  local fixture="$1"
  local fixture_root="$2"
  local expected_failure="$3"
  local output
  local failure_count
  if output="$(run_policy_fixture "$fixture_root" 2>&1)"; then
    printf 'FAIL self-test: %s was accepted\n' "$fixture" >&2
    return 1
  fi
  failure_count="$(printf '%s\n' "$output" | awk '/^FAIL / { count++ } END { print count + 0 }')"
  if [[ "$failure_count" -ne 1 ]] || ! printf '%s\n' "$output" | grep -F -q -- "FAIL $expected_failure"; then
    printf 'FAIL self-test: %s rejected for an unexpected reason\n%s\n' "$fixture" "$output" >&2
    return 1
  fi
  printf 'PASS self-test: %s\n' "$fixture"
}

run_self_tests() {
  local temp_root
  local fixture_root
  local source
  local target
  temp_root="$(mktemp -d)"
  trap 'rm -rf "$temp_root"' RETURN

  fixture_root="$temp_root/wrong-model"
  copy_policy_fixture "$fixture_root"
  sed -i 's/^model = "gpt-5.6-sol"$/model = "wrong-model"/' "$fixture_root/.codex/config.toml"
  assert_fixture_rejected "wrong-model" "$fixture_root" "Repository Codex model is gpt-5.6-sol"

  fixture_root="$temp_root/wrong-effort"
  copy_policy_fixture "$fixture_root"
  sed -i 's/^model_reasoning_effort = "xhigh"$/model_reasoning_effort = "high"/' "$fixture_root/.codex/agents/assistant.toml"
  assert_fixture_rejected "wrong-effort" "$fixture_root" "Codex agent assistant effort is xhigh"

  fixture_root="$temp_root/wrong-template-leaf"
  copy_policy_fixture "$fixture_root"
  sed -i '0,/"assistant": "gpt-5.6-sol"/s//"assistant": "wrong-model"/' "$fixture_root/.gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json"
  assert_fixture_rejected "wrong-template-leaf" "$fixture_root" ".gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json Codex assistant model is gpt-5.6-sol"

  fixture_root="$temp_root/incomplete-bridge-command"
  copy_policy_fixture "$fixture_root"
  source="$fixture_root/.gobbi/projects/gobbi/skills/codex/delegation.md"
  target="$source.tmp"
  awk 'BEGIN { removed = 0 } !removed && index($0, "model_reasoning_effort=\"xhigh\"") { removed = 1; next } { print }' "$source" > "$target"
  mv "$target" "$source"
  assert_fixture_rejected "incomplete-bridge-command" "$fixture_root" "Codex delegation has four complete current-policy bridge commands"

  fixture_root="$temp_root/wrong-pointer"
  copy_policy_fixture "$fixture_root"
  sed -i 's/\*\*Codex bridge owners:\*\*/**Codex bridge ownership:**/' "$fixture_root/.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md"
  assert_fixture_rejected "wrong-pointer" "$fixture_root" "Workflow evaluation has one pointer-only Codex bridge owner line"

  printf 'PASS self-test: 5/5 fixtures rejected\n'
}

case "${1:-}" in
  "")
    [[ "$#" -eq 0 ]] || exit 2
    ;;
  --self-test)
    if [[ "$#" -ne 1 ]]; then
      printf 'usage: %s [--self-test]\n' "${0##*/}" >&2
      exit 2
    fi
    run_self_tests
    exit 0
    ;;
  *)
    printf 'usage: %s [--self-test]\n' "${0##*/}" >&2
    exit 2
    ;;
esac

if [[ -n "${CODEX_THREAD_ID:-}" ]]; then
  pass "CODEX_THREAD_ID is present"
else
  printf 'INFO CODEX_THREAD_ID is not set in this shell; static checks continue\n'
fi

if ! command -v jq >/dev/null 2>&1; then
  fail "jq is required"
fi

if ! command -v python3 >/dev/null 2>&1; then
  fail "python3 is required"
fi

run_policy_checks

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
  check_symlink "$toml" "../../.gobbi/projects/gobbi/agents/$role.toml"
  check_git_symlink_mode "$toml"
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
check_contains ".agents/skills/codex/SKILL.md" 'Native Codex' "Codex skill documents native runtime"
check_contains ".agents/skills/codex/SKILL.md" '\.codex/agents' "Codex skill documents Codex custom agents"
check_contains ".agents/skills/codex/SKILL.md" 'Codex plugin package exposes skills and hooks' "Codex skill documents plugin scope"
check_contains ".agents/skills/preparation/SKILL.md" 'single canonical skill root for both runtimes' "Preparation names the .gobbi SSOT workspace skill root"
check_contains ".agents/skills/planning/SKILL.md" 'single canonical skill root for both runtimes' "Planning names the .gobbi SSOT workspace skill root"
check_not_contains ".agents/skills/preparation/SKILL.md" 'Workspace skills under `\.claude/skills/` \(when discoverable\)|check `\.claude/skills/`' "Preparation uses runtime-aware workspace skill root"
check_not_contains ".agents/skills/planning/SKILL.md" 'workspace skills under `\.claude/skills/`' "Planning uses runtime-aware workspace skill root"
check_contains "AGENTS.md" 'symlinks to the canonical Gobbi directories' "Root AGENTS documents symlinked plugin package"
check_contains "AGENTS.md" 'Native Codex custom agents remain repo-local' "Root AGENTS documents Codex custom-agent boundary"
check_contains "AGENTS.md" 'scripts/check-codex-plugin-smoke.sh' "Root AGENTS documents Codex plugin smoke check"
check_contains ".codex/AGENTS.md" 'symlinks to the canonical Gobbi directories' "Codex AGENTS documents symlinked plugin package"
check_contains ".codex/AGENTS.md" 'Native Codex custom agents remain repo-local' "Codex AGENTS documents Codex custom-agent boundary"
check_contains ".codex/AGENTS.md" 'scripts/check-codex-plugin-smoke.sh' "Codex AGENTS documents Codex plugin smoke check"

check_live_residuals

if [[ "$failures" -gt 0 ]]; then
  printf '%s codex compatibility check(s) failed\n' "$failures" >&2
  exit 1
fi

printf 'Codex compatibility checks passed\n'
