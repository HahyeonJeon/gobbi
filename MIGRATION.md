# Migration guide

## Upgrading to Gobbi 0.5.3

Gobbi 0.5.3 removes the standalone Preparation phase and makes a deliberate, new-session-only schema break. Existing in-progress sessions are not rewritten.

### Workflow mapping

| Before 0.5.3 | 0.5.3 and later |
|---|---|
| Configuration | Configuration |
| Ideation (`1-ideation`) | Ideation (`1-ideation`) |
| Preparation (`2-preparation`) | Planning readiness entry gate (`2-planning/working/readiness-gate-iter{n}.md`) |
| Planning (`3-planning`) | Planning (`2-planning`) |
| Execution (`4-execution`) | Execution (`3-execution`) |
| Wrap-up (`5-wrap-up`) | Wrap-up (`4-wrap-up`) |

The readiness gate is the first operation inside Planning DISCUSSION. It is not a state, loop, iteration, RECORD run, or evaluation phase. Planning remains one loop and is non-skippable.

### Schema versions

- `session.json`: schema 4
- `state.json`: schema 2
- `settings.json`: schema 2

Schema 4 removes `workflow.preparation`. State and settings schema 2 remove the corresponding Preparation records and controls. New sessions contain exactly the four productive-loop records: `ideation`, `planning`, `execution`, and `wrap-up`.

### Existing sessions

Gobbi 0.5.3 does not migrate legacy sessions and does not accept both layouts. Session initialization and record-map repair validate all three metadata schemas before creating or modifying any session path. If any metadata file uses an older schema or includes the retired Preparation shape, the operation stops without mutation.

To finish an in-progress pre-0.5.3 session:

1. Keep the session and its working tree unchanged.
2. Open a separate worktree pinned to the Gobbi revision that created that session.
3. Resume and finish the session with that pinned version.
4. Start the next session with Gobbi 0.5.3 or later.

Do not rename old loop directories, delete `workflow.preparation`, or hand-edit schema numbers. Those changes would break the old version's audit trail without producing a valid 0.5.3 session.

### Readiness behavior

Planning now writes `2-planning/working/readiness-gate-iter{n}.md` before task decomposition. The artifact inventories locked Ideation scope and outputs, recursive memory/rules/mistakes, candidate skills and their existence, external-write dispositions, gaps and routing, user decisions, and one result:

- `READY`: the scan is clean or every material gap has a binding resolution; Planning continues.
- `RE-IDEATE`: locked Ideation omitted an upstream requirement, including required staging. Planning stays Pending, Ideation becomes Revising, the gate evidence is preserved, and Planning's iteration does not increment.
- `NEEDS_CONTEXT`: required workspace/domain knowledge, authority, access evidence, or another non-Ideation prerequisite is unavailable.

Planning cannot repair or accept an upstream Ideation omission. After re-Ideation passes, Planning reruns the readiness gate from current evidence.

### Skills and external writes

A missing project-specific skill becomes the first ordered Execution task. That task must author the complete skill, wire its runtime discovery surfaces, run conformance checks, and commit it before dependent tasks start. A missing workspace or domain skill returns `NEEDS_CONTEXT` because it cannot be safely fabricated from project context.

Every planned external write must name the actual writer or owner, exact write surface, read-only evidence that the real context and access exist, reversibility, and the go/no-go decision. Planning revalidates these facts and all required skills against the concrete task map before its plan can pass.

### Plugin update

Both Gobbi plugin manifests and the Claude marketplace entry use version `0.5.3`. After updating a local plugin installation, start a new Codex or Claude Code thread so skill discovery and session bootstrap use the new workflow contract.
