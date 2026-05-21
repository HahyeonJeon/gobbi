# Planning iter1 — Project perspective (Claude)

## Artifact Summary + Memory reads (Stage 0)

**Target**: `planning/staging/plans/main.md` + `planning/rawdata/draft-iter1.md`.

**What**: A 2-task plan (01 tag-create; 02 cleanup-sweep covering Stages A→E.2+F) plus a manager pre/post-Execution operations section (§1–12) carrying the lifecycle ops (issue create, worktree create, push, PR create, CI watch, atomic-guard merge, develop sync, worktree cleanup, issue close, post-merge verification).

**Why**: Decompose the locked Ideation Idea (destructive single-PR repo reset before bottom-up rebuild) into ordered executor tasks honoring the 19 Ideation locks + 3 pre-routed constraints + 3 D-PLAN user-locks.

**How**: F-CX-PREP-O-01 mistake-memory continuity resolved via single-executor sweep (D-PLAN-01). F-CX-PREP-O-02 enumerates both already-deleted files. F-CX-O4-01 drops redundant `git branch -d <sweep-branch>` (D-PLAN-03). D-PLAN-04 keeps push/PR-create/merge with the manager.

**Memory reads**:
- `principles` (Iron Laws 4, 7, 11, 12)
- All `.gobbi/projects/gobbi/rules/` (none currently present)
- `skills/planning/evaluation.md` § Project
- `skills/git/SKILL.md` § Role Boundaries
- 3 mistake files (`executor-rationalized-failing-verification-gate.md`, `session-dir-naming-convention-uses-date-prefix.md`, `manager-mispec-grep-c-for-occurrence-count.md`)
- `ideation/artifacts/scope-contract.md` (19 locks + 14 success criteria)
- `ideation/artifacts/implementation-checklist.md` (Stages 0–G + 7 ordering invariants)
- `preparation/artifacts/{handoff.md,pre-routed-gaps.md}`

## Locked Frame (Stage 1)

Scenarios (per `planning/evaluation.md` § Project):
1. Every task traces to ≥1 Ideation checklist item, with `traces-to:` referencing verbatim text.
2. Every Ideation checklist item is covered by ≥1 task OR explicit manager-op OR explicit deferral.
3. No task implements outside the Scope Contract.
4. Plan's terminal state satisfies every Success Criterion (#1–#14).
5. (Adversarial) No "while we're here" task slips into the plan.

## Per-scenario per-check results

**S1 — traces-to anchor verification**
- Task 01 traces-to lists "Stage 0 — Pre-reset archival tag (Q-F) → BEFORE the sweep branch opens" — matches checklist line 17 verbatim. PASS.
- Task 01 traces-to lists "`git tag pre-reset-2026-05-21 487fc35` (lightweight tag; no -a flag, no message required)" — matches checklist line 19 verbatim. PASS.
- Task 02 traces-to lists "Stage A — Discovery + pre-flight (S1, S4, S7)" — matches checklist line 23 verbatim. PASS.
- Task 02 traces-to lists "Stage B — Code + plugin + root file deletion + CLAUDE.md surgical edit (Q1, Q5, Q6, Q7, Q-D, Item 5, iter2 H-1) → sweep-branch commit 1" — matches checklist line 29 verbatim. PASS.
- Task 02 traces-to lists "Stage C — Adversarial-review + project-memory placeholder reset (Q2, Q-A, Q-C, Item 3) → sweep-branch commit 2" — matches checklist line 44 verbatim. PASS.
- Task 02 traces-to lists "Stage D — Gitignore transformations (Q4, Q-E) → sweep-branch commit 3" — matches checklist line 55 ALMOST verbatim. Checklist line 55 has an extra annotation `[ORDER CRITICAL — Stage D MUST precede Stage E.1's git add of the session dir]`. The trace truncates the annotation but the heading line is preserved. ACCEPTABLE (heading anchor + dropped parenthetical).
- Task 02 traces-to "Stage E.1 — In-commit session sweep" — matches checklist line 65 prefix (full line in checklist: "Stage E.1 — In-commit session sweep [sweep-branch commit 3 continuation or follow-on bisect-safe commit]"). ACCEPTABLE.
- Task 02 traces-to "Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]; executor's last act" — matches checklist line 77. The added "executor's last act" is a Plan annotation, not a checklist quote. Minor paraphrase ACCEPTABLE.
- Task 02 traces-to "Stage F — Worktree + branch cleanup (Q8, Q-G) → sweep-branch commit 4" — matches checklist line 85 verbatim. PASS.

