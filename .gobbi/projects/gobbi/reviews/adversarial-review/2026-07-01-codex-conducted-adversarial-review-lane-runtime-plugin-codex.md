---
name: codex-conducted-adversarial-review-lane-runtime-plugin-codex
description: Lane F review for D6 runtime, plugin, install, packaging, and Codex compatibility
type: reviews
scope: project
feature: null
status: active
created: 2026-07-01
session: 019f1ef9-a676-7f12-8d78-922f12cb64e9
tags: [evaluation, codex, process]
keywords: [d6, runtime, plugin, install, packaging, codex-compatibility]
author: codex
review_kind: adversarial-review
subject: "Gobbi general surface — D6 runtime, plugin, install, packaging, and Codex compatibility"
verdict: needs-attention
---

# Lane F — D6 Runtime, Plugin, Install, Packaging, And Codex Compatibility

This lane reviews runtime packaging plus Codex compatibility as an add-on, not the whole review frame.

## Method

Lane F reviewed runtime packaging, plugin manifests, hooks, smoke/check scripts, symlink
topology, installed-cache assumptions, and Codex compatibility add-on points. Prior D6
findings from `2026-06-29-gobbi-adversarial-review-d6.md` were treated as existing and were
not re-filed.

Commands and checks used:

- `git status --short --branch`
- `git rev-parse HEAD`
- `find -L .agents/skills ...`
- `find -L plugins/gobbi/skills ...`
- `readlink ...`
- `git ls-files -s ...`
- `jq empty` on Codex/Claude manifests, marketplace JSON, and hook JSON
- `bash scripts/check-codex-compatibility.sh`
- `bash scripts/sync-plugin-package.sh --check`
- targeted `rg -n` absence checks
- line reads with `nl -ba`

`scripts/check-codex-plugin-smoke.sh` was inspected but not run by the lane reviewer because it
performs a plugin install into a temporary Codex home. That is acceptable as a future
verification step, but this lane kept its delegated research read-only.

## Findings

### GEN-D6-001: Codex smoke samples two skills and one hook manifest, so a mostly missing installed cache can still look clean
- Type: checklist_gap
- Domain: test
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D6
- Owner-surface: plugin
- Location: `scripts/check-codex-plugin-smoke.sh:89`; `plugins/gobbi/.codex-plugin/plugin.json:18`; `plugins/gobbi/hooks/codex-hooks.json:7`
- Expected: the Codex smoke should verify the installed cache contains the full component graph declared by the Codex manifest: all shipped skills and every hook command target.
- Observed: the manifest declares `skills: "./skills/"` and `hooks: "./hooks/codex-hooks.json"`, the source package exposes 22 `SKILL.md` files, and `codex-hooks.json` calls `hooks/session-start.sh` plus `hooks/post-tool-use-agents.sh`; the smoke checks only `skills/codex/SKILL.md`, `skills/principles/SKILL.md`, and `hooks/codex-hooks.json`.
- Evidence: `find -L plugins/gobbi/skills -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l` returned `22`; `nl -ba scripts/check-codex-plugin-smoke.sh` shows the sampled component paths at lines 89-98; `jq -r '.hooks | to_entries[] | .value[] | .hooks[] | .command' plugins/gobbi/hooks/codex-hooks.json` shows two shell script command targets not checked by the smoke.
- False-positive check: none. This is not prior D6-003; that finding covered a Claude installed-cache allow-set rejecting `.codex-plugin`, not the Codex smoke's partial component coverage.
- Proposed remediation: make the smoke enumerate all installed `skills/*/SKILL.md` against the source skill set and verify each hook command target exists under the installed cache.
- Verification: a cache missing any one of the 22 skills or either Codex hook script fails the smoke.

### GEN-D6-002: Codex smoke hard-fails on a Claude-only manifest while warning on missing Codex runtime components
- Type: design_flaw
- Domain: process
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D6
- Owner-surface: plugin
- Location: `scripts/check-codex-plugin-smoke.sh:79`; `scripts/check-codex-plugin-smoke.sh:89`
- Expected: a Codex install smoke should fail on missing Codex-required artifacts and treat Claude-only artifacts as non-blocking shared-package context.
- Observed: `.claude-plugin/plugin.json` is in the `required_file` loop and fails the Codex smoke if absent, while missing `skills/codex/SKILL.md`, `skills/principles/SKILL.md`, or `hooks/codex-hooks.json` only increments warnings.
- Evidence: `nl -ba scripts/check-codex-plugin-smoke.sh` shows `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json` both hard-required at lines 79-87; the Codex component paths are warnings at lines 89-98.
- False-positive check: none. This is the inverse of prior D6-003, not a duplicate: prior D6 found a Claude validator rejecting a Codex manifest; this finds the Codex smoke requiring a Claude manifest while softening Codex component absence.
- Proposed remediation: fail on Codex manifest and Codex runtime component absence; downgrade the Claude manifest to an informational shared-package check unless Codex actually requires it.
- Verification: a cache with valid Codex manifest, skills, and hooks but no `.claude-plugin/` does not fail the Codex smoke; a cache missing Codex skills or Codex hook command targets does fail.

