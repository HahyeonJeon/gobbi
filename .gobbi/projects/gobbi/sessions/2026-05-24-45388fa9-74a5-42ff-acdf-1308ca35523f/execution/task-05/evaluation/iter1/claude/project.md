# Project — T05 design doc (iter1, claude)

## Artifact Summary + Memory reads

**What**: A new project-level design doc `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` (151 lines, 5 H2 sections: Problem/Approach/Surfaces/Validation/Lessons) + flip of backlog `session-lifecycle-worktree-boundaries-design-doc.md` from `deferred` → `closed`. Commit `ecb1a5e`, 2 files, +156/-1.
**Why**: Task T05 of Bundle C / CL-4; closes the deferred design-doc backlog now that N=2 sessions have exercised the worktree-first pattern. Aggregates the distributed Bundle-B worktree-first edits into a single durable reference.
**How**: Author from template `memorization/templates/design.md`, populate the 5 contract-specified sections, add a shallow-by-design Lessons note per DL-1 β-1, close the backlog.

Memory reads: principles SKILL; evaluation SKILL; execution/evaluation.md; rules/stub-redirect-format.md (N/A to this doc — about stub files); mistakes/leader-iter2-verification-claim-without-evidence.md (process, applicable); bundle-B memorials d-1/d-2/d-4/d-5; orchestration/SKILL.md Step 1; git/SKILL.md (Matrix, P2, P5); git/conventions.md; preparation/SKILL.md; delegation/SKILL.md.

W/W/H all present and clear. No W/W/H gate finding.

## Locked Frame (Stage 1)

S1 — Change-set matches the contract 1:1.
- [ ] Doc file created at the contract path
- [ ] Backlog flipped deferred→closed
- [ ] Exactly the 2 contracted files touched, no others

S2 — Doc solves the right problem (aggregate the distributed worktree-first model as a durable reference).
- [ ] Problem section frames the real root cause
- [ ] Doc is an aggregation, not a re-design

S3 — Stays inside scope contract; no OOS files (session.json/state.json, other backlogs, skills, hook-authoring skill, bundle-B memorials).
- [ ] git diff --name-only shows only the 2 files

S4 (adversarial) — Backlog closed without the doc actually delivering the promised content (cosmetic close).
- [ ] Doc content substantively matches the backlog's "Suggested approach" structure

## Per-scenario per-check results

S1: created path ✓ (git show); backlog status: closed ✓ (grep); name-only = exactly 2 files ✓. PASS.
S2: Problem section names concurrent-session corruption + main-tree/worktree write-path ambiguity + session-dir placement — these match the Bundle-B framed problem ✓. Doc is descriptive aggregation, not re-design ✓. PASS.
S3: only `design/...md` + `backlogs/...md` touched ✓. No OOS file. PASS.
S4: doc delivers Problem/Approach/Surfaces/Validation/Lessons matching the backlog's suggested structure ✓. Not cosmetic. PASS.

## Typed findings

No Project-perspective findings at or above threshold. The change-set maps 1:1 to the T05 contract; scope is clean (2 files, both in-contract); the backlog close is backed by real delivered content. The factual row-number inaccuracy is recorded under Consistency/Risk (it is a correctness/sync issue, not a scope issue).

Per-perspective verdict: PASS

## Low-confidence appendix
(none)
