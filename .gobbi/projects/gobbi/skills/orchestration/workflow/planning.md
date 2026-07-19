# Workflow — Planning (Orchestration)

**Doc kind:** loop-orchestration.
**Purpose:** the manager orchestrates the Planning Loop — it runs the four sub-phases
DISCUSSION → WORK → EVALUATION → RECORD, then the ITER / EXIT decision; it does NOT perform
the leader / assistant procedures. **Planning focuses on Who / When / Where:** Ideation
concentrated on What / Why / How; Planning takes the locked idea and decides who implements
what, in what order, where in the codebase.

---

## DISCUSSION Orchestration

**Manager's job**: run the readiness entry gate, then orchestrate the Who / When / Where discussion with the user, spawning the `leader` for research-backed opinion at each sub-step. Detailed gate and decomposition content lives in [`planning/SKILL.md`](../../planning/SKILL.md); this section covers the **orchestration choreography**.

### Readiness entry-gate choreography

This is the first operation inside Planning DISCUSSION. It is not a separate
workflow state, loop, phase, iteration, RECORD run, or evaluation target.

1. Atomically enter Planning before the inventory: set
   `workflow.planning.state: Active` and `phase: DISCUSSION`, then persist the
   state. The leader inventories locked Ideation outputs/staging, applicable
   memory/rules/mistakes, candidate skills, and external write surfaces only
   after this transition. Exactly one workflow step remains active and a crash
   during the gate is resumable.
2. The leader writes
   `2-planning/working/readiness-gate-iter{n}.md` with the seven sections and
   three-result vocabulary defined by `planning/SKILL.md`.
3. `READY` auto-advances to Sub-step A. Do not ask the user to confirm a clean
   scan.
4. `RE-IDEATE` is an Always-Ask material gap: present the evidence and offer
   only re-enter Ideation or abort. Planning may not repair or accept the gap.
   On re-entry, atomically return Planning to Pending and set Ideation Revising,
   preserve the gate artifact, and do not increment Planning's iteration. Rerun
   the gate after Ideation passes by appending a new attempt to the same artifact.
   `NEEDS_CONTEXT` keeps Planning Active in DISCUSSION until context arrives or
   the session is aborted.
5. `NEEDS_CONTEXT` is an Always-Ask blocker: request the missing context or
   authority, or abort. A genuinely missing workspace/domain skill follows this
   route. A missing project-specific skill does not: record it as an Execution
   foundation-task obligation.

### Leader spawn pattern

Same pattern as Ideation. The leader does not observe the entire user dialogue. The manager spawns the leader **as needed** for the next decision point, then continues the user discussion with the leader's research and proposed decisions:

```
manager → opens Planning DISCUSSION and runs the readiness entry gate
leader → writes readiness-gate-iter{n}.md → READY auto-advances (material gaps route as above)
manager → spawns leader: "read 1-ideation/outputs/ and produce a draft file map + task list"
leader → reads ideation outputs + memory + codebase → returns proposal
manager → presents leader's proposal → active runtime's user-decision primitive → user refines or approves
manager → spawns leader for next sub-step (dependency graph, agent assignment, etc.)
...
```

Multiple leader spawns are normal. RECORD preserves the leader's record as the audit trail for "what research informed each planning decision". Under **fresh spawns**, that record is the full set of per-spawn leader transcripts. Under **Claude Code leader continuation** (one teammate carried across sub-steps — see [`orchestration/delegation.md` § Continue vs Fresh](../delegation.md#continue-vs-fresh)), it is the single continued-leader transcript that spans those turns; one transcript across turns still preserves the whole research chain, so continuation does not lose audit coverage. Native Codex uses fresh leader spawns with full Load Directives.

### Sub-step orchestration

After a READY gate, the manager runs five decomposition sub-steps in order.
Only material decisions use the active runtime's user-decision primitive.

| # | Sub-step | Manager's role | Leader's contribution |
|---|---|---|---|
| A | Read Ideation Output | Confirm the READY evidence still matches the scope; route any newly found upstream omission to re-Ideation or abort | Read `1-ideation/outputs/` + accumulated feature scenarios/checklists; enumerate the in-scope checklist items as task seeds |
| B | File Decomposition + Task Definition | Present proposed file map and task slicing to user; iterate until satisfied | Propose file map (one responsibility per file); slice into medium-granularity tasks; anchor every task to a scenario/checklist item |
| C | Dependency Graph (When) | Present dependency table + parallel lane grouping to user; user confirms ordering | Build two tables (Task / Lane); flag file-overlap conflicts between parallel lanes |
| D | Agent Assignment (Who) + Required Skills | Resolve material assignment/authority decisions | Propose agent type; revalidate skill paths; route missing workspace/domain skills to NEEDS_CONTEXT; make missing project-specific skill authoring Task 01; revalidate all external-write dispositions against the concrete task map |
| E | Self-Review | Confirm zero outstanding consistency, coverage, or placeholder findings | Cross-check traces, identifiers, placeholders, readiness obligations, and task dependencies before WORK |

### When to escalate to user

The leader brings draft proposals; the user makes final calls. Every decision below requires the active runtime's user-decision primitive:

- File map approval (Sub-step B)
- Task slicing — granularity boundaries (Sub-step B)
- Each task's anchor and acceptance criterion (Sub-step B)
- Dependency table correctness (Sub-step C)
- Parallel lane assignments + conflict resolutions (Sub-step C)
- Agent type for any task that isn't a straightforward executor assignment (Sub-step D)
- Required-skill list for non-obvious tasks (Sub-step D)
- Any material readiness gap, missing authority/context, or external-write go/no-go (entry gate / Sub-step D)
- Contribution points the leader surfaces at any sub-step

