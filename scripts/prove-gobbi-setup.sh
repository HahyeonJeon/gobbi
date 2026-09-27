#!/usr/bin/env bash
#
# prove-gobbi-setup.sh — prove rename, layout, S9, Gobbi no-auto-run, report-only checker use, and that
# setup covers every role and permission skill with true counts.
#
# Runs write proofs in a disposable Git repository. Never writes the authoring worktree.

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd -- "$SCRIPT_DIR/.." && pwd)
SKILLS_ROOT="$REPO_ROOT/.gobbi/projects/gobbi/skills"
AGENTS_ROOT="$REPO_ROOT/.gobbi/projects/gobbi/agents"
SETUP="$SKILLS_ROOT/gobbi/setup/scripts/claude.sh"
CHECKER="$SKILLS_ROOT/gobbi/setup/scripts/claude.sh"
CODEX_SETUP="$SKILLS_ROOT/gobbi/setup/scripts/codex.sh"
COMMON="$SKILLS_ROOT/gobbi/setup/scripts/common.sh"
GOBBI_SKILL="$SKILLS_ROOT/gobbi/SKILL.md"

tmp=
cleanup() {
  if [[ -n "${tmp:-}" && -d "$tmp" ]]; then
    rm -rf -- "$tmp"
  fi
}
trap cleanup EXIT

fail() {
  printf 'FAIL %s\n' "$1" >&2
  exit 1
}

passed=0
pass() {
  printf 'PASS %s\n' "$1"
  passed=$((passed + 1))
}

count_non_git() {
  find "$1" -path "$1/.git" -prune -o -mindepth 1 -print | awk 'END { print NR }'
}

[[ -x "$SETUP" ]] || fail "claude.sh is missing or not executable: $SETUP"
[[ -x "$CODEX_SETUP" ]] || fail "codex.sh is missing"
[[ -x "$SKILLS_ROOT/gobbi/setup/scripts/cursor.sh" ]] || fail "cursor.sh is missing"
[[ -x "$SKILLS_ROOT/gobbi/setup/scripts/grok.sh" ]] || fail "grok.sh is missing"
[[ -r "$GOBBI_SKILL" ]] || fail "gobbi/SKILL.md is unreadable: $GOBBI_SKILL"

# 1. No apply-setup.sh in the skill tree.
found=$(find "$SKILLS_ROOT" -name apply-setup.sh -print)
[[ -z "$found" ]] || fail "apply-setup.sh present in the skill tree: $found"
pass "no apply-setup.sh in the skill tree"

# 4. Gobbi Procedure has no checker or setup invocation.
if matches=$(grep -nE 'check-prerequisites\.sh|apply-setup\.sh|setup\.sh' "$GOBBI_SKILL"); then
  fail "Gobbi source invokes a checker or setup script: $matches"
fi
pass "Gobbi Procedure has no checker or setup invocation"

tmp=$(mktemp -d)
fx="$tmp/demo"
mkdir -- "$fx"
git -C "$fx" init -q

# 5. claude.sh --check can run alone and writes nothing.
set +e
(cd "$fx" && "$CHECKER" --check >/dev/null)
checker_status=$?
set -e
((checker_status <= 1)) || fail "claude.sh --check could not run alone (exit $checker_status)"
[[ -z "$(git -C "$fx" status --porcelain)" ]] || fail "claude.sh --check wrote to the fixture"
pass "claude.sh --check runs alone and writes nothing"

# 3. S9 refuses a project key of skills.
set +e
(cd "$fx" && "$SETUP" --project-key skills --skills-root "$SKILLS_ROOT" --agents-root "$AGENTS_ROOT") \
  >"$tmp/s9-key.out" 2>"$tmp/s9-key.err"
s9_key_status=$?
set -e
((s9_key_status == 1)) || fail "project key skills exited $s9_key_status, expected 1"
grep -q 'REFUSED refusal-2 (S9)' "$tmp/s9-key.err" || fail "project key skills did not print S9 refusal"
grep -q 'created: 0 filesystem objects' "$tmp/s9-key.err" || fail "project key skills did not report created: 0"
[[ ! -e "$fx/.gobbi" ]] || fail "project key skills created .gobbi"
pass "S9 refuses a project key of skills"

