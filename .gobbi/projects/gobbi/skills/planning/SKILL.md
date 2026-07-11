---
name: planning
description: MUST load when entering or revising the Planning Loop. Covers Who/When/Where decomposition of the locked Ideation output into agent-assigned ordered tasks, dependency graphing, type/name consistency self-review, and authoring of the loop's outputs/ files.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
---

# Planning

Skill for the **Planning Loop**. Defines what each of the four phases (DISCUSSION → WORK → EVALUATION → RECORD) does, which agent owns it, what inputs it consumes, and what artifacts it produces. Loaded by every agent participating in the loop — the manager for orchestration context, and each specialist for the procedural contract of the phase it owns.

The Planning Loop runs **between Preparation and Execution**. It concentrates on **Who, When, and Where**:
- **Who** — which agent type implements each task (`executor` / `leader` / `assistant`) and what skills they must load
- **When** — task order, dependencies, parallel-safe lanes (lanes are documentation; Execution runs sequentially)
- **Where** — which files / directories each task touches; scope boundaries between tasks

Planning takes the locked Ideation artifacts (`1-ideation/outputs/`) + Preparation's readiness output (`2-preparation/outputs/`) as its inputs and produces `3-planning/outputs/` files the Execution Loop reads as its briefing source.

The leader's role spans **both** DISCUSSION and WORK — same shape as Ideation and Preparation. The assistant owns RECORD (loaded via [`record/SKILL.md`](../record/SKILL.md)). The evaluator owns EVALUATION (loaded via [`evaluation/SKILL.md`](../evaluation/SKILL.md)).

The manager's orchestration of the Planning Loop (when to spawn the leader, EVALUATION coordination, RECORD delegation, ITER/EXIT decision) is in [`orchestration/workflow/planning.md`](../orchestration/workflow/planning.md).

---

## Memory Access Matrix

The agent in the leader role MUST observe these tier boundaries. The only write surfaces are the loop's own session subdirectories.

| Memory tier | Path root | Access from leader role |
|---|---|---|
| **Session record — own loop working** | `sessions/{date}-{session-id}/3-planning/working/` | **READ + WRITE** — leader draft, restore-point snapshots, transcripts; during dual-system production the Codex proposer writes the frozen `proposals/codex/draft-iter{n}.md` and the leader writes the `reconciliation-iter{n}.md` Integration Log (WORK) |
| **Session record — own loop staging** | `sessions/{date}-{session-id}/3-planning/staging/{plans,scenarios,checklists,decisions,references,design,discussions,backlogs/{feature,project}}/` | **READ + WRITE (WORK only)** — Planning-loop staging (notably `staging/plans/{slug}.md`); Wrap-up promotes to memory |
| **Session record — prior loops** | `sessions/{date}-{session-id}/{1-ideation,2-preparation}/{outputs,staging}/` | **READ-ONLY** — required input: ideation's locked design + scope contract + scenarios + checklists; preparation's readiness assessment + generated skills |
| **Session record — `session.json`** | `sessions/{date}-{session-id}/session.json` | **FORBIDDEN** — the leader never reads or writes session.json; the manager owns it (iter `n` is supplied as an input) |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/` | **READ-ONLY** — required for scenario/checklist accumulation context. Never written; Wrap-up owns feature-memory writes |
| **Memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive,skills}/` | **READ-ONLY** — required for mistake/rule lookup during task assignment. Never written; Wrap-up owns memory writes |

**Delete semantics**: the leader NEVER deletes any file in any tier. Supersession is recorded via frontmatter (`status: superseded`, `superseded_by:`); physical deletion is forbidden. Once an artifact reaches a terminal state, Wrap-up moves the full file (`git mv`) to `archive/{type}/` per the move-on-terminal model — never deletes it.

**Restore-point exception**: at REVISE entry, the leader copies the prior iter's draft from `working/draft-iter{n-1}.md` to `working/restore/iter{n-1}-pre-revise.md`. This is a **write**, not a delete or mutation — the original `draft-iter{n-1}.md` is preserved as-is. See § Restore Point below.

**Write enforcement**: any write attempted outside the WRITE rows above is a constraint violation. Code attempting writes to memory or feature memory must be revoked and Planning restarted with a corrected scope.

---

## Core Principles

Cross-cutting principles for every agent participating in this loop.

> **The plan tells specialists what, not how.**

Every task is a YAML schema record: `{id, what, traces-to, requires, files, inputs, outputs, verifies}`. The executor decides "how" based on the locked Ideation design, memory, and codebase patterns. Planning does not embed implementation code, command scripts, or step-by-step recipes — that would suppress the executor's engineering judgment.

> **The artifact is the program.**

The `3-planning/outputs/` files become the Execution Loop's briefing. Vague tasks produce ambiguous executor work. Spell out file scope, anchor (which scenario / checklist item the task satisfies), verification method, and the skills the executor must load.

> **Anchor every task.**

