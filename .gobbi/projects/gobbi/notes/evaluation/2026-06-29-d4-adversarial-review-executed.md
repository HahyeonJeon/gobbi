---
name: d4-adversarial-review-executed
description: "Ran the D4 (naming / conventions / counts / doc-style) dual-system adversarial review — 85 raw → 46 findings, review-only → backlog."
type: notes
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation, process]
keywords: [adversarial-review, d4, dual-system, background-codex, review-only, term-consistency, count-drift]
author: claude
features_touched: []
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [2026-06-29-gobbi-adversarial-review-d4, fix-d4-review-findings, 2026-06-29-review-handoff-d6]
---

# D4 adversarial review executed — naming / conventions / counts / doc-style

## What happened

This session ran **D4** of the gobbi adversarial-review charter — naming, term/Glossary consistency,
self-reported counts, doc-style uniformity, doc↔path resolution, and dev-doc quality across the agent +
skill surface. **Auto mode, review-only, dual-system.**

The method matched the prior cycles (and reused D2's chunk plan): an independent Claude reviewer (a
`leader` subagent, read-only intent) plus an independent background `codex exec --sandbox read-only`
reviewer per chunk, reconciled at MERGE by **pessimistic union** (a finding survives if either system
raised it; conservative score, max severity, divergences preserved). D4 is a whole-surface pass, so it was
**sub-chunked**.

**6 chunks reused from D2.** D4 reused the same six budget-sized chunks D2 settled (the budget-split rule:
a whole-surface pass needs ~6 chunks, not 4): C1a (orchestration entry + state machine), C1b (the 5 loop
skills), C2 (cross-cutting skills), C3a (memory + coding), C3b (supporting/meta skills), C4 (agent roster +
mirrors). No re-measurement was needed — D2's Pass-0.5 already proved the split.

