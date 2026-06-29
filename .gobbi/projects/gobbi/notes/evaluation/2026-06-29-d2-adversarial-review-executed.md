---
name: d2-adversarial-review-executed
description: "Ran the D2 (completeness of agents + skills) dual-system adversarial review — 53 raw → 40 findings, review-only → backlog."
type: notes
scope: project
feature: null
status: active
created: 2026-06-29
session: 5ac6cf6e-aae6-4e28-85b3-e90b0a10aaaf
tags: [evaluation, process]
keywords: [adversarial-review, d2, dual-system, background-codex, review-only, load-graph]
author: claude
features_touched: []
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [2026-06-29-gobbi-adversarial-review-d2, fix-d2-review-findings, 2026-06-29-review-handoff-d4-d6]
---

# D2 adversarial review executed — completeness of agents + skills

## What happened

This session ran **D2** of the gobbi adversarial-review charter — completeness of the agent + skill
surface: skill internal/between-skill integrity, runtime mirrors, the global load graph, handoff
continuity, and count consistency. **Auto mode, review-only, dual-system.**

The method matched the prior cycles: an independent Claude reviewer (a `leader` subagent, read-only
intent) plus an independent background `codex exec --sandbox read-only` reviewer per chunk, reconciled
at MERGE by **pessimistic union** (a finding survives if either system raised it; conservative score,
max severity, divergences preserved). D2 is a whole-surface pass, so it was **sub-chunked**.

**Budget-driven split — 4 chunks → 6.** Pass-0.5 measured the surface against the charter's ≤ ~60K-word
per-pass budget. Two of the planned 4 chunks were over budget (Chunk 1 = 89K words, Chunk 3 = 84K), so
the charter's "sub-chunk any over-budget pass" rule split each in two: C1→C1a/C1b, C3→C3a/C3b, giving
**six chunks** (C1a orchestration+gobbi, C1b the 5 loop skills, C2 discussion/delegation/evaluation/record,
C3a memory+coding, C3b the 9 remaining cross-cutting/support skills, C4 agents + both mirrors). The split
was auto-decided — the charter pre-authorizes it.

