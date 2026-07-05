#!/usr/bin/env bash
# validate-plugin-publish-readiness.sh
#
# Pre-publish readiness gate for the gobbi plugin package (the A7 version policy).
# Run AFTER `scripts/sync-plugin-package.sh --check`.
#
# It FAILS (non-zero exit) when any of:
#   (a) shipped-surface files changed since the baseline but the installer-visible
#       version did NOT increase (a content change shipped without a bump, so
#       `claude plugin update` would not deliver it),
#   (b) the version-bearing files disagree on the version, or
#   (c) any version-bearing value is not valid semver.
#
# The baseline is NEVER hardcoded — there is no version literal in this script.
# It is derived, in priority order, from:
#   1. an explicit `--base <ref>` argument,
#   2. else `git merge-base HEAD develop`,
#   3. else the latest release tag (`git describe --tags --abbrev=0`).
#
# Usage:
#   bash scripts/validate-plugin-publish-readiness.sh [--base <ref>]
#
# Shipped surface (a change to it requires a version bump):
#   plugins/gobbi/**
#   .gobbi/projects/gobbi/{skills,agents,hooks}/**   (the canonical targets of the
#                                                     plugins/gobbi/{skills,agents,
#                                                     hooks} symlinks; git tracks
#                                                     changes at the real paths)
#   .claude-plugin/marketplace.json                  (the version-bearing marketplace
#                                                     file)
#
# Version-bearing files (must agree + be valid semver):
#   plugins/gobbi/.claude-plugin/plugin.json   ->  .version  (installer-visible)
#   plugins/gobbi/.codex-plugin/plugin.json    ->  .version
#   .claude-plugin/marketplace.json            ->  .plugins[] | select(.name=="gobbi") | .version
#
# NOTE: the Codex marketplace file .agents/plugins/marketplace.json carries NO
# version field, so it is EXCLUDED from the version-bearing set until it gains one.

set -euo pipefail

# ---------------------------------------------------------------------------
# Colour helpers (degrade gracefully when not a tty)
# ---------------------------------------------------------------------------
if [[ -t 1 ]]; then
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RESET='\033[0m'
else
    RED=''; GREEN=''; YELLOW=''; RESET=''
fi

pass() { printf "${GREEN}PASS${RESET}  %s\n" "$*"; }
fail() { printf "${RED}FAIL${RESET}  %s\n" "$*"; FAILURES=$(( FAILURES + 1 )); }
info() { printf "${YELLOW}INFO${RESET}  %s\n" "$*"; }

FAILURES=0

# Semver core (MAJOR.MINOR.PATCH) — the form gobbi versions use. Each numeric
# identifier is `0` OR a non-zero-leading run, so a leading-zero version like
# `01.0.0` is rejected as invalid (per the semver grammar). Deliberately no
# version literal here, so the no-hardcoded-baseline guard stays satisfied.
semver_re='^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$'

