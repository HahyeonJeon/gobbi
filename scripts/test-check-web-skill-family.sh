#!/usr/bin/env bash
set -euo pipefail

self="test-check-web-skill-family.sh"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
guard="$repo_root/scripts/check-web-skill-family.sh"
tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/gobbi-web-family-tests.XXXXXX")"
accepted="$tmp_root/accepted"
tests_run=0

cleanup() {
  if [[ -d "$tmp_root" && ! -L "$tmp_root" ]]; then
    find "$tmp_root" -depth -mindepth 1 -delete
    rmdir "$tmp_root"
  fi
}
trap cleanup EXIT

fail() {
  printf '%s: FAIL: %s\n' "$self" "$*" >&2
  exit 1
}

pass() {
  tests_run=$((tests_run + 1))
  printf 'PASS: %s\n' "$1"
}

make_accepted_fixture() {
  mkdir -p \
    "$accepted/.gobbi/projects/gobbi/skills" \
    "$accepted/plugins/gobbi/skills" \
    "$accepted/.agents/skills" \
    "$accepted/.claude/skills"

  cp -a "$repo_root/.gobbi/projects/gobbi/skills/web" \
    "$accepted/.gobbi/projects/gobbi/skills/web"
  cp -a "$repo_root/plugins/gobbi/skills/web" \
    "$accepted/plugins/gobbi/skills/web"
  cp -a "$repo_root/.agents/skills/web" \
    "$accepted/.agents/skills/web"
  cp -a "$repo_root/.claude/skills/web" \
    "$accepted/.claude/skills/web"
}

snapshot_tree() {
  local root="$1" output="$2" entry rel target digest
  : > "$output"
  while IFS= read -r -d '' entry; do
    rel="${entry#"$root"/}"
    if [[ -L "$entry" ]]; then
      target="$(readlink -n -- "$entry" | od -An -tx1 | tr -d ' \n')"
      printf 'l\t%s\t%s\n' "$rel" "$target"
    elif [[ -d "$entry" ]]; then
      printf 'd\t%s\t-\n' "$rel"
    elif [[ -f "$entry" ]]; then
      digest="$(sha256sum "$entry" | awk '{ print $1 }')"
      printf 'f\t%s\t%s\n' "$rel" "$digest"
    else
      printf 'o\t%s\t%s\n' "$rel" "$(stat -c '%F' "$entry")"
    fi
  done < <(find "$root" -mindepth 1 -print0 | LC_ALL=C sort -z) > "$output"
}

run_guard() {
  local root="$1"
  GOBBI_WEB_REPO_ROOT="$root" bash "$guard"
}

case_root=''
new_case() {
  local name="$1"
  case_root="$tmp_root/cases/$name"
  mkdir -p "$case_root"
  cp -a "$accepted/." "$case_root/"
}

expect_failure() {
  local name="$1" root="$2" diagnostic="$3" output
  if output="$(run_guard "$root" 2>&1)"; then
    fail "$name unexpectedly passed"
  fi
  grep -Fq -- "$diagnostic" <<< "$output" \
    || fail "$name did not report '$diagnostic'; output: $output"
  pass "$name rejects with stable diagnosis"
}

[[ -f "$guard" ]] || fail "guard is missing: $guard"
make_accepted_fixture

before="$tmp_root/accepted.before"
after="$tmp_root/accepted.after"
snapshot_tree "$accepted" "$before"
run_guard "$accepted" >/dev/null
snapshot_tree "$accepted" "$after"
cmp -s -- "$before" "$after" || fail 'positive guard run mutated its fixture'
pass 'accepted copied repository passes without mutation'

expect_failure wrong-root "$tmp_root/not-a-repository" 'repository root is invalid'

new_case wrong-route
sed -i 's|(web-testing/SKILL.md)|(web-testing/missing.md)|' \
  "$case_root/.gobbi/projects/gobbi/skills/web/SKILL.md"
expect_failure wrong-route "$case_root" 'web-testing root route, type, path, or trigger changed'

new_case wrong-trigger
sed -i 's/MUST load when designing, writing, running/MUST load when choosing, writing, running/' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/SKILL.md"
expect_failure wrong-trigger "$case_root" 'web-testing frontmatter trigger changed'

new_case wrong-type
sed -i 's/^skill-type: operation$/skill-type: preference/' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/SKILL.md"
expect_failure wrong-type "$case_root" 'web-testing frontmatter type changed'

new_case wrong-pair
rm -f -- "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/checklists.md"
expect_failure wrong-pair "$case_root" 'web-testing pair shape'

old_name='web-feat'"ure"
new_case old-live-path
mv -- "$case_root/.gobbi/projects/gobbi/skills/web/web-development" \
  "$case_root/.gobbi/projects/gobbi/skills/web/$old_name"
expect_failure old-live-path "$case_root" 'child catalog does not contain the exact 17 stable names'

new_case old-live-content
printf '\nLegacy live route: %s\n' "$old_name" \
  >> "$case_root/.gobbi/projects/gobbi/skills/web/SKILL.md"
expect_failure old-live-content "$case_root" 'old live web name or prefix remains in canonical content'

