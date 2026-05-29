# Codex Evaluation — T3 SKILL.md Amendment — Iter 1

## Identity

You are the Codex evaluator for the T3 (orchestration/SKILL.md amendment) task. This is an execution-phase evaluation. You evaluate the amended SKILL.md against the 8 anchors specified in the plan. You are a **fresh evaluator** with no prior context — the creator of the amendment is a separate agent.

Load: principles (Iron Laws), mistakes (tags: docs-sync, process, orchestration, codex), evaluation/SKILL.md (7 perspectives + Overall), execution/evaluation.md (seed scenarios).

---

## Worktree-Path Discipline

CRITICAL: The amended SKILL.md lives in the **worktree**, not the main tree.

- Amended SKILL.md: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- chat-mode.md: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`
- auto-mode.md: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
- Main tree DOES NOT have these files — that is expected, NOT a defect.
- Pre-edit baseline: `git -C /playinganalytics/git/gobbi show 87563f3:.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- `plugins/` was deleted in PR #264 — do NOT flag this as a defect.
- `.claude/skills/claude/SKILL.md` does NOT exist — do NOT flag FLAG-2.

All session WRITES must use the absolute main-tree path:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T3-skill-md-amendment/evaluation/iter1/codex/`

DO NOT use relative paths or pwd-derived paths. The worktree CWD is NOT the session-write root.

---

## Task

Evaluate the amended SKILL.md (472 lines) at:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md`

The amendment added 8 anchors per Idea §7.3. Verify each anchor independently, then evaluate across all 7 perspectives + Overall.

---

## Plan T3 Success Criteria (verify each independently)

### Anchor A1: Lines 241–242 — Lock sentence strikethrough

The original sentence "Mode controls user gates; it does not relax the workflow." must be present AND wrapped in strikethrough (`~~`).

Verification:
```bash
grep -n "~~Mode controls" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```
Expected: at least 1 match with `~~...~~` wrapping. FAIL if zero matches.

### Anchor A2: CORRECTION block in § Orchestration Mode area

A CORRECTION block must exist near the `## Orchestration Mode` section (around lines 62–76 in pre-edit baseline).

Verification:
```bash
grep -n "CORRECTION" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```
Expected: ≥ 1 match. Then read the surrounding context to confirm it is near `## Orchestration Mode`.

### Anchor A3: chat-mode.md + auto-mode.md links present (≥ 4 occurrences total)

The amended SKILL.md must reference both `chat-mode.md` and `auto-mode.md` in ≥ 4 total link occurrences.

Verification:
```bash
grep -c "chat-mode\.md" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
grep -c "auto-mode\.md" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```
Expected: sum ≥ 4. FAIL if combined count < 4.

### Anchor A4: Inter-loop transition has 2 Chat rows

The `### Inter-loop transition` section must have 2 distinct Chat rows (within-slice transition + task-boundary transition).

Verification:
```bash
grep -n "Inter-loop transition" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```
Then read that section (~10 lines around it) and count Chat rows. Expected: 2 Chat rows. FAIL if only 1.

### Anchor A5: Fourth Chat gate named (per-task user review gate)

The `### Mode-specific gates within a loop` section must have a fourth Chat gate: the per-task user review gate.

Verification:
```bash
grep -n "Mode-specific gates" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```
Then read that section. Expected: 4th Chat gate explicitly named (per-task user review / task boundary gate). FAIL if only 3 Chat gates.

### Anchor A6: workflow.chat.tasks[] in § State persistence

The `### State persistence` section must contain `workflow.chat.tasks[]` or equivalent schema entry.

Verification:
```bash
grep -n "workflow\.chat" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
grep -n "chat\.tasks" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```
Expected: matches appear in BOTH § State persistence AND § Workflow Metadata sections. The additive change must not remove existing `workflow.{loop}` entries.

### Anchor A7: workflow.chat.tasks[] in § Workflow Metadata

See A6 — must appear in § Workflow Metadata as well.

Verification:
```bash
grep -n "Workflow Metadata" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```
Read the Workflow Metadata section. Confirm `workflow.chat.tasks[]` schema appears there. Confirm existing `workflow.{loop}` entries (ideation, planning, execution, etc.) are still present — the change is additive.

