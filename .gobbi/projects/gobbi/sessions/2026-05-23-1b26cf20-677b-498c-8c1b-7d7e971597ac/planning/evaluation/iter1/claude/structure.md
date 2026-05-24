---
phase: planning
iter: 1
system: claude
perspective: structure
verdict: REVISE
---

# Structure — Planning iter1 evaluation (Claude)

## Artifact Summary + Memory reads

Same as project.md.

## Locked Frame (Stage 1)

From `skills/planning/evaluation.md` § Structure:

S-S1 — Tasks narrow enough (≤ ~5-8 files, ≤ ~2 new modules)
S-S2 — Task dependencies form a DAG; no cycles, no implicit ordering
S-S3 — Each `verifies:` is concrete + runnable
S-S4 — Files-touched per task bounded; no silent overflow
S-S5 — Agent type per task matches the work
S-S6 — Parallelizable tasks identified
S-S7 (adversarial) — No two tasks silently modify same file with conflicting intent without explicit edge
S-S8 — Effort estimate realism (evaluator-internal heuristic)
S-S9 — Agent capability/tool fit
S-S10 — Parallel feasibility beyond file overlap

## Per-scenario per-check results

| Scenario | Result | Notes |
|---|---|---|
| S-S1 | PASS | Task 04 touches 2 files; Task 05 touches 5 files; Task 10 touches 2 files; others 1 file. Max files = 5 (Task 05) — within ≤5-8 budget. |
| S-S2 | PARTIAL | DAG check passes for declared edges, but two missing edges (see F-STRUCT-1, F-STRUCT-2). |
| S-S3 | PASS | Every `verifies:` block has runnable `grep`/`test`/`jq`/`bash -n`/`shellcheck` commands. |
| S-S4 | PASS | `files:` enumeration matches `what:` description in every task. |
| S-S5 | PASS | All executor-sonnet; rationale at line 462 is sound (no sub-decomposition, no rename-only work). |
| S-S6 | PASS | Lane table identifies L1-L6 with file-overlap conflict flags. |
| S-S7 | FAIL | See F-STRUCT-1 + F-STRUCT-2 below. |
| S-S8 | REVISE | See F-STRUCT-3 (Tasks 07 + 08 both "Large", multiple concerns each, may warrant sub-decomposition). |
| S-S9 | PASS | Hook script + reconstructor — executor has Write/Bash/Edit tools, can author shell + JSON. WebFetch directive present for fresh hooks contract. |
| S-S10 | PASS — minor caveat | settings.json (Task 09) is workspace-shared but only touched by Task 09. flock contention noted in scripts themselves. |

## Typed findings

### F-STRUCT-1 — Missing dep edge 06 → 07 leaves LOCK #1 (strict T1→T3 ordering) under-enforced

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: § Dependency table line 386: `06-direct-mode-opt-out-and-smoke-test | 01 | — | ...` — Task 06's `Blocks:` is empty. Line 387: `07-post-tool-use-agents-hook-script | 05 (per LOCK #1 — strict T1→T3 wave ordering) | ...`. The plan documents LOCK #1 as "strict sequential T1-wave (Tasks 01-06) then T3-wave (07-10)" (lines 398, 404, 488), but the dependency graph only forces 05 → 07. Task 06 is part of the T1 wave (per lane L2) but the executor following the dependency graph could legitimately start Task 07 while Task 06 has not yet been executed (both 06 and 07 satisfy their declared `requires:` once 05 lands).
- Why it matters: the strict-ordering lock is documented in prose but not enforced by the dependency graph. A sequential executor walking the topo-sort by `requires:` could interleave 07 in the middle of L2. The plan's own line 398 claims "strict ordering avoids any interleaving ambiguity" — but the graph permits interleaving. This is exactly the kind of "implicit task ordering" anti-pattern called out in `planning/evaluation.md` § Structure anti-patterns ("If a reader has to infer order from context, the order field is missing").
- Suggested direction: add `06` to Task 07's `requires:` (alongside 05), OR add an explicit `wave-gate:` field that Task 07 reads as "wait for all of {01,02,03,04,05,06}". Either makes the strict lock executable.

