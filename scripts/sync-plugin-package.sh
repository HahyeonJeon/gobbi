#!/usr/bin/env bash
set -euo pipefail

repo_root_source="${GOBBI_SYNC_REPO_ROOT:-$(dirname "${BASH_SOURCE[0]}")/..}"
repo_root="$(cd "$repo_root_source" && pwd -P)"
runtime_entrypoint_sync="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)/sync-runtime-entrypoints.sh"
package_root="$repo_root/plugins/gobbi"
check_mode=false
materialize_mode=false

usage_error() {
  printf 'usage: %s [--check | --materialize-package]\n' "$0" >&2
  exit 2
}

if [[ $# -gt 1 ]]; then
  usage_error
fi
if [[ $# -eq 1 ]]; then
  case "$1" in
    --check) check_mode=true ;;
    --materialize-package) materialize_mode=true ;;
    *) usage_error ;;
  esac
fi

# The package's skills and agents components have two valid shapes. Before the publication
# generator has run in a checkout, each is a symlink to its canonical owner. After it has
# run, each is a real directory holding the one generated copy a guard proves byte-equal to
# that owner, because the Codex installer does not follow a symlinked component and installs
# nothing behind one. Every assertion below matches the shape it finds and fails only on a
# genuine mismatch, so --check stays valid on a checkout the generator has not reached yet.
package_components=(skills agents)

package_component_link_target() {
  printf '../../.gobbi/projects/gobbi/%s' "$1"
}

canonical_skills_root="$repo_root/.gobbi/projects/gobbi/skills"
package_only_skill='gobbi-dev'
package_only_skill_token_regex="(^|[^[:alnum:]_-])${package_only_skill}([^[:alnum:]_-]|$)"
claude_skills_drift=0
source_topology_failures=0
roles=(manager leader executor evaluator assistant)

# Normal sync is intentionally a single-writer operation. Callers must not mutate the
# canonical skill tree or .claude/skills while this script is running. The reconciler
# uses that precondition instead of a lock/retry protocol: it proves the full mirror
# safe before its first mutation, then applies the already-proved plan once.
declare -a reconcile_skill_names=()
declare -a reconcile_expected_dirs=()
declare -a reconcile_expected_leaves=()
declare -a reconcile_stale_dirs=()
declare -a reconcile_stale_leaves=()
declare -a reconcile_stale_agents_skill_links=()
declare -A reconcile_expected_dir_set=()
declare -A reconcile_expected_leaf_set=()
declare -A reconcile_expected_target=()
reconcile_canonical_entries=0
reconcile_mirror_entries=0
reconcile_canonical_walks=0
reconcile_mirror_walks=0
reconcile_preflight_failed=0

readlink_raw_target() {
  local -n output="$1"
  local link_path="$2" captured

  # Command substitution removes trailing newlines. `readlink -n` removes only
  # readlink's delimiter, while the sentinel preserves newlines in the target.
  if ! captured="$(readlink -n -- "$link_path" && printf '\034')"; then
    return 1
  fi
  output="${captured%$'\034'}"
}

check_link() {
  local link_path="$1"
  local expected_target="$2"

  if [[ ! -L "$link_path" ]]; then
    printf '%s is not a symlink\n' "$link_path" >&2
    return 1
  fi

  local actual_target
  if ! readlink_raw_target actual_target "$link_path"; then
    printf 'cannot read symlink target for %s\n' "$link_path" >&2
    return 1
  fi
  if [[ "$actual_target" != "$expected_target" ]]; then
    printf '%s points to %s; expected %s\n' "$link_path" "$actual_target" "$expected_target" >&2
    return 1
  fi

  if [[ ! -e "$link_path" ]]; then
    printf '%s points to a missing target\n' "$link_path" >&2
    return 1
  fi
}

ensure_link() {
  local link_path="$1"
  local expected_target="$2"

  if [[ -e "$link_path" && ! -L "$link_path" ]]; then
    printf '%s exists and is not a symlink; move it aside before syncing\n' "$link_path" >&2
    return 1
  fi

  if [[ -L "$link_path" ]]; then
    local actual_target
    if ! readlink_raw_target actual_target "$link_path"; then
      printf 'cannot read symlink target for %s\n' "$link_path" >&2
      return 1
    fi
    if [[ "$actual_target" == "$expected_target" && -e "$link_path" ]]; then
      return 0
    fi
    rm -f "$link_path"
  fi

  mkdir -p "$(dirname "$link_path")"
  ln -s "$expected_target" "$link_path"
}

topology_fail() {
  printf 'source topology: %s\n' "$1" >&2
  source_topology_failures=$((source_topology_failures + 1))
}

require_file() {
  local path="$1"
  [[ -f "$path" ]] || topology_fail "${path#"$repo_root"/} is missing"
}

require_link() {
  local path="$1" expected_target="$2" actual_target
  if [[ ! -L "$path" ]]; then
    topology_fail "${path#"$repo_root"/} is not a symlink"
    return
  fi
  if ! readlink_raw_target actual_target "$path"; then
    topology_fail "${path#"$repo_root"/} has an unreadable symlink target"
    return
  fi
  if [[ "$actual_target" != "$expected_target" ]]; then
    topology_fail "${path#"$repo_root"/} points to $actual_target; expected $expected_target"
  elif [[ ! -e "$path" ]]; then
    topology_fail "${path#"$repo_root"/} points to a missing target"
  fi
}

require_empty_or_absent_dir() {
  local path="$1" first_entry
  if [[ -L "$path" || -f "$path" ]]; then
    topology_fail "${path#"$repo_root"/} is a forbidden hook component"
    return
  fi
  if [[ -d "$path" ]]; then
    first_entry="$(find "$path" -mindepth 1 -print -quit)"
    [[ -z "$first_entry" ]] || topology_fail "${path#"$repo_root"/} contains a forbidden hook component"
  fi
}

require_json_contract() {
  local path="$1" expression="$2" label="$3"
  if ! jq -e "$expression" "$path" >/dev/null 2>&1; then
    topology_fail "$label"
  fi
}

require_semantic_text() {
  local path="$1" text="$2" label="$3"
  [[ -f "$path" ]] || return 0
  grep -Fq -- "$text" "$path" || topology_fail "$label"
}

require_semantic_count() {
  local path="$1" text="$2" expected="$3" label="$4" count
  [[ -f "$path" ]] || return 0
  count="$(grep -Fc -- "$text" "$path" || true)"
  [[ "$count" -eq "$expected" ]] || topology_fail "$label"
}

require_semantic_count_after() {
  local path="$1" anchor="$2" text="$3" expected="$4" label="$5" anchor_line count
  [[ -f "$path" ]] || return 0
  anchor_line="$(awk -v needle="$anchor" 'index($0, needle) { print NR; exit }' "$path")"
  [[ -n "$anchor_line" ]] || return 0
  count="$(awk -v after="$anchor_line" -v needle="$text" '
    NR > after && index($0, needle) { count++ }
    END { print count + 0 }
  ' "$path")"
  [[ "$count" -eq "$expected" ]] || topology_fail "$label"
}

require_semantic_section_words() {
  local path="$1" start="$2" end="$3" text="$4" label="$5"
  [[ -f "$path" ]] || return 0
  if ! awk -v start="$start" -v end="$end" -v needle="$text" '
    index($0, start) { active = 1 }
    active && end != "" && index($0, end) { active = 0 }
    active { section = section " " $0 }
    END {
      gsub(/[[:space:]]+/, " ", section)
      gsub(/[[:space:]]+/, " ", needle)
      exit(index(section, needle) ? 0 : 1)
    }
  ' "$path"; then
    topology_fail "$label"
  fi
}

forbid_semantic_text() {
  local path="$1" text="$2" label="$3"
  [[ -f "$path" ]] || return 0
  if grep -Fq -- "$text" "$path"; then
    topology_fail "$label"
  fi
}

require_semantic_sequence() {
  local path="$1" max_span="$2" label="$3"
  local first_line=0 previous_line=0 line token
  shift 3
  [[ -f "$path" ]] || return 0

  for token in "$@"; do
    line="$(awk -v after="$previous_line" -v needle="$token" '
      NR > after && index($0, needle) { print NR; exit }
    ' "$path")"
    if [[ -z "$line" ]]; then
      topology_fail "$label"
      return 0
    fi
    [[ "$first_line" -ne 0 ]] || first_line="$line"
    previous_line="$line"
  done

  if ((previous_line - first_line > max_span)); then
    topology_fail "$label"
  fi
}

require_semantic_sequence_after() {
  local path="$1" anchor="$2" max_span="$3" label="$4"
  local anchor_line first_line=0 previous_line line token
  shift 4
  [[ -f "$path" ]] || return 0

  anchor_line="$(awk -v needle="$anchor" 'index($0, needle) { print NR; exit }' "$path")"
  [[ -n "$anchor_line" ]] || return 0
  previous_line="$anchor_line"
  for token in "$@"; do
    line="$(awk -v after="$previous_line" -v needle="$token" '
      NR > after && index($0, needle) { print NR; exit }
    ' "$path")"
    if [[ -z "$line" ]]; then
      topology_fail "$label"
      return 0
    fi
    [[ "$first_line" -ne 0 ]] || first_line="$line"
    previous_line="$line"
  done

  if ((previous_line - first_line > max_span)); then
    topology_fail "$label"
  fi
}

require_semantic_permission() {
  local permission="$1" label="$2" settings="$repo_root/.claude/settings.json"
  [[ -f "$settings" ]] || return 0
  if ! jq -e --arg permission "$permission" \
    '.permissions.allow | type == "array" and index($permission) != null' \
    "$settings" >/dev/null 2>&1; then
    topology_fail "$label"
  fi
}

validate_smoke_contracts() {
  local codex="$repo_root/scripts/check-codex-plugin-smoke.sh"
  local claude="$repo_root/scripts/check-claude-plugin-smoke.sh"
  local codex_block claude_block codex_audit_block claude_audit_block smoke stage
  local canonical_exec_count selected_exec_count fixed_runtime_path_count
  local codex_production_anchor="select_codex_runtime || fail 'Codex disk executable selection failed'"
  require_file "$codex"
  require_file "$claude"
  if [[ -f "$codex" && -f "$claude" ]]; then
    codex_block="$(sed -n '/^# BEGIN FROZEN PACKAGE CONTRACT$/,/^# END FROZEN PACKAGE CONTRACT$/p' "$codex")"
    claude_block="$(sed -n '/^# BEGIN FROZEN PACKAGE CONTRACT$/,/^# END FROZEN PACKAGE CONTRACT$/p' "$claude")"
    if [[ -z "$codex_block" || "$codex_block" != "$claude_block" ]]; then
      topology_fail 'Claude and Codex smoke frozen-package contract blocks must remain byte-equal'
    fi
    codex_audit_block="$(sed -n '/^# BEGIN SOURCE PROBE AUDIT CONTRACT$/,/^# END SOURCE PROBE AUDIT CONTRACT$/p' "$codex")"
    claude_audit_block="$(sed -n '/^# BEGIN SOURCE PROBE AUDIT CONTRACT$/,/^# END SOURCE PROBE AUDIT CONTRACT$/p' "$claude")"
    if [[ -z "$codex_audit_block" || "$codex_audit_block" != "$claude_audit_block" ]]; then
      topology_fail 'Claude and Codex source-probe audit contract blocks must remain byte-equal'
    fi
  fi
  require_semantic_count "$codex" 'selected_codex="$(type -P -- codex)"' 1 \
    'Codex runtime selection must use Bash disk-only PATH lookup'
  require_semantic_count "$codex" 'canonical_codex="$(realpath -e -- "$selected_codex" 2>/dev/null)"' 1 \
    'Codex runtime selection must resolve the selected entry once to one canonical executable'
  require_semantic_count "$codex" '[[ "$canonical_codex" != /* || ! -f "$canonical_codex" || ! -x "$canonical_codex" ]]' 1 \
    'Codex runtime selection must require an absolute executable regular canonical target'
  canonical_exec_count="$(grep -Fc -- '/usr/bin/python3 -c "$fd_closure_exec" "$canonical_codex" "$@"' "$codex" || true)"
  selected_exec_count="$(grep -Fc -- '/usr/bin/python3 -c "$fd_closure_exec" "$selected_codex" "$@"' "$codex" || true)"
  if [[ "$canonical_exec_count" -ne 1 || "$selected_exec_count" -ne 0 ]]; then
    topology_fail 'Codex runtime wrapper must execute only the canonical executable'
  fi
  fixed_runtime_path_count="$(grep -Fc -- "PATH='/usr/bin:/bin' \\" "$codex" || true)"
  if [[ "$fixed_runtime_path_count" -ne 3 ]]; then
    topology_fail 'Codex runtime wrapper must use only the fixed system PATH'
  fi
  if grep -Eq -- '(/(home|Users)/|\.nvm[/]versions|packages[/]standalone|GOBBI_CODEX_EXECUTABLE)' "$codex"; then
    topology_fail 'Codex runtime selection must not contain a machine- or home-specific executable path'
  fi
  require_semantic_count "$codex" \
    'pass "selected Codex entry $selected_codex; canonical executable $canonical_codex; version $observed_version"' 1 \
    'Codex runtime success receipt must name the selected entry and canonical executable'
  require_semantic_sequence "$codex" 20 \
    'Codex self-test must finish before production disk lookup' \
    'if [[ "$mode" == --self-test ]]' \
    'run_helper_self_tests' \
    'exit 0' \
    "$codex_production_anchor"
  require_semantic_count "$codex" "$codex_production_anchor" 1 \
    'Codex production disk-selection anchor must appear exactly once'
  require_semantic_sequence_after "$codex" "$codex_production_anchor" 20 \
    'Codex exact version gate must pass before plugin commands' \
    'run_codex_stage version --version' \
    'observed_version="$(< "$stage_stdout")"' \
    'version_output_is_expected "$observed_version"' \
    'run_codex_stage marketplace-add plugin marketplace add'
  require_semantic_count "$codex" "expected_version='codex-cli 0.147.0'" 1 \
    'Codex exact version gate must retain codex-cli 0.147.0'
  for smoke in "$codex" "$claude"; do
    [[ -f "$smoke" ]] || continue
    require_semantic_sequence "$smoke" 35 \
      'runtime smoke usage must reject invalid argv before artifact creation' \
      'case $# in' \
      '0) mode=run ;;' \
      '1) [[ "$1" == --self-test ]] || usage_error; mode=--self-test ;;' \
      '*) usage_error ;;' \
      'esac' \
      'repo_root=' \
      'target="$(mktemp -d /tmp/gobbi-'
    for stage in \
      'assert_invalid_usage_no_artifact literal-run run' \
      "assert_invalid_usage_no_artifact empty ''" \
      'assert_invalid_usage_no_artifact bad --bad' \
      'assert_invalid_usage_no_artifact extra --self-test extra'; do
      require_semantic_count "$smoke" "$stage" 1 \
        'runtime smoke self-test must preserve every invalid-usage no-artifact assertion'
    done
    require_semantic_text "$smoke" 'names = os.listdir("/proc/self/fd")' \
      'runtime smoke wrapper must enumerate /proc/self/fd instead of an RLIMIT range'
    require_semantic_text "$smoke" '/usr/bin/strace -q -f --kill-on-exit -yy -s 256' \
      'runtime smoke must retain terminal trace evidence without detach chatter'
    forbid_semantic_text "$smoke" '/usr/bin/strace -qq ' \
      'runtime smoke must retain terminal trace evidence without detach chatter'
    forbid_semantic_text "$smoke" 'resource.getrlimit' \
      'runtime smoke wrapper must enumerate /proc/self/fd instead of an RLIMIT range'
    require_semantic_text "$smoke" 'find "$root" -mindepth 1 -print0 > "$walk"' \
      'runtime smoke complete tree walks must propagate traversal failure'
    require_semantic_text "$smoke" '[[ -d "$root" && ! -L "$root" && -r "$root" ]]' \
      'runtime smoke frozen manifest must reject a linked or unreadable root'
    require_semantic_text "$smoke" 'digest="$(sha256sum < "$entry")"' \
      'runtime smoke frozen manifest hashes file bytes safely for backslash paths'
    forbid_semantic_text "$smoke" 'tree_matches_package "$package_root" "$installed_path"' \
      'runtime smoke installed acceptance must use the frozen manifest, not the live package'
    require_semantic_count "$smoke" 'frozen_sha256=%s dirs=%s files=%s' 1 \
      'runtime smoke success receipt must expose the frozen digest and tree counts'
    require_semantic_count "$smoke" 'source_probe_regex='"'"'^[[:space:]]*[0-9]+[[:space:]]+socket\((AF_UNIX|AF_LOCAL), SOCK_STREAM\|SOCK_CLOEXEC\|SOCK_NONBLOCK, 0\) = -1 EACCES \(Permission denied\) \(INJECTED\)$'"'"'' 1 \
      'runtime smoke source-probe regex must remain one exact anchored contract'
    require_semantic_count "$smoke" "trace_set='%network,?socketcall,io_uring_setup,pidfd_getfd'" 1 \
      'runtime smoke trace set must remain the exact fixed acquisition surface'
    require_semantic_count "$smoke" "deny_set='socket,?socketcall,connect,bind,listen,accept,accept4,io_uring_setup,pidfd_getfd'" 1 \
      'runtime smoke deny set must remain the exact fixed acquisition surface'
    require_semantic_count "$smoke" 'runtime_denied_regex='"'"'^[[:space:]]*[0-9]+[[:space:]]+(socket|socketcall|connect|bind|listen|accept|accept4|io_uring_setup|pidfd_getfd)\(.*\) = -1 EACCES \(Permission denied\) \(INJECTED\)$'"'"'' 1 \
      'runtime smoke denial parser must remain one exact anchored contract'
    require_semantic_count "$smoke" "failed_result_regex=' = -[0-9]+ [A-Z][A-Z0-9_]* \\([^)]*\\)\$'" 1 \
      'runtime smoke failed-result parser must remain exact and terminally anchored'
    require_semantic_count "$smoke" "unix_descriptor_regex='^[0-9]+<UNIX-(STREAM|DGRAM|SEQPACKET):\\[[0-9]+(->[0-9]+)?\\]>\$'" 1 \
      'runtime smoke Unix descriptor parser must remain exact and terminally anchored'
    require_semantic_count "$smoke" 'declare -A unix_descriptors=() syscall_pids=() terminal_statuses=()' 1 \
      'runtime smoke must bind descriptor provenance and terminal closure by observed pid'
    require_semantic_count "$smoke" 'codex:version|codex:marketplace-add|codex:available-list|codex:install|codex:installed-list|claude:version|claude:validate|claude:marketplace-add|claude:available-list|claude:install|claude:installed-list) ;;' 1 \
      'runtime smoke common allowlist must preserve both exact runtime stage tables'
    require_semantic_count "$smoke" 'runtime_stage_allowed "$audit_owner" "$stage" && [[ "$runtime_wrapper_capability" == "$fixed_runtime:$stage" ]] \' 1 \
      'runtime smoke must reject runtime policy selection before command execution'
    require_semantic_count "$smoke" '[[ "${terminal_statuses[$pid]-missing}" == 0 ]]' 1 \
      'runtime smoke must require one zero-status terminal record for every observed syscall pid'
    require_semantic_count "$smoke" '[[ -s "$trace" ]] || {' 1 \
      'every audited trace must be nonempty'
    require_semantic_count "$smoke" 'runtime trace identity differs from its bound prelaunch target' 1 \
      'runtime smoke must authenticate the prelaunch trace identity before parsing'
    require_semantic_count "$smoke" 'blocked_no_effect_records=%d %s' 1 \
      'runtime smoke blocked receipt must expose its exact stage, syscall, and family records'
    if [[ "$smoke" == "$codex" ]]; then
      require_semantic_count "$smoke" 'case "$stage" in version|marketplace-add|available-list|install|installed-list) ;; *) return 1 ;; esac' 1 \
        'Codex runtime wrapper must preserve its exact stage table'
    else
      require_semantic_count "$smoke" 'case "$stage" in version|validate|marketplace-add|available-list|install|installed-list) ;; *) return 1 ;; esac' 1 \
        'Claude runtime wrapper must preserve its exact stage table'
    fi
    require_semantic_text "$smoke" 'injected_count" -ne 4' \
      'runtime smoke source checks must require exactly four denied local probes per stage'
    require_semantic_count "$smoke" 'audit_stage_trace "$trace" "$stage" "$status" "$audit_policy" "$audit_owner"' 1 \
      'runtime smoke must bind source-probe classification to exact stage, child status, and explicit policy'
    require_semantic_count "$smoke" 'run_traced_stage "$stage" strict helper \' 1 \
      'only helper wrappers may select the strict trace audit policy'
    require_semantic_count "$smoke" 'run_traced_stage "$stage" runtime ' 1 \
      'the fixed runtime wrapper must select semantic no-effect policy'
    require_semantic_count "$smoke" 'run_traced_stage "$stage" source source \' 1 \
      'only the dedicated source-check wrapper may select the source trace audit policy'
    require_semantic_count "$smoke" '[[ "$stage" == source-precheck || "$stage" == source-postcheck ]]' 1 \
      'source trace audit policy must be confined to the two exact source-check stages'
    forbid_semantic_text "$smoke" 'run_test_stage source-precheck' \
      'production source precheck must not use the strict helper wrapper'
    forbid_semantic_text "$smoke" 'run_test_stage source-postcheck' \
      'production source postcheck must not use the strict helper wrapper'
    require_semantic_count "$smoke" 'source-precheck-probes=%s source-postcheck-probes=%s' 1 \
      'runtime smoke success receipt must report both exact source-probe counts'
    require_semantic_text "$smoke" 'source_precheck_probe_count" -eq 4 && "$source_postcheck_probe_count" -eq 4' \
      'runtime smoke must require four precheck and four postcheck probes before success'
    for stage in \
      'write_exact_source_probe_trace "$trace_root/helper-source-probes-three.trace" 3' \
      'write_exact_source_probe_trace "$trace_root/helper-source-probes-five.trace" 5' \
      'helper-source-wrong-flags.trace' \
      'helper-source-wrong-family.trace' \
      'helper-source-wrong-result.trace' \
      'helper-source-other-injection.trace' \
      'audit_trace "$trace_root/helper-source-probes.trace" version 0 strict'; do
      require_semantic_text "$smoke" "$stage" \
      'runtime smoke self-test must preserve source-probe cardinality, shape, injection, and runtime-strict mutations'
    done
    for stage in \
      'runtime_denied_regex=' \
      'helper-runtime-denied.trace' \
      'helper-runtime-wrong-error.trace' \
      'helper-runtime-unmarked.trace' \
      'helper-runtime-unfinished.trace' \
      'helper-runtime-empty.trace' \
      'helper-runtime-truncated.trace' \
      'helper-runtime-resumed.trace' \
      'helper-runtime-success.trace' \
      'helper-runtime-unproved-unix.trace' \
      'runtime_stage_allowed()' \
      'audit_stage_trace()' \
      'unix_descriptors["$left_descriptor"]' \
      'blocked_no_effect_records=%d'; do
      require_semantic_text "$smoke" "$stage" \
        'runtime smoke must preserve semantic no-effect parser and adversarial fixtures'
    done
  done
  require_semantic_sequence "$codex" 160 \
    'Codex smoke must freeze before version and verify every package checkpoint against the frozen manifest' \
    'run_source_check_stage source-precheck ' \
    'freeze_package ||' \
    'run_codex_stage version --version' \
    'verify_frozen_tree "$package_root" package-before-install' \
    'run_codex_stage install plugin add' \
    'verify_frozen_tree "$package_root" package-after-install' \
    'verify_frozen_tree "$installed_path" installed-cache' \
    'run_source_check_stage source-postcheck' \
    'verify_frozen_tree "$package_root" package-before-success' \
    'smoke_complete=1'
  require_semantic_sequence "$claude" 160 \
    'Claude smoke must freeze before version and verify every package checkpoint against the frozen manifest' \
    'run_source_check_stage source-precheck ' \
    'freeze_package ||' \
    'run_claude_stage version --version' \
    'verify_frozen_tree "$package_root" package-before-install' \
    'run_claude_stage install plugin install' \
    'verify_frozen_tree "$package_root" package-after-install' \
    'verify_frozen_tree "$installed_path" installed-cache' \
    'run_source_check_stage source-postcheck' \
    'verify_frozen_tree "$package_root" package-before-success' \
    'smoke_complete=1'
  require_semantic_count "$codex" 'fixed_runtime=codex' 1 'Codex smoke must bind runtime policy to its fixed wrapper identity'
  require_semantic_count "$claude" 'fixed_runtime=claude' 1 'Claude smoke must bind runtime policy to its fixed wrapper identity'
  require_semantic_text "$codex" 'case "$stage" in version|marketplace-add|available-list|install|installed-list)' \
    'Codex fixed wrapper must retain its closed runtime stage allowlist'
  require_semantic_text "$claude" 'case "$stage" in version|validate|marketplace-add|available-list|install|installed-list)' \
    'Claude fixed wrapper must retain its closed runtime stage allowlist'
  for stage in version marketplace-add available-list install installed-list; do
    require_semantic_count_after "$codex" "$codex_production_anchor" "run_codex_stage $stage " 1 \
      "Codex production smoke stage $stage must appear exactly once"
  done
  for stage in source-precheck source-postcheck; do
    require_semantic_count "$codex" "run_source_check_stage $stage " 1 \
      "Codex production smoke stage $stage must appear exactly once"
  done
  for stage in version validate marketplace-add available-list install installed-list; do
    require_semantic_count "$claude" "run_claude_stage $stage " 1 \
      "Claude production smoke stage $stage must appear exactly once"
  done
  for stage in source-precheck source-postcheck; do
    require_semantic_count "$claude" "run_source_check_stage $stage " 1 \
      "Claude production smoke stage $stage must appear exactly once"
  done
}

package_skill_path_excluded() {
  path_is_equal_or_descendant "$1" "$package_only_skill"
}

path_is_equal_or_descendant() {
  local path="$1" root="$2" prefix
  [[ "$path" == "$root" ]] && return 0
  prefix="${root}/"
  ((${#path} >= ${#prefix})) && [[ "${path:0:${#prefix}}" == "$prefix" ]]
}

read_frontmatter_value() {
  local -n output="$1"
  local path="$2" key="$3" value

  if ! value="$(awk -v wanted="$key" '
    NR == 1 {
      if ($0 != "---") exit 10
      inside = 1
      next
    }
    inside && $0 == "---" {
      closed = 1
      inside = 0
      nextfile
    }
    inside {
      prefix = wanted ":"
      if (index($0, prefix) == 1) {
        count++
        value = substr($0, length(prefix) + 1)
        sub(/^[[:space:]]+/, "", value)
      }
    }
    END {
      if (!closed || count != 1) exit 11
      print value
    }
  ' "$path")"; then
    return 1
  fi
  output="$value"
}

unquote_frontmatter_value() {
  local value="$1"
  if [[ "$value" == \"*\" && ${#value} -ge 2 ]]; then
    value="${value:1:${#value}-2}"
  fi
  printf '%s' "$value"
}

validate_package_only_skill_owner() {
  local owner="$canonical_skills_root/$package_only_skill"
  local root_skill="$owner/SKILL.md"
  local entry rel actual_files actual_dirs row name type description expected_description child child_skill root_tools dev_tools
  local expected_files expected_dirs expected_child_section
  local expected_root_description='MUST load before realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs; collecting exact-revision test evidence for Gobbi; reviewing one Gobbi change or the whole Gobbi project for scoped evidence and findings without an acceptance verdict; preparing or recovering a Gobbi release candidate, supplying a frozen Gobbi release candidate to Evaluation before manager or user acceptance, or promoting, publishing, or recovering an accepted Gobbi release; installing, verifying, or recovering a released Gobbi plugin deployment in caller-named isolated Claude Code and Codex targets; choosing Gobbi development lifecycle names, topology, branch roles, handoff vocabulary, or evidence forms; or choosing or diagnosing Gobbi project commands, tools, prerequisites, and effects. Gobbi Development Lifecycle is a domain skill that routes the task to its applicable operation, tool, and preference child skills.'
  local -a children=(
    gobbi-dev-conventions:preference
    gobbi-dev-deployment:operation
    gobbi-dev-development:operation
    gobbi-dev-release:operation
    gobbi-dev-review:operation
    gobbi-dev-testing:operation
    gobbi-dev-toolchain:tool
  )

  if [[ -L "$owner" || ! -d "$owner" ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill must be a real directory"
    return
  fi
  if [[ -L "$root_skill" || ! -f "$root_skill" || ! -r "$root_skill" ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/SKILL.md must be a readable real regular file"
    return
  fi

  if ! read_frontmatter_value name "$root_skill" name || [[ "$name" != "$package_only_skill" ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/SKILL.md must declare name: $package_only_skill"
  fi
  if ! read_frontmatter_value type "$root_skill" skill-type || [[ "$type" != domain ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/SKILL.md must declare skill-type: domain"
  fi
  if ! read_frontmatter_value description "$root_skill" description || \
     [[ "$description" != "\"$expected_root_description\"" ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/SKILL.md must preserve the exact accepted root description"
  fi
  if ! read_frontmatter_value root_tools "$root_skill" allowed-tools || [[ "$root_tools" != Read ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/SKILL.md must declare allowed-tools: Read"
  fi
  if ! read_frontmatter_value dev_tools "$owner/gobbi-dev-development/SKILL.md" allowed-tools || \
     [[ "$dev_tools" != 'Read, Grep, Glob, Bash' ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/gobbi-dev-development/SKILL.md must declare allowed-tools: Read, Grep, Glob, Bash"
  fi
  if [[ "$(grep -c '^# Gobbi Development Lifecycle$' "$root_skill" || true)" -ne 1 ]] || \
     [[ "$(grep -c '^## Child Skills$' "$root_skill" || true)" -ne 1 ]] || \
     [[ "$(grep -c '^## ' "$root_skill" || true)" -ne 1 ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/SKILL.md must retain the navigation-only root shell"
  fi

  expected_files=$'SKILL.md\ngobbi-dev-conventions/SKILL.md\ngobbi-dev-deployment/SKILL.md\ngobbi-dev-deployment/checklists.md\ngobbi-dev-development/SKILL.md\ngobbi-dev-release/SKILL.md\ngobbi-dev-release/checklists.md\ngobbi-dev-review/SKILL.md\ngobbi-dev-testing/SKILL.md\ngobbi-dev-toolchain/SKILL.md'
  expected_dirs=$'gobbi-dev-conventions\ngobbi-dev-deployment\ngobbi-dev-development\ngobbi-dev-release\ngobbi-dev-review\ngobbi-dev-testing\ngobbi-dev-toolchain'
  actual_files="$(cd "$owner" && find . -mindepth 1 -type f -print | sed 's|^\./||' | LC_ALL=C sort)"
  actual_dirs="$(cd "$owner" && find . -mindepth 1 -type d -print | sed 's|^\./||' | LC_ALL=C sort)"
  if [[ "$actual_files" != "$expected_files" ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill must contain the exact accepted ten-file inventory"
  fi
  if [[ "$actual_dirs" != "$expected_dirs" ]]; then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill must contain the exact accepted seven real child directories"
  fi

  while IFS= read -r -d '' entry; do
    rel="${entry#"$owner"/}"
    if [[ -L "$entry" ]]; then
      topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/$rel must not be a symlink"
    elif [[ ! -d "$entry" && ! -f "$entry" ]]; then
      topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/$rel has an unsupported type"
    fi
  done < <(find "$owner" -mindepth 1 -print0)

  expected_child_section=$'## Child Skills\n\n| Child skill | Type | Load when |\n|---|---|---|'
  for child in "${children[@]}"; do
    type="${child##*:}"
    child="${child%%:*}"
    child_skill="$owner/$child/SKILL.md"
    case "$child" in
      gobbi-dev-conventions) expected_description='MUST load when choosing Gobbi development lifecycle names, topology, branch roles, handoff vocabulary, or evidence forms.' ;;
      gobbi-dev-deployment) expected_description='MUST load when installing, verifying, or recovering a released Gobbi plugin deployment in caller-named isolated Claude Code and Codex targets.' ;;
      gobbi-dev-development) expected_description='MUST load when realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs.' ;;
      gobbi-dev-release) expected_description='MUST load when preparing or recovering a Gobbi release candidate, supplying a frozen Gobbi release candidate to Evaluation before manager or user acceptance, or promoting, publishing, or recovering an accepted Gobbi release.' ;;
      gobbi-dev-review) expected_description='MUST load when reviewing one Gobbi change or the whole Gobbi project for scoped evidence and findings without an acceptance verdict.' ;;
      gobbi-dev-testing) expected_description='MUST load when collecting exact-revision test evidence for Gobbi.' ;;
      gobbi-dev-toolchain) expected_description='MUST load when choosing or diagnosing Gobbi project commands, tools, prerequisites, and effects.' ;;
    esac
    if [[ -L "$child_skill" || ! -f "$child_skill" || ! -r "$child_skill" ]]; then
      topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/$child/SKILL.md must be a readable real regular file"
      continue
    fi
    if ! read_frontmatter_value name "$child_skill" name || [[ "$name" != "$child" ]]; then
      topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/$child/SKILL.md must declare name: $child"
      continue
    fi
    if ! read_frontmatter_value name "$child_skill" skill-type || [[ "$name" != "$type" ]]; then
      topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/$child/SKILL.md must declare skill-type: $type"
      continue
    fi
    if ! read_frontmatter_value description "$child_skill" description; then
      topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/$child/SKILL.md must declare one frontmatter description"
      continue
    fi
    if [[ "$description" != "\"$expected_description\"" ]]; then
      topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/$child/SKILL.md must preserve the exact accepted description"
    fi
    row="| [\`$child\`]($child/SKILL.md) | $type | $expected_description |"
    expected_child_section+=$'\n'"$row"
  done
  if ! cmp -s \
      <(printf '%s\n' "$expected_child_section") \
      <(sed -n '/^## Child Skills$/,$p' "$root_skill"); then
    topology_fail ".gobbi/projects/gobbi/skills/$package_only_skill/SKILL.md Child Skills section must equal the ordered child-derived table through end of file"
  fi
}

validate_lifecycle_semantics() {
  local skills="$repo_root/.gobbi/projects/gobbi/skills"
  local agents="$repo_root/.gobbi/projects/gobbi/agents"
  local gobbi="$skills/gobbi/SKILL.md"
  local git_skill="$skills/git/SKILL.md"
  local git_conventions="$skills/git/conventions.md"
  local memory="$skills/memory/SKILL.md"
  local partner="$skills/gobbi/partner/SKILL.md"
  local agent_teams="$skills/gobbi/agent-teams/SKILL.md"
  local delegation="$skills/delegation/SKILL.md"
  local cowork="$skills/cowork/SKILL.md"
  local workflow="$skills/workflow/SKILL.md"
  local phase_1="$skills/workflow/phase-1/SKILL.md"
  local phase_2="$skills/workflow/phase-2/SKILL.md"
  local phase_3="$skills/workflow/phase-3/SKILL.md"
  local gobbi_dev_toolchain="$skills/gobbi-dev/gobbi-dev-toolchain/SKILL.md"
  local gobbi_dev_deployment="$skills/gobbi-dev/gobbi-dev-deployment/SKILL.md"
  local gobbi_dev_deployment_checklists="$skills/gobbi-dev/gobbi-dev-deployment/checklists.md"
  local manager="$agents/manager.md"
  local assistant="$agents/assistant.md"
  local path permission role

  for path in \
    "$gobbi" \
    "$git_skill" \
    "$git_conventions" \
    "$memory" \
    "$partner" \
    "$agent_teams" \
    "$delegation" \
    "$cowork" \
    "$workflow" \
    "$phase_1" \
    "$phase_2" \
    "$phase_3" \
    "$gobbi_dev_toolchain" \
    "$gobbi_dev_deployment" \
    "$gobbi_dev_deployment_checklists" \
    "$manager" \
    "$assistant"; do
    require_file "$path"
  done

  require_semantic_sequence "$gobbi" 75 \
    'lifecycle entry route must publish the mode TODO, collect the slug and partner pair, then hand off' \
    '#### 1.3 Obtain or preserve mode, applicable slug, and partner policy' \
    'After the user selects Cowork or Workflow' \
    'After publishing the mode TODO' \
    'Record mode, applicable normalized slug, and partner policy together' \
    '#### 1.5 Load the selected owner and hand off without mutation'
  require_semantic_sequence "$gobbi" 20 \
    'Gobbi entry must load question and delegation contracts before routing' \
    '#### 1.2 Load the entry foundation' \
    'Read [`../principles/SKILL.md`](../principles/SKILL.md), then [`../discussion/SKILL.md`](../discussion/SKILL.md)' \
    'then [`../delegation/SKILL.md`](../delegation/SKILL.md)' \
    'Confirm Principles, Discussion, and Delegation before governed action'
  require_semantic_sequence "$gobbi" 6 \
    'Gobbi References must match the Principles, Discussion, and Delegation entry load and distributable map boundary' \
    '## References' \
    'Step 1.2 loads Principles, Discussion, and Delegation; selected owners, phases, and task triggers load every' \
    'other shared skill. The map shows what is distributable rather than what is loaded.'
  require_semantic_text "$gobbi" \
    '`AskUserQuestion` in Claude Code or `request_user_input` in Codex' \
    'Gobbi entry must name the structured question controls'
  require_semantic_sequence "$gobbi" 3 \
    'Gobbi entry must collect slug and partner together' \
    'ask the slug and session-wide partner' \
    'policy together in one structured request with two questions'
  require_semantic_section_words "$gobbi" \
    '#### 1.1 Establish the entry context, runtime, and canonical layout' \
    '#### 1.2 Load the entry foundation' \
    'reported path and its parent as the two possible `{gobbi-skills-root}` values' \
    'Gobbi root resolution must retain both candidates'
  require_semantic_section_words "$gobbi" \
    '#### 1.1 Establish the entry context, runtime, and canonical layout' \
    '#### 1.2 Load the entry foundation' \
    '`gobbi/SKILL.md`, `principles/SKILL.md`, and `agents/manager.md`' \
    'Gobbi root resolution must retain all three sentinels'
  require_semantic_section_words "$gobbi" \
    '#### 1.1 Establish the entry context, runtime, and canonical layout' \
    '#### 1.2 Load the entry foundation' \
    '# Gobbi runtime state. Session evidence and linked worktrees are never tracked. projects/*/sessions/ projects/*/worktrees/' \
    'Gobbi layout must retain the exact ignore wire values'
  require_semantic_sequence "$gobbi" 3 \
    'General entry must skip the slug question' \
    'General skips this' \
    'question for the slug'
  require_semantic_text "$gobbi" 'records `slug: not-applicable`' \
    'General entry must record slug: not-applicable'
  require_semantic_text "$gobbi" 'creates no Gobbi identity' \
    'General entry must create no Gobbi identity'
  require_semantic_text "$gobbi" 'General consumes mode and policy without creating' \
    'General owner must consume partner policy without creating session state'
  require_semantic_sequence "$gobbi" 14 \
    'session slug must be privacy-warned, deterministically normalized, and strictly rejected' \
    'warn that the session slug enters branch names and paths' \
    'Normalize it by taking each maximal ASCII' \
    'alphanumeric sequence as one word' \
    'Do not transliterate, truncate, or add a suffix. Accept only 1–20 characters' \
    'when normalization' \
    'is empty, longer than 20 characters, or reserved'
  require_semantic_section_words "$gobbi" \
    '#### 1.4 Apply the session-wide finding gate' \
    '#### 1.5 Load the selected owner and hand off without mutation' \
    'severity is High, Medium, or Low; `blocking: no`; it remains inside the locked contract; and the correction is reversible, authority-neutral, non-destructive, and non-external' \
    'Gobbi must own the complete session-wide finding predicate'
  require_semantic_section_words "$gobbi" \
    '#### 1.4 Apply the session-wide finding gate' \
    '#### 1.5 Load the selected owner and hand off without mutation' \
    'Send every other finding to the user for accept, reject, or defer disposition. Every correction requires fresh evaluation, and only a verified PASS continues automatically.' \
    'Gobbi finding gate must retain user disposition, fresh evaluation, and PASS-only continuation'
  require_semantic_section_words "$gobbi" \
    '#### 1.5 Load the selected owner and hand off without mutation' \
    '## References' \
    '[`../cowork/SKILL.md`](../cowork/SKILL.md)' \
    'Gobbi must hand Cowork to its canonical owner'
  require_semantic_section_words "$gobbi" \
    '#### 1.5 Load the selected owner and hand off without mutation' \
    '## References' \
    '[`../workflow/SKILL.md`](../workflow/SKILL.md)' \
    'Gobbi must hand Workflow to its canonical owner'

  require_semantic_sequence "$git_conventions" 10 \
    'new session identity must retain original UTC date and full UUID before name derivation' \
    'One future session identity is the immutable tuple' \
    '`date` is the original session-start date in UTC' \
    'Gobbi session UUID. Generate the UUID before deriving either name'
  require_semantic_text "$git_conventions" 'never changes at a context boundary' \
    'new session identity must preserve the original UTC date across context boundaries'
  require_semantic_text "$git_conventions" 'full 36-character lowercase hyphenated' \
    'new session identity must retain the full UUID'
  require_semantic_sequence "$git_conventions" 20 \
    'new session names must use exact separately derived branch and leaf forms' \
    'Derive the branch and leaf separately from the same tuple' \
    'branch: <runtime-prefix>-<YYYY-MM-DD>-<slug>-<gobbi-session-uuid>' \
    'leaf:   <YYYY-MM-DD>-<slug>-<gobbi-session-uuid>' \
    'worktree and session leaves are byte-identical'
  require_semantic_sequence "$git_conventions" 30 \
    'new and legacy session formats must remain separately recoverable without migration' \
    '### Permanent legacy formats' \
    'Recovery permanently accepts these legacy formats' \
    'New creation uses only the new formats. Parse new and legacy names with separate validators' \
    'matched shape. Never infer a slug for a legacy identity, rename a legacy or active object'
  require_semantic_text "$git_conventions" \
    'Two different slugs, dates, runtimes, or paths carrying the same UUID are an identity conflict' \
    'same-UUID competing session evidence must fail as an identity conflict'
  require_semantic_sequence "$git_skill" 75 \
    'Git recovery must parse branch and leaf separately and preserve active or legacy identities' \
    'Parse the supplied branch and worktree leaf separately through the new or legacy validators' \
    'same-UUID competing branch, worktree, or session evidence' \
    'same UUID with a different runtime, date, slug, branch, worktree, or session leaf. Never rename an'
  require_semantic_text "$git_skill" 'silently migrate a legacy identity' \
    'Git recovery must never migrate a legacy identity'
  require_semantic_sequence "$git_skill" 5 \
    'recovery must use current evidence and ask only for unresolved facts' \
    'take the retained branch or worktree from current caller, session, and registered-worktree' \
    'Ask the user only when that evidence is missing' \
    'never search for a convenient alternative session'

  require_semantic_section_words "$cowork" \
    '#### 1.1 Create or recover the Cowork worktree' \
    '#### 1.2 Establish the Cowork session locations' \
    'For a fresh identity, generate one full lowercase hyphenated UUID and capture the original UTC session-start date before deriving names. Retain both across boundaries.' \
    'Cowork must supply a fresh UUID and original UTC session identity'
  require_semantic_section_words "$workflow" \
    '#### 1.2 Configure identity, isolation, and evidence' \
    '#### 1.3 Build and accept specialist assignments' \
    'Write `configuration.md` with mode, identity shape, original UTC date, slug or `not-applicable`, UUID, partner policy, settings, repository, base, branch, worktree leaf, session leaf, absolute worktree, runtime, validated root pair, and creation checks.' \
    'Workflow Configuration must record complete identity evidence'
  require_semantic_text "$workflow" \
    'Execution cap defaults to three total passes per task.' \
    'Workflow must retain the default three-pass Execution cap'
  require_semantic_sequence "$workflow" 10 \
    'Workflow must retain the exact native TODO title grammar' \
    'P1 · Configuration' \
    'P1 · Ideation' \
    'P2 · Planning' \
    'P2 · Execution' \
    'P3 · Wrap-up' \
    'P3 · Hand-off'
  require_semantic_text "$workflow" \
    'Gobbi publishes the complete fixed Workflow template immediately after mode selection' \
    'Workflow must build its native TODO template immediately after mode selection'
  require_semantic_sequence "$cowork" 75 \
    'Cowork must retain the complete fixed TODO template' \
    'CW · Configuration' \
    'CW · Topic · IDEATION' \
    'CW · Topic · PLANNING' \
    'CW · Topic · EXECUTION' \
    'CW · Topic · PASS' \
    'CW · Evaluation' \
    'CW · Wrap-up'
  for forbidden in \
    'CW · Topic · topic-NN-slug' \
    'CW · Evaluation · <whole-branch|subject-slug>' \
    'CW · Wrap-up · <MEMORY|FRESHNESS|PASS>' \
    'P1 · Ideation · <DISCUSSION|WORK|EVALUATION|RECORD|PASS>' \
    'P2 · Planning · <DISCUSSION|WORK|EVALUATION|RECORD|PASS>' \
    'P2 · Execution · <unplanned|task-NN-slug>' \
    'P3 · Wrap-up · <DISCUSSION|WORK|EVALUATION|RECORD|PASS>'; do
    forbid_semantic_text "$cowork" "$forbidden" \
      "Cowork TODO template must not contain decision field: $forbidden"
    forbid_semantic_text "$workflow" "$forbidden" \
      "Workflow TODO template must not contain decision field: $forbidden"
  done
  require_semantic_sequence "$memory" 25 \
    'Memory must validate caller identity against the exact session root' \
    "Require the caller's full lowercase" \
    'original UTC session-start date, and exact session root' \
    '`{memory-root}`. Reject parent traversal, a symbolic-link path' \
    'require the parsed date, slug, and UUID to equal the caller values'

  require_semantic_sequence "$partner" 12 \
    'Partner must own one external invocation while callers own local participants and assembly' \
    'One **partner run** is one bounded' \
    'read-only invocation of that other runtime' \
    'The caller owns local participants, the complete subject, round assembly, policy, acceptance'
  require_semantic_sequence "$partner" 4 \
    'Partner captures must remain temporary, outside durable roots, and clean up on every outcome' \
    'live in one private runtime-temporary directory outside every project and session root' \
    'before a successful return or after failure evidence is surfaced'
  require_semantic_sequence "$partner" 2 \
    'Partner failure handling must remove private captures after surfacing evidence' \
    'Retain captures only until the exact diagnostic is read and surfaced. Then remove the complete private' \
    'capture directory. Report a cleanup failure'

  require_semantic_sequence "$agent_teams" 130 \
    'Agent Teams Workflow guidance must remain inside Manual' \
    '## Manual' \
    '### Workflow integration' \
    '#### TODO-based assignment' \
    '#### Context-boundary recovery' \
    '#### Reuse and write safety' \
    '#### Phase continuity' \
    '## References'
  require_semantic_text "$agent_teams" '[Workflow](../../workflow/SKILL.md)' \
    'Agent Teams Workflow guidance must retain its valid Workflow link'
  require_semantic_text "$agent_teams" '[Delegation](../../delegation/SKILL.md)' \
    'Agent Teams Workflow guidance must retain its valid Delegation link'

  require_semantic_section_words "$delegation" \
    '## Rules' \
    '## Preferences' \
    'MUST name exactly one `result-kind: file | commit | response-only` in every specialist brief.' \
    'Delegation must require exactly one of the three result kinds'
  require_semantic_section_words "$delegation" \
    '## Rules' \
    '## Preferences' \
    'MUST use `result-kind: file` for durable design and evaluation results.' \
    'Delegation durable design and evaluation must select file results'
  require_semantic_section_words "$delegation" \
    '## Rules' \
    '## Preferences' \
    'Give the exact caller-named absolute path, require containment and rereading, and reject printed content as a substitute for the file.' \
    'Delegation durable design and evaluation must use a caller-named verified file'
  require_semantic_section_words "$delegation" \
    '## Preferences' \
    '## References' \
    'for `commit`, give the branch, assignment-owned paths, commit authority, and verification; for `response-only`, define the response shape and consumer.' \
    'Delegation must preserve intentional commit and response-only result contracts'

  require_semantic_section_words "$cowork" \
    '#### 2.1 Route and deliver one topic' \
    '### Phase 3 — Evaluate on User Call' \
    'Design includes architecture, strategy, naming, vocabulary, functions, classes, interfaces, data shapes, and every other choice of structure, meaning, or contract, including small local choices.' \
    'Cowork must classify small structural and vocabulary choices as design'
  require_semantic_section_words "$cowork" \
    '#### 2.1 Route and deliver one topic' \
    '### Phase 3 — Evaluate on User Call' \
    'Direct is available only when this inventory is empty; otherwise route through at least Light Ideation.' \
    'Cowork unresolved design must route through at least Light Ideation'
  require_semantic_section_words "$cowork" \
    '#### 2.1 Route and deliver one topic' \
    '### Phase 3 — Evaluate on User Call' \
    'assign available active-runtime subagents or teammates bounded independent read-only work that supplies evidence, alternatives, or critique for every named design choice.' \
    'Cowork must assign available local independent design participation'
  require_semantic_section_words "$cowork" \
    '#### 2.1 Route and deliver one topic' \
    '### Phase 3 — Evaluate on User Call' \
    'Related minor choices may share one assignment only when every choice is named; one leader remains the sole writer and synthesizer.' \
    'Cowork may batch only named minor choices under one synthesizer'

  require_semantic_section_words "$cowork" \
    '#### 2.1 Route and deliver one topic' \
    '### Phase 3 — Evaluate on User Call' \
    "For every design-bearing Ideation package, freeze the local leader's draft after all named independent local inputs are available. Enabled then calls [Partner](../gobbi/partner/SKILL.md) for at least one independent external draft and one external cross-review over frozen inputs" \
    'Cowork enabled design packages must use Partner draft and cross-review before synthesis'
  require_semantic_section_words "$cowork" \
    '#### 2.1 Route and deliver one topic' \
    '### Phase 3 — Evaluate on User Call' \
    'Disabled invokes no external runtime. The manager owns local participants, freeze order, assembly, acceptance, and routing.' \
    'Cowork disabled creation must remain local while the manager owns assembly'
  require_semantic_section_words "$cowork" \
    '#### 3.1 Evaluate one frozen subject' \
    '### Phase 4 — Close on User Call' \
    'Dispatch one fresh isolated active-runtime evaluator. Enabled calls [Partner](../gobbi/partner/SKILL.md) for one fresh isolated external evaluator over the same frozen subject; neither sees the other report. Disabled invokes no external runtime.' \
    'Cowork evaluation must use fresh local and enabled external evaluators while preserving disabled behavior'
  require_semantic_section_words "$cowork" \
    '#### 3.1 Evaluate one frozen subject' \
    '### Phase 4 — Close on User Call' \
    'Each produces a complete [Evaluation](../evaluation/SKILL.md) report; the manager assembles the round and uses the more severe available verdict.' \
    'Cowork must consume Evaluation reports while retaining round assembly'
  require_semantic_section_words "$cowork" \
    '## Rules' \
    '## Procedure' \
    'MUST run independent evaluation only after an explicit `evaluate` call, and let that call authorize evaluation alone.' \
    'Cowork independent evaluation must remain explicitly user-called'
  require_semantic_text "$workflow" \
    'MUST apply the recorded session-wide partner policy to every productive step.' \
    'Workflow must consume the recorded partner policy'
  require_semantic_text "$workflow" \
    '#### 1.3 Build and accept specialist assignments' \
    'Workflow must retain the stable Step 1.3 assignment owner anchor'
  require_semantic_section_words "$workflow" \
    '### Phase 1 — Establish the shared Workflow contracts' \
    '#### 1.4 Apply the shared productive-step cycle' \
    'exactly one `result-kind: file | commit | response-only`.' \
    'Workflow assignments must name exactly one result kind'
  require_semantic_section_words "$workflow" \
    '### Phase 1 — Establish the shared Workflow contracts' \
    '#### 1.4 Apply the shared productive-step cycle' \
    'Durable design and evaluation use `file` with an exact caller-named absolute path, containment, rereading, and named checks.' \
    'Workflow durable design and evaluation must use a caller-named verified file'
  require_semantic_section_words "$workflow" \
    '### Phase 1 — Establish the shared Workflow contracts' \
    '#### 1.4 Apply the shared productive-step cycle' \
    'A printed response cannot substitute for a promised file or commit.' \
    'Workflow must reject printed substitutes for promised files and commits'
  require_semantic_section_words "$workflow" \
    '#### 1.4 Apply the shared productive-step cycle' \
    '#### 1.5 Gate, record, and recover' \
    'A subject is design-bearing when it chooses architecture, strategy, naming, vocabulary, functions, classes, interfaces, data shapes, or any other structure, meaning, or contract, including small local choices.' \
    'Workflow must classify small structural and vocabulary choices as design'
  require_semantic_section_words "$workflow" \
    '#### 1.4 Apply the shared productive-step cycle' \
    '#### 1.5 Gate, record, and recover' \
    'assign available active-runtime subagents or teammates bounded independent read-only evidence, alternatives, or critique.' \
    'Workflow must assign available local independent design participation'
  require_semantic_section_words "$workflow" \
    '#### 1.4 Apply the shared productive-step cycle' \
    '#### 1.5 Gate, record, and recover' \
    'Related minor choices may share one assignment only when every choice is named.' \
    'Workflow may batch only named minor design choices'
  require_semantic_section_words "$workflow" \
    '#### 1.4 Apply the shared productive-step cycle' \
    '#### 1.5 Gate, record, and recover' \
    'Assign one active-runtime creator as the sole writer' \
    'Workflow must keep one creator as design writer and synthesizer'
  require_semantic_section_words "$workflow" \
    '#### 1.4 Apply the shared productive-step cycle' \
    '#### 1.5 Gate, record, and recover' \
    'With partner enabled, require at least one independent Partner draft and one Partner cross-review over frozen input for every design-bearing package before synthesis; disabled invokes no external runtime.' \
    'Workflow design-bearing WORK must use enabled Partner draft and cross-review while disabled stays local'
  require_semantic_section_words "$workflow" \
    'The participant matrix is:' \
    '#### 1.5 Gate, record, and recover' \
    '| Disabled | One assigned active-runtime self-reviewed creator draft plus available bounded local evidence, alternatives, or critique for every design choice; no external invocation. | One fresh isolated active-runtime evaluator; no external invocation. |' \
    'Workflow disabled policy must select local-only participants'
  require_semantic_section_words "$workflow" \
    'The participant matrix is:' \
    '#### 1.5 Gate, record, and recover' \
    '| Enabled | The disabled set plus at least one independent draft and one cross-review through Partner for every design-bearing package; the local creator synthesizes after both validate. | The disabled evaluator plus one fresh isolated external evaluator through Partner over the same subject. |' \
    'Workflow enabled policy must use Partner while retaining assembly ownership'
  require_semantic_section_words "$phase_1" \
    '#### 2.1 Freeze the discussion contract' \
    '#### 2.2 Run the shared productive-step cycle' \
    'every architecture, strategy, naming, vocabulary, function, class, interface, data-shape, or other structure, meaning, and contract choice, including small local choices;' \
    'Workflow Phase 1 must inventory small structural and vocabulary design choices'
  require_semantic_section_words "$phase_1" \
    '#### 2.1 Freeze the discussion contract' \
    '#### 2.2 Run the shared productive-step cycle' \
    'Map every design choice to bounded independent read-only evidence, alternatives, or critique from available active-runtime subagents or teammates.' \
    'Workflow Phase 1 must map every design choice to local independent participation'
  require_semantic_section_words "$phase_1" \
    '#### 2.1 Freeze the discussion contract' \
    '#### 2.2 Run the shared productive-step cycle' \
    'Related minor choices may share one assignment only when the brief names every choice; the leader remains the sole writer and synthesizer.' \
    'Workflow Phase 1 may batch only named minor choices under one synthesizer'
  require_semantic_section_words "$phase_1" \
    '#### 2.2 Run the shared productive-step cycle' \
    '### Phase 3 — Hand off to Planning' \
    'Enabled requires at least one independent Partner draft and one Partner cross-review over frozen input before synthesis; disabled invokes no external runtime.' \
    'Workflow Phase 1 enabled design packages must use Partner draft and cross-review while disabled stays local'
  require_semantic_section_words "$phase_2" \
    '#### 2.4 Evaluate, record, and route the task' \
    '### Phase 3 — Hand off to Wrap-up' \
    'Enabled routes the external evaluator through [Partner](../../gobbi/partner/SKILL.md); disabled invokes no external runtime.' \
    'Workflow Phase 2 must consume the parent participant policy for task evaluation'

  require_semantic_text "$manager" \
    'severity is High, Medium, or Low;' \
    'automatic finding correction requires High, Medium, or Low severity'
  require_semantic_text "$manager" \
    '`blocking: no`;' \
    'automatic finding correction requires blocking: no'
  require_semantic_text "$manager" \
    'the correction stays inside the locked contract' \
    'automatic finding correction must remain inside the locked contract'
  require_semantic_text "$manager" \
    'it is reversible, authority-neutral,' \
    'automatic finding correction must be reversible and authority-neutral'
  require_semantic_text "$manager" \
    'non-destructive, and non-external.' \
    'automatic finding correction must be non-destructive and non-external'
  require_semantic_text "$manager" \
    'Present every Critical,' \
    'every finding outside the automatic predicate must return to the user'
  require_semantic_text "$manager" \
    'Require a fresh evaluation after the correction.' \
    'every automatic correction must receive fresh evaluation'
  require_semantic_text "$manager" \
    'Only a verified PASS continues automatically.' \
    'only a verified PASS may continue automatically'
  require_semantic_section_words "$cowork" \
    '#### 3.1 Evaluate one frozen subject' \
    '### Phase 4 — Close on User Call' \
    "Apply Gobbi's [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate)." \
    'Cowork must consume the Gobbi finding gate through its canonical owner edge'
  forbid_semantic_text "$cowork" \
    'Automatically correct a finding only when its severity is High, Medium, or Low' \
    'Cowork must not duplicate the Gobbi finding predicate'
  require_semantic_section_words "$workflow" \
    '## Rules' \
    '## Procedure' \
    "Gobbi's [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate)" \
    'Workflow must consume the Gobbi finding gate through its canonical owner edge'
  forbid_semantic_text "$workflow" \
    'Automatically correct only a High, Medium, or Low' \
    'Workflow must not duplicate the Gobbi finding predicate'
  for path in "$phase_1" "$phase_2" "$phase_3"; do
    require_semantic_section_words "$path" \
      '## Rules' \
      '## Procedure' \
      "Apply Gobbi's finding gate through the parent; only PASS continues." \
      "${path#"$skills/workflow/"} must consume the Gobbi finding gate through Workflow"
    require_semantic_section_words "$path" \
      '# Workflow Phase ' \
      '## Principles' \
      'The parent remains loaded' \
      "${path#"$skills/workflow/"} must declare the parent precondition"
    require_semantic_section_words "$path" \
      '## Rules' \
      '## Procedure' \
      '[shared productive-step cycle](../SKILL.md#14-apply-the-shared-productive-step-cycle)' \
      "${path#"$skills/workflow/"} must consume the shared cycle through the exact parent Step 1.4 anchor"
    forbid_semantic_text "$path" \
      'Automatically correct only a High, Medium, or Low' \
      "${path#"$skills/workflow/"} must not duplicate the Gobbi finding predicate"
  done

  require_semantic_section_words "$workflow" \
    '#### 1.4 Apply the shared productive-step cycle' \
    '#### 1.5 Gate, record, and recover' \
    'Each phase child invokes this cycle with a local role, frozen subject, canonical output, gate, cap, and unique acceptance checks.' \
    'Workflow must own the shared productive-step contract'
  require_semantic_section_words "$phase_1" \
    '#### 2.1 Freeze the discussion contract' \
    '#### 2.2 Run the shared productive-step cycle' \
    '[parent Step 1.3](../SKILL.md#13-build-and-accept-specialist-assignments)' \
    'Workflow Phase 1 assignment briefs must consume the stable parent Step 1.3 owner anchor'
  require_semantic_section_words "$phase_2" \
    '#### 1.1 Enter and freeze the Planning contract' \
    '#### 1.2 Run the Planning cycle and expand the route' \
    '[parent Step 1.3](../SKILL.md#13-build-and-accept-specialist-assignments)' \
    'Workflow Phase 2 assignment briefs must consume the stable parent Step 1.3 owner anchor'
  require_semantic_section_words "$phase_3" \
    "#### 1.2 Supply Workflow's Wrap-up inputs" \
    '### Phase 2 — Materialize, evaluate, and record closure' \
    '[parent Step 1.3](../SKILL.md#13-build-and-accept-specialist-assignments)' \
    'Workflow Phase 3 assignment briefs must consume the stable parent Step 1.3 owner anchor'
  require_semantic_section_words "$workflow" \
    '#### 1.5 Gate, record, and recover' \
    '#### 1.6 Verify checkpoints and transition' \
    'A fast gate applies to Ideation, Planning, and Wrap-up with two total iterations.' \
    'Workflow must own the fast two-iteration gate'
  require_semantic_section_words "$workflow" \
    '#### 1.5 Gate, record, and recover' \
    '#### 1.6 Verify checkpoints and transition' \
    'A normal gate applies to each Execution task with its configured cap. Its decision is the most severe required verdict: FAIL outranks REVISE, which outranks PASS.' \
    'Workflow must own the normal aggregate gate and configured cap'
  require_semantic_section_words "$workflow" \
    '#### 1.5 Gate, record, and recover' \
    '#### 1.6 Verify checkpoints and transition' \
    'Each `gate.md` records mode, partner policy, required participants, report paths and hashes, all declared verdicts, unresolved Critical IDs, actual blocking IDs, automatically correctable IDs, user dispositions, pending reevaluation IDs, and Workflow decision.' \
    'Workflow must own the exact gate schema'
  require_semantic_section_words "$workflow" \
    '#### 1.5 Gate, record, and recover' \
    '#### 1.6 Verify checkpoints and transition' \
    'Each `record/iteration-N.md` contains only exact TODO and decision; source artifact, package, report, gate, commit, or output identifiers and hashes as applicable; verification; accepted finding dispositions; and next or recovery state.' \
    'Workflow must own the exact RECORD receipt schema'
  require_semantic_section_words "$phase_1" \
    '#### 2.2 Run the shared productive-step cycle' \
    '### Phase 3 — Hand off to Planning' \
    'Invoke [parent Step 1.4](../SKILL.md#14-apply-the-shared-productive-step-cycle) with local role `leader`' \
    'Workflow Phase 1 must consume the shared cycle as an Ideation adapter'
  require_semantic_section_words "$phase_2" \
    '#### 1.2 Run the Planning cycle and expand the route' \
    '### Phase 2 — Execute the ordered task route' \
    'Invoke [parent Step 1.4](../SKILL.md#14-apply-the-shared-productive-step-cycle) with local role `leader`' \
    'Workflow Phase 2 must consume the shared cycle as a Planning adapter'
  require_semantic_section_words "$phase_3" \
    '#### 2.2 Evaluate and record the actual closure' \
    '### Phase 3 — Finalize and finish' \
    'Apply the parent fast gate and RECORD schema.' \
    'Workflow Phase 3 must consume the parent gate and record contracts'
  require_semantic_section_words "$phase_2" \
    '## Rules' \
    '## Procedure' \
    'NEVER replay a possibly side-effecting operation until its prior effect is proved absent or safely reusable.' \
    'Workflow Phase 2 must retain side-effect replay safety'
  require_semantic_section_words "$phase_3" \
    '## Rules' \
    '## Procedure' \
    'MUST prohibit Git finalization before EVALUATION and RECORD accept the frozen pre-Git tree.' \
    'Workflow Phase 3 must prohibit Git before the frozen closure passes RECORD'
  require_semantic_section_words "$phase_3" \
    '#### 3.1 Revalidate the immutable PASS subject' \
    '#### 3.2 Resume authorized finalization' \
    'Require the current tracked tree to equal the evaluated tree exactly; otherwise return to the earliest responsible Wrap-up step.' \
    'Workflow Phase 3 must invalidate PASS when the pre-Git tree changes'

  require_semantic_section_words "$cowork" \
    '#### 4.1 Update memory and return the retained result' \
    '## References' \
    'Apply [Memory](../memory/SKILL.md) directly; do not load Wrap-up or create Workflow closure state.' \
    'Cowork closure must apply Memory directly without Workflow closure state'
  require_semantic_section_words "$cowork" \
    '#### 4.1 Update memory and return the retained result' \
    '## References' \
    'Never create Workflow-formatted TODOs, phase receipts, RECORD-stage evidence, a tracked handoff, or a Workflow Hand-off.' \
    'Cowork closure must forbid Workflow evidence'
  require_semantic_section_words "$cowork" \
    '#### 4.1 Update memory and return the retained result' \
    '## References' \
    'PASS returns a conversation-only handoff' \
    'Cowork closure must return only a conversation handoff'
  forbid_semantic_text "$cowork" '](../wrap-up/SKILL.md)' \
    'Cowork must not link to the Workflow Wrap-up operation'

  require_semantic_section_words "$cowork" '## References' '' \
    '[Git](../git/SKILL.md) | Owns identity and isolation validation' \
    'Cowork must name Git as its mechanism owner'
  require_semantic_section_words "$cowork" '## References' '' \
    '[Memory](../memory/SKILL.md) | Owns session identity and containment validation' \
    'Cowork must name Memory as its mechanism owner'
  require_semantic_section_words "$cowork" '## References' '' \
    '[Delegation](../delegation/SKILL.md) | Owns the base specialist brief' \
    'Cowork must name Delegation as its mechanism owner'
  require_semantic_section_words "$cowork" '## References' '' \
    '[Partner](../gobbi/partner/SKILL.md) | Owns each enabled external invocation and frozen return' \
    'Cowork must name Partner as its invocation owner'
  require_semantic_section_words "$cowork" '## References' '' \
    '[Evaluation](../evaluation/SKILL.md) | Owns each complete evaluator report' \
    'Cowork must name Evaluation as its report owner'
  require_semantic_sequence "$workflow" 70 \
    'Workflow closure must retain durable Wrap-up and a tracked handoff' \
    '#### 2.3 Dispatch Phase 3 and terminate' \
    'Wrap-up displays the immutable tracked handoff' \
    'no next TODO remains'
  require_semantic_section_words "$phase_3" \
    '## References' '' \
    '[Wrap-up](../../wrap-up/SKILL.md) owns Memory-to-Git order, tracked handoff, finalization, display, and recovery.' \
    'Workflow Phase 3 must name Wrap-up as the closure mechanism owner'
  require_semantic_section_words "$phase_3" \
    '## References' '' \
    '[Wrap-up handoff](../../wrap-up/handoff.md) owns the tracked report and display-only Git receipt schemas.' \
    'Workflow Phase 3 must name handoff.md as the terminal schema owner'
  require_semantic_sequence "$assistant" 20 \
    'assignment-authorized assistant must support Cowork direct-Memory closure only' \
    '**Cowork Memory mode** enters only from an explicit Cowork closure assignment' \
    'apply `Memorize` directly' \
    'create one focused local memory commit' \
    'Never load Wrap-up, create Workflow receipts or a tracked handoff'
  require_semantic_text "$git_skill" \
    'assignment-named writer role, including an assistant' \
    'Git must authorize an assignment-named assistant writer'

  require_semantic_section_words "$gobbi_dev_toolchain" \
    '#### Installed-runtime trace boundary' '### Prerequisites and Effects' \
    'Each runtime stage executes its exact CLI once through a fixed descriptor-closing wrapper under an empty environment, private homes, a private temporary directory, and `/dev/null` standard input.' \
    'Gobbi toolchain must define selective trace, single-stage execution, and separate whole-smoke recovery'
  require_semantic_section_words "$gobbi_dev_toolchain" \
    '#### Installed-runtime trace boundary' '### Prerequisites and Effects' \
    'Local `socketpair(AF_UNIX)` remains available.' \
    'Gobbi toolchain must define selective trace, single-stage execution, and separate whole-smoke recovery'
  require_semantic_section_words "$gobbi_dev_toolchain" \
    '#### Installed-runtime trace boundary' '### Prerequisites and Effects' \
    'This is a trusted-runtime observation boundary, not a hostile-code sandbox. A stage is never replayed. A fresh whole-smoke retry is a separate recovery action' \
    'Gobbi toolchain must define selective trace, single-stage execution, and separate whole-smoke recovery'
  require_semantic_section_words "$gobbi_dev_toolchain" \
    '#### Installed-runtime trace boundary' '### Prerequisites and Effects' \
    '`source-precheck` and `source-postcheck` each require exactly four' \
    'Gobbi toolchain must confine four denied local probes to each source-check stage'
  require_semantic_section_words "$gobbi_dev_toolchain" \
    '#### Installed-runtime trace boundary' '### Prerequisites and Effects' \
    'Only fixed runtime wrappers and closed stage allowlists select production semantic no-effect policy.' \
    'Gobbi toolchain must confine four denied local probes to each source-check stage'
  require_semantic_section_words "$gobbi_dev_deployment" \
    '#### 3.2 Install the same local release' '#### 3.3 Verify both identities and inventories' \
    'Treat local `socketpair(AF_UNIX)` and audited traffic on its proved Unix descriptors as local runtime IPC, not external network authority.' \
    'Gobbi deployment must distinguish local IPC, one-run stages, and separately authorized recovery'
  require_semantic_section_words "$gobbi_dev_deployment" \
    '#### 3.2 Install the same local release' '#### 3.3 Verify both identities and inventories' \
    'Invoke each runtime stage once. Never replay a failed stage. A fresh whole-smoke run is a separate recovery action' \
    'Gobbi deployment must distinguish local IPC, one-run stages, and separately authorized recovery'
  require_semantic_text "$gobbi_dev_deployment" \
    'A runtime-smoke failure never resumes by replaying its failed stage' \
    'Gobbi deployment must distinguish local IPC, one-run stages, and separately authorized recovery'
  require_semantic_section_words "$gobbi_dev_deployment" \
    '#### 3.2 Install the same local release' '#### 3.3 Verify both identities and inventories' \
    'Keep three policies separate. `source-precheck` and `source-postcheck` each require exactly four denied' \
    'Gobbi deployment must distinguish exact source, strict helper, and semantic runtime policies'
  require_semantic_section_words "$gobbi_dev_deployment" \
    '#### 3.2 Install the same local release' '#### 3.3 Verify both identities and inventories' \
    'Fixed production runtime wrappers may classify a complete fixed-deny record as a blocked no-effect probe' \
    'Gobbi deployment must distinguish exact source, strict helper, and semantic runtime policies'
  require_semantic_section_words "$gobbi_dev_deployment_checklists" \
    '## Installed Inventory' '## Failure and Recovery' \
    'Each runtime stage runs exactly once through the descriptor-closing wrapper with `/dev/null` input, private environment state, and all descendants kept under the trace.' \
    'Gobbi deployment checklist must require selective trace evidence and separately authorized recovery'
  require_semantic_section_words "$gobbi_dev_deployment_checklists" \
    '## Installed Inventory' '## Failure and Recovery' \
    'Local `socketpair(AF_UNIX)` and proved Unix-descriptor traffic are the only successful socket activity;' \
    'Gobbi deployment checklist must require selective trace evidence and separately authorized recovery'
  require_semantic_section_words "$gobbi_dev_deployment_checklists" \
    '## Installed Inventory' '## Failure and Recovery' \
    'trusted-runtime observation boundary, not a hostile-code sandbox.' \
    'Gobbi deployment checklist must require selective trace evidence and separately authorized recovery'
  require_semantic_section_words "$gobbi_dev_deployment_checklists" \
    '## Installed Inventory' '## Failure and Recovery' \
    '`source-precheck` and `source-postcheck` each report exactly four denied `AF_UNIX` or `AF_LOCAL` stream probes' \
    'Gobbi deployment checklist must require exact source, strict helper, and semantic runtime policies'
  require_semantic_section_words "$gobbi_dev_deployment_checklists" \
    '## Installed Inventory' '## Failure and Recovery' \
    'A fixed production runtime wrapper selects only a stage in its closed allowlist.' \
    'Gobbi deployment checklist must require exact source, strict helper, and semantic runtime policies'
  require_semantic_section_words "$gobbi_dev_deployment_checklists" \
    '## Failure and Recovery' '' \
    'No failed runtime stage was replayed. Any fresh whole-smoke run has separate caller recovery authority' \
    'Gobbi deployment checklist must require selective trace evidence and separately authorized recovery'

  for permission in \
    'Skill(cowork)' \
    'Skill(gobbi:partner)' \
    'Skill(workflow:phase-1)' \
    'Skill(workflow:phase-2)' \
    'Skill(workflow:phase-3)'; do
    require_semantic_permission "$permission" "Claude settings must explicitly allow $permission"
  done
  for role in "${roles[@]}"; do
    require_semantic_permission "Agent($role)" "Claude settings must explicitly allow Agent($role)"
  done

}

validate_source_topology() {
  local role codex_version claude_version marketplace_version skill_name mirror_entry mirror_name

  if ! command -v jq >/dev/null 2>&1; then
    topology_fail 'jq is required to validate plugin manifests and marketplaces'
    return 1
  fi

  validate_package_only_skill_owner
  validate_smoke_contracts

  for path in \
    "$package_root/.codex-plugin/plugin.json" \
    "$package_root/.claude-plugin/plugin.json" \
    "$repo_root/.agents/plugins/marketplace.json" \
    "$repo_root/.claude-plugin/marketplace.json" \
    "$repo_root/.codex/AGENTS.md" \
    "$repo_root/.claude/CLAUDE.md" \
    "$repo_root/.claude/settings.json"; do
    require_file "$path"
  done

  if [[ -f "$package_root/.codex-plugin/plugin.json" ]]; then
    require_json_contract "$package_root/.codex-plugin/plugin.json" \
      '.name == "gobbi" and .skills == "./skills/" and (has("hooks") | not) and (has("agents") | not)' \
      'Codex manifest must declare only the canonical skills component and no hook or agent component'
  fi
  if [[ -f "$package_root/.claude-plugin/plugin.json" ]]; then
    require_json_contract "$package_root/.claude-plugin/plugin.json" \
      '.name == "gobbi" and (has("skills") | not) and (has("agents") | not) and (has("hooks") | not)' \
      'Claude manifest must remain metadata-only'
  fi
  if [[ -f "$repo_root/.agents/plugins/marketplace.json" ]]; then
    require_json_contract "$repo_root/.agents/plugins/marketplace.json" \
      '.name == "gobbi-workspace" and ([.plugins[] | select(.name == "gobbi" and .source.source == "local" and .source.path == "./plugins/gobbi")] | length) == 1' \
      'Codex marketplace must contain one local gobbi entry pointing at ./plugins/gobbi'
  fi
  if [[ -f "$repo_root/.claude-plugin/marketplace.json" ]]; then
    require_json_contract "$repo_root/.claude-plugin/marketplace.json" \
      '([.plugins[] | select(.name == "gobbi" and .source == "./plugins/gobbi")] | length) == 1' \
      'Claude marketplace must contain one gobbi entry pointing at ./plugins/gobbi'
  fi
  # teammateMode is asserted on purpose, and not as a capability gate: Claude Code has
  # defaulted it to in-process since v2.1.179, so a checkout without the key already runs
  # in-process teammates. The assertion pins the repository's Agent Teams convention
  # explicitly, so a future change to that default cannot silently move this project off
  # in-process teammates. The hooks assertion is the capability gate: Gobbi ships no hooks.
  if [[ -f "$repo_root/.claude/settings.json" ]]; then
    require_json_contract "$repo_root/.claude/settings.json" \
      '.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS == "1" and .teammateMode == "in-process" and (has("hooks") | not)' \
      'Claude settings must keep in-process Agent Teams enabled and contain no hooks block'
  fi

  if [[ -f "$package_root/.codex-plugin/plugin.json" && -f "$package_root/.claude-plugin/plugin.json" && -f "$repo_root/.claude-plugin/marketplace.json" ]]; then
    codex_version="$(jq -r '.version // empty' "$package_root/.codex-plugin/plugin.json")"
    claude_version="$(jq -r '.version // empty' "$package_root/.claude-plugin/plugin.json")"
    marketplace_version="$(jq -r '.plugins[] | select(.name == "gobbi") | .version // empty' "$repo_root/.claude-plugin/marketplace.json")"
    if [[ -z "$codex_version" || "$codex_version" != "$claude_version" || "$claude_version" != "$marketplace_version" ]]; then
      topology_fail 'Codex manifest, Claude manifest, and Claude marketplace versions must be non-empty and equal'
    fi
  fi

  require_link "$repo_root/AGENTS.md" '.codex/AGENTS.md'
  if [[ -f "$repo_root/.codex/AGENTS.md" && -f "$repo_root/.claude/CLAUDE.md" ]]; then
    if ! GOBBI_ENTRYPOINT_REPO_ROOT="$repo_root" \
      bash "$runtime_entrypoint_sync" --check >/dev/null; then
      topology_fail 'runtime entrypoints must contain canonical generated Principles and the repository-local route'
    fi
  fi

  for role in "${roles[@]}"; do
    require_file "$repo_root/.gobbi/projects/gobbi/agents/$role.md"
    require_file "$repo_root/.gobbi/projects/gobbi/agents/$role.toml"
    require_link "$repo_root/.claude/agents/$role.md" "../../.gobbi/projects/gobbi/agents/$role.md"
    require_link "$repo_root/.codex/agents/$role.toml" "../../.gobbi/projects/gobbi/agents/$role.toml"
  done

  validate_lifecycle_semantics

  require_empty_or_absent_dir "$repo_root/.gobbi/projects/gobbi/hooks"
  require_empty_or_absent_dir "$repo_root/.claude/hooks"
  if [[ -e "$package_root/hooks" || -L "$package_root/hooks" ]]; then
    topology_fail 'plugins/gobbi/hooks is a forbidden package component'
  fi

  [[ "$source_topology_failures" -eq 0 ]]
}

check_agents_skill_mirror() {
  local skill_name mirror_entry mirror_name
  while IFS= read -r skill_name; do
    check_link "$repo_root/.agents/skills/$skill_name" "../../.gobbi/projects/gobbi/skills/$skill_name"
  done < <(for_each_canonical_skill)

  if [[ -d "$repo_root/.agents/skills" ]]; then
    for mirror_entry in "$repo_root"/.agents/skills/*; do
      [[ -e "$mirror_entry" || -L "$mirror_entry" ]] || continue
      mirror_name="${mirror_entry##*/}"
      if [[ ! -d "$canonical_skills_root/$mirror_name" ]]; then
        printf '.agents/skills/%s has no canonical skill (stale discovery link)\n' "$mirror_name" >&2
        return 1
      fi
    done
  fi
}

for_each_canonical_skill() {
  local skill_dir
  for skill_dir in "$repo_root"/.gobbi/projects/gobbi/skills/*; do
    [[ -d "$skill_dir" ]] || continue
    printf '%s\n' "${skill_dir##*/}"
  done | sort
}

# Enumerate a canonical skill's agent-exposed children, recursively, as paths relative
# to the skill dir. The set is DERIVED from the canonical tree — no skill name, file
# name, or count is hardcoded. Dot-prefixed entries (e.g. .DS_Store, editor/cache files)
# are the generated/metadata class and are pruned at every level; everything else
# (.md docs, link-target data files like memory-vocabulary.json, scripts/ shell files,
# templates/ and workflow/ children) is an agent-exposed child.
agent_exposed_files() {
  local dir="$canonical_skills_root/$1"
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type f -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Enumerate the canonical skill's real subdirs (dot-pruned), relative to the skill dir.
# Used by the --check directory-parity pass that catches an empty stale mirror subdir.
agent_exposed_dirs() {
  local dir="$canonical_skills_root/$1"
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type d -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Enumerate the per-file mirror leaves under .claude/skills/{skill} (each a symlink, plus
# any stray real file), relative to the skill dir, dot entries excluded. No -L is needed:
# the mirror dirs are REAL and only the leaves are symlinks, so plain find lists every
# leaf and (correctly) does NOT descend a forbidden directory symlink — which then shows
# up as a stale dir-entry vs. the missing per-file children during the parity comparison.
claude_skill_mirror_files() {
  local dir="$repo_root/.claude/skills/$1"
  [[ -d "$dir" ]] || return 0
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o ! -type d -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Enumerate the mirror's REAL subdirs (no -L, so a forbidden directory symlink is excluded
# here and instead reported by the explicit dir-symlink guard). Used for directory parity.
claude_skill_mirror_dirs() {
  local dir="$repo_root/.claude/skills/$1"
  [[ -d "$dir" ]] || return 0
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type d -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Relative symlink target for a mirror leaf. The per-file `../` depth scales with the
# leaf's nesting level: a top-level file (.claude/skills/{skill}/{file}) needs 3, a
# support-subdir child (.claude/skills/{skill}/scripts|templates|workflow/{file}) needs 4,
# i.e. 3 + the number of directory segments in the relative path.
claude_link_target() {
  local skill="$1" rel="$2"
  local slashes="${rel//[!\/]/}"
  local depth=$(( 3 + ${#slashes} ))
  local prefix="" i
  for (( i = 0; i < depth; i++ )); do prefix+="../"; done
  printf '%s.gobbi/projects/gobbi/skills/%s/%s' "$prefix" "$skill" "$rel"
}

report_reconcile_error() {
  local path="$1" reason="$2"
  printf 'unsafe mirror reconciliation entry %s: %s\n' "$path" "$reason" >&2
  reconcile_preflight_failed=1
}

validate_reconcile_relative_path() {
  local rel="$1" component
  local -a components=()

  reconcile_path_reason=''
  if [[ -z "$rel" || "$rel" == /* || "$rel" == *$'\n'* || "$rel" == *$'\t'* ]]; then
    reconcile_path_reason='path is empty, absolute, or contains a protected control character'
    return 1
  fi

  IFS='/' read -r -a components <<< "$rel"
  for component in "${components[@]}"; do
    if [[ -z "$component" || "$component" == '.' || "$component" == '..' || "$component" == .* ]]; then
      reconcile_path_reason='path contains a dot-prefixed or traversal component'
      return 1
    fi
  done
  return 0
}

write_reconcile_metrics() {
  local metrics_path="${GOBBI_SYNC_METRICS_FILE:-}"
  [[ -n "$metrics_path" ]] || return 0
  case "$metrics_path" in
    "$repo_root/.claude/skills"|"$repo_root/.claude/skills"/*)
      printf 'metrics path must be outside the managed .claude/skills mirror: %s\n' "$metrics_path" >&2
      return 1
      ;;
  esac
  printf 'canonical_walks=%d\nmirror_walks=%d\ncanonical_entries=%d\nmirror_entries=%d\ninspected_entries=%d\n' \
    "$reconcile_canonical_walks" \
    "$reconcile_mirror_walks" \
    "$reconcile_canonical_entries" \
    "$reconcile_mirror_entries" \
    "$((reconcile_canonical_entries + reconcile_mirror_entries))" > "$metrics_path"
}

sort_reconcile_paths() {
  local direction="$1"
  shift
  local rel slashes depth

  for rel in "$@"; do
    slashes="${rel//[!\/]/}"
    depth=$((1 + ${#slashes}))
    printf '%08d\t%s\n' "$depth" "$rel"
  done | if [[ "$direction" == 'deepest' ]]; then
    LC_ALL=C sort -t $'\t' -k1,1nr -k2,2r
  else
    LC_ALL=C sort -t $'\t' -k1,1n -k2,2
  fi | cut -f2-
}

preflight_claude_skills_reconciliation() {
  local mirror_root="$repo_root/.claude/skills"
  local canonical_inventory mirror_inventory sort_file entry rel skill leaf expected actual resolved display
  local -a sorted=()

  if [[ ! -d "$canonical_skills_root" || -L "$canonical_skills_root" ]]; then
    report_reconcile_error '.gobbi/projects/gobbi/skills' 'canonical skill root is not a real directory'
    write_reconcile_metrics
    return 1
  fi

  canonical_inventory="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-canonical.XXXXXX")"
  mirror_inventory="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-mirror.XXXXXX")"
  reconcile_inventory_files=("$canonical_inventory" "$mirror_inventory")

  # One non-following full-tree walk per side. Canonical dot entries remain metadata and
  # are pruned; mirror dot entries are inventoried so they fail closed as protected paths.
  find "$canonical_skills_root" -mindepth 1 -name '.*' -prune -o -print0 > "$canonical_inventory"
  reconcile_canonical_walks=1
  if [[ -L "$mirror_root" ]]; then
    report_reconcile_error '.claude/skills' 'mirror root is a directory symlink'
  elif [[ -e "$mirror_root" && ! -d "$mirror_root" ]]; then
    report_reconcile_error '.claude/skills' 'mirror root is not a real directory'
  elif [[ -d "$mirror_root" ]]; then
    find "$mirror_root" -mindepth 1 -print0 > "$mirror_inventory"
    reconcile_mirror_walks=1
  fi

  while IFS= read -r -d '' entry; do
    reconcile_canonical_entries=$((reconcile_canonical_entries + 1))
    case "$entry" in
      "$canonical_skills_root"/*) rel="${entry#"$canonical_skills_root"/}" ;;
      *)
        report_reconcile_error "$entry" 'canonical inventory path escapes the canonical root'
        continue
        ;;
    esac
    display=".gobbi/projects/gobbi/skills/$rel"
    if ! validate_reconcile_relative_path "$rel"; then
      report_reconcile_error "$display" "$reconcile_path_reason"
      continue
    fi
    if [[ -L "$entry" ]]; then
      report_reconcile_error "$display" 'canonical entry is a symlink; only real directories and regular files are supported'
    elif [[ -d "$entry" ]]; then
      reconcile_expected_dir_set["$rel"]=1
      reconcile_expected_dirs+=("$rel")
      if [[ "$rel" != */* ]]; then
        reconcile_skill_names+=("$rel")
      fi
    elif [[ -f "$entry" ]]; then
      if [[ "$rel" != */* ]]; then
        report_reconcile_error "$display" 'canonical file is not inside a skill directory'
        continue
      fi
      skill="${rel%%/*}"
      leaf="${rel#*/}"
      reconcile_expected_leaf_set["$rel"]=1
      reconcile_expected_leaves+=("$rel")
      reconcile_expected_target["$rel"]="$(claude_link_target "$skill" "$leaf")"
    else
      report_reconcile_error "$display" 'canonical entry has an unsupported type'
    fi
  done < "$canonical_inventory"

  while IFS= read -r -d '' entry; do
    reconcile_mirror_entries=$((reconcile_mirror_entries + 1))
    case "$entry" in
      "$mirror_root"/*) rel="${entry#"$mirror_root"/}" ;;
      *)
        report_reconcile_error "$entry" 'mirror inventory path escapes the mirror root'
        continue
        ;;
    esac
    display=".claude/skills/$rel"
    if ! validate_reconcile_relative_path "$rel"; then
      report_reconcile_error "$display" "$reconcile_path_reason"
      continue
    fi

    if [[ -L "$entry" ]]; then
      if [[ -d "$entry" ]]; then
        report_reconcile_error "$display" 'directory symlinks are forbidden; expected real directories with per-file symlinks'
        continue
      fi
      if [[ "$rel" != */* ]]; then
        report_reconcile_error "$display" 'top-level mirror skill entries must be real directories'
        continue
      fi
      skill="${rel%%/*}"
      leaf="${rel#*/}"
      expected="$(claude_link_target "$skill" "$leaf")"
      if ! readlink_raw_target actual "$entry"; then
        report_reconcile_error "$display" 'symlink target could not be read'
        continue
      fi
      if [[ "$actual" != "$expected" ]]; then
        if ! resolved="$(realpath -m -- "${entry%/*}/$actual")"; then
          report_reconcile_error "$display" 'symlink target could not be normalized'
        elif [[ "$resolved" != "$canonical_skills_root"/* ]]; then
          report_reconcile_error "$display" "symlink target escapes the generator-owned canonical root: $actual"
        else
          report_reconcile_error "$display" "raw symlink target is $actual; expected $expected"
        fi
        continue
      fi
      if [[ -n "${reconcile_expected_leaf_set[$rel]:-}" ]]; then
        :
      elif [[ -n "${reconcile_expected_dir_set[$rel]:-}" ]]; then
        report_reconcile_error "$display" 'canonical path is a directory, so a mirror symlink leaf is unsafe'
      else
        reconcile_stale_leaves+=("$rel")
      fi
    elif [[ -d "$entry" ]]; then
      if [[ -n "${reconcile_expected_leaf_set[$rel]:-}" ]]; then
        report_reconcile_error "$display" 'expected mirror leaf is a real directory'
      elif [[ -z "${reconcile_expected_dir_set[$rel]:-}" ]]; then
        reconcile_stale_dirs+=("$rel")
      fi
    elif [[ -f "$entry" ]]; then
      report_reconcile_error "$display" 'regular files are never generator-owned mirror leaves'
    else
      report_reconcile_error "$display" 'entry has an unsupported type'
    fi
  done < "$mirror_inventory"

  write_reconcile_metrics
  if [[ "$reconcile_preflight_failed" -ne 0 ]]; then
    printf '.claude/skills reconciliation aborted before mutation\n' >&2
    return 1
  fi

  if ((${#reconcile_skill_names[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    printf '%s\n' "${reconcile_skill_names[@]}" | LC_ALL=C sort -u > "$sort_file"
    mapfile -t sorted < "$sort_file"
    reconcile_skill_names=("${sorted[@]}")
  fi
  if ((${#reconcile_expected_leaves[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    printf '%s\n' "${reconcile_expected_leaves[@]}" | LC_ALL=C sort -u > "$sort_file"
    mapfile -t sorted < "$sort_file"
    reconcile_expected_leaves=("${sorted[@]}")
  fi
  if ((${#reconcile_stale_leaves[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    printf '%s\n' "${reconcile_stale_leaves[@]}" | LC_ALL=C sort -u > "$sort_file"
    mapfile -t sorted < "$sort_file"
    reconcile_stale_leaves=("${sorted[@]}")
  fi
  return 0
}

preflight_agents_skill_reconciliation() {
  local mirror_root="$repo_root/.agents/skills"
  local entry skill_name display expected_target actual_target

  if [[ -L "$mirror_root" ]]; then
    report_reconcile_error '.agents/skills' 'mirror root is a directory symlink'
  elif [[ -e "$mirror_root" && ! -d "$mirror_root" ]]; then
    report_reconcile_error '.agents/skills' 'mirror root is not a real directory'
  elif [[ -d "$mirror_root" ]]; then
    while IFS= read -r -d '' entry; do
      case "$entry" in
        "$mirror_root"/*) skill_name="${entry#"$mirror_root"/}" ;;
        *)
          report_reconcile_error "$entry" 'Codex discovery inventory path escapes the mirror root'
          continue
          ;;
      esac
      display=".agents/skills/$skill_name"

      if ! validate_reconcile_relative_path "$skill_name"; then
        report_reconcile_error "$display" "$reconcile_path_reason"
        continue
      fi
      expected_target="../../.gobbi/projects/gobbi/skills/$skill_name"
      if [[ ! -L "$entry" ]]; then
        if [[ -d "$canonical_skills_root/$skill_name" ]]; then
          report_reconcile_error "$display" 'expected a generator-owned skill symlink'
        else
          report_reconcile_error "$display" 'has no canonical skill and is not a generator-owned symlink'
        fi
        continue
      fi

      if ! readlink_raw_target actual_target "$entry"; then
        report_reconcile_error "$display" 'symlink target could not be read'
        continue
      fi
      if [[ "$actual_target" != "$expected_target" ]]; then
        report_reconcile_error "$display" \
          "raw symlink target is $actual_target; expected generator-owned target $expected_target"
      elif [[ -d "$canonical_skills_root/$skill_name" ]]; then
        if [[ ! -e "$entry" ]]; then
          report_reconcile_error "$display" 'generator-owned skill symlink points to a missing target'
        fi
      else
        reconcile_stale_agents_skill_links+=("$entry")
      fi
    done < <(find "$mirror_root" -mindepth 1 -maxdepth 1 -print0)
  fi

  if [[ "$reconcile_preflight_failed" -ne 0 ]]; then
    printf '.agents/skills reconciliation aborted before mutation\n' >&2
    return 1
  fi
}

apply_claude_skills_reconciliation() {
  local mirror_root="$repo_root/.claude/skills"
  local rel skill leaf sort_file
  local -a sorted_dirs=()

  # The global preflight above proved every path in these arrays. Never follow a
  # directory symlink and never recursively force-delete: leaves go first, then rmdir.
  for rel in "${reconcile_stale_leaves[@]}"; do
    rm -f -- "$mirror_root/$rel"
  done
  if ((${#reconcile_stale_dirs[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    sort_reconcile_paths deepest "${reconcile_stale_dirs[@]}" > "$sort_file"
    mapfile -t sorted_dirs < "$sort_file"
    for rel in "${sorted_dirs[@]}"; do
      rmdir -- "$mirror_root/$rel"
    done
  fi

  mkdir -p "$mirror_root"
  if ((${#reconcile_expected_dirs[@]})); then
    sort_file="$(mktemp "${TMPDIR:-/tmp}/gobbi-sync-sort.XXXXXX")"
    reconcile_inventory_files+=("$sort_file")
    sort_reconcile_paths shallowest "${reconcile_expected_dirs[@]}" > "$sort_file"
    mapfile -t sorted_dirs < "$sort_file"
    for rel in "${sorted_dirs[@]}"; do
      mkdir -p "$mirror_root/$rel"
    done
  fi
  for rel in "${reconcile_expected_leaves[@]}"; do
    skill="${rel%%/*}"
    leaf="${rel#*/}"
    ensure_link "$mirror_root/$rel" "${reconcile_expected_target[$rel]}"
  done
}

apply_agents_skill_reconciliation() {
  local link_path skill_name

  for link_path in "${reconcile_stale_agents_skill_links[@]}"; do
    rm -f -- "$link_path"
  done
  for skill_name in "${reconcile_skill_names[@]}"; do
    ensure_link "$repo_root/.agents/skills/$skill_name" "../../.gobbi/projects/gobbi/skills/$skill_name"
  done
}

cleanup_reconcile_inventories() {
  local path
  for path in "${reconcile_inventory_files[@]:-}"; do
    [[ -n "$path" ]] || continue
    rm -f -- "$path"
  done
}

declare -a reconcile_inventory_files=()
trap cleanup_reconcile_inventories EXIT

# Validate per-skill BIDIRECTIONAL parity for the .claude/skills mirror: the mirror's
# child set must equal the canonical skill's agent-exposed child set (a missing child OR a
# stale extra both count as drift), and every canonical child must resolve through a
# correctly-targeted symlink (find-L/readlink-e discipline). Sets a global drift flag
# rather than fail-fast, so one run reports every drifted entry. Always returns 0.
check_claude_skills_mirror() {
  local skill_name="$1"
  local mirror_dir="$repo_root/.claude/skills/$skill_name"
  local canonical mirror missing stale rel target actual link_path
  local canon_dirs mirror_dirs stale_dirs

  canonical="$(agent_exposed_files "$skill_name")"

  if [[ ! -d "$mirror_dir" ]]; then
    printf '.claude/skills/%s is missing (no mirror directory)\n' "$skill_name" >&2
    claude_skills_drift=1
    return 0
  fi

  mirror="$(claude_skill_mirror_files "$skill_name")"

  # comm must use the SAME collation as the LC_ALL=C sort in the enumerators above,
  # else it both warns "not in sorted order" and computes the set difference wrongly.
  missing="$(LC_ALL=C comm -23 <(printf '%s\n' "$canonical") <(printf '%s\n' "$mirror"))"
  stale="$(LC_ALL=C comm -13 <(printf '%s\n' "$canonical") <(printf '%s\n' "$mirror"))"

  if [[ -n "$missing" ]]; then
    while IFS= read -r rel; do
      [[ -n "$rel" ]] || continue
      printf '.claude/skills/%s/%s is missing from the mirror\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
    done <<< "$missing"
  fi

  if [[ -n "$stale" ]]; then
    while IFS= read -r rel; do
      [[ -n "$rel" ]] || continue
      printf '.claude/skills/%s/%s is a stale mirror entry (no canonical child)\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
    done <<< "$stale"
  fi

  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    link_path="$mirror_dir/$rel"
    target="$(claude_link_target "$skill_name" "$rel")"
    if [[ ! -L "$link_path" ]]; then
      if [[ -e "$link_path" ]]; then
        printf '.claude/skills/%s/%s exists and is not a symlink\n' "$skill_name" "$rel" >&2
        claude_skills_drift=1
      fi
      continue
    fi
    if ! readlink_raw_target actual "$link_path"; then
      printf '.claude/skills/%s/%s has an unreadable symlink target\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
      continue
    fi
    if [[ "$actual" != "$target" ]]; then
      printf '.claude/skills/%s/%s points to %s; expected %s\n' "$skill_name" "$rel" "$actual" "$target" >&2
      claude_skills_drift=1
    elif [[ ! -e "$link_path" ]]; then
      printf '.claude/skills/%s/%s points to a missing target\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
    fi
  done <<< "$canonical"

  # Explicit guard for the A3 #1-forbidden case:
  # a mirror entry that is a symlink resolving to a DIRECTORY. Claude Code skill
  # discovery does not resolve a symlinked directory, so a dir symlink silently
  # un-discovers the skill. The set-difference above already FAILS on this, but the
  # explicit message names the real fix (replace with a real dir of per-file symlinks)
  # instead of only "stale entry".
  while IFS= read -r link_path; do
    [[ -n "$link_path" ]] || continue
    if [[ -L "$link_path" && -d "$link_path" ]]; then
      printf '.claude/skills/%s/%s is a directory symlink; expected a real dir of per-file symlinks\n' "$skill_name" "${link_path#"$mirror_dir"/}" >&2
      claude_skills_drift=1
    fi
  done < <(find "$mirror_dir" -type l)

  # Bidirectional DIRECTORY parity. The file-only
  # comparison cannot see an EMPTY stale subdir — it has no leaf to flag — so a stale
  # support subdir (e.g. a renamed canonical scripts/ dir) would otherwise be invisible.
  canon_dirs="$(agent_exposed_dirs "$skill_name")"
  mirror_dirs="$(claude_skill_mirror_dirs "$skill_name")"
  stale_dirs="$(LC_ALL=C comm -13 <(printf '%s\n' "$canon_dirs") <(printf '%s\n' "$mirror_dirs"))"
  if [[ -n "$stale_dirs" ]]; then
    while IFS= read -r rel; do
      [[ -n "$rel" ]] || continue
      printf '.claude/skills/%s/%s is a stale mirror subdir (no canonical dir)\n' "$skill_name" "$rel" >&2
      claude_skills_drift=1
    done <<< "$stale_dirs"
  fi

  return 0
}

# Enumerate one component tree's real regular files, real subdirs, or symlinks, dot-pruned
# and relative to the tree root. No -L and no -follow: a symlink is never a valid generated
# file, so it must never appear as a file here and is named by its own guard pass instead.
component_files() {
  local dir="$1"
  local component="${2:-}" filtered="${3:-false}" rel
  [[ -d "$dir" ]] || return 0
  while IFS= read -r rel; do
    rel="${rel#./}"
    if [[ "$filtered" == true && "$component" == skills ]] && package_skill_path_excluded "$rel"; then
      continue
    fi
    printf '%s\n' "$rel"
  done < <(cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type f -print) | LC_ALL=C sort
}

component_dirs() {
  local dir="$1"
  local component="${2:-}" filtered="${3:-false}" rel
  [[ -d "$dir" ]] || return 0
  while IFS= read -r rel; do
    rel="${rel#./}"
    if [[ "$filtered" == true && "$component" == skills ]] && package_skill_path_excluded "$rel"; then
      continue
    fi
    printf '%s\n' "$rel"
  done < <(cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type d -print) | LC_ALL=C sort
}

component_symlinks() {
  local dir="$1"
  [[ -d "$dir" ]] || return 0
  ( cd "$dir" && find . -mindepth 1 -name '.*' -prune -o -type l -print ) \
    | sed 's|^\./||' | LC_ALL=C sort
}

# Prove every file of a generated package component byte-equal to its canonical owner. This
# guard GATES publication rather than following it: a forgotten --materialize-package run
# leaves a missing, stale, or differing generated file, and each one is reported here by
# exact repository-relative path with a non-zero exit. Set-equality runs in both directions,
# so neither a new canonical file nor a deleted one can pass unnoticed.
check_generated_component() {
  local component="$1"
  local canonical_root="$repo_root/.gobbi/projects/gobbi/$component"
  local package_dir="$package_root/$component"
  local drift=0
  local canonical_files package_files canonical_dirs package_dirs missing stale missing_dirs stale_dirs rel

  if [[ -L "$canonical_root" || ! -d "$canonical_root" ]]; then
    printf '.gobbi/projects/gobbi/%s is not a real directory\n' "$component" >&2
    return 1
  fi

  canonical_files="$(component_files "$canonical_root" "$component" true)"
  package_files="$(component_files "$package_dir" "$component" false)"

  # comm must use the SAME collation as the LC_ALL=C sort in the enumerators above.
  missing="$(LC_ALL=C comm -23 <(printf '%s\n' "$canonical_files") <(printf '%s\n' "$package_files"))"
  stale="$(LC_ALL=C comm -13 <(printf '%s\n' "$canonical_files") <(printf '%s\n' "$package_files"))"

  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    printf 'plugins/gobbi/%s/%s is missing from the generated copy\n' "$component" "$rel" >&2
    drift=1
  done <<< "$missing"

  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    printf 'plugins/gobbi/%s/%s has no canonical owner (stale generated file)\n' "$component" "$rel" >&2
    drift=1
  done <<< "$stale"

  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    [[ -f "$package_dir/$rel" && ! -L "$package_dir/$rel" ]] || continue
    if ! cmp -s -- "$canonical_root/$rel" "$package_dir/$rel"; then
      printf 'plugins/gobbi/%s/%s is not byte-equal to .gobbi/projects/gobbi/%s/%s\n' \
        "$component" "$rel" "$component" "$rel" >&2
      drift=1
    fi
  done <<< "$canonical_files"

  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    printf 'plugins/gobbi/%s/%s is a symlink; the generated copy must hold real files\n' \
      "$component" "$rel" >&2
    drift=1
  done <<< "$(component_symlinks "$package_dir")"

  # Directory parity in the stale direction. The file comparison cannot see an EMPTY stale
  # subdir, which would otherwise ship in the published package.
  canonical_dirs="$(component_dirs "$canonical_root" "$component" true)"
  package_dirs="$(component_dirs "$package_dir" "$component" false)"
  missing_dirs="$(LC_ALL=C comm -23 <(printf '%s\n' "$canonical_dirs") <(printf '%s\n' "$package_dirs"))"
  stale_dirs="$(LC_ALL=C comm -13 <(printf '%s\n' "$canonical_dirs") <(printf '%s\n' "$package_dirs"))"
  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    printf 'plugins/gobbi/%s/%s is a missing generated subdir\n' "$component" "$rel" >&2
    drift=1
  done <<< "$missing_dirs"
  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    printf 'plugins/gobbi/%s/%s is a stale generated subdir (no canonical dir)\n' "$component" "$rel" >&2
    drift=1
  done <<< "$stale_dirs"

  if [[ "$drift" -ne 0 ]]; then
    printf 'plugins/gobbi/%s is not byte-equal to its canonical owner; regenerate with: bash scripts/sync-plugin-package.sh --materialize-package\n' \
      "$component" >&2
    return 1
  fi
}

# Assert one package component against the shape it actually has.
check_package_component() {
  local component="$1"
  local package_dir="$package_root/$component"

  if [[ -L "$package_dir" ]]; then
    if [[ "$component" == skills ]]; then
      printf 'plugins/gobbi/skills must be a materialized filtered directory, not a symlink\n' >&2
      return 1
    fi
    check_link "$package_dir" "$(package_component_link_target "$component")"
    return
  fi
  if [[ ! -d "$package_dir" ]]; then
    printf 'plugins/gobbi/%s is missing; expected the canonical symlink or the generated directory\n' \
      "$component" >&2
    return 1
  fi
  check_generated_component "$component"
}

# Generate the one permitted published copy: dereference the component into a real directory
# of real files taken byte-for-byte from the canonical owner. The canonical tree stays the
# only editable owner; a wrong generated file means the owner or this generator is wrong.
# Prove the whole plan safe before the first mutation, then prune stale entries leaf-first
# and copy every canonical file. Never follow a directory symlink, never delete recursively.
materialize_package_component() {
  local component="$1"
  local canonical_root="$repo_root/.gobbi/projects/gobbi/$component"
  local package_dir="$package_root/$component"
  local entry rel preflight_failed=0
  local -a expected_dirs=() expected_files=() stale_entries=() stale_dirs=() sorted=()
  local -A expected_dir_set=() expected_file_set=()

  if [[ -L "$canonical_root" || ! -d "$canonical_root" ]]; then
    printf 'cannot generate plugins/gobbi/%s: .gobbi/projects/gobbi/%s is not a real directory\n' \
      "$component" "$component" >&2
    return 1
  fi
  if [[ -e "$package_dir" && ! -L "$package_dir" && ! -d "$package_dir" ]]; then
    printf 'cannot generate plugins/gobbi/%s: it exists and is neither a symlink nor a directory\n' \
      "$component" >&2
    return 1
  fi

  while IFS= read -r -d '' entry; do
    rel="${entry#"$canonical_root"/}"
    if [[ "$component" == skills ]] && package_skill_path_excluded "$rel"; then
      continue
    fi
    if ! validate_reconcile_relative_path "$rel"; then
      printf 'cannot generate plugins/gobbi/%s: .gobbi/projects/gobbi/%s/%s: %s\n' \
        "$component" "$component" "$rel" "$reconcile_path_reason" >&2
      preflight_failed=1
    elif [[ -L "$entry" ]]; then
      printf 'cannot generate plugins/gobbi/%s: .gobbi/projects/gobbi/%s/%s is a symlink\n' \
        "$component" "$component" "$rel" >&2
      preflight_failed=1
    elif [[ -d "$entry" ]]; then
      expected_dir_set["$rel"]=1
      expected_dirs+=("$rel")
    elif [[ -f "$entry" ]]; then
      expected_file_set["$rel"]=1
      expected_files+=("$rel")
    else
      printf 'cannot generate plugins/gobbi/%s: .gobbi/projects/gobbi/%s/%s has an unsupported type\n' \
        "$component" "$component" "$rel" >&2
      preflight_failed=1
    fi
  done < <(find "$canonical_root" -mindepth 1 -name '.*' -prune -o -print0)

  if [[ -d "$package_dir" && ! -L "$package_dir" ]]; then
    while IFS= read -r -d '' entry; do
      rel="${entry#"$package_dir"/}"
      if ! validate_reconcile_relative_path "$rel"; then
        printf 'cannot generate plugins/gobbi/%s: plugins/gobbi/%s/%s: %s\n' \
          "$component" "$component" "$rel" "$reconcile_path_reason" >&2
        preflight_failed=1
      elif [[ -L "$entry" ]]; then
        # A symlink is pruned at EVERY path, including an expected one. cp follows a symlink
        # destination, so copying onto one would write through it, outside the package and
        # into the canonical owner the generator must never modify.
        stale_entries+=("$rel")
      elif [[ -d "$entry" ]]; then
        [[ -n "${expected_dir_set[$rel]:-}" ]] || stale_dirs+=("$rel")
      elif [[ -f "$entry" ]]; then
        [[ -n "${expected_file_set[$rel]:-}" ]] || stale_entries+=("$rel")
      else
        stale_entries+=("$rel")
      fi
    done < <(find "$package_dir" -mindepth 1 -name '.*' -prune -o -print0)
  fi

  if [[ "$preflight_failed" -ne 0 ]]; then
    printf 'plugins/gobbi/%s generation aborted before mutation\n' "$component" >&2
    return 1
  fi

  if [[ -L "$package_dir" ]]; then
    rm -f -- "$package_dir"
  fi

  if ((${#stale_entries[@]})); then
    for rel in "${stale_entries[@]}"; do
      rm -f -- "$package_dir/$rel"
    done
  fi
  if ((${#stale_dirs[@]})); then
    mapfile -t sorted < <(sort_reconcile_paths deepest "${stale_dirs[@]}")
    for rel in "${sorted[@]}"; do
      rmdir -- "$package_dir/$rel"
    done
  fi

  mkdir -p "$package_dir"
  if ((${#expected_dirs[@]})); then
    mapfile -t sorted < <(sort_reconcile_paths shallowest "${expected_dirs[@]}")
    for rel in "${sorted[@]}"; do
      mkdir -p "$package_dir/$rel"
    done
  fi
  for rel in "${expected_files[@]}"; do
    cp -p -- "$canonical_root/$rel" "$package_dir/$rel"
  done

  printf 'generated plugins/gobbi/%s from .gobbi/projects/gobbi/%s (%d files)\n' \
    "$component" "$component" "${#expected_files[@]}"
}

path_has_exact_package_skill_segment() {
  local rel="$1" segment
  local -a segments=()
  IFS='/' read -r -a segments <<< "$rel"
  for segment in "${segments[@]}"; do
    [[ "$segment" == "$package_only_skill" ]] && return 0
  done
  return 1
}

string_has_package_skill_token() {
  local value="$1"
  [[ "$value" =~ $package_only_skill_token_regex ]]
}

file_has_package_skill_token() {
  local path="$1"
  LC_ALL=C grep -aEq -- "$package_only_skill_token_regex" "$path"
}

check_package_only_skill_tokens() {
  local allow_prunable_subtree="${1:-false}"
  local entry rel raw_target

  while IFS= read -r -d '' entry; do
    rel="${entry#"$package_root"/}"
    if [[ "$allow_prunable_subtree" == true ]] && \
       path_is_equal_or_descendant "$rel" "skills/$package_only_skill"; then
      continue
    fi
    if path_has_exact_package_skill_segment "$rel"; then
      printf 'plugins/gobbi/%s contains the forbidden exact package-only skill path segment\n' "$rel" >&2
      return 1
    fi
    if [[ -L "$entry" ]]; then
      if ! readlink_raw_target raw_target "$entry"; then
        printf 'cannot read package symlink target for plugins/gobbi/%s\n' "$rel" >&2
        return 1
      fi
      if string_has_package_skill_token "$raw_target"; then
        printf 'plugins/gobbi/%s symlink target contains the forbidden package-only skill token\n' "$rel" >&2
        return 1
      fi
    elif [[ -f "$entry" ]] && file_has_package_skill_token "$entry"; then
      printf 'plugins/gobbi/%s contains the forbidden standalone package-only skill token\n' "$rel" >&2
      return 1
    fi
  done < <(find -P "$package_root" -mindepth 1 -print0)
}

preflight_normal_package_skills() {
  if [[ ! -d "$package_root/skills" || -L "$package_root/skills" ]]; then
    printf 'plugins/gobbi/skills must already be a materialized filtered directory; run --materialize-package\n' >&2
    return 1
  fi
  check_package_only_skill_tokens false
}

if ! validate_source_topology; then
  printf '%d source-topology check(s) failed\n' "$source_topology_failures" >&2
  exit 1
fi

if $materialize_mode; then
  check_package_only_skill_tokens true
  for component in "${package_components[@]}"; do
    materialize_package_component "$component"
  done
  # The guard gates publication: prove the freshly generated trees before anything ships.
  for component in "${package_components[@]}"; do
    check_package_component "$component"
  done
  check_package_only_skill_tokens false
  printf 'every generated package file is byte-equal to its canonical owner\n'
  exit 0
fi

if $check_mode; then
  check_agents_skill_mirror

  for component in "${package_components[@]}"; do
    check_package_component "$component"
  done
  check_package_only_skill_tokens false

  # .claude/skills mirror — per-skill bidirectional parity, derived from the canonical
  # tree (no hardcoded skill/file list, no magic count). Catches a missing child, a
  # missing support-subdir file, AND a stale extra entry.
  while IFS= read -r skill_name; do
    check_claude_skills_mirror "$skill_name"
  done < <(for_each_canonical_skill)

  # Stale mirror directory: a .claude/skills/{name} whose canonical skill no longer
  # exists (the dir-granularity half of the bidirectional set-equality).
  if [[ -d "$repo_root/.claude/skills" ]]; then
    for mirror_entry in "$repo_root"/.claude/skills/*; do
      [[ -e "$mirror_entry" ]] || continue
      mirror_name="${mirror_entry##*/}"
      if [[ ! -d "$canonical_skills_root/$mirror_name" ]]; then
        printf '.claude/skills/%s has no canonical skill (stale mirror dir)\n' "$mirror_name" >&2
        claude_skills_drift=1
      fi
    done
  fi

  if [[ "$claude_skills_drift" -ne 0 ]]; then
    printf '.claude/skills mirror is out of sync with the canonical skill tree\n' >&2
    exit 1
  fi

  printf 'Gobbi manifests, marketplaces, entrypoints, roles, and hookless skill/package topology are intact\n'
  exit 0
fi

# Prove both runtime skill-mirror mutation plans before changing any sync-managed path.
# A mixed safe+unsafe mirror therefore leaves the complete mirror byte-for-byte intact.
preflight_claude_skills_reconciliation
preflight_agents_skill_reconciliation
preflight_normal_package_skills
apply_claude_skills_reconciliation
apply_agents_skill_reconciliation

# Normal sync owns the runtime mirrors, not publication. It restores the canonical symlink
# only where the component is absent or already a symlink, and never converts a generated
# directory back to one. A stale generated copy is reported by --check, which names
# --materialize-package, rather than silently repaired or silently discarded here.
for component in "${package_components[@]}"; do
  if [[ "$component" == skills ]]; then
    continue
  fi
  if [[ -d "$package_root/$component" && ! -L "$package_root/$component" ]]; then
    continue
  fi
  ensure_link "$package_root/$component" "$(package_component_link_target "$component")"
done

printf 'synchronized Codex skill discovery, plugins/gobbi skills and agents, and .claude/skills\n'
