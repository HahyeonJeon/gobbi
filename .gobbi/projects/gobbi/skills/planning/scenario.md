# Planning Loop — Evaluation Scenarios

Per-perspective GOOD / BAD / ADVERSARIAL discrimination scenarios for a Planning Loop's task
decomposition. The evaluator loads this file at Stage 1 (Scenario-Checklist Frame Build) as
seed scenarios for the seven perspectives.

The evaluation **procedure** — the per-perspective lens definitions, recommended
verifications, perspective anti-patterns, and Overall (Stage 3) anchors — lives in the
sibling `evaluation.md`. The concrete yes/no **checks** each scenario references live 1:1 in
the sibling `checklist.md`, whose heading tree mirrors this file exactly.

The artifact under evaluation is **the Planning working draft**
(`sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md`): the locked Scope Contract
inherited from Ideation, the ordered task list, per-task scope + `inputs:` + `outputs:` +
`verifies:`, the dependency graph, and the agent-type assignment per task. A plan is **judged
against the idea it implements** — the Ideation working draft is required input. Planning is a
**process loop** — the artifact is a plan, not code — so every family below judges **plan
quality**: does every task trace to Ideation, is the decomposition narrow and correctly ordered,
is each task's verification concrete, and can a fresh Executor run any task from the task alone.
Each family carries a `### {ID}` heading, a **Category**, the **Situation** it arises in, the
**Good** outcome, the **Bad / failure** outcome, one **Adversarial** case a real evaluator would
probe, and the **Checklist IDs** whose joint satisfaction proves the scenario handled. Scenario
IDs follow `PLAN-{PERSPECTIVE}-SCENARIO-{NN}`; each check follows `{scenario-id}-CHECK-{NN}` and
lives in `checklist.md`.

---

## Project
_Lens (see `evaluation.md`):_ does the plan implement the **right idea**, the whole idea, and **only** the idea?

### PLAN-PROJ-SCENARIO-01 — Every task traces to Ideation and every Ideation item is covered
**Category:** golden-path
**Situation:** the task list claims to implement the Ideation checklist.
**Good:** each task carries a `traces-to:` field pointing to the Ideation checklist item(s) it implements, and every reference resolves to an item that exists verbatim; no Ideation checklist item is left unaddressed, and any item the plan defers has an explicit backlog routing.
**Bad / failure:** a task has no `traces-to:`, or an Ideation item the plan should cover has no task.
**Adversarial:** an Ideation checklist item is silently left uncovered while the plan still reads as a complete implementation, so a dropped requirement hides behind a full-looking task list.
**Checklist IDs:** `PLAN-PROJ-SCENARIO-01-CHECK-*`

### PLAN-PROJ-SCENARIO-02 — The plan stays inside the Scope Contract and reaches the success criteria
**Category:** golden-path
**Situation:** the plan inherits the Ideation Scope Contract and success criteria.
**Good:** the Scope Contract is copied verbatim (not paraphrased or expanded); no task introduces a requirement not in Ideation; after the last task runs, every Ideation success criterion is satisfied and none is silently dropped.
**Bad / failure:** a success criterion has no task that would satisfy it, or the Scope Contract is reworded in a way that shifts the boundary.
**Adversarial:** a task introduces a new requirement not present in Ideation, expanding scope through the task spec rather than through a user decision.
**Checklist IDs:** `PLAN-PROJ-SCENARIO-02-CHECK-*`

### PLAN-PROJ-SCENARIO-03 — No "while we're here" task slips into the plan
**Category:** failure-mode
**Situation:** the decomposition may pick up adjacent improvements.
**Good:** each task is scrutinized for adjacent-improvement creep; a task that improves neighboring work unrelated to the idea is flagged and re-routed to backlog, not included.
**Bad / failure:** a task bundles an unrelated cleanup with in-scope work.
**Adversarial:** a "while we're here" task that improves adjacent, unrelated work slips into the plan as if it were part of the idea.
**Checklist IDs:** `PLAN-PROJ-SCENARIO-03-CHECK-*`

