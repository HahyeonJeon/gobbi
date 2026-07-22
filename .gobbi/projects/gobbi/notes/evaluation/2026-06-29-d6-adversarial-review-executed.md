---
name: d6-adversarial-review-executed
description: "Ran the D6 (plugin deployment-readiness) dual-system adversarial review — 16 raw → 7 new findings, review-only → backlog; completes the 7-dimension charter."
type: notes
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation, process]
keywords: [adversarial-review, d6, dual-system, background-codex, review-only, plugin-deployment, charter-complete]
author: claude
features_touched: []
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [2026-06-29-gobbi-adversarial-review-d6, fix-d6-review-findings, 2026-06-29-review-campaign-complete]
---

# D6 adversarial review executed — plugin deployment readiness

## What happened

This session ran **D6** of the gobbi adversarial-review charter — plugin deployment readiness across
the plugin + runtime-mirror surface: manifests, version cadence, runtime-mirror parity, packaged
hooks, install validation, marketplace, and documented `codex exec` budgets. **Auto mode, review-only,
dual-system.** D6 is the **seventh and final** dimension — this pass completes the charter's review
phase.

The method matched the prior cycles: an independent Claude reviewer (a `leader` subagent, read-only
intent) plus an independent background `codex exec --sandbox read-only` reviewer, reconciled at MERGE
by **pessimistic union** (a finding survives if either system raised it; conservative score, max
severity, divergences preserved).

**SINGLE bounded pass — no sub-chunk.** Unlike D2 and D4 (whole-surface passes that needed the 6-chunk
budget split), D6 is **bounded** (plugin / mirror parity) and **command-verifiable** — a `find -L` /
`test -e` / `readlink -f` / `jq` pass, not a prose-density read. So it ran as **one focused pass per
system**: 1 Claude reviewer + 1 Codex reviewer = **2 partial-finding files**, no chunking.

**16 raw → 7 new.** Claude raised 9 (`CD6-01…09`), Codex raised 7 (`CD6-01…07`) — both numbered
`CD6-NN` independently over DIFFERENT finding sets, so the merge reconciled by location + claim, not by
number. The merge dropped **8 raw (4 pairs) as already-covered-by-D2** (the mirror + timeout seeds);
the remaining 8 raw consolidated to **7 new D6 findings** (stably ID'd `D6-001…D6-007`, ordered
Severity then system): **Critical 0 · High 4 · Medium 2 · Low 1.** **1 finding is cross-system-
corroborated** (D6-001); 6 are single-system (2 codex-only, 4 claude-only).

**4 D2-overlaps dropped (cross-dimension dedup).** D6.4/D6.5/D6.6(mirror)/D6.9 confirm known D2 seeds
(D2-010 coding-missing, D2-032 scripts-gap, D2-031/D2-032 mirror-read-refs, root D2-015, D2-013
codex-timeout). All were re-verified unchanged as of 2026-06-29 and route to the D2 fix-backlog — NOT
re-filed under D6. The `.claude/{hooks,scripts}` link-depth bug overlaps D2-017/D2-022 by location but
is RETAINED as the new D6-001 under the deployment-path-integrity lens.

Execution EVALUATION verdicted on the consolidated merge. Review-only meant all 7 dispositions
originally stayed `open` and routed to
`archive/backlogs/evaluation/2026-07-21-fix-d6-review-findings.md`; no source was edited in that
review session. The later workflow redesign addressed or invalidated six items and split the surviving
D6-006 policy question to `backlogs/tooling/plugin-version-cadence-policy.md`.

## What shipped

- `reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d6.md` — the consolidated 7-finding
  source of record (+ the D6.1–D6.9 state-verification table, cross-system divergence, and the
  `## Already covered by D2` cross-dimension dedup).
- `archive/backlogs/evaluation/2026-07-21-fix-d6-review-findings.md` — the complete historical fix
  queue, closed after the redesign addressed or invalidated six items and split D6-006.
- `notes/process/2026-06-29-review-campaign-complete.md` — the CAMPAIGN-COMPLETION handoff (all 7
  dimensions done; the next phase is FIX sessions, not more review).

## What got stuck

Nothing blocked. **The absolute-path discipline held again — no misroute.** This cycle reused the D2
prevention (every write target in every brief pasted as a fully-expanded absolute worktree path, no
`WT/` placeholder, the manager verifying each artifact at the EXACT worktree path after the subagent
returned), and all reviewer files landed in the worktree on the first pass. The background-Codex
exit-code unreliability was handled as documented — the `-o` output artifact was validated by `test -s`
+ a finding marker, never by the (always `-1`/"unknown") detached exit code.

## What shifted