**S2 — Ideation checklist item coverage**
Walked every checklist Stage 0–G. Each Stage maps to Task 01 / Task 02 / Manager-ops §1-12 (Stage G):
- Stage 0 → Task 01.
- Stage A (pre-flight) → Task 02.
- Stage B (10 deletions + CLAUDE.md surgical edit + git add) → Task 02 `files:` enumerates all targets.
- Stage C (adversarial-review delete + 13 placeholder resets + Q-A survivors + Q-C README) → Task 02 `files:` enumerates all 13 placeholder dirs (`archive/, backlogs/, decisions/, design/, features/, gotchas/, learnings/, mistakes/, notes/, plans/, references/, reviews/, tmp/`).
- Stage D (gitignore edits + verify exit 1 + commit) → Task 02 `files:` enumerates `.gitignore` + `.gobbi/.gitignore`.
- Stage E.1 (git add session dir + delete 52 sibling dirs by predicate) → Task 02 `files:` enumerates session dir + 3 named siblings + comment "49 additional bare-UUID dirs swept by the find/xargs invocation; listed by predicate, not by name". ACCEPTABLE.
- Stage E.2 (gate + bare-UUID delete) → Task 02 `verifies` block A.
- Stage F (worktree-remove×2 + worktrees parent-prune + branch -d×2 + branch -D×2) → Task 02 `files:` enumerates all 6 paths.
- Stage G (push + PR + atomic-guard merge + post-merge cleanup) → Manager-ops §5-12. PASS.

**S3 — Scope creep**
Task 02's `files:` list does not introduce any path outside the Scope Contract In-Scope set. No "while we're here" task is present. PASS.

**S4 — Success criteria terminal state**
14 criteria split across Task 01 (#9), Task 02 executor-pre-DONE (#1, #3-#8, #10-#13), Manager post-merge (#2, #14, #5-confirmation, #6-confirmation). The matrix at draft-iter1.md §"Spec coverage" lines 433-449 is internally complete. PASS.

**S5 — "While we're here" adversarial**
Scanned both tasks for adjacent improvements: none detected. The 2-task decomposition is minimal and contract-bounded.

## Typed findings

### F-CL-P-01 — Stage F worktree-remove + branch-delete placed in executor scope contradicts git/SKILL.md Role Boundaries
- **Type**: design_flaw
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: High
- **Evidence**: `skills/git/SKILL.md` lines 90-100 (Role Boundaries table) assigns Cleanup ("Worktree remove + prune + empty parent dir cleanup") to Manager; subagent column reads "Never". Lines 252-260 (Output paths) assigns "Worktree directory | manager (P2 create, P5 remove)". Procedure P5 step 3 is a manager procedure. Plan rawdata draft-iter1.md lines 115-127 places `git worktree remove .../redesign-v050-ideation`, `git worktree remove .../refactor/257-skills-agents-rules`, the empty-parent `find -empty -delete`, plus 4 `git branch -d/-D` operations inside Task 02 (executor scope). The Plan defends this with "Per `git/SKILL.md` Procedure P5 § Forbidden Operations, `git branch -d/-D` on **local-only** branches is an executor-permitted operation in the worktree (it is a local-ref mutation, not a remote push)" (lines 127), but `grep "local-only\|executor-permitted\|local ref mutation\|local-ref mutation" skills/git/SKILL.md` returns no hits — that justification is not actually written into the git skill.
- **Why it matters**: D-PLAN-04 user-lock explicitly states "Honor `git/SKILL.md` § Role Boundaries". The Plan invokes that user-lock to keep push/PR/merge with the manager but carves out an unwritten exception for worktree-remove + branch-delete on the basis of an interpretation the skill does not contain. This is the exact pattern that produced the `executor-boundary-extension-without-asking` mistake — a subagent (here pre-authorized by the Plan) silently expanding what is "executor-permissible" beyond what skills document. Even if the user later confirms the carve-out, the Plan needs the user's explicit ratification, not a unilateral interpretation by the leader.
- **Suggested direction**: Either (a) move Stage F's worktree-remove + branch-delete operations into Manager-ops (most-direct read of the Role Boundaries table — the manager owns Cleanup); OR (b) re-route to AskUserQuestion at Planning iter2 DISCUSSION ("D-PLAN-06: Stage F worktree-remove + branch-delete — executor (Plan's interpretation: local-ref mutation in worktree) vs manager (literal Role Boundaries: Cleanup = Manager)?"); OR (c) amend the git skill to add the carve-out (with user approval). Do not ship the executor delegation with the current framing.

