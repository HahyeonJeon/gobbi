# Handoff step spec

The last productive step in the v0.5.0 6-step workflow. After `memorization` writes its artifact, the CLI enters `handoff` — the step where the orchestrator reads the memorization output plus the session's terminal-state record and produces a tight, narrow hand-off note for the next session.

Authoritative design: [`v050-features/orchestration/README.md`](../../../../../.gobbi/projects/gobbi/design/v050-features/orchestration/README.md) §1 (the 6-step workflow), §1.1 (why split memorization from handoff), and §9 (the handoff step). Lock context: `review.md` NOTE-1 records the user's explicit decision to promote handoff to a true state-machine step rather than fold it into memorization as a sub-artifact.

---

## Purpose in the v0.5.0 workflow

Handoff is orchestrator-authored — there are no delegated subagents or evaluators. The orchestrator reads `sessions/<id>/memorization/memorization.md` plus the last-N events for the session, distills them to a four-section cover sheet, and writes `sessions/<id>/handoff/handoff.md`. It also writes one `class='handoff'` row to the workspace memories store so the next session's CLI can pull the most recent handoff as ambient context for its first step.

Handoff is the last productive step. Its single transition is unconditional — `always` routes to `done`, the terminal lifecycle state. A workflow that reaches handoff is a workflow that completes.

---

## Why handoff is its own step

Memorization is **wide** — many rawdata sources (per-step artifacts, subagent transcripts, ExitPlanMode captures, the orchestrator transcript, the full event stream, session-tier gotchas) and many destinations (`learnings/decisions/`, `gotchas/`, `design/`, `learnings/backlogs/`). Handoff is **narrow** — one source (the just-written `memorization.md` plus last-N events), one destination (`handoff.md` plus one `gobbi.db::memories` row).

The synthesis-v1 design folded handoff into memorization as a sub-artifact. Three Pass-4 evaluators flagged that the folded shape risks the handoff content being silently dropped under context pressure — the agent finishes memorization, sees the conversation as complete, and emits the completion signal without ever generating the cover sheet. Promoting handoff to its own step puts a state-machine boundary between memorization's wide sweep and the cover-sheet writer's narrow focus, so the cover sheet cannot be skipped under load. The fresh-context separation that justifies external evaluators justifies handoff as its own step. The user locked this choice (Option B) per `review.md` NOTE-1 / `locked-decisions.md`.

The discoverability argument compounds the safety argument. The next session's `gobbi workflow next` for the next workflow's Ideation step pulls `handoff.md` first, before any other prior-session artifact. A predictable, narrow cover sheet at a known path beats a memorization-folded section the next session has to grep for.

---

## spec.json structure

| Section | Purpose |
|---------|---------|
| `meta` | Orchestrator-only step: no `allowedAgentTypes`, `maxParallelAgents: 0`, required skill `_project`, optional `_claude`, expected artifact `handoff.md`, completion signal `Stop` |
| `transitions` | One exit edge — unconditional `always` routes to the terminal `done` lifecycle state |
| `delegation.agents` | Empty array — Handoff does not spawn subagents |
| `tokenBudget` | `staticPrefix: 0.4, session: 0.1, instructions: 0.2, artifacts: 0.2, materials: 0.1` — narrower artifacts slot than memorization (handoff reads one source, not the full session) |
| `blocks.static` | Role, principles, scope-boundary, and the handoff artifact shape contract |
| `blocks.conditional` | Empty array — handoff has no conditional blocks. The force-memorization recovery framing reaches handoff via the artifact's language (memorization writes the partial-record markers; handoff quotes them) rather than via a per-step conditional |
| `blocks.delegation` | Empty object — no delegated agents means no per-agent prompt bodies |
| `blocks.synthesis` | Instructions for the orchestrator to read memorization plus last-N events, distill, and commit the artifact |
| `blocks.completion` | The completion instruction and four-criterion acceptance list |

The full schema lives in [`../_schema/v1.ts`](../_schema/v1.ts). Every field is validated at load time by `validateStepSpec()`.

---

## Entry and exit predicates

**Entry.** Handoff is reached from `memorization` on the `workflow.step.exit` trigger with the `always` predicate (per the new edge in [`../index.json`](../index.json)). There is no opt-out — every workflow that reaches memorization passes through handoff.

