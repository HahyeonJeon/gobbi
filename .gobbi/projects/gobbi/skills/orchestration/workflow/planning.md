# Workflow — Planning (Orchestration)

How the **manager** orchestrates the Planning Loop. The `leader` and `assistant` specialists that participate load [`planning/SKILL.md`](../../planning/SKILL.md) (leader's role spans both DISCUSSION and WORK) and [`memorization/SKILL.md`](../../memorization/SKILL.md) (assistant's MEMORIZATION procedure).

**Planning focuses on Who / When / Where.** Ideation concentrated on What / Why / How; Planning takes the locked idea and decides who implements what, in what order, where in the codebase.

The Planning Loop runs the four-phase iteration shape — `DISCUSSION` → `WORK` → `EVALUATION` → `MEMORIZATION` → `ITER / EXIT`.

| Phase | Content semantics for Planning |
|---|---|
| `DISCUSSION` | Manager + user + leader (research-backed opinion) discuss Who / When / Where. Tasks, dependencies, and agent assignments are decided here. |
| `WORK` | Leader documents the DISCUSSION outcome into the canonical plan draft. Documentation, not new content. |
| `EVALUATION` | Dual-system evaluators run the four-stage procedure across all seven perspectives + Overall. |
| `MEMORIZATION` | Assistant synthesizes loop's `artifacts/` into session staging only — project-memory promotion is the sole responsibility of Wrap-up. |

---

## DISCUSSION Phase (manager + user + leader)

**Manager's job**: orchestrate the Who / When / Where discussion with the user, spawning the `leader` for research-backed opinion at each sub-step. Detailed sub-step content (file decomposition, task slicing, dependency graphing, agent assignment) lives in [`planning/SKILL.md`](../../planning/SKILL.md); this section covers the **orchestration choreography**.

### Leader spawn pattern

Same pattern as Ideation. The leader does not observe the entire user dialogue. The manager spawns the leader **as needed** for the next decision point, then continues the user discussion with the leader's research and proposed decisions:

```
manager → opens DISCUSSION with user (state: "advancing from Ideation to Planning")
manager → spawns leader: "read ideation/artifacts/ and produce a draft file map + task list"
leader → reads ideation outputs + project memory + codebase → returns proposal
manager → presents leader's proposal → AskUserQuestion → user refines or approves
manager → spawns leader for next sub-step (dependency graph, agent assignment, etc.)
...
```

Multiple leader spawns are normal. The full set of leader transcripts is preserved by MEMORIZATION as the audit trail for "what research informed each planning decision".

### Sub-step orchestration

The manager runs the user through four sub-steps in order. Each is gated by AskUserQuestion before advancing.

| # | Sub-step | Manager's role | Leader's contribution |
|---|---|---|---|
| A | Read Ideation Output | Confirm scope is still valid; user signals readiness to advance | Read `ideation/artifacts/` + accumulated feature scenarios/checklists; enumerate the in-scope checklist items as task seeds |
| B | File Decomposition + Task Definition | Present proposed file map and task slicing to user; iterate until satisfied | Propose file map (one responsibility per file); slice into medium-granularity tasks; anchor every task to a scenario/checklist item |
| C | Dependency Graph (When) | Present dependency table + parallel lane grouping to user; user confirms ordering | Build two tables (Task / Lane); flag file-overlap conflicts between parallel lanes |
| D | Agent Assignment (Who) + Required Skills | Approve agent type and skill list per task via AskUserQuestion | Propose agent type per task (executor default; leader for sub-planning; assistant for trivial); list mandatory skills (`principles` always, plus domain skills per files touched) and project mistakes paths the executor must check |

### When to escalate to user

The leader brings draft proposals; the user makes final calls. Every decision below requires AskUserQuestion:

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

**Manager's job**: spawn the leader for documentation. The leader writes the draft at `sessions/{date}-{session-id}/planning/rawdata/draft-iter{n}.md` integrating everything decided in DISCUSSION.

Manager-side responsibilities:
- Confirm the draft contains every required section (Scope reference / File map / Tasks / Dependency table / Parallel lanes / Agent assignments / Decisions log / NOT in scope)
- Stage the draft in `rawdata/` along with prior leader transcripts (research turns from DISCUSSION)
- On re-entry from a `REVISE` ITER, pass prior evaluator findings as additional input — the leader incorporates corrections during the next DISCUSSION round, then re-documents

