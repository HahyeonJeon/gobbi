---
name: gobbi-adversarial-review-d6
description: D6 plugin deployment-readiness review — 16 raw dual-system findings reconciled to 7 new D6 findings + 4 D2-covered
type: reviews
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation]
keywords: [adversarial-review, d6, merge, plugin-deployment, manifest, hooks, install, dual-system]
author: claude
review_kind: adversarial-review
subject: "gobbi plugin + runtime-mirror surface (Dimension D6 — plugin deployment readiness)"
verdict: needs-attention
---

# D6 Adversarial Review — Plugin Deployment Readiness (consolidated merge)

## Review identity + scope

- **Dimension:** D6 — plugin deployment readiness (manifests, version cadence, runtime-mirror parity, packaged hooks, install validation, marketplace, documented runtime budgets).
- **Method:** dual-system adversarial review. Two independent systems (Claude + Codex) each reviewed the same plugin / mirror surface in ONE bounded pass. 2 partial-finding files.
- **Raw input:** 16 findings (Claude 9: `## CD6-01…CD6-09`; Codex 7: `### CD6-01…CD6-07`). Both numbered `CD6-NN` independently — DIFFERENT finding sets; reconciled by location + claim, not by number.
- **This file:** the merge — pessimistic union, de-duplicated by (location + claim), stably ID'd `D6-001…D6-007`, ordered Severity (Critical→High→Medium→Low) then system. **7 new D6 findings** (1 cross-system-corroborated, 6 single-system: 2 codex-only, 4 claude-only). **4 raw-finding pairs dropped as already-covered-by-D2** (the D6.4/D6.5/D6.6-mirror/D6.9 mirror+timeout seeds).
- **Cross-dimension dedup:** the mirror + timeout findings are KNOWN D2 seeds (D2-010, D2-015, D2-031/D2-032, D2-013). They are NOT re-filed as new D6 findings — see § Already covered by D2. The genuinely-new deployment defects (version cadence, codex-hooks matcher, hook fire-once validator, installed-cache allow-set, the `.claude/{hooks,scripts}` link-depth instances, the two guard-coverage false-greens) ARE filed below.

## D6.1–D6.9 state verification table

| Point | Result | Evidence |
|---|---|---|
| D6.1 — claude manifest is metadata-only (no `skills`/`agents`/`hooks` keys) | **PASS** | `jq 'has("skills") or has("agents") or has("hooks")' plugins/gobbi/.claude-plugin/plugin.json` → `false`; keys are only `name version description author license keywords`. **Install is NOT broken** — the metadata-only Claude manifest is correct. |
| D6.2 — codex manifest declares skills + hooks | **PASS** (matcher smell → D6-007) | `jq '{skills,hooks}' .codex-plugin/plugin.json` → `skills:"./skills/"`, `hooks:"./hooks/codex-hooks.json"`; `codex-hooks.json` declares `SessionStart`+`SubagentStop`. Matcher inconsistency noted at D6-007. |
| D6.3 — bumped semver, not a SHA pin | **PASS (literal) / cadence concern → D6-006** | all 3 manifests pin `"version":"0.5.0"` (not a SHA pin) — literal test passes; but the version is frozen across many content-changing PRs (D6-006). |
| D6.4 — both mirrors expose every canonical skill | **FAIL** → D2-010 (Already covered by D2) | `.claude/skills` = 21, `.agents/skills` = 22, canonical = 22; `coding` MISSING from `.claude`. |
| D6.5 — both mirrors expose every `scripts/` subdir | **FAIL** → D2-032 / D2-015 (Already covered by D2) | `find -L .claude/skills -type d -name scripts` = 0; `.agents`/package = 4. |
| D6.6 — doc-referenced script paths resolve from every read location | **FAIL** → mirror-read-location = D2-031/D2-032 (Already covered); canonical-depth = **D6-001 (new)**; gate-not-enforced = **D6-005 (new)** | `test -e .claude/skills/memory/scripts/validate-frontmatter.sh` → BROKEN; `check-markdown-links.sh` → 12 broken (6 are `.claude/{hooks,scripts}` depth bugs). |
| D6.7 — package whole-dir symlinks resolve; install validation | **PASS (symlink resolution) / FAIL (guard coverage)** → D6-002, D6-004 | `readlink -f plugins/gobbi/{skills,agents,hooks}` + `test -e` all resolve; `sync-plugin-package.sh --check` exit 0 — but the install-validation guards have coverage gaps (SessionEnd validator D6-002; `.claude/skills` false-green D6-004). |
| D6.8 — installed-cache vs source distinction; no real-copy masking | **PASS (no real-copy masking) / FAIL (allow-set)** → D6-003 | smoke test reports installed-cache omissions as `warn`, installs into isolated `CODEX_HOME`, never copies sources into the repo — model sound; but the installed-cache allow-set rejects the shared package's `.codex-plugin` (D6-003). |
| D6.9 — documented `codex exec` timeouts match host budget | **FAIL** → D2-013 (Already covered by D2) | `codex/SKILL.md:160,171` `timeout 1200` foreground-blocking (`:179`); active mistake `codex-exec-timeout-exceeds-bash-cap` documents the ~10-min Bash cap. |

