---
name: execution
description: MUST load for Execution. Covers Study, Plan, Execute, Verify, Commit, fresh evidence, status, and artifacts.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Execution

Skill for the **Execution Loop**. Defines what each of the four phases (DISCUSSION → WORK → EVALUATION → MEMORIZATION) does, which agent owns it, what inputs it consumes, and what artifacts it produces. Loaded by every agent participating in the loop — the manager for orchestration context, and each specialist for the procedural contract of the phase it owns.

The Execution Loop runs **once per planned task**. The loop body — DISCUSSION → WORK → EVALUATION → MEMORIZATION — repeats for each task in `planning/artifacts/`. Within a single task, REVISE iterations re-enter that task's DISCUSSION until verdict is `PASS`; `PASS` then advances to the next task in the Plan.

The Execution Loop differs from Ideation / Preparation / Planning in two ways:

- **DISCUSSION is manager + user only**, not leader-led. The leader's design work is locked in `planning/artifacts/`; Execution's DISCUSSION is just delegation-prompt construction and contribution-point confirmation. No leader is spawned at DISCUSSION.
- **WORK is the executor's domain**, not the leader's. The executor runs a five-phase lifecycle (Study → Plan → Execute → Verify → Commit) inside WORK and reports back with a 4-state status enum + fresh verification evidence.

The manager's orchestration of the Execution Loop (per-task iteration, REVISE/PASS/FAIL routing, iteration cap, plan-advance decision) is in [`orchestration/workflow/execution.md`](../orchestration/workflow/execution.md). Code-changeset evaluation specifics live in [`execution/evaluation.md`](evaluation.md), loaded by the evaluator at Stage 0 when the workflow phase is `execution`.

---

## Memory Access Matrix

