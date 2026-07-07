# Workflow — Planning (Orchestration)

**Doc kind:** loop-orchestration.

How the **manager** orchestrates the Planning Loop. The `leader` and `assistant` specialists that participate load [`planning/SKILL.md`](../../planning/SKILL.md) (leader's role spans both DISCUSSION and WORK) and [`record/SKILL.md`](../../record/SKILL.md) (assistant's RECORD procedure).

**Planning focuses on Who / When / Where.** Ideation concentrated on What / Why / How; Planning takes the locked idea and decides who implements what, in what order, where in the codebase.

The Planning Loop runs the four sub-phases — `DISCUSSION` → `WORK` → `EVALUATION` → `RECORD` — plus the manager `ITER / EXIT` decision.

| Phase | Content semantics for Planning |
|---|---|
| `DISCUSSION` | Manager + user + leader (research-backed opinion) discuss Who / When / Where. Tasks, dependencies, and agent assignments are decided here. |
| `WORK` | Leader documents the DISCUSSION outcome into the canonical plan draft. Documentation, not new content. |
| `EVALUATION` | Dual-system evaluators run the four-stage procedure across all seven perspectives + Overall. |
| `RECORD` | Assistant synthesizes loop's `outputs/` into session staging only — memory promotion is the sole responsibility of Wrap-up. |

---

## DISCUSSION Phase (manager + user + leader)

**Manager's job**: orchestrate the Who / When / Where discussion with the user, spawning the `leader` for research-backed opinion at each sub-step. Detailed sub-step content (file decomposition, task slicing, dependency graphing, agent assignment) lives in [`planning/SKILL.md`](../../planning/SKILL.md); this section covers the **orchestration choreography**.

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

Multiple leader spawns are normal. RECORD preserves the leader's record as the audit trail for "what research informed each planning decision". Under **fresh spawns**, that record is the full set of per-spawn leader transcripts. Under **Claude Code leader continuation** (one teammate carried across sub-steps — see [`delegation/SKILL.md` § Continue vs Fresh](../../delegation/SKILL.md#continue-vs-fresh)), it is the single continued-leader transcript that spans those turns; one transcript across turns still preserves the whole research chain, so continuation does not lose audit coverage. Native Codex uses fresh leader spawns with full Load Directives.

### Sub-step orchestration

The manager runs the user through four sub-steps in order. Each is gated by the active runtime's user-decision primitive before advancing.

| # | Sub-step | Manager's role | Leader's contribution |
|---|---|---|---|
| A | Read Ideation Output | Confirm scope is still valid; user signals readiness to advance | Read `1-ideation/outputs/` + accumulated feature scenarios/checklists; enumerate the in-scope checklist items as task seeds |
| B | File Decomposition + Task Definition | Present proposed file map and task slicing to user; iterate until satisfied | Propose file map (one responsibility per file); slice into medium-granularity tasks; anchor every task to a scenario/checklist item |
| C | Dependency Graph (When) | Present dependency table + parallel lane grouping to user; user confirms ordering | Build two tables (Task / Lane); flag file-overlap conflicts between parallel lanes |
| D | Agent Assignment (Who) + Required Skills | Approve agent type and skill list per task through the active runtime's user-decision primitive | Propose agent type per task (executor default; leader for sub-planning; assistant for trivial); list mandatory skills (`principles` always, plus domain skills per files touched) and project mistakes paths the executor must check |

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

## WORK Phase (leader documents the DISCUSSION outcome)

**Manager's job**: spawn the leader for documentation. The leader writes the draft at `sessions/{date}-{session-id}/3-planning/working/draft-iter{n}.md` integrating everything decided in DISCUSSION.

Manager-side responsibilities:
- Confirm the draft contains every required section (Scope reference / File map / Tasks / Dependency table / Parallel lanes / Agent assignments / Decisions log / NOT in scope)
- Stage the draft in `working/`; the leader's transcripts (research turns from DISCUSSION) land in the session-root `transcripts/`
- On re-entry from a `REVISE` ITER, pass prior evaluator findings as additional input — the leader incorporates corrections during the next DISCUSSION round, then re-documents

WORK is short by design — the substantive thinking happened in DISCUSSION.