**State summary:** D6.1 PASS (install not broken). D6.2/D6.3 PASS with noted concerns. D6.4/D6.5/D6.6(mirror)/D6.9 FAIL — all already covered by D2. D6.6(canonical)/D6.7/D6.8 surface the genuinely-new D6 deployment defects below.

## Findings summary

| ID | Sev | Conf | System | D6.x | Owner | Location | One-line |
|---|---|---|---|---|---|---|---|
| D6-001 | High | 100 | claude+codex | D6.6 | docs | orchestration/SKILL.md:108; delegation/SKILL.md:309 | `.claude/{hooks,scripts}/*.sh` doc links use 4 `../` (need 5) — broken from canonical (Claude=Critical / Codex=High — divergence) |
| D6-002 | High | 100 | codex | D6.7 | hook | hooks.json:27; validate-plugin-hooks-fire-once.sh:6,271,289 | fire-once validator ignores the packaged `SessionEnd` hook (4 packaged, 3 checked) |
| D6-003 | High | 75 | codex | D6.8 | plugin | validate-plugin-hooks-fire-once.sh:8,321,353 | installed-cache allow-set rejects the shared package's `.codex-plugin` manifest |
| D6-004 | High | 100 | claude | D6.7 | plugin | scripts/sync-plugin-package.sh:75-90 | `--check` reports intact/exit 0 while `.claude/skills` missing `coding` + all `scripts/` (guard false-green) |
| D6-005 | Medium | 100 | claude | D6.6 | docs | wrap-up/SKILL.md:390,474; canonical skills/ tree | wrap-up-cited `check-markdown-links.sh` run-to-zero gate is non-zero (12 broken) + not in the pre-publish gate |
| D6-006 | Medium | 75 | claude | D6.3 | plugin | plugin.json:3 (×2) + marketplace.json | plugin `version` frozen at `0.5.0` across many content PRs — `claude plugin update` delivers nothing |
| D6-007 | Low | 50 | claude | D6.2 | hook | plugins/gobbi/hooks/codex-hooks.json | codex-hooks `SessionStart` matcher `…|.*` defeats the explicit filter; `*` vs `.*` spelling drift |

Severity counts (new D6 findings): Critical 0 · High 4 · Medium 2 · Low 1 (7 total). Plus 4 raw-finding pairs dropped as already-covered-by-D2.

## Findings