WORK is short by design — the substantive thinking happened in DISCUSSION.

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Planning-specific notes:

- **Perspectives**: all seven + Overall (no pruning)
- Planning's evaluator frame is built from [`planning/evaluation.md`](../../planning/evaluation.md) — task narrowness, dependency ordering, scope coverage, verification criteria, file-overlap concerns all live in the per-perspective seed scenarios and attached checklists

---

## MEMORIZATION Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent. The assistant synthesizes loop's `artifacts/` per [`workflow/memorization.md`](memorization.md) and [`memorization/SKILL.md`](../../memorization/SKILL.md). For Planning, the assistant also:

- On `PASS`: stages the plan at `sessions/{date}-{session-id}/planning/staging/plans/{slug}.md` per the plans template; Wrap-up promotes to `features/{feature-name}/plans/{date}-{slug}.md`
- Stages `scenario_gap` / `checklist_gap` discoveries at `sessions/{date}-{session-id}/planning/staging/{scenarios,checklists}/{slug}.md`; Wrap-up promotes to `features/{feature-name}/`
- Does NOT write to project memory directly — all promotion is Wrap-up's responsibility

### Per-iteration session-memory commit cadence

After every iteration's MEMORIZATION completes (`PASS`, `REVISE`, or `FAIL`), the manager creates a session-memory commit on the worktree branch capturing the iteration's outputs (`rawdata/`, `evaluation/iter{n}/`, `staging/`, and the `session.json` upsert; plus `artifacts/` on `PASS`). The commit subject is:

```
chore(session): record planning iter{n} memory
```

with the canonical `AI-Provenance-Record:` trailer in the commit body per `git/conventions.md:116-119`. Use the heredoc form so the trailer actually lands:

```
git -C "$worktreePath" commit -m "$(cat <<'EOF'
chore(session): record planning iter{n} memory

AI-Provenance-Record: gobbi://session/{session-id}/loop/planning/iter{n}
EOF
)"
```

Substitute `{session-id}` and `{n}` from session state. The commit lands on the worktree branch (per `orchestration/SKILL.md § Configuration Step 1` row 5.5 worktree-first lock) and is absorbed into the PR at merge. Verify the trailer landed with `git -C "$worktreePath" log -1 --format=%B` before proceeding.

**Direct mode opt-out:** when `settings.git.workflow.mode == "direct"`, there is no worktree branch and `git.worktreePath` is `null`; the per-iter commit is skipped. The iteration's session-memory still lives under `sessions/{date}-{session-id}/planning/`, but the commit cadence is a worktree-pr-mode contract. See `orchestration/SKILL.md § Configuration Step 1` row 5.5 footnote for the full direct-mode rationale.

---

## ITER / EXIT Decision

After `MEMORIZATION`, the manager decides based on the reconciled verdict:

| Verdict | Action |
|---|---|
| `PASS` | Exit the loop; advance to Execution Loop |
| `REVISE` | Re-enter `DISCUSSION` with evaluator findings as new input |
| `FAIL` | Escalate via AskUserQuestion; user decides revise / abort / re-enter Ideation |
| `SKIPPED` | Exit the loop (Planning was skipped per settings — only valid for trivial tasks where the "plan" is a single task) |

Iteration cap: `workflow.planning.maxIterations` (default 3). When the cap is reached without `PASS`, the manager forces user escalation.

---

## Output

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/planning/
├── artifacts/             ← PASS-iter output files (assistant, MEMORIZATION, PASS only)
├── rawdata/                ← leader drafts (per iter), agent transcripts, discussion-log.md
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

**No project-memory writes during Planning.** All `features/{feature-name}/...` and project-tier writes happen at Wrap-up — see [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md).

---

## Cross-references

- Leader's planning procedure → [`planning/SKILL.md`](../../planning/SKILL.md)
- Ideation output that becomes Planning's input → [`workflow/ideation.md`](ideation.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Synthesis orchestration → [`workflow/memorization.md`](memorization.md)
- Discussion templates → [`discussion`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation`](../../delegation/SKILL.md)
- Delegation prompt fields → [`delegation` § What Every Delegation Prompt Contains](../../delegation/SKILL.md#what-every-delegation-prompt-contains)
