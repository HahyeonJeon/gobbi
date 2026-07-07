---
name: codex-delegation-prompt-contract
description: Plan for finalizing the Codex prompt-file child doc and direct parent routing.
type: plans
scope: feature
feature: workflow
status: active
created: 2026-07-02
session: 019f1f53-6ae2-7853-953e-4ee246cbef0b
tags: [planning]
keywords: [codex, delegation, prompt-file, bridge, execution]
author: codex
task: bounded-codex-bridge-orchestration-contract
supersedes: null
superseded_by: null
task_count: 3
---

# Codex Delegation Prompt Contract Plan

## Idea anchor

This plan implements the locked Ideation scope for `bounded-codex-bridge-orchestration-contract`:

- `1-ideation/outputs/scope-contract.md`
- `1-ideation/outputs/design-package.md`
- `1-ideation/working/research/bridge-orchestration-research-design.md`
- `2-preparation/outputs/preparation.md`

Project: `gobbi`

Feature: `workflow`

Task: `bounded-codex-bridge-orchestration-contract`

The plan covers only the Codex prompt-file child doc, direct Claude child-doc exposure, existing directory-symlink exposure checks, and narrow parent-doc routing. Existing source WIP is evidence only.

Iter3 repair note:

- Task 03 verification for `PM/skills/codex/SKILL.md` checks the sibling route text `delegation.md`; parent docs outside `skills/codex/` still check `codex/delegation.md`.
- The exact wrapper command-template research checklist line from `1-ideation/working/research/bridge-orchestration-research-design.md:251` is preserved verbatim in Task 01 trace material. The placeholder-like token in that inherited line is not a plan-owned placeholder.

## Sub-tasks

### 1. Author the canonical child doc

Owner type: `executor`

Depends on: none

Deliverable: create or replace `PM/skills/codex/delegation.md` as the canonical prompt-file contract child doc.

Exact traces:

- `- [ ] Create `.gobbi/projects/gobbi/skills/codex/delegation.md` as the owner of the Claude wrapper to Codex `codex exec` prompt-file contract. Anchor: I-1, I-4, I-7.`
- `- [ ] In `codex/delegation.md`, define scope and non-scope: bridge prompt-file contract only; no generic delegation, no full production/evaluation rewrite. Anchor: I-2, I-3, I-4.`
- `- [ ] Define a prompt-file lifecycle: choose path, write file, verify `test -s`, feed it via the official stdin form or explicitly verified `@file`, preserve it as audit evidence, and never mix heredoc creation with the Codex run. Anchor: I-5, E-1.`
- [ ] Define wrapper command templates for proposer and evaluator with `--cd <main-tree>`, minimal `--add-dir`, explicit sandbox, no model/effort unless user requested, and optional `--json`/`--output-last-message` capture where useful. Anchor: I-1, I-6, E-2, E-3.
- `- The contract uses `--cd`, minimal `--add-dir`, least sandbox, optional `--json`, and optional `--output-last-message` where the output contract fits.`
- `- The contract states that `workspace-write` with `--cd` at a source root does not make the source root read-only.`
- `- [ ] Define foreground/background selection: foreground only when the host will allow the budget; background for long Claude Code jobs, with PID capture, no `pkill -f`, deterministic EOF for stdin, and file validation. Anchor: I-5.`
- `- [ ] Define proposer prompt anatomy: role, scope, absolute output path, source-read-only rule, no canonical draft writes, `PROPOSAL:` header requirement, no source mutation, and final status expectations. Anchor: I-2, I-6.`
- `- [ ] Define evaluator prompt anatomy: role, target canonical artifact, Scope Contract, no proposal body/framing, exactly 8 output files, verdict lines, required sections, and clean-PASS semantics. Anchor: I-3, I-4, I-5.`
- `- [ ] Define verification gates: prompt-file gate, command construction gate, output-file structural gate, wrong-root gate, source-diff gate for proposers, and evaluator independence gate. Anchor: I-3, I-5, I-6.`
- `- [ ] Define failure semantics as a table by job type: timeout, empty, malformed, missing prompt, missing output, wrong root, source write, wrapper self-authoring, process exit unknown. Anchor: I-2, I-3, I-5, I-6.`

Verification contract:

