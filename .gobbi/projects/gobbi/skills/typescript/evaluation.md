# TypeScript — Idiom Review Frame

Child doc for the evaluator (and the executor's pre-handoff self-check) grading a TypeScript change-set for
**idiom** quality — the TypeScript-specific companion to [`../coding/evaluation.md`](../coding/evaluation.md).
That frame grades the language-agnostic **property** of good code; this one grades whether the property is
expressed in idiomatic, maximal-strict TypeScript. A change can satisfy a property yet read as loose TypeScript
(an `as` cast standing in for a runtime check, a floating promise, a non-erasable `enum`), or read as fluent
TypeScript yet fail a property, so both frames are read and each perspective is graded against both — `coding`
grades the property, `typescript` its TypeScript expression.

This frame does not restate the parent — it POINTS: the good/bad/adversarial cases live in
[`scenarios.md`](scenarios.md) (`TS-SCENARIO-*`), the binary checks in [`checklists.md`](checklists.md)
(`TS-CHECK-*`), and the rules and principles they exercise live in [`SKILL.md`](SKILL.md). This file owns the
seven idiom lenses, the case/check selection procedure, the recommended verifications, the perspective
anti-patterns, the Overall anchors, the preserve list, and the rule-key legend. It adds no evaluator artifact:
each system still writes exactly **nine** outputs — seven perspective files, `overall.md`, and the copied phase
`checklist.md`. It loads through the parent's Procedure step P2 router, applies at Procedure step P8, grades at
the TypeScript 5.9 floor, and is tool-agnostic.

---

## Rule-key legend — the single crosswalk

Every `scenarios.md` case and `checklists.md` item names its source by `H1`–`H13` (a `SKILL.md` Rule), `P1`–`P7`
(a `SKILL.md` Principle), or `Procedure P1`–`Procedure P8` (a `SKILL.md` Procedure step), and resolves here to the
verbatim opening clause of the `SKILL.md` rule, principle, or step it names — the **sole crosswalk**, so a rule
change propagates through one legend, not three copies. Every "Resolves to" clause below is a live substring of
`SKILL.md`; edit this legend in the same change that edits the rule text.

**Disambiguation:** `P{n}` = a `SKILL.md` Principle (the `## Principles` blockquotes); `Procedure P{n}` = a
`SKILL.md` Procedure step (the `## Procedure` `P1`–`P8`). A bare `P{n}` never means a Procedure step — the
Procedure keys always carry the word `Procedure`.

### Rules (`H{n}` — Must-Follow `H1`–`H8`, Must-Not-Follow `H9`–`H13`)

- `H1` — Resolves to "MUST compile under a maximal-strict `tsconfig`" — the maximal-strict flag base.
- `H2` — Resolves to "MUST use ESM with `verbatimModuleSyntax`" — deterministic type-only vs value erasure.
- `H3` — Resolves to "MUST pick the import extension by consumption mode" — `.js` emit vs `.ts` strip, never mixed.
- `H4` — Resolves to "MUST validate untrusted boundary data before use" — narrow `unknown` before logic reads it.
- `H5` — Resolves to "MUST handle every promise" — await, `void`, or `.catch`; no invisible rejection.
- `H6` — Resolves to "MUST throw only `Error` subclasses and catch as `unknown`" — narrow before use, chain `cause`.
- `H7` — Resolves to "MUST keep syntax erasable" — union or `as const` over `enum` / `namespace` / param-property.
- `H8` — Resolves to "MUST make every taught `ts` example type-check" — a taught example is a checkable fact.
- `H9` — Resolves to "NEVER use `any`" — it disables the checker and spreads by assignment.
- `H10` — Resolves to "NEVER assert with `as` to silence an error" — annotate or `satisfies` instead.
- `H11` — Resolves to "NEVER rely on an `enum` for a closed set" — a discriminated union or `as const` object.
- `H12` — Resolves to "NEVER ship dual ESM + CJS from one `verbatimModuleSyntax` source" — publish ESM-only.
- `H13` — Resolves to "NEVER leave a `Promise` un-awaited" — fire-and-forget loses the rejection.

### Principles (`P{n}` — the seven `## Principles`)

- `P1` — Resolves to "Study the TypeScript contract and neighboring code before design." — the tsconfig in force.
- `P2` — Resolves to "Design the TypeScript surface with the user, from references." — the exported `.d.ts` is the contract.
- `P3` — Resolves to "Model with the type system: make illegal states unrepresentable." — prove invariants at build time.
- `P4` — Resolves to "Ban `any`; quarantine `unknown` at the boundary." — validation is a separate runtime act.
- `P5` — Resolves to "Make async and resource lifetime explicit; never float a promise." — cancellation and scoped disposal.
- `P6` — Resolves to "Choose the failure shape: throw for the exceptional, return a typed result for the expected." — model the expected miss.
- `P7` — Resolves to "Type-erase cleanly: keep the runtime honest and the build strict." — the strict `tsc` pass is the only check.

### Procedure steps (`Procedure P{n}` — cited where a check grades operation, not a single rule)

- `Procedure P1` — Resolves to "Study and lock the task and the TypeScript contract" — scope and contract first.
- `Procedure P2` — Resolves to "Load the child docs for the forks in play" — read the runtime-delta child before the boundary.
- `Procedure P5` — Resolves to "Build the typed skeleton first" — signatures type-check green before any body.
- `Procedure P6` — Resolves to "Grow in minimal verified slices" — per-slice evidence, the whole affected set in lockstep.
- `Procedure P7` — Resolves to "Verify the whole change" — the fixed self-failing gate order.

---

## Selecting cases and checks

Run this after the evaluation Stage 0 target read and before locking the Stage 1 Frames.

1. **Load all three** — this file, [`scenarios.md`](scenarios.md), and [`checklists.md`](checklists.md), plus
   [`../coding/evaluation.md`](../coding/evaluation.md) for the independent language-agnostic axis.
2. **Map the diff to its TypeScript surfaces** — the tsconfig flag set and module system; trust boundaries;
   promises, cancellation, and resource lifetimes; the exported types and public `.d.ts`; the failure shape;
   erasable syntax; the target-runtime boundary; and the implementation history.
3. **Select the activated cases and checks.** Take every applicable `TS-SCENARIO-*` and its listed `TS-CHECK-*`
   IDs, plus any check whose `H{n}` / `P{n}` / `Procedure P{n}` applies directly with no close seed match. Record
   a specific `n/a: {reason}` for an inapplicable hard check the surface could plausibly activate — never omit it
   silently.
4. **Stage, do not copy prose.** Put the selected `TS-CHECK-*` items into the copied phase checklist under exactly
   `## Stage 1 Additions`, keeping their IDs and wording from `checklists.md` and editing neither source. Every
   evaluation still walks all seven perspectives — one the change does not exercise is still walked and may record
   zero findings. The triad adds no tenth output: findings stay in the seven perspective files + `overall.md`, and
   the filled `checklist.md` stays the coverage register.
5. **Demand bottom-up evidence for the operation checks.** One final green `tsc` proves only final state; require
   ordered evidence of both checkpoints — a typed skeleton that imports and type-checks green before behavior
   (`TS-CHECK-14`, `TS-SCENARIO-08`) and focused verification after each slice (`TS-CHECK-15`). First evidence
   arriving only after a whole-feature pass fails the bottom-up check.

---

## Perspectives

Each lens lists its **Activated** case/check IDs and its anti-patterns; the recommended verifications follow in
one consolidated section.

### Project

**Lens**: Does the TypeScript approach fit the **declared tsconfig, artifact type, and target runtime** — no
loosened strict flag, no import-extension mode the runtime cannot resolve, no silent narrowing to one runtime or
the checkout?

**Activated**: `TS-SCENARIO-05`, `-08`, `-10` · `TS-CHECK-01`, `-03`, `-18`, `-19`.

| Anti-pattern | Correction |
|---|---|
| **A loosened strict flag** | Compile under the maximal-strict base; a dropped `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes` hides the defect the flag exists to catch |
| **One runtime assumed everywhere** | Read the target-runtime delta first; a `.ts` specifier or a `node:` builtin does not resolve the same across Node, Bun, Deno, and the browser |
| **Verified from the checkout** | Validate the built package, not only the source tree; a `.d.ts` or `exports` break shows only from the artifact |

### Structure

**Lens**: Are the **modules, exported types, unions, and resource lifetimes** idiomatic — illegal states
unrepresentable, a deep type surface, earned generics, owned disposal, and erasable structure?

**Activated**: `TS-SCENARIO-02`, `-06`, `-07` · `TS-CHECK-02`, `-09`, `-12`, `-13`, `-14`, `-15`.

| Anti-pattern | Correction |
|---|---|
| **A representable illegal state** | Model with a discriminated union so the wrong combination cannot be constructed, not a bag of optional fields validated after the fact |
| **A generic for one call site** | Add a type parameter only when it links an input to an output across many types; a single-use generic reads worse than the concrete type |
| **A `default` branch that swallows a new variant** | End the `switch` with a `never` exhaustiveness check so a new case is a compile error, not a silent fall-through |

### Performance

**Lens**: Is the change **efficient enough in idiomatic TypeScript** — bounded async fan-out, released resources,
and compiler cost kept down (project references, `skipLibCheck`, `incremental`) without trading the clear form for
an unmeasured gain?

**Activated**: `TS-SCENARIO-02` · `TS-CHECK-07`, `-14`.

| Anti-pattern | Correction |
|---|---|
| **Unbounded eager fan-out** | Bound concurrent task creation and retained memory; an unbounded `Promise.all` over a large input blows up under load |
| **A leaked handle or connection** | Bind release to scope with `using` / `await using`; an unreleased resource is a slow leak the happy-path test never sees |
| **Type-level cleverness that stalls the build** | Deep conditional-type recursion has a compile cost; keep the type as simple as the invariant needs |

### Aesthetics

**Lens**: Does the change read like **one disciplined TypeScript codebase** — deterministic formatting, convention
casing, `import type` ordering, TSDoc that adds what the signature cannot, and idioms that clarify rather than
compress?

**Activated**: `TS-SCENARIO-04`, `-07` · `TS-CHECK-06`, `-13`.

| Anti-pattern | Correction |
|---|---|
| **An `as`-cast forest** | Reach for an annotation (`: T`) or `satisfies T`; a chain of assertions is the checker being switched off line by line |
| **A dense conditional type nobody can read** | Name the intermediate types; a one-line mapped-and-conditional type hides its own contract |
| **An `enum` where a union reads clearer** | Model the closed set as a discriminated union or `as const` object — erasable, sound, and self-documenting |

### Usage

**Lens**: For the **next caller** — can they use each changed unit from its signature, exported types, and `.d.ts`
alone, with the failure shape, ownership, and async-vs-sync surface explicit?

**Activated**: `TS-SCENARIO-03`, `-07` · `TS-CHECK-08`, `-13`, `-19`.

| Anti-pattern | Correction |
|---|---|
| **An `any` in a public signature** | Narrow to a precise type at the boundary; `any` erases the contract and spreads to every caller |
| **A hidden throw the signature does not reveal** | Model an expected failure as a typed result in the return type, where the compiler forces the caller to handle it |
| **A stamp-coupled input type** | Demand the specific values the unit reads, not a whole aggregate the caller must assemble and decode |

### Consistency

**Lens**: Did **everything that should change together, change together** — callers, tests, the emitted `.d.ts`,
co-located docs, and the tsconfig — with one import-extension mode and one module system across the tree?

**Activated**: `TS-SCENARIO-05`, `-08` · `TS-CHECK-02`, `-03`, `-16`, `-19`.

| Anti-pattern | Correction |
|---|---|
| **A stale `.d.ts` after a type change** | Regenerate and re-check the declaration surface in the same change; a drifted `.d.ts` breaks the consumer, not the author |
| **Mixed import-extension modes** | Keep one mode per source tree — `.js` for emit or `.ts` for strip, never both |
| **A tsconfig flag that disagrees between surfaces** | Make the base, the overlay, and the runtime tsconfig agree; a flag on in one and off in another breaks on the strict path |

### Risk

**Lens**: Which **TypeScript footgun** makes this change fail at runtime, leak a resource, or lie to the compiler —
an `as` over a real check, a floating rejection, a non-erasable construct, or a caught non-`Error`?

**Activated**: `TS-SCENARIO-01`, `-02`, `-03`, `-04`, `-09` · `TS-CHECK-04`, `-05`, `-06`, `-07`, `-08`, `-09`,
`-10`, `-11`, `-17`.

| Anti-pattern | Correction |
|---|---|
| **`as` as input validation** | An annotation states shape but never checks it; parse untrusted `unknown` with a guard or schema before use |
| **A floating promise** | Await, `void`, or `.catch` every promise; an un-awaited rejection surfaces far from its cause with no signature warning |
| **A non-erasable construct in a stripped runtime** | Keep syntax erasable; an `enum` or param-property is a syntax error where types are stripped, not compiled |

---

## Recommended verifications

Capabilities are binding; tool names are examples. First run the generic ordered pipeline the scope activates —
format → lint → type-check → focused tests → full tests → type-level tests → build — owned by `SKILL.md` Procedure
step P7. Then add the TypeScript-idiom-specific verifications below.

| Capability | Confirms |
|---|---|
| Type-check under the maximal-strict base; try a loosened flag and watch it stop catching | Strict-flag honesty (`H1`); no reliance on a dropped flag |
| Read every import for `import type` vs value and its extension against the consumption mode | Deterministic erasure (`H2`) and one import-extension mode (`H3`) |
| Trace each untrusted boundary value from entry to first use; confirm a guard or parser sits before it, not an `as` | Boundary validation, not annotation-as-validation (`H4`, `P4`) |
| `grep` the diff for `any`, `as`, `@ts-ignore`, and `!` non-null assertions; check each `as` for a prior runtime narrow | No checker-disabling escape hatch (`H9`, `H10`) |
| `grep` for un-awaited async calls and for resource acquisition without `using` / `await using` / `finally` | Handled promises and scope-bound disposal (`H5`, `H13`, `P5`) |
| Read each `throw` for an `Error` subclass with `cause` and each `catch` for `unknown` + a narrow; read the return type for an expected-failure result | Failure-shape idiom (`H6`, `P6`) |
| `grep` for `enum`, `namespace`, and constructor parameter-properties; confirm each closed set is a union or `as const` | Erasable syntax under a type-stripping runtime (`H7`, `H11`, `P7`) |
| Add a variant to each discriminated union and confirm the build fails until it is handled | A `never` exhaustiveness check, not a swallowing `default` (`P3`) |
| Simulate a first-time caller from each exported signature and `.d.ts` alone; check for an `any`, a hidden throw, or a stamp-coupled input | Caller-usable contract (`P2`) |
| Confirm the typed skeleton type-checks green before bodies; review history for per-slice evidence | Bottom-up construction (`Procedure P5`, `Procedure P6`); rejects a final-green-only claim |
| Extract each fenced `ts` example and compile it under the examples baseline, honoring `@ts-expect-error` | Taught-example fidelity (`H8`) |
| Build the package and run `publint` + `arethetypeswrong` on the artifact, not the checkout | ESM-only `exports` and `.d.ts` resolution across consumers (`H12`) |

---

## Overall (Stage 3) — TypeScript-specific anchors

Step back from the per-perspective passes and check the change-set against the four TypeScript failure modes, then
against what exists only **between** lenses — a clean type surface hiding an un-validated boundary, a bounded
fan-out losing cancellation, or a final green `tsc` hiding whole-feature-first construction.

| Mode | What it looks like in a TypeScript change-set |
|---|---|
| **Checker switched off** | An `any`, an `as`, a `@ts-ignore`, or a `!` that disables the one place a type is ever checked, so the wrong shape reaches runtime unproven |
| **Invisible async** | A floating promise, a swallowed rejection, an un-cancelled long operation, or a resource released only on the happy path — none of which the signature reveals |
| **Runtime-erasure surprise** | Syntax that compiles but does not strip (`enum`, `namespace`, param-property), or an import extension that resolves under `tsc` but not under the target runtime |
| **Green-`tsc` illusion** | Passes one final strict compile while the `.d.ts` resolves wrong for a consumer, the skeleton-first history is absent, or a second runtime breaks on resolution or a built-in |

**Preserve-list anchors specific to TypeScript idiom** — what a strong change already got right, which REVISE
iterations must not undo: illegal-state-proof discriminated unions with `never` exhaustiveness; precise exported
types and a clean `.d.ts`; `unknown`-at-the-boundary narrowed by a guard or parser; awaited promises with explicit
cancellation and scoped disposal; erasable syntax under a strict `tsc`; typed-skeleton and per-slice evidence; and
ESM-only packaging validated from the built artifact. If none apply, state `none — every TypeScript-idiom surface
needs revision`.
