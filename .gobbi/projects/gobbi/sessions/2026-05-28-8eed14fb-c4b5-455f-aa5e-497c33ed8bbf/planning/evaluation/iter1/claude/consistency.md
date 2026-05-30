# Consistency — Planning iter1 (Claude)

**Verdict:** REVISE

## Artifact Summary

- Consistency lens: Plan locks vs Idea locks, T6 archive vs `memorization/templates/archive.md`, T3 anchors vs Idea §7.3 anchor list, and internal cross-references within the Plan.

## Frame (Consistency)

- **S-C1 Plan locks match Idea locks** — D-A, D-B, R1, R2/R3, R5, 9 brief locks.
- **S-C2 T6 archive procedure matches `memorization/templates/archive.md`**.
- **S-C3 T3 edit anchors match Idea §7.3 SKILL.md update rows (8 of them).**
- **S-C4 Internal Plan cross-refs (§3 → §4 → §5 → §6) are consistent.**

## Per-scenario Findings

- **S-C1 ✓** — Locks-locked-table at Plan §2 (lines 59-67) accurately re-states:
  - 9 brief locks (row 1).
  - R1: preparation.maxIterations 0 → state: Skipped at loop entry; no new settings field; no FAIL/Aborted noise. Matches Idea §2 Decisions Locked R1.
  - R2+R3: `workflow.chat.tasks[]` array-of-slices in BOTH session.json and state.json; per-task entries hold `{ideation, preparation, planning, execution}` sub-records (same shape as existing top-level workflow.{loop}). Matches Idea R2/R3.
  - R5: Chat MEMORIZATION narrowed PASS path locally in chat-mode.md; memorization/SKILL.md untouched. Matches Idea R5.
  - D-A: task-record session-local only at `sessions/.../chat/tasks/{NN}-{slug}/task-record.md`; no project memory promotion. Matches user D-A.
  - D-B: outer key `chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/`. Matches user D-B.
- **S-C2 ✓** — T6 archive (lines 410-451) honors `memorization/templates/archive.md`:
  - Stamps `archived_at`, `archive_reason`, `status: closed`, `disposition: addressed`, `shipped_in` (Plan line 427). Archive template requires `archived_at` + `archive_reason` plus terminal `status:` + `shipped_in:` — all present.
  - Uses `git mv` for the move (line 421 `# via git mv (path moves, file content preserved)`). Archive template § Move procedure step 2 prescribes exactly this.
  - Preserves body verbatim (Plan line 428). Archive template § Move procedure step 1 prescribes "body preserved verbatim".
  - Inbound references checked via `rg` (Plan line 429). Archive template § Move procedure step 3 prescribes "Repoint inbound references".
  - All four canonical steps mapped.
- **S-C3 ✗ partial** — Idea §7.3 lists 8 SKILL.md update rows (verified by re-reading idea.md lines 494-503):
  1. Lines 62-76 — Orchestration Mode + Chat / Auto blocks (consolidated CORRECTION + trim).
  2. Lines 80-84 — Workflow header (mode-dispatch + R1 mapping).
  3. Lines 234-241 — Inter-loop transition.
  4. Line 241-242 — the lock (strike-through + CORRECTION inline).
  5. Lines 245-290 — Workflow Status Display (Chat sub-section).
  6. Lines 387-405 — Mode-specific gates (fourth Chat gate + discuss-first shadowing).
  7. Workflow State Machine (line 338+) — mode-dispatch + R1 mapping.
  8. Workflow Metadata (line 426+) + State persistence (line 343+) — `workflow.chat.tasks[]` schema.
  
  Plan T3 pre-resolved-decisions line 321 cites exactly these anchors: "lines 62-76 / 80-84 / 234-241 / 241-242 / 245-290 / 387-405 / 338-405 State Machine / 426+ Metadata". 8 anchors — matches 1:1.
  
  **However:** the lock at "line 241-242" is empirically a **single line** (line 241 only, verified: `grep -n 'In both modes, the manager NEVER skips' SKILL.md` returns line 241 only). The Idea inherited this from iter1 wording. The Plan re-cites the Idea range without ground-truth verification. The strike-through is for the *second sentence of line 241* (not lines 241 and 242). Executor instructions (T3 success-criterion line 333) say "Original line 241-242 text 'Mode controls user gates; it does not relax the workflow.' present but struck through" — that text IS the second sentence of line 241. Executor following grep-anchors will find it; Executor following line numbers will be off by one.
- **S-C4 ✓** — Internal cross-refs:
  - §3 T1 success-criterion "(§6.3 / codex-usage-0fbc3d75)" line 125 → Idea codex-usage-0fbc3d75 exists at idea.md line 572 ("addressed (deferred to chat-mode.md authoring)" — Plan correctly inherits the deferral).
  - §3 T1 traces-to "Idea §8 F-S2" — verified at idea.md line 558.
  - §4 cross-task acceptance test refers to artifacts produced by §3 tasks — consistent.
  - §5 P-R2 ("T1 R5 four-bullet skeleton drift") matches T1 success-criterion line 121 ("four-bullet structure").

## New typed findings

- **F-CONS-1 (Medium · Confidence 100 · `design_flaw` · `docs-sync`)** — Plan T3 pre-resolved-decisions line 321 cites "lines 241-242" for the lock, inheriting the same off-by-one from Idea §6.1 / §7.3. Empirical: `grep -n 'In both modes, the manager NEVER skips' SKILL.md` returns line 241 ONLY (verified). The lock is a single line containing two sentences. The mitigation is real (T3 risk-rationale prescribes grep-anchors), but Plan-level acceptance §4 (no check verifies the strikethrough applied to the correct text) cannot catch a strike-through-on-wrong-line failure. Direction (don't prescribe): adjust the cited anchor to "line 241 (single line, two sentences; strike the second sentence)" OR add a Plan-level §4 check `grep -nE '~~Mode controls user gates' SKILL.md` to verify the strikethrough hit the right text. Confidence 100 (grep-verified).
- **F-CONS-2 (Low · Confidence 75 · `assumption_risk` · `docs-sync`)** — Plan T6 line 421 mentions `2026-MM-DD-{slug}.md` path with `MM-DD` as substitution markers. Archive template § Naming says "Always date-prefixed: `{YYYY-MM-DD}-{slug}.md`. The date is the archive date (when the terminal state transition happened), not the original creation date." Plan §Self-review (line 558) confirms `MM-DD` is the reader-substitution marker. Consistent with archive convention.

## Verdict & Must-preserve

- **Verdict: REVISE** for F-CONS-1 (Medium · Confidence 100). The off-by-one anchor citation propagates from Idea iter2 into Plan and could cause Execution to strike the wrong text or assume two lines need editing. Mitigated by T3 grep-anchor discipline, but the Plan-level acceptance test does not verify the strikethrough hit the correct text — an executor error here would survive the acceptance gate.

  *Per `evaluation/SKILL.md` verdict-threshold rules*: any High-confidence Medium triggers REVISE (Medium with Confidence 100 = "lock cited inaccurately"). Manager + user decide whether to (a) refine the anchor citation in T3, (b) add a Plan-level check that grep-confirms strikethrough applied to the correct sentence, or (c) accept the docs-sync slip and rely on the existing grep-anchor mitigation.

- **Must-preserve:**
  - Plan §2 locks table — accurate restatement of all Idea iter2 locks.
  - T6 archive procedure mapping all 4 archive-template steps.
  - T3 risk-rationale's grep-anchor mitigation directive.

## Low-confidence appendix

- F-CONS-1 confidence 100 on the off-by-one fact; confidence 50 that the off-by-one causes executor error (mitigation present).