new_case bad-prefix
sed -i '0,/WEBBACK-CK-PROJECT-01-01/s//WRONG-CK-PROJECT-01-01/' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-backend/checklists.md"
expect_failure bad-prefix "$case_root" 'malformed or wrong-prefix definition ID'

new_case malformed-id
sed -i '0,/WEBTEST-CK-PROJECT-01-01/s//WEBTEST-CK-PROJECT-01-1/' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/checklists.md"
expect_failure malformed-id "$case_root" 'malformed or wrong-prefix definition ID'

new_case checked-row
sed -i '0,/- \[ \] WEBTEST-CK-PROJECT-01-01/s//- [x] WEBTEST-CK-PROJECT-01-01/' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/checklists.md"
expect_failure checked-row "$case_root" 'definition is not an unchecked checkbox'

new_case duplicate-id
sed -i '0,/WEBTEST-CK-PROJECT-01-02/s//WEBTEST-CK-PROJECT-01-01/' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/checklists.md"
expect_failure duplicate-id "$case_root" 'duplicate definition ID WEBTEST-CK-PROJECT-01-01'

new_case unresolved-reuse
sed -i '0,/WEBTEST-CK-STRUCTURE-01-01 (the least expensive/s//WEBTEST-CK-STRUCTURE-99-99 (the least expensive/' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/checklists.md"
expect_failure unresolved-reuse "$case_root" 'unresolved Also applies reference WEBTEST-CK-STRUCTURE-99-99'

new_case missing-perspective
sed -i '/^## Aesthetics$/d' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/checklists.md"
expect_failure missing-perspective "$case_root" 'perspective heading is missing, duplicated, or out of order'

new_case out-of-order-perspective
sed -i \
  -e 's/^## Performance$/## Temporary Perspective/' \
  -e 's/^## Aesthetics$/## Performance/' \
  -e 's/^## Temporary Perspective$/## Aesthetics/' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-testing/checklists.md"
expect_failure out-of-order-perspective "$case_root" 'perspective heading is missing, duplicated, or out of order'

new_case source-cap
printf '%s\n' \
  '' \
  '### WEBAPP-SC-OVERALL-02 — Edge case: a valid extra scenario exceeds the source budget' \
  '' \
  'The scenario is structurally valid but is outside the frozen source total.' \
  '' \
  '#### Checklist' \
  '' \
  '- [ ] WEBAPP-CK-OVERALL-02-01 — The extra source-cap fixture row is rejected.' \
  >> "$case_root/.gobbi/projects/gobbi/skills/web/web-app-lifecycle/checklists.md"
expect_failure source-cap "$case_root" 'web-app-lifecycle exceeds the 55-definition source cap'

new_case scenario-cap
sed -i '/^### WEBAPP-SC-USAGE-02/i - [ ] WEBAPP-CK-USAGE-01-07 — The seventh fixture condition is rejected.\
' "$case_root/.gobbi/projects/gobbi/skills/web/web-app-lifecycle/checklists.md"
expect_failure scenario-cap "$case_root" 'WEBAPP-SC-USAGE-01 exceeds the six-definition scenario cap'

new_case family-total
sed -i '/WEBBACK-CK-PROJECT-01-04 —/d' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-backend/checklists.md"
expect_failure family-total "$case_root" 'family definition total is 809; expected 810'

new_case native-boundary-leak
sed -i \
  's/installation and removal\. Native installed-application behavior remains with Desktop and Electron\./installation and removal. This web skill owns native installed-application behavior./' \
  "$case_root/.gobbi/projects/gobbi/skills/web/web-app-lifecycle/SKILL.md"
expect_failure native-boundary-leak "$case_root" 'native-boundary contract'

new_case generated-missing
rm -f -- "$case_root/plugins/gobbi/skills/web/web-testing/checklists.md"
expect_failure generated-missing "$case_root" 'generated package web file set is missing or stale'

new_case generated-stale
printf 'stale\n' > "$case_root/plugins/gobbi/skills/web/stale.md"
expect_failure generated-stale "$case_root" 'generated package web file set is missing or stale'

new_case generated-different
printf '\ndifferent generated bytes\n' \
  >> "$case_root/plugins/gobbi/skills/web/web-testing/SKILL.md"
expect_failure generated-different "$case_root" 'generated package web file differs from canonical: web-testing/SKILL.md'

new_case generated-symlink
rm -f -- "$case_root/plugins/gobbi/skills/web/web-testing/SKILL.md"
ln -s '../../../../../.gobbi/projects/gobbi/skills/web/web-testing/SKILL.md' \
  "$case_root/plugins/gobbi/skills/web/web-testing/SKILL.md"
expect_failure generated-symlink "$case_root" 'generated package web tree contains a symlink'

new_case codex-discovery-mismatch
rm -f -- "$case_root/.agents/skills/web"
ln -s '../../.gobbi/projects/gobbi/skills/not-web' "$case_root/.agents/skills/web"
expect_failure codex-discovery-mismatch "$case_root" '.agents/skills/web does not resolve to the canonical web family'

new_case claude-discovery-missing
rm -f -- "$case_root/.claude/skills/web/web-testing/checklists.md"
expect_failure claude-discovery-missing "$case_root" '.claude/skills/web discovery file set is missing or stale'

printf 'PASS: %d web family fixture tests completed\n' "$tests_run"
