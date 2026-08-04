#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
sync_script="$repo_root/scripts/sync-plugin-package.sh"
tmp_root="$(mktemp -d "${TMPDIR:-/tmp}/gobbi-sync-tests.XXXXXX")"
tests_run=0

cleanup() {
  if [[ -d "$tmp_root" && ! -L "$tmp_root" ]]; then
    find "$tmp_root" -depth -mindepth 1 -delete
    rmdir "$tmp_root"
  fi
}
trap cleanup EXIT

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

pass() {
  tests_run=$((tests_run + 1))
  printf 'PASS: %s\n' "$1"
}

assert_file_contains() {
  local path="$1" pattern="$2"
  grep -F -- "$pattern" "$path" >/dev/null || fail "$path does not contain: $pattern"
}

make_fixture() {
  local root="$1" role skill
  mkdir -p \
    "$root/.gobbi/projects/gobbi/skills" \
    "$root/.gobbi/projects/gobbi/agents" \
    "$root/.agents/skills" \
    "$root/.agents/plugins" \
    "$root/.claude/skills" \
    "$root/.claude/agents" \
    "$root/.codex/agents" \
    "$root/plugins/gobbi/.codex-plugin" \
    "$root/plugins/gobbi/.claude-plugin" \
    "$root/.claude-plugin"

  printf '%s\n' \
    '{"name":"gobbi","version":"1.0.0","description":"fixture","skills":"./skills/"}' \
    > "$root/plugins/gobbi/.codex-plugin/plugin.json"
  printf '%s\n' \
    '{"name":"gobbi","version":"1.0.0","description":"fixture"}' \
    > "$root/plugins/gobbi/.claude-plugin/plugin.json"
  printf '%s\n' \
    '{"name":"gobbi-workspace","plugins":[{"name":"gobbi","source":{"source":"local","path":"./plugins/gobbi"}}]}' \
    > "$root/.agents/plugins/marketplace.json"
  printf '%s\n' \
    '{"name":"fixture","plugins":[{"name":"gobbi","version":"1.0.0","source":"./plugins/gobbi"}]}' \
    > "$root/.claude-plugin/marketplace.json"
  printf '%s\n' \
    '{"env":{"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS":"1"},"teammateMode":"in-process"}' \
    > "$root/.claude/settings.json"
  printf '%s\n' 'General | Cowork | Workflow' 'Configuration -> Ideation -> Planning -> Execution -> Wrap-up' 'DISCUSSION -> WORK -> EVALUATION -> RECORD' \
    > "$root/.codex/AGENTS.md"
  printf '%s\n' 'General | Cowork | Workflow' 'Configuration -> Ideation -> Planning -> Execution -> Wrap-up' 'DISCUSSION -> WORK -> EVALUATION -> RECORD' \
    > "$root/.claude/CLAUDE.md"
  ln -s '.codex/AGENTS.md' "$root/AGENTS.md"

  for role in manager leader executor evaluator assistant; do
    printf '# %s\n' "$role" > "$root/.gobbi/projects/gobbi/agents/$role.md"
    printf 'name = "%s"\n' "$role" > "$root/.gobbi/projects/gobbi/agents/$role.toml"
    ln -s "../../.gobbi/projects/gobbi/agents/$role.md" "$root/.claude/agents/$role.md"
    ln -s "../../.gobbi/projects/gobbi/agents/$role.toml" "$root/.codex/agents/$role.toml"
  done

  # Every fixture starts from one accepted lifecycle combination. Tests mutate this
  # same temporary tree one semantic edge at a time, so the existing reconciliation
  # harness remains the only system under test and unrelated topology stays valid.
  for skill in gobbi git memory cowork workflow; do
    cp -R "$repo_root/.gobbi/projects/gobbi/skills/$skill" \
      "$root/.gobbi/projects/gobbi/skills/$skill"
  done
  cp "$repo_root/.gobbi/projects/gobbi/agents/manager.md" \
    "$root/.gobbi/projects/gobbi/agents/manager.md"
  cp "$repo_root/.gobbi/projects/gobbi/agents/assistant.md" \
    "$root/.gobbi/projects/gobbi/agents/assistant.md"
  cp "$repo_root/.codex/AGENTS.md" "$root/.codex/AGENTS.md"
  cp "$repo_root/.claude/CLAUDE.md" "$root/.claude/CLAUDE.md"
  cp "$repo_root/.claude/settings.json" "$root/.claude/settings.json"
}

replace_literal_once() {
  local path="$1" old="$2" new="$3" output
  output="$(mktemp "$tmp_root/rewrite.XXXXXX")"
  if ! awk -v old="$old" -v new="$new" '
    !changed {
      offset = index($0, old)
      if (offset) {
        $0 = substr($0, 1, offset - 1) new substr($0, offset + length(old))
        changed = 1
      }
    }
    { print }
    END { if (!changed) exit 42 }
  ' "$path" > "$output"; then
    find "$output" -depth -mindepth 0 -delete
    fail "semantic mutation source is absent from $path: $old"
  fi
  mv "$output" "$path"
}

replace_block_once() {
  local path="$1" old="$2" new="$3" output
  output="$(mktemp "$tmp_root/rewrite-block.XXXXXX")"
  if ! awk -v old="$old" -v new="$new" '
    BEGIN { RS = "\0" }
    {
      offset = index($0, old)
      if (!offset) exit 42
      print substr($0, 1, offset - 1) new substr($0, offset + length(old))
    }
  ' "$path" > "$output"; then
    find "$output" -depth -mindepth 0 -delete
    fail "semantic block mutation source is absent from $path: $old"
  fi
  mv "$output" "$path"
}

swap_literals_once() {
  local path="$1" first="$2" second="$3"
  local marker='GOBBI_SEMANTIC_SWAP_MARKER'
  grep -Fq -- "$marker" "$path" && fail "semantic swap marker already exists in $path"
  replace_literal_once "$path" "$first" "$marker"
  replace_literal_once "$path" "$second" "$first"
  replace_literal_once "$path" "$marker" "$second"
}

write_skill_file() {
  local root="$1" skill="$2" rel="$3" content="${4:-fixture}"
  mkdir -p "$(dirname "$root/.gobbi/projects/gobbi/skills/$skill/$rel")"
  printf '%s\n' "$content" > "$root/.gobbi/projects/gobbi/skills/$skill/$rel"
}