### D6-001: `.claude/{hooks,scripts}/*.sh` doc links use the wrong `../` depth — broken from the canonical read location
- Severity: High (Claude=Critical / Codex=High — reconciled; D2-precedent rated Medium)
- Confidence: 100
- Priority: high
- System: claude+codex
- Dimension: D6 (D6.6)
- Owner-surface: docs
- Location: `skills/orchestration/SKILL.md:108` (+ session-end / post-tool-use hook refs), `skills/delegation/SKILL.md:309`
- Expected: a doc-referenced deployment-script/hook path resolves from the canonical skill doc — the primary author/read surface.
- Observed: the links use `../../../../.claude/...` (4 `../`). From `skills/orchestration/` that lands at `.gobbi/.claude/...`; 5 `../` are needed to reach the repo-root `.claude/`. Off by one. The target files (`.claude/scripts/reconstruct-agents.sh`, `.claude/hooks/post-tool-use-agents.sh`, `.claude/hooks/session-end.sh`) DO exist at repo root but are unreachable from the doc's own location.
- Description: A depth bug (off-by-one `../`), a DIFFERENT defect class than the mirror gaps — these break from the CANONICAL read location, not only the mirror. Kept in D6 because the targets are deployment-critical: the post-tool-use + session-end hooks and the `reconstruct-agents.sh` reconciler the install/runtime flow depends on. Cross-dimension: D2-017 (orchestration) + D2-022 (delegation) record the identical off-by-one from the D2.3 completeness angle (rated Medium there); D6 retains it as a deployment-path-integrity defect rather than re-filing under D2.
- Evidence (command + output):
  ```
  $ bash skills/orchestration/scripts/check-markdown-links.sh skills
  BROKEN: orchestration/SKILL.md -> ../../../../.claude/hooks/post-tool-use-agents.sh   (x2)
  BROKEN: orchestration/SKILL.md -> ../../../../.claude/scripts/reconstruct-agents.sh
  BROKEN: orchestration/SKILL.md -> ../../../../.claude/hooks/session-end.sh
  BROKEN: delegation/SKILL.md   -> ../../../../.claude/scripts/reconstruct-agents.sh
  BROKEN: delegation/SKILL.md   -> ../../../../.claude/hooks/post-tool-use-agents.sh
  # 5-../ form resolves: test -e .../../../../../.claude/scripts/reconstruct-agents.sh → EXISTS
  ```
- Proposed remediation (directional): repoint each `../../../../.claude/...` to 5 `../` (`../../../../../.claude/...`), OR point at the canonical hook/script sources. Re-run `check-markdown-links.sh` to zero, then wire it into the plugin pre-publish gate (D6-005).
- Verification: `check-markdown-links.sh` reports 0 broken `.claude/{hooks,scripts}` links from canonical, `.agents`, `.claude`, and package read locations.
- Cross-system divergence: severity Claude=Critical (CD6-02) vs Codex=High (CD6-06) → reconciled High; both conf 100, same locations — strongest anti-groupthink corroboration in this dimension.
- Disposition: open

### D6-002: Claude hook fire-once validator ignores the packaged `SessionEnd` hook
- Severity: High
- Confidence: 100
- Priority: high
- System: codex
- Dimension: D6 (D6.7)
- Owner-surface: hook
- Location: `plugins/gobbi/hooks/hooks.json:27`, `scripts/validate-plugin-hooks-fire-once.sh:6,271,289-292`
- Expected: install validation covers every packaged Claude hook event.
- Observed: the package registers 4 events (`PostToolUse`, `PostToolUseFailure`, `SessionEnd`, `SessionStart`) but the validator expects/checks only 3 (`SessionStart`, `PostToolUse`, `PostToolUseFailure`) and flags any `SessionEnd` marker as an unexpected "dev registration leak".
- Description: A D6.7 install-readiness defect — the fire-once guard has a coverage gap on a packaged hook event. A SessionEnd marker would FAIL validation even though SessionEnd is intentionally packaged.
- Evidence (command + output):
  ```
  $ jq '.hooks | keys' plugins/gobbi/hooks/hooks.json
  ["PostToolUse","PostToolUseFailure","SessionEnd","SessionStart"]
  $ nl -ba scripts/validate-plugin-hooks-fire-once.sh | sed -n '6,7p;271,273p;289,292p'
  6   #   (i)   Each of the 3 hook registrations fires EXACTLY ONCE per event trigger.
  7   #         Events covered: SessionStart, PostToolUse, PostToolUseFailure.
  271 check_marker "SessionStart"
  272 check_marker "PostToolUse"
  273 check_marker "PostToolUseFailure"
  290 SessionStart|PostToolUse|PostToolUseFailure) ;;
  292 fail "unexpected marker file: ${basename_f} — dev registration leak?"
  ```
