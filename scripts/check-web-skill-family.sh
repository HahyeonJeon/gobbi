#!/usr/bin/env bash
set -uo pipefail

self="check-web-skill-family.sh"

fail() {
  printf '%s: FAIL: %s\n' "$self" "$*" >&2
  exit 1
}

repo_root_source="${GOBBI_WEB_REPO_ROOT:-$(dirname "${BASH_SOURCE[0]}")/..}"
if [[ ! -d "$repo_root_source" ]]; then
  fail "repository root is invalid: $repo_root_source"
fi
if ! repo_root="$(cd "$repo_root_source" && pwd -P)"; then
  fail "repository root is invalid: $repo_root_source"
fi

canonical_web="$repo_root/.gobbi/projects/gobbi/skills/web"
package_web="$repo_root/plugins/gobbi/skills/web"
agents_web="$repo_root/.agents/skills/web"
claude_web="$repo_root/.claude/skills/web"

if [[ ! -d "$canonical_web" || -L "$canonical_web" || ! -f "$canonical_web/SKILL.md" || -L "$canonical_web/SKILL.md" ]]; then
  fail 'repository root is invalid: canonical web skill is missing or not a real directory/file pair'
fi

names=(
  web-app-lifecycle
  web-architecture
  web-backend
  web-configuration
  web-deployment
  web-design
  web-development
  web-frontend
  web-interaction
  web-localization
  web-observability
  web-operations
  web-platform
  web-project-structure
  web-release
  web-security
  web-testing
)

types=(
  preference preference operation preference operation preference operation operation preference
  preference operation operation tool preference operation operation operation
)

prefixes=(
  WEBAPP WEBARCH WEBBACK WEBCFG WEBDEP WEBDES WEBDEV WEBFRNT WEBIXN WEBLOC WEBOBS WEBOPS
  WEBPLAT WEBPROJ WEBREL WEBSEC WEBTEST
)

totals=(55 44 47 40 42 48 55 50 48 46 55 55 49 32 42 52 50)

triggers=(
  'MUST load when choosing or reviewing browser or PWA behavior for startup, readiness, restoration, foreground and background transitions, freeze or discard, offline and reconnect, service-worker updates, mixed versions, browser-managed PWA installation state, cleanup, or removal.'
  'MUST load when choosing or reviewing client-server boundaries, rendering and delivery, navigation, state ownership, caching, progressive enhancement, or dependency strategy for a web application.'
  'MUST load when designing, building, or reviewing a web change'"'"'s server, API, domain rules, data lifecycle, provider integration, authorization, or server-side recovery.'
  'MUST load when choosing or reviewing how a web app or Electron renderer receives per-environment values, including build-time versus runtime configuration, secrets management, client-bundle exposure, feature-flag lifetime, or startup validation.'
  'MUST load when deploying an accepted web release to an authorized environment, verifying the production URL, advancing or stopping a rollout, or rolling back the environment.'
  'MUST load when choosing or reviewing a web product'"'"'s design problem, project identity, user-evidence threshold, alternative concepts, accepted design, validation judgment, post-release learning, replacement, or retirement criteria.'
  'MUST load when coordinating or reviewing one web change across design, implementation, testing, release, deployment, live learning, iteration, and retirement handoffs.'
  'MUST load when implementing or reviewing a web change'"'"'s browser-facing interface, content, accessibility, responsive behavior, recovery, or user-visible integration.'
  'MUST load when choosing or reviewing browser interaction behavior, including event and pointer contracts, keyboard operation, focus management, drag and gesture alternatives, listener lifetime and rate limiting, or WAI-ARIA widget patterns.'
  'MUST load when choosing or reviewing how a web app or Electron renderer handles language and region, including message catalogs, plural and grammatical selection, date, number, and currency formatting, locale negotiation, or right-to-left layout.'
  'MUST load when instrumenting or reviewing telemetry from a web app or Electron renderer, including structured logs, metrics, traces, trace-context propagation, crash and unhandled-error capture, or diagnostic redaction.'
  'MUST load when operating or reviewing a live web service, including health and support, incident response, routine maintenance, dependency and compatibility updates, deprecation, or retirement.'
  'MUST load when interpreting or verifying browser and Web Platform behavior, security boundaries, lifecycle, compatibility, accessibility, performance evidence, or diagnostics.'
  'MUST load when establishing or reviewing a web project'"'"'s directory structure, workspace or application roots, source, runtime, test, configuration, asset, migration, shared, generated, build, or deployable-output placement, or a documented placement exception.'
  'MUST load when producing or reviewing a web production build or release artifact, including frozen inputs, bundler configuration, chunking, asset names and cache policy, build identity, production source maps, or the artifact handoff to deployment.'
  'MUST load when a web change crosses a trust boundary; handles identity, sessions, protected or sensitive data; accepts untrusted content; changes authorization, providers, dependencies, security configuration, or public exposure; or requires security review.'
  'MUST load when designing, writing, running, diagnosing, or reviewing tests for a web application or change.'
)