mirror_target() {
  local skill="$1" rel="$2"
  local slashes="${rel//[!\/]/}"
  local depth=$((3 + ${#slashes}))
  local prefix='' i
  for ((i = 0; i < depth; i++)); do
    prefix+='../'
  done
  printf '%s.gobbi/projects/gobbi/skills/%s/%s' "$prefix" "$skill" "$rel"
}

make_owned_mirror_link() {
  local root="$1" skill="$2" rel="$3"
  local path="$root/.claude/skills/$skill/$rel"
  mkdir -p "$(dirname "$path")"
  ln -s "$(mirror_target "$skill" "$rel")" "$path"
}

run_sync() {
  local root="$1"
  shift
  GOBBI_SYNC_REPO_ROOT="$root" bash "$sync_script" "$@"
}

snapshot_mirror() {
  local root="$1" output="$2"
  local mirror="$root/.claude/skills" entry rel raw digest inventory sorted_inventory

  : > "$output"
  if [[ -L "$mirror" ]]; then
    raw="$(readlink -n -- "$mirror" | od -An -tx1 | tr -d ' \n')"
    printf 'root-symlink\thex:%s\n' "$raw" >> "$output"
    return 0
  fi
  if [[ ! -e "$mirror" ]]; then
    printf 'root-missing\n' >> "$output"
    return 0
  fi
  if [[ ! -d "$mirror" ]]; then
    digest="$(sha256sum "$mirror" | awk '{print $1}')"
    printf 'root-file\t%s\n' "$digest" >> "$output"
    return 0
  fi

  inventory="$(mktemp "$tmp_root/snapshot-inventory.XXXXXX")"
  sorted_inventory="$(mktemp "$tmp_root/snapshot-sorted.XXXXXX")"
  find "$mirror" -mindepth 0 -print0 > "$inventory"
  LC_ALL=C sort -z "$inventory" > "$sorted_inventory"
  while IFS= read -r -d '' entry; do
    rel="${entry#"$mirror"}"
    rel="${rel#/}"
    [[ -n "$rel" ]] || rel='.'
    if [[ -L "$entry" ]]; then
      raw="$(readlink -n -- "$entry" | od -An -tx1 | tr -d ' \n')"
      printf 'l\t%s\thex:%s\n' "$rel" "$raw"
    elif [[ -d "$entry" ]]; then
      printf 'd\t%s\t-\n' "$rel"
    elif [[ -f "$entry" ]]; then
      digest="$(sha256sum "$entry" | awk '{print $1}')"
      printf 'f\t%s\t%s\n' "$rel" "$digest"
    else
      printf 'o\t%s\t%s\n' "$rel" "$(stat -c '%F' "$entry")"
    fi
  done < "$sorted_inventory" >> "$output"
}

assert_unsafe_zero_mutation() {
  local name="$1" root="$2" reason="$3"
  local before="$tmp_root/$name.before" after="$tmp_root/$name.after" log="$tmp_root/$name.log"

  snapshot_mirror "$root" "$before"
  if run_sync "$root" > "$log" 2>&1; then
    fail "$name unexpectedly succeeded"
  fi
  snapshot_mirror "$root" "$after"
  cmp -s "$before" "$after" || fail "$name mutated .claude/skills before rejecting the unsafe fixture"
  assert_file_contains "$log" '.claude/skills reconciliation aborted before mutation'
  assert_file_contains "$log" "$reason"
  pass "$name fails closed with an exact mirror snapshot"
}

prepare_synced_fixture() {
  local root="$1"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
}

prepare_semantic_fixture() {
  local root="$1"
  make_fixture "$root"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
}

assert_only_semantic_failure() {
  local log="$1" expected="$2" count
  grep -Fx -- "source topology: $expected" "$log" >/dev/null \
    || fail "missing exact semantic failure: $expected"
  count="$(grep -c '^source topology:' "$log")"
  [[ "$count" -eq 1 ]] \
    || fail "expected one semantic failure, got $count while checking: $expected"
}

expect_semantic_failure() {
  local name="$1" relative_path="$2" old="$3" new="$4" expected="$5"
  local root="$tmp_root/semantic-$name" log="$tmp_root/semantic-$name.log"
  prepare_semantic_fixture "$root"
  replace_literal_once "$root/$relative_path" "$old" "$new"
  if run_sync "$root" --check > "$log" 2>&1; then
    fail "$name semantic mutation unexpectedly succeeded"
  fi
  assert_only_semantic_failure "$log" "$expected"
  pass "$name rejects one changed semantic edge: $expected"
}

test_semantic_positive_recovery_and_reflow() {
  local root="$tmp_root/semantic-positive"
  prepare_semantic_fixture "$root"
  assert_file_contains "$root/.gobbi/projects/gobbi/skills/git/conventions.md" \
    'Recovery permanently accepts these legacy formats'
  assert_file_contains "$root/.gobbi/projects/gobbi/skills/git/conventions.md" \
    'New creation uses only the new formats'
  replace_block_once "$root/.gobbi/projects/gobbi/skills/cowork/SKILL.md" \
    $'Apply Gobbi\x27s [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate). A\n  correction' \
    $'Apply Gobbi\x27s [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate).\n  A correction'
  run_sync "$root" --check >/dev/null
  pass 'finding-m preserves semantic parity across equivalent paragraph reflow'
}

test_semantic_cowork_forbidden_wrapup_edge() {
  local root="$tmp_root/semantic-cowork-forbidden-wrapup" log="$tmp_root/semantic-cowork-forbidden-wrapup.log"
  local expected='Cowork must not link to the Workflow Wrap-up operation'
  prepare_semantic_fixture "$root"
  printf '\n[Forbidden owner](../wrap-up/SKILL.md)\n' \
    >> "$root/.gobbi/projects/gobbi/skills/cowork/SKILL.md"
  if run_sync "$root" --check > "$log" 2>&1; then
    fail 'Cowork forbidden Wrap-up edge unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$log" "$expected"
  pass "Cowork forbidden owner edge fails with one named diagnostic: $expected"
}

test_semantic_entry_order() {
  local root="$tmp_root/semantic-entry-order" log="$tmp_root/semantic-entry-order.log"
  local path='.gobbi/projects/gobbi/skills/gobbi/SKILL.md'
  local expected='lifecycle entry route must order mode, applicable slug, partner policy, then owner'
  prepare_semantic_fixture "$root"
  swap_literals_once "$root/$path" \
    'After recording fresh Cowork or Workflow' \
    'After the applicable slug is recorded'
  if run_sync "$root" --check > "$log" 2>&1; then
    fail 'entry-order semantic mutation unexpectedly succeeded'
  fi
  assert_only_semantic_failure "$log" "$expected"
  pass "entry-order rejects one reordered routing edge: $expected"
}

test_semantic_contract_failures() {
  local name path old new expected
  while IFS='^' read -r name path old new expected; do
    [[ -n "$name" ]] || continue
    expect_semantic_failure "$name" "$path" "$old" "$new" "$expected"
  done <<'SEMANTIC_CASES'
entry-general-slug^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^records `slug: not-applicable`^records `slug: omitted`^General entry must record slug: not-applicable
entry-general-identity^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^creates no Gobbi identity^creates one Gobbi identity^General entry must create no Gobbi identity
entry-general-policy^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^General consumes mode and policy without creating^General ignores mode and policy without creating^General owner must consume partner policy without creating session state
gobbi-root-candidates^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^reported path and its parent as the two possible `{gobbi-skills-root}` values^reported path as the only possible `{gobbi-skills-root}` value^Gobbi root resolution must retain both candidates
gobbi-root-sentinels^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^`agents/manager.md`. Each sentinel^`agents/leader.md`. Each sentinel^Gobbi root resolution must retain all three sentinels
gobbi-layout-session-wire^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^projects/*/sessions/^projects/*/session/^Gobbi layout must retain the exact ignore wire values
gobbi-cowork-owner-edge^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^[`../cowork/SKILL.md`](../cowork/SKILL.md)^[`../cowork/SKILL.md`](../workflow/SKILL.md)^Gobbi must hand Cowork to its canonical owner
gobbi-workflow-owner-edge^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^[`../workflow/SKILL.md`](../workflow/SKILL.md)^[`../workflow/SKILL.md`](../cowork/SKILL.md)^Gobbi must hand Workflow to its canonical owner
slug-privacy^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^warn that the session slug enters branch names and paths^state that the session slug enters branch names and paths^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-case-space-separator-unicode^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^maximal ASCII alphanumeric sequence as one word^maximal locale alphanumeric sequence as one word^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-no-transliteration^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Do not transliterate, truncate^Transliterate, then truncate^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-20-boundary^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Accept only 1–20 characters^Accept only 1–21 characters^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-empty-rejection^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^normalization is empty^normalization is blank^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-over-20-rejection^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^longer than 20 characters^longer than 21 characters^session slug must be privacy-warned, deterministically normalized, and strictly rejected
slug-reserved-rejection^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^or reserved^or platform-specific^session slug must be privacy-warned, deterministically normalized, and strictly rejected
naming-original-date^.gobbi/projects/gobbi/skills/git/conventions.md^never changes at a context boundary^may change at a context boundary^new session identity must preserve the original UTC date across context boundaries
naming-full-uuid^.gobbi/projects/gobbi/skills/git/conventions.md^full 36-character lowercase hyphenated^short lowercase^new session identity must retain the full UUID
finding-k-separate-derivation^.gobbi/projects/gobbi/skills/git/conventions.md^Derive the branch and leaf separately from the same tuple^Derive the leaf by stripping the branch prefix^new session names must use exact separately derived branch and leaf forms
naming-exact-branch^.gobbi/projects/gobbi/skills/git/conventions.md^branch: <runtime-prefix>-<YYYY-MM-DD>-<slug>-<gobbi-session-uuid>^branch: <YYYY-MM-DD>-<slug>-<gobbi-session-uuid>^new session names must use exact separately derived branch and leaf forms
naming-exact-leaf^.gobbi/projects/gobbi/skills/git/conventions.md^leaf:   <YYYY-MM-DD>-<slug>-<gobbi-session-uuid>^leaf:   <runtime-prefix>-<YYYY-MM-DD>-<slug>-<gobbi-session-uuid>^new session names must use exact separately derived branch and leaf forms
recovery-legacy-retention^.gobbi/projects/gobbi/skills/git/conventions.md^Recovery permanently accepts these legacy formats^Recovery temporarily accepts these legacy formats^new and legacy session formats must remain separately recoverable without migration
recovery-separate-parsers^.gobbi/projects/gobbi/skills/git/conventions.md^Parse new and legacy names with separate validators^Parse new and legacy names with one validator^new and legacy session formats must remain separately recoverable without migration
recovery-no-migration^.gobbi/projects/gobbi/skills/git/SKILL.md^silently migrate a legacy identity^silently migrate an old identity^Git recovery must never migrate a legacy identity
recovery-same-uuid-conflict^.gobbi/projects/gobbi/skills/git/conventions.md^Two different slugs, dates, runtimes, or paths carrying the same UUID are an identity conflict^Two different slugs, dates, runtimes, or paths carrying the same UUID are allowed^same-UUID competing session evidence must fail as an identity conflict
finding-d-recovery-evidence-first^.gobbi/projects/gobbi/skills/git/SKILL.md^take the retained branch or worktree from current caller, session, and registered-worktree^search all branches for a convenient worktree^recovery must use current evidence and ask only for unresolved facts
finding-c-cowork-uuid^.gobbi/projects/gobbi/skills/cowork/SKILL.md^For a fresh identity, generate one full lowercase hyphenated UUID^For a fresh identity, reuse one runtime identifier^Cowork must supply a fresh UUID and original UTC session identity
finding-l-workflow-configuration^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Write `configuration.md` with mode, identity shape, original UTC date^Write `configuration.md` with mode and branch only^Workflow Configuration must record complete identity evidence
workflow-default-cap^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Execution cap defaults to three total passes per task.^Execution cap defaults to two total passes per task.^Workflow must retain the default three-pass Execution cap
workflow-todo-wire^.gobbi/projects/gobbi/skills/workflow/SKILL.md^P2 · Execution · <unplanned|task-NN-slug> · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/<configured-max>^P2 · Execution · <task> · <stage>^Workflow must retain the exact native TODO title grammar
finding-l-memory-root^.gobbi/projects/gobbi/skills/memory/SKILL.md^original UTC session-start date, and exact session root^current date and inferred session root^Memory must validate caller identity against the exact session root
finding-f-partner-one-run^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^One **partner run** is one bounded^One **partner run** is an unbounded^Partner must own one external invocation while callers own local participants and assembly
finding-f-caller-assembly^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^The caller owns local participants, the complete subject, round assembly, policy, acceptance^Partner owns local participants, the complete subject, round assembly, policy, acceptance^Partner must own one external invocation while callers own local participants and assembly
finding-i-temp-captures^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^live in one private runtime-temporary directory outside every project and session root^live in the project session root^Partner captures must remain temporary, outside durable roots, and clean up on every outcome
finding-i-success-cleanup^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^before a successful return or after failure evidence is surfaced^after a successful return only^Partner captures must remain temporary, outside durable roots, and clean up on every outcome
finding-i-failure-cleanup^.gobbi/projects/gobbi/skills/gobbi/partner/SKILL.md^Retain captures only until the exact diagnostic is read and surfaced. Then remove the complete private^Retain captures after the exact diagnostic is read and surfaced. Keep the complete private^Partner failure handling must remove private captures after surfacing evidence
finding-e-cowork-enabled^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Enabled then calls^Enabled then skips^Cowork enabled creation must route through Partner
finding-e-cowork-disabled^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Disabled invokes no external runtime.^Disabled may invoke an external runtime.^Cowork disabled creation must remain local while the manager owns assembly
cowork-fresh-local-evaluator^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Dispatch one fresh isolated active-runtime evaluator.^Reuse the creation writer as evaluator.^Cowork evaluation must use fresh local and enabled external evaluators while preserving disabled behavior
cowork-enabled-external-evaluator^.gobbi/projects/gobbi/skills/cowork/SKILL.md^one fresh isolated external evaluator over the same frozen subject^one external reviewer over the same frozen subject^Cowork evaluation must use fresh local and enabled external evaluators while preserving disabled behavior
workflow-partner-consumption^.gobbi/projects/gobbi/skills/workflow/SKILL.md^MUST apply the recorded session-wide partner policy to every productive step.^MAY ignore the recorded session-wide partner policy for productive steps.^Workflow must consume the recorded partner policy
workflow-disabled-local-matrix^.gobbi/projects/gobbi/skills/workflow/SKILL.md^One assigned active-runtime self-reviewed draft; no external invocation.^Any active-runtime draft; external invocation optional.^Workflow disabled policy must select local-only participants
workflow-enabled-matrix^.gobbi/projects/gobbi/skills/workflow/SKILL.md^each applicable external draft and cross-review through Partner^optional external review without Partner^Workflow enabled policy must use Partner while retaining assembly ownership
finding-g-phase2-route^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^[Partner](../../gobbi/partner/SKILL.md); disabled invokes no external runtime.^an external reviewer directly; disabled may invoke an external runtime.^Workflow Phase 2 must consume the parent participant policy for task evaluation
finding-a-severity^.gobbi/projects/gobbi/agents/manager.md^severity is High, Medium, or Low;^severity is any value;^automatic finding correction requires High, Medium, or Low severity
finding-a-blocking^.gobbi/projects/gobbi/agents/manager.md^`blocking: no`;^`blocking: yes|no`;^automatic finding correction requires blocking: no
finding-a-contract^.gobbi/projects/gobbi/agents/manager.md^the correction stays inside the locked contract^the correction may exceed the locked contract^automatic finding correction must remain inside the locked contract
finding-a-reversible^.gobbi/projects/gobbi/agents/manager.md^it is reversible, authority-neutral,^it is irreversible, authority-neutral,^automatic finding correction must be reversible and authority-neutral
finding-a-authority-neutral^.gobbi/projects/gobbi/agents/manager.md^it is reversible, authority-neutral,^it is reversible, authority-expanding,^automatic finding correction must be reversible and authority-neutral
finding-a-nondestructive^.gobbi/projects/gobbi/agents/manager.md^non-destructive, and non-external.^destructive, and non-external.^automatic finding correction must be non-destructive and non-external
finding-a-nonexternal^.gobbi/projects/gobbi/agents/manager.md^non-destructive, and non-external.^non-destructive, and external.^automatic finding correction must be non-destructive and non-external
finding-a-user-boundary^.gobbi/projects/gobbi/agents/manager.md^Present every Critical,^Automatically apply every Critical,^every finding outside the automatic predicate must return to the user
finding-a-fresh-evaluation^.gobbi/projects/gobbi/agents/manager.md^Require a fresh evaluation after the correction.^Reuse prior evaluation after the correction.^every automatic correction must receive fresh evaluation
finding-a-pass-only^.gobbi/projects/gobbi/agents/manager.md^Only a verified PASS continues automatically.^PASS or REVISE continues automatically.^only a verified PASS may continue automatically
workflow-gobbi-owner-edge^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Gobbi's [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate)^Workflow's local finding gate^Workflow must consume the Gobbi finding gate through its canonical owner edge
gobbi-owner-inside-contract^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^it remains^it may not remain^Gobbi must own the complete session-wide finding predicate
gobbi-owner-user-boundary^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Send every other finding to the user for accept, reject, or defer disposition.^Correct every other finding automatically.^Gobbi finding gate must retain user disposition, fresh evaluation, and PASS-only continuation
gobbi-owner-fresh-evaluation^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^Every correction requires^Every correction skips^Gobbi finding gate must retain user disposition, fresh evaluation, and PASS-only continuation
gobbi-owner-pass-only^.gobbi/projects/gobbi/skills/gobbi/SKILL.md^only a verified PASS continues automatically.^PASS or REVISE continues automatically.^Gobbi finding gate must retain user disposition, fresh evaluation, and PASS-only continuation
cowork-gobbi-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Apply Gobbi's [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate).^Apply Workflow's [session-wide finding gate](../workflow/SKILL.md#14-apply-the-session-wide-finding-gate).^Cowork must consume the Gobbi finding gate through its canonical owner edge
cowork-git-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Git](../git/SKILL.md) | Owns identity and isolation validation^[Git](../git/SKILL.md) | Merely describes identity and isolation validation^Cowork must name Git as its mechanism owner
cowork-memory-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Memory](../memory/SKILL.md) | Owns session identity and containment validation^[Memory](../memory/SKILL.md) | Merely describes session identity and containment validation^Cowork must name Memory as its mechanism owner
cowork-delegation-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Delegation](../delegation/SKILL.md) | Owns the base specialist brief^[Delegation](../delegation/SKILL.md) | Merely describes the base specialist brief^Cowork must name Delegation as its mechanism owner
cowork-partner-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Partner](../gobbi/partner/SKILL.md) | Owns each enabled external invocation and frozen return^[Partner](../gobbi/partner/SKILL.md) | Merely describes each enabled external invocation and frozen return^Cowork must name Partner as its invocation owner
cowork-evaluation-owner-edge^.gobbi/projects/gobbi/skills/cowork/SKILL.md^[Evaluation](../evaluation/SKILL.md) | Owns each complete evaluator report^[Evaluation](../evaluation/SKILL.md) | Merely describes each complete evaluator report^Cowork must name Evaluation as its report owner
workflow-shared-cycle^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Each phase child invokes this cycle with a local role^Each phase child invents its own cycle with a local role^Workflow must own the shared productive-step contract
workflow-fast-gate^.gobbi/projects/gobbi/skills/workflow/SKILL.md^A fast gate applies to Ideation, Planning, and Wrap-up with two total iterations.^A fast gate applies only to Ideation with three total iterations.^Workflow must own the fast two-iteration gate
workflow-normal-gate^.gobbi/projects/gobbi/skills/workflow/SKILL.md^A normal gate applies to each Execution task with its configured cap.^A fast gate applies to each Execution task with two passes.^Workflow must own the normal aggregate gate and configured cap
workflow-gate-schema^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Each `gate.md` records mode, partner policy, required participants^Each `gate.md` records only mode and decision^Workflow must own the exact gate schema
workflow-record-schema^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Each `record/iteration-N.md` contains only exact TODO and decision^Each `record/iteration-N.md` contains a free-form summary^Workflow must own the exact RECORD receipt schema
phase1-parent-edge^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^The parent remains loaded^The parent may be unloaded^phase-1/SKILL.md must declare the parent precondition
phase1-shared-cycle^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^Invoke parent Step 1.3 with local role `leader`^Run a standalone cycle with local role `leader`^Workflow Phase 1 must consume the shared cycle as an Ideation adapter
phase1-gobbi-route^.gobbi/projects/gobbi/skills/workflow/phase-1/SKILL.md^Apply Gobbi's finding gate through the parent; only PASS continues.^Apply a local finding gate; REVISE continues.^phase-1/SKILL.md must consume the Gobbi finding gate through Workflow
phase2-parent-edge^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^The parent remains loaded^The parent may be unloaded^phase-2/SKILL.md must declare the parent precondition
phase2-shared-cycle^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^Invoke parent Step 1.3 with local role `leader`^Run a standalone cycle with local role `leader`^Workflow Phase 2 must consume the shared cycle as a Planning adapter
phase2-gobbi-route^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^Apply Gobbi's finding gate through the parent; only^Apply a local finding gate; REVISE may^phase-2/SKILL.md must consume the Gobbi finding gate through Workflow
phase3-parent-edge^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^The parent remains loaded^The parent may be unloaded^phase-3/SKILL.md must declare the parent precondition
phase3-parent-gate^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^Apply the parent fast gate and RECORD schema.^Apply a local gate and receipt schema.^Workflow Phase 3 must consume the parent gate and record contracts
phase2-replay-safety^.gobbi/projects/gobbi/skills/workflow/phase-2/SKILL.md^NEVER replay a possibly side-effecting operation until its prior effect is proved absent or safely^Replay a possibly side-effecting operation without checking whether its prior effect is safely^Workflow Phase 2 must retain side-effect replay safety
phase3-pre-git-boundary^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^MUST prohibit Git finalization before EVALUATION and RECORD accept the frozen pre-Git tree.^MAY finalize Git before the frozen closure is recorded.^Workflow Phase 3 must prohibit Git before the frozen closure passes RECORD
phase3-tree-invalidation^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^Require the current tracked tree to equal the evaluated^Allow the current tracked tree to differ from the evaluated^Workflow Phase 3 must invalidate PASS when the pre-Git tree changes
phase3-gobbi-route^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^Apply Gobbi's finding gate through the parent; only PASS^Apply a local finding gate; REVISE may^phase-3/SKILL.md must consume the Gobbi finding gate through Workflow
phase3-wrapup-owner^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^[Wrap-up](../../wrap-up/SKILL.md) owns Memory-to-Git order^[Wrap-up](../../wrap-up/SKILL.md) merely describes Memory-to-Git order^Workflow Phase 3 must name Wrap-up as the closure mechanism owner
phase3-handoff-owner^.gobbi/projects/gobbi/skills/workflow/phase-3/SKILL.md^[Wrap-up handoff](../../wrap-up/handoff.md) owns the tracked report and display-only Git receipt schemas.^Phase 3 owns the tracked report and display-only Git receipt schemas.^Workflow Phase 3 must name handoff.md as the terminal schema owner
finding-b-cowork-memory^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Apply [Memory](../memory/SKILL.md) directly^Apply [Memory](../memory/SKILL.md) indirectly^Cowork closure must apply Memory directly without Workflow closure state
finding-b-cowork-no-workflow-evidence^.gobbi/projects/gobbi/skills/cowork/SKILL.md^Never create Workflow-formatted TODOs^Always create Workflow-formatted TODOs^Cowork closure must forbid Workflow evidence
finding-b-cowork-conversation^.gobbi/projects/gobbi/skills/cowork/SKILL.md^returns a conversation-only handoff^returns a tracked handoff^Cowork closure must return only a conversation handoff
workflow-durable-wrapup^.gobbi/projects/gobbi/skills/workflow/SKILL.md^Wrap-up displays the immutable tracked handoff^Workflow returns a conversation-only summary^Workflow closure must retain durable Wrap-up and a tracked handoff
finding-h-assistant-mode^.gobbi/projects/gobbi/agents/assistant.md^**Cowork Memory mode** enters only from an explicit Cowork closure assignment^**Cowork Memory mode** enters without an assignment^assignment-authorized assistant must support Cowork direct-Memory closure only
finding-h-assistant-boundary^.gobbi/projects/gobbi/agents/assistant.md^Never load Wrap-up, create Workflow receipts or a tracked handoff^Load Wrap-up, create Workflow receipts and a tracked handoff^assignment-authorized assistant must support Cowork direct-Memory closure only
finding-h-git-writer^.gobbi/projects/gobbi/skills/git/SKILL.md^assignment-named writer role, including an assistant^manager role only^Git must authorize an assignment-named assistant writer
runtime-entry-order^.codex/AGENTS.md^After the mode, ask a^Before the mode, ask a^runtime entry documentation must preserve mode to slug to partner order
runtime-disabled-policy^.claude/CLAUDE.md^invokes no external runtime^may invoke an external runtime^runtime entry documentation must preserve disabled local-only behavior
SEMANTIC_CASES
}

