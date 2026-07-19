# Planning Loop — Evaluation Frame

Phase child doc loaded by the evaluator at Stage 0 when the workflow phase is `planning`. Provides the per-perspective evaluation **procedure** for a Planning Loop's task decomposition: each perspective's **lens**, its **recommended verifications**, and its **perspective-specific anti-patterns**, plus the **Overall (Stage 3)** anchors. The concrete GOOD / BAD / adversarial **scenario families** live in the sibling `scenario.md`, and their yes/no **checks** live in the sibling `checklist.md` (whose heading tree mirrors `scenario.md`); each perspective below points to its section in both.

The artifact under evaluation is the leader's plan at `sessions/{date}-{session-id}/2-planning/working/draft-iter{n}.md` plus its cited `working/readiness-gate-iter{n}.md`. Together they contain the locked Scope Contract (inherited from Ideation), readiness evidence and routing, ordered task list, per-task scope + inputs + outputs + verification criteria, dependency graph, and agent-type assignment per task. Scope Contract schema canonical at `evaluation/SKILL.md` § Scope Contract Schema.

A plan is **judged against the idea it implements**. The Ideation working draft is required input — without it, every perspective's evaluation is shallow. Planning is a process loop — the artifact is a plan, not code — so the scenario families in `scenario.md` already include adversarial cases (mis-ordered tasks, dangling traces, hidden coupling, silent scope expansion) so Stage 2 walks each Frame once without a separate adversarial pass.

---

## Project

**Lens**: Does the plan implement the **right idea**, the whole idea, and **only** the idea?