yaml_value() {
  local key="$1" file="$2"
  awk -v key="$key" '
    NR == 1 && $0 == "---" { frontmatter = 1; next }
    frontmatter && $0 == "---" { exit }
    frontmatter && index($0, key ": ") == 1 {
      print substr($0, length(key) + 3)
      exit
    }
  ' "$file"
}

expected_children="$(printf '%s\n' "${names[@]}")"
actual_children="$(find "$canonical_web" -mindepth 1 -maxdepth 1 -type d -printf '%f\n' | LC_ALL=C sort)"
[[ "$actual_children" == "$expected_children" ]] \
  || fail 'child catalog does not contain the exact 17 stable names in order'

root_extras="$(find "$canonical_web" -mindepth 1 -maxdepth 1 ! -type d ! -name SKILL.md -printf '%f\n' | LC_ALL=C sort)"
[[ -z "$root_extras" ]] || fail "web root contains an unsupported entry: $root_extras"

[[ "$(yaml_value name "$canonical_web/SKILL.md")" == web ]] \
  || fail 'web root frontmatter name is not web'
[[ "$(yaml_value skill-type "$canonical_web/SKILL.md")" == domain ]] \
  || fail 'web root frontmatter type is not domain'
root_description='"MUST load before working in web. Web is a domain skill that routes the task to its applicable operation, tool, and preference child skills."'
[[ "$(yaml_value description "$canonical_web/SKILL.md")" == "$root_description" ]] \
  || fail 'web root frontmatter trigger changed'

mapfile -t root_rows < <(awk '/^\| \[`web-[^`]+`\]/ { print }' "$canonical_web/SKILL.md")
[[ "${#root_rows[@]}" -eq 17 ]] || fail "root route count is ${#root_rows[@]}; expected 17"

for index in "${!names[@]}"; do
  name="${names[$index]}"
  type="${types[$index]}"
  trigger="${triggers[$index]}"
  child="$canonical_web/$name"
  skill="$child/SKILL.md"
  checklist="$child/checklists.md"

  pair="$(find "$child" -mindepth 1 -maxdepth 1 -printf '%f\n' | LC_ALL=C sort)"
  [[ "$pair" == $'SKILL.md\nchecklists.md' ]] \
    || fail "$name pair shape must contain exactly SKILL.md and checklists.md"
  [[ -f "$skill" && ! -L "$skill" && -f "$checklist" && ! -L "$checklist" ]] \
    || fail "$name pair shape contains a missing, non-file, or symlinked member"
  [[ -z "$(find "$child" -mindepth 2 -print -quit)" ]] \
    || fail "$name pair shape contains a grandchild"

  [[ "$(yaml_value name "$skill")" == "$name" ]] \
    || fail "$name frontmatter name changed"
  [[ "$(yaml_value skill-type "$skill")" == "$type" ]] \
    || fail "$name frontmatter type changed"
  [[ "$(yaml_value description "$skill")" == "\"$trigger\"" ]] \
    || fail "$name frontmatter trigger changed"

  expected_row="| [\`$name\`]($name/SKILL.md) | $type | $trigger |"
  [[ "${root_rows[$index]}" == "$expected_row" ]] \
    || fail "$name root route, type, path, or trigger changed"
