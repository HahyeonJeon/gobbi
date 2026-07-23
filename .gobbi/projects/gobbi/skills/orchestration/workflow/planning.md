# Workflow — Planning (Orchestration)

**Doc kind:** loop-orchestration.
**Purpose:** the manager orchestrates the Planning Loop — it runs the four sub-phases
DISCUSSION → WORK → EVALUATION → RECORD, then the ITER / EXIT decision — AND owns the
Gobbi-operational Planning procedure the leader follows inside those sub-phases.
**Planning focuses on Who / When / Where:** Ideation concentrated on What / Why / How;
Planning takes the locked idea and decides who implements what, in what order, where in the
codebase.
- **Who** — which agent type implements each task (`executor` / `leader` / `assistant`) and what skills they must load
- **When** — task order, dependencies, parallel-safe lanes (lanes are documentation; Execution runs sequentially)
- **Where** — which files / directories each task touches; scope boundaries between tasks

Planning runs **between Preparation and Execution**. It takes the locked Ideation artifacts
(`1-ideation/outputs/`) + Preparation's readiness output (`2-preparation/outputs/`) as inputs and
produces `3-planning/outputs/` files the Execution Loop reads as its briefing source. The leader's
role spans **both** DISCUSSION and WORK; the assistant owns RECORD; the evaluator owns EVALUATION.

**Local procedure (D2 Option D):** this `loop-orchestration` doc is manifest-authorized — via the `local-procedure` flag in `pointer-drift-manifest.txt` — to carry its own locally-owned operational Planning procedure: the Gobbi-specific operations of this loop only (Memory Access Matrix, sub-steps, task schema, restore point, USER CHALLENGE, Output paths, Constraints). General planning craft stays sole-owned by the planning SOP and is reached by one typed pointer, never restated; each peer-owned shared mechanism keeps its single typed owner pointer. The `check-workflow-pointer-drift.sh` invariant-(iii) check (#8) enforces this fail-closed: an unauthorized doc claiming the annex, or an authorized doc copying a generic-SOP section heading, fails. The normative rule is `point-dont-restate-workflow-docs.md`.

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

**Restore-point exception**: at REVISE entry, the leader copies the prior iter's draft from `working/draft-iter{n-1}.md` to `working/restore/iter{n-1}-pre-revise.md`. This is a **write**, not a delete or mutation — the original `draft-iter{n-1}.md` is preserved as-is. See § DISCUSSION Phase → Restore Point below.

**Write enforcement**: any write attempted outside the WRITE rows above is a constraint violation. Code attempting writes to memory or feature memory must be revoked and Planning restarted with a corrected scope.

---

## Operating principles

The gobbi-operational discipline for every agent in this loop. The generic, workflow-agnostic
planning **craft** — how to decompose, slice, anchor, sequence, and self-review well in the abstract —
is sole-owned by the SOP and reached by one pointer, never restated here.

> **Procedure owner:** the generic planning craft lives in the [planning SOP](../../planning/SKILL.md). This pointer is **anchorless** by design — it names the SOP as a whole, so it still resolves while the SOP is being rewritten into its own section shape. Read it for the workflow-agnostic method; this doc owns only the Gobbi operations that apply the method.

> **The plan tells specialists what, not how.**

Every task is a YAML schema record: `{id, what, traces-to, requires, files, inputs, outputs, verifies}`. The executor decides "how" based on the locked Ideation design, memory, and codebase patterns. Planning does not embed implementation code, command scripts, or step-by-step recipes — that would suppress the executor's engineering judgment.

> **Anchor every task.**

Every task names its source — a scenario from `1-ideation/outputs/`, a checklist item, or a `design_flaw` / `assumption_risk` finding from prior EVALUATION. The `3-planning/outputs/` files become the Execution Loop's briefing, so spell out file scope, anchor, verification method, and the skills the executor must load. Anchor-less tasks are forbidden — they are how scope creep enters the plan.

> **Stay in scope.**

The Scope Contract from Ideation is binding. Tasks that drift beyond it are either dropped or trigger a REVISE back to Ideation. The leader does not silently grow the plan beyond what Ideation locked. Out-of-scope items get logged as backlog candidates; they never silently graduate into the canonical artifact. Scope Contract schema is canonical at [`evaluation/SKILL.md`](../../evaluation/SKILL.md) § Scope Contract Schema.

> **Disagree when you disagree.**

If the Ideation design has gaps that make planning impossible — missing scenarios, vague checklist items, unstated constraints — surface them explicitly with evidence. Anti-sycophancy is mandatory. When the leader's research-backed analysis substantively disagrees with the user's stated direction, escalate via the USER CHALLENGE primitive below rather than silently planning a compromise.

> **Test-writing is NOT a planning task.**

Verification is anchored, not authored, by Planning. Every task's acceptance criterion points to the scenario / checklist item / evaluation criterion the Ideation Loop already produced. The Execution Loop implements; the EVALUATION sub-phase tests. Planning does not slice "write test X" as a separate task.

> **NEEDS_CONTEXT escalation.**

This loop's DISCUSSION phase is manager-direct (the manager uses the active runtime's user-decision primitive when user input is needed); subagents do not run DISCUSSION here. The NEEDS_CONTEXT escalation primitive applies to subagents during the WORK phase only — the leader returns NEEDS_CONTEXT in its final report; the manager handles the user-question block per [`discussion/SKILL.md`](../../discussion/SKILL.md). See `agents/leader.md` § Status Contract for the leader's NEEDS_CONTEXT pattern.

