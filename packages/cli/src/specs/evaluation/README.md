# Evaluation step spec

The evaluation step spec is reused by three workflow steps — `ideation_eval`, `planning_eval`, and `execution_eval` — via `index.json`'s `evalFor` indirection. There is one spec and three workflow-graph entries pointing at it; the session state (`state.currentStep` plus the `evalFor` target) tells the orchestrator which preceding step is under assessment.

Authoritative design: [`v050-prompts.md`](../../../../../.claude/project/gobbi/design/v050-prompts.md) §Stances as CLI-Managed Configuration. Transition graph: [`v050-state-machine.md`](../../../../../.claude/project/gobbi/design/v050-state-machine.md) §Evaluation Gate Model.

---

## Purpose in the v0.5.0 workflow

Evaluation spawns independent evaluator agents from at least two perspectives (Project and Overall are mandatory; additional perspectives are selected based on the step under assessment). Evaluators run on fresh context — the preceding step's orchestrator transcript is never passed to them. Each evaluator produces a perspective artifact; the orchestrator synthesizes the artifacts into a single `evaluation.md` with a verdict the user commits.

The creating agent of the preceding step never participates in its own evaluation. This isolation is the reason evaluation is a separate workflow step rather than a sub-state of the preceding step.

For `execution_eval` revise verdicts, the evaluator specifies a `loopTarget` — one of `ideation`, `planning`, or `execution`. The workflow routes the loop-back to the target step, increments `feedbackRound`, and the target step re-enters with the evaluation findings in context.

---

## spec.json structure

| Section | Purpose |
|---------|---------|
| `meta` | Delegation step: `allowedAgentTypes` names the three evaluator agent kinds, `maxParallelAgents: 5`, required skill `gotcha`, completion signal `SubagentStop`, expected artifacts include the two mandatory perspectives plus the synthesis |
| `transitions` | Two exit edges — `verdictRevise` back to the preceding step, `verdictPass` forward. The graph-level transitions are per-eval-step (see `index.json`); this spec declares the canonical shape |
| `delegation.agents` | Two evaluator agents at `sonnet` / `max` — Project and Overall, the minimum two perspectives |
| `tokenBudget` | `artifacts` slot raised to 0.35 — prior step artifacts drive the evaluation, so they dominate the budget |
| `blocks.static` | Role, principles, and scope-boundary — all three reused across ideation_eval, planning_eval, and execution_eval |
| `blocks.conditional` | Feedback-round context for later rounds (evaluate the revision, not just the current state) |
| `blocks.delegation` | Two entries keyed by `evaluator.project` and `evaluator.overall` — the per-perspective subagent prompt bodies |
| `blocks.synthesis` | Instructions for the orchestrator to consolidate findings and propose the verdict |
| `blocks.completion` | The completion instruction and five-criterion acceptance list |

The full schema lives in [`../_schema/v1.ts`](../_schema/v1.ts). Every field is validated at load time by `validateStepSpec()`.

---

## Reuse across three workflow steps

`index.json` declares three workflow-graph entries pointing at this single spec:

```
{ "id": "ideation_eval",   "spec": "./evaluation/spec.json", "evalFor": "ideation" }
{ "id": "planning_eval",   "spec": "./evaluation/spec.json", "evalFor": "planning" }
{ "id": "execution_eval",  "spec": "./evaluation/spec.json", "evalFor": "execution" }
```

The spec content is step-agnostic on purpose — the preceding step under evaluation is identified from session state, not from hard-coded spec text. The orchestrator reads `state.currentStep` at compile time, looks up the `evalFor` target in `index.json`, and resolves the artifacts under assessment from the corresponding session directory.

Substate overlays (B.2) will specialize per-eval-step where needed — for example, `execution_eval` will overlay a `loopTarget` selection prompt that `ideation_eval` does not need. This base spec compiles as-is; overlays patch rather than duplicate.

---

## Two-perspective minimum

Project and Overall are the mandatory minimum per `_gobbi-rule` Agent Separation: "Spawn at least 2 evaluator agents with different perspectives — Project and Overall are the minimum." Additional perspectives — Architecture, Security, Performance, UX — are orchestrator-selected based on the artifacts under evaluation. The selection is not encoded in this spec; it happens at delegation time when the orchestrator chooses which additional evaluator agents to spawn (capped at `maxParallelAgents: 5`).

`delegation.agents` declares only the two minimums. An orchestrator that needs to add Architecture or Security spawns those additional evaluators outside the spec-declared delegation list — the CLI treats the spec's `delegation.agents` as the floor, not the ceiling, because perspective selection is a runtime decision, not a per-step-spec one.

---

## Conditional blocks

One conditional, gated on a predicate already registered in `workflow/predicates.ts`:

- `feedback-context` fires when `feedbackRoundActive` — the workflow is on a later evaluation round. The block directs each evaluator to read the prior round's findings alongside the current artifacts: the question is not "is this good" in isolation but "did the revision actually address the prior defects." A clean round on current artifacts with unaddressed prior findings is still a revise verdict.

---

## Updating the snapshot tests

The snapshot tests in [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) lock the compiled prompt for three session states. They exist to surface regressions in any Wave 1–4 module — a change in `assembly.ts`, `budget.ts`, `skills.ts`, or this spec that alters compiled output will fail one or more snapshots.

When a change to the compiled output is intentional — e.g., you edited `spec.json` prose or added a new conditional block — regenerate the snapshots by running:

```
bun test src/specs/evaluation/__tests__/snapshot.test.ts --update-snapshots
```

Inspect the diff in `__snapshots__/snapshot.test.ts.snap`, confirm the new snapshot reflects the intent, and commit the updated snapshot together with the spec change. The commit that updates a snapshot must also explain why the output changed.

Never edit snapshot files by hand. A drift between the snapshot and the compiled output is always a bug — either in the spec, in a Wave 1–4 module, or in the test fixture.

---

## Related files

- [`spec.json`](spec.json) — the spec itself
- [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) — end-to-end compile tests across three fixtures
- [`../_schema/v1.ts`](../_schema/v1.ts) — schema this spec validates against
- [`../assembly.ts`](../assembly.ts) — `compile()` entry point
- [`../budget.ts`](../budget.ts) — `defaultBudgetAllocator` the snapshot tests feed in
- [`../index.json`](../index.json) — workflow graph that declares the three eval-step entries pointing at this spec