done

declare -A definition_owner=()
declare -A scenario_owner=()
declare -A reuse_seen=()
declare -A source_count=()
declare -a references=()
family_total=0

parse_checklist() {
  local prefix="$1" file="$2"
  awk -v prefix="$prefix" '
    function error(message) {
      print message
      failed = 1
      exit 1
    }
    function finish_scenario() {
      if (scenario != "") {
        if (checklist_heading != 1) error(scenario " does not contain exactly one Checklist heading")
        if (scenario_count < 1 || scenario_count > 6) {
          error(scenario " has " scenario_count " definitions; expected 1..6")
        }
      }
    }
    BEGIN {
      expected[1] = "Project"
      expected[2] = "Structure"
      expected[3] = "Performance"
      expected[4] = "Aesthetics"
      expected[5] = "Usage"
      expected[6] = "Consistency"
      expected[7] = "Risk"
      expected[8] = "Overall"
    }
    /^## / {
      finish_scenario()
      scenario = ""
      scenario_count = 0
      heading_count++
      if (heading_count > 8 || $0 != "## " expected[heading_count]) {
        error("perspective heading is missing, duplicated, or out of order at: " $0)
      }
      perspective = toupper(expected[heading_count])
      next
    }
    /^### / {
      finish_scenario()
      scenario_count = 0
      checklist_heading = 0
      heading = substr($0, 5)
      pattern = "^" prefix "-SC-(PROJECT|STRUCTURE|PERFORMANCE|AESTHETICS|USAGE|CONSISTENCY|RISK|OVERALL)-[0-9][0-9] — (Normal case|Edge case|Expected failure|Poor quality|Rule violation|Adversarial): .+$"
      if (heading !~ pattern) error("malformed scenario heading: " $0)
      scenario = heading
      sub(/ — .*/, "", scenario)
      split(scenario, part, "-")
      if (part[3] != perspective) error("perspective heading is missing, duplicated, or out of order before: " scenario)
      scenario_ordinal = part[4]
      print "SC|" scenario "|" perspective
      next
    }
    /^#### Checklist$/ {
      if (scenario == "") error("Checklist heading is outside a scenario")
      checklist_heading++
      if (checklist_heading > 1) error(scenario " contains a duplicate Checklist heading")
      next
    }
    /^####/ { error("malformed checklist heading: " $0) }
    /^- \[[^]]*\]/ {
      if ($0 !~ /^- \[ \] /) error("definition is not an unchecked checkbox: " $0)
      if (scenario == "") error("definition is outside a scenario: " $0)
      if (checklist_heading != 1) error("definition appears before its Checklist heading: " $0)
      marker = index($0, " — ")
      if (marker == 0) error("definition lacks the exact ID separator: " $0)
      if (length($0) <= marker + 3) error("definition has no condition: " $0)
      id = substr($0, 7, marker - 7)
      pattern = "^" prefix "-CK-(PROJECT|STRUCTURE|PERFORMANCE|AESTHETICS|USAGE|CONSISTENCY|RISK|OVERALL)-[0-9][0-9]-[0-9][0-9]$"
      if (id !~ pattern) error("malformed or wrong-prefix definition ID: " id)
      split(id, part, "-")
      if (part[3] != perspective || part[4] != scenario_ordinal) {
        error("definition ID does not belong to its scenario: " id)
      }
      scenario_count++
      if (scenario_count > 6) error(scenario " exceeds the six-definition scenario cap")
      print "DEF|" id "|" scenario
      next
    }
    /Also applies:/ {
      if (scenario == "") error("reuse is outside a scenario: " $0)
      if (checklist_heading != 1) error("reuse appears before its Checklist heading: " $0)
      if ($0 !~ /^- Also applies: [A-Z][A-Z0-9]*-CK-(PROJECT|STRUCTURE|PERFORMANCE|AESTHETICS|USAGE|CONSISTENCY|RISK|OVERALL)-[0-9][0-9]-[0-9][0-9] \(.+\)\.$/) {
        error("malformed Also applies reuse: " $0)
      }
      reuse = substr($0, 17)
      sub(/ \(.*/, "", reuse)
      print "REF|" reuse "|" scenario
      next
    }
    END {
      if (failed) exit 1
      finish_scenario()
      if (heading_count != 8) error("checklist has " heading_count " perspectives; expected 8")
    }
  ' "$file"
}

