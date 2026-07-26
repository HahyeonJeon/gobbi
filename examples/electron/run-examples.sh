#!/usr/bin/env bash
# run-examples.sh — runner half of the example-verification harness for the
# gobbi `electron` skill (design §8.2 / §8.3 / §8.4).
#
# Extracts every fenced `ts` block from the given markdown file(s) or directory
# (via extract-blocks.mjs), then type-checks each process's units with the LOCAL
# tsc under THAT process's own tsconfig — one pass for main, one for preload,
# one for renderer.
#
# WHY THREE PASSES. A single combined config is a FALSE-PASS harness. With
# `lib:["ES2023","DOM"]` + `types:["node"]` a deliberately mixed example — a
# main-process module touching `document`, a renderer touching `process` —
# compiles clean, so the harness certifies exactly the boundary violations the
# skill exists to prevent. Split per process, `document` in main is TS2584,
# `process` in renderer is TS2591, and an Electron member absent from the
# process view is TS2305. The fixtures make that last signal discriminating:
# wrong-process values fail, while correct process-local type imports pass.
#
# Usage:  bash run-examples.sh <markdown-file-or-dir> [more...]
#
# Contract (self-failing + fail-closed):
#   - exit 0      every extracted example met its expected outcome
#   - exit != 0   any example failed to type-check in its own pass (self-failing)
#   - exit != 0   a fence-tagging violation                (extractor exit 4)
#   - exit != 0   a canonical source declaration or behavior-register drift
#   - exit != 0   zero ts blocks were found                (fail-closed — a
#                 broken parser or a no-example input is NEVER a pass)
#   - exit != 0   the local tsc / bun toolchain is missing, or the three
#                 generated `electron` views could not be produced
#
# No `|| true`, no swallowed pipe: a real failure always propagates a non-zero
# exit (see project mistakes verifies-must-be-self-failing,
# exit-in-command-substitution-fails-open).
#
# PREREQUISITE: `bun install` has been run in this directory. `node_modules/` is
# not committed, and `generated/` is derived from `node_modules/electron`.

set -euo pipefail

# Absolute dir of THIS script — so node_modules/.bin/tsc and the three
# tsconfig.<process>.json files resolve regardless of the caller's CWD. Input
# paths stay relative to the caller's CWD (this script never cd's away from it).
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"

PROCESSES=(main preload renderer)

if [ "$#" -lt 1 ]; then
  echo "usage: bash run-examples.sh <markdown-file-or-dir> [more...]" >&2
  exit 2
fi

# LOCAL tsc is the contract (never a global tsc): the harness pins the skill's
# TS and Electron versions via the committed devDeps + lockfile. A floating
# version would change TS2584 / TS2591 / TS2305 behavior across machines.
tsc_bin="$script_dir/node_modules/.bin/tsc"
if [ ! -x "$tsc_bin" ]; then
  echo "FAIL: local tsc not found at $tsc_bin — run 'bun install' in $script_dir" >&2
  exit 2
fi
if ! command -v bun >/dev/null 2>&1; then
  echo "FAIL: bun not found on PATH (needed to run the extractor and the view generator)" >&2
  exit 2
fi

# A canonical skill-directory input activates the source consistency gate.
# Physical paths make the same source reached through `.agents/skills/electron`
# or the plugin-package symlink behave identically. Fixture files remain
# independent, so an intentional negative extractor fixture cannot be masked by
# an unrelated declaration drift in the canonical skill.
canonical_skill_dir="$(cd -- "$script_dir/../../.gobbi/projects/gobbi/skills/electron" && pwd -P)"
check_source_consistency=false
for input_arg in "$@"; do
  if [ -d "$input_arg" ]; then
    input_dir="$(cd -- "$input_arg" && pwd -P)"
    if [ "$input_dir" = "$canonical_skill_dir" ]; then
      check_source_consistency=true
    fi
  fi
done
if [ "$check_source_consistency" = true ]; then
  bun "$script_dir/check-skill-consistency.mjs" "$canonical_skill_dir"
fi

# Regenerate the three per-process `electron` views from the vendor typings
# before compiling anything. The generator is self-failing: a vendor bump that
# breaks a substitution anchor exits non-zero rather than emitting an unscoped
# view, and an unscoped view would let every wrong-process import compile clean.
bun "$script_dir/generate-electron-views.mjs"

for proc in "${PROCESSES[@]}"; do
  view="$script_dir/generated/electron-$proc.d.ts"
  if [ ! -f "$view" ]; then
    echo "FAIL: generated view missing at $view — the TS2305 boundary guard cannot fire without it" >&2
    exit 2
  fi
  if [ ! -f "$script_dir/tsconfig.$proc.json" ]; then
    echo "FAIL: $script_dir/tsconfig.$proc.json not found" >&2
    exit 2
  fi
done

# Isolated temp workspace, always cleaned up.
tmp_dir="$(mktemp -d)"
cleanup() { rm -rf -- "$tmp_dir"; }
trap cleanup EXIT

units_dir="$tmp_dir/units"
mkdir -p -- "$units_dir"

# Extract fenced ts blocks into per-process temp unit directories. A non-zero
# exit here (fence-tagging violation, zero blocks = fail-closed, or a partial
# missing its prelude) propagates via `set -e` and fails the whole harness.
bun "$script_dir/extract-blocks.mjs" "$units_dir" "$@"

