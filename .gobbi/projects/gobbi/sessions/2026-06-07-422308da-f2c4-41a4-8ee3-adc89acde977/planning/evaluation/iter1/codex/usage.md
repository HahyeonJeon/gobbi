## Artifact Summary + Memory reads

This plan will be consumed by fresh executor agents. Usage review asks whether each executor can run its task without reconstructing missing scope, anchors, or verification intent from prior loop artifacts.

Memory reads: plan, locked Idea, readiness report, target files, read-only consistency files, planning evaluation frame, and relevant project mistakes about executor-facing path and anchor precision.

## Locked Frame (Stage 1)

Scenario U1: a fresh executor can execute each task from the task block.
- Check: edit paths are exact.
- Check: section anchors are exact.
- Check: verification criteria are concrete.

Scenario U2 (adversarial): a verification task tells the executor to check a line that is false at baseline.
- Check: read-only anchors are current against live files.
- Check: no verification criterion can trigger unnecessary out-of-scope repair work.

## Per-scenario per-check results

U1: PARTIAL. The main edit paths and anchors are usable. The SKILL.md read-only anchor is wrong.

U2: FAIL. T4 instructs the executor to verify `orchestration/SKILL.md:247`, which is not the pointer line in the live file.

## Typed findings

### COD-USAGE-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`design_flaw` / `executor-usability` / `100` / `High` / T4 requires verifying that `orchestration/SKILL.md:247` still references `auto-mode.md §3` and `§6` (`planning/rawdata/draft-iter1.md:135`). The readiness report says Planning should correct that reference to line 266 if it reproduces the anchors table (`preparation/artifacts/readiness.md:169`-`171`). The live file shows the pointer at line 266 (`.gobbi/projects/gobbi/skills/orchestration/SKILL.md:263`-`266`). / A fresh executor cannot make T4 pass as written. The task is read-only, so the executor has no valid in-scope way to satisfy the line-247 criterion. / Correct T4 to verify line 266 or a heading/section anchor, and state explicitly that the content is what matters while the file remains unedited.

## Low-confidence appendix

No low-confidence usage findings.
