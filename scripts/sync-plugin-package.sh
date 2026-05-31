#!/usr/bin/env bash
# sync-plugin-package.sh — materialize the bounded gobbi Claude Code plugin package.
#
# Copies REAL files (not symlinks) from three canonical sources into
# plugins/gobbi/{skills,agents,hooks}/:
#
#   SOURCE                                      TARGET
#   .gobbi/projects/gobbi/skills/*/             plugins/gobbi/skills/*/
#   .gobbi/projects/gobbi/agents/{5}.md         plugins/gobbi/agents/{5}.md
#   .claude/hooks/{session-start,post-tool-use-agents}.sh
#                                               plugins/gobbi/hooks/
#
# IMPORTANT: canonical skills at .gobbi/projects/gobbi/skills/ are REAL files;
# .claude/skills/ is a symlink mirror — copy from canonical only (real files).
#
# Usage:
#   sync-plugin-package.sh          # materialize / resync (default)
#   sync-plugin-package.sh --check  # verify package is in sync + allow-set OK
#
# Exit codes:
#   0 — success (or --check passed)
#   1 — error or --check failed
#
# Design: pure bash + rsync + standard POSIX tools. No new dependencies.
#         rsync --delete ensures removing a canonical file removes it from the
#         package (idempotent, safe to re-run).

set -euo pipefail

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Canonical sources (real files, not symlinks)
SKILLS_SRC="$ROOT/.gobbi/projects/gobbi/skills"
AGENTS_SRC="$ROOT/.gobbi/projects/gobbi/agents"
HOOKS_SRC="$ROOT/.claude/hooks"

# Package targets
PLUGIN_ROOT="$ROOT/plugins/gobbi"
SKILLS_DST="$PLUGIN_ROOT/skills"
AGENTS_DST="$PLUGIN_ROOT/agents"
HOOKS_DST="$PLUGIN_ROOT/hooks"

# The bounded allow-set for the top level of plugins/gobbi/ (present-or-absent OK)
ALLOW_SET=(".claude-plugin" "skills" "agents" "hooks")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
die() { printf 'sync-plugin-package.sh: ERROR: %s\n' "$*" >&2; exit 1; }
info() { printf 'sync-plugin-package.sh: %s\n' "$*"; }

require_cmd() {
    command -v "$1" >/dev/null 2>&1 || die "required command not found: $1"
}

# ---------------------------------------------------------------------------
# Guard: canonical source existence
# ---------------------------------------------------------------------------
check_sources() {
    [[ -d "$SKILLS_SRC" ]] || die "canonical skills dir missing: $SKILLS_SRC"
    [[ -d "$AGENTS_SRC" ]] || die "canonical agents dir missing: $AGENTS_SRC"
    [[ -d "$HOOKS_SRC"  ]] || die "canonical hooks dir missing: $HOOKS_SRC"

    # Verify exactly 5 agent .md files exist
    local md_count
    md_count=$(find "$AGENTS_SRC" -maxdepth 1 -name '*.md' | wc -l)
    [[ "$md_count" -eq 5 ]] \
        || die "expected 5 agent .md files in $AGENTS_SRC; found $md_count"

    # Verify both hook scripts exist and are +x
    for hook in session-start.sh post-tool-use-agents.sh; do
        local h="$HOOKS_SRC/$hook"
        [[ -f "$h" ]] || die "hook script missing: $h"
        [[ -x "$h" ]] || die "hook script not executable: $h"
    done
}

# ---------------------------------------------------------------------------
# Default mode: materialize
# ---------------------------------------------------------------------------
do_sync() {
    require_cmd rsync

    check_sources

    mkdir -p "$SKILLS_DST" "$AGENTS_DST" "$HOOKS_DST"

    # 1. Skills: recursively copy all 18 skill dirs, delete removed entries.
    #    --no-links: copy symlink targets as regular files (materialization).
    #    --delete:   remove files/dirs in DST that no longer exist in SRC.
    info "syncing skills: $SKILLS_SRC -> $SKILLS_DST"
    rsync -a --no-links --delete \
        "$SKILLS_SRC/" "$SKILLS_DST/"

    # 2. Agents: copy only the 5 .md files; exclude .toml wrappers.
    #    Use --delete to remove any stale file (e.g. a .toml that snuck in).
    info "syncing agents (.md only): $AGENTS_SRC -> $AGENTS_DST"
    rsync -a --no-links --delete \
        --include='*.md' --exclude='*' \
        "$AGENTS_SRC/" "$AGENTS_DST/"

    # 3. Hooks: copy exactly the 2 named scripts, preserve permissions.
    info "syncing hooks: $HOOKS_SRC -> $HOOKS_DST"
    rsync -a --no-links --delete \
        --include='session-start.sh' \
        --include='post-tool-use-agents.sh' \
        --exclude='*' \
        "$HOOKS_SRC/" "$HOOKS_DST/"

    # Verify no symlinks slipped into the package
    local symlink_count
    symlink_count=$(find "$SKILLS_DST" "$AGENTS_DST" "$HOOKS_DST" -type l | wc -l)
    if [[ "$symlink_count" -gt 0 ]]; then
        die "symlinks found in package after sync (expected 0): $symlink_count"
    fi

    info "sync complete. Package: $PLUGIN_ROOT"
    info "  skills: $(ls "$SKILLS_DST" | wc -l) dirs"
    info "  agents: $(ls "$AGENTS_DST" | wc -l) .md files"
    info "  hooks:  $(ls "$HOOKS_DST" | wc -l) scripts"
}

