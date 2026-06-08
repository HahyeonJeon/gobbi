# Planning Eval — Structure perspective (claude, iter1)

## Artifact Summary + Memory reads
- Lens: is the task decomposition sound? Dependencies ordered? Agent-type assignment right?
- Verified all anchors against live worktree files at c8a8654.

## Locked Frame (Stage 1)
- S1 Each task narrow (≤5-8 files, ≤2 modules), imperative title.
- S2 Dependencies form a DAG; topo-sort == documented order.
- S3 Each task's verification is concrete.
- S4 files-touched bounded; no secret out-of-set edit.
- S5 Agent type per task matches work nature.
- S6 Parallelizable tasks marked.
- S7 (adversarial) two tasks silently modify same file with conflicting intent.

## Per-scenario per-check results
- S1 PASS. Each task touches exactly ONE in-scope file (T1=evaluation.md, T2=auto-mode.md, T3=CLAUDE.md, T4 read-only). Titles imperative. T2 is the largest (append §7 with 4 sub-blocks + 3 forward pointers + Cross-refs rows) but still single-file and bounded.
- S2 PASS. requires: T1[], T2[T1], T3[T2], T4[T1,T2,T3]. Dependency table + parallel-lane table agree. Topo-sort yields T1→T2→T3→T4, matching the documented order. Citation-graph rationale is sound (cite-target before citer).
- S3 PASS with one defect. Each task has a multi-clause `verifies:` block with concrete grep/diff checks. DEFECT in T4 verifies(b): it instructs verifying "orchestration/SKILL.md:247 still references auto-mode.md §3 and §6" — but line 247 in the live file is a Verdict-aggregation table separator (`|---|---|`); the actual §3/§6 pointer is at line 266. See finding S-1. This makes the verification step un-runnable as written (an executor checking line 247 finds a separator).
- S4 PASS. files: fields enumerate exactly the touched paths; op: modify for T1-T3, op: read for T4's five paths (3 in-scope + SKILL.md + chat-mode.md, both verify-only).
- S5 PASS. All executor/opus default; bounded markdown edits + one verification pass — squarely executor work. No leader/assistant needed. Justified in DD3.
- S6 PASS. Correctly states no parallel-safe lanes (citation chain); single sequential lane L1. Conflict flags: none — no two tasks touch the same file. Accurate.
- S7 PASS (adversarial). No file-touch overlap among edit tasks. T4 reads all; T2 expects T1's output (section names) — declared via requires + inputs/outputs chain, not implicit.

## Typed findings

### S-1
- Type: checklist_gap
- Domain: docs-sync
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: Plan T4 verifies(b) (draft line 135): "orchestration/SKILL.md:247 still references 'auto-mode.md §3' and '§6'". Live file: `grep -n` shows line 247 = `|---|---|` (Verdict-aggregation table separator); the actual pointer "auto-mode.md §3 — Always-Ask codification … §6 — maxIterations exhaustion" is at **line 266**. The readiness report (lines 164-171, 105) had already flagged this exact correction: "post-#295 the actual pointer is at line 266 … Planning should note this correction if it reproduces the anchors table." The Plan reproduced line 247 in 5 places (scope ref line 24, T4 verifies(b) line 135, consistency #2 line 186, NOT-in-scope line 200, edit-mechanics).
- Why it matters: T4 is the dedicated drift-guard task. Its line-247 check is un-runnable as written — an executor verifying "line 247 references §3/§6" finds a table separator, then must either improvise (silently re-finding line 266 — fine but the plan failed to anchor it) or report a false mismatch. The plan ignored a correction the upstream readiness artifact explicitly handed to Planning, which is a Principle-6/Principle-9 (CRUD/5W1H, keep docs current) miss and a planning-anchor-without-verifying pattern.
- Suggested direction: replace every "SKILL.md:247" with "SKILL.md:266" (the verified §3/§6 pointer line), or anchor by content ("the line referencing `auto-mode.md §3 — Always-Ask codification` and `§6 — maxIterations exhaustion`") rather than a brittle line number. User decides.

## Low-confidence appendix
- None. The S-1 anchor error is tool-verified at confidence 100.