**12 reviewers + merge.** Six chunks × two systems = **12 partial-finding files** (Claude 37 raw findings,
Codex 48 raw = **85 raw**). Each reviewer also emitted a cross-chunk index (terms-used / counts-claimed /
path-refs / Glossary-tokens) so the MERGE could compute the GLOBAL term-consistency + count-drift view no
single chunk sees. The merge reconciled **85 raw → 46 consolidated** findings (de-duplicated by location +
claim, stably ID'd D4-001…D4-046, ordered Severity then chunk): **Critical 0 · High 7 · Medium 20 · Low 19.**
**7 findings are cross-system-corroborated**; 39 are single-system (21 codex-only, 18 claude-only).

**10 D2-overlaps dropped (cross-dimension dedup).** D4.8 (doc↔path) overlaps D2.3 most, so 10 candidate
defects (15 raw partials) that target the SAME defect at the SAME location already filed in the merged D2
review were NOT re-filed as D4 findings — they stay on the D2 fix-backlog (the delegation broken-link seed,
D2-023, D2-024, D2-026, D2-009, D2-037, D2-038, D2-010, D2-014, D2-006). The confirmed doc-style/count seeds
(claude-plugin 22-vs-19, memory 13-vs-16, the Preparation-dropped pattern, `loop's→loop.s`, anchor-drift, the
`.claude`-depth links, the delegation broken-link seed) are likewise instance-1 and not re-filed.

Execution EVALUATION verdicted REVISE then PASS on the consolidated merge. Review-only → all 46 dispositions
stay `open` and route to the fix-backlog; no source was edited.

## What shipped

- `reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d4.md` — the consolidated 46-finding source
  of record (+ global term-consistency + count-drift reconciliation, cross-system divergence, the
  `## Already covered by D2` cross-dimension dedup, and confirmed-seed siblings).
- `backlogs/evaluation/fix-d4-review-findings.md` — the deferred fix queue (clustered: term-consistency,
  count-drift, optional-vs-mandatory, doc-style, stale-CLI/toolchain-refs, doc↔path; the 1 Always-Ask
  divergence called out).
- `notes/process/2026-06-29-review-handoff-d6.md` — the next-session handoff (D6 is the SOLE remaining dimension).

## What got stuck

Nothing blocked. **The absolute-path fix held this cycle — no misroute.** D2's notable operational incident
was a main-tree write misroute (the C3a Claude reviewer resolved an unexpanded `WT/` placeholder against the
fresh-subagent main-tree CWD and wrote its findings file to the wrong tree). This cycle applied the D2
prevention — every write target in every brief was pasted as a **fully-expanded absolute** worktree path (no
`WT/` placeholder, no relative path), and the manager verified each artifact at the EXACT worktree path after
the subagent returned (never trusting the reported ARTIFACT path). All 12 reviewer files landed in the
worktree on the first pass; the merge inputs were complete with no recovery step. The D2 mistake-candidate
(`delegation-brief-placeholder-path-misroutes-write`) did its job.

## What shifted

The clearest signal was the **one substantive divergence — the repo-root-vs-doc-relative path convention
(D4-002)**: Codex rated ~15 docs' bare `.claude/`/`.agents/`/`.codex/`/`plugins/`/`scripts/` references a real
per-doc D4.8 defect (they fail a doc-local `test -e`), while Claude classified the same behavior as by-design
mirror-build behavior (consumers `readlink` to canonical first). Either way the fix is to DECLARE the
path-resolution convention once. It is the highest-leverage adjudication in D4 and gates the whole doc↔path
cluster.

The other notable split was complementary, not opposite (D4-008): both systems flagged the pre-rename `MEMO`
token, but Claude additionally caught the loop-STATE synonym `InProgress` and Codex additionally caught the
phase-slot values `ITER/EXIT`/`PLAN_DRAFT`/`EXECUTION`/`WRAPUP` — same root, complementary coverage.

## Decisions to respect

- The charter is **review-only** — no finding is fixed in a review session; fixes are separate sessions.
- Findings are reconciled by **pessimistic union** with cross-system divergence preserved, never averaged.
- **D4-002 is the gating Always-Ask** — the path-resolution convention is a user-decision at fix time; the
  fix direction differs by verdict, so it must not be auto-resolved.
- **Cross-dimension dedup is permanent** — the 10 D2-overlaps are fixed through the D2 fix-backlog, never
  re-filed under D4.
- **Confirmed seeds are instance-1 and not re-filed** — the D4 findings are their siblings.

## Top gaps (triangulated)

- **Term / Glossary drift (D4.2/D4.3), the largest cluster.** Non-canonical tokens fill canonical slots —
  `InProgress`/`MEMO`/`EVAL` for states/sub-phases (D4-008), "phase" for the four sub-phases across all 5 loop
  skills (D4-011, corroborated), `still open` / `Planner` / `Wrap-Up` / `research`-as-phase (D4-013/014/015/016),
  and the assistant mislabeled "Read-only" though it is the sole memory writer (D4-025, corroborated). The
  repo's own `check-residual-vocab.sh` matches the longer `MEMORIZATION`, so the shorter `MEMO` slips past — a
  gate gap worth closing alongside.
- **Stale CLI / toolchain references (D4.8).** Two agent docs point at machinery that does not exist in this
  markdown/skills tree — a `gobbi workflow init` CLI (D4-026, contradicting the no-CLI model) and a
  TypeScript/Bun codebase (`packages/cli/`, `bun test`, "2197/0" — D4-027). Both are leftovers from the
  earlier CLI-era project shape.
- **Count drift (D4.4).** Twelve self-reported counts no longer match the live surface — sub-step counts
  (D4-028), agent-class counts (D4-029), hook line counts (D4-031), Configuration rows (D4-032), feature
  subdir counts (D4-041), continuable-role counts (D4-045), and the eval mandatory/optional/skip policy framed
  five different ways (D4-001, corroborated). The same "a number drifted from its table" class D2 and cycle-1
  both found.
- **Intra-doc instruction contradictions (D4.5), the obeyability bugs.** The 7 Highs concentrate here: the
  evaluator told both to cover and not cover multiple perspectives (D4-004), three incompatible mistake-capture
  timings (D4-005), "exactly three frontmatter keys" vs the procedure's optional fields (D4-006), and stale
  `git -C` line anchors (D4-007). These are not cosmetic — a literal reader cannot satisfy both instructions.

## Next session

Continue the charter: **D6 is the SOLE remaining dimension — 6 of 7 done** (D7+D1, D3+D5, D2, and now D4). See
`notes/process/2026-06-29-review-handoff-d6.md`. React to the fix queue in
`backlogs/evaluation/fix-d4-review-findings.md` in a scoped Execution/design session — settle the D4-002
Always-Ask divergence first. Reuse the dual-system + background-codex method and the 6-chunk plan (whole-surface
passes need 6 chunks, not 4) — though D6 is bounded (plugin/mirror parity) and need not be a whole-surface
6-chunk pass. **Merge this D4 PR before the next session branches** so the findings land on `develop`.

## Related

- [[gobbi-adversarial-review-d4]] — the reviews artifact this session produced
- [[fix-d4-review-findings]] — the fix queue
- [[review-handoff-d6]] — the handoff (D6 remains)
- [[gobbi-adversarial-review-d2]] — the prior-dimension review this pass dedups against
- [[adversarial-review-charter-authored]] — the charter
