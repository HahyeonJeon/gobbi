# Execution step spec

The third productive step in the v0.5.0 workflow. After Planning (optionally via `planning_eval`), the CLI enters `execution` — the step where the orchestrator runs the approved plan one task at a time, delegating each task to an `executor` subagent, verifying each task before the next begins.

Authoritative design: [`v050-prompts.md`](../../../../../.claude/project/gobbi/design/v050-prompts.md) §Execution Step: Verification Blocks. Transition graph: [`v050-state-machine.md`](../../../../../.claude/project/gobbi/design/v050-state-machine.md) §Transition Table.

---

## Purpose in the v0.5.0 workflow

Execution delegates to an `executor` subagent per task. The orchestrator does not implement tasks itself; it dispatches, verifies, and moves on. Verification runs between tasks, not only at step exit — a failing verification is surfaced immediately and the user decides whether to retry the task, skip to a focused fix, or escape back to `plan`.

Execution's exit transition is unconditional — `always` routes to `execution_eval`. Execution_eval is mandatory and non-skippable; execution without evaluation is not a valid workflow completion.

The single `executor` delegation agent in `delegation.agents` is the per-task dispatch shape. The orchestrator instantiates this agent once per task from the plan, passing the per-task scope as the delegation context. `maxParallelAgents: 1` enforces the "one task at a time" principle structurally — the CLI denies concurrent executor spawns.

---

## spec.json structure

| Section | Purpose |
|---------|---------|
| `meta` | Delegation step: `allowedAgentTypes: ['executor']`, `maxParallelAgents: 1`, required skills `gotcha` + `execution`, optional `claude` + `git` + `project-doc`, completion signal `SubagentStop` |
| `transitions` | One exit edge — unconditional `always` routes to `execution_eval` |
| `delegation.agents` | One `executor` agent at `opus` / `max` — the per-task dispatch shape |
| `tokenBudget` | `artifacts` slot raised to 0.25 — prior plan plus per-task inputs are inlined for each dispatch |
| `blocks.static` | Role, principles, scope-boundary, and the verification contract |
| `blocks.conditional` | Feedback-round context + a pre-cap warning for the last feedback round |
| `blocks.delegation` | One entry keyed by `executor` — the per-task subagent prompt body |
| `blocks.synthesis` | Instructions for the orchestrator to produce `execution.md` after all tasks complete |
| `blocks.completion` | The completion instruction and four-criterion acceptance list |

The full schema lives in [`../_schema/v1.ts`](../_schema/v1.ts). Every field is validated at load time by `validateStepSpec()`.

---

## Skill-injection fixture

The [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) suite for this step owns the one skill-injection fixture across all PR B specs — `skill-injection` — that exercises `CompileInput.skillSections`. The fixture injects `gotcha` and `execution` skill sections into the static prefix and asserts the compiled prompt's static region includes the injected content before the spec-derived static blocks.

Execution was chosen as the home for the skill-injection fixture because executors load project skills before working. The fixture validates the seam that PR C's delegation dispatcher will drive: `compile()` accepts caller-supplied `StaticSection[]` via `skillSections`, emits them at the front of the static prefix, lints them against the same cache-poisoning rules as block-derived static content, and contributes their content hashes to the prompt's `staticPrefixHash`.

---

## Conditional blocks

Two conditionals, both gated on predicates already registered in `workflow/predicates.ts`:

- `feedback-context` fires when `feedbackRoundActive` — a prior `execution_eval` targeted execution (or an upstream step) for revise. The block instructs the orchestrator to read the findings and target only the affected tasks rather than blanket-re-executing.
- `feedback-cap-warning` fires when `feedbackCapExceeded` — the feedback round counter has reached `maxFeedbackRounds`. The block injects the pre-cap warning described in `v050-state-machine.md` §Feedback Loop Cap: the next revise verdict routes to `error`, so this round should focus on the highest-leverage remaining gaps.

---

## Updating the snapshot tests

The snapshot tests in [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) lock the compiled prompt for three session states. They exist to surface regressions in any Wave 1–4 module — a change in `assembly.ts`, `budget.ts`, `skills.ts`, or this spec that alters compiled output will fail one or more snapshots.

When a change to the compiled output is intentional — e.g., you edited `spec.json` prose or added a new conditional block — regenerate the snapshots by running:

```
bun test src/specs/execution/__tests__/snapshot.test.ts --update-snapshots
```

Inspect the diff in `__snapshots__/snapshot.test.ts.snap`, confirm the new snapshot reflects the intent, and commit the updated snapshot together with the spec change. The commit that updates a snapshot must also explain why the output changed.

Never edit snapshot files by hand. A drift between the snapshot and the compiled output is always a bug — either in the spec, in a Wave 1–4 module, or in the test fixture.

---

## Related files

- [`spec.json`](spec.json) — the spec itself
- [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) — end-to-end compile tests across three fixtures (including the skill-injection fixture)
- [`../_schema/v1.ts`](../_schema/v1.ts) — schema this spec validates against
- [`../assembly.ts`](../assembly.ts) — `compile()` entry point, including the `CompileInput.skillSections` seam
- [`../budget.ts`](../budget.ts) — `defaultBudgetAllocator` the snapshot tests feed in
- [`../index.json`](../index.json) — workflow graph that references `./execution/spec.json`
- [`../plan/spec.json`](../plan/spec.json) — the upstream step whose plan this execution runs against
- [`../evaluation/spec.json`](../evaluation/spec.json) — the downstream mandatory `execution_eval` step