---

## Structure
_Lens (see `evaluation.md`):_ is the **task decomposition** sound? Are dependencies ordered correctly, task sizes bounded, and agent-type assignments right?

### PLAN-STRUCT-SCENARIO-01 — Tasks are narrow and effort is sized honestly
**Category:** golden-path
**Situation:** the plan breaks the idea into tasks a fresh Executor must grasp in one read.
**Good:** no task spans more than roughly 5-8 files or introduces more than roughly 2 new modules / components; each task title is imperative-form, short, and specific; effort is inferable from `files:` count plus `verifies:` complexity, and total plan effort is sanity-checked against the Ideation Scope Contract size.
**Bad / failure:** a task is too broad to grasp in one read, or its title is vague.
**Adversarial:** a mega-task hides behind implicitly small scope — a multi-step `verifies:` over more than three files — while being described as trivial, so its true size never gets flagged.
**Checklist IDs:** `PLAN-STRUCT-SCENARIO-01-CHECK-*`

### PLAN-STRUCT-SCENARIO-02 — Task dependencies form a DAG with explicit ordering
**Category:** golden-path
**Situation:** tasks depend on one another and must run in an order.
**Good:** dependencies are explicit — each task names which prior task(s) must complete first; the `requires:` graph is acyclic (no cycles); and a topological sort over the `requires:` fields reproduces the documented task order.
**Bad / failure:** the order is stated but no `requires:` fields back it, so the ordering is unverifiable.
**Adversarial:** the task order relies on implicit ordering a reader must infer from context, with no `requires:` fields, so a topological sort does not reproduce the intended order.
**Checklist IDs:** `PLAN-STRUCT-SCENARIO-02-CHECK-*`

### PLAN-STRUCT-SCENARIO-03 — Each task has concrete verification and bounded file-touch
**Category:** failure-mode
**Situation:** each task declares how it will be verified and which files it modifies.
**Good:** each task has a `verifies:` field with a runnable command or file-existence check that yields a clean pass/fail without further interpretation; a `files:` field enumerates the modified paths.
**Bad / failure:** a task's verification needs interpretation to call pass/fail, or its `files:` set is missing.
**Adversarial:** a task secretly modifies a file outside its declared `files:` set, so the real blast radius exceeds what the plan enumerates.
**Checklist IDs:** `PLAN-STRUCT-SCENARIO-03-CHECK-*`

### PLAN-STRUCT-SCENARIO-04 — Agent-type and capability fit the work
**Category:** failure-mode
**Situation:** each task is assigned to an agent type that must be able to do the work.
**Good:** the agent-type assignment is justified by the work's nature and does not contradict the delegation conventions; the assigned agent's tool surface matches the task's needs, its context window matches the artifact size, and its skill-load fits the loaded-skill budget.
**Bad / failure:** a task is assigned an agent type whose permissions or context budget the work exceeds.
**Adversarial:** a very large task is assigned to a smaller-tier agent whose context window or tool surface cannot hold the work, so the assignment reads plausible but the agent cannot actually complete the task.
**Checklist IDs:** `PLAN-STRUCT-SCENARIO-04-CHECK-*`

### PLAN-STRUCT-SCENARIO-05 — Parallel-safety accounts for files and shared resources
**Category:** failure-mode
**Situation:** some tasks are marked parallel-safe.
**Good:** tasks with no file overlap and no dependency are marked parallel-safe; where the docs-cleanup-parallelism rule applies the plan prefers a single sequential pass; parallel-safe tasks also do not contend on shared resources beyond files (shared data stores, ports, worktree directories, rate limits, paid-service quotas), sequential user-decision dependencies block parallelism even when files do not overlap, and shared build / dependency-manifest lock contention is considered.
**Bad / failure:** two parallel-marked tasks contend on a shared resource the plan did not check.
**Adversarial:** two tasks silently modify the same file with conflicting intent — the file-touch sets were never compared, so an overlap runs in parallel with no sequencing or dependency.
**Checklist IDs:** `PLAN-STRUCT-SCENARIO-05-CHECK-*`

