# Planning iter1 — Consistency perspective (Claude)

## Artifact Summary + Memory reads (Stage 0)

**Target**: Task hand-offs, schema uniformity, traces-to coherence with Ideation.

**Memory reads**: `principles`, `skills/planning/evaluation.md` § Consistency, `ideation/artifacts/implementation-checklist.md`, `ideation/artifacts/scope-contract.md` (Success Criteria).

## Locked Frame (Stage 1)

Scenarios:
1. Every task's `inputs:` literal-name-matches an upstream task's `outputs:`.
2. Every `traces-to:` reference points to a real Ideation checklist item (verbatim).
3. Task field schema is uniform across tasks.
4. Tooling commitments are consistent across tasks.
5. No task contradicts a sibling task's assumption.
6. (Adversarial) A task implicitly relies on shape introduced by a later task.

## Per-scenario per-check results

**S1 — inputs/outputs literal match**

Task 01 outputs: `tag-pre-reset-2026-05-21-local`, `tag-pre-reset-2026-05-21-origin`. Task 02 inputs include both verbatim. PASS.

**S2 — traces-to ↔ Ideation checklist verbatim**

Re-checked each Task 02 trace against the Implementation Checklist:
- `"Stage A — Discovery + pre-flight (S1, S4, S7)"` ↔ checklist line 23: exact match. PASS.
- `"Stage B — Code + plugin + root file deletion + CLAUDE.md surgical edit (Q1, Q5, Q6, Q7, Q-D, Item 5, iter2 H-1) → sweep-branch commit 1"` ↔ checklist line 29: exact match. PASS.
- `"Stage C — Adversarial-review + project-memory placeholder reset (Q2, Q-A, Q-C, Item 3) → sweep-branch commit 2"` ↔ checklist line 44: exact match. PASS.
- `"Stage D — Gitignore transformations (Q4, Q-E) → sweep-branch commit 3"` ↔ checklist line 55 truncated. The checklist's full text has the `[ORDER CRITICAL — Stage D MUST precede Stage E.1's git add of the session dir]` tail. The trace truncates it. Minor.
- `"Stage E.1 — In-commit session sweep"` ↔ checklist line 65 prefix. The checklist full text has the `[sweep-branch commit 3 continuation or follow-on bisect-safe commit]` tail. Truncated.
- `"Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]; executor's last act"` ↔ checklist line 77 plus appended Plan commentary "; executor's last act". Non-verbatim.
- `"Stage F — Worktree + branch cleanup (Q8, Q-G) → sweep-branch commit 4"` ↔ checklist line 85: exact match. PASS.
- `"Stage G — MANAGER scope; not in Task 02 [D-PLAN-04 user-lock]"` — does not match checklist line 95 (`"Stage G — PR open + head-SHA capture + atomic-guard squash merge + local cleanup [iter4 Q-iter4-Override]"`). The trace replaces the checklist Stage-G heading with a Plan-side scope statement. Semantically OK (Stage G is now Manager-owned) but no longer a verbatim trace.

**S3 — uniform field schema**

Both tasks have `id, what, traces-to, requires, files, inputs, outputs, verifies`. Task 01 has empty `files:` payload (only `[{ path: "refs/tags/pre-reset-2026-05-21", op: create }]`). Task 02 has the large `files:` block. Field set is uniform. PASS.

**S4 — tooling consistency**

Both tasks use git CLI invocations. Manager-ops mix `git` and `gh`. Tooling is consistent — same shell, no Bun/Node test commands (the project has no test surface post-Workstream-B per scope context). PASS.

**S5 — sibling-assumption contradictions**

Task 02 assumes the tag exists locally + on origin (which is what Task 01 produces). Task 02's `requires: [01-create-pre-reset-tag]` makes this explicit. Manager-ops §5 (push) assumes Task 02 left commits ready (which Task 02's `verifies` block confirms). No contradiction. PASS.

**S6 — implicit reliance on shape introduced later (adversarial)**

Task 02 Stage E.1's `git add` of the kept session dir relies on Stage D's gitignore edit being COMMITTED beforehand (so the previously-ignored path becomes track-able). The Plan and Implementation Checklist both call this out. PASS.

## Typed findings

### F-CL-C-01 — Stage E.2 `traces-to:` introduces Plan-side commentary ("; executor's last act") not present in Ideation checklist
- **Type**: checklist_gap
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: draft-iter1.md line 180: `"Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]; executor's last act"`. Implementation Checklist line 77: `"Stage E.2 — TERMINAL post-commit operation (NOT part of any commit) — bare-UUID delete [iter3 Q-Gate-Redesign]"`. The trailing "; executor's last act" is a Plan annotation.
- **Why it matters**: A consistency tool grepping `traces-to:` text against the checklist would not find a match.
- **Suggested direction**: Either drop the suffix from the trace string OR split into two entries: a verbatim trace + a `note:` field carrying "executor's last act per D-PLAN-04".

### F-CL-C-02 — Stage G `traces-to:` replaces the checklist heading with a Plan-side scope statement
- **Type**: checklist_gap
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: draft-iter1.md line 182: `"Stage G — MANAGER scope; not in Task 02 [D-PLAN-04 user-lock]"`. Implementation Checklist line 95: `"Stage G — PR open + head-SHA capture + atomic-guard squash merge + local cleanup [iter4 Q-iter4-Override]"`. The Plan's trace is a Plan annotation, not a checklist quote.
- **Why it matters**: The Stage-G heading in the checklist names the actual operations the manager must perform. Task 02 traces to a "Stage G is not mine" annotation. The actual Stage-G operations live in Manager-ops §5-12 (which Task 02 does NOT trace to because they're not a task). The risk: anyone tracing "Stage G — PR open + head-SHA capture + atomic-guard squash merge" via task traces will not find it referenced in any task — they have to know to look in Manager-ops.
- **Suggested direction**: Add a section to the Plan (or main.md) that maps Implementation Checklist Stage G's individual bullets to Manager-ops §5-12 sub-steps. Either as a new trace table or as an explicit Stage-G-to-Manager-ops mapping in the Spec-coverage matrix.

### F-CL-C-03 — Iter4 checklist line 104 (M-2 redundant `git branch -d <sweep-branch>`) is still in the checklist but dropped by D-PLAN-03 — Plan does not flag the checklist as superseded
- **Type**: assumption_risk
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Implementation Checklist line 104 (Stage G): `**(iter2 M-2)** Post-merge local cleanup: `git checkout develop && git pull && git branch -d <sweep-branch>`.` and line 114 (Critical ordering invariant 6): `**(iter2 M-2)** Post-merge `git branch -d <sweep-branch>` to honor Success Criterion #5.`. Both still in iter4 checklist. D-PLAN-03 user-lock says drop the redundant step. Plan documents the drop at line 333, but the Implementation Checklist (an iter4 artifact, status: final) still contains the redundant step.
- **Why it matters**: An executor delegation prompt that says "follow the Implementation Checklist" hands the executor a document that still contains the redundant step. The Plan's main.md / draft-iter1.md should explicitly tell the executor "checklist line 104 is superseded by D-PLAN-03 — skip it." Without this, the executor may dutifully run `git branch -d <sweep-branch>` and emit a benign "branch not found" error that triggers NEEDS_CONTEXT.
- **Suggested direction**: Add an explicit "Supersedes" or "Drift from Ideation checklist" subsection to the Plan that enumerates: "Implementation Checklist lines 104, 114 (`git branch -d <sweep-branch>` step) are dropped per D-PLAN-03." Better still: re-write the Implementation Checklist with iter4-revised status reflecting the D-PLAN-03 lock. (But that contradicts "Ideation iter4 PASS, final" — so the drift-notice in the Plan is the pragmatic fix.)