**12 reviewers + merge.** Six chunks × two systems = **12 partial-finding files** (Claude 27 raw findings,
Codex 26 raw = **53 raw**). Each reviewer also emitted a cross-chunk index (load-edges-out / skills-defined
/ counts-claimed / handoff-edges) so the MERGE could compute the GLOBAL load graph no single chunk sees.
The merge reconciled **53 raw → 40 consolidated** findings (de-duplicated by location + claim, stably
ID'd D2-001…D2-040, ordered Severity then chunk): **Critical 3 · High 13 · Medium 16 · Low 8.**
**10 findings are cross-system-corroborated**; 30 are single-system (14 codex-only, 16 claude-only).

Execution EVALUATION verdicted REVISE then PASS on the consolidated merge. Review-only → all 40
dispositions stay `open` and route to the fix-backlog; no source was edited.

## What shipped

- `reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d2.md` — the consolidated 40-finding
  source of record (+ global load-graph reconciliation, count-drift table, cross-system divergences,
  confirmed-seed siblings).
- `backlogs/evaluation/fix-d2-review-findings.md` — the deferred fix queue (clustered; 5 Always-Ask
  divergences called out).
- `notes/process/2026-06-29-review-handoff-d4-d6.md` — the next-session handoff (D4 + D6 remain).

A staged mistake-candidate from this session — `delegation-brief-placeholder-path-misroutes-write`
(the C3a incident below) — is routed to a mistake home by the manager separately, not by this Wrap-up
promotion.

## What got stuck

Nothing blocked. The notable operational incident was a **main-tree write misroute (C3a)**: 5 of 6
Claude leader-reviewers wrote their findings file to the correct worktree path, but the C3a leader
resolved an **unexpanded `WT/` placeholder** in its delegation brief against the fresh-subagent main-tree
CWD and wrote `claude/C3a.md` to the **main tree** instead of the worktree. The main tree's `sessions/`
is gitignored, so nothing tracked was polluted, but the file was missing from the merge inputs until a
filesystem check on the exact worktree path caught it. **Recovery:** the manager relocated the misrouted
file into the worktree and re-ran the merge with the complete C3a inputs, so no finding was lost. Root
cause: a brief that uses a `WT/`-prefixed write path instead of a fully-expanded absolute path — a
brief-authoring instance of the documented `git/mistakes.md#executor-wrote-to-main-tree-not-worktree`
trap. The prevention (expand every write path to a complete absolute string; the manager verifies the
artifact at the exact worktree path after return, never trusting the reported ARTIFACT path) is captured
in the staged mistake-candidate.

## What shifted

The clearest signal was the **dead-end-handoff divergence**: Codex rated Preparation→Planning and
Planning→Execution as **Critical** dead-ends (no explicit successor-load directive), while Claude
classified both as **NAMED** with no defect — the same anti-groupthink split the charter targets, now at
the lifecycle-handoff layer. Reconciled to the higher severity and flagged as the session's first
Always-Ask: does "named successor without a load directive" count as a dead-end? Its answer also settles
whether the seeded Ideation→Preparation gap is structurally unique or one of three.

Five substantive same-location/opposite-verdict divergences were preserved for the fix session to
adjudicate (dead-ends D2-001/002; coding-eval-wiring D2-003 vs D2-036; mirror-scripts D2-032; the
uniform operational-contract bar D2-028; and the memory/rules.md broken links D2-037 — new-High vs
already-backlog-tracked).

## Decisions to respect

- The charter is **review-only** — no finding is fixed in a review session; fixes are separate sessions.
- Findings are reconciled by **pessimistic union** with cross-system divergence preserved, never averaged.
- The **5 Always-Ask divergences** are user-decisions at fix time — the disposition direction differs by
  verdict, so they gate their clusters and must not be auto-resolved.
- **Confirmed seeds are instance-1 and not re-filed** — the D2 findings are their siblings (the
  `skills/claude/SKILL.md` dangling ref, the `delegation/SKILL.md` broken link, Ideation→Preparation, and
  research↔ideation `staging/references/`).

## Top gaps (triangulated)

- **Mirror asymmetry — the Principle-8 root (D2-015), both systems.** The `.claude/skills` per-file
  mirror is unmanaged by sync and unvalidated by `--check`, so it silently drifts; every other
  `.claude/skills` gap (D2-010 missing `coding`, D2-030/031 missing child docs, D2-032 missing scripts,
  D2-029 the discovery-index gap) is a symptom. Fix the root and the cluster collapses.
- **The dead-end-handoff class (D2.5).** Three loop transitions (D2-001/002/005) plus the coding-eval
  wiring (D2-003) share the "successor is described but not entered via a load step" shape — the
  structural generalization of the seeded Ideation→Preparation gap.
- **The staging-ownership contradiction (D2-007/011).** The `staging/` writer-set + timing and the
  project-`skills/` memory-classification are self-contradictory across record/memory/preparation/wrap-up
  — the owning memory doc itself flags it unresolved.
- **Cross-cycle Preparation-omission pattern.** D2-008/018/019 are the same "Preparation dropped from an
  enumeration" pattern cycle 1 found (D1-013/015/031). Two independent cycles landing on it is the signal
  that the Preparation insertion left a systemic enumeration debt.

## Next session

Continue the charter: **D4 + D6 remain** (D7+D1, D3+D5, and now D2 are done — 5 of 7 dimensions). See
`notes/process/2026-06-29-review-handoff-d4-d6.md`. React to the fix queue in
`backlogs/evaluation/fix-d2-review-findings.md` in a scoped Execution/design session — settle the 5
Always-Ask divergences first. Reuse the dual-system + background-codex method and the budget-split rule
(whole-surface passes need 6 chunks, not 4). **Merge this D2 PR before the next session branches** so the
findings land on `develop`.

## Related

- [[gobbi-adversarial-review-d2]] — the reviews artifact this session produced
- [[fix-d2-review-findings]] — the fix queue
- [[review-handoff-d4-d6]] — the handoff
- [[adversarial-review-charter-authored]] — the charter