The **key outcome is positive**: **D6.1 PASSES — install is NOT broken.** The Claude plugin manifest
is correctly metadata-only (no `skills`/`agents`/`hooks` keys —
`jq 'has("skills") or has("agents") or has("hooks")'` → `false`), which is the correct shape; the
earlier worry that the metadata-only manifest broke install is resolved. The 7 open defects are
deployment-readiness gaps (guard false-greens, docs link-depth, validator coverage, version cadence),
not install-blockers.

The **anti-groupthink signal was strong** — the two systems found largely DIFFERENT deployment
defects, which is exactly the value the dual-system method exists to produce:

- **Codex's distinctive lens — install-validation coverage.** Codex surfaced two validator-script
  gaps Claude missed: D6-002 (the fire-once validator ignores the packaged `SessionEnd` hook — 4
  packaged, 3 checked) and D6-003 (the installed-cache allow-set rejects the shared package's
  `.codex-plugin`). Both are defects inside the install-validation scripts.
- **Claude's distinctive lens — guard false-greens, version cadence, canonical link-depth.** Claude
  surfaced D6-004 (`sync-plugin-package.sh --check` false-green — exit 0 while `.claude/skills` is
  missing `coding` + all `scripts/`), D6-005 (the cited `check-markdown-links.sh` gate is non-zero and
  not in the pre-publish gate), D6-006 (version frozen at `0.5.0`), and D6-007 (the codex-hooks
  matcher smell).
- **Corroborated (the strongest signal): D6-001** — both systems landed on the same `.claude/{hooks,scripts}`
  link-depth locations (orchestration:108, delegation:309) with conf 100, but split on severity:
  **Claude = Critical, Codex = High** (reconciled to High; D2 rated the identical off-by-one Medium).

## Decisions to respect

- The charter is **review-only** — no finding is fixed in a review session; fixes are separate sessions.
- Findings are reconciled by **pessimistic union** with cross-system divergence preserved, never averaged.
- **Two manager-decision items gate the D6 fix** — D6-006 (version cadence is a user policy decision)
  and D6-001 (the Claude=Critical/Codex=High severity split needs manager adjudication).
- **Cross-dimension dedup is permanent** — the 4 D2-overlaps are fixed through the D2 fix-backlog,
  never re-filed under D6.
- **D6.1 is settled PASS** — the metadata-only Claude manifest is correct; install is not broken.

## Top gaps (triangulated)

- **Install-validation guard coverage (D6.7/D6.8), the High cluster.** Three cited guards each have a
  coverage hole — the fire-once validator skips `SessionEnd` (D6-002), the installed-cache allow-set
  rejects `.codex-plugin` (D6-003), and `sync-plugin-package.sh --check` false-greens over the whole
  `.claude/skills` mirror (D6-004). A guard that exits 0 while the drift it should catch is live is
  worse than no guard.
- **The `.claude/skills` mirror root cause (D2-015), reconfirmed.** D6-004 + the four D2-covered
  points all trace to one root: `.claude/skills` is unmanaged by `sync-plugin-package.sh` and
  unvalidated by `--check`. Fixing D2-015 closes D2-010/030/031/032 + D6-004 at once — the single
  highest-leverage deployment fix.
- **Docs link-depth + gate enforcement (D6.6).** The canonical `.claude/{hooks,scripts}` links are
  off-by-one `../` (D6-001) and the run-to-zero `check-markdown-links.sh` gate that should have caught
  them is itself non-zero and not in the pre-publish gate (D6-005). Fix the links, then wire the gate.
- **Version cadence (D6.3).** The frozen `0.5.0` across many content PRs means `claude plugin update`
  delivers nothing — a deployment-update defect with the same installer-facing effect as a SHA pin,
  pending the user's version-policy decision (D6-006).

## Next session

**The charter's review phase is COMPLETE — all 7 dimensions reviewed** (D7+D1, D3+D5, D2, D4, and now
D6). The later workflow redesign addressed the D6 link, mirror, and hook items. The historical queue
now lives at `archive/backlogs/evaluation/2026-07-21-fix-d6-review-findings.md`; its only surviving
policy question is `backlogs/tooling/plugin-version-cadence-policy.md`. Other review-campaign
backlogs retain their own current lifecycle and must be checked directly before pickup.

## Related

- [[gobbi-adversarial-review-d6]] — the reviews artifact this session produced
- [[fix-d6-review-findings]] — the fix queue
- [[plugin-version-cadence-policy]] — the surviving D6-006 policy question
- [[review-campaign-complete]] — the campaign-completion handoff (all 7 dimensions done)
- [[gobbi-adversarial-review-d2]] — the prior-dimension review whose mirror + timeout seeds D6 dedups against
- [[adversarial-review-charter-authored]] — the charter
