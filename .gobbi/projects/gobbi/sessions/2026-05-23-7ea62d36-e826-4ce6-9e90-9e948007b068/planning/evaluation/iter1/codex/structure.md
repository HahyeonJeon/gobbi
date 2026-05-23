---
loop: planning
iter: 1
system: codex
perspective: structure
verdict: revise
---

# Structure Perspective - Planning Evaluation Iter 1

## Artifact Summary + Memory reads

The Planning draft decomposes the locked Idea into seven Execution tasks with task IDs, `requires`, `files`, `inputs`, `outputs`, and `verifies` blocks. The structural question is whether those tasks form an executable DAG with bounded file scopes and machine-checkable success criteria.

Memory reads: same register as `project.md`, plus targeted `rg` checks over task IDs, `requires`, placeholder paths, and verifier lines in `planning/rawdata/draft-iter1.md`.

W/W/H gate: clear. Phase match: planning.

## Locked Frame (Stage 1)

Scenario 1: Task dependencies form a DAG.
- Check: every `requires` reference names an existing task ID.
- Check: topological order matches the documented execution order.

Scenario 2: File scopes are bounded and conflict-aware.
- Check: each task has a `files:` block naming intended paths.
- Check: overlapping file touch sets are either sequenced or merged.

Scenario 3: Verification is concrete.
- Check: every task has a `verifies:` block.
- Check: commands avoid literal placeholders or paths that cannot resolve from the expected execution root.

Scenario 4 (adversarial): A dynamic staging path masquerades as a concrete file.
- Check: conditional staging outputs are either expressed as a directory contract or use absolute main-tree paths and a concrete manifest.

Coverage matrix seeds: dependency supply chain is not applicable because no new third-party dependency is introduced. Observability applies to execution progress and is addressed by the task/PR split plus Task 07 sweep. Supply-chain and shared-resource issues are also checked under Risk.

## Per-scenario per-check results

Scenario 1: PASS. Task IDs are defined at `draft-iter1.md:143`, `169`, `195`, `225`, `255`, `285`, and `331`. `requires` references point only to those IDs at `draft-iter1.md:201`, `262`, `293`, and `336`. The dependency table at `draft-iter1.md:368-374` and effective order at `draft-iter1.md:394-398` are topologically valid. No cycle detected.

Scenario 2: PASS. Tasks 02/05 overlap on `memorization/SKILL.md` and are sequenced by Task 05 requiring Task 02 at `draft-iter1.md:262` with a conflict flag at `draft-iter1.md:378`. Tasks 01/06 overlap on `gobbi/SKILL.md` and are sequenced by Task 06 requiring Task 01 at `draft-iter1.md:293` with a conflict flag at `draft-iter1.md:379`.

Scenario 3: FAIL. Most tasks have grep/awk/test based verification blocks. However Task 05's backlog file check uses `test -f sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/planning/staging/backlogs/project/normalize-path-conventions-h3.md` at `draft-iter1.md:278`. From repo root, the real session tree is under `.gobbi/projects/gobbi/sessions/...`, and the Codex path-discipline mistake requires main-tree absolute paths for session writes. Task 07 also declares `sessions/2026-05-23-.../planning/staging/decisions/{slug}.md` at `draft-iter1.md:338`, which contains both an ellipsis and an unresolved slug placeholder.

Scenario 4: FAIL. Conditional staging can be dynamic, but the plan needs a concrete directory contract. The literal ellipsis in Task 07's `files:` block cannot be checked mechanically, and Task 05's verifier would not prove the intended main-tree file exists.

## Typed findings

### COD-STRUCT-001 - Session staging paths are not machine-verifiable

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:278` uses `test -f sessions/...` instead of the main-tree absolute session path; `draft-iter1.md:338` uses `sessions/2026-05-23-.../planning/staging/decisions/{slug}.md`. A `find` of the actual planning tree shows no `planning/staging/backlogs` file yet, and the existing session root is `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/...`.
- Why it matters: the task success criteria are supposed to be grep/sed/find-able. These paths are not executable as written and can repeat the known session-write-path failure class.
- FP check: not style preference; this is a direct command/path defect. It is in scope because the user explicitly asked for machine-verifiable success criteria and main-tree path discipline.

Structure verdict: REVISE. The DAG itself is sound, but COD-STRUCT-001 is High confidence / High severity.

## Low-confidence appendix

None.
