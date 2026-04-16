# Memorization step spec

The terminal productive step in the v0.5.0 workflow. After `execution_eval` passes, the CLI enters `memorization` — the step where the orchestrator reads the session's produced artifacts and conversation, extracts decisions, state, open questions, and gotchas, and commits them where the next session can discover them.

Authoritative design: [`v050-overview.md`](../../../../../.claude/project/gobbi/design/v050-overview.md) §Five Productive Steps. Transition graph: [`v050-state-machine.md`](../../../../../.claude/project/gobbi/design/v050-state-machine.md) §Transition Table.

---

## Purpose in the v0.5.0 workflow

Memorization is orchestrator-authored — there are no delegated subagents or evaluators. The orchestrator reads the session's conversation and durable artifacts, writes session-scoped gotchas to the gotcha system, updates project documentation for any convention or precedent the session introduced, and commits `memorization.md` to the session's memorization directory.

Memorization is the last productive step. Its transition is unconditional — `always` routes to `done`, the terminal workflow step. A workflow that reaches memorization is a workflow that completes.

---

## spec.json structure

| Section | Purpose |
|---------|---------|
| `meta` | Orchestrator-only step: no `allowedAgentTypes`, `maxParallelAgents: 0`, required skills `_gotcha` + `_project`, expected artifact `memorization.md`, completion signal `Stop` |
| `transitions` | One exit edge — unconditional `always` routes to the terminal `done` step |
| `delegation.agents` | Empty array — Memorization does not spawn subagents |
| `tokenBudget` | `artifacts` slot raised to 0.3 — prior step artifacts are inlined because memorizing requires reading them in full, not summarizing from memory |
| `blocks.static` | Role, principles, scope-boundary, and the memorization artifact shape contract |
| `blocks.conditional` | Force-memorization recovery context (entered when the feedback-round cap fired and the user chose to persist partial work) |
| `blocks.delegation` | Empty object — no delegated agents means no per-agent prompt bodies |
| `blocks.synthesis` | Instructions for the orchestrator to walk the session, write gotchas first, and commit the memorization artifact |
| `blocks.completion` | The completion instruction and four-criterion acceptance list |

The full schema lives in [`../_schema/v1.ts`](../_schema/v1.ts). Every field is validated at load time by `validateStepSpec()`.

---

## Completion signal: `Stop`

Memorization emits `Stop` rather than `SubagentStop` because it is orchestrator-only. Like Plan, there is no subagent whose stop event marks the step complete; the orchestrator itself signals completion after the memorization artifact is written and project documentation is updated.

---

## Force-memorization pathway

The `force-memorization-context` conditional block fires when `feedbackCapExceeded` — the workflow hit the maxFeedbackRounds cap at `execution_eval` and the user invoked `gobbi workflow resume --force-memorization` to persist partial work rather than abort. The block adjusts the memorization instruction: the artifact must explicitly note which plan tasks converged, which did not, and what the accumulated evaluation findings say about the blocked tasks.

Future sessions reading a force-memorized artifact must see that the work is partial. The conditional block exists to prevent the memorization prose from smoothing an unfinished state into a success narrative.

---

## Project documentation coupling

Memorization is the step that updates project-level documentation — the session's README entries, design-doc changes, and gotcha index links. The `_project` required skill provides the project-documentation structure the memorization prose references. If the session added files, changed conventions, or set precedent, the project documentation must reflect that before the step completes; a memorization artifact that references undocumented changes is a broken handoff.

---

## Updating the snapshot tests

The snapshot tests in [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) lock the compiled prompt for three session states. They exist to surface regressions in any Wave 1–4 module — a change in `assembly.ts`, `budget.ts`, `skills.ts`, or this spec that alters compiled output will fail one or more snapshots.

When a change to the compiled output is intentional — e.g., you edited `spec.json` prose or added a new conditional block — regenerate the snapshots by running:

```
bun test src/specs/memorization/__tests__/snapshot.test.ts --update-snapshots
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
- [`../index.json`](../index.json) — workflow graph that references `./memorization/spec.json`
- [`../execution/spec.json`](../execution/spec.json) — the upstream step whose execution the memorization artifact records
