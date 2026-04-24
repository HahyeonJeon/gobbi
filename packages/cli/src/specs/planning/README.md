# Plan step spec

The second productive step in the v0.5.0 workflow. After Ideation (optionally via `ideation_eval`), the CLI enters `plan` — the step where the orchestrator translates the single chosen ideation direction into an ordered list of narrow, specific tasks that Execution can run one at a time.

Authoritative design: [`v050-prompts.md`](../../../../../.claude/project/gobbi/design/v050-prompts.md) §Plan Step: Task-Size Validation. Transition graph: [`v050-state-machine.md`](../../../../../.claude/project/gobbi/design/v050-state-machine.md) §Transition Table.

---

## Purpose in the v0.5.0 workflow

Plan is orchestrator-authored — there are no delegated PI agents or evaluators here. The orchestrator reads `ideation.md`, decomposes the approved direction into tasks with scope, inputs, outputs, verification, and agent assignment, discusses the decomposition with the user, and commits `plan.md`.

The step has no substates. Its output is the contract Execution runs against: if a task is missing from the plan, Execution does not run it; if a task's verification is vague, Execution has no finish line. The plan is the deliverable.

Plan exits to `plan_eval` when the user enabled plan evaluation at session start (`evalConfig.plan == true`), or directly to `execution` when evaluation was opted out of.

---

## spec.json structure

| Section | Purpose |
|---------|---------|
| `meta` | Orchestrator-only step: no `allowedAgentTypes`, `maxParallelAgents: 0`, required skill `_gotcha`, expected artifact `plan.md`, completion signal `Stop` |
| `transitions` | Exit edges — one to `execution` (eval skipped), one to `plan_eval` (eval enabled) |
| `delegation.agents` | Empty array — Plan does not spawn subagents |
| `tokenBudget` | `artifacts` slot raised to 0.2 — prior ideation artifacts are inlined for the orchestrator to plan against |
| `blocks.static` | Role, principles, scope-boundary, and the plan-artifact shape contract |
| `blocks.conditional` | Feedback-round context + a pre-exit reminder that plan evaluation is locked at session start |
| `blocks.delegation` | Empty object — no delegated agents means no per-agent prompt bodies |
| `blocks.synthesis` | Instructions for the orchestrator to draft, discuss, and commit `plan.md` |
| `blocks.completion` | The completion instruction and five-criterion acceptance list |

The full schema lives in [`../_schema/v1.ts`](../_schema/v1.ts). Every field is validated at load time by `validateStepSpec()`.

---

## Completion signal: `Stop`, not `SubagentStop`

Plan emits `Stop` rather than `SubagentStop` because it is orchestrator-only. There is no subagent whose stop event marks the step complete; the orchestrator itself signals completion after the plan artifact is written. This matches the Ideation spec's convention where the creating-agent-stop event is the signal (Ideation uses `SubagentStop` because its PI agents are the creators; Plan's creator is the orchestrator).

---

## Conditional blocks

Two conditionals, both gated on predicates already registered in `workflow/predicates.ts`:

- `feedback-context` fires when `feedbackRoundActive` — a prior `plan_eval` returned revise, or `execution_eval` loop-targeted the plan step. The block prepends evaluator-findings reading guidance to the compiled prompt.
- `evaluation-deciding` fires when `evalPlanEnabled` — the user enabled plan evaluation at session start. The block reminds the orchestrator that the evaluation decision is locked (it was made at workflow init) and must not be re-asked at step exit.

Graph-level predicates (`verdictPass`, `verdictRevise`, `always`, loop-target and resume-target variants) are also registered in `workflow/predicates.ts` as of B.3. The codegen at `scripts/gen-predicate-names.ts` emits a typed `PredicateName` union from every spec, overlay, and graph reference; the registry satisfies that union so any missing registration fails typecheck.

---

## Updating the snapshot tests

The snapshot tests in [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) lock the compiled prompt for three session states. They exist to surface regressions in any Wave 1–4 module — a change in `assembly.ts`, `budget.ts`, `skills.ts`, or this spec that alters compiled output will fail one or more snapshots.

When a change to the compiled output is intentional — e.g., you edited `spec.json` prose or added a new conditional block — regenerate the snapshots by running:

```
bun test src/specs/plan/__tests__/snapshot.test.ts --update-snapshots
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
- [`../index.json`](../index.json) — workflow graph that references `./plan/spec.json`
- [`../ideation/spec.json`](../ideation/spec.json) — the upstream step whose artifact this plan realizes