**Scenario source:** `scenario.md` § Project (`PLAN-PROJ-SCENARIO-*`)
**Checklist source:** `checklist.md` § Project (`PLAN-PROJ-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Diff Ideation checklist vs plan task list | Detect orphaned items or scope expansion mechanically |
| Read the Ideation Scope Contract alongside the plan | Confirm phrasing identity |
| Inventory `1-ideation/{outputs,staging}/` against the readiness artifact | Detect upstream omissions, including missing staging, that Planning must route back |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"While we're here" tasks** | A task that improves something adjacent but unrelated is scope creep. Re-route to backlog, do not include in plan |
| **Re-framing the idea during planning** | If the plan reveals the idea was wrong, return to Ideation — do not silently re-frame inside Planning |
| **Planning repairs an upstream gap** | Any missing or unusable Ideation obligation routes to re-Ideation or abort; acceptance and repair in Planning are forbidden |

---

## Structure

**Lens**: Is the **task decomposition** sound? Are dependencies ordered correctly? Is the agent-type assignment per task right?

**Scenario source:** `scenario.md` § Structure (`PLAN-STRUCT-SCENARIO-*`)
**Checklist source:** `checklist.md` § Structure (`PLAN-STRUCT-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Count files-touched per task | Quantify task size mechanically |
| Diff task list for file overlap | Detect tasks that conflict on the same file (must be sequenced) |
| Read project's `delegation` skill | Confirm agent-type assignment matches delegation conventions |
| Resolve each required skill's canonical path | Confirm missing workspace/domain skills route to NEEDS_CONTEXT and missing project skills become the first Execution task |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"This task is trivial, no decomposition needed"** | "Trivial" is the rationalization for bundled tasks. If verification is multi-step, the task is multi-step |
| **Implicit task ordering** | If a reader has to infer order from context, the order field is missing. Flag `checklist_gap` |
| **One mega-task** | A plan with fewer than 3 tasks for a non-trivial idea is suspect. Either the idea was tiny (re-check) or the decomposition is missing |
| **Planning generates a missing skill** | Planning records and orders a project-skill obligation; Execution authors, wires, verifies, and commits it before dependents |

---

## Performance

**Lens**: Does the plan **preserve** the Ideation performance commitments, and does the **plan execution itself** scale?

**Scenario source:** `scenario.md` § Performance (`PLAN-PERF-SCENARIO-*`)
**Checklist source:** `checklist.md` § Performance (`PLAN-PERF-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Grep the project for existing measurement / load checks the plan must preserve | Confirm measurement coverage |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Performance is for later"** | If Ideation committed to a budget, Planning must commit to measuring it. Otherwise the budget is fiction |

---

## Aesthetics

**Lens**: Is the **plan document itself** readable, consistent, and free of placeholders?

**Scenario source:** `scenario.md` § Aesthetics (`PLAN-AESTH-SCENARIO-*`)
**Checklist source:** `checklist.md` § Aesthetics (`PLAN-AESTH-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Usage (`PLAN-USAGE-SCENARIO-*`)
**Checklist source:** `checklist.md` § Usage (`PLAN-USAGE-SCENARIO-*-CHECK-*`)

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

**Scenario source:** `scenario.md` § Consistency (`PLAN-CONS-SCENARIO-*`)
**Checklist source:** `checklist.md` § Consistency (`PLAN-CONS-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Diff `outputs:` and `inputs:` fields across hand-offs | Detect name drift mechanically |
| Cross-reference each `traces-to:` against Ideation checklist text | Detect dangling traces |
| `grep` task command surface for inconsistent tooling | Detect mixed runners / scripts |
| Diff `## Readiness report` against the gate artifact and task map | Detect dropped or contradictory readiness obligations |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **Paraphrased hand-offs** | "Task 2 produces the new schema; task 3 consumes the migrated schema" — different names, evaluator cannot mechanically verify match. Force literal field-name match |
| **Dangling traces** | A `traces-to:` referencing a checklist item the Ideation doesn't have. Either re-anchor or drop the trace |

---

## Risk

**Lens**: What breaks if **the plan itself** is wrong? Order risk, dependency risk, integration risk, rollback granularity.

**Scenario source:** `scenario.md` § Risk (`PLAN-RISK-SCENARIO-*`)
**Checklist source:** `checklist.md` § Risk (`PLAN-RISK-SCENARIO-*-CHECK-*`)

### Recommended verifications

| Tool | Use for |
|---|---|
| Count cumulative files-touched across the plan | Detect total-scope explosion vs Ideation |
| Diff task `outputs:` field against project's external interface surface | Detect inadvertent API changes |
| Inspect every out-of-worktree write disposition | Confirm actual writer/owner, exact surface, real-context read-only authority evidence, reversibility, and go/no-go |

### Perspective-specific anti-patterns

| Anti-pattern | Correction |
|---|---|
| **"Each task is small, total risk is fine"** | Task-local risk does not aggregate to plan risk. A plan of 20 small tasks across the codebase can have higher blast radius than 3 big tasks in one module |
| **Sandbox writability treated as authority** | A proxy sandbox proves only its own access. Confirm external-write authority from the actual writer's context |

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

The evaluator writes **nine** output files per system: the seven per-perspective files + one `overall.md` + the filled `checklist.md` (copied from the sibling `checklist.md` at Stage 0 and ticked through Stage 2), all under `sessions/{date}-{session-id}/2-planning/evaluation/iter{n}/{system}/`:

- Seven per-perspective files at `sessions/{date}-{session-id}/2-planning/evaluation/iter{n}/{system}/{project,structure,performance,aesthetics,usage,consistency,risk}.md`
- One overall file at `sessions/{date}-{session-id}/2-planning/evaluation/iter{n}/{system}/overall.md`
- One filled `sessions/{date}-{session-id}/2-planning/evaluation/iter{n}/{system}/checklist.md` — the copy-then-tick coverage artifact (Stage 0 copy → Stage 1 `## Stage 1 Additions` → Stage 2 tick with `PASS:` / `FAIL: {finding-id}` / `n/a: {reason}`)

Each per-perspective file structure (mandatory headers): `## Artifact Summary + Memory reads` (Stage 0) → `## Locked Frame (Stage 1)` → `## Per-scenario per-check results` → `## Typed findings` (Stage 2, each with Type / Domain / Disposition / Confidence / Severity / Evidence) → `## Low-confidence appendix` section.