- Proposed remediation (directional): add `SessionEnd` to the operator procedure, the marker assertions, and the allowed-marker set; OR document why `SessionEnd` is excluded and drop it from the packaged registration.
- Verification: the validator's expected-event set and allow-set include every event in `hooks.json` (4 of 4).
- Disposition: open

### D6-003: Installed-cache allow-set rejects the shared package's `.codex-plugin` manifest
- Severity: High
- Confidence: 75
- Priority: high
- System: codex
- Dimension: D6 (D6.8)
- Owner-surface: plugin
- Location: `scripts/validate-plugin-hooks-fire-once.sh:8,321,353`
- Expected: install-cache validation allows all intentional top-level entries in the shared `plugins/gobbi` package.
- Observed: the source package contains `.codex-plugin`, but the Claude installed-cache validator's allow-set is `{.claude-plugin, skills, agents, hooks}` — it excludes `.codex-plugin` and would flag it as UNEXPECTED if the installer copies the shared package as packaged.
- Description: A D6.8 install-readiness defect — the shared dual-runtime package carries `.codex-plugin`, but the Claude cache assertion treats it as a foreign entry. (D6.8's no-real-copy-masking model is otherwise sound — Claude's CD6-08 confirms the smoke test never copies sources into the repo.)
- Evidence (command + output):
  ```
  $ find -L plugins/gobbi -mindepth 1 -maxdepth 1 -printf '%f\n' | sort
  .claude-plugin
  .codex-plugin
  agents
  hooks
  skills
  $ nl -ba scripts/validate-plugin-hooks-fire-once.sh | sed -n '8,9p;321p;353p'
  8   #   (ii)  The installed-cache top level holds only the allow-set:
  9   #         {.claude-plugin, skills, agents, hooks}
  321 ALLOW_SET=( ".claude-plugin" "skills" "agents" "hooks" )
  353 fail "UNEXPECTED entry in installed-cache: '${e}' — not in allow-set"
  ```
- Proposed remediation (directional): include `.codex-plugin` in the installed-cache allow-set for the shared package, OR split the Claude-only cache assertion from the shared source-package inventory.
- Verification: the installed-cache allow-set accepts every intentional top-level entry of the shared `plugins/gobbi` package (incl. `.codex-plugin`), or the split is documented.
- Disposition: open

### D6-004: `sync-plugin-package.sh --check` reports "intact"/exit 0 while `.claude/skills` is missing `coding` + all `scripts/` — the completeness guard has zero coverage of the `.claude/skills` mirror
- Severity: High
- Confidence: 100
- Priority: high
- System: claude
- Dimension: D6 (D6.7)
- Owner-surface: plugin
- Location: `scripts/sync-plugin-package.sh:75-90`
- Expected: the named guard (`sync-plugin-package.sh --check`, cited by `claude-plugin/SKILL.md` as the pre-claim check) catches mirror drift, including the `.claude/skills` surface that holds the D6.4/D6.5 gaps.
- Observed: `--check` validates only (1) `.agents/skills/<skill>` per-skill symlinks, (2) the 3 `plugins/gobbi/{skills,agents,hooks}` whole-dir symlinks, (3) `.claude/hooks/*.sh`. It NEVER inspects `.claude/skills/`, so it reports intact / exit 0 while `.claude/skills` is missing `coding` and all 4 `scripts/` subdirs — a false-green precisely where the drift lives.
- Description: A guard-coverage defect (the false-green), distinct from the mirror gaps themselves (those are D6.4/D6.5 → Already covered by D2). Cross-dimension: D2-015 records the same root cause (`.claude/skills` unmanaged by sync + unvalidated by `--check`) from the D2.3/D2.4 completeness angle; D6 retains the deployment-readiness guard-coverage framing and adds the `scripts/` dimension D2-015 did not enumerate. Also note `check-workflow-mirror-consistency.sh` covers only `orchestration/workflow/*.md`, not other skills, `coding`, or `scripts/`.
- Evidence (command + output):
  ```
  $ bash scripts/sync-plugin-package.sh --check; echo exit=$?
  Codex skill, plugins/gobbi, and .claude hook symlinks are intact
  exit=0
  # yet: .claude/skills = 21 dirs (no coding), 0 scripts subdirs
  ```
