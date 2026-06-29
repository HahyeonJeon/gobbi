---
name: fix-d6-review-findings
description: "Deferred fix queue for the 7 D6 (plugin deployment-readiness) adversarial-review findings — review-only → future scoped session."
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation, process]
keywords: [adversarial-review, d6, plugin-deployment, manifest, hooks, install, fix-queue]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# Fix queue — D6 adversarial-review findings (plugin deployment readiness)

## Context

The 2026-06-29 D6 adversarial-review session reviewed **plugin deployment readiness** of the gobbi
plugin + runtime-mirror surface — manifests, version cadence, runtime-mirror parity, packaged hooks,
install validation, marketplace, and documented `codex exec` budgets. The pass was **dual-system**
(Claude + Codex) in ONE bounded run (NOT a whole-surface 6-chunk pass — D6 is bounded plugin/mirror
parity), and produced **7 new consolidated findings** from 16 raw (1 cross-system-corroborated, 6
single-system: 2 codex-only, 4 claude-only). The session was **review-only** (the charter is
review-only; fixes are separate sessions), so no finding was fixed. This backlog is the deferred fix
queue. The **source of record** for every finding (full per-finding record, evidence, proposed
remediation, the D6.1–D6.9 state table, cross-system divergence, and the `## Already covered by D2`
cross-dimension dedup) is `reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d6.md`.

Severity tally: **Critical 0 · High 4 · Medium 2 · Low 1 = 7.** Key outcome: **D6.1 PASSES — install
is NOT broken** (the Claude metadata-only manifest is correct). The 7 open defects are deployment-
readiness gaps (guard false-greens, docs link-depth, validator coverage, version cadence), not
install-blockers.

## Why deferred

The user chose review-only for this charter slice. Fixing findings is out of scope for a review
session and belongs in a scoped Execution session that can plan, change source, and re-verify.

## When to pick up

Any time after this session — no hard prerequisite. Recommended sequencing: settle the **2
manager-decision items** first (below), then take the **4 High findings** as two fix-pairs —
docs/gate (D6-001 + D6-005) and install-validation guard coverage (D6-002 + D6-003 + D6-004) — then
the Low matcher-smell. Most D6 findings are mechanically verifiable (`find -L` / `test -e` /
`check-markdown-links.sh` / `jq`), so each carries a runnable Verification field in the review.

## Manager-decision items (settle before fixing)

D6 produced two items the manager/user must decide before the fix, because the fix direction or
priority is a user call — not a reviewer call.

