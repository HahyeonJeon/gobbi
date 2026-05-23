---
perspective: risk
evaluator: claude
iter: 2
target: draft-iter2.md
verdict: PASS
---

# Risk Perspective — iter 2

## Frame

1. Iron Law 7 (no verbatim drift) risk reduced by Fix 3 + Fix 5.
2. Iron Law 11 (no gaming the tool) preserved by explicit Fix 6 skip with rationale.
3. Worktree path-nesting risk reduced by Fix 2.
4. No new risks introduced.

## Findings — 0 open

### Iron Law 7 risk surface
- Fix 3 (Task 04 brief discipline) directly addresses iter1's "weakness mirroring Task 06" finding. Task 04 was the highest-risk vocabulary-drift task (5-Type vocabulary + 4-category gap table — both must land verbatim from `evaluation/SKILL.md:344-393`). Now: explicit Read-required directive (line 239), inlined verbatim Types (line 242), inlined verbatim gap table (lines 246-252), post-edit verification gate (lines 254-256 + verifies line 277).
- Fix 5 (Task 01 Required mistakes) ensures the parent-mistake of this session — `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` — is loaded into every executor's context (now in all 7 tasks' Required mistakes blocks, lines 459 + 467 + 475 + 483 + 491 + 501 + 514).
- Net effect: every executor in this Plan has a fresh witness to the failure mode this session was forced to relearn.

### Iron Law 11 risk surface
- Fix 6 (markdown anchors over line refs) was correctly SKIPPED rather than rationalized. P12 in Decisions log (line 628) explicitly cites Iron Law 11: "would require inventing fake anchors on evaluation/SKILL.md which doesn't have stable anchor IDs." Line refs preserved as evidence-based citations.
- This is a textbook anti-gaming refusal: the optional fix would have required upstream file edits (adding anchors to `evaluation/SKILL.md`) outside this session's scope, just to satisfy a stylistic preference.

### Worktree path-nesting risk
- Fix 2 (28 absolute paths) closes the failure mode documented in `mistakes/codex-eval-session-write-path-nested-in-worktree.md`. Executors operating from worktree CWDs will no longer write session artifacts to nested paths.

### Residual risks
- Task 06 still depends on Task 01 (Skill Map row rebase) — same as iter1, unchanged risk profile.
- Task 05 → Task 02 file-conflict ordering same as iter1.
- Task 07 fan-in latency (gates all of 01-06) unchanged from iter1.

## Must-preserve
- The Iron Law 11 SKIP of Fix 6 (do NOT promote it to a future iter unless `evaluation/SKILL.md` gets real anchors first).
- Required-mistakes propagation of `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` to all 7 tasks.

## Overall verdict: PASS

0 Critical, 0 High. Risk profile materially improved; Iron Law 11 discipline exemplary on Fix 6 SKIP.
