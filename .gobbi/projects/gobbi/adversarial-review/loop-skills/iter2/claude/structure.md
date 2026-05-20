# Structure Perspective — Loop Skills Batch 2 iter2 (Claude)

## Artifact Summary + Memory reads

(See `project.md` for the shared Stage 0 summary.)

## Locked Frame (Stage 1)

Inherited from iter1.

**S-S1: All 5 loop SKILL.md share the same skeleton** (inherited)
**S-S2: All 5 evaluation.md share the same skeleton** (inherited)
**S-S3: Phase block structure uniform** (inherited)
**S-S4 (adversarial): SKILL singular divergence** (inherited)
**S-S5: Memory Access Matrix uniform across loops** (inherited — Ideation absent in iter1)
**S-S6 (NEW iter2, adversarial): Fix E (3-file touch on generated-skill promotion) introduces sibling-file regression**
- Probe orchestration/SKILL.md row, preparation/SKILL.md exception, wrap-up/SKILL.md exception — all three must agree on path source/destination + manager-as-actor + timing (before Planning starts)

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| S-S1 | Skeleton uniformity | YES | Fix F — ideation/SKILL.md now has top-level `## Memory Access Matrix` at L20, shape mirroring preparation/planning/execution (5-tier table + delete semantics + write enforcement) |
| S-S2 | Evaluation.md skeleton uniformity | YES (unchanged from iter1 PASS) | |
| S-S3 | Phase block uniformity | YES (unchanged) | |
| S-S4 | Structural singularity check | YES | Ideation no longer outlying after Fix F |
| S-S5 | Memory Access Matrix uniformity | YES | All 5 loops now present and uniform (ideation L20, preparation L19, planning L24, execution L22, wrap-up L22) |
| S-S6 | Fix E 3-file agreement | YES | orchestration/SKILL.md L118 row 5 names the manager-promotes-before-Planning path; preparation/SKILL.md L58-62 frames the exception; wrap-up/SKILL.md L51 + L207 + L351 acknowledge the narrow carveout and idempotent wrap-up re-overwrite. All three agree on (a) actor=manager, (b) timing=between Preparation EVALUATION PASS and Planning, (c) src=`sessions/.../preparation/staging/skills/{slug}/SKILL.md`, (d) dst=`.gobbi/projects/{project-name}/skills/{slug}/SKILL.md` |

## Typed findings (iter2)

### F-S-01 (iter1: Ideation missing Memory Access Matrix) — Disposition update

- **Disposition**: `addressed`
- **Evidence**: Fix F applied at ideation/SKILL.md L20-37; mirrors preparation tier shape; includes WRITE row enforcement and never-delete clause.

### F-S-02 (iter1: NEEDS_CONTEXT asymmetry) — Disposition update

- **Disposition**: `open` (persists into iter2; was NOT in the 8-fix list)
- **Confidence**: 75 (unchanged)
- **Severity**: High
- **Evidence**: `grep -c "NEEDS_CONTEXT"` counts: ideation=0, preparation=0, planning=0, execution=4, wrap-up=10. Same asymmetry as iter1. The leader-led loops still lack a documented status-enum primitive.
- **Note**: not addressed because not in iter2 scope; carries forward to next REVISE round or deferred per user decision.

### F-S-03 (iter1: Execution evaluation.md output path) — Disposition update

- **Disposition**: `addressed`
- **Evidence**: Fix D — execution/evaluation.md L425 now reads `sessions/{date}-{session-id}/execution/{task-id}/evaluation/iter{n}/{system}/`. `{task-id}/` segment present; matches parent SKILL.md L182,207,266.

### F-S-04 (iter1: phase block ordering polish) — Disposition update

- **Disposition**: `deferred` (Low, unchanged)

## Low-confidence appendix

(none new in iter2)

## Verdict

**REVISE** — F-S-02 (High/75, NEEDS_CONTEXT asymmetry in 3 leader-led loops) persists as `open`. Since this iter2 fix batch did not target it, the per-perspective verdict floor remains REVISE pending a follow-up fix or explicit user defer-to-#258 ruling.