### F-CL-P-02 — Task 02 traces-to does not enumerate Q-Gate-Redesign explicitly nor the F-CX-PREP-O-02 added file
- **Type**: checklist_gap
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Task 02 `traces-to:` (draft-iter1.md lines 174-182) anchors to Stages A–G but does not directly name Q-Gate-Redesign (iter3 lock) nor F-CX-PREP-O-02 (preparation pre-routed constraint that added `.gobbi/projects/gobbi/project.json` to the `op: delete` set). Both are reflected in the YAML body and in the `files:` list (line 200), and the Spec-coverage matrix at line 429 references "Q3/Q-iter4-Override + Q-Gate-Redesign → Stage E.2", so the linkage exists narratively — but the task's own `traces-to:` does not surface either anchor.
- **Why it matters**: A fresh executor reading Task 02 in isolation (Usage scenario, planning evaluation.md § Usage line 204) sees only Stage-letter anchors. They would have to cross-read draft-iter1.md to learn that `.gobbi/projects/gobbi/project.json` is in scope per F-CX-PREP-O-02 rather than out-of-scope drift.
- **Suggested direction**: Add `traces-to:` bullets for "F-CX-PREP-O-02 — already-deleted project.json" and "iter3 Q-Gate-Redesign → Stage E.2 gate uses git log + git ls-tree (not SHA-in-session.json)" so the executor's read of just the task YAML covers all binding constraints.

## Low-confidence appendix

- Stage F's "redesign-v050-ideation" worktree path — grep shows the current registered worktree under `.gobbi/projects/gobbi/worktrees/redesign-v050-ideation` (no nested `v050-ideation/` parent). The Plan calls it `redesign-v050-ideation` directly — matches. Confidence 25 because I did not run `git worktree list` to confirm; the Plan inherits the path from Preparation's empirical confirmation.

## Must-preserve list

- The 2-task minimal decomposition (no over-decomposition).
- Dependency edge 01 → 02 with file-overlap reasoning explicit.
- Spec-coverage matrix at draft-iter1.md lines 411-450 (criterion-by-criterion ownership).
- D-PLAN-04 honoring the user-lock for push/PR/merge being manager-direct.
- Stage E.2 gate using `git log` + `git ls-tree` (NOT SHA-in-session.json) per Q-Gate-Redesign.
- Manager-ops §1-12 sequence (issue create → worktree → delegate → push → PR → CI → atomic-guard merge → sync → cleanup → issue-close → verification).

## Verdict: REVISE

F-CL-P-01 is a High/75 design_flaw — Stage F's executor scope contradicts the literal Role Boundaries table and relies on a justification ("local-ref mutation") that the git skill does not contain. Per verdict thresholds (High ≥ 50 → REVISE), the Plan needs an iter2 revision that either moves Stage F to Manager-ops or surfaces D-PLAN-06 to the user for ratification.