## USER CHALLENGE

Structured escalation when the leader disagrees with the user. When the leader's analysis (research
+ codebase reality + project mistakes) concludes the user's stated direction at Ideation should change
for planning to be sound, the manager uses the active runtime's user-decision primitive with this
structured format:

| Field | Content |
|---|---|
| **What the user said** | The user's stated direction, verbatim from the Ideation discussion log |
| **What the leader recommends** | The leader's proposed change, one sentence |
| **Why** | Research / codebase / mistake evidence supporting the change, with paths and excerpts |
| **What we might be missing** | Counter-arguments the leader considered; constraints the user may know that the leader does not |
| **If we're wrong, the cost is** | The downside of pursuing the leader's recommendation if the user's direction was actually right |

The user's original direction is the default. The leader's recommendation only wins if the user explicitly accepts the change. USER CHALLENGE is reserved for substantive disagreements — not granularity nits or task-slicing preferences.

---

## DISCUSSION Orchestration

**Manager's job**: orchestrate the Who / When / Where discussion with the user, spawning the `leader` for research-backed opinion at each sub-step. The leader's detailed sub-step procedure (Restore Point + Sub-steps A–E) lives in § DISCUSSION Phase below; this section covers the **orchestration choreography**.

### Leader spawn pattern

Same pattern as Ideation. The leader does not observe the entire user dialogue. The manager spawns the leader **as needed** for the next decision point, then continues the user discussion with the leader's research and proposed decisions:

```
manager → opens DISCUSSION with user (state: "advancing from Ideation to Planning")
manager → spawns leader: "read 1-ideation/outputs/ and produce a draft file map + task list"
leader → reads ideation outputs + memory + codebase → returns proposal
manager → presents leader's proposal → active runtime's user-decision primitive → user refines or approves
manager → spawns leader for next sub-step (dependency graph, agent assignment, etc.)
...
```

Multiple leader spawns are normal. RECORD preserves the leader's record as the audit trail for "what research informed each planning decision". Under **fresh spawns**, that record is the full set of per-spawn leader transcripts. Under **Claude Code leader continuation** (one teammate carried across sub-steps — see [`orchestration/delegation.md` § Continue vs Fresh](../delegation.md#continue-vs-fresh)), it is the single continued-leader transcript that spans those turns; one transcript across turns still preserves the whole research chain, so continuation does not lose audit coverage. Native Codex uses fresh leader spawns with full Load Directives.

### Sub-step orchestration

The manager runs the user through the sub-steps in order. Each is gated by the active runtime's user-decision primitive before advancing.

