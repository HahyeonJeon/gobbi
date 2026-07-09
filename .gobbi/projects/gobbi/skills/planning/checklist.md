# Planning Loop — Evaluation Checklist

> **Copy-then-tick — this file is the source; the evaluator copies it.** At Stage 0 the
> evaluator COPIES this file to
> `sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{system}/checklist.md`. The
> filled copy is a real **9th evaluation-output file**, alongside the seven per-perspective
> files + `overall.md`. The source here ships with every box UNCHECKED.
>
> **A ticked box = VERIFIED, not "done".** `- [x]` means the evaluator VERIFIED the check
> against the Planning draft with the strongest verification the check admits (close-read the
> task list / diff the Ideation checklist against the task list / `grep` a `traces-to:` against
> the Ideation artifact / compare `inputs:`/`outputs:` across hand-offs) — never that work merely
> happened.
>
> **Fill procedure.** Stage 0: copy (boxes unchecked). Stage 1: append a `## Stage 1 Additions`
> section for any scenario or check the Frame added that is not seeded here. Stage 2: tick each
> box `[x]` and annotate its outcome — `PASS:` (verified satisfied), `FAIL: {finding-id}`
> (verified violated, cite the finding), or `n/a: {reason}` (not applicable to this plan). The
> completeness gate requires every box resolved to exactly one of the three.
>
> **Legend.** `- [ ]` unresolved · `- [x] … PASS:` verified satisfied · `- [x] … FAIL: {finding-id}`
> verified violated · `- [x] … n/a: {reason}` not applicable. Record per-perspective counts
> (PASS / FAIL / n/a / total) in the filled copy's compact per-scenario results table.

The scenario families, their lenses, and the adversarial cases these checks discriminate live
in the sibling `scenario.md`; the evaluation procedure lives in `evaluation.md`. The heading
tree below is 1:1 with `scenario.md`.

---

## Project

### PLAN-PROJ-SCENARIO-01 — Every task traces to Ideation and every Ideation item is covered
- [ ] PLAN-PROJ-SCENARIO-01-CHECK-01 — Each task carries a `traces-to:` field pointing to the Ideation checklist item(s) it implements.
- [ ] PLAN-PROJ-SCENARIO-01-CHECK-02 — Every `traces-to:` reference resolves to an Ideation checklist item that exists verbatim.
- [ ] PLAN-PROJ-SCENARIO-01-CHECK-03 — No Ideation checklist item is left unaddressed by the task list.
- [ ] PLAN-PROJ-SCENARIO-01-CHECK-04 — Backlog routing exists for any Ideation item the plan defers.

### PLAN-PROJ-SCENARIO-02 — The plan stays inside the Scope Contract and reaches the success criteria
- [ ] PLAN-PROJ-SCENARIO-02-CHECK-01 — The Ideation Scope Contract is copied verbatim, not paraphrased or expanded.
- [ ] PLAN-PROJ-SCENARIO-02-CHECK-02 — No task introduces a new requirement not present in Ideation.
- [ ] PLAN-PROJ-SCENARIO-02-CHECK-03 — After the last task runs, every Ideation success criterion is satisfied.
- [ ] PLAN-PROJ-SCENARIO-02-CHECK-04 — No Ideation success criterion is silently dropped.

### PLAN-PROJ-SCENARIO-03 — No "while we're here" task slips into the plan
- [ ] PLAN-PROJ-SCENARIO-03-CHECK-01 — Each task is scrutinized for adjacent-improvement creep.
- [ ] PLAN-PROJ-SCENARIO-03-CHECK-02 — A task that improves neighboring work unrelated to the idea is flagged and re-routed to backlog, not included in the plan.

---

## Structure

### PLAN-STRUCT-SCENARIO-01 — Tasks are narrow and effort is sized honestly
- [ ] PLAN-STRUCT-SCENARIO-01-CHECK-01 — No task spans more than roughly 5-8 files.
- [ ] PLAN-STRUCT-SCENARIO-01-CHECK-02 — No task introduces more than roughly 2 new modules / components.
- [ ] PLAN-STRUCT-SCENARIO-01-CHECK-03 — Each task title is imperative-form, short, and specific.
- [ ] PLAN-STRUCT-SCENARIO-01-CHECK-04 — Effort per task is inferable from `files:` count plus `verifies:` complexity.
- [ ] PLAN-STRUCT-SCENARIO-01-CHECK-05 — A task with a multi-step `verifies:` touching more than three files is treated as large regardless of how it is described.
- [ ] PLAN-STRUCT-SCENARIO-01-CHECK-06 — Total plan effort is sanity-checked against the Ideation Scope Contract size.

