# Planning Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `planning`. Provides per-perspective **seed scenarios with attached checklists** + **recommended tool verifications** + **perspective-specific anti-patterns** for a Planning Loop's task decomposition.

The artifact under evaluation is the leader's plan at `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md`. It contains: the locked Scope Contract (inherited from Ideation), ordered task list, per-task scope + inputs + outputs + verification criteria, dependency graph, agent-type assignment per task. Scope Contract schema canonical at `evaluation/SKILL.md` § Scope Contract Schema.

A plan is **judged against the idea it implements**. The Ideation working draft is required input — without it, every perspective's evaluation is shallow. Scenarios include adversarial cases (mis-ordered tasks, dangling traces, hidden coupling) so Stage 2 walks each Frame once without a separate adversarial pass.

---

## Project

**Lens**: Does the plan implement the **right idea**, the whole idea, and **only** the idea?

### Seed scenarios with attached checklists

**Every task traces to at least one Ideation checklist item**
- Each task has a `traces-to:` field pointing to the Ideation checklist item(s) it implements
- Every `traces-to:` reference points to an Ideation checklist item that exists verbatim

**Every Ideation checklist item is covered by at least one task**
- No checklist item from Ideation is unaddressed by the task list
- Backlog routing exists for any items the plan defers

**No task implements something outside the Ideation Scope Contract**
- Scope Contract from Ideation is copied verbatim, not paraphrased or expanded
- No task introduces a new requirement not in Ideation

**The plan's terminal state matches the Ideation success criteria**
- After the last task runs, every Ideation success criterion is satisfied
- No success criterion is silently dropped

**A "while we're here" task slips into the plan (adversarial)**
- Each task is scrutinized for adjacent-improvement creep
- Tasks that improve neighboring code unrelated to the idea are flagged and re-routed to backlog

### Recommended verifications

| Tool | Use for |
|---|---|
| Diff Ideation checklist vs plan task list | Detect orphaned items or scope expansion mechanically |
| Read the Ideation Scope Contract alongside the plan | Confirm phrasing identity |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"While we're here" tasks** | A task that improves something adjacent but unrelated is scope creep. Re-route to backlog, do not include in plan |
| **Re-framing the idea during planning** | If the plan reveals the idea was wrong, return to Ideation — do not silently re-frame inside Planning |

---

## Structure

**Lens**: Is the **task decomposition** sound? Are dependencies ordered correctly? Is the agent-type assignment per task right?

### Seed scenarios with attached checklists

**Every task is narrow enough that a fresh Executor grasps its scope in one read**
- No task spans more than ~5–8 files (gstack plan-eng-review smell)
- No task introduces more than ~2 new classes / modules (gstack plan-eng-review smell)
- Task title is imperative-form, short, and specific

**Task dependencies form a DAG — no cycles, no implicit ordering**
- Dependencies are explicit — each task names which prior task(s) must complete first
- A topological sort over `requires:` fields produces the documented task order

**Each task's verification step is concrete**
- Each task has a `verifies:` field with a runnable command or file-existence check
- Verification can produce a clean pass/fail without further interpretation

**Files-touched per task are bounded — large tasks are split**
- A `files:` field (or equivalent) enumerates the modified paths per task
- No task secretly modifies a file outside its declared `files:` set

**Agent type per task matches the work's nature**
- Agent-type assignment per task is justified (executor for code, leader for ideation/research/planning, evaluator for assessment, assistant for narrow lookups)
- No agent-type assignment that contradicts `_delegation` conventions

**Parallelizable tasks are identified as such**
- Tasks with no file overlap and no dependency are marked parallel-safe
- Where the docs-cleanup-parallelism rule applies, the plan prefers a single sequential pass

**Two tasks silently modify the same file with conflicting intent (adversarial)**
- File-touch sets are compared across tasks; overlaps either become sequenced or get merged
- No "task N+1 expects task N's edits" without explicit dependency

