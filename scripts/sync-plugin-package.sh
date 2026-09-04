#!/usr/bin/env bash
#
# sync-plugin-package.sh — project the canonical Gobbi tree into the plugin package.
#
# Source: .gobbi/projects/gobbi/    Destination: plugins/gobbi/
#
# WHY THE TWO TREES DIFFER IN SHAPE
#
# Canonical keeps every runtime's role contracts together under agents/{claude,codex,
# cursor,grok}/. The published package cannot: Claude Code scans a plugin's agents/
# directory RECURSIVELY and a subfolder becomes part of the agent's scoped identifier,
# so agents/claude/manager.md would register as gobbi:claude:manager instead of
# gobbi:manager, and the cursor and grok copies would register ten further live agents
# with colliding leaf names. So the package flattens Claude's contracts into agents/
# and ships the other runtimes in a runtimes/ sibling, which that scan never reads.
#
# That shape difference is expressed ONLY as directory mapping below. Bytes are still
# copied verbatim, except for the declared link rewrites (see LINK_REWRITE_PATHS).
#
# PACKAGE-OWNED, never read, written, deleted or reported:
#   - plugins/gobbi/hooks/ is deliberately NOT a mirror. Canonical hooks/ is frozen at
#     an older shape by an explicit user decision and serves this repository's own three
#     hook registrations; the package hooks/ is the consumer-facing per-runtime design.
#     They differ on purpose, so treating them as a mirror pair would break both.
#   - plugins/gobbi/.claude-plugin/, .codex-plugin/, .cursor-plugin/, .grok-plugin/ are
#     hand-maintained manifests with no canonical counterpart.
#
# The executable bit is preserved and compared: a package file whose bytes match but whose
# mode drifted is reported as mode-differs and repaired. The unexpected-file scan also sees
# symlinks, so a planted link cannot hide behind a -type f test.

set -euo pipefail

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd -- "$SCRIPT_DIR/.." && pwd)
CANONICAL_ROOT="$REPO_ROOT/.gobbi/projects/gobbi"
PACKAGE_ROOT="$REPO_ROOT/plugins/gobbi"

# canonical-prefix:package-prefix. Everything under a canonical prefix is copied to the
# matching package prefix. A canonical path under no prefix here never ships — which is
# why agents/README.md needs no exclusion entry: only agents/claude/ is mapped.
DIRECTORY_MAP=(
  "skills:skills"
  "agents/claude:agents"
  "agents/codex:runtimes/codex"
  "agents/cursor:runtimes/cursor"
  "agents/grok:runtimes/grok"
)

# Package subtrees this script owns. An unmapped file found here is reported and removed.
GENERATED_SUBTREES=(skills agents runtimes)

# Canonical paths inside a mapped prefix that must still not ship.
#   skills/gobbi-skill/scripts/link-project-skills.sh — repository-local dev script.
EXCLUDED_PATHS=(
  "skills/gobbi-skill/scripts/link-project-skills.sh"
)

# LINK REWRITES. A file listed here has its relative role-contract links rewritten from the
# canonical prefix to the package prefix using DIRECTORY_MAP above — nothing else changes.
# This is derived, not stored: there is no second copy of the file to keep in sync, so it
# cannot go stale when canonical changes. Every other file is copied byte for byte.
#   skills/gobbi/SKILL.md — links to ../../agents/{runtime}/ paths the package maps elsewhere.
LINK_REWRITE_PATHS=(
  "skills/gobbi/SKILL.md"
)

needs_link_rewrite() {
  local candidate=$1 entry
  for entry in "${LINK_REWRITE_PATHS[@]}"; do
    [[ $candidate == "$entry" ]] && return 0
  done
  return 1
}

