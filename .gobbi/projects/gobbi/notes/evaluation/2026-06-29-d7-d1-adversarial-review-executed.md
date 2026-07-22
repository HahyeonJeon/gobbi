---
name: d7-d1-adversarial-review-executed
description: "Ran the D7+D1 dual-system adversarial review slice — 40 findings, review-only → backlog."
type: notes
scope: project
feature: null
status: active
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea
tags: [evaluation, process]
keywords: [adversarial-review, d7, d1, dual-system, background-codex, review-only]
author: claude
features_touched: []
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [2026-06-29-gobbi-adversarial-review, fix-d7-d1-review-findings, peer-cli-completion-requires-validated-structured-output, gh-2-45-graphql-projects-classic-and-closingissues, coding-as-value-feature-taxonomy-question, 2026-06-29-review-handoff-next-session]
---

# D7 + D1 adversarial review executed

## What happened

The session opened by merging the charter PR **#322** (squash `b5a26bb2`) to develop, then branched
off develop for this review slice. The user configured **Auto mode**. Ideation locked this session's
scope as a slice of the charter (Decisions 1-5): **review-only**, two dimensions —
**D7** (live-session UX) and **D1** (E2E lifecycle + S1-S7 scenarios, S5 staleness centerpiece) —
plus a shared **Pass 0.5 inventory + relevance map**. Preparation and Planning ran as focused
single-mode readiness/sequencing passes (the charter pre-supplied design + plan). Execution sliced
the work into Inventory + D7 + D1, ran **dual-system per pass** (an independent Claude reviewer and a
background `codex exec` Codex reviewer), and the manager reconciled each pass by **pessimistic
union**. D7 ran one pass (8 reconciled findings); D1 was sub-chunked A / B + S5, then merged (32
reconciled findings). Total: **40 findings**. Execution EVALUATION adversarially re-verified the 4
Codex-only High findings and reconciled their severities; verdict PASS. Review-only → all findings
routed to a fix-backlog, not fixed.

## What shipped

- `reviews/adversarial-review/2026-06-29-gobbi-adversarial-review.md` — the consolidated 40-finding source of record.
- `backlogs/evaluation/fix-d7-d1-review-findings.md` — the deferred fix queue.
- `mistakes/codex/peer-cli-completion-requires-validated-structured-output.md` — background-codex exit-code discipline.
- `mistakes/tooling/gh-2-45-graphql-projects-classic-and-closingissues.md` — gh 2.45.0 REST-vs-porcelain workaround (merges the prior session's uncaptured tooling note).
- `backlogs/process/coding-as-value-feature-taxonomy-question.md` — D2 review item (prior session's uncaptured note).
- `notes/process/2026-06-29-review-handoff-next-session.md` — the next-session handoff.

## What got stuck

Nothing blocked. The one operational friction was the background `codex exec` exit-code unreliability
(it reports `-1` even on success) — handled by validating the `-o` output file instead of the exit
code; captured as a durable mistake. The in-chat live task list was lost on an MCP reconnect (it is
not state.json-backed), which became live corroboration for D7-R6/R8.

## What shifted

The 4 Codex-only High findings were re-verified at Execution EVALUATION and reconciled: D1-003
High→Medium, D1-004 High→Low (Codex over-rated a documented sanctioned exception), D1-007 High→Medium
(confirmed real broken link), D1-009 High→Medium (confirmed real template gap). Post-verification D1
tally: Critical 2 / High 5 / Medium 18 / Low 7. The dual-system method validated itself: 2 real
Codex-only bugs Claude passed (D1-007, D1-009) confirmed; 1 over-rating corrected.

## Decisions to respect

- The charter is **review-only** — no finding is fixed in a review session; fixes are separate
  Execution sessions.
- The S5 re-sync ("Discover Standards" pass) is a **SUGGESTED future direction**, never a deliverable
  of this charter.
- Findings are reconciled by **pessimistic union** with cross-system divergence preserved, never
  averaged.

## Next session

Continue the charter: run **D2 / D3 / D4 / D5 / D6** (D7+D1 are done). React to the fix queue in
`backlogs/evaluation/fix-d7-d1-review-findings.md` in a scoped Execution/design session. Reuse the
dual-system + background-codex method that worked this session.

## Related

- [[gobbi-adversarial-review]] — the reviews artifact this session produced
- [[fix-d7-d1-review-findings]] — the fix queue
- [[review-handoff-next-session]] — the handoff
- [[adversarial-review-charter-authored]] — the charter
