# `gobbi workflow validate` — Stable Error Codes

Reference for every diagnostic code emitted by `gobbi workflow validate`. Each code is stable across versions — changing its meaning is a breaking change to the CLI surface.

---

## About the command

`gobbi workflow validate` runs the full static-validation matrix over the v0.5.0 step-spec library, overlays, predicate registry, and workflow graph. It is designed to run pre-commit and in CI against the committed `packages/cli/src/specs/` tree. Default output is JSON (one top-level object with `diagnostics` and `summary`) for tooling; `--human` switches to a grouped, color-respecting report.

**Exit codes:**

| Code | Meaning |
|------|---------|
| `0` | No error-severity diagnostics. Warnings alone do not fail. |
| `1` | At least one error-severity diagnostic. |
| `2` | Invocation error (unreadable graph, malformed arguments). |

**Flags:**

- `--dir <path>` — root directory to scan for specs. Defaults to the module-relative `packages/cli/src/specs/` (same convention as `loadGraph`'s `DEFAULT_GRAPH_PATH`).
- `--human` — human-readable report instead of JSON.
- `--help`, `-h` — show usage.

**Diagnostic shape (JSON):**

```
{
  "diagnostics": [
    {
      "code": "E001_INVALID_SCHEMA",
      "severity": "error",
      "message": "…",
      "location": { "file": "/abs/path/to/spec.json", "pointer": "/meta/description" }
    }
  ],
  "summary": { "errorCount": 1, "warningCount": 0 }
}
```

`location.pointer` is a JSON pointer into the offending file when the violation has a precise location, or `null` when the violation is file-scoped (for instance, a missing file).

---

## Codes at a glance

| Code | Severity | Trigger |
|------|----------|---------|
| [`E001_INVALID_SCHEMA`](#e001_invalid_schema) | error | Spec or overlay fails ajv against the v1 JSON Schema |
| [`E002_UNKNOWN_PREDICATE`](#e002_unknown_predicate) | error | Reference to a predicate name not in the CLI's predicate registry |
| [`E003_INVALID_GRAPH`](#e003_invalid_graph) | error | Cycle, unreachable node, duplicate step, or unresolved transition target |
| [`E004_MISSING_SPEC`](#e004_missing_spec) | error | Graph names a step whose `spec.json` file does not exist |
| [`E005_INVALID_OVERLAY`](#e005_invalid_overlay) | error | Overlay is malformed or produces a merged spec that still fails the schema |
| [`E006_UNKNOWN_SUBSTATE`](#e006_unknown_substate) | error | Overlay filename implies a substate that the spec does not declare |
| [`E007_ORPHAN_SUBSTATE`](#e007_orphan_substate) | warning | Spec declares a substate but no matching overlay file exists |
| [`E008_DUPLICATE_REGISTRATION`](#e008_duplicate_registration) | error | Predicate registry exports the same name twice |

---

## `E001_INVALID_SCHEMA`

**Severity:** error

**Emitted by:** per-step spec validation (`validateStepSpec` / `ajv`), invoked once per unique `spec.json` referenced from `specs/index.json`.

### What triggers it

A spec file fails the v1 JSON Schema. Triggers include missing required fields, invalid field types, `additionalProperties: false` violations, `tokenBudget` proportions that do not sum to 1.0, and `AgentConfig.blockRef` values that do not match a key of `blocks.delegation`. JSON that cannot be parsed at all is also reported under this code.

### Example diagnostic

```
{
  "code": "E001_INVALID_SCHEMA",
  "severity": "error",
  "message": "/tokenBudget: tokenBudget proportions must sum to 1.0 (± 0.000001)",
  "location": {
    "file": "/repo/packages/cli/src/specs/plan/spec.json",
    "pointer": "/tokenBudget"
  }
}
```

### How to fix

Read the pointer into the spec file at the indicated JSON path. If the message mentions a specific field (`should have required property`, `must be equal to`, `additionalProperty`), adjust that field. For `tokenBudget` sum violations, verify the five proportions sum to exactly `1.0`. For `blockRef` mismatches, ensure every `delegation.agents[*].blockRef` appears as a key under `blocks.delegation`.

---

## `E002_UNKNOWN_PREDICATE`

**Severity:** error

**Emitted by:** `validateSpecPredicateReferences` (spec and overlay paths) and `validateGraphPredicateReferences` (graph path), against `defaultPredicates` from `workflow/predicates.ts`.

### What triggers it

A `spec.transitions[*].condition`, a `spec.blocks.conditional[*].when`, or a `graph.transitions[*].condition` names a predicate that is not registered. Typical causes: misspelled predicate name, predicate removed from the registry without updating specs, overlay that injects a new predicate without adding its implementation.

The compile-time `satisfies Record<PredicateName, Predicate>` clause in `workflow/predicates.ts` catches the reverse case (registered name not referenced in any spec); E002 catches the forward case that only surfaces for specs loaded dynamically from disk.

### Example diagnostic

```
{
  "code": "E002_UNKNOWN_PREDICATE",
  "severity": "error",
  "message": "transition -> plan references unknown predicate \"evalIdeatonEnabled\"",
  "location": {
    "file": "/repo/packages/cli/src/specs/ideation/spec.json",
    "pointer": "/transitions/1/condition"
  }
}
```

### How to fix

Check the predicate name at the pointer against `defaultPredicates` in `packages/cli/src/workflow/predicates.ts`. If the name is a typo, correct it. If it names a new predicate, add the implementation to the registry (and re-run `bun run gen:predicates`; `predicates.generated.ts` is regenerated from spec references). If the predicate should be retired, remove the reference from the spec.

---

## `E003_INVALID_GRAPH`

**Severity:** error

**Emitted by:** `analyzeGraph` plus per-edge structural checks run over `specs/index.json`.

### What triggers it

Five graph-level defects all share this code:

- **Dead step** — a step in `steps[]` has no outgoing transitions and is not listed as terminal.
- **Unreachable step** — a step in `steps[]` cannot be reached from `entry` by walking transitions (feedback edges are included in the reachability walk).
- **Cycle** — a strongly-connected component of more than one node, or a self-loop, formed by *non-feedback* transitions. Feedback loops (evaluation revise, user skip) are expected and do not trigger this.
- **Duplicate step id** — two entries in `steps[]` share the same `id`, which would make `getStepById` ambiguous.
- **Unresolved target** — a transition's `to` or `from` points at a step that is neither in `steps[]` nor a known lifecycle sink (`done`, `error`, `idle`).

### Example diagnostic

```
{
  "code": "E003_INVALID_GRAPH",
  "severity": "error",
  "message": "transition plan → nonexistent_step targets an unknown step (not in steps[] and not a lifecycle sink)",
  "location": {
    "file": "/repo/packages/cli/src/specs/index.json",
    "pointer": "/transitions/7/to"
  }
}
```

### How to fix

For dead steps, either add an outgoing transition or list the step in `terminal[]`. For unreachable steps, add an incoming transition or remove the step if it is no longer used. For cycles, mark the intended loop edges with `"feedback": true` — only undocumented non-feedback cycles are defects. For unresolved targets, add the missing step to `steps[]` or correct the `to`/`from` value to name an existing step or lifecycle sink.

---

## `E004_MISSING_SPEC`

**Severity:** error

**Emitted by:** per-step spec resolution, for every unique file path referenced from `specs/index.json`'s `steps[*].spec`.

### What triggers it

`specs/index.json` names a `spec` path that does not exist on disk (`ENOENT`) or cannot be read (permission, I/O error). Since the `loadGraph` loader is tolerant of missing files by design (warning-only), this validator upgrades the condition to a hard error at the command surface.

### Example diagnostic

```
{
  "code": "E004_MISSING_SPEC",
  "severity": "error",
  "message": "graph step \"plan\" references missing spec file plan/spec.json",
  "location": {
    "file": "/repo/packages/cli/src/specs/plan/spec.json",
    "pointer": null
  }
}
```

### How to fix

Create the missing `spec.json` at the path named in `steps[n].spec`, or remove the step entry from `steps[]` if the step was retired. If the file exists but the path is wrong, correct the relative path in `index.json` (paths resolve relative to the `index.json` file's directory).

---

## `E005_INVALID_OVERLAY`

**Severity:** error

**Emitted by:** overlay loading (`validateOverlay`) and overlay application (`applyOverlay`) for every `*.overlay.json` next to a step's `spec.json`.

### What triggers it

An overlay file is malformed or structurally invalid: not valid JSON, an unknown top-level field (common typo: `ops` instead of `$ops`), a `$ops` entry with an unrecognized `op` kind, an op whose `path` addresses an array index (not supported), an op whose `path` does not exist in the base spec, or the final post-merge spec that still fails `validateStepSpec`.

### Example diagnostic

```
{
  "code": "E005_INVALID_OVERLAY",
  "severity": "error",
  "message": "overlay has unknown top-level field 'ops' (did you mean '$ops'?)",
  "location": {
    "file": "/repo/packages/cli/src/specs/ideation/discussing.overlay.json",
    "pointer": null
  }
}
```

### How to fix

Read the `overlay.ts` header for the supported surface: deep-merge on `meta` / `transitions` / `delegation` / `tokenBudget` / `blocks`, plus `$ops` for `append` / `prepend` / `remove` / `replace`. Correct the offending field or op. If the merge succeeds structurally but the merged spec fails validation, apply the fix that `E001_INVALID_SCHEMA` would suggest but in the overlay instead of the base spec.

---

## `E006_UNKNOWN_SUBSTATE`

**Severity:** error

**Emitted by:** per-overlay filename check, scoped to overlays next to a spec that declares `meta.substates`.

### What triggers it

An overlay filename implies a substate name (the `{substate}` in `{substate}.overlay.json`) that does not appear in the base spec's `meta.substates` array. The overlay engine keys overlays by substate, so a substate that the spec does not declare can never be selected at runtime — the overlay is dead code.

### Example diagnostic

```
{
  "code": "E006_UNKNOWN_SUBSTATE",
  "severity": "error",
  "message": "overlay filename \"pondering.overlay.json\" implies substate \"pondering\" which is not listed in spec.meta.substates (declared: discussing, researching)",
  "location": {
    "file": "/repo/packages/cli/src/specs/ideation/pondering.overlay.json",
    "pointer": null
  }
}
```

### How to fix

If the substate is genuine, add its name to the spec's `meta.substates` array AND to `workflow/state.ts`'s substate union. If the overlay filename is a typo, rename it to match a declared substate. If the overlay is truly obsolete, delete the file.

---

## `E007_ORPHAN_SUBSTATE`

**Severity:** warning

**Emitted by:** per-spec substate audit, once per entry in `meta.substates` that has no matching overlay file.

### What triggers it

A spec declares a substate in `meta.substates` but no `{substate}.overlay.json` file exists next to it. The runtime engine will select the base spec unchanged when the workflow enters that substate — sometimes intentional, but worth flagging because an authored substate usually expects a corresponding overlay. This is the only non-error-severity code and does not change the exit code on its own.

### Example diagnostic

```
{
  "code": "E007_ORPHAN_SUBSTATE",
  "severity": "warning",
  "message": "spec.meta.substates lists \"researching\" but no matching overlay file \"researching.overlay.json\" exists",
  "location": {
    "file": "/repo/packages/cli/src/specs/ideation/spec.json",
    "pointer": "/meta/substates/1"
  }
}
```

### How to fix

Either create the missing overlay file to refine the compiled prompt for that substate, or remove the entry from `meta.substates` if the substate no longer applies. If the substate intentionally reuses the base spec unchanged, this warning can be suppressed at the consumer (CI can treat warnings as non-blocking); the diagnostic is advisory by design.

---

## `E008_DUPLICATE_REGISTRATION`

**Severity:** error

**Emitted by:** predicate-registry defensive check, run against `PREDICATE_NAMES` from `workflow/predicates.generated.ts`.

### What triggers it

The generated predicate-name list contains the same name twice. The codegen script deduplicates by construction and the `satisfies Record<PredicateName, Predicate>` clause forces single-entry registration in the TypeScript registry, so the usual authoring path cannot hit this. The code exists as a safety net for hand-crafted registries, post-codegen edits, or merge conflicts that land a duplicated entry in `predicates.generated.ts` before the next `bun run gen:predicates` overwrites it.

### Example diagnostic

```
{
  "code": "E008_DUPLICATE_REGISTRATION",
  "severity": "error",
  "message": "predicate name \"evalIdeationEnabled\" is registered more than once",
  "location": {
    "file": "/repo/packages/cli/src/workflow/predicates.generated.ts",
    "pointer": null
  }
}
```

### How to fix

Regenerate `predicates.generated.ts` by running `bun run gen:predicates` from `packages/cli/`. The regeneration is idempotent and produces a deduplicated list. If the duplicate persists after regeneration, inspect `scripts/gen-predicate-names.ts` for a logic error; do not hand-edit the generated file.

---

## When to run

- **Pre-commit** — as a local hook on any commit that touches `packages/cli/src/specs/`, `packages/cli/src/workflow/predicates*.ts`, or the overlay engine. Fast enough to run inline (single-digit seconds against the canonical library).
- **CI** — run in the lint job after `bun run typecheck`. The typecheck catches most predicate-registration drift at compile time; `workflow validate` catches the cross-cutting cases that only surface when specs are read from disk.
- **Before shipping a spec change** — especially when editing `specs/index.json`, introducing a new substate, or modifying the predicate registry. The validator's diagnostics let you verify the library still assembles without surprises.

---

## Scope and boundaries

`workflow validate` checks *structural* correctness of the spec library and its references. It does NOT:

- Execute prompts or measure budget allocation — that is the runtime engine's job.
- Validate predicate *behaviour* — predicates are unit-tested independently.
- Check gotchas, skill content, or agent definitions — those have their own validators under `gobbi validate`.
- Run against arbitrary workflow state — the validator inspects static artifacts, not reducer output.

For runtime verification of a running session, see `gobbi workflow status` (PR C). For skill / agent / gotcha structural checks, see `gobbi validate` (existing command).