### GEN-D6-003: Codex compatibility gate does not validate the Codex marketplace file
- Type: checklist_gap
- Domain: test
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D6
- Owner-surface: plugin
- Location: `scripts/check-codex-compatibility.sh:130`; `.agents/plugins/marketplace.json:8`
- Expected: the static Codex compatibility gate should validate `.agents/plugins/marketplace.json`, because that file maps `gobbi@gobbi-workspace` to the bounded package.
- Observed: the compatibility script validates the Codex plugin manifest, package symlinks, hooks, agents, and docs, but never checks `.agents/plugins/marketplace.json` or its `source.path`.
- Evidence: `rg -n "\\.agents/plugins|agents/plugins|marketplace\\.json|source\\.path|gobbi-workspace" scripts/check-codex-compatibility.sh` produced no output; `.agents/plugins/marketplace.json:8-15` contains the plugin name, source path, installation policy, and auth policy.
- False-positive check: none. The smoke script uses marketplace registration, but the static compatibility check can still report "Codex compatibility checks passed" while the marketplace file is broken.
- Proposed remediation: add JSON validation and exact value checks for marketplace name, plugin name, `source.source`, `source.path`, and policy fields.
- Verification: changing `.agents/plugins/marketplace.json` `source.path` away from `./plugins/gobbi` makes `scripts/check-codex-compatibility.sh` fail.

### GEN-D6-004: Trust prerequisite is stated in AGENTS but absent from the Codex install procedure and smoke evidence
- Type: checklist_gap
- Domain: docs-sync
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D6
- Owner-surface: docs
- Location: `AGENTS.md:31`; `.agents/skills/codex/SKILL.md:96`; `scripts/check-codex-plugin-smoke.sh:49`
- Expected: the Codex install path should tell an operator how to satisfy or verify the project-trust prerequisite before claiming config, hooks, and rules will load.
- Observed: `AGENTS.md` says the project must be trusted before project config, hooks, and rules are loaded, but the Codex skill's install block only gives `codex plugin marketplace add` and `codex plugin add`, and the smoke script registers/adds the plugin without any trust check.
- Evidence: `rg -n "trust|trusted" AGENTS.md .codex/AGENTS.md .agents/skills/codex/SKILL.md scripts/check-codex-plugin-smoke.sh scripts/check-codex-compatibility.sh .agents/plugins/marketplace.json plugins/gobbi/.codex-plugin/plugin.json` returned only `AGENTS.md:31` and `.codex/AGENTS.md:31`; `.agents/skills/codex/SKILL.md:96-103` has the install commands but no trust step.
- False-positive check: new-variant. Prior D1-020 covered the complete absence of Codex trust/install docs; current state has the trust sentence, but no operational trust verification.
- Proposed remediation: add a trust step or verification note to the Codex skill install procedure and decide whether the smoke script can assert it or must explicitly say trust remains unverified.
- Verification: the install doc and smoke output distinguish "plugin installed in cache" from "new trusted project thread will load config/hooks/rules."

### GEN-D6-005: Hook smoke bypasses the installed hook commands and `PLUGIN_ROOT` expansion path
- Type: checklist_gap
- Domain: test
- Severity: Medium
- Confidence: 100
- Priority: medium
- Disposition: open
- Runner: codex
- Dimension: D6
- Owner-surface: hook
- Location: `scripts/check-codex-compatibility.sh:89`; `plugins/gobbi/hooks/codex-hooks.json:7`
- Expected: a Codex hook compatibility check should exercise the same command shape the installed Codex hook uses, including `${PLUGIN_ROOT:-${CLAUDE_PLUGIN_ROOT}}` resolution.
- Observed: `check_codex_hook_smoke` directly runs `bash "$repo_root/$path" <<< '{}'` with `CODEX_THREAD_ID` and `CODEX_CI`; it never evaluates the command strings from `codex-hooks.json` and never proves `PLUGIN_ROOT` resolves to an installed hook root.
- Evidence: `scripts/check-codex-compatibility.sh:89-97` shows direct source-file invocation; `plugins/gobbi/hooks/codex-hooks.json:7` and `:15` show the real installed command form.
- False-positive check: none. Prior D6-007 covered matcher shape; this is the command-path execution gap.
- Proposed remediation: add a hook command smoke that sets `PLUGIN_ROOT` to a fixture or installed cache path and executes the command strings parsed from `codex-hooks.json`.
- Verification: changing the command in `codex-hooks.json` to a missing script path makes the compatibility check fail.

## Must Preserve

- Keep the source package symlinked.
- Keep Codex custom agents repo-local under `.codex/agents`.
- Keep evaluator sandbox `read-only`.
- Keep `scripts/check-codex-plugin-smoke.sh` isolated from the user's real Codex home.
- Keep native Codex hooks non-blocking when Claude environment variables are absent.
