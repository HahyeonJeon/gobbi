#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
checker="$script_dir/check-markdown-links.sh"
fixture_root="$(mktemp -d /tmp/check-markdown-links.XXXXXX)"
non_git_root="$(mktemp -d /tmp/check-markdown-links-non-git.XXXXXX)"
trap 'rm -rf "$fixture_root" "$non_git_root"' EXIT

git -C "$fixture_root" init -q
printf 'ignored/\n' > "$fixture_root/.gitignore"

result=""
status=0
passes=0

run_checker() {
    set +e
    result="$(bash "$checker" "$@" 2>&1)"
    status=$?
    set -e
}

require_status() {
    local expected="$1"
    if [ "$status" -ne "$expected" ]; then
        printf 'FAIL: expected status %s, got %s\n%s\n' "$expected" "$status" "$result" >&2
        exit 1
    fi
}

require_contains() {
    local expected="$1"
    case "$result" in
        *"$expected"*) ;;
        *)
            printf 'FAIL: output does not contain %s\n%s\n' "$expected" "$result" >&2
            exit 1
            ;;
    esac
}

pass() {
    passes=$((passes + 1))
    printf 'PASS: %s\n' "$1"
}

# 1. A tracked regular Markdown file is discovered and checked.
mkdir "$fixture_root/tracked"
printf '[missing](missing.md)\n' > "$fixture_root/tracked/tracked.md"
git -C "$fixture_root" add tracked/tracked.md
run_checker "$fixture_root/tracked"
require_status 1
require_contains 'tracked.md -> missing.md'
pass 'tracked regular Markdown is scanned'

# 2. An untracked nonignored Markdown file is not omitted.
mkdir "$fixture_root/untracked"
printf '[missing](missing.md)\n' > "$fixture_root/untracked/untracked.md"
run_checker "$fixture_root/untracked"
require_status 1
require_contains 'untracked.md -> missing.md'
pass 'untracked nonignored Markdown is scanned'

# 3. Ignored Markdown does not affect a directory scan.
mkdir -p "$fixture_root/ignore-scan/ignored"
printf '[missing](missing.md)\n' > "$fixture_root/ignore-scan/ignored/ignored.md"
printf '# visible\n' > "$fixture_root/ignore-scan/visible.md"
run_checker "$fixture_root/ignore-scan"
require_status 0
require_contains 'across 1 file(s)'
case "$result" in
    *ignored.md*)
        printf 'FAIL: directory scan reported ignored Markdown\n%s\n' "$result" >&2
        exit 1
        ;;
esac
pass 'directory scan skips ignored Markdown'

# 4. An explicitly named ignored file is still checked.
run_checker "$fixture_root/ignore-scan/ignored/ignored.md"
require_status 1
require_contains 'ignored.md -> missing.md'
pass 'explicit ignored Markdown is scanned'

# 5. Spaces and newlines in regular Markdown names do not split discovery.
mkdir "$fixture_root/names"
printf '# space\n' > "$fixture_root/names/space name.md"
printf '# newline\n' > "$fixture_root/names/"$'line\nbreak.md'
run_checker "$fixture_root/names"
require_status 0
require_contains 'across 2 file(s)'
pass 'space and newline Markdown names are counted once'

# 6. Directory discovery keeps skipping symlink aliases.
mkdir "$fixture_root/aliases"
printf '# owner\n' > "$fixture_root/aliases/owner.md"
ln -s owner.md "$fixture_root/aliases/alias.md"
run_checker "$fixture_root/aliases"
require_status 0
require_contains 'across 1 file(s)'
pass 'symlinked Markdown aliases are skipped'

# 7. Preserve non-Git scans and valid, invalid, bad-input, and empty results.
mkdir "$fixture_root/outcomes" "$fixture_root/empty"
printf '# target\n' > "$fixture_root/outcomes/target.md"
printf '[target](target.md)\n' > "$fixture_root/outcomes/valid.md"
printf '[missing](missing.md)\n' > "$fixture_root/outcomes/invalid.md"
printf '[missing](missing.md)\n' > "$non_git_root/non-git.md"
run_checker "$non_git_root"
require_status 1
require_contains 'non-git.md -> missing.md'
run_checker "$fixture_root/outcomes/valid.md"
require_status 0
run_checker "$fixture_root/outcomes/invalid.md"
require_status 1
run_checker
require_status 2
run_checker "$fixture_root/absent.md"
require_status 2
run_checker "$fixture_root/empty"
require_status 2
pass 'non-Git, valid, invalid, bad-input, and empty outcomes are preserved'

printf 'PASS: %d markdown link checker tests completed\n' "$passes"