The agent in the executor role MUST observe these tier boundaries. The only write surfaces are the per-task session subdirectories and the codebase itself (within the task's declared scope).

| Memory tier | Path root | Access from executor role |
|---|---|---|
| **Workspace codebase (in-scope files)** | Files explicitly listed in the task's `files:` scope | **READ + WRITE** — the executor's primary work surface; constrained to the task's declared scope |
| **Workspace codebase (out-of-scope files)** | All other files under the repository | **READ-ONLY** — reading is required for context; writing is a scope violation |
| **Session memory — own task rawdata** | `sessions/{date}-{session-id}/execution/{task-id}/rawdata/` | **READ + WRITE** — executor notes (`draft-iter{n}.md`), transcripts |
| **Session memory — own task staging** | `sessions/{date}-{session-id}/execution/{task-id}/staging/{scenarios,checklists,decisions,references,design,discussions,changelogs,learnings,notes,backlogs/{feature,project}}/` | **READ + WRITE** — surfacing mid-task discoveries that need promotion (e.g., a mistake learned mid-implementation, a backlog candidate noticed in passing). Wrap-up promotes |
| **Session memory — prior loops** | `sessions/{date}-{session-id}/{ideation,preparation,planning}/{artifacts,staging}/` | **READ-ONLY** — required inputs: Ideation design, Preparation readiness, Planning task spec |
| **Session memory — prior tasks** | `sessions/{date}-{session-id}/execution/{prior-task-id}/artifacts/` | **READ-ONLY** — context for tasks that depend on prior task outputs |
| **Session memory — `session.json`** | `sessions/{date}-{session-id}/session.json` | **FORBIDDEN** — the executor never reads or writes session.json; the manager owns it (iter `n` is supplied as an input) |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/` | **READ-ONLY** — required for mistake / scenario / decision lookup. Never written; Wrap-up owns feature-memory writes |
| **Project memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive,skills}/` | **READ-ONLY** — required for mistake / rule lookup. Never written; Wrap-up owns project-memory writes |
| **Runtime documentation** | `.claude/`, `.agents/`, `.codex/`, `plugins/gobbi/` | **READ + WRITE only when the task explicitly scopes them** — runtime-doc edits are workspace codebase edits; same in-scope / out-of-scope rule applies. Reading is always permitted |

**Delete semantics**: the executor NEVER deletes any file in any tier except when the task **explicitly** lists a file for deletion in its `files:` scope. Supersession is recorded via frontmatter (`status: superseded`, `superseded_by:`); unexplained physical deletion is forbidden. Once an artifact reaches a terminal state, Wrap-up moves the full file (`git mv`) to `archive/{type}/` per the move-on-terminal model — never deletes it.

**Write enforcement**: any write attempted outside the WRITE rows above is a constraint violation. Writes to project memory, feature memory, or out-of-scope workspace files must be revoked and the executor restarted with a corrected scope or BLOCKED back to the manager for re-planning.

**Git semantics**: the executor commits to the worktree (one focused commit per subtask, Conventional Commits format) but **never pushes**. The manager owns pushing, PR creation, and merge. See [`git/SKILL.md`](../git/SKILL.md) for the full role boundary.

---

## Core Principles

Cross-cutting principles for every agent participating in this loop.

> **The plan is the contract.**

The executor implements the locked task spec from `planning/artifacts/`. The scope, files, anchor, and acceptance criterion are non-negotiable. If the plan is wrong or incomplete, the executor emits `BLOCKED` or `NEEDS_CONTEXT` — never silently invents a different scope. Re-planning is the manager's call, not the executor's.

> **The codebase is the source of truth.**

The plan tells the executor *what* to do; the codebase tells the executor *how* it fits. Read existing patterns before writing new ones. Match the surrounding code's style, types, and conventions. Do not introduce new patterns when existing ones work. Research artifacts from Ideation are direction, not prescription — adapt based on what the code actually shows.

> **Fresh verification evidence, every time.**

Every `DONE` status requires fresh evidence — run the verification command(s) the plan specifies and capture the output. "Tests pass" without a captured command + result is not verification (the Verify phase below is the gate). Pre-existing failures must be verified on the base branch before being claimed as pre-existing.

> **Stay in scope.**

The task's `files:` scope is binding. Adjacent fixes, opportunistic refactors, and "while I'm here" improvements are forbidden. Note them in the executor's final response under "Out of scope observations"; do not implement them. Scope creep is the most common Execution failure mode.

> **Tell the manager what you discovered.**

If implementation surfaces a mistake worth recording, a backlog candidate, an architectural insight, or a known-pitfall avoided, stage it under `execution/{task-id}/staging/` per the routing table. Wrap-up promotes; the executor does not write to project memory directly.

---

## DISCUSSION Phase (manager + user, direct)

**Purpose**
Construct the executor delegation prompt for the current task. The leader is **not** spawned at this phase — the design work is already locked in `planning/artifacts/`. The manager confirms scope and contribution points with the user, then constructs the prompt per the executor template.

**Inputs**
- `sessions/{date}-{session-id}/planning/artifacts/` — the locked task list (current task)
- `sessions/{date}-{session-id}/planning/staging/plans/{slug}.md` — the staged plan file(s) for context
- `sessions/{date}-{session-id}/ideation/artifacts/` — the design the plan implements
- Prior-task outputs at `sessions/{date}-{session-id}/execution/{prior-task-id}/artifacts/` — when current task depends on them
- On `REVISE` iterations: prior iter's evaluator findings for THIS task

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | Current task from `planning/artifacts/` | Read the task spec fields: `id`, `what`, `traces-to`, `requires`, `files`, `inputs`, `outputs`, `verifies`; also read the Sub-step D agent assignment for the task's `required skills` and `required mistakes` (these are assignment metadata, not task YAML fields) | Loaded task context |
| 2 | Manager | Task spec + Ideation design | Identify any contribution points the task requires — choices the user has explicit authority on that the plan did not fully resolve | Contribution-point list |
| 3 | Manager | Contribution-point list | Run the active runtime's user-decision primitive for each contribution point | User decisions |
| 4 | Manager | Task spec + user decisions + verification commands | Construct the executor delegation prompt per [`delegation/templates/executor.md`](../delegation/templates/executor.md): paste task spec inline, fill scene-setting context, list Load Directives (principles + rules + skills + mistakes), specify files in-scope / out-of-scope, embed verification commands the executor must run, include the 4-status Report Format | Executor delegation prompt |
| 5 | Manager | Prompt | Verify the prompt has zero `<<slot>>` placeholders; every slot is filled with concrete content | Verified prompt |

**Outputs**
- Executor delegation prompt — ready for WORK phase spawn

**Exit checklist**
- [ ] Task spec read; scope boundary clear
- [ ] All contribution points resolved by the active runtime's user-decision primitive
- [ ] Delegation prompt constructed; zero unfilled slots
- [ ] Verification commands specified explicitly (no "run the tests" — name the actual commands)
- [ ] Status enum included in prompt's Report Format section

---

## WORK Phase (delegated to `executor`)

**Purpose**
Implement the contracted task within scope, verify the change-set with fresh evidence, commit (when git is active), and report back with a 4-state status enum.

The **default** is a **fresh** executor agent per task — fresh context is what makes scope discipline reliable. **Continuation is a Claude Code Agent Teams exception only**: in Claude Code, the manager may continue the same executor teammate from task NN to NN+1 iff the next task shares the current task's subsystem (the task's `files:`/feature scope overlaps) AND the chain is under the saturation cap (at most 3 consecutive continued tasks). Native Codex uses fresh executor spawns with full Load Directives. The decision rule, the F1 predicate, the saturation cap, the delta-brief shape, and the continuation write-discipline live in [`delegation/SKILL.md` § Continue vs Fresh](../delegation/SKILL.md#continue-vs-fresh) and the Execution-specific choreography in [`orchestration/workflow/execution.md` § Executor continuation](../orchestration/workflow/execution.md#executor-continuation-shared-subsystem-under-cap) — this section does not re-derive them.

**Inputs**
- Executor delegation prompt (from DISCUSSION)
- Workspace codebase (read across the repo; write only to in-scope files)
- Research artifacts at `sessions/{date}-{session-id}/{prior-loop}/staging/` and `artifacts/` — direction, not prescription

**Procedure** — the executor follows a five-phase lifecycle. Each phase depth scales with task complexity.

| Phase | Action |
|---|---|
| **Study** | Load the Load-Directives content in order: `principles` skill, project rules, `mistake` skill, phase doc, domain skills, project skill. Read the task's primary spec (inline in the prompt). Read research artifacts referenced in the prompt. Read every file listed in `files:` and its surrounding code — patterns, types, conventions. Map dependencies the task touches. |
| **Plan** | Outline the implementation before writing: which files to modify in what order, type-level design (what types change, what new types are needed), the smallest reversible step (Principle 2) to start with, the verification strategy that will confirm each piece. Non-trivial tasks fail when this phase is skipped. |
| **Execute** | Implement per the plan. Follow existing patterns — the codebase is the style guide. Keep changes minimal and focused. Do not introduce new patterns when existing ones work. Do not add error handling, abstractions, comments, or features beyond what the task specifies. Adjacent fixes go in "Out of scope observations" — never silently implemented. |
| **Verify** | Run the verification commands the prompt specifies; capture output verbatim. Re-read the diff against scope: any file outside `files:` touched? Revert it. Re-check against `mistake`: any known pitfall triggered? Re-verify preconditions (correct branch, no unexpected state). For runtime-doc edits: cross-references still resolve, terminology consistent. **Fresh evidence is mandatory for `DONE`** (the Verify gate). |
| **Commit** *(when git is active)* | Commit only after Verify passes — never unverified work. One focused commit per subtask. Conventional Commits format (`feat:`, `fix:`, `refactor:`, etc.). The executor commits but **never pushes**; the manager owns pushing and PR creation. See [`git/SKILL.md`](../git/SKILL.md). |

After the five-phase lifecycle, the executor produces a final response — captured as the work artifact — with the 4-status enum and supporting evidence (per the executor delegation template's Report Format section).

**Outputs**
- Code / doc changes in workspace files (committed if git is active)
- `sessions/{date}-{session-id}/execution/{task-id}/rawdata/draft-iter{n}.md` — the executor's notes (final response, captured by the manager from the transcript). Contains: status, what was implemented, verification command + output, files changed, self-review findings, out-of-scope observations
- Optional staging files at `sessions/{date}-{session-id}/execution/{task-id}/staging/{type}/{slug}.md` — for mid-task discoveries that need promotion (mistakes learned, backlog candidates, references gathered)

**Status enum** (in the executor's final response — see [`delegation/templates/executor.md`](../delegation/templates/executor.md) for the full Report Format):

- **DONE** — change-set matches the contracted deliverable; fresh verification evidence attached; scope boundary respected.
- **DONE_WITH_CONCERNS** — change-set done; flag specific concerns (incomplete edge-case coverage, pre-existing test failure, scope ambiguity resolved one way the user might prefer the other).
- **NEEDS_CONTEXT** — paused. State precisely what is missing (file, decision, user clarification) and from whom.
- **BLOCKED** — cannot proceed. State the root cause: contradictory requirements, wrong premise in the plan, or verification failing the brief did not anticipate.

**Exit checklist**
- [ ] All five phases (Study / Plan / Execute / Verify / Commit) completed (Commit only when git is active)
- [ ] Status enum value picked and supported by evidence
- [ ] Fresh verification command output captured in the response
- [ ] Diff scope respected (no out-of-scope files touched)
- [ ] Out-of-scope observations recorded (or "none")
- [ ] Mid-task staging (if any) written under `execution/{task-id}/staging/`

---

## EVALUATION Phase

**Purpose**
Find the implementation gaps WORK missed. Two independent systems (Claude Code + Codex) evaluate the change-set across all seven perspectives + Overall; the manager reconciles their findings and produces a single `PASS` / `REVISE` / `FAIL` verdict for THIS task's current iteration.

See [evaluation skill](../evaluation/SKILL.md) for the full Stage 0 / 1 / 2 / 3 procedure, [`execution/evaluation.md`](evaluation.md) for the execution-phase seed scenarios and tool-verification expectations, and [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md) for the manager's spawn / reconciliation orchestration.

**Inputs** (consumed from the WORK phase output)
- The change-set (committed code or staged diff) for this task iteration
- `sessions/{date}-{session-id}/execution/{task-id}/rawdata/draft-iter{n}.md` — the executor's notes + verification evidence
- The task spec from `planning/artifacts/` (the contract being evaluated)
- The discussion log (manager-captured user-decision exchanges, including any contribution-point decisions)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | WORK outputs; task spec; discussion log | Spawn one evaluator per system (Claude Code + Codex); each handles all seven perspectives + Overall sequentially | Two evaluator agent instances |
| 2 | Evaluator | All step-1 inputs | Run the four-stage procedure per `evaluation/SKILL.md` with `execution/evaluation.md` loaded at Stage 0 | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `evaluation/iter{n}/{claude,codex}/overall.md` |
| 3a | Manager | Both systems' per-perspective files | Cross-system reconciliation: pessimistic union of findings; severity-gated divergence handling | Reconciled findings + per-perspective verdicts |
| 3b | Manager | Major divergence (if any) | Run the active runtime's user-decision primitive | (skipped if no major divergence) |
| 3c | User | Divergence question | Decide which verdict to honor | User-confirmed verdict |
| 4 | Manager | Reconciled findings + verdicts | Record aggregated verdict for THIS task / iter: `PASS` / `REVISE` / `FAIL`. **All verdicts advance to MEMORIZATION first**. After MEMORIZATION, `PASS` exits this task's loop and advances to the next planned task; `REVISE` re-enters THIS task's DISCUSSION (iter increments); `FAIL` escalates through the active runtime's user-decision primitive | Per-task verdict |

**Outputs**
- `sessions/{date}-{session-id}/execution/{task-id}/evaluation/iter{n}/{claude,codex}/{perspective}.md` — one file per system × perspective
- Aggregated per-task verdict recorded in workflow state

**Execution-specific evaluation emphasis** (from [`execution/evaluation.md`](evaluation.md))
- **Implementation match** — change-set matches the task's `files:` and `outputs:` 1:1; no silent scope expansion
- **Build / test status** — verified by running the commands, not by asserting; tool-verified findings are required for confidence ≥ 75
- **Mistake compliance** — known pitfalls in the domain not triggered
- **Scope discipline** — `git diff --name-only` confirms no out-of-scope files touched
- **Supply-chain / security / observability / privacy** — perspective coverage per the Coverage Ownership Matrix

**Exit checklist**
- [ ] Both systems produced per-perspective files for every perspective
- [ ] Verdict aggregated and recorded; `REVISE` increments THIS task's iteration counter; `PASS` advances the Plan cursor after MEMORIZATION

---

## MEMORIZATION Phase

**Purpose**
Persist every iteration's evidence into session memory and — on the final `PASS` iteration for this task — emit the task's `artifacts/` files + cumulative typed-finding stagings. MEMORIZATION runs after **every** EVALUATION (whether the verdict is `PASS`, `REVISE`, or `FAIL`) so each iteration leaves a durable audit trail. Project memory is **not** written here; Wrap-up handles session → project promotion.

See [memorization skill](../memorization/SKILL.md) for the every-iter / PASS-only procedure, template-stamping conventions, artifact frontmatter schema, and cumulative-staging rule. [`orchestration/workflow/memorization.md`](../orchestration/workflow/memorization.md) covers the manager's spawn / collect orchestration.

**Inputs**
- `sessions/{date}-{session-id}/execution/{task-id}/rawdata/draft-iter{n}.md` — executor's notes for this iter
- `sessions/{date}-{session-id}/execution/{task-id}/evaluation/iter{m}/{claude,codex}/{perspective}.md` for `m ∈ 1..n`
- `session.json.transcriptPath` (tilde-expand `$HOME` on read) — manager-stamped transcript path; use `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env. Claude Code transcript jsonl for the iteration window
- `sessions/{date}-{session-id}/execution/{task-id}/rawdata/discussion-log.md` — manager-captured user-decision exchanges (contribution points, divergence decisions)
- EVALUATION verdict for this iteration (`PASS` / `REVISE` / `FAIL`)
- WORK-staged artifacts under `sessions/{date}-{session-id}/execution/{task-id}/staging/` (already in place — MEMORIZATION supplements, never replaces)

**Procedure** — see [memorization/SKILL.md § MEMORIZATION Phase](../memorization/SKILL.md#memorization-phase) for the canonical step-by-step. Execution-specific notes:

- The `{loop}` token in the memorization procedure resolves to `execution/{task-id}` for Execution — every path is task-scoped under `sessions/.../execution/{task-id}/...`. The session.json field is `workflow.execution.iterations[]` keyed by `{task-id, iter}` (per-task iter, not loop-wide).
- On PASS, the artifacts directory should include at least one file with `artifact_type: change-summary` (what was implemented + verification result), one with `artifact_type: verification-report` (commands run + output), and the mandatory `artifact_type: memory-reads` audit file.
- Cumulative finding staging on PASS: per the routing table in [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity). Execution-specific findings frequently land at `staging/changelogs/` (shipped change records) and `staging/learnings/` (durable cross-cutting insights surfaced mid-task).
- Mid-task `staging/` files written by the executor during WORK are **preserved as-is**; MEMORIZATION supplements with evaluator-finding-driven staging on top.

**Outputs**

Every iteration produces:
- `sessions/{date}-{session-id}/execution/{task-id}/rawdata/transcript-iter{n}.jsonl` — preserved transcript
- `sessions/{date}-{session-id}/session.json` — upserted `workflow.execution.iterations[]` entry keyed by `{task-id, iter}`

Only the `PASS` iteration also produces:
- `sessions/{date}-{session-id}/execution/{task-id}/artifacts/` — canonical artifact files (change-summary + verification-report + memory-reads, plus loop-specific decompositions)
- `sessions/{date}-{session-id}/execution/{task-id}/staging/` — cumulative evaluator-finding stagings on top of the WORK-staged mid-task discoveries
- `sessions/{date}-{session-id}/session.json` — `workflow.execution.tasks[{task-id}].finishedAt` and `verdict: PASS` set; Plan cursor advances

**Exit checklist**

Every iteration:
- [ ] Transcript jsonl preserved at `execution/{task-id}/rawdata/transcript-iter{n}.jsonl`
- [ ] `session.json.workflow.execution.iterations[]` includes this iter's `{task-id, iter, verdict, finishedAt, evaluation_dir: "execution/{task-id}/evaluation/iter{n}/"}`
- [ ] No writes to feature memory or project memory

`PASS` iteration additionally:
- [ ] `execution/{task-id}/artifacts/` contains one or more files, each carrying valid frontmatter per the [Artifact frontmatter schema](../memorization/SKILL.md#artifact-frontmatter-schema)
- [ ] At least one artifact has `artifact_type: change-summary`
- [ ] At least one artifact has `artifact_type: verification-report`
- [ ] At least one artifact has `artifact_type: memory-reads`
- [ ] Every evaluator finding across this task's iters `1..n` staged to the correct `staging/` destination per Type + Domain routing
- [ ] `session.json.workflow.execution.tasks[{task-id}]` marked PASS; Plan cursor advanced

---

## Output paths

All writes during the Execution Loop are **session-scoped** under per-task subdirectories. Wrap-up promotes the `staging/` directory to project memory after the workflow completes — see [wrap-up skill](../wrap-up/SKILL.md). Code changes go to the workspace codebase directly (and are committed to the worktree when git is active).

**Path conventions**

- `{date}` — the session start date in `YYYY-MM-DD` format
- `{session-id}` — runtime session ID resolved by the manager during Configuration. Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value; use the parent session id supplied by the manager.
- `{task-id}` — the Task ID assigned by Planning (e.g., `01-add-cache-layer`)
- `{feature-name}` — feature slug (only used by Wrap-up when promoting to project memory; not used inside session paths)
- `{slug}` — slug for a specific artifact, set by the writer at stage time
- `{n}` — iter number for THIS task, supplied by the manager

| Path | Written by | Written |
|---|---|---|
| Workspace files in task `files:` scope | executor (WORK) | committed per task (when git is active) |
| `sessions/{date}-{session-id}/execution/{task-id}/rawdata/draft-iter{n}.md` | executor (WORK) / manager-captured | every iteration |
| `sessions/{date}-{session-id}/execution/{task-id}/staging/{scenarios,checklists,decisions,references,design,changelogs,learnings,notes,backlogs/{feature,project}}/{slug}.md` | executor (WORK) or assistant (MEMORIZATION) | per mid-task discovery (executor) or per evaluator finding (assistant) |
| `sessions/{date}-{session-id}/execution/{task-id}/evaluation/iter{n}/{claude,codex}/{perspective}.md` | evaluator (EVALUATION) | one per system × perspective |
| `sessions/{date}-{session-id}/execution/{task-id}/rawdata/transcript-iter{n}.jsonl` | assistant (MEMORIZATION) | per iter — preserved transcript window |
| `sessions/{date}-{session-id}/execution/{task-id}/artifacts/{free-filename}.md` | assistant (MEMORIZATION) | PASS only — one or more artifact files; each carries the [Artifact frontmatter schema](../memorization/SKILL.md#artifact-frontmatter-schema). Mandatory: ≥ 1 with `artifact_type: change-summary`, ≥ 1 with `artifact_type: verification-report`, ≥ 1 with `artifact_type: memory-reads` |
| `sessions/{date}-{session-id}/session.json` | assistant (MEMORIZATION) | per-task iter completion timestamps, iter, verdict |

The session subdirectory tree at `sessions/{date}-{session-id}/execution/{task-id}/{rawdata,staging,evaluation}/` is bootstrapped by the manager when the Execution Loop enters each new task. WORK and MEMORIZATION assume the tree exists and surface an error if it does not. Feature directories under `features/{feature-name}/...` are **not** touched during Execution; Wrap-up creates them as needed during project-memory promotion.

---

## Constraints

- **MUST implement only the contracted task** — scope is defined by `planning/artifacts/`'s task spec; adjacent fixes are forbidden, only logged as "Out of scope observations".
- **MUST follow existing codebase patterns** — the code is the style guide; do not introduce new patterns when existing ones work.
- **MUST produce fresh verification evidence** for every `DONE` status — run the commands, capture the output. "Tests pass" without captured evidence is not verification.
- **MUST report with the 4-state status enum** — `DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED` — supported by evidence; never silently produce work the executor is unsure about.
- **MUST commit but never push** — when git is active, commit to the worktree per `git/SKILL.md`; the manager owns pushing and PR creation.
- **MUST never write outside the task's `files:` scope** — out-of-scope code edits are a constraint violation; revert and re-emit status.
- **MUST never write to project memory or feature memory during the Execution Loop** — mid-task discoveries stage at `execution/{task-id}/staging/...`. Wrap-up promotes.
- **MUST never delete** unless the task explicitly lists the file for deletion in `files:` — supersession via frontmatter; physical deletion otherwise is forbidden. Terminal artifacts are moved (never deleted) to `archive/{type}/` by Wrap-up at session close.
- **MUST never read or write `session.json`** from the executor role — the manager owns it; iter is supplied as an input.
- **MUST not embed test-writing as a separate task** — verification is anchored by Planning; the executor runs the specified verification commands, doesn't author the test framework itself unless the task explicitly scopes test creation.
- **MUST emit `NEEDS_CONTEXT` instead of inventing** when the brief is ambiguous — never silently resolve ambiguity and proceed.
