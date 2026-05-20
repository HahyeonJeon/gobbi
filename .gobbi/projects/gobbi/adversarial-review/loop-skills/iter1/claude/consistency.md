# Consistency Perspective — Loop Skills Batch 2 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary.)

This is the **highest-yield perspective for this batch** — the 5 loops share many cross-cutting contracts (verdict enum, NEEDS_CONTEXT, memory access, discussion-log, evaluation output paths, sole-writer). Sweep-first per the briefing.

## Locked Frame (Stage 1)

**S-C1: Verdict enum is uniform across all 5 loops**
- Each loop's EVALUATION step uses `PASS / REVISE / FAIL` consistently
- MEMORIZATION inputs reference the same verdict shape

**S-C2: Sole-writer contract (Wrap-up = only project-memory writer) is enforceable from all 5 loops**
- Ideation/Preparation/Planning/Execution explicitly say "no writes to project memory"
- Wrap-up explicitly says "I am the sole writer"

**S-C3: Evaluation output paths agree between SKILL.md and the evaluation.md child**
- For each loop, the path declared in SKILL.md matches the path declared in evaluation.md

**S-C4: Phase contract uniformity — 4 phases × 5 loops = 20 phase blocks all follow the same shape**

**S-C5: NEEDS_CONTEXT escalation is uniformly defined**
- All subagent roles (executor / leader / assistant) consistently document the NEEDS_CONTEXT escalation primitive

**S-C6: Task field schema in Planning SKILL.md matches the schema enforced by Planning evaluation.md AND consumed by Execution SKILL.md + evaluation.md**

**S-C7 (adversarial): A cross-loop concept silently uses two names for the same thing**
- Sweep: same artifact / file path / role / verdict referred to by two different names across the 10 files

**S-C8: `session.json.workflow.{loop}.iterations[]` shape is uniform across loop SKILLs**

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-C1 | Verdict enum uniform | NO | Ideation uses `PASS / REVISE` only (L326, 346, 354, 370, 378); other 4 use `PASS / REVISE / FAIL`. See F-C-01 |
| S-C2 | Sole-writer contract uniform | YES | Each non-Wrap-up loop has constraint "MUST never write to project memory or feature memory"; Wrap-up's WORK is the only `WRITE + UPSERT` row in its Memory Access Matrix |
| S-C3 | Eval path agreement | NO | execution/SKILL.md uses `execution/{task-id}/evaluation/...` (correct); execution/evaluation.md L425 uses `execution/evaluation/...` (wrong — missing `{task-id}/`). See F-S-03 (already filed under Structure; cited here as cross-perspective concern). All 4 other loops agree |
| S-C4 | 4 phases × 5 loops uniform | YES (mostly) | All 20 phase blocks use Purpose / Inputs / Procedure / Outputs / Exit checklist. Ideation lacks the top-level Memory Access Matrix (F-S-01) but the in-phase blocks are uniform |
| S-C5 | NEEDS_CONTEXT uniformly defined | NO | Only Execution + Wrap-up name `NEEDS_CONTEXT` (F-S-02). Leader-led loops don't |
| S-C6 | Task field schema agreement | NO | F-P-01 — Planning SKILL.md defines 5 prose fields; Planning evaluation.md + Execution SKILL + Execution evaluation.md all consume 6+ YAML fields. Cited here as cross-file consistency break |
| S-C7 | Same-thing-two-names | PARTIAL | "discussion log" vs "discussion-log.md" — used interchangeably (acceptable). "rawdata draft" vs "draft-iter{n}.md" — acceptable. But: F-C-02 |
| S-C8 | iterations[] shape uniform | NO | F-C-03 |

## Typed findings

### F-C-01 — Ideation verdict enum missing FAIL (Critical / 100)

(See F-P-02; same issue, escalated under Consistency because it's a cross-loop contract break.)
- **Severity**: re-tagged Critical when viewed cross-loop (vs Medium when viewed only within Ideation) — the 4 other loops document `FAIL` routing; an Ideation FAIL has no documented routing path. Manager will improvise.
- **Confidence**: 100

### F-C-02 — Loop-specific staging directory shapes diverge (Medium / 75)

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Severity**: Medium
- **Confidence**: 75
- **Evidence**: per Memory Access Matrices:
  - Ideation Output paths table mentions `staging/{scenarios,checklists,decisions,references,design,discussions}/`
  - Preparation Memory Access Matrix: `staging/{scenarios,checklists,decisions,references,design,discussions,skills,backlogs/{feature,project}}/`
  - Planning Memory Access Matrix: `staging/{plans,scenarios,checklists,decisions,references,design,discussions,backlogs/{feature,project}}/`
  - Execution Memory Access Matrix: `staging/{scenarios,checklists,decisions,references,design,discussions,changelogs,learnings,notes,backlogs/{feature,project}}/`
- These differ legitimately (Preparation has `skills/`, Planning has `plans/`, Execution has `changelogs,learnings,notes/`). But Ideation lacks `backlogs/feature` and `backlogs/project` in its Memory Access view, yet writes them per its Output paths table. The asymmetry is undocumented.
- **Impact**: a reader cannot mechanically derive each loop's staging surface from its Memory Access Matrix. Wrap-up's routing table assumes a superset that no single loop's matrix enumerates.
- **Remediation**: each loop's Memory Access Matrix should list the full staging subdirectory set the loop uses. Reduces ambiguity for Wrap-up routing audit.

### F-C-03 — `iterations[]` entry schema differs across loops (Medium / 75)

- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Severity**: Medium
- **Confidence**: 75
- **Evidence**:
  - Ideation SKILL.md L377,408: `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}`
  - Preparation SKILL.md L350: `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}`
  - Planning SKILL.md L428: `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}`
  - Execution SKILL.md L235: `{task-id, iter, verdict, finishedAt, evaluation_dir: "execution/{task-id}/evaluation/iter{n}/"}` — note: task-id added, and evaluation_dir is task-prefixed
  - Wrap-up SKILL.md L305: `{iter, verdict, finishedAt, evaluation_dir: "wrap-up/evaluation/iter{n}/"}` — note: wrap-up-prefixed
- **Impact**: schema drift — Wrap-up's `evaluation_dir` is loop-prefixed (`wrap-up/evaluation/iter{n}/`) but other loops just use `evaluation/iter{n}/`. Execution has an extra `task-id` field. A consumer reading session.json cannot rely on a uniform schema.
- **Remediation**: pick one convention: either all loops loop-prefix `evaluation_dir`, or none do. Execution's `task-id` field needs to be reconciled with `state.json.workflow.execution.iter`.

### F-C-04 — Ideation/Preparation evaluator output destination row vs path declaration drift (Low / 50)

- **Type**: `general`
- **Domain**: `docs-sync`
- **Disposition**: `open`
- **Severity**: Low
- **Confidence**: 50
- Both ideation/evaluation.md (L382-383) and preparation/evaluation.md (L326-327) declare paths in the loop-prefixed form `sessions/{date}-{session-id}/{loop}/evaluation/iter{n}/{system}/...`. SKILL.md procedure rows declare the same path but written abbreviated as `evaluation/iter{n}/{claude,codex}/{perspective}.md`. Acceptable; flagged for awareness.

## Low-confidence appendix

(none additional)