- Proposed remediation (directional): extend `--check` to assert `.claude/skills` exposes every canonical skill dir and every `scripts/` subdir (symlink-following `find -L`), so the guard fails on drift; OR add a dedicated `.claude/skills`-parity guard. Pairs with the D2-010 / D2-015 / D2-032 mirror fixes.
- Verification: a deliberately-removed `.claude/skills/{name}` or `scripts/` entry makes `--check` exit non-zero.
- Disposition: open

### D6-005: the wrap-up-cited `check-markdown-links.sh` run-to-zero gate is non-zero (12 broken canonical links) and is not wired into the plugin pre-publish gate
- Severity: Medium
- Confidence: 100
- Priority: medium
- System: claude
- Dimension: D6 (D6.6 — guard / docs-integrity)
- Owner-surface: docs
- Location: canonical `skills/` tree; `skills/wrap-up/SKILL.md:390,474`
- Expected: `wrap-up/SKILL.md` cites `check-markdown-links.sh` as a run-to-zero gate; the shipped tree passes it, and a broken deployment-path link cannot ship.
- Observed: the gate reports 12 broken links across 1004 checked. 6 are the D6-001 `.claude/{hooks,scripts}/*.sh` deployment paths; the other 6 are doc-graph drift already tracked under D2 — `orchestration/workflow/{wrap-up,execution}.md -> ../delegation/SKILL.md#…` (anchor; the D2 delegation-link seed), `delegation/SKILL.md -> ../../rules/docs-cleanup-parallelism.md` (D2-023), `delegation/SKILL.md -> ../../features/agents/backlogs/…session-json.md` (D2-024), `memory/rules.md -> ../../mistakes/design-literal-retire-instruction-without-replacement.md` + `-> diataxis.fr` (D2-037).
- Description: A guard-enforcement gap — a cited run-to-zero gate is not at zero and is not part of the plugin-readiness pre-publish gate, so a broken deployment-path link can ship. The 6 non-script links are D2-owned follow-ups (not re-filed here); the NEW D6 contribution is the enforcement gap. Sibling of D6-004 (both are cited guards that fail to cover / fail to fire).
- Evidence (command + output):
  ```
  $ bash skills/orchestration/scripts/check-markdown-links.sh skills
  check-markdown-links.sh: 12 broken link(s) across 1004 checked.
  # 6 = D6-001 .claude/{hooks,scripts}/*.sh deployment paths; 6 = D2-tracked doc-graph links
  ```
- Proposed remediation (directional): fix D6-001 (6 deployment links) + the 6 D2-tracked doc-graph links, then wire `check-markdown-links.sh` into the plugin-readiness pre-publish gate so a broken deployment-path link cannot ship.
- Verification: `check-markdown-links.sh` over `skills/` reports 0 broken links AND the plugin pre-publish gate runs it.
- Disposition: open

### D6-006: plugin `version` frozen at `0.5.0` across many content-changing PRs — `claude plugin update` never delivers updates
- Severity: Medium
- Confidence: 75
- Priority: medium (version policy is a user decision)
- System: claude
- Dimension: D6 (D6.3)
- Owner-surface: plugin
- Location: `plugins/gobbi/.claude-plugin/plugin.json:3`, `plugins/gobbi/.codex-plugin/plugin.json`, `plugins/gobbi/.claude-plugin/marketplace.json`
- Expected (D6.3 literal): a bumped semver, not a git-SHA pin — PASSES. But `claude-plugin/SKILL.md` § Version cadence: bump `version` with every meaningful content change, else installers get no updates.
- Observed: all three manifests pin `0.5.0`; the version line was last touched at PR #290 yet skills/agents/hooks have changed across many later PRs (memory log shows #294–#323 post-dating it). Not a SHA pin (so D6.3's literal test passes), but a never-incrementing semver has the same installer-facing effect — `claude plugin update` sees no change.
- Description: D6.3 passes literally (semver, not SHA), but the frozen-version cadence is a deployment-update defect with the same installer-facing effect as a SHA pin. Version policy is a user decision — surface to the manager, not a reviewer call.
- Evidence (command + output):
  ```
  $ grep '"version"' plugins/gobbi/.claude-plugin/plugin.json .codex-plugin/plugin.json .claude-plugin/marketplace.json
  → "version": "0.5.0"  (each)
  $ git log -S '"version"' -- plugins/gobbi/.claude-plugin/plugin.json
  → newest touch f35f939d (#290)
  ```