**Effort estimate realism** *(evaluator-internal heuristic — not a task schema field; `effort` does not appear in the canonical task YAML)*
- The evaluator infers effort sizing from `files:` count + `verifies:` complexity (e.g., S = single-file + single-command; L = multi-file + multi-step verification)
- Mega-tasks hidden behind implicitly small scope are flagged — when `verifies:` is multi-step and `files:` touches > 3 paths, the task is large regardless of how it is described
- Total plan effort is sanity-checked against the Ideation Scope Contract size

**Agent capability / tool fit**
- Each task's assigned agent type can actually do the work — required tool surface (e.g., file writes, network, subprocess) matches agent permissions
- Required context window matches the artifact size the agent must hold (e.g., very large refactor → leader-tier model, not haiku-tier)
- Required skills load fits within agent's loaded-skill budget (no "this task needs 12 skills loaded" without justification)

**Parallel feasibility beyond file overlap**
- Tasks marked parallel-safe also don't contend on shared resources beyond files: test DB locks, port allocations, worktree directories, rate limits, paid-API quotas
- Sequential user-decision dependencies (e.g., "task 3 needs user approval to proceed") block parallelism even when files don't overlap
- CI / build infrastructure contention (concurrent locks on the same lockfile) considered

### Recommended verifications

| Tool | Use for |
|---|---|
| Count files-touched per task | Quantify task size mechanically |
| Diff task list for file overlap | Detect tasks that conflict on the same file (must be sequenced) |
| Read project's `_delegation` skill | Confirm agent-type assignment matches delegation conventions |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"This task is trivial, no decomposition needed"** | "Trivial" is the rationalization for bundled tasks. If verification is multi-step, the task is multi-step |
| **Implicit task ordering** | If a reader has to infer order from context, the order field is missing. Flag `checklist_gap` |
| **One mega-task** | A plan with fewer than 3 tasks for a non-trivial idea is suspect. Either the idea was tiny (re-check) or the decomposition is missing |

---

## Performance

**Lens**: Does the plan **preserve** the Ideation performance commitments, and does the **plan execution itself** scale?

### Seed scenarios with attached checklists

**Tasks that touch perf-sensitive paths have benchmark-based verification**
- Tasks touching perf budgets identified by Ideation have explicit measurement steps in their `verifies:` field
- No silent removal of an existing benchmark / load test

**Tasks introducing IO / network calls name their batching / caching / retry policy**
- For each new IO operation, retry + timeout + caching policy is in the task spec
- Defaults inherited from project conventions are explicitly cited (not silently assumed)

**The plan does not bundle a perf-regression-risk task with unrelated changes**
- Perf-sensitive changes are isolated tasks with isolated verification
- No mixed-concern tasks where a perf check might mask a non-perf change

**A reasonable-looking task hides an N+1 in its verification setup (adversarial)**
- Test fixtures / verification scaffolding are checked for per-iteration external calls
- Plan-time call counts are estimated where downstream throughput matters

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep the project for existing benchmarks the plan must preserve | Confirm benchmark coverage |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Performance is for later"** | If Ideation committed to a budget, Planning must commit to measuring it. Otherwise the budget is fiction |

---

## Aesthetics

**Lens**: Is the **plan document itself** readable, consistent, and free of placeholders?

### Seed scenarios with attached checklists

**Task IDs / titles are concrete enough that a status update referencing them is unambiguous**
- Task titles are imperative-form, short, and specific
- No duplicate task IDs

**Task ordering reads top-to-bottom without scrolling back**
- Tasks are listed in execution order
- Dependencies (when forward-referenced) point downward, not upward

**The plan follows the project's standard for Planning docs**
- Section headings match the project's standard Planning template
- Field names are consistent across all tasks (every task has the same field set)

**No placeholders or unfinished fields**
- No `TBD` / `TODO` / `???` in any task field
- No task with an empty `verifies:` or `outputs:` field

