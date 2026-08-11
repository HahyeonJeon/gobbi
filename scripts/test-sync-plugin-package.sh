#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
sync_script="$repo_root/scripts/sync-plugin-package.sh"
runtime_entrypoint_script="$repo_root/scripts/sync-runtime-entrypoints.sh"
tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/gobbi-sync-tests.XXXXXX")"
tests_run=0

cleanup() {
  if [[ -d "$tmp_root" && ! -L "$tmp_root" ]]; then
    find "$tmp_root" -depth -mindepth 1 -delete
    rmdir "$tmp_root"
  fi
}
trap cleanup EXIT

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

pass() {
  tests_run=$((tests_run + 1))
  printf 'PASS: %s\n' "$1"
}

assert_file_contains() {
  local path="$1" pattern="$2"
  grep -F -- "$pattern" "$path" >/dev/null || fail "$path does not contain: $pattern"
}

run_entrypoint_sync() {
  local root="$1"
  shift
  GOBBI_ENTRYPOINT_REPO_ROOT="$root" bash "$runtime_entrypoint_script" "$@"
}

make_fixture() {
  local root="$1" role skill
  mkdir -p \
    "$root/.gobbi/projects/gobbi/skills" \
    "$root/.gobbi/projects/gobbi/agents" \
    "$root/.agents/skills" \
    "$root/.agents/plugins" \
    "$root/.claude/skills" \
    "$root/.claude/agents" \
    "$root/.codex/agents" \
    "$root/scripts" \
    "$root/plugins/gobbi/.codex-plugin" \
    "$root/plugins/gobbi/.claude-plugin" \
    "$root/.claude-plugin"

  printf '%s\n' \
    '{"name":"gobbi","version":"1.0.0","description":"fixture","skills":"./skills/"}' \
    > "$root/plugins/gobbi/.codex-plugin/plugin.json"
  printf '%s\n' \
    '{"name":"gobbi","version":"1.0.0","description":"fixture"}' \
    > "$root/plugins/gobbi/.claude-plugin/plugin.json"
  printf '%s\n' \
    '{"name":"gobbi-workspace","plugins":[{"name":"gobbi","source":{"source":"local","path":"./plugins/gobbi"}}]}' \
    > "$root/.agents/plugins/marketplace.json"
  printf '%s\n' \
    '{"name":"fixture","plugins":[{"name":"gobbi","version":"1.0.0","source":"./plugins/gobbi"}]}' \
    > "$root/.claude-plugin/marketplace.json"
  printf '%s\n' \
    '{"env":{"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS":"1"},"teammateMode":"in-process"}' \
    > "$root/.claude/settings.json"
  : > "$root/.codex/AGENTS.md"
  : > "$root/.claude/CLAUDE.md"
  ln -s '.codex/AGENTS.md' "$root/AGENTS.md"

  for role in manager leader executor evaluator assistant; do
    printf '# %s\n' "$role" > "$root/.gobbi/projects/gobbi/agents/$role.md"
    printf 'name = "%s"\n' "$role" > "$root/.gobbi/projects/gobbi/agents/$role.toml"
    ln -s "../../.gobbi/projects/gobbi/agents/$role.md" "$root/.claude/agents/$role.md"
    ln -s "../../.gobbi/projects/gobbi/agents/$role.toml" "$root/.codex/agents/$role.toml"
  done

  # Every fixture starts from one accepted lifecycle combination. Tests mutate this
  # same temporary tree one semantic edge at a time, so the existing reconciliation
  # harness remains the only system under test and unrelated topology stays valid.
  for skill in principles gobbi git memory delegation cowork workflow; do
    cp -R "$repo_root/.gobbi/projects/gobbi/skills/$skill" \
      "$root/.gobbi/projects/gobbi/skills/$skill"
  done
  cp -R "$repo_root/.gobbi/projects/gobbi/skills/gobbi-dev" \
    "$root/.gobbi/projects/gobbi/skills/gobbi-dev"
  cp "$repo_root/.gobbi/projects/gobbi/agents/manager.md" \
    "$root/.gobbi/projects/gobbi/agents/manager.md"
  cp "$repo_root/.gobbi/projects/gobbi/agents/assistant.md" \
    "$root/.gobbi/projects/gobbi/agents/assistant.md"
  cp "$repo_root/.codex/AGENTS.md" "$root/.codex/AGENTS.md"
  cp "$repo_root/.claude/CLAUDE.md" "$root/.claude/CLAUDE.md"
  cp "$repo_root/.claude/settings.json" "$root/.claude/settings.json"
  cp "$repo_root/scripts/check-codex-plugin-smoke.sh" "$root/scripts/check-codex-plugin-smoke.sh"
  cp "$repo_root/scripts/check-claude-plugin-smoke.sh" "$root/scripts/check-claude-plugin-smoke.sh"
  run_entrypoint_sync "$root" --sync >/dev/null
  GOBBI_SYNC_REPO_ROOT="$root" bash "$sync_script" --materialize-package >/dev/null
}

replace_literal_once() {
  local path="$1" old="$2" new="$3" output
  output="$(mktemp "$tmp_root/rewrite.XXXXXX")"
  if ! awk -v old="$old" -v new="$new" '
    !changed {
      offset = index($0, old)
      if (offset) {
        $0 = substr($0, 1, offset - 1) new substr($0, offset + length(old))
        changed = 1
      }
    }
    { print }
    END { if (!changed) exit 42 }
  ' "$path" > "$output"; then
    find "$output" -depth -mindepth 0 -delete
    fail "semantic mutation source is absent from $path: $old"
  fi
  mv "$output" "$path"
}

replace_block_once() {
  local path="$1" old="$2" new="$3" output
  output="$(mktemp "$tmp_root/rewrite-block.XXXXXX")"
  if ! awk -v old="$old" -v new="$new" '
    BEGIN { RS = "\0" }
    {
      offset = index($0, old)
      if (!offset) exit 42
      print substr($0, 1, offset - 1) new substr($0, offset + length(old))
    }
  ' "$path" > "$output"; then
    find "$output" -depth -mindepth 0 -delete
    fail "semantic block mutation source is absent from $path: $old"
  fi
  mv "$output" "$path"
}

swap_literals_once() {
  local path="$1" first="$2" second="$3"
  local marker='GOBBI_SEMANTIC_SWAP_MARKER'
  grep -Fq -- "$marker" "$path" && fail "semantic swap marker already exists in $path"
  replace_literal_once "$path" "$first" "$marker"
  replace_literal_once "$path" "$second" "$first"
  replace_literal_once "$path" "$marker" "$second"
}

write_skill_file() {
  local root="$1" skill="$2" rel="$3" content="${4:-fixture}"
  mkdir -p "$(dirname "$root/.gobbi/projects/gobbi/skills/$skill/$rel")"
  printf '%s\n' "$content" > "$root/.gobbi/projects/gobbi/skills/$skill/$rel"
}