for index in "${!names[@]}"; do
  name="${names[$index]}"
  prefix="${prefixes[$index]}"
  checklist="$canonical_web/$name/checklists.md"
  if ! parsed="$(parse_checklist "$prefix" "$checklist")"; then
    fail "$name checklist structure: $parsed"
  fi

  count=0
  while IFS='|' read -r kind value scenario; do
    [[ -n "$kind" ]] || continue
    case "$kind" in
      SC)
        [[ -z "${scenario_owner[$value]:-}" ]] \
          || fail "duplicate scenario ID $value"
        scenario_owner["$value"]="$name"
        ;;
      DEF)
        [[ -z "${definition_owner[$value]:-}" ]] \
          || fail "duplicate definition ID $value"
        definition_owner["$value"]="$name"
        count=$((count + 1))
        family_total=$((family_total + 1))
        ;;
      REF)
        key="$scenario|$value"
        [[ -z "${reuse_seen[$key]:-}" ]] \
          || fail "duplicate Also applies reuse $value in $scenario"
        reuse_seen["$key"]=1
        references+=("$name|$scenario|$value")
        ;;
      *) fail "$name checklist parser emitted an unknown record" ;;
    esac
  done <<< "$parsed"

  (( count <= 55 )) || fail "$name exceeds the 55-definition source cap"
  source_count["$name"]="$count"
done

[[ "$family_total" -eq 810 ]] \
  || fail "family definition total is $family_total; expected 810"

for index in "${!names[@]}"; do
  name="${names[$index]}"
  [[ "${source_count[$name]}" -eq "${totals[$index]}" ]] \
    || fail "$name definition total is ${source_count[$name]}; expected ${totals[$index]}"
done

for record in "${references[@]}"; do
  IFS='|' read -r name scenario reference <<< "$record"
  [[ -n "${definition_owner[$reference]:-}" ]] \
    || fail "$name has unresolved Also applies reference $reference in $scenario"
done

require_definition() {
  local child="$1" id="$2" condition="$3"
  local file="$canonical_web/$child/checklists.md"
  grep -Fqx -- "- [ ] $id — $condition" "$file" \
    || fail "special-move definition $id is missing or changed"
}

require_reuse() {
  local child="$1" line="$2"
  grep -Fqx -- "$line" "$canonical_web/$child/checklists.md" \
    || fail "$child special Also applies reuse is missing or changed"
}

require_definition web-architecture WEBARCH-CK-PERFORMANCE-03-01 \
  'Offline cache, queued-action, reconnect, service-worker, and update work uses project-approved storage, network, and processing limits.'
require_definition web-platform WEBPLAT-CK-PERFORMANCE-01-04 \
  'Browser/PWA runtime resource use is measured under the named supported-browser, device, network, cache, and version conditions.'
require_definition web-testing WEBTEST-CK-CONSISTENCY-01-04 \
  'Every lifecycle test claim names the exact contract version, state, and transition it evaluates.'
require_definition web-testing WEBTEST-CK-PERFORMANCE-02-01 \
  'Capacity, saturation, cost, and dependency health are measured under the named environment and traffic conditions.'
require_definition web-platform WEBPLAT-CK-RISK-03-04 \
  'A cross-origin request carrying `traceparent` is confirmed with `web-platform` to be allowed by the receiver, since that header is not safelisted and makes the request preflighted.'