---

## Performance
_Lens (see `evaluation.md`):_ does the plan **preserve** the Ideation performance commitments, and does the plan's own execution scale?

### PLAN-PERF-SCENARIO-01 — Perf-sensitive tasks are isolated with measurement-based verification
**Category:** golden-path
**Situation:** some tasks touch paths with Ideation performance budgets.
**Good:** tasks touching perf budgets identified by Ideation have explicit measurement steps in their `verifies:` field, no existing measurement / load check is silently removed, and perf-sensitive changes are isolated tasks with isolated verification.
**Bad / failure:** a perf budget from Ideation has no measurement step in any task's `verifies:`.
**Adversarial:** a perf-sensitive change is bundled into a mixed-concern task, so its verification could pass while masking a non-perf change riding along.
**Checklist IDs:** `PLAN-PERF-SCENARIO-01-CHECK-*`

### PLAN-PERF-SCENARIO-02 — External-call tasks name their handling and plan-time cost is estimated
**Category:** failure-mode
**Situation:** some tasks introduce external calls (network, data-store, disk) during their work or verification.
**Good:** each new external-call task names its batching, its caching, and how it behaves when a call fails or is slow, and cites any defaults inherited from project conventions rather than assuming them silently; verification scaffolding is checked for per-item external calls, and plan-time call counts are estimated where downstream throughput matters.
**Bad / failure:** a new external-call task leaves its batching, caching, or failure / slow-call handling unstated, or inherits a default without citing it.
**Adversarial:** a reasonable-looking task hides a per-item external call in its verification setup that plan-time call-count estimation would have caught.
**Checklist IDs:** `PLAN-PERF-SCENARIO-02-CHECK-*`

---

## Aesthetics
_Lens (see `evaluation.md`):_ is the **plan document itself** readable, consistent, and free of placeholders?

### PLAN-AESTH-SCENARIO-01 — Titles, ordering, and template conform
**Category:** golden-path
**Situation:** the plan document is written to the project's Planning template.
**Good:** task titles are imperative-form, short, and specific with no duplicate task IDs; tasks are listed in execution order and any forward-referenced dependency points downward; section headings match the project's standard Planning template and the field set is consistent across all tasks.
**Bad / failure:** task IDs collide, or the plan diverges from the project's Planning template.
**Adversarial:** a dependency is forward-referenced pointing upward — a later task referenced by an earlier one — so the reader must scroll back to follow the order.
**Checklist IDs:** `PLAN-AESTH-SCENARIO-01-CHECK-*`

### PLAN-AESTH-SCENARIO-02 — No placeholders or empty tasks
**Category:** failure-mode
**Situation:** the plan is ready for review.
**Good:** no `TBD` / `TODO` / `???` remains in any task field; no task has an empty `verifies:` or `outputs:` field; every task has at least one `outputs:` entry and one `verifies:` entry.
**Bad / failure:** a task field is a placeholder, or a task is missing its `verifies:` / `outputs:`.
**Adversarial:** the plan looks complete but a careful reader spots an effectively empty task — one that consists only of a "(see Ideation)" cross-reference with no `outputs:` or `verifies:`.
**Checklist IDs:** `PLAN-AESTH-SCENARIO-02-CHECK-*`

---

## Usage
_Lens (see `evaluation.md`):_ can the **Executor** use this plan without coming back to the user or the Leader?

### PLAN-USAGE-SCENARIO-01 — A fresh Executor can start task N from the task alone
**Category:** golden-path
**Situation:** a fresh Executor is given one task with no other context.
**Good:** every task can be spawned to a fresh subagent — its full context is its `inputs:` field — and executed without parent-session context; each task specifies file paths and, where relevant, function / section anchors; verification and test commands are concrete and runnable as-is.
**Bad / failure:** a task cannot be executed from its own spec without the parent session.
**Adversarial:** a verification command carries a placeholder ("run the tests", `<your test path here>`), so a fresh Executor cannot run it as-is.
**Checklist IDs:** `PLAN-USAGE-SCENARIO-01-CHECK-*`

