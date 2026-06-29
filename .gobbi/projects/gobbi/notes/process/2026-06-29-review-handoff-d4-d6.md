---
name: review-handoff-d4-d6
description: "Next-session handoff for the gobbi charter review — D4 + D6 remain (D2 done); method, budget-split lesson, seeds, and mistakes to reuse."
type: notes
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [process, evaluation]
keywords: [adversarial-review, handoff, d4, d6, charter, dual-system, background-codex]
author: claude
features_touched: []
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [review-handoff-d4-d6]
---

# Review handoff — D4 + D6 remain

## What happened

This session shipped **D2** (completeness of agents + skills) of the gobbi adversarial-review charter —
dual-system, review-only — see `notes/evaluation/2026-06-29-d2-adversarial-review-executed.md` and the
review artifact `reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d2.md` (40 findings:
Critical 3 / High 13 / Medium 16 / Low 8). This note is the forward handoff: which charter dimensions
remain and how to run them.

**Cross-session progress: 5 of 7 dimensions done.** D7 + D1 (cycle 1, 40 findings) and D3 + D5 (cycle 2,
29 findings) shipped earlier; D2 ships now. **Only D4 + D6 remain** — D2 is removed from the queue.

## What shipped

Nothing in this note's own right beyond the handoff record. The D2 deliverables are the review artifact +
`backlogs/evaluation/fix-d2-review-findings.md` + journal listed above.

## What got stuck

Two of the seven charter dimensions remain unreviewed: **D4, D6.** They were out of scope for D2 and are
queued below, not blocked.

## Decisions to respect

- **Review-only charter.** Each dimension pass stages findings; it never edits source. Findings route to
  a fix-backlog for the user's scope+priority decision.
- **Dual-system per dimension.** Run an independent Claude review and an independent Codex review, then
  reconcile by pessimistic union (a finding survives if either system raised it; conservative score + max
  severity win). This is the charter's anti-groupthink method — keep it.
