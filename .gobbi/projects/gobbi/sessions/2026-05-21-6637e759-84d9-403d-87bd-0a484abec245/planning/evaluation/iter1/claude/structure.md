# Planning iter1 — Structure perspective (Claude)

## Artifact Summary + Memory reads (Stage 0)

**Target**: Plan task decomposition shape — 2 tasks (01, 02), dependency graph (01 → 02), agent-type assignment (both `executor`/`sonnet`), files-touched scope per task.

**Memory reads**: `principles` (Iron Laws 4, 12), `skills/planning/evaluation.md` § Structure, `skills/delegation/SKILL.md` § Model Selection (lines 245-257), `skills/git/SKILL.md` § Role Boundaries + Procedures, mistakes (3 named).

## Locked Frame (Stage 1)

Scenarios:
1. Every task is narrow enough that a fresh executor grasps it in one read.
2. Task dependencies form a DAG; topological sort matches documented order.
3. Each task's `verifies:` is concrete and runnable.
4. Files-touched per task is bounded; large tasks are split.
5. Agent type per task matches the work's nature (per delegation/SKILL.md Model Selection table).
6. Parallelizable tasks are identified as such; conversely, "force-sequential when in fact parallel" is also flagged.
7. (Adversarial) Mega-task hidden behind small-scope framing.
8. (Adversarial) Forward dependencies (later task influences earlier task's setup).

## Per-scenario per-check results

**S1 — narrow task scope (≤~5-8 files, ≤~2 new classes)**
- Task 01: 1 ref operation. PASS.
- Task 02: **~50+ tracked paths + ~52 FS-only session dirs + 4 local branch refs + 2 worktree-removes + CLAUDE.md surgical edit + 13 stub README writes + 2 gitignore edits**. Stage count 4 commits + 1 terminal post-commit FS op + 1 mistake-load-discipline rider. FAIL on the 5-8 file heuristic by an order of magnitude. The Plan defends this as the F-CX-PREP-O-01 / D-PLAN-01 user-locked single-executor-sweep tradeoff (lines 510-514). User-locked, so the violation is acknowledged and accepted — but the evaluator must record it.

**S2 — DAG, explicit dependencies, topological sort**
- `01 → 02` with `requires: [01-create-pre-reset-tag]` on Task 02. Single-edge DAG. PASS.

**S3 — `verifies:` is concrete**
- Task 01: `git rev-parse pre-reset-2026-05-21 == 487fc35` and `git ls-remote --tags origin | grep pre-reset-2026-05-21`. Concrete. PASS.
- Task 02: Block A (E.2 gate — 2 commands), Block B (1 test), Block C (2 commands), Block D (Success #1, #3, #4, #5, #6, #7, #8, #9, #10, #11, #12, #13 with concrete commands). PASS — but #5 has unexpected complexity (see F-CL-S-02 below).

**S4 — files-touched bounded**
- Task 01: 1 ref. PASS.
- Task 02: ~50+ paths. Accepted via D-PLAN-01 user-lock. The Plan does enumerate them, so the executor at least sees a concrete inventory. ACCEPTABLE under the user-lock; FLAG for record-keeping.

**S5 — agent type matches**
- Both tasks: `executor` / `sonnet` (default per delegation/SKILL.md § Model Selection line 255). Justifications cited (lines 392, 403 in draft-iter1.md). Task 02 cites "structured execution against an explicit spec" as the sonnet fit. PASS.

**S6 — parallelizable**
- L1 sole lane, sequential. File-overlap reasoning explicit (line 41 in main.md). Task 01 only touches refs/tags; Task 02 touches everything else. They COULD parallelize on a pure file-overlap basis, but the Plan correctly notes "Per Execution Loop's contract, implementation tasks always sequence" + the dependency edge `01 → 02` makes parallelization moot because the PR body cites the tag. PASS.

**S7 — Mega-task adversarial**
- Task 02 IS a mega-task. Acknowledged by the Plan (line 511: "Task 02 is large (multi-stage destructive operations across ~50+ paths)"). The user-locked the trade-off via D-PLAN-01. FLAG recorded; not REVISE in itself since the user accepted it knowingly.

**S8 — Forward dependency / silent rename**
- Order invariant 2 (line 282): "Stage D commit before Stage E.1 `git add` of session dir." This is a within-task ordering invariant. The executor must honor it; the Plan does list it explicitly. PASS on declaration; see F-CL-S-01 below for the commit-boundary ambiguity.

## Typed findings

### F-CL-S-01 — Stage E.1 commit boundary is ambiguous: D and E.1 share commit 3 in some places, separate in others
- **Type**: checklist_gap
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: High
- **Evidence**: Implementation Checklist line 65 calls Stage E.1 "[sweep-branch commit 3 continuation or follow-on bisect-safe commit]" — ambiguous. Implementation Checklist line 61 (Stage D's last step) is "Commit checkpoint: `git commit -m '<sweep-branch commit 3 msg>'`. (SHA capture not required per iter3 Q-Gate-Redesign.)" — so Stage D commits FIRST. Stage E.1 line 67 then does `git add .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../`. But Stage E.1 lines 67-75 contain no explicit `git commit` step. Stage F line 85 is labeled "sweep-branch commit 4". So between D's commit and F's commit, where does E.1's `git add` get committed? The Plan inherits this ambiguity: draft-iter1.md line 260 reads "`git log --oneline develop..<sweep-branch>  → ≥4 commits (Stage B/C/D+E.1/F labels per Implementation Checklist)`" — implying D+E.1 share a commit. But if D commits first per line 61, then E.1's session-dir add either (i) requires `git commit --amend` (risky, even on a non-pushed branch — Forbidden Operations list per `git/SKILL.md` line 115 forbids amend after push, but the Plan's executor never pushes, so technically allowed in worktree; still risky if the executor partially completes E.1 and the gate then sees a stale tree) OR (ii) becomes a 5th commit (then the count is ≥5, not ≥4) OR (iii) the Stage D commit-checkpoint instruction in the Implementation Checklist is meant to be deferred until after E.1 stages the session dir (which contradicts the "Stage D MUST precede Stage E.1's `git add`" ordering invariant since "precede" can mean either "stage edits before" or "commit before"; the checklist line 110 says "Stage D (gitignore edits) committed → before Stage E.1 (`git add` of session dir)" — i.e., committed first, contradicting (iii)).
- **Why it matters**: The E.2 gate (Success #13) is `git ls-tree <sweep-branch> .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-.../`. If Stage E.1's `git add` is not committed before the gate runs, `ls-tree` will not show the session dir in the tip's tree → gate fails → NEEDS_CONTEXT, even though the executor did everything else right. The mistake `executor-rationalized-failing-verification-gate.md` is then exactly the trap the Plan needs the executor NOT to fall into; but the Plan doesn't disambiguate the commit boundary.
- **Suggested direction**: Add an explicit Stage E.1 closing step to the Plan (or the executor delegation prompt): "After `git add` of the session dir and `rm -rf` of the 52 sibling dirs, run `git commit -m '<sweep-branch commit X — Stage E.1 in-commit session sweep>'`." Then update line 260's count to ≥5 commits if separate. OR explicitly say "amend Stage D's commit to include the session-dir add" and document the amend justification (executor-local, never pushed). Either choice resolves the ambiguity.

### F-CL-S-02 — Success #5 verification command in Task 02 verifies the wrong post-state
- **Type**: design_flaw
- **Domain**: test
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Scope Contract Success #5 (line 99): "`git branch | grep -vE '^[* ] (main|develop)$'` returns no rows post-merge." Task 02 `verifies:` block D (line 266): "`git branch | grep -vE '^[* ] (main|develop|<sweep-branch>)$'` → no rows (<sweep-branch> still alive; manager handles its post-merge deletion via --delete-branch)". The Plan PATCHES the Success Criterion's regex to add `<sweep-branch>` to the allow-list, then re-numbers it as a partial / "executor-side subset". The Spec-coverage matrix (line 439) marks #5 as "jointly verified". But the patched regex is now a DIFFERENT verification gate than the contract specifies. The original contract gate fires the post-merge state; the executor's patched gate fires the pre-merge state. These are two distinct gates and the Plan should treat them as such, not as a literal interpretation of #5.
- **Why it matters**: The `manager-mispec-grep-c-for-occurrence-count.md` mistake teaches that gates must be specified to return the literal value the contract expects against the literal post-state the contract names. The Plan introduces a derived gate (patched regex against pre-merge state) and labels it as "Success #5 (subset)". A fresh executor running the verbatim Plan command will get a passing result that does not prove Success #5 holds — it only proves a strictly weaker statement. Manager-ops §12 must therefore re-run the original-regex gate from the main tree to actually verify #5. The Plan SAYS this ("Re-run #1, #3-13 from the main tree" at line 351) but lists #5 as one of the criteria re-run with no clarification that the executor's #5 command is structurally different.
- **Suggested direction**: Either (a) rename the executor's Block D #5 entry to something like "Success #5 pre-merge precursor — no non-sweep local branches remain" and put the original-regex #5 explicitly in Manager-ops §12 as a distinct check; OR (b) drop the executor's #5 entirely and let it verify post-merge in Manager-ops §12 only.

### F-CL-S-03 — Task 02 traces "Stage E.2 — TERMINAL post-commit operation … executor's last act" without exact checklist text match
- **Type**: checklist_gap
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Task 02 `traces-to:` (draft-iter1.md line 180) says `"Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]; executor's last act"`. Checklist line 77 is `"Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]"`. The "; executor's last act" tail is the Plan's commentary, not in the checklist.
- **Why it matters**: `consistency` perspective looks for verbatim trace matches; "; executor's last act" introduces a Plan-side annotation inside the trace string. Minor.
- **Suggested direction**: Split into two entries: one verbatim trace + one Plan annotation.

## Low-confidence appendix

- The agent-type assignment "executor/sonnet" relies on the work being "structured execution against an explicit spec". The Plan does provide a concrete spec — but ~50+ paths, 4-5 commit boundaries, 1 terminal-gate clause, and a within-task ordering invariant set might exceed what sonnet reliably orchestrates. Opus could be safer. Confidence 25 because the per-step framing IS structured; the empirical risk is hard to quantify without an execution run.

## Must-preserve list

- The 01 → 02 DAG with explicit dependency edge.
- The within-task ordering invariants list at draft-iter1.md lines 280-286.
- The full `files:` enumeration at lines 184-239.
- The verbatim-match traces for Stages A, B, C, D, F.

## Verdict: REVISE

F-CL-S-01 (High/75) — Stage E.1 commit boundary ambiguity is a real executor pitfall. The Plan needs an explicit commit step (or an explicit amend instruction) before delegation.