- Proposed remediation (directional): adopt a bump-on-meaningful-change discipline (e.g. `0.5.x` patch bumps) and add it to the pre-publish gate, so the installer-visible version tracks content. Surface to the manager — version policy is a user decision.
- Verification: the installer-visible `version` increments on meaningful content change, enforced by the pre-publish gate.
- Disposition: open

### D6-007: codex-hooks.json matcher inconsistencies — `.*` defeats the explicit `SessionStart` filter; `*` is a literal-asterisk matcher
- Severity: Low
- Confidence: 50
- Priority: low
- System: claude
- Dimension: D6 (D6.2)
- Owner-surface: hook
- Location: `plugins/gobbi/hooks/codex-hooks.json`
- Expected: hook matchers consistent with the project's post-#229 standard (`startup|resume|clear|compact`, no match-all wildcards).
- Observed: the Codex `SessionStart` matcher is `startup|resume|clear|compact|.*` — the trailing `.*` makes the alternation match everything, re-introducing the match-all the project standardized away from (memory: PR #229 "matcher now `startup|resume|clear|compact` everywhere"). `SubagentStop` uses `*` (a literal asterisk, not the regex `.*`); the Claude `hooks.json` `SessionEnd` also uses `*`. Functionally tolerated by both runtimes today, but the `.*`-tacked-on alternation is a smell and the `*`-vs-`.*` spelling is inconsistent across the two hook files.
- Description: A low-severity consistency/smell finding on the codex hook matcher surface (D6.2). Verify each runtime's matcher semantics before changing — SubagentStop/SessionEnd are intended to always fire.
- Evidence (command + output):
  ```
  $ jq -r '.hooks|to_entries[]|"\(.key): \(.value[0].matcher)"' plugins/gobbi/hooks/codex-hooks.json
  SessionStart: startup|resume|clear|compact|.*
  SubagentStop: *
  ```
- Proposed remediation (directional): drop the trailing `|.*` from the Codex `SessionStart` matcher (keep the explicit event list, matching Claude `hooks.json`) and standardize the always-fire matcher spelling. Low priority.
- Verification: the Codex `SessionStart` matcher carries no match-all wildcard, and the always-fire spelling is consistent across both hook files.
- Disposition: open

## Cross-system divergence

The anti-groupthink signal in D6 is strong: the two systems found **largely different deployment defects**, plus one corroborated finding and one severity split.

- **Corroborated (claude+codex):** D6-001 (`.claude/{hooks,scripts}` link-depth) — both systems landed on the same locations (orchestration:108, delegation:309) with conf 100. The 4 D2-bucket findings (D6.4 coding-missing, D6.5 scripts-gap, D6.6 mirror-doc-refs, D6.9 codex-timeout) were ALSO found by both systems — strong corroboration, but routed to § Already covered by D2 rather than re-filed.
- **Single-system codex (2):** D6-002 (fire-once validator ignores `SessionEnd`), D6-003 (installed-cache allow-set rejects `.codex-plugin`). Codex's distinctive lens this pass = **install-validation coverage** — defects in the validator scripts that Claude did not surface.
- **Single-system claude (4):** D6-004 (sync-check false-green), D6-005 (markdown-links gate not enforced), D6-006 (version cadence frozen), D6-007 (codex-hooks matcher smell). Claude's distinctive lens = **guard-coverage false-greens, version cadence, and the canonical link-depth bug** — the deployment-update and docs-integrity surface.
- **Severity divergence (D6-001):** Claude = Critical (deployment-path link to install-flow hooks + reconciler), Codex = High. D2 rated the identical off-by-one Medium (D2-017/D2-022). Reconciled to **High** — the targets exist (not a hard install-breaker) but the canonical-doc link is dead, a deployment-path-integrity defect.
- **State-table divergence (D6.7 / D6.8):** Claude marked D6.7/D6.8 PASS (package symlinks resolve; installed-cache model sound), filing the guard-coverage gaps separately; Codex marked D6.7/D6.8 FAIL (validator coverage gaps block readiness). Reconciled: **symlink resolution + installed-cache model PASS; install-validation guard coverage FAILS** (D6-002, D6-003, D6-004). Both halves preserved.

## Already covered by D2

These 4 raw-finding pairs (8 of the 16 raw findings) are KNOWN D2 seeds. They are NOT re-filed as new D6 findings; the current-state confirmation D6 verified this pass is recorded here.

| D6 point | Raw findings (claude / codex) | D2 coverage | Current state D6 verified |
|---|---|---|---|
| D6.4 — `.claude` mirror missing canonical `coding` skill | Claude CD6-04 + Codex CD6-03 | **D2-010** (+ root D2-015) | `find -L .claude/skills` = 21, `.agents/skills` = 22, canonical = 22; `test -e .claude/skills/coding` → MISSING. Unchanged since D2. |
| D6.5 — `.claude` mirror exposes 0 of 4 `scripts/` subdirs | Claude CD6-05 + Codex CD6-04 | **D2-032** (+ root D2-015) | `find -L .claude/skills -type d -name scripts` = 0; `.agents`/package = 4 (`git`,`memory`,`orchestration`,`record`). Unchanged. |
| D6.6 — script doc-refs unresolved from the `.claude/skills` read location | Claude CD6-01 + Codex CD6-05 | **D2-031 / D2-032** (+ root D2-015) | `test -e .claude/skills/memory/scripts/validate-frontmatter.sh` → BROKEN; same refs resolve via canonical / `.agents` / package. Mirror-read-location class only; the canonical-depth + gate-enforcement angles are the NEW D6-001 / D6-005. |
| D6.9 — `codex/SKILL.md` `timeout 1200` foreground exceeds the Bash ~10-min cap | Claude CD6-06 + Codex CD6-07 | **D2-013** | `grep -n 'timeout 1200' codex/SKILL.md` → 160,171, foreground-blocking (`:179`); active mistake `codex-exec-timeout-exceeds-bash-cap` documents the kill. Unchanged. |

Note: the `.claude/{hooks,scripts}` link-depth bug overlaps D2-017 / D2-022 by LOCATION, but is RETAINED as new D6-001 per the deployment-path-integrity lens (the targets are install-flow hooks + the agents reconciler) — it is not in this table.

## Outcome

This review's verdict is **needs-attention**: D6.1 PASSES (the Claude metadata-only manifest is correct — install is not broken), but 7 new deployment-readiness defects remain open (4 High, 2 Medium, 1 Low) plus 4 D2-tracked mirror/timeout seeds still unrepaired. No D6 finding is auto-applied; D6-006 (version cadence) is explicitly a user decision. The fixes pair: D6-001 + D6-005 (docs link-depth + gate enforcement), D6-002 + D6-003 + D6-004 (the three install-validation guard gaps).

## Open items

All 7 D6 findings are `Disposition: open`. The 4 already-covered-by-D2 seeds are tracked under their D2 IDs (D2-010, D2-013, D2-015, D2-031, D2-032) in the D2 fix queue; D6 confirms they are unrepaired as of 2026-06-29.

## Related

- [[gobbi-adversarial-review-d2]] — the merged D2 completeness review; owns the mirror + timeout seeds this D6 pass dedups against (D2-010, D2-013, D2-015, D2-017, D2-022, D2-031, D2-032)
- [[adversarial-review-charter-authored]] — the charter this review executes against
- [[run-deep-adversarial-review]] — the parent charter-execution backlog