Every task names its source — a scenario from `1-ideation/outputs/`, a checklist item, or a `design_flaw` / `assumption_risk` finding from prior EVALUATION. Anchor-less tasks are forbidden — they are how scope creep enters the plan.

> **Stay in scope.**

The Scope Contract from Ideation is binding. Tasks that drift beyond it are either dropped or trigger a REVISE back to Ideation. The leader does not silently grow the plan beyond what Ideation locked. Out-of-scope items get logged as backlog candidates; they never silently graduate into the canonical artifact. Scope Contract schema canonical at `evaluation/SKILL.md` § Scope Contract Schema.

> **Disagree when you disagree.**

If the Ideation design has gaps that make planning impossible — missing scenarios, vague checklist items, unstated constraints — surface them explicitly with evidence. Anti-sycophancy is mandatory. When the leader's research-backed analysis substantively disagrees with the user's stated direction, escalate via the USER CHALLENGE primitive below rather than silently planning a compromise.

> **USER CHALLENGE — structured escalation when leader disagrees with user.**

When the leader's analysis (research + codebase reality + project mistakes) concludes the user's stated direction at Ideation should change for planning to be sound, the manager uses the active runtime's user-decision primitive using the structured USER CHALLENGE format:

| Field | Content |
|---|---|
| **What the user said** | The user's stated direction, verbatim from the Ideation discussion log |
| **What the leader recommends** | The leader's proposed change, one sentence |
| **Why** | Research / codebase / mistake evidence supporting the change, with paths and excerpts |
| **What we might be missing** | Counter-arguments the leader considered; constraints the user may know that the leader does not |
| **If we're wrong, the cost is** | The downside of pursuing the leader's recommendation if the user's direction was actually right |

The user's original direction is the default. The leader's recommendation only wins if the user explicitly accepts the change. USER CHALLENGE is reserved for substantive disagreements — not granularity nits or task-slicing preferences.

> **Test-writing is NOT a planning task.**

Verification is anchored, not authored, by Planning. Every task's acceptance criterion points to the scenario / checklist item / evaluation criterion the Ideation Loop already produced. The Execution Loop implements; the EVALUATION sub-phase tests. Planning does not slice "write test X" as a separate task.

> **NEEDS_CONTEXT escalation.**

This loop's DISCUSSION phase is manager-direct (the manager uses the active runtime's user-decision primitive when user input is needed); subagents do not run DISCUSSION here. NEEDS_CONTEXT escalation primitive applies to subagents during the WORK phase only — the leader returns NEEDS_CONTEXT in its final report; the manager handles the user-question block per `discussion/SKILL.md`. See `agents/leader.md` § Status Contract for the leader's NEEDS_CONTEXT pattern.

---

## DISCUSSION Phase

**Purpose**
Take the locked Ideation output + Preparation readiness and decompose it into a user-approved task plan with explicit Who / When / Where. Each sub-step pushes the decomposition toward more specificity, so that by the end of DISCUSSION no downstream phase has to guess at task scope, dependencies, or agent assignments.

**Inputs**
- `sessions/{date}-{session-id}/1-ideation/outputs/` (canonical, locked design)
- `sessions/{date}-{session-id}/2-preparation/outputs/` (readiness assessment + any generated project-specific skills now staged)
- `sessions/{date}-{session-id}/2-preparation/staging/` (skills / scenarios / decisions staged by Preparation)
- `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,design,mistakes}/` (accumulated feature memory)
- `.gobbi/projects/{project-name}/{mistakes,rules}/` (project-wide context)
- On `REVISE` iterations: prior iter's evaluator findings + the restore-point copy of prior draft

**Procedure**
Run sub-steps A → B → C → D → E in order. Each sub-step's procedure block is below. On REVISE iterations, **Restore Point is taken before Sub-step A** (see § Restore Point).

**Outputs**
- Task seed set (Sub-step A) — checklist items inside the Scope Contract, with their parent scenarios
- File map + task slicing (Sub-step B)
- Dependency table + parallel-lane table (Sub-step C)
- Per-task agent assignment + required skills + required mistakes (Sub-step D)
- Self-review report (Sub-step E) — type/name consistency + spec coverage + placeholder scan
- Discussion log (manager-captured user-decision exchanges, including any USER CHALLENGE outcomes)

**Exit checklist**
- [ ] All five sub-steps (A–E) completed
- [ ] Every task has a scenario / checklist anchor
- [ ] Every task has agent type + required skills + required mistakes
- [ ] Self-review report shows zero placeholders, zero type/name drift, full spec coverage
- [ ] USER CHALLENGE escalations (if any) closed with explicit user decision

---

### Restore Point (REVISE entry only)

**Purpose**
Preserve the prior iteration's draft byte-for-byte before any REVISE mutation, so the prior plan version is addressable by name (not by grep through git log).