```bash
set -euo pipefail
WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/codex-2026-07-01-019f1f53-6ae2-7853-953e-4ee246cbef0b
PM="$WT/.gobbi/projects/gobbi"
doc="$PM/skills/codex/delegation.md"
test -s "$doc"
rg -F -q -- 'codex exec ... - < "$prompt_file"' "$doc"
rg -F -q -- '- < "$prompt_file"' "$doc"
rg -F -x -q '## Prompt-file lifecycle' "$doc"
rg -F -x -q '## Prompt file sections' "$doc"
rg -F -x -q '## Proposer prompt contract' "$doc"
rg -F -x -q '## Evaluator prompt contract' "$doc"
rg -F -x -q '## Wrapper verification gates' "$doc"
rg -F -x -q '## Parent-doc routing' "$doc"
set +e
rg -n '"@[^"]*proposer-prompt\.md"|codex exec.*"@|finding-vocab.*REQUIRED|scenario_gap\|checklist_gap.*must' "$doc"
stale_status=$?
set -e
if [ "$stale_status" -eq 0 ]; then
  printf '%s\n' "stale or blocking bridge recipe pattern found in $doc"
  exit 1
fi
if [ "$stale_status" -ne 1 ]; then
  exit "$stale_status"
fi
bash "$PM/skills/orchestration/scripts/check-markdown-links.sh" "$doc"
```

### 2. Expose the child doc through mirrors

Owner type: `executor`

Depends on: `01-author-codex-bridge-contract`

Deliverable: create or verify `WT/.claude/skills/codex/delegation.md` and verify existing `.agents` and plugin directory-symlink exposure.

Exact traces:

- `- [ ] Verify mirror exposure: create a `.claude/skills/codex/delegation.md` per-file symlink if direct Claude skill mirror access is required; do not edit `.agents/skills` or plugin symlinks by hand. Anchor: I-7.`
- `- Create or otherwise provide a concrete direct exposure path for `.claude/skills/codex/delegation.md`. The expected implementation is a per-file symlink to the canonical child doc.`
- `- `.agents/skills/codex` and `plugins/gobbi/skills` continue to expose the canonical child doc through existing directory symlinks.`

Verification contract:

```bash
set -euo pipefail
WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/codex-2026-07-01-019f1f53-6ae2-7853-953e-4ee246cbef0b
PM="$WT/.gobbi/projects/gobbi"
canonical="$PM/skills/codex/delegation.md"
test -s "$canonical"
test "$(readlink -e "$WT/.claude/skills/codex/delegation.md")" = "$canonical"
test "$(readlink -e "$WT/.agents/skills/codex/delegation.md")" = "$canonical"
test "$(readlink -e "$WT/plugins/gobbi/skills/codex/delegation.md")" = "$canonical"
test -n "$(find -L "$WT/.agents/skills/codex" -maxdepth 1 -name delegation.md -print)"
test -n "$(find -L "$WT/plugins/gobbi/skills/codex" -maxdepth 1 -name delegation.md -print)"
bash "$WT/scripts/sync-plugin-package.sh" --check
protected_status="$(git -C "$WT" status --short -- .agents/skills/codex plugins/gobbi/skills plugins/gobbi/.codex-plugin/plugin.json plugins/gobbi/.claude-plugin/plugin.json .codex)"
if [ -n "$protected_status" ]; then
  printf '%s\n' "protected path drift detected:"
  printf '%s\n' "$protected_status"
  exit 1
fi
```

### 3. Align parent routing docs

Owner type: `executor`

Depends on: `01-author-codex-bridge-contract`, `02-expose-claude-child-doc`

Deliverable: align `codex/SKILL.md`, `delegation/SKILL.md`, `workflow/production.md`, and `workflow/evaluation.md` so direct parent docs route wrapper mechanics to `codex/delegation.md`.

Exact traces:

- `- [ ] Update `codex/SKILL.md` to route detailed bridge invocation, prompt lifecycle, wrapper contracts, and failure semantics to `codex/delegation.md`, leaving runtime matrix, native Codex, metadata, plugin packaging, and high-level bridge intro in place. Anchor: I-1.`
- `- [ ] Update `workflow/production.md` only where it currently repeats CLI mechanics; keep orchestration semantics local and link to `codex/delegation.md` for wrapper mechanics. Anchor: I-2.`
- `- [ ] Update `workflow/evaluation.md` only where it depends on Codex wrapper output validation; keep dual-system evaluation and degraded-mode safety gates local. Anchor: I-3.`
- `- [ ] Update `delegation/SKILL.md` only for routing from Producer Dispatch or anti-patterns to `codex/delegation.md`; do not move generic Load Directives or role-template rules. Anchor: I-4.`
- `- [ ] Run documentation verification after implementation: markdown link guard on changed docs, `bash scripts/sync-plugin-package.sh --check`, `readlink -e .claude/skills/codex/delegation.md` if added, and `rg` checks for stale duplicated bridge recipes. Anchor: I-7.`