**The plan looks complete but a careful reader spots an empty task (adversarial)**
- Every task has at least one `outputs:` entry and one `verifies:` entry
- No task that consists only of "(see Ideation)" cross-references

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep for placeholder strings | Mechanical placeholder check |
| Diff field names across tasks | Detect inconsistent schemas |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Aesthetics confused with personal style** | Project conventions are not preferences. Deviation from project's plan format is a finding |

---

## Usage

**Lens**: Can the **Executor** use this plan without coming back to the user or the Leader?

### Seed scenarios with attached checklists

**A fresh Executor given task N alone (no other context) can read its inputs / outputs / verifies and begin work**
- Every task can be spawned to a fresh subagent (with full context = `inputs:` field) and executed without parent-session context
- Verification commands are runnable as-is (no `<your test path here>` placeholders)

**The Executor knows which file(s) to open, which function(s) to modify, and which test(s) to run**
- Each task specifies file paths and (where relevant) function/section anchors
- Test commands are concrete, not "run the tests"

**Failure modes communicated by each task match what the Executor will encounter**
- Known failure modes are listed in the task spec or its preconditions
- No surprise dependencies — every prerequisite is in `requires:` or `inputs:`

**Inter-task handoff is explicit — task N's output is task N+1's input, named identically**
- Inter-task handoff fields use identical names across the producing + consuming tasks
- If a task requires user input mid-execution, that is named explicitly (and the plan questions whether the task should be split)

**The Executor needs to ask "what does X mean here" (adversarial)**
- Any term not in the project glossary is defined inline in the task spec
- Acronyms expand on first use within each task

### Recommended verifications

| Tool | Use for |
|---|---|
| Pick a random task and read it in isolation | Test the 3am-fresh-Executor test |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"The Executor can figure it out"** | The Executor's job is to execute, not to plan. Anything the plan delegates to Executor "figure-out" is a planning gap |

---

## Consistency

**Lens**: Do task hand-offs match? Do task fields mutually agree? Does the plan trace coherently back to Ideation?

### Seed scenarios with attached checklists

**Every task's `inputs:` literally name-matches an upstream task's `outputs:`**
- `outputs:` of task N == `inputs:` of task N+k for every documented hand-off — name match, not paraphrase
- No silent renames across the hand-off boundary