require_definition web-observability WEBOBS-CK-CONSISTENCY-02-02 \
  'Every accepted gap is handed off with its owner rather than left in the result as an absence.'
require_definition web-observability WEBOBS-CK-OVERALL-01-02 \
  'The named correlation and coverage limits are handed off with the reconciled result.'
require_definition web-frontend WEBFRNT-CK-RISK-04-02 \
  'No mock, screenshot, static capture, or polished placeholder is treated as proof of integration, semantics, focus, hidden behavior, responsiveness, interaction, recovery, or conformance.'

removed_observability_id='WEBOBS-CK-USAGE-02-02'
if grep -R -Fq -- "$removed_observability_id" "$canonical_web"; then
  fail "$removed_observability_id remains in the live web family"
fi

require_reuse web-development \
  '- Also applies: WEBFRNT-CK-RISK-04-02 (browser evidence stays within its proving limits).'
require_reuse web-operations \
  '- Also applies: WEBOBS-CK-CONSISTENCY-02-01 (emission, verified arrival, and observed live health remain separate claims).'
require_reuse web-release \
  '- Also applies: WEBDEP-CK-CONSISTENCY-01-04 (live-served names and cache directives observed from the production URL).'

require_definition web-development WEBDEV-CK-RISK-04-01 \
  'The coordinator performs no design, implementation, test, release, deployment, or operations action solely because coordination reached that stage.'
require_definition web-development WEBDEV-CK-RISK-04-02 \
  'Every specialist, external, destructive, and irreversible action retains the exact authority required by its owner.'
require_definition web-development WEBDEV-CK-RISK-04-03 \
  'Design acceptance, implementation correctness, test evidence, release readiness, deployment authority, deployment state, live verification, observed health, supported operation, and retirement are reported as separate claims.'
require_definition web-development WEBDEV-CK-RISK-04-04 \
  'An unauthorized external, destructive, or irreversible action pauses.'
require_definition web-development WEBDEV-CK-RISK-04-05 \
  'Every stage handoff is accepted only after the evaluation or approved limitation disposition required by that stage.'
require_definition web-development WEBDEV-CK-RISK-04-06 \
  'An unauthorized external, destructive, or irreversible action names the required authority.'

id_catalog() {
  sed -n 's/^- \[ \] \([A-Z0-9-]*\) — .*/\1/p' "$1"
}

expected_deployment_ids='WEBDEP-CK-PROJECT-03-01
WEBDEP-CK-PROJECT-03-02
WEBDEP-CK-PROJECT-03-03
WEBDEP-CK-PROJECT-03-04
WEBDEP-CK-STRUCTURE-03-01
WEBDEP-CK-STRUCTURE-03-02
WEBDEP-CK-PERFORMANCE-01-01
WEBDEP-CK-PERFORMANCE-01-02
WEBDEP-CK-PERFORMANCE-01-03
WEBDEP-CK-AESTHETICS-01-01
WEBDEP-CK-USAGE-01-01
WEBDEP-CK-USAGE-01-02
WEBDEP-CK-USAGE-01-03
WEBDEP-CK-USAGE-01-04
WEBDEP-CK-USAGE-01-05
WEBDEP-CK-USAGE-02-01
WEBDEP-CK-USAGE-02-02
WEBDEP-CK-USAGE-02-03
WEBDEP-CK-USAGE-02-04
WEBDEP-CK-USAGE-02-05
WEBDEP-CK-USAGE-03-01
WEBDEP-CK-CONSISTENCY-01-01
WEBDEP-CK-CONSISTENCY-01-02
WEBDEP-CK-CONSISTENCY-01-03
WEBDEP-CK-CONSISTENCY-01-04
WEBDEP-CK-CONSISTENCY-01-05
WEBDEP-CK-CONSISTENCY-02-01
WEBDEP-CK-CONSISTENCY-02-02
WEBDEP-CK-CONSISTENCY-02-03
WEBDEP-CK-CONSISTENCY-02-04
WEBDEP-CK-CONSISTENCY-02-05
WEBDEP-CK-CONSISTENCY-02-06
WEBDEP-CK-RISK-01-01
WEBDEP-CK-RISK-01-02
WEBDEP-CK-RISK-01-03
WEBDEP-CK-RISK-01-04
WEBDEP-CK-RISK-03-01
WEBDEP-CK-RISK-03-02
WEBDEP-CK-RISK-03-03
WEBDEP-CK-OVERALL-01-02
WEBDEP-CK-OVERALL-01-03
WEBDEP-CK-OVERALL-02-01'