**Exit.** Handoff exits to `done` on the `always` predicate, fired when the orchestrator emits the completion signal. The reducer's runtime authority for the memorization → handoff → done chain is `transitions.ts::TRANSITION_TABLE`; the graph in `index.json` is the declarative mirror of the same routing.

The `workflow.step.timeout` and `workflow.step.skip` entries that apply to memorization apply to handoff symmetrically — the graph file declares a `handoff → error` edge for timeout and a `handoff → ideation` edge for user-initiated skip, mirroring memorization's lifecycle slots.

---

## Completion signal: `Stop`

Handoff emits `Stop` rather than `SubagentStop` because it is orchestrator-only — no subagent's stop event marks the step complete. Like memorization and planning, the orchestrator itself signals completion after the handoff artifact is written and the memory row is recorded. Mirrors the `Stop`-vs-`SubagentStop` choice in `memorization/spec.json`.

---

## Artifact shape

Handoff produces exactly two outputs — both required, neither optional:

1. **`sessions/<id>/handoff/handoff.md`** — the human-readable cover sheet, four sections (`What was shipped`, `Open threads — read these first`, `Decisions you should respect`, `Pointers`). The artifact targets ~5 sentences in the first section, bulleted lists elsewhere, and stops there. A handoff that grows to memorization size has lost its purpose.
2. **One row in the workspace memories store** — `class='handoff', session_id=<id>, project_id=<resolved>`, body equal to the rendered markdown. The next session's CLI pulls the most recent handoff row as ambient context for its first step. The 5-row-per-project cap on `class='handoff'` rows lives in [`../../../../../.gobbi/projects/gobbi/design/v050-features/orchestration/README.md`](../../../../../.gobbi/projects/gobbi/design/v050-features/orchestration/README.md) §8.3.

The artifact's section names and ordering are the contract. Future sessions read by section header; renaming "Open threads" to "Open items" or reordering sections breaks the convention without buying anything.

---

## Relationship to memorization

Memorization writes the durable record; handoff writes the cover sheet that points into it. The two steps are deliberately separated:

- **Memorization** owns the wide sweep — every rawdata source, every extraction destination, every gotcha/decision/design entry. It writes `memorization.md`, the per-class extraction files, and any project documentation updates.
- **Handoff** owns the narrow synthesis — one source (`memorization.md` + last-N events), one destination (`handoff.md` + one memories row). It does not write new gotchas, decisions, design notes, or project documentation; those are memorization's responsibility.

The boundary is enforced by the `scope-boundary` block in `spec.json` and the four completion criteria. A handoff agent that writes a new gotcha file is operating outside scope.

---

## Updating the snapshot tests

When the spec library gains snapshot coverage for handoff (mirroring `memorization/__tests__/snapshot.test.ts`), the snapshots lock the compiled prompt for representative session states. They exist to surface regressions in any assembly-pipeline module — a change in `assembly.ts`, `budget.ts`, `skills.ts`, or this spec that alters compiled output will fail one or more snapshots.

When a change to the compiled output is intentional — e.g., you edited `spec.json` prose or added a new conditional block — regenerate the snapshots by running:

```
bun test src/specs/handoff/__tests__/snapshot.test.ts --update-snapshots
```

Inspect the diff, confirm the new snapshot reflects the intent, and commit the updated snapshot together with the spec change. The commit that updates a snapshot must also explain why the output changed.

Never edit snapshot files by hand. A drift between the snapshot and the compiled output is always a bug — either in the spec, in an assembly-pipeline module, or in the test fixture.

---

## Related files

- [`spec.json`](spec.json) — the spec itself
- [`../_schema/v1.ts`](../_schema/v1.ts) — schema this spec validates against
- [`../assembly.ts`](../assembly.ts) — `compile()` entry point
- [`../budget.ts`](../budget.ts) — `defaultBudgetAllocator` the assembly pipeline feeds in
- [`../index.json`](../index.json) — workflow graph that references `./handoff/spec.json` and declares the `memorization → handoff → done` chain
- [`../memorization/spec.json`](../memorization/spec.json) — the upstream step whose artifact handoff reads
- [`../memorization/README.md`](../memorization/README.md) — sibling terminal-step README; mirrors many conventions documented here
