---
name: deterministic-codex-model-policy
description: "Execute the locked 19-file deterministic Codex model and effort policy in three sequential units."
type: plans
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [planning, codex, verification]
keywords: [gpt-5.6-sol, xhigh, bridge, agents, validator]
author: codex
related: [deterministic-codex-policy-authorities, claude-to-codex-bridge-contract, validator-and-residual-guard-design, plugin-delivery-and-alias-topology, rollback-and-risk-boundaries]
task: "Enforce one deterministic Codex model and reasoning-effort policy across all live native, bridge, validation, and plugin-delivery surfaces."
task_count: 3
---

# Deterministic Codex Model Policy

## Idea anchor

This plan implements the `Design` section of session artifact `.gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/1-ideation/outputs/ideation-briefing-iter2.md`, together with the five related Ideation design records named in frontmatter.

## Scope Contract reference

Authority: the `Scope Contract`, `Locked 19-file change matrix`, and `Verification matrix` sections of session artifact `.gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/1-ideation/outputs/ideation-briefing-iter2.md`. The `Verification matrix` is authoritative. Every repeated gate below is a frozen Planning snapshot.

- **Project:** `gobbi`
- **Feature:** `workflow`
- **Task:** Enforce one deterministic Codex model and reasoning-effort policy across all live native, bridge, validation, and plugin-delivery surfaces.

Preparation re-confirmed that all 19 targets are present, tracked, and inside this worktree in the `Design + memory readiness` section of session artifact `.gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/2-preparation/outputs/readiness-handoff-iter1.md`. There is no external write surface. Execution must refresh this premise before the first source edit and stop if it no longer holds.

## File map

| # | Canonical file | Responsibility in this plan | Task |
|---:|---|---|---|
| 1 | `.codex/config.toml` | Repository Codex model and effort defaults. | 01 |
| 2 | `.gobbi/projects/gobbi/agents/manager.toml` | Manager native model and effort. | 01 |
| 3 | `.gobbi/projects/gobbi/agents/leader.toml` | Leader native model and effort. | 01 |
| 4 | `.gobbi/projects/gobbi/agents/executor.toml` | Executor native model and effort. | 01 |
| 5 | `.gobbi/projects/gobbi/agents/evaluator.toml` | Evaluator native model and effort while retaining read-only sandbox. | 01 |
| 6 | `.gobbi/projects/gobbi/agents/assistant.toml` | Assistant native model and effort. | 01 |
| 7 | `.gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json` | Five scalar Auto-mode Codex model selections. | 01 |
| 8 | `.gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json` | Five scalar Chat-mode Codex model selections. | 01 |
| 9 | `.gobbi/projects/gobbi/skills/agent-writing/SKILL.md` | Wrapper schema, sample, and all-role effort guidance. | 02 |
| 10 | `.gobbi/projects/gobbi/skills/codex/SKILL.md` | Runtime model/effort policy and five current bridge command blocks. | 02 |
| 11 | `.gobbi/projects/gobbi/skills/codex/delegation.md` | Exact prompt-file invocation contract, four command blocks, and gates. | 02 |
| 12 | `.gobbi/projects/gobbi/skills/delegation/SKILL.md` | Codex policy summary, five-role table, and roster efforts. | 02 |
| 13 | `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | Role taxonomy efforts and native Codex convention. | 02 |
| 14 | `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md` | Evaluation-owned selection/spawn policy and one typed bridge-owner pointer. | 02 |
| 15 | `.gobbi/projects/gobbi/skills/git/conventions.md` | Wrapper wording aligned with pinned role defaults while preserving git ownership. | 02 |
| 16 | `scripts/check-codex-compatibility.sh` | Positive exact-policy checks, command coverage, pointer checks, and classified residuals. | 02 |
| 17 | `plugins/gobbi/.codex-plugin/plugin.json` | Codex plugin package version `0.5.2`. | 03 |
| 18 | `plugins/gobbi/.claude-plugin/plugin.json` | Claude plugin package version `0.5.2`. | 03 |
| 19 | `.claude-plugin/marketplace.json` | Advertised marketplace version `0.5.2`. | 03 |

All operations are `modify`. Create and delete no tracked source file. Paths under `.codex/agents`, `.agents/skills`, `.claude/skills`, and `plugins/gobbi/{skills,agents,hooks}` are alias verification surfaces, not edit targets.

## Sub-tasks

### 01 - Native defaults and settings

```yaml
id: 01-native-defaults-and-settings
what: Pin the repository default, all five canonical Codex role wrappers, and both workflow settings templates to the locked model and effort policy while preserving their existing security and data shapes.
traces-to:
  - 'Add `model = "gpt-5.6-sol"` beside the existing `xhigh` repository effort without changing runtime security posture. [I-01, E-01, E-04]'
  - 'Add the same model to all five canonical TOMLs and set every wrapper effort to `xhigh`; preserve evaluator `sandbox_mode = "read-only"`. [I-01, E-03]'
  - 'Replace ten template `null` values with the model string; preserve Claude values and scalar JSON shape. [I-01, E-01]'
  - 'Verify aliases with `realpath`, dereferenced inode, and tracked symlink-mode checks; do not separately edit mirrors. [I-04]'
  - 'Re-run the four resolved-premise checks during Execution before relying on them. [I-08]'
