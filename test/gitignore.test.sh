#!/usr/bin/env bash
#
# test/gitignore.test.sh — empirical verification of the root .gitignore
# whitelist pattern for .gobbi/.
#
# Runs `git check-ignore -v <path>` against a fixed catalogue of sample paths
# inside the repo. The paths do not need to exist on disk — `git check-ignore`
# evaluates patterns against the string form of the path. This keeps the test
# side-effect free (no files created, no commits, no staging changes).
#
# Usage:
#   bash test/gitignore.test.sh
#
# Exits 0 when every assertion holds; exits 1 on the first mismatch with a
# diagnostic line pointing at the expected vs actual outcome.
#
# Contract (mirrors the root .gitignore block for .gobbi/):
#   TRACKED (not ignored): .gobbi/projects/<name>/** except the subtrees below
#   IGNORED:
#     - .gobbi/<any file directly under .gobbi/> except projects/
#     - .gobbi/projects/*/sessions/**
#     - .gobbi/projects/*/rawdata/**
#     - .gobbi/projects/*/settings.json

set -euo pipefail

# Resolve repo root from this script's location, then cd — the script must be
# invoked from the directory whose .gitignore is under test. Walking up from
# the script location lets `bash test/gitignore.test.sh` work regardless of
# the caller's $PWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

pass_count=0
fail_count=0

# assert_tracked PATH
#   Asserts `git check-ignore -v <path>` exits non-zero (path is NOT ignored,
#   i.e. tracked). On failure, prints the matching rule that incorrectly
#   caused ignoring.
assert_tracked() {
  local path="$1"
  local out
  if out="$(git check-ignore -v "$path" 2>/dev/null)"; then
    printf '  FAIL tracked: %s\n    matched by: %s\n' "$path" "$out" >&2
    fail_count=$((fail_count + 1))
  else
    printf '  OK   tracked: %s\n' "$path"
    pass_count=$((pass_count + 1))
  fi
}

# assert_ignored PATH
#   Asserts `git check-ignore -v <path>` exits zero (path IS ignored). On
#   failure, notes that no rule matched.
assert_ignored() {
  local path="$1"
  local out
  if out="$(git check-ignore -v "$path" 2>/dev/null)"; then
    printf '  OK   ignored: %s\n    matched by: %s\n' "$path" "$out"
    pass_count=$((pass_count + 1))
  else
    printf '  FAIL ignored: %s (no rule matched)\n' "$path" >&2
    fail_count=$((fail_count + 1))
  fi
}

echo "=== Expected TRACKED (not ignored) ==="
assert_tracked '.gobbi/projects/gobbi/design/README.md'
assert_tracked '.gobbi/projects/gobbi/skills/_git/SKILL.md'
assert_tracked '.gobbi/projects/gobbi/agents/__executor.md'
assert_tracked '.gobbi/projects/gobbi/rules/__gobbi-convention.md'
assert_tracked '.gobbi/projects/gobbi/learnings/gotchas/schema-versioning.md'
assert_tracked '.gobbi/projects/foo/design/decisions/adr-001.md'

echo ""
echo "=== Expected IGNORED ==="
assert_ignored '.gobbi/projects/gobbi/sessions/abc-123/gobbi.db'
assert_ignored '.gobbi/projects/gobbi/sessions/abc-123/ideation/README.md'
assert_ignored '.gobbi/projects/gobbi/rawdata/transcript.jsonl'
assert_ignored '.gobbi/projects/gobbi/settings.json'
assert_ignored '.gobbi/settings.json'

echo ""
echo "Summary: ${pass_count} passed, ${fail_count} failed"

if [ "${fail_count}" -ne 0 ]; then
  exit 1
fi
