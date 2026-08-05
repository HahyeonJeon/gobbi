#!/usr/bin/env bash

set -euo pipefail

readonly SELF='scripts/check-startup-contract.sh'
readonly STARTUP_REL='.gobbi/projects/gobbi/skills/startup'

failures=()

fail() {
  failures+=("FAIL: $1: $2: $3")
}

fatal() {
  printf 'FAIL: %s: %s: %s\n' "$1" "$2" "$3"
  exit 2
}

relative_path() {
  local path="$1"
  if [[ "$path" == "$repo_root/"* ]]; then
    printf '%s' "${path#"$repo_root/"}"
  else
    printf '%s' "$path"
  fi
}

if (( $# != 0 )); then
  fatal "$SELF" arguments 'positional arguments are not supported'
fi

if [[ ${GOBBI_STARTUP_CHECK_REPO_ROOT+x} == x ]]; then
  [[ -n "$GOBBI_STARTUP_CHECK_REPO_ROOT" ]] || fatal GOBBI_STARTUP_CHECK_REPO_ROOT 'repository root' 'injected root is absent'
  [[ "$GOBBI_STARTUP_CHECK_REPO_ROOT" == /* ]] || fatal "$GOBBI_STARTUP_CHECK_REPO_ROOT" 'repository root' 'injected root must be absolute'
  repo_root="${GOBBI_STARTUP_CHECK_REPO_ROOT%/}"
else
  script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)" || fatal "$SELF" 'repository root' 'cannot resolve checker directory'
  repo_root="$(cd -- "$script_dir/.." && pwd -P)" || fatal "$SELF" 'repository root' 'cannot resolve repository root'
fi

[[ -d "$repo_root" ]] || fatal "$repo_root" 'repository root' 'directory is absent'

startup_root="$repo_root/$STARTUP_REL"
skill_file="$startup_root/SKILL.md"
topics_root="$startup_root/topics"
templates_root="$startup_root/templates"
discovery_link="$repo_root/.agents/skills/startup"
link_checker="$repo_root/scripts/check-markdown-links.sh"

[[ -r "$skill_file" ]] || fatal "$(relative_path "$skill_file")" 'Startup owner' 'SKILL.md is absent or unreadable'
[[ -d "$topics_root" ]] || fatal "$(relative_path "$topics_root")" 'topic topology' 'directory is absent'
[[ -d "$templates_root" ]] || fatal "$(relative_path "$templates_root")" 'template topology' 'directory is absent'
[[ -r "$link_checker" ]] || fatal "$(relative_path "$link_checker")" 'Markdown link owner' 'checker is absent or unreadable'

expected_topics=(
  problem-definition.md
  design.md
  specification.md
  product-lifecycle.md
  product-lifecycle/web.md
  product-lifecycle/desktop.md
  product-lifecycle/cli.md
  product-lifecycle/library.md
  product-lifecycle/sdk.md
  product-lifecycle/mobile.md
  product-lifecycle/data.md
  design-lifecycle.md
  design-lifecycle/ui.md
  design-lifecycle/presentation.md
  design-lifecycle/report.md
  development-lifecycle.md
  development-lifecycle/tool.md
  development-lifecycle/framework.md
  development-lifecycle/language.md
  development-lifecycle/desktop.md
  development-lifecycle/network.md
)
expected_templates=(
  problem-definition.md
  design.md
  specification.md
  product-lifecycle.md
  design-lifecycle.md
  development-lifecycle.md
  startup.md
)
phase_titles=('Problem Definition' 'Design' 'Specification' 'Product Lifecycle' 'Design Lifecycle' 'Development Lifecycle')
phase_slugs=(problem-definition design specification product-lifecycle design-lifecycle development-lifecycle)

topic_count="$(find "$topics_root" -type f -name '*.md' | wc -l | tr -d '[:space:]')"
[[ "$topic_count" == 21 ]] || fail "$(relative_path "$topics_root")" 'topic topology' "expected 21 Markdown files, found $topic_count"
topic_file_count="$(find "$topics_root" -type f | wc -l | tr -d '[:space:]')"
[[ "$topic_file_count" == 21 ]] || fail "$(relative_path "$topics_root")" 'topic topology' "expected no non-Markdown topic files, found $topic_file_count total files"
template_count="$(find "$templates_root" -maxdepth 1 -type f -name '*.md' | wc -l | tr -d '[:space:]')"
[[ "$template_count" == 7 ]] || fail "$(relative_path "$templates_root")" 'template topology' "expected 7 Markdown files, found $template_count"
template_file_count="$(find "$templates_root" -maxdepth 1 -type f | wc -l | tr -d '[:space:]')"
[[ "$template_file_count" == 7 ]] || fail "$(relative_path "$templates_root")" 'template topology' "expected no non-Markdown template files, found $template_file_count total files"

for rel in "${expected_topics[@]}"; do
  [[ -r "$topics_root/$rel" ]] || fail "$(relative_path "$topics_root/$rel")" 'topic topology' 'expected topic is absent or unreadable'
done
for name in "${expected_templates[@]}"; do
  [[ -r "$templates_root/$name" ]] || fail "$(relative_path "$templates_root/$name")" 'template topology' 'expected template is absent or unreadable'
done

for removed in "$topics_root/alias-migration.tsv" "$templates_root/startup.tmp.md"; do
  [[ ! -e "$removed" && ! -L "$removed" ]] || fail "$(relative_path "$removed")" 'removed compact artifact' 'must be absent'
done

if [[ ! -L "$discovery_link" ]]; then
  fail "$(relative_path "$discovery_link")" 'discovery topology' 'must be a whole-directory symlink'
elif [[ "$(readlink -- "$discovery_link")" != '../../.gobbi/projects/gobbi/skills/startup' ]]; then
  fail "$(relative_path "$discovery_link")" 'discovery topology' "unexpected target '$(readlink -- "$discovery_link")'"
fi

top_level="$(grep -E '^## ' "$skill_file" || true)"
expected_top_level=$'## Principles\n## Rules\n## Procedure\n## References'
[[ "$top_level" == "$expected_top_level" ]] || fail "$(relative_path "$skill_file")" 'operation shape' 'expected Principles, Rules, Procedure, and References in that order'
# Count headings only inside Principles to avoid coupling the check to principle titles.
principle_count="$(awk '$0=="## Principles"{on=1;next} $0=="## Rules"{on=0} on && /^### /{n++} END{print n+0}' "$skill_file")"
[[ "$principle_count" == 4 ]] || fail "$(relative_path "$skill_file")" principles "expected 4, found $principle_count"
rule_count="$(awk '$0=="## Rules"{on=1;next} $0=="## Procedure"{on=0} on && /^- \*\*(MUST|NEVER)/{n++} END{print n+0}' "$skill_file")"
[[ "$rule_count" == 6 ]] || fail "$(relative_path "$skill_file")" rules "expected 6, found $rule_count"
phase_heading_count="$(grep -cE '^### Phase [1-3] — ' "$skill_file" || true)"
[[ "$phase_heading_count" == 3 ]] || fail "$(relative_path "$skill_file")" procedure "expected 3 Phase headings, found $phase_heading_count"

previous_line=0
for index in "${!phase_titles[@]}"; do
  number=$((index + 1))
  title="${phase_titles[$index]}"
  slug="${phase_slugs[$index]}"
  expected_row="| $number | $title | [\`topics/$slug.md\`](topics/$slug.md) | [\`templates/$slug.md\`](templates/$slug.md) | \`$slug.md\` |"
  line="$(grep -nF -- "$expected_row" "$skill_file" | cut -d: -f1 || true)"
  [[ -n "$line" ]] || {
    fail "$(relative_path "$skill_file")" 'phase bank' "missing exact ordered row for $title"
    continue
  }
  (( line > previous_line )) || fail "$(relative_path "$skill_file")" 'phase bank' "$title is out of order"
  previous_line="$line"
done

return_section="$(awk '$0 == "#### 3.2 Return the complete design" { on=1; next } $0 == "## References" { on=0 } on { print }' "$skill_file")"
for name in "${expected_templates[@]}"; do
  grep -Fq -- "\`$name\`" <<< "$return_section" || fail "$(relative_path "$skill_file")" 'returned document set' "missing $name"
done

question_count="$(grep -RhE --include='*.md' '^- .+\?[[:space:]]*$' "$topics_root" | wc -l | tr -d '[:space:]')"
[[ "$question_count" == 479 ]] || fail "$(relative_path "$topics_root")" 'question inventory' "expected 479 question bullets, found $question_count"
valid_alias_count="$(grep -RhE --include='*.md' '^- \[[a-z0-9]+(-[a-z0-9]+)*\] .+\?[[:space:]]*$' "$topics_root" | wc -l | tr -d '[:space:]')"
[[ "$valid_alias_count" == 479 ]] || fail "$(relative_path "$topics_root")" 'question aliases' "expected 479 questions with one lowercase-kebab alias, found $valid_alias_count"
distinct_questions="$(grep -RhE --include='*.md' '^- \[[a-z0-9]+(-[a-z0-9]+)*\] .+\?[[:space:]]*$' "$topics_root" | sed -E 's/^- \[[^]]+\] //' | LC_ALL=C sort -u | wc -l | tr -d '[:space:]')"
[[ "$distinct_questions" == 479 ]] || fail "$(relative_path "$topics_root")" 'question inventory' "expected 479 distinct question meanings, found $distinct_questions"
distinct_aliases="$(grep -RhE --include='*.md' '^- \[[a-z0-9]+(-[a-z0-9]+)*\] .+\?[[:space:]]*$' "$topics_root" | sed -E 's/^- \[([^]]+)\].*/\1/' | LC_ALL=C sort -u | wc -l | tr -d '[:space:]')"
[[ "$distinct_aliases" == 479 ]] || fail "$(relative_path "$topics_root")" 'question aliases' "expected 479 globally unique aliases, found $distinct_aliases"
while IFS= read -r violation; do
  [[ -n "$violation" ]] || continue
  content="${violation#*:*:}"
  if [[ ! "$content" =~ ^-\ \[[a-z0-9]+(-[a-z0-9]+)*\]\ .+\?$ ]] ||
     [[ "$content" =~ ^-\ \[[a-z0-9]+(-[a-z0-9]+)*\]\ \[[a-z0-9]+(-[a-z0-9]+)*\]\  ]]; then
    fail "${violation%%:*}" 'question aliases' 'question must have exactly one lowercase-kebab alias'
  fi
done < <(grep -RInE --include='*.md' '^- .+\?[[:space:]]*$' "$topics_root" || true)
while IFS= read -r violation; do
  [[ -n "$violation" ]] && fail "${violation%%:*}" 'question aliases' 'static derived aliases are reserved for runtime meanings'
done < <(grep -RInE --include='*.md' '^- \[derived-' "$topics_root" || true)

pair_digest="$({
  find "$topics_root" -type f -name '*.md' -print0 |
    LC_ALL=C sort -z |
    xargs -0 awk 'match($0,/^- \[([a-z0-9-]+)\] (.*\?)$/,m){print m[1] "\t" m[2]}' |
    LC_ALL=C sort
} | sha256sum | awk '{print $1}')"
expected_pair_digest='d82ab7aa987e29b7efbf75f1b4ea7c8145329f1b2116851a695558ecf14b3049'
[[ "$pair_digest" == "$expected_pair_digest" ]] || fail "$(relative_path "$topics_root")" 'question pair integrity' "expected $expected_pair_digest, found $pair_digest"

product_question_count="$(grep -hE '^- \[[a-z0-9-]+\] .+\?$' "$topics_root/product-lifecycle.md" "$topics_root/product-lifecycle"/*.md | wc -l | tr -d '[:space:]')"
[[ "$product_question_count" == 91 ]] || fail "$(relative_path "$topics_root/product-lifecycle.md")" 'Product Lifecycle coverage' "expected 91 family questions, found $product_question_count"
development_question_count="$(grep -hE '^- \[[a-z0-9-]+\] .+\?$' "$topics_root/development-lifecycle.md" "$topics_root/development-lifecycle"/*.md | wc -l | tr -d '[:space:]')"
[[ "$development_question_count" == 59 ]] || fail "$(relative_path "$topics_root/development-lifecycle.md")" 'Development Lifecycle coverage' "expected 59 family questions, found $development_question_count"
design_lifecycle_question_count="$(grep -hE '^- \[[a-z0-9-]+\] .+\?$' "$topics_root/design-lifecycle.md" "$topics_root/design-lifecycle"/*.md | wc -l | tr -d '[:space:]')"
[[ "$design_lifecycle_question_count" == 85 ]] || fail "$(relative_path "$topics_root/design-lifecycle.md")" 'Design Lifecycle coverage' "expected 85 family questions, found $design_lifecycle_question_count"
specification_question_count="$(grep -cE '^- \[[a-z0-9-]+\] .+\?$' "$topics_root/specification.md" || true)"
[[ "$specification_question_count" == 152 ]] || fail "$(relative_path "$topics_root/specification.md")" 'Specification coverage' "expected 152 questions, found $specification_question_count"
example_count="$(grep -RhE --include='*.md' '^  - \*\*Example:\*\*' "$topics_root" | wc -l | tr -d '[:space:]')"
[[ "$example_count" == 25 ]] || fail "$(relative_path "$topics_root")" examples "expected 25, found $example_count"

while IFS= read -r violation; do
  [[ -n "$violation" ]] && fail "${violation%%:*}" 'forbidden question metadata' 'metadata row remains'
done < <(grep -RInE --include='*.md' '^  - \*\*(Owner|Purpose|Oracle|Activation evidence|Source aliases):\*\*' "$topics_root" || true)

for topic in "${expected_topics[@]}"; do
  topic_file="$topics_root/$topic"
  for heading in '## Project' '## Product' '## Implementation'; do
    count="$(grep -Fxc -- "$heading" "$topic_file" || true)"
    [[ "$count" == 1 ]] || fail "$(relative_path "$topic_file")" 'topic shape' "expected one exact '$heading' heading, found $count"
  done
done

for lifecycle_topic in "$topics_root/product-lifecycle.md" "$topics_root/development-lifecycle.md"; do
  lifecycle_rel="$(relative_path "$lifecycle_topic")"
  while IFS= read -r violation; do
    [[ -n "$violation" ]] && fail "$lifecycle_rel:${violation%%:*}" 'obsolete lifecycle topic machinery' 'Scenario Model, scenario-record field list, or coverage-state machinery remains'
  done < <(
    awk '$0 == "## Project" { exit } { print NR ":" $0 }' "$lifecycle_topic" |
      grep -Ei '^[0-9]+:## .*Scenario (Model|Record Contract|Records?)$|^[0-9]+:Select evidence-derived scenarios by .*path variant|^[0-9]+:Record the Development dimension|^[0-9]+:.*coverage[ -](status|state)' || true
  )
done

for index in "${!phase_slugs[@]}"; do
  template="$templates_root/${phase_slugs[$index]}.md"
  template_rel="$(relative_path "$template")"
  previous_line=0
  for heading in '## Project' '## Products' '## Implementations'; do
    line="$(grep -nFx -- "$heading" "$template" | cut -d: -f1 || true)"
    [[ -n "$line" ]] || {
      fail "$template_rel" 'phase template shape' "missing exact '$heading' heading"
      continue
    }
    (( line > previous_line )) || fail "$template_rel" 'phase template shape' "'$heading' is out of order"
    previous_line="$line"
  done
  acceptance_count="$(grep -cE '^- Accepted: ' "$template" || true)"
  [[ "$acceptance_count" == 3 ]] || fail "$template_rel" 'plain subject acceptance' "expected 3 markers, found $acceptance_count"
done

synthesis="$templates_root/startup.md"
previous_line=0
for heading in '## Summary' '## Project' '## Products' '## Implementations' '## Integrated Design' '## Final Acceptance'; do
  line="$(grep -nFx -- "$heading" "$synthesis" | cut -d: -f1 || true)"
  [[ -n "$line" ]] || {
    fail "$(relative_path "$synthesis")" 'synthesis shape' "missing exact '$heading' heading"
    continue
  }
  (( line > previous_line )) || fail "$(relative_path "$synthesis")" 'synthesis shape' "'$heading' is out of order"
  previous_line="$line"
done
final_acceptance_count="$(grep -cE '^- Accepted: ' "$synthesis" || true)"
[[ "$final_acceptance_count" == 1 ]] || fail "$(relative_path "$synthesis")" 'final acceptance' "expected 1 marker, found $final_acceptance_count"

required_skill_phrases=(
  'Project -> Product -> Implementation'
  'exactly one complete-stack Implementation'
  'technologies remain categorized entries'
  'reusable baselines, not closed questionnaires'
  'accepted earlier-phase sections'
  'accepted current-phase sections'
  'Retain a still-material question'
  'rewrite it with accepted vocabulary'
  'resolved or inapplicable meaning'
  'split one question'
  'equivalent meanings; add a material meaning'
  'add a material meaning'
  'reorder questions'
  'after every accepted answer'
  '[derived-<phase>-<intent>]'
  'every source alias in'
  'lexical order'
  'earliest unresolved working question'
  'run Step 2.4 before Product Lifecycle'
  'run Step 2.5 before Design Lifecycle'
  'run Step 2.6 before Development Lifecycle'
  'immediately before Product Lifecycle'
  'immediately before Design Lifecycle'
  'immediately before Development Lifecycle'
  'unsupported imagined scenarios'
  'return to the earliest section that owns the disputed meaning'
  'rebuild only affected later sections'
  'ask one user question at a time'
  'explicit user acceptance'
  'Product Lifecycle owns actor-visible promises'
  'Design Lifecycle owns visual production'
  'Development Lifecycle owns implementation-neutral complete-stack mechanisms and evidence'
  'Startup produces design guidance'
  'does not produce implementation tasks'
)
for phrase in "${required_skill_phrases[@]}"; do
  grep -Fq -- "$phrase" "$skill_file" || fail "$(relative_path "$skill_file")" 'core compact behavior' "missing '$phrase'"
done

grep -Fq 'Product Lifecycle does not depend on Development' "$templates_root/product-lifecycle.md" && \
  fail "$(relative_path "$templates_root/product-lifecycle.md")" 'lifecycle boundary' 'obsolete dependency wording remains'
grep -Fq 'Keep these promises separate from Development Lifecycle mechanisms.' "$templates_root/product-lifecycle.md" || \
  fail "$(relative_path "$templates_root/product-lifecycle.md")" 'lifecycle boundary' 'Product and Development content are not explicitly separate'
grep -Fq 'Link them to Product Lifecycle promises' "$templates_root/development-lifecycle.md" || \
  fail "$(relative_path "$templates_root/development-lifecycle.md")" 'lifecycle boundary' 'Development content does not link accepted Product promises'
grep -Fq 'Keep software and Project structure in Design and Specification' "$templates_root/design-lifecycle.md" || \
  fail "$(relative_path "$templates_root/design-lifecycle.md")" 'Design Lifecycle boundary' 'software and Project structure boundary is missing'
grep -Fq 'actor-visible promises in Product Lifecycle' "$templates_root/design-lifecycle.md" || \
  fail "$(relative_path "$templates_root/design-lifecycle.md")" 'Design Lifecycle boundary' 'actor-visible Product promise boundary is missing'
grep -Fq 'technical build and release mechanisms in Development Lifecycle' "$templates_root/design-lifecycle.md" || \
  fail "$(relative_path "$templates_root/design-lifecycle.md")" 'Design Lifecycle boundary' 'technical delivery boundary is missing'
grep -Fq 'Design Lifecycle' "$templates_root/startup.md" || \
  fail "$(relative_path "$templates_root/startup.md")" 'synthesis integration' 'Design Lifecycle is absent'
grep -Fq 'complete seven-document design' "$templates_root/startup.md" || \
  fail "$(relative_path "$templates_root/startup.md")" 'synthesis integration' 'seven-document acceptance is absent'

for overlay in web desktop cli library sdk mobile data; do
  grep -Fq "product-lifecycle/$overlay.md" "$topics_root/product-lifecycle.md" || fail "$(relative_path "$topics_root/product-lifecycle.md")" 'Product overlay guidance' "missing $overlay overlay"
done
for overlay in tool framework language desktop network; do
  grep -Fq "development-lifecycle/$overlay.md" "$topics_root/development-lifecycle.md" || fail "$(relative_path "$topics_root/development-lifecycle.md")" 'Development overlay guidance' "missing $overlay overlay"
done
for overlay in ui presentation report; do
  grep -Fq "design-lifecycle/$overlay.md" "$topics_root/design-lifecycle.md" || fail "$(relative_path "$topics_root/design-lifecycle.md")" 'Design overlay guidance' "missing $overlay overlay"
done
grep -Fq 'Select when accepted evidence shows' "$topics_root/product-lifecycle.md" || fail "$(relative_path "$topics_root/product-lifecycle.md")" 'Product overlay guidance' 'selection evidence is missing'
grep -Fq 'Select when accepted evidence shows' "$topics_root/development-lifecycle.md" || fail "$(relative_path "$topics_root/development-lifecycle.md")" 'Development overlay guidance' 'selection evidence is missing'
grep -Fq 'Select when accepted evidence shows' "$topics_root/design-lifecycle.md" || fail "$(relative_path "$topics_root/design-lifecycle.md")" 'Design overlay guidance' 'selection evidence is missing'
grep -Fq 'comparable form without a matching overlay uses this adaptive common bank' "$topics_root/design-lifecycle.md" || fail "$(relative_path "$topics_root/design-lifecycle.md")" 'Design overlay guidance' 'adaptive common-bank fallback is missing'

forbidden_sources=("$skill_file" "${expected_templates[@]/#/$templates_root/}")
forbidden_pattern='Startup schema|schema[[:space:]]+[0-9]|legacy|previous[- ]design|revalidat|startup\.tmp\.md|alias[- ]migration|Section Register|Artifact Register|output directory|absolute output|artifact path|artifact status|workflow state|stage transition|correction procedure|reopen procedure|recovery mode|recover (the )?(design|Startup|route|interview)|resume (the )?(design|Startup|route|interview)|reconstruct.*(route|Startup)|Current route|Next action|Cursor|completed-v|Task(List|Get|Create|Update)|native TODO|\.\./record/SKILL\.md'
while IFS= read -r violation; do
  [[ -n "$violation" ]] && fail "${violation%%:*}" 'obsolete Startup behavior' 'schema, recovery-route, temporary, receipt, output-path, or Record behavior remains'
done < <(grep -InEi "$forbidden_pattern" "${forbidden_sources[@]}" || true)

link_output=''
link_status=0
set +e
link_output="$(bash "$link_checker" "$startup_root" 2>&1)"
link_status=$?
set -e
if (( link_status != 0 )); then
  (( link_status != 2 )) || fatal "$(relative_path "$link_checker")" 'Markdown links' 'checker could not inspect Startup'
  while IFS= read -r line; do
    case "$line" in
      BROKEN:*|BROKEN-ANCHOR:*) fail "$(relative_path "$link_checker")" 'Markdown links' "${line//"$repo_root/"/}" ;;
    esac
  done <<< "$link_output"
fi

if (( ${#failures[@]} > 0 )); then
  printf '%s\n' "${failures[@]}"
  exit 1
fi

printf 'PASS: adaptive Startup interview contract is valid (479 aliased questions, 25 examples, 21 topic banks, 7 templates)\n'