1. **D6-006 — version cadence (the genuine user decision).** All three manifests pin `version: 0.5.0`
   across many content-changing PRs (memory log: #294–#323 post-date the last version touch at #290),
   so `claude plugin update` delivers nothing. The fix — adopt a bump-on-meaningful-change discipline
   (e.g. `0.5.x` patch bumps) and enforce it in the pre-publish gate — sets **version policy**, which
   is explicitly a user decision. Settle the policy before any bump.
2. **D6-001 — link-depth severity adjudication.** This is the one cross-system-corroborated finding,
   and it carries a **severity split: Claude = Critical, Codex = High** (reconciled to High; the D2
   precedent D2-017/D2-022 rated the identical off-by-one Medium). The fix direction is clear (repoint
   to 5 `../`), but the final severity/priority — which decides whether it leads the fix campaign —
   is a manager adjudication, since three dimensions rated the same defect differently.

## The fix queue — by cluster

Each entry: **ID** (severity) — one-line. `location`. → directional fix (see the review artifact for
the full proposed remediation + verification step). The 1 cross-system-corroborated finding is marked
**[corroborated]**.

### Cluster A — docs link-depth + guard enforcement (D6.6)

The canonical-read-location link-depth bug and the cited-gate-not-at-zero enforcement gap. These two
pair: fix the broken links, then wire the gate to keep them fixed.

- **D6-001** (High, **[corroborated]**, **manager-decision #2**) — `.claude/{hooks,scripts}/*.sh` doc
  links use 4 `../` (need 5) — broken from the canonical skill-doc read location (targets exist at
  repo root but are unreachable from the doc's own dir). `orchestration/SKILL.md:108`;
  `delegation/SKILL.md:309`. → repoint each `../../../../.claude/...` to 5 `../`
  (`../../../../../.claude/...`), or point at the canonical hook/script sources; re-run
  `check-markdown-links.sh` to zero. Severity split Claude=Critical / Codex=High — manager adjudicates.
- **D6-005** (Medium) — the wrap-up-cited `check-markdown-links.sh` run-to-zero gate is non-zero (12
  broken across 1004) and is not wired into the plugin pre-publish gate. `wrap-up/SKILL.md:390,474`;
  canonical `skills/` tree. → fix D6-001's 6 deployment links + the 6 D2-tracked doc-graph links (see
  cross-dimension table), then wire `check-markdown-links.sh` into the plugin-readiness pre-publish
  gate so a broken deployment-path link cannot ship. Sibling of D6-004 (a cited guard that does not
  fire). Note: the 6 non-script broken links are D2-owned — fix through the D2 queue, do not re-file.

### Cluster B — install-validation guard coverage (D6.7 / D6.8)

Three install-readiness guards each have a coverage gap. Codex's distinctive lens this pass; D6-004 is
Claude's. They share the pre-publish-validation surface and can land together.

- **D6-002** (High) — the Claude fire-once validator ignores the packaged `SessionEnd` hook (4
  packaged events, only 3 checked) and would FAIL a legitimate `SessionEnd` marker as a "dev
  registration leak". `plugins/gobbi/hooks/hooks.json:27`; `scripts/validate-plugin-hooks-fire-once.sh:6,271,289-292`.
  → add `SessionEnd` to the operator procedure, the marker assertions, and the allow-set; or document
  why it is excluded and drop it from the packaged registration.
- **D6-003** (High, conf 75) — the installed-cache allow-set `{.claude-plugin, skills, agents, hooks}`
  rejects the shared package's `.codex-plugin` manifest and would flag it UNEXPECTED if the installer
  copies the shared package as packaged. `scripts/validate-plugin-hooks-fire-once.sh:8,321,353`. →
  include `.codex-plugin` in the installed-cache allow-set for the shared package, or split the
  Claude-only cache assertion from the shared source-package inventory.
- **D6-004** (High) — `sync-plugin-package.sh --check` reports intact / exit 0 while `.claude/skills`
  is missing `coding` + all 4 `scripts/` subdirs — a false-green precisely where the drift lives (the
  guard never inspects `.claude/skills/`). `scripts/sync-plugin-package.sh:75-90`. → extend `--check`
  to assert `.claude/skills` exposes every canonical skill dir + every `scripts/` subdir
  (symlink-following `find -L`), or add a dedicated `.claude/skills`-parity guard. **Pairs with the
  D2-010 / D2-015 / D2-032 mirror fixes** (same root cause — `.claude/skills` unmanaged by sync +
  unvalidated by `--check`); D6 adds the deployment-readiness guard-coverage framing + the `scripts/`
  dimension D2-015 did not enumerate.

### Cluster C — deployment-update cadence (D6.3)

- **D6-006** (Medium, conf 75, **manager-decision #1**) — plugin `version` frozen at `0.5.0` across
  many content-changing PRs; `claude plugin update` never delivers updates (same installer-facing
  effect as a SHA pin, though D6.3's literal semver test passes). `plugins/gobbi/.claude-plugin/plugin.json:3`;
  `plugins/gobbi/.codex-plugin/plugin.json`; `plugins/gobbi/.claude-plugin/marketplace.json`. → adopt
  bump-on-meaningful-change (e.g. `0.5.x` patch bumps) + add it to the pre-publish gate. **Version
  policy is a user decision — settle it first.**

### Cluster D — hook-matcher consistency (D6.2)

- **D6-007** (Low, conf 50) — the Codex `SessionStart` matcher `startup|resume|clear|compact|.*` —
  the trailing `.*` defeats the explicit event filter (re-introduces the match-all the project
  standardized away from at PR #229); `SubagentStop` uses `*` (literal asterisk) while Claude
  `hooks.json` `SessionEnd` also uses `*` — `*`-vs-`.*` spelling drift across the two hook files.
  `plugins/gobbi/hooks/codex-hooks.json`. → drop the trailing `|.*` from the Codex `SessionStart`
  matcher (keep the explicit event list, matching Claude `hooks.json`) and standardize the always-fire
  matcher spelling. Verify each runtime's matcher semantics first — `SubagentStop` / `SessionEnd` are
  intended to always fire. Low priority.

## Cross-dimension overlaps — already on the D2 fix-backlog (do NOT duplicate)

The review's `## Already covered by D2` section lists 4 raw-finding pairs (8 of the 16 raw findings)
that target the SAME defect at the SAME location already filed in the merged D2 review. They are NOT
re-filed here and are NOT in the clusters above. They are tracked on
`backlogs/evaluation/fix-d2-review-findings.md`; the fix session should fix them through THAT queue (or
confirm the D2 fix closes them), never re-file:

| D6 point | D2 finding(s) | Note |
|---|---|---|
| D6.4 — `.claude` mirror missing canonical `coding` skill | D2-010 (+ root D2-015) | `.claude/skills` = 21, `.agents`/canonical = 22; `coding` MISSING. Unchanged since D2. |
| D6.5 — `.claude` mirror exposes 0 of 4 `scripts/` subdirs | D2-032 (+ root D2-015) | `find -L .claude/skills -type d -name scripts` = 0; `.agents`/package = 4. Unchanged. |
| D6.6 — script doc-refs unresolved from the `.claude/skills` read location | D2-031 / D2-032 (+ root D2-015) | mirror-read-location class only; the canonical-depth + gate-enforcement angles ARE the new D6-001 / D6-005. |
| D6.9 — `codex/SKILL.md` `timeout 1200` foreground exceeds the Bash ~10-min cap | D2-013 | `timeout 1200` at `codex/SKILL.md:160,171`; active mistake `codex-exec-timeout-exceeds-bash-cap` documents the kill. Unchanged. |

Note: the `.claude/{hooks,scripts}` link-depth bug overlaps D2-017 / D2-022 by LOCATION but is RETAINED
as the new D6-001 under the deployment-path-integrity lens (the targets are install-flow hooks + the
agents reconciler) — it is a fix-queue entry above, not a D2-only overlap.

## Suggested approach

Run as a future scoped session: pick up this backlog, settle the **2 manager-decision items (D6-006
version policy, D6-001 severity)** with the user first, then frame the chosen subset and run gobbi's
normal Ideation→Planning→Execution loops. The two High fix-pairs (D6-001+D6-005 docs/gate;
D6-002+D6-003+D6-004 install-validation guards) carry the deployment-readiness risk and should lead;
D6-004 should land alongside the D2-010 / D2-015 / D2-032 `.claude/skills` mirror fixes (shared root
cause). A future fix campaign should reconcile this queue against the cycle-1
(`fix-d7-d1-review-findings`), cycle-2 (`fix-d3-d5-review-findings`), D2 (`fix-d2-review-findings`),
and D4 (`fix-d4-review-findings`) backlogs — the `.claude/skills` mirror root cause (D2-015) is the
single highest-leverage fix, closing D2-010/030/031/032 + D6-004 at once. Read the review artifact for
the per-finding evidence and exact file locations before editing. The user decides scope and priority
at pick-up.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-29-5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf-d6/`

## Related

- [[gobbi-adversarial-review-d6]] — the source-of-record reviews artifact (all 7 findings + D6.1–D6.9 state table + cross-system divergence)
- [[d6-adversarial-review-executed]] — the session journal
- [[fix-d2-review-findings]] — the D2 fix-backlog that owns the 4 cross-dimension overlaps above (D2-010, D2-013, D2-015, D2-031, D2-032)
- [[review-campaign-complete]] — the campaign-completion handoff (all 7 dimensions done)
- [[run-deep-adversarial-review]] — the standing review backlog this slice executes against