### PLAN-STRUCT-SCENARIO-02 — Task dependencies form a DAG with explicit ordering
- [ ] PLAN-STRUCT-SCENARIO-02-CHECK-01 — Dependencies are explicit — each task names which prior task(s) must complete first.
- [ ] PLAN-STRUCT-SCENARIO-02-CHECK-02 — The `requires:` graph is acyclic (no cycles).
- [ ] PLAN-STRUCT-SCENARIO-02-CHECK-03 — A topological sort over the `requires:` fields reproduces the documented task order.

### PLAN-STRUCT-SCENARIO-03 — Each task has concrete verification and bounded file-touch
- [ ] PLAN-STRUCT-SCENARIO-03-CHECK-01 — Each task has a `verifies:` field with a runnable command or file-existence check.
- [ ] PLAN-STRUCT-SCENARIO-03-CHECK-02 — Each task's verification produces a clean pass/fail without further interpretation.
- [ ] PLAN-STRUCT-SCENARIO-03-CHECK-03 — A `files:` field enumerates the modified paths per task.
- [ ] PLAN-STRUCT-SCENARIO-03-CHECK-04 — No task modifies a file outside its declared `files:` set.

### PLAN-STRUCT-SCENARIO-04 — Agent-type and capability fit the work
- [ ] PLAN-STRUCT-SCENARIO-04-CHECK-01 — Each task's agent-type assignment is justified by the work's nature (executor / leader / evaluator / assistant).
- [ ] PLAN-STRUCT-SCENARIO-04-CHECK-02 — No agent-type assignment contradicts the delegation conventions.
- [ ] PLAN-STRUCT-SCENARIO-04-CHECK-03 — The assigned agent's tool surface (file writes, network, subprocess) matches the task's needs.
- [ ] PLAN-STRUCT-SCENARIO-04-CHECK-04 — The assigned agent's context window matches the artifact size the task must hold.
- [ ] PLAN-STRUCT-SCENARIO-04-CHECK-05 — The task's required skill-load fits the agent's loaded-skill budget (no unexplained 12-skill task).

### PLAN-STRUCT-SCENARIO-05 — Parallel-safety accounts for files and shared resources
- [ ] PLAN-STRUCT-SCENARIO-05-CHECK-01 — Tasks with no file overlap and no dependency are marked parallel-safe.
- [ ] PLAN-STRUCT-SCENARIO-05-CHECK-02 — Where the docs-cleanup-parallelism rule applies, the plan prefers a single sequential pass.
- [ ] PLAN-STRUCT-SCENARIO-05-CHECK-03 — Parallel-safe tasks do not contend on shared resources beyond files (shared data stores, ports, worktree directories, rate limits, paid-service quotas).
- [ ] PLAN-STRUCT-SCENARIO-05-CHECK-04 — Sequential user-decision dependencies block parallelism even when files do not overlap.
- [ ] PLAN-STRUCT-SCENARIO-05-CHECK-05 — Shared build / dependency-manifest lock contention is considered before marking tasks parallel.
- [ ] PLAN-STRUCT-SCENARIO-05-CHECK-06 — File-touch sets are compared across tasks, and any overlap is sequenced or the tasks are merged.
- [ ] PLAN-STRUCT-SCENARIO-05-CHECK-07 — No "task N+1 expects task N's edits" hand-off exists without an explicit dependency.

---

## Performance

### PLAN-PERF-SCENARIO-01 — Perf-sensitive tasks are isolated with measurement-based verification
- [ ] PLAN-PERF-SCENARIO-01-CHECK-01 — Tasks touching perf budgets identified by Ideation have explicit measurement steps in their `verifies:` field.
- [ ] PLAN-PERF-SCENARIO-01-CHECK-02 — No existing measurement / load check is silently removed.
- [ ] PLAN-PERF-SCENARIO-01-CHECK-03 — Perf-sensitive changes are isolated tasks with isolated verification.
- [ ] PLAN-PERF-SCENARIO-01-CHECK-04 — No mixed-concern task exists where a perf check might mask a non-perf change.

### PLAN-PERF-SCENARIO-02 — External-call tasks name their handling and plan-time cost is estimated
- [ ] PLAN-PERF-SCENARIO-02-CHECK-01 — Each new external-call task names its batching behavior where repeated work matters.
- [ ] PLAN-PERF-SCENARIO-02-CHECK-02 — Each new external-call task names its caching / reuse behavior where repeated work matters.
- [ ] PLAN-PERF-SCENARIO-02-CHECK-03 — Each new external-call task names how the plan behaves when the call is slow or fails.
- [ ] PLAN-PERF-SCENARIO-02-CHECK-04 — Defaults inherited from project conventions are explicitly cited, not silently assumed.
- [ ] PLAN-PERF-SCENARIO-02-CHECK-05 — Verification scaffolding is checked for hidden per-item external calls.
- [ ] PLAN-PERF-SCENARIO-02-CHECK-06 — Plan-time call counts are estimated where downstream throughput matters.

