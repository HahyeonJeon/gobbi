#!/usr/bin/env bash
# run-examples.sh — runner half of the example-verification harness for the
# gobbi `typescript` skill (design §9 / D7).
#
# Extracts every fenced `ts` / `typescript` block from the given markdown
# file(s) or directory (via extract-blocks.mjs) and type-checks the whole set
# with the LOCAL tsc under tsconfig.examples.json. Every taught TS fact is thus
# proven to compile under the skill's own maximal-strict baseline.
#
# Usage:  bash run-examples.sh <markdown-file-or-dir> [more...]
#
# Contract (self-failing + fail-closed):
#   - exit 0      every extracted example met its expected outcome
#   - exit != 0   any example failed to type-check  (self-failing)
#   - exit != 0   zero ts blocks were found         (fail-closed — a broken
#                 parser or a no-example input is NEVER reported as a pass)
#   - exit != 0   the local tsc / bun toolchain is missing
#
# No `|| true`, no swallowed pipe: a real failure always propagates a non-zero
# exit (see project mistakes verifies-must-be-self-failing,
# exit-in-command-substitution-fails-open).

set -euo pipefail

# Absolute dir of THIS script — so node_modules/.bin/tsc and
# tsconfig.examples.json resolve regardless of the caller's CWD. Input paths
# stay relative to the caller's CWD (this script never cd's away from it).
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

if [ "$#" -lt 1 ]; then
  echo "usage: bash run-examples.sh <markdown-file-or-dir> [more...]" >&2
  exit 2
fi

# LOCAL tsc is the contract (never a global tsc): the harness pins the skill's
# TS version via the committed devDep + lockfile.
tsc_bin="$script_dir/node_modules/.bin/tsc"
if [ ! -x "$tsc_bin" ]; then
  echo "FAIL: local tsc not found at $tsc_bin — run 'bun add -D typescript@5.9.3' in $script_dir" >&2
  exit 2
fi
if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL: bun not found on PATH (needed to run the extractor)" >&2
  exit 2
fi

# Isolated temp workspace, always cleaned up.
tmp_dir="$(mktemp -d)"
cleanup() { rm -rf -- "$tmp_dir"; }
trap cleanup EXIT

units_dir="$tmp_dir/units"
mkdir -p -- "$units_dir"

# Extract fenced ts blocks into per-example temp units. A non-zero exit here
# (zero blocks = fail-closed, or a partial missing its prelude) propagates via
# `set -e` and fails the whole harness.
bun "$script_dir/extract-blocks.mjs" "$units_dir" "$@"

# Defense in depth: confirm at least one unit landed on disk.
unit_count="$(find "$units_dir" -maxdepth 1 -type f -name '*.ts' | wc -l | tr -d '[:space:]')"
if [ "$unit_count" -eq 0 ]; then
  echo "FAIL: no ts example units were extracted — fail-closed" >&2
  exit 3
fi

# The temp package.json makes nodenext resolve the units as ESM (matches the
# skill's ESM-only + verbatimModuleSyntax baseline). The temp tsconfig extends
# the committed examples config and compiles only the extracted units.
printf '{\n  "type": "module"\n}\n' > "$tmp_dir/package.json"
printf '{\n  "extends": "%s/tsconfig.examples.json",\n  "include": ["units/*.ts"]\n}\n' \
  "$script_dir" > "$tmp_dir/tsconfig.json"

# Type-check the whole set once. Capture tsc's exit code explicitly — `|| rc=$?`
# keeps `set -e` from aborting before we can report it.
tsc_rc=0
"$tsc_bin" --noEmit --pretty --project "$tmp_dir/tsconfig.json" || tsc_rc=$?
if [ "$tsc_rc" -ne 0 ]; then
  echo "FAIL: $unit_count ts example unit(s) did NOT type-check (tsc exit $tsc_rc)" >&2
  exit "$tsc_rc"
fi

echo "OK: $unit_count ts example unit(s) type-checked clean under tsconfig.examples.json"