- **Budget-split rule (D2's lesson).** A whole-surface pass does NOT fit one ≤ ~60K-word chunk. D2 planned
  4 chunks; Pass-0.5 measured 2 of them over budget (89K, 84K) and split each, landing on **6 chunks**.
  Expect the same: measure at Pass-0.5 and sub-chunk every over-budget chunk — a whole-surface pass needs
  ~6 chunks, not 4. Each reviewer also emits a cross-chunk index (load-edges-out / skills-defined /
  counts-claimed / handoff-edges) so the MERGE can compute the GLOBAL view no single chunk sees.

## The proven dual-system recipe (reuse verbatim)

- **Claude half** — a `leader` subagent, adversarial-review discipline, read-only intent, writes its
  findings file to a **fully-expanded absolute** worktree path (NOT a `WT/` placeholder — see the new
  mistake below), returns STATUS + 1-line-per-finding + the cross-chunk index.
- **Codex half** — background `codex exec --sandbox read-only --cd <WT> -o <abs-out> "$(cat prompt)" < /dev/null`,
  `run_in_background: true`. Validate the `-o` file (`test -s` + a finding marker), **NOT** the exit code
  (detached runs report `-1`/"unknown" even on success).
- **MERGE** — reconcile by pessimistic union; assign stable `D{n}-###` IDs; dedup by location+claim;
  treat confirmed seeds as instance-1; preserve every divergence as the anti-groupthink signal.

## Remaining charter dimensions — how to run each

- **D4 — naming / counts consistency.** Whole-surface — SUB-CHUNK it (budget-split rule above), each
  chunk on its OWN FRESH session (the charter's "freshest context" rule — one session cannot hold the
  whole surface without compression risk). One dual-system pass per chunk. **D2 already caught a few
  count drifts** — treat these as KNOWN (do not re-file): D2-019 (EVALUATION-loop-set enumerated 3 ways
  across 4 docs), D2-033 (memory "13 types" vs the canonical 16), the candidate `memory/SKILL.md:24`
  "README + 14 subdirs", and the mirror count 21-vs-22 (D2-010). D4's job is the FULL naming/count sweep
  beyond those.
- **D6 — plugin / mirror parity.** Bounded (not whole-surface). Re-verify charter seeds B / C / D using
  `find -L` (the cycle-0 mistake `find-misses-symlinked-mirror-dirs` — plain `find` misses whole-dir
  symlinks in the `.claude/` / `.agents/` mirrors; always dereference with `find -L` / `readlink -f` /
  `test -e`). One focused session. **D2 already surfaced the mirror cluster** — treat as KNOWN: D2-015
  (the `.claude/skills` sync/`--check` ROOT CAUSE), D2-010 (missing `coding`), D2-030/031 (missing child
  docs), D2-032 (missing scripts — divergent). D6 should reconcile against these rather than re-file, and
  cover the plugin-manifest / install-path surface D2 did not.

## D2 confirmed seeds — treat as INSTANCE-1 for D4 / D6 (do not re-report; sweep for siblings)

1. `skills/claude/SKILL.md` dangling reference (`.claude/CLAUDE.md` nav-table + `gobbi/SKILL.md:192` FLAG-2).
2. `delegation/SKILL.md` broken link (from `workflow/wrap-up.md:17` + `execution.md:17`).
3. `Ideation → Preparation` handoff gap (the dead-end-handoff class — D2 generalized it to Prep→Planning,
   Planning→Execution, Execution→Wrap-up, Execution-EVAL→coding).
4. research↔ideation `staging/references/` ownership contradiction
   (`mistakes/docs-sync/research-ideation-reference-staging-conflict.md`); D2-012 added the research↔**Preparation**
   second instance — treat BOTH as known.

## Cycle context to carry forward

- **Where the findings live.** Cycle-1 (D7+D1) findings are on PR #323; cycle-2 (D3+D5) on its PR; D2 on
  **this** PR. Each fix-backlog (`fix-d7-d1-…`, `fix-d3-d5-…`, `fix-d2-review-findings`) lands on `develop`
  only when its PR merges.
- **Operational mistakes to reuse with the background-Codex method:**
  1. **Codex background-exec exit-code is unreliable** — verify the `-o` output artifact exists and is
     non-empty before treating the Codex half as complete; do not trust the exit code.
  2. **`gh` 2.45 GraphQL gotchas** — prefer the documented REST/`--json` field forms and verify command
     output rather than assuming the GraphQL path succeeded.
  3. **NEW (D2) — delegation-brief placeholder path misroutes a write.** A `WT/`-prefixed (unexpanded)
     write path in a brief let the C3a Claude reviewer resolve it against the fresh-subagent main-tree CWD
     and write to the wrong tree. Paste the **fully-expanded absolute path** for every write target in
     every brief — no `WT/` placeholder, no relative path — and the manager verifies the artifact at the
     EXACT worktree path after the subagent returns (never trust the reported ARTIFACT path). This
     mistake-candidate is routed to a mistake home by the manager separately.

## Next session

**First step: merge this D2 PR to `develop` BEFORE the next session branches** — until then the D2
findings + fix-backlog are not on the base branch. Then pick the next charter dimension. Recommended
order: **D6 first** (bounded, one session), then **D4** (sub-chunked across fresh sessions). Reuse the
dual-system + background-Codex recipe, the budget-split rule, and the three operational mistakes above.
After all dimensions are reviewed, run the fix campaign from the three fix-backlogs (settle each
backlog's Always-Ask divergences with the user first).

## Related

- [[gobbi-adversarial-review-d2]] — the D2 review this handoff follows
- [[fix-d2-review-findings]] — the D2 fix-backlog
- [[d2-adversarial-review-executed]] — the D2 session journal
- [[review-handoff-d2-d4-d6]] — the prior (cycle-2) handoff this supersedes for queue state
- [[run-deep-adversarial-review]] — the parent charter-execution backlog
- [[adversarial-review-charter-authored]] — cycle-0: the charter being executed