**Procedure** — runs at REVISE entry, before Sub-step A

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | `sessions/{date}-{session-id}/3-planning/working/draft-iter{n-1}.md` | Copy verbatim to `sessions/{date}-{session-id}/3-planning/working/restore/iter{n-1}-pre-revise.md`; prepend a 3-line header: `# Restore point — iter {n-1} pre-REVISE`, `# Captured: {YYYY-MM-DD}`, `# To re-run: copy this file back to draft-iter{n-1}.md` | Restore-point snapshot |
| 2 | Leader | Restore-point path + prior evaluator findings | Read both; surface to manager which findings will drive this REVISE iter | Findings-driven entry brief |

Restore points accumulate across REVISE iterations — each one is preserved as `restore/iter{m}-pre-revise.md` for `m ∈ 1..n-1`. They are session-scoped only and never promoted to memory.

---

### Sub-step A — Read Ideation + Preparation Output

**Purpose**
Read the locked Scope Contract, design, scenarios, checklist, and Preparation readiness end-to-end. Enumerate the **task seed set** — every checklist item inside the Scope Contract becomes a candidate task.

**Inputs**
- `sessions/{date}-{session-id}/1-ideation/outputs/` — every file
- `sessions/{date}-{session-id}/2-preparation/outputs/` — every file
- `sessions/{date}-{session-id}/2-preparation/staging/` — staged readiness fixes (generated skills, missed-promotion scenarios/checklists/decisions)
- Existing feature directory at `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,design}/`

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Ideation artifacts + Scope Contract | Read every file; confirm what is in/out of scope for this workflow | Loaded scope + design context |
| 2 | Leader | Framed problem + design decisions | Inherit context (do not redo Ideation's research); record any decisions that constrain task slicing | Constraint notes |
| 3 | Leader | Ideation checklist + Scope Contract | Enumerate checklist items that fall inside the Scope Contract — these become the task seed set | Task seed list |
| 4 | Leader | Scenarios | Identify scenarios with no anchored checklist item; surface as gap findings rather than silently inventing tasks | Gap findings (zero or more) |
| 5 | Leader | Preparation artifacts | Read readiness assessment; confirm every "generate-now" decision has produced a staged skill / scenario / decision; if any gap remains, surface it as a planning blocker | Readiness confirmation or blocker |
| 6a | Leader | Gaps + readiness blockers | Surface to manager via findings package | Findings package |
| 6b | Manager | Findings package | Either advance (if no blocker) or use the active runtime's user-decision primitive to decide remediation (re-Ideate / re-Prepare / accept gap) | Advance decision |

**Outputs**
- Task seed set (consumed by Sub-step B)
- Gap findings — empty on the happy path; non-empty triggers manager-side remediation discussion

---

### Sub-step B — File Decomposition + Task Definition

**Purpose**
Map every file the design will create or modify, then slice the file map into medium-granularity tasks. The file map is the decomposition; tasks are slices of the file map, not independent decisions.

**Inputs**
- Task seed set (Sub-step A output)
- Design decisions from `1-ideation/outputs/`
- Codebase files in the area the design touches

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Design + task seed set | List **every file** that will be created or modified to implement the design. Each file has one clear responsibility | File map |
| 2 | Leader | File map | Group files by feature concern — files that change together stay together. Avoid splitting by technical layer when responsibility doesn't divide that way | Grouped file map |
| 3 | Leader | Grouped file map + task seed set | Slice into tasks. Each task is a **medium-granularity unit**: one executor spawn, one meaningful commit, typically 2-5 files touched, ~15-60 minutes of focused work | Sliced task list |
| 4 | Leader | Sliced task list | Per task, record using the canonical YAML task schema: `id` (short slug, e.g., `01-add-cache-layer`), `what` (one sentence imperative description), `traces-to` (the Ideation checklist item(s) this task implements — exact text match, not paraphrase), `requires` (task IDs this task depends on; empty list if none), `files` (exact paths, Create / Modify), `inputs` (artifacts / outputs from prior tasks that this task consumes by name), `outputs` (artifacts this task produces by name — must match downstream tasks' `inputs`), `verifies` (runnable command or file-existence check whose pass proves the task complete) | Per-task records |
| 5a | Leader | Per-task records | Surface to manager | Package |
| 5b | Manager | Package | Run the active runtime's user-decision primitive on task slicing decisions where multiple defensible slicings exist | User decisions |
| 5c | User | Slicing options | Pick one | Locked task list |

**Anti-patterns** (record under Sub-step E if found; correct before WORK):
- `TBD` / `TODO` / `to be defined` in task descriptions
- `Similar to Task N` — each task is self-contained; the executor may read out of order
- Tasks with no anchor
- Tasks describing *what* without naming *which files*

**Outputs**
- File map (grouped by feature concern)
- Locked task list — each task record in the canonical YAML schema: `{id, what, traces-to, requires, files, inputs, outputs, verifies}`

---

### Sub-step C — Dependency Graph (When)

**Purpose**
Capture task ordering as two complementary tables — a dependency table and a parallel-lane table — with conflict flags for cross-lane file overlaps. Lanes are documentation; Execution runs sequentially.

**Inputs**
- Locked task list (Sub-step B output)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Task list | Build the dependency table: per task, list `Depends on` (tasks that must complete first), `Blocks` (tasks waiting on this), `Files touched` | Dependency table |
| 2 | Leader | Dependency table | Build the parallel-lane table: per lane, list its tasks + execution order. Tasks with no shared files and no dependency go in separate lanes; tasks sharing files go in the same lane | Parallel-lane table |
| 3 | Leader | Both tables | Flag conflicts: any two tasks in different lanes that touch the same file → record as `⚠ Tasks {a} and {b} both touch {path} — sequential, not parallel-safe` | Conflict flags |
| 4a | Leader | Tables + flags | Surface to manager | Package |
| 4b | Manager | Package | Run the active runtime's user-decision primitive if any dependency edge is ambiguous (e.g., a soft dependency the leader is unsure about) | User decisions |

**Note on parallelization**: lane metadata is recorded for future possibility, but the Execution Loop runs tasks **sequentially** (one task at a time). Lanes are documentation, not a runtime contract.

**Outputs**
- Dependency table — Task / Depends on / Blocks / Files touched
- Parallel-lane table — Lane / Tasks / Order
- Conflict flag list (zero or more memos)

---

### Sub-step D — Agent Assignment (Who) + Required Skills + Required Mistakes

**Purpose**
Assign each task an agent type, model override (if any), required skills, and required mistakes for the executor to load. Every assignment is justified — the user needs to see why a task goes to one agent type vs. another.

**Inputs**
- Locked task list (Sub-step B output)
- Dependency + lane tables (Sub-step C output)
- Memory: `.gobbi/projects/{project-name}/mistakes/`, `features/{feature-name}/mistakes/`
- Project + workspace skills: `.gobbi/projects/{project-name}/skills/` — the single canonical skill root for both runtimes (runtime discovery symlinks resolve into it; never a skill-load path)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Task | Propose **agent type**: typically `executor`. Use `leader` only when the task requires sub-decomposition or sub-planning. Use `assistant` only for mechanical / trivial work (doc edits, file renames, copy-and-modify) | Agent type per task |
| 2 | Leader | Task + agent type | Propose **model override** if any. Defaults follow [delegation/SKILL.md § Model Selection](../delegation/SKILL.md#model-selection): executor→opus, leader→opus, assistant→sonnet. Override only when a task has unusual complexity or simplicity | Model override (if any) per task |
| 3 | Leader | Task + agent type + files | Enumerate **required skills**: `principles` (always), workflow skills for the task's phase (e.g., `execution` for implementation tasks), domain skills from the current skill tree (e.g., `git` for branch work), project-specific skills (e.g., `{project-name}-typescript-conventions` if they exist in `.gobbi/projects/{project-name}/skills/`), and the phase doc relevant to the task | Required skills list per task |
| 4 | Leader | Task + files | Enumerate **required mistakes**: project mistakes at `.gobbi/projects/{project-name}/mistakes/` filtered by domain, feature-specific mistakes at `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` if present (read both recursively — mistakes nest under `{area}/` subdirs, so descend into every area subdir) | Required mistakes list per task |
| 5a | Leader | Per-task assignments | Surface to manager | Package |
| 5b | Manager | Package | Run the active runtime's user-decision primitive when: (a) a task's agent type is ambiguous, (b) a task's required skills are not obvious from the files touched, (c) a model override is proposed | User decisions |

The skill / mistake set is **declarative** — the planning artifacts list what the Execution Loop's manager must inject into each delegation prompt's Load Directives block (see [delegation/SKILL.md § The Load Directives Block](../delegation/SKILL.md#the-load-directives-block)).

**Outputs**
- Per-task assignment record: agent type / model override / required skills / required mistakes — justifications captured for any non-default choice

---

### Sub-step E — Self-Review (consistency, coverage, placeholders)

**Purpose**
Catch the most common cross-task drift bugs before WORK begins — type/name consistency, spec coverage, and placeholder presence. This is a self-check the leader runs against its own DISCUSSION output; it is **not** an evaluator dispatch.

**Inputs**
- Outputs from Sub-steps A–D
- Ideation scenario set + implementation checklist (for spec-coverage cross-check)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Task list + Ideation checklist | **Spec coverage check** — for each checklist item in Ideation, identify the task that implements it. Flag any unmatched checklist item or any task without a checklist anchor | Coverage report |
| 2 | Leader | Task list | **Placeholder scan** — search every task description and acceptance criterion for `TBD`, `TODO`, `to be defined`, `<...>`, `XXX`, `FIXME`. Flag any hit | Placeholder report |
| 3 | Leader | Task list | **Type / name consistency check** — for every identifier (function name, class name, file path, type name) used in a later task, confirm the identifier matches what an earlier task defines or modifies. `clearLayers()` in Task 3 and `clearFullLayers()` in Task 7 is a bug | Consistency report |
| 4 | Leader | Three reports | Compile into a single self-review report; if any report has findings, return to the relevant sub-step and fix before WORK | Self-review report |
| 5a | Leader | Self-review report | Surface to manager | Package |
| 5b | Manager | Package | Confirm zero outstanding findings (or use the active runtime's user-decision primitive if the leader proposes accepting a finding without fix) | Self-review clearance |

**Outputs**
- Self-review report (zero-finding clearance, or the explicit acceptances the user approved)

---

## WORK Phase

**Purpose**
Persist every DISCUSSION decision into a durable session draft. WORK is a **documentation pass plus session-record staging** — no new design content; every decision was approved during DISCUSSION. Memory is not written here; Wrap-up handles session → project promotion.

**Inputs**
- DISCUSSION outputs from Sub-steps A–E
- Existing session directory tree at `sessions/{date}-{session-id}/3-planning/{working,staging,evaluation}/` (bootstrapped by the manager)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | DISCUSSION outputs; required-sections template | Write the working draft using the required-sections template | `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md` |
| 2 | Leader | Locked task list + per-task assignments | Stamp `staging/plans/{slug}.md` per the [plans template](../memory/templates/plans.md) — one file per substantive plan topic; on simple workflows a single `plans/main.md` is acceptable | One or more staged plan files |
| 3 | Leader | All DISCUSSION user-decision outcomes from transcript | Stamp the Decisions Log section — task slicing decisions, agent type ambiguity resolutions, model overrides, USER CHALLENGE outcomes, self-review acceptances | Populated Decisions Log |
| 4 | Leader | Working draft + staged plans | Verify the WORK exit checklist | Completion signal, or gap surfaced to manager |

**Outputs**

- `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md` — canonical working draft, stamped to the required-sections template below
- `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` — staged plan file(s); Wrap-up promotes to `features/{feature-name}/plans/`

Required-sections template for the working draft:

```markdown
## Scope reference
{Link to `1-ideation/outputs/` and the locked Scope Contract section. Verbatim copy of Project / Feature / Task triplet.}

## File map
{All files this plan will create or modify, with each file's responsibility. Grouped by feature concern.}

## Tasks
{Numbered list. Each task uses the canonical YAML schema:
```yaml
id: {slug}
what: {one-sentence imperative description}
traces-to: [{exact Ideation checklist item text}]
requires: [{prior task id}]  # empty list if none
files: [{path: "...", op: create|modify}]
inputs: [{name of artifact consumed from a prior task's outputs}]
outputs: [{name of artifact this task produces}]
verifies: {runnable command or file-existence check}
```
}

## Dependency table
{Sub-step C Table 1 — Task / Depends on / Blocks / Files touched.}

## Parallel lanes
{Sub-step C Table 2 — Lane / Tasks / Order. Plus conflict flags as memos.}

## Agent assignments
{Sub-step D per task: Agent type / Model override (if any) / Required skills / Required mistakes. Justify any non-default.}

## Self-review report
{Sub-step E: spec-coverage / placeholder-scan / type-name-consistency results, plus any user-approved acceptances.}

## NOT in scope
{Explicit deferrals. Items the plan does NOT cover and why — typically because Ideation deferred them to backlog or a future workflow.}

## Decisions log
{Summary of user choices made through the active runtime's user-decision primitive during DISCUSSION — task slicing, agent type, model overrides, USER CHALLENGE outcomes, self-review acceptances.}
```

**Exit checklist**
- [ ] Working draft has all 9 required sections populated, no `TODO` / `TBD` / `<...>` placeholders
- [ ] `staging/plans/{slug}.md` stamped for every substantive plan topic
- [ ] Decisions Log cites every user-decision outcome (including USER CHALLENGEs)
- [ ] No writes to memory (`features/{feature-name}/...` or top-level project dirs)
- [ ] No content beyond what was approved in DISCUSSION

### WORK discipline

- **No new content.** WORK does not introduce tasks the user did not approve in DISCUSSION. If documentation surfaces a gap (e.g., a checklist item with no task), raise it to the manager — re-entering DISCUSSION is preferred over silent invention.
- **Cite the discussion.** Each section should be traceable to a DISCUSSION exchange (visible in the parent transcript). The Decisions Log makes this explicit.
- **Anchor everything.** Every task in the Tasks section names its scenario / checklist anchor. Anchor-less tasks are anti-pattern.
- **Stay terse.** The draft is a record of decisions, not a re-derivation. Reasoning and alternatives live in transcripts; the artifact is the conclusion.

### Dual-system production (Codex proposer)

When `propose.mode: dual` (the per-loop `workflow.{loop}.propose.mode` setting; default `dual`), a Codex proposer runs in parallel with the leader during WORK — the creation-time analogue of the dual-system EVALUATION. The proposer is the `codex exec` assistant-wrapper owned by [`codex/SKILL.md` § Dual-System Production](../codex/SKILL.md); the manager orchestrates the spawn, selective integration, and gap classification per [`orchestration/workflow/production.md`](../orchestration/workflow/production.md). This section states only the per-loop boundary and does not re-derive that orchestration.

- **Codex proposal artifact.** The Codex proposer writes an independent alternative task decomposition to `sessions/{date}-{session-id}/3-planning/working/proposals/codex/draft-iter{n}.md` — never the canonical `working/draft-iter{n}.md`. Codex proposes; the leader writes.
- **Two-phase freeze boundary.** The Codex proposal is **frozen** before the leader integrates it; the canonical `working/draft-iter{n}.md` is **frozen** before EVALUATION spawns. The leader integrates against the frozen proposal — it never races a still-writing Codex run — and the canonical artifact does not change under the evaluator. Derived from [`evaluation/mistakes.md#freeze-producer-artifact-before-evaluating`](../evaluation/mistakes.md#freeze-producer-artifact-before-evaluating).
- **Producer selective integration.** The leader is the default integrator. After the pre-integration freeze it reads the frozen proposal and **selects** the principle-better elements (folds in the stronger Codex element; keeps its own where stronger; **never naive-blends**), logging each delta to `sessions/{date}-{session-id}/3-planning/working/reconciliation-iter{n}.md` (the Integration Log). The leader integrates the slicing, dependencies, and assignments and surfaces fork-level disagreements; it surfaces any LARGE gap to the manager, who adjudicates and escalates to the user. See [`orchestration/workflow/production.md`](../orchestration/workflow/production.md) for the integration + gap-classification orchestration.
- **Degraded mode.** If the Codex proposal is empty, times out, or errors, the leader proceeds Claude-only and stamps `production_mode: claude-only` + `codex_proposal_absent_reason: <timeout|empty|error>` in the canonical artifact's frontmatter. A missing Codex proposer is not a safety gate.

---

## EVALUATION Phase

**Purpose**
Find the planning gaps WORK missed. Two independent systems (Claude Code + Codex) evaluate the artifact across all seven perspectives + Overall; the manager reconciles their findings and produces a single `PASS` / `REVISE` / `FAIL` verdict. Every verdict advances to RECORD so each iteration's evidence is preserved; only the post-RECORD transition differs (`PASS` exits the loop, `REVISE` re-enters DISCUSSION, `FAIL` escalates).

See [evaluation skill](../evaluation/SKILL.md) for the full Stage 0 / 1 / 2 / 3 procedure, and [`orchestration/workflow/evaluation.md`](../orchestration/workflow/evaluation.md) for the manager's spawn / reconciliation orchestration.

**Inputs** (consumed from the WORK phase output)
- `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md`
- `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` — every staged plan file
- The locked Scope Contract (from Ideation artifacts)
- The discussion log (manager-captured user-decision exchanges)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Manager | WORK outputs; Scope Contract; discussion log | Spawn one evaluator per system (Claude Code + Codex); each handles all seven perspectives + Overall sequentially | Two evaluator agent instances |
| 2 | Evaluator | All step-1 inputs | Run the four-stage procedure per `evaluation/SKILL.md`, loading the `planning/{scenario,checklist,evaluation}.md` bundle at Stage 0 | `evaluation/iter{n}/{claude,codex}/{perspective}.md` + `evaluation/iter{n}/{claude,codex}/overall.md` + `evaluation/iter{n}/{claude,codex}/checklist.md` |
| 3a | Manager | Both systems' per-perspective files | Cross-system reconciliation: pessimistic union of findings; severity-gated divergence handling | Reconciled findings + per-perspective verdicts |
| 3b | Manager | Major divergence (if any) | Run the active runtime's user-decision primitive | (skipped if no major divergence) |
| 3c | User | Divergence question | Decide which verdict to honor | User-confirmed verdict |
| 4 | Manager | Reconciled findings + verdicts | Record aggregated verdict: `PASS` / `REVISE` / `FAIL`. **All verdicts advance to RECORD first**. After RECORD, `PASS` exits the loop; `REVISE` re-enters DISCUSSION (iter increments; evaluator findings feed next DISCUSSION); `FAIL` escalates through the active runtime's user-decision primitive | Workflow-state verdict |

**Outputs**
- `sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{claude,codex}/{perspective}.md` — one file per system × perspective
- `sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{claude,codex}/checklist.md` — the filled copy-then-tick coverage register, one per system
- Aggregated verdict recorded in workflow state (cross-system divergence is derived at RECORD by comparing the per-system files; no separate divergence file is written)

**Planning-specific evaluation emphasis** (the phase child doc directs)
- Anchor completeness — every task → a scenario or checklist item; every checklist item → a task
- Type/name consistency across tasks (caught by Sub-step E, double-checked by evaluator)
- Dependency table soundness — no missed dependencies, no false dependencies
- Agent assignment justifications — every non-default choice has a recorded rationale

**Exit checklist**
- [ ] Both systems produced per-perspective files for every perspective
- [ ] Verdict aggregated and recorded; `REVISE` increments the iteration counter, `PASS` and `FAIL` advance to RECORD

---

## RECORD Phase

> **Canonical procedure: [`record/SKILL.md`](../record/SKILL.md).** RECORD is the per-loop capture sub-phase. Its mechanics — transcript copy, `session.json` iter upsert, PASS-only `outputs/` + typed-finding staging, cumulative-staging, idempotency — are defined once in [`record/SKILL.md`](../record/SKILL.md). This section states only what is specific to the Planning loop; do not re-derive the shared procedure here.

**Purpose**
Persist every iteration's evidence into session record and — on the final `PASS` iteration — emit the loop's `outputs/` files and stage cumulative typed-finding artifacts. RECORD runs after **every** EVALUATION (whether the verdict is `PASS`, `REVISE`, or `FAIL`) so each iteration leaves a durable audit trail. Memory is **not** written here; Wrap-up handles session → project promotion.

See [record skill](../record/SKILL.md) for the every-iter / PASS-only procedure, template-stamping conventions, artifact frontmatter schema, and cumulative-staging rule. [`orchestration/workflow/record.md`](../orchestration/workflow/record.md) covers the manager's spawn / collect orchestration.

**Inputs**
- `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md` — current iteration's WORK output
- `sessions/{date}-{session-id}/3-planning/evaluation/iter{m}/{claude,codex}/{perspective}.md` for `m ∈ 1..n`
- `session.json.transcriptPath` (tilde-expand `$HOME` on read) — manager-stamped transcript path; use `$CLAUDE_TRANSCRIPT_PATH` if reading directly from env. Claude Code transcript jsonl for the iteration window
- `sessions/{date}-{session-id}/3-planning/working/discussion-log.md`
- EVALUATION verdict for this iteration (`PASS` / `REVISE` / `FAIL`)
- WORK-staged plans under `sessions/{date}-{session-id}/3-planning/staging/plans/` (already in place — RECORD supplements, never replaces)

**Procedure** — see [record/SKILL.md § RECORD Phase](../record/SKILL.md#record-phase) for the canonical step-by-step. Planning-specific notes:

- On PASS, the `outputs/` directory should include at least one file with `artifact_type: task-list` decomposing the Tasks + Agent assignments sections, one with `artifact_type: dependencies` capturing the dependency + lane tables, and the mandatory `artifact_type: memory-reads` audit file.
- Cumulative finding staging on PASS: per the routing table in [`evaluation/SKILL.md` § Finding Metadata](../evaluation/SKILL.md#finding-metadata-type--domain--disposition--confidence--severity); planning-specific findings frequently land at `staging/decisions/` (design_flaw / assumption_risk) and `staging/scenarios/` / `staging/checklists/` (gaps the planning evaluator surfaced).
- The Planning loop is the only loop that stages at `staging/plans/{slug}.md` — Wrap-up promotes those to `features/{feature-name}/plans/`.

**Outputs**

Every iteration produces:
- `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` — preserved transcript
- `sessions/{date}-{session-id}/session.json` — upserted `workflow.planning.iterations[]` entry

Only the `PASS` iteration also produces:
- `sessions/{date}-{session-id}/3-planning/outputs/` — canonical artifact files (task-list + dependencies + memory-reads, plus loop-specific decompositions)
- `sessions/{date}-{session-id}/3-planning/staging/` — cumulative evaluator-finding stagings on top of the WORK-staged plan files
- `sessions/{date}-{session-id}/session.json` — `workflow.planning.finishedAt` and `verdict: PASS` set

**Exit checklist**

Every iteration:
- [ ] Each agent transcript copied to session-root `transcripts/{role}-{agentId}.jsonl`
- [ ] `session.json.workflow.planning.iterations[]` includes this iter's `{iter, verdict, finishedAt, evaluation_dir: "evaluation/iter{n}/"}`
- [ ] No writes to feature memory or memory

`PASS` iteration additionally:
- [ ] `outputs/` directory contains one or more files, each carrying valid frontmatter per the [Artifact frontmatter schema](../record/SKILL.md#artifact-frontmatter-schema)
- [ ] At least one artifact has `artifact_type: task-list`
- [ ] At least one artifact has `artifact_type: memory-reads`
- [ ] Every evaluator finding across iters `1..n` staged to the correct `staging/` destination per Type + Domain routing
- [ ] `session.json.workflow.planning.finishedAt` and final `verdict: PASS` set

---

## Output paths

All writes during the Planning Loop are **session-scoped**. Wrap-up promotes the `staging/` directory to memory after the workflow completes — see [wrap-up skill](../wrap-up/SKILL.md).

**Path conventions**

- `{date}` — the session start date in `YYYY-MM-DD` format
- `{session-id}` — runtime session ID resolved by the manager during Configuration. Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value; use the parent session id supplied by the manager.
- `{feature-name}` — feature slug (only used by Wrap-up when promoting to memory; not used inside session paths)
- `{slug}` — slug for a specific artifact, set by the writer at stage time
- `{n}` — iter number, supplied by the manager

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md` | leader (WORK) | every iteration |
| `sessions/{date}-{session-id}/3-planning/working/proposals/codex/draft-iter{n}.md` | Codex proposer (`codex exec` wrapper) | per enabled WORK iter (`propose.mode: dual`) — independent proposal, frozen before integration |
| `sessions/{date}-{session-id}/3-planning/working/reconciliation-iter{n}.md` | leader (WORK) | per integration — the Integration Log (frozen-proposal selective integration) |
| `sessions/{date}-{session-id}/3-planning/working/restore/iter{n}-pre-revise.md` | leader (REVISE entry) | per REVISE iter — verbatim copy of prior iter's draft |
| `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` | leader (WORK) | per substantive plan topic |
| `sessions/{date}-{session-id}/3-planning/staging/scenarios/{slug}.md` | assistant (RECORD) | per `scenario_gap` finding |
| `sessions/{date}-{session-id}/3-planning/staging/checklists/{slug}.md` | assistant (RECORD) | per `checklist_gap` finding |
| `sessions/{date}-{session-id}/3-planning/staging/decisions/{slug}.md` | assistant (RECORD) | per `design_flaw` / `assumption_risk` / `disputed` / `deferred` finding + Domain-routed `general` findings |
| `sessions/{date}-{session-id}/3-planning/staging/discussions/{slug}.md` | assistant (RECORD) | per substantive user-decision topic |
| `sessions/{date}-{session-id}/3-planning/staging/backlogs/feature/{slug}.md` | assistant (RECORD) | per `deferred` finding landing in the feature backlog |
| `sessions/{date}-{session-id}/3-planning/staging/backlogs/project/{slug}.md` | assistant (RECORD) | per `deferred` finding landing in the project backlog |
| `sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{claude,codex}/{perspective}.md` | evaluator (EVALUATION) | one per system × perspective |
| `sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{claude,codex}/checklist.md` | evaluator (EVALUATION) | filled copy-then-tick coverage register, one per system |
| `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` | assistant (RECORD) | per iter — preserved transcript window |
| `sessions/{date}-{session-id}/3-planning/outputs/{free-filename}.md` | assistant (RECORD) | PASS only — one or more artifact files; each carries the [Artifact frontmatter schema](../record/SKILL.md#artifact-frontmatter-schema). Mandatory: ≥ 1 with `artifact_type: task-list`, ≥ 1 with `artifact_type: memory-reads` |
| `sessions/{date}-{session-id}/session.json` | assistant (RECORD) | loop completion timestamps, iter, verdict |

The session directory tree at `sessions/{date}-{session-id}/3-planning/{working,staging,evaluation}/` is bootstrapped by the manager at Planning Loop entry. WORK and RECORD assume the tree exists and surface an error if it does not. Feature directories under `features/{feature-name}/...` are **not** touched during Planning; Wrap-up creates them as needed during memory promotion.

---

## Constraints

- **MUST anchor every task** to a scenario or checklist item from Ideation — anchor-less tasks are forbidden.
- **MUST never silently invent tasks** not approved by the user in DISCUSSION — re-enter DISCUSSION if WORK surfaces a gap.
- **MUST never embed test-writing as a Planning task** — testing is EVALUATION's job; Planning anchors verification, doesn't perform it.
- **MUST never embed implementation code or step-by-step recipes** in task descriptions — the executor decides "how" based on the locked design and memory.
- **MUST list required skills explicitly** in each task's agent assignment (`principles` always; domain + project skills as relevant).
- **MUST list required mistakes explicitly** in each task's agent assignment (project mistakes + feature-specific mistakes filtered by domain).
- **MUST justify any non-default agent type or model override** — the user needs to see why.
- **MUST flag file-overlap conflicts** between parallel-safe lanes as memos in Sub-step C output.
- **MUST run Sub-step E (Self-Review)** before WORK — zero placeholders, zero type/name drift, full spec coverage (or explicit user-approved acceptances).
- **MUST take a Restore Point** at every REVISE entry — copy prior `draft-iter{n-1}.md` to `restore/iter{n-1}-pre-revise.md` with re-run header.
- **MUST escalate via USER CHALLENGE** when the leader substantively disagrees with the user's stated Ideation direction — use the 5-field card; bias defaults to user's original direction.
- **MUST never write to memory or feature memory during the Planning Loop** — all staging happens at `sessions/{date}-{session-id}/3-planning/staging/...`. Wrap-up promotes.
- **MUST never delete** — supersession via frontmatter (`status: superseded`, `superseded_by:`); physical deletion of any file in any tier is forbidden. Terminal artifacts are moved (never deleted) to `archive/{type}/` by Wrap-up at session close.
- **MUST never read or write `session.json` from the leader role** — the manager owns it.
- **MUST disagree when you disagree** — surface technical conflicts with evidence; trigger USER CHALLENGE for substantive disagreements with user direction.
