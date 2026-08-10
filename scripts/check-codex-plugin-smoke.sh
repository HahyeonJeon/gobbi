#!/usr/bin/env bash
set -euo pipefail

usage_error() { printf 'usage: %s [--self-test]\n' "$0" >&2; exit 2; }
case $# in
  0) mode=run ;;
  1) [[ "$1" == --self-test ]] || usage_error; mode=--self-test ;;
  *) usage_error ;;
esac

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
package_root="$repo_root/plugins/gobbi"
smoke_script="$repo_root/scripts/check-codex-plugin-smoke.sh"
codex_executable='/home/jeonhh0061/.nvm/versions/node/v22.22.1/bin/codex'
expected_version='codex-cli 0.147.0'
package_only_skill='gobbi-dev'
package_only_skill_token_regex="(^|[^[:alnum:]_-])${package_only_skill}([^[:alnum:]_-]|$)"
fd_closure_exec=$'import errno, os, sys\ntry:\n    names = os.listdir("/proc/self/fd")\nexcept OSError as exc:\n    print(f"fd-closure wrapper: cannot enumerate /proc/self/fd: {exc}", file=sys.stderr)\n    raise SystemExit(125)\nfds = []\nfor name in names:\n    try:\n        fd = int(name)\n    except ValueError:\n        print(f"fd-closure wrapper: unexpected /proc/self/fd entry: {name!r}", file=sys.stderr)\n        raise SystemExit(125)\n    if fd >= 3:\n        fds.append(fd)\nfor fd in sorted(set(fds), reverse=True):\n    try:\n        os.close(fd)\n    except OSError as exc:\n        if exc.errno != errno.EBADF:\n            print(f"fd-closure wrapper: cannot close inherited fd {fd}: {exc}", file=sys.stderr)\n            raise SystemExit(125)\nfor fd in fds:\n    try:\n        os.fstat(fd)\n    except OSError as exc:\n        if exc.errno == errno.EBADF:\n            continue\n        print(f"fd-closure wrapper: cannot verify inherited fd {fd}: {exc}", file=sys.stderr)\n        raise SystemExit(125)\n    print(f"fd-closure wrapper: inherited fd {fd} remained open", file=sys.stderr)\n    raise SystemExit(125)\ntry:\n    os.execv(sys.argv[1], sys.argv[1:])\nexcept OSError as exc:\n    print(f"fd-closure wrapper: exec failed: {exc}", file=sys.stderr)\n    raise SystemExit(126)'

target="$(mktemp -d /tmp/gobbi-codex-plugin-smoke.XXXXXX)"
private_home="$target/home"
codex_home="$target/codex-home"
codex_sqlite_home="$target/codex-sqlite-home"
private_tmp="$target/tmp"
trace_root="$target/traces"
frozen_package_manifest="$target/frozen-package.manifest"
smoke_complete=0
source_precheck_probe_count=0
source_postcheck_probe_count=0

pass() { printf 'PASS %s\n' "$1"; }
fail() { printf 'FAIL %s\n' "$1" >&2; exit 1; }