### PLAN-USAGE-SCENARIO-02 — Failure modes and prerequisites are named, with no surprise dependencies
**Category:** failure-mode
**Situation:** each task may hit failure modes and prerequisites the Executor must know up front.
**Good:** known failure modes are listed in the task spec or its preconditions; every prerequisite is named in `requires:` or `inputs:` — there are no surprise dependencies.
**Bad / failure:** a task hits a failure mode the spec never mentioned.
**Adversarial:** a task has a surprise prerequisite — a dependency named in neither `requires:` nor `inputs:` — that a fresh Executor discovers only at runtime.
**Checklist IDs:** `PLAN-USAGE-SCENARIO-02-CHECK-*`

### PLAN-USAGE-SCENARIO-03 — Inter-task handoff is explicit and terms are defined
**Category:** failure-mode
**Situation:** tasks hand off outputs and use domain terms.
**Good:** the inter-task handoff is explicit — task N's output is task N+1's input — and if a task requires user input mid-execution that is named explicitly (and the plan questions whether the task should be split); any term not in the project glossary is defined inline in the task spec, and acronyms expand on first use within each task.
**Bad / failure:** a mid-execution user-input requirement is unstated, or a domain term is left undefined.
**Adversarial:** a task uses a term not in the project glossary and never defines it inline, so the Executor has to stop and ask "what does X mean here".
**Checklist IDs:** `PLAN-USAGE-SCENARIO-03-CHECK-*`

---

## Consistency
_Lens (see `evaluation.md`):_ do task hand-offs match, do task fields mutually agree, and does the plan trace coherently back to Ideation?

### PLAN-CONS-SCENARIO-01 — Hand-off fields name-match and traces resolve
**Category:** golden-path
**Situation:** tasks hand off via `outputs:` / `inputs:` and cite Ideation via `traces-to:`.
**Good:** the `outputs:` of task N literally name-match the `inputs:` of every downstream consuming task (no paraphrase, no silent rename across the hand-off boundary); each `traces-to:` grepped against the Ideation artifact finds an exact match, and dangling traces are flagged.
**Bad / failure:** a `traces-to:` references an Ideation item that does not exist.
**Adversarial:** a hand-off silently renames a field — task N outputs `schema` while task N+1 inputs `migrated-schema` — so the match cannot be verified mechanically.
**Checklist IDs:** `PLAN-CONS-SCENARIO-01-CHECK-*`

### PLAN-CONS-SCENARIO-02 — Task field schema and tooling are uniform
**Category:** golden-path
**Situation:** every task carries the same field schema and command surface.
**Good:** every task has the same set of fields (no `verifies:` present in some and missing in others) with consistent casing and punctuation; the command / tool surface is uniform across tasks unless a switch is explicit, and path conventions (absolute vs repo-relative) are consistent.
**Bad / failure:** the field set differs between tasks, or tasks mix tool surfaces without explanation.
**Adversarial:** one task uses a different command / tool surface (or path convention) than its siblings with no explicit switch, so the Executor silently mixes conventions.
**Checklist IDs:** `PLAN-CONS-SCENARIO-02-CHECK-*`

### PLAN-CONS-SCENARIO-03 — No task contradicts a sibling's assumption or relies on a later task
**Category:** failure-mode
**Situation:** tasks share invariants and must not depend backwards.
**Good:** task ordering preserves invariants (a task assuming file X exists is sequenced after the task that creates X); renames done by one task are reflected in subsequent tasks' `inputs:` fields; implicit "we'll add this in task N" assumptions are surfaced.
**Bad / failure:** a task assumes a state a sibling has not yet produced.
**Adversarial:** a task implicitly relies on a shape introduced by a later task — a forward dependency — which is a plan-order bug the ordering hides.
**Checklist IDs:** `PLAN-CONS-SCENARIO-03-CHECK-*`