**Dual-system production (proposer spawn).** When `propose.mode: dual` (per-loop; default `dual`), the manager also orchestrates the dual-system **proposer** spawn per [`workflow/production.md`](production.md) during WORK — a Codex proposer runs in parallel with the leader; the leader selectively integrates the frozen proposal and Codex never writes the canonical artifact.

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Planning-specific notes:

- **Perspectives**: all seven + Overall (no pruning)
- Planning's evaluator frame is built from [`planning/evaluation.md`](../../planning/evaluation.md) — task narrowness, dependency ordering, scope coverage, verification criteria, file-overlap concerns all live in the per-perspective seed scenarios and attached checklists

---

## RECORD Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent. The assistant synthesizes loop's `outputs/` per [`workflow/record.md`](record.md) and [`record/SKILL.md`](../../record/SKILL.md). For Planning, the assistant also:

- On `PASS`: stages the plan at `sessions/{date}-{session-id}/3-planning/staging/plans/{slug}.md` per the plans template; Wrap-up promotes to `features/{feature-name}/plans/{area}/{date}-{slug}.md`
- Stages `scenario_gap` / `checklist_gap` discoveries at `sessions/{date}-{session-id}/3-planning/staging/{scenarios,checklists}/{slug}.md`; Wrap-up promotes to `features/{feature-name}/`
- Does NOT write to memory directly — all promotion is Wrap-up's responsibility

> **Record owner:** [`workflow/record.md`](record.md) for manager spawn + the validation
> gates (incl. the session-record commit boundary); [`record/SKILL.md`](../../record/SKILL.md)
> for the assistant procedure. Planning keeps no loop-specific commit exception.

---

## ITER / EXIT Decision

After `RECORD`, the manager decides based on the reconciled verdict:

| Verdict | Action |
|---|---|
| `PASS` | Exit the loop; advance to Execution Loop |
| `REVISE` | Re-enter `DISCUSSION` with evaluator findings as new input **while iterations remain**. In Chat (one-shot, `maxIter=1`) the single REVISE has no remaining budget → it routes to the after-EVALUATION user gate (see the Iteration cap note below / `chat-mode.md §8.2`), not an automatic re-entry. |
| `FAIL` | Escalate through the active runtime's user-decision primitive; user decides revise / abort / re-enter Ideation |
| `SKIPPED` | Exit the loop (Planning was skipped per settings — only valid for trivial tasks where the "plan" is a single task) |

Iteration cap: `workflow.planning.maxIterations` (Auto 5; Chat 1 — one-shot). When the cap is reached without `PASS`, the manager forces user escalation; in Chat the single-pass REVISE routes to the after-EVALUATION user gate (`chat-mode.md §5` / §8.2 — accept / revise-once / reframe), not a hard abort.

---

## Output

The canonical tree is [`record/record-map.md`](../../record/record-map.md); Planning's loop dir is `3-planning/`.

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/
├── transcripts/                       ← single session-root surface; {role}-{agentId}.jsonl per agent, all loops
└── 3-planning/
    ├── outputs/             ← PASS-iter output files (assistant, RECORD, PASS only)
    ├── working/                ← leader drafts (per iter), discussion-log.md, research refs
    ├── evaluation/
    │   └── iter{n}/
    │       ├── claude/{perspective}.md
    │       └── codex/{perspective}.md
    └── staging/                ← session-staged artifacts for Wrap-up to promote (PASS only)
        ├── plans/{slug}.md
        ├── scenarios/{slug}.md
        ├── checklists/{slug}.md
        ├── decisions/{slug}.md
        ├── references/{slug}.md
        ├── discussions/{slug}.md
        └── design/{slug}.md
```

**No memory writes during Planning.** All `features/{feature-name}/...` and project-tier writes happen at Wrap-up — see [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md).

---

## Cross-references

- Leader's planning procedure → [`planning/SKILL.md`](../../planning/SKILL.md)
- Ideation output that becomes Planning's input → [`workflow/ideation.md`](ideation.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Proposer orchestration → [`workflow/production.md`](production.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../../delegation/SKILL.md)
- Delegation prompt fields → [`delegation` § What Every Delegation Prompt Contains](../../delegation/SKILL.md#what-every-delegation-prompt-contains)
