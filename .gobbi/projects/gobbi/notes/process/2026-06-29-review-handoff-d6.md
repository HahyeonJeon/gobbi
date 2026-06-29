---
name: review-handoff-d6
description: "Next-session handoff for the gobbi charter review — D6 is the SOLE remaining dimension (6 of 7 done); D6 scope, the proven recipe, seeds, and mistakes to reuse."
type: notes
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [process, evaluation]
keywords: [adversarial-review, handoff, d6, charter, dual-system, background-codex]
author: claude
features_touched: []
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [review-handoff-d6]
---

# Review handoff — D6 is the sole remaining dimension

## What happened

This session shipped **D4** (naming / conventions / counts / doc-style / quality) of the gobbi
adversarial-review charter — dual-system, review-only — see
`notes/evaluation/2026-06-29-d4-adversarial-review-executed.md` and the review artifact
`reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d4.md` (46 findings:
Critical 0 / High 7 / Medium 20 / Low 19). This note is the forward handoff: D6 is the only dimension
left, and how to run it.

**Cross-session progress: 6 of 7 dimensions done.** D7 + D1 (cycle 1, 40 findings), D3 + D5 (cycle 2,
29 findings), D2 (40 findings), and D4 (46 findings) have all shipped. **Only D6 remains** — D4 is removed
from the queue.

## What shipped

Nothing in this note's own right beyond the handoff record. The D4 deliverables are the review artifact +
`backlogs/evaluation/fix-d4-review-findings.md` + the journal listed above.

## What got stuck

One of the seven charter dimensions remains unreviewed: **D6.** It was out of scope for D4 and is queued
below, not blocked.

## Decisions to respect

- **Review-only charter.** Each dimension pass stages findings; it never edits source. Findings route to a
  fix-backlog for the user's scope+priority decision.
- **Dual-system per dimension.** Run an independent Claude review and an independent Codex review, then
  reconcile by pessimistic union (a finding survives if either system raised it; conservative score + max
  severity win). This is the charter's anti-groupthink method — keep it.
- **Budget-split rule.** A whole-surface pass does NOT fit one ≤ ~60K-word chunk — it needs ~6 chunks, not 4.
  But D6 is **bounded** (plugin/mirror parity), so it need NOT be a whole-surface 6-chunk pass — one focused
  session covers it.

## D6 — the sole remaining dimension: scope + how to run

**D6 — plugin / mirror deployment readiness.** Bounded (NOT whole-surface) and **command-verifiable**: it
checks that the three runtime mirrors (`.claude/`, `.agents/`, `plugins/gobbi/`) and the plugin-manifest /
install-path surface are consistent and deployable. This is a `find -L` / `test -e` / `readlink -f` pass, not
a prose-density read — most findings are mechanically checkable.

**D6 should treat D2's mirror findings as instance-1 — the proven recipe.** D2 already confirmed D6's central
root cause and one of its instances, so D6 reconciles against these rather than re-discovering them:

- **D2-015 (the ROOT CAUSE, instance-1).** The `.claude/skills` per-file mirror is unmanaged by
  `sync-plugin-package.sh` and unvalidated by `--check` (the script exits 0 while `.claude/skills/coding` is
  absent). Every other `.claude/skills` gap is a symptom of this asymmetric mirror. D6 starts here — confirm
  the root, then sweep for any remaining symptom the gap allows.
- **D2-010 (the `.claude/skills/coding` gap, instance-1).** `.claude/skills/coding/` is entirely absent while
  `.agents/skills/coding/` and `plugins/gobbi/skills/coding/` both exist (mirror count 21 of 22). Treat as
  KNOWN — D6 reconciles against it, does not re-file.
- Also KNOWN from D2: D2-030/031 (missing `.claude` child docs — `gobbi/hook-authoring.md`,
  `memory/memory-vocabulary.json`), and D2-032 (missing scripts — the divergent "mirror docs, not scripts"
  question). D6 reconciles against these and covers the **plugin-manifest / install-path surface D2 did not**.

**Use `find -L`, never plain `find`.** The cycle-0 mistake `find-misses-symlinked-mirror-dirs` applies: plain
`find` misses whole-dir symlinks in the `.claude/` / `.agents/` mirrors — always dereference with
`find -L` / `readlink -f` / `test -e`.

## The proven dual-system recipe (reuse verbatim)

- **Claude half** — a `leader` subagent, adversarial-review discipline, read-only intent, writes its findings
  file to a **fully-expanded absolute** worktree path (NOT a `WT/` placeholder — see the mistake below),
  returns STATUS + 1-line-per-finding + the cross-chunk index.
- **Codex half** — background `codex exec --sandbox read-only --cd <WT> -o <abs-out> "$(cat prompt)" < /dev/null`,
  `run_in_background: true`. Validate the `-o` file (`test -s` + a finding marker), **NOT** the exit code
  (detached runs report `-1`/"unknown" even on success).
- **MERGE** — reconcile by pessimistic union; assign stable `D6-###` IDs; dedup by location+claim; treat
  confirmed seeds + the D2 mirror findings as instance-1; preserve every divergence as the anti-groupthink
  signal.

## Operational mistakes to reuse with the background-Codex method

1. **Codex background-exec exit-code is unreliable** — verify the `-o` output artifact exists and is
   non-empty before treating the Codex half as complete; do not trust the exit code.
2. **`gh` 2.45 GraphQL gotchas** — prefer the documented REST/`--json` field forms and verify command output
   rather than assuming the GraphQL path succeeded.
3. **Delegation-brief placeholder path misroutes a write (D2).** A `WT/`-prefixed (unexpanded) write path in a
   brief lets a fresh-subagent resolve it against the main-tree CWD and write to the wrong tree. Paste the
   **fully-expanded absolute path** for every write target in every brief — no `WT/` placeholder, no relative
   path — and the manager verifies the artifact at the EXACT worktree path after the subagent returns. **D4
   applied this and had zero misroutes** — the prevention works; keep it for D6.

## Next session

**First step: merge this D4 PR to `develop` BEFORE the next session branches** — until then the D4 findings +
fix-backlog are not on the base branch. Then run **D6** — the only dimension left — as one bounded, focused
session (it need not be a whole-surface 6-chunk pass). Reuse the dual-system + background-Codex recipe and the
`find -L` mirror discipline; reconcile against the D2 mirror findings (D2-015 root, D2-010 instance) rather
than re-discovering them. After D6, all seven dimensions are reviewed — run the fix campaign from the four
fix-backlogs (`fix-d7-d1-…`, `fix-d3-d5-…`, `fix-d2-review-findings`, `fix-d4-review-findings`), settling each
backlog's Always-Ask divergences with the user first.

## Related

- [[gobbi-adversarial-review-d4]] — the D4 review this handoff follows
- [[fix-d4-review-findings]] — the D4 fix-backlog
- [[d4-adversarial-review-executed]] — the D4 session journal
- [[review-handoff-d4-d6]] — the prior (D2) handoff this supersedes for queue state
- [[gobbi-adversarial-review-d2]] — the D2 review whose mirror findings (D2-015 / D2-010) D6 treats as instance-1
- [[run-deep-adversarial-review]] — the parent charter-execution backlog
- [[adversarial-review-charter-authored]] — cycle-0: the charter being executed