**Every `traces-to:` reference points to a real Ideation checklist item**
- Each `traces-to:` is grepped against the Ideation artifact for an exact match
- Dangling traces (referencing items the Ideation doesn't have) are flagged

**Task field schema is uniform across tasks**
- Every task has the same set of fields (no `verifies:` in some, missing in others)
- Field names use consistent casing and punctuation

**Tooling commitments are consistent across tasks**
- Tool surface (e.g., `bun test` vs `npm test`) is uniform unless explicitly switched
- Path conventions inside tasks (absolute vs repo-relative) are consistent

**No task contradicts a sibling task's assumption**
- Task ordering preserves invariants (e.g., task 3 assuming file X exists is sequenced after the task that creates X)
- Renames done by one task are reflected in subsequent task `inputs:` fields

**A task implicitly relies on shape introduced by a later task (adversarial)**
- Forward dependencies (later task influences earlier task's setup) are detected and flagged as plan-order bugs
- Implicit "we'll add this in task N" assumptions surfaced

### Recommended verifications

| Tool | Use for |
|---|---|
| Diff `outputs:` and `inputs:` fields across hand-offs | Detect name drift mechanically |
| Cross-reference each `traces-to:` against Ideation checklist text | Detect dangling traces |
| `grep` task command surface for inconsistent tooling | Detect mixed runners / scripts |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Paraphrased hand-offs** | "Task 2 produces the new schema; task 3 consumes the migrated schema" — different names, evaluator cannot mechanically verify match. Force literal field-name match |
| **Dangling traces** | A `traces-to:` referencing a checklist item the Ideation doesn't have. Either re-anchor or drop the trace |

---

## Risk

**Lens**: What breaks if **the plan itself** is wrong? Order risk, dependency risk, integration risk, rollback granularity.

### Seed scenarios with attached checklists

**If a mid-plan task fails verification, the rollback boundary is clear**
- Each task can be reverted independently (atomic commit per task, or task `rollback:` field with concrete steps)
- A failure between tasks leaves the project in a coherent state

**Tasks touching shared infrastructure are isolated**
- Tasks touching CI / build / package config are sequenced first (so subsequent tasks build on a known-good baseline)
- A failure in shared-infra tasks does not poison parallel work

**Tasks touching public interfaces are isolated and have explicit consumer-side migration**
- Tasks touching public interfaces (APIs, exported types) are isolated and have explicit consumer-side migration tasks
- No silent widening of a prior task's outputs

**The plan's ordering is robust to interruption**
- Pausing after task N leaves the project in a coherent state
- The "stop-after-task-N" snapshot is a valid intermediate state

**High-blast-radius tasks are gated**
- Migrations, public-API changes, dependency upgrades are isolated tasks
- Each high-blast task has an explicit go/no-go decision step

**Plan total file-touch count matches the Ideation Scope Contract**
- Cumulative files-touched across the plan is comparable to Ideation's stated scope
- A scope explosion (e.g., 3× the expected file count) is flagged

**A task silently widens scope of a prior task by adding to its outputs (adversarial)**
- Output fields are checked for monotonic addition vs prior task definitions
- No "task 2 produces X and Y" where task 1 already promised X

**Cost / paid-API exposure across tasks** (Coverage Matrix: Performance + Risk)
- Tasks that issue paid-API / cloud calls during verification have token / cost ceilings named
- No silent multiplication of cost (e.g., 20 tasks each running an LLM evaluation → 20× cost)

**Privacy / data handling continuity** (Coverage Matrix: Risk + Consistency)
- Tasks that touch PII or regulated data carry that label, so Execution can prioritize verification
- Data-flow boundaries from Ideation are preserved across the task decomposition

**Observability for the plan's execution** (Coverage Matrix: Structure + Usage)
- The plan is observable mid-execution — a stuck task is identifiable from session telemetry
- Long-running tasks have intermediate signals (not all-or-nothing reports)

**Supply-chain implications** (Coverage Matrix: Risk + Structure)
- Tasks that introduce new dependencies are flagged with `dep-impact:` field
- Lockfile / vendor / dep-manifest changes are sequenced first so subsequent tasks build on a stable dep graph

### Recommended verifications

| Tool | Use for |
|---|---|
| Count cumulative files-touched across the plan | Detect total-scope explosion vs Ideation |
| Diff task `outputs:` field against project's external interface surface | Detect inadvertent API changes |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Each task is small, total risk is fine"** | Task-local risk does not aggregate to plan risk. A plan of 20 small tasks across the codebase can have higher blast radius than 3 big tasks in one module |

---

## Overall (Stage 3) — phase-specific anchors

| Karpathy mode | What it looks like in a Planning artifact |
|---|---|
| **Wrong assumptions** | A task's `verifies:` step assumes infrastructure or state that does not exist |
| **Overcomplexity** | The plan introduces an abstraction layer Ideation did not mandate ("while we're here, let's extract a helper") |
| **Orthogonal edits** | A task bundles changes from two distinct Ideation checklist items because they touch the same file. Should be split |
| **Imperative-over-declarative** | A task prescribes the exact diff instead of stating the verifiable goal — robs Executor of judgment and makes the plan brittle |

**Preserve-list anchors specific to Planning**: task decomposition boundaries that are well-drawn; verification commands that are concrete and runnable; explicit dependency orderings.

---

## Output reminder

Same as the parent SKILL.md — seven per-perspective files + one overall file under `sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{system}/`. Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (Stage 0) → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.