mirror_target() {
  local skill="$1" rel="$2"
  local slashes="${rel//[!\/]/}"
  local depth=$((3 + ${#slashes}))
  local prefix='' i
  for ((i = 0; i < depth; i++)); do
    prefix+='../'
  done
  printf '%s.gobbi/projects/gobbi/skills/%s/%s' "$prefix" "$skill" "$rel"
}

make_owned_mirror_link() {
  local root="$1" skill="$2" rel="$3"
  local path="$root/.claude/skills/$skill/$rel"
  mkdir -p "$(dirname "$path")"
  ln -s "$(mirror_target "$skill" "$rel")" "$path"
}

run_sync() {
  local root="$1"
  shift
  GOBBI_SYNC_REPO_ROOT="$root" bash "$sync_script" "$@"
}

snapshot_mirror() {
  local root="$1" output="$2"
  local mirror="$root/.claude/skills" entry rel raw digest inventory sorted_inventory

  : > "$output"
  if [[ -L "$mirror" ]]; then
    raw="$(readlink -n -- "$mirror" | od -An -tx1 | tr -d ' \n')"
    printf 'root-symlink\thex:%s\n' "$raw" >> "$output"
    return 0
  fi
  if [[ ! -e "$mirror" ]]; then
    printf 'root-missing\n' >> "$output"
    return 0
  fi
  if [[ ! -d "$mirror" ]]; then
    digest="$(sha256sum "$mirror" | awk '{print $1}')"
    printf 'root-file\t%s\n' "$digest" >> "$output"
    return 0
  fi

  inventory="$(mktemp "$tmp_root/snapshot-inventory.XXXXXX")"
  sorted_inventory="$(mktemp "$tmp_root/snapshot-sorted.XXXXXX")"
  find "$mirror" -mindepth 0 -print0 > "$inventory"
  LC_ALL=C sort -z "$inventory" > "$sorted_inventory"
  while IFS= read -r -d '' entry; do
    rel="${entry#"$mirror"}"
    rel="${rel#/}"
    [[ -n "$rel" ]] || rel='.'
    if [[ -L "$entry" ]]; then
      raw="$(readlink -n -- "$entry" | od -An -tx1 | tr -d ' \n')"
      printf 'l\t%s\thex:%s\n' "$rel" "$raw"
    elif [[ -d "$entry" ]]; then
      printf 'd\t%s\t-\n' "$rel"
    elif [[ -f "$entry" ]]; then
      digest="$(sha256sum "$entry" | awk '{print $1}')"
      printf 'f\t%s\t%s\n' "$rel" "$digest"
    else
      printf 'o\t%s\t%s\n' "$rel" "$(stat -c '%F' "$entry")"
    fi
  done < "$sorted_inventory" >> "$output"
}

snapshot_owned_surfaces() {
  local root="$1" output="$2" surface path rel raw digest inventory sorted_inventory
  local -a surfaces=(
    '.agents/skills'
    '.claude/skills'
    '.codex/AGENTS.md'
    '.claude/CLAUDE.md'
    'AGENTS.md'
    'plugins/gobbi/skills'
    'plugins/gobbi/agents'
  )

  : > "$output"
  for surface in "${surfaces[@]}"; do
    path="$root/$surface"
    if [[ -L "$path" ]]; then
      raw="$(readlink -n -- "$path" | od -An -tx1 | tr -d ' \n')"
      printf 'l\t%s\thex:%s\n' "$surface" "$raw" >> "$output"
    elif [[ -f "$path" ]]; then
      digest="$(sha256sum "$path" | awk '{print $1}')"
      printf 'f\t%s\t%s\n' "$surface" "$digest" >> "$output"
    elif [[ -d "$path" ]]; then
      inventory="$(mktemp "$tmp_root/owned-inventory.XXXXXX")"
      sorted_inventory="$(mktemp "$tmp_root/owned-sorted.XXXXXX")"
      find "$path" -mindepth 0 -print0 > "$inventory"
      LC_ALL=C sort -z "$inventory" > "$sorted_inventory"
      while IFS= read -r -d '' entry; do
        rel="${entry#"$root"/}"
        if [[ -L "$entry" ]]; then
          raw="$(readlink -n -- "$entry" | od -An -tx1 | tr -d ' \n')"
          printf 'l\t%s\thex:%s\n' "$rel" "$raw"
        elif [[ -d "$entry" ]]; then
          printf 'd\t%s\t-\n' "$rel"
        elif [[ -f "$entry" ]]; then
          digest="$(sha256sum "$entry" | awk '{print $1}')"
          printf 'f\t%s\t%s\n' "$rel" "$digest"
        else
          printf 'o\t%s\t%s\n' "$rel" "$(stat -c '%F' "$entry")"
        fi
      done < "$sorted_inventory" >> "$output"
    else
      printf 'm\t%s\t-\n' "$surface" >> "$output"
    fi
  done
}

assert_owner_failure_zero_mutation() {
  local name="$1" root="$2" expected="$3"
  local mode before after log

  for mode in normal materialize check; do
    before="$tmp_root/$name.$mode.owned.before"
    after="$tmp_root/$name.$mode.owned.after"
    log="$tmp_root/$name.$mode.log"
    snapshot_owned_surfaces "$root" "$before"
    if [[ "$mode" == normal ]]; then
      if run_sync "$root" > "$log" 2>&1; then
        fail "$name unexpectedly succeeded in normal mode"
      fi
    elif [[ "$mode" == materialize ]]; then
      if run_sync "$root" --materialize-package > "$log" 2>&1; then
        fail "$name unexpectedly succeeded in materialize mode"
      fi
    elif run_sync "$root" --check > "$log" 2>&1; then
      fail "$name unexpectedly succeeded in check mode"
    fi
    snapshot_owned_surfaces "$root" "$after"
    cmp -s "$before" "$after" || fail "$name mutated a sync-owned surface before $mode owner rejection"
    assert_file_contains "$log" "$expected"
  done
  pass "$name rejects the invalid package-only owner in all plugin modes with zero mutation"
}

assert_unsafe_zero_mutation() {
  local name="$1" root="$2" reason="$3"
  local before="$tmp_root/$name.before" after="$tmp_root/$name.after" log="$tmp_root/$name.log"

  snapshot_mirror "$root" "$before"
  if run_sync "$root" > "$log" 2>&1; then
    fail "$name unexpectedly succeeded"
  fi
  snapshot_mirror "$root" "$after"
  cmp -s "$before" "$after" || fail "$name mutated .claude/skills before rejecting the unsafe fixture"
  assert_file_contains "$log" '.claude/skills reconciliation aborted before mutation'
  assert_file_contains "$log" "$reason"
  pass "$name fails closed with an exact mirror snapshot"
}

prepare_synced_fixture() {
  local root="$1"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
}

prepare_semantic_fixture() {
  local root="$1"
  make_fixture "$root"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
}

assert_only_semantic_failure() {
  local log="$1" expected="$2" count
  grep -Fx -- "source topology: $expected" "$log" >/dev/null \
    || fail "missing exact semantic failure: $expected"
  count="$(grep -c '^source topology:' "$log")"
  [[ "$count" -eq 1 ]] \
    || fail "expected one semantic failure, got $count while checking: $expected"
}

expect_semantic_failure() {
  local name="$1" relative_path="$2" old="$3" new="$4" expected="$5"
  local root="$tmp_root/semantic-$name" log="$tmp_root/semantic-$name.log"
  prepare_semantic_fixture "$root"
  replace_literal_once "$root/$relative_path" "$old" "$new"
  if run_sync "$root" --check > "$log" 2>&1; then
    fail "$name semantic mutation unexpectedly succeeded"
  fi
  assert_only_semantic_failure "$log" "$expected"
  pass "$name rejects one changed semantic edge: $expected"
}

test_semantic_positive_recovery_and_reflow() {
  local root="$tmp_root/semantic-positive"
  prepare_semantic_fixture "$root"
  assert_file_contains "$root/.gobbi/projects/gobbi/skills/git/conventions.md" \
    'Recovery permanently accepts these legacy formats'
  assert_file_contains "$root/.gobbi/projects/gobbi/skills/git/conventions.md" \
    'New creation uses only the new formats'
  replace_block_once "$root/.gobbi/projects/gobbi/skills/cowork/SKILL.md" \
    $'Apply Gobbi\x27s [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate). A\n  correction' \
    $'Apply Gobbi\x27s [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate).\n  A correction'
  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" --check >/dev/null
  pass 'finding-m preserves semantic parity across equivalent paragraph reflow'
}

test_smoke_contract_drift() {
  local block_root="$tmp_root/smoke-block-drift" block_log="$tmp_root/smoke-block-drift.log"
  local order_root="$tmp_root/smoke-order-drift" order_log="$tmp_root/smoke-order-drift.log"
  local argv_root="$tmp_root/smoke-argv-drift" argv_log="$tmp_root/smoke-argv-drift.log"
  local count_root="$tmp_root/smoke-count-drift" count_log="$tmp_root/smoke-count-drift.log"
  local precheck_root="$tmp_root/smoke-precheck-drift" precheck_log="$tmp_root/smoke-precheck-drift.log"
  local final_root="$tmp_root/smoke-final-drift" final_log="$tmp_root/smoke-final-drift.log"
  local receipt_root="$tmp_root/smoke-receipt-drift" receipt_log="$tmp_root/smoke-receipt-drift.log"
  local audit_root="$tmp_root/smoke-audit-drift" audit_log="$tmp_root/smoke-audit-drift.log"
  local regex_root="$tmp_root/smoke-regex-drift" regex_log="$tmp_root/smoke-regex-drift.log"
  local cardinality_root="$tmp_root/smoke-cardinality-drift" cardinality_log="$tmp_root/smoke-cardinality-drift.log"
  local policy_root="$tmp_root/smoke-policy-drift" policy_log="$tmp_root/smoke-policy-drift.log"
  local deny_root="$tmp_root/smoke-bilateral-deny-drift" deny_log="$tmp_root/smoke-bilateral-deny-drift.log"
  local trace_set_root="$tmp_root/smoke-bilateral-trace-set-drift" trace_set_log="$tmp_root/smoke-bilateral-trace-set-drift.log"
  local runtime_regex_root="$tmp_root/smoke-bilateral-runtime-regex-drift" runtime_regex_log="$tmp_root/smoke-bilateral-runtime-regex-drift.log"
  local unix_regex_root="$tmp_root/smoke-bilateral-unix-regex-drift" unix_regex_log="$tmp_root/smoke-bilateral-unix-regex-drift.log"
  local stage_table_root="$tmp_root/smoke-bilateral-stage-table-drift" stage_table_log="$tmp_root/smoke-bilateral-stage-table-drift.log"
  local probe_doc_root="$tmp_root/smoke-probe-doc-drift" probe_doc_log="$tmp_root/smoke-probe-doc-drift.log"
  local machine_path_root="$tmp_root/smoke-codex-machine-path-drift" machine_path_log="$tmp_root/smoke-codex-machine-path-drift.log"
  local lookup_root="$tmp_root/smoke-codex-lookup-drift" lookup_log="$tmp_root/smoke-codex-lookup-drift.log"
  local canonical_exec_root="$tmp_root/smoke-codex-canonical-exec-drift" canonical_exec_log="$tmp_root/smoke-codex-canonical-exec-drift.log"
  local inherited_path_root="$tmp_root/smoke-codex-inherited-path-drift" inherited_path_log="$tmp_root/smoke-codex-inherited-path-drift.log"
  local user_path_root="$tmp_root/smoke-codex-user-path-drift" user_path_log="$tmp_root/smoke-codex-user-path-drift.log"
  local selected_receipt_root="$tmp_root/smoke-codex-selected-receipt-drift" selected_receipt_log="$tmp_root/smoke-codex-selected-receipt-drift.log"
  local version_removed_root="$tmp_root/smoke-codex-version-removed-drift" version_removed_log="$tmp_root/smoke-codex-version-removed-drift.log"
  local version_moved_root="$tmp_root/smoke-codex-version-moved-drift" version_moved_log="$tmp_root/smoke-codex-version-moved-drift.log"
  local fixed_home_path
  prepare_semantic_fixture "$block_root"
  replace_literal_once "$block_root/scripts/check-codex-plugin-smoke.sh" \
    'package changed while the frozen manifest was created' \
    'package drifted while the frozen manifest was created'
  if run_sync "$block_root" --check > "$block_log" 2>&1; then
    fail 'one-sided frozen-package block mutation unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$block_log" \
    'Claude and Codex smoke frozen-package contract blocks must remain byte-equal'

  prepare_semantic_fixture "$order_root"
  replace_literal_once "$order_root/scripts/check-claude-plugin-smoke.sh" \
    'freeze_package || fail' 'freeze_package_disabled || fail'
  if run_sync "$order_root" --check > "$order_log" 2>&1; then
    fail 'Claude frozen checkpoint order mutation unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$order_log" \
    'Claude smoke must freeze before version and verify every package checkpoint against the frozen manifest'

  prepare_semantic_fixture "$argv_root"
  replace_literal_once "$argv_root/scripts/check-codex-plugin-smoke.sh" \
    '1) [[ "$1" == --self-test ]] || usage_error; mode=--self-test ;;' \
    '1) mode=--self-test ;;'
  if run_sync "$argv_root" --check > "$argv_log" 2>&1; then
    fail 'broadened Codex argv contract unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$argv_log" \
    'runtime smoke usage must reject invalid argv before artifact creation'

  prepare_semantic_fixture "$count_root"
  replace_block_once "$count_root/scripts/check-codex-plugin-smoke.sh" \
    "run_codex_stage install plugin add gobbi@gobbi-workspace --json || fail 'Codex install stage failed or attempted network access'" \
    $'run_codex_stage install plugin add gobbi@gobbi-workspace --json || fail \'Codex install stage failed or attempted network access\'\nrun_codex_stage install plugin add gobbi@gobbi-workspace --json || fail \'Codex install stage failed or attempted network access\''
  if run_sync "$count_root" --check > "$count_log" 2>&1; then
    fail 'duplicated Codex install stage unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$count_log" 'Codex production smoke stage install must appear exactly once'

  prepare_semantic_fixture "$precheck_root"
  replace_literal_once "$precheck_root/scripts/check-claude-plugin-smoke.sh" \
    'run_source_check_stage source-precheck' 'run_source_check_stage source-precheck-disabled'
  if run_sync "$precheck_root" --check > "$precheck_log" 2>&1; then
    fail 'removed Claude source precheck unexpectedly succeeded'
  fi
  grep -Fx 'source topology: Claude smoke must freeze before version and verify every package checkpoint against the frozen manifest' \
    "$precheck_log" >/dev/null || fail 'precheck removal omitted the order failure'
  grep -Fx 'source topology: Claude production smoke stage source-precheck must appear exactly once' \
    "$precheck_log" >/dev/null || fail 'precheck removal omitted the exact-count failure'
  [[ "$(grep -c '^source topology:' "$precheck_log")" -eq 2 ]] \
    || fail 'precheck removal produced an unexpected semantic failure count'

  prepare_semantic_fixture "$final_root"
  swap_literals_once "$final_root/scripts/check-claude-plugin-smoke.sh" \
    'run_source_check_stage source-postcheck' \
    'verify_frozen_tree "$package_root" package-before-success'
  if run_sync "$final_root" --check > "$final_log" 2>&1; then
    fail 'weakened Claude final frozen-check order unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$final_log" \
    'Claude smoke must freeze before version and verify every package checkpoint against the frozen manifest'

  prepare_semantic_fixture "$receipt_root"
  replace_literal_once "$receipt_root/scripts/check-codex-plugin-smoke.sh" \
    'frozen_sha256=%s dirs=%s files=%s' 'package smoke passed'
  if run_sync "$receipt_root" --check > "$receipt_log" 2>&1; then
    fail 'Codex frozen receipt field removal unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$receipt_log" \
    'runtime smoke success receipt must expose the frozen digest and tree counts'

  prepare_semantic_fixture "$audit_root"
  replace_literal_once "$audit_root/scripts/check-codex-plugin-smoke.sh" \
    'source-check stage recorded an injected line outside the exact local no-effect probe contract' \
    'source-check stage recorded an unexpected injected line'
  if run_sync "$audit_root" --check > "$audit_log" 2>&1; then
    fail 'one-sided source-probe audit block mutation unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$audit_log" \
    'Claude and Codex source-probe audit contract blocks must remain byte-equal'

  prepare_semantic_fixture "$regex_root"
  replace_literal_once "$regex_root/scripts/check-codex-plugin-smoke.sh" \
    "source_probe_regex='^[[:space:]]*" "source_probe_regex='.*"
  if run_sync "$regex_root" --check > "$regex_log" 2>&1; then
    fail 'one-sided source-probe regex weakening unexpectedly succeeded'
  fi
  grep -Fx 'source topology: Claude and Codex source-probe audit contract blocks must remain byte-equal' \
    "$regex_log" >/dev/null || fail 'regex weakening omitted the byte-equality failure'
  grep -Fx 'source topology: runtime smoke source-probe regex must remain one exact anchored contract' \
    "$regex_log" >/dev/null || fail 'regex weakening omitted the exact-regex failure'
  [[ "$(grep -c '^source topology:' "$regex_log")" -eq 2 ]] \
    || fail 'regex weakening produced an unexpected semantic failure count'

  prepare_semantic_fixture "$cardinality_root"
  for smoke in check-codex-plugin-smoke.sh check-claude-plugin-smoke.sh; do
    replace_literal_once "$cardinality_root/scripts/$smoke" \
      'injected_count" -ne 4' 'injected_count" -ne 3'
  done
  if run_sync "$cardinality_root" --check > "$cardinality_log" 2>&1; then
    fail 'bilateral source-probe cardinality weakening unexpectedly succeeded'
  fi
  [[ "$(grep -Fc 'source topology: runtime smoke source checks must require exactly four denied local probes per stage' "$cardinality_log")" -eq 2 ]] \
    || fail 'bilateral cardinality weakening did not fail once per smoke script'
  [[ "$(grep -c '^source topology:' "$cardinality_log")" -eq 2 ]] \
    || fail 'bilateral cardinality weakening produced an unexpected semantic failure count'

  prepare_semantic_fixture "$policy_root"
  replace_literal_once "$policy_root/scripts/check-codex-plugin-smoke.sh" \
    'run_traced_stage "$stage" runtime codex \' 'run_traced_stage "$stage" strict codex \'
  replace_literal_once "$policy_root/scripts/check-claude-plugin-smoke.sh" \
    'run_traced_stage "$stage" runtime claude \' 'run_traced_stage "$stage" strict claude \'
  if run_sync "$policy_root" --check > "$policy_log" 2>&1; then
    fail 'bilateral runtime source-policy mutation unexpectedly succeeded'
  fi
  [[ "$(grep -Fc 'source topology: the fixed runtime wrapper must select semantic no-effect policy' "$policy_log")" -eq 2 ]] \
    || fail 'bilateral runtime policy mutation omitted the runtime-policy failures'
  [[ "$(grep -c '^source topology:' "$policy_log")" -eq 2 ]] \
    || fail 'bilateral runtime policy mutation produced an unexpected semantic failure count'

  prepare_semantic_fixture "$deny_root"
  for smoke in check-codex-plugin-smoke.sh check-claude-plugin-smoke.sh; do
    replace_literal_once "$deny_root/scripts/$smoke" \
      "deny_set='socket,?socketcall,connect,bind,listen,accept,accept4,io_uring_setup,pidfd_getfd'" \
      "deny_set='socket,?socketcall,connect,bind,listen,accept,accept4,io_uring_setup'"
  done
  if run_sync "$deny_root" --check > "$deny_log" 2>&1; then
    fail 'bilateral fixed deny-set weakening unexpectedly succeeded'
  fi
  [[ "$(grep -Fc 'source topology: runtime smoke deny set must remain the exact fixed acquisition surface' "$deny_log")" -eq 2 ]] \
    || fail 'bilateral fixed deny-set weakening did not fail once per smoke script'
  [[ "$(grep -c '^source topology:' "$deny_log")" -eq 2 ]] \
    || fail 'bilateral fixed deny-set weakening produced an unexpected semantic failure count'

  prepare_semantic_fixture "$trace_set_root"
  for smoke in check-codex-plugin-smoke.sh check-claude-plugin-smoke.sh; do
    replace_literal_once "$trace_set_root/scripts/$smoke" \
      "trace_set='%network,?socketcall,io_uring_setup,pidfd_getfd'" \
      "trace_set='%network,?socketcall,io_uring_setup'"
  done
  if run_sync "$trace_set_root" --check > "$trace_set_log" 2>&1; then
    fail 'bilateral fixed trace-set weakening unexpectedly succeeded'
  fi
  [[ "$(grep -Fc 'source topology: runtime smoke trace set must remain the exact fixed acquisition surface' "$trace_set_log")" -eq 2 ]] \
    || fail 'bilateral fixed trace-set weakening did not fail once per smoke script'
  [[ "$(grep -c '^source topology:' "$trace_set_log")" -eq 2 ]] \
    || fail 'bilateral fixed trace-set weakening produced an unexpected semantic failure count'

  prepare_semantic_fixture "$runtime_regex_root"
  for smoke in check-codex-plugin-smoke.sh check-claude-plugin-smoke.sh; do
    replace_literal_once "$runtime_regex_root/scripts/$smoke" \
      '(socket|socketcall|connect|bind|listen|accept|accept4|io_uring_setup|pidfd_getfd)' \
      '(socket|socketcall|connect|bind|listen|accept|accept4|io_uring_setup)'
  done
  if run_sync "$runtime_regex_root" --check > "$runtime_regex_log" 2>&1; then
    fail 'bilateral runtime denial-regex weakening unexpectedly succeeded'
  fi
  [[ "$(grep -Fc 'source topology: runtime smoke denial parser must remain one exact anchored contract' "$runtime_regex_log")" -eq 2 ]] \
    || fail 'bilateral runtime denial-regex weakening did not fail once per smoke script'
  [[ "$(grep -c '^source topology:' "$runtime_regex_log")" -eq 2 ]] \
    || fail 'bilateral runtime denial-regex weakening produced an unexpected semantic failure count'

  prepare_semantic_fixture "$unix_regex_root"
  for smoke in check-codex-plugin-smoke.sh check-claude-plugin-smoke.sh; do
    replace_literal_once "$unix_regex_root/scripts/$smoke" \
      '(STREAM|DGRAM|SEQPACKET)' \
      '(STREAM|DGRAM|SEQPACKET|FAKE)'
  done
  if run_sync "$unix_regex_root" --check > "$unix_regex_log" 2>&1; then
    fail 'bilateral Unix descriptor-regex weakening unexpectedly succeeded'
  fi
  [[ "$(grep -Fc 'source topology: runtime smoke Unix descriptor parser must remain exact and terminally anchored' "$unix_regex_log")" -eq 2 ]] \
    || fail 'bilateral Unix descriptor-regex weakening did not fail once per smoke script'
  [[ "$(grep -c '^source topology:' "$unix_regex_log")" -eq 2 ]] \
    || fail 'bilateral Unix descriptor-regex weakening produced an unexpected semantic failure count'

  prepare_semantic_fixture "$stage_table_root"
  replace_literal_once "$stage_table_root/scripts/check-codex-plugin-smoke.sh" \
    'case "$stage" in version|marketplace-add|available-list|install|installed-list) ;; *) return 1 ;; esac' \
    'case "$stage" in version|debug|marketplace-add|available-list|install|installed-list) ;; *) return 1 ;; esac'
  replace_literal_once "$stage_table_root/scripts/check-claude-plugin-smoke.sh" \
    'case "$stage" in version|validate|marketplace-add|available-list|install|installed-list) ;; *) return 1 ;; esac' \
    'case "$stage" in version|debug|validate|marketplace-add|available-list|install|installed-list) ;; *) return 1 ;; esac'
  if run_sync "$stage_table_root" --check > "$stage_table_log" 2>&1; then
    fail 'bilateral runtime wrapper stage-table widening unexpectedly succeeded'
  fi
  grep -Fx 'source topology: Codex runtime wrapper must preserve its exact stage table' "$stage_table_log" >/dev/null \
    || fail 'bilateral stage-table widening omitted the Codex failure'
  grep -Fx 'source topology: Claude runtime wrapper must preserve its exact stage table' "$stage_table_log" >/dev/null \
    || fail 'bilateral stage-table widening omitted the Claude failure'

  prepare_semantic_fixture "$machine_path_root"
  fixed_home_path="/""home/fixture/.nvm/""versions/node/v22/bin/codex"
  replace_literal_once "$machine_path_root/scripts/check-codex-plugin-smoke.sh" \
    "selected_codex=''" \
    "selected_codex='$fixed_home_path'"
  if run_sync "$machine_path_root" --check > "$machine_path_log" 2>&1; then
    fail 'machine-specific Codex executable path unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$machine_path_log" \
    'Codex runtime selection must not contain a machine- or home-specific executable path'
  pass 'Codex smoke source gate rejects a machine-specific NVM executable path'

  prepare_semantic_fixture "$lookup_root"
  replace_literal_once "$lookup_root/scripts/check-codex-plugin-smoke.sh" \
    'selected_codex="$(type -P -- codex)"' \
    'selected_codex="$(command -v -- codex)"'
  if run_sync "$lookup_root" --check > "$lookup_log" 2>&1; then
    fail 'non-disk-only Codex lookup unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$lookup_log" \
    'Codex runtime selection must use Bash disk-only PATH lookup'
  pass 'Codex smoke source gate rejects a missing disk-only lookup'

  prepare_semantic_fixture "$canonical_exec_root"
  replace_literal_once "$canonical_exec_root/scripts/check-codex-plugin-smoke.sh" \
    '/usr/bin/python3 -c "$fd_closure_exec" "$canonical_codex" "$@"' \
    '/usr/bin/python3 -c "$fd_closure_exec" "$selected_codex" "$@"'
  if run_sync "$canonical_exec_root" --check > "$canonical_exec_log" 2>&1; then
    fail 'Codex execution through the selected alias unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$canonical_exec_log" \
    'Codex runtime wrapper must execute only the canonical executable'
  pass 'Codex smoke source gate rejects execution through the selected alias'

  prepare_semantic_fixture "$inherited_path_root"
  replace_literal_once "$inherited_path_root/scripts/check-codex-plugin-smoke.sh" \
    "PATH='/usr/bin:/bin' \\" \
    'PATH="$PATH" \'
  if run_sync "$inherited_path_root" --check > "$inherited_path_log" 2>&1; then
    fail 'inherited Codex runtime PATH unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$inherited_path_log" \
    'Codex runtime wrapper must use only the fixed system PATH'
  pass 'Codex smoke source gate rejects an inherited runtime PATH'

  prepare_semantic_fixture "$user_path_root"
  replace_literal_once "$user_path_root/scripts/check-codex-plugin-smoke.sh" \
    "PATH='/usr/bin:/bin' \\" \
    "PATH='/opt/codex/bin:/usr/bin:/bin' \\"
  if run_sync "$user_path_root" --check > "$user_path_log" 2>&1; then
    fail 'user Codex runtime PATH unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$user_path_log" \
    'Codex runtime wrapper must use only the fixed system PATH'
  pass 'Codex smoke source gate rejects a user runtime directory in PATH'

  prepare_semantic_fixture "$selected_receipt_root"
  replace_literal_once "$selected_receipt_root/scripts/check-codex-plugin-smoke.sh" \
    'pass "selected Codex entry $selected_codex; canonical executable $canonical_codex; version $observed_version"' \
    'pass "Codex runtime version $observed_version"'
  if run_sync "$selected_receipt_root" --check > "$selected_receipt_log" 2>&1; then
    fail 'Codex receipt without selected and canonical identities unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$selected_receipt_log" \
    'Codex runtime success receipt must name the selected entry and canonical executable'
  pass 'Codex smoke source gate rejects a receipt without selected and canonical identities'

  prepare_semantic_fixture "$version_removed_root"
  replace_literal_once "$version_removed_root/scripts/check-codex-plugin-smoke.sh" \
    'version_output_is_expected "$observed_version"' \
    'version_output_is_ignored "$observed_version"'
  if run_sync "$version_removed_root" --check > "$version_removed_log" 2>&1; then
    fail 'removed Codex exact-version gate unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$version_removed_log" \
    'Codex exact version gate must pass before plugin commands'
  pass 'Codex smoke source gate rejects a removed exact-version gate'

  prepare_semantic_fixture "$version_moved_root"
  swap_literals_once "$version_moved_root/scripts/check-codex-plugin-smoke.sh" \
    'version_output_is_expected "$observed_version"' \
    'run_codex_stage marketplace-add plugin marketplace add'
  if run_sync "$version_moved_root" --check > "$version_moved_log" 2>&1; then
    fail 'Codex exact-version gate moved after a plugin command unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$version_moved_log" \
    'Codex exact version gate must pass before plugin commands'
  pass 'Codex smoke source gate rejects an exact-version gate moved after a plugin command'

  prepare_semantic_fixture "$probe_doc_root"
  replace_literal_once "$probe_doc_root/.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-toolchain/SKILL.md" \
    '`source-precheck` and `source-postcheck` each require exactly' \
    '`source-precheck` and `source-postcheck` may require exactly'
  if run_sync "$probe_doc_root" --check > "$probe_doc_log" 2>&1; then
    fail 'source-probe documentation count mutation unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$probe_doc_log" \
    'Gobbi toolchain must confine four denied local probes to each source-check stage'
}

test_semantic_cowork_forbidden_wrapup_edge() {
  local root="$tmp_root/semantic-cowork-forbidden-wrapup" log="$tmp_root/semantic-cowork-forbidden-wrapup.log"
  local expected='Cowork must not link to the Workflow Wrap-up operation'
  prepare_semantic_fixture "$root"
  printf '\n[Forbidden owner](../wrap-up/SKILL.md)\n' \
    >> "$root/.gobbi/projects/gobbi/skills/cowork/SKILL.md"
  if run_sync "$root" --check > "$log" 2>&1; then
    fail 'Cowork forbidden Wrap-up edge unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$log" "$expected"
  pass "Cowork forbidden owner edge fails with one named diagnostic: $expected"
}

test_semantic_entry_order() {
  local root="$tmp_root/semantic-entry-order" log="$tmp_root/semantic-entry-order.log"
  local path='.gobbi/projects/gobbi/skills/gobbi/SKILL.md'
  local expected='lifecycle entry route must publish the mode TODO, collect the slug and partner pair, then hand off'
  prepare_semantic_fixture "$root"
  swap_literals_once "$root/$path" \
    'After the user selects Cowork or Workflow' \
    'After publishing the mode TODO'
  if run_sync "$root" --check > "$log" 2>&1; then
    fail 'entry-order semantic mutation unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$log" "$expected"
  pass "entry-order rejects one reordered routing edge: $expected"
}

test_semantic_contract_failures() {
  local name path old new expected
  while IFS='^' read -r name path old new expected; do
    [[ -n "$name" ]] || continue
    expect_semantic_failure "$name" "$path" "$old" "$new" "$expected"
  done <<'SEMANTIC_CASES'
entry-general-slug^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^records `slug: not-applicable`^records `slug: omitted`^General entry must record slug: not-applicable
entry-general-identity^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^creates no Gobbi identity^creates one Gobbi identity^General entry must create no Gobbi identity
entry-general-policy^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^General consumes mode and policy without creating^General ignores mode and policy without creating^General owner must consume partner policy without creating session state
gobbi-root-candidates^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^reported path and its parent as the two possible `{gobbi-skills-root}` values^reported path as the only possible `{gobbi-skills-root}` value^Gobbi root resolution must retain both candidates
gobbi-root-sentinels^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^`agents/manager.md`. Each sentinel^`agents/leader.md`. Each sentinel^Gobbi root resolution must retain all three sentinels
gobbi-layout-session-wire^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^projects/*/sessions/^projects/*/session/^Gobbi layout must retain the exact ignore wire values
gobbi-cowork-owner-edge^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^[`../cowork/SKILL.md`](../cowork/SKILL.md)^[`../cowork/SKILL.md`](../workflow/SKILL.md)^Gobbi must hand Cowork to its canonical owner
gobbi-workflow-owner-edge^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^[`../workflow/SKILL.md`](../workflow/SKILL.md)^[`../workflow/SKILL.md`](../cowork/SKILL.md)^Gobbi must hand Workflow to its canonical owner
gobbi-references-entry-load^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Step 1.2 loads Principles, Discussion, and Delegation; selected owners, phases, and task triggers load every^Step 1.2 loads Principles and Discussion; selected owners, phases, and task triggers load every^Gobbi References must match the Principles, Discussion, and Delegation entry load and distributable map boundary
agent-teams-manual-shape^.gobbi/projects/gobbi/skills/gobbi/agent-teams/SKILL.md^### Workflow integration^## Workflow integration^Agent Teams Workflow guidance must remain inside Manual
delegation-result-kind^.gobbi/projects/gobbi/skills/delegation/SKILL.md^MUST name exactly one `result-kind: file | commit | response-only`^MAY omit `result-kind: file | commit | response-only`^Delegation must require exactly one of the three result kinds
delegation-durable-kind^.gobbi/projects/gobbi/skills/delegation/SKILL.md^MUST use `result-kind: file` for durable design and evaluation results.^MAY use `result-kind: response-only` for durable design and evaluation results.^Delegation durable design and evaluation must select file results
delegation-durable-path^.gobbi/projects/gobbi/skills/delegation/SKILL.md^Give the exact caller-named^Give a receiver-selected^Delegation durable design and evaluation must use a caller-named verified file
delegation-printed-substitute^.gobbi/projects/gobbi/skills/delegation/SKILL.md^reject printed content as a substitute for the file^accept printed content as a substitute for the file^Delegation durable design and evaluation must use a caller-named verified file
delegation-commit-contract^.gobbi/projects/gobbi/skills/delegation/SKILL.md^for `commit`, give the branch, assignment-owned paths, commit^for `commit`, omit the branch, paths, and authority^Delegation must preserve intentional commit and response-only result contracts
delegation-response-contract^.gobbi/projects/gobbi/skills/delegation/SKILL.md^for `response-only`, define the response shape and consumer^for `response-only`, accept any printed summary^Delegation must preserve intentional commit and response-only result contracts
cowork-design-small^.gobbi/projects/gobbi/skills/cowork/SKILL.md^including small local choices.^excluding small local choices.^Cowork must classify small structural and vocabulary choices as design
cowork-design-route^.gobbi/projects/gobbi/skills/cowork/SKILL.md^otherwise route through at least Light Ideation.^otherwise use Direct delivery.^Cowork unresolved design must route through at least Light Ideation
cowork-design-local-input^.gobbi/projects/gobbi/skills/cowork/SKILL.md^assign available active-runtime subagents or teammates bounded independent^let the leader work without independent local input^Cowork must assign available local independent design participation
cowork-design-batch^.gobbi/projects/gobbi/skills/cowork/SKILL.md^choices may share one assignment only when every choice is named^choices may be waived or grouped without naming them^Cowork may batch only named minor choices under one synthesizer
cowork-design-writer^.gobbi/projects/gobbi/skills/cowork/SKILL.md^one leader remains the sole writer and^multiple leaders may write and^Cowork may batch only named minor choices under one synthesizer
cowork-design-partner-draft^.gobbi/projects/gobbi/skills/cowork/SKILL.md^for at least one independent^for an optional^Cowork enabled design packages must use Partner draft and cross-review before synthesis
cowork-design-partner-review^.gobbi/projects/gobbi/skills/cowork/SKILL.md^one external cross-review^an optional external cross-review^Cowork enabled design packages must use Partner draft and cross-review before synthesis
cowork-explicit-evaluate^.gobbi/projects/gobbi/skills/cowork/SKILL.md^after an explicit `evaluate` call^without an explicit `evaluate` call^Cowork independent evaluation must remain explicitly user-called
workflow-result-kind^.gobbi/projects/gobbi/skills/workflow/SKILL.md^exactly one `result-kind: file | commit | response-only`.^an optional result kind.^Workflow assignments must name exactly one result kind
workflow-durable-path^.gobbi/projects/gobbi/skills/workflow/SKILL.md^with an exact caller-named^with a receiver-selected^Workflow durable design and evaluation must use a caller-named verified file
workflow-printed-substitute^.gobbi/projects/gobbi/skills/workflow/SKILL.md^A printed response cannot substitute for a promised file or commit.^A printed response may substitute for a promised file or commit.^Workflow must reject printed substitutes for promised files and commits
workflow-design-small^.gobbi/projects/gobbi/skills/workflow/SKILL.md^including small local choices.^excluding small local choices.^Workflow must classify small structural and vocabulary choices as design
workflow-design-local-input^.gobbi/projects/gobbi/skills/workflow/SKILL.md^assign available active-runtime^let the creator proceed without independent local input^Workflow must assign available local independent design participation
workflow-design-batch^.gobbi/projects/gobbi/skills/workflow/SKILL.md^choices may share one assignment only when every choice is named.^choices may be waived or grouped without names.^Workflow may batch only named minor design choices
workflow-design-writer^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Assign one active-runtime creator as the^Assign several active-runtime creators as^Workflow must keep one creator as design writer and synthesizer
workflow-design-partner-draft^.gobbi/projects/gobbi/skills/workflow/SKILL.md^at least one independent Partner draft^an optional Partner draft^Workflow design-bearing WORK must use enabled Partner draft and cross-review while disabled stays local
workflow-design-partner-review^.gobbi/projects/gobbi/skills/workflow/SKILL.md^one Partner cross-review^an optional Partner cross-review^Workflow design-bearing WORK must use enabled Partner draft and cross-review while disabled stays local
workflow-design-disabled^.gobbi/projects/gobbi/skills/workflow/SKILL.md^disabled invokes no external runtime.^disabled may invoke an external runtime.^Workflow design-bearing WORK must use enabled Partner draft and cross-review while disabled stays local
phase1-design-small^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^including small local choices;^excluding small local choices;^Workflow Phase 1 must inventory small structural and vocabulary design choices
phase1-design-local-input^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^Map every design choice to bounded independent read-only evidence, alternatives, or critique from available^Let the leader choose without independent local input^Workflow Phase 1 must map every design choice to local independent participation
phase1-design-batch^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^Related minor choices may share one assignment only when the brief^Related minor choices may be waived or grouped without names^Workflow Phase 1 may batch only named minor choices under one synthesizer
phase1-design-writer^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^the leader remains the sole writer and synthesizer^multiple leaders may write and synthesize concurrently^Workflow Phase 1 may batch only named minor choices under one synthesizer
phase1-design-partner-draft^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^at least one independent Partner draft^an optional Partner draft^Workflow Phase 1 enabled design packages must use Partner draft and cross-review while disabled stays local
phase1-design-partner-review^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^one Partner cross-review^an optional Partner cross-review^Workflow Phase 1 enabled design packages must use Partner draft and cross-review while disabled stays local
phase1-design-disabled^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^disabled invokes no external runtime.^disabled may invoke an external runtime.^Workflow Phase 1 enabled design packages must use Partner draft and cross-review while disabled stays local
slug-privacy^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^warn that the session slug enters branch names and paths^state that the session slug enters branch names and paths^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-case-space-separator-unicode^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Normalize it by taking each maximal ASCII^Normalize it by taking each locale ASCII^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-no-transliteration^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Do not transliterate, truncate^Transliterate, then truncate^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-20-boundary^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Accept only 1–20 characters^Accept only 1–21 characters^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-empty-rejection^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^is empty, longer than 20 characters^is blank, longer than 20 characters^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-over-20-rejection^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^longer than 20 characters^longer than 21 characters^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-reserved-rejection^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^or reserved^or platform-specific^session slug must be privacy-warned, deterministically normalized, and strictly rejected
naming-original-date^.gobbi/projects/gobbi/skills/git/conventions.md^never changes at a context boundary^may change at a context boundary^new session identity must preserve the original UTC date across context boundaries
naming-full-uuid^.gobbi/projects/gobbi/skills/git/conventions.md^full 36-character lowercase hyphenated^short lowercase^new session identity must retain the full UUID
finding-k-separate-derivation^.gobbi/projects/gobbi/skills/git/conventions.md^Derive the branch and leaf separately from the same tuple^Derive the leaf by stripping the branch prefix^new session names must use exact separately derived branch and leaf forms
naming-exact-branch^.gobbi/projects/gobbi/skills/git/conventions.md^branch: <runtime-prefix>-<YYYY-MM-DD>-<slug>-<gobbi-session-uuid>^branch: <YYYY-MM-DD>-<slug>-<gobbi-session-uuid>^new session names must use exact separately derived branch and leaf forms
naming-exact-leaf^.gobbi/projects/gobbi/skills/git/conventions.md^leaf:   <YYYY-MM-DD>-<slug>-<gobbi-session-uuid>^leaf:   <runtime-prefix>-<YYYY-MM-DD>-<slug>-<gobbi-session-uuid>^new session names must use exact separately derived branch and leaf forms
recovery-legacy-retention^.gobbi/projects/gobbi/skills/git/conventions.md^Recovery permanently accepts these legacy formats^Recovery temporarily accepts these legacy formats^new and legacy session formats must remain separately recoverable without migration
recovery-separate-parsers^.gobbi/projects/gobbi/skills/git/conventions.md^Parse new and legacy names with separate validators^Parse new and legacy names with one validator^new and legacy session formats must remain separately recoverable without migration
recovery-no-migration^.gobbi/projects/gobbi/skills/git/SKILL.md^silently migrate a legacy identity^silently migrate an old identity^Git recovery must never migrate a legacy identity
recovery-same-uuid-conflict^.gobbi/projects/gobbi/skills/git/conventions.md^Two different slugs, dates, runtimes, or paths carrying the same UUID are an identity conflict^Two different slugs, dates, runtimes, or paths carrying the same UUID are allowed^same-UUID competing session evidence must fail as an identity conflict
finding-d-recovery-evidence-first^.gobbi/projects/gobbi/skills/git/SKILL.md^take the retained branch or worktree from current caller, session, and registered-worktree^search all branches for a convenient worktree^recovery must use current evidence and ask only for unresolved facts
finding-c-cowork-uuid^.gobbi/projects/gobbi/skills/cowork/SKILL.md^For a fresh identity, generate one full lowercase hyphenated UUID^For a fresh identity, reuse one runtime identifier^Cowork must supply a fresh UUID and original UTC session identity
finding-l-workflow-configuration^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Write `configuration.md` with mode, identity shape, original UTC date^Write `configuration.md` with mode and branch only^Workflow Configuration must record complete identity evidence
workflow-default-cap^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Execution cap defaults to three total passes per task.^Execution cap defaults to two total passes per task.^Workflow must retain the default three-pass Execution cap
workflow-todo-wire^.gobbi/projects/gobbi/skills/workflow/SKILL.md^P2 · Execution^P2 · Execute^Workflow must retain the exact native TODO title grammar
finding-l-memory-root^.gobbi/projects/gobbi/skills/memory/SKILL.md^original UTC session-start date, and exact session root^current date and inferred session root^Memory must validate caller identity against the exact session root
finding-f-partner-one-run^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^One **partner run** is one bounded^One **partner run** is an unbounded^Partner must own one external invocation while callers own local participants and assembly
finding-f-caller-assembly^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^The caller owns local participants, the complete subject, round assembly, policy, acceptance^Partner owns local participants, the complete subject, round assembly, policy, acceptance^Partner must own one external invocation while callers own local participants and assembly
finding-i-temp-captures^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^live in one private runtime-temporary directory outside every project and session root^live in the project session root^Partner captures must remain temporary, outside durable roots, and clean up on every outcome
finding-i-success-cleanup^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^before a successful return or after failure evidence is surfaced^after a successful return only^Partner captures must remain temporary, outside durable roots, and clean up on every outcome
finding-i-failure-cleanup^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^Retain captures only until the exact diagnostic is read and surfaced. Then remove the complete private^Retain captures after the exact diagnostic is read and surfaced. Keep the complete private^Partner failure handling must remove private captures after surfacing evidence
finding-e-cowork-enabled^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Enabled then calls^Enabled then skips^Cowork enabled design packages must use Partner draft and cross-review before synthesis
finding-e-cowork-disabled^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Disabled invokes no external runtime.^Disabled may invoke an external runtime.^Cowork disabled creation must remain local while the manager owns assembly
cowork-fresh-local-evaluator^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Dispatch one fresh isolated active-runtime evaluator.^Reuse the creation writer as evaluator.^Cowork evaluation must use fresh local and enabled external evaluators while preserving disabled behavior
cowork-enabled-external-evaluator^.gobbi/projects/gobbi/skills/cowork/SKILL.md^one fresh isolated external evaluator over the same frozen subject^one external reviewer over the same frozen subject^Cowork evaluation must use fresh local and enabled external evaluators while preserving disabled behavior
workflow-partner-consumption^.gobbi/projects/gobbi/skills/workflow/SKILL.md^MUST apply the recorded session-wide partner policy to every productive step.^MAY ignore the recorded session-wide partner policy for productive steps.^Workflow must consume the recorded partner policy
workflow-disabled-local-matrix^.gobbi/projects/gobbi/skills/workflow/SKILL.md^One assigned active-runtime self-reviewed creator draft plus available bounded local evidence^Any active-runtime draft with no required local evidence^Workflow disabled policy must select local-only participants
workflow-enabled-matrix^.gobbi/projects/gobbi/skills/workflow/SKILL.md^at least one independent draft and one cross-review through Partner^optional external review without Partner^Workflow enabled policy must use Partner while retaining assembly ownership
finding-g-phase2-route^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^[Partner](../../gobbi/partner/SKILL.md); disabled invokes no external runtime.^an external reviewer directly; disabled may invoke an external runtime.^Workflow Phase 2 must consume the parent participant policy for task evaluation
finding-a-severity^.gobbi/projects/gobbi/agents/manager.md^severity is High, Medium, or Low;^severity is any value;^automatic finding correction requires High, Medium, or Low severity
finding-a-blocking^.gobbi/projects/gobbi/agents/manager.md^`blocking: no`;^`blocking: yes|no`;^automatic finding correction requires blocking: no
finding-a-contract^.gobbi/projects/gobbi/agents/manager.md^the correction stays inside the locked contract^the correction may exceed the locked contract^automatic finding correction must remain inside the locked contract
finding-a-reversible^.gobbi/projects/gobbi/agents/manager.md^it is reversible, authority-neutral,^it is irreversible, authority-neutral,^automatic finding correction must be reversible and authority-neutral
finding-a-authority-neutral^.gobbi/projects/gobbi/agents/manager.md^it is reversible, authority-neutral,^it is reversible, authority-expanding,^automatic finding correction must be reversible and authority-neutral
finding-a-nondestructive^.gobbi/projects/gobbi/agents/manager.md^non-destructive, and non-external.^destructive, and non-external.^automatic finding correction must be non-destructive and non-external
finding-a-nonexternal^.gobbi/projects/gobbi/agents/manager.md^non-destructive, and non-external.^non-destructive, and external.^automatic finding correction must be non-destructive and non-external
finding-a-user-boundary^.gobbi/projects/gobbi/agents/manager.md^Present every Critical,^Automatically apply every Critical,^every finding outside the automatic predicate must return to the user
finding-a-fresh-evaluation^.gobbi/projects/gobbi/agents/manager.md^Require a fresh evaluation after the correction.^Reuse prior evaluation after the correction.^every automatic correction must receive fresh evaluation
finding-a-pass-only^.gobbi/projects/gobbi/agents/manager.md^Only a verified PASS continues automatically.^PASS or REVISE continues automatically.^only a verified PASS may continue automatically
workflow-gobbi-owner-edge^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Gobbi's [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate)^Workflow's local finding gate^Workflow must consume the Gobbi finding gate through its canonical owner edge
gobbi-owner-inside-contract^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^it remains^it may not remain^Gobbi must own the complete session-wide finding predicate
gobbi-owner-user-boundary^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Send every other finding to the user for accept, reject, or defer disposition.^Correct every other finding automatically.^Gobbi finding gate must retain user disposition, fresh evaluation, and PASS-only continuation
gobbi-owner-fresh-evaluation^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Every correction requires^Every correction skips^Gobbi finding gate must retain user disposition, fresh evaluation, and PASS-only continuation
gobbi-owner-pass-only^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^only a verified PASS continues automatically.^PASS or REVISE continues automatically.^Gobbi finding gate must retain user disposition, fresh evaluation, and PASS-only continuation
cowork-gobbi-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Apply Gobbi's [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate).^Apply Workflow's [session-wide finding gate](../workflow/SKILL.md#14-apply-the-session-wide-finding-gate).^Cowork must consume the Gobbi finding gate through its canonical owner edge
cowork-git-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Git](../git/SKILL.md) | Owns identity and isolation validation^[Git](../git/SKILL.md) | Merely describes identity and isolation validation^Cowork must name Git as its mechanism owner
cowork-memory-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Memory](../memory/SKILL.md) | Owns session identity and containment validation^[Memory](../memory/SKILL.md) | Merely describes session identity and containment validation^Cowork must name Memory as its mechanism owner
cowork-delegation-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Delegation](../delegation/SKILL.md) | Owns the base specialist brief^[Delegation](../delegation/SKILL.md) | Merely describes the base specialist brief^Cowork must name Delegation as its mechanism owner
cowork-partner-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Partner](../gobbi/partner/SKILL.md) | Owns each enabled external invocation and frozen return^[Partner](../gobbi/partner/SKILL.md) | Merely describes each enabled external invocation and frozen return^Cowork must name Partner as its invocation owner
cowork-evaluation-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Evaluation](../evaluation/SKILL.md) | Owns each complete evaluator report^[Evaluation](../evaluation/SKILL.md) | Merely describes each complete evaluator report^Cowork must name Evaluation as its report owner
workflow-shared-cycle^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Each phase child invokes this cycle with a local role^Each phase child invents its own cycle with a local role^Workflow must own the shared productive-step contract
workflow-assignment-owner-anchor^.gobbi/projects/gobbi/skills/workflow/SKILL.md^#### 1.3 Build and accept specialist assignments^#### 1.3 Build specialist assignments^Workflow must retain the stable Step 1.3 assignment owner anchor
workflow-fast-gate^.gobbi/projects/gobbi/skills/workflow/SKILL.md^A fast gate applies to Ideation, Planning, and Wrap-up with two total iterations.^A fast gate applies only to Ideation with three total iterations.^Workflow must own the fast two-iteration gate
workflow-normal-gate^.gobbi/projects/gobbi/skills/workflow/SKILL.md^A normal gate applies to each Execution task with its configured cap.^A fast gate applies to each Execution task with two passes.^Workflow must own the normal aggregate gate and configured cap
workflow-gate-schema^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Each `gate.md` records mode, partner policy, required participants^Each `gate.md` records only mode and decision^Workflow must own the exact gate schema
workflow-record-schema^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Each `record/iteration-N.md` contains only exact TODO and decision^Each `record/iteration-N.md` contains a free-form summary^Workflow must own the exact RECORD receipt schema
phase1-parent-edge^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^The parent remains loaded^The parent may be unloaded^phase-1/SKILL.md must declare the parent precondition
phase1-shared-cycle^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^Invoke [parent Step 1.4](../SKILL.md#14-apply-the-shared-productive-step-cycle) with local role `leader`^Run a standalone cycle with local role `leader`^Workflow Phase 1 must consume the shared cycle as an Ideation adapter
phase1-gobbi-route^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^Apply Gobbi's finding gate through the parent; only PASS continues.^Apply a local finding gate; REVISE continues.^phase-1/SKILL.md must consume the Gobbi finding gate through Workflow
phase2-parent-edge^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^The parent remains loaded^The parent may be unloaded^phase-2/SKILL.md must declare the parent precondition
phase2-shared-cycle^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^Invoke [parent Step 1.4](../SKILL.md#14-apply-the-shared-productive-step-cycle) with local role `leader`^Run a standalone cycle with local role `leader`^Workflow Phase 2 must consume the shared cycle as a Planning adapter
phase2-gobbi-route^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^Apply Gobbi's finding gate through the parent; only^Apply a local finding gate; REVISE may^phase-2/SKILL.md must consume the Gobbi finding gate through Workflow
phase3-parent-edge^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^The parent remains loaded^The parent may be unloaded^phase-3/SKILL.md must declare the parent precondition
phase3-parent-gate^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^Apply the parent fast gate and RECORD schema.^Apply a local gate and receipt schema.^Workflow Phase 3 must consume the parent gate and record contracts
phase2-replay-safety^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^NEVER replay a possibly side-effecting operation until its prior effect is proved absent or safely^Replay a possibly side-effecting operation without checking whether its prior effect is safely^Workflow Phase 2 must retain side-effect replay safety
phase3-pre-git-boundary^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^MUST prohibit Git finalization before EVALUATION and RECORD accept the frozen pre-Git tree.^MAY finalize Git before the frozen closure is recorded.^Workflow Phase 3 must prohibit Git before the frozen closure passes RECORD
phase3-tree-invalidation^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^Require the current tracked tree to equal the evaluated^Allow the current tracked tree to differ from the evaluated^Workflow Phase 3 must invalidate PASS when the pre-Git tree changes
phase3-gobbi-route^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^Apply Gobbi's finding gate through the parent; only PASS^Apply a local finding gate; REVISE may^phase-3/SKILL.md must consume the Gobbi finding gate through Workflow
phase3-wrapup-owner^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^[Wrap-up](../../wrap-up/SKILL.md) owns Memory-to-Git order^[Wrap-up](../../wrap-up/SKILL.md) merely describes Memory-to-Git order^Workflow Phase 3 must name Wrap-up as the closure mechanism owner
phase3-handoff-owner^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^[Wrap-up handoff](../../wrap-up/handoff.md) owns the tracked report and display-only Git receipt schemas.^Phase 3 owns the tracked report and display-only Git receipt schemas.^Workflow Phase 3 must name handoff.md as the terminal schema owner
finding-b-cowork-memory^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Apply [Memory](../memory/SKILL.md) directly^Apply [Memory](../memory/SKILL.md) indirectly^Cowork closure must apply Memory directly without Workflow closure state
finding-b-cowork-no-workflow-evidence^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Never create Workflow-formatted TODOs^Always create Workflow-formatted TODOs^Cowork closure must forbid Workflow evidence
finding-b-cowork-conversation^.gobbi/projects/gobbi/skills/cowork/SKILL.md^returns a conversation-only handoff^returns a tracked handoff^Cowork closure must return only a conversation handoff
workflow-durable-wrapup^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Wrap-up displays the immutable tracked handoff^Workflow returns a conversation-only summary^Workflow closure must retain durable Wrap-up and a tracked handoff
finding-h-assistant-mode^.gobbi/projects/gobbi/agents/assistant.md^**Cowork Memory mode** enters only from an explicit Cowork closure assignment^**Cowork Memory mode** enters without an assignment^assignment-authorized assistant must support Cowork direct-Memory closure only
finding-h-assistant-boundary^.gobbi/projects/gobbi/agents/assistant.md^Never load Wrap-up, create Workflow receipts or a tracked handoff^Load Wrap-up, create Workflow receipts and a tracked handoff^assignment-authorized assistant must support Cowork direct-Memory closure only
finding-h-git-writer^.gobbi/projects/gobbi/skills/git/SKILL.md^assignment-named writer role, including an assistant^manager role only^Git must authorize an assignment-named assistant writer
gobbi-dev-toolchain-selective-trace^.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-toolchain/SKILL.md^Local `socketpair(AF_UNIX)` remains available.^Local `socketpair(AF_UNIX)` is denied.^Gobbi toolchain must define selective trace, single-stage execution, and separate whole-smoke recovery
gobbi-dev-deployment-stage-once^.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-deployment/SKILL.md^Invoke each runtime stage once.^Invoke each runtime stage twice.^Gobbi deployment must distinguish local IPC, one-run stages, and separately authorized recovery
gobbi-dev-deployment-recovery-checklist^.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-deployment/checklists.md^No failed runtime stage was replayed.^A failed runtime stage was replayed.^Gobbi deployment checklist must require selective trace evidence and separately authorized recovery
SEMANTIC_CASES
}

test_semantic_permissions() {
  local permission label safe
  while IFS='^' read -r permission label; do
    [[ -n "$permission" ]] || continue
    safe="${permission//[^a-zA-Z0-9]/-}"
    expect_semantic_failure "finding-j-permission-$safe" '.claude/settings.json' \
      "\"$permission\"" "\"$permission-disabled\"" "$label"
  done <<'PERMISSION_CASES'
Skill(cowork)^Claude settings must explicitly allow Skill(cowork)
Skill(gobbi:partner)^Claude settings must explicitly allow Skill(gobbi:partner)
Skill(workflow:phase-1)^Claude settings must explicitly allow Skill(workflow:phase-1)
Skill(workflow:phase-2)^Claude settings must explicitly allow Skill(workflow:phase-2)
Skill(workflow:phase-3)^Claude settings must explicitly allow Skill(workflow:phase-3)
Agent(manager)^Claude settings must explicitly allow Agent(manager)
Agent(leader)^Claude settings must explicitly allow Agent(leader)
Agent(executor)^Claude settings must explicitly allow Agent(executor)
Agent(evaluator)^Claude settings must explicitly allow Agent(evaluator)
Agent(assistant)^Claude settings must explicitly allow Agent(assistant)
PERMISSION_CASES
}

test_safe_reconciliation() {
  local root="$tmp_root/safe" first="$tmp_root/safe.first" second="$tmp_root/safe.second"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  write_skill_file "$root" alpha workflow/current.md '# Current'
  write_skill_file "$root" beta SKILL.md '# Beta'
  run_sync "$root" --materialize-package >/dev/null

  make_owned_mirror_link "$root" alpha SKILL.md
  make_owned_mirror_link "$root" alpha removed.md
  make_owned_mirror_link "$root" alpha old/nested/removed.md
  make_owned_mirror_link "$root" retired SKILL.md
  make_owned_mirror_link "$root" retired deep/old.md
  ln -s '../../.gobbi/projects/gobbi/skills/retired' "$root/.agents/skills/retired"

  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  [[ -L "$root/.claude/skills/alpha/workflow/current.md" ]] || fail 'missing expected nested link was not created'
  [[ -L "$root/.claude/skills/beta/SKILL.md" ]] || fail 'missing expected skill mirror was not created'
  [[ ! -e "$root/.claude/skills/alpha/removed.md" && ! -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'dangling stale owned leaf survived'
  [[ ! -e "$root/.claude/skills/alpha/old" ]] || fail 'nested stale real directories survived'
  [[ ! -e "$root/.claude/skills/retired" ]] || fail 'whole stale skill directory survived'
  [[ ! -e "$root/.agents/skills/retired" && ! -L "$root/.agents/skills/retired" ]] || fail 'stale Codex discovery link survived'

  snapshot_mirror "$root" "$first"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$second"
  cmp -s "$first" "$second" || fail 'second safe sync was not idempotent'
  pass 'safe reconciliation prunes stale owned leaves and dirs, fills gaps, and is idempotent'
}

test_canonical_skill_deletion() {
  local root="$tmp_root/canonical-skill-deletion"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  write_skill_file "$root" record SKILL.md '# Record'

  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" >/dev/null
  [[ -L "$root/.agents/skills/record" ]] || fail 'precondition missing Codex record discovery link'
  [[ -L "$root/.claude/skills/record/SKILL.md" ]] || fail 'precondition missing Claude record discovery link'
  [[ -f "$root/plugins/gobbi/skills/record/SKILL.md" ]] || fail 'precondition missing generated record skill'

  find "$root/.gobbi/projects/gobbi/skills/record" -depth -mindepth 1 -delete
  rmdir "$root/.gobbi/projects/gobbi/skills/record"
  run_sync "$root" >/dev/null
  [[ ! -e "$root/.agents/skills/record" && ! -L "$root/.agents/skills/record" ]] \
    || fail 'canonical deletion left the Codex record discovery link'
  [[ ! -e "$root/.claude/skills/record" ]] || fail 'canonical deletion left the Claude record discovery tree'
  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" --check >/dev/null
  [[ ! -e "$root/plugins/gobbi/skills/record" ]] || fail 'materialization recreated deleted record content'
  [[ -f "$root/plugins/gobbi/skills/alpha/SKILL.md" ]] || fail 'materialization lost surviving nested skill content'
  pass 'canonical skill deletion prunes both runtime mirrors and generated package content'
}

test_unsafe_agents_entry() {
  local root="$tmp_root/unsafe-agents-entry" log="$tmp_root/unsafe-agents-entry.log"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  printf 'user data\n' > "$root/.agents/skills/user-owned"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'unsafe-agents-entry unexpectedly succeeded'
  fi
  assert_file_contains "$log" '.agents/skills/user-owned'
  assert_file_contains "$log" 'has no canonical skill and is not a generator-owned symlink'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'Claude mirror mutated before unsafe Codex discovery entry rejection'
  pass 'unsafe Codex discovery entries fail closed before mirror mutation'
}

test_unsafe_agents_wrong_target() {
  local root="$tmp_root/unsafe-agents-wrong-target" log="$tmp_root/unsafe-agents-wrong-target.log"
  local unsafe_link="$root/.agents/skills/user-owned-link"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  ln -s '../../user-owned-target' "$unsafe_link"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'unsafe-agents-wrong-target unexpectedly succeeded'
  fi
  assert_file_contains "$log" '.agents/skills/user-owned-link'
  assert_file_contains "$log" 'raw symlink target is ../../user-owned-target'
  [[ -L "$unsafe_link" ]] || fail 'wrong-target Codex discovery symlink was deleted'
  [[ "$(readlink -- "$unsafe_link")" == '../../user-owned-target' ]] || fail 'wrong-target Codex discovery symlink was changed'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'Claude mirror mutated before wrong-target Codex discovery rejection'
  pass 'wrong-target Codex discovery symlinks fail closed before mirror mutation'
}

test_unsafe_agents_trailing_newline_target() {
  local root="$tmp_root/unsafe-agents-trailing-newline" log="$tmp_root/unsafe-agents-trailing-newline.log"
  local unsafe_link="$root/.agents/skills/newline-wrong-target"
  local expected_target='../../.gobbi/projects/gobbi/skills/newline-wrong-target'
  local before_target="$tmp_root/unsafe-agents-trailing-newline.before"
  local after_target="$tmp_root/unsafe-agents-trailing-newline.after"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  ln -s "$expected_target"$'\n' "$unsafe_link"
  readlink -n -- "$unsafe_link" > "$before_target"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'unsafe-agents-trailing-newline unexpectedly succeeded'
  fi
  assert_file_contains "$log" '.agents/skills/newline-wrong-target'
  assert_file_contains "$log" 'raw symlink target is'
  [[ -L "$unsafe_link" ]] || fail 'trailing-newline Codex discovery symlink was deleted'
  readlink -n -- "$unsafe_link" > "$after_target"
  cmp -s "$before_target" "$after_target" || fail 'trailing-newline Codex discovery target bytes changed'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'Claude mirror mutated before trailing-newline Codex discovery rejection'
  pass 'trailing-newline Codex discovery targets fail closed byte-for-byte'
}

test_unsafe_agents_dot_entry() {
  local root="$tmp_root/unsafe-agents-dot-entry" log="$tmp_root/unsafe-agents-dot-entry.log"
  local unsafe_entry="$root/.agents/skills/.user-owned"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  printf 'user data\n' > "$unsafe_entry"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'unsafe-agents-dot-entry unexpectedly succeeded'
  fi
  assert_file_contains "$log" '.agents/skills/.user-owned'
  assert_file_contains "$log" 'path contains a dot-prefixed or traversal component'
  [[ -f "$unsafe_entry" ]] || fail 'hidden Codex discovery entry was deleted'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'Claude mirror mutated before hidden Codex discovery rejection'
  pass 'hidden Codex discovery entries fail closed before mirror mutation'
}

test_unsafe_regular_file() {
  local root="$tmp_root/unsafe-regular"
  prepare_synced_fixture "$root"
  printf 'user data\n' > "$root/.claude/skills/alpha/user.txt"
  assert_unsafe_zero_mutation unsafe-regular "$root" 'regular files are never generator-owned mirror leaves'
}

test_unsafe_wrong_target() {
  local root="$tmp_root/unsafe-wrong-target"
  prepare_synced_fixture "$root"
  ln -s '../../../.gobbi/projects/gobbi/skills/alpha/not-the-same.md' "$root/.claude/skills/alpha/wrong.md"
  assert_unsafe_zero_mutation unsafe-wrong-target "$root" 'raw symlink target is'
}

test_unsafe_claude_trailing_newline_target() {
  local root="$tmp_root/unsafe-claude-trailing-newline"
  local unsafe_link="$root/.claude/skills/alpha/newline.md"
  local expected_target
  prepare_synced_fixture "$root"
  expected_target="$(mirror_target alpha newline.md)"
  ln -s "$expected_target"$'\n' "$unsafe_link"
  assert_unsafe_zero_mutation unsafe-claude-trailing-newline "$root" 'raw symlink target is'
}

test_unsafe_directory_symlink() {
  local root="$tmp_root/unsafe-directory-symlink"
  prepare_synced_fixture "$root"
  mkdir -p "$root/outside-dir"
  ln -s '../../../outside-dir' "$root/.claude/skills/alpha/dir-link"
  assert_unsafe_zero_mutation unsafe-directory-symlink "$root" 'directory symlinks are forbidden'
}

test_unsafe_dot_entry() {
  local root="$tmp_root/unsafe-dot-entry"
  prepare_synced_fixture "$root"
  mkdir -p "$root/.claude/skills/alpha/.protected"
  printf 'hidden\n' > "$root/.claude/skills/alpha/.protected/data"
  assert_unsafe_zero_mutation unsafe-dot-entry "$root" 'path contains a dot-prefixed or traversal component'
}

test_unsafe_path_escape() {
  local root="$tmp_root/unsafe-path-escape"
  prepare_synced_fixture "$root"
  ln -s '../../../../outside-file' "$root/.claude/skills/alpha/escape.md"
  assert_unsafe_zero_mutation unsafe-path-escape "$root" 'symlink target escapes the generator-owned canonical root'
}

test_mixed_safe_and_unsafe() {
  local root="$tmp_root/mixed-safe-unsafe"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  printf 'user data\n' > "$root/.claude/skills/alpha/user.txt"
  assert_unsafe_zero_mutation mixed-safe-unsafe "$root" 'regular files are never generator-owned mirror leaves'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'safe stale leaf was removed despite a mixed unsafe preflight'
}

test_forward_and_back_rollback() {
  local root="$tmp_root/rollback" initial="$tmp_root/rollback.initial" restored="$tmp_root/rollback.restored"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  write_skill_file "$root" alpha templates/shared.md '# Shared'
  write_skill_file "$root" orchestration SKILL.md '# Orchestration'
  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$initial"

  mkdir -p "$root/.gobbi/projects/gobbi/skills/orchestration/templates"
  mv "$root/.gobbi/projects/gobbi/skills/alpha/templates/shared.md" \
    "$root/.gobbi/projects/gobbi/skills/orchestration/templates/shared.md"
  rmdir "$root/.gobbi/projects/gobbi/skills/alpha/templates"
  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  [[ ! -e "$root/.claude/skills/alpha/templates" ]] || fail 'forward owner move left the old mirror path'
  [[ -L "$root/.claude/skills/orchestration/templates/shared.md" ]] || fail 'forward owner move did not create the new mirror path'

  mkdir -p "$root/.gobbi/projects/gobbi/skills/alpha/templates"
  mv "$root/.gobbi/projects/gobbi/skills/orchestration/templates/shared.md" \
    "$root/.gobbi/projects/gobbi/skills/alpha/templates/shared.md"
  rmdir "$root/.gobbi/projects/gobbi/skills/orchestration/templates"
  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$restored"
  cmp -s "$initial" "$restored" || fail 'forward/back rollback did not restore the original derived mirror'
  pass 'forward and backward owner moves converge without hand-editing aliases'
}

build_scale_fixture() {
  local root="$1" count="$2" i
  make_fixture "$root"
  write_skill_file "$root" scale SKILL.md '# Scale'
  for ((i = 1; i <= count; i++)); do
    write_skill_file "$root" scale "nested/file-$i.md" "file $i"
  done
}

metric_value() {
  local path="$1" key="$2"
  awk -F= -v wanted="$key" '$1 == wanted { print $2 }' "$path"
}

test_bounded_walks() {
  local small_root="$tmp_root/scale-small" large_root="$tmp_root/scale-large"
  local small_metrics="$tmp_root/scale-small.metrics" large_metrics="$tmp_root/scale-large.metrics"
  local small_inspected large_inspected
  build_scale_fixture "$small_root" 40
  build_scale_fixture "$large_root" 80

  GOBBI_SYNC_REPO_ROOT="$small_root" GOBBI_SYNC_METRICS_FILE="$small_metrics" bash "$sync_script" >/dev/null
  GOBBI_SYNC_REPO_ROOT="$large_root" GOBBI_SYNC_METRICS_FILE="$large_metrics" bash "$sync_script" >/dev/null
  [[ "$(metric_value "$small_metrics" canonical_walks)" == 1 ]] || fail 'small fixture did not use one canonical full-tree walk'
  [[ "$(metric_value "$small_metrics" mirror_walks)" == 1 ]] || fail 'small fixture did not use one mirror full-tree walk'
  [[ "$(metric_value "$large_metrics" canonical_walks)" == 1 ]] || fail 'large fixture did not use one canonical full-tree walk'
  [[ "$(metric_value "$large_metrics" mirror_walks)" == 1 ]] || fail 'large fixture did not use one mirror full-tree walk'
  small_inspected="$(metric_value "$small_metrics" inspected_entries)"
  large_inspected="$(metric_value "$large_metrics" inspected_entries)"
  ((large_inspected > small_inspected)) || fail 'doubling the fixture did not increase inspected entries'
  ((large_inspected <= small_inspected * 2 + 4)) || fail 'doubling the fixture caused super-proportional inspection work'
  pass 'whole-tree walks stay constant and doubled input grows inspected entries proportionally'
}

test_hook_component_rejection() {
  local root="$tmp_root/hook-component" log="$tmp_root/hook-component.log"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  mkdir -p "$root/.gobbi/projects/gobbi/hooks"
  printf '#!/usr/bin/env bash\n' > "$root/.gobbi/projects/gobbi/hooks/injected.sh"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'normal sync accepted an injected canonical hook component'
  fi
  assert_file_contains "$log" '.gobbi/projects/gobbi/hooks contains a forbidden hook component'
  [[ ! -e "$root/plugins/gobbi/hooks" && ! -L "$root/plugins/gobbi/hooks" ]] || fail 'failed sync recreated plugins/gobbi/hooks'
  [[ ! -e "$root/.claude/hooks" ]] || fail 'failed sync recreated .claude/hooks'

  if run_sync "$root" --check > "$log" 2>&1; then
    fail 'sync --check accepted an injected canonical hook component'
  fi
  assert_file_contains "$log" '.gobbi/projects/gobbi/hooks contains a forbidden hook component'
  pass 'normal sync and --check reject injected hooks before mutation'
}

test_manifest_hook_rejection() {
  local root="$tmp_root/manifest-hook" manifest temp log="$tmp_root/manifest-hook.log"
  prepare_synced_fixture "$root"
  manifest="$root/plugins/gobbi/.codex-plugin/plugin.json"
  temp="$manifest.tmp"
  jq '.hooks = "./hooks/injected.json"' "$manifest" > "$temp"
  mv "$temp" "$manifest"

  if run_sync "$root" --check > "$log" 2>&1; then
    fail 'sync --check accepted a Codex hooks manifest field'
  fi
  assert_file_contains "$log" 'Codex manifest must declare only the canonical skills component and no hook or agent component'
  [[ ! -e "$root/plugins/gobbi/hooks" && ! -L "$root/plugins/gobbi/hooks" ]] || fail 'manifest rejection recreated plugins/gobbi/hooks'
  pass 'sync rejects a manifest-declared hook component'
}

test_marketplace_and_role_contracts() {
  local market_root="$tmp_root/wrong-marketplace" role_root="$tmp_root/missing-role" temp log

  make_fixture "$market_root"
  write_skill_file "$market_root" alpha SKILL.md '# Alpha'
  temp="$market_root/.agents/plugins/marketplace.json.tmp"
  jq '(.plugins[] | select(.name == "gobbi") | .source.path) = "./wrong"' \
    "$market_root/.agents/plugins/marketplace.json" > "$temp"
  mv "$temp" "$market_root/.agents/plugins/marketplace.json"
  log="$tmp_root/wrong-marketplace.log"
  if run_sync "$market_root" --check > "$log" 2>&1; then
    fail 'sync --check accepted the wrong Codex marketplace source path'
  fi
  assert_file_contains "$log" 'Codex marketplace must contain one local gobbi entry pointing at ./plugins/gobbi'

  make_fixture "$role_root"
  write_skill_file "$role_root" alpha SKILL.md '# Alpha'
  rm -f "$role_root/.codex/agents/evaluator.toml"
  log="$tmp_root/missing-role.log"
  if run_sync "$role_root" --check > "$log" 2>&1; then
    fail 'sync --check accepted a missing Codex evaluator wrapper'
  fi
  assert_file_contains "$log" '.codex/agents/evaluator.toml is not a symlink'
  pass 'sync source topology rejects marketplace and role-wrapper drift'
}

assert_entrypoint_source_zero_mutation() {
  local name="$1" root="$2" expected="$3"
  local mode before after log
  for mode in sync check; do
    before="$tmp_root/$name.entry.$mode.before"
    after="$tmp_root/$name.entry.$mode.after"
    log="$tmp_root/$name.entry.$mode.log"
    snapshot_owned_surfaces "$root" "$before"
    if run_entrypoint_sync "$root" "--$mode" > "$log" 2>&1; then
      fail "$name entrypoint source unexpectedly succeeded in $mode mode"
    fi
    snapshot_owned_surfaces "$root" "$after"
    cmp -s "$before" "$after" || fail "$name changed an owned surface before $mode rejection"
    assert_file_contains "$log" "$expected"
  done
}

test_exact_family_frontmatter_contracts() {
  local root

  root="$tmp_root/family-root-description-drift"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'MUST load before realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs; collecting exact-revision test evidence for Gobbi;' \
    'MUST load before collecting exact-revision test evidence for Gobbi; realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs;'
  assert_owner_failure_zero_mutation family-root-description-drift "$root" \
    'source topology: .gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md must preserve the exact accepted root description'
  assert_entrypoint_source_zero_mutation family-root-description-drift "$root" \
    '.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md must preserve the exact accepted root description'

  root="$tmp_root/family-root-description-quote-drift"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" 'description: "' 'description: '
  assert_owner_failure_zero_mutation family-root-description-quote-drift "$root" \
    'source topology: .gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md must preserve the exact accepted root description'
  assert_entrypoint_source_zero_mutation family-root-description-quote-drift "$root" \
    '.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md must preserve the exact accepted root description'

  root="$tmp_root/family-development-tools-drift"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-development/SKILL.md" \
    'allowed-tools: Read, Grep, Glob, Bash' 'allowed-tools: Read, Grep, Glob, Bash, Write, Edit'
  assert_owner_failure_zero_mutation family-development-tools-drift "$root" \
    'source topology: .gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-development/SKILL.md must declare allowed-tools: Read, Grep, Glob, Bash'
  assert_entrypoint_source_zero_mutation family-development-tools-drift "$root" \
    '.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-development/SKILL.md must declare allowed-tools: Read, Grep, Glob, Bash'

  root="$tmp_root/family-root-tools-drift"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'allowed-tools: Read' 'allowed-tools: Read, Grep'
  assert_owner_failure_zero_mutation family-root-tools-drift "$root" \
    'source topology: .gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md must declare allowed-tools: Read'
  assert_entrypoint_source_zero_mutation family-root-tools-drift "$root" \
    '.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md must declare allowed-tools: Read'

  root="$tmp_root/family-coordinated-child-description-drift"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-development/SKILL.md" \
    'MUST load when realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs.' \
    'MUST load when implementing an accepted Gobbi change and handing it off.'
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'MUST load when realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs.' \
    'MUST load when implementing an accepted Gobbi change and handing it off.'
  assert_owner_failure_zero_mutation family-coordinated-child-description-drift "$root" \
    'source topology: .gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-development/SKILL.md must preserve the exact accepted description'
  assert_entrypoint_source_zero_mutation family-coordinated-child-description-drift "$root" \
    '.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-development/SKILL.md must preserve the exact accepted description'
}

test_runtime_entrypoint_contract() {
  local positive_root="$tmp_root/entrypoint-positive"
  local codex_root="$tmp_root/extra-codex-contract" claude_root="$tmp_root/extra-claude-contract"
  local missing_root="$tmp_root/entrypoint-missing-owner" tampered_root="$tmp_root/entrypoint-tampered-owner"
  local principles_root root_spoof duplicate_root child_drift row_reordered row_extra row_trailing
  local agents_missing agents_regular agents_wrong agents_dangling root_skill first_row second_row
  local before after log marker_line route_line route_count literal_count
  local expected='runtime entrypoints must contain canonical generated Principles and the repository-local route'

  make_fixture "$positive_root"
  printf 'stale\n' > "$positive_root/.codex/AGENTS.md"
  printf 'other stale\n' > "$positive_root/.claude/CLAUDE.md"
  run_entrypoint_sync "$positive_root" --sync >/dev/null
  run_entrypoint_sync "$positive_root" --check >/dev/null
  cmp -s "$positive_root/.codex/AGENTS.md" "$positive_root/.claude/CLAUDE.md" \
    || fail 'runtime entrypoint generator produced different native bytes'
  [[ "$(readlink -- "$positive_root/AGENTS.md")" == '.codex/AGENTS.md' ]] \
    || fail 'runtime entrypoint sync changed the root AGENTS.md target'
  route_count="$(grep -c '^## Repository-local Gobbi development lifecycle$' "$positive_root/.codex/AGENTS.md")"
  literal_count="$(grep -Fc '.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md' "$positive_root/.codex/AGENTS.md")"
  marker_line="$(grep -n '^<!-- END GENERATED PRINCIPLES -->$' "$positive_root/.codex/AGENTS.md" | cut -d: -f1)"
  route_line="$(grep -n '^## Repository-local Gobbi development lifecycle$' "$positive_root/.codex/AGENTS.md" | cut -d: -f1)"
  [[ "$route_count" -eq 1 && "$literal_count" -eq 1 && "$route_line" -gt "$marker_line" ]] \
    || fail 'runtime entrypoint route is not unique and ordered after generated Principles'

  prepare_semantic_fixture "$codex_root"
  printf '\nGobbi runtime contract must not live in this generated entrypoint.\n' \
    >> "$codex_root/.codex/AGENTS.md"
  log="$tmp_root/extra-codex-contract.log"
  if run_sync "$codex_root" --check > "$log" 2>&1; then
    fail 'sync --check accepted extra Codex runtime contract content'
  fi
  assert_only_semantic_failure "$log" "$expected"

  prepare_semantic_fixture "$claude_root"
  printf '\nGobbi runtime contract must not live in this generated entrypoint.\n' \
    >> "$claude_root/.claude/CLAUDE.md"
  log="$tmp_root/extra-claude-contract.log"
  if run_sync "$claude_root" --check > "$log" 2>&1; then
    fail 'sync --check accepted extra Claude runtime contract content'
  fi
  assert_only_semantic_failure "$log" "$expected"

  make_fixture "$missing_root"
  before="$tmp_root/entrypoint-missing.before"
  after="$tmp_root/entrypoint-missing.after"
  snapshot_owned_surfaces "$missing_root" "$before"
  find "$missing_root/.gobbi/projects/gobbi/skills/gobbi-dev" -depth -mindepth 1 -delete
  rmdir "$missing_root/.gobbi/projects/gobbi/skills/gobbi-dev"
  log="$tmp_root/entrypoint-missing.log"
  if run_entrypoint_sync "$missing_root" --sync > "$log" 2>&1; then
    fail 'entrypoint sync accepted a missing family owner'
  fi
  snapshot_owned_surfaces "$missing_root" "$after"
  cmp -s "$before" "$after" || fail 'entrypoint sync mutated native targets for a missing family owner'
  assert_file_contains "$log" 'gobbi-dev must be a real directory'

  make_fixture "$tampered_root"
  before="$tmp_root/entrypoint-tampered.before"
  after="$tmp_root/entrypoint-tampered.after"
  snapshot_owned_surfaces "$tampered_root" "$before"
  replace_literal_once "$tampered_root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'skill-type: domain' 'skill-type: operation'
  log="$tmp_root/entrypoint-tampered.log"
  if run_entrypoint_sync "$tampered_root" --sync > "$log" 2>&1; then
    fail 'entrypoint sync accepted a mistyped family owner'
  fi
  snapshot_owned_surfaces "$tampered_root" "$after"
  cmp -s "$before" "$after" || fail 'entrypoint sync mutated native targets for a mistyped family owner'
  assert_file_contains "$log" 'must declare skill-type: domain'

  principles_root="$tmp_root/entrypoint-malformed-principles"
  make_fixture "$principles_root"
  replace_literal_once "$principles_root/.gobbi/projects/gobbi/skills/principles/SKILL.md" '---' 'not-frontmatter'
  assert_entrypoint_source_zero_mutation entrypoint-malformed-principles "$principles_root" 'must declare name: principles'

  root_spoof="$tmp_root/entrypoint-root-body-spoof"
  make_fixture "$root_spoof"
  replace_literal_once "$root_spoof/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'name: gobbi-dev' 'owner-name: missing'
  printf '\nname: gobbi-dev\n' >> "$root_spoof/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  assert_entrypoint_source_zero_mutation entrypoint-root-body-spoof "$root_spoof" 'must declare name: gobbi-dev'

  duplicate_root="$tmp_root/entrypoint-root-duplicate"
  make_fixture "$duplicate_root"
  replace_literal_once "$duplicate_root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'skill-type: domain' $'skill-type: domain\nskill-type: domain'
  assert_entrypoint_source_zero_mutation entrypoint-root-duplicate "$duplicate_root" 'must declare skill-type: domain'

  child_drift="$tmp_root/entrypoint-child-drift"
  make_fixture "$child_drift"
  replace_literal_once "$child_drift/.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-testing/SKILL.md" \
    'MUST load when collecting exact-revision test evidence for Gobbi.' \
    'MUST load when collecting changed test evidence for Gobbi.'
  assert_entrypoint_source_zero_mutation entrypoint-child-drift "$child_drift" \
    'gobbi-dev-testing/SKILL.md must preserve the exact accepted description'

  row_reordered="$tmp_root/entrypoint-row-reordered"
  make_fixture "$row_reordered"
  root_skill="$row_reordered/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  first_row="$(grep -F '| [`gobbi-dev-conventions`]' "$root_skill")"
  second_row="$(grep -F '| [`gobbi-dev-deployment`]' "$root_skill")"
  replace_block_once "$root_skill" "$first_row"$'\n'"$second_row" "$second_row"$'\n'"$first_row"
  assert_entrypoint_source_zero_mutation entrypoint-row-reordered "$row_reordered" \
    'Child Skills section must equal the ordered child-derived table through end of file'

  row_extra="$tmp_root/entrypoint-row-extra"
  make_fixture "$row_extra"
  printf '| [`unrelated`](unrelated/SKILL.md) | tool | Extra row. |\n' \
    >> "$row_extra/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  assert_entrypoint_source_zero_mutation entrypoint-row-extra "$row_extra" \
    'Child Skills section must equal the ordered child-derived table through end of file'

  row_trailing="$tmp_root/entrypoint-row-trailing"
  make_fixture "$row_trailing"
  printf '\nUnexpected trailing policy.\n' \
    >> "$row_trailing/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  assert_entrypoint_source_zero_mutation entrypoint-row-trailing "$row_trailing" \
    'Child Skills section must equal the ordered child-derived table through end of file'

  agents_missing="$tmp_root/entrypoint-agents-missing"
  make_fixture "$agents_missing"
  rm -f "$agents_missing/AGENTS.md"
  assert_entrypoint_source_zero_mutation entrypoint-agents-missing "$agents_missing" \
    'AGENTS.md must be a non-dangling symlink with raw target .codex/AGENTS.md'

  agents_regular="$tmp_root/entrypoint-agents-regular"
  make_fixture "$agents_regular"
  rm -f "$agents_regular/AGENTS.md"
  printf 'regular\n' > "$agents_regular/AGENTS.md"
  assert_entrypoint_source_zero_mutation entrypoint-agents-regular "$agents_regular" \
    'AGENTS.md must be a non-dangling symlink with raw target .codex/AGENTS.md'

  agents_wrong="$tmp_root/entrypoint-agents-wrong"
  make_fixture "$agents_wrong"
  rm -f "$agents_wrong/AGENTS.md"
  ln -s '.claude/CLAUDE.md' "$agents_wrong/AGENTS.md"
  assert_entrypoint_source_zero_mutation entrypoint-agents-wrong "$agents_wrong" \
    'AGENTS.md must be a non-dangling symlink with raw target .codex/AGENTS.md'

  agents_dangling="$tmp_root/entrypoint-agents-dangling"
  make_fixture "$agents_dangling"
  rm -f "$agents_dangling/.codex/AGENTS.md"
  assert_entrypoint_source_zero_mutation entrypoint-agents-dangling "$agents_dangling" \
    'AGENTS.md must be a non-dangling symlink with raw target .codex/AGENTS.md'

  pass 'entrypoint sync renders one byte-equal route and rejects target drift or invalid sources without mutation'
}

test_package_only_owner_failures() {
  local root family root_skill outside first_row second_row

  root="$tmp_root/owner-missing"
  make_fixture "$root"
  family="$root/.gobbi/projects/gobbi/skills/gobbi-dev"
  find "$family" -depth -mindepth 1 -delete
  rmdir "$family"
  assert_owner_failure_zero_mutation owner-missing "$root" 'gobbi-dev must be a real directory'

  root="$tmp_root/owner-renamed"
  make_fixture "$root"
  mv "$root/.gobbi/projects/gobbi/skills/gobbi-dev" \
    "$root/.gobbi/projects/gobbi/skills/gobbi-dev-renamed"
  assert_owner_failure_zero_mutation owner-renamed "$root" 'gobbi-dev must be a real directory'

  root="$tmp_root/owner-directory-symlink"
  make_fixture "$root"
  family="$root/.gobbi/projects/gobbi/skills/gobbi-dev"
  outside="$root/family-owner"
  mv "$family" "$outside"
  ln -s '../../../../family-owner' "$family"
  assert_owner_failure_zero_mutation owner-directory-symlink "$root" 'gobbi-dev must be a real directory'

  root="$tmp_root/owner-root-symlink"
  make_fixture "$root"
  family="$root/.gobbi/projects/gobbi/skills/gobbi-dev"
  root_skill="$family/SKILL.md"
  mv "$root_skill" "$family/root-owner.md"
  ln -s 'root-owner.md' "$root_skill"
  assert_owner_failure_zero_mutation owner-root-symlink "$root" 'SKILL.md must be a readable real regular file'

  root="$tmp_root/owner-root-missing"
  make_fixture "$root"
  rm -f "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  assert_owner_failure_zero_mutation owner-root-missing "$root" 'SKILL.md must be a readable real regular file'

  root="$tmp_root/owner-root-unreadable"
  make_fixture "$root"
  root_skill="$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  chmod 000 "$root_skill"
  [[ ! -r "$root_skill" ]] || fail 'owner unreadable-root fixture is still readable'
  assert_owner_failure_zero_mutation owner-root-unreadable "$root" 'SKILL.md must be a readable real regular file'
  chmod 644 "$root_skill"

  root="$tmp_root/owner-wrong-name"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'name: gobbi-dev' 'name: gobbi-dev-wrong'
  assert_owner_failure_zero_mutation owner-wrong-name "$root" 'must declare name: gobbi-dev'

  root="$tmp_root/owner-wrong-type"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'skill-type: domain' 'skill-type: operation'
  assert_owner_failure_zero_mutation owner-wrong-type "$root" 'must declare skill-type: domain'

  root="$tmp_root/owner-duplicate-name"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'name: gobbi-dev' $'name: gobbi-dev\nname: gobbi-dev'
  assert_owner_failure_zero_mutation owner-duplicate-name "$root" 'must declare name: gobbi-dev'

  root="$tmp_root/owner-body-spoof-name"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'name: gobbi-dev' 'owner-name: missing'
  printf '\nname: gobbi-dev\n' >> "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  assert_owner_failure_zero_mutation owner-body-spoof-name "$root" 'must declare name: gobbi-dev'

  root="$tmp_root/owner-missing-navigation"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    '## Child Skills' '## Routes'
  assert_owner_failure_zero_mutation owner-missing-navigation "$root" 'must retain the navigation-only root shell'

  root="$tmp_root/owner-child-type-drift"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-testing/SKILL.md" \
    'skill-type: operation' 'skill-type: tool'
  assert_owner_failure_zero_mutation owner-child-type-drift "$root" 'must declare skill-type: operation'

  root="$tmp_root/owner-child-trigger-drift"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-testing/SKILL.md" \
    'MUST load when collecting exact-revision test evidence for Gobbi.' \
    'MUST load when collecting changed test evidence for Gobbi.'
  assert_owner_failure_zero_mutation owner-child-trigger-drift "$root" \
    'gobbi-dev-testing/SKILL.md must preserve the exact accepted description'

  root="$tmp_root/owner-missing-file"
  make_fixture "$root"
  rm -f "$root/.gobbi/projects/gobbi/skills/gobbi-dev/gobbi-dev-testing/SKILL.md"
  assert_owner_failure_zero_mutation owner-missing-file "$root" 'exact accepted ten-file inventory'

  root="$tmp_root/owner-extra-file"
  make_fixture "$root"
  printf 'extra\n' > "$root/.gobbi/projects/gobbi/skills/gobbi-dev/extra.md"
  assert_owner_failure_zero_mutation owner-extra-file "$root" 'exact accepted ten-file inventory'

  root="$tmp_root/owner-row-tampered"
  make_fixture "$root"
  replace_literal_once "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md" \
    'MUST load when collecting exact-revision test evidence for Gobbi.' \
    'MUST load when collecting approximate test evidence for Gobbi.'
  assert_owner_failure_zero_mutation owner-row-tampered "$root" \
    'Child Skills section must equal the ordered child-derived table through end of file'

  root="$tmp_root/owner-row-reordered"
  make_fixture "$root"
  root_skill="$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  first_row="$(grep -F '| [`gobbi-dev-conventions`]' "$root_skill")"
  second_row="$(grep -F '| [`gobbi-dev-deployment`]' "$root_skill")"
  replace_block_once "$root_skill" "$first_row"$'\n'"$second_row" "$second_row"$'\n'"$first_row"
  assert_owner_failure_zero_mutation owner-row-reordered "$root" \
    'Child Skills section must equal the ordered child-derived table through end of file'

  root="$tmp_root/owner-row-extra"
  make_fixture "$root"
  printf '| [`unrelated`](unrelated/SKILL.md) | tool | Extra row. |\n' \
    >> "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  assert_owner_failure_zero_mutation owner-row-extra "$root" \
    'Child Skills section must equal the ordered child-derived table through end of file'

  root="$tmp_root/owner-row-trailing"
  make_fixture "$root"
  printf '\nUnexpected trailing policy.\n' \
    >> "$root/.gobbi/projects/gobbi/skills/gobbi-dev/SKILL.md"
  assert_owner_failure_zero_mutation owner-row-trailing "$root" \
    'Child Skills section must equal the ordered child-derived table through end of file'
}

expect_package_check_failure() {
  local name="$1" root="$2" expected="$3" log
  log="$tmp_root/$name.package.log"
  if run_sync "$root" --check > "$log" 2>&1; then
    fail "$name package drift unexpectedly passed"
  fi
  assert_file_contains "$log" "$expected"
  pass "$name package drift fails closed"
}

assert_normal_package_preflight_zero_mutation() {
  local name="$1" root="$2" expected="$3"
  local before="$tmp_root/$name.normal.before" after="$tmp_root/$name.normal.after" log="$tmp_root/$name.normal.log"

  make_owned_mirror_link "$root" gobbi removed-by-unsafe-normal.md
  ln -s '../../.gobbi/projects/gobbi/skills/retired' "$root/.agents/skills/retired"
  snapshot_owned_surfaces "$root" "$before"
  if run_sync "$root" > "$log" 2>&1; then
    fail "$name unexpectedly succeeded in normal mode"
  fi
  snapshot_owned_surfaces "$root" "$after"
  cmp -s "$before" "$after" || fail "$name mutated an owned surface before normal package preflight rejection"
  assert_file_contains "$log" "$expected"
  pass "$name normal package preflight rejects with zero owned-surface mutation"
}

assert_check_package_preflight_zero_mutation() {
  local name="$1" root="$2" expected="$3"
  local before="$tmp_root/$name.check.before" after="$tmp_root/$name.check.after" log="$tmp_root/$name.check.log"

  snapshot_owned_surfaces "$root" "$before"
  if run_sync "$root" --check > "$log" 2>&1; then
    fail "$name unexpectedly succeeded in check mode"
  fi
  snapshot_owned_surfaces "$root" "$after"
  cmp -s "$before" "$after" || fail "$name mutated an owned surface during check-mode rejection"
  assert_file_contains "$log" "$expected"
  pass "$name check-mode package preflight rejects with zero owned-surface mutation"
}

assert_materialize_package_preflight_zero_mutation() {
  local name="$1" root="$2" expected="$3"
  local before="$tmp_root/$name.materialize.before" after="$tmp_root/$name.materialize.after"
  local log="$tmp_root/$name.materialize.log"

  snapshot_owned_surfaces "$root" "$before"
  if run_sync "$root" --materialize-package > "$log" 2>&1; then
    fail "$name unexpectedly succeeded in materialize mode"
  fi
  snapshot_owned_surfaces "$root" "$after"
  cmp -s "$before" "$after" || fail "$name mutated an owned surface before materialize preflight rejection"
  assert_file_contains "$log" "$expected"
  pass "$name materialize package preflight rejects with zero owned-surface mutation"
}

test_normal_package_preflight() {
  local root skills

  root="$tmp_root/normal-package-missing"
  make_fixture "$root"
  skills="$root/plugins/gobbi/skills"
  find "$skills" -depth -mindepth 1 -delete
  rmdir "$skills"
  assert_normal_package_preflight_zero_mutation normal-package-missing "$root" \
    'plugins/gobbi/skills must already be a materialized filtered directory'

  root="$tmp_root/normal-package-symlink"
  make_fixture "$root"
  skills="$root/plugins/gobbi/skills"
  mv "$skills" "$root/package-skills-owner"
  ln -s '../../package-skills-owner' "$skills"
  assert_normal_package_preflight_zero_mutation normal-package-symlink "$root" \
    'plugins/gobbi/skills must already be a materialized filtered directory'

  root="$tmp_root/check-package-symlink"
  make_fixture "$root"
  run_sync "$root" >/dev/null
  skills="$root/plugins/gobbi/skills"
  mv "$skills" "$root/package-skills-owner"
  ln -s '../../package-skills-owner' "$skills"
  assert_check_package_preflight_zero_mutation check-package-symlink "$root" \
    'plugins/gobbi/skills must be a materialized filtered directory, not a symlink'

  root="$tmp_root/normal-package-leak"
  make_fixture "$root"
  mkdir -p "$root/plugins/gobbi/skills/gobbi-dev"
  printf 'leak\n' > "$root/plugins/gobbi/skills/gobbi-dev/SKILL.md"
  assert_normal_package_preflight_zero_mutation normal-package-leak "$root" \
    'forbidden exact package-only skill path segment'

  root="$tmp_root/normal-package-link-leak"
  make_fixture "$root"
  ln -s '../principles' "$root/plugins/gobbi/skills/gobbi-dev"
  assert_normal_package_preflight_zero_mutation normal-package-link-leak "$root" \
    'forbidden exact package-only skill path segment'

  root="$tmp_root/normal-package-link-target-token"
  make_fixture "$root"
  ln -s '../gobbi-dev/target' "$root/plugins/gobbi/skills/safe-name-link"
  assert_normal_package_preflight_zero_mutation normal-package-link-target-token "$root" \
    'symlink target contains the forbidden package-only skill token'
}

test_materialize_literal_preflight() {
  local root="$tmp_root/materialize-literal-preflight" before after log link_root
  before="$tmp_root/materialize-literal.before"
  after="$tmp_root/materialize-literal.after"
  log="$tmp_root/materialize-literal.log"
  make_fixture "$root"
  printf '\0gobbi-dev\0' > "$root/plugins/gobbi/unrelated.bin"
  snapshot_owned_surfaces "$root" "$before"
  if run_sync "$root" --materialize-package > "$log" 2>&1; then
    fail 'materialize accepted an unrelated binary standalone package-only token'
  fi
  snapshot_owned_surfaces "$root" "$after"
  cmp -s "$before" "$after" || fail 'materialize changed an owned surface before unrelated literal rejection'
  assert_file_contains "$log" 'contains the forbidden standalone package-only skill token'
  pass 'materialize rejects non-remediable binary token leaks before mutation'

  link_root="$tmp_root/materialize-link-target-token"
  make_fixture "$link_root"
  ln -s '../gobbi-dev/target' "$link_root/plugins/gobbi/skills/safe-name-link"
  assert_materialize_package_preflight_zero_mutation materialize-link-target-token "$link_root" \
    'symlink target contains the forbidden package-only skill token'
}

test_materialize_exact_subtree_prune() {
  local root="$tmp_root/materialize-exact-subtree-prune"
  make_fixture "$root"
  run_sync "$root" >/dev/null
  mkdir -p "$root/plugins/gobbi/skills/gobbi-dev/nested"
  printf 'stale exact subtree\n' > "$root/plugins/gobbi/skills/gobbi-dev/nested/file"
  run_sync "$root" --materialize-package >/dev/null
  [[ ! -e "$root/plugins/gobbi/skills/gobbi-dev" && ! -L "$root/plugins/gobbi/skills/gobbi-dev" ]] \
    || fail 'materialize did not prune the exact package-only skill subtree'
  run_sync "$root" --check >/dev/null
  pass 'materialize positively prunes the exact package-only skill subtree and converges'
}

test_materialize_exact_root_symlink_prune() {
  local root="$tmp_root/materialize-exact-root-symlink-prune"
  local outside="$root/private-package-link-target"
  local forbidden="$root/plugins/gobbi/skills/gobbi-dev"
  local raw_target='../../../private-package-link-target'
  local outside_before="$tmp_root/exact-root-link.outside.before"
  local outside_after="$tmp_root/exact-root-link.outside.after"
  local included_before="$tmp_root/exact-root-link.included.before"
  local included_after="$tmp_root/exact-root-link.included.after"

  make_fixture "$root"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null

  mkdir -p "$outside/nested"
  printf 'outside sentinel\n' > "$outside/nested/sentinel"
  printf '\0outside bytes\0\n' > "$outside/nested/binary"
  ln -s 'nested/sentinel' "$outside/sentinel-link"
  {
    find -P "$outside" -mindepth 1 -printf '%y\t%P\n' | LC_ALL=C sort
    sha256sum "$outside/nested/sentinel" "$outside/nested/binary"
    readlink -n -- "$outside/sentinel-link" | od -An -tx1 | tr -d ' \n'
    printf '\n'
  } > "$outside_before"
  sha256sum "$root/plugins/gobbi/skills/principles/SKILL.md" > "$included_before"

  ln -s "$raw_target" "$forbidden"
  [[ -L "$forbidden" && "$(readlink -n -- "$forbidden")" == "$raw_target" ]] \
    || fail 'exact-root package symlink fixture has the wrong raw target'
  [[ "$(realpath -e -- "$forbidden")" == "$(realpath -e -- "$outside")" ]] \
    || fail 'exact-root package symlink fixture does not resolve to its private outside target'

  run_sync "$root" --materialize-package >/dev/null
  [[ ! -e "$forbidden" && ! -L "$forbidden" ]] \
    || fail 'materialize did not prune the exact package-only root symlink'

  {
    find -P "$outside" -mindepth 1 -printf '%y\t%P\n' | LC_ALL=C sort
    sha256sum "$outside/nested/sentinel" "$outside/nested/binary"
    readlink -n -- "$outside/sentinel-link" | od -An -tx1 | tr -d ' \n'
    printf '\n'
  } > "$outside_after"
  cmp -s "$outside_before" "$outside_after" \
    || fail 'materialize changed the private outside symlink target inventory or bytes'

  sha256sum "$root/plugins/gobbi/skills/principles/SKILL.md" > "$included_after"
  cmp -s "$included_before" "$included_after" \
    || fail 'materialize changed an included package entry while pruning the excluded link'
  cmp -s \
    "$root/.gobbi/projects/gobbi/skills/principles/SKILL.md" \
    "$root/plugins/gobbi/skills/principles/SKILL.md" \
    || fail 'included package bytes differ from their canonical owner after exact-link pruning'

  run_sync "$root" --check >/dev/null
  {
    find -P "$outside" -mindepth 1 -printf '%y\t%P\n' | LC_ALL=C sort
    sha256sum "$outside/nested/sentinel" "$outside/nested/binary"
    readlink -n -- "$outside/sentinel-link" | od -An -tx1 | tr -d ' \n'
    printf '\n'
  } > "$outside_after"
  cmp -s "$outside_before" "$outside_after" \
    || fail 'post-prune check changed the private outside target'
  pass 'materialize prunes an exact-root symlink, preserves its outside target, and converges'
}

test_exact_package_skill_filter() {
  local root="$tmp_root/exact-package-filter" first="$tmp_root/exact-package-filter.first"
  local second="$tmp_root/exact-package-filter.second"

  make_fixture "$root"
  write_skill_file "$root" gobbi-dev-extra SKILL.md $'---\nname: gobbi-dev-extra\ndescription: "MUST load for the valid gobbi-dev-extra neighbor."\nallowed-tools: Read\nskill-type: tool\n---\n\n# Included prefix neighbor\n\nxgobbi-dev and gobbi-devx are valid non-token identifiers.'
  run_sync "$root" >/dev/null
  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" --check >/dev/null

  [[ -L "$root/.agents/skills/gobbi-dev" ]] || fail 'complete Codex local discovery omitted gobbi-dev'
  [[ -L "$root/.claude/skills/gobbi-dev/SKILL.md" ]] || fail 'complete Claude local discovery omitted gobbi-dev'
  [[ ! -e "$root/plugins/gobbi/skills/gobbi-dev" && ! -L "$root/plugins/gobbi/skills/gobbi-dev" ]] \
    || fail 'exact package-only skill reached package skills'
  [[ -f "$root/plugins/gobbi/skills/gobbi-dev-extra/SKILL.md" ]] \
    || fail 'similarly named included skill was over-filtered'

  snapshot_owned_surfaces "$root" "$first"
  run_sync "$root" --materialize-package >/dev/null
  snapshot_owned_surfaces "$root" "$second"
  cmp -s "$first" "$second" || fail 'filtered package materialization was not idempotent'
  pass 'exact package exclusion preserves complete local mirrors and similarly named included skills'

  rm -f "$root/plugins/gobbi/skills/gobbi-dev-extra/SKILL.md"
  expect_package_check_failure package-omitted "$root" 'is missing from the generated copy'
  run_sync "$root" --materialize-package >/dev/null

  printf 'changed bytes\n' > "$root/plugins/gobbi/skills/gobbi-dev-extra/SKILL.md"
  expect_package_check_failure package-changed-byte "$root" 'is not byte-equal'
  run_sync "$root" --materialize-package >/dev/null

  printf 'stale\n' > "$root/plugins/gobbi/skills/stale.md"
  expect_package_check_failure package-extra "$root" 'has no canonical owner'
  run_sync "$root" --materialize-package >/dev/null

  ln -s 'gobbi-dev-extra/SKILL.md' "$root/plugins/gobbi/skills/stale-link"
  expect_package_check_failure package-symlink "$root" 'is a symlink'
  run_sync "$root" --materialize-package >/dev/null

  mkdir "$root/plugins/gobbi/skills/stale-empty"
  expect_package_check_failure package-empty-dir "$root" 'stale generated subdir'
  run_sync "$root" --materialize-package >/dev/null

  mkdir -p "$root/plugins/gobbi/skills/gobbi-dev"
  printf 'leak\n' > "$root/plugins/gobbi/skills/gobbi-dev/SKILL.md"
  expect_package_check_failure package-excluded-stale "$root" 'has no canonical owner'
}

# Pin the two package-component shapes the installed-cache smoke distinguishes. That smoke fails
# a symlinked component root as an unmaterialized package, and fails a missing installed path
# under a real one as an incomplete generated copy. Each message names the shape it found, so
# both are wrong if sync ever stops producing exactly these two shapes. Assert them here rather
# than leave the smoke's messages resting on an untested assumption.
test_package_component_shapes() {
  local root="$tmp_root/package-shapes" component package_component
  prepare_synced_fixture "$root"

  package_component="$root/plugins/gobbi/skills"
  [[ -d "$package_component" && ! -L "$package_component" ]] \
    || fail 'plugins/gobbi/skills is not an always-materialized filtered directory'
  package_component="$root/plugins/gobbi/agents"
  [[ -d "$package_component" && ! -L "$package_component" ]] \
    || fail 'fixture setup did not materialize plugins/gobbi/agents'
  run_sync "$root" --check >/dev/null

  run_sync "$root" --materialize-package >/dev/null
  for component in skills agents; do
    package_component="$root/plugins/gobbi/$component"
    [[ -d "$package_component" && ! -L "$package_component" ]] \
      || fail "generation did not leave plugins/gobbi/$component a real directory"
    [[ -z "$(find "$package_component" -type l -print -quit)" ]] \
      || fail "generated plugins/gobbi/$component still holds a symlink"
  done
  [[ -f "$root/plugins/gobbi/skills/alpha/SKILL.md" && ! -L "$root/plugins/gobbi/skills/alpha/SKILL.md" ]] \
    || fail 'generated skills component does not hold a real copy of its canonical file'
  run_sync "$root" --check >/dev/null

  pass 'package skills stays a filtered real directory and materialization leaves both components real'
}

test_static_deletion_guards() {
  if grep -Eq 'rm[[:space:]]+-[^[:space:]]*r[^[:space:]]*f|rm[[:space:]]+-[^[:space:]]*f[^[:space:]]*r' "$sync_script"; then
    fail 'sync script contains recursive forced deletion'
  fi
  if grep -Eq 'find[[:space:]]+-L|find[^\n]*\.claude/skills[^\n]*[[:space:]]-L' "$sync_script"; then
    fail 'sync script follows directory symlinks during mirror traversal'
  fi
  pass 'sync source contains no recursive forced deletion or following mirror walk'
}

test_static_deletion_guards
test_package_component_shapes
test_package_only_owner_failures
test_normal_package_preflight
test_materialize_literal_preflight
test_materialize_exact_subtree_prune
test_materialize_exact_root_symlink_prune
test_exact_package_skill_filter
test_safe_reconciliation
test_canonical_skill_deletion
test_unsafe_agents_entry
test_unsafe_agents_wrong_target
test_unsafe_agents_trailing_newline_target
test_unsafe_agents_dot_entry
test_unsafe_regular_file
test_unsafe_wrong_target
test_unsafe_claude_trailing_newline_target
test_unsafe_directory_symlink
test_unsafe_dot_entry
test_unsafe_path_escape
test_mixed_safe_and_unsafe
test_forward_and_back_rollback
test_bounded_walks
test_hook_component_rejection
test_manifest_hook_rejection
test_marketplace_and_role_contracts
test_exact_family_frontmatter_contracts
test_runtime_entrypoint_contract
test_semantic_positive_recovery_and_reflow
test_smoke_contract_drift
test_semantic_cowork_forbidden_wrapup_edge
test_semantic_entry_order
test_semantic_contract_failures
test_semantic_permissions

printf 'PASS: %d sync reconciliation tests completed\n' "$tests_run"
