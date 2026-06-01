---
name: hook-event-count-and-residue-closure
description: "Resolved two guardrails backlogs: corrected the hook-event count claim (31→30, re-verified live), confirmed PostToolUseFailure verbatim quotes; archived 4 resolved tracking items; promoted 2 project mistakes; also closed the principles anti-rationalizations residue backlog (shipped in PR #285)."
type: notes
scope: project
feature: null
status: active
created: 2026-06-01
session: 34563fb4-361d-4348-aa75-8bc9f1fbff05
tags: [guardrails, hooks, docs-sync, principles, archive, mistakes]
features_touched: [guardrails]
loops_completed: [ideation, execution, wrap-up]
shipped: [
  "mistakes/codex-webfetch-undercounts-recently-added-table-row.md",
  "mistakes/docs-sync-count-fix-blast-radius-includes-colocated-dates-and-tracking-pointers.md",
  "archive/backlogs/2026-06-01-hook-event-count-31-vs-29-docs-sync.md",
  "archive/backlogs/2026-06-01-posttooluse-failure-webfetch-verification-gap.md",
  "archive/backlogs/2026-06-01-principles-anti-rationalizations-label-residue.md",
  "archive/checklists/2026-06-01-hook-event-count-31-vs-29-docs-sync.md"
]
---

# Hook event count correction and residue closure (2026-06-01)

## What happened

This session was a Chat-mode docs-sync session targeting two guardrails backlogs plus one out-of-scope residue item.

**Hook-event count (31→30 correction).** The guardrails reference file `features/guardrails/references/claude-code-posttooluse-hook-schema.md` carried a "31 hook events" claim. The Ideation phase ran WebFetch of `https://code.claude.com/docs/en/hooks` to re-verify the live count. The session leader's WebFetch returned 30 events — one more than the "29" the earlier backlog had assumed as the correction target. The discrepancy was traced to `MessageDisplay`, a newly-added event at position 12 (between Notification and SubagentStart), which was not present in the 2026-05-23 capture that produced the "29" baseline. A Codex `codex exec` web-search independently returned 29, disagreeing by one. The tiebreaker was a raw-HTML parse (curl + Python row-count of the lifecycle `<table>`), which confirmed 30 rows. This tie-breaking method — raw HTML over LLM-summarized counts — is now recorded as a project mistake.

Execution iter1 (commit 84521bc) corrected the reference file: the "31" claim updated to "30", the full enumeration updated to include `MessageDisplay`, and the frontmatter `accessed:` date refreshed to 2026-06-01. The dual-system evaluator (Codex) caught that the body `## Source` access-date still read "Both accessed 2026-05-23" and the README open-item bullet + tracking backlog/checklist were not co-updated (Principle 13 blast-radius miss). The Claude evaluator caught the README tracking pointer issue. Both evaluators returned REVISE. Iter2 remediation (commit 5427e9d) fixed the `## Source` date, removed the README open-item bullet, added a `## Recent activity` row to the README, and updated both the backlog and checklist with Resolution sections and `status: addressed` / `disposition: addressed`.

**PostToolUseFailure verbatim quote re-verification.** The session simultaneously re-verified the two preserved verbatim quotes in the same reference file (`| PostToolUseFailure | After a tool call fails |` from the lifecycle table, and `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |` from the exit-code-behavior table). Both were confirmed byte-identical to the live page via Claude WebFetch, Codex, and raw-HTML extraction. The verification-gap backlog was resolved and its Resolution section appended in iter2.

**Principles anti-rationalizations residue.** This backlog (created session a30b7a6e) tracked cosmetic label-consistency residue in `principles/SKILL.md` where "Anti-rationalizations" still appeared after the 4-field redesign renamed the field to "Anti-pattern". PR #285 (commit `9bae55f`) cleared it. Verified this session via grep (0 matches). Backlog flipped to `status: addressed` + `disposition: addressed`, Resolution section added, and archived at Wrap-up.

## What shipped

Execution commits:
- `84521bc` — corrected event count 31→30, updated enumeration, refreshed access date
- `5427e9d` — iter2 remediation: Source date, README open-item removal, README recent-activity row, backlog/checklist Resolution sections

Wrap-up promotions (commit: see Wrap-up commit hash):
- `mistakes/codex-webfetch-undercounts-recently-added-table-row.md` — new project mistake (LLM count arbitration unreliable; raw HTML is the tiebreaker)
- `mistakes/docs-sync-count-fix-blast-radius-includes-colocated-dates-and-tracking-pointers.md` — new project mistake (P13 blast radius must include body Source dates + tracking-pointer docs)
- `archive/backlogs/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` — archived (was `features/guardrails/backlogs/`)
- `archive/backlogs/2026-06-01-posttooluse-failure-webfetch-verification-gap.md` — archived (was `features/guardrails/backlogs/`)
- `archive/backlogs/2026-06-01-principles-anti-rationalizations-label-residue.md` — archived (was `features/guardrails/backlogs/`)
- `archive/checklists/2026-06-01-hook-event-count-31-vs-29-docs-sync.md` — archived (was `features/guardrails/checklists/`); `archive/checklists/` dir created

Reference inbound pointers in `features/guardrails/references/claude-code-posttooluse-hook-schema.md` (lines 35-36) repointed to archive paths.

## What got stuck

None. Both primary backlogs and the residue item were fully resolved and archived. The `goodhart-factor-when-demanded-deferred.md` backlog and `cross-layer-drift-gate.md` checklist remain active and were not touched.

The `claude-code-hooks-12-lifecycle-events.md` reference doc in `features/guardrails/references/` was not reviewed this session — it may drift similarly when the hooks page changes. Flagged as a possible future drift check (not a blocking issue).

## What shifted

The correction target shifted mid-session: the pre-existing backlogs assumed "29" as the correct count, but live re-verification landed on 30 (MessageDisplay was added to the official docs page after the 2026-05-23 capture). The entire correction arc was therefore 31→30, not 31→29.

The dual-system REVISE verdict (both Codex and Claude flagging different aspects of the iter1 blast-radius miss) demonstrated the Principle 13 gap now recorded as a project mistake: count/date corrections must check for co-located duplicate values in the same document and for pointer docs that track the corrected claim.

## Decisions to respect

- Raw HTML (`curl -sL + <tr>` parse) is the authoritative tiebreaker when LLM-mediated fetch counts disagree. Do not re-arbitrate based on LLM-summarized counts.
- Wrap-up is the sole writer to `archive/` — archive moves are not done during Execution even when the files are "obviously done". The executor correctly deferred the git mv to this Wrap-up.
- Both new project mistakes (codex-webfetch and docs-sync-blast-radius) are load-bearing in the domain `docs-sync` — load them when working on any future docs-sync correction.

## Next session

No open threads from this session. The `goodhart-factor-when-demanded-deferred.md` backlog in `features/guardrails/backlogs/` remains active but was not triggered this session. The plugins-snapshot-resync backlog (out of this session's scope, deferred due to concurrent PR #282) also remains open.