test_semantic_permissions() {
  local permission label safe
  while IFS='^' read -r permission label; do
    [[ -n "$permission" ]] || continue
    safe="${permission//[^a-zA-Z0-9]/-}"
    expect_semantic_failure "finding-j-permission-$safe" '.claude/settings.json' \
      "\"$permission\"" "\"$permission-disabled\"" "$label"
  done <<'PERMISSION_CASES'
Skill(cowork)^Claude settings must explicitly allow Skill(cowork)
Skill(gobbi:partner)^Claude settings must explicitly allow Skill(gobbi:partner)
Skill(workflow:phase-1)^Claude settings must explicitly allow Skill(workflow:phase-1)
Skill(workflow:phase-2)^Claude settings must explicitly allow Skill(workflow:phase-2)
Skill(workflow:phase-3)^Claude settings must explicitly allow Skill(workflow:phase-3)
Agent(manager)^Claude settings must explicitly allow Agent(manager)
Agent(leader)^Claude settings must explicitly allow Agent(leader)
Agent(executor)^Claude settings must explicitly allow Agent(executor)
Agent(evaluator)^Claude settings must explicitly allow Agent(evaluator)
Agent(assistant)^Claude settings must explicitly allow Agent(assistant)
PERMISSION_CASES
}

test_safe_reconciliation() {
  local root="$tmp_root/safe" first="$tmp_root/safe.first" second="$tmp_root/safe.second"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  write_skill_file "$root" alpha workflow/current.md '# Current'
  write_skill_file "$root" beta SKILL.md '# Beta'

  make_owned_mirror_link "$root" alpha SKILL.md
  make_owned_mirror_link "$root" alpha removed.md
  make_owned_mirror_link "$root" alpha old/nested/removed.md
  make_owned_mirror_link "$root" retired SKILL.md
  make_owned_mirror_link "$root" retired deep/old.md
  ln -s '../../.gobbi/projects/gobbi/skills/retired' "$root/.agents/skills/retired"

  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  [[ -L "$root/.claude/skills/alpha/workflow/current.md" ]] || fail 'missing expected nested link was not created'
  [[ -L "$root/.claude/skills/beta/SKILL.md" ]] || fail 'missing expected skill mirror was not created'
  [[ ! -e "$root/.claude/skills/alpha/removed.md" && ! -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'dangling stale owned leaf survived'
  [[ ! -e "$root/.claude/skills/alpha/old" ]] || fail 'nested stale real directories survived'
  [[ ! -e "$root/.claude/skills/retired" ]] || fail 'whole stale skill directory survived'
  [[ ! -e "$root/.agents/skills/retired" && ! -L "$root/.agents/skills/retired" ]] || fail 'stale Codex discovery link survived'

  snapshot_mirror "$root" "$first"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$second"
  cmp -s "$first" "$second" || fail 'second safe sync was not idempotent'
  pass 'safe reconciliation prunes stale owned leaves and dirs, fills gaps, and is idempotent'
}

test_canonical_skill_deletion() {
  local root="$tmp_root/canonical-skill-deletion"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  write_skill_file "$root" record SKILL.md '# Record'

  run_sync "$root" >/dev/null
  run_sync "$root" --materialize-package >/dev/null
  [[ -L "$root/.agents/skills/record" ]] || fail 'precondition missing Codex record discovery link'
  [[ -L "$root/.claude/skills/record/SKILL.md" ]] || fail 'precondition missing Claude record discovery link'
  [[ -f "$root/plugins/gobbi/skills/record/SKILL.md" ]] || fail 'precondition missing generated record skill'

  find "$root/.gobbi/projects/gobbi/skills/record" -depth -mindepth 1 -delete
  rmdir "$root/.gobbi/projects/gobbi/skills/record"
  run_sync "$root" >/dev/null
  [[ ! -e "$root/.agents/skills/record" && ! -L "$root/.agents/skills/record" ]] \
    || fail 'canonical deletion left the Codex record discovery link'
  [[ ! -e "$root/.claude/skills/record" ]] || fail 'canonical deletion left the Claude record discovery tree'
  run_sync "$root" --materialize-package >/dev/null
  run_sync "$root" --check >/dev/null
  [[ ! -e "$root/plugins/gobbi/skills/record" ]] || fail 'materialization recreated deleted record content'
  [[ -f "$root/plugins/gobbi/skills/alpha/SKILL.md" ]] || fail 'materialization lost surviving nested skill content'
  pass 'canonical skill deletion prunes both runtime mirrors and generated package content'
}

test_unsafe_agents_entry() {
  local root="$tmp_root/unsafe-agents-entry" log="$tmp_root/unsafe-agents-entry.log"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  printf 'user data\n' > "$root/.agents/skills/user-owned"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'unsafe-agents-entry unexpectedly succeeded'
  fi
  assert_file_contains "$log" '.agents/skills/user-owned'
  assert_file_contains "$log" 'has no canonical skill and is not a generator-owned symlink'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'Claude mirror mutated before unsafe Codex discovery entry rejection'
  pass 'unsafe Codex discovery entries fail closed before mirror mutation'
}

test_unsafe_agents_wrong_target() {
  local root="$tmp_root/unsafe-agents-wrong-target" log="$tmp_root/unsafe-agents-wrong-target.log"
  local unsafe_link="$root/.agents/skills/user-owned-link"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  ln -s '../../user-owned-target' "$unsafe_link"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'unsafe-agents-wrong-target unexpectedly succeeded'
  fi
  assert_file_contains "$log" '.agents/skills/user-owned-link'
  assert_file_contains "$log" 'raw symlink target is ../../user-owned-target'
  [[ -L "$unsafe_link" ]] || fail 'wrong-target Codex discovery symlink was deleted'
  [[ "$(readlink -- "$unsafe_link")" == '../../user-owned-target' ]] || fail 'wrong-target Codex discovery symlink was changed'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'Claude mirror mutated before wrong-target Codex discovery rejection'
  pass 'wrong-target Codex discovery symlinks fail closed before mirror mutation'
}

test_unsafe_agents_trailing_newline_target() {
  local root="$tmp_root/unsafe-agents-trailing-newline" log="$tmp_root/unsafe-agents-trailing-newline.log"
  local unsafe_link="$root/.agents/skills/newline-wrong-target"
  local expected_target='../../.gobbi/projects/gobbi/skills/newline-wrong-target'
  local before_target="$tmp_root/unsafe-agents-trailing-newline.before"
  local after_target="$tmp_root/unsafe-agents-trailing-newline.after"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  ln -s "$expected_target"$'\n' "$unsafe_link"
  readlink -n -- "$unsafe_link" > "$before_target"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'unsafe-agents-trailing-newline unexpectedly succeeded'
  fi
  assert_file_contains "$log" '.agents/skills/newline-wrong-target'
  assert_file_contains "$log" 'raw symlink target is'
  [[ -L "$unsafe_link" ]] || fail 'trailing-newline Codex discovery symlink was deleted'
  readlink -n -- "$unsafe_link" > "$after_target"
  cmp -s "$before_target" "$after_target" || fail 'trailing-newline Codex discovery target bytes changed'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'Claude mirror mutated before trailing-newline Codex discovery rejection'
  pass 'trailing-newline Codex discovery targets fail closed byte-for-byte'
}

test_unsafe_agents_dot_entry() {
  local root="$tmp_root/unsafe-agents-dot-entry" log="$tmp_root/unsafe-agents-dot-entry.log"
  local unsafe_entry="$root/.agents/skills/.user-owned"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  printf 'user data\n' > "$unsafe_entry"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'unsafe-agents-dot-entry unexpectedly succeeded'
  fi
  assert_file_contains "$log" '.agents/skills/.user-owned'
  assert_file_contains "$log" 'path contains a dot-prefixed or traversal component'
  [[ -f "$unsafe_entry" ]] || fail 'hidden Codex discovery entry was deleted'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'Claude mirror mutated before hidden Codex discovery rejection'
  pass 'hidden Codex discovery entries fail closed before mirror mutation'
}

test_unsafe_regular_file() {
  local root="$tmp_root/unsafe-regular"
  prepare_synced_fixture "$root"
  printf 'user data\n' > "$root/.claude/skills/alpha/user.txt"
  assert_unsafe_zero_mutation unsafe-regular "$root" 'regular files are never generator-owned mirror leaves'
}

test_unsafe_wrong_target() {
  local root="$tmp_root/unsafe-wrong-target"
  prepare_synced_fixture "$root"
  ln -s '../../../.gobbi/projects/gobbi/skills/alpha/not-the-same.md' "$root/.claude/skills/alpha/wrong.md"
  assert_unsafe_zero_mutation unsafe-wrong-target "$root" 'raw symlink target is'
}

test_unsafe_claude_trailing_newline_target() {
  local root="$tmp_root/unsafe-claude-trailing-newline"
  local unsafe_link="$root/.claude/skills/alpha/newline.md"
  local expected_target
  prepare_synced_fixture "$root"
  expected_target="$(mirror_target alpha newline.md)"
  ln -s "$expected_target"$'\n' "$unsafe_link"
  assert_unsafe_zero_mutation unsafe-claude-trailing-newline "$root" 'raw symlink target is'
}

test_unsafe_directory_symlink() {
  local root="$tmp_root/unsafe-directory-symlink"
  prepare_synced_fixture "$root"
  mkdir -p "$root/outside-dir"
  ln -s '../../../outside-dir' "$root/.claude/skills/alpha/dir-link"
  assert_unsafe_zero_mutation unsafe-directory-symlink "$root" 'directory symlinks are forbidden'
}

test_unsafe_dot_entry() {
  local root="$tmp_root/unsafe-dot-entry"
  prepare_synced_fixture "$root"
  mkdir -p "$root/.claude/skills/alpha/.protected"
  printf 'hidden\n' > "$root/.claude/skills/alpha/.protected/data"
  assert_unsafe_zero_mutation unsafe-dot-entry "$root" 'path contains a dot-prefixed or traversal component'
}

test_unsafe_path_escape() {
  local root="$tmp_root/unsafe-path-escape"
  prepare_synced_fixture "$root"
  ln -s '../../../../outside-file' "$root/.claude/skills/alpha/escape.md"
  assert_unsafe_zero_mutation unsafe-path-escape "$root" 'symlink target escapes the generator-owned canonical root'
}

test_mixed_safe_and_unsafe() {
  local root="$tmp_root/mixed-safe-unsafe"
  prepare_synced_fixture "$root"
  make_owned_mirror_link "$root" alpha removed.md
  printf 'user data\n' > "$root/.claude/skills/alpha/user.txt"
  assert_unsafe_zero_mutation mixed-safe-unsafe "$root" 'regular files are never generator-owned mirror leaves'
  [[ -L "$root/.claude/skills/alpha/removed.md" ]] || fail 'safe stale leaf was removed despite a mixed unsafe preflight'
}

test_forward_and_back_rollback() {
  local root="$tmp_root/rollback" initial="$tmp_root/rollback.initial" restored="$tmp_root/rollback.restored"
  make_fixture "$root"
  write_skill_file "$root" delegation SKILL.md '# Delegation'
  write_skill_file "$root" delegation templates/shared.md '# Shared'
  write_skill_file "$root" orchestration SKILL.md '# Orchestration'
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$initial"

  mkdir -p "$root/.gobbi/projects/gobbi/skills/orchestration/templates"
  mv "$root/.gobbi/projects/gobbi/skills/delegation/templates/shared.md" \
    "$root/.gobbi/projects/gobbi/skills/orchestration/templates/shared.md"
  rmdir "$root/.gobbi/projects/gobbi/skills/delegation/templates"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  [[ ! -e "$root/.claude/skills/delegation/templates" ]] || fail 'forward owner move left the old mirror path'
  [[ -L "$root/.claude/skills/orchestration/templates/shared.md" ]] || fail 'forward owner move did not create the new mirror path'

  mkdir -p "$root/.gobbi/projects/gobbi/skills/delegation/templates"
  mv "$root/.gobbi/projects/gobbi/skills/orchestration/templates/shared.md" \
    "$root/.gobbi/projects/gobbi/skills/delegation/templates/shared.md"
  rmdir "$root/.gobbi/projects/gobbi/skills/orchestration/templates"
  run_sync "$root" >/dev/null
  run_sync "$root" --check >/dev/null
  snapshot_mirror "$root" "$restored"
  cmp -s "$initial" "$restored" || fail 'forward/back rollback did not restore the original derived mirror'
  pass 'forward and backward owner moves converge without hand-editing aliases'
}

build_scale_fixture() {
  local root="$1" count="$2" i
  make_fixture "$root"
  write_skill_file "$root" scale SKILL.md '# Scale'
  for ((i = 1; i <= count; i++)); do
    write_skill_file "$root" scale "nested/file-$i.md" "file $i"
  done
}

metric_value() {
  local path="$1" key="$2"
  awk -F= -v wanted="$key" '$1 == wanted { print $2 }' "$path"
}

test_bounded_walks() {
  local small_root="$tmp_root/scale-small" large_root="$tmp_root/scale-large"
  local small_metrics="$tmp_root/scale-small.metrics" large_metrics="$tmp_root/scale-large.metrics"
  local small_inspected large_inspected
  build_scale_fixture "$small_root" 40
  build_scale_fixture "$large_root" 80

  GOBBI_SYNC_REPO_ROOT="$small_root" GOBBI_SYNC_METRICS_FILE="$small_metrics" bash "$sync_script" >/dev/null
  GOBBI_SYNC_REPO_ROOT="$large_root" GOBBI_SYNC_METRICS_FILE="$large_metrics" bash "$sync_script" >/dev/null
  [[ "$(metric_value "$small_metrics" canonical_walks)" == 1 ]] || fail 'small fixture did not use one canonical full-tree walk'
  [[ "$(metric_value "$small_metrics" mirror_walks)" == 1 ]] || fail 'small fixture did not use one mirror full-tree walk'
  [[ "$(metric_value "$large_metrics" canonical_walks)" == 1 ]] || fail 'large fixture did not use one canonical full-tree walk'
  [[ "$(metric_value "$large_metrics" mirror_walks)" == 1 ]] || fail 'large fixture did not use one mirror full-tree walk'
  small_inspected="$(metric_value "$small_metrics" inspected_entries)"
  large_inspected="$(metric_value "$large_metrics" inspected_entries)"
  ((large_inspected > small_inspected)) || fail 'doubling the fixture did not increase inspected entries'
  ((large_inspected <= small_inspected * 2 + 4)) || fail 'doubling the fixture caused super-proportional inspection work'
  pass 'whole-tree walks stay constant and doubled input grows inspected entries proportionally'
}

test_hook_component_rejection() {
  local root="$tmp_root/hook-component" log="$tmp_root/hook-component.log"
  make_fixture "$root"
  write_skill_file "$root" alpha SKILL.md '# Alpha'
  mkdir -p "$root/.gobbi/projects/gobbi/hooks"
  printf '#!/usr/bin/env bash\n' > "$root/.gobbi/projects/gobbi/hooks/injected.sh"

  if run_sync "$root" > "$log" 2>&1; then
    fail 'normal sync accepted an injected canonical hook component'
  fi
  assert_file_contains "$log" '.gobbi/projects/gobbi/hooks contains a forbidden hook component'
  [[ ! -e "$root/plugins/gobbi/hooks" && ! -L "$root/plugins/gobbi/hooks" ]] || fail 'failed sync recreated plugins/gobbi/hooks'
  [[ ! -e "$root/.claude/hooks" ]] || fail 'failed sync recreated .claude/hooks'

  if run_sync "$root" --check > "$log" 2>&1; then
    fail 'sync --check accepted an injected canonical hook component'
  fi
  assert_file_contains "$log" '.gobbi/projects/gobbi/hooks contains a forbidden hook component'
  pass 'normal sync and --check reject injected hooks before mutation'
}

test_manifest_hook_rejection() {
  local root="$tmp_root/manifest-hook" manifest temp log="$tmp_root/manifest-hook.log"
  prepare_synced_fixture "$root"
  manifest="$root/plugins/gobbi/.codex-plugin/plugin.json"
  temp="$manifest.tmp"
  jq '.hooks = "./hooks/injected.json"' "$manifest" > "$temp"
  mv "$temp" "$manifest"

  if run_sync "$root" --check > "$log" 2>&1; then
    fail 'sync --check accepted a Codex hooks manifest field'
  fi
  assert_file_contains "$log" 'Codex manifest must declare only the canonical skills component and no hook or agent component'
  [[ ! -e "$root/plugins/gobbi/hooks" && ! -L "$root/plugins/gobbi/hooks" ]] || fail 'manifest rejection recreated plugins/gobbi/hooks'
  pass 'sync rejects a manifest-declared hook component'
}

test_marketplace_and_role_contracts() {
  local market_root="$tmp_root/wrong-marketplace" role_root="$tmp_root/missing-role" temp log

  make_fixture "$market_root"
  write_skill_file "$market_root" alpha SKILL.md '# Alpha'
  temp="$market_root/.agents/plugins/marketplace.json.tmp"
  jq '(.plugins[] | select(.name == "gobbi") | .source.path) = "./wrong"' \
    "$market_root/.agents/plugins/marketplace.json" > "$temp"
  mv "$temp" "$market_root/.agents/plugins/marketplace.json"
  log="$tmp_root/wrong-marketplace.log"
  if run_sync "$market_root" --check > "$log" 2>&1; then
    fail 'sync --check accepted the wrong Codex marketplace source path'
  fi
  assert_file_contains "$log" 'Codex marketplace must contain one local gobbi entry pointing at ./plugins/gobbi'

  make_fixture "$role_root"
  write_skill_file "$role_root" alpha SKILL.md '# Alpha'
  rm -f "$role_root/.codex/agents/evaluator.toml"
  log="$tmp_root/missing-role.log"
  if run_sync "$role_root" --check > "$log" 2>&1; then
    fail 'sync --check accepted a missing Codex evaluator wrapper'
  fi
  assert_file_contains "$log" '.codex/agents/evaluator.toml is not a symlink'
  pass 'sync source topology rejects marketplace and role-wrapper drift'
}

test_entry_mode_contract() {
  local codex_root="$tmp_root/missing-codex-mode" claude_root="$tmp_root/missing-claude-mode" log

  make_fixture "$codex_root"
  write_skill_file "$codex_root" alpha SKILL.md '# Alpha'
  printf '%s\n' 'General | Workflow' 'Configuration -> Ideation -> Planning -> Execution -> Wrap-up' \
    'DISCUSSION -> WORK -> EVALUATION -> RECORD' > "$codex_root/.codex/AGENTS.md"
  log="$tmp_root/missing-codex-mode.log"
  if run_sync "$codex_root" --check > "$log" 2>&1; then
    fail 'sync --check accepted a Codex entry without Cowork'
  fi
  assert_file_contains "$log" '.codex/AGENTS.md does not describe the General | Cowork | Workflow session-mode contract'

  make_fixture "$claude_root"
  write_skill_file "$claude_root" alpha SKILL.md '# Alpha'
  printf '%s\n' 'General | Workflow' 'Configuration -> Ideation -> Planning -> Execution -> Wrap-up' \
    'DISCUSSION -> WORK -> EVALUATION -> RECORD' > "$claude_root/.claude/CLAUDE.md"
  log="$tmp_root/missing-claude-mode.log"
  if run_sync "$claude_root" --check > "$log" 2>&1; then
    fail 'sync --check accepted a Claude entry without Cowork'
  fi
  assert_file_contains "$log" '.claude/CLAUDE.md does not describe the General | Cowork | Workflow session-mode contract'
  pass 'sync source topology rejects runtime entries that omit Cowork'
}

# Pin the two package-component shapes the installed-cache smoke distinguishes. That smoke fails
# a symlinked component root as an unmaterialized package, and fails a missing installed path
# under a real one as an incomplete generated copy. Each message names the shape it found, so
# both are wrong if sync ever stops producing exactly these two shapes. Assert them here rather
# than leave the smoke's messages resting on an untested assumption.
test_package_component_shapes() {
  local root="$tmp_root/package-shapes" component package_component
  prepare_synced_fixture "$root"

  for component in skills agents; do
    package_component="$root/plugins/gobbi/$component"
    [[ -L "$package_component" ]] \
      || fail "normal sync did not leave plugins/gobbi/$component a symlink"
  done
  run_sync "$root" --check >/dev/null

  run_sync "$root" --materialize-package >/dev/null
  for component in skills agents; do
    package_component="$root/plugins/gobbi/$component"
    [[ -d "$package_component" && ! -L "$package_component" ]] \
      || fail "generation did not leave plugins/gobbi/$component a real directory"
    [[ -z "$(find "$package_component" -type l -print -quit)" ]] \
      || fail "generated plugins/gobbi/$component still holds a symlink"
  done
  [[ -f "$root/plugins/gobbi/skills/alpha/SKILL.md" && ! -L "$root/plugins/gobbi/skills/alpha/SKILL.md" ]] \
    || fail 'generated skills component does not hold a real copy of its canonical file'
  run_sync "$root" --check >/dev/null

  pass 'package components are symlinks before generation and real files after it'
}

test_static_deletion_guards() {
  if grep -Eq 'rm[[:space:]]+-[^[:space:]]*r[^[:space:]]*f|rm[[:space:]]+-[^[:space:]]*f[^[:space:]]*r' "$sync_script"; then
    fail 'sync script contains recursive forced deletion'
  fi
  if grep -Eq 'find[[:space:]]+-L|find[^\n]*\.claude/skills[^\n]*[[:space:]]-L' "$sync_script"; then
    fail 'sync script follows directory symlinks during mirror traversal'
  fi
  pass 'sync source contains no recursive forced deletion or following mirror walk'
}

test_static_deletion_guards
test_package_component_shapes
test_safe_reconciliation
test_canonical_skill_deletion
test_unsafe_agents_entry
test_unsafe_agents_wrong_target
test_unsafe_agents_trailing_newline_target
test_unsafe_agents_dot_entry
test_unsafe_regular_file
test_unsafe_wrong_target
test_unsafe_claude_trailing_newline_target
test_unsafe_directory_symlink
test_unsafe_dot_entry
test_unsafe_path_escape
test_mixed_safe_and_unsafe
test_forward_and_back_rollback
test_bounded_walks
test_hook_component_rejection
test_manifest_hook_rejection
test_marketplace_and_role_contracts
test_entry_mode_contract
test_semantic_positive_recovery_and_reflow
test_semantic_cowork_forbidden_wrapup_edge
test_semantic_entry_order
test_semantic_contract_failures
test_semantic_permissions

printf 'PASS: %d sync reconciliation tests completed\n' "$tests_run"
