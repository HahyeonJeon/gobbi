# {Work Name} — Execution Plan

| Document attribute | Definition |
|---|---|
| Role | Flat ordered list of agent execution units |
| Purpose | Combine compatible hierarchy leaves into executable contracts and order them by dependency. |
| Source hierarchy | `tasks.md` |
| Boundary | This document defines execution units, not execution progress, evaluation, records, or commit provenance. |

## Plan Summary

| Aspect | Definition |
|---|---|
| Work | {The defined work represented by this plan.} |
| Purpose | {Why the work is needed.} |
| Scope | {The included boundary and material exclusions.} |
| Output | {What must exist or be observable after all units execute.} |
| Design | {The accepted structure, relationships, and constraints that shape execution.} |
| Unit strategy | {Why these are the fewest dependency-valid, independently verifiable, reviewable, and safe units.} |

## Shared Execution Context

| Context item | Value | Applies to |
|---|---|---|
| {Applicable repository, path, artifact, runtime, platform, access, environment, tool, or other metadata} | {Supported value} | {All units or named unit IDs} |

{Repeat rows only for applicable shared metadata. Use `None` when no shared context is needed; never include
secret values.}

## Ordered Execution Units

Lower order numbers execute first. Units with the same order may run in parallel only when their explicit
`Requires` edges and writer/change boundaries permit it; `Requires` remains authoritative.

### `task-NN-slug` — {Execution unit title}

| Unit attribute | Definition |
|---|---|
| Order | {Number} |
| Source hierarchy leaf paths | {One or more exact leaf paths from tasks.md, such as 1.1, 1.2, and 2.1.1} |
| Accountable role | {Exactly one role} |
| Required skills and capabilities | {Exact skills and capabilities this role needs} |
| Requires | {Earlier execution-unit IDs or `None`} |

- **Work:** {The coherent outcome this unit must complete across all source leaves.}
- **Boundary:** {What this unit covers and where its responsibility stops.}
- **Output:** {The concrete output this unit must produce.}
- **Inputs:** {Only the inputs the accountable role needs.}
- **Constraints:** {The accepted constraints and authority limits that govern this unit.}
- **Writer/change boundary:** {The files, artifacts, state, or external surfaces this unit may change and the
  coherent verification or commit boundary.}
- **Verification:** {Fresh checks and direct evidence that can prove the complete unit outcome.}
- **Applicable metadata:** {Unit-specific metadata differences from Shared Execution Context, or `None`.}

{Repeat this one unit form in flat plan order. Each unit must trace at least one leaf, and each leaf may appear
in exactly one unit.}

## Nonblocking Unresolved Metadata

| Item | Evidence | Execution effect | Affected units |
|---|---|---|---|
| {Unknown factual value} | {Why it is not currently knowable} | {Why execution can still proceed, or the exact later resolution point} | {Unit IDs} |

{Record only nonblocking factual metadata. Return missing required input or a material user-owned decision to
the caller instead; write `None` when this section has no entries.}