strictly_contained() {
  local child="$1" parent="$2" resolved_child resolved_parent
  resolved_child="$(realpath -e -- "$child")" || return 1
  resolved_parent="$(realpath -e -- "$parent")" || return 1
  [[ "$resolved_child" == "$resolved_parent"/* && "$resolved_child" != "$resolved_parent" ]]
}

cleanup_success() {
  [[ -d "$target" && ! -L "$target" && -f "$target/.gobbi-smoke-target" ]] || return 1
  [[ "$target" == /tmp/gobbi-codex-plugin-smoke.* ]] || return 1
  find "$target" -depth -mindepth 1 -delete
  rmdir "$target"
}

on_exit() {
  local status=$?
  if [[ "$status" -eq 0 && "$smoke_complete" -eq 1 ]]; then
    cleanup_success || {
      printf 'PRESERVED %s (cleanup validation failed)\n' "$target" >&2
      return 1
    }
  else
    printf 'PRESERVED %s\n' "$target" >&2
  fi
  return "$status"
}
trap on_exit EXIT

: > "$target/.gobbi-smoke-target"
mkdir "$private_home" "$codex_home" "$codex_sqlite_home" "$private_tmp" "$trace_root"
for private_dir in "$private_home" "$codex_home" "$codex_sqlite_home" "$private_tmp" "$trace_root"; do
  [[ -d "$private_dir" && ! -L "$private_dir" ]] || fail "$private_dir is not a real private directory"
  strictly_contained "$private_dir" "$target" || fail "$private_dir is not contained by $target"
done
[[ "$private_home" != "$codex_home" && "$private_home" != "$codex_sqlite_home" && "$codex_home" != "$codex_sqlite_home" ]] \
  || fail 'private Codex homes must be distinct'

fixed_runtime=codex
runtime_wrapper_capability=''
# BEGIN SOURCE PROBE AUDIT CONTRACT
trace_set='%network,?socketcall,io_uring_setup,pidfd_getfd'
deny_set='socket,?socketcall,connect,bind,listen,accept,accept4,io_uring_setup,pidfd_getfd'
source_probe_regex='^[[:space:]]*[0-9]+[[:space:]]+socket\((AF_UNIX|AF_LOCAL), SOCK_STREAM\|SOCK_CLOEXEC\|SOCK_NONBLOCK, 0\) = -1 EACCES \(Permission denied\) \(INJECTED\)$'
runtime_denied_regex='^[[:space:]]*[0-9]+[[:space:]]+(socket|socketcall|connect|bind|listen|accept|accept4|io_uring_setup|pidfd_getfd)\(.*\) = -1 EACCES \(Permission denied\) \(INJECTED\)$'

runtime_stage_allowed() {
  local owner="$1" stage="$2"
  [[ "$owner" == "$fixed_runtime" ]] || return 1
  case "$fixed_runtime:$stage" in
    codex:version|codex:marketplace-add|codex:available-list|codex:install|codex:installed-list|claude:version|claude:validate|claude:marketplace-add|claude:available-list|claude:install|claude:installed-list) ;;
    *) return 1 ;;
  esac
}

audit_trace() {
  local trace="$1" stage="${2:-helper-audit}" child_status="${3:-0}" audit_policy="${4:-strict}" audit_owner="${5:-helper}"
  local family line syscall pid terminal_status injected_count=0 unix_fd_regex socketpair_regex first_fd_regex
  local failed_result_regex unix_descriptor_regex left_descriptor right_descriptor first_descriptor
  declare -A unix_descriptors=() syscall_pids=() terminal_statuses=()
  local source_probe_stage=false runtime_stage=false
  trace_audit_error=''
  trace_audit_tolerated_probes=0
  trace_audit_blocked_records=0
  trace_audit_blocked_receipt=''
  [[ -s "$trace" ]] || {
    trace_audit_error='trace file is missing or empty'
    return 1
  }
  case "$audit_policy" in
    strict) ;;
    source)
      if [[ "$stage" != source-precheck && "$stage" != source-postcheck ]]; then
        trace_audit_error='source probe policy was selected outside an exact source-check stage'
        return 1
      fi
      [[ "$child_status" -eq 0 ]] && source_probe_stage=true
      ;;
    runtime)
      runtime_stage_allowed "$audit_owner" "$stage" || {
        trace_audit_error='runtime policy owner or stage is outside the fixed wrapper allowlist'
        return 1
      }
      runtime_stage=true
      [[ "$child_status" -eq 0 ]] || {
        trace_audit_error='runtime stage child status was nonzero'
        return 1
      }
      ;;
    *)
      trace_audit_error="unknown trace audit policy: $audit_policy"
      return 1
      ;;
  esac
  if [[ -s "$trace" ]] && ! tail -c 1 -- "$trace" | cmp -s - <(printf '\n'); then
    trace_audit_error='trace contains an unterminated final record'
    return 1
  fi
  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    if [[ "$line" =~ ^[[:space:]]*([0-9]+)[[:space:]]+\+\+\+[[:space:]]+exited[[:space:]]+with[[:space:]]+([0-9]+)[[:space:]]+\+\+\+$ ]]; then
      pid="${BASH_REMATCH[1]}"; terminal_status="${BASH_REMATCH[2]}"
      [[ -z "${terminal_statuses[$pid]+x}" ]] || { trace_audit_error="duplicate terminal record for pid $pid"; return 1; }
      terminal_statuses["$pid"]="$terminal_status"
      continue
    fi
    if [[ "$line" =~ ^[[:space:]]*([0-9]+)[[:space:]]+\+\+\+[[:space:]]+killed[[:space:]]+by[[:space:]]+(SIG[A-Z0-9]+)[[:space:]]+\+\+\+$ ]]; then
      pid="${BASH_REMATCH[1]}"
      [[ -z "${terminal_statuses[$pid]+x}" ]] || { trace_audit_error="duplicate terminal record for pid $pid"; return 1; }
      terminal_statuses["$pid"]="killed:${BASH_REMATCH[2]}"
      continue
    fi
    if [[ "$line" =~ ^[[:space:]]*[0-9]+[[:space:]]+---[[:space:]]+SIG[A-Z0-9]+[[:space:]]+\{[^\}]+\}[[:space:]]+---$ ]]; then
      continue
    fi
    if [[ "$line" == *'<unfinished ...>'* || "$line" == *' resumed>'* || \
          ! "$line" =~ ^[[:space:]]*[0-9]+[[:space:]]+[[:alnum:]_]+\(.*\)[[:space:]]+=[[:space:]]+.+$ ]]; then
      trace_audit_error='trace contains a malformed, unfinished, resumed, or unclassified record'
      return 1
    fi
    [[ "$line" =~ ^[[:space:]]*([0-9]+)[[:space:]]+ ]] || { trace_audit_error='syscall record has no pid'; return 1; }
    pid="${BASH_REMATCH[1]}"; syscall_pids["$pid"]=1
    [[ "$line" == *'(INJECTED)'* ]] || continue
    if [[ "$runtime_stage" == true && "$line" =~ $runtime_denied_regex ]]; then
      injected_count=$((injected_count + 1))
      syscall="${BASH_REMATCH[1]}"; family=none
      [[ "$line" =~ (AF_[[:alnum:]_]+) ]] && family="${BASH_REMATCH[1]}"
      trace_audit_blocked_receipt+="${trace_audit_blocked_receipt:+,}stage=$stage syscall=$syscall family=$family"
      continue
    fi
    if [[ "$source_probe_stage" != true ]]; then
      trace_audit_error='an injected prohibited syscall was attempted outside a source-check stage'
      return 1
    fi
    if [[ ! "$line" =~ $source_probe_regex ]]; then
      trace_audit_error='source-check stage recorded an injected line outside the exact local no-effect probe contract'
      return 1
    fi
    injected_count=$((injected_count + 1))
  done < "$trace"
  if [[ "$runtime_stage" == true ]]; then
    for pid in "${!syscall_pids[@]}"; do
      [[ "${terminal_statuses[$pid]-missing}" == 0 ]] || { trace_audit_error="runtime pid $pid lacks one zero-status terminal record"; return 1; }
    done
  fi
  if [[ "$source_probe_stage" == true && "$injected_count" -ne 4 ]]; then
    trace_audit_error="source-check stage recorded $injected_count exact local no-effect probes; expected 4"
    return 1
  fi
  if [[ "$source_probe_stage" == true ]]; then
    trace_audit_tolerated_probes="$injected_count"
  elif [[ "$runtime_stage" == true ]]; then
    trace_audit_blocked_records="$injected_count"
  fi
  failed_result_regex=' = -[0-9]+ [A-Z][A-Z0-9_]* \([^)]*\)$'
  unix_descriptor_regex='^[0-9]+<UNIX-(STREAM|DGRAM|SEQPACKET):\[[0-9]+(->[0-9]+)?\]>$'
  while IFS= read -r line; do
    [[ "$line" =~ ^[[:space:]]*[0-9]+[[:space:]]+---[[:space:]]+SIG[A-Z0-9]+[[:space:]].*[[:space:]]+---$ ]] && continue
    [[ "$line" =~ ^[[:space:]]*[0-9]+[[:space:]]+\+\+\+[[:space:]]+exited[[:space:]]+with[[:space:]]+[0-9]+[[:space:]]+\+\+\+$ ]] && continue
    [[ "$line" =~ ^[[:space:]]*[0-9]+[[:space:]]+([[:alnum:]_]+)\( ]] || continue
    syscall="${BASH_REMATCH[1]}"
    case "$syscall" in
      socket|socketcall|connect|bind|listen|accept|accept4|io_uring_setup|pidfd_getfd)
        if [[ "$source_probe_stage" == true && "$line" =~ $source_probe_regex ]]; then
          continue
        fi
        if [[ "$runtime_stage" == true && "$line" =~ $runtime_denied_regex ]]; then
          continue
        fi
        trace_audit_error="prohibited syscall recorded without an injection marker: $syscall"
        return 1
        ;;
      socketpair)
        [[ "$line" =~ $failed_result_regex ]] && continue
        socketpair_regex='^[[:space:]]*[0-9]+[[:space:]]+socketpair\((AF_UNIX|AF_LOCAL), [[:alnum:]_|]+, 0, \[([^,]+>), (.*>)\]\) = 0$'
        [[ "$line" =~ $socketpair_regex ]] || { trace_audit_error='socketpair record is not a complete successful local pair'; return 1; }
        left_descriptor="${BASH_REMATCH[2]}"; right_descriptor="${BASH_REMATCH[3]}"
        [[ "$left_descriptor" =~ $unix_descriptor_regex && "$right_descriptor" =~ $unix_descriptor_regex ]] \
          || { trace_audit_error='socketpair descriptors do not prove Unix identities'; return 1; }
        unix_descriptors["$left_descriptor"]=1; unix_descriptors["$right_descriptor"]=1
        ;;
      sendto|sendmsg|sendmmsg|recvfrom|recvmsg|recvmmsg)
        [[ "$line" =~ $failed_result_regex ]] && continue
        first_fd_regex="^[[:space:]]*[0-9]+[[:space:]]+$syscall\\(([^,]+),"
        [[ "$line" =~ $first_fd_regex ]] || { trace_audit_error="$syscall has no parsed descriptor"; return 1; }
        first_descriptor="${BASH_REMATCH[1]}"
        [[ -n "${unix_descriptors[$first_descriptor]+x}" ]] || { trace_audit_error="successful $syscall lacks socketpair provenance"; return 1; }
        ;;
      getsockname|getpeername|shutdown|setsockopt|getsockopt)
        [[ "$line" =~ $failed_result_regex ]] && continue
        first_fd_regex="^[[:space:]]*[0-9]+[[:space:]]+$syscall\\(([^,]+),"
        [[ "$line" =~ $first_fd_regex ]] || { trace_audit_error="$syscall has no parsed descriptor"; return 1; }
        first_descriptor="${BASH_REMATCH[1]}"
        [[ -n "${unix_descriptors[$first_descriptor]+x}" ]] || { trace_audit_error="successful $syscall lacks socketpair provenance"; return 1; }
        ;;
      *)
        trace_audit_error="unclassified traced syscall: $syscall"
        return 1
        ;;
    esac
  done < "$trace"
}

audit_stage_trace() {
  local trace="$1" stage="$2" child_status="$3" audit_policy="$4" audit_owner="$5" launch_identity="${6:-}"
  local expected identity_before identity_after digest_before digest_after trace_fd
  if [[ "$audit_policy" != runtime ]]; then
    audit_trace "$trace" "$stage" "$child_status" "$audit_policy" "$audit_owner"
    return
  fi
  expected="$trace_root/$stage.trace"
  [[ "$trace" == "$expected" && -s "$trace" && -f "$trace" && ! -L "$trace" ]] || { trace_audit_error='runtime trace path, type, or content is invalid'; return 1; }
  strictly_contained "$trace" "$trace_root" || { trace_audit_error='runtime trace escaped its private root'; return 1; }
  [[ "$(stat -c '%u:%a' -- "$trace")" == "$(id -u):600" ]] || { trace_audit_error='runtime trace owner or mode is not private'; return 1; }
  [[ -n "$launch_identity" && "$(stat -c '%d:%i' -- "$trace")" == "$launch_identity" ]] || { trace_audit_error='runtime trace identity differs from its bound prelaunch target'; return 1; }
  identity_before="$(stat -c '%d:%i:%u:%a:%s:%Y:%Z' -- "$trace")"; digest_before="$(sha256sum "$trace")"; digest_before="${digest_before%% *}"
  exec {trace_fd}< "$trace" || { trace_audit_error='runtime trace could not be opened'; return 1; }
  [[ "$(stat -Lc '%d:%i' -- "/proc/$$/fd/$trace_fd")" == "$(stat -c '%d:%i' -- "$trace")" ]] || { exec {trace_fd}<&-; trace_audit_error='runtime trace path was replaced before parsing'; return 1; }
  audit_trace "/proc/$$/fd/$trace_fd" "$stage" "$child_status" "$audit_policy" "$audit_owner" || { exec {trace_fd}<&-; return 1; }
  exec {trace_fd}<&-
  identity_after="$(stat -c '%d:%i:%u:%a:%s:%Y:%Z' -- "$trace")"; digest_after="$(sha256sum "$trace")"; digest_after="${digest_after%% *}"
  [[ "$identity_before" == "$identity_after" && "$digest_before" == "$digest_after" ]] || { trace_audit_error='runtime trace changed during parsing'; return 1; }
}

run_traced_stage() {
  local stage="$1" audit_policy="$2" audit_owner="$3" status trace stdout stderr launch_identity=''
  shift 3
  case "$audit_policy" in
    strict|source|runtime) ;;
    *) printf 'invalid trace audit policy for stage %s: %s\n' "$stage" "$audit_policy" >&2; return 1 ;;
  esac
  if [[ "$audit_policy" == runtime ]]; then
    runtime_stage_allowed "$audit_owner" "$stage" && [[ "$runtime_wrapper_capability" == "$fixed_runtime:$stage" ]] \
      || { printf 'runtime policy rejected before execution for stage %s\n' "$stage" >&2; return 1; }
    runtime_wrapper_capability=''
  fi
  trace="$trace_root/$stage.trace"
  stdout="$trace_root/$stage.stdout"
  stderr="$trace_root/$stage.stderr"
  if [[ "$audit_policy" == runtime ]]; then
    : > "$trace"; chmod 600 "$trace"; launch_identity="$(stat -c '%d:%i' -- "$trace")"
  fi
  set +e
  /usr/bin/strace -q -f --kill-on-exit -yy -s 256 \
    -e "trace=$trace_set" -e "inject=$deny_set:error=EACCES" -o "$trace" -- \
    "$@" < /dev/null > "$stdout" 2> "$stderr"
  status=$?
  set -e
  if ! audit_stage_trace "$trace" "$stage" "$status" "$audit_policy" "$audit_owner" "$launch_identity"; then
    printf 'prohibited traced activity during stage %s: %s; child status: %d; trace: %s; stdout: %s; stderr: %s\n' \
      "$stage" "$trace_audit_error" "$status" "$trace" "$stdout" "$stderr" >&2
    sed -n '1,80p' "$trace" >&2
    sed -n '1,80p' "$stdout" >&2
    sed -n '1,80p' "$stderr" >&2
    return 1
  fi
  if [[ "$status" -ne 0 ]]; then
    printf 'stage %s failed with status %d; stdout: %s; stderr: %s\n' "$stage" "$status" "$stdout" "$stderr" >&2
    sed -n '1,80p' "$stdout" >&2
    sed -n '1,80p' "$stderr" >&2
    return 1
  fi
  if [[ "$trace_audit_tolerated_probes" -ne 0 ]]; then
    printf 'PASS %s tolerated_local_socket_probes=%d\n' "$stage" "$trace_audit_tolerated_probes"
    case "$stage" in
      source-precheck) source_precheck_probe_count="$trace_audit_tolerated_probes" ;;
      source-postcheck) source_postcheck_probe_count="$trace_audit_tolerated_probes" ;;
    esac
  fi
  if [[ "$trace_audit_blocked_records" -ne 0 ]]; then
    printf 'PASS %s blocked_no_effect_records=%d %s\n' "$stage" "$trace_audit_blocked_records" "$trace_audit_blocked_receipt"
  fi
  stage_stdout="$stdout"
}
# END SOURCE PROBE AUDIT CONTRACT

run_codex_stage() {
  local stage="$1"
  shift
  case "$stage" in version|marketplace-add|available-list|install|installed-list) ;; *) return 1 ;; esac
  runtime_wrapper_capability="$fixed_runtime:$stage"
  run_traced_stage "$stage" runtime codex \
    env -i \
    HOME="$private_home" \
    CODEX_HOME="$codex_home" \
    CODEX_SQLITE_HOME="$codex_sqlite_home" \
    TMPDIR="$private_tmp" \
    PATH='/home/jeonhh0061/.nvm/versions/node/v22.22.1/bin:/usr/bin:/bin' \
    /usr/bin/python3 -c "$fd_closure_exec" "$codex_executable" "$@"
}

run_test_stage() {
  local stage="$1"
  shift
  run_traced_stage "$stage" strict helper \
    env -i HOME="$private_home" TMPDIR="$private_tmp" PATH='/usr/bin:/bin' \
    /usr/bin/python3 -c "$fd_closure_exec" "$@"
}

run_source_check_stage() {
  local stage="$1"
  shift
  [[ "$stage" == source-precheck || "$stage" == source-postcheck ]] || {
    printf 'invalid source-check stage: %s\n' "$stage" >&2
    return 1
  }
  run_traced_stage "$stage" source source \
    env -i HOME="$private_home" TMPDIR="$private_tmp" PATH='/usr/bin:/bin' \
    /usr/bin/python3 -c "$fd_closure_exec" "$@"
}

write_tree_inventory() {
  local root="$1" output="$2" entry rel status=0 walk
  walk="$(mktemp "$target/inventory-walk.XXXXXX")" || return 1
  if ! find "$root" -mindepth 1 -print0 > "$walk"; then
    printf 'tree traversal failed: %s\n' "$root" >&2
    rm -f -- "$walk"
    return 1
  fi
  : > "$output"
  while IFS= read -r -d '' entry; do
    rel="${entry#"$root"/}"
    if [[ -L "$entry" ]]; then
      printf 'symlink\t%s\n' "$rel" >&2
      status=1
      break
    elif [[ -d "$entry" ]]; then
      printf 'd\t%s\n' "$rel" >> "$output"
    elif [[ -f "$entry" ]]; then
      printf 'f\t%s\n' "$rel" >> "$output"
    else
      printf 'unsupported\t%s\n' "$rel" >&2
      status=1
      break
    fi
  done < "$walk"
  rm -f -- "$walk"
  [[ "$status" -eq 0 ]] || return 1
  LC_ALL=C sort -o "$output" "$output"
}

# BEGIN FROZEN PACKAGE CONTRACT
write_tree_manifest() {
  local root="$1" output="$2" entry rel digest status=0 walk
  [[ -d "$root" && ! -L "$root" && -r "$root" ]] || {
    printf 'manifest root is not a readable real directory: %s\n' "$root" >&2
    return 1
  }
  walk="$(mktemp "$target/manifest-walk.XXXXXX")" || return 1
  if ! find "$root" -mindepth 1 -print0 > "$walk"; then
    printf 'tree traversal failed: %s\n' "$root" >&2
    rm -f -- "$walk"
    return 1
  fi
  : > "$output"
  while IFS= read -r -d '' entry; do
    rel="${entry#"$root"/}"
    if [[ "$rel" == *$'\n'* || "$rel" == *$'\r'* || "$rel" == *$'\t'* ]]; then
      printf 'unsafe manifest path: %q\n' "$rel" >&2
      status=1
      break
    fi
    if [[ -L "$entry" ]]; then
      printf 'symlink\t%s\n' "$rel" >&2
      status=1
      break
    elif [[ -d "$entry" ]]; then
      printf 'd\t%s\n' "$rel" >> "$output"
    elif [[ -f "$entry" ]]; then
      digest="$(sha256sum < "$entry")" || {
        status=1
        break
      }
      printf 'f\t%s\t%s\n' "${digest%% *}" "$rel" >> "$output"
    else
      printf 'unsupported\t%s\n' "$rel" >&2
      status=1
      break
    fi
  done < "$walk"
  rm -f -- "$walk"
  [[ "$status" -eq 0 ]] || return 1
  LC_ALL=C sort -o "$output" "$output"
}

tree_matches_manifest() {
  local root="$1" expected="$2" observed="$3"
  write_tree_manifest "$root" "$observed" || return 1
  cmp -s -- "$expected" "$observed"
}

frozen_manifest_identity_is_valid() {
  local observed_digest
  observed_digest="$(sha256sum -- "$frozen_package_manifest")" || return 1
  observed_digest="${observed_digest%% *}"
  [[ "$observed_digest" == "$frozen_package_digest" ]]
}

freeze_package() {
  local first="$target/frozen-package-first.manifest"
  write_tree_manifest "$package_root" "$first" || return 1
  write_tree_manifest "$package_root" "$frozen_package_manifest" || return 1
  cmp -s -- "$first" "$frozen_package_manifest" || {
    printf 'package changed while the frozen manifest was created\n' >&2
    return 1
  }
  frozen_package_digest="$(sha256sum -- "$frozen_package_manifest")" || return 1
  frozen_package_digest="${frozen_package_digest%% *}"
  frozen_package_dirs="$(sed -n '/^d\t/p' "$frozen_package_manifest" | wc -l)"
  frozen_package_files="$(sed -n '/^f\t/p' "$frozen_package_manifest" | wc -l)"
}

verify_frozen_tree() {
  local root="$1" label="$2" observed
  observed="$target/$label.manifest"
  frozen_manifest_identity_is_valid || {
    printf 'frozen package manifest digest changed: %s\n' "$frozen_package_manifest" >&2
    return 1
  }
  if ! tree_matches_manifest "$root" "$frozen_package_manifest" "$observed"; then
    printf 'frozen package manifest mismatch for %s; expected: %s; observed: %s\n' \
      "$label" "$frozen_package_manifest" "$observed" >&2
    return 1
  fi
}
# END FROZEN PACKAGE CONTRACT

tree_matches_package() {
  local expected_root="$1" actual_root="$2" rel line
  local expected_inventory="$target/expected.inventory" actual_inventory="$target/actual.inventory"
  write_tree_inventory "$expected_root" "$expected_inventory" || return 1
  write_tree_inventory "$actual_root" "$actual_inventory" || return 1
  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    printf 'first missing or type-mismatched path: %s\n' "${line#*$'\t'}" >&2
    return 1
  done < <(LC_ALL=C comm -23 "$expected_inventory" "$actual_inventory")
  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    printf 'first extra or type-mismatched path: %s\n' "${line#*$'\t'}" >&2
    return 1
  done < <(LC_ALL=C comm -13 "$expected_inventory" "$actual_inventory")
  while IFS= read -r rel; do
    [[ -n "$rel" ]] || continue
    if ! cmp -s -- "$expected_root/$rel" "$actual_root/$rel"; then
      printf 'first byte-mismatched path: %s\n' "$rel" >&2
      return 1
    fi
  done < <(sed -n 's/^f\t//p' "$expected_inventory")
}

hookless_tree() {
  local root="$1"
  [[ -f "$root/.codex-plugin/plugin.json" && -f "$root/.claude-plugin/plugin.json" ]] || return 1
  [[ ! -e "$root/hooks" && ! -L "$root/hooks" ]] || return 1
  jq -e 'has("hooks") | not' "$root/.codex-plugin/plugin.json" >/dev/null 2>&1 || return 1
  jq -e 'has("hooks") | not' "$root/.claude-plugin/plugin.json" >/dev/null 2>&1 || return 1
}

package_only_skill_absent() {
  local root="$1" entry rel segment raw status=0 walk
  local -a segments=()
  walk="$(mktemp "$target/token-walk.XXXXXX")" || return 1
  if ! find -P "$root" -mindepth 1 -print0 > "$walk"; then
    printf 'package-only token traversal failed: %s\n' "$root" >&2
    rm -f -- "$walk"
    return 1
  fi
  while IFS= read -r -d '' entry; do
    rel="${entry#"$root"/}"
    IFS='/' read -r -a segments <<< "$rel"
    for segment in "${segments[@]}"; do
      if [[ "$segment" == "$package_only_skill" ]]; then
        status=1
        break 2
      fi
    done
    if [[ -L "$entry" ]]; then
      raw="$(readlink -n -- "$entry")" || {
        status=1
        break
      }
      if [[ "$raw" =~ $package_only_skill_token_regex ]]; then
        status=1
        break
      fi
    elif [[ -f "$entry" ]] && LC_ALL=C grep -aEq -- "$package_only_skill_token_regex" "$entry"; then
      status=1
      break
    fi
  done < "$walk"
  rm -f -- "$walk"
  [[ "$status" -eq 0 ]]
}

assert_invalid_usage_no_artifact() {
  local label="$1" status marker="$target/invalid-$1.mktemp" stdout="$target/invalid-$1.stdout"
  local stderr="$target/invalid-$1.stderr"
  shift
  set +e
  env -i PATH='/usr/bin:/bin' BASH_ENV="$target/mktemp-probe.bash" \
    GOBBI_SMOKE_MKTEMP_MARKER="$marker" /usr/bin/bash "$smoke_script" "$@" \
    > "$stdout" 2> "$stderr"
  status=$?
  set -e
  [[ "$status" -eq 2 ]] || return 1
  [[ ! -s "$stdout" ]] || return 1
  [[ "$(< "$stderr")" == "usage: $smoke_script [--self-test]" ]] || return 1
  [[ ! -e "$marker" && ! -L "$marker" ]]
}

write_exact_source_probe_trace() {
  local output="$1" count="$2" index family
  : > "$output"
  for ((index = 1; index <= count; index++)); do
    family=AF_UNIX
    ((index % 2 == 0)) && family=AF_LOCAL
    printf '%d socket(%s, SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK, 0) = -1 EACCES (Permission denied) (INJECTED)\n' \
      "$((900 + index))" "$family" >> "$output"
  done
}

run_helper_self_tests() {
  local fixture="$target/helper" expected="$target/helper-expected" actual="$target/helper-actual"
  local diagnostic first_line inherited_probe runtime_syscall launch_identity replacement_identity frozen_a="$target/helper-frozen-a"
  local frozen_b="$target/helper-frozen-b" frozen_installed="$target/helper-frozen-installed"
  mkdir -p "$fixture/inside" "$expected/nested" "$actual/nested"
  printf '%s\n' 'mktemp() { : > "$GOBBI_SMOKE_MKTEMP_MARKER"; return 99; }' > "$target/mktemp-probe.bash"
  assert_invalid_usage_no_artifact literal-run run || fail 'literal run usage reached artifact creation'
  assert_invalid_usage_no_artifact empty '' || fail 'empty usage reached artifact creation'
  assert_invalid_usage_no_artifact bad --bad || fail 'unknown usage reached artifact creation'
  assert_invalid_usage_no_artifact extra --self-test extra || fail 'extra usage reached artifact creation'
  strictly_contained "$fixture/inside" "$fixture" || fail 'containment rejected a real descendant'
  ! strictly_contained "$fixture" "$fixture" || fail 'containment accepted equality'
  mkdir "$target/helper-sibling"
  ! strictly_contained "$target/helper-sibling" "$fixture" || fail 'containment accepted a sibling prefix'
  mkdir "$fixture/outside"
  ln -s '../outside' "$fixture/inside/escape"
  ! strictly_contained "$fixture/inside/escape" "$fixture/inside" || fail 'containment accepted a symlink escape'
  printf 'same\n' > "$expected/nested/file"
  cp "$expected/nested/file" "$actual/nested/file"
  tree_matches_package "$expected" "$actual" || fail 'tree comparator rejected equal trees'
  rm -f "$actual/nested/file"
  diagnostic="$target/helper-missing.diagnostic"
  ! tree_matches_package "$expected" "$actual" >/dev/null 2> "$diagnostic" || fail 'tree comparator accepted an omitted file'
  grep -Fx 'first missing or type-mismatched path: nested/file' "$diagnostic" >/dev/null \
    || fail 'tree comparator did not name the first missing path exactly'
  printf 'changed\n' > "$actual/nested/file"
  diagnostic="$target/helper-byte.diagnostic"
  ! tree_matches_package "$expected" "$actual" >/dev/null 2> "$diagnostic" || fail 'tree comparator accepted changed bytes'
  grep -Fx 'first byte-mismatched path: nested/file' "$diagnostic" >/dev/null \
    || fail 'tree comparator did not name the first byte mismatch exactly'
  rm -f "$actual/nested/file"
  mkdir "$actual/nested/file"
  diagnostic="$target/helper-type.diagnostic"
  ! tree_matches_package "$expected" "$actual" >/dev/null 2> "$diagnostic" || fail 'tree comparator accepted a type mismatch'
  grep -Fx 'first missing or type-mismatched path: nested/file' "$diagnostic" >/dev/null \
    || fail 'tree comparator did not name the first type mismatch exactly'
  rmdir "$actual/nested/file"
  cp "$expected/nested/file" "$actual/nested/file"
  printf 'extra\n' > "$actual/extra"
  diagnostic="$target/helper-extra.diagnostic"
  ! tree_matches_package "$expected" "$actual" >/dev/null 2> "$diagnostic" || fail 'tree comparator accepted an extra file'
  grep -Fx 'first extra or type-mismatched path: extra' "$diagnostic" >/dev/null \
    || fail 'tree comparator did not name the first extra path exactly'
  rm -f "$actual/extra" "$actual/nested/file"
  ln -s "$expected/nested/file" "$actual/nested/file"
  ! write_tree_inventory "$actual" "$target/helper-symlink.inventory" >/dev/null 2>&1 || fail 'inventory accepted a symlink'
  rm -f "$actual/nested/file"
  mkfifo "$actual/nested/special"
  ! write_tree_inventory "$actual" "$target/helper-special.inventory" >/dev/null 2>&1 || fail 'inventory accepted a special entry'
  rm -f "$actual/nested/special"
  mkdir -p "$frozen_a/empty" "$frozen_a/nested" "$frozen_b/nested" "$frozen_b/empty" "$frozen_installed"
  printf 'frozen\n' > "$frozen_a/nested/file with space"
  printf 'frozen\n' > "$frozen_b/nested/file with space"
  printf 'backslash\n' > "$frozen_a/nested/back\\slash"
  printf 'backslash\n' > "$frozen_b/nested/back\\slash"
  write_tree_manifest "$frozen_a" "$target/helper-frozen-a.manifest" || fail 'manifest rejected a valid tree'
  write_tree_manifest "$frozen_b" "$target/helper-frozen-b.manifest" || fail 'manifest rejected creation-order parity'
  cmp -s "$target/helper-frozen-a.manifest" "$target/helper-frozen-b.manifest" \
    || fail 'manifest depends on tree creation order'
  cp -R "$frozen_a/." "$frozen_installed"
  frozen_package_manifest="$target/helper-frozen-a.manifest"
  frozen_package_digest="$(sha256sum "$frozen_package_manifest")"
  frozen_package_digest="${frozen_package_digest%% *}"
  verify_frozen_tree "$frozen_a" helper-frozen-source || fail 'frozen source did not match its manifest'
  verify_frozen_tree "$frozen_installed" helper-frozen-installed || fail 'installed copy did not match frozen manifest'
  rmdir "$frozen_installed/empty"
  ! verify_frozen_tree "$frozen_installed" helper-frozen-empty-missing >/dev/null 2>&1 \
    || fail 'frozen verifier accepted a removed empty directory'
  mkdir "$frozen_installed/empty" "$frozen_installed/extra-empty"
  ! verify_frozen_tree "$frozen_installed" helper-frozen-empty-extra >/dev/null 2>&1 \
    || fail 'frozen verifier accepted an added empty directory'
  rmdir "$frozen_installed/extra-empty"
  rm -f "$frozen_installed/nested/file with space"
  ! verify_frozen_tree "$frozen_installed" helper-frozen-file-missing >/dev/null 2>&1 \
    || fail 'frozen verifier accepted a missing file'
  mkdir "$frozen_installed/nested/file with space"
  ! verify_frozen_tree "$frozen_installed" helper-frozen-type-change >/dev/null 2>&1 \
    || fail 'frozen verifier accepted a file-to-directory change'
  rmdir "$frozen_installed/nested/file with space"
  printf 'frozen\n' > "$frozen_installed/nested/file with space"
  printf 'mutated\n' > "$frozen_a/nested/file with space"
  printf 'mutated\n' > "$frozen_installed/nested/file with space"
  ! verify_frozen_tree "$frozen_a" helper-frozen-source-mutated >/dev/null 2>&1 \
    || fail 'frozen verifier accepted a changed source'
  ! verify_frozen_tree "$frozen_installed" helper-frozen-installed-mutated >/dev/null 2>&1 \
    || fail 'frozen verifier accepted a matching live/installed mutation'
  cp "$frozen_package_manifest" "$target/helper-frozen-backup.manifest"
  printf 'corrupt\n' >> "$frozen_package_manifest"
  ! frozen_manifest_identity_is_valid || fail 'frozen manifest digest corruption was accepted'
  cp "$target/helper-frozen-backup.manifest" "$frozen_package_manifest"
  ln -s nested "$frozen_b/link"
  ! write_tree_manifest "$frozen_b" "$target/helper-frozen-symlink.manifest" >/dev/null 2>&1 \
    || fail 'manifest accepted a symlink'
  rm -f "$frozen_b/link"
  mkfifo "$frozen_b/special"
  ! write_tree_manifest "$frozen_b" "$target/helper-frozen-special.manifest" >/dev/null 2>&1 \
    || fail 'manifest accepted a special entry'
  rm -f "$frozen_b/special"
  ln -s "$frozen_b" "$target/helper-frozen-root-link"
  ! write_tree_manifest "$target/helper-frozen-root-link" "$target/helper-frozen-root-link.manifest" \
      >/dev/null 2>&1 || fail 'manifest accepted a symlink root'
  rm -f "$target/helper-frozen-root-link"
  sha256sum() { return 24; }
  ! write_tree_manifest "$frozen_b" "$target/helper-frozen-hash-failure.manifest" >/dev/null 2>&1 \
    || fail 'manifest lost a hashing failure'
  unset -f sha256sum
  mkdir -p "$fixture/package/.codex-plugin" "$fixture/package/.claude-plugin" "$fixture/package/skills"
  printf '{}\n' > "$fixture/package/.codex-plugin/plugin.json"
  printf '{}\n' > "$fixture/package/.claude-plugin/plugin.json"
  printf '%s-extra x%s %sx\n' "$package_only_skill" "$package_only_skill" "$package_only_skill" \
    > "$fixture/package/skills/neighbor"
  hookless_tree "$fixture/package" || fail 'hook guard rejected a hookless fixture'
  package_only_skill_absent "$fixture/package" || fail 'token guard rejected valid prefixed identifiers'
  mkdir "$fixture/package/skills/$package_only_skill"
  printf 'exact path\n' > "$fixture/package/skills/$package_only_skill/SKILL.md"
  ! package_only_skill_absent "$fixture/package" || fail 'token guard accepted the exact skills path segment'
  rm -f "$fixture/package/skills/$package_only_skill/SKILL.md"
  rmdir "$fixture/package/skills/$package_only_skill"
  printf '\0%s\0' "$package_only_skill" > "$fixture/package/skills/exact.bin"
  ! package_only_skill_absent "$fixture/package" || fail 'token guard accepted an exact binary token'
  rm -f "$fixture/package/skills/exact.bin"
  printf '%s\n' "$package_only_skill" > "$fixture/outside-token"
  ln -s '../../outside-token' "$fixture/package/skills/safe-link"
  package_only_skill_absent "$fixture/package" || fail 'token guard followed symlink target contents'
  ! write_tree_inventory "$fixture/package" "$target/helper-package-symlink.inventory" >/dev/null 2>&1 \
    || fail 'inventory accepted the no-follow symlink fixture'
  rm -f "$fixture/package/skills/safe-link"
  ln -s "../$package_only_skill/target" "$fixture/package/skills/safe-link"
  ! package_only_skill_absent "$fixture/package" || fail 'token guard accepted an exact token in a symlink target'
  rm -f "$fixture/package/skills/safe-link"
  mkdir "$fixture/package/hooks"
  ! hookless_tree "$fixture/package" || fail 'hook guard accepted a hooks directory'
  rmdir "$fixture/package/hooks"
  printf '{"hooks":"./hooks/codex"}\n' > "$fixture/package/.codex-plugin/plugin.json"
  ! hookless_tree "$fixture/package" || fail 'hook guard accepted the Codex manifest hooks key'
  printf '{}\n' > "$fixture/package/.codex-plugin/plugin.json"
  printf '{"hooks":"./hooks/claude"}\n' > "$fixture/package/.claude-plugin/plugin.json"
  ! hookless_tree "$fixture/package" || fail 'hook guard accepted the Claude manifest hooks key'
  printf '{}\n' > "$fixture/package/.claude-plugin/plugin.json"
  [[ ",$deny_set," == *',io_uring_setup,'* && ",$deny_set," == *',pidfd_getfd'* ]] \
    || fail 'deny set omits io_uring_setup or pidfd_getfd'
  [[ ",$deny_set," != *',socketpair,'* ]] || fail 'deny set incorrectly blocks socketpair'
  run_test_stage helper-unix-socketpair /usr/bin/python3 -c \
    'import socket; left, right = socket.socketpair(); left.sendall(b"local"); assert right.recv(5) == b"local"' \
    || fail 'AF_UNIX socketpair exchange was rejected'
  grep -aF 'socketpair(AF_UNIX,' "$trace_root/helper-unix-socketpair.trace" >/dev/null \
    || fail 'AF_UNIX socketpair was not traced'
  grep -aF 'sendto(' "$trace_root/helper-unix-socketpair.trace" >/dev/null \
    || fail 'AF_UNIX send was not traced'
  grep -aF 'recvfrom(' "$trace_root/helper-unix-socketpair.trace" >/dev/null \
    || fail 'AF_UNIX receive was not traced'
  diagnostic="$target/helper-stage-inet.diagnostic"
  if run_test_stage helper-inet /usr/bin/python3 -c \
      'import socket,sys; print("fixture-out"); print("fixture-err", file=sys.stderr); exec("try:\n socket.socket(socket.AF_INET, socket.SOCK_STREAM)\nexcept OSError:\n pass")' \
      >/dev/null 2> "$diagnostic"; then
    fail 'traced stage accepted a caught AF_INET socket attempt after a zero child exit'
  fi
  grep -aF 'prohibited traced activity during stage helper-inet' "$diagnostic" >/dev/null \
    || fail 'traced stage omitted the prohibited-attempt diagnostic'
  grep -Fx 'fixture-out' "$trace_root/helper-inet.stdout" >/dev/null \
    || fail 'traced stage did not retain stdout'
  grep -F 'fixture-err' "$trace_root/helper-inet.stderr" >/dev/null \
    || fail 'traced stage did not retain stderr'
  grep -aF 'socket(AF_INET,' "$trace_root/helper-inet.trace" >/dev/null \
    || fail 'traced stage did not record the AF_INET socket attempt'
  grep -aF '(INJECTED)' "$trace_root/helper-inet.trace" >/dev/null \
    || fail 'traced stage did not inject EACCES'
  diagnostic="$target/helper-descendant.diagnostic"
  if run_test_stage helper-descendant /usr/bin/python3 -c \
      'import subprocess; subprocess.run(["/usr/bin/python3", "-c", "import socket; exec(\"try:\\n socket.socket(socket.AF_INET6, socket.SOCK_STREAM)\\nexcept OSError:\\n pass\")"], check=True)' \
      >/dev/null 2> "$diagnostic"; then
    fail 'traced stage missed a caught descendant AF_INET6 attempt'
  fi
  grep -aF 'socket(AF_INET6,' "$trace_root/helper-descendant.trace" >/dev/null \
    || fail 'descendant AF_INET6 attempt was not traced'
  printf 'inherited\n' > "$fixture/inherited-fd"
  exec 200< "$fixture/inherited-fd"
  [[ -e /proc/$$/fd/200 ]] || fail 'caller high descriptor was not opened'
  (
    ulimit -S -n 64
    run_test_stage helper-fd-closure /usr/bin/python3 -c \
      'import errno,os,sys; exec("try:\n os.fstat(200)\nexcept OSError as exc:\n assert exc.errno == errno.EBADF\nelse:\n raise SystemExit(1)"); assert sys.stdin.buffer.read() == b""'
  ) || fail 'fd-closure wrapper did not close fd 200 above the lowered soft limit or isolate stdin'
  IFS= read -r inherited_probe <&200
  [[ "$inherited_probe" == inherited ]] || fail 'fd-closure wrapper changed the caller descriptor'
  exec 200<&-
  printf '1 socketpair(AF_UNIX, SOCK_STREAM, 0, [3<UNIX-STREAM:[1]>, 4<UNIX-STREAM:[2]>]) = 0\n' \
    > "$trace_root/helper-synthetic-unix.trace"
  audit_trace "$trace_root/helper-synthetic-unix.trace" || fail 'audit rejected a synthetic AF_UNIX socketpair'
  printf '1 socketpair(AF_NETLINK, SOCK_RAW, 0, [3, 4]) = 0\n' > "$trace_root/helper-synthetic-nonlocal.trace"
  ! audit_trace "$trace_root/helper-synthetic-nonlocal.trace" || fail 'audit accepted a nonlocal socketpair family'
  printf '1 sendto(7<TCP:[1]>, "x", 1, 0, NULL, 0) = 1\n' > "$trace_root/helper-synthetic-send.trace"
  ! audit_trace "$trace_root/helper-synthetic-send.trace" || fail 'audit accepted send on an unproved descriptor'
  write_exact_source_probe_trace "$trace_root/helper-source-probes.trace" 4
  audit_trace "$trace_root/helper-source-probes.trace" source-precheck 0 source \
    || fail 'source-precheck audit rejected four exact local no-effect probes'
  [[ "$trace_audit_tolerated_probes" -eq 4 ]] || fail 'source-precheck audit reported the wrong probe count'
  audit_trace "$trace_root/helper-source-probes.trace" source-postcheck 0 source \
    || fail 'source-postcheck audit rejected four exact local no-effect probes'
  ! audit_trace "$trace_root/helper-source-probes.trace" version 0 strict \
    || fail 'runtime-stage audit accepted source-only injected probes'
  ! audit_trace "$trace_root/helper-source-probes.trace" source-precheck 7 source \
    || fail 'source-stage audit accepted probes with nonzero child status'
  write_exact_source_probe_trace "$trace_root/helper-source-probes-three.trace" 3
  ! audit_trace "$trace_root/helper-source-probes-three.trace" source-precheck 0 source \
    || fail 'source-stage audit accepted three probes'
  write_exact_source_probe_trace "$trace_root/helper-source-probes-five.trace" 5
  ! audit_trace "$trace_root/helper-source-probes-five.trace" source-precheck 0 source \
    || fail 'source-stage audit accepted five probes'
  cp "$trace_root/helper-source-probes.trace" "$trace_root/helper-source-wrong-flags.trace"
  sed -i '1s/SOCK_STREAM|SOCK_CLOEXEC|SOCK_NONBLOCK/SOCK_STREAM|SOCK_CLOEXEC/' \
    "$trace_root/helper-source-wrong-flags.trace"
  ! audit_trace "$trace_root/helper-source-wrong-flags.trace" source-precheck 0 source \
    || fail 'source-stage audit accepted wrong probe flags'
  cp "$trace_root/helper-source-probes.trace" "$trace_root/helper-source-wrong-family.trace"
  sed -i '1s/AF_UNIX/AF_INET/' "$trace_root/helper-source-wrong-family.trace"
  ! audit_trace "$trace_root/helper-source-wrong-family.trace" source-precheck 0 source \
    || fail 'source-stage audit accepted a nonlocal probe family'
  cp "$trace_root/helper-source-probes.trace" "$trace_root/helper-source-wrong-result.trace"
  sed -i '1s/= -1 EACCES (Permission denied) (INJECTED)/= 3<UNIX-STREAM:[1]>/' \
    "$trace_root/helper-source-wrong-result.trace"
  ! audit_trace "$trace_root/helper-source-wrong-result.trace" source-precheck 0 source \
    || fail 'source-stage audit accepted a successful socket result'
  cp "$trace_root/helper-source-probes.trace" "$trace_root/helper-source-other-injection.trace"
  sed -i '1c\901 connect(3, {sa_family=AF_UNIX}, 2) = -1 EACCES (Permission denied) (INJECTED)' \
    "$trace_root/helper-source-other-injection.trace"
  ! audit_trace "$trace_root/helper-source-other-injection.trace" source-precheck 0 source \
    || fail 'source-stage audit accepted another injected syscall'
  printf '951 io_uring_setup(1024, {flags=0}) = -1 EACCES (Permission denied) (INJECTED)\n951 +++ exited with 0 +++\n' \
    > "$trace_root/helper-runtime-denied.trace"
  chmod 600 "$trace_root/helper-runtime-denied.trace"
  audit_trace "$trace_root/helper-runtime-denied.trace" version 0 runtime codex \
    || fail 'runtime audit rejected a complete blocked no-effect record'
  [[ "$trace_audit_blocked_records" -eq 1 ]] || fail 'runtime audit reported the wrong blocked-record count'
  [[ "$trace_audit_blocked_receipt" == 'stage=version syscall=io_uring_setup family=none' ]] \
    || fail 'runtime audit receipt omitted the stage, syscall, or family'
  ! audit_trace "$trace_root/helper-runtime-denied.trace" helper-audit 0 strict \
    || fail 'strict helper audit accepted a runtime blocked no-effect record'
  ! audit_trace "$trace_root/helper-runtime-denied.trace" unknown-stage 0 runtime codex \
    || fail 'runtime audit accepted an unknown stage'
  ! audit_trace "$trace_root/helper-runtime-denied.trace" version 7 runtime codex \
    || fail 'runtime audit accepted a nonzero child'
  cp "$trace_root/helper-runtime-denied.trace" "$trace_root/helper-runtime-wrong-error.trace"
  sed -i 's/EACCES (Permission denied)/EPERM (Operation not permitted)/' "$trace_root/helper-runtime-wrong-error.trace"
  ! audit_trace "$trace_root/helper-runtime-wrong-error.trace" version 0 runtime codex \
    || fail 'runtime audit accepted the wrong injected error'
  cp "$trace_root/helper-runtime-denied.trace" "$trace_root/helper-runtime-unmarked.trace"
  sed -i 's/ (INJECTED)$//' "$trace_root/helper-runtime-unmarked.trace"
  ! audit_trace "$trace_root/helper-runtime-unmarked.trace" version 0 runtime codex \
    || fail 'runtime audit accepted an unmarked denial'
  printf '951 io_uring_setup(1024, {flags=0} <unfinished ...>\n' > "$trace_root/helper-runtime-unfinished.trace"
  chmod 600 "$trace_root/helper-runtime-unfinished.trace"
  ! audit_trace "$trace_root/helper-runtime-unfinished.trace" version 0 runtime codex \
    || fail 'runtime audit accepted unfinished evidence'
  : > "$trace_root/helper-runtime-empty.trace"
  chmod 600 "$trace_root/helper-runtime-empty.trace"
  ! audit_trace "$trace_root/helper-runtime-empty.trace" version 0 runtime codex \
    || fail 'runtime audit accepted empty evidence'
  ! audit_trace "$trace_root/helper-runtime-empty.trace" helper-audit 0 strict helper \
    || fail 'strict helper audit accepted empty evidence'
  for runtime_syscall in socket socketcall connect bind listen accept accept4 io_uring_setup pidfd_getfd; do
    printf '960 %s(0) = -1 EACCES (Permission denied) (INJECTED)\n960 +++ exited with 0 +++\n' "$runtime_syscall" \
      > "$trace_root/helper-runtime-$runtime_syscall.trace"
    chmod 600 "$trace_root/helper-runtime-$runtime_syscall.trace"
    audit_trace "$trace_root/helper-runtime-$runtime_syscall.trace" version 0 runtime codex \
      || fail "runtime audit rejected fixed-deny syscall $runtime_syscall"
  done
  printf '970 socket(AF_INET, SOCK_STREAM, IPPROTO_TCP) = 3<TCP:[1]>\n970 +++ exited with 0 +++\n' > "$trace_root/helper-runtime-success.trace"
  chmod 600 "$trace_root/helper-runtime-success.trace"
  ! audit_trace "$trace_root/helper-runtime-success.trace" version 0 runtime codex || fail 'runtime audit accepted successful acquisition'
  printf '971 io_uring_setup(1, {}) = -1 EACCES (Permission denied) (INJECTED) trailing\n971 +++ exited with 0 +++\n' > "$trace_root/helper-runtime-suffix.trace"
  chmod 600 "$trace_root/helper-runtime-suffix.trace"
  ! audit_trace "$trace_root/helper-runtime-suffix.trace" version 0 runtime codex || fail 'runtime audit accepted a malformed suffix'
  printf '972 io_uring_setup(1, {}) = -1 EACCES (Permission denied) (INJECTED)' > "$trace_root/helper-runtime-truncated.trace"
  chmod 600 "$trace_root/helper-runtime-truncated.trace"
  ! audit_trace "$trace_root/helper-runtime-truncated.trace" version 0 runtime codex || fail 'runtime audit accepted an unterminated tail'
  printf '973 <... socket resumed>) = -1 EACCES (Permission denied) (INJECTED)\n973 +++ exited with 0 +++\n' > "$trace_root/helper-runtime-resumed.trace"
  chmod 600 "$trace_root/helper-runtime-resumed.trace"
  ! audit_trace "$trace_root/helper-runtime-resumed.trace" version 0 runtime codex || fail 'runtime audit accepted resumed evidence'
  printf '951 io_uring_setup(1, {}) = -1 EACCES (Permission denied) (INJECTED)\n' > "$trace_root/helper-runtime-no-terminal.trace"
  ! audit_trace "$trace_root/helper-runtime-no-terminal.trace" version 0 runtime codex || fail 'runtime audit accepted a missing terminal record'
  printf '951 io_uring_setup(1, {}) = -1 EACCES (Permission denied) (INJECTED)\n952 +++ exited with 0 +++\n' > "$trace_root/helper-runtime-wrong-terminal-pid.trace"
  ! audit_trace "$trace_root/helper-runtime-wrong-terminal-pid.trace" version 0 runtime codex || fail 'runtime audit accepted a mismatched terminal pid'
  printf '951 io_uring_setup(1, {}) = -1 EACCES (Permission denied) (INJECTED)\n951 +++ exited with 7 +++\n' > "$trace_root/helper-runtime-nonzero-terminal.trace"
  ! audit_trace "$trace_root/helper-runtime-nonzero-terminal.trace" version 0 runtime codex || fail 'runtime audit accepted a nonzero terminal status'
  printf '951 io_uring_setup(1, {}) = -1 EACCES (Permission denied) (INJECTED)\n951 +++ killed by SIGTERM +++\n' > "$trace_root/helper-runtime-killed-terminal.trace"
  ! audit_trace "$trace_root/helper-runtime-killed-terminal.trace" version 0 runtime codex || fail 'runtime audit accepted a killed terminal record'
  printf '951 io_uring_setup(1, {}) = -1 EACCES (Permission denied) (INJECTED)\n951 +++ exited with 0 +++\n951 +++ exited with 0 +++\n' > "$trace_root/helper-runtime-duplicate-terminal.trace"
  ! audit_trace "$trace_root/helper-runtime-duplicate-terminal.trace" version 0 runtime codex || fail 'runtime audit accepted a duplicate terminal record'
  ! audit_trace "$trace_root/helper-runtime-denied.trace" version 0 runtime claude || fail 'Codex audit accepted the wrong runtime owner'
  printf '974 sendto(9<UNIX-STREAM:[123]>, "x", 1, 0, NULL, 0) = 1\n974 +++ exited with 0 +++\n' > "$trace_root/helper-runtime-unproved-unix.trace"
  chmod 600 "$trace_root/helper-runtime-unproved-unix.trace"
  ! audit_trace "$trace_root/helper-runtime-unproved-unix.trace" version 0 runtime codex || fail 'runtime audit accepted Unix-looking traffic without provenance'
  printf '975 socketpair(AF_UNIX, SOCK_STREAM, 0, [3<UNIXfake>, 4<UNIXfake>]) = 0\n975 sendto(3<UNIXfake>, "x", 1, 0, NULL, 0) = 1\n975 +++ exited with 0 +++\n' > "$trace_root/helper-runtime-fake-unix.trace"
  ! audit_trace "$trace_root/helper-runtime-fake-unix.trace" version 0 runtime codex || fail 'runtime audit accepted a fake Unix descriptor'
  printf '976 socketpair(AF_UNIX, SOCK_STREAM, 0, [3<UNIX-STREAM:[101->102]>, 4<UNIX-STREAM:[102->101]>]) = 0\n976 sendto(3<UNIX-STREAM:[101->102]>, "x", 1, 0, NULL, 0) = 1\n976 +++ exited with 0 +++\n' > "$trace_root/helper-runtime-proved-unix.trace"
  audit_trace "$trace_root/helper-runtime-proved-unix.trace" version 0 runtime codex || fail 'runtime audit rejected exact socketpair provenance'
  sed 's/sendto(3<UNIX-STREAM:\[101->102\]>/sendto(3<UNIX-STREAM:[999]>/' "$trace_root/helper-runtime-proved-unix.trace" > "$trace_root/helper-runtime-reused-unix.trace"
  ! audit_trace "$trace_root/helper-runtime-reused-unix.trace" version 0 runtime codex || fail 'runtime audit accepted a different Unix identity'
  runtime_wrapper_capability=''
  rm -f "$target/helper-runtime-command-ran"
  ! run_traced_stage version runtime codex /usr/bin/touch "$target/helper-runtime-command-ran" >/dev/null 2>&1 \
    || fail 'direct runtime selection bypassed the wrapper capability'
  [[ ! -e "$target/helper-runtime-command-ran" ]] || fail 'rejected direct runtime selection executed its command'
  runtime_wrapper_capability='codex:version'
  ! run_traced_stage version runtime claude /usr/bin/touch "$target/helper-runtime-command-ran" >/dev/null 2>&1 \
    || fail 'wrong runtime owner reached execution'
  [[ ! -e "$target/helper-runtime-command-ran" ]] || fail 'wrong runtime owner executed its command'
  runtime_wrapper_capability='codex:unknown-stage'
  ! run_traced_stage unknown-stage runtime codex /usr/bin/touch "$target/helper-runtime-command-ran" >/dev/null 2>&1 \
    || fail 'unknown runtime stage reached execution'
  [[ ! -e "$target/helper-runtime-command-ran" ]] || fail 'unknown runtime stage executed its command'
  ln -s helper-runtime-denied.trace "$trace_root/version.trace"
  ! audit_stage_trace "$trace_root/version.trace" version 0 runtime codex || fail 'runtime trace authentication accepted a symlink'
  rm -f "$trace_root/version.trace"
  cp "$trace_root/helper-runtime-denied.trace" "$trace_root/version.trace"
  chmod 600 "$trace_root/version.trace"
  launch_identity="$(stat -c '%d:%i' -- "$trace_root/version.trace")"
  audit_stage_trace "$trace_root/version.trace" version 0 runtime codex "$launch_identity" \
    || fail 'runtime trace authentication rejected a bound private trace'
  chmod 640 "$trace_root/version.trace"
  ! audit_stage_trace "$trace_root/version.trace" version 0 runtime codex "$launch_identity" \
    || fail 'runtime trace authentication accepted the wrong mode'
  chmod 600 "$trace_root/version.trace"
  cp "$trace_root/helper-runtime-denied.trace" "$trace_root/replacement.trace"
  replacement_identity="$(stat -c '%d:%i' -- "$trace_root/version.trace")"
  mv "$trace_root/replacement.trace" "$trace_root/version.trace"
  chmod 600 "$trace_root/version.trace"
  ! audit_stage_trace "$trace_root/version.trace" version 0 runtime codex "$replacement_identity" \
    || fail 'runtime trace authentication accepted a replaced launch target'
  ! audit_stage_trace "$trace_root/helper-runtime-denied.trace" version 0 runtime codex \
      "$(stat -c '%d:%i' -- "$trace_root/helper-runtime-denied.trace")" \
    || fail 'runtime trace authentication accepted the wrong path'
  rm -f "$trace_root/version.trace"
  diagnostic="$target/helper-acquisition.diagnostic"
  if run_test_stage helper-acquisition /usr/bin/python3 -c \
      'import ctypes,os; libc=ctypes.CDLL(None, use_errno=True); assert os.uname().machine in ("x86_64", "aarch64"); libc.syscall(425, 0, 0); libc.syscall(438, -1, -1, 0)' \
      >/dev/null 2> "$diagnostic"; then
    fail 'traced stage accepted io_uring_setup and pidfd_getfd attempts'
  fi
  grep -aF 'io_uring_setup(' "$trace_root/helper-acquisition.trace" >/dev/null \
    || fail 'io_uring_setup deny probe was not traced'
  grep -aF 'pidfd_getfd(' "$trace_root/helper-acquisition.trace" >/dev/null \
    || fail 'pidfd_getfd deny probe was not traced'
  find() { return 23; }
  ! write_tree_inventory "$fixture/package" "$target/helper-find-inventory" >/dev/null 2>&1 \
    || fail 'inventory lost a traversal failure'
  ! write_tree_manifest "$fixture/package" "$target/helper-find-manifest" >/dev/null 2>&1 \
    || fail 'manifest lost a traversal failure'
  ! package_only_skill_absent "$fixture/package" >/dev/null 2>&1 \
    || fail 'token guard lost a traversal failure'
  ! check_top_level_allow_set "$fixture/package" >/dev/null 2>&1 \
    || fail 'top-level guard lost a traversal failure'
  unset -f find
  printf '0\n' > "$fixture/stage-count"
  run_test_stage helper-stage-once /bin/sh -c \
    'count="$(sed -n "1p" "$1")"; count=$((count + 1)); printf "%s\n" "$count" > "$1"' sh "$fixture/stage-count" \
    || fail 'single-execution stage fixture failed'
  [[ "$(< "$fixture/stage-count")" == 1 ]] || fail 'traced stage executed its command more than once'
  diagnostic="$target/helper-trace-first.diagnostic"
  if run_test_stage helper-trace-first /usr/bin/python3 -c \
      'import socket; exec("try:\n socket.socket(socket.AF_INET, socket.SOCK_STREAM)\nexcept OSError:\n pass"); raise SystemExit(7)' \
      >/dev/null 2> "$diagnostic"; then
    fail 'traced stage accepted a prohibited attempt followed by nonzero status'
  fi
  first_line="$(sed -n '1p' "$diagnostic")"
  [[ "$first_line" == prohibited\ traced\ activity\ during\ stage\ helper-trace-first:*'child status: 7;'* ]] \
    || fail 'trace violation did not take diagnostic precedence over child status'
  diagnostic="$target/helper-stage-status.diagnostic"
  if run_test_stage helper-status /bin/sh -c 'printf "status-out\n"; printf "status-err\n" >&2; exit 7' \
      >/dev/null 2> "$diagnostic"; then
    fail 'traced stage accepted a nonzero child status'
  fi
  grep -aF 'stage helper-status failed with status 7' "$diagnostic" >/dev/null \
    || fail 'traced stage omitted the child-status diagnostic'
  grep -Fx 'status-out' "$trace_root/helper-status.stdout" >/dev/null \
    || fail 'status stage did not retain stdout'
  grep -Fx 'status-err' "$trace_root/helper-status.stderr" >/dev/null \
    || fail 'status stage did not retain stderr'
  pass 'Codex smoke helper self-tests passed'
}

check_top_level_allow_set() {
  local root="$1" entry name status=0 walk allowed=' .codex-plugin .claude-plugin skills agents '
  walk="$(mktemp "$target/top-level-walk.XXXXXX")" || return 1
  if ! find "$root" -mindepth 1 -maxdepth 1 -print0 > "$walk"; then
    printf 'top-level traversal failed: %s\n' "$root" >&2
    rm -f -- "$walk"
    return 1
  fi
  while IFS= read -r -d '' entry; do
    name="${entry##*/}"
    if [[ "$allowed" != *" $name "* ]]; then
      printf 'installed cache contains unsupported top-level entry: %s\n' "$name" >&2
      status=1
      break
    fi
  done < "$walk"
  rm -f -- "$walk"
  [[ "$status" -eq 0 ]]
}

for command in jq cmp realpath find sort sed grep comm readlink cp rm mkfifo sha256sum; do
  command -v "$command" >/dev/null 2>&1 || fail "$command is required"
done
[[ -x /usr/bin/strace ]] || fail '/usr/bin/strace is required'
[[ -x /usr/bin/python3 && -x /bin/sh ]] || fail '/usr/bin/python3 and /bin/sh are required'
if [[ "$mode" == --self-test ]]; then
  run_helper_self_tests
  smoke_complete=1
  exit 0
fi
[[ -x "$codex_executable" ]] || fail "$codex_executable is not executable"
resolved_codex="$(readlink -f -- "$codex_executable")"
[[ -f "$resolved_codex" && -x "$resolved_codex" ]] || fail "$codex_executable does not resolve to an executable regular file"
[[ -d "$package_root/skills" && ! -L "$package_root/skills" ]] \
  || fail 'plugins/gobbi/skills is not a materialized filtered directory'
[[ -d "$package_root/agents" && ! -L "$package_root/agents" ]] \
  || fail 'plugins/gobbi/agents is not a materialized directory'
write_tree_inventory "$package_root" "$target/source.inventory" \
  || fail 'source package contains a symlink or unsupported entry'
hookless_tree "$package_root" || fail 'source package contains a hooks field or hooks component'
package_only_skill_absent "$package_root" || fail 'source package contains a registered package-only skill path or literal'
run_source_check_stage source-precheck /usr/bin/bash "$repo_root/scripts/sync-plugin-package.sh" --check \
  || fail 'source package differs from canonical owners or repository source topology is invalid'
freeze_package || fail 'source package could not be frozen before the first runtime stage'
expected_package_version="$(jq -r '.version // empty' "$package_root/.codex-plugin/plugin.json")"
verify_frozen_tree "$package_root" package-metadata-read \
  || fail 'source package changed while frozen metadata was read'

run_codex_stage version --version || fail 'Codex version stage failed or attempted network access'
observed_version="$(< "$stage_stdout")"
[[ "$observed_version" == "$expected_version" ]] || fail "expected $expected_version, got ${observed_version:-<empty>}"
pass "$codex_executable resolves to $resolved_codex at $observed_version"

run_codex_stage marketplace-add plugin marketplace add "$repo_root" --json || fail 'Codex marketplace-add stage failed or attempted network access'
marketplace_add_json="$(< "$stage_stdout")"
marketplace_name="$(jq -r '.marketplaceName // empty' <<< "$marketplace_add_json")"
[[ "$marketplace_name" == gobbi-workspace ]] || fail "expected gobbi-workspace marketplace, got ${marketplace_name:-<empty>}"

run_codex_stage available-list plugin list --marketplace gobbi-workspace --available --json || fail 'Codex available-list stage failed or attempted network access'
available_json="$(< "$stage_stdout")"
jq -e '.available[]? | select(.pluginId == "gobbi@gobbi-workspace")' <<< "$available_json" >/dev/null \
  || fail 'gobbi@gobbi-workspace is not available'

verify_frozen_tree "$package_root" package-before-install \
  || fail 'source package changed before Codex install'
run_codex_stage install plugin add gobbi@gobbi-workspace --json || fail 'Codex install stage failed or attempted network access'
verify_frozen_tree "$package_root" package-after-install \
  || fail 'source package changed during Codex install'
install_json="$(< "$stage_stdout")"
installed_path="$(jq -r '.installedPath // empty' <<< "$install_json")"
[[ -n "$installed_path" && -d "$installed_path" && ! -L "$installed_path" ]] \
  || fail 'plugin add did not return a real installed cache directory'
strictly_contained "$installed_path" "$codex_home" \
  || fail "installed path is not strictly contained by $codex_home: $installed_path"

run_codex_stage installed-list plugin list --marketplace gobbi-workspace --available --json || fail 'Codex installed-list stage failed or attempted network access'
installed_json="$(< "$stage_stdout")"
jq -e --arg version "$expected_package_version" \
  '.installed[]? | select(.pluginId == "gobbi@gobbi-workspace" and .enabled == true and .version == $version)' \
  <<< "$installed_json" >/dev/null || fail 'gobbi@gobbi-workspace installed identity or version does not match the package'

write_tree_inventory "$installed_path" "$target/installed.inventory" \
  || fail 'installed cache contains a symlink or unsupported entry'
check_top_level_allow_set "$installed_path" || fail 'installed cache top-level traversal or allow-set check failed'
hookless_tree "$installed_path" || fail 'installed cache contains a hooks field or hooks component'
package_only_skill_absent "$installed_path" || fail 'installed cache contains a registered package-only skill path or literal'
verify_frozen_tree "$installed_path" installed-cache \
  || fail 'installed cache directory/file inventory or hashes differ from the frozen package'
run_source_check_stage source-postcheck /usr/bin/bash "$repo_root/scripts/sync-plugin-package.sh" --check \
  || fail 'source package or repository source topology drifted during the Codex smoke'
verify_frozen_tree "$package_root" package-before-success \
  || fail 'source package changed before the Codex success receipt'

smoke_complete=1
[[ "$source_precheck_probe_count" -eq 4 && "$source_postcheck_probe_count" -eq 4 ]] \
  || fail 'source-check probe receipts are incomplete before Codex success'
printf 'Codex plugin smoke passed: frozen_sha256=%s dirs=%s files=%s source-precheck-probes=%s source-postcheck-probes=%s\n' \
  "$frozen_package_digest" "$frozen_package_dirs" "$frozen_package_files" \
  "$source_precheck_probe_count" "$source_postcheck_probe_count"