---

## Aesthetics

### PLAN-AESTH-SCENARIO-01 — Titles, ordering, and template conform
- [ ] PLAN-AESTH-SCENARIO-01-CHECK-01 — Task titles are imperative-form, short, and specific.
- [ ] PLAN-AESTH-SCENARIO-01-CHECK-02 — No duplicate task IDs.
- [ ] PLAN-AESTH-SCENARIO-01-CHECK-03 — Tasks are listed in execution order.
- [ ] PLAN-AESTH-SCENARIO-01-CHECK-04 — Forward-referenced dependencies point downward, not upward.
- [ ] PLAN-AESTH-SCENARIO-01-CHECK-05 — Section headings match the project's standard Planning template.
- [ ] PLAN-AESTH-SCENARIO-01-CHECK-06 — The field set is consistent across all tasks.

### PLAN-AESTH-SCENARIO-02 — No placeholders or empty tasks
- [ ] PLAN-AESTH-SCENARIO-02-CHECK-01 — No `TBD` / `TODO` / `???` remains in any task field.
- [ ] PLAN-AESTH-SCENARIO-02-CHECK-02 — No task has an empty `verifies:` or `outputs:` field.
- [ ] PLAN-AESTH-SCENARIO-02-CHECK-03 — Every task has at least one `outputs:` entry and one `verifies:` entry.
- [ ] PLAN-AESTH-SCENARIO-02-CHECK-04 — No task consists only of a "(see Ideation)" cross-reference.

---

## Usage

### PLAN-USAGE-SCENARIO-01 — A fresh Executor can start task N from the task alone
- [ ] PLAN-USAGE-SCENARIO-01-CHECK-01 — Every task can be spawned to a fresh subagent (full context = its `inputs:` field) and executed without parent-session context.
- [ ] PLAN-USAGE-SCENARIO-01-CHECK-02 — Each task specifies file paths and, where relevant, function / section anchors.
- [ ] PLAN-USAGE-SCENARIO-01-CHECK-03 — Verification and test commands are concrete (not "run the tests"), not placeholders.
- [ ] PLAN-USAGE-SCENARIO-01-CHECK-04 — Verification commands are runnable as-is, with no `<your test path here>`-style placeholders.

### PLAN-USAGE-SCENARIO-02 — Failure modes and prerequisites are named, with no surprise dependencies
- [ ] PLAN-USAGE-SCENARIO-02-CHECK-01 — Known failure modes are listed in the task spec or its preconditions.
- [ ] PLAN-USAGE-SCENARIO-02-CHECK-02 — Every prerequisite is named in `requires:` or `inputs:` — there are no surprise dependencies.

### PLAN-USAGE-SCENARIO-03 — Inter-task handoff is explicit and terms are defined
- [ ] PLAN-USAGE-SCENARIO-03-CHECK-01 — The inter-task handoff is explicit — task N's output is task N+1's input.
- [ ] PLAN-USAGE-SCENARIO-03-CHECK-02 — If a task requires user input mid-execution, that is named explicitly (and the plan questions whether the task should be split).
- [ ] PLAN-USAGE-SCENARIO-03-CHECK-03 — Any term not in the project glossary is defined inline in the task spec, and acronyms expand on first use within each task.

---

## Consistency

### PLAN-CONS-SCENARIO-01 — Hand-off fields name-match and traces resolve
- [ ] PLAN-CONS-SCENARIO-01-CHECK-01 — The `outputs:` of task N literally name-match the `inputs:` of every downstream consuming task (name match, not paraphrase).
- [ ] PLAN-CONS-SCENARIO-01-CHECK-02 — No field is silently renamed across a hand-off boundary.
- [ ] PLAN-CONS-SCENARIO-01-CHECK-03 — Each `traces-to:` grepped against the Ideation artifact finds an exact match.
- [ ] PLAN-CONS-SCENARIO-01-CHECK-04 — Dangling traces (referencing items the Ideation does not have) are flagged.

### PLAN-CONS-SCENARIO-02 — Task field schema and tooling are uniform
- [ ] PLAN-CONS-SCENARIO-02-CHECK-01 — Every task has the same set of fields (no `verifies:` present in some and missing in others).
- [ ] PLAN-CONS-SCENARIO-02-CHECK-02 — Field names use consistent casing and punctuation across tasks.
- [ ] PLAN-CONS-SCENARIO-02-CHECK-03 — The command / tool surface is uniform across tasks unless a switch is explicit.
- [ ] PLAN-CONS-SCENARIO-02-CHECK-04 — Path conventions (absolute vs repo-relative) are consistent across tasks.