| # | Sub-step | Manager's role | Leader's contribution |
|---|---|---|---|
| A | Read Ideation + Preparation Output | Confirm scope is still valid; user signals readiness to advance | Read `1-ideation/outputs/` + `2-preparation/outputs/` + accumulated feature scenarios/checklists; enumerate the in-scope checklist items as task seeds |
| B | File Decomposition + Task Definition | Present proposed file map and task slicing to user; iterate until satisfied | Propose file map (one responsibility per file); slice into medium-granularity tasks; anchor every task to a scenario/checklist item |
| C | Dependency Graph (When) | Present dependency table + parallel lane grouping to user; user confirms ordering | Build two tables (Task / Lane); flag file-overlap conflicts between parallel lanes |
| D | Agent Assignment (Who) + Required Skills | Approve agent type and skill list per task through the active runtime's user-decision primitive | Propose agent type per task (executor default; leader for sub-planning; assistant for trivial); list mandatory skills (`principles` always, plus domain skills per files touched) and project mistakes paths the executor must check |
| E | Self-Review | Confirm zero outstanding findings before WORK | Run spec-coverage, placeholder-scan, and type/name-consistency checks over the drafted plan |

### When to escalate to user

The leader brings draft proposals; the user makes final calls. Every decision below requires the active runtime's user-decision primitive:

- Confirmation that ideation's scope is still the right working scope (Sub-step A)
- File map approval (Sub-step B)
- Task slicing — granularity boundaries (Sub-step B)
- Each task's anchor and acceptance criterion (Sub-step B)
- Dependency table correctness (Sub-step C)
- Parallel lane assignments + conflict resolutions (Sub-step C)
- Agent type for any task that isn't a straightforward executor assignment (Sub-step D)
- Required-skill list for non-obvious tasks (Sub-step D)
- Contribution points the leader surfaces at any sub-step

---

## DISCUSSION Phase

The leader's operational procedure inside DISCUSSION. Take the locked Ideation output + Preparation
readiness and decompose it into a user-approved task plan with explicit Who / When / Where. Each
sub-step pushes the decomposition toward more specificity, so that by the end no downstream phase has
to guess at task scope, dependencies, or agent assignments.

**Inputs**
- `sessions/{date}-{session-id}/1-ideation/outputs/` (canonical, locked design)
- `sessions/{date}-{session-id}/2-preparation/outputs/` (readiness assessment + any generated project-specific skills now staged)
- `sessions/{date}-{session-id}/2-preparation/staging/` (skills / scenarios / decisions staged by Preparation)
- `.gobbi/projects/{project-name}/features/{feature-name}/{scenarios,checklists,decisions,design,mistakes}/` (accumulated feature memory)
- `.gobbi/projects/{project-name}/{mistakes,rules}/` (project-wide context)
- On `REVISE` iterations: prior iter's evaluator findings + the restore-point copy of prior draft

**Procedure** — run sub-steps A → B → C → D → E in order. On REVISE iterations, **Restore Point is taken before Sub-step A**.

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

### Restore Point (REVISE entry only)

**Purpose** — preserve the prior iteration's draft byte-for-byte before any REVISE mutation, so the prior plan version is addressable by name (not by grep through git log).

**Procedure** — runs at REVISE entry, before Sub-step A

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | `sessions/{date}-{session-id}/3-planning/working/draft-iter{n-1}.md` | Copy verbatim to `sessions/{date}-{session-id}/3-planning/working/restore/iter{n-1}-pre-revise.md`; prepend a 3-line header: `# Restore point — iter {n-1} pre-REVISE`, `# Captured: {YYYY-MM-DD}`, `# To re-run: copy this file back to draft-iter{n-1}.md` | Restore-point snapshot |
| 2 | Leader | Restore-point path + prior evaluator findings | Read both; surface to manager which findings will drive this REVISE iter | Findings-driven entry brief |

Restore points accumulate across REVISE iterations — each one is preserved as `restore/iter{m}-pre-revise.md` for `m ∈ 1..n-1`. They are session-scoped only and never promoted to memory.

### Sub-step A — Read Ideation + Preparation Output

**Purpose** — read the locked Scope Contract, design, scenarios, checklist, and Preparation readiness end-to-end. Enumerate the **task seed set** — every checklist item inside the Scope Contract becomes a candidate task.

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

**Outputs** — task seed set (consumed by Sub-step B); gap findings (empty on the happy path; non-empty triggers manager-side remediation discussion).