expected_release_ids='WEBREL-CK-PROJECT-01-01
WEBREL-CK-PROJECT-01-02
WEBREL-CK-PROJECT-01-03
WEBREL-CK-PROJECT-01-04
WEBREL-CK-PROJECT-01-05
WEBREL-CK-PROJECT-01-06
WEBREL-CK-PROJECT-02-01
WEBREL-CK-PROJECT-02-02
WEBREL-CK-PROJECT-02-03
WEBREL-CK-STRUCTURE-01-01
WEBREL-CK-STRUCTURE-01-02
WEBREL-CK-STRUCTURE-01-03
WEBREL-CK-STRUCTURE-01-04
WEBREL-CK-STRUCTURE-01-05
WEBREL-CK-STRUCTURE-01-06
WEBREL-CK-STRUCTURE-02-01
WEBREL-CK-STRUCTURE-02-02
WEBREL-CK-STRUCTURE-02-03
WEBREL-CK-STRUCTURE-02-04
WEBREL-CK-STRUCTURE-02-05
WEBREL-CK-STRUCTURE-02-06
WEBREL-CK-STRUCTURE-03-01
WEBREL-CK-PERFORMANCE-01-01
WEBREL-CK-PERFORMANCE-01-02
WEBREL-CK-PERFORMANCE-01-03
WEBREL-CK-AESTHETICS-01-01
WEBREL-CK-AESTHETICS-01-02
WEBREL-CK-USAGE-01-01
WEBREL-CK-USAGE-01-02
WEBREL-CK-USAGE-01-03
WEBREL-CK-USAGE-01-04
WEBREL-CK-CONSISTENCY-01-01
WEBREL-CK-CONSISTENCY-01-02
WEBREL-CK-CONSISTENCY-01-03
WEBREL-CK-RISK-01-01
WEBREL-CK-RISK-01-02
WEBREL-CK-RISK-01-03
WEBREL-CK-RISK-01-04
WEBREL-CK-RISK-01-05
WEBREL-CK-RISK-01-06
WEBREL-CK-OVERALL-01-01
WEBREL-CK-OVERALL-01-02'

[[ "$(id_catalog "$canonical_web/web-deployment/checklists.md")" == "$expected_deployment_ids" ]] \
  || fail 'deployment disposition ID catalog changed'
[[ "$(id_catalog "$canonical_web/web-release/checklists.md")" == "$expected_release_ids" ]] \
  || fail 'release disposition ID catalog changed'

require_definition web-deployment WEBDEP-CK-CONSISTENCY-01-04 \
  'The live-served record contains the deployed asset names and cache directives for each release-defined file class and the entry document, observed from the production URL.'
require_definition web-release WEBREL-CK-PROJECT-01-01 \
  'Release work starts from `web-development`'"'"'s evaluated handoff or the caller'"'"'s equivalent, including its compatibility notes, configuration state, and release requirements.'
require_definition web-deployment WEBDEP-CK-PROJECT-03-01 \
  'Deployment work starts from an accepted release handoff that includes rollout and rollback intent and the exact deployment-authority state.'

native_skill="$canonical_web/web-app-lifecycle/SKILL.md"
grep -Fqx -- 'installation and removal. Native installed-application behavior remains with Desktop and Electron.' "$native_skill" \
  || fail 'native-boundary contract no longer hands installed-application behavior to Desktop and Electron'