### PLAN-CONS-SCENARIO-03 — No task contradicts a sibling's assumption or relies on a later task
- [ ] PLAN-CONS-SCENARIO-03-CHECK-01 — Task ordering preserves invariants (a task assuming file X exists is sequenced after the task that creates X).
- [ ] PLAN-CONS-SCENARIO-03-CHECK-02 — Renames done by one task are reflected in subsequent tasks' `inputs:` fields.
- [ ] PLAN-CONS-SCENARIO-03-CHECK-03 — Forward dependencies (a later task influencing an earlier task's setup) are detected and flagged as plan-order bugs.
- [ ] PLAN-CONS-SCENARIO-03-CHECK-04 — Implicit "we'll add this in task N" assumptions are surfaced.

---

## Risk

### PLAN-RISK-SCENARIO-01 — Rollback boundary and interruption-safety are clear
- [ ] PLAN-RISK-SCENARIO-01-CHECK-01 — Each task can be reverted independently (an atomic commit per task, or a `rollback:` field with concrete steps).
- [ ] PLAN-RISK-SCENARIO-01-CHECK-02 — A failure between tasks leaves the project in a coherent state.
- [ ] PLAN-RISK-SCENARIO-01-CHECK-03 — Pausing after any task N leaves the project in a coherent state.
- [ ] PLAN-RISK-SCENARIO-01-CHECK-04 — The "stop-after-task-N" snapshot is a valid intermediate state.

### PLAN-RISK-SCENARIO-02 — Shared-infra, public-interface, and high-blast tasks are isolated and gated
- [ ] PLAN-RISK-SCENARIO-02-CHECK-01 — Tasks touching CI / build / config are sequenced first, so subsequent tasks build on a known-good baseline.
- [ ] PLAN-RISK-SCENARIO-02-CHECK-02 — A failure in a shared-infra task does not poison parallel work.
- [ ] PLAN-RISK-SCENARIO-02-CHECK-03 — Tasks touching public interfaces are isolated and carry explicit consumer-side migration tasks.
- [ ] PLAN-RISK-SCENARIO-02-CHECK-04 — No task silently widens a prior task's outputs at a public-interface boundary.
- [ ] PLAN-RISK-SCENARIO-02-CHECK-05 — Migrations, public-interface changes, and dependency upgrades are isolated tasks.
- [ ] PLAN-RISK-SCENARIO-02-CHECK-06 — Each high-blast task has an explicit go/no-go decision step.

### PLAN-RISK-SCENARIO-03 — Cumulative scope matches Ideation and no task widens a prior task's outputs
- [ ] PLAN-RISK-SCENARIO-03-CHECK-01 — Cumulative files-touched across the plan is comparable to the Ideation Scope Contract's stated scope.
- [ ] PLAN-RISK-SCENARIO-03-CHECK-02 — A scope explosion (for example roughly three times the expected file count) is flagged.
- [ ] PLAN-RISK-SCENARIO-03-CHECK-03 — Output fields are checked for monotonic addition against prior task definitions.
- [ ] PLAN-RISK-SCENARIO-03-CHECK-04 — No "task 2 produces X and Y" exists where task 1 already promised X.

### PLAN-RISK-SCENARIO-04 — Cost, privacy, observability, and supply-chain continuity across tasks
- [ ] PLAN-RISK-SCENARIO-04-CHECK-01 — Tasks that issue paid-service / cloud calls during verification name their token / cost ceilings (Coverage: Cost).
- [ ] PLAN-RISK-SCENARIO-04-CHECK-02 — No silent multiplication of cost across tasks (e.g. many tasks each running a paid evaluation) is left unbounded (Coverage: Cost).
- [ ] PLAN-RISK-SCENARIO-04-CHECK-03 — Tasks that touch PII or regulated data carry that label so Execution can prioritize verification (Coverage: Privacy).
- [ ] PLAN-RISK-SCENARIO-04-CHECK-04 — Data-flow boundaries from Ideation are preserved across the task decomposition (Coverage: Privacy).
- [ ] PLAN-RISK-SCENARIO-04-CHECK-05 — The plan is observable mid-execution — a stuck task is identifiable from session telemetry (Coverage: Observability).
- [ ] PLAN-RISK-SCENARIO-04-CHECK-06 — Long-running tasks emit intermediate signals, not an all-or-nothing report (Coverage: Observability).
- [ ] PLAN-RISK-SCENARIO-04-CHECK-07 — Tasks introducing new dependencies are flagged with a `dep-impact:` field (Coverage: Supply-chain).
- [ ] PLAN-RISK-SCENARIO-04-CHECK-08 — Dependency-manifest / vendor changes are sequenced first so subsequent tasks build on a stable dependency graph (Coverage: Supply-chain).