### Anchor A8: mode-dispatch branch description in § Workflow / § Workflow State Machine

A mode-dispatch branch description must appear in either `## Workflow` (near top) or `## Workflow State Machine` section. The branch point is at Step-1 completion with Auto = linear 6-step and Chat = per-task slice loop.

Verification:
```bash
grep -n "dispatch\|Chat branch\|Auto branch\|mode-dispatch\|per-task slice" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
```
Expected: ≥ 1 match describing the branching. Read surrounding context to confirm the branch describes Auto = linear vs Chat = per-task slice.

---

## Additional Verification

Also verify:

1. **Line count**: file must be 472 lines (13 lines added vs 459-line baseline).
   ```bash
   wc -l /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md
   ```

2. **Baseline comparison**: get the pre-edit file for diff context.
   ```bash
   git -C /playinganalytics/git/gobbi show 87563f3:.gobbi/projects/gobbi/skills/orchestration/SKILL.md | wc -l
   ```

3. **chat-mode.md and auto-mode.md exist in worktree** (created by T1/T2 — not a defect they are absent from main tree).
   ```bash
   ls -la /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md
   ls -la /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md
   ```

4. **Spec-coverage**: all 8 Idea §7.3 anchors must map to exactly one applied edit each (no anchor missed, no anchor doubled).

---

## Evaluation Procedure

Follow evaluation/SKILL.md 4-stage procedure:

**Stage 0 — Target Understanding**
- What: 8-anchor amendment to orchestration/SKILL.md (459 → 472 lines) implementing Chat Mode redesign per Idea §7.3
- Why: lock the Chat Mode redesign decisions into the orchestration skill per planning task T3
- How: 8 targeted edits at specific anchors per the CRUD blast radius

**Stage 1 — Scenario-Checklist Frame (per perspective)**
Build scenarios for each perspective. Include at least 1 adversarial scenario per perspective.

**Stage 2 — Per-Perspective Evaluation**
Iterate: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk.
Use grep/Read verification for every claim — this is a text artifact, close-reading + grep is the strongest verification.

For each anchor A1–A8: record a binary PASS/FAIL for the anchor's success criterion in the relevant perspective file (Consistency is the primary perspective for anchor verification; Project covers scope/spec-coverage; Usage covers consumer comprehensibility).

**Stage 3 — Overall**
Check all 4 Karpathy failure modes. Produce preserve list.

---

## Output Format (8 files — write to the codex output dir)

Write EXACTLY these 8 files to:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T3-skill-md-amendment/evaluation/iter1/codex/`

Files:
1. `project.md`
2. `structure.md`
3. `performance.md`
4. `aesthetics.md`
5. `usage.md`
6. `consistency.md`
7. `risk.md`
8. `overall.md`

Each file MUST include:
- `## Artifact Summary` (Stage 0 W/W/H + memory reads)
- `## Locked Frame (Stage 1)` (scenarios with attached checklists)
- `## Stage 2 Findings` (per-scenario per-check yes/no with evidence)
- `## Verdict` line in format: `VERDICT: PASS` or `VERDICT: REVISE` or `VERDICT: FAIL`

Each finding MUST carry: Type / Domain / Confidence / Severity / Evidence / Disposition

`overall.md` MUST include:
- Cross-perspective tensions
- Karpathy 4 failure modes check (all 4)
- Preserve list
- `VERDICT: <PASS|REVISE|FAIL>` as the final line

Finding types (5-Type vocabulary — use ONLY these): `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`

---

## Anchor-Coverage Summary (include in overall.md)

Before the VERDICT line in overall.md, include a section `## Anchor Coverage` listing each anchor A1–A8 with PASS or FAIL.

---

## Session Write Path Reminder

ALL 8 files MUST land at:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T3-skill-md-amendment/evaluation/iter1/codex/`

This is an ABSOLUTE MAIN-TREE PATH. Do NOT use the worktree path for session writes.
Do NOT write to `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/.../sessions/...` — that would be nested in the worktree. The correct session root is `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/`.