manifest="$units_dir/manifest.txt"
if [ ! -f "$manifest" ]; then
  echo "FAIL: the extractor wrote no manifest at $manifest — counts cannot be reported" >&2
  exit 3
fi
manifest_value() { sed -n "s/^$1=//p" "$manifest"; }
tsx_uncompiled="$(manifest_value tsx_uncompiled)"
ts_blocks="$(manifest_value ts_blocks)"
eligible_code_fences="$(manifest_value fences_eligible_code)"
allowlisted_non_code_fences="$(manifest_value fences_allowlisted_non_code)"
total_fences="$(manifest_value fences_total)"
fence_languages="$(manifest_value fence_languages)"

for count_name in ts_blocks tsx_uncompiled eligible_code_fences allowlisted_non_code_fences total_fences; do
  count_value="${!count_name}"
  if ! [[ "$count_value" =~ ^[0-9]+$ ]]; then
    echo "FAIL[fence-census]: manifest value '$count_name' is missing or not an integer: '$count_value'" >&2
    exit 3
  fi
done
if [ -z "$fence_languages" ]; then
  echo "FAIL[fence-census]: manifest has no by-language census" >&2
  exit 3
fi
if [ $(( ts_blocks + tsx_uncompiled )) -ne "$eligible_code_fences" ]; then
  echo "FAIL[fence-census]: ts ($ts_blocks) + tsx-uncompiled ($tsx_uncompiled) != eligible-code ($eligible_code_fences)" >&2
  exit 3
fi
if [ $(( eligible_code_fences + allowlisted_non_code_fences )) -ne "$total_fences" ]; then
  echo "FAIL[fence-census]: eligible-code ($eligible_code_fences) + allowlisted-non-code ($allowlisted_non_code_fences) != total ($total_fences)" >&2
  exit 3
fi

# Defense in depth: confirm units landed on disk, counted from the disk rather
# than from the extractor's own report. The origin harness's `find -maxdepth 1`
# would find nothing here — delta 3 puts every unit one directory deeper.
total_units=0
declare -A found_units=()
for proc in "${PROCESSES[@]}"; do
  n=0
  if [ -d "$units_dir/$proc" ]; then
    n="$(find "$units_dir/$proc" -maxdepth 1 -type f -name '*.ts' | wc -l | tr -d '[:space:]')"
  fi
  found_units["$proc"]="$n"
  total_units=$(( total_units + n ))
done

if [ "$total_units" -eq 0 ]; then
  echo "FAIL: no ts example units were extracted — fail-closed" >&2
  exit 3
fi

# The temp package.json makes nodenext resolve the units as ESM (matches the
# skill's ESM-only + verbatimModuleSyntax baseline).
printf '{\n  "type": "module"\n}\n' > "$tmp_dir/package.json"

# One tsconfig and one tsc invocation per process. Each extends that process's
# committed config — three DIFFERENT `lib` / `types` / `paths` targets, never one
# shared config. `include` (not `files`) is deliberate: a child's `files`
# overrides the base's, and tsconfig.preload.json lists its hand-written
# sandboxed-globals declaration under `files`. Switching to `files` here would
# silently drop it and break every correct preload example.
overall_rc=0
passes_run=0
for proc in "${PROCESSES[@]}"; do
  n="${found_units[$proc]}"
  if [ "$n" -eq 0 ]; then
    echo "SKIP: no $proc unit(s) in this input"
    continue
  fi
  passes_run=$(( passes_run + 1 ))

  cfg="$tmp_dir/tsconfig.$proc.json"
  printf '{\n  "extends": "%s/tsconfig.%s.json",\n  "include": ["units/%s/*.ts"]\n}\n' \
    "$script_dir" "$proc" "$proc" > "$cfg"

  # Capture tsc's exit code explicitly — `|| rc=$?` keeps `set -e` from aborting
  # before we can report it. Every pass runs even after one fails, so a single
  # run shows every boundary that broke rather than only the first.
  rc=0
  "$tsc_bin" --noEmit --pretty --project "$cfg" || rc=$?
  if [ "$rc" -ne 0 ]; then
    echo "FAIL: $n $proc unit(s) did NOT type-check under tsconfig.$proc.json (tsc exit $rc)" >&2
    overall_rc="$rc"
  else
    echo "OK: $n $proc unit(s) type-checked clean under tsconfig.$proc.json"
  fi
done

# EL-R-16's unit counts, by-language census, and two fence equalities are
# reported on every run, pass or fail.
echo "COUNTS: extracted units — main=${found_units[main]} preload=${found_units[preload]} renderer=${found_units[renderer]} total=$total_units (from $ts_blocks ts block(s))"
echo "COUNTS: tsx blocks marked \`uncompiled\` — $tsx_uncompiled (counted, never compiled)"
echo "COUNTS: fences — total=$total_fences eligible-code=$eligible_code_fences (ts=$ts_blocks + tsx-uncompiled=$tsx_uncompiled) allowlisted-non-code=$allowlisted_non_code_fences"
echo "COUNTS: fence languages — $fence_languages"

if [ "$overall_rc" -ne 0 ]; then
  echo "FAIL: at least one process pass did NOT type-check" >&2
  exit "$overall_rc"
fi

echo "OK: $total_units ts example unit(s) type-checked clean across $passes_run process pass(es)"