### Sub-step B — File Decomposition + Task Definition

**Purpose** — map every file the design will create or modify, then slice the file map into medium-granularity tasks. The file map is the decomposition; tasks are slices of the file map, not independent decisions.

**Inputs** — task seed set (Sub-step A output); design decisions from `1-ideation/outputs/`; codebase files in the area the design touches.

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

**Outputs** — file map (grouped by feature concern); locked task list — each task record in the canonical YAML schema `{id, what, traces-to, requires, files, inputs, outputs, verifies}`.

### Sub-step C — Dependency Graph (When)

**Purpose** — capture task ordering as two complementary tables — a dependency table and a parallel-lane table — with conflict flags for cross-lane file overlaps. Lanes are documentation; Execution runs sequentially.

**Inputs** — locked task list (Sub-step B output).

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Task list | Build the dependency table: per task, list `Depends on` (tasks that must complete first), `Blocks` (tasks waiting on this), `Files touched` | Dependency table |
| 2 | Leader | Dependency table | Build the parallel-lane table: per lane, list its tasks + execution order. Tasks with no shared files and no dependency go in separate lanes; tasks sharing files go in the same lane | Parallel-lane table |
| 3 | Leader | Both tables | Flag conflicts: any two tasks in different lanes that touch the same file → record as `⚠ Tasks {a} and {b} both touch {path} — sequential, not parallel-safe` | Conflict flags |
| 4a | Leader | Tables + flags | Surface to manager | Package |
| 4b | Manager | Package | Run the active runtime's user-decision primitive if any dependency edge is ambiguous (e.g., a soft dependency the leader is unsure about) | User decisions |

**Note on parallelization**: lane metadata is recorded for future possibility, but the Execution Loop runs tasks **sequentially** (one task at a time). Lanes are documentation, not a runtime contract.

**Outputs** — dependency table (Task / Depends on / Blocks / Files touched); parallel-lane table (Lane / Tasks / Order); conflict flag list (zero or more memos).

### Sub-step D — Agent Assignment (Who) + Required Skills + Required Mistakes

**Purpose** — assign each task an agent type, model override (if any), required skills, and required mistakes for the executor to load. Every assignment is justified — the user needs to see why a task goes to one agent type vs. another.