### F-STRUCT-2 — Missing dep edge 06 → 10 (or 10 → 06) for shared `orchestration/SKILL.md` edits

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 75
- Severity: Medium
- Evidence: Tasks 01, 06, 10 all modify `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`. The draft flags this on line 394: `⚠ Tasks 01, 06, 10 all touch orchestration/SKILL.md ... Sequential, not parallel-safe. Dependency edges enforce ordering: 01 → 06 (foot-note follows row 5.5 insertion) and 01 → 10 (row 6 follows row 5.5).` Notice: 06 ↔ 10 ordering is NOT enforced. The draft asserts "sequential" but the graph permits 10 to run before 06 (both only require 01 from T1).
- Why it matters: even with surgical Edit-tool slot-based edits to row 5.5 / row 5.5 footnote / row 6 narrative, if Task 06 hasn't yet inserted the row-5.5 footnote when Task 10 begins editing row 6, the relative anchors shift between executor invocations. The Edit tool finds-and-replaces on exact substring match; subsequent edits become brittle. Per `planning/evaluation.md` adversarial scenario: "Two tasks silently modify the same file with conflicting intent / File-touch sets are compared across tasks; overlaps either become sequenced or get merged."
- Suggested direction: add `06` to Task 10's `requires:` (preferred — T3 wave at end), so the orchestration/SKILL.md edit chain is 01 → 06 → 10.

### F-STRUCT-3 — Tasks 07 + 08 both Large + LOCK #2 forces shared executor — risks mega-task

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 75
- Severity: Medium
- Evidence: Task 07 `what:` (lines 271-272) packs: bash strict-mode + jq + flock + PostToolUse + PostToolUseFailure stdin handling + two-tier extraction + structured-header parsing + upsert + resolver step-(ii) + header comments codifying conventions. `effort: Large`. Task 08 (lines 296-297) packs: bash + jq + flock + transcript jsonl scan + Task-spawn-event iteration + idempotent upsert + orphan-report. `effort: Large`. LOCK #2 forces both to be executed back-to-back in a single delegation under one executor. `planning/SKILL.md:187` defines medium-granularity as "one executor spawn, one meaningful commit, typically 2-5 files touched, ~15-60 minutes of focused work." Two Large tasks back-to-back = one spawn for likely 60-120 min and 2 commits (or 1 bundled commit).
- Why it matters: `planning/evaluation.md` § Structure anti-pattern: *"'This task is trivial, no decomposition needed' — If verification is multi-step, the task is multi-step."* Task 07 `verifies:` has 5 separate steps including a manual fixture smoke test. The shared-executor lock is rational (jq snippets + stdin contract continuity), but the cost is a delegation that violates the single-task-per-spawn norm. Per `leader-iter2-verification-claim-without-evidence.md`, executor context pressure at the end of a Large task tends to compress verification.
- Suggested direction: surface as a known risk in the Execution loop's brief — the single delegation must explicitly bracket each task's `verifies:` block separately, with intermediate commit. OR re-litigate LOCK #2 with the user, framing the cost (60-120 min single spawn).

### F-STRUCT-4 — `effort:` field present despite not being canonical schema

- Type: `general`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: Low
- Evidence: same as project F-PROJ-2.
- Why it matters: structure-perspective consequence: the `effort:` value is read by humans as load-bearing (e.g., Task 07 vs Task 02 sizing). But per `planning/evaluation.md:88-91` "effort" should be evaluator-internal-only, derived from `files:` + `verifies:` complexity. Two sources of truth.

## Low-confidence appendix

(none)

## Verdict

**REVISE** — High-severity dep-graph gap (F-STRUCT-1) leaves LOCK #1 declaratively but not operationally enforced. Two additional Medium-Low items.
