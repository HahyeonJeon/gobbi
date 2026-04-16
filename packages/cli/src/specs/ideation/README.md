# Ideation step spec

The first productive step in the v0.5.0 workflow. After `workflow.start`, the CLI enters `ideation` — the step where two PI agents (innovative + best-practice) explore what to do, and the orchestrator synthesizes their findings into a single chosen direction.

Authoritative design: [`v050-prompts.md`](../../../../../.claude/project/gobbi/design/v050-prompts.md) §Step Specs. Transition graph: [`v050-state-machine.md`](../../../../../.claude/project/gobbi/design/v050-state-machine.md) §Transition Table.

---

## Purpose in the v0.5.0 workflow

Ideation runs once per workflow entry. Two PI agents produce `innovative.md` and `best.md` in parallel; the orchestrator reads both and writes `ideation.md` with a single chosen direction the user has approved. From there the workflow exits to `plan` (or to `ideation_eval` if the user enabled ideation evaluation at session start).

Ideation is the root of the cycle the feedback loop returns to — `workflow.step.skip` from every downstream step lands here. The spec's conditional blocks exist precisely so the compiled prompt adapts when the step is re-entered under feedback vs. entered fresh.

---

## spec.json structure

| Section | Purpose |
|---------|---------|
| `meta` | Step-level config: substates, allowed agent types, parallel cap, required/optional skills, expected artifacts, completion signal |
| `transitions` | Exit edges — one to `plan` (eval skipped), one to `ideation_eval` (eval enabled) |
| `delegation.agents` | Two PI agents — `innovative` and `best-practice`, both `opus` at `max` effort |
| `tokenBudget` | Five-slot allocation proportions summing to `1.0` |
| `blocks.static` | Always-included role, principles, scope-boundary prose |
| `blocks.conditional` | State-gated blocks — feedback context, evaluation-decision prompt, spawn readiness |
| `blocks.delegation` | Per-agent prompt bodies keyed by `AgentConfig.blockRef` |
| `blocks.synthesis` | Instructions for the orchestrator after both PI agents complete |
| `blocks.completion` | The completion instruction and five-criterion acceptance list |

The full schema lives in [`../_schema/v1.ts`](../_schema/v1.ts). Every field is validated at load time by `validateStepSpec()`.

---

## Substates

`meta.substates` declares `discussing` and `researching`. The substate overlay mechanism (B.2, not yet implemented) will patch this base spec per substate — for example, adding a research-specific delegation block when the orchestrator is in the researching substate. For PR A the base spec compiles as-is; substate handling is absent from the compile pipeline.

Callers reading state at compile time should honor `state.currentSubstate` when it lands — `renderSessionSummary()` in `assembly.ts` already includes `currentSubstate` in the session summary section.

---

## PI agents

Both agents use the same infrastructure (opus, max effort, no extra skill injection beyond `meta.requiredSkills: ["_gotcha"]`) but receive distinct prompt bodies via `blocks.delegation.pi.innovative` and `blocks.delegation.pi.best`.

The stance is encoded in the delegation block content, not in an agent flag. This matches the [`v050-prompts.md` §Stances as CLI-Managed Configuration](../../../../../.claude/project/gobbi/design/v050-prompts.md) principle: stances are configuration the CLI writes into the prompt, not guidance the orchestrator discovers at runtime.

---

## Updating the snapshot tests

The snapshot tests in [`__tests__/snapshot.test.ts`](__tests__/snapshot.test.ts) lock the compiled prompt for three session states. They exist to surface regressions in any Wave 1–4 module — a change in `assembly.ts`, `budget.ts`, `skills.ts`, or this spec that alters compiled output will fail one or more snapshots.

When a change to the compiled output is intentional — e.g., you edited `spec.json` prose or added a new conditional block — regenerate the snapshots by running:

```
bun test src/specs/ideation/__tests__/snapshot.test.ts --update-snapshots
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
- [`../index.json`](../index.json) — workflow graph that references `./ideation/spec.json`