---

## Risk
_Lens (see `evaluation.md`):_ what breaks if **the plan itself** is wrong? Order risk, dependency risk, integration risk, rollback granularity, cross-task cost and continuity.

### PLAN-RISK-SCENARIO-01 — Rollback boundary and interruption-safety are clear
**Category:** golden-path
**Situation:** a mid-plan task may fail verification, or the plan may pause partway.
**Good:** each task can be reverted independently (an atomic commit per task, or a `rollback:` field with concrete steps); a failure between tasks leaves the project in a coherent state; pausing after any task N leaves a valid intermediate state.
**Bad / failure:** a failed task cannot be reverted without unwinding unrelated work.
**Adversarial:** pausing after some task N leaves the project in an incoherent intermediate state — the "stop-after-task-N" snapshot is not a valid state.
**Checklist IDs:** `PLAN-RISK-SCENARIO-01-CHECK-*`

### PLAN-RISK-SCENARIO-02 — Shared-infra, public-interface, and high-blast tasks are isolated and gated
**Category:** failure-mode
**Situation:** some tasks touch shared infrastructure, public interfaces, or high-blast-radius changes.
**Good:** tasks touching CI / build / config are sequenced first so later tasks build on a known-good baseline, and a failure there does not poison parallel work; tasks touching public interfaces are isolated and carry explicit consumer-side migration tasks with no silent widening of a prior task's outputs; migrations, public-interface changes, and dependency upgrades are isolated tasks, each with an explicit go/no-go decision step.
**Bad / failure:** a shared-infra or public-interface change is bundled with ordinary work.
**Adversarial:** a high-blast task (a migration, a public-interface change, or a dependency upgrade) is bundled with ordinary work and carries no go/no-go gate.
**Checklist IDs:** `PLAN-RISK-SCENARIO-02-CHECK-*`

### PLAN-RISK-SCENARIO-03 — Cumulative scope matches Ideation and no task widens a prior task's outputs
**Category:** failure-mode
**Situation:** the plan's cumulative file-touch and per-task outputs must stay bounded.
**Good:** the cumulative files-touched across the plan is comparable to the Ideation Scope Contract's stated scope, and a scope explosion (for example roughly three times the expected file count) is flagged; output fields are checked for monotonic addition against prior task definitions.
**Bad / failure:** the plan's total file-touch far exceeds Ideation's stated scope with no explanation.
**Adversarial:** a task silently widens a prior task's scope by adding to its outputs — "task 2 produces X and Y" where task 1 already promised X — so the same output is claimed twice with drift.
**Checklist IDs:** `PLAN-RISK-SCENARIO-03-CHECK-*`

### PLAN-RISK-SCENARIO-04 — Cost, privacy, observability, and supply-chain continuity across tasks
**Category:** coverage-matrix
**Situation:** the plan spans many tasks that may each carry cost, sensitive data, or new dependencies.
**Good:** tasks that issue paid-service or cloud calls during verification name their token / cost ceilings and no silent cost multiplication is left unbounded (Coverage: Cost); tasks touching PII or regulated data carry that label and the Ideation data-flow boundaries are preserved across the decomposition (Coverage: Privacy); the plan is observable mid-execution — a stuck task is identifiable from session telemetry — and long-running tasks emit intermediate signals (Coverage: Observability); tasks introducing new dependencies are flagged with a `dep-impact:` field and dependency-manifest changes are sequenced first (Coverage: Supply-chain).
**Bad / failure:** a paid-service task has no cost ceiling, or a PII-touching task is unlabeled.
**Adversarial:** twenty tasks each run a paid evaluation during verification with no per-task or plan-total cost ceiling, so cost multiplies twenty-fold on a path no single task flagged.
**Checklist IDs:** `PLAN-RISK-SCENARIO-04-CHECK-*`