### F-CL-C-04 — Leader's "verification strategy summary" misdescribes Success #12's grep pattern
- **Type**: assumption_risk
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: main.md line 55: "D2 #16 (the CLAUDE.md table-row excision audit) uses `$`-anchored `grep -c` per `manager-mispec-grep-c-for-occurrence-count.md` — counts lines, not occurrences, which is correct because each table row is one line." Two factual errors: (a) The Plan's actual grep at draft-iter1.md line 273 and main.md `verifies:` Success #12 is `grep -nE '\[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` → no `$` anchor, no `-c`. (b) Scope Contract Success #12 at scope-contract.md line 106 uses `grep -nE '^\| \[`v050-(overview|cli)\.md`\]' .claude/CLAUDE.md` — `^`-anchored (start-of-line + pipe), not `$`-anchored. The leader's framing conflates two different patterns and tools, then justifies it with a mistake reference whose semantics don't apply (the gate asserts "empty output", not "specific occurrence count").
- **Why it matters**: The Plan's stated reasoning about the gate is wrong. The actual gate (unanchored `grep -nE`) happens to work in practice because lines 61-62 are the only places those tokens appear in CLAUDE.md (I verified). But the Plan's misdescription means a future reader auditing "is this gate correct per the mistake?" will trip on the inconsistency.
- **Suggested direction**: Either (a) replace the gate with the scope-contract's `^\| `-anchored version (literally Success Criterion #12), or (b) rewrite the rationale in main.md line 55 to match what the gate actually does ("asserts empty output of an unanchored `grep -nE` since lines 61-62 are the only mentions of these tokens in CLAUDE.md"). The mistake-reference is misapplied — that mistake is about counts, not about empty-vs-nonempty assertions.

## Low-confidence appendix

- The trace-truncation on Stages D and E.1 is harmless because the truncated portion is annotation in brackets. Minor.

## Must-preserve list

- The literal `outputs:` ↔ `inputs:` match for the tag identifiers.
- The Spec-coverage matrix (lines 433-449 in draft-iter1.md).
- The dependency table including file-overlap reasoning (line 366).

## Verdict: REVISE

F-CL-C-03 (Medium/75) — leaving the iter4 checklist's M-2 step in the executor's load set without explicit drift notice will produce a benign-error NEEDS_CONTEXT during execution. F-CL-C-04 (Low/75) is a misdescription, not a runtime defect; on its own it would be a PASS. Together with F-CL-C-03's Medium, the verdict crosses REVISE.