# ---------------------------------------------------------------------------
# --check mode: diff/checksum + allow-set gate
# ---------------------------------------------------------------------------
do_check() {
    local fail=0

    # --- (a) Allow-set membership: top level of plugins/gobbi/ ---
    info "checking allow-set membership in $PLUGIN_ROOT ..."

    if [[ ! -d "$PLUGIN_ROOT" ]]; then
        printf 'FAIL: plugins/gobbi/ does not exist\n' >&2
        fail=1
    else
        # List actual top-level entries (files + dirs, including hidden)
        local actual_entries=()
        local entry
        while IFS= read -r -d '' entry; do
            actual_entries+=("$(basename "$entry")")
        done < <(find "$PLUGIN_ROOT" -mindepth 1 -maxdepth 1 -print0 | sort -z)

        for actual in "${actual_entries[@]}"; do
            local allowed=0
            for allowed_name in "${ALLOW_SET[@]}"; do
                if [[ "$actual" == "$allowed_name" ]]; then
                    allowed=1
                    break
                fi
            done
            if [[ "$allowed" -eq 0 ]]; then
                printf 'FAIL allow-set: unexpected entry in plugins/gobbi/: %s\n' "$actual" >&2
                fail=1
            fi
        done

        # All 4 allow-set members are required — fail if any is absent.
        for required in "${ALLOW_SET[@]}"; do
            local found=0
            for actual in "${actual_entries[@]}"; do
                if [[ "$actual" == "$required" ]]; then
                    found=1
                    break
                fi
            done
            if [[ "$found" -eq 0 ]]; then
                printf 'FAIL allow-set: required entry missing from plugins/gobbi/: %s\n' "$required" >&2
                fail=1
            fi
        done

        if [[ "${#actual_entries[@]}" -eq 0 ]]; then
            info "  allow-set: plugins/gobbi/ is empty (no entries to reject)"
        else
            # If we reach here without fail=1 being set from the loops, all OK
            if [[ "$fail" -eq 0 ]]; then
                info "  allow-set: OK (entries: ${actual_entries[*]})"
            fi
        fi
    fi

    # --- (b) Content sync check ---
    info "checking content sync ..."

    check_sources

    # Verify package dirs exist
    for dir in "$SKILLS_DST" "$AGENTS_DST" "$HOOKS_DST"; do
        if [[ ! -d "$dir" ]]; then
            printf 'FAIL: package dir missing: %s\n' "$dir" >&2
            fail=1
        fi
    done

    if [[ "$fail" -eq 1 ]]; then
        printf 'sync-plugin-package.sh: --check FAILED\n' >&2
        exit 1
    fi

    # Skills: recursive diff (byte-identical)
    local skills_diff
    skills_diff=$(diff -rq "$SKILLS_SRC" "$SKILLS_DST" 2>&1) || true
    if [[ -n "$skills_diff" ]]; then
        printf 'FAIL skills diff:\n%s\n' "$skills_diff" >&2
        fail=1
    else
        info "  skills: in sync"
    fi

    # Also verify no .toml files leaked into package agents dir
    local toml_count
    toml_count=$(find "$AGENTS_DST" -maxdepth 1 -name '*.toml' | wc -l)
    if [[ "$toml_count" -gt 0 ]]; then
        printf 'FAIL agents: %d .toml file(s) found in package\n' "$toml_count" >&2
        fail=1
    fi

    # Compare agents .md files by name + content (diff on basenames)
    local agents_src_check
    local agents_dst_check
    agents_src_check=$(for f in "$AGENTS_SRC"/*.md; do
        printf '%s\t' "$(basename "$f")"
        md5sum "$f" | awk '{print $1}'
    done | sort)
    agents_dst_check=$(for f in "$AGENTS_DST"/*.md; do
        printf '%s\t' "$(basename "$f")"
        md5sum "$f" | awk '{print $1}'
    done | sort)

    if [[ "$agents_src_check" != "$agents_dst_check" ]]; then
        printf 'FAIL agents: package .md files differ from canonical source\n' >&2
        printf 'src:\n%s\ndst:\n%s\n' "$agents_src_check" "$agents_dst_check" >&2
        fail=1
    else
        info "  agents: in sync (5 .md files, 0 .toml)"
    fi

    # Hooks: compare the 2 named scripts by content + permissions
    for hook in session-start.sh post-tool-use-agents.sh; do
        local src_hook="$HOOKS_SRC/$hook"
        local dst_hook="$HOOKS_DST/$hook"

        if [[ ! -f "$dst_hook" ]]; then
            printf 'FAIL hooks: %s missing from package\n' "$hook" >&2
            fail=1
            continue
        fi

        if ! cmp -s "$src_hook" "$dst_hook"; then
            printf 'FAIL hooks: %s differs from source\n' "$hook" >&2
            fail=1
        elif [[ ! -x "$dst_hook" ]]; then
            printf 'FAIL hooks: %s not executable in package\n' "$hook" >&2
            fail=1
        else
            info "  hooks/$hook: in sync (+x)"
        fi
    done

    # Symlink check: no symlinks anywhere in the package component trees
    local symlink_count
    symlink_count=$(find "$SKILLS_DST" "$AGENTS_DST" "$HOOKS_DST" -type l | wc -l)
    if [[ "$symlink_count" -gt 0 ]]; then
        printf 'FAIL: %d symlink(s) found in package\n' "$symlink_count" >&2
        find "$SKILLS_DST" "$AGENTS_DST" "$HOOKS_DST" -type l >&2
        fail=1
    else
        info "  symlinks: 0 (all real files)"
    fi

    if [[ "$fail" -eq 1 ]]; then
        printf 'sync-plugin-package.sh: --check FAILED\n' >&2
        exit 1
    fi

    info "--check PASSED"
    exit 0
}

# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
case "${1:-}" in
    --check)
        do_check
        ;;
    "")
        do_sync
        ;;
    *)
        die "unknown argument: $1 (valid: [no args] | --check)"
        ;;
esac