---

## WORK Orchestration

**Manager's job**: spawn the leader for documentation. The leader writes the draft at `sessions/{date}-{session-id}/2-planning/working/draft-iter{n}.md` integrating everything decided in DISCUSSION.

Manager-side responsibilities:
- Confirm the draft contains every required section (Readiness report / Scope reference / File map / Tasks / Dependency table / Parallel lanes / Agent assignments / Self-review report / NOT in scope / Decisions log)
- Stage the draft in `working/`; the leader's transcripts (research turns from DISCUSSION) land in the session-root `transcripts/`
- On re-entry from a `REVISE` ITER, pass prior evaluator findings as additional input — the leader incorporates corrections during the next DISCUSSION round, then re-documents

WORK is short by design — the substantive thinking happened in DISCUSSION.

> **Production owner:** [`workflow/production.md`](production.md). This doc names only that
> Planning WORK may run dual-system production (`propose.mode: dual`, default). Do not
> restate proposer spawn, freeze, selective integration, gap classification, or
> degraded-mode rules.

---

## EVALUATION Orchestration

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Planning-specific notes:

- **Perspectives**: all seven + Overall (no pruning)
- Planning's evaluator frame is built from the `planning/` evaluation bundle — the per-perspective seed scenarios in [`planning/scenario.md`](../../planning/scenario.md) and their checks in [`planning/checklist.md`](../../planning/checklist.md) (procedure in [`planning/evaluation.md`](../../planning/evaluation.md)); task narrowness, dependency ordering, scope coverage, verification criteria, and file-overlap concerns all live in those seed scenarios and checks

---

## RECORD Orchestration

**Manager's job**: spawn the `assistant` agent. The assistant synthesizes loop's `outputs/` per [`workflow/record.md`](record.md) and [`record/SKILL.md`](../../record/SKILL.md). For Planning, the assistant also:

- On `PASS`: stages the plan at `sessions/{date}-{session-id}/2-planning/staging/plans/{slug}.md` per the plans template; Wrap-up promotes to `features/{feature-name}/plans/{area}/{date}-{slug}.md`
- Stages `scenario_gap` / `checklist_gap` discoveries at `sessions/{date}-{session-id}/2-planning/staging/{scenarios,checklists}/{slug}.md`; Wrap-up promotes to `features/{feature-name}/`
- Does NOT write to memory directly — all promotion is Wrap-up's responsibility

> **Record owner:** [`workflow/record.md`](record.md) for manager spawn + the validation
> gates (incl. the session-record commit boundary); [`record/SKILL.md`](../../record/SKILL.md)
> for the assistant procedure. Planning keeps no loop-specific commit exception.

---

## ITER / EXIT

After `RECORD`, the manager decides based on the reconciled verdict:

| Verdict | Action |
|---|---|
| `PASS` | Exit the loop; advance to Execution Loop |
| `REVISE` | Re-enter `DISCUSSION` with evaluator findings as new input **while iterations remain**. In Chat (one-shot, `maxIter=1`) the single REVISE has no remaining budget → it routes to the after-EVALUATION user gate (see the Iteration cap note below / `chat-mode.md §8.2`), not an automatic re-entry. |
| `FAIL` | Escalate through the active runtime's user-decision primitive; user decides revise / abort / re-enter Ideation |

Planning is non-skippable in every mode. `workflow.planning.skip` must be `false`
and `maxIterations` must be at least 1; a `SKIPPED` Planning verdict is invalid.

Iteration cap: `workflow.planning.maxIterations` (Auto 5; Chat 1 — one-shot). When the cap is reached without `PASS`, the manager forces user escalation; in Chat the single-pass REVISE routes to the after-EVALUATION user gate (`chat-mode.md §5` / §8.2 — accept / revise-once / reframe), not a hard abort.

---

## Output Pointers

Planning's loop dir is `2-planning/`. Loop-specific files: WORK draft
`working/draft-iter{n}.md`; DISCUSSION entry evidence
`working/readiness-gate-iter{n}.md`; optional Codex proposal `working/proposals/codex/draft-iter{n}.md`
+ Integration Log `working/reconciliation-iter{n}.md`; evaluation
`evaluation/iter{n}/{system}/{perspective}.md` + `overall.md` + `checklist.md`; PASS outputs
`outputs/{free-filename}.md`; staging `staging/{plans,scenarios,checklists,decisions,references,discussions,design}/{slug}.md`,
where `staging/plans/{slug}.md` is the loop's headline artifact. **No memory writes during
Planning** — all `features/{feature-name}/...` and project-tier writes happen at Wrap-up (see
[`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)).

> **Path owner:** [`record/record-map.md`](../../record/record-map.md). The full session tree,
> 4-slot interior, and PASS-only `outputs/` lifecycle live there — never redrawn here.

---

## Cross-references

- Leader's planning procedure → [`planning/SKILL.md`](../../planning/SKILL.md)
- Ideation output that becomes Planning's input → [`workflow/ideation.md`](ideation.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Proposer orchestration → [`workflow/production.md`](production.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../delegation.md)
- Delegation prompt fields → [`delegation` § What Every Delegation Prompt Contains](../delegation.md#what-every-delegation-prompt-contains)