grep -Fqx -- '- [ ] WEBAPP-CK-RISK-02-01 — No lifecycle claim extends beyond browser or browser-managed PWA behavior.' "$canonical_web/web-app-lifecycle/checklists.md" \
  || fail 'native-boundary contract lost the browser/PWA scope limit'
for suffix in \
  '02 — No lifecycle claim covers native package installation.' \
  '03 — No lifecycle claim covers native application, main-process, window, or utility-process lifecycle.' \
  '04 — No lifecycle claim covers a native updater or native update rollback.' \
  '05 — No lifecycle claim covers native application uninstall.'; do
  grep -Fqx -- "- [ ] WEBAPP-CK-RISK-02-$suffix" "$canonical_web/web-app-lifecycle/checklists.md" \
    || fail 'native-boundary contract lost an explicit Desktop/Electron exclusion'
done

old_names=("web-feat""ure" "web-inter""face" "web-topo""logy")
old_prefixes=("WEBF""EAT" "WEBI""NTF" "WEBT""OPO")
for old in "${old_names[@]}" "${old_prefixes[@]}"; do
  if grep -R -Fq -- "$old" "$canonical_web"; then
    fail "old live web name or prefix remains in canonical content: $old"
  fi
done

file_inventory() {
  local root="$1"
  [[ -d "$root" ]] || return 0
  (cd "$root" && find . -mindepth 1 -type f -printf '%P\n') | LC_ALL=C sort
}

directory_inventory() {
  local root="$1"
  [[ -d "$root" ]] || return 0
  (cd "$root" && find . -mindepth 1 -type d -printf '%P\n') | LC_ALL=C sort
}

[[ -d "$package_web" && ! -L "$package_web" ]] \
  || fail 'generated package web tree is missing or symlinked'
package_symlink="$(find "$package_web" -type l -print -quit)"
[[ -z "$package_symlink" ]] \
  || fail "generated package web tree contains a symlink: ${package_symlink#"$repo_root"/}"

canonical_files="$(file_inventory "$canonical_web")"
package_files="$(file_inventory "$package_web")"
[[ "$canonical_files" == "$package_files" ]] \
  || fail 'generated package web file set is missing or stale'
[[ "$(directory_inventory "$canonical_web")" == "$(directory_inventory "$package_web")" ]] \
  || fail 'generated package web directory set is missing or stale'

while IFS= read -r rel; do
  [[ -n "$rel" ]] || continue
  cmp -s -- "$canonical_web/$rel" "$package_web/$rel" \
    || fail "generated package web file differs from canonical: $rel"
done <<< "$canonical_files"

for old in "${old_names[@]}" "${old_prefixes[@]}"; do
  if grep -R -Fq -- "$old" "$package_web"; then
    fail "old live web name or prefix remains in generated content: $old"
  fi
done

[[ -L "$agents_web" ]] || fail '.agents/skills/web is not a discovery symlink'
[[ "$(realpath -e -- "$agents_web")" == "$canonical_web" ]] \
  || fail '.agents/skills/web does not resolve to the canonical web family'

[[ -d "$claude_web" && ! -L "$claude_web" ]] \
  || fail '.claude/skills/web is not a real discovery directory'
claude_entries="$(cd "$claude_web" && find . -mindepth 1 ! -type d -printf '%P\n' | LC_ALL=C sort)"
[[ "$claude_entries" == "$canonical_files" ]] \
  || fail '.claude/skills/web discovery file set is missing or stale'
[[ "$(directory_inventory "$claude_web")" == "$(directory_inventory "$canonical_web")" ]] \
  || fail '.claude/skills/web discovery directory set is missing or stale'

while IFS= read -r rel; do
  [[ -n "$rel" ]] || continue
  link="$claude_web/$rel"
  [[ -L "$link" ]] || fail ".claude/skills/web/$rel is not a per-file discovery symlink"
  [[ "$(realpath -e -- "$link")" == "$canonical_web/$rel" ]] \
    || fail ".claude/skills/web/$rel does not resolve to its canonical owner"
done <<< "$canonical_files"

printf 'PASS: web skill family guard checked 17 children and 810 checklist definitions\n'