**Inputs** — locked task list (Sub-step B output); dependency + lane tables (Sub-step C output); memory: `.gobbi/projects/{project-name}/mistakes/`, `features/{feature-name}/mistakes/`; project + workspace skills at `.gobbi/projects/{project-name}/skills/` (the single canonical skill root for both runtimes; runtime discovery symlinks resolve into it, never a skill-load path).

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Task | Propose **agent type**: typically `executor`. Use `leader` only when the task requires sub-decomposition or sub-planning. Use `assistant` only for mechanical / trivial work (doc edits, file renames, copy-and-modify) | Agent type per task |
| 2 | Leader | Task + agent type | Propose **model override** if any. Defaults follow [`orchestration/delegation.md` § Model Selection](../delegation.md#model-selection): executor→opus, leader→opus, assistant→sonnet. Override only when a task has unusual complexity or simplicity | Model override (if any) per task |
| 3 | Leader | Task + agent type + files | Enumerate **required skills**: `principles` (always), workflow skills for the task's phase (e.g., `execution` for implementation tasks), domain skills from the current skill tree (e.g., `git` for branch work), project-specific skills (e.g., `{project-name}-typescript-conventions` if they exist in `.gobbi/projects/{project-name}/skills/`), and the phase doc relevant to the task | Required skills list per task |
| 4 | Leader | Task + files | Enumerate **required mistakes**: project mistakes at `.gobbi/projects/{project-name}/mistakes/` filtered by domain, feature-specific mistakes at `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` if present (read both recursively — mistakes nest under `{area}/` subdirs, so descend into every area subdir) | Required mistakes list per task |
| 5a | Leader | Per-task assignments | Surface to manager | Package |
| 5b | Manager | Package | Run the active runtime's user-decision primitive when: (a) a task's agent type is ambiguous, (b) a task's required skills are not obvious from the files touched, (c) a model override is proposed | User decisions |

The skill / mistake set is **declarative** — the planning artifacts list what the Execution Loop's manager must inject into each delegation prompt's Load Directives block (see [`orchestration/delegation.md` § The Load Directives Block](../delegation.md#the-load-directives-block)).

**Outputs** — per-task assignment record: agent type / model override / required skills / required mistakes — justifications captured for any non-default choice.

### Sub-step E — Self-Review (consistency, coverage, placeholders)

**Purpose** — catch the most common cross-task drift bugs before WORK begins — type/name consistency, spec coverage, and placeholder presence. This is a self-check the leader runs against its own DISCUSSION output; it is **not** an evaluator dispatch.

**Inputs** — outputs from Sub-steps A–D; Ideation scenario set + implementation checklist (for spec-coverage cross-check).

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Task list + Ideation checklist | **Spec coverage check** — for each checklist item in Ideation, identify the task that implements it. Flag any unmatched checklist item or any task without a checklist anchor | Coverage report |
| 2 | Leader | Task list | **Placeholder scan** — search every task description and acceptance criterion for `TBD`, `TODO`, `to be defined`, `<...>`, `XXX`, `FIXME`. Flag any hit | Placeholder report |
| 3 | Leader | Task list | **Type / name consistency check** — for every identifier (function name, class name, file path, type name) used in a later task, confirm the identifier matches what an earlier task defines or modifies. `clearLayers()` in Task 3 and `clearFullLayers()` in Task 7 is a bug | Consistency report |
| 4 | Leader | Three reports | Compile into a single self-review report; if any report has findings, return to the relevant sub-step and fix before WORK | Self-review report |
| 5a | Leader | Self-review report | Surface to manager | Package |
| 5b | Manager | Package | Confirm zero outstanding findings (or use the active runtime's user-decision primitive if the leader proposes accepting a finding without fix) | Self-review clearance |

**Outputs** — self-review report (zero-finding clearance, or the explicit acceptances the user approved).

---

## WORK Orchestration

**Manager's job**: spawn the leader to document. The leader writes the draft at `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md`, integrating everything decided in DISCUSSION. WORK is a **documentation pass plus session-record staging** — no new design content; every decision was approved during DISCUSSION. Memory is not written here; Wrap-up handles session → project promotion.

Manager-side responsibilities:
- Confirm the draft contains every required section (Scope reference / File map / Tasks / Dependency table / Parallel lanes / Agent assignments / Self-review report / NOT in scope / Decisions log)
- Stage the draft in `working/`; the leader's transcripts (research turns from DISCUSSION) land in the session-root `transcripts/`
- On re-entry from a `REVISE` ITER, pass prior evaluator findings as additional input — the leader incorporates corrections during the next DISCUSSION round, then re-documents

WORK is short by design — the substantive thinking happened in DISCUSSION.

> **Production owner:** [`workflow/production.md`](production.md). This doc names only that
> Planning WORK may run dual-system production (`propose.mode: dual`, default) — a Codex proposer
> writes the frozen `proposals/codex/draft-iter{n}.md`, the leader is the sole author of the
> canonical draft and selectively integrates. Do not restate proposer spawn, freeze, selective
> integration, gap classification, or degraded-mode rules.

**Leader WORK procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | DISCUSSION outputs; required-sections template | Write the working draft using the required-sections template below | `working/draft-iter{n}.md` |
| 2 | Leader | Locked task list + per-task assignments | Stamp `staging/plans/{slug}.md` per the [plans template](../../memory/templates/plans.md) — one file per substantive plan topic; on simple workflows a single `plans/main.md` is acceptable | One or more staged plan files |
| 3 | Leader | All DISCUSSION user-decision outcomes from transcript | Stamp the Decisions Log section — task slicing decisions, agent type ambiguity resolutions, model overrides, USER CHALLENGE outcomes, self-review acceptances | Populated Decisions Log |
| 4 | Leader | Working draft + staged plans | Verify the WORK exit checklist | Completion signal, or gap surfaced to manager |

**Outputs**
- `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md` — canonical working draft, stamped to the required-sections template
- `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` — staged plan file(s); Wrap-up promotes to `features/{feature-name}/plans/`

Required-sections template for the working draft:

```markdown
## Scope reference
{Link to `1-ideation/outputs/` and the locked Scope Contract section. Verbatim copy of Project / Feature / Task triplet.}

## File map
{All files this plan will create or modify, with each file's responsibility. Grouped by feature concern.}

## Tasks
{Numbered list. Each task uses the canonical YAML schema:
    id: {slug}
    what: {one-sentence imperative description}
    traces-to: [{exact Ideation checklist item text}]
    requires: [{prior task id}]  # empty list if none
    files: [{path: "...", op: create|modify}]
    inputs: [{name of artifact consumed from a prior task's outputs}]
    outputs: [{name of artifact this task produces}]
    verifies: {runnable command or file-existence check}
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

**WORK discipline**
- **No new content.** WORK does not introduce tasks the user did not approve in DISCUSSION. If documentation surfaces a gap (e.g., a checklist item with no task), raise it to the manager — re-entering DISCUSSION is preferred over silent invention.
- **Cite the discussion.** Each section should be traceable to a DISCUSSION exchange (visible in the parent transcript). The Decisions Log makes this explicit.
- **Anchor everything.** Every task in the Tasks section names its scenario / checklist anchor. Anchor-less tasks are anti-pattern.
- **Stay terse.** The draft is a record of decisions, not a re-derivation. Reasoning and alternatives live in transcripts; the artifact is the conclusion.

---

## EVALUATION Orchestration

**Manager's job**: orchestrate the dual-system evaluator spawn. Two independent systems (Claude Code + Codex) evaluate the artifact across all seven perspectives + Overall; the manager reconciles their findings and produces a single `PASS` / `REVISE` / `FAIL` verdict. Planning-specific notes:

- **Perspectives**: all seven + Overall (no pruning)
- Planning's evaluator frame is built from the `planning/` evaluation bundle — the per-perspective seed scenarios in [`planning/scenario.md`](../../planning/scenario.md) and their checks in [`planning/checklist.md`](../../planning/checklist.md) (procedure in [`planning/evaluation.md`](../../planning/evaluation.md)); task narrowness, dependency ordering, scope coverage, verification criteria, and file-overlap concerns all live in those seed scenarios and checks
- Planning-specific emphasis: anchor completeness (every task → a scenario or checklist item; every checklist item → a task); type/name consistency across tasks (caught by Sub-step E, double-checked by evaluator); dependency table soundness (no missed dependencies, no false dependencies); agent assignment justifications (every non-default choice has a recorded rationale)

> **Evaluation owner:** [`workflow/evaluation.md`](evaluation.md) for the manager's spawn / reconciliation orchestration; [`evaluation/SKILL.md`](../../evaluation/SKILL.md) for the Stage 0 / 1 / 2 / 3 evaluator procedure. Every verdict advances to RECORD first; after RECORD, `PASS` exits the loop, `REVISE` re-enters DISCUSSION, `FAIL` escalates. Do not restate the perspective set or the reconciliation procedure.

---

## RECORD Orchestration

**Manager's job**: spawn the `assistant` agent. RECORD runs after **every** EVALUATION (whether `PASS`, `REVISE`, or `FAIL`) so each iteration leaves a durable audit trail; on the final `PASS` iteration it also emits the loop's `outputs/`. Memory is **not** written here; Wrap-up handles session → project promotion. Planning-specific notes:

- On PASS, the `outputs/` directory should include at least one file with `artifact_type: task-list` (the Tasks + Agent assignments sections), one with `artifact_type: dependencies` (the dependency + lane tables), and the mandatory `artifact_type: memory-reads` audit file.
- On `PASS`: stages the plan at `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` per the plans template; Wrap-up promotes to `features/{feature-name}/plans/{area}/{date}-{slug}.md`. The Planning loop is the only loop that stages at `staging/plans/{slug}.md`.
- Stages `scenario_gap` / `checklist_gap` discoveries at `sessions/{date}-{session-id}/3-planning/staging/{scenarios,checklists}/{slug}.md`; `design_flaw` / `assumption_risk` at `staging/decisions/`; Wrap-up promotes to `features/{feature-name}/`. Routing per [`evaluation/SKILL.md`](../../evaluation/SKILL.md) § Finding Metadata.
- Does NOT write to memory directly — all promotion is Wrap-up's responsibility.

> **Record owner:** [`workflow/record.md`](record.md) for the manager spawn + the validation
> gates (incl. the session-record commit boundary); [`record/SKILL.md`](../../record/SKILL.md)
> for the assistant procedure, template-stamping, the [Artifact frontmatter schema](../../record/SKILL.md#artifact-frontmatter-schema), and cumulative-staging. Planning keeps no loop-specific commit exception.

---

## ITER / EXIT

After `RECORD`, the manager decides based on the reconciled verdict:

| Verdict | Action |
|---|---|
| `PASS` | Exit the loop; advance to Execution Loop |
| `REVISE` | Re-enter `DISCUSSION` with evaluator findings as new input **while iterations remain**. In Chat (one-shot, `maxIter=1`) the single REVISE has no remaining budget → it routes to the after-EVALUATION user gate (see the Iteration cap note below / `chat-mode.md §8.2`), not an automatic re-entry. |
| `FAIL` | Escalate through the active runtime's user-decision primitive; user decides revise / abort / re-enter Ideation |
| `SKIPPED` | Exit the loop (Planning was skipped per settings — only valid for trivial tasks where the "plan" is a single task) |

Iteration cap: `workflow.planning.maxIterations` (Auto 5; Chat 1 — one-shot). When the cap is reached without `PASS`, the manager forces user escalation; in Chat the single-pass REVISE routes to the after-EVALUATION user gate (`chat-mode.md §5` / §8.2 — accept / revise-once / reframe), not a hard abort.

---

## Output Pointers

Planning's loop dir is `3-planning/`. All writes during the loop are **session-scoped**; Wrap-up
promotes the `staging/` directory to memory after the workflow completes (see
[`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)). **No memory writes during Planning** — all
`features/{feature-name}/...` and project-tier writes happen at Wrap-up. Loop-specific write targets:

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md` | leader (WORK) | every iteration |
| `sessions/{date}-{session-id}/3-planning/working/proposals/codex/draft-iter{n}.md` | Codex proposer | per enabled WORK iter (`propose.mode: dual`) — frozen before integration |
| `sessions/{date}-{session-id}/3-planning/working/reconciliation-iter{n}.md` | leader (WORK) | per integration — the Integration Log |
| `sessions/{date}-{session-id}/3-planning/working/restore/iter{n}-pre-revise.md` | leader (REVISE entry) | per REVISE iter — verbatim copy of prior iter's draft |
| `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` | leader (WORK) | per substantive plan topic — the loop's headline artifact |
| `sessions/{date}-{session-id}/3-planning/staging/{scenarios,checklists,decisions,discussions,references,design,backlogs/{feature,project}}/{slug}.md` | assistant (RECORD) | per typed finding |
| `sessions/{date}-{session-id}/3-planning/evaluation/iter{n}/{claude,codex}/{perspective}.md` + `overall.md` + `checklist.md` | evaluator (EVALUATION) | one per system × perspective |
| `sessions/{date}-{session-id}/3-planning/outputs/{free-filename}.md` | assistant (RECORD) | PASS only — ≥ 1 `artifact_type: task-list`, ≥ 1 `artifact_type: memory-reads` |

The session subdirectory tree at `sessions/{date}-{session-id}/3-planning/{working,staging,evaluation}/` is bootstrapped by the manager at Planning Loop entry. WORK and RECORD assume the tree exists and surface an error if it does not.

> **Path owner:** [`record/record-map.md`](../../record/record-map.md). The full session tree,
> 4-slot interior, and PASS-only `outputs/` lifecycle live there — never redrawn here.

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

---

## Cross-references

- Generic planning craft (workflow-agnostic SOP) → the anchorless Procedure-owner pointer in § Operating principles
- Ideation output that becomes Planning's input → [`workflow/ideation.md`](ideation.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Proposer orchestration → [`workflow/production.md`](production.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../delegation.md)
- Delegation prompt fields → [`delegation` § What Every Delegation Prompt Contains](../delegation.md#what-every-delegation-prompt-contains)