Verification contract:

```bash
set -euo pipefail
WT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/codex-2026-07-01-019f1f53-6ae2-7853-953e-4ee246cbef0b
PM="$WT/.gobbi/projects/gobbi"
child="$PM/skills/codex/delegation.md"
docs=(
  "$PM/skills/codex/SKILL.md"
  "$PM/skills/codex/delegation.md"
  "$PM/skills/delegation/SKILL.md"
  "$PM/skills/orchestration/workflow/production.md"
  "$PM/skills/orchestration/workflow/evaluation.md"
)
codex_parent_docs=(
  "$PM/skills/delegation/SKILL.md"
  "$PM/skills/orchestration/workflow/production.md"
  "$PM/skills/orchestration/workflow/evaluation.md"
)
test -s "$child"
for doc in "${docs[@]}"; do test -s "$doc"; done
rg -F -q -- 'delegation.md' "$PM/skills/codex/SKILL.md"
for doc in "${codex_parent_docs[@]}"; do
  rg -F -q -- 'codex/delegation.md' "$doc"
done
rg -F -q -- 'codex exec ... - < "$prompt_file"' "$PM/skills/codex/SKILL.md" "$child" "$PM/skills/orchestration/workflow/production.md" "$PM/skills/orchestration/workflow/evaluation.md"
set +e
rg -n '"@[^"]*proposer-prompt\.md"|codex exec.*"@|finding-vocab.*REQUIRED|scenario_gap\|checklist_gap.*must' "${docs[@]}"
stale_status=$?
set -e
if [ "$stale_status" -eq 0 ]; then
  printf '%s\n' "stale or blocking bridge recipe pattern found in changed docs"
  exit 1
fi
if [ "$stale_status" -ne 1 ]; then
  exit "$stale_status"
fi
bash "$PM/skills/orchestration/scripts/check-markdown-links.sh" "${docs[@]}"
bash "$WT/scripts/sync-plugin-package.sh" --check
test "$(readlink -e "$WT/.claude/skills/codex/delegation.md")" = "$child"
test "$(readlink -e "$WT/.agents/skills/codex/delegation.md")" = "$child"
test "$(readlink -e "$WT/plugins/gobbi/skills/codex/delegation.md")" = "$child"
protected_status="$(git -C "$WT" status --short -- plugins/gobbi/.codex-plugin/plugin.json plugins/gobbi/.claude-plugin/plugin.json .agents/skills/codex plugins/gobbi/skills .codex)"
if [ -n "$protected_status" ]; then
  printf '%s\n' "protected path drift detected:"
  printf '%s\n' "$protected_status"
  exit 1
fi
```

## Dependency graph

Execution is strictly sequential:

1. `01-author-codex-bridge-contract`
2. `02-expose-claude-child-doc`
3. `03-align-parent-routing-docs`

Task 03 depends on Task 02 because Task 03 verifies Task 02-owned mirror output.

## Verification strategy summary

Execution verifies the plan with these fail-closed checks:

- Direct content checks use `test -s`, `rg -F -q`, and required heading checks.
- Absence checks use explicit `rg` status handling: status `0` fails, status `1` passes, every other status fails.
- Link and packaging checks run markdown link guard on changed docs and `bash scripts/sync-plugin-package.sh --check`.
- Symlink checks use `readlink -e` and `find -L` against `.claude`, `.agents`, and plugin paths.
- Protected status checks capture `git -C "$WT" status --short -- ...` output into `protected_status` and fail if it is non-empty.
- Semantic stale-recipe review remains an executor acceptance step; it must not be replaced by broad body-wide token absence checks.
- Placeholder review is exact-line aware: the inherited research line 251 trace is the only allowed angle-token occurrence, and every other angle-placeholder token fails self-review.

## Open issues

None.

If Execution finds that the locked scope must expand to `gobbi/SKILL.md`, plugin manifests, settings, runtime code, or agent roster changes, it must stop and return `NEEDS_CONTEXT` instead of expanding the plan.

## Related

- [[source-edits-before-preparation-planning]] - staged process mistake-candidate that this plan passes forward.