# Applies DIRECTORY_MAP to ../../ link prefixes, longest canonical prefix first so
# agents/claude/ is rewritten before a bare agents/ could match it.
rewrite_links() {
  local pair canonical_prefix package_prefix
  local -a args=()
  while IFS= read -r pair; do
    canonical_prefix=${pair%%:*}
    package_prefix=${pair#*:}
    args+=(-e "s#\.\./\.\./$canonical_prefix/#../../$package_prefix/#g")
  done < <(printf '%s\n' "${DIRECTORY_MAP[@]}" | awk -F: '{print length($1)"\t"$0}' | sort -rn | cut -f2-)
  sed "${args[@]}" -- "$1"
}

usage() {
  cat <<'EOF'
Usage: scripts/sync-plugin-package.sh (--check | --materialize)

  --check         Compare plugins/gobbi/ against the canonical projection and mutate
                  nothing. Exit 0 when they match, non-zero otherwise. Prints one line
                  per divergent path: missing-in-package, content-differs,
                  unexpected-in-package or missing-override.
  --materialize   Make plugins/gobbi/ match the projection. Prints one line per action:
                  created, updated or deleted.
EOF
}

is_excluded() {
  local candidate=$1 entry
  for entry in "${EXCLUDED_PATHS[@]}"; do
    [[ $candidate == "$entry" ]] && return 0
  done
  return 1
}

# Prints "package_relative_path<TAB>expected_source_absolute_path" for every file that
# should exist in the package.
enumerate_expected() {
  local pair canonical_prefix package_prefix source rel pkg_rel expected
  for pair in "${DIRECTORY_MAP[@]}"; do
    canonical_prefix=${pair%%:*}
    package_prefix=${pair#*:}
    [[ -d "$CANONICAL_ROOT/$canonical_prefix" ]] || continue
    while IFS= read -r source; do
      rel=${source#"$CANONICAL_ROOT"/}
      is_excluded "$rel" && continue
      pkg_rel="$package_prefix/${source#"$CANONICAL_ROOT/$canonical_prefix"/}"
      printf '%s\t%s\n' "$pkg_rel" "$source"
    done < <(find "$CANONICAL_ROOT/$canonical_prefix" -type f | sort)
  done
}

# Builds EXPECTED[package_relative_path]=absolute_source once. Never pipe enumerate_expected
# into grep -q: grep exits on first match, the writer takes SIGPIPE, and under pipefail the
# pipeline reports failure, which a membership test would read as "not expected".
declare -A EXPECTED=()

load_expected() {
  local pkg_rel expected
  while IFS=$'\t' read -r pkg_rel expected; do
    EXPECTED["$pkg_rel"]=$expected
  done < <(enumerate_expected)
}

run_check() {
  local divergent=0 pkg_rel expected subtree found
  load_expected
  for pkg_rel in "${!EXPECTED[@]}"; do
    expected=${EXPECTED[$pkg_rel]}
    if [[ ! -f "$PACKAGE_ROOT/$pkg_rel" ]]; then
      printf 'missing-in-package %s\n' "$pkg_rel"; divergent=1
    elif needs_link_rewrite "$pkg_rel"; then
      if ! cmp -s <(rewrite_links "$expected") "$PACKAGE_ROOT/$pkg_rel"; then
        printf 'content-differs %s\n' "$pkg_rel"; divergent=1
      fi
    elif ! cmp -s "$expected" "$PACKAGE_ROOT/$pkg_rel"; then
      printf 'content-differs %s\n' "$pkg_rel"; divergent=1
    elif [[ -x $expected && ! -x "$PACKAGE_ROOT/$pkg_rel" ]] \
      || [[ ! -x $expected && -x "$PACKAGE_ROOT/$pkg_rel" ]]; then
      printf 'mode-differs %s\n' "$pkg_rel"; divergent=1
    fi
  done

  for subtree in "${GENERATED_SUBTREES[@]}"; do
    [[ -d "$PACKAGE_ROOT/$subtree" ]] || continue
    while IFS= read -r found; do
      pkg_rel=${found#"$PACKAGE_ROOT"/}
      if [[ -z ${EXPECTED[$pkg_rel]+set} ]]; then
        printf 'unexpected-in-package %s\n' "$pkg_rel"; divergent=1
      fi
    done < <(find "$PACKAGE_ROOT/$subtree" \( -type f -o -type l \) | sort)
  done

  if ((divergent)); then return 1; fi
  echo "package matches canonical projection"
}

run_materialize() {
  local actions=0 pkg_rel expected subtree found target
  load_expected
  for pkg_rel in "${!EXPECTED[@]}"; do
    expected=${EXPECTED[$pkg_rel]}
    target="$PACKAGE_ROOT/$pkg_rel"
    if needs_link_rewrite "$pkg_rel"; then
      if [[ ! -f $target ]]; then
        mkdir -p "$(dirname "$target")"; rewrite_links "$expected" > "$target"
        printf 'created %s\n' "$pkg_rel"; actions=$((actions + 1))
      elif ! cmp -s <(rewrite_links "$expected") "$target"; then
        rewrite_links "$expected" > "$target"
        printf 'updated %s\n' "$pkg_rel"; actions=$((actions + 1))
      fi
    elif [[ ! -f $target ]]; then
      mkdir -p "$(dirname "$target")"; cp -p "$expected" "$target"
      printf 'created %s\n' "$pkg_rel"; actions=$((actions + 1))
    elif ! cmp -s "$expected" "$target"; then
      cp -p "$expected" "$target"
      printf 'updated %s\n' "$pkg_rel"; actions=$((actions + 1))
    elif [[ -x $expected && ! -x $target ]] || [[ ! -x $expected && -x $target ]]; then
      chmod --reference="$expected" "$target"
      printf 'updated %s (mode)\n' "$pkg_rel"; actions=$((actions + 1))
    fi
  done

  for subtree in "${GENERATED_SUBTREES[@]}"; do
    [[ -d "$PACKAGE_ROOT/$subtree" ]] || continue
    while IFS= read -r found; do
      pkg_rel=${found#"$PACKAGE_ROOT"/}
      if [[ -z ${EXPECTED[$pkg_rel]+set} ]]; then
        rm -f "$found"; printf 'deleted %s\n' "$pkg_rel"; actions=$((actions + 1))
      fi
    done < <(find "$PACKAGE_ROOT/$subtree" \( -type f -o -type l \) | sort)
    find "$PACKAGE_ROOT/$subtree" -type d -empty -delete 2>/dev/null || true
  done
  printf '%d action(s)\n' "$actions"
}

case "${1-}" in
  --check) run_check ;;
  --materialize) run_materialize ;;
  --help | -h) usage ;;
  *) usage >&2; exit 2 ;;
esac
