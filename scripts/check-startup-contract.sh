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
  development-lifecycle.md
  startup.md
)
phase_titles=('Problem Definition' 'Design' 'Specification' 'Product Lifecycle' 'Development Lifecycle')
phase_slugs=(problem-definition design specification product-lifecycle development-lifecycle)

topic_count="$(find "$topics_root" -type f -name '*.md' | wc -l | tr -d '[:space:]')"
[[ "$topic_count" == 17 ]] || fail "$(relative_path "$topics_root")" 'topic topology' "expected 17 Markdown files, found $topic_count"
topic_file_count="$(find "$topics_root" -type f | wc -l | tr -d '[:space:]')"
[[ "$topic_file_count" == 17 ]] || fail "$(relative_path "$topics_root")" 'topic topology' "expected no non-Markdown topic files, found $topic_file_count total files"
template_count="$(find "$templates_root" -maxdepth 1 -type f -name '*.md' | wc -l | tr -d '[:space:]')"
[[ "$template_count" == 6 ]] || fail "$(relative_path "$templates_root")" 'template topology' "expected 6 Markdown files, found $template_count"
template_file_count="$(find "$templates_root" -maxdepth 1 -type f | wc -l | tr -d '[:space:]')"
[[ "$template_file_count" == 6 ]] || fail "$(relative_path "$templates_root")" 'template topology' "expected no non-Markdown template files, found $template_file_count total files"

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

for name in "${expected_templates[@]}"; do
  grep -Fq -- "\`$name\`" "$skill_file" || fail "$(relative_path "$skill_file")" 'returned document set' "missing $name"
done

question_count="$(grep -RhE --include='*.md' '^- .+\?[[:space:]]*$' "$topics_root" | wc -l | tr -d '[:space:]')"
[[ "$question_count" == 342 ]] || fail "$(relative_path "$topics_root")" 'question preservation' "expected 342 question bullets, found $question_count"
distinct_questions="$(grep -RhE --include='*.md' '^- .+\?[[:space:]]*$' "$topics_root" | LC_ALL=C sort -u | wc -l | tr -d '[:space:]')"
[[ "$distinct_questions" == 342 ]] || fail "$(relative_path "$topics_root")" 'question preservation' "expected 342 distinct question meanings, found $distinct_questions"
example_count="$(grep -RhE --include='*.md' '^  - \*\*Example:\*\*' "$topics_root" | wc -l | tr -d '[:space:]')"
[[ "$example_count" == 20 ]] || fail "$(relative_path "$topics_root")" examples "expected 20, found $example_count"

while IFS= read -r violation; do
  [[ -n "$violation" ]] && fail "${violation%%:*}" 'forbidden question metadata' 'bracket key prefix or metadata row remains'
done < <(grep -RInE --include='*.md' '^- \[[^]]+\][[:space:]]|^  - \*\*(Owner|Purpose|Oracle|Activation evidence|Source aliases):\*\*' "$topics_root" || true)

for topic in "${expected_topics[@]}"; do
  topic_file="$topics_root/$topic"
  for heading in '## Project' '## Product' '## Implementation'; do
    count="$(grep -Fxc -- "$heading" "$topic_file" || true)"
    [[ "$count" == 1 ]] || fail "$(relative_path "$topic_file")" 'topic shape' "expected one exact '$heading' heading, found $count"
  done
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
  'evidence-derived answer'
  'ask one user question at a time'
  'explicit user acceptance'
  'Product Lifecycle owns actor-visible promises'
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

for overlay in web desktop cli library sdk mobile data; do
  grep -Fq "product-lifecycle/$overlay.md" "$topics_root/product-lifecycle.md" || fail "$(relative_path "$topics_root/product-lifecycle.md")" 'Product overlay guidance' "missing $overlay overlay"
done
for overlay in tool framework language desktop network; do
  grep -Fq "development-lifecycle/$overlay.md" "$topics_root/development-lifecycle.md" || fail "$(relative_path "$topics_root/development-lifecycle.md")" 'Development overlay guidance' "missing $overlay overlay"
done
grep -Fq 'Select when accepted evidence shows' "$topics_root/product-lifecycle.md" || fail "$(relative_path "$topics_root/product-lifecycle.md")" 'Product overlay guidance' 'selection evidence is missing'
grep -Fq 'Select when accepted evidence shows' "$topics_root/development-lifecycle.md" || fail "$(relative_path "$topics_root/development-lifecycle.md")" 'Development overlay guidance' 'selection evidence is missing'

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

printf 'PASS: compact Startup interview contract is valid (342 questions, 20 examples, 17 topic banks, 6 templates)\n'