requires: []
files:
  - {path: ".codex/config.toml", op: modify}
  - {path: ".gobbi/projects/gobbi/agents/manager.toml", op: modify}
  - {path: ".gobbi/projects/gobbi/agents/leader.toml", op: modify}
  - {path: ".gobbi/projects/gobbi/agents/executor.toml", op: modify}
  - {path: ".gobbi/projects/gobbi/agents/evaluator.toml", op: modify}
  - {path: ".gobbi/projects/gobbi/agents/assistant.toml", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json", op: modify}
inputs:
  - .gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/1-ideation/outputs/ideation-briefing-iter2.md#resolved-premises-retained-as-execution-gates
  - .gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/1-ideation/outputs/ideation-briefing-iter2.md#locked-19-file-change-matrix
  - .gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/2-preparation/outputs/readiness-handoff-iter1.md#design--memory-readiness
outputs:
  - native-defaults-and-settings-state
verifies: |
  set -euo pipefail
  repo_root="$(git rev-parse --show-toplevel)"
  cd "$repo_root"
  git show-ref --verify --quiet refs/heads/develop
  base="$(git merge-base HEAD develop)"
  test -n "$base"
  git ls-files --error-unmatch -- .codex/config.toml >/dev/null

  codex --version
  codex_help="$(codex exec --help)"
  printf '%s\n' "$codex_help" | rg -q -- '(^|[[:space:],])-m([[:space:],]|$)|--model'
  printf '%s\n' "$codex_help" | rg -q -- '(^|[[:space:],])-c([[:space:],]|$)|--config'
  if printf '%s\n' "$codex_help" | rg -q -- '(^|[[:space:],])--effort([[:space:],]|$)'; then
    printf '%s\n' 'unexpected standalone --effort option' >&2
    exit 1
  fi

  for settings in \
    .gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json \
    .gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json
  do
    jq empty "$settings"
    jq -e '
      (.models.codex | type == "object") and
      ((.models.codex | keys | sort) ==
        (["assistant","evaluator","executor","leader","manager"] | sort)) and
      ([.models.codex[] | select(
        type != "string" or . != "gpt-5.6-sol"
      )] | length == 0) and
      ([paths | map(tostring) | join(".") | select(test("effort"; "i"))] |
        length == 0)
    ' "$settings" >/dev/null
  done

  BASE="$base" python3 -c '
  import copy
  import json
  import os
  import subprocess
  import tomllib
  from pathlib import Path

  base = os.environ["BASE"]

  def base_bytes(path):
      return subprocess.check_output(["git", "show", f"{base}:{path}"])

  config_path = ".codex/config.toml"
  current_config = tomllib.loads(Path(config_path).read_text())
  base_config = tomllib.loads(base_bytes(config_path).decode())
  assert current_config["model"] == "gpt-5.6-sol"
  assert current_config["model_reasoning_effort"] == "xhigh"
  assert current_config["plan_mode_reasoning_effort"] == "xhigh"
  assert current_config["sandbox_mode"] == "workspace-write"
  assert current_config["approval_policy"] == "on-request"
  assert current_config["sandbox_workspace_write"]["network_access"] is True
  config_without_model = copy.deepcopy(current_config)
  config_without_model.pop("model")
  assert config_without_model == base_config

  roles = ["manager", "leader", "executor", "evaluator", "assistant"]
  for role in roles:
      path = f".gobbi/projects/gobbi/agents/{role}.toml"
      current = tomllib.loads(Path(path).read_text())
      previous = tomllib.loads(base_bytes(path).decode())
      assert current["model"] == "gpt-5.6-sol", role
      assert current["model_reasoning_effort"] == "xhigh", role
      if role == "evaluator":
          assert current["sandbox_mode"] == "read-only"
      current_rest = copy.deepcopy(current)
      previous_rest = copy.deepcopy(previous)
      current_rest.pop("model")
      current_rest.pop("model_reasoning_effort")
      previous_rest.pop("model_reasoning_effort")
      assert current_rest == previous_rest, role

  settings_paths = [
      ".gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json",
      ".gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json",
  ]
  expected_roles = set(roles)
  for path in settings_paths:
      current = json.loads(Path(path).read_text())
      previous = json.loads(base_bytes(path))
      assert set(current["models"]["codex"]) == expected_roles
      assert all(
          value == "gpt-5.6-sol" and isinstance(value, str)
          for value in current["models"]["codex"].values()
      )
      current_rest = copy.deepcopy(current)
      current_rest["models"]["codex"] = previous["models"]["codex"]
      assert current_rest == previous, path
  '

  if rg -n --follow --glob '!*.md' --glob '!sessions/**' \
    'models[^[:space:]]*codex[^[:space:]]*effort|effort[^[:space:]]*models[^[:space:]]*codex' \
    .gobbi/projects/gobbi/skills/orchestration
  then
    printf '%s\n' 'unexpected workflow settings effort consumer' >&2
    exit 1
  fi

  for role in manager leader executor evaluator assistant
  do
    alias_path=".codex/agents/$role.toml"
    canonical=".gobbi/projects/gobbi/agents/$role.toml"
    test -L "$alias_path"
    test "$(readlink "$alias_path")" = "../../.gobbi/projects/gobbi/agents/$role.toml"
    test "$(realpath "$alias_path")" = "$(realpath "$canonical")"
    test "$(stat -Lc '%d:%i' "$alias_path")" = "$(stat -Lc '%d:%i' "$canonical")"
    test "$(git ls-files -s -- "$alias_path" | awk '{print $1}')" = "120000"
  done
```

### 02 - Policy documents and validator

```yaml
id: 02-policy-docs-and-validator
what: Align every active Codex policy and bridge owner, the evaluation pointer, wrapper wording, and the compatibility validator as one coherent current-policy unit, including implementing `scripts/check-codex-compatibility.sh --self-test` as a five-negative-fixture interface named `wrong-model`, `wrong-effort`, `wrong-template-leaf`, `incomplete-bridge-command`, and `wrong-pointer`.
traces-to:
  - 'Apply the per-site inventory below to all six current policy/bridge docs; do not rely on a file-level summary. [I-02, I-03]'
  - 'Update `git/conventions.md` wrapper wording without changing git posture ownership or behavior. [I-06]'
  - 'Establish the bridge owner split, add one typed pointer in workflow evaluation, and run the pointer guard self-test plus live check. [I-07]'
  - 'Replace validator inheritance and mixed-effort assertions with positive checks for all roles, both templates, bridge command forms, policy owners, pointer shape, and live residuals. [I-03]'
requires: [01-native-defaults-and-settings]
files:
  - {path: ".gobbi/projects/gobbi/skills/agent-writing/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/codex/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/codex/delegation.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/delegation/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/gobbi/SKILL.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md", op: modify}
  - {path: ".gobbi/projects/gobbi/skills/git/conventions.md", op: modify}
  - {path: "scripts/check-codex-compatibility.sh", op: modify}
inputs:
  - native-defaults-and-settings-state
  - .gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/1-ideation/outputs/ideation-briefing-iter2.md#form-covering-per-site-edit-inventory
  - .gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/1-ideation/outputs/ideation-briefing-iter2.md#validator-assertion-family-inventory
  - .gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/2-preparation/outputs/readiness-handoff-iter1.md#design--memory-readiness
outputs:
  - current-policy-and-validator-state
  - compatibility-self-test-interface
verifies: |
  set -euo pipefail
  repo_root="$(git rev-parse --show-toplevel)"
  cd "$repo_root"

  bash -n scripts/check-codex-compatibility.sh
  self_test_output="$(bash scripts/check-codex-compatibility.sh --self-test)"
  printf '%s\n' "$self_test_output"
  for fixture in \
    wrong-model \
    wrong-effort \
    wrong-template-leaf \
    incomplete-bridge-command \
    wrong-pointer
  do
    marker="PASS self-test: $fixture"
    marker_count="$(printf '%s\n' "$self_test_output" | awk -v marker="$marker" '$0 == marker { count++ } END { print count + 0 }')"
    test "$marker_count" -eq 1
  done
  summary_count="$(printf '%s\n' "$self_test_output" | awk '$0 == "PASS self-test: 5/5 fixtures rejected" { count++ } END { print count + 0 }')"
  test "$summary_count" -eq 1
  bash scripts/check-codex-compatibility.sh
  bash -n .gobbi/projects/gobbi/skills/orchestration/scripts/check-workflow-pointer-drift.sh
  bash .gobbi/projects/gobbi/skills/orchestration/scripts/check-workflow-pointer-drift.sh --self-test
  bash .gobbi/projects/gobbi/skills/orchestration/scripts/check-workflow-pointer-drift.sh

  python3 -c '
  import re
  from pathlib import Path

  fence = chr(96) * 3
  pair = "-m gpt-5.6-sol -c '\''model_reasoning_effort=\"xhigh\"'\''"
  command_owners = {
      ".gobbi/projects/gobbi/skills/codex/SKILL.md": 5,
      ".gobbi/projects/gobbi/skills/codex/delegation.md": 4,
  }
  for path, expected_count in command_owners.items():
      text = Path(path).read_text()
      bash_blocks = re.findall(
          re.escape(fence) + r"bash\n(.*?)" + re.escape(fence),
          text,
          re.S,
      )
      commands = [
          block for block in bash_blocks if re.search(r"\bcodex exec\b", block)
      ]
      assert len(commands) == expected_count, (path, len(commands))
      for command in commands:
          normalized = re.sub(r"\\\s*\n\s*", " ", command)
          normalized = " ".join(normalized.split())
          assert pair in normalized, (path, normalized)

  workflow_path = (
      ".gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md"
  )
  workflow = Path(workflow_path).read_text()
  assert workflow.count("**Codex bridge owners:**") == 1
  fenced = re.findall(
      re.escape(fence) + r"[^\n]*\n(.*?)" + re.escape(fence),
      workflow,
      re.S,
  )
  forbidden = ("codex exec", "-m gpt-5.6-sol", "model_reasoning_effort")
  assert all(not any(token in block for token in forbidden) for block in fenced)
  assert "-m gpt-5.6-sol" not in workflow
  assert "model_reasoning_effort=\"xhigh\"" not in workflow
  '
```

**Task 02 trace authority:** The verbatim "inventory below" trace resolves to `.gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/1-ideation/outputs/ideation-briefing-iter2.md#form-covering-per-site-edit-inventory` in Task 02 inputs. The plan does not restate that owner content.

### 03 - Release metadata and integration gates

```yaml
id: 03-release-metadata-and-integration-gates
what: Synchronize the three release-version surfaces and prove the complete 19-file policy unit through the locked integration and scope gates.
traces-to:
  - 'Bump both plugin manifests and the Claude marketplace from `0.5.1` to `0.5.2`. [I-05]'
  - 'Run JSON, shell, compatibility, pointer, plugin sync, plugin smoke, Claude plugin, publish-readiness, and scoped residual checks. [I-03, I-04, I-05, I-07]'
  - 'Confirm the final tracked source diff has exactly 19 modifications, zero creates/deletes, and no historical paths. [I-03, I-04, I-06]'
requires: [02-policy-docs-and-validator]
files:
  - {path: "plugins/gobbi/.codex-plugin/plugin.json", op: modify}
  - {path: "plugins/gobbi/.claude-plugin/plugin.json", op: modify}
  - {path: ".claude-plugin/marketplace.json", op: modify}
inputs:
  - native-defaults-and-settings-state
  - current-policy-and-validator-state
  - compatibility-self-test-interface
  - .gobbi/projects/gobbi/sessions/2026-07-10-019f4a1e-8898-7e51-845b-ec289f1400c7/1-ideation/outputs/ideation-briefing-iter2.md#verification-matrix
outputs:
  - verified-19-file-release-candidate
verifies: |
  set -euo pipefail
  repo_root="$(git rev-parse --show-toplevel)"
  cd "$repo_root"
  git show-ref --verify --quiet refs/heads/develop
  base="$(git merge-base HEAD develop)"
  test -n "$base"

  jq empty \
    .gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json \
    .gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json \
    plugins/gobbi/.codex-plugin/plugin.json \
    plugins/gobbi/.claude-plugin/plugin.json \
    .claude-plugin/marketplace.json
  jq -e '.version == "0.5.2"' \
    plugins/gobbi/.codex-plugin/plugin.json >/dev/null
  jq -e '.version == "0.5.2"' \
    plugins/gobbi/.claude-plugin/plugin.json >/dev/null
  jq -e '
    [.plugins[] | select(.name == "gobbi") | .version] == ["0.5.2"]
  ' .claude-plugin/marketplace.json >/dev/null

  bash -n scripts/check-codex-compatibility.sh
  self_test_output="$(bash scripts/check-codex-compatibility.sh --self-test)"
  printf '%s\n' "$self_test_output"
  for fixture in \
    wrong-model \
    wrong-effort \
    wrong-template-leaf \
    incomplete-bridge-command \
    wrong-pointer
  do
    marker="PASS self-test: $fixture"
    marker_count="$(printf '%s\n' "$self_test_output" | awk -v marker="$marker" '$0 == marker { count++ } END { print count + 0 }')"
    test "$marker_count" -eq 1
  done
  summary_count="$(printf '%s\n' "$self_test_output" | awk '$0 == "PASS self-test: 5/5 fixtures rejected" { count++ } END { print count + 0 }')"
  test "$summary_count" -eq 1
  bash scripts/check-codex-compatibility.sh
  bash -n .gobbi/projects/gobbi/skills/orchestration/scripts/check-workflow-pointer-drift.sh
  bash .gobbi/projects/gobbi/skills/orchestration/scripts/check-workflow-pointer-drift.sh --self-test
  bash .gobbi/projects/gobbi/skills/orchestration/scripts/check-workflow-pointer-drift.sh
  bash scripts/sync-plugin-package.sh --check
  bash scripts/check-codex-plugin-smoke.sh
  claude plugin validate --strict ./plugins/gobbi
  bash scripts/validate-plugin-publish-readiness.sh --base "$base"

  test -z "$(git ls-files --others --exclude-standard)"
  tmp_dir="$(mktemp -d)"
  trap 'rm -rf "$tmp_dir"' EXIT
  expected="$tmp_dir/expected-name-status"
  observed="$tmp_dir/observed-name-status"
  printf 'M\t%s\n' \
    .codex/config.toml \
    .gobbi/projects/gobbi/agents/assistant.toml \
    .gobbi/projects/gobbi/agents/evaluator.toml \
    .gobbi/projects/gobbi/agents/executor.toml \
    .gobbi/projects/gobbi/agents/leader.toml \
    .gobbi/projects/gobbi/agents/manager.toml \
    .gobbi/projects/gobbi/skills/agent-writing/SKILL.md \
    .gobbi/projects/gobbi/skills/codex/SKILL.md \
    .gobbi/projects/gobbi/skills/codex/delegation.md \
    .gobbi/projects/gobbi/skills/delegation/SKILL.md \
    .gobbi/projects/gobbi/skills/git/conventions.md \
    .gobbi/projects/gobbi/skills/gobbi/SKILL.md \
    .gobbi/projects/gobbi/skills/orchestration/templates/settings.auto.json \
    .gobbi/projects/gobbi/skills/orchestration/templates/settings.chat.json \
    .gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md \
    .claude-plugin/marketplace.json \
    plugins/gobbi/.claude-plugin/plugin.json \
    plugins/gobbi/.codex-plugin/plugin.json \
    scripts/check-codex-compatibility.sh |
    LC_ALL=C sort > "$expected"
  git show-ref --verify --quiet refs/heads/develop
  base="$(git merge-base HEAD develop)"; git diff --name-status "$base" -- |
    LC_ALL=C sort > "$observed"
  test "$(wc -l < "$observed")" -eq 19
  diff -u "$expected" "$observed"
```

## Dependency graph

| Task | Depends on | Blocks | Files touched |
|---|---|---|---:|
| `01-native-defaults-and-settings` | None | 02, 03 | 8 |
| `02-policy-docs-and-validator` | 01 | 03 | 8 |
| `03-release-metadata-and-integration-gates` | 02 | None | 3 |

The dependency chain is strict: `01 -> 02 -> 03`. Task 02 validates the authorities established by Task 01. Task 03 validates and versions the complete policy unit.

## Parallel lanes

| Lane | Tasks | Order | Conflict memo |
|---|---|---|---|
| Sequential release lane | 01, 02, 03 | `01 -> 02 -> 03` | No parallel-safe execution lane is authorized. Non-overlapping files do not make interim contradictory policy states releasable. |

## Verification strategy summary

Each sub-task owns one complete fail-closed command block. Task 01 proves native and template authority state directly. Task 02 tests the stable compatibility-validator fixture interface and live owner contract. Task 03 reruns integration checks and compares the full branch/worktree against the exact 19-path merge-base set. The Ideation `Verification matrix` remains authoritative.

## Agent assignments

### Task 01

- Agent type: `executor`
- Model override: none
- Required skills: `.gobbi/projects/gobbi/skills/principles/SKILL.md`, `.gobbi/projects/gobbi/skills/mistake/SKILL.md`, `.gobbi/projects/gobbi/skills/execution/SKILL.md`, `.gobbi/projects/gobbi/skills/orchestration/workflow/execution.md`, `.gobbi/projects/gobbi/skills/coding/SKILL.md`, `.gobbi/projects/gobbi/skills/codex/SKILL.md`, `.gobbi/projects/gobbi/skills/agent-writing/SKILL.md`, `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`, `.gobbi/projects/gobbi/skills/git/SKILL.md`
- Required skill mistakes: `.gobbi/projects/gobbi/skills/mistake/mistakes.md`, `.gobbi/projects/gobbi/skills/codex/mistakes.md`, `.gobbi/projects/gobbi/skills/git/mistakes.md`
- Required project mistakes: `.gobbi/projects/gobbi/mistakes/assumption/source-edits-before-preparation-planning.md`, `.gobbi/projects/gobbi/mistakes/verification/find-misses-symlinked-mirror-dirs.md`, `.gobbi/projects/gobbi/mistakes/verification/mirror-topology-needs-inode-not-md5.md`, `.gobbi/projects/gobbi/mistakes/verification/verify-state-from-authoritative-source-not-proxy.md`, `.gobbi/projects/gobbi/mistakes/tooling/edit-tool-silent-write-failure-on-worktree.md`

### Task 02

- Agent type: `executor`
- Model override: none
- Required skills: `.gobbi/projects/gobbi/skills/principles/SKILL.md`, `.gobbi/projects/gobbi/skills/mistake/SKILL.md`, `.gobbi/projects/gobbi/skills/execution/SKILL.md`, `.gobbi/projects/gobbi/skills/orchestration/workflow/execution.md`, `.gobbi/projects/gobbi/skills/coding/SKILL.md`, `.gobbi/projects/gobbi/skills/skill-writing/SKILL.md`, `.gobbi/projects/gobbi/skills/codex/SKILL.md`, `.gobbi/projects/gobbi/skills/delegation/SKILL.md`, `.gobbi/projects/gobbi/skills/gobbi/SKILL.md`, `.gobbi/projects/gobbi/skills/evaluation/SKILL.md`, `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`, `.gobbi/projects/gobbi/skills/git/SKILL.md`
- Required skill mistakes: `.gobbi/projects/gobbi/skills/mistake/mistakes.md`, `.gobbi/projects/gobbi/skills/skill-writing/mistakes.md`, `.gobbi/projects/gobbi/skills/codex/mistakes.md`, `.gobbi/projects/gobbi/skills/delegation/mistakes.md`, `.gobbi/projects/gobbi/skills/evaluation/mistakes.md`, `.gobbi/projects/gobbi/skills/git/mistakes.md`
- Required project mistakes: `.gobbi/projects/gobbi/mistakes/refactor/blast-radius-map-from-named-files-not-exhaustive-grep.md`, `.gobbi/projects/gobbi/mistakes/refactor/enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete.md`, `.gobbi/projects/gobbi/mistakes/verification/find-misses-symlinked-mirror-dirs.md`, `.gobbi/projects/gobbi/mistakes/verification/verify-state-from-authoritative-source-not-proxy.md`, `.gobbi/projects/gobbi/mistakes/verification/grep-absence-claim-needs-exact-pattern.md`, `.gobbi/projects/gobbi/mistakes/verification/literal-grep-gate-false-fails-legitimate-usage.md`, `.gobbi/projects/gobbi/mistakes/verification/gitignore-aware-residual-gate.md`, `.gobbi/projects/gobbi/mistakes/verification/whole-file-allowlist-false-passes-same-file-residual.md`, `.gobbi/projects/gobbi/mistakes/tooling/edit-tool-silent-write-failure-on-worktree.md`

### Task 03

- Agent type: `executor`
- Model override: none
- Required skills: `.gobbi/projects/gobbi/skills/principles/SKILL.md`, `.gobbi/projects/gobbi/skills/mistake/SKILL.md`, `.gobbi/projects/gobbi/skills/execution/SKILL.md`, `.gobbi/projects/gobbi/skills/orchestration/workflow/execution.md`, `.gobbi/projects/gobbi/skills/coding/SKILL.md`, `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md`, `.gobbi/projects/gobbi/skills/codex/SKILL.md`, `.gobbi/projects/gobbi/skills/git/SKILL.md`
- Required skill mistakes: `.gobbi/projects/gobbi/skills/mistake/mistakes.md`, `.gobbi/projects/gobbi/skills/codex/mistakes.md`, `.gobbi/projects/gobbi/skills/git/mistakes.md`
- Required project mistakes: `.gobbi/projects/gobbi/mistakes/verification/find-misses-symlinked-mirror-dirs.md`, `.gobbi/projects/gobbi/mistakes/verification/verify-state-from-authoritative-source-not-proxy.md`, `.gobbi/projects/gobbi/mistakes/verification/git-gate-blind-to-gitignored-writes.md`, `.gobbi/projects/gobbi/mistakes/tooling/edit-tool-silent-write-failure-on-worktree.md`

All assignments use the default executor because each task is a bounded implementation unit. No task needs a leader or assistant role, and no task carries a model override.

## Self-review report

- Scope coverage: PASS. The file map contains exactly 19 unique locked target paths. Every path is assigned once: 8 to Task 01, 8 to Task 02, and 3 to Task 03.
- Checklist coverage: PASS. The 12 exact Ideation implementation checklist items are covered once across the three `traces-to` lists.
- Dependency review: PASS. There are three canonical IDs and one strict chain, `01 -> 02 -> 03`. No parallel-safe lane is claimed.
- Same-task co-touch: PASS. `orchestration/workflow/evaluation.md` and `scripts/check-codex-compatibility.sh` are both in Task 02, with pointer and compatibility gates run together.
- Verification review: PASS. Every `verifies` value is a complete fail-closed shell block. Task 01 uses complete one-line alias comparisons and a local-`develop` precondition. Tasks 02 and 03 require exactly one marker for each named validator fixture plus the `5/5` summary before live validation. Task 02 also checks the 5+4 commands and pointer-only workflow shape. Task 03 compares the whole branch/worktree to `git merge-base HEAD develop` after the same explicit ref precondition and mechanically matches the exact 19-path `M` set.
- Type/name review: PASS. All files use `op: modify`; producer output names match consumer inputs literally; exact prior-loop paths include section anchors; every assignment is `executor` with no override.
- Phase-load review: PASS. Every task loads `.gobbi/projects/gobbi/skills/execution/SKILL.md` and `.gobbi/projects/gobbi/skills/orchestration/workflow/execution.md` in addition to its domain skills and existing mistake companions.
- Preservation review: PASS. Validator non-policy checks, historical isolation, symlink topology, evaluator read-only posture, and the deferred backlog are explicit.
- Source-state review: PASS. Planning writes only this ignored session record; tracked source was clean when this draft was authored.

## Open issues

Iteration-2 evaluation has not run. The correction matrix below records producer-intended dispositions for every iteration-one finding; the evaluators must confirm or reject them.

## Iteration 2 finding correction matrix

These are the producer's intended dispositions for iteration 3. The iteration-3 evaluators must judge them independently. This matrix does not claim that evaluation has passed.

| Iteration-2 finding | Intended disposition | Iteration-3 correction or rationale |
|---|---|---|
| Claude `F-AES-1` | preserve addressed mitigation | The verbatim trace and its exact owner anchor remain unchanged. |
| Claude `F-CONS-1-ITER2` | preserve as non-blocking | Task 02 still distinguishes the compatibility validator's `Codex bridge owners` assertion from the separate pointer-drift guard, and runs both independently. |
| Claude `F-STRUCT-1-ITER2` | intended addressed | Both broken alias comparisons are now complete one-line commands in both deliverables; the alias-only loop is also executed during Planning self-check. |
| Claude `F-STRUCT-2-ITER2` | disputed, reasoned non-blocking | Task 02 remains the locked cohesive 8-file unit. Its expanded mistake roster is directly relevant to the validator work and does not justify splitting the task. |
| Claude `F-RISK-1-ITER2` | intended addressed | Every `git merge-base HEAD develop` use now has a preceding fail-closed `git show-ref --verify --quiet refs/heads/develop` precondition. No fallback ref is guessed. |
| Claude `F-OVR-1-ITER2` | intended addressed | The shared shell-mechanic regression is corrected in both deliverables through byte-equivalent task records. |
| Codex `CDEX-PLAN-I2-SELFTEST-001` | intended addressed | Task 02 `what` and outputs require the exact five-fixture interface. Tasks 02 and 03 capture output, require exactly one whole-line marker for each fixture, and require exactly one `5/5` summary before the live run. |
| Codex `CDEX-PLAN-I2-STR-002` | intended addressed | Task 02 now loads the four exact absence, literal-grep, gitignore-aware, and same-file-allowlist mistake files. |

## Iteration 1 finding correction matrix

These are the producer's intended dispositions for iteration 2. The iteration-2 evaluators must judge them independently. This matrix does not claim that evaluation has passed.

| Iteration-1 finding | Intended disposition | Iteration-2 correction or rationale |
|---|---|---|
| Claude `F-AES-1` | addressed | Task 02 preserves the verbatim Ideation trace and puts the exact `#form-covering-per-site-edit-inventory` authority in the task inputs directly below it. No inventory is copied into the workflow plan. |
| Claude `F-CONS-1` | addressed | The literal outputs `native-defaults-and-settings-state` and `current-policy-and-validator-state` are reused byte-for-byte by downstream inputs. |
| Claude `F-STRUCT-1` | addressed | Both mandatory Execution paths are in every task assignment. |
| Claude `F-STRUCT-2` | disputed, reasoned non-blocking | Task 02 remains the locked cohesive 8-file policy/validator unit. Each domain skill maps to an owned file, and the two added phase loads are mandatory. Splitting would break the locked task decomposition without reducing required context. |
| Claude `F-OVR-1` | addressed | The systemic phase-load correction is applied to all three tasks in both deliverables. |
| Codex `CDEX-PLAN-I1-CONS-001` | addressed | Inter-task states now use stable literal names in producer outputs and consumer inputs. |
| Codex `CDEX-PLAN-I1-CONS-002` | addressed | Assignment metadata now names both mandatory Execution authorities for every executor. |
| Codex `CDEX-PLAN-I1-OVERALL-001` | addressed | All three `verifies` fields are complete shell blocks; Task 02 exposes and tests the validator `--self-test` interface. |
| Codex `CDEX-PLAN-I1-OVERALL-002` | addressed | All six missing phase-load occurrences are present. |
| Codex `CDEX-PLAN-I1-OVERALL-003` | addressed | Task 03 uses `base="$(git merge-base HEAD develop)"; git diff --name-status "$base" --` and compares against the exact 19-path `M` set. |
| Codex `CDEX-PLAN-I1-OVERALL-004` | addressed | The Decisions log now defines stop, diagnostics preservation, default resume, and authorized reverse-order rollback for an interrupted task chain. |
| Codex `CDEX-PLAN-I1-OVERALL-005` | addressed | Literal handoff names and exact repo-relative prior-loop paths with section anchors replace paraphrases. |
| Codex `CDEX-PLAN-I1-USAGE-001` | addressed | A fresh executor can copy each fail-closed command block without inventing filters, ranges, fixtures, file sets, or expected results. |
| Codex `CDEX-PLAN-I1-USAGE-002` | addressed | Every prior-loop authority is identified by exact path and section anchor. |
| Codex `CDEX-PLAN-I1-USAGE-003` | addressed | Every task loads both Execution authorities. |
| Codex `CDEX-PLAN-I1-STR-001` | addressed | Verification fields are complete command contracts. |
| Codex `CDEX-PLAN-I1-STR-002` | addressed | Every executor package includes the two mandatory phase loads. |
| Codex `CDEX-PLAN-I1-STR-003` | addressed | The final diff gate observes committed earlier tasks and uncommitted Task 03 work relative to the merge base. |
| Codex `CDEX-PLAN-I1-RISK-001` | addressed | The exact 19-file proof uses the full merge-base range and rejects any status other than the expected 19 modifications. |
| Codex `CDEX-PLAN-I1-RISK-002` | addressed | Interruption-safe prepublication recovery is explicit and never treats an interim policy state as publishable. |

## NOT in scope

- Historical, archived, decision, note, changelog, prior-review, and session records are not source edit targets.
- Claude-native model policy, role taxonomy, plugin structure, hooks, sandbox policy, network policy, and git behavior remain unchanged.
- Fallback routing, model availability probes, separate proposer/evaluator tiers, and performance benchmarking are excluded.
- Historical incident commands in `codex/mistakes.md`, metadata examples in `codex/task-metadata.md`, and Claude teammate inheritance in `orchestration/agent-teams.md` remain unchanged and classified.
- `features/workflow/backlogs/codex/proposer-evaluator-model-tier-guard.md` remains unchanged. Native-Codex dual production is deferred for this session, so no proposal, reconciliation, or production-mode label is created.

## Decisions log

- Auto-mode discussion retained the approved Ideation scope without another non-authority user gate.
- Planning locks three sequential executor tasks with file counts 8, 8, and 3. There is no parallel execution lane and no model override.
- The Ideation briefing remains the verification authority. Preparation's repeated list and this plan's repeated gates are frozen snapshots.
- Exact current bridge coverage is five command blocks in `codex/SKILL.md` and four in `codex/delegation.md`.
- Workflow pointer and validator changes are one task. Residual discovery is form-covering and every occurrence is classified before exclusion.
- If a task fails after an earlier task commit, publication halts and the executor preserves command output, stderr, and the failing task's worktree changes. The default recovery is to resume the same task from the last verified task commit. No interim policy state is published.
- A rollback is a separate destructive choice requiring manager/user authorization. The executor first handles uncommitted failing-task changes separately against that task's exact `files:` set, preserving diagnostics before any `git restore --source=HEAD --` action. The manager then reverts every completed session task commit newest-first with `git revert --no-edit` until content returns to the stable session base, stops on any conflict, and reruns the full rollback gate set. It never uses `git reset --hard`, never leaves a mixed policy/version state, and never publishes an interim contradiction.
- Before publication, rollback reverts the coherent 19-file change as one unit and reruns the full gate set. It must not leave `0.5.2` metadata with reverted content or pinned content with `0.5.1` metadata.
- After `0.5.2` is published, recovery uses a newer synchronized corrective patch. It never decrements or reuses the published version.
- Histories, Claude-native policy, hooks, sandbox/network/git behavior, fallbacks, benchmarks, and the deferred distinct-tier backlog stay unchanged.

## Related

- [[deterministic-codex-policy-authorities]]
- [[claude-to-codex-bridge-contract]]
- [[validator-and-residual-guard-design]]
- [[plugin-delivery-and-alias-topology]]
- [[rollback-and-risk-boundaries]]