# 3. S9 refuses .claude/skills. That path is not an owned target, so a disposable
# copy adds it to the computed list and runs the real guard.
s9dir="$tmp/s9"
mkdir -- "$s9dir"
cp -- "$SKILLS_ROOT/gobbi/setup/scripts/common.sh" "$s9dir/common.sh"
awk '
  $0 ~ /targets\+=\("\.claude"/ {
    print
    print "targets+=(\".claude/skills\")"
    next
  }
  { print }
' "$SETUP" >"$s9dir/claude.sh"
chmod +x "$s9dir/claude.sh"
set +e
(cd "$fx" && "$s9dir/claude.sh" --project-key demo --skills-root "$SKILLS_ROOT" --agents-root "$AGENTS_ROOT") \
  >"$tmp/s9-claude.out" 2>"$tmp/s9-claude.err"
s9_claude_status=$?
set -e
((s9_claude_status == 1)) || fail ".claude/skills probe exited $s9_claude_status, expected 1"
grep -q 'REFUSED refusal-2 (S9)' "$tmp/s9-claude.err" || fail ".claude/skills did not print S9 refusal"
grep -q 'computed target .claude/skills' "$tmp/s9-claude.err" || fail ".claude/skills S9 message missing target"
grep -q 'created: 0 filesystem objects' "$tmp/s9-claude.err" || fail ".claude/skills did not report created: 0"
[[ ! -e "$fx/.claude/skills" ]] || fail "refused .claude/skills target was created"
[[ ! -e "$fx/.gobbi" ]] || fail ".claude/skills S9 probe created .gobbi"
pass "S9 refuses .claude/skills"

# 2. claude.sh creates the shared layout plus Claude files, with only the seven README stubs.
set +e
(cd "$fx" && "$SETUP" --project-key demo --skills-root "$SKILLS_ROOT" --agents-root "$AGENTS_ROOT") \
  >"$tmp/setup.out" 2>"$tmp/setup.err"
setup_status=$?
set -e
((setup_status == 0)) || fail "claude.sh exited $setup_status: $(cat "$tmp/setup.err" "$tmp/setup.out")"
created_line="$(grep -E 'gobbi setup: [0-9]+ created,' "$tmp/setup.out" || true)"
[[ -n "$created_line" ]] || fail "claude.sh did not report created counts"
object_count=$(count_non_git "$fx")

ns="$fx/.gobbi/projects/demo"
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
  [[ -f "$ns/$stub" && ! -s "$ns/$stub" ]] || fail "missing or non-empty README stub $stub"
done
readme_count=$(find "$ns" -name README.md -print | awk 'END { print NR }')
((readme_count == 7)) || fail "fixture has $readme_count README.md files, expected 7"
[[ ! -e "$ns/memory/learnings/README.md" ]] || fail "learnings/README.md exists"
[[ ! -e "$ns/memory/README.md" ]] || fail "memory/README.md exists"

leaf_dirs=(
  memory/design/architecture
  memory/design/feature
  memory/design/process
  memory/design/roadmap
  memory/reports/note
  memory/reports/review
  memory/reports/analysis
  memory/materials/references
  memory/materials/assets
  memory/materials/docs
  memory/materials/data
)
for leaf in "${leaf_dirs[@]}"; do
  [[ ! -e "$ns/$leaf/README.md" ]] || fail "leaf README exists at $leaf/README.md"
done
[[ ! -e "$fx/.claude/skills" ]] || fail ".claude/skills exists after setup"
[[ ! -e "$fx/.codex" ]] || fail ".codex exists after claude.sh"
pass "claude.sh creates the shared layout plus Claude files, with only the seven README stubs"

# 6. Setup covers every role and permission skill.
#   - common.sh roles equal the canonical Claude contracts.
#   - Created settings allow Agent(gobbi:<role>) for each role.
#   - Created settings allow Skill(gobbi:<skill>) for each permission skill.
#   - The created row counts the entries the written file holds.
#   - The gap report counts a fixture's known gaps.
#   - A rerun reports every expected entry present.
#   - codex.sh copies each role's TOML byte for byte.
read -r -a roles <<<"$(bash -c 'source "$1" && printf "%s " "${roles[@]}"' _ "$COMMON")"
((${#roles[@]} > 0)) || fail "common.sh declares no roles"
declared=$(printf '%s\n' "${roles[@]}" | sort)
contracts=$(for contract in "$AGENTS_ROOT"/claude/*.md; do
  contract=${contract##*/}
  printf '%s\n' "${contract%.md}"
done | sort)
[[ "$declared" == "$contracts" ]] \
  || fail "common.sh roles (${declared//$'\n'/ }) differ from Claude contracts (${contracts//$'\n'/ })"
for role in "${roles[@]}"; do
  jq -e --arg entry "Agent(gobbi:$role)" '.permissions.allow | index($entry) != null' \
    "$fx/.claude/settings.json" >/dev/null || fail "created settings lack Agent(gobbi:$role)"
done
read -r -a permission_skills <<<"$(bash -c 'source "$1" && printf "%s " "${permission_skills[@]}"' _ "$COMMON")"
((${#permission_skills[@]} > 0)) || fail "common.sh declares no permission skills"
for skill in "${permission_skills[@]}"; do
  jq -e --arg entry "Skill(gobbi:$skill)" '.permissions.allow | index($entry) != null' \
    "$fx/.claude/settings.json" >/dev/null || fail "created settings lack Skill(gobbi:$skill)"
done

# The created row must count the entries the written file holds, not the arrays it meant to write.
written_agents=$(jq '[.permissions.allow[] | select(startswith("Agent("))] | length' "$fx/.claude/settings.json")
written_skills=$(jq '[.permissions.allow[] | select(startswith("Skill("))] | length' "$fx/.claude/settings.json")
settings_row=$(grep -E '^\.claude/settings\.json +created ' "$tmp/setup.out" || true)
created_report="$written_agents Agent + $written_skills Skill entries"
[[ "$settings_row" == *" minimum object; $created_report" ]] \
  || fail "created row does not count the $created_report written: $settings_row"

# The gap report must count a fixture's known gaps. The fixture holds the first role in bare form and the last
# skill namespaced, so every other entry is missing, in array order.
expected_total=$((${#roles[@]} + ${#permission_skills[@]}))
last_skill=${permission_skills[${#permission_skills[@]} - 1]}
expected_missing=()
for role in "${roles[@]:1}"; do
  expected_missing+=("Agent(gobbi:$role)")
done
for skill in "${permission_skills[@]}"; do
  [[ "$skill" == "$last_skill" ]] || expected_missing+=("Skill(gobbi:$skill)")
done
gaps_fx="$tmp/gaps"
mkdir -p -- "$gaps_fx/.claude"
git -C "$gaps_fx" init -q
printf '{"permissions":{"allow":["Agent(%s)","Skill(gobbi:%s)"]}}\n' "${roles[0]}" "$last_skill" \
  >"$gaps_fx/.claude/settings.json"
set +e
(cd "$gaps_fx" && "$SETUP" --project-key demo --skills-root "$SKILLS_ROOT" --agents-root "$AGENTS_ROOT") \
  >"$tmp/gaps.out" 2>"$tmp/gaps.err"
gaps_status=$?
set -e
((gaps_status == 0)) \
  || fail "claude.sh on the gap fixture exited $gaps_status: $(cat "$tmp/gaps.err" "$tmp/gaps.out")"
gaps_row=$(grep -E '^\.claude/settings\.json +exists ' "$tmp/gaps.out" || true)
gaps_report="${#expected_missing[@]} of $expected_total expected entries missing: ${expected_missing[*]}"
[[ "$gaps_row" == *" left untouched; $gaps_report" ]] \
  || fail "gap row does not report ${#expected_missing[@]} of $expected_total missing: $gaps_row"

# A rerun over the created settings must report every expected entry present.
set +e
(cd "$fx" && "$SETUP" --project-key demo --skills-root "$SKILLS_ROOT" --agents-root "$AGENTS_ROOT") \
  >"$tmp/rerun.out" 2>"$tmp/rerun.err"
rerun_status=$?
set -e
((rerun_status == 0)) || fail "claude.sh rerun exited $rerun_status: $(cat "$tmp/rerun.err" "$tmp/rerun.out")"
rerun_row=$(grep -E '^\.claude/settings\.json +exists ' "$tmp/rerun.out" || true)
[[ "$rerun_row" == *" left untouched; all $expected_total expected entries present" ]] \
  || fail "rerun row does not report all $expected_total entries present: $rerun_row"

codex_fx="$tmp/codex"
mkdir -- "$codex_fx"
git -C "$codex_fx" init -q
set +e
(cd "$codex_fx" && "$CODEX_SETUP" --project-key demo --skills-root "$SKILLS_ROOT" --agents-root "$AGENTS_ROOT") \
  >"$tmp/codex.out" 2>"$tmp/codex.err"
codex_status=$?
set -e
((codex_status == 0)) || fail "codex.sh exited $codex_status: $(cat "$tmp/codex.err" "$tmp/codex.out")"
for role in "${roles[@]}"; do
  cmp -s -- "$AGENTS_ROOT/codex/$role.toml" "$codex_fx/.codex/agents/$role.toml" \
    || fail "codex.sh did not write .codex/agents/$role.toml as a byte copy"
done
pass "setup allows and writes all ${#roles[@]} roles and ${#permission_skills[@]} skills, with true counts"

printf 'prove-gobbi-setup: %d proofs passed\n' "$passed"