# version_gt <a> <b> — exit 0 (true) iff a > b numerically by MAJOR.MINOR.PATCH.
# Both args must already be valid semver (callers guard with semver_re). 10# forces
# base-10 so a leading-zero component is never misread as octal.
version_gt() {
    local a1 a2 a3 b1 b2 b3
    IFS=. read -r a1 a2 a3 <<<"$1"
    IFS=. read -r b1 b2 b3 <<<"$2"
    (( 10#$a1 > 10#$b1 )) && return 0
    (( 10#$a1 < 10#$b1 )) && return 1
    (( 10#$a2 > 10#$b2 )) && return 0
    (( 10#$a2 < 10#$b2 )) && return 1
    (( 10#$a3 > 10#$b3 )) && return 0
    return 1
}

usage() {
    printf 'usage: %s [--base <ref>]\n' "$0" >&2
}

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------
base_ref=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --base)
            [[ $# -ge 2 ]] || { printf 'ERROR: --base requires a ref argument\n' >&2; exit 2; }
            base_ref="$2"; shift 2 ;;
        --base=*)
            base_ref="${1#--base=}"; shift ;;
        -h|--help)
            usage; exit 0 ;;
        *)
            printf 'ERROR: unknown argument: %s\n' "$1" >&2; usage; exit 2 ;;
    esac
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ---------------------------------------------------------------------------
# Baseline resolution (never hardcoded)
# ---------------------------------------------------------------------------
resolve_baseline() {
    if [[ -n "$base_ref" ]]; then
        printf '%s' "$base_ref"; return 0
    fi
    local mb
    if mb=$(git -C "$repo_root" merge-base HEAD develop 2>/dev/null); then
        printf '%s' "$mb"; return 0
    fi
    local tag
    if tag=$(git -C "$repo_root" describe --tags --abbrev=0 2>/dev/null); then
        printf '%s' "$tag"; return 0
    fi
    return 1
}

if ! baseline="$(resolve_baseline)"; then
    printf 'ERROR: could not resolve a baseline ref.\n' >&2
    printf '  Pass --base <ref>, or run where `git merge-base HEAD develop` or a\n' >&2
    printf '  release tag resolves.\n' >&2
    exit 2
fi

if ! git -C "$repo_root" rev-parse --verify --quiet "${baseline}^{commit}" >/dev/null; then
    printf 'ERROR: baseline ref does not resolve to a commit: %s\n' "$baseline" >&2
    exit 2
fi

printf '\n=== validate-plugin-publish-readiness.sh ===\n'
printf 'Repo root : %s\n' "$repo_root"
printf 'Baseline  : %s\n\n' "$baseline"

# ---------------------------------------------------------------------------
# Version-bearing files + their jq selectors
# ---------------------------------------------------------------------------
claude_manifest_rel='plugins/gobbi/.claude-plugin/plugin.json'
codex_manifest_rel='plugins/gobbi/.codex-plugin/plugin.json'
claude_market_rel='.claude-plugin/marketplace.json'

read_json() {  # read_json <relpath> <jq-filter>
    jq -r "$2" "$repo_root/$1" 2>/dev/null || true
}

v_claude=$(read_json "$claude_manifest_rel" '.version')
v_codex=$(read_json "$codex_manifest_rel" '.version')
v_market=$(read_json "$claude_market_rel" '.plugins[] | select(.name=="gobbi") | .version')

# ---------------------------------------------------------------------------
# (c) semver validity + (b) agreement across version-bearing files
# ---------------------------------------------------------------------------
printf '%s\n' '--- version-bearing files ---'

vb_names=( "$claude_manifest_rel" "$codex_manifest_rel" "$claude_market_rel" )
vb_values=( "$v_claude" "$v_codex" "$v_market" )

for i in "${!vb_names[@]}"; do
    name="${vb_names[$i]}"
    val="${vb_values[$i]}"
    if [[ -z "$val" || "$val" == "null" ]]; then
        fail "version missing in ${name}"
    elif [[ ! "$val" =~ $semver_re ]]; then
        fail "version in ${name} is not valid semver: '${val}'"
    else
        pass "valid semver in ${name}: ${val}"
    fi
done

if [[ "$v_claude" == "$v_codex" && "$v_codex" == "$v_market" ]]; then
    pass "version-bearing files agree: ${v_claude}"
else
    fail "version-bearing files DISAGREE: claude='${v_claude}' codex='${v_codex}' marketplace='${v_market}'"
fi

printf '\n'

# ---------------------------------------------------------------------------
# (a) shipped-surface change since baseline must be matched by a version increase
# ---------------------------------------------------------------------------
printf '%s\n' '--- shipped-surface vs version bump ---'

# Installer-visible baseline version: read the Claude plugin manifest AS OF the
# baseline ref. Absent (new file) => no baseline => any valid version is an
# increase.
baseline_version=$(git -C "$repo_root" show "${baseline}:${claude_manifest_rel}" 2>/dev/null \
    | jq -r '.version' 2>/dev/null || true)

# git diff <baseline> -- <paths> compares the baseline to the WORKING TREE, so it
# catches both committed and uncommitted shipped-surface changes about to ship.
mapfile -t changed_files < <(git -C "$repo_root" diff --name-only "$baseline" -- \
    'plugins/gobbi' \
    '.gobbi/projects/gobbi/skills' \
    '.gobbi/projects/gobbi/agents' \
    '.gobbi/projects/gobbi/hooks' \
    "$claude_market_rel" 2>/dev/null || true)

if (( ${#changed_files[@]} > 0 )); then
    info "shipped-surface files changed since ${baseline} (${#changed_files[@]}):"
    for f in "${changed_files[@]}"; do
        info "    ${f}"
    done
    if [[ -z "$baseline_version" || "$baseline_version" == "null" || ! "$baseline_version" =~ $semver_re ]]; then
        pass "no usable baseline version at ${baseline} (new/unparseable package) — version-increase requirement satisfied"
    elif [[ ! "$v_claude" =~ $semver_re ]]; then
        info "current installer version is not valid semver (failed above); skipping increase comparison"
    elif version_gt "$v_claude" "$baseline_version"; then
        pass "shipped surface changed and installer version increased: ${baseline_version} -> ${v_claude}"
    else
        fail "shipped surface changed since ${baseline} but installer version did NOT increase (baseline ${baseline_version}, current ${v_claude}) — a version bump is required"
    fi
else
    info "no shipped-surface change since ${baseline}; version bump not required"
fi

printf '\n'

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
printf '%s\n' '--- Summary ---'
if [[ "$FAILURES" -eq 0 ]]; then
    printf "${GREEN}PUBLISH-READY${RESET}\n"
    printf 'Version-bearing files agree, are valid semver, and any shipped-surface change carries a version increase.\n'
    exit 0
else
    printf "${RED}%d CHECK(S) FAILED${RESET} — not publish-ready; review FAIL lines above.\n" "$FAILURES"
    exit 1
fi
